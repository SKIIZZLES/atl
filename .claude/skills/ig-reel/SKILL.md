---
name: ig-reel
description: >-
  Écrire un Reel Instagram en français à partir d'une idée brute : options
  d'accroche tirées de 26 formules, script parlé, texte à l'écran et découpage
  minuté, dans la voix de l'utilisateur et noté avant le tournage. À utiliser
  dès que l'utilisateur veut un Reel, un script de vidéo courte, une accroche,
  une voix off, « fais-moi un reel sur X », « qu'est-ce que je dis dans cette
  vidéo », ou s'apprête à tourner sans avoir sa première phrase.
---

# ig-reel

Transforme une idée brute en un Reel que quelqu'un regarde jusqu'au bout.

Deux outils vivent dans ce dossier et ils tournent vraiment. Utilise-les.
Ne juge pas l'accroche à l'œil et ne devine pas la durée.

```bash
python3 .claude/skills/ig-reel/hookscore.py accroches.txt           # classer tes accroches
python3 .claude/skills/ig-reel/hookscore.py --hook "une phrase"     # en noter une seule
python3 .claude/skills/ig-reel/beats.py script.txt --target 30      # découpage minuté
```

Ce que les notes valent : la version anglaise du noteur sépare bien une
accroche ratée d'une vraie, mais ne prédit pas laquelle de deux bonnes
accroches va marcher. La version française n'a été testée sur aucun corpus
réel. Dis-le à l'utilisateur quand tu montres une note.

## Avant d'écrire

1. Lis `.claude/instagram/voice.md` (sinon `~/.claude/instagram/voice.md`).
   C'est le profil de voix : comment la personne parle face caméra, ce
   qu'elle ne dit jamais, à qui elle parle, **tu ou vous**. S'il n'existe
   pas, demande **trois de ses propres reels**, transcris-les ou lis-les,
   déduis la voix et écris le fichier à partir de
   `.claude/instagram/voice.exemple.md`. Un script dans la mauvaise voix est
   inutilisable, parce qu'il faut le dire à voix haute.
2. Lis `hooks.json` dans ce dossier : 26 formules avec modèle, exemple,
   version écran, usage, et la façon dont elles se ratent.
3. Si l'idée est mince, ne la gonfle pas. Pose une seule question groupée :
   qu'est-ce qui s'est passé, à qui, et combien ça a coûté ou rapporté. Un
   Reel a besoin d'une chose vraie et précise. Obtiens-la avant d'écrire.
4. Si `.claude/instagram/swipe.md` existe, lis-le. `/ig-viral` l'écrit, et
   c'est la preuve de l'utilisateur sur ce qui marche dans sa niche. Elle
   passe avant les valeurs par défaut de ce fichier.

## La forme

Un Reel se décide dans les deux premières secondes et se garde dans les cinq
suivantes.

```
0:00 - 0:02   ACCROCHE    l'affirmation. Phrase parlée et phrase à l'écran,
                          écrites séparément. Du mouvement dans la 1re image.
0:02 - 0:07   L'ENJEU     pourquoi ça compte pour la personne qui regarde.
0:07 - ...    LE CORPS    une idée par plan, et l'image change à chaque plan.
3 DERN. S     LE RÉSULTAT ce que l'accroche a promis, puis l'appel unique.
DERN. LIGNE   LA BOUCLE   reprends un mot de l'accroche pour que le revisionnage
                          s'enchaîne proprement.
```

Durée : 15 à 45 secondes, c'est la zone utile. Sous 7 secondes, seules les
boucles gonflent.

## La boucle de travail

**1. Trois accroches, pas une.** Choisis trois formules qui collent vraiment
à l'idée et écris pour chacune la phrase parlée et la phrase à l'écran. Trois
formules différentes, pas trois réécritures de la même.

**2. Note-les.** Mets les trois phrases parlées dans un fichier, une par
ligne, et lance `hookscore.py`. Montre le classement. Si la première est
sous 50, tu n'as pas encore l'accroche.

**3. Écris le script** sur l'accroche gagnante. Langue parlée, comme la
personne parle vraiment : « t'as », « y'a », négation sans « ne » si c'est
sa voix. Phrases courtes. Aucune phrase qu'il faudrait répéter avant de la
dire.

**4. Minute-le.** `beats.py script.txt --target {durée}`. Corrige chaque
alerte : accroche au-delà de 3 secondes, plan au-delà de 4 secondes, suite
de plans sans rien de concret, pas de boucle. Relance jusqu'à ce que ce soit
propre. Si voice.md donne une vitesse, passe-la avec `--wpm`.

**5. Humanise-le** avec `/ig-human` avant de le montrer.

**6. Affiche le bloc.** Le script dans un bloc de code, le texte à l'écran
en liste séparée avec les timings, puis :

```
REEL PRÊT
accroche :   #3 Personne ne te dit, note 84 FORTE
durée :      28,4 s sur 9 plans à 165 mots/min
écran :      6 cartons
humanizer :  4 artefacts retirés, note humaine 81 OK
légende :    lance /ig-caption ensuite

Réponds « oui » pour l'archiver, ou dis-moi quoi changer.
```

**7. Ne publie jamais.** Ce skill produit un script. L'utilisateur tourne et
publie. Sur « oui », ajoute une ligne à `.claude/instagram/log.md` avec la
date, la formule et la première phrase, pour que `/ig-audit` ait un
historique.

## Le texte à l'écran est un script à part

- **Six mots maximum par carton.** Il est lu à bout de bras par quelqu'un qui
  n'écoute pas encore.
- **Le carton d'accroche est là dès la première image.**
- **Reste dans la zone sûre.** Sur 1080x1920 : rien au-dessus de y=230 ni
  sous y=1440, et garde libres les 230 pixels de droite. L'interface recouvre
  tout le reste.
- **Jamais l'accroche là où se trouve la légende**, en bas de l'image.
- **Sous-titres incrustés** pour le corps. Beaucoup regardent d'abord sans
  le son.

## Règles

- **Une idée par Reel.** Deux idées, c'est deux Reels. Dis-le.
- **Des chiffres plutôt que des adjectifs.** « 4 200 € » bat « beaucoup ».
  S'il manque un chiffre, demande-le au lieu d'écrire autour du trou.
- **Coupe l'intro.** Pas de « salut », pas de « dans cette vidéo », pas de
  nom, pas de jingle.
- **Change d'image à chaque plan.**
- **Un seul appel à la fin.** Commenter un mot-clé, enregistrer, ou s'abonner.
  Un.
- **Ne fabrique jamais rien.** Aucun chiffre, client, revenu ou résultat
  inventé sous le nom de l'utilisateur, même provisoire. Laisse
  `{{ton chiffre}}` et signale-le.
- **Tu ou vous, jamais les deux.** Le choix est dans voice.md.
- **Contenu sponsorisé ou image générée par IA :** si le Reel est une
  collaboration commerciale, ou si des visages, des corps ou des
  personnes sont retouchés ou générés par IA, rappelle à l'utilisateur
  de vérifier les mentions obligatoires (en France : loi du 9 juin 2023 sur
  l'influence commerciale, mentions « Publicité » / « Collaboration
  commerciale » et « Image retouchée » / « Image virtuelle » ; étiquette IA
  d'Instagram). Tu n'es pas juriste : signale, ne tranche pas.

## Exemple

```
/ig-reel on est passés de 5 heures à 20 minutes par devis avec un seul modèle
```

```
ACCROCHES  (notées)
  84  FORTE     #1  L'aveu de coût   « J'ai facturé quatre heures par semaine de mise en page. Pendant deux ans. »
                                     écran : 2 ANS PERDUS
  ..  ...       #5  Le temps écrasé  « Mes devis me prenaient cinq heures. Maintenant, vingt minutes. »
                                     écran : 5 H -> 20 MIN
  ..  ...       #9  Pique-moi ça     « Pique-moi le modèle de devis qui a tout fait. »
                                     écran : PIQUE-MOI ÇA
```

Les notes ci-dessus sont des exemples de format : lance le script pour avoir
les vraies.
