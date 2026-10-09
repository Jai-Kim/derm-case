const I18N = {
  ko: {
    navAbout: '소개',
    caseTitle: '새 증례',
    trySample: '예시 불러오기',
    sampleLoaded: '예시를 불러왔습니다',
    uploadText: '사진을 끌어다 놓거나 <b>파일 선택</b>',
    uploadSub: 'JPG, PNG, 최대 3장. DermCase는 저장하지 않습니다.',
    patientContext: '환자 정보',
    age: '나이', agePh: '예: 42', ageUnit: '세',
    sex: '성별', sexSelect: '선택', sexMale: '남성', sexFemale: '여성', sexOther: '기타 / 미지정',
    area: '발생 부위', areaPh: '예: 왼쪽 팔뚝, 두피',
    fitzLabel: '피부 유형 (Fitzpatrick, 선택)',
    fitzI: '항상 화상, 태닝되지 않음', fitzII: '대개 화상, 약간 태닝', fitzIII: '때때로 화상, 고르게 태닝',
    fitzIV: '거의 화상 없음, 쉽게 태닝', fitzV: '매우 드물게 화상, 짙게 태닝', fitzVI: '화상 없음, 짙은 색소',
    duration: '기간', durationPh: '예: 3주, 6개월',
    reportLang: '보고서 언어',
    notes: '추가 메모 (선택)', notesPh: '증상, 이전 치료, 관련 병력',
    analyzeBtn: '증례 분석',
    deid: '비식별화된 증례만 입력하세요.',
    disclaimer: '임상의를 위한 문헌 참고 도구입니다. DermCase는 의료기기가 아니며 어떤 질환도 진단, 치료, 완치 또는 예방하지 않습니다. 의사의 판단을 대체하지 않으며 응급 상황을 위한 도구가 아닙니다. 모든 결과는 최신 가이드라인과 환자별 요인에 따라 검증하세요.',
    emptyTitle: '브리프가 여기에 표시됩니다',
    emptyBody: '사진을 1장에서 3장 올리고 환자 정보를 입력한 뒤 증례 분석을 누르세요. 감별진단과 참고문헌, 선택이 분명하지 않은 경우에는 치료 옵션 비교까지 한 장으로 정리됩니다. 먼저 결과가 어떤 모습인지 보고 싶다면 예시를 열어 보세요.',
    analyzing: '사진을 읽고 문헌을 검색하고 있습니다',
    ldTitle: '증례를 분석하고 있습니다', ldRead: '사진 읽는 중', ldSearch: '문헌 검색 중', ldWrite: '브리프 작성 중', ldSources: '출처 {n}건', ldSourcesTotal: '출처 {n}건 확인', ldUsually: '보통 30초에서 60초 걸립니다', ldLong: '평소보다 오래 걸리고 있습니다. 계속 진행 중입니다.',
    ready: '브리프가 준비되었습니다',
    optimizing: '이미지 처리 중',
    removePhoto: '사진 삭제', addPhoto: '사진 추가',
    briefTitle: '브리프',
    copyChart: '차트용 복사', copied: '복사됨',
    shareReport: '링크 공유', linkCopied: '링크 복사됨', exportPdf: 'PDF',
    newCase: '새 증례',
    navSignIn: '로그인', navLibrary: '내 증례', navSignOut: '로그아웃', savedCloud: '클라우드에 저장됨',
    saveCase: '저장', caseSaved: '저장됨',
    rejTitle: '이 이미지는 분석할 수 없습니다', rejBody: '임상 피부 사진으로 보이지 않습니다. 평가하려는 피부, 손발톱, 모발, 점막 부위가 선명하게 보이는 사진을 올려 주세요.', rejDetected: '인식된 내용:', rejTryAnother: '다른 사진으로 시도',
    errRate: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.', errCap: '오늘 분석 가능 횟수에 도달했습니다. 내일 다시 시도하거나 개발자에게 문의하세요.', errBusy: '분석 서비스가 일시적으로 혼잡합니다. 1분 뒤 다시 시도하세요.', errTimeout: '분석 시간이 너무 오래 걸렸습니다. 사진 수를 줄이거나 다시 시도하세요.', errBig: '사진 용량이 너무 큽니다. 사진 수를 줄이거나 더 작은 사진을 사용하세요.', errBad: '입력 내용을 확인하세요. 메모가 너무 길거나 사진 형식이 지원되지 않을 수 있습니다.',
    errTitle: '분석하지 못했습니다', errHint: '잠시 후 다시 시도하세요. 계속 실패하면 아래 내용을 함께 알려 주세요.',
    savedCases: '저장된 증례', noCases: '저장된 증례 없음',
    clearAll: '전체 삭제', deleteCase: '삭제',
    storageNote: '증례는 이 기기에만 저장됩니다. 서버로 전송되지 않습니다.',
    confirmClear: '저장된 모든 증례를 삭제하시겠습니까?',
    privacyLink: '개인정보 처리방침',
    sendNote: '분석하면 사진과 증례 정보가 AI 제공사(Anthropic)로 전송됩니다.',
    sectionAssessment: '감별 고려 질환', sectionLit: '참고문헌', sectionTreatment: '치료 옵션',
    dxPrimary: '가능성이 가장 높음', dxAlt: '함께 고려',
    txEfficacy: '효능', txOnset: '발현 시기', txMonitoring: '모니터링', txConsideration: '핵심 고려사항', rowSource: '출처',
    txDisclaimer: '의사 검토용 문헌 기반 옵션입니다. 처방 권고가 아닙니다.',
    refVerify: 'PubMed에서 확인', refSearch: 'PubMed 검색 결과로 연결됩니다',
    partialNote: '응답이 길어 일부가 잘렸습니다. 받은 부분까지 표시합니다. 다시 분석하면 전체를 받을 수 있습니다.', rerun: '다시 분석', errCut: '응답이 너무 길어 끝까지 받지 못했습니다. 다시 시도해 주세요.',
    exTag: '예시', exNote: '예시 출력입니다. 내 증례를 분석하려면 사진을 추가하세요.', clearExample: '예시 지우기', seeExample: '예시 브리프 보기', cancel: '취소', canceled: '분석을 취소했습니다', secUnit: '초',
    evGuideline: '가이드라인', evMetaAnalysis: '메타분석', evRct: 'RCT', evCohort: '코호트 연구', evReview: '리뷰', evCaseReport: '증례 보고',
  },
  en: {
    navAbout: 'About',
    caseTitle: 'New case',
    trySample: 'Load example',
    sampleLoaded: 'Example loaded',
    uploadText: 'Drop photos here or <b>browse</b>',
    uploadSub: 'JPG or PNG, up to 3. DermCase does not save them.',
    patientContext: 'Patient',
    age: 'Age', agePh: 'e.g. 42', ageUnit: 'y',
    sex: 'Sex', sexSelect: 'Select', sexMale: 'Male', sexFemale: 'Female', sexOther: 'Other / Not specified',
    area: 'Affected area', areaPh: 'e.g. left forearm, scalp',
    fitzLabel: 'Skin type (Fitzpatrick, optional)',
    fitzI: 'Always burns, never tans', fitzII: 'Usually burns, tans minimally', fitzIII: 'Sometimes burns, tans evenly',
    fitzIV: 'Rarely burns, tans easily', fitzV: 'Very rarely burns, tans darkly', fitzVI: 'Never burns, deeply pigmented',
    duration: 'Duration', durationPh: 'e.g. 3 weeks, 6 months',
    reportLang: 'Report language',
    notes: 'Additional notes (optional)', notesPh: 'Symptoms, prior treatments, relevant history',
    analyzeBtn: 'Analyze case',
    deid: 'Use de-identified cases only.',
    disclaimer: 'A literature reference for clinicians. DermCase is not a medical device and does not diagnose, treat, cure or prevent any medical condition. It does not replace physician judgment and is not for emergencies. Validate all findings against current guidelines and patient-specific factors.',
    emptyTitle: 'Your brief appears here',
    emptyBody: 'Add one to three photos and a few details, then select Analyze case. You get the assessment and references, plus a treatment comparison when the choice is not obvious. Want to see the result first? Open the example.',
    analyzing: 'Reading the photo and searching the literature',
    ldTitle: 'Working on your case', ldRead: 'Reading the photo', ldSearch: 'Searching the literature', ldWrite: 'Writing the brief', ldSources: '{n} sources', ldSourcesTotal: '{n} sources checked', ldUsually: 'Usually 30 to 60 seconds', ldLong: 'Taking longer than usual. Still working.',
    ready: 'Brief ready',
    optimizing: 'Processing image',
    removePhoto: 'Remove photo', addPhoto: 'Add photo',
    briefTitle: 'Brief',
    copyChart: 'Copy for chart', copied: 'Copied',
    shareReport: 'Share link', linkCopied: 'Link copied', exportPdf: 'PDF',
    newCase: 'New case',
    navSignIn: 'Sign in', navLibrary: 'My cases', navSignOut: 'Sign out', savedCloud: 'Saved to library',
    saveCase: 'Save', caseSaved: 'Saved',
    rejTitle: "This image can't be analyzed", rejBody: "It doesn't look like a clinical skin photo. Upload a clear photo of the skin, nail, hair, or mucosal finding you want assessed.", rejDetected: 'Appears to show:', rejTryAnother: 'Try another image',
    errRate: 'Too many requests. Please wait a moment and try again.', errCap: 'Today\'s analysis limit has been reached. Try again tomorrow or contact the developer.', errBusy: 'The analysis service is busy. Try again in a minute.', errTimeout: 'The analysis took too long. Try fewer photos or run it again.', errBig: 'The photos are too large. Use fewer or smaller photos.', errBad: 'Please check your input. The notes may be too long or the photo format is not supported.',
    errTitle: 'The analysis failed', errHint: 'Try again in a moment. If it keeps failing, share the details below.',
    savedCases: 'Saved cases', noCases: 'No saved cases yet',
    clearAll: 'Clear all', deleteCase: 'Delete',
    storageNote: 'Cases are stored only on this device. Nothing is sent to a server.',
    confirmClear: 'Delete all saved cases?',
    privacyLink: 'Privacy policy',
    sendNote: 'Analyzing sends the photo and case details to an AI provider (Anthropic).',
    sectionAssessment: 'Differential to consider', sectionLit: 'References', sectionTreatment: 'Treatment options',
    dxPrimary: 'Most likely', dxAlt: 'Also consider',
    txEfficacy: 'Efficacy', txOnset: 'Onset', txMonitoring: 'Monitoring', txConsideration: 'Key consideration', rowSource: 'Source',
    txDisclaimer: 'Literature-derived options for physician review. Not a prescribing recommendation.',
    refVerify: 'Check on PubMed', refSearch: 'Opens a PubMed search',
    partialNote: 'The response was cut off, so some sections may be missing. Run the analysis again for the full brief.', rerun: 'Run again', errCut: 'The response was too long to finish. Please try again.',
    exTag: 'Example', exNote: 'Example output. Add your own photo to analyze a real case.', clearExample: 'Clear example', seeExample: 'See an example brief', cancel: 'Cancel', canceled: 'Analysis canceled', secUnit: 's',
    evGuideline: 'Guideline', evMetaAnalysis: 'Meta-analysis', evRct: 'RCT', evCohort: 'Cohort', evReview: 'Review', evCaseReport: 'Case report',
  }
};

const SAMPLE_CASE = {
  age: '47', sex: 'Female', area: 'Bilateral shins and elbows',
  duration: '8 months, worsening', fitz: 'III',
  notes: 'Well-demarcated erythematous plaques with thick silvery scale. Failed 3 months of high-potency topical corticosteroids and vitamin D analog. History of mild hypertension. Patient asks about systemic options. Fitzpatrick III.'
};

const EXAMPLE = {
  en: { relevant:true,
    assessment:[
      {diagnosis:'Plaque psoriasis',icd10:'L40.0',rationale:'Well-demarcated erythematous plaques with thick silvery scale on the extensor surfaces, not responding to potent topical corticosteroids and a vitamin D analog.'},
      {diagnosis:'Nummular eczema',icd10:'L30.0',rationale:'Less likely given the scale thickness and symmetric extensor distribution, but worth excluding if the plaque margins are indistinct.'}],
    references:[
      {title:'Joint AAD-NPF guidelines of care for the management and treatment of psoriasis with biologics',relevance:'Covers biologic selection and pre-treatment screening for moderate to severe plaque psoriasis.',source:'J Am Acad Dermatol, 2019',url:'',evidence_level:'guideline'},
      {title:'Joint AAD-NPF guidelines of care for the management and treatment of psoriasis with systemic nonbiologic therapies',relevance:'Covers methotrexate and other oral systemic options, including monitoring.',source:'J Am Acad Dermatol, 2020',url:'',evidence_level:'guideline'},
      {title:'Pathophysiology, clinical presentation, and treatment of psoriasis: a review',relevance:'Overview of presentation and the treatment ladder, useful for context.',source:'JAMA, 2020',url:'',evidence_level:'review'}],
    treatment_comparison:{rationale:'Failure of topical therapy raises the question of systemic treatment, and a history of mild hypertension bears on agent choice.',
      options:[
        {name:'IL-17 or IL-23 inhibitor',evidence_level:'rct',efficacy:'Highest rates of near-complete skin clearance among systemic options in pivotal trials.',onset:'Often within the first 4 to 12 weeks.',monitoring:'TB screening before starting; periodic clinical review.',key_consideration:'Cost and prior authorization are the main barriers.',source:'Menter, JAAD 2019',url:''},
        {name:'Methotrexate',evidence_level:'guideline',efficacy:'Moderate response, with lower clearance rates than biologics.',onset:'Typically 8 to 12 weeks.',monitoring:'CBC and liver enzymes at baseline and periodically.',key_consideration:'Low cost and oral, but the monitoring burden and hepatic risk are real.',source:'Menter, JAAD 2020',url:''},
        {name:'Apremilast',evidence_level:'guideline',efficacy:'Lower clearance rates than biologics in pivotal trials.',onset:'Gradual, over several weeks to months.',monitoring:'No routine laboratory monitoring; watch weight and mood.',key_consideration:'A convenient oral option when biologics or methotrexate are unsuitable.',source:'Menter, JAAD 2020',url:''}]}},
  ko: { relevant:true,
    assessment:[
      {diagnosis:'판상 건선',icd10:'L40.0',rationale:'신전부에 경계가 분명한 홍반성 판과 두꺼운 은백색 비늘이 있고, 고효능 국소 스테로이드와 비타민 D 유도체에 반응하지 않았습니다.'},
      {diagnosis:'화폐상 습진',icd10:'L30.0',rationale:'비늘 두께와 대칭적인 신전부 분포를 고려하면 가능성은 낮지만, 판의 경계가 불분명하면 배제가 필요합니다.'}],
    references:[
      {title:'Joint AAD-NPF guidelines of care for the management and treatment of psoriasis with biologics',relevance:'중등도 이상 판상 건선에서 생물학적 제제 선택과 투여 전 검사를 다룹니다.',source:'J Am Acad Dermatol, 2019',url:'',evidence_level:'guideline'},
      {title:'Joint AAD-NPF guidelines of care for the management and treatment of psoriasis with systemic nonbiologic therapies',relevance:'메토트렉세이트 등 경구 전신 치료와 모니터링을 다룹니다.',source:'J Am Acad Dermatol, 2020',url:'',evidence_level:'guideline'},
      {title:'Pathophysiology, clinical presentation, and treatment of psoriasis: a review',relevance:'임상 양상과 치료 단계를 개괄하며 배경 이해에 유용합니다.',source:'JAMA, 2020',url:'',evidence_level:'review'}],
    treatment_comparison:{rationale:'국소 치료에 실패해 전신 치료를 고려하는 상황이며, 경미한 고혈압 병력이 약제 선택에 영향을 줍니다.',
      options:[
        {name:'IL-17 또는 IL-23 억제제',evidence_level:'rct',efficacy:'주요 임상시험에서 전신 치료제 중 피부 청소율이 가장 높았습니다.',onset:'대개 4주에서 12주 이내에 반응이 나타납니다.',monitoring:'투여 전 결핵 검사와 주기적 임상 평가가 필요합니다.',key_consideration:'비용과 사전승인이 주된 장벽입니다.',source:'Menter, JAAD 2019',url:''},
        {name:'메토트렉세이트',evidence_level:'guideline',efficacy:'반응은 중간 정도이며 생물학적 제제보다 청소율이 낮습니다.',onset:'보통 8주에서 12주.',monitoring:'기저 시점과 이후 주기적으로 CBC와 간 효소를 확인합니다.',key_consideration:'저렴한 경구제이지만 모니터링 부담과 간 위험이 실제로 존재합니다.',source:'Menter, JAAD 2020',url:''},
        {name:'아프레밀라스트',evidence_level:'guideline',efficacy:'주요 임상시험에서 생물학적 제제보다 청소율이 낮았습니다.',onset:'수주에서 수개월에 걸쳐 서서히 나타납니다.',monitoring:'정기 검사는 필요 없으며 체중과 기분 변화를 살핍니다.',key_consideration:'생물학적 제제나 메토트렉세이트가 적합하지 않을 때 편리한 경구 선택지입니다.',source:'Menter, JAAD 2020',url:''}]}}
};
let currentLang = (window.dcLang ? dcLang.get() : 'ko');
function t(key) { return I18N[currentLang][key] || I18N.en[key] || key; }
const esc=DCSafe.esc;
function applyI18n() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  const sex = document.getElementById('sex');
  if (sex) {
    const keys = ['sexSelect','sexMale','sexFemale','sexOther'];
    Array.from(sex.options).forEach((opt, i) => { if (keys[i]) opt.text = t(keys[i]); });
  }
}
function announce(msg){const s=document.getElementById('status');if(s)s.textContent=msg;}

let images = []; const MAX_IMAGES = 3;
const dropZone=document.getElementById('dropZone'),fileInput=document.getElementById('fileInput'),uploadPrompt=document.getElementById('uploadPrompt'),uploadLoading=document.getElementById('uploadLoading'),thumbGrid=document.getElementById('thumbGrid'),analyzeBtn=document.getElementById('analyzeBtn'),outputArea=document.getElementById('outputArea'),emptyState=document.getElementById('emptyState');
function setOutput(html){outputArea.innerHTML=html||'';emptyState.style.display=html?'none':'';}

function processFile(file){
  return new Promise((resolve,reject)=>{
    if(!file||!file.type.startsWith('image/')){reject();return;}
    const img=new Image();const url=URL.createObjectURL(file);
    img.onload=()=>{URL.revokeObjectURL(url);const MAX=1200;let w=img.width,h=img.height;if(w>MAX||h>MAX){const s=Math.min(MAX/w,MAX/h);w=Math.round(w*s);h=Math.round(h*s);}const cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);const dataUrl=cv.toDataURL('image/jpeg',0.82);resolve({base64:dataUrl.split(',')[1],mime:'image/jpeg',dataUrl});};
    img.onerror=()=>{URL.revokeObjectURL(url);reject();};
    img.src=url;
  });
}
async function loadImages(fileList){
  const files=Array.from(fileList||[]).filter(f=>f.type&&f.type.startsWith('image/'));
  const room=MAX_IMAGES-images.length;
  if(!files.length||room<=0)return;
  uploadPrompt.style.display='none';thumbGrid.style.display='none';uploadLoading.style.display='flex';
  for(const f of files.slice(0,room)){try{const im=await processFile(f);images.push(im);}catch(e){}}
  uploadLoading.style.display='none';
  renderThumbs();updateBtn();
}
function renderThumbs(){
  if(!images.length){uploadPrompt.style.display='flex';thumbGrid.style.display='none';thumbGrid.innerHTML='';return;}
  uploadPrompt.style.display='none';thumbGrid.style.display='grid';
  const tiles=images.map((im,i)=>`<div class="thumb"><img src="${im.dataUrl}" alt=""><button data-rm="${i}" type="button" aria-label="${esc(t('removePhoto'))} ${i+1}">✕</button></div>`).join('');
  const add=images.length<MAX_IMAGES?`<button id="addTile" type="button" class="thumb-add" aria-label="${esc(t('addPhoto'))}">+</button>`:'';
  thumbGrid.innerHTML=tiles+add;
  thumbGrid.querySelectorAll('[data-rm]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();removeImage(parseInt(b.getAttribute('data-rm'),10));}));
  const at=document.getElementById('addTile');if(at)at.addEventListener('click',()=>fileInput.click());
}
function removeImage(i){images.splice(i,1);renderThumbs();updateBtn();}
function resetImages(){images=[];fileInput.value='';renderThumbs();updateBtn();}
function updateBtn(){analyzeBtn.disabled=images.length===0;}

document.addEventListener('DOMContentLoaded', () => { document.getElementById('lang').value = currentLang; applyI18n(); });
document.getElementById('lang').addEventListener('change', e => { currentLang = e.target.value; if(window.dcLang) dcLang.set(currentLang); applyI18n(); if(window.__renderAuth) window.__renderAuth(); if(window.__renderFitz) window.__renderFitz(); if(window.__renderHistory) window.__renderHistory(); });
const SAMPLE_TXT = {
  ko: { area: '양쪽 정강이와 팔꿈치', duration: '8개월, 악화 중',
        notes: '경계가 분명한 홍반성 판과 두꺼운 은백색 비늘. 고효능 국소 스테로이드와 비타민 D 유도체를 3개월 사용했으나 반응이 없었음. 경증 고혈압 병력. 환자가 전신 치료 옵션을 문의함. Fitzpatrick III.' }
};
document.getElementById('sampleBtn').addEventListener('click', () => {
  const S = Object.assign({}, SAMPLE_CASE, SAMPLE_TXT[currentLang] || {});
  document.getElementById('age').value = S.age;
  document.getElementById('sex').value = S.sex;
  document.getElementById('area').value = S.area;
  document.getElementById('duration').value = S.duration;
  document.getElementById('notes').value = S.notes;
  fitz = S.fitz || ''; renderFitz();
  const b = document.getElementById('sampleBtn');
  const orig = t('trySample');
  b.textContent = t('sampleLoaded');
  setTimeout(() => { b.textContent = orig; }, 2600);
  renderOutput(EXAMPLE[currentLang] || EXAMPLE.en, Object.assign({}, S), { example: true });
});

// Fitzpatrick skin-type picker
let fitz = '';
const fitzDescEl = document.getElementById('fitzDesc');
function renderFitz(){
  document.querySelectorAll('.fitz-chip').forEach(function(ch){ const on = ch.getAttribute('data-fitz') === fitz; ch.classList.toggle('sel', on); ch.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  if(fitzDescEl) fitzDescEl.textContent = fitz ? (fitz + ': ' + t('fitz'+fitz)) : '';
}
function setFitz(v){ fitz = (fitz === v ? '' : v); renderFitz(); }
window.__renderFitz = renderFitz;
document.querySelectorAll('.fitz-chip').forEach(function(ch){
  var v = ch.getAttribute('data-fitz');
  ch.addEventListener('click', function(){ setFitz(v); });
  ch.addEventListener('mouseenter', function(){ if(!fitz && fitzDescEl) fitzDescEl.textContent = v + ': ' + t('fitz'+v); });
  ch.addEventListener('mouseleave', function(){ if(!fitz && fitzDescEl) fitzDescEl.textContent = ''; });
});
uploadPrompt.addEventListener('click',()=>fileInput.click());
document.getElementById('emptyExample').addEventListener('click',()=>document.getElementById('sampleBtn').click());
fileInput.addEventListener('change',e=>{loadImages(e.target.files);fileInput.value='';});
dropZone.addEventListener('dragover',e=>{e.preventDefault();dropZone.classList.add('over');});
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('over'));
dropZone.addEventListener('drop',e=>{e.preventDefault();dropZone.classList.remove('over');loadImages(e.dataTransfer.files);});
updateBtn();
analyzeBtn.addEventListener('click',runAnalysis);

let aborter = null, loader = null, stalled = false;
function caseChips(){
  const val=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const sexEl=document.getElementById('sex');
  const sexTxt=sexEl&&sexEl.value&&sexEl.selectedIndex>=0?sexEl.options[sexEl.selectedIndex].text:'';
  const age=val('age');
  return [age?age+t('ageUnit'):'',sexTxt,val('area'),val('duration'),fitz?'Fitzpatrick '+fitz:''].filter(Boolean);
}
function showProgress(){
  setOutput('<div id="loaderRoot"></div>');
  announce(t('analyzing'));
  if(loader){loader.stop();loader=null;}
  loader=window.DermLoader.mount(document.getElementById('loaderRoot'),{t:t,photo:images[0]&&images[0].dataUrl,chips:caseChips(),onCancel:function(){if(aborter)aborter.abort();},announce:announce});
}
function scrollToBrief(){
  if(window.matchMedia('(max-width: 999px)').matches){const el=document.getElementById('brief')||outputArea;el.scrollIntoView({behavior:'smooth',block:'start'});}
}

function apiError(code){const e=new Error(String(code||'upstream_error'));e.code=String(code||'upstream_error');e.api=true;return e;}
function errHint(err){
  if(err&&err.truncated)return t('errCut');
  const map={rate_limited:'errRate',daily_cap:'errCap',busy:'errBusy',timeout:'errTimeout',too_large:'errBig',invalid_request:'errBad'};
  return t((err&&err.api&&map[err.code])||'errHint');
}
// The server streams one JSON object per line: progress events, then {t:'done',content,stop_reason} or {t:'error',code}.
async function readAnalysis(resp){
  const reader=resp.body.getReader(),dec=new TextDecoder();
  let buf='',result=null,dog=null;
  const arm=()=>{clearTimeout(dog);dog=setTimeout(()=>{stalled=true;if(aborter)aborter.abort();},40000);};   // the server sends a heartbeat every 8 s
  arm();
  try{
    while(!result){
      const r=await reader.read();
      if(r.done)break;
      arm();
      buf+=dec.decode(r.value,{stream:true});
      let i;
      while((i=buf.indexOf('\n'))>=0){
        const line=buf.slice(0,i).trim();buf=buf.slice(i+1);
        if(!line)continue;
        let ev;try{ev=JSON.parse(line);}catch(e){continue;}
        if(ev.t==='done'){result={content:ev.content,stop_reason:ev.stop_reason};break;}
        if(ev.t==='error')throw apiError(ev.code);
        if(loader)loader.event(ev);
      }
    }
  }finally{clearTimeout(dog);try{reader.cancel();}catch(e){}}
  if(!result)throw apiError('upstream_error');
  return result;
}
async function runAnalysis(){
  const age=document.getElementById('age').value.trim(),sex=document.getElementById('sex').value,area=document.getElementById('area').value.trim(),duration=document.getElementById('duration').value.trim(),notes=document.getElementById('notes').value.trim(),lang=document.getElementById('lang').value;currentLang=lang;
  analyzeBtn.disabled=true;stalled=false;showProgress();scrollToBrief();aborter=new AbortController();
  try{
    // The server owns the model, the prompt and the limits. The browser sends only the photos and the case fields.
    const resp=await fetch('/api/analyze',{method:'POST',signal:aborter.signal,headers:{'Content-Type':'application/json','Accept':'application/x-ndjson'},body:JSON.stringify({lang:lang,images:images.map(im=>({mime:im.mime,data:im.base64})),case:{age:age,sex:sex,area:area,duration:duration,fitz:fitz,notes:notes}})});
    const ctype=resp.headers.get('content-type')||'';
    let data;
    if(resp.ok&&ctype.includes('application/x-ndjson')&&resp.body){data=await readAnalysis(resp);}
    else if(ctype.includes('application/json')){
      data=await resp.json();
      if(!resp.ok||data.error)throw apiError(data&&data.error&&data.error.code);
    }else{throw apiError('upstream_error');}
    let raw='';
    for(const b of(data.content||[])){if(b.type==='text')raw+=b.text;}
    if(!raw)throw new Error('No text in response.\n\n'+JSON.stringify(data,null,2));
    let clean=raw.trim();
    const fenceMatch=clean.match(/```(?:json)?\s*([\s\S]*?)```/);
    if(fenceMatch){clean=fenceMatch[1].trim();}else{const b0=clean.indexOf('{'),b1=clean.lastIndexOf('}');if(b0!==-1&&b1!==-1)clean=clean.slice(b0,b1+1);}
    clean=clean.replace(/[\r\n]/g,' ');
    let parsed,partial=false;
    try{parsed=JSON.parse(clean);}
    catch(e){
      const fixed=repairJson(clean);
      if(fixed&&fixed.assessment&&fixed.assessment.length){parsed=fixed;partial=true;}
      else{const er=new Error('JSON parse failed.\n\nRaw:\n'+raw);er.truncated=(data.stop_reason==='max_tokens');throw er;}
    }
    // the answer is in: finish the loading screen (bar to 100%, every step ticked), then show the brief
    if(loader){await new Promise(r=>loader.finish(r));}
    if(parsed && parsed.relevant===false){ renderRejection(parsed.rejection||{}); analyzeBtn.disabled=false; return; }
    renderOutput(parsed,null,{partial:partial});
  }catch(err){
    if(err&&err.name==='AbortError'&&stalled){err=apiError('timeout');}
    if(err&&err.name==='AbortError'){setOutput('');analyzeBtn.disabled=images.length===0;announce(t('canceled'));return;}
    setOutput(`<div class="notice err" role="alert"><span class="notice-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg></span><div><h3>${esc(t('errTitle'))}</h3><p>${esc(errHint(err))}</p><button class="btn btn-solid btn-sm" id="retryBtn" type="button">${esc(t('rerun'))}</button><pre>${esc(String(err&&err.message||err).slice(0,400))}</pre></div></div>`);
    analyzeBtn.disabled=false;
    const rb=document.getElementById('retryBtn'); if(rb) rb.addEventListener('click',()=>{ analyzeBtn.click(); });
  }finally{if(loader){loader.stop();loader=null;}aborter=null;}
}

/*REPAIR_START*/
function repairJson(s){
  // A cut-off answer is unfinished JSON. Keep everything up to the last complete value, then close what is still open.
  var stack=[],inStr=false,esc=false,cut=-1,closers='',i,ch;
  for(i=0;i<s.length;i++){
    ch=s.charAt(i);
    if(inStr){ if(esc)esc=false; else if(ch==='\\')esc=true; else if(ch==='"')inStr=false; continue; }
    if(ch==='"'){inStr=true;continue;}
    if(ch==='{')stack.push('}'); else if(ch==='[')stack.push(']');
    else if(ch==='}'||ch===']'){ stack.pop(); cut=i+1; closers=stack.slice().reverse().join(''); }
  }
  if(cut<0)return null;
  try{ return JSON.parse(s.slice(0,cut)+closers); }catch(e){ return null; }
}
/*REPAIR_END*/
// Links from the model are followed only when they point at a known publisher over https (see assets/safe.js).
const safeUrl=DCSafe.url, pubmedSearch=DCSafe.pubmed;
function refHref(r){return safeUrl(r&&r.url)||pubmedSearch(r&&r.title);}

function renderRejection(rej){
  const detected = rej && rej.detected ? `<p style="margin-top:8px"><b>${esc(t('rejDetected'))}</b> ${esc(rej.detected)}</p>` : '';
  const reason = (rej && rej.reason) ? rej.reason : t('rejBody');
  setOutput(`<div class="notice" role="alert"><span class="notice-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5l16 14M21 6.5V17a2 2 0 0 1-2 2H7m-3-1V7a2 2 0 0 1 2-2h11"/><circle cx="9" cy="10" r="1.6" fill="currentColor"/></svg></span><div><h3>${esc(t('rejTitle'))}</h3><p>${esc(reason)}</p>${detected}<button class="btn btn-solid btn-sm" id="rejNewBtn" type="button">${esc(t('rejTryAnother'))}</button></div></div>`);
  const b=document.getElementById('rejNewBtn'); if(b) b.addEventListener('click',()=>{ resetImages(); setOutput(''); });
}

const EV={'guideline':{n:3,k:'evGuideline'},'meta-analysis':{n:3,k:'evMetaAnalysis'},'rct':{n:3,k:'evRct'},'cohort':{n:2,k:'evCohort'},'review':{n:2,k:'evReview'},'case-report':{n:1,k:'evCaseReport'}};
const FITZ_N={I:1,II:2,III:3,IV:4,V:5,VI:6};
function tier(level){const e=EV[level];if(!e)return '';return `<span class="tier"><span class="gauge" data-n="${e.n}" aria-hidden="true"><b></b><b></b><b></b></span>${esc(t(e.k))}</span>`;}
function readMeta(){const v=id=>document.getElementById(id).value.trim();return {age:v('age'),sex:document.getElementById('sex').value,area:v('area'),duration:v('duration'),fitz:fitz};}
function payloadFor(d,meta){return btoa(unescape(encodeURIComponent(JSON.stringify({result:d,meta:Object.assign({},meta,{sharedAt:new Date().toISOString()}),lang:currentLang}))));}
function ctxHtml(meta){
  const sexMap={Male:t('sexMale'),Female:t('sexFemale'),Other:t('sexOther')};
  const parts=[];
  if(meta.age)parts.push(`<span>${esc(meta.age)}${esc(t('ageUnit'))}</span>`);
  if(meta.sex)parts.push(`<span>${esc(sexMap[meta.sex]||meta.sex)}</span>`);
  if(meta.area)parts.push(`<span>${esc(meta.area)}</span>`);
  if(meta.duration)parts.push(`<span>${esc(meta.duration)}</span>`);
  if(meta.fitz&&FITZ_N[meta.fitz])parts.push(`<span><i class="dot" style="background:var(--f${FITZ_N[meta.fitz]})"></i>Fitzpatrick ${esc(meta.fitz)}</span>`);
  return parts.join('')||`<span>${esc(t('briefTitle'))}</span>`;
}

function renderOutput(d, metaIn, opts){
  opts=opts||{};const ex=!!opts.example;
  const partialBanner=opts.partial?`<div class="warn-banner" role="status"><span>${esc(t('partialNote'))}</span><button class="btn btn-line btn-sm" id="rerunBtn" type="button">${esc(t('rerun'))}</button></div>`:'';
  const meta=metaIn||readMeta();
  const assessment=d.assessment||[],refs=d.references||[],tc=d.treatment_comparison;
  const assessHtml=assessment.map((item,i)=>`<div><div class="dx-rank">${esc(t(i===0?'dxPrimary':'dxAlt'))}</div><div class="dx"><h3>${esc(item.diagnosis)}</h3>${item.icd10?`<span class="tag">ICD-10 ${esc(item.icd10)}</span>`:''}</div><p class="rationale">${esc(item.rationale)}</p></div>`).join('');
  let txHtml='';
  if(tc&&Array.isArray(tc.options)&&tc.options.length){
    const opts=tc.options,n=opts.length;
    const axes=[['efficacy','txEfficacy'],['onset','txOnset'],['monitoring','txMonitoring'],['key_consideration','txConsideration']];
    let cells='<div class="rh"></div>'+opts.map(o=>`<div class="oh"><span class="oname">${esc(o.name)}</span>${tier(o.evidence_level)}</div>`).join('');
    axes.forEach(([k,lbl])=>{ if(opts.some(o=>o[k])) cells+=`<div class="rh">${esc(t(lbl))}</div>`+opts.map(o=>`<div>${esc(o[k]||'')}</div>`).join(''); });
    if(opts.some(o=>o.source)) cells+=`<div class="rh">${esc(t('rowSource'))}</div>`+opts.map(o=>`<div>${o.source?`<a href="${safeUrl(o.url)||pubmedSearch(o.name+' '+o.source)}" target="_blank" rel="noopener noreferrer">${esc(o.source)}</a>`:''}</div>`).join('');
    txHtml=`<section class="sec"><h2 class="sec-h">${esc(t('sectionTreatment'))}</h2>${tc.rationale?`<p class="sec-lede">${esc(tc.rationale)}</p>`:''}<div class="cmp"><div class="cmp-grid" style="--n:${n}">${cells}</div></div><p class="fine">${esc(t('txDisclaimer'))}</p></section>`;
  }
  const refHtml=refs.map(r=>{const direct=safeUrl(r.url);const href=direct||pubmedSearch(r.title);const extra=direct?`<a href="${pubmedSearch(r.title)}" target="_blank" rel="noopener noreferrer">${esc(t('refVerify'))}</a>`:`<span>${esc(t('refSearch'))}</span>`;return `<div class="ref"><div>${tier(r.evidence_level)}</div><div><a class="ref-t" href="${href}" target="_blank" rel="noopener noreferrer">${esc(r.title)}<span aria-hidden="true"> ↗</span></a><p class="ref-rel">${esc(r.relevance)}</p><div class="ref-src"><span>${esc(r.source)}</span>${extra}</div></div></div>`;}).join('');
  const fullActions=`<div class="actions"><button class="btn btn-solid btn-sm" id="saveBtn" type="button">${esc(t('saveCase'))}</button><button class="btn btn-line btn-sm" id="copyBtn" type="button">${esc(t('copyChart'))}</button><button class="btn btn-line btn-sm" id="pdfBtn" type="button">${esc(t('exportPdf'))}</button><button class="btn btn-line btn-sm" id="shareBtn" type="button">${esc(t('shareReport'))}</button><button class="btn btn-quiet btn-sm" id="newBtn" type="button">${esc(t('newCase'))}</button></div>`;
  const exActions=`<div class="actions"><button class="btn btn-quiet btn-sm" id="newBtn" type="button">${esc(t('clearExample'))}</button></div>`;
  const exBanner=`<div class="ex-banner"><span class="ex-tag">${esc(t('exTag'))}</span><span>${esc(t('exNote'))}</span></div>`;
  setOutput(`<article class="brief" id="brief"><div class="brief-head"><div class="ctx">${ctxHtml(meta)}</div>${ex?exActions:fullActions}</div>${ex?exBanner:''}${partialBanner}${assessHtml?`<section class="sec"><h2 class="sec-h">${esc(t('sectionAssessment'))}</h2><div class="dx-list">${assessHtml}</div></section>`:''}${txHtml}${refHtml?`<section class="sec"><h2 class="sec-h">${esc(t('sectionLit'))}</h2>${refHtml}</section>`:''}</article>`);
  analyzeBtn.disabled=images.length===0;
  announce(t('ready'));
  scrollToBrief();
  const rr=document.getElementById('rerunBtn'); if(rr) rr.addEventListener('click',()=>{ analyzeBtn.click(); });
  if(!ex){
  document.getElementById('shareBtn').addEventListener('click',()=>{
    const url=window.location.origin+'/report#'+payloadFor(d,meta);
    navigator.clipboard.writeText(url).then(()=>{const btn=document.getElementById('shareBtn');btn.textContent=t('linkCopied');setTimeout(()=>btn.textContent=t('shareReport'),2000);});
  });
  document.getElementById('pdfBtn').addEventListener('click',()=>{ window.open('/report?print=1#'+payloadFor(d,meta),'_blank'); });
  document.getElementById('copyBtn').addEventListener('click',()=>{const lines=[t('sectionAssessment').toUpperCase()];assessment.forEach(x=>lines.push(`• ${x.diagnosis}${x.icd10?` (ICD-10 ${x.icd10})`:''}: ${x.rationale}`));if(tc&&Array.isArray(tc.options)&&tc.options.length){lines.push('\n'+t('sectionTreatment').toUpperCase());if(tc.rationale)lines.push(tc.rationale);tc.options.forEach(o=>{const ev=o.evidence_level?` [${o.evidence_level}]`:'';lines.push(`• ${o.name}${ev}`);if(o.efficacy)lines.push(`   Efficacy: ${o.efficacy}`);if(o.onset)lines.push(`   Onset: ${o.onset}`);if(o.monitoring)lines.push(`   Monitoring: ${o.monitoring}`);if(o.key_consideration)lines.push(`   Key: ${o.key_consideration}`);if(o.source)lines.push(`   [${o.source}]`);});}lines.push('\n'+t('sectionLit').toUpperCase());refs.forEach((r,i)=>{const ev=r.evidence_level?` [${r.evidence_level}]`:'';lines.push(`${i+1}. ${r.title}${ev}: ${r.relevance} [${r.source}] ${refHref(r)}`);});navigator.clipboard.writeText(lines.join('\n')).then(()=>{const btn=document.getElementById('copyBtn');btn.textContent=t('copied');setTimeout(()=>btn.textContent=t('copyChart'),2000);});});
  document.getElementById('saveBtn').addEventListener('click',async ()=>{const btn=document.getElementById('saveBtn');const u=window.__getCloudUser&&window.__getCloudUser();const m=Object.assign({},meta);if(u){try{const dx=(d.assessment&&d.assessment[0]&&d.assessment[0].diagnosis)||'-';await DermCaseCloud.saveCase({dx,meta:m,result:d});btn.textContent=t('savedCloud');}catch(e){saveCase(d,m);btn.textContent=t('caseSaved');}}else{saveCase(d,m);btn.textContent=t('caseSaved');}setTimeout(()=>btn.textContent=t('saveCase'),2000);});
  }
  document.getElementById('newBtn').addEventListener('click',()=>{resetImages();['age','sex','area','duration','notes'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});setOutput('');fitz='';if(window.__renderFitz)window.__renderFitz();window.scrollTo({top:0,behavior:'smooth'});});
}
