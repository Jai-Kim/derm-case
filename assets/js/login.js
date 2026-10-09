const I18N = {
  ko: {
    navApp: '앱으로',
    signInTitle: '다시 오신 것을 환영합니다', signUpTitle: '계정 만들기',
    signInSub: '저장한 증례를 모든 기기에서 동기화하세요', signUpSub: '증례를 클라우드에 안전하게 보관하세요',
    email: '이메일', password: '비밀번호',
    signInBtn: '로그인', signUpBtn: '가입하기',
    toSignUp: '계정이 없으신가요? 가입하기', toSignIn: '이미 계정이 있으신가요? 로그인',
    privacy: 'DermCase는 증례 사진을 저장하지 않습니다. 클라우드에는 구조화된 증례 정보만 보관되며, 본인만 접근할 수 있습니다.',
    policy: '개인정보 처리방침',
    skip: '로그인 없이 계속',
    checkEmail: '확인 이메일을 보냈습니다. 메일함을 확인해 주세요.',
    notConfigured: '클라우드 계정이 아직 설정되지 않았습니다. 로그인 없이 앱을 사용할 수 있습니다.',
    working: '처리 중',
  },
  en: {
    navApp: 'Open app',
    signInTitle: 'Welcome back', signUpTitle: 'Create your account',
    signInSub: 'Sync your saved cases across devices', signUpSub: 'Keep your cases safely in the cloud',
    email: 'Email', password: 'Password',
    signInBtn: 'Sign in', signUpBtn: 'Create account',
    toSignUp: "Don't have an account? Sign up", toSignIn: 'Already have an account? Sign in',
    privacy: 'DermCase does not save your photos. The cloud holds only the structured case, accessible to you alone.',
    policy: 'Privacy policy',
    skip: 'Continue without an account',
    checkEmail: 'Check your email to confirm your account.',
    notConfigured: 'Cloud accounts aren\u2019t set up yet. You can use the app without signing in.',
    working: 'Working',
  }
};
let lang = (window.dcLang ? dcLang.get() : 'ko');
let mode = 'signin';
function t(k){ return I18N[lang][k] || I18N.en[k] || k; }
const $ = id => document.getElementById(id);

function render(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.getAttribute('data-i18n')));
  $('langBtn').textContent = lang === 'ko' ? 'EN' : '한국어';
  $('title').textContent = mode === 'signin' ? t('signInTitle') : t('signUpTitle');
  $('subtitle').textContent = mode === 'signin' ? t('signInSub') : t('signUpSub');
  $('submitBtn').textContent = mode === 'signin' ? t('signInBtn') : t('signUpBtn');
  $('toggleMode').textContent = mode === 'signin' ? t('toSignUp') : t('toSignIn');
  $('password').autocomplete = mode === 'signin' ? 'current-password' : 'new-password';
}
function setMsg(text, kind){
  const el = $('msg');
  el.textContent = text || '';
  el.className = 'msg' + (kind ? ' ' + kind : '');
}

$('langBtn').addEventListener('click', () => { lang = lang === 'ko' ? 'en' : 'ko'; if(window.dcLang) dcLang.set(lang); render(); });
$('toggleMode').addEventListener('click', () => { mode = mode === 'signin' ? 'signup' : 'signin'; setMsg(''); render(); });

$('submitBtn').addEventListener('click', async () => {
  setMsg('');
  if (!window.DermCaseCloud || !DermCaseCloud.enabled()) { setMsg(t('notConfigured'), 'error'); return; }
  const email = $('email').value.trim(), pw = $('password').value;
  if (!email || !pw) return;
  $('submitBtn').disabled = true; const orig = $('submitBtn').textContent; $('submitBtn').textContent = t('working');
  try {
    if (mode === 'signin') {
      await DermCaseCloud.signIn(email, pw);
      window.location.href = '/app';
    } else {
      const data = await DermCaseCloud.signUp(email, pw);
      if (data && data.session) { window.location.href = '/app'; }
      else { setMsg(t('checkEmail'), 'ok'); }
    }
  } catch (e) {
    setMsg(e.message || String(e), 'error');
  } finally {
    $('submitBtn').disabled = false; $('submitBtn').textContent = orig;
  }
});
render();
