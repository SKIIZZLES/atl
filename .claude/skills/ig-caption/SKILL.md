---
name: ig-caption
description: >-
  Écrire la légende Instagram en français - la ligne qui survit à la coupure
  « ... plus », le corps, l'appel unique, les termes de recherche et les
  hashtags - et la vérifier avant publication. À utiliser quand l'utilisateur
  dit « écris la légende », « la description », « quoi mettre sous le post »,
  a un reel ou un carrousel prêt et a besoin du texte, ou pose une question
  sur les hashtags.
---

# ig-caption

Un outil vit dans ce dossier et il tourne :

```bash
python3 .claude/skills/ig-caption/caption.py legende.txt
python3 .claude/skills/ig-caption/caption.py legende.txt --keywords "devis freelance,tarifs photographe"
```

Il affiche la légende comme le fil l'affiche : les 125 premiers caractères
dans un cadre, le reste derrière le tap. Lis ce cadre avant tout le reste.

## D'abord, quel est le rôle de cette légende

**Rôle A : la vidéo a déjà accroché.** Un Reel porte sa propre accroche. La
légende n'est pas une deuxième accroche. Son rôle : l'appel à l'action, le
contexte qui le rend logique, et les mots que les gens cherchent.

**Rôle B : la légende est le contenu.** Une photo, une image seule, une
couverture de carrousel. Ici la ligne 1 est l'accroche : concrète, courte,
coupée sur un suspense et pas au milieu d'une subordonnée.

Dis lequel tu écris. Si l'utilisateur a un Reel avec une accroche forte,
écris A et dis pourquoi.

## La forme

```
Ligne 1     125 caractères visibles. Rôle A : l'appel, simplement.
            Rôle B : l'accroche. Jamais une salutation, jamais un hashtag,
            jamais un emoji en premier caractère.
Corps       paragraphes courts, une ligne vide entre chacun. Deux à six.
            C'est là que vivent les termes de recherche.
L'appel     un seul. Commenter un mot-clé, enregistrer, ou écrire en DM.
Hashtags    cinq maximum, sur leur propre ligne en bas, ou aucun.
```

Limite : 2 200 caractères, et presque rien n'en a besoin.

## Les hashtags, honnêtement

Selon le pack d'origine, **Instagram plafonne les hashtags à cinq par
publication depuis le 18 décembre 2025**, et Adam Mosseri avait déjà dit en
février 2025 que les hashtags n'augmentent pas la portée. Je n'ai pas pu
revérifier ces deux affirmations : si l'utilisateur voit autre chose dans
l'app, l'app a raison.

Donc : cinq maximum, précis, comme étiquettes de sujet. `#viral`, `#fyp`,
`#pourtoi`, `#explore` ne décrivent rien. Le linter les signale.

## Les termes de recherche comptent plus que les hashtags

La recherche Instagram lit le texte de la légende. Le terme pour lequel
l'utilisateur veut être trouvé va dans la légende, **comme un humain le
taperait**, dans une phrase normale : « devis freelance » écrit en ligne 3,
pas « #devisfreelance » dans un bloc en bas. Pense aussi à la façon dont ton
audience tape vraiment : sans accents, avec des anglicismes (« pricing »,
« freelance »), en abrégé.

Demande deux ou trois termes et passe-les au linter avec `--keywords`.

## Règles

- **Pas de lien dans la légende.** Les légendes ne sont pas cliquables.
  Bio ou DM.
- **Un seul appel.** Deux appels, c'est comme aucun. `caption.py` les compte.
- **Le mot-clé doit pouvoir se taper.** Un mot, sans espace, sans emoji, sans
  accent si possible (`CONTRAT`, pas `ÉCHÉANCE`), en majuscules, et dit à
  voix haute dans la vidéo aussi. « Écris CONTRAT en commentaire » marche.
  « Commente "le guide du contrat" » non.
- **Tu ou vous**, comme dans voice.md, et le même que dans la vidéo.
- **Les emoji sont de la ponctuation, pas de la déco.** Alerte au-delà de
  4 pour 100 caractères.
- **Le texte alternatif vaut 20 secondes.** Pour les carrousels et photos,
  écris-le.
- **Mentions légales :** si c'est une collaboration commerciale ou un
  contenu avec image retouchée ou générée par IA, rappelle de vérifier les
  mentions obligatoires (en France, loi du 9 juin 2023 sur l'influence
  commerciale). Signale, ne tranche pas.

## La boucle

1. Choisis le rôle A ou B et dis lequel.
2. Rédige.
3. Passe-la dans `/ig-human`. Les légendes sont courtes, le slop s'y entend
   plus qu'ailleurs.
4. Lance `caption.py` avec les termes de recherche. Corrige chaque ÉCHEC.
   Décide chaque ALERTE à voix haute plutôt qu'en silence.
5. Affiche le bloc prêt à copier, puis le reçu :

```
LÉGENDE PRÊTE
rôle :       A - le reel porte l'accroche
visible :    118 des 125 caractères utilisés avant la coupure
appel :      un, écris CONTRAT en commentaire
hashtags :   3
recherche :  « devis freelance » en ligne 3
linter :     PRÊTE
```

Rien n'est publié. L'utilisateur colle la légende.
