# Prescription modifiers

## The engine's modifiers (batch E, v1.48.0)

Every adjustment to a base prescription is one of these, in `ENGINE.modifiers`
in `index.html`. **This table and that block list the same ids** —
`tests/prescription-invariants.js` §52 fails if they drift. Precedence, high to
low: `condition_flag` → `focused_deload` → `joint_ladder` → `local_soreness` →
`global_readiness` / `sick_day` → `dial` → `phase_ramp` → `progression`.
Applied low to high: after the dial, a step can only make the number more
conservative. Guards (`calibrating`, `ceiling`, `one_step`, `floor`,
`both_up`) run last. Every suggestion's chain is stored as `trace[]` in the
suggestion log and shown as "Why these numbers" on the Progress tab.

| id | scope | max effect | expires |
|---|---|---|---|
| `progression` | exercise | one load step, or reps within the range | base |
| `range_fit` | exercise | one re-price to the range edge — first fit only, exempt from one_step and floor | once the last set is back in range |
| `phase_ramp` | muscle | weekly sets per muscle ≤ top of the typical range (LANDMARKS, Grade D defaults) | the block |
| `dial` | exercise | ±1 step (stated −2…+2, drifts a notch toward revealed after 4 sessions of disagreement) | stated: until changed · revealed: 8 sessions |
| `global_readiness` | global | no step up when sleep, motivation or rest of life is at 2; never a load cut | this session |
| `sick_day` | global | one load step down everywhere when any global item is 1 | this session |
| `local_soreness` | muscle | load ×0.95/0.90, −1/−2 sets on the sore muscles' main work; never two sessions running without a miss | this session |
| `joint_ladder` | joint | L3 hold · L4 −10% and −1 set · L5 no progression | 6-session trend |
| `focused_deload` | exercise | pinned at hold / −10% / −20% of the starting load; exempt from one_step and floor | 1–3 weeks + 3-session ramp-back |
| `condition_flag` | exercise | display only | while the condition is picked |
| `calibrating` | global | no load step up | first session after a program, phase or profile change |
| `ceiling` | exercise | load ≤ what the last 6 sessions' e1RM supports at the reps and target RPE + 1 | guard |
| `one_step` | exercise | load moves ≤ one increment per session (exempt: range_fit first fit, focused_deload, joint ladder cut, deload weeks, top sets/AMRAP/back-offs) | guard |
| `floor` | exercise | load ≥ 85% of the best completed load in the last 6 sessions (exempt: focused_deload, ladder ≥ 4, range_fit first fit, deload weeks) | guard |
| `both_up` | exercise | load and reps never both rise | guard |

Judgement defaults (Grade D): the 85% floor over 6 sessions, the ±1 RPE
ceiling window, the 8-session dial window and 4-session drift, the
3-session ramp-back, the weekly-sets range.

## Inventory of code paths (step 0, as of v1.47.0)

Every code path that changes a suggested load, reps, sets or RPE, as of
v1.47.0. Batch E step 0. This is the starting point for the batch E modifier
model (spec §1): each row below becomes one modifier with an id, scope,
bounded effect, reason and expiry.

"Persists" means whether the effect carries into later sessions on its own.
Every row is derived from the log or settings on read; nothing is stored as
derived state.

## Session and exercise level

| # | Name (function) | Inputs | Scope | Max effect | Persists | Displays |
|---|---|---|---|---|---|---|
| 1 | Base pricing (`nextPrescriptionCore`) | Last set on the exercise's track (load, reps, RPE), target range and RPE | Exercise | Load ±1 step, or priced from e1RM; reps within the range | Yes: it reads the last set | `src` plus a note line |
| 2 | Range fit (`nextPrescription`, v1.47) | Suggestion vs. range, last set | Exercise | Re-prices to the range edge (can be more than one step) | No | "priced for your range" |
| 3 | Load-up cap (`capLimit`) | Exposure count | Exercise | +2.5% (under 6 exposures) / +10% per step | No | "capped at …" |
| 4 | Recent-rate step (`progressionRate`) | Trailing 8 sessions' load trend | Exercise | Easy set at the ceiling: load + recent rate (≥1 step) | Yes: trailing window | "following your recent rate" |
| 5 | Override damping (`overrideStreak`, probe) | 3+ sessions logged below the suggestion | Exercise | Probe +2.5 lb, or hold | Yes: streak | "probe · small bump" / "holding at what you've set" |
| 6 | Stagnation probe (`stagnationProbe`) | 3 flat sessions | Exercise | +1 step probe; backs off 2 sessions if declined | Yes | "stagnation probe" |
| 7 | Within-session fatigue (`aimFor` / `fatigueRise`) | Same-load set pairs ≥ thresholds | Exercise | Aims later sets up to N RPE lower | Yes: history | "fatigue −x RPE" |
| 8 | Fast progression (`fastRx`) | Main lift on fast rate, last like-for-like exposure | Main lift | Last load + 1 step, same reps | Yes: rate state | "adding load each session" |
| 9 | Back-off (`backoffRx`) | Today's top set, `CFG.backoff` | Exercise (top-back slots) | Top set −8% (setting) | No | "back-off k of n" |
| 10 | Realization AMRAP (`amrapRx`) / TM (`tmFor`) | Training max, block week | Main lift | 75–90% of TM | TM via `tm_update` events | AMRAP note |
| 11 | Maintenance top set (`maintTopView`) | Refined hyp block | Main lift | 3–5 @ RPE 7.5 once a week | No | "strength upkeep" |
| 12 | Readiness physical cut (`physicalCut` → `session.adj`) | Check-in soreness (local, since v1.47) and recovery (global) | Sore groups' exercises; recovery = session | Load ×0.95/0.90; −1/−2 sets on the first two affected exercises | Session only | Banner plus explanation line |
| 13 | Readiness score (`readinessScore`) | Sleep, motivation, soreness, recovery, energy | Session | Warm-up length only (continuous) | Session only | Readiness number |
| 14 | Joint ladder (`jointNoteFor`) | Joint flags over the last 6 sessions vs. `jointBaseline` | Joint (movement patterns) | L2 longer warm-up · L3 hold load · L4 −10% and −1 set · L5 no progression | Yes: 6-session trend | "shoulder: load held" etc. |
| 15 | Joint level ≥4 set cut (`buildDay`, check-in) | Ladder level | Joint patterns | −1 set | With the ladder | Explanation line |
| 16 | Ease-off after a painful early end (`lastEarlyPain` in `buildDay`) | Last session ended early for pain | **Global (every slot)** | −1 set | Until the next normal session | Explanation line |
| 17 | Rehab / exclusions (`CFG.excludedEx`) | Your choice | Exercise selection | Exercise not auto-picked | Settings | Info sheet |

## Program level (generation)

| # | Name | Inputs | Scope | Max effect | Persists | Displays |
|---|---|---|---|---|---|---|
| 18 | Block scheme (`schemeFor`) | Block type, role, week | Slot | Sets/reps/RPE table; hypertrophy ramps +1 set every 2 weeks, strength −1 | Block | Block name in the explanation |
| 19 | Rep-range overrides (`repRangeOverride`) | `CFG.repRanges`, muscle defaults, coarse-machine cap | Exercise | Range | Settings | "set for this exercise" / "… default" |
| 20 | Volume emphasis (`VOL_EMPHASIS`) | Block emphasis | Program | ×0.75 / ×1.3 sets | Block | — |
| 21 | Energy balance (`energyCfg`) | `CFG.energy` | Program | ×0.8 sets in a deficit; readiness bar −0.08 | Settings | Settings note |
| 22 | Priority muscles | Block `hyp[]` | Muscle | +1 set on non-primary work | Block | — |
| 23 | Effort ramp (`effortRamp`, refined hyp) | Block week | Slot | RPE 7 → 9 (10 for isolations) | Block | Explanation |
| 24 | Stop adding sets (`muscleDropping`) | Performance falling 2 sessions | Muscle | Freezes the set ramp | While it drops | Explanation |
| 25 | Session muscle cap (`capSessionVolume`) | Fractional sets per muscle | Muscle (session) | ≤11 sets; trims accessories first | No | Explanation |
| 26 | Maintenance / practice days (`addMaintenance`, `addPracticeDays`) | Refined hyp, frequency | Main lift | +1 top set; last weekly day at RPE 6.5 | Block | Explanation |
| 27 | Stall interventions (`applyInterventions`) | Active `intervention_start` | Main lift | +40% practice sets / +1 day / variant split / specialization | 6 weeks | Card plus slot note |
| 28 | Deload overlay (`deloadOverlay`) | `deload_start` events | Program | The deload scheme for N sessions | N sessions | Banner |
| 29 | Week-1 calibration AMRAP / All-out set type | Refined hyp week 1 / your choice | Slot | Last set to failure | No | "AMRAP" |
| 30 | Pain-in-set advice (`painRule`, D1b) | Your 0–10 rating | Exercise | Advice and buttons only, never a change | No | Line under the set |

## Conflicts this surfaces (for batch E)

- **Global vs local.** #16 (ease-off after a painful end) cuts sets on every exercise, whatever hurt. #12's recovery branch still cuts load session-wide.
- **No shared order.** #3–#8 each return early from `nextPrescriptionCore`, so the first branch that matches wins. #12 and #14 then apply in `suggestFor`: readiness after the ladder, both multiplicative on the same load.
- **No one-step bound.** #2 (range fit) and #1's e1RM pricing can move load more than one increment.
- **No expiry.** #5 (override damping) and #6 (probe back-off) persist with no stated expiry other than their windows.
- **No trace.** Only the final `src`, `note` and a few flags reach the suggestion log; there's no per-modifier record.
