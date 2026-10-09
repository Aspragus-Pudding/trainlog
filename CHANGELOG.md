# Changelog

Newest first. Every `APP_VERSION` bump adds an entry: 3–5 plain lines on what
you'd notice using the app. The top entry is copied into `index.html`
(`<script type="application/json" id="whats-new">`) and shown once on the
dashboard after an update. `tests/prescription-invariants.js` fails if that copy,
this file's top entry and `APP_VERSION` disagree.

## 1.65.0 — 2026-10-09
- A cleaner look, with a light mode that follows your phone. Theme codes still work.
- New setup for new users: Build it for me or Build it together, with a preview of the whole plan before anything is saved.
- Every screen uses the same few text sizes and spacings, and every button is big enough to tap easily.
- Lifts → How this works is a searchable guide: what to do when your shoulder hurts, you missed a week, or you want to push harder, plus every setting.
- Edit program shows blocks as cards and your week as a strip; a condition's card has a focused-deload button.

## 1.64.0 — 2026-10-08
- New setup: Build it for me, Build it together, or Restore from a backup. Eight short questions, each skippable.
- Build it together lets you choose the split, an exercise for each slot, rep ranges and block lengths, with a suggestion at every step.
- A preview shows the whole program with a reason for each part. Nothing is saved until Start first session.
- No starting weights are asked. After your first session the app offers to save a backup.

## 1.63.0 — 2026-10-08
- The look is now one design system (docs/design.md): five text sizes, one set of spacings and colours, and every button at least 44 px tall to tap.
- Light mode: the app follows your phone's light or dark setting. Theme codes still override it.
- The status dots use four fixed colours, from no change to lighter.
- On the redesign branch; it ships together with the new setup and the screen pass.

## 1.62.0 — 2026-10-08
- Plain language: statuses now say what they do ("Shoulder: pressing, pulling and raises held at last time's load") with a small coloured dot, instead of Green, Yellow, Orange or Red.
- The readiness card shows today's plan's top line. Tap it for each check-in answer and what it does, sore muscles and joints with the exercises they touch, and the readiness score.
- One name for each idea: RPE is now "effort", e1RM "estimated max", MEV/MRV "typical weekly sets". Dotted words can be tapped for a definition.
- The dashboard's phases are now called blocks, the same word Edit program uses.

## 1.61.0 — 2026-10-08
- New: Today's plan. After the check-in, one screen says what the app is doing to today's workout and why: what's held back, what steps up, what changed, and what's on plan.
- Each exercise in it opens every step behind its numbers. Tap Start to begin.
- It stays on the dashboard for the rest of the day.
- It only explains. Nothing in it changes your workout that wasn't already changed.

## 1.60.3 — 2026-10-08
- The Lifts tab now shows your own main lifts only. Before, it always added two lifts that were the maintainer's picks.
- In Progress → Notes, the copy button is now "Copy all notes".
- New for testers: a short README covering how to install, your first session, how to send notes and what updates do.

## 1.60.2 — 2026-10-08
- Every machine in the library is now marked plate-loaded or selectorised (pin and stack). Some of these are best guesses; tell us if yours is the other kind.
- The plate-loaded ones, such as the incline machine chest press, seated calf raise and chest-supported row, now show the plate calculator and the sled-weight option on their set card.
- Suggested weights don't change.

## 1.60.1 — 2026-10-08
- During a workout, logged pull-ups, chin-ups and dips now say what was on the machine: "60 lb assist", "+20 lb" or "bodyweight".
- The "Last time" line and "Last logged" on the info sheet read the same way.
- "Last time" compares on what you actually lift, so less assistance today shows as an up arrow.

## 1.60.0 — 2026-10-08
- A card on the Progress tab reminds you to back up when your last backup, whether a saved file or your backup sheet, is over a week old. "Not now" puts it off until it's due again.
- The reminder after a session follows the same rule, so the two never disagree. It used to count only sessions since your last saved file.
- Restore from backup now checks the file is a Trainlog backup before merging anything. It reports any lines it couldn't read, and your log is untouched if the file is wrong.
- Saving and restoring a backup file work without Google. The sheet stays optional.

## 1.59.1 — 2026-10-08
- Fix: past sessions showed pull-ups, chin-ups and dips as a bare number, such as "60 lb" for 60 lb of assistance.
- They now read "60 lb assist", "+20 lb" or "bodyweight", matching the set card.
- The estimated max next to each of those sets is now worked out on what you actually lifted.

## 1.59.0 — 2026-10-08
- The text slides are gone. New users get short hints during their first session, each pointing at the thing it describes, shown once and then gone.
- Hints never cover Log set or the weight, reps and RPE controls. Tapping anywhere outside a hint closes it, and the tap still goes through. No hint appears while the rest timer is running.
- A "?" at the top of each screen, and in Edit program, walks you through everything on that screen. Skip or Escape always closes it.
- Lifts → How this works lists the tours, replays the first-session hints, and has the whole guide written out in one place.

## 1.58.0 — 2026-10-07
- New "Don't care about" in setup and Edit program, for muscles and for movements.
- Muscles you don't care about are picked last. They still appear when nothing else fits the slot, and the preview says so.
- Movements you don't care about give their accessory slots to another movement that trains the same muscles (pull-downs → a row that still hits your lats). Main lifts never move, and no muscle drops under its typical weekly range because of it.
- The workout preview shows each change with a "your preference" chip and a one-tap Undo. Workouts you built or saved yourself are never changed, and neither are the suggested weights.

## 1.57.1 — 2026-10-07
- Fix: the workout preview showed pull-ups, chin-ups and dips as the total load moved instead of the number you type. It now shows "100 lb assist", "+20 lb" or "bodyweight", matching the set card.
- Fix: assisted movements no longer get a percentage warm-up ramp, which would have meant less assistance (a harder set) on a warm-up.
- Session-length estimates use the same corrected numbers.

## 1.57.0 — 2026-10-07
- The first time a Smith machine exercise comes up, the app asks what its bar weighs (15, 20, 25 lb, or counterbalanced ≈ 0) and remembers it for that exercise. You can change it on the info sheet.
- Plate-loaded machines can have their empty sled or arm weight set on the info sheet. The set card then shows plates + sled as a rough total. You still log the plates, so your history doesn't change.
- In kg, a standard bar is shown as 20 kg.

## 1.56.0 — 2026-10-07
- Pull-ups, chin-ups, dips, push-ups, inverted rows and pistol squats are now tracked on what you actually lift: bodyweight plus added weight, minus assistance. Type what's on the machine, and the card shows the rest ("60 assist → lifting 122 lb").
- New assisted chin-up and dip, and band-assisted pull-up, chin-up and dip (reps only). Assisted, bodyweight and weighted sets of the same movement are one history and one goal.
- If your bodyweight changes, the suggested assistance or added weight moves to keep the same load. If your last bodyweight is over a week old, the card asks for it (you can skip).
- At zero assistance the app proposes the unassisted version, and if you fall short at bodyweight it offers the assisted one. It never switches on its own.
- Goals for these show load, % of bodyweight and the next milestone. A weight cut is labelled "lighter you, same strength", not as getting stronger.

## 1.55.1 — 2026-10-07
- For outer-elbow tendinopathy, loaded carries (farmer, kettlebell, trap bar, suitcase) are now red instead of amber.
- Dead hangs stay amber. They're an isometric hold, which that condition's pain rule allows below 7/10, and light carries are fine under the same cap.
- General "elbow pain" is unchanged: carries stay amber there.

## 1.55.0 — 2026-10-07
- The exercise library grew from 121 to 219 exercises. It adds Smith machine, kettlebell, band, specialty-bar (EZ, trap bar, safety squat bar) and more cable and machine versions, each with the same warnings and cues as the movement it's based on.
- Search by equipment: type "smith", "cable", "kb" or "band". Each exercise shows what you hold.
- When the app builds a workout, what you've actually been doing now outranks your equipment answer. If you've logged Smith bench ten times, you get Smith bench.
- New "Straps" option under Modify on pulls and shrugs. For outer-elbow pain, a strapped shrug isn't flagged red, and dead hangs are amber, not red.
- If one of your own exercises matches a new built-in by name, its info sheet offers to move your history to the built-in. Nothing happens unless you tap it.

## 1.54.0 — 2026-10-07
- Back squat has a new "Bar position" option (high or low bar) under Modify. Like other modifiers, low-bar squats get their own history and suggestions.
- With anterior shoulder instability picked, marking a squat as low bar shows the amber warning, with high bar as the suggested swap. An unmarked back squat stays unflagged.
- The option only appears on barbell squats. The Transformer bar positions are already separate exercises.

## 1.53.0 — 2026-10-07
- After a load step, the suggested reps are now worked out from your last set instead of dropping to the bottom of the range. 60 × 15 used to become 70 × 8; now it becomes 70 × 12.
- If one step would put you below your rep range, the app says the jump is too big and holds the load. It suggests a smaller step (on the info sheet) or a lower range instead.
- Progress → Suggestions has a new line: reps within 2 of suggested. Matching the load alone hid how far off the reps were.

Measured on the maintainer's real log (158 sets, 13 Sep – 7 Oct), comparing what the app would have suggested with what was actually lifted. Lower is better:

| Average miss | Before (1.52) | After (1.53) |
|---|---|---|
| Load | 4.0 lb | 4.0 lb |
| Reps | 3.1 | 2.0 |
| Reps, first set of an exercise | 3.3 | 2.5 |
| Reps, later sets | 3.1 | 1.8 |
| Reps, machines | 3.6 | 2.2 |
| Estimated max | 9.8% | 8.3% |

## 1.52.0 — 2026-10-07
- With anterior shoulder instability picked, three new amber warnings: low-bar squat (suggested swap: high-bar or the safety squat bar), pull-ups (swap: neutral grip) and incline dumbbell press (keep the elbows tucked and stop short of a deep stretch).
- Setting a neutral or close grip on pull-ups clears that warning.
- Face pulls get no warning. They're a standard exercise for this condition.
- None of these is red, and they're only warnings. Nothing is removed from your program unless you choose it.

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
