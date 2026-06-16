#!/usr/bin/env node
/*
  Coach Beurt — validation de structure durable.
  Objectif : éviter que le projet redevienne un empilement de patchs.

  Usage :
    node dev/structure_checks.js
    node dev/structure_checks.js --update-package
    node dev/structure_checks.js --full
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
function assert(cond, msg){ cond ? ok(msg) : fail(msg); }
function walk(dir){
  const start = rel(dir);
  if(!fs.existsSync(start)) return [];
  const out=[];
  (function recur(abs){
    for(const entry of fs.readdirSync(abs,{withFileTypes:true})){
      const full=path.join(abs,entry.name);
      const rp=path.relative(root,full).replace(/\\/g,'/');
      if(entry.isDirectory()) recur(full); else out.push(rp);
    }
  })(start);
  return out.sort();
}

const allFiles = walk('.').filter(f => !f.startsWith('.git/'));
if(forcedUpdatePackage && forcedFullPackage){
  fail('Flags incompatibles : --update-package et --full ne peuvent pas être utilisés ensemble.');
}
const hasDataFiles = allFiles.some(f => f.startsWith('data/'));
const isUpdatePackage = forcedUpdatePackage ? true : (forcedFullPackage ? false : !hasDataFiles);
const detectedModeReason = forcedUpdatePackage ? 'update (--update-package)' : (forcedFullPackage ? 'full (--full)' : (hasDataFiles ? 'full (data/ présent)' : 'update (data/ absent)'));
const allowedRootFiles = new Set([
  'app.js','index.html','styles.css','manifest.json','service-worker.js',
  'README.md','CHANGELOG.md','ETAT_ACTUEL.md','RELEASE_CHECKLIST.md',
  'apple-touch-icon.png','apple-touch-icon-precomposed.png','icon-180.png','icon-192.png','icon-512.png'
]);
const allowedDirs = new Set(['programs','scripts','data','dev','docs']);

// 1. Dossiers/fichiers racine.
allFiles.forEach(f => {
  const parts = f.split('/');
  if(parts.length === 1){
    assert(allowedRootFiles.has(f), 'Fichier racine autorisé : ' + f);
  } else {
    assert(allowedDirs.has(parts[0]), 'Dossier racine autorisé pour ' + f);
  }
});
assert(!exists('tools'), 'Le dossier tools/ ne doit pas revenir.');
assert(!exists('diagnostics'), 'Le dossier diagnostics/ ne doit pas revenir.');
assert(!exists('programs/test.js'), 'programs/test.js ne doit pas revenir.');

// 2. Documents/versioning temporaires interdits.
allFiles.forEach(f => {
  const base = path.basename(f);
  if(/^RELEASE_NOTES_V\d+\.\d+/.test(base) || /^AUDIT_V\d+\.\d+/.test(base) || /^REPORT_V\d+\.\d+/.test(base) || /^CHECKLIST_V\d+\.\d+/.test(base)){
    fail('Fichier temporaire/versionné interdit : ' + f);
  }
});
assert(exists('docs/STRUCTURE_CONTRACT.md'), 'docs/STRUCTURE_CONTRACT.md doit exister.');

// 3. Données.
if(isUpdatePackage){
  assert(!allFiles.some(f => f.startsWith('data/')), 'ZIP update ne doit contenir aucun fichier data/.');
} else {
  ['data/resultats.json','data/athlete_state.json','data/cycle_state.json','data/charges.js'].forEach(f => assert(exists(f), 'Fichier data attendu dans ZIP complet : ' + f));
}

// 4. Tous les scripts runtime doivent être chargés par index.html.
const index = exists('index.html') ? read('index.html') : '';
walk('scripts').filter(f => f.endsWith('.js')).forEach(f => {
  assert(index.includes(f), 'Script runtime chargé dans index.html : ' + f);
});

// 5. Tous les programmes JS doivent être chargés ou enregistrés explicitement.
const programsIndex = exists('programs/index.js') ? read('programs/index.js') : '';
walk('programs').filter(f => f.endsWith('.js')).forEach(f => {
  if(f === 'programs/index.js'){
    assert(index.includes(f), 'programs/index.js chargé dans index.html.');
    return;
  }
  assert(index.includes(f) || programsIndex.includes(path.basename(f, '.js')), 'Programme chargé ou indexé : ' + f);
});

// 6. Tous les scripts dev doivent être cités dans la checklist ou dans ce script.
const checklist = exists('RELEASE_CHECKLIST.md') ? read('RELEASE_CHECKLIST.md') : '';
walk('dev').filter(f => f.endsWith('.js')).forEach(f => {
  const allowedSelf = f === 'dev/structure_checks.js';
  assert(checklist.includes('node ' + f) || allowedSelf, 'Script dev cité dans RELEASE_CHECKLIST.md : ' + f);
});
assert(checklist.includes('node dev/structure_checks.js'), 'RELEASE_CHECKLIST.md doit exiger node dev/structure_checks.js.');

// 7. Les docs doivent être stables et visibles dans une source de référence.
const readme = exists('README.md') ? read('README.md') : '';
const etat = exists('ETAT_ACTUEL.md') ? read('ETAT_ACTUEL.md') : '';
const docRefText = readme + '\n' + etat + '\n' + checklist;
walk('docs').filter(f => f.endsWith('.md')).forEach(f => {
  assert(!/V\d+\.\d+/.test(path.basename(f)), 'Document sans version dans le nom : ' + f);
  assert(docRefText.includes(f) || f === 'docs/STRUCTURE_CONTRACT.md', 'Document stable référencé : ' + f);
});

// 8. Frontières : programs/ ne doit pas contenir de patch runtime/moteur.
walk('programs').filter(f => f.endsWith('.js')).forEach(f => {
  const src = read(f);
  assert(!/RuntimePatch|coachBeurtV\d+|smartSuggestedLoad|athleteSuggestedLoad|loadInfoButtonHtml|showLoadInfoModal|coachSafeSuggestedLoad/.test(src), 'Aucun patch/moteur charge dans ' + f);
});

// 8b. Core runtime : logger d’erreurs local.
assert(exists('scripts/core/logger.js'), 'Logger runtime présent : scripts/core/logger.js');
assert(index.includes('scripts/core/logger.js'), 'scripts/core/logger.js chargé dans index.html.');
const loggerSrc = exists('scripts/core/logger.js') ? read('scripts/core/logger.js') : '';
assert(loggerSrc.includes('window.CoachLog'), 'scripts/core/logger.js doit exposer window.CoachLog.');
assert(loggerSrc.includes('window.addEventListener("error"') || loggerSrc.includes("window.addEventListener('error'"), 'Logger doit capter window error.');
assert(loggerSrc.includes('unhandledrejection'), 'Logger doit capter unhandledrejection.');
assert(exists('docs/ERROR_LOGGING.md'), 'docs/ERROR_LOGGING.md doit documenter le logger.');

// 9. Frontières : app.js orchestre, les modules de charge existent dans scripts/charge/.
const chargeModules = ['scripts/charge/equipement.js','scripts/charge/utilitaires.js','scripts/charge/mouvements.js','scripts/charge/historique.js','scripts/charge/rpe.js','scripts/charge/suggestion.js','scripts/charge/index.js'];
chargeModules.forEach(f => assert(exists(f), 'Module charge présent : ' + f));
['scripts/equipement.js','scripts/utilitaires_charges.js','scripts/mouvement.js','scripts/charge_gestion.js','scripts/progression_rpe.js','scripts/moteur_charges.js'].forEach(f => assert(!exists(f), 'Ancien emplacement charge supprimé : ' + f));
const chargeIndex = exists('scripts/charge/index.js') ? read('scripts/charge/index.js') : '';
assert(chargeIndex.includes('window.CoachCharge'), 'scripts/charge/index.js doit exposer window.CoachCharge.');
assert(chargeIndex.includes('suggestLoad') && chargeIndex.includes('buildContext') && chargeIndex.includes('getHistory'), 'CoachCharge doit exposer suggestLoad/buildContext/getHistory.');
const app = exists('app.js') ? read('app.js') : '';
const versionMatch = app.match(/APP_VERSION\s*=\s*"(V\d+\.\d+)"/);
assert(!!versionMatch, 'app.js conserve APP_VERSION.');
if(versionMatch){
  const headerMatch = app.match(/^\/\/\s*Coach Be(?:rtin|urt)\s+(V\d+\.\d+)/m);
  assert(!!headerMatch, 'app.js doit garder un commentaire d’en-tête Coach Bertin/Beurt Vx.xx.');
  assert(headerMatch && headerMatch[1] === versionMatch[1], 'Commentaire d’en-tête app.js cohérent avec APP_VERSION : ' + versionMatch[1]);

  walk('scripts').filter(f => f.endsWith('.js')).forEach(f => {
    const firstLine = read(f).split(/\r?\n/)[0] || '';
    const scriptHeader = firstLine.match(/^\/\/\s*Coach Be(?:rtin|urt)\s+(V\d+\.\d+)/);
    if(scriptHeader){
      assert(scriptHeader[1] === versionMatch[1], 'En-tête version script cohérent avec APP_VERSION : ' + f + ' -> ' + versionMatch[1]);
    }
  });
}
assert(!/function\s+smartSuggestedLoad/.test(app), 'app.js ne redéfinit pas smartSuggestedLoad.');

// 9b. Frontière API charge : hors scripts/charge/, le runtime doit appeler CoachCharge.*
// et ne plus appeler directement les anciennes fonctions globales du moteur.
const runtimeOutsideCharge = ['app.js'].concat(walk('scripts').filter(f => f.endsWith('.js') && !f.startsWith('scripts/charge/')));
const forbiddenDirectChargeCalls = [
  'athleteSuggestedLoad',
  'updateAthleteStateFromResults',
  'enrichSessionResults',
  'coachBuildMovementContext',
  'coachFilterHistoryForProgression',
  'coachMovementEquipmentFamily',
  'coachMovementLookupLabels',
  'latestMovementHistory',
  'coachSafeSuggestedLoad'
];
let directChargeCallViolations = 0;
runtimeOutsideCharge.forEach(f => {
  const src = read(f);
  forbiddenDirectChargeCalls.forEach(name => {
    const rx = new RegExp('(^|[^.\\w])' + name + '\\s*\\(');
    if(rx.test(src)){
      directChargeCallViolations++;
      fail('Appel direct charge interdit hors scripts/charge/ : ' + name + ' dans ' + f);
    }
  });
});
if(directChargeCallViolations === 0) ok('Aucun appel direct aux fonctions internes de charge hors scripts/charge/.');
assert(app.includes('CoachCharge.'), 'app.js doit utiliser l’API publique CoachCharge.');

assert(exists('scripts/session/view.js'), 'Module session présent : scripts/session/view.js');
assert(exists('scripts/session/timer.js'), 'Module session présent : scripts/session/timer.js');
assert(exists('scripts/session/results.js'), 'Module session présent : scripts/session/results.js');
assert(exists('scripts/session/save.js'), 'Module session présent : scripts/session/save.js');
assert(exists('scripts/session/index.js'), 'Module session présent : scripts/session/index.js');
assert(!exists('scripts/view_session.js'), 'Ancien emplacement session supprimé : scripts/view_session.js');
assert(index.includes('scripts/session/timer.js'), 'scripts/session/timer.js chargé dans index.html.');
const sessionIndex = exists('scripts/session/index.js') ? read('scripts/session/index.js') : '';
assert(sessionIndex.includes('window.CoachSession'), 'scripts/session/index.js doit exposer window.CoachSession.');
assert(sessionIndex.includes('renderResults') && sessionIndex.includes('setupSave') && sessionIndex.includes('open') && sessionIndex.includes('startTimer'), 'CoachSession doit exposer open/renderResults/setupSave/startTimer.');
const runtimeOutsideSession = ['app.js'].concat(walk('scripts').filter(f => f.endsWith('.js') && !f.startsWith('scripts/session/') && !f.startsWith('scripts/charge/')));
let directSessionCallViolations = 0;
['openGuidedSession','renderSessionEntry','setupSessionSave','collectSessionResults','returnFromResultsToWod'].forEach(name => {
  runtimeOutsideSession.forEach(f => {
    const src = read(f);
    const rx = new RegExp('(^|[^.\\w])' + name + '\\s*\\(');
    if(rx.test(src)){
      directSessionCallViolations++;
      fail('Appel direct session interdit hors scripts/session/ : ' + name + ' dans ' + f);
    }
  });
});
if(directSessionCallViolations === 0) ok('Aucun appel direct aux fonctions internes de session hors scripts/session/.');
assert(app.includes('CoachSession.'), 'app.js doit utiliser l’API publique CoachSession.');


// 10. Assets PWA référencés.
['apple-touch-icon.png','apple-touch-icon-precomposed.png','icon-180.png','icon-192.png','icon-512.png'].forEach(f => {
  assert(index.includes(f) || (exists('manifest.json') && read('manifest.json').includes(f)), 'Asset PWA référencé : ' + f);
});

if(errors.length){
  console.error('\nÉCHEC structure_checks.js');
  errors.forEach(e => console.error(' - ' + e));
  process.exit(1);
}
console.log('OK structure_checks.js');
console.log('Mode détecté : ' + detectedModeReason);
notes.forEach(n => console.log(' - ' + n));
