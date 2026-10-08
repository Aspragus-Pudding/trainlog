# Alpha plan: 5 testers

## Setting a tester up (the short version)

For each tester:

1. **Feedback sheet (once, shared by everyone):** New Google Sheet →
   Extensions → Apps Script → paste `FeedbackScript.gs` → Deploy → Web app,
   execute as you, access: anyone → copy the URL. It only appends rows. It
   has no way to read them back out, so sharing it between testers is safe.
2. **Backup sheet (optional, one per tester, never shared):** same steps with
   `AppsScript.gs`. Skip this and they back up by hand (Lifts → Save backup).
3. **Make their setup link.** Encode each URL in a browser console with
   `encodeURIComponent('https://script.google.com/macros/s/…/exec')`, then:
   ```
   https://aspragus-pudding.github.io/trainlog/?feedback=<ENCODED-FEEDBACK-URL>&who=<Name>
   ```
   Add `&sync=<ENCODED-BACKUP-URL>` only if you made them a backup sheet.
   Every parameter is optional and sets only its own thing. `who` puts their
   name on their notes, so you can tell testers apart in the sheet.
4. **Have them install it first, then apply the link.** On iPhone: open
   `https://aspragus-pudding.github.io/trainlog/` in Safari → Share → Add to
   Home Screen → open it from the home screen → go through setup →
   Edit program → **Setup link** → paste the link → Apply → Save. (Assume the
   home-screen app doesn't share Safari's storage, so a link opened in Safari
   wouldn't reach it. Pasting avoids the question. On Android or desktop,
   opening the link directly works.)
5. Tell them it's an alpha, data loss is possible, and how to send a note
   (the ✎ pencil at the top of every screen). Ask for **what build, what screen, what you
   tapped, what happened.** The build number is at the bottom of the
   dashboard.

**Never give anyone your own backup URL or your backup file.** The backup
address works like a password: whoever has it can read your whole log back
out (that's how Restore works), and a sync from their phone would overwrite
your sheet. Restoring a backup file never takes its backup or notes address or
name (since v1.42.0), but don't send your file to anyone anyway.

## What's already true

**Their data is theirs, automatically.** Storage is scoped per device per
website. Five people on the same URL have five separate stores. Nobody can see
anyone else's data, including you, and there's no server holding it.

**Updates reach everyone.** You push to GitHub. Every tester's app notices on
next launch and offers the update banner, and it never swaps the app out
mid-session.

**A fresh install starts clean.** No goal lifts, no program, no conditions.
The first run is the program builder:
- **Quick path:** goal, days per week, main lifts, equipment, and anything
  they're working around.
- **Full path:** adds experience and dates.
- Both end on a review of the blocks it will build, each with a one-line
  reason.

Then six short cards explain the basics. They're under *How this works* on
the Lifts tab.

Defaults the alpha doesn't yet adapt to:
- **Pounds only.** Kilograms is hidden in setup, because the engine prices in
  lb and kg isn't carried through every screen. Machines labelled in kg still
  work per exercise from the set card.
- **The plate set assumes 2.5 lb as the smallest plate.** Machine step sizes
  are the library's defaults. Bar weights can be changed per exercise; step
  sizes can't yet.
- **Specialty bars** (the Kabuki Transformer) are never picked automatically.
  A tester only gets them by choosing them or logging one.

**Injuries and conditions.** Setup and Edit program open a picker: region,
then the broad option ("Knee pain") or a closer match ("Pain around/behind
kneecap") — about 50 entries from the injury research, across every region.
- The app only ever **warns**. A flagged exercise stays in the program with a
  badge and a one-tap suggested swap. Broad picks give amber; a specific one
  gives red only for its core movement; permanent conditions (an old elbow
  fracture, hypermobility) show their standing cue as a note instead.
- **Only the tester decides what's left out.** Setup shows the flagged
  exercises; whatever they tick is never put in their program automatically.
  They can add it back any time.
- **It learns them.** After a workout, flagged or joint-relevant exercises
  get one quick question ("how did your knee feel?"). After a few sessions an
  exercise that's been fine is marked fine for them; one that keeps hurting
  turns red and the app asks — never decides — whether to stop including it.
- **Before the first pick** testers see the research's disclaimer and four
  consent boxes. Each condition lists its warning signs; ticking one shows
  "see a professional" copy and turns off that condition's phase plan (the
  warnings and normal training stay).
- **Pain during a set:** after a set on a relevant exercise, one tap rates
  pain 0–10. Over the condition's limit (5/10 by default; stricter for
  rotator cuff pain, sprains, instability, stress fractures) the app suggests
  stopping that exercise or swapping it — advice with buttons, never a lock.
- **Phase plans (optional):** for conditions the research gives rehab phases,
  a tester can start a plan from the condition's card; the dashboard shows the
  phase, its exercises and when to move on, and a card suggests the next phase
  once it looks ready. It never moves on by itself.
- **Over-flagging is tested:** no condition flags more than 30% of the
  library, red flags stay under 10%.

## What a tester's data touches

Written to show testers.

- **Everything lives in this browser on this phone**, under keys starting
  `trainlog.`: the log, settings, the open session, the rest timer, plan
  edits, a small queue of unsent notes, and two timestamps. There are no
  cookies and no account. The offline cache holds only the app's own files,
  never data.
- **Other testers can't see it, and neither can the person who set it up**,
  unless backups are switched on (below).
- **The app sends data to two places at most, and only if a setup link or
  Settings put an address there:**
  - *Backup:* after each session, the log is posted to a Google Sheet. The app
    never reads from it except when you tap *Restore from sheet*.
  - *Notes:* when you save a note, it's sent with its kind (bug / idea /
    other), the app version, the time and your name. Nothing from the
    training log goes with it. A note written with no signal waits on the
    phone and goes out the next time the app opens online.
- **A setup link only fills in those addresses and your name.** It can't
  change anything else. If an address is already set, the app asks before
  replacing it. Settings checks that a backup address is a real Apps Script
  web app, and *Test it now* doesn't save it until you tap Save.
- **Reset to a fresh install** (Lifts tab) deletes every `trainlog.` key,
  including any a future version adds, then reloads into setup.

Two honest caveats:

- **The backup address works like a password.** See the warning at the top.
- **Anyone who can unlock the phone can open the app.** Same as Notes or
  Photos. A shared device means shared data.

## Demo mode (`?demo`)

Open `https://aspragus-pudding.github.io/trainlog/?demo` for a copy of the app
on fake data:
- It stores everything under `trainlog-demo:` keys (the real app's keys all
  start `trainlog.`).
- It makes no network calls. Sync, notes and sheet restore are switched off,
  and copied settings lose their URLs.
- It has its own clock, so you can fast-forward.
- "Copy my real log" only reads the real keys.

It's safe to show a tester: nothing done there reaches anyone's real data or a
sheet. This is checked by `tests/prescription-invariants.js` §43.

## Backup, without making them do Apps Script

**Option A: you set it up for them** (the `sync=` part of the setup link,
above). It takes about 5 minutes each. Their backups land in a sheet *you*
created and can read, so tell them that plainly. Give each person their own
backup sheet, never a shared one.

The app only accepts URLs of the form
`https://script.google.com/macros/s/…/exec`. That stops typos and random
sites, but it is **not** proof the link came from you: anyone with a Google
account can deploy a script there. What protects a tester is that a link can't
silently replace an address that's already set; it asks first. So send the
link before they start logging, and tell them to say no to any later prompt
they weren't expecting.

**Option B: manual backups.** They tap **Save backup** on the Lifts tab, which
opens the share sheet straight into Files or iCloud. When their newest backup
of either kind (a saved file or a sheet sync) is over a week old, a card on the
Progress tab and a prompt after each session remind them; "Not now" holds it
off until it's due again. **Restore from backup** checks the file is a
Trainlog backup before merging anything. That's fine for a short alpha, but
they will forget.

## Collecting feedback

Each note becomes a row in your feedback sheet: received, written, tester,
kind, version, note. A tester's own notes list shows them as "Sent". The
owner-only *Copy all for Claude Code* button is hidden for testers. The notes
also stay in the tester's own log, so nothing is lost if the sheet is down.

## Theme codes

Edit program → *Have a code?* Type one, tap Apply. It only changes the look,
and *Reset to the default look* undoes it. Codes aren't case-sensitive.

| Code | What it looks like |
|---|---|
| `GIRLYPOP` | Soft pink, hot-pink accent, bows on the header and on new-best badges. |
| `GOBLIN` | Moss, dirt brown, candlelight amber. Heavier type, and the pop-up messages get feral ("Set 2 hoarded"). |
| `TERMINAL` | Phosphor green on black, monospace, square corners, a blinking cursor after the readiness score. |
| `SUNSET` | Deep plum shading to burnt orange, coral accent. The soft one for a dim room. |
| `HIGHVIS` | Black and white with a safety-yellow accent, bigger and heavier text. The accessibility option. |

Warnings stay warning-coloured in every theme, and the three block colours stay
distinct. Error and backup messages are never reworded.

## Before you hand it out

1. **Walk the new-user path yourself**, in demo mode: `?demo` → Demo options →
   Fresh install. It's the same setup a tester sees, and it can't touch your
   log.
2. **Decide what you want from the alpha.** "Does it work" and "is it worth
   using" need different feedback. Asking five people to use it for two weeks
   and tell you what annoyed them is more useful than a feature survey.
3. **If you redeploy `AppsScript.gs`** (v1.42.0 hardened its restore
   callback), the URL stays the same if you use *Manage deployments → Edit →
   new version*. A *new* deployment gets a new URL.

## What NOT to build for an alpha

- Accounts, login, or a server. The design is local-first. A backend for five
  people would cost money and create a data-protection obligation you don't
  want.
- Analytics. You have five testers; ask them.

## Privacy, with other people's data involved

- **Their data never leaves their device** unless they set up a backup. Keep it
  that way; don't add anything that phones home.
- **If you use Option A**, tell them you can read their backup sheet.
- **Keep the repo free of anything from their logs**, same as your own.
- **Test tools must never run with a real backup address.** In October 2026 a
  UI test run with the owner's settings posted fake sessions to the owner's
  backup sheet. The test harnesses now strip the addresses and block
  off-device requests.
