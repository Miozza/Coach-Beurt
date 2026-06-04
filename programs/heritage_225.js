// Coach Bertin V50.17 — Cycle futur : Héritage 225
// Statut : PROJET FUTUR — construit, mais non actif par défaut.
// Objectif potentiel pour l'année des 50 ans : Push Press 225 lb.
// Hommage à Théodore (Théo).

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};

(function(){
  function wk(i){ return Math.max(1, Math.min(12, Number(i)||1)); }
  function isDeload(week){ return week===4 || week===8; }
  function isTest(week){ return week===12; }

  var weekLabels = [
    "S1 Base technique",
    "S2 Volume propre",
    "S3 Volume fort",
    "S4 Deload",
    "S5 Force spécifique",
    "S6 Force",
    "S7 Force lourde",
    "S8 Deload",
    "S9 Intensification",
    "S10 Singles propres",
    "S11 Pré-test",
    "S12 Test"
  ];

  var weekGoals = [
    "Bâtir le pattern dip-drive, aucune répétition grindée.",
    "Augmenter le volume utile sans irriter les épaules.",
    "Semaine de volume la plus solide du bloc 1.",
    "Baisser la fatigue, garder la vitesse et la mobilité.",
    "Passer vers du 3 reps lourd et propre.",
    "Renforcer la poussée et le lockout.",
    "Semaine lourde du bloc force, RPE 8-9 max.",
    "Consolidation technique, aucun ego.",
    "Singles contrôlés et explosifs.",
    "Singles plus lourds, mais propres.",
    "Dernière exposition lourde avant test.",
    "Test progressif vers 225 lb seulement si les barres montent bien."
  ];

  function phaseNote(week){
    week = wk(week);
    if(week<=3) return "Bloc 1 : base technique + volume.";
    if(week===4) return "Deload technique.";
    if(week<=7) return "Bloc 2 : force spécifique.";
    if(week===8) return "Deload / consolidation.";
    if(week<=11) return "Bloc 3 : intensification.";
    return "Semaine test — 225 seulement si 215 est solide.";
  }

  function pushPressHeavy(week){
    week = wk(week);
    if(week===1) return {format:"5×5", load:"RPE 7 · estimé 70%", rest:"2:00-2:30", note:"Dip vertical, drive agressif, lockout propre. Aucun grind."};
    if(week===2) return {format:"5×5", load:"+5 lb si S1 propre", rest:"2:00-2:30", note:"Même vitesse. Si le tronc plie, ne monte pas."};
    if(week===3) return {format:"6×4", load:"RPE 8", rest:"2:15-2:45", note:"Volume fort, stop si trapèze/épaule parle."};
    if(week===4) return {format:"3×5", load:"60-65%", rest:"1:45-2:00", note:"Deload. Vitesse et trajectoire seulement."};
    if(week===5) return {format:"5×3", load:"RPE 8", rest:"2:30", note:"Force spécifique. Toutes les reps doivent être identiques."};
    if(week===6) return {format:"6×3", load:"+5 lb si S5 propre", rest:"2:30-3:00", note:"Solide, mais pas de max."};
    if(week===7) return {format:"6×2", load:"RPE 8-9", rest:"3:00", note:"Plus lourd. Si la barre ralentit trop, coupe une série."};
    if(week===8) return {format:"3×3", load:"60-65%", rest:"2:00", note:"Deload. Rien à prouver."};
    if(week===9) return {format:"6×1", load:"RPE 8", rest:"2:30-3:00", note:"Singles propres, rapides, aucune lutte."};
    if(week===10) return {format:"7×1", load:"RPE 8-8.5", rest:"3:00", note:"Approche lourde. Lockout stable 2 sec."};
    if(week===11) return {format:"5×1", load:"RPE 8.5-9", rest:"3:00", note:"Dernier lourd. Objectif : confiance, pas fatigue."};
    return {format:"Montée test", load:"185 → 205 → 215 → 225 si prêt", rest:"3:00-4:00", note:"Tente 225 seulement si 215 est rapide et propre."};
  }

  function speedPushPress(week){
    week = wk(week);
    if(week<=3) return {format:"8×2", load:"60-65%", rest:"1:00-1:15", note:"Vitesse maximale. Chaque rep doit claquer."};
    if(week===4) return {format:"5×2", load:"55-60%", rest:"1:00", note:"Technique légère."};
    if(week<=7) return {format:"10×1", load:"65-72%", rest:"0:45-1:00", note:"Singles explosifs. Dip court, drive violent."};
    if(week===8) return {format:"5×1", load:"55-60%", rest:"1:00", note:"Vitesse facile."};
    if(week<=11) return {format:"6×1", load:"60-68%", rest:"1:00", note:"Répétition parfaite du pattern, sans fatigue."};
    return {format:"3×1", load:"50-55%", rest:"1:00", note:"Primer très léger avant test ou à couper si fatigue."};
  }

  function squatLoad(week){
    week=wk(week);
    if(week<=3) return week===3 ? "RPE 8" : "RPE 7-8";
    if(week===4 || week===8) return "léger/modéré";
    if(week<=7) return "RPE 8";
    if(week<=11) return "RPE 7-8";
    return "léger";
  }

  function rules(){
    return [
      "⚠️ Projet futur — à activer seulement quand le cycle Héritage 225 sera réellement choisi.",
      "Objectif potentiel année des 50 ans : Push Press 225 lb.",
      "Hommage à Théodore (Théo).",
      "Aucun push press grindé avant les semaines 9-12.",
      "Si douleur trapèze/épaule : réduire 10% ou remplacer par Landmine Press.",
      "Le dip doit rester vertical : genoux fléchissent, torse reste rigide.",
      "Pas de WOD overhead intense la veille ou le lendemain du push press lourd.",
      "Si deux séances consécutives sortent RPE 9+, réduire la charge de 5-10%."
    ];
  }

  function warmupPush(){
    return "2 tours : Band External Rotation — elbow tucked 12/côté + Band Internal Rotation — elbow tucked 12/côté + Scap Push-up 8 + Wall Slide 8. Puis : Push Press ramp-up : barre à vide×8, 40%×5, 55%×3.";
  }

  window.COACH_BERTIN_PROGRAMS.heritage225 = {
    id: "heritage225",
    label: "Héritage 225",
    phase: 0,
    status: "Projet futur",
    phaseName: "Année des 50 ans",
    nextPhase: null,
    draft: true,
    impact: "⚠️ Projet futur — à retravailler avant activation. Hommage à Théodore (Théo). Objectif potentiel pour l’année des 50 ans : réaliser un Push Press de 225 lb.",
    weekLabels: weekLabels,
    weekGoals: weekGoals,
    sets: ["5×5","5×5","6×4","3×5 deload","5×3","6×3","6×2","3×3 deload","6×1","7×1","5×1","test"],
    targetReps: [5,5,4,5,3,3,2,3,1,1,1,1],
    mult: [0.70,0.72,0.75,0.60,0.78,0.82,0.86,0.62,0.88,0.90,0.92,0.95],
    rest: "2:00-4:00 selon bloc",
    tag: "héritage",
    cycleRules: rules,

    dayIntentions: {
      lundi: "Jour 1 — Push Press lourd + triceps + haut du dos.",
      mardi: "Jour 2 — Bas du corps + gainage + mobilité.",
      jeudi: "Jour 3 — Push Press vitesse/explosivité + épaules + stabilité overhead.",
      vendredi: "Jour 4 — Maintien CrossFit + carries + conditionnement."
    },

    dayMeta: {
      lundi: { label:"Jour 1", base:"Push Press lourd", focus:"Force overhead · triceps · haut du dos" },
      mardi: { label:"Jour 2", base:"Bas du corps", focus:"Jambes · gainage · mobilité" },
      jeudi: { label:"Jour 3", base:"Push Press vitesse", focus:"Explosivité · épaules · stabilité overhead" },
      vendredi: { label:"Jour 4", base:"CrossFit maintien", focus:"Carries · conditionnement · moteur" }
    },

    getBlocks: function(day, week, ctx) {
      week = wk(week);
      var heavy = pushPressHeavy(week);
      var speed = speedPushPress(week);
      var note = "⚠️ Projet futur — à retravailler lorsque le projet sera activé. " + phaseNote(week);

      if(day==="lundi") return [
        {time:"8 min", title:"Échauffement push + coiffe", tag:"Préparation", kind:"warmup", text:warmupPush()},
        {time:"18 min", title:"A. Push Press lourd", tag:"Force", kind:"main",
          exercises:[
            {name:"Push Press", format:heavy.format, load:heavy.load, rest:heavy.rest, note:heavy.note}
          ]},
        {time:"10 min", title:"B. Triceps / lockout", tag:"Triceps", kind:"accessory",
          exercises:[
            {name:"Close Grip Bench Press", format:isDeload(week)?"3×6":"4×6-8", load:isDeload(week)?"léger":"RPE 7-8", rest:"1:30-2:00", note:"Aide le lockout sans transformer la séance en cycle bench."},
            {name:"Overhead Rope Extension", format:isDeload(week)?"2×12":"3×10-15", load:"modéré", rest:"0:45", note:"Longue portion du triceps. Coude stable."}
          ]},
        {time:"9 min", title:"C. Haut du dos", tag:"Dos", kind:"accessory",
          exercises:[
            {name:"Barbell Row", format:isDeload(week)?"3×8":"4×6-10", load:"RPE 7-8", rest:"1:15", note:"Haut du dos fort = rack et réception plus solides."}
          ]},
        {time:"5 min", title:"D. Core anti-extension", tag:"Core", kind:"accessory",
          exercises:[
            {name:"Dead Bug", format:"3×8/côté", load:"contrôle", rest:"0:30", note:"Côtes basses, bassin stable."}
          ]},
        {time:"5 min", title:"E. Mobilité", tag:"Mobilité", kind:"mobility",
          text:"Lat stretch 1 min/côté + triceps overhead stretch 1 min + respiration 1 min. " + note}
      ];

      if(day==="mardi") return [
        {time:"8 min", title:"Échauffement jambes / tronc", tag:"Préparation", kind:"warmup",
          text:"Bike facile 3 min + ankle rocks 10/côté + world's greatest stretch 5/côté + glute bridge 2×12 + goblet squat léger 10."},
        {time:"16 min", title:"A. Squat principal", tag:"Jambes", kind:"main",
          exercises:[
            {name:"Front Squat", format:isDeload(week)?"3×5":"5×4-6", load:squatLoad(week), rest:"2:00", note:"Dip-drive plus solide. Torse vertical, tronc rigide."}
          ]},
        {time:"12 min", title:"B. Chaîne postérieure", tag:"Jambes", kind:"accessory",
          exercises:[
            {name:"Romanian Deadlift", format:isDeload(week)?"2×8":"3×8-10", load:"RPE 7-8", rest:"1:30", note:"Ischios/fessiers, pas de stress inutile au bas du dos."},
            {name:"Hip Thrust", format:isDeload(week)?"2×10":"3×8-12", load:"RPE 7-8", rest:"1:00", note:"Drive de hanches utile sans surcharger les épaules."}
          ]},
        {time:"10 min", title:"C. Gainage lourd", tag:"Core", kind:"accessory",
          exercises:[
            {name:"Pallof Press", format:"3×10/côté", load:"contrôle", rest:"0:30", note:"Anti-rotation."},
            {name:"Farmer Carry", format:"3×40 m", load:"lourd propre", rest:"1:00", note:"Tronc rigide, épaules basses."}
          ]},
        {time:"8 min", title:"D. Mobilité", tag:"Mobilité", kind:"mobility",
          text:"Couch stretch 1 min/côté + lat stretch 1 min/côté + thoracic extension 2 min + respiration 2 min."}
      ];

      if(day==="jeudi") return [
        {time:"8 min", title:"Échauffement vitesse + coiffe", tag:"Préparation", kind:"warmup",
          text:"Row facile 2 min + Band External Rotation — elbow tucked 12/côté + Serratus Wall Slide 8 + PVC Pass-through 10 + Push Press technique barre à vide×8."},
        {time:"14 min", title:"A. Push Press vitesse", tag:"Explosivité", kind:"main",
          exercises:[
            {name:"Speed Push Press", format:speed.format, load:speed.load, rest:speed.rest, note:speed.note}
          ]},
        {time:"10 min", title:"B. Technique dip-drive", tag:"Technique", kind:"accessory",
          exercises:[
            {name:"Pause Dip Push Press", format:isDeload(week)?"3×2":"5×2", load:"léger/modéré", rest:"1:00", note:"Pause 1 sec dans le dip. Torse vertical, drive violent."}
          ]},
        {time:"12 min", title:"C. Épaules / stabilité", tag:"Épaules", kind:"accessory",
          exercises:[
            {name:"Lateral Raise", format:isDeload(week)?"2×15":"4×12-20", load:"léger/modéré", rest:"0:30", note:"Deltoïdes sans voler la récupération."},
            {name:"Rear Delt Fly", format:isDeload(week)?"2×15":"3×15-25", load:"léger", rest:"0:30", note:"Scapula et équilibre d'épaule."},
            {name:"Serratus Cable Punch", format:"3×12/côté", load:"léger", rest:"0:45", note:"Stabilité scapulaire."}
          ]},
        {time:"6 min", title:"D. Overhead stability", tag:"Stabilité", kind:"accessory",
          exercises:[
            {name:"Overhead Hold", format:"3×20-30 sec", load:"modéré", rest:"1:00", note:"Lockout stable, côtes basses."}
          ]},
        {time:"5 min", title:"E. Mobilité", tag:"Mobilité", kind:"mobility",
          text:"Doorway pec stretch 1 min/côté + lat stretch 1 min/côté + respiration 2 min. " + note}
      ];

      if(day==="vendredi") return [
        {time:"7 min", title:"Échauffement moteur", tag:"Préparation", kind:"warmup",
          text:"Bike ou row facile 3 min + scap push-up 10 + KB deadlift léger 10 + front rack stretch 1 min/côté."},
        {time:"10 min", title:"A. Carries", tag:"Carries", kind:"main",
          exercises:[
            {name:"Farmer Carry", format:"4×40 m", load:"lourd propre", rest:"1:00", note:"Tronc rigide. Ne pas transformer en grip max."},
            {name:"Front Rack Carry", format:"3×30 m", load:"modéré", rest:"1:00", note:"Rack solide, respiration contrôlée."}
          ]},
        {time:"12 min", title:"B. WOD maintien CrossFit", tag:"Conditioning", kind:"wod",
          text:"AMRAP 12 : 10 cal row + 10 box step-ups + 8 burpees contrôlés + 40 m farmer carry. RPE 7-8. Pas de volume overhead inutile."},
        {time:"10 min", title:"C. Conditionnement", tag:"Engine", kind:"accessory",
          exercises:[
            {name:"Bike / Row Zone 3", format:"8-10 min", load:"soutenable", rest:"—", note:"Respiration forte mais contrôlée. Pas un test."}
          ]},
        {time:"8 min", title:"D. Mobilité récupération", tag:"Mobilité", kind:"mobility",
          text:"Lat stretch 1 min/côté + pec stretch 1 min/côté + couch stretch 1 min/côté + respiration 2 min. " + note}
      ];

      return [
        {time:"—", title:"Héritage 225", tag:"Projet futur", kind:"warmup",
          text:"⚠️ Projet futur — À retravailler lorsque le projet sera activé."}
      ];
    }
  };
})();
