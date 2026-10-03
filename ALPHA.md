# Alpha plan — 5 testers

## What's already true

**Testers need no setup beyond a link.** Same URL as yours. They open it in
Safari, Add to Home Screen, and the app walks them through first-run setup.
No accounts, no app store, no install step.

**Their data is theirs, automatically.** `localStorage` is scoped per device
per origin. Five people on the same URL have five completely separate stores.
Nobody can see anyone else's data, including you. There's no server holding it.
(Details, and the two caveats, in *What a tester's data touches* below.)

**Updates reach everyone.** You push to GitHub, and every tester's app notices
on next launch and offers the update banner. One deploy, five updated apps.

**A fresh install is genuinely fresh.** Defaults carry no goal lifts, no
program, no gym assumptions. First run is a short setup: units, split, up to
three lifts to build around, a rough one-rep guess for those lifts (optional,
so the first session has loads instead of dashes), anything they're working
around, and — only if you've set up notes — what to call them. Every step
skippable, everything changeable later. After setup, one screen explains the
basics (check-in, suggestions, RPE, notes, where data lives); it's reachable
again from the Lifts tab under *How this works*.

## What a tester's data touches

Written to show testers. Verified against v1.17.0 in a real browser: fresh
install, setup link, onboarding, check-in, a logged session, a note, reset.

- **Everything lives in this browser on this phone**, under keys starting
  `trainlog.` (the log, settings, the open session, rest timer, pending plan
  edits, this week's edits, two timestamps). No cookies, no IndexedDB, no
  account. The offline cache holds only the app's own files, never data.
- **Other testers can't see it, and neither can the person who set it up**,
  unless backups are switched on (below). Browsers wall off storage per
  website per device; there is no shared server.
- **The app sends data to two places at most, and only if a setup link or
  Settings put an address there:**
  - *Backup* — after each session, the log is posted to a Google Sheet. The app
    never reads from it except when you tap *Restore from sheet*.
  - *Notes* — when you save a note, it's sent with its kind (bug / idea /
    other), the app version, the time, and the name you gave. Nothing from the
    training log goes with it.
- **A setup link only fills in those two addresses.** It can't change anything
  else. If an address is already set, the app asks before replacing it.
- **Reset to a fresh install** (Lifts tab) deletes every `trainlog.` key,
  including any a future version adds, then reloads into setup.

Two honest caveats:

- **The backup address works like a password.** Anyone who has it can read
  that log back out — that's how Restore works. It's inside the setup link and
  inside every saved backup file. Don't forward either.
- **Anyone who can unlock the phone can open the app.** Same as Notes or
  Photos. A shared device means shared data.

## Backup, without making them do Apps Script

Asking a friend to deploy a Google Apps Script web app is too much. Two options:

**Option A — you set it up for them (recommended).** Takes you ~5 min each.
For each tester: create a sheet, paste `AppsScript.gs`, deploy, copy the URL.
Then send them a **setup link**:

```
https://YOURNAME.github.io/trainlog/?sync=<URL-ENCODED-SCRIPT-URL>
```

Opening that link configures their backup and strips the parameter from the
address bar. They never see a settings screen.

The app only accepts URLs of the form
`https://script.google.com/macros/s/…/exec`. That stops typos and random
sites, but it is **not** proof the link came from you — anyone with a Google
account can deploy a script there. What actually protects a tester is that a
link can't silently replace an address already set; it asks first. So send the
setup link before they start logging, and tell them to say no to any later
prompt they weren't expecting.

Encode the URL first — in a browser console:
```js
encodeURIComponent('https://script.google.com/macros/s/AAA.../exec')
```

**Option B — manual backups.** They tap **Save backup** on the Lifts tab, which
opens the iOS share sheet straight into Files or iCloud. The app nags after six
sessions without one. Fine for a short alpha; they will forget.

Either way, be explicit with them that it's an alpha and data loss is possible.

## Collecting feedback from five people

The thing that makes bug reports useless is not knowing what build someone was
on. The version is on the Lifts tab and at the bottom of the dashboard
("Trainlog v1.17.0 — include this in any bug report").

Ask for: **what build, what screen, what you tapped, what happened.** "It froze"
took a long time to diagnose; "it froze after I tapped Swap during the third
exercise" would have been minutes.

**In-app notes can come straight to you.** One sheet for all testers:

1. New Google Sheet → Extensions → Apps Script → paste `FeedbackScript.gs`.
2. Deploy → Web app, execute as you, access: anyone. Copy the URL.
3. Add it to each tester's setup link:
   ```
   https://YOURNAME.github.io/trainlog/?sync=<ENCODED-BACKUP-URL>&feedback=<ENCODED-FEEDBACK-URL>
   ```
   Either parameter works on its own.

Each note becomes a row: received, written, tester, kind, version, note. The
script only appends — it has no way to read rows back out — so sharing one
feedback URL across testers doesn't let them see each other's notes. Onboarding
asks "What should we call you?" only when a feedback URL is set; the name can
be changed in Settings, and Settings also has *Stop sending notes*.

The notes still land in the tester's own log too, so nothing is lost if the
feedback sheet is down.

## Theme codes

Edit program → *Have a code?* Type one, tap Apply. It only changes the look;
*Reset to the default look* undoes it. Codes aren't case-sensitive.

| Code | What it looks like |
|---|---|
| `GIRLYPOP` | Soft pink, hot-pink accent, bows on the header and on new-best badges. |
| `GOBLIN` | Moss, dirt brown, candlelight amber. Heavier type, and the pop-up messages get feral ("Set 2 hoarded"). |
| `TERMINAL` | Phosphor green on black, monospace, square corners, a blinking cursor after the readiness score. |
| `SUNSET` | Deep plum shading to burnt orange, coral accent. The soft one for a dim room. |
| `HIGHVIS` | Black and white with a safety-yellow accent, bigger and heavier text. The accessibility option. |

Warnings stay warning-coloured in every theme, and the three block colours stay
distinct. Error and backup messages are never reworded.

## Still worth doing before you hand it out

1. **Use it yourself for two more weeks first.** Five people hitting a version
   you haven't lived with means five people finding the same bug.
2. **Walk the new-user path yourself, on the phone.** Lifts tab → *Reset to a
   fresh install* → go through setup as if you'd never seen it. (Do this on a
   spare browser profile or after a backup — reset deletes your log.)
3. **Decide what you want from the alpha.** "Does it work" and "is it worth
   using" need different feedback. Ask five people to just use it for two weeks
   and tell you what annoyed them — that's more useful than a feature survey.

## What NOT to build for an alpha

- Accounts, login, or a server. The whole design is local-first; adding a
  backend for five people would cost money and create a data-protection
  obligation you don't want.
- Analytics. You have five testers — ask them.

## Privacy, with other people's data involved

Once someone else's training log exists, a few things change:

- **Their data never leaves their device** unless they set up a backup. Keep it
  that way; don't add anything that phones home.
- **If you use Option A**, their backups land in sheets *you* created and can
  read. Tell them that plainly before they start. Give each person their own
  backup sheet — never one shared one. (The feedback sheet is the exception:
  it's append-only and holds only notes.)
- Keep the repo free of anything from their logs, same as your own.
