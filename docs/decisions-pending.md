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
