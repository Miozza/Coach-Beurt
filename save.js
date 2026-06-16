// Coach Beurt V51.52 — extraction prudente moteur de charges.
// Script global volontaire : pas de ES modules, pas de changement de comportement.

function guardedSuggestedLoadDecision(nameOrKey,currentLoad,targetReps,context){
  var moveContext=(context&&context.label)?context:((typeof coachBuildMovementContext==='function')?coachBuildMovementContext(nameOrKey,context||{}):null);
  var label=moveContext&&moveContext.label?moveContext.label:canonicalMovementLabel(nameOrKey);
  var target=Number(targetReps)||8;
  var mv=athleteMovementRecord(label);
  var range=repRange(target);
  var cap=mv&&mv.ranges?(mv.ranges[range]||null):null;
  var histAll=(mv&&Array.isArray(mv.history))?mv.history:[];
  var hist=(typeof coachFilterHistoryForProgression==='function')?coachFilterHistoryForProgression(histAll,moveContext):histAll;
  var last=hist.length?hist[hist.length-1]:null;
  var lastLoad=coachHistoryLoadNumber(last);
  var lastRpe=last?Number(last.rpe||0):0;
  var bestControlled=coachRecentBestControlledLoad(hist,8.5);
  var programNum=parseLoad(currentLoad);
  var originalText=displayLoadForEquipment(label,currentLoad);
  var contextLimited=(typeof coachIsLimitedProgressionContext==='function')?coachIsLimitedProgressionContext(moveContext):false;
  var contextLimitReason=(typeof coachContextProgressionReason==='function')?coachContextProgressionReason(moveContext):'';
  var seedReason="Charge du programme, arrondie selon l’équipement.";
  if(!programNum){
    var seed=(lastLoad||((bestControlled&&bestControlled.load)||0)||coachDefaultLoadSeedForMovement(label,target));
    if(seed){
      programNum=seed;
      seedReason=lastLoad
        ? "Charge de programme non numérique : suggestion basée sur la dernière charge historique."
        : ((bestControlled&&bestControlled.load)
          ? "Charge de programme non numérique : suggestion basée sur l'historique contrôlé."
          : "Charge de programme non numérique : suggestion basée sur les repères d'équipement.");
    }else{
      storeLoadDecisionHint(label,originalText,"Charge non numérique et aucun historique/repère fiable trouvé.","watch",hist,moveContext);
      return{label:label,loadText:originalText,loadNum:null,severity:"watch",reason:"Charge non numérique et aucun historique/repère fiable trouvé.",last:last,cap:cap};
    }
  }
  var suggested=programNum;
  var severity="ok";
  var reason=seedReason;
  var mode="nearest";

  if(state&&Number(state.week)===6){
    var deloadBase=lastLoad||((bestControlled&&bestControlled.load)||programNum);
    var deloadCap=deloadBase?Math.min(programNum,deloadBase*0.85):programNum;
    if(deloadCap<suggested){suggested=deloadCap;mode="down";}
    severity="watch";
    reason="Deload S6 : charge réduite/maintenue sous la dernière référence, pas seulement volume réduit.";
  }

  if(contextLimited || isTechnicalMovement(label)){
    suggested=programNum;mode="nearest";severity=severity==="ok"?"watch":severity;
    reason=contextLimitReason || "Mouvement technique : pas d’auto-progression comme un mouvement principal.";
  }

  // V51.03 : si le programme est clairement sous l'historique réel contrôlé, remonter vers la référence réelle.
  // Exemple visé : Barbell Row 145-155 @ RPE 7-8 ne doit pas rester à 115-125.
  if(!contextLimited && bestControlled&&bestControlled.load>suggested){
    var gap=bestControlled.load-suggested;
    var n=coachNormalizeMoveText(label);
    var allowLiftFromHistory=false;
    if(/barbell row/.test(n)&&gap>=15)allowLiftFromHistory=true;
    else if(!isIsolationMovement(label)&&!isTechnicalMovementInContext(label,moveContext)&&gap>=20&&bestControlled.rpe<=8)allowLiftFromHistory=true;
    if(allowLiftFromHistory){
      suggested=Math.min(bestControlled.load+coachMaxJumpForExercise(label,bestControlled.load), bestControlled.load+10);
      mode="nearest";
      severity=severity==="ok"?"watch":severity;
      reason="Historique réel contrôlé détecté : "+bestControlled.load+" lb × "+bestControlled.reps+" @RPE "+bestControlled.rpe+". Le moteur évite de sous-suggérer sous une référence facile.";
    }
  }

  if(last){
    var maxJump=coachMaxJumpForExercise(label,lastLoad);
    var lastReps=coachHistoryRepsNumber(last);
    var repsReached=!target || !lastReps || lastReps>=target;
    if(lastLoad&&lastRpe<=8&&suggested>lastLoad+maxJump){
      suggested=lastLoad+maxJump;mode="down";severity=severity==="ok"?"watch":severity;
      reason="Progression limitée : dernière référence "+lastLoad+" lb @RPE "+lastRpe+". Saut maximal prudent +"+maxJump+" lb.";
    }
    if(lastLoad&&lastRpe>0&&lastRpe<=7&&repsReached&&!contextLimited&&!isTechnicalMovementInContext(label,moveContext)&&Number(state&&state.week)!==6){
      var next=nextLoadForExercise(label,lastLoad,1,currentLoad);
      var maxAllowed=lastLoad+maxJump;
      if(next&&next>lastLoad&&next<=maxAllowed){
        if(suggested<=lastLoad){
          suggested=next;mode="up";severity=severity==="ok"?"watch":severity;
          reason="Progression prête : dernier "+lastLoad+" lb × "+(lastReps||target)+" @RPE "+lastRpe+". Petite hausse vers la prochaine charge disponible.";
        }
      }else if(suggested<=lastLoad){
        severity=severity==="ok"?"watch":severity;
        reason="Progression prête, mais aucune charge supérieure disponible/configurée dans le saut prudent autorisé.";
      }
    }
    if(lastRpe>=9 && suggested>lastLoad){
      suggested=lastLoad;mode="down";severity="warning";
      reason="Bloqué : dernier RPE réel "+lastRpe+" à "+lastLoad+" lb. Règle V51 : RPE ≥ 9 = aucune hausse automatique.";
    }else if(isIsolationMovement(label)&&lastRpe>=8.5 && suggested>lastLoad){
      suggested=lastRpe>=9.5?Math.max(0,lastLoad-coachLoadStepForExercise(label,currentLoad)):lastLoad;mode="down";severity="warning";
      reason="Isolation prudente : dernier RPE "+lastRpe+". Maintenir ou réduire légèrement, pas augmenter.";
    }
    if(/overhead rope extension/.test(coachNormalizeMoveText(label))){
      var friday=coachIsFridayContext();
      var easyBest=coachRecentBestControlledLoad(hist,8);
      var maxAllowed=(lastRpe<=8)?lastLoad+5:lastLoad;
      // Vendredi = rappel après un contexte différent. Autoriser 60-70 si une vraie référence facile existe,
      // sans autoriser un saut de lundi lourd après press.
      if(friday&&easyBest&&easyBest.load>=60&&easyBest.rpe<=8){
        maxAllowed=Math.max(maxAllowed,easyBest.load);
        if(suggested<60){suggested=Math.min(easyBest.load,70);mode="nearest";severity=severity==="ok"?"watch":severity;}
        reason="Overhead Rope Extension vendredi : contexte rappel distinct. Référence contrôlée "+easyBest.load+" lb @RPE "+easyBest.rpe+" permise, sans forcer le lundi.";
      }
      if(suggested>maxAllowed){
        suggested=maxAllowed;mode="down";severity="warning";
        reason=(lastRpe<=8)?"Overhead Rope Extension : progression limitée à +5 lb max après RPE ≤ 8.":"Overhead Rope Extension : RPE > 8, hausse bloquée dans ce contexte.";
      }
    }
  }
  if(cap&&(cap.status==="recalibrating"||cap.status==="watch"||Number(cap.confidence||1)<0.55)){
    var capLoad=Number(cap.currentLoad||cap.actualLoad||0)||0;
    // Ne pas laisser un cap faible écraser une référence réelle contrôlée clairement supérieure.
    var ignoreLowCap=bestControlled&&capLoad&&bestControlled.load>=capLoad+15&&bestControlled.rpe<=8.5;
    if(capLoad&&suggested>capLoad&&!ignoreLowCap){suggested=capLoad;mode="down";severity="warning";reason="Mouvement sous surveillance dans athlete_state : charge cappée jusqu’à confirmation.";}
    else if(ignoreLowCap){severity=severity==="ok"?"watch":severity;reason="Cap athlete_state ignoré : historique réel contrôlé plus récent/plus fiable que le cap faible.";}
  }
  var rounded=roundLoadForExercise(label,suggested,mode,currentLoad);
  if(/overhead rope extension/.test(coachNormalizeMoveText(label))&&last&&lastLoad){
    var allowed=(lastRpe<=8)?lastLoad+5:lastLoad;
    if(coachIsFridayContext()){
      var eb=coachRecentBestControlledLoad(hist,8);
      if(eb&&eb.load>=60)allowed=Math.max(allowed,eb.load);
    }
    if(rounded>allowed)rounded=roundLoadForExercise(label,allowed,"down",currentLoad)||lastLoad;
  }
  if(last&&lastRpe>=9&&rounded>lastLoad&&!(/overhead rope extension/.test(coachNormalizeMoveText(label))&&coachIsFridayContext()))rounded=roundLoadForExercise(label,lastLoad,"down",currentLoad)||lastLoad;
  if(contextLimited&&rounded>programNum){
    rounded=roundLoadForExercise(label,programNum,"nearest",currentLoad)||programNum;
    severity=severity==="ok"?"watch":severity;
    reason=contextLimitReason||reason;
  }
  var text=(rounded===0||rounded)?rounded+" lb":originalText;
  if(severity==="warning"||severity==="critical")text += " ⚠";
  storeLoadDecisionHint(label,text,reason,severity,hist,moveContext);
  return{label:label,loadText:text,loadNum:rounded,severity:severity,reason:reason,last:last,cap:cap};
}

function plannedMapFromSessionExercises(){
  var map={};
  try{
    collectSessionExercises().forEach(function(it){
      if(!it||it.isWod)return;
      var label=movementLabelFromKeyOrName(it.key||it.name);
      var plannedLoad=parseLoad(it.suggested);
      var targetMin=Number(it.targetMin)||0;
      var targetMax=Number(it.targetMax)||targetMin||0;
      map[it.key]={name:label,load:plannedLoad,reps:targetMin||targetMax, targetMin:targetMin, targetMax:targetMax, format:it.format||"", kind:it.kind||"", context:(typeof coachBuildMovementContext==='function'?coachBuildMovementContext(it.name||it.key,{kind:it.kind,format:it.format,note:it.note,text:it.text,blockTitle:it.blockTitle,day:(state&&state.day),week:(state&&state.week)}):null)};
      map[label]=map[it.key];
      map[normalizeExerciseName(label)]=map[it.key];
    });
  }catch(e){}
  return map;
}

function classifyPerformance(actual, planned){
  var load=parseLoad(actual.load), reps=Number(actual.reps)||0, rpe=Number(actual.rpe)||0;
  var targetReps=Number((planned&&planned.reps)||actual.targetMin||actual.targetMax)||reps||1;
  var ratio=targetReps?reps/targetReps:1;
  var status="logged";
  if(load&&reps&&rpe>=9.5&&ratio<0.60)status="major_fail";
  else if(load&&reps&&rpe>=9&&ratio<1)status="failed";
  else if(load&&reps&&rpe<=7&&ratio>=1)status="easy_success";
  else if(load&&reps&&rpe>=9)status="hard_success";
  else if(load&&reps)status="success";
  return {status:status,ratio:Math.round(ratio*100)/100,targetReps:targetReps};
}

function enrichSessionResults(results){
  var plan=plannedMapFromSessionExercises();
  Object.keys(results||{}).forEach(function(key){
    var r=results[key];
    if(!r||r.isWod||!r.load)return;
    var lookup=plan[key]||plan[movementLabelFromKeyOrName(key)]||plan[normalizeExerciseName(key)]||null;
    if(lookup){
      r.planned={load:lookup.load||null,reps:lookup.reps||null,targetMin:lookup.targetMin||null,targetMax:lookup.targetMax||null,format:lookup.format||"",kind:lookup.kind||"",context:lookup.context||null};
      var c=classifyPerformance(r,lookup);
      r.status=c.status;r.performanceRatio=c.ratio;
      if(c.status==="major_fail")r.coachNote="Échec majeur : niveau probablement surestimé aujourd'hui. Recalibrage requis.";
      else if(c.status==="failed")r.coachNote="Échec partiel : ne pas monter la charge avant confirmation.";
    }
  });
  return results;
}

function updateAthleteStateFromResults(results,dateStr){
  var ast=ensureAthleteState();
  dateStr=dateStr||new Date().toLocaleDateString("fr-CA");
  Object.keys(results||{}).forEach(function(key){
    var r=results[key];
    if(!r||r.isWod||!r.load)return;
    var load=parseLoad(r.load), reps=Number(r.reps)||0, rpe=Number(r.rpe)||0;
    if(!load||!reps)return;
    var label=movementLabelFromKeyOrName(key);
    var range=repRange(reps);
    var planned=r.planned||{};
    var resultContext=planned.context||((typeof coachBuildMovementContext==='function')?coachBuildMovementContext(label,{kind:planned.kind,format:planned.format,day:(state&&state.day),week:(state&&state.week)}):null);
    var limitedResultContext=(typeof coachIsLimitedProgressionContext==='function')?coachIsLimitedProgressionContext(resultContext):false;
    var targetReps=Number(planned.reps||planned.targetMin)||reps;
    var cls=classifyPerformance(r,planned);
    var oneRM=epley1RM(load,reps);
    var capacityLoad=load;
    var confidence=0.65;
    var status=cls.status;
    if(cls.status==="major_fail"){
      capacityLoad=roundLoadForExercise(label, estimateLoadForRepsFrom1RM(oneRM,targetReps), "nearest")||load;
      confidence=0.35;
      status="recalibrating";
    }else if(cls.status==="failed"){
      capacityLoad=roundLoadForExercise(label, estimateLoadForRepsFrom1RM(oneRM,targetReps), "nearest")||load;
      confidence=0.50;
      status="watch";
    }else if(cls.status==="easy_success"){
      capacityLoad=load;
      confidence=0.85;
      status="upgrade_ready";
    }else if(cls.status==="hard_success"){
      capacityLoad=load;
      confidence=0.70;
      status="hard";
    }
    if(!ast.movements[label]){
      ast.movements[label]={ranges:{},history:[],lastUpdated:null,status:"new"};
    }
    var mv=ast.movements[label];
    mv.ranges=mv.ranges||{};mv.history=mv.history||[];
    var prev=mv.ranges[range]||{};
    var shouldReplace = !prev.currentLoad || cls.status==="major_fail" || cls.status==="failed" || load>=Number(prev.currentLoad||0) || confidence>Number(prev.confidence||0);
    if(shouldReplace && !limitedResultContext){
      mv.ranges[range]={
        currentLoad:capacityLoad,
        currentReps:targetReps,
        actualLoad:load,
        actualReps:reps,
        rpe:rpe,
        confidence:confidence,
        status:status,
        estimated1RM:Math.round(oneRM),
        lastUpdated:dateStr,
        planned:planned||null
      };
    }
    mv.status=status;
    mv.upgradedAt = (cls.status==="easy_success"||cls.status==="success"||cls.status==="hard_success") ? dateStr : (mv.upgradedAt||null);
    mv.lastUpdated=dateStr;
    mv.history.push({date:dateStr,load:load,reps:reps,rpe:rpe,range:range,status:limitedResultContext?'context_logged':status,capacityLoad:capacityLoad,planned:planned||null,context:resultContext||null});
    if(mv.history.length>12)mv.history=mv.history.slice(-12);
  });
  ast.updatedAt=nowIso();ast.version=APP_VERSION;
}

function athleteSuggestedLoad(nameOrKey, currentLoad, targetReps, context){
  return guardedSuggestedLoadDecision(nameOrKey,currentLoad,targetReps,context).loadText;
}
window.coachSafeSuggestedLoad=function(nameOrKey,currentLoad,targetReps,context){
  return guardedSuggestedLoadDecision(nameOrKey,currentLoad,targetReps,context).loadText;
};
