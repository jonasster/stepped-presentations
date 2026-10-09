#!/usr/bin/env python3
"""
Give a deck the self-hosted faces its theme names, so it never reaches for a font CDN.

Why this exists: a remote font is the most common way a deck arrives broken on a guest
network, and the fallback face has different metrics, so every width the layout was
measured against is wrong. The skill ships its themes' faces in assets/fonts; this copies
the ones a deck actually uses next to it, or embeds them so the file travels alone.

Which faces: every quoted family name in the deck's :root token block (--display, --sans,
--mono, or anything else). A theme derived from a reference may name a face the skill does
not ship; the script says so, and the deck falls back to the stack's next entry.

    python embed_fonts.py decks/roadmap/index.html             # copy into decks/roadmap/fonts/
    python embed_fonts.py decks/roadmap/index.html --inline    # embed as base64 @font-face
    python embed_fonts.py decks/roadmap/index.html --clear     # back to the <link>

The deck needs either the starter's <link rel="stylesheet" href="fonts/fonts.css">, or a
/*FONTS_START*/ /*FONTS_END*/ pair from an earlier --inline run. Stdlib only.
"""

import argparse, base64, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.normpath(os.path.join(HERE, "..", "assets", "fonts"))
START, END = "/*FONTS_START*/", "/*FONTS_END*/"
LINK = '<link rel="stylesheet" href="fonts/fonts.css">'
LINK_RE = re.compile(r'<link[^>]+href="fonts/fonts\.css"[^>]*>')
BLOCK_RE = re.compile(r"<style>\s*" + re.escape(START) + r".*?" + re.escape(END) + r"\s*</style>", re.S)


def families_in(page):
    root = re.search(r":root\s*\{([^}]*)\}", page)
    if not root:
        sys.exit("no :root token block found: is this a stepped-presentations deck?")
    return set(re.findall(r'"([^"]+)"', root.group(1)))


def faces(fonts_dir):
    css = open(os.path.join(fonts_dir, "fonts.css"), encoding="utf-8").read()
    out = []
    for face in re.findall(r"@font-face\s*\{[^}]*\}", css):
        fam = re.search(r"font-family:\s*'([^']+)'", face).group(1)
        src = re.search(r"url\(([^)]+)\)", face).group(1)
        out.append((fam, src, face))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("page", help="the deck's HTML file")
    ap.add_argument("--inline", action="store_true", help="embed the faces in the page")
    ap.add_argument("--clear", action="store_true",
                    help="remove an inlined block and restore the <link> to fonts/fonts.css")
    ap.add_argument("--fonts-dir", default=FONTS, help="where the shipped faces live")
    a = ap.parse_args()

    page_path = os.path.abspath(a.page)
    if not os.path.isfile(page_path):
        sys.exit("no such file: " + page_path)
    page = open(page_path, encoding="utf-8").read()
    has_link, has_block = bool(LINK_RE.search(page)), bool(BLOCK_RE.search(page))
    if not (has_link or has_block):
        sys.exit("no font hook found. Add this to <head> first:\n  " + LINK)

    if a.clear:
        page = BLOCK_RE.sub(lambda m: LINK, page)
        open(page_path, "w", encoding="utf-8").write(page)
        print("cleared: the deck loads fonts/fonts.css again (run without --clear to copy the files)")
        return

    wanted = families_in(page)
    picked = [f for f in faces(a.fonts_dir) if f[0] in wanted]
    shipped = {f[0] for f in picked}
    # system faces in the stacks are expected to be missing; only flag likely web fonts
    system = {"Arial Narrow", "Segoe UI", "Helvetica Neue", "Times New Roman", "Georgia", "Arial",
              "Consolas", "Menlo", "SFMono-Regular"}
    for fam in sorted(wanted - shipped - system):
        print("  not shipped: %s (the deck will use the next face in its stack)" % fam)
    if not picked:
        sys.exit("none of the deck's faces are in %s" % a.fonts_dir)

    if a.inline:
        rules = []
        for fam, src, face in picked:
            data = open(os.path.join(a.fonts_dir, src), "rb").read()
            uri = "data:font/woff2;base64," + base64.b64encode(data).decode("ascii")
            rules.append(face.replace("url(%s)" % src, "url(%s)" % uri))
            print("  %-34s %5.0f KB" % (src, len(data) / 1024))
        block = "<style>" + START + "\n" + "\n".join(rules) + "\n" + END + "</style>"
        page = BLOCK_RE.sub(lambda m: block, page) if has_block else LINK_RE.sub(lambda m: block, page, 1)
        open(page_path, "w", encoding="utf-8").write(page)
        print("%d faces inlined; %s is now %.0f KB" % (len(picked), os.path.basename(page_path),
                                                   len(page.encode("utf-8")) / 1024))
        return

    out_dir = os.path.join(os.path.dirname(page_path), "fonts")
    os.makedirs(out_dir, exist_ok=True)
    for fam, src, face in picked:
        shutil.copy2(os.path.join(a.fonts_dir, src), os.path.join(out_dir, src))
        print("  copied %s" % src)
    lic = os.path.join(a.fonts_dir, "licenses")
    if os.path.isdir(lic):
        shutil.copytree(lic, os.path.join(out_dir, "licenses"), dirs_exist_ok=True)
    with open(os.path.join(out_dir, "fonts.css"), "w", encoding="utf-8") as f:
        f.write("\n".join(face for _, _, face in picked) + "\n")
    if has_block:
        print("note: the page still has an inlined block; run --clear to switch back to the files")
    print("%d faces in %s" % (len(picked), out_dir))


if __name__ == "__main__":
    main()
