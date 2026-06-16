## V51.52 — Cohérence décision charge

- Corrige la cohérence entre la charge affichée dans la séance et la fenêtre `!` : la modale lit maintenant le même indice de décision généré par `CoachCharge`.
- Déduplique l’historique affiché dans la fenêtre `!` quand la même séance existe à la fois dans `athlete_state` et dans l’historique de résultats.
- Renforce le moteur : un dernier RPE ≥ 9 bloque réellement la hausse finale; un dernier RPE ≤ 7 avec reps atteintes peut proposer la prochaine charge disponible si le contexte le permet.
- Corrige la famille d’équipement de `Bulgarian Split Squat`, `DB RDL` et mouvements DB apparentés pour éviter qu’ils soient classés comme barre à cause des mots `squat` ou `deadlift`.
- Ajoute des tests anti-régression sur Bulgarian Split Squat et DB RDL.
- Ne modifie pas `data/`, `data/charges.js` ni `programs/`.

# CHANGELOG

## V51.51 — Date de départ cycle confirmable

- Ajoute une date de départ explicite du cycle actif (`activeCycleStartDate`).
- Ajoute dans l’onglet Cycle un champ `Date de départ du cycle` avec boutons `Aujourd’hui`, `Lundi cette semaine` et `Appliquer date`.
- Au démarrage/changement de programme, l’app confirme la date de départ et calcule la semaine affichée à partir de cette date.
- La date sert seulement au calendrier/position du cycle : elle ne modifie pas le moteur de charges, l’historique réel, `athlete_state`, `data/charges.js` ni les programmes.
- Sauvegarde la date dans `cycle_state` avec compatibilité douce `cycleStartedAt`.
- Les cycles mis en pause/archivés conservent aussi leur date de départ pour reprise plus juste.
- Aucun fichier `data/`, aucun `data/charges.js` et aucun programme d’entraînement modifiés.

## V51.49 — Logger d’erreurs runtime

- Ajoute `scripts/core/logger.js` comme journal local des erreurs runtime.
- Expose l’API publique `window.CoachLog` : `info`, `warn`, `error`, `getReport`, `copyReport`, `clear`, `count`.
- Capture automatiquement `window.onerror`, les promesses rejetées et les erreurs de chargement de ressources.
- Ajoute dans ⚙ Paramètres la section `Diagnostic app` avec `Copier rapport erreurs` et `Effacer erreurs`.
- Ajoute des logs volontaires sur les erreurs GitHub, sync, import backup, wake lock, sauvegarde séance et timer.
- Documente le logger dans `docs/ERROR_LOGGING.md`.
- Renforce les validations pour confirmer que `scripts/core/logger.js` est chargé tôt et que `CoachLog` existe.
- Aucun changement volontaire de comportement, de programme, de donnée ou de suggestion de charge.

## V51.48 — Stabilisation session interne

- Le domaine `scripts/session/` contient maintenant `view.js`, `timer.js`, `results.js`, `save.js` et `index.js`.
- Déplace le timer guidé vers `scripts/session/timer.js`.
- Clarifie les responsabilités internes : `view.js` rend la séance, `timer.js` gère les timers, `results.js` gère les résultats, `save.js` orchestre la sauvegarde.
- Nettoie les messages de `dev/structure_checks.js` pour éviter les faux messages d’erreur quand tout est OK.
- Aucun changement volontaire de comportement, de programme, de donnée ou de suggestion de charge.

## V51.46 — Stabilisation API CoachCharge

- Remplace les appels directs à l’ancien moteur global par l’API publique `CoachCharge.*` hors `scripts/charge/`.
- Garde les anciennes fonctions globales seulement comme compatibilité interne/transitoire.
- Renforce `dev/structure_checks.js` pour refuser les nouveaux appels directs au moteur de charges hors domaine `scripts/charge/`.
- Aucun changement volontaire de suggestion, de programme ou de donnée.

## V51.45 — Domaine charge regroupé

- Regroupe les modules du moteur de charges dans `scripts/charge/`.
- Ajoute `scripts/charge/index.js` comme porte d’entrée publique `window.CoachCharge`.
- Supprime les anciens emplacements directs `scripts/equipement.js`, `scripts/utilitaires_charges.js`, `scripts/mouvement.js`, `scripts/charge_gestion.js`, `scripts/progression_rpe.js`, `scripts/moteur_charges.js`.
- Renforce `dev/structure_checks.js` et `dev/regression_checks.js` : le commentaire d’en-tête de `app.js` doit correspondre à `APP_VERSION`.
- Corrige l’en-tête de `app.js` : `// Coach Bertin V51.45`.
- Aucun changement volontaire de comportement, aucun fichier `data/`, aucun `data/charges.js` et aucun programme d’entraînement modifiés.

## V51.44 — Structure durable stricte

- Ajoute `docs/STRUCTURE_CONTRACT.md` pour fixer les responsabilités durables de `app.js`, `scripts/`, `programs/`, `data/`, `dev/` et `docs`.
- Ajoute `dev/structure_checks.js` pour vérifier que chaque fichier sert à quelque chose : scripts runtime chargés, scripts dev cités, docs stables référencés, assets PWA utilisés.
- Verrouille l’interdiction de `tools/`, des rapports versionnés temporaires et des patchs runtime dans `programs/`.
- Renforce la règle : `programs/config.js` reste configuration statique seulement.
- Aucun changement de comportement, aucun fichier `data/`, aucun `data/charges.js` et aucun programme d’entraînement modifiés.

## V51.43 — Contrat progression des charges

- Ajoute `docs/CHARGE_PROGRESSION_CONTRACT.md` pour fixer la règle : la progression des charges est un pilier égal au choix des mouvements.
- Ajoute `dev/progression_contract_checks.js`, une validation dédiée au contrat de progression.
- Vérifie que `programs/config.js` reste configuration seulement, sans vieux patch runtime ni logique concurrente de charges.
- Vérifie que les noms de mouvements restent simples et que les intentions vivent dans le contexte/notes/blocs.
- Vérifie dynamiquement les cas critiques : DB ≠ câble, Power Clean WOD/technique ≠ Power Clean principal, historique filtré par contexte.
- Aucun changement volontaire de suggestion de charges.
- Aucun fichier `data/`, aucun `data/charges.js` et aucun programme d’entraînement modifiés.

## V51.41 — Progression contextualisée

- Utilise le contexte mouvement ajouté en V51.40 dans les décisions prudentes du moteur de charges.
- Les contextes `technique`, `wod`, `light`, `progression` et `recovery` ne sont plus auto-progressés comme un mouvement principal.
- Le moteur filtre l’historique selon le contexte quand l'information existe, afin qu'une entrée technique/WOD ne pollue pas une progression principale.
- Les résultats enregistrés peuvent conserver le contexte du mouvement dans l'historique futur.
- Ajoute les helpers `coachIsLimitedProgressionContext`, `coachContextProgressionReason` et `coachFilterHistoryForProgression`.
- Aucun fichier `data/`, aucun `data/charges.js` et aucun programme d’entraînement modifiés.

## V51.39 — Nettoyage `programs/config.js`

- Retire le vieux patch runtime `coachBeurtV5018RuntimePatch()` de `programs/config.js`.
- `programs/config.js` redevient un fichier de configuration : profil par défaut, mouvements, journées de base et banques WOD.
- Les décisions de charges restent centralisées dans les modules `scripts/*` extraits en V51.37.
- La modale jaune `!` reste gérée par `scripts/ui_modals.js`.
- Aucun changement volontaire de logique de suggestion, aucun fichier `data/`, aucun programme d’entraînement modifié.


## V51.38 — Audit progression des charges

- Ajoute le rapport stable `docs/CHARGE_PROGRESSION_AUDIT.md`.
- Analyse le moteur de charges extrait en V51.37 sans changer volontairement le comportement.
- Cartographie les flux : suggestion avant séance, enrichissement des résultats, mise à jour `athlete_state`, bouton jaune `!` et mapping des mouvements.
- Identifie la zone la plus risquée : vieux patch runtime dans `programs/config.js` qui influence encore charges, modale `!` et programme shoulders3d.
- Recommande de stabiliser la frontière du moteur avant toute nouvelle extraction ou amélioration.
- Aucun fichier `data/`, aucun programme et aucun `data/charges.js` modifiés.

## V51.37 — Phase 2 extraction prudente moteur de charges

- Création des modules runtime : `scripts/charge/equipement.js`, `scripts/charge/utilitaires.js`, `scripts/charge/mouvements.js`, `scripts/charge/historique.js`, `scripts/charge/rpe.js`, `scripts/charge/suggestion.js`.
- Extraction de fonctions depuis `app.js` et `scripts/app_helpers.js` sans changement volontaire de comportement.
- `index.html` charge les modules dans l’ordre prudent avant les vues et `app.js`.
- Ajout du rapport stable `docs/PHASE_2_EXTRACTION_REPORT.md`.
- Aucun fichier `data/`, aucun programme et aucun `data/charges.js` modifiés.


## V51.36 — Épaules 3D v2 — WOD benchmarks restaurés

- Ajuste `programs/epaules_3d_v2.js` sans toucher au cycle Épaules 3D original.
- Garde le nouveau WOD du lundi v2 : `AMRAP 8 : 8 DB Bench + 10 KB Swing + 12 Sit-Up`.
- Restaure les WODs originaux du mardi, jeudi et vendredi dans la v2 pour préserver les références à améliorer.
- Mardi v2 : `EMOM 10 : min 1 = 12 cal Row ; min 2 = 8-10 Ring Row`.
- Jeudi v2 : `For time 21-15-9 : Cal Bike + Box Step-Up`, cap 8 min.
- Vendredi v2 : `AMRAP 8 : 5 Power Clean + 8 Wall Balls + 10 cal Row`.
- Ajoute les garde-fous associés dans `dev/regression_checks.js`.
- Aucun fichier durable et aucun `data/charges.js` modifiés.

## V51.35 — Épaules 3D v2 — Midi dense

- Ajoute un nouveau cycle sélectionnable `Épaules 3D v2 — Midi dense` sans écraser le cycle Épaules 3D original.
- Conserve la même intention : épaules/triceps, overhead stable, posture et WOD court.
- Réorganise les séances pour le midi : warm-up court, un mouvement prioritaire, un bloc support, WOD fonte obligatoire, mini-reset.
- Garde les noms simples et compatibles avec les alias de transition afin que l’historique/RPE/charges déjà créés dans Épaules 3D restent utilisables.
- Aucun fichier durable et aucun `data/charges.js` modifiés.


## V51.34 — Noms mouvements simples partout

- Audit complet des noms de mouvements dans tous les programmes.
- Retrait des préfixes de sous-blocs dans les noms de mouvements (`A1.`, `B1.`, `C2.`, etc.).
- Retrait des intentions dans les noms de mouvements (`technique`, `progression`, `tempo`, `pump`, `strict`, `contrôlé`, `léger`, `modéré`).
- Conservation de l’équipement utile à la charge : DB, câble, barre, machine, KB, poids du corps.
- Ajout d’alias de transition pour protéger la progression et l’historique des charges.


## V51.34 — Noms mouvements encore plus simples

- Simplifie deux noms restés trop descriptifs dans `programs/competition_peak.js` sans changer la programmation.
- Remplace `Pull-Up technique` par `Pull-Up`.
- Remplace `Hanging Knee Raise progression` par `Knee Raise`.
- Conserve les anciens noms comme alias de transition pour protéger l’historique déjà sauvegardé.
- Renforce `dev/regression_checks.js` pour empêcher le retour de `technique` et `progression` dans les noms de mouvements.
- Aucune donnée durable et aucun `data/charges.js` modifiés.


## V51.32 — Nettoyage noms mouvements programmes non actifs

- Nettoie les noms ambigus dans les programmes non actifs sans changer les séries, reps, journées ni intentions.
- Remplace les noms combinés ou parasites (`ou`, `/`, `Cable/Band`, `léger` dans le nom) par des noms stables.
- Clarifie les équipements dans les noms lorsque ça influence la charge : DB, câble, barre, poids du corps.
- Ajoute des alias de transition pour protéger l’historique déjà sauvegardé.
- Renforce `dev/regression_checks.js` pour empêcher le retour des noms de mouvements combinés dans les programmes.
- Aucune donnée durable et aucun `data/charges.js` modifiés.

## V51.31 — Nettoyage noms Épaules 3D + transition historique

- Nettoie les noms ambigus dans `programs/epaules_3d.js` sans changer les séances, séries, reps ni charges prévues.
- Renomme `Lateral Raise haltères` → `Lateral Raise DB`, `Lateral Raise câble bas` → `Lateral Raise câble`, `Rear Delt Fly haltères` → `Rear Delt Fly DB`, `Rear Delt Fly câble bas` → `Rear Delt Fly câble`.
- Remplace `Overhead Rope Extension — rappel vendredi` par `Overhead Rope Extension` dans le programme source.
- Conserve les anciens noms comme alias de transition pour ne pas perdre l’historique ni la progression des charges.
- Renforce `dev/regression_checks.js` pour empêcher le retour des noms parasites dans Épaules 3D.
- Aucune donnée durable et aucun `data/charges.js` modifiés.

## V51.30 — Mapping charges par équipement + noms propres

- Sépare les alias de mouvements par équipement : haltères, câble, machine, barre et poids du corps ne partagent plus automatiquement leurs historiques de charge.
- Empêche `Lateral Raise haltères` de reprendre l’historique de `Lateral Raise câble`, et même règle pour `Rear Delt Fly`.
- Sépare les contextes `DB Shoulder Press`, `Landmine Press`, `Weighted Pull-up`, `Ring Row`, `Power Clean technique`, `Power Clean WOD` et `Power Clean`.
- Nettoie l’affichage des suffixes internes comme `— rappel vendredi` sans modifier les fichiers de programme.
- Renforce `dev/regression_checks.js` pour empêcher le retour des alias trop larges.


## V51.30 — Suggestions de charges accessoires robustes

- Corrige les suggestions de poids manquantes sur le vendredi du cycle Épaules 3D.
- Les charges non numériques comme `léger` ou `modéré` utilisent maintenant l’historique, les alias de mouvement ou un repère interne prudent.
- Les variantes `DB Shoulder Press`, `DB Shoulder Press / Landmine Press`, `Lateral Raise haltères`, `Rear Delt Fly haltères`, `Overhead Rope Extension — rappel vendredi` et `Wide-Grip Cable Upright Row` sont mieux reliées à leurs historiques.
- Le bouton jaune `!` indexe aussi les alias de mouvement pour afficher le bon contexte.
- Aucun programme, aucune donnée durable et aucun fichier `data/charges.js` modifiés.


Toutes les modifications de version doivent être inscrites ici.

Règle fixe depuis `V51.10` : ne plus créer de fichiers `RELEASE_NOTES_*`, `AUDIT_*`, `*_Vxx.xx.md/json/txt` ou autre document historique portant une version dans son nom. Les bilans de version vont dans ce fichier seulement.

---

## V51.30 — Bouton ! séance simplifié + historique robuste

- Simplifie la modale du bouton jaune `!` / `⚠` en vue séance : priorité à l’historique de charge, avec moins d’informations secondaires.
- Corrige la recherche d’historique quand la vue séance fournit le mouvement sous `title` plutôt que `name`.
- Ajoute une correspondance plus robuste pour les noms partiels ou alternatifs, par exemple `DB Shoulder Press` versus `DB Shoulder Press / Landmine Press`.
- Conserve le fallback `athlete_state` + `state.history`.
- Renforce le garde-fou anti-régression associé.
- Aucun programme, aucune charge officielle et aucune donnée durable modifiés.

## V51.27 — Historique de charge dans le ! séance

- Correction du bouton jaune `!` / `⚠` en vue séance : la modale affiche maintenant l’historique des poids utilisés même si l’information vient de `state.history` plutôt que seulement de `athlete_state`.
- Recherche de mouvement renforcée : noms canoniques, noms nettoyés et résultats locaux sont comparés pour éviter les trous d’historique.
- Ajout d’un garde-fou anti-régression pour conserver la section `Historique des poids utilisés`.
- Aucun programme, aucune charge officielle et aucune donnée durable modifiés.

## V51.27 — Socle anti-régression

- Ajoute `dev/regression_checks.js`, fichier fixe de garde-fous techniques.
- Vérifie les règles critiques : données durables exclues des ZIP update, absence d’artefacts versionnés, présence des programmes protégés, cohérence des versions et présence de `heritage_225`.
- Verrouille par test le format du timer WOD : `9:12`, `0:45`, `10:00`, `60:00`, sans zéro inutile devant les minutes.
- Vérifie les contrôles Résultats : poids/reps/RPE en `− valeur +`, RPE par pas de 0.5, For Time `00:00` à `60:00`, charges haltères selon la liste du gym.
- Centralise le format timer WOD dans `scripts/app_helpers.js` et fait utiliser ce helper par `scripts/view_session.js`.
- Renforce `RELEASE_CHECKLIST.md` et `docs/UI_CONSTRAINTS.md` sans créer de fichier de release/audit versionné.
- Aucun programme, aucune séance, aucune charge et aucune donnée durable modifiés.

## V51.24 — Sécurisation timer WOD et vue séance

- Verrouille officiellement le format du timer WOD en vue séance : `9:12`, `8:00`, `0:45`, `10:00`, sans zéro inutile devant les minutes.
- Documente la règle de taille : viser 95 % de la largeur interne utile, avec mesure stable par gabarit (`8:88` ou `88:88`).
- Ajoute la validation obligatoire dans `RELEASE_CHECKLIST.md` pour éviter les régressions sur les boutons du timer et les boutons `Précédent` / `Bloc suivant`.
- Ajoute les règles dans `docs/UI_CONSTRAINTS.md`.
- Aucun changement de programme, de séance, de charges ou de données durables.

## V51.22 — Timer WOD sans zéro inutile

- Le timer WOD en mode séance n’affiche plus de zéro devant les minutes sous 10.
- Exemple : `9:12` au lieu de `09:12`; `10:00` reste `10:00`.
- L’auto-fit mesure un gabarit stable (`8:88` ou `88:88`) pour éviter que la taille change selon la forme des chiffres.
- Correction limitée au timer WOD en vue séance.

## V51.21 — Timer WOD 95 % largeur + hauteur utile

- Le timer WOD vise environ 95 % de la largeur interne disponible.
- Le calcul tient compte de la hauteur utile de la boîte timer.
- Correction limitée au timer WOD en mode séance.

## V51.20 — Timer WOD mesuré pleine largeur

- Correction du timer WOD en vue séance : auto-fit basé sur mesure du texte, pas sur `scrollWidth`.
- Le timer doit prendre presque toute la largeur disponible sans être coupé à droite.
- Correction ciblée : aucun programme, aucune donnée durable et aucun moteur de charge modifié.

## V51.19 — Timer WOD auto-fit strict

- Correction du timer WOD en mode séance qui pouvait encore dépasser horizontalement sur iPhone.
- Le calcul JS applique la taille avec priorité suffisante pour battre les anciennes règles CSS.
- Correction ciblée sur le timer WOD de la vue séance seulement.

## V51.18 — Résultats For Time : choix complet 00:00–60:00

- Résultats For Time : liste complète de `00:00` à `60:00`.
- Toutes les secondes sont disponibles dans la liste déroulante.
- L’objectif/cap détecté reste présélectionné automatiquement.
- Aucun changement aux programmes, aux séances, au moteur de charges ou aux données durables.

## V51.17 — Timer WOD auto-ajusté pleine largeur

- Ajoute un ajustement automatique de la taille du timer WOD en mode séance.
- Le timer essaie d'occuper presque toute la largeur disponible sans déborder.
- Correction ciblée à la vue séance WOD; les autres timers ne sont pas modifiés.

## V51.16 — Timer WOD sans débordement + résultats plus lisibles

- Correction du timer WOD en mode séance : retour à un gabarit large, mais sans débordement horizontal.
- Maintien de l’accessibilité des boutons du timer.
- Agrandissement du texte des noms de mouvements dans la vue Résultats.

## V51.15 — Vue séance WOD : noms propres + timer prioritaire

- Nettoie les noms de mouvements WOD en mode séance/résultats : une charge comme `14 lb` n’est plus intégrée au titre du mouvement.
- Retire les pastilles de charge sous le timer WOD en mode séance.
- Redonne l’espace libéré au timer WOD sans modifier les autres timers de l’app.

## V51.14 — Résultats avec contrôles compacts

- La vue Résultats adopte la même logique de saisie que la vue Séance : `− valeur +` pour poids, reps et RPE.
- Les anciennes pastilles de reps/RPE sont retirées de la saisie standard des résultats.
- Les valeurs restent synchronisées avec le cache guidé et la sauvegarde existante.

## V51.13 — Timer séance restauré

- Restaure la taille lisible du timer en mode séance.
- Conserve les protections V51.12 : carte WOD scrollable, boutons de navigation accessibles, bas d’écran moins gaspillé.

## V51.12 — Ajustement bas de vue séance et boutons timer

- Réduit la réserve excessive en bas de la vue séance iPhone.
- Corrige l’accessibilité des boutons des timers dans les blocs WOD/AMRAP/EMOM/For Time.
- Rend la carte WOD scrollable seulement quand la hauteur réelle manque.

## V51.11 — Stabilisation vue séance iPhone + témoin GitHub discret

- Stabilise la vue séance guidée sur iPhone.
- Rend le témoin GitHub plus discret dans la topnav.

## V51.10 — Nettoyage documentaire et structure fixe

- Nettoie les release notes/audits versionnés.
- `CHANGELOG.md` devient le seul endroit officiel pour l’historique.
- Retire `programs/test.js`.