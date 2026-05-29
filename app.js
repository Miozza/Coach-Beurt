
var weekInfo={1:{label:"Semaine 1",goal:"Base technique : repères propres."},2:{label:"Semaine 2",goal:"Progression : plus de volume ou densité."},3:{label:"Semaine 3",goal:"Intensité : semaine la plus lourde."},4:{label:"Semaine 4",goal:"Deload actif : récupération et qualité."}};
var focusConfigs={
hypertrophy:{label:"Hypertrophie utile",impact:"Augmente reps/accessoires, WOD court.",sets:["4 x 8","4 x 8","5 x 5","3 x 8 tempo"],targetReps:[8,8,5,8],mult:[0.65,0.68,0.72,0.55],rest:"1:30–2:00",tag:"plus de muscle"},
shoulders3d:{label:"Épaules 3D",impact:"Priorité deltoïdes latéraux, arrière d’épaule et triceps. Press sous-maximal, haut du dos élevé, CrossFit conservé.",sets:["4 x 10","4 x 10","5 x 8","3 x 10 léger"],targetReps:[10,10,8,10],mult:[0.58,0.62,0.66,0.50],rest:"1:15–1:45",tag:"épaules 3D"},
strength:{label:"Force",impact:"Plus lourd, moins de volume inutile, repos longs.",sets:["5 x 5","5 x 4","6 x 3","3 x 5 léger"],targetReps:[5,4,3,5],mult:[0.75,0.80,0.86,0.60],rest:"2:00–2:30",tag:"plus lourd"},
weightlifting:{label:"Haltérophilie",impact:"Technique olympique, vitesse, positions, réception propre.",sets:["8 x 2 technique","EMOM 10 x 2","8 x 1–2 lourd propre","5 x 2 léger"],targetReps:[2,2,2,2],mult:[0.62,0.68,0.78,0.55],rest:"1:15–2:00",tag:"technique + vitesse"},
posture:{label:"Posture / cyphose",impact:"Plus de tirage, serratus, trap inférieur, mobilité thoracique.",sets:["4 x 6 propre","4 x 6 propre","5 x 4","3 x 6 tempo"],targetReps:[6,6,4,6],mult:[0.68,0.70,0.75,0.55],rest:"1:45–2:15",tag:"posture"},
engine:{label:"Endurance CrossFit",impact:"Force en maintien, WOD plus long, accessoires réduits.",sets:["3 x 5 maintien","3 x 5 maintien","4 x 3 maintien","2 x 5 léger"],targetReps:[5,5,3,5],mult:[0.65,0.68,0.72,0.55],rest:"1:30",tag:"moteur"},
recomp:{label:"Recomposition corporelle",impact:"Hypertrophie + densité, repos plus courts.",sets:["4 x 8","4 x 8","4 x 6","3 x 8"],targetReps:[8,8,6,8],mult:[0.62,0.65,0.70,0.55],rest:"1:15–1:45",tag:"densité"},
maintenance:{label:"Maintien / récupération",impact:"Charges basses, technique, mobilité, zone 2.",sets:["3 x 5 facile","3 x 5 facile","3 x 3 propre","2 x 5 léger"],targetReps:[5,5,3,5],mult:[0.55,0.58,0.62,0.50],rest:"1:30–2:00",tag:"récupération"}};
var defaultProfile={bench:300,frontSquat:215,strictPress:185,powerClean:225,backSquat5RM:235,hipThrust8RM:315,bulgarianDb:50,dbRdl:70,row8RM:185,chestRow8RM:160,latPulldown10RM:140,inclineDb10RM:55};
var movements={bench:{name:"Bench press",profile:"bench"},inclineDb:{name:"Incline DB press",profile:"inclineDb10RM"},strictPress:{name:"Strict press",profile:"strictPress"},chestRow:{name:"Chest-supported row",profile:"chestRow8RM"},barbellRow:{name:"Barbell row",profile:"row8RM"},latPulldown:{name:"Weighted pull-up",profile:null},frontSquat:{name:"Front squat",profile:"frontSquat"},hipThrust:{name:"Hip thrust",profile:"hipThrust8RM"},bulgarian:{name:"Bulgarian split squat",profile:"bulgarianDb"},powerClean:{name:"Power clean",profile:"powerClean"},dbSnatch:{name:"DB snatch",profile:null},farmerCarry:{name:"Farmer carry",profile:null},lateralRaise:{name:"Lateral raise",profile:null},rearDeltFly:{name:"Rear delt fly",profile:null},ropePushdown:{name:"Rope pushdown",profile:null},facePull:{name:"Face pull",profile:null},pushPress:{name:"Push press léger",profile:"strictPress"}};
var baseDays={lundi:{label:"Lundi",base:"Push",focus:"Pectoraux, épaules, triceps, serratus.",progress:["bench","inclineDb"],warmup:"Bike 3 min + band pull-aparts + wall slides + activation serratus.",accessory:"Incline DB press + lateral raise + serratus cable punch.",wod:"10 cal row + 10 DB push press léger + 8 burpees"},mardi:{label:"Mardi",base:"Pull",focus:"Dos, biceps, scapula, posture.",progress:["chestRow","latPulldown"],warmup:"Row 3 min + dead hang + scap pull-ups + band rows.",accessory:"Weighted pull-up + face pull + DB curls.",wod:"12 cal SkiErg + 12 ring rows stricts"},jeudi:{label:"Jeudi",base:"Legs",focus:"Jambes, fessiers, chaîne postérieure.",progress:["frontSquat","bulgarian"],warmup:"Bike 3 min + air squats + glute bridge + mobilité hanches.",accessory:"Bulgarian split squat + DB RDL.",wod:"12 cal bike + 12 KB swings + 10 box step-ups"},vendredi:{label:"Vendredi",base:"Full body",focus:"Moteur, transitions, puissance.",progress:["powerClean","strictPress"],warmup:"Row 3 min + mobilité hanches/épaules + ramp-up technique.",accessory:"Farmer carry + reverse fly + hollow hold.",wod:"30 wall balls + 30 cal row + 30 DB snatch alternés"}};
var wodBanks={push:["10 cal row + 10 DB push press + 8 burpees","12 cal row + 10 push-ups + 12 sit-ups","10 cal bike + 8 DB thrusters + 8 burpees"],pull:["12 cal SkiErg + 12 ring rows","10 cal row + 10 KB high pulls + 10 ring rows","40 cal row + 30 ring rows + 20 DB snatch"],legs:["12 cal bike + 12 KB swings + 10 box step-ups","14 cal bike + 12 goblet squats","50 cal bike + 40 KB swings + 30 step-ups"],weightlifting:["EMOM 10 : 2 power cleans légers","10 min qualité : 3 hang power clean + 6 burpees","8 min technique : clean pull + front squat léger"],engine:["AMRAP 14 : 10 wall balls + 12 cal row + 8 DB snatch","EMOM 16 : row/bike/ski/bodyweight","12 min pacing : bike + step-ups + ring rows"],lowimpact:["10 min bike zone 2","10 min row zone 2","AMRAP facile : 8 cal row + 8 air squats + 8 ring rows"]};
var KEY="coachBertinV28Shoulders3D";
var state={week:1,day:"lundi",history:[],profile:copy(defaultProfile),trainingMaxPct:0.925,cycle:{goal:"hypertrophy"},movementRefs:{"inclineDb__strength": {"movement": "inclineDb", "range": "strength", "load": 85, "reps": 5, "date": "préchargé", "lastActual": 85, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__hypertrophy": {"movement": "inclineDb", "range": "hypertrophy", "load": 60, "reps": 8, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__endurance": {"movement": "inclineDb", "range": "endurance", "load": 45, "reps": 15, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__strength": {"movement": "strictPress", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__hypertrophy": {"movement": "strictPress", "range": "hypertrophy", "load": 135, "reps": 8, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__endurance": {"movement": "strictPress", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__strength": {"movement": "chestRow", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__hypertrophy": {"movement": "chestRow", "range": "hypertrophy", "load": 115, "reps": 8, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__endurance": {"movement": "chestRow", "range": "endurance", "load": 95, "reps": 15, "date": "préchargé", "lastActual": 95, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__strength": {"movement": "barbellRow", "range": "strength", "load": 205, "reps": 5, "date": "préchargé", "lastActual": 205, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__hypertrophy": {"movement": "barbellRow", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__endurance": {"movement": "barbellRow", "range": "endurance", "load": 155, "reps": 15, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__strength": {"movement": "latPulldown", "range": "strength", "load": 45, "reps": 5, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__hypertrophy": {"movement": "latPulldown", "range": "hypertrophy", "load": 20, "reps": 8, "date": "préchargé", "lastActual": 20, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__strength": {"movement": "frontSquat", "range": "strength", "load": 224, "reps": 5, "date": "préchargé", "lastActual": 224, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__hypertrophy": {"movement": "frontSquat", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__endurance": {"movement": "frontSquat", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__strength": {"movement": "hipThrust", "range": "strength", "load": 315, "reps": 5, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__hypertrophy": {"movement": "hipThrust", "range": "hypertrophy", "load": 315, "reps": 8, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__endurance": {"movement": "hipThrust", "range": "endurance", "load": 265, "reps": 15, "date": "préchargé", "lastActual": 265, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__strength": {"movement": "bulgarian", "range": "strength", "load": 60, "reps": 5, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__hypertrophy": {"movement": "bulgarian", "range": "hypertrophy", "load": 40, "reps": 8, "date": "préchargé", "lastActual": 40, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__endurance": {"movement": "bulgarian", "range": "endurance", "load": 25, "reps": 15, "date": "préchargé", "lastActual": 25, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__strength": {"movement": "powerClean", "range": "strength", "load": 215, "reps": 5, "date": "préchargé", "lastActual": 215, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__hypertrophy": {"movement": "powerClean", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__endurance": {"movement": "powerClean", "range": "endurance", "load": 135, "reps": 15, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__strength": {"movement": "dbSnatch", "range": "strength", "load": 70, "reps": 5, "date": "préchargé", "lastActual": 70, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__hypertrophy": {"movement": "dbSnatch", "range": "hypertrophy", "load": 50, "reps": 8, "date": "préchargé", "lastActual": 50, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__endurance": {"movement": "dbSnatch", "range": "endurance", "load": 35, "reps": 15, "date": "préchargé", "lastActual": 35, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__strength": {"movement": "farmerCarry", "range": "strength", "load": 32, "reps": 5, "date": "préchargé", "lastActual": 32, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__hypertrophy": {"movement": "farmerCarry", "range": "hypertrophy", "load": 28, "reps": 8, "date": "préchargé", "lastActual": 28, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__endurance": {"movement": "farmerCarry", "range": "endurance", "load": 24, "reps": 15, "date": "préchargé", "lastActual": 24, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}}};
var EXTRA_PRELOADED_REFS={"bench__strength": {"movement": "bench", "range": "strength", "load": 265, "reps": 5, "date": "préchargé", "lastActual": 265, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bench__hypertrophy": {"movement": "bench", "range": "hypertrophy", "load": 215, "reps": 8, "date": "préchargé", "lastActual": 215, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bench__endurance": {"movement": "bench", "range": "endurance", "load": 185, "reps": 15, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}};
state.movementRefs=Object.assign(EXTRA_PRELOADED_REFS, {}, state.movementRefs||{}, EXTRA_PRELOADED_REFS);
function copy(o){return JSON.parse(JSON.stringify(o));} function $(id){return document.getElementById(id);}
function load(){try{var r=localStorage.getItem(KEY)||localStorage.getItem("coachBertinV16RepsReferences")||localStorage.getItem("coachBertinV15MovementProgression");if(r){var p=JSON.parse(r);state=Object.assign(state,p);state.profile=Object.assign(copy(defaultProfile),p.profile||{});state.cycle=Object.assign({goal:"hypertrophy"},p.cycle||{});state.movementRefs=Object.assign(EXTRA_PRELOADED_REFS, {"inclineDb__strength": {"movement": "inclineDb", "range": "strength", "load": 85, "reps": 5, "date": "préchargé", "lastActual": 85, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__hypertrophy": {"movement": "inclineDb", "range": "hypertrophy", "load": 60, "reps": 8, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__endurance": {"movement": "inclineDb", "range": "endurance", "load": 45, "reps": 15, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__strength": {"movement": "strictPress", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__hypertrophy": {"movement": "strictPress", "range": "hypertrophy", "load": 135, "reps": 8, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__endurance": {"movement": "strictPress", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__strength": {"movement": "chestRow", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__hypertrophy": {"movement": "chestRow", "range": "hypertrophy", "load": 115, "reps": 8, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__endurance": {"movement": "chestRow", "range": "endurance", "load": 95, "reps": 15, "date": "préchargé", "lastActual": 95, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__strength": {"movement": "barbellRow", "range": "strength", "load": 205, "reps": 5, "date": "préchargé", "lastActual": 205, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__hypertrophy": {"movement": "barbellRow", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__endurance": {"movement": "barbellRow", "range": "endurance", "load": 155, "reps": 15, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__strength": {"movement": "latPulldown", "range": "strength", "load": 45, "reps": 5, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__hypertrophy": {"movement": "latPulldown", "range": "hypertrophy", "load": 20, "reps": 8, "date": "préchargé", "lastActual": 20, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__strength": {"movement": "frontSquat", "range": "strength", "load": 224, "reps": 5, "date": "préchargé", "lastActual": 224, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__hypertrophy": {"movement": "frontSquat", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__endurance": {"movement": "frontSquat", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__strength": {"movement": "hipThrust", "range": "strength", "load": 315, "reps": 5, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__hypertrophy": {"movement": "hipThrust", "range": "hypertrophy", "load": 315, "reps": 8, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__endurance": {"movement": "hipThrust", "range": "endurance", "load": 265, "reps": 15, "date": "préchargé", "lastActual": 265, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__strength": {"movement": "bulgarian", "range": "strength", "load": 60, "reps": 5, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__hypertrophy": {"movement": "bulgarian", "range": "hypertrophy", "load": 40, "reps": 8, "date": "préchargé", "lastActual": 40, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__endurance": {"movement": "bulgarian", "range": "endurance", "load": 25, "reps": 15, "date": "préchargé", "lastActual": 25, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__strength": {"movement": "powerClean", "range": "strength", "load": 215, "reps": 5, "date": "préchargé", "lastActual": 215, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__hypertrophy": {"movement": "powerClean", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__endurance": {"movement": "powerClean", "range": "endurance", "load": 135, "reps": 15, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__strength": {"movement": "dbSnatch", "range": "strength", "load": 70, "reps": 5, "date": "préchargé", "lastActual": 70, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__hypertrophy": {"movement": "dbSnatch", "range": "hypertrophy", "load": 50, "reps": 8, "date": "préchargé", "lastActual": 50, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__endurance": {"movement": "dbSnatch", "range": "endurance", "load": 35, "reps": 15, "date": "préchargé", "lastActual": 35, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__strength": {"movement": "farmerCarry", "range": "strength", "load": 32, "reps": 5, "date": "préchargé", "lastActual": 32, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__hypertrophy": {"movement": "farmerCarry", "range": "hypertrophy", "load": 28, "reps": 8, "date": "préchargé", "lastActual": 28, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__endurance": {"movement": "farmerCarry", "range": "endurance", "load": 24, "reps": 15, "date": "préchargé", "lastActual": 24, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}}, p.movementRefs||{});}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function round5(n){if(n===0)return 0;if(!n||isNaN(n))return null;return Math.round(n/5)*5;} function lb(n){var r=round5(n);return (r===0||r)?r+" lb":"—";}
function parseLoad(v){
  if(v===0 || v==="0"){return 0;}
  if(!v){return null;}
  var cleaned=String(v).replace(",",".");
  var m=cleaned.match(/[0-9]+(\.[0-9]+)?/);
  return m?Number(m[0]):null;
}
function focus(){return focusConfigs[state.cycle.goal]||focusConfigs.hypertrophy;} function weekIdx(){return Math.max(0,Math.min(3,state.week-1));}
function repRange(reps){reps=Number(reps)||0;if(reps<=5)return"strength";if(reps<=12)return"hypertrophy";return"endurance";}
function repRangeLabel(r){return r==="strength"?"1–5 reps":r==="hypertrophy"?"6–12 reps":"13+ reps";}
function refKey(mvKey,reps){return mvKey+"__"+repRange(reps);}
function tmFromProfile(mvKey){var mv=movements[mvKey];if(!mv||!mv.profile)return 0;var raw=Number(state.profile[mv.profile]);return raw?raw*Number(state.trainingMaxPct||0.925):0;}
function referenceKeyFor(mvKey,reps){
  return mvKey+"__"+repRange(reps);
}
function hasReference(mvKey,reps){
  var key=referenceKeyFor(mvKey,reps);
  return !!(state.movementRefs[key] && state.movementRefs[key].load);
}
function referenceBase(mvKey,targetReps){
  var key=referenceKeyFor(mvKey,targetReps);
  var ref=state.movementRefs[key];
  if(ref && ref.load !== undefined && ref.load !== null && ref.load !== ""){
    return {value:Number(ref.load), source:"reference", ref:ref};
  }
  var fallback=tmFromProfile(mvKey);
  return {value:fallback, source:fallback?"profile":"none", ref:null};
}
function referenceMultiplier(ref, range){
  // IMPORTANT:
  // A reference is treated as a benchmark / rep PR, not as a daily training load.
  // Example: Bench 215 x 8 means "known capacity", not "do 4x8 at 215 every week".
  var week=weekIdx();
  var goal=state.cycle.goal;

  var table={
    hypertrophy:[0.82,0.85,0.88,0.65],
    shoulders3d:[0.68,0.72,0.76,0.58],
    strength:[0.84,0.87,0.90,0.68],
    weightlifting:[0.72,0.76,0.80,0.60],
    posture:[0.75,0.78,0.82,0.60],
    engine:[0.70,0.73,0.76,0.58],
    recomp:[0.78,0.82,0.85,0.62],
    maintenance:[0.60,0.62,0.65,0.55]
  };

  var m=(table[goal]||table.hypertrophy)[week];

  // If the reference itself was already hard, keep the training load more conservative.
  if(ref){
    if(ref.status==="hard" || Number(ref.rpe)>=9){m-=0.05;}
    if(ref.quality==="acceptable"){m-=0.025;}
    if(ref.quality==="doubtful"){m-=0.08;}
  }

  // Do not allow accidental PR-ish prescriptions from a reference.
  return Math.max(0.45,Math.min(m,0.90));
}
function profileMultiplier(index){
  var cfg=focus();
  var i=weekIdx();
  var base=cfg.mult[i];
  return index===0?base:Math.max(0.45,base-0.12);
}
function suggestLoad(mvKey,pct,targetReps){
  var base=referenceBase(mvKey,targetReps);
  if(!base.value){return 0;}
  if(base.source==="reference"){
    return base.value*referenceMultiplier(base.ref,repRange(targetReps));
  }
  return base.value*pct;
}
function progressionPct(index){return profileMultiplier(index);}
function targetReps(index,kind){
  var goal=state.cycle.goal;
  var week=weekIdx();
  if(kind==="main"){return focus().targetReps[week]||5;}
  if(kind==="accessory"){
    if(goal==="shoulders3d")return 15;
    if(goal==="strength")return 8;
    if(goal==="weightlifting")return 3;
    if(goal==="posture")return 12;
    if(goal==="engine")return 10;
    if(goal==="maintenance")return 10;
    return 10;
  }
  if(kind==="wod")return goal==="shoulders3d"?12:(goal==="engine"?12:8);
  return focus().targetReps[week]||5;
}
function setScheme(kind,index){
  var goal=state.cycle.goal;
  var week=weekIdx();
  if(kind==="main"){return focus().sets[week];}
  if(kind==="accessory"){
    if(goal==="shoulders3d")return "3-4 x 15";
    if(goal==="strength")return "3 x 8";
    if(goal==="weightlifting")return "5 x 3 technique";
    if(goal==="posture")return "3 x 12";
    if(goal==="engine")return "2 x 10";
    if(goal==="maintenance")return "2 x 10 facile";
    return "3 x 10";
  }
  if(kind==="wod"){return "selon WOD";}
  return "—";
}
function restFor(kind){
  if(kind==="main")return focus().rest;
  if(kind==="accessory")return state.cycle.goal==="strength"?"1:30–2:00":(state.cycle.goal==="shoulders3d"?"0:30–1:00":"0:45–1:15");
  if(kind==="wod")return"selon WOD";
  return"—";
}
function wodForDay(day){var goal=state.cycle.goal;if(goal==="shoulders3d")return shouldersWodForDay(day);if(goal==="weightlifting")return wodBanks.weightlifting[(state.week-1)%wodBanks.weightlifting.length];if(goal==="engine")return wodBanks.engine[(state.week-1)%wodBanks.engine.length];if(goal==="maintenance")return wodBanks.lowimpact[(state.week-1)%wodBanks.lowimpact.length];if(day==="lundi")return wodBanks.push[(state.week-1)%wodBanks.push.length];if(day==="mardi")return wodBanks.pull[(state.week-1)%wodBanks.pull.length];if(day==="jeudi")return wodBanks.legs[(state.week-1)%wodBanks.legs.length];return wodBanks.engine[(state.week-1)%wodBanks.engine.length];}

function shouldersAccessoryText(day){
  if(day==="lundi")return "Lateral raise 4 x 15-20 + cable lateral raise 3 x 12-15/côté + rear delt fly 3 x 15-20 + triceps rope pushdown 3 x 12-15.";
  if(day==="mardi")return "Rear delt fly 4 x 15-20 + face pull 4 x 15-20 + trap-3 raise 3 x 12-15 + hammer curl 3 x 10-12.";
  if(day==="jeudi")return "Bulgarian split squat + DB RDL + rappel épaules : lateral raise mécanique 2 rounds.";
  if(day==="vendredi")return "Push press léger/modéré 3 x 6 + lateral raise 3 x 15 + farmer carry 3 x 30-40 m.";
  return "Deltoïdes latéraux + arrière d’épaule + triceps.";
}
function shouldersWodForDay(day){
  if(day==="lundi")return "AMRAP 8 : 8 burpees contrôlés + 10 cal row + 12 light DB push press.";
  if(day==="mardi")return "EMOM 8 : min 1 = 12 cal SkiErg/row, min 2 = 12 ring rows stricts.";
  if(day==="jeudi")return "AMRAP 7 : 10 cal bike + 10 box step-ups + 10 KB swings.";
  if(day==="vendredi")return "AMRAP 12 : 8 hang power cleans légers + 10 wall balls 14 lb + 12 cal row.";
  return "AMRAP 10 simple.";
}

function buildWorkout(day,week){var d=baseDays[day],cfg=focus(),i=Math.max(0,Math.min(3,week-1));var progress=d.progress.slice();
if(state.cycle.goal==="shoulders3d"){
  if(day==="lundi")progress=["strictPress","lateralRaise","rearDeltFly","ropePushdown"];
  if(day==="mardi")progress=["chestRow","rearDeltFly","facePull"];
  if(day==="jeudi")progress=["frontSquat","lateralRaise"];
  if(day==="vendredi")progress=["powerClean","pushPress","lateralRaise","farmerCarry"];
}
if(state.cycle.goal==="weightlifting"&&day==="vendredi")progress=["powerClean","frontSquat","strictPress"];
if(state.cycle.goal==="posture"&&day==="lundi")progress=["bench","chestRow","inclineDb"];var blocks=[{time:"8 min",title:"Warm-up",text:d.warmup,tag:"Préparation",progress:[],kind:"warmup"},{time:"25 min",title:"Bloc principal",text:movements[progress[0]].name+" "+cfg.sets[i]+".",tag:"Charge",progress:[progress[0]],kind:"main"},{time:state.cycle.goal==="engine"?"7 min":"12 min",title:"Accessoires",text:accessoryText(d),tag:"Accessoires",progress:progress.slice(1),kind:"accessory"},{time:state.cycle.goal==="engine"?"15 min":"10 min",title:"WOD",text:wodForDay(day),tag:"Conditioning",progress:wodProgress(day),kind:"wod"},{time:state.cycle.goal==="engine"?"0–5 min":"5 min",title:"Mobilité",text:mobilityText(),tag:"Reset",progress:[],kind:"mobility"}];return{day:d,blocks:blocks,progress:progress};}
function accessoryText(d){var g=state.cycle.goal;if(g==="hypertrophy")return d.accessory+" — 10–15 reps, tempo contrôlé.";if(g==="shoulders3d")return shouldersAccessoryText(state.day);if(g==="strength")return d.accessory+" — 6–10 reps, lourd et simple.";if(g==="weightlifting")return"Positions haltéro + tirage technique + stabilité.";if(g==="posture")return d.accessory+" — ratio pull/push élevé, thorax ouvert.";if(g==="engine")return d.accessory+" — minimum efficace.";if(g==="maintenance")return d.accessory+" — léger, propre, aucun échec.";return d.accessory+" — densité et repos courts.";}
function mobilityText(){var g=state.cycle.goal;if(g==="posture")return"Extension thoracique + respiration cage ouverte.";if(g==="weightlifting")return"Front rack, chevilles, thoracique.";if(g==="maintenance")return"Mobilité plus longue + respiration nasale.";return"Mobilité ciblée + retour au calme.";}
function wodProgress(day){if(day==="vendredi")return["dbSnatch"];if(day==="lundi")return["strictPress"];return[];}
function resultDelta(status,rpe,quality){rpe=Number(rpe)||8;if(state.week===4)return 0;if(status==="pain")return -10;if(status==="fail")return -5;if(quality==="doubtful")return 0;if(status==="hard"||rpe>=9)return 0;if(status==="success_easy"&&rpe<=7&&quality==="clean")return 10;if(status==="success"&&rpe<=8&&quality!=="doubtful")return 5;return 0;}
function shouldUpdate(status,load,reps,quality){
  var goodStatus=["success_easy","success","hard"].indexOf(status)>=0;
  var validLoad=(load!==null && load!==undefined && !isNaN(load));
  var validReps=(Number(reps)>0);
  var goodTechnique=(quality!=="doubtful");
  return goodStatus && validLoad && validReps && goodTechnique;
}
function renderWeeks(){var w=$("weekButtons");w.innerHTML="";Object.keys(weekInfo).forEach(function(k){var b=document.createElement("button");b.textContent=weekInfo[k].label;b.className=Number(k)===state.week?"":"secondary";b.onclick=function(){state.week=Number(k);save();render();};w.appendChild(b);});$("weekGoal").textContent=weekInfo[state.week].goal;$("cycleSummary").textContent="Focus : "+focus().label+" — "+focus().impact;}
function renderDays(){var w=$("dayButtons");w.innerHTML="";Object.keys(baseDays).forEach(function(k){var d=baseDays[k];var b=document.createElement("button");b.textContent=d.label+" — "+d.base;b.className=k===state.day?"":"secondary";b.onclick=function(){state.day=k;save();render();};w.appendChild(b);});}
function renderWorkout(){var w=buildWorkout(state.day,state.week);$("workoutTitle").textContent=weekInfo[state.week].label+" — "+w.day.label+" — "+w.day.base;$("workoutFocus").textContent=w.day.focus;$("focusImpact").textContent="Benchmark = capacité connue. L’app propose une charge d’entraînement sous-maximale, pas un PR à répéter.";var c=$("blocks");c.innerHTML="";w.blocks.forEach(function(b){var div=document.createElement("div");div.className="block";var html='<div class="time">'+b.time+'</div><div><h3>'+b.title+'</h3><p>'+b.text+'</p><span class="tag">'+b.tag+'</span><span class="focus-pill">'+focus().tag+'</span>';if(b.progress&&b.progress.length){b.progress.forEach(function(mvKey,idx){var reps=targetReps(idx,b.kind);var suggested=suggestLoad(mvKey,progressionPct(idx),reps);html+=resultBoxHtml(mvKey,idx,suggested,reps,b.kind);});}html+="</div>";div.innerHTML=html;c.appendChild(div);});$("progressionAdvice").textContent="Si qualité douteuse : aucune progression, même si réussi.";}
function resultBoxHtml(mvKey,idx,suggested,reps,kind){var mv=movements[mvKey]||{name:mvKey};var key=refKey(mvKey,reps);var ref=state.movementRefs[key];var refText=ref?("Benchmark "+repRangeLabel(repRange(reps))+" : "+ref.load+" lb x "+ref.reps+" | "+ref.quality+" | "+ref.date+" → charge sous-maximale"):("Aucune référence pour "+repRangeLabel(repRange(reps))+" → fallback profil/PR si disponible");return '<div class="result-box" data-movement="'+mvKey+'" data-reps="'+reps+'"><div class="result-title">'+mv.name+'</div><span class="load-pill">'+lb(suggested)+' x '+reps+' | repos '+restFor(kind)+'</span><p class="muted">'+refText+'</p><div class="result-grid"><label>Charge<input class="actual" type="text" placeholder="'+lb(suggested)+'"></label><label>Reps<input class="reps" type="number" min="1" value="'+reps+'"></label><label>RPE<input class="rpe" type="number" min="1" max="10" value="8"></label><label>Résultat<select class="status"><option value="success">Réussi</option><option value="success_easy">Facile</option><option value="hard">Difficile</option><option value="fail">Échoué</option><option value="pain">Douleur</option></select></label><label>Technique<select class="quality"><option value="clean">Propre</option><option value="acceptable">Acceptable</option><option value="doubtful">Douteuse</option></select></label><label>Note<input class="note" type="text" placeholder="optionnel"></label></div></div>';}
function saveResults(){
  var boxes=document.querySelectorAll(".result-box");
  var session={date:new Date().toLocaleDateString("fr-CA"),week:state.week,day:state.day,focus:state.cycle.goal,results:[]};
  var updatedCount=0;

  boxes.forEach(function(box){
    var mvKey=box.getAttribute("data-movement");
    var actual=box.querySelector(".actual").value.trim();
    var reps=Number(box.querySelector(".reps").value)||0;
    var rpe=Number(box.querySelector(".rpe").value)||8;
    var status=box.querySelector(".status").value;
    var quality=box.querySelector(".quality").value;
    var note=box.querySelector(".note").value.trim();
    var load=parseLoad(actual);
    var delta=resultDelta(status,rpe,quality);
    var accepted=shouldUpdate(status,load,reps,quality);
    var key=refKey(mvKey,reps);

    if(accepted){
      state.movementRefs[key]={
        movement:mvKey,
        range:repRange(reps),
        load:load,
        reps:reps,
        date:session.date,
        lastActual:load,
        status:status,
        quality:quality,
        rpe:rpe,
        note:note,
        plannedDelta:delta
      };
      updatedCount++;
    }

    session.results.push({
      movement:mvKey,
      name:(movements[mvKey]||{}).name||mvKey,
      range:repRange(reps),
      actual:actual,
      reps:reps,
      rpe:rpe,
      status:status,
      quality:quality,
      note:note,
      delta:delta,
      referenceUpdated:accepted
    });
  });

  state.history.push(session);
  save();
  render();
  alert("Résultats sauvegardés. Références mises à jour : "+updatedCount+".");
}
function renderProfile(){var map=profileMap();Object.keys(map).forEach(function(id){$(id).value=state.profile[map[id]]||"";});$("trainingMaxPct").value=String(state.trainingMaxPct);}
function profileMap(){return{prBench:"bench",prFrontSquat:"frontSquat",prStrictPress:"strictPress",prPowerClean:"powerClean",prBackSquat5RM:"backSquat5RM",prHipThrust8RM:"hipThrust8RM",prBulgarianDB:"bulgarianDb",prDbRdl:"dbRdl",prRow8RM:"row8RM",prChestRow8RM:"chestRow8RM",prLatPulldown10RM:"latPulldown10RM",prInclineDb10RM:"inclineDb10RM"};}
function saveProfile(){var map=profileMap();Object.keys(map).forEach(function(id){state.profile[map[id]]=Number($(id).value)||0;});state.trainingMaxPct=Number($("trainingMaxPct").value);save();render();alert("Profil sauvegardé.");}
function renderCycle(){$("cycleGoal").value=state.cycle.goal;renderFocusDetails();}
function renderFocusDetails(){var cfg=focus();$("focusDetails").innerHTML="<strong>"+cfg.label+"</strong><br>"+cfg.impact+"<br><br><strong>Reps :</strong> "+cfg.sets.join(" / ")+"<br><strong>Tag :</strong> "+cfg.tag;}
function saveCycle(){state.cycle.goal=$("cycleGoal").value;save();render();alert("Cycle sauvegardé.");}
function newCycle(){if(confirm("Démarrer un nouveau cycle? Les références restent.")){state.week=1;save();switchView("training");render();}}

function rebuildReferencesFromHistory(){
  var changed=false;
  if(!state.history || !state.history.length){return false;}
  state.history.forEach(function(session){
    if(!session.results){return;}
    session.results.forEach(function(r){
      var load=parseLoad(r.actual);
      var reps=Number(r.reps)||0;
      var quality=r.quality||"clean";
      if(shouldUpdate(r.status,load,reps,quality)){
        var key=refKey(r.movement,reps);
        state.movementRefs[key]={
          movement:r.movement,
          range:repRange(reps),
          load:load,
          reps:reps,
          date:session.date||new Date().toLocaleDateString("fr-CA"),
          lastActual:load,
          status:r.status,
          quality:quality,
          rpe:Number(r.rpe)||8,
          note:"Reconstruit depuis historique V27"
        };
        r.referenceUpdated=true;
        changed=true;
      }
    });
  });
  if(changed){save();}
  return changed;
}

function renderReferences(){var c=$("referencesList");c.innerHTML="";Object.keys(movements).forEach(function(mvKey){["strength","hypertrophy","endurance"].forEach(function(range){var key=mvKey+"__"+range;var ref=state.movementRefs[key];var div=document.createElement("div");div.className="calc-item";div.innerHTML="<strong>"+movements[mvKey].name+" — "+repRangeLabel(range)+"</strong><span>"+(ref?(ref.load+" lb x "+ref.reps):"—")+"</span><p class='muted'>"+(ref?("Réel : "+ref.lastActual+" lb x "+ref.reps+" | RPE "+ref.rpe+" | "+ref.quality+" | "+ref.date):"Aucune référence")+"</p>";c.appendChild(div);});});}
function resetRefs(){if(confirm("Réinitialiser toutes les références?")){state.movementRefs={};save();renderReferences();renderWorkout();}}
function renderHistory(){var h=$("history");h.innerHTML="";if(!state.history.length){h.innerHTML='<p class="muted">Aucune séance sauvegardée.</p>';return;}state.history.slice().reverse().forEach(function(s){var div=document.createElement("div");div.className="history-item";var html="<strong>"+s.date+" — S"+s.week+" — "+baseDays[s.day].label+" — "+baseDays[s.day].base+"</strong><p>Focus : "+s.focus+"</p>";s.results.forEach(function(r){html+="<p>"+r.name+" — "+r.actual+" x "+r.reps+" | "+repRangeLabel(r.range)+" | RPE "+r.rpe+" | "+r.status+" | tech "+r.quality+" | réf "+(r.referenceUpdated?"mise à jour":"non modifiée")+"</p>";});div.innerHTML=html;h.appendChild(div);});}
function movementLines(block){
  var lines=[];
  if(block.progress&&block.progress.length){
    block.progress.forEach(function(mvKey,j){
      var reps=targetReps(j,block.kind);
      lines.push({
        name:movements[mvKey].name,
        reps:reps,
        sets:setScheme(block.kind,j),
        load:lb(suggestLoad(mvKey,progressionPct(j),reps)),
        rest:restFor(block.kind)
      });
    });
  }else{
    lines.push({name:block.text,reps:"—",sets:"—",load:"—",rest:restFor(block.kind)});
  }
  return lines;
}

function cleanExportLine(s){
  return String(s||"").replace(/\s+/g," ").trim();
}
function loadSourceText(mvKey,reps){
  var key=refKey(mvKey,reps);
  var ref=state.movementRefs[key];
  if(ref && ref.load !== undefined && ref.load !== null && ref.load !== ""){
    return repRangeLabel(repRange(reps))+" : "+ref.load+" lb x "+ref.reps;
  }
  return "profil/PR";
}
function stableIphoneText(day,week){
  day=day||state.day;
  week=week||state.week;
  var w=buildWorkout(day,week);
  var txt="";

  txt+=w.day.label.toUpperCase()+" - "+w.day.base.toUpperCase()+" - SEMAINE "+week+"\n";
  txt+="Focus: "+focus().label+"\n";
  txt+="Duree: 60 min\n\n";

  w.blocks.forEach(function(b){
    txt+=b.title.toUpperCase()+" ("+b.time+")\n";

    if(b.progress && b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        var load=lb(suggestLoad(mvKey,progressionPct(j),reps));
        var format=setScheme(b.kind,j);
        txt+=movements[mvKey].name+"\n";
        txt+="Format: "+format+"\n";
        txt+="Poids: "+load+"\n";
        txt+="Repos: "+restFor(b.kind)+"\n\n";
      });
    } else {
      txt+=cleanExportLine(b.text)+"\n";
      if(restFor(b.kind)!=="—"){
        txt+="Repos: "+restFor(b.kind)+"\n";
      }
      txt+="\n";
    }
  });

  txt+="APRES LA SEANCE\n";
  txt+="Charge reelle:\n";
  txt+="Reps:\n";
  txt+="RPE:\n";
  txt+="Technique: propre / acceptable / douteuse\n";

  return txt;
}
function stableWeekIphoneText(){
  var txt="SEMAINE "+state.week+" - "+focus().label+"\n\n";
  ["lundi","mardi","jeudi","vendredi"].forEach(function(d){
    txt+=stableIphoneText(d,state.week)+"\n";
    txt+="--------------------\n\n";
  });
  return txt;
}

function shortText(day,week){return stableIphoneText(day,week);}
function workoutText(day,week){return stableIphoneText(day,week);}
function weekText(){return stableWeekIphoneText();}
function historyText(){var txt="HISTORIQUE COACH BERTIN\\n\\n";state.history.forEach(function(s){txt+=s.date+" — S"+s.week+" — "+baseDays[s.day].label+"\\n";s.results.forEach(function(r){txt+="- "+r.name+" | "+r.actual+" x "+r.reps+" | "+repRangeLabel(r.range)+" | RPE "+r.rpe+" | "+r.status+" | tech "+r.quality+"\\n";});txt+="\\n";});return txt;}
function aiAnalysis(){var total=0,success=0,fail=0,pain=0,doubtful=0;state.history.forEach(function(s){s.results.forEach(function(r){total++;if(["success_easy","success","hard"].indexOf(r.status)>=0)success++;if(r.status==="fail")fail++;if(r.status==="pain")pain++;if(r.quality==="doubtful")doubtful++;});});if(!total)return{scores:{Résultats:0,Réussite:"—"},suggestions:[{type:"warning",title:"Pas assez de données",text:"Sauvegarde des résultats avec charge, reps et qualité."}],summary:"Pas assez de données."};var suggestions=[];if(doubtful>0)suggestions.push({type:"warning",title:"Technique douteuse",text:"Les séries douteuses ne devraient pas augmenter les références."});if(fail>=2)suggestions.push({type:"warning",title:"Échecs répétés",text:"Baisse ou verrouille les mouvements échoués."});if(pain>0)suggestions.push({type:"critical",title:"Douleur signalée",text:"Ne construis pas de référence sur un mouvement douloureux."});if(!suggestions.length)suggestions.push({type:"good",title:"Données propres",text:"Les références par plage de reps sont exploitables."});var scores={Résultats:total,Réussite:Math.round(success/total*100)+"%",Échecs:fail,Douleurs:pain,"Technique douteuse":doubtful};var summary="Analyse V18\\nRésultats : "+total+"\\nRéussite : "+scores.Réussite+"\\nÉchecs : "+fail+"\\nDouleurs : "+pain+"\\nTechnique douteuse : "+doubtful+"\\n\\n";suggestions.forEach(function(s,i){summary+=(i+1)+". "+s.title+" — "+s.text+"\\n";});return{scores:scores,suggestions:suggestions,summary:summary};}
function renderAI(){var a=aiAnalysis(),cards=$("aiScoreCards");cards.innerHTML="";Object.keys(a.scores).forEach(function(k){var d=document.createElement("div");d.className="calc-item";d.innerHTML="<strong>"+k+"</strong><span>"+a.scores[k]+"</span>";cards.appendChild(d);});var list=$("aiSuggestions");list.innerHTML="";a.suggestions.forEach(function(s){var d=document.createElement("div");d.className="ai-item "+s.type;d.innerHTML="<strong>"+s.title+"</strong>"+s.text;list.appendChild(d);});$("aiSummary").textContent=a.summary;}
function exportBackup(){var data={version:"V18",exportedAt:new Date().toISOString(),state:state};download("coach-bertin-backup-v18.json",JSON.stringify(data,null,2));}
function importBackup(file){if(!file)return;var reader=new FileReader();reader.onload=function(){try{var data=JSON.parse(reader.result);var s=data.state||data;state=s;state.profile=Object.assign(copy(defaultProfile),state.profile||{});state.cycle=Object.assign({goal:"hypertrophy"},state.cycle||{});state.movementRefs=state.movementRefs||{};state.history=state.history||[];save();render();alert("Backup importé.");}catch(e){alert("Fichier invalide.");}};reader.readAsText(file);}

function renderPhoneWod(){
  var el=$("phoneWod");
  if(!el){return;}
  var w=buildWorkout(state.day,state.week);
  var html="";
  html+='<div class="phone-card">';
  html+='<h1 class="phone-title">'+w.day.label.toUpperCase()+' - '+w.day.base.toUpperCase()+'</h1>';
  html+='<p class="phone-subtitle">Semaine '+state.week+' | '+focus().label+' | 60 min</p>';
  html+='</div>';

  w.blocks.forEach(function(b){
    html+='<div class="phone-card">';
    html+='<h2 class="phone-block-title">'+b.title.toUpperCase()+' ('+b.time+')</h2>';

    if(b.progress && b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        var load=lb(suggestLoad(mvKey,progressionPct(j),reps));
        var format=setScheme(b.kind,j);
        html+='<p class="phone-move">'+movements[mvKey].name+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Format:</span> '+format+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Poids:</span> '+load+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Repos:</span> '+restFor(b.kind)+'</p>';
      });
    } else {
      html+='<p class="phone-wod-text">'+cleanExportLine(b.text)+'</p>';
      var rest=restFor(b.kind);
      if(rest!=="—"){
        html+='<p class="phone-line"><span class="phone-label">Repos:</span> '+rest+'</p>';
      }
    }
    html+='</div>';
  });

  html+='<div class="phone-card phone-after">';
  html+='<h2 class="phone-block-title">APRÈS</h2>';
  html+='<p>Charge réelle :</p>';
  html+='<p>Reps :</p>';
  html+='<p>RPE :</p>';
  html+='<p>Technique : propre / acceptable / douteuse</p>';
  html+='</div>';

  el.innerHTML=html;
}

function download(name,text){var blob=new Blob([text],{type:"text/plain;charset=utf-8"});if(name.endsWith(".json"))blob=new Blob([text],{type:"application/json;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}
function resetHistory(){if(confirm("Effacer historique?")){state.history=[];save();renderHistory();renderAI();}}
function switchView(v){["training","phone","profile","cycle","references","backup","history","ai"].forEach(function(x){$(x+"View").classList.toggle("hidden",v!==x);$(x+"Tab").classList.toggle("active",v===x);});if(v==="phone")renderPhoneWod();if(v==="profile")renderProfile();if(v==="cycle")renderCycle();if(v==="references")renderReferences();if(v==="history")renderHistory();if(v==="ai")renderAI();}
function bind(){["training","phone","profile","cycle","references","backup","history","ai"].forEach(function(v){$(v+"Tab").onclick=function(){switchView(v);};});$("saveBtn").onclick=saveResults;$("phoneViewBtn").onclick=function(){switchView("phone");renderPhoneWod();};$("backTrainingBtn").onclick=function(){switchView("training");};$("copyPhoneBtn").onclick=function(){navigator.clipboard.writeText(stableIphoneText()).then(function(){alert("Texte copié.");}).catch(function(){alert("Copie bloquée.");});};$("saveProfileBtn").onclick=saveProfile;$("saveCycleBtn").onclick=saveCycle;$("newCycleBtn").onclick=newCycle;$("resetRefsBtn").onclick=resetRefs;$("resetHistoryBtn").onclick=resetHistory;$("copyIphoneBtn").onclick=function(){navigator.clipboard.writeText(stableIphoneText()).then(function(){alert("WOD copié pour iPhone.");}).catch(function(){alert("Copie bloquée.");});};$("exportIphoneBtn").onclick=function(){download("wod-iphone.txt",stableIphoneText());};$("exportTodayBtn").onclick=function(){download("coach-bertin-seance.txt",workoutText());};$("exportWeekBtn").onclick=function(){download("coach-bertin-semaine.txt",weekText());};$("exportHistoryBtn").onclick=function(){download("coach-bertin-historique.txt",historyText());};$("exportAiBtn").onclick=function(){download("coach-bertin-analyse.txt",aiAnalysis().summary);};$("exportBackupBtn").onclick=exportBackup;$("importBackupFile").onchange=function(e){importBackup(e.target.files[0]);};$("cycleGoal").onchange=function(){state.cycle.goal=$("cycleGoal").value;save();render();};}
function render(){renderWeeks();renderDays();renderWorkout();renderHistory();renderAI();}
load();rebuildReferencesFromHistory();bind();render();
