# Maybe Tomorrow

## Projet

`maybe2morrow` est le nouveau dépôt du jeu de survie **Maybe Tomorrow**. L’objectif est de porter le jeu en React en conservant ses mécaniques et son identité visuelle. Le nouveau dépôt utilise React, Vite et ESLint. Le point d’entrée est `src/main.jsx` et le composant racine est `src/App.jsx`. Le portage part du projet de démarrage Vite en JavaScript et JSX.

L’ancien dépôt est le dossier voisin `../maybetomorrow`. Il sert de référence pour le portage. Le travail sur la version React se fait dans `maybe2morrow`.

| Référence dans l’ancien dépôt | Contenu |
| --- | --- |
| `index.html` | Écran d’accueil, chargement des styles et du script |
| `js/app.js` | Écrans, règles du jeu, gestion du DOM et audio |
| `css/maybetomorrow.css` | Mise en page, styles et animations d’origine |
| `utils/texts.json` | Cinq libellés d’interface. La majorité des textes est encore dans `js/app.js`. |

## Partie d’origine

- Le parcours va de l’accueil à la sélection, puis à la partie. Le joueur choisit exactement quatre personnages parmi Adrien, Clément, Estelle, Islem, Rudy et Zély. Quitter la partie vers la sélection demande une confirmation.
- Chaque personnage démarre avec 5 points de nourriture et 5 points d’eau. Le groupe commence avec 10 unités de chacune des trois provisions (nourriture, eau et soins). Nourrir ou hydrater rend 1 point, jusqu’à 5, et consomme 1 unité du stock correspondant. Un soin consomme 1 unité et guérit un personnage malade.
- À chaque résolution de journée, le jeu tire un événement. Les seuils du tirage donnent 25 % pour une perte d’eau, 25 % pour une perte de nourriture, 20 % pour une maladie et 30 % pour aucun événement. Si des personnages sont éligibles, l’événement touche l’un d’eux au hasard. Une perte vaut de 1 à 3 points. La maladie cible un personnage encore sain.
- Une jauge d’eau ou de nourriture à zéro entraîne la mort du personnage. Une maladie non soignée devient mortelle au troisième décompte, jour de contamination inclus. Les personnages morts et ceux en expédition sont exclus des événements quotidiens. La maladie ne progresse pas pendant une expédition.
- Jusqu’à trois personnages peuvent partir en expédition. Après 6 à 10 jours, chacun revient avec 1 à 3 unités de nourriture, 1 à 3 unités d’eau ou 1 unité de soins. Les trois types de récompense ont la même probabilité.
- La partie est locale et son état vit en mémoire. Le projet d’origine fonctionne dans le navigateur sans service distant ni compte.

## Portage React

- Commencer par un parcours jouable complet avec les illustrations et l’équilibrage d’origine. Utiliser les styles historiques comme référence et adapter les écrans aux petites largeurs.
- Placer les règles de simulation dans un module JavaScript indépendant du DOM et des sons. Un reducer React peut gérer les actions du joueur. L’interface peut dériver les jauges, les portraits et les stocks depuis le même état de partie. Prévoir des tirages contrôlables pour vérifier les journées et les expéditions.
- L’état de navigation peut rester local à l’application. Les écrans sont dans `src/screens/` avec leurs styles CSS Modules. Le catalogue des personnages est dans `src/game/characters.js`.
- L’accueil donne la priorité à son décor WebP et propose une version plus légère sur mobile. Le code et le décor de la sélection sont chargés à l’ouverture de cet écran. Respecter les dimensions des portraits pour réserver leur espace dès l’affichage.
- L’ancien jeu tire un événement dès l’ouverture de la partie. Commencer au jour 1 avant le premier tirage est une amélioration proposée. Autres corrections identifiées pendant l’analyse, conserver tous les événements résolus pendant une journée et appliquer la sourdine à la musique comme aux effets.
- Le comportement de fin de partie reste à définir. L’ancien jeu permet d’avancer après la mort de toute l’équipe, `end.png` est inutilisé et le bouton `QUIT` est présent sans action.

## Ressources du jeu

| Emplacement dans ce dépôt | Contenu |
| --- | --- |
| `public/assets/normal/`, `public/assets/sick/`, `public/assets/death/` | Six portraits dans chacun des trois états |
| `public/assets/set/` | Décors, éléments d’interface et illustration de fin |
| `public/assets/font/` | Police Rubik |
| `public/audio/` | Musique d’ambiance et effets sonores |
| `public/webfonts/` | Police Cutive et polices d’icônes Font Awesome |
| `public/css/all.min.css` | Styles Font Awesome et chemins relatifs vers `../webfonts/` |

Préserver la casse et les accents des noms de fichiers, notamment `clément.png`, `zély.png`, `Health.mp3` et `Speech-bubble.png`. La musique d’ambiance est `ambient-sound.mp3`. `bg.mp3` est une référence obsolète du script d’origine. Vite sert les fichiers de `public/` à la racine de l’application et les copie dans le build.

## Commandes

- `npm install` installe les dépendances.
- `npm run dev` lance le serveur local.
- `npm run lint` vérifie le JavaScript et le JSX.
- `npm run format` applique le formatage Prettier aux fichiers de l’application. `npm run format:check` vérifie le formatage.
- `npm run build` compile l’application pour la production.

Après une modification jouable, vérifier le parcours accueil → sélection de quatre personnages → partie, puis les stocks, l’avancement des jours et le retour de sélection. Pour une modification des règles ou de l’audio, vérifier aussi le cas concerné, par exemple le retour d’expédition ou la sourdine.
