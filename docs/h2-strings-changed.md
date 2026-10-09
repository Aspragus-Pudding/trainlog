# H2: strings changed (v1.62.0)

The audit of every visible string against `docs/glossary.md`. Each group gives
the rule, how many places it touched, and examples. Comments and stored data
were not touched; old suggestion notes already saved with your sets keep their
old wording.

## Bands and scores

| Before | After |
|---|---|
| Dashboard "Readiness score 70 / 100 · Normal", then rows "Green / Yellow / Orange / Red" | Card "Readiness": today's plan's top line, then one line per status, each a coloured dot and a sentence. The score is in the detail sheet: "Warm-up: standard (readiness 65 of 100; the score only sets the warm-up)" |
| "Shoulder: Red · no progression · two steps over your usual" | "Shoulder: pressing, pulling and raises held at last time's weight and reps until it settles (rated two steps over your usual)" |
| Shoulder at ladder level 3 | "pressing, pulling and raises held at last time's load" |
| Readiness Yellow: "no step up today — loads hold where they would have gone up" | "Readiness: no step-ups today, loads stay where they would have gone up" |
| Fatigue Green: "no signs — full plan" | "Fatigue: no signs, full plan" |
| Progress "Readiness 70/100 · Normal" | "latest: normal, standard warm-up" |
| Session summary "Readiness today 70 / 100 · Normal" | "Readiness today: Normal · standard warm-up" |
| Workout banner "Reduced for today … Driven by sore quads — readiness 0.58" | "Sore quads: lighter today. Exercises that train them start at 90% of the planned load, with 2 fewer sets on the first two. Everything else is unchanged." |
| Explanation "readiness 58 · load −10%" / "Readiness 58 out of 100 (reduced): today's starting loads are cut 10%, driven by sore quads" | "sore quads · load −10%" / "Sore quads: today's starting loads on what trains them are cut 10%." |
| "Readiness also removed 2 sets from the first two exercises." | "Soreness also removed 2 sets from the first two exercises it reaches." |

New: the readiness detail sheet (tap the card), with one row per check-in
answer and what it does, one row per sore group and per joint with the
exercises it touches, and a legend for the four dots in words.

## Effort (RPE): 63 strings

Every on-screen "RPE" became "effort".

- Set badges: "top · RPE 7.5" became "top · effort 7.5", and "RPE 9" became "effort 9".
- Card lines: "5 sets × 8–12 reps · RPE 9" became "5 sets × 8–12 reps · effort 9", with "effort" tappable.
- Explanations: "Last set 200 × 8 @ RPE 8 was harder than target RPE 7" became "Last set 200 × 8 at effort 8 was harder than target effort 7".
- The set panel stepper "RPE" became "Effort".
- Session detail "RPE 7" became "Session effort 7".
- Fatigue: "run about 1 RPE harder" became "run about 1 harder on the effort scale", and "at least 1 RPE harder" became "at least 1 point of effort harder".
- Accuracy card: "on target (RPE within 1)" became "on target (effort within 1)".
- Stall cards: "practice sets at RPE 6.5" became "practice sets at effort 6.5".
- Tutorial: the "RPE" step became "Effort", and "RPE is how hard the set was" became "Effort is how hard the set was".

## Estimated max (e1RM, 1RM): 19 strings

- "est. 1RM" became "estimated max", and "est. 1RM (system load)" became "estimated max (total load)".
- "Recent bests · estimated 1RM" became "· estimated max" (tappable).
- "e1RM trend" became "Estimated max over time".
- "Lifts: Current estimate 245 lb" became "Estimated max 245 lb" (tappable).
- "Estimated from the %1RM chart" became "Estimated from the percent-of-max chart".
- "from e1RM" (the reason under each card) became "from your estimated max".
- Progress chart legend: "system load e1RM" became "estimated max on total load".

## Typical weekly sets (MEV / MRV, landmarks): 5 strings

- "Ticks are MEV and MRV. MEV is literature-anchored; MRV is a starting point." became "The ticks mark the typical weekly sets for each muscle: a starting range, not a measured limit for you."
- "Sets appear here against your landmarks." became "… against the typical weekly sets for each muscle."
- Week preview: "Weekly volume against your landmarks" became "Weekly sets against the typical range".
- Lifts cards: "MEV / MRV — Quads 12 / 20" became "Typical weekly sets — Quads 12–20".
- Program check: "at or past MRV for most groups" became "at or past the top of the typical weekly sets for most muscles".

## All-out set (AMRAP): 6 strings

- Badge "AMRAP" became "all-out".
- "realization AMRAP" became "all-out test set", in the card reason, the block description and the training max line.
- Card line "Realization: 1 set, as many reps as you can" became "Test set: one all-out set, as many reps as you can".
- "(calibration)" and "a calibration set" became "all-out" and "an all-out set".

## Block, not phase: 5 strings

- Dashboard "Your phases" became "Your blocks", and "Phase 1 · Hypertrophy" became "Block 1 · Hypertrophy".
- "Lead lift this phase" became "Lead lift this block".
- In the tutorial, "Your phases" became "Your blocks".
- "phase" now means only a step of a rehab phase plan.

## Flared joint (joint ladder, levels): 9 strings

- Proposal: "Your shoulder is at ladder level 3+ — pin it for a while?" became "Your shoulder has flared — pin its exercises for a while?"
- "The ladder is already holding load on shoulder exercises." became "Loads on shoulder exercises are already held because it has flared."
- Deload reason: "your shoulder is at ladder level 3 or higher" became "your shoulder has flared enough that loads are held".
- "not with a joint at level 2 or higher" became "not while a joint is flared".
- "Why these numbers": "shoulder at level 3: load held" became "shoulder flared: load held".
- "Why these numbers": "shoulder at level 5: no progression" became "shoulder flared badly: no progression".
- "Why these numbers": "shoulder at level 4: −10%" became "shoulder flared: −10%".
- Explanation detail: "(Ladder level 3; its thresholds are judgement defaults.)" became "(How far it has flared sets what changes; the thresholds are judgement defaults.)"
- Tutorial: "The joint ladder uses the same ratings" became "The app uses the same ratings … a flared joint".

## Smaller labels

- "system load" became "total load" (4 places).
- The dial became "how hard suggestions push": "your dial setting" became "your setting for how hard suggestions push", and the tutorial step is renamed.
- Calibrating became "settling in": "no load step up while it calibrates" became "no load step-up while it settles in", and "the first set calibrates" became "the first set finds your level".
- "Tonnage" became "Moved".
- Lifts card "Progression model: Percentage / Percentage / Percentage" became "How it progresses: a percentage of your max, worked out from your last sets", or "reps climb to the top of the range, then the weight goes up".

## Kept on purpose

- "Hypertrophy" as a block's name. It's defined in the glossary.
- Exercise names with "Band" in them. That's equipment, not a status band.
- "Top set", "back-off", "deload" and "training max" are the glossary labels themselves. Where they appear on a set card, the Progress cards or in the readiness sheet, they're tappable for the definition.
