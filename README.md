# stepped-presentations

A Claude Code skill for building interactive HTML presentations: fixed-canvas decks you
click through, where each key press reveals the next piece and motion loops while you talk
over it.

The decks it produces are a single `index.html` you double-click. No build step, no
framework, no CDN, no network. That constraint exists because these files get opened on a
borrowed laptop, on a guest network, ten minutes before someone speaks, and anything that
can fail to load will eventually fail to load in front of an audience.

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
| `references/house-style.md` | Type, colour, spacing, offline fonts, and how not to look generated |
| `references/verification.md` | The checklist to run in a browser before calling a visual change done |
| `assets/starter.html` | A working canvas and step machine to build a new single-file deck on |
| `scripts/inline_assets.py` | Embeds a deck's images as WebP data URIs so the file travels alone |
| `evals/evals.json` | Four scenarios with assertions: a roadmap from scratch, an animated flow diagram, a misalignment bug, and a vague brief that should be questioned before anything is built |
| `studio/` | The GUI editor, and the write-back engine that parses a deck and edits single literals in place |
| `docs/STUDIO-PLAN.md` | Why the studio is scoped the way it is, what it deliberately does not do, and what is still open |

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

## Evals

`evals/evals.json` holds four prompts with assertions covering a deck built from scratch,
an animated diagram with branches, a debugging pass on an existing file, and a vague brief where
the right first move is a short round of questions.
