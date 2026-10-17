# Brand directions (batch M, Part 2)

Three directions for the app's own look, to choose one before Part 3 applies it.
Each is shown on four screens: Today, Train with a set card open, the check-in
and the program. Each screen is shown in light and dark at 390 px, with the
demo's made-up lifter as the data.

- `screenshots/`: 24 images, `<direction>-<screen>-<light|dark>.png`.
- `logbook.html`, `chalk.html`, `grove.html`: the mockups, all eight screens of a
  direction side by side. `?today-dark` (or `#today-dark`) shows one screen.
  These mockups load their fonts from Google Fonts; the app itself will bundle
  them (see Fonts below).
- `tokens.json`: every direction's full token set for light and dark, with the
  same keys as the app's theme tokens, so Part 3 is a swap.
- `src/`: what made them (`tokens.js` checks the palettes with the app's own
  readability rules; `data.js` reads the demo; `build.js` writes the mockups;
  `shots.js` takes the screenshots).

No screenshots of other apps are in this repo.

**Every palette passes the app's readability check** (`themeReport`) in light
and dark:
- 4.5:1 for text and button text;
- 3:1 for captions, status dots, button shapes and chart bars;
- at least ΔE 20 between colours that sit side by side in charts and blocks;
- no saturated text on a saturated background.

Grove light needed three small lightness nudges from the app's own
`readableTokens`: the deload grey, the chart bars and the text on the PR badge.
`tokens.json` has the nudged values.

**Shared by all three:**
- **Block types have a pattern as well as a colour:** solid for size, striped for
  strength, dotted for a taper, hollow for a deload. No direction uses blue for
  size, orange for strength or red for a peak.
- **The tab icons are one set of shapes** (sunrise, plate, stepped bars, trend,
  sliders), drawn in each direction's hand.

---

## 1. Logbook

A training notebook: paper, ink and one signal colour.

| Role | Light | Dark |
|---|---|---|
| Background / card | `#F5F0E6` paper / `#FBF8F1` | `#1C1A17` warm charcoal / `#25221E` |
| Text / secondary | `#1D1B17` ink / `#57524A` | `#F2ECE1` / `#B9B0A2` |
| Accent (text, links) | `#B83A12` | `#FF7A4D` |
| Buttons | `#E4572E` signal orange, ink text | the same orange, charcoal text |
| Size / strength / taper / deload | olive `#4F6B2A` / umber `#5B4636` / orange `#B83A12` / grey `#6F6A60` | `#A3BE6E` / `#D8C3A5` / `#FF8A5C` / `#A0998B` |
| OK / caution / stop | `#2F7D4A` / `#A87400` / `#B3261E` | `#7BC48E` / `#E6C15A` / `#FF6B5E` |

- **Type:** IBM Plex Sans for words, IBM Plex Mono for every weight, rep and
  date. The numbers are tabular, so columns line up like a log.
- **Icons:** thin 1.5 px strokes, square ends and sharp corners, like a pen
  drawing.
- **Signature: the ruled set rows.**
  - Every set sits on a ruled line, in mono, with a margin rule down the left in
    the accent.
  - The current set is a dashed box on the page.
  - Screens open with a date stamp ("SAT 17 OCT — HYPERTROPHY, WEEK 4").
- **How it differs from the look-alikes:**
  - Paper and charcoal, not navy, and orange rather than bright blue.
  - Size is olive and strength is umber; orange marks a taper and the
    interface.
  - The check-in is chips (Part 1), not rows of five boxes.
  - Corners are almost square and there are hairline borders instead of tiles.
  - Numbers sit in a mono log column, not in stat tiles.

## 2. Chalk

Gym chalk and steel: graphite, chalk-white and an acid lime.

| Role | Dark (default) | Light |
|---|---|---|
| Background / card | `#16181A` graphite / `#202326` | `#ECEDE8` chalk dust / `#F9F9F5` |
| Text / secondary | `#F2F2EC` chalk / `#B4B7B0` | `#17191B` / `#4E534E` |
| Accent (text, links) | `#C8F03C` acid lime | `#4E6B00` |
| Buttons | lime, graphite text | graphite, lime text |
| Size / strength / taper / deload | lime `#C8F03C` / yellow `#FFD23F` / pink `#FF6FB0` / grey `#959A93` | `#4E6B00` / `#7D5E00` / `#B4135F` / `#636862` |
| OK / caution / stop | `#4FD1A1` / `#FFD23F` / `#FF6B5E` | `#1F7D52` / `#8F6D00` / `#B3261E` |

- **Type:** Barlow for words, Barlow Condensed (ExtraBold) for numbers and
  headings, in capitals for headings.
- **Icons:** bold 2.6 px strokes with round ends, like a marker on a whiteboard.
- **Signature: the big condensed numbers.**
  - The set you're on is "195 × 8" at 76 px.
  - A lime bar runs down the left of the current set and of today's plan.
  - A faint chalk-dust grain sits on the background.
- **How it differs from the look-alikes:**
  - Graphite, not navy, and lime, not blue.
  - Size is lime, strength yellow and a taper pink.
  - Headings are condensed capitals, not the usual app sans.
  - The plan and the current set are marked by one bar of colour, not by
    coloured tiles.
  - There are no segmented boxes or tile grids anywhere.

## 3. Grove (my proposal)

Calm and outdoors: sage, forest green and a tomato red, with a soft serif for
numbers.

| Role | Light (default) | Dark |
|---|---|---|
| Background / card | `#EEF2EC` sage / `#FFFFFF` | `#0F1A14` deep forest / `#16241C` |
| Text / secondary | `#13241B` forest ink / `#46574D` | `#ECF2EC` / `#A9B8AE` |
| Accent (text, links) | `#B93A24` tomato | `#FF8466` |
| Buttons | forest `#1F5A3D`, white text | green `#57B383`, forest text |
| Size / strength / taper / deload | green `#2B7350` / bark `#7A5A2E` / tomato `#B93A24` / grey `#616F66` | `#7FCB9B` / `#D9B07A` / `#FF7A5C` / `#93A198` |
| OK / caution / stop | `#2B7350` / `#A87400` / `#B3261E` | `#7FCB9B` / `#E6C15A` / `#FF6B5E` |

- **Type:** Work Sans for words, Fraunces (a soft serif) for headings and
  numbers.
- **Icons:** round 1.8 px strokes on a soft tinted disc (duotone).
- **Signature: sets as plates.** Each set is a rounded bar as long as its load,
  so a session looks like a stack of plates. Logged sets are filled, sets still
  to do are dashed outlines. The cards and chips are round and generous.
- **How it differs from the look-alikes:**
  - Sage and forest, not navy, and tomato and green, not blue.
  - Size is green, strength bark brown and a taper tomato.
  - A serif carries the numbers.
  - The set rows are drawn as plates, not as tables or tiles.
  - The check-in is chips.

---

## Fonts

All six are under the **SIL Open Font License 1.1**: free to use, bundle and
ship with the app, provided the licence goes with them.

| Direction | Words | Numbers |
|---|---|---|
| Logbook | IBM Plex Sans (400, 600) | IBM Plex Mono (400, 500) |
| Chalk | Barlow (400, 600) | Barlow Condensed (700, 800) |
| Grove | Work Sans (variable) | Fraunces (variable) |

**How the chosen pair is bundled so it works offline (Part 3):** a Latin subset
of each weight is converted to WOFF2 and inlined in `index.html` as base64
`@font-face` sources. That keeps the app a single file, and the fonts are there
from the first load with no network. It costs about 150 to 250 KB. The
licence file goes in the repo as `fonts/OFL.txt`, credited in Settings → About.

The fallback is separate `fonts/*.woff2` files cached by the service worker.
That's smaller in the page, but the first offline open would use system fonts.

## Choosing

Pick one (or ask for a mix: one direction's palette with another's signature).
Part 3 then:
- swaps the tokens and makes the pick the default;
- removes the old navy and blue look (it isn't kept as a theme);
- re-checks the other themes;
- bundles the fonts, restyles the icons and updates `docs/design.md`.
