// POST /api/analyze: the only server endpoint. It does ONE fixed job.
// The browser sends a photo plus a few case fields. The server owns the model, the prompt, the token limit and the tools,
// validates every field, and returns only the model's text. It is not a general relay to the Anthropic API.
'use strict';

const { validate } = require('./_lib/validate');
const { sameOrigin, clientIp, makeLimiter } = require('./_lib/guard');
const { systemPrompt, userText, MODEL, MAX_TOKENS, WEB_SEARCH_MAX_USES } = require('./_lib/prompt');
const usage = require('./_lib/usage');

const UPSTREAM_TIMEOUT_MS = 55000;
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

  const t0 = Date.now();
  const g = await usage.gate(lang);
  if (!g.allowed) { res.setHeader('Retry-After', '3600'); return fail(res, 429, 'daily_cap'); }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS);
  let upstream, data;
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
        system: systemPrompt(lang),
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: WEB_SEARCH_MAX_USES }],
        messages: [{
          role: 'user',
          content: images.map(im => ({ type: 'image', source: { type: 'base64', media_type: im.mime, data: im.data } }))
            .concat([{ type: 'text', text: userText(c) }])
        }]
      })
    });
    data = await upstream.json();
  } catch (e) {
    clearTimeout(timer);
    const timedOut = e && e.name === 'AbortError';
    await usage.hit(timedOut ? 'analyze_timeout' : 'analyze_error', lang, Date.now() - t0);
    return fail(res, timedOut ? 504 : 502, timedOut ? 'timeout' : 'upstream_error');
  }
  clearTimeout(timer);

  if (!upstream.ok) {
    // Log the error type only, never any request content.
    console.error('[analyze] upstream', upstream.status, data && data.error && data.error.type);
    await usage.hit('analyze_error', lang, Date.now() - t0);
    const busy = upstream.status === 429 || upstream.status === 529 || upstream.status === 503;
    return fail(res, busy ? 503 : 502, busy ? 'busy' : 'upstream_error');
  }

  // Return the model's text and nothing else (no tool traffic, no request ids, no usage figures).
  const content = (Array.isArray(data && data.content) ? data.content : [])
    .filter(b => b && b.type === 'text' && typeof b.text === 'string')
    .map(b => ({ type: 'text', text: b.text }));
  const stop = typeof data.stop_reason === 'string' ? data.stop_reason : null;
  const text = content.map(b => b.text).join('');
  const evt = !text ? 'analyze_error' : stop === 'max_tokens' ? 'analyze_truncated' : /"relevant"\s*:\s*false/.test(text) ? 'analyze_rejected' : 'analyze_ok';
  await usage.hit(evt, lang, Date.now() - t0);
  return res.status(200).json({ content, stop_reason: stop });
}

module.exports = handler;
module.exports.config = { maxDuration: 60 };
