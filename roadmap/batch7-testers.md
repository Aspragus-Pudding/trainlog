# Claude Code prompt — batch 7: ready for testers

Paste everything below the line into Claude Code from inside the `trainlog`
folder. Run after batch 6.

---

Read CLAUDE.md and ALPHA.md first.

Most of the multi-user infrastructure already exists: per-device storage,
first-run onboarding, neutral defaults, setup links for backup, self-updating
service worker. This batch closes the remaining gaps before I hand it to five
people.

## 1. Starting estimates inside onboarding

A new user finishes the setup wizard and their first session shows dashes for
every load until they find "Set starting estimates." Fold it into the wizard
as an optional step after goal lifts: "Roughly what could you do for one
all-out rep on these?" — only for the goal lifts they picked, skippable.

## 2. A one-screen "what is this" for first-time users

Testers won't have my context. After onboarding, show one screen — not a
tour, one screen — covering:

- The pre-workout check-in adjusts the session; answer honestly, 3 is normal.
- Suggested weights are suggestions; change anything before logging.
- RPE: 10 is nothing left, 8 is two reps in reserve. One line.
- The note button, and that notes go to me.
- Data lives on this device; backup if they care about it.

Reachable again from the Lifts tab.

## 3. Verify isolation end to end

I need to be certain two people on the same URL can't see each other's data.
Confirm:

- All storage keys are origin-scoped `localStorage` with no shared or
  cross-device component.
- The setup link writes only `CFG.syncUrl` and nothing else.
- Nothing fetches from the sync URL except the explicit restore action.
- `resetToFresh()` clears every key, including `LS_WEEK` and any added since.

Write this up as a short section in ALPHA.md so I can show testers.

## 4. Tester-facing notes should route to me

When a tester writes a note, it currently goes to *their* backup sheet (if
configured) and nowhere else. For the alpha I want their notes.

Simplest approach: if a `CFG.feedbackUrl` is set (separate from `syncUrl`),
notes also POST there. I'll set up one shared Apps Script for feedback and
include it in each tester's setup link as a second parameter.

Keep it minimal: note text, tag, app version, timestamp, and a tester label
they set once in onboarding ("what should I call you?"). No training data,
no bodyweight, nothing from the log.

Extend `applySetupLink()` to accept `?feedback=` alongside `?sync=`, with the
same `script.google.com` validation.

## 5. Version visibility

Put the version number somewhere a tester will see it without hunting — the
dashboard footer, small. Bug reports without a version are hard to act on.

## Before you commit

- Syntax-check `index.html`.
- Both test scripts pass unchanged.
- Walk the full new-user path yourself: reset to fresh, onboard, check in,
  log a session, finish, write a note. Fix anything rough.
- Bump `APP_VERSION`.
- Commit and push.

Report anything in the new-user path that felt confusing — that's exactly
what a tester would hit.
