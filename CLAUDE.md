# Trainlog — project context

Read this before changing anything. It encodes decisions made over a long design
process; most of the rules below exist because breaking them caused a real bug.

## What this is

A personal strength + running training app, built for a single user. One
self-contained `index.html` (~190KB), no build step, no framework, no
dependencies. Served from GitHub Pages, installed to an iPhone home screen as a
PWA.

It replaces a JuggernautAI subscription. The goal is a generated program that
adapts to logged data, not just a workout logger.

## Files

```
index.html              the entire app — HTML, CSS, JS in one file
sw.js                   service worker, self-updating
manifest.webmanifest    PWA manifest
icon-192.png/512.png    icons
AppsScript.gs           Google Sheets backup receiver (lives in Apps Script, not deployed here)
shoulder-protocol.md    reference doc, not used by the app
tests/prescription-invariants.js   prescription direction/pairing tests, run with node
tests/backtest.js       replays the engine against a real exported log to measure suggestion accuracy
```

## Hard invariants — do not break these

**1. The log is append-only.** Every set, check-in and correction is one JSON
line in `localStorage` under `trainlog.jsonl.v1`. Nothing is ever rewritten.
Edits and deletes append a `correction` event that `sets()` replays over the
raw log on read. This is what makes backup/restore and sync conflict-free.

**2. Derived state is never stored.** e1RM, weekly volume, PR status, joint
trends — all computed on read from the log. If you're tempted to cache a
derived value into an event, don't. PR flags were stored once and went stale the
moment an old set was edited; they're now derived via `prIds()`.

**3. Updating the app must never touch user data.** The storage keys are fixed
strings (`LS_KEY`, `LS_CFG`, `LS_SESS`, `LS_PEND`, `LS_REST`) and are version-
independent. Nothing in the update path may call `removeItem`. This was audited
explicitly — keep it that way.

**4. Every user-configurable setting lives in `CFG`** and therefore rides along
in every backup. If you add a setting, add it to the `CFG` default object. Don't
invent a new top-level localStorage key for user preferences.

**5. `append()` writes to disk BEFORE pushing to the in-memory `LOG`.** If the
write fails, the event is not kept in memory either. Never reorder this — a
silent divergence means sets that look logged and vanish on reload.

**6. Warmup and prep sets never count toward training volume.** Check
`set_kind` handling if you touch volume accounting.

## Evidence discipline

This app deliberately distinguishes what's established from what's a guess.
`engine-constants` (from the design phase) graded every constant A–D.

- Don't invent numbers. If there's no evidence for a coefficient, it's a
  judgement default and should be marked as such in a comment.
- Don't add a "combined fatigue score" mixing lifting and running load. There's
  no validated way to do this; it was deliberately excluded. Interference is
  expressed as explicit scheduling rules instead.
- The app warns, it never blocks. Flagged exercises show a warning and get
  deprioritised in generation, but are always still selectable.
- Don't present Grade D numbers (MEV/MRV landmarks, joint ladder thresholds,
  block durations) as if they were science in user-facing copy.

## Known gotchas — these have bitten before

**CSS Grid `1fr` steals space.** A wider string in one column ("8.5" vs "8")
squeezed its neighbours and hid the stepper's `+` button. Grid tracks use
`minmax(0,1fr)` for this reason. Don't revert to plain `1fr`.

**Never rebuild a dialog by snapshotting `innerHTML` and restoring it.** This
orphaned the settings screen's DOM node — edits landed on a detached element the
user couldn't see, which is why goal lifts appeared unchangeable. Screens that
navigate away and back use a module-level draft object (`SETTINGS_DRAFT`) that
outlives a single render call.

**Always restore globals in a `finally`.** The roadmap linter temporarily swaps
`ROADMAP` for the in-progress draft. An exception mid-check used to leave the
global pointing at a half-edited draft, freezing the app. That swap is now
`try/finally`.

**Fixed-position overlays can cover buttons.** The rest timer bar sat on top of
the Log Set button on short screens, which reads as "the app froze". `body.resting`
adds bottom padding while it's visible.

**`render()` and `sheet()` are wrapped in try/catch** with a recovery UI. A
render error used to blank a screen after `innerHTML=''` had already run, leaving
nothing tappable. Keep those nets.

**Service worker is network-first for the shell.** This is what makes updates
appear without bumping a cache name. Don't switch it back to cache-first. New
versions install and *wait*; the in-app banner activates them, so a session is
never swapped out mid-workout.

## Architecture notes

- **`EX`** is the exercise library array; **`exById`** is the lookup. Custom
  exercises live in `CFG.customEx` and are merged in by `mergeCustom()` at load.
  Anything iterating `EX` automatically sees custom exercises.
- **`exPicker()`** is the one shared exercise picker (search + category chips +
  create-new). Swapping, adding, and goal-lift selection all route through it.
  Don't write a second bespoke picker — that's how mid-session swap ended up
  missing search for a while.
- **Generation flow:** `currentPhase()` → `generatedDays()` → `buildDay()` →
  `resolveEx()` + `schemeFor()`. Roadmap blocks are ordered intents; dates are
  derived from anchor + order + durations, never stored per block.
- **`PENDING`** holds pre-workout plan edits until the session starts.
- **Readiness** drives load adjustment (discrete tiers) and warmup length
  (continuous score). Adjustments are downward-only by design.

## Testing

There's no test framework. Validate changes by extracting the script and
evaluating it with a stubbed DOM:

```js
const src = fs.readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
new Function(src + '\n;');   // syntax check at minimum
```

For logic changes, stub `localStorage`/`document` and call the pure functions
directly (`buildDay`, `nextPrescription`, `warmupRamp`, `isPR`, `importBackup`).
Always syntax-check before committing — a syntax error ships a completely dead app.

**After ANY change to prescription logic** (`nextPrescription`, `suggestFor`,
`seedDraft`, `logSet`'s post-set recompute, `schemeFor`, anything that produces a
weight/reps pair), run `node tests/prescription-invariants.js`. It must exit 0.
It checks that the reps a load is priced for are the reps returned with it, that
direction follows effort (easier set → more load or reps, harder → less, on
target → hold exactly), that load and reps never both rise, and that sets past
the %1RM chart are reported rather than silently ignored. This bug was reported
three times before the test existed; don't fix a case by patching one branch.

**Bump `APP_VERSION` in `index.html` on every meaningful change.** It's displayed
on the Lifts tab so the user can confirm which build is running.

## User context

- Training full body, 5 days/week. Powerbuilding, not competitive powerlifting.
- Goal lifts: weighted chin-up, deadlift, incline machine press.
- **Anterior shoulder instability** — labral tear with a Hill-Sachs lesion,
  pre-surgical. The `shoulder_instability` condition flags exercises loading
  abduction + external rotation. Take this seriously; don't weaken those flags.
- Gym is machine-heavy. Plate set has 2.5lb minimum, no micro plates.
- Kabuki Transformer bar = 55 lb, and its configurations are separate exercises
  (`transformer_*`) because the lever changes what's being trained.

## Copy style

Plain and direct. No exclamation marks, no hype, no "Great job!". When the app
states a number derived from a weak-evidence constant, say so plainly. Error
messages should tell the user their data is safe, because it is.

## How to work on this

**Plan before you write.** For anything beyond a one-line change, propose the
approach first and wait for a yes. Prefer plan mode.

**Offer options rather than picking silently.** When there's more than one
reasonable way to do something — and there usually is — lay out 2–3 with the
tradeoff spelled out, and ask which. "I'll do X" is worse than "X is simpler but
loses Y; Z is more work but handles Y. Which?"

**Ask when the request is ambiguous.** Especially when a feature request could
mean two different things. Guessing and building the wrong one wastes more time
than one question.

**One concern per change.** Don't bundle an unrelated refactor into a bug fix.
If you spot something else worth doing, mention it and let it be a separate
decision.

**Always, before committing:**
1. Syntax-check: extract the `<script>` block and `new Function(src)` it. A
   syntax error ships a completely blank app.
2. Bump `APP_VERSION`.
3. Say what changed and why, briefly.

**Don't refactor for its own sake.** This is a single-file app on purpose. It
isn't going to become modular, get a build step, or gain a framework. Optimise
for "one person can read the whole thing", not for architectural elegance.

**Push back.** If a request would break an invariant above, or is a bad idea for
training reasons, say so before implementing. Being agreeable about something
that corrupts training data isn't helpful.

## What to do when unsure

Ask rather than guess, especially around: volume accounting, the correction/
replay system, anything touching `localStorage`, and the shoulder flags. Those
four are where a plausible-looking change does real damage.
