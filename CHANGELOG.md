# Changelog

Newest first. Every `APP_VERSION` bump adds an entry: 3–5 plain lines on what
you'd notice using the app. The top entry is copied into `index.html`
(`<script type="application/json" id="whats-new">`) and shown once on the
dashboard after an update. `tests/prescription-invariants.js` fails if that copy,
this file's top entry and `APP_VERSION` disagree.

## 1.51.0 — 2026-10-07
- Set the smallest jump for any exercise from its info sheet (2.5–25 lb). The app suggests loads in those steps from then on.
- The default is the equipment's own step: the machine's stack step, dumbbells 5 lb, and a barbell whatever your plates allow (5 lb with 2.5 lb plates).
- Reset returns to the library value. Past sets don't change.

## 1.50.0 — 2026-10-07
- "Your usual" for a joint is now set on its condition card in Edit program, next to the condition it belongs to.
- Each condition you picked now has its own card at the top of the list: what it is, the red-flag checks, the phase plan and your usual.
- If you rate a joint that has no condition picked, its usual is listed separately under "Joints without a condition".

## 1.49.1 — 2026-10-07
- The dashboard no longer shows an all-joints comfort average. It could read 98 next to a shoulder rated Red.
- Joints now lead with the worst one, for example "Shoulder: Red, load held", and list the others under it.
- Wording tidy-up on the readiness and fatigue lines.

## 1.49.0 — 2026-10-07
- Cuts no longer add up. If you're run down, sore and a joint is flagged on the same day, an exercise gets the largest single cut, not all of them. "Why these numbers" shows which one applied.
- A small overshoot on a machine with big jumps no longer drops a whole step. If one step down is 7% of the load or more, the load holds and you aim one rep fewer, never below your range. A load cut needs RPE 1.5 over target or a missed rep.
- The dashboard bands now match what the app does. Readiness uses sleep, motivation and rest of life only, the same inputs as the suggestions. Joints are compared with your usual. Fatigue has a band too. Each line says what the app is doing about it.
- Progress → Suggestions charts how often you landed on target, next to how often you lifted as suggested.
- When the dial has moved from your setting because of what you've been lifting, the explanation says so every time.

## 1.48.0 — 2026-10-07
- Every suggested number can now explain itself step by step: "Why these numbers" on Progress, and in the explanation under each exercise.
- Low sleep, motivation or rest of life no longer cut your loads. A 2 only stops a step up. A 1 is a sick day: one step lighter, today only.
- New: focused deload. Ease one exercise (hold, −10% or −20%) for 1–3 weeks from its info sheet. The app suggests the ramp back, and never does it on its own.
- New: the dial. Tell the app how hard to push, overall in Edit program or per exercise on its info sheet.
- The first session after you change your program doesn't add load while it recalibrates.

## 1.47.0 — 2026-10-07
- Suggestions now land inside your rep range after you change it.
- Moving an exercise mid-workout no longer pulls the Log Set panel onto it.
- Sore legs no longer cut your chest and arm work. Soreness only affects the exercises for the muscles that are sore.
- Short explanations of each set type (myo-reps, rest-pause and so on), and how-to notes for every rehab exercise.

## 1.46.0 — 2026-10-07
- A short consent screen before you pick an injury or condition.
- Rate pain during a set (0–10). The app advises — keep going, swap, or stop — but never locks you out.
- Optional phase plans for a condition. The app proposes the next phase and never moves on by itself.
- "See a professional" red-flag checks per condition, and a button that deletes your conditions and pain ratings.

## 1.45.0 — 2026-10-07
- New exercises: DB and cable fly, pec deck, behind-the-neck press and pulldown, straight-arm pulldown, snatch, power clean, kettlebell swing, jumps, pogo hops and jump rope.
- They're never added to your program automatically, and you can always add them by hand.
- Injury and condition warnings now cover them.

## 1.44.0 — 2026-10-07
- New injury and condition library. Pick a broad area or a specific condition, and exercises that load it get a warning, never a block.
- You choose which flagged exercises to leave out of your program. The app doesn't decide for you.
- After a workout, a quick question about joint pain on the relevant exercises. Over time the app learns which flagged exercises are fine for you.
