# Coach Bertin V40-mode-entrainement-lisible-timers

Amélioration du mode entraînement iPhone : hiérarchie visuelle plus claire, instructions séparées des mouvements, et timer WOD amélioré.

## Ce qui change

- Le choix du programme actif se fait dans l’app, onglet **Cycle / Programme actif**.
- Le choix est sauvegardé localement dans l’iPhone avec `localStorage`, donc pas besoin de modifier GitHub juste pour changer de focus.
- Les focus principaux sont maintenant dans des fichiers simples séparés :
  - `data/programs/epaules_3d.js`
  - `data/programs/crossfit_maintenance.js`
  - `data/programs/posture_cyphose.js`
  - `data/programs/force.js`
- `data/programs/index.js` sert de liste des programmes disponibles.
- Le numéro de version a été uniformisé : **V40-mode-entrainement-lisible-timers** dans README, index, app, service worker, fichiers de programmes et charges.
- Les charges restent modifiables localement dans l’app, avec `charges.js` comme base globale.
- En mode entraînement, les consignes sont maintenant dans des encadrés distincts et plus petits.
- Les mouvements sont plus gros et isolés dans des cartes lisibles.
- Les lignes Format / Poids / Repos ont une vraie hiérarchie visuelle.
- Le timer WOD a maintenant : état, barre de progression, boutons Start/Pause/Reset et ajustement ±30 secondes.

## À modifier plus tard

Pour ajouter un nouveau focus, créer un nouveau fichier dans `data/programs/`, le charger dans `index.html`, puis l’ajouter dans `data/programs/index.js`.

## Important

Cette version ne transforme pas encore tous les entraînements en JSON pur. Elle rend déjà les focus séparés et faciles à changer sans toucher au coeur de l’interface. C’est volontaire : moins risqué que de tout casser d’un coup.
