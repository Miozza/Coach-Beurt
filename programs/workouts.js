// Coach Bertin V48.0 — séances détaillées extraites de app.js
// app.js doit rester le moteur; ce fichier contient la construction des workouts.

// Coach Bertin V48.1 — moteur générique de construction des workouts
// Les programmes autonomes peuvent exposer cfg.getBlocks(day, week).

function ex(name,format,load,rest,note){return{name:name,format:format,load:charge(name,load||"—"),rest:rest||"—",note:note||""};}
function exFixed(name,format,load,rest,note){return{name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

// ─── Construction WOD ────────────────────────────────────────────────────────

function buildWorkout(day,week){
  var cfg=focus(),i=Math.max(0,Math.min(3,week-1));
  var d=baseDays[day] || {label:day,base:"",focus:""};
  if(cfg && cfg.dayMeta && cfg.dayMeta[day]) d = Object.assign({}, d, cfg.dayMeta[day]);
  // Programme autonome : le fichier programme fournit ses propres blocs.
  // Exemple actuel : programs/epaules_3d.js.
  if(cfg && typeof cfg.getBlocks === "function"){
    return {day:d, blocks:cfg.getBlocks(day,week), progress:[]};
  }
  var progress=d.progress.slice();
  if(state.cycle.goal==="weightlifting"&&day==="vendredi")progress=["powerClean","frontSquat","strictPress"];
  if(state.cycle.goal==="posture"&&day==="lundi")progress=["bench","chestRow","inclineDb"];
  var wodText;
  if(state.cycle.goal==="weightlifting")wodText=wodBanks.weightlifting[(week-1)%wodBanks.weightlifting.length];
  else if(state.cycle.goal==="engine")wodText=wodBanks.engine[(week-1)%wodBanks.engine.length];
  else if(state.cycle.goal==="maintenance")wodText=wodBanks.lowimpact[(week-1)%wodBanks.lowimpact.length];
  else if(day==="lundi")wodText=wodBanks.push[(week-1)%wodBanks.push.length];
  else if(day==="mardi")wodText=wodBanks.pull[(week-1)%wodBanks.pull.length];
  else if(day==="jeudi")wodText=wodBanks.legs[(week-1)%wodBanks.legs.length];
  else wodText=wodBanks.engine[(week-1)%wodBanks.engine.length];
  var accessTxt=d.accessory;
  var blocks=[
    {time:"8 min", title:"Warm-up",    kind:"warmup",   tag:"Préparation",text:d.warmup,    progress:[]},
    {time:"25 min",title:"Bloc principal",kind:"main",  tag:"Charge",     text:movements[progress[0]].name+" "+cfg.sets[i]+".",progress:[progress[0]]},
    {time:"12 min",title:"Accessoires",kind:"accessory",tag:"Accessoires",text:accessTxt,   progress:progress.slice(1)},
    {time:"10 min",title:"WOD",        kind:"wod",      tag:"Conditioning",text:wodText,    progress:[]},
    {time:"5 min", title:"Mobilité",   kind:"mobility", tag:"Reset",      text:"Mobilité ciblée + retour au calme.",progress:[]}
  ];
  return{day:d,blocks:blocks,progress:progress};
}

function cycleRules(){
  var cfg = focus();
  if(cfg && cfg.cycleRules && cfg.cycleRules.length) return cfg.cycleRules;
  return["Aucun échec sur les mouvements principaux.","Technique propre avant intensité.","Si douleur articulaire : baisse la charge, garde l'amplitude propre."];
}
function dayIntention(day){
  var cfg = focus();
  if(cfg && cfg.dayIntentions && cfg.dayIntentions[day]) return cfg.dayIntentions[day];
  return"Qualité avant intensité.";
}
