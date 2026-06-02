# Coach Bertin — historique des versions

Ce fichier est volontairement conservé et grandit avec le temps.
Il sert de référence pour comprendre les changements et faciliter un retour en arrière.

## V50.8 — Architecture stable
- Séparation claire entre `programs/` et `data/`.
- `programs/*.js` = plans d'entraînement.
- `data/resultats.json` = journal brut.
- `data/athlete_state.json` = force actuelle estimée, sans XP ni level.
- `data/cycle_state.json` = position dans le cycle.
- `data/charges.js` = charges de base / équipement / préférences.
- Ajout de `ARCHITECTURE_V50.txt`.

## V50.8 — Correctif architecture
- Correction du commentaire contradictoire sur `athlete_state.json`.
- Ajout de `./data/charges.js` au cache du service worker.
- Correction du texte `charges.js` vers `data/charges.js`.
- Rappel de supprimer `data/programs/` si présent.

## V50.8 — Swipe désactivé
- Désactivation des swipes pour changer de semaine/jour.
- Navigation conservée seulement par boutons pour éviter les changements accidentels sur iPhone.

## V50.8 — Nettoyage des notes
- Suppression des anciens fichiers `LIRE_MOI_*`, `NOTE_*`, `SUPPRIMER_*`.
- Remplacement temporaire par une note unique.
## V50.8 — Historique durable
- Remplacement de `VERSION_NOTE.txt` par `VERSION_HISTORY.md`.
- Le fichier d'historique garde toujours le même nom.
- Il grandit avec chaque version au lieu d'être remplacé.
- Objectif : garder une référence claire pour déboguer, comprendre les changements et faciliter un retour en arrière.
