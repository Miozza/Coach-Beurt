// Coach Bertin V49.5
var APP_VERSION = "V49.5";
var GITHUB_OWNER = "Miozza";
var GITHUB_REPO  = "Coach-Beurt";
var GITHUB_FILE  = "data/resultats.json";
var ATHLETE_STATE_FILE = "data/athlete_state.json";
var CYCLE_STATE_FILE   = "data/cycle_state.json";

// Objectifs compétition janvier 2027
var COMPETITION_DATE = new Date("2027-01-15");
var PHASE_TARGETS = {
  1: { bench:null, backSquat:null, note:"Épaules saines, posture améliorée, récupération post-compétition." },
  2: { bench:285,  backSquat:260,  note:"Bench 285 lb, Back squat 260 lb x5, RDL et hip thrust solides." },
  3: { bench:300,  backSquat:285,  note:"Bench 300 lb, Back squat 285 lb, tolérer 75 reps squats compétition." },
  4: { bench:null, backSquat:null, note:"Performance Open CrossFit janvier 2027. Benchmarks, synchro, peaking." }
};

// ─── WeekInfo dynamique selon le programme actif ─────────────────────────────
// Construit à partir des données du programme (4 ou 6 semaines)

function buildWeekInfo(){
  var cfg = focus();
  var labels = cfg.weekLabels || ["S1","S2","S3","S4"];
  var goals  = cfg.weekGoals  || ["Base.","Volume.","Intensité.","Deload."];
  var info = {};
  labels.forEach(function(lbl,i){
    info[i+1] = { label: lbl, goal: goals[i] || "" };
  });
  return info;
}
function totalWeeks(){
  var cfg=focus();
  if(cfg&&cfg.weekLabels&&cfg.weekLabels.length)return cfg.weekLabels.length;
  if(cfg&&cfg.sets&&cfg.sets.length)return cfg.sets.length;
  return 4;
}

// ─── FocusConfigs de base (fallback) ─────────────────────────────────────────

var focusConfigs = {
  maintenance:  {
    label:"Maintien / récupération", phase:0,
    impact:"Charges basses, technique, mobilité, zone 2.",
    weekLabels:["S1","S2","S3","S4"], weekGoals:["Base.","Volume.","Intensité.","Deload."],
    sets:["3 x 5 facile","3 x 5 facile","3 x 3 propre","2 x 5 léger"],
    targetReps:[5,5,3,5], mult:[0.55,0.58,0.62,0.50], rest:"1:30–2:00", tag:"récupération"
  },
  posture: {
    label:"Posture / cyphose", phase:0,
    impact:"Plus de tirage, serratus, trap inférieur, mobilité thoracique.",
    weekLabels:["S1","S2","S3","S4"], weekGoals:["Base.","Volume.","Intensité.","Deload."],
    sets:["4 x 6 propre","4 x 6 propre","5 x 4","3 x 6 tempo"],
    targetReps:[6,6,4,6], mult:[0.68,0.70,0.75,0.55], rest:"1:45–2:15", tag:"posture"
  },
  strength: {
    label:"Force classique", phase:0,
    impact:"Plus lourd, moins de volume inutile, repos longs.",
    weekLabels:["S1","S2","S3","S4"], weekGoals:["Base.","Volume.","Intensité.","Deload."],
    sets:["5 x 5","5 x 4","6 x 3","3 x 5 léger"],
    targetReps:[5,4,3,5], mult:[0.75,0.80,0.86,0.60], rest:"2:00–2:30", tag:"force"
  }
};

// Charger les programmes externes (programs/*.js)
if (window.COACH_BERTIN_PROGRAMS) {
  Object.keys(window.COACH_BERTIN_PROGRAMS).forEach(function(id) {
    var p = window.COACH_BERTIN_PROGRAMS[id];
    focusConfigs[id] = Object.assign({}, focusConfigs[id]||{}, p);
  });
}

// Données de profil, mouvements et banques WOD chargées depuis programs/config.js

var KEY       = "coachBertinState";       // clé stable : ne change plus avec les versions
var LEGACY_KEYS = ["coachBertinV46", "coachBertinV43", "coachBertinV41"];
var CHARGE_KEY= "coachBertinCustomCharges";
var LEGACY_CHARGE_KEYS = ["coachBertinCustomChargesV46"];
var TOKEN_KEY = "coachBertinGithubToken";
var DAYS_ORDER= ["lundi","mardi","jeudi","vendredi"];

// ─── Références pré-chargées ─────────────────────────────────────────────────

var PRELOADED_REFS = {
  "bench__strength":        {movement:"bench",      range:"strength",   load:265,reps:5, date:"préchargé",lastActual:265,status:"preloaded",quality:"clean",rpe:8},
  "bench__hypertrophy":     {movement:"bench",      range:"hypertrophy",load:215,reps:8, date:"préchargé",lastActual:215,status:"preloaded",quality:"clean",rpe:8},
  "bench__endurance":       {movement:"bench",      range:"endurance",  load:185,reps:15,date:"préchargé",lastActual:185,status:"preloaded",quality:"clean",rpe:8},
  "inclineDb__strength":    {movement:"inclineDb",  range:"strength",   load:85, reps:5, date:"préchargé",lastActual:85, status:"preloaded",quality:"clean",rpe:8},
  "inclineDb__hypertrophy": {movement:"inclineDb",  range:"hypertrophy",load:60, reps:8, date:"préchargé",lastActual:60, status:"preloaded",quality:"clean",rpe:8},
  "strictPress__strength":  {movement:"strictPress",range:"strength",   load:155,reps:5, date:"préchargé",lastActual:155,status:"preloaded",quality:"clean",rpe:8},
  "strictPress__hypertrophy":{movement:"strictPress",range:"hypertrophy",load:135,reps:8,date:"préchargé",lastActual:135,status:"preloaded",quality:"clean",rpe:8},
  "chestRow__strength":     {movement:"chestRow",   range:"strength",   load:155,reps:5, date:"préchargé",lastActual:155,status:"preloaded",quality:"clean",rpe:8},
  "chestRow__hypertrophy":  {movement:"chestRow",   range:"hypertrophy",load:115,reps:8, date:"préchargé",lastActual:115,status:"preloaded",quality:"clean",rpe:8},
  "latPulldown__hypertrophy":{movement:"latPulldown",range:"hypertrophy",load:20,reps:8, date:"préchargé",lastActual:20, status:"preloaded",quality:"clean",rpe:8},
  "frontSquat__strength":   {movement:"frontSquat", range:"strength",   load:224,reps:5, date:"préchargé",lastActual:224,status:"preloaded",quality:"acceptable",rpe:8},
  "frontSquat__hypertrophy":{movement:"frontSquat", range:"hypertrophy",load:185,reps:8, date:"préchargé",lastActual:185,status:"preloaded",quality:"acceptable",rpe:8},
  "hipThrust__strength":    {movement:"hipThrust",  range:"strength",   load:315,reps:5, date:"préchargé",lastActual:315,status:"preloaded",quality:"clean",rpe:8},
  "hipThrust__hypertrophy": {movement:"hipThrust",  range:"hypertrophy",load:315,reps:8, date:"préchargé",lastActual:315,status:"preloaded",quality:"clean",rpe:8},
  "bulgarian__strength":    {movement:"bulgarian",  range:"strength",   load:60, reps:5, date:"préchargé",lastActual:60, status:"preloaded",quality:"clean",rpe:8},
  "bulgarian__hypertrophy": {movement:"bulgarian",  range:"hypertrophy",load:40, reps:8, date:"préchargé",lastActual:40, status:"preloaded",quality:"clean",rpe:8},
  "powerClean__strength":   {movement:"powerClean", range:"strength",   load:215,reps:5, date:"préchargé",lastActual:215,status:"preloaded",quality:"clean",rpe:8},
  "powerClean__hypertrophy":{movement:"powerClean", range:"hypertrophy",load:185,reps:8, date:"préchargé",lastActual:185,status:"preloaded",quality:"clean",rpe:8},
  "dbSnatch__hypertrophy":  {movement:"dbSnatch",   range:"hypertrophy",load:50, reps:8, date:"préchargé",lastActual:50, status:"preloaded",quality:"clean",rpe:8},
  "farmerCarry__hypertrophy":{movement:"farmerCarry",range:"hypertrophy",load:28,reps:8, date:"préchargé",lastActual:28, status:"preloaded",quality:"clean",rpe:8}
};

// ─── State ───────────────────────────────────────────────────────────────────

var state = {
  week: 1,
  day: "lundi",
  history: [],
  profile: copy(defaultProfile),
  trainingMaxPct: 0.925,
  cycle: { goal:"shoulders3d" },
  movementRefs: copy(PRELOADED_REFS),
  // Suivi RPE par mouvement pour progression automatique
  rpeHistory: {},        // { "mvKey__range": [rpe1, rpe2, rpe3] } — 3 dernières séances
  sessionCount: {},      // { "lundi": 2, "mardi": 1, ... } — séances complétées par jour cette semaine
  completedDays: [],     // ["lundi", "mardi"] — jours complétés cette semaine
  deloadAlert: false,    // true si le système détecte fatigue RPE
  athleteState: { movements:{}, updatedAt:null, version:null }, // Niveau réel durable par mouvement
  cycleState: null       // Où le cycle est rendu, sauvegardable indépendamment des versions
};
var customCharges = {};

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function copy(o){return JSON.parse(JSON.stringify(o));}
function $(id){return document.getElementById(id);}

function findFirstStored(keys){
  for(var i=0;i<keys.length;i++){
    try{
      var raw=localStorage.getItem(keys[i]);
      if(raw)return {key:keys[i], raw:raw};
    }catch(e){}
  }
  return null;
}
function load(){
  try{
    var found = findFirstStored([KEY].concat(LEGACY_KEYS));
    if(found&&found.raw){
      var p = JSON.parse(found.raw);
      state = Object.assign(state, p);
      state.profile      = Object.assign(copy(defaultProfile), p.profile||{});
      state.cycle        = Object.assign({goal:"shoulders3d"}, p.cycle||{});
      state.movementRefs = Object.assign(copy(PRELOADED_REFS), p.movementRefs||{});
      state.history      = p.history || [];
      state.rpeHistory   = p.rpeHistory || {};
      state.completedDays= p.completedDays || [];
      state.deloadAlert  = p.deloadAlert || false;
      state.athleteState = p.athleteState || { movements:{}, updatedAt:null, version:null };
      state.cycleState   = p.cycleState || null;
      // Migration douce vers la clé stable, sans effacer les anciennes clés.
      if(found.key!==KEY)save();
    }
  }catch(e){}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}

function loadCustomCharges(){
  try{
    var found = findFirstStored([CHARGE_KEY].concat(LEGACY_CHARGE_KEYS));
    customCharges = found&&found.raw ? JSON.parse(found.raw) : {};
    if(found&&found.key!==CHARGE_KEY)saveCustomCharges();
  }catch(e){customCharges={};}
}
function saveCustomCharges(){try{localStorage.setItem(CHARGE_KEY,JSON.stringify(customCharges));}catch(e){}}

function getToken(){return localStorage.getItem(TOKEN_KEY)||"";}
function setToken(t){localStorage.setItem(TOKEN_KEY,t.trim());}

function chargeKeyFromName(n){return String(n||"").replace(/^[A-Z][0-9]?\.\s*/,"").trim();}
function officialCharges(){return window.DEFAULT_CHARGES||{};}
function charge(name,fallback){
  var key=chargeKeyFromName(name);
  var c=customCharges[key];
  if(c!==undefined&&String(c).trim()!=="")return String(c).trim();
  var o=officialCharges()[key];
  if(o!==undefined&&String(o).trim()!=="")return String(o).trim();
  return fallback||"—";
}
function displayChargeText(t){
  t=String(t||"");
  t=t.replace(/Wall Ball 14 lb/g,"Wall Ball "+charge("Wall Ball","14 lb"));
  t=t.replace(/wall balls 14 lb/g,"wall balls "+charge("Wall Ball","14 lb"));
  t=t.replace(/Wall balls 14 lb/g,"Wall balls "+charge("Wall Ball","14 lb"));
  return t;
}
function chargeList(){
  var defs=officialCharges(),order=window.CHARGE_ORDER||Object.keys(defs),seen={},list=[];
  order.forEach(function(k){if(defs[k]!==undefined&&!seen[k]){seen[k]=true;list.push(k);}});
  Object.keys(defs).forEach(function(k){if(!seen[k]){seen[k]=true;list.push(k);}});
  return list;
}


// ─── Athlete State : niveau réel durable par mouvement ─────────────────────

function nowIso(){try{return new Date().toISOString();}catch(e){return String(new Date());}}
function normalizeExerciseName(name){return chargeKeyFromName(name).toLowerCase().replace(/[^a-z0-9à-ÿ]+/g," ").trim();}
function athleteMoveId(nameOrKey){
  var mvKey=resolveMovementKey ? resolveMovementKey(nameOrKey) : null;
  if(mvKey&&movements[mvKey])return movements[mvKey].name;
  return chargeKeyFromName(nameOrKey||"Mouvement");
}
function ensureAthleteState(){
  if(!state.athleteState)state.athleteState={movements:{},updatedAt:null,version:null};
  if(!state.athleteState.movements)state.athleteState.movements={};
  return state.athleteState;
}
function epley1RM(load,reps){load=Number(load)||0;reps=Number(reps)||0;if(!load||!reps)return 0;return load*(1+reps/30);}
function estimateLoadForRepsFrom1RM(oneRm,reps){oneRm=Number(oneRm)||0;reps=Number(reps)||1;if(!oneRm)return 0;return oneRm/(1+reps/30);}
function simpleLevelFromLoad(load){load=Number(load)||0;return Math.max(1,Math.round(load/12.5));}
function movementLabelFromKeyOrName(key){var mvKey=resolveMovementKey ? resolveMovementKey(key) : null;return mvKey&&movements[mvKey]?movements[mvKey].name:chargeKeyFromName(key);}
function plannedMapFromSessionExercises(){
  var map={};
  try{
    collectSessionExercises().forEach(function(it){
      if(!it||it.isWod)return;
      var label=movementLabelFromKeyOrName(it.key||it.name);
      var plannedLoad=parseLoad(it.suggested);
      var targetMin=Number(it.targetMin)||0;
      var targetMax=Number(it.targetMax)||targetMin||0;
      map[it.key]={name:label,load:plannedLoad,reps:targetMin||targetMax, targetMin:targetMin, targetMax:targetMax, format:it.format||"", kind:it.kind||""};
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
      r.planned={load:lookup.load||null,reps:lookup.reps||null,targetMin:lookup.targetMin||null,targetMax:lookup.targetMax||null,format:lookup.format||"",kind:lookup.kind||""};
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
    var targetReps=Number(planned.reps||planned.targetMin)||reps;
    var cls=classifyPerformance(r,planned);
    var oneRM=epley1RM(load,reps);
    var capacityLoad=load;
    var confidence=0.65;
    var status=cls.status;
    if(cls.status==="major_fail"){
      capacityLoad=round5(estimateLoadForRepsFrom1RM(oneRM,targetReps))||load;
      confidence=0.35;
      status="recalibrating";
    }else if(cls.status==="failed"){
      capacityLoad=round5(estimateLoadForRepsFrom1RM(oneRM,targetReps))||load;
      confidence=0.50;
      status="watch";
    }else if(cls.status==="easy_success"){
      capacityLoad=load;
      confidence=0.85;
      status="level_up_ready";
    }else if(cls.status==="hard_success"){
      capacityLoad=load;
      confidence=0.70;
      status="hard";
    }
    if(!ast.movements[label]){
      ast.movements[label]={level:1,xp:0,ranges:{},history:[],lastUpdated:null,status:"new"};
    }
    var mv=ast.movements[label];
    mv.ranges=mv.ranges||{};mv.history=mv.history||[];
    var prev=mv.ranges[range]||{};
    var shouldReplace = !prev.currentLoad || cls.status==="major_fail" || cls.status==="failed" || load>=Number(prev.currentLoad||0) || confidence>Number(prev.confidence||0);
    if(shouldReplace){
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
    var xpDelta = cls.status==="easy_success"?25:cls.status==="success"?15:cls.status==="hard_success"?10:cls.status==="failed"?-5:cls.status==="major_fail"?-15:5;
    mv.xp=Math.max(0,Number(mv.xp||0)+xpDelta);
    mv.level=simpleLevelFromLoad(Math.max(capacityLoad,Number(prev.currentLoad||0)));
    mv.status=status;
    mv.lastUpdated=dateStr;
    mv.history.push({date:dateStr,load:load,reps:reps,rpe:rpe,range:range,status:status,capacityLoad:capacityLoad,planned:planned||null});
    if(mv.history.length>12)mv.history=mv.history.slice(-12);
  });
  ast.updatedAt=nowIso();ast.version=APP_VERSION;
}
function athleteSuggestedLoad(nameOrKey, currentLoad, targetReps){
  // athlete_state est la source principale de vérité pour la charge suggérée.
  // Si des données existent pour ce mouvement + plage de reps → on les utilise en priorité.
  // Sinon → fallback sur la charge du programme.
  var ast=ensureAthleteState();
  var label=movementLabelFromKeyOrName(nameOrKey);
  var mv=ast.movements&&ast.movements[label];
  if(mv&&mv.ranges){
    var range=repRange(Number(targetReps)||8);
    var cap=mv.ranges[range];
    if(cap&&cap.currentLoad){
      var capLoad=Number(cap.currentLoad)||0;
      if(capLoad>0){
        if(cap.status==="recalibrating"||cap.confidence<0.45){
          return lb(capLoad)+" ⚠";
        }
        if(cap.status==="watch"||cap.confidence<0.55){
          return lb(capLoad)+" ⚠";
        }
        if(cap.status==="level_up_ready"){
          return lb(round5(capLoad+5))+" ↑";
        }
        // success, hard, pr, preloaded, hard_success → charge confirmée
        return lb(capLoad);
      }
    }
  }
  // Fallback : charge du programme (aucune donnée athlete_state pour ce mouvement)
  var load=parseLoad(currentLoad);
  if(!load)return currentLoad||"—";
  return currentLoad;
}
function buildCycleStatePayload(){
  return {
    version:APP_VERSION,
    updatedAt:nowIso(),
    activeCycle:state.cycle&&state.cycle.goal?state.cycle.goal:"shoulders3d",
    activeWeek:state.week,
    activeDay:state.day,
    completedDays:state.completedDays||[],
    focus:focus()?focus().label:"",
    cycleStartedAt:(state.cycleState&&state.cycleState.cycleStartedAt)||nowIso()
  };
}
function applyCycleStatePayload(cycleData){
  if(!cycleData||typeof cycleData!=="object")return;
  state.cycleState=cycleData;
  if(cycleData.activeCycle)state.cycle={goal:cycleData.activeCycle};
  if(cycleData.activeWeek)state.week=Number(cycleData.activeWeek)||state.week;
  if(cycleData.activeDay)state.day=cycleData.activeDay;
  if(Array.isArray(cycleData.completedDays))state.completedDays=cycleData.completedDays;
}

function round5(n){if(n===0)return 0;if(!n||isNaN(n))return null;return Math.round(n/5)*5;}
function lb(n){var r=round5(n);return(r===0||r)?r+" lb":"—";}
function parseLoad(v){if(v===0||v==="0")return 0;if(!v)return null;var m=String(v).replace(",",".").match(/[0-9]+(\.[0-9]+)?/);return m?Number(m[0]):null;}

function focus(){return focusConfigs[state.cycle.goal]||focusConfigs.maintenance||focusConfigs.shoulders3d||Object.values(focusConfigs)[0]||{};}
function weekIdx(){var tw=Math.max(1,totalWeeks());return Math.max(0,Math.min(tw-1,state.week-1));}
function repRange(reps){reps=Number(reps)||0;if(reps<=5)return"strength";if(reps<=12)return"hypertrophy";return"endurance";}
function repRangeLabel(r){return r==="strength"?"1–5 reps":r==="hypertrophy"?"6–12 reps":"13+ reps";}
function refKey(mvKey,reps){return mvKey+"__"+repRange(reps);}

function tmFromProfile(mvKey){
  var mv=movements[mvKey];if(!mv||!mv.profile)return 0;
  var raw=Number(state.profile[mv.profile]);return raw?raw*Number(state.trainingMaxPct||0.925):0;
}
function referenceBase(mvKey,targetReps){
  var key=mvKey+"__"+repRange(targetReps),ref=state.movementRefs[key];
  if(ref&&ref.load!==undefined&&ref.load!==null&&ref.load!=="")return{value:Number(ref.load),source:"reference",ref:ref};
  if(estimatedDailyLoads[mvKey])return{value:Number(estimatedDailyLoads[mvKey]),source:"estimate",ref:null};
  var fb=tmFromProfile(mvKey);return{value:fb,source:fb?"profile":"none",ref:null};
}
function referenceMultiplier(ref){
  var table={hypertrophy:[0.82,0.85,0.88,0.65],shoulders3d:[0.68,0.72,0.76,0.58],strength:[0.84,0.87,0.90,0.68],weightlifting:[0.72,0.76,0.80,0.60],posture:[0.75,0.78,0.82,0.60],engine:[0.70,0.73,0.76,0.58],recomp:[0.78,0.82,0.85,0.62],maintenance:[0.60,0.62,0.65,0.55]};
  var m=(table[state.cycle.goal]||table.hypertrophy)[weekIdx()];
  if(ref){if(ref.status==="hard"||Number(ref.rpe)>=9)m-=0.05;if(ref.quality==="acceptable")m-=0.025;if(ref.quality==="doubtful")m-=0.08;}
  return Math.max(0.45,Math.min(m,0.90));
}
function profileMultiplier(index){var base=focus().mult[weekIdx()];return index===0?base:Math.max(0.45,base-0.12);}
function suggestLoad(mvKey,pct,targetReps){
  var base=referenceBase(mvKey,targetReps);
  if(!base.value)return 0;
  if(base.source==="estimate")return base.value;
  if(base.source==="reference")return base.value*referenceMultiplier(base.ref);
  return base.value*pct;
}
function progressionPct(index){return profileMultiplier(index);}
function targetReps(index,kind){
  var goal=state.cycle.goal,week=weekIdx();
  if(kind==="main")return focus().targetReps[week]||5;
  if(kind==="accessory"){if(goal==="shoulders3d")return 15;if(goal==="strength")return 8;if(goal==="weightlifting")return 3;if(goal==="posture")return 12;return 10;}
  if(kind==="wod")return goal==="shoulders3d"?12:8;
  return focus().targetReps[week]||5;
}
function setScheme(kind,index){
  var goal=state.cycle.goal,week=weekIdx();
  if(kind==="main")return focus().sets[week];
  if(kind==="accessory"){if(goal==="shoulders3d")return"3-4 x 15";if(goal==="strength")return"3 x 8";if(goal==="weightlifting")return"5 x 3 technique";if(goal==="posture")return"3 x 12";if(goal==="engine")return"2 x 10";return"3 x 10";}
  return"—";
}
function restFor(kind){
  if(kind==="main")return focus().rest;
  if(kind==="accessory")return state.cycle.goal==="strength"?"2:00–2:30":state.cycle.goal==="shoulders3d"?"0:30–1:00":"0:45–1:15";
  if(kind==="wod")return"selon WOD";
  return"—";
}
function parseRestToSeconds(s){
  var m=String(s||"").match(/(\d+):(\d+)/);if(!m)return 0;
  return Number(m[1])*60+Number(m[2]);
}
function cleanLine(s){return String(s||"").replace(/\s+/g," ").trim();}
function currentDayLabel(){
  var d=baseDays&&baseDays[state.day];
  return (d&&d.label)||state.day||"—";
}

// Construction des séances chargée depuis programs/workouts.js

// ─── Moteur audio (Web Audio API) ────────────────────────────────────────────
// Fonctionne sans fichier externe, génère les sons en temps réel

var audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
  return audioCtx;
}
// Résume le contexte après interaction utilisateur (requis iOS)
function resumeAudio(){var ctx=getAudioCtx();if(ctx&&ctx.state==="suspended")ctx.resume();}

function playBeep(freq,dur,vol,type){
  var ctx=getAudioCtx();if(!ctx)return;
  try{
    var osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    osc.type=type||"sine";osc.frequency.setValueAtTime(freq,ctx.currentTime);
    gain.gain.setValueAtTime(vol||0.4,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+dur);
  }catch(e){}
}

// Bip court aigu (countdown 3-2-1)
function bipCountdown(){playBeep(880,0.12,0.5);}
// Bip long grave (départ / fin)
function bipStart(){playBeep(660,0.35,0.6);setTimeout(function(){playBeep(880,0.35,0.6);},180);}
function bipEnd(){playBeep(440,0.5,0.7);setTimeout(function(){playBeep(330,0.7,0.7);},250);}
// Bip minute EMOM
function bipEmom(){playBeep(1047,0.18,0.5);setTimeout(function(){playBeep(1047,0.18,0.5);},220);}
// Bip fin repos
function bipRestDone(){playBeep(660,0.2,0.5);setTimeout(function(){playBeep(880,0.3,0.6);},150);setTimeout(function(){playBeep(1047,0.4,0.7);},320);}

function vibrate(p){try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}}

// ─── Timer WOD ───────────────────────────────────────────────────────────────

var wodTimer={duration:0,remaining:0,elapsed:0,running:false,interval:null,mode:"down",label:"",isEmom:false,countdownActive:false};

// ─── parseCapSeconds / buildTimeOptions (For time WODs) ──────────────────────
function parseCapSeconds(text, durationMin){
  var m = String(text||"").match(/[Cc]ap\s+(\d+)\s*min/);
  if(m) return Number(m[1])*60;
  return (durationMin||15)*60;
}
function buildTimeOptions(expectedSec){
  var options=[], step=30;
  var max = expectedSec + 180;
  for(var s=30; s<=max; s+=step){ options.push(s); }
  return options;
}

function parseTimeToSeconds(t){var m=String(t||"").match(/(\d+)\s*min/);return m?Number(m[1])*60:0;}
function formatClock(sec){sec=Math.max(0,Math.floor(sec||0));return String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0");}

function wodTimerConfig(block){
  var txt=String((block&&block.text)||""),seconds=parseTimeToSeconds(block&&block.time),label="Timer",mode="down",isEmom=false;
  if(/AMRAP/i.test(txt)){label="AMRAP "+Math.round(seconds/60)+" min";}
  else if(/EMOM/i.test(txt)){label="EMOM "+Math.round(seconds/60)+" min";isEmom=true;}
  else if(/For time|Cap/i.test(txt)){label="CAP "+Math.round(seconds/60)+" min";mode="up";}
  if(!seconds){seconds=8*60;label="Timer 8 min";}
  return{seconds:seconds,label:label,mode:mode,isEmom:isEmom};
}
function stopWodTimer(){
  if(wodTimer.interval){clearInterval(wodTimer.interval);wodTimer.interval=null;}
  wodTimer.running=false;wodTimer.countdownActive=false;
  var d=$("pcTimerDisplay");if(d)d.style.color="";
}
function wodTimerCurrentValue(){return wodTimer.mode==="up"?wodTimer.elapsed:wodTimer.remaining;}
function updateWodTimerDisplay(){
  var d=$("pcTimerDisplay");if(!d)return;
  // Pendant le countdown 10s afficher le compte à rebours en rouge
  if(wodTimer.countdownActive){
    d.textContent=String(wodTimer.countdownRemaining);
    d.style.color="var(--red)";d.style.fontSize="88px";
  } else {
    d.textContent=formatClock(wodTimerCurrentValue());
    d.style.color="";d.style.fontSize="";
  }
}
function resetWodTimerState(dur,mode,label,isEmom){
  stopWodTimer();
  wodTimer.duration=dur;wodTimer.mode=mode||"down";wodTimer.label=label||"Timer";
  wodTimer.elapsed=0;wodTimer.remaining=dur;wodTimer.isEmom=!!isEmom;
}

function startWodCountdown(onDone){
  // 10 secondes de countdown avant le départ
  wodTimer.countdownActive=true;
  wodTimer.countdownRemaining=10;
  updateWodTimerDisplay();
  var cd=setInterval(function(){
    wodTimer.countdownRemaining--;
    // Bips aux 3 dernières secondes
    if(wodTimer.countdownRemaining<=3&&wodTimer.countdownRemaining>0){bipCountdown();vibrate([60]);}
    if(wodTimer.countdownRemaining<=0){
      clearInterval(cd);
      wodTimer.countdownActive=false;
      bipStart();vibrate([200,80,200]);
      onDone();
    }
    updateWodTimerDisplay();
  },1000);
}

function setupWodTimer(){
  var box=document.querySelector(".pc-timer");
  if(!box){stopWodTimer();return;}
  var dur=Number(box.getAttribute("data-duration"))||0;
  var mode=box.getAttribute("data-mode")||"down";
  var label=box.getAttribute("data-label")||"Timer";
  var isEmom=box.getAttribute("data-emom")==="1";
  if(wodTimer.duration!==dur||wodTimer.mode!==mode)resetWodTimerState(dur,mode,label,isEmom);
  updateWodTimerDisplay();
  var start=$("pcTimerStart"),pause=$("pcTimerPause"),reset=$("pcTimerReset");

  if(start)start.onclick=function(){
    resumeAudio();
    if(wodTimer.running||wodTimer.countdownActive)return;
    start.textContent="...";start.disabled=true;
    // Countdown 10s puis démarrage
    startWodCountdown(function(){
      start.textContent="▶";start.disabled=false;
      wodTimer.running=true;
      wodTimer.interval=setInterval(function(){
        if(wodTimer.mode==="up"){
          wodTimer.elapsed=Math.min(wodTimer.duration,wodTimer.elapsed+1);
          updateWodTimerDisplay();
          // Bip à chaque minute EMOM
          if(wodTimer.isEmom&&wodTimer.elapsed>0&&wodTimer.elapsed%60===0){bipEmom();vibrate([100,50,100]);}
          if(wodTimer.elapsed>=wodTimer.duration){stopWodTimer();bipEnd();vibrate([300,100,300,100,300]);}
        } else {
          wodTimer.remaining=Math.max(0,wodTimer.remaining-1);
          updateWodTimerDisplay();
          // Bips 3 dernières secondes
          if(wodTimer.remaining<=3&&wodTimer.remaining>0){bipCountdown();vibrate([60]);}
          // Bip à chaque minute EMOM (quand remaining tombe sur multiple de 60)
          if(wodTimer.isEmom&&wodTimer.remaining>0&&wodTimer.remaining%60===0){bipEmom();vibrate([100,50,100]);}
          if(wodTimer.remaining<=0){stopWodTimer();bipEnd();vibrate([300,100,300,100,300]);}
        }
      },1000);
    });
  };
  if(pause)pause.onclick=function(){stopWodTimer();updateWodTimerDisplay();};
  if(reset)reset.onclick=function(){
    resetWodTimerState(dur,mode,label,isEmom);
    var s=$("pcTimerStart");if(s){s.textContent="▶";s.disabled=false;}
    updateWodTimerDisplay();
  };
}

// ─── Timer repos ─────────────────────────────────────────────────────────────

var restTimer={remaining:0,interval:null,running:false};

function updateRestDisplay(){
  var d=$("restDisplay");if(!d)return;
  d.textContent=formatClock(restTimer.remaining);
  d.className="rest-display"+(restTimer.running?" active":restTimer.remaining===0?" done":"");
}
function stopRestTimer(){
  if(restTimer.interval){clearInterval(restTimer.interval);restTimer.interval=null;}
  restTimer.running=false;updateRestDisplay();
}
function startRestTimer(seconds){
  resumeAudio();
  stopRestTimer();restTimer.remaining=seconds;restTimer.running=true;updateRestDisplay();
  restTimer.interval=setInterval(function(){
    restTimer.remaining=Math.max(0,restTimer.remaining-1);
    updateRestDisplay();
    // Bips 3 dernières secondes du repos
    if(restTimer.remaining<=3&&restTimer.remaining>0){bipCountdown();vibrate([60]);}
    if(restTimer.remaining<=0){
      stopRestTimer();bipRestDone();vibrate([300,100,300,100,300]);
      var d=$("restDisplay");if(d)d.className="rest-display done";
    }
  },1000);
}
function setupRestBar(){
  var map={rb45:45,rb60:60,rb90:90,rb120:120};
  Object.keys(map).forEach(function(id){var b=$(id);if(b)b.onclick=function(){resumeAudio();startRestTimer(map[id]);};});
  var stop=$("rbStop");if(stop)stop.onclick=function(){stopRestTimer();restTimer.remaining=0;updateRestDisplay();};
}

// ─── Saisie résultats & GitHub sync ──────────────────────────────────────────

// Extrait la plage de reps cible depuis le format (ex: "4 x 15-20" → {min:15,max:20})
// ou depuis un nombre simple (ex: "5 x 8" → {min:8,max:8})
function parseTargetReps(format, repsHint){
  // Chercher une plage "X-Y" dans le format
  var rangeMatch = String(format||"").match(/(\d+)\s*[–\-]\s*(\d+)/);
  if(rangeMatch) return {min:Number(rangeMatch[1]), max:Number(rangeMatch[2])};
  // Chercher un nombre simple après "x" ou "×"
  var singleMatch = String(format||"").match(/[x×]\s*(\d+)/i);
  if(singleMatch) return {min:Number(singleMatch[1]), max:Number(singleMatch[1])};
  // Fallback sur repsHint
  var r = Number(repsHint)||8;
  return {min:r, max:r};
}

// Génère les chips de reps dynamiques autour de la cible
// ex: cible {min:15,max:20} → chips de 13 à 23 (±2-3 de chaque côté)
function buildRepsChips(targetMin, targetMax){
  var margin = targetMax <= 5 ? 3 : targetMax <= 10 ? 3 : 2;
  var lo = Math.max(1, targetMin - margin);
  var hi = targetMax + margin;
  var chips = [];
  for(var i = lo; i <= hi; i++) chips.push(i);
  return chips;
}

// ── Analyse la structure d'un WOD pour extraire mouvements + reps + couleurs ──
function parseWodStructure(text){
  if(!text) return null;
  var COLORS = ['mv1','mv2','mv3','mv4'];
  var raw = String(text);
  var moves = [], seen = new Set();

  function cleanMoveName(name){
    return String(name||'')
      .replace(/\bcal\b/ig,'')
      .replace(/\bmin\s*\d+\s*=\s*/ig,'')
      .replace(/\s+/g,' ')
      .replace(/[;:,.]+$/,'')
      .trim();
  }
  function addMove(reps,name){
    name = cleanMoveName(name);
    if(!name || name.length<2) return;
    var key = (String(reps)+'_'+name).toLowerCase();
    if(seen.has(key)) return;
    seen.add(key);
    moves.push({name:name, reps:String(reps), color:COLORS[moves.length % COLORS.length]});
  }

  // EMOM : "min 1 = 12 cal row ; min 2 = 10 ring rows stricts"
  if(/\bEMOM\b/i.test(raw)){
    var emomPart = raw.split('.')[0];
    var emomRe = /min\s*\d+\s*=\s*(\d+)\s*(?:cal\s+)?([^;\.]+)/ig;
    var m;
    while((m = emomRe.exec(emomPart)) !== null){ addMove(m[1], m[2]); }
    if(moves.length) return moves;
  }

  // For time 21-15-9 : les reps sont une pyramide, donc on affiche "21-15-9" pour chaque mouvement.
  var scheme = null;
  var schemeMatch = raw.match(/(\d+\s*[-–]\s*\d+\s*[-–]\s*\d+)/);
  if(/for time|cap/i.test(raw) && schemeMatch){ scheme = schemeMatch[1].replace(/\s/g,''); }

  var main = raw
    .replace(/^[^:]*:\s*/,'')
    .split('.')[0]
    .replace(/\bAMRAP\s*\d+\b/ig,'')
    .replace(/\bEMOM\s*\d+\b/ig,'')
    .replace(/\bFor time\b/ig,'')
    .replace(/\bCap\s*\d+\s*min\b/ig,'')
    .trim();

  if(scheme){
    main = main.replace(/^(\d+\s*[-–]\s*\d+\s*[-–]\s*\d+)\s*:?\s*/,'');
    main.split('+').forEach(function(part){
      part = cleanMoveName(part);
      if(part) addMove(scheme, part);
    });
    if(moves.length) return moves;
  }

  main.split('+').forEach(function(part){
    part = part.trim();
    var m = part.match(/^(\d+)\s*(?:cal\s+)?(.+)$/i);
    if(!m) return;
    var reps = Number(m[1]);
    var name = cleanMoveName(m[2]);
    if(reps<1||reps>80||name.length<2) return;
    addMove(reps, name);
  });

  return moves.length>=1 ? moves : null;
}
// Estime les rounds attendus selon durée et type
function estimateWodRounds(text, durationMin){
  if(/emom/i.test(text)) return {min:durationMin,max:durationMin,def:durationMin};
  if(/for time|cap/i.test(text)) return {min:1,max:1,def:1};
  if(durationMin<=6)  return {min:2,max:4,def:3};
  if(durationMin<=10) return {min:3,max:6,def:4};
  if(durationMin<=15) return {min:4,max:8,def:5};
  return {min:3,max:6,def:4};
}

// Collecte tous les exercices du WOD courant avec leur cible de reps
function collectSessionExercises(){
  var w=buildWorkout(state.day,state.week);
  var items=[];
  w.blocks.forEach(function(b){
    if(b.kind==="warmup"||b.kind==="mobility"||b.kind==="bonus")return;
    if(b.exercises&&b.exercises.length){
      b.exercises.forEach(function(e){
        var parsed = parseTargetReps(e.format, 10);
        items.push({key:e.name.replace(/^[A-Z][0-9]?\.\s*/,"").trim(),name:e.name,
          suggested:athleteSuggestedLoad(e.name,e.load,parsed.min||parsed.max),format:e.format,targetMin:parsed.min,targetMax:parsed.max,kind:b.kind,isWod:false});
      });
    } else if(b.progress&&b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind),fmt=setScheme(b.kind,j),parsed=parseTargetReps(fmt,reps);
        items.push({key:mvKey,name:movements[mvKey].name,
          suggested:lb(suggestLoad(mvKey,progressionPct(j),reps)),
          format:fmt,targetMin:parsed.min,targetMax:parsed.max,kind:b.kind,isWod:false});
      });
    } else if(b.kind==="wod"){
      var wodText=b.text||"";
      var durMin=parseTimeToSeconds(b.time)/60;
      var moves=parseWodStructure(wodText);
      var rounds=estimateWodRounds(wodText,durMin);
      items.push({
        key:"wod_"+b.title, name:"WOD — "+b.title, suggested:"",
        kind:"wod", isWod:true,
        wodText:wodText, wodMoves:moves, wodRounds:rounds,
        isAmrap:/amrap/i.test(wodText), isEmom:/emom/i.test(wodText),
        isForTime:/for time|cap/i.test(wodText), durationMin:durMin
      });
    }
  });
  return items;
}

function renderSessionEntry(){
  var items=collectSessionExercises();
  var container=$("sessionFields");if(!container)return;
  container.innerHTML="";

  items.forEach(function(item){
    var card=document.createElement("div");
    card.className="sf-card";

    if(item.isWod){
      // ── Carte WOD intelligente V46.4 ──
      card.innerHTML = '<div class="sf-name">'+item.name+'</div>';
      container.appendChild(card);

      var wodInner = '';

      if(item.isEmom){
        wodInner += '<div class="wod-expected">EMOM — <strong>RPE seulement</strong></div>';
      } else if(item.isAmrap){
        var r = item.wodRounds;
        wodInner += '<div class="wod-expected">Résultat attendu : <strong>'+r.min+'–'+r.max+' rounds</strong></div>';
      } else if(item.isForTime){
        var expectedSec = parseCapSeconds(item.wodText,item.durationMin);
        wodInner += '<div class="wod-expected">For time — temps attendu : <strong>'+formatClock(expectedSec)+'</strong></div>';
        wodInner += '<span class="sf-label">TEMPS FINAL</span>';
        wodInner += '<select class="sf-input" id="wod_time_'+item.key+'" data-key="'+item.key+'" data-field="result">';
        buildTimeOptions(expectedSec).forEach(function(sec){
          wodInner += '<option value="'+formatClock(sec)+'"'+(sec===expectedSec?' selected':'')+'>'+formatClock(sec)+'</option>';
        });
        wodInner += '</select>';
        wodInner += '<input class="sf-input" data-key="'+item.key+'" data-field="note" type="text" inputmode="text" placeholder="si cap : reps complétées ou note"/>';
      }

      if(item.isAmrap && item.wodRounds.max > 1){
        var r2 = item.wodRounds;
        wodInner += '<span class="sf-label">ROUNDS COMPLÉTÉS</span>';
        wodInner += '<div class="sf-chips" id="wod_rounds_'+item.key+'">';
        for(var ri=0; ri<=r2.max+2; ri++){
          var inRange = ri>=r2.min && ri<=r2.max;
          wodInner += '<button type="button" class="sf-chip'+(inRange?' target':'')+'" data-round="'+ri+'">'+ri+'</button>';
        }
        wodInner += '</div>';
      }

      if(item.isAmrap && item.wodMoves && item.wodMoves.length){
        wodInner += '<span class="sf-label">REPS DU DERNIER ROUND — 0 inclus pour corriger</span>';
        item.wodMoves.forEach(function(mv, mi){
          var maxReps = mv.reps - (mi === item.wodMoves.length-1 ? 1 : 0);
          var hint = mi < item.wodMoves.length-1
            ? 'si tu complètes les '+mv.reps+' → '+item.wodMoves[mi+1].name+' commence'
            : mv.reps+' = round complet → clique +1 round à la place';
          wodInner += '<div class="wod-mv-label '+mv.color+'">'+mv.name+' <span class="wod-mv-max">(0–'+maxReps+')</span></div>';
          wodInner += '<div class="sf-chips" id="wod_mv_'+item.key+'_'+mi+'">';
          for(var ri2=0; ri2<=maxReps; ri2++){
            wodInner += '<button type="button" class="sf-chip '+mv.color+(ri2===0?' zero':'')+'" data-mv="'+mi+'" data-rep="'+ri2+'">'+ri2+'</button>';
          }
          wodInner += '</div>';
          wodInner += '<div class="wod-mv-hint">'+hint+'</div>';
        });
      }

      if(item.isAmrap){
        wodInner += '<div class="sf-divider">— ou saisie libre —</div>';
        wodInner += '<input class="sf-input" id="wod_free_'+item.key
          +'" data-key="'+item.key+'" data-field="result" type="text" inputmode="text" placeholder="ex: 4 rounds + 1 burpees + 0 row + 0 sit-ups"/>';
      } else if(item.isEmom){
        wodInner += '<input class="sf-input" id="wod_free_'+item.key+'" data-key="'+item.key+'" data-field="result" type="hidden" value="EMOM complété"/>';
      }

      wodInner += '<input class="sf-input" id="wod_rpe_value_'+item.key+'" data-key="'+item.key+'" data-field="rpe" type="hidden" value="8"/>';
      wodInner += '<span class="sf-label" style="margin-top:12px">RPE</span>';
      wodInner += '<div class="sf-chips" id="wod_rpe_'+item.key+'">';
      [6,7,8,9,10].forEach(function(n){
        wodInner += '<button type="button" class="sf-chip'+(n===8?' active':'')+'" data-rpe="'+n+'">'+n+'</button>';
      });
      wodInner += '</div>';

      if(!item.isForTime){
        wodInner += '<span class="sf-label">NOTE (optionnel)</span>';
        wodInner += '<input class="sf-input" data-key="'+item.key+'" data-field="note" type="text" inputmode="text" placeholder="ex: burpees lents, bon rythme row"/>';
      }

      wodInner += '<div class="wod-result-preview" id="wod_preview_'+item.key+'">Résultat prêt</div>';
      card.innerHTML += wodInner;

      (function(it){
        var selectedRounds = it.isAmrap && it.wodRounds ? it.wodRounds.def : 0;
        var selectedMvReps = {};
        if(it.wodMoves) it.wodMoves.forEach(function(_,i){ selectedMvReps[i]=0; });
        var selectedRpe = 8;

        function updatePreview(){
          var freeInp = document.getElementById('wod_free_'+it.key);
          var preview = document.getElementById('wod_preview_'+it.key);
          var rpeInp = document.getElementById('wod_rpe_value_'+it.key);
          if(rpeInp) rpeInp.value = selectedRpe;
          if(!preview) return;

          if(it.isEmom){
            preview.innerHTML = '<strong style="color:var(--cyan)">EMOM</strong> · RPE '+selectedRpe;
            return;
          }

          if(it.isForTime){
            var sel = document.getElementById('wod_time_'+it.key);
            var val = sel ? sel.value : '';
            preview.innerHTML = '<strong style="color:var(--cyan)">'+(val||'—')+'</strong> · RPE '+selectedRpe;
            return;
          }

          var parts = [];
          if(selectedRounds>0) parts.push(selectedRounds+' round'+(selectedRounds>1?'s':''));

          var repParts = [];
          if(it.wodMoves){
            it.wodMoves.forEach(function(mv,i){
              if(selectedMvReps[i]>0) repParts.push(selectedMvReps[i]+' '+mv.name);
            });
          }
          if(repParts.length) parts.push(repParts.join(' + '));

          var resultStr = parts.join(' + ');
          if(freeInp) freeInp.value = resultStr;

          var partialTotal = 0;
          if(it.wodMoves){
            it.wodMoves.forEach(function(mv,i){
              if(selectedMvReps[i]>0){
                for(var pi=0; pi<i; pi++) partialTotal += it.wodMoves[pi].reps;
                partialTotal += selectedMvReps[i];
              }
            });
          }

          var totalStr = '<strong style="color:var(--cyan)">'+(resultStr||'—')+'</strong>';
          if(partialTotal>0) totalStr += ' <span style="color:var(--muted);font-size:11px">(+'+partialTotal+' reps partielles)</span>';
          totalStr += ' · RPE '+selectedRpe;
          preview.innerHTML = totalStr;
        }

        var roundsEl = document.getElementById('wod_rounds_'+it.key);
        if(roundsEl){
          var defBtn = roundsEl.querySelector('[data-round="'+selectedRounds+'"]');
          if(defBtn) defBtn.classList.add('active');
          roundsEl.querySelectorAll('[data-round]').forEach(function(btn){
            btn.addEventListener('click',function(){
              selectedRounds = Number(btn.getAttribute('data-round'));
              roundsEl.querySelectorAll('[data-round]').forEach(function(b){b.classList.remove('active');});
              btn.classList.add('active');
              updatePreview();
            });
          });
        }

        if(it.wodMoves){
          it.wodMoves.forEach(function(mv,mi){
            var mvEl = document.getElementById('wod_mv_'+it.key+'_'+mi);
            if(!mvEl) return;
            var zeroBtn = mvEl.querySelector('[data-rep="0"]');
            if(zeroBtn) zeroBtn.classList.add('active');
            mvEl.querySelectorAll('[data-mv]').forEach(function(btn){
              btn.addEventListener('click',function(){
                var rep = Number(btn.getAttribute('data-rep'));
                selectedMvReps[mi]=rep;
                mvEl.querySelectorAll('[data-mv]').forEach(function(b){b.classList.remove('active');});
                btn.classList.add('active');
                for(var ni=mi+1; ni<it.wodMoves.length; ni++){
                  selectedMvReps[ni]=0;
                  var nextEl=document.getElementById('wod_mv_'+it.key+'_'+ni);
                  if(nextEl){
                    nextEl.querySelectorAll('[data-mv]').forEach(function(b){b.classList.remove('active');});
                    var z=nextEl.querySelector('[data-rep="0"]'); if(z) z.classList.add('active');
                  }
                }
                updatePreview();
              });
            });
          });
        }

        var timeSel = document.getElementById('wod_time_'+it.key);
        if(timeSel) timeSel.addEventListener('change',updatePreview);

        var rpeEl = document.getElementById('wod_rpe_'+it.key);
        if(rpeEl){
          rpeEl.querySelectorAll('[data-rpe]').forEach(function(btn){
            btn.addEventListener('click',function(){
              selectedRpe = Number(btn.getAttribute('data-rpe'));
              rpeEl.querySelectorAll('[data-rpe]').forEach(function(b){b.classList.remove('active');});
              btn.classList.add('active');
              updatePreview();
            });
          });
        }

        updatePreview();
      })(item);

    } else {
      var suggestedNum = parseLoad(item.suggested)||0;
      var suggestedDisplay = suggestedNum?suggestedNum:"";

      // Label cible reps pour affichage
      var repLabel = item.targetMin===item.targetMax
        ? item.targetMin+" reps"
        : item.targetMin+"–"+item.targetMax+" reps";

      card.innerHTML=
        '<div class="sf-header">'+
          '<div class="sf-name">'+item.name+'</div>'+
          (suggestedNum?'<div class="sf-badge">'+suggestedNum+' lb · '+repLabel+'</div>':'')+
        '</div>'+
        '<div class="sf-weight-row">'+
          '<button type="button" class="sf-adj sf-adj-minus" data-key="'+item.key+'">−5</button>'+
          '<div class="sf-weight-wrap">'+
            '<span class="sf-weight-unit">lb</span>'+
            '<input class="sf-input sf-weight-input" '+
              'data-key="'+item.key+'" data-field="load" '+
              'type="number" inputmode="decimal" '+
              'value="'+suggestedDisplay+'" '+
              'placeholder="'+(suggestedNum||0)+'"/>'+
          '</div>'+
          '<button type="button" class="sf-adj sf-adj-plus" data-key="'+item.key+'">+5</button>'+
        '</div>'+
        '<div class="sf-row-2col">'+
          '<div class="sf-group">'+
            '<span class="sf-label">REPS — cible '+repLabel+'</span>'+
            '<div class="sf-chips" id="reps_'+item.key+'"></div>'+
            '<input class="sf-input sf-reps-input" data-key="'+item.key+'" data-field="reps" type="number" inputmode="numeric" placeholder="reps" style="margin-top:6px"/>'+
          '</div>'+
          '<div class="sf-group">'+
            '<span class="sf-label">RPE</span>'+
            '<div class="sf-chips" id="rpe_'+item.key+'"></div>'+
            '<input class="sf-input sf-rpe-input" data-key="'+item.key+'" data-field="rpe" type="number" inputmode="numeric" min="1" max="10" placeholder="RPE" style="margin-top:6px"/>'+
          '</div>'+
        '</div>';
    }

    container.appendChild(card);

    if(!item.isWod){
      // ── Boutons -5 / +5 poids ──
      var minus = card.querySelector('.sf-adj-minus');
      var plus  = card.querySelector('.sf-adj-plus');
      var loadInp = card.querySelector('.sf-weight-input');
      if(minus&&plus&&loadInp){
        minus.addEventListener('click',function(){
          var v=parseLoad(loadInp.value)||parseLoad(item.suggested)||0;
          loadInp.value=Math.max(0,round5(v-5));
        });
        plus.addEventListener('click',function(){
          var v=parseLoad(loadInp.value)||parseLoad(item.suggested)||0;
          loadInp.value=round5(v+5);
        });
      }

      // ── Chips reps DYNAMIQUES selon la cible ──
      var repsChips = buildRepsChips(item.targetMin, item.targetMax);
      // Valeur par défaut = milieu de la plage cible
      var defaultReps = Math.round((item.targetMin + item.targetMax) / 2);
      var repsContainer = $('reps_'+item.key);
      var repsInp = card.querySelector('.sf-reps-input');
      if(repsContainer&&repsInp){
        // Pré-remplir avec le milieu de la plage
        repsInp.value = defaultReps;
        repsChips.forEach(function(n){
          var btn = document.createElement('button');
          btn.type = 'button';
          // Mettre en surbrillance toute la plage cible
          var inTarget = n >= item.targetMin && n <= item.targetMax;
          // Sélectionner par défaut le milieu
          var isDefault = n === defaultReps;
          btn.className = 'sf-chip' + (isDefault?' active':'') + (inTarget&&!isDefault?' target':'');
          btn.textContent = n;
          btn.addEventListener('click',function(){
            repsInp.value = n;
            repsContainer.querySelectorAll('.sf-chip').forEach(function(b){b.classList.remove('active');});
            btn.classList.add('active');
          });
          repsContainer.appendChild(btn);
        });
      }

      // ── Chips RPE (6 à 10, défaut 8) ──
      var rpeChips = [6,7,8,9,10];
      var rpeContainer = $('rpe_'+item.key);
      var rpeInp = card.querySelector('.sf-rpe-input');
      if(rpeContainer&&rpeInp){
        rpeInp.value = 8;
        rpeChips.forEach(function(n){
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sf-chip' + (n===8?' active':'');
          btn.textContent = n;
          btn.addEventListener('click',function(){
            rpeInp.value = n;
            rpeContainer.querySelectorAll('.sf-chip').forEach(function(b){b.classList.remove('active');});
            btn.classList.add('active');
          });
          rpeContainer.appendChild(btn);
        });
      }
    }
  });
}

function collectSessionResults(){
  var results={};
  var scope=$("sessionFields")||document;
  scope.querySelectorAll(".sf-input").forEach(function(inp){
    var key=inp.getAttribute("data-key"),field=inp.getAttribute("data-field");
    if(!key||!field)return;
    var val=String(inp.value||"").trim();
    if(!val)return;
    if(!results[key])results[key]={};
    results[key][field]=val;
  });
  return results;
}

function resolveMovementKey(key){
  var mvKey=null;
  var cleanKey=chargeKeyFromName(key);
  Object.keys(movements).forEach(function(k){
    if(k===key || k===cleanKey || movements[k].name===key || movements[k].name===cleanKey){mvKey=k;}
  });
  return mvKey;
}

function updateRefsFromResults(results,dateStr){
  dateStr = dateStr || new Date().toLocaleDateString("fr-CA");
  Object.keys(results||{}).forEach(function(key){
    var r=results[key];
    var load=parseLoad(r.load),reps=Number(r.reps)||0;
    if(!load||!reps)return;
    var mvKey=resolveMovementKey(key);
    if(!mvKey)return;
    var refK=refKey(mvKey,reps);
    var existing=state.movementRefs[refK];
    if(!existing||load>=existing.load){
      state.movementRefs[refK]={
        movement:mvKey,range:repRange(reps),load:load,reps:reps,
        date:dateStr,lastActual:load,
        status:Number(r.rpe)>=9?"hard":"success",quality:"clean",
        rpe:Number(r.rpe)||8,note:"Saisi V49.5"
      };
    }
    // Enregistrer RPE dans l'historique pour progression automatique
    var rpeKey=refK;
    if(!state.rpeHistory[rpeKey])state.rpeHistory[rpeKey]=[];
    state.rpeHistory[rpeKey].push(Number(r.rpe)||8);
    // Garder seulement les 3 dernières
    if(state.rpeHistory[rpeKey].length>3)state.rpeHistory[rpeKey].shift();
  });
}

function sessionUid(s){
  if(!s)return "";
  return [s.date||"",s.time||"",s.semaine||s.week||"",s.jour||s.day||"",s.focus||""].join("|");
}
function normalizeRemoteSession(s){
  var r=s&&s.resultats?s.resultats:(s&&s.results?s.results:{});
  return {
    date:s.date||"",
    time:s.time||"",
    week:s.semaine||s.week||state.week,
    day:s.jour||s.day||state.day,
    focus:s.focus||"",
    results:r||{},
    version:s.version||"remote"
  };
}
function mergeHistory(localHistory,remoteData){
  var map={},merged=[];
  (localHistory||[]).forEach(function(s){var n=normalizeRemoteSession(s),id=sessionUid(n);if(id&&!map[id]){map[id]=true;merged.push(n);}});
  (remoteData||[]).forEach(function(s){var n=normalizeRemoteSession(s),id=sessionUid(n);if(id&&!map[id]){map[id]=true;merged.push(n);}});
  merged.sort(function(a,b){return String((a.date||"")+" "+(a.time||"")).localeCompare(String((b.date||"")+" "+(b.time||"")));});
  return merged;
}
function rebuildRefsFromHistory(){
  state.movementRefs=copy(PRELOADED_REFS);
  state.rpeHistory={};
  state.athleteState={movements:{},updatedAt:null,version:APP_VERSION};
  (state.history||[]).forEach(function(s){
    var res=s.results||s.resultats||{};
    updateRefsFromResults(res,s.date||new Date().toLocaleDateString("fr-CA"));
    updateAthleteStateFromResults(res,s.date||new Date().toLocaleDateString("fr-CA"));
  });
  checkDeloadAlert();
}

// ─── Progression automatique basée sur RPE ────────────────────────────────────
// RPE ≤ 7 sur 2 séances → +5 lb suggéré
// RPE 8    → progression normale selon cycle
// RPE ≥ 9  sur 2 séances → maintien
// RPE 10   deux fois → alerte deload

function getRpeAdjustment(mvKey, reps){
  var rpeKey = refKey(mvKey, reps);
  var hist = state.rpeHistory[rpeKey];
  if(!hist||hist.length<2) return { adj:0, signal:"normal", arrow:"" };
  var last2 = hist.slice(-2);
  var avg = (last2[0]+last2[1])/2;
  if(avg<=7)  return { adj:+5,  signal:"easy",    arrow:"↑", color:"var(--green)",  msg:"+5 lb suggéré (RPE facile)" };
  if(avg>=9.5)return { adj:0,   signal:"deload",  arrow:"⚠", color:"var(--red)",   msg:"Attention : RPE très élevé — consider deload" };
  if(avg>=9)  return { adj:0,   signal:"hard",    arrow:"→", color:"var(--yellow)", msg:"Maintien (RPE élevé)" };
  return              { adj:0,   signal:"normal",  arrow:"",  color:"",              msg:"" };
}

function checkDeloadAlert(){
  // Si 3+ mouvements principaux ont RPE ≥ 9 sur 2 séances consécutives → alerte globale
  var mainMvKeys = Object.keys(movements).filter(function(k){ return movements[k].profile; });
  var highRpeCount = 0;
  mainMvKeys.forEach(function(k){
    var rng = repRange(focus().targetReps[weekIdx()]||8);
    var rpeKey = k+"__"+rng;
    var hist = state.rpeHistory[rpeKey];
    if(hist&&hist.length>=2&&hist.slice(-2).every(function(r){return r>=9;})) highRpeCount++;
  });
  state.deloadAlert = highRpeCount >= 2;
  save();
}

// ─── Résumé post-séance ───────────────────────────────────────────────────────

function buildSessionSummary(results){
  var lines=[], prLines=[], totalExercises=0, rpeSum=0, rpeCount=0;
  Object.keys(results).forEach(function(key){
    var r=results[key];
    if(r.isWod||!r.load)return;
    totalExercises++;
    var rpe=Number(r.rpe)||8; rpeSum+=rpe; rpeCount++;
    var load=parseLoad(r.load);
    // Comparer avec la dernière séance
    var mvKey=key;
    var reps=Number(r.reps)||8;
    var refK=refKey(mvKey,reps);
    var prev=state.movementRefs[refK];
    var prevLoad=prev?prev.lastActual:0;
    var arrow="";
    if(prevLoad&&load>prevLoad) arrow=" ↑ +"+round5(load-prevLoad)+" lb 🟢";
    else if(prevLoad&&load<prevLoad) arrow=" ↓ "+round5(load-prevLoad)+" lb 🔴";
    var name=movements[key]?movements[key].name:key;
    lines.push(name+" : "+load+" lb × "+reps+(arrow?"  "+arrow:"")+(rpe?" | RPE "+rpe:""));
    if(arrow.indexOf("↑")>=0) prLines.push(name);
  });
  var avgRpe = rpeCount>0 ? Math.round(rpeSum/rpeCount*10)/10 : 8;
  var rpeSignal = avgRpe<=7?"💚 Léger":avgRpe<=8?"✅ Bon":avgRpe<=8.5?"🟡 Solide":avgRpe<=9?"🟠 Intense":"🔴 Très dur";
  return {
    lines: lines,
    prLines: prLines,
    avgRpe: avgRpe,
    rpeSignal: rpeSignal,
    totalExercises: totalExercises
  };
}

function showSessionSummaryModal(summary){
  // Supprimer modal existant
  var existing=document.getElementById("summaryModal");
  if(existing)existing.remove();

  var prSection = summary.prLines.length>0
    ? '<div class="modal-pr">🏆 Progression : '+summary.prLines.join(", ")+'</div>'
    : '';

  // Vérifier si on peut avancer de semaine
  var weekAdvanceHtml = "";
  if(canAdvanceWeek()){
    weekAdvanceHtml = '<div class="modal-advance">'+
      '<p>✅ Tu as complété les 4 jours de la semaine '+state.week+' !</p>'+
      '<button id="advanceWeekBtn" class="btn-accent" style="width:100%;margin-top:8px">Passer à S'+(state.week+1)+' →</button>'+
    '</div>';
  }

  var deloadHtml = state.deloadAlert
    ? '<div class="modal-deload">⚠️ Ton RPE moyen est élevé sur plusieurs séances. Considère un deload cette semaine ou la prochaine.</div>'
    : '';

  var modal = document.createElement("div");
  modal.id = "summaryModal";
  modal.className = "summary-modal";
  modal.innerHTML =
    '<div class="summary-modal-inner">'+
      '<div class="summary-modal-title">📊 Résumé de la séance</div>'+
      '<div class="summary-modal-sub">'+currentDayLabel()+' S'+state.week+' · RPE moyen '+summary.avgRpe+' '+summary.rpeSignal+'</div>'+
      prSection+
      deloadHtml+
      '<div class="summary-lines">'+
        summary.lines.map(function(l){return'<div class="summary-line">'+l+'</div>';}).join("")+
      '</div>'+
      weekAdvanceHtml+
      '<button id="closeSummaryBtn" class="btn-ghost" style="width:100%;margin-top:12px">Fermer</button>'+
    '</div>';
  document.body.appendChild(modal);
  setTimeout(function(){modal.classList.add("visible");},30);

  document.getElementById("closeSummaryBtn").onclick = function(){
    modal.classList.remove("visible");
    setTimeout(function(){modal.remove();},300);
  };
  var adv = document.getElementById("advanceWeekBtn");
  if(adv) adv.onclick = function(){
    advanceWeek();
    modal.classList.remove("visible");
    setTimeout(function(){modal.remove();},300);
  };
}

// ─── Avancement automatique de semaine ───────────────────────────────────────

function markDayCompleted(day){
  if(state.completedDays.indexOf(day)<0){
    state.completedDays.push(day);
    state.cycleState=buildCycleStatePayload();
    save();
  }
}

function canAdvanceWeek(){
  var tw = totalWeeks();
  if(state.week >= tw) return false; // déjà au deload ou dernière semaine
  // On peut avancer si les 4 jours de la semaine sont complétés
  var allDays = DAYS_ORDER.every(function(d){ return state.completedDays.indexOf(d)>=0; });
  return allDays;
}

function advanceWeek(){
  var tw = totalWeeks();
  if(state.week < tw){
    state.week++;
    state.completedDays = []; // reset pour la nouvelle semaine
    state.cycleState=buildCycleStatePayload();
    save();
    if(getToken())savePersistentStateToGitHub(getToken());
    render();
    renderWeekProgress();
  }
}

// ─── Wake Lock — empêcher l'écran de se mettre en veille ─────────────────────

var wakeLock = null;
async function requestWakeLock(){
  try{
    if("wakeLock" in navigator){
      wakeLock = await navigator.wakeLock.request("screen");
      var btn=$("wakeLockBtn");
      if(btn){btn.textContent="🔆 Écran actif";btn.classList.add("active");}
    }
  }catch(e){}
}
function releaseWakeLock(){
  if(wakeLock){try{wakeLock.release();}catch(e){}wakeLock=null;}
  var btn=$("wakeLockBtn");
  if(btn){btn.textContent="💤 Garder écran";btn.classList.remove("active");}
}
// Re-acquérir si l'app revient au premier plan
document.addEventListener("visibilitychange",function(){
  if(document.visibilityState==="visible"&&wakeLock===null){
    var btn=$("wakeLockBtn");
    if(btn&&btn.classList.contains("active"))requestWakeLock();
  }
});

// V49.3 — volontairement neutralisé.
// Les résultats ne doivent plus réécrire les charges locales ou data/charges.js.
// - data/charges.js = configuration stable / équipement / charges de départ
// - data/resultats.json = journal brut
// - data/athlete_state.json = capacité réelle et recalibrage
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
    cycle:state.cycle&&state.cycle.goal?state.cycle.goal:null,
    focus:focus().label,
    cycleState:buildCycleStatePayload(),
    resultats:results
  };
}

// Génère le contenu du fichier charges.js mis à jour avec les nouveaux poids
// V49.3 — supprimé/neutralisé : l'app ne doit jamais écrire data/charges.js automatiquement.
// data/charges.js est une configuration stable; le niveau réel est dans data/athlete_state.json.
function buildChargesJsContent(){ return ""; }
async function saveChargesToGitHub(token){
  return {ok:false,msg:"Désactivé : les charges stables ne sont pas modifiées automatiquement."};
}


// ─── GitHub API helpers ─────────────────────────────────────────────────────
// V49.4 : ces fonctions doivent être globales. Sans elles, le test token/PR plante.
function githubHeaders(token){
  return {
    "Authorization":"Bearer "+token,
    "Accept":"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28"
  };
}
async function githubErrorMessage(resp){
  var msg=resp.status+" "+(resp.statusText||"");
  try{
    var j=await resp.json();
    if(j&&j.message)msg += " — "+j.message;
  }catch(e){}
  return msg;
}
function githubEncodeContent(text){
  return btoa(unescape(encodeURIComponent(String(text||""))));
}
function githubDecodeContent(content){
  return decodeURIComponent(escape(atob(String(content||"").replace(/\n/g,""))));
}
async function readGithubJsonFile(token,path){
  var url="https://api.github.com/repos/"+GITHUB_OWNER+"/"+GITHUB_REPO+"/contents/"+path;
  try{
    var resp=await fetch(url,{headers:githubHeaders(token)});
    if(resp.status===404)return{ok:false,missing:true,msg:path+" introuvable"};
    if(!resp.ok)return{ok:false,missing:false,msg:await githubErrorMessage(resp)};
    var j=await resp.json();
    var txt=githubDecodeContent(j.content||"");
    var data;
    try{data=JSON.parse(txt||"null");}
    catch(e){return{ok:false,missing:false,msg:path+" contient du JSON invalide : "+e.message};}
    return{ok:true,missing:false,sha:j.sha,data:data,text:txt};
  }catch(e){return{ok:false,missing:false,msg:"Erreur réseau : "+e.message};}
}
async function writeGithubFile(token,path,text,message,sha){
  var url="https://api.github.com/repos/"+GITHUB_OWNER+"/"+GITHUB_REPO+"/contents/"+path;
  var body={message:message||("Mise à jour "+path),content:githubEncodeContent(text)};
  if(sha)body.sha=sha;
  try{
    var resp=await fetch(url,{method:"PUT",headers:Object.assign(githubHeaders(token),{"Content-Type":"application/json"}),body:JSON.stringify(body)});
    if(resp.ok){var j=await resp.json();return{ok:true,sha:j.content&&j.content.sha?j.content.sha:null,msg:"OK"};}
    return{ok:false,msg:await githubErrorMessage(resp)};
  }catch(e){return{ok:false,msg:"Erreur réseau : "+e.message};}
}

async function ensureResultatsFile(token){
  var r=await readGithubJsonFile(token,GITHUB_FILE);
  if(r.ok)return{ok:true,msg:"resultats.json OK",sha:r.sha,data:Array.isArray(r.data)?r.data:[]};
  if(!r.missing)return{ok:false,msg:r.msg};
  var init=await writeGithubFile(token,GITHUB_FILE,"[]","Création initiale de resultats.json",null);
  if(!init.ok)return{ok:false,msg:"Création resultats.json impossible : "+init.msg};
  var r2=await readGithubJsonFile(token,GITHUB_FILE);
  return{ok:true,msg:"resultats.json créé",sha:r2.sha,data:[]};
}


async function ensureJsonFile(token,path,initialValue,message){
  var r=await readGithubJsonFile(token,path);
  if(r.ok)return{ok:true,msg:path+" OK",sha:r.sha,data:r.data};
  if(!r.missing)return{ok:false,msg:r.msg};
  var initText=JSON.stringify(initialValue,null,2);
  var init=await writeGithubFile(token,path,initText,message||("Création "+path),null);
  if(!init.ok)return{ok:false,msg:"Création "+path+" impossible : "+init.msg};
  var r2=await readGithubJsonFile(token,path);
  return{ok:true,msg:path+" créé",sha:r2.sha,data:initialValue};
}
async function saveJsonDataFile(token,path,data,message){
  var r=await readGithubJsonFile(token,path);
  var sha=r.ok?r.sha:null;
  if(!r.ok&&!r.missing)return{ok:false,msg:r.msg};
  return await writeGithubFile(token,path,JSON.stringify(data,null,2),message,sha);
}
async function savePersistentStateToGitHub(token){
  if(!token)return{ok:false,msg:"Token manquant"};
  var ast=ensureAthleteState();
  ast.updatedAt=nowIso();ast.version=APP_VERSION;
  var cycle=buildCycleStatePayload();
  state.cycleState=cycle;
  var a=await saveJsonDataFile(token,ATHLETE_STATE_FILE,ast,"Mise à jour athlete_state — "+new Date().toLocaleDateString("fr-CA"));
  if(!a.ok)return{ok:false,msg:"athlete_state : "+a.msg};
  var c=await saveJsonDataFile(token,CYCLE_STATE_FILE,cycle,"Mise à jour cycle_state — "+new Date().toLocaleDateString("fr-CA"));
  if(!c.ok)return{ok:false,msg:"cycle_state : "+c.msg};
  return{ok:true,msg:"state OK"};
}

async function saveToGitHub(payload){
  var token=getToken();
  if(!token){return{ok:false,msg:"❌ Token GitHub manquant. Va dans Paramètres ⚙ pour le saisir."};}
  var r=await readGithubJsonFile(token,GITHUB_FILE);
  var sha=null,existingData=[];
  if(r.ok){sha=r.sha;existingData=Array.isArray(r.data)?r.data:[];}
  else if(r.missing){existingData=[];}
  else{return{ok:false,msg:"❌ Lecture resultats.json échouée : "+r.msg};}

  existingData.push(payload);
  var w=await writeGithubFile(token,GITHUB_FILE,JSON.stringify(existingData,null,2),"Séance "+payload.date+" — "+payload.jour+" S"+payload.semaine,sha);
  if(w.ok)return{ok:true,msg:"✅ Séance sauvegardée sur GitHub !"};
  return{ok:false,msg:"❌ Sauvegarde resultats.json échouée : "+w.msg};
}

async function testGithubToken(){
  var inp=$("githubToken");
  var token=(inp&&inp.value.trim())||getToken();
  var s=$("tokenStatus");
  if(!token){if(s){s.textContent="Token vide.";s.className="status-msg err";}return;}
  setToken(token);
  if(s){s.textContent="Test GitHub en cours...";s.className="status-msg";}
  try{
    var repoResp=await fetch("https://api.github.com/repos/"+GITHUB_OWNER+"/"+GITHUB_REPO,{headers:githubHeaders(token)});
    if(!repoResp.ok){if(s){s.textContent="❌ Repo inaccessible : "+await githubErrorMessage(repoResp);s.className="status-msg err";}return;}

    var ensure=await ensureResultatsFile(token);
    if(!ensure.ok){if(s){s.textContent="❌ "+ensure.msg;s.className="status-msg err";}return;}
    var ast=await ensureJsonFile(token,ATHLETE_STATE_FILE,{version:APP_VERSION,updatedAt:nowIso(),movements:{}},"Création athlete_state.json");
    if(!ast.ok){if(s){s.textContent="❌ "+ast.msg;s.className="status-msg err";}return;}
    var cyc=await ensureJsonFile(token,CYCLE_STATE_FILE,buildCycleStatePayload(),"Création cycle_state.json");
    if(!cyc.ok){if(s){s.textContent="❌ "+cyc.msg;s.className="status-msg err";}return;}

    if(s){s.textContent="✅ Token OK · repo accessible · resultats + athlete_state + cycle_state OK";s.className="status-msg ok";}
  }catch(e){
    if(s){s.textContent="❌ Erreur réseau/test : "+e.message;s.className="status-msg err";}
  }
}

async function syncHistoryFromGitHub(silent){
  var token=getToken();
  var status=$("tokenStatus")||$("saveStatus");
  if(!token){if(!silent&&status){status.textContent="Token GitHub manquant.";status.className="status-msg err";}return{ok:false,msg:"Token manquant"};}
  if(!silent&&status){status.textContent="Synchronisation GitHub en cours...";status.className="status-msg";}
  try{
    var ensure=await ensureResultatsFile(token);
    if(!ensure.ok){if(!silent&&status){status.textContent="❌ Sync impossible : "+ensure.msg;status.className="status-msg err";}return{ok:false,msg:ensure.msg};}
    var before=(state.history||[]).length;
    state.history=mergeHistory(state.history||[],Array.isArray(ensure.data)?ensure.data:[]);
    rebuildRefsFromHistory();
    try{
      var ast=await readGithubJsonFile(token,ATHLETE_STATE_FILE);
      if(ast.ok&&ast.data&&ast.data.movements)state.athleteState=ast.data;
      var cyc=await readGithubJsonFile(token,CYCLE_STATE_FILE);
      if(cyc.ok&&cyc.data)applyCycleStatePayload(cyc.data);
    }catch(e){}
    save();
    renderHistory();renderWorkout();renderReferences();renderWeekProgress();
    var added=state.history.length-before;
    var msg="✅ Sync GitHub OK · "+state.history.length+" séance"+(state.history.length>1?"s":"")+" chargée"+(added>0?" · +"+added:"");
    if(!silent&&status){status.textContent=msg;status.className="status-msg ok";}
    return{ok:true,msg:msg,added:added,total:state.history.length};
  }catch(e){
    if(!silent&&status){status.textContent="❌ Sync GitHub : "+e.message;status.className="status-msg err";}
    return{ok:false,msg:e.message};
  }
}

function autoSyncFromGitHub(){
  if(!getToken())return;
  // Petit délai : laisse la page finir son rendu avant de parler à GitHub.
  setTimeout(function(){syncHistoryFromGitHub(true);},800);
}

function setupSessionSave(){
  var btn=$("saveSessionBtn");if(!btn)return;
  btn.onclick=async function(){
    resumeAudio();
    var results=collectSessionResults();
    var hasData=Object.keys(results).length>0;
    if(!hasData){var s=$("saveStatus");if(s){s.textContent="Aucun résultat saisi.";s.className="session-note";}return;}
    btn.disabled=true;btn.textContent="Envoi en cours...";
    results=enrichSessionResults(results);
    var payload=buildSessionPayload(results);
    // 1. Mettre à jour références + historique RPE
    updateRefsFromResults(results);
    updateAthleteStateFromResults(results,payload.date);
    // 2. Ne plus modifier les charges locales depuis les résultats :
    // data/charges.js et les charges locales sont une configuration/équipement, pas une capacité réelle.
    // La capacité réelle est gérée par athlete_state.json.
    // updateCustomChargesFromResults(results);
    // 3. Marquer le jour complété
    markDayCompleted(state.day);
    // 4. Vérifier alerte deload
    checkDeloadAlert();
    // 5. Ajouter à l'historique local
    state.history.push({date:payload.date,time:payload.time,week:state.week,day:state.day,focus:focus().label,results:results,version:APP_VERSION});
    save();
    // 6. Envoyer séance sur GitHub
    var result=await saveToGitHub(payload);
    // 7. Sauvegarder les états persistants durables si la séance est bien écrite
    var stateMsg="";
    if(result.ok&&getToken()){
      var stateSave=await savePersistentStateToGitHub(getToken());
      stateMsg=stateSave.ok?" · niveaux/cycle ✅":" · état durable non sauvegardé ("+stateSave.msg+")";
    }
    // 8. Ne pas modifier data/charges.js automatiquement : les charges stables ne doivent pas être écrasées par une mise à jour ou une séance.
    var s=$("saveStatus");
    if(s){s.textContent=result.msg+stateMsg;s.className="session-note"+(result.ok?" ok":" err");}
    btn.disabled=false;btn.textContent="💾 Sauvegarder & envoyer sur GitHub";
    // 8. Construire et afficher le résumé
    var summary=buildSessionSummary(results);
    showSessionSummaryModal(summary);
    if(result.ok){renderHistory();renderWorkout();renderWeekProgress();}
  };
}

// ─── Swipe ───────────────────────────────────────────────────────────────────

function setupSwipeGesture(el,cb){
  if(!el)return;
  var sx,sy,st;
  el.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();},{passive:true});
  el.addEventListener("touchend",function(e){
    if(!sx||!sy)return;
    var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy,dt=Date.now()-st;
    if(dt>600)return;var adx=Math.abs(dx),ady=Math.abs(dy);
    if(adx<40&&ady<40)return;
    if(adx>ady){cb(dx<0?"left":"right");}else{cb(dy<0?"up":"down");}
    sx=sy=null;
  },{passive:true});
}
function setupSwipeNav(){
  // Flèches semaine
  var wp=$("weekPrev"),wn=$("weekNext");
  if(wp)wp.onclick=function(){if(state.week>1){state.week--;save();render();}};
  if(wn)wn.onclick=function(){if(state.week<totalWeeks()){state.week++;save();render();}};
  // Flèches jour
  var dp=$("dayPrev"),dn=$("dayNext");
  if(dp)dp.onclick=function(){var i=DAYS_ORDER.indexOf(state.day);if(i>0){state.day=DAYS_ORDER[i-1];save();render();}};
  if(dn)dn.onclick=function(){var i=DAYS_ORDER.indexOf(state.day);if(i<DAYS_ORDER.length-1){state.day=DAYS_ORDER[i+1];save();render();}};
  // Flèches jour mode iPhone
  var pdp=$("phoneDayPrev"),pdn=$("phoneDayNext");
  if(pdp)pdp.onclick=function(){var i=DAYS_ORDER.indexOf(state.day);if(i>0){state.day=DAYS_ORDER[i-1];save();renderPhoneWod();}};
  if(pdn)pdn.onclick=function(){var i=DAYS_ORDER.indexOf(state.day);if(i<DAYS_ORDER.length-1){state.day=DAYS_ORDER[i+1];save();renderPhoneWod();}};
  // Swipe vue entraînement : horizontal = semaine, vertical = jour
  setupSwipeGesture($("trainingView"),function(dir){
    if(dir==="left"&&state.week<totalWeeks()){state.week++;save();render();}
    else if(dir==="right"&&state.week>1){state.week--;save();render();}
    else if(dir==="up"){var i=DAYS_ORDER.indexOf(state.day);if(i<DAYS_ORDER.length-1){state.day=DAYS_ORDER[i+1];save();render();}}
    else if(dir==="down"){var i=DAYS_ORDER.indexOf(state.day);if(i>0){state.day=DAYS_ORDER[i-1];save();render();}}
  });
  // Swipe mode iPhone : horizontal = jour
  setupSwipeGesture($("phoneView"),function(dir){
    if(dir==="left"){var i=DAYS_ORDER.indexOf(state.day);if(i<DAYS_ORDER.length-1){state.day=DAYS_ORDER[i+1];save();renderPhoneWod();}}
    else if(dir==="right"){var i=DAYS_ORDER.indexOf(state.day);if(i>0){state.day=DAYS_ORDER[i-1];save();renderPhoneWod();}}
  });
}

// ─── Hamburger ───────────────────────────────────────────────────────────────

function setupHamburger(){
  var btn=$("hamburgerBtn"),menu=$("hamburgerMenu");if(!btn||!menu)return;
  btn.onclick=function(e){e.stopPropagation();menu.classList.toggle("hidden");};
  document.addEventListener("click",function(){menu.classList.add("hidden");});
  [["backupTabM","backup"],["githubTabM","settings"]].forEach(function(pair){
    var b=$(pair[0]);if(b)b.onclick=function(){menu.classList.add("hidden");switchView(pair[1]);};
  });
}

// ─── Rendu vue bureau (WOD) ───────────────────────────────────────────────────

function renderWeekProgress(){
  // Barre de progression semaine dans la vue entraînement
  var el=$("weekProgressBar");if(!el)return;
  var tw=totalWeeks(),w=state.week;
  var pct=Math.round(((w-1)/tw)*100);
  el.style.width=pct+"%";
  var lbl=$("weekProgressLabel");
  if(lbl){
    var daysLeft=DAYS_ORDER.filter(function(d){return state.completedDays.indexOf(d)<0;}).length;
    lbl.textContent="S"+w+"/"+tw+" · "+daysLeft+" jour"+(daysLeft>1?"s":"")+" restant"+(daysLeft>1?"s":"")+" cette semaine";
  }
  // Indicateur jours complétés
  var dc=$("daysCompleted");if(!dc)return;
  dc.innerHTML="";
  DAYS_ORDER.forEach(function(d){
    var done=state.completedDays.indexOf(d)>=0;
    var pip=document.createElement("span");
    pip.className="day-pip"+(done?" done":"")+(d===state.day?" current":"");
    pip.title=baseDays[d].label;
    dc.appendChild(pip);
  });
}

function daysToCompetition(){
  var now=new Date();
  var diff=Math.ceil((COMPETITION_DATE-now)/(1000*60*60*24));
  return Math.max(0,diff);
}

function renderWeeks(){
  var weekInfo=buildWeekInfo();
  var w=$("weekButtons");if(!w)return;w.innerHTML="";
  var tw=totalWeeks();
  for(var k=1;k<=tw;k++){
    (function(wk){
      var info=weekInfo[wk]||{label:"S"+wk,goal:""};
      var b=document.createElement("button");
      b.textContent=info.label;
      b.className="tab"+(wk===state.week?" active":" secondary");
      // Marquer les semaines complétées
      if(wk<state.week)b.style.opacity="0.6";
      b.onclick=function(){state.week=wk;save();render();};
      w.appendChild(b);
    })(k);
  }
  var wi=weekInfo[state.week]||{label:"S"+state.week,goal:""};
  var wg=$("weekGoal");
  var cfg=focus();
  var phaseInfo=cfg.phaseName?"Phase "+cfg.phase+" — "+cfg.phaseName:"";
  var daysLeft=daysToCompetition();
  if(wg)wg.innerHTML=wi.goal+
    (phaseInfo?"<br><small style='color:var(--accent2)'>"+phaseInfo+"</small>":"")+
    "<br><small style='color:var(--muted)'>⏱ "+daysLeft+" jours avant la compétition</small>";
  renderWeekProgress();
}
function renderDays(){
  var w=$("dayButtons");if(!w)return;w.innerHTML="";
  Object.keys(baseDays).forEach(function(k){
    var d=baseDays[k],b=document.createElement("button");
    b.textContent=d.label;b.className="tab"+(k===state.day?" active":" secondary");
    b.onclick=function(){state.day=k;save();render();};w.appendChild(b);
  });
}
function kindRank(kind){
  if(kind==="wod")      return{rank:"WOD", cls:"rank-S",tag:"Conditioning",tagCls:"wod-tag"};
  if(kind==="main")     return{rank:"A",   cls:"rank-A",tag:"Principal",   tagCls:"main-tag"};
  if(kind==="accessory")return{rank:"B",   cls:"rank-B",tag:"Accessoire",  tagCls:"acc-tag"};
  if(kind==="mobility") return{rank:"M",   cls:"rank-C",tag:"Mobilité",    tagCls:"mob-tag"};
  if(kind==="warmup")   return{rank:"W",   cls:"rank-D",tag:"Warm-up",     tagCls:""};
  return{rank:"B",cls:"rank-D",tag:"Bonus",tagCls:""};
}

function rpeArrowHtml(mvKey, reps){
  var adj=getRpeAdjustment(mvKey,reps);
  if(!adj.arrow)return "";
  return ' <span style="font-size:11px;font-weight:900;color:'+adj.color+'">'+adj.arrow+' <span style="font-size:10px">'+adj.msg+'</span></span>';
}


// ─── Tutos mouvements — vue WOD seulement ───────────────────────────────────

function escapeHtml(s){
  return String(s==null?"":s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}
function tutorialButtonHtml(name){
  if(!window.findCoachBertinTutorial) return "";
  var t = window.findCoachBertinTutorial(name);
  if(!t) return "";
  return '<button type="button" class="tuto-btn" data-tuto-name="'+escapeHtml(t.key)+'">?</button>';
}
function showTutorialModal(name){
  if(!window.findCoachBertinTutorial) return;
  var found = window.findCoachBertinTutorial(name);
  if(!found) return;
  var t = found.item;
  var existing=document.getElementById("tutoModal");
  if(existing) existing.remove();
  function list(title, arr){
    if(!arr || !arr.length) return "";
    return '<div class="tuto-section"><div class="tuto-section-title">'+escapeHtml(title)+'</div><ul>'+arr.map(function(x){return '<li>'+escapeHtml(x)+'</li>';}).join("")+'</ul></div>';
  }
  var modal=document.createElement("div");
  modal.id="tutoModal";
  modal.className="tuto-modal";
  modal.innerHTML =
    '<div class="tuto-modal-inner">'+
      '<div class="tuto-topline">TUTO MOUVEMENT</div>'+
      '<div class="tuto-title">'+escapeHtml(found.key)+'</div>'+
      '<div class="tuto-goal">'+escapeHtml(t.goal||"")+'</div>'+
      list("Setup", t.setup)+
      list("Exécution", t.execution)+
      list("Erreurs fréquentes", t.mistakes)+
      (t.cue?'<div class="tuto-cue">Repère : '+escapeHtml(t.cue)+'</div>':"")+
      '<button id="closeTutoBtn" class="btn-accent" style="width:100%;margin-top:14px">Fermer</button>'+
    '</div>';
  document.body.appendChild(modal);
  setTimeout(function(){modal.classList.add("visible");},20);
  var close=function(){modal.classList.remove("visible");setTimeout(function(){modal.remove();},220);};
  var btn=document.getElementById("closeTutoBtn"); if(btn) btn.onclick=close;
  modal.addEventListener("click",function(e){ if(e.target===modal) close(); });
}
function setupTutorialButtons(scope){
  (scope||document).querySelectorAll(".tuto-btn[data-tuto-name]").forEach(function(btn){
    btn.onclick=function(e){
      e.preventDefault(); e.stopPropagation();
      showTutorialModal(btn.getAttribute("data-tuto-name"));
    };
  });
}

function renderWorkout(){
  var w=buildWorkout(state.day,state.week);
  var wt=$("workoutTitle"),wf=$("workoutFocus"),fi=$("focusImpact"),c=$("blocks"),pa=$("progressionAdvice");
  var cfg_rw=focus();
  var weekNote_rw=cfg_rw.getWeekNote?cfg_rw.getWeekNote(state.week):null;
  var wi=buildWeekInfo();
  if(wt)wt.textContent=(wi[state.week]?wi[state.week].label:"S"+state.week)+" — "+w.day.label+" — "+w.day.base;
  if(wf)wf.textContent=w.day.focus;

  var deloadWarning=state.deloadAlert
    ?"<br><strong style='color:var(--red)'>⚠ RPE élevé détecté — considère un deload</strong>":"";
  if(fi)fi.innerHTML=
    "<strong>"+dayIntention(state.day)+"</strong>"+
    (weekNote_rw?"<em>"+(wi[state.week]?wi[state.week].label:"S"+state.week)+" — "+weekNote_rw+"</em>":"")+
    deloadWarning+
    "<small>"+cycleRules().slice(0,3).join(" · ")+"</small>";

  if(!c)return;c.innerHTML="";
  w.blocks.forEach(function(b){
    var rk=kindRank(b.kind);
    var div=document.createElement("div");
    div.className="block kind-"+b.kind;
    var inner=
      '<div class="block-header">'+
        '<div class="block-header-left"><div class="block-title">'+b.title+'</div></div>'+
        '<div style="display:flex;align-items:center;gap:8px">'+
          '<div class="block-tag '+rk.tagCls+'">'+rk.tag+'</div>'+
          '<div class="block-time">'+b.time+'</div>'+
        '</div>'+
      '</div>';
    if(b.text)inner+='<div class="block-text">'+displayChargeText(b.text)+'</div>';
    if(b.exercises&&b.exercises.length){
      b.exercises.forEach(function(e){
        var arrowHtml="";
        inner+=
          '<div class="exercise-box">'+
            '<div class="exercise-name"><span>'+e.name+'</span>'+tutorialButtonHtml(e.name)+'</div>'+
            '<div class="exercise-meta">'+
              '<div class="exercise-format">'+e.format+'</div>'+
              '<div class="exercise-load">'+athleteSuggestedLoad(e.name,e.load,(parseTargetReps(e.format,10).min||parseTargetReps(e.format,10).max))+'</div>'+
            '</div>'+
          '</div>';
        if(e.note)inner+='<div class="exercise-note">'+e.note+'</div>';
      });
    } else if(b.progress&&b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        var baseLoad=suggestLoad(mvKey,progressionPct(j),reps);
        var adj=getRpeAdjustment(mvKey,reps);
        var finalLoad=round5(baseLoad+(adj.adj||0));
        var loadCls=adj.signal==="easy"?"up":adj.signal==="hard"?"down":"";
        inner+=
          '<div class="exercise-box">'+
            '<div class="exercise-name"><span>'+movements[mvKey].name+'</span>'+tutorialButtonHtml(movements[mvKey].name)+'</div>'+
            '<div class="exercise-meta">'+
              '<div class="exercise-format">'+setScheme(b.kind,j)+'</div>'+
              '<div class="exercise-load '+loadCls+'">'+lb(finalLoad)+(adj.arrow?' '+adj.arrow:'')+'</div>'+
            '</div>'+
          '</div>';
      });
    }
    div.innerHTML=inner;c.appendChild(div);setupTutorialButtons(div);
  });
  if(pa)pa.textContent="Poids ajustés selon ton RPE. Saisis tes résultats en fin de séance.";
}

// ─── Rendu Mode iPhone ───────────────────────────────────────────────────────

function phoneWodLoadHints(text){
  var t=(text||"").toLowerCase(),hints=[];
  if(t.indexOf("db push press")>=0)hints.push({label:"Light DB push press",val:charge("Light DB Push Press","35 lb / main")});
  if(t.indexOf("hang power clean")>=0)hints.push({label:"Hang power cleans",val:charge("Hang Power Clean","115-135 lb")});
  if(t.indexOf("wall balls")>=0)hints.push({label:"Wall balls",val:charge("Wall Ball","14 lb")});
  if(t.indexOf("kb swings")>=0)hints.push({label:"KB swings",val:charge("KB Swings","24 kg")});
  if(!hints.length)return"";
  var h='<div class="pc-wod-charges">';
  hints.forEach(function(item){h+='<div class="pc-wod-charge-item">'+item.label+' : <strong>'+item.val+'</strong></div>';});
  return h+'</div>';
}

function renderPhoneWod(){
  var el=$("phoneWod");if(!el)return;
  var w=buildWorkout(state.day,state.week);
  var cfg_pw=focus();
  var weekNote_pw=cfg_pw.getWeekNote?cfg_pw.getWeekNote(state.week):null;
  var weekNoteLabel_pw=(buildWeekInfo()[state.week]||{}).label||("S"+state.week);
  var dayIdx=DAYS_ORDER.indexOf(state.day);
  var html="";
  var dl=$("phoneDayLabel");if(dl)dl.textContent=w.day.label+" · S"+state.week;

  // Carte titre
  html+="<div class='pc'>";
  html+="<div class='system-tag'>"+focus().label.toUpperCase()+" · S"+state.week+"</div>";
  html+="<div class='pc-day-title'>"+w.day.label+"</div>";
  html+="<div class='pc-day-sub'>"+w.day.base+" · Semaine "+state.week+" · "+focus().label+"</div>";
  if(dayIdx>0||dayIdx<DAYS_ORDER.length-1){
    html+="<div class='pc-day-nav-hint'>";
    if(dayIdx>0)html+="← "+baseDays[DAYS_ORDER[dayIdx-1]].label+" ";
    html+="· glisser ·";
    if(dayIdx<DAYS_ORDER.length-1)html+=" "+baseDays[DAYS_ORDER[dayIdx+1]].label+" →";
    html+="</div>";
  }
  html+="</div>";

  // Intention
  html+="<div class='pc intention'>";
  html+="<div class='pc-tag'>Intention du jour</div>";
  html+="<div class='pc-wod-text' style='font-size:16px;font-weight:700;color:var(--text)'>"+dayIntention(state.day)+"</div>";
  if(weekNote_pw)html+="<div style='margin-top:10px;font-size:14px;color:var(--gold)'>"+weekNoteLabel_pw+" — "+weekNote_pw+"</div>";
  html+="</div>";

  // Règles
  html+="<div class='pc rules'><div class='pc-tag'>RÈGLES DU CYCLE</div><ul class='rules-list'>";
  cycleRules().forEach(function(r){html+="<li>"+r+"</li>";});
  html+="</ul></div>";

  // Blocs
  w.blocks.forEach(function(b){
    var rk=kindRank(b.kind);
    var isWod=b.kind==="wod";
    var cardCls="pc"+(isWod?" wod":b.kind==="accessory"?" accessory":b.kind==="main"?" main-card":"");
    html+="<div class='"+cardCls+"'>";
    html+="<div class='pc-block-title'>";
    html+="<div class='block-rank "+rk.cls+" rank-badge'>"+rk.rank+"</div>";
    html+=b.title;
    html+="<span class='pc-block-time'>"+b.time+"</span></div>";

    if(isWod){
      html+="<div class='pc-tag wod'>"+rk.tag+"</div>";
      html+="<div class='pc-wod-text'>"+cleanLine(displayChargeText(b.text||""))+"</div>";
      html+=phoneWodLoadHints(b.text||"");
      var cfg=wodTimerConfig(b);
      var initial=cfg.mode==="up"?0:cfg.seconds;
      html+="<div class='pc-timer' data-duration='"+cfg.seconds+"' data-mode='"+cfg.mode+"' data-label='"+cfg.label+"' data-emom='"+(cfg.isEmom?"1":"0")+"'>";
      html+="<div class='pc-timer-left'>";
      html+="<div class='pc-timer-label'>"+cfg.label+(cfg.isEmom?" · bip/min":"")+"</div>";
      html+="<div class='pc-timer-display' id='pcTimerDisplay'>"+formatClock(initial)+"</div>";
      html+="<div class='pc-timer-hint'>▶ Démarrage dans 10s · bips aux 3 dernières secondes</div>";
      html+="</div><div class='pc-timer-btns'>";
      html+="<button class='pc-tbtn start' id='pcTimerStart'>&#9654;</button>";
      html+="<button class='pc-tbtn' id='pcTimerPause'>&#9208;</button>";
      html+="<button class='pc-tbtn' id='pcTimerReset'>&#8635;</button>";
      html+="</div></div>";

    } else if(b.exercises&&b.exercises.length){
      if(b.text)html+="<div class='pc-plain-text' style='margin-bottom:12px'>"+cleanLine(displayChargeText(b.text))+"</div>";
      b.exercises.forEach(function(e){
        var restSec=parseRestToSeconds(e.rest);
        html+="<div class='pc-exercise'><div class='pc-ex-name'>"+e.name+"</div>";
        html+="<div class='pc-ex-rows'>";
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Format</span><span class='pc-ex-value'>"+e.format+"</span></div>";
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Poids</span><span class='pc-ex-value accent'>"+athleteSuggestedLoad(e.name,e.load,(parseTargetReps(e.format,10).min||parseTargetReps(e.format,10).max))+"</span></div>";
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Repos</span><span class='pc-ex-value'>"+e.rest+"</span></div>";
        html+="</div>";
        if(e.note)html+="<div class='pc-ex-note'>"+e.note+"</div>";
        if(restSec>0)html+="<button class='pc-rest-btn' onclick='startRestTimer("+restSec+")'>// DÉMARRER REPOS "+e.rest+"</button>";
        html+="</div>";
      });
    } else if(b.progress&&b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        var baseLoad=suggestLoad(mvKey,progressionPct(j),reps);
        var adj=getRpeAdjustment(mvKey,reps);
        var finalLoad=round5(baseLoad+(adj.adj||0));
        var loadCls=adj.signal==="easy"?"up":adj.signal==="hard"?"down":"";
        var rest=restFor(b.kind),restSec=parseRestToSeconds(rest);
        html+="<div class='pc-exercise'><div class='pc-ex-name'>"+movements[mvKey].name+"</div>";
        html+="<div class='pc-ex-rows'>";
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Format</span><span class='pc-ex-value'>"+setScheme(b.kind,j)+"</span></div>";
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Poids</span><span class='pc-ex-value accent "+loadCls+"'>"+lb(finalLoad)+(adj.arrow?" "+adj.arrow:"")+"</span></div>";
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Repos</span><span class='pc-ex-value'>"+rest+"</span></div>";
        html+="</div>";
        if(restSec>0)html+="<button class='pc-rest-btn' onclick='startRestTimer("+restSec+")'>// DÉMARRER REPOS "+rest+"</button>";
        html+="</div>";
      });
    } else {
      html+="<div class='pc-plain-text'>"+cleanLine(displayChargeText(b.text||""))+"</div>";
      var rest2=restFor(b.kind);
      if(rest2!=="—"){
        var rs=parseRestToSeconds(rest2);
        html+="<div class='pc-ex-row' style='margin-top:8px'><span class='pc-ex-label'>Repos</span><span class='pc-ex-value'>"+rest2+"</span></div>";
        if(rs>0)html+="<button class='pc-rest-btn' style='margin-top:10px' onclick='startRestTimer("+rs+")'>// DÉMARRER REPOS "+rest2+"</button>";
      }
    }
    html+="</div>";
  });

  el.innerHTML=html;
  renderSessionEntry();
  setupWodTimer();
}



// ─── Mode séance guidé (optionnel) — V49.3 ────────────────────────────────
// Vue iPhone pleine largeur : 1 bloc = 1 page. Le WOD a son gros timer dédié.

var guidedSessionState = { blocks: [], index: 0 };
var guidedTimer = {duration:0,remaining:0,elapsed:0,running:false,interval:null,mode:"down",label:"",isEmom:false,countdownActive:false,countdownRemaining:10};

function escHtml(v){
  return String(v===undefined||v===null?"":v)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/\"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function buildGuidedSessionBlocks(){
  var w = buildWorkout(state.day,state.week);
  var blocks = [];
  w.blocks.forEach(function(b,bi){
    var rk = kindRank(b.kind);
    var obj = {
      kind:b.kind,
      tag:rk.tag,
      title:b.title,
      time:b.time,
      text:b.text || "",
      blockIndex:bi,
      exercises:[],
      timer:null,
      moves:null,
      loadHints:""
    };

    if(b.exercises && b.exercises.length){
      b.exercises.forEach(function(e,ei){
        obj.exercises.push({
          title:e.name,
          format:e.format || "",
          load:athleteSuggestedLoad(e.name,e.load,(parseTargetReps(e.format,10).min||parseTargetReps(e.format,10).max)) || "",
          rest:e.rest || "",
          note:e.note || "",
          exerciseIndex:ei
        });
      });
    } else if(b.progress && b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        var baseLoad=suggestLoad(mvKey,progressionPct(j),reps);
        var adj=getRpeAdjustment(mvKey,reps);
        var finalLoad=round5(baseLoad+(adj.adj||0));
        obj.exercises.push({
          title:movements[mvKey].name,
          format:setScheme(b.kind,j),
          load:lb(finalLoad)+(adj.arrow?" "+adj.arrow:""),
          rest:restFor(b.kind),
          note:adj.msg || "",
          exerciseIndex:j
        });
      });
    }

    if(b.kind==="wod"){
      obj.timer = wodTimerConfig(b);
      obj.moves = parseWodStructure(b.text || "");
      obj.loadHints = phoneWodLoadHints(b.text || "");
    }

    blocks.push(obj);
  });
  return blocks;
}

function openGuidedSession(){
  resumeAudio();
  guidedSessionState.blocks = buildGuidedSessionBlocks();
  guidedSessionState.index = 0;
  renderGuidedSession();
}

function closeGuidedSession(){
  stopGuidedTimer();
  var el=$("guidedSession");
  if(el){ el.classList.add("hidden"); el.innerHTML=""; }
}

function guidedNext(){
  if(guidedSessionState.index < guidedSessionState.blocks.length-1){
    stopGuidedTimer();
    guidedSessionState.index++;
    renderGuidedSession();
  }
}
function guidedPrev(){
  if(guidedSessionState.index > 0){
    stopGuidedTimer();
    guidedSessionState.index--;
    renderGuidedSession();
  }
}

function resetGuidedTimerState(cfg){
  stopGuidedTimer();
  guidedTimer.duration=Number(cfg&&cfg.seconds)||0;
  guidedTimer.remaining=guidedTimer.duration;
  guidedTimer.elapsed=0;
  guidedTimer.mode=(cfg&&cfg.mode)||"down";
  guidedTimer.label=(cfg&&cfg.label)||"Timer";
  guidedTimer.isEmom=!!(cfg&&cfg.isEmom);
  guidedTimer.countdownActive=false;
  guidedTimer.countdownRemaining=10;
  updateGuidedTimerDisplay();
}
function guidedTimerCurrentValue(){return guidedTimer.mode==="up"?guidedTimer.elapsed:guidedTimer.remaining;}
function updateGuidedTimerDisplay(){
  var d=$("guidedTimerDisplay"); if(!d)return;
  if(guidedTimer.countdownActive){
    d.textContent=String(guidedTimer.countdownRemaining);
    d.classList.add("countdown");
  } else {
    d.textContent=formatClock(guidedTimerCurrentValue());
    d.classList.remove("countdown");
  }
}
function stopGuidedTimer(){
  if(guidedTimer.interval){clearInterval(guidedTimer.interval);guidedTimer.interval=null;}
  guidedTimer.running=false;
  guidedTimer.countdownActive=false;
}
function startGuidedTimerCountdown(onDone){
  guidedTimer.countdownActive=true;
  guidedTimer.countdownRemaining=10;
  updateGuidedTimerDisplay();
  guidedTimer.interval=setInterval(function(){
    guidedTimer.countdownRemaining--;
    if(guidedTimer.countdownRemaining<=3&&guidedTimer.countdownRemaining>0){bipCountdown();vibrate([60]);}
    if(guidedTimer.countdownRemaining<=0){
      clearInterval(guidedTimer.interval);
      guidedTimer.interval=null;
      guidedTimer.countdownActive=false;
      bipStart();vibrate([200,80,200]);
      onDone();
    }
    updateGuidedTimerDisplay();
  },1000);
}
function startGuidedTimer(){
  resumeAudio();
  if(guidedTimer.running||guidedTimer.countdownActive)return;
  var s=$("guidedTimerStart"); if(s){s.textContent="...";s.disabled=true;}
  startGuidedTimerCountdown(function(){
    if(s){s.textContent="▶";s.disabled=false;}
    guidedTimer.running=true;
    guidedTimer.interval=setInterval(function(){
      if(guidedTimer.mode==="up"){
        guidedTimer.elapsed=Math.min(guidedTimer.duration,guidedTimer.elapsed+1);
        if(guidedTimer.isEmom&&guidedTimer.elapsed>0&&guidedTimer.elapsed%60===0){bipEmom();vibrate([100,50,100]);}
        if(guidedTimer.elapsed>=guidedTimer.duration){stopGuidedTimer();bipEnd();vibrate([300,100,300,100,300]);}
      } else {
        guidedTimer.remaining=Math.max(0,guidedTimer.remaining-1);
        if(guidedTimer.remaining<=3&&guidedTimer.remaining>0){bipCountdown();vibrate([60]);}
        if(guidedTimer.isEmom&&guidedTimer.remaining>0&&guidedTimer.remaining%60===0){bipEmom();vibrate([100,50,100]);}
        if(guidedTimer.remaining<=0){stopGuidedTimer();bipEnd();vibrate([300,100,300,100,300]);}
      }
      updateGuidedTimerDisplay();
    },1000);
  });
}
function pauseGuidedTimer(){stopGuidedTimer();updateGuidedTimerDisplay();}
function renderGuidedWodMoves(moves){
  var html="";
  if(moves&&moves.length){
    html+="<div class='guided-wod-moves'>";
    moves.slice(0,4).forEach(function(mv){
      html+="<div class='guided-wod-move "+escHtml(mv.color)+"'>"+
            "<div class='guided-wod-reps'>"+escHtml(mv.reps)+"</div>"+
            "<div class='guided-wod-name'>"+escHtml(mv.name)+"</div>"+
            "</div>";
    });
    html+="</div>";
  }
  return html;
}
function renderGuidedExerciseList(exercises){
  var html="";
  if(!exercises||!exercises.length)return html;
  html+="<div class='guided-ex-list'>";
  exercises.forEach(function(e,idx){
    var restSec=parseRestToSeconds(e.rest);
    html+="<div class='guided-ex-card'>"+
          "<div class='guided-ex-index'>"+(idx+1)+"</div>"+
          "<div class='guided-ex-main'>"+
            "<div class='guided-ex-title'>"+escHtml(e.title)+"</div>"+
            "<div class='guided-ex-grid'>";
    if(e.format)html+="<div><span>Format</span><strong>"+escHtml(e.format)+"</strong></div>";
    if(e.load)html+="<div><span>Poids</span><strong class='accent'>"+escHtml(e.load)+"</strong></div>";
    if(e.rest&&e.rest!=="—")html+="<div><span>Repos</span><strong>"+escHtml(e.rest)+"</strong></div>";
    html+="</div>";
    if(e.note)html+="<div class='guided-note compact'>"+escHtml(e.note)+"</div>";
    if(restSec>0)html+="<button class='guided-rest mini' data-rest='"+restSec+"'>Repos "+escHtml(e.rest)+"</button>";
    html+="</div></div>";
  });
  html+="</div>";
  return html;
}


function parseGuidedSteps(text){
  var t = cleanLine(displayChargeText(text||''));
  if(!t) return [];
  // En mode séance, on veut des gros items simples, pas un paragraphe d'instructions.
  return t.split(/\s*(?:\+|;| ou | puis )\s*/i).map(function(x){
    return x.replace(/^[\s\-–]+/,'').replace(/[.;]+$/,'').trim();
  }).filter(function(x){ return x.length>1; }).slice(0,8);
}

function renderGuidedStepList(text, kind){
  var steps = parseGuidedSteps(text);
  if(!steps.length) return '';
  var html = "<div class='guided-step-list kind-"+escHtml(kind||'')+"'>";
  steps.forEach(function(step,idx){
    var m = step.match(/^(.*?)(\d+\s*(?:min|reps?|\/côté|x\d+|×\d+|m|sec|séries?)?.*)$/i);
    var name = step, dose = '';
    if(m && m[1].trim().length>=3){ name = m[1].trim(); dose = m[2].trim(); }
    html += "<div class='guided-step-card'>"+
            "<div class='guided-step-num'>"+(idx+1)+"</div>"+
            "<div class='guided-step-body'>"+
              "<div class='guided-step-name'>"+escHtml(name)+"</div>"+
              (dose?"<div class='guided-step-dose'>"+escHtml(dose)+"</div>":"")+
            "</div>"+
            "</div>";
  });
  html += "</div>";
  return html;
}
function renderGuidedSession(){
  var el=$("guidedSession"); if(!el)return;
  var blocks=guidedSessionState.blocks||[];
  if(!blocks.length){ closeGuidedSession(); return; }
  var i=guidedSessionState.index;
  var st=blocks[i];
  var pct=Math.round(((i+1)/blocks.length)*100);
  var isFirst=i===0, isLast=i===blocks.length-1;
  var text=cleanLine(displayChargeText(st.text||""));
  var cfg=st.timer;

  var html="";
  html+="<div class='guided-top'>"+
        "<button class='tb-btn' id='guidedCloseBtn'>✕</button>"+
        "<div class='guided-top-title'>Mode séance · "+escHtml(currentDayLabel())+" · S"+state.week+"</div>"+
        "<div class='guided-count'>"+(i+1)+"/"+blocks.length+"</div>"+
        "</div>";
  html+="<div class='guided-progress'><div style='width:"+pct+"%'></div></div>";
  html+="<div class='guided-card kind-"+escHtml(st.kind)+"'>";
  html+="<div class='guided-tag'>"+escHtml(st.tag)+" · "+escHtml(st.time)+"</div>";

  if(st.kind==="wod"){
    html+="<div class='guided-wod-head'>"+
          "<div class='guided-wod-kicker'>"+escHtml((cfg&&cfg.label)||"WOD")+"</div>"+
          "<div class='guided-wod-title'>"+escHtml(st.title)+"</div>"+
          "</div>";
    html+=renderGuidedWodMoves(st.moves);
    html+="<div class='guided-wod-timer' data-duration='"+(cfg?cfg.seconds:0)+"' data-mode='"+(cfg?cfg.mode:"down")+"'>"+
          "<div class='guided-timer-label'>"+escHtml((cfg&&cfg.label)||"Timer")+(cfg&&cfg.isEmom?" · bip/min":"")+"</div>"+
          "<div class='guided-timer-display' id='guidedTimerDisplay'>"+formatClock(cfg&&cfg.mode==="up"?0:(cfg?cfg.seconds:0))+"</div>"+
          "<div class='guided-timer-buttons'>"+
            "<button class='guided-tbtn start' id='guidedTimerStart'>▶</button>"+
            "<button class='guided-tbtn' id='guidedTimerPause'>Ⅱ</button>"+
            "<button class='guided-tbtn' id='guidedTimerReset'>↻</button>"+
          "</div>"+
          "<div class='guided-timer-hint'>Démarrage 10s · gros affichage lisible à distance</div>"+
          "</div>";
    if(text)html+="<div class='guided-wod-fulltext'>"+escHtml(text)+"</div>";
    if(st.loadHints)html+=st.loadHints.replace(/pc-wod/g,"guided-wod");
  } else {
    html+="<div class='guided-title'>"+escHtml(st.title)+"</div>";
    if(st.kind==="warmup" || st.kind==="mobility" || st.kind==="bonus"){
      html+=renderGuidedStepList(st.text, st.kind);
    } else if(st.exercises && st.exercises.length){
      // En mode séance, on retire le paragraphe d'instructions pour éviter le scroll inutile.
      html+=renderGuidedExerciseList(st.exercises);
    } else if(text){
      // Certains blocs autonomes (ex.: Optionnel / Bonus) n'ont pas d'exercises[].
      // Avant V49.3, ils s'affichaient vides en mode séance.
      html+=renderGuidedStepList(st.text, st.kind) || ("<div class='guided-note big'>"+escHtml(text)+"</div>");
    } else {
      html+="<div class='guided-note big'>Aucun contenu pour ce bloc.</div>";
    }
  }

  html+="</div>";
  html+="<div class='guided-actions'>"+
        "<button class='guided-btn' id='guidedPrevBtn' "+(isFirst?"disabled":"")+">← Précédent</button>"+
        "<button class='guided-btn primary' id='guidedNextBtn'>"+(isLast?"Terminer":"Bloc suivant →")+"</button>"+
        "</div>";
  html+="<div class='guided-subactions'>"+
        "<button class='guided-link' id='guidedBackToFullBtn'>Voir séance complète</button>"+
        "</div>";

  el.innerHTML=html;
  el.classList.remove("hidden");
  $("guidedCloseBtn").onclick=closeGuidedSession;
  $("guidedPrevBtn").onclick=guidedPrev;
  $("guidedNextBtn").onclick=function(){ if(isLast)closeGuidedSession(); else guidedNext(); };
  $("guidedBackToFullBtn").onclick=closeGuidedSession;

  Array.prototype.forEach.call(el.querySelectorAll(".guided-rest[data-rest]"),function(btn){
    btn.onclick=function(){ startRestTimer(Number(btn.getAttribute("data-rest"))||0); };
  });

  if(st.kind==="wod" && cfg){
    resetGuidedTimerState(cfg);
    var start=$("guidedTimerStart"), pause=$("guidedTimerPause"), reset=$("guidedTimerReset");
    if(start)start.onclick=startGuidedTimer;
    if(pause)pause.onclick=pauseGuidedTimer;
    if(reset)reset.onclick=function(){ resetGuidedTimerState(cfg); };
  }
}

// ─── Cycle ───────────────────────────────────────────────────────────────────

function populateCycleGoalOptions(){
  var sel=$("cycleGoal");if(!sel)return;
  sel.innerHTML="";
  // Grouper par phase
  var phaseGroups={};
  Object.keys(focusConfigs).forEach(function(id){
    var cfg=focusConfigs[id];
    var ph=cfg.phase||0;
    if(!phaseGroups[ph])phaseGroups[ph]=[];
    phaseGroups[ph].push({id:id,cfg:cfg});
  });
  // Afficher dans l'ordre des phases
  [1,2,3,4,0].forEach(function(ph){
    var group=phaseGroups[ph];if(!group||!group.length)return;
    if(ph>0){
      var og=document.createElement("optgroup");
      og.label="Phase "+ph;
      group.forEach(function(item){
        var opt=document.createElement("option");
        opt.value=item.id;opt.textContent=item.cfg.label;
        if(item.id===state.cycle.goal)opt.selected=true;
        og.appendChild(opt);
      });
      sel.appendChild(og);
    } else {
      group.forEach(function(item){
        var opt=document.createElement("option");
        opt.value=item.id;opt.textContent=item.cfg.label;
        if(item.id===state.cycle.goal)opt.selected=true;
        sel.appendChild(opt);
      });
    }
  });
}

function renderFocusDetails(){
  var cfg=focus(),fd=$("focusDetails");if(!fd)return;
  var target=cfg.phase&&PHASE_TARGETS[cfg.phase]?PHASE_TARGETS[cfg.phase]:null;
  var targetHtml="";
  if(target){
    targetHtml='<div style="margin-top:10px;padding:10px;background:rgba(124,106,255,.1);border-radius:10px;font-size:13px">'+
      '<strong style="color:var(--accent2)">Objectifs de la phase</strong><br>'+
      (target.bench?'Bench : <strong>'+target.bench+' lb</strong><br>':'')+
      (target.backSquat?'Back squat : <strong>'+target.backSquat+' lb x5</strong><br>':'')+
      '<span style="color:var(--muted)">'+target.note+'</span>'+
    '</div>';
  }
  var nextHtml="";
  if(cfg.nextPhase&&focusConfigs[cfg.nextPhase]){
    nextHtml='<div style="margin-top:8px;font-size:12px;color:var(--muted)">Phase suivante → '+focusConfigs[cfg.nextPhase].label+'</div>';
  }
  fd.innerHTML=
    '<strong>'+cfg.label+'</strong><br>'+cfg.impact+
    '<br><br><strong>Structure :</strong> '+cfg.sets.join(" → ")+
    '<br><strong>Repos :</strong> '+cfg.rest+
    targetHtml+nextHtml;
}

function renderCycle(){populateCycleGoalOptions();renderFocusDetails();}
function saveCycle(){
  state.cycle.goal=$("cycleGoal").value;
  state.week=1;
  state.completedDays=[];
  state.cycleState=buildCycleStatePayload();
  save();render();
  if(getToken())savePersistentStateToGitHub(getToken());
  alert("Cycle sauvegardé. Semaine remise à S1.");
}
function newCycle(){
  if(confirm("Démarrer un nouveau cycle? Les références et l'historique RPE sont conservés.")){
    state.week=1;
    state.completedDays=[];
    state.deloadAlert=false;
    state.cycleState=buildCycleStatePayload();
    save();
    if(getToken())savePersistentStateToGitHub(getToken());
    switchView("training");render();
  }
}

// ─── Historique ──────────────────────────────────────────────────────────────

function renderHistory(){
  var h=$("history");if(!h)return;
  h.innerHTML="";
  if(!state.history||!state.history.length){h.innerHTML='<p style="color:var(--muted);font-size:13px">Aucune séance enregistrée.</p>';return;}
  // Graphiques progression pour les mouvements principaux
  renderProgressCharts();
  state.history.slice().reverse().forEach(function(s){
    var div=document.createElement("div");div.className="history-item";
    var title=(s.day&&baseDays[s.day]?baseDays[s.day].label:s.day||"")+" — S"+(s.week||"")+" — "+(s.focus||"");
    var rows="";
    if(s.results){Object.keys(s.results).forEach(function(k){var r=s.results[k];if(r.load||r.result){rows+='<div class="history-row"><span class="mv">'+k+'</span><span class="val">'+(r.load?r.load+" lb"+(r.reps?" × "+r.reps:"")+(r.rpe?" RPE "+r.rpe:""):r.result||"")+'</span></div>';}});}
    div.innerHTML='<div class="history-date">'+s.date+'</div><div class="history-title">'+title+'</div><div class="history-rows">'+rows+'</div>';
    h.appendChild(div);
  });
}

function renderProgressCharts(){
  var c=$("progressCharts");if(!c)return;c.innerHTML="";
  var tracked=["strictPress","frontSquat","powerClean","bench"];
  tracked.forEach(function(mvKey){
    var mv=movements[mvKey];if(!mv)return;
    var loads=[];
    state.history.forEach(function(s){
      var res=s.results||s.resultats||{};
      // Chercher par clé mvKey ET par nom complet du mouvement
      var r=res[mvKey]||res[mv.name]||null;
      if(r&&r.load){loads.push(Number(r.load));}
    });
    if(loads.length<2)return;
    var max=Math.max.apply(null,loads),min=Math.min.apply(null,loads);
    var card=document.createElement("div");card.className="chart-card";
    var bars=loads.slice(-8).map(function(v,i,arr){
      var h=max===min?50:Math.round(((v-min)/(max-min))*46)+4;
      var isLatest=i===arr.length-1;
      return'<div class="chart-bar'+(isLatest?' latest':'')+'" style="height:'+h+'px" title="'+v+' lb"></div>';
    }).join("");
    card.innerHTML='<div class="chart-title">'+mv.name+' — dernier : '+loads[loads.length-1]+' lb</div><div class="chart-bars">'+bars+'</div>';
    c.appendChild(card);
  });
}

// ─── Références ──────────────────────────────────────────────────────────────

function renderReferences(){
  var c=$("referencesList");if(!c)return;c.innerHTML="";
  var rangeLabels={strength:"FORCE 1-5",hypertrophy:"HYPERTROPHIE 6-12",endurance:"ENDURANCE 13+"};
  var rangeColors={strength:"var(--gold)",hypertrophy:"var(--cyan)",endurance:"var(--green)"};
  Object.keys(movements).forEach(function(mvKey){
    ["strength","hypertrophy","endurance"].forEach(function(range){
      var key=mvKey+"__"+range,ref=state.movementRefs[key];
      if(!ref)return;
      var div=document.createElement("div");div.className="ref-item";
      div.style.setProperty("--ref-color",rangeColors[range]);
      div.querySelector?null:null;
      div.innerHTML=
        '<div class="ref-name">'+
          movements[mvKey].name+
          '<span class="ref-range" style="color:'+rangeColors[range]+'">'+rangeLabels[range]+'</span>'+
        '</div>'+
        '<div class="ref-right">'+
          '<span class="ref-value">'+ref.load+' lb × '+ref.reps+'</span>'+
          '<span class="ref-meta">'+ref.date+' · RPE '+ref.rpe+'</span>'+
        '</div>';
      // Couleur de la barre gauche selon range
      div.style.setProperty('--bar-color', rangeColors[range]);
      div.style.cssText+=';--bar-color:'+rangeColors[range];
      c.appendChild(div);
    });
  });
  // Appliquer couleur barre gauche dynamiquement
  c.querySelectorAll('.ref-item').forEach(function(el,i){
    var ranges=["strength","hypertrophy","endurance"];
    var r=ranges[i%3];
    el.style.borderLeftColor=rangeColors[r]||"var(--blue)";
    el.style.borderLeftWidth="2px";
  });
}

// ─── Profil ──────────────────────────────────────────────────────────────────

var PR_FIELD_MAP = {
  prBench:          {profile:"bench",            label:"Bench press",          mvKey:"bench",       reps:1,  range:"strength"},
  prFrontSquat:     {profile:"frontSquat",       label:"Front squat",         mvKey:"frontSquat",  reps:1,  range:"strength"},
  prStrictPress:    {profile:"strictPress",      label:"Strict press",        mvKey:"strictPress", reps:1,  range:"strength"},
  prPowerClean:     {profile:"powerClean",       label:"Power clean",         mvKey:"powerClean",  reps:1,  range:"strength"},
  prBackSquat5RM:   {profile:"backSquat5RM",     label:"Back Squat",          mvKey:"backSquat",   reps:5,  range:"strength"},
  prHipThrust8RM:   {profile:"hipThrust8RM",     label:"Hip thrust",          mvKey:"hipThrust",   reps:8,  range:"hypertrophy"},
  prBulgarianDB:    {profile:"bulgarianDb",      label:"Bulgarian split squat",mvKey:"bulgarian",   reps:8,  range:"hypertrophy"},
  prDbRdl:          {profile:"dbRdl",            label:"DB RDL",              mvKey:null,          reps:8,  range:"hypertrophy"},
  prRow8RM:         {profile:"row8RM",           label:"Barbell row",         mvKey:"barbellRow", reps:8,  range:"hypertrophy"},
  prChestRow8RM:    {profile:"chestRow8RM",      label:"Chest Supported Row", mvKey:"chestRow",   reps:8,  range:"hypertrophy"},
  prLatPulldown10RM:{profile:"latPulldown10RM", label:"Weighted Pull-up",    mvKey:"latPulldown",reps:10, range:"hypertrophy"},
  prInclineDb10RM:  {profile:"inclineDb10RM",    label:"Incline DB press",    mvKey:"inclineDb",  reps:10, range:"hypertrophy"}
};

function todayDateString(){return new Date().toLocaleDateString("fr-CA");}

function renderProfile(){
  Object.keys(PR_FIELD_MAP).forEach(function(id){
    var el=$(id), cfg=PR_FIELD_MAP[id];
    if(el)el.value=state.profile[cfg.profile]||"";
  });
  var d=$("prDate");if(d&&!d.value)d.value=todayDateString();
  var st=$("prStatus");if(st){st.textContent="";st.className="status-msg";}
}

function updateMovementRefFromPR(cfg,load,dateStr){
  if(!cfg||!cfg.mvKey||!load)return;
  var refK=cfg.mvKey+"__"+(cfg.range||repRange(cfg.reps));
  state.movementRefs[refK]={
    movement:cfg.mvKey,
    range:cfg.range||repRange(cfg.reps),
    load:load,
    reps:cfg.reps,
    date:dateStr,
    lastActual:load,
    status:"pr",
    quality:"clean",
    rpe:10,
    note:"PR saisi manuellement"
  };
}

function updateAthleteStateFromPR(cfg,load,dateStr){
  if(!cfg||!load)return;
  var ast=ensureAthleteState();
  var label=cfg.label;
  var range=cfg.range||repRange(cfg.reps);
  var oneRM=epley1RM(load,cfg.reps);
  if(!ast.movements[label]){
    ast.movements[label]={level:1,xp:0,ranges:{},history:[],lastUpdated:null,status:"new"};
  }
  var mv=ast.movements[label];
  mv.ranges=mv.ranges||{};mv.history=mv.history||[];
  mv.ranges[range]={
    currentLoad:load,
    currentReps:cfg.reps,
    actualLoad:load,
    actualReps:cfg.reps,
    rpe:10,
    confidence:0.90,
    status:"pr",
    estimated1RM:Math.round(oneRM),
    lastUpdated:dateStr,
    planned:{source:"manual_pr"}
  };
  mv.xp=Math.max(0,Number(mv.xp||0)+35);
  mv.level=simpleLevelFromLoad(load);
  mv.status="pr";
  mv.lastUpdated=dateStr;
  mv.history.push({date:dateStr,load:load,reps:cfg.reps,rpe:10,range:range,status:"pr",capacityLoad:load,planned:{source:"manual_pr"}});
  if(mv.history.length>12)mv.history=mv.history.slice(-12);
  ast.updatedAt=nowIso();ast.version=APP_VERSION;
}

async function savePrProfile(){
  var dateStr=($("prDate")&&$("prDate").value)||todayDateString();
  var changed={}, results={};
  Object.keys(PR_FIELD_MAP).forEach(function(id){
    var el=$(id), cfg=PR_FIELD_MAP[id];
    if(!el)return;
    var val=parseLoad(el.value);
    if(!val)return;
    var old=Number(state.profile[cfg.profile])||0;
    if(val!==old){
      state.profile[cfg.profile]=val;
      changed[cfg.label]={old:old||null,new:val,reps:cfg.reps};
      results[cfg.label]={load:String(val),reps:String(cfg.reps),rpe:"10",note:"PR saisi manuellement",status:"pr"};
      updateMovementRefFromPR(cfg,val,dateStr);
      updateAthleteStateFromPR(cfg,val,dateStr);
    }
  });
  var st=$("prStatus");
  if(!Object.keys(changed).length){
    if(st){st.textContent="Aucun PR modifié.";st.className="status-msg";}
    return;
  }
  var entry={
    uid:"pr_"+dateStr+"_"+Date.now(),
    type:"pr_update",
    date:dateStr,
    time:new Date().toLocaleTimeString("fr-CA"),
    semaine:state.week,
    jour:state.day,
    week:state.week,
    day:state.day,
    cycle:state.cycle&&state.cycle.goal?state.cycle.goal:null,
    focus:"PR / Records personnels",
    resultats:results,
    results:results,
    changes:changed,
    version:APP_VERSION
  };
  state.history.push(entry);
  save();
  renderReferences();
  renderHistory();

  var token=getToken();
  var msg="✅ PR sauvegardés localement et inscrits dans l’historique.";
  var statusClass="status-msg ok";

  if(!token){
    msg += " ⚠ Non envoyé sur GitHub : token manquant ou non sauvegardé.";
    statusClass="status-msg err";
  } else {
    if(st){st.textContent="Envoi PR vers GitHub...";st.className="status-msg";}
    try{
      // Vérifie/crée les fichiers durables avant l'écriture du PR.
      var ensure=await ensureResultatsFile(token);
      if(!ensure.ok){
        msg += " GitHub resultats ❌ "+ensure.msg;
        statusClass="status-msg err";
      } else {
        var payload=Object.assign({}, entry, { athleteState:ensureAthleteState() });
        var gh=await saveToGitHub(payload);
        var ps=await savePersistentStateToGitHub(token);
        msg += " "+(gh.ok?"GitHub resultats ✅":"GitHub resultats ❌ "+gh.msg);
        msg += " "+(ps.ok?"State ✅":"State ❌ "+ps.msg);
        if(!gh.ok||!ps.ok)statusClass="status-msg err";
      }
    }catch(e){
      msg += " GitHub ❌ "+e.message;
      statusClass="status-msg err";
    }
  }
  if(st){st.textContent=msg;st.className=statusClass;}
}

// ─── Charges ─────────────────────────────────────────────────────────────────

function renderChargeSettings(){
  var c=$("chargeSettingsList");if(!c)return;c.innerHTML="";
  chargeList().forEach(function(key){
    var div=document.createElement("div");div.className="charge-row";
    var val=(customCharges[key]!==undefined)?customCharges[key]:"";
    var official=officialCharges()[key]||"—";
    div.innerHTML='<label>'+key+'<br><small style="font-weight:400;color:var(--muted)">Base: '+official+'</small></label><input class="charge-input" data-charge-key="'+key+'" type="text" value="'+String(val).replace(/"/g,"&quot;")+'" placeholder="'+String(official).replace(/"/g,"&quot;")+'" />';
    c.appendChild(div);
  });
  Array.prototype.forEach.call(c.querySelectorAll("input[data-charge-key]"),function(inp){
    inp.addEventListener("change",function(){
      var key=inp.getAttribute("data-charge-key"),val=inp.value.trim();
      if(val)customCharges[key]=val;else delete customCharges[key];
      saveCustomCharges();renderWorkout();
      if($("phoneView")&&$("phoneView").classList.contains("view-active"))renderPhoneWod();
    });
  });
}
function resetCustomCharges(){if(confirm("Réinitialiser les charges personnalisées?")){customCharges={};saveCustomCharges();renderChargeSettings();renderWorkout();}}

// ─── Paramètres / GitHub token ────────────────────────────────────────────────

function renderSettings(){
  var inp=$("githubToken");if(inp)inp.value=getToken();
  renderChargeSettings();
}
function setupSettingsSave(){
  var btn=$("saveTokenBtn");
  if(btn)btn.onclick=function(){
    var val=$("githubToken").value.trim();
    if(!val){var s=$("tokenStatus");if(s){s.textContent="Token vide.";s.className="status-msg err";}return;}
    setToken(val);
    var s=$("tokenStatus");if(s){s.textContent="✅ Token sauvegardé localement. Clique Tester le token pour valider GitHub.";s.className="status-msg ok";}
  };
  var testBtn=$("testTokenBtn");
  if(testBtn)testBtn.onclick=function(){testGithubToken();};
  var syncBtn=$("syncGithubBtn");
  if(syncBtn)syncBtn.onclick=function(){syncHistoryFromGitHub(false);};
}

// ─── Export texte ─────────────────────────────────────────────────────────────

function stableIphoneText(day,week){
  day=day||state.day;week=week||state.week;
  var w=buildWorkout(day,week);
  var txt=w.day.label.toUpperCase()+" - "+w.day.base.toUpperCase()+" - SEMAINE "+week+"\nFocus: "+focus().label+"\n"+dayIntention(day)+"\n\n";
  w.blocks.forEach(function(b){
    txt+=b.title.toUpperCase()+" ("+b.time+")\n";
    if(b.exercises&&b.exercises.length){if(b.text)txt+=cleanLine(displayChargeText(b.text))+"\n";b.exercises.forEach(function(e){var smartLoad=athleteSuggestedLoad(e.name,e.load,(parseTargetReps(e.format,10).min||parseTargetReps(e.format,10).max));txt+=e.name+"\nFormat: "+e.format+"\nPoids: "+smartLoad+"\nRepos: "+e.rest+"\n"+(e.note?"Note: "+e.note+"\n":"")+"\n";});}
    else if(b.progress&&b.progress.length){b.progress.forEach(function(mvKey,j){var reps=targetReps(j,b.kind),load=lb(suggestLoad(mvKey,progressionPct(j),reps));txt+=movements[mvKey].name+"\nFormat: "+setScheme(b.kind,j)+"\nPoids: "+load+"\nRepos: "+restFor(b.kind)+"\n\n";});}
    else{txt+=cleanLine(displayChargeText(b.text||""))+"\n\n";}
  });
  return txt;
}
function weekText(){var txt="SEMAINE "+state.week+" - "+focus().label+"\n\n";DAYS_ORDER.forEach(function(d){txt+=stableIphoneText(d,state.week)+"\n---\n\n";});return txt;}

function download(name,text){
  var type=name.endsWith(".json")?"application/json;charset=utf-8":"text/plain;charset=utf-8";
  var blob=new Blob([text],{type:type}),url=URL.createObjectURL(blob);
  var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function exportBackup(){
  var v=String(APP_VERSION||"backup").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");
  download("coach-bertin-"+v+"-backup.json",JSON.stringify({version:APP_VERSION,exportedAt:new Date().toISOString(),state:state},null,2));
}
function importBackup(file){
  if(!file)return;
  var r=new FileReader();
  r.onload=function(e){try{var d=JSON.parse(e.target.result);if(d.state){state=Object.assign(state,d.state);save();render();alert("Import réussi.");}}catch(ex){alert("Fichier invalide.");}};
  r.readAsText(file);
}

// ─── Navigation principale ────────────────────────────────────────────────────

var VIEWS=["training","phone","cycle","history","settings","profile","references","backup"];

function switchView(v){
  VIEWS.forEach(function(x){
    var main=$(x+"View"),tab=$(x+"Tab");
    if(main){if(v===x)main.classList.add("view-active");else main.classList.remove("view-active");}
    if(tab)tab.classList.toggle("active",v===x);
  });
  if(v==="phone"){renderPhoneWod();updateRestDisplay();}
  if(v==="cycle")renderCycle();
  if(v==="history")renderHistory();
  if(v==="profile")renderProfile();
  if(v==="references")renderReferences();
  if(v==="settings")renderSettings();
}

// ─── Binding ─────────────────────────────────────────────────────────────────

function bind(){
  [["trainingTab","training"],["phoneTab","phone"],["profileTab","profile"],["referencesTab","references"],["cycleTab","cycle"],["historyTab","history"],["settingsTab","settings"]].forEach(function(pair){
    var t=$(pair[0]);if(t)t.onclick=function(){switchView(pair[1]);};
  });
  var pvb=$("phoneViewBtn");if(pvb)pvb.onclick=function(){switchView("phone");};
  var btb=$("backTrainingBtn");if(btb)btb.onclick=function(){switchView("training");};
  var fs=$("fullscreenBtn");if(fs)fs.onclick=function(){var el=document.documentElement,fn=el.requestFullscreen||el.webkitRequestFullscreen;if(fn)try{fn.call(el);}catch(e){}};
  var smb=$("sessionModeBtn");if(smb)smb.onclick=openGuidedSession;
  var wl=$("wakeLockBtn");if(wl)wl.onclick=function(){if(wakeLock)releaseWakeLock();else requestWakeLock();};  var cp=$("copyPhoneBtn");if(cp)cp.onclick=function(){navigator.clipboard.writeText(stableIphoneText()).then(function(){alert("Copié.");}).catch(function(){alert("Copie bloquée.");});};
  var sc=$("saveCycleBtn");if(sc)sc.onclick=saveCycle;
  var nc=$("newCycleBtn");if(nc)nc.onclick=newCycle;
  var spr=$("savePrBtn");if(spr)spr.onclick=savePrProfile;
  var cg=$("cycleGoal");if(cg)cg.onchange=function(){state.cycle.goal=cg.value;save();renderFocusDetails();};
  var eh=$("exportHistoryBtn");if(eh)eh.onclick=function(){download("coach-bertin-historique.txt","Historique "+APP_VERSION+"\n\n"+JSON.stringify(state.history,null,2));};
  var rh=$("resetHistoryBtn");if(rh)rh.onclick=function(){if(confirm("Effacer tout l'historique?")){state.history=[];save();renderHistory();}};
  var rcb=$("resetCustomChargesBtn");if(rcb)rcb.onclick=resetCustomCharges;
  var ebb=$("exportBackupBtn");if(ebb)ebb.onclick=exportBackup;
  var ibf=$("importBackupFile");if(ibf)ibf.onchange=function(e){importBackup(e.target.files[0]);};
  var ewb=$("exportWeekBtn");if(ewb)ewb.onclick=function(){download("coach-bertin-semaine.txt",weekText());};
}

function render(){renderWeeks();renderDays();renderWorkout();}

// ─── Init ─────────────────────────────────────────────────────────────────────

load();
if(!focusConfigs[state.cycle.goal])state.cycle.goal="shoulders3d";
loadCustomCharges();
bind();
setupHamburger();
setupSwipeNav();
setupRestBar();
setupSettingsSave();
setupSessionSave();
render();
switchView("training");
autoSyncFromGitHub();

if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("service-worker.js").catch(function(){});});}
