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

**To undo:** delete the "Today's plan" card block in `renderDash` (search
`data-tour='briefing'`). The briefing after the check-in still works.

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
