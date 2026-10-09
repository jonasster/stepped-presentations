# Themes and motion styles

Read this when choosing how a deck looks or moves, when someone names a theme or a motion
style, or when they hand you a brand, a site, a file or a repo to match.

## Contents

- [How it works](#how-it-works)
- [The themes](#the-themes)
- [The motion styles](#the-motion-styles)
- [Pairings](#pairings)
- [Applying a theme and a motion style](#applying-a-theme-and-a-motion-style)
- [A theme from a reference](#a-theme-from-a-reference)
- [The token schema](#the-token-schema)

## How it works

A theme is how the deck **looks**; a motion style is how it **moves**. They are independent:
any theme works with any motion style, because the components only ever read tokens.

Both are a block of CSS custom properties. `assets/themes/*.css` and `assets/motion/*.css`
each hold one `:root{}` block, and a deck carries exactly one theme block and one motion block,
merged into the single `:root` at the top of its `<style>`. Nothing switches at runtime.
That matters for two reasons:

- **The studio edits decks through that `:root` block.** Every theme and motion value is a
  token there, so it can be tuned in the GUI without touching code.
- **The deck stays one file.** No theme loader, no stylesheet per style, nothing to go missing.

`assets/gallery.html` plays the same scene in every combination. Point people at it when they
cannot picture a name: they pick by looking, and it prints the words to ask for.

## The themes

| Theme | Looks like | Reach for it when |
|---|---|---|
| **House** | Condensed uppercase display (Barlow Condensed 800), Geist prose, Geist Mono for data. Cool paper, indigo ink, 12px radius | The default. Roadmaps, portfolios, walkthroughs, anything documentary |
| **Editorial** | Fraunces display in sentence case, Source Serif 4 prose, warm paper, oxblood accent, 2px radius | Talks and stories, an argument with a beginning and an end, humanities and culture subjects |
| **Swiss** | Archivo at 800 with tight tracking, white paper, black ink, one red, square corners and square markers, 2px rules | Pitches, strategy, decisions: anything that should feel settled and blunt |
| **Midnight** | Near-black paper, warm off-white ink, Geist display at 600, an amber accent and a soft light palette | Conference stages, dark rooms, demos where a white screen glares |

Each theme also carries a five-colour subject palette, `--c1` to `--c5`. Give each subject one
of them, and use it in **two places**, its marker and its title. Using it everywhere turns
identity into decoration. Need more than five subjects? Then a palette is not the problem:
group the subjects.

What a theme does not change: the reset, the contrast rules, the "not looking generated" list
and the layout sizing rules in `house-style.md`. Those hold for every theme.

## The motion styles

| Style | What happens on a step | Ambient | Reach for it when |
|---|---|---|---|
| **Calm** | Fades with a 10px rise, 0.6s, no overshoot | Barely there, 5s | Boards, serious subjects, long talks |
| **Crisp** | 0.36s clip-path wipe from the left, no travel, no bounce | Light, 3s | Business and pitch decks, editorial pace |
| **Playful** | Cards fly out of their own marker and overshoot a little, 0.16s stagger | Stronger halo, 4s | Workshops, teaching, internal all-hands |
| **Drawn** | Stems draw up from the marker, titles type in letter by letter, 0.9s, slow camera | Faint, 5s | Diagrams, flows, technical stories, "watch this get built" |

Every style keeps the rules in `motion.md`: only the current step moves, every reveal reverses
exactly on `←`, and `prefers-reduced-motion` gets a static indicator rather than nothing.

## Pairings

Defaults that work, in case the person has no opinion:

| | Calm | Crisp | Playful | Drawn |
|---|---|---|---|---|
| House | ✓ default | ✓ | ✓ | ✓ |
| Editorial | ✓ | ✓ | | ✓ |
| Swiss | | ✓ default | | ✓ |
| Midnight | ✓ | ✓ | ✓ | ✓ |

Editorial with Playful and Swiss with Playful fight each other: overshoot argues with a type
system built on restraint. Allowed, but say so if someone asks for it.

## Applying a theme and a motion style

**New deck.** Copy `assets/starter.html`. Its `:root` has two marked halves,
`/* theme: house */` and `/* motion: calm */`. Replace each half with the body of the file you
want, keep the marker comments (with the new names), and change nothing else in the CSS.
Then run `scripts/embed_fonts.py` on the deck, because the new theme names different faces.

**Existing deck on the starter.** The same swap. Then run the verification checklist across
every step: a different display face changes widths, and a step that fitted before may not.

**Existing deck not on the starter.** Do not force the schema in. Map the theme's values onto
the tokens the deck already has, and say which theme you took them from.

Keep comments inside `:root` free of curly braces and of anything shaped like `--name:`. The
studio scans the block by text, and both confuse it.

## A theme from a reference

Someone hands you a link, an image, a brand PDF, or a path into a repo, and wants the deck to
match. Derive a theme in the same schema, so everything downstream (the starter, the studio,
the font script) works unchanged.

**1 · Read the source.**

| Source | How |
|---|---|
| A URL | Open it in the browser. Read computed styles: `getComputedStyle(document.body)` for paper, ink and the body face; the main heading for the display face, weight, case and tracking; buttons and links for the accent. Look for CSS custom properties on `:root` first, because a site that has tokens has already done this work |
| An image or screenshot | Look at it. Pick paper, ink and one to three accents by eye, then name the hex values. Type you can only describe ("a geometric sans", "a slab serif"), so map it to the closest shipped or OFL face |
| A brand guide (PDF) | Read the colour and type pages. Prefer the guide's own hex values over sampling |
| A repo path | Read the design tokens, `tailwind.config.*`, CSS custom properties, or a theme file. Use their names to work out which value is paper, which is ink and which is accent |
| An existing deck | Read its `:root` |

**2 · Map onto the schema** (below). Paper and ink first, then the accent, then a subject
palette that sits with the accent. Take type from the source's own display face and body face.

**3 · Check contrast and fix it.** Run the `ratio()` check from `house-style.md` on ink, the
three greys, the accent and every palette colour against `--paper`. Each must clear 4.5:1.
Brand colours often fail, the pleasant bright one especially. Darken (on light paper) or
lighten (on dark paper) until they pass, keep the hue, and **say what you changed and why**.
A brand's exact value is worth less than a slide the back row can read.

**4 · Fonts.** If the brand face is open (OFL, on Google Fonts), fetch the woff2 into the deck's
`fonts/` folder and add its `@font-face`. If it is proprietary, use the closest face the skill
ships, or another OFL face, and say so. Never link a font CDN.

**5 · Save it** to `themes/local/<name>.css` in the skill folder (create the folder if needed).
Start the file with a comment naming the source and the date, and list every colour you
adjusted. `themes/local/` is gitignored: themes made from someone's brand are theirs, and
stay on their machine. Next time they ask for "the same look as the Acme deck", it is there.

Then apply it like any other theme, and show it before building the rest. In workshop mode,
the derived theme on the starter's skeleton is a natural first checkpoint.

## The token schema

Every theme sets all of these; every motion style sets all of the second table. A component
that needs a value not listed here should take it from an existing token rather than adding
a hard-coded colour or duration.

**Theme tokens**

| Token | What it is |
|---|---|
| `--theme` | The theme's name, for humans and the studio |
| `--paper` `--ink` | Background of the stage, and main text |
| `--ink-2` `--ink-3` | Secondary text (descriptions), tertiary text (labels, kickers). Both carry content, so both need 4.5:1 |
| `--line` `--muted` | Hairlines and borders; things not yet real (spine pips, placeholders) |
| `--outside` | The letterbox around the stage |
| `--accent` | One brand colour: progress bar, kicker dot |
| `--c1` … `--c5` | The subject palette |
| `--fill-mix` | How much of a subject colour tints its card, e.g. `12%` |
| `--display` `--display-weight` `--display-case` `--display-tracking` `--display-leading` | The display face and how it is set |
| `--sans` `--mono` | Prose face; data face (labels, counters, dates) |
| `--label-case` `--label-tracking` | How mono labels are set |
| `--radius` `--marker-radius` `--rule` | Corner radius; marker shape (`50%` round, `0%` square); hairline width |

**Motion tokens**

| Token | What it is |
|---|---|
| `--motion` | The style's name |
| `--ease` `--ease-out` | Easing for reveals; easing for loops and the camera |
| `--t-reveal` `--t-fade` `--stagger` | Reveal duration, fade duration, delay between the parts of one reveal |
| `--rise` | How far a reveal rises into place |
| `--travel` | `1` = a card flies out of its marker (from `--sx`/`--sy`), `0` = it does not |
| `--from-scale` | Scale a reveal starts from |
| `--wipe-from` | `100%` = clip-path wipe from the left, `0%` = no wipe |
| `--title-anim` | `type` = titles type in (needs `--chars` on the element), `none` = off |
| `--ambient-opacity` `--ambient-scale` `--ambient-period` | The halo on the current step |
| `--camera-t` | Duration of a camera pan |
