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
FeedbackScript.gs       append-only receiver for testers' notes (CFG.feedbackUrl), never readable back
CHANGELOG.md            what changed per version, newest first; the top entry is embedded as the in-app "What's new" card
tools/embed-changelog.js   copies CHANGELOG.md's top entry into index.html
docs/tutorial.md        the user guide AND the in-app tours (each ### is a step, target in backticks); embedded byte-for-byte
tools/embed-tutorial.js    copies docs/tutorial.md into index.html (§62 fails if they differ, or a step body is under 8 words)
tools/library-report.js    the library by implement, and every generated entry whose tags/flags differ from its parent (with the reason)
ALPHA.md                tester plan, incl. what a tester's data touches — keep it true when changing network/storage code
shoulder-protocol.md    reference doc, not used by the app
tests/prescription-invariants.js   prescription direction/pairing tests, run with node
tests/backtest.js       replays the engine against a real exported log to measure suggestion accuracy
tests/prospective.js    engine phase 2 check: were suggestions taken, did they land on target (node tests/prospective.js <export>)
tests/simulate.js       persona simulator: made-up lifters train through the real app for months (node tests/simulate.js)
docs/calibration-plan.md   phase-2 personal-calibration spec, not yet implemented
docs/coaching-cues.json    per-exercise coaching cues — the editable source (see below)
docs/injuries.json      injury & condition library — the editable source (research schema + avoid[].level)
docs/injuries.derived.json  built from it by tools/derive-injuries.js (umbrellas = own tags + children's CORE tags)
docs/movement_tags.json movement-tag vocabulary + the tags each built-in exercise carries + modifier effects
tools/derive-injuries.js   writes injuries.derived.json and embeds both JSON files into index.html
tests/injury-validate.js   library checks incl. the over-flagging limits (≤30% flagged, ≤10% red per condition)
```

**Coaching cues are a two-step edit.** `docs/coaching-cues.json` is the source.
`index.html` carries a byte-for-byte copy in `<script type="application/json"
id="coaching-cues">`, because the app stays one self-contained file. After
editing the JSON, paste its full contents into that block unchanged.
`tests/prescription-invariants.js` fails if the two differ.

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
An earlier design-phase document called `engine-constants` graded every
constant A-D but was never committed to this repo — don't cite it, it isn't
here. `docs/calibration-plan.md` is the current spec for personal calibration
(phase 2, not yet built); read that instead.

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
- **Library model (spec §1):** every exercise has a family (`familyOf()`,
  from its pattern; six tracked compound families, the rest `isolation`), and
  may have a `parent` + `specificity` (`EX_LINKS` for built-ins, set at
  creation for custom ones). **Fold rule:** if only position, range or tempo
  changes, it's a modifier on the parent; if the muscle emphasis shifts, it's
  a separate exercise (close-grip bench stays separate — it's a triceps
  movement). Folded entries stay in `EX` for old data but are never offered
  or generated.
- **The wider library (v1.55):** every exercise has an `implement` (barbell,
  Smith, specialty bar, dumbbell, kettlebell, cable, selectorised, plate-loaded,
  bodyweight, band; `machine` where the library can't tell which). Implement is
  display, search and generator preference; pricing still comes from `load`, and
  a new implement only maps onto an existing path. New entries are declared in
  `LIB_GEN` as [id, name, parent, implement, extra] and filled in from the
  parent; tags, cues and hand-written flags are read through the parent chain
  (`baseTags`, `cueFor`, `authoredFlag`). Any override (`tags`, `noFlag`)
  needs a `why` — `node tools/library-report.js` lists them. `named` entries
  (incline, one-arm, grip versions) are auto-picked only once logged.
  `resolveEx` ranks history first, then the equipment answer (revealed
  preference). `straps` is a modifier on pulls (removes the grip mechanism);
  carries and hangs don't get it. Over-flagging is measured on the library as
  the app applies it (generated entries, strapped versions, isometric holds).
- **Bodyweight-relative class (v1.56):** pull-up, chin-up, dip, push-up,
  inverted row, pistol and their assisted versions (`BW_CLASS`) price on
  SYSTEM LOAD = bodyweight + added − assistance × ratio. You type what's on the
  machine; `engLb(st)` is the one place a logged set becomes the load the engine
  prices on, `trackRoot()` makes each movement one track, the grid
  (`gridFloor`/`stepUp`/`loadable`) steps the stack in system space at today's
  bodyweight, and `suggestFor()` converts back once (`classTypedRx`: assistance
  rounds up, added weight down). Past sets use the nearest prior bodyweight
  (`bwInfoAt`; before the first reading, the first one, "assumed"). Never read
  `toLb(st.weight)` for pricing a class set. Handoffs between versions are
  proposals (`handoff` events → `classVersion`); goals stay on the movement.
- **"Don't care about this" (v1.58):** `CFG.deprioritised` {muscles, patterns}.
  Muscles rank last in `resolveEx` (only when every direct muscle is one you
  don't care about). Patterns hand their ACCESSORY slots to another pattern
  that trains the same muscle (`PATTERN_NEIGHBOURS` first) inside `buildDay`;
  `applyDepFloor` undoes any swap that would leave a muscle under the bottom
  of its typical range. Primary slots and saved days never move; it never
  touches a prescription, a flag or the dial. Slots carry `dep` for the chip.
- **`exPicker()`** is the one shared exercise picker (search + category chips +
  create-new). Swapping, adding, and goal-lift selection all route through it.
  Don't write a second bespoke picker — that's how mid-session swap ended up
  missing search for a while.
- **Generation flow:** `currentPhase()` → `generatedDays()` → `buildDay()` →
  `resolveEx()` + `schemeFor()`. Roadmap blocks are ordered intents; dates are
  derived from anchor + order + durations, never stored per block.
- **Programs come from the builder (spec §3–4).** `sequenceBlocks()` is a
  pure function (profile parameters, experience, weeks, test date → blocks +
  reasons); `planFromNow()` keeps finished blocks and the current one;
  `openBuilder()` / `applyBuilder()` are the only path that writes a whole
  roadmap, and only on accept. Peak is not a block type — it's `taper:true`
  on a strength block. Blocks marked `refined` run the batch-B hypertrophy
  rules (maintenance top set, effort ramp, calibration AMRAP, set cap); a
  program already under way only gets them from its next block.
- **The app proposes, you decide.** Program changes the app suggests
  (deloads, stall interventions) go through `PROPOSAL_SOURCES` → cards on
  the dashboard. Never switch silently. The one exception, decided Oct 2026:
  a main lift's progression rate demotes from fast to standard on its own
  (it only ever slows a lift down). Stall interventions can auto-start only
  if `CFG.autoIntervene` is on (opt-in), and always with an undo card.
- **Stall engine (spec §5).** `stallState()` → `stallPlan()` → `stallCard()`.
  Step 0 always comes first: exposure (trained less than weekly is not a
  stall), deficit, fatigue (incl. the lift's own sets running over target
  and a deload in the last two weeks); nothing adds work while fatigue is
  showing, and taking a deload stops added practice volume. Interventions are
  `intervention_start`/`intervention_end` events; status and outcome are
  derived (`interventions()`, `ivOutcome()`), never stored. They act on the
  week only through `applyInterventions()` in `generatedDays()`. Decision
  tables are data (`STALL_TABLES`). With `shoulder_instability`, anything an
  intervention ADDS to a barbell press goes to `addedExposureFor()`'s
  substitute — don't route added pressing around it.
- **Progression rate is per main lift, not a program model.** `rateState()`
  derives fast / standard from the log plus `CFG.rateSeed` (new setups seed
  from the experience answer; existing programs were classified once from
  the log). Fast = last top set + one step while it hits target; two
  consecutive misses → standard; at each block boundary 3 of the last 4
  exposures adding load → fast. Profiles, sequencer and accessories ignore
  it. A lift on standard must never reach `fastRx()` — §39 checks this.
- **A week is a list of day types** (`CFG.week`, or `b.week` per block; 2–6
  of full/upper/lower/push/pull/legs). `splitOf()` turns any spec — a week,
  or an old preset name in `CFG.split`/`b.split` — into one shape. Presets
  must keep producing exactly the days they always did. Day names are stable
  (Upper A, Push B) because saved day edits are keyed by name.
- **Program position counts sessions, not calendar days.** `currentPhase()`
  uses `programSessions()` (trained sessions since `CFG.start`); the calendar
  only enters through `programProjection()`. Don't reintroduce date-based
  week counting anywhere — it made the week and the day rotation disagree.
- **Joint ladder:** `jointNoteFor(pattern)` is the one place a joint level is
  computed (buildDay, the check-in, and tests/backtest.js all call it). Flags
  count per session, weighted by severity; levels 3+ really do hold load.
  The ladder answers change from your baseline (`jointBaseline()`: a usual set
  in `CFG.jointUsual`, else a rolling median), never absolute level — a
  chronic rating at your usual only lengthens the warmup. A bad rating always
  counts. Don't make it climb on persistent mild ratings again.
- **Rating scales are centred in one place.** `fromNeutral()` + `SCALE_SPEC`
  decide where a scale is neutral; readiness, soreness, recovery and joints
  all go through it. Never centre a rating by hand (§19 scans for it).
- **Storage goes through `STORE`, never `localStorage` directly.** In demo
  mode (`?demo`) `STORE` prefixes every key with `trainlog-demo:` and the
  demo has its own clock (`DEMO_OFF`); network paths check `DEMO` and stop.
  The only direct `localStorage` reads are `STORE`'s own definition and
  `demoCopyReal()` (read-only). §43 checks real keys stay byte-identical.
- **Injury library (batch D1a): the app warns, it never decides.** Conditions
  are library ids (`INJ`, from docs/injuries.json; old ids map via
  `LEGACY_COND`, and `legacyConds()` keeps every rule keyed by the old ids
  working). An exercise is flagged when its movement tags (`exTags()`,
  modifiers add/remove) meet a selected entry's avoid tags: umbrella → amber,
  specific core → red, structural non-core → a note. The hand-made `FLAGS`
  table is an authored layer that decides where it has an opinion — never
  soften the shoulder_instability rows. Rows added after v1.44 go in `FLAGS_ADDED`
  (yellow, with a swap and an optional modifier that clears them) so the
  one-time exclusion seed never picks them up. Your own ratings (`exercise_joint`
  events → `exerciseVerdict()`) outrank both. **Flags never steer
  generation**; only `CFG.excludedEx` (your exclusions) does, and the app
  only ever *proposes* an exclusion. Over-flagging is a hard test — narrow
  tags, don't loosen limits. Editing the library is two steps: edit the JSON,
  run `node tools/derive-injuries.js`, then `node tests/injury-validate.js`.
  Specialty bars (`specialty:` on the Transformer entries) are never
  auto-picked until logged.
- **Injury library part 2 (D1b).** Consent before the first pick
  (`CFG.injuryConsent`; research A4 copy verbatim — don't reword it), red
  flags per entry (`CFG.condRedFlags`: ticked → no phase plan, warnings stay),
  pain during a set (`set_pain` events → `painRule()`: the research's model
  plus its overrides; every "stop" is advice with buttons, never a lock),
  pre-session cues (max 2, structural core cue first), and opt-in phase plans
  (`rehab_plan` events; a card proposes the next phase, never advances on its
  own). "Delete my conditions and pain ratings" appends `pain_data_cleared` —
  readers skip ratings before it; the log stays append-only. New exercises
  added for the library (jumps, Olympic lifts, flyes, behind-the-neck) are
  `manualOnly`: never generated, always addable.
- **Testers:** restoring a backup never imports `syncUrl`/`feedbackUrl`/
  `testerName`; setup links (`?sync=&feedback=&who=`) can also be pasted in
  Settings; `isTester()` hides owner-only copy. ALPHA.md is the setup guide.
- **One modifier model (batch E).** Every adjustment to a suggested number
  is a modifier in `ENGINE.modifiers` (mirrored in docs/modifiers.md — §52
  fails if the ids drift). `suggestFor()` → base (`progression`/`range_fit`)
  → `runModifiers()` in precedence order (dial → global readiness / sick day
  → local soreness → joint ladder → focused deload → condition flags) →
  guards (calibrating, floor, one step, ceiling, both-up), every step in
  `trace[]` (stored in the suggestion log, shown as "Why these numbers").
  Never add a new adjustment outside this pipeline. Global signals (sleep,
  motivation, rest of life) never cut load except a 1 (sick day, one step,
  today only); soreness is local; nothing persists without an expiry.
  Cuts never add up: sick day, soreness and the ladder's −10% on one
  exercise → the largest applies, the rest are traced as superseded (sets
  too). A coarse step (≥7% of the load) isn't spent on a small overshoot:
  `coarseHold()` holds the load unless RPE ≥ target + 1.5, RPE 10 or a miss. Focused
  deload = `focused_deload_*` events (one window; adding joins it; ramp-back
  is proposed, never automatic). The dial = `dial_set`/`dial_reset` events
  plus revealed overrides; it replaced override damping. Program changes
  append `program_edit` (the next session is "calibrating": no step up).
  §52 runs 1200 randomised stacks — if it fails, fix the interaction, not the test.
- **`PENDING`** holds pre-workout plan edits until the session starts.
- **Readiness** drives load adjustment (discrete tiers) and warmup length
  (continuous score). Adjustments are downward-only by design.
- **Colours are tokens, and themes override them.** `THEMES` (theme codes,
  `CFG.theme`) swaps the `:root` custom properties; a new theme is one object.
  Never hardcode a colour. Use `--accent` for interface (buttons, selection,
  charts), `--hyp/--str/--peak/--deload` only where the colour means a block
  type, `--warn/--danger` for flags and warnings. Theme toast rewordings
  match exact messages; never add error or data-safety messages to them.

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
`nextPrescription()` dispatches between two pricing paths — `isChartFree()`
picks the %1RM chart for barbell/dumbbell/bodyweight, direct RPE-delta
stepping (`rpeDeltaStep()`) for machine/stack/cable — both must satisfy the
same invariants.

**Also run `node tests/backtest.js <export.jsonl>`** against a real exported
log for any change with a real effect on suggested numbers — readiness,
pricing paths, caps, fatigue, stagnation probing. Record the error numbers
before and after; a change is only worth keeping if error drops. Read the
output carefully rather than skimming the top line — a change can look
better overall while making one exercise or one segment (first-set vs.
later, one equipment type) meaningfully worse, and a backtest necessarily
measures agreement with what was logged under the OLD engine, so some
disagreement after a genuine fix (the engine correctly suggesting a
progression the old one never surfaced) is expected, not automatically a
regression — use judgement, don't just read the overall percentage.

**Bump `APP_VERSION` in `index.html` on every meaningful change.** It's displayed
on the Lifts tab so the user can confirm which build is running. **Every bump
adds a `CHANGELOG.md` entry** (newest first, 3–5 plain lines on what a user
would notice), then `node tools/embed-changelog.js` copies it into the app's
"What's new" card. §54 fails if the entry, the embedded copy and `APP_VERSION`
disagree.

## User context

- Training full body, 5 days/week. Powerbuilding, not competitive powerlifting.
- Goal lifts: Transformer bar squat, deadlift, incline machine press (from settings, Oct 2026 — weighted chin-up was earlier).
- Profile: size first, occasional PRs (chosen Oct 2026). New hypertrophy rules (effort ramp, calibration AMRAPs, set cap) start from the next hypertrophy block, not mid-block.
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

**The current plan is `roadmap/ROADMAP.md`** — read it first; it sets the batch order and the decisions already made.

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
2. Bump `APP_VERSION`, add the `CHANGELOG.md` entry, run `node tools/embed-changelog.js`.
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
