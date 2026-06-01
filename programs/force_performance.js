// Coach Bertin V49.5 — Phase 3 : Force + Résistance musculaire (6 semaines)
// Objectif : force réelle + transfert CrossFit sans structure PPL générique.
// V49.5 : programme autonome. Les journées complètes vivent ici, pas dans app.js.

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.force_performance = {
  id: "force_performance",
  label: "Force + Résistance musculaire — Phase 3",
  phase: 3,
  phaseName: "Force compétition + seuil lactique",
  phaseEnd: "juillet 2026",
  nextPhase: "competition_peak",
  impact: "Bench 300 lb, back squat 285 lb, tolérer 75 reps squats sans s'effondrer. Force lourde, densité jambes, haltéro maintenue, progression muscle-ups. WODs courts et contrôlés seulement.",
  weekLabels: ["S1 Base","S2 Volume","S3 Densité","S4 Surcharge","S5 Peak","S6 Deload"],
  weekGoals: [
    "Installer les repères de force. Aucun échec. Technique propre sur bench/squat/clean.",
    "Monter le volume lourd. Ajouter de la densité contrôlée jambes et tirage.",
    "Semaine densité : force + résistance musculaire sans redline inutile.",
    "Surcharge : charges sérieuses, volume accessoire réduit. Priorité qualité.",
    "Peak force : moins de volume, plus lourd. Tester sans se briser.",
    "Deload complet : récupérer et préparer la phase compétition."
  ],
  sets: ["5 x 5","5 x 4","6 x 3","5 x 3","3 x 2 lourd","3 x 5 léger"],
  targetReps: [5,4,3,3,2,5],
  mult: [0.80,0.84,0.87,0.90,0.93,0.65],
  rest: "2:30–3:00",
  tag: "force compétition"
};

function forceWeekPlan(week){
  return ({
    1:{label:"S1 Base",note:"RPE 7-8. Reprendre les repères. Zéro échec.",bench:"5×5",benchLoad:"240 lb",squat:"5×5",squatLoad:"205 lb",clean:"6×2",cleanLoad:"165 lb",press:"4×5",pressLoad:"125 lb",density:"base",wodNote:"court et contrôlé"},
    2:{label:"S2 Volume",note:"Volume lourd. +5 à +10 lb si S1 était propre.",bench:"5×4",benchLoad:"250 lb",squat:"5×4",squatLoad:"215 lb",clean:"7×2",cleanLoad:"175 lb",press:"5×4",pressLoad:"130 lb",density:"volume",wodNote:"modéré, pas redline"},
    3:{label:"S3 Densité",note:"Semaine force + densité. Le cardio ne doit pas voler les lifts.",bench:"6×3",benchLoad:"260 lb",squat:"6×3",squatLoad:"225 lb",clean:"8×1",cleanLoad:"185 lb",press:"5×3",pressLoad:"135 lb",density:"density",wodNote:"dense mais contrôlé"},
    4:{label:"S4 Surcharge",note:"Charges sérieuses. RPE 8-9 max. Aucun grind laid.",bench:"5×3",benchLoad:"265 lb",squat:"5×3",squatLoad:"235 lb",clean:"6×1",cleanLoad:"195 lb",press:"5×3",pressLoad:"140 lb",density:"heavy",wodNote:"très court"},
    5:{label:"S5 Peak",note:"Peak force. Peu de volume. Tu dois finir nerveux, pas détruit.",bench:"3×2 lourd",benchLoad:"275-285 lb",squat:"3×2 lourd",squatLoad:"245-255 lb",clean:"5×1 lourd",cleanLoad:"200-210 lb",press:"3×2",pressLoad:"145-150 lb",density:"peak",wodNote:"minimal"},
    6:{label:"S6 Deload",note:"Deload. Bar speed, mobilité, récupération. Aucun test.",bench:"3×5 léger",benchLoad:"210 lb",squat:"3×5 léger",squatLoad:"175 lb",clean:"5×2 léger",cleanLoad:"145 lb",press:"3×5 léger",pressLoad:"105 lb",density:"deload",wodNote:"flush facile"}
  })[week] || {label:"S1 Base",note:"",bench:"5×5",benchLoad:"240 lb",squat:"5×5",squatLoad:"205 lb",clean:"6×2",cleanLoad:"165 lb",press:"4×5",pressLoad:"125 lb",density:"base",wodNote:"contrôlé"};
}

function fpEx(name,format,load,rest,note){return {name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function forcePerformanceBlocks(day,week){
  var p = forceWeekPlan(week);
  var deload = week === 6;
  var peak = week === 5;
  var heavy = week >= 4 && week <= 5;

  // LUNDI — Bench lourd + tirage lourd. Pas de WOD destructeur.
  if(day === "lundi") return [
    {time:"8 min",title:"Warm-up bench",tag:"Préparation",kind:"warmup",
     text:"Row facile 3 min + band pull-aparts 2×20 + scap push-ups 2×10 + empty bar bench 2×10 + ramp-up bench : 135×5, 185×3, 225×1."},

    {time:"18 min",title:"A. Bench lourd",tag:"Force",kind:"main",
     exercises:[fpEx("Bench press",p.bench,p.benchLoad,heavy?"3:00":"2:30","Objectif force. Pause contrôlée. Stop si la vitesse tombe trop. Aucun échec.")]},

    {time:"14 min",title:"B. Tirage lourd protecteur",tag:"Force",kind:"accessory",
     text:"Le tirage lourd soutient ton bench et protège tes épaules. Repos réel, pas en circuit cardio.",
     exercises:[
       fpEx("B1. Chest Supported Row",deload?"3×8 léger":peak?"4×5":"5×6-8",deload?"105 lb":heavy?"135-145 lb":"125-135 lb","0:45 avant B2","Strict. Garde la poitrine collée au banc."),
       fpEx("B2. Weighted Pull-up",deload?"3×5 poids du corps":peak?"4×3 lourd":"5×5",deload?"poids du corps":heavy?"+25 à +40 lb":"+15 à +30 lb","1:45 après B2","Strict. Si les coudes chialent : ring rows lourds.")
     ]},

    {time:"8 min",title:"C. Assistance bench",tag:"Accessoire",kind:"accessory",
     exercises:[
       fpEx("C1. Close-Grip Bench",deload?"2×8 léger":"3×6-8",deload?"155 lb":heavy?"205-215 lb":"185-205 lb","1:30","Triceps fort sans chercher l'échec."),
       fpEx("C2. Face Pull",deload?"2×15":"3×15-20","60-70 lb","0:45","Santé épaules. Rotation externe.")
     ]},

    {time:deload?"6 min":"6 min",title:"D. Flush optionnel",tag:"Conditioning",kind:"wod",
     text:(deload?"Bike 6 min zone 2 facile.":"Bike 6 min facile nasal. Pas un WOD. Juste faire circuler.")+" "+p.wodNote+"."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Doorway pec stretch 1 min/côté + lat stretch 1 min/côté + thoracic extension 1 min."}
  ];

  // MARDI — Squat / jambes + densité squat contrôlée.
  if(day === "mardi") return [
    {time:"8 min",title:"Warm-up squat + posture",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + ankle rocks 10/côté + open book 5/côté + dead bug 2×6 + goblet squat 2×8 + ramp-up squat : barre ×8, 135×5, 185×3."},

    {time:"18 min",title:"A. Squat priorité",tag:"Force",kind:"main",
     exercises:[fpEx("Back Squat",p.squat,p.squatLoad,heavy?"3:00":"2:30","Force jambes. Dos neutre. Aucun ego lift. Si le dos parle : front squat même charge relative.")]},

    {time:"13 min",title:"B. Chaîne postérieure lourde",tag:"Force",kind:"accessory",
     exercises:[
       fpEx("B1. Hip Thrust",deload?"2×8 léger":peak?"3×5":"4×6-8",deload?"225 lb":heavy?"315 lb":"275-305 lb","0:45 avant B2","Pause 1 sec en haut. Fessiers."),
       fpEx("B2. DB RDL",deload?"2×8 léger":"3×8","60-70 lb / main","1:30 après B2","Ischios. Pas de flexion lombaire.")
     ]},

    {time:deload?"6 min":"8 min",title:"C. Densité jambes",tag:"Résistance",kind:"accessory",
     text:deload?"Deload : seulement bouger proprement.":"Bloc spécifique : tolérer les jambes qui brûlent sans perdre la technique.",
     exercises:[
       fpEx("C1. Front Squat léger densité",deload?"2×8":"5×10",deload?"115 lb":week>=3?"145-165 lb":"135-155 lb","0:45","Respiration contrôlée. Pas d'échec."),
       fpEx("C2. Box Step-up",deload?"2×10":"3×15/jambe",deload?"poids du corps":"20-35 lb / main","0:45","Rythme constant, genou stable.")
     ]},

    {time:deload?"5 min":"6 min",title:"D. Conditioning jambes court",tag:"Conditioning",kind:"wod",
     text:(deload?"Row 6 min facile zone 2.":"EMOM 8 : min 1 = 12 cal bike ; min 2 = 12 KB swings.")+" "+p.wodNote+"."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Couch stretch 1 min/côté + hamstring stretch 1 min/côté + respiration 1 min."}
  ];

  // JEUDI — Clean / press / skill gymnastics.
  if(day === "jeudi") return [
    {time:"9 min",title:"Warm-up haltéro",tag:"Préparation",kind:"warmup",
     text:"Row 3 min + front rack stretch 1 min + tall muscle clean 2×5 + clean pull 2×3 + ramp-up power clean : 95×3, 135×2, 155×1."},

    {time:"16 min",title:"A. Power clean force-vitesse",tag:"Haltéro",kind:"main",
     exercises:[fpEx("Power Clean",p.clean,p.cleanLoad,peak?"2:00-2:30":"1:30-2:00","Vitesse et réception propre. Zéro grind. Si tu tires avec les bras, baisse.")]},

    {time:"12 min",title:"B. Press force",tag:"Force",kind:"accessory",
     exercises:[fpEx("Strict Press",p.press,p.pressLoad,heavy?"2:15":"1:45-2:00","Force verticale. Gainage dur. Pas de compensation lombaire.")]},

    {time:"10 min",title:"C. Skill muscle-up",tag:"Skill",kind:"accessory",
     text:"Qualité stricte. Ce bloc prépare les muscle-ups sans te détruire les coudes.",
     exercises:[
       fpEx("C1. "+[
         "Pull-up strict","Pull-up strict","Chest-to-Bar tentative","Transition drill low-ring",
         "Muscle-up tentative (ring)","Pull-up strict déload"
       ][Math.min(week-1,5)],
       deload?"2×5 facile":peak?"4×1-2":week>=4?"5×2-3":week===3?"5×4":"5×4-6",
       "poids du corps","0:45 avant C2",
       [
         "S1 — Base : tirage strict, scapulas fortes. Arrêt avant la perte de forme.",
         "S2 — Montée : pull-up haut, toucher poitrine à la barre si possible.",
         "S3 — Densité : viser le chest-to-bar propre, chaque rep compte.",
         "S4 — Transition : low rings, simuler le passage de pull à dip. 2-3 reps max.",
         "S5 — Test : 1-2 muscle-ups si possible. Qualité avant nombre.",
         "S6 — Déload : pull-up strict seulement, technique, pas de fatigue."
       ][Math.min(week-1,5)]),
       fpEx("C2. Ring Dip strict",
       deload?"2×5 léger":peak?"4×3 lourd":"5×5-6",
       deload?"poids du corps":week===5?"+30 à +40 lb":week===4?"+20 à +35 lb":week>=3?"+15 à +25 lb":"+5 à +15 lb",
       "1:15 après C2",
       "Épaules basses, amplitude complète. La force en dip est la moitié du muscle-up.")
     ]},

    {time:deload?"5 min":"8 min",title:"D. Conditioning technique",tag:"Conditioning",kind:"wod",
     text:(deload?"SkiErg 6 min facile.":"EMOM 10 : min 1 = 2 power cleans légers ; min 2 = 6 burpees contrôlés.")+" "+p.wodNote+". Le but est technique sous fatigue légère."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Front rack stretch 1 min + lat stretch 1 min/côté + wrist stretch 1 min."}
  ];

  // VENDREDI — Force secondaire + résistance musculaire CrossFit contrôlée.
  return [
    {time:"8 min",title:"Warm-up full body",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + PVC pass through 2×10 + air squats 2×10 + ring rows 2×8 + 2 montées progressives sur le premier mouvement."},

    {time:"14 min",title:"A. Force secondaire",tag:"Force",kind:"main",
     exercises:[fpEx("Front Squat",deload?"3×5 léger":peak?"4×2 lourd":week>=3?"5×3":"4×5",deload?"135 lb":peak?"195-205 lb":week>=3?"185-195 lb":"165-185 lb",heavy?"2:30":"2:00","Front rack solide. Transfert clean/thruster. Pas de fail.")]},

    {time:"12 min",title:"B. Tirage + carry",tag:"Accessoire",kind:"accessory",
     exercises:[
       fpEx("B1. Barbell Row",deload?"2×8 léger":"4×6-8",deload?"135 lb":heavy?"185-205 lb":"165-185 lb","0:45 avant B2","Dos fort. Pas de swing."),
       fpEx("B2. Farmer Carry",deload?"2×30 m":"4×40 m","lourd propre","1:15 après B2","Gainage, posture haute, grip.")
     ]},

    {time:deload?"8 min":peak?"8 min":"12 min",title:"C. WOD force-résistance",tag:"Conditioning",kind:"wod",
     text:(deload?"AMRAP 8 facile : 8 cal row + 8 air squats + 8 ring rows.":
       peak?"AMRAP 8 : 5 front squats légers + 8 burpees + 10 cal row.":
       week>=3?"AMRAP 12 : 10 wall balls 14 lb + 10 cal row + 8 burpees.":
       "AMRAP 10 : 8 wall balls 14 lb + 10 cal row + 8 ring rows.")+" "+p.wodNote+". Court, spécifique, pas un test Open."},

    {time:"5 min",title:"D. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Lat stretch 1 min/côté + couch stretch 1 min/côté + respiration 1 min."}
  ];
}

window.COACH_BERTIN_PROGRAMS.force_performance.getWeekNote = function(week){
  return forceWeekPlan(week).note || "";
};

window.COACH_BERTIN_PROGRAMS.force_performance.getBlocks = function(day, week){
  return forcePerformanceBlocks(day, week);
};

window.COACH_BERTIN_PROGRAMS.force_performance.getWodText = function(day, week){
  var b = forcePerformanceBlocks(day, week).filter(function(x){ return x.kind === "wod"; })[0];
  return b ? b.text : "";
};

window.COACH_BERTIN_PROGRAMS.force_performance.cycleRules = [
  "Objectif phase 3 : force d'abord, conditionnement ensuite.",
  "Aucun WOD long : les conditionings servent le cycle, ils ne le dominent pas.",
  "Aucun échec sur bench, squat, clean ou press.",
  "RPE 9 maximum sur les semaines lourdes; RPE 10 = erreur de gestion.",
  "Si le bas du dos ou les coudes deviennent sensibles : réduire le volume accessoire avant de toucher au mouvement principal."
];

window.COACH_BERTIN_PROGRAMS.force_performance.dayIntentions = {
  lundi: "Bench lourd + tirage lourd. Construire la force sans WOD destructeur.",
  mardi: "Squat et chaîne postérieure. Développer des jambes fortes capables d'encaisser la densité.",
  jeudi: "Haltéro, press et skill muscle-up. Force explosive et technique sous fatigue légère.",
  vendredi: "Force secondaire + résistance musculaire CrossFit courte. Spécifique, mais contrôlé."
};

window.COACH_BERTIN_PROGRAMS.force_performance.dayMeta = {
  lundi:   {label:"Lundi",   base:"Bench + tirage",       focus:"Force bench, tirage lourd, triceps utiles."},
  mardi:   {label:"Mardi",   base:"Squat + densité",      focus:"Force jambes, chaîne postérieure, tolérance squat."},
  jeudi:   {label:"Jeudi",   base:"Clean + press + skill",focus:"Haltéro, strict press, préparation muscle-up."},
  vendredi:{label:"Vendredi",base:"Force-résistance",    focus:"Front squat, tirage, WOD court spécifique."}
};
