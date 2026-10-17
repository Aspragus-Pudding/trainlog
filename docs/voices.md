# Voices

Some theme codes come with their own voice. A voice only replaces the app's
motivational and celebratory lines, at nine moments:

- `checkin`: the greeting at the top of the check-in.
- `start`: when a session starts.
- `set`: a set logged. `{n}` is the set number.
- `pr`: a new best. `{ex}` is the exercise and `{gain}` how much higher.
- `rest`: the rest timer ending.
- `finish`: a session saved.
- `streak`: weeks in a row with a session. `{weeks}` is how many.
- `empty`: a screen with nothing on it yet.
- `whatsnew`: the title of the "What's new" card. `{v}` is the version.

Nothing else is ever voiced. Pain and joint prompts, red flags, anything about
injuries and conditions, disclaimers and consent, the focused-deload and
sick-day explanations, the "why" lines on numbers, errors, and anything about
your data or backups always stay in the plain default voice. A test fails if a
voice line touches any of them.

To add a voice: a `## CODE` section with the theme's code, then a `### moment`
heading for each moment and one line per variant (aim for 5 to 10, so it
doesn't repeat every session). Then run `node tools/embed-guide.js`. In the app,
Settings → Voice has "Use this theme's voice", on by default.

## GOBLIN

### checkin
- Back from the surface. How are the bones?
- The candles are lit. Tell the goblin how you slept.
- Sniff, sniff. Ready for the pit?
- Another day in the burrow. How's the body holding up?
- The hoard awaits. First, the counting of bones.
- Grr. Morning. How rested is the goblin today?
- Crawl in, sit down, report your condition.

### start
- Into the pit.
- The dungeon is open. Go take what's yours.
- Lights low, iron heavy. Begin.
- Hoarding season starts now.
- Down the tunnel you go.
- The iron has been waiting. Go.
- Torch lit. Time to dig.

### set
- Set {n} hoarded.
- Set {n} dragged back to the burrow.
- Set {n} stashed with the rest of the loot.
- Set {n}. The pile grows.
- Set {n} gnawed clean.
- Set {n} added to the hoard.
- Set {n}. Grr.

### pr
- New hoard record on {ex} · {gain}
- {ex}: biggest loot yet · {gain}
- The hoard has never been this heavy. {ex} · {gain}
- {ex} record clawed out of the dark · {gain}
- New treasure: {ex} · {gain}
- {ex} · {gain}. The other goblins will hear of this.
- A shinier record on {ex} · {gain}

### rest
- Rest over. Back to the pit.
- Enough lurking. Next set.
- The candle has burned down a notch. Go.
- Up from the corner. The iron calls.
- Rest done. Back to the digging.
- Break's over, goblin.
- Shake off the dust. Next set.

### finish
- Loot stashed.
- Session hoarded. Back to the burrow.
- The dungeon is cleared for today.
- All loot counted and stored.
- Done. The hoard is bigger than this morning.
- Session stashed under the floorboards.
- Back to the dark to grow stronger.

### streak
- {weeks} weeks in a row in the pit.
- {weeks} weeks of steady hoarding.
- The burrow has seen you {weeks} weeks running.
- {weeks} weeks without missing a raid.
- {weeks} weeks in a row. The hoard approves.
- Unbroken for {weeks} weeks.

### empty
- Nothing in the hoard yet.
- The cave is empty. For now.
- No loot here yet. Go get some.
- Just dust and echoes so far.
- An empty corner of the burrow.
- Nothing stashed here yet.

### whatsnew
- New scrawls on the wall · {v}
- The goblins changed things · {v}
- Fresh from the forge · {v}
- What the goblins built · {v}
- New in the burrow · {v}
- Tunnel works complete · {v}

## TERMINAL

### checkin
- > STATUS REQUEST. REPORT SLEEP, MOTIVATION, BODY.
- > SYSTEM CHECK BEFORE RUN.
- > LOAD USER.DAT... READY FOR INPUT.
- > HELLO, OPERATOR. HOW ARE THE SYSTEMS?
- > DIAGNOSTICS FIRST. ENTER VALUES.
- > BOOT COMPLETE. AWAITING CHECK-IN.
- > PRE-FLIGHT. ANSWER THE PROMPTS.

### start
- > RUN WORKOUT.EXE
- > SESSION STARTED. GOOD LUCK, OPERATOR.
- > EXECUTING PROGRAM...
- > LOAD "TRAINING",8,1
- > READY. RUN.
- > PROGRAM LOADED. BEGIN.
- > INITIALISING IRON SUBROUTINE...

### set
- > SET {n} WRITTEN TO DISK.
- > SET {n} OK.
- > SET {n} SAVED.
- > SET {n} COMPLETE.
- > SET {n} ACCEPTED.
- > APPEND SET {n}... DONE.
- > SET {n} LOGGED. READY.

### pr
- > NEW HIGH SCORE: {ex} · {gain}
- > RECORD BROKEN: {ex} · {gain}
- > {ex}: BEST EVER · {gain}
- > HIGH SCORE TABLE UPDATED. {ex} · {gain}
- > NEW PERSONAL BEST DETECTED. {ex} · {gain}
- > {ex} · {gain}. ENTER YOUR INITIALS.
- > ACHIEVEMENT UNLOCKED: {ex} · {gain}

### rest
- > TIMER EXPIRED. RESUME.
- > REST COMPLETE. PRESS ANY KEY.
- > COOLDOWN FINISHED.
- > READY.
- > NEXT SET QUEUED.
- > INTERRUPT: REST OVER.
- > CONTINUE? Y

### finish
- > SESSION SAVED. SYSTEM HALTED.
- > PROGRAM ENDED NORMALLY.
- > WORKOUT.EXE EXITED WITH CODE 0.
- > SAVED. GOOD NIGHT, OPERATOR.
- > END OF RUN.
- > SHUTDOWN COMPLETE.
- > SESSION CLOSED.

### streak
- > {weeks} CONSECUTIVE WEEKS. UPTIME GOOD.
- > STREAK: {weeks} WEEKS.
- > {weeks} WEEKS WITHOUT A CRASH.
- > CONTINUOUS OPERATION: {weeks} WEEKS.
- > {weeks} WEEK RUN. STABLE.
- > UPTIME {weeks} WEEKS AND COUNTING.

### empty
- > NO RECORDS FOUND.
- > DIRECTORY EMPTY.
- > 0 FILES.
- > NOTHING HERE YET. READY.
- > EOF.
- > NOTHING TO DISPLAY.

### whatsnew
- > PATCH NOTES {v}
- > UPDATE {v} INSTALLED.
- > README.TXT · {v}
- > NEW IN VERSION {v}
- > CHANGELOG {v}
- > FIRMWARE {v} LOADED.

## GIRLYPOP

### checkin
- Hi gorgeous. How are we feeling today?
- Quick vibe check before we lift.
- Morning, superstar. How did you sleep?
- Let's check in with that beautiful body.
- How's my favourite lifter doing?
- Tell me everything. How are you, babe?
- Vibe check, then we slay.

### start
- Let's get it, queen.
- Main character energy, activated.
- Time to slay.
- Your era starts now.
- Hot girl lift, in progress.
- Okay, let's do the thing.
- Serving strength today.

### set
- Set {n}, done and dusted.
- Set {n}. Obsessed.
- Set {n} served.
- Set {n}. That was cute.
- Set {n}, ate that.
- Set {n} in the bag.
- Set {n}. Iconic.

### pr
- New best on {ex} · {gain}. You ate.
- {ex} personal best · {gain}. Iconic behaviour.
- {ex} · {gain}. We love a glow-up.
- Brand new best on {ex} · {gain}. Obsessed.
- {ex} · {gain}. She's stronger than ever.
- {ex} PR · {gain}. Put it on the vision board.
- {ex} · {gain}. That's the one.

### rest
- Break's over, babe.
- Rest done. Back to slaying.
- Okay, hydrated? Next set.
- Pause over. Let's go again.
- Time for your next moment.
- Rest done, main character.
- Back to it, gorgeous.

### finish
- Session saved. You did that.
- Workout served.
- That's a wrap, superstar.
- Done and done. So proud.
- Session saved. Go get a treat.
- Another one for the highlight reel.
- Saved. Glowing, honestly.

### streak
- {weeks} weeks in a row. Consistency queen.
- {weeks} weeks straight. We love a routine.
- {weeks} weeks of showing up for yourself.
- {weeks} weeks running. The dedication.
- {weeks} weeks in a row. Obsessed with you.
- {weeks} weeks strong.

### empty
- Nothing here yet, but it's giving potential.
- A blank page. Your era starts here.
- Empty for now. Go make it cute.
- Nothing yet. Soon though.
- Clean slate, babe.
- Nothing to see yet.

### whatsnew
- Fresh updates · {v}
- A little glow-up · {v}
- What's new and cute · {v}
- New drop · {v}
- Freshly updated · {v}
- The latest · {v}
