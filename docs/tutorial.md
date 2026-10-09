# How Trainlog works

Trainlog builds your program, suggests the weight and reps for every set, and adjusts as you log. Every number it suggests can explain itself, and nothing it proposes happens until you accept it. Your log stays on your phone.

This guide is also the app's tour. Each heading below is one step, and the "?" at the top of each screen walks you through that screen's part of it.

## Your first session {tier:1}

### Start your first session `[data-tour="start"]`
Your first session is ready to go whenever you are at the gym. The app keeps your place in the program by sessions rather than by days, so a missed day never skips a workout.

### The check-in `[data-tour="checkin"]`
Before each workout the check-in asks how you slept, how you feel and how sore you are. Three means normal, and only low answers change anything, mostly by lightening the work for the muscles that are sore.

### An exercise `#v-work .ex` {when:session}
Each exercise is a card. Open it to see the suggested weight and reps for your first set, worked out from your history and today's check-in.

### Weight and reps `[data-tour="weight"]`
The amber numbers are suggestions, and you can change either one before logging. Change the weight and the reps recompute to hit the target effort, or the other way round, and whatever you set turns white.

### How hard it was `[data-tour="rpe"]`
Effort is how hard the set was: ten means nothing left, nine means one rep left, and eight means about two. The next set is priced from what you enter here, so an honest number works better than an ambitious one.

### Why this number `[data-tour="why"]`
This line says why the numbers are what they are. Tap it to see every step behind the suggestion, from your last set to today's check-in.

### Finish `[data-tour="finish"]`
When you are done, finish the session here. It asks a couple of optional questions about how it went and saves everything to your log.

### Progress `nav [data-tab="hist"]` {after:first-session}
The Progress tab is where your lifts' trends, the reasons behind each suggestion and how well the suggestions fit you build up over your next few sessions.

## Dashboard {tab:dash}

### Your target date `[data-tour="dash-hero"]`
The top card counts down to your target date, projected from how often you actually train rather than from the calendar. Miss sessions and the date moves out; train more often and it comes closer. The bars underneath are your blocks in order.

### Today's plan `[data-tour="briefing"]`
After your check-in, Today's plan says what the app is doing to the workout and why: what it is holding back, what it is pushing, and what changed. Tap it to see it again, and tap any exercise in it for every step behind its numbers.

### Proposals `[data-tour="proposals"]`
Cards here are proposals, such as a deload week, a change for a lift that has stalled, or switching between the assisted and unassisted version of an exercise. Nothing changes until you accept one, and declining hides the card for a while.

### Start training `[data-tour="start"]`
Start training opens today's workout. The app picks the day from your rotation, not from the weekday, so the program carries on from wherever you left it.

### Readiness `[data-tour="dash-bands"]`
The readiness card leads with what today's check-in does to the workout, then one line for each joint and for fatigue: a small coloured dot and what it changes. Tap the card for each check-in answer and what it does, and for the readiness score, which only sets how long your warm-up is.

### Volume this week `[data-tour="dash-volume"]`
Volume counts hard sets per muscle this week, with half credit for muscles an exercise trains indirectly. The ticks mark the typical weekly sets for each muscle, and those numbers are judgement defaults rather than measured limits.

### Your blocks `[data-tour="dash-phases"]`
Your blocks lists the blocks of your program in order, with the one you are in highlighted. Their dates are worked out from your sessions, so they shift if you train more or less often than planned.

### Recent bests `[data-tour="dash-bests"]`
Recent bests shows the best estimated max for each lift you have logged. It is an estimate from your sets, and it is more reliable from heavy sets of a few reps than from long ones.

### Edit program `[data-tour="edit-program"]`
Edit program is where you change your blocks, goals, schedule, conditions and preferences. After a program change the next session is a settling-in session, with no step up in load.

## Workout {tab:work}

### Each exercise `#v-work .ex`
Each exercise is a card, and tapping it opens the set panel. The order is a suggestion, and the card's controls let you move, swap or add exercises without changing your program.

### Weight and reps `[data-tour="weight"]`
The weight and reps are suggested in amber. Change either one and the other recomputes to hit the target effort. For pull-ups, chin-ups, dips and assisted machines you type what is on the machine, and the line underneath shows what you are actually lifting.

### Effort `[data-tour="rpe"]`
Effort records how hard the set was: ten means nothing left, nine one rep left, and eight about two. The next suggestion is built from it, so be honest rather than ambitious.

### Why these numbers `[data-tour="why"]`
The line under the numbers says why they are what they are. Tap it to see each step: your last set, readiness, a sore muscle, a joint, a focused deload, how hard suggestions push, and the guards that stop a single session from jumping too far.

### Log set `[data-tour="logset"]`
Log set saves the set and starts the rest timer. During the session you can tap a logged set to edit or delete it, and the change is recorded as a correction rather than by rewriting the original.

### Set types `[data-tour="technique"]`
Set types change how a set is done and logged: straight sets, myo-reps, rest-pause, drop sets and all-out sets. Tap a type to read what it means before you use it.

### Modify `[data-tour="modify"]`
Modify records how you did the exercise, such as a pause, a tempo, a shorter range, a grip, straps or the bar position. A modified version keeps its own history, so it never distorts the normal one.

### The rest timer `#rest`
The rest timer runs after each set and lets you know when it is time to go again. It sits at the bottom of the screen, and the page leaves room so it never covers the Log set button.

### Finish session `[data-tour="finish"]`
Finish session saves the workout. It asks how your joints felt on the exercises that matter for them and lets you add a diary note, and both are optional.

### Leave a note `#noteBtn`
The pencil at the top sends a note to whoever gave you the app, from any screen. Use it for anything that looks wrong or confusing, and it records which screen you were on.

## Lifts {tab:lifts}

### Your main lifts `#v-lifts .card`
Your main lifts each have a card with the estimated max, the typical weekly sets for the muscle they train, and how they progress. Every exercise also has an info sheet, opened from its workout card or the library, which holds its history, coaching cues, your setup notes, its smallest jump, any warnings and how hard suggestions push for that exercise.

### The library `[data-tour="library"]`
The library holds every built-in exercise, searchable by name, muscle or equipment, so typing smith, cable or band works. You can add your own exercise too, and if it is a version of a built-in one it inherits that exercise's cues and warnings.

### Your data `[data-tour="data"]`
Your data stays on this phone. This card shows how much is stored and which version of the app you are running.

### Save a backup `[data-tour="backup"]`
Save backup hands a copy of your whole log to the share sheet, so you can keep it in Files or anywhere else. Do it now and then, because browser storage can be cleared without warning.

### Restore `[data-tour="restore"]`
Restore from backup reads a backup file and merges it in event by event. Importing the same file twice changes nothing, and it never deletes anything newer.

### This guide `[data-tour="help"]`
How this works opens these tours again, along with this whole guide written out in one place.

## Progress {tab:hist}

### Your main lifts `[data-tour="goal-card"]`
Each main lift has a card with its estimated max over time, its recent best sets, and its training max during strength blocks. For pull-ups, chin-ups and dips it also shows the lift as a share of your bodyweight and the next milestone.

### Why these numbers `[data-tour="why-numbers"]`
Why these numbers lists, for your last session, every step that shaped each suggestion. If how hard suggestions push has moved a notch from your setting because of what you have been lifting, it says so here.

### How well the suggestions fit `[data-tour="accuracy"]`
Suggestions measures how well the app fits you: how often you lifted the suggested load, how often your reps landed within two, and how often the effort was on target. Going lighter on a bad day is fine, because this measures fit rather than obedience.

### Weekly volume `[data-tour="hist-volume"]`
Weekly volume shows your hard sets per week over the last twelve weeks, so you can see a block build up and a deload drop off.

### Readiness over time `[data-tour="hist-readiness"]`
Readiness plots your check-in's readiness score session by session. A run of falling scores is one of the signals behind a deload proposal.

### Joints over time `[data-tour="hist-joints"]`
Joints shows how each joint has felt over your recent sessions, compared with how it usually feels. The app uses the same ratings to hold or lighten the load on the movements that use a flared joint.

### Notes `[data-tour="notes"]`
Notes collects what you have sent with the pencil, and you can mark each one done once it has been dealt with.

### Sessions `[data-tour="sessions"]`
Sessions lists every workout you have logged. Tap one to see its sets, how long it took and any diary entries you wrote.

## Edit program {screen:settings}

### Your blocks `[data-tour="set-blocks"]`
Your blocks are the phases of the program in order. You can change a block's type, length, deload and focus muscles here, or rerun the program builder for a fresh plan.

### Energy balance `[data-tour="set-energy"]`
Energy balance tells the app whether you are eating to gain, maintain or lose weight. In a deficit it plans fewer sets, because recovery genuinely drops.

### How hard suggestions push `[data-tour="set-dial"]`
This setting nudges how hard suggestions push, one step either way. If your lifting keeps disagreeing with it at the right effort, it drifts a notch toward what you actually do and tells you on the Progress tab.

### What you're working around `[data-tour="set-conditions"]`
This is where you pick any injuries or conditions. Exercises that load them get a warning but are never blocked, and each condition's card holds its red-flag checks, an optional phase plan, and how that joint usually feels.

### Not included automatically `[data-tour="set-exclusions"]`
These are flagged exercises you have chosen to keep out of generated workouts. You can always add them yourself, and you can include them again here at any time.

### Don't care about `[data-tour="set-dep"]`
Don't care about lets you put muscles and movements last. Muscles you pick are chosen last, and movements give their accessory slots to another movement that trains the same muscles, without any muscle dropping under its typical weekly range.

### Automatic backup `[data-tour="set-backup"]`
Automatic backup sends your log to a Google Sheet after each session, if you were given a sheet address. Leave it blank and back up by hand from the Lifts tab instead.

### Setup link `[data-tour="set-setuplink"]`
Setup link is where you paste the link you were given, which connects your backup sheet and the feedback notes in one step.
