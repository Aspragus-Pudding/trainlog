# Strength programming spec

The design document for the next three batches. It turns two research reports
into rules. Claude Code builds from **this file**, not from the reports.

- Evidence: `docs/research/strength-programming.md` and
  `docs/research/lift-specific.md`
- Batches: `roadmap/batch-A-foundation.md`, `batch-B-program-builder.md`,
  `batch-C-stall-engine.md`

Grades follow the reports: A (meta-analyses), B (controlled studies), C
(limited/observational), D (coach opinion). Every constant in this spec that
isn't A or B is a **judgement default** and must be commented as such in code.

---

## 0. Principles

1. **Specificity first.** When a lift stalls, the default fix is more practice
   of that lift. Variants are used only on a specific logged signal. (A for
   specificity, C/D for targeted variants.)
2. **Technique is mostly setup and repetition.** The app can't see the lift. It
   can make setup consistent, prompt video, ask where a rep failed, and
   prescribe submaximal practice.
3. **The app proposes, the user decides.** Program changes from the stall
   engine appear as cards with a reason. Accept, decline, or (opt-in)
   auto-apply.
4. **Principles, not brands.** No named programs (5/3/1, Juggernaut, Smolov,
   Sheiko) in code, UI or copy. The structures they use are fine.
5. **Every rule works for custom exercises.** Nothing in this spec may depend
   on an exercise being in the built-in library.
6. **Additive data only.** Every change is a new field or event type. Old logs
   load unchanged. CLAUDE.md invariants hold.

---

## 1. Exercise library model

This is the foundation everything else needs.

### 1.1 Families

Every exercise belongs to a **family**: the movement it trains toward.

| Family | Examples |
|---|---|
| `squat` | back squat, Transformer/SSB squat, front squat, pendulum, hack, belt squat, leg press |
| `hinge` | deadlift, trap bar, RDL, belt squat RDL, back extension |
| `horizontal_press` | bench, DB bench, incline machine, chest press machines, floor press |
| `vertical_press` | overhead press, landmine, machine shoulder press |
| `vertical_pull` | pull-up, chin-up, pulldowns |
| `horizontal_pull` | rows of all kinds |
| `isolation` | everything else — no family-level strength tracking |

Families come from the existing `pattern` field; this is a mapping, not a new
taxonomy.

### 1.2 Parent and specificity

Within a family, an exercise may name a **parent** — the exercise it's a
variant of — and a **specificity** from 0 to 1: how closely it resembles the
parent (Grade D, defaults below).

| Relationship | Specificity default |
|---|---|
| Same exercise with a modifier (pause, tempo, grip, ROM) | 0.9 |
| Same pattern, different implement (Transformer bar ↔ back squat) | 0.7 |
| Same pattern, machine version (hack/pendulum ↔ squat) | 0.5 |
| Same family, different pattern (leg press ↔ squat) | 0.3 |
| Accessory for the same muscles | 0.1 |

Specificity drives two things: which exercises the stall engine considers as
variants, and how much a variant's performance counts toward the parent's
trend (it doesn't — see 1.4).

### 1.3 Modifiers — the key design decision

**Pause, tempo, range-of-motion and grip are set-level modifiers, not separate
exercises.**

```
modifiers: {
  pause:  { seconds: 2, at: 'bottom' | 'chest' | 'below_knee' | 'start' | 'top' },
  tempo:  '3-1-0',
  rom:    { kind: 'deficit' | 'pin' | 'board' | 'partial', amount: 2, unit: 'in' },
  grip:   'close' | 'wide' | 'neutral' | 'standard'
}
```

Why this matters:

- **Custom exercises get variants for free.** A user adds their gym's incline
  converging machine, and paused or tempo versions of it exist immediately.
  No library entries needed.
- **Ratios work everywhere.** Paused incline vs normal incline, deficit vs
  conventional — any exercise against its own modified self.
- **The library doesn't explode.** One "bench press" instead of bench, paused
  bench, Spoto, 3-board, pin press, close-grip…

Genuinely different movements stay separate exercises (front squat, trap bar,
sumo). The test: different implement, stance or body position → separate
exercise; same movement done differently → modifier.

Each **(exercise, modifier signature)** pair gets its own e1RM track. Signature
is a stable string, e.g. `incline_machine|pause:2@chest`.

### 1.4 Main lifts and tracking

- Any exercise in a tracked family can be a **main lift** (goal lift) —
  built-in or custom.
- Main-lift strength trend uses **top sets and AMRAPs of the unmodified
  exercise only**. Back-offs, warmups and modified variants don't count toward
  it. They have their own tracks.
- Machine and stack exercises remain non-comparable *across* exercises, but
  are fully comparable against themselves over time.

### 1.5 Custom exercises

Creation gains two questions, both skippable:

1. **"Is this a version of something you already do?"** → pick a parent, or
   "It's its own movement." Family is inferred from the movement-type picker
   that already exists.
2. **"Make this a main lift?"** → adds it to goal-lift candidates.

If skipped: family from movement type, no parent, specificity defaults from
1.2 apply against other exercises in the family by implement.

### 1.6 Sticking-point targets

Exercises and modifiers can declare which sticking region they target, used by
the stall engine's decision tables (section 5):

`bottom | off_chest | off_floor | mid | below_knee | lockout | start | top`

Modifiers carry implicit targets — a pause at the bottom targets `bottom`, a
pin press at mid-range targets `mid`. Built-in exercises get explicit tags in
batch A.

### 1.7 Migration

- Tag every built-in exercise with family; tag obvious parents (Transformer
  configurations → back squat; paused/pin/board variants that exist as
  separate entries become modifier signatures on their parent).
- Existing logs: sets without modifiers have the empty signature. Nothing is
  rewritten.
- Existing custom exercises: family from pattern, no parent until the user
  sets one.

---

## 2. Session structure

### 2.1 Set roles

Every working set gets a role:

| Role | Use |
|---|---|
| `top` | The heaviest set of a main lift: prescribed reps @ RPE |
| `backoff` | Volume after the top set |
| `amrap` | As many reps as possible at a prescribed load — calibration and realization |
| `straight` | Ordinary hypertrophy sets (current behaviour) |
| `practice` | Submaximal technique sets, RPE 6–7 |

Warmup, cluster and extension sets keep their existing kinds.

### 2.2 Top set + back-offs

Default shape for main lifts in strength blocks, and for the main-lift
maintenance slot in hypertrophy blocks:

- **Top set:** prescribed reps @ target RPE, priced by the existing engine.
- **Back-offs:** load = top-set load × (1 − drop), reps = top-set reps (or +1–2
  in volume weeks), N sets. Default drop 8%, N from the block's volume (Grade
  D).
- **Power-user option:** fatigue-stop back-offs — repeat at the back-off load
  until RPE reaches top-set RPE, cap at N+2 sets.

The explanation line shows both: "Top: 210 × 5 @ 8 · Back-offs: 4 × 5 @ 195."

### 2.3 Training max

Each main lift has a **training max (TM)** — the planning number for blocks,
separate from the live e1RM the per-set engine uses.

- Initial TM = 90% of current e1RM (Grade D convention).
- Updated by realization AMRAPs (2.4) and by block-end top-set trends.
- Never updated by a single session's top set.

### 2.4 Realization week

The last week of every strength block. Main lifts get one AMRAP at a fixed % of
TM:

| Block rep focus | AMRAP load |
|---|---|
| 8–10 | 75% TM |
| 5–6 | 85% TM |
| 2–3 | 90% TM |

TM update: e1RM from the AMRAP → new TM = 90% of it, capped at +5% per block
(Grade D). If the AMRAP falls short of the block's rep target, TM drops 5% and
the stall engine is notified.

### 2.5 Increment-aware progression

If the next loadable step is more than 5% of the current load (common on
machines with 10 lb jumps), progress **reps first** to the top of the range
before adding load. Applies to every progression path. (C — strongest support
from stalled overhead pressers.)

### 2.6 Failed reps

Sets gain an optional `failed` flag (attempted reps not completed). Feeds the
sticking question (6.3) and stall detection.

---

## 3. Program builder

### 3.1 Profiles

Five profiles are the front door. Each maps to four parameters; tweakers can
edit the parameters directly.

| Profile | Strength : size | Test frequency | Peaks | Specificity |
|---|---|---|---|---|
| Pure strength | 80 : 20 | every block | yes | high |
| Strength first | 65 : 35 | every block | before tests | high |
| Even mix | 50 : 50 | every 2nd block | before tests | medium |
| Size first, occasional PRs | 25 : 75 | every 3rd block | no | medium |
| Pure size | 0 : 100 | never | no | low |

- **Strength : size** sets the ratio of strength-block weeks to
  hypertrophy-block weeks.
- **Test frequency** sets which strength blocks end in a realization week.
- **Peaks** — a 2-week taper before a test, inserted only before a fixed target
  date or a test date.
- **Specificity** — how strongly exercise selection favours the main lifts
  themselves over variants and rotation.

### 3.2 Experience level

| Level | Programming model |
|---|---|
| Novice | Single ongoing block; add load every session on main lifts until progress stalls twice; then becomes intermediate. No periodization (B: untrained lifters gain similarly without it). |
| Intermediate | Alternating hypertrophy and strength blocks of 4–8 weeks, realization weeks per profile. |
| Advanced | Full blocks, peaks, and eligibility for specialization (section 5.6). |

Data overrides the self-report: a lifter adding load every session for 3+
weeks is treated as novice regardless.

### 3.3 Block sequencing

Given profile, experience, days per week, target date (fixed or not) and an
optional test date, generate the block list:

- Hypertrophy blocks 5–10 weeks, strength blocks 3–6 weeks, scaled by the
  profile ratio. (C)
- **Interleave** — don't stack all strength at the end. The plan ends in a
  strength block only if the profile wants PRs.
- If the date leaves an awkward remainder, the linter suggests extending or
  shortening rather than generating a stub block.
- **Peak is not a user-selectable block type.** The current `peak` type is
  removed from the block editor; existing peak blocks migrate to strength
  blocks flagged `taper: true`.

### 3.4 Strength maintenance in hypertrophy blocks

Each main lift gets one top set per week at RPE 7–8 during hypertrophy blocks,
so strength expression doesn't fade (residual-effect logic, D for the exact
duration). Counted as a main-lift exposure.

### 3.5 Hypertrophy refinements

- **Effort ramp across the mesocycle:** compounds 3 → 1 reps in reserve,
  isolations 3 → 0. (A–B: proximity to failure matters for hypertrophy.)
- **Week-1 calibration AMRAP** on the last set of each isolation — doubles as
  RPE-accuracy data for engine phase 2.
- **Stop adding sets** to a muscle when performance drops two sessions running.
- **Per-session cap** ~10–11 fractional sets per muscle; spread the rest across
  days. (B–C, diminishing returns per session.)

### 3.6 Deloads

**Fatigue-triggered, not calendar-fixed.** (B against fixed deloads as a
growth tool.) Triggers, any of:

- readiness trending down 3+ sessions
- RPE drift ≥ 1 at matched load across 2–3 weeks
- a joint at ladder level 3+
- 10+ weeks without a deload (soft prompt only)

A deload is proposed as a card, not imposed. The existing `deload: true`
toggle on blocks remains for users who want it fixed.

### 3.7 Rerunning the builder

The builder is rerunnable from settings. It generates a new roadmap from the
current week forward, shows a before/after, and changes nothing until
accepted. Logged history is never touched.

---

## 4. Setup flow and tutorial

Two separate things.

### 4.1 Tutorial — one time, skippable

Six short cards, reachable later from the Lifts tab:

1. The check-in adjusts today's session. **3 means normal.**
2. Amber numbers are suggestions. Change anything before logging.
3. RPE: 10 = nothing left, 8 = two reps in reserve.
4. The line under each set explains why it says what it says.
5. ✎ sends feedback; setup notes and cues live in each exercise's info.
6. Your data stays on this device. Back it up.

Replaces the existing one-screen intro.

### 4.2 Program builder — rerunnable

Two paths at the start:

- **Quick setup** (autopilot): profile → days/week → main lifts → done.
  Everything else defaults. Under a minute.
- **Full setup:** all steps below.

Steps:

1. **Goal** — five profile cards with one-line plain descriptions.
2. **Experience** — three options with plain definitions ("still adding weight
   most sessions" / "progress takes weeks" / "progress takes months").
3. **Schedule** — days per week, rough session length.
4. **Main lifts** — up to three, from search including custom exercises, with
   "create one" inline. Optional rough strength per lift.
5. **Equipment** — barbell, machine-heavy, dumbbells-only, mixed. Filters
   exercise selection.
6. **Dates** — target date (optional), fixed or not, optional test/meet date.
7. **Constraints** — conditions and joints (existing).
8. **Review** — the generated roadmap with a one-line reason per block. Edit or
   accept.

Every step skippable. Existing onboarding is replaced by this; existing users
see it only when they choose to rerun.

---

## 5. Stall engine

### 5.1 Detection

Per main lift, from top sets and AMRAPs only (1.4):

| Experience | Stall = no new top-set e1RM high for |
|---|---|
| Novice | 2 consecutive failed progressions |
| Intermediate | 4 weeks |
| Advanced | 6 weeks |

(D — from coach operational definitions: 2–3 weeks untrained, 5–6 trained.)

Requires the lift to have been trained at least weekly across the window;
otherwise it's an exposure problem, not a stall.

### 5.2 The intervention ladder

Each step is a **proposal card**: what changes, why, for how long. One active
intervention per lift at a time.

**Step 0 — non-specific checks (first, always):**

| Check | Proposal |
|---|---|
| Readiness trending down / RPE drift at matched load | Deload week |
| Bodyweight falling, or energy balance set to deficit | Explain that strength stalls are expected in a deficit; hold load, maintain volume |
| Trained < 2×/week | Add an exposure (this is step 1 anyway) |
| Next jump > 5% of load | Switch to rep-first progression (2.5) |

**Step 1 — more of the lift (default):** +1 session per week on that lift, or
+30–50% sets, mostly RPE 6–8, for 4–8 weeks. (A–B for frequency/volume
dose-response.)

**Step 2 — diagnose:** if step 1 produced no e1RM change after 4 weeks: prompt
a video of the next top set, surface the user's sticking-point answers, and
check own ratios (5.4).

**Step 3 — targeted variant:** replace one-third to one-half of the main lift's
volume with the closest variant whose sticking target matches the diagnosis,
filtered by equipment and conditions. Prefer modifiers on the main lift itself
(pause, tempo, ROM, grip) over different exercises. 6–8 weeks. (C/D.)

**Step 4 — specialization:** see 5.6.

### 5.3 Decision tables

Port the per-lift tables from `docs/research/lift-specific.md` as data, keyed
by family and sticking region:

```
{ family, sticking, cause, signal: { log | ask | video }, recommendation, programming }
```

Recommendations reference modifiers where possible so they work for custom
exercises. Families without research tables (machine-only families, custom
families) fall back to: step 1, then a pause modifier at the reported sticking
region, then a tempo modifier.

### 5.4 Own-ratio tracking

For every main lift and each of its variants (including modifier signatures)
logged at least 3 times in 8 weeks, track the ratio of variant e1RM to main
e1RM over time.

- A ratio falling ≥3% over 8 weeks is a signal for step 2/3 (Grade D
  threshold).
- Population norms from the research are shown only as context, never as a
  trigger — the reports found them unreliable.

### 5.5 Learning which interventions work for this user

Every intervention is an event with start, end, and outcome: e1RM change on the
main lift over the intervention and the 4 weeks after.

The ladder uses this history: if step 1 has worked for this user before, keep
proposing it first; if a type of intervention has failed twice for this user on
this family, skip it.

This is the app's version of "systematically determine what a lifter responds
to" — and it's the thing worth being proud of commercially.

### 5.6 Specialization blocks

Advanced only. Proposed only when all hold: not in a deficit, no joint at
level 2+, no test within 4 weeks, step 3 already tried.

- 4–8 weeks, 3–4 sessions per week on the target lift, mostly 70–85%, others
  at maintenance (~one-third volume).
- Retest 4–8 weeks after to see what was kept — the research found many
  specialization gains are temporary peaks.
- Shoulder gating: never proposes high-frequency barbell pressing for users
  with `shoulder_instability`; uses the substitution list instead.

---

## 6. Technique layer

### 6.1 Setup checklist

Before the **top set** of a main lift — not every set — show a one-tap
checklist: the user's own setup notes first, then up to three library setup
cues. Tap to dismiss. Skippable permanently per exercise.

For machines and specialty bars this is the primary technique tool: seat,
handles, pin, stance.

### 6.2 Video prompts

- Scheduled: every 3–4 weeks per main lift, on the top set.
- Triggered: at stall step 2.
- The app doesn't store video. It prompts, records `video_prompt` done/skipped,
  and on the next prompt reminds the user to compare with last time.

### 6.3 Sticking-point question

After a top set or AMRAP that's failed or logged at RPE ≥ 9.5: one tap — "Where
did it slow down?" Options from the family's sticking regions plus "nowhere
specific." Stored as a `sticking_report` event. Never asked more than once per
exercise per session.

### 6.4 RPE scatter flag

If RPE at matched load (±2.5%) varies by ≥1.5 across the last 4 exposures with
readiness steady, show: "Same weight is feeling quite different session to
session — worth some lighter practice sets and a video." (Grade D heuristic;
label it as such in code.)

### 6.5 Practice sets

In hypertrophy blocks and step-1 interventions, a share of main-lift sets are
`practice` role at RPE 6–7 — repetition that grooves the movement. The research
case where daily practice made technique automatic is the model.

---

## 7. Data additions

All additive.

**Exercise fields:** `family`, `parent`, `specificity`, `sticking` (array),
`mainEligible`.

**Set fields:** `role`, `modifiers`, `failed`.

**New events:** `tm_update`, `intervention_start`, `intervention_end`,
`sticking_report`, `video_prompt`.

**CFG:** `profile`, `profileParams` (overrides), `experience`, `equipment`,
`testDate`. `targetFixed` exists.

Event-replay, corrections, backup, sheet sync, demo mode and `resetToFresh()`
all handle the new types.

---

## 8. Testing

- Extend `tests/prescription-invariants.js` for every new rule: modifier
  signatures isolated, back-offs never exceed top set, rep-first when step >5%,
  TM capped, neutral readiness = no deload trigger.
- **The stall engine can't be validated on real data yet** — it needs months.
  It must be validated with the persona simulator: a responder, a non-responder,
  a lifter who stalls at week 8, a lifter in a deficit, a lifter whose stall is
  fatigue. If the simulator doesn't exist yet, it is a prerequisite for batch C.
- Backtest numbers must not regress on the existing fixture.

---

## 9. What's deliberately out

- Named programs, verbatim templates and their percentages.
- Population strength-ratio norms as triggers.
- Video analysis.
- Accommodating resistance (bands/chains) as a recommendation — mixed record,
  rare equipment.
- Auto-applying program changes by default.
