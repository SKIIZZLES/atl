# Pack Instagram en français

Treize skills Claude pour gérer un compte Instagram en français. C'est une
adaptation de
[instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill)
(Jake Schincariol, licence MIT, voir `LICENSE`).

**Rien n'est publié sans toi.** Les skills écrivent, tu publies.

## Où sont les fichiers

```
.claude/skills/ig-*/          les 13 skills (chargés automatiquement dans ce dépôt)
.claude/instagram/            tes données : voice.md, log.md, plan.md, swipe.md
.claude/instagram/voice.exemple.md   modèle à copier en voice.md
```

Commence par `voice.md` : copie `voice.exemple.md`, remplis-le, ou envoie à
Claude trois de tes reels en disant « écris mon voice.md à partir de ça ».

Les skills écrivent `log.md`, `plan.md` et `swipe.md` dans ce dossier. Dans
une session cloud, ils disparaissent à la fin de la session s'ils ne sont pas
commités.

## Les treize

| commande | ce qu'elle fait |
| --- | --- |
| `/ig-reel` | Une idée en Reel : trois accroches tirées de 26 formules, notées, puis le script, le texte à l'écran et le découpage minuté. |
| `/ig-viral` | Trouve ce qui marche dans ta niche, classe par multiple de la médiane de chaque compte, écrit le swipe file. |
| `/ig-caption` | La légende, vérifiée. Montre les 125 caractères visibles avant le tap. |
| `/ig-carousel` | Les carrousels : couverture, texte des slides, fichiers 1080x1350. |
| `/ig-story` | La séquence de stories du jour et l'entonnoir DM. |
| `/ig-profile` | Note le profil sur 100 et réécrit par ordre de priorité. |
| `/ig-plan` | La semaine : quoi, quel format, quand, avec qui interagir. |
| `/ig-human` | L'humanizer : retire l'empreinte machine en respectant la typographie française. |
| `/ig-comment` | Commentaires sur les posts des autres. |
| `/ig-reply` | Les réponses sous tes posts, triées par valeur. |
| `/ig-dm` | Envoi après mot-clé, premier message, collab, deux relances. |
| `/ig-repurpose` | Un contenu long en une semaine de posts. |
| `/ig-audit` | Le bilan de ce que tu as déjà publié. |

## Les cinq outils

Aucune dépendance (Python 3 standard), aucun réseau.

```bash
python3 .claude/skills/ig-reel/hookscore.py accroches.txt
python3 .claude/skills/ig-reel/beats.py script.txt --target 30
python3 .claude/skills/ig-caption/caption.py legende.txt --keywords "devis freelance"
python3 .claude/skills/ig-human/humanize.py brouillon.txt -o propre.txt --report
python3 .claude/skills/ig-human/detect.py brouillon.txt propre.txt
python3 .claude/skills/ig-viral/swipe.py collecte.tsv --out .claude/instagram/swipe.md
```

## Ce qui a été adapté au français

- **Lexique** (`ig-human/slop.json`) : environ 200 expressions d'IA en
  français (« il est important de noter que », « dans un monde en constante
  évolution », « véritable », « n'hésitez pas à »...) et le bloc Instagram
  (« arrête de scroller », « abonne-toi pour plus de contenu »...). Les mots
  dont le remplacement casserait l'accord ou la conjugaison sont signalés,
  pas remplacés.
- **Typographie** : espaces insécables françaises gardées (ou ajoutées avec
  `--espaces ajouter`), guillemets « », apostrophe ’, points de suspension
  et point médian laissés tels quels.
- **Voix** : le registre parlé français (négation sans « ne », « t'as »,
  « y'a », « ça ») remplace les contractions anglaises. Tutoiement et
  vouvoiement mélangés sont signalés.
- **Accroches** (`ig-reel/hooks.json`, `hookscore.py`) : 26 formules
  réécrites en français, listes de mots d'enjeu, d'ouvertures faibles et
  d'impératifs en français, chiffres dits en toutes lettres, montants en €.
- **Légende** (`caption.py`) : appels à l'action français (« écris X en
  commentaire », « lien en bio »...), hashtags accentués, hashtags génériques
  français (#pourtoi...).
- **Instructions** : les 13 skills sont en français, avec des rappels sur
  les mentions obligatoires en France (loi du 9 juin 2023 sur l'influence
  commerciale) pour les contenus sponsorisés ou les images retouchées ou
  générées par IA.

## Limites, honnêtement

- **Rien n'a été calibré sur de vraies données françaises.** La version
  anglaise de `hookscore.py` a été testée sur 74 vraies accroches (bonne pour
  repérer les accroches ratées, presque nulle pour prédire les gagnantes).
  La version française n'a été testée que sur des exemples fabriqués. Les
  seuils de `detect.py` viennent de l'anglais.
- **Les regex des formules** n'ont été vérifiées que sur leurs propres
  exemples. Sur de vraies accroches, attends-toi à beaucoup de « non
  classée ».
- **La vérification VOIX favorise le registre familier.** Un compte qui
  vouvoie volontairement aura une note plus basse sans que ce soit un
  défaut.
- **Les chiffres de plateforme vieillissent** (plafond de 5 hashtags,
  zones sûres, 125 caractères visibles). Si l'app dit autre chose, l'app a
  raison.
- **Ces outils ne sont pas des détecteurs d'IA** et ne promettent aucun
  verdict de GPTZero, Compilatio ou autre.
- **Ce n'est pas un avis juridique.** Les rappels sur la loi influenceurs
  sont des signalements à vérifier.
