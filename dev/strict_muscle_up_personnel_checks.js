#!/usr/bin/env node
/*
  Racine — validations dédiées au programme Strict Muscle-Up Personnel.
  Vérifie la structure du cycle : 12 semaines, 4 jours fixes, validations
  textuelles, règles douleur/fatigue, contenu technique obligatoire
  (ring dip, false grip, transition, scapula), jambes et conditioning
  chaque semaine, absence de kipping imposé, test S12 conditionnel,
  variation semaine à semaine, et non-activation automatique du cycle.

  Usage :
    node dev/strict_muscle_up_personnel_checks.js
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

const ctx = {
  console, Math, Date, JSON, Number, String, Boolean, Array, Object, RegExp,
  parseInt, parseFloat, isNaN,
  customCharges: {},
  DEFAULT_CHARGES: {}
};
ctx.window = ctx;
ctx.globalThis = ctx;

try {
  vm.runInNewContext(read('scripts/charge/utilitaires.js'), ctx, { filename: 'scripts/charge/utilitaires.js' });
  vm.runInNewContext(read('programs/strict_muscle_up_personnel.js'), ctx, { filename: 'programs/strict_muscle_up_personnel.js' });
  vm.runInNewContext(read('programs/index.js'), ctx, { filename: 'programs/index.js' });
} catch(err){
  fail('Chargement impossible du programme : ' + (err && err.stack ? err.stack : err));
}

const program = ctx.window.COACH_BERTIN_PROGRAMS && ctx.window.COACH_BERTIN_PROGRAMS.strict_muscle_up_personnel;
const expectedDays = ['lundi', 'mardi', 'jeudi', 'vendredi'];

if(!program){
  fail('window.COACH_BERTIN_PROGRAMS.strict_muscle_up_personnel doit exister après chargement.');
} else {
  // 1. 12 semaines.
  assert(Array.isArray(program.weekLabels) && program.weekLabels.length === 12, '12 semaines présentes (weekLabels.length === 12).');
  assert(Array.isArray(program.weekGoals) && program.weekGoals.length === 12, '12 objectifs hebdomadaires présents (weekGoals.length === 12).');

  // 2. 4 jours fixes.
  assert(Array.isArray(program.days) && program.days.length === 4 && expectedDays.every(d => program.days.indexOf(d) !== -1), '4 jours fixes présents : lundi, mardi, jeudi, vendredi.');

  // 3. cycleRules est un tableau littéral (pas une fonction — évite le bug .length sur fonction de heritage_225.js).
  assert(Array.isArray(program.cycleRules) && program.cycleRules.length > 0, 'cycleRules est un tableau non vide.');
  const rulesText = (program.cycleRules || []).join(' \n ');

  // 4. Validations obligatoires mentionnées.
  assert(/[Vv]alidation/.test(rulesText), 'Les règles mentionnent explicitement la validation des critères.');
  assert(/[Ss]emaines? 4 et 8/.test(rulesText), 'Les règles désignent les semaines 4 et 8 comme deload + validation.');

  // 5. Règles douleur/fatigue.
  assert(/douleur/i.test(rulesText), 'Les règles mentionnent la douleur.');
  assert(/0-2\/10/.test(rulesText) && /2\/10/.test(rulesText), 'Les règles donnent un seuil de douleur chiffré (0-2/10).');
  assert(/fatigue/i.test(rulesText), 'Les règles mentionnent la fatigue.');
  assert(/kipping/i.test(rulesText), 'Les règles interdisent explicitement le kipping.');
  assert(/chicken wing/i.test(rulesText), 'Les règles interdisent explicitement le chicken wing.');

  // 6. Test S12 conditionnel, jamais obligatoire.
  assert(/[Ss]emaine 12/.test(rulesText) && /jamais obligatoire/i.test(rulesText), 'Les règles précisent que le test S12 est conditionnel, jamais obligatoire.');

  // Parcourt les 12 semaines x 4 jours pour collecter blocs, noms d'exercices, tags.
  const perWeekSerialized = {};
  expectedDays.forEach(day => { perWeekSerialized[day] = []; });
  const exerciseNames = [];
  const allBlocksText = [];
  let week12Text = '';

  for(let week = 1; week <= 12; week++){
    expectedDays.forEach(day => {
      let blocks;
      try {
        blocks = program.getBlocks(day, week);
      } catch(err){
        fail('getBlocks(' + day + ', S' + week + ') ne doit pas lever d\'erreur : ' + err.message);
        blocks = [];
      }
      assert(Array.isArray(blocks) && blocks.length > 0, 'getBlocks(' + day + ', S' + week + ') retourne des blocs non vides.');
      const serialized = JSON.stringify(blocks);
      perWeekSerialized[day].push(serialized);
      allBlocksText.push(serialized);
      if(week === 12) week12Text += serialized;
      blocks.forEach(b => {
        (b.exercises || []).forEach(e => { if(e && e.name) exerciseNames.push(e.name); });
      });
    });
  }
  const wholeCycleText = allBlocksText.join(' ');

  // 7. Travail technique obligatoire présent dans le cycle.
  assert(/Ring Dip/.test(wholeCycleText), 'Le ring dip apparaît dans le cycle.');
  assert(/False Grip/.test(wholeCycleText), 'Le false grip apparaît dans le cycle.');
  assert(/Transition/.test(wholeCycleText), 'Le travail de transition apparaît dans le cycle.');
  assert(/Scap|scapula/i.test(wholeCycleText), 'Le travail scapulaire apparaît dans le cycle.');

  // 8. Jambes réelles chaque semaine.
  for(let week = 1; week <= 12; week++){
    let hasLegs = false;
    expectedDays.forEach(day => {
      program.getBlocks(day, week).forEach(b => { if(b.tag === 'Jambes') hasLegs = true; });
    });
    assert(hasLegs, 'Semaine ' + week + ' contient un stimulus jambes réel (tag Jambes).');
  }

  // 9. Conditioning chaque semaine.
  for(let week = 1; week <= 12; week++){
    let hasCond = false;
    expectedDays.forEach(day => {
      program.getBlocks(day, week).forEach(b => { if(b.kind === 'wod' || b.tag === 'Conditioning') hasCond = true; });
    });
    assert(hasCond, 'Semaine ' + week + ' contient du conditioning.');
  }

  // 10. Pas de kipping imposé par un nom d'exercice (les notes peuvent l'interdire, jamais le prescrire).
  assert(!exerciseNames.some(n => /kip/i.test(n)), 'Aucun exercice nommé n\'impose de kipping.');

  // 11. Test S12 conditionnel visible dans le contenu réel de la séance.
  assert(/[Tt]est conditionnel/.test(week12Text), 'Le contenu de la semaine 12 affiche un test conditionnel, pas une obligation.');

  // 12. Variation semaine à semaine : aucune semaine consécutive identique, pour chaque jour.
  expectedDays.forEach(day => {
    const series = perWeekSerialized[day];
    let identicalPair = null;
    for(let i = 0; i < series.length - 1; i++){
      if(series[i] === series[i + 1]){ identicalPair = 'S' + (i + 1) + '/S' + (i + 2); break; }
    }
    assert(!identicalPair, 'Aucune répétition identique entre deux semaines consécutives pour ' + day + (identicalPair ? ' (trouvé : ' + identicalPair + ')' : '') + '.');
  });

  // 13. getWodText fonctionne pour au moins une semaine/jour de chaque type.
  assert(typeof program.getWodText('lundi', 1) === 'string' && program.getWodText('lundi', 1).length > 0, 'getWodText retourne un texte WOD exploitable.');
}

// 14. Entrée catalogue cohérente (12 semaines fixes, fichier correct).
const catalog = ctx.window.COACH_BERTIN_PROGRAM_INDEX;
if(!Array.isArray(catalog)){
  fail('programs/index.js doit définir window.COACH_BERTIN_PROGRAM_INDEX.');
} else {
  const entry = catalog.find(p => p.id === 'strict_muscle_up_personnel');
  assert(!!entry, 'Le catalogue contient l\'entrée strict_muscle_up_personnel.');
  if(entry){
    assert(entry.file === 'programs/strict_muscle_up_personnel.js', 'L\'entrée catalogue référence le bon fichier programme.');
    assert(entry.durationWeeks === 12 && entry.minWeeks === 12 && entry.maxWeeks === 12, 'L\'entrée catalogue fixe la durée à 12 semaines (min === max === 12).');
  }
}

// 15. index.html charge bien le script du programme.
const indexHtml = read('index.html');
assert(/programs\/strict_muscle_up_personnel\.js/.test(indexHtml), 'index.html charge programs/strict_muscle_up_personnel.js.');

// 16. Aucune activation automatique : data/cycle_state.json ne doit pas être modifié pour pointer sur ce cycle.
try {
  const cycleState = JSON.parse(read('data/cycle_state.json'));
  assert(cycleState.activeCycle !== 'strict_muscle_up_personnel', 'data/cycle_state.json n\'active pas automatiquement strict_muscle_up_personnel (catalogue seulement).');
} catch(err){
  fail('Lecture data/cycle_state.json impossible : ' + err.message);
}

if(errors.length){
  console.error('\nÉCHEC strict_muscle_up_personnel_checks.js');
  errors.forEach(e => console.error(' - ' + e));
  process.exit(1);
}

console.log('OK strict_muscle_up_personnel_checks.js');
notes.forEach(n => console.log(' - ' + n));
