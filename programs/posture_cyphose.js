// Coach Bertin V49.5 — Programme autonome : Posture / Cyphose
// Objectif : extension thoracique, serratus, trap inférieur, rotateurs externes,
// haut du dos, ouverture cage/pecs/lats, chaîne postérieure sans surcharge lombaire.
// V49.5 : le cycle posture n'utilise plus la structure PPL générique.

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.posture = {
  id: "posture",
  label: "Posture / cyphose",
  phase: 0,
  phaseName: "Correction posture / mobilité scapulo-thoracique",
  impact: "Cycle correctif : haut du dos, serratus, trap inférieur, mobilité thoracique, ouverture de cage, gainage positionnel. Aucun WOD destructeur.",
  weekLabels: ["S1 Alignement","S2 Volume contrôle","S3 Force posture","S4 Deload intégration"],
  weekGoals: [
    "Réapprendre les positions : cage basse, scapulas contrôlées, respiration thoracique.",
    "Augmenter le volume correctif sans douleur aux épaules, coudes ou cou.",
    "Renforcer les positions : tirages plus solides, carries, chaîne postérieure propre.",
    "Deload actif : conserver la mobilité et intégrer les gains sans fatigue."
  ],
  sets: ["4 x 8 propre", "4 x 10 contrôlé", "5 x 6 solide", "3 x 8 léger"],
  targetReps: [8,10,6,8],
  mult: [0.62,0.66,0.72,0.50],
  rest: "1:00–2:00",
  tag: "posture"
};

function postureWeekPlan(week){
  return ({
    1:{label:"S1 Alignement",note:"Contrôle avant charge. Sentir serratus, trap inférieur et extension thoracique.",rowLoad:"115 lb",hingeLoad:"60 lb / main",pressLoad:"léger",carryLoad:"modéré",density:"facile"},
    2:{label:"S2 Volume contrôle",note:"Un peu plus de volume. Aucun shrug, aucun cou crispé, aucune douleur antérieure d'épaule.",rowLoad:"120-125 lb",hingeLoad:"65 lb / main",pressLoad:"léger à modéré",carryLoad:"modéré lourd",density:"modéré"},
    3:{label:"S3 Force posture",note:"Semaine la plus solide. Charges plus lourdes, mais posture impeccable. Pas de grind.",rowLoad:"130-140 lb",hingeLoad:"70 lb / main",pressLoad:"modéré",carryLoad:"lourd propre",density:"contrôlé"},
    4:{label:"S4 Deload intégration",note:"Réduire charge et volume. Garder la qualité, respirer mieux, sortir plus droit.",rowLoad:"95-105 lb",hingeLoad:"50-55 lb / main",pressLoad:"très léger",carryLoad:"facile",density:"facile"}
  })[week] || {label:"S1 Alignement",note:"Contrôle.",rowLoad:"115 lb",hingeLoad:"60 lb / main",pressLoad:"léger",carryLoad:"modéré",density:"facile"};
}

function pstEx(name,format,load,rest,note){
  return {name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};
}

function postureBlocks(day,week){
  var p = postureWeekPlan(week);
  var deload = week === 4;
  var strong = week === 3;

  // LUNDI — Haut du dos + serratus
  if(day === "lundi") return [
    {time:"8 min",title:"Warm-up thoracique",tag:"Préparation",kind:"warmup",
     text:"Row facile 2 min + foam roller extension thoracique 6 reps + open book 6/côté + wall slides 2×10 + scap push-up 2×10."},

    {time:"14 min",title:"A. Tirage postural principal",tag:"Dos",kind:"main",
     exercises:[pstEx("Chest Supported Row",deload?"3×8 léger":strong?"5×6":"4×8-10",p.rowLoad,strong?"2:00":"1:30-1:45","Poitrine collée, cou long, omoplates vers les poches arrière. Aucun élan.")]},

    {time:"12 min",title:"B. Serratus + trap inférieur",tag:"Correctif",kind:"accessory",
     text:"Alterner B1 → B2. Repos après B2. Qualité musculaire, pas ego.",
     exercises:[
       pstEx("B1. Serratus Cable Punch",deload?"2×12/côté":"3×12-15/côté","léger à modéré","0:30 avant B2","Cage basse. Protraction complète sans hausser l'épaule."),
       pstEx("B2. Trap-3 Raise",deload?"2×12":"3×12-15","léger","1:00 après B2","Pouce vers le haut. Cherche trap inférieur, pas trap supérieur.")
     ]},

    {time:"10 min",title:"C. Arrière épaule / rotation externe",tag:"Accessoire",kind:"accessory",
     exercises:[
       pstEx("C1. Face Pull",deload?"2×15":"3×15-20","60-70 lb","0:30","Tirer vers le visage, rotation externe en fin."),
       pstEx("C2. Rear Delt Fly",deload?"2×15":"3×15-20","20-25 lb","0:45","Bras longs, épaules basses, aucun swing.")
     ]},

    {time:deload?"6 min":"8 min",title:"D. Conditioning posture",tag:"Conditioning",kind:"wod",
     text:(deload?"Row 6 min zone 2 facile.":"EMOM 8 : min 1 = 10 cal row ; min 2 = 10 ring rows stricts.")+" RPE 6-7. Le but est de sortir plus droit, pas de gagner le WOD."},

    {time:"5 min",title:"E. Mobilité cage",tag:"Mobilité",kind:"mobility",
     text:"Doorway pec stretch 1 min/côté + lat stretch sur rig 1 min/côté + respiration 90/90 1 min."}
  ];

  // MARDI — Hanches + chaîne postérieure + respiration
  if(day === "mardi") return [
    {time:"9 min",title:"Warm-up hanches / colonne",tag:"Préparation",kind:"warmup",
     text:"Bike 3 min + cat-cow 10 reps + world's greatest stretch 5/côté + glute bridge 2×15 + hip airplane assisté 5/côté."},

    {time:"14 min",title:"A. Charnière posturale",tag:"Chaîne postérieure",kind:"main",
     exercises:[pstEx("DB RDL",deload?"3×8 léger":strong?"4×8":"4×10",p.hingeLoad,strong?"1:45":"1:30","Dos neutre, lats engagés, étirement ischios. Stop si lombaires prennent tout.")]},

    {time:"12 min",title:"B. Fessiers + gainage anti-extension",tag:"Correctif",kind:"accessory",
     exercises:[
       pstEx("B1. Hip Thrust",deload?"2×10":"3×10-12",deload?"185-225 lb":strong?"275-315 lb":"225-275 lb","0:45 avant B2","Pause en haut. Bassin neutre, pas d'hyperextension."),
       pstEx("B2. Dead Bug",deload?"2×8/côté":"3×8-10/côté","poids du corps","1:00 après B2","Côtes basses, expiration longue, contrôle total.")
     ]},

    {time:"9 min",title:"C. Unilatéral propre",tag:"Accessoire",kind:"accessory",
     exercises:[pstEx("Bulgarian Split Squat",deload?"2×8/jambe":"3×8-10/jambe",deload?"35 lb / main":strong?"50-60 lb / main":"40-50 lb / main","1:00","Reste haut, bassin stable, genou propre.")]},

    {time:deload?"6 min":"10 min",title:"D. Zone 2 posture",tag:"Conditioning",kind:"wod",
     text:(deload?"Bike 6 min facile, nasal si possible.":"Bike 10 min zone 2 avec posture haute. Toutes les 2 min : 5 respirations lentes cage basse.")+" Aucun sprint."},

    {time:"5 min",title:"E. Mobilité hanches",tag:"Mobilité",kind:"mobility",
     text:"Couch stretch 1 min/côté + hamstring stretch 1 min/côté + respiration crocodile 1 min."}
  ];

  // JEUDI — Overhead mobility + scapula
  if(day === "jeudi") return [
    {time:"9 min",title:"Warm-up overhead",tag:"Préparation",kind:"warmup",
     text:"Row 2 min + PVC pass through 2×10 + wall slides 2×10 + lat stretch 45 sec/côté + scap pull-ups 2×6 + front rack rotations 10 reps."},

    {time:"13 min",title:"A. Press technique posturale",tag:"Overhead",kind:"main",
     exercises:[pstEx("Strict Press",deload?"3×6 léger":strong?"5×5 technique":"4×6-8",deload?"85-95 lb":strong?"115-125 lb":"95-115 lb",strong?"2:00":"1:30-1:45","Cage basse, fessiers serrés, trajectoire verticale. Pas de compensation lombaire.")]},

    {time:"12 min",title:"B. Scapula overhead",tag:"Correctif",kind:"accessory",
     exercises:[
       pstEx("B1. Wall Slide Lift-off",deload?"2×8":"3×8-10","poids du corps","0:30 avant B2","Lent. Cherche rotation supérieure sans trap supérieur."),
       pstEx("B2. Face Pull to External Rotation",deload?"2×12":"3×12-15","léger à modéré","1:00 après B2","Rotation externe propre, coudes hauts, cou relâché.")
     ]},

    {time:"10 min",title:"C. Tirage vertical contrôlé",tag:"Accessoire",kind:"accessory",
     exercises:[
       pstEx("C1. Weighted Pull-up",deload?"2×5 strict":"3×5-8",deload?"poids du corps":strong?"+20 à +30 lb":"+10 à +20 lb","1:15","Strict, amplitude propre. Remplacer par ring rows si coudes sensibles."),
       pstEx("C2. Serratus Wall Slide",deload?"2×10":"3×10-12","mini-band optionnel","0:45","Pousser le mur, cage basse.")
     ]},

    {time:deload?"6 min":"8 min",title:"D. EMOM qualité",tag:"Conditioning",kind:"wod",
     text:(deload?"SkiErg 6 min facile.":"EMOM 8 : min 1 = 8 cal SkiErg ; min 2 = 8 strict press très légers ou PVC overhead hold 20 sec.")+" RPE 6-7. Qualité overhead seulement."},

    {time:"5 min",title:"E. Mobilité overhead",tag:"Mobilité",kind:"mobility",
     text:"Lat stretch 1 min/côté + pec minor stretch 1 min/côté + thoracic extension breathing 1 min."}
  ];

  // VENDREDI — Full body posture + conditioning léger
  return [
    {time:"8 min",title:"Warm-up full body posture",tag:"Préparation",kind:"warmup",
     text:"Row facile 3 min + band pull-aparts 2×20 + goblet squat pry 1 min + hollow body breathing 5 reps + farmer carry léger 2×20 m."},

    {time:"13 min",title:"A. Carry postural",tag:"Gainage",kind:"main",
     exercises:[pstEx("Farmer Carry",deload?"3×30 m":"5×40 m",p.carryLoad,strong?"1:30":"1:00-1:15","Grandis-toi. Côtes basses, épaules basses, marche contrôlée.")]},

    {time:"12 min",title:"B. Full body correctif",tag:"Correctif",kind:"accessory",
     exercises:[
       pstEx("B1. Goblet Squat Tempo",deload?"2×8":"3×10","24-32 kg","0:30 avant B2","Tempo 3 sec descente. Torse haut, respiration calme."),
       pstEx("B2. Ring Row Strict",deload?"2×8":"3×10-12","poids du corps","1:00 après B2","Poitrine aux anneaux, omoplates fortes.")
     ]},

    {time:"10 min",title:"C. Reset scapula / core",tag:"Accessoire",kind:"accessory",
     exercises:[
       pstEx("C1. Pallof Press",deload?"2×10/côté":"3×10-12/côté","léger à modéré","0:30","Anti-rotation. Bassin stable."),
       pstEx("C2. Band Pull Apart",deload?"2×20":"3×25","élastique","0:45","Volume facile, qualité posturale.")
     ]},

    {time:deload?"8 min":"12 min",title:"D. Conditioning léger",tag:"Conditioning",kind:"wod",
     text:(deload?"Row 8 min zone 2 facile.":"AMRAP 12 qualité : 8 cal row + 10 air squats tempo + 12 band pull-aparts + 20 m farmer carry léger.")+" RPE 6-7. Respiration et posture > score."},

    {time:"5 min",title:"E. Mobilité finale",tag:"Mobilité",kind:"mobility",
     text:"Open book 1 min/côté + doorway stretch 1 min/côté + lat stretch 1 min + respiration 90/90."}
  ];
}

window.COACH_BERTIN_PROGRAMS.posture.getWeekNote = function(week){
  return postureWeekPlan(week).note || "";
};

window.COACH_BERTIN_PROGRAMS.posture.getBlocks = function(day, week){
  return postureBlocks(day, week);
};

window.COACH_BERTIN_PROGRAMS.posture.getWodText = function(day, week){
  var b = postureBlocks(day, week).filter(function(x){ return x.kind === "wod"; })[0];
  return b ? b.text : "";
};

window.COACH_BERTIN_PROGRAMS.posture.cycleRules = [
  "Objectif posture : sortir plus droit, pas finir détruit.",
  "Le cou doit rester relâché : si les trapèzes supérieurs dominent, baisse la charge.",
  "Cage basse, respiration contrôlée, amplitude propre.",
  "Les conditionings sont légers à modérés : RPE 6-7, aucun redline.",
  "Douleur antérieure d'épaule ou irritation coude : remplace par tirage strict ou mobilité."
];

window.COACH_BERTIN_PROGRAMS.posture.dayIntentions = {
  lundi: "Haut du dos et serratus : renforcer ce qui ouvre la cage et ramène les épaules en bonne position.",
  mardi: "Chaîne postérieure et respiration : hanches fortes, bas du dos protégé, cage mieux contrôlée.",
  jeudi: "Overhead propre : améliorer la mobilité scapulo-thoracique sans compenser avec les lombaires.",
  vendredi: "Full body posture : carries, gainage et conditioning léger pour intégrer les positions."
};

window.COACH_BERTIN_PROGRAMS.posture.dayMeta = {
  lundi:   {label:"Lundi",   base:"Haut du dos + serratus", focus:"Scapulas, trap inférieur, serratus, ouverture thoracique."},
  mardi:   {label:"Mardi",   base:"Hanches + respiration",  focus:"Chaîne postérieure, hanches, respiration et posture."},
  jeudi:   {label:"Jeudi",   base:"Overhead + scapula",    focus:"Mobilité overhead, rotateurs externes, contrôle scapulaire."},
  vendredi:{label:"Vendredi",base:"Full body posture",     focus:"Intégrer posture dans mouvements globaux et conditioning léger."}
};
