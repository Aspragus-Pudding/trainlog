# Strength, Hypertrophy and Rehab Exercise Libraries: Import-Ready Data with Evidence Grades

The research supports one main design choice. Build both libraries as parent-and-variant data. About 80 fully described "core" exercises carry every field. About 240 variants inherit from them and override only what changes. Grade most "best exercise" claims D, because only a handful of exercise-specific choices have controlled trials behind them: overhead triceps work, seated leg curls, reclined leg extensions, stretched-position partial reps, Nordics, Copenhagens and heavy slow tendon loading.

## TL;DR
- **Exercise library:** 78 core rows with every field, plus 243 variant rows that inherit from a parent, for 321 deduplicated entries. Only about 10 exercise-specific effectiveness claims rate B or better. The strongest pattern is "train the muscle in its stretched position". Trials favour overhead triceps extensions, seated leg curls, reclined leg extensions and stretched-position calf partials (all B). In trained lifters, stretched-position partials only match full range of motion; they don't beat it.
- **Rehab library:** 49 rows. Each region's backbone rates A or B: hip-plus-knee strengthening for kneecap pain, balance training against repeat ankle sprains, exercise for chronic low back pain, heavy slow resistance for patellar and Achilles tendons, and the LEAP education-plus-exercise programme for outer-hip pain. Wrist/hand and many specific "rehab favourites" rate only C or D.
- **Progression rules:** Gate progression on pain. Tendons may go up to 5/10 during exercise, as long as pain settles to baseline by the next morning (B, Silbernagel 2007 RCT). Use 3/10 for everything else (D). Progress load every 1–2 weeks only when two sessions in a row pass. Treat isometrics as a tolerable starting point, not a pain-relief tool. Trials show they are no better than slow full-range lifting for immediate pain relief (B).

## Key Findings

1. **Stretched-position training is the only exercise-selection principle with real trial backing.**
   - **Triceps (Maeo 2023, 12 weeks):** Triceps growth was "substantially greater after elbow extension training performed in the overhead versus neutral arm position". That was about 1.5× for the long head and 1.4× for the other two heads. An earlier Stasinaki study found similar long-head growth, which is why this rates B, not A.
   - **Hamstrings (Maeo 2021):** Seated leg curls grew whole-hamstring volume +14% versus +9% for lying curls.
   - **Quads, reclined leg extension:** In a preprint by Larsen et al. (22 untrained men, 10 weeks), leg extensions with the hips reclined (40°) grew the rectus femoris +12.4–15.8%, versus +4.6–10.9% sitting upright (90°). The authors rated the evidence for 40° "extreme" (Bayes factor >100), with "strong" evidence of no difference for the vastus lateralis.
   - **Quads, stretched-position partials (Pedrosa 2022):** Leg extensions done only in the bent-knee half (100–65° knee bend) gave more distal quad growth in untrained women.
   - **Calves (Kassiano 2023):** Stretched-position partial calf raises grew the medial gastrocnemius +15.2% versus +6.7% for full range.
   - **Caveats on partials:**
     - The Wolf 2023 meta-analysis found only a "potential small benefit" of stretched-position partials.
     - Wolf et al. 2025 (PeerJ) trained 30 resistance-trained lifters for 8 weeks, one arm with stretched-position partials and the other with full range. The two "led to comparable improvements in muscle hypertrophy and strength-endurance".
     - A 297-participant randomised cluster trial at 15 sites (Gschneidner, Carlson et al., Journal of Sports Sciences 2025) found the differences "small and practically equivalent".
   - **App implication:** Treat stretched-position partials as an equal option for variety, joint comfort or finishing a set. Don't treat them as superior.
2. **Most coach "S-tier" picks are reasonable biomechanics, but untested head to head.** Jeff Nippard's top side-delt picks are:
   - the cable lateral raise ("maximum tension… while most stretched");
   - the cable Y-raise (S-tier);
   - the lean-in dumbbell lateral raise (A-tier).
   - **How he makes cable laterals harder:** raise the pulley, use cuffs, and "stretch the cable across your body".
   - **Mike Israetel's pick:** the super-ROM lateral raise.
   - **Grade:** D. They follow from resistance-curve reasoning, but no published trial compares them.
3. **Injury-prevention exercises with trial evidence:**
   - **Nordic hamstring curl:** A meta-analysis by van Dyk, Behan and Whiteley (BJSM 2019) covered 15 studies, 8,459 athletes and 525 hamstring injuries. It found a risk ratio of 0.49 (95% CI 0.32–0.74) and concluded "programmes that include the NHE reduce hamstring injuries by up to 51%". A later reappraisal called the effect "inconclusive" because most programmes mixed Nordics with other exercises. Grade B.
   - **Copenhagen adduction exercise:** A cluster RCT of 35 semi-professional football teams found a Copenhagen-based programme cut groin problems by 41%. Grade B.
   - **Hamstring rehab, Askling L-protocol:** It returned athletes faster than conventional rehab in RCTs. In sprinters and jumpers, mean return took 43 days (stretching-type injury) and 23 days (sprinting-type) with the L-protocol, versus 74 and 41 days with conventional rehab. Grade B.
4. **Tendon loading:**
   - **Heavy slow resistance (Kongsgaard 2009):** 3 sessions/week of squat, leg press and hack squat, 4 sets each, progressing from 15RM to 6RM over 12 weeks, about 6 s per rep. It tended to beat eccentric decline squats done twice daily.
   - **Isometrics are oversold.** A systematic review of 10 RCTs (Clifford et al. 2020, BMJ Open Sport & Exercise Medicine) found that "based on limited evidence (level 3), isometric exercise was not superior to isotonic exercise for chronic tendinopathy either immediately following treatment or in the short term (≤12 weeks)". A quasi-randomised trial of 91 patients with chronic Achilles tendinopathy (van der Vlist et al. 2020) concluded "we do not recommend isometric exercises if the aim is providing immediate pain relief".
5. **Region backbones from guidelines:**
   - **Kneecap pain (JOSPT 2019 guideline):** "Exercise therapy that is appropriately progressed and focused on hip and knee strengthening is the best approach". Combined hip and knee work is Grade A, with hip work preferred early.
   - **Ankle (JOSPT 2021 guideline):** balance training to prevent repeat sprains is Grade A. Exercise-based rehab cut 12-month re-injury from 22% to 16% (Wagemans 2022).
   - **Neck (JOSPT 2017 guideline):** neck and shoulder-girdle strengthening and endurance work is Grade B.
   - **Chronic low back pain (Cochrane 2021):** Exercise beat no treatment or usual care by 15.2/100 points for pain. Pilates, McKenzie and functional restoration came out "marginally" ahead of other types.
   - **Outer-hip (gluteal) pain (LEAP):** education plus exercise succeeded in 77.3% at 8 weeks, versus 58.5% for a steroid injection and 29.4% for wait-and-see.
   - **Plantar heel pain (Rathleff 2015):** heel raises with a towel under the toes improved pain faster than stretching at 3 months. There was no difference by 12 months.

## How to import

- **Format:** pipe-delimited rows (`|`). Use `;` to separate items inside a field. Import as text, splitting on `|`.
- **Inheritance:** Variant rows inherit primary and secondary muscles, movement pattern, setup, cues and mistakes from `parent`, unless overridden. Easier and harder versions default to the parent and its sibling variants.
- **Implement codes:**

| Code | Meaning |
|---|---|
| BB | barbell |
| DB | dumbbell |
| CB | cable |
| PL | plate-loaded machine |
| SEL | selectorised machine |
| SM | Smith machine |
| BW | bodyweight |
| BAND | band |
| KB | kettlebell |
| SPB | specialty bar |

- **Use and goal codes:**
  - Use: M = main lift, S = secondary, A = accessory, F = finisher.
  - Goal: Str = strength, Hyp = hypertrophy, Both.
- **Effort:** RIR = reps in reserve.
- **Home flag:** Y = can be done with only barbell, rack, bench, dumbbells and a pull-up bar (bands allowed where noted).
- **Joint flags (for injury filtering):**

| Flag | What it means |
|---|---|
| SH-OH | loaded overhead shoulder flexion |
| SH-ABD-ER | loaded end-range shoulder abduction and/or external rotation |
| SH-HABD | end-range horizontal abduction (deep chest stretch) |
| SH-EXT | loaded shoulder extension behind the body |
| SH-IR-ELEV | internal rotation with the arm raised |
| EL-FLEX | loaded deep elbow bend |
| EL-STRESS | high elbow tendon or lockout stress |
| WR-EXT | wrist bent back under load |
| WR-DEV | side-bending wrist load |
| SP-AX | heavy axial spinal load |
| SP-FLEX | loaded spinal rounding |
| SP-EXT | loaded low-back arching |
| SP-SHEAR | horizontal torso under load |
| SP-ROT | loaded twisting |
| HIP-FLEX | deep loaded hip bend |
| HIP-ADD | adductors loaded at long length |
| KN-DEEP | deep loaded knee bend |
| KN-FWD | knees far past toes, high kneecap-tendon load |
| KN-OKC | open-chain knee extension load |
| ANK-DF | loaded deep ankle bend |
| HAM-LONG | hamstrings loaded at long length |
| NECK | neck load |
| GRIP | high grip demand |
| IMPACT | landing or jumping |

- **Evidence grades:**
  - A = multiple RCTs or meta-analyses.
  - B = controlled studies, with some disagreement.
  - C = limited or observational evidence.
  - D = coach consensus or anecdote.
  - Grades apply to the specific effectiveness or safety claim in the row. Most compound "staples" rate D for being "the best" choice, but every row gets a measurable training effect if done hard enough.
- **Flag column:** POP-LOW = popular but poorly supported. RISK = higher-risk loading. Blank = no flag.

## 1. Exercise table — core rows (full fields)

```
id|name|aliases|family|parent|implement|primary|secondary|emphasis|pattern|use|goal|reps_effort|setup|cues|mistakes|easier|harder|joint_flags|equipment|home|grade|sources|why_people_like_it|flag
C001|High-bar back squat|back squat;Olympic squat|Squat|-|BB|quads;glutes|adductors;erectors|quads, deep knee bend|squat|M|Both|3-8 @1-3RIR|Bar on upper traps in rack;feet shoulder-width, toes slightly out;unrack and step back 2-3 steps|Big breath and brace like bracing for a punch;sit down between your heels;push the floor away and stand tall|knees caving in;hips shooting up first|goblet squat|pause squat|SP-AX;KN-DEEP;HIP-FLEX|rack;barbell|Y|D|Barbell Medicine;Calgary Barbell|The best all-round leg builder that also builds strength|
C002|Low-bar back squat|powerlifting squat|Squat|C001|BB|glutes;adductors;quads|erectors;hamstrings|hips, more forward lean|squat|M|Str|1-6 @1-3RIR|Bar below shoulder-blade ridge;thumbs over bar, wrists straight;wider stance|Squeeze the bar into your back;push hips back and knees out together;drive your back up into the bar|bent-back wrists carrying the bar;good-morning out of the hole|high-bar squat|pause low-bar|SP-AX;HIP-FLEX;WR-EXT;SH-ABD-ER|rack;barbell|Y|D|Stronger By Science;Calgary Barbell|Moves the most weight for powerlifting|
C003|Front squat|clean-grip front squat|Squat|C001|BB|quads|upper back;glutes|quads, upright torso|squat|S|Both|3-8 @1-3RIR|Bar on front of shoulders touching throat;fingertips or crossed arms;elbows high|Keep elbows pointing forward;sit straight down;stay tall like a wall is behind you|elbows dropping so the bar rolls;heels lifting|goblet squat|pause front squat|SP-AX;KN-DEEP;WR-EXT;KN-FWD|rack;barbell|Y|D|Juggernaut;EliteFTS|Quad-heavy, kinder to the lower back, exposes a weak upper back|
C004|Conventional deadlift|deadlift;pull|Hinge|-|BB|glutes;hamstrings;erectors|lats;traps;quads;forearms|whole back side, off the floor|hinge|M|Str|1-6 @1-3RIR|Mid-foot under bar;hands just outside legs;shins to bar, chest up|Push the floor away, don't yank;keep the bar touching your legs;stand up tall and squeeze your glutes|back rounding as the bar leaves the floor;hips shooting up first|trap-bar deadlift|deficit deadlift|SP-AX;SP-SHEAR;GRIP|barbell;plates|Y|D|Barbell Medicine;Juggernaut|Most direct test of total-body strength|
C005|Sumo deadlift|sumo|Hinge|C004|BB|glutes;adductors;quads|erectors;traps|hips and adductors, shorter pull|hinge|M|Str|1-5 @1-3RIR|Wide stance, toes out;hands inside knees;hips close to the bar|Spread the floor apart with your feet;chest up, hips in;push your knees out as you stand|hips too high (turns into a stiff-leg pull);rushing off the floor|block sumo pull|pause sumo|SP-AX;HIP-ADD;GRIP|barbell|Y|D|Calgary Barbell|Shorter range; suits some body proportions|
C006|Romanian deadlift|RDL|Hinge|C004|BB|hamstrings;glutes|erectors;forearms|hamstrings at long length|hinge|S|Hyp|6-10 @1-3RIR|Stand holding the bar at the hips;soft knees;feet hip-width|Push your butt back like closing a car door;bar slides down your thighs;stop when hamstrings are tight, not when the bar hits the floor|rounding the back to go lower;bending knees into a squat|DB RDL|deficit/ stiff-leg|HAM-LONG;SP-SHEAR;GRIP|barbell|Y|C|Maeo 2021 (long-length principle);Nippard|Huge hamstring stretch under load|
C007|Bench press|flat bench|Horizontal press|-|BB|chest;triceps|front delts|mid chest|horizontal press|M|Both|3-8 @1-3RIR|Eyes under bar;shoulder blades pinched and down;feet planted|Bend the bar to tuck your elbows a little;touch low chest softly;push yourself away from the bar|bouncing off the chest;elbows flared straight out|push-up|pause bench|SH-HABD;WR-EXT|bench;rack;barbell|Y|D|Stronger By Science|Main upper-body strength lift|
C008|Overhead press|military press;OHP|Vertical press|-|BB|front delts;triceps|side delts;upper chest;core|front delts|vertical press|M|Both|3-8 @1-3RIR|Bar on front of shoulders;hands just outside shoulders;squeeze glutes|Move your head back, then through;press the bar straight up over your mid-foot;finish with biceps by your ears|leaning back a lot;bar drifting forward|seated DB press|push press|SH-OH;SP-EXT;WR-EXT|rack;barbell|Y|D|Barbell Medicine|Builds pressing strength and shoulders|
C009|Pull-up|overhand pull-up|Vertical pull|-|BW|lats|biceps;rear delts;lower traps|lats|vertical pull|M|Both|5-12 @1-2RIR|Hands just outside shoulders, palms forward;hang with arms straight;squeeze legs together|Pull your elbows down to your back pockets;chest up to the bar;lower all the way to a straight-arm hang|kicking;half reps|band-assisted pull-up|weighted pull-up|SH-OH;GRIP|pull-up bar|Y|D|r/bodyweightfitness;Nippard|Best home lat builder|
C010|Lat pulldown|pulldown|Vertical pull|C009|SEL|lats|biceps;rear delts|lats|vertical pull|S|Hyp|8-15 @0-2RIR|Thighs locked under pad;grip a bit wider than shoulders;lean back slightly|Lead with your elbows;pull the bar to your upper chest;let your arms stretch fully at the top|swinging the body;stopping short of the stretch|band pulldown|single-arm pulldown|SH-OH|pulldown machine|N|D|RP;Nippard|Easy to load and progress for lat size|
C011|Barbell row|bent-over row|Horizontal pull|-|BB|upper back;lats|biceps;erectors;rear delts|mid back|horizontal pull|S|Both|6-10 @1-3RIR|Hinge to about 45°;bar hangs at knees;flat back|Pull the bar to your belly button;squeeze shoulder blades together;keep your chest still|standing up into it;rounding the low back|chest-supported row|Pendlay row|SP-SHEAR;GRIP|barbell|Y|D|Juggernaut|Builds the back and teaches holding a hinge|
C012|Chest-supported row|T-bar chest-supported;machine row|Horizontal pull|C011|PL|upper back;lats|rear delts;biceps|mid/upper back, no low-back fatigue|horizontal pull|S|Hyp|8-12 @0-2RIR|Chest on pad;handles at full arm reach;feet braced|Drive your elbows back;pause with blades squeezed;let your shoulders reach forward on the way down|lifting the chest off the pad;cutting the stretch|seated cable row|lengthened partials|-|row machine|N|D|Nippard;RP|Back growth with zero low-back fatigue|
C013|Seated cable row|cable row|Horizontal pull|C011|CB|lats;mid back|biceps;rear delts|lats at long length with a forward reach|horizontal pull|S|Hyp|8-15 @0-2RIR|Feet on platform, soft knees;neutral handle;sit tall|Reach forward and let your back stretch;row to your belly;keep your chest proud|rocking far back;shrugging|band row|single-arm cable row|-|cable stack|N|D|RP|Constant tension and a big stretch|
C014|Bulgarian split squat|rear-foot-elevated split squat|Lunge|-|DB|quads;glutes|adductors|quads or glutes depending on lean|single-leg squat|S|Hyp|6-12 @1-2RIR|Back foot laces-down on bench;front foot about a stride ahead;DBs at sides|Drop your back knee straight down;front knee travels over toes;lean forward a little for more glutes|front heel lifting;pushing off the back leg|split squat|deficit BSS|KN-DEEP;HIP-FLEX;KN-FWD|bench;dumbbells|Y|D|Nippard;Menno Henselmans|Brutal leg growth with light weights; home-friendly|
C015|Walking lunge|lunge|Lunge|C014|DB|glutes;quads|adductors;calves|glutes with long stride|lunge|A|Hyp|8-12/leg @1-3RIR|DBs at sides;clear path;stand tall|Take a long step;drop the back knee softly;push through the front heel|short choppy steps;knee banging floor|reverse lunge|deficit reverse lunge|KN-DEEP|dumbbells|Y|D|Mountain Dog|Glute and quad pump finisher|
C016|Leg press|45° leg press|Squat|C001|PL|quads;glutes|adductors|quads; feet low = more quad|squat|S|Hyp|8-15 @0-2RIR|Back and hips flat on pad;feet shoulder-width mid-platform;release safeties|Lower until your knees come close to your chest;keep your lower back on the pad;press through the whole foot|butt lifting off the pad at the bottom;locking knees hard|bodyweight squat|single-leg press|KN-DEEP;HIP-FLEX|leg press|N|D|RP;Nippard|Heavy leg work without spinal loading|
C017|Hack squat|machine hack|Squat|C001|PL|quads|glutes;adductors|quads, deep knee bend|squat|S|Hyp|6-12 @0-2RIR|Shoulders under pads, back flat;feet mid-plate, shoulder-width;release handles|Sit straight down deep;keep your back glued to the pad;drive up without locking out|shallow reps;heels lifting|leg press|lengthened partial hack|KN-DEEP;KN-FWD|hack squat machine|N|D|Nippard;Paul Carter|Top quad builder in commercial gyms|
C018|Pendulum squat|pendulum|Squat|C001|PL|quads|glutes|quads, very deep with stable torso|squat|S|Hyp|8-12 @0-2RIR|Shoulder pads on;feet mid-platform;release lock|Let your knees travel far forward;go as deep as you can control;push through the whole foot|cutting depth;bouncing|hack squat|1.5 reps|KN-DEEP;KN-FWD|pendulum machine|N|D|Nippard;Eugene Teo|Deep quad stretch with little back load; "quad killer"|
C019|Belt squat|hip belt squat|Squat|C001|PL|quads;glutes|adductors|legs with zero spinal load|squat|S|Both|8-15 @1-2RIR|Belt around hips;feet on platforms;hold handles lightly|Sit straight down;keep chest up;stand by pushing the floor away|leaning on handles;cutting depth|goblet squat|belt squat march|KN-DEEP|belt squat machine|N|D|EliteFTS;Barbell Medicine|Leg volume when the back is cranky|
C020|Leg extension|knee extension|Knee extension|-|SEL|quads|-|rectus femoris when reclined|knee extension|A|Hyp|10-20 @0-1RIR|Knee lined up with machine pivot;pad on lower shin;lean back if the seat allows|Kick up and squeeze 1 second;lower slowly to a deep bend;lean back to stretch the front of the hip|swinging;short range at the bottom|band knee extension|reclined/ lengthened partial|KN-OKC|leg extension machine|N|B|Pedrosa 2022;hip-angle study via SBS|Isolates quads; reclined version grew rectus femoris more|
C021|Seated leg curl|seated hamstring curl|Knee flexion|-|SEL|hamstrings|calves|hamstrings at long length|knee flexion|A|Hyp|8-15 @0-1RIR|Knee lined up with pivot;thigh pad snug;lean torso forward|Lean forward for more stretch;pull heels under the seat;control the way back up|leaving range out at the start;hips lifting|lying leg curl|single-leg/ lengthened partial|HAM-LONG|seated leg curl machine|N|B|Maeo 2021 (+14% vs +9%)|Grew hamstrings more than lying curls in a trial|
C022|Lying leg curl|prone leg curl|Knee flexion|C021|SEL|hamstrings|calves|hamstrings, shortened|knee flexion|A|Hyp|8-15 @0-1RIR|Lie face down, knees just off pad;pad above heels;grip handles|Keep hips pressed down;curl heels to butt;lower slowly|hips piking up;fast drops|slider curl|single-leg|-|lying leg curl|N|B|Maeo 2021|Works when no seated machine; grows short head/sartorius|
C023|Nordic hamstring curl|Nordic;Russian curl|Knee flexion|C021|BW|hamstrings|glutes;calves|eccentric hamstrings|knee flexion|A|Both|3-8 @1-3RIR (lowering)|Kneel on pad;ankles anchored (partner, strap, bar);hips straight|Fall forward slowly like a tree;keep a straight line from knees to head;catch yourself and push back up|bending at hips;dropping fast early|band-assisted Nordic|weighted Nordic|HAM-LONG|anchor;pad|Y|B|van Dyk 2019 (up to 51%);reappraisal inconclusive;Maeo 2024|Most proven hamstring-injury-prevention drill|
C024|Barbell hip thrust|hip thrust|Hip extension|-|BB|glutes|hamstrings;adductors|glutes, shortened|hip extension|S|Hyp|8-15 @1-2RIR|Upper back on bench edge;bar padded over hips;feet flat, shins vertical at top|Tuck your chin and ribs down;drive through heels;squeeze glutes hard at top|arching the low back;feet too far out|glute bridge|single-leg thrust|SP-EXT|bench;barbell;pad|Y|C|Bret Contreras;Nippard|Heavy glute loading without much fatigue|
C025|45° back extension|hyperextension|Hip extension|-|BW|glutes;hamstrings|erectors|glutes with rounded upper back|hip hinge|A|Hyp|10-20 @1-2RIR|Pad just below hip crease;feet wide, toes out;hold a plate|Hinge at hips, not low back;squeeze glutes to come up;stop in a straight line|hyperextending at top;swinging|bodyweight|weighted DB/ band|SP-EXT|back-extension bench|N|D|Nippard;RP|Cheap glute and hamstring builder|
C026|Standing calf raise|calf raise machine|Calf|-|SEL|gastrocnemius|soleus|calves at stretch|ankle plantarflexion|A|Hyp|8-15 @0-1RIR|Balls of feet on edge;shoulders under pads;knees straight|Sink your heels all the way down and pause 1-2 s;rise high;don't bounce|bouncing;half reps at top|bilateral BW on step|lengthened partials|ANK-DF|calf machine;step|N|B|Kassiano 2023|Calves respond to deep stretch|
C027|Seated calf raise|soleus raise|Calf|C026|PL|soleus|gastrocnemius|soleus (knee bent)|ankle plantarflexion|A|Hyp|10-20 @0-1RIR|Knees under pad;balls of feet on platform;release lever|Drop heels deep and pause;push through big toe;slow down|bouncing;short range|DB on knees|lengthened partials|ANK-DF|seated calf machine|N|D|RP|Hits soleus the standing raise misses|
C028|Incline dumbbell press|incline DB|Horizontal press|C007|DB|upper chest;front delts|triceps|upper chest, deep stretch|incline press|S|Hyp|6-12 @1-2RIR|Bench 30-45°;kick DBs up off knees;blades pinched|Lower DBs wide and deep to a chest stretch;press up and slightly in;keep wrists stacked over elbows|bench set too steep (turns into shoulder press);bouncing|push-up feet elevated|low-incline lengthened partials|SH-HABD|bench;dumbbells|Y|D|Nippard;Menno|Upper-chest growth and shoulder-friendly pressing|
C029|Dumbbell bench press|DB bench|Horizontal press|C007|DB|chest|triceps;front delts|chest stretch|horizontal press|S|Hyp|6-12 @1-2RIR|Flat bench;DBs on knees, roll back;blades pinched|Lower to a deep but comfortable stretch;press up like an arch;control every rep|dropping too deep cold;elbows at 90° flare|push-up|deficit|SH-HABD|bench;dumbbells|Y|D|RP|Freer path, often joint-friendlier|
C030|Machine chest press|Hammer Strength chest press;iso-lateral|Horizontal press|C007|PL|chest|triceps;front delts|chest, stable|horizontal press|S|Hyp|8-12 @0-1RIR|Seat so handles line up with mid-chest;blades back;feet planted|Keep shoulder blades back;press without locking out hard;lower slowly into the stretch|seat too high;shoulders rolling forward|push-up|single-arm|SH-HABD|chest press machine|N|D|Nippard;Paul Carter|Train to failure safely with no spotter|
C031|Weighted dip|parallel-bar dip|Horizontal press|C007|BW|lower chest;triceps|front delts|lower chest, stretched|dip|S|Hyp|6-12 @1-2RIR|Grip parallel bars;lock out at top;lean slightly forward|Lower until shoulders are just below elbows;keep shoulders down, not shrugged;push back up tall|dropping too deep;shoulders rolling forward|assisted dip|weighted dip belt|SH-EXT;EL-STRESS|dip bars|Y|D|Paul Carter;Mountain Dog|Classic "upper-body squat"|RISK
C032|Push-up|press-up|Horizontal press|C007|BW|chest;triceps|front delts;core|chest|horizontal press|A|Hyp|8-25 @0-2RIR|Hands a bit wider than shoulders;body straight plank;squeeze glutes|Lower your chest to just above the floor;elbows about 45° from your body;push the floor away|sagging hips;head poking forward|incline push-up|deficit/weighted|WR-EXT|floor|Y|B|Kikuchi/Calatayud-type trials (push-up ≈ bench at matched effort)|Equipment-free chest growth|
C033|Cable fly|cable crossover|Chest fly|-|CB|chest|front delts|chest stretch with constant tension|horizontal adduction|A|Hyp|10-15 @0-1RIR|Pulleys at shoulder height;step forward, split stance;soft elbows|Open arms wide to a chest stretch;hug a big tree;squeeze 1 s|bending elbows into a press;overstretching shoulders|band fly|single-arm|SH-HABD|cable stack|N|D|Nippard;RP|Tension in the stretch where dumbbell flies die|
C034|Pec deck|machine fly|Chest fly|C033|SEL|chest|front delts|chest|horizontal adduction|A|Hyp|10-20 @0-1RIR|Seat so handles are at chest height;blades back;grip handles|Keep chest up;bring hands together in an arc;stretch slowly|shoulders rolling forward;slamming stack|band fly|lengthened partials|SH-HABD|pec deck|N|D|Nippard|Easy failure, stable, joint-friendly|
C035|Dumbbell lateral raise|side raise|Lateral delt|-|DB|side delts|upper traps|side delts|shoulder abduction|A|Hyp|10-20 @0-1RIR|Stand tall;DBs at sides;slight forward lean|Lead with your elbows;raise out to shoulder height;lower slowly|swinging;shrugging up|seated|lean-in|SH-ABD-ER|dumbbells|Y|D|Nippard (B-tier)|Shoulder width with minimal gear|
C036|Cable lateral raise|single-arm cable lateral|Lateral delt|C035|CB|side delts|supraspinatus|side delts at stretch|shoulder abduction|A|Hyp|10-20 @0-1RIR|Pulley at hand height or higher;cuff or handle;stand side-on|Start with the arm across your body;sweep up and out;control down|turning it into a front raise;hiking the shoulder|DB lateral|lengthened partials|SH-ABD-ER|cable stack;cuff|N|D|Nippard (S-tier)|Keeps tension at the bottom where dumbbells give none|
C037|Cable Y-raise|cross-body Y-raise|Lateral delt|C035|CB|side delts|lower traps|side delts, stretched, cross-body|shoulder abduction|A|Hyp|10-20 @0-1RIR|Both low pulleys crossed (left hand right cable);stand in the middle;arms crossed in front|Raise arms up and out into a Y;thumbs slightly up;lower slowly back across|shrugging;arching back|DB Y-raise incline|behind-back cuff raise|SH-OH;SH-ABD-ER|two cables|N|D|Nippard (S-tier)|Huge side-delt stretch and both sides at once|
C038|Reverse pec deck|rear delt machine|Rear delt|-|SEL|rear delts|mid traps;rhomboids|rear delts|horizontal abduction|A|Hyp|12-20 @0-1RIR|Face pad;handles at shoulder height;neutral or pronated grip|Push hands out wide;think "elbows back," not "blades together";slow return|squeezing blades too much (turns into a row);using momentum|band pull-apart|single-arm cross-body|-|machine|N|D|RP;Nippard|Easiest way to grow stubborn rear delts|
C039|Face pull|rope face pull|Rear delt|C038|CB|rear delts;external rotators|mid traps|rear delts and rotator cuff|horizontal pull+ER|A|Both|12-20 @1-2RIR|Rope at upper chest/face height;step back;thumbs to you|Pull the rope to your eyes;spread the rope apart;finish with fists beside ears|leaning back;pulling to chest|band face pull|half-kneeling|SH-ABD-ER|cable;rope|N|D|Barbell Medicine;Meadows|"Shoulder health" and posture work|
C040|Barbell curl|standing curl|Biceps|-|BB|biceps|brachialis;forearms|biceps|elbow flexion|A|Hyp|8-12 @0-2RIR|Shoulder-width underhand grip;stand tall;elbows at sides|Keep elbows pinned;curl to shoulders without swinging;lower all the way|swinging hips;half reps|DB curl|cheat curl eccentrics|WR-EXT;EL-STRESS|barbell|Y|D|-|Load-able staple|
C041|Incline dumbbell curl|incline curl|Biceps|C040|DB|biceps (long head)|brachialis|biceps at long length|elbow flexion|A|Hyp|8-15 @0-1RIR|Bench 45-60°;arms hang straight behind body;palms forward|Let arms hang behind you;curl without moving your elbows forward;lower to a full stretch|elbows swinging forward;bench too upright|DB curl|lengthened partials|SH-EXT;EL-STRESS|bench;dumbbells|Y|C|Pedrosa/ Sato long-length elbow-flexor data|Long-head stretch "peak" builder|
C042|Bayesian cable curl|face-away cable curl|Biceps|C040|CB|biceps|brachialis|biceps at long length, constant tension|elbow flexion|A|Hyp|10-15 @0-1RIR|Low pulley behind you;step forward, split stance;arm angled back|Let the cable pull your arm back;curl keeping elbow behind you;squeeze at top|letting elbow drift forward;too heavy|incline curl|lengthened partials|SH-EXT|cable stack|N|D|Menno Henselmans (named);Nippard|Stretch-biased curl with tension all the way|
C043|Preacher curl|Scott curl|Biceps|C040|BB|biceps (short head);brachialis|-|biceps at long length (bottom)|elbow flexion|A|Hyp|8-12 @0-1RIR|Armpits snug over pad;EZ bar or DB;arms straight on pad|Lower all the way under control;curl without lifting off the pad;slow the last bit down|dropping fast to the bottom;hips lifting|machine preacher|lengthened partials|EL-STRESS|preacher bench;EZ bar|N|C|Pedrosa 2021 preacher partials|Strict, hard to cheat; stretch at bottom|RISK
C044|Hammer curl|neutral curl|Biceps|C040|DB|brachialis;brachioradialis|biceps|forearm/arm thickness|elbow flexion|A|Hyp|8-15 @0-2RIR|DBs at sides, thumbs up;stand tall;elbows tucked|Curl like holding a hammer;keep wrists straight;lower slowly|swinging;elbows drifting|cable rope hammer|cross-body hammer|-|dumbbells|Y|D|-|Arm thickness; elbow-friendly|
C045|Overhead cable triceps extension|overhead rope extension|Triceps|-|CB|triceps (all, long head most)|-|triceps long head at long length|elbow extension|A|Hyp|8-15 @0-1RIR|Rope on low/mid pulley;face away, split stance;elbows by ears|Keep elbows pointing forward;let hands drop behind head for a deep stretch;straighten arms fully|elbows flaring wide;arching low back|DB overhead extension|lengthened partials|SH-OH;EL-FLEX;EL-STRESS|cable;rope|N|B|Maeo 2023 (about 1.4-1.5×);Stasinaki disagreement|Grew triceps more than pushdowns in a trial|
C046|Triceps pushdown|cable pushdown|Triceps|C045|CB|triceps (lateral/medial)|-|triceps, short position|elbow extension|A|Hyp|10-20 @0-1RIR|High pulley;bar or rope;elbows at sides|Pin elbows to ribs;push down to full lock;let forearms come up to just past 90°|elbows moving forward;leaning over|band pushdown|single-arm reverse grip|-|cable|N|B|Maeo 2023 (less growth than overhead)|Easy, elbow-friendly volume|
C047|EZ-bar skull crusher|lying triceps extension|Triceps|C045|BB|triceps|-|triceps, long head stretched|elbow extension|A|Hyp|8-12 @1-2RIR|Lie on bench;EZ bar over chest;arms slightly angled back|Lower bar behind your head by bending elbows;keep elbows pointed up;press back to start|flaring elbows;dropping to the face|DB version|incline skull crusher|EL-FLEX;EL-STRESS;WR-DEV|bench;EZ bar|Y|D|RP|Heavy long-head stretch|RISK
C048|JM press|-|Triceps|C049|BB|triceps|chest|triceps, heavy|press/extension hybrid|A|Both|6-10 @1-2RIR|Close grip on bench;lower bar toward chin/throat with elbows forward;use Smith if new|Let elbows drift forward as bar lowers;stop just above the throat;push back up straight|bar path too low like bench;too heavy too soon|close-grip bench|Smith JM|EL-STRESS;EL-FLEX|bench;barbell;rack|Y|D|JM Blakley;EliteFTS|Bench lockout carryover|RISK
C049|Close-grip bench press|CGBP|Horizontal press|C007|BB|triceps;chest|front delts|triceps, lockout|horizontal press|S|Both|5-10 @1-2RIR|Grip about shoulder-width;same setup as bench;elbows tucked more|Tuck elbows close;touch lower chest;push to full lock|grip too narrow, wrists bending;flaring|DB neutral press|pause CGBP|WR-EXT;EL-STRESS|bench;barbell|Y|D|Juggernaut|Triceps mass and bench carryover|
C050|Barbell shrug|shrug|Traps|-|BB|upper traps|forearms|upper traps|scapular elevation|A|Hyp|10-20 @0-2RIR|Bar at thighs, overhand or mixed;stand tall;straps optional|Lift shoulders straight up to ears;pause 1 s;lower to a full stretch|rolling shoulders;bending elbows|DB shrug|Kelso/ trap-bar shrug|GRIP;NECK|barbell|Y|D|-|Simple trap growth|
C051|Hanging leg raise|-|Core|-|BW|abs;hip flexors|lats (grip)|lower abs|spinal/hip flexion|A|Both|8-15 @1-2RIR|Hang from bar;shoulders active;legs together|Curl your pelvis up, don't just lift legs;raise knees or legs toward chest;lower slowly with no swing|swinging;only lifting legs with hip flexors|hanging knee raise|toes-to-bar|SP-FLEX;GRIP;SH-OH|pull-up bar|Y|D|-|Hard abs with only a bar|
C052|Cable crunch|kneeling cable crunch|Core|-|CB|abs|obliques|abs with load|spinal flexion|A|Hyp|10-20 @0-2RIR|Kneel facing high pulley;rope beside head;hips back|Curl ribs toward hips;round your back like a cat;keep hips still|sitting back to pull with arms;hips moving|crunch|heavier/ pause|SP-FLEX|cable;rope|N|D|RP|Progressive loading for abs|
C053|Ab wheel rollout|rollout|Core|-|BW|abs|lats;hip flexors|anti-extension|anti-extension|A|Both|6-12 @1-2RIR|Kneel on pad;wheel under shoulders;ribs down|Roll out slowly keeping your back flat;go only as far as you can without arching;pull back with your abs|low back sagging;going too far too soon|wall or incline rollout|standing rollout|SP-EXT|ab wheel or barbell|Y|C|McGill-type EMG|Strong anti-extension core work|
C054|Pallof press|anti-rotation press|Core|-|CB|obliques;deep core|glutes|anti-rotation|anti-rotation|A|Both|8-12 or 20-30 s @2-3RIR|Cable at chest height, side-on;hold handle at chest;athletic stance|Press hands straight out;don't let the cable twist you;breathe while holding|rotating;shrugging|band|half-kneeling/ overhead|-|cable or band|Y|D|Prehab Guys|Core control without spinal bending|
C055|Farmer carry|farmer walk|Carry|-|DB|grip;traps;core|glutes;calves|grip and trunk stiffness|carry|A|Both|20-40 m x3-5 @hard|Heavy DBs or handles;stand tall;brace|Walk tall like a soldier;short quick steps;squeeze handles hard|leaning;shuffling|lighter|suitcase (one side)|GRIP|dumbbells or handles|Y|D|EliteFTS;strongman|Grip, traps, conditioning in one|
C056|Trap-bar deadlift|hex-bar deadlift|Hinge|C004|SPB|quads;glutes;hamstrings|traps;erectors|hinge-squat hybrid|hinge|M|Both|3-8 @1-3RIR|Stand in centre;grip mid handles;hips down, chest up|Push the floor away;stand straight up;keep arms long|squatting too low;hips rising first|high-handle|deficit|SP-AX;GRIP|trap bar|N|C|Swinton 2011 biomech|Easier to learn, less back stress|
C057|Safety squat bar squat|SSB squat;yoke bar|Squat|C001|SPB|quads;upper back|glutes;erectors|upper back and quads|squat|M|Both|3-8 @1-3RIR|Pads on traps;hold handles in front;same stance as squat|Push your head and upper back up into the bar;sit straight down;don't let it fold you forward|chest collapsing;handles pulled down hard|front squat|SSB pause/ Hatfield|SP-AX;KN-DEEP|SSB;rack|N|D|EliteFTS;Barbell Medicine|Squat when shoulders/elbows hurt|
C058|Zercher squat|-|Squat|C001|BB|quads;upper back|glutes;biceps|upright torso, upper back|squat|S|Both|5-8 @1-3RIR|Bar in elbow crooks at rack height;hands together;pad bar|Hug the bar to your body;sit down between your knees;stay tall|rounding upper back;bar sliding down forearms|goblet squat|Zercher from floor|SP-AX;KN-DEEP;EL-STRESS|rack;barbell;pad|Y|D|EliteFTS;T-Nation|Upper back and brace builder|
C059|Rack pull|partial deadlift|Hinge|C004|BB|upper back;traps;glutes|erectors;grip|top of deadlift, upper back|hinge|S|Str|3-6 @1-3RIR|Bar on pins at or below knee;normal deadlift grip;shins near bar|Pull slack out first;push hips forward to stand;don't lean back|leaning back at lockout;yanking|block pull|pause above knee|SP-AX;GRIP|rack;barbell|Y|D|EliteFTS;Meadows|Overloads top range and builds traps|POP-LOW
C060|Larsen press|feet-up press (legs extended)|Horizontal press|C007|BB|chest;triceps|front delts|chest/triceps without leg drive|horizontal press|S|Str|4-8 @1-3RIR|Normal bench setup;legs straight out, heels on floor;no leg drive|Stay tight through your upper back;touch chest softly;press straight up|wriggling for balance;too heavy|DB bench|pause Larsen|SH-HABD;WR-EXT|bench;barbell|Y|D|Calgary Barbell;Juggernaut|Removes leg drive to bench "honest"|
C061|Spoto press|bench pause above chest|Horizontal press|C007|BB|chest;triceps|front delts|mid-range strength, bar control|horizontal press|S|Str|3-6 @1-3RIR|Normal bench setup;lower bar|Stop 2-5 cm above your chest;hold 1 s without touching;press up|sinking onto chest;losing tightness|pause bench|long pause Spoto|WR-EXT|bench;barbell|Y|D|Eric Spoto;Juggernaut|Off-chest strength and bar-path control|
C062|Pin press|dead-stop bench|Horizontal press|C007|BB|triceps;chest|front delts|sticking point (chosen height)|horizontal press|S|Str|2-5 @1-3RIR|Set pins at sticking point;lie under;bar rests on pins|Get tight before pressing;explode off the pins;no bounce|bouncing off pins;loose start|board press|lower pin|WR-EXT|rack;bench;barbell|Y|D|EliteFTS;Calgary Barbell|Builds the weak spot|
C063|Floor press|-|Horizontal press|C007|BB|triceps;chest|front delts|lockout, shoulder-friendly|horizontal press|S|Str|3-8 @1-3RIR|Lie on floor in rack or with DBs;knees bent or legs flat;upper arms rest on floor|Lower until triceps gently touch the floor;pause;press up hard|bouncing elbows;flared elbows|DB floor press|pause|WR-EXT|barbell;rack or DBs|Y|D|EliteFTS;Westside|Bench work for cranky shoulders; home-friendly|
C064|Board press|2-board/3-board|Horizontal press|C007|BB|triceps|chest|lockout overload|horizontal press|S|Str|2-5 @1-3RIR|Partner holds boards on chest or strap board on;normal bench setup|Touch the board softly;press through to lockout;keep elbows tucked|bouncing off board;losing shoulder position|pin press|fewer boards|EL-STRESS|boards;spotter|N|D|EliteFTS;Westside|Overload top-half strength|
C065|Jefferson curl|weighted spinal flexion|Hinge|-|BB|erectors;hamstrings|spinal stabilisers|loaded end-range spinal flexion|segmental flexion|A|-|5-8 very light, slow|Stand on box;light bar or KB;knees straight|Roll down one vertebra at a time chin first;go only to comfortable range;roll up slowly|loading heavy;fast reps|bodyweight roll-down|- (no loaded progression advised)|SP-FLEX;HAM-LONG|box;light weight|Y|D benefit; C risk|McGill (risks outweigh benefits);no clinical studies (Garage Gym Reviews)|Loved by mobility coaches for "bulletproof back" feel|RISK;POP-LOW
C066|Good morning|barbell good morning|Hinge|C004|BB|hamstrings;glutes;erectors|upper back|hamstrings and back|hinge|S|Both|6-10 @2-3RIR|Bar on back as in squat;soft knees;brace|Push hips back with a flat back;bow forward until hamstrings are tight;stand up squeezing glutes|rounding;too heavy|RDL|SSB good morning|SP-SHEAR;HAM-LONG;SP-AX|rack;barbell|Y|D|Westside;EliteFTS|Posterior chain for squat/pull|RISK
C067|Sissy squat|-|Knee extension|C020|BW|quads (rectus femoris)|-|quads at long length|knee-dominant squat|A|Hyp|8-15 @1-2RIR|Hold a post;rise onto toes;hips straight|Lean back as knees go forward;keep a straight line from knees to shoulders;go as deep as is comfortable|bending at hips;going too deep cold|assisted/ partial|weighted|KN-DEEP;KN-FWD|post or sissy bench|Y|D|SBS commentary (suspected better than leg ext)|Deep quad stretch with no machine|
C068|Reverse Nordic|-|Knee extension|C020|BW|quads (rectus femoris)|hip flexors|quads at long length|knee extension eccentric|A|Both|6-12 @1-3RIR|Kneel tall on pad;body straight hips to head;arms forward|Lean back slowly in one straight line;stop where you can still control;squeeze back up|bending at hips;dropping|band-assisted|weighted/ deeper|KN-DEEP|pad|Y|D|SBS commentary;Kneesovertoes|Quad and knee tolerance at home|
C069|Hip abduction machine|outer thigh machine|Hip abduction|-|SEL|glute medius/minimus|upper glute max|side glutes|hip abduction|A|Hyp|12-25 @0-1RIR|Pads outside knees;sit tall or lean forward;grip handles|Push knees out wide;pause 1 s;slow return|slamming stack;tiny range|band abduction|lean-forward|-|machine|N|D|Nippard (lean-forward cue)|Upper-glute "shelf" work|
C070|Hip adduction machine|inner thigh machine|Hip adduction|-|SEL|adductors|-|adductors at stretch|hip adduction|A|Hyp|10-20 @0-1RIR|Pads inside knees;open to a comfortable stretch;sit tall|Squeeze knees together;control the stretch;don't bounce|opening too wide cold;bouncing|band|lengthened partials|HIP-ADD|machine|N|D|RP|Adductors are a big, often-skipped muscle|
C071|Copenhagen plank|Copenhagen adduction|Hip adduction|C070|BW|adductors|obliques|adductors, eccentric/isometric|side plank adduction|A|Both|3-15/side or 15-30 s|Side plank;top leg on bench (knee=easy, ankle=hard);bottom leg free|Lift your hips into a straight line;press top leg into bench;lower bottom leg slowly and lift back|hips sagging;rushing|short lever|long lever + reps|HIP-ADD|bench|Y|B|Harøy 2019 (41% fewer groin problems)|Groin-injury prevention, home-friendly|
C072|Inverted row|bodyweight row;Australian pull-up|Horizontal pull|C011|BW|upper back;lats|biceps;rear delts|mid back|horizontal pull|A|Both|8-15 @1-2RIR|Bar at hip height in rack;hang under, heels on floor;body straight|Pull your chest to the bar;squeeze blades;keep hips up|sagging hips;half reps|bent-knee|feet elevated/weighted|-|rack;barbell or rings|Y|D|r/bodyweightfitness|Home row with rack only|
C073|Pike push-up|-|Vertical press|C008|BW|front delts;triceps|upper chest|overhead pressing|vertical press|A|Both|6-12 @1-2RIR|Hands on floor;hips high in an upside-down V;feet close|Lower head forward of your hands;elbows about 45°;press back up|elbows flaring;head straight down|incline pike|feet-elevated pike → HSPU|SH-OH;WR-EXT|floor/box|Y|D|r/bodyweightfitness|Shoulder press at home|
C074|Single-arm dumbbell row|one-arm row|Horizontal pull|C011|DB|lats;upper back|biceps;rear delts|lats, stretched|horizontal pull|S|Hyp|8-12 @0-2RIR|Hand and knee on bench;flat back;DB hanging|Let the DB stretch your lat at the bottom;row to your hip;don't twist|twisting;jerking|chest-supported DB row|Kroc row|GRIP|bench;dumbbell|Y|D|-|Simple, home-friendly, big stretch|
C075|Meadows row|landmine single-arm row|Horizontal pull|C011|BB|lats;upper back|rear delts;biceps|lats and upper back, stretched|horizontal pull|A|Hyp|8-12 @0-2RIR|Bar in landmine or corner;stand side-on, staggered;overhand grip on bar end|Hinge and let your shoulder stretch down;row elbow up and back;control down|twisting torso;using straps too early|single-arm DB row|deficit stance|SP-SHEAR;GRIP|barbell;landmine|Y|D|John Meadows|Unique stretch and upper-back thickness|
C076|Wrist curl and reverse wrist curl|forearm curl|Forearm|-|DB|wrist flexors/extensors|brachioradialis|forearms|wrist flexion/extension|A|Hyp|12-20 @1-2RIR|Forearms on thighs or bench;palms up (curl) or down (reverse)|Let the wrist roll down slowly;curl up only at the wrist;keep forearm still|moving elbows;too heavy|lighter|behind-back BB curl|WR-EXT|dumbbells|Y|D|-|Forearm size and elbow resilience|
C077|Tibialis raise|tib raise|Lower leg|-|BW|tibialis anterior|-|front of shin|ankle dorsiflexion|A|Both|15-25 @1-2RIR|Back against wall;heels about a foot out;straight legs|Pull toes up toward shins;pause 1 s;lower slowly|bending knees;bouncing|seated band|tib bar/ single-leg|-|wall|Y|D|Kneesovertoes|Shin and knee-friendly prep|
C078|Neck curl and neck extension|neck flexion/extension|Neck|-|BW|neck flexors/extensors|upper traps|neck|neck flexion/extension|A|Both|15-25 @2-3RIR|Lie on bench, head off end;towel-padded plate if loaded;start bodyweight|Nod chin to chest slowly;move only the neck;control back|jerking;starting heavy|isometric hand press|harness/ machine|NECK|bench|Y|D|combat-sport S&C|Neck size; contact-sport resilience|
```

## 1b. Exercise table — variant rows (inherit from parent)

```
id|name|aliases|parent|implement|emphasis_override|use_goal|reps_effort|joint_flags|home|grade|why|flag
V001|Pause back squat|2-count pause squat|C001|BB|bottom strength|S Str|2-5 @2-3RIR|SP-AX;KN-DEEP|Y|D|Kills the bounce, builds the hole|
V002|Tempo squat (3-1-0)|-|C001|BB|control, technique|S Both|4-8 @2-3RIR|SP-AX;KN-DEEP|Y|D|Technique and quads with less load|
V003|Pin squat|dead-stop squat|C001|BB|start-from-stop strength|S Str|2-5 @2-3RIR|SP-AX;KN-DEEP|Y|D|Removes stretch reflex|
V004|Anderson squat|bottom-up squat|C001|BB|concentric from chosen depth|S Str|1-5 @2-3RIR|SP-AX|Y|D|Paul Anderson's sticking-point builder|
V005|Box squat|-|C001|BB|hips, depth control|S Str|2-5 @2-3RIR|SP-AX|Y|D|Teaches sitting back; Westside staple|
V006|Heel-elevated goblet squat|-|C001|DB|quads|A Hyp|10-20 @1-2RIR|KN-FWD;KN-DEEP|Y|D|Quad pump at home|
V007|Goblet squat|-|C001|DB|learning, quads|A Both|8-15 @1-3RIR|KN-DEEP|Y|D|Best beginner squat|
V008|Cyclist squat|narrow heels-up squat|C001|BB|vastus/teardrop quads|A Hyp|10-15 @1-2RIR|KN-FWD;KN-DEEP|Y|D|Mike Israetel quad pick|
V009|Smith machine squat|-|C001|SM|quads, stable|S Hyp|8-12 @0-2RIR|KN-DEEP|N|D|Push hard with no balance demand|
V010|Smith feet-forward squat|-|C001|SM|quads/glutes|S Hyp|8-12 @0-2RIR|KN-DEEP|N|D|Hack-squat substitute|
V011|Cambered bar squat|-|C057|SPB|upper back, shoulder-friendly|M Str|3-6 @1-3RIR|SP-AX|N|D|Shoulder relief, back challenge|
V012|Pause front squat|-|C003|BB|upright position|S Str|2-5 @2-3RIR|SP-AX;KN-DEEP|Y|D|Builds torso position|
V013|Front squat cross-arm|bodybuilder grip|C003|BB|wrist-friendly|S Hyp|5-10 @1-3RIR|SP-AX|Y|D|No wrist mobility needed|
V014|SSB pause squat|-|C057|SPB|bottom|S Str|3-5 @2-3RIR|SP-AX|N|D|-|
V015|Hatfield squat|SSB hand-supported squat|C057|SPB|quads, overload|S Both|5-10 @1-2RIR|SP-AX;KN-DEEP|N|D|Fred Hatfield; balance removed, legs only|
V016|V-squat|plate-loaded V-squat|C017|PL|quads/glutes|S Hyp|8-12 @0-2RIR|KN-DEEP|N|D|Hack alternative, knee-friendlier path|
V017|Reverse hack squat|facing-in hack|C017|PL|glutes|S Hyp|8-12 @0-2RIR|HIP-FLEX|N|D|Glute bias on hack machine|
V018|Hack squat lengthened partials|bottom-half hack|C017|PL|quads, stretched|F Hyp|10-15 @0RIR|KN-DEEP;KN-FWD|N|B|Wolf 2023/2025: ≈ full ROM; variety|
V019|Pendulum lengthened partials|-|C018|PL|quads, stretched|F Hyp|10-15 @0RIR|KN-DEEP|N|B|Same as above|
V020|Belt squat march|-|C019|PL|conditioning, glutes|A Both|30-60 s|-|N|D|Louie Simmons; low-back free|
V021|1.25-rep squat|-|C001|BB|bottom range|S Hyp|6-10 @1-2RIR|KN-DEEP|Y|D|More time in the stretch|
V022|Overhead squat|OHS|C001|BB|mobility, upper back|A Str|3-5 light|SH-OH;KN-DEEP|Y|D|Weightlifting skill|RISK
V023|Landmine squat|-|C001|BB|beginner-friendly|A Both|8-12 @2RIR|-|Y|D|Easy home squat|
V024|Bodyweight squat|air squat|C001|BW|learning|A Both|15-30|KN-DEEP|Y|D|-|
V025|Assisted squat|TRX/door-frame squat|C001|BW|beginner/rehab|A Both|10-20|-|Y|D|-|
V026|Pistol squat|single-leg squat|C014|BW|single-leg strength|S Both|3-8/leg|KN-DEEP;ANK-DF|Y|D|Bodyweight progression to heavy legs|
V027|Box pistol|-|V026|BW|easier pistol|A Both|5-10/leg|KN-DEEP|Y|D|-|
V028|Shrimp squat|-|C014|BW|quads|A Both|5-10/leg|KN-DEEP|Y|D|-|
V029|Single-leg leg press|-|C016|PL|unilateral|A Hyp|10-15 @0-2RIR|KN-DEEP;HIP-FLEX|N|D|Fixes side-to-side gaps|
V030|Leg press feet high/wide|-|C016|PL|glutes/adductors|A Hyp|10-15|HIP-FLEX|N|D|Glute bias|
V031|Leg press lengthened partials|-|C016|PL|quads, stretched|F Hyp|15-20 @0RIR|KN-DEEP|N|B|Wolf meta|
V032|Selectorised seated leg press|-|C016|SEL|quads|S Hyp|10-15|KN-DEEP|N|D|Commercial-gym standard|
V033|Squat with bands/chains|accommodating resistance|C001|BB|lockout, speed|S Str|2-5 @fast|SP-AX|N|C|Mixed trials; small or no edge over plain squats|POP-LOW
V034|Assisted sissy squat (bench)|sissy squat machine|C067|SEL|rectus femoris|A Hyp|10-15|KN-FWD;KN-DEEP|N|D|-|
V035|Wall sit|-|C001|BW|isometric quads|A Both|30-60 s|KN-DEEP|Y|C|Rehab overlap|
V036|Spanish squat|strap squat|C001|BAND|quad isometric, knee tendon|A Both|5×45 s|KN-DEEP|Y|D|Patellar-tendon rehab staple|
V037|Deficit deadlift|-|C004|BB|floor speed|S Str|3-5 @2RIR|SP-AX;SP-FLEX risk|Y|D|Off-the-floor strength|
V038|Block pull (below knee)|-|C059|BB|knee-to-lockout|S Str|2-5|SP-AX;GRIP|Y|D|Overloads top range|
V039|Pause deadlift (below knee)|-|C004|BB|position|S Str|2-4|SP-AX|Y|D|Fixes bar drifting forward|
V040|Snatch-grip deadlift|-|C004|BB|upper back|S Both|3-6|SP-AX;GRIP|Y|D|Upper back and pull-off strength|
V041|Stiff-leg deadlift|SLDL|C006|BB|hamstrings, from floor|S Hyp|6-10|HAM-LONG;SP-SHEAR|Y|D|Bigger stretch than RDL|
V042|Dumbbell RDL|-|C006|DB|hamstrings|S Hyp|8-12|HAM-LONG|Y|C|Home-friendly|
V043|Single-leg RDL|-|C006|DB|hamstrings, balance|A Both|8-12/leg|HAM-LONG|Y|D|Balance and hamstrings|
V044|B-stance RDL|kickstand RDL|C006|DB|unilateral bias|A Hyp|8-12/leg|HAM-LONG|Y|D|Unilateral without balance limits|
V045|Deadlift against bands|-|C004|BB|lockout|S Str|1-3|SP-AX|N|C|-|POP-LOW
V046|Sumo block pull|-|C005|BB|lockout|S Str|2-4|SP-AX|Y|D|-|
V047|Pause sumo deadlift|-|C005|BB|position|S Str|2-4|SP-AX|Y|D|-|
V048|High-handle trap-bar deadlift|-|C056|SPB|beginner/back-friendly|M Both|3-8|SP-AX|N|D|Shortest range|
V049|Kettlebell swing|-|C004|KB|hip power|A Both|10-20|SP-SHEAR|Y|C|Conditioning and hips|
V050|Cable pull-through|-|C024|CB|glutes, hinge learning|A Hyp|12-20|-|N|D|Teaches the hinge|
V051|Smith machine RDL|-|C006|SM|hamstrings, stable|S Hyp|8-12|HAM-LONG|N|D|-|
V052|Seated good morning|-|C066|BB|erectors/hamstrings|A Both|8-12|SP-SHEAR;SP-FLEX risk|Y|D|-|RISK
V053|SSB good morning|-|C066|SPB|posterior chain|S Str|5-8|SP-SHEAR|N|D|Easier bar position|
V054|Reverse hyperextension|reverse hyper|C025|PL|glutes/hamstrings|A Both|10-20|SP-EXT|N|C|Westside; "decompression" claim untested|POP-LOW
V055|Glute-ham raise|GHR|C023|PL|hamstrings, both ends|A Both|5-10|HAM-LONG|N|D|Hamstrings at knee and hip|
V056|Band-assisted Nordic|-|C023|BAND|easier Nordic|A Both|4-8|HAM-LONG|Y|B|Gets beginners started|
V057|Slider leg curl|-|C022|BW|home hamstrings|A Hyp|8-15|-|Y|D|Home curl substitute|
V058|Single-leg seated leg curl|-|C021|SEL|unilateral|A Hyp|10-15|HAM-LONG|N|B|-|
V059|Standing single-leg curl|cable/standing curl|C022|SEL|hamstrings|A Hyp|10-15|-|N|D|-|
V060|Seated leg curl with torso lean|-|C021|SEL|max stretch|A Hyp|8-12|HAM-LONG|N|C|Logical extension of Maeo 2021|
V061|Seated leg curl lengthened partials|-|C021|SEL|stretch|F Hyp|10-15 @0RIR|HAM-LONG|N|C|-|
V062|Dumbbell leg curl|-|C022|DB|home|A Hyp|10-15|-|Y|D|-|
V063|Kas glute bridge|-|C024|BB|glutes, short range|A Hyp|10-15|-|Y|D|Constant glute tension|
V064|Barbell glute bridge|-|C024|BB|glutes|A Hyp|10-15|-|Y|D|Floor-only option|
V065|Single-leg hip thrust|-|C024|BW|unilateral|A Hyp|10-20/leg|-|Y|D|-|
V066|Smith machine hip thrust|-|C024|SM|glutes, easy setup|S Hyp|8-12|-|N|D|-|
V067|Hip thrust machine|plate-loaded thrust|C024|PL|glutes|S Hyp|8-12|-|N|D|No bar setup hassle|
V068|B-stance hip thrust|-|C024|BB|unilateral bias|A Hyp|10-12/leg|-|Y|D|-|
V069|Round-back 45° extension|glute-bias hyper|C025|BW|glutes|A Hyp|12-20|-|N|D|Nippard glute cue|
V070|Weighted 45° extension|-|C025|DB|erectors/glutes|A Both|8-15|SP-EXT|N|D|-|
V071|Cable glute kickback|-|C024|CB|glutes|A Hyp|12-20|SP-EXT|N|D|Isolation finisher|
V072|Glute kickback machine|-|C024|SEL|glutes|A Hyp|12-20|SP-EXT|N|D|-|
V073|High-box step-up|-|C014|DB|glutes/quads|A Hyp|8-12/leg|KN-DEEP|Y|D|-|
V074|Deficit reverse lunge|-|C015|DB|glutes, stretched|A Hyp|8-12/leg|KN-DEEP;HIP-FLEX|Y|D|Knee-friendly lunge|
V075|Smith split squat|-|C014|SM|quads/glutes|S Hyp|8-12/leg|KN-DEEP|N|D|Stable unilateral|
V076|Front-foot-elevated split squat|-|C014|DB|deeper range|A Hyp|8-12/leg|KN-DEEP;HIP-FLEX|Y|D|-|
V077|Cossack squat|lateral squat|C014|BW|adductors|A Both|6-10/side|HIP-ADD;KN-DEEP|Y|D|Adductor mobility-strength|
V078|Static split squat|-|C014|DB|learning|A Both|8-12/leg|KN-DEEP|Y|D|Bulgarian regression|
V079|Reverse lunge|-|C015|DB|glutes, knee-friendly|A Both|8-12/leg|-|Y|D|-|
V080|Peterson step-up|Poliquin step-up|C014|BW|VMO/knee|A Both|10-15/leg|KN-FWD|Y|D|Knee-tolerance builder|
V081|Single-leg leg extension|-|C020|SEL|unilateral|A Hyp|10-20|KN-OKC|N|D|-|
V082|Reclined leg extension|leg ext hips extended|C020|SEL|rectus femoris|A Hyp|10-20 @0-1RIR|KN-OKC|N|B|RF grew more with 40° vs 90° hip angle|
V083|Leg extension lengthened partials|-|C020|SEL|distal quads|F Hyp|12-20 @0RIR|KN-OKC|N|B|Pedrosa 2022|
V084|Band-assisted reverse Nordic|-|C068|BAND|easier|A Both|8-12|KN-DEEP|Y|D|-|
V085|Lean-forward hip abduction|-|C069|SEL|glute max upper fibres|A Hyp|15-25|-|N|D|Nippard|
V086|Cable hip abduction|-|C069|CB|glute medius|A Hyp|12-20|-|N|D|-|
V087|Side-lying hip abduction|-|C069|BW|glute medius|A Both|15-25|-|Y|C|Rehab overlap|
V088|Banded lateral walk|monster walk|C069|BAND|glute medius|A Both|10-20 steps|-|Y|D|Warm-up staple|
V089|Short-lever Copenhagen|knee-supported|C071|BW|adductors|A Both|3-10/side|HIP-ADD|Y|B|Harøy programme start level|
V090|Cable hip adduction|-|C070|CB|adductors|A Hyp|12-20|HIP-ADD|N|D|-|
V091|Leg press calf raise|-|C026|PL|gastrocnemius|A Hyp|10-20|ANK-DF|N|D|-|
V092|Smith calf raise|-|C026|SM|gastrocnemius|A Hyp|10-15|ANK-DF|N|D|-|
V093|Single-leg dumbbell calf raise|-|C026|DB|home calves|A Hyp|10-20/leg|ANK-DF|Y|B|Kassiano principle at home|
V094|Calf raise lengthened partials|bottom-half calves|C026|SEL|stretch|F Hyp|15-20 @0RIR|ANK-DF|N|B|+15.2% vs +6.7% (Kassiano 2023)|
V095|Donkey calf raise|-|C026|PL|gastrocnemius stretch|A Hyp|10-15|ANK-DF|N|D|Arnold-era favourite|
V096|Seated calf raise (DB on knees)|-|C027|DB|soleus at home|A Hyp|15-25|-|Y|D|-|
V097|Tib bar raise|-|C077|SPB|tibialis|A Both|15-25|-|N|D|-|
V098|Competition-pause bench|-|C007|BB|meet specificity|M Str|1-5|SH-HABD|Y|D|Meet rules|
V099|Tempo bench (3-1-1)|-|C007|BB|control|S Both|5-8|SH-HABD|Y|D|-|
V100|Wide-grip bench|-|C007|BB|chest, shorter ROM|S Both|5-8|SH-HABD;SH-ABD-ER|Y|D|-|RISK
V101|Slingshot bench|-|C007|BB|overload|S Str|1-5|-|Y|D|Mark Bell; overload with less shoulder stress|
V102|Bench with bands/chains|-|C007|BB|lockout|S Str|2-5|-|N|C|-|POP-LOW
V103|Long-pause bench (3 s)|-|C007|BB|off-chest|S Str|2-4|SH-HABD|Y|D|-|
V104|Incline barbell bench|-|C028|BB|upper chest|S Both|5-10|SH-HABD|Y|D|-|
V105|Low-incline DB press (15-30°)|-|C028|DB|upper chest|S Hyp|8-12|SH-HABD|Y|D|Nippard angle pick|
V106|Smith incline press|-|C028|SM|upper chest, stable|S Hyp|6-12|SH-HABD|N|D|-|
V107|Hammer Strength incline press|-|C030|PL|upper chest|S Hyp|8-12|SH-HABD|N|D|-|
V108|Decline bench press|-|C007|BB|lower chest|S Both|5-10|-|Y|D|Shoulder-friendlier|
V109|Selectorised chest press|-|C030|SEL|chest|S Hyp|8-15|-|N|D|-|
V110|Iso-lateral chest press (one arm)|-|C030|PL|unilateral|A Hyp|8-12|SH-HABD|N|D|-|
V111|Dumbbell floor press|-|C063|DB|shoulder-friendly|S Both|6-12|-|Y|D|-|
V112|Neutral-grip DB press|-|C029|DB|shoulder/elbow-friendly|S Hyp|8-12|-|Y|D|-|
V113|Deficit push-up|-|C032|BW|chest stretch|A Hyp|8-20|SH-HABD;WR-EXT|Y|D|-|
V114|Weighted push-up|band/plate push-up|C032|BW|chest|A Hyp|6-15|WR-EXT|Y|B|Band push-ups matched bench gains in trials|
V115|Incline push-up|-|C032|BW|easier|A Both|10-20|WR-EXT|Y|D|-|
V116|Knee push-up|-|C032|BW|easier|A Both|10-20|WR-EXT|Y|D|-|
V117|Ring push-up|-|C032|BW|stability|A Both|8-15|WR-EXT|N|D|-|
V118|Assisted dip machine|-|C031|SEL|easier dip|A Hyp|8-12|SH-EXT|N|D|-|
V119|Bench dip|-|C031|BW|triceps|A Hyp|10-20|SH-EXT;SH-IR-ELEV|Y|D|-|RISK
V120|Ring dip|-|C031|BW|advanced|S Both|5-10|SH-EXT|N|D|-|RISK
V121|Seated dumbbell press|-|C008|DB|front delts|S Hyp|6-12|SH-OH|Y|D|-|
V122|Push press|-|C008|BB|power, overload|S Str|2-5|SH-OH;SP-AX|Y|D|-|
V123|Z press|floor seated press|C008|BB|strict core|A Str|5-8|SH-OH|Y|D|-|
V124|Selectorised shoulder press|-|C008|SEL|delts, stable|S Hyp|8-12|SH-OH|N|D|Nippard front-delt pick|
V125|Smith shoulder press|-|C008|SM|delts|S Hyp|6-10|SH-OH|N|D|-|
V126|Landmine press|-|C008|BB|shoulder-friendly arc|A Both|8-12|-|Y|C|Rehab overlap|
V127|Arnold press|-|C008|DB|front delts|A Hyp|8-12|SH-OH;SH-ABD-ER|Y|D|-|
V128|Behind-the-neck press|-|C008|BB|side delts|A Hyp|6-10|SH-ABD-ER;SH-OH|Y|D|Needs good mobility|RISK
V129|Wall handstand push-up|HSPU|C073|BW|advanced|S Both|3-8|SH-OH;WR-EXT;NECK|Y|D|-|
V130|Half-kneeling single-arm DB press|-|C008|DB|core/shoulder|A Both|8-12|SH-OH|Y|D|-|
V131|Low-to-high cable fly|-|C033|CB|upper chest|A Hyp|12-15|-|N|D|-|
V132|High-to-low cable fly|-|C033|CB|lower chest|A Hyp|12-15|-|N|D|-|
V133|Single-arm cable fly|press-around|C033|CB|stretch|A Hyp|12-15|SH-HABD|N|D|-|
V134|Dumbbell fly|-|C033|DB|chest stretch|A Hyp|10-15|SH-HABD;SH-ABD-ER|Y|D|-|RISK
V135|Incline dumbbell fly|-|C033|DB|upper chest stretch|A Hyp|10-15|SH-HABD|Y|D|-|RISK
V136|Pec deck lengthened partials|-|C034|SEL|stretch|F Hyp|12-20 @0RIR|SH-HABD|N|B|Wolf meta principle|
V137|Mid cable crossover|-|C033|CB|mid chest|A Hyp|12-20|-|N|D|-|
V138|Weighted pull-up|-|C009|BW|strength|M Str|3-8|SH-OH;GRIP|Y|D|-|
V139|Chin-up|-|C009|BW|lats+biceps|S Both|5-12|SH-OH|Y|D|-|
V140|Neutral-grip pull-up|-|C009|BW|elbow-friendly|S Both|5-12|SH-OH|Y|D|-|
V141|Band-assisted pull-up|-|C009|BAND|easier|A Both|6-12|SH-OH|Y|D|-|
V142|Machine-assisted pull-up|-|C009|SEL|easier|A Both|8-12|SH-OH|N|D|-|
V143|Negative pull-up|eccentric pull-up|C009|BW|beginner|A Both|3-6 slow|SH-OH|Y|D|-|
V144|Scapular pull-up / dead hang|-|C009|BW|grip, shoulder prep|A Both|20-60 s|SH-OH|Y|D|Shoulder-health claims are anecdotal|
V145|Wide-grip pulldown|-|C010|SEL|upper lats/teres|S Hyp|8-12|SH-OH|N|D|-|
V146|Close neutral-grip pulldown|-|C010|SEL|lats, stretched|S Hyp|8-12|SH-OH|N|D|-|
V147|Single-arm cable pulldown|half-kneeling lat pulldown|C010|CB|lats, unilateral|A Hyp|10-15|SH-OH|N|D|Nippard lat pick|
V148|Iso-lateral high row / pulldown|Hammer Strength|C010|PL|lats|S Hyp|8-12|SH-OH|N|D|-|
V149|Straight-arm pulldown|cable pullover|C010|CB|lats, no biceps|A Hyp|12-20|SH-OH|N|D|Lat isolation|
V150|Dumbbell pullover|-|C010|DB|lats/chest stretch|A Hyp|10-15|SH-OH|Y|D|-|RISK
V151|Machine pullover|Nautilus pullover|C010|SEL|lats|A Hyp|10-15|SH-OH|N|D|Mike Mentzer staple|
V152|Pendlay row|-|C011|BB|explosive, from floor|S Str|5-8|SP-SHEAR|Y|D|-|
V153|Yates row|underhand row|C011|BB|lats, upright|S Hyp|6-10|SP-SHEAR|Y|D|-|
V154|Seal row|bench prone row|C012|BB|upper back, strict|S Hyp|8-12|-|N|D|-|
V155|Chest-supported DB row|incline row|C012|DB|upper back at home|S Hyp|8-12|-|Y|D|-|
V156|T-bar row (landmine)|-|C011|BB|mid back|S Hyp|8-12|SP-SHEAR|Y|D|-|
V157|Kroc row|-|C074|DB|heavy, high reps|A Hyp|15-30|GRIP;SP-ROT|Y|D|Matt Kroczaleski|
V158|Single-arm seated cable row|-|C013|CB|lats, unilateral|A Hyp|10-15|-|N|D|-|
V159|Iso-lateral row (plate-loaded)|-|C012|PL|upper back|S Hyp|8-12|-|N|D|-|
V160|Selectorised seated row|-|C012|SEL|back|S Hyp|10-15|-|N|D|-|
V161|Smith row|-|C011|SM|back, stable|S Hyp|8-12|SP-SHEAR|N|D|-|
V162|Wide-grip cable row|-|C013|CB|upper back/rear delt|A Hyp|10-15|-|N|D|-|
V163|Ring/TRX row|-|C072|BW|home back|A Both|8-15|-|N|D|-|
V164|Lean-in dumbbell lateral raise|-|C035|DB|side delt stretch|A Hyp|10-20|SH-ABD-ER|Y|D|Nippard A-tier|
V165|Lean-away cable lateral raise|-|C036|CB|side delt stretch|A Hyp|10-20|SH-ABD-ER|N|D|Long-length tension|
V166|Behind-the-back cable lateral|-|C036|CB|side delt stretch|A Hyp|12-20|SH-EXT;SH-ABD-ER|N|D|Nippard "twice as fast" cuff version|
V167|Lying incline lateral raise|side-lying incline|C035|DB|bottom-range tension|A Hyp|12-20|SH-ABD-ER|Y|D|Bottom-loaded resistance curve|
V168|Super-ROM lateral raise|-|C035|DB|full range overhead|A Hyp|12-20|SH-OH;SH-ABD-ER|Y|D|Mike Israetel pick|
V169|Machine lateral raise|-|C035|SEL|side delts|A Hyp|12-20|-|N|D|-|
V170|High-pulley cuff lateral raise|-|C036|CB|stretch tension|A Hyp|12-20|SH-ABD-ER|N|D|Nippard 3 tips|
V171|Lateral raise lengthened partials|-|C036|CB|stretch|F Hyp|15-25 @0RIR|SH-ABD-ER|N|C|-|
V172|Seated DB lateral raise|-|C035|DB|strict|A Hyp|12-20|-|Y|D|-|
V173|Heavy partial "cheat" laterals|-|C035|DB|overload top|F Hyp|10-20|SH-ABD-ER|Y|D|-|POP-LOW
V174|Wide-grip cable upright row|-|C035|CB|side delts/traps|A Hyp|10-15|SH-IR-ELEV|N|D|Keep grip wide, stop at chest height|RISK
V175|Bent-over rear-delt DB fly|-|C038|DB|rear delts|A Hyp|12-20|SP-SHEAR|Y|D|-|
V176|Cable rear-delt fly|cross-cable reverse fly|C038|CB|rear delts|A Hyp|12-20|-|N|D|-|
V177|Chest-supported rear-delt row|-|C038|DB|rear delts|A Hyp|12-15|-|Y|D|-|
V178|Band pull-apart|-|C038|BAND|rear delts|A Both|15-30|-|Y|D|-|
V179|EZ-bar front raise (underhand)|-|C008|BB|front delts|A Hyp|10-15|SH-OH|Y|D|Israetel front-delt pick|
V180|Cable front raise|-|C008|CB|front delts|A Hyp|12-15|SH-OH|N|D|-|
V181|Prone Y-raise|lower-trap raise|C038|DB|lower traps|A Both|10-15|SH-OH|Y|C|Rehab overlap|
V182|EZ-bar curl|-|C040|BB|wrist-friendly|A Hyp|8-12|-|Y|D|-|
V183|Supinating DB curl|-|C040|DB|biceps|A Hyp|8-15|-|Y|D|-|
V184|Straight-bar cable curl|-|C040|CB|biceps|A Hyp|10-15|WR-EXT|N|D|-|
V185|Spider curl|-|C043|DB|short position|A Hyp|10-15|-|Y|D|-|
V186|Machine preacher curl|-|C043|SEL|biceps|A Hyp|10-15|EL-STRESS|N|D|-|
V187|Preacher lengthened partials|-|C043|DB|stretch|F Hyp|10-15 @0RIR|EL-STRESS|N|B|Pedrosa preacher partials|
V188|Drag curl|-|C040|BB|biceps, short head|A Hyp|8-12|SH-EXT|Y|D|-|
V189|Concentration curl|-|C040|DB|peak contraction|A Hyp|10-15|-|Y|D|-|
V190|Reverse EZ curl|-|C044|BB|brachioradialis|A Hyp|10-15|WR-EXT|Y|D|-|
V191|Cross-body hammer curl|-|C044|DB|brachialis|A Hyp|10-15|-|Y|D|-|
V192|Rope hammer curl|-|C044|CB|brachialis|A Hyp|10-15|-|N|D|-|
V193|Selectorised biceps machine|-|C040|SEL|biceps|A Hyp|10-15|-|N|D|-|
V194|Zottman curl|-|C044|DB|biceps+forearms|A Hyp|8-12|WR-EXT|Y|D|-|
V195|Single-arm DB overhead extension|-|C045|DB|long head|A Hyp|10-15|SH-OH;EL-FLEX|Y|B|Maeo principle|
V196|Seated EZ overhead extension|French press|C045|BB|long head|A Hyp|8-12|SH-OH;EL-FLEX;EL-STRESS|Y|B|Maeo principle|
V197|Cross-body cable extension|Katana extension|C045|CB|long head|A Hyp|12-15|EL-FLEX|N|D|-|
V198|Rope pushdown|-|C046|CB|lateral head|A Hyp|12-20|-|N|D|-|
V199|Single-arm reverse-grip pushdown|-|C046|CB|medial head|A Hyp|12-20|-|N|D|-|
V200|DB skull crusher|-|C047|DB|triceps|A Hyp|10-12|EL-FLEX|Y|D|-|
V201|Incline skull crusher|-|C047|BB|long head stretch|A Hyp|8-12|EL-FLEX;SH-OH|Y|C|Long-length logic|RISK
V202|Tate press|-|C047|DB|triceps lockout|A Hyp|10-15|EL-STRESS|Y|D|-|
V203|Selectorised dip/triceps press|-|C046|SEL|triceps|A Hyp|10-15|-|N|D|-|
V204|Diamond push-up|close-grip push-up|C032|BW|triceps at home|A Both|8-20|WR-EXT;EL-STRESS|Y|D|-|
V205|Bodyweight triceps extension (bar)|-|C047|BW|triceps at home|A Hyp|8-15|EL-FLEX|Y|D|-|
V206|Cable kickback|-|C046|CB|triceps, short|A Hyp|12-20|SH-EXT|N|D|-|
V207|Overhead extension lengthened partials|-|C045|CB|long head|F Hyp|12-15 @0RIR|SH-OH;EL-FLEX|N|B|PeerJ 2025: ≈ full ROM|
V208|Wrist roller|-|C076|BW|forearms|A Hyp|2-4 trips|WR-EXT|Y|D|-|
V209|Behind-the-back barbell wrist curl|-|C076|BB|flexors|A Hyp|12-20|-|Y|D|-|
V210|Plate pinch hold|-|C055|BW|grip|A Both|20-40 s|GRIP|Y|D|-|
V211|Fat-grip holds|-|C055|BW|grip|A Both|20-40 s|GRIP|N|D|-|
V212|Dumbbell shrug|-|C050|DB|traps|A Hyp|10-20|GRIP|Y|D|-|
V213|Trap-bar shrug|-|C050|SPB|traps, neutral|A Hyp|10-15|GRIP|N|D|-|
V214|Kelso shrug|chest-supported shrug|C050|DB|mid traps|A Hyp|10-15|-|Y|D|-|
V215|Smith shrug|-|C050|SM|traps|A Hyp|10-15|-|N|D|-|
V216|Neck harness extension|-|C078|BW|neck extensors|A Both|15-25|NECK|N|D|-|
V217|4-way neck machine|-|C078|SEL|neck|A Both|15-25|NECK|N|D|-|
V218|Front plank|-|C053|BW|anti-extension|A Both|20-60 s|-|Y|C|Rehab overlap|
V219|Side plank|-|C054|BW|lateral core|A Both|15-45 s|-|Y|C|McGill Big 3|
V220|Dead bug|-|C053|BW|anti-extension|A Both|8-12/side|-|Y|D|-|
V221|Bird dog|-|C054|BW|back endurance|A Both|8-10/side|-|Y|C|McGill Big 3|
V222|Hanging knee raise|-|C051|BW|easier|A Both|10-15|GRIP|Y|D|-|
V223|Captain's chair leg raise|-|C051|BW|abs, supported|A Hyp|10-15|-|N|D|-|
V224|Weighted decline sit-up|-|C052|BW|abs|A Hyp|8-15|SP-FLEX|N|D|-|
V225|Selectorised crunch machine|-|C052|SEL|abs|A Hyp|10-15|SP-FLEX|N|D|-|
V226|Barbell rollout|-|C053|BB|anti-extension at home|A Both|6-12|SP-EXT|Y|D|-|
V227|Suitcase carry|-|C055|DB|lateral core|A Both|20-40 m/side|GRIP|Y|D|-|
V228|Landmine rotation|-|C054|BB|rotational power|A Both|8-12/side|SP-ROT|Y|D|-|
V229|Cable woodchop|-|C054|CB|obliques|A Both|10-15/side|SP-ROT|N|D|-|
V230|Dragon flag|-|C053|BW|advanced anti-extension|A Both|3-8|SP-EXT;NECK|Y|D|-|RISK
V231|L-sit|-|C051|BW|abs/hip flexors|A Both|10-30 s|WR-EXT|Y|D|-|
V232|Swiss-bar bench|football bar|C007|SPB|shoulder-friendly|S Both|5-10|-|N|D|-|
V233|Reverse-band bench|-|C007|BB|overload top|S Str|1-3|-|N|D|-|
V234|Sled push|prowler|C016|PL|knee-friendly legs/conditioning|A Both|20-40 m|-|N|D|No eccentric, low soreness|
V235|Smith JM press|-|C048|SM|triceps, safer groove|A Both|8-12|EL-STRESS|N|D|-|
V236|Pin squat from low pins|-|V003|BB|deepest point|S Str|2-4|KN-DEEP|Y|D|-|
V237|Deficit Bulgarian split squat|-|C014|DB|glutes/quads, stretch|S Hyp|6-10/leg|KN-DEEP;HIP-FLEX|Y|D|-|
V238|Snatch-grip RDL|-|C006|BB|upper back+hamstrings|S Hyp|6-10|HAM-LONG;GRIP|Y|D|-|
V239|Dumbbell Bulgarian with front-foot lean|-|C014|DB|glute bias|S Hyp|8-12|HIP-FLEX|Y|D|Coach cue (lean = glutes)|
V240|Pause rack pull above knee|-|C059|BB|upper back|S Str|2-5|SP-AX;GRIP|Y|D|-|POP-LOW
V241|Band-resisted hip thrust|-|C024|BAND|home glutes|A Hyp|15-25|-|Y|D|-|
V242|Behind-the-back cuff Y-raise|-|C037|CB|side delts, one arm|A Hyp|12-20|SH-EXT;SH-ABD-ER|N|D|Nippard "fast alternative"|
V243|Smith-machine Larsen press|-|C060|SM|chest, no leg drive|S Hyp|6-10|SH-HABD|N|D|-|
```

## 2. Rehab and prehab table

Stage codes: ISO = isometric; EI = early isotonic; HSR = heavy slow resistance; PLY = plyometric or energy storage; RTL = return to lifting.

Default pain rule codes:
- **PR-T (tendons):** pain ≤5/10 during and right after the exercise, back to your usual level by the next morning, and not creeping up week to week (B, Silbernagel 2007).
- **PR-G (everything else):** pain ≤3/10 during, and no worse the next morning (D).
- **Flare rule:** If the next morning is worse than usual, drop that session's volume or load by about a third to a half, or go back one stage, for 2–3 sessions. Then rebuild.

```
id|name|aliases|region|tissue_condition|stage|start_dose|progression|pain_rule|advance_when|setup|cues|mistakes|equipment_home_band|easier|harder|grade|sources|prehab_dose
R01|Isometric shoulder external rotation|wall ER press|Shoulder|rotator-cuff-related pain|ISO|5×30-45 s at a comfortable effort (about 30-50%), 1 min rest, daily|Increase effort 10% a week, then add positions|PR-G|Pain ≤3/10 on resisted rotation tests; ER isometric pain-free|Stand side-on to a wall, elbow bent 90°, towel under arm|Press the back of your wrist into the wall;keep elbow tucked;breathe normally|shrugging;going to 100% effort|wall;towel|lower effort|band ER|B (exercise for RC pain);C (isometric specific)|JOSPT 2025 RC CPG;Littlewood 2019 consensus|Not needed|
R02|Side-lying dumbbell external rotation|-|Shoulder|rotator cuff tendinopathy|EI|3×10-15, 2 s up/3 s down, alternate days|Reps to 15, then +0.5-1 kg|PR-G|3×15 at a set load, pain ≤3/10, 2 weeks|Lie on non-sore side, towel under elbow, light DB|Rotate your forearm up like a gate opening;keep elbow on the towel;lower slowly|rolling backward;too heavy|light DB or water bottle|no weight|band ER at 90°|B|Littlewood: ≥12 weeks, alternate days, about 3 exercises, to fatigue with an OK symptom response|2×15, 1-2×/wk|
R03|Band external rotation at side|-|Shoulder|cuff strength, prehab|EI|3×15, 2×/day to every other day|Thicker band when 3×20 is easy|PR-G|3×20 thick band pain-free|Band at elbow height, towel under arm|Turn your hand out away from belly;elbow stays glued;slow back|elbow drifting;wrist bending|band|lighter band|cable ER at 90°|B|Naunton 2020 meta (progressive resisted > non-resisted)|2×15-20, 2×/wk|
R04|Prone Y/T raise|-|Shoulder|scapular control, lower traps|EI|3×10-12, 2 s hold top, 3×/wk|Add 0.5-1 kg|PR-G|3×12 with 2-3 kg|Lie face down on incline bench, arms hanging|Raise arms into a Y, thumbs up;squeeze shoulder blades down;no shrugging|lifting with neck;arching|bench;light DBs|no weight|weighted|C|Prehab Guys;JOSPT RC CPG (motor control)|2×12, 1-2×/wk|
R05|Scaption raise|full-can raise|Shoulder|cuff-related pain|EI|3×10-15, 3×/wk|Reps, then load|PR-G|Raise to shoulder height pain-free with load|Stand, thumbs up, arms 30° forward of the side|Raise to shoulder height in a V;thumbs up;slow down|shrugging;going above a painful height|DBs|partial range|full overhead|C|Littlewood consensus|2×12, 1×/wk|
R06|Serratus wall slide / push-up plus|-|Shoulder|scapular upward rotation|EI|3×10-12, 3×/wk|Wall → incline → floor push-up plus|PR-G|15 floor push-up plus pain-free|Forearms on wall with a band, or push-up position|Reach long like pushing the wall away;let blades wrap around your ribs;slow|arching low back;shrugging|wall;band|wall|floor push-up plus|C|Prehab Guys|2×12, 1-2×/wk|
R07|Cable/band ER at 90° abduction|90/90 ER|Shoulder|overhead/bench return; ER strength at end range|HSR|3×8-12, 3 s down, 2-3×/wk|+1 plate/thicker band when 3×12 is clean|PR-G|ER strength ≥90% of the other side|Elbow at shoulder height, bent 90°|Rotate your hand back until forearm points up;elbow stays level;slow down|dropping elbow;arching|cable or band|ER at side|faster/ plyo drops|C|RC CPG (resistance training of various loads)|2×12, 1×/wk|
R08|Band pull-apart|-|Shoulder|posterior shoulder, prehab|EI|3×15-20, most days|Thicker band, more reps|PR-G|Pain-free 3×20|Arms straight at shoulder height|Pull the band to your chest;squeeze shoulder blades;slow back|shrugging;bending elbows|band|lighter|face pull|D|coach consensus|2×20 in warm-up|
R09|Landmine press|-|Shoulder|return to pressing|RTL|3×8-10 @3-4RIR, 2×/wk|+2.5-5 kg/wk if PR-G holds 2 sessions|PR-G|Landmine 3×10 @ about 40% bodyweight equivalent pain-free → incline DB|Bar in landmine, half-kneeling or standing|Press up and forward;ribs down;reach at the top|leaning back;shrugging|barbell;corner|lighter|incline DB press → bench|D|coach consensus (E3 Rehab style)|-|
R10|Bench return ladder|floor press → board → full bench|Shoulder|return to bench after shoulder or pec pain|RTL|Floor press 3×6-8 @4RIR, 2×/wk|Floor → 2-board/high pin → paused full ROM; one step every 1-2 weeks when PR-G holds|PR-G|Full-ROM paused bench at about 70% e1RM with no next-day flare|Rack, bench, pins|Lower slowly;touch softly;stop at a pain-free depth|jumping straight to old weights|rack;bench|floor press|competition bench|D|EliteFTS;Barbell Medicine (graded exposure)|-|
R11|Wrist-extensor isometric|isometric grip/extension hold|Elbow|lateral elbow tendinopathy|ISO|5×30-45 s at ≤ moderate effort, daily|Effort up, then switch to R12-R13|PR-T but keep effort below the level that raises pain (isometrics above pain threshold increased pain)|Daily use pain ≤3/10; morning not worse|Forearm on table, palm down, other hand resisting|Lift the back of your hand into resistance;don't let it move;breathe|max effort;elbow lifting|table;band|lower effort|R12|C|Coombes/ isometric-LET review: not superior to isotonic|-|
R12|Tyler twist|FlexBar eccentric wrist extension|Elbow|lateral elbow tendinopathy|EI|3×15 daily (Tyler protocol), slow 4 s lowering|Next FlexBar colour after 3 weeks at 3×15|PR-T|3×15 on the heavier bar; grip pain ≤2/10|Hold the FlexBar upright in the sore hand, twist it with the good hand|Twist the bar with your good hand;straighten arms in front;let the sore wrist slowly untwist it|rushing the untwist;bent elbows|TheraBand FlexBar|lighter bar|R13 heavier|B|Tyler 2010 RCT;small trials 2022-24|1×15, 2×/wk|
R13|Slow dumbbell wrist extension|HSR wrist extension|Elbow|lateral elbow tendinopathy|HSR|3×15 → 3×8, 3 s up/3 s down, 3×/wk|+0.5-1 kg each 1-2 weeks|PR-T|Pain-free gripping and lifting at work|Forearm on thigh, palm down|Lift the back of your hand slowly;lower over 3 s;keep forearm still|using the elbow;flinging|DB|band|heavier/ elbow straight|B|Stasinopoulos 2017 (isometric+ECC-CON);Kongsgaard HSR principle|2×12, 1×/wk|
R14|Reverse Tyler twist|-|Elbow|medial elbow tendinopathy|EI|3×15 daily|Next bar colour after 3 weeks|PR-T|3×15 heavy bar|Mirror of R12 for wrist flexors|Twist with good hand;straighten arms;let the sore wrist slowly untwist|rushing|FlexBar|lighter|wrist curl HSR|C|Tyler 2014 case series|1×15, 2×/wk|
R15|Hammer pronation/supination|-|Elbow/wrist|forearm rotators, elbow and wrist rehab|EI|3×12-15/direction, 3×/wk|Slide grip further up the handle|PR-G|3×15 with hand at the end|Forearm on table, hammer or DB with weight at one end|Slowly turn palm up, then palm down;keep elbow still;control|moving the elbow;rushing|hammer/ DB|short lever|long lever|D|Prehab Guys|2×15, 1×/wk|
R16|Slow elbow flexion / extension|tempo curl, tempo pushdown|Elbow|distal biceps or triceps tendinopathy|ISO→HSR|Iso 5×30 s → 3×8-12, 3 s each way, 3×/wk|+load each 1-2 weeks|PR-T|Old curl or pushdown weights pain-free|Standing, light DB or cable|Move slowly both ways;stop short of painful depth;keep shoulder still|full stretch early;fast reps|DB;band|isometric|full range heavier|D|extrapolated from tendinopathy HSR|-|
R17|Wrist flexion and extension curls|-|Wrist/hand|general wrist pain, lifters' wrist|EI|3×15 light, 3×/wk|Reps 15-20, then +0.5-1 kg|PR-G|Pain-free bar holding in front squat or bench|Forearms on thighs|Roll wrist down slowly;curl up only at the wrist;keep forearm still|heavy too soon;moving forearm|DB;band|band|heavier|C|Indirect; no RCT in lifters|2×15, 1×/wk|
R18|Grip and rice-bucket work|-|Wrist/hand|hand and forearm endurance|EI|2-3×30-60 s, 3×/wk|Time, then deeper bucket|PR-G|Pain-free 60 s|Bucket of rice|Open and close fingers in the rice;twist both ways;keep moving|forcing through pain|bucket;rice|putty|plate pinch|D|coach consensus|1-2×60 s|
R19|Graded wrist weight-bearing|wall → table → floor push-up position|Wrist/hand|ulnar/TFCC-type pain (wrist pain on push-ups)|EI→RTL|Wall lean 3×30 s, daily|Wall → bench → floor knees → floor; one step per week if pain-free|PR-G|Full push-up position 30 s pain-free → push-up handles → flat floor|Hands under shoulders|Spread fingers;press through knuckles;shift weight slowly|loading straight to the floor|wall;bench|wall|floor push-up|C/D|TFCC orthosis+strength abstract (68% responders);case reports|-|
R20|Chin nod (craniocervical flexion)|chin tuck lying|Neck|neck pain, headache|ISO|10×10 s holds, daily|Hold time to 10 s ×10, then lift head 1 cm|PR-G|10×10 s without the front neck muscles taking over|Lie on back, small towel under head|Gently nod like saying "yes";keep neck long, not pushed;breathe|jutting chin;big neck muscles straining|towel|smaller hold|head lift|B|JOSPT 2017 neck CPG (craniocervical, low-load endurance)|10×10 s, 2×/wk|
R21|Rows and scapular endurance|band/cable row, face pull|Neck/upper back|subacute or chronic neck pain|EI→HSR|3×12-15, 3×/wk|Reps, then load 5-10%|PR-G|Desk tolerance improved; neck ≤2/10|Band at chest height|Pull elbows back;squeeze shoulder blades;neck relaxed|shrugging;neck jutting|band|lighter|heavier row|B|JOSPT 2017 neck CPG (neck and shoulder-girdle endurance, Grade B)|2×15, 1-2×/wk|
R22|4-way neck isometric|hand-resisted neck|Neck|neck strength, contact sport|ISO|3×10 s each direction at 30-50%, 3×/wk|Effort, then progress to C078|PR-G|Pain-free 50% holds|Seated tall, hand on head|Push head into hand without moving;medium effort;breathe|max effort;jerking|hand|lower effort|band/ harness|C|CPG mixed exercise|1×10 s each, 2×/wk|
R23|Thoracic extension over roller|-|Neck/upper back|stiff upper back|EI (mobility)|1-2×8-10 reps, daily|Range|PR-G|-|Foam roller across upper back|Hands support head;arch gently over the roller;breathe out|arching the low back|foam roller;towel roll|towel|-|D|consensus|1×10 warm-up|
R24|McGill Big 3|curl-up, side plank, bird dog|Lower back|low back pain, trunk endurance|EI|Descending sets e.g. 6-4-2 × 10 s holds each, daily|Add reps per set, not hold time|PR-G|Holds pain-free; daily life easier|Floor|Brace lightly like expecting a poke;hold still;breathe|holding breath;long holds|floor|knees bent side plank|longer sets|C (specific);A (exercise for CLBP in general)|McGill;Hayden 2021 Cochrane (MD −15.2/100)|1 round, 2-3×/wk|
R25|Walking programme|-|Lower back|acute or chronic LBP|EI|10-20 min daily|+10% time a week|PR-G|30+ min comfortable|-|Walk at an easy pace;arms swinging;keep going even with mild ache|stopping all activity|none|shorter|brisk/ hills|B|Hayden 2021 (most exercise types beat minimal care)|-|
R26|Graded 45° back extension|-|Lower back|LBP, return to hinging|EI→HSR|3×10-15 bodyweight, 2-3×/wk|Range → reps → hold plate (+2.5-5 kg/wk)|PR-G|3×12 with 10-20 kg pain-free|Pad below hips|Hinge at hips;come up to straight, not arched;slow|swinging;arching|back-extension bench (home: floor prone hold)|partial range|weighted|C|Hayden J Physio 2021 (functional restoration among best)|2×12, 1×/wk|
R27|Hinge return ladder|dowel hinge → KB deadlift → RDL → deadlift|Lower back|return to deadlifting after LBP|RTL|KB deadlift 3×8 @4RIR, 2×/wk|One rung every 1-2 weeks; load +5-10%/wk while PR-G holds|PR-G|Deadlift about 70-80% of old e1RM for 3×5, no next-day flare|Dowel on back, then KB between feet|Push hips back;keep chest proud;stand up by squeezing glutes|rushing to old maxes;fear-guarding stiffly|dowel;KB/DB|dowel|trap bar → barbell|D|Barbell Medicine;graded exposure principle|-|
R28|Prone press-up|McKenzie extension|Lower back|LBP that eases with bending back|EI|10 reps, several times daily|Range|PR-G; stop if leg symptoms move further down the leg|Centralising pain; can bend forward pain-free|Lie face down, hands under shoulders|Press up, letting hips stay down;breathe out at top;lower slowly|lifting hips;forcing range|floor|prone on elbows|standing extension|B|Hayden J Physiother 2021 NMA (McKenzie, Pilates, functional restoration marginally better)|-|
R29|Glute bridge → single-leg bridge|-|Hip|hip pain, glute weakness|EI|3×12-15, 3×/wk|Double → offset → single → hip thrust|PR-G|3×15 single-leg pain-free|Lie on back, knees bent|Push through heels;squeeze glutes;ribs down|arching back;hamstring cramp|floor|double|hip thrust|B|LEAP programme (bridging progressions)|2×12, 1×/wk|
R30|Isometric abduction → side-lying abduction|-|Hip|gluteal tendinopathy (outer-hip pain)|ISO→EI|Standing or lying iso abduction 5×30 s; then side-lying 3×10-15, daily → 3×/wk|LEAP: iso week 1 → loaded functional (squat, step-up, side-step) wk 2-8|PR-G; avoid crossing legs and hanging on one hip|Pain lying on side reduced; stairs ≤2/10|Lying, band above knees|Press knee out against band without moving;then lift top leg slightly back;toes forward|leg drifting forward;rolling hips|band|iso only|band side-steps, step-ups|B|LEAP (Mellor 2018 BMJ; 77.3% success at 8 wk)|2×12, 1×/wk|
R31|Copenhagen adduction|-|Hip|adductor/groin pain, prevention|EI→HSR|Short lever 2×5/side, 2-3×/wk|Short → long lever; 1→3 sets; 3→15 reps over about 8 weeks|PR-G|3×10 long lever pain-free; squeeze strength symmetric|Side plank, top knee (easy) or ankle (hard) on bench|Lift hips into a straight line;lower bottom leg and lift back;slow|hips sagging;rushing|bench|knee support|long lever|B|Harøy 2019 (41% fewer groin problems);Harøy 2017 (+8% eccentric adduction)|1-2×6-10/side, 1-2×/wk|
R32|Adductor squeeze isometric|ball squeeze|Hip|acute groin pain|ISO|5×10-30 s at ≤ moderate effort, daily|Effort → time → R31|PR-G|Pain-free squeeze at 80%|Lying, knees bent, ball between knees|Squeeze the ball;hold steady;breathe|max effort early|ball or pillow|lower effort|R31|C|Hölmich-style programmes|-|
R33|Askling Extender|-|Hip/thigh|acute hamstring strain|EI|3×12, twice daily (from day 2-5)|Range and speed as tolerated|PR-G (pain-free in original protocol)|Pain-free; full range|Lie on back, hold thigh at 90°|Slowly straighten your knee until a stretch;stop short of pain;lower|kicking fast;pushing through pain|towel|smaller range|faster reps|B|Askling 2013/2014 RCTs|-|
R34|Askling Diver|-|Hip/thigh|hamstring strain|EI|3×6 every other day|Speed|PR-G|Pain-free|Stand on injured leg, slight knee bend|Reach arms forward as the back leg lifts;keep hips square;return|rounding;losing balance|none|hold support|faster|B|Askling L-protocol|-|
R35|Askling Glider|-|Hip/thigh|hamstring strain|EI→HSR|3×4 every third day|Slide distance|PR-G|Pain-free → Askling H-test without insecurity|Front leg = injured; back foot on slider; hold support|Slide back foot away slowly;keep weight on front heel;pull back with arms and front leg|sliding too far;bouncing|slider/towel|short slide|longer slide|B|Askling (stretch-type 43 vs 74 days; sprint-type 23 vs 41 days)|-|
R36|Nordic hamstring curl (rehab/prehab)|-|Hip/thigh|hamstring strain late stage, prevention|HSR|2×4-6, 1-2×/wk|Reps to 8-10, then range|PR-G|Full-range Nordic pain-free|Kneel with ankles anchored|Fall slowly in a straight line;catch;push back|bending hips|anchor|band-assisted|weighted|B|van Dyk 2019 (up to 51%);Impellizzeri reappraisal|2×5, 1×/wk in season|
R37|Spanish squat / wall-sit isometric|-|Knee|patellar tendinopathy, kneecap pain|ISO|5×45 s, 2 min rest, daily|Depth, then time, then add weight|PR-T|Single-leg decline squat pain ≤3/10|Strap behind knees anchored to a post|Sit back into the strap;shins vertical;hold|knees caving|strap or band|shallow|deeper/weighted|C (isometric not superior for pain relief)|Rio 2015;Holden 2020;Clifford 2020|-|
R38|HSR leg press / hack / squat|Kongsgaard HSR|Knee|patellar tendinopathy|HSR|4 sets, 15RM wk1 → 12RM wk2-3 → 10RM wk4-5 → 8RM wk6-8 → 6RM wk9-12; 3 s up/3 s down; 2-3 min rest; 3×/wk|Load up as RM target drops (about weekly to biweekly)|PR-T|VISA-P improving; single-leg decline squat ≤3/10|Leg press, hack or Smith|Lower for 3 s;push up for 3 s;no bounce|rushing;deep painful range early|leg press (home: Smith or split squat)|bodyweight split squat|R40|B|Kongsgaard 2009;network meta-analysis|2×8, 1×/wk|
R39|Leg extension 90°→45° range|-|Knee|kneecap (patellofemoral) pain|EI→HSR|3×10-15, 3×/wk|Range toward full, then load 5-10%|PR-G|Stairs and squats ≤2/10|Machine with range limiter, or band|Kick up slowly;stay in a comfortable range;lower slowly|full range too early;fast|band (home)|band|full range|A (hip+knee programme)|JOSPT 2019 PFP CPG|2×12, 1×/wk|
R40|Step-down / Peterson step-up|-|Knee|kneecap pain, return to squatting|EI→RTL|3×10/leg, 3×/wk|Box height +5 cm|PR-G|20 cm step-down with good control, pain ≤2/10|Stand on step|Lower your heel slowly;knee tracks over 2nd toe;stand back up|knee caving;dropping|step|low step|higher step/ weighted|A (combined hip+knee)|JOSPT 2019 PFP CPG|2×10, 1×/wk|
R41|Hip abduction + external rotation strengthening|clamshell, side-lying, machine|Knee/hip|kneecap pain (hip-targeted)|EI|3×15, 3×/wk|Band → machine load|PR-G|Symmetrical strength|Side-lying|Lift top knee or leg;don't roll back;slow|rolling hips|band|clamshell|machine abduction|A|JOSPT 2019 PFP CPG (posterolateral hip, early)|2×15, 1×/wk|
R42|Decline squat (eccentric)|25° decline board squat|Knee|patellar tendinopathy (alternative)|EI|3×15 twice daily (classic), or 3×15 1×/day|Add backpack load|PR-T|-|Decline board 25°|Lower on the sore leg slowly;stand up on both legs;knees over toes|dropping;too deep|decline board|bodyweight|loaded|B (HSR as good or better, fewer sessions)|Kongsgaard 2009;JOSPT 2015 review|-|
R43|Pogo → hop progression|-|Knee/ankle|tendon energy storage, return to jumping/running|PLY|2×10-20 low pogos, 2-3×/wk, 48 h apart|Double → single leg → forward hops → bounds|PR-T next-morning rule critical|Hop 25 pain-free (Achilles toolkit); symmetry ≥90%|Flat surface|Bounce on balls of feet;stiff ankles;quiet landings|heavy landings;too many|none|smaller hops|single-leg|C|Silbernagel phased programme;Achilles toolkit (25 pain-free hops)|1-2×10 in warm-up|
R44|Isometric calf raise|-|Ankle/foot|Achilles tendinopathy (painful phase)|ISO|5×30-45 s, daily|Effort/load|PR-T|10 single-leg heel raises tolerable|Stand on step, heels level|Rise halfway and hold;weight on the big toe side;breathe|max effort;bouncing|step|both legs|single-leg, weighted|C (no immediate relief vs isotonic)|van der Vlist 2020|-|
R45|Seated + standing calf raise HSR|-|Ankle/foot|Achilles tendinopathy|HSR|3-4×15 → 6RM over 12 weeks, 3 s up/3 s down, 3×/wk|Kongsgaard-style RM drop; +load about weekly|PR-T|25 single-leg heel raises; hop 25 pain-free|Smith/machine or backpack on step|Lower slowly;rise fully;don't bounce|bouncing;rushing|step;backpack|bilateral|single-leg loaded|B|Beyer 2015 (HSR = eccentric);Silbernagel 2007|2×12, 1×/wk|
R46|Rathleff heel raise with towel|high-load plantar heel raise|Ankle/foot|plantar heel pain|HSR|12RM×3 (wk1-2) → 10RM×4 → 8RM×5; 3 s up, 2 s hold, 3 s down; every 2nd day|Add backpack load as reps get easy|PR-T|Morning first steps ≤2/10|Single leg on step, rolled towel under toes|Rise until toes bend fully back;hold 2 s;lower over 3 s|skipping the towel;rushing|step;towel;backpack|both legs|heavier backpack|B|Rathleff 2015 (n=48; faster at 3 mo, same at 12 mo)|2×10, 1×/wk|
R47|Single-leg balance progression|-|Ankle/foot|lateral ankle sprain, prevent re-sprain|EI→PLY|3×30-60 s/leg, 3-5×/wk|Eyes closed → pillow → reach/catch → hops|PR-G|60 s eyes closed; hop and stick|Stand on one leg near support|Stand tall on one foot;let the ankle make small corrections;keep hips level|locking knee;staring down|pillow|eyes open|hop-and-stick|A|JOSPT 2021 ankle CPG;Doherty 2017 (OR 0.59);Wagemans 2022 (22%→16%)|2×30 s/leg in warm-up, 2-3×/wk for 12 months after a sprain|
R48|Band eversion + tib raise|-|Ankle/foot|ankle sprain, shin|EI|3×15, 3×/wk|Thicker band|PR-G|Pain-free strength|Seated, band around forefoot|Turn the sole outward against band;slow back;keep knee still|moving knee|band|lighter|standing/ tib bar|C|JOSPT 2021 ankle CPG (strength component)|2×15, 1×/wk|
R49|Achilles/calf return-to-run ladder|-|Ankle/foot|tendinopathy return to running|RTL|Walk-jog intervals, every other day|+10-20% volume/week|PR-T next-morning|Pain-free hop test; 30 min easy run|-|Start easy and flat;keep pain within the rule;rest a day between runs|big jumps in volume|none|walk-jog|hills/speed|B|Silbernagel 2007 (continued activity with pain monitoring = rest)|-|
```

## 3. Progression rules (rehab vs prehab)

1. **Classify each case first.** Use a "rehab" track when the user reports current pain linked to training (≥2/10 during the movement, or pain the next morning). Otherwise use "prehab". Rehab programmes use the rehab table's stages. Prehab adds 1–3 prehab-dose exercises to normal training. (D)
2. **Use two pain-gate thresholds.**
   - Tendon conditions (patellar, Achilles, elbow, gluteal, plantar): allow ≤5/10 during and right after. The next morning must be back at the user's baseline (B, Silbernagel 2007 RCT; reused in Kongsgaard 2009).
   - All other conditions: allow ≤3/10 during, and the next morning no worse (D).
3. **Make the next-morning check the main gate.** Ask "Is it worse than your usual this morning?" before every session.
   - If worse: cut that exercise's sets or load by about a third to a half for 2–3 sessions, then rebuild.
   - If worse on two sessions in a row: go back one stage.
   (B for tendons; D elsewhere)
4. **Keep the "just feel it" stage short.** Isometrics or early-range work usually lasts 1–2 weeks (C):
   - the Silbernagel Achilles programme's phase 1 is weeks 1–2;
   - LEAP used one familiarisation week;
   - Askling started lengthening work 2–5 days after injury.
   Don't hold users in isometrics for pain relief. Trials show isometrics are no better than slow full-range lifting for that (B).
5. **"Slow" means two things.**
   - Rep speed of about 3 s down and 3 s up in heavy slow resistance (B, Kongsgaard 2009).
   - Load increases no more often than every 1–2 weeks. Kongsgaard went from 15RM to 6RM over 12 weeks: 15 → 12 → 10 → 8 → 6RM at weeks 1, 2, 4, 6 and 9. (B)
6. **Progress in this order:** pain-free range first, then reps, then tempo/control, then load, then speed or impact. Raise only one variable per step. (D, consistent with the CPG progressions)
7. **Only progress after two passing sessions in a row.** Both sessions must have pain within the gate and a next morning at baseline. Load steps:
   - upper body: +2.5–5%, or the smallest available jump;
   - lower body: +5–10%.
   (D)
8. **Typical rehab length: plan for at least 12 weeks.**
   - Rotator-cuff pain: about 12 weeks (C, Littlewood consensus).
   - Tendon heavy slow resistance: 12 weeks (B).
   - Gluteal tendinopathy: 8 weeks (B, LEAP).
   - Show users a timeline so they don't quit at week 3. (C)
9. **Frequency:**
   - isometrics: daily;
   - early isotonic work: daily to alternate days;
   - heavy slow resistance: 2–3×/week with at least 48 h between sessions;
   - plyometrics: 2–3×/week, 48 h apart.
   (B for heavy slow resistance and plyometric spacing; C for the rest)
10. **Stage exit criteria should be objective where possible:**
    - 25 single-leg heel raises, or 25 pain-free hops (Achilles);
    - single-leg decline squat ≤3/10 (patellar);
    - symmetrical external-rotation strength (shoulder);
    - Askling H-test with no feeling of insecurity (hamstring).
    (C)
11. **Return to lifting:** use a ladder of partial or reduced-load variants. Examples: floor press → board → paused bench; KB deadlift → RDL → deadlift. Restart at about 60–70% of the old e1RM and add one rung every 1–2 weeks. (D)
12. **Prehab dose:** 1–2 sets, 1–2×/week, at 2–3 RIR, fitted around normal training. (C)
    - Nordics: 2×5, 1×/week in season (C, compliance-dependent).
    - Copenhagens: 1–2×6–10 per side (B).
    - After an ankle sprain: balance work 2–3×/week for 12 months (A).
13. **Red flags: stop and refer** instead of progressing for:
    - night pain that won't settle;
    - numbness or weakness that is spreading;
    - pain after trauma with a pop or sudden loss of function;
    - bladder or bowel changes;
    - fever.
    (consensus; non-negotiable)

## 4. Quick reference

### Top 30 "hidden gem" exercises

| # | Exercise | Body part | Grade | Reason given |
|---|---|---|---|---|
| 1 | Overhead cable triceps extension | triceps | B | about 1.4–1.5× the growth of pushdowns (Maeo 2023) |
| 2 | Seated leg curl (lean forward) | hamstrings | B | +14% vs +9% for lying curls (Maeo 2021) |
| 3 | Reclined leg extension | rectus femoris | B | 40° hip angle beat 90° |
| 4 | Calf raise lengthened partials | calves | B | +15.2% vs +6.7% (Kassiano 2023) |
| 5 | Leg extension lengthened partials | distal quads | B | Pedrosa 2022 |
| 6 | Cable lateral raise (high pulley, cuff) | side delts | D | Nippard S-tier |
| 7 | Cable Y-raise | side delts | D | Nippard S-tier |
| 8 | Lean-in DB lateral raise | side delts | D | Nippard A-tier |
| 9 | Super-ROM lateral raise | side delts | D | Israetel |
| 10 | Behind-the-back cuff lateral raise | side delts | D | Nippard |
| 11 | Bayesian cable curl | biceps | D | Menno Henselmans |
| 12 | Incline DB curl | biceps long head | C | long-length logic |
| 13 | Pendulum squat | quads | D | Nippard, Teo |
| 14 | Hack squat | quads | D | consensus |
| 15 | Sissy squat / reverse Nordic | rectus femoris | D | Stronger By Science commentary |
| 16 | Deficit Bulgarian split squat | glutes/quads | D | Nippard |
| 17 | Meadows row | upper back | D | John Meadows |
| 18 | Single-arm cable pulldown | lats | D | Nippard |
| 19 | Machine/Nautilus pullover | lats | D | Mentzer tradition |
| 20 | Kelso shrug | mid traps | D | coach consensus |
| 21 | Reverse pec deck | rear delts | D | RP |
| 22 | Low-incline DB press | upper chest | D | Nippard |
| 23 | Cable fly / pec deck lengthened partials | chest | B (principle) | Wolf 2023 |
| 24 | Nordic hamstring curl | hamstrings | B | van Dyk 2019 |
| 25 | Copenhagen plank | adductors | B | Harøy 2019 |
| 26 | Adductor machine | adductors | D | RP |
| 27 | Lean-forward hip abduction | upper glutes | D | Nippard |
| 28 | Belt squat | legs with zero spinal load | D | EliteFTS |
| 29 | Larsen press | bench | D | Calgary Barbell |
| 30 | Safety squat bar squat | squat | D | EliteFTS |

### Exercises to flag or advise against

- **Jefferson curl (loaded):** Stuart McGill says the risks outweigh the benefits. No clinical studies show benefit. The disc-injury link comes mostly from cadaver and animal-spine studies. If included, keep it bodyweight or very light, slow and pain-free. Exclude it for users with disc history or pain when bending forward. (Benefit D, risk C)
- **Behind-the-neck press, wide-grip bench, bench dips, deep DB flies, upright rows with a narrow grip:** These load the shoulder at end range: abduction with external rotation, deep horizontal stretch, or internal rotation with the arm raised. Fine for some users, but hide them for anyone with a shoulder flag. (D)
- **Dips (deep) and ring dips:** They load shoulder extension under bodyweight. Gate them behind a pain-free assisted dip. (D)
- **Good mornings and seated good mornings:** Risk comes from rounding under load. Use only with strict technique and moderate loads. (D)
- **Rack pulls, block pulls, and band/chain "accommodating resistance":** Popular, but trials show little or no advantage over the full lift. Flag as POP-LOW, not dangerous. (C)
- **Reverse hyper "spinal decompression":** No supporting data. The exercise itself is fine. (D)
- **Dragon flag, overhead squat:** Their technique and mobility demands outweigh the payoff for most hypertrophy users. (D)
- **Isometrics "for instant pain relief":** Effective as a tolerable starting load, but no better than slow isotonics for analgesia. Don't market them that way. (B)
- **Skull crushers, JM press, preacher curls with fast drops:** These carry elbow-tendon stress. Flag them for elbow pain and use slow lowering. (D)

## 5. Gaps: where coach consensus is doing the work

- **Exercise-vs-exercise comparisons:** Almost none exist for delts, chest, back, glutes and arms beyond triceps and biceps. Every lateral-raise, row and press variant ranking is grade D, built on resistance-curve reasoning.
- **Stretched-position partials:** Benefits shown in untrained or short studies (Pedrosa, Kassiano) shrink to "about equal" in trained lifters (Wolf 2025; the 297-participant, 15-site trial by Gschneidner, Carlson et al. 2025). Don't let the app present partials as superior.
- **Machine vs free weight for specific muscles:** There is no strong evidence that pendulum squats beat hack squats, or that Hammer Strength presses beat dumbbells. Choose based on preference, joint comfort and progression convenience.
- **Strength specialty lifts:** Spoto, Larsen, pin, board and Anderson variations, and rack pulls, are powerlifting folk wisdom. Little or no controlled data shows they beat the competition lift for its own 1RM.
- **Rehab, wrist and hand:**
  - No RCTs exist in lifters.
  - The best available is an orthosis-plus-strengthening abstract for TFCC pain, where 68% responded.
  - Everything else is consensus.
- **Rehab, neck:** Exercise recommendations are Grade B, but the evidence for the specific exercises is weaker.
- **Rehab, isometrics:** Their analgesic effect was overstated after early small trials.
- **Rehab, return-to-lifting ladders:** These are unvalidated.
- **Pain thresholds:** The 5/10 tendon rule comes from one RCT, later widely reused. The 3/10 "general" rule is clinical consensus.
- **Prevention transfer to lifters:** Nordic and Copenhagen data come from football players. Whether they prevent injuries in lifters is untested.
- **Low back pain exercise type:** Pilates, McKenzie and functional restoration were only "marginally" better than other exercise types. Any exercise the user will keep doing is the realistic choice.

## Caveats

- **Variant rows:** They rely on inheritance. If your schema can't join to the parent, copy the parent's setup, cues and mistakes into each variant during import.
- **Grade scope:** Grades describe the evidence behind the specific claim in a row, not overall exercise safety.
- **Search coverage:** Several coach rankings came through secondary write-ups (Generation Iron, BarBend) of Nippard and Israetel videos, not the videos themselves.
- **Unverified study details:**
  - Some protocol details (for example the Harøy programme's progression across sets) were summarised from secondary sources.
  - The reclined leg-extension finding comes from a SportRxiv preprint (Larsen et al., doi 10.51224/SRXIV.407) covered by Stronger By Science. It has not been peer reviewed.
  - Verify these before you display exact study figures in the app.
- **Not a substitute for clinical assessment:** The rehab library supports self-management of common overuse pain. It does not replace an assessment after acute trauma, or when red flags are present.

Sources:
1. wiley — https://onlinelibrary.wiley.com/doi/10.1080/17461391.2022.2100279
2. houseofhypertrophy — https://houseofhypertrophy.com/overhead-vs-pushdowns/
3. strongerbyscience — https://www.strongerbyscience.com/research-spotlight-triceps/
4. researchgate — https://www.researchgate.net/publication/344445943_Greater_Hamstrings_Muscle_Hypertrophy_but_Similar_Damage_Protection_after_Training_at_Long_versus_Short_Muscle_Lengths
5. sportrxiv — https://sportrxiv.org/index.php/server/preprint/download/414/version/528/863/804
6. sciencedirect — https://www.sciencedirect.com/science/article/pii/S2666337625000332
7. ovid — https://www.ovid.com/journals/ejoss/fulltext/10.1002/ejsc.70030~resistance-training-beyond-momentary-failure-the-effects-of
8. sportrxiv — https://sportrxiv.org/index.php/server/preprint/download/455/959/903
9. gymnoteplus — https://www.gymnoteplus.com/blog/lengthened-partials
10. generationiron — https://generationiron.com/jeff-nippard-shoulder-exercises/
11. fitnessvolt — https://fitnessvolt.com/jeff-nippard-improve-lateral-raise/
12. barbend — https://barbend.com/news/jeff-nippard-6-exercises-to-build-3d-shoulders/
13. researchgate — https://www.researchgate.net/publication/325690211_The_Adductor_Strengthening_Programme_prevents_groin_problems_among_male_football_players_A_cluster-randomised_controlled_trial
14. researchgate — https://www.researchgate.net/publication/260718700_Acute_hamstring_injuries_in_Swedish_elite_sprinters_and_jumpers_A_prospective_randomised_controlled_clinical_trial_comparing_two_rehabilitation_protocols
15. sportsrehabexpert — https://www.sportsrehabexpert.com/heavlyslow-patellar-tendon.pdf
16. jospt — https://www.jospt.org/doi/pdf/10.2519/jospt.2019.0503
17. jospt — https://www.jospt.org/doi/10.2519/jospt.2019.0503
18. jospt — https://www.jospt.org/doi/pdf/10.2519/jospt.2021.0503
19. plos — https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0262023
20. archive — https://ia803105.us.archive.org/29/items/ngc-011265/ngc-011265.html
21. cochranelibrary — https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD009790.pub2/full
22. nih — https://pmc.ncbi.nlm.nih.gov/articles/PMC10929355/
23. running-physio — https://www.running-physio.com/gluteal-leap/
24. researchgate — https://www.researchgate.net/publication/264936255_High-load_strength_training_improves_outcome_in_patients_with_plantar_fasciitis_A_randomized_controlled_trial_with_12-month_follow-up_HL_strength_training_and_plantar_fasciitis
25. github — https://github.com/jacquescorbytuech/running-knowledge-base/blob/main/sources/silbernagel-2007-pain-monitoring.md
26. nih — https://pmc.ncbi.nlm.nih.gov/articles/PMC3522085/
27. mckenzieinstituteusa — https://www.mckenzieinstituteusa.org/forms/SYLLABUS_Tendinopathy%20and%20Sport%20KGS%20handout.pdf
28. scot — https://www.knowledge.scot.nhs.uk/media/CLT/ResourceUploads/4094632/67a05791-c745-463a-90e9-d2b945576c28.pdf
29. running-physio — https://www.running-physio.com/managing-hamstring-tears-by-richard-norris/
30. sciencedirect — https://www.sciencedirect.com/science/article/abs/pii/S1440244019308552
31. physiotutors — https://www.physiotutors.com/conditions/rotator-cuff-related-shoulder-pain/
32. clinicaltrials — https://clinicaltrials.gov/study/NCT03096067
33. nih — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11263908/
34. clinicaltrials — https://clinicaltrials.gov/study/NCT06774547
35. ubc — https://med-fom-clone-pt.sites.olt.ubc.ca/files/2021/10/ATT-Final-Version-Oct-19th-21.pdf
36. orthopt — https://www.orthopt.org/uploads/content_files/files/Ankle%20Sprain%20CPG%20Revision%202021%201.21.21%20Fig.pdf
37. boxlifemagazine — https://boxlifemagazine.com/jefferson-curl-pain-free-back-strength/
38. bodyspec — https://www.bodyspec.com/blog/post/jefferson_curls_spinal_flexion_mobility_guide
39. garagegymreviews — https://www.garagegymreviews.com/jefferson-curl
40. researchgate — https://www.researchgate.net/publication/343465236_Effectiveness_of_isometric_exercise_in_the_management_of_tendinopathy_a_systematic_review_and_meta-analysis_of_randomised_trials
41. nih — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8634001/
42. jospt — https://www.jospt.org/doi/pdf/10.2519/jospt.2016.46.1.A58
43. physiotutors — https://www.physiotutors.com/isometrics-in-tendinopathy-a-wonder-weapon-to-decrease-pain/
44. nih — https://pmc.ncbi.nlm.nih.gov/articles/PMC12259690/
45. australian — https://australian.physio/inmotion/exercise-treatments-chronic-low-back-pain
