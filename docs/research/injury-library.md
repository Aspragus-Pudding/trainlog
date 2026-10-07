# Injury & Condition Library for a Strength + Running App: Research Document and Claude Code Implementation Pack

The library should launch with roughly 100 entries across 10 regions, built on three rules. First, every avoid has a matching modify, so the app warns and never removes. Second, each umbrella's avoid-list is computed as the union of its children's, so a child's list is always a subset. Third, STRUCTURAL entries have no rehab phases at all: just a permanent core cue, a warm-up that rehearses the cue, and a short do-more-of list. The evidence base is strong for a few high-prevalence conditions (patellofemoral pain, Achilles and patellar tendinopathy, ankle sprain, low back pain, gluteal tendinopathy, osteoarthritis) and thin for most structural and post-surgical entries. Those thin entries should ship to alpha only after a physio has reviewed them.

## TL;DR
- **Prioritise the alpha around 14 high-prevalence entries** where guidelines or trials exist: patellofemoral pain, patellar tendinopathy, midportion Achilles tendinopathy, plantar heel pain, lateral ankle sprain, medial tibial stress syndrome, low-risk bone stress injury, hamstring strain, gluteal tendinopathy, low back pain, rotator cuff–related shoulder pain, anterior shoulder instability and lateral elbow tendinopathy. Add the structural entries, led by elbow hyperextension and generalised hypermobility.
- **Use the Silbernagel pain-monitoring model as the one cross-cutting rule, with exceptions.** It allows pain up to 5/10 during and after loading, provided pain settles by next morning. The exceptions are bone stress injury (pain-free only), nerve symptoms (no spreading) and instability (no apprehension). Do not use the acute:chronic workload ratio as a hard trigger, because its validity has been seriously challenged.
- **Enforce "warn, never remove" in data, not UI.** The build fails if any avoid lacks a modify, if any child's avoid is not a subset of its parent's, or if a STRUCTURAL entry carries rehab phases. A third escalation tier (cauda equina signs, suspected high-risk stress fractures, systemic red flags) gets no injury-specific programme, only "see a professional" copy. The user's normal library stays open even then.

## Key Findings

1. **Prevalence ordering differs between lifters and runners, so the alpha needs both.**
   - **Lifters.** Keogh & Winwood's 2017 *Sports Medicine* systematic review of weight-training sports found injury rates low compared with common team sports. The shoulder, lower back and knee were the dominant sites, and muscle strains were the most common injury type in powerlifting and strongman. Tung, Lantz, Lopes & Berglund's 2024 updated systematic review in *BMJ Open Sport & Exercise Medicine* (17 reports, 3,062 lifters) found a high prevalence of pelvic floor dysfunction, such as urinary incontinence, in both sports: 50% among females compared with 9.3% among males. It belongs in the systemic region.
   - **Runners.** Kakouris and colleagues' 2021 systematic review reported running-injury prevalence of 36%–63.5%. By condition, the same review reported patellofemoral pain syndrome (16.7%), medial tibial stress syndrome (9.1%), plantar fasciitis (7.9%), iliotibial band syndrome (7.9%) and Achilles tendinopathy (6.6%).
2. **Tendinopathy loading tolerates some pain.** Silbernagel's 2007 RCT in 38 patients with Achilles tendinopathy found that continuing tendon-loading activity under a pain-monitoring model did as well as six weeks of active rest. The model allows pain to reach 5/10 during and after activity, provided it settles by the following morning. Silbernagel's own clinical handout has a slightly different third rule: next-morning pain "should not exceed a 5". The app should use the stricter "back to baseline by next morning" version.
3. **Progressive loading beats eccentric-only for patellar tendinopathy.** In Breda and colleagues' 2021 RCT, 76 athletes aged 18–35 followed one of two 24-week programmes. The progressive arm moved through four stages (isometric, isotonic, energy storage, sport-specific). Return to sport was 43% with progressive loading versus 27% with eccentric exercise.
4. **For gluteal tendinopathy, education about avoiding compression is part of the treatment.** In the LEAP trial (Mellor et al., BMJ 2018), education plus exercise achieved 77.3% global success at 8 weeks, versus 58.5% for corticosteroid injection and 29.4% for wait-and-see. The education centred on avoiding compressive hip-adduction positions such as crossed legs, side-lying and "hanging" on one hip. These positions map directly to app flags.
5. **The acute:chronic workload ratio should not be a hard rule.** Impellizzeri and colleagues (IJSPP 2020; Sports Medicine 2021) showed that the ratio suffers from mathematical coupling and statistical artefacts. They argued that injury frameworks should be updated to reflect its lack of predictive value. The app should use simple week-to-week change heuristics and label them as heuristics.
6. **Bone stress injury is the main exception to "some pain is OK".**
   - **Low-risk sites** (posteromedial tibia, metatarsal shafts) follow Warden and colleagues' 2021 JOSPT optimal-load model. Running starts only once the person has been pain-free for 5 consecutive days and can hop repeatedly without pain. Progression is a walk–run programme guided by symptoms, starting at about 50% of usual pace and building volume before speed.
   - **High-risk sites** belong in the refuse tier. Hoenig and colleagues' 2023 meta-analysis (76 studies, 2,974 bone stress injuries) found the highest complication rates in the femoral neck, tarsal navicular, anterior tibial shaft and fifth metatarsal.
7. **Hypermobility evidence supports progressive strengthening, with honest uncertainty.**
   - **Guidance.** The 2017 International Consortium physical therapy paper (Engelbert et al.) recommends "a carefully graduate exercise training prescription". It also concedes "there is no convincing evidence for specific types of exercise or that exercise is better than control".
   - **Trial evidence.** Liaghat and colleagues' 2022 BJSM RCT (100 adults with hypermobile shoulders) compared high-load and low-load strengthening. The high-load arm did 3×10RM rising to 4×8RM, three times a week for 16 weeks. It was statistically superior on the Western Ontario Shoulder Instability Index (WOSI), with a between-group difference of −174.5 points. That difference falls below the 250-point minimal important difference in the intention-to-treat analysis.
   - **Diagnostic cut-off.** The adult Beighton threshold under the 2017 criteria (Malfait et al.) is ≥5 up to age 50 and ≥4 over 50.

---

# DELIVERABLE A — Research Document

## A0. Conventions used in every entry

- **Categories:** ACUTE (under 6 weeks, a recent event) · CHRONIC/RECURRENT (over 6 weeks or recurring) · STRUCTURAL/PERMANENT (anatomy is changed and won't normalise; no end date) · POST-SURGICAL (a surgeon's protocol overrides the app; the app supplements it).
- **Evidence grade:**
  - A: a clinical practice guideline recommendation graded A/B, or multiple RCTs.
  - B: a single good RCT or a formal consensus.
  - C: extrapolation from related conditions or expert consensus.
  - D: an app default or expert opinion that needs physio sign-off.
- **Dose conventions:** "RPE" means rate of perceived exertion (0–10). "Pain" means the 0–10 numeric pain rating scale (NPRS). Doses are app defaults within the ranges trials used. Where trials vary, the default is marked as such.
- **Escalation tier:**
  - T1: the app manages alone.
  - T2: clearance first. The app asks for clinician confirmation before showing rehab phases; flags and modifies still appear.
  - T3: the app does not program around the condition. It shows see-a-professional copy and gives no injury plan, but the normal library stays open.

## A1. PART 1 — The Catalogue (ranked by prevalence within region; α = alpha priority)

Ranking draws on the following. Keogh & Winwood (2017) is the main lifting source, and Kakouris et al. (2021), with its condition-level running prevalence figures, is the main running source. Ranks within a region are a judgement call combining those reviews with guideline prevalence statements. They are not a single pooled dataset.

### Neck
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | neck_pain | Neck pain / stiffness | Nonspecific neck pain | Umbrella (CHRONIC) | null | T1 |
| 1 α | neck_mobility | Stiff, sore neck | Neck pain with mobility deficits | CHRONIC | neck_pain | T1 |
| 2 | neck_headache | Neck pain with headaches | Cervicogenic headache | CHRONIC | neck_pain | T1 |
| 3 | neck_acute_wry | Neck locked up this week | Acute neck pain (wry neck) | ACUTE | neck_pain | T1 |
| 4 | neck_whiplash | Neck pain after a crash or fall | Neck pain with movement coordination impairments (WAD) | ACUTE | neck_pain | T2 |
| 5 | neck_radicular | Neck pain going down my arm | Neck pain with radiating pain (radiculopathy) | CHRONIC | neck_pain | T2 |
| 6 | neck_fusion | Neck fusion / plates | Cervical fusion with hardware | STRUCTURAL | neck_pain | T2 |

### Shoulder
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | sh_impingement | Shoulder impingement / pinching | Rotator cuff–related shoulder pain (RCRSP) spectrum | Umbrella | null | T1 |
| U | sh_unstable | Shoulder feels loose / unstable | Glenohumeral instability spectrum | Umbrella | null | T1 |
| U | sh_stiff | Shoulder stiff, can't get arm up | Shoulder stiffness | Umbrella | null | T2 |
| 1 α | sh_rcrsp | Pinchy shoulder lifting arm up | RCRSP / cuff tendinopathy / subacromial pain | CHRONIC | sh_impingement | T1 |
| 2 α | sh_ant_instability | Anterior shoulder instability | Anterior glenohumeral instability | CHRONIC | sh_unstable | T1 (T2 if first dislocation <6 wks) |
| 3 | sh_ac_joint | Top-of-shoulder pain on bench/dips | AC joint pain / distal clavicle osteolysis | CHRONIC | sh_impingement | T1 |
| 4 | sh_biceps_slap | Deep front-of-shoulder pain | Long-head biceps tendinopathy / SLAP | CHRONIC | sh_impingement | T1 |
| 5 | sh_cuff_tear_degen | Rotator cuff tear (not repaired) | Degenerative/partial cuff tear | CHRONIC | sh_impingement | T2 |
| 6 | sh_mdi_hypermobile | Shoulder slips in lots of directions | Multidirectional instability / hypermobile shoulder | STRUCTURAL | sh_unstable | T1 |
| 7 | sh_post_instability | Shoulder slips backwards | Posterior instability | CHRONIC | sh_unstable | T1 |
| 8 | sh_dislocation_acute | Dislocated recently | Acute traumatic dislocation | ACUTE | sh_unstable | T2 |
| 9 | sh_frozen | Frozen shoulder | Adhesive capsulitis | CHRONIC | sh_stiff | T2 |
| 10 | sh_ac_old_separation | Bump on top of shoulder (old AC injury) | Healed AC separation (grade III+) | STRUCTURAL | sh_impingement | T1 |
| 11 | sh_post_stabilisation | Shoulder stabilisation surgery | Post-Bankart/Latarjet | POST-SURGICAL | sh_unstable | T2 |
| 12 | sh_post_cuff_repair | Rotator cuff repair | Post-cuff repair | POST-SURGICAL | sh_impingement | T2 |

### Elbow
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | el_pain | Elbow pain | Elbow pain | Umbrella | null | T1 |
| 1 α | el_lateral_tendinopathy | Outside-elbow pain gripping | Lateral elbow tendinopathy | CHRONIC | el_pain | T1 |
| 2 | el_medial_tendinopathy | Inside-elbow pain gripping/curling | Medial elbow tendinopathy | CHRONIC | el_pain | T1 |
| 3 | el_distal_biceps | Front-of-elbow pain on curls/chins | Distal biceps tendinopathy | CHRONIC | el_pain | T1 |
| 4 | el_triceps | Back-of-elbow pain on lockout | Triceps tendinopathy | CHRONIC | el_pain | T1 |
| 5 | el_ulnar_nerve | Tingling in ring/little finger | Cubital tunnel / ulnar neuropathy | CHRONIC | el_pain | T2 |
| 6 α | el_hyperextension | Elbow hyperextends (old fracture) | Cubitus recurvatum / malunion with hyperlaxity | STRUCTURAL | el_pain | T1 |
| 7 | el_fixed_flexion | Elbow won't fully straighten | Post-fracture flexion contracture | STRUCTURAL | el_pain | T1 |
| 8 | el_post_biceps_repair | Distal biceps repair | Post-distal biceps repair | POST-SURGICAL | el_pain | T2 |

### Wrist / Hand
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | wr_pain | Wrist pain | Wrist/hand pain | Umbrella | null | T1 |
| 1 α | wr_dorsal_impingement | Back-of-wrist pain in push-ups/front rack | Dorsal wrist impingement | CHRONIC | wr_pain | T1 |
| 2 | wr_ulnar_tfcc | Pinky-side wrist pain | TFCC / ulnar-sided wrist pain | CHRONIC | wr_pain | T1 |
| 3 | wr_dequervain | Thumb-side wrist pain | De Quervain's tenosynovitis | CHRONIC | wr_pain | T1 |
| 4 | wr_carpal_tunnel | Numb fingers at night | Carpal tunnel syndrome | CHRONIC | wr_pain | T2 |
| 5 | wr_sprain_acute | Sprained wrist this week | Acute wrist sprain | ACUTE | wr_pain | T2 (scaphoid rule-out) |
| 6 | wr_limited_extension | Wrist won't bend back fully (old break) | Distal radius malunion / post-fracture stiffness | STRUCTURAL | wr_pain | T1 |
| 7 | wr_thumb_cmc_oa | Base-of-thumb arthritis | Thumb CMC osteoarthritis | CHRONIC | wr_pain | T1 |
| 8 | wr_post_orif | Wrist plate/screws | Post-ORIF distal radius | POST-SURGICAL | wr_pain | T2 |

### Thoracic / Ribs / Chest
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | th_pain | Upper back / rib / chest-wall pain | Thoracic & chest wall pain | Umbrella | null | T1 |
| 1 | th_mechanical | Upper back stiff and achy | Mechanical thoracic pain | CHRONIC | th_pain | T1 |
| 2 | th_rib_costochondral | Pain where ribs meet breastbone | Costochondral / rib joint pain | CHRONIC | th_pain | T2 (cardiac rule-out) |
| 3 | th_pec_strain | Pec strain | Pectoralis major strain | ACUTE | th_pain | T2 (tear rule-out) |
| 4 | th_scoliosis | Scoliosis | Adult idiopathic scoliosis | STRUCTURAL | th_pain | T1 |
| 5 | th_kyphosis | Rounded upper back (Scheuermann's) | Scheuermann's kyphosis | STRUCTURAL | th_pain | T1 |
| 6 | th_rib_stress | Rib pain when breathing hard | Rib bone stress injury | ACUTE | th_pain | T3 |

### Lower Back
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | lb_pain | Low back pain | Nonspecific low back pain | Umbrella | null | T1 |
| 1 α | lb_chronic_nonspecific | Back keeps flaring up | Chronic/recurrent nonspecific LBP | CHRONIC | lb_pain | T1 |
| 2 α | lb_acute_flare | Tweaked my back this week | Acute LBP | ACUTE | lb_pain | T1 |
| 3 | lb_radicular | Back pain going down my leg | LBP with leg pain / lumbar radiculopathy | CHRONIC | lb_pain | T2 |
| 4 | lb_si_joint | Pain at the dimple by my tailbone | SI joint–region pain | CHRONIC | lb_pain | T1 |
| 5 | lb_spondylolisthesis | Spondylolysis / slipped vertebra | Stable low-grade spondylolysis/listhesis | STRUCTURAL | lb_pain | T2 |
| 6 | lb_stenosis | Legs ache walking, better sitting | Lumbar spinal stenosis | CHRONIC | lb_pain | T2 |
| 7 | lb_post_discectomy | Back surgery (disc) | Post-microdiscectomy | POST-SURGICAL | lb_pain | T2 |
| 8 | lb_fusion | Spinal fusion / rods | Lumbar fusion with hardware | STRUCTURAL | lb_pain | T2 |
| 9 | lb_cauda_equina_flag | — (not selectable; red-flag only) | Suspected cauda equina | — | lb_pain | T3 |

### Hip / Thigh
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | hip_pain | Hip pain | Hip-related pain | Umbrella | null | T1 |
| U | thigh_strain | Pulled thigh muscle | Thigh muscle strain | Umbrella | null | T1 |
| 1 α | hip_gluteal_tendinopathy | Outside-hip pain lying on it | Gluteal tendinopathy (GTPS) | CHRONIC | hip_pain | T1 |
| 2 α | hip_fais | Front-of-hip pinch in deep squats | FAI syndrome | CHRONIC | hip_pain | T1 |
| 3 | hip_adductor_groin | Inner-groin pain | Adductor-related groin pain | CHRONIC | hip_pain | T1 |
| 4 | hip_oa | Hip arthritis | Hip osteoarthritis | CHRONIC | hip_pain | T1 |
| 5 | hip_proximal_hamstring | Sit-bone pain sitting/lunging | Proximal hamstring tendinopathy | CHRONIC | hip_pain | T1 |
| 6 | hip_iliopsoas | Front-of-hip pain lifting knee | Iliopsoas-related groin pain | CHRONIC | hip_pain | T1 |
| 7 α | thigh_hamstring_strain | Pulled hamstring | Hamstring strain injury | ACUTE | thigh_strain | T1 (T2 if bruising/pop) |
| 8 | thigh_quad_strain | Pulled quad | Quadriceps strain | ACUTE | thigh_strain | T1 |
| 9 | hip_dysplasia | Shallow hip socket | Hip dysplasia (borderline/mild) | STRUCTURAL | hip_pain | T2 |
| 10 | hip_post_arthroscopy | Hip arthroscopy | Post-hip arthroscopy | POST-SURGICAL | hip_pain | T2 |
| 11 | hip_replacement | Hip replacement | Total hip arthroplasty (long-term) | STRUCTURAL | hip_pain | T2 |
| 12 | hip_femoral_neck_bsi | — (red-flag only) | Femoral neck bone stress injury | — | hip_pain | T3 |

### Knee
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | kn_pain | Knee pain | Knee pain | Umbrella | null | T1 |
| 1 α | kn_pfp | Pain around/behind kneecap | Patellofemoral pain | CHRONIC | kn_pain | T1 |
| 2 α | kn_patellar_tendinopathy | Pain just below kneecap jumping | Patellar tendinopathy | CHRONIC | kn_pain | T1 |
| 3 | kn_itbs | Outside-knee pain on runs | Iliotibial band syndrome | CHRONIC | kn_pain | T1 |
| 4 | kn_oa | Knee arthritis | Knee osteoarthritis | CHRONIC | kn_pain | T1 |
| 5 | kn_meniscus_degen | Knee catches/twinges twisting | Degenerative meniscal tear | CHRONIC | kn_pain | T1 (T2 if locking) |
| 6 | kn_post_aclr | ACL reconstruction | Post-ACL reconstruction | POST-SURGICAL | kn_pain | T2 |
| 7 | kn_acl_deficient | Torn ACL, never repaired | ACL-deficient knee | STRUCTURAL | kn_pain | T2 |
| 8 | kn_mcl_sprain | Inside-knee sprain | MCL sprain | ACUTE | kn_pain | T2 |
| 9 | kn_quad_tendinopathy | Pain just above kneecap | Quadriceps tendinopathy | CHRONIC | kn_pain | T1 |
| 10 | kn_patellar_instability | Kneecap has popped out | Patellar instability | CHRONIC | kn_pain | T2 |
| 11 | kn_pes_anserine | Inside-shin-below-knee pain | Pes anserine pain | CHRONIC | kn_pain | T1 |
| 12 | kn_fat_pad | Pain under kneecap when straightening hard | Infrapatellar fat pad irritation | CHRONIC | kn_pain | T1 |
| 13 | kn_osgood_residual | Bony lump below kneecap | Osgood–Schlatter residual ossicle | STRUCTURAL | kn_pain | T1 |
| 14 | kn_post_menisc | Meniscus surgery | Post-meniscectomy/repair | POST-SURGICAL | kn_pain | T2 |
| 15 | kn_replacement | Knee replacement | Total knee arthroplasty (long-term) | STRUCTURAL | kn_pain | T2 |

### Ankle / Foot / Shin
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | an_pain | Ankle pain / stiffness | Ankle/foot pain | Umbrella | null | T1 |
| U | shin_pain | Shin pain | Exercise-related leg pain | Umbrella | null | T2 |
| 1 α | an_achilles_mid | Achilles pain mid-tendon | Midportion Achilles tendinopathy | CHRONIC | an_pain | T1 |
| 2 α | an_plantar_heel | Heel pain first steps in morning | Plantar heel pain / plantar fasciitis | CHRONIC | an_pain | T1 |
| 3 α | an_lateral_sprain | Rolled my ankle | Acute lateral ankle sprain | ACUTE | an_pain | T1 (T2 if can't weight-bear) |
| 4 | an_cai | Ankle keeps rolling | Chronic ankle instability | CHRONIC | an_pain | T1 |
| 5 α | shin_mtss | Sore along inside of shin | Medial tibial stress syndrome | CHRONIC | shin_pain | T1 |
| 6 α | shin_bsi_lowrisk | Stress reaction/fracture (shin or foot shaft) | Low-risk tibial/metatarsal BSI | ACUTE | shin_pain | T2 |
| 7 | an_achilles_insertional | Achilles pain at the heel bone | Insertional Achilles tendinopathy | CHRONIC | an_pain | T1 |
| 8 | an_calf_strain | Pulled calf | Calf (gastroc/soleus) strain | ACUTE | an_pain | T1 |
| 9 | an_post_tib | Inside-ankle pain, arch dropping | Tibialis posterior tendinopathy | CHRONIC | an_pain | T2 |
| 10 | an_anterior_impingement | Front-of-ankle pinch in deep squat | Anterior ankle impingement | CHRONIC | an_pain | T1 |
| 11 | an_limited_df_orif | Stiff ankle after broken ankle/plates | Post-fracture ankle with hardware, fixed DF loss | STRUCTURAL | an_pain | T1 |
| 12 | an_hallux_rigidus | Stiff big toe | Hallux rigidus / 1st MTP OA | STRUCTURAL | an_pain | T1 |
| 13 | an_mortons | Burning between toes | Morton's neuroma | CHRONIC | an_pain | T1 |
| 14 | an_achilles_rupture | Achilles rupture (repaired or not) | Post-Achilles rupture | POST-SURGICAL | an_pain | T2 |
| 15 | shin_cecs | Shins tighten and burn at same point every run | Chronic exertional compartment syndrome | CHRONIC | shin_pain | T2 |
| 16 | shin_bsi_highrisk | — (red-flag only) | High-risk BSI (anterior tibia, navicular, 5th MT) | — | shin_pain | T3 |

### Systemic
| # | id | Chip | Clinical | Category | Parent | Tier |
|---|---|---|---|---|---|---|
| U | sys_joints | Joints in general | Systemic joint conditions | Umbrella | null | T1 |
| 1 α | sys_hypermobility | Very bendy / hypermobile | Generalised joint hypermobility / HSD / hEDS | STRUCTURAL | sys_joints | T1 |
| 2 | sys_oa_multi | Arthritis in several joints | Multi-joint osteoarthritis | CHRONIC | sys_joints | T1 |
| 3 | sys_pelvic_floor | Leaking or heaviness when lifting/running | Pelvic floor dysfunction | CHRONIC | sys_joints | T1 |
| 4 | sys_hardware | Metal plates/screws/rods somewhere | Prior surgery with retained hardware | STRUCTURAL | sys_joints | T1 |
| 5 | sys_osteoporosis | Low bone density | Osteopenia/osteoporosis | STRUCTURAL | sys_joints | T2 |
| 6 | sys_inflammatory | Inflammatory arthritis (RA, axSpA) | Inflammatory arthritis | CHRONIC | sys_joints | T2 |
| 7 | sys_reds | Missed periods / under-fuelling + stress fractures | Relative energy deficiency in sport | CHRONIC | sys_joints | T3 for injury plan |

Total: 104 rows, made up of 18 umbrellas, 82 selectable specifics and 4 red-flag-only entries.

## A2. PART 2 — Per-Entry Specification

### A2.1 Alpha specifics (full specification)

#### Patellar tendinopathy — `kn_patellar_tendinopathy`
- **Clinical / category:** Patellar tendinopathy · CHRONIC · parent kn_pain · T1
- **One-liner:** Risk lives in fast, springy loading of the tendon just below the kneecap: jumps, bounds and quick changes of direction.
- **Self-ID cues:** "Pain is a pinpoint just under my kneecap" · "It hurts at the start of a session, eases, then is worse the next day" · "Jumping or a deep single-leg squat brings it on"
- **Core cue:** Slow and heavy is your friend; fast and springy is earned. Keep tendon pain at or below 3/10 during work and back to baseline by the next morning.
- **Warm-up (2–3 min):** wall-sit or Spanish squat isometric, 2×30–45 s → bodyweight box squats to a comfortable depth.
- **Do more of:** isometric Spanish squat or leg extension (4–5×30–45 s, daily in irritable phases) · slow leg press / split squat (3–4×8–15, 3×/wk) · calf and hip strength work.
- **Avoid (flag, don't block):** jumps, depth drops and bounding (high tendon energy storage) · high-volume sprinting or cutting while irritable · sudden spikes in stair or hill volume.
- **Modify:** box jump → step-up with a slow lower · Olympic catch → high pull or pull from blocks · running intervals → continuous easy running at flat pace · deep loaded squat → depth that keeps pain ≤3/10.
- **In-workout cues:** pre-session "Tendon check: rate the single-leg decline squat 0–10" · per-exercise on any jump "Tendon-loading move — earned at stage 3" · pain_threshold ">5/10 or worse next morning → drop back one stage".
- **Red flags:** sudden pop with loss of the ability to straighten the knee · swelling with heat and fever · night pain unrelated to activity.
- **Rehab progression** (follows Breda 2021's four stages, 24 weeks total):
  - Protect (weeks 0–2): goal is to settle pain. Isometric Spanish squat or leg extension 5×45 s at 70% effort, daily. Progress when single-leg decline squat pain is ≤3/10.
  - Restore range: not a separate phase for this condition. Range is rarely lost, so this folds into protect.
  - Build capacity (weeks 2–12): isotonic leg press, split squat and leg extension, 3–4×15 progressing to 4×6–8 heavy, 3×/wk. Progress when 24-hour pain is stable at the higher load.
  - Return to load (weeks 8–20): energy storage. Pogo hops 3×10 → box jumps 3×5 → bounding, 2–3×/wk on non-heavy days. Progress when the single-leg hop is pain ≤3/10 with no next-day flare.
  - Maintain: heavy slow leg work 2×/wk plus sport-specific plyometrics.
- **Running:** usually tolerated at easy pace. Hold hills and intervals until stage 3. Treat downhill as a jump-like load.
- **Interactions:** + PFP → both favour hip and quad strength; PFP may limit depth, so let the lower pain cap set depth · + Achilles tendinopathy → stage plyometrics for the slower-recovering tendon.
- **Evidence:** B — Breda et al., BJSM 2021 (RCT, n=76; return to sport 43% vs 27%); pain thresholds from the Silbernagel model.

#### Patellofemoral pain — `kn_pfp`
- **Clinical / category:** Patellofemoral pain · CHRONIC · parent kn_pain · T1
- **One-liner:** Risk lives in loading the kneecap at depth: deep knee bend under load, stairs, and long downhills.
- **Self-ID cues:** "Ache around or behind my kneecap" · "Sitting with bent knees in the cinema hurts" · "Stairs down and squats are the worst"
- **Core cue:** Strengthen hips and thighs and let pain set your depth. A little ache (≤3/10) that settles is fine.
- **Warm-up:** banded side-steps 2×10 each way → box squats to a pain-free depth.
- **Do more of:** posterolateral hip work (side-lying abduction, clamshell, hip thrust 3×10–15) · knee-targeted work (leg press/squat in a tolerable range, leg extension 3×10–15) — 3×/wk for at least 6 weeks.
- **Avoid:** deep loaded knee flexion past the pain-free depth · high-volume downhill running · long runs well above usual distance.
- **Modify:** back squat → box squat to set depth · lunge → reverse lunge, short stride · downhill runs → flat or uphill · leg extension → limit to the tolerable arc.
- **In-workout cues:** pre "Depth is set by your knee today" · per-exercise on squats/lunges "Stop at your pain-free depth" · pain_threshold ">3/10 → reduce depth or load".
- **Red flags:** locking or giving way · a swollen, hot knee · pain after a twisting injury with swelling within hours.
- **Rehab:**
  - Protect (weeks 0–2): goal is to calm the knee. Hip-targeted work first, then pain-free isometric quad. Progress when stairs pain is ≤3/10.
  - Restore: not usually needed.
  - Build (weeks 2–8): combined hip + knee, 3×10–15 at RPE 7, 3×/wk. Progress when squat depth improves without a flare.
  - Return to load (weeks 6–12): running and plyometrics progressed in frequency, then intensity, then duration.
  - Maintain: hip and knee strength 2×/wk.
- **Running:** reduce volume to a pain ≤3/10 level and prefer flat surfaces. Increase step rate modestly (a coaching default, not a CPG recommendation). Delay downhill.
- **Interactions:** + Knee OA → same plan, slower progression · + Hip FAIS → both like hip strength; FAIS limits deep hip flexion, so take the shallower depth.
- **Evidence:** A — Willy et al., JOSPT 2019 CPG (combined hip- and knee-targeted exercise preferred; hip-targeted can be preferred early). JOSPT 2018 Perspectives: hip abductors, lateral rotators and extensors plus knee, 3×/wk for at least 6 weeks.

#### Midportion Achilles tendinopathy — `an_achilles_mid`
- **Clinical / category:** Midportion Achilles tendinopathy · CHRONIC · parent an_pain · T1
- **One-liner:** Risk lives in fast, springy calf loading, such as hops, sprints and hills, when it outpaces what the tendon has been trained for.
- **Self-ID cues:** "Pain and thickening a few centimetres above the heel" · "Stiff first thing in the morning" · "Eases as I warm up, worse later"
- **Core cue:** Keep loading the calf. Pain up to 5/10 during and after is OK if it settles by morning.
- **Warm-up:** double-leg calf raises 2×15 → single-leg calf raises 1×10 → ankle pogos only once in stage 3.
- **Do more of:** single-leg calf raises straight and bent knee (3×15 → loaded 3×8, every other day) · seated soleus raise · hip and quad strength.
- **Avoid:** hill repeats and sprints while irritable · jump rope / pogos before stage 3 · sudden volume spikes or a switch to minimalist shoes.
- **Modify:** intervals → easy continuous running · hill reps → flat tempo · box jumps → slow step-ups · skipping → bike intervals.
- **In-workout cues:** pre "Morning Achilles stiffness 0–10?" · per-exercise on plyometrics "Earned in stage 3" · pain_threshold ">5/10 or next morning worse → step back".
- **Red flags:** sudden "kicked in the heel" pop, inability to rise on tiptoe · calf swelling, warmth and redness (rule out DVT) · symptoms after a fluoroquinolone antibiotic.
- **Rehab** (follows Silbernagel's phased protocol):
  - Protect (weeks 1–2): learn the pain-monitoring model; double-leg raises 3×15 daily. Progress when 10 single-leg raises are tolerable.
  - Build (weeks 2–5): single-leg raises 3×15, eccentrics, daily. Progress once pain stays within the model.
  - Return to load (weeks 3–12): loaded raises 3×8–12, quick rebounds and plyometrics; running per the table below. Progress when 25 pain-free single-leg hops are achieved.
  - Maintain (3–6 months): heavy calf work 2–3×/wk.
- **Running:**
  - Volume: hold, or cut to a level where the 24-hour rule holds.
  - Surface: flat and firm-even.
  - Pace: easy before fast.
  - Hills: last.
  - Intervals: once hops are pain-free.
  - Light activities (pain 1–2) can be daily; medium activities (pain 2–3) need 2 recovery days, per the Silbernagel & Crossley 2015 return-to-sport framework.
- **Interactions:** + Plantar heel pain → both like calf strength; manage total foot load together · + Hypermobility → favour slow heavy over long stretching.
- **Evidence:** A — Chimenti et al., JOSPT 2024 CPG (clinical diagnosis: localised pain more than 2 cm above the insertion, provoked by tendon loading). Silbernagel 2007 RCT; Silbernagel & Crossley JOSPT 2015.

#### Plantar heel pain — `an_plantar_heel`
- **Clinical / category:** Plantar fasciitis / plantar heel pain · CHRONIC · parent an_pain · T1
- **One-liner:** Risk lives in repeated push-off and impact through the underside of the heel, especially after rest.
- **Self-ID cues:** "The first steps out of bed are agony" · "Pain on the inside of my heel underneath" · "It hurts after sitting, then eases"
- **Core cue:** Load the foot slowly and keep the first steps gentle. Volume spikes are the enemy.
- **Warm-up:** calf and plantar fascia stretch 2×30 s → towel-curls or short-foot exercise 1×10 → calf raises 1×15.
- **Do more of:** high-load single-leg calf raise with toes on a towel (3×12, every other day; app default from tendon loading, not a CPG item) · calf stretching · intrinsic foot strength.
- **Avoid:** barefoot jumping or skipping on hard floors · sudden mileage increases · prolonged barefoot standing.
- **Modify:** box jumps → step-ups · long runs → split runs or cross-training · barefoot lifting → supportive shoe.
- **In-workout cues:** pre "First-step pain this morning?" · per-exercise on jumps "Heel-loading move" · pain_threshold ">5/10 or worse next morning → cut volume".
- **Red flags:** heel pain with numbness/tingling · pain on squeezing the heel bone (possible calcaneal stress fracture) · bilateral heel pain with morning stiffness elsewhere.
- **Rehab:**
  - Protect (weeks 0–2): stretching, orthoses or taping as needed. Night splint for 1–3 months if first-step pain is consistent.
  - Build (weeks 2–8): progressive calf and foot loading.
  - Return to load (weeks 6–12): build running by volume first.
  - Maintain: calf strength 2×/wk.
- **Running:** reduce volume, prefer softer, even surfaces, keep easy pace. Hills and intervals come last.
- **Interactions:** + Achilles → coordinate total calf load · + Hallux rigidus → avoid toe-extension-heavy drills.
- **Evidence:** A/B — Koc et al., JOSPT 2023 CPG (manual therapy, stretching, foot orthoses; night splints 1–3 months for consistent first-step pain). The high-load calf dose is a D-grade app default.

#### Lateral ankle sprain (acute) — `an_lateral_sprain`
- **Clinical / category:** Acute lateral ankle ligament sprain · ACUTE · parent an_pain · T1 (T2 if the person can't weight-bear 4 steps)
- **One-liner:** Risk lives in the rolled-in, toes-down ankle on uneven ground or a landing, the exact position that sprained it.
- **Self-ID cues:** "I rolled it in the last few weeks" · "Swelling on the outside bone" · "It feels wobbly on uneven ground"
- **Core cue:** Move it early, load it supported, and train balance every day.
- **Warm-up:** ankle alphabet → calf raises 1×15 → single-leg balance 3×20 s.
- **Do more of:** single-leg balance progressions (daily) · calf and peroneal strength (3×15) · hop and land drills later.
- **Avoid:** cutting or lateral bounding before hop tests are pain-free · uneven trail running in the first weeks · unsupported jumping.
- **Modify:** lateral bounds → forward hops · trail → road or treadmill · jumps → brace or tape plus low drop.
- **In-workout cues:** pre "Brace or tape for agility today" · per-exercise on cutting "Ankle-sensitive move" · pain_threshold ">3/10 or swelling next day → hold".
- **Red flags:** can't take 4 steps · bony tenderness at the back of either ankle bone or the base of the 5th metatarsal (fracture rule-out) · severe swelling or deformity.
- **Rehab:**
  - Protect (weeks 0–2): supported weight-bearing, brace.
  - Restore (weeks 1–3): dorsiflexion range.
  - Build (weeks 2–6): strength and balance.
  - Return to load (weeks 4–12): hop, agility.
  - Maintain: balance 2–3×/wk. A post-acute period of impairment can last up to 12 months.
- **Running:** straight-line, even surfaces first; trail and cutting last.
- **Interactions:** + CAI → this becomes CAI if giving-way recurs.
- **Evidence:** A — Martin et al., JOSPT 2021 CPG revision (early supported weight-bearing; exercise; braces/taping to prevent recurrence).

#### Low-risk bone stress injury — `shin_bsi_lowrisk`
- **Clinical / category:** Low-risk tibial/metatarsal BSI · ACUTE · parent shin_pain · T2
- **One-liner:** Risk lives in repeated impact on a bone that is mid-repair; for now, pain is a stop sign, not a guide.
- **Self-ID cues:** "A doctor said stress reaction or stress fracture in my shin or foot" · "One spot on the bone is tender to press" · "Pain started earlier and earlier in my runs"
- **Core cue:** Pain-free means go, any pain at the site means stop. Volume comes back before speed.
- **Warm-up:** brisk walk 5 min → calf raises 1×15 pain-free.
- **Do more of:** pain-free strength work for the whole limb · cycling, swimming or deep-water running · fuelling well.
- **Avoid:** any running or jumping that causes pain at the site · speed work before full volume returns · back-to-back run days early on.
- **Modify:** runs → walk–run per the table below · jumps → step-ups · intervals → bike intervals.
- **In-workout cues:** pre "Any pain at the bone today? If yes, no run" · pain_threshold "any site pain → stop, repeat previous level next time".
- **Red flags:** pain at the front of the shin, top of the foot (navicular), outer foot (5th metatarsal) or groin/hip (T3) · night pain · a second stress fracture or missed periods (REDs screen).
- **Rehab:**
  - Protect: reduce load until pain-free walking.
  - Build: strength.
  - Return to load: run once pain-free for 5 consecutive days and able to hop repeatedly without pain. Walk–run → 30 min at 50% → 60% → 80% → 90% → full pace → consecutive days.
  - Maintain: progressive bone loading (jump training) once running is restored.
- **Running:** the walk–run table above. Progression is driven by symptoms, not performance. Any site pain stops the session and the next session repeats the previous level.
- **Interactions:** + REDs flag → T3 for injury plan · + MTSS → manage as BSI if focal tenderness.
- **Evidence:** B — Warden, Edwards & Willy, JOSPT 2021; Warden, Davis & Fredericson, JOSPT 2014 graded return table; Hoenig et al. 2023 (site-based risk).

#### Hamstring strain — `thigh_hamstring_strain`
- **Clinical / category:** Hamstring strain injury · ACUTE · parent thigh_strain · T1 (T2 if there was a pop with large bruising)
- **One-liner:** Risk lives in fast running and long-length hamstring loading, like the late swing of a sprint or a heavy RDL at stretch.
- **Self-ID cues:** "Sharp grab at the back of my thigh while sprinting" · "It hurts to stretch it or bend my knee against resistance" · "Bruising lower down the leg"
- **Core cue:** Build hamstring strength at length gradually; sprinting is the final exam.
- **Warm-up:** glute bridge 1×10 → bridge walk-outs 1×6 → A-skips.
- **Do more of:** Nordic hamstring curls (prevention phase: 2–3×/wk, low reps) · RDLs at a pain-free length · bridges and isometrics early on.
- **Avoid:** max sprinting before pain-free progressive runs · aggressive static stretching early · heavy RDLs at full stretch early.
- **Modify:** sprints → tempo runs at 60–80% · RDL → reduced range · Nordic → assisted with a band.
- **In-workout cues:** pre "Hamstring check: pain-free bridge and walk?" · per-exercise on sprints "Final-exam movement" · pain_threshold ">2/10 in the strain → back off".
- **Red flags:** a pop with large bruising or a palpable gap (possible avulsion) · sciatic-type tingling · inability to walk normally.
- **Rehab:**
  - Protect (days 0–5): walking, isometrics.
  - Restore (weeks 1–2): pain-free range.
  - Build (weeks 1–4): bridges, RDLs, Nordics.
  - Return to load (weeks 3–8): graded running to max speed.
  - Maintain: Nordics.
- **Running:** reintroduce at easy pace, then progress speed in about 10% steps (app default), flat surfaces first.
- **Interactions:** + Proximal hamstring tendinopathy → limit deep hip flexion with load.
- **Evidence:** B for prevention — van Dyk, Behan & Whiteley, BJSM 2019 meta-analysis of 8,459 athletes (adding Nordics cut hamstring injuries by 51%). The rehab sequence is C.

#### Gluteal tendinopathy — `hip_gluteal_tendinopathy`
- **Clinical / category:** Gluteal tendinopathy / GTPS · CHRONIC · parent hip_pain · T1
- **One-liner:** Risk lives in the hip dropping across the body, as in crossed legs, side-lying on the sore side, or hanging on one hip, which squeezes the tendon against the bone.
- **Self-ID cues:** "Pain on the outside bony point of my hip" · "I can't lie on that side at night" · "Stairs and standing on one leg hurt"
- **Core cue:** Keep the knee in line with the hip and don't let it sag inwards; strength without squeeze.
- **Warm-up:** isometric hip abduction against a wall 3×30 s → glute bridge 1×10.
- **Do more of:** isometric abduction · bridges and squat variations · step-ups with level-pelvis control (3×10–15, 3×/wk, at least 8 weeks).
- **Avoid:** crossed-leg or deep-adduction stretches (ITB/piriformis) · side-lying clamshells with the leg crossed · prolonged single-leg hanging or crossed-leg sitting.
- **Modify:** pigeon stretch → none, or neutral hip flexor stretch · side-lying abduction → standing or supine isometric · lunges → split squat with a level pelvis.
- **In-workout cues:** pre "No crossed-leg stretches today" · per-exercise on stretching "Compression position" · pain_threshold ">5/10 or night pain worse → reduce".
- **Red flags:** groin pain on weight-bearing (hip joint or femoral neck) · night pain unrelated to lying on it · fever.
- **Rehab:**
  - Protect (weeks 0–2): education plus isometrics.
  - Build (weeks 2–8): progressive functional strength.
  - Return to load (weeks 6–12): running, hills.
  - Maintain: 2×/wk.
- **Running:** narrow (crossover) gait loads the tendon, so widen the step slightly. Reduce hills and cambered roads.
- **Interactions:** + Hip OA → both like strength; OA tolerates range work, so keep the adduction cap.
- **Evidence:** A/B — Mellor et al., BMJ 2018 LEAP RCT (education + exercise 77.3% success at 8 weeks vs 58.5% injection vs 29.4% wait-and-see; 14 sessions over 8 weeks).

#### Chronic/recurrent nonspecific low back pain — `lb_chronic_nonspecific`
- **Clinical / category:** Chronic nonspecific LBP · CHRONIC · parent lb_pain · T1
- **One-liner:** Risk lives in sudden spikes in what the back is asked to do, more than in any single position; fatigue plus load plus a big jump in volume is the usual trigger.
- **Self-ID cues:** "My back flares a few times a year" · "Stiff after sitting, better once moving" · "No pain down the leg"
- **Core cue:** Your back is strong and can be loaded. Progress gradually and keep moving through flares.
- **Warm-up:** cat-camel 1×10 → bird-dog 1×6 each → hip hinge drill 1×10.
- **Do more of:** trunk strength and endurance (side plank, bird-dog, back extension 3×8–12) · deadlift variations progressed gradually · aerobic work (walking, cycling).
- **Avoid:** sudden jumps in deadlift/squat volume or load · max-effort spinal loading when fatigued or in a flare · high-volume loaded flexion when irritable.
- **Modify:** conventional deadlift → trap-bar or RDL at tolerable range · back squat → goblet or front squat · sit-ups → dead bug.
- **In-workout cues:** pre "Back check 0–10; flare day = lighter version" · per-exercise on heavy hinges "Back-loading move" · pain_threshold ">5/10 or next day worse → drop load 20–30%".
- **Red flags:** numbness in the saddle area, new bladder/bowel change, progressive leg weakness (T3, emergency) · fever, unexplained weight loss, history of cancer · severe night pain.
- **Rehab:**
  - Protect (flare, days 0–7): walking, gentle movement.
  - Restore (weeks 1–2): mobility.
  - Build (weeks 2–12): progressive strength, 2–3×/wk.
  - Return to load: full lifts.
  - Maintain: ongoing.
- **Running:** usually helpful. Reduce volume during a flare; no surface restriction.
- **Interactions:** + Hip FAIS → limit deep hip flexion; hinge from the hips within range.
- **Evidence:** A — George et al., JOSPT 2021 CPG revision (chronic LBP: trunk strength and endurance, multimodal, aerobic and general exercise, grade A). In Fernández-Rodríguez and colleagues' JOSPT 2022 network meta-analysis, Pilates had the highest SUCRA likelihood of reducing pain (93%) and disability (98%).

#### Rotator cuff–related shoulder pain — `sh_rcrsp`
- **Clinical / category:** RCRSP · CHRONIC · parent sh_impingement · T1
- **One-liner:** Risk lives in loaded arm elevation, where the arm goes up and out while the cuff is under-strength for the job.
- **Self-ID cues:** "Pain on the outside of my upper arm lifting overhead" · "Painful arc halfway up" · "Lying on that shoulder aches"
- **Core cue:** Strengthen into the pain-free range and progress load. A tolerable ache (≤4/10 that settles) is OK.
- **Warm-up:** banded external rotation 2×15 → scap push-ups 1×10 → light landmine press.
- **Do more of:** external rotation strength (side-lying or cable 3×10–15) · rows · landmine/incline press (3×/wk, 12+ weeks).
- **Avoid:** behind-the-neck press/pulldown · heavy overhead press through a painful arc · high-volume dips at end range.
- **Modify:** OHP → landmine press · pulldown behind neck → in front · dips → close-grip bench.
- **In-workout cues:** pre "Shoulder check: painful arc 0–10" · per-exercise on overhead "Elevation load" · pain_threshold ">4/10 or not settled within the day → regress".
- **Red flags:** sudden weakness after a fall · night pain plus weight loss · neck pain with arm tingling.
- **Rehab:**
  - Protect (weeks 0–2): isometrics.
  - Restore (weeks 1–4): pain-free range.
  - Build (weeks 2–12): progressive resistance.
  - Return to load (weeks 8–16): overhead lifts.
  - Maintain: cuff work 2×/wk.
- **Running:** not applicable.
- **Interactions:** + Anterior instability → avoid behind-neck positions anyway; no conflict.
- **Evidence:** A/B — JOSPT 2024 FITT systematic review (exercise effective; no consensus on type); JOSPT 2026 meta-analysis (active and strength exercise recommended for strength deficits). Raulline Ullern and colleagues' 2025 scoping review of 28 RCTs (BMC Musculoskeletal Disorders) found no consensus on pain allowance. Two approaches emerged: choosing exercises that do not reproduce familiar pain, or allowing localised pain up to 4/10 (VAS); 8 of the 28 RCTs (29%) used an individualised pain limit.

#### Anterior shoulder instability — `sh_ant_instability`
- **Clinical / category:** Anterior glenohumeral instability · CHRONIC · parent sh_unstable · T1 (T2 if first dislocation <6 weeks)
- **One-liner:** Risk lives in abduction plus external rotation — arm out to the side and rotated back, under load.
- **Self-ID cues:** "My shoulder has popped out the front" · "Arm back in a throwing position feels like it'll slip" · "Wide-grip bench at the bottom feels scary"
- **Core cue:** Keep loaded elbows in front of the body line; no apprehension allowed, ever.
- **Warm-up:** ER/IR band work at the side 2×15 → serratus wall slide 1×10 → light bench to a shallow depth.
- **Do more of:** cuff strength (3×10–15) · scapular stability · progressive closed-chain work in safe ranges.
- **Avoid:** behind-the-neck press/pulldown · wide-grip bench to the chest · deep dips · snatch-grip overhead work.
- **Modify:** bench → moderate grip with a floor/board stop · dips → close-grip bench · BTN pulldown → front pulldown, neutral grip.
- **In-workout cues:** pre "Elbows in front today" · per-exercise on any abduction-ER exercise "Apprehension position" · pain_threshold "any apprehension → stop the set".
- **Red flags:** new numbness in the arm after a dislocation · a dislocation that doesn't reduce · recurrent subluxation with minimal load.
- **Rehab:**
  - Protect: sling per clinician.
  - Restore: range short of apprehension.
  - Build: strength into progressively more abduction.
  - Return to load: overhead and bench at full range only if there is no apprehension.
  - Maintain: cuff work.
- **Running:** not applicable.
- **Interactions:** + Elbow hyperextension → both favour soft lockout, no conflict · + Hypermobility → strength-first, avoid end-range stretching.
- **Evidence:** C — mechanism and positions are well established clinically, but no CPG was retrieved in this research. Physio review required before alpha.

#### Lateral elbow tendinopathy — `el_lateral_tendinopathy`
- **Clinical / category:** Lateral elbow tendinopathy · CHRONIC · parent el_pain · T1
- **One-liner:** Risk lives in hard gripping with the wrist bent back, as in heavy holds, pull-ups and carries.
- **Self-ID cues:** "Outside-elbow pain lifting a kettle or mug" · "Grip feels weaker" · "Pulling and deadlift grip hurt"
- **Core cue:** Grip just hard enough, and use straps on heavy pulls while you build tendon capacity.
- **Warm-up:** wrist extension isometric 3×30 s → light wrist curls.
- **Do more of:** wrist extensor isometrics and slow eccentrics (3×15, daily → 3×/wk) · grip strength · shoulder and scapula work.
- **Avoid:** max-grip holds with an extended wrist (heavy farmer's carry, dead hang) · thick-bar work · high-volume reverse curls.
- **Modify:** deadlift → straps · pull-ups → neutral grip · farmer's carry → trap-bar carry with straps.
- **In-workout cues:** pre "Straps on for heavy pulls" · per-exercise on grip "Grip-load move" · pain_threshold ">5/10 or next day worse → back off; if >7/10 the elbow is highly irritable, so use isometrics only".
- **Red flags:** tingling in the hand · a locking elbow · swelling after trauma.
- **Rehab:**
  - Protect: isometrics, taping when irritable.
  - Build (weeks 2–12): progressive loading.
  - Return to load: full grip.
  - Maintain: forearm work.
- **Running:** not applicable.
- **Interactions:** + Wrist pain → check grip width.
- **Evidence:** A/B — Lucado et al., JOSPT 2022 CPG (irritability classification; mobilisation; rigid taping for irritable cases).

### A2.2 STRUCTURAL / PERMANENT entries (full specification; no rehab phases, no end date)

**Design rule for this category:** the entry shows a permanent cue on every relevant session, never an "end date". Its warm-up rehearses the cue so the cue is practised before it's loaded. Its do-more-of list is short, at 3–4 items. Evidence for these entries is mostly C/D. They are anatomical, not trial-driven, so they need physio sign-off.

#### Elbow hyperextends (old fracture) — `el_hyperextension` (the worked example, retained)
- **Clinical:** Cubitus recurvatum / post-fracture malunion with hyperlaxity · STRUCTURAL · parent el_pain · T1
- **One-liner:** Risk lives in the last few degrees of straightening under load — where the joint, not the muscle, takes the weight.
- **Self-ID cues:** "My elbow bends backwards past straight" · "I broke it as a kid and it healed on its own" · "Locking out on push-ups feels wrong"
- **Core cue:** Soft lockout — stop a few degrees short of straight on every press, carry, hang, and plank. Her straight is slightly bent.
- **Warm-up (2–3 min):** light band pushdowns and curls through mid-range → a few very light presses ending deliberately at the soft lockout.
- **Do more of:** slow eccentric curls (3–4 s down, stop short of straight) · isometric holds near end range, push and pull · grip and forearm work · triceps with the same soft stop.
- **Avoid:** loaded straight-arm work at end range (straight-arm pulldowns, weighted planks on locked arms, overhead carries at full lockout) · fast or ballistic extension under load (snatches, swings with a locked arm).
- **Modify:** bench / OHP / push-up / dip — soft lockout · plank — soft elbows or forearms · carries — soft lockout.
- **In-workout cue:** pre-session "soft lockout today" · per-exercise note on any press or carry.
- **Red flags:** tingling in the ring/little fingers · inner-elbow pain with gripping · the joint giving way or clicking under load.
- **Interactions:** + Wrist pain → check pressing grip width · + Shoulder instability → both favour soft lockout, no conflict · + Hypermobility → identical cue, applied across all joints.
- **Evidence:** D — anatomical reasoning. The hypermobility guidance (Engelbert 2017) supports graduated strengthening.

#### Generalised hypermobility / HSD / hEDS — `sys_hypermobility`
- **Clinical:** Generalised joint hypermobility, hypermobility spectrum disorder, hypermobile EDS · STRUCTURAL · parent sys_joints · T1
- **One-liner:** Risk lives at the end of range under load, where ligaments rather than muscles stop the joint.
- **Self-ID cues:** "I can put my palms flat on the floor and bend my thumb to my wrist" · "Joints click, sublux or feel unstable" · "Stretching feels good but never seems to help"
- **Core cue:** Own the middle, stop before the end; strength over stretch, on every joint, every session.
- **Warm-up:** controlled mid-range movement with a deliberate stop on squats, presses and hinges at 50% load.
- **Do more of:** progressive strength training (the Liaghat 2022 high-load arm: 3×10RM rising to 4×8RM, 3×/wk) · isometrics near end range · balance and proprioception · graded aerobic work.
- **Avoid:** passive end-range stretching (splits, deep shoulder dislocates) · loaded end-range lockouts (elbows, knees) · ballistic end-range work early on.
- **Modify:** static stretching → strength through range · locked-knee RDL → soft knees · long holds at end range → mid-range holds.
- **In-workout cue:** pre-session "Own the middle today" · per-exercise on end-range moves.
- **Red flags:** repeated dislocations · neurological symptoms · dizziness on standing.
- **Interactions:** applies its avoid list to every other selected entry.
- **Evidence:** B/C — Engelbert et al. 2017 (graduated exercise; no convincing evidence for specific types); Liaghat et al. BJSM 2022 RCT, n=100 (high-load statistically superior; WOSI −174.5, below the 250-point minimal important difference in the intention-to-treat analysis); House et al. 2021 systematic review (controlled-trial evidence is weak); Beighton ≥5 up to age 50 and ≥4 over 50 (Malfait 2017).

#### Elbow won't fully straighten — `el_fixed_flexion`
- **Core cue:** Your end range is your lockout; don't force it straight under load. **One-liner:** Risk lives in forcing extension against the bony block. **Warm-up:** light presses to your own end-point. **Do more of:** triceps in your range · grip work · gentle active extension. **Avoid:** forced lockout under load · ballistic extension. **Modify:** dips and push-ups → stop at your end-point; Olympic lifts → power variations or blocks. **Red flags:** new loss of range, locking. **Evidence:** D.

#### Cervical fusion — `neck_fusion`
- **Core cue:** Turn the body, not the neck, and keep heavy loads off the head and neck. **One-liner:** Risk lives in forcing neck rotation and in loading the segments next to the fusion. **Warm-up:** thoracic rotation and scapular setting. **Do more of:** deep neck flexor endurance · upper-back strength · thoracic mobility. **Avoid:** neck bridges · heavy shrugs with neck flexion · loaded head harness · inverted positions. **Modify:** headstand → none, or forearm plank; heavy shrugs → lighter, neutral neck. **Red flags:** new arm or hand weakness or tingling; balance or gait change (T3). **Evidence:** D; tier T2 (surgeon clearance).

#### Lumbar fusion — `lb_fusion`
- **Core cue:** Brace and hinge from the hips; the levels next to the fusion do extra work, so don't spike volume. **Warm-up:** hip hinge drill, bird-dog. **Do more of:** hip strength · trunk endurance · walking. **Avoid:** loaded end-range spinal flexion · ballistic rotation · max axial loads without clearance. **Modify:** deadlift → trap-bar or rack pull; Russian twist → Pallof press. **Red flags:** cauda equina signs · new leg weakness. **Evidence:** D; T2.

#### Stable low-grade spondylolysis / spondylolisthesis — `lb_spondylolisthesis`
- **Core cue:** Keep the pelvis and ribs stacked under load; don't hang into lower-back arching. **Warm-up:** dead bug, glute bridge. **Do more of:** anti-extension core · hip strength · hip flexor mobility. **Avoid:** loaded lumbar hyperextension (back-bend snatch, overarched overhead press) · high-volume back-extension at end range. **Modify:** OHP → landmine or half-kneeling; back extension → to neutral. **Red flags:** progressive leg symptoms · cauda equina signs. **Evidence:** D; T2.

#### Scoliosis — `th_scoliosis`
- **Core cue:** Train both sides with the same load; let symmetry of effort, not of shape, be the goal. **Warm-up:** side-plank both sides. **Do more of:** unilateral strength both sides · trunk endurance · breathing-based bracing. **Avoid:** nothing is absolutely flagged; flag only painful asymmetric loads. **Modify:** add unilateral variants. **Red flags:** rapid change in curve or new neurological symptoms. **Evidence:** D.

#### Scheuermann's kyphosis — `th_kyphosis`
- **Core cue:** Open the upper back before you load overhead, and overhead within your available range. **Warm-up:** thoracic extension over a foam roller, wall slides. **Do more of:** upper-back strength · thoracic extension mobility · rows. **Avoid:** forcing full overhead lockout positions you can't reach. **Modify:** overhead press → landmine; overhead squat → front squat. **Red flags:** neurological symptoms. **Evidence:** D.

#### Healed AC separation — `sh_ac_old_separation`
- **Core cue:** Keep the bar off the bottom of the bench and the elbows off the bottom of the dip. **Warm-up:** band pull-aparts, light press. **Do more of:** cuff and scapular strength · rows. **Avoid:** deep dips · full-range bench with a wide grip · heavy cross-body work. **Modify:** dips → close-grip push-ups; bench → board press. **Red flags:** new deformity or pain after a fall. **Evidence:** D.

#### Wrist won't bend back fully (old break) — `wr_limited_extension`
- **Core cue:** Change the hand, not the wrist: use handles, fists or straps wherever the wrist would be forced back. **Warm-up:** wrist circles, light rack-position test. **Do more of:** grip strength · forearm work · active wrist range. **Avoid:** forced loaded wrist extension (front rack, push-ups on flat palms, handstands). **Modify:** push-ups → handles or fists; front squat → cross-arm grip or straps; handstand → pike push-up on parallettes. **Red flags:** new numbness in the fingers. **Evidence:** D.

#### Post-fracture ankle with hardware, limited dorsiflexion — `an_limited_df_orif`
- **Core cue:** Elevate your heels or widen your stance so the ankle never has to find range it doesn't have. **Warm-up:** knee-to-wall drill, calf raises. **Do more of:** calf strength · balance · ankle mobility within range. **Avoid:** forced deep dorsiflexion under load (deep squat with knees far forward) · plyometrics without clearance. **Modify:** back squat → heel-elevated squat; lunges → shorter stride. **Red flags:** new swelling or pain at the hardware. **Evidence:** D.

#### Hallux rigidus — `an_hallux_rigidus`
- **Core cue:** Roll off the outside of the toe and stiffen the shoe; don't force the big toe back. **Warm-up:** big-toe active range, calf raises with a reduced toe angle. **Do more of:** calf strength · foot strength. **Avoid:** deep lunges on the back toe · sprinting on the toes · burpees on bare feet. **Modify:** lunges → split squat with the rear foot on a bench in a stiff shoe; sprints → hill sprints in rigid shoes. **Red flags:** acute swelling and redness (gout rule-out). **Evidence:** D.

#### ACL-deficient knee — `kn_acl_deficient`
- **Core cue:** Plant and cut only once strength and hop tests support it; strong hamstrings guard the knee. **Warm-up:** hamstring curls, single-leg balance. **Do more of:** quad and hamstring strength · neuromuscular control · straight-line running. **Avoid:** pivoting and cutting sports without clearance · deep loaded twisting. **Modify:** cutting drills → linear drills; jumps → bilateral landings. **Red flags:** repeated giving way · locking (meniscal). **Evidence:** D; T2.

#### Osgood–Schlatter residual — `kn_osgood_residual`
- **Core cue:** Kneel on a pad or avoid kneeling; everything else is fair game. **Warm-up:** standard. **Do more of:** quad strength · leg press. **Avoid:** direct kneeling (kneeling lunges, ab-wheel from the knees on hard floors). **Modify:** kneeling → pad or standing variant. **Red flags:** acute pain or swelling over the bump. **Evidence:** D.

#### Hip or knee replacement (long-term) — `hip_replacement`, `kn_replacement`
- **Core cue:** Follow your surgeon's position rules; strength, cycling and walking are the backbone. **Warm-up:** stationary bike 3 min. **Do more of:** strength · cycling · balance. **Avoid:** positions the surgeon restricted (e.g., deep hip flexion with internal rotation after some hip approaches) · high-impact running unless cleared. **Modify:** running → cycling or elliptical; deep squats → box squats. **Red flags:** sudden pain, a clunk, a sense of dislocation, fever or wound redness. **Evidence:** D; T2. Osteoarthritis guidance (NICE NG226) supports exercise in general.

#### Hip dysplasia (mild) — `hip_dysplasia`
- **Core cue:** Keep loaded hip extension and wide external rotation controlled; strength over stretch. **Do more of:** glute strength · core. **Avoid:** loaded extreme hip extension or splits. **Modify:** deep lunges → shorter stride. **Red flags:** catching, locking. **Evidence:** D; T2.

#### Retained hardware (generic) — `sys_hardware`
- **Core cue:** Know where your metal is; avoid direct pressure on it and tell the app which joint it is near. **Do more of:** strength around the region. **Avoid:** direct pressure over hardware (bar on a plated clavicle, kneeling on a patellar wire). **Modify:** use pads. **Red flags:** new pain, swelling or redness at the hardware site. **Evidence:** D.

#### Multidirectional instability / hypermobile shoulder — `sh_mdi_hypermobile`
- **Core cue:** Same as hypermobility: own the middle, strength over stretch, at the shoulder. **Do more of:** high-load shoulder strengthening, which the Liaghat 2022 RCT supported in hypermobile shoulders. **Avoid:** end-range hangs and dislocates. **Modify:** dead hang → active scapular hang. **Red flags:** frequent subluxations. **Evidence:** B/C.

#### Osteopenia/osteoporosis — `sys_osteoporosis`
- **Core cue:** Load the bones progressively; avoid loaded spinal flexion and fall-risk tasks. **Do more of:** progressive resistance · impact appropriate to clearance. **Avoid:** loaded spinal flexion (sit-ups, toe-touches with weight). **Modify:** sit-ups → dead bug. **Red flags:** sudden back pain after minor strain (possible vertebral fracture). **Evidence:** D; T2.

### A2.3 Remaining CHRONIC / ACUTE / POST-SURGICAL entries (compact specification)

Each row below provides the chip, one-liner, core cue, key avoid → modify pair, red flag and evidence. The full rehab-phase build for these entries follows the generic phase template in A3.6. They must be physio-reviewed before inclusion.

| id | One-liner (risk lives in…) | Core cue | Key avoid → modify | Red flag | Evidence |
|---|---|---|---|---|---|
| neck_mobility | sustained end-range positions and sudden loaded neck turns | Move often; strength around neck and upper back | heavy shrugs with forward head → neutral-neck shrugs | arm weakness | A (Blanpied 2017 CPG) |
| neck_headache | sustained postures and upper-neck end range | Deep neck flexor endurance | neck bridges → none | sudden severe headache (T3) | A |
| neck_acute_wry | provocative end-range rotation this week | Gentle movement, expect recovery | heavy overhead → light | fever, trauma | B |
| neck_whiplash | high-load neck positions while sensitive | Reassurance: recovery is expected within 2–3 months; minimise collar use | contact/impact → hold | neurological signs | A (Blanpied 2017) |
| neck_radicular | positions that send symptoms further down the arm | No spreading of symptoms | overhead heavy → neutral | progressive weakness | A |
| sh_ac_joint | horizontal adduction and deep bench/dip | Shorter range for presses | deep dips → close-grip bench | deformity | C |
| sh_biceps_slap | loaded shoulder extension and overhead | Control end range | deep dips → floor press | locking/clunking | C |
| sh_cuff_tear_degen | heavy loaded elevation | Strength first, surgeon if weakness | OHP → landmine | sudden weakness | C; T2 |
| sh_post_instability | push-up/bench bottom with posterior load | Shorter range | push-up → incline | recurrent slip | C |
| sh_dislocation_acute | abduction + ER early | Sling per clinician | all overhead → hold | numbness | D; T2 |
| sh_frozen | forcing painful range | Gentle range within comfort | overhead → range-limited | diabetes check | C; T2 |
| sh_post_stabilisation / sh_post_cuff_repair | surgeon protocol phase | Surgeon rules override | per protocol | wound signs | D; T2 |
| el_medial_tendinopathy | gripping with wrist flexion | Straps, isometrics | heavy curls → hammer curls | ulnar tingling | C (extrapolated from LET) |
| el_distal_biceps | heavy supinated curls and chins | Neutral grip | chin-ups → neutral pull-up | pop + bruising (T2) | C |
| el_triceps | heavy lockout | Partial range | skull crushers → cable pushdown | pop | C |
| el_ulnar_nerve | sustained deep elbow flexion | Avoid long bent-elbow holds | deep curls → mid-range | weakness | C; T2 |
| wr_dorsal_impingement | loaded wrist extension | Handles/fists | push-ups → handles | clicking with swelling | D |
| wr_ulnar_tfcc | ulnar deviation + rotation under load | Neutral wrist | front rack → cross-arm | clicking, instability | D |
| wr_dequervain | thumb + wrist deviation | Thumb neutral | hammer curl → strap | swelling | D |
| wr_carpal_tunnel | sustained wrist flexion/extension | Neutral wrist | flexed-wrist holds → straps | thenar wasting | C; T2 |
| wr_sprain_acute | loaded extension early | Protect | push-ups → hold | snuffbox tenderness (scaphoid) | D; T2 |
| wr_thumb_cmc_oa | pinch grip | Thick handles, straps | plate pinch → straps | hot swollen joint | B (NICE NG226 OA exercise) |
| th_mechanical | sustained flexed postures | Move and strengthen | none hard → posture variety | chest pain, fever | C |
| th_rib_costochondral | loaded chest expansion | Gradual pressing | heavy bench → incline DB | chest pain (cardiac) | D; T2 |
| th_pec_strain | heavy bench at bottom | Short range, slow return | bench → floor press | bruising, defect (T2) | D |
| lb_acute_flare | sudden loaded flexion while sore | Keep moving gently | heavy deadlift → walking, light hinge | cauda equina signs | C (George 2021: trunk activation exercise for acute LBP, grade C) |
| lb_radicular | positions that spread leg symptoms | Centralise, don't peripheralise | loaded flexion → neutral | progressive weakness | B |
| lb_si_joint | asymmetric loading early | Symmetric then progress | lunges → split squat | inflammatory signs | D |
| lb_stenosis | prolonged standing/extension | Flexion-friendly cardio | running → cycling | cauda equina | B (George 2012 flexion ex older adults); T2 |
| lb_post_discectomy | surgeon protocol | Trunk endurance per CPG | per protocol | new weakness | B; T2 |
| hip_fais | deep hip flexion with internal rotation | Hip strength ≥3 months; limit depth | deep squat → box squat | locking, groin night pain | B (Kemp 2020 consensus) |
| hip_adductor_groin | sudden adductor stretch/sprint cutting | Adductor strengthening | wide cutting → linear | testicular/hernia signs | C |
| hip_oa | high-impact volume beyond tolerance | Tailored exercise; pain may increase at first | running → cycling (per tolerance) | sudden loss of function | A (NICE NG226) |
| hip_proximal_hamstring | compression at deep hip flexion | Avoid long sitting, deep stretch | deep RDL → partial | sciatic tingling | C |
| hip_iliopsoas | resisted hip flexion at end range | Gradual | hanging leg raises → dead bug | groin night pain | D |
| thigh_quad_strain | kicking/sprinting early | Graded | sprints → tempo | large haematoma | C |
| hip_post_arthroscopy | surgeon protocol | Physio-led rehab | per protocol | wound signs | B (Kemp 2020); T2 |
| kn_itbs | repetitive knee flexion ~20–30° under load | Reduce volume; hip strength | downhill → flat | lateral joint-line swelling | C |
| kn_oa | sustained high load beyond tolerance | Tailored exercise; weight management | deep loaded squats → box squats | locking, hot joint | A (NICE NG226) |
| kn_meniscus_degen | deep loaded twisting | Exercise first | deep pivot → box squat | locking (T2) | C |
| kn_post_aclr | surgeon/physio protocol | Criteria over time | per protocol | swelling, giving way | D; T2 |
| kn_mcl_sprain | valgus and twist early | Brace; progress | cutting → linear | locking | D; T2 |
| kn_quad_tendinopathy | heavy deep knee flexion | Tendon-loading model | deep squat → limited | pop | C (extrapolated) |
| kn_patellar_instability | twisting on a bent knee | Quad and hip strength | cutting → linear | dislocation | D; T2 |
| kn_pes_anserine | repetitive flexion + valgus | Hip strength | deep lunges → short | swelling | D |
| kn_fat_pad | forceful terminal knee extension | Avoid locking out | full leg extension → limited arc | swelling | D |
| kn_post_menisc | surgeon protocol | Protocol | per protocol | swelling | D; T2 |
| an_cai | uneven landings, inversion | Balance daily, brace | trail → road | repeated giving way | A (Martin 2021 CPG) |
| shin_mtss | repetitive impact volume | Reduce volume, strengthen calf | volume spikes → cross-train | focal tenderness (BSI) | C |
| an_achilles_insertional | dorsiflexion compression at insertion | Avoid deep heel drops | deep heel drops → floor-level raises | pop | C |
| an_calf_strain | sudden push-off | Graded | sprint → tempo | DVT signs | C |
| an_post_tib | arch collapse under load | Strengthen, support | long runs → shorter | progressive flatfoot (T2) | D |
| an_anterior_impingement | forced dorsiflexion | Heel lift | deep squat → heel elevated | locking | D |
| an_mortons | forefoot compression | Wider shoe | jumps → low impact | numbness spread | D |
| an_achilles_rupture | surgeon protocol | Protocol | per protocol | re-rupture signs | D; T2 |
| shin_cecs | specific run intensity/duration | Clearance required | runs → cross-train | numbness, foot drop (T2) | D |
| sys_oa_multi | sustained high load beyond tolerance | Tailored exercise | per-joint | hot joint | A (NICE NG226) |
| sys_pelvic_floor | high intra-abdominal pressure with impact | Exhale on effort, pelvic floor training | jumps → low impact | prolapse, bleeding | C (Tung et al. 2024 SR: pelvic floor dysfunction in 50% of female vs 9.3% of male lifters) |
| sys_inflammatory | flare periods | Exercise between flares | high load in flare → light | flare signs | D; T2 |
| sys_reds | energy deficit + training | Clinician-led | — | missed periods, BSI | T3 |

## A3. PART 3 — Cross-Cutting Rules

### A3.1 Pain-monitoring model (default across entries)
Based on Silbernagel's model (AJSM 2007; JOSPT 2015):
- **During activity:** pain ≤5/10 is allowed (green ≤2, amber 3–5, red >5).
- **After activity:** pain ≤5/10, settling within the day.
- **24-hour response:**
  - Next-morning pain/stiffness at or below baseline → progress next session.
  - Up to 2 points above baseline → hold.
  - More than 2 points above baseline, or >5/10 → regress one step.
- **Weekly:** pain must not climb week on week.
- **Why 2 points:** a change of 2 is used because the minimal detectable change and the minimal clinically important difference on the NPRS are both 2 points (cited in the UBC Achilles toolkit).

**Overrides (stricter rules):**
- Bone stress injury: any site pain stops the session (Warden 2021).
- Nerve-related entries: no spreading of symptoms.
- Instability: no apprehension.
- Acute ligament injury: ≤3/10.
- RCRSP: ≤4/10 that settles quickly. Raulline Ullern and colleagues' 2025 scoping review of 28 RCTs found no consensus on pain allowance for this condition.
- Lateral elbow pain >7/10: isometrics only (Lucado 2022 irritability).

### A3.2 Load management
- **Do not compute a hard acute:chronic workload ratio threshold.** Impellizzeri et al. (2020, 2021) showed mathematical coupling and artefacts and called for injury frameworks to stop relying on the ratio.
- **Use simple heuristics instead,** labelled "app default". Flag weekly running volume increases of more than ~10–20% and new intensity added in the same week as new volume. These figures are an expert default, not established thresholds.
- **Tendinopathy:** use the tolerable-pain model above and Silbernagel & Crossley's light/medium/heavy recovery-day rules (light: daily; medium: 2 recovery days).

**Deload triggers:**
- 2 consecutive red sessions.
- Next-morning pain more than 2 points above baseline on 2 of 3 days.
- New red flag.
- Self-reported fatigue plus a volume spike.

The deload is offered, not imposed. The suggested default is a 30–40% volume cut for 1 week.

### A3.3 Escalation
- **T1 (manage alone):** the tendinopathies, PFP, nonspecific LBP, FAIS, structural entries without hardware, and others marked T1 in the catalogue.
- **T2 (clearance first):** all POST-SURGICAL entries; low-risk BSI; radicular symptoms; first dislocation; suspected tears; inflammatory arthritis; osteoporosis; fusion. The app asks "Has a clinician cleared you to train this?" and unlocks rehab phases on "Yes". Flags show either way.
- **T3 (won't program around):**
  - Suspected cauda equina (saddle numbness, bladder or bowel change, progressive weakness).
  - High-risk BSI (femoral neck, anterior tibia, navicular, 5th metatarsal).
  - Rib BSI.
  - REDs.
  - Systemic signs (fever, unexplained weight loss, night pain, chest pain).
  The app shows see-a-professional copy and builds no injury plan. The normal library and workouts remain available.

### A3.4 Umbrella-union logic
1. **avoid(umbrella)** = authored generic avoids ∪ every child's avoid, deduplicated by movement tag. Every child is therefore automatically a subset.
2. **modify(umbrella)** = ∪ every child's modify for any movement in avoid(umbrella).
3. **do_more_of(umbrella)** = items appearing in at least one child that hit no movement in avoid(umbrella), so avoid wins over do-more-of.
4. **red_flags** = union.
5. **in_workout_cues** = union, deduplicated, capped at 1 pre-session cue (the umbrella's own) plus per-exercise cues.
6. **rehab_phases(umbrella)** = the generic five-phase template using the most conservative child criteria.
7. **running** = present if any child has running, with the most conservative values.

A region "not sure" chip is computed at runtime as the union of all umbrellas in that region. It needs no data entry.

### A3.5 Multi-selection interactions
The final avoid set is the union across selections, and every modify is kept. Where one entry's do-more-of is another's avoid, the avoid wins and the conflict is shown, e.g., frozen shoulder "regain range" vs hypermobility "no end-range". Per-entry `interactions[]` rows override the generic merge with a specific change.

### A3.6 Generic rehab phase template (for compact entries)
| Phase | Goal | Default dose | Progression criterion | Typical duration |
|---|---|---|---|---|
| Protect | settle irritability | isometrics 4–5×30–45 s daily; walking | pain ≤3/10 on the provocation test | 0–2 wk |
| Restore range | normal pain-free range | active range 2×10 daily | symmetric range | 1–3 wk |
| Build capacity | strength | 3–4×8–15 at RPE 6–8, 3×/wk | 24-h rule holds at 2 load steps | 3–12 wk |
| Return to load | sport-specific/plyometric | 2–3×/wk, stepwise | sport-task pain ≤3/10, no next-day flare | 4–12 wk |
| Maintain | prevent recurrence | 2×/wk | — | ongoing |

These doses are app defaults (grade D) sitting within the ranges used in Breda 2021, Silbernagel 2007, Willy 2019 and Liaghat 2022.

## A4. Safety copy

**Pre-selection disclaimer (shown before the injury picker):**
"This app gives training guidance, not medical advice. It can't diagnose you, and picking a condition here doesn't mean you have it. Flags and suggestions are based on published guidelines and research for common training-related conditions, but they can't account for your individual history. If you've had surgery, a recent injury, or any symptom on our 'see a professional' list, check with a physiotherapist or doctor before following an injury plan. You're always in control: we'll warn you and suggest alternatives, but we'll never stop you choosing an exercise."

**In-app consent (checkbox before saving a selection):**
"☐ I understand this is training guidance, not medical advice or treatment. ☐ I'll stop and seek professional advice if I notice any warning sign the app shows me. ☐ I understand this is an alpha version, and the injury library is still being reviewed by clinicians. ☐ I consent to the app storing my selected conditions and pain ratings to tailor my training (you can delete these anytime in Settings)."

**Red-flag "see a professional" copy (shown on red-flag match):**
"This is one we don't want to train around. What you've described can sometimes signal something that needs a professional to look at it. We're not saying something is wrong, but please get it checked by a doctor or physiotherapist before loading it. Your normal workouts are still available. If you have numbness in your groin or inner thighs, new problems controlling your bladder or bowel, chest pain, or sudden severe weakness, seek urgent medical care now."

**Where the line is thin:** clearance gating (T2), pain-rule overrides, and any self-ID cue that edges into diagnosis. The cue copy says "sounds like you if…", never "you have…".

## Caveats

- **Evidence is uneven.** Grade A/B entries: PFP, Achilles, heel, ankle sprain, LBP, OA, gluteal tendinopathy, patellar tendinopathy, lateral elbow, neck, and low-risk BSI return. Most STRUCTURAL and POST-SURGICAL entries are grade D, built on anatomical reasoning rather than trials. Anterior shoulder instability, ACL, fusion, frozen shoulder and cauda equina red flags were not sourced in this research pass. They need physio review and primary sources before alpha.
- **Specific doses are app defaults within trial ranges, not prescriptions.** Trials vary widely; for example, RCRSP reviews found no consensus on exercise type or pain allowance.
- **The Liaghat hypermobility RCT was statistically positive but below the minimal important difference in the intention-to-treat analysis.** Treat "high-load is better" as promising, not settled.
- **Running-load percentages (10–20%/wk) are conventions, not validated thresholds.**
- **Prevalence ranking within regions is a judgement** that combines reviews using different injury definitions. Keogh & Winwood note injury definitions vary widely across studies.
- **The implementation pack below contains five fully populated JSON entries** (el_pain, el_hyperextension, kn_patellar_tendinopathy, an_achilles_mid, sys_hypermobility) that demonstrate every field. The remaining entries must be transcribed from A2 into the same schema, and the validator blocks any entry with `evidence_grade: "pending"` from the alpha build.

---

# DELIVERABLE B — Implementation Pack for Claude Code

## (1) `injuries.schema.json`
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "injuries.schema.json",
  "type": "array",
  "items": {
    "type": "object",
    "additionalProperties": false,
    "required": ["id","chip_label","clinical_name","region","category","parent_id","one_liner","self_id_cues","core_cue","warmup","do_more_of","avoid","modify","in_workout_cues","red_flags","rehab_phases","running","interactions","evidence_grade","sources"],
    "properties": {
      "id": {"type": "string", "pattern": "^[a-z]+_[a-z0-9_]+$"},
      "chip_label": {"type": "string", "maxLength": 40},
      "clinical_name": {"type": "string"},
      "region": {"enum": ["neck","shoulder","elbow","wrist_hand","thoracic_ribs","lower_back","hip_thigh","knee","ankle_foot_shin","systemic"]},
      "category": {"enum": ["UMBRELLA","ACUTE","CHRONIC_RECURRENT","STRUCTURAL_PERMANENT","POST_SURGICAL"]},
      "parent_id": {"type": ["string","null"]},
      "one_liner": {"type": "string", "maxLength": 160},
      "self_id_cues": {"type": "array", "items": {"type": "string"}, "minItems": 2, "maxItems": 4},
      "core_cue": {"type": "string", "maxLength": 140},
      "warmup": {"type": "array", "minItems": 1, "items": {"type": "object", "additionalProperties": false, "required": ["exercise","dose","note"], "properties": {"exercise": {"type": "string"}, "dose": {"type": "string"}, "note": {"type": "string"}}}},
      "do_more_of": {"type": "array", "minItems": 1, "maxItems": 5, "items": {"type": "object", "additionalProperties": false, "required": ["exercise","sets","reps","frequency","placement"], "properties": {"exercise": {"type": "string"}, "sets": {"type": "string"}, "reps": {"type": "string"}, "frequency": {"type": "string"}, "placement": {"enum": ["warmup","main","accessory","finisher","off_day"]}}}},
      "avoid": {"type": "array", "items": {"type": "object", "additionalProperties": false, "required": ["movement","mechanism"], "properties": {"movement": {"type": "string", "description": "movement tag from movement_tags vocabulary"}, "mechanism": {"type": "string"}}}},
      "modify": {"type": "array", "items": {"type": "object", "additionalProperties": false, "required": ["exercise","substitute","note"], "properties": {"exercise": {"type": "string", "description": "exercise id carrying ≥1 avoid movement tag"}, "substitute": {"type": "string"}, "note": {"type": "string"}}}},
      "in_workout_cues": {"type": "array", "items": {"type": "object", "additionalProperties": false, "required": ["trigger","message"], "properties": {"trigger": {"enum": ["pre_session","per_exercise","pain_threshold"]}, "message": {"type": "string", "maxLength": 120}}}},
      "red_flags": {"type": "array", "minItems": 1, "items": {"type": "string"}},
      "rehab_phases": {"type": ["array","null"], "items": {"type": "object", "additionalProperties": false, "required": ["phase","goals","exercises","progression_criteria","duration"], "properties": {"phase": {"enum": ["protect","restore_range","build_capacity","return_to_load","maintain"]}, "goals": {"type": "array", "items": {"type": "string"}}, "exercises": {"type": "array", "items": {"type": "object", "required": ["exercise","sets","reps","frequency"], "properties": {"exercise": {"type": "string"}, "sets": {"type": "string"}, "reps": {"type": "string"}, "frequency": {"type": "string"}}}}, "progression_criteria": {"type": "array", "items": {"type": "string"}}, "duration": {"type": "string"}}}},
      "running": {"type": ["object","null"], "additionalProperties": false, "properties": {"volume": {"type": "string"}, "surface": {"type": "string"}, "pace": {"type": "string"}, "hills": {"type": "string"}, "intervals": {"type": "string"}, "return_to_running": {"type": "array", "items": {"type": "object", "required": ["step","prescription","criteria"], "properties": {"step": {"type": "integer"}, "prescription": {"type": "string"}, "criteria": {"type": "string"}}}}}},
      "interactions": {"type": "array", "items": {"type": "object", "additionalProperties": false, "required": ["with_id","change"], "properties": {"with_id": {"type": "string"}, "change": {"type": "string"}}}},
      "evidence_grade": {"enum": ["A","B","C","D","pending"]},
      "sources": {"type": "array", "items": {"type": "string"}}
    },
    "allOf": [
      {"if": {"properties": {"category": {"const": "STRUCTURAL_PERMANENT"}}}, "then": {"properties": {"rehab_phases": {"type": "null"}}}},
      {"if": {"properties": {"category": {"const": "UMBRELLA"}}}, "then": {"properties": {"parent_id": {"type": "null"}}}, "else": {"properties": {"parent_id": {"type": "string"}}}}
    ]
  }
}
```

## (2) `injuries.json` (fully populated reference entries)
```json
[
  {
    "id": "el_pain",
    "chip_label": "Elbow pain",
    "clinical_name": "Elbow pain (umbrella)",
    "region": "elbow",
    "category": "UMBRELLA",
    "parent_id": null,
    "one_liner": "Risk lives in hard gripping and in loaded lockout — the two jobs the elbow does under a bar.",
    "self_id_cues": ["My elbow hurts when I grip or lock out", "I'm not sure exactly what it is", "Pulling or pressing aggravates it"],
    "core_cue": "Grip just hard enough and stop just short of a hard lockout.",
    "warmup": [{"exercise": "band_pushdown", "dose": "1x15", "note": "mid-range"}, {"exercise": "wrist_extension_isometric", "dose": "2x30s", "note": "moderate effort"}],
    "do_more_of": [{"exercise": "wrist_extensor_isometric", "sets": "3", "reps": "30s", "frequency": "3x/wk", "placement": "accessory"}, {"exercise": "eccentric_curl_soft_stop", "sets": "3", "reps": "8", "frequency": "2x/wk", "placement": "accessory"}],
    "avoid": [{"movement": "elbow_ext_endrange_loaded", "mechanism": "joint takes load at lockout"}, {"movement": "ballistic_elbow_ext", "mechanism": "uncontrolled end-range extension"}, {"movement": "max_grip_wrist_ext", "mechanism": "high extensor tendon load"}],
    "modify": [{"exercise": "bench_press", "substitute": "bench_press_soft_lockout", "note": "stop a few degrees short"}, {"exercise": "kettlebell_swing", "substitute": "kettlebell_swing_soft_elbow", "note": "no snap"}, {"exercise": "farmers_carry", "substitute": "trap_bar_carry_straps", "note": "straps reduce grip demand"}],
    "in_workout_cues": [{"trigger": "pre_session", "message": "Elbow day: soft lockout, straps on heavy pulls."}, {"trigger": "pain_threshold", "message": "Over 5/10 or worse tomorrow morning? Drop back a step."}],
    "red_flags": ["Tingling in ring/little fingers", "Locking or giving way", "Swelling after a fall"],
    "rehab_phases": [
      {"phase": "protect", "goals": ["settle pain"], "exercises": [{"exercise": "wrist_extensor_isometric", "sets": "4-5", "reps": "30-45s", "frequency": "daily"}], "progression_criteria": ["grip pain <=3/10"], "duration": "0-2 wk"},
      {"phase": "restore_range", "goals": ["full pain-free range"], "exercises": [{"exercise": "active_elbow_range", "sets": "2", "reps": "10", "frequency": "daily"}], "progression_criteria": ["symmetric range"], "duration": "1-3 wk"},
      {"phase": "build_capacity", "goals": ["forearm strength"], "exercises": [{"exercise": "wrist_curl_eccentric", "sets": "3", "reps": "15", "frequency": "3x/wk"}], "progression_criteria": ["24-h rule holds at 2 load steps"], "duration": "3-12 wk"},
      {"phase": "return_to_load", "goals": ["full grip lifts"], "exercises": [{"exercise": "deadlift_no_straps", "sets": "3", "reps": "5", "frequency": "2x/wk"}], "progression_criteria": ["no next-day flare"], "duration": "4-12 wk"},
      {"phase": "maintain", "goals": ["prevent recurrence"], "exercises": [{"exercise": "forearm_circuit", "sets": "2", "reps": "15", "frequency": "2x/wk"}], "progression_criteria": [], "duration": "ongoing"}
    ],
    "running": null,
    "interactions": [{"with_id": "wr_pain", "change": "check pressing grip width"}],
    "evidence_grade": "B",
    "sources": ["Lucado AM et al. Lateral Elbow Pain and Muscle Function Impairments. JOSPT 2022;52(12):CPG1-CPG111. doi:10.2519/jospt.2022.0302"]
  },
  {
    "id": "el_hyperextension",
    "chip_label": "Elbow hyperextends (old fracture)",
    "clinical_name": "Cubitus recurvatum / post-fracture malunion with hyperlaxity",
    "region": "elbow",
    "category": "STRUCTURAL_PERMANENT",
    "parent_id": "el_pain",
    "one_liner": "Risk lives in the last few degrees of straightening under load — where the joint, not the muscle, takes the weight.",
    "self_id_cues": ["My elbow bends backwards past straight", "I broke it as a kid and it healed on its own", "Locking out on push-ups feels wrong"],
    "core_cue": "Soft lockout — stop a few degrees short of straight on every press, carry, hang, and plank.",
    "warmup": [{"exercise": "band_pushdown", "dose": "1x15", "note": "mid-range"}, {"exercise": "band_curl", "dose": "1x15", "note": "mid-range"}, {"exercise": "light_press_soft_lockout", "dose": "1x5", "note": "rehearse the stop before loading"}],
    "do_more_of": [{"exercise": "eccentric_curl_soft_stop", "sets": "3", "reps": "8 (3-4s down)", "frequency": "2x/wk", "placement": "accessory"}, {"exercise": "isometric_near_end_range_push_pull", "sets": "3", "reps": "20-30s", "frequency": "2x/wk", "placement": "accessory"}, {"exercise": "grip_forearm_work", "sets": "3", "reps": "10-15", "frequency": "2x/wk", "placement": "finisher"}, {"exercise": "triceps_soft_stop", "sets": "3", "reps": "10-12", "frequency": "2x/wk", "placement": "accessory"}],
    "avoid": [{"movement": "elbow_ext_endrange_loaded", "mechanism": "joint takes load at lockout"}, {"movement": "ballistic_elbow_ext", "mechanism": "uncontrolled end-range extension"}],
    "modify": [{"exercise": "bench_press", "substitute": "bench_press_soft_lockout", "note": "stop a few degrees short"}, {"exercise": "overhead_press", "substitute": "overhead_press_soft_lockout", "note": "soft lockout"}, {"exercise": "push_up", "substitute": "push_up_soft_lockout", "note": "soft lockout"}, {"exercise": "dip", "substitute": "dip_soft_lockout", "note": "soft lockout"}, {"exercise": "plank_straight_arm", "substitute": "forearm_plank", "note": "or soft elbows"}, {"exercise": "straight_arm_pulldown", "substitute": "straight_arm_pulldown_soft_elbow", "note": "keep slight bend"}, {"exercise": "overhead_carry", "substitute": "overhead_carry_soft_lockout", "note": "soft lockout"}, {"exercise": "snatch", "substitute": "snatch_high_pull", "note": "no ballistic lockout"}, {"exercise": "kettlebell_swing", "substitute": "kettlebell_swing_soft_elbow", "note": "no snap"}],
    "in_workout_cues": [{"trigger": "pre_session", "message": "Soft lockout today."}, {"trigger": "per_exercise", "message": "Stop a few degrees short of straight."}],
    "red_flags": ["Tingling in ring/little fingers", "Inner-elbow pain with gripping", "Joint giving way or clicking under load"],
    "rehab_phases": null,
    "running": null,
    "interactions": [{"with_id": "wr_pain", "change": "check pressing grip width"}, {"with_id": "sh_ant_instability", "change": "both favour soft lockout; no conflict"}, {"with_id": "sys_hypermobility", "change": "identical cue across all joints"}],
    "evidence_grade": "D",
    "sources": ["Engelbert RHH et al. Am J Med Genet C 2017;175C(1):158-167. doi:10.1002/ajmg.c.31545"]
  },
  {
    "id": "kn_patellar_tendinopathy",
    "chip_label": "Pain just below kneecap jumping",
    "clinical_name": "Patellar tendinopathy",
    "region": "knee",
    "category": "CHRONIC_RECURRENT",
    "parent_id": "kn_pain",
    "one_liner": "Risk lives in fast, springy loading of the tendon just below the kneecap — jumps, bounds and quick changes of direction.",
    "self_id_cues": ["Pinpoint pain just under my kneecap", "Hurts at the start, eases, worse next day", "Jumping or deep single-leg squats bring it on"],
    "core_cue": "Slow and heavy is your friend; fast and springy is earned.",
    "warmup": [{"exercise": "spanish_squat_isometric", "dose": "2x30-45s", "note": "moderate effort"}, {"exercise": "box_squat_bodyweight", "dose": "1x10", "note": "comfortable depth"}],
    "do_more_of": [{"exercise": "spanish_squat_isometric", "sets": "4-5", "reps": "30-45s", "frequency": "daily when irritable", "placement": "warmup"}, {"exercise": "leg_press_slow", "sets": "3-4", "reps": "8-15", "frequency": "3x/wk", "placement": "main"}, {"exercise": "calf_raise", "sets": "3", "reps": "12", "frequency": "3x/wk", "placement": "accessory"}],
    "avoid": [{"movement": "plyo_jump_landing", "mechanism": "high tendon energy storage"}, {"movement": "run_speed_cutting", "mechanism": "high tendon load while irritable"}, {"movement": "knee_flex_deep_loaded_painful", "mechanism": "tendon compression and load beyond tolerance"}],
    "modify": [{"exercise": "box_jump", "substitute": "step_up_slow_lower", "note": "earn jumps in stage 3"}, {"exercise": "power_clean", "substitute": "clean_high_pull_blocks", "note": "no catch"}, {"exercise": "run_intervals", "substitute": "run_easy_continuous", "note": "flat"}, {"exercise": "back_squat", "substitute": "back_squat_depth_capped", "note": "depth keeps pain <=3/10"}],
    "in_workout_cues": [{"trigger": "pre_session", "message": "Tendon check: single-leg decline squat 0-10?"}, {"trigger": "per_exercise", "message": "Tendon-loading move — earned at stage 3."}, {"trigger": "pain_threshold", "message": "Over 5/10 or worse next morning → drop back one stage."}],
    "red_flags": ["Sudden pop with inability to straighten the knee", "Hot swollen knee with fever", "Night pain unrelated to activity"],
    "rehab_phases": [
      {"phase": "protect", "goals": ["settle pain"], "exercises": [{"exercise": "spanish_squat_isometric", "sets": "5", "reps": "45s", "frequency": "daily"}], "progression_criteria": ["SL decline squat pain <=3/10"], "duration": "0-2 wk"},
      {"phase": "restore_range", "goals": ["usually not limited; fold into protect"], "exercises": [], "progression_criteria": ["full knee range"], "duration": "0 wk"},
      {"phase": "build_capacity", "goals": ["tendon load capacity"], "exercises": [{"exercise": "leg_press_slow", "sets": "4", "reps": "15→6-8 heavy", "frequency": "3x/wk"}, {"exercise": "split_squat", "sets": "3", "reps": "8-12", "frequency": "3x/wk"}], "progression_criteria": ["24-h pain stable at higher load"], "duration": "2-12 wk"},
      {"phase": "return_to_load", "goals": ["energy storage"], "exercises": [{"exercise": "pogo_hop", "sets": "3", "reps": "10", "frequency": "2-3x/wk"}, {"exercise": "box_jump", "sets": "3", "reps": "5", "frequency": "2x/wk"}], "progression_criteria": ["SL hop pain <=3/10, no next-day flare"], "duration": "8-20 wk"},
      {"phase": "maintain", "goals": ["prevent recurrence"], "exercises": [{"exercise": "leg_press_heavy", "sets": "3", "reps": "6-8", "frequency": "2x/wk"}], "progression_criteria": [], "duration": "ongoing"}
    ],
    "running": {"volume": "maintain if 24-h rule holds", "surface": "flat", "pace": "easy", "hills": "hold until stage 3; treat downhill as jump-like", "intervals": "hold until stage 3", "return_to_running": [{"step": 1, "prescription": "easy continuous runs", "criteria": "pain <=3/10 during, baseline next morning"}, {"step": 2, "prescription": "add strides", "criteria": "stage 3 reached"}]},
    "interactions": [{"with_id": "kn_pfp", "change": "depth set by the lower pain cap"}, {"with_id": "an_achilles_mid", "change": "stage plyometrics to the slower tendon"}],
    "evidence_grade": "B",
    "sources": ["Breda SJ et al. Br J Sports Med 2021;55(9):501-509", "Silbernagel KG et al. Am J Sports Med 2007. doi:10.1177/0363546506298279"]
  },
  {
    "id": "an_achilles_mid",
    "chip_label": "Achilles pain mid-tendon",
    "clinical_name": "Midportion Achilles tendinopathy",
    "region": "ankle_foot_shin",
    "category": "CHRONIC_RECURRENT",
    "parent_id": "an_pain",
    "one_liner": "Risk lives in fast, springy calf loading — hops, sprints and hills — when it outpaces what the tendon has trained for.",
    "self_id_cues": ["Pain a few centimetres above the heel", "Stiff first thing in the morning", "Eases as I warm up, worse later"],
    "core_cue": "Keep loading the calf; up to 5/10 is OK if it settles by morning.",
    "warmup": [{"exercise": "calf_raise_double", "dose": "2x15", "note": "slow"}, {"exercise": "calf_raise_single", "dose": "1x10", "note": "tolerable"}],
    "do_more_of": [{"exercise": "calf_raise_single_straight_knee", "sets": "3", "reps": "15→8 loaded", "frequency": "every other day", "placement": "accessory"}, {"exercise": "seated_soleus_raise", "sets": "3", "reps": "12", "frequency": "every other day", "placement": "accessory"}],
    "avoid": [{"movement": "run_hills_sprints", "mechanism": "high Achilles load while irritable"}, {"movement": "calf_plyo", "mechanism": "energy storage before stage 3"}, {"movement": "run_volume_spike", "mechanism": "load exceeds capacity"}],
    "modify": [{"exercise": "run_intervals", "substitute": "run_easy_continuous", "note": "flat"}, {"exercise": "hill_repeats", "substitute": "flat_tempo", "note": "until hop test passed"}, {"exercise": "box_jump", "substitute": "step_up_slow_lower", "note": "earned later"}, {"exercise": "jump_rope", "substitute": "bike_intervals", "note": "until stage 3"}],
    "in_workout_cues": [{"trigger": "pre_session", "message": "Morning Achilles stiffness 0-10?"}, {"trigger": "per_exercise", "message": "Plyometrics are earned in stage 3."}, {"trigger": "pain_threshold", "message": "Over 5/10 or worse next morning → step back."}],
    "red_flags": ["Sudden pop, can't rise on tiptoe", "Calf swelling, warmth, redness", "Symptoms after fluoroquinolone antibiotics"],
    "rehab_phases": [
      {"phase": "protect", "goals": ["learn pain-monitoring model"], "exercises": [{"exercise": "calf_raise_double", "sets": "3", "reps": "15", "frequency": "daily"}], "progression_criteria": ["10 single-leg raises tolerable"], "duration": "1-2 wk"},
      {"phase": "restore_range", "goals": ["normal dorsiflexion"], "exercises": [{"exercise": "knee_to_wall", "sets": "2", "reps": "10", "frequency": "daily"}], "progression_criteria": ["symmetric"], "duration": "0-2 wk"},
      {"phase": "build_capacity", "goals": ["calf strength"], "exercises": [{"exercise": "calf_raise_single", "sets": "3", "reps": "15", "frequency": "daily"}, {"exercise": "calf_raise_eccentric", "sets": "3", "reps": "15", "frequency": "daily"}], "progression_criteria": ["pain within model"], "duration": "2-5 wk"},
      {"phase": "return_to_load", "goals": ["loaded and fast"], "exercises": [{"exercise": "calf_raise_loaded", "sets": "3", "reps": "8-12", "frequency": "3x/wk"}, {"exercise": "pogo_hop", "sets": "3", "reps": "10", "frequency": "2x/wk"}], "progression_criteria": ["25 pain-free single-leg hops"], "duration": "3-12 wk"},
      {"phase": "maintain", "goals": ["prevent recurrence"], "exercises": [{"exercise": "calf_raise_loaded", "sets": "3", "reps": "8", "frequency": "2-3x/wk"}], "progression_criteria": [], "duration": "3-6 mo"}
    ],
    "running": {"volume": "reduce to level where 24-h rule holds", "surface": "flat, even", "pace": "easy before fast", "hills": "last", "intervals": "after pain-free hops", "return_to_running": [{"step": 1, "prescription": "light activities (pain 1-2) daily", "criteria": "next morning baseline"}, {"step": 2, "prescription": "jogging on flat; 2 recovery days between medium sessions", "criteria": "pain 2-3 and settles"}, {"step": 3, "prescription": "speed and hills", "criteria": "25 pain-free hops"}]},
    "interactions": [{"with_id": "an_plantar_heel", "change": "manage total calf/foot load together"}, {"with_id": "sys_hypermobility", "change": "favour slow heavy over stretching"}],
    "evidence_grade": "A",
    "sources": ["Chimenti RL et al. JOSPT 2024;54(12). doi:10.2519/jospt.2024.0302", "Silbernagel KG et al. Am J Sports Med 2007", "Silbernagel KG, Crossley KM. JOSPT 2015. doi:10.2519/jospt.2015.5885"]
  },
  {
    "id": "sys_hypermobility",
    "chip_label": "Very bendy / hypermobile",
    "clinical_name": "Generalised joint hypermobility / HSD / hEDS",
    "region": "systemic",
    "category": "STRUCTURAL_PERMANENT",
    "parent_id": "sys_joints",
    "one_liner": "Risk lives at the end of range under load, where ligaments rather than muscles stop the joint.",
    "self_id_cues": ["Palms flat on the floor, thumb to wrist", "Joints click, sublux or feel unstable", "Stretching feels good but never seems to help"],
    "core_cue": "Own the middle, stop before the end — strength over stretch, every joint, every session.",
    "warmup": [{"exercise": "goblet_squat_controlled_stop", "dose": "1x8 at 50%", "note": "deliberate stop before end range"}, {"exercise": "press_soft_lockout", "dose": "1x8 light", "note": "rehearse soft lockout"}],
    "do_more_of": [{"exercise": "progressive_strength_major_lifts", "sets": "3→4", "reps": "10RM→8RM", "frequency": "3x/wk", "placement": "main"}, {"exercise": "isometric_near_end_range", "sets": "3", "reps": "20-30s", "frequency": "2x/wk", "placement": "accessory"}, {"exercise": "single_leg_balance", "sets": "3", "reps": "30s", "frequency": "3x/wk", "placement": "warmup"}],
    "avoid": [{"movement": "passive_endrange_stretch", "mechanism": "load on ligaments, not muscle"}, {"movement": "elbow_ext_endrange_loaded", "mechanism": "joint takes load at lockout"}, {"movement": "knee_ext_endrange_loaded", "mechanism": "joint takes load at lockout"}, {"movement": "ballistic_endrange", "mechanism": "uncontrolled end range"}],
    "modify": [{"exercise": "static_stretch_splits", "substitute": "strength_through_range", "note": "control over flexibility"}, {"exercise": "bench_press", "substitute": "bench_press_soft_lockout", "note": "soft lockout"}, {"exercise": "romanian_deadlift", "substitute": "romanian_deadlift_soft_knee", "note": "no locked knees"}, {"exercise": "shoulder_dislocates", "substitute": "band_pull_apart", "note": "mid-range"}, {"exercise": "kettlebell_swing", "substitute": "kettlebell_swing_soft_elbow", "note": "no snap"}],
    "in_workout_cues": [{"trigger": "pre_session", "message": "Own the middle today."}, {"trigger": "per_exercise", "message": "Stop before the end of range."}],
    "red_flags": ["Repeated dislocations", "New neurological symptoms", "Dizziness on standing"],
    "rehab_phases": null,
    "running": null,
    "interactions": [{"with_id": "el_hyperextension", "change": "identical soft-lockout cue"}, {"with_id": "sh_frozen", "change": "conflict: show both — regain range within control"}],
    "evidence_grade": "B",
    "sources": ["Engelbert RHH et al. Am J Med Genet C 2017;175C(1):158-167. doi:10.1002/ajmg.c.31545", "Liaghat B et al. Br J Sports Med 2022;56(22):1269-1276. doi:10.1136/bjsports-2021-105223", "Malfait F et al. Am J Med Genet C 2017;175(1):8-26. doi:10.1002/ajmg.c.31552", "House S et al. Clin Rheumatol 2021;40(3):1113-1129. doi:10.1007/s10067-020-05284-0"]
  }
]
```

## (3) `CLAUDE_CODE_HANDOFF.md`
```markdown
# CLAUDE_CODE_HANDOFF — Injury Library

## Load
1. Load `injuries.json`; validate against `injuries.schema.json`. Fail build on any error.
2. Load `movement_tags.json` (create it): map every exercise id → array of movement tags (e.g., bench_press → ["elbow_ext_endrange_loaded","shoulder_abd_er_loaded"]).
3. Build index: by id, by parent_id, by region.

## Derive umbrellas (build step, not runtime)
For each entry where category == "UMBRELLA":
1. avoid_final = authored avoid ∪ avoid of every child (parent_id == umbrella.id), dedupe by movement.
2. modify_final = authored modify ∪ child modify, dedupe by (exercise, substitute).
3. do_more_of_final = authored ∪ child items whose exercise tags ∩ avoid_final movements == ∅.
4. red_flags_final = union, dedupe.
5. in_workout_cues_final = umbrella pre_session cue + union of per_exercise and pain_threshold cues.
6. running = most conservative child values if any child non-null.
Write derived umbrellas to `injuries.derived.json`. Runtime reads only the derived file.
Region "not sure" chip: compute at runtime as union of all umbrellas in the region.

## Map selection → exercise flags
1. selected = user-selected ids (umbrella or specific).
2. active_avoid = ∪ avoid_final for all selected.
3. For each exercise in a workout: flagged = tags(exercise) ∩ active_avoid.movement ≠ ∅.
4. If flagged: attach {reason: avoid.mechanism, alternative: matching modify.substitute, note}. Show a warning badge. NEVER hide, disable, reorder away or auto-swap the exercise. Swapping requires a user tap.

## Enforce "warn, never remove"
- No code path may delete or filter an exercise because of an injury selection. Add a unit test asserting workout length and exercise ids are unchanged after applying any selection.
- Every avoid.movement must be covered by ≥1 modify whose exercise carries that tag. Fail build otherwise.
- T3 red flag: show red-flag copy; do not generate injury rehab phases; keep normal library fully available.

## UI field bindings
- Chip: chip_label. Sub-label on long-press: clinical_name.
- Selection confirmation card: one_liner + self_id_cues.
- Pre-session banner: in_workout_cues[trigger=pre_session] (max 1 per selected entry; max 2 banners total, priority STRUCTURAL > POST_SURGICAL > others).
- Exercise row note: in_workout_cues[trigger=per_exercise] when exercise is flagged.
- Pain-rating prompt result: in_workout_cues[trigger=pain_threshold].
- Warm-up block: warmup[]. Accessory suggestions: do_more_of[] by placement.
- STRUCTURAL: show core_cue permanently; never show phase progress bar or end date.

## Pain model (runtime)
- Collect pain 0–10 during, after, and next morning.
- Next morning ≤ baseline → suggest progress; ≤ baseline+2 → hold; > baseline+2 or >5 → suggest regress.
- Overrides by id: shin_bsi_lowrisk (any site pain → stop), radicular ids (any spread → stop), instability ids (any apprehension → stop), el_lateral_tendinopathy (>7 → isometrics only), sh_rcrsp (cap 4).
- Suggestions only; user confirms.

## Escalation map (constant)
T2 (clearance prompt before rehab_phases shown): all POST_SURGICAL, shin_bsi_lowrisk, neck_radicular, lb_radicular, neck_whiplash, sh_dislocation_acute, sh_cuff_tear_degen, sh_frozen, el_ulnar_nerve, wr_carpal_tunnel, wr_sprain_acute, th_rib_costochondral, th_pec_strain, lb_spondylolisthesis, lb_stenosis, lb_fusion, neck_fusion, hip_dysplasia, hip_replacement, kn_replacement, kn_acl_deficient, kn_mcl_sprain, kn_patellar_instability, an_post_tib, shin_cecs, sys_osteoporosis, sys_inflammatory.
T3 (no injury plan): lb_cauda_equina_flag, hip_femoral_neck_bsi, shin_bsi_highrisk, th_rib_stress, sys_reds.

## Validate before shipping (CI must fail on any)
1. Schema validation passes.
2. Every non-umbrella has parent_id resolving to an UMBRELLA in the same region (sys_* → sys_joints).
3. Subset rule: child.avoid movements ⊆ derived parent.avoid movements.
4. Every avoid has a covering modify.
5. STRUCTURAL entries: rehab_phases == null.
6. Non-structural, non-umbrella entries: rehab_phases has all 5 phases in order.
7. Lower-limb regions (hip_thigh, knee, ankle_foot_shin) non-structural: running != null.
8. sources non-empty and evidence_grade != "pending" for any entry in the alpha build.
9. Every interactions.with_id resolves.
10. Disclaimer + consent screen shown and accepted before first selection; red-flag copy present.
11. Unit test: applying any selection never changes the exercise id list.
```