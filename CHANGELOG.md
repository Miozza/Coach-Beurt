## V51.94 — Historique : ligne visible pour résultats sans load/result + note affichée

- Corrige `renderHistory()` (`app.js`) : la condition `if(r.load||r.result)` cachait toute entrée n'ayant que `rpe` (ex. EMOM récent sans `result`) — la ligne n'apparaissait pas dans l'historique malgré un résultat saisi.
- La note (`note`) saisie en séance s'affiche désormais sous la valeur dans l'historique (`.history-note`).
- Portée : `app.js`, `styles.css`. Aucun fichier `data/`, aucun programme, aucune logique moteur de charges modifiés.

## V51.93 — Conditioning cardio lisible en séance + résultat Distance/Calories

- Vue séance guidée : quand un bloc Conditioning ne contient qu'un effort cardio chronométré (Row, Ski Erg, Air Bike — ex. "Row facile 5 min"), le nom de la machine s'affiche désormais en gros texte cyan, à la même taille que le titre du bloc. Le texte n'était plus visible (fulltext masqué par design, tuiles WOD vides car pas de structure AMRAP/EMOM/ForTime parsée).
- Vue Résultats : ces mêmes blocs cardio obtiennent un champ de saisie dédié (Distance en mètres pour Row/Rameur, Calories pour Ski Erg/Air Bike/Bike) en plus du RPE — au lieu de n'avoir que RPE.
- Détection : `guidedDetectCardioMachine()` dans `view.js`, drapeaux `isCardio/cardioMetric/cardioUnit` dans `collectSessionExercises()` de `results.js`.
- Portée : `scripts/session/view.js`, `scripts/session/results.js`, `styles.css`. Aucun fichier `data/`, aucun programme, aucune logique moteur de charges modifiés.

## V51.92 - Correction définitive carrés complétés au changement de cycle

- Corrige `applyCycleStatePayload` (`app.js`) : la fonction appliquait
  correctement `completedDays: []` depuis le payload GitHub, puis appelait
  immédiatement `applyWeekTrackingForWeek` qui recalculait les jours depuis
  l'historique et écrasait le résultat correct.
- Fix : `applyWeekTrackingForWeek` n'est plus appelé quand le payload fournit
  un `completedDays` explicite — le payload GitHub fait foi.
- Les versions V51.90 et V51.91 (filtre cycle dans buildWeekTrackingForWeek)
  restent en place comme défense en profondeur.
- Aucun fichier `data/`, `data/charges.js` ni `programs/` modifié.

## V51.90 - Correction carrés complétés au changement de cycle

- Corrige `buildWeekTrackingForWeek` (`app.js`) : la reconstruction des jours complétés filtrait par semaine mais pas par cycle. En démarrant un nouveau programme à S1, les séances d'un ancien cycle à S1 marquaient tous les jours comme complétés → 4 carrés verts, "0 jour à traiter".
- Ajoute un filtre cycle : si l'entrée history porte un champ `cycle` différent du cycle actif, elle est ignorée. Rétrocompatible : les entrées sans champ `cycle` passent toujours.
- Aucun fichier `data/`, `data/charges.js` ni `programs/` modifié.

## V51.88 - Corrections séance guidée du programme Strict Muscle-Up Personnel

- Ajoute 26 nouvelles fiches dans `programs/tutorials.js` (false grip, ring support/turnout, ring dip, transitions, négatives, MU assisté en bande, accessoires force/jambes) : le bouton « ? » de la séance guidée trouve désormais un tutoriel pour tous les 39 noms d'exercice du cycle (31 n'avaient aucune fiche correspondante).
- Corrige le bloc lundi « D. Conditioning court » de `programs/strict_muscle_up_personnel.js` : le texte annonçait 8 min alors que le minuteur de la séance guidée est réglé sur 5 min, et une note de mission générique en fin de texte masquait la consigne réelle. Le texte annonce maintenant 5 min, sans la note, aligné sur le pattern des blocs conditioning mardi/jeudi du même programme.
- Aucun fichier `data/` modifié. Seuls `programs/strict_muscle_up_personnel.js` et `programs/tutorials.js` touchés.

## V51.87 - Ajout du programme Strict Muscle-Up Personnel

- Ajoute `programs/strict_muscle_up_personnel.js` : cycle personnel de 12 semaines, 4 jours fixes (lundi/mardi/jeudi/vendredi, ~60 min chacun), pour passer d'une base solide en strict pull-up/dip à un strict ring muscle-up propre puis un transfert bar muscle-up sans douleur d'épaule.
- 3 blocs de 4 semaines : S1-4 base/tissus/amplitude/stabilité, S5-8 force spécifique/transition/contrôle profond, S9-12 intégration/tentatives contrôlées/transfert bar. S4 et S8 = deload + validation, S12 = test conditionnel jamais obligatoire.
- Construit progressivement false grip, support aux anneaux, turnout, ring dip profond sans pincement, négatives contrôlées, MU assisté en bande puis assistance minimale — variété chaque semaine (angle de tirage, assistance, tempo, amplitude, accessoire triceps, exercice scapulaire, conditionnement).
- Conserve un vrai stimulus jambes et conditionnement chaque semaine, plus un maintien poussée léger — ce n'est pas un programme 100% haut du corps.
- Règles de douleur/validation en texte descriptif (`cycleRules`, `dayIntentions`, notes de bloc) : aucun mécanisme de suivi de douleur n'existe dans l'app, donc rien n'a été ajouté côté moteur.
- Ajouté au catalogue (`programs/index.js`, phase 0, `macroRole:"buffer"`) et chargé dans `index.html`, sans activation : `data/cycle_state.json` n'a pas été modifié, le cycle actif (Épaules 3D v2) continue normalement.
- Ajoute `dev/strict_muscle_up_personnel_checks.js` pour valider la structure du cycle (12 semaines, 4 jours, validations, jambes/conditionnement chaque semaine, test conditionnel, variation semaine à semaine).
- Aucun fichier `data/` ni autre fichier `programs/` modifié.

## V51.86 - Plancher historique pour la suggestion de charge

- Ajoute un plancher dans `guardedSuggestedLoadDecision` (`scripts/charge/suggestion.js`) : la suggestion ne descend plus sous le dernier poids réellement complété (reps atteintes, statut différent d'échec/recalibrage), même quand la table de charge fixe du programme est plus basse et même après le frein RPE récent générique.
- Corrige un cas vu en usage réel : Incline DB Press suggéré à 55 lb alors que l'historique montrait 60 lb x 8 @RPE 9 réussi plus récemment, avec la raison neutre « Charge du programme, arrondie selon l'équipement » qui ne reflétait pas l'historique réel.
- Le plancher reste désactivé en contexte limité (WOD/technique), en semaine de déload, et pour les mouvements techniques, pour ne pas masquer un vrai signal d'échec ou de récupération.
- Ajoute un nouveau cas de test dans `dev/charge_engine_checks.js` reproduisant ce scénario.
- Aucun fichier `data/` ni `programs/` modifié.

## V51.85 - Correction faux positif "technique" sur supersets

- Corrige `coachExtractMovementIntent` (`scripts/charge/mouvements.js`) : le mot « transition » déclenchait à tort l'intention « technique » dès qu'il apparaissait dans le texte d'un bloc, y compris dans des phrases purement descriptives sur le rythme d'un superset (ex. « Peu de transition, beaucoup de travail utile »).
- Ce texte de bloc est partagé par tous les exercices du superset, donc le faux positif bloquait l'auto-progression de plusieurs mouvements à la fois (ex. Incline DB Press, Lateral Raise câble, Barbell Row) et retombait sur la charge fixe du programme au lieu de l'historique réel.
- Retire uniquement le mot-clé générique « transition » de la détection ; les blocs réellement techniques restent détectés via « technique », « skill », « drill », « primer », etc.
- Aucun fichier `data/` ni `programs/` modifié.

## V51.84 - Splash mobile plus léger et fiable

- Remplace `racine-splash.png` (2,5 Mo) par `racine-splash.webp` (~200 Ko) pour un chargement fiable sur réseau mobile.
- Augmente le délai de secours du splash (1,2 s → 3 s) pour éviter qu'il disparaisse sans s'afficher sur connexion lente.
- Le service worker laisse désormais le cache HTTP normal gérer l'image du splash, au lieu de forcer un re-téléchargement réseau à chaque ouverture.
- Aucun changement aux données durables, aux programmes ou au moteur d'entraînement.

## V51.83 - Splash iPhone Racine

- Ajoute `racine-splash.png` comme écran de lancement visuel.
- Sur mobile/iPhone, le splash s'affiche en plein écran environ 2,4 secondes puis disparaît en fondu.
- Sur écran large, le splash est retiré immédiatement pour ne pas gêner l'usage bureau.
- Aucun changement aux données durables, aux programmes ou au moteur d'entraînement.

## V51.82 - Ajout de références de charge dans data/charges.js

- Ajoute 12 mouvements à `window.DEFAULT_CHARGES` : `Deadlift` (185 lb), `Barbell Row` (145 lb), `Dumbbell Row` (70 lb / main), `Romanian Deadlift` (135 lb), `DB Bench Press` (60 lb / main), `DB Curl` (35 lb / main), `Hammer Curl` (40 lb / main), `Close-Grip Bench Press` (165 lb), `Front Rack Carry` (95 lb), `Cable Hip Abduction` (25 lb), `Cable Pull-Through` (45 lb), `Goblet Squat` (45 lb).
- Ces mouvements vivent dans des programmes secondaires (`force_performance.js`, `hypertrophie_fesse.js`, `posture_cyphose.js`) sans charge littérale ni historique réel — ils n'avaient ni plancher numérique ni filet de sécurité avant cet ajout.
- Valeurs fournies et ajustées directement par Bertin.
- Exception explicite et ponctuelle à la règle de fichier protégé pour `data/charges.js` — demandée et confirmée par Bertin, à ne pas reproduire sans confirmation équivalente.
- `config.js`, `workouts.js` et `data/resultats.json` restent protégés, non touchés.

## V51.81 - Navigation de semaine sans contamination

- Centralise les changements de semaine dans `setActiveWeek()` pour les flèches, les onglets de semaine et le handler de swipe désactivé.
- Reconstruit `completedDays` et `missedDays` depuis `state.history` et `weekTransitions` quand l'utilisateur change manuellement de semaine.
- Les semaines passées peuvent réafficher leurs jours réellement complétés, sans contaminer les semaines futures.
- Filtre puis reconstruit le `cycle_state` reçu de GitHub selon le cycle et la semaine actifs.
- Ajoute un garde-fou dans `dev/regression_checks.js`.
- Aucun fichier `data/` ou `programs/` modifié.

## V51.80 - Repères de charge pour DB Fly / DB Pullover

- Ajoute `DB Fly` (30 lb/main) et `DB Pullover` (45 lb) dans `coachDefaultLoadSeedForMovement` (`scripts/charge/historique.js`) — seuls mouvements d'Arnold Split Beurt qui démarraient vraiment à froid.
- Audit complet : tous les autres mouvements du programme sont déjà couverts par l'historique réel, une charge littérale dans le programme, ou `data/charges.js`.
- Estimations de départ, pas des données mesurées — le moteur se recalibre dès la première séance loggée.
- `data/charges.js` reste intact (protégé). Aucun changement à `programs/arnold_split_beurt.js`.

## V51.79 - Corrige l'échec CI du workflow jamais audité

- `.github/workflows/coach-beurt-checks.yml` n'avait jamais été vérifié lors du renommage en Racine (V51.75) : ses assertions exigeaient encore `// Coach Bertin ${version}` et `<title>Coach Bertin ${version}</title>`, faisant échouer la CI depuis V51.75. Corrigé.
- Balayage complet du repo : corrige aussi le message d'erreur visible dans `index.html`, le commentaire d'en-tête de `service-worker.js`, les textes visibles dans les écrans Arnold/Stéphanie, le titre du rapport d'erreur, et l'export "Contexte IA" de la Vue PC.
- Volontairement laissés tels quels : commentaires d'en-tête internes des fichiers `programs/*.js`/`scripts/*.js` (jamais affichés), et `data/charges.js` (fichier protégé).
- Aucun changement à `manifest.json`, aux identifiants de code internes, ou au comportement fonctionnel.

## V51.78 - Icône PWA : "R" métallique enraciné

- Remplace les 5 fichiers d'icône par la nouvelle version choisie : lettre "R" métallique avec racines.
- Source 1254×1254, redimensionnement direct sans marge additionnelle.
- Vérifié par simulation de masque squircle iOS : 0% de pixels lumineux hors masque.
- Aucun changement à `manifest.json` ni au code fonctionnel.

## V51.77 - Icône PWA finale

- Remplace les 5 fichiers d'icône par la version finale choisie par Bertin (source 1254×1254, déjà cadrée par l'outil de génération).
- Redimensionnement direct, sans marge additionnelle (un essai avec marge superposée créait un double-cadre visible, abandonné).
- Vérifié par simulation de masque squircle iOS : 0,03% de pixels lumineux hors masque, négligeable.
- Aucun changement à `manifest.json` ni au code fonctionnel.

## V51.76 - Nouvelle icône PWA Racine

- Remplace les 5 fichiers d'icône (`icon-180/192/512.png`, `apple-touch-icon.png`, `apple-touch-icon-precomposed.png`) par l'illustration graine/racine lumineuse choisie par Bertin.
- Source 838×838 recomposée sur un canevas 1024×1024 à 76% d'échelle (~12% de marge par côté), fondu doux aux bords, pour protéger les pointes de feuilles et de racines du masque arrondi iOS / zone de sécurité Android. Marge colorée en #04060f pour matcher `background_color` du manifest.
- Rappel : icônes déjà installées sur un écran d'accueil ne se mettent pas à jour seules, il faut réinstaller.
- Aucun changement à `manifest.json`, au nom affiché, ou au code fonctionnel.

## V51.75 - Renommage du produit en Racine

- Renomme le nom affiché du produit "Coach Bertin" / "Coach Beurt" → "Racine" : `<title>`, footer, manifest PWA (name/short_name), README.md, ETAT_ACTUEL.md, docs/*.md, en-tête de `app.js`.
- Met à jour les assertions de nom dans `dev/structure_checks.js` et `dev/regression_checks.js` pour valider "Racine" au lieu de "Coach Bertin" (auraient échoué sinon contre le nouveau titre).
- Topnav : remplace l'abréviation "CB" par un logo "R" stylisé (Orbitron 900, glow cyan).
- Hors scope sur demande explicite : identifiants de code internes (`COACH_BERTIN_*`), clés `localStorage`, nom de cache du service worker, repos GitHub/URL, et le profil athlète `bertin` — tous inchangés.
- Les entrées historiques du CHANGELOG (ci-dessous) ne sont pas réécrites, elles restent un registre fidèle de l'état passé.

## V51.74 - Profil par défaut + scroll-to-top

- `scripts/stephanie_mode.js` : ajoute `?preview=X` (X = bertin/stephanie/arnold), qui affiche un profil pour la visite en cours sans écrire dans `localStorage`. Corrige le fait qu'une simple visite de `?profile=arnold` écrasait silencieusement le profil par défaut du lien de base pour toujours. `?profile=X` garde son comportement mémorisé existant (nécessaire à l'icône PWA installée de Stéphanie).
- `scripts/arnold_mode.js` et `scripts/stephanie_mode.js` : ajoute `window.scrollTo(0,0)` au point central de navigation (`renderArnoldSimpleApp` / `renderStephanieSimpleApp`). Aucun des deux fichiers ne gérait le scroll, donc la position restait celle de l'écran précédent en changeant de carte.
- Aucun changement à `programs/arnold_split_beurt.js`, `data/`, `data/charges.js`, ou aux programmes protégés existants.

## V51.73 - Arnold Split Beurt — retirer Deadlift du Type A

- Retire le Deadlift conventionnel du Type A (Pecs+Dos) de `programs/arnold_split_beurt.js`. Dans le vrai split Arnold original (vérifié contre la source), le mouvement deadlift (Straight Leg Deadlift) vit sur le jour Jambes, jamais sur Pecs+Dos. Déjà couvert correctement par Romanian Deadlift dans le Type C.
- Remplace par un superset DB Fly + DB Pullover (vrai mouvement du Jour 1 original, fait couché sur banc, zéro charge lombaire).
- Nettoie les `cycleRules` qui mentionnaient encore le Deadlift conventionnel.
- Même durée totale (~51 min). Aucun changement aux Types B et C, à la rotation A/B/C ni aux charges de départ.
- Aucun changement à `data/`, `data/charges.js` ou aux programmes protégés existants.

## V51.72 - Arnold Split Beurt — réordonner Type A pour le dos

- Réordonne la séance Type A (Pecs+Dos) de `programs/arnold_split_beurt.js` : Bench Press → superset Pull-Up + Face Pull (tampon sans charge lombaire) → Deadlift, fait frais → superset Barbell Row + Incline DB Press en sous-maximal après le Deadlift.
- Corrige le fait que Bench Press et Deadlift étaient consécutifs sans tampon, et que Barbell Row (charge lombaire) précédait directement le Deadlift.
- Même durée totale (~53 min). Aucun changement aux Types B et C, à la rotation A/B/C ni aux charges de départ.
- Aucun changement à `data/`, `data/charges.js` ou aux programmes protégés existants.

## V51.71 - Arnold Split Beurt — supersets 60 min

- Restructure les 3 types de séance (A/B/C) de `programs/arnold_split_beurt.js` en supersets pour tenir dans 60 minutes.
- Bench Press, Back Squat et Deadlift restent seuls avec repos complet (2:00-2:30) : mouvements lourds/techniques, pas de superset par sécurité.
- Tous les autres mouvements jumelés en paires : transition courte (0:20-0:30) entre les deux, vrai repos (1:00-1:15) après la paire avant de reprendre.
- Durées par type : A ~53 min, B ~51 min, C ~55 min, warm-up et sortie inclus.
- Aucun changement de rotation A/B/C, d'enregistrement dans `programs/index.js`, ni des charges corrigées en V51.70.
- Aucun changement à `data/`, `data/charges.js` ou aux programmes protégés existants.

## V51.70 - Arnold Split Beurt — correction charges S1

- Corrige 4 charges de départ trop légères dans `programs/arnold_split_beurt.js` : Barbell Row 185 lb, Deadlift 250 lb, DB Shoulder Press 50 lb/main, Romanian Deadlift 140 lb — selon les repères réels donnés par Bertin.
- Aucun changement de structure, de rotation A/B/C, ni d'enregistrement dans `programs/index.js`.
- Aucun changement à `data/`, `data/charges.js` ou aux programmes protégés existants.

## V51.69 - Arnold Split Beurt

- Ajoute `programs/arnold_split_beurt.js`, un vrai programme connecté au moteur de charge (CoachCharge), distinct du mode local expérimental `Arnold Split 2026 — Adapté` qui reste inchangé.
- Rotation continue de 3 séances (Pecs+Dos, Épaules+Bras, Jambes) sur 4 jours d'entraînement (lundi/mardi/jeudi/vendredi) : le type de séance par jour change d'une semaine à l'autre sur un cycle de 3 semaines.
- Mouvements choisis pour maximiser la réutilisation de l'historique réel déjà dans `athleteState` (Barbell Row, Bulgarian Split Squat, Cable Curl, Face Pull, Hip Thrust, Incline DB Press, Lateral Raise câble, Rear Delt Fly câble, Triceps Rope Pushdown). Bench Press, Back Squat et Deadlift gardés classiques sur demande explicite malgré un démarrage à froid.
- Aucun WOD, aucun conditioning. Bloc à durée ouverte, aucune fin forcée.
- Enregistré dans `programs/index.js` (phase 0, buffer) mais volontairement absent de `gapFillers` : sélection manuelle seulement.
- Aucun changement à `data/`, `data/charges.js` ou aux programmes protégés existants.

## V51.68 - Route PC visuelle

- Restaure un tableau de bord Route dans l'onglet PC avec cartes Competition, Maintenant, Timeline macrocycle et Prochaine etape.
- Les barres de progression affichent maintenant le pourcentage directement dans la barre.
- La Route PC lit toujours `COACH_BERTIN_MACROCYCLE.mainRoute` et `COACH_BERTIN_PROGRAM_INDEX` depuis `programs/index.js`.

## V51.67 - Lisibilité iPhone modes locaux

- Augmente fortement la taille du texte dans les cartes locales Stéphanie et Arnold.
- Améliore le contraste: fonds moins noirs, textes plus clairs, métadonnées moins sombres.
- Agrandit les boutons, champs, gear et tags pour usage tactile sur iPhone.
- Force les actions bas de séance en une colonne sur petit écran pour éviter les boutons compressés.
- Aucun changement aux données durables ni à `data/charges.js`.

## V51.67 - Arnold Split local experimental

- Ajoute `programs/arnold_split_2026_adapte.js` avec 6 cartes bodybuilding hypertrophie.
- Ajoute `scripts/arnold_mode.js` pour afficher et sauvegarder ce programme en local, séparé de Coach Beurt et de Stéphanie.
- Ajoute le bouton `Arnold Split expérimental` dans les réglages et le support `?profile=arnold`.
- Réutilise le modèle mobile de cartes locales de Stéphanie sans modifier les données durables.
- Ne modifie pas `data/`, `data/charges.js` ni les programmes protégés existants.

## V51.65 - Frein RPE recent non resolu

- Corrige le moteur quand une charge recente a coute RPE 9, puis qu'une seance suivante redescend sans valider plus haut.
- Bulgarian Split Squat ne remonte plus automatiquement a 50 lb si 45 lb RPE 9 reste non resolu malgre un retour a 40 lb.
- La modale jaune de charge lit la charge finale gardee apres frein RPE recent, pas la charge brute du programme.
- Aucun fichier data/, data/charges.js ou programs/ modifie.

## V51.64 - Garde-fous moteur de charges

- Renforce le moteur de charges pour appliquer la suggestion finale apres les garde-fous deload, RPE et historique recent.
- Corrige les diagnostics exportes pour utiliser la suggestion finale de CoachCharge et eviter les fausses alertes sur Dead Bug et les mouvements au poids du corps.
- Ajoute des tests cibles pour deload, bodyweight, frein RPE et apprentissage DB RDL.

## V51.63 - Nettoyage entree Session
- Ajoute `CoachSession.openFrom(source)` comme entree publique pour demarrer la seance guidee.
- WOD+ demarre la seance via `CoachSession.openFrom("wodplus")` sans passer par la vue PC.
- PC demarre la seance via `CoachSession.openFrom("phone")` sans cliquer un autre bouton.
- `app.js` ne porte plus le detail de demarrage de Session.
- Ne modifie pas `data/`, `data/charges.js`, `programs/` ni `scripts/charge/`.

## V51.63 - Nettoyage CoachSummary
- Retire le fallback complet du resume dans scripts/session/results.js.
- CoachSummary devient le seul compositeur complet du resume; Resultats garde la saisie et l affichage.
- Ajuste les checks pour verifier CoachProgress dans CoachSummary, pas dans Resultats.
- Ne modifie pas data/, data/charges.js, programs/ ni scripts/charge/.

## V51.63 - CoachSummary minimal
- Ajoute scripts/summary/index.js comme domaine public window.CoachSummary.
- Deplace la composition du resume automatique de seance derriere une API reutilisable.
- scripts/session/results.js delegue le resume a CoachSummary tout en gardant un fallback compatible.
- Renforce dev/regression_checks.js et dev/structure_checks.js pour verrouiller cette frontiere.
- Ne modifie pas data/, data/charges.js ni programs/.

## V51.62 - CoachUI minimal
- Ajoute scripts/ui/index.js comme domaine public window.CoachUI.
- Garde les helpers UI existants compatibles tout en donnant une frontiere stable a app.js.
- app.js utilise maintenant CoachUI.escapeHtml pour le rendu HTML.
- Renforce dev/regression_checks.js et dev/structure_checks.js pour verrouiller cette frontiere.
- Ne modifie pas data/, data/charges.js ni programs/.

## V51.53 — Cohérence décision charge

## V51.62 - CoachSync minimal
- Ajoute `scripts/sync/` comme domaine public `window.CoachSync`.
- Deplace la lecture/ecriture du token GitHub et du statut de synchronisation hors de `app.js`.
- Ajoute le bouton `Retirer le token` dans les reglages GitHub.
- Renforce `dev/regression_checks.js` et `dev/structure_checks.js` pour verrouiller cette frontiere.
- Ne modifie pas `data/`, `data/charges.js` ni `programs/`.

## V51.62 - CoachState minimal
- Ajoute `scripts/state/` comme domaine public `window.CoachState`.
- Deplace la lecture/ecriture locale de `state` et des charges personnalisees hors de `app.js`.
- Garde le token GitHub dans `app.js` pour ne pas melanger la future extraction `CoachSync`.
- Renforce `dev/regression_checks.js` et `dev/structure_checks.js` pour verrouiller cette frontiere.
- Ne modifie pas `data/`, `data/charges.js` ni `programs/`.

## V51.62 - Macrocycle et garde-fous
- Officialise l'ajout du planificateur macrocycle.
- Rend le check anti-programme Test moins fragile.


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
- Aucun changement de comportement, aucun fichier `data/`, aucun `data/charges.js` et aucun programme d’entraînement modifié.

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
