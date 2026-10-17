# Batch F finish + batch H — progress

Read this first if picking the work up again. Decisions taken along the way are
in `docs/decisions-pending.md`.

## Order

1. v1.60.1 — bodyweight display patch (set rows, "last time", "Last logged") → main
2. Part 8 — `docs/features.md` audit + tester README → main
3. H1 — "Today's plan" briefing → main
4. H2 — plain language + glossary → main
5. H3 — design system (three directions, pick, `docs/design.md`) → branch `redesign`
6. H4 — onboarding → `redesign`
7. H5 — screen pass + `docs/guide.md` (includes old Part 7) → `redesign`, then ONE merge to main

## Status

| Step | State | Version / commit | Notes |
|---|---|---|---|
| 1 bodyweight display | done | v1.60.1 (c4ac241) | + v1.60.2: the 21 machines placed by guess (D1) |
| 2 Part 8 | done | v1.60.3 | docs/features.md, README.md; two maintainer-only leaks fixed (D4, D5); MEV/MRV wording left for H2 |
| 3 H1 | done | v1.61.0 | briefing after check-in + dashboard card; §64 (300 random days match their traces); D6–D8 |
| 4 H2 | done | v1.62.0 | glossary (docs/glossary.md, embedded, tap-for-definition), readiness card + detail sheet, status dots, every string audited (docs/h2-strings-changed.md); §65 renders 12 screens and scans them; D9–D15 |
| 5 H3 | done | v1.63.0 (branch redesign) | mockups + 18 shots in docs/design/, Calm chosen (D16), docs/design.md, tokens + light mode + directions + components on tokens, 16 icons; §66; D16–D18 |
| 6 H4 | done | v1.64.0 (branch redesign) | onboarding: 3 ways in, 8 questions, together steps, preview, apply; slotPicks + equipmentHave (inert for existing users); backup after first session; §67 (480 answer sets); persona walk + previews in docs/design/; D19–D26 |
| 7 H5 | done | v1.65.0 (branch redesign) | every screen on tokens; set-card icons; Part 7 (block cards + sparklines, week strip, condition card with focused deload, rehab/prep order); docs/guide.md (tasks + every setting + tours) and a searchable How this works; §68; before/after shots in docs/design/before, after; D27–D28 |

## Backtest baseline for this run

Maintainer export as of 8 Oct (169 sets): load mean |error| 5.0 lb, reps 2.0, exact load 90. Every version in this run must be IDENTICAL (nothing here touches prescriptions). v1.62.0: every number identical; only the "basis" text column differs ("from e1RM" → "from your estimated max"), compared with that column cut. Script: scratchpad btcompare.sh <ref>.

Big batch (12 Oct) baseline, maintainer export as of 12 Oct (215 suggestions): load mean |error| 5.7 lb, reps 1.8, exact load 123. Only Parts 1a and 1b (and A1 if edited sets change what is read) may move it.

## Merged

H3–H5 were merged to main once (bf84262), as v1.65.0. At that point:
- all suites passed (66,817 checks);
- the headless new-user walk passed for all three personas;
- the backtest was identical to main.

## After the report

- v1.65.1: RPE back on screen (D10 reversed), dark by default with light as the LIGHT theme code (D17 reversed), no "Get fit and toned" (D19 reversed).
- v1.66.0: "last time" beside each planned set on the set card (D16 follow-up, D29).
- D1 corrections: still to come from you.

## Mobile layout fix (priority, v1.67.0)

Root causes, the one-primitive fix, history, setup draft, diagnostics and error notes: D30–D36. tests/mobile.js: 894 checks on 6 device/engine combinations; §70 lints the rules.

## Big batch, 12 Oct ("ready to hand to anyone")

Appendix A (the 11 Oct combined batch) had not shipped; only D16 (v1.66) was in.
D10 and D17 were already reversed at your request in v1.65.1 (RPE back, dark
default, light as the LIGHT code); D10's label setting is still built (Part 0
of Appendix A). Order: Appendix A by reported impact, then Parts 1–6, then 7–8.

| Part | State | Version | Notes |
|---|---|---|---|
| A1 edit = delete + relog | done | v1.68.1 | corrections merge (one rule: correctionMap/corrected), edits recompute the next set, readers that skipped corrections fixed; §72; backtest: one row (20 Sep double edit) moved, error 10 → 0 reps; D38 |
| A7 readable themes + voice packs | done | v1.74.0 | THEME_RULES (text 4.5, shapes 3, ΔE 20, no saturated-on-saturated), accent-fill token, every built-in nudged to pass, #RRGGBB codes nudged on apply; docs/voices.md (Goblin, Terminal, Girlypop × 9 moments), only celebratory toasts voiced; §80, §81; D47, D48 |
| A8 strength ↔ size slider | done | v1.73.0 | stops = profiles, ratio blends, nearer stop for the rest; setup (Fine-tune / open in together, live blocks) and Edit program (re-plans from the next block); sequencer never returns an empty plan; §79; D46 |
| A0 decision changes | done | v1.72.1 | D16 was in (1.66); D17 superseded by your 9 Oct choice (LIGHT code); D10 RPE/effort setting (display pass, setup default, notes untouched); D21 equipment chip; §78, mobile effortCheck; D45 |
| A10 I know my numbers | done | v1.72.0 | weight × reps + chips, class: bw/added/assist (0 ok), stored on the track; same input in setup, starting estimates, Edit program; §77; harness compiles the app once (32 s); D44 |
| A9 setup wording | done | v1.71.1 | Commercial gym, Home gym (machines last; pull-up bar), Build it together recommended; §76; D43 |
| A5 readiness card: room and numbers | done | v1.71.0 | three sections, score/100 + band word + effect, joints n/3 vs usual, sheet opens with the scales; §65 updated; D42 |
| A3 Workout tab is the editable preview | done | v1.70.0 | live-card controls on plan cards, last time per set, Save to program button, last-day line, no Preview button; §75, mobile previewCheck; D41 |
| A6 app errors grouped, tour steps tested | done | v1.69.1 | errors collapsed apart from notes, last in the copy; every tour step in mobile.js (all passed on 1.67 too); card capped at the visible height; D40 |
| A4 plain words in the workout | done | v1.69.0 | flag chip → info sheet "For your shoulder", plainText() + CLINICAL_WORDS, pain check names the set, no made-up Feel it, no pre-session banner; §65 scan + §73 corpus; test harness memory leak fixed (navigator.storage); D39 |
| A2 which exercise is current | done | v1.68.0 | rule in CLAUDE.md, ruleCurrent/syncCurrent, §71, mobile.js reorder repro (fails on 1.67.0 on both engines, passes now); D37 |

Appendix A is complete (v1.68.0–v1.74.0).

| Part | State | Version | Notes |
|---|---|---|---|
| 8 Explore day ("Try new exercises") | done | v1.85.0 | inside Train a different day (your call: rare, plain name) + proposals at block start and deload; never-logged options by pattern/muscle/equipment, nothing red; main lifts stay; RPE 7, 3 sets; explore sets skip accuracy/dial/auto-pick; Keep any of these? use / take turns / forget; §92; D60 |
| 7 rehab and prehab, tracked | done | v1.84.0 | rehab_set events (never sets); feel-it 10 days + 3 sessions; one step a week max (reps → slow lowering → load); library pain rule + next-morning check; flare steps back and holds; graduation proposed; Progress history card; §91; D59 |
| 6 ready for testers | done | docs | README rewritten, real-phone checklist (15 steps), tester welcome message, ALPHA updated; full mobile.js on 6 profiles: 2050 checks, 0 failed; D58 |
| 5 warm-ups that fit the day | done | v1.83.0 | main lifts → conditions → soreness with why; cap kept with a place per kind; your own warm-up/rehab items, per day or all; removals remembered; §90; D57 |
| 4 number audit | done | v1.82.0 | docs/number-audit.md (39 items); sentences for block sparklines and landmark grids; intensity, events, tonnage headline removed; charts say what they're for; §89; D56 |
| 3e demo Jump to | done | v1.81.0 | every block/week + shortcuts (strength, test, deload, stall); lands on the week (mobile.js, real browser); §88; D55 |
| 3c first-time tips | done | v1.80.0 | nine moments, in-flow cards, once each, Got it, More → guide, Reset tips; §87; D54 |
| 3a/3b/3d setup header, How your program works, tours | done | v1.79.0 | Step N of M + bar; six cards from your plan after the preview (skip/replay); End tour, Back, scope line; §86; D53 |
| 2 Settings tab, shorter Program | done | v1.78.0 | five tabs at 375 px; sync/backups/appearance/voice/words/equipment/rest/help/about/start over/maintainer in Settings; Edit program training only; Lifts = cards + library; changelog history in About; guide Settings tour; §85; D52 |
| 1c rest per exercise | done | v1.77.0 | defaults 4:00/3:00/2:30/1:45 (research cited; repo research has no rest section), info sheet + Always on the rest bar, offer after 3 sessions; §84; D51 |
| 1b strapped deadlift: usual variant | done | v1.76.0 | cause: straps track vs plain track; CFG.usualMods drives slots, bests, goals, stall; labels; proposal after 3 in a row; real log: 93 kg -> 120 kg with straps as usual; §83; D50 |
| 1a rep range, one rule | done | v1.75.0 | slotRepRange() on read everywhere; main lifts follow the block; §82; fails on 1.74 (6-10), passes now (8-15); rule in CLAUDE.md; backtest identical; D49 | Note: node 22.17 on this machine crashes intermittently (SIGSEGV/SIGILL) inside the invariant suite; a rerun passes. The ship script retries once on a crash, never on a failure.

## Half-finished

(nothing)

## Checks to run before every commit

- syntax check (`new Function` on the main script)
- `node tests/prescription-invariants.js` (0 failed)
- `node tests/simulate.js` (all checks passed)
- `node tests/injury-validate.js` (all checks passed)
- backtest against the maintainer's export must stay identical (fetch with curl, delete after)
- APP_VERSION bump + CHANGELOG entry + `node tools/embed-changelog.js`
