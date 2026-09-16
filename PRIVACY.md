# Privacy — public repo checklist

The app code itself contains nothing identifying. The leak risk is around it,
not in it.

## The one that matters: git commit metadata

**Every git commit permanently embeds the name and email configured on your
machine.** They're baked into the commit object, visible to anyone, and they
stay in history even if you change them later. If git is set up with your real
name and personal email — which is the default — your first push publishes both.

Fix this **before your first commit**.

**1. Turn on GitHub's email privacy**

GitHub → Settings → Emails → tick **Keep my email addresses private**, and also
**Block command line pushes that expose my email**. That second one is a safety
net that rejects a push which would leak your address.

That page shows a noreply address like:
```
12345678+yourusername@users.noreply.github.com
```
Copy it.

**2. Set this repo's identity**

From inside your `trainlog` folder:

```
git config user.name "trainlog"
git config user.email "12345678+yourusername@users.noreply.github.com"
```

No `--global`, so this only affects this repo — your other projects keep
whatever you normally use.

**3. Verify before pushing**

```
git config user.name && git config user.email
```

If you already committed with real details, the simplest fix is to delete the
repo and start clean — rewriting git history is fiddly and easy to get wrong.

## Your GitHub username is public

A public repo means your username and profile are visible to anyone who finds
it. If your account uses your real name, either change the display name on your
profile, or accept that the username is the identifying part — not the app.

Nothing links the repo to you *beyond* that, provided step 1 is done.

## Never commit these

Already covered by `.gitignore`, but worth knowing why:

- **Backup `.jsonl` files.** These contain your full training log, bodyweight,
  readiness answers and joint pain history. Keep them in iCloud, not the repo.
- **Your Apps Script URL.** Anyone with it can write to your backup sheet. It
  lives in the app's local settings on your phone, never in the code — keep it
  that way. Don't paste it into a file "temporarily".
- Anything exported from the app.

## What's deliberately fine to have public

- The app code, including the shoulder-instability exercise flags.
- `shoulder-protocol.md` — clinical detail with no name, date, clinic or
  location. On its own it identifies nobody.
- `CLAUDE.md`, including the training context. It describes a training
  situation, not a person.

You said injuries are fine to include and I've kept them, because they make the
app's constraints legible to Claude Code. If you change your mind, delete
`shoulder-protocol.md` and the "User context" section of `CLAUDE.md` — nothing
in the app depends on either file.

## Quick audit anytime

```
grep -rinE "your-real-name|your-city|@gmail|@outlook|script\.google\.com/macros" .
git log --format='%an <%ae>' | sort -u
```

The second command lists every author identity in your history. It should show
only the pseudonym.
