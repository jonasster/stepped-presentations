# Tre huse, én rolle CDUL-rejsen

Et stepped deck om CDUL's tre organisatoriske flytninger (fakulteterne til IAS PBL til ITS)
og hvad de har gjort ved en digital læringskonsulents opgaver. 27 slides, 117 trin,
beregnet til 15-20 minutter med plads til afbrydelser.

## Kør det

Åbn `dist/tre-huse-en-rolle.html` ved at dobbeltklikke. Én fil, ingen internetforbindelse,
fonte inlinet. Det er den fil du tager med til oplægget.

Under udvikling: kør en lokal server i denne mappe og åbn `index.html`
(`python -m http.server 8742`), ellers blokerer browseren de tre `js`/`css`-filer.

## Taster

| | |
|---|---|
| `→` `mellemrum` | næste trin |
| `←` | forrige trin |
| `↓` `↑` | hop en hel slide |
| `V` | vis hele slidet på én gang |
| `F` | fuldskærm til og fra |
| `D` | lyst eller mørkt tema |
| `R` | nulstil slidet |
| `O` `Esc` | indholdsoversigt, klik for at hoppe direkte til et slide |
| `Home` | tilbage til forsiden |

`core:true` på et slide giver det en prik i oversigten. Prikkerne markerer den korte
rute: de tolv slides der bærer fortællingen, hvis du skal skynde dig.

Decket skriver din plads i adressen mens du klikker, så en genindlæsning lander samme
sted. Skrivningen er forsinket 400 ms, fordi browseren struber history-kald.

Oversigten er der fordi samtalen sjældent følger rækkefølgen: når nogen spørger
"hvad er GIRAF?" midt i noget andet, trykker du `O` og hopper derhen.

Dybt link: `#slide.trin`, fx `#9.5` for opgavelandskabet med alt vist.

## Lys og mørk

Dækket har to temaer. Den lille halve skive øverst til højre skifter, og det samme
gør `D`. Valget huskes i browseren, men dækket starter altid lyst hvis du ikke har
valgt om: en præsentation skal se ens ud hver gang den åbnes, også på en fremmed
maskine der står i mørkt tema.

Alle farver er tokens i toppen af `deck.css`. `--surface`, `--surface-2`, `--face`, `--hairline`
og `--quote` er flader og streger; `--on-accent` er tekst der ligger ovenpå
accentfarven og vendes om i mørkt tema, fordi accenten der er lys. De fire epokefarver
hedder `--c-hum`, `--c-ias`, `--c-its` og `--c-nu`, og et slide eller en spalte får sin
farve ved at bære klassen `acc-hum` og så videre. Skal du tilføje en farve, skal den
sættes begge steder: i `:root` og i `[data-theme="dark"]`.

Begge temaer er målt til WCAG AA (4,5:1 for brødtekst, 3:1 for stor tekst) på tværs af
alle slides.

Forsidens landsby tegnes af `villageAnim()` i `engine.js` i 2:1-isometri. Hvert hus
er tre polygoner (tag, venstre, højre) plus to faste sorte skygger, så den samme
farve giver tre nuancer og huset kan lyse op ved at ændre én `fill`. Markøren tager
husets farve undervejs. Alle forsinkelser skal skrives med `.vil` foran, ellers
nulstiller `animation`-genvejen dem.

## Ret i indholdet

Al tekst bor i `js/data.js`. `SLIDES` er en liste; hvert element har en `kind` der
afgør layoutet. Tilføj en opgave = tilføj et objekt i `cards`, ikke ny HTML.

- `kind:"tasks"` `cards[]` er opgavekortene (`t` titel, `w` modtager, `dl` deadline,
  `l` arbejdsbelastning 1-3), og `steps[]` er pointerne øverst. `c.g` peger på hvilket
  trin kortet dukker op ved.
- `kind:"summary"`, opsamlingssliden. Hvert trin er en blok med `lab`, `t`, `d` og
  valgfri `c` (epokefarve), og `art`, der peger på en af de otte små modeller i
  `sumArt()` i `engine.js`. `end` er linjen nederst, som kommer med den sidste blok.
- `kind:"about"` , præsentationssliden. Hvert trin er en overskrift plus `items[]`.
  Animationen med ur, tastatur, LEGO og server bor i `nerdAnim()` i `engine.js` og
  kører hele tiden, ikke kun på `.on`, fordi den peger på en person og ikke et trin.
- `kind:"facts"` , en række taltavler. Hvert trin er `t` (tallet) og `d` (etiketten).
- `kind:"thread"`, hvert trin har `msgs[]` (beskeder, `who` er "dem" eller "mig")
  plus sin egen pointe. Tråden er en forkortet, anonymiseret gengivelse af en rigtig
  plus sin egen pointe. En besked kan have `quote` (citeret besked), `link` (linkkort),
  `links` (punktliste) og en `t` der enten er en streng eller flere afsnit.
- `kind:"promptdoc"`, `doc.sections[]` er overskrifterne i systemprompten, og hvert
  trin er et citat (`q`, evt. `alt`) med en kommentar.
- `kind:"handover"`, layoutet med to opgaver man kan vælge imellem. Ingen slides
  bruger det lige nu; "Skal vi kigge med?" blev fjernet. Motoren kan det stadig.
- `kind:"micros"` hvert `steps[]`-element er et fakultet med en `items[]`-liste
  af titler. En ny micro = en ny streng i den rigtige liste.
- `kind:"era"` `org` vælger hvilket organisationsdiagram der tegnes (`hum`/`ias`/`its`,
  defineret i `engine.js`).
- `accent` på et slide, eller `c` på et enkelt trin, sætter farven. De tre epokefarver
  står i `C` øverst i `data.js` og går igen på tidslinjen, i sammenligningen og i regnskabet.

Kør `python bundle.py` bagefter for at bygge `dist/` om.

## Ting du selv skal tjekke

- Teams-tråden på slide 22 og 23 er gengivet ord for ord, men underviserens navn er
  taget ud: afsenderen hedder "Underviser, HST" og tiltalen er blevet til "Hej [navn]".
  Dit eget navn står stadig i hendes første besked, siden det er dig der præsenterer.

- SSH-listen under "AAU Micro · under produktion": du nævnte tre, men navngav
  "Musikterapi" og "Generativ AI på uddannelserne i Dansk og Engelsk". Jeg har delt
  det sidste i to (Dansk og Engelsk). Ret i `tema-micro-prod` hvis det er ét forløb.
- Epoke 1's diagram viser fem fakulteter (HUM, SAMF, ENG, TECH, SUND) og epoke 2-3 viser
  fire (SSH, ENG, TECH, SUND), ud fra at HUM og SAMF blev til SSH undervejs. Ret i
  `ORG.hum` / `ORG.ias` i `engine.js` hvis tidspunktet ikke passer.
