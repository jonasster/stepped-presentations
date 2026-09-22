"""Inline every stylesheet and script into one index-standalone.html.

The multi-file deck already runs from a double-clicked index.html, but a single
file is what survives being emailed, dropped on a USB stick, or opened through
a viewer that rewrites the page to a data: URL. Re-run after editing anything.
"""
import re, pathlib
here = pathlib.Path(__file__).parent
html = (here / 'index.html').read_text(encoding='utf8')

def css(m):
    return '<style>\n' + (here / m.group(1)).read_text(encoding='utf8') + '\n</style>'

def js(m):
    return '<script>\n' + (here / m.group(1)).read_text(encoding='utf8') + '\n</script>'

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)
out = here / 'index-standalone.html'
out.write_text(html, encoding='utf8')
print(out.name, f'{out.stat().st_size/1024:.0f} KB')
