---
name: ig-audit
description: >-
  Bilan de ce que l'utilisateur a déjà publié - quels reels ont vraiment
  marché, pourquoi, et quoi arrêter de faire. À utiliser quand l'utilisateur
  colle ses statistiques Instagram ou ses anciens posts et demande « qu'est-ce
  qui marche », « pourquoi ce reel a fait un bide », « lis mes stats »,
  « audite mon contenu », ou veut savoir quoi faire plus.
---

# ig-audit

La seule source honnête de ce qui marche pour un compte, c'est ce compte.
Chaque règle de chaque guide Instagram, y compris celles de ce pack, est une
hypothèse. Les 30 derniers posts de l'utilisateur sont la preuve.

## Entrée

Demande ce que l'utilisateur a :

- Les statistiques par post : vues, comptes touchés, interactions, durée de
  visionnage, enregistrements, partages, abonnements, et la part de comptes
  touchés qui ne le suivent pas. Les captures sont acceptées.
- Ou la courbe de rétention de ses meilleurs et pires reels récents. Cette
  capture vaut plus que tout le reste réuni.
- Ou juste les posts et leurs vues, ce qui suffit pour un premier passage.

Lis aussi `.claude/instagram/log.md` s'il existe : il dit quelle formule
chaque post a utilisée.

Les libellés de l'app en français changent selon les versions (« Comptes
touchés », « Vues », « Partages »...). Fais correspondre au tableau ci-dessous
et demande si un libellé est ambigu.

## Ce qu'il faut vraiment mesurer

Les vues brutes sont le chiffre le moins utile : elles dépendent surtout du
nombre de gens qui suivent déjà. Calcule plutôt, et montre le calcul :

| mesure | calcul | ce qu'elle dit |
| --- | --- | --- |
| **Multiple** | vues / médiane des vues du compte | vrai succès ou journée normale |
| **Portée hors abonnés** | % des comptes touchés qui ne suivent pas | si ça a voyagé |
| **Rétention à 3 s** | spectateurs encore là à 3 s / spectateurs au départ | si l'accroche a marché. C'est sa note. |
| **Durée moyenne** | directement dans les stats | si le milieu a marché |
| **Partages par compte touché** | partages / comptes touchés | le signal le plus fort. Un partage, c'est quelqu'un qui engage son nom. |
| **Abonnements par compte touché** | abonnements / comptes touchés | si le profil a converti l'attention |

Classe par multiple et par partages par compte touché, pas par vues.

## Puis trouver le motif

Avec les cinq meilleurs et les cinq pires côte à côte, cherche ce qui les
sépare, et accepte une conclusion que l'utilisateur n'aimera pas :

- **Rétention à 3 secondes.** Si le haut et le bas diffèrent ici, c'est
  l'accroche et rien d'autre.
- **Formule d'accroche.** Quels numéros de `ig-reel/hooks.json` sont dans
  le top 5 ?
- **Format.** Reel, carrousel, image.
- **Durée.** Moins de 15 s, 15 à 30 s, 30 à 60 s, plus de 60 s.
- **Thème.**
- **Si l'utilisateur a répondu aux commentaires dans la première heure.**
- **Jour et heure.** **En dernier**, et seulement si le reste ne montre rien.

Formule chaque résultat comme une affirmation avec sa preuve, et dis le
niveau de confiance. Avec 30 posts on voit un motif. Avec 6, non, et le dire
vaut mieux qu'en inventer un.

## La distinction qui fait gagner des mois

**Un reel qui fait des vues et zéro abonnement n'est pas un reel raté, c'est
un problème de profil.** Un reel qui ne fait pas de vues est un problème
d'accroche. Sépare les deux avant toute recommandation. Si la portée hors
abonnés est haute et les abonnements par compte touché bas, arrête de
réécrire les accroches et passe à `/ig-profile`.

## Sortie

```
AUDIT  ·  31 posts  ·  12 juin - 5 sept.  ·  médiane 4 100 vues

TOP 5 PAR MULTIPLE
  18,2x  #3  Personne ne te dit   74 600 vues  62 % hors abonnés  réten. 3 s 71 %  128 partages
   6,4x  #1  L'aveu de coût       26 300 vues  48 % hors abonnés  réten. 3 s 64 %   71 partages
  ...

BAS 5
   0,3x  #11 La liste              1 200 vues   9 % hors abonnés  réten. 3 s 31 %    2 partages
  ...

CE QUE DISENT LES DONNÉES
1. La rétention à 3 secondes explique tout. Top 5 : 66 % en moyenne, bas 5 : 33 %.
2. Les posts où c'est toi qui as l'air bête : 8,1x en moyenne contre 0,9x pour le
   reste. n=5. Le signal le plus fort ici.
3. Les listes d'outils font des vues et rien d'autre. Trois de tes cinq pires.
4. Le jour de la semaine ne montre rien. Arrête de l'optimiser.

ARRÊTER : les listes.
FAIRE PLUS : les posts avec un coût que tu as payé et un chiffre.
```

Puis passe les conclusions à `/ig-plan` pour que la semaine suivante repose
sur les preuves de l'utilisateur, et à `/ig-viral` pour filtrer le swipe file
sur les formules qui marchent pour ce compte.
