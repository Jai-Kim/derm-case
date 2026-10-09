/* DermCase link and text safety helpers. Loaded by the app, report and library pages; also required by the tests.
   DCSafe.url(u)    -> a cleaned https URL on the trusted-publisher allowlist, or '' (callers then fall back to a PubMed search).
   DCSafe.pubmed(t) -> a PubMed search URL built from a title (always safe: fixed host, encoded query).
   DCSafe.esc(s)    -> HTML-escaped text.
   Why: the model's answer, a shared report link and a saved case are all untrusted input. A link in them is only
   followed when it points at a known medical or publisher site over https, with no credentials and no odd port. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DCSafe = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // A host matches when it equals an entry or is a subdomain of it.
  var ALLOW = [
    'doi.org', 'pubmed.ncbi.nlm.nih.gov', 'ncbi.nlm.nih.gov', 'nih.gov', 'europepmc.org', 'clinicaltrials.gov',
    'cochranelibrary.com', 'cochrane.org', 'jaad.org', 'aad.org', 'jidonline.org', 'jamanetwork.com', 'nejm.org',
    'thelancet.com', 'bmj.com', 'acpjournals.org', 'sciencedirect.com', 'elsevier.com', 'cell.com', 'springer.com',
    'springernature.com', 'nature.com', 'wiley.com', 'oup.com', 'cambridge.org', 'tandfonline.com', 'karger.com',
    'sagepub.com', 'thieme-connect.com', 'lww.com', 'wolterskluwer.com', 'frontiersin.org', 'mdpi.com', 'plos.org',
    'biomedcentral.com', 'dovepress.com', 'dermnetnz.org', 'eadv.org', 'bad.org.uk', 'nice.org.uk', 'uptodate.com',
    'fda.gov', 'ema.europa.eu', 'cdc.gov', 'who.int', 'koreamed.org', 'kci.go.kr', 'koreanderma.or.kr', 'mfds.go.kr',
    'kdca.go.kr'
  ];

  function hostAllowed(h) {
    h = String(h || '').toLowerCase().replace(/\.$/, '');
    for (var i = 0; i < ALLOW.length; i++) {
      if (h === ALLOW[i] || (h.length > ALLOW[i].length && h.slice(-(ALLOW[i].length + 1)) === '.' + ALLOW[i])) return true;
    }
    return false;
  }

  function url(u) {
    if (typeof u !== 'string') return '';
    u = u.trim();
    if (!u || u.length > 2000) return '';
    if (/[\s"'<>\\`\u0000-\u001F\u007F]/.test(u)) return '';
    var p;
    try { p = new URL(u); } catch (e) { return ''; }
    if (p.protocol !== 'https:') return '';
    if (p.username || p.password) return '';
    if (p.port && p.port !== '443') return '';
    if (!hostAllowed(p.hostname)) return '';
    return p.href;
  }

  function pubmed(title) {
    return 'https://pubmed.ncbi.nlm.nih.gov/?term=' + encodeURIComponent(String(title == null ? '' : title).replace(/[^\w\s().-]/g, ' ').trim());
  }

  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  return { url: url, pubmed: pubmed, esc: esc, own: own, hostAllowed: hostAllowed, ALLOW: ALLOW };
});
