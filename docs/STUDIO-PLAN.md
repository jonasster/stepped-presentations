# Stepped Presentations Studio — exploration plan

A plan for a local GUI that fine-tunes decks produced by this skill. Nothing here is built yet.

## 1 · The thesis

Claude is good at the generative work: choosing the spine, writing the render pass, routing
connectors, tuning easing. It is slow and expensive at the *last mile* — nudging a card 12px,
trying four accent colours, fixing a typo, swapping two slides. Those are high-frequency,
low-semantic-content adjustments where a conversational round-trip costs more than the change.

**The studio owns the last mile. Claude keeps everything upstream of it.**

This is the line that keeps the project from becoming PowerPoint. If a change requires judgement
about what the deck *means*, it belongs in a prompt, not a properties panel.

### Who it is for

1. **You, fine-tuning a deck Claude just built.** Primary.
2. **The person who owns the words** — SKILL.md already asks "who edits it after you". Today the
   answer forces a JS-literate editor or another Claude session. Secondary, and the strongest
   argument for the whole thing.
3. Someone authoring a deck from scratch in a GUI. **Explicit non-goal.**

## 2 · The constraint that shapes everything

The deck's core promise is a double-clickable `index.html` with no build, no framework, no
network. The studio must not weaken that by one inch. So:

> **The studio is an authoring-time tool. It writes source files and then gets out of the way.
> A deck never knows the studio exists at runtime.**

That rules out a document model where the deck is *generated output* from a project database.
The HTML stays the source of truth and stays hand-authorable. The studio is a second editor on
the same file, not a replacement authoring pipeline.

## 3 · The hard part: write-back

Everything else is UI work. This is the risk.

To change text in a GUI and persist it, you must find the right literal in a hand-written file
and rewrite exactly it, leaving formatting, comments and the surrounding code untouched.

**Approach:** parse the inline `<script>` with an AST (acorn), locate the target node, and apply
surgical byte-range edits with `magic-string`. Never re-print the whole program — that would
reformat a file the author (human or Claude) cares about.

**The contract.** Decks opt in by carrying two inert markers, in the same spirit as the existing
`/*ASSETS_START*/` convention in `inline_assets.py`:

```js
/*DECK_START*/
const ITEMS = [ ... ];        // content: editable in the studio
const GEOM  = { X0:340, COL:380, DOTY:540, CARD_TOP:300 };
/*DECK_END*/
```

Plus a `:root` token block in CSS, already house style.

A deck without the markers still opens — read-only preview and present mode. A deck with them is
fully editable. The skill gains one new instruction: emit the markers.

**Binding DOM back to data.** The studio has to know that the card you clicked is `ITEMS[2].name`.
The starter already stamps `data-i` and engine.md already uses `dataset.id`; formalise it as
`data-sp-item="noodle" data-sp-field="name"` written by the render pass. Inert attributes, no
runtime cost, no dependency added to the deck. This is the whole binding mechanism.

**Spike this first, before any UI exists.** Take two real decks, round-trip a text edit, a colour
edit, an array reorder, and a geometry constant. If the diff is a clean one-line change every
time, the project is viable. If it is not, stop and rethink.

### Phase 0 result — done, and it passes

Run on `assets/starter.html`; code in `studio/spike/`. All four edit kinds round-trip, the
result re-parses, the deck still runs (verified in a browser: gaps measured at exactly 420px
after the geometry edit, labels in the new order, console clean), and 13 safety properties hold
— including the two that matter most: **a no-op commit is byte-identical**, and **any edit
followed by its inverse returns the file to the original byte for byte**.

Four things the spike taught that the design above did not anticipate:

1. **Patches must be queued, not applied.** The first draft applied each patch eagerly and a
   reorder silently ate a field edit inside the same element — overlapping byte ranges, no
   error. `commit()` now resolves the whole queue into non-overlapping edits in one pass. Any
   real implementation needs this from the start; it is not an optimisation.
2. **No markers were needed.** The starter carries none, and the engine still found `ITEMS` by
   looking for the first top-level binding holding an array of object literals that all have an
   `id`. Discovery-by-convention works on decks written before the studio existed, which removes
   the §7 "contract drift" risk almost entirely. Markers become a fallback for ambiguous files,
   not a precondition.
3. **The split multi-file shape costs five lines** — a bare `.js` data file is just one script
   at offset 0. Both deck shapes in SKILL.md are covered.
4. **Column alignment drifts.** The starter aligns its data into columns by hand; a longer value
   pushes that row out of line (`name:"Second draft",` against `name:"Third",`). Functionally
   irrelevant, visually untidy in the diff. Either the skill stops emitting hand-aligned data,
   or the studio gets a realignment pass. Worth deciding before phase 1.

One guard the UI will need: a geometry slider can push content off the 1920px canvas with no
error. At `COL = 420` the rightmost card edge sits at 1740px; at 480 it is exactly 1920. The
inspector must check bounds live rather than letting the presenter find out on a projector.

## 4 · Scope

### In

| Capability | Writes to |
|---|---|
| Edit any text field inline, on the real canvas | `ITEMS[i].field` |
| Reorder / add / remove steps | the `ITEMS` array |
| Reorder slides | `<section class="slide">` nodes (see caveat below) |
| Per-item accent colour, with live preview | `ITEMS[i].color` |
| Theme tokens — paper, ink, accent, type scale | `:root` custom properties |
| Nudge geometry constants with a slider | the `GEOM` block |
| Nudge an item that has explicit x/y | `ITEMS[i].x/y` |
| Swap or drop in an image, inline it | `inline_assets.py`, reused as-is |
| Speaker notes per step | a `NOTES` side map (engine.md's side-map pattern) |
| Present mode: fullscreen, notes on a second screen, timer | nothing — read-only |

### Out, deliberately

- **Free-form dragging of anything.** It fights principle 3 (*content is data; the file draws
  it*) and produces decks that no longer have a coherent layout model. The goal is nudging
  *within* the model, not escaping it.
- Connector routing, keyframes, easing curves, new scene types, anything structural. Claude's.
- Creating a deck from nothing.
- Cloud, accounts, sharing, collaboration.

### The slide-reorder caveat

engine.md deliberately uses named indices (`const TITLE=0, STORY=1, TIMELINE=2`) because slide
order changes often. A GUI reorder must rewrite those bindings or it will silently break `next()`
/ `prev()`. Either detect-and-rewrite, or restrict v1 reorder to data-driven steps and leave
slides to Claude. **Recommend the latter for v1.**

## 5 · Shape of the thing

Recommended: **a local CLI that serves an editor shell in the browser.**

```
stepped-studio ./deck/     ->  http://localhost:5173
```

```
+----------+-------------------------------+---------------+
| outline  |  the real deck, in an iframe  |  inspector    |
| slides   |  (not a re-implementation)    |  fields       |
| steps    |  selection overlay on top     |  colour       |
| notes    |                               |  geometry     |
+----------+-------------------------------+---------------+
```

Load order: the server injects `studio-bridge.js` into the iframe copy only. The bridge does
hit-testing, selection, inline editing, and reports **semantic patches** over `postMessage`
(`{op:'setField', item:'noodle', field:'name', value:'...'}`). The server applies patches to
source and pushes a reload. The deck file on disk never contains studio code.

**Why the deck runs in an iframe, unmodified:** the moment the editor re-implements the canvas,
WYSIWYG drifts and you are debugging two renderers. The deck is its own preview.

### Stack

Node + Vite for the shell; Preact or Svelte for the inspector; acorn + magic-string for the
write-back; chokidar to notice Claude editing the same file. Wrap in Tauri later if a
double-clickable app is wanted — the architecture does not change.

### The cheaper v0 worth considering

Skip the server entirely: a single-page editor that uses the **File System Access API** — the
user picks the deck folder, the browser reads and writes files directly. No install, no Node,
ships as a static page. Chromium-only, and asset handling is clunkier. But it reaches a real
round-trip in a fraction of the work, and the write-back engine ports to the CLI unchanged.
**Worth starting here if the spike in §3 is clean.**

## 6 · Phases

| # | Deliverable | Proves |
|---|---|---|
| **0** | ~~Write-back spike, no UI.~~ **Done — passes.** See §3. | The project is possible |
| **1** | ~~Shell + iframe + outline + inline text editing, saving to disk~~ **Done.** | The loop feels good |
| **2** | ~~Colour and theme tokens, live-previewed before commit~~ **Done.** | The highest-value, lowest-risk win |
| **3** | Step reorder **done**; add, remove and speaker notes still open | The deck becomes editable by a non-coder |
| **4** | Geometry sliders **done** (with an off-canvas guard); position nudging and image drop still open | The "fine-tune" promise |
| **5** | Present mode: fullscreen, notes on second screen, timer | A second reason to open it |
| **6** | Claude in the loop: select something, ask for a change, review the diff | The two editors become one workflow |
| **7** | Packaging — Tauri app, or `npx` | Distribution |

Phases 1–3 are the product. 4–7 are optional and independently valuable; stop anywhere.

## 7 · Risks

- **Write-back fidelity.** Mitigated by phase 0 and by never re-printing whole files. A corrupted
  deck the night before a talk is the failure that ends the project's credibility.
- **Two editors, one file.** Studio and Claude will both write. Watch the file, reload on external
  change, refuse to write over a dirty buffer, and snapshot to git before every write.
- ~~**Contract drift.**~~ Largely retired by the phase 0 result: discovery-by-convention found
  the data in an unmarked deck. What remains is the *binding* half — `data-sp-item` /
  `data-sp-field` attributes on rendered nodes, needed for click-to-select. Without them the
  studio still works from the outline panel; it just cannot select on the canvas.
- **Verification discipline.** SKILL.md is emphatic that geometry is verified in a browser, never
  reasoned about. The studio actually *strengthens* this — every edit is made in the running
  scene. Worth stating; it is the strongest argument for direct manipulation here.
- **Scope creep toward a slide editor.** The §4 non-goals are load-bearing. Revisit them whenever
  a feature feels obvious.

## 8 · Decisions to make before phase 0

1. **v0 shape** — File System Access single page, or Node CLI from the start?
2. **Binding attributes now or later** — add `data-sp-item` / `data-sp-field` to SKILL.md's
   render conventions so future decks support click-to-select? (Markers are no longer needed.)
3. **Repo layout** — same repo (the skill and its tool travel together, one clone) or a separate
   one (the skill stays a clean, dependency-free skill)?
4. **Is present mode actually the hook?** It may be worth more per unit of effort than editing,
   and it needs none of §3.
5. **Hand-aligned data** — keep it and add a realignment pass, or stop emitting it?
6. **Does the studio work as a published artifact?** It builds to `studio.artifact.html` and one
   is published, but whether the artifact sandbox permits the File System Access API is
   untested — opening it answers the question in a second. If it does, there is a no-server
   option; if not, localhost stays the only way to save in place.
