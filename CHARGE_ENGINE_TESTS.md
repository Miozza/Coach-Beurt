# Architecture Coach Beurt

## Type d’application

PWA personnelle d’entraînement en JavaScript vanilla, sans framework.

## Vues principales

- **WOD+** : vue mobile-first pour choisir et lire la séance.
- **Séance** : exécution terrain iPhone, gros texte, saisie rapide.
- **Résultats** : saisie finale des poids/reps/RPE, séparée de PC.
- **PC** : inspection, semaine, route, analyse, export IA. Ce n’est pas un Builder.
- **Historique** : résultats réels sauvegardés dans les données durables.

## Dossiers

- `programs/` : programmes prévus.
- `scripts/` : vues et modules runtime extraits du noyau, incluant TMS.
- `dev/` : scripts de validation/développement hors application.
- `docs/` : documentation stable, non versionnée.
- `data/` : données/configuration.

## Données durables

Ne jamais écraser :

- `data/resultats.json`
- `data/athlete_state.json`
- `data/cycle_state.json`

`data/charges.js` reste une configuration d’équipement et de fallback. Il ne remplace pas l’historique réel.

## Chargement JS

`index.html` charge les scripts directement, avec cache-bust de version. Ce choix est volontaire pour la stabilité GitHub Pages + Safari/iPhone.

`programs/index.js` est le registre central des programmes, mais ne charge pas les scripts dynamiquement.


## Cycle Épaules 3D v2

`programs/epaules_3d_v2.js` est un programme runtime standard. Il ne remplace pas `programs/epaules_3d.js`; il ajoute une variante sélectionnable plus dense pour les séances du midi.


## Domaine charges

Le moteur de charges est regroupé dans `scripts/charge/` avec une porte d’entrée publique `scripts/charge/index.js` (`window.CoachCharge`). Aucun ES module, aucun build system. Voir `docs/PHASE_2_EXTRACTION_REPORT.md` et `docs/STRUCTURE_CONTRACT.md`.

## Domaine session

La séance terrain est regroupée dans `scripts/session/` avec `scripts/session/index.js` comme porte d’entrée publique (`window.CoachSession`). `app.js` orchestre, mais ne doit plus appeler directement les fonctions internes de session hors domaine.

## Frontière config / moteur charges — V51.39

`programs/config.js` doit rester statique : profil par défaut, mouvements, journées de base et banques WOD. Il ne doit pas patcher le runtime ni remplacer des fonctions de charges. La logique de charge vit dans `scripts/charge/` et la modale dans `scripts/ui_modals.js`.



## V51.50 — Structure durable

La structure durable est définie dans `docs/STRUCTURE_CONTRACT.md`.

Règle de base :

- `app.js` orchestre;
- `scripts/` contient le runtime;
- `programs/` contient seulement les programmes;
- `data/` contient les données et charges de base;
- `dev/` valide;
- `docs/` documente les contrats stables;
- `tools/` est interdit.

Le script `dev/structure_checks.js` vérifie que les fichiers servent à quelque chose et que les frontières restent propres.


### V51.50 — Domaine session

`session/` contient `view.js`, `timer.js`, `results.js`, `save.js`, `index.js`. Le timer guidé appartient à `scripts/session/timer.js`; le rendu de séance appartient à `scripts/session/view.js`.
