// DermCase smoke tests. No build step, no test framework.
//   node tests/smoke.js            (needs: playwright, and a Chromium it can launch)
//   CHROME=/path/to/chrome node tests/smoke.js
// Serves the repo from a throwaway local server with Vercel-style cleanUrls.
const fs = require('fs');
const path = require('path');
const http = require('http');
const cp = require('child_process');

let playwright;
try { playwright = require('playwright'); } catch (e) { playwright = require('/opt/node-tools/node_modules/playwright'); }

const ROOT = path.resolve(__dirname, '..');
const PORT = 8137;
const BASE = 'http://127.0.0.1:' + PORT;
const PACKAGE_ID = 'com.jai_kim.dermcase';

let pass = 0, fail = 0;
const failures = [];
function ok(cond, name, detail) {
  if (cond) { pass++; }
  else { fail++; failures.push(name + (detail ? '  -> ' + detail : '')); console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));

// ---------------------------------------------------------------- static server
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      let f = path.join(ROOT, p);
      if (!f.startsWith(ROOT)) { rsp.writeHead(403); return rsp.end(); }
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { if (fs.existsSync(f + '.html')) f += '.html'; else { rsp.writeHead(404); return rsp.end('nf'); } }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rsp);
    }).listen(PORT, () => res(srv));
  });
}

// ---------------------------------------------------------------- 1. files and config
function fileChecks() {
  console.log('Files and config');
  const man = JSON.parse(read('manifest.webmanifest'));
  ok(man.id && man.name === 'DermCase' && man.display === 'standalone', 'manifest core fields');
  ok(/^\/app/.test(man.start_url), 'manifest start_url is the app', man.start_url);
  const purposes = (man.icons || []).map(i => i.sizes + ':' + i.purpose).join(',');
  ok(/192x192:any/.test(purposes) && /512x512:any/.test(purposes) && /512x512:maskable/.test(purposes), 'manifest has 192, 512 and maskable icons', purposes);
  (man.icons || []).concat(man.screenshots || []).forEach(i => ok(exists(i.src.replace(/^\//, '')), 'manifest asset exists: ' + i.src));
  ok((man.screenshots || []).length >= 2, 'manifest has screenshots');

  const al = JSON.parse(read('.well-known/assetlinks.json'));
  ok(Array.isArray(al), 'assetlinks.json is an array');
  al.forEach((e, i) => {
    ok(Array.isArray(e.relation) && e.relation.indexOf('delegate_permission/common.handle_all_urls') >= 0, 'assetlinks[' + i + '] relation');
    ok(e.target && e.target.namespace === 'android_app' && e.target.package_name === PACKAGE_ID, 'assetlinks[' + i + '] package name', e.target && e.target.package_name);
    const fps = (e.target && e.target.sha256_cert_fingerprints) || [];
    ok(fps.length > 0 && fps.every(f => /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(f)), 'assetlinks[' + i + '] fingerprints are SHA-256 hex pairs');
  });

  const twa = JSON.parse(read('android/twa-manifest.json'));
  ok(twa.packageId === PACKAGE_ID, 'twa packageId matches assetlinks package', twa.packageId);
  ok(twa.host === 'dermcase.jai-kim.com', 'twa host is the custom domain', twa.host);
  ok(twa.startUrl.indexOf('/app') === 0, 'twa startUrl is in the app');
  ok(twa.signingKey && !/^\//.test(twa.signingKey.path) && /\.keystore$/.test(twa.signingKey.path), 'twa signing key is a relative, untracked keystore path');
  ok(twa.fallbackType === 'customtabs', 'twa falls back to Custom Tabs');

  const vj = JSON.parse(read('vercel.json'));
  const hdr = (vj.headers || []).map(h => h.source);
  ok(vj.cleanUrls === true, 'vercel cleanUrls on');
  ok(hdr.indexOf('/.well-known/assetlinks.json') >= 0, 'vercel serves assetlinks as JSON');
  ok(/\/\.well-known\//.test(read('sw.js')), 'service worker never touches /.well-known/');

  const gi = read('.gitignore');
  ok(/\*\.keystore/.test(gi) && /\*\.jks/.test(gi), '.gitignore blocks signing keystores');
  ok(/^store$/m.test(read('.vercelignore')) && /^tests$/m.test(read('.vercelignore')), '.vercelignore keeps store and tests off the site');

  // secrets must never be committed
  const files = cp.execSync('git ls-files', { cwd: ROOT }).toString().split('\n').filter(Boolean)
    .filter(f => !/\.(png|jpg|svg|woff2?|ico)$/.test(f) && f !== 'tests/smoke.js');
  const pats = [/sk-ant-[A-Za-z0-9_-]{10,}/, /ghp_[A-Za-z0-9]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /service_role/i];
  const hits = [];
  files.forEach(f => { let s = ''; try { s = read(f); } catch (e) { return; } pats.forEach(p => { if (p.test(s)) hits.push(f + ' ~ ' + p); }); });
  ok(hits.length === 0, 'no secrets in tracked files', hits.join('; '));

  // claim guard: wording that over-promised before the Anthropic retention check
  const claimFiles = ['index.html', 'app.html', 'about.html', 'login.html', 'library.html', 'report.html', 'privacy.html'];
  const bad = [/photos? (are |is )?never (stored|saved)/i, /never stored\. (for|the cloud)/i, /nowhere on any server/i, /not saved on any server/i, /then discarded/i, /어떤 서버에도/, /폐기됩니다/, /clinical assessment/i, /(sectionAssessment|sAssess):\s*'임상 평가'/];
  claimFiles.forEach(f => { const s = read(f); bad.forEach(p => ok(!p.test(s), 'no overclaim ' + p + ' in ' + f)); });
  ok(!/김재이/.test(read('privacy.html')), 'privacy page invents no Korean spelling of a name');
  ok(/delete_my_account/.test(read('supabase-schema.sql')) && /delete_my_account/.test(read('dermcase-cloud.js')), 'account deletion exists in schema and client');
}

// ---------------------------------------------------------------- 2. browser checks
const PAGES = ['/', '/app', '/about', '/login', '/library', '/privacy', '/offline'];
async function newPage(browser, lang, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block', isMobile: w < 700, hasTouch: w < 700 });
  await ctx.addInitScript(l => { try { localStorage.setItem('dc_lang', l); } catch (e) { } }, lang);
  const pg = await ctx.newPage();
  pg.errs = [];
  pg.on('pageerror', e => pg.errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error' && !/net::|Failed to load resource|ERR_/.test(m.text())) pg.errs.push('console: ' + m.text()); });
  await pg.route(/cdn\.jsdelivr\.net/, r => r.abort());
  return pg;
}

async function browserChecks() {
  const launchOpts = { args: ['--no-sandbox'] };
  if (process.env.CHROME) launchOpts.executablePath = process.env.CHROME;
  else if (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome')) launchOpts.executablePath = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await playwright.chromium.launch(launchOpts);

  for (const lang of ['ko', 'en']) {
    console.log('Pages, ' + lang + ', desktop 1280');
    for (const p of PAGES) {
      const pg = await newPage(browser, lang, 1280, 900);
      await pg.goto(BASE + p, { waitUntil: 'load' });
      await pg.waitForTimeout(500);
      ok(pg.errs.length === 0, p + ' [' + lang + '] loads with no script errors', pg.errs.join(' | '));
      const empties = await pg.evaluate(() => [...document.querySelectorAll('[data-i18n]')].filter(e => !e.textContent.trim() && !e.closest('[hidden],.hide')).map(e => e.getAttribute('data-i18n')));
      ok(empties.length === 0, p + ' [' + lang + '] no empty translated element', empties.join(','));
      await pg.context().close();
    }

    console.log('Pages, ' + lang + ', phone 360');
    for (const p of PAGES) {
      const pg = await newPage(browser, lang, 360, 740);
      await pg.goto(BASE + p, { waitUntil: 'load' });
      await pg.waitForTimeout(500);
      const m = await pg.evaluate(() => {
        const brand = document.querySelector('.nav .brand');
        const links = [...document.querySelectorAll('.nav-links > *')].filter(e => e.offsetParent !== null);
        const br = brand && brand.getBoundingClientRect();
        let overlap = false;
        if (br) links.forEach(l => { const r = l.getBoundingClientRect(); if (r.left < br.right - 1 && r.right > br.left + 1 && r.top < br.bottom && r.bottom > br.top) overlap = true; });
        return { sw: document.documentElement.scrollWidth, iw: window.innerWidth, overlap };
      });
      ok(m.sw <= m.iw + 1, p + ' [' + lang + '] no horizontal overflow at 360px', m.sw + ' > ' + m.iw);
      ok(!m.overlap, p + ' [' + lang + '] nav items do not overlap the brand at 360px');
      await pg.context().close();
    }
  }

  console.log('Privacy page');
  for (const lang of ['ko', 'en']) {
    const pg = await newPage(browser, lang, 1280, 900);
    await pg.goto(BASE + '/privacy', { waitUntil: 'load' });
    await pg.waitForTimeout(300);
    const v = await pg.evaluate(() => {
      const vis = el => el && getComputedStyle(el).display !== 'none';
      return { en: vis(document.querySelector('main .l-en')), ko: vis(document.querySelector('main .l-ko')), lang: document.documentElement.lang, text: document.querySelector('main').innerText };
    });
    ok(v.lang === lang, 'privacy html lang follows ' + lang);
    ok(lang === 'en' ? (v.en && !v.ko) : (v.ko && !v.en), 'privacy shows only the ' + lang + ' block');
    ok(/Anthropic/.test(v.text) && /30/.test(v.text), 'privacy [' + lang + '] names Anthropic and the 30 day retention');
    ok(/Supabase/.test(v.text) && /Vercel/.test(v.text), 'privacy [' + lang + '] names Supabase and Vercel');
    ok(lang === 'en' ? /not a medical device/.test(v.text) : /의료기기가 아니며/.test(v.text), 'privacy [' + lang + '] carries the medical-device disclaimer');
    const contact = await pg.evaluate(() => ({ cfg: window.DERMCASE_CONTACT_EMAIL || '', href: ((document.querySelector('main .l-' + document.documentElement.lang + ' [data-contact] a') || {}).getAttribute || function () { return ''; }).call(document.querySelector('main .l-' + document.documentElement.lang + ' [data-contact] a') || {}, 'href') }));
    ok(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.cfg), 'config.js has a valid contact email', contact.cfg);
    ok(contact.href === 'mailto:' + contact.cfg, 'privacy [' + lang + '] shows the contact email as a mailto link', contact.href);
    await pg.context().close();
  }
  // no JavaScript at all: the policy must still be readable (crawlers and store reviewers)
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const pg = await ctx.newPage();
    await pg.route(/cdn\.jsdelivr\.net/, r => r.abort());
    await pg.goto(BASE + '/privacy', { waitUntil: 'load' });
    const txt = await pg.evaluate(() => document.querySelector('main').innerText);
    ok(/Privacy policy/.test(txt) && /개인정보 처리방침/.test(txt) && /Anthropic/.test(txt), 'privacy page is readable with JavaScript off, in both languages');
    await ctx.close();
  }

  console.log('Disclaimers');
  for (const lang of ['ko', 'en']) {
    for (const p of ['/', '/app', '/about']) {
      const pg = await newPage(browser, lang, 1280, 900);
      await pg.goto(BASE + p, { waitUntil: 'load' });
      await pg.waitForTimeout(400);
      const txt = await pg.evaluate(() => document.body.innerText);
      ok(lang === 'en' ? /not a medical device/i.test(txt) : /의료기기가 아니며/.test(txt), p + ' [' + lang + '] says it is not a medical device');
      ok(/\/privacy/.test(await pg.evaluate(() => [...document.querySelectorAll('a')].map(a => a.getAttribute('href')).join(' '))), p + ' [' + lang + '] links to the privacy policy');
      await pg.context().close();
    }
  }

  console.log('App: example brief');
  for (const lang of ['ko', 'en']) {
    const pg = await newPage(browser, lang, 1280, 900);
    await pg.goto(BASE + '/app', { waitUntil: 'load' });
    await pg.waitForTimeout(400);
    await pg.click('#emptyExample');
    await pg.waitForTimeout(900);
    const r = await pg.evaluate(() => ({ secs: document.querySelectorAll('#brief .sec').length, ctx: (document.querySelector('#brief .ctx') || {}).innerText || '', head: [...document.querySelectorAll('#brief .sec-h')].map(e => e.textContent.trim()), form: document.getElementById('duration').value }));
    ok(r.secs >= 3, 'example brief has differential, treatment and references [' + lang + ']', String(r.secs));
    if (lang === 'ko') {
      ok(!/[A-Za-z]{4,}.*months|Bilateral/i.test(r.ctx.replace(/Fitzpatrick/g, '')), 'Korean example context is localized', r.ctx);
      ok(!/months/.test(r.form), 'Korean sample fills the form in Korean', r.form);
      ok(r.head[0] === '감별 고려 질환', 'Korean differential heading', r.head[0]);
    } else {
      ok(r.head[0] === 'Differential to consider', 'English differential heading', r.head[0]);
    }
    ok(pg.errs.length === 0, 'example renders without errors [' + lang + ']', pg.errs.join(' | '));
    await pg.context().close();
  }

  console.log('App: analysis path (model mocked)');
  for (const lang of ['ko', 'en']) {
    for (const mode of ['complete', 'truncated', 'rejected', 'server-error']) {
      const pg = await newPage(browser, lang, 1280, 900);
      await pg.goto(BASE + '/app', { waitUntil: 'load' });
      await pg.waitForTimeout(300);
      const full = await pg.evaluate(l => JSON.stringify(EXAMPLE[l]), lang);
      let body, status = 200;
      if (mode === 'complete') body = { content: [{ type: 'text', text: '```json\n' + full + '\n```' }], stop_reason: 'end_turn' };
      else if (mode === 'truncated') body = { content: [{ type: 'text', text: full.slice(0, Math.floor(full.length * 0.62)) }], stop_reason: 'max_tokens' };
      else if (mode === 'rejected') body = { content: [{ type: 'text', text: JSON.stringify({ relevant: false, rejection: { reason: 'Not a clinical photo.', detected: 'a landscape' } }) }], stop_reason: 'end_turn' };
      else { body = { error: 'upstream down' }; status = 500; }
      await pg.route('**/api/analyze', r => r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }));
      const b64 = await pg.evaluate(() => { const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d'); x.fillStyle = '#c98f78'; x.fillRect(0, 0, 96, 96); return c.toDataURL('image/png').split(',')[1]; });
      await pg.setInputFiles('#fileInput', { name: 'case.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') });
      await pg.waitForFunction(() => !document.getElementById('analyzeBtn').disabled, null, { timeout: 8000 }).catch(() => { });
      await pg.click('#analyzeBtn');
      await pg.waitForTimeout(1800);
      const r = await pg.evaluate(() => ({ secs: document.querySelectorAll('#brief .sec').length, out: document.getElementById('outputArea').innerText, partial: typeof t === 'function' ? t('partialNote') : '', rej: typeof t === 'function' ? t('rejTitle') : '', err: typeof t === 'function' ? t('errTitle') : '' }));
      if (mode === 'complete') ok(r.secs >= 3 && r.out.indexOf(r.partial) < 0, 'complete answer renders fully [' + lang + ']', r.secs + ' sections');
      if (mode === 'truncated') ok(r.secs >= 1 && r.out.indexOf(r.partial) >= 0, 'cut-off answer is salvaged with a notice [' + lang + ']', r.secs + ' sections');
      if (mode === 'rejected') ok(r.out.indexOf(r.rej) >= 0 && r.secs === 0, 'non-clinical image gets a calm rejection [' + lang + ']');
      if (mode === 'server-error') ok(r.out.indexOf(r.err) >= 0, 'server error shows the error card with retry [' + lang + ']');
      ok(pg.errs.length === 0, 'analysis ' + mode + ' raises no script errors [' + lang + ']', pg.errs.join(' | '));
      await pg.context().close();
    }
  }

  console.log('Library: account zone');
  {
    const pg = await newPage(browser, 'en', 1280, 900);
    await pg.goto(BASE + '/library', { waitUntil: 'load' });
    await pg.waitForTimeout(400);
    const hidden = await pg.evaluate(() => getComputedStyle(document.getElementById('acctZone')).display === 'none');
    ok(hidden, 'delete-account zone is hidden when signed out');
    await pg.context().close();
    // signed-in path with a stubbed cloud client
    const pg2 = await newPage(browser, 'en', 1280, 900);
    await pg2.route('**/dermcase-cloud.js', r => r.fulfill({ contentType: 'application/javascript', body:
      "window.__called=[];window.DermCaseCloud={enabled:function(){return true},user:async function(){return{email:'a@b.co'}},listCases:async function(){return[]},signOut:async function(){},deleteCase:async function(){},deleteAccount:async function(){window.__called.push('delete')}};" }));
    pg2.on('dialog', d => d.accept());
    await pg2.goto(BASE + '/library', { waitUntil: 'load' });
    await pg2.waitForTimeout(500);
    ok(await pg2.evaluate(() => getComputedStyle(document.getElementById('acctZone')).display !== 'none'), 'delete-account zone shows when signed in');
    await pg2.click('#delAcctBtn');
    await pg2.waitForTimeout(300);
    ok(await pg2.evaluate(() => window.__called.join() === 'delete' || location.pathname === '/'), 'delete button calls deleteAccount');
    ok(/deleted/i.test(await pg2.evaluate(() => (document.getElementById('acctMsg') || {}).textContent || '')) || (await pg2.evaluate(() => location.pathname)) === '/', 'delete shows confirmation or leaves the page');
    await pg2.context().close();
  }
  await browser.close();
}

(async () => {
  const srv = await serve();
  try { fileChecks(); await browserChecks(); }
  catch (e) { fail++; failures.push('harness crashed: ' + e.stack); console.log(e); }
  srv.close();
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  if (fail) { console.log(failures.map(f => ' - ' + f).join('\n')); process.exit(1); }
})();
