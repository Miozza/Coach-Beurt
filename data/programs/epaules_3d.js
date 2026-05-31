// Coach Bertin V48.1 — Phase 1 : Épaules 3D + Triceps (6 semaines)
// Objectif : masse épaules, triceps, récupération post-compétition, été relaxe
// S1-S2 : base technique sous-maximale
// S3-S4 : volume progressif, charges sérieuses
// S5 : intensité maximale du cycle
// S6 : deload actif, consolider les gains

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.shoulders3d = {
  id: "shoulders3d",
  label: "Épaules 3D + Triceps — Phase 1",
  phase: 1,
  phaseName: "Esthétique / Récupération",
  phaseEnd: "fin août 2025",
  nextPhase: "hypertrophy_base",
  impact: "Masse épaules rondes, triceps long, deltoïde latéral/arrière, trap inférieur. Charges progressives S1→S5, deload S6. Compatible chaleur estivale.",
  weekLabels: ["S1 Base","S2 Technique","S3 Volume","S4 Surcharge","S5 Intensité","S6 Deload"],
  weekGoals: [
    "Repères techniques, amplitude complète, épaules fraîches post-compétition.",
    "Même qualité, légère augmentation densité. Aucun échec.",
    "Volume augmente. Supersets plus serrés. Charges +5 lb sur principaux.",
    "Semaine la plus volumineuse. Densité maximale. Technique parfaite.",
    "Charges les plus lourdes du cycle. Volume réduit. Qualité > quantité.",
    "Deload actif. -40% volume, -20% charge. Récupérer les tendons."
  ],
  sets: ["4 x 12","4 x 10","5 x 10","5 x 8","4 x 8 lourd","3 x 10 léger"],
  targetReps: [12,10,10,8,8,10],
  mult: [0.55,0.58,0.62,0.66,0.70,0.50],
  rest: "1:15–1:45",
  tag: "épaules 3D"
};


// ─── Séances complètes du programme Épaules 3D ──────────────────────────────
// V48.1 : le contenu réel du programme vit dans ce fichier, pas dans app.js.

function shouldersWeekPlan(week){
  return({
    1:{label:"S1 Base",      note:"Qualité, amplitude complète, aucun échec. Apprendre les positions câble.",main:"4 x 10",     mainRest:"2:00",wodNote:"Pacing propre"},
    2:{label:"S2 Technique", note:"Même qualité, légère augmentation densité. Câble bas : sentir la tension en bas.",main:"5 x 8-10",  mainRest:"2:00",wodNote:"Transitions plus courtes"},
    3:{label:"S3 Volume",    note:"Volume augmente. +5 lb strict press. Superset plus serrés. Rappel jeudi → 3×20.",main:"5 x 10",    mainRest:"2:00",wodNote:"Modéré, épaules déjà fatiguées"},
    4:{label:"S4 Surcharge", note:"Semaine la plus volumineuse. Densité maximale. Technique parfaite.",main:"5 x 8",     mainRest:"2:15",wodNote:"Fort mais pas redline"},
    5:{label:"S5 Intensité", note:"Charges les plus lourdes du cycle. Volume réduit. Qualité avant tout.",main:"4 x 8 lourd",mainRest:"2:30",wodNote:"Fort mais propre"},
    6:{label:"S6 Deload",    note:"Deload actif. -40% volume, -20% charge. Récupérer les tendons.",main:"3 x 10 léger",mainRest:"1:45",wodNote:"Facile, technique"}
  })[week]||{label:"S1",note:"",main:"4 x 10",mainRest:"2:00",wodNote:""};
}
function ex(name,format,load,rest,note){return{name:name,format:format,load:charge(name,load||"—"),rest:rest||"—",note:note||""};}
function exFixed(name,format,load,rest,note){return{name:name,format:format,load:load||"—",rest:rest||"—",note:note||""};}

function shouldersBlocks(day,week){
  var p=shouldersWeekPlan(week);
  var isDeload=week===6;
  var isHeavy=week>=4;

  // ── LUNDI : Push principal + Épaules 3D ──────────────────────────────────
  if(day==="lundi")return[
    {time:"8 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",
     text:"Row/Bike facile 3 min + PVC Pass Through 2×10 + Band Pull Apart 2×20 + Scap Push-up 2×10 + montée strict press : barre ×10, 40% ×5, 55% ×5."},

    {time:"14 min",title:"A. Mouvement principal",tag:"Force",kind:"main",
     exercises:[exFixed("Strict Press",p.main,
       week===1?"115 lb":week===2?"120 lb":week===3?"125 lb":week===4?"130 lb":week===5?"135 lb":"100 lb",
       p.mainRest,
       "RPE 7-8. Sous-maximal. Stop si compensation lombaire.")]},

    // B. Superset épaules — câble bas les deux
    {time:"12 min",title:"B. Superset épaules — câble bas",tag:"Superset",kind:"accessory",
     text:"Câble réglé au plus bas. Alterner B1 → B2. Repos seulement après B2. RPE 8 sur les deux (2 reps en réserve).",
     exercises:[
       exFixed("B1. Lateral Raise câble bas",isDeload?"2×15":"4×15-20","15-20 lb","0:30 avant B2",
         "Tension constante en bas du câble = meilleure activation. Arrêt 2 reps avant l'échec."),
       exFixed("B2. Rear Delt Fly câble bas",isDeload?"2×15":"4×15-20","15-20 lb","1:00 après B2",
         "Câble à hauteur de hanche, tirer vers l'arrière. Épaules basses. RPE 8.")
     ]},

    // C. Superset triceps — tout au câble
    {time:"12 min",title:"C. Superset triceps — câble",tag:"Superset",kind:"accessory",
     text:"Alterner C1 → C2. Repos seulement après C2. RPE 8 sur les deux.",
     exercises:[
       ex("C1. Triceps Rope Pushdown",isDeload?"2-3×12-15":"4×12-15","70 lb","0:30 avant C2",
         "Câble haut. Extension complète. RPE 8 — 2 reps en réserve. Coude fixe."),
       ex("C2. Face Pull",isDeload?"2-3×15-20":"4×15-20","70 lb","1:00 après C2",
         "Câble à hauteur des yeux. Tire vers le visage, rotation externe en fin. RPE 8.")
     ]},

    {time:"8 min",title:"D. WOD",tag:"Conditioning",kind:"wod",
     text:"AMRAP 8 : 8 burpees contrôlés + 10 cal row + 12 sit-ups. "+p.wodNote+". Pacing modéré — épaules déjà fatiguées."},

    {time:"0-3 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",
     text:"Band Pull Apart 2×30 ou câble Lateral Raise léger 1×20 chaque bras."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Doorway Pec Stretch 2 min + Lat Stretch sur rig 2 min + Triceps Overhead Stretch 1 min."}
  ];

  // ── MARDI : Pull principal + Posture ─────────────────────────────────────
  if(day==="mardi")return[
    {time:"8 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",
     text:"Row facile 3 min + Open Book 6/côté + Cat-Cow 10 reps + Scap Ring Row 2×8 + Band Face Pull 2×20 + 2 séries progressives de chest row."},

    {time:"13 min",title:"A. Mouvement principal",tag:"Dos",kind:"main",
     exercises:[ex("Chest Supported Row",
       week===1?"4×10":week===2?"5×10":week===3?"4×8":week===4?"5×8":week===5?"4×6":"3×10 léger",
       week>=3&&week<=5?"125 lb":"115 lb","1:45-2:00",
       "RPE 8. Tirage propre, pas de swing. Omoplate rétractée en haut.")]},

    // B. Superset rear delt — câble bas
    {time:"12 min",title:"B. Superset arrière épaule — câble bas",tag:"Superset",kind:"accessory",
     text:"Câble au plus bas. Alterner B1 → B2. Priorité posture. RPE 8 sur les deux.",
     exercises:[
       exFixed("B1. Rear Delt Fly câble bas",isDeload?"2-3×15":"4×15-20","15-20 lb","0:30 avant B2",
         "Meilleure tension que les haltères. Bras longs, trapèzes calmes. RPE 8."),
       ex("B2. Face Pull",isDeload?"2-3×15":"4×15-20","70 lb","1:00 après B2",
         "Câble à hauteur des yeux. Finition en rotation externe. RPE 8.")
     ]},

    // C. Superset scapulas
    {time:"9 min",title:"C. Superset scapulas",tag:"Posture",kind:"accessory",
     text:"Contrôle lent. Connexion musculaire prioritaire sur le poids.",
     exercises:[
       ex("C1. Trap-3 Raise",isDeload?"2×12":"3×15","léger","0:30 avant C2",
         "Câble ou haltère léger. Pouce vers le haut, trap inférieur activé. RPE 7."),
       ex("C2. Ring Row Strict",isDeload?"2×8":"3×10","poids du corps","1:00 après C2",
         "Corps gainé, poitrine aux anneaux. RPE 8.")
     ]},

    {time:"10 min",title:"D. WOD",tag:"Conditioning",kind:"wod",
     text:"EMOM 10 : min 1 = 12 cal row ; min 2 = 10 ring rows stricts. "+p.wodNote+"."},

    {time:"0-4 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",
     text:"Farmer Carry 2-3×40 m lourd mais propre."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Child Pose Lat Stretch 2 min + Open Book lent 1 min/côté + Neck/Trap Stretch léger 1 min."}
  ];

  // ── JEUDI : Jambes + Rappel épaules câble (volume augmenté S3+) ───────────
  if(day==="jeudi")return[
    {time:"9 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",
     text:"Bike/Row facile 3 min + Ankle Rocks 10/côté + World's Greatest Stretch 5/côté + Glute Bridge 2×15 + Goblet Squat léger 2×10 + montée front squat : barre ×8, 40% ×5, 55% ×5, 70% ×3."},

    {time:"15 min",title:"A. Mouvement principal",tag:"Jambes",kind:"main",
     exercises:[exFixed("Front Squat",
       week===1?"5×5":week===2?"5×5":week===3?"5×4":week===4?"5×4":week===5?"5×3":"3×5 léger",
       week===1?"165 lb":week===2?"175 lb":week===3?"185 lb":week===4?"190 lb":week===5?"195 lb":"140 lb",
       "2:00","RPE 8. Dos protégé, aucune tentative héroïque.")]},

    {time:"11 min",title:"B. Superset jambes",tag:"Superset",kind:"accessory",
     text:"Alterner B1 → B2.",
     exercises:[
       ex("B1. Bulgarian Split Squat",isDeload?"2×8/jambe":"3×10/jambe","50 lb / main","0:30 avant B2",
         "Amplitude propre, genou stable. RPE 8."),
       ex("B2. Standing Calf Raise",isDeload?"2×15":"3×20","25 lb","1:00 après B2",
         "Pause en haut, étirement en bas. RPE 8.")
     ]},

    // C. Rappel épaules câble — volume augmenté à partir S3
    {time:week>=3&&!isDeload?"10 min":"8 min",
     title:"C. Rappel épaules câble",tag:"Volume",kind:"accessory",
     text:"Rappel câble bas. Volume augmente à S3 pour atteindre le MAV semaine. RPE 8.",
     exercises:[
       exFixed("C1. Lateral Raise câble bas",
         isDeload?"2×15":week>=3?"3×20":"3×15","15-20 lb","0:30 avant C2",
         "Câble bas = tension en bas du mouvement. Arrêt 2 reps avant l'échec. RPE 8."),
       ex("C2. Face Pull",
         isDeload?"2×15":week>=3?"3×20":"3×15","60-70 lb","1:00 après C2",
         "Câble à hauteur des yeux. Posture et arrière d'épaule. RPE 8.")
     ]},

    {time:"9 min",title:"D. WOD",tag:"Conditioning",kind:"wod",
     text:"For time 21-15-9 : Wall Ball 14 lb + Cal Row. "+p.wodNote+". Cap 9 min."},

    {time:"0-3 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",
     text:"Reverse Sled Drag 3 min continu, léger à modéré."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Couch Stretch 1 min/côté + Ankle Stretch contre mur 1 min/côté + Hamstring Stretch 1 min total."}
  ];

  // ── VENDREDI : Haltéro + Giant set épaules câble augmenté ────────────────
  return[
    {time:"10 min",title:"Warm-up ciblé",tag:"Préparation",kind:"warmup",
     text:"Row facile 3 min + Band Pull-Apart 2×20 + Wrist Stretch 1 min + Front Rack Elbow Rotations 10 reps + Lat Stretch 1 min/côté + Tall Muscle Clean 2×5 + High Pull 2×5 + montée power clean : barre ×5, 40% ×3, 55% ×3, 65% ×2."},

    {time:"14 min",title:"A. Technique haltéro",tag:"Haltéro",kind:"main",
     exercises:[exFixed("Power Clean",
       week===1?"6×3":week===2?"7×3":week===3?"8×2":week===4?"8×2":week===5?"6×2":"5×2 léger",
       week===1?"155 lb":week===2?"165 lb":week===3?"175 lb":week===4?"180 lb":week===5?"185 lb":"135 lb",
       "1:30-2:00","RPE 7-8. Vitesse et réception propre. Pas de grind.")]},

    // B. Giant set épaules 3D — tout au câble, volume augmenté S3+
    {time:week>=3&&!isDeload?"10 min":"8 min",
     title:"B. Giant set épaules 3D — câble",tag:"Giant set",kind:"accessory",
     text:"Câble bas pour B1+B2, câble à hauteur yeux pour B3. Enchaîner les 3 sans pause, repos après B3. RPE 8 sur chaque exercice.",
     exercises:[
       exFixed("B1. Lateral Raise câble bas",
         isDeload?"2 rounds×15":week>=3?"3 rounds×15-20":"3 rounds×15","15-20 lb","—",
         "Tension en bas = stretch del latéral. RPE 8."),
       exFixed("B2. Rear Delt Fly câble bas",
         isDeload?"2 rounds×15":week>=3?"3 rounds×15-20":"3 rounds×15","15-20 lb","—",
         "Arrière d'épaule, résistance constante vs haltère. RPE 8."),
       ex("B3. Face Pull",
         isDeload?"2 rounds×15":week>=3?"3 rounds×15-20":"3 rounds×15","60-70 lb","1:15 après B3",
         "Câble à hauteur des yeux. Scapulas propres, rotation externe. RPE 8.")
     ]},

    {time:"5 min",title:"C. Triceps",tag:"Accessoire",kind:"accessory",
     exercises:[
       ex("Overhead Rope Extension",isDeload?"2×12":week>=3?"3×15":"3×12","50-60 lb","1:00",
         "Câble bas, corde derrière la tête. Longue portion triceps. RPE 8 — 2 reps en réserve.")
     ]},

    {time:"12 min",title:"D. WOD",tag:"Conditioning",kind:"wod",
     text:"AMRAP 12 : 6 power cleans légers + 12 wall balls 14 lb + 12 cal row. "+p.wodNote+"."},

    {time:"0-3 min",title:"E. Optionnel",tag:"Bonus",kind:"bonus",
     text:"Farmer Carry 2×40 m."},

    {time:"5 min",title:"F. Mobilité",tag:"Mobilité",kind:"mobility",
     text:"Lat Stretch 2 min + Front Rack Stretch 1 min + PVC Overhead Hold 1 min + Wrist Stretch 1 min."}
  ];
}
function shouldersWodForDay(day){
  var b=shouldersBlocks(day,state.week).filter(function(b){return b.kind==="wod";})[0];
  return b?b.text:"AMRAP 10 simple.";
}



window.COACH_BERTIN_PROGRAMS.shoulders3d.getBlocks = function(day, week){
  return shouldersBlocks(day, week);
};

window.COACH_BERTIN_PROGRAMS.shoulders3d.getWodText = function(day, week){
  var b = shouldersBlocks(day, week).filter(function(x){ return x.kind === "wod"; })[0];
  return b ? b.text : "";
};

window.COACH_BERTIN_PROGRAMS.shoulders3d.cycleRules = [
  "Aucun échec sur les mouvements principaux.",
  "Supersets seulement quand c'est indiqué.",
  "Lateral raise : brûlure oui, élan non.",
  "WOD lundi : pacing modéré, épaules déjà fatiguées.",
  "Vendredi : haltéro propre, pas de redline.",
  "Si douleur articulaire : baisse la charge, garde l'amplitude propre."
];

window.COACH_BERTIN_PROGRAMS.shoulders3d.dayIntentions = {
  lundi: "Vraie séance épaules/triceps. Strict press sous-maximal, aucun échec articulaire.",
  mardi: "Construire l'arrière d'épaule et la posture. Scapulas contrôlées, tirage propre.",
  jeudi: "Jambes propres, dos protégé. Rappel épaules très court : pump, pas destruction.",
  vendredi: "Garder l'haltéro et le CrossFit vivants. Push press technique, wall balls contrôlés."
};
