(function () {
  var stored; try { stored = localStorage.getItem('dc_theme'); } catch (e) {}
  var dark = stored ? stored === 'dark' : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  window.dcToggleTheme = function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('dc_theme', next); } catch (e) {}
  };
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-theme-toggle]')) window.dcToggleTheme();
  });
  window.dcLang = {
    get: function () { var s; try { s = localStorage.getItem('dc_lang'); } catch (e) {} return s === 'en' || s === 'ko' ? s : ((navigator.language || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'ko'); },
    set: function (v) { try { localStorage.setItem('dc_lang', v); } catch (e) {} }
  };
})();
