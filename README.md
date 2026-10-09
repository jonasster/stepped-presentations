# stepped-presentations

A Claude Code skill for building interactive HTML presentations: fixed-canvas decks you
click through, where each key press reveals the next piece and motion loops while you talk
over it.

The decks it produces are a single `index.html` you double-click. No build step, no
framework, no CDN, no network. That constraint exists because these files get opened on a
borrowed laptop, on a guest network, ten minutes before someone speaks, and anything that
can fail to load will eventually fail to load in front of an audience.

**See it working:** [jonasster.github.io/stepped-presentations](https://jonasster.github.io/stepped-presentations/)
has four live example decks, the style gallery, and how to use it.

## Installing

Clone into your skills directory:

```bash
git clone https://github.com/jonasster/stepped-presentations ~/.claude/skills/stepped-presentations
```

Claude picks it up on the next session. The skill also loads on its own when you ask for a
deck, slides, a talk, a walkthrough, an animated diagram, a roadmap, or anything you say
you want to "click through" or "show the team".

## Using it

Describe the deck you want and let the skill do the rest:

> Build me something I can click through for the 2026 roadmap. Six milestones across the
> year, appearing one at a time as I talk. Has to run off my laptop, the meeting room wifi
> is terrible.

It works the same way on a deck that already exists: adding a slide, changing a reveal,
fixing a connector that runs through a label, embedding screenshots, making a deck
self-contained before you email it.

## Themes and motion

Every deck has a theme (how it looks) and a motion style (how it moves), picked separately.

| Themes | | Motion styles | |
|---|---|---|---|
| **House** | condensed caps, mono for data, cool paper | **Calm** | soft fades, a small rise |
| **Editorial** | serif display, warm paper, sentence case | **Crisp** | fast wipes, no bounce |
| **Swiss** | black, white, one red, square corners | **Playful** | cards pop out of their marker |
| **Midnight** | a dark stage with a warm accent | **Drawn** | lines draw on, titles type in |

Or hand it a link, an image, a brand PDF or a path into a repo, and it derives a theme from
that. It checks the contrast, says which colours it had to adjust, and saves the result to
`themes/local/` (gitignored) so you can reuse it.

To pick by looking, open `assets/gallery.html`. It plays the same scene in every combination
and tells you what to ask for.

Both are plain CSS custom properties in the deck's one `:root` block, so the studio can tune
any of them afterwards.

## Presenting

Every deck built on the starter comes with:

- **Speaker notes**, kept in the data next to the thing they describe
- **A presenter view** (`P`): a second window with the notes, a preview of the next step, a
  timer and a step count. Drive it from either window and both follow.
- **PDF export** (`Shift+P`): one page per step at the canvas size, with transitions off so
  nothing prints halfway through a reveal. If the deck has notes, the handout version puts
  them under each slide.

## How it starts

A deck is something a person stands up beside, so the skill settles the brief before it writes
any HTML. It reads the request for how much room you want in the process and works one of two
ways.

One-shot is the default when the brief already stands up on its own: a date, the content, and
somewhere it has to run. It asks at most three questions, or none, then builds the whole thing
and lists back the decisions it made for you so you can overturn them.

Workshop is for when the content is not written yet, there is a brand to honour, or you have
opinions about the look. It asks around five questions in one batch, each with a default
attached, then stops at four checkpoints: the walking skeleton, the layout, the words, and the
finished deck. Every stop sits at a seam in the build order, so backing out of a decision does
not cost you the work that came after it.

Editing a deck you already have skips all of this.

## Fine-tuning in a GUI

Some changes are not worth a conversation. Nudging a card twelve pixels, trying four
accent colours, fixing a typo, swapping two slides — asking for those and waiting costs
more than the change is worth. `studio/` is a small editor for exactly that work.

Open a deck folder and you get the outline on one side, your actual deck running on the
other, and an inspector for whatever you select. Text, item colours, order, the geometry
constants and the theme tokens are all editable, and the result is written back into your
source file one literal at a time — every other byte stays as it was, so the file stays
hand-authorable and the change stays readable in a diff. Nothing is injected into the deck:
the preview is the bytes that will be saved.

```bash
python -m http.server 5180 --directory studio
```

Then open http://localhost:5180/studio.html. It needs Chrome or Edge, and it needs to be
served rather than double-clicked, because the File System Access API does not work from a
`file://` page. `studio/README.md` covers the rest, including what it does not do yet.

Everything above the last mile stays with Claude. The spine of a deck, the render pass,
connector routing and easing are decisions about what the deck means, and those belong in a
prompt rather than a properties panel.

## What's here

| Path | What it holds |
|---|---|
| `SKILL.md` | The entry point Claude reads first: the five ideas the format rests on, how it settles the brief before building, single-file vs split, build order |
| `references/engine.md` | The stage, the step machine, camera, deep links, data to DOM |
| `references/motion.md` | Reveals, ambient loops, travelling pulses, connectors, reduced motion |
| `references/themes.md` | The themes and motion styles, when to use each, the token schema, and deriving a theme from a reference |
| `references/house-style.md` | The rules every theme keeps: type roles, colour use, contrast, offline fonts, and how not to look generated |
| `references/presenting.md` | Speaker notes, the presenter view, PDF and handouts, and how to add them to an older deck |
| `references/verification.md` | The checklist to run in a browser before calling a visual change done |
| `assets/starter.html` | A working deck to build on: canvas, step machine, theme and motion tokens, notes, presenter view, print |
| `assets/gallery.html` | Every theme with every motion style, on one sample scene |
| `examples/` | Four finished decks built with the skill, one per common shape: a roadmap, a flow diagram, a decision, and a journey with a camera. Each is one self-contained file |
| `index.html` | The landing page, served by GitHub Pages from the repo root (`.nojekyll` keeps Pages from processing it) |
| `assets/themes/`, `assets/motion/` | One token block per theme and per motion style |
| `assets/fonts/` | The self-hosted faces for all four themes (latin subset), with their OFL licences |
| `scripts/embed_fonts.py` | Copies the faces a deck's theme uses next to it, or `--inline` embeds them |
| `scripts/inline_assets.py` | Embeds a deck's images as WebP data URIs so the file travels alone |
| `evals/evals.json` | Seven scenarios with assertions: a roadmap from scratch, an animated flow diagram, a misalignment bug, a vague brief that should be questioned first, a named theme and motion, a theme matched to a design system, and adding notes and a PDF to an existing deck. Input files are in `evals/inputs/` |
| `studio/` | The GUI editor, and the write-back engine that parses a deck and edits single literals in place |
| `docs/STUDIO-PLAN.md` | Why the studio is scoped the way it is, what it deliberately does not do, and what is still open |
| `docs/copilot-agent-instructions.md` | The same rules condensed into agent instructions for GitHub Copilot, for when Claude Code is not available |

Decks you build while working in this repo go in `decks/`, which is gitignored, so your own
presentations stay on your machine.

The reference files are loaded on demand rather than upfront, so a small edit does not drag
in the whole manual.

## The shape of a deck

Everything in the skill follows from one idea: the scene is a fixed pixel canvas driven by
a single step index.

The canvas is authored at 1920x1080 and scaled to the viewport once, at the end, so you can
position everything absolutely and trust your numbers. Nothing inside the scene is
responsive.

State lives in one integer. `applyStep(n)` derives the whole scene from it every time
instead of mutating forward, which is what makes the left arrow, a jump to any step, and a
deep link all work without extra code.

Content lives in arrays and one render function turns it into DOM, so adding a milestone is
adding an entry rather than editing markup. Only the current step animates, which keeps the
laptop quiet and points the motion at whatever the presenter is saying right now.

Geometry gets checked in a browser. Coordinates, curve control points and font metrics
interact in ways a diff will not show you, and a screenshot of a half-drawn scene still
looks plausible.

## inline_assets.py

Needs Pillow. Put the two markers in the page and route image paths through the map:

```js
const ASSETS = {
/*ASSETS_START*/
/*ASSETS_END*/
};
const src = path => ASSETS[path] || path;
```

Then:

```bash
python scripts/inline_assets.py index.html --dirs shots assets
```

With the block empty the deck loads images from disk, which is easier while you iterate.
Once filled, the file runs from a USB stick or an email attachment. Re-run it after
changing any image, and use `--clear` to go back to loading from disk.

## embed_fonts.py

Stdlib only. Reads the font families named in a deck's `:root` and gives the deck those faces
from `assets/fonts/`:

```bash
python scripts/embed_fonts.py decks/roadmap/index.html            # copies them into decks/roadmap/fonts/
python scripts/embed_fonts.py decks/roadmap/index.html --inline   # embeds them; the file travels alone
python scripts/embed_fonts.py decks/roadmap/index.html --clear    # back to the fonts/ folder
```

Run it again after switching themes.

## Evals

`evals/evals.json` holds seven prompts with assertions: a deck built from scratch, an animated
diagram with branches, a debugging pass on an existing file, a vague brief where the right first
move is a short round of questions, a deck with a named theme and motion style, a theme derived
from a design system's tokens, and adding notes, a presenter view and a PDF to an existing deck.
The files the prompts refer to are in `evals/inputs/`.

## License

MIT. See `LICENSE`.
