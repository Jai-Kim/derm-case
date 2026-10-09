const I18N = {
  ko: {
    navApp: '앱으로', signOut: '로그아웃',
    h1: '내 증례', loading: '불러오는 중',
    needLogin: '저장된 증례를 보려면 로그인하세요.', signInLink: '로그인',
    notConfigured: '클라우드가 아직 설정되지 않았습니다. 저장된 증례는 기기에만 보관됩니다.',
    empty: '아직 저장된 증례가 없습니다. 앱에서 증례를 분석한 뒤 저장해 보세요.',
    deleteBtn: '삭제', confirmDelete: '이 증례를 삭제하시겠습니까?',
    loadErr: '증례를 불러오지 못했습니다.', ageUnit: '세',
    acctH: '계정 삭제', acctP: '계정과 저장된 증례를 모두 영구 삭제합니다. 되돌릴 수 없습니다. 기기 안에만 저장된 증례는 앱의 기록에서 따로 삭제하세요.',
    acctBtn: '계정과 모든 증례 삭제', acctConfirm: '계정과 저장된 모든 증례를 영구 삭제합니다. 계속하시겠습니까?', acctDone: '계정을 삭제했습니다.', acctFail: '삭제하지 못했습니다. 잠시 후 다시 시도하거나 개인정보 처리방침의 연락처로 삭제를 요청해 주세요.', privLink: '개인정보 처리방침',
  },
  en: {
    navApp: 'Open app', signOut: 'Sign out',
    h1: 'My cases', loading: 'Loading',
    needLogin: 'Sign in to see your saved cases.', signInLink: 'Sign in',
    notConfigured: 'Cloud isn\u2019t set up yet. Saved cases live on your device only.',
    empty: 'No saved cases yet. Analyze a case in the app, then save it.',
    deleteBtn: 'Delete', confirmDelete: 'Delete this case?',
    loadErr: 'Could not load your cases.', ageUnit: 'y',
    acctH: 'Delete account', acctP: 'Permanently deletes your account and every saved case. This cannot be undone. Cases saved only on this device are removed separately from the history in the app.',
    acctBtn: 'Delete account and all cases', acctConfirm: 'Permanently delete your account and all saved cases. Continue?', acctDone: 'Your account was deleted.', acctFail: 'Could not delete. Try again shortly, or request deletion using the contact in the privacy policy.', privLink: 'Privacy policy',
  }
};
let lang = (window.dcLang ? dcLang.get() : 'ko');
function t(k){ return I18N[lang][k] || I18N.en[k] || k; }
const $ = id => document.getElementById(id);

function applyStatic(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.getAttribute('data-i18n')));
  $('langBtn').textContent = lang === 'ko' ? 'EN' : '한국어';
}
const esc = DCSafe.esc;

function renderCases(rows){
  $('state').textContent = '';
  if (!rows.length){ $('state').textContent = t('empty'); $('list').classList.add('hide'); $('list').innerHTML = ''; return; }
  $('list').classList.remove('hide');
  $('list').innerHTML = rows.map(r => {
    const m = r.meta || {};
    const ctx = [m.age && (m.age + t('ageUnit')), m.sex, m.area].filter(Boolean).join(', ');
    const d = new Date(r.created_at);
    const date = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<div class="lib-row">
      <div style="min-width:0">
        <div class="dx-n">${esc(r.dx) || '-'}</div>
        <div class="dx-s">${ctx ? esc(ctx) + ', ' : ''}${esc(date)}</div>
      </div>
      <button class="hist-del" type="button" data-del="${esc(r.id)}">${t('deleteBtn')}</button>
    </div>`;
  }).join('');
  document.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', async () => {
    if (!confirm(t('confirmDelete'))) return;
    try { await DermCaseCloud.deleteCase(btn.getAttribute('data-del')); load(); } catch(e){ alert(e.message || e); }
  }));
}

async function load(){
  applyStatic();
  if (!window.DermCaseCloud || !DermCaseCloud.enabled()){
    $('state').textContent = t('notConfigured'); return;
  }
  const u = await DermCaseCloud.user();
  if (!u){
    $('state').innerHTML = `${t('needLogin')} <a href="/login" class="link">${t('signInLink')}</a>`;
    return;
  }
  $('accountLine').textContent = u.email || '';
  $('signOutBtn').classList.remove('hide');
  $('acctZone').classList.remove('hide');
  $('state').textContent = t('loading');
  try { renderCases(await DermCaseCloud.listCases()); }
  catch(e){ $('state').textContent = t('loadErr') + ' ' + (e.message || ''); }
}

$('langBtn').addEventListener('click', () => { lang = lang === 'ko' ? 'en' : 'ko'; if(window.dcLang) dcLang.set(lang); load(); });
$('signOutBtn').addEventListener('click', async () => { await DermCaseCloud.signOut(); window.location.href = '/'; });
$('delAcctBtn').addEventListener('click', async () => {
  if (!confirm(t('acctConfirm'))) return;
  const b = $('delAcctBtn'); b.disabled = true;
  try { await DermCaseCloud.deleteAccount(); $('acctMsg').textContent = t('acctDone'); setTimeout(() => { window.location.href = '/'; }, 1200); }
  catch(e){ b.disabled = false; $('acctMsg').textContent = t('acctFail'); }
});
load();
