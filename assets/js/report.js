const L = {
  en: {
    title:'Clinical Literature Brief', sub:'AI-assisted, de-identified, for physician review',
    back:'Back to DermCase', pdf:'Save as PDF', generated:'Date stated in link', ageUnit:'y',
    sAssess:'Differential to consider', sTx:'Treatment options', sLit:'References',
    dxPrimary:'Most likely', dxAlt:'Also consider',
    axEff:'Efficacy', axOns:'Onset', axMon:'Monitoring', axKey:'Key consideration', axSrc:'Source',
    txNote:'Literature-derived options for physician review. Not a prescribing recommendation.',
    disc:'For clinical decision support only. Not a substitute for physician judgment. Validate all findings against current guidelines and patient-specific factors.',
    invalid:'This brief link is invalid or has expired.', unverified:'This brief is carried entirely inside the link you opened. DermCase keeps no copy and cannot verify who wrote it. Treat it as unverified and check each source yourself before relying on it.', searchTitle:'Search this title on PubMed',
    ev:{'guideline':[3,'Guideline'],'meta-analysis':[3,'Meta-analysis'],'rct':[3,'RCT'],'cohort':[2,'Cohort'],'review':[2,'Review'],'case-report':[1,'Case report']},
    sex:{'Male':'Male','Female':'Female','Other':'Other'}
  },
  ko: {
    title:'임상 문헌 브리프', sub:'AI 보조, 비식별, 의사 검토용',
    back:'DermCase 앱으로', pdf:'PDF로 저장', generated:'링크에 기재된 날짜', ageUnit:'세',
    sAssess:'감별 고려 질환', sTx:'치료 옵션', sLit:'참고문헌',
    dxPrimary:'가능성이 가장 높음', dxAlt:'함께 고려',
    axEff:'효능', axOns:'발현 시기', axMon:'모니터링', axKey:'핵심 고려사항', axSrc:'출처',
    txNote:'의사 검토용 문헌 기반 옵션입니다. 처방 권고가 아닙니다.',
    disc:'임상 의사결정 지원 목적으로만 사용하세요. 의사의 판단을 대체하지 않습니다. 모든 결과는 최신 가이드라인과 환자별 요인에 따라 검증하세요.',
    invalid:'유효하지 않거나 만료된 브리프 링크입니다.', unverified:'이 브리프의 내용은 열어 본 링크 안에 모두 들어 있습니다. DermCase는 사본을 보관하지 않으며 작성자를 확인할 수 없습니다. 검증되지 않은 자료로 보고, 활용하기 전에 각 출처를 직접 확인하세요.', searchTitle:'PubMed에서 이 제목 검색',
    ev:{'guideline':[3,'가이드라인'],'meta-analysis':[3,'메타분석'],'rct':[3,'RCT'],'cohort':[2,'코호트'],'review':[2,'리뷰'],'case-report':[1,'증례 보고']},
    sex:{'Male':'남성','Female':'여성','Other':'기타'}
  }
};
const FITZ_N={I:1,II:2,III:3,IV:4,V:5,VI:6};
const esc=DCSafe.esc;
const safeUrl=DCSafe.url, pubmed=DCSafe.pubmed;

function render(data, lang){
  const t = L[lang] || L.en;
  const result = data.result || {}, meta = data.meta || {};
  const assessment = result.assessment || [], refs = result.references || [], tc = result.treatment_comparison;
  document.documentElement.lang = lang;
  document.getElementById('backTxt').textContent = t.back;
  document.getElementById('pdfTxt').textContent = t.pdf;

  const tier = lvl => { const e = DCSafe.own(t.ev, lvl) ? t.ev[lvl] : null; return e ? `<span class="tier"><span class="gauge" data-n="${e[0]}" aria-hidden="true"><b></b><b></b><b></b></span>${esc(e[1])}</span>` : ''; };

  const parts = [];
  if(meta.age) parts.push(`<span>${esc(meta.age)}${t.ageUnit}</span>`);
  if(meta.sex) parts.push(`<span>${esc(DCSafe.own(t.sex, meta.sex) ? t.sex[meta.sex] : meta.sex)}</span>`);
  if(meta.area) parts.push(`<span>${esc(meta.area)}</span>`);
  if(meta.duration) parts.push(`<span>${esc(meta.duration)}</span>`);
  if(meta.fitz && DCSafe.own(FITZ_N, meta.fitz)) parts.push(`<span><i class="dot" style="background:var(--f${FITZ_N[meta.fitz]})"></i>Fitzpatrick ${esc(meta.fitz)}</span>`);
  const ctxHtml = parts.length ? `<div class="ctx-row"><div class="ctx">${parts.join('')}</div></div>` : '';

  const assessHtml = assessment.map((a,i)=>`<div><div class="dx-rank">${esc(i===0?t.dxPrimary:t.dxAlt)}</div><div class="dx"><h3>${esc(a.diagnosis)}</h3>${a.icd10?`<span class="tag">ICD-10 ${esc(a.icd10)}</span>`:''}</div><p class="rationale">${esc(a.rationale)}</p></div>`).join('');

  let txHtml = '';
  if(tc && Array.isArray(tc.options) && tc.options.length){
    const opts = tc.options, n = opts.length;
    const axes = [['efficacy',t.axEff],['onset',t.axOns],['monitoring',t.axMon],['key_consideration',t.axKey]];
    let cells = '<div class="rh"></div>' + opts.map(o=>`<div class="oh"><span class="oname">${esc(o.name)}</span>${tier(o.evidence_level)}</div>`).join('');
    axes.forEach(([k,lbl])=>{ if(opts.some(o=>o[k])) cells += `<div class="rh">${esc(lbl)}</div>` + opts.map(o=>`<div>${esc(o[k]||'')}</div>`).join(''); });
    if(opts.some(o=>o.source)) cells += `<div class="rh">${esc(t.axSrc)}</div>` + opts.map(o=>`<div>${o.source?`<a href="${safeUrl(o.url)||pubmed(o.name+' '+o.source)}" target="_blank" rel="noopener noreferrer">${esc(o.source)}</a>`:''}</div>`).join('');
    txHtml = `<section class="sec"><h2 class="sec-h">${t.sTx}</h2>${tc.rationale?`<p class="sec-lede">${esc(tc.rationale)}</p>`:''}<div class="cmp"><div class="cmp-grid" style="--n:${n}">${cells}</div></div><p class="fine">${t.txNote}</p></section>`;
  }

  const refHtml = refs.map(function(r){const direct=safeUrl(r.url);const href=direct||pubmed(r.title);const shown=direct||t.searchTitle;return `<div class="ref"><div>${tier(r.evidence_level)}</div><div><a class="ref-t" href="${href}" target="_blank" rel="noopener noreferrer">${esc(r.title)}<span aria-hidden="true"> ↗</span></a><p class="ref-rel">${esc(r.relevance)}</p><div class="ref-src"><span>${esc(r.source)}</span><a href="${href}" target="_blank" rel="noopener noreferrer" style="word-break:break-all">${esc(shown)}</a></div></div></div>`;}).join('');

  const dateStr = new Date(meta.sharedAt || Date.now()).toLocaleDateString(lang==='ko'?'ko-KR':'en-US',{year:'numeric',month:'short',day:'numeric'});

  document.getElementById('content').innerHTML = `
    <div class="warn-banner" role="note"><span>${esc(t.unverified)}</span></div>
    <div class="report-head">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <img class="mark mark-ink" src="/assets/darae-ink.svg" alt="" width="34" height="34" style="width:34px;height:34px;margin-top:2px">
        <div><h1>${t.title}</h1><div class="sub">${t.sub}</div></div>
      </div>
      <div class="gen">${t.generated}<br>${esc(dateStr)}</div>
    </div>
    <article class="brief">
      ${ctxHtml}
      ${assessHtml?`<section class="sec"><h2 class="sec-h">${t.sAssess}</h2><div class="dx-list">${assessHtml}</div></section>`:''}
      ${txHtml}
      ${refHtml?`<section class="sec"><h2 class="sec-h">${t.sLit}</h2>${refHtml}</section>`:''}
      <div class="brief-foot"><p class="fine">${t.disc}</p></div>
    </article>`;
}

(function(){
  let lang = 'en';
  try{
    const hash = window.location.hash.slice(1);
    if(!hash) throw new Error('no data');
    const data = JSON.parse(decodeURIComponent(escape(atob(hash))));
    lang = (data.lang === 'ko' || data.lang === 'en') ? data.lang : 'en';
    render(data, lang);
    document.getElementById('pdfBtn').addEventListener('click', ()=>window.print());
    if(new URLSearchParams(location.search).get('print')==='1'){ setTimeout(()=>window.print(), 450); }
  }catch(e){
    const t = L[lang] || L.en;
    document.getElementById('content').innerHTML = `<p class="state">${t.invalid}</p><p class="state"><a class="link" href="/app">${t.back}</a></p>`;
  }
})();
