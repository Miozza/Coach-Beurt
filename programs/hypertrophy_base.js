// Coach Bertin V48.2 — Phase 2 : Hypertrophie / Force Base (6 semaines)
// Objectif : masse générale, force de base, chaîne postérieure, densité musculaire jambes
// V48.2 : programme autonome. Les séances complètes vivent ici, pas dans app.js.

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.hypertrophy_base = {
  id: "hypertrophy_base",
  label: "Hypertrophie / Force Base — Phase 2",
  phase: 2,
  phaseName: "Construction masse + force",
  phaseEnd: "décembre 2025",
  nextPhase: "force_performance",
  impact: "Bench vers 285 lb, back squat vers 260 lb x5, chaîne postérieure (RDL, hip thrust), densité musculaire jambes pour tolérance lactique. Épaules maintenues.",
  weekLabels: ["S1 Base","S2 Volume","S3 Volume+","S4 Surcharge","S5 Intensité","S6 Deload"],
  weekGoals: [
    "Réintroduction charges sérieuses. Repères force. Dos protégé.",
    "Volume augmente. +5 lb principaux. RDL et hip thrust en place.",
    "Volume maximal. Densité jambes. Supersets postérieure.",
    "Charges les plus lourdes. Technique prioritaire. Bench lourd.",
    "Intensité maximale du cycle. Volume réduit. Qualité > tout.",
    "Deload. -40% volume. Récupération complète avant prochain cycle."
  ],
  sets: ["5 x 5","5 x 5","4 x 6","5 x 4","6 x 3","3 x 5 léger"],
  targetReps: [5,5,6,4,3,5],
  mult: [0.75,0.78,0.80,0.83,0.87,0.60],
  rest: "2:00–2:30",
  tag: "force base"
};

function hypertrophyWeekPlan(week){
  return({
    1:{label:"S1 Base",note:"Reprendre les repères. RPE 7-8. Aucun échec.",bench:"5×5",benchLoad:"225 lb",squat:"4×6",squatLoad:"185 lb",hinge:"3×10",wodNote:"facile à modéré"},
    2:{label:"S2 Volume",note:"Augmenter légèrement le volume. Charges solides, technique propre.",bench:"5×5",benchLoad:"230 lb",squat:"5×5",squatLoad:"195 lb",hinge:"4×10",wodNote:"modéré"},
    3:{label:"S3 Volume+",note:"Plus gros volume du cycle. Pump et densité, pas de grind.",bench:"4×6",benchLoad:"235 lb",squat:"5×5",squatLoad:"205 lb",hinge:"4×8-10",wodNote:"contrôlé"},
    4:{label:"S4 Surcharge",note:"Charges les plus sérieuses avant l'intensité. RPE 8-9 max.",bench:"5×4",benchLoad:"245 lb",squat:"5×4",squatLoad:"215 lb",hinge:"4×8",wodNote:"court, pas destructeur"},
    5:{label:"S5 Intensité",note:"Intensité maximale du cycle. Moins de volume, plus lourd.",bench:"6×3",benchLoad:"255 lb",squat:"5×3",squatLoad:"225 lb",hinge:"3×8",wodNote:"très court"},
    6:{label:"S6 Deload",note:"Baisser le volume et garder le mouvement. Préparer la phase force.",bench:"3×5 léger",benchLoad:"205 lb",squat:"3×5 léger",squatLoad:"165 lb",hinge:"2×10 léger",wodNote:"flush seulement"}
  })[week] || {label:"S1",note:"",bench:"5×5",benchLoad:"225 lb",squat:"4×6",squatLoad:"185 lb",hinge:"3×10",wodNote:"modéré"};
}

function hbEx(name,format,load,rest,note){return {name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function hypertrophyBlocks(day,week){
  var p = hypertrophyWeekPlan(week);
  var deload = week === 6;
  var heavy = week >= 4 && week <= 5;

  // LUNDI — Haut du corps lourd : bench + tirage
  if(day === "lundi") return [
    {time:"8 min",title:"Warm-up haut du corps",tag:"Préparation",kind:"warmup",
     text:"Bike ou row 3 min + band pull-aparts 2×20 + scap push-ups 2×10 + push-ups contrôlés 2×8 + ramp-up bench : barre ×10, 135×5, 185×3."},

    {time:"16 min",title:"A. Bench priorité",tag:"Force",kind:"main",
     exercises:[hbEx("Bench press",p.bench,p.benchLoad,heavy?"2:30-3:00":"2:00-2:30","Objectif force de base. Stop à RPE 9. Garde 1 rep en réserve.")]},

    {time:"13 min",title:"B. Superset lourd haut du corps",tag:"Superset",kind:"accessory",
     text:"Alterner B1 → B2. Repos après B2. Le tirage doit protéger les épaules et soutenir le bench.",
     exercises:[
       hbEx("B1. Incline DB press",deload?"2×10":"4×8-10",week>=4&&!deload?"65 lb / main":"60 lb / main","0:30 avant B2","Contrôle complet. Pas d'échec."),
       hbEx("B2. Chest Supported Row",deload?"2×10":"4×8-10",week>=4&&!deload?"125-135 lb":"115-125 lb","1:15 après B2","Tirage strict. Omoplates fortes.")
     ]},

    {time:"9 min",title:"C. Bras / épaules maintien",tag:"Hypertrophie",kind:"accessory",
     exercises:[
       hbEx("C1. Triceps Rope Pushdown",deload?"2×12":"3×12-15","60-70 lb","0:30","Pompe triceps, coude fixe."),
       hbEx("C2. Lateral Raise",deload?"2×15":"3×15-20","20-25 lb","0:45","Épaules maintenues, pas de trapèzes.")
     ]},

    {time:deload?"6 min":"8 min",title:"D. Finisher court",tag:"Conditioning",kind:"wod",
     text:(deload?"Bike 6 min zone 2 facile. ":"AMRAP 8 : 8 push-ups + 10 cal row + 12 sit-ups. ")+p.wodNote+". Le but est de garder le moteur sans nuire au bench."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Doorway pec stretch 1 min/côté + lat stretch 1 min/côté + respiration thoracique 1 min."}
  ];

  // MARDI — Bas du corps : squat + chaîne postérieure
  if(day === "mardi") return [
    {time:"9 min",title:"Warm-up bas du corps",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + ankle rocks 10/côté + goblet squat 2×10 + glute bridge 2×15 + ramp-up front squat : barre ×8, 135×5, 155×3."},

    {time:"16 min",title:"A. Squat force base",tag:"Jambes",kind:"main",
     exercises:[hbEx("Front Squat",p.squat,p.squatLoad,heavy?"2:30":"2:00","Dos protégé. Profondeur propre. Aucune tentative héroïque.")]},

    {time:"14 min",title:"B. Chaîne postérieure",tag:"Force base",kind:"accessory",
     text:"Priorité fessiers/ischios. Le bas du dos ne doit pas voler le mouvement.",
     exercises:[
       hbEx("B1. Hip Thrust",deload?"2×10":p.hinge,week>=4&&!deload?"275-315 lb":"245-275 lb","0:45 avant B2","Pause 1 sec en haut. Fessiers, pas lombaires."),
       hbEx("B2. DB RDL",deload?"2×10":"3×10","60-70 lb / main","1:15 après B2","Étirement ischios. Dos neutre.")
     ]},

    {time:"8 min",title:"C. Unilatéral",tag:"Accessoire",kind:"accessory",
     exercises:[hbEx("Bulgarian Split Squat",deload?"2×8/jambe":"3×8-10/jambe",deload?"35 lb / main":"45-55 lb / main","1:00","Stable, amplitude propre.")]},

    {time:deload?"6 min":"9 min",title:"D. Conditioning jambes contrôlé",tag:"Conditioning",kind:"wod",
     text:(deload?"Row 6 min facile zone 2.":"For time 3 rounds : 12 cal bike + 12 KB swings + 10 box step-ups. Cap 9 min.")+" "+p.wodNote+". Pas de redline."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Couch stretch 1 min/côté + hamstring stretch 1 min/côté + respiration 1 min."}
  ];

  // JEUDI — Haut du corps volume/posture
  if(day === "jeudi") return [
    {time:"8 min",title:"Warm-up dos / épaules",tag:"Préparation",kind:"warmup",
     text:"Row 3 min + dead hang 2×20 sec + band face pull 2×20 + wall slides 2×10 + 2 séries progressives de tirage."},

    {time:"14 min",title:"A. Tirage principal",tag:"Dos",kind:"main",
     exercises:[hbEx("Chest Supported Row",deload?"3×8 léger":week>=4?"5×6-8":"4×8-10",deload?"100 lb":week>=4?"130-140 lb":"120-130 lb","1:45-2:15","Construire le haut du dos pour le bench et la posture.")]},

    {time:"13 min",title:"B. Superset haut du corps volume",tag:"Hypertrophie",kind:"accessory",
     exercises:[
       hbEx("B1. Incline DB press",deload?"2×10":"4×10-12",deload?"45 lb / main":"55-65 lb / main","0:30 avant B2","Volume propre. Étirement contrôlé."),
       hbEx("B2. Weighted Pull-up",deload?"2×6":"4×6-8",deload?"poids du corps":"+10 à +25 lb","1:15 après B2","Strict. Si ça tire dans les coudes : ring rows lourds.")
     ]},

    {time:"10 min",title:"C. Épaules / posture",tag:"Accessoire",kind:"accessory",
     exercises:[
       hbEx("C1. Face Pull",deload?"2×15":"3×15-20","60-70 lb","0:30","Rotation externe en fin."),
       hbEx("C2. Rear Delt Fly",deload?"2×15":"3×15-20","20-25 lb","0:45","Arrière d'épaule, trapèzes calmes.")
     ]},

    {time:deload?"6 min":"8 min",title:"D. Finisher posture",tag:"Conditioning",kind:"wod",
     text:(deload?"SkiErg 6 min facile.":"EMOM 8 : min 1 = 10 cal SkiErg ; min 2 = 12 ring rows stricts.")+" "+p.wodNote+"."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Open book 1 min/côté + pec minor stretch 1 min/côté + lat stretch 1 min."}
  ];

  // VENDREDI — Full body force base + haltéro léger
  return [
    {time:"9 min",title:"Warm-up full body",tag:"Préparation",kind:"warmup",
     text:"Row 3 min + front rack mobility 1 min + tall muscle clean 2×5 + air squats 2×10 + ramp-up power clean : barre ×5, 95×3, 135×2."},

    {time:"14 min",title:"A. Puissance maintenue",tag:"Haltéro",kind:"main",
     exercises:[hbEx("Power Clean",deload?"5×2 léger":week>=4?"7×2":"6×3",deload?"135 lb":week>=4?"175-185 lb":"155-170 lb","1:30-2:00","Vitesse avant charge. Zéro grind. Maintenir l'haltéro vivant.")]},

    {time:"13 min",title:"B. Full body hypertrophie",tag:"Superset",kind:"accessory",
     exercises:[
       hbEx("B1. DB Bench Press",deload?"2×10":"3×10-12",deload?"50 lb / main":"60-70 lb / main","0:30 avant B2","Contrôle, amplitude."),
       hbEx("B2. Farmer Carry",deload?"2×30 m":"4×40 m","lourd propre","1:00 après B2","Gainage fort, posture haute.")
     ]},

    {time:"8 min",title:"C. Core / chaîne postérieure",tag:"Accessoire",kind:"accessory",
     exercises:[
       hbEx("C1. Hollow Hold",deload?"2×20 sec":"3×30 sec","poids du corps","0:30","Côtes basses, bas du dos collé."),
       hbEx("C2. Reverse Sled Drag",deload?"2 min facile":"4 min continu","léger à modéré","—","Quads et genoux, pas une épreuve cardio.")
     ]},

    {time:deload?"6 min":"10 min",title:"D. Finisher CrossFit court",tag:"Conditioning",kind:"wod",
     text:(deload?"Bike 6 min zone 2 facile.":"AMRAP 10 : 6 power cleans légers + 10 wall balls 14 lb + 10 cal row.")+" "+p.wodNote+". Court et propre, pas un test compétition."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Front rack stretch 1 min + lat stretch 1 min/côté + couch stretch 1 min/côté."}
  ];
}

window.COACH_BERTIN_PROGRAMS.hypertrophy_base.getBlocks = function(day, week){
  return hypertrophyBlocks(day, week);
};

window.COACH_BERTIN_PROGRAMS.hypertrophy_base.getWodText = function(day, week){
  var b = hypertrophyBlocks(day, week).filter(function(x){ return x.kind === "wod"; })[0];
  return b ? b.text : "";
};

window.COACH_BERTIN_PROGRAMS.hypertrophy_base.cycleRules = [
  "Objectif phase 2 : construire de la masse utile et de la force de base.",
  "Les finishers sont courts : ils ne doivent pas voler la récupération du strength.",
  "Aucun échec sur bench, squat ou clean.",
  "Chaîne postérieure prioritaire : fessiers/ischios avant ego.",
  "Si le bas du dos ou les épaules compensent : baisse la charge immédiatement."
];

window.COACH_BERTIN_PROGRAMS.hypertrophy_base.dayIntentions = {
  lundi: "Haut du corps lourd : bench prioritaire, tirage lourd pour protéger les épaules.",
  mardi: "Bas du corps force base : squat propre, fessiers et ischios solides, dos protégé.",
  jeudi: "Volume haut du corps : dos, pectoraux, épaules maintenues et posture.",
  vendredi: "Full body : garder l'haltéro vivant et terminer avec un finisher court, pas une compétition."
};
