# Coach Beurt

Coach Beurt est une PWA personnelle d’entraînement en JavaScript vanilla, sans framework.

## État courant

- Version : `V51.53`
- Source courte de vérité : `ETAT_ACTUEL.md`
- Historique des changements : `CHANGELOG.md`
- Checklist de livraison : `RELEASE_CHECKLIST.md`

## Principe actuel

À partir de V51.44, la priorité est la structure durable : chaque dossier a une responsabilité, chaque fichier doit servir à quelque chose, et les patchs runtime cachés sont interdits.

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
- `docs/PHASE_2_EXTRACTION_REPORT.md`
- `docs/UI_CONSTRAINTS.md`

## Validations obligatoires

Avant chaque livraison :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Pour un ZIP update sans `data/`, les suites détectent maintenant automatiquement le mode update :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Le flag `--update-package` reste accepté, et `--full` force une validation complète.

## V51.53 — Cohérence décision charge

- La fenêtre `!` de charge utilise la même décision que la carte séance.
- Le moteur verrouille mieux les cas RPE ≥ 9 et RPE ≤ 7 avec reps atteintes.
- Les historiques affichés sont dédupliqués entre `athlete_state` et `resultats`.
- Bulgarian Split Squat et DB RDL sont couverts par des tests anti-régression.

## V51.47 — Domaine session regroupé

- Création de `scripts/session/` pour la séance terrain.
- Ajout de `scripts/session/index.js` comme API publique `window.CoachSession`.
- Déplacement de la vue séance, des résultats et de la sauvegarde session dans ce domaine.
- Aucun changement volontaire du comportement de l’app.
- Aucun fichier `data/` et aucun programme d’entraînement modifiés.


## Structure durable

- `scripts/charge/` contient le moteur de charges.
- `scripts/charge/index.js` expose `window.CoachCharge`.
- `scripts/session/` contient la séance terrain.
- `scripts/session/index.js` expose `window.CoachSession`.
- `app.js` reste le chef d’orchestre.
- `data/` ne doit pas être inclus dans les ZIP update.


## V51.48 — Stabilisation session interne

- Le domaine `scripts/session/` contient maintenant `view.js`, `timer.js`, `results.js`, `save.js` et `index.js`.
- Le timer guidé est isolé dans `scripts/session/timer.js`.
- `CoachSession` reste l’API publique utilisée par `app.js` et les autres vues.


## V51.49 — Logger d’erreurs runtime

- `scripts/core/logger.js` ajoute `window.CoachLog`.
- ⚙ Paramètres contient `Diagnostic app` pour copier ou effacer le rapport d’erreurs.
- Le logger est documenté dans `docs/ERROR_LOGGING.md`.
- Les erreurs restent locales dans `localStorage`, sans écrire dans `data/`.
