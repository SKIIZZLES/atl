#!/usr/bin/env python3
"""
caption.py - vérifie une légende Instagram en français et montre exactement
ce que le fil affiche avant le « ... plus ».

Adapté de instagram-agent-skill (Jake Schincariol, licence MIT) pour le
français.

Instagram affiche environ 125 caractères d'une légende dans le fil et cache
le reste derrière un tap. Presque toutes les légendes qui échouent échouent
là. Ce script affiche la fenêtre visible dans un cadre, puis fait les
vérifications qui valent la peine.

La coupure à 125 caractères est une approximation : elle bouge avec
l'appareil, la taille de police et les retours à la ligne. Garde une marge.
Change-la avec --truncate.

Usage
  python3 caption.py legende.txt
  python3 caption.py legende.txt --keywords "devis freelance,tarifs photographe"
  python3 caption.py legende.txt --json
"""

import argparse
import json
import re
import sys
import textwrap

LIMIT = 2200
TRUNCATE = 125
# Plafond de 5 hashtags par publication depuis le 18 décembre 2025 selon le
# pack d'origine (annonce du compte @Creators). Vérifie que c'est toujours
# la règle au moment où tu lis ceci.
HASHTAG_LIMIT = 5

HASHTAG_RE = re.compile(r"(?:^|\s)(#\w+)")
MENTION_RE = re.compile(r"(?:^|\s)(@[\w.]+)")
LINK_RE = re.compile(r"https?://\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:com|fr|co|io|net|org|ai|app|be|ch)/\S*",
                     re.IGNORECASE)
EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF☀-➿←-⇿️]")
CONCRETE_RE = re.compile(r"€\s?\d|\b\d[\d,.]*\b|(?<!^)\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b", re.MULTILINE)
KEYWORD = r"[«\"“]?\s?[A-ZÀ-ÖØ-Þ0-9]{2,}\b"

ASKS = [
    (re.compile(r"\b(?:[Cc]ommente[sz]?|[Cc]ommentez|[ÉéEe]cri[st]|[ÉéEe]crivez|[Tt]ape[sz]?|[Tt]apez)"
                r"\s+(?:(?:le|juste le) mot\s+)?" + KEYWORD), "commenter un mot-clé"),
    (re.compile(r"(?i)\b(?:dm|mp)\b|\b(?:écris|écrivez|envoie|envoyez)-moi\b|\ben (?:dm|mp|privé)\b"),
     "écrire en privé"),
    (re.compile(r"(?i)\b(?:enregistre|enregistrez|sauvegarde|sauvegardez)\b"), "enregistrer"),
    (re.compile(r"(?i)\b(?:partage|partagez|envoie-le|envoyez-le)\b"), "partager"),
    (re.compile(r"(?i)\b(?:abonne-toi|abonnez-vous|suis-moi|suivez-moi)\b"), "s'abonner"),
    (re.compile(r"(?i)\blien (?:en|dans (?:ma|la)) bio\b"), "lien en bio"),
    (re.compile(r"(?i)\b(?:swipe|swipez|glisse|glissez|fais défiler)\b"), "faire défiler"),
    (re.compile(r"(?i)\b(?:dis-moi|dites-moi|raconte-moi|racontez-moi)\b|\blequel\b|\blaquelle\b"
                r"|\btu ferais quoi\b|\bvous feriez quoi\b"), "répondre à une question"),
]

FILLER_TAGS = {"#viral", "#fyp", "#explore", "#explorepage", "#foryou", "#foryoupage",
               "#pourtoi", "#trending", "#tendance", "#instagood", "#love", "#follow",
               "#like4like", "#likeforlike", "#reels", "#reelsinstagram", "#viralreels",
               "#instadaily", "#reelsfrance", "#instafrance", "#abonnetoi", "#france"}


def visible_window(text, cut):
    flat = text.strip()
    return flat if len(flat) <= cut else flat[:cut]


def render_box(window, truncated, out=sys.stdout, width=52):
    print("\n  CE QUE LE FIL AFFICHE", file=out)
    print("  +" + "-" * (width + 2) + "+", file=out)
    lines = []
    for raw in window.split("\n"):
        lines.extend(textwrap.wrap(raw, width) or [""])
    for line in lines[:8]:
        print(f"  | {line:<{width}} |", file=out)
    tail = "... plus" if truncated else "(la légende tient entière)"
    print("  +" + "-" * (width + 2 - len(tail) - 2) + f" {tail} " + "+", file=out)


def analyse(text, cut=TRUNCATE, keywords=None):
    stripped = text.strip()
    chars = len(stripped)
    lines = stripped.split("\n")
    first_line = lines[0].strip() if lines else ""
    tags = HASHTAG_RE.findall(stripped)
    mentions = MENTION_RE.findall(stripped)
    links = LINK_RE.findall(stripped)
    emoji = EMOJI_RE.findall(stripped)
    window = visible_window(stripped, cut)
    truncated = chars > cut
    asks = [name for pattern, name in ASKS if pattern.search(stripped)]
    filler = [t for t in tags if t.lower() in FILLER_TAGS]
    keywords = [k.strip() for k in (keywords or []) if k.strip()]
    checks = []

    def add(name, status, detail):
        checks.append({"check": name, "status": status, "detail": detail})

    add("LONGUEUR", "ÉCHEC" if chars > LIMIT else "OK",
        f"{chars} / {LIMIT} caractères" + (f", {chars - LIMIT} de trop" if chars > LIMIT else ""))

    if not first_line:
        add("1RE LIGNE", "ÉCHEC", "la légende commence par une ligne vide")
    elif first_line.startswith("#") or first_line.startswith("@"):
        add("1RE LIGNE", "ÉCHEC", "commence par un hashtag ou une mention, la seule place qui "
                                  "mérite une phrase")
    elif len(first_line) > cut:
        add("1RE LIGNE", "ALERTE", f"{len(first_line)} caractères, coupée à {cut} en pleine idée. "
                                   "Bien si la coupure crée du suspense, mauvais si c'est une "
                                   "subordonnée")
    else:
        add("1RE LIGNE", "OK", f"{len(first_line)} caractères, arrive entière")

    n_concrete = len(CONCRETE_RE.findall(window))
    add("CONCRET", "OK" if n_concrete else "ALERTE",
        f"{n_concrete} chiffre(s) ou nom(s) dans la fenêtre visible"
        + ("" if n_concrete else " - rien de vérifiable avant le tap"))

    if len(tags) > HASHTAG_LIMIT:
        add("HASHTAGS", "ÉCHEC", f"{len(tags)} hashtags, au-dessus du plafond de {HASHTAG_LIMIT}. "
                                 "Ceux au-delà du cinquième ne comptent pas et le bloc fait daté")
    elif filler:
        add("HASHTAGS", "ALERTE", f"{len(tags)} hashtags, dont {len(filler)} génériques "
                                  f"({', '.join(filler[:3])}). Ils ne décrivent rien")
    else:
        add("HASHTAGS", "OK", f"{len(tags)} hashtag(s)" + (f" : {' '.join(tags)}" if tags else ""))

    if not tags:
        add("PLACE TAGS", "OK", "aucun hashtag à placer")
    elif any(re.search(r"(?:^|\s)" + re.escape(t) + r"\b", window) for t in tags):
        add("PLACE TAGS", "ALERTE", "un hashtag est dans la fenêtre visible, de la place du fil "
                                    "gâchée pour une étiquette")
    else:
        add("PLACE TAGS", "OK", "les hashtags sont sous le pli")

    add("LIENS", "ALERTE" if links else "OK",
        f"{len(links)} lien(s) dans la légende, et les légendes ne sont pas cliquables. "
        "Mets-le en bio ou en DM" if links else "pas de lien mort dans le texte")

    if len(asks) == 1:
        add("UN APPEL", "OK", f"un seul appel à l'action : {asks[0]}")
    elif not asks:
        add("UN APPEL", "ALERTE", "aucun appel à l'action. Décide à quoi sert ce post")
    else:
        add("UN APPEL", "ALERTE", f"{len(asks)} appels ({', '.join(asks)}). Deux appels, "
                                  "c'est comme aucun")

    density = len(emoji) * 100 / max(chars, 1)
    add("EMOJI", "ALERTE" if density > 4 else "OK",
        f"{len(emoji)} emoji, {density:.1f} pour 100 caractères" + (" - ça fait déco" if density > 4 else ""))

    if keywords:
        low = stripped.lower()
        found = [k for k in keywords if k.lower() in low]
        missing = [k for k in keywords if k.lower() not in low]
        in_window = [k for k in found if k.lower() in window.lower()]
        status = "OK" if not missing else ("ALERTE" if found else "ÉCHEC")
        add("RECHERCHE", status, f"{len(found)}/{len(keywords)} présents"
            + (f", {len(in_window)} dans la fenêtre visible" if found else "")
            + (f". Manquants : {', '.join(missing)}" if missing else ""))

    fails = sum(1 for c in checks if c["status"] == "ÉCHEC")
    warns = sum(1 for c in checks if c["status"] == "ALERTE")
    verdict = "À CORRIGER" if fails else ("À RELIRE" if warns else "PRÊTE")
    return {"characters": chars, "limit": LIMIT, "truncate_at": cut, "visible": window,
            "truncated": truncated, "first_line_chars": len(first_line), "hashtags": tags,
            "mentions": mentions, "links": links, "emoji": len(emoji), "asks": asks,
            "checks": checks, "verdict": verdict}


def render(a, out=sys.stdout):
    head = (f"VÉRIF LÉGENDE  ·  {a['characters']} / {a['limit']} car.  ·  "
            f"{len(a['hashtags'])} hashtags  ·  {len(a['asks'])} appel(s)")
    print("\n" + head, file=out)
    print("=" * max(len(head), 62), file=out)
    render_box(a["visible"], a["truncated"], out=out)
    print("", file=out)
    for c in a["checks"]:
        print(f"  {c['status']:<6} {c['check']:<11} {c['detail']}", file=out)
    print("-" * max(len(head), 62), file=out)
    print(f"  VERDICT  {a['verdict']}\n", file=out)


def main():
    ap = argparse.ArgumentParser(description="Vérifie une légende Instagram.")
    ap.add_argument("input", nargs="?", default="-", help="fichier légende, ou - pour l'entrée standard")
    ap.add_argument("--truncate", type=int, default=TRUNCATE,
                    help=f"caractères affichés avant « ... plus » (défaut {TRUNCATE})")
    ap.add_argument("--keywords", default="", help="termes de recherche, séparés par des virgules")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    a = analyse(raw, cut=args.truncate, keywords=args.keywords.split(","))
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        render(a)
    sys.exit(0 if a["verdict"] == "PRÊTE" else 1)


if __name__ == "__main__":
    main()
