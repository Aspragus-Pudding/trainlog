# Claude Code prompt — batch B: program builder

Run after batch A and after the engine phase 2 checkpoint.
Paste everything below the line into Claude Code.

---

Read CLAUDE.md, then `docs/spec/strength-programming.md` in full. This batch
implements **sections 3 and 4**. Plan first, ask about anything ambiguous,
push back where the spec is wrong.

## Scope

1. **Profiles (§3.1).** Five profiles, each mapping to four parameters,
   parameters editable under "customise".
2. **Experience models (§3.2).** Novice linear model, intermediate and
   advanced block models, data override.
3. **Block sequencer (§3.3).** Generates the roadmap from profile, experience,
   schedule and dates. Interleaving, linter suggestions, removal of `peak` as
   a selectable type with migration of existing peak blocks.
4. **Strength maintenance slot (§3.4)** in hypertrophy blocks.
5. **Hypertrophy refinements (§3.5).** Effort ramp, week-1 calibration
   AMRAPs, stop-adding-sets rule, per-session cap.
6. **Deloads (§3.6).** Fatigue-triggered proposals; fixed toggle stays
   available.
7. **Setup flow (§4).** Tutorial cards, quick and full builder paths, review
   screen, rerun with before/after preview.

## Constraints

- My current roadmap must survive: show me what the builder would generate for
  my existing settings and how my current blocks migrate before applying
  anything.
- Rerunning the builder never touches logged history.
- Every step of setup skippable; quick setup under a minute.
- Grade-D constants commented as judgement defaults.

## Before you commit

- Syntax-check, both tests pass, add invariants for the sequencer (interleave,
  test frequency per profile, no stub blocks, peak only before fixed/test
  dates).
- Bump `APP_VERSION`, commit, push.

Report: the roadmap the builder generates for each of the five profiles at
24 weeks, intermediate, 5 days/week — so I can sanity-check them.
