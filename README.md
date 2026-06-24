# Racine

Racine est une PWA personnelle d’entraînement en JavaScript vanilla, sans framework.

## État courant

- Version : `V51.92`
- Source courte de vérité : `ETAT_ACTUEL.md`
- Historique des changements : `CHANGELOG.md`
- Checklist de livraison : `RELEASE_CHECKLIST.md`

## Principe actuel

La priorité est la structure durable : chaque dossier a une responsabilité, chaque fichier doit servir à quelque chose, et les patchs runtime cachés sont interdits.

Référence principale : `docs/STRUCTURE_CONTRACT.md`.

## Données durables à protéger

Ne jamais écraser sans demande explicite :

- `data/resultats.json`
- `data/athlete_state.json`
- `data/cycle_state.json`

`data/charges.js` contient la configuration d’équipement et des charges fallback. Il ne doit pas être modifié sauf demande explicite.

Les ZIP `update-files-no-durable-data` ne doivent contenir aucun fichier `data/`.

## Structure principale

- `app.js` : orchestration principale, state, initialisation et appels aux modules.
- `scripts/` : code runtime chargé par l’app.
- `programs/` : programmes d’entraînement seulement.
- `data/` : données et bases de charges.
- `dev/` : validations et outils de développement.
- `docs/` : contrats et documentation stable.
- `tools/` : interdit, ne doit pas revenir.

## Documents stables

- `docs/ARCHITECTURE.md`
- `docs/STRUCTURE_CONTRACT.md`
- `docs/CHARGE_ENGINE.md`
- `docs/CHARGE_CONTEXT.md`
- `docs/CHARGE_ENGINE_TESTS.md`
- `docs/CHARGE_PROGRESSION_AUDIT.md`
- `docs/CHARGE_PROGRESSION_CONTRACT.md`
- `docs/DATA_FLOW_CONTRACT.md`
- `docs/PHASE_2_EXTRACTION_REPORT.md`
- `docs/UI_CONSTRAINTS.md`

## Version

Le contrat de version vit dans `docs/STRUCTURE_CONTRACT.md`.

Résumé court :

- `app.js`, `index.html`, `README.md`, `ETAT_ACTUEL.md` et `CHANGELOG.md` portent la version courante.
- `manifest.json`, `service-worker.js`, les modules `scripts/` et les contrats `docs/` ne doivent pas être mis à jour juste pour suivre la version.
- `CHANGELOG.md` reste le seul historique détaillé des changements.

## Validations obligatoires

Avant chaque livraison :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Pour un ZIP update sans `data/`, les suites détectent automatiquement le mode update :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Le flag `--update-package` reste accepté, et `--full` force une validation complète.

## Structure durable

- `scripts/charge/` contient le moteur de charges.
- `scripts/charge/index.js` expose `window.CoachCharge`.
- `scripts/session/` contient la séance terrain.
- `scripts/session/index.js` expose `window.CoachSession`.
- `scripts/state/index.js` expose `window.CoachState`.
- `scripts/sync/index.js` expose `window.CoachSync`.
- `scripts/ui/index.js` expose `window.CoachUI`.
- `scripts/history/index.js` expose `window.CoachHistory`.
- `scripts/progression/index.js` expose `window.CoachProgress`.
- `app.js` reste le chef d’orchestre.
- `data/` ne doit pas être inclus dans les ZIP update.
