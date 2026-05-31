// Coach Bertin V45
var APP_VERSION = "V45";
var GITHUB_OWNER = "Miozza";
var GITHUB_REPO  = "Coach-Beurt";
var GITHUB_FILE  = "data/resultats.json";

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
function totalWeeks(){ return focus().sets ? focus().sets.length : 4; }

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

// Charger les programmes externes (data/programs/*.js)
if (window.COACH_BERTIN_PROGRAMS) {
  Object.keys(window.COACH_BERTIN_PROGRAMS).forEach(function(id) {
    var p = window.COACH_BERTIN_PROGRAMS[id];
    focusConfigs[id] = Object.assign({}, focusConfigs[id]||{}, p);
  });
}

var defaultProfile = {bench:300,frontSquat:215,strictPress:185,powerClean:225,backSquat5RM:235,hipThrust8RM:315,bulgarianDb:50,dbRdl:70,row8RM:185,chestRow8RM:160,latPulldown10RM:140,inclineDb10RM:55};

var movements = {
  bench:        {name:"Bench press",           profile:"bench"},
  inclineDb:    {name:"Incline DB press",       profile:"inclineDb10RM"},
  strictPress:  {name:"Strict press",           profile:"strictPress"},
  chestRow:     {name:"Chest-supported row",    profile:"chestRow8RM"},
  barbellRow:   {name:"Barbell row",            profile:"row8RM"},
  latPulldown:  {name:"Weighted pull-up",       profile:null},
  frontSquat:   {name:"Front squat",            profile:"frontSquat"},
  hipThrust:    {name:"Hip thrust",             profile:"hipThrust8RM"},
  bulgarian:    {name:"Bulgarian split squat",  profile:"bulgarianDb"},
  powerClean:   {name:"Power clean",            profile:"powerClean"},
  dbSnatch:     {name:"DB snatch",              profile:null},
  farmerCarry:  {name:"Farmer carry",           profile:null},
  lateralRaise: {name:"Lateral raise",          profile:null},
  rearDeltFly:  {name:"Rear delt fly",          profile:null},
  ropePushdown: {name:"Triceps rope pushdown",  profile:null},
  facePull:     {name:"Face pull",              profile:null},
  pushPress:    {name:"Push press léger",        profile:"strictPress"}
};

var estimatedDailyLoads = {lateralRaise:25,rearDeltFly:25,ropePushdown:70,facePull:70,latPulldown:20,dbSnatch:50,farmerCarry:50};

var baseDays = {
  lundi:   {label:"Lundi",   base:"Push",      focus:"Pectoraux, épaules, triceps, serratus.", progress:["bench","inclineDb"],      warmup:"Bike 3 min + band pull-aparts + wall slides + activation serratus.", accessory:"Incline DB press + lateral raise + serratus cable punch.", wod:"10 cal row + 10 DB push press léger + 8 burpees"},
  mardi:   {label:"Mardi",   base:"Pull",      focus:"Dos, biceps, scapula, posture.",         progress:["chestRow","latPulldown"], warmup:"Row 3 min + dead hang + scap pull-ups + band rows.", accessory:"Weighted pull-up + face pull + DB curls.", wod:"12 cal SkiErg + 12 ring rows stricts"},
  jeudi:   {label:"Jeudi",   base:"Legs",      focus:"Jambes, fessiers, chaîne postérieure.",  progress:["frontSquat","bulgarian"], warmup:"Bike 3 min + air squats + glute bridge + mobilité hanches.", accessory:"Bulgarian split squat + DB RDL.", wod:"12 cal bike + 12 KB swings + 10 box step-ups"},
  vendredi:{label:"Vendredi",base:"Full body", focus:"Moteur, transitions, puissance.",         progress:["powerClean","strictPress"],warmup:"Row 3 min + mobilité hanches/épaules + ramp-up technique.", accessory:"Farmer carry + reverse fly + hollow hold.", wod:"30 wall balls + 30 cal row + 30 DB snatch alternés"}
};

var wodBanks = {
  push:         ["10 cal row + 10 DB push press + 8 burpees","12 cal row + 10 push-ups + 12 sit-ups","10 cal bike + 8 DB thrusters + 8 burpees"],
  pull:         ["12 cal SkiErg + 12 ring rows","10 cal row + 10 KB high pulls + 10 ring rows","40 cal row + 30 ring rows + 20 DB snatch"],
  legs:         ["12 cal bike + 12 KB swings + 10 box step-ups","14 cal bike + 12 goblet squats","50 cal bike + 40 KB swings + 30 step-ups"],
  weightlifting:["EMOM 10 : 2 power cleans légers","10 min qualité : 3 hang power clean + 6 burpees","8 min technique : clean pull + front squat léger"],
  engine:       ["AMRAP 14 : 10 wall balls + 12 cal row + 8 DB snatch","EMOM 16 : row/bike/ski/bodyweight","12 min pacing : bike + step-ups + ring rows"],
  lowimpact:    ["10 min bike zone 2","10 min row zone 2","AMRAP facile : 8 cal row + 8 air squats + 8 ring rows"]
};

var KEY       = "coachBertinV45";
var CHARGE_KEY= "coachBertinCustomChargesV45";
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
  // Nouveau V45 : suivi RPE par mouvement pour progression automatique
  rpeHistory: {},        // { "mvKey__range": [rpe1, rpe2, rpe3] } — 3 dernières séances
  sessionCount: {},      // { "lundi": 2, "mardi": 1, ... } — séances complétées par jour cette semaine
  completedDays: [],     // ["lundi", "mardi"] — jours complétés cette semaine
  deloadAlert: false     // true si le système détecte fatigue RPE
};
var customCharges = {};

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function copy(o){return JSON.parse(JSON.stringify(o));}
function $(id){return document.getElementById(id);}

function load(){
  try{
    var raw = localStorage.getItem(KEY)
           || localStorage.getItem("coachBertinV43")
           || localStorage.getItem("coachBertinV41");
    if(raw){
      var p = JSON.parse(raw);
      state = Object.assign(state, p);
      state.profile      = Object.assign(copy(defaultProfile), p.profile||{});
      state.cycle        = Object.assign({goal:"shoulders3d"}, p.cycle||{});
      state.movementRefs = Object.assign(copy(PRELOADED_REFS), p.movementRefs||{});
      state.history      = p.history || [];
      state.rpeHistory   = p.rpeHistory || {};
      state.completedDays= p.completedDays || [];
      state.deloadAlert  = p.deloadAlert || false;
    }
  }catch(e){}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}

function loadCustomCharges(){try{customCharges=JSON.parse(localStorage.getItem(CHARGE_KEY)||"{}");}catch(e){customCharges={};}}
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

function round5(n){if(n===0)return 0;if(!n||isNaN(n))return null;return Math.round(n/5)*5;}
function lb(n){var r=round5(n);return(r===0||r)?r+" lb":"—";}
function parseLoad(v){if(v===0||v==="0")return 0;if(!v)return null;var m=String(v).replace(",",".").match(/[0-9]+(\.[0-9]+)?/);return m?Number(m[0]):null;}

function focus(){return focusConfigs[state.cycle.goal]||focusConfigs.hypertrophy;}
function weekIdx(){return Math.max(0,Math.min(3,state.week-1));}
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

// ─── Programme épaules 3D ────────────────────────────────────────────────────

function shouldersWeekPlan(week){
  return({1:{label:"S1 Base",note:"Qualité, amplitude complète, aucun échec.",main:"4 x 10",mainRest:"2:00",wodNote:"Pacing propre"},2:{label:"S2 Volume",note:"Un peu plus de volume ou de densité.",main:"5 x 8-10",mainRest:"2:00",wodNote:"Transitions plus courtes"},3:{label:"S3 Intensité",note:"Un peu plus lourd, jamais sale.",main:"5 x 8",mainRest:"2:15",wodNote:"Fort mais pas redline"},4:{label:"S4 Deload",note:"Réduis le volume, récupère les tendons.",main:"3 x 10 léger",mainRest:"1:45",wodNote:"Facile, technique"}})[week]||{label:"S1",note:"",main:"4 x 10",mainRest:"2:00",wodNote:""};
}
function ex(name,format,load,rest,note){return{name:name,format:format,load:charge(name,load||"—"),rest:rest||"—",note:note||""};}
function exFixed(name,format,load,rest,note){return{name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function shouldersBlocks(day,week){
  var p=shouldersWeekPlan(week);
  if(day==="lundi")return[
    {time:"8 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Row/Bike facile 3 min + PVC Pass Through 2 x 10 + Band Pull Apart 2 x 20 + Scap Push-up 2 x 10 + montée strict press : barre x10, 40% x5, 55% x5."},
    {time:"14 min",title:"A. Mouvement principal",tag:"Force",kind:"main",exercises:[exFixed("Strict Press",p.main,week===1?"115 lb":week===2?"120 lb":week===3?"125 lb":"95-105 lb",p.mainRest,"Sous-maximal. Stop si compensation lombaire.")]},
    {time:"11 min",title:"B. Superset épaules",tag:"Superset",kind:"accessory",text:"Alterner B1 puis B2. Repos seulement après B2.",exercises:[ex("B1. Lateral Raise",week===4?"2-3 x 15-20":"4 x 15-20","25 lb","0:30 avant B2","Contrôle, pas d'élan."),ex("B2. Rear Delt Fly",week===4?"2-3 x 15-20":"4 x 15-20","25 lb","0:60 après B2","Arrière d'épaule, épaules basses.")]},
    {time:"11 min",title:"C. Superset triceps / santé",tag:"Superset",kind:"accessory",text:"Alterner C1 puis C2. Repos seulement après C2.",exercises:[ex("C1. Triceps Rope Pushdown",week===4?"2-3 x 12-15":"4 x 12-15","70 lb","0:30 avant C2","Extension complète sans douleur coude."),ex("C2. Face Pull",week===4?"2-3 x 15-20":"4 x 15-20","70 lb","0:60 après C2","Tire vers les yeux, rotation externe.")]},
    {time:"8 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"AMRAP 8 : 8 burpees contrôlés + 10 cal row + 12 sit-ups. "+p.wodNote+". Pacing modéré : épaules déjà fatiguées."},
    {time:"0-3 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",text:"Band Pull Apart 2 x 30."},
    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",text:"Doorway Pec Stretch 2 min + Lat Stretch sur rig 2 min + Triceps Overhead Stretch 1 min."}
  ];
  if(day==="mardi")return[
    {time:"8 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Row facile 3 min + Open Book 6/côté + Cat-Cow 10 reps + Scap Ring Row 2 x 8 + Band Face Pull 2 x 20 + 2 séries progressives de chest row."},
    {time:"13 min",title:"A. Mouvement principal",tag:"Dos",kind:"main",exercises:[ex("Chest Supported Row",week===1?"4 x 10":week===2?"5 x 10":week===3?"4 x 8":"3 x 10 léger",week===3?"125 lb":"115 lb","1:45-2:00","Tirage propre, pas de swing.")]},
    {time:"11 min",title:"B. Superset arrière d'épaule",tag:"Superset",kind:"accessory",text:"Alterner B1 puis B2. Priorité posture.",exercises:[ex("B1. Rear Delt Fly",week===4?"2-3 x 15":"4 x 15-20","25 lb","0:30 avant B2","Bras longs, trapèzes calmes."),ex("B2. Face Pull",week===4?"2-3 x 15":"4 x 15-20","70 lb","0:60 après B2","Finition en rotation externe.")]},
    {time:"9 min",title:"C. Superset scapulas",tag:"Posture",kind:"accessory",text:"Contrôle lent.",exercises:[ex("C1. Trap-3 Raise",week===4?"2 x 12":"3 x 15","léger","0:30 avant C2","Pouce vers le haut, trap inférieur."),ex("C2. Ring Row Strict",week===4?"2 x 8":"3 x 10","poids du corps","0:60 après C2","Corps gainé, poitrine aux anneaux.")]},
    {time:"10 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"EMOM 10 : min 1 = 12 cal row ; min 2 = 10 ring rows stricts. "+p.wodNote+"."},
    {time:"0-4 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",text:"Farmer Carry 2-3 x 40 m lourd mais propre."},
    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",text:"Child Pose Lat Stretch 2 min + Open Book lent 1 min/côté + Neck/Trap Stretch léger 1 min."}
  ];
  if(day==="jeudi")return[
    {time:"9 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Bike/Row facile 3 min + Ankle Rocks 10/côté + World's Greatest Stretch 5/côté + Glute Bridge 2 x 15 + Goblet Squat léger 2 x 10 + montée front squat : barre x8, 40% x5, 55% x5, 70% x3."},
    {time:"15 min",title:"A. Mouvement principal",tag:"Jambes",kind:"main",exercises:[exFixed("Front Squat",week===1?"5 x 5":week===2?"5 x 5":week===3?"5 x 4":"3 x 5 léger",week===1?"165 lb":week===2?"175 lb":week===3?"185 lb":"135-145 lb","2:00","Dos protégé, aucune tentative héroïque.")]},
    {time:"11 min",title:"B. Superset jambes",tag:"Superset",kind:"accessory",text:"Alterner B1 puis B2.",exercises:[ex("B1. Bulgarian Split Squat",week===4?"2 x 8/jambe":"3 x 10/jambe","50 lb / main","0:30 avant B2","Amplitude propre, genou stable."),ex("B2. Standing Calf Raise",week===4?"2 x 15":"3 x 20","25 lb","0:60 après B2","Pause en haut, étirement en bas.")]},
    {time:"8 min",title:"C. Rappel épaules court",tag:"Pump",kind:"accessory",text:"Rappel rapide.",exercises:[ex("C1. Lateral Raise",week===4?"2 x 15":"3 x 20","20-25 lb","0:30 avant C2","Léger, propre."),ex("C2. Face Pull",week===4?"2 x 15":"3 x 20","60-70 lb","0:45 après C2","Posture et arrière d'épaule.")]},
    {time:"9 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"For time 21-15-9 : Wall Ball 14 lb + Cal Row. "+p.wodNote+". Cap 9 min."},
    {time:"0-3 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",text:"Reverse Sled Drag 3 min continu, léger à modéré."},
    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",text:"Couch Stretch 1 min/côté + Ankle Stretch contre mur 1 min/côté + Hamstring Stretch 1 min total."}
  ];
  return[
    {time:"10 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Row facile 3 min + Band Pull-Apart 2 x 20 + Wrist Stretch 1 min + Front Rack Elbow Rotations 10 reps + Lat Stretch 1 min/côté + Tall Muscle Clean 2 x 5 + High Pull 2 x 5 + montée power clean : barre x5, 40% x3, 55% x3, 65% x2."},
    {time:"14 min",title:"A. Technique haltéro",tag:"Haltéro",kind:"main",exercises:[exFixed("Power Clean",week===1?"6 x 3":week===2?"7 x 3":week===3?"8 x 2":"5 x 2 léger",week===1?"155 lb":week===2?"165 lb":week===3?"175 lb":"135 lb","1:30-2:00","Vitesse et réception propre. Pas de grind.")]},
    {time:"8 min",title:"B. Giant set épaules 3D",tag:"Giant set",kind:"accessory",text:"Enchaîner les 3, puis repos.",exercises:[ex("B1. Lateral Raise",week===4?"2 rounds x 15":"3 rounds x 15","20-25 lb","—","Rappel léger."),ex("B2. Rear Delt Fly",week===4?"2 rounds x 15":"3 rounds x 15","25 lb","—","Arrière d'épaule."),ex("B3. Face Pull",week===4?"2 rounds x 15":"3 rounds x 15","60-70 lb","0:75 après B3","Scapulas propres.")]},
    {time:"5 min",title:"C. Triceps",tag:"Accessoire",kind:"accessory",exercises:[ex("Overhead Rope Extension",week===4?"2 x 12":"3 x 15","50-60 lb","0:60","Longue portion du triceps.")]},
    {time:"12 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"AMRAP 12 : 6 power cleans légers + 12 wall balls 14 lb + 12 cal row. "+p.wodNote+"."},
    {time:"0-3 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",text:"Farmer Carry 2 x 40 m."},
    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",text:"Lat Stretch 2 min + Front Rack Stretch 1 min + PVC Overhead Hold 1 min + Wrist Stretch 1 min."}
  ];
}
function shouldersWodForDay(day){
  var b=shouldersBlocks(day,state.week).filter(function(b){return b.kind==="wod";})[0];
  return b?b.text:"AMRAP 10 simple.";
}

// ─── Construction WOD ────────────────────────────────────────────────────────

function buildWorkout(day,week){
  var d=baseDays[day],cfg=focus(),i=Math.max(0,Math.min(3,week-1));
  if(state.cycle.goal==="shoulders3d")return{day:d,blocks:shouldersBlocks(day,week),progress:[]};
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
  return["Aucun échec sur les mouvements principaux.","Supersets seulement quand c'est indiqué.","Lateral raise : brûlure oui, élan non.","WOD lundi : pacing modéré, épaules déjà fatiguées.","Vendredi : haltéro propre, pas de redline.","Si douleur articulaire : baisse la charge, garde l'amplitude propre."];
}
function dayIntention(day){
  if(day==="lundi")   return"Vraie séance épaules/triceps. Strict press sous-maximal, aucun échec articulaire.";
  if(day==="mardi")   return"Construire l'arrière d'épaule et la posture. Scapulas contrôlées, tirage propre.";
  if(day==="jeudi")   return"Jambes propres, dos protégé. Rappel épaules très court : pump, pas destruction.";
  if(day==="vendredi")return"Garder l'haltéro et le CrossFit vivants. Push press technique, wall balls contrôlés.";
  return"Qualité avant intensité.";
}

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

// Collecte tous les exercices nommés du WOD courant pour la saisie
function collectSessionExercises(){
  var w=buildWorkout(state.day,state.week);
  var items=[];
  w.blocks.forEach(function(b){
    if(b.kind==="warmup"||b.kind==="mobility"||b.kind==="bonus")return;
    if(b.exercises&&b.exercises.length){
      b.exercises.forEach(function(e){
        items.push({
          key:e.name.replace(/^[A-Z][0-9]?\.\s*/,"").trim(),
          name:e.name,
          suggested:e.load,
          kind:b.kind
        });
      });
    } else if(b.progress&&b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        items.push({
          key:mvKey,
          name:movements[mvKey].name,
          suggested:lb(suggestLoad(mvKey,progressionPct(j),reps)),
          kind:b.kind
        });
      });
    } else if(b.kind==="wod"){
      items.push({key:"wod_"+b.title,name:"WOD — "+b.title,suggested:"",kind:"wod",isWod:true});
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
      // Carte WOD : texte libre
      card.innerHTML=
        '<div class="sf-name">'+item.name+'</div>'+
        '<div class="sf-row-2col" style="margin-top:10px">'+
          '<div class="sf-group">'+
            '<span class="sf-label">RÉSULTAT / ROUNDS</span>'+
            '<input class="sf-input" data-key="'+item.key+'" data-field="result" type="text" inputmode="text" placeholder="ex: 4+8 rds"/>'+
          '</div>'+
          '<div class="sf-group">'+
            '<span class="sf-label">NOTE</span>'+
            '<input class="sf-input" data-key="'+item.key+'" data-field="note" type="text" inputmode="text" placeholder=""/>'+
          '</div>'+
        '</div>';
    } else {
      // Extraire la valeur numérique du poids suggéré (ex: "115 lb" → 115)
      var suggestedNum=parseLoad(item.suggested)||0;
      var suggestedDisplay=suggestedNum?suggestedNum:"";

      card.innerHTML=
        // Nom + badge suggéré
        '<div class="sf-header">'+
          '<div class="sf-name">'+item.name+'</div>'+
          (suggestedNum?'<div class="sf-badge">Suggéré : '+suggestedNum+' lb</div>':'')+
        '</div>'+

        // ── Ligne poids : -5 | champ | +5 ──
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

        // ── Ligne reps + RPE ──
        '<div class="sf-row-2col">'+
          // Reps : chips 1-20 + champ texte
          '<div class="sf-group">'+
            '<span class="sf-label">REPS</span>'+
            '<div class="sf-chips" id="reps_'+item.key+'"></div>'+
            '<input class="sf-input sf-reps-input" data-key="'+item.key+'" data-field="reps" type="number" inputmode="numeric" placeholder="reps" style="margin-top:6px"/>'+
          '</div>'+
          // RPE : chips 6-10
          '<div class="sf-group">'+
            '<span class="sf-label">RPE</span>'+
            '<div class="sf-chips" id="rpe_'+item.key+'"></div>'+
            '<input class="sf-input sf-rpe-input" data-key="'+item.key+'" data-field="rpe" type="number" inputmode="numeric" min="1" max="10" placeholder="RPE" style="margin-top:6px"/>'+
          '</div>'+
        '</div>';
    }

    container.appendChild(card);

    if(!item.isWod){
      // Boutons -5 / +5 sur le champ poids
      var minus=card.querySelector('.sf-adj-minus');
      var plus =card.querySelector('.sf-adj-plus');
      var loadInp=card.querySelector('.sf-weight-input');
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

      // Chips reps (common CrossFit rep counts)
      var repsChips=[1,2,3,5,6,8,10,12,15,20];
      var repsContainer=$('reps_'+item.key);
      var repsInp=card.querySelector('.sf-reps-input');
      if(repsContainer&&repsInp){
        repsChips.forEach(function(n){
          var btn=document.createElement('button');
          btn.type='button';btn.className='sf-chip';btn.textContent=n;
          btn.addEventListener('click',function(){
            repsInp.value=n;
            repsContainer.querySelectorAll('.sf-chip').forEach(function(b){b.classList.remove('active');});
            btn.classList.add('active');
          });
          repsContainer.appendChild(btn);
        });
      }

      // Chips RPE (6 à 10)
      var rpeChips=[6,7,8,9,10];
      var rpeContainer=$('rpe_'+item.key);
      var rpeInp=card.querySelector('.sf-rpe-input');
      if(rpeContainer&&rpeInp){
        rpeChips.forEach(function(n){
          var btn=document.createElement('button');
          btn.type='button';
          btn.className='sf-chip'+(n===8?' active':''); // défaut 8
          btn.textContent=n;
          if(n===8)rpeInp.value=8; // pré-remplir RPE à 8
          btn.addEventListener('click',function(){
            rpeInp.value=n;
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
  document.querySelectorAll(".sf-input").forEach(function(inp){
    var key=inp.getAttribute("data-key"),field=inp.getAttribute("data-field"),val=inp.value.trim();
    if(!val)return;
    if(!results[key])results[key]={};
    results[key][field]=val;
  });
  return results;
}

function updateRefsFromResults(results){
  Object.keys(results).forEach(function(key){
    var r=results[key];
    var load=parseLoad(r.load),reps=Number(r.reps)||0;
    if(!load||!reps)return;
    var mvKey=null;
    Object.keys(movements).forEach(function(k){if(k===key)mvKey=k;});
    if(!mvKey)return;
    var refK=refKey(mvKey,reps);
    var existing=state.movementRefs[refK];
    if(!existing||load>=existing.load){
      state.movementRefs[refK]={
        movement:mvKey,range:repRange(reps),load:load,reps:reps,
        date:new Date().toLocaleDateString("fr-CA"),lastActual:load,
        status:Number(r.rpe)>=9?"hard":"success",quality:"clean",
        rpe:Number(r.rpe)||8,note:"Saisi V45"
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
      '<div class="summary-modal-sub">'+baseDays[state.day].label+' S'+state.week+' · RPE moyen '+summary.avgRpe+' '+summary.rpeSignal+'</div>'+
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
    save();
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

// Met à jour les charges personnalisées locales quand un poids réel est saisi
function updateCustomChargesFromResults(results){
  var changed=false;
  Object.keys(results).forEach(function(key){
    var r=results[key];
    var load=parseLoad(r.load);
    if(!load)return;
    var chargeKey=chargeKeyFromName(key);
    var official=officialCharges()[chargeKey];
    if(official!==undefined){customCharges[chargeKey]=load+" lb";changed=true;}
    if(!changed&&movements[key]){
      var ck=chargeKeyFromName(movements[key].name);
      if(officialCharges()[ck]!==undefined){customCharges[ck]=load+" lb";changed=true;}
    }
  });
  if(changed)saveCustomCharges();
}

function buildSessionPayload(results){
  return{
    version:APP_VERSION,
    date:new Date().toLocaleDateString("fr-CA"),
    time:new Date().toLocaleTimeString("fr-CA"),
    semaine:state.week,
    jour:state.day,
    focus:focus().label,
    resultats:results
  };
}

// Génère le contenu du fichier charges.js mis à jour avec les nouveaux poids
function buildChargesJsContent(){
  // Partir des charges officielles de base
  var base=officialCharges();
  // Écraser avec les charges personnalisées locales
  var merged=Object.assign({},base,customCharges);
  var lines=["// Coach Bertin "+APP_VERSION+" — charges officielles modifiables","// Mis à jour automatiquement par l'app après chaque séance.","// Les ajustements faits dans l'app sur iPhone ont priorité sur ces valeurs.","window.DEFAULT_CHARGES = {"];
  var keys=Object.keys(merged);
  keys.forEach(function(k,i){
    lines.push('  "'+k+'": "'+merged[k]+'"'+(i<keys.length-1?",":""));
  });
  lines.push("};","window.CHARGE_ORDER = [");
  var order=window.CHARGE_ORDER||keys;
  order.forEach(function(k,i){lines.push('  "'+k+'"'+(i<order.length-1?",":""));});
  lines.push("];");
  return lines.join("\n");
}

async function saveChargesToGitHub(token){
  var apiUrl="https://api.github.com/repos/"+GITHUB_OWNER+"/"+GITHUB_REPO+"/contents/charges.js";
  var sha=null;
  try{
    var getResp=await fetch(apiUrl,{headers:{"Authorization":"token "+token,"Accept":"application/vnd.github.v3+json"}});
    if(getResp.ok){var gj=await getResp.json();sha=gj.sha;}
  }catch(e){}
  var content=btoa(unescape(encodeURIComponent(buildChargesJsContent())));
  var body={message:"Charges mises à jour — "+new Date().toLocaleDateString("fr-CA"),content:content};
  if(sha)body.sha=sha;
  try{
    var putResp=await fetch(apiUrl,{method:"PUT",headers:{"Authorization":"token "+token,"Accept":"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify(body)});
    return putResp.ok;
  }catch(e){return false;}
}

async function saveToGitHub(payload){
  var token=getToken();
  if(!token){return{ok:false,msg:"Token GitHub manquant. Va dans Paramètres ⚙ pour le saisir."};}
  var apiUrl="https://api.github.com/repos/"+GITHUB_OWNER+"/"+GITHUB_REPO+"/contents/"+GITHUB_FILE;
  var sha=null,existingData=[];
  try{
    var getResp=await fetch(apiUrl,{headers:{"Authorization":"token "+token,"Accept":"application/vnd.github.v3+json"}});
    if(getResp.ok){
      var getJson=await getResp.json();sha=getJson.sha;
      try{existingData=JSON.parse(atob(getJson.content.replace(/\n/g,"")));}catch(e){existingData=[];}
    }
  }catch(e){}
  if(!Array.isArray(existingData))existingData=[];
  existingData.push(payload);
  var content=btoa(unescape(encodeURIComponent(JSON.stringify(existingData,null,2))));
  var body={message:"Séance "+payload.date+" — "+payload.jour+" S"+payload.semaine,content:content};
  if(sha)body.sha=sha;
  try{
    var putResp=await fetch(apiUrl,{method:"PUT",headers:{"Authorization":"token "+token,"Accept":"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify(body)});
    if(putResp.ok)return{ok:true,msg:"✅ Séance sauvegardée sur GitHub !"};
    var err=await putResp.json();
    return{ok:false,msg:"❌ Erreur GitHub : "+(err.message||putResp.status)};
  }catch(e){
    return{ok:false,msg:"❌ Erreur réseau : "+e.message};
  }
}

function setupSessionSave(){
  var btn=$("saveSessionBtn");if(!btn)return;
  btn.onclick=async function(){
    resumeAudio();
    var results=collectSessionResults();
    var hasData=Object.keys(results).length>0;
    if(!hasData){var s=$("saveStatus");if(s){s.textContent="Aucun résultat saisi.";s.className="session-note";}return;}
    btn.disabled=true;btn.textContent="Envoi en cours...";
    var payload=buildSessionPayload(results);
    // 1. Mettre à jour références + historique RPE
    updateRefsFromResults(results);
    // 2. Mettre à jour charges locales
    updateCustomChargesFromResults(results);
    // 3. Marquer le jour complété
    markDayCompleted(state.day);
    // 4. Vérifier alerte deload
    checkDeloadAlert();
    // 5. Ajouter à l'historique local
    state.history.push({date:payload.date,week:state.week,day:state.day,focus:focus().label,results:results});
    save();
    // 6. Envoyer séance sur GitHub
    var result=await saveToGitHub(payload);
    // 7. Mettre à jour charges.js sur GitHub
    var token=getToken();
    var chargesMsg="";
    if(token){
      var chargesOk=await saveChargesToGitHub(token);
      chargesMsg=chargesOk?" + charges.js ✅":" (charges.js : erreur)";
    }
    var s=$("saveStatus");
    if(s){s.textContent=result.msg+chargesMsg;s.className="session-note"+(result.ok?" ok":" err");}
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
  if(wn)wn.onclick=function(){if(state.week<4){state.week++;save();render();}};
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
    if(dir==="left"&&state.week<4){state.week++;save();render();}
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

function renderWorkout(){
  var w=buildWorkout(state.day,state.week);
  var wt=$("workoutTitle"),wf=$("workoutFocus"),fi=$("focusImpact"),c=$("blocks"),pa=$("progressionAdvice");
  var plan=state.cycle.goal==="shoulders3d"?shouldersWeekPlan(state.week):null;
  var wi=buildWeekInfo();
  if(wt)wt.textContent=(wi[state.week]?wi[state.week].label:"S"+state.week)+" — "+w.day.label+" — "+w.day.base;
  if(wf)wf.textContent=w.day.focus;

  var deloadWarning=state.deloadAlert
    ?'<br><strong style="color:var(--red)">⚠ RPE ÉLEVÉ DÉTECTÉ — CONSIDÈRE UN DELOAD</strong>':"";
  if(fi)fi.innerHTML=
    "<strong style='font-family:var(--font-hud);letter-spacing:.04em'>"+dayIntention(state.day)+"</strong>"+
    (plan?"<br><em style='color:var(--text2)'>"+plan.label+" : "+plan.note+"</em>":"")+
    deloadWarning+
    "<br><small style='color:var(--muted);font-family:var(--font-hud);font-size:10px;letter-spacing:.04em'>"+cycleRules().slice(0,3).join(" · ")+"</small>";

  if(!c)return;c.innerHTML="";
  w.blocks.forEach(function(b){
    var rk=kindRank(b.kind);
    var div=document.createElement("div");
    div.className="block kind-"+b.kind;
    var inner=
      '<div class="block-header">'+
        '<div class="block-rank '+rk.cls+'">'+rk.rank+'</div>'+
        '<div><div class="block-title">'+b.title+'</div><div class="block-time">'+b.time+'</div></div>'+
        '<div class="block-tag '+rk.tagCls+'">'+rk.tag+'</div>'+
      '</div>';
    if(b.text)inner+='<div class="block-text">'+displayChargeText(b.text)+'</div>';
    if(b.exercises&&b.exercises.length){
      b.exercises.forEach(function(e){
        var arrowHtml="";
        inner+=
          '<div class="exercise-box">'+
            '<div class="exercise-name">'+e.name+'</div>'+
            '<div class="exercise-meta">'+
              '<div class="exercise-format">'+e.format+'</div>'+
              '<div class="exercise-load">'+e.load+'</div>'+
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
            '<div class="exercise-name">'+movements[mvKey].name+'</div>'+
            '<div class="exercise-meta">'+
              '<div class="exercise-format">'+setScheme(b.kind,j)+'</div>'+
              '<div class="exercise-load '+loadCls+'">'+lb(finalLoad)+(adj.arrow?' '+adj.arrow:'')+'</div>'+
            '</div>'+
          '</div>';
      });
    }
    div.innerHTML=inner;c.appendChild(div);
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
  var plan=state.cycle.goal==="shoulders3d"?shouldersWeekPlan(state.week):null;
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
  if(plan)html+="<div style='margin-top:10px;font-size:14px;color:var(--gold)'>"+plan.label+" — "+plan.note+"</div>";
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
        html+="<div class='pc-ex-row'><span class='pc-ex-label'>Poids</span><span class='pc-ex-value accent'>"+e.load+"</span></div>";
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
  save();render();
  alert("Cycle sauvegardé. Semaine remise à S1.");
}
function newCycle(){
  if(confirm("Démarrer un nouveau cycle? Les références et l'historique RPE sont conservés.")){
    state.week=1;
    state.completedDays=[];
    state.deloadAlert=false;
    save();switchView("training");render();
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
      if(s.results&&s.results[mvKey]&&s.results[mvKey].load){loads.push(Number(s.results[mvKey].load));}
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

function renderProfile(){
  var map={prBench:"bench",prFrontSquat:"frontSquat",prStrictPress:"strictPress",prPowerClean:"powerClean",prBackSquat5RM:"backSquat5RM",prHipThrust8RM:"hipThrust8RM",prBulgarianDB:"bulgarianDb",prDbRdl:"dbRdl",prRow8RM:"row8RM",prChestRow8RM:"chestRow8RM",prLatPulldown10RM:"latPulldown10RM",prInclineDb10RM:"inclineDb10RM"};
  Object.keys(map).forEach(function(id){var el=$(id);if(el)el.value=state.profile[map[id]]||"";});
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
  var btn=$("saveTokenBtn");if(!btn)return;
  btn.onclick=function(){
    var val=$("githubToken").value.trim();
    if(!val){var s=$("tokenStatus");if(s){s.textContent="Token vide.";s.className="status-msg err";}return;}
    setToken(val);
    var s=$("tokenStatus");if(s){s.textContent="✅ Token sauvegardé localement.";s.className="status-msg ok";}
  };
}

// ─── Export texte ─────────────────────────────────────────────────────────────

function stableIphoneText(day,week){
  day=day||state.day;week=week||state.week;
  var w=buildWorkout(day,week);
  var txt=w.day.label.toUpperCase()+" - "+w.day.base.toUpperCase()+" - SEMAINE "+week+"\nFocus: "+focus().label+"\n"+dayIntention(day)+"\n\n";
  w.blocks.forEach(function(b){
    txt+=b.title.toUpperCase()+" ("+b.time+")\n";
    if(b.exercises&&b.exercises.length){if(b.text)txt+=cleanLine(displayChargeText(b.text))+"\n";b.exercises.forEach(function(e){txt+=e.name+"\nFormat: "+e.format+"\nPoids: "+e.load+"\nRepos: "+e.rest+"\n"+(e.note?"Note: "+e.note+"\n":"")+"\n";});}
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
function exportBackup(){download("coach-bertin-v41-backup.json",JSON.stringify({version:APP_VERSION,exportedAt:new Date().toISOString(),state:state},null,2));}
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
  var wl=$("wakeLockBtn");if(wl)wl.onclick=function(){if(wakeLock)releaseWakeLock();else requestWakeLock();};  var cp=$("copyPhoneBtn");if(cp)cp.onclick=function(){navigator.clipboard.writeText(stableIphoneText()).then(function(){alert("Copié.");}).catch(function(){alert("Copie bloquée.");});};
  var sc=$("saveCycleBtn");if(sc)sc.onclick=saveCycle;
  var nc=$("newCycleBtn");if(nc)nc.onclick=newCycle;
  var cg=$("cycleGoal");if(cg)cg.onchange=function(){state.cycle.goal=cg.value;save();renderFocusDetails();};
  var eh=$("exportHistoryBtn");if(eh)eh.onclick=function(){download("coach-bertin-historique.txt","Historique V41\n\n"+JSON.stringify(state.history,null,2));};
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

if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("service-worker.js").catch(function(){});});}
