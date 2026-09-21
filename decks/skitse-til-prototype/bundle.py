"""Saml dækket til én fil: dist/fra-skitse-til-prototype.html

Fonte bliver til data-URI'er, CSS og JS bliver inlinet. Resultatet er én HTML-fil
der kan dobbeltklikkes, mailes rundt og køre uden internet. Kør: python bundle.py
"""
import base64, pathlib, re

HERE = pathlib.Path(__file__).parent
OUT  = HERE / "dist" / "fra-skitse-til-prototype.html"

def read(p):
    return (HERE / p).read_text(encoding="utf-8")

def inline_fonts(css):
    def sub(m):
        f = (HERE / "css" / m.group(1)).resolve()
        b64 = base64.b64encode(f.read_bytes()).decode()
        return "url(data:font/woff2;base64," + b64 + ")"
    return re.sub(r"url\('([^']+\.woff2)'\)", sub, css)

def inline_images(js):
    """img/foo.webp -> data-URI, saa den samlede fil ikke har brug for mappen"""
    def sub(m):
        f = HERE / m.group(1)
        mime = "image/webp" if f.suffix == ".webp" else "image/png"
        b64 = base64.b64encode(f.read_bytes()).decode()
        return '"data:' + mime + ";base64," + b64 + '"'
    return re.sub(r'"(img/[^"]+[.](?:webp|png))"', sub, js)

html = read("index.html")
css  = inline_fonts(read("css/fonts.css")) + "\n" + read("css/deck.css")
js   = inline_images(read("js/data.js")) + "\n" + read("js/engine.js")

LINKS   = re.compile(r'<link rel="stylesheet" href="css/fonts\.css">\s*\n\s*'
                     r'<link rel="stylesheet" href="css/deck\.css">')
SCRIPTS = re.compile(r'<script src="js/data\.js"></script>\s*\n\s*'
                     r'<script src="js/engine\.js"></script>')

# lambda som erstatning: ellers ville \d og \s i koden blive tolket som regex-escapes
html = LINKS.sub(lambda _: "<style>\n" + css + "\n</style>", html)
html = SCRIPTS.sub(lambda _: "<script>\n" + js + "\n</script>", html)

assert "css/deck.css" not in html and "js/engine.js" not in html, "inlining slog fejl"
assert '"img/' not in html, "billeder blev ikke inlinet"

OUT.parent.mkdir(exist_ok=True)
OUT.write_text(html, encoding="utf-8")
print(f"{OUT}  —  {OUT.stat().st_size / 1024:.0f} KB")
