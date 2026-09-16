# Workflow — how to actually run this day to day

## The short version

| What | Where | Why |
|---|---|---|
| Bug fixes, small tweaks, adding exercises | **Claude Code** | Edits the file directly, pushes, auto-deploys. Cheap per change. |
| "Should the app do X?", training science, new features | **Chat with Claude** | Needs reasoning and evidence discussion, not just code edits. |
| Gym notes as they happen | **FEEDBACK.md** | Batch them. See below. |

## Capturing feedback in the gym

Don't use a separate notes app. The ✎ button in the bottom-right of Trainlog
opens a quick note from anywhere, including mid-session. Notes record what
screen you were on, which exercise, and which app version — which is most of
what makes a bug report actionable.

Notes are ordinary log events, so they sync to your backup sheet automatically
(a **Notes** tab) and survive backup/restore like everything else.

Then at your desk: **Progress tab → Copy all for Claude Code**. That produces a
formatted, grouped list of every open note with dates and versions, ending with
the instructions Claude Code needs. Paste it straight in. Mark notes **Done** as
they get fixed.

This replaces the FEEDBACK.md workflow for anything you notice while training —
keep that file for bigger thoughts you have away from the gym.

## Using Claude Code from your phone

Possible, with a real caveat. **Remote Control** (`claude remote-control` or
`/rc` in a session) shows a QR code that opens a synced session in the Claude
mobile app. It's available on all plans.

But it's a window into a live process on your machine, not a cloud service —
your laptop has to be awake with the session running, and there's roughly a
10-minute network timeout. It's built for stepping away mid-task, not for
picking something up hours later.

**So for the gym:** capture notes in the app, and run Claude Code when you're
back at your desk. That's less friction than keeping a laptop session alive, and
the note button already does the capture part better than a chat would.

Remote Control genuinely earns its keep for the other direction — kick off a
long refactor at your desk, approve a permission prompt from your phone while
you make coffee.

## Why not fix things daily

You're running a 3-month test. Changing the app every day works against that in
two ways:

**Some "bugs" resolve themselves.** A few of your reports turned out to be the
same underlying cause. Two more turned out to be things that only bite in a
specific sequence. A week of notes gives you and Claude Code the pattern; a
single note gives a symptom.

**Churn costs you training consistency.** Every update is a small disruption —
you check whether the fix worked instead of training. Once a week, all at once,
is less disruptive than five times.

**It's also cheaper.** One session that fixes six things costs far less than six
sessions that fix one thing each.

**Recommended rhythm:** jot notes in `FEEDBACK.md` on your phone or wherever is
easy. Once a week, sit down with Claude Code and work through the list. Exception:
anything that actually blocks you from logging a workout — fix that immediately.

## Setting up Claude Code (once)

**1. Install Node.js** — nodejs.org, LTS version.

**2. Install Claude Code:**
```
npm install -g @anthropic-ai/claude-code
```

**3. Clone your repo:**
```
git clone https://github.com/YOURNAME/trainlog.git
cd trainlog
```

**4. Start it:**
```
claude
```
Log in when prompted.

It automatically reads `CLAUDE.md` in the repo, so it starts every session
already knowing the architecture, the invariants, your shoulder situation, and
the gotchas that have caused real bugs. That file is the reason this works.

## Using it

From inside the `trainlog` folder, run `claude`, then talk normally:

```
Here's this week's feedback from FEEDBACK.md:
- rest timer beep is too quiet
- want the Progress tab to show tonnage per week
- lateral raise keeps getting picked over the machine version I prefer

Work through these, syntax-check index.html, bump APP_VERSION, then commit and push.
```

Key habits:
- **Always say "commit and push"** or the change sits on your laptop only.
- **Always say "bump APP_VERSION"** so you can confirm on the Lifts tab which
  build your phone is running.
- **Ask it to syntax-check** before committing — a syntax error ships a
  completely blank app, and that's the one failure mode worth being paranoid about.

Then: GitHub Pages redeploys in ~1 min, and your phone shows the update banner
next time you open the app.

## What still isn't automatic

The deploy half is fully automatic — push, and your phone offers the update.
What can't be automated is deciding *what* to change; something has to read your
feedback and make a judgement. That's the part you're in the loop for, and it's
the part worth being in the loop for.

## The review loop — without re-uploading files

You don't need to move files back and forth. The loop that avoids it:

**1. Build in Claude Code.** It has the repo, it pushes, your phone updates.

**2. When you want a review**, share `index.html` in a chat. You can paste it,
or just give the GitHub raw URL:
```
https://raw.githubusercontent.com/YOURNAME/trainlog/main/index.html
```
The raw URL is better — it's always the current version, and there's no
copy-paste step.

**3. Get back a list of findings, not a file.** Ask for issues and fixes
described precisely enough to act on — file, function, what's wrong, what it
should be. Not a rewritten `index.html`.

**4. Hand that list to Claude Code.** It applies the changes in the repo and
pushes. Nothing is ever downloaded or re-uploaded.

This is better than receiving a whole file back. A 200KB file costs a lot to
produce, is easy to paste incorrectly, and silently discards anything Claude
Code changed in the meantime. A findings list can't do any of that.

**The one exception** is the very first upload — the current `trainlog-app.zip`
has to get into the repo once by hand. After that, never again.

## When to come back to chat instead

Use a chat session for things where the answer isn't code:

- "Should volume drop during a deficit, and by how much?"
- "Is this exercise safe given my shoulder?"
- "The MRV ratchet fired and cut my quad volume — was that right?"
- "I've got 6 weeks of data, what does it say?"
- Anything involving the training literature, or a design decision with
  tradeoffs.

Claude Code is very good at "make this change correctly". It's not the right
place to work out whether the change is a good idea.

## Backing up before a risky change

Before any session where Claude Code will touch storage handling, the log format,
or `sets()`/`append()`: open the app, **Lifts tab → Save backup**. Takes five
seconds. Your data is in your phone's browser storage, so a bad deploy can't
delete it — but a bug that writes malformed events could still make a mess.
