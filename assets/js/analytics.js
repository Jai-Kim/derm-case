// Cookie-free page-view counting with Vercel Web Analytics. Loaded only on the home, about, app and privacy pages.
// Never on /report (its link carries case content), /login or /library. Skipped entirely when the browser asks not to be tracked.
// The script is served by Vercel itself from /_vercel/insights/script.js (same origin, so the CSP needs no exception).
(function () {
  try {
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    var s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  } catch (e) { /* counting is optional */ }
})();
