# Alpha plan — 5 testers

## What's already true

**Testers need no setup beyond a link.** Same URL as yours. They open it in
Safari, Add to Home Screen, and the app walks them through first-run setup.
No accounts, no app store, no install step.

**Their data is theirs, automatically.** `localStorage` is scoped per device
per origin. Five people on the same URL have five completely separate stores.
Nobody can see anyone else's data, including you. There's no server holding it.

**Updates reach everyone.** You push to GitHub, and every tester's app notices
on next launch and offers the update banner. One deploy, five updated apps.

**A fresh install is now genuinely fresh.** Defaults carry no goal lifts, no
program, no gym assumptions. First run launches a 5-step setup: units, split,
up to three lifts to build around, anything they're working around, done. Every
step skippable, everything changeable later.

## Backup, without making them do Apps Script

Asking a friend to deploy a Google Apps Script web app is too much. Two options:

**Option A — you set it up for them (recommended).** Takes you ~5 min each.
For each tester: create a sheet, paste `AppsScript.gs`, deploy, copy the URL.
Then send them a **setup link**:

```
https://YOURNAME.github.io/trainlog/?sync=<URL-ENCODED-SCRIPT-URL>
```

Opening that link configures their backup silently and strips the parameter
from the address bar. They never see a settings screen. The app only accepts
`script.google.com` URLs, so a forwarded link can't redirect their data
somewhere hostile.

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
on. The version number is on the Lifts tab — tell them to include it.

Ask for: **what build, what screen, what you tapped, what happened.** "It froze"
took a long time to diagnose; "it froze after I tapped Swap during the third
exercise" would have been minutes.

A shared doc or a group chat is enough for five people. Don't build anything.

## Still worth building before you hand it out

Roughly in order:

1. **Use it yourself for two more weeks first.** Five people hitting a version
   you haven't lived with means five people finding the same bug.
2. **Test the new-user path properly.** Lifts tab → *Reset to a fresh install* →
   go through setup as if you'd never seen it. Do this a few times; it's the
   only part of the app that's never had real use.
3. **Starting estimates during onboarding.** Right now a new user finishes setup
   and their first session shows dashes for every load until they set estimates
   or log something. Worth folding into the wizard.
4. **A one-screen "what is this" for testers.** They won't have the context you
   do about why it asks for soreness or what MRV means.
5. **Decide what you want from the alpha.** "Does it work" and "is it worth
   using" need different feedback. Ask five people to just use it for two weeks
   and tell you what annoyed them — that's more useful than a feature survey.

## What NOT to build for an alpha

- Accounts, login, or a server. The whole design is local-first; adding a
  backend for five people would cost money and create a data-protection
  obligation you don't want.
- Analytics. You have five testers — ask them.
- A feedback form in the app. Text them.

## Privacy, with other people's data involved

Once someone else's training log exists, a few things change:

- **Their data never leaves their device** unless they set up a backup. Keep it
  that way; don't add anything that phones home.
- **If you use Option A**, their backups land in sheets *you* created and can
  read. Tell them that plainly before they start. Give each person their own
  sheet — never one shared one.
- Keep the repo free of anything from their logs, same as your own.
