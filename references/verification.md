# Verification — look at it before reporting done

A scene is geometry drawn from data. A diff that reads correctly is not evidence, and a
screenshot of a half-drawn scene can look entirely plausible. This is the step that decides
whether a change takes one round or four.

## Run it

Use the environment's preview or static-server tool rather than starting a server from a shell.
If the deck is single-file, opening the file directly is enough — **except** that some previews
rewrite the page to a `data:` URL, which silently breaks every relative path. If images are
missing in a preview but the paths are right, suspect that before you suspect the code.

Deep links do the navigating for you when the deck has them: open `#step-id` to land on the step
you changed instead of clicking there every time.

## The checklist

Scale it to the change. A wording fix needs 1–2; anything touching geometry, data shape or the
engine needs all of it.

1. **Console is clean.** A thrown error mid-render leaves a partly drawn scene that still
   photographs well. Check it first, every time.
2. **The step you changed** renders: its content, its marker, its connector.
3. **The steps either side** still render. Most breakage lands next door, because layout
   functions usually redistribute every slot when a count changes.
4. **Step through the whole sequence** if you added or removed an item. Nothing should overlap,
   and nothing should leave the canvas.
5. **Navigate away and back.** A leftover element from the previous step is the classic symptom
   of a reveal that adds nodes without a class the cleanup pass looks for.
6. **Watch one full loop** of any ambient motion you touched, then step away and confirm it
   stopped.
7. **Reduced motion**, if you added movement: read the `prefers-reduced-motion` block and confirm
   it covers your new class. An animation that vanishes entirely leaves the step with no
   indicator at all.
8. **Both themes**, if the deck has them, and **the small-screen notice** if it has one.
9. **Deep links**, if you touched ids: the address updates as you navigate, and pasting one back
   in lands on the same step.

## Measure, do not eyeball

For anything about position, size or spacing, take the number. It is faster than another round
of "a bit more", and it gives the person reviewing something to check.

```js
// logical px, immune to the stage transform
const box = el => ({ top: el.offsetTop, h: el.offsetHeight, w: el.offsetWidth });
```

Two techniques worth knowing:

**Optical gaps need ink, not line boxes.** A text block's box includes leading, so comparing
boxes gives an answer that is arithmetically right and visually wrong. Probe the baseline and use
real cap-height:

```js
function baselineIn(el){                    // an inline-block of zero height sits on the baseline
  const p = document.createElement('span');
  p.style.cssText = 'display:inline-block;width:0;height:0';
  el.appendChild(p);
  const b = p.getBoundingClientRect().top - el.getBoundingClientRect().top;
  p.remove(); return b;
}
const cv = document.createElement('canvas').getContext('2d');
cv.font = '800 124px "Barlow Condensed"';
const cap = cv.measureText('H').actualBoundingBoxAscent;
```

**Assert alignment rather than looking at it.** When two rows should line up, compare the arrays:

```js
aligned: dots.every((v,i) => Math.abs(v - cards[i]) < 1.5)
```

That check is what catches a keyframe quietly dropping a `translate(-50%)` — see the transform
trap in `motion.md`. By eye it reads as a spacing problem and you will look in the wrong place.

## When the preview will not cooperate

A large single-file deck can exceed what an embedded preview will load, and a small pane will
not show enough to judge composition. Both are working conditions, not blockers:

- Build a temporary copy with the heavy inlined assets stripped out, verify structure and
  geometry there, then rebuild the real file.
- Verify numerically — counts, positions, computed styles, contrast ratios — and say that is what
  you did.

**Say which one you did.** "Verified structurally; I could not do a visual pass because the
preview pane collapsed" is useful. Implying you looked when you did not is how a broken deck
reaches a projector.

## Report with evidence

Say what you checked and give the numbers. "Both gaps are now 47px, measured ink-to-ink" tells
the reviewer the fix is real. "Fixed the spacing" does not.

If something is still off and you are handing it back, say so plainly rather than describing
what you intended.
