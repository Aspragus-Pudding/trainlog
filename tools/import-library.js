#!/usr/bin/env node
/* Batch L: the exercise and rehab library import.
   node tools/import-library.js            parse docs/research/exercise-library.md, map every row onto the app's library
                                           (DECIDE below), write docs/library.json + docs/library-import.md, and embed
                                           docs/library.json byte-for-byte into index.html (<script id="library-data">).
   node tools/import-library.js --check    the same, but only report; nothing is written.
   The research was written without seeing the app; where it conflicts with the app's model, the app wins.
   docs/library-rules.md says how to add or edit an exercise from now on. */
const fs=require('fs'), path=require('path');
const ROOT=process.env.LIB_ROOT||path.join(__dirname,'..'), CHECK=process.argv.includes('--check');
const md=fs.readFileSync(path.join(ROOT,'docs/research/exercise-library.md'),'utf8');
const blocks=[...md.matchAll(/```\n([\s\S]*?)```/g)].map(m=>m[1].trim().split('\n').map(l=>l.split('|')));
const table=b=>{ const h=b[0]; return b.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]||'').trim()]))); };
const CORE=table(blocks[0]), VAR=table(blocks[1]), REHAB=table(blocks[2]);
const ROW=Object.fromEntries([...CORE,...VAR,...REHAB].map(r=>[r.id,r]));

/* ── 1. implements ── */
const IMPL={BB:'barbell',DB:'dumbbell',CB:'cable',PL:'plate',SEL:'selector',SM:'smith',BW:'bodyweight',BAND:'band',KB:'kettlebell',SPB:'specialty'};

/* ── 2. joint flags → movement tags. One flag can mean different joints in different movements, so the
   tag can depend on the exercise's pattern (the app's). Existing tags wherever one fits; six new ones. ── */
const NEW_TAGS={
  shoulder_ir_elevated:'The arm raised and turned in under load: upright rows to a high finish, bench dips.',
  elbow_flex_deep_loaded:'The elbow deeply bent under load, as at the bottom of a skull crusher or overhead extension.',
  spine_rotation_loaded:'Twisting the trunk under load: woodchops, landmine rotations, heavy one-arm rows with a twist.',
  adductor_lengthened_loaded:'The inner thigh loaded at long length: wide stances, the adductor machine opened wide, Copenhagens.',
  neck_loaded:'Load taken by the neck: neck curls and extensions, harness work, heavy shrugs.',
  knee_forward_loaded:'Knees travelling far past the toes under load: sissy squats, step-ups and squats with the heels raised (a high load on the kneecap tendon).'
};
const PRESS=['horizontal_press','vertical_press'], PULLV=['vertical_pull'], ELBOW=['elbow_extension','elbow_flexion'];
function tagFor(flag, pattern, exId){
  switch(flag){
    case 'SH-OH': return PULLV.includes(pattern)||/hang|leg_raise|l_sit/.test(exId||'')?'shoulder_hang_traction'
      :pattern==='elbow_extension'||/pullover/.test(exId||'')?'shoulder_overhead_endrange':'shoulder_overhead_loaded';
    case 'SH-ABD-ER': return pattern==='abduction'?'shoulder_elevation_abd':'shoulder_abd_er_loaded';
    case 'SH-HABD': return 'shoulder_horiz_abd_endrange';
    case 'SH-EXT': return 'shoulder_ext_endrange_loaded';
    case 'SH-IR-ELEV': return 'shoulder_ir_elevated';
    case 'EL-FLEX': return 'elbow_flex_deep_loaded';
    case 'EL-STRESS': return pattern==='elbow_flexion'?'elbow_flex_loaded_heavy':'elbow_ext_endrange_loaded';
    case 'WR-EXT': return pattern==='wrist'?'wrist_direct_loaded':'wrist_ext_loaded';
    case 'WR-DEV': return null;   // only C047 (EZ-bar skullcrusher, already in the app) carries it, and its app tags are kept
    case 'SP-AX': return 'spine_axial_heavy';
    case 'SP-FLEX': return 'spine_flex_loaded';
    case 'SP-EXT': return 'spine_ext_endrange_loaded';
    case 'SP-SHEAR': return 'hinge_heavy';
    case 'SP-ROT': return 'spine_rotation_loaded';
    case 'HIP-FLEX': return 'hip_flex_deep_loaded';
    case 'HIP-ADD': return 'adductor_lengthened_loaded';
    case 'KN-DEEP': return 'knee_flex_deep_loaded';
    case 'KN-FWD': return 'knee_forward_loaded';
    case 'KN-OKC': return 'knee_ext_open_chain';
    case 'ANK-DF': return pattern==='calf_raise'?'calf_endrange_loaded':'ankle_df_deep_loaded';
    case 'HAM-LONG': return 'hamstring_lengthened_loaded';
    case 'NECK': return 'neck_loaded';
    case 'GRIP': return 'max_grip_wrist_ext';
    case 'IMPACT': return 'plyo_jump_landing';
  }
  return null;
}
const FLAG_TABLE=[
  ['SH-OH','shoulder_overhead_loaded (presses, raises); shoulder_hang_traction (pull-ups, pulldowns, hanging work); shoulder_overhead_endrange (overhead triceps, pullovers)'],
  ['SH-ABD-ER','shoulder_abd_er_loaded; on lateral raises (to shoulder height, not end range) shoulder_elevation_abd'],
  ['SH-HABD','shoulder_horiz_abd_endrange'],['SH-EXT','shoulder_ext_endrange_loaded'],['SH-IR-ELEV','shoulder_ir_elevated (new)'],
  ['EL-FLEX','elbow_flex_deep_loaded (new)'],['EL-STRESS','elbow_ext_endrange_loaded; on curls elbow_flex_loaded_heavy'],
  ['WR-EXT','wrist_ext_loaded; on wrist curls wrist_direct_loaded'],['WR-DEV','none: only C047 carries it, an exercise the app already had (its tags are kept)'],
  ['SP-AX','spine_axial_heavy'],['SP-FLEX','spine_flex_loaded'],['SP-EXT','spine_ext_endrange_loaded'],['SP-SHEAR','hinge_heavy'],['SP-ROT','spine_rotation_loaded (new)'],
  ['HIP-FLEX','hip_flex_deep_loaded'],['HIP-ADD','adductor_lengthened_loaded (new; hip_adduction_compression is the gluteal-tendon position, not this)'],
  ['KN-DEEP','knee_flex_deep_loaded'],['KN-FWD','knee_forward_loaded (new; mapped to the ankle tag first, that marked 12% of the library red for stiff ankles: the research means kneecap-tendon load)'],['KN-OKC','knee_ext_open_chain'],
  ['ANK-DF','ankle_df_deep_loaded; on calf raises calf_endrange_loaded'],['HAM-LONG','hamstring_lengthened_loaded'],['NECK','neck_loaded (new)'],
  ['GRIP','max_grip_wrist_ext'],['IMPACT','plyo_jump_landing']];

/* ── 3. one decision per row ──
   '=id'                      the app already has it: the code is stored on that exercise, empty fields are filled
   'mod:id:{json}'            a modifier on the app's exercise (pause, tempo, range, grip, bar position, bands/chains,
                              lengthened partials, 1¼ reps): the code is stored with the modifier signature
   'new:id:parent[:opts]'     a new exercise under the app's parent; opts: named, manual, specialty, timed, rehab,
                              unilateral, bwplus (the bodyweight class with added weight)
   '?:why'                    the match is uncertain: left out, with its home-training children, for the maintainer
   'protocol:why'             not one exercise (a ladder, a bundle, a running plan): kept as data, not an entry
   'split:id,id'              one research row that is two exercises: each a new entry (SPLIT below), the row kept under splits
   'skip:why'                 left out for another stated reason */
const D={
 C001:'=squat', C002:'mod:squat:{"barpos":"low"}', C003:'=front_squat', C004:'=deadlift', C005:'=sumo_dl', C006:'=rdl',
 C007:'=bench', C008:'=ohp', C009:'=pullup', C010:'=pulldown', C011:'=bb_row', C012:'=chest_row', C013:'=cable_row',
 C014:'=bulgarian', C015:'=db_lunge', C016:'=leg_press', C017:'=hack', C018:'=pendulum', C019:'=belt_squat', C020:'=leg_ext',
 C021:'=leg_curl', C022:'=lying_curl', C023:'=nordic', C024:'=hip_thrust', C025:'=back_ext', C026:'=calf', C027:'=seated_calf',
 C028:'=incline_db', C029:'=db_bench',
 C030:'=machine_press',   // the maintainer (Nov 24): the flat machine press
 C031:'=dip', C032:'=weighted_pushup', C033:'=cable_fly', C034:'=pec_deck', C035:'=lat_raise', C036:'=cable_raise',
 C037:'new:cable_y_raise:cable_raise', C038:'=m_rd_fly', C039:'=face_pull', C040:'=bb_curl', C041:'=curl', C042:'=bayesian_curl',
 C043:'=preacher', C044:'=hammer', C045:'=oh_ext', C046:'=pushdown', C047:'=ez_skull', C048:'=jm_press', C049:'=cg_bench',
 C050:'=shrug', C051:'=hang_raise', C052:'=cable_crunch', C053:'=ab_wheel', C054:'=pallof', C055:'=farmer', C056:'=trap_bar',
 C057:'=safety_bar_squat', C058:'new:zercher:squat', C059:'mod:deadlift:{"rom":{"kind":"pin"}}', C060:'new:larsen:bench',
 C061:'mod:bench:{"pause":{"seconds":1,"at":"above_chest"}}', C062:'mod:bench:{"rom":{"kind":"pin"}}', C063:'=floor_press',
 C064:'=board_press', C065:'new:jefferson_curl:-:manual', C066:'=good_morning', C067:'=sissy', C068:'=rev_nordic',
 C069:'=seated_abd', C070:'=seated_add', C071:'new:copenhagen:seated_add', C072:'=inverted_row', C073:'new:pike_pushup:ohp',
 C074:'=db_row', C075:'=meadows_row', C076:'=wrist_curl', C077:'=tib_raise', C078:'new:neck_curl:-:manual',
 V001:'mod:squat:{"pause":{"seconds":2,"at":"bottom"}}', V002:'mod:squat:{"tempo":"3-1-0"}', V003:'mod:squat:{"rom":{"kind":"pin"}}',
 V004:'mod:squat:{"rom":{"kind":"pin"}}', V005:'new:box_squat:squat:named', V006:'new:heel_goblet:goblet:named', V007:'=goblet',
 V008:'new:cyclist_squat:squat:named', V009:'=smith_squat', V010:'new:smith_ff_squat:smith_squat:named',
 V011:'new:cambered_squat:safety_bar_squat:named,specialty', V012:'mod:front_squat:{"pause":{"seconds":2,"at":"bottom"}}',
 V013:'mod:front_squat:{"grip":"cross"}', V014:'mod:safety_bar_squat:{"pause":{"seconds":2,"at":"bottom"}}',
 V015:'new:hatfield_squat:safety_bar_squat:named,specialty', V016:'=v_squat', V017:'new:rev_hack:hack:named',
 V018:'mod:hack:{"rom":{"kind":"lengthened"}}', V019:'mod:pendulum:{"rom":{"kind":"lengthened"}}', V020:'new:belt_march:belt_squat:named,manual,timed',
 V021:'mod:squat:{"quarter":true}', V022:'new:oh_squat:squat:named', V023:'new:landmine_squat:goblet:named', V024:'=bw_squat',
 V025:'new:assisted_squat:bw_squat:named', V026:'=pistol', V027:'new:box_pistol:pistol:named', V028:'new:shrimp_squat:pistol:named',
 V029:'=leg_press_sl', V030:'new:leg_press_high:leg_press:named', V031:'mod:leg_press:{"rom":{"kind":"lengthened"}}', V032:'=sel_leg_press',
 V033:'mod:squat:{"accom":"bands"}', V034:'new:sissy_machine:sissy:named', V035:'new:wall_sit:bw_squat:named,timed',
 V036:'new:spanish_squat:bw_squat:named,timed', V037:'mod:deadlift:{"rom":{"kind":"deficit"}}', V038:'mod:deadlift:{"rom":{"kind":"pin"}}',
 V039:'mod:deadlift:{"pause":{"seconds":2,"at":"below_knee"}}', V040:'mod:deadlift:{"grip":"wide"}', V041:'new:sldl:rdl:named',
 V042:'=db_rdl', V043:'=sl_rdl', V044:'new:bstance_rdl:db_rdl:named', V045:'mod:deadlift:{"accom":"bands"}',
 V046:'mod:sumo_dl:{"rom":{"kind":"pin"}}', V047:'mod:sumo_dl:{"pause":{"seconds":2,"at":"below_knee"}}',
 V048:'new:trap_bar_high:trap_bar:named,specialty', V049:'=kb_swing', V050:'=cable_pullthrough', V051:'=smith_rdl',
 V052:'new:seated_gm:good_morning:named', V053:'new:ssb_gm:good_morning:named,specialty', V054:'=rev_hyper', V055:'=ghr',
 V056:'new:band_nordic:nordic:named', V057:'new:slider_curl:lying_curl:named', V058:'new:sl_seated_curl:leg_curl:named,unilateral',
 V059:'=standing_leg_curl', V060:'=leg_curl', V061:'mod:leg_curl:{"rom":{"kind":"lengthened"}}', V062:'=db_leg_curl',
 V063:'mod:hip_thrust:{"rom":{"kind":"partial"}}', V064:'new:bb_glute_bridge:hip_thrust:named', V065:'new:sl_hip_thrust:hip_thrust:named,unilateral',
 V066:'=smith_hip_thrust', V067:'=machine_hip_thrust', V068:'new:bstance_thrust:hip_thrust:named', V069:'=back_ext', V070:'=back_ext',
 V071:'new:cable_kickback_glute:hip_thrust:named', V072:'new:glute_kick_machine:cable_kickback_glute:named', V073:'=db_stepup',
 V074:'mod:db_rev_lunge:{"rom":{"kind":"deficit"}}', V075:'=smith_split', V076:'mod:db_split:{"rom":{"kind":"deficit"}}',
 V077:'new:cossack:bw_lunge:named', V078:'=db_split', V079:'new:db_rev_lunge:db_lunge:named', V080:'new:peterson_stepup:db_stepup:named',
 V081:'=sl_leg_ext', V082:'new:reclined_leg_ext:leg_ext:named', V083:'mod:leg_ext:{"rom":{"kind":"lengthened"}}', V084:'new:band_rev_nordic:rev_nordic:named',
 V085:'new:lean_abd:seated_abd:named', V086:'=cable_abd', V087:'new:sidelying_abd:band_abd:named', V088:'new:band_walk:band_abd:named',
 V089:'new:copenhagen_short:copenhagen:named', V090:'=cable_add', V091:'=press_calf', V092:'=smith_calf', V093:'=db_calf',
 V094:'mod:calf:{"rom":{"kind":"lengthened"}}', V095:'new:donkey_calf:calf:named', V096:'new:db_seated_calf:seated_calf:named',
 V097:'new:tib_bar:tib_raise:named,rehab', V098:'mod:bench:{"pause":{"seconds":1,"at":"chest"}}', V099:'mod:bench:{"tempo":"3-1-1"}',
 V100:'mod:bench:{"grip":"wide"}', V101:'new:slingshot_bench:bench:named', V102:'mod:bench:{"accom":"bands"}',
 V103:'mod:bench:{"pause":{"seconds":3,"at":"chest"}}', V104:'=bb_incline', V105:'=incline_db', V106:'=smith_incline', V107:'=incline_machine',
 V108:'=decline_press', V109:'=pin_chest_press',
 V110:'new:iso_chest_press_1arm:machine_press:named,unilateral',   // the maintainer: new, the one-arm version of C030
 V111:'new:db_floor_press:floor_press:named', V112:'mod:db_bench:{"grip":"neutral"}', V113:'mod:weighted_pushup:{"rom":{"kind":"deficit"}}',
 V114:'=weighted_pushup', V115:'new:incline_pushup:weighted_pushup:named', V116:'new:knee_pushup:weighted_pushup:named',
 V117:'new:ring_pushup:weighted_pushup:named', V118:'=assisted_dip', V119:'new:bench_dip:dip:named', V120:'new:ring_dip:dip:named',
 V121:'=seated_db_press', V122:'new:push_press:ohp:named', V123:'=z_press', V124:'=machine_ohp', V125:'=smith_ohp', V126:'=landmine',
 V127:'=arnold', V128:'=bn_press', V129:'new:wall_hspu:pike_pushup:named', V130:'new:hk_db_press:db_press:named,unilateral',
 V131:'new:low_high_fly:cable_fly:named', V132:'new:high_low_fly:cable_fly:named', V133:'new:sa_cable_fly:cable_fly:named,unilateral',
 V134:'=fly', V135:'new:incline_fly:fly:named', V136:'mod:pec_deck:{"rom":{"kind":"lengthened"}}', V137:'=cable_fly',
 V138:'=pullup', V139:'=chinup', V140:'mod:pullup:{"grip":"neutral"}', V141:'=band_pullup', V142:'=assisted_pullup',
 V143:'new:neg_pullup:pullup:named', V144:'=hang', V145:'mod:pulldown:{"grip":"wide"}', V146:'=neutral_pulldown', V147:'=sa_cable_pulldown',
 V148:'new:iso_high_row:pulldown:named',   // the maintainer: only a plate-loaded high row would match; the app has none
 V149:'=straight_arm_pd', V150:'new:db_pullover:pullover:named', V151:'new:machine_pullover:pullover:named', V152:'=pendlay_row',
 V153:'new:yates_row:bb_row:named', V154:'=seal_row', V155:'=cs_db_row', V156:'=tbar', V157:'new:kroc_row:db_row:named,unilateral',
 V158:'=sa_cable_row', V159:'=plate_row', V160:'=machine_row', V161:'=smith_row', V162:'mod:cable_row:{"grip":"wide"}',
 V163:'new:ring_row:inverted_row:named', V164:'new:lean_in_raise:lat_raise:named', V165:'=lean_raise',
 V166:'new:btb_cable_raise:cable_raise:named', V167:'new:lying_incline_raise:lat_raise:named', V168:'new:super_rom_raise:lat_raise:named',
 V169:'=machine_raise', V170:'=cable_raise', V171:'mod:cable_raise:{"rom":{"kind":"lengthened"}}', V172:'=lat_raise',
 V173:'mod:lat_raise:{"rom":{"kind":"partial"}}', V174:'mod:cable_upright:{"grip":"wide"}', V175:'=rear_fly', V176:'=cable_rd_fly',
 V177:'new:cs_rd_row:rear_fly:named', V178:'=band_pullapart', V179:'new:ez_front_raise:db_front_raise:named', V180:'=cable_front_raise',
 V181:'new:prone_y_raise:m_rd_fly:named',   // the maintainer: a new training exercise, the same movement as R04 (SAME_MOVE)
 V182:'=ez_curl', V183:'=db_curl', V184:'=cable_curl', V185:'=spider', V186:'=pin_preacher', V187:'mod:preacher:{"rom":{"kind":"lengthened"}}',
 V188:'new:drag_curl:bb_curl:named', V189:'=conc_curl', V190:'=rev_curl', V191:'new:cross_hammer:hammer:named', V192:'=cable_hammer',
 V193:'new:machine_curl:curl:named', V194:'new:zottman:hammer:named', V195:'=db_oh_ext', V196:'new:ez_oh_ext:oh_ext:named',
 V197:'new:katana_ext:oh_ext:named,unilateral', V198:'=rope_pushdown', V199:'new:sa_rev_pushdown:pushdown:named,unilateral', V200:'=db_skull',
 V201:'new:incline_skull:skullcrusher:named', V202:'new:tate_press:db_skull:named', V203:'=pin_tri_dip', V204:'new:diamond_pushup:weighted_pushup:named',
 V205:'new:bw_tri_ext:skullcrusher:named', V206:'=cable_kickback', V207:'mod:oh_ext:{"rom":{"kind":"lengthened"}}', V208:'=wrist_roller',
 V209:'new:btb_wrist_curl:bb_wrist_curl:named', V210:'new:plate_pinch:farmer:named,timed', V211:'new:fat_grip_hold:farmer:named,timed',
 V212:'=db_shrug', V213:'=trapbar_shrug', V214:'new:kelso_shrug:db_shrug:named', V215:'=smith_shrug', V216:'new:neck_harness:neck_curl:named,manual',
 V217:'new:neck_machine:neck_curl:named,manual', V218:'new:plank:ab_wheel:named,timed', V219:'=side_plank', V220:'=dead_bug', V221:'=bird_dog',
 V222:'new:hang_knee_raise:hang_raise:named', V223:'=captains_leg', V224:'=decline_situp', V225:'=machine_crunch', V226:'new:bb_rollout:ab_wheel:named',
 V227:'=suitcase_carry', V228:'new:landmine_rotation:pallof:named', V229:'=woodchop', V230:'new:dragon_flag:ab_wheel:named', V231:'new:l_sit:hang_raise:named,timed',
 V232:'new:swiss_bench:bench:named,specialty', V233:'mod:bench:{"accom":"reverse"}', V234:'new:sled_push:leg_press:named,manual,timed',
 V235:'new:smith_jm:jm_press:named', V236:'mod:squat:{"rom":{"kind":"pin"}}', V237:'mod:bulgarian:{"rom":{"kind":"deficit"}}',
 V238:'mod:rdl:{"grip":"wide"}', V239:'=bulgarian', V240:'mod:deadlift:{"rom":{"kind":"pin"},"pause":{"seconds":2,"at":"above_knee"}}',
 V241:'new:band_hip_thrust:hip_thrust:named', V242:'new:btb_y_raise:cable_y_raise:named', V243:'new:smith_larsen:larsen:named',
 R01:'=iso_er', R02:'=er_sidelying', R03:'=er_side', R04:'=prone_t', R05:'=scaption',
 R06:'split:serratus_wall_slide,pushup_plus',   // the maintainer: two new rehab rows
 R07:'new:er_90:er_side:rehab', R08:'=band_pullapart', R09:'=landmine',
 R10:'protocol:A return-to-bench ladder (floor press, then board or high pin, then paused full range), kept as ladder data for the rehab engine.',
 R11:'=wrist_ext_iso', R12:'new:tyler_twist:ecc_wrist_ext:rehab', R13:'=ecc_wrist_ext', R14:'new:rev_tyler_twist:ecc_wrist_flex:rehab',
 R15:'new:pro_sup:ecc_wrist_ext:rehab', R16:'protocol:The curl and the pushdown done slowly (3 s each way); logged on those with a tempo, not a separate exercise.',
 R17:'=wrist_curl', R18:'new:rice_bucket:wrist_ext_iso:rehab,timed', R19:'new:wrist_wb:wrist_ext_iso:rehab,timed', R20:'new:chin_nod:-:rehab,timed',
 R21:'protocol:Rows, band rows and face pulls for neck pain; logged on those exercises.', R22:'new:neck_iso:-:rehab,timed', R23:'=thoracic_ext',
 R24:'protocol:The McGill Big 3 is three exercises (curl-up, side plank, bird dog); side plank and bird dog are in the app, the curl-up is added (mcgill_curlup).',
 R25:'protocol:A walking plan, not a lift; walking is an activity (batch N Part 3, quiet cardio).', R26:'=back_ext',
 R27:'protocol:A return-to-deadlift ladder (dowel hinge, kettlebell deadlift, RDL, deadlift), kept as ladder data for the rehab engine.',
 R28:'new:prone_pressup:-:rehab', R29:'=glute_bridge', R30:'=sidelying_abd', R31:'=copenhagen', R32:'new:add_squeeze:copenhagen:rehab,timed',
 R33:'new:askling_extender:-:rehab', R34:'new:askling_diver:-:rehab', R35:'new:askling_glider:-:rehab', R36:'=nordic', R37:'=spanish_squat',
 R38:'protocol:Heavy slow resistance on the leg press, hack or squat (3 s each way, 15RM down to 6RM over 12 weeks); logged on those exercises with a tempo.',
 R39:'mod:leg_ext:{"rom":{"kind":"partial"}}', R40:'=peterson_stepup', R41:'new:clamshell:band_abd:rehab', R42:'new:decline_squat:-:rehab',
 R43:'=pogo_hop', R44:'new:iso_calf:calf:rehab,timed', R45:'protocol:Heavy slow seated and standing calf raises; logged on Seated and Standing calf raise with a tempo.',
 R46:'new:rathleff_raise:calf:rehab', R47:'new:balance_sl:-:rehab,timed', R48:'new:band_eversion:-:rehab', R49:'protocol:A return-to-running plan, not a lift.'
};
// a row the maintainer split in two (Nov 24): each part's own name, implement and setup; the rest of the row is shared
const SPLIT={serratus_wall_slide:{name:'Serratus wall slide', implement:'BAND', setup:['Forearms on wall with a band'], harder:'Push-up plus'},
  pushup_plus:{name:'Push-up plus', implement:'BW', setup:['Push-up position: wall, then incline, then floor'], easier:'Serratus wall slide'}};
/* A training exercise and a rehab row that are the same movement (the maintainer, Nov 24): How to do it says so on
   both. Their histories stay apart (a rehab set is never a training set). */
const SAME_MOVE={prone_y_raise:'prone_t'};
/* Research flags adopted on exercises the app already had (the maintainer, Nov 24): added to their own tags at load.
   The other "would add a tag" rows stay listed under Conflicts. Face pull (C039) and the incline machine press (V107)
   were picked too, but wait for the maintainer (D95): the shoulder protocol lists face pulls and fixed-path machine
   pressing as safe for anterior instability (§56, §47), and the incline press's tag would put an old AC-joint
   separation over the 10% red limit. */
const ADOPT_TAGS={arnold:'V127'};
// a few exercises the research names inside a bundle row; added so the bundle can point at them
const EXTRA_NEW={mcgill_curlup:{name:'McGill curl-up',parent:'-',implement:'bodyweight',from:'R24',opts:['rehab']}};
// own fields for new entries with no app parent ('-')
const ORPHAN={
  jefferson_curl:{pattern:'hinge',vol:{lower_back:1,hamstrings:.5}}, neck_curl:{pattern:'shrug',vol:{traps:1}},
  chin_nod:{pattern:'rehab_neck',vol:{}}, neck_iso:{pattern:'rehab_neck',vol:{}}, prone_pressup:{pattern:'prehab_lowback',vol:{}},
  askling_extender:{pattern:'rehab_hamstring',vol:{}}, askling_diver:{pattern:'rehab_hamstring',vol:{}}, askling_glider:{pattern:'rehab_hamstring',vol:{}},
  decline_squat:{pattern:'prehab_knee',vol:{}}, balance_sl:{pattern:'rehab_ankle',vol:{}}, band_eversion:{pattern:'rehab_ankle',vol:{}},
  serratus_wall_slide:{pattern:'rehab_shoulder',vol:{}}, pushup_plus:{pattern:'rehab_shoulder',vol:{}},
  mcgill_curlup:{pattern:'prehab_lowback',vol:{}}
};
/* Names with a person or a brand in them, and "why" lines that carry a name or a study number, are rewritten
   for the app; the research text stays in docs/library.json under "research". */
const NAME={cable_y_raise:'Cable Y-raise', zercher:'Zercher squat', larsen:'Larsen press', jefferson_curl:'Jefferson curl', copenhagen:'Copenhagen plank',
  pike_pushup:'Pike push-up', neck_curl:'Neck curl and extension', db_seated_calf:'Seated dumbbell calf raise', hk_db_press:'Half-kneeling one-arm dumbbell press',
  ring_row:'Ring or TRX row', db_rev_lunge:'Dumbbell reverse lunge', er_90:'External rotation at 90° (band or cable)', smith_jm:'Smith machine JM press',
  pro_sup:'Forearm rotation with a hammer', rice_bucket:'Grip and rice bucket', wrist_wb:'Graded wrist weight-bearing', chin_nod:'Chin nod',
  neck_iso:'Four-way neck isometric', prone_pressup:'Prone press-up', add_squeeze:'Adductor squeeze', iso_calf:'Isometric calf raise',
  rathleff_raise:'Heel raise with a towel under the toes', balance_sl:'Single-leg balance', band_eversion:'Band eversion', clamshell:'Clamshell',
  decline_squat:'Decline board squat', tyler_twist:'Twist bar wrist extension', rev_tyler_twist:'Twist bar wrist flexion', btb_y_raise:'Behind-the-back cuff Y-raise',
  smith_larsen:'Smith machine Larsen press', swiss_bench:'Swiss bar bench press', machine_curl:'Machine biceps curl', ez_oh_ext:'Seated EZ-bar overhead extension',
  katana_ext:'Cross-body cable extension', tib_bar:'Tib bar raise', band_walk:'Banded lateral walk', sl_seated_curl:'Single-leg seated leg curl',
  trap_bar_high:'High-handle trap bar deadlift', heel_goblet:'Heel-elevated goblet squat', smith_ff_squat:'Smith machine feet-forward squat',
  cambered_squat:'Cambered bar squat', hatfield_squat:'Hatfield squat', box_squat:'Box squat', cyclist_squat:'Cyclist squat', rev_hack:'Reverse hack squat',
  belt_march:'Belt squat march', oh_squat:'Overhead squat', landmine_squat:'Landmine squat', assisted_squat:'Assisted squat', box_pistol:'Box pistol',
  shrimp_squat:'Shrimp squat', leg_press_high:'Leg press, feet high and wide', sissy_machine:'Assisted sissy squat', wall_sit:'Wall sit', spanish_squat:'Spanish squat',
  sldl:'Stiff-leg deadlift', bstance_rdl:'B-stance RDL', seated_gm:'Seated good morning', ssb_gm:'Safety squat bar good morning', band_nordic:'Band-assisted Nordic',
  slider_curl:'Slider leg curl', bb_glute_bridge:'Barbell glute bridge', sl_hip_thrust:'Single-leg hip thrust', bstance_thrust:'B-stance hip thrust',
  cable_kickback_glute:'Cable glute kickback', glute_kick_machine:'Glute kickback machine', cossack:'Cossack squat', peterson_stepup:'Peterson step-up',
  reclined_leg_ext:'Reclined leg extension', band_rev_nordic:'Band-assisted reverse Nordic', lean_abd:'Lean-forward hip abduction', sidelying_abd:'Side-lying hip abduction',
  copenhagen_short:'Short-lever Copenhagen', donkey_calf:'Donkey calf raise', slingshot_bench:'Slingshot bench press', db_floor_press:'Dumbbell floor press',
  incline_pushup:'Incline push-up', knee_pushup:'Knee push-up', ring_pushup:'Ring push-up', bench_dip:'Bench dip', ring_dip:'Ring dip', push_press:'Push press',
  wall_hspu:'Wall handstand push-up', low_high_fly:'Low-to-high cable fly', high_low_fly:'High-to-low cable fly', sa_cable_fly:'Single-arm cable fly',
  incline_fly:'Incline dumbbell fly', neg_pullup:'Negative pull-up', db_pullover:'Dumbbell pullover', machine_pullover:'Machine pullover', yates_row:'Underhand barbell row',
  kroc_row:'Kroc row', lean_in_raise:'Lean-in dumbbell lateral raise', btb_cable_raise:'Behind-the-back cable lateral raise', lying_incline_raise:'Lying incline lateral raise',
  super_rom_raise:'Super-range lateral raise', cs_rd_row:'Chest-supported rear-delt row', ez_front_raise:'EZ-bar front raise', drag_curl:'Drag curl',
  cross_hammer:'Cross-body hammer curl', zottman:'Zottman curl', sa_rev_pushdown:'Single-arm reverse-grip pushdown', incline_skull:'Incline skullcrusher',
  tate_press:'Tate press', diamond_pushup:'Diamond push-up', bw_tri_ext:'Bodyweight triceps extension', btb_wrist_curl:'Behind-the-back wrist curl',
  plate_pinch:'Plate pinch hold', fat_grip_hold:'Fat-grip hold', kelso_shrug:'Chest-supported shrug', neck_harness:'Neck harness extension', neck_machine:'Four-way neck machine',
  plank:'Front plank', hang_knee_raise:'Hanging knee raise', bb_rollout:'Barbell rollout', landmine_rotation:'Landmine rotation', dragon_flag:'Dragon flag', l_sit:'L-sit',
  sled_push:'Sled push', band_hip_thrust:'Band hip thrust', askling_extender:'Hamstring extender (lying)', askling_diver:'Hamstring diver', askling_glider:'Hamstring glider',
  mcgill_curlup:'Curl-up', iso_chest_press_1arm:'One-arm iso-lateral chest press', iso_high_row:'Iso-lateral high row', prone_y_raise:'Prone Y-raise',
  serratus_wall_slide:'Serratus wall slide', pushup_plus:'Push-up plus'};
const PEOPLE=/Nippard|Israetel|Menno|Henselmans|Mentzer|Meadows|Kroczaleski|Simmons|Hatfield|Bell\b|Anderson|Arnold|Westside|Contreras|Calgary|Juggernaut|EliteFTS|Barbell Medicine|Stronger By Science|\bSBS\b|\bRP\b|Kneesovertoes|Mountain Dog|Paul Carter|Teo|Blakley|McGill|Maeo|Pedrosa|Kassiano|Wolf|Stasinaki|Harøy|van Dyk|Askling|Kongsgaard|Silbernagel|Rathleff|Tyler|Littlewood|Hölmich|Swinton|Kikuchi|Calatayud|PeerJ|JOSPT|Cochrane|Hayden|Prehab Guys|r\/bodyweightfitness|T-Nation|Spoto|Larsen et al/;
const NUMBERS=/\d+(\.\d+)?\s*%|\b(19|20)\d{2}\b|\d\s*×|\+\d/;
const WHY_GENERIC={ // rewritten "why people like it" lines (no names, no study numbers)
  C001:'The best all-round leg builder that also builds strength', C006:'Huge hamstring stretch under load', C020:'Isolates the quads; leaning back stretches the front of the hip',
  C021:'Trains the hamstrings at long length, with the torso leaned forward', C022:'Works when there is no seated curl machine', C023:'A favourite for keeping hamstrings healthy',
  C031:'A classic for chest and triceps with only bars', C032:'Equipment-free chest growth', C035:'Shoulder width with minimal gear', C036:'Keeps tension at the bottom, where dumbbells give none',
  C037:'A big side-delt stretch, both sides at once', C041:'Stretches the long head of the biceps', C042:'A stretch-focused curl with tension all the way',
  C045:'Trains the triceps long head at long length', C046:'Easy, elbow-friendly triceps volume', C048:'Carries over to the top half of the bench', C056:'Easier to learn, less back stress',
  C060:'Takes leg drive out of the bench', C061:'Off-chest strength and bar-path control', C065:'Loved by mobility coaches for a strong-back feel', C066:'The back of the legs and hips, for squats and pulls',
  C071:'A favourite for groin-injury prevention, at home', C075:'A unique stretch and upper-back thickness', C077:'Shin and knee-friendly prep', C078:'Neck size and resilience for contact sports',
  C063:'Bench work for cranky shoulders; works at home', C064:'Overloads the top half of the bench', C059:'Overloads the top of the pull and builds traps', C043:'Strict and hard to cheat, with a stretch at the bottom',
  C018:'A deep quad stretch with little back load', C017:'A top quad builder in commercial gyms', C019:'Leg volume when the back is cranky', C016:'Heavy leg work without loading the spine',
  C012:'Back growth with no low-back fatigue', C009:'The best home lat builder', C028:'Upper-chest growth and shoulder-friendly pressing', C030:'Train close to failure safely with no spotter',
  C039:'Rear delts and the rotator cuff, for shoulder health and posture', C010:'Easy to load and progress for lat size', C013:'Constant tension and a big stretch',
  C014:'Big leg growth with light weights; works at home', C015:'A glute and quad pump finisher', C002:'Moves the most weight for powerlifting', C003:'Quad-heavy, kinder to the lower back',
  C004:'The most direct test of total-body strength', C005:'A shorter range that suits some body proportions', C007:'The main upper-body strength lift', C008:'Builds pressing strength and shoulders',
  C011:'Builds the back and teaches holding a hinge', C024:'Heavy glute loading without much fatigue', C025:'A cheap glute and hamstring builder', C026:'Calves respond to a deep stretch',
  C027:'Hits the soleus the standing raise misses', C029:'A freer path, often easier on the joints', C033:'Tension in the stretch, where dumbbell flyes lose it', C034:'Easy to train hard; stable and joint-friendly',
  C038:'An easy way to grow stubborn rear delts', C040:'A loadable staple', C044:'Arm thickness; elbow-friendly', C047:'A heavy long-head stretch', C049:'Triceps mass and bench carryover',
  C050:'Simple trap growth', C051:'Hard ab work with only a bar', C052:'Progressive loading for abs', C053:'Strong anti-extension core work', C054:'Core control without bending the spine',
  C055:'Grip, traps and conditioning in one', C057:'Squats when shoulders or elbows hurt', C058:'Builds the upper back and the brace', C062:'Builds the weak spot', C067:'A deep quad stretch with no machine',
  C068:'Quad and knee tolerance at home', C069:'Upper-glute work', C070:'The adductors are a big, often-skipped muscle', C072:'A home row with only a rack', C073:'A shoulder press at home',
  C074:'Simple, home-friendly, a big stretch', C076:'Forearm size and elbow resilience',
  V004:'A sticking-point builder', V005:'Teaches sitting back to a set depth', V008:'A quad-focused squat favourite', V015:'Balance taken away, so the legs do all the work',
  V018:'An alternative with similar results to full range', V019:'An alternative with similar results to full range', V020:'Conditioning with no low-back load', V031:'An alternative with similar results to full range',
  V054:'A glute and hamstring favourite', V060:'The seated curl with the most stretch', V069:'A glute-focused back extension', V082:'Trains the front-of-hip quad muscle at long length',
  V083:'An alternative with similar results to full range', V085:'Upper-glute work', V093:'Calves through a full stretch, at home', V094:'An alternative with similar results to full range',
  V095:'An old-school calf favourite', V101:'Overload with less shoulder stress', V105:'A low bench angle for the upper chest', V114:'Loaded push-ups can build the chest like a bench press',
  V124:'A front-delt favourite', V136:'An alternative with similar results to full range', V147:'A lat favourite', V151:'A classic lat machine', V157:'Heavy, high-rep back work',
  V164:'A side-delt stretch favourite', V166:'A quick side-delt cuff version', V168:'A full-range side-delt favourite', V170:'Tension in the stretch',
  V171:'An alternative with similar results to full range', V179:'A front-delt favourite', V187:'An alternative with similar results to full range', V195:'Trains the long head at long length',
  V196:'Trains the long head at long length', V207:'An alternative with similar results to full range', V239:'Leaning forward shifts it to the glutes', V242:'A quick side-delt alternative',
  V234:'No lowering phase, so little soreness'
};
// research rows whose grade is about a principle the app shows more cautiously (batch L: the preprint gets C wording)
const GRADE_OVERRIDE={V082:'C'};

/* The rehab table has no joint-flag column. Where a row's own setup puts a joint in a tagged position, the tag is
   added so condition warnings (and the rehab block's safety check) apply: external rotation at 90° is the
   position anterior instability avoids. */
const EXTRA_TAGS={er_90:['shoulder_abd_er_loaded'], wrist_wb:['wrist_ext_loaded'], prone_pressup:['spine_ext_endrange_loaded'],
  decline_squat:['knee_flex_deep_loaded','ankle_df_deep_loaded'], rathleff_raise:['calf_endrange_loaded'], askling_extender:['hamstring_lengthened_loaded'],
  askling_diver:['hamstring_lengthened_loaded'], askling_glider:['hamstring_lengthened_loaded'], tyler_twist:['wrist_direct_loaded'],
  rev_tyler_twist:['wrist_direct_loaded'], pro_sup:['wrist_direct_loaded'], neck_iso:['neck_loaded'], iso_calf:['calf_endrange_loaded'],
  // push-up position: the hands take weight with the wrist bent back, as on the wrist weight-bearing row
  pushup_plus:['wrist_ext_loaded']};
/* Tags a new entry inherits that its own position doesn't have (removed, each with its reason). */
const TAG_REMOVE={diamond_pushup:{remove:['shoulder_horiz_abd_endrange'],why:'hands together: the elbows stay tucked, as on the close-grip bench (which carries no horizontal-abduction tag); the research flags only the wrists and elbows (V204)'},
  heel_goblet:{remove:['ankle_df_deep_loaded'],why:'heels raised: the board takes the deep ankle bend out'},cyclist_squat:{remove:['ankle_df_deep_loaded'],why:'heels raised: the board takes the deep ankle bend out'},
  spanish_squat:{remove:['ankle_df_deep_loaded'],why:'the strap keeps the shins vertical'},wall_sit:{remove:['ankle_df_deep_loaded'],why:'shins vertical against the wall'},
  box_squat:{remove:['ankle_df_deep_loaded'],why:'sitting back to a box keeps the shins near vertical'},db_rev_lunge:{remove:['ankle_df_deep_loaded'],why:'stepping back keeps the front shin upright'},
  heels_elevated_bw_squat:{remove:['ankle_df_deep_loaded'],why:'heels raised: the board takes the deep ankle bend out'},heels_elevated_split_squat:{remove:['ankle_df_deep_loaded'],why:'heels raised: the board takes the deep ankle bend out'},
  db_sumo_squat:{remove:['ankle_df_deep_loaded'],why:'a wide stance keeps the shins near vertical'},bridge_db_floor_press:{remove:['shoulder_horiz_abd_endrange'],why:'the floor stops the elbows: no deep chest stretch'},
  db_floor_fly:{remove:['shoulder_horiz_abd_endrange'],why:'the floor stops the elbows (the research: the floor limits shoulder over-stretch)'}};
const TAG_OVERRIDE={copenhagen:{tags:['adductor_lengthened_loaded'], why:'a side plank: the research flags only the adductors at long length (HIP-ADD); the machine parent\'s hip-across-the-midline tag is the pad pressing the hip, not this'}};
// text the app can't show as written (a number reads as a study figure)
const TEXT_FIX={'going to 100% effort':'pushing as hard as you can'};
const CAUTION={jefferson_curl:'Keep it bodyweight or very light, slow, and only as far as is comfortable. Not for anyone with disc trouble or pain when bending forward.'};
const REGION_JOINT_R={'Shoulder':'shoulder','Elbow':'elbow','Elbow/wrist':'elbow','Wrist/hand':'wrist','Lower back':'low back','Hip':'hip','Hip/thigh':'hip',
  'Knee':'knee','Knee/ankle':'knee','Knee/hip':'knee','Ankle/foot':'ankle'};
/* Rehab rows linked to injury-library entries (do_more_of: the rehab block; warmup: rows whose prehab dose is a
   warm-up). Never to an instability entry: the shoulder rows there are already the app's own, checked against it. */
const INJ_LINKS={R01:['sh_rcrsp','sh_impingement'],R02:['sh_rcrsp','sh_impingement'],R03:['sh_rcrsp','sh_impingement'],R05:['sh_rcrsp','sh_impingement'],
  R07:['sh_rcrsp'],R08:['sh_rcrsp','sh_impingement'],R11:['el_lateral_tendinopathy','el_pain'],R12:['el_lateral_tendinopathy','el_pain'],R13:['el_lateral_tendinopathy','el_pain'],
  R14:['el_pain'],R15:['el_pain','wr_pain'],R17:['wr_pain'],R18:['wr_pain'],R19:['wr_pain','wr_dorsal_impingement'],R20:['neck_pain'],R22:['neck_pain'],
  R23:['th_pain','neck_mobility'],R26:['lb_chronic_nonspecific'],R28:['lb_chronic_nonspecific','lb_acute_flare'],R29:['hip_gluteal_tendinopathy','hip_pain'],
  R30:['hip_gluteal_tendinopathy'],R31:['hip_pain','thigh_strain'],R32:['hip_pain','thigh_strain'],R33:['thigh_hamstring_strain'],R34:['thigh_hamstring_strain'],
  R35:['thigh_hamstring_strain'],R36:['thigh_hamstring_strain','thigh_strain'],R37:['kn_patellar_tendinopathy','kn_pfp'],R39:['kn_pfp'],R40:['kn_pfp'],R41:['kn_pfp'],
  R42:['kn_patellar_tendinopathy'],R43:['kn_patellar_tendinopathy','an_achilles_mid'],R44:['an_achilles_mid'],R46:['an_plantar_heel'],R47:['an_lateral_sprain','an_pain'],
  R48:['an_lateral_sprain']};

/* ── 4. parse helpers ── */
const list=s=>String(s||'').split(';').map(x=>x.trim()).filter(x=>x&&x!=='-').map(x=>TEXT_FIX[x]||x);
const gradeOf=g=>{ const m=String(g||'').match(/\b([ABCD])\b/); return m?m[1]:null; };
const repsOf=s=>{ const m=String(s||'').match(/^(\d+)-(\d+)(?!\s*s)/); return m&&!/\bs\b|m\b|steps|trips/.test(s)?[+m[1],+m[2]]:null; };
const rirOf=s=>{ const m=String(s||'').match(/@(\d)(?:-(\d))?RIR/); return m?[+m[1],+(m[2]||m[1])]:null; };
const flagsOf=s=>list(s).map(x=>x.replace(/\s*risk$/,'').trim()).filter(x=>/^[A-Z]{2,4}(-[A-Z]+)*$/.test(x));
const coreOf=id=>{ let r=ROW[id]; for(let i=0;i<4&&r&&r.parent&&r.parent!=='-'&&!r.setup;i++) r=ROW[r.parent]; return r; };   // the variant's core row (inheritance)

/* ── 5. load the app library the way the tests do ── */
function loadApp(){
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
  const stub=()=>{ const f=function(){}; return new Proxy(f,{ get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); }, set(){ return true; }, apply(){ return stub(); }, construct(){ return stub(); } }); };
  const store={}, ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
  const doc=new Proxy(stub(),{get(t,k){ if(k==='getElementById') return id=>{ if(id==='library-data') return {textContent:'{}'};
    const m=html.match(new RegExp('<script type="application/json" id="'+id+'">([\\s\\S]*?)</script>')); return m?{textContent:m[1]}:stub(); }; return stub(); }});
  const fn=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',
    src+'\n;return {EX, exById, CUES, INJ, baseTags:(typeof baseTags==="function"?baseTags:null), exTags:(typeof exTags==="function"?exTags:null)};');
  return fn(doc,stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}});
}
const APP=loadApp(), byId=APP.exById, CUES=Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT,'docs/coaching-cues.json'),'utf8')).map(c=>[c.id,c]));
const appEx=id=>byId[id]||null;
const LIB_IN=(()=>{ try{ return JSON.parse(fs.readFileSync(path.join(ROOT,'docs/library.json'),'utf8')); }catch(e){ return null; } })();
const addedIds=new Set(LIB_IN?(LIB_IN.added||[]).map(a=>a.id):[]);
const isOriginal=id=>!!byId[id]&&!addedIds.has(id);     // in the app before this import (the app is loaded with the last import applied)

/* ── 6. build ── */
const out={about:'Built by tools/import-library.js from docs/research/exercise-library.md (batch L). The app embeds this file byte-for-byte. Edit the decisions in the tool, not this file.',
  newTags:NEW_TAGS, exercises:{}, added:[], modifiers:{}, rehab:{}, protocols:{}, uncertain:{}, skipped:{}};
const conflicts=[], report={match:[],mod:[],add:[],uncertain:[],protocol:[],split:[]};
out.splits={};
const parentOf={};     // research code → the app id it ended up as (for new rows' parents and home-training rows)
const fieldsOf=r=>{ const c=coreOf(r.id)||r, own=!!r.setup;
  return {setup:list(own?r.setup:''), cues:list(own?r.cues:''), mistakes:list(own?r.mistakes:''), easier:own?r.easier:'', harder:own?r.harder:'',
    why:r.why_people_like_it||r.why||'', grade:GRADE_OVERRIDE[r.id]||gradeOf(r.grade), flag:list(r.flag), reps:repsOf(r.reps_effort||r.start_dose), rir:rirOf(r.reps_effort||''),
    home:r.home==='Y'?true:r.home==='N'?false:null, jflags:flagsOf(r.joint_flags), emphasis:r.emphasis||r.emphasis_override||'', research:{name:r.name, why:r.why_people_like_it||r.why||'', grade:r.grade, sources:r.sources||''}}; };
const cleanWhy=(id,w)=>{ if(WHY_GENERIC[id]!=null) return WHY_GENERIC[id]; if(!w||w==='-') return ''; if(PEOPLE.test(w)||NUMBERS.test(w)||/≈|meta|principle|trial|Same as above|overlap/i.test(w)) return ''; return w.replace(/"/g,''); };
for(const r of [...CORE,...VAR,...REHAB]){
  const dec=D[r.id]; if(!dec){ report.uncertain.push([r.id,r.name,'no decision']); out.uncertain[r.id]='no decision'; continue; }
  const [kind,...rest]=dec[0]==='='?['=',dec.slice(1)]:dec.split(':'); const F=fieldsOf(r);
  if(kind==='?'){ out.uncertain[r.id]={name:r.name, why:rest.join(':')}; report.uncertain.push([r.id,r.name,rest.join(':')]); continue; }
  if(kind==='protocol'){ out.protocols[r.id]={name:r.name, why:rest.join(':'), row:r}; report.protocol.push([r.id,r.name,rest.join(':')]); continue; }
  if(kind==='skip'){ out.skipped[r.id]={name:r.name, why:rest.join(':')}; continue; }
  if(kind==='split'){ const ids=rest.join(':').split(',');
    ids.forEach(id=>{ const S=SPLIT[id]; if(!S) throw new Error(r.id+': no SPLIT entry for '+id); if(byId[id]&&!addedIds.has(id)) throw new Error(r.id+': id clash with the app: '+id);
      const e=newEntry(id,{...r,name:S.name,implement:S.implement},'-',['rehab'],{...F,setup:S.setup,easier:S.easier||'',harder:S.harder||''},true); e.splitOf=r.id; out.added.push(e);
      if(r.stage) out.rehab[id]=rehabOf(r); });
    out.splits[r.id]={name:r.name, into:ids, why:'one research row, two exercises (the maintainer, Nov 24)'}; report.split.push([r.id,r.name,ids.join(' and ')]); continue; }
  if(kind==='mod'){ const ex=rest[0], m=JSON.parse(rest.slice(1).join(':'));
    if(!appEx(ex)&&!D_NEW_IDS().has(ex)) throw new Error(r.id+': modifier on unknown '+ex);
    out.modifiers[r.id]={ex, modifiers:m, name:r.name, why:cleanWhy(r.id,F.why), grade:F.grade, flag:F.flag, reps:F.reps};
    parentOf[r.id]=ex; report.mod.push([r.id,r.name,ex+' '+JSON.stringify(m)]); continue; }
  if(kind==='='){ const id=rest[0]; if(!appEx(id)&&!D_NEW_IDS().has(id)) throw new Error(r.id+': no app exercise '+id);
    const e=out.exercises[id]||(out.exercises[id]={codes:[]}); e.codes.push(r.id); parentOf[r.id]=id;
    const orig=isOriginal(id), hasCue=!!CUES[id];
    // fill empty fields only; never a cue the maintainer wrote (coaching-cues.json)
    if(hasCue&&orig&&(F.setup.length||F.cues.length||F.mistakes.length)) conflicts.push([id,r.id,'setup, cues, mistakes','Your coaching cues (docs/coaching-cues.json) are kept; the research text is in docs/library.json, not shown']);
    else { if(F.setup.length&&!e.setup) e.setup=F.setup; if(F.cues.length&&!e.cues) e.cues=F.cues; if(F.mistakes.length&&!e.mistakes) e.mistakes=F.mistakes; }
    if(F.easier&&F.easier!=='-'&&!e.easier) e.easier=F.easier; if(F.harder&&F.harder!=='-'&&!e.harder) e.harder=F.harder;
    const w=cleanWhy(r.id,F.why); if(w&&!e.why) e.why=w; if(F.grade&&!e.grade) e.grade=F.grade;
    if(F.flag.length) e.flag=[...new Set([...(e.flag||[]),...F.flag])];
    if(F.home!=null&&e.home==null) e.home=F.home; if(F.reps&&!e.reps) e.reps=F.reps; if(F.rir&&!e.rir) e.rir=F.rir;
    if(F.jflags.length) e.jflags=[...new Set([...(e.jflags||[]),...F.jflags])];
    if(r.stage){ out.rehab[id]=rehabOf(r); }
    report.match.push([r.id,r.name,id+(byId[id]?' ('+byId[id].name+')':'')]); continue; }
  if(kind==='new'){ const [id,parent,opts='']=rest; const o=opts.split(',').filter(Boolean);
    if(byId[id]&&!addedIds.has(id)) throw new Error(r.id+': id clash with the app: '+id);
    out.added.push(newEntry(id,r,parent,o,F)); parentOf[r.id]=id; if(r.stage) out.rehab[id]=rehabOf(r);
    report.add.push([r.id,r.name,id+' under '+parent]); continue; }
  throw new Error(r.id+': bad decision '+dec);
}
for(const [id,x] of Object.entries(EXTRA_NEW)){ const r=ROW[x.from]; out.added.push(newEntry(id,{...r,id:x.from,name:x.name,implement:'BW',joint_flags:'-',flag:''},x.parent,x.opts,{...fieldsOf(r),setup:[],cues:[],mistakes:[],easier:'',harder:'',why:''},true)); report.add.push([x.from,x.name,id+' (from the bundle)']); }
function D_NEW_IDS(){ return new Set(Object.values(D).filter(d=>d.startsWith('new:')).map(d=>d.split(':')[1]).concat(Object.keys(EXTRA_NEW),Object.keys(SPLIT))); }
function newEntry(id,r,parent,o,F,extra){
  const impl=IMPL[r.implement]||'bodyweight';
  const p=parent==='-'?null:(byId[parent]||null);
  const e={id, name:NAME[id]||r.name, parent:parent==='-'?null:parent, implement:impl, codes:extra?[]:[r.id]};
  if(!p&&parent!=='-'&&!D_NEW_IDS().has(parent)) throw new Error(r.id+': unknown parent '+parent);
  if(parent==='-'){ const O=ORPHAN[id]; if(!O) throw new Error('no own pattern for '+id); e.pattern=O.pattern; e.vol=O.vol; }
  if(o.includes('named')) e.named=true; if(o.includes('manual')) e.manualOnly=true; if(o.includes('specialty')) e.specialty=true;
  if(o.includes('timed')) e.isometric=true; if(o.includes('rehab')) e.rehab=true; if(o.includes('unilateral')) e.unilateral=true;
  if(o.includes('bwplus')){ e.load='bodyweight_plus'; e.prog='double'; }
  if(F.setup.length) e.setup=F.setup; if(F.cues.length) e.cues=F.cues; if(F.mistakes.length) e.mistakes=F.mistakes;
  if(F.easier&&F.easier!=='-') e.easier=F.easier; if(F.harder&&F.harder!=='-') e.harder=F.harder;
  const w=cleanWhy(r.id,F.why); if(w) e.why=w; if(F.grade) e.grade=F.grade; if(F.flag.length) e.flag=F.flag;
  if(F.home!=null) e.home=F.home; if(F.reps&&!e.rehab) e.reps=F.reps; if(F.rir) e.rir=F.rir; if(F.jflags.length) e.jflags=F.jflags;
  if(r.emphasis_override) e.emphasis=r.emphasis_override;
  if(EXTRA_TAGS[id]) e.extraTags=EXTRA_TAGS[id];
  if(TAG_OVERRIDE[id]){ e.tagsOverride=TAG_OVERRIDE[id].tags; e.tagsWhy=TAG_OVERRIDE[id].why; }
  if(TAG_REMOVE[id]){ e.tagsRemove=TAG_REMOVE[id].remove; e.tagsWhy=TAG_REMOVE[id].why; }
  if(CAUTION[id]) e.caution=CAUTION[id];
  if(SAME_MOVE[id]){ if(!byId[SAME_MOVE[id]]) throw new Error(id+': same movement as an unknown exercise'); e.sameMove=SAME_MOVE[id]; }
  if(r.region){ const j=REGION_JOINT_R[r.region]; if(j) e.rehabJoint=j; }
  return e;
}
function rehabOf(r){
  const tendon=/PR-T/.test(r.pain_rule), links=(INJ_LINKS[r.id]||[]).filter(i=>APP.INJ.some(e=>e.id===i));
  if((INJ_LINKS[r.id]||[]).length!==links.length) throw new Error(r.id+': an injury link to an unknown entry');
  return {code:r.id, links, warmup:/warm-?up/i.test(r.prehab_dose||''), weeks:/gluteal/i.test(r.tissue_condition)?8:12, region:r.region, condition:r.tissue_condition, stage:r.stage, startDose:r.start_dose, progression:r.progression,
    painRule:tendon?'PR-T':'PR-G', painNote:r.pain_rule, advanceWhen:r.advance_when, prehabDose:r.prehab_dose&&r.prehab_dose!=='-'?r.prehab_dose:null,
    grade:gradeOf(r.grade), equipment:r.equipment_home_band, easier:r.easier, harder:r.harder};
}
// tags for every added entry: the research flags mapped through the APP pattern (its own, or its parent's), unioned with the parent chain's
const chainPattern=e=>{ if(e.pattern) return e.pattern; let p=e.parent; for(let i=0;i<5&&p;i++){ const a=byId[p]; if(a&&!addedIds.has(p)) return a.pattern; const n=out.added.find(x=>x.id===p); if(!n) break; if(n.pattern) return n.pattern; p=n.parent; } return null; };
out.added.forEach(e=>{ const pat=chainPattern(e); e.researchTags=[...new Set((e.jflags||[]).map(f=>tagFor(f,pat,e.id)).filter(Boolean).concat(e.extraTags||[]))]; delete e.extraTags; });
Object.entries(out.exercises).forEach(([id,e])=>{ const pat=(byId[id]||{}).pattern||chainPattern(out.added.find(x=>x.id===id)||{}); e.researchTags=[...new Set((e.jflags||[]).map(f=>tagFor(f,pat,id)).filter(Boolean))]; });
// the adopted flags: the tags the research adds over the app's own, applied at load (applyLibData)
const adopted=[];
Object.entries(ADOPT_TAGS).forEach(([id,code])=>{ const e=out.exercises[id]; if(!e||!e.codes.includes(code)) throw new Error('ADOPT_TAGS: '+id+' does not carry '+code);
  let have=[]; try{ have=[...APP.exTags(id)]; }catch(err){}
  const add=(e.researchTags||[]).filter(t=>!have.includes(t)); if(!add.length) throw new Error('ADOPT_TAGS: nothing to add on '+id);
  e.addTags=add; e.addWhy='research joint flags ('+code+') add '+add.join(', ')+' (adopted by the maintainer, Nov 24)'; adopted.push([id,code,add.join(', ')]); });

/* easier / harder: the research names them in words; resolved to an app exercise (and modifier) where the words
   name a row or an app exercise, else kept as words */
const normN=s=>String(s||'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[°’']/g,'').replace(/\bdbs?\b/g,'dumbbell').replace(/\bbb\b/g,'barbell').replace(/\bbw\b/g,'bodyweight')
  .replace(/\bbss\b/g,'bulgarian split squat').replace(/\bcgbp\b/g,'close grip bench press').replace(/\bssb\b/g,'safety squat bar').replace(/\ber\b/g,'external rotation')
  .replace(/-/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\bdumbbells\b/g,'dumbbell').replace(/\bcurls\b/g,'curl').trim();
// short research phrases that name a modifier on the row's own exercise
const SELF_MOD=[[/^(pause|paused)( .*)?$/,{pause:{seconds:2,at:'bottom'}}],[/^deficit( .*)?$/,{rom:{kind:'deficit'}}],[/^1 5 reps|1 25 reps$/,{quarter:true}],
  [/^lengthened partials?( .*)?$|^lengthened partial .*$/,{rom:{kind:'lengthened'}}]];
const RN=new Map(); [...CORE,...VAR,...REHAB].forEach(r=>[r.name,...list(r.aliases)].forEach(n=>{ const k=normN(n); if(k&&!RN.has(k)) RN.set(k,r.id); }));
const AN=new Map(); APP.EX.forEach(e=>{ const k=normN(e.name); if(!AN.has(k)) AN.set(k,e.id); }); out.added.forEach(a=>{ const k=normN(a.name); if(!AN.has(k)) AN.set(k,a.id); });
// phrases in the easier/harder columns that name an app exercise in other words (the rest stay as words: 'lighter', 'lower effort')
const REF_TEXT={'band pulldown':'band_pulldown','single arm pulldown':'sa_cable_pulldown','single arm cable row':'sa_cable_row','split squat':'db_split',
  'single leg press':'leg_press_sl','reclined lengthened partial':'reclined_leg_ext','single leg lengthened partial':'sl_seated_curl','slider curl':'slider_curl',
  'single leg thrust':'sl_hip_thrust','bilateral bodyweight on step':'bw_calf','dumbbell on knees':'db_seated_calf','single arm':'sa_cable_fly','lean in':'lean_in_raise',
  'dumbbell lateral':'lat_raise','machine preacher':'pin_preacher','cable rope hammer':'cable_hammer','cross body hammer':'cross_hammer',
  'dumbbell overhead extension':'db_oh_ext','single arm reverse grip':'sa_rev_pushdown','dumbbell version':'db_skull','smith jm':'smith_jm',
  'kelso trap bar shrug':'kelso_shrug','suitcase':'suitcase_carry','high handle':'trap_bar_high','safety squat bar pause hatfield':'hatfield_squat',
  'band assisted':'band_rev_nordic','band abduction':'band_abd','lean forward':'lean_abd','behind back barbell curl':'btb_wrist_curl','tib bar single leg':'tib_bar',
  'incline dumbbell press bench':'incline_db','band external rotation':'er_side','band external rotation at 90':'er_90','cable external rotation at 90':'er_90',
  'r12':'tyler_twist','r13 heavier':'ecc_wrist_ext','r31':'copenhagen','band side steps step ups':'band_walk','knee support':'copenhagen_short','short lever':'copenhagen_short',
  'behind back cuff raise':'btb_y_raise','harness machine':'neck_harness','external rotation at side':'er_side','plate pinch':'plate_pinch','floor push up':'weighted_pushup',
  'machine abduction':'seated_abd','wrist curl hsr':'wrist_curl'};
// a phrase that names a different exercise on one row than everywhere else
const REF_FOR={machine_press:{'single arm':'iso_chest_press_1arm'}};
function refOf(txt,selfId){
  const k=normN(txt); if(!k||k==='-') return null;
  if(REF_FOR[selfId]&&REF_FOR[selfId][k]) return {text:txt, ex:REF_FOR[selfId][k]};
  if(REF_TEXT[k]&&REF_TEXT[k]!==selfId) return {text:txt, ex:REF_TEXT[k]};
  const code=RN.get(k);
  if(!code&&selfId){ const sm=SELF_MOD.find(([re])=>re.test(k)); if(sm) return {text:txt, ex:selfId, modifiers:sm[1]}; }
  if(code&&out.modifiers[code]) return {text:txt, ex:out.modifiers[code].ex, modifiers:out.modifiers[code].modifiers};
  if(code&&parentOf[code]) return {text:txt, ex:parentOf[code]};
  if(AN.has(k)) return {text:txt, ex:AN.get(k)};
  return {text:txt};
}
const refAll=(e,id)=>{ ['easier','harder'].forEach(k=>{ if(typeof e[k]==='string') e[k]=refOf(e[k],id); }); };
Object.entries(out.exercises).forEach(([id,e])=>refAll(e,id)); out.added.forEach(a=>refAll(a,a.id));
Object.values(out.rehab).forEach(r=>{ ['easier','harder'].forEach(k=>{ if(r[k]&&r[k]!=='-') r[k]=refOf(r[k],null); else delete r[k]; }); });

/* ── 7. write ── */
const json=()=>JSON.stringify(out,null,1)+'\n';
const counts={core:CORE.length, variants:VAR.length, rehab:REHAB.length, matched:report.match.length, modifiers:report.mod.length, added:out.added.length,
  uncertain:report.uncertain.length, protocols:report.protocol.length, split:report.split.length};
/* ── 8. the home-training library (batch N Part 3, docs/research/home-training.md) ──
   Imported with the same rules (docs/library-rules.md): rows attach to their parent through the research codes stored
   above, existing exercises are updated, never re-created, and a name or alias that's already in the library is
   reported as a collision and treated as an update. Joint flags: the parent's (taken from exercise-library.md through
   its code), plus the home row's own SH/KF/SF/WE/EL. */
const HMD=fs.readFileSync(path.join(ROOT,'docs/research/home-training.md'),'utf8');
const HB=[...HMD.matchAll(/```\n([\s\S]*?)```/g)].map(m=>m[1].trim().split('\n').map(l=>l.split('|')));
const H_BW=table(HB[0]), H_DB=table(HB[1]), H_SL=table(HB[2]), H_Q=table(HB[3]), H_UP=table(HB[4]);
const HROW=Object.fromEntries([...H_BW,...H_DB,...H_SL,...H_Q].map(r=>[r.id,r]));
const hSlug=n=>n.toLowerCase().replace(/\(.*?\)/g,'').replace(/push-up/g,'pushup').replace(/pull-up/g,'pullup').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
// exceptions to "a new exercise under its parent, id from its name"
const HDEC={H061:'=db_front_raise', H067:'=kickback',            // already in the library by name: collisions, updated
  H040:'parent:calf',                                              // its parent R45 is a protocol logged on the calf raise
  H079:'orphan', H086:'orphan', H087:'orphan'};
const H_ORPHAN={db_turkish_get_up:{pattern:'trunk',vol:{abs:1,front_delts:.5,glutes:.5}},
  slant_straight_knee_calf_stretch:{pattern:'rehab_ankle',vol:{},rehab:true}, slant_bent_knee_calf_stretch:{pattern:'rehab_ankle',vol:{},rehab:true}};
const H_NAME={pseudo_planche_pushup:'Pseudo-planche push-up', wall_hspu_negative:'Wall handstand push-up negative', heels_elevated_bw_squat:'Heels-elevated bodyweight squat',
  toes_elevated_sl_rdl:'Toes-elevated single-leg RDL', db_floor_fly:'Dumbbell floor fly', single_arm_db_floor_press:'One-arm dumbbell floor press', bridge_db_floor_press:'Bridge dumbbell floor press',
  db_squeeze_press:'Dumbbell squeeze press', two_db_bent_over_row:'Two-dumbbell bent-over row', head_supported_db_row:'Head-supported dumbbell row', db_rear_delt_row:'Dumbbell rear-delt row',
  standing_db_overhead_press:'Standing dumbbell overhead press', wide_db_upright_row:'Wide-grip dumbbell upright row', bent_over_db_y_raise:'Bent-over dumbbell Y-raise', db_cuban_press:'Dumbbell Cuban press',
  bed_edge_lying_db_curl:'Bed-edge lying dumbbell curl', db_reverse_curl:'Dumbbell reverse curl', two_hand_db_overhead_extension:'Two-hand dumbbell overhead extension', floor_rolling_db_extension:'Floor rolling dumbbell extension',
  db_front_rack_squat:'Dumbbell front-rack squat', db_suitcase_squat:'Dumbbell suitcase squat', db_sumo_squat:'Dumbbell sumo squat', db_skater_squat:'Dumbbell skater squat', db_lateral_lunge:'Dumbbell lateral lunge',
  db_deficit_rdl:'Dumbbell deficit RDL', db_suitcase_deadlift:'Dumbbell suitcase deadlift', db_good_morning:'Dumbbell good morning', db_side_bend:'Dumbbell side bend', db_turkish_get_up:'Dumbbell Turkish get-up', db_suitcase_march:'Dumbbell suitcase march'};
const H_IMPL=i=>/^DB/.test(i)?'dumbbell':i==='backpack'?'bodyweight':'bodyweight';
const H_TAG=(code,pattern)=>{ switch(code){
  case 'SH': return ['horizontal_press','fly'].includes(pattern)?'shoulder_horiz_abd_endrange':pattern==='vertical_press'?'shoulder_overhead_loaded':pattern==='elbow_extension'?'shoulder_ext_endrange_loaded'
    :pattern==='abduction'?'shoulder_elevation_abd':pattern==='vertical_pull'?'shoulder_hang_traction':pattern==='elbow_flexion'?'shoulder_ext_endrange_loaded'
    :['trunk','grip','prehab_lowback'].includes(pattern)?'shoulder_overhead_endrange':pattern==='rehab_shoulder'?'shoulder_abd_er_loaded':'shoulder_overhead_loaded';
  case 'KF': return 'knee_flex_deep_loaded'; case 'SF': return 'spine_flex_loaded'; case 'WE': return 'wrist_ext_loaded';
  case 'EL': return pattern==='elbow_flexion'?'elbow_flex_loaded_heavy':'elbow_ext_endrange_loaded'; } return null; };
const hCode=c=>{ if(!c||c==='-') return null; if(HROW[c]) return {h:c}; const p=parentOf[c]; if(p) return {ex:p, mod:out.modifiers[c]?out.modifiers[c].modifiers:null}; return {missing:c}; };
const hShare=eq=>{ const m=String(eq||'').match(/~?(\d+)(?:-\d+)?%\s*BW/); return m?+m[1]/100:null; };
const HOME_FIELDS=r=>({noise:{S:'silent',Q:'quiet',L:'loud'}[r.noise]||null, space:{SR:'standing room',BL:'body length',DF:'a doorway or furniture'}[r.space]||null,
  householdSub:r.sub&&r.sub!=='-'?r.sub:null, homeEquip:r.equip&&r.equip!=='none'?r.equip:null, progLever:r.prog_lever&&r.prog_lever!=='-'?r.prog_lever:null,
  moveUp:r.move_up&&r.move_up!=='-'?r.move_up:null, needsBench:/bench/i.test(r.equip||'')||null});
out.home={updates:{}, collisions:[], ladders:{}, templates:{}, cardio:[], rules:{lowLoadReps:30}};
const hId={};
for(const r of [...H_BW,...H_DB,...H_SL]){
  const dec=HDEC[r.id]||'';
  if(dec.startsWith('=')){ const id=dec.slice(1); out.home.collisions.push([r.id,r.name,id]); out.home.updates[id]={...(out.home.updates[id]||{}), codes:[...((out.home.updates[id]||{}).codes||[]),r.id], ...HOME_FIELDS(r)}; hId[r.id]=id; continue; }
  const id=hSlug(r.name); if(byId[id]||out.added.some(a=>a.id===id)) throw new Error(r.id+': id clash '+id);
  hId[r.id]=id;
}
for(const r of [...H_BW,...H_DB,...H_SL]){
  const dec=HDEC[r.id]||''; if(dec.startsWith('=')) continue;
  const id=hId[r.id]; let parent=null, pmod=null;
  if(dec==='orphan'){ parent=null; } else if(dec.startsWith('parent:')){ parent=dec.slice(7); }
  else { const p=hCode(r.parent); if(!p||p.missing) throw new Error(r.id+': unresolved parent '+r.parent); parent=p.h?hId[p.h]:p.ex; pmod=p.mod||null; }
  const e={id, name:H_NAME[id]||r.name, parent, implement:H_IMPL(r.impl), codes:[r.id], named:true, home:true, ...HOME_FIELDS(r)};
  if(!parent){ const O=H_ORPHAN[id]; if(!O) throw new Error('no pattern for '+id); e.pattern=O.pattern; e.vol=O.vol; if(O.rehab) e.rehab=true; }
  if(r.rehab_or_training==='rehab') e.rehab=true;
  { const pe=parent?(byId[parent]||out.added.find(a=>a.id===parent)):null; if(pe&&pe.rehab) e.rehab=true; }
  if(/\bs\b|hold|isometric/i.test(r.reps)||/hold|isometric/i.test(r.name)) e.isometric=true;
  const setup=list(r.setup), cues=list(r.cues), mis=list(r.mistakes); if(setup.length) e.setup=setup; if(cues.length) e.cues=cues; if(mis.length) e.mistakes=mis;
  if(r.easier&&r.easier!=='-') e.easierCode=r.easier; if(r.harder&&r.harder!=='-') e.harderCode=r.harder;
  const g=gradeOf(r.grade); if(g) e.grade=g; const w=String(r.why||'').replace(/"/g,''); if(w&&!PEOPLE.test(w)&&!NUMBERS.test(w)) e.why=w.charAt(0).toUpperCase()+w.slice(1);
  const rp=repsOf(r.reps); if(rp&&!e.rehab) e.reps=rp;
  const sh=hShare(r.equiv); if(sh) e.bwShare=sh;
  const lad=String(r.ladder||'').match(/^([A-Z-]+)\s+(\d+)\/(\d+)$/); if(lad){ e.ladder=lad[1].toLowerCase(); e.ladderStep=+lad[2]; }
  e.homeJoint=String(r.joint||'').split(',').filter(x=>x&&x!=='-');
  if(r.knee_load_note) e.homeNote=r.knee_load_note;
  if(TAG_REMOVE[id]){ e.tagsRemove=TAG_REMOVE[id].remove; e.tagsWhy=TAG_REMOVE[id].why; }
  out.added.push(e); report.add.push([r.id,r.name,id+' under '+(parent||'(own pattern)')]);
}
// the 60 update rows: home fields on the exercise the code maps to
for(const r of H_UP){ const p=parentOf[r.id]; if(!p){ out.home.updates['?'+r.id]={name:r.name, why:'no app exercise for this code'}; continue; }
  const lp=String(r.ladder_pos||'').match(/^([A-Z-]+)\s+([\d-]+)\/(\d+)$/);
  const u=out.home.updates[p]=out.home.updates[p]||{codes:[]}; u.codes.push(r.id);
  Object.assign(u,{homeSetup:r.home_setup&&r.home_setup!=='-'?r.home_setup:u.homeSetup||null, householdSub:r.household_sub&&r.household_sub!=='-'?r.household_sub:u.householdSub||null,
    noise:{S:'silent',Q:'quiet',L:'loud'}[r.noise]||u.noise||null, space:{SR:'standing room',BL:'body length',DF:'a doorway or furniture'}[r.space]||u.space||null,
    homeNote:r.home_notes&&r.home_notes!=='-'&&!PEOPLE.test(r.home_notes)?r.home_notes.replace(/\s*\((E11|K18|Ki17|C15|RR)[^)]*\)/g,''):u.homeNote||null});
  const sh=hShare(r.home_notes); if(sh&&!u.bwShare) u.bwShare=sh;
  if(lp){ u.ladder=lp[1].toLowerCase(); u.ladderPos=lp[2]; }
  if(out.modifiers[r.id]) u.modifier=out.modifiers[r.id].modifiers;
}
// quiet cardio: activities (minutes and an optional heart rate), never sets, no calorie figures
for(const r of H_Q){ out.home.cardio.push({id:'q_'+hSlug(r.name), code:r.id, name:r.name.replace(/\s*\(.*?\)/g,''), dose:r.dose, noise:{S:'silent',Q:'quiet',L:'loud'}[r.noise]||null,
  setup:list(r.setup), cues:list(r.cues), mistakes:list(r.mistakes), grade:gradeOf(r.grade), hrNote:r.HR_note,
  shoulderNote:/shadow box/i.test(r.name)?'With a shoulder that dislocates or feels unstable: keep punches short and below shoulder height, no full extension, and stop if it feels loose.':null}); }
// ladders (section 6): rungs as [exercise, modifiers]; a step with two options lists both
const R_=(c,mods)=>{ const p=hCode(c); if(!p||p.missing) throw new Error('ladder: '+c); return p.h?[hId[p.h],mods||null]:[p.ex,mods||p.mod||null]; };
out.home.ladders={
  push:{name:'Push-ups', moveUp:{sets:3,reps:15}, strengthMoveUp:{sets:3,reps:8}, rungs:[[R_('V115',{height:'wall'})],[R_('V115',{height:'counter'})],[R_('V115',{height:'chair'})],[R_('V116')],[R_('C032')],[R_('H001')],[R_('V204')],[R_('H002')],[R_('H005')],[R_('H003')],[R_('H004')]]},
  vpush:{name:'Overhead pushing', moveUp:{sets:3,reps:10}, rungs:[[R_('C073')],[R_('H008')],[R_('H009')],[R_('H010')],[R_('V129')]]},
  dip:{name:'Dips', moveUp:{sets:3,reps:8}, rungs:[[R_('V119')],[R_('V204')],[R_('H011')]]},
  row:{name:'Rows without a bar', moveUp:{sets:3,reps:15}, strengthMoveUp:{sets:3,reps:8}, rungs:[[R_('H013')],[R_('H014')],[R_('H015')],[R_('C072',{knees:'bent'})],[R_('C072')],[R_('H016')],[R_('H017')]]},
  curl:{name:'Curls without weights', moveUp:{sets:3,reps:15}, rungs:[[R_('H022')],[R_('H023')],[R_('H024')]]},
  squat:{name:'Squats', moveUp:{sets:3,reps:15,perLeg:true}, rungs:[[R_('V025')],[R_('V024')],[R_('H081'),R_('V007')],[R_('V073'),R_('H027')],[R_('V078')],[R_('C014')],[R_('H028')],[R_('H029'),R_('V027')],[R_('V028')],[R_('V026')]]},
  knee:{name:'Knee holds', moveUp:{sets:3,reps:12,secs:45}, rungs:[[R_('V035')],[R_('H030')],[R_('V034')],[R_('C067')],[R_('C068')]]},
  hinge:{name:'Hinges without a bar', moveUp:{sets:3,reps:12}, rungs:[[R_('R29')],[R_('V043')],[R_('H033'),R_('C024')],[R_('H032'),R_('V065')],[R_('V057')],[R_('H031')],[R_('C023')]]},
  core:{name:'Core', moveUp:{sets:3,reps:12,secs:40}, rungs:[[R_('V218'),R_('V220')],[R_('H041')],[R_('H044')],[R_('H045')],[R_('V230')]]},
  calf:{name:'Calf raises', moveUp:{sets:3,reps:20}, rungs:[[R_('C026')],[R_('V093')],[R_('H088')],[R_('H040'),R_('V093',{loaded:'backpack'})]]}};
// templates (section 8): ready-made sessions; pairs alternate (A1/A2)
const T_=(c,sets,reps,pair,mods)=>{ const [ex,m]=R_(c,mods); return {ex, sets, reps, pair:pair||null, ...(m?{modifiers:m}:{})}; };
out.home.templates={
  silent:{name:'30 minutes, silent, no equipment', place:'none', minutes:30, rest:60, slots:[T_('C032',3,[6,15],'A'),T_('H015',3,[8,15],'A'),T_('C014',3,[8,15],'B'),T_('H031',3,[8,12],'B'),T_('V065',2,[10,20],'C'),T_('H041',2,[20,40],'C'),T_('V093',2,[10,20])]},
  dbsuper:{name:'30 minutes, dumbbell supersets', place:'home_db', minutes:30, rest:70, slots:[T_('V111',3,[6,10],'A'),T_('H055',3,[8,12],'A'),T_('C014',3,[8,12],'B'),T_('V042',3,[8,12],'B'),T_('H059',2,[8,12],'C'),T_('V183',2,[10,15],'C'),T_('V200',2,[10,15],'D'),T_('H060',2,[15,20],'D')]},
  gym1home2:{name:'One gym day and two home days', place:'mixed', days:{gym:[T_('C001',3,[3,6]),T_('C007',3,[3,6]),T_('C004',2,[3,5]),T_('C010',3,[6,10]),T_('C013',2,[8,12]),T_('C022',2,[10,12])],
    homeA:[T_('H070',3,[10,15]),T_('H053',3,[8,12]),T_('H056',3,[10,15]),T_('H075',3,[10,10]),T_('C035',2,[15,15]),T_('H067',2,[15,15])],
    homeB:[T_('H001',3,[6,25]),T_('H015',3,[6,25]),T_('H028',3,[8,12])]}}};
for(const r of [...H_BW,...H_DB,...H_SL]){ const e=out.added.find(a=>a.id===hId[r.id]); if(!e) continue;
  ['easierCode','harderCode'].forEach(k=>{ if(!e[k]) return; const p=hCode(e[k]); const key=k==='easierCode'?'easier':'harder';
    e[key]=p&&!p.missing?(p.h?{text:HROW[p.h].name, ex:hId[p.h]}:{text:e[k], ex:p.ex, ...(p.mod?{modifiers:p.mod}:{})}):{text:e[k]}; delete e[k]; }); }

// research codes left in easier/harder words become names (a code never shows in the app)
const nameOfCode=c=>{ if(HROW[c]) return HROW[c].name; const p=parentOf[c]; const a=p&&(byId[p]||out.added.find(x=>x.id===p)); return a?a.name:c; };
out.added.forEach(e=>['easier','harder'].forEach(k=>{ if(e[k]&&e[k].text) e[k].text=e[k].text.replace(/\b[CVRHQ]\d{2,3}\b/g,nameOfCode); }));
Object.values(out.exercises).forEach(e=>['easier','harder'].forEach(k=>{ if(e[k]&&e[k].text) e[k].text=e[k].text.replace(/\b[CVRHQ]\d{2,3}\b/g,nameOfCode); }));
// home rows' joint flags: their own, through the app pattern; the parent's come through the chain at runtime
out.added.filter(e=>e.homeJoint).forEach(e=>{ const pat=chainPattern(e); e.researchTags=[...new Set(e.homeJoint.map(c=>H_TAG(c,pat)).filter(Boolean))]; delete e.homeJoint; });
counts.home={added:out.added.filter(e=>(e.codes||[]).some(c=>c[0]==='H')).length, collisions:out.home.collisions.length, updated:Object.keys(out.home.updates).filter(k=>k[0]!=='?').length, cardio:out.home.cardio.length, ladders:Object.keys(out.home.ladders).length, templates:Object.keys(out.home.templates).length};

/* ── 9. the warm-up library (the maintainer's request, Nov 2026) ──
   From the research files only: the rehab rows that suit prehab (a prehab dose that isn't "not needed"), and the
   slant-board stretches and balance work. Grouped by body part; a row with no grade is coaching consensus. Gaps are
   listed in docs/library-import.md, not filled from memory. */
const WU_AREAS={'Shoulder':['shoulders'],'Elbow':['wrists'],'Elbow/wrist':['wrists'],'Wrist/hand':['wrists'],'Neck':['back'],'Neck/upper back':['back'],'Lower back':['back'],
  'Hip':['hips'],'Hip/thigh':['hips'],'Knee':['knees'],'Knee/ankle':['knees','ankles'],'Knee/hip':['knees','hips'],'Ankle/foot':['ankles']};
out.warmup=[];
for(const r of REHAB){ const dose=r.prehab_dose; if(!dose||dose==='-'||/not needed/i.test(dose)) continue; const id=parentOf[r.id]; if(!id) continue;
  out.warmup.push({id, code:r.id, areas:WU_AREAS[r.region]||[], dose, grade:gradeOf(r.grade), warmupDose:/warm-?up/i.test(dose)}); }
for(const c of ['H086','H087','H089','H081']){ const id=hId[c]; const r=HROW[c]; if(!id||!r) continue;
  out.warmup.push({id, code:c, areas:c==='H081'?['knees','ankles']:['ankles'], dose:r.reps, grade:gradeOf(r.grade)}); }
counts.warmup=out.warmup.length;
console.log(JSON.stringify(counts));
if(CHECK){ console.log('check only: nothing written'); process.exit(0); }
fs.writeFileSync(path.join(ROOT,'docs/library.json'),json());
const tbl=(h,rows)=>'| '+h.join(' | ')+' |\n|'+h.map(()=>'---').join('|')+'|\n'+rows.map(r=>'| '+r.map(x=>String(x).replace(/\|/g,'/')).join(' | ')+' |').join('\n')+'\n';
const mdOut=`# Library import (batch L)

Built by \`node tools/import-library.js\` from \`docs/research/exercise-library.md\`. The decisions are data in the tool; the result is \`docs/library.json\`, embedded in the app. How to add or edit an exercise from now on: \`docs/library-rules.md\`.

## Counts

${tbl(['Rows','Matched to an app exercise','Modifiers on an app exercise','New exercises','Split (one row, two exercises)','Uncertain (left out)','Protocols (kept as data)','Conflicts (not changed)','Research flags adopted'],
 [[`${CORE.length} core, ${VAR.length} variants, ${REHAB.length} rehab`,counts.matched,counts.modifiers,counts.added,counts.split,counts.uncertain,counts.protocols,conflicts.length+tagConflicts().length,adopted.length]])}
## Joint flags → movement tags

New tags (one line each, in \`docs/movement_tags.json\`): ${Object.entries(NEW_TAGS).map(([k,v])=>'`'+k+'` ('+v+')').join('; ')}.

${tbl(['Research flag','Movement tag'],FLAG_TABLE)}
New exercises carry the research's flags mapped this way **plus** their parent's tags (never gentler than the parent). Exercises the app already had keep their tags; where the research flags would add one, it's listed under Conflicts.

## Uncertain: left out for the maintainer to check

${tbl(['Code','Research name','Why'],report.uncertain)}
## Split: one row, two exercises

${tbl(['Code','Research name','Exercises'],report.split)}
## Research flags adopted on exercises the app had

${tbl(['App exercise','Code','Tags added'],adopted)}
## Protocols: not one exercise

${tbl(['Code','Research name','What happens to it'],report.protocol)}
## Conflicts: listed, not changed

${tbl(['App exercise','Code','Field','Note'],conflicts.concat(tagConflicts()))}
## Home training (batch N Part 3)

${tbl(['New rows','Updated exercises','Collisions (treated as updates)','Ladders','Templates','Quiet cardio (data only)'],[[counts.home.added,counts.home.updated,counts.home.collisions,counts.home.ladders,counts.home.templates,counts.home.cardio]])}
Collisions: ${out.home.collisions.map(c=>c[0]+' '+c[1]+' = '+c[2]).join('; ')}.

## Warm-up library

${out.warmup.length} items from the research files (rehab rows with a prehab dose, slant-board stretches and balance), plus the app's 18 warm-up moves. By body part: ${['shoulders','hips','knees','ankles','back','wrists'].map(a=>a+' '+out.warmup.filter(w=>w.areas.includes(a)).length).join(', ')} (research items; the app's own add to each).

## Matched to an app exercise (the code is stored on it)

${tbl(['Code','Research name','App exercise'],report.match)}
## Modifiers on an app exercise

${tbl(['Code','Research name','Exercise and modifier'],report.mod)}
## New exercises

${tbl(['Code','Research name','App id and parent'],report.add)}`;
function tagConflicts(){ const rows=[]; Object.entries(out.exercises).forEach(([id,e])=>{ if(!isOriginal(id)||!APP.exTags||ADOPT_TAGS[id]) return; let have=[]; try{ have=[...APP.exTags(id)]; }catch(err){ return; }
  const extra=(e.researchTags||[]).filter(t=>!have.includes(t)); if(extra.length) rows.push([id,e.codes.join(', '),'tags','the research flags would add '+extra.join(', ')+'; the app\'s tags are kept']); }); return rows; }
fs.writeFileSync(path.join(ROOT,'docs/library-import.md'),mdOut);
// embed byte-for-byte
const ip=path.join(ROOT,'index.html'); let html=fs.readFileSync(ip,'utf8');
const re=/(<script type="application\/json" id="library-data">)([\s\S]*?)(<\/script>)/;
if(!re.test(html)) throw new Error('no <script id="library-data"> block in index.html');
html=html.replace(re,(m,a,b,c)=>a+'\n'+json()+c); fs.writeFileSync(ip,html);
console.log('wrote docs/library.json, docs/library-import.md, embedded in index.html');
