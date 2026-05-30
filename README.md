# Coach Bertin V39-progression-semaine-unique

Correction de l’affichage des progressions : une seule semaine visible à la fois.

## Ce qui change

- Le choix du programme actif se fait dans l’app, onglet **Cycle / Programme actif**.
- Le choix est sauvegardé localement dans l’iPhone avec `localStorage`, donc pas besoin de modifier GitHub juste pour changer de focus.
- Les focus principaux sont maintenant dans des fichiers simples séparés :
  - `data/programs/epaules_3d.js`
  - `data/programs/crossfit_maintenance.js`
  - `data/programs/posture_cyphose.js`
  - `data/programs/force.js`
- `data/programs/index.js` sert de liste des programmes disponibles.
- Le numéro de version a été uniformisé : **V39-progression-semaine-unique** dans README, index, app, service worker, fichiers de programmes et charges.
- Les charges restent modifiables localement dans l’app, avec `charges.js` comme base globale.

## À modifier plus tard

Pour ajouter un nouveau focus, créer un nouveau fichier dans `data/programs/`, le charger dans `index.html`, puis l’ajouter dans `data/programs/index.js`.

## Important

Cette version ne transforme pas encore tous les entraînements en JSON pur. Elle rend déjà les focus séparés et faciles à changer sans toucher au coeur de l’interface. C’est volontaire : moins risqué que de tout casser d’un coup.
