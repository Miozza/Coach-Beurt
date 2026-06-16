# Checklist de livraison Coach Beurt

## Avant génération du ZIP

- Confirmer l’objectif de la version.
- Ne pas mélanger correction de programme, refactor moteur et migration de données dans la même version.
- Ne pas modifier les données durables.
- Ne pas modifier `data/charges.js` sauf demande explicite.
- Ne pas modifier les programmes/séances sauf demande explicite.
- Protéger les programmes restaurés du 2026-06-09 :
  - `programs/epaules_3d.js`
  - `programs/hypertrophy_base.js`
  - `programs/force_performance.js`
  - `programs/competition_peak.js`
  - `programs/heritage_225.js`

## Versionnement obligatoire

À chaque version, mettre à jour :

- `APP_VERSION` dans `app.js`
- titre/version/footer/cache-bust `?v=` dans `index.html`
- `manifest.json`
- `CACHE_NAME` dans `service-worker.js`
- `CHANGELOG.md`
- `ETAT_ACTUEL.md`

Le nom du dossier et des ZIP doit correspondre à la version.

## Validation technique

Exécuter :

```bash
node --check app.js
find programs scripts dev data -name '*.js' -print0 | xargs -0 -n1 node --check
node --check service-worker.js
```

## Validation terrain minimale

- Ouvrir WOD+.
- Ouvrir la sélection de cycle.
- Vérifier que Héritage 225 reste visible sans activation automatique.
- Démarrer une séance guidée.
- Vérifier les contrôles Reps/RPE compacts.
- Vérifier Résultats.
- Vérifier PC/Route/Export IA.
- Vérifier le statut sync GitHub.

## ZIP update-files-no-durable-data

Doit exclure :

- `data/resultats.json`
- `data/athlete_state.json`
- `data/cycle_state.json`


## Validation vue séance verrouillée

Avant de livrer une version qui touche à `styles.css`, `scripts/session/view.js`, `app.js` ou `index.html`, vérifier :

- Le timer WOD affiche `9:12`, `8:00`, `0:45`, `10:00`, jamais `09:12`, `08:00`, `00:45`.
- Le timer WOD utilise presque toute la largeur disponible sans dépasser.
- La taille du timer reste stable pendant le décompte et ne change pas selon la forme des chiffres.
- Les boutons Play / Pause / Reset du timer sont accessibles.
- Les boutons `Précédent` et `Bloc suivant` sont accessibles en portrait iPhone.
- Un WOD court, un AMRAP/CAP et un bloc long avec plusieurs mouvements restent utilisables sans bouton caché.

## Validation Résultats
- [ ] Vue Résultats : les mouvements haltères suivent la liste disponible du gym, pas des incréments génériques.

## Socle anti-régression fixe

Avant chaque ZIP, exécuter :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Pour vérifier un dossier `update-files-no-durable-data`, exécuter depuis ce dossier :

```bash
node dev/regression_checks.js --update-package
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js --update-package
```

Le script doit rester un garde-fou court. Ne pas créer de rapport versionné dans le repo; le résultat du test va dans la réponse de livraison.

Garanties minimales vérifiées :

- pas de fichiers `RELEASE_NOTES_V*`, audit ou rapport versionné;
- `programs/test.js` absent;
- données durables exclues des ZIP update;
- programmes protégés présents;
- `heritage_225` présent dans `programs/index.js`;
- version cohérente dans app/index/manifest/service-worker/docs;
- timer WOD sans zéro inutile devant les minutes;
- contrôles Résultats compacts et DB selon la liste du gym;
- For Time disponible de `00:00` à `60:00`.

## Garde-fou séance / charges

- [ ] Le bouton jaune `!` / `⚠` en vue séance ouvre une modale courte avec la section `Historique des poids utilisés` visible sans fouillis.
- [ ] L’historique de charge doit pouvoir venir de `athlete_state` et de `state.history`.
- [ ] La recherche d’historique accepte les mouvements sous `name`, `title`, `label` ou `movement`.
- [ ] Les noms partiels/alternatifs doivent matcher, ex. `DB Shoulder Press` ↔ `DB Shoulder Press / Landmine Press`.

## Structure dossiers

- `scripts/` = code runtime chargé par l’app.
- `dev/` = scripts de validation/développement hors application.
- `programs/` = programmes d’entraînement seulement.
- `tools/` ne doit pas revenir.

## Vérification charges accessoires

- Vérifier le vendredi Épaules 3D : les accessoires avec `léger` / `modéré` doivent afficher une suggestion numérique si historique ou repère existe.
- Le bouton `!` doit rester cohérent avec cette suggestion.


## Phase 2 extraction moteur de charges

- Vérifier que `docs/PHASE_2_EXTRACTION_REPORT.md` est à jour.
- Vérifier l’ordre de chargement : `app_helpers`, `equipement`, `utilitaires_charges`, `mouvement`, `charge_gestion`, `progression_rpe`, `moteur_charges`, vues, `app.js`.
- Confirmer aucun changement dans `data/` ni `programs/`.


## V51.38 — Audit progression charges

- Lire `docs/CHARGE_PROGRESSION_AUDIT.md` avant toute nouvelle modification du moteur de charges.
- Ne pas extraire d’autre morceau de `app.js` avant d’avoir stabilisé le vieux patch runtime de `programs/config.js`.
- Tester Épaules 3D v2 S3 lundi/vendredi : suggestions, bouton `!`, historique, DB vs câble.
- Confirmer qu’aucun fichier `data/` et aucun programme `programs/` ne sont modifiés dans cette phase.
## V51.41 — Recentrage config/charges

- Vérifier que `programs/config.js` ne contient plus `coachBeurtV5018RuntimePatch`.
- Vérifier que `programs/config.js` ne remplace plus `athleteSuggestedLoad`, `loadInfoText`, `loadInfoButtonHtml` ou `showLoadInfoModal`.
- Tester le bouton jaune `!` en séance : il doit encore afficher l’historique des poids utilisés via `scripts/ui_modals.js`.
- Tester une suggestion de charge sur Épaules 3D v2 S3 lundi/vendredi.



## V51.41 — Contexte mouvement

- Vérifier que `coachBuildMovementContext` existe dans `scripts/charge/mouvements.js`.
- Vérifier que `athleteSuggestedLoad(..., context)` reste compatible avec les appels à 3 arguments.
- Tester Épaules 3D v2 S3 lundi/vendredi : aucune variation visible non demandée des suggestions.
- Confirmer que le contexte n’est pas écrit dans `data/` ni dans les programmes.


## V51.51 — Structure durable stricte

- Lire `docs/STRUCTURE_CONTRACT.md` avant de créer un nouveau dossier ou un nouveau module.
- Exécuter `node dev/structure_checks.js` avant chaque ZIP complet.
- Exécuter `node dev/structure_checks.js --update-package` depuis le dossier extrait du ZIP update.
- Refuser la livraison si un fichier runtime n’est pas chargé, si un script dev n’est pas cité, si un doc stable n’est pas référencé, ou si `programs/` contient un patch runtime.
- Chaque fichier doit servir à quelque chose : app runtime, programme, donnée protégée, validation, documentation stable ou asset PWA référencé.

## V51.51 — Validation update auto-détectée

- Depuis V51.51, `node dev/structure_checks.js` et `node dev/regression_checks.js` détectent automatiquement le mode `update` si `data/` est absent.
- `--update-package` reste accepté comme override.
- `--full` force la validation complète.
- Les validations doivent afficher clairement le mode détecté.
- Les en-têtes de version `// Coach Bertin/Beurt Vx.xx` dans `app.js` et `scripts/**/*.js` doivent matcher `APP_VERSION`.

## Outil dev optionnel — diagnostic charges

- `dev/charge_diagnostics.js` est conservé comme outil de lecture seule pour analyser un JSON de comparaison de charges déjà exporté.
- Usage : `node dev/charge_diagnostics.js <compare-json>`.
- Il ne doit jamais écrire dans `data/`.


## Vérification structure V51.51+

- Confirmer que `app.js` ligne 1 (`// Coach Bertin Vx.xx`) correspond à `APP_VERSION`.
- Confirmer que le moteur de charges vit sous `scripts/charge/`.
- Confirmer que `scripts/charge/index.js` expose `window.CoachCharge`.


## V51.51 — Vérification session

- Confirmer que `scripts/session/timer.js` est chargé dans `index.html`.
- Confirmer que les boutons timer Play/Pause/Reset fonctionnent en vue séance.
- Confirmer que le timer WOD garde le format `9:12`, `8:00`, `0:45`, `10:00`.


## Diagnostic app / logger

Avant livraison :

- Vérifier que `scripts/core/logger.js` est chargé tôt dans `index.html`.
- Vérifier que `window.CoachLog` existe.
- Ouvrir ⚙ Paramètres → `Diagnostic app`.
- Tester `Copier rapport erreurs`.
- Tester `Effacer erreurs`.
- Confirmer que le ZIP update ne contient pas `data/`.

- Documentation : `docs/ERROR_LOGGING.md`.
