#!/usr/bin/env node
/*
  Coach Beurt — garde-fous anti-régression.
  Fichier fixe : ne pas créer de rapport versionné à chaque release.

  Usage :
    node dev/regression_checks.js
    node dev/regression_checks.js --update-package
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const forcedUpdatePackage = process.argv.includes('--update-package');
const forcedFullPackage = process.argv.includes('--full');
const errors = [];
const notes = [];

function rel(p){ return path.join(root, p); }
function exists(p){ return fs.existsSync(rel(p)); }
function read(p){ return fs.readFileSync(rel(p), 'utf8'); }
function fail(msg){ errors.push(msg); }
function ok(msg){ notes.push(msg); }
function assert(cond, msg){ if(!cond) fail(msg); }

function walk(dir){
  const start = rel(dir);
  if(!fs.existsSync(start)) return [];
  const out = [];
  (function recur(abs){
    for(const entry of fs.readdirSync(abs, {withFileTypes:true})){
      const full = path.join(abs, entry.name);
      const rp = path.relative(root, full).replace(/\\/g, '/');
      if(entry.isDirectory()) recur(full); else out.push(rp);
    }
  })(start);
  return out;
}

function formatTimerDisplay(sec){
  sec = Math.max(0, Math.floor(Number(sec) || 0));
  return String(Math.floor(sec / 60)) + ':' + String(sec % 60).padStart(2, '0');
}

function getVersion(){
  const app = read('app.js');
  const m = app.match(/APP_VERSION\s*=\s*"(V\d+\.\d+)"/);
  return m && m[1];
}

// 1. Documents et artefacts interdits.
const allFiles = walk('.').filter(f => !f.startsWith('.git/'));
if(forcedUpdatePackage && forcedFullPackage){
  fail('Flags incompatibles : --update-package et --full ne peuvent pas être utilisés ensemble.');
}
const hasDataFiles = allFiles.some(f => f.startsWith('data/'));
const isUpdatePackage = forcedUpdatePackage ? true : (forcedFullPackage ? false : !hasDataFiles);
const detectedModeReason = forcedUpdatePackage ? 'update (--update-package)' : (forcedFullPackage ? 'full (--full)' : (hasDataFiles ? 'full (data/ présent)' : 'update (data/ absent)'));
const forbidden = [
  /^RELEASE_NOTES_V\d+\.\d+\.md$/,
  /^OFFICIAL_RELEASE_.*V\d+\.\d+.*\.md$/,
  /^STRUCTURE_AUDIT.*V\d+\.\d+.*\.(md|json|txt)$/,
  /^AUDIT.*V\d+\.\d+.*\.(md|json|txt)$/,
  /^REGRESSION_REPORT.*V\d+\.\d+.*\.(md|json|txt)$/,
  /^VERSION_HISTORY\.md$/
];
allFiles.forEach(f => {
  const base = path.basename(f);
  if(forbidden.some(rx => rx.test(base))) fail('Fichier versionné/interdit détecté : ' + f);
});
assert(!exists('diagnostics'), 'Dossier diagnostics interdit dans la base propre.');
assert(!exists('programs/test.js'), 'programs/test.js ne doit pas revenir.');
assert(exists('CHANGELOG.md'), 'CHANGELOG.md doit exister et rester le seul historique.');
assert(exists('dev/charge_engine_checks.js'), 'dev/charge_engine_checks.js doit exister pour valider le moteur de charges extrait.');
assert(exists('docs/CHARGE_ENGINE_TESTS.md'), 'docs/CHARGE_ENGINE_TESTS.md doit documenter les tests ciblés du moteur de charges.');
assert(exists('dev/progression_contract_checks.js'), 'dev/progression_contract_checks.js doit exister pour protéger le contrat de progression.');
assert(exists('docs/CHARGE_PROGRESSION_CONTRACT.md'), 'docs/CHARGE_PROGRESSION_CONTRACT.md doit documenter le contrat de progression des charges.');
assert(exists('dev/structure_checks.js'), 'dev/structure_checks.js doit exister pour protéger la structure durable.');
assert(exists('docs/STRUCTURE_CONTRACT.md'), 'docs/STRUCTURE_CONTRACT.md doit documenter la structure durable.');
assert(exists('scripts/core/logger.js'), 'scripts/core/logger.js doit exister pour journaliser les erreurs runtime.');
assert(exists('docs/ERROR_LOGGING.md'), 'docs/ERROR_LOGGING.md doit documenter le logger d’erreurs.');


// 2. Données durables.
const durable = ['data/resultats.json','data/athlete_state.json','data/cycle_state.json'];
if(isUpdatePackage){
  durable.forEach(f => assert(!exists(f), 'ZIP update ne doit pas contenir ' + f));
  assert(!allFiles.some(f => f.startsWith('data/')), 'Mission Phase 2 : le ZIP update ne doit contenir aucun fichier data/.');
} else {
  durable.forEach(f => exists(f) ? ok('Donnée durable présente : ' + f) : ok('Donnée durable absente dans cette base : ' + f));
  assert(exists('data/charges.js'), 'data/charges.js doit exister.');
}

// 3. Programmes protégés.
[
  'programs/epaules_3d.js',
  'programs/epaules_3d_v2.js',
  'programs/hypertrophy_base.js',
  'programs/force_performance.js',
  'programs/competition_peak.js',
  'programs/heritage_225.js'
].forEach(f => assert(exists(f), 'Programme protégé manquant : ' + f));
assert(read('programs/index.js').includes('heritage_225'), 'heritage_225 doit rester dans programs/index.js.');
assert(!read('programs/index.js').match(/test\.js|\btest\b/i), 'Le programme Test ne doit pas revenir dans programs/index.js.');

// 4. Cohérence de version.
const version = getVersion();
assert(!!version, 'APP_VERSION introuvable dans app.js.');
if(version){
  const appHeader = read('app.js').match(/^\/\/\s*Coach Be(?:rtin|urt)\s+(V\d+\.\d+)/m);
  assert(!!appHeader, 'app.js doit garder un commentaire d’en-tête Coach Bertin/Beurt Vx.xx.');
  assert(appHeader && appHeader[1] === version, 'Commentaire d’en-tête app.js doit matcher APP_VERSION ' + version + '.');
  walk('scripts').filter(f => f.endsWith('.js')).forEach(f => {
    const firstLine = read(f).split(/\r?\n/)[0] || '';
    const scriptHeader = firstLine.match(/^\/\/\s*Coach Be(?:rtin|urt)\s+(V\d+\.\d+)/);
    if(scriptHeader){
      assert(scriptHeader[1] === version, 'En-tête version script doit matcher APP_VERSION ' + version + ' : ' + f);
    }
  });
  const plain = version.replace(/^V/, '');
  const cache = plain;
  const cacheName = 'coach-bertin-v' + plain.replace('.', '-') + '-no-cache';
  assert(read('index.html').includes('Coach Bertin ' + version), 'index.html doit contenir le titre ' + version + '.');
  assert(read('index.html').includes('?v=' + cache), 'index.html doit utiliser le cache-bust ?v=' + cache + '.');
  assert(read('manifest.json').includes('Coach Bertin ' + version), 'manifest.json doit contenir ' + version + '.');
  assert(read('service-worker.js').includes(cacheName), 'service-worker CACHE_NAME incohérent : attendu ' + cacheName + '.');
  assert(read('CHANGELOG.md').includes(version), 'CHANGELOG.md doit contenir ' + version + '.');
  assert(read('ETAT_ACTUEL.md').includes(version), 'ETAT_ACTUEL.md doit contenir ' + version + '.');
  assert(read('index.html').includes('scripts/core/logger.js?v=' + cache), 'index.html doit charger scripts/core/logger.js avec le cache-bust courant.');
  assert(read('scripts/core/logger.js').includes('window.CoachLog'), 'scripts/core/logger.js doit exposer CoachLog.');
}

// 5. Timer WOD verrouillé.
assert(formatTimerDisplay(45) === '0:45', 'Timer attendu : 45 sec -> 0:45.');
assert(formatTimerDisplay(552) === '9:12', 'Timer attendu : 552 sec -> 9:12.');
assert(formatTimerDisplay(600) === '10:00', 'Timer attendu : 600 sec -> 10:00.');
assert(formatTimerDisplay(3600) === '60:00', 'Timer attendu : 3600 sec -> 60:00.');
const helperSrc = read('scripts/app_helpers.js');
const equipmentSrc = exists('scripts/charge/equipement.js') ? read('scripts/charge/equipement.js') : '';
const chargeRuntimeSrc = [
  'app.js',
  'scripts/charge/equipement.js',
  'scripts/charge/utilitaires.js',
  'scripts/charge/mouvements.js',
  'scripts/charge/historique.js',
  'scripts/charge/rpe.js',
  'scripts/charge/suggestion.js'
].filter(exists).map(read).join('\n');
const sessionSrc = read('scripts/session/view.js');
const sessionTimerSrc = exists('scripts/session/timer.js') ? read('scripts/session/timer.js') : sessionSrc;
const sessionResultsSrc = read('scripts/session/results.js');
assert(helperSrc.includes('function formatTimerDisplay'), 'formatTimerDisplay doit rester dans scripts/app_helpers.js.');
assert(helperSrc.includes('function timerMeasureSampleForDisplay'), 'timerMeasureSampleForDisplay doit rester dans scripts/app_helpers.js.');
assert(sessionTimerSrc.includes('formatTimerDisplay'), 'scripts/session/timer.js doit utiliser le helper commun formatTimerDisplay.');
assert(sessionTimerSrc.includes('targetWidth') && sessionTimerSrc.includes('0.95'), 'Timer WOD doit viser environ 95 % de la largeur utile.');
assert(!/formatGuidedTimerClock[\s\S]{0,220}padStart\(2,\s*["']0["']\)\s*\+\s*["']:["']/.test(sessionTimerSrc), 'Timer WOD ne doit pas padder les minutes à 2 chiffres.');

// 6. Résultats / équipement / For Time.
assert((helperSrc + equipmentSrc).includes('available:[2.5,5,10,12,15,17.5,20,22.5,25,30,35,40,45,50,55,60,65,70,85]'), 'Liste DB officielle incomplète ou déplacée sans mise à jour du test.');
assert((helperSrc + equipmentSrc).includes('function nextLoadForExercise'), 'nextLoadForExercise doit rester disponible pour les contrôles compacts.');
const appSrc = chargeRuntimeSrc;
const resultsSrc = sessionResultsSrc;
assert(resultsSrc.includes('data-results-step="load"'), 'Résultats doit garder le contrôle compact de charge.');
assert(resultsSrc.includes('data-results-step="reps"'), 'Résultats doit garder le contrôle compact de reps.');
assert(resultsSrc.includes('data-results-step="rpe"'), 'Résultats doit garder le contrôle compact de RPE.');
assert(resultsSrc.includes('step="0.5"') && resultsSrc.includes('data-max="10"'), 'RPE résultats doit garder les pas de 0.5 jusqu’à 10.');
assert((resultsSrc + appSrc).includes('for(var sec = 0; sec <= 3600; sec += 1)'), 'For Time doit garder les choix 00:00 à 60:00 à la seconde.');
assert((resultsSrc + appSrc).includes('normalizeForTimeGoalSeconds'), 'For Time doit garder la présélection de l’objectif/cap.');
assert(appSrc.includes('function coachMovementLookupLabels'), 'Les alias de mouvements doivent rester centralisés pour éviter les suggestions manquantes.');
assert(appSrc.includes('function coachDefaultLoadSeedForMovement'), 'Les charges textuelles léger/modéré doivent garder un repère numérique prudent.');
assert(appSrc.includes('DB Shoulder Press / Landmine Press'), 'Alias DB Shoulder Press / Landmine Press requis pour le vendredi Épaules 3D.');
assert(appSrc.includes('Overhead Rope Extension — rappel vendredi'), 'Ancien alias Overhead Rope Extension rappel vendredi conservé seulement pour lecture historique.');
assert(appSrc.includes('Wide-Grip Cable Upright Row'), 'Alias Wide-Grip Cable Upright Row requis pour les suggestions du vendredi.');
assert(appSrc.includes('storeLoadDecisionHint(label,originalText'), 'Les charges non numériques sans repère doivent encore alimenter le bouton !.');
assert(appSrc.includes('DB ≠ câble ≠ machine ≠ barre ≠ poids du corps'), 'Le contrat d’alias par équipement doit rester documenté dans le code.');
assert(appSrc.includes('Lateral Raise câble bas') && appSrc.includes('Lateral Raise haltères'), 'Les variantes Lateral Raise câble/haltères doivent rester distinctes.');
assert(appSrc.includes('Rear Delt Fly câble bas') && appSrc.includes('Rear Delt Fly haltères'), 'Les variantes Rear Delt Fly câble/haltères doivent rester distinctes.');
assert(!/if\(\/lateral raise\/\.test\(n\)\)\{[\s\S]{0,240}add\("Lateral Raise haltères"\)[\s\S]{0,240}add\("Lateral Raise câble bas"\)/.test(appSrc), 'Lateral Raise ne doit pas fusionner haltères et câble dans le même alias large.');
assert(!/if\(\/rear delt fly\/\.test\(n\)\)\{[\s\S]{0,240}add\("Rear Delt Fly haltères"\)[\s\S]{0,240}add\("Rear Delt Fly câble bas"\)/.test(appSrc), 'Rear Delt Fly ne doit pas fusionner haltères et câble dans le même alias large.');
assert(helperSrc.includes('function displayMovementName'), 'displayMovementName doit nettoyer les suffixes internes sans modifier les programmes.');
assert(sessionSrc.includes('displayMovementName(e.title)'), 'La vue séance doit afficher les noms nettoyés.');
assert(read('programs/epaules_3d.js').includes('Lateral Raise DB'), 'Épaules 3D doit utiliser le nom propre Lateral Raise DB.');
assert(read('programs/epaules_3d.js').includes('Lateral Raise câble'), 'Épaules 3D doit utiliser le nom propre Lateral Raise câble.');
assert(read('programs/epaules_3d.js').includes('Rear Delt Fly DB'), 'Épaules 3D doit utiliser le nom propre Rear Delt Fly DB.');
assert(read('programs/epaules_3d.js').includes('Rear Delt Fly câble'), 'Épaules 3D doit utiliser le nom propre Rear Delt Fly câble.');
assert(!read('programs/epaules_3d.js').includes('Overhead Rope Extension — rappel vendredi'), 'Épaules 3D ne doit plus contenir Overhead Rope Extension — rappel vendredi dans le programme source.');
assert(appSrc.includes('DB Shoulder Press / Landmine Press') && appSrc.includes('transition historique'), 'Ancien nom DB Shoulder Press / Landmine Press doit rester en alias de transition.');
assert(appSrc.includes('Lateral Raise haltères') && appSrc.includes('Rear Delt Fly haltères'), 'Anciens noms haltères doivent rester comme alias de transition historique.');

// V51.32 : les programmes non actifs ne doivent plus utiliser de noms de mouvements combinés qui mélangent les charges.
const programFilesForCleanNames = [
  'programs/force.js',
  'programs/force_performance.js',
  'programs/competition_peak.js',
  'programs/hypertrophy_base.js',
  'programs/hypertrophie_fesse.js',
  'programs/hypertrophie_fesse_stephanie.js',
  'programs/posture_cyphose.js',
  'programs/heritage_225.js'
];
const forbiddenMovementNamePatterns = [
  /ex\(\s*["'][^"']*(\s\/\s|\sou\s|Cable\/Band|rappel vendredi|haltères|câble bas)[^"']*["']/i,
  /\bname\s*:\s*["'][^"']*(\s\/\s|\sou\s|Cable\/Band|rappel vendredi|haltères|câble bas)[^"']*["']/i
];
programFilesForCleanNames.forEach(function(file){
  const src = read(file);
  forbiddenMovementNamePatterns.forEach(function(rx){
    assert(!rx.test(src), file + ' contient encore un nom de mouvement combiné ou sale.');
  });
});
assert(read('programs/heritage_225.js').includes('Lateral Raise DB'), 'Heritage 225 doit préciser Lateral Raise DB pour éviter conflit câble/DB.');
assert(read('programs/hypertrophy_base.js').includes('Rear Delt Fly DB'), 'Hypertrophy Base doit préciser Rear Delt Fly DB.');
assert(read('programs/hypertrophie_fesse_stephanie.js').includes('Cable Hip Abduction'), 'Programme Stéphanie doit utiliser Cable Hip Abduction plutôt que Cable/Band.');

// V51.33 : les noms de mouvements doivent rester simples; les intentions vont dans les notes/blocs, pas dans le nom.
const competitionPeakSrc = read('programs/competition_peak.js');
assert(competitionPeakSrc.includes('cpEx("Pull-Up"'), 'Competition Peak doit utiliser Pull-Up comme nom simple.');
assert(competitionPeakSrc.includes('cpEx("Knee Raise"'), 'Competition Peak doit utiliser Knee Raise comme nom simple.');
assert(!competitionPeakSrc.includes('Pull-Up technique'), 'Pull-Up technique ne doit plus être un nom de mouvement dans le programme.');
assert(!competitionPeakSrc.includes('Hanging Knee Raise progression'), 'Hanging Knee Raise progression ne doit plus être un nom de mouvement dans le programme.');
assert(appSrc.includes('Pull-Up technique') && appSrc.includes('Hanging Knee Raise progression'), 'Les anciens noms Pull-Up technique / Hanging Knee Raise progression doivent rester en alias de transition historique.');

// V51.34 : audit complet — noms de mouvements simples partout.
function movementNamesFromProgramSource(src){
  const out = [];
  const patterns = [
    /\b\w*Ex\(\s*["']([^"']+)["']/g,
    /\bex\(\s*["']([^"']+)["']/g,
    /\bname\s*:\s*["']([^"']+)["']/g
  ];
  patterns.forEach(function(rx){
    let m;
    while((m = rx.exec(src))) out.push(m[1]);
  });
  return Array.from(new Set(out));
}
const forbiddenSimpleNameRx = /(^|\s)[A-D][0-9]\.|\b(technique|progression|tempo|pump|rappel|l[eé]ger|mod[eé]r[eé]|contr[oô]l[eé]|facile)\b|\s[—/]\s/i;
programFilesForCleanNames.forEach(function(file){
  const names = movementNamesFromProgramSource(read(file));
  names.forEach(function(name){
    assert(!forbiddenSimpleNameRx.test(name), file + ' contient encore un nom de mouvement non simple : ' + name);
  });
});
['programs/epaules_3d.js','programs/hypertrophy_base.js','programs/force_performance.js','programs/competition_peak.js','programs/heritage_225.js','programs/hypertrophie_fesse.js','programs/hypertrophie_fesse_stephanie.js','programs/posture_cyphose.js','programs/force.js','programs/config.js','programs/epaules_3d_v2.js'].forEach(function(file){
  const names = movementNamesFromProgramSource(read(file));
  names.forEach(function(name){
    assert(!/(A1\.|A2\.|B1\.|B2\.|B3\.|C1\.|C2\.|C3\.)/.test(name), file + ' contient encore un préfixe de sous-bloc dans un nom : ' + name);
  });
});
assert(appSrc.includes('Hip Thrust Tempo') && appSrc.includes('Ring Row Strict') && appSrc.includes('Step-Up haut contrôlé'), 'Les anciens noms simplifiés en V51.34 doivent rester comme alias de transition historique.');


// V51.35/V51.36 : Épaules 3D v2 doit rester sélectionnable, midi dense, avec benchmarks WOD protégés.
const shouldersV2Src = read('programs/epaules_3d_v2.js');
assert(shouldersV2Src.includes('shoulders3d_v2'), 'Épaules 3D v2 doit déclarer shoulders3d_v2.');
assert(read('programs/index.js').includes('shoulders3d_v2'), 'Épaules 3D v2 doit être dans le registre des programmes.');
assert(read('index.html').includes('programs/epaules_3d_v2.js'), 'Épaules 3D v2 doit être chargé par index.html.');
assert(shouldersV2Src.includes('AMRAP 8'), 'Épaules 3D v2 doit conserver un WOD court obligatoire.');
assert(shouldersV2Src.includes('DB Bench + 10 KB Swing + 12 Sit-Up'), 'Le lundi v2 doit illustrer la logique WOD fonte avec mouvements simples alternés.');

assert(shouldersV2Src.includes('EMOM 10 : min 1 = 12 cal Row ; min 2 = 8-10 Ring Row'), 'Le mardi v2 doit conserver le WOD original EMOM 10 Row/Ring Row.');
assert(shouldersV2Src.includes('For time 21-15-9 : Cal Bike + Box Step-Up'), 'Le jeudi v2 doit conserver le WOD original For Time Bike/Step-Up.');
assert(shouldersV2Src.includes('AMRAP 8 : 5 Power Clean + 8 Wall Balls + 10 cal Row'), 'Le vendredi v2 doit conserver le WOD original Power Clean/Wall Balls/Row.');
assert(!shouldersV2Src.includes('DB Bench / Push-Up'), 'Épaules 3D v2 ne doit pas réintroduire de nom composite avec slash.');

// 7. UI critique.
const html = read('index.html');
assert(html.includes('id="syncStatusDot"'), 'Témoin GitHub discret #syncStatusDot manquant.');
assert(html.includes('id="guidedSession"'), 'Vue séance guidée #guidedSession manquante.');
assert(html.includes('scripts/session/view.js'), 'scripts/session/view.js doit être chargé.');
assert(html.includes('scripts/session/results.js'), 'scripts/session/results.js doit être chargé.');
assert(html.includes('scripts/session/save.js'), 'scripts/session/save.js doit être chargé.');
assert(html.includes('scripts/session/index.js'), 'scripts/session/index.js doit être chargé.');
assert(html.includes('scripts/tms_session.js'), 'TMS doit être chargé depuis scripts/tms_session.js, pas tools/.');
assert(!exists('tools'), 'Le dossier tools/ ne doit pas revenir; utiliser scripts/ pour runtime et dev/ pour validation.');
assert(html.includes('scripts/app_helpers.js'), 'app_helpers.js doit être chargé avant scripts/session/view.js/app.js.');
[
  'scripts/charge/equipement.js',
  'scripts/charge/utilitaires.js',
  'scripts/charge/mouvements.js',
  'scripts/charge/historique.js',
  'scripts/charge/rpe.js',
  'scripts/charge/suggestion.js'
].forEach(function(file){
  assert(exists(file), 'Module Phase 2 manquant : ' + file);
  assert(html.includes(file), 'index.html doit charger ' + file + '.');
});
const requiredOrder = [
  'scripts/app_helpers.js',
  'scripts/charge/equipement.js',
  'scripts/charge/utilitaires.js',
  'scripts/charge/mouvements.js',
  'scripts/charge/historique.js',
  'scripts/charge/rpe.js',
  'scripts/charge/suggestion.js',
  'scripts/session/view.js',
  'scripts/session/results.js',
  'scripts/session/save.js',
  'scripts/session/index.js',
  'app.js'
];
for(let i=1;i<requiredOrder.length;i++){
  assert(html.indexOf(requiredOrder[i-1]) < html.indexOf(requiredOrder[i]), 'Ordre de chargement incorrect : ' + requiredOrder[i-1] + ' doit précéder ' + requiredOrder[i]);
}
assert(exists('docs/PHASE_2_EXTRACTION_REPORT.md'), 'Rapport Phase 2 extraction manquant.');
assert(exists('docs/CHARGE_CONTEXT.md'), 'Document contexte mouvement manquant.');
assert(appSrc.includes('function coachBuildMovementContext'), 'V51.40 : coachBuildMovementContext doit rester dans scripts/charge/mouvements.js.');
assert(appSrc.includes('function coachExtractMovementIntent'), 'V51.40 : coachExtractMovementIntent doit capter les intentions hors nom de mouvement.');
assert(appSrc.includes('primaryIntent'), 'V51.40 : le contexte doit exposer primaryIntent pour audit futur.');
assert(appSrc.includes('athleteSuggestedLoad(nameOrKey, currentLoad, targetReps, context)'), 'V51.40 : athleteSuggestedLoad doit accepter un contexte optionnel sans casser les 3 arguments.');
assert(appSrc.includes('function coachIsLimitedProgressionContext'), 'V51.41 : le moteur doit identifier les contextes à progression limitée.');
assert(appSrc.includes('function coachFilterHistoryForProgression'), 'V51.41 : l’historique doit être filtré selon le contexte quand disponible.');
assert(appSrc.includes("status:limitedResultContext?'context_logged':status"), 'V51.41 : les résultats en contexte limité doivent être historisés sans remplacer une progression principale.');
assert(appSrc.includes('contextLimited || isTechnicalMovement(label)'), 'V51.41 : les suggestions doivent utiliser le contexte en plus du nom technique.');
assert(appSrc.includes('Contexte technique : pas d’auto-progression comme un mouvement principal.'), 'V51.41 : le message de prudence contexte technique doit rester présent.');

// V51.39 : programs/config.js doit redevenir une configuration statique, sans patch runtime de charges.
const configSrc = read('programs/config.js');
assert(!configSrc.includes('coachBeurtV5018RuntimePatch'), 'programs/config.js ne doit plus contenir le vieux patch runtime coachBeurtV5018RuntimePatch.');
assert(!configSrc.includes('window.athleteSuggestedLoad'), 'programs/config.js ne doit plus remplacer window.athleteSuggestedLoad.');
assert(!configSrc.includes('window.loadInfoText'), 'programs/config.js ne doit plus remplacer window.loadInfoText.');
assert(!configSrc.includes('window.loadInfoButtonHtml'), 'programs/config.js ne doit plus remplacer window.loadInfoButtonHtml.');
assert(!configSrc.includes('window.showLoadInfoModal'), 'programs/config.js ne doit plus remplacer window.showLoadInfoModal.');
assert(configSrc.includes('var defaultProfile') && configSrc.includes('var movements') && configSrc.includes('var baseDays') && configSrc.includes('var wodBanks'), 'programs/config.js doit conserver seulement les blocs de configuration attendus.');


// 8. Bouton jaune de charge / historique en séance.
const modalSrc = read('scripts/ui_modals.js');

assert(appSrc.includes('function coachMovementEquipmentFamily'), 'Le mapping de charge doit identifier la famille d’équipement.');
assert(appSrc.includes('coachEquipmentCompatibleForAlias'), 'Le mapping de charge doit refuser les alias entre équipements incompatibles.');
assert(modalSrc.includes('function loadHistoryEquipmentFamily'), 'La modale ! doit protéger l’historique contre les conflits DB/câble/machine/barre.');
assert(modalSrc.includes('loadHistoryEquipmentCompatible'), 'La modale ! doit vérifier la compatibilité d’équipement avant un match partiel.');
assert(modalSrc.includes('function loadHistoryRowsForExercise'), 'Le bouton ! charge doit conserver loadHistoryRowsForExercise.');
assert(modalSrc.includes('loadHistoryRowsFromSessionHistory'), 'Le bouton ! charge doit utiliser state.history comme fallback.');
assert(modalSrc.includes('athlete_state') || modalSrc.includes('athleteState'), 'Le bouton ! charge doit conserver athlete_state comme source.');
assert(modalSrc.includes('Historique des poids utilisés'), 'La modale ! charge doit afficher la section Historique des poids utilisés.');
assert(modalSrc.includes('function loadHistoryExerciseName') && modalSrc.includes('exercise.name||exercise.title'), 'Le bouton ! charge doit accepter exercise.title quand exercise.name est absent.');
assert(modalSrc.includes('function loadHistoryNamesMatch'), 'Le bouton ! charge doit matcher les noms partiels/alternatifs.');
assert(!modalSrc.includes('<div class="tuto-section"><div class="tuto-section-title">Diagnostic'), 'La modale ! charge ne doit pas redevenir trop chargée avec un bloc Diagnostic complet.');


// 12. Tests ciblés du moteur de charges.
const engineCheckSrc = read('dev/charge_engine_checks.js');
assert(engineCheckSrc.includes('Lateral Raise DB') && engineCheckSrc.includes('Lateral Raise câble'), 'charge_engine_checks.js doit tester Lateral Raise DB vs câble.');
assert(engineCheckSrc.includes('Rear Delt Fly DB') && engineCheckSrc.includes('Rear Delt Fly câble'), 'charge_engine_checks.js doit tester Rear Delt Fly DB vs câble.');
assert(engineCheckSrc.includes('Power Clean') && engineCheckSrc.includes('technique') && engineCheckSrc.includes('wod'), 'charge_engine_checks.js doit tester Power Clean technique/WOD/strength.');
assert(engineCheckSrc.includes('context_logged'), 'charge_engine_checks.js doit vérifier que les résultats WOD/technique sont loggés sans écraser la capacité principale.');
const progressionContractSrc = read('dev/progression_contract_checks.js');
assert(progressionContractSrc.includes('La progression des charges est un pilier égal au choix de mouvement') || progressionContractSrc.includes('pilier égal au choix des mouvements'), 'progression_contract_checks.js doit protéger la priorité de progression.');
assert(progressionContractSrc.includes('Power Clean WOD') && progressionContractSrc.includes('Power Clean principal'), 'progression_contract_checks.js doit tester WOD vs principal.');
assert(read('docs/CHARGE_PROGRESSION_CONTRACT.md').includes('DB ≠ câble'), 'Le contrat progression doit documenter DB ≠ câble.');

if(errors.length){
  console.error('\nÉCHEC regression_checks.js');
  errors.forEach((e,i) => console.error((i+1) + '. ' + e));
  process.exit(1);
}
console.log('OK regression_checks.js — ' + (version || 'version inconnue'));
console.log('Mode détecté : ' + detectedModeReason);
if(isUpdatePackage) console.log('Mode update : données/data exclues vérifiées.');
