---
name: ig-plan
description: >-
  Construire la semaine sur Instagram - quoi publier, quel format, quand, et
  avec qui interagir. À utiliser quand l'utilisateur dit « planifie ma
  semaine », « qu'est-ce que je poste », « calendrier éditorial », « j'ai rien
  à poster », ou veut un planning de publication et une liste d'engagement.
---

# ig-plan

La salle de contrôle. Tout le reste du pack exécute ; celui-ci décide quoi
exécuter. À lancer une fois par semaine, le même jour.

## Entrée

Si `.claude/instagram/voice.md`, `swipe.md` et `log.md` existent, lis-les.
Le swipe file est la preuve de l'utilisateur (via `/ig-viral`) sur les
formules qui marchent dans sa niche, et il passe avant tout ce qui est écrit
ici. Le log évite de répéter un thème des quinze derniers jours.

S'ils n'existent pas, demande quatre choses et note-les :

1. Ce que l'utilisateur vend, et à qui.
2. Les trois ou quatre thèmes pour lesquels il veut être connu.
3. Ce qui s'est vraiment passé cette semaine : un appel client, un chiffre,
   une erreur, un truc construit, un désaccord. C'est de là que viennent les
   posts.
4. Dix comptes devant lesquels être visible.

## Quoi publier

Quatre à cinq posts par semaine, dont au moins trois Reels. Les Reels sont le
seul format qui touche de façon fiable des gens qui ne suivent pas le compte.
Les carrousels vont en profondeur avec ceux qui suivent déjà. Les stories
sont quotidiennes et se planifient à part (`/ig-story`).

Mélange sur la semaine, jamais deux du même type d'affilée :

| type | fréquence | rôle |
| --- | --- | --- |
| **Preuve** | 1 par semaine | quelque chose qui s'est passé, avec un chiffre. Reel. |
| **Apprendre** | 1 à 2 par semaine | une chose que le spectateur peut faire aujourd'hui. Reel ou carrousel. |
| **Opinion** | 1 par semaine | une position qui pourrait te faire perdre des abonnés. Reel. |
| **Histoire** | 1 tous les 15 jours | une scène avec un coût. Reel. |
| **Offre** | 1 tous les 15 jours | ce que tu vends, dit simplement, sans t'excuser. Carrousel ou stories. |

Pour chaque créneau : le thème, l'angle précis tiré de ce qui s'est passé
cette semaine, le format, et le numéro de formule de `ig-reel/hooks.json`.
Pas un sujet, un angle. « L'IA » n'est pas un plan. « Le devis qu'on a perdu
parce qu'il y avait un tiret cadratin dedans » est un Reel.

## Quand publier

Quand l'audience est réveillée et pas au travail. Pour la plupart des
audiences grand public en France : en soirée, après le dîner (vers 20 h - 21 h)
ou à la pause déjeuner ; pour une audience pro : tôt le matin. Ce sont des
points de départ, pas des faits : les statistiques du compte disent mieux.

Mais dis-le clairement : **l'heure compte beaucoup moins que les deux
premières secondes.** Si l'utilisateur optimise ses horaires avant que ses
accroches marchent, il polit la mauvaise chose, et tu dois le lui dire.

Cale les heures sur le fuseau de l'audience (France, Belgique, Suisse,
Québec : pas le même soir), pas sur celui de l'utilisateur.

## La tournée d'engagement, qui n'est pas optionnelle

20 minutes par jour, avant de publier. Une liste de 10 :

- **5 portée** : des comptes avec l'audience que l'utilisateur veut, où un bon
  commentaire est vu. Commente tôt, avant que le fil fasse 200 messages.
- **3 pairs** : même taille, même domaine. Le groupe qui rend la pareille.
- **2 acheteurs** : des gens qui pourraient vraiment acheter. Commente
  pendant des semaines avant tout DM, et ne vends jamais en commentaire.

Passe la liste à `/ig-comment`.

## Sortie

```
SEMAINE DU 15 SEPTEMBRE

LUN  engagement seul  (20 min, liste ci-dessous)
MAR  20 h 30  REEL       PREUVE     #5  Le temps écrasé    - devis de 5 h à 20 min
MER  stories + engagement
JEU  20 h     CARROUSEL  APPRENDRE  légende rôle B         - la clause en 4 slides
VEN  20 h 30  REEL       OPINION    #2  L'ordre négatif    - arrête les appels découverte
SAM  -
DIM  19 h     REEL       HISTOIRE   #21 Au milieu          - le mail de remboursement

STORIES  tous les jours, 3 à 5, boîte à questions le jeudi.

ENGAGEMENT  (5 portée / 3 pairs / 2 acheteurs)
  ...

Dis « écris mardi » et je le rédige.
```

Écris le plan dans `.claude/instagram/plan.md` pour que les autres skills le
lisent. Rien n'est programmé ni publié. C'est un plan, et l'utilisateur
l'exécute.
