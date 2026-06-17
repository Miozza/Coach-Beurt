// Coach Beurt V51.53 — session save domain
// Sauvegarde de séance : payload, retour WOD et orchestration sauvegarde.

function updateCustomChargesFromResults(results){
  return false;
}

function buildSessionPayload(results){
  return{
    version:APP_VERSION,
    date:new Date().toLocaleDateString("fr-CA"),
    time:new Date().toLocaleTimeString("fr-CA"),
    semaine:state.week,
    jour:state.day,
    plannedDay:state.day,
    actualDate:new Date().toLocaleDateString("fr-CA"),
    actualDayName:actualDayName(),
    cycle:state.cycle&&state.cycle.goal?state.cycle.goal:null,
    focus:focus().label,
    cycleState:buildCycleStatePayload(),
    resultats:results
  };
}

function returnFromResultsToWod(){
  guidedResultsMode=false;
  document.body.classList.remove("guided-results-active");
  document.body.classList.remove("results-view-active");
  guidedLaunchSource="wodplus";
  switchView("training");
  renderWorkout();
}

function setupSessionSave(){
  var back=$("sessionBackPcBtn");
  if(back)back.onclick=returnFromResultsToWod;
  var backTop=$("resultsBackPcTopBtn");
  if(backTop)backTop.onclick=returnFromResultsToWod;
  var btn=$("saveSessionBtn");if(!btn)return;
  btn.onclick=async function(){
    resumeAudio();
    var results=collectSessionResults();
    var hasData=Object.keys(results).length>0;
    if(!hasData){var s=$("saveStatus");if(s){s.textContent="Aucun résultat saisi.";s.className="session-note";}return;}
    btn.disabled=true;btn.textContent="Envoi en cours...";
    results=CoachCharge.enrichSessionResults(results);
    var autoPrUpdates=detectAndApplyAutomaticPr(results,todayDateString());
    var payload=buildSessionPayload(results);
    if(autoPrUpdates.length)payload.autoPrUpdates=autoPrUpdates;
    // 1. Mettre à jour références + historique RPE
    updateRefsFromResults(results);
    CoachCharge.updateAthleteStateFromResults(results,payload.date);
    // 2. Ne plus modifier les charges locales depuis les résultats :    // charges.js et les charges locales sont une configuration/équipement, pas une capacité réelle.
    // Les upgrades viennent de ce qui a été réellement dépassé dans l’historique/PR.
    // updateCustomChargesFromResults(results);
    // 3. Marquer le jour complété
    markDayCompleted(state.day);
    // 4. Vérifier alerte deload
    checkDeloadAlert();
    // 5. Ajouter à l'historique local
    state.history.push({date:payload.date,time:payload.time,week:state.week,day:state.day,plannedDay:state.day,actualDate:payload.actualDate,actualDayName:payload.actualDayName,cycle:payload.cycle,focus:focus().label,results:results,version:APP_VERSION});
    save();
    if(autoPrUpdates.length){ renderProfile(); renderReferences(); }
    // 6. Envoyer séance sur GitHub
    var result=await saveToGitHub(payload);
    // 7. Sauvegarder les états persistants durables si la séance est bien écrite
    var stateMsg="";
    if(result.ok&&getToken()){
      var stateSave=await savePersistentStateToGitHub(getToken());
      stateMsg=stateSave.ok?" · niveaux/cycle ✅":" · cycle_state non sauvegardé ("+stateSave.msg+")";
    }
    // 8. Ne pas modifier charges.js automatiquement : les charges stables ne doivent pas être écrasées par une mise à jour ou une séance.
    var s=$("saveStatus");
    if(s){s.textContent=result.msg+stateMsg;s.className="session-note"+(result.ok?" ok":" err");}
    btn.disabled=false;btn.textContent="💾 Sauvegarder & envoyer sur GitHub";
    // 8. Construire et afficher le résumé
    var summary=buildSessionSummary(results);
    showSessionSummaryModal(summary);
    if(result.ok){
      renderHistory();renderWorkout();renderWeekProgress();
      if(guidedResultsMode){
        returnFromResultsToWod();
      }
    }
  };
}

