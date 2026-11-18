# Les Cendres d'Aldaran

Roguelike dark fantasy au tour par tour, jouable directement dans le navigateur.
Pixel art, musique et effets sonores entièrement générés en code : aucune image, aucun fichier audio.

**MEO STUDIO**

## Jouer

- En ligne : activer GitHub Pages (Settings → Pages → Branch `main` / `root`), puis ouvrir `https://onwayy.github.io/cendres-aldaran/`
- En local : servir le dossier (`python3 -m http.server`) puis ouvrir `http://localhost:8000`. Ouvrir `index.html` directement fonctionne aussi.

## Contenu

- 3 classes : Chevalier, Rôdeuse, Occultiste, avec 6 compétences chacune (3 rangs)
- 5 actes, 20 étages générés procéduralement, 5 boss avec attaques télégraphiées (+ un combat optionnel)
- Équipement sur 6 emplacements, 5 raretés, affixes aléatoires, 10 légendaires
- Marchand, forge (+1 à +5), sanctuaires, fontaines, pièges
- Une histoire complète : dialogues, choix, 20 fragments de lore, 3 fins
- Modes Histoire (on se relève) et Hardcore (une seule vie)
- Sauvegarde automatique (localStorage)

## Commandes

| Touche | Action |
|---|---|
| ZQSD / WASD / flèches / pavé num. | Se déplacer, attaquer |
| Clic | Marcher / attaquer / tirer |
| 1–6 | Compétences |
| F | Tir à distance (arc, bâton) |
| V / B | Potion de soin / de mana |
| E / Entrée | Descendre |
| X | Exploration automatique |
| R | Se reposer |
| I / K / J | Sac / Compétences / Journal |
| H / Échap | Aide / Menu |

## Structure

```
index.html
css/style.css
js/sprites.js   pixel art + textures procédurales
js/data.js      biomes, classes, compétences, objets, monstres, boss
js/story.js     dialogues, lore, fins
js/dungeon.js   génération, champ de vision, A*
js/game.js      règles, combat, tours, IA
js/render.js    rendu canvas, lumière, effets
js/ui.js        écrans, panneaux, dialogues, entrées
js/audio.js     sons synthétisés (WebAudio)
```
