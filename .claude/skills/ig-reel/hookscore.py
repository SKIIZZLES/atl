#!/usr/bin/env python3
"""
hookscore.py - note la première phrase d'un Reel en français sur les cinq
choses que les bonnes accroches ont en commun, et classe un lot d'accroches.

Adapté de instagram-agent-skill (Jake Schincariol, licence MIT) pour le
français.

Ce que c'est : cinq heuristiques locales, calculées sur le texte seul - une
longueur qu'on dit en moins de trois secondes, un marqueur concret, un enjeu,
l'essentiel au début plutôt qu'à la fin, et une personne à qui on parle.

Ce que ce n'est PAS : un prédicteur de vues. La version anglaise a été testée
sur 74 vraies accroches : elle sépare bien une vraie accroche d'une accroche
volontairement ratée (AUC 0,83), mais elle ne sépare presque pas les succès
d'un créateur de ses échecs (AUC 0,56, 0,50 étant le hasard).

Cette version française n'a été testée sur AUCUN corpus réel. Les listes de
mots (enjeux, ouvertures faibles, impératifs) ont été traduites et adaptées à
la main. Utilise-la pour attraper les accroches clairement faibles
(salutation, préambule, rien de concret, trop longue) et fais confiance à ta
courbe de rétention pour le reste.

Chaque vérification renvoie 0 à 100. Plus haut = mieux.

Usage
  python3 hookscore.py accroches.txt            # une accroche par ligne, classées
  python3 hookscore.py --hook "J'ai perdu 18 000 € à cause d'une clause."
  python3 hookscore.py accroches.txt --json
"""

import argparse
import json
import re
import statistics
import sys

WORD_RE = re.compile(r"[\w$€%'’-]+")
NUMBER_RE = re.compile(
    r"€\s?\d[\d,.]*"
    r"|\b\d[\d,.]*\s?"
    r"(?:%|€|k€|k\b|x\b|h\b|heures?\b|min\b|minutes?\b|sec\b|secondes?\b"
    r"|jours?\b|semaines?\b|mois\b|ans\b|années?\b)?",
    re.IGNORECASE)
PROPER_RE = re.compile(r"(?<!^)\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b")
HASHTAG_RE = re.compile(r"(?:^|\s)#\w+")
EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF☀-➿]")
ELISION = re.compile(r"^(?:[ldjmtnsc]|qu|jusqu|lorsqu|puisqu)['’](.+)$", re.IGNORECASE)

# Les accroches parlées disent leurs chiffres à voix haute. « un », « une » et
# « premier » sont volontairement absents : ce sont des mots de remplissage
# bien plus souvent que des quantités.
SPOKEN_NUMBERS = {
    "zéro", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
    "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "vingt",
    "trente", "quarante", "cinquante", "soixante", "cent", "cents", "mille",
    "million", "millions", "milliard", "milliards", "douzaine", "dizaine",
    "moitié", "double", "triple",
}
MONEY_WORDS = {
    "euros", "euro", "balles", "centimes", "pourcent", "smic", "salaire",
    "loyer", "bénéfice", "bénéfices", "millionnaire", "milliardaire", "ca",
}

# Les mots qui mettent quelque chose en jeu.
STAKES = {
    "arrête", "arrêtez", "arrete", "stop", "jamais", "faux", "fausse", "erreur",
    "erreurs", "perdu", "perdre", "perds", "perte", "coûté", "coûte", "coûter",
    "fauché", "raté", "ratés", "échec", "échoué", "personne", "non", "pas", "ne",
    "viré", "virée", "supprimé", "supprime", "tué", "tue", "remplacé", "remplace",
    "gratuit", "gratuitement", "payé", "facturé", "embauché", "économisé",
    "premier", "première", "interdit", "illégal", "pire", "déteste", "détesté",
    "gâché", "arnaque", "mensonge", "menti", "vérité", "secret", "caché", "volé",
    "avant", "jusqu", "mais", "sauf", "problème", "risque", "danger",
    "attention", "regret", "regrette", "devrais", "aurais", "encore", "déjà",
    "seulement", "sans", "vs", "versus", "bide", "flop", "remboursé",
    "remboursement", "dette", "burn-out", "abandonné", "lâché",
}

# Les ouvertures qui passent la première seconde à ne rien dire.
WEAK_OPENERS = [
    "alors", "donc", "ok", "okay", "bon", "bref", "salut", "coucou", "hello",
    "hey", "yo", "wesh", "bonjour", "bonsoir", "bienvenue", "aujourd'hui",
    "en gros", "franchement", "honnêtement", "écoute", "écoutez", "euh",
    "juste", "je voulais", "je vais", "on va", "voici comment", "il y a",
    "y a", "c'est", "ce que", "un des", "une des", "l'un des", "est-ce que",
    "vous avez", "tu as", "t'as", "avez-vous", "as-tu", "dans cette",
    "dans ce", "si tu veux", "si vous voulez", "en tant que", "quand on",
    "beaucoup de", "la chose", "tu sais", "vous savez",
]

# Les impératifs qui méritent la première place.
IMPERATIVES = {
    "arrête", "arrêtez", "arrete", "pique", "piquez", "vole", "volez", "copie",
    "copiez", "supprime", "supprimez", "essaie", "essaye", "essayez", "regarde",
    "regardez", "lis", "lisez", "enregistre", "enregistrez", "utilise",
    "utilisez", "construis", "fais", "faites", "écris", "écrivez", "envoie",
    "envoyez", "prends", "prenez", "commence", "commencez", "quitte", "quittez",
    "ne", "n", "jamais", "toujours", "mets", "mettez", "vérifie", "vérifiez",
    "oublie", "oubliez", "évite", "évitez", "teste", "testez", "note", "notez",
    "retiens", "retenez", "stop",
}

DEALBREAKERS = [
    (re.compile(r"(?i)^\s*(?:arr[êe]te[sz]? de scroller|arr[êe]tez de scroller|ne scrolle[sz]? pas"
                r"|stop,? ne scrolle|attends?,? ne scrolle)"),
     "Commence par « arrête de scroller ». Demander l'attention prouve qu'on ne l'a pas méritée."),
    (re.compile(r"(?i)\b(?:dans (?:cette|la) vidéo|dans ce reel|aujourd['’]hui,? je vais (?:te|vous)"
                r"|je vais (?:te|vous) (?:montrer|expliquer|apprendre))\b"),
     "Préambule vidéo. Supprime-le et commence par le résultat."),
    (re.compile(r"(?i)^\s*(?:salut|coucou|hello|hey|bonjour|bonsoir|yo|wesh|bienvenue)\b"),
     "Salutation. Personne n'est venu sur le fil pour être salué."),
    (HASHTAG_RE,
     "Hashtag dans l'accroche. Les hashtags vont en bas de la légende, si quelque part."),
    (EMOJI_RE,
     "Emoji dans l'accroche. Le texte à l'écran en taille accroche a la place pour des mots "
     "ou pour un emoji, pas les deux."),
]


def clamp(n):
    return max(0.0, min(100.0, n))


def words(text):
    # « 18 000 € » se dit comme un seul bloc, on le compte comme un mot.
    text = re.sub(r"(?<=\d)[   .,](?=\d{3}\b)", "", text)
    return WORD_RE.findall(text)


def lex(token):
    """Minuscule, apostrophe droite, sans l'élision : « l'argent » -> « argent »."""
    t = token.lower().replace("’", "'").strip("'-")
    m = ELISION.match(t)
    if m:
        prefix = t.split("'")[0]
        return ("ne" if prefix == "n" else prefix), m.group(1)
    return None, t


def lexed(text):
    out = []
    for w in words(text):
        prefix, core = lex(w)
        if prefix:
            out.append(prefix)
        out.append(core)
    return out


def check_length(text):
    """Une accroche doit arriver avant que le pouce bouge. Environ deux secondes."""
    n = len(words(text))
    secs = n / 2.75
    chars = len(text.strip())
    if 5 <= n <= 13:
        score = 100.0
    elif n < 5:
        score = clamp(100 - (5 - n) * 20)
    else:
        score = clamp(100 - (n - 13) * 11)
    if chars > 65:
        score -= 12
    return clamp(score), f"{n} mots, {chars} caractères, ~{secs:.1f}s à l'oral (viser 5-13 mots)"


def check_specificity(text):
    nums = [n.strip() for n in NUMBER_RE.findall(text) if n.strip()]
    propers = set(PROPER_RE.findall(text))
    low = lexed(text)
    spoken = [w for w in low if w in SPOKEN_NUMBERS or w in MONEY_WORDS]
    hits = len(nums) + len(propers) + len(spoken)
    score = 15.0 if hits == 0 else clamp(45 + hits * 30)
    found = ", ".join(nums[:2] + sorted(propers)[:2] + spoken[:2])
    return score, (f"{hits} marqueur(s) concret(s)" + (f" : {found}" if found else
                   " - pas de chiffre, pas de nom, rien de vérifiable"))


def check_stakes(text):
    w = lexed(text)
    markers = sorted({x for x in w if x in STAKES})
    if re.search(r"\d\s?€|€\s?\d|\beuros?\b", text, re.IGNORECASE):
        markers.append("un prix")
    n = len(markers)
    score = {0: 20.0, 1: 70.0}.get(n, 100.0)
    detail = f"{n} marqueur(s) de tension" + (f" : {', '.join(markers[:4])}" if markers else
                                              " - rien n'est en jeu dans cette phrase")
    return clamp(score), detail


def check_frontload(text):
    w = words(text)
    if not w:
        return 0.0, "vide"
    low = [x.lower().replace("’", "'") for x in w]
    opener = " ".join(low[:3])
    penalty, hit_opener = 0, None
    for weak in WEAK_OPENERS:
        if opener == weak or opener.startswith(weak + " ") or low[0] == weak:
            penalty, hit_opener = 30, weak
            break
    payload = None
    for i, token in enumerate(w):
        prefix, core = lex(token)
        if (core in STAKES or prefix == "ne" or core in SPOKEN_NUMBERS or core in MONEY_WORDS
                or NUMBER_RE.match(token) and re.match(r"\d|€", token)
                or (i and PROPER_RE.match(token))):
            payload = i
            break
    if payload is None:
        base, where = 30.0, "aucun mot fort dans toute la phrase"
    elif payload <= 3:
        base, where = 100.0, f"mot fort en position {payload + 1}"
    elif payload <= 6:
        base, where = 70.0, f"mot fort en position {payload + 1}, peut avancer"
    else:
        base, where = 40.0, f"mot fort en position {payload + 1}, trop tard"
    detail = where + (f" ; ouverture faible « {hit_opener} »" if hit_opener else "")
    return clamp(base - penalty), detail


def check_address(text):
    low = text.lower().replace("’", "'")
    w = lexed(text)
    if re.search(r"(?<!\w)(?:(?:tu|te|toi|ton|ta|tes|vous|votre|vos)(?!\w)|t')", low):
        return 100.0, "parle au spectateur"
    if w and w[0] in IMPERATIVES:
        return 90.0, f"ouverture à l'impératif (« {w[0]} »)"
    if re.search(r"(?<!\w)(?:(?:je|me|moi|mon|ma|mes|on|nous|notre|nos)(?!\w)|[jm]')", low):
        return 70.0, "première personne, personne n'est interpellé"
    return 35.0, "troisième personne, il n'y a personne dans la pièce"


CHECKS = ["LONGUEUR", "CONCRET", "ENJEU", "ATTAQUE", "ADRESSE"]


def run(text):
    results = {
        "LONGUEUR": check_length(text),
        "CONCRET": check_specificity(text),
        "ENJEU": check_stakes(text),
        "ATTAQUE": check_frontload(text),
        "ADRESSE": check_address(text),
    }
    flags = [msg for pattern, msg in DEALBREAKERS if pattern.search(text)]
    scores = [results[c][0] for c in CHECKS]
    overall = clamp(statistics.mean(scores) * 0.6 + min(scores) * 0.4 - len(flags) * 15)
    verdict = "FORTE" if overall >= 70 and min(scores) >= 55 and not flags else (
        "CORRECTE" if overall >= 50 else "FAIBLE")
    return results, overall, verdict, flags


def bar(score, width=24):
    filled = round(score / 100 * width)
    return "#" * filled + "." * (width - filled)


def render_one(text, results, overall, verdict, flags, out=sys.stdout):
    print("\nNOTE D'ACCROCHE", file=out)
    print("=" * 62, file=out)
    print(f"  « {text.strip()} »\n", file=out)
    for name in CHECKS:
        score, detail = results[name]
        print(f"  {name:<13} {bar(score)} {score:5.1f}", file=out)
        print(f"  {'':<13} {detail}", file=out)
    print("-" * 62, file=out)
    print(f"  {'ACCROCHE':<13} {bar(overall)} {overall:5.1f}   {verdict}", file=out)
    for f in flags:
        print(f"\n  ÉLIMINATOIRE  {f}", file=out)
    if verdict != "FORTE":
        weakest = min(CHECKS, key=lambda c: results[c][0])
        print(f"\n  Point le plus faible : {weakest}. Corrige-le et relance.", file=out)
    print("", file=out)


def render_table(rows, out=sys.stdout):
    print("\nCLASSEMENT DES ACCROCHES\n" + "=" * 78, file=out)
    for i, r in enumerate(rows, 1):
        mark = "->" if i == 1 else "  "
        hook = r["hook"] if len(r["hook"]) <= 60 else r["hook"][:57] + "..."
        print(f"{mark} {r['score']:5.1f} {r['verdict']:<8} {hook}", file=out)
        print(f"        plus faible : {r['weakest']} ({r['checks'][r['weakest']]['score']:.0f})", file=out)
        for f in r["flags"]:
            print(f"        éliminatoire : {f}", file=out)
    print("\nTourne la première. Si la première est sous 50, aucune de ces phrases n'est l'accroche.\n",
          file=out)


def main():
    ap = argparse.ArgumentParser(description="Note une accroche de Reel sur cinq propriétés.")
    ap.add_argument("input", nargs="?", default="-", help="fichier avec une accroche par ligne, ou -")
    ap.add_argument("--hook", help="noter une seule accroche passée en ligne de commande")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    if args.hook:
        lines = [args.hook]
    else:
        raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
        lines = [l.strip() for l in raw.splitlines() if l.strip()]
    if not lines:
        print("rien à noter", file=sys.stderr)
        sys.exit(2)

    payload = []
    for line in lines:
        results, overall, verdict, flags = run(line)
        payload.append({
            "hook": line,
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in results.items()},
            "weakest": min(CHECKS, key=lambda c: results[c][0]),
            "flags": flags,
            "score": round(overall, 1),
            "verdict": verdict,
        })

    if args.json:
        print(json.dumps(payload if len(payload) > 1 else payload[0], indent=2, ensure_ascii=False))
        return
    if len(payload) == 1:
        results, overall, verdict, flags = run(lines[0])
        render_one(lines[0], results, overall, verdict, flags)
    else:
        render_table(sorted(payload, key=lambda r: -r["score"]))
    sys.exit(0 if max(p["score"] for p in payload) >= 70 else 1)


if __name__ == "__main__":
    main()
