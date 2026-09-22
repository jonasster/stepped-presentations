# Generative AI, explained

A self-guided stepped deck: 188 steps across 8 chapters, from what a neural network is to
what an agent does when nobody is watching. Written for a mixed audience — no maths, no code,
every term defined the first time it appears.

Two builds of the same deck:

| File | Use it for |
|---|---|
| `index.html` | Editing. Content lives in `js/data-*.js`, so the words are editable by someone who does not read JavaScript. |
| `index-standalone.html` | Sending. One 226 KB file, fonts included, nothing external. Rebuild with `python build-standalone.py` after any edit. |

## Moving through it

`→` / `space` / click forward · `←` back · `M` contents · `Home` / `End` · `Esc` closes the menu.
The address bar tracks the current step (`#moe/3`), so any step can be bookmarked or sent to
someone directly.

## Editing the words

Everything on screen comes from the five data files. Adding a scene is adding an entry — you
should never need to touch `engine.js` or the renderers.

- `data-01-foundations.js` — chapters 1–2, plus the cover and the chapter list
- `data-02-inside.js` — chapters 3–4
- `data-03-history.js` — chapters 5–6, including the timeline
- `data-04-around.js` — chapter 7
- `data-05-limits.js` — chapter 8 and the recap

Each scene names a `type`, which picks a renderer:

| Type | What it draws | Steps |
|---|---|---|
| `cover`, `chapter` | Title cards | 1 |
| `points` | Headline plus numbered rows | 1 per point + 1 |
| `columns` | 2–4 comparison cards | 1 per column + 1 |
| `flow` | A chain of boxes, optionally looping back | 1 per node + 1 (+1 for the loop) |
| `bars` | A labelled quantity per row | 1 per bar + 1 |
| `nest` | Concentric boxes — one thing inside another | 1 per ring + 1 |
| `network` | The neural-network diagram | 1 per note + 1 |
| `tokens` | Text splitting into tokens and IDs | 1 per note + 1 |
| `scatter` | Embedding space | 1 per group + 1 (+1 for the arrows) |
| `window` | The context window and what falls out of it | 1 per note + 1 |
| `trace` | A reasoning model's scratchpad | 1 per line + 3 |
| `moe` | Router and experts | 1 per note + 1 |
| `timeline` | The panned timeline | 1 per event + 1 |
| `recap` | The closing grid | 2 |

A scene's `foot` is its "so what" line — it lands on the last step of that scene only.

## What is deliberate

- **The timeline ends at September 2026** and says so. The last few entries are the ones most
  likely to date; check them before presenting.
- **The MoE expert boxes are labelled vaguely on purpose.** Real experts do not map to human
  topics, and the footnote says so — please do not "improve" them into `French` and `Maths`.
- **Under `prefers-reduced-motion` the deck still steps.** Usually a stepped deck should render
  complete for reduced-motion readers, but here the stepping *is* the reading experience, so
  animations stop and transitions go to zero while the reveal order stays.

## Verified

- 188 steps, 42 scenes, clean console.
- Nothing crosses the canvas edge or the footnote band on any step (measured, transitions off).
- Walking backwards produces DOM identical to walking forwards, at every step; applying a step
  twice is a no-op. The timeline camera is replayed from step 0 rather than carried, so it lands
  in the same place in both directions.
- Every accent clears 4.5:1 against the canvas both as text and as a fill; `--ink-3` clears it on
  all three surfaces it is used on.
- Deep links resolve on load; the small-screen notice appears below 620×380.

Not verified: opening `index.html` directly off the filesystem. The preview used to build this
rewrites `file://` pages into a sanitised `data:` URL, so it cannot load one. Both builds were
verified over HTTP; the standalone file has no external references at all.
