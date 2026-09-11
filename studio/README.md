# Stepped Studio

A single page that fine-tunes a deck built with this skill — the words, the order, the
colours, the geometry — and writes the edits straight back into your source file.

It edits one literal at a time and leaves every other byte exactly as it was, so a deck
stays hand-authorable and stays reviewable in a diff. Nothing is injected into the deck:
the preview is your actual file running in an iframe, so what you see is what gets saved.

## Running it

The File System Access API needs a real origin, so open it over localhost rather than
double-clicking the file:

```bash
python -m http.server 5180 --directory studio
```

Then open http://localhost:5180/studio.html and choose **Open deck folder**.
(`npm run serve` does the same thing if you would rather use Node.)

Chrome or Edge. In a browser without the File System Access API the studio still loads a
deck read-only and can hand back an edited copy, but it cannot write in place.

## What it edits

| | |
|---|---|
| Item text | every string field, inline, with the canvas updating as you type |
| Item colour | picker or hex, previewed live |
| Order | drag rows in the outline |
| Geometry | a slider for every top-level numeric `const`, with an off-canvas warning |
| Theme | every colour in the deck's `:root` token block |

Both deck shapes work: a single self-contained `index.html`, or the split multi-file
layout where the content lives in its own `.js`. The studio finds whichever file holds
the content array and edits that one.

Undo is ⌘/Ctrl+Z, save is ⌘/Ctrl+S. If something else writes the file while you have it
open — Claude, your editor — a notice appears and you can reload from disk.

## Building

```bash
npm install
npm run build        # -> studio.html, one self-contained file
```

`src/deckdoc.js` is the engine: it parses the deck with acorn, queues semantic patches,
and resolves them into non-overlapping byte edits in a single commit. `spike/` holds the
phase 0 proof, including the 13 safety properties that guard the write-back.

## Known limits

- In the split multi-file layout the Theme panel is empty, because the `:root` tokens live
  in `index.html` while the edited file is the data `.js`.
- Adding and removing items, speaker notes, images and slide reorder are not here yet.
- The off-canvas warning measures every item revealed at once; it will not catch something
  that only overflows mid-transition.
