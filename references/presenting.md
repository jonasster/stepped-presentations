# Presenting — notes, presenter view, PDF

Read this when someone wants speaker notes, a presenter screen, a timer, or a PDF or handout
of a deck. `assets/starter.html` has all of it built in; this explains how it works and how to
add it to a deck that was not built on the starter.

## Contents

- [The sequence](#the-sequence)
- [Speaker notes](#speaker-notes)
- [Presenter view](#presenter-view)
- [PDF and handouts](#pdf-and-handouts)
- [Adding it to an existing deck](#adding-it-to-an-existing-deck)

## The sequence

Everything here speaks in **positions**: one entry per press of `→`, across the whole deck,
in presenting order. The starter builds that list once:

```js
const SEQ = [{ slide:0, step:-1, notes:TITLE_NOTES }];
for (let k = reduced ? ITEMS.length - 1 : -1; k < ITEMS.length; k++)
  SEQ.push({ slide:SCENE, step:k, notes: k < 0 ? "" : ITEMS[k].notes });
```

and shows any one of them with `show(i)`, which derives the slide and the step from the entry.
It is the same idea as `applyStep(n)` one level up: one number owns the state, so `←`, a deep
link (`#4`), the presenter view and print all work without special cases. Stepping back into a
slide lands on its last position, fully revealed, for free.

Under reduced motion the scene contributes only its finished position, so the presenter
still walks the deck one slide at a time.

## Speaker notes

Notes are content, so they live in the data next to what they describe:

```js
{ id:"two", label:"March", name:"Second", desc:"…", color:"var(--c2)",
  notes:"The pilot. Mention that it ran two weeks over, and why that was fine." },
```

Write them as prompts, not a script: what to say, in the order to say it, and the one number
someone will ask about. A paragraph of prose in the notes gets read aloud, and an audience can
tell. If you are writing the deck's words, write the notes too and agree them in the same plain
text pass. If they are not yours, leave `notes:""` and say the field is there.

## Presenter view

`P` (or the presenter button) opens the same file in a second window with `?presenter`. That
window shows:

- **Now**, the audience's current position
- **Next**, the position after it, dimmed at the end of the deck
- **Notes** for the current position
- **Elapsed time** (click to restart), the clock, and `3 / 12`

Drive it from either window. Each `show(i)` posts `{deck:'show', at}` to the other, and the
receiver calls `show(i, true)`, where the `true` stops the echo. The previews are iframes of the
same file with `?still`, which turns off transitions and the chrome, and they are moved with the
same message.

The windows talk through `window.open` and `window.opener` with `postMessage`, not
`BroadcastChannel`. Chrome gives every `file://` page its own opaque origin, so a channel
between two double-clicked files is unreliable, while a direct window handle always works.
If the presenter window is reloaded, the audience window finds it again from the first message
it receives.

**Setting up a room:** put the audience window on the projector and make it full screen (F11).
Keep the presenter window on the laptop screen. Some browsers block popups from a file opened
by double-click the first time; allow it once.

## PDF and handouts

`Shift+P` opens `?print` in a new tab (`?print=notes` when the deck has any notes). That mode
shows every position in turn, clones the stage, and stacks the clones as pages:

```js
SEQ.forEach((p, i) => {
  show(i, true);
  const page = document.createElement('div');
  page.className = 'page';
  page.append(stage.cloneNode(true));
  out.append(page);
});
```

`.still` turns off every transition and animation, so each clone is the finished state of its
position, not a frame halfway through a reveal. The page size is set to the canvas,
`@page{size:1920px 1080px;margin:0}`, so nothing is scaled or cropped. With notes, pages are
1920×1440 and the notes sit under the slide: a handout.

The browser's print dialog opens on its own; choose **Save as PDF**. For a PDF without
clicking, for example to attach to an email from a script:

```bash
chrome --headless=new --no-pdf-header-footer --virtual-time-budget=4000 --print-to-pdf=deck.pdf "file:///path/to/index.html?print"
```

Things that do not print well, and what to do:

- **Anything that crosses the canvas edge.** Chrome counts an element past the edge when it
  sizes the printed document, even though the stage clips it, and then shrinks *every* page
  to fit, with the slides ending up at 70% of the paper. Print already leaves out elements
  that are wholly off the canvas or not yet revealed. What remains must sit inside the canvas
  at every position, which the verification checklist asks for anyway.
- **A camera pan over a wide track.** A single container wider than the canvas, moved with
  `transform`, trips the rule above on every page. Use a registered custom property instead
  and position each thing at `calc(x + var(--pan))`, as `examples/journey` does (see the
  camera section in `engine.md`).
- **Iframes, video, canvas.** Iframes and video are cloned empty, and a canvas loses its pixels
  when cloned. If a deck has one, give it a static fallback (an image) that shows under `.still`.
- **Elements outside the stage** (a detail panel attached to `body`) are not cloned. Keep
  anything that should print inside `#stage`.

## Adding it to an existing deck

A deck not built on the starter needs four things, in this order:

1. **A sequence.** Build `SEQ` by walking the deck's own `next()` from the start and recording
   the state at each press, or write it out by hand. Then route `→`/`←` through `show(i)`.
2. **`?still`.** A class on `<html>` that sets `transition:none!important;animation:none!important`
   on everything, and hides the chrome.
3. **The message listener** and `show(i, fromPeer)` posting to `peer`. Copy them from the
   starter unchanged.
4. **The presenter and print markup and CSS** (`#presenter`, `#print`, `.page`). Copy these
   from the starter as well.

Then check both, as in `verification.md`: drive the presenter view from each window, and print
a PDF and look at every page.
