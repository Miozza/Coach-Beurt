#!/usr/bin/env node
/*
  Coach Beurt — tests ciblés du moteur de charges.
  Étape 5 : sécuriser les calculs de progression contextualisés sans changer le comportement.

  Usage :
    node dev/charge_engine_checks.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const errors = [];
const notes = [];

function rel(p){ return path.join(root, p); }
function read(p){ return fs.readFileSync(rel(p), 'utf8'); }
function fail(msg){ errors.push(msg); }
function ok(msg){ notes.push(msg); }
function assert(cond, msg){ if(!cond) fail(msg); else ok(msg); }
function includes(arr, item){ return Array.isArray(arr) && arr.indexOf(item) !== -1; }
function notIncludes(arr, item){ return !Array.isArray(arr) || arr.indexOf(item) === -1; }

const ctx = {
  console,
  Math,
  Date,
  JSON,
  Number,
  String,
  Boolean,
  Array,
  Object,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  setTimeout: function(fn){ if(typeof fn === 'function') fn(); },
  clearTimeout: function(){},
  document: { getElementById: function(){ return null; } },
  navigator: {},
  localStorage: { getItem(){return null;}, setItem(){}, removeItem(){} },
  APP_VERSION: 'TEST',
  customCharges: {},
  DEFAULT_CHARGES: {
    'Power Clean':'135 lb',
    'Lateral Raise DB':'20 lb',
    'Lateral Raise câble':'30 lb',
    'Rear Delt Fly DB':'20 lb',
    'Rear Delt Fly câble':'30 lb',
    'Overhead Rope Extension':'50 lb'
  },
  CHARGE_ORDER: [],
  movements: {
    powerClean:{name:'Power Clean', profile:'powerClean'},
    strictPress:{name:'Strict Press', profile:'strictPress'},
    bench:{name:'Bench Press', profile:'bench'}
  },
  state: {
    week: 3,
    day: 'vendredi',
    rpeHistory: {},
    athleteState: { movements: {} }
  },
  save: function(){},
  focus: function(){ return {targetReps:{0:8,1:8,2:8,3:8,4:8,5:8}}; },
  weekIdx: function(){ return 2; },
  collectSessionExercises: function(){ return []; }
};
ctx.window = ctx;
ctx.globalThis = ctx;

const loadOrder = [
  'scripts/app_helpers.js',
  'scripts/charge/equipement.js',
  'scripts/charge/utilitaires.js',
  'scripts/charge/mouvements.js',
  'scripts/charge/rpe.js',
  'scripts/charge/historique.js',
  'scripts/charge/suggestion.js'
];

loadOrder.forEach(file => {
  try {
    vm.runInNewContext(read(file), ctx, { filename: file });
  } catch (err) {
    fail('Chargement impossible de ' + file + ' : ' + err.message);
  }
});

function resetState(){
  ctx.state.week = 3;
  ctx.state.day = 'vendredi';
  ctx.state.athleteState = { movements: {} };
  ctx.__coachLoadHints = {};
}

try {
  // 1. Fonctions exposées attendues.
  [
    'coachBuildMovementContext',
    'coachIsLimitedProgressionContext',
    'coachContextProgressionReason',
    'coachFilterHistoryForProgression',
    'guardedSuggestedLoadDecision',
    'updateAthleteStateFromResults',
    'coachMovementLookupLabels',
    'canonicalMovementLabel',
    'coachMovementEquipmentFamily'
  ].forEach(name => assert(typeof ctx[name] === 'function', 'Fonction disponible : ' + name));

  // 2. Alias par équipement : DB ne doit pas fusionner avec câble.
  const lateralDb = ctx.coachMovementLookupLabels('Lateral Raise DB');
  const lateralCable = ctx.coachMovementLookupLabels('Lateral Raise câble');
  const rearDb = ctx.coachMovementLookupLabels('Rear Delt Fly DB');
  const rearCable = ctx.coachMovementLookupLabels('Rear Delt Fly câble');

  assert(includes(lateralDb, 'Lateral Raise haltères'), 'Lateral Raise DB lit l’ancien alias haltères.');
  assert(notIncludes(lateralDb, 'Lateral Raise câble bas'), 'Lateral Raise DB ne lit pas l’alias câble.');
  assert(includes(lateralCable, 'Lateral Raise câble bas'), 'Lateral Raise câble lit l’ancien alias câble bas.');
  assert(notIncludes(lateralCable, 'Lateral Raise haltères'), 'Lateral Raise câble ne lit pas l’alias haltères.');
  assert(includes(rearDb, 'Rear Delt Fly haltères'), 'Rear Delt Fly DB lit l’ancien alias haltères.');
  assert(notIncludes(rearDb, 'Rear Delt Fly câble bas'), 'Rear Delt Fly DB ne lit pas l’alias câble.');
  assert(includes(rearCable, 'Rear Delt Fly câble bas'), 'Rear Delt Fly câble lit l’ancien alias câble bas.');
  assert(notIncludes(rearCable, 'Rear Delt Fly haltères'), 'Rear Delt Fly câble ne lit pas l’alias haltères.');

  assert(ctx.coachMovementEquipmentFamily('Lateral Raise DB') === 'db', 'Équipement Lateral Raise DB = dumbbell.');
  assert(ctx.coachMovementEquipmentFamily('Lateral Raise câble') === 'cable', 'Équipement Lateral Raise câble = cable.');
  assert(ctx.coachMovementEquipmentFamily('Rear Delt Fly DB') === 'db', 'Équipement Rear Delt Fly DB = dumbbell.');
  assert(ctx.coachMovementEquipmentFamily('Rear Delt Fly câble') === 'cable', 'Équipement Rear Delt Fly câble = cable.');

  // 3. Contexte/intention : le nom reste simple, l’intention vit à côté.
  const pcTechnique = ctx.coachBuildMovementContext('Power Clean', { note:'technique vitesse propre', kind:'accessory', day:'vendredi', week:3 });
  const pcWod = ctx.coachBuildMovementContext('Power Clean', { kind:'wod', format:'AMRAP 8', text:'5 Power Clean + 8 Wall Balls + 10 cal Row' });
  const pcStrength = ctx.coachBuildMovementContext('Power Clean', { kind:'main', blockTitle:'Force principale' });
  assert(pcTechnique.label === 'Power Clean', 'Power Clean technique garde le nom simple Power Clean.');
  assert(includes(pcTechnique.intents, 'technique') && ctx.coachIsLimitedProgressionContext(pcTechnique), 'Power Clean avec note technique = contexte limité.');
  assert(includes(pcWod.intents, 'wod') && ctx.coachIsLimitedProgressionContext(pcWod), 'Power Clean en WOD = contexte limité.');
  assert(!ctx.coachIsLimitedProgressionContext(pcStrength), 'Power Clean principal/force non limité par défaut.');

  // 4. Filtrage d’historique par contexte.
  const hist = [
    { date:'2026-01-01', load:115, reps:5, rpe:7 },
    { date:'2026-01-08', load:135, reps:5, rpe:7, context:pcTechnique },
    { date:'2026-01-15', load:185, reps:5, rpe:8, context:pcStrength }
  ];
  const mainFiltered = ctx.coachFilterHistoryForProgression(hist, pcStrength);
  const techFiltered = ctx.coachFilterHistoryForProgression(hist, pcTechnique);
  assert(mainFiltered.some(r => r.load === 115) && mainFiltered.some(r => r.load === 185), 'Historique principal garde les anciennes entrées sans contexte et les entrées principales.');
  assert(!mainFiltered.some(r => r.load === 135), 'Historique principal exclut les entrées techniques contextualisées.');
  assert(techFiltered.some(r => r.load === 115) && techFiltered.some(r => r.load === 135), 'Historique technique garde les anciennes entrées sans contexte et les entrées limitées.');
  assert(!techFiltered.some(r => r.load === 185), 'Historique technique exclut les entrées principales contextualisées.');

  // 5. Décision de suggestion : contexte limité ne doit pas monter comme principal.
  resetState();
  ctx.state.athleteState.movements['Power Clean'] = {
    ranges: { strength: { currentLoad:185, actualLoad:185, currentReps:5, actualReps:5, rpe:7, confidence:0.9, status:'upgrade_ready' } },
    history: [
      { date:'2026-01-15', load:185, reps:5, rpe:7, range:'strength', status:'upgrade_ready', context:pcStrength }
    ]
  };
  const techDecision = ctx.guardedSuggestedLoadDecision('Power Clean', '115 lb', 5, pcTechnique);
  const mainDecision = ctx.guardedSuggestedLoadDecision('Power Clean', '115 lb', 5, pcStrength);
  assert(techDecision.loadText === '115 lb', 'Power Clean technique conserve la charge du programme, pas la référence lourde.');
  assert(mainDecision.loadText !== '115 lb', 'Power Clean principal peut utiliser l’historique contrôlé quand le programme sous-suggère.');

  // 6. Mise à jour athlete_state : résultat WOD/technique loggé mais ne remplace pas la capacité principale.
  resetState();
  ctx.state.day = 'vendredi';
  ctx.updateAthleteStateFromResults({
    'Power Clean': { load:'135 lb', reps:5, rpe:7, planned:{ reps:5, kind:'wod', format:'AMRAP 8', context:pcWod } }
  }, '2026-02-01');
  const mv = ctx.state.athleteState.movements['Power Clean'];
  assert(mv && mv.history && mv.history.length === 1, 'Résultat Power Clean WOD ajouté à l’historique.');
  assert(mv.history[0].status === 'context_logged', 'Résultat WOD est marqué context_logged.');
  assert(!mv.ranges.strength, 'Résultat WOD ne remplace pas la capacité strength.');

  // 7. Cohérence décisionnelle : la charge finale doit suivre la règle expliquée.
  resetState();
  ctx.state.day = 'jeudi';
  ctx.state.athleteState.movements['Bulgarian Split Squat'] = {
    ranges: { hypertrophy: { currentLoad:45, actualLoad:45, currentReps:8, actualReps:8, rpe:9, confidence:0.9, status:'hard_success' } },
    history: [
      { date:'2026-06-04', load:35, reps:8, rpe:7, range:'hypertrophy', status:'easy_success' },
      { date:'2026-06-11', load:45, reps:8, rpe:9, range:'hypertrophy', status:'hard_success' }
    ]
  };
  const bulgarianCtx = ctx.coachBuildMovementContext('Bulgarian Split Squat', { kind:'accessory', blockTitle:'B. Superset jambes + core', format:'3×8-10/jambe', day:'jeudi', week:3 });
  const bulgarianDecision = ctx.guardedSuggestedLoadDecision('Bulgarian Split Squat', '50 lb', 8, bulgarianCtx);
  assert(bulgarianDecision.loadNum === 45, 'Bulgarian Split Squat RPE 9 bloque la hausse finale à 45 lb.');
  assert(/aucune hausse automatique|Bloqué/.test(bulgarianDecision.reason), 'Bulgarian Split Squat explique le blocage RPE 9.');

  resetState();
  ctx.state.day = 'jeudi';
  ctx.state.athleteState.movements['DB RDL'] = {
    ranges: { hypertrophy: { currentLoad:60, actualLoad:60, currentReps:10, actualReps:10, rpe:7, confidence:0.9, status:'upgrade_ready' } },
    history: [
      { date:'2026-06-04', load:60, reps:10, rpe:8, range:'hypertrophy', status:'success' },
      { date:'2026-06-11', load:60, reps:10, rpe:7, range:'hypertrophy', status:'easy_success' }
    ]
  };
  const rdlCtx = ctx.coachBuildMovementContext('DB RDL', { kind:'accessory', blockTitle:'C. Charnière postérieure', format:'3×10', day:'jeudi', week:3 });
  const rdlDecision = ctx.guardedSuggestedLoadDecision('DB RDL', '60 lb', 10, rdlCtx);
  assert(rdlDecision.loadNum === 65, 'DB RDL 60×10 RPE 7 propose la prochaine charge disponible 65 lb.');
  assert(/Progression prête|Petite hausse/.test(rdlDecision.reason), 'DB RDL explique la progression légère.');
  assert(ctx.coachMovementEquipmentFamily('Bulgarian Split Squat') === 'db', 'Bulgarian Split Squat classé équipement DB, pas barre.');

} catch (err) {
  fail('Erreur pendant les tests moteur : ' + (err && err.stack ? err.stack : err));
}

if(errors.length){
  console.error('\nÉCHEC charge_engine_checks.js');
  errors.forEach(e => console.error(' - ' + e));
  process.exit(1);
}

console.log('OK charge_engine_checks.js');
notes.forEach(n => console.log(' - ' + n));
