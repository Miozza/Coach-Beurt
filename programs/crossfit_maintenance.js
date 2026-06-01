// Coach Bertin V49.5 — Programme autonome : CrossFit maintenance
// Objectif : garder technique, moteur et mobilité avec fatigue basse.
// V49.5 : ne dépend plus de la structure PPL générique.

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.maintenance = {
  id: "maintenance",
  label: "CrossFit maintenance",
  phase: 0,
  phaseName: "Maintien / récupération",
  impact: "Charges faciles, technique propre, WOD conservé sans recherche d'échec. Objectif : garder les patterns CrossFit vivants en récupérant.",
  weekLabels: ["S1 Facile","S2 Technique","S3 Modéré","S4 Reset"],
  weekGoals: [
    "Reprendre le mouvement sans fatigue.",
    "Technique plus propre, transitions calmes.",
    "Un peu plus de densité, toujours sous contrôle.",
    "Reset complet : bouger, respirer, récupérer."
  ],
  sets: ["3 x 5 facile", "3 x 5 facile", "3 x 3 propre", "2 x 5 léger"],
  targetReps: [5,5,3,5],
  mult: [0.55,0.58,0.62,0.50],
  rest: "1:30–2:00",
  tag: "maintenance",
  trainingStyle: "maintenance",
  conditioning: "easy_wod",
  cycleRules: [
    "Aucune recherche d'échec.",
    "Tous les WODs doivent rester respirables.",
    "Technique avant score.",
    "Si tu finis vidé, c'était trop intense.",
    "Le but est de maintenir, pas de progresser à tout prix."
  ],
  dayIntentions: {
    lundi: "Full body technique. Réactiver sans forcer.",
    mardi: "Engine facile + tirage/posture. Respiration contrôlée.",
    jeudi: "Jambes légères + mobilité. Dos protégé.",
    vendredi: "CrossFit skills + WOD modéré. Garder les transitions vivantes."
  }
};

function maintenanceWeekPlan(week){
  return({
    1:{label:"S1 Facile",note:"RPE 6-7. Tout doit sembler trop facile.",load:"léger",wod:"facile"},
    2:{label:"S2 Technique",note:"Même intensité, meilleure qualité de mouvement.",load:"léger à modéré",wod:"technique"},
    3:{label:"S3 Modéré",note:"Un peu plus dense, mais jamais redline.",load:"modéré propre",wod:"modéré"},
    4:{label:"S4 Reset",note:"Deload complet. Bouger pour récupérer.",load:"très léger",wod:"reset"}
  })[week] || {label:"S1",note:"",load:"léger",wod:"facile"};
}
function mtEx(name,format,load,rest,note){return {name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function maintenanceBlocks(day,week){
  var p=maintenanceWeekPlan(week);
  var reset=week===4;
  var mod=week===3;

  if(day==="lundi") return [
    {time:"8 min",title:"Warm-up full body",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + air squats 2×10 + band pull-aparts 2×20 + ring rows 2×8 + mobilité hanches/épaules."},
    {time:"14 min",title:"A. Force technique",tag:"Technique",kind:"main",
     exercises:[mtEx("Front Squat",reset?"2×5 léger":mod?"4×3 propre":"3×5 facile",reset?"115-135 lb":mod?"155-175 lb":"135-155 lb","1:30-2:00","Bar speed. Position parfaite. Aucune fatigue lourde.")]},
    {time:"12 min",title:"B. Superset maintien",tag:"Accessoire",kind:"accessory",
     exercises:[
       mtEx("B1. Push-up strict",reset?"2×8":"3×10","poids du corps","0:30 avant B2","Amplitude propre."),
       mtEx("B2. Ring Row Strict",reset?"2×8":"3×10","poids du corps","1:00 après B2","Scapulas propres.")
     ]},
    {time:reset?"8 min":"10 min",title:"C. WOD facile",tag:"Conditioning",kind:"wod",
     text:(reset?"10 min bike zone 2 très facile.":"AMRAP 10 facile : 8 cal row + 8 air squats + 8 ring rows.")+" "+p.note},
    {time:"5 min",title:"D. Mobilité",tag:"Mobilité",kind:"mobility",text:"Respiration 1 min + couch stretch 1 min/côté + lat stretch 1 min/côté."}
  ];

  if(day==="mardi") return [
    {time:"8 min",title:"Warm-up engine",tag:"Préparation",kind:"warmup",
     text:"Row 3 min facile + scap pull-ups 2×8 + band face pull 2×20 + open book 6/côté."},
    {time:"12 min",title:"A. Tirage / posture",tag:"Technique",kind:"main",
     exercises:[mtEx("Chest Supported Row",reset?"2×10 léger":mod?"4×8":"3×10","90-115 lb","1:30","Tirage strict, pas de swing.")]},
    {time:"12 min",title:"B. Scapulas",tag:"Posture",kind:"accessory",
     exercises:[
       mtEx("B1. Face Pull",reset?"2×15":"3×15-20","50-60 lb","0:30 avant B2","Rotation externe."),
       mtEx("B2. Trap-3 Raise",reset?"2×12":"3×12-15","léger","1:00 après B2","Trap inférieur, pas trap supérieur.")
     ]},
    {time:reset?"12 min":"16 min",title:"C. Engine facile",tag:"Conditioning",kind:"wod",
     text:(reset?"12 min row zone 2. Respiration nasale si possible.":"EMOM 16 facile : min 1 row, min 2 bike, min 3 ski, min 4 marche/rest.")+" RPE 6-7 maximum."},
    {time:"5 min",title:"D. Mobilité",tag:"Mobilité",kind:"mobility",text:"Open book 1 min/côté + pec stretch 1 min/côté + respiration 1 min."}
  ];

  if(day==="jeudi") return [
    {time:"9 min",title:"Warm-up jambes",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + ankle rocks 10/côté + glute bridge 2×15 + goblet squat 2×10 + hinge drill 2×10."},
    {time:"14 min",title:"A. Chaîne postérieure légère",tag:"Technique",kind:"main",
     exercises:[mtEx("DB RDL",reset?"2×10 léger":mod?"4×8":"3×10",reset?"40-50 lb / main":"50-65 lb / main","1:30","Étirement ischios. Dos neutre.")]},
    {time:"12 min",title:"B. Jambes unilatérales",tag:"Accessoire",kind:"accessory",
     exercises:[
       mtEx("B1. Bulgarian Split Squat",reset?"2×8/jambe":"3×8/jambe",reset?"poids du corps":"25-40 lb / main","0:30 avant B2","Contrôle, pas de brûlage inutile."),
       mtEx("B2. Standing Calf Raise",reset?"2×15":"3×15-20","léger","1:00 après B2","Pause en haut.")
     ]},
    {time:reset?"8 min":"10 min",title:"C. Conditioning jambes facile",tag:"Conditioning",kind:"wod",
     text:(reset?"Bike 8 min zone 2 facile.":"For quality 10 min : 10 cal bike + 10 KB swings légers + 10 box step-ups.")+" Pas de redline."},
    {time:"5 min",title:"D. Mobilité",tag:"Mobilité",kind:"mobility",text:"Couch stretch 1 min/côté + hamstring stretch 1 min/côté + respiration 1 min."}
  ];

  return [
    {time:"9 min",title:"Warm-up CrossFit skill",tag:"Préparation",kind:"warmup",
     text:"Row 3 min + PVC pass through 2×10 + front rack stretch 1 min + tall muscle clean 2×5 + burpees très lents 2×4."},
    {time:"14 min",title:"A. Haltéro technique",tag:"Haltéro",kind:"main",
     exercises:[mtEx("Power Clean",reset?"5×2 léger":mod?"7×2":"6×2",reset?"115-135 lb":mod?"155-165 lb":"135-155 lb","1:30","Vitesse et positions. Pas de charge lourde.")]},
    {time:"10 min",title:"B. Skill CrossFit",tag:"Skill",kind:"accessory",
     exercises:[
       mtEx("B1. Burpees contrôlés",reset?"2×6":"3×8","poids du corps","0:30 avant B2","Respiration régulière."),
       mtEx("B2. Wall Ball technique",reset?"2×10":"3×12","14 lb","1:00 après B2","Cycle propre, pas sprint.")
     ]},
    {time:reset?"8 min":"12 min",title:"C. WOD modéré",tag:"Conditioning",kind:"wod",
     text:(reset?"AMRAP 8 très facile : 6 wall balls + 6 ring rows + 6 cal row.":"AMRAP 12 contrôlé : 8 wall balls 14 lb + 8 cal row + 6 burpees.")+" Score secondaire. RPE 7 maximum."},
    {time:"5 min",title:"D. Mobilité",tag:"Mobilité",kind:"mobility",text:"Lat stretch 1 min/côté + front rack stretch 1 min + respiration 1 min."}
  ];
}

window.COACH_BERTIN_PROGRAMS.maintenance.getWeekNote = function(week){
  return maintenanceWeekPlan(week).note || "";
};

window.COACH_BERTIN_PROGRAMS.maintenance.getBlocks = function(day, week){ return maintenanceBlocks(day, week); };
window.COACH_BERTIN_PROGRAMS.maintenance.getWodText = function(day, week){
  var b=maintenanceBlocks(day, week).filter(function(x){return x.kind==="wod";})[0];
  return b ? b.text : "Maintenance — aucun WOD.";
};

window.COACH_BERTIN_PROGRAMS.maintenance.dayMeta = {
  lundi:   {label:"Lundi",   base:"Full body technique", focus:"Mouvements de base, aucune fatigue inutile."},
  mardi:   {label:"Mardi",   base:"Engine + posture",    focus:"Cardio facile, tirage, scapulas."},
  jeudi:   {label:"Jeudi",   base:"Jambes légères",      focus:"Chaîne postérieure, unilatéral, mobilité."},
  vendredi:{label:"Vendredi",base:"Skills CrossFit",     focus:"Haltéro technique, wall balls/burpees contrôlés."}
};
