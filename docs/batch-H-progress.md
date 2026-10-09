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
| 2 Part 8 | not started | | |
| 3 H1 | not started | | |
| 4 H2 | not started | | |
| 5 H3 | not started | | |
| 6 H4 | not started | | |
| 7 H5 | not started | | |

## Backtest baseline for this run

Maintainer export as of 8 Oct (169 sets): load mean |error| 5.0 lb, reps 2.0, exact load 90. Every version in this run must be IDENTICAL (nothing here touches prescriptions). Script: scratchpad btcompare.sh <ref>.

## Half-finished

(nothing yet)

## Checks to run before every commit

- syntax check (`new Function` on the main script)
- `node tests/prescription-invariants.js` (0 failed)
- `node tests/simulate.js` (all checks passed)
- `node tests/injury-validate.js` (all checks passed)
- backtest against the maintainer's export must stay identical (fetch with curl, delete after)
- APP_VERSION bump + CHANGELOG entry + `node tools/embed-changelog.js`
