#!/usr/bin/env python3
"""
Embed a deck's images into its HTML as WebP data URIs, so the file runs from any
folder, a USB stick, or an email attachment with nothing beside it.

Why this exists: a deck that loads images by relative path breaks the moment it is
moved, opened through a preview that rewrites the page to a data: URL, or copied
without its folder. Those failures all happen at presentation time.

Setup — put these two markers in the page, and route image paths through the map:

    const ASSETS = {
    /*ASSETS_START*/
    /*ASSETS_END*/
    };
    const src = path => ASSETS[path] || path;   // falls back to the file on disk

Then reference images as `src("shots/noodle.png")`. With the block empty the deck
loads from disk (convenient while iterating); once filled it is self-contained.
Re-run after changing any image.

    python inline_assets.py index.html --dirs shots assets
    python inline_assets.py deck.html --dirs img --max-width 2000 --quality 88
    python inline_assets.py index.html --dirs shots --clear   # back to loading from disk

Requires Pillow.
"""

import argparse, base64, io, os, re, sys

START, END = "/*ASSETS_START*/", "/*ASSETS_END*/"
EXTS = (".png", ".jpg", ".jpeg", ".webp")


def encode(path, max_width, quality):
    """WebP, downscaled to max_width. Pixel art is resampled nearest-neighbour and
    capped lower, because smooth resampling turns the blocks to mush."""
    from PIL import Image

    im = Image.open(path)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")

    pixel = "pixel" in os.path.basename(path).lower()
    cap = min(900, max_width) if pixel else max_width
    if im.width > cap:
        im = im.resize((cap, round(im.height * cap / im.width)),
                       Image.NEAREST if pixel else Image.LANCZOS)

    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=95 if pixel else quality, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def collect(root, dirs):
    out = []
    for d in dirs:
        base = os.path.join(root, d)
        if not os.path.isdir(base):
            print("  (skipping %s — not a directory)" % d)
            continue
        for cur, _, files in os.walk(base):
            for f in files:
                if f.lower().endswith(EXTS):
                    rel = os.path.relpath(os.path.join(cur, f), root).replace("\\", "/")
                    out.append(rel)
    return sorted(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("page", help="the HTML file to write into")
    ap.add_argument("--dirs", nargs="+", default=["assets"],
                    help="image folders, relative to the page (default: assets)")
    ap.add_argument("--max-width", type=int, default=1600,
                    help="downscale wider images (default: 1600)")
    ap.add_argument("--quality", type=int, default=82, help="WebP quality (default: 82)")
    ap.add_argument("--clear", action="store_true",
                    help="empty the block instead, so the deck loads from disk again")
    a = ap.parse_args()

    page_path = os.path.abspath(a.page)
    if not os.path.isfile(page_path):
        sys.exit("no such file: " + page_path)
    root = os.path.dirname(page_path)

    page = open(page_path, encoding="utf-8").read()
    if START not in page or END not in page:
        sys.exit("markers not found — add %s / %s inside the ASSETS object first "
                 "(see the docstring at the top of this script)" % (START, END))

    if a.clear:
        page = re.sub(re.escape(START) + r".*?" + re.escape(END),
                      lambda m: START + END, page, flags=re.S)
        open(page_path, "w", encoding="utf-8").write(page)
        print("cleared — the deck now loads images from disk")
        return

    names = collect(root, a.dirs)
    if not names:
        sys.exit("no images found in: " + ", ".join(a.dirs))

    lines, before, after = [], 0, 0
    for n in names:
        src = os.path.join(root, n.replace("/", os.sep))
        uri = encode(src, a.max_width, a.quality)
        before += os.path.getsize(src)
        after += len(uri)
        lines.append('  "%s": "%s",' % (n, uri))
        print("  %-38s %6.0f KB -> %6.0f KB" % (n, os.path.getsize(src) / 1024, len(uri) / 1024))

    block = START + "\n" + "\n".join(lines) + "\n" + END
    page = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda m: block, page, flags=re.S)
    open(page_path, "w", encoding="utf-8").write(page)

    print("\n%d images inlined  (%.1f MB source -> %.1f MB base64)"
          % (len(names), before / 1048576, after / 1048576))
    print("%s is now %.1f MB" % (os.path.basename(page_path),
                                 len(page.encode("utf-8")) / 1048576))
    if len(page.encode("utf-8")) > 8 * 1048576:
        print("\nThat is large for a single file. Consider --max-width 1200 or "
              "--quality 70, or leaving the biggest images on disk.")


if __name__ == "__main__":
    main()
