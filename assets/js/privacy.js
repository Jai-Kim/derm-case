(function(){
  var de=document.documentElement,btn=document.getElementById('langBtn');
  var lang=(window.dcLang&&dcLang.get())||((navigator.language||'').slice(0,2)==='ko'?'ko':'en');
  function apply(){de.setAttribute('data-lang',lang);de.lang=lang;btn.textContent=lang==='ko'?'EN':'한국어';
    document.title=lang==='ko'?'DermCase | 개인정보 처리방침':'DermCase | Privacy policy';}
  btn.addEventListener('click',function(){lang=lang==='ko'?'en':'ko';if(window.dcLang)dcLang.set(lang);apply();});
  apply();
  if(location.hash==='#delete'&&lang==='ko'){var d=document.getElementById('delete-ko');if(d)d.scrollIntoView();}
  var m=window.DERMCASE_CONTACT_EMAIL;
  if(m&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){
    [].forEach.call(document.querySelectorAll('[data-contact]'),function(el){
      var a=document.createElement('a');a.className='link';a.href='mailto:'+m;a.textContent=m;
      el.textContent='';el.appendChild(a);
    });
  }
})();
