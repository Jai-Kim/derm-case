// Cloud auth wiring (additive; the anonymous/local path is untouched).
(function(){
  let cloudUser = null;
  const slot = document.getElementById('authSlot');
  function link(href,label){ return '<a href="'+href+'" class="nav-link">'+label+'</a>'; }
  function renderAuth(){
    if(!slot) return;
    if(cloudUser){
      slot.innerHTML = link('/library', t('navLibrary')) + '<button id="navSignOut" type="button" class="nav-link">'+t('navSignOut')+'</button>';
      const so = document.getElementById('navSignOut');
      if(so) so.addEventListener('click', async()=>{ try{ await DermCaseCloud.signOut(); }catch(e){} window.location.reload(); });
    } else {
      slot.innerHTML = link('/login', t('navSignIn'));
    }
  }
  window.__renderAuth = renderAuth;
  window.__getCloudUser = function(){ return cloudUser; };
  (async function(){
    try{
      if(window.DermCaseCloud && DermCaseCloud.enabled()){
        cloudUser = await DermCaseCloud.user();
        renderAuth();
        DermCaseCloud.onAuthChange(function(u){ cloudUser = u; renderAuth(); });
      }
    }catch(e){ /* leave anonymous */ }
  })();
})();
