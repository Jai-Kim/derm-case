// /reset: the page the password-reset email points to.
// The email link carries a one-time code. It is read once, removed from the address bar, and exchanged for a short session in
// this browser only (PKCE: the matching secret never left this browser). Then the person chooses a new password and every
// session on every device is signed out.
const I18N = {
  ko: {
    navApp: '앱으로', title: '새 비밀번호 설정',
    pwLabel: '새 비밀번호', pw2Label: '새 비밀번호 확인',
    pwHint: '비밀번호는 10자 이상이어야 하며 영문 소문자, 영문 대문자, 숫자를 각각 1개 이상 포함해야 합니다.',
    saveBtn: '새 비밀번호 저장', working: '처리 중', checking: '링크를 확인하는 중입니다',
    mismatch: '두 비밀번호가 일치하지 않습니다.',
    done: '비밀번호를 바꿨습니다. 보안을 위해 모든 기기에서 로그아웃되었습니다. 새 비밀번호로 로그인해 주세요.',
    toSignIn: '로그인으로 이동', skip: '로그인 없이 계속', policy: '개인정보 처리방침',
    badLink: '링크가 만료되었거나 이미 사용되었습니다. 로그인 화면에서 새 링크를 요청해 주세요.',
    sameBrowser: '링크는 요청한 것과 같은 브라우저에서 열어야 합니다. 다른 기기에서 열었다면 그곳에서 새 링크를 요청해 주세요.',
    samePw: '이전에 쓰지 않은 비밀번호를 선택해 주세요.',
    saveFail: '비밀번호를 저장하지 못했습니다. 새 링크를 요청한 뒤 다시 시도해 주세요.',
    notConfigured: '클라우드 계정이 아직 설정되지 않았습니다.',
  },
  en: {
    navApp: 'Open app', title: 'Choose a new password',
    pwLabel: 'New password', pw2Label: 'Repeat new password',
    pwHint: 'Use at least 10 characters, with a lowercase letter, an uppercase letter and a number.',
    saveBtn: 'Save new password', working: 'Working', checking: 'Checking the link',
    mismatch: 'The two passwords do not match.',
    done: 'Password updated. For your security you were signed out on every device. Sign in with the new password.',
    toSignIn: 'Go to sign in', skip: 'Continue without an account', policy: 'Privacy policy',
    badLink: 'This link has expired or was already used. Request a new one from the sign-in page.',
    sameBrowser: 'Open the link in the same browser where you asked for it. If you opened it on another device, request a new link there.',
    samePw: 'Choose a password you have not used before.',
    saveFail: 'We could not save the password. Request a new link and try again.',
    notConfigured: 'Cloud accounts aren\u2019t set up yet.',
  }
};
let lang = (window.dcLang ? dcLang.get() : 'ko');
let state = 'checking';       // checking | form | bad | done
function t(k){ return I18N[lang][k] || I18N.en[k] || k; }
const $ = id => document.getElementById(id);
// The same rule the server enforces (D-016).
function passwordOk(pw){ return typeof pw === 'string' && pw.length >= 10 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw); }
let msgKeys = [], msgKind = '';
function setMsg(keys, kind){ msgKeys = keys ? [].concat(keys) : []; msgKind = kind || ''; paintMsg(); }
function paintMsg(){ const el = $('msg'); el.textContent = msgKeys.map(t).join(' '); el.className = 'msg' + (msgKind ? ' ' + msgKind : ''); }

function render(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.getAttribute('data-i18n')));
  $('langBtn').textContent = lang === 'ko' ? 'EN' : '한국어';
  document.title = 'DermCase | ' + t('title');
  $('title').textContent = t('title');
  $('subtitle').textContent = '';
  $('pwHint').textContent = t('pwHint');
  $('saveBtn').textContent = t('saveBtn');
  $('resetForm').classList.toggle('hide', state !== 'form');
  $('toLogin').parentNode.classList.toggle('hide', state === 'checking' || state === 'form');
  $('msg').setAttribute('aria-busy', state === 'checking' ? 'true' : 'false');
  paintMsg();
}
$('langBtn').addEventListener('click', () => { lang = lang === 'ko' ? 'en' : 'ko'; if(window.dcLang) dcLang.set(lang); render(); });

function go(next, keys, kind){ state = next; setMsg(keys, kind); render(); }

async function start(){
  // Read the one-time code, then take it out of the address bar so it is not left in history or a screenshot.
  const q = new URLSearchParams(window.location.search);
  const code = q.get('code') || '';
  const hash = window.location.hash || '';
  const hadError = q.has('error') || q.has('error_code') || /(^|[#&])(error|error_code)=/.test(hash);
  try { window.history.replaceState(null, '', window.location.pathname); } catch (e) { /* not fatal */ }
  if (!window.DermCaseCloud || !DermCaseCloud.enabled()) { go('bad', 'notConfigured', 'error'); return; }
  if (hadError || !/^[A-Za-z0-9._-]{8,256}$/.test(code)) { go('bad', ['badLink'], 'error'); return; }
  try {
    await DermCaseCloud.exchangeRecoveryCode(code);
    go('form', '', '');
    $('pw1').focus();
  } catch (e) {
    go('bad', ['badLink', 'sameBrowser'], 'error');
  }
}

$('resetForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  if (state !== 'form') return;
  const a = $('pw1').value, b = $('pw2').value;
  if (!passwordOk(a)) { setMsg('pwHint', 'error'); $('pw1').focus(); return; }
  if (a !== b) { setMsg('mismatch', 'error'); $('pw2').focus(); return; }
  $('saveBtn').disabled = true; $('saveBtn').textContent = t('working'); setMsg('', '');
  try {
    await DermCaseCloud.setNewPassword(a);
    $('pw1').value = ''; $('pw2').value = '';
    try { await DermCaseCloud.signOut(); } catch (e) { /* the password is already changed */ }
    go('done', 'done', 'ok');
  } catch (e) {
    const code = e && e.code;
    setMsg(code === 'same_password' ? 'samePw' : code === 'weak_password' ? 'pwHint' : 'saveFail', 'error');
  } finally {
    $('saveBtn').disabled = false; $('saveBtn').textContent = t('saveBtn');
  }
});
render();
start();
