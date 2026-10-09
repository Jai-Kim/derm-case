// Reads Anthropic's streamed answer and boils it down to what the browser may see.
//   sseEvents(body)  turns the upstream byte stream into parsed JSON events.
//   makeReducer(emit) keeps the text blocks, the stop reason and any error, and calls emit() with a small set of
//                    progress events: { t:'search', n, q }, { t:'found', n }, { t:'w', n }.
// Nothing from tool traffic is passed on except a cleaned-up search query and a count of results.
'use strict';

const MAX_EVENT_CHARS = 1 << 20;     // one SSE event, far larger than anything real
const MAX_TEXT_CHARS = 80000;        // 3000 output tokens is roughly 12000 characters
const MAX_TOOL_JSON_CHARS = 4000;
const MAX_QUERY_CHARS = 110;
// Everything that is not a visible character: controls, every Unicode "format" character (zero-width, bidi marks and isolates,
// soft hyphen, the invisible tag block used to hide text), line and paragraph separators, lone surrogates, variation-selector supplement.
// The only stop reasons the browser may be told about. Anything else from upstream is dropped (stays null).
const STOP_REASONS = ['end_turn', 'max_tokens', 'stop_sequence', 'tool_use', 'pause_turn', 'refusal', 'model_context_window_exceeded'];
const QUERY_INVISIBLE = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}\p{Cs}\u{E0100}-\u{E01EF}]/gu;

// body: a web ReadableStream (what fetch returns) or any async iterable of Uint8Array/Buffer/string.
async function* sseEvents(body) {
  const dec = new TextDecoder('utf-8');
  let buf = '';
  function* drain(final) {
    // events are separated by a blank line; accept \n\n, \r\n\r\n and \r\r
    let m;
    while ((m = /\r\n\r\n|\n\n|\r\r/.exec(buf))) {
      const block = buf.slice(0, m.index);
      buf = buf.slice(m.index + m[0].length);
      const ev = parseBlock(block);
      if (ev) yield ev;
    }
    if (final && buf.trim()) { const ev = parseBlock(buf); buf = ''; if (ev) yield ev; }
    if (buf.length > MAX_EVENT_CHARS) throw new Error('event too large');
  }
  if (body && typeof body.getReader === 'function') {
    const reader = body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += typeof value === 'string' ? value : dec.decode(value, { stream: true });
        yield* drain(false);
      }
    } finally { try { reader.releaseLock(); } catch (e) { /* already released */ } }
  } else if (body && body[Symbol.asyncIterator]) {
    for await (const value of body) {
      buf += typeof value === 'string' ? value : dec.decode(value, { stream: true });
      yield* drain(false);
    }
  } else {
    throw new Error('no body');
  }
  buf += dec.decode();
  yield* drain(true);
}

function parseBlock(block) {
  const data = [];
  block.split(/\r\n|\n|\r/).forEach(line => {
    if (line.charAt(0) === ':') return;                       // comment / keep-alive
    if (/^data:/.test(line)) data.push(line.slice(5).replace(/^ /, ''));
  });
  if (!data.length) return null;
  try { const ev = JSON.parse(data.join('\n')); return ev && typeof ev === 'object' ? ev : null; } catch (e) { return null; }
}

// A search query is model-written text, so it is cut down to plain printable characters before it goes anywhere.
function cleanQuery(q) {
  if (typeof q !== 'string') return '';
  return q
    .replace(QUERY_INVISIBLE, ' ')
    .replace(/[<>"`\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_CHARS);
}

function makeReducer(emit) {
  const blocks = new Map();          // index -> { kind:'text'|'search'|'other', text, json }
  let stop = null, err = null, searches = 0, chars = 0, lastW = -1000;
  function onStart(ev) {
    const cb = ev.content_block || {};
    if (cb.type === 'text') {
      blocks.set(ev.index, { kind: 'text', text: '' });
      if (typeof cb.text === 'string' && cb.text) append(blocks.get(ev.index), cb.text);
    } else if (cb.type === 'server_tool_use' && cb.name === 'web_search') {
      blocks.set(ev.index, { kind: 'search', json: '' });
    } else if (cb.type === 'web_search_tool_result') {
      blocks.set(ev.index, { kind: 'other' });
      const n = Array.isArray(cb.content) ? Math.min(cb.content.length, 20) : 0;
      emit({ t: 'found', n });
    } else {
      blocks.set(ev.index, { kind: 'other' });
    }
  }
  function append(b, s) {
    if (chars >= MAX_TEXT_CHARS) return;
    s = s.slice(0, MAX_TEXT_CHARS - chars);
    b.text += s; chars += s.length;
    if (chars - lastW >= 120) { lastW = chars; emit({ t: 'w', n: chars }); }
  }
  function onDelta(ev) {
    const b = blocks.get(ev.index), d = ev.delta || {};
    if (!b) return;
    if (b.kind === 'text' && d.type === 'text_delta' && typeof d.text === 'string') append(b, d.text);
    else if (b.kind === 'search' && d.type === 'input_json_delta' && typeof d.partial_json === 'string' && b.json.length < MAX_TOOL_JSON_CHARS) b.json += d.partial_json;
  }
  function onStop(ev) {
    const b = blocks.get(ev.index);
    if (b && b.kind === 'search') {
      searches++;
      let q = '';
      try { q = cleanQuery(JSON.parse(b.json).query); } catch (e) { /* no usable query */ }
      emit({ t: 'search', n: searches, q });
    }
  }
  return {
    feed(ev) {
      switch (ev && ev.type) {
        case 'content_block_start': return onStart(ev);
        case 'content_block_delta': return onDelta(ev);
        case 'content_block_stop': return onStop(ev);
        case 'message_delta': if (ev.delta && STOP_REASONS.indexOf(ev.delta.stop_reason) >= 0) stop = ev.delta.stop_reason; return;
        case 'error': err = (ev.error && ev.error.type === 'overloaded_error') ? 'busy' : 'upstream_error'; return;
        default: return;
      }
    },
    result() {
      const content = [...blocks.entries()].sort((a, b) => a[0] - b[0])
        .filter(([, b]) => b.kind === 'text' && b.text)
        .map(([, b]) => ({ type: 'text', text: b.text }));
      return { content, stop_reason: stop, error: err, searches, chars };
    }
  };
}

module.exports = { sseEvents, makeReducer, cleanQuery };
