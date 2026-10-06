# Claude Code prompt — batch A: foundation

Paste everything below the line into Claude Code from the `trainlog` folder.

---

Read CLAUDE.md, then `docs/spec/strength-programming.md` in full. This batch
implements **sections 1, 2 and 6.1–6.3** of the spec. Plan first, ask about
anything ambiguous, and push back where the spec is wrong.

Run both test scripts before and after.

## Scope

1. **Exercise library model (spec §1).** Families, parent, specificity,
   sticking targets, main-lift eligibility. Modifiers as set-level data with
   per-signature e1RM tracks. Migrate built-in exercises and existing custom
   exercises as §1.7 describes — tell me which existing separate exercises you
   plan to fold into modifier signatures before doing it.
2. **Custom exercise creation (§1.5).** The two new optional questions.
3. **Modifier UI.** A compact way to add pause / tempo / ROM / grip to a slot
   in the preview, the week view and mid-session. Modified sets display the
   modifier clearly everywhere they appear.
4. **Set roles and session structure (§2.1–2.2, 2.5, 2.6).** Top set +
   back-offs for main lifts in strength blocks, back-off option settings,
   increment-aware rep-first progression, failed-rep flag.
5. **Training max and realization (§2.3–2.4).** TM per main lift, realization
   AMRAPs at the end of strength blocks, TM update rules and caps.
6. **Technique basics (§6.1–6.3).** Setup checklist before top sets, scheduled
   video prompts, sticking-point question.

Not in this batch: profiles, block sequencing, deload changes, stall engine.

## Constraints

- Every rule must work for custom exercises. Add a custom exercise in your
  testing and run it through modifiers, top set/back-offs and the checklist.
- Additive data only (spec §7). Old logs must load and replay identically.
- Explanation line covers every new prescription path.
- Grade-D constants commented as judgement defaults.

## Before you commit

- Syntax-check `index.html`.
- Both test scripts pass; add invariant cases from spec §8.
- Bump `APP_VERSION`, commit, push.

Report: the modifier-signature migration list, how you modelled TM vs live
e1RM, and anything in spec §1–2 you changed or think is wrong.
