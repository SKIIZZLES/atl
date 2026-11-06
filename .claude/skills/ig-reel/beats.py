#!/usr/bin/env python3
"""
beats.py - transforme un script de Reel en français en découpage minuté avant
le tournage.

Adapté de instagram-agent-skill (Jake Schincariol, licence MIT) pour le
français.

Estime la durée de chaque ligne, les empile en timecodes, et signale les
quatre choses qui tuent un Reel au montage : une accroche qui dépasse trois
secondes, un plan assez long pour que le spectateur parte, une suite de
lignes sans rien de concret, et une longueur totale qui ne correspond pas à
la cible.

Les durées sont une estimation à partir du nombre de mots. Les mots avec
élision (« l'argent », « c'est ») comptent pour un mot. La vitesse par défaut
est 165 mots/minute, reprise de la version anglaise : elle n'a pas été
mesurée en français. Chronomètre-toi en lisant un script à voix haute et
passe ta vitesse avec --wpm (beaucoup de gens parlent entre 150 et 200).

Usage
  python3 beats.py script.txt
  python3 beats.py script.txt --target 30
  python3 beats.py script.txt --wpm 185 --target 45
  python3 beats.py script.txt --json
"""

import argparse
import json
import re
import sys

WORD_RE = re.compile(r"[\w$€%'’-]+")
SENT_RE = re.compile(r"[^.!?]+[.!?]*")
CONCRETE_RE = re.compile(r"€\s?\d|\b\d[\d,.]*\b|(?<!^)\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]{2,}\b", re.MULTILINE)
SPOKEN_NUMBERS = {
    "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
    "onze", "douze", "quinze", "vingt", "trente", "quarante", "cinquante",
    "soixante", "cent", "cents", "mille", "million", "millions", "euros",
}
STOPWORDS = {
    "le", "la", "les", "l", "un", "une", "des", "de", "d", "du", "et", "ou",
    "mais", "si", "à", "a", "au", "aux", "en", "dans", "sur", "pour", "par",
    "avec", "que", "qu", "qui", "ce", "c", "ça", "cet", "cette", "ces", "il",
    "elle", "est", "sont", "était", "être", "été", "tu", "te", "t", "toi",
    "ton", "ta", "tes", "vous", "votre", "vos", "je", "j", "me", "m", "moi",
    "mon", "ma", "mes", "on", "nous", "notre", "nos", "ils", "elles", "leur",
    "leurs", "donc", "alors", "juste", "pas", "ne", "n", "non", "fait",
    "faire", "ai", "as", "ont", "avait", "va", "vais", "peut", "y", "se", "s",
    "plus", "tout", "tous", "même",
}

HOOK_WINDOW = 3.0
MAX_BEAT = 4.0
ABSTRACT_RUN = 3


def words(text):
    text = re.sub(r"(?<=\d)[   .,](?=\d{3}\b)", "", text)
    return WORD_RE.findall(text)


def content_words(text):
    out = set()
    for w in words(text):
        for part in re.split(r"['’]", w.lower()):
            if part and part not in STOPWORDS and re.search(r"\w", part):
                out.add(re.sub(r"(\d)(?=(\d{3})+$)", r"\1 ", part))
    return out


def concrete(text):
    n = len(CONCRETE_RE.findall(text))
    return n + sum(1 for w in words(text) if w.lower() in SPOKEN_NUMBERS)


def tc(seconds):
    m, s = divmod(seconds, 60)
    return f"{int(m)}:{s:04.1f}"


def split_beats(raw, wps):
    beats = []
    for line in [l.strip() for l in raw.splitlines()]:
        if not line:
            continue
        if len(words(line)) / wps <= MAX_BEAT * 1.5:
            beats.append(line)
            continue
        parts = [p.strip() for p in SENT_RE.findall(line) if p.strip()]
        buf = ""
        for part in parts:
            candidate = (buf + " " + part).strip()
            if buf and len(words(candidate)) / wps > MAX_BEAT:
                beats.append(buf)
                buf = part
            else:
                buf = candidate
        if buf:
            beats.append(buf)
    return beats


def analyse(raw, wpm=165, target=None):
    wps = wpm / 60.0
    beats = split_beats(raw, wps)
    if not beats:
        return None

    rows, clock = [], 0.0
    for i, text in enumerate(beats):
        n = len(words(text))
        dur = n / wps
        rows.append({"n": i + 1, "start": round(clock, 2), "dur": round(dur, 2), "words": n,
                     "text": text, "concrete": concrete(text), "label": "", "flags": []})
        clock += dur
    total = clock

    for r in rows:
        if r["n"] == 1 or r["start"] + r["dur"] <= HOOK_WINDOW:
            r["label"] = "ACCROCHE"
    rows[-1]["label"] = "APPEL" if rows[-1]["label"] != "ACCROCHE" else "ACCR/APPEL"
    half = total / 2
    for r in rows:
        if not r["label"] and r["start"] <= half < r["start"] + r["dur"]:
            r["label"] = "MILIEU"

    notes = []
    if rows[0]["dur"] > HOOK_WINDOW:
        rows[0]["flags"].append(f"l'accroche dure {rows[0]['dur']:.1f}s, au-delà de {HOOK_WINDOW:.0f}s")
        notes.append(f"Le plan 1 prend {rows[0]['dur']:.1f}s à dire. Ramène-le à "
                     f"{int(HOOK_WINDOW * wps)} mots maximum, sinon l'accroche arrive après "
                     "que la décision est prise.")
    if rows[0]["concrete"] == 0:
        notes.append("Le plan 1 n'a ni chiffre ni nom. Les accroches sans rien de vérifiable "
                     "sont celles qu'on fait défiler.")

    for r in rows:
        if r["dur"] > MAX_BEAT:
            r["flags"].append(f"{r['dur']:.1f}s sur un seul plan")
    long_beats = [r["n"] for r in rows if r["dur"] > MAX_BEAT]
    if long_beats:
        notes.append(f"Plan(s) {', '.join(map(str, long_beats))} au-delà de {MAX_BEAT:.0f}s. "
                     "Coupe la ligne ou change ce qui est à l'écran pendant. "
                     "Une image fixe, c'est là que les gens partent.")

    run, start = 0, None
    for r in rows:
        if r["concrete"] == 0:
            run += 1
            start = start if start is not None else r["n"]
            if run == ABSTRACT_RUN:
                notes.append(f"Les plans {start} à {r['n']} n'ont rien de concret. "
                             "Mets un chiffre, un nom ou un prix dans l'un d'eux.")
        else:
            run, start = 0, None

    loop = sorted(content_words(rows[0]["text"]) & content_words(rows[-1]["text"]))
    if loop:
        notes.append(f"Boucle : le dernier plan reprend « {', '.join(loop[:3])} » de l'accroche. "
                     "Les revisionnages, c'est de la portée gratuite.")
    else:
        notes.append("Pas de boucle. Le dernier plan ne partage aucun mot avec l'accroche, la "
                     "vidéo finit à plat. Reprendre un mot du plan 1 est le revisionnage le "
                     "moins cher qui existe.")

    if target:
        delta = total - target
        if abs(delta) <= target * 0.1:
            notes.append(f"Longueur dans la cible ({total:.1f}s pour {target:g}s).")
        elif delta > 0:
            notes.append(f"{delta:.1f}s au-dessus de la cible. Coupe environ {int(delta * wps)} mots.")
        else:
            notes.append(f"{-delta:.1f}s sous la cible. Ajoute {int(-delta * wps)} mots ou "
                         "tourne court. Court, c'est souvent mieux.")

    return {"wpm": wpm, "target": target, "total_seconds": round(total, 2),
            "total_words": sum(r["words"] for r in rows), "beats": rows, "notes": notes}


def render(a, out=sys.stdout):
    head = (f"DÉCOUPAGE  ·  {a['total_words']} mots  ·  ~{a['total_seconds']:.1f}s "
            f"à {a['wpm']:g} mots/min" + (f"  ·  cible {a['target']:g}s" if a["target"] else ""))
    print("\n" + head, file=out)
    print("=" * max(len(head), 72), file=out)
    for r in a["beats"]:
        label = f"{r['label']:<11}" if r["label"] else " " * 11
        print(f"  {tc(r['start'])}  {r['dur']:4.1f}s  {label}{r['text']}", file=out)
        for f in r["flags"]:
            print(f"  {'':>6}  {'':>5}  {'':<11}^ {f}", file=out)
    print("-" * max(len(head), 72), file=out)
    for n in a["notes"]:
        print(f"  - {n}", file=out)
    print("", file=out)


def main():
    ap = argparse.ArgumentParser(description="Minute un script de Reel en découpage.")
    ap.add_argument("input", nargs="?", default="-", help="fichier script, ou - pour l'entrée standard")
    ap.add_argument("--wpm", type=float, default=165, help="vitesse de parole en mots/minute (défaut 165)")
    ap.add_argument("--target", type=float, help="durée cible en secondes")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    a = analyse(raw, wpm=args.wpm, target=args.target)
    if not a:
        print("script vide", file=sys.stderr)
        sys.exit(2)
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        render(a)
    sys.exit(0)


if __name__ == "__main__":
    main()
