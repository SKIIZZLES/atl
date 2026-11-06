#!/usr/bin/env python3
"""
detect.py - cinq vérifications qui notent à quel point un brouillon en
français a l'air écrit par une machine.

Adapté de instagram-agent-skill (Jake Schincariol, licence MIT) pour le
français.

Ce que c'est : cinq heuristiques locales, calquées sur les signaux que les
détecteurs publics mesurent - variation de longueur des phrases, concret,
vocabulaire tout fait, empreinte typographique, et voix. Tout est calculé sur
ta machine, à partir du texte seul. Rien n'est envoyé.

Ce que ce n'est PAS : GPTZero, Originality, Copyleaks, Winston, Compilatio
ou Lucide. Aucun appel à leurs API, aucune promesse sur leur verdict.

Limite propre au français : les seuils ont été repris de la version anglaise
et n'ont pas été recalibrés sur un corpus français. La vérification VOIX
mesure le registre familier (« t'as », « y'a », négation sans « ne »,
« ça » plutôt que « cela ») : un compte qui vouvoie volontairement aura une
note VOIX plus basse, et ce n'est pas un défaut en soi.

Chaque vérification renvoie une note HUMAINE de 0 à 100. Plus haut = mieux.

Usage
  python3 detect.py brouillon.txt
  python3 detect.py brouillon.txt --json
  python3 detect.py avant.txt apres.txt      # comparer deux versions
"""

import argparse
import json
import os
import re
import statistics
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(HERE, "slop.json")
sys.path.insert(0, HERE)
from humanize import entry_pattern, _legit  # noqa: E402

SENT_RE = re.compile(r"[^.!?\n]+[.!?]*")
WORD_RE = re.compile(r"[^\W\d_]+(?:['’][^\W\d_]+)*")
TOKEN_RE = re.compile(r"[^\W\d_]+['’]?")
NUMBERS = re.compile(r"\d[\d   .,]*\s?(?:%|€|k€|k\b)?|€\s?\d")
PROPER = re.compile(r"(?<![.!?]\s)(?<!^)(?<![.!?] )\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b", re.MULTILINE)
SPOKEN_NUMBERS = {
    "zéro", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
    "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "vingt",
    "trente", "quarante", "cinquante", "soixante", "cent", "cents", "mille",
    "million", "millions", "milliard", "milliards", "douzaine", "dizaine",
    "centaine", "moitié", "double", "triple", "euros", "balles",
}
FAMILIER = re.compile(
    r"(?i)(?<!\w)(?:t['’](?:as|es|étais|avais|vas|inquiète)|j['’](?:sais|suis|crois|avoue|te)"
    r"|y['’]a|chais|ouais|bah|genre|grave|carrément|franchement|perso|du coup|en vrai"
    r"|bref|truc|trucs|boulot|bosser|ça)(?!\w)")
SOUTENU = re.compile(r"(?i)(?<!\w)(?:cela|afin|toutefois|néanmoins|ainsi|nous|lequel|laquelle|dont)(?!\w)")
PRONOUNS = re.compile(
    r"(?i)(?<!\w)(?:(?:je|moi|me|mon|ma|mes|tu|toi|te|ton|ta|tes|on|nous|vous"
    r"|votre|vos|notre|nos)(?!\w)|[jmt]['’])")
NEG = {"pas", "jamais", "rien"}


def clamp(n):
    return max(0.0, min(100.0, n))


def scale(value, human, machine):
    if human == machine:
        return 50.0
    return clamp((value - machine) / (human - machine) * 100)


def sentences(text):
    return [s.strip() for s in SENT_RE.findall(text) if len(s.split()) > 2]


def words(text):
    return WORD_RE.findall(text)


def ne_drops(text):
    """Négations sans « ne » : « je sais pas », « c'est pas grave »."""
    toks = [t.lower().replace("’", "'") for t in TOKEN_RE.findall(text)]
    n = 0
    for i, t in enumerate(toks):
        if t in NEG:
            window = toks[max(0, i - 4):i]
            if i and toks[i - 1] in ("pourquoi", "non", "ou", "si"):
                continue
            if not any(w in ("ne", "n'") for w in window):
                n += 1
    return n


def check_burstiness(text):
    lens = [len(s.split()) for s in sentences(text)]
    if len(lens) < 4:
        return 50.0, "trop court pour juger"
    mean = statistics.mean(lens)
    cv = statistics.pstdev(lens) / mean if mean else 0
    score = scale(cv, human=0.70, machine=0.22)
    return score, f"variation {cv:.2f} sur {len(lens)} phrases (viser 0,55+)"


def check_specificity(text):
    w = words(text)
    if len(w) < 25:
        return 50.0, "trop court pour juger"
    per100 = 100 / len(w)
    spoken = [x for x in w if x.lower() in SPOKEN_NUMBERS]
    hits = len(NUMBERS.findall(text)) + len(set(PROPER.findall(text))) + len(spoken)
    density = hits * per100
    score = scale(density, human=6.0, machine=0.5)
    return score, f"{hits} marqueurs concrets, {density:.1f} pour 100 mots (viser 4+)"


def check_slop(text, lex):
    w = words(text)
    if not w:
        return 50.0, "vide"
    hits, found = 0, []
    rest = text
    # Les plus longs d'abord, et on masque ce qui a matché, pour ne pas
    # compter deux fois « abonne-toi pour plus » et « ... de contenu ».
    for entry in sorted(lex["words"] + lex["phrases"], key=lambda e: len(e["find"]), reverse=True):
        rest, n = entry_pattern(entry).subn("\x00", rest)
        if n:
            hits += n
            found.append(entry["find"] if not entry.get("regex") else entry["family"] + " (regex)")
    density = hits * 100 / len(w)
    score = scale(density, human=0.0, machine=4.0)
    detail = f"{hits} termes tout faits, {density:.1f} pour 100 mots"
    if found:
        detail += " (" + ", ".join(sorted(found)[:4]) + (", ..." if len(found) > 4 else "") + ")"
    return score, detail


def check_fingerprint(text):
    """Caractères qu'un clavier de téléphone français ne produit pas.

    Ne compte PAS l'apostrophe ’, les points de suspension … ni les
    guillemets « » : un iPhone en français les produit tout seul. Les
    insécables ne comptent que hors des positions françaises légitimes.
    """
    invisible = sum(1 for c in text if unicodedata.category(c) == "Cf")
    em = text.count("—")
    curly = text.count("“") + text.count("”")
    stray = 0
    for i, c in enumerate(text):
        if c in "   ":
            prev = text[i - 1] if i else ""
            nxt = text[i + 1] if i + 1 < len(text) else ""
            if not _legit(prev, nxt):
                stray += 1
    total = invisible * 4 + em * 2 + curly + stray
    per1k = total * 1000 / max(len(text), 1)
    score = scale(per1k, human=0.0, machine=12.0)
    detail = (f"{invisible} invisible(s), {em} tiret(s) cadratin(s), {curly} guillemet(s) "
              f"anglais, {stray} insécable(s) mal placée(s)")
    return score, detail


def check_voice(text, lex):
    w = words(text)
    if len(w) < 25:
        return 50.0, "trop court pour juger"
    per100 = 100 / len(w)
    fam = len(FAMILIER.findall(text)) + ne_drops(text)
    sout = len(SOUTENU.findall(text))
    registre = max(0.0, fam - sout * 0.5) * per100
    person = len(PRONOUNS.findall(text)) * per100
    tells, names = 0, []
    for s in lex["structures"]:
        try:
            n = len(re.compile(s["regex"], re.MULTILINE).findall(text))
        except re.error:
            continue
        if n:
            tells += n
            names.append(s["id"])
    bullets = [len(b.split()) for b in re.findall(r"(?m)^\s*[-*•]\s+(.+)$", text)]
    uniform = (len(bullets) >= 3 and statistics.pstdev(bullets) < 1.6)
    score = (scale(registre, human=3.0, machine=0.0) * 0.35
             + scale(person, human=8.0, machine=1.0) * 0.35
             + clamp(100 - tells * 22) * 0.30)
    if uniform:
        score -= 12
        names.append("puces-uniformes")
    detail = (f"{registre:.1f} marques de registre parlé, {person:.1f} pronoms personnels "
              f"pour 100 mots, {tells} tic(s) de structure")
    if names:
        detail += " [" + ", ".join(names[:4]) + "]"
    return clamp(score), detail


CHECKS = ["RYTHME", "CONCRET", "SLOP", "EMPREINTE", "VOIX"]


def run(text, lex):
    results = {
        "RYTHME": check_burstiness(text),
        "CONCRET": check_specificity(text),
        "SLOP": check_slop(text, lex),
        "EMPREINTE": check_fingerprint(text),
        "VOIX": check_voice(text, lex),
    }
    scores = [results[c][0] for c in CHECKS]
    overall = statistics.mean(scores) * 0.6 + min(scores) * 0.4
    verdict = "OK" if overall >= 70 and min(scores) >= 55 else (
        "À REVOIR" if overall >= 50 else "SIGNALÉ")
    return results, overall, verdict


def bar(score, width=24):
    filled = round(score / 100 * width)
    return "#" * filled + "." * (width - filled)


def render(results, overall, verdict, label=None, out=sys.stdout):
    title = "PANNEAU DE DÉTECTION" + (f"  -  {label}" if label else "")
    print("\n" + title, file=out)
    print("=" * max(len(title), 62), file=out)
    for name in CHECKS:
        score, detail = results[name]
        print(f"  {name:<13} {bar(score)} {score:5.1f}", file=out)
        print(f"  {'':<13} {detail}", file=out)
    print("-" * 62, file=out)
    print(f"  {'NOTE HUMAINE':<13} {bar(overall)} {overall:5.1f}   {verdict}", file=out)
    if verdict != "OK":
        weakest = min(CHECKS, key=lambda c: results[c][0])
        print(f"\n  Signal le plus faible : {weakest}. Corrige celui-là d'abord.", file=out)
    print("", file=out)


def main():
    ap = argparse.ArgumentParser(description="Note à quel point un brouillon a l'air écrit par une machine.")
    ap.add_argument("input", nargs="?", default="-", help="fichier, ou - pour l'entrée standard")
    ap.add_argument("compare", nargs="?", help="second fichier, pour afficher avant/après")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--lexicon", default=LEX)
    args = ap.parse_args()

    lex = json.load(open(args.lexicon, encoding="utf-8"))
    read = lambda p: sys.stdin.read() if p == "-" else open(p, encoding="utf-8").read()  # noqa: E731

    targets = [(args.input, read(args.input))]
    if args.compare:
        targets.append((args.compare, read(args.compare)))

    payload = []
    for name, text in targets:
        results, overall, verdict = run(text, lex)
        payload.append({
            "source": name,
            "checks": {k: {"score": round(v[0], 1), "detail": v[1]} for k, v in results.items()},
            "human_score": round(overall, 1),
            "verdict": verdict,
        })

    if args.json:
        print(json.dumps(payload if args.compare else payload[0], indent=2, ensure_ascii=False))
        return

    for (name, text), p in zip(targets, payload):
        results, overall, verdict = run(text, lex)
        render(results, overall, verdict, label=os.path.basename(name) if args.compare else None)
    if args.compare:
        a, b = payload
        delta = b["human_score"] - a["human_score"]
        print(f"  {a['human_score']:.1f} {a['verdict']}  ->  "
              f"{b['human_score']:.1f} {b['verdict']}   ({delta:+.1f})\n")

    sys.exit(0 if payload[-1]["verdict"] == "OK" else 1)


if __name__ == "__main__":
    main()
