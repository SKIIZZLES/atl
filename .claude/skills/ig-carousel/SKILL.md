---
name: ig-carousel
description: >-
  Construire un carrousel Instagram en français - la couverture qui donne
  envie de faire défiler, le texte slide par slide, et les fichiers 1080x1350
  à publier. À utiliser quand l'utilisateur dit « carrousel », « slides »,
  « post à faire défiler », « transforme ça en carrousel », ou a une idée en
  liste ou en étapes qui mourrait en image seule.
---

# ig-carousel

Les carrousels sont le format au plus long temps passé sur la grille, parce
que faire défiler est une interaction. Ils ont aussi une deuxième chance :
Instagram peut remontrer un carrousel à partir d'une slide plus loin à
quelqu'un qui n'a pas interagi la première fois, donc la slide 2 doit tenir
toute seule.

Le format récompense une idée découpée en étapes. Il punit une légende
coupée en morceaux.

## Quand l'utiliser plutôt qu'un Reel

Un carrousel quand l'idée a **un ordre et doit être relue** : étapes,
méthode en plusieurs parties, avant / après, liste à capturer. Un Reel quand
l'idée a du mouvement, un visage, ou un résultat qu'il faut voir arriver.

Si l'idée est une seule affirmation, ce n'est ni l'un ni l'autre : passe-la
à `/ig-reel` et dis-le.

## Structure

6 à 10 slides. Le maximum est 20 et 20 c'est un livre que personne ne finit.

```
1         COUVERTURE  l'accroche. 6 mots maximum, lisible en vignette dans
                      la grille. Une ligne de promesse en dessous.
2         L'ENJEU     pourquoi ça compte, en une phrase. C'est aussi une
                      deuxième couverture : pas de mise en place.
3 à N     UNE IDÉE PAR SLIDE. Un titre de 3 à 7 mots, 25 mots maximum
                      en dessous. Si ça demande un paragraphe, c'est deux slides.
N+1       RÉCAP       tout le contenu en liste. La slide qu'on capture.
DERNIÈRE  APPEL       une action. Enregistrer, commenter un mot-clé, ou
                      s'abonner. Une.
```

## Règles de texte

- **La couverture fait 80 % du résultat.** Six mots. Gros.
- **Le français est plus long que l'anglais** (environ 15 à 20 % de plus en
  moyenne). Compte les mots, pas l'impression : si le titre déborde, coupe
  des mots, ne réduis pas la police.
- **Pense au recadrage de la grille.** Construis en 1080x1350 et garde le
  texte de couverture bien au centre, loin des 120 pixels de chaque bord.
- **Numérote les slides** (3/8).
- **Aucune slide n'est un paragraphe.**
- **La slide récap est celle qu'on capture et qu'on envoie.** Rends-la
  lisible sans contexte.
- **Le @ sur chaque slide**, petit, dans un coin. Les captures voyagent sans
  toi.
- **Texte alternatif sur la couverture au minimum.**
- **Typographie :** espaces insécables avant `: ; ! ?` dans les fichiers
  rendus (en HTML, `&nbsp;` ou l'espace fine `&#8239;`), sinon le point
  d'exclamation finit seul en début de ligne sur une slide.

## Construire les fichiers

Instagram veut du 1080x1350 (4:5), JPEG ou PNG, jusqu'à 20 éléments.
Construis en HTML et exporte chaque slide :

```bash
# une <section> par slide, 1080x1350, page-break-after: always
# puis Chrome headless --print-to-pdf, ou l'outil HTML vers image que tu as déjà
```

`width:1080px; height:1350px`, une seule couleur d'accent, aucune police
sous 32px. Si le projet a une charte ou un design system, utilise-le et
n'invente pas de palette.

**Visuels générés par IA :** si des personnes ou des corps sur les slides
sont générés ou retouchés par IA, rappelle de vérifier les mentions
obligatoires (étiquette IA d'Instagram ; en France, loi du 9 juin 2023 pour
l'influence commerciale). Signale, ne tranche pas.

## Sortie

Le texte slide par slide d'abord, en liste numérotée que l'utilisateur lit
en dix secondes et corrige avant tout rendu. Puis la **légende**, qui pour un
carrousel est le rôle B de `/ig-caption`.

Passe les deux dans `/ig-human`. Ne construis les fichiers qu'après
validation du texte.

```
CARROUSEL  ·  8 slides

1  COUVERTURE  LA CLAUSE À 18 000 €
               La ligne que je mets maintenant dans chaque contrat.
2  ENJEU       J'avais validé le travail. Neuf jours après, il voulait être remboursé.
3              CE QU'ELLE DIT
               Paiement à la livraison, pas à la validation.
...
7  RÉCAP       Les quatre lignes, dans l'ordre.
8  APPEL       Écris CONTRAT en commentaire et je t'envoie la clause.

Légende : rôle B, accroche en ligne 1, un appel, 3 hashtags.
```

Rien n'est publié. L'utilisateur publie.
