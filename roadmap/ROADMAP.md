# Trainlog roadmap — October 2026

Revised 2 Oct 2026 against repo v1.14.0. Four Claude Code batches in order, a
dated engine checkpoint, and one research deliverable that's already done.

## The order, and why

| Batch | Theme | Why this position |
|---|---|---|
| **5** | Correctness | Two silent bugs affecting every session (joint readiness, calendar vs session drift). Fix before building on top. |
| **6** | UX polish | Clipping audit, preview, muscle-group browsing, splits per phase, coaching cues, session summary. Safe once the engine is stable. |
| **7** | Testers | Mostly built already; closes the gaps that block handing it out. |
| **8** | Theme codes | Fun, isolated, zero risk. Last so it doesn't jump the queue. |
| **~22 Oct** | Engine phase 2 | Personal calibration. Needs 3–4 weeks of v1.13.0 suggestion data. See `checkpoint-engine-phase2.md`. |

Run them in order. Each is one Claude Code session. Bring the reports back to
chat if anything surprising comes up — especially the item 1 findings in
batch 5.

## Decisions made

**Program progress counts sessions, not calendar days.** The rotation already
did; the phase/week didn't. Missing a week made them disagree. Session-based
throughout, with the target date as a projection that visibly drifts.

**Hard vs soft deadline — your call, with volume cramming removed.** A toggle
on the target date. Soft (default): extend the date. Hard: compress remaining
blocks, never below each type's minimum, never dropping a deload. Neither mode
adds per-session volume to catch up — missing sessions means fewer sessions,
and cramming raises per-session fatigue, which for a bad shoulder is the wrong
trade. The feature you were reaching for a safeguard on is the feature that's
been removed.

**Cycle tracking replaced with a general recovery input.** One anchored 1–5
item on the check-in — "how's the rest of life treating you?" — covering
stress, illness, being run-down, poor eating. Feeds readiness as a physical
signal. Applies to every user identically. The "I'm sick" chip is absorbed into
it; a 1 on this scale is a sick day.

**Coaching cues: done, 49 exercises.** `coaching-cues.json` is in this folder
— copy it to `docs/` in the repo before batch 6. Every id validated against the
v1.14.0 library. 32 carry a shoulder-instability note. Sources are named
coaches, not forums. Batch 6 shows the shoulder note prominently only when
`shoulder_instability` is a declared condition.

**No new progression-algorithm research.** The engine's problem was
calibration, not algorithm choice. Phase 1 fixed the two measured error
sources. Phase 2 needs data, and the checkpoint says what to ask for when it's
there.

## Items added that you didn't ask for

- **"vs last time" on every exercise card** — the delta against your previous
  session, visible before you lift. (Batch 6)
- **Session summary on finish** — tonnage, PRs, time, compared to last time.
  The payoff moment the app currently skips. (Batch 6)
- **Lower back as a muscle group** — you noticed it missing from the picker.
  It's also missing from the landmarks, so erector work has never counted
  toward volume. (Batch 5)
- **Shoulder notes gated by condition** — the cues' shoulder guidance only
  shows to users who've declared the condition. (Batch 6)

## Files in this folder

```
ROADMAP.md                      this file
batch5-correctness.md           Claude Code prompt
batch6-ux.md                    Claude Code prompt
batch7-testers.md               Claude Code prompt
batch8-themes.md                Claude Code prompt
checkpoint-engine-phase2.md     what to do ~22 Oct — not a prompt
coaching-cues.json              → copy to docs/ in the repo before batch 6
research-coaching-cues.md       the brief that produced the JSON; kept for
                                re-running when you add exercises
```

## Before batch 5

Copy `coaching-cues.json` into `trainlog/docs/`, commit it. That's the only
manual step in this roadmap.
