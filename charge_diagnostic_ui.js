// Coach Beurt V51.52 — extraction prudente moteur de charges.
// Script global volontaire : pas de ES modules, pas de changement de comportement.

function ensureAthleteState(){
  if(!state.athleteState)state.athleteState={movements:{},updatedAt:null,version:null};
  if(!state.athleteState.movements)state.athleteState.movements={};
  return state.athleteState;
}

function epley1RM(load,reps){load=Number(load)||0;reps=Number(reps)||0;if(!load||!reps)return 0;return load*(1+reps/30);}

function estimateLoadForRepsFrom1RM(oneRm,reps){oneRm=Number(oneRm)||0;reps=Number(reps)||1;if(!oneRm)return 0;return oneRm/(1+reps/30);}

function simpleStrengthIndexFromLoad(load){load=Number(load)||0;return Math.max(1,Math.round(load/12.5));}

function athleteMovementRecord(label){
  var ast=ensureAthleteState();
  var map=ast&&ast.movements?ast.movements:{};
  var labels=coachMovementLookupLabels(label);
  for(var a=0;a<labels.length;a++){
    if(map[labels[a]])return map[labels[a]];
  }
  var wantedList=labels.map(coachNormalizeMoveText).filter(Boolean);
  var keys=Object.keys(map||{});
  for(var i=0;i<keys.length;i++){
    var kn=coachNormalizeMoveText(keys[i]);
    for(var j=0;j<wantedList.length;j++){
      var wanted=wantedList[j];
      if(kn===wanted&&coachEquipmentCompatibleForAlias(label,keys[i]))return map[keys[i]];
    }
  }
  // Match tolérant mais prudent pour les noms combinés du vendredi Épaules 3D.
  for(var k=0;k<keys.length;k++){
    var keyNorm=coachNormalizeMoveText(keys[k]);
    for(var w=0;w<wantedList.length;w++){
      var want=wantedList[w];
      if(want.length<8)continue;
      if(!coachEquipmentCompatibleForAlias(label,keys[k]))continue;
      if(keyNorm.indexOf(want)>=0 || want.indexOf(keyNorm)>=0)return map[keys[k]];
    }
  }
  return null;
}

function coachDefaultLoadSeedForMovement(label, targetReps){
  var labels=coachMovementLookupLabels(label);
  var defaults=(typeof officialCharges==='function')?officialCharges():(window.DEFAULT_CHARGES||{});
  for(var i=0;i<labels.length;i++){
    if(defaults&&defaults[labels[i]]){
      var n=parseLoad(defaults[labels[i]]);
      if(n)return n;
    }
  }
  var n=coachNormalizeMoveText(labels.join(' '));
  // Fallbacks internes : ne modifient pas data/charges.js. Ils empêchent seulement
  // les mouvements de vendredi avec "léger/modéré" de rester sans suggestion numérique.
  if(/db shoulder press/.test(n))return 35;
  if(/lateral raise.*(cable|poulie)/.test(n))return 30;
  if(/lateral raise.*(haltere|dumbbell|db)/.test(n))return 20;
  if(/lateral raise/.test(n))return 20;
  if(/rear delt fly.*(cable|poulie)/.test(n))return 30;
  if(/rear delt fly.*(haltere|dumbbell|db)/.test(n))return 20;
  if(/rear delt fly/.test(n))return 20;
  if(/wide grip cable upright row|upright row/.test(n))return 50;
  if(/overhead rope extension/.test(n))return 50;
  if(/face pull/.test(n))return 60;
  if(/cable curl/.test(n))return 40;
  if(/power clean technique|power clean/.test(n))return 115;
  return null;
}


function coachHistoryContext(row){
  if(!row)return null;
  return row.context || (row.planned&&row.planned.context) || null;
}

function coachHistoryContextIsLimited(row){
  var ctx=coachHistoryContext(row);
  return (typeof coachIsLimitedProgressionContext==='function') ? coachIsLimitedProgressionContext(ctx) : false;
}

function coachFilterHistoryForProgression(history, context){
  var rows=Array.isArray(history)?history:[];
  if(!context || typeof coachIsLimitedProgressionContext!=='function')return rows;
  var limited=coachIsLimitedProgressionContext(context);
  return rows.filter(function(row){
    var rowCtx=coachHistoryContext(row);
    if(!rowCtx)return true; // anciennes entrées sans contexte : compatibles par transition.
    var rowLimited=coachIsLimitedProgressionContext(rowCtx);
    if(limited)return rowLimited;
    return !rowLimited;
  });
}

function coachIsTechnicalOrLimitedMovement(name, context){
  if(context && typeof coachIsLimitedProgressionContext==='function' && coachIsLimitedProgressionContext(context))return true;
  return isTechnicalMovement(name);
}

function latestMovementHistory(label){
  var mv=athleteMovementRecord(label);
  var h=(mv&&Array.isArray(mv.history))?mv.history:[];
  return h.length?h[h.length-1]:null;
}

function coachHistoryLoadNumber(row){return Number(row&&(row.load||row.actualLoad||row.capacityLoad||0))||0;}

function coachHistoryRepsNumber(row){return Number(row&&(row.reps||row.actualReps||row.currentReps||0))||0;}

function coachRecentBestControlledLoad(history, maxRpe){
  var rows=Array.isArray(history)?history:[];
  var best=null;
  maxRpe=Number(maxRpe)||8.5;
  rows.forEach(function(r){
    var load=coachHistoryLoadNumber(r), reps=coachHistoryRepsNumber(r), rpe=Number(r&&r.rpe||0)||0;
    if(!load||!rpe||rpe>maxRpe)return;
    var score=load*100+reps-(rpe>=8.5?10:0);
    if(!best||score>best.score)best={row:r,load:load,reps:reps,rpe:rpe,score:score};
  });
  return best;
}

function coachMaxJumpForExercise(label,lastLoad){
  var n=coachNormalizeMoveText(label);
  if(/bulgarian split squat/.test(n))return 10;
  if(/hip thrust/.test(n))return 30;
  if(/barbell row/.test(n))return 10;
  if(/front squat|back squat|strict press|bench press|power clean/.test(n))return 10;
  if(/db rdl/.test(n))return 10;
  if(isIsolationMovement(label))return coachLoadStepForExercise(label,lastLoad||'')||5;
  return 10;
}

function coachIsFridayContext(){return !!(state&&String(state.day||'').toLowerCase()==='vendredi');}

function coachIsMondayContext(){return !!(state&&String(state.day||'').toLowerCase()==='lundi');}

function coachLoadStepForExercise(name,loadText){
  var rule=(typeof equipmentRuleForExercise==='function')?equipmentRuleForExercise(name,loadText):null;
  if(rule&&Array.isArray(rule.available)){
    var nums=rule.available.map(Number).filter(function(x){return !isNaN(x);}).sort(function(a,b){return a-b;});
    if(nums.length>1){var best=5;for(var i=1;i<nums.length;i++){var d=nums[i]-nums[i-1];if(d>0)best=Math.min(best,d);}return best;}
  }
  if(rule&&rule.step)return Number(rule.step)||5;
  return 5;
}

function isIsolationMovement(name){
  var n=coachNormalizeMoveText(name);
  return /lateral raise|rear delt|curl|rope extension|pushdown|face pull|trap 3|serratus|calf|fly/.test(n);
}

function isTechnicalMovement(name){
  var n=coachNormalizeMoveText(name);
  return /technique|leger|light|warm up|warmup/.test(n) || n.indexOf("power clean technique")>=0;
}

function isTechnicalMovementInContext(name, context){
  return coachIsTechnicalOrLimitedMovement(name, context);
}

function storeLoadDecisionHint(name,loadText,reason,severity,history,context){
  window.__coachLoadHints=window.__coachLoadHints||{};
  var ctx=(context&&context.label)?context:((typeof coachBuildMovementContext==='function')?coachBuildMovementContext(name,context||{}):null);
  var label=ctx&&ctx.label?ctx.label:canonicalMovementLabel(name);
  var rows=(history||[]).slice(-5).reverse().map(function(x){return{date:x.date||"?",load:x.load||x.actualLoad||x.capacityLoad||"?",reps:x.reps||x.actualReps||x.currentReps||"?",rpe:x.rpe||"?",status:x.status||""};});
  var payload={name:label,load:loadText,reason:reason||"Charge prévue par le programme.",severity:severity||"ok",rows:rows};
  // V51.40 : contexte disponible pour debug/audit futur, non affiché et non persistant.
  if(ctx)payload.context={equipment:ctx.equipment||"",intent:ctx.primaryIntent||"",intents:ctx.intents||[],kind:ctx.kind||"",day:ctx.day||"",week:ctx.week||""};
  var aliases=(typeof coachMovementLookupLabels==='function')?coachMovementLookupLabels(label):[label];
  aliases.forEach(function(a){ window.__coachLoadHints[coachNormalizeMoveText(a)]=payload; });
}
