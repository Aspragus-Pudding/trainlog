# Personal calibration — phase 2 spec

Not implemented. This is the design for a later phase, once there's enough
logged data to calibrate against. It replaces the design-phase
`engine-constants` document, which specced this same idea but was never
committed to this repo — CLAUDE.md pointed at a file that didn't exist.

## Why this exists

The prescription engine (`nextPrescription()` in `index.html`) uses two
pricing paths, neither of which currently adapts to the individual beyond
simple trailing statistics (`progressionRate()`, `fatigueRise()`):

- **Chart path** (barbell, dumbbell, bodyweight/bodyweight_plus): prices
  through a fixed, population-derived %1RM-by-reps-to-failure curve
  (`PCT`/`pct1RM()`). Same curve for every exercise, every person, forever.
- **RPE-delta path** (machine, stack, cable): steps directly off RPE by its
  own definition (one point = one rep in reserve). No curve at all, so
  nothing here to calibrate against a curve — but the RPE *reporting itself*
  can still be personally biased (see below).

Phase 1 (this batch) fixed a formula bug in the readiness check-in and
replaced the chart with direct RPE-delta stepping for the exercise classes
where the chart was demonstrably wrong (see `tests/backtest.js`). Phase 2 is
about making the remaining chart-based pricing, and RPE reporting generally,
track the individual rather than a population curve or a face-value RPE.

## What to build

### 1. Personal RPE bias correction

Per exercise, compare the reps the chart (or a past prediction) implied at a
given logged RPE against the reps actually completed. If a consistent
over- or under-rating shows up — e.g. this lifter's "RPE 8" reliably produces
2 more reps than the chart's RPE-8 assumption for that exercise — fit a
small offset and apply it before pricing, not to the logged RPE itself (the
log stays exactly what was reported; the offset is a read-time adjustment,
consistent with "derived state is never stored").

- Rolling window, most recent N sessions (see minimum data below), so a
  change in how the lifter reports RPE (or in true capability) isn't
  permanently baked in.
- Fit per exercise, not globally — a bias on lat pulldown says nothing about
  squat.

### 2. Personal reps-at-load curve

Per exercise, fit reps-vs-%1RM (or reps-vs-load directly) from this lifter's
own logged sets, for **chart-path exercises only** — the RPE-delta path
doesn't route through a curve, so there's nothing here to replace for it.
Once an exercise has enough fitted data, use the personal curve instead of
the population `PCT` table for that exercise; until then, fall back to the
population curve. Shrink toward the population curve as fitted-data volume
approaches the minimum, rather than switching abruptly at a threshold, so
early data with only barely-enough points doesn't produce a curve overfit to
noise.

`repProfile()` (index.html) already computes the diagnostic this needs — a
low-rep vs. high-rep e1RM gap per exercise — and has since before this
batch. It's currently a Progress-tab display note only, read by nothing else.
This is the function to build on.

### 3. Minimum data before any calibration applies

Proposed, as a starting point — revisit once real data exists:

- **RPE bias correction**: at least 15 logged sets with an RPE on that
  exercise, spanning at least 5 distinct sessions. Below that, no
  correction (behaves exactly as today).
- **Personal reps-at-load curve**: at least 20 sets spanning at least 3
  distinct rep ranges (e.g. some sets at 5-8 reps, some at 12-15) — a curve
  fit from sets clustered at one rep count can't say anything about the
  shape of the curve elsewhere. Below that, use the population chart.

### Prospective check: is the chart-free ceiling rule actually right?

`tests/backtest.js` measures agreement with sets logged under the *old*
engine — a valid test for the readiness fix, but not for the RPE-delta
path's load-progression rule. A backtest can't tell "wrong suggestion" apart
from "correct suggestion the old engine never made, so there's no historical
agreement to find." The phase-1 redesign shipped despite a flat/mixed
backtest number for exactly this reason (see the commit that added this
file) — machine_raise and a few other high-rep isolation machines showed
the RPE-delta path repeatedly suggesting a load increase the lifter's
history never took, which the backtest scored as error regardless of
whether the suggestion was good advice.

The real test is prospective, once there's `suggestion` data (v1.13.0+) to
measure against actual behavior:

- **After 3-4 weeks of real use**, for every logged set whose recorded
  `suggestion` was a load increase on the chart-free path (`basis` matching
  `'hit top of range'`/`'from your recent rate'`-style load-up sources, or
  `'stagnation probe'`), check: was the suggested load actually logged
  (accepted), and if so, did the resulting RPE land within ±1 of the
  exercise's target RPE?
- **High acceptance, RPE lands close to target**: the ceiling rule is
  working — leave it alone.
- **Low acceptance, or accepted sets consistently overshoot target RPE**:
  that's real evidence the rule fires too eagerly (e.g. the ceiling-override
  threshold, or which exercises route through it) and is worth tightening —
  with actual behavioral data behind the change, not a 4-exercise,
  3-week backtest sample.
- Build this as a small script alongside `tests/backtest.js` once there's
  enough `suggestion`-tagged data to make it worth writing, rather than
  guessing at the query now.

These are judgement defaults, Grade D, same as everything else in
`nextPrescription()` — comment them as such in the code, and expect to
revise them once `tests/backtest.js` has enough real suggestion-logged data
(from the `suggestion` field added in v1.13.0) to say whether they're too
strict or too loose.

### 4. Validation

No calibration ships without a backtest showing it helps:

- Run `tests/backtest.js` against the same real export, with calibration on
  and off, before merging.
- A calibration change is accepted only if it **reduces** backtest error —
  same bar this phase-1 redesign was held to. If a proposed calibration
  doesn't clear that bar, don't ship it; log why in the commit instead of
  weakening the check.
- Watch the same breakdowns already in the script: overall, by equipment
  type, first-set vs. later, by exercise, worst misses. A calibration that
  helps on average but makes one exercise much worse is worth a second look
  before shipping, not an automatic pass.

## When to revisit

The `suggestion` field logged on every set since v1.13.0 is what makes any
of this measurable — before that, there was no record of what the engine
actually recommended, only what was logged. Revisit this plan in four to six
weeks, once there's a real base of logged suggestions to fit against and
backtest.
