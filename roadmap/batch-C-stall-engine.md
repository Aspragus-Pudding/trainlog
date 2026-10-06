# Claude Code prompt — batch C: stall engine

Run after batch B. **Requires the persona simulator** — if it doesn't exist,
build it first (see spec §8).
Paste everything below the line into Claude Code.

---

Read CLAUDE.md, then `docs/spec/strength-programming.md` in full, and
`docs/research/lift-specific.md` for the decision tables. This batch
implements **section 5 and 6.4–6.5**. Plan first, ask about anything
ambiguous, push back where the spec is wrong.

## Scope

1. **Stall detection (§5.1)** per main lift, by experience level.
2. **Intervention ladder (§5.2)** as proposal cards: step 0 checks, more
   practice, diagnose, targeted variant. One active intervention per lift.
3. **Decision tables (§5.3)** ported from the research as data, keyed by
   family and sticking region, with the modifier-based fallback for families
   the research doesn't cover.
4. **Own-ratio tracking (§5.4)** for every main lift and variant signature.
5. **Intervention history (§5.5)** — outcomes recorded and used to order
   future proposals.
6. **Specialization blocks (§5.6)** with all eligibility guards and shoulder
   gating.
7. **RPE scatter flag and practice sets (§6.4–6.5).**
8. Settings: opt-in auto-apply for interventions.

## Validation

Run every persona through at least 24 simulated weeks and report, per persona:
when stalls were detected, which interventions were proposed in what order,
and whether the ladder behaved sensibly. Specifically confirm:

- the fatigue persona gets a deload, not more volume
- the deficit persona gets the deficit explanation, not an intervention
- the shoulder persona never gets high-frequency barbell pressing
- a lift trained less than weekly is flagged as an exposure problem, not a
  stall

## Before you commit

- Syntax-check, both tests pass, add invariants for every guard above.
- Bump `APP_VERSION`, commit, push.

Report the persona results in a table.
