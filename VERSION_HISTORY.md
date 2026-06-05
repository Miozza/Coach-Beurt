# V50.19 — TMS outils séparés

- Ajout d’un bouton TMS en mode iPhone.
- Ajout de deux séances libres indépendantes : TMS complet et Routine matin/soir.
- TMS est dans `tools/tms_session.js`, pas dans `programs/`, pour ne pas interférer avec les cycles ni Builder.
- Aucun impact sur `cycle_state`, `athlete_state`, `resultats` ou la progression du cycle actif.

# Coach Bertin — historique des versions

## V50.18 — Écran actif automatique en mode séance
- Le mode séance active automatiquement le maintien de l’écran au démarrage.
- En quittant le mode séance, l’écran actif est relâché si l’app l’avait activé automatiquement.
- Si l’écran actif était déjà activé manuellement avant la séance, il reste actif en quittant.
- Reprise automatique du Wake Lock quand l’app revient au premier plan, tant qu’il est demandé.

## V50.17 — Épaules 3D + règles globales de programmation
- Épaules 3D : lundi réordonné en Strict Press principal, tampon scapulaire, puis Incline DB Press allégé.
- Incline DB Press n’est plus Principal dans la même séance que Strict Press; il devient Hypertrophie.
- Charges de l’Incline DB Press réduites quand le Strict Press est prioritaire.
- Garde-fou global d’affichage : si une séance contient plusieurs blocs `main`, seul le premier affiche Principal; les suivants deviennent Secondaire.
- Ajout des rôles d’affichage Secondaire, Hypertrophie, Technique et Core.
- Correction de l’intention : éviter deux press lourds consécutifs sans bloc tirage/scapulaire entre les deux.

## V50.16 — Séparation propre Coach Beurt / Racine
- Coach Beurt demeure l’app principale stable d’entraînement.
- Aucun Builder/Racine n’est intégré dans cette version.
- Préparation conceptuelle pour un futur pont d’import/export, sans dépendance au laboratoire Racine.
- Cache PWA séparé de V50.15 pour forcer une mise à jour propre.

Ce fichier est volontairement conservé et grandit avec le temps.
Il sert de référence pour comprendre les changements et faciliter un retour en arrière.

## V50.16 — Architecture stable
- Séparation claire entre `programs/` et `data/`.
- `programs/*.js` = plans d'entraînement.
- `data/resultats.json` = journal brut.
- `data/athlete_state.json` = force actuelle estimée, sans XP ni level.
- `data/cycle_state.json` = position dans le cycle.
- `data/charges.js` = charges de base / équipement / préférences.
- Ajout de `ARCHITECTURE_V50.txt`.

## V50.16 — Correctif architecture
- Correction du commentaire contradictoire sur `athlete_state.json`.
- Ajout de `./data/charges.js` au cache du service worker.
- Correction du texte `charges.js` vers `data/charges.js`.
- Rappel de supprimer `data/programs/` si présent.

## V50.16 — Swipe désactivé
- Désactivation des swipes pour changer de semaine/jour.
- Navigation conservée seulement par boutons pour éviter les changements accidentels sur iPhone.

## V50.16 — Nettoyage des notes
- Suppression des anciens fichiers `LIRE_MOI_*`, `NOTE_*`, `SUPPRIMER_*`.
- Remplacement temporaire par une note unique.
## V50.16 — Historique durable
- Remplacement de `VERSION_NOTE.txt` par `VERSION_HISTORY.md`.
- Le fichier d'historique garde toujours le même nom.
- Il grandit avec chaque version au lieu d'être remplacé.
- Objectif : garder une référence claire pour déboguer, comprendre les changements et faciliter un retour en arrière.
