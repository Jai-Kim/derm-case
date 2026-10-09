// POST /api/analyze: the only server endpoint. It does ONE fixed job.
// The browser sends a photo plus a few case fields. The server owns the model, the prompt, the token limit and the tools,
// validates every field, and returns only the model's text. It is not a general relay to the Anthropic API.
//
// The model call is streamed. A browser that sends `Accept: application/x-ndjson` gets one JSON object per line:
//   {t:'ready'}  {t:'hb'}  {t:'search',n,q}  {t:'found',n}  {t:'w',n}  then {t:'done',content,stop_reason} or {t:'error',code}
// so the loading screen can show real progress. Any other caller gets the same single JSON body as before.
'use strict';

const { validate } = require('./_lib/validate');
const { sameOrigin, clientIp, makeLimiter } = require('./_lib/guard');
const { systemPrompt, userText, MODEL, MAX_TOKENS, WEB_SEARCH_MAX_USES } = require('./_lib/prompt');
const { sseEvents, makeReducer } = require('./_lib/stream');
const usage = require('./_lib/usage');

// The whole model call, web searches included. Must stay below maxDuration (120 s in vercel.json).
const UPSTREAM_TIMEOUT_MS = 100000;
const HEARTBEAT_MS = 8000;
const MAX_BODY_BYTES = 4200000;
// Per warm instance only. A burst filter, not a guarantee. The Vercel firewall rule is the real per-IP limit.
const allow = makeLimiter(12, 10 * 60 * 1000);

function fail(res, status, code, extra) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json({ error: Object.assign({ code }, extra || {}) });
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return fail(res, 405, 'method_not_allowed'); }
  if (!sameOrigin(req)) return fail(res, 403, 'forbidden_origin');
  if (!/^application\/json\b/i.test(String(req.headers['content-type'] || ''))) return fail(res, 415, 'unsupported_media_type');
  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) return fail(res, 413, 'too_large');
  if (!allow(clientIp(req))) { res.setHeader('Retry-After', '120'); return fail(res, 429, 'rate_limited'); }

  let body;
  try { body = req.body; } catch (e) { return fail(res, 400, 'invalid_request', { detail: 'json' }); }
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { return fail(res, 400, 'invalid_request', { detail: 'json' }); } }
  const v = validate(body);
  if (!v.ok) return fail(res, v.status, v.code, { detail: v.detail });
  const { lang, images, c } = v.value;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fail(res, 503, 'not_configured');
  const wantsStream = /application\/x-ndjson/i.test(String(req.headers.accept || ''));

  const t0 = Date.now();
  const g = await usage.gate(lang);
  if (!g.allowed) { res.setHeader('Retry-After', '3600'); return fail(res, 429, 'daily_cap'); }

  const ac = new AbortController();
  let timedOut = false, clientGone = false, finished = false, heartbeat = null;
  const timer = setTimeout(() => { timedOut = true; ac.abort(); }, UPSTREAM_TIMEOUT_MS);
  // If the browser goes away (Cancel, closed tab), stop paying for the answer.
  if (typeof res.on === 'function') res.on('close', () => { if (!finished) { clientGone = true; ac.abort(); } });
  const cleanup = () => { clearTimeout(timer); if (heartbeat) clearInterval(heartbeat); heartbeat = null; };

  let upstream;
  try {
    upstream = await globalThis.fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: ac.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        system: systemPrompt(lang),
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: WEB_SEARCH_MAX_USES }],
        messages: [{
          role: 'user',
          content: images.map(im => ({ type: 'image', source: { type: 'base64', media_type: im.mime, data: im.data } }))
            .concat([{ type: 'text', text: userText(c) }])
        }]
      })
    });
  } catch (e) {
    cleanup();
    finished = true;
    if (clientGone) return;
    const slow = timedOut || (e && e.name === 'AbortError');   // the only abort besides a client leaving is our own timer
    if (slow) await usage.hit('analyze_timeout', lang, Date.now() - t0);   // may have cost money, so the slot stays used
    else { await usage.hit('analyze_error', lang, Date.now() - t0); await usage.refund(lang); }
    return fail(res, slow ? 504 : 502, slow ? 'timeout' : 'upstream_error');
  }

  if (!upstream.ok) {
    cleanup();
    finished = true;
    let data = null;
    try { data = await upstream.json(); } catch (e) { /* body is not JSON */ }
    // Log the error type only, never any request content.
    console.error('[analyze] upstream', upstream.status, data && data.error && data.error.type);
    await usage.hit('analyze_error', lang, Date.now() - t0);
    await usage.refund(lang);   // the model did no billable work, so the slot goes back to the day's cap
    const busy = upstream.status === 429 || upstream.status === 529 || upstream.status === 503;
    return fail(res, busy ? 503 : 502, busy ? 'busy' : 'upstream_error');
  }

  // From here the model is working. A streaming browser is told so immediately and then kept posted.
  const send = obj => { if (wantsStream && !finished && !clientGone) { try { res.write(JSON.stringify(obj) + '\n'); } catch (e) { /* connection gone */ } } };
  if (wantsStream) {
    res.status(200);
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();
    send({ t: 'ready' });
    heartbeat = setInterval(() => send({ t: 'hb' }), HEARTBEAT_MS);
    if (heartbeat.unref) heartbeat.unref();
  }

  const reducer = makeReducer(send);
  let readError = null;
  try {
    for await (const ev of sseEvents(upstream.body)) reducer.feed(ev);
  } catch (e) { readError = e; }
  cleanup();
  const out = reducer.result();
  const ms = Date.now() - t0;

  if (clientGone) return;   // the browser left; nothing to answer. The slot stays used (the model may have run).

  if (readError || out.error || !out.content.length) {
    finished = true;
    let code, status;
    if (timedOut || (readError && readError.name === 'AbortError')) { code = 'timeout'; status = 504; await usage.hit('analyze_timeout', lang, ms); }
    else {
      code = out.error === 'busy' ? 'busy' : 'upstream_error'; status = code === 'busy' ? 503 : 502;
      console.error('[analyze] stream', out.error || (readError && readError.name) || 'empty');
      await usage.hit('analyze_error', lang, ms);
      if (!out.chars && !out.searches) await usage.refund(lang);   // nothing billable happened
    }
    if (wantsStream) { try { res.write(JSON.stringify({ t: 'error', code }) + '\n'); } catch (e) { /* gone */ } return res.end(); }
    return fail(res, status, code);
  }

  // Return the model's text and nothing else (no tool traffic, no request ids, no usage figures).
  const stop = out.stop_reason;
  const text = out.content.map(b => b.text).join('');
  const evt = stop === 'max_tokens' ? 'analyze_truncated' : /"relevant"\s*:\s*false/.test(text) ? 'analyze_rejected' : 'analyze_ok';
  if (wantsStream) {
    send({ t: 'done', content: out.content, stop_reason: stop });
    finished = true;
    await usage.hit(evt, lang, ms);
    return res.end();
  }
  finished = true;
  await usage.hit(evt, lang, ms);
  return res.status(200).json({ content: out.content, stop_reason: stop });
}

module.exports = handler;
module.exports.config = { maxDuration: 120 };
