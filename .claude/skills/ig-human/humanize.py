#!/usr/bin/env python3
"""
humanize.py - retire l'empreinte machine d'un brouillon en français.

Adapté de instagram-agent-skill (Jake Schincariol, licence MIT) pour le
français. Quatre passes, dans cet ordre :

  1. INVISIBLES   supprime les caractères qu'un clavier ne produit jamais :
                  espaces sans chasse, liants, traits d'union conditionnels,
                  BOM, caractères étiquettes Unicode.
  2. TYPOGRAPHIE  tiret cadratin -> virgule (ou tiret simple en début de
                  ligne), guillemets anglais “ ” -> guillemets français « »,
                  puce -> tiret. L'apostrophe typographique ’, les points de
                  suspension … et le point médian · (écriture inclusive) ne
                  sont PAS touchés : un clavier de téléphone français les
                  produit tout seul.
  3. LEXIQUE      remplace le lexique de slop.json par des mots simples, en
                  gardant les majuscules et sans toucher aux liens. Les
                  entrées dont le remplacement casserait l'accord ou la
                  conjugaison sont seulement signalées.
  4. ESPACES      les espaces insécables légitimes en français (avant ; : ! ?
                  et », après «, avant % et €, séparateur de milliers) sont
                  gardées. Les autres deviennent des espaces normales.
                  --espaces ajouter les insère là où la typographie française
                  les veut ; --espaces supprimer les retire toutes.

Les tics de structure (« ce n'est pas juste X, c'est Y », triades, murs de
hashtags) sont SIGNALÉS, jamais réécrits automatiquement : changer la forme
d'une phrase demande du jugement.

Usage
  python3 humanize.py brouillon.txt
  python3 humanize.py brouillon.txt --report
  python3 humanize.py brouillon.txt -o propre.txt --report
  python3 humanize.py brouillon.txt --espaces ajouter
  python3 humanize.py brouillon.txt --json
"""

import argparse
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(HERE, "slop.json")

URL_RE = re.compile(r"https?://\S+|www\.\S+|\S+@\S+\.\S+")
SENT_RE = re.compile(r"[^.!?\n]+[.!?]*")
APOS = "['’]"
NB = "   "          # insécable, fine insécable, fine
FINE = " "
INSEC = " "
TU = re.compile(r"(?i)(?<!\w)(?:(?:tu|toi|ton|ta|tes)(?!\w)|t['’])")
VOUS = re.compile(r"(?i)(?<!\w)(?:vous|votre|vos)(?!\w)")


def load_lexicon(path=LEX):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def entry_pattern(entry):
    """Compile une entrée du lexique. Partagé avec detect.py."""
    find = entry["find"]
    if entry.get("regex"):
        body = find.replace("'", APOS)
    else:
        body = re.escape(find).replace(r"\ ", r"\s+").replace("'", APOS)
    return re.compile(r"(?<!\w)(?:" + body + r")(?!\w)", re.IGNORECASE)


def _cp(spec):
    if "-" in spec:
        a, b = spec.split("-")
        return (int(a[2:], 16), int(b[2:], 16))
    return int(spec[2:], 16)


def protect_urls(text):
    found = []

    def stash(m):
        found.append(m.group(0))
        return f"\x00URL{len(found) - 1}\x00"

    return URL_RE.sub(stash, text), found


def restore_urls(text, found):
    for i, url in enumerate(found):
        text = text.replace(f"\x00URL{i}\x00", url)
    return text


def pass_invisible(text, lex):
    hits = []
    for entry in lex["invisible"]:
        if entry["action"] == "fr-space":
            continue                      # traité par pass_spaces, à la fin
        cp = _cp(entry["cp"])
        if isinstance(cp, tuple):
            pattern = "[" + re.escape(chr(cp[0])) + "-" + re.escape(chr(cp[1])) + "]"
        else:
            pattern = re.escape(chr(cp))
        n = len(re.findall(pattern, text))
        if n:
            hits.append({"name": entry["cp"] + " " + entry["name"], "count": n,
                         "action": "supprimé" if entry["action"] == "delete" else "espace"})
            text = re.sub(pattern, "" if entry["action"] == "delete" else " ", text)
    stray = [c for c in text if unicodedata.category(c) == "Cf"]
    if stray:
        hits.append({"name": "autres caractères de format invisibles", "count": len(stray),
                     "action": "supprimé"})
        text = "".join(c for c in text if unicodedata.category(c) != "Cf")
    return text, hits


def pass_typographic(text, lex, mode):
    hits = []
    for entry in lex["typographic"]:
        ch = entry["from"]
        n = text.count(ch)
        if not n:
            continue
        hits.append({"name": f"{ch} {entry['name']}", "count": n,
                     "to": entry["to"].strip() or "(espace)"})
        if ch == "—":
            text = re.sub(r"(?m)^([ \t]*)—[ \t]*", r"\1- ", text)   # dialogue, liste
            text = re.sub(r"\s*—\s*", ", ", text)
        elif ch == "–":
            text = re.sub(r"(?m)^([ \t]*)–[ \t]*", r"\1- ", text)
            text = re.sub(r"\s*–\s*(?=\d)", "-", text)
            text = re.sub(r"\s+–\s+", ", ", text)
            text = text.replace("–", "-")
        elif ch == "“":
            sp = " " if mode == "supprimer" else FINE
            text = re.sub(r"“\s*", "«" + sp, text)
        elif ch == "”":
            sp = " " if mode == "supprimer" else FINE
            text = re.sub(r"\s*”", sp + "»", text)
        else:
            text = text.replace(ch, entry["to"])
    text = re.sub(r",[ \t]*([,.])", r"\1", text)
    text = re.sub(r",[ \t]*([;:!?])", r" \1", text)
    text = re.sub(r",[ \t]*\n", "\n", text)
    return text, hits


def _match_case(src, repl):
    if not repl:
        return repl
    if src.isupper() and len(src) > 1:
        return repl.upper()
    if src[0].isupper():
        return repl[0].upper() + repl[1:]
    return repl


def pass_lexical(text, lex):
    """Remplace les mots et expressions. Les plus longs d'abord."""
    hits, flagged = [], []
    curly = text.count("’") > text.count("'")
    entries = sorted(lex["phrases"] + lex["words"], key=lambda e: len(e["find"]), reverse=True)
    for entry in entries:
        pattern = entry_pattern(entry)
        found = pattern.findall(text)
        if not found:
            continue
        if entry.get("replace") is None:
            flagged.append({"find": found[0], "count": len(found), "family": entry["family"]})
            continue
        repl = entry["replace"].replace("'", "’") if curly else entry["replace"]
        hits.append({"find": found[0], "replace": repl or "(supprimé)",
                     "count": len(found), "family": entry["family"]})
        text = pattern.sub(lambda m: _match_case(m.group(0), repl), text)
    # Nettoyage après suppression : une proposition supprimée laisse de la
    # ponctuation orpheline, et ça se lit pire que le slop.
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"(?m)^[ \t]*(?:[,.;:!?]+[ \t]*)+", "", text)
    # « Arrête de scroller ! » supprimé laisse « ! » derrière un point.
    text = re.sub(r"([.!?])[ \t  ]+[!?]+", r"\1", text)
    text = re.sub(r"(?m)^[ \t](?=\S)", "", text)
    text = re.sub(r"[ \t]+([,.])", r"\1", text)          # jamais d'espace avant , et .
    text = re.sub(r",[ \t]*([,.])", r"\1", text)
    text = re.sub(r",[ \t]*([;:!?])", r" \1", text)      # en français on garde l'espace
    text = text.replace("...", "\x00ELL\x00")
    text = re.sub(r"\.\s*\.+", ".", text)
    text = re.sub(r"([!?])\s*\.", r"\1", text)
    text = text.replace("\x00ELL\x00", "...")
    text = re.sub(r"(?m)^[ \t]+$", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r",\s*(aussi|donc|quand même|au final|bref|en gros)\s*,\s*",
                  lambda m: ". " + m.group(1)[0].upper() + m.group(1)[1:] + ", ", text)
    return text, hits, flagged


def _legit(prev, nxt):
    return nxt in ";:!?»%€" or prev == "«" or (prev.isdigit() and nxt.isdigit())


def pass_spaces(text, mode):
    """Espaces insécables : garder les légitimes, retirer les autres."""
    report = {"retirees": 0, "ajoutees": 0, "mode": mode}
    if mode == "supprimer":
        report["retirees"] = sum(text.count(c) for c in NB)
        return re.sub(f"[{NB}]", " ", text), report
    out = []
    for i, c in enumerate(text):
        if c in NB:
            prev = text[i - 1] if i else ""
            nxt = text[i + 1] if i + 1 < len(text) else ""
            if _legit(prev, nxt):
                out.append(FINE if c == " " else c)
            else:
                out.append(" ")
                report["retirees"] += 1
        else:
            out.append(c)
    text = "".join(out)
    if mode == "ajouter":
        for pattern, repl in [
            (r"(?<=[^\s;:!?«(])[   ]*([;!?])", FINE + r"\1"),
            (r"(?<=[^\s;:!?«(])[   ]*:(?=[ \t\n]|$)", INSEC + ":"),
            (r"«[   ]*", "«" + FINE),
            (r"[   ]*»", FINE + "»"),
            (r"(?<=\d)[   ]?([%€])", FINE + r"\1"),
            (r"(?<=\d)[   ](?=\d{3}(?!\d))", FINE),
        ]:
            text = re.sub(pattern, repl, text, flags=re.MULTILINE)
        report["ajoutees"] = sum(text.count(c) for c in NB)
    return text, report


def scan_structures(text, lex):
    flags = []
    for s in lex["structures"]:
        try:
            pattern = re.compile(s["regex"], re.MULTILINE)
        except re.error:
            continue
        found = pattern.findall(text)
        if found:
            flags.append({"id": s["id"], "name": s["name"], "count": len(found), "fix": s["fix"]})
    t, v = len(TU.findall(text)), len(VOUS.findall(text))
    if t and v:
        flags.append({"id": "tu-vous", "name": f"Tutoiement et vouvoiement mélangés ({t} tu / {v} vous)",
                      "count": t + v,
                      "fix": "Choisis l'un des deux et tiens-le. Vérifie quand même : un « vous » "
                             "pluriel adressé à un groupe peut être voulu."})
    lens = [len(s.split()) for s in SENT_RE.findall(text) if len(s.split()) > 2]
    if len(lens) >= 4:
        mean = sum(lens) / len(lens)
        var = sum((n - mean) ** 2 for n in lens) / len(lens)
        cv = (var ** 0.5) / mean if mean else 0
        if cv < 0.35:
            flags.append({"id": "longueur-uniforme",
                          "name": f"Phrases de longueur uniforme (variation {cv:.2f})",
                          "count": len(lens),
                          "fix": "Coupe une phrase en deux. Laisse-en une autre s'étirer. "
                                 "La machine écrit régulier."})
    return flags


def restore_capitals(original, text):
    """Supprimer une ouverture laisse le mot suivant en minuscule.

    On ne corrige que si l'auteur met des majuscules en début de phrase :
    une voix volontairement en minuscules est un style, pas un artefact.
    """
    starts = re.findall(r"(?:^|[.!?]\s+|\n)\s*([^\W\d_])", original)
    if not starts or sum(1 for c in starts if c.isupper()) * 2 < len(starts):
        return text
    return re.sub(r"(?:^|(?<=[.!?] )|(?<=[.!?]\n)|(?<=\n))\s*([^\W\d_])",
                  lambda m: m.group(0)[:-1] + m.group(1).upper(), text)


def humanize(text, lex, mode="garder"):
    raw_for_case = text
    text, urls = protect_urls(text)
    text, inv = pass_invisible(text, lex)
    text, typo = pass_typographic(text, lex, mode)
    text, lexi, flagged = pass_lexical(text, lex)
    text = restore_capitals(raw_for_case, text)
    text, spaces = pass_spaces(text, mode)
    text = restore_urls(text, urls)
    return text.strip() + "\n", {
        "invisible": inv,
        "typographic": typo,
        "lexical": lexi,
        "a_reformuler": flagged,
        "espaces": spaces,
        "structures": scan_structures(text, lex),
    }


def render_report(report, out=sys.stderr):
    def head(title):
        print(f"\n{title}\n" + "-" * len(title), file=out)

    total = sum(h["count"] for h in report["invisible"]) \
        + sum(h["count"] for h in report["typographic"]) \
        + sum(h["count"] for h in report["lexical"]) \
        + report["espaces"]["retirees"]
    head("RAPPORT HUMANIZE")
    print(f"{total} artefacts machine retirés, "
          f"{len(report['a_reformuler'])} mot(s) à reformuler à la main, "
          f"{len(report['structures'])} tic(s) de structure signalé(s)", file=out)
    if report["invisible"]:
        head("1. CARACTÈRES INVISIBLES")
        for h in report["invisible"]:
            print(f"  {h['count']:>3}x  {h['name']}  -> {h['action']}", file=out)
    if report["typographic"]:
        head("2. TYPOGRAPHIE")
        for h in report["typographic"]:
            print(f"  {h['count']:>3}x  {h['name']}  -> {h['to']}", file=out)
    if report["lexical"]:
        head("3. LEXIQUE")
        for h in report["lexical"]:
            print(f"  {h['count']:>3}x  {h['find']}  -> {h['replace']}   [{h['family']}]", file=out)
    if report["a_reformuler"]:
        head("3b. À REFORMULER  (pas remplacé : l'accord ou la conjugaison casserait)")
        for h in report["a_reformuler"]:
            print(f"  {h['count']:>3}x  {h['find']}   [{h['family']}]", file=out)
    s = report["espaces"]
    if s["retirees"] or s["mode"] == "ajouter":
        head("4. ESPACES INSÉCABLES")
        if s["retirees"]:
            print(f"  {s['retirees']:>3}x  insécable hors d'une position française -> espace normale",
                  file=out)
        if s["mode"] == "ajouter":
            print(f"  {s['ajoutees']:>3}   insécables dans le texte final (typographie française)",
                  file=out)
    if report["structures"]:
        head("5. TICS DE STRUCTURE  (pas corrigés automatiquement - réécris-les toi-même)")
        for h in report["structures"]:
            print(f"  {h['count']:>3}x  {h['name']}\n        {h['fix']}", file=out)
    if not (total or report["a_reformuler"] or report["structures"]):
        head("PROPRE")
        print("  Rien à retirer.", file=out)
    print("", file=out)


def main():
    ap = argparse.ArgumentParser(description="Retire l'empreinte machine d'un brouillon en français.")
    ap.add_argument("input", nargs="?", default="-", help="fichier, ou - pour l'entrée standard")
    ap.add_argument("-o", "--out", help="écrire le texte nettoyé ici au lieu de la sortie standard")
    ap.add_argument("--report", action="store_true", help="afficher ce qui a changé (sur stderr)")
    ap.add_argument("--json", action="store_true", help="sortie {text, report} en JSON")
    ap.add_argument("--espaces", choices=["garder", "ajouter", "supprimer"], default="garder",
                    help="espaces insécables : garder les légitimes (défaut), "
                         "ajouter selon la typographie française, ou supprimer toutes")
    ap.add_argument("--lexicon", default=LEX, help="chemin vers slop.json")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    lex = load_lexicon(args.lexicon)
    clean, report = humanize(raw, lex, mode=args.espaces)

    if args.json:
        print(json.dumps({"text": clean, "report": report}, indent=2, ensure_ascii=False))
        return
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(clean)
        print(f"écrit : {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(clean)
    if args.report:
        render_report(report)


if __name__ == "__main__":
    main()
