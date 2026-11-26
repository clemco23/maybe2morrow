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

## Conception du jeu

Le [document de conception](https://docs.google.com/presentation/d/1dfeAqXzvgGe4sItxO8QvncgVhgg-vzBK/edit?slide=id.p3#slide=id.p3) fixe l’objectif de garder en vie un maximum de personnages jusqu’à la sortie du confinement. Sa date est inconnue du joueur et se situe entre les jours 15 et 55. La perte de toute l’équipe met fin à la partie. Le document prévoit aussi des événements quotidiens, des expéditions risquées, le moral des personnages et Nala en option, en plus des quatre amis.

Le [document d’histoire](https://docs.google.com/document/d/1eydoc4IQ29eDfVErHlYa2cCJmmwg7OXwBNcS4wT8LVc/edit?tab=t.0) décrit une introduction vidéo passable au jour 1, des scénarios quotidiens et des textes de fin selon le nombre de survivants. Ses fréquences d’événements et délais d’expédition diffèrent du prototype. La première version jouable reprend les probabilités du prototype. Elles pourront évoluer avec les scénarios.

## Portage React

- Commencer par un parcours jouable complet avec les illustrations et l’équilibrage d’origine. Utiliser les styles historiques comme référence et adapter les écrans aux petites largeurs.
- `src/game/survival.js` contient la simulation pure, sans dépendance au DOM ni à l’audio. `createGame(team, endRoll)` initialise le jour 1 avec les jauges pleines et tire la date de fin du confinement. `gameReducer` traite les actions `use-provision` et `next-day`. Les tirages sont fournis par l’interface et peuvent être fixés pour vérifier les scénarios.
- `App.jsx` initialise la partie à la validation de l’équipe et gère la navigation accueil → sélection → appartement. `ApartmentScreen.jsx` conserve l’état avec le reducer et affiche, dans l’ordre de sélection, les quatre portraits gérés par `ApartmentCharacter.jsx`. L’équipe est verrouillée dès **Commencer**. Le pictogramme de sortie demande confirmation et ramène à l’accueil.
- Les écrans utilisent des CSS Modules. `src/game/characters.js` contient le catalogue et donne le chemin du portrait sain, malade ou mort. Le composant `MenuDialog` sert aux règles du jeu, aux réglages audio et aux actions sur un personnage.
- Le jeu est accessible en paysage. La vue portrait affiche l’invitation à pivoter et conserve l’écran, la sélection ou l’équipe déjà en cours. Dans l’appartement, l’illustration reste entière et garde ses proportions. Ses bords se fondent dans un décor flouté sur les fenêtres de proportions différentes. Les réglages (roue dentée) et les règles (« ? ») sont regroupés en haut à droite sur deux petits boutons à texture bois. Les réglages audio restent communs à toute l’application. Les quatre portraits sont resserrés sur le parquet, à droite de la table. Leur placement est lié aux dimensions du décor visible. Les noms apparaissent au survol ou au focus clavier. Chacun a une ombre de contact et une ombre projetée dérivée de son PNG.
- L’appartement est chargé à l’ouverture de cet écran avec `background-web.webp` ou `background-web-960.webp`. Les deux variantes WebP dérivent de `background.jpg`. Elles retirent la marge blanche du fichier source et conservent le décor. Le fichier original reste disponible.
- L’accueil affiche son décor WebP en entier, avec le bouton Jouer superposé à la grande planche et les pictogrammes de réglages et de règles en haut à droite. Une version plus légère est proposée sur mobile. Les règles sont partagées entre l’accueil et l’appartement dans `GameRules.jsx`. Le code et le décor de la sélection sont chargés à l’ouverture de cet écran. Respecter les dimensions des portraits pour réserver leur espace dès l’affichage.
- L’appartement affiche le jour, les provisions communes et les jauges individuelles. Le clic sur un portrait permet de nourrir, d’hydrater ou de soigner si l’action est possible. Le premier clic sur **Jour suivant** résout les événements du jour 2. Le journal garde les événements et les actions du jour affiché. La partie s’arrête si toute l’équipe meurt ou si le confinement prend fin. Le journal indique alors le résultat.
- Les expéditions constituent le prochain ajout à la boucle de jeu pour renouveler les stocks. Les événements narratifs, les textes et l’écran de fin, le moral et Nala restent à intégrer.
- Une vidéo d’introduction précède l’accueil à l’ouverture. Le son est activé par défaut. Si le navigateur bloque la lecture automatique, le bouton central permet de lancer la vidéo. Des pictogrammes permettent de couper le son et de passer l’introduction. Le passage en portrait la met en pause. `public/assets/intro-web.mp4` est la version web H.264/AAC de la vidéo originale, conservée dans `public/assets/`.
- Les écrans partagent le mixeur Web Audio dans `src/audio/createAudioMixer.js` et la fenêtre Paramètres. L’ambiance démarre à la première interaction autorisée et reste en boucle pendant la navigation. Les volumes de l’ambiance, des sons des menus et des effets du jeu ainsi que la sourdine globale sont enregistrés localement. Les réglages audio existants reçoivent une valeur par défaut pour les effets du jeu.
- Les menus utilisent `click.mp3` et la sélection joue `wrong.mp3` si le joueur tente d’ajouter un cinquième personnage. Dans l’appartement, `getGameSoundCues.js` déduit les sons des transitions de partie. `day.mp3` annonce le nouveau jour, `sick.mp3` et `dead.mp3` signalent les changements d’état, et `eat.mp3`, `water.mp3` et `Health.mp3` accompagnent les provisions utilisées. Le mixeur charge et garde en cache les effets à la demande. Le son `expeditionReturn` (`backTrip.mp3`) est enregistré dans le mixeur pour le retour des futures expéditions.

## Ressources du jeu

| Emplacement dans ce dépôt | Contenu |
| --- | --- |
| `public/assets/normal/`, `public/assets/sick/`, `public/assets/death/` | Six portraits dans chacun des trois états |
| `public/assets/set/` | Décors, éléments d’interface et illustration de fin |
| `public/assets/font/` | Rubik pour le texte et Londrina Solid Black pour les titres et les boutons principaux |
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

Après une modification, vérifier le parcours accueil → sélection de quatre personnages → appartement, l’ordre des portraits, le verrouillage de l’équipe et le passage portrait → paysage sans perte de progression. Vérifier aussi la fenêtre des règles, la navigation au clavier et l’ouverture des paramètres audio depuis l’appartement. Quand une mécanique de survie est intégrée, vérifier ses effets sur les provisions, les jours et l’état des personnages.
