# Fra skitse til prototype

Workshopdæk på dansk, 16 slides / 57 trin, til to timer med 40–50 studerende i grupper på 3–5.
Excalidraw til skitsering, OpenCode til at bygge én selvstændig `index.html`.

## Kør det

Under udvikling (data, css og js ligger hver for sig):

```bash
python -m http.server 8731
```

Til selve workshoppen og til de studerende — én fil, ingen server, intet internet:

```bash
python bundle.py
```

Den lægger `dist/fra-skitse-til-prototype.html` (~240 KB, fonte inlinet). Dobbeltklik den,
læg den på Absalon, send den i en mail. Den virker på en fremmed maskine uden net.

## Taster

| | |
|---|---|
| `→` `mellemrum` | næste trin |
| `←` | et trin tilbage |
| `↓` `↑` | et helt slide frem eller tilbage |
| `F` | vis hele slidet på én gang |
| `R` | skjul trinnene igen |
| `Home` | tilbage til forsiden |

Faseindikatoren øverst til højre viser fase, klokkeslæt i forløbet og slide-nummer — den er
til lige så meget for de studerende, der selv klikker sig igennem bagefter, som for dig.

## Hvor teksten ligger

Alt hvad der står på skærmen ligger i [`js/data.js`](js/data.js) som almindelige strenge.
Ret ordlyden der — ikke i `engine.js`, som kun tegner. Hvert slide har et `kind`, der bestemmer
layoutet: `title`, `cards`, `steps`, `shot`, `brief`, `prompts`, `timeline`, `curve`, `crazy8`,
`screens`, `loop`.

Tiderne i `clock` er kun tekst. Flytter du på programmet, skal de rettes i hånden — også på
tidslinjen (slide 4), som har sine egne tidspunkter.

## Skærmbillederne

`img/` rummer de to skærmbilleder på slide 5 og 6 — begge hentet 12. september 2026:

- `opencode.webp` — opencode.ai/download, siden de studerende skal hente appen fra
- `excalidraw.webp` — excalidraw.com, tom tavle

Vil du hellere vise selve OpenCode-appen, så tag et billede af dit eget vindue, læg det i
`img/` og ret `shot:` på slidet i `js/data.js`. Kør `python bundle.py` bagefter — den samlede
fil inliner billederne, så de skal ikke sendes med.

## Filer

```
index.html      stilladset: scene, chrome, script-tags
css/fonts.css   selvhostede woff2 (latin-subset), genereret
css/deck.css    layout og udseende
img/            skærmbilleder til slide 5 og 6
js/data.js      ← teksten
js/engine.js    trinmaskine og layout-tegnere
bundle.py       samler det hele til dist/
```
