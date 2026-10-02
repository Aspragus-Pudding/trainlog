# Checkpoint — engine phase 2 (around 22 October)

Not a prompt. A reminder of what to do when the data's ready.

## Why wait

Phase 1 shipped ~25 Sep and v1.13.0 started recording every suggestion
alongside what you actually did. Personal calibration — the thing that makes
the engine learn *you* rather than apply a population chart — needs enough of
that data to fit on. Three to four weeks at five sessions a week is the
minimum. Fitting earlier means fitting to noise, and we'd be back to patching.

## What to ask Claude Code for first

An **investigation only**, same shape as the one that found the readiness bug:

1. **Prospective accuracy.** Of the suggested load increases since v1.13.0, what
   fraction did I accept, and of those, what fraction did I complete within ±1
   of target RPE? This is the real test of the progression logic — the
   backtest couldn't measure it, this can.
2. **Per-exercise calibration readiness.** For each exercise, how many logged
   working sets with RPE exist? Which have enough to fit a personal
   reps-at-load curve (propose the threshold)?
3. **RPE bias.** Across all exercises, do I systematically under- or over-rate?
   On the chart-path exercises specifically, when I say RPE 8, how many reps
   did I actually have left based on subsequent sets?
4. **Stagnation probe outcomes.** Did probes fire? Did I take them?

## Then the decision, here

Bring that report back. Phase 2's design is in `docs/calibration-plan.md`;
whether to implement all of it, part of it, or adjust the plan depends on what
the numbers say. That's a design call, not an execution call.

## What phase 2 should feel like when it's done

Suggestions that are right more often than they're wrong on the exercises you
do most, that push when you've been flat, and that explain themselves. And a
Progress-tab chart of suggestion accuracy over time that's visibly trending
the right way — so "is it learning?" is something you can look at.
