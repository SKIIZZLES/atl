---
name: ig-human
description: >-
  Retirer l'empreinte machine d'un brouillon en français - tirets cadratins,
  vocabulaire d'IA, caractères invisibles - en respectant la typographie
  française, puis le noter sur cinq vérifications avant publication. À
  utiliser dès qu'un texte doit sonner humain, quand l'utilisateur dit
  « humanise », « ça fait IA ? », « ça sonne ChatGPT », « enlève les tirets »,
  ou avant de montrer une légende, un script, un commentaire, une réponse ou
  un DM.
---

# ig-human

Deux outils vivent dans ce dossier et ils tournent vraiment. Utilise-les.

```bash
python3 .claude/skills/ig-human/humanize.py brouillon.txt -o propre.txt --report
python3 .claude/skills/ig-human/detect.py brouillon.txt
python3 .claude/skills/ig-human/detect.py brouillon.txt propre.txt     # avant / après
```

Les deux lisent `slop.json` : environ 200 mots et expressions toutes faites
en français, les caractères invisibles, les substitutions typographiques et
18 tics de structure (plus deux vérifiés dans le code : tu et vous mélangés,
phrases de longueur uniforme). Le dernier bloc de chaque liste est propre à Instagram.
Le fichier est fait pour être modifié : si l'utilisateur emploie vraiment un
mot que le lexique retire, enlève-le du fichier.

## Ce qui change par rapport à la version anglaise

- **La typographie française est respectée.** Les espaces insécables avant
  `; : ! ?` et `»`, après `«`, avant `%` et `€`, et entre les milliers sont
  gardées. Seules celles mal placées sont retirées. `--espaces ajouter` les
  insère là où la typographie française les veut ; `--espaces supprimer` les
  retire toutes (comportement de la version anglaise).
- **Ne sont pas touchés :** l'apostrophe `’`, les points de suspension `…`
  (un iPhone en français les produit tout seul) et le point médian `·` de
  l'écriture inclusive.
- **Les guillemets anglais “ ”** deviennent des guillemets français « ».
- **Remplacements prudents.** Le français accorde et conjugue : quand
  remplacer un mot casserait l'accord (« révolutionnaire », « booster »,
  « synergie »), le mot est **signalé à reformuler**, pas remplacé. Relis
  aussi les remplacements d'adjectifs : « une méthode innovante » devient
  « une méthode nouvelle », correct mais pas toujours naturel.
- **Tutoiement et vouvoiement mélangés** sont signalés.

## Ce qui est corrigé automatiquement

1. **Caractères invisibles :** espaces sans chasse, liants, gluons, traits
   d'union conditionnels, BOM, caractères étiquettes Unicode.
2. **Typographie :** tiret cadratin vers virgule (tiret simple en début de
   ligne), tiret demi-cadratin vers trait d'union, guillemets anglais vers
   français, puce vers tiret.
3. **Le lexique :** « il est important de noter que », « dans un monde en
   constante évolution », « crucial », « véritable », « game changer »,
   « en effet », « afin de », plus le bloc Instagram : « arrête de
   scroller », « abonne-toi pour plus de contenu », « dis-moi en
   commentaire », « l'algorithme adore ».

## Ce qui n'est PAS corrigé automatiquement

Signalé, pas réécrit, parce que changer la forme d'une phrase demande du
jugement :

- « Ce n'est pas juste X, c'est Y », « Non seulement X, mais aussi Y »
- « Ce n'est pas une question de X. C'est une question de Y. »
- Les triades, les lignes « Le résultat ? »
- Le préambule vidéo, les puces en emoji, trois mots en majuscules d'affilée
- Les murs de hashtags, les appâts réflexes (« identifie quelqu'un qui »)
- « N'hésitez pas à », « Que vous soyez X ou Y »
- Les mots « à reformuler » de la section 3b du rapport

C'est ton travail. Réécris chaque ligne signalée à la main en gardant le
sens, puis relance `detect.py`.

## Les cinq vérifications

| vérif | ce qu'elle mesure | la machine ressemble à |
| --- | --- | --- |
| RYTHME | variation de longueur des phrases | toutes les phrases de même longueur |
| CONCRET | chiffres, noms, nombres dits en toutes lettres pour 100 mots | des noms abstraits, aucun chiffre |
| SLOP | termes du lexique pour 100 mots | du vocabulaire tout fait |
| EMPREINTE | invisibles, tirets cadratins, guillemets anglais, insécables mal placées | une typographie trop parfaite |
| VOIX | registre parlé (« t'as », « y'a », négation sans « ne », « ça »), pronoms, tics | aucune marque d'oral, révélations mises en scène |

Le verdict pèse la moyenne à 60 % et **la vérification la plus faible** à
40 %. OK demande 70+ sans aucune vérification sous 55.

**Limite à dire :** VOIX récompense le registre familier. Un compte qui
vouvoie ou écrit soutenu volontairement aura une note VOIX plus basse ; ce
n'est pas un défaut, c'est un choix. Les seuils viennent de la version
anglaise et n'ont pas été recalibrés en français.

## À dire honnêtement

Ce sont cinq heuristiques locales. Elles tournent sur la machine de
l'utilisateur et rien n'est envoyé. Ce ne sont **pas** GPTZero, Originality,
Copyleaks, Compilatio ou Lucide, elles n'appellent pas leurs API et ne
promettent pas leur verdict. Ne dis jamais à l'utilisateur que son texte est
« indétectable ».

## Ordre des opérations

1. `humanize.py brouillon.txt -o propre.txt --report`
2. Lis les signalements (3b et 5). Réécris ces lignes toi-même.
3. `detect.py brouillon.txt propre.txt` pour montrer l'avant / après.
4. Si le verdict n'est pas OK, corrige la vérification la plus faible et
   recommence. Deux tours, c'est normal. Cinq, ça veut dire que le
   brouillon a été écrit par formule : il faut un autre brouillon.
5. Montre le texte nettoyé et la note. Jamais la note seule.
