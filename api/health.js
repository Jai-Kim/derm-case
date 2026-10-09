// GET /api/health: is the service configured? Reveals no secrets and no counts, only on/off states.
// counters: true = usage counting and the daily cap are live; false = the secret is wrong; null = not set up (or Supabase unreachable).
'use strict';
const usage = require('./_lib/usage');

let cached = null, cachedAt = 0;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: { code: 'method_not_allowed' } }); }
  if (!cached || Date.now() - cachedAt > 60000) { cached = { counters: await usage.check() }; cachedAt = Date.now(); }   // one Supabase call a minute at most
  return res.status(200).json({ ok: true, model: !!process.env.ANTHROPIC_API_KEY, counters: cached.counters, cap: usage.cfg().cap });
};

module.exports.config = { maxDuration: 10 };
