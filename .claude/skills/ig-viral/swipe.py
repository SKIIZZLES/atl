#!/usr/bin/env python3
"""
swipe.py - classe les reels collectés selon à quel point ils ont battu leur
propre compte, nomme la formule d'accroche de chacun, et écrit le fichier
d'inspiration (swipe file).

Adapté de instagram-agent-skill (Jake Schincariol, licence MIT) pour le
français.

L'idée : les vues brutes ne prouvent rien. Un compte à 2 000 000 d'abonnés
qui fait 400 000 vues a eu une journée calme. Un compte à 4 000 abonnés qui
fait 400 000 vues a trouvé quelque chose. Le classement se fait sur le
multiple par rapport à la médiane du compte.

Entrée : un fichier séparé par des tabulations, une ligne par reel, avec une
ligne d'en-tête. Les noms de colonnes français ou anglais sont acceptés :

    compte    abonnes   mediane   vues     accroche
    @qqn      48000     11000     412000   personne te dit que tes 30 premiers vont flopper

Usage
  python3 swipe.py collecte.tsv
  python3 swipe.py collecte.tsv --out .claude/instagram/swipe.md
  python3 swipe.py collecte.tsv --json
"""

import argparse
import json
import os
import re
import statistics
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
HOOKS = os.path.join(HERE, "..", "ig-reel", "hooks.json")
WORD_RE = re.compile(r"[\w$€%'’-]+")
COLUMNS = {
    "compte": "account", "account": "account",
    "abonnes": "followers", "abonnés": "followers", "followers": "followers",
    "mediane": "median", "médiane": "median", "median": "median",
    "vues": "views", "views": "views",
    "accroche": "hook", "hook": "hook",
}

try:
    sys.path.insert(0, os.path.join(HERE, "..", "ig-reel"))
    from hookscore import run as score_hook  # noqa: E402
except Exception:
    score_hook = None


def load_formulas(path):
    try:
        d = json.load(open(path, encoding="utf-8"))
    except Exception:
        return None
    by_id = {h["id"]: h for h in d["hooks"]}
    order = d.get("classify_order") or sorted(by_id)
    return [(by_id[i]["id"], by_id[i]["name"], re.compile(by_id[i]["match"], re.IGNORECASE))
            for i in order if i in by_id]


def classify(hook, formulas):
    if not formulas:
        return None, "non classée"
    for fid, name, pattern in formulas:
        if pattern.search(hook):
            return fid, name
    return None, "non classée"


def read_rows(path):
    raw = sys.stdin.read() if path == "-" else open(path, encoding="utf-8").read()
    lines = [l for l in raw.splitlines() if l.strip() and not l.lstrip().startswith("#")]
    if not lines:
        return []
    head = [COLUMNS.get(c.strip().lower(), c.strip().lower()) for c in lines[0].split("\t")]
    if "views" in head and "hook" in head:
        cols, body = head, lines[1:]
    else:
        cols, body = ["account", "followers", "views", "hook"], lines
    rows = []
    for line in body:
        cells = line.split("\t")
        if len(cells) < len(cols):
            cells += [""] * (len(cols) - len(cells))
        r = dict(zip(cols, [c.strip() for c in cells]))
        r["views"] = int(re.sub(r"[^\d]", "", r.get("views", "")) or 0)
        for k in ("followers", "median"):
            digits = re.sub(r"[^\d]", "", r.get(k, "") or "")
            r[k] = int(digits) if digits else None
        if r["views"] and r.get("hook"):
            rows.append(r)
    return rows


def analyse(rows, formulas):
    used_median = any(r.get("median") for r in rows)
    for r in rows:
        base = r.get("median") or r.get("followers") or 0
        r["baseline"] = base
        r["outlier"] = round(r["views"] / base, 2) if base else None
        r["formula_id"], r["formula"] = classify(r["hook"], formulas)
        r["words"] = len(WORD_RE.findall(r["hook"]))
        if score_hook:
            _, overall, verdict, _ = score_hook(r["hook"])
            r["hook_score"], r["hook_verdict"] = round(overall, 1), verdict
        else:
            r["hook_score"], r["hook_verdict"] = None, None
    ranked = sorted(rows, key=lambda r: -(r["outlier"] or 0))
    third = max(1, len(ranked) // 3)
    top, bottom = ranked[:third], ranked[-third:]

    def med(items, key):
        vals = [i[key] for i in items if i.get(key) is not None]
        return round(statistics.median(vals), 1) if vals else None

    counts = {}
    for r in top:
        counts[r["formula"]] = counts.get(r["formula"], 0) + 1
    return {
        "baseline": "médiane du compte" if used_median else "nombre d'abonnés",
        "n": len(ranked),
        "accounts": len({r.get("account", "") for r in ranked}),
        "reels": ranked,
        "top_formulas": sorted(counts.items(), key=lambda kv: -kv[1]),
        "top_hook_score": med(top, "hook_score"),
        "bottom_hook_score": med(bottom, "hook_score"),
        "top_words": med(top, "words"),
        "bottom_words": med(bottom, "words"),
        "unclassified": sum(1 for r in ranked if r["formula"] == "non classée"),
    }


def fmt(n):
    return f"{n:,}".replace(",", " ")


def render(a, out=sys.stdout):
    head = (f"SWIPE FILE  ·  {a['n']} reels  ·  {a['accounts']} comptes  ·  "
            f"référence : {a['baseline']}")
    print("\n" + head, file=out)
    print("=" * max(len(head), 78), file=out)
    for r in a["reels"]:
        mult = f"{r['outlier']:.1f}x" if r["outlier"] else "   ?"
        score = f"{r['hook_score']:.0f}" if r["hook_score"] is not None else " -"
        fid = f"#{r['formula_id']:<2}" if r["formula_id"] else "-  "
        print(f"  {mult:>7}  accroche {score:>3}  {fid} {r['formula'][:22]:<22} "
              f"{r.get('account', '')[:16]:<16} {fmt(r['views']):>11}", file=out)
        print(f"           « {r['hook'][:96]} »", file=out)
    print("-" * max(len(head), 78), file=out)
    print("CE QUI MARCHE DANS CE LOT", file=out)
    if a["top_formulas"]:
        print("  tiers du haut :        " + ", ".join(f"{n} x{c}" for n, c in a["top_formulas"][:4]),
              file=out)
    if a["top_hook_score"] is not None:
        print(f"  note d'accroche médiane : haut {a['top_hook_score']:.0f}  "
              f"contre bas {a['bottom_hook_score']:.0f}", file=out)
    print(f"  longueur médiane :     haut {a['top_words']} mots  contre bas {a['bottom_words']} mots",
          file=out)
    print(f"  non classées :         {a['unclassified']} sur {a['n']}. Lis-les à la main, c'est là "
          "que se cache une formule que tu n'as pas encore.", file=out)
    print("\n  Un lot collecté à la main est un indice, pas une preuve. Douze reels ne montrent "
          "rien ;\n  quarante sur six comptes montrent quelque chose. Collecte plus avant d'y croire.\n",
          file=out)


def to_markdown(a):
    lines = ["# Swipe file", "",
             f"{a['n']} reels sur {a['accounts']} comptes, classés par multiple de la référence ("
             f"{a['baseline']}).", ""]
    for r in a["reels"]:
        mult = f"{r['outlier']:.1f}x" if r["outlier"] else "?"
        lines += [f"## {mult}  {r['formula']}  ({r.get('account', '')})",
                  f"- vues : {fmt(r['views'])}  référence : {fmt(r['baseline'])}",
                  f"- note d'accroche : {r['hook_score']}  mots : {r['words']}",
                  f"- accroche : « {r['hook']} »", ""]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description="Classe des reels collectés par multiple de leur médiane.")
    ap.add_argument("input", nargs="?", default="-", help="fichier TSV, ou - pour l'entrée standard")
    ap.add_argument("--hooks", default=HOOKS, help="chemin vers ig-reel/hooks.json")
    ap.add_argument("--out", help="écrire aussi le swipe file en markdown ici")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    rows = read_rows(args.input)
    if not rows:
        print("aucune ligne exploitable. Il faut un fichier séparé par des tabulations avec au "
              "moins vues et accroche.", file=sys.stderr)
        sys.exit(2)
    formulas = load_formulas(args.hooks)
    a = analyse(rows, formulas)
    if not formulas:
        print("note : hooks.json introuvable, formules non nommées. Passe --hooks.", file=sys.stderr)
    if score_hook is None:
        print("note : hookscore.py non importable, notes d'accroche ignorées.", file=sys.stderr)
    if args.json:
        print(json.dumps(a, indent=2, ensure_ascii=False))
    else:
        render(a)
    if args.out:
        path = os.path.expanduser(args.out)
        if os.path.dirname(path):
            os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w", encoding="utf-8").write(to_markdown(a))
        print(f"écrit : {path}", file=sys.stderr)


if __name__ == "__main__":
    main()
