# Checklist de livraison Racine

Cette checklist est une procedure stable. Elle ne remplace pas `CHANGELOG.md` et ne doit pas devenir un historique de versions.

## 1. Cadrage

- Confirmer l'objectif exact du changement.
- Ne pas melanger correction de programme, refonte UI, moteur de charges et migration de donnees dans la meme livraison.
- Lire `docs/STRUCTURE_CONTRACT.md` avant de creer, supprimer ou deplacer un fichier.
- Lire `docs/UI_CONSTRAINTS.md` si la livraison touche l'interface, WOD+, PC, Session ou Resultats.
- Lire `docs/DATA_FLOW_CONTRACT.md` si la livraison touche l'historique, les resultats ou l'etat athlete.
- Lire `docs/CHARGE_ENGINE.md`, `docs/CHARGE_CONTEXT.md` et `docs/CHARGE_PROGRESSION_CONTRACT.md` si la livraison touche les charges.

## 2. Zones protegees

Ne jamais modifier sans demande explicite :

- `data/resultats.json`
- `data/athlete_state.json`
- `data/cycle_state.json`
- `data/charges.js`
- `programs/`

Les fichiers `data/` sont la verite durable de l'entrainement, pas une zone de nettoyage.

## 3. Contrat de version

Appliquer le contrat de version de `docs/STRUCTURE_CONTRACT.md`.

Fichiers qui portent la version courante :

- `app.js`
- `index.html`
- `README.md`
- `ETAT_ACTUEL.md`
- `CHANGELOG.md`

Fichiers qui ne portent pas la version courante :

- `manifest.json`
- `service-worker.js`
- `scripts/*.js` hors `app.js`
- `docs/*.md` hors `README.md`, `ETAT_ACTUEL.md` et `CHANGELOG.md`
- `RELEASE_CHECKLIST.md`

Regle d'incrementation :

- changement visible ou comportement app : incrementer le patch affiche;
- refonte visible ou changement de frontiere important : passer a la prochaine version majeure `.00`;
- docs, CI, contrat ou nettoyage sans changement runtime : ne pas incrementer, sauf decision explicite.

## 4. Validation automatique

Executer avant livraison :

```bash
node dev/regression_checks.js
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js
```

Pour un dossier update sans donnees durables :

```bash
node dev/regression_checks.js --update-package
node dev/charge_engine_checks.js
node dev/progression_contract_checks.js
node dev/structure_checks.js --update-package
```

Les checks GitHub Actions doivent rester verts sur `main`.

## 5. Validation terrain minimale

Verifier dans l'app publiee apres deploiement :

- WOD+ s'ouvre et affiche la seance du jour.
- Le bouton Session ouvre la vue Session dediee.
- Resultats reste une vue separee de PC.
- PC reste une vue d'inspection programme : mouvements, poids prevus, temps/format, semaine, analyse et export.
- Gear permet encore sauvegarder, retirer et tester le token GitHub.
- Diagnostic charges dans Gear fonctionne en lecture seule.
- Diagnostic app permet copier et effacer le rapport d'erreurs.

## 6. Garde-fous UI sensibles

Si la livraison touche `styles.css`, `scripts/session/`, `scripts/view_wodplus.js`, `scripts/view_pc.js`, `scripts/app_navigation.js`, `app.js` ou `index.html`, verifier :

- le timer affiche `9:12`, `8:00`, `0:45`, `10:00`, jamais `09:12`, `08:00`, `00:45`;
- les boutons Play, Pause, Reset, Precedent et Bloc suivant restent accessibles;
- un WOD court, un AMRAP/CAP et un bloc long restent utilisables;
- PC, Session et Resultats ne se rendent pas les uns dans les autres.

## 7. Structure attendue

- `scripts/` = code runtime charge par l'app.
- `dev/` = validations et outils de developpement actifs.
- `programs/` = programmes d'entrainement seulement.
- `docs/` = contrats et documentation stable.
- `CHANGELOG.md` = seul historique de versions.
- `tools/`, `diagnostics/`, `RELEASE_NOTES_V*`, `AUDIT_V*`, `REPORT_V*` et fichiers temporaires versionnes ne doivent pas revenir.

## 8. Documents de reference

- `docs/STRUCTURE_CONTRACT.md`
- `docs/ARCHITECTURE.md`
- `docs/UI_CONSTRAINTS.md`
- `docs/DATA_FLOW_CONTRACT.md`
- `docs/CHARGE_ENGINE.md`
- `docs/CHARGE_CONTEXT.md`
- `docs/CHARGE_ENGINE_TESTS.md`
- `docs/CHARGE_PROGRESSION_CONTRACT.md`
- `docs/CHARGE_PROGRESSION_AUDIT.md`
- `docs/PHASE_2_EXTRACTION_REPORT.md`
- `docs/ERROR_LOGGING.md`
