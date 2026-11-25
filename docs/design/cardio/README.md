# Quiet cardio: one small card (mockups, waiting for a pick)

The maintainer's brief: one small card, with an activity, minutes and an optional heart rate, that can be logged by itself from Today and after a session. Live app screens on demo data, dark and light, 390 px. Nothing is wired.

1. **On Today** (`1-today`): the card sits under today's plan. The activity is the last one you logged; minutes step by 5 (− / +); heart rate is an optional average in bpm. "Log 20 min" saves it. It says "not counted as sets", because it never is.
2. **The activity list** (`2-activity`): the research's ten quiet-cardio rows, each with its dose and noise rating, then "Something else" (type a name). With a shoulder condition, shadow boxing shows the research's shoulder note.
3. **After a session** (`3-after`): the same card on the summary, above Done, headed "Any cardio today?".

What it would log: one `cardio` event (activity, minutes, heart rate or nothing). No calories. No engine reader: it never counts toward sets, volume, fatigue or readiness, and it never mixes with lifting load (CLAUDE.md: no combined fatigue score). It would show in Progress as a line per entry.

Copy to fix when it's built: "Wall-sit BP block" becomes "Wall sit for blood pressure"; the doses read "3-minute rounds, 6 to 10", not "3-min rounds x6-10".
