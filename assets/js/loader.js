// The loading screen while a case is analyzed: the "light table".
// It shows what the server is really doing (reading, searching, writing), the actual search queries as they are issued,
// and a progress bar that eases forward and never stalls or goes back. All text is set with textContent.
// Why it looks this way: showing real work makes a wait feel purposeful (Buell & Norton 2011, "labor illusion"),
// waits feel shorter when they are occupied, explained and finite (Maister 1985), and a bar that keeps moving feels faster
// than one that stalls (Harrison et al. 2010). Waits over about 10 s need a progress indicator and a way out (Nielsen).
(function () {
  'use strict';
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fill(tpl, n) { return String(tpl).replace('{n}', String(n)); }

  // cfg: { t(key), photo (data:image URL or ''), chips [string], onCancel(), announce(msg) }
  function mount(root, cfg) {
    var t = cfg.t;
    var box = el('div', 'lt ph-read');
    box.setAttribute('aria-busy', 'true');

    // top: the photo on the light table, with the case details pinned beside it
    var top = el('div', 'lt-top');
    var lens = el('div', 'lt-lens');
    var photo = el('img', 'lt-photo'); photo.alt = '';
    if (cfg.photo && /^data:image\/(jpeg|png);base64,/.test(cfg.photo)) photo.src = cfg.photo; else photo.className += ' blank';
    lens.appendChild(photo); lens.appendChild(el('span', 'lt-scan')); lens.appendChild(el('span', 'lt-ring'));
    var side = el('div', 'lt-case');
    side.appendChild(el('p', 'lt-title', t('ldTitle')));
    var chips = el('ul', 'lt-chips');
    (cfg.chips || []).slice(0, 6).forEach(function (c) { if (c) chips.appendChild(el('li', '', String(c).slice(0, 40))); });
    side.appendChild(chips);
    top.appendChild(lens); top.appendChild(side);

    // the three real stages
    var steps = el('ol', 'lt-steps');
    function step(key, label) {
      var li = el('li', 'lt-step'); li.setAttribute('data-s', key);
      li.appendChild(el('span', 'lt-dot'));
      var head = el('div', 'lt-head'); head.appendChild(el('b', '', label)); var sub = el('span', 'lt-sub'); head.appendChild(sub);
      li.appendChild(head);
      steps.appendChild(li);
      return { li: li, sub: sub };
    }
    var sRead = step('read', t('ldRead')), sSearch = step('search', t('ldSearch')), sWrite = step('write', t('ldWrite'));
    var queries = el('ul', 'lt-q'); sSearch.li.appendChild(queries);
    sRead.li.className += ' on';

    var bar = el('div', 'lt-bar'); bar.setAttribute('aria-hidden', 'true'); bar.appendChild(el('i'));
    var foot = el('div', 'lt-foot');
    var time = el('span', 'lt-time');
    var cancel = el('button', 'btn btn-line btn-sm', t('cancel')); cancel.type = 'button'; cancel.id = 'cancelBtn';
    cancel.addEventListener('click', function () { if (cfg.onCancel) cfg.onCancel(); });
    foot.appendChild(time); foot.appendChild(cancel);

    box.appendChild(top); box.appendChild(steps); box.appendChild(bar); box.appendChild(foot);
    root.textContent = ''; root.appendChild(box);

    var t0 = Date.now(), stage = 0, searches = 0, sources = 0, chars = 0, prog = 0, over = false, rafId = 0, tickId = 0, lastLi = null;

    function say(msg) { if (cfg.announce) cfg.announce(msg); }
    function setStage(n) {
      if (n <= stage) return;
      stage = n;
      sRead.li.className = 'lt-step' + (stage > 0 ? ' done' : ' on');
      sSearch.li.className = 'lt-step' + (stage > 1 ? ' done' : stage === 1 ? ' on' : '');
      sWrite.li.className = 'lt-step' + (stage === 2 ? ' on' : '');
      box.className = 'lt ' + (stage === 0 ? 'ph-read' : stage === 1 ? 'ph-search' : 'ph-write');
      say(t(stage === 1 ? 'ldSearch' : 'ldWrite'));
    }
    function target() {
      var s = (Date.now() - t0) / 1000;
      var byTime = 0.92 * (1 - Math.exp(-s / 35)) * 0.9;           // about 21% at 10 s, 48% at 30 s, 68% at 60 s
      var byWork = 0.05;
      if (stage >= 1) byWork = 0.14 + 0.05 * Math.min(searches, 6);
      if (stage >= 2) byWork = 0.55 + 0.4 * Math.min(chars / 4200, 1);
      return Math.min(0.96, Math.max(byTime, byWork));
    }
    function paint() {
      bar.firstChild.style.setProperty('--p', prog.toFixed(3));
      var s = Math.floor((Date.now() - t0) / 1000);
      if (s > 75 && !over) over = true;
      time.textContent = s + t('secUnit') + ' · ' + (over ? t('ldLong') : t('ldUsually'));
    }
    function frame() {
      var tg = target();
      if (tg > prog) prog = Math.min(tg, prog + Math.max((tg - prog) * 0.05, 0.0008));   // eased, monotonic
      paint();
      rafId = window.requestAnimationFrame(frame);
    }
    function tick() {                                              // reduced motion: calm, stepwise updates
      var tg = target();
      if (tg > prog) prog = Math.min(tg, prog + Math.max((tg - prog) * 0.4, 0.01));
      paint();
    }
    if (reduce) { tick(); tickId = window.setInterval(tick, 700); } else { frame(); }

    return {
      // events from the server: ready, hb, search{n,q}, found{n}, w{n}
      event: function (ev) {
        if (!ev || typeof ev !== 'object') return;
        if (ev.t === 'search') {
          setStage(1); searches = Math.max(searches, ev.n | 0);
          if (typeof ev.q === 'string' && ev.q && queries.children.length < 8) {
            var li = el('li', '', ev.q); queries.appendChild(li); lastLi = li;
          }
          sSearch.sub.textContent = fill(t('ldSourcesTotal'), sources);
          if (!sources) sSearch.sub.textContent = '';
        } else if (ev.t === 'found') {
          setStage(1);
          var n = Math.max(0, Math.min(ev.n | 0, 20)); sources += n;
          if (lastLi && n) { lastLi.appendChild(el('span', 'lt-n', fill(t('ldSources'), n))); }
          if (sources) sSearch.sub.textContent = fill(t('ldSourcesTotal'), sources);
        } else if (ev.t === 'w') {
          setStage(2); chars = Math.max(chars, ev.n | 0);
        }
      },
      // the answer arrived: fill the bar, tick every step, then hand over after a short beat
      finish: function (next) {
        window.cancelAnimationFrame(rafId); window.clearInterval(tickId);
        stage = 2; sRead.li.className = sSearch.li.className = sWrite.li.className = 'lt-step done';
        box.className = 'lt ph-done'; box.setAttribute('aria-busy', 'false');
        prog = 1; bar.firstChild.style.setProperty('--p', '1');
        window.setTimeout(next, reduce ? 0 : 380);
      },
      stop: function () { window.cancelAnimationFrame(rafId); window.clearInterval(tickId); }
    };
  }

  window.DermLoader = { mount: mount };
})();
