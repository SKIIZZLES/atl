---
name: ig-profile
description: >-
  Noter un profil Instagram sur 100 avec une grille en 12 points et réécrire
  en français ce qui perd des points - champ nom, bio, lien, à la une, trois
  posts épinglés, grille. À utiliser quand l'utilisateur dit « optimise mon
  profil », « corrige ma bio », « note mon Instagram », « pourquoi les gens ne
  s'abonnent pas », ou colle son profil et demande ce que ça donne.
---

# ig-profile

Presque tout le monde optimise la mauvaise chose ici. Le profil n'est pas
une vitrine qu'on parcourt. C'est **un écran de décision**, atteint depuis un
seul reel, qui a environ trois secondes pour répondre à une question : y
a-t-il plus de ça ici, et est-ce pour moi.

## Entrée

Demande de coller ou de faire une capture : le champ nom, le @, la bio, la
destination du lien, les noms des stories à la une, ce qui est épinglé, et
les neuf premières couvertures de la grille. Une capture du haut du profil
plus les deux premières lignes de la grille suffit pour un premier passage.

Ne te connecte pas à Instagram à la place de l'utilisateur.

## Noter

Lis `rubric.json` dans ce dossier. Douze points, 100 au total, chacun avec ce
que vaut la note maximale et comment il rate d'habitude. Note chaque point,
montre le tableau, donne le total. Sois honnête : la plupart des profils
font 30 à 40 au premier passage, et une note généreuse ne sert à rien.

```
NOTE DU PROFIL  38/100

  champ nom          2/12   un prénom seul, aucun mot que quelqu'un cherche
  bio ligne 1        3/12   trois noms et un emoji café
  trois épinglés     0/10   rien d'épinglé
  à la une           2/8    « Random », « Vie », « 2023 »
  grille lisible     4/8    six couvertures sur neuf sont un visage en pleine phrase
  ...
```

## Puis réécrire, dans cet ordre

Corrige par ordre de points perdus. Ne réécris pas tout d'un coup :
l'utilisateur doit aller changer chaque champ lui-même.

**1. Le champ nom (30 caractères).** La ligne en gras sous la photo, pas le
@. C'est le champ que la recherche Instagram compare, et la plupart des
comptes n'y mettent qu'un nom. Format qui marche :
`{Nom} | {ce que tu fais, en mots cherchés}`. 30 caractères, c'est court en
français : préfère les mots courts et sans article (« Devis freelance »
plutôt que « Des modèles de devis pour freelances »). Donne trois options.

**2. Bio, ligne 1.** Pour qui c'est et ce qui change pour eux. Pas un titre,
pas des adjectifs, pas une liste séparée par des barres. Le reste des 150
caractères porte une preuve ou une offre claire.

**3. Les trois épinglés.** Trois places, trois rôles : la meilleure preuve,
l'explication la plus claire de l'offre, la meilleure présentation de la
personne. C'est la correction la plus rentable du profil et elle prend quatre
taps.

**4. Les stories à la une.** Quatre à six, nommées d'après les questions
qu'un acheteur pose : Tarifs, Résultats, Comment ça marche, À propos. Pas
« Random ». Supprime le reste. Les noms longs sont coupés à l'affichage :
« Tarifs » passe, « Témoignages clients » non. Vérifie dans l'app.

**5. Le lien.** Une destination qui correspond à ce que la bio vient de
promettre. Cinq sont permis ; deux, c'est déjà un menu.

**6. Les couvertures de la grille.** Les neuf premières en vignette. Les
couvertures de reels se choisissent. Quatre mots de texte sur une couverture
rendent une grille lisible d'un coup d'œil.

## Sortie

Tableau de notes, puis les réécritures en blocs prêts à copier, par ordre de
priorité, chacune passée dans `/ig-human`. Renote à la fin et montre la
différence honnêtement : si la réécriture atteint 84 et pas 98, dis 84, et
dis ce qu'il manque (en général une grille, une habitude de stories et un
post épinglé qui n'existe pas encore).

Rien n'est modifié sur Instagram par ce skill. L'utilisateur modifie chaque
champ.
