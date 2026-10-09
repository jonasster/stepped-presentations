# Motion — reveals, loops, connectors

Read this when adding or fixing animation, or when drawing lines between things. For the step
machine see `engine.md`.

## Contents

- [Two kinds of motion](#two-kinds-of-motion)
- [Motion styles](#motion-styles)
- [The reveal](#the-reveal)
- [The transform trap](#the-transform-trap)
- [Ambient loops](#ambient-loops)
- [Travelling pulses along a path](#travelling-pulses-along-a-path)
- [Connectors](#connectors)
- [Keeping wires off the words](#keeping-wires-off-the-words)
- [Reduced motion](#reduced-motion)
- [Timing](#timing)

## Two kinds of motion

Keep them separate in your head, because they have different rules.

**Reveal** is a one-shot transition when a step lands: a card arrives, a line draws, a marker
pops. It runs once, forwards, and must be reversible — stepping back has to put the scene
exactly where it was.

**Ambient** is a loop that runs while a step is current: a pulse travelling a wire, a marker
breathing, a terminal typing. It exists to point at what the presenter is talking about, and it
must stop when the step is no longer current.

Decoration that does neither is what makes a deck feel restless. If motion is not marking an
arrival or pointing at the current subject, cut it.

## Motion styles

A deck has one motion style: **Calm**, **Crisp**, **Playful** or **Drawn**. Each is a block of
tokens in `assets/motion/` (what they look like and when to use them: `themes.md`). Styles
change *how much* and *how fast*, never the rules on this page: only the current step moves,
reveals reverse exactly, reduced motion gets a static indicator.

The way to keep that true is to write every reveal **once**, reading tokens, so that a style is
a change of values rather than a change of code:

| What differs between styles | Token | Calm | Crisp | Playful | Drawn |
|---|---|---|---|---|---|
| Duration of a reveal | `--t-reveal` | .6s | .36s | .62s | .9s |
| Gap between the parts of one reveal | `--stagger` | .12s | .06s | .16s | .22s |
| Rise into place | `--rise` | 10px | 0 | 0 | 0 |
| Fly out of the marker | `--travel` | 0 | 0 | 1 | 0 |
| Start scale | `--from-scale` | 1 | 1 | .5 | 1 |
| Wipe from the left | `--wipe-from` | 0% | 100% | 0% | 0% |
| Titles type in | `--title-anim` | none | none | none | type |
| Halo strength | `--ambient-opacity` | .10 | .14 | .2 | .12 |

When you add a new kind of element to a deck, give it the same treatment: opacity from
`--t-fade`, transform from `--t-reveal`, the base transform composed with `--rise`, `--travel`
and `--from-scale`, and a `clip-path: inset(0 var(--wipe-from) 0 0)`. Then all four styles work
on it without a second thought. If you hard-code `.45s` on one element, the next style switch
leaves it behind.

Two CSS details the starter already handles, worth knowing if you write your own:

- **Animate a token-named keyframe with longhands.** `animation: var(--title-anim) .9s steps(8)
  both` reads a `--title-anim` of `none` as the fill mode and `both` as the name. Set
  `animation-name: var(--title-anim)` on its own line.
- **Custom properties work inside keyframes**, so a halo's strength can be a token:
  `0%{ opacity: var(--ambient-opacity) }`.

## The reveal

Drive it entirely from the `.on` class so it inverts for free, and compose the start state from
the motion tokens:

```css
.card{ opacity:0; clip-path: inset(0 var(--wipe-from) 0 0);
       transform: translate(calc(-50% + var(--sx,0px) * var(--travel)),
                            calc(var(--sy,0px) * var(--travel) + var(--rise)))
                  scale(var(--from-scale));
       transition: opacity var(--t-fade) var(--ease), transform var(--t-reveal) var(--ease),
                   clip-path var(--t-reveal) var(--ease); }
.card.on{ opacity:1; clip-path: inset(0 0 0 0); transform: translate(-50%,0) scale(1);
          transition-delay: calc(var(--stagger) * 2); }
```

The delay sits on `.on` only, so a reveal is staggered on the way in and immediate on the way
back: `←` should never make the presenter wait.

The fly-out (`--travel:1`, Playful's signature) has each card leave the marker it belongs to.
Compute the offset once, after layout, and store it as a custom property:

```js
el.style.setProperty('--sx', (markerX - cardX) + 'px');
el.style.setProperty('--sy', (markerY - cardY) + 'px');
```

Now the reveal reads as *this came from here*, which is usually the relationship you are trying
to show anyway.

## The transform trap

**This is the single most common bug in this kind of work, and it is invisible in review.**

`transform` is one property. A keyframe that sets `transform` *replaces* whatever the base rule
set — it does not add to it. So this quietly breaks centring:

```css
.marker{ transform: translate(-50%,0) scale(.5); }        /* centred on its x */
@keyframes popin{ to{ transform: scale(1); } }            /* ← drops the translate */
```

The element jumps right by half its own width. When several differently-sized elements share the
keyframe, each jumps by a different amount, so the symptom is not "everything shifted" but
"things that should line up don't" — which reads as a spacing problem and sends you looking in
the wrong place.

Carry the base transform through every keyframe:

```css
@keyframes popcentre{
  from{ transform: translate(-50%,0) scale(.5); opacity:0; }
  to  { transform: translate(-50%,0) scale(1);  opacity:1; }
}
```

When you hit an alignment oddity, check this first. If you keep a keyframe that only scales,
reserve it for elements with no base transform, and audit before reusing one:

```bash
grep -B4 'animation:.*popin' index.html | grep 'transform:translate'
```

## Ambient loops

Gate on the class for the *current* step (the starter calls it `.now`; `.on` means "revealed
so far") so only the thing being talked about moves:

```css
.knot.now::after{ content:""; position:absolute; inset:0; border-radius:inherit;
                  background:var(--c);
                  animation: halo var(--ambient-period) var(--ease-out) infinite; }

@keyframes halo{ 0%{ transform:scale(1); opacity:var(--ambient-opacity) }
                 70%,100%{ transform:scale(var(--ambient-scale)); opacity:0 } }
```

If a scene genuinely needs several things looping at once (every station on a flow that is
live), stagger them with an inline `--hd` delay so they do not pulse in unison. Synchronised
pulsing reads as a progress bar and pulls the eye away from the speaker. Keep ambient motion
faint; if you notice it while reading the slide, it is too strong.

## Travelling pulses along a path

The clearest way to say *this connects to that* is to send a highlight along the connector.
Duplicate the path, dash it, and animate the offset:

```js
const len = path.getTotalLength();
pulse.style.strokeDasharray  = `30 ${len}`;
pulse.style.setProperty('--len', (len + 30) + 'px');
pulse.style.animationDuration = Math.max(1.3, Math.min(3.4, len / 260)) + 's';
```
```css
.pulse{ opacity:0; stroke-width:4; }
.pulse.live{ opacity:.95; animation-name:flow; animation-timing-function:linear;
             animation-iteration-count:infinite; }
@keyframes flow{ from{ stroke-dashoffset:0 }
                 to  { stroke-dashoffset: calc(var(--len) * -1) } }
```

Three things this depends on:

- **`getTotalLength()` needs the element in the DOM.** Append first, measure second. Batch the
  measuring pass after a scene is built rather than measuring as you create.
- **Route direction is animation direction.** Author every route source→target so the pulse
  always travels outward from the thing that owns it. If you later reverse a route for layout
  reasons, the pulse silently runs backwards.
- **Scale duration with length**, or a long wire whips across while a short one crawls.

The same dash trick draws a line on: set `stroke-dasharray` and `stroke-dashoffset` to the full
length, then transition the offset to `0`.

## Connectors

Between two points, use **explicit waypoints and a rounded polyline**, not a heuristic:

```js
function roundedPath(pts, r = 26){
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++){
    const [px,py] = pts[i-1], [cx,cy] = pts[i], [nx,ny] = pts[i+1];
    const d1 = Math.hypot(cx-px, cy-py), d2 = Math.hypot(nx-cx, ny-cy);
    const rr = Math.min(r, d1/2, d2/2);
    d += ` L${cx + (px-cx)/d1*rr},${cy + (py-cy)/d1*rr}` +
         ` Q${cx},${cy} ${cx + (nx-cx)/d2*rr},${cy + (ny-cy)/d2*rr}`;
  }
  const l = pts[pts.length-1];
  return d + ` L${l[0]},${l[1]}`;
}
```

Give each connector its route in data:

```js
{ id:"roadmap", wires: () => [{ route: [[632,DOTY],[632,BAND],[GAP_FEB_MAR,BAND],[541,B_IN]] }] }
```

Deriving routes from midpoints looks like it will generalise and does not. The moment two items
sit at different tiers, or a label is in the way, the midpoint is wrong and you end up adding
special cases until the "generic" function is a pile of conditionals. Explicit waypoints are
longer to write and stay correct.

**Merge shared runs into one trunk.** When several connectors head the same way, give the first
one the full route and let the others join it with a short stub. Parallel lines a few pixels
apart read as a railroad track, and each extra line needs its own corridor to travel in.

**Gradient strokes** are a cheap way to show direction or lineage — a wire that shifts from the
source's colour to the target's. Build a `linearGradient` spanning the route's first and last
waypoint in `userSpaceOnUse`.

## Keeping wires off the words

A connector crossing a label is the fastest way to make a careful diagram look sloppy. Solve it
structurally rather than nudging:

**Reserve horizontal bands.** Pick the strip between two rows of content and run every
horizontal segment there. Name the constants so the reasoning survives:

```js
/* dots are 48px across, so their lower edge is y=555; labels start at y≈600 */
const BAND_TOP = 586;   // between the markers and the labels
const BAND_LOW = 678;   // below the labels, only reachable after dropping through a gap
```

**Drop verticals through the gaps between labels**, never through a word:

```js
const GAP_FEB_MAR = 541, GAP_APR_MAJ = 947;
```

Two mistakes worth naming, because both look like something else:

- A band that is numerically below a marker's centre but inside its radius makes the wire pass
  *behind* the marker rather than beneath it. Check against the marker's edge, not its centre.
- A band just below a label's line box still clips descenders. Leave real clearance.

## Reduced motion

Under `prefers-reduced-motion`, a looping indicator must not simply vanish — that leaves the
step with no marker of what is current at all. Convert it to something static that carries the
same meaning: a travelling glow becomes a standing dashed line, a pulse becomes a solid ring.

```css
@media (prefers-reduced-motion: reduce){
  *{ animation:none !important; transition-duration:.001s !important; }
  .pulse.live{ opacity:.5; stroke-dasharray:6 8; }   /* direction, standing still */
}
```

Also skip the staged build entirely and render the finished scene, so someone who cannot use the
animation still gets the whole picture:

```js
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) showAll(); else applyStep(-1);
```

Every new animation gets a line in that block. It is the step most often forgotten, and the one
nobody notices is missing until it matters.

## Timing

The motion style sets the numbers; these are the bounds every style stays inside, and what to
check if you tune one.

Reveals want to be quick enough not to hold the presenter up and slow enough to be seen:
**0.35–0.9s**. Below that a reveal reads as a cut; above it the presenter waits for the slide.
Stagger the parts of one reveal by **0.06–0.22s** so they read in order.

Ambient loops sit at **3–5s**. Anything faster is a distraction; anything slower stops reading
as motion.

Camera moves are the exception, **0.8–1.4s**, ease-out (`--camera-t`, `--ease-out`). A pan is
the audience relocating, and rushing it is disorienting.
