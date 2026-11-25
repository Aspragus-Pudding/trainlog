# Library import (batch L)

Built by `node tools/import-library.js` from `docs/research/exercise-library.md`. The decisions are data in the tool; the result is `docs/library.json`, embedded in the app. How to add or edit an exercise from now on: `docs/library-rules.md`.

## Counts

| Rows | Matched to an app exercise | Modifiers on an app exercise | New exercises | Split (one row, two exercises) | Uncertain (left out) | Protocols (kept as data) | Conflicts (not changed) | Research flags adopted |
|---|---|---|---|---|---|---|---|---|
| 78 core, 243 variants, 49 rehab | 183 | 51 | 129 | 1 | 0 | 9 | 68 | 1 |

## Joint flags → movement tags

New tags (one line each, in `docs/movement_tags.json`): `shoulder_ir_elevated` (The arm raised and turned in under load: upright rows to a high finish, bench dips.); `elbow_flex_deep_loaded` (The elbow deeply bent under load, as at the bottom of a skull crusher or overhead extension.); `spine_rotation_loaded` (Twisting the trunk under load: woodchops, landmine rotations, heavy one-arm rows with a twist.); `adductor_lengthened_loaded` (The inner thigh loaded at long length: wide stances, the adductor machine opened wide, Copenhagens.); `neck_loaded` (Load taken by the neck: neck curls and extensions, harness work, heavy shrugs.); `knee_forward_loaded` (Knees travelling far past the toes under load: sissy squats, step-ups and squats with the heels raised (a high load on the kneecap tendon).).

| Research flag | Movement tag |
|---|---|
| SH-OH | shoulder_overhead_loaded (presses, raises); shoulder_hang_traction (pull-ups, pulldowns, hanging work); shoulder_overhead_endrange (overhead triceps, pullovers) |
| SH-ABD-ER | shoulder_abd_er_loaded; on lateral raises (to shoulder height, not end range) shoulder_elevation_abd |
| SH-HABD | shoulder_horiz_abd_endrange |
| SH-EXT | shoulder_ext_endrange_loaded |
| SH-IR-ELEV | shoulder_ir_elevated (new) |
| EL-FLEX | elbow_flex_deep_loaded (new) |
| EL-STRESS | elbow_ext_endrange_loaded; on curls elbow_flex_loaded_heavy |
| WR-EXT | wrist_ext_loaded; on wrist curls wrist_direct_loaded |
| WR-DEV | none: only C047 carries it, an exercise the app already had (its tags are kept) |
| SP-AX | spine_axial_heavy |
| SP-FLEX | spine_flex_loaded |
| SP-EXT | spine_ext_endrange_loaded |
| SP-SHEAR | hinge_heavy |
| SP-ROT | spine_rotation_loaded (new) |
| HIP-FLEX | hip_flex_deep_loaded |
| HIP-ADD | adductor_lengthened_loaded (new; hip_adduction_compression is the gluteal-tendon position, not this) |
| KN-DEEP | knee_flex_deep_loaded |
| KN-FWD | knee_forward_loaded (new; mapped to the ankle tag first, that marked 12% of the library red for stiff ankles: the research means kneecap-tendon load) |
| KN-OKC | knee_ext_open_chain |
| ANK-DF | ankle_df_deep_loaded; on calf raises calf_endrange_loaded |
| HAM-LONG | hamstring_lengthened_loaded |
| NECK | neck_loaded (new) |
| GRIP | max_grip_wrist_ext |
| IMPACT | plyo_jump_landing |

New exercises carry the research's flags mapped this way **plus** their parent's tags (never gentler than the parent). Exercises the app already had keep their tags; where the research flags would add one, it's listed under Conflicts.

## Uncertain: left out for the maintainer to check

| Code | Research name | Why |
|---|---|---|


## Split: one row, two exercises

| Code | Research name | Exercises |
|---|---|---|
| R06 | Serratus wall slide / push-up plus | serratus_wall_slide and pushup_plus |

## Research flags adopted on exercises the app had

| App exercise | Code | Tags added |
|---|---|---|
| arnold | V127 | shoulder_abd_er_loaded |

## Protocols: not one exercise

| Code | Research name | What happens to it |
|---|---|---|
| R10 | Bench return ladder | A return-to-bench ladder (floor press, then board or high pin, then paused full range), kept as ladder data for the rehab engine. |
| R16 | Slow elbow flexion / extension | The curl and the pushdown done slowly (3 s each way); logged on those with a tempo, not a separate exercise. |
| R21 | Rows and scapular endurance | Rows, band rows and face pulls for neck pain; logged on those exercises. |
| R24 | McGill Big 3 | The McGill Big 3 is three exercises (curl-up, side plank, bird dog); side plank and bird dog are in the app, the curl-up is added (mcgill_curlup). |
| R25 | Walking programme | A walking plan, not a lift; walking is an activity (batch N Part 3, quiet cardio). |
| R27 | Hinge return ladder | A return-to-deadlift ladder (dowel hinge, kettlebell deadlift, RDL, deadlift), kept as ladder data for the rehab engine. |
| R38 | HSR leg press / hack / squat | Heavy slow resistance on the leg press, hack or squat (3 s each way, 15RM down to 6RM over 12 weeks); logged on those exercises with a tempo. |
| R45 | Seated + standing calf raise HSR | Heavy slow seated and standing calf raises; logged on Seated and Standing calf raise with a tempo. |
| R49 | Achilles/calf return-to-run ladder | A return-to-running plan, not a lift. |

## Conflicts: listed, not changed

| App exercise | Code | Field | Note |
|---|---|---|---|
| squat | C001 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| front_squat | C003 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| deadlift | C004 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| rdl | C006 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| bench | C007 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| ohp | C008 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| pullup | C009 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| pulldown | C010 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| chest_row | C012 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| cable_row | C013 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| leg_press | C016 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| hack | C017 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| pendulum | C018 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| leg_ext | C020 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| leg_curl | C021 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| nordic | C023 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| hip_thrust | C024 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| dip | C031 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| lat_raise | C035 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| m_rd_fly | C038 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| face_pull | C039 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| pushdown | C046 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| trap_bar | C056 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| seated_add | C070 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| nordic | R36 | setup, cues, mistakes | Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown |
| front_squat | C003 | tags | the research flags would add knee_forward_loaded; the app's tags are kept |
| sumo_dl | C005 | tags | the research flags would add adductor_lengthened_loaded; the app's tags are kept |
| rdl | C006 | tags | the research flags would add max_grip_wrist_ext; the app's tags are kept |
| ohp | C008 | tags | the research flags would add spine_ext_endrange_loaded; the app's tags are kept |
| pulldown | C010 | tags | the research flags would add shoulder_hang_traction; the app's tags are kept |
| bb_row | C011 | tags | the research flags would add max_grip_wrist_ext; the app's tags are kept |
| bulgarian | C014, V239 | tags | the research flags would add knee_forward_loaded; the app's tags are kept |
| leg_press | C016 | tags | the research flags would add knee_flex_deep_loaded; the app's tags are kept |
| hack | C017 | tags | the research flags would add knee_forward_loaded; the app's tags are kept |
| pendulum | C018 | tags | the research flags would add knee_forward_loaded; the app's tags are kept |
| leg_curl | C021, V060 | tags | the research flags would add hamstring_lengthened_loaded; the app's tags are kept |
| hip_thrust | C024 | tags | the research flags would add spine_ext_endrange_loaded; the app's tags are kept |
| machine_press | C030 | tags | the research flags would add shoulder_horiz_abd_endrange; the app's tags are kept |
| pec_deck | C034 | tags | the research flags would add shoulder_horiz_abd_endrange; the app's tags are kept |
| face_pull | C039 | tags | the research flags would add shoulder_abd_er_loaded; the app's tags are kept |
| bb_curl | C040 | tags | the research flags would add wrist_ext_loaded; the app's tags are kept |
| curl | C041 | tags | the research flags would add shoulder_ext_endrange_loaded; the app's tags are kept |
| bayesian_curl | C042 | tags | the research flags would add shoulder_ext_endrange_loaded; the app's tags are kept |
| oh_ext | C045 | tags | the research flags would add elbow_flex_deep_loaded, elbow_ext_endrange_loaded; the app's tags are kept |
| ez_skull | C047 | tags | the research flags would add elbow_flex_deep_loaded; the app's tags are kept |
| jm_press | C048 | tags | the research flags would add elbow_flex_deep_loaded; the app's tags are kept |
| shrug | C050 | tags | the research flags would add neck_loaded; the app's tags are kept |
| hang_raise | C051 | tags | the research flags would add spine_flex_loaded; the app's tags are kept |
| sissy | C067 | tags | the research flags would add knee_forward_loaded; the app's tags are kept |
| seated_add | C070 | tags | the research flags would add adductor_lengthened_loaded; the app's tags are kept |
| db_row | C074 | tags | the research flags would add max_grip_wrist_ext; the app's tags are kept |
| meadows_row | C075 | tags | the research flags would add max_grip_wrist_ext; the app's tags are kept |
| leg_press_sl | V029 | tags | the research flags would add knee_flex_deep_loaded; the app's tags are kept |
| sel_leg_press | V032 | tags | the research flags would add knee_flex_deep_loaded; the app's tags are kept |
| kb_swing | V049 | tags | the research flags would add hinge_heavy; the app's tags are kept |
| cable_add | V090 | tags | the research flags would add adductor_lengthened_loaded; the app's tags are kept |
| incline_machine | V107 | tags | the research flags would add shoulder_horiz_abd_endrange; the app's tags are kept |
| assisted_pullup | V142 | tags | the research flags would add shoulder_hang_traction; the app's tags are kept |
| neutral_pulldown | V146 | tags | the research flags would add shoulder_hang_traction; the app's tags are kept |
| sa_cable_pulldown | V147 | tags | the research flags would add shoulder_hang_traction; the app's tags are kept |
| straight_arm_pd | V149 | tags | the research flags would add shoulder_hang_traction; the app's tags are kept |
| rear_fly | V175 | tags | the research flags would add hinge_heavy; the app's tags are kept |
| cable_front_raise | V180 | tags | the research flags would add shoulder_overhead_loaded; the app's tags are kept |
| cable_curl | V184 | tags | the research flags would add wrist_ext_loaded; the app's tags are kept |
| db_oh_ext | V195 | tags | the research flags would add elbow_flex_deep_loaded; the app's tags are kept |
| db_skull | V200 | tags | the research flags would add elbow_flex_deep_loaded; the app's tags are kept |
| cable_kickback | V206 | tags | the research flags would add shoulder_ext_endrange_loaded; the app's tags are kept |
| woodchop | V229 | tags | the research flags would add spine_rotation_loaded; the app's tags are kept |

## Home training (batch N Part 3)

| New rows | Updated exercises | Collisions (treated as updates) | Ladders | Templates | Quiet cardio (data only) |
|---|---|---|---|---|---|
| 88 | 60 | 2 | 10 | 3 | 10 |

Collisions: H061 DB front raise = db_front_raise; H067 DB kickback = kickback.

## Warm-up library

31 items from the research files (rehab rows with a prehab dose, slant-board stretches and balance), plus the app's 18 warm-up moves. By body part: shoulders 6, hips 5, knees 5, ankles 8, back 4, wrists 6 (research items; the app's own add to each).

## Matched to an app exercise (the code is stored on it)

| Code | Research name | App exercise |
|---|---|---|
| C001 | High-bar back squat | squat (Back squat) |
| C003 | Front squat | front_squat (Front squat) |
| C004 | Conventional deadlift | deadlift (Deadlift) |
| C005 | Sumo deadlift | sumo_dl (Sumo deadlift) |
| C006 | Romanian deadlift | rdl (Romanian deadlift) |
| C007 | Bench press | bench (Barbell bench press) |
| C008 | Overhead press | ohp (Overhead press) |
| C009 | Pull-up | pullup (Pull-up) |
| C010 | Lat pulldown | pulldown (Lat pulldown) |
| C011 | Barbell row | bb_row (Barbell bent-over row) |
| C012 | Chest-supported row | chest_row (Chest-supported row) |
| C013 | Seated cable row | cable_row (Neutral cable row) |
| C014 | Bulgarian split squat | bulgarian (Bulgarian split squat) |
| C015 | Walking lunge | db_lunge (Dumbbell walking lunge) |
| C016 | Leg press | leg_press (Leg press) |
| C017 | Hack squat | hack (Hack squat) |
| C018 | Pendulum squat | pendulum (Pendulum squat) |
| C019 | Belt squat | belt_squat (Belt squat) |
| C020 | Leg extension | leg_ext (Leg extension) |
| C021 | Seated leg curl | leg_curl (Seated leg curl) |
| C022 | Lying leg curl | lying_curl (Lying leg curl) |
| C023 | Nordic hamstring curl | nordic (Nordic curl) |
| C024 | Barbell hip thrust | hip_thrust (Hip thrust) |
| C025 | 45° back extension | back_ext (45° back extension) |
| C026 | Standing calf raise | calf (Standing calf raise) |
| C027 | Seated calf raise | seated_calf (Seated calf raise) |
| C028 | Incline dumbbell press | incline_db (Incline DB press) |
| C029 | Dumbbell bench press | db_bench (Flat DB press) |
| C030 | Machine chest press | machine_press (Converging chest press) |
| C031 | Weighted dip | dip (Dip) |
| C032 | Push-up | weighted_pushup (Push-up) |
| C033 | Cable fly | cable_fly (Cable fly) |
| C034 | Pec deck | pec_deck (Pec deck) |
| C035 | Dumbbell lateral raise | lat_raise (Lateral raise) |
| C036 | Cable lateral raise | cable_raise (Cable lateral raise) |
| C038 | Reverse pec deck | m_rd_fly (Overhand grip machine rear delt fly) |
| C039 | Face pull | face_pull (Face pull) |
| C040 | Barbell curl | bb_curl (Barbell curl) |
| C041 | Incline dumbbell curl | curl (Incline DB curl) |
| C042 | Bayesian cable curl | bayesian_curl (Bayesian cable curl) |
| C043 | Preacher curl | preacher (Preacher curl) |
| C044 | Hammer curl | hammer (Hammer curl) |
| C045 | Overhead cable triceps extension | oh_ext (Overhead cable extension) |
| C046 | Triceps pushdown | pushdown (Cable pushdown) |
| C047 | EZ-bar skull crusher | ez_skull (EZ-bar skullcrusher) |
| C048 | JM press | jm_press (JM press) |
| C049 | Close-grip bench press | cg_bench (Close-grip bench) |
| C050 | Barbell shrug | shrug (Barbell shrug) |
| C051 | Hanging leg raise | hang_raise (Hanging leg raise) |
| C052 | Cable crunch | cable_crunch (Cable crunch) |
| C053 | Ab wheel rollout | ab_wheel (Ab wheel rollout) |
| C054 | Pallof press | pallof (Pallof press) |
| C055 | Farmer carry | farmer (Farmer carry) |
| C056 | Trap-bar deadlift | trap_bar (Trap bar deadlift) |
| C057 | Safety squat bar squat | safety_bar_squat (Safety squat bar squat) |
| C063 | Floor press | floor_press (Floor press) |
| C064 | Board press | board_press (Board press) |
| C066 | Good morning | good_morning (Good morning) |
| C067 | Sissy squat | sissy (Sissy squat) |
| C068 | Reverse Nordic | rev_nordic (Reverse Nordic) |
| C069 | Hip abduction machine | seated_abd (Seated machine hip abduction) |
| C070 | Hip adduction machine | seated_add (Seated machine hip adduction) |
| C072 | Inverted row | inverted_row (Inverted row) |
| C074 | Single-arm dumbbell row | db_row (Single-arm DB row) |
| C075 | Meadows row | meadows_row (Meadows row) |
| C076 | Wrist curl and reverse wrist curl | wrist_curl (Wrist curl) |
| C077 | Tibialis raise | tib_raise (Tibialis raise) |
| V007 | Goblet squat | goblet (Goblet squat) |
| V009 | Smith machine squat | smith_squat (Smith machine squat) |
| V016 | V-squat | v_squat (V-squat machine) |
| V024 | Bodyweight squat | bw_squat (Bodyweight squat) |
| V026 | Pistol squat | pistol (Pistol squat) |
| V029 | Single-leg leg press | leg_press_sl (Single-leg leg press) |
| V032 | Selectorised seated leg press | sel_leg_press (Selectorised leg press) |
| V042 | Dumbbell RDL | db_rdl (Dumbbell Romanian deadlift) |
| V043 | Single-leg RDL | sl_rdl (Single-leg dumbbell RDL) |
| V049 | Kettlebell swing | kb_swing (Kettlebell swing) |
| V050 | Cable pull-through | cable_pullthrough (Cable pull-through) |
| V051 | Smith machine RDL | smith_rdl (Smith machine Romanian deadlift) |
| V054 | Reverse hyperextension | rev_hyper (Reverse hyperextension) |
| V055 | Glute-ham raise | ghr (Glute-ham raise) |
| V059 | Standing single-leg curl | standing_leg_curl (Standing single-leg curl) |
| V060 | Seated leg curl with torso lean | leg_curl (Seated leg curl) |
| V062 | Dumbbell leg curl | db_leg_curl (Dumbbell leg curl) |
| V066 | Smith machine hip thrust | smith_hip_thrust (Smith machine hip thrust) |
| V067 | Hip thrust machine | machine_hip_thrust (Hip thrust machine) |
| V069 | Round-back 45° extension | back_ext (45° back extension) |
| V070 | Weighted 45° extension | back_ext (45° back extension) |
| V073 | High-box step-up | db_stepup (Dumbbell step-up) |
| V075 | Smith split squat | smith_split (Smith machine split squat) |
| V078 | Static split squat | db_split (Dumbbell split squat) |
| V081 | Single-leg leg extension | sl_leg_ext (Single-leg leg extension) |
| V086 | Cable hip abduction | cable_abd (Cable hip abduction) |
| V090 | Cable hip adduction | cable_add (Cable hip adduction) |
| V091 | Leg press calf raise | press_calf (Leg press calf raise) |
| V092 | Smith calf raise | smith_calf (Smith machine calf raise) |
| V093 | Single-leg dumbbell calf raise | db_calf (Single-leg dumbbell calf raise) |
| V104 | Incline barbell bench | bb_incline (Incline barbell bench press) |
| V105 | Low-incline DB press (15-30°) | incline_db (Incline DB press) |
| V106 | Smith incline press | smith_incline (Smith machine incline press) |
| V107 | Hammer Strength incline press | incline_machine (Incline machine chest press) |
| V108 | Decline bench press | decline_press (Decline barbell press) |
| V109 | Selectorised chest press | pin_chest_press (Pin-loaded machine chest press) |
| V114 | Weighted push-up | weighted_pushup (Push-up) |
| V118 | Assisted dip machine | assisted_dip (Assisted dip) |
| V121 | Seated dumbbell press | seated_db_press (Seated DB shoulder press) |
| V123 | Z press | z_press (Z press) |
| V124 | Selectorised shoulder press | machine_ohp (Machine shoulder press) |
| V125 | Smith shoulder press | smith_ohp (Smith machine shoulder press) |
| V126 | Landmine press | landmine (Landmine press) |
| V127 | Arnold press | arnold (Arnold press) |
| V128 | Behind-the-neck press | bn_press (Behind-the-neck press) |
| V134 | Dumbbell fly | fly (DB fly) |
| V137 | Mid cable crossover | cable_fly (Cable fly) |
| V138 | Weighted pull-up | pullup (Pull-up) |
| V139 | Chin-up | chinup (Chin-up) |
| V141 | Band-assisted pull-up | band_pullup (Band-assisted pull-up) |
| V142 | Machine-assisted pull-up | assisted_pullup (Assisted pull-up) |
| V144 | Scapular pull-up / dead hang | hang (Dead hang) |
| V146 | Close neutral-grip pulldown | neutral_pulldown (Neutral-grip pulldown) |
| V147 | Single-arm cable pulldown | sa_cable_pulldown (Single-arm cable pulldown) |
| V149 | Straight-arm pulldown | straight_arm_pd (Straight-arm pulldown) |
| V152 | Pendlay row | pendlay_row (Pendlay row) |
| V154 | Seal row | seal_row (Seal row) |
| V155 | Chest-supported DB row | cs_db_row (Chest-supported dumbbell row) |
| V156 | T-bar row (landmine) | tbar (T-bar row) |
| V158 | Single-arm seated cable row | sa_cable_row (Seated single-arm cable row) |
| V159 | Iso-lateral row (plate-loaded) | plate_row (Plate-loaded row) |
| V160 | Selectorised seated row | machine_row (Machine row) |
| V161 | Smith row | smith_row (Smith machine row) |
| V165 | Lean-away cable lateral raise | lean_raise (Leaning cable raise) |
| V169 | Machine lateral raise | machine_raise (Machine lateral raise) |
| V170 | High-pulley cuff lateral raise | cable_raise (Cable lateral raise) |
| V172 | Seated DB lateral raise | lat_raise (Lateral raise) |
| V175 | Bent-over rear-delt DB fly | rear_fly (Rear delt fly) |
| V176 | Cable rear-delt fly | cable_rd_fly (Cable rear delt fly) |
| V178 | Band pull-apart | band_pullapart (Band pull-apart) |
| V180 | Cable front raise | cable_front_raise (Cable front raise) |
| V182 | EZ-bar curl | ez_curl (EZ-bar curl) |
| V183 | Supinating DB curl | db_curl (Dumbbell curl) |
| V184 | Straight-bar cable curl | cable_curl (Cable curl) |
| V185 | Spider curl | spider (Spider curl) |
| V186 | Machine preacher curl | pin_preacher (Pin-loaded machine preacher curl) |
| V189 | Concentration curl | conc_curl (Concentration curl) |
| V190 | Reverse EZ curl | rev_curl (Reverse-grip EZ curl) |
| V192 | Rope hammer curl | cable_hammer (Rope hammer curl) |
| V195 | Single-arm DB overhead extension | db_oh_ext (Dumbbell overhead triceps extension) |
| V198 | Rope pushdown | rope_pushdown (Cable rope triceps pushdown) |
| V200 | DB skull crusher | db_skull (Dumbbell skullcrusher) |
| V203 | Selectorised dip/triceps press | pin_tri_dip (Seated pin-loaded machine triceps dip) |
| V206 | Cable kickback | cable_kickback (Cable kickback) |
| V208 | Wrist roller | wrist_roller (Wrist roller) |
| V212 | Dumbbell shrug | db_shrug (DB shrug) |
| V213 | Trap-bar shrug | trapbar_shrug (Trap bar shrug) |
| V215 | Smith shrug | smith_shrug (Smith machine shrug) |
| V219 | Side plank | side_plank (Side plank) |
| V220 | Dead bug | dead_bug (Dead bug) |
| V221 | Bird dog | bird_dog (Bird dog) |
| V223 | Captain's chair leg raise | captains_leg (Captain's chair straight leg raise) |
| V224 | Weighted decline sit-up | decline_situp (Decline sit-up) |
| V225 | Selectorised crunch machine | machine_crunch (Crunch machine) |
| V227 | Suitcase carry | suitcase_carry (Suitcase carry) |
| V229 | Cable woodchop | woodchop (Cable woodchop) |
| V239 | Dumbbell Bulgarian with front-foot lean | bulgarian (Bulgarian split squat) |
| R01 | Isometric shoulder external rotation | iso_er (Isometric ER hold at neutral) |
| R02 | Side-lying dumbbell external rotation | er_sidelying (Side-lying external rotation) |
| R03 | Band external rotation at side | er_side (ER at side (band/cable)) |
| R04 | Prone Y/T raise | prone_t (Prone T raise) |
| R05 | Scaption raise | scaption (Scaption raise (thumbs up)) |
| R08 | Band pull-apart | band_pullapart (Band pull-apart) |
| R09 | Landmine press | landmine (Landmine press) |
| R11 | Wrist-extensor isometric | wrist_ext_iso (Wrist extension isometric) |
| R13 | Slow dumbbell wrist extension | ecc_wrist_ext (Eccentric wrist extension (light)) |
| R17 | Wrist flexion and extension curls | wrist_curl (Wrist curl) |
| R23 | Thoracic extension over roller | thoracic_ext (Thoracic extension over roller) |
| R26 | Graded 45° back extension | back_ext (45° back extension) |
| R29 | Glute bridge → single-leg bridge | glute_bridge (Glute bridge) |
| R30 | Isometric abduction → side-lying abduction | sidelying_abd |
| R31 | Copenhagen adduction | copenhagen |
| R36 | Nordic hamstring curl (rehab/prehab) | nordic (Nordic curl) |
| R37 | Spanish squat / wall-sit isometric | spanish_squat |
| R40 | Step-down / Peterson step-up | peterson_stepup |
| R43 | Pogo → hop progression | pogo_hop (Pogo hops) |

## Modifiers on an app exercise

| Code | Research name | Exercise and modifier |
|---|---|---|
| C002 | Low-bar back squat | squat {"barpos":"low"} |
| C059 | Rack pull | deadlift {"rom":{"kind":"pin"}} |
| C061 | Spoto press | bench {"pause":{"seconds":1,"at":"above_chest"}} |
| C062 | Pin press | bench {"rom":{"kind":"pin"}} |
| V001 | Pause back squat | squat {"pause":{"seconds":2,"at":"bottom"}} |
| V002 | Tempo squat (3-1-0) | squat {"tempo":"3-1-0"} |
| V003 | Pin squat | squat {"rom":{"kind":"pin"}} |
| V004 | Anderson squat | squat {"rom":{"kind":"pin"}} |
| V012 | Pause front squat | front_squat {"pause":{"seconds":2,"at":"bottom"}} |
| V013 | Front squat cross-arm | front_squat {"grip":"cross"} |
| V014 | SSB pause squat | safety_bar_squat {"pause":{"seconds":2,"at":"bottom"}} |
| V018 | Hack squat lengthened partials | hack {"rom":{"kind":"lengthened"}} |
| V019 | Pendulum lengthened partials | pendulum {"rom":{"kind":"lengthened"}} |
| V021 | 1.25-rep squat | squat {"quarter":true} |
| V031 | Leg press lengthened partials | leg_press {"rom":{"kind":"lengthened"}} |
| V033 | Squat with bands/chains | squat {"accom":"bands"} |
| V037 | Deficit deadlift | deadlift {"rom":{"kind":"deficit"}} |
| V038 | Block pull (below knee) | deadlift {"rom":{"kind":"pin"}} |
| V039 | Pause deadlift (below knee) | deadlift {"pause":{"seconds":2,"at":"below_knee"}} |
| V040 | Snatch-grip deadlift | deadlift {"grip":"wide"} |
| V045 | Deadlift against bands | deadlift {"accom":"bands"} |
| V046 | Sumo block pull | sumo_dl {"rom":{"kind":"pin"}} |
| V047 | Pause sumo deadlift | sumo_dl {"pause":{"seconds":2,"at":"below_knee"}} |
| V061 | Seated leg curl lengthened partials | leg_curl {"rom":{"kind":"lengthened"}} |
| V063 | Kas glute bridge | hip_thrust {"rom":{"kind":"partial"}} |
| V074 | Deficit reverse lunge | db_rev_lunge {"rom":{"kind":"deficit"}} |
| V076 | Front-foot-elevated split squat | db_split {"rom":{"kind":"deficit"}} |
| V083 | Leg extension lengthened partials | leg_ext {"rom":{"kind":"lengthened"}} |
| V094 | Calf raise lengthened partials | calf {"rom":{"kind":"lengthened"}} |
| V098 | Competition-pause bench | bench {"pause":{"seconds":1,"at":"chest"}} |
| V099 | Tempo bench (3-1-1) | bench {"tempo":"3-1-1"} |
| V100 | Wide-grip bench | bench {"grip":"wide"} |
| V102 | Bench with bands/chains | bench {"accom":"bands"} |
| V103 | Long-pause bench (3 s) | bench {"pause":{"seconds":3,"at":"chest"}} |
| V112 | Neutral-grip DB press | db_bench {"grip":"neutral"} |
| V113 | Deficit push-up | weighted_pushup {"rom":{"kind":"deficit"}} |
| V136 | Pec deck lengthened partials | pec_deck {"rom":{"kind":"lengthened"}} |
| V140 | Neutral-grip pull-up | pullup {"grip":"neutral"} |
| V145 | Wide-grip pulldown | pulldown {"grip":"wide"} |
| V162 | Wide-grip cable row | cable_row {"grip":"wide"} |
| V171 | Lateral raise lengthened partials | cable_raise {"rom":{"kind":"lengthened"}} |
| V173 | Heavy partial "cheat" laterals | lat_raise {"rom":{"kind":"partial"}} |
| V174 | Wide-grip cable upright row | cable_upright {"grip":"wide"} |
| V187 | Preacher lengthened partials | preacher {"rom":{"kind":"lengthened"}} |
| V207 | Overhead extension lengthened partials | oh_ext {"rom":{"kind":"lengthened"}} |
| V233 | Reverse-band bench | bench {"accom":"reverse"} |
| V236 | Pin squat from low pins | squat {"rom":{"kind":"pin"}} |
| V237 | Deficit Bulgarian split squat | bulgarian {"rom":{"kind":"deficit"}} |
| V238 | Snatch-grip RDL | rdl {"grip":"wide"} |
| V240 | Pause rack pull above knee | deadlift {"rom":{"kind":"pin"},"pause":{"seconds":2,"at":"above_knee"}} |
| R39 | Leg extension 90°→45° range | leg_ext {"rom":{"kind":"partial"}} |

## New exercises

| Code | Research name | App id and parent |
|---|---|---|
| C037 | Cable Y-raise | cable_y_raise under cable_raise |
| C058 | Zercher squat | zercher under squat |
| C060 | Larsen press | larsen under bench |
| C065 | Jefferson curl | jefferson_curl under - |
| C071 | Copenhagen plank | copenhagen under seated_add |
| C073 | Pike push-up | pike_pushup under ohp |
| C078 | Neck curl and neck extension | neck_curl under - |
| V005 | Box squat | box_squat under squat |
| V006 | Heel-elevated goblet squat | heel_goblet under goblet |
| V008 | Cyclist squat | cyclist_squat under squat |
| V010 | Smith feet-forward squat | smith_ff_squat under smith_squat |
| V011 | Cambered bar squat | cambered_squat under safety_bar_squat |
| V015 | Hatfield squat | hatfield_squat under safety_bar_squat |
| V017 | Reverse hack squat | rev_hack under hack |
| V020 | Belt squat march | belt_march under belt_squat |
| V022 | Overhead squat | oh_squat under squat |
| V023 | Landmine squat | landmine_squat under goblet |
| V025 | Assisted squat | assisted_squat under bw_squat |
| V027 | Box pistol | box_pistol under pistol |
| V028 | Shrimp squat | shrimp_squat under pistol |
| V030 | Leg press feet high/wide | leg_press_high under leg_press |
| V034 | Assisted sissy squat (bench) | sissy_machine under sissy |
| V035 | Wall sit | wall_sit under bw_squat |
| V036 | Spanish squat | spanish_squat under bw_squat |
| V041 | Stiff-leg deadlift | sldl under rdl |
| V044 | B-stance RDL | bstance_rdl under db_rdl |
| V048 | High-handle trap-bar deadlift | trap_bar_high under trap_bar |
| V052 | Seated good morning | seated_gm under good_morning |
| V053 | SSB good morning | ssb_gm under good_morning |
| V056 | Band-assisted Nordic | band_nordic under nordic |
| V057 | Slider leg curl | slider_curl under lying_curl |
| V058 | Single-leg seated leg curl | sl_seated_curl under leg_curl |
| V064 | Barbell glute bridge | bb_glute_bridge under hip_thrust |
| V065 | Single-leg hip thrust | sl_hip_thrust under hip_thrust |
| V068 | B-stance hip thrust | bstance_thrust under hip_thrust |
| V071 | Cable glute kickback | cable_kickback_glute under hip_thrust |
| V072 | Glute kickback machine | glute_kick_machine under cable_kickback_glute |
| V077 | Cossack squat | cossack under bw_lunge |
| V079 | Reverse lunge | db_rev_lunge under db_lunge |
| V080 | Peterson step-up | peterson_stepup under db_stepup |
| V082 | Reclined leg extension | reclined_leg_ext under leg_ext |
| V084 | Band-assisted reverse Nordic | band_rev_nordic under rev_nordic |
| V085 | Lean-forward hip abduction | lean_abd under seated_abd |
| V087 | Side-lying hip abduction | sidelying_abd under band_abd |
| V088 | Banded lateral walk | band_walk under band_abd |
| V089 | Short-lever Copenhagen | copenhagen_short under copenhagen |
| V095 | Donkey calf raise | donkey_calf under calf |
| V096 | Seated calf raise (DB on knees) | db_seated_calf under seated_calf |
| V097 | Tib bar raise | tib_bar under tib_raise |
| V101 | Slingshot bench | slingshot_bench under bench |
| V110 | Iso-lateral chest press (one arm) | iso_chest_press_1arm under machine_press |
| V111 | Dumbbell floor press | db_floor_press under floor_press |
| V115 | Incline push-up | incline_pushup under weighted_pushup |
| V116 | Knee push-up | knee_pushup under weighted_pushup |
| V117 | Ring push-up | ring_pushup under weighted_pushup |
| V119 | Bench dip | bench_dip under dip |
| V120 | Ring dip | ring_dip under dip |
| V122 | Push press | push_press under ohp |
| V129 | Wall handstand push-up | wall_hspu under pike_pushup |
| V130 | Half-kneeling single-arm DB press | hk_db_press under db_press |
| V131 | Low-to-high cable fly | low_high_fly under cable_fly |
| V132 | High-to-low cable fly | high_low_fly under cable_fly |
| V133 | Single-arm cable fly | sa_cable_fly under cable_fly |
| V135 | Incline dumbbell fly | incline_fly under fly |
| V143 | Negative pull-up | neg_pullup under pullup |
| V148 | Iso-lateral high row / pulldown | iso_high_row under pulldown |
| V150 | Dumbbell pullover | db_pullover under pullover |
| V151 | Machine pullover | machine_pullover under pullover |
| V153 | Yates row | yates_row under bb_row |
| V157 | Kroc row | kroc_row under db_row |
| V163 | Ring/TRX row | ring_row under inverted_row |
| V164 | Lean-in dumbbell lateral raise | lean_in_raise under lat_raise |
| V166 | Behind-the-back cable lateral | btb_cable_raise under cable_raise |
| V167 | Lying incline lateral raise | lying_incline_raise under lat_raise |
| V168 | Super-ROM lateral raise | super_rom_raise under lat_raise |
| V177 | Chest-supported rear-delt row | cs_rd_row under rear_fly |
| V179 | EZ-bar front raise (underhand) | ez_front_raise under db_front_raise |
| V181 | Prone Y-raise | prone_y_raise under m_rd_fly |
| V188 | Drag curl | drag_curl under bb_curl |
| V191 | Cross-body hammer curl | cross_hammer under hammer |
| V193 | Selectorised biceps machine | machine_curl under curl |
| V194 | Zottman curl | zottman under hammer |
| V196 | Seated EZ overhead extension | ez_oh_ext under oh_ext |
| V197 | Cross-body cable extension | katana_ext under oh_ext |
| V199 | Single-arm reverse-grip pushdown | sa_rev_pushdown under pushdown |
| V201 | Incline skull crusher | incline_skull under skullcrusher |
| V202 | Tate press | tate_press under db_skull |
| V204 | Diamond push-up | diamond_pushup under weighted_pushup |
| V205 | Bodyweight triceps extension (bar) | bw_tri_ext under skullcrusher |
| V209 | Behind-the-back barbell wrist curl | btb_wrist_curl under bb_wrist_curl |
| V210 | Plate pinch hold | plate_pinch under farmer |
| V211 | Fat-grip holds | fat_grip_hold under farmer |
| V214 | Kelso shrug | kelso_shrug under db_shrug |
| V216 | Neck harness extension | neck_harness under neck_curl |
| V217 | 4-way neck machine | neck_machine under neck_curl |
| V218 | Front plank | plank under ab_wheel |
| V222 | Hanging knee raise | hang_knee_raise under hang_raise |
| V226 | Barbell rollout | bb_rollout under ab_wheel |
| V228 | Landmine rotation | landmine_rotation under pallof |
| V230 | Dragon flag | dragon_flag under ab_wheel |
| V231 | L-sit | l_sit under hang_raise |
| V232 | Swiss-bar bench | swiss_bench under bench |
| V234 | Sled push | sled_push under leg_press |
| V235 | Smith JM press | smith_jm under jm_press |
| V241 | Band-resisted hip thrust | band_hip_thrust under hip_thrust |
| V242 | Behind-the-back cuff Y-raise | btb_y_raise under cable_y_raise |
| V243 | Smith-machine Larsen press | smith_larsen under larsen |
| R07 | Cable/band ER at 90° abduction | er_90 under er_side |
| R12 | Tyler twist | tyler_twist under ecc_wrist_ext |
| R14 | Reverse Tyler twist | rev_tyler_twist under ecc_wrist_flex |
| R15 | Hammer pronation/supination | pro_sup under ecc_wrist_ext |
| R18 | Grip and rice-bucket work | rice_bucket under wrist_ext_iso |
| R19 | Graded wrist weight-bearing | wrist_wb under wrist_ext_iso |
| R20 | Chin nod (craniocervical flexion) | chin_nod under - |
| R22 | 4-way neck isometric | neck_iso under - |
| R28 | Prone press-up | prone_pressup under - |
| R32 | Adductor squeeze isometric | add_squeeze under copenhagen |
| R33 | Askling Extender | askling_extender under - |
| R34 | Askling Diver | askling_diver under - |
| R35 | Askling Glider | askling_glider under - |
| R41 | Hip abduction + external rotation strengthening | clamshell under band_abd |
| R42 | Decline squat (eccentric) | decline_squat under - |
| R44 | Isometric calf raise | iso_calf under calf |
| R46 | Rathleff heel raise with towel | rathleff_raise under calf |
| R47 | Single-leg balance progression | balance_sl under - |
| R48 | Band eversion + tib raise | band_eversion under - |
| R24 | McGill curl-up | mcgill_curlup (from the bundle) |
| H001 | Decline push-up | decline_pushup under weighted_pushup |
| H002 | Archer push-up | archer_pushup under weighted_pushup |
| H003 | Incline one-arm push-up | incline_one_arm_pushup under weighted_pushup |
| H004 | One-arm push-up | one_arm_pushup under weighted_pushup |
| H005 | Pseudo-planche push-up | pseudo_planche_pushup under weighted_pushup |
| H006 | Towel fly push-up | towel_fly_pushup under fly |
| H007 | Hindu push-up | hindu_pushup under pike_pushup |
| H008 | Elevated pike push-up | elevated_pike_pushup under pike_pushup |
| H009 | Chest-to-wall handstand hold | chest_to_wall_handstand_hold under wall_hspu |
| H010 | Wall HSPU negative | wall_hspu_negative under wall_hspu |
| H011 | Chair dip | chair_dip under dip |
| H012 | Sphinx push-up | sphinx_pushup under bw_tri_ext |
| H013 | Doorframe row | doorframe_row under inverted_row |
| H014 | Towel door-handle row | towel_door_handle_row under inverted_row |
| H015 | Bedsheet door row | bedsheet_door_row under inverted_row |
| H016 | Single-arm sheet row | single_arm_sheet_row under db_row |
| H017 | Single-arm table row | single_arm_table_row under inverted_row |
| H018 | Floor sliding pull | floor_sliding_pull under pulldown |
| H019 | Prone swimmer | prone_swimmer under prone_t |
| H020 | Prone W raise | prone_w_raise under prone_t |
| H021 | Towel isometric row | towel_isometric_row under db_row |
| H022 | Towel isometric curl | towel_isometric_curl under db_curl |
| H023 | Doorframe biceps curl | doorframe_biceps_curl under db_curl |
| H024 | Table bodyweight curl | table_bodyweight_curl under db_curl |
| H025 | Sheet face pull | sheet_face_pull under face_pull |
| H026 | Floor back extension | floor_back_extension under back_ext |
| H027 | Lateral step-up | lateral_step_up under db_stepup |
| H028 | Skater squat | skater_squat under pistol |
| H029 | Doorframe-assisted pistol | doorframe_assisted_pistol under pistol |
| H030 | Single-leg wall sit | single_leg_wall_sit under wall_sit |
| H031 | Single-leg slider curl | single_leg_slider_curl under slider_curl |
| H032 | Hamstring walkout | hamstring_walkout under glute_bridge |
| H033 | Feet-elevated hamstring bridge | feet_elevated_hamstring_bridge under glute_bridge |
| H034 | Frog pump | frog_pump under glute_bridge |
| H035 | Curtsy lunge | curtsy_lunge under db_rev_lunge |
| H036 | Lateral lunge | lateral_lunge under cossack |
| H037 | Star side plank | star_side_plank under side_plank |
| H038 | Side-lying adductor raise | side_lying_adductor_raise under copenhagen_short |
| H039 | Hip airplane | hip_airplane under balance_sl |
| H040 | Eccentric heel drop | eccentric_heel_drop under calf |
| H041 | Hollow body hold | hollow_body_hold under dead_bug |
| H042 | Lying leg raise | lying_leg_raise under hang_raise |
| H043 | Reverse crunch | reverse_crunch under hang_raise |
| H044 | Towel body saw | towel_body_saw under ab_wheel |
| H045 | Kneeling towel rollout | kneeling_towel_rollout under ab_wheel |
| H046 | Slider pike | slider_pike under ab_wheel |
| H047 | Bear plank | bear_plank under plank |
| H048 | Backpack bear-hug carry | backpack_bear_hug_carry under farmer |
| H049 | Backpack overhead carry | backpack_overhead_carry under farmer |
| H050 | Towel wring | towel_wring under rice_bucket |
| H051 | DB floor fly | db_floor_fly under fly |
| H052 | Single-arm DB floor press | single_arm_db_floor_press under db_floor_press |
| H053 | Bridge DB floor press | bridge_db_floor_press under db_floor_press |
| H054 | DB squeeze press | db_squeeze_press under db_floor_press |
| H055 | Two-DB bent-over row | two_db_bent_over_row under bb_row |
| H056 | Head-supported DB row | head_supported_db_row under cs_db_row |
| H057 | Renegade row | renegade_row under db_row |
| H058 | DB rear-delt row | db_rear_delt_row under cs_rd_row |
| H059 | Standing DB overhead press | standing_db_overhead_press under ohp |
| H060 | Floor side-lying lateral raise | floor_side_lying_lateral_raise under lying_incline_raise |
| H062 | Wide DB upright row | wide_db_upright_row under cable_upright |
| H063 | Bent-over DB Y-raise | bent_over_db_y_raise under cable_y_raise |
| H064 | DB Cuban press | db_cuban_press under er_sidelying |
| H065 | Bed-edge lying DB curl | bed_edge_lying_db_curl under curl |
| H066 | DB reverse curl | db_reverse_curl under rev_curl |
| H068 | Two-hand DB overhead extension | two_hand_db_overhead_extension under oh_ext |
| H069 | Floor rolling DB extension | floor_rolling_db_extension under db_skull |
| H070 | DB front-rack squat | db_front_rack_squat under front_squat |
| H071 | DB suitcase squat | db_suitcase_squat under squat |
| H072 | DB sumo squat | db_sumo_squat under goblet |
| H073 | DB skater squat | db_skater_squat under skater_squat |
| H074 | DB lateral lunge | db_lateral_lunge under lateral_lunge |
| H075 | DB deficit RDL | db_deficit_rdl under db_rdl |
| H076 | DB suitcase deadlift | db_suitcase_deadlift under deadlift |
| H077 | DB good morning | db_good_morning under good_morning |
| H078 | DB side bend | db_side_bend under suitcase_carry |
| H079 | DB Turkish get-up | db_turkish_get_up under (own pattern) |
| H080 | DB suitcase march | db_suitcase_march under suitcase_carry |
| H081 | Heels-elevated BW squat | heels_elevated_bw_squat under bw_squat |
| H082 | Heels-elevated split squat | heels_elevated_split_squat under db_split |
| H083 | Double-leg decline squat | double_leg_decline_squat under decline_squat |
| H084 | Single-leg decline isometric | single_leg_decline_isometric under decline_squat |
| H085 | Single-leg decline squat | single_leg_decline_squat under decline_squat |
| H086 | Slant straight-knee calf stretch | slant_straight_knee_calf_stretch under (own pattern) |
| H087 | Slant bent-knee calf stretch | slant_bent_knee_calf_stretch under (own pattern) |
| H088 | Toes-up slant calf raise | toes_up_slant_calf_raise under calf |
| H089 | Slant side-tilt balance | slant_side_tilt_balance under balance_sl |
| H090 | Toes-elevated SL RDL | toes_elevated_sl_rdl under sl_rdl |
