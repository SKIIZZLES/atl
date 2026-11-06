---
name: ig-repurpose
description: >-
  Transformer un contenu long - vidéo YouTube, podcast, live, newsletter,
  article ou appel client - en une semaine de reels et de carrousels en
  français. À utiliser quand l'utilisateur dit « recycle ça », « transforme ça
  en reels », « j'ai une vidéo / un podcast / une transcription », « découpe
  ça », ou colle quelque chose de long et veut le mettre sur Instagram.
---

# ig-repurpose

Un bon contenu long contient quatre à six posts. La plupart des gens en
tirent un et jettent le reste.

## Entrée

Une transcription, un article, une newsletter, un script, un compte rendu
d'appel, un live. Si l'utilisateur donne une URL et que la session a un outil
de transcription, utilise-le ; sinon demande de coller. Lis tout avant
d'extraire quoi que ce soit.

Si la source est une vidéo de l'utilisateur, demande aussi le fichier. Un
Reel construit sur ses propres images bat un Reel où il relit ses propres
mots.

**Source en anglais ?** N'en fais pas une traduction. Reprends les idées et
les chiffres, puis écris dans la voix française de l'utilisateur avec
`/ig-reel`. Une accroche traduite mot à mot sonne traduite.

## Extraire, pas résumer

Un résumé de vidéo n'est pas un Reel. Va chercher ce qui tient tout seul :

| extrait | ce que c'est |
| --- | --- |
| **Affirmations** | chaque phrase qui lancerait un débat |
| **Chiffres** | chaque montant, durée, pourcentage |
| **Histoires** | chaque moment avec une personne, une scène et un coût |
| **Mécanismes** | chaque « en fait, ça marche comme ça » |
| **Erreurs** | chaque aveu de quelque chose qui a mal tourné |
| **Phrases** | chaque phrase déjà citable telle quelle |

Liste ce que tu as trouvé, avec les comptes, avant d'écrire. Si la source
donne moins de quatre éléments, elle est mince, et quatre posts tirés d'elle
le seront aussi. Dis-le.

## Puis choisir le format par extrait

- **Affirmation, erreur, histoire** : un Reel. Il faut une voix et un visage.
- **Mécanisme, liste** : un carrousel. Il faut pouvoir relire.
- **Une phrase citable** : une story, pas un post.

## Puis construire la semaine

Chaque extrait devient un post qui tient complètement seul. Le spectateur
n'a pas vu la source. N'écris jamais « comme je disais dans ma dernière
vidéo ».

Donne une formule d'accroche de `ig-reel/hooks.json` à chacun et varie-les.
Cinq posts tirés d'une source avec la même forme d'accroche, ça fait usine à
contenu.

Si la source est une vidéo de l'utilisateur, **utilise les vraies images**.
Coupe sur la phrase, pas sur la respiration.

Ordre : l'affirmation la plus forte d'abord, l'histoire en milieu de semaine,
le mécanisme en dernier.

## Sortie

```
SOURCE : « Pourquoi on a arrêté les appels découverte » (podcast 42 min, 8 900 mots)

TROUVÉ  5 affirmations, 9 chiffres, 3 histoires, 4 mécanismes, 2 erreurs, 7 phrases citables

SEMAINE
MAR  REEL       #2  L'ordre négatif   Arrête les appels découverte
                                      utilise l'extrait à 14:20, il rit à la fin
MER  CARROUSEL  légende rôle B        Le formulaire en 4 questions qui a remplacé l'appel
VEN  REEL       #21 Au milieu         « ...et neuf jours après, il voulait être remboursé »
DIM  REEL       #5  Le temps écrasé   Six heures par semaine récupérées, un lien supprimé

Dis « écris mardi » et je le rédige.
```

Puis rédige à la demande, un à la fois, chacun via `/ig-reel` et `/ig-human`.
Ne livre pas quatre scripts finis d'un coup : ils sonneront tous pareil et
l'utilisateur n'en tournera aucun.
