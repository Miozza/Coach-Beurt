// Coach Bertin V44 — Phase 2 : Hypertrophie / Force Base (6 semaines)
// Septembre → Décembre 2025
// Objectif : masse générale, bench vers 285 lb, back squat vers 260 lb x5,
//            chaîne postérieure, densité musculaire jambes

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
