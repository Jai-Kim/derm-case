/* Install button for the app page. Android Chrome: native install prompt. iPhone Safari: a short how-to. */
(function () {
  if (!document.body || !document.body.hasAttribute('data-install')) return;
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (standalone) return;
  var holder = document.querySelector('.nav-links'); if (!holder) return;
  var T = {
    ko: { install: '앱 설치', ios: '홈 화면에 추가', title: '홈 화면에 추가', body: '공유 버튼을 누른 뒤 "홈 화면에 추가"를 선택하세요.', close: '닫기' },
    en: { install: 'Install app', ios: 'Add to Home Screen', title: 'Add to Home Screen', body: 'Tap the Share button, then choose "Add to Home Screen".', close: 'Close' }
  };
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  var lang = function () { return document.documentElement.lang === 'en' ? 'en' : 'ko'; };
  var btn = document.createElement('button');
  btn.type = 'button'; btn.id = 'installBtn'; btn.className = 'nav-link'; btn.hidden = true;
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:6px"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/></svg><span class="t"></span>';
  var theme = holder.querySelector('[data-theme-toggle]');
  holder.insertBefore(btn, theme || null);
  var deferred = null;
  function label() { var s = ios ? T[lang()].ios : T[lang()].install; btn.querySelector('.t').textContent = s; btn.setAttribute('aria-label', s); }
  label();
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; btn.hidden = false; });
  window.addEventListener('appinstalled', function () { btn.hidden = true; deferred = null; });
  if (ios) btn.hidden = false;
  btn.addEventListener('click', function () {
    if (deferred) {
      var d = deferred; d.prompt();
      if (d.userChoice && d.userChoice.then) d.userChoice.then(function () { btn.hidden = true; deferred = null; });
    } else if (ios) {
      var dlg = document.getElementById('iosHint');
      if (!dlg) {
        dlg = document.createElement('dialog'); dlg.id = 'iosHint'; dlg.className = 'pwa-dlg';
        dlg.innerHTML = '<h2></h2><p></p><form method="dialog"><button class="btn btn-solid btn-sm"></button></form>';
        document.body.appendChild(dlg);
      }
      dlg.querySelector('h2').textContent = T[lang()].title; dlg.querySelector('p').textContent = T[lang()].body; dlg.querySelector('button').textContent = T[lang()].close;
      if (dlg.showModal) dlg.showModal();
    }
  });
})();
