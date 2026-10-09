// Local case history (localStorage only, never leaves the device)
const HKEY = 'dermcase_history';
function loadHistory(){ try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch(e){ return []; } }
function saveHistory(arr){ try { localStorage.setItem(HKEY, JSON.stringify(arr)); } catch(e){} }
function saveCase(result, meta){
  const arr = loadHistory();
  const dx = (result.assessment && result.assessment[0] && result.assessment[0].diagnosis) || '-';
  arr.unshift({ id: Date.now(), savedAt: new Date().toISOString(), dx, meta, result });
  saveHistory(arr.slice(0, 50));
  renderHistory();
}
function deleteCase(id){ saveHistory(loadHistory().filter(x => x.id !== id)); renderHistory(); }
function clearAllCases(){ if (confirm(t('confirmClear'))) { saveHistory([]); renderHistory(); } }
function renderHistory(){
  const arr = loadHistory();
  const el = document.getElementById('historyArea');
  if (!el) return;
  if (!arr.length){ el.innerHTML = ''; return; }
  const rows = arr.map(x => {
    const d = new Date(x.savedAt);
    const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    const m = x.meta || {};
    const ctx = [m.age && (m.age + t('ageUnit')), m.area, m.fitz && ('Fitzpatrick ' + m.fitz)].filter(Boolean).join(', ');
    return `<div class="hist-row">
      <button class="open" type="button" data-open="${esc(x.id)}">
        <div class="dx-n">${esc(x.dx)}</div>
        <div class="dx-s">${esc(ctx ? ctx + ', ' : '')}${esc(dateStr)}</div>
      </button>
      <button class="hist-del" type="button" data-del="${esc(x.id)}">${esc(t('deleteCase'))}</button>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="hist">
    <div class="hist-head"><h3>${esc(t('savedCases'))}</h3><button class="hist-del" type="button" id="histClear">${esc(t('clearAll'))}</button></div>
    <p class="fine" style="margin-top:4px">${esc(t('storageNote'))}</p>
    ${rows}
  </div>`;
  el.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => reopenCase(parseInt(b.getAttribute('data-open'),10))));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => deleteCase(parseInt(b.getAttribute('data-del'),10))));
  const hc = document.getElementById('histClear'); if (hc) hc.addEventListener('click', clearAllCases);
}
window.__renderHistory = renderHistory;
function reopenCase(id){
  const x = loadHistory().find(c => c.id === id);
  if (!x) return;
  renderOutput(x.result, x.meta);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.addEventListener('DOMContentLoaded', renderHistory);
