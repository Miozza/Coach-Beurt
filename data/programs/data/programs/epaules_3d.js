// Coach Bertin V44 — Phase 1 : Épaules 3D + Triceps (6 semaines)
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
