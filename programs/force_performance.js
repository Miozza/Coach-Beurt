// Coach Bertin V44 — Phase 3 : Force + Résistance musculaire (6 semaines)
// Janvier → Juillet 2026
// Objectif : Bench 300 lb, back squat 285+ lb, tolérance 75 reps squats,
//            butterfly pull-ups → muscle-ups

window.COACH_BERTIN_PROGRAMS = window.COACH_BERTIN_PROGRAMS || {};
window.COACH_BERTIN_PROGRAMS.force_performance = {
  id: "force_performance",
  label: "Force + Résistance musculaire — Phase 3",
  phase: 3,
  phaseName: "Force compétition + seuil lactique",
  phaseEnd: "juillet 2026",
  nextPhase: "competition_peak",
  impact: "Bench 300 lb, back squat 285 lb, 75 reps squats sans s'effondrer. Séries haute densité jambes. Progression muscle-ups. Moteur CrossFit conservé.",
  weekLabels: ["S1 Base","S2 Volume","S3 Densité","S4 Surcharge","S5 Peak","S6 Deload"],
  weekGoals: [
    "Repères force phase 3. Introduire séries densité jambes 5 x 15.",
    "Charges lourdes + densité. Squat haute reps en fin de séance.",
    "Semaine densité spéciale : simuler fatigue compétition.",
    "Charges maximales + volume densité. La semaine la plus dure.",
    "Peak force. Moins de volume, plus lourd. Tester des PR.",
    "Deload complet. Préparer prochain cycle."
  ],
  sets: ["5 x 5","5 x 4","6 x 3","5 x 3","3 x 2 lourd","3 x 5 léger"],
  targetReps: [5,4,3,3,2,5],
  mult: [0.80,0.84,0.87,0.90,0.93,0.65],
  rest: "2:30–3:00",
  tag: "force compétition"
};
