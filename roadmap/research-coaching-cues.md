# Research brief — coaching cues

Run this in a chat with research enabled, before batch 6 item 7. The output
goes into the repo as `docs/coaching-cues.json`.

Before running it: export the list of exercises you've actually logged (the
Sets tab of your backup sheet, unique exercise names) and paste it in where
marked. The brief targets those plus the common compounds — not all 128.

---

I need concise, high-quality coaching cues for a set of resistance exercises,
to show inside a training app at the moment someone is about to do the lift.

## Source quality

Draw from coaches with a track record and published teaching material, not
forum consensus. Good sources: Greg Nuckols (Stronger By Science), Mike
Israetel and the RP team, Jeff Nippard's technique content, Alan Thrall and
Austin Baraki (Barbell Medicine) for barbell lifts, Chris Beardsley for
biomechanics, Eric Helms, Menno Henselmans, Jeff Cavaliere for shoulder-safe
variations. Reddit is acceptable only as a pointer to one of those, not as a
source itself.

Where coaches disagree, say so briefly rather than picking one.

## Format

For each exercise, produce:

- **Setup** — 1–2 lines: position, grip, bracing. The thing to check before the
  first rep.
- **Execution** — 2–3 lines: the movement pattern and the one or two cues that
  matter most.
- **Common faults** — 1–2 lines: what goes wrong and how to notice it.
- **Shoulder note** — only where relevant: a line on positioning for someone
  with anterior shoulder instability. Which variations are safer, what to
  avoid.

Each line ≤ 20 words. Plain, direct, no hype. Written to be read on a phone
between sets.

## Exercises

<<< PASTE YOUR LOGGED EXERCISE LIST HERE >>>

Plus, if not already in the list: barbell bench, incline barbell bench, back
squat, front squat, deadlift, Romanian deadlift, overhead press, pull-up,
chin-up, barbell row, hip thrust, leg press, hack squat, lat pulldown, seated
cable row, dumbbell lateral raise, face pull, Nordic curl, leg curl, leg
extension, standing calf raise.

## Deliverable

A JSON array, one object per exercise:

```json
{
  "name": "Incline machine chest press",
  "setup": "...",
  "execution": "...",
  "faults": "...",
  "shoulder": "..." ,
  "sources": ["Nuckols", "Israetel"]
}
```

Omit `shoulder` where it doesn't apply. Keep `sources` to the coach names
drawn from. No URLs needed — this is for attribution in the app's info sheet,
not a bibliography.
