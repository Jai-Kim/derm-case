/* DermCase service worker. Network-first: online you always get the latest deploy;
   offline you get the last good copy, or a friendly offline page. Never touches /api or /_vercel, and never keeps a no-store response. */
const CACHE = 'dc-shell-v1';
const PRECACHE = ['/offline', '/assets/ds.css', '/assets/ds.js', '/assets/darae-ink.svg', '/manifest.webmanifest'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(PRECACHE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (neverMine(url.pathname)) return;
  e.respondWith(networkFirst(req));
});

// Paths this worker must never touch. The path is normalised first, so "//api/x", "/%61pi/x", "/api%2Fx" and "/API/x" count as /api.
function neverMine(path) {
  try { path = decodeURIComponent(path); } catch (err) { return true; }
  path = path.replace(/\/{2,}/g, '/').toLowerCase();
  return path === '/api' || path.indexOf('/api/') === 0 || path.indexOf('/_vercel/') === 0 || path.indexOf('/.well-known/') === 0 || path === '/sw.js';
}

function withTimeout(p, ms) {
  return new Promise(function (res, rej) {
    var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
    p.then(function (v) { clearTimeout(t); res(v); }, function (err) { clearTimeout(t); rej(err); });
  });
}
async function networkFirst(req) {
  var cache = await caches.open(CACHE);
  var nav = req.mode === 'navigate';
  var net = fetch(req);
  try {
    var res = await withTimeout(net, nav ? 5000 : 8000);
    if (res && res.ok && res.type === 'basic' && !res.redirected && !/no-store|private/i.test(res.headers.get('Cache-Control') || '')) cache.put(req, res.clone());   // a response that says no-store is never kept
    return res;
  } catch (err) {
    var hit = await cache.match(req, { ignoreSearch: nav });
    if (hit) return hit;
    try { return await net; } catch (e2) {
      if (nav) { var off = await cache.match('/offline'); if (off) return off; }
      return Response.error();
    }
  }
}
