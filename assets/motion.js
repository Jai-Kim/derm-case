/* DermCase motion layer. Scroll-linked, progressive enhancement.
   Without JS, or with prefers-reduced-motion, every page is fully visible and static. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { window.dcMotion = { refresh: function () {} }; return; }
  doc.classList.add('js');

  var desktop = window.matchMedia('(min-width: 900px)');
  var strip = null, pins = [], passes = [], ticking = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function split(el) {
    var text = (el.textContent || '').trim();
    if (!text) return;
    var words = text.split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w';
      s.style.setProperty('--i', i);
      s.style.setProperty('--n', words.length);
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  function splitMask(el) {
    var text = (el.textContent || '').trim();
    if (!text) return;
    var words = text.split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var m = document.createElement('span'); m.className = 'wm';
      var s = document.createElement('span'); s.style.setProperty('--k', i); s.textContent = w;
      m.appendChild(s); el.appendChild(m);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* Sources ticker: drifts left, speeds up with scroll, reverses when you scroll up */
  function ticker() {
    var tr = document.querySelector('[data-ticker]');
    if (!tr || tr._on) return; tr._on = true;
    var row = tr.querySelector('.ticker-row');
    for (var i = 0; i < 2; i++) { var c = row.cloneNode(true); c.setAttribute('aria-hidden', 'true'); tr.appendChild(c); }
    var x = 0, dir = -1, vel = 0, last = performance.now(), lastY = window.pageYOffset, on = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; }).observe(tr.parentNode);
    (function loop(now) {
      requestAnimationFrame(loop);
      var dt = Math.min(64, now - last); last = now;
      var y = window.pageYOffset, dy = y - lastY; lastY = y;
      vel += (Math.min(Math.abs(dy), 60) / 16 - vel) * 0.12;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      if (!on) return;
      var w = row.offsetWidth || 1;
      x += dir * (0.045 + vel * 0.5) * dt;
      if (x <= -w) x += w; if (x > 0) x -= w;
      tr.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    })(last);
  }

  /* Cursor spotlight on tiles */
  document.addEventListener('pointermove', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-spot]') : null;
    if (!t) return;
    var r = t.getBoundingClientRect();
    t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    t.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* Variable-font proximity: letters swell and darken as the cursor nears */
  function prox() {
    document.querySelectorAll('[data-prox]').forEach(function (el) {
      if (el._p) return; el._p = true;
      var chars = [], raf = 0, mx = 0, my = 0, inside = false;
      (el.textContent || '').split('').forEach(function (ch) {
        var s = document.createElement('span'); s.className = 'c'; s.textContent = ch; chars.push(s);
      });
      el.textContent = ''; chars.forEach(function (s) { el.appendChild(s); });
      function draw() {
        raf = 0;
        chars.forEach(function (s) {
          var r = s.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          var d = inside ? Math.hypot(mx - cx, my - cy) : 9999;
          var f = Math.exp(-Math.pow(d / (r.height * 1.1), 2));
          s.style.fontWeight = Math.round(520 + 360 * f);
          s.style.color = 'color-mix(in srgb,var(--ink) ' + Math.round(f * 100) + '%,var(--line-2))';
        });
      }
      el.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; inside = true; mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(draw); });
      el.addEventListener('pointerleave', function () { inside = false; if (!raf) raf = requestAnimationFrame(draw); });
    });
  }

  function update() {
    ticking = false;
    var vh = window.innerHeight || 800;
    var y = window.pageYOffset || doc.scrollTop || 0;
    if (strip) {
      var max = doc.scrollHeight - vh;
      strip.style.setProperty('--sp', (max > 0 ? clamp(y / max) : 0).toFixed(4));
    }
    pins.forEach(function (el) {
      var on = desktop.matches;
      el.classList.toggle('pin', on);
      if (!on) { el.style.removeProperty('--p'); el.removeAttribute('data-step'); return; }
      var r = el.getBoundingClientRect();
      var track = r.height - vh;
      var p = track > 0 ? clamp(-r.top / track) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      el.setAttribute('data-step', p < 0.3 ? 1 : p < 0.66 ? 2 : 3);
    });
    passes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var from = parseFloat(el.getAttribute('data-from')) || 0.85;
      var to = parseFloat(el.getAttribute('data-to')) || 0.25;
      el.style.setProperty('--p', clamp((vh * from - r.top) / (vh * (from - to))).toFixed(4));
    });
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  }

  function refresh() {
    strip = document.querySelector('.spectrum[data-progress]');
    document.querySelectorAll('[data-words]').forEach(split);
    document.querySelectorAll('[data-split]').forEach(splitMask);
    ticker();
    prox();
    pins = [].slice.call(document.querySelectorAll('[data-scrub="pin"]'));
    passes = [].slice.call(document.querySelectorAll('[data-scrub="pass"]'));
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('in');
    });
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (desktop.addEventListener) desktop.addEventListener('change', update);
  window.dcMotion = { refresh: refresh };
  refresh();
})();
