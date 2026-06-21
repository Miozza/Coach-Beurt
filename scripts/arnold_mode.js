// ─── Mode Arnold Split local expérimental ────────────────────────────────────
// Programme local séparé, sans GitHub sync et sans données durables.

var ARNOLD_STATE_KEY = "coachBeurtArnoldState";

function arnoldProgram(){
  var map = window.COACH_ARNOLD_PROGRAMS || {};
  return map.arnold_split_2026_adapte || {sessions:[], label:"Arnold Split 2026 — Adapté", cycleNote:""};
}
function loadArnoldState(){
  try{
    var raw=localStorage.getItem(ARNOLD_STATE_KEY);
    if(raw)return Object.assign({history:[], sessionFeedback:{}, selectedSessionId:null}, JSON.parse(raw));
  }catch(e){}
  return {profile:"arnold", history:[], sessionFeedback:{}, selectedSessionId:null, createdAt:nowIso()};
}
function saveArnoldState(st){
  st.updatedAt=nowIso();
  try{localStorage.setItem(ARNOLD_STATE_KEY, JSON.stringify(st));}catch(e){}
}
function arnoldDifficultyLabel(v){
  if(v==="too_easy")return "Trop facile";
  if(v==="too_hard")return "Trop difficile";
  return "Correct";
}
function arnoldPainLabel(v){return v==="yes"?"Oui":"Non";}
function arnoldLastFeedback(sessionId){
  var st=loadArnoldState();
  var list=(st.sessionFeedback&&st.sessionFeedback[sessionId])||[];
  return list.length?list[list.length-1]:null;
}
function arnoldSuggestionText(sessionId){
  var last=arnoldLastFeedback(sessionId);
  if(!last)return "Première fois : choisir des charges prudentes, viser RPE 7–8.";
  var r=Number(last.rpe)||0;
  if(last.pain==="yes")return "Dernière séance avec douleur : réduire la charge, l’amplitude ou remplacer l’exercice irritant.";
  if(r<=6)return "Dernière fois trop facile : augmenter légèrement la charge ou viser le haut de plage.";
  if(r<=8)return "Dernière fois correcte : garder semblable ou petite progression.";
  if(r>=9)return "Dernière fois très dure : garder, réduire un peu ou couper un set d’isolation.";
  return "Utiliser le RPE de la dernière séance pour ajuster.";
}
function arnoldHistoryText(){
  var st=loadArnoldState();
  var hist=(st.history||[]).slice();
  var lines=[];
  lines.push("Historique Arnold Split 2026 — Adapté");
  lines.push("Export : "+new Date().toLocaleString("fr-CA"));
  lines.push("Version app : "+APP_VERSION);
  lines.push("Données : locales seulement, séparées de Racine");
  lines.push("");
  if(!hist.length){
    lines.push("Aucune séance enregistrée.");
    return lines.join("\n");
  }
  hist.forEach(function(h,i){
    lines.push("Séance "+(i+1));
    lines.push("Date : "+(h.date||"—")+" "+(h.time||""));
    lines.push("Entraînement : "+(h.title||h.sessionId||"—"));
    lines.push("RPE général : "+(h.rpe||"—"));
    lines.push("Difficulté : "+arnoldDifficultyLabel(h.difficulty));
    lines.push("Douleur : "+arnoldPainLabel(h.pain));
    lines.push("Note : "+(h.note&&String(h.note).trim()?h.note:"—"));
    lines.push("Version : "+(h.version||"—"));
    lines.push("");
  });
  return lines.join("\n");
}
function exportArnoldHistoryTxt(){
  var d=new Date().toLocaleDateString("fr-CA");
  download("historique-arnold-split-"+d+".txt", arnoldHistoryText());
}
function rebuildArnoldFeedbackFromHistory(st){
  var feedback={};
  (st.history||[]).forEach(function(h){
    if(!h||!h.sessionId)return;
    feedback[h.sessionId]=feedback[h.sessionId]||[];
    feedback[h.sessionId].push(h);
    if(feedback[h.sessionId].length>6)feedback[h.sessionId]=feedback[h.sessionId].slice(-6);
  });
  st.sessionFeedback=feedback;
}
function deleteArnoldHistoryEntry(index){
  var st=loadArnoldState();
  var hist=st.history||[];
  if(index<0||index>=hist.length)return;
  var h=hist[index];
  var label=(h.date||"")+" · "+(h.title||h.sessionId||"séance");
  if(!confirm("Supprimer cette séance de l’historique local Arnold ?\n\n"+label))return;
  hist.splice(index,1);
  st.history=hist;
  rebuildArnoldFeedbackFromHistory(st);
  saveArnoldState(st);
  openArnoldSettings();
}
function arnoldHistorySettingsHtml(){
  var st=loadArnoldState();
  var hist=(st.history||[]).slice();
  var html='<div class="steph-settings-section"><h4>Historique visible</h4>';
  if(!hist.length){
    html+='<p class="steph-sub">Aucune séance enregistrée pour l’instant.</p>';
  }else{
    html+='<div class="steph-history-list">';
    hist.slice().reverse().forEach(function(h,revIndex){
      var realIndex=hist.length-1-revIndex;
      html+='<div class="steph-history-row">'+
        '<div><strong>'+escapeHtml(h.date||"—")+'</strong> · '+escapeHtml(h.title||h.sessionId||"Séance")+'</div>'+
        '<div class="steph-history-meta">RPE '+escapeHtml(h.rpe||"—")+' · '+escapeHtml(arnoldDifficultyLabel(h.difficulty))+' · Douleur : '+escapeHtml(arnoldPainLabel(h.pain))+'</div>'+
        (h.note?'<div class="steph-history-note">'+escapeHtml(h.note)+'</div>':'')+
        '<button class="steph-mini-danger" data-arnold-delete-history="'+realIndex+'">Supprimer cette séance</button>'+
      '</div>';
    });
    html+='</div>';
  }
  html+='<div class="steph-export-box"><button id="arnoldExportHistoryBtn" class="steph-btn">Exporter tout l’historique .TXT</button></div></div>';
  return html;
}
function openArnoldSettings(){
  var existing = document.getElementById("arnoldSettingsOverlay");
  if(existing)existing.remove();
  var overlay = document.createElement("div");
  overlay.id = "arnoldSettingsOverlay";
  overlay.className = "steph-settings-overlay";
  overlay.innerHTML =
    '<div class="steph-settings-modal">'+
      '<div class="steph-settings-head"><h3>Réglages Arnold</h3><button id="arnoldSettingsClose" class="steph-icon-btn">×</button></div>'+
      '<p class="steph-sub">Programme expérimental local. Données séparées de Racine et non envoyées sur GitHub.</p>'+
      arnoldHistorySettingsHtml()+
      '<div class="steph-settings-section steph-profile-section"><button type="button" class="settings-collapse-toggle" id="arnoldProfileSwitchToggle" aria-expanded="false" aria-controls="arnoldProfileSwitchBody">⚙ Changer de profil</button><div id="arnoldProfileSwitchBody" class="settings-collapse-body" hidden><p class="steph-sub">Chaque profil a ses propres données. Revenir ici pour changer.</p><div class="btn-row"><button id="arnoldToBertinBtn" class="steph-subtle-profile-btn">Bertin</button><button id="arnoldToStephBtn" class="steph-subtle-profile-btn">Stéphanie</button></div></div></div>'+
    '</div>';
  document.body.appendChild(overlay);
  var close = document.getElementById("arnoldSettingsClose");
  if(close)close.onclick=function(){ overlay.remove(); };
  overlay.addEventListener("click",function(e){ if(e.target===overlay)overlay.remove(); });
  var toBertin = document.getElementById("arnoldToBertinBtn");
  if(toBertin)toBertin.onclick=function(){ if(confirm("Revenir au profil Bertin ?\nTes données actuelles restent sauvegardées."))switchLocalProfile("bertin"); };
  var toSteph = document.getElementById("arnoldToStephBtn");
  if(toSteph)toSteph.onclick=function(){ if(confirm("Passer au profil Stéphanie ?\nTes données actuelles restent sauvegardées."))switchLocalProfile("stephanie"); };
  var toggle = document.getElementById("arnoldProfileSwitchToggle");
  var body = document.getElementById("arnoldProfileSwitchBody");
  if(toggle&&body)toggle.onclick=function(){var open=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!open));body.hidden=open;};
  var exp = document.getElementById("arnoldExportHistoryBtn");
  if(exp)exp.onclick=exportArnoldHistoryTxt;
  overlay.querySelectorAll('[data-arnold-delete-history]').forEach(function(btn){
    btn.onclick=function(){ deleteArnoldHistoryEntry(Number(btn.getAttribute('data-arnold-delete-history'))); };
  });
}
function renderArnoldSimpleApp(selectedId){
  window.scrollTo({top:0,left:0,behavior:"auto"});
  document.body.classList.add("arnold-mode");
  var existing=document.getElementById("arnoldApp");
  if(!existing){existing=document.createElement("div");existing.id="arnoldApp";document.body.appendChild(existing);}
  var program=arnoldProgram();
  var sessions=program.sessions||[];
  var st=loadArnoldState();
  if(selectedId)st.selectedSessionId=selectedId;
  saveArnoldState(st);
  var selected=sessions.filter(function(x){return x.id===st.selectedSessionId;})[0]||null;
  if(selected)renderArnoldSession(existing,program,selected);
  else renderArnoldSelector(existing,program,sessions,st);
}
function arnoldTagsHtml(tags){
  if(!Array.isArray(tags)||!tags.length)return "";
  return '<div class="arnold-tags">'+tags.map(function(t){return '<span class="arnold-tag">'+escapeHtml(t)+'</span>';}).join('')+'</div>';
}
function renderArnoldSelector(root,program,sessions,st){
  var hist=(st.history||[]).slice(-3).reverse();
  var html='<div class="steph-app arnold-app">'+
    '<div class="steph-head"><div><h1 class="steph-title">'+escapeHtml(program.label||"Arnold Split 2026 — Adapté")+'</h1><p class="steph-sub">Expérimental · 6 cartes bodybuilding · données locales seulement.</p></div><div class="steph-head-actions"><div class="steph-badge arnold-badge">Expérimental · local</div><button class="steph-gear-btn" data-arnold-settings="1" title="Réglages">⚙</button></div></div>'+
    '<div class="steph-card"><h3>Choisir un entraînement</h3><p class="steph-sub">Durée cible 60–75 min. Dimanche : repos ou mobilité légère. Ce programme ne modifie pas l’historique Racine.</p><div class="steph-caution">'+escapeHtml(program.cycleNote||"")+'</div></div>';
  sessions.forEach(function(s){
    var contenu = Array.isArray(s.contenu) ? s.contenu.join(' · ') : (s.contenu || '');
    var ev = s.evaluation || {};
    html+='<div class="steph-card steph-session-card arnold-session-card"><div class="steph-card-top"><h3>'+escapeHtml(s.title)+'</h3><span class="steph-eval-pill arnold-pill">'+escapeHtml(ev.niveau||'Expérimental')+'</span></div>'+
      '<div class="steph-meta">'+escapeHtml(s.duration)+' · fatigue '+escapeHtml(s.fatigue)+'</div>'+arnoldTagsHtml(s.tags)+
      '<div class="steph-goal"><strong>Objectif :</strong> '+escapeHtml(s.goal)+'</div>'+
      '<div class="steph-goal"><strong>Intention :</strong> '+escapeHtml(s.intention||s.goal)+'</div>'+
      (contenu?'<div class="steph-detail"><strong>Exercices :</strong> '+escapeHtml(contenu)+'</div>':'')+
      (s.meilleurChoix?'<div class="steph-detail"><strong>À choisir quand :</strong> '+escapeHtml(s.meilleurChoix)+'</div>':'')+
      '<div class="steph-eval"><strong>Notes RPE / sécurité :</strong> '+escapeHtml(s.caution||ev.raison||'RPE contrôlé.')+(ev.surveillance?' <br><span>À surveiller : '+escapeHtml(ev.surveillance)+'</span>':'')+'</div>'+      '<div class="steph-caution">'+escapeHtml(arnoldSuggestionText(s.id))+'</div>'+      '<div class="steph-card-action"><button class="steph-btn steph-start-btn" data-arnold-start="'+escapeHtml(s.id)+'">Démarrer</button></div></div>';
  });
  if(hist.length){
    html+='<div class="steph-card"><h3>Dernières séances Arnold</h3><div class="steph-history">'+hist.map(function(h){return escapeHtml(h.date+' · '+h.title+' · RPE '+h.rpe+(h.pain==='yes'?' · douleur':''));}).join('<br>')+'</div></div>';
  }
  html+='</div>';
  root.innerHTML=html;
  root.querySelectorAll('[data-arnold-start]').forEach(function(btn){btn.onclick=function(){renderArnoldSimpleApp(btn.getAttribute('data-arnold-start'));};});
  root.querySelectorAll('[data-arnold-settings]').forEach(function(btn){btn.onclick=openArnoldSettings;});
}
function renderArnoldSession(root,program,session){
  var ev = session.evaluation || {};
  var contenu = Array.isArray(session.contenu) ? session.contenu.join(' · ') : (session.contenu || '');
  var html='<div class="steph-app arnold-app">'+
    '<div class="steph-head"><div><h1 class="steph-title">'+escapeHtml(session.title)+'</h1><p class="steph-sub">'+escapeHtml(session.duration)+' · fatigue '+escapeHtml(session.fatigue)+' · '+escapeHtml(session.goal)+'</p></div><div class="steph-head-actions"><div class="steph-badge arnold-badge">Arnold expérimental</div><button class="steph-gear-btn" data-arnold-settings="1" title="Réglages">⚙</button></div></div>'+
    '<div class="steph-session-top-actions"><button class="steph-btn" id="arnoldTopBackBtn">Retour aux cartes</button></div>'+ 
    '<div class="steph-card">'+arnoldTagsHtml(session.tags)+'<div class="steph-goal"><strong>Objectif :</strong> '+escapeHtml(session.goal)+'</div><div class="steph-goal"><strong>Intention :</strong> '+escapeHtml(session.intention||session.goal)+'</div>'+(contenu?'<div class="steph-detail"><strong>Exercices :</strong> '+escapeHtml(contenu)+'</div>':'')+'<div class="steph-eval"><strong>Notes RPE / sécurité :</strong> '+escapeHtml(session.caution||ev.raison||'Structure cohérente.')+(ev.surveillance?' <br><span>À surveiller : '+escapeHtml(ev.surveillance)+'</span>':'')+'</div><div class="steph-caution"><strong>Progression :</strong> '+escapeHtml(arnoldSuggestionText(session.id))+'</div></div>';
  (session.blocks||[]).forEach(function(b){
    html+='<div class="steph-block"><div class="steph-block-title">'+escapeHtml(b.title)+'</div><div class="steph-time">'+escapeHtml(b.time||'')+'</div>';
    if(b.text)html+='<div class="steph-goal">'+escapeHtml(b.text)+'</div>';
    (b.exercises||[]).forEach(function(e){
      html+='<div class="steph-ex"><div class="steph-ex-name">'+escapeHtml(e.name)+'</div><div class="steph-ex-line">'+escapeHtml(e.format)+' · '+escapeHtml(e.load)+'</div>'+(e.note?'<div class="steph-ex-line">'+escapeHtml(e.note)+'</div>':'')+'</div>';
    });
    html+='</div>';
  });
  html+='<div class="steph-card"><h3>Fin de séance</h3>'+ 
    '<label class="steph-label">RPE général</label><select id="arnoldRpe" class="steph-select"><option value="6">6 — facile</option><option value="7">7 — bon</option><option value="8" selected>8 — solide</option><option value="9">9 — très dur</option><option value="10">10 — trop dur</option></select>'+ 
    '<label class="steph-label">Difficulté</label><select id="arnoldDifficulty" class="steph-select"><option value="too_easy">Trop facile</option><option value="correct" selected>Correct</option><option value="too_hard">Trop difficile</option></select>'+ 
    '<label class="steph-label">Douleur</label><select id="arnoldPain" class="steph-select"><option value="no" selected>Non</option><option value="yes">Oui</option></select>'+ 
    '<label class="steph-label">Note optionnelle</label><input id="arnoldNote" class="steph-input" placeholder="ex: bench facile, coude sensible, RDL prudent" />'+ 
    '<div class="steph-actions steph-session-bottom-actions"><button class="steph-btn" id="arnoldBackBtn">Retour</button><button class="steph-btn" id="arnoldSaveBtn">Terminer</button></div><div id="arnoldStatus" class="steph-status"></div></div>'+ 
    '</div>';
  root.innerHTML=html;
  root.querySelectorAll('[data-arnold-settings]').forEach(function(btn){btn.onclick=openArnoldSettings;});
  function goBackArnold(){var st=loadArnoldState();st.selectedSessionId=null;saveArnoldState(st);renderArnoldSimpleApp();}
  var back=document.getElementById('arnoldBackBtn');if(back)back.onclick=goBackArnold;
  var topBack=document.getElementById('arnoldTopBackBtn');if(topBack)topBack.onclick=goBackArnold;
  var saveBtn=document.getElementById('arnoldSaveBtn');if(saveBtn)saveBtn.onclick=function(){saveArnoldSession(session);};
}
function saveArnoldSession(session){
  var st=loadArnoldState();
  var rpe=(document.getElementById('arnoldRpe')||{}).value||'8';
  var difficulty=(document.getElementById('arnoldDifficulty')||{}).value||'correct';
  var pain=(document.getElementById('arnoldPain')||{}).value||'no';
  var note=(document.getElementById('arnoldNote')||{}).value||'';
  var row={
    profile:'arnold',
    programId:'arnold_split_2026_adapte',
    date:new Date().toLocaleDateString('fr-CA'),
    time:new Date().toLocaleTimeString('fr-CA'),
    sessionId:session.id,
    title:session.title,
    rpe:Number(rpe),
    difficulty:difficulty,
    pain:pain,
    note:note,
    version:APP_VERSION
  };
  st.history=st.history||[];st.history.push(row);
  st.sessionFeedback=st.sessionFeedback||{};st.sessionFeedback[session.id]=st.sessionFeedback[session.id]||[];st.sessionFeedback[session.id].push(row);
  if(st.sessionFeedback[session.id].length>6)st.sessionFeedback[session.id]=st.sessionFeedback[session.id].slice(-6);
  st.selectedSessionId=null;
  saveArnoldState(st);
  var status=document.getElementById('arnoldStatus');if(status)status.textContent='Séance sauvegardée localement. Visible dans ⚙ Réglages.';
  setTimeout(function(){renderArnoldSimpleApp();},500);
}
