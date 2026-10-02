# Claude Code prompt — batch 8: theme codes

Paste everything below the line into Claude Code from inside the `trainlog`
folder. Fits anywhere in the sequence; placed last so it doesn't jump ahead of
correctness.

---

Read CLAUDE.md first.

Add **theme codes**: short strings typed into a field in settings that restyle
the app. Fun, isolated, and a way to make the app feel personal for the people
I hand it to. Zero impact on training logic.

## Mechanics

- A text field under Edit program: "Have a code?" Enter one, tap apply. Store
  the active theme in `CFG.theme`. Default theme is `null` (current look).
- Themes are implemented as a set of CSS custom property overrides on `:root`,
  plus optional extras. The app already uses tokens for everything, so swapping
  the token values restyles it completely. **Don't restyle components
  individually — override the tokens.**
- Semantic block colours (hypertrophy/strength/peaking) must stay
  distinguishable from each other in every theme. Warning and danger colours
  must still read as warnings. Verify contrast on the readiness and joint
  displays.
- Codes are case-insensitive. Unknown code → "No theme by that name." A
  "Reset" option returns to default.
- Rides along in backups like any CFG value.

## The themes

Build these five. Each is a full token set — background, surfaces, lines, ink,
muted, accent, the three block colours, go/skip/ok. Choose the specifics; the
brief is the feeling.

**GIRLYPOP** — pink-forward and unapologetic. Soft pink surfaces, hot-pink
accent, a ribbon or bow motif in the header and on PR badges. Rounded corners
everywhere. Block colours shifted to pastel equivalents that still read as
three distinct phases. This one's for my wife and sister; make it genuinely
nice rather than ironic.

**GOBLIN** — mossy greens, dirt browns, candlelight amber accent. Slightly
heavier font weight. The toast messages get a bit feral ("set hoarded"). For
people who train in a basement and like it there.

**TERMINAL** — black background, phosphor green ink, monospace numerals, no
rounded corners, a blinking cursor after the readiness score. The three block
colours become three greens of different brightness. For anyone who thinks the
app should look like a 1983 mainframe.

**SUNSET** — warm gradients: deep plum background, surfaces shading toward
burnt orange, coral accent. Block colours in the same warm family. The softest
of the set; good in a dim room.

**HIGHVIS** — maximum contrast and legibility. Pure black and white with one
safety-yellow accent, larger base font size, heavier weights. Not a joke
theme — this is the accessibility option, and it should be the one someone
with poor eyesight actually wants.

## Also

- A tiny theme preview in settings — five coloured swatches — so people can
  see what a code does before typing it.
- Put the five codes in ALPHA.md so I can tell testers.
- Make adding a sixth theme a one-object addition. If it takes more than
  adding a token set to a list, the structure is wrong.

## Before you commit

- Syntax-check `index.html`.
- Both test scripts pass unchanged — this must not touch logic.
- Check every screen and dialog in every theme at phone width. Report anything
  unreadable.
- Bump `APP_VERSION`.
- Commit and push.
