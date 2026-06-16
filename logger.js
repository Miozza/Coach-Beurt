/*
  Coach Beurt — API publique moteur de charges.
  Ce fichier ne contient pas la logique profonde : il expose une seule porte d'entrée stable.
  Les fonctions historiques restent exposées globalement pour compatibilité avec app.js.
*/
(function exposeCoachChargeApi(){
  window.CoachCharge = window.CoachCharge || {};
  Object.assign(window.CoachCharge, {
    buildContext: window.coachBuildMovementContext || (typeof coachBuildMovementContext === 'function' ? coachBuildMovementContext : null),
    contextSummary: window.coachMovementContextSummary || (typeof coachMovementContextSummary === 'function' ? coachMovementContextSummary : null),
    normalizeMovement: typeof canonicalMovementLabel === 'function' ? canonicalMovementLabel : null,
    lookupLabels: typeof coachMovementLookupLabels === 'function' ? coachMovementLookupLabels : null,
    getEquipmentFamily: typeof coachMovementEquipmentFamily === 'function' ? coachMovementEquipmentFamily : null,
    equipmentCompatible: typeof coachEquipmentCompatibleForAlias === 'function' ? coachEquipmentCompatibleForAlias : null,
    roundLoad: typeof roundLoadForExercise === 'function' ? roundLoadForExercise : null,
    nextLoad: typeof nextLoadForExercise === 'function' ? nextLoadForExercise : null,
    displayLoad: typeof displayLoadForEquipment === 'function' ? displayLoadForEquipment : null,
    getHistory: typeof latestMovementHistory === 'function' ? latestMovementHistory : null,
    filterHistory: typeof coachFilterHistoryForProgression === 'function' ? coachFilterHistoryForProgression : null,
    suggestLoad: window.coachSafeSuggestedLoad || (typeof athleteSuggestedLoad === 'function' ? athleteSuggestedLoad : null),
    enrichSessionResults: typeof enrichSessionResults === 'function' ? enrichSessionResults : null,
    updateAthleteStateFromResults: typeof updateAthleteStateFromResults === 'function' ? updateAthleteStateFromResults : null
  });
})();
