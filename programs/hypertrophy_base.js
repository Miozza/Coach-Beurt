// Coach Bertin V48.7 — Phase 2 : Hypertrophie / Force Base (6 semaines)
// CORRECTIONS V48.7 (science du sport) :
// - Mardi : BACK SQUAT comme mouvement principal (objectif = back squat 260 lb → spécificité SAID)
// - Lundi jeudi : 2e exposition bench technique (fréquence 2x/semaine = +30% progression force)
// - Progression minimale volume lateral raise maintenu S1→S5 (gains Phase 1 conservés)
// - Ramp-up ajusté S5 peak avec paliers plus fins

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.hypertrophy_base = {
  id: "hypertrophy_base",
  label: "Hypertrophie / Force Base — Phase 2",
  phase: 2,
  phaseName: "Construction masse + force",
  phaseEnd: "décembre 2025",
  nextPhase: "force_performance",
  impact: "Bench vers 285 lb (2x/semaine), back squat vers 260 lb x5 (mouvement spécifique mardi), chaîne postérieure, densité musculaire jambes. Épaules maintenues avec progression minimale.",
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
    1:{label:"S1 Base",  note:"Reprendre les repères. RPE 7-8. Aucun échec.",
       bench:"5×5",  benchLoad:"225 lb", benchTech:"3×5 technique",benchTechLoad:"175 lb",
       squat:"4×6",  squatLoad:"185 lb", hinge:"3×10", lateralVol:"3×15", wodNote:"facile à modéré"},
    2:{label:"S2 Volume",note:"Augmenter légèrement le volume. Charges solides, technique propre.",
       bench:"5×5",  benchLoad:"230 lb", benchTech:"3×5 technique",benchTechLoad:"180 lb",
       squat:"5×5",  squatLoad:"195 lb", hinge:"4×10", lateralVol:"3×15-20", wodNote:"modéré"},
    3:{label:"S3 Volume+",note:"Plus gros volume du cycle. Pump et densité, pas de grind.",
       bench:"4×6",  benchLoad:"235 lb", benchTech:"3×5 technique",benchTechLoad:"185 lb",
       squat:"5×5",  squatLoad:"205 lb", hinge:"4×8-10", lateralVol:"4×15-20", wodNote:"contrôlé"},
    4:{label:"S4 Surcharge",note:"Charges les plus sérieuses avant l'intensité. RPE 8-9 max.",
       bench:"5×4",  benchLoad:"245 lb", benchTech:"3×4 lourd",  benchTechLoad:"205 lb",
       squat:"5×4",  squatLoad:"215 lb", hinge:"4×8",  lateralVol:"4×15-20", wodNote:"court, pas destructeur"},
    5:{label:"S5 Intensité",note:"Intensité maximale du cycle. Moins de volume, plus lourd.",
       bench:"6×3",  benchLoad:"255 lb", benchTech:"3×3 lourd",  benchTechLoad:"215 lb",
       squat:"5×3",  squatLoad:"225 lb", hinge:"3×8",  lateralVol:"3×15", wodNote:"très court"},
    6:{label:"S6 Deload",note:"Baisser le volume et garder le mouvement. Préparer la phase force.",
       bench:"3×5 léger",benchLoad:"205 lb",benchTech:"2×5 léger",benchTechLoad:"165 lb",
       squat:"3×5 léger",squatLoad:"165 lb",hinge:"2×10 léger",lateralVol:"2×15", wodNote:"flush seulement"}
  })[week] || {label:"S1",note:"",bench:"5×5",benchLoad:"225 lb",benchTech:"3×5 technique",benchTechLoad:"175 lb",squat:"4×6",squatLoad:"185 lb",hinge:"3×10",lateralVol:"3×15",wodNote:"modéré"};
}

function hbEx(name,format,load,rest,note){return {name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function hypertrophyBlocks(day,week){
  var p = hypertrophyWeekPlan(week);
  var deload = week === 6;
  var heavy  = week >= 4 && week <= 5;
  var peak   = week === 5;

  // ── LUNDI — Bench priorité + 2e session tirage + épaules maintien ───────────────
  if(day === "lundi") return [
    {time:"9 min",title:"Warm-up haut du corps",tag:"Préparation",kind:"warmup",
     text:"Bike ou row 3 min + band pull-aparts 2×20 + scap push-ups 2×10 + push-ups contrôlés 2×8 + ramp-up bench : barre ×10, 135×5, 185×3"+(peak?", 215×1":"")+(heavy?", 225×1":"")+"."},

    {time:"16 min",title:"A. Bench priorité",tag:"Force",kind:"main",
     exercises:[hbEx("Bench press",p.bench,p.benchLoad,heavy?"2:30-3:00":"2:00-2:30","Objectif force. Pause contrôlée. Stop à RPE 9. 1 rep en réserve.")]},

    {time:"13 min",title:"B. Superset tirage + press incliné",tag:"Superset",kind:"accessory",
     text:"Alterner B1 → B2. Repos après B2. Le tirage soutient le bench et protège les épaules.",
     exercises:[
       hbEx("B1. Incline DB press",deload?"2×10":"4×8-10",week>=4&&!deload?"65 lb / main":"60 lb / main","0:30 avant B2","Volume pec haut. Contrôle complet. Pas d'échec."),
       hbEx("B2. Chest Supported Row",deload?"2×10":"4×8-10",week>=4&&!deload?"125-135 lb":"115-125 lb","1:15 après B2","Tirage strict. Omoplates fortes. Protège le bench.")
     ]},

    {time:"9 min",title:"C. Épaules maintien progressif",tag:"Hypertrophie",kind:"accessory",
     text:"Volume épaules maintenu et légèrement progressif S1→S5 pour conserver les gains Phase 1.",
     exercises:[
       hbEx("C1. Triceps Rope Pushdown",deload?"2×12":"3×12-15","60-70 lb","0:30","Pompe triceps, coude fixe."),
       hbEx("C2. Lateral Raise câble bas",deload?"2×15":p.lateralVol,"15-20 lb","0:45","Épaules maintenues. Volume augmente légèrement S3→S4.")
     ]},

    {time:deload?"6 min":"8 min",title:"D. Finisher court",tag:"Conditioning",kind:"wod",
     text:(deload?"Bike 6 min zone 2 facile. ":"AMRAP 8 : 8 push-ups + 10 cal row + 12 sit-ups. ")+p.wodNote+". Garder le moteur sans nuire au bench."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Doorway pec stretch 1 min/côté + lat stretch 1 min/côté + respiration thoracique 1 min."}
  ];

  // ── MARDI — BACK SQUAT priorité (spécificité objectif 260 lb) + chaîne postérieure ──
  // CORRECTION V48.7 : front squat → back squat. Principe SAID — la force est spécifique
  // au mouvement. Objectif back squat 260 lb = entraîner le back squat, pas le front squat.
  if(day === "mardi") return [
    {time:"9 min",title:"Warm-up squat",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + ankle rocks 10/côté + goblet squat 2×10 + glute bridge 2×15 + ramp-up back squat : barre ×8, 135×5, 185×3"+(peak?", 205×1":"")+"."},

    {time:"17 min",title:"A. Back Squat force base",tag:"Jambes",kind:"main",
     exercises:[hbEx("Back Squat",p.squat,p.squatLoad,heavy?"2:30":"2:00","Objectif : 260 lb x5. Dos neutre, profondeur propre. Stop RPE 9. Si le bas du dos compense : front squat léger.")]},

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

  // ── JEUDI — 2e exposition bench (technique) + dos volume + épaules ──────────────
  // CORRECTION V48.7 : ajout bench technique 3×5 jeudi. Fréquence 2x/semaine
  // supérieure à 1x/semaine pour progression force bench (Ralston 2017, Colquhoun 2018).
  if(day === "jeudi") return [
    {time:"8 min",title:"Warm-up dos / épaules",tag:"Préparation",kind:"warmup",
     text:"Row 3 min + dead hang 2×20 sec + band face pull 2×20 + wall slides 2×10 + ramp-up bench : barre ×10, 135×5."},

    {time:"10 min",title:"A. Bench technique (2e session)",tag:"Force",kind:"main",
     exercises:[hbEx("Bench press technique",p.benchTech,p.benchTechLoad,"1:30-2:00","2e exposition bench de la semaine. Technique parfaite, vitesse de barre, RPE 7 max. Complète la fréquence 2x/semaine.")]},

    {time:"12 min",title:"B. Tirage principal volume",tag:"Dos",kind:"accessory",
     exercises:[hbEx("Chest Supported Row",deload?"3×8 léger":week>=4?"5×6-8":"4×8-10",deload?"100 lb":week>=4?"130-140 lb":"120-130 lb","1:45-2:00","Construire le haut du dos pour le bench et la posture.")]},

    {time:"12 min",title:"C. Superset dos / bras volume",tag:"Hypertrophie",kind:"accessory",
     exercises:[
       hbEx("C1. Weighted Pull-up",deload?"2×6":"4×6-8",deload?"poids du corps":"+10 à +25 lb","0:30 avant C2","Strict. Si ça tire dans les coudes : ring rows lourds."),
       hbEx("C2. Incline DB press",deload?"2×10":"3×10-12",deload?"45 lb / main":"55-65 lb / main","1:15 après C2","Volume pec. Amplitude propre.")
     ]},

    {time:"9 min",title:"D. Épaules posture",tag:"Accessoire",kind:"accessory",
     exercises:[
       hbEx("D1. Face Pull",deload?"2×15":"3×15-20","60-70 lb","0:30","Rotation externe en fin."),
       hbEx("D2. Rear Delt Fly câble bas",deload?"2×15":p.lateralVol,"15-20 lb","0:45","Arrière d'épaule. Volume maintenu.")
     ]},

    {time:deload?"6 min":"8 min",title:"E. Finisher posture",tag:"Conditioning",kind:"wod",
     text:(deload?"SkiErg 6 min facile.":"EMOM 8 : min 1 = 10 cal SkiErg ; min 2 = 12 ring rows stricts.")+" "+p.wodNote+"."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Open book 1 min/côté + pec minor stretch 1 min/côté + lat stretch 1 min."}
  ];

  // ── VENDREDI — Full body force base + haltéro ────────────────────────────────────
  return [
    {time:"9 min",title:"Warm-up full body",tag:"Préparation",kind:"warmup",
     text:"Row 3 min + front rack mobility 1 min + tall muscle clean 2×5 + air squats 2×10 + ramp-up power clean : barre ×5, 95×3, 135×2."},

    {time:"14 min",title:"A. Puissance maintenue",tag:"Haltéro",kind:"main",
     exercises:[hbEx("Power Clean",deload?"5×2 léger":week>=4?"7×2":"6×3",deload?"135 lb":week>=4?"175-185 lb":"155-170 lb","1:30-2:00","Vitesse avant charge. Zéro grind. Maintenir l'haltéro vivant.")]},

    {time:"13 min",title:"B. Full body hypertrophie",tag:"Superset",kind:"accessory",
     exercises:[
       hbEx("B1. DB Bench Press",deload?"2×10":"3×10-12",deload?"50 lb / main":"60-70 lb / main","0:30 avant B2","3e exposition press de la semaine — léger. Contrôle, amplitude."),
       hbEx("B2. Farmer Carry",deload?"2×30 m":"4×40 m","lourd propre","1:00 après B2","Gainage fort, posture haute.")
     ]},

    {time:"8 min",title:"C. Core / chaîne postérieure",tag:"Accessoire",kind:"accessory",
     exercises:[
       hbEx("C1. Hollow Hold",deload?"2×20 sec":"3×30 sec","poids du corps","0:30","Côtes basses, bas du dos collé."),
       hbEx("C2. Reverse Sled Drag",deload?"2 min facile":"4 min continu","léger à modéré","—","Quads et genoux, pas une épreuve cardio.")
     ]},

    {time:deload?"6 min":"10 min",title:"D. Finisher CrossFit court",tag:"Conditioning",kind:"wod",
     text:(deload?"Bike 6 min zone 2 facile.":"AMRAP 10 : 6 power cleans légers + 10 wall balls 14 lb + 10 cal row.")+" "+p.wodNote+". Court et propre."},

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
  "Objectif phase 2 : back squat 260 lb et bench 285 lb. Spécificité avant ego.",
  "Bench 2x/semaine : lundi lourd, jeudi technique RPE 7. La fréquence fait la progression.",
  "Back squat mardi : c'est le mouvement cible. Front squat = accessoire seulement.",
  "Aucun échec sur bench, squat ou clean.",
  "Chaîne postérieure prioritaire : fessiers/ischios avant ego.",
  "Si le bas du dos ou les épaules compensent : baisse la charge immédiatement."
];

window.COACH_BERTIN_PROGRAMS.hypertrophy_base.dayIntentions = {
  lundi: "Bench lourd prioritaire + tirage protecteur. 1re session bench de la semaine.",
  mardi: "Back squat force base vers 260 lb. Chaîne postérieure solide, dos protégé.",
  jeudi: "Bench technique (2e session) + dos volume. Fréquence 2x/semaine = progression accélérée.",
  vendredi: "Full body : garder l'haltéro vivant et finisher court. Pas une compétition."
};
