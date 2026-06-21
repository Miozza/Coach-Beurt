# ETAT_ACTUEL.md — Racine

## Dernière modification — V51.83
### Splash iPhone au lancement

- Ajoute `racine-splash.png` comme écran de démarrage visuel.
- Au lancement sur écran mobile/iPhone, l'image s'affiche plein écran environ 2,4 secondes puis disparaît en fondu.
- Sur desktop/tablette large, le splash est retiré immédiatement pour ne pas gêner le travail.
- L'écran est purement visuel : il ne modifie aucune donnée, aucun programme et aucune logique d'entraînement.
- Aucun fichier `data/` ou `programs/` modifié.

- Application : Racine.
- Type : PWA d’entraînement personnelle, JavaScript vanilla, sans framework.
- Version actuelle : V51.83
- Date du document : 2026-06-21.
- Repo GitHub principal : `Miozza/Coach-Beurt`.
- Repo GitHub dev : `Miozza/Coach-Beurt-Dev`.
- Objectif macro déclaré : compétition CrossFit autour du `2027-01-15`.
- Cycle actif réel sur l’iPhone ou le repo officiel : [À CONFIRMER PAR BERTIN].

Détails version :

- `app.js` : `APP_VERSION = "V51.83"`.
- `index.html` : titre/topnav/footer/cache-bust `51.83`.
- `README.md` : version courante `V51.83`.
- `ETAT_ACTUEL.md` : version courante `V51.83`.
- `CHANGELOG.md` : historique de versions.
- `manifest.json` : nom installé sans version.
- `service-worker.js` : nom de cache stable sans version.


---

## 2. Règle documentaire fixe

Règle durable :

- `CHANGELOG.md` est le seul endroit où entreposer l’historique des modifications.
- Ne plus créer de fichiers `RELEASE_NOTES_*`.
- Ne plus créer de fichiers d’audit, bilan, checklist ou état portant une version dans le nom.
- Les documents utiles doivent avoir des noms stables, sans version.
- Les vieux fichiers redondants ou historiques doivent être supprimés du ZIP final, pas accumulés.

Documents fixes conservés :

- `README.md`
- `CHANGELOG.md`
- `ETAT_ACTUEL.md`
- `RELEASE_CHECKLIST.md`
- `docs/ARCHITECTURE.md`
- `docs/STRUCTURE_CONTRACT.md`
- `docs/DATA_FLOW_CONTRACT.md`
- `docs/CHARGE_ENGINE.md`
- `docs/CHARGE_CONTEXT.md`
- `docs/CHARGE_ENGINE_TESTS.md`
- `docs/CHARGE_PROGRESSION_AUDIT.md`
- `docs/CHARGE_PROGRESSION_CONTRACT.md`
- `docs/PHASE_2_EXTRACTION_REPORT.md`
- `docs/ERROR_LOGGING.md`
- `docs/UI_CONSTRAINTS.md`

---

## 3. Règles inviolables

Ne jamais modifier ou écraser sans demande explicite :

- `data/resultats.json`
- `data/athlete_state.json`
- `data/cycle_state.json`

Ne pas modifier `data/charges.js` sauf demande explicite.

Ne pas réécrire les programmes ou les séances sauf demande explicite.

Les ZIP `update-files-no-durable-data` doivent toujours exclure tout le dossier `data/`.

---

## 4. Programmes protégés

Les programmes restaurés et actifs doivent rester présents :

- `programs/epaules_3d.js` — Phase 1, Épaules 3D + Triceps.
- `programs/epaules_3d_v2.js` — Épaules 3D v2 — Midi dense.
- `programs/hypertrophy_base.js` — Phase 2, Hypertrophie / Force Base.
- `programs/force_performance.js` — Phase 3, Force + Résistance musculaire.
- `programs/competition_peak.js` — Phase 4, Compétition CrossFit Peak.
- `programs/heritage_225.js` — Héritage 225.

Héritage 225 doit rester visible dans la sélection de cycle, sans activation automatique.

`programs/test.js` a été retiré et ne doit pas revenir.

---

## 5. Architecture actuelle

Racine :

- `index.html` : structure HTML, vues, scripts chargés explicitement.
- `app.js` : chef d’orchestre de l’app.
- `styles.css` : UI.
- `manifest.json` : PWA.
- `service-worker.js` : service worker sans cache applicatif durable.

Dossiers :

- `programs/` : programmes d’entraînement seulement.
- `scripts/` : code runtime utilisé par l’app, incluant TMS et modules de charges.
- `data/` : données/configuration.
- `dev/` : scripts de validation/développement hors application.
- `docs/` : documentation stable non versionnée.
- `tools/` : interdit, ne doit pas revenir.

Contrat : `docs/STRUCTURE_CONTRACT.md`.

---

## 6. Décisions en vigueur

- Service worker volontairement sans cache applicatif durable.
- `theme-color` uniforme : `#04060f`.
- WOD+ est la vue mobile-first principale.
- Séance guidée est la vue terrain iPhone prioritaire.
- Résultats est séparé de PC.
- PC reste une vue d’inspection/logistique, pas un Builder.
- La vue PC officielle est `pcView`; `phoneView` est un hôte hérité de compatibilité, pas une vue propriétaire.
- L’indicateur sync GitHub est une pastille discrète.
- Ne pas mélanger migration de données, refactor moteur et modification de programme dans la même release.
- `app.js` reste chef d’orchestre; les domaines spécialisés vivent dans `scripts/`.
- Une livraison app visible doit incrémenter la version affichée; une documentation seule ne l’incrémente pas automatiquement.

---

## 7. Règles UI verrouillées — vue séance

### Timer WOD

- Format obligatoire : `9:12`, `8:00`, `0:45`, `10:00`, `60:00`.
- Interdit : `09:12`, `08:00`, `00:45`.
- Secondes toujours à deux chiffres.
- Viser environ 95 % de la largeur interne utile.
- Aucun dépassement horizontal.
- Boutons Play / Pause / Reset accessibles.

### Vue séance iPhone

- Boutons `Précédent` et `Bloc suivant` toujours accessibles en portrait iPhone.
- Les blocs longs doivent scroller sans pousser les actions hors écran.
- La vue séance est prioritaire sur les autres vues mobiles.

---

## 8. Validation obligatoire

Avant chaque ZIP :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Pour un ZIP update :

```bash
node dev/regression_checks.js --update-package
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js --update-package
```

---

## 9. Chantiers ouverts

Priorités à garder séparées :

1. Tester V51.83 sur DEV après import.
2. Revalider la vue séance sur iPhone.
3. Vérifier Épaules 3D v2 S3 avec vraies données.
4. Nettoyer seulement si un test structurel échoue.
5. Future migration possible vers `scripts/charge/`, mais uniquement dans une version dédiée.

## Note récente — WOD+ source unique charge

- WOD+ ne force plus le contexte `kind:"wodplus"` pour les exercices de blocs.
- Les cartes WOD+ appellent `CoachCharge.suggestLoad()` avec le vrai contexte du bloc : `kind`, `blockTitle`, `note`, `text`, `format`, `day`, `week`.
- Objectif : même décision de charge entre WOD+, Séance, PC et fenêtre `!`.
- Aucun fichier `data/` ni `programs/` modifié.


## Contrats structurels

- `docs/DATA_FLOW_CONTRACT.md` clarifie le flux `resultats` -> `state.history` -> `athlete_state` et fixe `data/charges.js` comme configuration equipement non reecrite par les seances.
