---
name: stepped-presentations
description: Build interactive, animated HTML presentations — fixed-canvas decks you click through, where each press reveals the next piece and motion loops while you talk over it. Use this whenever someone wants a presentation, slide deck, talk, walkthrough, interactive timeline, animated diagram, learning journey, roadmap or portfolio showcase — anything they will "click through", "present", "show the team", or put on a projector. It applies when they say slides, deck, keynote, storyboard, journey, or ask to turn a Figma frame, a timeline, or a document into something presentable. Use it just as much for editing an existing deck of this kind: adding a slide or scene, changing a stepped reveal, fixing connector routing, adjusting looping animation, embedding screenshots, or making a deck work offline. Prefer it over reveal.js, PowerPoint export, or a React slide library — these decks are zero-dependency HTML that runs from a double-click.
---

# Stepped presentations

A stepped presentation is not a document that scrolls. It is **a fixed-size scene driven by a
single step index**, where the presenter advances one beat at a time and the picture does the
explaining. Everything below follows from that one idea.

These decks run from a double-clicked `index.html`: no build, no framework, no CDN, no network.
That constraint is not nostalgia. You are handing something to a person who will open it on a
strange laptop, in a room with bad wifi, ten minutes before they speak. Anything that can fail
to load will eventually fail to load in front of an audience.

## The five things that make it work

**1 · One logical canvas, scaled once.** Author at a fixed pixel size — 1920×1080 or 1600×900 —
and scale the whole stage to the viewport at the end:

```css
#stage{ width:1920px; height:1080px; position:absolute; left:50%; top:50%;
        transform-origin:center; }
```
```js
const k = Math.min(innerWidth/1920, innerHeight/1080);
stage.style.transform = `translate(-50%,-50%) scale(${k})`;
```

Never write responsive CSS inside the scene. Because the coordinate space is fixed, you can
position everything absolutely and trust your numbers, and any measurement you take stays valid.
`translate(-50%,-50%)` is load-bearing: a scaled element still occupies its *unscaled* footprint
in layout, so centring it any other way breaks the moment the window is smaller than the canvas.

**2 · A single step index owns all state, and `applyStep(n)` is idempotent.** Derive the entire
scene from `n` every time rather than mutating forward:

```js
function applyStep(n){
  step = Math.max(-1, Math.min(n, STEPS.length - 1));
  STEPS.forEach((s, i) => el(s).classList.toggle('on', i <= step));
  // …everything else also derived from `step`
}
```

Write it this way and `←` costs nothing, jumping to any step works, and a deep link lands
correctly. Write it incrementally and you will spend the rest of the project fixing backwards
navigation.

**3 · Content is data; the file draws it.** Keep what is *said* in arrays and objects, and let
one render function turn them into DOM. Adding a project, a step or a scene should be adding an
entry — never editing markup. When you catch yourself typing a sentence of the presentation's
prose into the engine, you are in the wrong place.

**4 · Only the active step moves.** Ambient loops run on `.on` elements only:

```css
.knot.on::after{ animation: halo 4s ease-in-out infinite; }
```

This keeps the CPU quiet on a laptop driving a projector, and — more importantly — it means
motion always points at what you are talking about right now. Motion is meaning. Before adding
any, be able to say in one sentence what it teaches. If you cannot, it is decoration and it
competes with the speaker.

**5 · Geometry is verified in the browser, never reasoned about.** Coordinates, curve control
points, label collisions and font metrics interact in ways that are not visible in a diff. A
change that reads correctly is not evidence. Open it, measure it, look at it. See
`references/verification.md` — this is the single biggest source of wasted rounds.

## Choosing the shape

| | Single self-contained file | Multi-file with data/engine split |
|---|---|---|
| Good for | Short decks, talks you carry around, anything emailed or on a USB stick | Content-heavy walkthroughs, 20+ steps, long prose, several people editing |
| Structure | One `index.html`, assets inlined as data URIs | `index.html` + `css/` + `js/engine.js` + `js/data-*.js` |
| Cost | Unwieldy past ~1500 lines; images must be re-inlined after every change | Needs a local static server; more moving parts |

Rule of thumb: **if the content would be more than about 40% of the file, split it.** A deck
whose prose lives in data files stays editable by someone who does not read JavaScript, which is
usually the person who owns the words.

Both shapes use the same engine ideas. Start single-file; splitting later is mechanical.

## House style

The default look, unless the project says otherwise. `references/house-style.md` has the full
token set and the reasoning.

- **Barlow Condensed ExtraBold (800)** for display type, set uppercase. **Geist** for prose and
  body. **Geist Mono** (500 body, 700 emphasis) for metadata, labels, counters, domains, months
  — anything that is data rather than sentence.
- Flat surfaces. No gradient meshes, no glow, no shadow except where it separates a real layer.
  Hover is an underline or a border, never a lift.
- Colour carries identity, not decoration. Give each subject one accent and use it in **two
  places** — its marker and its link — rather than tinting everything it touches.
- Self-host the fonts as `woff2` in the repo. Google Fonts is one more thing that fails on a
  guest network, and the fallback metrics will reflow the whole scene.

## Build order

1. **Establish the canvas and the step machine first**, with placeholder boxes. Get `→`/`←`
   walking end to end before any content or styling exists. Every later problem is easier to see
   against a working skeleton.
2. **Lay out the geometry as data** — positions, tiers, months, whatever the scene's axis is —
   and derive the DOM from it.
3. **Add the content**, still unstyled.
4. **Style it**, then **add motion last**. Motion added early hides layout bugs.
5. **Verify** against `references/verification.md`, then report with evidence.

When rebuilding an existing design (a Figma frame, a reference image), measure it rather than
approximating: read off the real spacings and sizes and put them in named constants. Reproducing
a design by eye converges slowly and regresses every time you touch it.

## Reading the rest

Load these when the task needs them, not upfront:

| File | Read it when |
|---|---|
| `references/engine.md` | Building or changing the stage, step machine, camera, reveal, or the data→DOM render |
| `references/motion.md` | Adding or fixing looping animation, travelling pulses, connectors between things, or reduced-motion support |
| `references/house-style.md` | Choosing type, colour, spacing — or deciding whether something looks generic |
| `references/verification.md` | Before reporting any visual change as done |
| `scripts/inline_assets.py` | Making a deck self-contained — embeds images as WebP data URIs |
| `assets/starter.html` | Starting a new single-file deck; a working canvas + step machine to build on |

## Two habits worth keeping

**Report with evidence.** Say what you checked and what you measured. "Both gaps are now 47px"
is worth more than "fixed the spacing", and it is the only way the person reviewing can tell a
real fix from a plausible one.

**Do not silently redesign.** These decks belong to someone who will stand up and present them.
Fix what was asked, flag what you noticed, and let them decide. Rewording a line you were not
asked to touch is not a bonus.
