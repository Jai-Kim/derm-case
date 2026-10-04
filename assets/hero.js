/* DermCase hero: an interactive dermatoscope. A loupe reveals dermoscopic detail
   (dotted vessels, white scale) inside the plaques. An illustration, not a patient. */
(function () {
  var root = document.getElementById('derm');
  if (!root) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var base = document.getElementById('dermBase'), det = document.getElementById('dermDetail');
  var tag = document.getElementById('dermTag'), vis = document.getElementById('heroVis');
  var labels = { a: 'Dotted vessels and white scale', b: 'Uninvolved skin' };
  var S = 0, LR = 0, lastText = '';
  var cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }, hover = false, visible = true, ready = false;
  var BLOBS = [
    { x: .38, y: .40, rx: .20, ry: .15, a: -.3 }, { x: .64, y: .64, rx: .17, ry: .13, a: .4 },
    { x: .72, y: .30, rx: .09, ry: .07, a: 0 },   { x: .30, y: .72, rx: .08, ry: .06, a: .2 }
  ];
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function weight(u, v) {
    var w = 0;
    BLOBS.forEach(function (b) {
      var dx = u - b.x, dy = v - b.y, c = Math.cos(-b.a), s = Math.sin(-b.a);
      var rx = (dx * c - dy * s) / b.rx, ry = (dx * s + dy * c) / b.ry;
      w = Math.max(w, Math.exp(-(rx * rx + ry * ry) * 1.1));
    });
    return w;
  }
  function prep(c) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(S * dpr); c.height = Math.round(S * dpr);
    var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.save(); x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 1.5, 0, Math.PI * 2); x.clip();
    return x;
  }
  function plaques(x, c0, c1, k) {
    BLOBS.forEach(function (b) {
      x.save(); x.translate(b.x * S, b.y * S); x.rotate(b.a); x.scale(b.rx * S * k, b.ry * S * k);
      var g = x.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, c0); g.addColorStop(.55, c1); g.addColorStop(1, 'rgba(190,100,88,0)');
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, 1, 0, Math.PI * 2); x.fill(); x.restore();
    });
  }
  function paintBase() {
    var x = prep(base), r = rng(11), i, u, v, w;
    var g = x.createRadialGradient(S * .5, S * .42, S * .04, S * .5, S * .5, S * .64);
    g.addColorStop(0, '#E8B994'); g.addColorStop(.6, '#D2A27A'); g.addColorStop(1, '#A97650');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    plaques(x, 'rgba(166,62,55,.95)', 'rgba(190,100,88,.72)', 1.55);
    for (i = 0; i < 1100; i++) {
      u = r(); v = r(); w = weight(u, v);
      if (r() < w * .6) { x.fillStyle = 'rgba(250,246,238,' + (.18 + w * .3).toFixed(2) + ')'; x.beginPath(); x.ellipse(u * S, v * S, 1 + r() * 2.2, .7 + r() * 1.4, r() * 3, 0, Math.PI * 2); x.fill(); }
    }
    for (i = 0; i < 5200; i++) { x.fillStyle = r() < .5 ? 'rgba(255,255,255,.05)' : 'rgba(40,20,10,.05)'; x.fillRect(r() * S, r() * S, 1.2, 1.2); }
    x.restore();
    x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 1.5, 0, Math.PI * 2); x.lineWidth = 3; x.strokeStyle = 'rgba(14,16,19,.6)'; x.stroke();
  }
  function paintDetail() {
    var x = prep(det), r = rng(29), i, u, v, w, gx, gy, sp = S / 48;
    x.fillStyle = '#EBCBB4'; x.fillRect(0, 0, S, S);
    plaques(x, 'rgba(214,112,102,.95)', 'rgba(222,134,122,.8)', 1.55);
    x.strokeStyle = 'rgba(120,78,52,.10)'; x.lineWidth = 1;
    for (i = 0; i < 420; i++) { u = r(); v = r(); if (weight(u, v) < .2) { x.beginPath(); x.moveTo(u * S, v * S); x.lineTo(u * S + (r() - .5) * S * .05, v * S + (r() - .5) * S * .05); x.stroke(); } }
    for (gx = 0; gx < S; gx += sp) for (gy = 0; gy < S; gy += sp) {
      u = (gx + (r() - .5) * sp * .6) / S; v = (gy + (r() - .5) * sp * .6) / S; w = weight(u, v);
      if (r() < w * .95) { x.fillStyle = 'rgba(108,20,24,' + (.55 + w * .4).toFixed(2) + ')'; x.beginPath(); x.arc(u * S, v * S, S / 260 * (1 + r() * .9), 0, Math.PI * 2); x.fill(); }
    }
    for (i = 0; i < 300; i++) {
      u = r(); v = r(); w = weight(u, v);
      if (w > .3 && r() < w) { x.fillStyle = 'rgba(255,252,246,' + (.35 + r() * .35).toFixed(2) + ')'; x.beginPath(); x.ellipse(u * S, v * S, S / 90 * (.5 + r()), S / 120 * (.4 + r()), r() * 3, 0, Math.PI * 2); x.fill(); }
    }
    for (i = 0; i < 160; i++) { x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(r() * S, r() * S, 1.4, 1.4); }
    x.restore();
  }
  function place(x, y) {
    root.style.setProperty('--lx', x.toFixed(1) + 'px');
    root.style.setProperty('--ly', y.toFixed(1) + 'px');
    var half = (tag.offsetWidth || 160) / 2;
    root.style.setProperty('--tx', Math.max(half, Math.min(S - half, x)).toFixed(1) + 'px');
    var txt = weight(x / S, y / S) > .45 ? labels.a : labels.b;
    if (txt !== lastText) { tag.textContent = txt; lastText = txt; }
  }
  function idle(t) {
    return {
      x: S * (.5 + .19 * Math.cos(t * .00042) + .05 * Math.cos(t * .0011)),
      y: S * (.5 + .17 * Math.sin(t * .00036) + .04 * Math.sin(t * .0009))
    };
  }
  function clampField(x, y) {
    var dx = x - S / 2, dy = y - S / 2, m = S / 2 - LR * .3, d = Math.hypot(dx, dy);
    if (d > m) { dx *= m / d; dy *= m / d; }
    return { x: S / 2 + dx, y: S / 2 + dy };
  }
  function layout() {
    S = Math.round(root.clientWidth); if (!S) return;
    LR = Math.round(S * .2); root.style.setProperty('--lr', LR + 'px');
    paintBase(); paintDetail();
    if (!ready) { cur = { x: BLOBS[0].x * S, y: BLOBS[0].y * S }; tgt = { x: cur.x, y: cur.y }; ready = true; }
    else { cur = clampField(cur.x, cur.y); }
    place(cur.x, cur.y);
  }
  function loop(now) {
    requestAnimationFrame(loop);
    if (!visible || !ready) return;
    var t = hover ? tgt : idle(now), k = hover ? .16 : .05;
    cur.x += (t.x - cur.x) * k; cur.y += (t.y - cur.y) * k;
    place(cur.x, cur.y);
  }
  root.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var r = root.getBoundingClientRect();
    var p = clampField(e.clientX - r.left, e.clientY - r.top);
    tgt = p; hover = true;
    if (reduce) { cur = p; place(p.x, p.y); }
  });
  root.addEventListener('pointerleave', function () { hover = false; });
  if (vis && !reduce) {
    vis.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = vis.getBoundingClientRect();
      vis.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      vis.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    vis.addEventListener('pointerleave', function () { vis.style.setProperty('--px', 0); vis.style.setProperty('--py', 0); });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(root);
  }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
  window.dcHero = {
    setLabels: function (a, b, aria) { labels.a = a; labels.b = b; if (aria) root.setAttribute('aria-label', aria); lastText = ''; if (ready) place(cur.x, cur.y); }
  };
  root.classList.add('dm-on');
  layout();
  if (!reduce) requestAnimationFrame(loop);
})();
