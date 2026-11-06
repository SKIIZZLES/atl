---
name: ig-viral
description: >-
  Trouver les reels qui marchent vraiment en ce moment dans la niche de
  l'utilisateur, les classer selon à quel point chacun a battu son propre
  compte, nommer la formule d'accroche de chacun, et en faire un fichier
  d'inspiration à tourner. À utiliser quand l'utilisateur dit « trouve des
  vidéos virales », « qu'est-ce qui marche en ce moment », « qu'est-ce que
  postent les gens de ma niche », « décortique ce compte », « fais-moi un
  swipe file », « pourquoi ce reel cartonne », ou demande quoi faire ensuite
  sans aucune preuve pour répondre.
---

# ig-viral

Le skill de recherche. Tout le reste du pack écrit ; celui-ci va regarder.
À lancer une fois par mois, pas tous les jours. Les formules durent une
saison.

```bash
python3 .claude/skills/ig-viral/swipe.py collecte.tsv --out .claude/instagram/swipe.md
```

## L'idée qui rend ça utile

**Les vues brutes ne prouvent rien.** Un compte à deux millions d'abonnés qui
fait 400 000 vues a eu un mardi calme. Un compte à quatre mille abonnés qui
fait 400 000 vues a trouvé quelque chose, et ce quelque chose se copie.

Tout se classe donc sur le **multiple** : vues divisées par la médiane
récente du compte. Au-dessus de 3x, c'est un signal. Sous 1,5x, c'est une
journée normale pour ce compte, aussi gros que paraisse le chiffre.

Prends des comptes **à moins de 10x la taille de l'utilisateur**.

## Étape 1 : choisir les comptes

Demande 6 à 12 comptes, ou propose-les et fais valider :

- **4 directs** : même niche, même offre, un peu devant.
- **4 voisins** : autre niche, même audience. C'est là qu'on emprunte des
  formats avant que la niche les ait.
- **2 à 4 démesurés** : bien plus gros, pour le format seulement.

**Spécifique au français :** le marché francophone est plus petit. Si la
niche FR n'a pas assez de comptes, prends des comptes anglophones pour la
**forme** (structure, longueur, montage), jamais pour le texte : une
accroche traduite mot à mot sonne traduite. Note dans le TSV la langue de
chaque compte.

Demande aussi d'ouvrir les **Enregistrements** de l'utilisateur : c'est le
corpus le plus rapide et le plus pertinent, déjà filtré par son goût.

## Étape 2 : aller regarder

Utilise l'outil de navigation que la session a vraiment : navigateur intégré,
extension connectée au Chrome de l'utilisateur, ou outil d'usage de
l'ordinateur.

**Règles non négociables :**

- **Ne te connecte jamais à Instagram à la place de l'utilisateur et ne
  demande jamais de mot de passe.** S'il faut être connecté, c'est
  l'utilisateur qui l'est déjà. Pilote son navigateur avec lui présent, ou
  demande-lui de coller.
- **C'est de la lecture, pas du scraping.** Dix comptes, une douzaine de
  reels chacun, à vitesse humaine. La collecte automatisée en volume viole
  les conditions d'utilisation d'Instagram et fait bloquer les comptes. Pas
  de robot, pas de service de scraping, pas de boucle en arrière-plan.
- **Copie la formule, jamais la vidéo.** La forme de l'accroche, la
  structure, la longueur, le rythme de coupe. Pas leur script, pas leur
  voix, pas leur montage. Attribue chaque ligne au compte d'origine.

**À relever par reel**, dans les mots du créateur :

| champ | notes |
| --- | --- |
| compte | le @ |
| abonnés | depuis le profil |
| médiane | regarde les 12 derniers reels et prends la vue du milieu |
| vues | ce reel |
| accroche | la première phrase, dite ou à l'écran, mot pour mot, fautes comprises |
| écran | le premier carton, s'il diffère |
| durée | en secondes |
| appel | ce qu'ils demandent à la fin |

La médiane est le champ important. Sans elle, on revient au classement par
abonnés, ce que ce skill existe pour arrêter.

**Quand Instagram ne montre pas assez :** la même grammaire d'accroche existe
sur YouTube Shorts, où vues et transcriptions sont publiques, sans connexion.
Si `yt-dlp` est installé :

```bash
python3 -m yt_dlp --flat-playlist --playlist-end 40 -J \
  "https://www.youtube.com/@COMPTE/shorts" > chaine.json
python3 -m yt_dlp --skip-download --write-auto-subs --sub-langs "fr.*" \
  --sub-format json3 -o accroche "https://www.youtube.com/watch?v=ID_VIDEO"
```

Prends chaque mot des sous-titres avec un horodatage sous 3,0 secondes :
c'est l'accroche telle qu'elle est dite.

## Étape 3 : classer

Remplis un fichier séparé par des tabulations avec une ligne d'en-tête (noms
français ou anglais acceptés) et lance le script :

```
compte	abonnés	médiane	vues	accroche
@qqn	48000	11000	412000	personne te dit que tes 30 premiers reels vont flopper
```

Le script calcule le multiple, nomme la formule avec les 26 formules de
`/ig-reel`, note chaque accroche avec `hookscore.py`, et affiche ce qui
sépare le tiers du haut du tiers du bas.

**Limite à dire :** les regex qui nomment les formules en français ont été
écrites à la main et testées seulement sur des exemples fabriqués. Attends-toi
à beaucoup de « non classée ». C'est une raison de lire ces lignes à la main,
pas de croire au classement.

## Étape 4 : dire ce que ça veut dire, prudemment

Trois choses, pas plus :

1. **Les formules surreprésentées** dans le tiers du haut, avec les
   comptes. Deux formules qui apparaissent quatre fois chacune sur six
   comptes, c'est un résultat. Une qui apparaît deux fois, non.
2. **Ce que le tiers du haut a en commun structurellement** et que le bas
   n'a pas : longueur de l'accroche, résultat visuel ou non, mouvement dans
   la 1re image, place de l'appel.
3. **Les non classées.** Chacune est soit du bruit, soit une formule qui
   n'est pas encore dans `hooks.json`. Lis-les à la main.

Puis donne la taille de l'échantillon et la confiance en mots simples.
Quarante reels sur six comptes soutiennent une affirmation. Douze, non.

## Étape 5 : en faire quelque chose à tourner

Pour les trois meilleures formules, écris **la version de l'utilisateur** :
son histoire, son chiffre, dans la forme qui marche. Passe chacune à
`/ig-reel` avec le numéro de formule déjà choisi. Jamais « fais un reel
comme celui-là ». Une phrase d'accroche qu'il pourrait dire demain.

Écris le fichier dans `.claude/instagram/swipe.md`. `/ig-reel` et `/ig-plan`
le lisent.

Rien n'est publié, suivi, aimé ou envoyé par ce skill. Il lit.
