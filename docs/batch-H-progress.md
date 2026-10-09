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

## Half-finished

(nothing yet)

## Checks to run before every commit

- syntax check (`new Function` on the main script)
- `node tests/prescription-invariants.js` (0 failed)
- `node tests/simulate.js` (all checks passed)
- `node tests/injury-validate.js` (all checks passed)
- backtest against the maintainer's export must stay identical (fetch with curl, delete after)
- APP_VERSION bump + CHANGELOG entry + `node tools/embed-changelog.js`
