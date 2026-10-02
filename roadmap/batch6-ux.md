# Claude Code prompt — batch 6: UX

Paste everything below the line into Claude Code from inside the `trainlog`
folder. Run after batch 5.

---

Read CLAUDE.md first, including the recurrence rule. Plan before writing, ask
about anything ambiguous, push back if something is wrong.

This batch is about the app feeling finished. None of it changes prescription
logic; `tests/backtest.js` should produce identical numbers before and after.

## 1. Mobile clipping and cutoff audit

There are still screens where text clips or controls get cut off on an iPhone
width. I haven't catalogued them all.

**Do a systematic pass rather than waiting for reports.** Render every screen
and every dialog at 375px and 390px viewport width and look for:

- fixed-width elements inside flex or grid containers (the stepper bug class)
- `1fr` grid tracks without `minmax(0, …)`
- `white-space:nowrap` on text that can be long (exercise names)
- fixed-position overlays that could sit on top of interactive content
- dialogs whose content exceeds the viewport without scrolling

List every instance found and fix them. Reuse the patterns already in the
codebase — don't invent new layout approaches.

## 2. Preview screen UI

Batch 2 asked for the preview to match the training screen. Finish that:

- Same exercise card component, same set-row component, same styling.
- Every set shows weight × reps @ RPE plus its explanation line.
- Warmup ramp shown per exercise, collapsed by default.
- Lead lift badged.
- Estimated duration at the top.
- Clear label: "Based on how things stand now — the check-in may adjust this."

If reusing the live components cleanly isn't possible, extract the shared
pieces into functions both screens call. No duplicated rendering logic.

## 3. Add-exercise and swap UI: browse by muscle group

The picker has search and coarse categories (push/pull/legs/core). Add
**muscle-group browsing** as the primary way in: chest, upper back, lats,
lower back, front delts, side delts, rear delts, biceps, triceps, forearms,
quads, hamstrings, glutes, calves, abs, abductors, adductors.

- Muscle chips above the search box. Tap one, see exercises with that muscle
  as primary.
- Keep the push/pull/legs categories as a secondary filter if they still earn
  their space; drop them if the muscle chips make them redundant.
- Same picker everywhere — `exPicker()` is the only implementation.

Apply the same muscle list to **custom exercise creation** for both primary and
secondary muscles. Lower back is currently missing there.

## 4. Training split per phase

`CFG.split` is global. Let each block in the roadmap carry its own split,
falling back to `CFG.split` when unset.

- Block editor gets a split chip row, defaulting to "same as program."
- `generatedDays()` reads the current block's split.
- Changing a block's split must not disturb logged history or the rotation
  position of other blocks. Think about what "day N" means when the day count
  changes between blocks — the simplest rule is that each block's rotation
  restarts at its first day.
- The linter warns, not blocks, when consecutive blocks use different splits.

## 5. "vs last time" on every exercise card

Before I lift, show the delta against my previous session for that exercise,
right on the card: "last time: 170 × 10 @ 8 · 3 days ago". If today's
prescription differs, show the direction with an arrow.

This is the single most useful line in the app and it currently only appears
inside the open entry panel. Put it on the collapsed card too.

## 6. Session summary on finish

After the post-session check-in, show a summary before returning to the
dashboard:

- Sets, tonnage, duration
- Any PRs, named
- Comparison to the last session of the same day: tonnage delta, any lifts
  that moved
- Readiness score for the day

One screen, one tap to dismiss. This is the payoff moment the app currently
skips entirely.

## 7. Coaching cues content

`docs/coaching-cues.json` is in the repo — 49 exercises, each with setup,
execution, common faults, an optional shoulder-instability note, and coach
attributions.

- In the exercise info sheet, show these four sections for any exercise with
  an entry. Fall back to `PATTERN_TIPS` for exercises without one.
- Show the **shoulder note** prominently — highlighted, above the other cues —
  when the user has `shoulder_instability` as a declared condition. Hide it
  otherwise; it's noise for everyone else.
- Show the sources as a small line: "Cues drawn from Baraki, Nuckols."
- Keep the "standard technique points, not a substitute for a coach"
  disclaimer.
- Make it a one-object addition to extend: adding an exercise's cues should
  mean adding to the JSON, nothing else.

## Before you commit

- Syntax-check `index.html`.
- Both test scripts pass unchanged.
- Bump `APP_VERSION`.
- Commit and push.

Report: the list of clipping instances fixed in item 1, and how you handled
rotation across blocks with different splits in item 4.
