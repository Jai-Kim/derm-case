// Anonymous usage counters and the daily cap, kept in Supabase behind two functions that only work with a secret.
// Nothing here stores an IP, an ID, a photo or any case text. Only counts per day, event and language, plus total milliseconds.
// Fails open: if the secret is missing or Supabase is down, analyses still run (the Anthropic spend limit is the hard backstop).
'use strict';

// Public values (the same ones the browser uses). Overridable by env.
const DEFAULT_URL = 'https://lecbcrqkxtxcbgmxewov.supabase.co';
const DEFAULT_PUBLISHABLE = 'sb_publishable_bd5W6c_JFchtpjxBInyrzQ_ca8cnxYt';

function cfg() {
  const cap = parseInt(process.env.DAILY_ANALYSIS_CAP, 10);
  return {
    url: (process.env.SUPABASE_URL || DEFAULT_URL).replace(/\/+$/, ''),
    apikey: process.env.SUPABASE_ANON_KEY || DEFAULT_PUBLISHABLE,
    key: process.env.USAGE_KEY || '',
    cap: cap >= 1 && cap <= 100000 ? cap : 150
  };
}

async function rpc(name, args, timeoutMs) {
  const c = cfg();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await globalThis.fetch(c.url + '/rest/v1/rpc/' + name, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json', apikey: c.apikey },
      body: JSON.stringify(args)
    });
  } finally { clearTimeout(timer); }
}

// Counts the start of an analysis and says whether today's cap still has room.
async function gate(lang) {
  const c = cfg();
  if (!c.key) return { allowed: true, tracked: false };
  try {
    const r = await rpc('usage_gate', { p_key: c.key, p_lang: lang, p_cap: c.cap }, 2000);
    if (r.status === 200) { const v = await r.json(); return { allowed: v !== false, tracked: true }; }
    console.warn('[usage] gate status', r.status);
  } catch (e) { console.warn('[usage] gate failed', e && e.name); }
  return { allowed: true, tracked: false };
}

// Records how an analysis ended. Never throws.
async function hit(evt, lang, ms) {
  const c = cfg();
  if (!c.key) return;
  try {
    const r = await rpc('usage_hit', { p_key: c.key, p_evt: evt, p_lang: lang, p_ms: Math.max(0, Math.min(Math.round(ms) || 0, 600000)) }, 1200);
    if (r.status >= 300) console.warn('[usage] hit status', r.status);
  } catch (e) { console.warn('[usage] hit failed', e && e.name); }
}

module.exports = { gate, hit, cfg };
