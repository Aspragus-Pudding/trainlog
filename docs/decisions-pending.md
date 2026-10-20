# Decisions to review

Decisions taken during the batch F finish and batch H run without stopping to
ask. Each one says what the question was, what was chosen and why, and how to
undo it. The ones most worth a second look are marked ★.

---

## D1. The 21 machines the library couldn't place

**Question:** each of these existing machines is either plate-loaded or
selectorised (pin and stack). The library didn't say which.

**Chosen:** my best guess for each, as below. A machine marked plate-loaded
gets the plate calculator and the "sled or arm weight" option on its set card.
Nothing about the suggested weights changes either way.

| Exercise | Guess |
|---|---|
| Converging chest press | Selectorised |
| Incline machine chest press | Plate-loaded |
| Chest-supported row | Plate-loaded |
| Machine row | Selectorised |
| Machine shoulder press | Selectorised |
| Seated leg curl | Selectorised |
| Lying leg curl | Selectorised |
| Leg extension | Selectorised |
| Standing calf raise | Selectorised |
| Standing machine calf raise | Selectorised |
| Seated calf raise | Plate-loaded |
| Pulley belt squat machine RDL | Plate-loaded |
| Overhead tricep extension machine | Selectorised |
| Overhand grip machine rear delt fly | Selectorised |
| Sideways single-arm machine rear delt fly | Selectorised |
| Multi-hip machine hip abduction | Selectorised |
| Seated machine hip abduction | Selectorised |
| Seated machine hip adduction | Selectorised |
| Standing machine lateral raise | Selectorised |
| Seated machine lateral raise | Selectorised |
| Machine lateral raise | Selectorised |

**To change one:** tell me which, or edit `IMPLEMENT_OF` in `index.html`
(search for `IMPLEMENT_OF=`): `'plate'` or `'selector'` next to the exercise id.

---

## D2. Old Part 7 folded into H5

**Question:** build the UI pass (Edit program cards, rehab order, condition
card) now, or with the redesign?

**Chosen:** with the redesign (H5), as you said, so the layout is done once.

**To undo:** nothing to undo. It's a scheduling choice.

---

## D3. A tester README, separate from ALPHA.md

**Question:** the brief said the tester README replaces ALPHA.md where they
overlap. ALPHA.md is your guide to setting testers up; the README is for the
testers themselves.

**Chosen:** a new `README.md` for testers (install, first session, notes,
data, updates, what to do if something breaks). ALPHA.md stays as your setup
guide, unchanged except where it describes backups.

**To undo:** delete `README.md`, or merge it into ALPHA.md.

---

## D4. The Lifts tab shows your goal lifts only

**Question:** the Lifts tab always added Transformer bar squat and overhead
press cards, for everyone. They were your picks.

**Chosen:** only each person's own goal lifts. With none picked, it says how to
pick them. You lose the overhead press card unless it's one of your goal lifts.

**To undo:** in `index.html`, search for `goalIds` in `renderLifts` and add
the ids back.

---

## D5. "Copy all for Claude Code" becomes "Copy all notes"

**Question:** the button showed for anyone without a tester link, with a line
about Claude Code.

**Chosen:** renamed "Copy all notes", and the Claude Code line removed. The
copied text is unchanged, so it still pastes into Claude Code the same way.

**To undo:** search for `Copy all notes` in `index.html`.

---

## D6. Today's plan is kept for the day as a snapshot

**Question:** the briefing must be reachable from the dashboard for the rest of
the day. Rebuilding it later gives different numbers once sets are logged.

**Chosen:** it's built once, right after the check-in, and the snapshot is kept
for that day (`CFG.todayBriefing`). It's a record of what you were shown, like
the suggestion saved with each set. The next day's check-in replaces it.

**To undo:** delete the "Today's plan ›" button in `readinessCard()` (search
`data-tour='briefing'`). The briefing after the check-in still works. (Since
v1.62 the plan lives inside the readiness card, see D9.)

---

## D7. A warning with a suggested swap goes under "Holding back"

**Question:** your spec lists "condition flags with a swap suggestion" under
Holding back, but a flagged exercise can still be stepping up (bench +10 lb
with an elbow-angle warning).

**Chosen:** it's listed under Holding back, as specified, with its real change
(+10 lb) and the warning. The top line counts it separately ("1 carries a
warning with a suggested swap"), so it never claims a step back that isn't
happening.

**To undo:** in `briefRow` (index.html), drop `||flagSwap` from the hold test
to list flagged exercises in their own direction's group.

---

## D8. Each row is compared with the set its suggestion was priced from

**Question:** "what changes" can be measured against last session's heaviest
set (what the card's "Last time" line shows) or against the set the engine
actually priced from. They differ when the first set is a maintenance top set
or a top set, and comparing with the wrong one made rows contradict their own
reason ("+20 lb" next to "it repeats").

**Chosen:** the set the suggestion was priced from, so each row and its "why"
always agree. The card's "Last time" line still shows last session's heaviest
set; on those slots the two can show different numbers.

**To undo:** in `briefRow`, use `lastPerformance(...)` instead of
`lastSetFor(...)`.

---

## D9. The readiness card and the "Today's plan" card are one card

**Question:** H2 says the readiness card shows the plan's top line, and H1 put
that same line on its own "Today's plan" card. Both on one screen would say
the same sentence twice.

**Options:** keep two cards with the line repeated; or merge them.

**Chosen:** merged. On a day you've checked in, the readiness card leads the
dashboard: the plan's top line, then a dot and a sentence for each joint and
for fatigue, then a "Today's plan ›" button. Tapping the card opens the
readiness detail; the button opens the plan. Other days the card sits where
the readiness card always was, and says "No check-in yet today."

**To undo:** in `renderDash` (index.html), put back a separate card that calls
`openBriefing(todayBriefing())`, and drop the button from `readinessCard()`.

---

## D10. "Effort" replaces "RPE" everywhere on screen

**Reversed in v1.65.1, at your request.** Every on-screen string says RPE again, and the glossary entry is "RPE" (also called effort).

**Question:** the glossary label for RPE is "effort". Some lifters know RPE and
might prefer it on set badges.

**Chosen:** "effort" everywhere a person reads it: set badges ("top · effort
7.5"), card lines, explanations, the set panel stepper, stall cards, the
tutorial. Tapping "effort" on a set card shows the definition (10 = nothing
left, 9 = one rep left...). The stored data still says `rpe`.

**To undo:** put "RPE" back in the on-screen strings in index.html;
`docs/h2-strings-changed.md` lists every place. Change the glossary's "In the
app" line for Effort to match.

---

## D11. "Block" is the one name for a run of weeks; "phase" is only for rehab

**Question:** the dashboard said "Your phases / Phase 1", Edit program said
"Blocks", and rehab plans have "phases" too.

**Chosen:** "block" for the program (it was already used in most places), so
the dashboard now says "Your blocks / Block 1". "Phase" means only a step of a
rehab phase plan.

**To undo:** change the two dashboard strings back in `renderDash` and the
glossary's Block entry.

---

## D12. Other labels picked for the glossary

**Chosen:** system load → **total load**; the dial → **how hard suggestions
push**; calibrating → **settling in**; AMRAP → **all-out set** (the end-of-
strength-block one is the **test set**); MEV/MRV → **typical weekly sets**;
RIR → **reps in reserve**. "Hypertrophy" stays as the block's name and is
defined in the glossary (renaming it "Size" would touch every block label).

**To undo:** edit the label in `docs/glossary.md` and the matching on-screen
strings; `docs/h2-strings-changed.md` lists where each one is.

---

## D13. Joint lines name the movements, in plain words

**Question:** "Shoulder: pressing held" needs a plain name for the movements
each joint touches.

**Chosen:** shoulder = pressing, pulling and raises; elbow = pressing, pulling
and arm work; wrist = pressing and grip work; low back = squats, hinges and
rows; hip = squats, hinges and hip work; knee = squats and leg work; ankle =
squats and calf work (from the app's joint-to-movement table). Joints at their
usual share one line.

**To undo:** edit `JOINT_WORK` in index.html.

---

## D14. The readiness detail sheet's per-input effects

**Question:** the warm-up comes from all the answers together, so one answer
can't honestly claim "longer warm-up" on its own.

**Chosen:** an answer below average says "longer warm-up" only when today's
warm-up really is longer; a 2 says "no step-ups today", a 1 "sick day". The
warm-up row states the actual result and the score: "Warm-up: standard
(readiness 65 of 100; the score only sets the warm-up)".

**To undo:** `readinessRows()` in index.html.

---

## D15. Two small fixes found by the H2 scan

1. The soreness line in an exercise's explanation called itself "readiness 58"
   (a score) though it was the soreness cut. It now says "sore quads · load
   −10%".
2. Today's plan's top line for a soreness day could take the wrong reason
   ("Low sleep or motivation, so that work is lighter today"). It now names the
   sore muscles.

Neither changes a number. **To undo:** not recommended; both were wrong.

---

## D16. Design direction: Calm

**Question:** three directions were mocked up with the same real demo data
(`docs/design/`, 390 px, light and dark): Calm, Training-log and Warm.

**Chosen:** Calm, the default. Its set card at 390 px is the clearest: weight,
reps, effort, then Log set, with nothing repeated. Training-log shows the same
numbers twice (a big readout above the steppers), and its uppercase labels slow
reading. Warm's rounded steppers wrap their labels at this width. One
Training-log idea is worth a later look: a "last time" column beside each
planned set.

**To undo / switch:** set `DESIGN_DIRECTION` in index.html to `'log'` or
`'warm'`. Both are kept as token sets in the stylesheet.

---

## D17. Light mode follows the phone

**Reversed in v1.65.1, at your request.** Dark is the default on every phone. The light look is the theme code LIGHT, with the same light values.

**Question:** the spec asks for light and dark screenshots, but the app had
dark only.

**Chosen:** a light version of the Calm tokens that follows the phone's
setting. A theme code still overrides it. Because the app runs full screen
with white status-bar text, light mode puts the clock on a thin band of the
accent colour (the Girlypop theme already does the same).

**To undo:** delete the `@media (prefers-color-scheme: light)` block after
`:root` in index.html. Everything goes back to dark.

---

## D18. Smaller controls keep a 44 px tap area

**Question:** 44 px touch targets would make chips, small buttons and icon
buttons visibly huge.

**Chosen:** they keep their size to look at (chips and small buttons 36 px,
icon buttons 36 px), with an invisible extension to 44 px for the finger.
Chip rows are spaced 8 px apart so the tap areas never overlap.
Segmented controls hold up to 3 words, or up to 5 short numbers (the check-in
scales). Longer lists use chips; a 5-word segmented control wraps at 390 px.

**To undo:** `min-height:var(--tap)` on `.chip`, `.btn.s` and `.iconbtn`
makes them visibly 44 px.

---

## D19. "Get fit and toned" is size first, with no strength tests

**Reversed in v1.65.1, at your request.** The option is gone from setup. A skipped goal question gives size first.

**Question:** the spec maps "toned" to size-first with general-fitness
defaults, but doesn't say which defaults.

**Chosen:** the size-first profile with strength tests turned off. Its
strength blocks stay (heavier weeks are good general training), but none ends
in a test. The goal screen and the preview say that how lean you look depends
mostly on eating, which the app doesn't track. It defaults to 3 full-body
days if the schedule question is skipped.

**To undo:** in index.html, change the `toned` entry in `ONB_GOALS`, or the
`params` line in `onbResolve`.

---

## D20. Minutes per session are a guide, not a cap

**Question:** what should "minutes per session" change?

**Chosen:** the preview estimates a session's length: 2.5 minutes a set with
rest, plus 8 minutes of warm-up, both judgement defaults. If that's over your
time by more than 10 minutes, it says to skip the last exercise on a short
day. The program itself doesn't trim sessions, because a hidden cap would
change existing users' programs too.

**To undo / change:** `ONB_MINUTES_PER_SET` and `ONB_WARMUP_MIN` in index.html.

---

## D21. Equipment specifics order the exercises; they never remove one

**Question:** "gym type, then specifics." The engine only knew the gym type.

**Chosen:** the specifics are saved as `CFG.equipmentHave`. An exercise
whose equipment isn't ticked is picked last, not removed, the same as
"dumbbells only". Anything you've logged still comes first. It's unset for
everyone who hasn't been through the new setup, so their programs don't
change.

**To undo:** delete `haveScore` from `equipmentScore` in index.html.

---

## D22. Build it together: what you choose is saved per slot

**Question:** saving chosen exercises as "saved day edits" would freeze their
sets and reps, so they'd stop following the blocks.

**Chosen:** a new setting, `CFG.slotPicks` (day, slot, exercise). The
generator uses your exercise for that slot, and sets, reps and effort still
follow the block. Rep-range choices apply only to non-main lifts, as
per-exercise ranges, because main lifts must follow the block (heavier in
strength blocks).

**To undo:** delete the `picks` lines in `buildDay`. Programs then pick
exercises as before.

---

## D23. "Set up a new program" for existing users

**Chosen:**
- **What it does:** runs the same setup, starting from your current answers.
  Start restarts the program from its first block today.
- **What it keeps:** every logged set, how each of your lifts progresses
  (fast or standard, so a lift on standard is never sent back to fast), and
  any saved day edits.
- **Where it lives:** a button at the bottom of Lifts, next to "Rebuild with
  the program builder". That button still rebuilds only the rest of the
  current program.

**To undo:** remove the "Set up a new program" button in `renderLifts`.

---

## D24. In setup, the condition picker hides red flags and phase plans

**Question:** the condition cards can start a phase plan and record red
flags. Both write straight away, before you've confirmed anything.

**Chosen:** setup shows the conditions, consent and "leave these out". Red
flags and phase plans are in Edit program afterwards. Consent itself is
stored when you agree, as it always has been: it's a statement you made, not
part of the program.

**To undo:** drop `{setup:true}` from the `conditionPicker` call in
`drawOnboardingStep`.

---

## D25. Backups come after the first session

**Chosen:** the first session's summary has a "Keep a backup" block, with
Save a backup or Use a sheet. Until you've made one, the Progress and Lifts
reminder shows from then on, instead of waiting a week. Setup itself asks
nothing about backups.

**To undo:** delete the `first:true` line in `backupDue` and the
"Keep a backup" block in `openSessionSummary`.

---

## D26. Units stay pounds in setup

**Question:** "bodyweight and units."

**Chosen:** pounds, as the alpha already decided. The engine prices in
pounds, and kilograms isn't carried through every screen yet. Machines
marked in kilograms can still be switched per exercise on the set card.
Setup says so.

**To undo:** add a units question once kg is carried through the engine.

---

## D27. One guide file: tasks, then every setting, then the tours

**Question:** "expand docs/tutorial.md into docs/guide.md… tours stay generated
from their sections."

**Chosen:** the tutorial became `docs/guide.md`, in three parts:
1. **When something comes up:** 14 tasks, such as my shoulder hurts, I want
   to push harder, or I missed a week.
2. **Every setting:** one entry for each setting in `docs/features.md`.
3. **The screen tours:** as before. The "?" tours still come only from this
   part.

Lifts → How this works searches all of it, and the glossary too. It's one
file to keep up to date, and a test fails if a setting in features.md has no
entry.

**To undo:** delete the two new parts from `docs/guide.md` and run
`node tools/embed-guide.js`.

---

## D28. Small calls in the screen pass

- **Sizes and spacing:** every inline size moved to the nearest token, for
  example 13 px to 14 and 11 px to 12. Hairline offsets (1–2 px), large layout
  sizes and negative margins kept their exact values.
- **Icons:** the set card's move, info, swap and rate buttons use the icon set
  (a star was added for rating; 17 icons). Edit program's reorder buttons stay
  as text arrows, because icons are limited to the tab bar, set card actions
  and the condition card.
- **Prep exercises:** they have no "feel it" or cue text in the library, so
  each shows where you'll feel it from the area it targets ("around your
  shoulder"). Rehab exercises show what it is, where to feel it, and the first
  cue, with more cues one tap away.
- **Copy:** the countdown says "119 days to go" instead of "119 Days Out"
  (sentence case and plain words). "Last time" says "effort 8" instead of a
  bare "@ 8".
- **Fixed on the way:**
  - Unlogged set rows were 86 px tall. A class name clashed with the empty
    state.
  - The goal-lift rank number sat on its own line.
  - The header text touched the screen edge.

**To undo any one:** it's a single place in index.html; search for the old
copy or class.

---

## D29. "Last time" beside each planned set (your D16 follow-up)

**What you asked:** a faint "last time" value beside each planned set on the
set card, from the set the suggestion was priced from (the same rule as D8).

**Chosen reading:** a suggestion is priced from one set, but a card has
several planned sets, so each row shows the set in the same place from that
set's session.
- **Which session:** the one holding the set the suggestion is priced from,
  using D8's rule. That's the latest set on the pricing history, and a top set
  reads the top-set history.
- **The top row:** last time's top set.
- **The rows after it:** last time's working or back-off sets, in order.
- **Gaps:** a row last time didn't have stays "—".
- **Today:** sets logged today never count.
- **Where:** live set card only; the preview cards before you start don't
  show it.

**To change:** `lastTimeRows()` in index.html, for example to show the one
priced-from set on every row.

---

## D30. The mobile fix is one structure, not another patch (v1.67)

**Root cause:**
- **Next out of reach.** Setup and every popup lived in a modal dialog whose
  sheet was sized in vh. The vh unit is the height without the browser
  toolbars, and iOS doesn't shrink the layout for the keyboard. So the
  keyboard covered Next on every setup step, and on short iPhones the
  toolbar and home indicator cut it off.
- **Leaving setup.** Android back closed the setup dialog on its second
  press, and there were no history entries, so back left the app. Setup
  answers lived only in memory.

**Chosen:** one primitive. A full screen for setup and one sheet for
everything else, both sized to the visible viewport. Each has a scrolling body
and a footer in normal flow. Back pops in-app history entries, and setup is
kept as a draft. The tab bar's companions are counted as part of the
primitive in the lint test: the rest timer, update banner and toast at the
bottom, and the tour and definition cards. Moving them into a single layer
would be a bigger refactor for no visible gain.

**To undo:** not recommended. The pieces are `syncViewport`, `sheet`/
`liftFooter`, `screenOpen`, `navPush`, `onbSave` and the CSS block marked "The
layout primitive".

---

## D31. Pinch zoom is allowed again

**Chosen:** the viewport meta loses `maximum-scale=1`. That setting was there
to stop the iPhone zooming into small inputs, and inputs are now at least 16px
so it isn't needed. Leaving it in also blocks pinch zoom on Android, which is
an accessibility problem. Double-tap zoom on buttons is turned off with
`touch-action:manipulation`.

**To undo:** add `, maximum-scale=1` back to the viewport meta.

---

## D32. What back and tapping outside do

**Chosen:**
- **Back on a read-only sheet** (info, guide, today's plan) closes it.
- **Back on a sheet with something to type or set** asks first: "Close this
  without saving?" Saying no keeps it open.
- **When Android won't let a close be refused** (a second back with no tap in
  between), the sheet opens again with what you typed still there.
- **Tapping outside a sheet** closes nothing. Your brief allowed it for
  read-only sheets; never is the safest choice.
- **Back on a setup step** goes to the previous step.
- **Back on the first setup step** asks before leaving setup.

**To undo / change:** `sheetBack`, the `cancel` and `close` handlers on
`#dlg`, and `onbRootBack`.

---

## D33. How the setup draft works

**Chosen:**
- **When it's saved:** after every change, not only every step, in
  `CFG.onbDraft`. That's a setting and never the log, and it rides along in
  backups.
- **Reopening the app:** a new user who hasn't finished setup sees "Continue
  setup" or "Start over".
- **After leaving on purpose:** "Exit setup" keeps the draft, and a dashboard
  card offers to continue. An existing user's "Set up a new program" also
  resumes from that card.
- **Starting:** Start first session clears the draft.

**To undo:** remove `onbSave` from `drawOnboarding`. Setup then starts over
each time.

---

## D34. The status bar stays white-on-colour

**Chosen:** `apple-mobile-web-app-status-bar-style` stays
`black-translucent`: white clock and the app drawn under it. That's right for
the dark default, and the LIGHT theme already puts an accent band behind the
clock. The status bar style can't switch with the theme on iPhone, because
it's read once when the app is opened.

**To undo:** change the meta to `default` (a white bar with a black clock).
That looks wrong in dark.

---

## D35. Errors go into the notes, and stay there until sent

**Chosen:**
- **What's recorded:** every uncaught error, plus anything the screen and
  popup safety nets catch, becomes a note. It's tagged "Error the app
  recorded", with the screen and version.
- **Limits:** one per distinct message an hour, and ten a day.
- **Sending:** nothing is sent on its own. Testers get a "Send to the
  developer" button on each one, and you see them in "Copy all notes".
- **Backups:** they're notes in the log, so an automatic backup to a
  tester's own sheet includes them, the same as their other notes.

**To undo:** remove the `error` and `unhandledrejection` listeners and the
`logError` calls in `render` and `sheet`.

---

## D36. How the phones are tested

**Chosen:**
- **The harness:** `tests/mobile.js` uses Playwright (installed separately,
  not part of the repo).
- **Profiles:** iPhone SE, iPhone 13 and iPhone 15 on WebKit; Pixel 7 on
  Chromium; plus one cross-engine pair each way.
- **How the hard cases are played:**
  - The toolbar and the Android keyboard shrink the page.
  - The iPhone keyboard shrinks only the visible viewport, through a hook the
    app reads (`window.__vvOverride`).
  - Safe areas are CSS variables the layout uses.
- **What it can't show:** real iOS toolbar animation and the real keyboard.
  The 5-minute real-phone checklist in the report covers those.

**To change:** `PROFILES` and `CASES` at the top of `tests/mobile.js`.

---

# Big batch, 12 Oct (Appendix A first, then Parts 1–8)

## D37. Which exercise is current: the written rule's edges (v1.68)

**Question:** your four rules leave a few edges open.

**Chosen:**
- **First unfinished means anywhere in the list,** including above the
  exercise you just finished. Finishing one goes to the first exercise in
  list order with sets left, not the next one down. Before, it went to the
  next one down.
- **Tapping the open card closes it** and keeps it closed through reorders,
  until you tap a card.
- **A finished card can still be opened with a tap** (to add a set), and
  stays open until you tap another or log a set on it.
- **Swapping the exercise you're on keeps you on it.** Swapping another one
  leaves the set panel and what you've typed alone. Before, swapping any
  exercise reseeded the set panel with the swapped one's numbers.
- **Open sessions from before the update** keep their open card. The rule
  applies from the next change.

**To undo:** `ruleCurrent()` in index.html is the whole rule; CLAUDE.md's
"Recurring bugs" section says what it must do.

---

## D38. Edits merge, and an edit equals delete-and-relog of the last set (v1.68.1)

**What was wrong:**
- **Edits replaced each other.** A later correction replaced an earlier one,
  so editing reps and then RPE on one set lost the reps after a reload. Your
  log has one: a rear delt fly on 20 Sep, edited to 20 reps and then RPE 8.
- **No recompute.** Editing never recomputed the next-set suggestion.
- **The edit touched the logged set.** It changed the in-memory copy of the
  logged event itself.
- **Some readers skipped corrections:** the dial's revealed side, the "why
  these numbers" card and the focused deload's reference load.

**Chosen:**
- **One replay rule:** corrections merge in log order, and a delete is final
  (`correctionMap()`, `corrected()`).
- **Same rule everywhere:** sets(), the backtest and AppsScript.gs. Every new
  edit also writes the set's full corrected values, so a backup sheet still
  running the old script reads new edits the same way. Redeploying the script
  only matters for sets edited twice before this version.
- **What "identical" means:** editing the *last* set equals deleting it and
  logging the same numbers, in every reader (§72, 160 random logs).
- **Earlier sets differ, by design.** Deleting an earlier set and relogging
  it makes it the newest set, so the next-set suggestion then prices from it.
  Edit keeps it in its place, which is the right answer.

**Backtest:** one row moved, the 20 Sep rear delt fly. The suggestion now
prices from the 20 reps you entered. That row's reps error went from 10 to
0; nothing else changed.

**To undo:** not recommended. `correctionMap()` is the one place the rule
lives.

---

## D39. Plain words in the workout (v1.69)

**Chosen:**
- **One chip on the set card.** A flagged exercise shows "For your shoulder ›"
  (or knee, elbow and so on). It's amber, red, grey for a standing cue, or green
  once you've rated it fine. Tapping it opens the info sheet's "For your
  shoulder" block: the reason, the cues, what to do if it hurts, and the
  suggested swap, with a Swap button when nothing's logged yet.
- **The condition reminder is gone from the top of the workout** ("Elbows in
  front today · Anterior shoulder instability"). You asked for it to go; the
  same cue is in each flagged exercise's info sheet.
- **One plain-words pass.** Library and flag text goes through `plainText()`
  wherever it's shown: apprehension becomes "feeling it might slip",
  abduction with external rotation becomes "arm out wide and turned back",
  and so on. The flag reasons the app writes itself were rewritten by hand.
  The condition picker keeps the clinical name, and so does the guide.
- **The banned list** is `CLINICAL_WORDS`. The screen scan fails on any of
  them on the Workout tab, the Dashboard and what they open, and §73 runs all
  1,000+ library and flag texts through it. Exercise names are exempt:
  "hip abduction machine" and "band external rotation" are gym words.
- **No more made-up "Feel it".** The prep list has no real "where you'll
  feel it" text, so prep shows none. Rehab exercises keep theirs.
- **Flags didn't change.** Same levels, same exercises, and the shoulder
  instability rows are exactly as strict. Only the wording moved.

**To undo:** in index.html, `flagChip` back to `flagLine` (from git history),
and `preSessionBanner(v)` back in `renderWork`.

---

## D40. App errors and tour cards (v1.69.1)

**Chosen:**
- **App errors are grouped.** Notes the app recorded (tag "error") are a
  collapsed "App errors" group under your own notes. The open count counts
  only your notes. "Copy all notes" lists the errors last, under their own
  heading. The diary never showed them. Testers still get "Send to the
  developer" on each one.
- **Tour cards were already fixed by v1.67.** On v1.67.0 every tour step
  fitted on the four phone profiles in `tests/mobile.js`, so nothing needed
  fixing. As a guard, a card is now capped at the visible height and scrolls
  inside itself, with its buttons stuck to its bottom. Scrolling a sheet now
  re-places the card too.
- **Every tour step is tested.** `tests/mobile.js` walks every step of the
  five screen tours, on a normal screen and on a short one with toolbar and
  safe areas. For each step it checks the card fits, the button can be hit,
  and a touch or scroll inside the card doesn't end the tour.

**To undo:** `ERRORS_OPEN` and the `errs` group in `renderHist`; the
`.tourcard` max-height.

---

## D41. The Workout tab is the one editable preview (v1.70)

**Chosen:**
- **One list.** Before a session the Workout tab shows today's exercises
  with the live cards: move up or down, info, swap, sets ±, Modify and
  Remove. Each planned set shows the suggested numbers, with last time
  beside them. The separate "Preview workout" sheet and button are gone.
- **Today only by default.** Edits go to today's plan, as before. "Save to
  program" is a button now; it used to be a checkbox you had to tick before
  editing. It writes the day edit, and asks first.
- **A day you've already saved** showed a line with "Use the generated plan".
  Removed in v1.85.1 at your request (17 Oct): a saved day stays saved, and
  there's no button back to the generated plan. To undo, restore that block in
  `renderPreview` from v1.85.0.
- **The "Recent" card is replaced** by the one line the brief asks for:
  "Last Upper B: 5 days ago, 2 PRs". It opens that session. The rest of
  your history is in Progress.
- **Remove is preview only.** The live session still has no Remove (lower the
  sets to what's logged instead), because removing an exercise mid-session
  would orphan its logged sets.

**To undo:** `renderPreview` and `planCard` in index.html. The old
`openWorkoutPreview` is in git history (v1.69.1).

---

## D42. The readiness card's numbers (v1.71)

**Chosen:**
- **Joints use 0 to 3, not "/ 5".** The check-in records joints as none,
  mild, moderate or bad, so the card says "Shoulder 2 / 3 (usual 1)". A
  5-point number would invent precision the check-in doesn't have.
- **The four readiness bands are the warm-up thresholds** the app already
  uses: 85+ Great (short warm-up), 65–84 Good (standard), 45–64 Below par
  (longer), under 45 Rough (longest). What changes load, the no step-ups and
  sick-day rules, is said on the same line, because the score itself only
  sets the warm-up (D14). The sheet says the cut-offs are the app's judgement,
  not research.
- **The score shows only on a day you checked in.** Other days the card
  says there's no check-in yet, plus the joints.
- **Fatigue appears only when a sign is showing.** Saying "no signs" every
  day made the card cramped.
- **The H2 rule holds:** every number and band word sits next to what it does.

**To undo:** `readinessCard`, `READY_BANDS` and `jointLines` in index.html.

---

## D43. Setup wording and the home gym (v1.71.1)

**Chosen:**
- **Commercial gym** is the old "A bit of everything". It keeps the same id
  (`mixed`), so nobody's saved answer changes.
- **Home gym** is new: barbell, rack, bench, dumbbells and a pull-up bar,
  ticked by default. Machines and cables go last, never out, the same rule as
  dumbbells only. If you untick the pull-up bar, pull-ups and chin-ups go last
  too. That rule only applies to the Home gym answer, so no existing tester's
  program moves.
- **Barbell gym stays,** next to machine-heavy and dumbbells only.
- **"Recommended" is on Build it together.** Build it for me uses your
  wording, including "we'll". That's the only place the app says "we"
  outside the injury consent.

**To undo:** `ONB_GYMS`, `EQUIPMENT` and the two `card(...)` lines on the
welcome step.

---

## D44. "I know my numbers": a recent set (v1.72)

**What was wrong:**
- **0 was refused.** The field wouldn't take 0 (anything not above 0 was
  thrown away), and it asked for a weight when it should ask for reps.
- **The estimate wasn't read.** A class lift's estimate was saved under the
  exercise (`assisted_pullup`), but suggestions read the movement's track
  (`pullup`), so it was never used.

**Chosen:**
- **Weight × reps** with chips for 1, 3 and 5 reps. The estimated max is
  `e1rm()` on that set, the same formula as every logged set.
- **The rep limit is 15, with a note past 10.** "Accept up to 10 with a note
  above 10" can't both hold. The formula works up to 15 reps, so the app
  accepts up to 15 and says "estimates get rough past 10 reps".
- **The bodyweight class** picks bodyweight only, added weight or
  assistance. The set becomes total load with your bodyweight (minus
  assistance × the machine's ratio). It's stored on the movement's track,
  so every version of the lift reads it. With no bodyweight yet, it says so
  instead of guessing.
- **Saved as a stated estimate** (`e1rm_estimate`), never a fake set, with
  what you typed alongside it.
- **Edit program:** each goal lift shows its estimate and where it came
  from. A lift with no log gets "Enter a recent set", which saves straight
  away, like logging.
- **Old estimates:** one saved under an exercise still counts. A numeric
  answer in an unfinished setup draft is kept as you entered it.

**To undo:** `estimateFromSet`, `knownSetInput` and `openKnownSet` in
index.html.

---

## D45. Appendix A Part 0: what was already settled, and the two left (v1.72.1)

- **D16 ("last time" beside each set)** shipped in v1.66.
- **D17 (an Auto / Light / Dark setting)** wasn't built. On 9 Oct you asked
  for dark as the default and light as a theme code, and that's what
  shipped in v1.65.1. A setting would undo your later choice. In Part 2 the
  Settings tab's Appearance holds the theme code (LIGHT) and the reset.
- **D10 (RPE or effort)** is built as a setting. Your own reversal was about
  what the app says by default, and that's still RPE.
  - **Defaults:** setup picks "effort" for "new to lifting" and "novice", and
    RPE for "intermediate" and "advanced". "2+ years" isn't a question, and
    those two answers are the nearest. Anyone who has logged RPE keeps RPE.
  - **How it works:** one pass swaps the word in every newly drawn text, so
    no screen can miss it, and it keeps a capital at the start of a
    sentence. Your notes, diary and setup notes are marked to be left alone.
    The data still says `rpe`.
- **D21 (a chip for equipment you didn't tick)** is built. When the
  generator falls back to an exercise whose equipment you didn't tick, the
  Workout tab's card and setup's preview say what it needs. It uses the same
  rule as the ranking (`equipMissing`).

**To undo:** `effortPass`/`wordsBlock` (D10), `equipMissing`'s chip
lines (D21).

---

## D46. The strength ↔ size slider (v1.73)

**Chosen:**
- **0 to 100 in steps of 5,** with the five goals at 0, 25, 50, 75 and 100.
  Each stop is exactly that goal.
- **Between stops** the strength share blends in a straight line. Strength
  tests, peaking and exercise specificity come from the nearer goal: they're
  choices, not amounts, so a "half" doesn't exist.
- **A fix in the block sequencer.** Between Size first and Pure size on a
  short plan (10% strength, no tests, 12 weeks), it found no layout and
  returned an empty plan. It now falls back to hypertrophy blocks only, as
  Pure size does. None of the five goals reached this case, so no existing
  program changes.
- **Edit program re-plans from the next block.** Moving the slider re-plans
  the blocks after the current one, the same way "Rebuild the rest" does,
  and the cards show it straight away. Saving keeps it; Cancel drops it.
  Other unsaved block edits in the same visit are replaced when you move it.
- **The position is kept** as `CFG.profileSlider`, so it rides along in
  backups.

**To undo:** `profileSlider`, `sliderParams` and the `set-balance` block in
`openSettings`.

---

## D47. Readable themes (v1.74) ★

**Every built-in theme failed something,** the default included. For
example, white text on the default blue button was 3.2:1, and Terminal's
"ok" chart colour was the same green as its accent.

**Chosen rules,** one list in index.html (`THEME_RULES`) that §80 runs on
every theme:
- **Text** at 4.5:1. That covers secondary text, warning text, links and
  block-colour labels.
- **Captions and dates** (`dim`) at 3:1. They're the tertiary meta line, and
  4.5 would make them as loud as secondary text.
- **Shapes** at 3:1: button shapes, status dots and chart marks.
- **Chart colours** that share a chart at least ΔE 20 apart.
- **No saturated text on a saturated background.**

**What changed to pass:**
- **The default.** One new token, `--accent-fill` (#2F6FEB), for buttons and
  selected chips. Links keep the bright #4C8DFF; no single blue can carry
  both. `dim` and the deload label are a shade lighter. Text on block
  colours is dark.
- **The built-in themes.** Each failing colour had its lightness nudged until
  it passed, keeping its hue. Three colours were picked by hand:
  - **Goblin's warning gold** is paler (#F7DA80), so it isn't the same as the
    amber accent.
  - **Terminal's "ok"** is a pale phosphor (#B6FFC8), not the accent green.
  - **High visibility's warning** is orange (#FF9F1A), not the accent yellow.
- **Every theme now names its caution colour,** rather than mixing one in CSS.

**Custom codes:** your brief asked for custom codes, and there weren't any,
so a colour code (`#RRGGBB`) is now a theme. It's the standard look with that
accent, nudged until it passes, and the theme card says when it adjusted
anything.

**To undo a colour:** edit it in `THEMES` (or `:root` and `DEFAULT_TOKENS`
together). §80 says which rule it breaks.

---

## D48. Voice packs (v1.74)

**Chosen:**
- **Three voices** in `docs/voices.md` (embedded like the guide): Goblin,
  Terminal (your "1983") and Girlypop. Each has 6 to 8 lines for each of
  nine moments: check-in greeting, session start, set logged, new best,
  rest done, session saved, a weeks-in-a-row streak, empty states and the
  What's new title.
- **No exclamation marks,** per the app's copy style, even in a voice.
- **Toasts:** only "Set N logged", "New best…", "Rest done" and "Session
  saved" can be voiced. Goblin's old reword list is gone, because it also
  reworded data messages ("Backup downloaded", "Set deleted").
- **The streak line is new,** in plain words too: "3 weeks in a row with a
  session" on the session summary from two weeks on.
- **Safety:** §81 checks that no voice line mentions pain, injuries,
  safety, errors or data. It also checks that every other toast in the app
  passes through untouched, and that safety copy never goes through
  `voice()`.
- **The setting:** "Use this theme's voice", on by default (`CFG.themeVoice`).

**To edit:** `docs/voices.md`, then `node tools/embed-guide.js`.

---

# Big batch Part 1

## D49. Which rep range applies (v1.75) ★

**The cause, found in your log:**
- **Frozen copies.** Every stored slot kept a copy of its range from when it
  was stored. That covers saved day edits, today's edits, the week editor and
  a session's slots.
- **Swaps kept the old range.** Swapping an exercise in kept the range of the
  one it replaced. On 12 Oct your pushdown showed 6–10, the range of the slot
  it went into, until saving the editor rewrote the copies.

**The fix:**
- **One rule,** in `slotRepRange()`, applied on read everywhere. CLAUDE.md
  has it under "Recurring bugs".

**Your call, as the brief set it:**
- **Main lifts follow the block.** A main lift is a goal lift in a primary
  slot. Your incline machine (a goal lift with 10–15 set) follows the block
  on the days it's the main lift. On the days it's a secondary lift, 10–15
  applies. Your deadlift's 3–8 works the same way.
- **Your past sets don't change.** Each logged set keeps the target it was
  logged against, so the backtest is identical.

**To undo:** in `slotRepRange`, drop the `main` branch (main lifts then take
your range too).

---

## D50. The strapped deadlift: your usual variant (v1.76) ★

**Exact cause of 93 vs 120 kg:**
- **Straps are a modifier,** and a modifier keeps its own history.
- **Your 120 kg sets (8 and 12 Oct) are on the "with straps" track.**
  Progress, goal tracking, the stall check and the plain deadlift slot all read
  the plain track, whose best and latest set is 93 kg × 6 (15 Sep).
- **Confirmed on your log:** today the app shows 93 kg × 6. With strapped set
  as your usual, it shows 120 kg × 6.

**Chosen:**
- **`CFG.usualMods`, one usual variant per exercise.** You set it on the
  info sheet with the same editor as Modify.
- **A planned slot with no variant chosen gets the usual,** so suggestions
  and Today's plan price from that history.
- **"The lift" means the usual track everywhere:** best sets, the goal card,
  the stall engine and the info sheet's best and last set.
- **Numbers name the variant** ("· with straps"). The goal card and info
  sheet list the other versions you've logged ("Also logged: plain: 93 kg ×
  6").
- **Choosing plain for one session stays plain** for that session.
- **The proposal:** three sessions in a row the same way makes the app ask.
  You have two strapped sessions, so it'll ask after the next one; or set it
  now on the deadlift's info sheet. It never switches on its own.
- **Engine pricing doesn't change:** a slot's own track is read exactly as
  before, so the backtest is identical.

**To undo:** clear the usual on the info sheet (back to "the plain
version"), or remove `withUsual` from `withReps`.

---

## D51. Rest per exercise (v1.77)

**Chosen:**
- **Defaults inside your ranges,** as judgement values: 4:00 for squats and
  deadlifts as main lifts, 3:00 for other main lifts, 2:30 for other
  compounds, 1:45 for isolation.
  - **The research:** `docs/research/strength-programming.md` has no rest
    section. The published work they sit inside: longer rests beat 1 minute
    for strength in trained lifters (Schoenfeld et al. 2016; Grgic et al.
    2018), and for size the benefit flattens past about 60–90 s (Singer et
    al. 2024).
- **Your squat and deadlift at 4–5 minutes.** The default for them as main
  lifts is 4:00. For 4:30 or 5:00, tap it on the info sheet, or add 30 s
  on the rest bar and tap "Always". Your phone's settings can't be changed
  from here.
- **The offer:** "actual rest" is the median gap between an exercise's
  working sets in a session (gaps over 10 minutes are breaks). Three
  sessions in a row at least 25% longer (or shorter) than the timer, plus
  15 seconds, makes the app offer once to match.
- **"Always" on the rest bar** appears only after you've changed the time
  for that rest.

**To undo / change:** `REST_DEFAULTS` and `restFor` in index.html.

---

# Big batch Part 2

## D52. A Settings tab, and a training-only Edit program (v1.78)

**Chosen:**
- **Five tabs fit at 375 px** with labels, checked on iPhone SE. No header
  icon needed.
- **Settings applies straight away,** with no Save. Edit program keeps its
  draft and Save, because a program change is big and is recorded as one.
- **What moved to Settings:**
  - your sheet address, setup link and name;
  - the whole backups card from Lifts;
  - theme codes;
  - the voice switch;
  - RPE or effort;
  - equipment (new to edit outside setup);
  - a list of exercises with their own rest;
  - help (the guide, every screen's tour, the first-session hints, hidden
    checklists);
  - about (version, diagnostics, what's new by version);
  - reset and erase, as a "Start over" card that confirms first;
  - maintainer tools, owner only: open the demo.
- **Units stay pounds** (D26). Settings says so, because kilograms aren't
  carried through the engine yet.
- **Notifications:** the app has none, so there's no section.
- **Energy balance, back-off sets, "how hard suggestions push" and stall
  handling stay in Edit program.** They're training, though the brief's
  list didn't name them.
- **A bug the move removes:** Edit program's Save used to rewrite the sheet
  address and your name from the draft. That could undo a change made
  elsewhere. Those fields are gone from it.

**To undo:** the `set` tab's markup, `renderSettings`, and the blocks put
back into `openSettings` (git history, v1.77.0).

---

# Big batch Part 3

## D53. Setup's own place, "How your program works", tours (v1.79)

**Chosen:**
- **Setup already had its own screen** in v1.67 (no tab bar, nothing behind
  it). What's new is the header: one count across the path ("Step 3 of 9";
  13 steps in Build it together) with a thin bar. The plan preview is the
  last step.
- **The walkthrough sits inside setup,** between the plan and the first
  session, so it's still its own place. The preview's button is Next, every
  card has "Skip and start", and the last card starts the first session.
- **Six cards,** each with one example from your plan, in an "In your
  plan" box:
  1. your first four blocks;
  2. your first day's exercises;
  3. your main lift's range and RPE, and what makes it step up;
  4. your condition's joint;
  5. a flagged exercise from your first week;
  6. where help is.
- **The words** follow your RPE-or-effort setting.
- **Replay** is Settings → Help → How your program works. It's built from
  the live program.
- **Tours:** End tour replaces Skip, and Back is there from step two. The
  first card says "A tour of this screen only"; the first-session hints
  start with "Hints for the whole app".

**To undo:** `howCards`, the `how` step, and `onbSteps` in index.html.

---

## D54. First-time tips (v1.80)

**Chosen:**
- **Cards in the page,** never a new overlay, so the v1.67 rule holds
  (nothing new with fixed positioning). Each sits where its moment happens:
  - the check-in sheet;
  - the set card, for a suggestion priced from your last set, or an all-out
    or test set;
  - the dashboard top, for a new block's first week, a deload, or a joint
    above your usual;
  - above the dashboard cards, for the first stall or focused-deload card;
  - the workout, while the first rest timer runs.
- **"Fires once":** the first time the moment happens it's recorded
  (`CFG.tipsSeen`). The card stays until you tap Got it, even across
  redraws, and never fires again until Reset tips.
- **For people already training:** the moments that are true now (you're
  past your first block, a joint is above usual) show once on the next
  visit. That's the once.
- **"A suggestion changes from what you lifted"** shows on the first set
  card whose suggestion comes from a previous set, whichever way it moved,
  and explains up, hold and down together.

**To undo:** `TIPS` and the `tipCard(...)` calls in index.html.

---

## D55. Demo "Jump to…" (v1.81)

**Chosen:**
- **A jump rebuilds the same made-up lifter** with the weeks of training that
  lead to the block and week you pick. Program position counts sessions,
  and the made-up lifters attend every session, so the weeks land there.
- **Shortcuts:** the first strength block, a test-set week, a deload week
  and a stall. The stall uses "Stalls at week 8", 12 weeks in, because a
  stall needs a lifter who stops progressing.
- **Copied real log or fresh install:** Jump to asks you to pick a made-up
  lifter first. It only rebuilds made-up lifters.
- **Testing:** the demo clock only moves in a real browser (it swaps
  `window.Date`), so `tests/mobile.js` checks that a jump lands on the
  chosen week, on WebKit and Chromium.

**To undo:** `demoJumpTargets` and the `djump` block in `openDemo`.

---

# Big batch Part 4

## D56. The number audit (v1.82)

The full table is in `docs/number-audit.md`: 39 items, each kept, changed or
removed, with the one-line reason.

**Worth a second look:**
- **The intensity % line in Edit program is gone.** It was the generator's
  internal load target. The sets sentence says what changes week to week.
- **"Typical weekly sets"** is now one sentence: this week's planned sets
  for the muscle, against the typical range, called "a rough guide, not a
  rule". Before, it was three grids of numbers that looked like science
  (they're Grade D landmarks).
- **% of your best** only shows on main lifts.
- **The session summary's headline cell** is new bests instead of tonnage.
- **Kept on purpose:** the readiness and joint numbers (each with what it
  does), 3RM/5RM/10RM (for picking a weight), and suggestion accuracy (fit,
  not obedience).

**To undo any one:** each is one place in index.html; the table names it.

---

# Big batch Part 5

## D57. Warm-ups that fit the day (v1.83)

**Chosen:**
- **Three inputs, in your order:**
  - **The day's main lifts** (primary slots and goal lifts, the first two).
    Each maps to the areas its movement loads: squat → hips, knees, back;
    hinge → hips, back; presses and pulls → shoulders and upper back. That
    mapping is a judgement default.
  - **Then your conditions.**
  - **Then today's sore or flagged areas.**
- **The cap is kept** (3, 5 or 7 by readiness), with one change: each kind
  present gets a place first (two for the main lifts), then the rest fill in.
  A strict "main lifts first" would have filled a 3-item warm-up with hip
  prep and dropped your shoulder prep.
- **Your own items always come,** after the suggestions and outside the cap:
  this day's, then every session's, in your order.
- **Custom items** are a name, an area, warm-up or rehab, an optional dose and
  cues (`CFG.prepItems`). Rehab ones join the after-training block.
- **"Don't suggest"** is remembered per day, or for every session
  (`CFG.prepPlan`). Turned-off items can be brought back from the editor.
- **No new library entries.** The library's prep list was enough to cover
  each main-lift family.

**To undo:** the old `buildPrep` is in git history (v1.82.0).

---

# Big batch Part 6

## D58. Ready for testers (docs, no app change)

**Chosen:**
- **README.md (for testers)** is rewritten for this batch:
  - the setup link now goes in Settings → You and your sheet;
  - the "How your program works" cards and first-time tips;
  - the Workout tab as today's editable workout;
  - RPE or effort;
  - the "For your shoulder" chip;
  - Settings → About for the version and diagnostics;
  - App errors in Notes;
  - Android install.
- **docs/real-phone-checklist.md** is the 10-minute check from v1.67,
  updated for the new screens (15 steps).
- **docs/tester-welcome.md** is a message to send with each tester's own
  link: what it is, how to install, what to expect, and how to send notes.
- **ALPHA.md** points at Settings for the setup link and diagnostics.
- **No version bump.** Nothing in the app changed in Part 6, so there's no
  CHANGELOG entry; that's reserved for what a user would notice.

**To undo:** the files are docs; git history has the earlier versions.

---

# Big batch Part 7

## D59. Rehab and prehab as tracked exercises (v1.84.0) ★

**Chosen:**
- **Its own event, `rehab_set`**, not a `set` with a tag. A `set` reaches
  `sets()`, and from there volume, bests, the dial and the engine; keeping rehab out
  structurally means no reader has to remember to skip it. Each event records the
  exercise, mode, sets, reps or seconds, load, a slow lowering, pain (0–10),
  quality and "felt unstable". Corrections apply as for sets.
- **Feel it: 10 days and 3 sessions** at one easy dose. Both are needed, and only
  pain and quality count. (The brief says 1–2 weeks; 10 days is in that range.)
- **One step every 7 days at most** (the brief says every 1–2 weeks; 7 days is
  the faster end of it). The order is reps (+2, up to 15), then a 3-second
  lowering, then the smallest load step (back to 10 reps). Holds go +5 s up to
  45 s.
- **The pain gate is the injury library's rule** (`painRule`) for your
  conditions: "ok" or "amber" is within the limit, and "felt unstable" is always
  over. A custom item gets the general rule (no condition passed in).
- **"Back to usual by the next morning"** means the next check-in rates that
  joint at or below your usual (`jointBaseline`). Two steps over your usual is
  a flare. With no check-in since, the session isn't held against you.
- **A flare steps back one level and holds for 7 days.**
- **Prehab:** +1 rep a week, then load, with the same pain gate and no feel-it
  stage.
- **Graduation is a proposal** after 21 days and 6 sessions, at the top of the
  dose, with pain at 2 or less. Accepting it sets `CFG.rehabMode`. Rehab and
  prehab chips in the block switch the mode by hand.
- **History** is one card in Progress ("Rehab and prehab · not training volume"):
  sessions, the last dose, the next dose, and pain over the last 6 sessions.

**Worth a second look:** the 7-day step and the 10-day feel-it stage are the
quick end of the brief's ranges. Both are constants (`STEP_DAYS`, `FEEL_DAYS`).

**To undo:** the old block ticked items without logging them (v1.83.0). Any
`rehab_set` events already logged stay in the log and are ignored by the old code.

---

# Big batch Part 8

## D60. Explore day, shown as "Try new exercises" (v1.85.0) ★

**Chosen:**
- **Main lifts keep their slot.** Their weekly exposure is what progression,
  the fast/standard rate and the stall checks read. Practice and intervention work
  stay too. Everything else is explored when something new fits.
- **Options:** never logged (by movement, so assisted and weighted pull-ups count
  as one), same pattern, and training the slot's main muscle directly. Each
  must suit your equipment, and can't be excluded, rehab, manual-only or a
  specialty bar. Your equipment ranks first, then a different implement from the
  one it stands in for. At most 3 options and 3 sets, capped at RPE 7 (the RPE
  cap is from the brief; the counts are judgement defaults).
- **Nothing the injury library marks red for one of your picks is offered as a
  first try.** Amber ones are offered, with their chip. This departs from "flags
  never steer generation", in the safer direction: Explore suggests exercises you
  haven't tried, and a red one is a poor first try. You can still add any
  exercise yourself.
- **What counts:** sets carry `explore:true`. They count as volume and the
  session counts toward the week and the rotation. Suggestion accuracy and the
  dial skip them, and so does `tests/prospective.js`. An exercise you only
  explored doesn't count toward the auto-pick until you keep it
  (`pickExposure`), so trying something once doesn't quietly replace a slot.
- **Keep any of these?** is in the session summary, and stays as a dashboard
  card for 21 days until answered.
  - **Use instead** sets the slot's pick (`CFG.slotPicks`), or the saved
    day's slot if you have one.
  - **Take turns** adds it to `CFG.rotation` {day: {exercise: [others]}}: one
    each time you train that day, counted from your sessions. The Workout card
    shows "Takes turns with …" and a Stop button.
  - **Forget** records the answer only.
- **Offered** as a proposal in week 1 of each block and in a deload week, once each
  (keyed by block), and not within 7 days of another Explore day. Also any day
  from Workout → Train a different day → **Try new exercises today**: tucked
  away there on purpose, because it's for now and then (your call, 17 Oct). The
  name says what it does; "Explore" stays only as the internal name.
- **The summary's "Compared with last time"** is skipped for an Explore day; the
  previous normal session isn't comparable.

**Worth a second look:** keeping red-flagged exercises out of the options, and
the main lifts staying put (an Explore day in a deload week still includes your
squat at its deload dose).

**To undo:** v1.84.0 has no Explore day. `CFG.exploreKept`, `CFG.rotation` and
any slot picks it set stay harmless: delete `CFG.rotation` to stop taking turns.

---

# Batch M: an identity of our own

## D61. The name in one place (v1.86.0)

**Chosen:**
- **`APP_NAME`** sits next to `APP_VERSION`. Everything on screen reads it: the
  header line, setup's welcome, backups (the share title and the file name, via
  `APP_SLUG`), the restore check's message and the diagnostics.
- **Docs embedded in the page write `{app}`** (`docs/guide.md`, and any new
  glossary, voice or What's new text). `named()` swaps in the name when they're
  read. The embedded copies stay byte-identical to the files.
- **`tools/set-name.js`** copies the name into what a script can't reach: the
  `<title>`, the new `apple-mobile-web-app-title` meta (the home-screen label on
  iPhone) and the manifest's `name` and `short_name` (cut to 12 characters).
  Renaming is: change one line, run the tool.
- **Never renamed:** storage keys (`trainlog.jsonl.v1` and the rest), the demo
  prefix, event types and the backup format. A rename can't touch data. §93 loads
  a renamed build and restores a backup from the old one.
- **Left alone:** old CHANGELOG entries past the 12 shown in the app (history),
  README.md and the repo's docs (for people, not the app), and comments.

**To undo:** the strings were literal "Trainlog" in v1.85.2.

## D62. Today and Train, our own tab icons, no borrowed phrases (v1.87.0)

**Chosen:**
- **Tab names live in one list, `TAB_LABEL`**, which the header, the tour chips and
  the guide's tour picker read. The internal tab ids (`dash`, `work`) stay, so
  nothing stored or linked changes.
- **Icons:**
  - Today is a sunrise.
  - Train is a plate seen face-on.
  - Lifts is stepped bars.
  - Settings is two sliders.
  - Progress keeps its trend line.

  They're stand-ins drawn in the current style; Part 3 restyles all icons with
  the chosen direction.
- **Labels that echoed another app:**
  - "Start training" became "Go to Train" on Today and "Start" on Train and
    in the check-in.
  - "Your program" as a heading became "Your plan" in setup and the builder,
    and "Program" in Edit program.
- **The banned list (§94)** covers the brief's twelve phrases. "Your Program" and
  "Start Training" are banned in title case anywhere, and as a whole label in
  any case. Sentences like "in your program" stay. The list is checked in the
  script's strings, the page's static text, the guide, the glossary, the voices
  and the What's new entries shown in the app.
- **A comment naming another app** in index.html was reworded.

**Worth knowing:** CLAUDE.md still says the app "replaces a JuggernautAI
subscription". It's your file, so I left it; the repo is public.

**To undo:** v1.86.0 has the old names and icons.

## D63. Today leads with today's plan; the program as a block track (v1.88.0)

**Chosen:**
- **Today's plan is always the first card.** After the check-in it's the day's
  briefing. Before the check-in, the same briefing is worked out from the
  planned day (`buildBriefing` on it, nothing written) and marked "Before your
  check-in". The counts follow the sentence: a flagged exercise that still steps
  up counts as pushing, "with a warning". One button: Go to Train (or Continue
  during a session). Details opens the briefing.
- **The readiness card loses its plan section on Today** (`readinessCard({plan:false})`)
  so the sentence isn't shown twice. It shows only when there's a check-in today,
  a joint above your usual, or fatigue.
- **The countdown and the volume bars are gone.** The program is a block track:
  - each block is a segment as long as its weeks, with this week marked;
  - "Hypertrophy block · week 4 of 9 · next: Strength";
  - a legend of the block types in your program.

  `phaseChart` is deleted.
- **Patterns, so colour isn't the only signal:**
  - size is solid;
  - strength is striped;
  - a taper is dotted;
  - a deload week is hollow.

  The colours stay as they are until Part 3 swaps the palette; the brief says to
  use the new brand's.
- **A date shows only for a test day (`CFG.testDate`) or a fixed end
  (`CFG.targetFixed`)**, as one small line with days to go. A target the app
  worked out itself isn't shown.

**To undo:** v1.87.0 has the countdown hero, `phaseChart` and the old card order.

## D64. The check-in as "what's off today" (v1.89.0)

**Chosen:**
- **All good** is one tap. It's shown while nothing is picked, and saves the
  all-neutral check-in: everything 3, each sore area 3 (as the old rows started),
  no joints.
- **Chips for what's off:** slept badly, low motivation, stressed or run-down,
  feeling sick, Sore (then the area), A joint (the existing joint chips,
  mild / moderate / bad). Each of the first four asks "a little" or "a lot".
- **Mapping (`checkinValues`):**
  - untapped is 3, a little is 2, a lot is 1;
  - "Better than usual?" (slept well, keen to train, fresh) is 4;
  - stress and feeling sick both write "rest of life", and the lower answer
    counts, so "feeling sick, a lot" is the sick day it always was.
- **Not recordable any more: the 5s.** "Better than usual" uses 4 everywhere. A 5
  only ever made the warm-up shorter, so nothing a suggestion depends on is lost.
- **One way to write it:** `checkinEvent(st)` builds the same event as before
  (`joint_scale:3`). §95 runs 6,912 chip combinations against an independently
  written table of the old answers, and checks the score, the load cut and the
  event are identical.
- **Bodyweight** is one folded line; Change opens the stepper.
- **Left alone:** the five-box rows after a session (session RPE, soreness after,
  quick ratings). The brief names the check-in; they're the same pattern, so
  worth doing next.

**Worth a second look:** losing the 5s, and stress "a lot" counting as the sick
day (the old scale's 1 read "Sick, or wiped out").

**To undo:** v1.88.0 has the five-box rows.

## D65. Train: one line, handles, gestures, Start at the bottom (v1.90.0)

**Chosen:**
- **Header:**
  - one line: the day, then "· Hypertrophy, week 3";
  - a dim line under it: exercises, sets, about how long;
  - ⋯ opens the whole week, another day (with Try new exercises) and starting
    estimates when needed.
- **One Start, after the list.** It's in the page flow, not fixed (§70).
- **Reorder by a handle:** drag it, or use the arrow keys on it. Dropping moves
  one step at a time (`moveSlotTo` → `moveSlot`), so the which-exercise rules
  hold exactly as before. In a session, an exercise with sets logged keeps its
  place.
- **No info + swap pair on cards:**
  - before you start, a tap on a card opens its details;
  - in a session a tap still selects the exercise (rule 3 of which exercise is
    current), and each card has a Details button;
  - a long press (0.55 s) or a swipe left swaps;
  - details have a "Swap this exercise" button, so every swap also has a plain
    tap.
- **Tests:** mobile.js drags the real handle (pointer events) in both regression
  checks. §96 checks the shape and the drag rule.

**Worth a second look:** gestures are invisible until you know them. The guide,
README and features say so, and Details → Swap is the visible route. A
first-time tip could teach the long press if testers miss it.

**To undo:** v1.89.0 has the hero and the button pair.

## D66. Sentences first: details, the finish screen, the week (v1.91.0)

**Chosen:**
- **Exercise details** open with "You're doing 8 hard sets of it a week this block.
  It counts toward chest, where 10 to 20 are the typical weekly sets." An exercise
  not in the program says so.
- **The finish screen**'s three stat tiles are one sentence: "18 sets in 52 minutes,
  with 2 new bests."
- **The whole-week view**'s coloured "14 / 10–20" rows are sentences: how many
  muscles are inside the typical range, then who is under and who is over.
- **Already sentences:** the Lifts cards and the block lines in Edit program (Part 4
  of the last batch). Nowhere left shows a tile grid of max, class, style or
  sticking point.

**To undo:** v1.90.0.

## D67. Three brand directions, and a stop for your pick (Part 2, docs only)

**Chosen:**
- **The three directions:**
  - **Logbook**, from the brief: paper and ink, signal orange, IBM Plex Sans
    with Plex Mono numbers. Signature: ruled set rows.
  - **Chalk**, from the brief: graphite, chalk and acid lime, Barlow with
    Barlow Condensed. Signature: big condensed numbers.
  - **Grove**, my own: sage, forest and tomato, Work Sans with Fraunces.
    Signature: sets drawn as plates, each as long as its load.
- **Every palette is a full token set**, with the same keys as the app's themes, in
  `docs/design/brand-directions/tokens.json`. Each passes the app's own
  `themeReport` in light and dark. Grove light needed three lightness nudges,
  which the app's `readableTokens` made.
- **The content is the demo's made-up lifter**, read from the running app
  (`src/data.js`), not invented.
- **No block palette uses blue for size, orange for strength or red for a peak.**
  Patterns (solid, striped, dotted, hollow) carry the type as well as colour.
- **Fonts are all SIL OFL 1.1.** The mockups fetch them from Google Fonts; the app
  will inline a Latin WOFF2 subset as base64 so it stays one file and works
  offline from the first load, about 150 to 250 KB, with `fonts/OFL.txt` alongside.
  That's a proposal for Part 3.
- **No screenshots of other apps** are in the repo.

**Waiting on you:** which direction (or a mix). Part 3 starts after your pick.

## D68. The three directions are theme codes; the standard look stays (v1.92.0)

**Your call (17 Oct):** Logbook, Chalk and Grove become codes, not the app's look.

**Chosen:**
- **LOGBOOK** (paper, light), **CHALK** (graphite, dark) and **GROVE** (sage, light),
  each in its default mode, with the token sets from
  `docs/design/brand-directions/tokens.json`. They pass §80 like every theme.
- **Their signatures, in CSS:**
  - Logbook: ruled set rows and a margin rule down each exercise.
  - Chalk: condensed capitals and big condensed numbers.
  - Grove: logged sets on rounded plates. They're full-width pills; drawing each
    plate as long as its load would need a change to the set rows, not just the
    theme.
- **Type is the nearest system font, not the open fonts:**
  - Logbook uses the system mono for numbers.
  - Chalk uses Avenir Next Condensed on iPhone, Roboto Condensed on Android,
    then Bahnschrift or Arial Narrow.
  - Grove uses New York or Georgia.

  A code downloads nothing and works offline. The app stays one file.
- **Not added:** the other mode of each direction (Logbook dark, Chalk light, Grove
  dark). They're ready in tokens.json and would each be one more entry.

**To undo:** remove the three entries from `THEMES` (v1.91.0 has none).

## D69. Graphite and teal is the standard look; CLASSIC, IRIS and EMBER are codes (v1.93.0)

**Your pick (20 Oct):** option B as the standard look; the look before it kept as a
code; options C and D as codes too.

**Chosen:**
- **The standard dark tokens** (`:root` and `DEFAULT_TOKENS`) are graphite and teal:
  ground #0F1112, cards #181B1C, accent #2EC4B6. Buttons are teal with dark text on
  them.
  - Block types are teal for size, lavender (#B49BFF) for strength and gold
    (#F2C14E) for a taper.
  - Warnings stay amber and red: those are status colours, not the brand.
- **LIGHT follows the new look:**
  - teal #0A766C on near-white;
  - blocks teal, violet (#6A4FD6) and dark gold (#8A6800).
  - The teal is a shade darker than the first try (#0B7F74 read 4.46:1, just under
    the 4.5 rule).
- **CLASSIC** is the look before batch M, unchanged: navy #0B0D12 and blue
  #4C8DFF, with the old blue / orange / red blocks. That's your call, as a code;
  it's not the default.
- **IRIS** is graphite and violet, and **EMBER** is warm charcoal and coral, exactly
  as shown.
- **The app icon** is redrawn as a teal loaded barbell end (shaft, collar, plates
  big to small, clamp) on graphite, replacing the blue dumbbell on navy. My first
  plate design read as a power button, and a face-on plate read as a target. The
  Train tab icon is the same bar end. iPhones keep the old home-screen icon until
  the app is added again.
- **The manifest's splash and status-bar colour** are the new graphite.
- **All 13 themes pass §80.**

**To undo:** v1.92.0's tokens and icons; or keep this and enter CLASSIC.

## D70. The arrows are back beside the drag handle (v1.94.0)

**Your call (20 Oct):** drag can be janky, so keep the up and down arrows as well.
- Every card has up and down arrows and the handle, before you start and during
  a session. Both move one place at a time underneath, so the which-exercise
  rules apply the same way.
- In a session an exercise with sets logged keeps its place: its arrows and handle
  are dimmed, as before.
- The phone test drags once, then taps Move later and Move earlier.

## D71. After a session: words and chips, not numbered boxes (v1.95.0)

**Chosen:**
- **How hard it was:** one row of word chips (Very easy, Easy, Moderate, Hard, All
  I had). Moderate is picked to start, as the 3 was, and it's stored as before
  (2 to 10).
- **Quick ratings per exercise:** two rows of word chips, "Felt it in the target
  muscle?" and "Enjoyed it?", using the scale's own words. They start empty, and
  skipping still writes nothing. The mid-session rating sheet uses the same chips,
  starting at 3 as the boxes did.
- **Soreness:** "Anything sore already?", where you tap an area and pick a little
  or a lot. "Feels fresh" covers the rest. It's stored exactly as the boxes stored
  it (untapped 3, a little 2, a lot 1, fresh 4) through `postSoreness`, which
  reuses the check-in's mapping. §98 checks every combination.
- **`scaleBlock` (the five-box row) is deleted;** nothing uses it.
- **This version's What's new card** starts with "New look. Same app. Your data
  hasn't changed.", the line the batch M brief asked testers to see.
