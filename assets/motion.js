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
