# Home training library: import status and the ladder design (batch N Part 3)

**Update, 24 Nov 2026: imported in v1.108.0.** The codes came from `docs/research/exercise-library.md` (batch L, v1.106.0). Every parent but four resolves through them, and those four are handled in D84. Section 1 below is kept as the record of why it stopped. Ladders follow the design in section 2, with one change: the return ramp starts at 21 days now, so the "10–20 days" line no longer applies.

Two things are here: why the import stopped before importing anything, and the ladder design the batch asked
for before ladders are built.

## 1. Why the import stopped

The research (`docs/research/home-training.md`) refers to exercises by ids such as `C032`, `V115` and `R29`.
Its "update" rows and its `parent`, `easier` and `harder` columns all use them. The batch says to import with the
batch L mapping in `docs/library-rules.md`. That file isn't in this repo, and neither are those ids: not in
`index.html`, the docs, the roadmap or `Downloads/strength-spec`. The research seems to have been written against
a list of the library that labelled each exercise with a code. That list never made it here.

Matching on names gets this far:

| What | Count | Detail |
|---|---|---|
| "Update" rows whose name matches an exercise here | 22 of 60 | e.g. Goblet squat, Bulgarian split squat, Farmer carry |
| "Update" rows naming an exercise this library doesn't have | 38 of 60 | e.g. Incline push-up, Knee push-up, Diamond push-up, Pike push-up, Wall handstand push-up, Bench dip, Wall sit, Glute bridge → single-leg, Slider leg curl, Nordic hamstring curl (this library has "Nordic curl"), Dragon flag, Dumbbell floor press, Dumbbell pullover |
| Ids used but never named anywhere in the research | 47 | C001 C003 C004 C007 C008 C009 C010 C013 C021 C022 C025 C031 C035 C037 C039 C045 C051 C053 R02 R04 R18 R25 R28 R37 R41 R45 R47 V062 V069 V076 V077 V079 V089 V121 V130 V167 V174 V177 V180 V181 V183 V190 V194 V195 V206 V219 (and "C15" is a source, not an exercise) |
| New rows whose parent has no name in the research | 28 of 57 distinct parents | the parent decides a new row's movement tags, so its joint flags |
| New rows that collide with an exercise here (reported, not imported) | 3 | H039 Hip airplane = the warm-up library's Hip airplane; H061 DB front raise = `db_front_raise`; H067 DB kickback = `kickback` |

**Why this is a stop, not a best guess:** a new row takes its movement tags, cues and hand-written flags from its
parent (CLAUDE.md, the wider library). A wrong parent is a wrong joint flag, and the shoulder flags are the one
area the project says never to guess. Chair dip, upright row, handstand work and wide flies all hang off parents
the research doesn't name.

**What would unblock it** (either one):
1. The list the research was written against, with each code next to an exercise. Then the mapping is mechanical,
   and the 38 rows with no exercise here become new rows rather than updates.
2. A mapping table I draft by name and pattern (57 parents and 47 unnamed ids), for you to check before anything is
   imported. Shoulder-flagged rows would be listed first.

**Done anyway, because it doesn't depend on the ids:**
- The research is saved (`docs/research/home-training.md`).
- The two built-in places, "At home, dumbbells" and "No equipment", exist in the engine (Part 2.3) with stand-ins
  from this library. With today's library, **"No equipment" has no stand-in for an overhead press or a vertical
  pull**: there's no pike push-up and no doorway row yet. Those are research rows H008 and H013–H017, so the batch's
  test that every main gym lift has a stand-in in both places can only pass after the import.

## 2. Ladders: the design (built after your yes)

A ladder is an ordered list of harder versions of one movement, such as the push-up ladder from wall push-ups to
one-arm push-ups. You move up by changing the version, not by adding load.

**A rung is an exercise, on its own track.** Each rung already is, or will be, a library exercise: decline push-up
(H001) is its own exercise with its parent's tags. A rung's history, best sets and suggestions stay its own,
exactly like a variant today, so nothing mixes two rungs' reps together. The ladder adds a `ladder` id and a
`ladderStep` to each rung. Rungs that share an exercise and differ only in setup (incline push-up at wall,
counter, chair) are one exercise with a modifier, like a pause, so they keep separate histories.

**Moving up** happens in the research's order, and only on the rung you're on:
1. the leverage or range change in `progLever` (feet higher, a deeper range);
2. tempo, then a pause (3-1-1, then a 2 s pause at the hardest point), as modifiers on the same rung;
3. reps, up to the `moveUp` target (e.g. 3 × 15);
4. once `moveUp` is met at RPE ≤ target, a **proposal** to move to the next rung. The app proposes, you decide, as
   with handoffs between bodyweight versions today. On the new rung the suggestion starts at the bottom of the rep
   range.

**The guards, on a ladder:**
- *One step:* one change per session, either one lever/tempo step or a few more reps, never both. Moving to the
  next rung is that session's one step.
- *Floor:* on the same rung, reps don't drop under 85% of the best of the last 6 sessions unless the set was
  missed. On a new rung the floor starts fresh, because it's a new track.
- *Ceiling:* the rung's own history, as now. The low-load rule caps it: **past 30 reps, the suggestion is the next
  rung, never more reps** (research rule 4). Without a next rung it's a tempo or pause step.
- *Both up:* a rung change never comes with more sets.

**The return ramp on a ladder:** after 21+ days away, the first session back **drops one rung** (recommended in
the batch) at the bottom of the rep range. 10–20 days: same rung, reps from the bottom of the range. Back to the rung
you were on by the band's week, through the normal move-up proposal.

**On the set card:** the rung's name (it's the exercise), a small "Step 6 of 11 · Push-ups" line under it, and,
when you meet `moveUp`, the proposal card: "3 × 15 on decline push-ups. Next: archer push-up?" with Move up / Not
yet. A tap on the step line shows the whole ladder with your rung marked. Mockup 6 in Part 4 shows it.

**Bodyweight share:** where the research measured it (push-ups: 41% of bodyweight at a 60 cm incline up to 74% at a
60 cm decline, Ebben 2011), the rung prices like the bodyweight class (system load = share × bodyweight), so a
heavier you makes the same rung harder and the numbers stay comparable. Every other rung is reps only, with no
invented load.

**What it needs from the import:** the ladder rows (`ladder`, `ladderStep`, `moveUp`, `progLever`) on real exercise
ids, which waits on the mapping above.
