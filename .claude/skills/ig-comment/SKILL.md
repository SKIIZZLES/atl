---
name: ig-comment
description: >-
  Écrire en français des commentaires sur les posts et reels des autres qui
  sonnent comme une personne avec un avis, pas comme un robot. À utiliser
  quand l'utilisateur colle un post ou un reel et veut un commentaire, dit
  « commente ça », « qu'est-ce que je réponds là », ou veut un lot pour sa
  tournée d'engagement du jour.
---

# ig-comment

Commenter, ce sont les vingt minutes les plus rentables sur Instagram, et
les plus faciles à mal faire. Un commentaire en haut d'un reel à 40 000 vues
est vu par plus de monde que la plupart des posts d'un compte, et c'est le
seul endroit où un inconnu peut taper directement sur un profil.

Un commentaire générique est pire que rien. Il marque le compte comme un
compte de « pod d'engagement » aux yeux de la seule personne dont l'avis
comptait : le créateur.

## Entrée

L'utilisateur colle le texte du post ou du reel, ou une capture, avec le nom
du compte. Si tu ne peux pas ouvrir une URL, demande de coller. Ne parcours
pas le fil avec un outil de navigation et ne publie rien.

## Les neuf types de commentaires

Choisis selon ce qu'est vraiment le post. Jamais le type 1 par défaut.

| # | type | quand | forme |
| --- | --- | --- | --- |
| 1 | **Ajouter une donnée** | le post affirme quelque chose que tu peux appuyer d'un chiffre | « Pareil chez nous : 40 % de... » |
| 2 | **Ajouter le cas manquant** | le post a raison mais il manque un cas | « Vrai, sauf quand {condition}. » |
| 3 | **Désaccord respectueux** | tu penses vraiment que c'est faux | d'abord l'accord, puis la bifurcation |
| 4 | **Prolonger une ligne** | une ligne du post est la bonne | cite-la, construis dessus |
| 5 | **Poser la vraie question** | le post a sauté la partie difficile | une question, précise |
| 6 | **Le vécu** | tu as fait ce qu'ils décrivent | ce qui s'est passé, deux phrases |
| 7 | **La correction** | il y a une erreur factuelle | sois juste, bref, gentil et sûr |
| 8 | **Le recadrage** | bons faits, mauvais cadre | « Une autre façon de le lire : » |
| 9 | **La phrase courte** | le post n'a besoin de rien, tu veux être présent | moins de 10 mots, drôle ou vrai |

## Règles

- **Une à trois phrases.** Un paragraphe se replie derrière « plus » et
  personne ne tape dessus.
- **Ne commence jamais par** « Super post », « J'adore », « Trop vrai »,
  « Tellement ça 👏 », « J'avais besoin de lire ça », ou le prénom du créateur
  suivi d'un point d'exclamation. Tous invisibles.
- **Tu ou vous :** sur Instagram en France, on tutoie en général les
  créateurs qui tutoient leur audience. Si le créateur vouvoie, vouvoie.
  Dans le doute, suis la voix de l'utilisateur dans voice.md.
- **Pas de commentaire en emoji seuls** et pas d'emoji en premier caractère.
- **Ne résume jamais le reel.** Tout le monde vient de le regarder.
- **Une seule idée.**
- **Dis la chose précise.** Si le commentaire pourrait aller sous n'importe
  quel post du même sujet, c'est du bruit.
- **Jamais de vente.** Ni l'offre, ni le lien, ni « passe voir mon profil ».
- **Tôt, ça compte.** Un commentaire dans la première heure d'un reel qui
  décolle est porté avec lui.

## Sortie

Donne **deux options de types différents**, étiquetées, plus une ligne sur
celle que tu publierais et pourquoi. Passe les deux dans `/ig-human` d'abord.

```
OPTIONS DE COMMENTAIRE  (sur le reel de @compte sur les tarifs)

[6 · Vécu]
On a augmenté de 40 % en mars dernier et on a perdu exactement un client,
celui qui occupait la moitié de la boîte mail. Il m'a fallu huit mois pour
arrêter d'en avoir peur.

[3 · Désaccord respectueux]
D'accord sur l'ancrage. Là où je suis moins d'accord, c'est le faire en
cours de projet. On a essayé, ça nous a coûté un renouvellement qui allait
très bien.

Publie le premier. Il concède quelque chose et il a un chiffre.
```

## Mode lot

Pour une tournée, demande les 5 à 10 posts collés en un seul message, rends
un commentaire chacun dans un seul bloc, et tiens une note dans
`.claude/instagram/log.md` des comptes commentés cette semaine. Commenter les
trois mêmes comptes tous les jours se voit.

## Jamais

Pas de publication automatique, pas d'automatisation des commentaires, pas
d'outil de navigation pour publier à la place de l'utilisateur.
L'engagement automatisé viole les conditions d'utilisation d'Instagram et
fait bloquer les comptes. Ce skill écrit. L'utilisateur publie.
