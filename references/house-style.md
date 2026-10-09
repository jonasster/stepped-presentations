# House style

The rules every theme keeps. The themes themselves (House, Editorial, Swiss, Midnight, or one
derived from a brand) are in `themes.md`; they choose faces and colours, and this file says how
to use them. Deviate when a project needs it, but deviate deliberately and keep the reasoning,
because most of these rules exist to solve a specific failure.

## Contents

- [Type](#type)
- [Colour](#colour)
- [Contrast, both directions](#contrast-both-directions)
- [Surfaces and shape](#surfaces-and-shape)
- [The CSS reset that matters](#the-css-reset-that-matters)
- [Fonts offline](#fonts-offline)
- [Not looking generated](#not-looking-generated)
- [Layout sizing](#layout-sizing)

## Type

Three roles, each a token, each with a job:

| Token | Role | In House |
|---|---|---|
| `--display` | Display: headlines, card titles, scene titles | Barlow Condensed 800, uppercase |
| `--sans` | Prose: body copy, descriptions, anything read as sentences | Geist 400–600 |
| `--mono` | Data: labels, counters, months, domains, states, captions | Geist Mono 500, 700 for emphasis |

The split does real work: the mono is a *signal* that something is metadata rather than
narration, so a reader can skip it or find it without reading it. Do not use mono for prose, and
do not use the display face for anything long. A condensed or heavy display face is built for
short runs and gets tiring fast. Use the `.display` and `.meta` classes in the starter, which
read the theme's case and tracking tokens, rather than setting type by hand.

Display type at large sizes wants tight tracking (`--display-tracking`, at or below `.005em`).
Mono set as small uppercase labels wants the opposite, `.12em` to `.34em`, or it reads as code
rather than as a label.

**Step type down by tier.** When elements sit at different levels of importance — a main row and
a secondary row — scale the type, not just the position:

| Tier | Title | Body | Padding |
|---|---|---|---|
| Primary | 46px | 16px | 24/30 |
| Secondary | 32px | 13.5px | 20/24 |
| Tertiary | 24px | 11px | 15/20 |

One scale everywhere is the most common reason a dense layout feels crammed. The eye reads size
as importance before it reads anything else.

## Colour

- One **paper** and one **ink**, warm or cool but consistent (`--paper`, `--ink`).
- One **palette colour per subject** (`--c1`…`--c5`), used in exactly **two places**: its marker
  and its title or link. Tinting everything a subject touches turns identity into decoration and
  makes the page loud.
- Card fills are the subject colour at `--fill-mix` (8–14%) over the paper. Enough to group,
  not enough to shout.
- `--muted` for anything not yet real: placeholders, "to be determined", disabled states.

When you need a palette that reads as *outside* the main one — a before/after, a hobby/work
split — change **saturation and value**, not just hue. A softer, warmer set beside a deep
saturated one reads as a different family instantly; four more hues from the same register just
looks like more of the same.

## Contrast, both directions

An accent used as text on the paper **and** as a button background carrying paper-coloured text
must clear 4.5:1 *both ways*. This is the trap: the pleasant, bright version of a hue usually
fails one direction, and it always fails on a projector before it fails on your laptop.

Check it rather than trusting your eye:

```js
function L(h){ const c=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255)
  .map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));
  return .2126*c[0]+.7152*c[1]+.0722*c[2]; }
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
```

Light-mode accents therefore end up darker than feels natural. That is correct. Write the
constraint next to the tokens so nobody "brightens them up" later:

```css
/* light values are dark enough to pass 4.5:1 both as text on --paper
   and as a button background carrying --paper-coloured text */
```

Muted greys carrying real content — domains, categories, captions — are content, not decoration,
and need the same 4.5:1. This is the one people skip because it *looks* like chrome.

## Surfaces and shape

- **Flat.** No gradient meshes behind headings, no glow, no neon. A gradient is acceptable as a
  wire that encodes direction; it is not acceptable as atmosphere.
- **Shadows only where a real layer separates** — a panel over a scene, a lightbox over
  everything. Not on cards sitting on a page.
- **Restrained radii.** 0–4px for a typographic, documentary feel; 10–16px if the deck is warmer.
  Pick one and hold it.
- **Hover is an underline or a border**, never a lift-and-glow.
- **Hairlines over boxes.** A 1px rule and whitespace separate things more quietly than a border
  on four sides, and they scale better when the layout gets dense.

## The CSS reset that matters

```css
*,*::before,*::after{ box-sizing:border-box }
body{ margin:0 }
p,h1,h2,h3,ul,ol,figure{ margin:0 }
a{ color:inherit }
img{ display:block; max-width:100% }
```

The `p,h1,h2,h3,…{margin:0}` line is not tidiness. Browser default margins are `1em`, and on an
**absolutely positioned** element that margin offsets it from where `top`/`bottom` says — so a
heading lands an em from where you put it and the number in your CSS is a lie. Bottom-anchored
elements are worse: they end up an em *above* their stated offset, and if you then tune the
position by eye you have baked the bug into the layout.

If you inherit a scene where positions look tuned but odd, check for a missing reset before
adjusting anything. Restoring it will move things — compensate the offsets that were silently
relying on the phantom margins, and verify.

## Fonts offline

Self-host as `woff2`, subset to the languages you need. The skill ships the faces of every
theme in `assets/fonts/` (latin subset, which covers æ, ø, å, ä, ö, ü and the rest of Western
Europe, with OFL licences beside them). `scripts/embed_fonts.py` reads the family names in a
deck's `:root` and copies just those faces into the deck's `fonts/` folder, or with `--inline`
embeds them as base64 so a single file travels alone:

```bash
python scripts/embed_fonts.py decks/roadmap/index.html            # fonts/ next to the deck
python scripts/embed_fonts.py decks/roadmap/index.html --inline   # one self-contained file
```

A face the skill does not ship, for example a brand's own OFL face, goes in the same way by
hand:

```css
@font-face{ font-family:"Barlow Condensed"; src:url(fonts/barlow-condensed-800.woff2) format("woff2");
            font-weight:800; font-display:block; }
```

`font-display:block` rather than `swap`: a brief blank beats the whole scene reflowing mid-
sentence, because your layout constants were measured against the real face.

Remote fonts are the most common way a deck arrives broken on a guest network, and the fallback
metrics change every measured width you rely on. Keep the licences alongside the files.

## Not looking generated

A recurring, legitimate complaint is that a deck looks machine-made. It is usually these,
specifically:

- Blurred multi-colour gradient mesh behind a hero
- A logo that is a gradient blob
- Cards that lift and glow on hover
- Large soft shadows on everything
- Uniform 16–20px radii on every surface
- Fake browser chrome with three traffic-light dots
- Uppercase letterspaced eyebrow labels above every heading
- Backdrop-blurred sticky headers
- Inter as the typeface
- An accent colour applied to every element inside its section

None is disqualifying alone. Three or more and the thing reads as a template. The antidote is
not more restraint everywhere — it is committing to an actual idea: a documentary/reference feel
(hairlines, mono metadata, square corners, numbered entries), or an editorial one (a real type
hierarchy, generous measure, one accent). Pick one and be consistent.

## Layout sizing

**Flex will not shrink a child below its content size** unless you say so. Three images in a row
will overflow their column no matter what `max-width` says, because the default `min-width:auto`
protects them. Either set `min-width:0`, or compute sizes explicitly:

```js
const w = stack ? Math.min(cw, ((ch - gap*(n-1)) / n) * ar)
                : Math.min((cw - gap*(n-1)) / n, ch * ar);
```

Computing is worth it when the box has a visible border, because then it hugs the image instead
of framing empty space around a letterboxed `object-fit:contain`.

**Measure the container that defines the space, not the flex row inside it** — an unsized row
gets stretched by its own content, so measuring it returns the overflowing width and every
calculation downstream is wrong.

**Measure after the fonts load**, or every text-derived width is computed against the fallback:

```js
document.fonts.ready.then(boot);
```
