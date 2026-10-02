# Claude Code prompt — batch 5: correctness

Paste everything below the line into Claude Code from inside the `trainlog`
folder.

---

Read CLAUDE.md first, including the recurrence rule. Plan before writing, ask
about anything ambiguous, push back if something is wrong.

Run `node tests/prescription-invariants.js` and `node tests/backtest.js` before
you start and after you finish. Report both.

## 1. Joint readiness never adjusts anything

I've logged shoulder pain at check-ins multiple times and have never seen a
session change because of it — no held load, no reduced sets, no explanation
line mentioning it.

**Investigate before fixing.** Candidates:

- The rolling window needs 3 exposures of a *pattern* before the ladder fires,
  and my exercises may not map to the patterns `JOINT_PATTERNS.shoulder` lists.
  Check whether the machines I actually use (incline machine press, machine
  rear delt fly, single-arm cable row, etc.) carry patterns that match.
- The thresholds in `jointLevel()` may be too high to ever reach from the
  severity values the check-in produces.
- `jointTrend()` may be reading the wrong field, or reading `session_end`
  joint flares and `readiness` joints inconsistently.

Replay my logged joint entries through `jointTrend()` and `jointLevel()` for
each joint and tell me what level each would currently produce. Then fix
whatever's stopping it from reaching the session.

When it does fire, the explanation line must say so: "shoulder: load held" or
similar, on every affected set.

## 2. Program progress is counted in sessions, not calendar days

**The bug:** the day rotation (`completedCount()`) advances by sessions
completed, but the phase and week (`currentPhase()`) advance by calendar date
from `CFG.start`. Miss a week and they disagree — I'd be told I'm in week 3 of
a block having trained only two weeks of it.

**The fix:** make program position session-based throughout.

- One program week = `activeSplit().days` sessions completed.
- `currentPhase()` derives block index and week-within-block from sessions
  completed, not from the calendar. Use `countsAsTrained()` so cancelled and
  abandoned sessions don't advance it.
- The target date becomes a **projection**: given sessions remaining and your
  recent training frequency, when will you reach the end? Show that on the
  dashboard alongside the original target.

**Drift handling.** Add a toggle in Edit program next to the target date:
**"This date is fixed"** (off by default).

When the projected end is more than ~1 week past the original target:

- Show it plainly on the dashboard: "About 1 week behind your target date."
- **Date not fixed (default):** offer one action — extend the target date to
  match the projection. Every block keeps its planned length.
- **Date fixed:** offer one action — compress the remaining blocks to hit the
  date. Shorten from the end backward, never below each block type's minimum
  from the linter (hyp 3, str 2, peak 1), and never remove a deload. Show
  what the compressed roadmap looks like before applying.

**Do not increase per-session volume to "catch up" in either mode.** Missing
sessions means fewer sessions — the fix is more sessions, not more work per
session. Cramming volume into the remaining weeks raises per-session fatigue,
which for this user means shoulder risk. The whole point of session-based
progress is that the program reflects training done; it shouldn't punish
gaps.

The countdown ("N days out") should now reflect the projection, not the
original date, with the original shown as secondary if they differ.

Make sure the phase chart, week preview, `planStamp()`, week edits, and
anything else keyed on phase/week all follow the new definition. Grep for
every consumer of `currentPhase()`.

## 3. Rep ranges: pre-loaded per exercise, editable any time including
## mid-session

Every exercise should carry a default rep range (the per-muscle defaults from
batch 2 already exist — make sure every exercise resolves to one). Then:

- Let me edit the rep range for an exercise from its info sheet.
- Let me edit it **mid-session** for the current session only, from the entry
  panel, without changing the exercise's stored default. Two different scopes,
  make the UI clear about which one I'm changing.
- The explanation line reflects the range in effect.

## 4. Lower back is missing as a muscle group

There's a `low back` *joint* but no lower back *muscle* — erector spinae work
has never counted toward volume. Add `lower_back` to `LANDMARKS`, `ML`,
`MUSCLE_GROUP`, and the soreness grouping. Default landmarks: MEV 6, MRV 16,
tier moderate, marked judgement default.

Then audit the library: hinges (deadlift, RDL, good morning, back extension,
Transformer bar hinge, belt squat RDL, roman chair hinge) should carry
`lower_back` at 0.5 or 1.0 as appropriate. Make it selectable in custom
exercise creation.

## 5. Plate diagram for plate-loaded machines

Extend the plate solver to exercises with `load:'machine'` where the machine
is plate-loaded. Needs a `plateLoaded:true` flag on the exercise.

Two differences from barbells:

- There's no known base weight (empty sled resistance varies by machine and
  isn't on the label). So show **plates only** — "45 + 25 per side" — and never
  display a total.
- The solver should work per-side as it does now; most plate-loaded machines
  load symmetrically. For single-arm machines, show per-arm.

Tag the plate-loaded machines already in the library (the ones with
"plate-loaded" in the name, plus hack squat, pendulum, leg press, and any
others you can identify). Add the flag to custom exercise creation under the
machine option.

## 6. Recovery / life-stress input on the check-in

Readiness currently has sleep, motivation, soreness and joints. It has no slot
for the rest of what drags a session down: outside stress, feeling run-down,
being sick, poor eating that day. People shoehorn it into "motivation 2."

Add one anchored 1–5 item: **"How's the rest of life treating you?"** with
descriptors like:

1. Sick, or wiped out — barely here
2. Rough: high stress, under-fed, or run-down
3. Normal — nothing dragging
4. Good — well-fed, low stress
5. Feel great

**It feeds readiness as a physical signal**, same weight class as soreness,
so a 1 or 2 can reduce load and sets. 3 is neutral. 4–5 don't add load.

The explanation line says "run-down" or "life stress" when it fires, so it's
clear what caused the cut.

This is deliberately general — it's the one input that applies to every user
identically, and it replaces the idea of separate sick/cycle/stress items with
a single honest question.

Add it to `trainedGroupsThisSession()`-adjacent code only if needed; it's a
whole-session signal, not a per-muscle one.

## Before you commit

- Syntax-check `index.html`.
- Both test scripts pass; extend the invariants test for item 2 (session-based
  phase, drift calculation, compress-never-below-minimum) and item 6
  (recovery 1–2 cuts load, 3 doesn't, 4–5 never add).
- Bump `APP_VERSION`.
- Commit and push.

Report: what item 1 found, the list of `currentPhase()` consumers you updated
in item 2, and backtest before/after.
