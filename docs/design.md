# Design system

How Trainlog looks, in one place. Every screen is built from the tokens and
components below; nothing on a screen picks its own colour, size or spacing.
The tokens live in the `:root` block at the top of `index.html`, and the theme
codes (`THEMES`) still override the colour tokens, so a theme keeps working
on every screen.

## Direction: Calm

Three directions were mocked up with the same real demo data (a lifter in week
8 of a size block with a flared shoulder). The mockups and their 390 px
screenshots, light and dark, are in `docs/design/`.

- **Calm** (chosen): the current minimal feel, with clearer hierarchy, more
  whitespace and stronger type contrast.
- **Training-log**: denser, with more numbers on screen and a sport-watch
  feel.
- **Warm**: rounder, with softer surfaces, friendlier copy and small inline
  icons.

**Why Calm:** the set card at 390 px is where the choice matters most, and
Calm's is the clearest. The three numbers you change, then Log set, read
top to bottom with nothing repeated.

- Training-log shows the same weight, reps and effort twice: a big readout,
  then the steppers. Its uppercase labels slow reading. One idea from it is
  worth keeping for later: a "last time" column next to each planned set.
- Warm's rounded steppers wrap their labels at this width, and its friendlier
  copy drifts from the plain-language rules.

Neither was clearly better, so the default (Calm) stands.

**Switching direction later:** set `DESIGN_DIRECTION` in `index.html` to
`'log'` or `'warm'`. Each direction is a set of token overrides plus a few
component styles in the stylesheet (`:root[data-direction=…]`). No screen
code changes.

## Tokens

### Colour

Seven roles. The CSS name on the left is what components use. The older names
(`--card`, `--ink`, `--danger`) still work and are what theme codes set.

| Role | CSS | Dark | Light | Use |
|---|---|---|---|---|
| surface | `--bg`, `--surface`, `--surface-2`, `--line` | #0B0D12 / #16191F / #1F232B / #2A2F39 | #F4F5F7 / #FFFFFF / #EEF0F3 / #E3E6EB | page, cards, inputs and chips, dividers |
| text | `--text`, `--muted`, `--dim` | #F2F4F8 / #8E95A3 / #606876 | #12151A / #5A626F / #878E9B | primary, secondary, tertiary text |
| accent | `--accent`, `--on-accent`, `--accent-soft`, `--accent-fill` | #4C8DFF (fill #2F6FEB) | #2165EA | links, selection, charts; buttons and selected chips use the fill, which carries the button text. Not for status. |
| ok | `--ok` | #4ADE80 | #1F9D55 | the "no change" dot |
| caution | `--caution` | #F2D04B | #B39000 | the "careful" dot: longer warm-up, no step-ups |
| warn | `--warn` | #E8A33D | #A55E00 | the "held" dot, condition warnings, suggested numbers |
| stop | `--stop` (= `--danger`) | #E8546B | #D62844 | the "lighter" dot, destructive actions, failed reps |

**Readability, enforced (v1.74).** Every theme, the default included, passes
the same rules (`THEME_RULES` in index.html; §80 fails the build otherwise):
- **Text:** body and secondary text at least 4.5:1 on every surface,
  including warning text, links and the labels on block colours.
- **Shapes and marks:** captions, button shapes, status dots and chart marks
  at least 3:1.
- **Chart colours** that appear together are at least ΔE 20 apart.
- **No saturated text on a saturated background.**

A colour code you type (#RRGGBB) gets the same check, and its lightness is
nudged until it passes. The chart palette is the theme's checked tokens.

Block colours (`--hyp`, `--str`, `--peak`, `--deload`) only appear where the
colour means a block type. The four dots map one to one: no change → ok,
careful → caution, held → warn, lighter → stop (`BAND_COLOR`).

**Dark is the default**, whatever the phone's setting. The light values above
are the **LIGHT** theme code (Edit program → Have a code?). The status bar
always has white text (the app runs full screen), so that theme puts the clock
on a band of the accent colour.

### Type: five sizes, no others

| Token | Size | Use |
|---|---|---|
| `--fs-1` | 12px | labels, meta lines, badges, legends |
| `--fs-2` | 14px | secondary text, explanations, chips |
| `--fs-3` | 16px | body, buttons, card titles, exercise names |
| `--fs-4` | 22px | screen titles, sheet titles, stepper numbers |
| `--fs-5` | 28px | the one big number on a screen (the countdown, a wide stepper) |

Weight carries hierarchy, not extra sizes. Use 400–500 for text, 600–650 for
labels and titles, and 750+ for numbers you act on.

### Spacing

`--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 24 · `--sp-6` 32 (px).
The page gutter is `--sp-4`. Cards are padded `--sp-4` and spaced `--sp-3`
apart. Sections inside a sheet are spaced `--sp-5` apart.

### Radius

`--r-s` 8 (badges, icon buttons) · `--r-btn` 12 (buttons, steppers, segmented
controls) · `--r` 14 (cards; theme codes set this one) · `--r-l` 20 (sheets) ·
`--r-pill` (chips, toasts).

### Elevation

`--e-1` sits under cards. In dark mode it's nothing, because surface contrast
does the work. In light mode it's a hairline and a faint shadow. `--e-2` is for
sheets, toasts and the definition card. There are no other shadows.

### Touch and the bottom edge

- `--tap` is 44px. Every tappable thing is at least 44px in both directions.
  Smaller-looking controls (chips, small buttons, icon buttons, the "?") extend
  their hit area with an invisible `::after`, and chip rows keep an 8px gap so
  hit areas never overlap.
- `--safe-bottom` = 80px + the phone's bottom inset. The page always keeps that
  much clear at the bottom so nothing sits under the tab bar. The rest timer
  and the update banner sit above it.

## Components

| Component | Class | Rules |
|---|---|---|
| Card | `.card` (+ `.pad`), `.qblock` in sheets | surface, `--r`, `--e-1`, padded `--sp-4`. One idea per card. Title in `--fs-3` 650. |
| List row | `.li` | at least 44px tall, hairline between rows, label left, value or chevron right |
| Chip | `.chip` (`aria-pressed`), in `.chips` | a choice from several, or a filter. Selected = accent fill. Use chips when a segmented control would wrap. |
| Button, primary | `.btn.pri` / `.btn.primary` | the one main action on a screen or sheet (Log set, Start, Save) |
| Button, secondary | `.btn`, `.btn.ghost` | the other actions. `.ghost` is the outlined version for use on a surface. |
| Button, quiet | `.btn.quiet` | text-only accent action: "Details", "Show all" |
| Button, destructive | `.btn.danger` / `.btn.destructive` | erase, remove, stop a plan. Always confirms first, and says data is safe where it is. |
| Sheet | `#dlg .sheet` | surface, `--r-l`, `--e-2`. Title in `--fs-4`, then content, then the actions at the bottom. Close is always reachable. |
| Stepper | `.step` (`.wide` for one per row) | − value +, buttons 44px wide, number in `--fs-4` (`--fs-5` when wide), label under it. Tap the number to type. |
| Segmented control | `.seg` | up to 3 words, or up to 5 short numbers (the check-in scales). More than that, use chips. |
| Empty state | `.empty` | what will appear here, and how to make it appear, in one or two plain sentences |
| Inline help | `.term` (dotted word), `.help` ("?") | a tap shows the glossary definition in a small card, and any tap elsewhere closes it. It never navigates. |
| Status line | `statusRow(band, sentence)` → `.status` + `.sdot` | a dot in the band's colour, then the sentence saying what it does. The band name is never shown (H2). |

## Icons

Inline SVGs from one set (`ICONS` in `index.html`), on a 24 grid with a
1.9 stroke, drawn with `icon(name, label)`. There are at most 24, and they're
used only in three places:

- **Tab bar:** dashboard, workout, lifts, progress.
- **Set card actions:** swap, info, up, down, remove, add, note, more, check,
  timer, plan.
- **Condition card:** shield.

That's 16 so far. There are no muscle diagrams, and nothing is decorative. An
icon that does something has a label (`aria-label`); one beside text is
`aria-hidden`.

## Copy

- Sentence case everywhere: titles, buttons, chips ("Start training", not
  "Start Training").
- Buttons are verbs: "Log set", "Save program", "Deload this week".
- Use glossary terms only (`docs/glossary.md`), with the "In the app" label.
  A term may be a dotted word you can tap.
- Plain and direct. No exclamation marks, no hype. Judgement-default numbers
  say so.
- Statuses say what they do (H2). Errors say your data is safe.

## Screens and sheets (v1.67)

Everything that sits over the app is one of two things, both built the same
way:
- **The screen (`#scr`)** is a full-screen flow. Setup is the only one. It
  has no backdrop and nothing to swipe away; you leave it with "Exit setup".
- **The sheet (`#dlg`)** is every other popup.

Both follow the same rules:
- **Sized to the visible viewport.** Each is a column as tall as what's
  actually visible: `--vvh` and `--vvt` follow `window.visualViewport`,
  falling back to `100dvh`. Never the vh unit, which is the height *without*
  the browser toolbars and doesn't shrink for the iPhone keyboard.
- **One scroller.** There's a header, then the body (`flex:1; min-height:0;
  overflow-y:auto; overscroll-behavior:contain`), then the footer.
- **Footer in normal flow.** The footer is never fixed, and its bottom padding
  clears the home indicator (`max(12px, safe-area bottom)`). The primary
  action is in the footer, so it's always on screen.
- **Footers fill themselves.** A sheet's trailing buttons move into its
  footer automatically.
- **The keyboard.** The visible viewport shrinks, so the footer rides above
  the keyboard, and a focused field scrolls into view. Inputs are at least
  16px, so the iPhone doesn't zoom.
- **Back.** Each open sheet and each setup step is a history entry. Back
  closes the sheet or goes back a step, and never leaves the app. A sheet with
  something typed or set asks before it closes; a read-only one just closes.
  Tapping outside never closes anything.
- **Fixed positioning.** Only the screen, the sheet, the tab bar, and the bars
  and cards tied to them (rest timer, update banner, toast, tour card,
  definition card) use it. §70 checks this.
- **Testing.** `tests/mobile.js` runs every setup step and every sheet on
  iPhone and Pixel profiles in WebKit and Chromium, with a toolbar, both kinds
  of keyboard and safe areas.

## Checklist for a screen

1. Every colour comes from a role token, and every size is one of the five.
2. Every gap and padding is a spacing token.
3. Tap targets are 44px. The bottom 80px stays clear. Anything over the app is the screen or the sheet, never a new fixed element.
4. There's one primary button.
5. It works in light and dark, and with a theme code.
6. Words come from the glossary, and statuses are dot plus sentence.
