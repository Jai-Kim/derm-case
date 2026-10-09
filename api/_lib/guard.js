// Request guards for /api/analyze: same-origin check and a small per-instance rate limiter.
// These stop browsers on other sites from using visitors to spend the API budget.
// They are NOT authentication. The hard limits are the daily cap, the Vercel firewall rule and the Anthropic spend limit.
'use strict';

function header(req, name) {
  const v = req.headers && req.headers[name];
  return Array.isArray(v) ? v[0] : v;
}

// Browsers always send Origin on a cross-origin or same-origin POST, and Sec-Fetch-Site cannot be set by page script.
function sameOrigin(req) {
  const host = String(header(req, 'host') || '').toLowerCase();
  const origin = header(req, 'origin');
  const sfs = header(req, 'sec-fetch-site');
  if (!host || !origin) return false;
  if (sfs && sfs !== 'same-origin') return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== 'https:' && !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(u.host)) return false;
    return u.host.toLowerCase() === host;
  } catch (e) { return false; }
}

function clientIp(req) {
  const fwd = String(header(req, 'x-forwarded-for') || '').split(',')[0].trim();
  return String(header(req, 'x-real-ip') || fwd || (req.socket && req.socket.remoteAddress) || 'unknown').slice(0, 64);
}

function makeLimiter(max, windowMs, maxKeys) {
  const hits = new Map();
  return function allow(key, now) {
    now = now || Date.now();
    if (hits.size > (maxKeys || 5000)) hits.clear();
    const arr = (hits.get(key) || []).filter(t => now - t < windowMs);
    if (arr.length >= max) { hits.set(key, arr); return false; }
    arr.push(now);
    hits.set(key, arr);
    return true;
  };
}

module.exports = { sameOrigin, clientIp, makeLimiter };
