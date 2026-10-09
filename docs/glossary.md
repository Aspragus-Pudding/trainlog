# Glossary

One name for each idea in the app, what it means in plain words, and the
label the app uses for it. When a screen uses one of these words, it uses the
label below, and a dotted underline means you can tap it for the definition.

The app reads this file: each `##` is an entry. Keep the three lines under it
(`In the app`, `Also called`, `Means`). After editing, run
`node tools/embed-guide.js`, which copies this file into the app along with
the guide.

## RPE
- In the app: RPE
- Also called: effort, rate of perceived exertion
- Means: How hard a set was, from 1 to 10. 10 means you couldn't have done another rep; 9 means one more was left; 8 means two; 7 means three. Each set has a target RPE, and the next set is adjusted from the RPE you log.

## Reps in reserve
- In the app: reps in reserve
- Also called: RIR
- Means: How many more reps you could have done before failing. It's the other side of RPE: RPE 8 is about 2 reps in reserve.

## Estimated max
- In the app: estimated max
- Also called: e1RM, estimated one-rep max
- Means: The most you could probably lift once, worked out from a set's weight, reps and effort. It's an estimate for picking working weights, not a test result.

## Max
- In the app: max
- Also called: 1RM, one-rep max
- Means: The heaviest weight you can lift for one rep with good form.

## Percent-of-max chart
- In the app: the percent-of-max chart
- Also called: %1RM chart, RPE chart
- Means: The table the app uses to turn reps and effort into a share of your max, so it can price a weight for a different rep count. It covers sets up to about 16 reps from failure.

## Training max
- In the app: training max
- Also called: TM
- Means: A working number a little under your estimated max (90% to start) that strength blocks set their percentages from. The all-out test set at the end of a strength block updates it, by at most 5% at a time.

## Top set
- In the app: top set
- Also called: heavy single set
- Means: The one heaviest working set of an exercise in a session, done first. Lighter back-off sets follow it.

## Back-off sets
- In the app: back-off sets
- Also called: back-offs, down sets
- Means: Lighter sets after a top set, for more practice and volume without the strain of repeating the heavy set.

## All-out set
- In the app: all-out set
- Also called: AMRAP (as many reps as possible), calibration set, test set
- Means: One set taken to as many good reps as you can do. It shows the app how your effort ratings line up with reps actually left. In the last week of a strength block, the main lift's all-out set is the test set that updates your training max.

## Deload
- In the app: deload
- Also called: recovery week
- Means: A lighter week, with fewer sets and easier loads, so fatigue can drop before training picks up again. The app suggests one when the signs show; it never starts one on its own.

## Focused deload
- In the app: focused deload
- Also called: exercise deload
- Means: A deload for a few exercises only, usually the ones a sore joint doesn't like, while the rest of the program carries on. It holds them at a lighter load for a few sessions, then the app proposes the ramp back.

## Total load
- In the app: total load
- Also called: system load
- Means: For pull-ups, chin-ups, dips, push-ups and similar: what you actually move. Your bodyweight plus any added weight, minus any assistance. The app prices these exercises on total load and converts back to the number you type.

## Readiness
- In the app: readiness
- Also called: readiness score
- Means: How ready you are to train today, from your check-in. Sleep, motivation and rest of life decide whether anything steps up today: a 2 on any of them means no step-ups, a 1 means a sick day. Soreness only touches the exercises that use the sore muscle. The overall score, out of 100, only sets how long your warm-up is.

## Your usual
- In the app: your usual
- Also called: joint baseline
- Means: How a joint normally feels for you, so a joint that always aches a little isn't treated as a flare-up. You can set it in Edit program; otherwise the app uses your recent ratings. Ratings at your usual only lengthen the warm-up.

## Flared joint
- In the app: flared
- Also called: joint ladder
- Means: A joint rated above your usual. The work that loads it changes in steps the more it flares: first a longer warm-up, then loads held at last time's weight, then 10% lighter with one set fewer, then no progression at all until it settles. Everything else carries on as planned.

## Sick day
- In the app: sick day
- Also called: none
- Means: A 1 for sleep, motivation or rest of life on the check-in. Everything is one step lighter, today only.

## Step-up
- In the app: step-up
- Also called: progression
- Means: Adding weight or a rep compared with last time, because the last set came in easier than its target.

## Smallest jump
- In the app: smallest jump
- Also called: increment
- Means: The smallest amount of weight you can add on an exercise, set by your plates or the machine's stack. You can change it on the exercise's info sheet.

## How hard suggestions push
- In the app: how hard suggestions push
- Also called: the dial
- Means: A setting that nudges suggestions by one step: a little more aggressive or a little more cautious. It can be set for everything or for one exercise. If you keep lifting heavier or lighter than suggested, the app moves it one notch and says so.

## Settling in
- In the app: settling in
- Also called: calibrating
- Means: The first session after you change the program, a block or your profile. Nothing steps up in load that session, while the new plan finds its footing.

## Fitted to your rep range
- In the app: fitted to your rep range
- Also called: range fit
- Means: When your last set's reps landed outside the exercise's rep range, the weight is re-worked out so the reps come back inside it.

## Block
- In the app: block
- Also called: phase, mesocycle
- Means: A run of weeks with one training goal: size (hypertrophy), strength, or a deload. A program is a list of blocks in order. In the app, "phase" means a step of a rehab phase plan, not a block.

## Hypertrophy
- In the app: hypertrophy
- Also called: size block, muscle growth
- Means: Training aimed at building muscle size: moderate weights for more reps, taken close to failure. A hypertrophy block is one of the block types.

## Taper
- In the app: taper
- Also called: peak
- Means: The lighter end of a strength block before a test or target date, so you arrive fresh.

## Typical weekly sets
- In the app: typical weekly sets
- Also called: MEV and MRV, volume landmarks
- Means: The range of hard sets per muscle per week that a program usually stays inside. The low end is roughly the least that tends to build muscle, the high end a common ceiling. These are starting points, not measured limits for you.

## Hard set
- In the app: hard set
- Also called: working set
- Means: A set that counts toward your weekly volume. Warm-up and prep sets never count.

## Fast progression
- In the app: fast progression
- Also called: linear progression
- Means: A main lift that adds a step every session while it keeps hitting its target. Two misses in a row move it to standard progression.

## Standard progression
- In the app: standard progression
- Also called: double progression
- Means: Reps climb to the top of the range first, then the weight goes up and the reps start again from the bottom.

## Stall
- In the app: stall
- Also called: plateau
- Means: A main lift with no new best for a few weeks while you're training it every week. The app first checks the simple causes: not training it often, eating too little, tiredness.

## Stall fix
- In the app: stall fix
- Also called: intervention
- Means: A change the app proposes for a stalled lift, such as more practice sets or a lighter reset. It only starts when you accept, unless you've turned on starting them automatically, and there is always an undo.

## Strength upkeep
- In the app: strength upkeep
- Also called: maintenance top set
- Means: One heavy set a week on each main lift during a size block, so strength doesn't fade while the focus is on size.

## Effort ramp
- In the app: effort ramp
- Also called: RIR progression
- Means: In newer size blocks, the target RPE rises week by week: compound lifts from 7 to 9, isolation exercises from 7 to 10.

## Warm-up
- In the app: warm-up
- Also called: ramp
- Means: Lighter sets on the way up to your working weight. They never count toward volume. A lower readiness score or a flared joint makes the warm-up longer.

## Prep
- In the app: prep
- Also called: activation, mobility
- Means: Short movements before the session for the joints and muscles you're about to train, or for a sore spot. They never count toward volume.

## Phase plan
- In the app: phase plan
- Also called: rehab plan
- Means: An optional step-by-step plan for a condition you've picked. A card proposes the next phase when you meet its checks; it never moves on by itself.

## Status dots
- In the app: the small coloured dot before a status line
- Also called: bands (green, yellow, orange, red)
- Means: The dot's colour shows how much a status changes training. Green: no change. Yellow: careful, so a longer warm-up or no step-ups. Orange: held, so loads stay where they were. Red: lighter, so a cut, a sick day or a deload suggested. The sentence next to it always says what it does.
