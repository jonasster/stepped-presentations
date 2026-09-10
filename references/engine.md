# The engine — stage, steps, camera, render

Read this when you are building or changing the machinery. For motion and connectors see
`motion.md`; for what to check before reporting done see `verification.md`.

## Contents

- [The stage](#the-stage)
- [The step machine](#the-step-machine)
- [Multi-slide decks](#multi-slide-decks)
- [Data to DOM](#data-to-dom)
- [The camera](#the-camera)
- [Detail panels and overlays](#detail-panels-and-overlays)
- [Keyboard and controls](#keyboard-and-controls)
- [Deep links](#deep-links)

## The stage

```html
<div id="viewport"><div id="stage"> …scene… </div></div>
```
```css
#viewport{ position:fixed; inset:0; }
#stage{ width:1920px; height:1080px; position:absolute; left:50%; top:50%;
        background:var(--paper); overflow:hidden; transform-origin:center; }
```
```js
function fitStage(){
  const k = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%,-50%) scale(${k})`;
}
addEventListener('resize', fitStage);
fitStage();
```

Two failure modes to know about:

**Centring with flex or grid instead of `translate(-50%,-50%)`.** A CSS transform does not
change layout size — the stage still occupies 1920×1080 in the layout even when scaled to a
third of that. `place-items:center` therefore centres the *unscaled* box and the visible scene
drifts off the viewport as soon as the window is narrower than the canvas.

**Measuring while scaled.** `getBoundingClientRect()` returns post-transform pixels. When you
need logical coordinates, either divide by `k`, or use `offsetTop` / `offsetWidth` /
`offsetLeft`, which are layout values and immune to transforms. Prefer the offset properties —
they are simpler and cannot drift.

Below some width the scene stops being legible at all. Rather than trying to reflow it, detect
the case and swap in a short "open this on a larger screen" notice.

## The step machine

```js
const STEPS = [...ITEMS].sort(byWhateverOrderYouPresentIn);
let step = -1;                       // -1 = nothing revealed yet

function applyStep(n, animate){
  step = Math.max(-1, Math.min(n, STEPS.length - 1));

  STEPS.forEach((s, i) => {
    const on = i <= step;
    node(s).classList.toggle('on', on);
    on ? drawWire(s.id) : hideWire(s.id);
  });

  // anything else on screen is ALSO derived from `step`, never incremented
  progress.style.width = ((step + 1) / STEPS.length * 100) + '%';
  setLive(step >= 0 ? STEPS[step].id : null);
  if (animate && step >= 0) follow(STEPS[step]);
}
```

Deriving rather than mutating is what makes `←` free. It also means `R` (reset) is just
`applyStep(-1)` and "show everything" is `applyStep(STEPS.length - 1)`.

Starting at `-1` gives the presenter a beat on an empty scene to introduce it before the first
item lands. Worth keeping.

## Multi-slide decks

Slides are sections; only one carries the step machine, or each carries its own counter. Keep a
named index rather than magic numbers, because slide order changes more often than you expect:

```js
const TITLE = 0, STORY = 1, TIMELINE = 2;

function next(){
  if (cur === TITLE)    return goTo(STORY);
  if (cur === STORY)    return sStep < STORY_LAST ? setStory(sStep + 1) : goTo(TIMELINE);
  if (step < STEPS.length - 1) applyStep(step + 1, true);
}
function prev(){
  if (cur === TIMELINE) return step > -1 ? applyStep(step - 1, true) : goTo(STORY, true);
  if (cur === STORY)    return sStep > 0 ? setStory(sStep - 1) : goTo(TITLE);
}
```

`→` should walk the entire deck in one direction and `←` unwind exactly the same path. When
stepping *back* into a slide, enter it fully revealed (the `storyFull` flag above) — the
presenter is returning to something the audience has already seen.

## Data to DOM

One array of content, one build pass, one update pass. Build creates nodes; update only toggles
state. Never rebuild on a step change — you will lose CSS transitions and any measured geometry.

```js
ITEMS.forEach(p => {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.id = p.id;
  el.style.cssText = `left:${x(p)}px; top:${TIER[p.tier]}px; --c:${p.color}`;
  el.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p>`;
  track.appendChild(el);
});
```

Two patterns that pay off:

**One CSS variable per item.** Set `--c` once on the container and let the title, marker,
connector and hover border all inherit it. Recolouring an item is then a one-character change,
and you cannot get them out of sync.

**Attach optional content through side maps**, not by widening the main array:

```js
const SHOTS   = { noodle:["shots/noodle.png"], … };
const DETAILS = { noodle:{ state:"live", links:[…], problem:"…", solution:"…" }, … };
ITEMS.forEach(p => { if (DETAILS[p.id]) Object.assign(p, DETAILS[p.id]); });
```

The core array stays readable as a layout description, and each concern is editable on its own.

## The camera

For scenes wider than the canvas, pan a track rather than scrolling the page:

```js
let panX = 0, zoom = 1;
function apply(instant){
  track.style.transition = instant ? 'none' : '';
  track.style.transform = `translateX(${panX}px) scale(${zoom})`;
  if (instant) requestAnimationFrame(() => track.style.transition = '');
}
function panTo(x, instant){
  panX = Math.max(Math.min(x, 0), Math.min(0, -(spanW * zoom - 1920)));
  apply(instant);
}
```

**Follow, do not centre.** Re-centring on every step makes the scene lurch under the audience.
Move only when the new item would otherwise be near an edge:

```js
function follow(p){
  const cx = xOf(p);
  if (cx + panX > 1500)      panTo(-(cx - 1180));
  else if (cx + panX < 380)  panTo(-(cx - 620));
}
```

A "show everything" view is a zoom-out (`zoom = 1860 / spanW`), not a pan. Set
`transform-origin` on the track to the scene's own axis so scaling collapses toward the spine
rather than the corner.

## Detail panels and overlays

A side panel that slides in over the scene is the natural way to go deeper on one item without
leaving the step:

```css
#detail{ position:absolute; top:0; right:0; width:720px; height:100%;
         transform:translateX(100%); transition:transform .45s var(--ease); }
#detail.open{ transform:none; }
```

Render it from the same data. Make every field optional and rendered only if present — a
half-filled item should look deliberate rather than broken:

```js
box.innerHTML = shots.length ? shotsMarkup
              : ILLUS[p.id]  ? illustrationMarkup
              : emptyStateNamingWhatToAdd;
```

Give the panel its own scroll (`overflow-y:auto`) rather than trying to make everything fit.
When content can exceed the canvas, a visible thin scrollbar is honest.

If a screenshot matters, let clicking it fill the stage. An image at 600px inside a panel is
fine on a laptop and useless in a room.

## Keyboard and controls

One `keydown` listener, guards first:

```js
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Escape'){ lightbox.hidden ? closeDetail() : closeLightbox(); return; }
  if (e.key === 'ArrowRight' || e.key === ' '){ e.preventDefault(); next(); }
  if (e.key === 'ArrowLeft'){ e.preventDefault(); prev(); }
  …
});
```

`Escape` should close the topmost layer only, so a presenter can back out one level at a time
without losing their place. Mirror every shortcut as an on-screen control that appears on hover —
someone will present this from a clicker or a trackpad. If there is an autoplay timer, every
manual control must stop it first, or playback fights the user.

## Deep links

For anything a colleague might be sent directly into, write the current step to the hash and
resolve it on load:

```js
history.replaceState(null, '', '#' + STEPS[step].id);
```

Resolve the hash *before* showing any cover or poster slide — a link sent to a specific step
should land there, not on the front page. If a hash is present, skip the cover entirely.
