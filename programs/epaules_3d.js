// Coach Bertin V50.6 — Phase 1 : Épaules 3D + Triceps (6 semaines)
// Objectif : spécialisation épaules/triceps crédible, 4 jours/semaine, 55-60 min.
// Structure : lundi push + épaules session 1, mardi pull/rear delt, jeudi legs zéro épaules, vendredi épaules session 2 angles différents + power clean technique APRÈS les épaules.

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.shoulders3d = {
  id: "shoulders3d",
  label: "Épaules 3D + Triceps — Phase 1",
  phase: 1,
  phaseName: "Esthétique / Récupération",
  phaseEnd: "fin août 2025",
  nextPhase: "hypertrophy_base",
  impact: "Spécialisation épaules rondes et triceps avec récupération locale protégée. Lundi = push/latéral/triceps, mardi = pull/rear delt/biceps, jeudi = jambes/core sans épaules, vendredi = épaules complètes avec angles différents + power clean technique léger après les épaules.",
  weekLabels: ["S1 Base","S2 Technique","S3 Volume","S4 Surcharge","S5 Intensité","S6 Deload"],
  weekGoals: [
    "Repères techniques, amplitude complète, RPE 7-8, aucune série à l'échec.",
    "Même qualité, légère densité en plus. Contrôle strict sur les isolations.",
    "Volume haut. Plus de séries utiles, mais aucun doublon inutile de mouvements similaires.",
    "Semaine la plus chargée. Densité forte, technique parfaite, RPE 8-9 max.",
    "Intensité contrôlée. Un peu moins de volume, charges plus sérieuses, aucune rep laide.",
    "Deload actif. Volume réduit, charges réduites, récupérer coudes/épaules/tendons."
  ],
  sets: ["4 x 10","5 x 8-10","5 x 10","5 x 8","4 x 8 lourd","3 x 10 léger"],
  targetReps: [10,10,10,8,8,10],
  mult: [0.55,0.58,0.62,0.66,0.70,0.50],
  rest: "0:45–2:30",
  tag: "épaules 3D"
};

function shouldersWeekPlan(week){
  return({
    1:{label:"S1 Base",note:"Qualité et repères. RPE 7-8. Aucun échec.",
       incline:"3×10",inclineLoad:"55 lb / main",press:"3×8-10",pressLoad:"110 lb",lat:"4×15-20",triOh:"4×10-15",triPush:"3×12-20",
       row:"4×10",pull:"3×8",rear:"4×15-20",face:"2×15-20",trap:"2×12",curl:"3×10-15",
       squat:"5×5",squatLoad:"165 lb",hip:"3×10",hinge:"3×10",
       shPress:"3×10",shPressLoad:"léger",lat2:"3×15-20",rear2:"3×15-20",face2:"3×15-20",serratus:"2×12/côté",triFri:"2×12-15",clean:"5×2 léger",cleanLoad:"115-135 lb",wodNote:"pacing propre"},
    2:{label:"S2 Technique",note:"Même qualité, transitions plus courtes. Toujours 1-2 reps en réserve.",
       incline:"4×8-10",inclineLoad:"55-60 lb / main",press:"4×8",pressLoad:"115 lb",lat:"5×12-20",triOh:"4×10-15",triPush:"3×12-20",
       row:"5×8-10",pull:"4×6-8",rear:"4×15-20",face:"3×15-20",trap:"2×12-15",curl:"3×10-15",
       squat:"5×5",squatLoad:"175 lb",hip:"3×10",hinge:"3×10",
       shPress:"3×8-10",shPressLoad:"léger à modéré",lat2:"3×15-20",rear2:"3×15-20",face2:"3×15-20",serratus:"2×12-15/côté",triFri:"2×12-15",clean:"5×2 léger",cleanLoad:"125-145 lb",wodNote:"contrôlé"},
    3:{label:"S3 Volume",note:"Volume utile plus élevé. Pas de mouvement redondant juste pour remplir.",
       incline:"4×8-10",inclineLoad:"60 lb / main",press:"4×8-10",pressLoad:"120 lb",lat:"5×15-20",triOh:"4×12-15",triPush:"3×15-20",
       row:"4×8",pull:"4×6-8",rear:"5×15-20",face:"3×15-20",trap:"3×12-15",curl:"3×10-15",
       squat:"5×4",squatLoad:"185 lb",hip:"4×8-10",hinge:"3×10",
       shPress:"4×8-10",shPressLoad:"modéré",lat2:"4×12-20",rear2:"4×15-20",face2:"3×15-20",serratus:"3×12-15/côté",triFri:"3×12-15",clean:"5×2 technique",cleanLoad:"135-155 lb",wodNote:"modéré"},
    4:{label:"S4 Surcharge",note:"Semaine la plus dense. RPE 8-9 max, aucune compensation.",
       incline:"4×8",inclineLoad:"60-65 lb / main",press:"4×8",pressLoad:"125 lb",lat:"5×12-20",triOh:"4×10-15",triPush:"3×12-20",
       row:"5×8",pull:"4×6",rear:"5×15-20",face:"3×15-20",trap:"3×12-15",curl:"3×10-12",
       squat:"5×4",squatLoad:"190 lb",hip:"4×8",hinge:"3×8-10",
       shPress:"4×8",shPressLoad:"modéré",lat2:"4×12-20",rear2:"4×15-20",face2:"3×15-20",serratus:"3×12-15/côté",triFri:"3×12-15",clean:"5×2 technique",cleanLoad:"145-165 lb",wodNote:"fort mais pas redline"},
    5:{label:"S5 Intensité",note:"Charges les plus sérieuses. Volume légèrement réduit, qualité avant ego.",
       incline:"3×8 lourd",inclineLoad:"65 lb / main",press:"3×8",pressLoad:"130 lb",lat:"4×12-18",triOh:"4×8-12",triPush:"2×12-15",
       row:"4×6",pull:"4×5-6",rear:"4×12-20",face:"2×15-20",trap:"2×12",curl:"3×8-12",
       squat:"5×3",squatLoad:"195 lb",hip:"3×8",hinge:"3×8",
       shPress:"3×8",shPressLoad:"modéré",lat2:"3×12-18",rear2:"3×12-20",face2:"2×15-20",serratus:"2×12/côté",triFri:"2×12",clean:"4×2 technique",cleanLoad:"145-165 lb",wodNote:"court et propre"},
    6:{label:"S6 Deload",note:"Deload actif. Réduire volume et charge. Sortir plus frais.",
       incline:"2×10 léger",inclineLoad:"45-50 lb / main",press:"2×10 léger",pressLoad:"95 lb",lat:"2×15",triOh:"2×12",triPush:"2×12",
       row:"3×10 léger",pull:"2×6 facile",rear:"2×15",face:"2×15",trap:"2×10",curl:"2×12",
       squat:"3×5 léger",squatLoad:"140 lb",hip:"2×10 léger",hinge:"2×10 léger",
       shPress:"2×10 léger",shPressLoad:"très léger",lat2:"2×15",rear2:"2×15",face2:"2×15",serratus:"2×10/côté",triFri:"2×12",clean:"3×2 facile",cleanLoad:"95-115 lb",wodNote:"facile"}
  })[week] || {label:"S1",note:"",incline:"3×10",inclineLoad:"55 lb / main",press:"3×8-10",pressLoad:"110 lb",lat:"4×15-20",triOh:"4×10-15",triPush:"3×12-20",row:"4×10",pull:"3×8",rear:"4×15-20",face:"2×15-20",trap:"2×12",curl:"3×10-15",squat:"5×5",squatLoad:"165 lb",hip:"3×10",hinge:"3×10",shPress:"3×10",shPressLoad:"léger",lat2:"3×15-20",rear2:"3×15-20",face2:"3×15-20",serratus:"2×12/côté",triFri:"2×12-15",clean:"5×2 léger",cleanLoad:"115-135 lb",wodNote:"contrôlé"};
}
function ex(name,format,load,rest,note){return{name:name,format:format,load:charge(name,load||"—"),rest:rest||"—",note:note||""};}
function exFixed(name,format,load,rest,note){return{name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function shouldersBlocks(day,week){
  var p=shouldersWeekPlan(week);
  var isDeload=week===6;

  // LUNDI — Push + épaules session 1. Pas de rear delt, pas de face pull, pas de biceps.
  if(day==="lundi")return[
    {time:"7 min",title:"Warm-up push + rotator cuff",tag:"Préparation",kind:"warmup",
     text:"2 rounds : Band External Rotation — elbow tucked 12/side + Band Internal Rotation — elbow tucked 12/side + Scap Push-up 8 + Wall Slide 8. Then : Incline DB Press light 10 + Strict Press ramp-up : empty bar×8, 40%×5."},

    {time:"10 min",title:"A. Incline DB Press",tag:"Masse",kind:"main",
     exercises:[exFixed("Incline DB Press",p.incline,p.inclineLoad,"1:30-2:00","Haut de pec + deltoïde antérieur. Mouvement de masse, amplitude propre, RPE 7-8. Pas d'échec.")]},

    {time:"9 min",title:"B. Strict Press",tag:"Force",kind:"main",
     exercises:[exFixed("Strict Press",p.press,p.pressLoad,"2:00","Force overhead sous-maximale. RPE 7-8. Stop si compensation lombaire.")]},

    {time:"8 min",title:"C. Deltoïde latéral",tag:"Hypertrophie",kind:"accessory",
     exercises:[exFixed("Lateral Raise câble bas",p.lat,"15-20 lb","0:45-1:00","Session 1 : câble bas = tension constante. Épaule basse, aucun élan, RPE 8.")]},

    {time:"10 min",title:"D. Triceps",tag:"Hypertrophie",kind:"accessory",
     text:"Overhead en premier pour la longue portion, pushdown ensuite pour finir sans charger l'épaule.",
     exercises:[
       ex("D1. Overhead Rope Extension",p.triOh,"50-60 lb","0:30 avant D2","Longue portion triceps. Coudes stables. Étirement contrôlé, pas agressif."),
       ex("D2. Triceps Rope Pushdown",p.triPush,"60-70 lb","1:00 après D2","Coudes fixes, extension complète, RPE 8. Pas de balançoire.")
     ]},

    {time:"8 min",title:"E. WOD court push",tag:"Conditioning",kind:"wod",
     text:"AMRAP 8 : 8 burpees contrôlés + 10 cal row + 12 sit-ups. "+p.wodNote+". Ce n'est pas un test : garder le moteur sans tuer les épaules."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Doorway pec stretch 1 min/côté + lat stretch sur rig 1 min/côté + triceps overhead stretch 1 min + respiration 1 min."}
  ];

  // MARDI — Pull / dos / arrière d'épaule / biceps. Pas de triceps, pas de press.
  if(day==="mardi")return[
    {time:"7 min",title:"Warm-up pull + scapula",tag:"Préparation",kind:"warmup",
     text:"Row easy 2 min + Band External Rotation — elbow tucked 15/side + Band Pull Apart 15 + Scap Ring Row 8 + Face Pull light 20 + Chest Supported Row ramp-up 1-2 sets."},

    {time:"11 min",title:"A. Row principal",tag:"Dos",kind:"main",
     exercises:[ex("Chest Supported Row",p.row,week>=3&&week<=5?"125 lb":"115 lb","1:45-2:00","Tirage strict, poitrine collée, pas de swing. RPE 8.")]},

    {time:"9 min",title:"B. Tirage vertical / anneaux",tag:"Dos",kind:"accessory",
     exercises:[exFixed("Weighted Pull-up / Ring Row lourd",p.pull,week>=4&&!isDeload?"+15 à +30 lb ou angle difficile":"poids du corps / angle difficile","1:30","Choisir la version propre. Stop avant les coudes ou les épaules irritées.")]},

    {time:"12 min",title:"C. Rear delts / posture",tag:"Arrière épaule",kind:"accessory",
     exercises:[
       exFixed("C1. Rear Delt Fly câble bas",p.rear,"15-20 lb","0:30 avant C2","Session 1 arrière d'épaule : câble bas, bras long, épaule basse. Ne pas transformer en rowing."),
       ex("C2. Face Pull",p.face,"60-70 lb","0:30 avant C3","Santé scapulaire. Rotation externe, cou relâché. RPE 7-8."),
       ex("C3. Trap-3 Raise",p.trap,"léger","1:00 après C3","Trap inférieur. Pouce vers le haut, zéro shrug.")
     ]},

    {time:"6 min",title:"D. Biceps",tag:"Bras",kind:"accessory",
     exercises:[exFixed("DB Curl / Cable Curl",p.curl,"modéré","0:45-1:00","Biceps avec le pull seulement. Contrôle, pas d'élan du dos.")]},

    {time:"10 min",title:"E. WOD pull / engine",tag:"Conditioning",kind:"wod",
     text:"EMOM 10 : min 1 = 12 cal row ; min 2 = 8-10 ring rows stricts. "+p.wodNote+". RPE global 7-8, pas de sprint."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Child pose lat stretch 1 min/côté + open book lent 1 min/côté + neck/trap stretch léger 1 min + respiration 1 min."}
  ];

  // JEUDI — jambes / core seulement. Aucune épaule directe, aucun bras direct.
  if(day==="jeudi")return[
    {time:"8 min",title:"Warm-up jambes",tag:"Préparation",kind:"warmup",
     text:"Bike facile 3 min + ankle rocks 10/côté + world's greatest stretch 5/côté + glute bridge 2×15 + goblet squat léger 2×10 + montée squat."},

    {time:"14 min",title:"A. Squat principal",tag:"Jambes",kind:"main",
     exercises:[exFixed("Front Squat",p.squat,p.squatLoad,"2:00","RPE 7-8. Dos protégé, aucune tentative héroïque.")]},

    {time:"12 min",title:"B. Unilatéral / fessiers",tag:"Jambes",kind:"accessory",
     exercises:[
       ex("B1. Bulgarian Split Squat",isDeload?"2×8/jambe":"3×8-10/jambe","45-55 lb / main","0:45 avant B2","Amplitude propre, genou stable."),
       ex("B2. Hip Thrust",isDeload?"2×10 léger":p.hip,"225-275 lb","1:00 après B2","Pause en haut. Fessiers, pas lombaires.")
     ]},

    {time:"10 min",title:"C. Chaîne postérieure / core",tag:"Accessoire",kind:"accessory",
     exercises:[
       ex("C1. DB RDL",isDeload?"2×10 léger":p.hinge,"60-70 lb / main","0:45 avant C2","Ischios. Dos neutre. Aucun ego."),
       exFixed("C2. Dead Bug / Hollow Hold",isDeload?"2 séries faciles":"3 séries","poids du corps","0:45 après C2","Côtes basses, respiration contrôlée.")
     ]},

    {time:"8 min",title:"D. WOD jambes / engine",tag:"Conditioning",kind:"wod",
     text:"For time 21-15-9 : Cal Bike + Box Step-ups. "+p.wodNote+". Cap 8 min. Zéro épaules directes, zéro bras direct."},

    {time:"5 min",title:"E. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Couch stretch 1 min/côté + ankle stretch 1 min/côté + hamstring stretch 1 min/côté + respiration 1 min."}
  ];

  // VENDREDI — Épaules session 2 angles différents + Power Clean technique APRÈS les épaules.
  return[
    {time:"7 min",title:"Warm-up shoulders 3D + rotator cuff",tag:"Préparation",kind:"warmup",
     text:"2 rounds : Band External Rotation — elbow tucked 12/side + Band Internal Rotation — elbow tucked 12/side + Serratus Wall Slide 8 + PVC Pass-through 10. Then : DB Shoulder Press light 12 + Lateral Raise very light 15."},

    {time:"10 min",title:"A. Press contrôlé",tag:"Épaules",kind:"main",
     exercises:[exFixed("DB Shoulder Press / Landmine Press",p.shPress,p.shPressLoad,"1:15-1:30","Session 2 : press contrôlé, pas strict press lourd. RPE 7-8, amplitude propre.")]},

    {time:"12 min",title:"B. Giant set épaules 3D — angle différent",tag:"Giant set",kind:"accessory",
     text:"Vendredi = angle différent du lundi/mardi. Utiliser haltères ou machine si possible, pas juste refaire câble bas identique.",
     exercises:[
       exFixed("B1. Lateral Raise haltères / machine",p.lat2,"modéré","—","Deltoïde latéral. Variante différente du câble bas de lundi."),
       exFixed("B2. Rear Delt Fly haltères / machine",p.rear2,"modéré","—","Arrière d'épaule. Variante différente du câble bas de mardi."),
       ex("B3. Face Pull câble",p.face2,"50-70 lb","1:15 après B3","Posture/scapulas. RPE 7-8, cou relâché.")
     ]},

    {time:"6 min",title:"C. Serratus",tag:"Posture",kind:"accessory",
     exercises:[exFixed("Serratus Cable Punch",p.serratus,"léger à modéré","0:45","Serratus et contrôle scapulaire. Cage basse, protraction complète sans hausser l'épaule.")]},

    {time:"6 min",title:"D. Triceps rappel",tag:"Bras",kind:"accessory",
     exercises:[ex("Overhead Rope Extension",p.triFri,"50-60 lb","1:00","Rappel triceps seulement. RPE 8 max, coudes propres.")]},

    {time:"6 min",title:"E. Power Clean technique",tag:"Haltéro",kind:"accessory",
     exercises:[exFixed("Power Clean technique",p.clean,p.cleanLoad,"1:00-1:30","Après les épaules : maintien du pattern seulement. Léger/modéré, vitesse propre, aucune rep grindée.")]},

    {time:"8 min",title:"F. WOD full body court",tag:"Conditioning",kind:"wod",
     text:"AMRAP 8 : 5 power cleans légers + 8 wall balls 14 lb + 10 cal row. "+p.wodNote+". Modéré, pas redline."},

    {time:"5 min",title:"G. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Lat stretch 1 min/côté + front rack stretch 1 min + pec stretch 1 min + wrist stretch 1 min."}
  ];
}

window.COACH_BERTIN_PROGRAMS.shoulders3d.getBlocks = function(day, week){
  return shouldersBlocks(day, week);
};

window.COACH_BERTIN_PROGRAMS.shoulders3d.getWodText = function(day, week){
  var b = shouldersBlocks(day, week).filter(function(x){ return x.kind === "wod"; })[0];
  return b ? b.text : "";
};

window.COACH_BERTIN_PROGRAMS.shoulders3d.cycleRules = [
  "Structure stricte : lundi push/latéral/triceps, mardi pull/rear delts/biceps, jeudi jambes/core, vendredi épaules angles différents + haltéro technique.",
  "Aucun travail direct du même muscle deux jours consécutifs.",
  "Vendredi : Power Clean APRÈS les épaules, léger/modéré, technique seulement.",
  "Lundi et vendredi ne doivent pas répéter exactement le même angle : câble bas lundi, haltères/machine vendredi.",
  "Aucun échec sur press, squat, power clean ou isolations.",
  "Deltoïde latéral : strict, pas d'élan, pas de trap supérieur.",
  "Triceps : overhead extension prioritaire, mais jamais au prix des coudes.",
  "WODs courts et cohérents avec le jour : push lundi, pull mardi, jambes jeudi, full body vendredi."
];

window.COACH_BERTIN_PROGRAMS.shoulders3d.dayIntentions = {
  lundi: "Push + épaules session 1 : incline DB, strict press, câble latéral, triceps. Aucun pull, aucun biceps, aucun rear delt direct.",
  mardi: "Pull + arrière d'épaule + biceps : dos, rear delt, face pull, trap-3, curl. Aucun triceps, aucun press.",
  jeudi: "Jambes + core seulement. Aucune épaule directe, aucun bras direct.",
  vendredi: "Épaules session 2 angles différents + power clean technique après les épaules. Objectif masse avant haltéro."
};

window.COACH_BERTIN_PROGRAMS.shoulders3d.dayMeta = {
  lundi:   {label:"Lundi",   base:"Push + delts/triceps",      focus:"Incline DB press, strict press, lateral raise câble, triceps, WOD court."},
  mardi:   {label:"Mardi",   base:"Pull + rear delts/biceps", focus:"Row, pull-up/ring row, rear delt, face pull, trap-3, curls."},
  jeudi:   {label:"Jeudi",   base:"Jambes + core",            focus:"Squat, unilatéral, fessiers/ischios, core, WOD jambes."},
  vendredi:{label:"Vendredi",base:"Épaules 3D + technique",   focus:"Press contrôlé, giant set angle différent, serratus, triceps, power clean technique après épaules."}
};
