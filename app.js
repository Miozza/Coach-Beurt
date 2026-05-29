
var weekInfo={1:{label:"Semaine 1",goal:"Base technique : repères propres."},2:{label:"Semaine 2",goal:"Progression : plus de volume ou densité."},3:{label:"Semaine 3",goal:"Intensité : semaine la plus lourde."},4:{label:"Semaine 4",goal:"Deload actif : récupération et qualité."}};
var focusConfigs={
hypertrophy:{label:"Hypertrophie utile",impact:"Augmente reps/accessoires, WOD court.",sets:["4 x 8","4 x 8","5 x 5","3 x 8 tempo"],targetReps:[8,8,5,8],mult:[0.65,0.68,0.72,0.55],rest:"1:30–2:00",tag:"plus de muscle"},
shoulders3d:{label:"Épaules 3D",impact:"Priorité épaules rondes sans surcharger les tendons : 2 vraies doses de deltoïde latéral, plus arrière d’épaule, trap inférieur, serratus et triceps. Press sous-maximal, CrossFit conservé.",sets:["4 x 10","4 x 10","5 x 8","3 x 10 léger"],targetReps:[10,10,8,10],mult:[0.58,0.62,0.66,0.50],rest:"1:15–1:45",tag:"épaules 3D"},
strength:{label:"Force",impact:"Plus lourd, moins de volume inutile, repos longs.",sets:["5 x 5","5 x 4","6 x 3","3 x 5 léger"],targetReps:[5,4,3,5],mult:[0.75,0.80,0.86,0.60],rest:"2:00–2:30",tag:"plus lourd"},
weightlifting:{label:"Haltérophilie",impact:"Technique olympique, vitesse, positions, réception propre.",sets:["8 x 2 technique","EMOM 10 x 2","8 x 1–2 lourd propre","5 x 2 léger"],targetReps:[2,2,2,2],mult:[0.62,0.68,0.78,0.55],rest:"1:15–2:00",tag:"technique + vitesse"},
posture:{label:"Posture / cyphose",impact:"Plus de tirage, serratus, trap inférieur, mobilité thoracique.",sets:["4 x 6 propre","4 x 6 propre","5 x 4","3 x 6 tempo"],targetReps:[6,6,4,6],mult:[0.68,0.70,0.75,0.55],rest:"1:45–2:15",tag:"posture"},
engine:{label:"Endurance CrossFit",impact:"Force en maintien, WOD plus long, accessoires réduits.",sets:["3 x 5 maintien","3 x 5 maintien","4 x 3 maintien","2 x 5 léger"],targetReps:[5,5,3,5],mult:[0.65,0.68,0.72,0.55],rest:"1:30",tag:"moteur"},
recomp:{label:"Recomposition corporelle",impact:"Hypertrophie + densité, repos plus courts.",sets:["4 x 8","4 x 8","4 x 6","3 x 8"],targetReps:[8,8,6,8],mult:[0.62,0.65,0.70,0.55],rest:"1:15–1:45",tag:"densité"},
maintenance:{label:"Maintien / récupération",impact:"Charges basses, technique, mobilité, zone 2.",sets:["3 x 5 facile","3 x 5 facile","3 x 3 propre","2 x 5 léger"],targetReps:[5,5,3,5],mult:[0.55,0.58,0.62,0.50],rest:"1:30–2:00",tag:"récupération"}};
var defaultProfile={bench:300,frontSquat:215,strictPress:185,powerClean:225,backSquat5RM:235,hipThrust8RM:315,bulgarianDb:50,dbRdl:70,row8RM:185,chestRow8RM:160,latPulldown10RM:140,inclineDb10RM:55};
var movements={bench:{name:"Bench press",profile:"bench"},inclineDb:{name:"Incline DB press",profile:"inclineDb10RM"},strictPress:{name:"Strict press",profile:"strictPress"},chestRow:{name:"Chest-supported row",profile:"chestRow8RM"},barbellRow:{name:"Barbell row",profile:"row8RM"},latPulldown:{name:"Weighted pull-up",profile:null},frontSquat:{name:"Front squat",profile:"frontSquat"},hipThrust:{name:"Hip thrust",profile:"hipThrust8RM"},bulgarian:{name:"Bulgarian split squat",profile:"bulgarianDb"},powerClean:{name:"Power clean",profile:"powerClean"},dbSnatch:{name:"DB snatch",profile:null},farmerCarry:{name:"Farmer carry",profile:null},lateralRaise:{name:"Lateral raise",profile:null},rearDeltFly:{name:"Rear delt fly",profile:null},ropePushdown:{name:"Triceps rope pushdown",profile:null},facePull:{name:"Face pull",profile:null},pushPress:{name:"Push press léger",profile:"strictPress"}};
var estimatedDailyLoads={lateralRaise:25,rearDeltFly:25,ropePushdown:70,facePull:70,latPulldown:20,dbSnatch:50,farmerCarry:50};
var baseDays={lundi:{label:"Lundi",base:"Push",focus:"Pectoraux, épaules, triceps, serratus.",progress:["bench","inclineDb"],warmup:"Bike 3 min + band pull-aparts + wall slides + activation serratus.",accessory:"Incline DB press + lateral raise + serratus cable punch.",wod:"10 cal row + 10 DB push press léger + 8 burpees"},mardi:{label:"Mardi",base:"Pull",focus:"Dos, biceps, scapula, posture.",progress:["chestRow","latPulldown"],warmup:"Row 3 min + dead hang + scap pull-ups + band rows.",accessory:"Weighted pull-up + face pull + DB curls.",wod:"12 cal SkiErg + 12 ring rows stricts"},jeudi:{label:"Jeudi",base:"Legs",focus:"Jambes, fessiers, chaîne postérieure.",progress:["frontSquat","bulgarian"],warmup:"Bike 3 min + air squats + glute bridge + mobilité hanches.",accessory:"Bulgarian split squat + DB RDL.",wod:"12 cal bike + 12 KB swings + 10 box step-ups"},vendredi:{label:"Vendredi",base:"Full body",focus:"Moteur, transitions, puissance.",progress:["powerClean","strictPress"],warmup:"Row 3 min + mobilité hanches/épaules + ramp-up technique.",accessory:"Farmer carry + reverse fly + hollow hold.",wod:"30 wall balls + 30 cal row + 30 DB snatch alternés"}};
var wodBanks={push:["10 cal row + 10 DB push press + 8 burpees","12 cal row + 10 push-ups + 12 sit-ups","10 cal bike + 8 DB thrusters + 8 burpees"],pull:["12 cal SkiErg + 12 ring rows","10 cal row + 10 KB high pulls + 10 ring rows","40 cal row + 30 ring rows + 20 DB snatch"],legs:["12 cal bike + 12 KB swings + 10 box step-ups","14 cal bike + 12 goblet squats","50 cal bike + 40 KB swings + 30 step-ups"],weightlifting:["EMOM 10 : 2 power cleans légers","10 min qualité : 3 hang power clean + 6 burpees","8 min technique : clean pull + front squat léger"],engine:["AMRAP 14 : 10 wall balls + 12 cal row + 8 DB snatch","EMOM 16 : row/bike/ski/bodyweight","12 min pacing : bike + step-ups + ring rows"],lowimpact:["10 min bike zone 2","10 min row zone 2","AMRAP facile : 8 cal row + 8 air squats + 8 ring rows"]};
var KEY="coachBertinV28Shoulders3D";
var state={week:1,day:"lundi",history:[],profile:copy(defaultProfile),trainingMaxPct:0.925,cycle:{goal:"shoulders3d"},movementRefs:{"inclineDb__strength": {"movement": "inclineDb", "range": "strength", "load": 85, "reps": 5, "date": "préchargé", "lastActual": 85, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__hypertrophy": {"movement": "inclineDb", "range": "hypertrophy", "load": 60, "reps": 8, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__endurance": {"movement": "inclineDb", "range": "endurance", "load": 45, "reps": 15, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__strength": {"movement": "strictPress", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__hypertrophy": {"movement": "strictPress", "range": "hypertrophy", "load": 135, "reps": 8, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__endurance": {"movement": "strictPress", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__strength": {"movement": "chestRow", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__hypertrophy": {"movement": "chestRow", "range": "hypertrophy", "load": 115, "reps": 8, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__endurance": {"movement": "chestRow", "range": "endurance", "load": 95, "reps": 15, "date": "préchargé", "lastActual": 95, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__strength": {"movement": "barbellRow", "range": "strength", "load": 205, "reps": 5, "date": "préchargé", "lastActual": 205, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__hypertrophy": {"movement": "barbellRow", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__endurance": {"movement": "barbellRow", "range": "endurance", "load": 155, "reps": 15, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__strength": {"movement": "latPulldown", "range": "strength", "load": 45, "reps": 5, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__hypertrophy": {"movement": "latPulldown", "range": "hypertrophy", "load": 20, "reps": 8, "date": "préchargé", "lastActual": 20, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__strength": {"movement": "frontSquat", "range": "strength", "load": 224, "reps": 5, "date": "préchargé", "lastActual": 224, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__hypertrophy": {"movement": "frontSquat", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__endurance": {"movement": "frontSquat", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__strength": {"movement": "hipThrust", "range": "strength", "load": 315, "reps": 5, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__hypertrophy": {"movement": "hipThrust", "range": "hypertrophy", "load": 315, "reps": 8, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__endurance": {"movement": "hipThrust", "range": "endurance", "load": 265, "reps": 15, "date": "préchargé", "lastActual": 265, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__strength": {"movement": "bulgarian", "range": "strength", "load": 60, "reps": 5, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__hypertrophy": {"movement": "bulgarian", "range": "hypertrophy", "load": 40, "reps": 8, "date": "préchargé", "lastActual": 40, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__endurance": {"movement": "bulgarian", "range": "endurance", "load": 25, "reps": 15, "date": "préchargé", "lastActual": 25, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__strength": {"movement": "powerClean", "range": "strength", "load": 215, "reps": 5, "date": "préchargé", "lastActual": 215, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__hypertrophy": {"movement": "powerClean", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__endurance": {"movement": "powerClean", "range": "endurance", "load": 135, "reps": 15, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__strength": {"movement": "dbSnatch", "range": "strength", "load": 70, "reps": 5, "date": "préchargé", "lastActual": 70, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__hypertrophy": {"movement": "dbSnatch", "range": "hypertrophy", "load": 50, "reps": 8, "date": "préchargé", "lastActual": 50, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__endurance": {"movement": "dbSnatch", "range": "endurance", "load": 35, "reps": 15, "date": "préchargé", "lastActual": 35, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__strength": {"movement": "farmerCarry", "range": "strength", "load": 32, "reps": 5, "date": "préchargé", "lastActual": 32, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__hypertrophy": {"movement": "farmerCarry", "range": "hypertrophy", "load": 28, "reps": 8, "date": "préchargé", "lastActual": 28, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__endurance": {"movement": "farmerCarry", "range": "endurance", "load": 24, "reps": 15, "date": "préchargé", "lastActual": 24, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}}};
var EXTRA_PRELOADED_REFS={"bench__strength": {"movement": "bench", "range": "strength", "load": 265, "reps": 5, "date": "préchargé", "lastActual": 265, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bench__hypertrophy": {"movement": "bench", "range": "hypertrophy", "load": 215, "reps": 8, "date": "préchargé", "lastActual": 215, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bench__endurance": {"movement": "bench", "range": "endurance", "load": 185, "reps": 15, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}};
state.movementRefs=Object.assign(EXTRA_PRELOADED_REFS, {}, state.movementRefs||{}, EXTRA_PRELOADED_REFS);
function copy(o){return JSON.parse(JSON.stringify(o));} function $(id){return document.getElementById(id);}
function load(){try{var r=localStorage.getItem(KEY)||localStorage.getItem("coachBertinV16RepsReferences")||localStorage.getItem("coachBertinV15MovementProgression");if(r){var p=JSON.parse(r);state=Object.assign(state,p);state.profile=Object.assign(copy(defaultProfile),p.profile||{});state.cycle=Object.assign({goal:"hypertrophy"},p.cycle||{});state.movementRefs=Object.assign(EXTRA_PRELOADED_REFS, {"inclineDb__strength": {"movement": "inclineDb", "range": "strength", "load": 85, "reps": 5, "date": "préchargé", "lastActual": 85, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__hypertrophy": {"movement": "inclineDb", "range": "hypertrophy", "load": 60, "reps": 8, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "inclineDb__endurance": {"movement": "inclineDb", "range": "endurance", "load": 45, "reps": 15, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__strength": {"movement": "strictPress", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__hypertrophy": {"movement": "strictPress", "range": "hypertrophy", "load": 135, "reps": 8, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "strictPress__endurance": {"movement": "strictPress", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__strength": {"movement": "chestRow", "range": "strength", "load": 155, "reps": 5, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__hypertrophy": {"movement": "chestRow", "range": "hypertrophy", "load": 115, "reps": 8, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "chestRow__endurance": {"movement": "chestRow", "range": "endurance", "load": 95, "reps": 15, "date": "préchargé", "lastActual": 95, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__strength": {"movement": "barbellRow", "range": "strength", "load": 205, "reps": 5, "date": "préchargé", "lastActual": 205, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__hypertrophy": {"movement": "barbellRow", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "barbellRow__endurance": {"movement": "barbellRow", "range": "endurance", "load": 155, "reps": 15, "date": "préchargé", "lastActual": 155, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__strength": {"movement": "latPulldown", "range": "strength", "load": 45, "reps": 5, "date": "préchargé", "lastActual": 45, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "latPulldown__hypertrophy": {"movement": "latPulldown", "range": "hypertrophy", "load": 20, "reps": 8, "date": "préchargé", "lastActual": 20, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__strength": {"movement": "frontSquat", "range": "strength", "load": 224, "reps": 5, "date": "préchargé", "lastActual": 224, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__hypertrophy": {"movement": "frontSquat", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "frontSquat__endurance": {"movement": "frontSquat", "range": "endurance", "load": 115, "reps": 15, "date": "préchargé", "lastActual": 115, "status": "preloaded", "quality": "acceptable", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__strength": {"movement": "hipThrust", "range": "strength", "load": 315, "reps": 5, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__hypertrophy": {"movement": "hipThrust", "range": "hypertrophy", "load": 315, "reps": 8, "date": "préchargé", "lastActual": 315, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "hipThrust__endurance": {"movement": "hipThrust", "range": "endurance", "load": 265, "reps": 15, "date": "préchargé", "lastActual": 265, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__strength": {"movement": "bulgarian", "range": "strength", "load": 60, "reps": 5, "date": "préchargé", "lastActual": 60, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__hypertrophy": {"movement": "bulgarian", "range": "hypertrophy", "load": 40, "reps": 8, "date": "préchargé", "lastActual": 40, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "bulgarian__endurance": {"movement": "bulgarian", "range": "endurance", "load": 25, "reps": 15, "date": "préchargé", "lastActual": 25, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__strength": {"movement": "powerClean", "range": "strength", "load": 215, "reps": 5, "date": "préchargé", "lastActual": 215, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__hypertrophy": {"movement": "powerClean", "range": "hypertrophy", "load": 185, "reps": 8, "date": "préchargé", "lastActual": 185, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "powerClean__endurance": {"movement": "powerClean", "range": "endurance", "load": 135, "reps": 15, "date": "préchargé", "lastActual": 135, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__strength": {"movement": "dbSnatch", "range": "strength", "load": 70, "reps": 5, "date": "préchargé", "lastActual": 70, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__hypertrophy": {"movement": "dbSnatch", "range": "hypertrophy", "load": 50, "reps": 8, "date": "préchargé", "lastActual": 50, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "dbSnatch__endurance": {"movement": "dbSnatch", "range": "endurance", "load": 35, "reps": 15, "date": "préchargé", "lastActual": 35, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__strength": {"movement": "farmerCarry", "range": "strength", "load": 32, "reps": 5, "date": "préchargé", "lastActual": 32, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__hypertrophy": {"movement": "farmerCarry", "range": "hypertrophy", "load": 28, "reps": 8, "date": "préchargé", "lastActual": 28, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}, "farmerCarry__endurance": {"movement": "farmerCarry", "range": "endurance", "load": 24, "reps": 15, "date": "préchargé", "lastActual": 24, "status": "preloaded", "quality": "clean", "rpe": 8, "note": "Référence initiale fournie par Bertin"}}, p.movementRefs||{});}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
var CHARGE_KEY="coachBertinCustomChargesV34";
var wodTimer={duration:0,remaining:0,running:false,interval:null,label:""};
var customCharges={};
function loadCustomCharges(){try{customCharges=JSON.parse(localStorage.getItem(CHARGE_KEY)||"{}");}catch(e){customCharges={};}}
function saveCustomCharges(){try{localStorage.setItem(CHARGE_KEY,JSON.stringify(customCharges));}catch(e){}}
function chargeKeyFromName(name){return String(name||"").replace(/^[A-Z][0-9]?\.\s*/,"").trim();}
function officialCharges(){return window.DEFAULT_CHARGES||{};}
function charge(name,fallback){
  var key=chargeKeyFromName(name);
  var custom=customCharges[key];
  if(custom!==undefined && String(custom).trim()!==""){return String(custom).trim();}
  var official=officialCharges()[key];
  if(official!==undefined && String(official).trim()!==""){return String(official).trim();}
  return fallback||"—";
}
function displayChargeText(text){
  var t=String(text||"");
  t=t.replace(/Wall Ball 14 lb/g,"Wall Ball "+charge("Wall Ball","14 lb"));
  t=t.replace(/wall balls 14 lb/g,"wall balls "+charge("Wall Ball","14 lb"));
  t=t.replace(/Wall balls 14 lb/g,"Wall balls "+charge("Wall Ball","14 lb"));
  return t;
}
function chargeList(){
  var defs=officialCharges();
  var order=window.CHARGE_ORDER||Object.keys(defs);
  var seen={};
  var list=[];
  order.forEach(function(k){if(defs[k]!==undefined && !seen[k]){seen[k]=true;list.push(k);}});
  Object.keys(defs).forEach(function(k){if(!seen[k]){seen[k]=true;list.push(k);}});
  return list;
}
function renderChargeSettings(){
  var c=$("chargeSettingsList");
  if(!c){return;}
  c.innerHTML="";
  chargeList().forEach(function(key){
    var div=document.createElement("div");
    div.className="charge-row";
    var value=(customCharges[key]!==undefined)?customCharges[key]:"";
    var official=officialCharges()[key]||"—";
    div.innerHTML='<label>'+key+'<small>Base GitHub : '+official+'</small></label><input class="charge-input" data-charge-key="'+key+'" type="text" value="'+String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'" placeholder="'+String(official).replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'" />';
    c.appendChild(div);
  });
  Array.prototype.forEach.call(c.querySelectorAll("input[data-charge-key]"),function(inp){
    inp.addEventListener("change",function(){
      var key=inp.getAttribute("data-charge-key");
      var val=inp.value.trim();
      if(val){customCharges[key]=val;}else{delete customCharges[key];}
      saveCustomCharges();
      renderWorkout();
      if(!$('phoneView').classList.contains('hidden')){renderPhoneWod();}
    });
  });
}
function resetCustomCharges(){
  if(confirm("Réinitialiser les charges personnalisées de cet appareil?")){
    customCharges={};
    saveCustomCharges();
    renderChargeSettings();
    renderWorkout();
    if(!$('phoneView').classList.contains('hidden')){renderPhoneWod();}
  }
}

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
  if(estimatedDailyLoads[mvKey]){
    return {value:Number(estimatedDailyLoads[mvKey]), source:"estimate", ref:null};
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
  if(base.source==="estimate"){return base.value;}
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


function cycleRules(){
  return [
    "Aucun échec sur les mouvements principaux.",
    "Supersets seulement quand c’est indiqué.",
    "Lateral raise : brûlure oui, élan non.",
    "WOD lundi : pacing modéré, épaules déjà fatiguées.",
    "Vendredi : haltéro propre, pas de redline.",
    "Si douleur articulaire : baisse la charge, garde l’amplitude propre."
  ];
}
function rulesHtml(){return "<ul class='rules-list'>"+cycleRules().map(function(r){return "<li>"+r+"</li>";}).join("")+"</ul>";}
function parseTimeToSeconds(t){
  var m=String(t||"").match(/(\d+)\s*min/);
  return m?Number(m[1])*60:0;
}
function wodTimerConfig(block){
  var txt=String((block&&block.text)||"");
  var seconds=parseTimeToSeconds(block&&block.time);
  var label="Timer";
  var mode="down";
  if(/AMRAP/i.test(txt)){label="AMRAP "+Math.round(seconds/60)+" min";}
  else if(/EMOM/i.test(txt)){label="EMOM "+Math.round(seconds/60)+" min";}
  else if(/For time|Cap/i.test(txt)){label="CAP "+Math.round(seconds/60)+" min";mode="up";}
  if(!seconds){seconds=8*60;label="Timer 8 min";}
  return {seconds:seconds,label:label,mode:mode};
}
function formatClock(sec){
  sec=Math.max(0,Math.floor(sec||0));
  var m=Math.floor(sec/60),s=sec%60;
  return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
}
function timerHtml(block){
  var cfg=wodTimerConfig(block);
  var initial=cfg.mode==="up"?0:cfg.seconds;
  return '<div class="phone-timer" data-duration="'+cfg.seconds+'" data-label="'+cfg.label+'" data-mode="'+cfg.mode+'">'+
    '<div class="timer-main"><span class="timer-label">'+cfg.label+'</span><span id="timerDisplay" class="timer-display">'+formatClock(initial)+'</span></div>'+
    '<div class="timer-buttons"><button id="timerStartBtn" class="timer-btn">Start</button><button id="timerPauseBtn" class="timer-btn ghost">Pause</button><button id="timerResetBtn" class="timer-btn ghost">Reset</button></div>'+
  '</div>';
}
function stopTimer(){if(wodTimer.interval){clearInterval(wodTimer.interval);wodTimer.interval=null;}wodTimer.running=false;}
function timerCurrentValue(){return wodTimer.mode==="up"?wodTimer.elapsed:wodTimer.remaining;}
function updateTimerDisplay(){var d=document.getElementById("timerDisplay");if(d){d.textContent=formatClock(timerCurrentValue());}}
function resetTimerState(dur,mode,label){
  stopTimer();
  wodTimer.duration=dur;
  wodTimer.mode=mode||"down";
  wodTimer.label=label||"Timer";
  wodTimer.elapsed=0;
  wodTimer.remaining=dur;
}
function setupTimerControls(){
  var box=document.querySelector(".phone-timer");
  if(!box){stopTimer();return;}
  var dur=Number(box.getAttribute("data-duration"))||0;
  var mode=box.getAttribute("data-mode")||"down";
  var label=box.getAttribute("data-label")||"Timer";
  if(wodTimer.duration!==dur || wodTimer.mode!==mode || wodTimer.label!==label){resetTimerState(dur,mode,label);}
  updateTimerDisplay();
  var start=document.getElementById("timerStartBtn"),pause=document.getElementById("timerPauseBtn"),reset=document.getElementById("timerResetBtn");
  if(start){start.onclick=function(){
    if(wodTimer.running)return;
    wodTimer.running=true;
    wodTimer.interval=setInterval(function(){
      if(wodTimer.mode==="up"){
        wodTimer.elapsed=Math.min(wodTimer.duration,wodTimer.elapsed+1);
        updateTimerDisplay();
        if(wodTimer.elapsed>=wodTimer.duration){stopTimer();}
      }else{
        wodTimer.remaining=Math.max(0,wodTimer.remaining-1);
        updateTimerDisplay();
        if(wodTimer.remaining<=0){stopTimer();}
      }
    },1000);
  };}
  if(pause){pause.onclick=function(){stopTimer();updateTimerDisplay();};}
  if(reset){reset.onclick=function(){resetTimerState(dur,mode,label);updateTimerDisplay();};}
}
function enterFullscreen(){
  var el=document.documentElement;
  var fn=el.requestFullscreen||el.webkitRequestFullscreen||el.msRequestFullscreen;
  if(fn){try{var p=fn.call(el);if(p&&p.catch){p.catch(function(){});}}catch(e){}}
}

function shouldersWeekPlan(week){
  var plans={
    1:{label:"S1 Base",note:"Qualité, amplitude complète, aucun échec.",main:"4 x 10",mainRest:"2:00",wodNote:"Pacing propre"},
    2:{label:"S2 Volume",note:"Un peu plus de volume ou de densité, forme identique.",main:"5 x 8-10",mainRest:"2:00",wodNote:"Même rythme, transitions plus courtes"},
    3:{label:"S3 Intensité",note:"Semaine la plus solide : un peu plus lourd, jamais sale.",main:"5 x 8",mainRest:"2:15",wodNote:"Fort mais pas redline"},
    4:{label:"S4 Deload",note:"Réduis le volume, bouge bien, récupère les tendons.",main:"3 x 10 léger",mainRest:"1:45",wodNote:"Facile, technique"}
  };
  return plans[week]||plans[1];
}
function ex(name,format,load,rest,note){return {name:name,format:format,load:charge(name,load||"—"),rest:rest||"—",note:note||""};}
function shouldersBlocks(day,week){
  var p=shouldersWeekPlan(week);
  if(day==="lundi")return [
    {time:"8 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Row/Bike facile 3 min + PVC Pass Through 2 x 10 + Band Pull Apart 2 x 20 + Scap Push-up 2 x 10 + montée strict press : barre x10, 40% x5, 55% x5."},
    {time:"14 min",title:"A. Mouvement principal",tag:"Force",kind:"main",exercises:[ex("Strict Press",p.main,"S1 4 x 8 @ 115 lb | S2 5 x 8 @ 120 lb | S3 5 x 6-8 @ 125 lb | S4 3 x 8 @ 95-105 lb",p.mainRest,"Sous-maximal. Stop si compensation lombaire.")]},
    {time:"11 min",title:"B. Superset épaules",tag:"Superset",kind:"accessory",text:"Alterner B1 puis B2. Repos seulement après B2.",exercises:[ex("B1. Lateral Raise",week===4?"2-3 x 15-20":"4 x 15-20","25 lb","0:30 avant B2","Contrôle, pas d'élan."),ex("B2. Rear Delt Fly",week===4?"2-3 x 15-20":"4 x 15-20","25 lb","0:60 après B2","Arrière d’épaule, épaules basses.")]},
    {time:"11 min",title:"C. Superset triceps / santé épaule",tag:"Superset",kind:"accessory",text:"Alterner C1 puis C2. Repos seulement après C2.",exercises:[ex("C1. Triceps Rope Pushdown",week===4?"2-3 x 12-15":"4 x 12-15","70 lb","0:30 avant C2","Extension complète sans douleur coude."),ex("C2. Face Pull",week===4?"2-3 x 15-20":"4 x 15-20","70 lb","0:60 après C2","Tire vers les yeux, rotation externe.")]},
    {time:"8 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"AMRAP 8 : 8 burpees contrôlés + 10 cal row + 12 sit-ups. "+p.wodNote+". Pacing modéré : épaules déjà fatiguées, burpees propres. Objectif : moteur sans rajouter de press."},
    {time:"0-3 min",title:"E. Optionnel si temps",tag:"Bonus",kind:"bonus",text:"Band Pull Apart 2 x 30. Seulement si les épaules se sentent mieux après, pas plus irritées."},
    {time:"5 min",title:"F. Mobilité stratégique",tag:"Mobilité",kind:"mobility",text:"Doorway Pec Stretch 2 min + Lat Stretch sur rig 2 min + Triceps Overhead Stretch 1 min."}
  ];
  if(day==="mardi")return [
    {time:"8 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Row facile 3 min + Open Book 6/côté + Cat-Cow 10 reps + Scap Ring Row 2 x 8 + Band Face Pull 2 x 20 + 2 séries progressives de chest row."},
    {time:"13 min",title:"A. Mouvement principal",tag:"Dos",kind:"main",exercises:[ex("Chest Supported Row",week===1?"4 x 10":week===2?"5 x 10":week===3?"4 x 8":"3 x 10 léger",week===3?"125 lb":"115 lb","1:45-2:00","Tirage propre, pas de swing.")]},
    {time:"11 min",title:"B. Superset arrière d'épaule",tag:"Superset",kind:"accessory",text:"Alterner B1 puis B2. Ce bloc est prioritaire pour ta posture.",exercises:[ex("B1. Rear Delt Fly",week===4?"2-3 x 15":"4 x 15-20","25 lb","0:30 avant B2","Bras longs, trapèzes calmes."),ex("B2. Face Pull",week===4?"2-3 x 15":"4 x 15-20","70 lb","0:60 après B2","Finition en rotation externe.")]},
    {time:"9 min",title:"C. Superset scapulas",tag:"Posture",kind:"accessory",text:"Contrôle lent. Pas un bloc de cardio.",exercises:[ex("C1. Trap-3 Raise",week===4?"2 x 12":"3 x 15","léger","0:30 avant C2","Pouce vers le haut, trap inférieur."),ex("C2. Ring Row Strict",week===4?"2 x 8":"3 x 10","poids du corps","0:60 après C2","Corps gainé, poitrine aux anneaux.")]},
    {time:"10 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"EMOM 10 : min 1 = 12 cal row ; min 2 = 10 ring rows stricts. "+p.wodNote+"."},
    {time:"0-4 min",title:"E. Optionnel si temps",tag:"Bonus",kind:"bonus",text:"Farmer Carry 2-3 x 40 m lourd mais propre. Épaules basses, cage ouverte."},
    {time:"5 min",title:"F. Mobilité stratégique",tag:"Mobilité",kind:"mobility",text:"Child Pose Lat Stretch 2 min + Open Book lent 1 min/côté + Neck/Trap Stretch léger 1 min."}
  ];
  if(day==="jeudi")return [
    {time:"9 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Bike/Row facile 3 min + Ankle Rocks 10/côté + World's Greatest Stretch 5/côté + Glute Bridge 2 x 15 + Goblet Squat léger 2 x 10 + montée front squat : barre x8, 40% x5, 55% x5, 70% x3."},
    {time:"15 min",title:"A. Mouvement principal",tag:"Jambes",kind:"main",exercises:[ex("Front Squat",week===1?"5 x 5":week===2?"5 x 5":week===3?"5 x 4":"3 x 5 léger",week===1?"165 lb":week===2?"175 lb":week===3?"185 lb":"135-145 lb","2:00","Dos protégé, aucune tentative héroïque.")]},
    {time:"11 min",title:"B. Superset jambes",tag:"Superset",kind:"accessory",text:"Alterner B1 puis B2. Repos après B2.",exercises:[ex("B1. Bulgarian Split Squat",week===4?"2 x 8/jambe":"3 x 10/jambe","50 lb / main","0:30 avant B2","Amplitude propre, genou stable."),ex("B2. Standing Calf Raise",week===4?"2 x 15":"3 x 20","25 lb","0:60 après B2","Pause en haut, étirement en bas.")]},
    {time:"8 min",title:"C. Rappel épaules court",tag:"Pump",kind:"accessory",text:"Rappel rapide, pas une deuxième séance complète.",exercises:[ex("C1. Lateral Raise",week===4?"2 x 15":"3 x 20","20-25 lb","0:30 avant C2","Léger, propre."),ex("C2. Face Pull",week===4?"2 x 15":"3 x 20","60-70 lb","0:45 après C2","Posture et arrière d’épaule.")]},
    {time:"9 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"For time 21-15-9 : Wall Ball 14 lb + Cal Row. "+p.wodNote+". Cap 9 min."},
    {time:"0-3 min",title:"E. Optionnel si temps",tag:"Bonus",kind:"bonus",text:"Reverse Sled Drag 3 min continu, léger à modéré, sans brûler les jambes."},
    {time:"5 min",title:"F. Mobilité stratégique",tag:"Mobilité",kind:"mobility",text:"Couch Stretch 1 min/côté + Ankle Stretch contre mur 1 min/côté + Hamstring Stretch 1 min total."}
  ];
  return [
    {time:"10 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",text:"Row facile 3 min + Band Pull-Apart 2 x 20 + Wrist Stretch 1 min + Front Rack Elbow Rotations 10 reps + Lat Stretch 1 min/côté + Tall Muscle Clean 2 x 5 + High Pull 2 x 5 + montée power clean : barre x5, 40% x3, 55% x3, 65% x2."},
    {time:"14 min",title:"A. Technique haltéro",tag:"Haltéro",kind:"main",exercises:[ex("Power Clean",week===1?"6 x 3":week===2?"7 x 3":week===3?"8 x 2":"5 x 2 léger",week===1?"155 lb":week===2?"165 lb":week===3?"175 lb":"135 lb","1:30-2:00","Vitesse et réception propre. Pas de grind.")]},
    {time:"8 min",title:"B. Giant set épaules 3D",tag:"Giant set",kind:"accessory",text:"Enchaîner les 3 mouvements, puis repos. Court et propre.",exercises:[ex("B1. Lateral Raise",week===4?"2 rounds x 15":"3 rounds x 15","20-25 lb","—","Rappel léger seulement."),ex("B2. Rear Delt Fly",week===4?"2 rounds x 15":"3 rounds x 15","25 lb","—","Arrière d’épaule."),ex("B3. Face Pull",week===4?"2 rounds x 15":"3 rounds x 15","60-70 lb","0:75 après B3","Scapulas propres.")]},
    {time:"5 min",title:"C. Triceps",tag:"Accessoire",kind:"accessory",exercises:[ex("Overhead Rope Extension",week===4?"2 x 12":"3 x 15","50-60 lb","0:60","Longue portion du triceps, aucun pincement épaule.")]},
    {time:"12 min",title:"D. WOD",tag:"Conditioning",kind:"wod",text:"AMRAP 12 : 6 power cleans légers + 12 wall balls 14 lb + 12 cal row. "+p.wodNote+"."},
    {time:"0-3 min",title:"E. Optionnel si temps",tag:"Bonus",kind:"bonus",text:"Farmer Carry 2 x 40 m. Stop si la prise ou les trapèzes prennent toute la place."},
    {time:"5 min",title:"F. Mobilité stratégique",tag:"Mobilité",kind:"mobility",text:"Lat Stretch 2 min + Front Rack Stretch 1 min + PVC Overhead Hold 1 min + Wrist Stretch 1 min."}
  ];
}
function shouldersAccessoryText(day){return "Voir les blocs B et C.";}
function shouldersWodForDay(day){return (shouldersBlocks(day,state.week).filter(function(b){return b.kind==="wod";})[0]||{}).text||"AMRAP 10 simple.";}

function buildWorkout(day,week){
  var d=baseDays[day],cfg=focus(),i=Math.max(0,Math.min(3,week-1));
  if(state.cycle.goal==="shoulders3d"){
    return {day:d,blocks:shouldersBlocks(day,week),progress:[]};
  }
  var progress=d.progress.slice();
  if(state.cycle.goal==="weightlifting"&&day==="vendredi")progress=["powerClean","frontSquat","strictPress"];
  if(state.cycle.goal==="posture"&&day==="lundi")progress=["bench","chestRow","inclineDb"];
  var blocks=[{time:"8 min",title:"Warm-up",text:d.warmup,tag:"Préparation",progress:[],kind:"warmup"},{time:"25 min",title:"Bloc principal",text:movements[progress[0]].name+" "+cfg.sets[i]+".",tag:"Charge",progress:[progress[0]],kind:"main"},{time:state.cycle.goal==="engine"?"7 min":"12 min",title:"Accessoires",text:accessoryText(d),tag:"Accessoires",progress:progress.slice(1),kind:"accessory"},{time:state.cycle.goal==="engine"?"15 min":"10 min",title:"WOD",text:wodForDay(day),tag:"Conditioning",progress:wodProgress(day),kind:"wod"},{time:state.cycle.goal==="engine"?"0–5 min":"5 min",title:"Mobilité",text:mobilityText(),tag:"Reset",progress:[],kind:"mobility"}];
  return{day:d,blocks:blocks,progress:progress};
}
function accessoryText(d){var g=state.cycle.goal;if(g==="hypertrophy")return d.accessory+" — 10–15 reps, tempo contrôlé.";if(g==="shoulders3d")return shouldersAccessoryText(state.day);if(g==="strength")return d.accessory+" — 6–10 reps, lourd et simple.";if(g==="weightlifting")return"Positions haltéro + tirage technique + stabilité.";if(g==="posture")return d.accessory+" — ratio pull/push élevé, thorax ouvert.";if(g==="engine")return d.accessory+" — minimum efficace.";if(g==="maintenance")return d.accessory+" — léger, propre, aucun échec.";return d.accessory+" — densité et repos courts.";}
function mobilityText(){var g=state.cycle.goal;if(g==="posture")return"Extension thoracique + respiration cage ouverte.";if(g==="weightlifting")return"Front rack, chevilles, thoracique.";if(g==="maintenance")return"Mobilité plus longue + respiration nasale.";return"Mobilité ciblée + retour au calme.";}
function wodProgress(day){return[];}
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
function dayIntention(day){
  if(day==="lundi")return "Intention : vraie séance épaules/triceps. Une seule dose de deltoïde latéral, strict press sous-maximal, aucun échec articulaire.";
  if(day==="mardi")return "Intention : construire l’arrière d’épaule et la posture. Scapulas contrôlées, thorax ouvert, tirage propre sans ego.";
  if(day==="jeudi")return "Intention : jambes propres, dos protégé. Rappel épaules très court : pump, pas destruction.";
  if(day==="vendredi")return "Intention : garder l’haltéro et le CrossFit vivants. Push press technique, wall balls contrôlés, pas une compétition.";
  return "Intention : qualité avant intensité.";
}

function exerciseBoxHtml(e){
  var note=e.note?'<div class="readonly-note">'+e.note+'</div>':'';
  return '<div class="result-box readonly-box"><div class="result-title">'+e.name+'</div><span class="load-pill">'+e.format+' | '+e.load+' | repos '+e.rest+'</span>'+note+'</div>';
}
function renderWorkout(){
  var w=buildWorkout(state.day,state.week);
  var plan=state.cycle.goal==="shoulders3d"?shouldersWeekPlan(state.week):null;
  $("workoutTitle").textContent=weekInfo[state.week].label+" — "+w.day.label+" — "+w.day.base;
  $("workoutFocus").textContent=w.day.focus;
  $("focusImpact").innerHTML="<strong>"+dayIntention(state.day)+"</strong>"+(plan?"<br><strong>Progression :</strong> "+plan.label+" — "+plan.note:"")+"<br><br><strong>Règles du cycle :</strong>"+rulesHtml();
  var c=$("blocks");c.innerHTML="";
  w.blocks.forEach(function(b){
    var div=document.createElement("div");div.className="block";
    var html='<div class="time">'+b.time+'</div><div><h3>'+b.title+'</h3>'+(b.text?'<p>'+displayChargeText(b.text)+'</p>':'')+'<span class="tag">'+b.tag+'</span><span class="focus-pill">'+focus().tag+'</span>';
    if(b.exercises&&b.exercises.length){b.exercises.forEach(function(e){html+=exerciseBoxHtml(e);});}
    else if(b.progress&&b.progress.length){b.progress.forEach(function(mvKey,idx){var reps=targetReps(idx,b.kind);var suggested=suggestLoad(mvKey,progressionPct(idx),reps);html+=resultBoxHtml(mvKey,idx,suggested,reps,b.kind);});}
    html+="</div>";div.innerHTML=html;c.appendChild(div);
  });
  $("progressionAdvice").textContent=state.cycle.goal==="shoulders3d"?"Lis les blocs A à F dans l’ordre. Supersets seulement quand c’est écrit.":"Garde les poids suggérés comme repères.";
}
function resultBoxHtml(mvKey,idx,suggested,reps,kind){
  var mv=movements[mvKey]||{name:mvKey};
  var key=refKey(mvKey,reps);
  var ref=state.movementRefs[key];
  return '<div class="result-box readonly-box" data-movement="'+mvKey+'" data-reps="'+reps+'"><div class="result-title">'+mv.name+'</div><span class="load-pill">Poids suggéré : '+lb(suggested)+' x '+reps+' | repos '+restFor(kind)+'</span></div>';
}
function saveResults(){
  alert("Version lecture seule avec poids suggérés.");
}
function renderProfile(){var map=profileMap();Object.keys(map).forEach(function(id){$(id).value=state.profile[map[id]]||"";});$("trainingMaxPct").value=String(state.trainingMaxPct);renderChargeSettings();}
function profileMap(){return{prBench:"bench",prFrontSquat:"frontSquat",prStrictPress:"strictPress",prPowerClean:"powerClean",prBackSquat5RM:"backSquat5RM",prHipThrust8RM:"hipThrust8RM",prBulgarianDB:"bulgarianDb",prDbRdl:"dbRdl",prRow8RM:"row8RM",prChestRow8RM:"chestRow8RM",prLatPulldown10RM:"latPulldown10RM",prInclineDb10RM:"inclineDb10RM"};}
function saveProfile(){
  alert("Profil en lecture seule : les valeurs ne sont pas modifiables dans cette version.");
}
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

function renderReferences(){var c=$("referencesList");c.innerHTML="";Object.keys(movements).forEach(function(mvKey){["strength","hypertrophy","endurance"].forEach(function(range){var key=mvKey+"__"+range;var ref=state.movementRefs[key];var div=document.createElement("div");div.className="calc-item";div.innerHTML="<strong>"+movements[mvKey].name+" — "+repRangeLabel(range)+"</strong><span>"+(ref?(ref.load+" lb x "+ref.reps):"—")+"</span><p class='muted'>"+(ref?("Fixe : "+ref.lastActual+" lb x "+ref.reps+" | RPE "+ref.rpe+" | "+ref.quality+" | "+ref.date):"Aucune référence")+"</p>";c.appendChild(div);});});}
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
  txt+="Duree: 60 min\n";
  txt+=dayIntention(day)+"\n\n";

  w.blocks.forEach(function(b){
    txt+=b.title.toUpperCase()+" ("+b.time+")\n";

    if(b.exercises && b.exercises.length){
      if(b.text){txt+=cleanExportLine(displayChargeText(b.text))+"\n";}
      b.exercises.forEach(function(e){
        txt+=e.name+"\n";
        txt+="Format: "+e.format+"\n";
        txt+="Poids: "+e.load+"\n";
        txt+="Repos: "+e.rest+"\n";
        if(e.note){txt+="Note: "+e.note+"\n";}
        txt+="\n";
      });
    } else if(b.progress && b.progress.length){
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
      txt+=cleanExportLine(displayChargeText(b.text))+"\n";
      if(restFor(b.kind)!=="—"){
        txt+="Repos: "+restFor(b.kind)+"\n";
      }
      txt+="\n";
    }
  });

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
function historyText(){return "Version lecture seule : aucun historique de résultats n’est enregistré.\n";}
function aiAnalysis(){
  return {scores:{Mode:"Lecture seule",Résultats:"non enregistrés"},suggestions:[{type:"good",title:"Simple et robuste",text:"Les poids suggérés restent fixes."}],summary:"Version lecture seule avec poids suggérés."};
}
function renderAI(){var a=aiAnalysis(),cards=$("aiScoreCards");cards.innerHTML="";Object.keys(a.scores).forEach(function(k){var d=document.createElement("div");d.className="calc-item";d.innerHTML="<strong>"+k+"</strong><span>"+a.scores[k]+"</span>";cards.appendChild(d);});var list=$("aiSuggestions");list.innerHTML="";a.suggestions.forEach(function(s){var d=document.createElement("div");d.className="ai-item "+s.type;d.innerHTML="<strong>"+s.title+"</strong>"+s.text;list.appendChild(d);});$("aiSummary").textContent=a.summary;}
function exportBackup(){
  download("coach-bertin-programme-v34.json",JSON.stringify({version:"V34-charges-personnalisables",exportedAt:new Date().toISOString(),week:state.week,day:state.day,cycle:state.cycle},null,2));
}
function importBackup(file){alert("Import désactivé : cette version ne restaure pas de résultats.");}

function phoneWodLoadHints(text){
  var t=(text||"").toLowerCase();
  var hints=[];
  if(t.indexOf("db push press")>=0){hints.push("Light DB push press : "+charge("Light DB Push Press","35 lb / main"));}
  if(t.indexOf("hang power clean")>=0){hints.push("Hang power cleans légers : "+charge("Hang Power Clean","115-135 lb"));}
  if(t.indexOf("wall balls")>=0){hints.push("Wall balls : "+charge("Wall Ball","14 lb"));}
  if(t.indexOf("kb swings")>=0){hints.push("KB swings : "+charge("KB Swings","24 kg"));}
  if(!hints.length){return "";}
  var html='<div class="phone-exercise phone-hints"><p class="phone-move">Charges du WOD</p>';
  hints.forEach(function(h){html+='<p class="phone-line">'+h+'</p>';});
  html+='</div>';
  return html;
}

function renderPhoneWod(){
  var el=$("phoneWod");
  if(!el){return;}
  var w=buildWorkout(state.day,state.week);
  var html="";
  html+='<div class="phone-card">';
  html+='<h1 class="phone-title">'+w.day.label.toUpperCase()+' - '+w.day.base.toUpperCase()+'</h1>';
  html+='<p class="phone-subtitle">Semaine '+state.week+' | '+focus().label+' | 60 min</p>';
  html+='</div>';
  html+='<div class="phone-card phone-intention"><p class="phone-intention-title">INTENTION DU JOUR</p><p class="phone-wod-text">'+dayIntention(state.day)+'</p></div>';
  var plan=state.cycle.goal==="shoulders3d"?shouldersWeekPlan(state.week):null;
  if(plan){html+='<div class="phone-card phone-intention"><p class="phone-intention-title">PROGRESSION</p><p class="phone-wod-text">'+plan.label+' — '+plan.note+'</p></div>';}
  html+='<div class="phone-card phone-rules"><p class="phone-intention-title">RÈGLES DU CYCLE</p>'+rulesHtml()+'</div>';

  w.blocks.forEach(function(b){
    html+='<div class="phone-card">';
    html+='<h2 class="phone-block-title">'+b.title.toUpperCase()+' ('+b.time+')</h2>';
    if(b.kind==="wod"){
      html+='<p class="phone-wod-text">'+cleanExportLine(displayChargeText(b.text))+'</p>';
      html+=timerHtml(b);
      html+=phoneWodLoadHints(b.text);
    } else if(b.exercises && b.exercises.length){
      if(b.text){html+='<p class="phone-wod-text">'+cleanExportLine(displayChargeText(b.text))+'</p>';}
      b.exercises.forEach(function(e){
        html+='<div class="phone-exercise">';
        html+='<p class="phone-move">'+e.name+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Format:</span> '+e.format+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Poids suggéré:</span> '+e.load+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Repos:</span> '+e.rest+'</p>';
        if(e.note){html+='<p class="phone-line"><span class="phone-label">Note:</span> '+e.note+'</p>';}
        html+='</div>';
      });
    } else if(b.progress && b.progress.length){
      b.progress.forEach(function(mvKey,j){
        var reps=targetReps(j,b.kind);
        var load=lb(suggestLoad(mvKey,progressionPct(j),reps));
        var format=setScheme(b.kind,j);
        html+='<div class="phone-exercise">';
        html+='<p class="phone-move">'+movements[mvKey].name+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Format:</span> '+format+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Poids suggéré:</span> '+load+'</p>';
        html+='<p class="phone-line"><span class="phone-label">Repos:</span> '+restFor(b.kind)+'</p>';
        html+='</div>';
      });
    } else {
      html+='<p class="phone-wod-text">'+cleanExportLine(displayChargeText(b.text))+'</p>';
      var rest=restFor(b.kind);
      if(rest!=="—"){
        html+='<p class="phone-line"><span class="phone-label">Repos:</span> '+rest+'</p>';
      }
    }
    html+='</div>';
  });
  el.innerHTML=html;
  setupTimerControls();
}

function download(name,text){var blob=new Blob([text],{type:"text/plain;charset=utf-8"});if(name.endsWith(".json"))blob=new Blob([text],{type:"application/json;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}
function resetHistory(){if(confirm("Effacer historique?")){state.history=[];save();renderHistory();renderAI();}}
function switchView(v){["training","phone","profile","cycle","references","backup","history","ai"].forEach(function(x){$(x+"View").classList.toggle("hidden",v!==x);$(x+"Tab").classList.toggle("active",v===x);});if(v==="phone")renderPhoneWod();if(v==="profile")renderProfile();if(v==="cycle")renderCycle();if(v==="references")renderReferences();if(v==="history")renderHistory();if(v==="ai")renderAI();}
function bind(){["training","phone","profile","cycle","references","backup","history","ai"].forEach(function(v){$(v+"Tab").onclick=function(){switchView(v);};});$("saveBtn").onclick=saveResults;$("phoneViewBtn").onclick=function(){switchView("phone");renderPhoneWod();};$("backTrainingBtn").onclick=function(){switchView("training");};$("copyPhoneBtn").onclick=function(){navigator.clipboard.writeText(stableIphoneText()).then(function(){alert("Texte copié.");}).catch(function(){alert("Copie bloquée.");});};$("saveProfileBtn").onclick=saveProfile;if($("resetCustomChargesBtn")){$("resetCustomChargesBtn").onclick=resetCustomCharges;}if($("fullscreenBtn")){$("fullscreenBtn").onclick=enterFullscreen;}$("saveCycleBtn").onclick=saveCycle;$("newCycleBtn").onclick=newCycle;$("resetRefsBtn").onclick=resetRefs;$("resetHistoryBtn").onclick=resetHistory;$("copyIphoneBtn").onclick=function(){navigator.clipboard.writeText(stableIphoneText()).then(function(){alert("WOD copié pour iPhone.");}).catch(function(){alert("Copie bloquée.");});};$("exportIphoneBtn").onclick=function(){download("wod-iphone.txt",stableIphoneText());};$("exportTodayBtn").onclick=function(){download("coach-bertin-seance.txt",workoutText());};$("exportWeekBtn").onclick=function(){download("coach-bertin-semaine.txt",weekText());};$("exportHistoryBtn").onclick=function(){download("coach-bertin-historique.txt",historyText());};$("exportAiBtn").onclick=function(){download("coach-bertin-analyse.txt",aiAnalysis().summary);};$("exportBackupBtn").onclick=exportBackup;$("importBackupFile").onchange=function(e){importBackup(e.target.files[0]);};$("cycleGoal").onchange=function(){state.cycle.goal=$("cycleGoal").value;save();render();};}
function render(){renderWeeks();renderDays();renderWorkout();renderHistory();renderAI();}
load();loadCustomCharges();bind();render();
if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("service-worker.js").catch(function(){});});}
