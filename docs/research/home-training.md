# Home & Travel Training Library + Low-Dose Rules (importable)

**Bottom line:** At home, chest, shoulders, triceps, legs, glutes, hamstrings, calves and core can be trained close to gym quality with bodyweight leverage changes and dumbbells. Upper-back width (lats) and heavy specific-lift strength cannot. To hold muscle during low-training periods, the app should require about 1 hard session a week (2 for users over ~60) and keep sets near failure.

## TL;DR
- **Maintenance is cheap:** in the Bickel 2011 RCT, 1 session/week with 1 set per exercise (one-ninth of the training dose) held strength in everyone and held muscle size in 20–35-year-olds for 32 weeks. In older adults, both reduced doses kept strength "at or above levels of the untrained young", but the muscle growth was "preserved… in the young but not the old" (Bickel, Cross & Bamman, Med Sci Sports Exerc 2011). So give older users 2 sessions/week and 2–3 sets per exercise (Spiering 2021 review). Grade B.
- **Home substitutes work for size:** push-ups made hard enough matched bench press for chest and triceps growth and strength (Kikuchi 2017, Kotarsky 2018, Calatayud 2015). Hard sets at roughly ≥30–40% of max load grow muscle as well as heavy sets. At 20% of max the gains fell short: Lasevicius 2018 (30 untrained men, 12 weeks) called 20% 1RM "suboptimal for maximizing muscle hypertrophy" and found 40–80% 1RM all viable. The real home gaps are vertical pulling with no bar and heavy specific practice of squat, bench and deadlift. Grade A/B.
- **Library delivered:** 50 new bodyweight rows, 30 new dumbbell rows, 10 new slant-board rows, 10 quiet-cardio rows and 52 update rows, all deduplicated. This is **below your 120-bodyweight and 100-dumbbell targets**. Two things cap it: a single importable file has to stay small, and much of the remaining pool is already in your library. I have not padded the count with re-created rows.

## How to read the rows
- **Joint flags:** SH = loaded end-range shoulder; KF = deep knee bend under load; SF = loaded spinal flexion; WE = wrist bent back under load; EL = high elbow stress; `-` = none.
- **Noise:** S = silent, Q = quiet, L = loud. **Space:** SR = standing room, BL = body length, DF = needs a doorway or furniture.
- **Use:** M = main, S = secondary, A = accessory, F = finisher. **Effort:** RIR = reps left in the tank.
- **Standard progression rule (PROG-STD), applied to every row in this order:** (1) the leverage or range change given in `prog_lever`; (2) a 3-1-1 tempo, then a 2 s pause at the hardest point; (3) add reps until `move_up`; (4) move to the next ladder step. At the new step, start at the bottom of the rep range.
- **Sources:** E11 = Ebben 2011 push-up force plates; K18 = Kotarsky 2018; Ki17 = Kikuchi & Nakazato 2017; C15 = Calatayud 2015; RR = r/bodyweightfitness Recommended Routine; L18 = Lasevicius 2018; P04 = Purdam 2004; Y05 = Young 2005; Ko06 = Kongsgaard 2006; DA = decline-angle biomechanics (PMC5260524); COMP = Compendium of Physical Activities 2011; A11 = Arseneau 2011; ED23 = Edwards 2023 BJSM; Coach = coach consensus.
- **Load equivalence:** given only where it has been measured. `n/m` = not measured.

## 1. Bodyweight table (NEW rows only)
```
id|name|aliases|family|parent|impl|primary|secondary|region|pattern|use|reps|effort|prog_lever|move_up|ladder|equiv|setup|cues|mistakes|easier|harder|joint|noise|space|equip|sub|grade|src|why
H001|Decline push-up|feet-elevated push-up|push-up|C032|BW+furniture|chest|front delt,triceps|upper chest|horiz push|M|6-15|RIR0-2|raise feet: chair>bed>sofa back|3x15|PUSH 6/11|~70% BW feet 30cm; ~74% at 60cm (E11)|feet on bed edge; hands under shoulders|stiff like a plank; chest to floor; push floor away|hips sag; elbows flared wide|C032|H002|SH,WE|S|BL|bed/chair|stairs|B|E11,K18|harder push-ups with no gear
H002|Archer push-up|side-to-side push-up|push-up|C032|BW|chest|triceps,front delt|one side bias|horiz push|M|5-10/side|RIR1-2|straighter assisting arm|3x10/side|PUSH 8/11|n/m|hands very wide; shift over one hand|lower over working hand; other arm straight; push back up|twisting hips; half reps|V204|H003|SH,WE|S|BL|none|-|D|RR,Coach|bridge to one-arm
H003|Incline one-arm push-up|elevated one-arm|push-up|C032|BW+furniture|chest,triceps|obliques,front delt|one side|horiz push|S|5-12/side|RIR1-2|lower the surface: counter>bed>chair|3x8/side|PUSH 10/11|n/m|hand on counter; feet wide|squeeze glutes; elbow 45°; don't rotate|hips turning; elbow out|H002|H004|SH,WE|S|DF|counter|desk|D|Coach|one-arm push-up within reach
H004|One-arm push-up|OAP|push-up|C032|BW|chest,triceps|obliques,serratus|one side|horiz push|S|3-8/side|RIR1-2|narrow foot stance|3x8/side|PUSH 11/11|n/m|feet wide; hand under chest|tight torso; lower slowly; press straight up|chest rotating; partial reps|H003|weighted (V114)|SH,WE|S|BL|none|-|D|Coach|strength skill showpiece
H005|Pseudo-planche push-up|PPPU|push-up|C032|BW|front delt,chest|triceps,biceps,wrist flexors|front shoulder|horiz push|S|5-12|RIR1-2|hands further toward hips|3x12|PUSH 9/11|n/m|fingers turned out; hands by ribs|lean forward over hands; arms ride close; keep lean|losing the lean; bent hips|V204|deeper lean|WE,SH|S|BL|none|fists on towel to ease wrists|D|RR|front delts without overhead
H006|Towel fly push-up|slider fly|fly|V134|towel|chest|front delt|lengthened chest|horiz adduction|A|6-12|RIR1-3|from knees to toes; wider slide|3x12|-|n/m|kneel; hands on towels on hard floor|slide hands apart slowly; squeeze back in; short range first|sliding too far; elbows locked|from knees|full-body version|SH|S|BL|towels|socks on hands|D|Coach|chest stretch work, no dumbbells
H007|Hindu push-up|dive-bomber|push-up|C073|BW|front delt,triceps|chest,spine extensors|shoulders|push arc|S|6-15|RIR2|lower and slower arc|3x12|-|n/m|start in pike|swoop chest low; push up into arch; reverse|lower back pinch; rushing|C073|H008|WE,SH|S|BL|none|-|D|Coach|combined press and mobility
H008|Elevated pike push-up|box pike|vertical push|C073|BW+furniture|front/side delt|triceps,upper traps|shoulders|vertical push|M|5-12|RIR1-2|higher feet; hands on books for depth|3x10|VPUSH 2/5|n/m|feet on chair; hips stacked over hands|head forward of hands; elbows in; press up|elbows flaring wide; hips drift back|C073|H009|SH,WE|S|DF|chair|bed|D|RR,Coach|overhead press with no weights
H009|Chest-to-wall handstand hold|wall plank|vertical push|V129|BW+wall|shoulders|triceps,core|overhead|isometric|A|20-60s|hard|closer to wall|3x45s|VPUSH 3/5|100% BW (body inverted)|walk feet up wall facing it|push tall; ribs down; look at floor|banana back; shrugging down|H008|H010|SH,WE|Q|BL|wall|-|D|Coach|overhead strength and confidence
H010|Wall HSPU negative|eccentric HSPU|vertical push|V129|BW+wall|shoulders,triceps|upper traps|overhead|vertical push|S|3-6|RIR1|slower lower (3>5s)|3x5 @5s|VPUSH 4/5|n/m|kick up to wall; pillow under head|lower slowly; head forms a triangle with hands; come down safely|crashing; neck loaded|H009|V129|SH,WE|Q|DF|wall,pillow|-|D|Coach|path to full HSPU
H011|Chair dip|parallel chair dip|dip|C031|furniture|triceps,chest|front delt|lower chest|vertical push|M|5-15|RIR1-2|feet off floor; deeper|3x12|DIP 3/3|~100% BW less feet|two sturdy chairs, backs inward, braced on a wall|shoulders down; lean a little; stop at upper arm level with floor|sinking too deep; chairs tipping|V119|backpack on (V114 rules)|SH|Q|DF|2 chairs|kitchen counter corner|C|RR(dip prereq 3x8 diamond)|dips at home; flag front-shoulder risk
H012|Sphinx push-up|floor triceps extension|triceps|V205|BW|triceps|chest|elbows|elbow extension|A|6-15|RIR1-2|from knees to toes; hands further forward|3x15|-|n/m|plank on forearms, hands flat|push through palms to straighten; elbows leave floor|hips piking; flaring elbows|knee version|V205 at low table|EL,WE|S|BL|none|-|D|Coach|triceps isolation, no gear
H013|Doorframe row|door jamb row|row|C072|doorway|mid back,biceps|rear delt|upper back|horiz pull|S|10-20|RIR1-2|feet closer to the frame|3x20 one-arm|ROW 1/7|n/m (low)|toes at frame; grip edge with both hands|lean back straight; pull chest to frame; squeeze shoulder blades|bending hips; shrugging|-|H014|-|S|DF|door frame|post/railing|D|Coach|zero-gear pulling start
H014|Towel door-handle row|doorknob row|row|C072|towel+door|lats,mid back|biceps,grip|upper back|horiz pull|S|8-15|RIR1-2|walk feet in|3x15|ROW 2/7|n/m|towel around both handles; door shut; you on the side it opens away from|lean back; elbows to ribs; slow down|door not latched; hips sag|H013|H015|-|Q|DF|towel, solid door|strap|D|Coach|real load using a door
H015|Bedsheet door row|door-anchor sheet row|row|C072|sheet+door|lats,mid back|biceps,rear delt|upper back|horiz pull|M|6-15|RIR0-2|feet further under anchor|3x15|ROW 3/7|n/m|knot sheet, put over top of door, close and lock it|body straight; pull hands to ribs; lower 2s|anchor slipping; elbows flared|H014|H016|-|Q|DF|sheet, door|towel knotted|D|Coach|best no-bar row in a bedroom
H016|Single-arm sheet row|one-arm door row|row|C074|sheet+door|lats|biceps,obliques|one side back|horiz pull|M|6-12/side|RIR0-2|more lean|3x12/side|ROW 6/7|n/m|one hand on knot; feet wide|don't twist; elbow to hip; pause|rotating open; short pull|H015|H017|-|Q|DF|sheet,door|-|D|Coach|lat bias without a bar
H017|Single-arm table row|one-arm inverted row|row|C072|table|lats,mid back|biceps|one side back|horiz pull|M|5-10/side|RIR1-2|straighten legs; feet on chair|3x10/side|ROW 7/7|n/m|lie under sturdy table, one hand on edge|chest to edge; hips high; slow lower|table tips; twisting|C072|weighted vest/backpack|-|Q|DF|heavy table|counter|D|RR(archer rows),Coach|hardest home row
H018|Floor sliding pull|prone towel pull|pull|C010|towel,hard floor|lats|triceps(long),core|lats|shoulder extension|A|6-12|RIR1-3|from hands to forearms on towel; longer reach|3x12|-|n/m|lie face down, hands on towel overhead|drag body toward hands; arms stay fairly straight; feel armpits|bending elbows only; sticky floor|-|longer reach|SH|S|BL|towel, hard floor|socks|D|Coach|only floor drill that loads lats overhead
H019|Prone swimmer|reverse snow angel|upper back|R04|BW|lower traps,rear delt|rotator cuff|upper back|scapular|A|8-15|RIR2|thumbs up, arms longer|3x15|-|n/m|lie face down, forehead on towel|lift arms; sweep overhead to hips slowly|arching lower back; shrugging|R04|backpack pocket weights|SH|S|BL|none|water bottles|D|Coach|posture and shoulder health
H020|Prone W raise|prone W|upper back|R04|BW|mid/lower traps|rotator cuff|upper back|scapular|A|10-20|RIR2|longer pause|3x20|-|n/m|face down, elbows bent like W|squeeze shoulder blades; lift elbows; hold 2s|neck cranking; lower back lift|R04|H019|-|S|BL|none|-|D|Coach|adds W to existing Y/T
H021|Towel isometric row|foot-anchored iso row|isometric|C074|towel|lats,mid back|biceps|upper back|isometric pull|A|5x10s|max|change elbow angle|5x10s@3 angles|-|n/m|stand on towel middle, hinge forward|pull up hard 10s; breathe; no jerking|holding breath; rounding back|-|-|-|S|SR|towel|belt|C|Coach|max effort pull at any angle
H022|Towel isometric curl|iso curl|isometric|V183|towel|biceps|forearms|arms|isometric|A|5x10s|max|three elbow angles|-|-|n/m|stand on towel, elbows by ribs|curl up hard 10s; stay tall|leaning back; breath holding|-|H024|-|S|SR|towel|-|C|Coach|only way to load biceps hard with nothing
H023|Doorframe biceps curl|door curl|curl|V183|doorway|biceps|forearms|arms|elbow flexion|A|10-20|RIR1-2|feet closer|3x20|CURL 1/2|n/m|underhand grip on frame or sheet knot|lean back; curl body in; elbows stay put|swinging hips; elbows dropping|H022|H024|EL|Q|DF|door frame or sheet|-|D|Coach|biceps without weights
H024|Table bodyweight curl|underhand inverted curl|curl|V183|table|biceps|brachialis|arms|elbow flexion|S|6-12|RIR1-2|straighter body|3x12|CURL 2/2|n/m|under table, underhand grip|curl forehead to edge; elbows high|rowing instead of curling|H023|feet on chair|EL|Q|DF|table|counter|D|Coach|hardest no-gear biceps
H025|Sheet face pull|door-anchor face pull|rear delt|C039|sheet+door|rear delt,mid traps|rotator cuff|rear shoulder|horiz pull|A|10-20|RIR1-2|more lean|3x20|-|n/m|sheet over door at head height|pull hands to ears; thumbs back|shrugging; leaning too far|-|-|-|Q|DF|sheet,door|-|D|Coach|rear delts without cables
H026|Floor back extension|superman|back ext|C025|BW|spine erectors,glutes|hamstrings|lower back|spinal extension|A|10-20|RIR2|arms overhead|3x20|-|n/m|face down|lift chest and legs a little; pause|cranking neck; jerking|R28|V069 off bed|-|S|BL|none|-|D|Coach|back endurance anywhere
H027|Lateral step-up|side step-up|step-up|V073|furniture|quads,glutes|adductors|front thigh|knee dominant|S|8-15/side|RIR1-2|higher step|3x15|SQUAT 3/9|n/m|stand side-on to stair/step|push through top foot; tap down softly|pushing off floor foot; knee caving|V073 low|H028|KF|Q|DF|stair|sturdy box|D|Coach|knee-friendly leg volume
H028|Skater squat|airborne lunge|single-leg squat|V026|BW|quads,glutes|adductors|front thigh|single-leg squat|M|5-12/side|RIR1-2|lower knee target: cushion stack>floor|3x10/side|SQUAT 6/9|n/m|stand on one leg, back knee bent|lean forward; back knee kisses cushion; stand|crashing; front heel lifting|C014|H029|KF|Q|SR|cushion|book stack|D|Coach|pistol strength without the mobility
H029|Doorframe-assisted pistol|assisted pistol|single-leg squat|V026|doorway|quads,glutes|calves,core|front thigh|single-leg squat|M|5-10/side|RIR1-2|less hand help|3x8/side|SQUAT 7/9|n/m|hold frame, one leg forward|sit down slowly; heel down; pull only as needed|pulling too hard; knee caving|V027|V026|KF|S|DF|door frame|towel on handle|D|Coach|full-depth one-leg squat
H030|Single-leg wall sit|one-leg wall sit|isometric|V035|wall|quads|glutes|front thigh|isometric|A|20-45s/side|hard|lower seat|3x45s|KNEE 2/5|n/m|back on wall, thighs level|lift one foot; push heel down; breathe|sliding hips up; holding breath|V035|C067|KF|S|SR|wall|door|D|Coach|silent quad burner
H031|Single-leg slider curl|one-leg towel curl|leg curl|V057|towel,hard floor|hamstrings|glutes|back thigh|knee flexion|M|5-12/side|RIR0-2|hips higher; slower out|3x10/side|HINGE 6/8|n/m|lie on back, one heel on towel|hips up; drag heel in; slide out slow|hips drop; fast out|V057|C023|-|S|BL|towel,hard floor|socks|D|Coach|hamstring curl at home
H032|Hamstring walkout|bridge walkout|bridge|R29|BW|hamstrings,glutes|calves|back thigh|hip ext+knee flex|S|6-10|RIR1-2|walk further out|3x10|HINGE 4/8|n/m|bridge up from floor|walk heels out small steps; walk back|hips dropping|R29|V057|-|S|BL|none|-|D|Coach|hamstring work in lengthened knee
H033|Feet-elevated hamstring bridge|heels-on-chair bridge|bridge|R29|furniture|hamstrings,glutes|lower back|back thigh|hip ext|S|10-20|RIR1-2|straighter knees; one leg|3x20|HINGE 3/8|n/m|heels on chair, back on floor|push heels down; lift hips; pause|arching lower back|R29|V065|-|S|DF|chair|bed edge|D|Coach|silent hamstring work
H034|Frog pump|frog bridge|bridge|R29|BW|glutes|adductors|glutes|hip ext|F|20-40|RIR0-2|backpack on hips|2x40|-|n/m|soles together, knees out, heels near hips|squeeze glutes hard; ribs down|lower back doing it|R29|backpack|-|S|BL|none|-|D|Coach|glute pump finisher
H035|Curtsy lunge|crossover lunge|lunge|V079|BW|glutes,quads|adductors|side glute|lunge|S|8-15/side|RIR1-2|deficit on step|3x15|-|n/m|stand tall|step back across; drop back knee; drive up|twisting knee; tiny step|V079|backpack|KF|Q|SR|none|-|D|Coach|glute med bias
H036|Lateral lunge|side lunge|lunge|V077|BW|adductors,glutes|quads|inner thigh|frontal lunge|S|8-12/side|RIR2|wider step; lower|3x12|-|n/m|feet wide|sit hips back over one foot; other leg straight|heel lifting; knee caving|-|V077|KF|Q|SR|none|-|D|Coach|groin strength
H037|Star side plank|side-plank abduction|side plank|V219|BW|glute med|obliques|side hip|abduction|A|8-15/side|RIR1-2|from knee to feet|3x15|-|n/m|side plank|lift top leg; hold 1s; body straight|hips sag; rolling back|V087|-|SH|S|BL|none|-|D|Coach|hip and core together
H038|Side-lying adductor raise|bottom-leg raise|adductor|V089|BW|adductors|-|inner thigh|adduction|A|10-20/side|RIR1-2|ankle weight / backpack strap|3x20|-|n/m|lie on side, top foot in front|lift bottom leg; slow down|rolling back|-|C071|-|S|BL|none|-|D|Coach|groin without Copenhagen bench
H039|Hip airplane|-|balance|R47|BW|glutes,deep hip|hamstrings|hip|rotation|A|5/side|RIR3|no hand support|2x6|-|n/m|stand on one leg, hold wall|turn hips open and closed slowly|losing balance fast|R47|-|-|S|SR|wall|-|D|Coach|hip control
H040|Eccentric heel drop|Alfredson heel drop|calf|R45|stair|calf,Achilles|soleus|calf|ankle|A|15x3 straight+bent|pain ≤3/10|backpack|3x15 each|CALF 4/4|n/m|ball of foot on step|rise on two feet; lower on one 3s|bouncing|C026|backpack|-|S|DF|stair|book stack|B (tendon rehab)|Coach|Achilles rehab staple
H041|Hollow body hold|hollow rock|core|V220|BW|abs|hip flexors|front core|anti-extension|S|15-40s|hard|arms overhead; legs lower; then rock|3x40s|CORE 2/5|n/m|lie on back|press low back down; lift shoulders/legs|back arching|V220|H044|-|S|BL|none|-|D|RR,Coach|gymnast core base
H042|Lying leg raise|floor leg raise|core|C051|BW|abs,hip flexors|-|lower abs|hip flexion|A|8-15|RIR1-2|straight legs; slower lower|3x15|-|n/m|on back, hands under hips|lower legs only as far as back stays flat|back arching|H043|C051|-|S|BL|none|-|D|Coach|lower ab work
H043|Reverse crunch|-|core|C051|BW|abs|-|lower abs|spinal flexion|A|10-20|RIR1-2|on decline/ bed edge|3x20|-|n/m|on back, knees bent|curl hips off floor; lower slow|swinging|-|H042|SF|S|BL|none|-|D|Coach|easy lower-ab entry
H044|Towel body saw|slider saw|core|C053|towel|abs|serratus,lats|front core|anti-extension|S|8-15|RIR1-2|slide further back|3x12|CORE 3/5|n/m|forearm plank, feet on towel|rock body back and forward; ribs down|sagging hips|V218|H045|SH|S|BL|towel,hard floor|socks|D|Coach|ab-wheel feel with no wheel
H045|Kneeling towel rollout|towel fallout|core|C053|towel|abs,lats|serratus|front core|anti-extension|S|6-12|RIR1-2|longer reach|3x12|CORE 4/5|n/m|kneel, hands on towel|slide out until back would arch; pull back|lower back sagging|H044|C053|SH|S|BL|towel|-|D|Coach|ab-wheel substitute
H046|Slider pike|towel pike|core|C053|towel|abs,hip flexors|shoulders|front core|hip flexion|S|6-12|RIR1-2|straight legs|3x12|-|n/m|push-up position, feet on towel|pull feet in, hips to ceiling|bending arms|H044|-|WE|S|BL|towel,hard floor|socks|D|Coach|hard core, no gear
H047|Bear plank|bear hover|core|V218|BW|abs,quads|shoulders|front core|anti-extension|A|20-60s|hard|shoulder taps|3x45s|-|n/m|hands and knees, knees up 3cm|back flat; breathe; push floor|hips up|V218|taps|WE|S|BL|none|-|D|Coach|silent core and shoulder
H048|Backpack bear-hug carry|front carry|carry|C055|backpack|core,upper back|quads|trunk|carry|F|30-60s|hard|heavier pack|3x60s|-|n/m|hug pack at chest|walk or march tall; breathe|leaning back|V227|heavier|-|Q|SR|backpack|-|D|Coach|core under load
H049|Backpack overhead carry|waiter carry|carry|C055|backpack|shoulders,core|traps|overhead|carry|A|20-40s/side|hard|one arm|3x40s|-|n/m|press pack overhead with both hands|ribs down; arm by ear; march|arching back|H048|one-arm|SH|Q|SR|backpack|-|D|Coach|shoulder stability
H050|Towel wring|-|forearm|R18|towel|forearms|grip|forearm|wrist|F|5x10s each way|max|wet towel|5x10s|-|n/m|hold towel ends|twist hard one way then other|holding breath|R18|wet towel|-|S|SR|towel|-|D|Coach|grip anywhere
```

## 2. Dumbbell table (NEW rows only)
```
id|name|aliases|family|parent|impl|primary|secondary|region|pattern|use|reps|effort|prog_lever|move_up|ladder|equiv|setup|cues|mistakes|easier|harder|joint|noise|space|equip|sub|grade|src|why
H051|DB floor fly|floor fly|fly|V134|DB|chest|front delt|chest|horiz adduction|A|8-15|RIR1-2|straighter arms; 1.5 reps|3x15|-|n/m|lie on floor, knees bent|arms slightly bent; lower until elbows touch floor; hug up|dropping fast; straight elbows|light|V134 on bench|SH|S|BL|DB|water jugs|D|Coach|floor limits shoulder over-stretch
H052|Single-arm DB floor press|one-arm floor press|press|V111|DB|chest,triceps|obliques|chest|horiz push|S|6-12/side|RIR1-2|pause on floor|3x12|-|n/m|lie on floor, one DB|elbow 45°; triceps touch floor; press|rolling off; banging floor|V111|H053|-|S|BL|DB|-|D|Coach|doubles load of a light DB
H053|Bridge DB floor press|glute-bridge floor press|press|V111|DB|chest,triceps|glutes|lower chest|horiz push|S|6-12|RIR1-2|higher bridge|3x12|-|n/m|bridge hips up, DBs over chest|hips high; lower to elbows near floor|hips drop|V111|-|SH|S|BL|DB|-|D|Coach|more range than flat floor press
H054|DB squeeze press|crush press|press|V111|DB|chest,triceps|front delt|inner chest|horiz push|A|8-15|RIR1-2|pause at chest|3x15|-|n/m|on floor, DBs pressed together|squeeze DBs hard whole rep|DBs drifting apart|-|-|-|S|BL|DB pair|-|D|Coach|chest pump with light DBs
H055|Two-DB bent-over row|DB bent row|row|C011|DB|lats,mid back|biceps,spinal erectors|upper back|horiz pull|M|8-15|RIR1-2|pause at top|3x15|-|n/m|hinge to ~45°, DBs hanging|pull to hips; squeeze; slow down|standing up; jerking|H056|-|-|Q|SR|DB|backpack|D|Coach|barbell row stand-in
H056|Head-supported DB row|forehead-supported row|row|V155|DB+chair|lats,mid back|rear delt|upper back|horiz pull|M|8-15|RIR1-2|pause; 1.5 reps|3x15|-|n/m|forehead on chair back, hinge|chest stays still; elbows to hips|lifting head; cheating|-|-|-|Q|DF|DB,chair|towel on counter|D|Coach|chest-supported row without bench
H057|Renegade row|plank row|row|C074|DB|lats|core,triceps|back+core|horiz pull|S|6-10/side|RIR2|feet narrower|3x10/side|-|n/m|plank on hex DBs, feet wide|hips square; pull; set DB down softly|hips twisting|C074|-|WE|Q|BL|hex DB|-|D|Coach|row plus core
H058|DB rear-delt row|elbows-out row|row|V177|DB|rear delt,mid traps|biceps|rear shoulder|horiz pull|A|10-20|RIR1-2|pause|3x20|-|n/m|hinge, palms back|pull elbows wide to shoulder level|shrugging|-|-|-|Q|SR|DB|-|D|Coach|rear delts with DBs
H059|Standing DB overhead press|standing DB press|press|C008|DB|front/side delt,triceps|core|shoulders|vertical push|M|6-12|RIR1-2|one arm at a time|3x12|-|n/m|DBs at shoulders, stand tall|ribs down; press to ears; lower slow|leaning back|V121|V130|SH|Q|SR|DB|backpack|D|Coach|press with only DBs
H060|Floor side-lying lateral raise|lying lateral|lateral raise|V167|DB|side delt|-|side shoulder|abduction|A|10-20|RIR0-2|pause at top|3x20|-|n/m|lie on side on floor|raise arm to just past vertical; slow down|rolling|C035|V167 bench|-|S|BL|DB|water bottle|D|Coach|lengthened side delt
H061|DB front raise|-|raise|V180|DB|front delt|upper chest|front shoulder|flexion|A|10-15|RIR1-2|pause|3x15|-|n/m|stand, palms down|lift to eye level|swinging|-|-|-|Q|SR|DB|-|D|Coach|front delt isolation
H062|Wide DB upright row|DB high pull|upright row|V174|DB|side delt,traps|biceps|side shoulder|abduction|A|10-15|RIR1-2|pause|3x15|-|n/m|stand, DBs in front|lead with elbows; stop at chest height|pulling to chin; flag pinchy shoulders|C035|-|SH|Q|SR|DB|-|C|Coach|heavier side-delt load
H063|Bent-over DB Y-raise|DB Y raise|raise|C037|DB|lower traps,side delt|rear delt|upper back|scapular|A|10-20|RIR1-2|pause|3x20|-|n/m|hinge forward, thumbs up|raise arms in a Y|shrugging|R04|-|SH|Q|SR|DB|-|D|Coach|cable Y at home
H064|DB Cuban press|-|cuff|R02|DB|rotator cuff|rear/side delt|shoulder|rotation|A|8-12|RIR2|pause|3x12|-|n/m|stand, light DBs|row up, rotate up, press, reverse|heavy load|R02|-|SH|Q|SR|light DB|-|D|Coach|shoulder health
H065|Bed-edge lying DB curl|lying curl|curl|C041|DB+bed|biceps(long head)|forearms|arms|elbow flexion|A|8-15|RIR0-2|slower lower|3x15|-|n/m|lie on bed, arms hanging off|curl with arm hanging back; stretch at bottom|shoulder moving|V183|-|SH|S|DF|DB,bed|-|D|Coach|incline curl without bench
H066|DB reverse curl|overhand curl|curl|V190|DB|brachioradialis|biceps|forearm|elbow flexion|A|10-15|RIR1-2|pause|3x15|-|n/m|stand, palms down|curl; wrists straight|swinging|-|V194|-|Q|SR|DB|-|D|Coach|forearm size
H067|DB kickback|-|triceps|V206|DB|triceps|-|arms|elbow extension|A|10-20|RIR0-2|pause locked|3x20|-|n/m|hinge, elbow at hip|straighten arm; hold 1s|elbow dropping|-|-|EL|Q|SR|DB|-|D|Coach|light-DB triceps
H068|Two-hand DB overhead extension|seated French press|triceps|C045|DB+chair|triceps(long)|-|arms|elbow extension|S|8-15|RIR1-2|deeper; pause bottom|3x15|-|n/m|sit, DB held overhead by the plate|lower behind head; elbows forward|elbows flaring; back arch|-|V195|EL,SH|Q|SR|DB,chair|-|D|Coach|long-head triceps
H069|Floor rolling DB extension|rolling triceps ext|triceps|V200|DB|triceps|chest|arms|elbow ext|S|8-15|RIR1-2|pause|3x15|-|n/m|lie on floor|lower DBs by ears, elbows back; roll up and press|bouncing|V200|-|EL|S|BL|DB|-|D|Coach|heavier triceps on floor
H070|DB front-rack squat|DB front squat|squat|C003|DB|quads|glutes,upper back|front thigh|squat|M|8-15|RIR1-2|heels raised; pause|3x15|SQUAT 3/9|n/m|DB ends on shoulders|elbows up; sit down between knees|chest dropping|V007|H081|KF|Q|SR|DB|backpack|D|Coach|squat with two DBs
H071|DB suitcase squat|DB squat at sides|squat|C001|DB|quads,glutes|grip|thigh|squat|M|8-15|RIR1-2|heels on slant board|3x15|-|n/m|DBs at sides|sit straight down; push floor|knees caving|V007|H070|KF|Q|SR|DB|bags|D|Coach|heavier total load
H072|DB sumo squat|DB plié squat|squat|V007|DB|adductors,glutes|quads|inner thigh|squat|S|10-15|RIR1-2|stand on books for depth|3x15|-|n/m|wide stance, DB hanging|knees out; deep sit|knees caving|V007|-|KF|Q|SR|DB|-|D|Coach|adductors and glutes
H073|DB skater squat|-|single-leg squat|H028|DB|quads,glutes|-|front thigh|single-leg squat|M|6-12/side|RIR1-2|lower target|3x12|-|n/m|DBs as counterweight|reach forward; back knee to cushion|crashing|H028|-|KF|Q|SR|DB|-|D|Coach|light DB + one leg
H074|DB lateral lunge|-|lunge|H036|DB|adductors,glutes|quads|inner thigh|frontal lunge|S|8-12/side|RIR1-2|goblet hold deeper|3x12|-|n/m|DB at chest|step wide; sit back|heel lifting|H036|V077|KF|Q|SR|DB|-|D|Coach|groin strength
H075|DB deficit RDL|-|hinge|V042|DB|hamstrings,glutes|back|back thigh|hinge|M|8-12|RIR1-2|higher step; one leg|3x12|-|n/m|stand on books/step|hips back; DBs past shins; stand|rounding back|V042|V043|-|Q|DF|DB,step|books|D|Coach|more stretch, light DBs
H076|DB suitcase deadlift|-|hinge|C004|DB|glutes,quads|obliques,grip|whole leg|hinge|S|8-12/side|RIR1-2|single DB|3x12|-|n/m|DB beside foot|stand straight up without leaning|side bending|-|-|-|Q|SR|DB|bag|D|Coach|anti-lean core
H077|DB good morning|-|hinge|C066|DB|hamstrings,erectors|glutes|back thigh|hinge|S|10-15|RIR2|pause|3x15|-|n/m|DB hugged on chest|hips back; flat back; stand|rounding|V042|-|SF|S|SR|DB|backpack|D|Coach|hinge with one DB
H078|DB side bend|-|core|V227|DB|obliques|QL|side trunk|lateral flexion|A|10-15/side|RIR2|pause|3x15|-|n/m|DB in one hand|bend away and back|twisting|-|-|SF|S|SR|DB|-|D|Coach|oblique strength
H079|DB Turkish get-up|TGU|core|-|DB|shoulders,core|glutes|whole body|get-up|A|3-5/side|RIR3|heavier|3x5|-|n/m|lie with DB pressed up|eyes on DB; arm locked; step by step|bent arm|no DB|-|SH|Q|BL|DB|shoe on fist|D|Coach|shoulder stability
H080|DB suitcase march|march carry|carry|V227|DB|obliques,grip|hip flexors|trunk|carry|F|30-60s/side|hard|heavier|3x60s|-|n/m|DB in one hand|stand tall; slow high march|leaning|V227|-|-|Q|SR|DB|-|D|Coach|carry in a small room
```

## 3. Slant-board table (NEW rows only)
```
id|name|aliases|family|parent|impl|primary|secondary|region|pattern|use|reps|effort|prog_lever|move_up|ladder|equiv|setup|cues|mistakes|easier|harder|joint|noise|space|equip|sub|grade|src|why|rehab_or_training|knee_load_note
H081|Heels-elevated BW squat|slant squat|squat|V024|slant board|quads|glutes|front thigh|squat|S|15-30|RIR0-2|steeper board; pause|3x25|SQUAT 2/9|n/m|heels on board, feet close|knees far forward; upright chest|heels slipping|V024|V006|KF|S|SR|board|plates/books|D|Coach|deep quad squat with stiff ankles|training|more knee load than flat squat
H082|Heels-elevated split squat|slant split squat|split squat|V078|board|quads|glutes|front thigh|lunge|M|8-15/side|RIR1-2|DBs; deficit|3x15|-|n/m|front heel on board|knee forward past toes; back knee down|leaning back|V078|V076|KF|Q|SR|board|book|D|Coach|quad-biased split squat|training|higher than flat split squat
H083|Double-leg decline squat|25° squat|decline squat|R42|board|quads,patellar tendon|-|knee|squat|A|10-15|pain ≤3/10|go to one leg|3x15|KNEE 1/5|n/m|both feet on 25° board|squat to ~60° knee bend|going too deep early|R37|H084|KF|S|SR|board|-|C|DA,Ko06|entry tendon loading|rehab|knee moment rises with angle to 25° (DA)
H084|Single-leg decline isometric|decline iso hold|decline squat|R42|board|quads,patellar tendon|-|knee|isometric|A|5x45s|~70% effort|deeper angle|5x45s|KNEE 3/5|n/m|one foot on board, hold wall|hold knee ~60°; breathe|pain spiking|H083|H085|KF|S|SR|board|-|C|Coach,Ko06|painful-tendon start|rehab|high patellar tendon strain (Ko06)
H085|Single-leg decline squat|SL decline squat|decline squat|R42|board|quads|glutes|knee|single-leg squat|S|3x15|pain ≤3/10|backpack load|3x15|KNEE 4/5|n/m|one foot on board|lower 3s; up on two legs; progress load|knee caving|H084|backpack|KF|Q|SR|board|-|B|P04,Y05|tendon rehab with best trial support|rehab|25° board raises tendon load vs flat (Ko06)
H086|Slant straight-knee calf stretch|gastroc stretch|stretch|-|board|gastrocnemius|-|calf|stretch|A|3x30-60s|easy|steeper|-|-|n/m|stand on board, toes up|knees straight; hips forward|bouncing|-|H088|-|S|SR|board|step edge|D|Coach|easy ankle range|both|none
H087|Slant bent-knee calf stretch|soleus stretch|stretch|-|board|soleus|Achilles|calf|stretch|A|3x30-60s|easy|steeper|-|-|n/m|on board, knees bent|push knees forward|heels lifting|-|-|-|S|SR|board|-|D|Coach|squat depth help|both|low
H088|Toes-up slant calf raise|stretched calf raise|calf raise|C026|board|calves|soleus|calf|ankle|S|10-20|RIR0-2|one leg; DB|3x20|CALF 3/4|n/m|stand on board facing uphill|rise high from stretched start; pause|bouncing|C026|V093|-|S|SR|board|-|D|Coach|deep calf raise without a step|training|none
H089|Slant side-tilt balance|inversion board balance|balance|R47|board|ankle stabilisers|glutes|ankle|balance|A|3x30s/side|easy|eyes closed|-|-|n/m|board turned sideways|stand one leg; quiet ankle|holding wall too long|R47|-|-|S|SR|board|-|D|Coach|ankle sprain prevention|rehab|none
H090|Toes-elevated SL RDL|slant RDL|hinge|V043|board|hamstrings|glutes|back thigh|hinge|S|8-12/side|RIR2|DB|3x12|-|n/m|front of foot on board|hips back; flat back|rounding|V043|-|-|Q|SR|board|-|D|Coach|hamstring stretch bias|training|low
```

## 4. Quiet-cardio table (NEW rows)
```
id|name|aliases|family|parent|impl|primary|intensity_METs|HR_note|vs_brisk_walk|use|dose|prog|setup|cues|mistakes|easier|harder|joint|noise|space|equip|grade|src|why
Q01|Marching in place|walking in place|march|-|BW|legs|~3-4.5 (stepping in place burned ~85% of a 3 mph walk in a 23-adult lab study)|moderate if knees high/fast|slightly below brisk walk (4.3 METs)|M|20-40 min|faster cadence, higher knees|stand on mat|land softly on ball of foot; pump arms|stomping|slower|Q02|-|Q|SR|mat|C|COMP,secondary lab|anyone can do it on TV breaks
Q02|High-knee slow march|-|march|Q01|BW|hip flexors,legs|~4-5|moderate-vigorous|≈ brisk walk|M|20-30 min|tempo|stand tall|knee to hip height; no bounce|leaning back|Q01|Q05|-|Q|SR|-|D|COMP(est.)|harder than plain march
Q03|Step-touch|side step|step|-|BW|legs|~3.5-4.5|moderate|≈ walk|M|20-40 min|add arm reaches, low squat|feet together|step out; tap; step back|heavy landing|Q01|Q06|-|S|SR|-|D|Coach|silent dance-style option
Q04|Shadow boxing|shadowboxing|boxing|-|BW|shoulders,core,legs|est. 5-8 (no Compendium entry for shadow; bag work at 60/120/180 punches/min = 7.0/8.5/10.8)|~68/75/83% HRmax at 60/120/180 punches/min on bag (A11)|above walk at ≥120 punches/min|M|3-min rounds x6-10|punch rate|fighting stance|stay light; exhale each punch; keep hands up|snapping arms straight|slow combos|faster rounds|SH|Q|SR|-|C|A11,COMP|fun, vigorous, silent if feet stay down
Q05|Slow mountain climber|step-in climber|plank|V218|BW|core,hip flexors|~5-8 by pace|vigorous if fast|above walk|S|30-45s x8|faster|plank on hands|bring knee to chest; place foot softly|bouncing hips|hands on bed|faster|WE|Q|BL|-|D|Coach|core plus heart rate
Q06|Continuous step-up|stair stepping|step|V073|stair|legs|4-inch step 5.5; 6-8 inch 7.5; 10-12 inch 9.5 (COMP aerobic step)|moderate-vigorous|above walk|M|15-30 min|higher step|stand facing step|whole foot on step; step down softly|pushing off back foot|lower step|backpack|KF|Q|DF|stair|B|COMP|biggest quiet MET range
Q07|Walking pad|under-desk treadmill|walk|R25|treadmill|legs|3.5 mph = 4.3; 4.0 mph = 5.0 (COMP)|moderate|equals brisk walk|M|30-60 min|speed|place on mat|tall, normal stride|holding handrails|slower|incline if any|-|Q|BL|pad|A (walking)|COMP|true brisk walk indoors
Q08|Standing cross-body knee-to-elbow|standing crunch march|march|Q01|BW|obliques,legs|~4|moderate|≈ walk|S|30-60s rounds|tempo|stand|elbow to opposite knee|rounding hard|-|-|-|S|SR|-|D|Coach|silent core+cardio
Q09|Step-back burpee (no jump)|low-impact burpee|burpee|-|BW|whole body|~6-8|vigorous|above walk|F|10 min EMOM|add push-up|stand|hands down, step back, step in, stand|landing hard|hands on bed|add push-up|WE|Q|BL|-|D|Coach|max effort with no jumping
Q10|Wall-sit BP block|isometric wall squat|isometric|V035|wall|quads|n/a (isometric)|HR modest|BP fall larger than walking (ED23)|S|4x2 min, 3/wk|lower|back on wall|breathe out steadily; never hold breath|breath holding|higher|-|KF|S|SR|wall|B|ED23|largest BP drop per minute
```
**Shadow boxing with an unstable shoulder (Grade D):** punch to about 80% of full reach and never snap the elbow straight. Keep elbows below shoulder height, and leave out overhand punches, wide hooks and anything with the arm raised and rotated back. **Do not hold hand weights**: they add pull on the joint at end range. Use jabs, crosses and short body hooks, and stop if the shoulder slips or catches.

## 5. Updates table (existing IDs; new/changed fields only)
```
id|name|home_setup|household_sub|noise|space|ladder_pos|home_notes
V115|Incline push-up|wall (vertical), counter ~90cm, chair 45cm|counter/bed/stairs|S|DF|PUSH 1-3/11|~41% BW at 60cm, ~55% at 30cm (E11)
V116|Knee push-up|pillow under knees|-|S|BL|PUSH 4/11|~49-53% BW (E11)
C032|Push-up|hands on DB handles to cut wrist bend|books|S|BL|PUSH 5/11|~64-69% BW (E11)
V204|Diamond push-up|-|-|S|BL|PUSH 7/11|RR dip prerequisite 3x8
V114|Weighted push-up|backpack with books/water, straps tight|backpack|S|BL|PUSH tier+|C15: band-loaded 6RM push-ups matched 6RM bench strength gains
C073|Pike push-up|hands on books for deficit|-|S|BL|VPUSH 1/5|-
V129|Wall handstand push-up|pillow under head|-|Q|DF|VPUSH 5/5|-
V119|Bench dip|chair/bed edge|chair|Q|DF|DIP 1/3|front-shoulder flag: keep shallow
V205|Bodyweight triceps extension|table edge or counter|counter|Q|DF|-|-
C072|Inverted row|sturdy table; knees bent then straight|counter|Q|DF|ROW 4-5/7|test table stability first
C074|Single-arm DB row|hand on chair/knee instead of bench|backpack/bag|Q|DF|-|backpack tier
C011|Barbell row|two DBs or backpack hinge row|backpack|Q|SR|-|see H055
V024|Bodyweight squat|-|-|S|SR|SQUAT 1/9|-
V025|Assisted squat|hold door frame|door|S|DF|SQUAT 0/9|-
V078|Static split squat|DBs at sides|bags|S|SR|SQUAT 4/9|-
C014|Bulgarian split squat|rear foot on bed/chair/sofa; DBs or backpack|chair|S|DF|SQUAT 5/9|-
V073|High-box step-up|stair or chair (test stability)|stairs|Q|DF|SQUAT 3/9|-
V028|Shrimp squat|knee to cushion stack|cushions|S|SR|SQUAT 8/9|-
V026|Pistol squat|heel on book if ankle stiff|book|S|SR|SQUAT 9/9|-
V027|Box pistol|sit to bed edge|bed|S|DF|SQUAT 6b/9|-
C067|Sissy squat|hold door frame; heels on slant board|door|S|DF|KNEE 4/5|KF flag
V034|Assisted sissy squat|door frame instead of bench|door|S|DF|KNEE 3/5|-
C068|Reverse Nordic|pillow under knees; partial range first|pillow|S|BL|KNEE 5/5|-
V035|Wall sit|BP protocol 4x2 min, 2 min rest (ED23)|door|S|SR|KNEE 1/5|heels on slant board = more quad
V043|Single-leg RDL|touch wall for balance; DB/backpack|bag|S|SR|HINGE 2/8|-
C024|Barbell hip thrust|shoulders on sofa; backpack or DB on hips|sofa|S|DF|HINGE 3b/8|-
V065|Single-leg hip thrust|shoulders on sofa/bed|sofa|S|DF|HINGE 4b/8|-
R29|Glute bridge → SL bridge|floor|-|S|BL|HINGE 1/8|-
V057|Slider leg curl|towel on hard floor or socks|towel|S|BL|HINGE 5/8|-
C023|Nordic hamstring curl|feet under sofa/bed frame, partner or strap; pillow under knees; push-up catch|sofa|Q|DF|HINGE 8/8|test that the anchor cannot lift
C026|Standing calf raise|step edge; backpack|stair|S|DF|CALF 1/4|-
V093|Single-leg DB calf raise|bodyweight first; stair|stair|S|DF|CALF 2/4|-
R44|Isometric calf raise|on slant board, heels low|board|S|SR|-|stretched-position hold
V094|Calf raise lengthened partials|on slant board toes-up|board|S|SR|-|-
C077|Tibialis raise|back on wall, heels out; slant board under heels; DB between feet seated|wall|S|SR|-|-
V006|Heel-elevated goblet squat|slant board|books|S|SR|-|-
V008|Cyclist squat|slant board, DBs at sides|books|S|SR|-|-
R42|Decline squat (eccentric)|25° slant board; 17° may work equally|board|S|SR|KNEE 4/5|P04,Y05
V036|Spanish squat|knotted bedsheet round closed door frame/sofa leg|sheet|S|DF|-|-
V087|Side-lying hip abduction|backpack strap on ankle|-|S|BL|-|-
C071|Copenhagen plank|top leg on bed/sofa edge|sofa|S|DF|-|-
V218|Front plank|long-lever: elbows ahead of shoulders|-|S|BL|CORE 1/5|-
V220|Dead bug|DB held overhead|-|S|BL|CORE 1/5|-
V230|Dragon flag|hold bed frame/heavy sofa|sofa|S|DF|CORE 5/5|-
C055|Farmer carry|DBs, bags or packs; march in place if no space|bags|Q|SR|-|-
V227|Suitcase carry|one backpack/bag|bag|Q|SR|-|-
C078|Neck curl and extension|lie on bed with head off edge; hand resistance|hand|S|DF|-|-
C076|Wrist curl|DB or backpack forearm on knee|bottle|S|SR|-|-
V007|Goblet squat|hug backpack at chest|backpack|S|SR|SQUAT 2b/9|-
C066|Good morning|backpack on back or DB on chest|backpack|S|SR|-|-
V054|Reverse hyperextension|lie face down on bed edge, hips at edge|bed|S|DF|-|-
V111|Dumbbell floor press|floor; neutral grip; pauses|-|S|BL|-|no-bench chest main lift
V150|Dumbbell pullover|on floor, or across bed|bed|S|BL|-|floor shortens range
V200|DB skull crusher|on floor|-|S|BL|-|-
V042|Dumbbell RDL|feet on books for deficit|-|Q|SR|-|-
C029|Dumbbell bench press|BENCH: no-bench sub V111 or H053|-|-|-|-|bench needed
C028|Incline dumbbell press|BENCH: sub = sofa-back incline or H053/H059|-|-|-|-|bench needed
V134|Dumbbell fly|BENCH: sub H051|-|-|-|-|bench needed
C041|Incline dumbbell curl|BENCH: sub H065|-|-|-|-|bench needed
V155|Chest-supported DB row|BENCH: sub H056|-|-|-|-|bench needed
```

## 6. Progression ladders (move up at the target shown)
- **PUSH (11):** V115 wall → V115 counter → V115 chair → V116 → C032 → H001 → V204 → H002 → H005 → H003 → H004. Move up at **3×15** (hypertrophy) or 3×8 (strength mode, per RR). Measured hand load runs from ~41% BW (60 cm incline) to ~74% BW (60 cm decline) (E11).
- **VPUSH (5):** C073 → H008 → H009 (hold 3×45 s) → H010 (3×5 at 5 s) → V129. Move up at 3×10.
- **DIP (3):** V119 → V204 at 3×8 → H011. RR requires 3×8 diamond push-ups before dips.
- **ROW (7, no bar):** H013 → H014 → H015 → C072 (bent knees) → C072 (straight legs) → H016 → H017. Move up at **3×15**, or 3×8 in strength mode. The order follows RR's vertical → incline → horizontal → archer logic.
- **CURL (2):** H022 → H023 → H024. Move up at 3×15.
- **SQUAT (9):** V025 → V024 → H081/V007 → V073/H027 → V078 → C014 → H028 → H029/V027 → V028 → V026. Move up at **3×15/leg**, or 3×20 for bilateral steps.
- **KNEE-ISO (5):** V035 → H030 → V034 → C067 → C068. Move up at 3×45 s or 3×12. Rehab branch: H083 → H084 → R42 → H085.
- **HINGE (8):** R29 → V043 → H033/C024 → H032/V065 → V057 → H031 → (hand-assisted negatives) → C023. Move up at 3×12. For C023, start with 3×3–5 negatives.
- **CORE (5):** V218/V220 → H041 → H044 → H045 → V230. Move up at 3×40 s or 3×12.
- **CALF (4):** C026 → V093 (BW) → H088 → H040/V093 with backpack. Move up at 3×20.

## 7. Rules for the app (numbered, graded)
1. **Hold muscle on little training (Grade B).**
   - *Under 60:* 1 session/week with ≥1 hard set per exercise per muscle group, taken to 0–2 RIR. In Bickel 2011 (70 adults: 16 weeks at 3×/week, then 32 weeks reduced), the one-ninth dose held strength and myofibre size in 20–35-year-olds. The one-third dose kept growing them.
   - *Over 60:* Bickel, Cross & Bamman (Med Sci Sports Exerc 2011) report that both reduced doses "preserved phase 1 muscle hypertrophy in the young but not the old." Older adults' strength still "remained at or above levels of the untrained young." Default to 2 sessions/week and 2–3 sets per exercise (Spiering 2021).
   - *Duration:* hold for up to 32 weeks, then re-test.
   - *Load:* Spiering names intensity as the key variable, and the trial loads were heavy. Holding muscle with **hard sets at lighter loads** (≥~30% of max, to failure) is an extrapolation from the hypertrophy literature, so it is Grade C. For strength holds, keep 1 heavy set (≥80%).
2. **Muscle group versus specific lift (Grade C).** Muscle can be held with any exercise, but 1RM in a lift not practised drifts down. The minimum dose that still raised 1RM was a single set of 6–12 reps at 70–85% to failure, 2–3×/week (Androulakis-Korakakis 2020, Grade B). Powerlifters' estimated minimum is ~3–6 sets of 1–5 reps per week at >80%, spread over 1–3 sessions at RPE 7.5–9.5. **App rule:** a lift the user wants to keep should appear ≥1×/week with 1–3 sets of 1–5 reps at RPE 8. If a lift has gone >3 weeks without practice, flag "expect a skill dip" and start back at 90%. Transfer can be good: in Kotarsky 2018, bench 1RM rose from 61.1 to 64.2 kg in 4 weeks of push-ups with no benching.
3. **Coming back (loss: Grade B; return loads: Grade D).** Bosquet 2013 (103 studies) found strength losses trivial until about week 3, then growing with time off; in its words, the effect of stopping "was found to be larger in older people (> 65 years old)." Greg Nuckols (Stronger by Science) reads this as older adults losing strength about twice as fast; that figure is his reading, not the paper's abstract. Ogasawara 2013 had 14 young men bench at 75% 1RM, 3×10, 3 days/week, either continuously for 24 weeks or in 6-weeks-on/3-weeks-off cycles; after each break, bench strength fell slightly and was regained within about 3 weeks of retraining, and the authors concluded that "3-week detraining/6-week retraining cycles result in muscle hypertrophy similar to that occurring with continuous resistance training after 24 weeks." Return settings:

| time away or reduced | first-session load | first-week sets | full volume by | older user |
|---|---|---|---|---|
| ≤1 wk | 95–100% | 100% | session 1 | same |
| 2 wk | 90–95% | 2/3 | week 2 | 90% |
| 4 wk | 85–90% | 1/2–2/3 | week 2–3 | 80–85% |
| 8 wk | 75–85% | 1/2 | week 3–4 | 70–80% |
| 12+ wk | 65–75% (or re-test e1RM at RPE 7) | 1/2 | week 4–6 | 60–70% |
   - **Soreness and cramp (Grade C/D):** keep the first 1–2 sessions back at RIR 3–4 for the hardest sets. Leave out Nordics, lengthened partials, slow negatives and high-rep calf and hamstring work in week 1. A mild first session protects against soreness in the following weeks (the repeated-bout effect). For cramp, the evidence is thin: cut sets of the cramping muscle in shortened positions, stretch it gently to stop the cramp, and do not escalate volume the next session.
4. **Low-load training to failure (Grade A for growth ≥~30–40% of max; Grade B for the floor).** Hard sets to failure from about **5 to 30 reps** give similar growth. Lasevicius 2018 (Eur J Sport Sci; 30 untrained men, 12 weeks, twice a week, different loads on each limb, volume equated) found "a wide spectrum of intensities, from 40–80% 1RM" viable, while "20% 1RM was suboptimal for maximizing muscle hypertrophy." **App rule:** if a bodyweight variation allows >30 reps, it is too easy, so move up the ladder rather than adding reps. Low loads must reach failure; in Lasevicius 2022, only the to-failure low-load group matched heavy loads. Strength still favours heavy loads. *Practical problems:* burning discomfort, and on legs breathing or heart rate quits before the muscle. Solve this with single-leg work (H028, C014), slower tempo and pauses, and rest-pause.
5. **Supersets and circuits (Grade A/B).**
   - *Opposing-muscle supersets* (e.g., push/row): no loss of growth or strength, and agonist–antagonist pairs allowed more reps (SMD 0.68). Zhang, Weakley et al. (Sports Med 2025; 19 studies, 313 participants) found supersets cut session duration by about 37% "without compromising training volume, muscle activation, perceived recovery, or chronic adaptations in maximal strength, strength endurance, and muscle hypertrophy." Iversen 2021 puts the saving at roughly half.
   - *Unrelated-muscle supersets* (e.g., calf + press): same benefit. Use them freely.
   - *Same-muscle pairs* cut volume load (SMD −1.08), so avoid them for main work.
   - *Circuits of 3+ exercises:* they raise VO2max (Muñoz-Martínez 2017 meta-analysis; best results with 14–30 sessions of 20–30 min at 60–90% 1RM). Heavy lifts lose some load, so put the heavy lift first with full rest.
   - *Can circuits replace cardio?* Partly. They give a useful fitness gain for beginners, but they are not equal to dedicated aerobic work for VO2max or blood pressure. Keep ≥2 cardio sessions/week (Grade C).
   - *Blood pressure:* aerobic training −4.49/−2.53 mmHg, resistance −4.55/−3.04, combined −6.04/−2.54, isometric −8.24/−4.00, wall squat −10.47/−5.33 (only 4 effect sizes), walking −2.85/−1.44 (ED23, 270 RCTs).
   - *Liver fat:* aerobic (~40 min, 3×/week, 12 weeks) and resistance (~45 min, 3×/week) both cut liver fat, and resistance did it at lower energy cost (Hashida 2017).
6. **Short sessions (Grade C).** Iversen 2021: use bilateral compound lifts, ≥4 weekly sets per muscle, 6–15RM, and specific warm-ups only.
   - **20 min:** 2 supersets (push+pull, squat+hinge) × 3 rounds at RIR 0–2, then 1 core finisher. Holds or slowly builds muscle.
   - **30 min:** 3 supersets × 3 rounds (add arms/shoulders or single leg). Builds muscle at about 2–3 sessions/week.
   - **45 min:** a heavy lift first (3–5 sets, full rest), then 3 supersets, then 5 min of Q-row cardio.
   - **Order:** most-skill/heaviest → compound supersets → isolation → finisher/cardio.
7. **Substitution (carryover: chest B; legs C; back D).**

| gym lift | DB sub | no-equipment sub | carryover |
|---|---|---|---|
| C007 bench | V111/H053 | H001 / V114 backpack | good (K18, Ki17, C15) |
| C001/C003 squat | H070/C014 | C014/H028/V026 | good for size; 1RM drifts |
| C004 deadlift | V042/H075 | V043+C023/V057 | moderate; grip and pull-off-floor lost |
| C008 OHP | H059/V121 | H008/H010 | moderate |
| C009/C010 pull-up/pulldown | V150+C074 | H015/H017+H018 | poor for lats |
| C011/C013 rows | H055/H056 | H015/C072 | good |
| C024 hip thrust | C024 with DB on sofa | V065 | good |
| C021/C022 leg curl | V062 | V057/H031/C023 | good |

## 8. Templates
**A. 30-min silent bedroom, no equipment** (alternate A1/A2, rest 60 s between): A1 ladder PUSH step 3×6–15 / A2 H015 3×8–15 · B1 C014 (chair) 3×8–15/leg / B2 H031 or V057 3×8–12 · C1 V065 (sofa) 2×10–20 / C2 H041 2×20–40 s · D V093 single-leg 2×max, 2 s pause. All S/Q noise ratings.

**B. 30-min dumbbell superset:** A1 V111 3×6–10 / A2 H055 3×8–12 · B1 C014 with DBs 3×8–12/leg / B2 V042 3×8–12 · C1 H059 2×8–12 / C2 V183 2×10–15 · D1 V200 floor 2×10–15 / D2 H060 2×15–20. Rest 60–75 s.

**C. One gym day + two home days.** Gym (heavy specific practice): C001 3×3–6, C007 3×3–6, C004 2×3–5, C009 or C010 3×6–10, C013 2×8–12, C022 2×10–12. Home A (DB): H070 3×10–15, H053 3×8–12, H056 3×10–15, H075 3×10, C035 2×15, H067 2×15. Home B (BW): H001 3×max, H015 3×max, H028 3×8–12/leg, H031 3×8–12, H008 2×8–12, H044 2×12.

## 9. What cannot be done well at home
- **Lats and vertical pulling without a bar.** The best of the bad options are H015/H017 rows plus H018. A doorway pull-up bar is the single best purchase.
- **Heavy specific 1RM practice** (squat, bench, deadlift). Use 1 gym day/week, or accept a drift.
- **Heavy hip hinge.** Without heavy load, hinges rely on single-leg work and Nordics.
- **Heavy quads for strong lifters at 5–80 lb.** Use C014/H028 with pauses, low-load to failure and rest-pause.
- **Neck under real load.** C078 by hand only.
- **Lengthened-position biceps and lat work at load.** H065 and H018 are weak stand-ins.

## 10. Gaps (coach consensus doing the work)
- No measured load equivalences exist except push-ups (E11). Every row, ladder order and rep target is Grade D.
- Door-anchored rows, floor pulls and isometric towel work have **no** training studies.
- Maintenance in older adults rests largely on one RCT (Bickel). The minimum frequency for specific-lift retention is not known.
- Return-to-training loads and cramp guidance are coach consensus.
- Shadow boxing METs are not in the Compendium. Sources disagree (estimates of 5–8 vs claims of 7–9.8), so the app should use heart rate.
- Overcoming Gravity, GMB, Convict Conditioning, FitnessFAQs, Kboges, Hybrid Calisthenics and Calisthenicmovement progressions were not verified line by line in this pass. Ladders lean on the RR.
- **Row targets not met:** 50 new + ~38 BW-relevant updates (vs 120), and 30 new + ~25 DB-relevant updates (vs 100). Unwritten candidates are mostly tempo or grip variants that belong as modifiers, not rows.

## 11. Dedupe check
- Wall push-up → no new row; it is V115 at vertical height.
- Rear-foot-elevated split squat → C014 (update).
- Table row → C072 (update). One-arm table row → kept as new H017 (parent C072) because loading differs.
- Sliding leg curl → V057 (update). Single-leg version → kept as new H031.
- Backpack rows, squats, push-ups and carries → updates to C074/C011/V007/V114/C055/V227. Only H048 and H049 are new, because their loading patterns differ.
- Prone Y/T → R04/V181 exist. Only the W (H020) and swimmer (H019) are new.
- Chair dip between two chairs → new H011, because it is a parallel-bar dip, not V119.
- Standing DB press → new H059 (V121 is seated). Side-lying floor lateral → new H060 (V167 needs a bench).
- Decline squat → R42 kept. New rows cover only the double-leg, isometric and loaded single-leg training versions.
- Pause and 1.5-rep versions → treated as PROG-STD modifiers, not rows.
- Wall sit for BP → Q10 references V035 as parent rather than duplicating it.
- Clamshell → skipped (covered by R41).

Sources:
1. nih — https://pmc.ncbi.nlm.nih.gov/articles/PMC5260524/
2. researchgate — https://www.researchgate.net/publication/6578678_Biomechanical_analysis_of_the_single-leg_decline_squat_COMMENTARY
3. nih — https://pubmed.ncbi.nlm.nih.gov/15665207/?dopt=Abstract
4. semanticscholar — https://www.semanticscholar.org/paper/A-pilot-study-of-the-eccentric-decline-squat-in-the-Purdam-Jonsson/8d53ac59e9b08db1fd23c578cab9b464b53a1e50
5. yourwellnessnerd — https://www.yourwellnessnerd.com/blogs/blog/research-how-heavy-are-push-ups
6. optibodyfit — https://optibodyfit.com/workout-guide/fitness-programs/how-much-weight-is-incline-push-up/
7. github — https://github.com/NearHuscarl/recommended-routine
8. github — https://gist.github.com/sgup/f10f1d57e54b7876495f4bafb6d697eb
9. lww — https://journals.lww.com/acsm-msse/fulltext/2011/07000/exercise_dosing_to_retain_resistance_training.7.aspx
10. sacredlotus — https://sacredlotus.com/go/integrative/practice/strength-minimum-dose
11. zelosstrength — https://www.zelosstrength.com/post/minimum-effective-dose-resistance-training
12. ovid — https://www.ovid.com/jnls/nsca-jscr/fulltext/10.1519/jsc.0000000000003964~maintaining-physical-performance-the-minimal-dose-of
13. newbaselineclimbing — https://newbaselineclimbing.com/the-minimal-effective-dose-for-strength-training/
14. nih — https://pubmed.ncbi.nlm.nih.gov/31797219/
15. olemiss — https://egrove.olemiss.edu/hesrm_facpubs/66/
16. getfitcraft — https://getfitcraft.com/guides/push-up-progression
17. t-nation — https://www.t-nation.com/training/tip-benching-vs-push-ups-the-shocking-science/amp/
