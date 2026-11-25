# Library rules: adding or editing an exercise

Read this before touching the exercise library. It's how batch L imported `docs/research/exercise-library.md`, and how anything added later should work. Where a research file and the app disagree, the app wins.

## Where things live

| What | Where |
|---|---|
| Hand-written built-ins | `EX` in `index.html`, tags in `docs/movement_tags.json` |
| Generated variants (implement versions of a built-in) | `LIB_GEN` in `index.html` |
| The researched library | the decisions in `tools/import-library.js`; the result in `docs/library.json`, embedded byte-for-byte as `<script id="library-data">` |
| Your coaching cues | `docs/coaching-cues.json` (embedded the same way) |
| What the last import did | `docs/library-import.md` (written by the tool) |

To change the researched library: edit the decision table in `tools/import-library.js`, run `node tools/import-library.js`, then `node tests/prescription-invariants.js` and `node tests/injury-validate.js`. Never edit `docs/library.json` by hand; §105 fails if it and the embedded copy differ.

## Required fields

Every exercise needs an id (lowercase, underscores, never reused or changed once shipped), a name, a pattern, an implement (one of the ten: barbell, Smith, specialty bar, dumbbell, kettlebell, cable, selectorised, plate-loaded, bodyweight, band), and a main muscle (a `vol` entry of 1). A new entry under a parent takes its pattern, muscles, pricing and tags from the parent unless it says otherwise. One with no parent needs its own pattern and muscles in the tool's `ORPHAN` table.

From the research, where given: setup, cues, mistakes, easier and harder versions, why people like it, the evidence grade, the flag (RISK, POP-LOW), the home flag, and the rep range.

## Research codes

A research row's code (C001, V045, R12, and later files' codes) is stored on the exercise it maps to (`ex.codes`), or with the modifier signature it became (`LIB_CODES`). A later research file refers to a parent by its code. A code never moves to another exercise once shipped. A row that is two exercises is split (`'split:id,id'`, the `SPLIT` table): both are new entries, and the row is listed once under `splits`.

## Match first, never a second copy

Before adding anything, match it to what the app has: by name and aliases, then by pattern and implement. An existing exercise keeps its id and gets only its empty fields filled. Never overwrite your coaching cues, anything in `coaching-cues.json`, or a custom exercise. Where the research and the app disagree (tags, cues), list it under Conflicts in `docs/library-import.md` and leave the app's version. If you aren't sure which exercise a row is, don't guess: mark it uncertain (`'?:why'`), leave it out with anything that depends on it, and ask.

## Variant or modifier

If a variant differs from its parent only by pause, tempo, range (including lengthened partials and 1¼ reps), grip, straps, bar position, bands or chains, or a deficit, it's a **modifier** on the parent, not a new exercise. It gets its own history track through its modifier signature. Everything else is a new exercise with `parent` set. This follows the fold rule in CLAUDE.md: if the muscle emphasis shifts (close-grip bench), it's separate.

New modifier kinds go at the end of `modSig()`, so no existing signature changes.

## Movement tags

Map the research's joint flags through the table in `docs/library-import.md`. Use an existing tag wherever one fits; add a new one only when nothing does, with a one-line definition in `docs/movement_tags.json`, and only if some exercise carries it. A new exercise carries its parent's tags plus whatever the research flags add. It's never gentler than its parent. Never soften a `shoulder_instability` row. Where a row has no flags (the rehab table), add a tag only where the row's own setup puts a joint in a tagged position (`EXTRA_TAGS`), and say so.

Over-flagging is a hard test: if `tests/injury-validate.js` fails, narrow the tags, don't loosen the limits.

A research flag on an exercise the app already had is adopted only on the maintainer's say-so (`ADOPT_TAGS`, applied at load with its reason). Check it against the maintainer's own condition notes and §47/§56 first: where they disagree, ask. A training exercise and a rehab row that are the same movement say so on both (`SAME_MOVE`); their histories stay apart.

## Evidence wording

Shown on How to do it only, never mid-set:

| Grade | Words |
|---|---|
| A or B | Backed by research. |
| C | Some research support. |
| D | Coach and lifter favourite. |

- Never a study number, a percentage, a year, or a person's name (the coach behind a pick, an author, a protocol named after someone). Sources stay in the data files.
- Exercises keep their standard names, even when the name is a person's (Zercher squat, Larsen press, Pendlay row).
- Lengthened partials are "an alternative with similar results to full range", never better.
- A preprint gets the C wording until it's peer reviewed (`GRADE_OVERRIDE`).
- POP-LOW: "Popular, but research shows little advantage over [the parent]."
- RISK: a caution on How to do it. A condition warning comes only through the normal flag path.
- Isometrics are never described as pain relief.

## Cue style

The app's copy rules apply: plain words, no exclamation marks, no clinical terms (`CLINICAL_WORDS`). Each setup, cue or mistake line is 72 characters at most, so it fits the card at 375 px. "Why people like it" is generic ("A favourite for side delts"), never a name or a number.

## What the generator picks

- Core rows and the app's base entries can be picked for you. Named variants (`named`) are picked only once you've logged them. `manualOnly` entries are never picked, but you can always add them.
- RISK rows are never picked for you unless you've logged one or made it a goal lift.
- Specialty bars are picked only once logged.
- Where two candidates tie, the grade-B choice wins (`LIB_PREFER`: the seated leg curl, the overhead extension for one triceps slot, the reclined leg extension). It's a tie-break only. What you've logged always comes first.
- The research's rep range is the default for a new entry in non-primary slots. Your own range wins, and main lifts follow the block. Exercises the app already had keep their defaults.
- Flags never steer generation; only your exclusions do.

## Checks (§105, and the injury validator)

Every research row is accounted for once. Ids are unique, parents exist, and existing ids are untouched. Every tag is in the vocabulary, and every new tag is carried. New entries are never gentler than their parent. No RISK row turns up in 1000 picks or 60 generated weeks. Lines fit the length limit and the word rules. No names or study numbers appear. With your history, the week is the same with the library as without it.
