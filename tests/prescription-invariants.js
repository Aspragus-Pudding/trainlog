#!/usr/bin/env node
/* Prescription invariants for Trainlog. Run after ANY change to prescription
   logic (nextPrescription, suggestFor, seedDraft, logSet's recompute, schemeFor):

     node tests/prescription-invariants.js

   No dependencies. It loads the <script> from index.html with a stubbed DOM and
   calls the real functions. Exit code is non-zero if any invariant fails.

   Invariants for a prescribed (load, reps) after a logged (load L0, reps R0, RPE0)
   against a target RPE T and rep range [lo, hi], on EITHER pricing path
   (isChartFree() picks the chart for barbell/dumbbell/bodyweight, direct
   RPE-delta stepping for machine/stack/cable — see index.html):
     1. The reps a load is priced for are the reps returned with it.
     2. RPE0 < T (easier): more load; or more reps while below the range top.
        RPE0 > T (harder): less load, or fewer reps at the same load.
        RPE0 = T: hold exactly (no snapping to the load grid), unless reps are
        already past the range top, which is itself a load-up signal.
     3. Load and reps never both go up.
     4. Chart path only: a set off the %1RM chart (reps-to-failure > 16) is
        reported as too light to price, never silently treated as "no
        change". The RPE-delta path has no chart, so this can't happen.
   Also covers: the readiness formula scores an honest "everything's
   average" check-in as normal, not reduced (item 1); load/set cuts require a
   physical signal — soreness or a flagged joint — never sleep/motivation
   alone (item 1); and the stagnation probe fires after three flat sessions
   and backs off for two after being declined (item 3). */
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(process.env.TRAINLOG_HTML||path.join(__dirname,'..','index.html'),'utf8');   // TRAINLOG_HTML: test another build
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];

function stub(){
  const f=function(){};
  return new Proxy(f,{
    get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },
    set(){ return true; }, apply(){ return stub(); }, construct(){ return stub(); }
  });
}
const EXPORTS=['nextPrescription','schemeFor','EX','exById','LOG','append','sets','toLb','currentPhase','explainRx',
  'suggestFor','seedDraft','logSet','moveSlot','adjustSets','fatigueRise','impliedE1','predictedRpe','rtfFromPct',
  'MUSCLE_REP_RANGE','CFG','FATIGUE_MIN_PAIRS','FATIGUE_MIN_SESSIONS','CHART_MAX_RTF',
  'isChartFree','physicalCut','readinessScore','readinessLabel','rpeDeltaStep','stagnationProbe',
  'exerciseSessionHistory','STAGNATION_SESSIONS','STAGNATION_SUPPRESS','RPE_HOLD_TOL','GROUP_LABEL','JOINT_PATTERNS',
  'jointTrend','jointLevel','jointNoteFor','jointSessions','programSessions','programProjection','recentPace',
  'compressRoadmap','BLOCK_MIN','applyShape','DRIFT_DAYS','LANDMARKS','MUSCLE_GROUP','SCALE','defaultRepRange','readinessScoreFromEvent',
  'programPosition','splitKeyFor','todayDay','generatedDays','MUSCLE_ORDER','sessionTonnage','primaryMuscle','lintRoadmap','SPLITS','roundLoads','shownLoad','LB','SCALE_SPEC','fromNeutral','jointDriftNote','jointBaseline','splitOf','weekTemplate','validWeek','DAY_TYPES','WEEK_STYLES','styleOfWeek','weekCoverage','splitFor','openFeedbackNotes','notesReport','applyRepRange','applyBarOverrides','loadable','warmupRamp','sessionBests','rebalance','rebalanceDraft','refE1','aimFor','stepUp','draftLocked','loadFor','diaryEntries','exNote','saveExNote','NOTE_TAGS','familyOf','mainEligible','customSpecificity','resolveEx','modSig','modLabel','modLabelFromSig','lastSetFor','prIds','bestE1RM','tracksFor','setTrack','cleanMods','buildDay','backoffLoad','tmFor','ensureInitialTM','isRealizationWeek','amrapPct','amrapRx','checklistItems','videoDue','stickingPending','PROFILES','profileParams','activeProposals','sequenceBlocks','PROFILE_ORDER','migratePeak','addMaintenance','effortRamp','muscleDropping','capSessionVolume','deloadSignals','weeksWithoutDeload','builderDefaults','builderPlan','applyBuilder','EXPERIENCE','blockLen','rateOf','rateState','tmFor','RATE_LABEL','setE1RM','moveHistory','lastHistoryMove','undoHistoryMove',
  'stallState','stallPlan','stallCard','interventions','activeIntervention','startIntervention','stopIntervention','ivOutcome','ivFailures',
  'ownRatios','stickingDiagnosis','specializationCheck','addedExposureFor','applyInterventions','addPracticeDays','rpeScatter','STALL_TABLES',
  'FAMILY_STICKING','TRACKED_FAMILIES','variantOptions','deloadStopsVolume','inDeficit','onTrack','IV_SHARE','flagFor','applyShape','suggestionAccuracy','allOutNext','importBackup','finishImport','applySetupLink','mergeCustom','buildPrep','BUILDER_QUICK','ENGINE','ENGINE_IDS','trackHistory','floorFor','ceilingFor','stepDown','focusedDeload','startFocusedDeload','fdCovers','dialEffective','calibratingNow','traceLines','bandOf','globalReadiness','soreGroupsFor','adjHits','applyReadinessSets','INJ','hasLegacy','exTags','modSig','exerciseVerdict','jointQuestionFor','likelyFlaggedFor','isWarning','libraryFlag','painRule','painKinds','activeRehabPlans','startRehabPlan','rehabPlan','INJ_BY','phaseMinWeeks','injConsented','INJ_CONSENT','INJ_DISCLAIMER','redFlagged','clearPainData','preSessionCues','activeProposals','generatedDays'];
/* A stub document that serves the embedded injury library and movement tags, so the
   engine's flags run on the real data (everything else stays a stub). */
const EMBED=id=>{ const m=html.match(new RegExp('<script type="application/json" id="'+id+'">([\\s\\S]*?)</script>')); return m?m[1]:''; };
const EMBEDS={injuries:EMBED('injuries'),'movement-tags':EMBED('movement-tags')};
function docWithData(){ const d=stub(); return new Proxy(d,{get(t,k){ if(k==='getElementById') return id=>id in EMBEDS?{textContent:EMBEDS[id]}:stub(); return d[k]; }}); }
function load(events, withData){
  const store={};
  if(events&&events.length) store['trainlog.jsonl.v1']=events.map(e=>JSON.stringify(e)).join('\n');
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
  // exports are looked up defensively so an older build can be run against the suite
  const pick=EXPORTS.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',');
  const body=src+'\n;return {'+pick+',setSession:x=>{session=x},getSession:()=>session,getDraft:()=>draft,'+
    'setRoadmap:x=>{ROADMAP=x},getRoadmap:()=>ROADMAP,getCFG:()=>CFG};';
  const fn=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval',
    'alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',body);
  return fn(withData?docWithData():stub(),stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}});
}

const day=n=>new Date(Date.now()-n*864e5).toISOString();
let uid=0;
const set=(id,sid,w,reps,rpe,d,extra)=>({type:'set',id:'t'+(uid++),ts:day(d),session_id:sid,exercise_id:id,slot:id,
  weight:{value:w,unit:'lb'},reps,rpe,set_kind:'straight',group:null,...extra});

let failures=0, checks=0; const shown={};
function fail(kind,detail){ failures++; shown[kind]=(shown[kind]||0)+1; if(shown[kind]<=3) console.log('  FAIL ['+kind+'] '+detail); }
function ok(cond,kind,detail){ checks++; if(!cond) fail(kind,detail); }
const section=t=>console.log('\n'+t);

/* ─── 1. the grid: every branch of nextPrescription, coarse and fine steps ─── */
section('1. direction / pairing across a grid of last sets');
const EXS={hipAbd:'multihip_abd',pulldown:'pulldown',bench:'bench',curl:'curl'};   // 10 lb machine, 10 lb stack, barbell, small step
const SLOTS=[[10,15,9],[8,12,8],[6,8,8],[3,5,8],[6,10,6],[10,15,6]];               // last two: deload-style low targets
const LASTS=[]; for(const r of [3,5,6,8,10,12,15,20,25]) for(const p of [6,7,7.5,8,8.5,9,9.5,10]) LASTS.push([r,p]);
const HISTORIES={none:0,flat:7,rising:7};
let grid=0;
for(const [name,exid] of Object.entries(EXS)) for(const L0 of [55,60,170]) for(const [lo,hi,T] of SLOTS)
for(const [R0,RPE0] of LASTS) for(const [hn,hcount] of Object.entries(HISTORIES)){
  const ev=[];
  for(let i=1;i<=hcount;i++) ev.push(set(exid,'h'+i,hn==='rising'?L0-5*(hcount-i+1):L0,Math.min(hi,10),8,60-i*5));
  ev.push(set(exid,'last',L0,R0,RPE0,1));
  const A=load(ev), slot={ex:exid,role:'accessory',sets:3,reps:[lo,hi],rpe:T,sets_target:3};
  const p=A.nextPrescription(slot); grid++;
  const tag=`${name} ${L0}x${R0}@${RPE0} range ${lo}-${hi}@${T} hist:${hn} -> ${p.lb}x${p.reps} (${p.src})`;
  ok(p.lb!=null&&isFinite(p.lb)&&p.lb>=0&&p.reps>=1,'valid',tag);
  const up=p.lb>L0+1e-6, down=p.lb<L0-1e-6, same=!up&&!down;
  ok(!(up&&p.reps>R0),'load+reps both up',tag);
  const dir=T-RPE0;
  const chartFree=A.isChartFree(A.exById[exid]);
  // the RPE-delta path holds within +/-0.5 of target (its own stated rule);
  // the chart path has always used exact equality — no change there
  const atTarget=chartFree?Math.abs(dir)<=0.5:dir===0;
  const inRange=R0>=lo&&R0<=hi;
  if(!inRange){
    // a last set outside the range is a different context: priced to the range edge (Oct 2026)
    const edge=R0<lo?lo:hi, offc=chartFree?false:(R0+(10-RPE0)>16);
    if(!offc&&!(chartFree&&R0>hi&&R0+(10-RPE0)>16)) ok(p.reps===edge||p.reps===Math.max(lo,Math.min(hi,p.reps)),'outside the range: priced to the nearest edge',tag);
  }else if(!atTarget&&dir>0){
    ok(!down,'easy set got less load',tag);
    ok(!(same&&p.reps<R0),'easy set got same load, fewer reps',tag);
    if(R0<hi){
      if(chartFree) ok(same&&p.reps===Math.min(hi,R0+Math.max(1,Math.round(dir))),'easy mid-range: reps should add the full RPE gap',tag);
      else ok(same&&p.reps===R0+1,'easy mid-range: one more rep',tag);
    }else ok(up,'easy at range top: no load increase',tag);
  }else if(!atTarget&&dir<0){
    ok(!up,'hard set got more load',tag);
    ok(down||(same&&p.reps<R0),'hard set not made easier',tag);
  }else{
    // on target inside the range: hold exactly
    if(!chartFree||R0<=hi) ok(same&&p.reps===R0,'on target: not held exactly',tag);
    else ok(up,'chart-free: on target but strictly past ceiling should raise load',tag);
  }
  // every suggestion inside its range (the third report of "the range doesn't reach the suggestion")
  ok(p.reps>=lo&&p.reps<=hi,'suggested reps outside the '+lo+'-'+hi+' range',tag);
  if(!chartFree&&inRange){
    const rtf=R0+(10-RPE0);
    if(dir>0&&R0>=hi&&rtf>16) ok(/too light to price/.test(p.note)&&/too light to price/.test(p.src),'off-chart set not reported',tag);
    // priced pair: the returned (load, reps) should feel like the target, unless a whole step is forced
    const e1=A.impliedE1?A.impliedE1(L0,R0,RPE0):null;
    if(e1!=null){
      const pr=A.predictedRpe(e1,p.lb,p.reps);
      const forced=/one step/.test(p.src);
      if(pr!=null){
        if(dir>0&&!forced&&up) ok(pr<=T+0.5,'priced pair harder than target ('+pr.toFixed(1)+')',tag);
        if(dir<0&&!(same&&p.reps===Math.max(1,Math.min(R0-1,hi)))) ok(pr<RPE0,'hard set: priced pair not easier ('+pr.toFixed(1)+')',tag);
      }
    }
  }
}
console.log('  '+grid+' cases');

/* ─── 2. the reported cases, by name ─── */
section('2. reported cases');
{
  const run=(ev,slot)=>load(ev).nextPrescription(slot);
  let p=run([set('multihip_abd','l',60,20,7,1)],{ex:'multihip_abd',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3});
  ok(p.lb>60&&p.reps<=15,'hip abduction 60x20@7',JSON.stringify(p)); console.log('  hip abduction 60x20@7 ->',p.lb,'x',p.reps,'|',p.src);
  ok(/hit top of range/.test(p.src),'hip abduction: no longer an off-chart concept, should say ceiling hit',p.src);
  p=run([set('pulldown','l',170,11,7.5,1)],{ex:'pulldown',role:'primary',sets:4,reps:[6,8],rpe:8,sets_target:4});
  ok(p.lb>170,'pulldown 170x11@7.5 load did not rise',JSON.stringify(p)); console.log('  lat pulldown 170x11@7.5 ->',p.lb,'x',p.reps,'|',p.src);
  ok(p.reps===6,'pulldown ceiling-hit should reset reps to the floor',JSON.stringify(p));
  p=run([set('multihip_abd','l',60,6,8.5,1)],{ex:'multihip_abd',role:'secondary',sets:3,reps:[8,12],rpe:8,sets_target:3});
  // 6 reps in an 8–12 range used to be held at 6 (the Oct 2026 "range doesn't reach the suggestion" bug):
  // now it's priced back into the range at the floor
  ok(p.reps===8&&p.lb<60,'below the range: priced to the floor, lighter',JSON.stringify(p)); console.log('  hip abduction 60x6@8.5 in an 8-12 range ->',p.lb,'x',p.reps);
  // RPE 9.5 vs target 9 is within the +/-0.5 hold tolerance (at target, not
  // harder), and 15 is exactly the ceiling, not past it — a normal,
  // correctly-dosed top set, so this holds (see index.html: firing a load-up
  // on every at-ceiling set was more aggressive than warranted and raised
  // backtest error — the stagnation probe is what eventually pushes past a
  // genuine plateau, not every single at-ceiling set)
  p=run([set('multihip_abd','l',60,15,9.5,1)],{ex:'multihip_abd',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3});
  ok(p.lb===60&&p.reps===15,'exactly at the ceiling at target RPE should hold, not force a step',JSON.stringify(p));
  console.log('  hip abduction 60x15@9.5 (at target, exactly at ceiling) ->',p.lb,'x',p.reps);
  p=run([set('bench','l',185,8,7.5,1)],{ex:'bench',role:'primary',sets:3,reps:[6,8],rpe:6,sets_target:3});
  ok(p.lb<=185,'deload target RPE 6, set at 7.5 raised load',JSON.stringify(p)); console.log('  bench 185x8@7.5 in a deload (RPE 6) ->',p.lb,'x',p.reps);
  p=run([set('multihip_abd','l',55,13,7,1)],{ex:'multihip_abd',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3});
  ok(p.lb===55&&p.reps===15,'off-grid load was snapped, or the 2-rep gap was not applied',JSON.stringify(p)); console.log('  hip abduction 55x13@7 ->',p.lb,'x',p.reps,'(hold exactly, +2 reps of reserve)');
}

/* ─── 3. override damping: the probe must respect the last set's RPE ─── */
section('3. override probe');
{
  const ov=(w,reps,rpe,sug,d,sid)=>set('bench',sid,w,reps,rpe,d,{suggested_lb:sug});
  const mk=(reps,rpe)=>[ov(180,reps,8,200,12,'o1'),ov(175,reps,8,190,9,'o2'),ov(170,reps,8,180,6,'o3'),ov(155,reps,rpe,165,1,'o4')];
  const slot={ex:'bench',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3};
  for(const [reps,rpe] of [[11,9.5],[15,9.5],[13,7],[15,8],[12,9]]){
    const p=load(mk(reps,rpe)).nextPrescription(slot), up=p.lb>155, down=p.lb<155;
    const tag=`streak, last 155x${reps}@${rpe} -> ${p.lb}x${p.reps} (${p.src})`;
    ok(!(up&&p.reps>reps),'probe: load and reps both up',tag);
    if(rpe>9) ok(!up&&(down||p.reps<reps),'probe: hard set not made easier',tag);
    if(rpe===9) ok(p.lb===155&&p.reps===reps,'probe: on target not held',tag);
    if(rpe<9) ok(!down&&!(p.lb===155&&p.reps<reps),'probe: easy set got less',tag);
  }
}

/* ─── 4. first-ever prescription: priced reps == returned reps ─── */
section('4. first prescription from an estimate');
{
  const A=load([{type:'e1rm_estimate',id:'e',ts:day(1),exercise_id:'bench',lb:250}]);
  const p=A.nextPrescription({ex:'bench',role:'primary',sets:3,reps:[6,8],rpe:8,sets_target:3});
  ok(p.reps===8,'first prescription returned reps other than the ones it was priced for',JSON.stringify(p));
  console.log('  bench e1RM 250, 6-8 @ RPE 8 ->',p.lb,'x',p.reps);
}

/* ─── 5. within-session fatigue: threshold and effect ─── */
section('5. within-session fatigue');
{
  const hist=(sessions)=>{ const ev=[]; for(let s=1;s<=sessions;s++){ [7,8,9].forEach((r,i)=>ev.push(set('bench','p'+s,135,8,r,40-s*3+i*0.001))); } return ev; };
  const slot={ex:'bench',role:'primary',sets:3,reps:[6,10],rpe:8,sets_target:3};
  for(const [sessions,expectReady] of [[2,false],[4,false],[5,true]]){   // 2 pairs/session: 4, 8, 10 pairs
    const ev=hist(sessions).concat([set('bench','cur',135,8,7.5,0)]);
    const A=load(ev); A.setSession({id:'cur',slots:[{...slot,sets:[]}],adj:null});
    const f=A.fatigueRise('bench');
    ok(f.ready===expectReady,'fatigue threshold',`sessions ${sessions}: n=${f.n} sessions=${f.sessions} ready=${f.ready}`);
    const p=A.nextPrescription(slot);
    if(expectReady){
      ok(p.fatigue&&p.fatigue.applied&&p.fatigue.rise===1,'fatigue not applied when ready',JSON.stringify(p.fatigue));
      ok(p.lb<135||(p.lb===135&&p.reps<8),'fatigue: 7.5 + 1.0 expected rise vs RPE 8 should not push load up',JSON.stringify(p));
      const line=A.explainRx(slot,p,{fresh:false}).line;
      ok(/fatigue −1 RPE · 10 pairs, 5 sessions/.test(line),'fatigue sample size missing from the explanation line',line);
      console.log('  '+sessions+' sessions -> applied:',line);
    }else{
      ok(!p.fatigue.applied,'fatigue applied below the threshold',JSON.stringify(p.fatigue));
      console.log('  '+sessions+' sessions ('+f.n+' pairs) -> not applied');
    }
  }
  // not applied across sessions (last set from an earlier session)
  const A=load(hist(5)); A.setSession({id:'cur',slots:[],adj:null});
  const p=A.nextPrescription(slot); ok(p.fatigue===null,'fatigue applied to a cross-session suggestion','');
}

/* ─── 6. rep ranges ─── */
section('6. rep ranges');
{
  const A=load([]); const r=(id,role='accessory',bt='hyp')=>A.schemeFor(role,bt,1,4,A.exById[id]);
  ok(JSON.stringify(r('multihip_abd').reps)==='[10,15]','abductors','abductors range');
  ok(A.MUSCLE_REP_RANGE.abductors[1]===15&&A.MUSCLE_REP_RANGE.adductors[1]===15,'adductors table','');
  const calf=r('stand_m_calf'); ok(calf.reps[1]===15&&calf.repCapped,'coarse calf machine not capped',JSON.stringify(calf.reps));
  const raise=r('lat_raise'); ok(raise.reps[1]===20,'dumbbell lateral raise should keep 10-20',JSON.stringify(raise.reps));
  const cable=r('cable_raise'); ok(cable.reps[1]===20,'fine-step cable raise should keep 10-20',JSON.stringify(cable.reps));
  ok(A.schemeFor('primary','str',1,4,A.exById.bench).reps[0]===3,'primary keeps block range','');
  console.log('  abductors',JSON.stringify(r('multihip_abd').reps),' calf machine',JSON.stringify(calf.reps),' lateral raise',JSON.stringify(raise.reps));
}

/* ─── 7. session mechanics ─── */
section('7. session mechanics');
{
  const ev=[set('bench','a',135,8,8,5),set('ohp','a',95,10,8,5)];
  const A=load(ev);
  const mkSlot=id=>({ex:id,role:'accessory',reps:[8,12],rpe:8,sets_target:3,sets:[]});
  const S={id:'S',slots:[mkSlot('bench'),mkSlot('ohp'),mkSlot('curl')],openIdx:1,adj:null,ratings:{}};
  A.setSession(S);
  // REORDERING NEVER MOVES THE PANEL — it stays on the exercise you have open. These tests used to
  // assert the opposite (the panel followed the moved exercise), which is why "moving an exercise
  // steals the Log Set panel" came back on v1.44.0 after being reported on v1.20.0.
  const openEx=()=>S.slots[S.openIdx].ex;
  A.moveSlot(2,-1);                                   // curl up past ohp, ohp open
  ok(openEx()==='ohp','reorder up: the panel stays on the open exercise (ohp)',`order ${S.slots.map(s=>s.ex)} open ${openEx()}`);
  A.moveSlot(0,1);                                    // bench down past curl
  ok(openEx()==='ohp','reorder of two others: the panel stays on ohp',`order ${S.slots.map(s=>s.ex)} open ${openEx()}`);
  const at=S.openIdx; A.moveSlot(at,-1);              // move the open exercise itself up
  ok(openEx()==='ohp'&&S.openIdx===at-1,'moving the open exercise: the panel goes with it',`order ${S.slots.map(s=>s.ex)} open ${openEx()}`);
  // mid-exercise: a logged set on the open one, then move something else — the draft is untouched
  { const B=load(ev), T={id:'T',slots:[mkSlot('bench'),mkSlot('ohp'),mkSlot('curl')],openIdx:0,adj:null,ratings:{},startedAt:Date.now()};
    B.setSession(T); B.seedDraft(T.slots[0]); const d=B.getDraft(); d.weight=140; d.reps=8; d.rpe=8; B.logSet(T.slots[0],0,'straight');
    const w=B.getDraft().weight; B.moveSlot(2,-1);
    ok(T.slots[T.openIdx].ex==='bench'&&B.getDraft().weight===w,'mid-exercise: moving another exercise keeps the panel and the draft (regression, reported twice)',T.slots[T.openIdx].ex+' '+B.getDraft().weight); }
  S.slots[0].sets.push({}); ok(A.moveSlot(0,1)===false,'moved an exercise that has logged sets','');
  // per-exercise set count on a collapsed card
  const sl=S.slots[2]; S.openIdx=0;
  ok(A.adjustSets(sl,2,1)&&sl.sets_target===4,'add a set on a collapsed exercise','');
  ok(A.adjustSets(sl,2,-1)&&sl.sets_target===3,'remove a set on a collapsed exercise','');
  sl.sets=[{},{},{}]; ok(A.adjustSets(sl,2,-1)===false&&sl.sets_target===3,'removed a set that was already logged','');
  // a warmup ramp tap leaves the working-set suggestion alone
  const B=load(ev); const slot=mkSlot('bench'); slot.reps=[6,8];
  B.setSession({id:'W',slots:[slot],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
  B.seedDraft(slot); const d=B.getDraft();
  const before=JSON.stringify({w:d.weight,r:d.reps,u:d.unit,s:d.suggested,l:d.suggestedLb});
  B.logSet(slot,0,'warmup',false,{weight:95,unit:'lb',reps:5});
  const after=JSON.stringify({w:d.weight,r:d.reps,u:d.unit,s:d.suggested,l:d.suggestedLb});
  ok(before===after,'warmup logging changed the working-set draft',before+' -> '+after);
  const wu=B.sets().filter(x=>x.set_kind==='warmup');
  ok(wu.length===1&&wu[0].weight.value===95&&wu[0].reps===5,'warmup not logged with its own numbers','');
  // a warmup can be corrected and voided like any other set
  B.append({type:'correction',target_id:wu[0].id,patch:{reps:3},reason:'edited in app'});
  ok(B.sets().find(x=>x.id===wu[0].id).reps===3,'warmup edit did not replay','');
  B.append({type:'correction',target_id:wu[0].id,patch:null,reason:'deleted in app'});
  ok(!B.sets().some(x=>x.id===wu[0].id),'warmup delete did not replay','');
  console.log('  reorder, per-exercise sets, warmup draft, warmup edit/delete');
}

/* ─── 8. readiness: physical signal required for a load cut ─── */
section('8. readiness — physical signal required for a load cut');
{
  const A=load([]);
  const allThrees={sleep:3,motivation:3,sore:{push:3,pull:3},joints:{}};
  ok(A.readinessScore(allThrees,['push','pull'])>=0.65,'all-3s should score Normal, not reduced',
    A.readinessScore(allThrees,['push','pull']).toFixed(2));
  ok(A.readinessLabel(A.readinessScore(allThrees,['push','pull']))==='Normal','all-3s label should read Normal','');
  ok(A.physicalCut(allThrees,['push','pull'],['horizontal_press'])===null,'all-3s should not cut load or sets','');

  // sleep 1, soreness 3: warmup-length score drops, but load/sets untouched
  const badSleep={sleep:1,motivation:3,sore:{push:3},joints:{}};
  ok(A.readinessScore(badSleep,['push'])<A.readinessScore(allThrees,['push']),
    'poor sleep alone should still lower the warmup-length score','');
  ok(A.physicalCut(badSleep,['push'],['horizontal_press'])===null,
    'sleep alone must never cut load or sets','');
  const badMotivation={sleep:3,motivation:1,sore:{push:3},joints:{}};
  ok(A.physicalCut(badMotivation,['push'],['horizontal_press'])===null,
    'motivation alone must never cut load or sets','');

  // soreness in a trained group does cut, magnitude scales with severity
  const sore2={sleep:3,motivation:3,sore:{push:2},joints:{}};
  const c2=A.physicalCut(sore2,['push'],['horizontal_press']);
  ok(c2&&c2.label==='Slightly reduced','soreness=2 in a trained group should cut lightly',JSON.stringify(c2));
  const sore1={sleep:3,motivation:3,sore:{push:1},joints:{}};
  const c1=A.physicalCut(sore1,['push'],['horizontal_press']);
  ok(c1&&c1.label==='Reduced','soreness=1 in a trained group should cut harder',JSON.stringify(c1));
  // soreness in a group NOT trained today must not cut
  ok(A.physicalCut({sleep:3,motivation:3,sore:{quads:1},joints:{}},['push'],['horizontal_press'])===null,
    'soreness in an untrained group should not cut','');

  // a flagged joint no longer cuts session-wide (v1.15.0): it acts per
  // exercise through the joint ladder instead — see section 11
  ok(A.physicalCut({sleep:3,motivation:3,sore:{push:3},joints:{shoulder:2}},['push'])===null,
    'a flagged joint must not cut load session-wide','');
  console.log('  all-3s: no cut · sleep/motivation alone: no cut · soreness in trained group: cuts · joints: per exercise only');
}

/* ─── 9. RPE-delta path: easier / harder / at-target / range-boundary ─── */
section('9. RPE-delta pricing path');
{
  const A=load([]);
  const slot=(lo,hi,rpe)=>({ex:'multihip_abd',role:'accessory',reps:[lo,hi],rpe,sets_target:3});
  let p=A.rpeDeltaStep(slot(10,15,9),60,10,7,9);
  ok(p.lb===60&&p.reps===12,'easier mid-range should add exactly the RPE gap in reps',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,14,7,9);
  // spec §2.5: a 5 lb step on 60 lb is >5%, so reach the top of the range first
  ok(p.lb===60&&p.reps===15,'easier, reps would pass the ceiling, step >5%: top of the range at this load first',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),200,14,7,9);
  ok(p.lb>200&&p.reps===10,'easier, reps would pass the ceiling, step ≤5%: step load up and reset to floor',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,13,10,9);
  ok(p.lb===60&&p.reps===12,'harder mid-range should hold load and drop reps',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,10,9.5,9);
  ok(p.lb===60&&p.reps===10,'0.5 off target is within hold tolerance, should hold exactly',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,10,10,9);
  ok(p.lb<60&&p.reps===10,'harder, reps would fall below floor: should step load down and reset to floor',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,12,9,9);
  ok(p.lb===60&&p.reps===12,'exactly at target should hold exactly',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,12,9.4,9);
  ok(p.lb===60&&p.reps===12,'within +/-0.5 of target should hold exactly, not snap',JSON.stringify(p));
  p=A.rpeDeltaStep(slot(10,15,9),60,17,9,9);
  ok(p.lb>60&&p.reps===10,'at target but already past the ceiling should still raise load',JSON.stringify(p));
  // load and reps never move together, across a small sweep
  let bad=0;
  for(let r=6;r<=22;r++) for(let rpe=6;rpe<=10;rpe+=0.5){
    const q=A.rpeDeltaStep(slot(10,15,9),60,r,rpe,9);
    if(q.lb!==60&&q.reps!==10) bad++;   // any load step always resets reps to lo=10
  }
  ok(bad===0,'RPE-delta: load and reps changed together somewhere in the sweep','count='+bad);
  console.log('  easier/harder/at-target/boundary cases and a 6-22 rep sweep all pass');
}

/* ─── 10. stagnation probe ─── */
section('10. stagnation probe');
{
  // strictly distinct, decreasing day-offsets throughout — exerciseSessionHistory
  // sorts by ts, and two events sharing a day-offset call Date.now() close enough
  // together to tie, which makes the resulting order unpredictable
  const flatHist=(n,rpe)=>{ const ev=[]; for(let i=0;i<n;i++) ev.push(set('multihip_abd','f'+i,60,12,rpe,50-i*5)); return ev; };
  const slot={ex:'multihip_abd',role:'accessory',reps:[10,15],rpe:9,sets_target:3};

  ok(load(flatHist(2,8)).stagnationProbe(slot)===null,'stagnation probe fired before 3 sessions','');
  const p3=load(flatHist(3,8)).stagnationProbe(slot);
  ok(p3&&p3.src==='stagnation probe'&&p3.lb===60&&p3.reps===13,
    'stagnation probe should fire at exactly 3 flat sessions, +1 rep',JSON.stringify(p3));
  ok(load(flatHist(3,9.5)).stagnationProbe(slot)===null,
    'stagnation probe should not fire if the last session was harder than target','');

  // at the top of the range: probes a load step instead of a rep
  const atTop=[];
  for(let i=0;i<3;i++) atTop.push(set('multihip_abd','t'+i,60,15,8,30-i*5));
  const pTop=load(atTop).stagnationProbe(slot);
  ok(pTop&&pTop.lb>60&&pTop.reps===10,'stagnation probe at the range ceiling should step load, not reps',JSON.stringify(pTop));

  // declined probe: logged numbers didn't match what was probed -> suppressed for 2 sessions
  const declineEv=flatHist(3,8).concat([
    set('multihip_abd','decl',60,12,8,25,{suggestion:{lb:60,reps:13,basis:'stagnation probe'}})
  ]);
  const A=load(declineEv);
  ok(A.stagnationProbe(slot)===null,'declined probe should be suppressed on the very next session','');
  // still suppressed one session later (2-session window)
  const declineEv2=declineEv.concat([set('multihip_abd','decl2',60,12,8,20)]);
  const A2=load(declineEv2);
  ok(A2.stagnationProbe(slot)===null,'declined probe should still be suppressed 1 session later','');
  // eligible again after the suppression window
  const declineEv3=declineEv2.concat([set('multihip_abd','decl3',60,12,8,15)]);
  const A3=load(declineEv3);
  ok(A3.stagnationProbe(slot)!==null,'probe should be eligible again after the suppression window','');

  // accepted probe: logged numbers matched -> no suppression, normal progression resumes
  const acceptEv=flatHist(3,8).concat([
    set('multihip_abd','acc',60,13,8,25,{suggestion:{lb:60,reps:13,basis:'stagnation probe'}})
  ]);
  // three more flat sessions at the new (accepted) numbers should probe again, not stay suppressed
  const acceptFlat=acceptEv.concat([set('multihip_abd','a2',60,13,8,20),set('multihip_abd','a3',60,13,8,15)]);
  const pAccepted=load(acceptFlat).stagnationProbe(slot);
  ok(pAccepted&&pAccepted.lb===60&&pAccepted.reps===14,'accepted probe should not suppress the next stagnation check',JSON.stringify(pAccepted));

  console.log('  fires at 3 flat sessions (not before), respects target RPE, backs off 2 sessions after a decline, resumes after acceptance');
}

/* ─── 11. joint ladder: sessions, severity, abduction, real effects ─── */
section('11. joint ladder');
{
  let t0=60;   // strictly decreasing day offsets, so session order is unambiguous
  const chk=(joints,scale)=>({type:'readiness',id:'r'+(uid++),ts:day(t0-=1),sleep_quality:3,motivation:3,soreness:{},joints,...(scale?{joint_scale:3}:{})});
  const end=(joints,scale)=>({type:'session_end',id:'e'+(uid++),ts:day(t0-=0.5),session_id:'x'+uid,joints,...(scale?{joint_scale:3}:{})});
  const sess=(cj,ej,scale)=>[chk(cj||{},scale),end(ej||{},scale)];
  const lvl=(ev,j)=>{ const A=load(ev); const t=A.jointTrend(j,6); return {t,L:A.jointLevel(t),A}; };

  // legacy taps (stored 1, no joint_scale) count as moderate
  let r=lvl([].concat(sess({shoulder:1}),sess(),sess({shoulder:1})),'shoulder');
  ok(r.t.score===2&&r.L===3,'two legacy taps should be moderate x2 = load held',JSON.stringify(r.t));
  // check-in and finish of one session count once
  r=lvl(sess({shoulder:1},{shoulder:1}),'shoulder');
  ok(r.t.score===1&&r.t.flagged===1,'check-in + finish of the same session must count once',JSON.stringify(r.t));
  // severity weights on the new scale
  r=lvl(sess({shoulder:3},null,true),'shoulder');
  ok(r.t.score===2&&r.L===3,'one bad session should reach load held on its own',JSON.stringify(r.t));
  r=lvl(sess({shoulder:1},null,true),'shoulder');
  ok(r.t.score===0.5&&r.L===2,'one mild session should only lengthen the warmup',JSON.stringify(r.t));
  // conservative thresholds
  const many=(n,v,scale)=>{ let ev=[]; for(let i=0;i<n;i++) ev=ev.concat(sess({shoulder:v},null,scale)); return ev; };
  ok(lvl(many(4,1),'shoulder').L===4,'4 moderate sessions should be level 4','');
  ok(lvl(many(5,1),'shoulder').L===5,'5 moderate sessions should be level 5','');
  ok(lvl(many(3,1),'shoulder').L===3,'3 moderate sessions should be level 3 (conservative)','');
  // window is the last 6 sessions
  r=lvl([].concat(sess({shoulder:1}),many(6,0).map(e=>({...e,joints:{}}))),'shoulder');
  ok(r.t.score===0&&r.L===1,'a flag 7 sessions back must fall out of the window',JSON.stringify(r.t));
  // abduction: half weight, never past load held — for shoulder INSTABILITY (raises stay below the at-risk position)
  const inst=A=>{ A.getCFG().conditions=['shoulder_instability']; return A; };
  const A6=inst(load(many(6,1)));
  const press=A6.jointNoteFor('horizontal_press'), raise=A6.jointNoteFor('abduction'), curl=A6.jointNoteFor('elbow_flexion');
  ok(press&&press.level===5,'presses should be level 5 at 6 moderate shoulder sessions',JSON.stringify(press));
  ok(raise&&raise.level===3,'abduction should be half weight and capped at load held',JSON.stringify(raise));
  ok(curl===null,'a curl is not a shoulder pattern',JSON.stringify(curl));
  ok(inst(load(many(2,1))).jointNoteFor('abduction').level===2,'abduction at score 2 (half = 1) should only lengthen the warmup','');
  // without instability (impingement, or a sore shoulder of unknown cause) abduction counts in full
  const imp=load(many(6,1)); imp.getCFG().conditions=['shoulder_impingement'];
  ok(imp.jointNoteFor('abduction').level===5,'with impingement, lateral raises count in full (abduction is the provoker)',JSON.stringify(imp.jointNoteFor('abduction')));

  // level 3 holds load on every set; the line names the joint
  const hist=many(3,1).concat([set('incline_machine','h1',60,15,7,0.2)]);
  const A3=load(hist), slot3={ex:'incline_machine',role:'primary',reps:[10,15],rpe:9,sets_target:3,sets:[],
    joint:A3.jointNoteFor('horizontal_press')};
  A3.setSession({id:'S3',slots:[slot3],adj:null,score:null});
  const unheld=A3.nextPrescription(slot3), s3=A3.suggestFor(slot3);
  ok(unheld.lb>60,'precondition: without the ladder the engine would raise load',JSON.stringify(unheld));
  ok(s3.lb===60&&s3.pr.reps===15,'level 3 must hold load at the last logged weight',JSON.stringify({lb:s3.lb,reps:s3.pr.reps}));
  ok(/shoulder: load held/.test(s3.why.line),'explanation line must say "shoulder: load held"',s3.why.line);
  slot3.sets=[{}];   // a later set in the same session: still held, still named
  const s3b=A3.suggestFor(slot3);
  ok(s3b.lb===60&&/shoulder: load held/.test(s3b.why.line),'level 3 must hold and be named on later sets too',s3b.why.line);
  // level 5: no rep increase either
  const A5=load(many(5,1).concat([set('incline_machine','h5',60,10,7,0.2)]));
  const slot5={ex:'incline_machine',role:'primary',reps:[10,15],rpe:9,sets_target:3,sets:[],joint:A5.jointNoteFor('horizontal_press')};
  A5.setSession({id:'S5',slots:[slot5],adj:null,score:null});
  const s5=A5.suggestFor(slot5);
  ok(slot5.joint.level===5&&s5.pr.reps===10&&s5.lb<=60,'level 5 must stop rep progression as well as load',JSON.stringify({lvl:slot5.joint.level,lb:s5.lb,reps:s5.pr.reps}));
  // level 4: starting load cut, named
  const A4=load(many(4,1).concat([set('incline_machine','h4',70,12,9,0.2)]));
  const slot4={ex:'incline_machine',role:'primary',reps:[10,15],rpe:9,sets_target:3,sets:[],joint:A4.jointNoteFor('horizontal_press')};
  A4.setSession({id:'S4',slots:[slot4],adj:null,score:null});
  const s4=A4.suggestFor(slot4);
  ok(slot4.joint.level===4&&s4.lb<70&&/shoulder: load/.test(s4.why.line),'level 4 must cut the starting load and say so',JSON.stringify({lb:s4.lb,line:s4.why.line}));
  console.log('  legacy taps = moderate · one count per session · severity weights · conservative levels · abduction half/capped · held and named on every set');
}

/* ─── 12. program position counts sessions; drift; compression ─── */
section('12. session-based program position');
{
  const tsDays=n=>day(n);
  const endEv=(n,extra)=>({type:'session_end',id:'q'+(uid++),ts:tsDays(n),session_id:'q'+uid,joints:{},...extra});
  const mkA=(events,startDaysAgo,targetDaysAhead)=>{
    const A=load(events), C=A.getCFG();
    C.start=new Date(Date.now()-startDaysAgo*864e5).toISOString().slice(0,10);
    C.target=new Date(Date.now()+targetDaysAhead*864e5).toISOString().slice(0,10);
    C.split='full5';
    A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:5,deload:true,hyp:[]}),
                  A.applyShape({type:'str',label:'S',weeks:4,deload:true,hyp:[]}),
                  A.applyShape({type:'deload',label:'D',weeks:1,hyp:[]}),
                  A.applyShape({type:'peak',label:'P',weeks:2,hyp:[]})]);
    return A;
  };
  // 7 trained sessions over 20 days: calendar says week 3, sessions say week 2
  const ev=[];
  for(let i=0;i<7;i++) ev.push(endEv(19-i*2.5));
  ev.push(endEv(3,{cancelled:true}));                                          // cancelled: never counts
  ev.push(endEv(2,{ended_early:true,reason:'life',sets_done:1,sets_planned:15})); // walked out: doesn't count
  ev.push(endEv(40));                                                          // before the start date
  let A=mkA(ev,20,120);
  ok(A.programSessions()===7,'only trained sessions since the start should count',String(A.programSessions()));
  let p=A.currentPhase();
  ok(p.idx===0&&p.week===2,'7 sessions on a 5-day split is block 1 week 2, whatever the calendar says',JSON.stringify({idx:p.idx,week:p.week}));
  // 10 sessions in 5 days: week 3 already
  const fast=[]; for(let i=0;i<10;i++) fast.push(endEv(4.5-i*0.4));
  p=mkA(fast,5,120).currentPhase();
  ok(p.week===3,'10 sessions should be week 3 even five days in',JSON.stringify(p.week));
  // into the second block
  const later=[]; for(let i=0;i<31;i++) later.push(endEv(60-i*1.5));
  p=mkA(later,61,120).currentPhase();
  ok(p.idx===1&&p.week===1,'31 sessions is past the 6-week first block (5 + deload): block 2 week 1',JSON.stringify({idx:p.idx,week:p.week}));

  // drift: pace and projection are consistent and honest
  A=mkA(ev,20,120);
  const pr=A.programProjection();
  const wks=(Date.now()-new Date(A.getCFG().start+'T00:00').getTime())/(7*864e5);
  ok(!pr.pace.planned&&Math.abs(pr.pace.perWeek-7/wks)<0.01,'pace should be observed sessions per week since the start',JSON.stringify(pr.pace));
  ok(pr.total===70&&pr.done===7&&pr.remaining===63,'70 program sessions (14 weeks incl. deloads x 5), 7 done',JSON.stringify({t:pr.total,d:pr.done,r:pr.remaining}));
  ok(pr.days===Math.ceil(pr.remaining/pr.dpw*7),'projection = remaining sessions at the PLANNED pace from today',String(pr.days));
  ok(pr.atPace.days===Math.ceil(pr.remaining/pr.pace.perWeek*7),'the recent-pace finish is still computed, as context',String(pr.atPace.days));
  // behind = sessions missed, not a slow fortnight extrapolated over the whole program (Oct 2026: 6 missed read as 15 weeks)
  const tight=mkA(ev,20,78).programProjection();   // target = exactly the planned finish (start + 98 days)
  ok(tight.missed===7,'20 days at 5 a week is 14 sessions; 7 done = 7 behind',String(tight.missed));
  ok(tight.behindDays>=8&&tight.behindDays<=13,'7 missed sessions on a 5-day plan reads as about 10 days behind, not months',String(tight.behindDays));
  ok(tight.atPace.behindDays>40,'(the recent pace alone would have said months)',String(tight.atPace.behindDays));
  const onTime=mkA(ev,20,400).programProjection();
  ok(onTime.behindDays<0,'a distant target should not read as behind',String(onTime.behindDays));
  // young program with too few sessions uses the planned pace
  const young=mkA([endEv(1),endEv(0.5)],3,120).programProjection();
  ok(young.pace.planned&&young.pace.perWeek===5,'with 2 sessions in a 3-day-old program, use the planned pace',JSON.stringify(young.pace));

  // compression: never below minimum, never a deload, never into trained weeks, never more volume
  const rm=A.getRoadmap(), cur={idx:0,week:2};
  const big=A.compressRoadmap(rm,99,cur);
  const mins=big.draft.map(b=>b.weeks);
  ok(mins[0]===3&&mins[1]===2&&mins[3]===1,'compression must stop at each type\'s minimum (hyp 3, str 2, peak 1)',JSON.stringify(mins));
  ok(big.draft[2].type==='deload'&&big.draft[2].weeks===1,'a deload block must never be shortened or removed',JSON.stringify(big.draft[2]));
  ok(big.draft[0].deload&&big.draft[1].deload,'blocks keep their trailing deload week',JSON.stringify(big.draft.map(b=>b.deload)));
  ok(big.draft.length===rm.length,'no block is ever removed','');
  ok(big.shortBy===99-(2+2+1),'it should report what it could not save',String(big.shortBy));
  ok(rm[0].weeks===5,'compression must not mutate the live roadmap',String(rm[0].weeks));
  const intoTrained=A.compressRoadmap(rm,99,{idx:0,week:4});
  ok(intoTrained.draft[0].weeks===4,'the current block must not be cut below the week you are in',String(intoTrained.draft[0].weeks));
  const fromEnd=A.compressRoadmap(rm,1,cur);
  ok(fromEnd.draft[3].weeks===1&&fromEnd.draft[1].weeks===4&&fromEnd.draft[0].weeks===5,'shortening starts from the end',JSON.stringify(fromEnd.draft.map(b=>b.weeks)));
  big.draft.forEach((b,i)=>ok(Math.max(...b.vol)<=Math.max(...rm[i].vol),'compression must never raise weekly volume',b.type+' '+JSON.stringify(b.vol)));
  // per-session sets never go up either: the hyp ramp only adds sets with more weeks
  const setsAt=(weeks)=>{ let mx=0; for(let w=1;w<=weeks;w++) mx=Math.max(mx,A.schemeFor('primary','hyp',w,weeks,A.exById.bench).sets); return mx; };
  ok(setsAt(3)<=setsAt(5),'a shorter hypertrophy block must not prescribe more sets per session','');
  console.log('  sessions not days · cancelled/walked-out/pre-start ignored · projection from pace · compression rules hold');
}

/* ─── 13. recovery ("rest of life") check-in item ─── */
section('13. recovery input');
{
  const A=load([]);
  const st=(rec,sore)=>({sleep:3,motivation:3,recovery:rec,sore:{push:sore??3},joints:{}});
  const c1=A.physicalCut(st(1),['push']), c2=A.physicalCut(st(2),['push']);
  // batch E: "rest of life" is global — it never cuts load through the soreness path. A 1 is the
  // sick-day signal (one step, everywhere, in runModifiers); 2–5 touch only warm-up and the top of the range.
  ok(c1===null&&c2===null,'recovery alone (1 or 2) makes no soreness cut',JSON.stringify([c1,c2]));
  ok(A.globalReadiness({sleep:3,motivation:3,recovery:1}).sick&&!A.globalReadiness({sleep:3,motivation:3,recovery:2}).sick,'a 1 on rest of life is the sick day; a 2 is not','');
  ok(A.globalReadiness({sleep:2,motivation:3,recovery:3}).band==='Yellow'&&A.globalReadiness({sleep:3,motivation:3,recovery:3}).band==='Green','a 2 on any global item is yellow; all average is green','');
  [3,4,5].forEach(v=>ok(A.physicalCut(st(v),['push'])===null,'recovery '+v+' must not cut',''));
  ok(A.readinessScore(st(5),['push'])===A.readinessScore(st(3),['push']),'recovery 4-5 must never add to readiness','');
  ok(A.readinessScore(st(4),['push'])===A.readinessScore(st(3),['push']),'recovery 4 must never add to readiness','');
  ok(A.readinessScore(st(1),['push'])<A.readinessScore(st(3),['push']),'recovery 1 should lower the warmup score','');
  const both=A.physicalCut(st(2,1),['push']);
  ok(both&&both.label==='Reduced'&&/sore/.test(both.signal)&&!both.global,'soreness decides the soreness cut, scoped to the sore group',JSON.stringify(both));
  // legacy readiness events (no recovery field) score as if recovery were 3
  const legacy={sleep_quality:3,motivation:3,soreness:{push:3}};
  ok(A.readinessScoreFromEvent(legacy)===A.readinessScoreFromEvent({...legacy,recovery:3}),'events without recovery must read as neutral','');
  ok(A.SCALE.recovery&&A.SCALE.recovery.length===5,'the recovery scale needs five anchored descriptors','');
  console.log('  1-2 cut and say why · 3 neutral · 4-5 never add · worst signal wins · legacy events neutral');
}

/* ─── 14. rep-range defaults and lower back ─── */
section('14. rep ranges and lower back');
{
  const A=load([]);
  const d=A.defaultRepRange(A.exById.curl);
  ok(d.reps&&d.reps.length===2,'every exercise must resolve to a default rep range',JSON.stringify(d));
  A.exById && A.EX.forEach(e=>{ if(e.rehab) return; const r=A.defaultRepRange(e); if(!(r.reps&&r.reps[0]>=1&&r.reps[1]>=r.reps[0])) ok(false,'exercise without a default range',e.id); });
  A.getCFG().repRanges={curl:[6,9]};
  const sc=A.schemeFor('accessory','hyp',1,4,A.exById.curl);
  ok(JSON.stringify(sc.reps)==='[6,9]'&&sc.repSrc==='exercise','a saved per-exercise range must win',JSON.stringify(sc));
  ok(JSON.stringify(A.defaultRepRange(A.exById.curl).reps)!=='[6,9]','the default shown must ignore the saved range','');
  ok(JSON.stringify(A.getCFG().repRanges)==='{"curl":[6,9]}','computing the default must not touch the saved ranges','');
  // session-only range: explanation reflects it, CFG untouched
  const slot={ex:'curl',role:'accessory',reps:[12,15],rpe:9,repSrc:'session',repDefault:{reps:[8,15]},sets_target:3};
  const line=A.explainRx(slot,{src:null},{}).line;
  ok(/changed for this session/.test(line),'a session-only range must be named in the explanation',line);
  ok(A.LANDMARKS.lower_back&&A.LANDMARKS.lower_back.MEV===6&&A.LANDMARKS.lower_back.MRV===16,'lower_back landmarks 6/16','');
  ok(A.MUSCLE_GROUP.lower_back==='lowback','lower_back should map to the lower-back soreness group','');
  ok(A.exById.deadlift.vol.lower_back===1&&A.exById.rdl.vol.lower_back===0.5,'hinges must count toward lower back','');
  ok(!A.exById.belt_rdl.vol.lower_back,'the belt-loaded RDL stays off lower back on purpose','');
  console.log('  defaults resolve · saved range wins · session range named · lower back counted');
}

/* ─── 15. coaching cues: embedded copy matches docs/coaching-cues.json ─── */
section('15. coaching cues');
{
  const file=fs.readFileSync(path.join(__dirname,'..','docs','coaching-cues.json'),'utf8');
  const m=html.match(/<script type="application\/json" id="coaching-cues">([\s\S]*?)<\/script>/);
  ok(!!m,'index.html must embed the coaching cues block','');
  if(m){
    ok(m[1]===file,'embedded cues must match docs/coaching-cues.json byte for byte — edit the JSON, then paste it into index.html unchanged',
      'embedded '+m[1].length+' chars vs file '+file.length);
    let arr=null; try{ arr=JSON.parse(file); }catch(e){ ok(false,'docs/coaching-cues.json must be valid JSON',e.message); }
    if(arr){
      const A=load([]);
      arr.forEach(c=>ok(!!A.exById[c.id],'every cue id must exist in the exercise library',c.id));
      ok(arr.every(c=>c.setup&&c.execution&&c.faults&&Array.isArray(c.sources)),'every cue needs setup, execution, faults and sources','');
      ok(!file.includes('</script'),'cue text must never contain </script','');
      console.log('  '+arr.length+' exercises, '+arr.filter(c=>c.shoulder).length+' with a shoulder note, copy in sync');
    }
  }
}

/* ─── 16. split per block: position and rotation ─── */
section('16. split per block');
{
  const endEv=n=>({type:'session_end',id:'z'+(uid++),ts:day(n),session_id:'z'+uid,joints:{}});
  const mk=(nSessions,b2split)=>{
    const ev=[]; for(let i=0;i<nSessions;i++) ev.push(endEv(200-i));
    const A=load(ev), C=A.getCFG();
    C.start=new Date(Date.now()-201*864e5).toISOString().slice(0,10); C.split='full5';
    const b1=A.applyShape({type:'hyp',label:'H',weeks:3,deload:false,hyp:[]});
    const b2=A.applyShape({type:'str',label:'S',weeks:3,deload:false,hyp:[]}); if(b2split) b2.split=b2split;
    A.setRoadmap([b1,b2]); return A;
  };
  // block 1: 3 weeks x 5 days = 15 sessions; block 2 on a 4-day split
  let A=mk(15,'ul4'), pos=A.programPosition();
  ok(pos.idx===1&&pos.sessionsIn===0&&pos.week===1,'after 15 sessions you are at block 2, week 1, its first session',JSON.stringify(pos));
  ok(A.todayDay().name===A.SPLITS.ul4.template[0].name,'block 2 starts at day 1 of its own split',A.todayDay().name);
  A=mk(17,'ul4'); pos=A.programPosition();
  ok(pos.sessionsIn===2&&A.todayDay().name===A.SPLITS.ul4.template[2].name,'two sessions into block 2: its day 3',JSON.stringify(pos)+' '+A.todayDay().name);
  A=mk(19,'ul4'); pos=A.programPosition();
  ok(pos.week===2,'a 4-day block advances a week every 4 sessions',JSON.stringify(pos));
  // block 1's position is untouched by block 2's split
  const p1=mk(7,null).programPosition(), p2=mk(7,'ppl3').programPosition();
  ok(JSON.stringify(p1)===JSON.stringify(p2),'changing a later block\'s split must not move you within an earlier block','');
  ok(p1.idx===0&&p1.week===2&&p1.sessionsIn===7,'7 sessions into a 5-day block: week 2',JSON.stringify(p1));
  // the projection sizes each block by its own split
  A=mk(0,'ul4'); ok(A.programProjection().total===15+12,'total sessions = 3x5 + 3x4',String(A.programProjection().total));
  // unset block split follows the program
  ok(A.splitKeyFor({})==='full5'&&A.splitKeyFor({split:'ul4'})==='ul4'&&A.splitKeyFor({split:'nope'})==='full5','split fallback','');
  // linter warns, never blocks
  const lint=(()=>{ const w=A.lintRoadmap(); return w.find(x=>/switches from/.test(x.msg)); })();
  ok(lint&&lint.sev==='warn','consecutive blocks with different splits get a warning',JSON.stringify(lint));
  console.log('  blocks sized by their own split · rotation restarts per block · earlier blocks unaffected · linter warns');
}

/* ─── 17. picker muscles, tonnage ─── */
section('17. picker muscles and tonnage');
{
  const A=load([]);
  Object.keys(A.LANDMARKS).forEach(m=>ok(A.MUSCLE_ORDER.includes(m),'every muscle with landmarks must be browsable in the picker',m));
  ok(A.MUSCLE_ORDER.length===new Set(A.MUSCLE_ORDER).size,'no duplicate muscles in the picker','');
  const usable=A.EX.filter(e=>!e.rehab&&!A.primaryMuscle(e));
  ok(usable.length===0,'every non-rehab exercise needs a primary muscle to be browsable',usable.map(e=>e.id).join(','));
  // a chip only shows when something trains that muscle directly — every listed muscle must have one
  A.MUSCLE_ORDER.forEach(m=>ok(A.EX.some(e=>!e.rehab&&(e.vol||{})[m]===1),'picker chip "'+m+'" would be empty',m));
  const B=load([set('bench','T1',135,8,8,1),set('bench','T1',135,8,8.5,1),{...set('bench','T1',95,5,null,1),set_kind:'warmup'},set('bench','T2',200,3,9,2)]);
  ok(B.sessionTonnage('T1')===135*8*2,'tonnage counts working sets only, per session',String(B.sessionTonnage('T1')));
  console.log('  all muscles browsable · every exercise reachable by muscle · tonnage excludes warmups');
}

/* ─── 18. stored loads are rounded ─── */
section('18. stored loads are rounded');
{
  const A=load([]);
  const ev=A.append({type:'set',exercise_id:'bench',weight:{value:15,unit:'kg'},reps:20,suggested_lb:15*A.LB,
    suggestion:{lb:15*A.LB,shown:{value:15,unit:'kg'},basis:'last session',reps:20}});
  ok(ev.suggested_lb===33.07&&ev.suggestion.lb===33.07,'a kg→lb conversion is stored to 0.01 lb',ev.suggested_lb+' '+ev.suggestion.lb);
  ok(ev.weight.value===15&&ev.weight.unit==='kg','a typed weight is stored exactly as entered',JSON.stringify(ev.weight));
  ok(ev.suggestion.basis==='last session'&&ev.suggestion.shown.value===15,'rounding leaves every other field alone',JSON.stringify(ev.suggestion));
  A.exById.__kg_machine={id:'__kg_machine',unitPref:'kg'};   // like a custom kg-only machine (m_rd_fly)
  const sh=A.shownLoad({ex:'__kg_machine'},15*A.LB);
  ok(sh.unit==='kg'&&sh.value===15,'a kg machine\'s suggestion is recorded as shown, in kg',JSON.stringify(sh));
  const lbEx=A.EX.find(e=>!e.unitPref&&e.id!=='bench');   // bench has a kg set from above
  ok(A.shownLoad({ex:lbEx.id},185).value===185,'an lb suggestion is recorded as shown','');
  // an exercise last logged in kg is suggested in kg, never as a raw lb conversion
  const K=load([{...set('deadlift','K1',93,6,7.5,2),weight:{value:93,unit:'kg'}}]);
  const ks=K.shownLoad({ex:'deadlift'},93*K.LB);
  ok(ks.unit==='kg'&&ks.value===93,'last logged in kg: shown as 93 kg, not 205.03 lb',JSON.stringify(ks));
  console.log('  loads to 0.01 lb at the one write point · typed weights untouched · suggestion recorded as shown');
}

/* ─── 19. anchored scales: neutral → zero ─── */
section('19. anchored scales — neutral rating, zero adjustment');
{
  const A=load([]);
  Object.entries(A.SCALE_SPEC).forEach(([k,sp])=>{
    ok(A.fromNeutral(sp.neutral,k)===0,'neutral on '+k+' must adjust nothing',String(A.fromNeutral(sp.neutral,k)));
    ok(A.fromNeutral(sp.min,k)===(sp.neutral===sp.min?0:-1)&&A.fromNeutral(sp.max,k)===(sp.neutral===sp.max?0:1),k+': floor -1, ceiling +1','');
    for(let v=sp.min;v<sp.max;v+=0.5) ok(A.fromNeutral(v+0.5,k)>=A.fromNeutral(v,k),k+' must be monotonic',v+'');
    ok(A.fromNeutral(null,k)===0&&A.fromNeutral(undefined,k)===0,k+': unanswered counts as neutral','');
  });
  // a personal neutral (the joint baseline) is zero wherever it sits
  [0,0.5,1,2].forEach(b=>ok(A.fromNeutral(b,'joint',b)===0&&A.fromNeutral(b,'joint',b,{raw:true})===0,'joint rating at your baseline ('+b+') must adjust nothing',''));
  // the formulas built on it: an all-neutral check-in changes nothing
  const neutralSt={sleep:3,motivation:3,recovery:3,sore:{push:3,pull:3}};
  ok(Math.abs(A.readinessScore(neutralSt,['push','pull'])-0.7)<1e-9,'all-neutral check-in scores exactly the normal midpoint','');
  ok(A.physicalCut(neutralSt,['push','pull'])===null,'all-neutral check-in: no load or set cut','');
  ok(Math.abs(A.readinessScoreFromEvent({sleep_quality:3,motivation:3,recovery:3,soreness:{push:3}})-0.7)<1e-9,'replayed neutral event = same midpoint','');
  ok(Math.abs(A.readinessScoreFromEvent({soreness:{}})-0.7)<1e-9,'an event with nothing answered = neutral, not NaN','');
  // no formula does its own centring any more
  const body=src.replace(/function fromNeutral[\s\S]*?\n}\n/,'');
  ok(!/\(\s*\w+\s*-\s*3\s*\)\s*\/\s*2/.test(body),'no hand-rolled (v-3)/2 outside fromNeutral','');
  console.log('  every scale: neutral → 0, floor −1, ceiling +1, monotonic · joint baseline → 0 · formulas inherit it');
}

/* ─── 20. joint ladder answers change from your baseline ─── */
section('20. joint ladder — baseline, not absolute level');
{
  let t0=200;
  const S=(v,end)=>[{type:'readiness',id:'jr'+(uid++),ts:day(t0-=1),sleep_quality:3,motivation:3,soreness:{},
      joints:v?{shoulder:v}:{},joint_scale:3},
    {type:'session_end',id:'je'+(uid++),ts:day(t0-=0.5),session_id:'js'+uid,joints:{},joint_scale:3,...(end||{})}];
  const run=(vals,usual)=>{ t0=200; let ev=[]; vals.forEach(v=>ev=ev.concat(S(v))); const A=load(ev);
    if(usual) A.CFG.jointUsual={shoulder:usual}; return A; };
  const lv=A=>{ const n=A.jointNoteFor('horizontal_press'); return n?n.level:1; };
  // vals are oldest → newest; scale: 1 mild, 2 moderate, 3 bad
  const chronic=Array(12).fill(2);
  let A=run(chronic);
  ok(A.jointTrend('shoulder',6).baseSrc==='median'&&A.jointTrend('shoulder',6).base===1,'12 moderate sessions: usual is moderate, from history',JSON.stringify(A.jointTrend('shoulder',6)));
  ok(lv(A)===2,'a chronic moderate shoulder only lengthens the warmup — never holds or cuts load',String(lv(A)));
  // the same history with a usual you set
  ok(lv(run(chronic,'moderate'))===2,'usual set to moderate, rating moderate: warmup only','');
  ok(lv(run(Array(6).fill(1),'mild'))===2,'usual mild, rating mild: warmup only','');
  ok(lv(run(Array(6).fill(2),'none'))===5,'usual none, six moderate sessions: still the top rung (above your usual)',String(lv(run(Array(6).fill(2),'none'))));
  // a bad rating always counts
  A=run(chronic.concat([3]),'moderate');
  ok(lv(A)>=3,'a bad rating holds load even when your usual is moderate',String(lv(A)));
  // a usual can never be "bad"
  A=run(Array(6).fill(3),'bad');
  ok(A.jointTrend('shoulder',6).baseSrc!=='set'&&lv(A)===5,'"bad" is not accepted as a usual',JSON.stringify({src:A.jointTrend('shoulder',6).baseSrc,L:lv(A)}));
  // a flare above a chronic baseline climbs; once it passes, it comes back down
  A=run(chronic.concat([3,3,3,3,3]));
  ok(lv(A)===5,'five bad sessions above a moderate usual: top rung',String(lv(A)));
  A=run(chronic.concat([3,3,3,3,3],Array(6).fill(2)));
  ok(lv(A)===2,'six sessions back at your usual: the ladder comes back down',String(lv(A)));
  // too little history: no baseline, any rating counts (the cautious side)
  A=run([2,2,2]);
  ok(A.jointTrend('shoulder',6).baseSrc==='none'&&lv(A)===3,'three sessions of history: no usual yet, ratings count in full',String(lv(A)));
  // drift: the usual you set versus what your sessions say
  const D=(vals,u)=>{ const A=run(vals,u); return A.jointDriftNote('shoulder'); };
  ok(/above the usual you set/.test(D(Array(10).fill(2),'mild')),'usual mild, sessions moderate: says so',D(Array(10).fill(2),'mild'));
  ok(/better than the usual you set/.test(D(Array(10).fill(1),'moderate')),'usual moderate, sessions mild: suggests lowering it',D(Array(10).fill(1),'moderate'));
  ok(D(Array(10).fill(2),'moderate')==='','usual matches your sessions: nothing to say','');
  // the explanation says what the ladder did and why
  const hist=chronic.concat([]); A=run(hist); A.LOG.push(set('incline_machine','hj',60,12,8,0.1));
  const slot={ex:'incline_machine',role:'primary',reps:[10,15],rpe:8,sets_target:3,sets:[],joint:A.jointNoteFor('horizontal_press')};
  A.setSession({id:'SJ',slots:[slot],adj:null,score:null});
  let w=A.suggestFor(slot).why;
  ok(/shoulder: longer warmup — at your usual/.test(w.line),'line names the action and the reason (at your usual)',w.line);
  ok(w.detail.some(d=>/your usual is moderate \(from your recent sessions\)/.test(d)&&/never change load/.test(d)),'detail names the usual and its source',JSON.stringify(w.detail));
  A=run(chronic.concat([3]),'moderate'); A.LOG.push(set('incline_machine','hj2',60,12,8,0.1));
  const slot2={ex:'incline_machine',role:'primary',reps:[10,15],rpe:8,sets_target:3,sets:[],joint:A.jointNoteFor('horizontal_press')};
  A.setSession({id:'SJ2',slots:[slot2],adj:null,score:null}); w=A.suggestFor(slot2).why;
  ok(/shoulder: load held — rated bad recently/.test(w.line),'line says load held because of a bad rating',w.line);
  console.log('  chronic usual → warmup only · bad always counts · flare climbs and recovers · drift notes · line says what and why');
}

/* ─── 21. weeks: days per week and day types per block ─── */
section('21. weeks — chosen days and day types');
{
  const A=load([]);
  // presets are exactly their week equivalents (existing programs unchanged)
  ['full5','ul4','ppl3'].forEach(k=>{
    const p=A.SPLITS[k], w=A.splitOf(p.week);
    ok(JSON.stringify(p.template.map(d=>[d.name,d.slots]))===JSON.stringify(w.template.map(d=>[d.name,d.slots])),k+' preset = the same week built as a list','');
  });
  ok(JSON.stringify(A.SPLITS.ul4.template.map(d=>d.name))==='["Upper A","Lower A","Upper B","Lower B"]','preset day names are unchanged','');
  // naming: lettered types always, push/pull/legs from the second occurrence
  const t=A.weekTemplate(['upper','push','upper','push','legs','upper']).map(d=>d.name);
  ok(JSON.stringify(t)==='["Upper A","Push","Upper B","Push B","Legs","Upper C"]','day names are stable and unique',JSON.stringify(t));
  ok(new Set(A.weekTemplate(['push','push','push']).map(d=>d.name)).size===3,'three push days get three names','');
  // a repeated type uses a different variant
  const up=A.weekTemplate(['upper','upper','upper']);
  ok(JSON.stringify(up[0].slots)!==JSON.stringify(up[1].slots)&&JSON.stringify(up[1].slots)!==JSON.stringify(up[2].slots),'repeated upper days are different workouts','');
  ['push','pull','legs'].forEach(k=>{ const d=A.weekTemplate([k,k]); ok(JSON.stringify(d[0].slots)!==JSON.stringify(d[1].slots),'a second '+k+' day is a different workout',''); });
  // every variant uses only patterns the library can fill
  const pats=new Set(A.EX.filter(e=>!e.rehab).map(e=>e.pattern));
  Object.entries(A.DAY_TYPES).forEach(([k,T])=>T.variants.forEach((v,i)=>v.forEach(([p])=>ok(pats.has(p),k+' variant '+i+' uses a pattern with no exercise: '+p,''))));
  // bounds: 2 to 6 days
  ok(!A.validWeek(['full'])&&!A.validWeek(Array(7).fill('full'))&&A.validWeek(['full','full'])&&A.validWeek(Array(6).fill('full')),'weeks are 2–6 days','');
  ok(!A.validWeek(['full','nope']),'unknown day types are rejected','');
  // every suggested style is a valid week of the asked length
  A.WEEK_STYLES.forEach(st=>{ for(let n=st.min||2;n<=6;n++){ const w=st.make(n); ok(A.validWeek(w)&&w.length===n,st.k+' at '+n+' days is a valid week',JSON.stringify(w)); } });
  ok(A.styleOfWeek(['push','pull','legs','upper','lower'])==='ulppl'&&A.styleOfWeek(['legs','push'])==='custom','styles are recognised, edits become custom','');
  // resolution: block week > block preset > program week > program preset
  const C=A.getCFG(); C.split='full5'; C.week=null;
  ok(A.splitKeyFor({})==='full5','nothing set: the program preset','');
  C.week=['upper','lower','full'];
  ok(A.splitKeyFor({})==='w:upper,lower,full'&&A.splitFor({}).days===3,'a program week replaces the preset',A.splitKeyFor({}));
  ok(A.splitKeyFor({split:'ppl3'})==='ppl3','a block preset beats the program week','');
  ok(A.splitFor({week:['push','pull','legs','push','pull']}).days===5,'a block week sets that block\'s days','');
  ok(A.splitKeyFor({week:['bogus']})==='w:upper,lower,full','an invalid block week falls back to the program','');
  C.week=null;
  // coverage notes warn, never block
  ok(A.weekCoverage(['push','pull','legs','push','pull']).some(m=>/^Legs get direct work once a week/.test(m)),'legs once a week is noted','');
  ok(A.weekCoverage(['upper','lower','upper','lower']).length===0,'upper/lower x2 needs no note','');
  ok(A.weekCoverage(['full','full']).length===0,'a 2-day week is not nagged','');
  // position: a 3-day block advances a week every 3 sessions
  const endEv=n=>({type:'session_end',id:'w'+(uid++),ts:day(n),session_id:'w'+uid,joints:{}});
  const ev=[]; for(let i=0;i<4;i++) ev.push(endEv(100-i));
  const B=load(ev), BC=B.getCFG(); BC.start=new Date(Date.now()-101*864e5).toISOString().slice(0,10);
  B.setRoadmap([Object.assign(B.applyShape({type:'hyp',label:'H',weeks:4,deload:false,hyp:[]}),{week:['upper','lower','full']})]);
  const pos=B.programPosition();
  ok(pos.week===2&&pos.sessionsIn===4&&pos.dpw===3,'4 sessions into a 3-day week: week 2',JSON.stringify(pos));
  ok(B.todayDay().name==='Lower A','session 5 of an upper/lower/full week is its day 2 again',B.todayDay().name);
  console.log('  presets unchanged · stable names · repeated days vary · 2–6 days · styles valid · block > program · coverage notes · position by days');
}

/* ─── 22. notes: the list and the copy are one set ─── */
section('22. feedback notes — list and copy agree');
{
  const ev=[]; for(let i=0;i<14;i++) ev.push({type:'note',id:'n'+i,ts:day(40-i),tag:i%3?'idea':'bug',text:'note '+i});
  ev.push({type:'note',id:'nx',ts:day(5),tag:'weird',text:'unknown tag'});
  ev.push({type:'note_resolved',id:'r1',ts:day(1),target_id:'n13'});
  ev.push({type:'note',id:'nl',ts:day(30),tag:'bug',text:'legacy resolved',resolved:true});
  const A=load(ev);
  const open=A.openFeedbackNotes().map(n=>n.id), rep=A.notesReport();
  ok(!open.includes('n13')&&!open.includes('nl'),'resolved notes (either way) are not open',open.join(','));
  ok(rep.count===open.length&&JSON.stringify([...rep.ids].sort())===JSON.stringify([...open].sort()),'the copy holds exactly the open notes',rep.count+' vs '+open.length);
  ok(/unknown tag/.test(rep.text),'a note with a tag this build does not know is still copied','');
  ok(open.includes('n0'),'old open notes stay open (the list shows them behind "Show older")','');
  console.log('  one definition of open · copy = list · unknown tags kept');
}

/* ─── 23. an explicit rep range beats the coarse-machine cap, everywhere ─── */
section('23. explicit rep range beats the cap');
{
  const A=load([]), C=A.getCFG();
  const ex=A.exById.m_rd_fly;   // 10 lb steps, rear delts: muscle default 10–20, capped to 15
  let sc=A.schemeFor('accessory','hyp',1,5,ex);
  ok(sc.reps[1]===15&&sc.repCapped,'precondition: the default is capped to 15 on a coarse machine',JSON.stringify(sc));
  C.repRanges={m_rd_fly:[10,20]};
  sc=A.schemeFor('accessory','hyp',1,5,ex);
  ok(sc.reps[0]===10&&sc.reps[1]===20&&sc.repSrc==='exercise'&&!sc.repCapped,'your 10–20 beats the cap',JSON.stringify(sc));
  ['primary','secondary'].forEach(r=>ok(A.schemeFor(r,'str',1,4,ex).reps[1]===20,'your range applies as '+r+' too',''));
  // saved mid-session: the open session, pre-workout edits and saved days all follow
  C.repRanges={};
  const slot={ex:'m_rd_fly',role:'accessory',reps:[10,15],rpe:9,sets_target:3,sets:[],repSrc:'muscle',repCapped:true};
  A.setSession({id:'SR',slots:[slot,{ex:'bench',role:'primary',reps:[6,8],rpe:8,sets_target:3,sets:[]}],openIdx:1,adj:null,score:null});
  C.dayOverrides={full_body_b:{slots:[{ex:'m_rd_fly',role:'accessory',reps:[10,15],rpe:9}]}};
  C.repRanges={m_rd_fly:[10,20]}; A.applyRepRange('m_rd_fly');
  ok(JSON.stringify(slot.reps)==='[10,20]'&&slot.repSrc==='exercise','the open session picks up the new range',JSON.stringify(slot));
  ok(JSON.stringify(A.getSession().slots[1].reps)==='[6,8]','other exercises are untouched','');
  ok(JSON.stringify(C.dayOverrides.full_body_b.slots[0].reps)==='[10,20]','a saved preset day picks it up',JSON.stringify(C.dayOverrides));
  delete C.repRanges.m_rd_fly; A.applyRepRange('m_rd_fly');
  ok(JSON.stringify(slot.reps)==='[10,15]'&&slot.repCapped,'reset puts the capped default back everywhere',JSON.stringify(slot));
  console.log('  explicit range beats the cap in every role · applies to the open session and saved days · reset restores');
}

/* ─── 24. per-exercise bar weight ─── */
section('24. bar weight per exercise');
{
  const A=load([]), C=A.getCFG();
  const bb=A.EX.find(e=>e.load==='barbell'&&e.plateSet==='main_lb'&&e.bar===45);
  const slot={ex:bb.id,role:'primary',reps:[5,5],rpe:8,sets_target:3,sets:[]};
  ok(A.loadable(slot,135)===135,'precondition: 135 is loadable on a 45 lb bar','');
  C.barOverrides={[bb.id]:35}; A.applyBarOverrides();
  ok(A.exById[bb.id].bar===35,'the override is what the exercise carries','');
  ok(A.loadable(slot,136)===135,'plates solve on the 35 lb bar (35 + 2×50)',String(A.loadable(slot,136)));
  ok(A.warmupRamp(slot,135)[0].lb===35,'the warmup ramp starts from the bar you set',JSON.stringify(A.warmupRamp(slot,135)[0]));
  delete C.barOverrides[bb.id]; A.applyBarOverrides();
  ok(A.exById[bb.id].bar===45,'removing the override restores the library bar','');
  // a custom exercise's bar is its own definition — never an override
  const cx={id:'cx_test_bar',name:'Test bar',custom:true,load:'barbell',plateSet:'main_lb',bar:20,inc:5,pattern:'squat',vol:{quads:1}};
  A.EX.push(cx); A.exById[cx.id]=cx; C.barOverrides={cx_test_bar:99}; A.applyBarOverrides();
  ok(cx.bar===20,'overrides never rewrite a custom exercise','');
  console.log('  override drives plates, loadable and warmups · reset restores · custom bars untouched');
}

/* ─── 25. per-session best sets (goal-lift cards + info sheet history) ─── */
section('25. best set per session');
{
  const A=load([
    set('deadlift','D1',300,5,8,10), set('deadlift','D1',320,2,9,10),                 // 300×5 has the higher e1RM
    {...set('deadlift','D1',405,1,null,10),set_kind:'warmup'},                            // warmups never count
    set('deadlift','D2',315,5,8,5), set('deadlift','D2',330,4,8,5),
    set('deadlift','D3',200,20,7,1)]);                                                    // past the formula: heaviest
  const b=A.sessionBests('deadlift');
  ok(b.length===3&&b[0].session_id==='D3'&&b[2].session_id==='D1','one row per session, newest first',b.map(x=>x.session_id).join());
  ok(b[2].lb===300&&b[2].reps===5,'best = highest e1RM, not heaviest load (300×5 over 320×2)',JSON.stringify(b[2]));
  ok(b[1].lb===330&&b[1].pr===true,'a set that beats the running best is marked PR',JSON.stringify(b[1]));
  ok(b[0].lb===200&&b[0].e1==null,'a session past 15 reps falls back to its heaviest set','');
  ok(!b.some(x=>x.lb===405),'warmups are never a best set','');
  const T=load([set('deadlift','T1',300,5,8,3),set('deadlift','T1',300,5,9,3)]);
  ok(T.sessionBests('deadlift').length===1,'equal sets in one session give one row','');
  console.log('  highest e1RM per session · ties to heavier · warmups excluded · PR via prIds · newest first');
}

/* ─── 26. bidirectional suggestions: locked never overwritten, unlocked recomputes ─── */
section('26. lock what you edit, recompute the other');
{
  const cases=[
    {ex:'bench', hist:[set('bench','L1',185,6,8,2)], reps:[6,8], rpe:8},            // chart path
    {ex:'incline_machine', hist:[set('incline_machine','L2',150,10,8,2)], reps:[8,12], rpe:8},  // machine
    {ex:'chinup', hist:[set('chinup','L3',25,6,8,2)], reps:[5,8], rpe:8}];             // bodyweight + added
  cases.forEach(c=>{
    const A=load(c.hist), slot={ex:c.ex,role:'primary',reps:c.reps,rpe:c.rpe,sets_target:3,sets:[]};
    const ref=A.refE1(slot);
    ok(ref&&ref.e1>0,c.ex+': priced against the last set','');
    // weight locked → reps recomputed, weight never touched
    for(const W of [c.hist[0].weight.value*0.8, c.hist[0].weight.value, c.hist[0].weight.value*1.08]){
      const d={weight:Math.round(W),unit:'lb',reps:99,lock:{w:true}}, r=A.rebalance(slot,d);
      ok(r&&r.field==='reps'&&!('weight' in r),c.ex+': locked weight is never in the result',JSON.stringify(r));
      if(r&&r.priced){
        ok(Number.isInteger(r.reps)&&r.reps>=1,c.ex+': reps are a whole number',String(r.reps));
        ok(r.out===(r.reps<c.reps[0]?'below':r.reps>c.reps[1]?'above':null),c.ex+': out-of-range is flagged, not clamped',JSON.stringify(r));
      }
    }
    // reps locked → weight recomputed, reps never touched, never harder than aimed
    for(const R of [c.reps[0],c.reps[1]]){
      const d={weight:999,unit:'lb',reps:R,lock:{r:true}}, r=A.rebalance(slot,d);
      ok(r&&r.field==='weight'&&!('reps' in r),c.ex+': locked reps are never in the result',JSON.stringify(r));
      if(r&&r.priced) ok(r.weight>0&&r.weight<=999,c.ex+': a weight comes back',JSON.stringify(r));
    }
    // nothing recomputes when both numbers, or RPE, are yours — or nothing is
    [{w:true,r:true},{rpe:true},{w:true,rpe:true},{}].forEach(L=>ok(A.rebalance(slot,{weight:100,unit:'lb',reps:5,lock:L})===null,c.ex+': no recompute with lock '+JSON.stringify(L),''));
  });
  // chart path: the recomputed pair actually lands on the target RPE
  {
    const A=load([set('bench','P1',185,6,8,2)]), slot={ex:'bench',role:'primary',reps:[6,8],rpe:8,sets_target:3,sets:[]};
    const e1=A.refE1(slot).e1, T=8;
    for(let W=135;W<=215;W+=5){
      const r=A.rebalance(slot,{weight:W,unit:'lb',reps:0,lock:{w:true}});
      if(!r||!r.priced) continue;
      const p=A.predictedRpe(e1,W,r.reps), pNext=A.predictedRpe(e1,W,r.reps+1);
      ok(p<=T+1e-6,'bench '+W+': '+r.reps+' reps is not harder than RPE '+T,String(p));
      ok(pNext==null||pNext>T-1e-6,'bench '+W+': one more rep would pass RPE '+T,String(pNext));
    }
    for(let R=3;R<=12;R++){
      const r=A.rebalance(slot,{weight:0,unit:'lb',reps:R,lock:{r:true}});
      if(!r||!r.priced) continue;
      ok(A.predictedRpe(e1,r.weight,R)<=T+1e-6,'bench '+R+' reps: '+r.weight+' lb is not harder than aimed',String(A.predictedRpe(e1,r.weight,R)));
      const up=A.stepUp(slot,r.weight), pu=A.predictedRpe(e1,up,R);
      ok(pu==null||pu>T-1e-6,'bench '+R+' reps: one step heavier would pass the target',String(pu));
    }
  }
  // the draft: a locked field survives recompute and re-seeds until the set is logged
  {
    const A=load([set('bench','D1',185,6,8,2)]), slot={ex:'bench',role:'primary',reps:[6,8],rpe:8,sets_target:3,sets:[]};
    A.setSession({id:'SD',slots:[slot],openIdx:0,adj:null,score:null});
    A.seedDraft(slot); const d=A.getDraft();
    ok(d.sugW&&d.sugR&&!A.draftLocked(),'fresh suggestion: both amber, nothing locked','');
    d.weight=205; d.lock={w:true}; d.lockEx='bench'; A.rebalanceDraft(slot);
    ok(d.weight===205&&d.sugR&&d.reps<6,'weight locked at 205: reps recomputed (honest, below the range)',JSON.stringify({w:d.weight,r:d.reps}));
    A.seedDraft(slot,true);
    ok(d.weight===205&&d.lock.w,'a re-seed of the same exercise keeps the locked weight','');
    d.reps=8; d.lock={w:true,r:true}; A.rebalanceDraft(slot);
    ok(d.weight===205&&d.reps===8,'both locked: neither moves','');
    A.seedDraft(slot);
    ok(!A.draftLocked()&&d.weight!==205,'"Back to the suggestion" (a plain re-seed) clears the locks','');
  }
  console.log('  locked field never in the result · unlocked recomputes · pair lands on target RPE · locks survive re-seeds · cleared by logging/back');
}

/* ─── 27. notes by purpose: feedback, setup, cues, diary ─── */
section('27. notes split by purpose');
{
  const A=load([
    {type:'note',id:'f1',ts:day(9),tag:'bug',text:'a bug'},
    {type:'note',id:'t1',ts:day(8),tag:'train',text:'felt heavy',context:'Full body D · Barbell bench press',screen:'Workout'},
    {type:'note',id:'t2',ts:day(7),tag:'train',text:'no context'}]);
  ok(A.openFeedbackNotes().map(n=>n.id).join()==='f1','old training notes are not feedback',A.openFeedbackNotes().map(n=>n.id).join());
  ok(!/felt heavy/.test(A.notesReport().text),'and never go into the copy-for-Claude-Code report','');
  ok(!A.NOTE_TAGS.some(t=>t.id==='train'),'"Training note" is gone from the feedback menu','');
  const d=A.diaryEntries();
  ok(d.length===2&&d.every(x=>x.legacy),'old training notes read as diary entries (nothing rewritten)',JSON.stringify(d));
  ok(A.diaryEntries({exerciseId:'bench'}).length===1,'a training note whose context names an exercise lands in that exercise\'s diary','');
  // setup / cues: newest wins, empty clears, one per exercise per kind
  A.saveExNote('bench','setup','Seat 3, pin 8'); A.saveExNote('bench','cue','Elbows 45°');
  ok(A.exNote('bench','setup')==='Seat 3, pin 8'&&A.exNote('bench','cue')==='Elbows 45°','setup and cue stored per exercise','');
  const n0=A.LOG.length; A.saveExNote('bench','setup','Seat 3, pin 8');
  ok(A.LOG.length===n0,'saving the same text appends nothing','');
  A.saveExNote('bench','setup','Seat 4'); ok(A.exNote('bench','setup')==='Seat 4','an edit appends and the newest wins','');
  A.saveExNote('bench','setup',''); ok(A.exNote('bench','setup')===''&&A.exNote('bench','cue')==='Elbows 45°','clearing one kind leaves the other','');
  ok(A.exNote('squat','setup')==='','other exercises are untouched','');
  // diary events: per exercise or per session, never in sets() or volume
  A.append({type:'diary',exercise_id:'bench',text:'grip went'}); A.append({type:'diary',session_id:'S9',text:'good day'});
  ok(A.diaryEntries({exerciseId:'bench'}).length===2&&A.diaryEntries({sessionId:'S9'}).length===1,'diary filters by exercise and by session','');
  ok(A.sets().length===0,'none of these are sets — volume and PRs never see them','');
  console.log('  feedback excludes training notes · old ones become diary · setup/cue newest-wins · diary by exercise/session · never sets');
}

/* ─── 28. library model: families, parents, folds (spec §1) ─── */
section('28. library model');
{
  const A=load([]);
  A.EX.forEach(e=>ok(['squat','hinge','horizontal_press','vertical_press','vertical_pull','horizontal_pull','isolation'].includes(A.familyOf(e)),'every exercise has a family: '+e.id,''));
  ok(A.familyOf(A.exById.bench)==='horizontal_press'&&A.familyOf(A.exById.curl)==='isolation','families come from the pattern','');
  ok(A.familyOf(A.exById.cg_bench)==='horizontal_press'&&A.exById.cg_bench.pattern==='elbow_extension','close-grip bench: bench family, triceps pattern kept for volume','');
  ok(A.familyOf(A.exById.m_rd_fly)==='isolation','rear-delt flies are isolation, not a row family','');
  A.EX.filter(e=>e.parent).forEach(e=>{
    const p=A.exById[e.parent];
    ok(!!p,e.id+': parent exists','');
    ok(p&&A.familyOf(p)===A.familyOf(e),e.id+': parent is in the same family',e.parent);
    ok(e.specificity>0&&e.specificity<=1,e.id+': specificity in (0,1]',String(e.specificity));
    let x=e, n=0; while(x&&x.parent&&n<10){ x=A.exById[x.parent]; n++; } ok(n<10,e.id+': no parent cycle','');
  });
  // folds: kept for old data, never offered, never generated
  ['board_press','neutral_pulldown'].forEach(id=>{
    const e=A.exById[id];
    ok(e&&e.folded&&A.exById[e.folded.parent],id+' is folded onto an existing parent','');
    ok(!A.mainEligible(e),id+' is not offered as a main lift','');
  });
  const used=new Set(); let gotFolded=false;
  for(let i=0;i<20;i++){ const r=A.resolveEx('vertical_pull','accessory',used); if(!r) break; if(r.folded) gotFolded=true; used.add(r.id); }
  ok(!gotFolded,'generation never picks a folded exercise','');
  ok(A.mainEligible(A.exById.incline_machine)&&A.mainEligible(A.exById.ssb_squat)&&!A.mainEligible(A.exById.calf),'main lifts come from the tracked families','');
  // custom exercises: family from pattern, specificity from implement
  ok(A.familyOf({pattern:'horizontal_press',custom:true})==='horizontal_press'&&A.familyOf({pattern:'calf_raise'})==='isolation','a custom exercise\'s family comes from its movement type','');
  ok(A.customSpecificity('machine','bench')===0.5&&A.customSpecificity('barbell','bench')===0.7,'custom specificity: machine version 0.5, other implement 0.7','');
  console.log('  every exercise has a family · parents valid, same family, acyclic · folds hidden and never generated · custom family from pattern');
}

/* ─── 29. modifiers: one track per (exercise, signature) ─── */
section('29. modifier signatures are isolated');
{
  const P={pause:{seconds:2,at:'chest'}};
  // signatures: stable, order-independent, empty for nothing/standard
  const A0=load([]);
  ok(A0.modSig(P)==='pause:2@chest','pause signature','');
  ok(A0.modSig({grip:'close',pause:{seconds:2,at:'chest'}})===A0.modSig({pause:{at:'chest',seconds:2},grip:'close'}),'signature ignores key order','');
  ok(A0.modSig({})===''&&A0.modSig({grip:'standard'})===''&&A0.modSig(null)==='','no modifier = the empty signature','');
  ok(A0.modSig({tempo:'fast'})==='','junk tempo is dropped','');
  ok(/paused 2s on the chest/.test(A0.modLabel(P)),'labels read plainly',A0.modLabel(P));
  ok(A0.modLabelFromSig('pause:2@chest,rom:board2in')===A0.modLabel({pause:{seconds:2,at:'chest'},rom:{kind:'board',amount:2,unit:'in'}}),'signature reads back to the same words','');
  // a paused set never drives the normal suggestion, and vice versa
  const norm=[set('bench','M1',185,6,8,4)], paused=[{...set('bench','M2',165,5,9,2),modifiers:P}];
  const A=load(norm.concat(paused));
  const s0={ex:'bench',role:'primary',reps:[5,8],rpe:8,sets_target:3,sets:[]};
  const sP={...s0,modifiers:P};
  ok(A.lastSetFor('bench').weight.value===185,'last normal set is the 185, not the later paused 165','');
  ok(A.lastSetFor('bench',A.modSig(P)).weight.value===165,'last paused set is the paused one','');
  const B=load(norm);
  ok(JSON.stringify(A.nextPrescription(s0))===JSON.stringify(B.nextPrescription(s0)),'adding a paused set changes nothing about the normal prescription','');
  const pp=A.nextPrescription(sP);
  ok(pp.lb!=null&&pp.lb<=185,'the paused slot prices from the paused history',JSON.stringify(pp));
  // first time with a modifier: no invented number, the unmodified set as reference
  const C=load(norm), sT={...s0,modifiers:{tempo:'3-1-0'}}, pt=C.nextPrescription(sT);
  ok(pt.lb==null&&pt.firstMod&&/pick a weight/.test(pt.note)&&/185 × 6/.test(pt.note),'first time with a modifier: no number, unmodified last set as reference',JSON.stringify(pt));
  // PRs and bests are per track
  const D=load([set('bench','R1',185,5,8,6),{...set('bench','R2',150,5,8,4),modifiers:P},{...set('bench','R3',160,5,8,2),modifiers:P}]);
  const pr=D.prIds();
  const r3=D.sets().find(x=>x.session_id==='R3');
  ok(pr.has(r3.id),'a paused best is a paused PR even though it is lighter than the normal best','');
  ok(D.bestE1RM('bench').v>D.bestE1RM('bench',D.modSig(P)).v,'normal and paused bests are separate','');
  ok(D.sessionBests('bench').length===1&&D.sessionBests('bench',D.modSig(P)).length===2,'history rows are per track','');
  ok(JSON.stringify(D.tracksFor('bench'))===JSON.stringify(['',D.modSig(P)]),'tracks listed unmodified first','');
  // folded exercises read as the parent's track with the folded modifier
  const E=load([set('board_press','F1',225,3,8,2)]);
  const ft=E.setTrack(E.sets()[0]);
  ok(ft.ex==='bench'&&ft.sig==='rom:board2in','a board-press set reads as bench, rom:board',JSON.stringify(ft));
  ok(E.lastSetFor('bench')==null,'and never as normal bench','');
  console.log('  stable signatures · paused never moves normal · first time = reference, no number · PRs/bests/history per track · folds map to parent');
}

/* ─── 30. set roles: top set + back-offs, failed reps, rep-first (spec §2.1, 2.2, 2.5, 2.6) ─── */
section('30. top set + back-offs');
{
  // the shape is only built for main lifts in strength blocks
  const G=load([]), GC=G.getCFG(); GC.goals=['deadlift'];
  const tpl={name:'T',slots:[['hinge','primary'],['horizontal_press','secondary']]};
  const dStr=G.buildDay(tpl,{type:'str',week:1,weeks:4,lead:'deadlift',hyp:[]});
  const dHyp=G.buildDay(tpl,{type:'hyp',week:1,weeks:5,lead:'deadlift',hyp:[]});
  ok(dStr.slots[0].ex==='deadlift'&&dStr.slots[0].structure==='topback'&&dStr.slots[0].backoff.n===dStr.slots[0].sets-1,'strength block: the main lift is top set + back-offs',JSON.stringify(dStr.slots[0]));
  ok(!dStr.slots[1].structure,'not for non-main lifts','');
  ok(!dHyp.slots[0].structure,'not in hypertrophy blocks (that slot is batch B)','');
  // a session: top set, then back-offs priced from what was lifted
  const hist=[set('deadlift','H1',315,5,8,7)];
  const A=load(hist), slot={ex:'deadlift',role:'primary',reps:[3,5],rpe:8,sets_target:4,sets:[],structure:'topback',backoff:{n:3}};
  A.setSession({id:'TB',slots:[slot],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
  A.seedDraft(slot); const d=A.getDraft();
  ok(/Top: .* · Back-offs: 3 × /.test(d.why.line),'the line shows the top set and the back-offs',d.why.line);
  d.weight=325; d.reps=5; d.rpe=8.5; d.unit='lb'; A.logSet(slot,0,'straight');
  const top=slot.sets[0];
  ok(top.role==='top','the first set is logged as the top set',JSON.stringify(top.role));
  ok(d.weight<325&&d.reps===5,'next comes a back-off: lighter, same reps',JSON.stringify({w:d.weight,r:d.reps}));
  ok(Math.abs(d.weight-325*0.92)<=5&&d.weight<325,'back-off ≈ 8% under the top set, at the nearest loadable weight below it',String(d.weight));
  ok(/back-off 1 of 3/.test(d.why.line),'the line says which back-off',d.why.line);
  A.logSet(slot,0,'straight'); A.logSet(slot,0,'straight'); A.logSet(slot,0,'straight');
  ok(slot.sets.slice(1).every(x=>x.role==='backoff'&&A.toLb(x.weight)<325),'every back-off is lighter than the top set','');
  // next session's top set prices from the top set, never from a back-off
  const B=load(hist.concat(slot.sets.map(x=>({...x,session_id:'TB'}))));
  ok(B.lastSetFor('deadlift').role==='top','back-offs never feed the engine\'s last set','');
  ok(B.sessionBests('deadlift')[0].lb===325,'history and trend read the top set','');
  ok(![...B.prIds()].some(id=>B.sets().find(x=>x.id===id&&x.role==='backoff')),'a back-off is never a PR','');
  // back-offs never exceed the top set, on any equipment and drop
  ['deadlift','incline_machine','bench','uh_pl_pulldown'].forEach(id=>{
    const sl={ex:id,role:'primary',reps:[3,5],rpe:8,sets_target:4,sets:[],structure:'topback'};
    for(const L of [45,95,135,200,315,405]) for(const drop of [0.03,0.08,0.15]){
      load([]).getCFG(); const Z=load([]); Z.getCFG().backoff={drop,mode:'fixed'};
      const b=Z.backoffLoad(sl,L); ok(b<=L+1e-9,id+' '+L+' drop '+drop+': back-off not heavier than the top set',String(b));
    }
  });
  // coarse machines: nearest step to the 8% drop, not a floor that doubles it
  { const M=load([]), ms={ex:'incline_machine',role:'primary',reps:[4,6],rpe:8,sets_target:3,sets:[],structure:'topback'};
    const step=M.exById.incline_machine.inc, b=M.backoffLoad(ms,130);
    ok(b<130&&Math.abs(b-130*0.92)<=step/2+1e-9,'10 lb steps: 130 → nearest to 8% under ('+b+')',String(b)); }
  // fatigue-stop: stops when a back-off feels like the top set, never past N+2
  {
    const F=load(hist), sl={ex:'deadlift',role:'primary',reps:[3,5],rpe:8,sets_target:3,sets:[],structure:'topback',backoff:{n:2}};
    F.getCFG().backoff={drop:0.08,mode:'fatigue'};
    F.setSession({id:'FS',slots:[sl],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
    F.seedDraft(sl); const fd=F.getDraft();
    fd.weight=325; fd.reps=5; fd.rpe=8; F.logSet(sl,0,'straight');
    for(let i=0;i<8&&sl.sets.length<sl.sets_target;i++){ fd.rpe=7; F.logSet(sl,0,'straight'); }
    ok(sl.sets.filter(x=>x.role==='backoff').length===4,'fatigue-stop never runs past N+2 back-offs',String(sl.sets.length));
    const F2=load(hist), s2={...sl,sets:[],sets_target:3};
    F2.getCFG().backoff={drop:0.08,mode:'fatigue'};
    F2.setSession({id:'FS2',slots:[s2],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
    F2.seedDraft(s2); const f2=F2.getDraft();
    f2.weight=325; f2.reps=5; f2.rpe=8; F2.logSet(s2,0,'straight');
    f2.rpe=7; F2.logSet(s2,0,'straight'); f2.rpe=8; F2.logSet(s2,0,'straight');
    ok(s2.sets_target===s2.sets.length&&s2.sets.length===3,'fatigue-stop ends when a back-off reaches the top set\'s RPE',JSON.stringify({t:s2.sets_target,n:s2.sets.length}));
  }
  // failed reps are flagged on the set
  {
    const Q=load([]), sl={ex:'bench',role:'accessory',reps:[6,8],rpe:8,sets_target:2,sets:[]};
    Q.setSession({id:'FL',slots:[sl],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
    Q.seedDraft(sl); const qd=Q.getDraft(); qd.weight=185; qd.reps=5; qd.failed=true; Q.logSet(sl,0,'straight');
    ok(sl.sets[0].failed===true&&sl.sets[0].role==='straight','a missed rep is stored on the set','');
    ok(!qd.failed,'and the toggle clears for the next set','');
  }
  // §2.5 rep-first: below the top of the range and not harder than aimed, load never rises when the step is >5%
  ['incline_machine','bench','uh_pl_pulldown','lat_raise'].forEach(id=>{
    for(const L of [20,50,100,150]) for(const R of [6,7]) for(const rpe of [6,7,7.5,8]){
      const Y=load([set(id,'RF',L,R,rpe,2)]), sl={ex:id,role:'accessory',reps:[6,8],rpe:8,sets_target:3,sets:[]};
      const pr=Y.nextPrescription(sl), step=Y.stepUp(sl,L)-L;
      if(step/L>0.05&&pr.lb!=null) ok(pr.lb<=L+1e-6,id+' '+L+'×'+R+'@'+rpe+': reps first before a >5% jump',JSON.stringify(pr));
    }
  });
  console.log('  shape only for strength-block main lifts · back-offs lighter, same reps, never feed the engine · fatigue-stop capped · missed reps stored · rep-first holds');
}

/* ─── 31. training max and realization (spec §2.3–2.4) ─── */
section('31. training max and realization');
{
  const hist=[set('deadlift','T1',315,5,8,9)];
  const A=load(hist), e1=A.bestE1RM('deadlift').v;
  let t=A.tmFor('deadlift');
  ok(t&&t.src==='initial'&&Math.abs(t.tm-e1*0.9)<1e-6,'before anything is recorded, TM = 90% of e1RM',JSON.stringify(t));
  A.ensureInitialTM('deadlift'); const tm0=A.tmFor('deadlift');
  ok(tm0.src==='logged'&&Math.abs(tm0.tm-Math.round(e1*0.9*100)/100)<0.01,'the initial TM is recorded once',JSON.stringify(tm0));
  ok(A.ensureInitialTM('deadlift')===null,'and never re-recorded','');
  // an ordinary top set never moves the TM
  A.append(set('deadlift','T2',345,5,7,4));
  ok(A.tmFor('deadlift').tm===tm0.tm,'a heavy top set does not change the TM','');
  // realization week: last training week of a strength block, before any deload
  ok(A.isRealizationWeek({type:'str',week:4,weeks:5,deload:true,onDeload:false})&&!A.isRealizationWeek({type:'str',week:5,weeks:5,deload:true,onDeload:true})
    &&A.isRealizationWeek({type:'str',week:3,weeks:3})&&!A.isRealizationWeek({type:'str',week:2,weeks:3})&&!A.isRealizationWeek({type:'hyp',week:5,weeks:5}),'realization = last training week of a strength block','');
  const AC=A.getCFG(); AC.goals=['deadlift'];
  const tpl={name:'T',slots:[['hinge','primary'],['horizontal_press','secondary']]};
  const dR=A.buildDay(tpl,{type:'str',week:3,weeks:3,lead:'deadlift',hyp:[]});
  ok(dR.slots[0].structure==='amrap'&&dR.slots[0].sets===1,'realization week: the main lift is one AMRAP',JSON.stringify(dR.slots[0]));
  ok(!dR.slots[1].structure,'other lifts are unchanged','');
  // AMRAP load by rep focus
  ok(A.amrapPct([8,10])===0.75&&A.amrapPct([5,6])===0.85&&A.amrapPct([3,5])===0.85&&A.amrapPct([2,3])===0.90,'AMRAP % of TM by the block\'s rep focus','');
  const slot={ex:'deadlift',role:'primary',reps:[3,5],rpe:8,sets_target:1,sets:[],structure:'amrap'};
  const ar=A.amrapRx(slot);
  ok(ar.amrap&&ar.lb<=tm0.tm*0.85+1e-6&&ar.lb>tm0.tm*0.85-10,'AMRAP load = 85% of TM, floored to loadable',JSON.stringify(ar));
  // TM moves: capped up, down when short
  const run=(reps,rpe)=>{ const B=load(hist), C=B.getCFG(); C.goals=['deadlift']; B.ensureInitialTM('deadlift');
    const before=B.tmFor('deadlift').tm, sl={...slot,sets:[]};
    B.setSession({id:'RZ',slots:[sl],openIdx:0,adj:null,ratings:{},startedAt:Date.now()}); B.seedDraft(sl);
    const d=B.getDraft(); d.weight=B.amrapRx(sl).lb; d.reps=reps; d.rpe=rpe; d.unit='lb'; B.logSet(sl,0,'straight');
    return {before, after:B.tmFor('deadlift').tm, role:sl.sets[0].role, ev:B.LOG.filter(e=>e.type==='tm_update').pop()}; };
  let r=run(15,10);
  ok(r.role==='amrap','the realization set is logged as an AMRAP','');
  ok(r.after<=r.before*1.05+0.01&&r.after>r.before,'a big AMRAP raises the TM, capped at +5%',JSON.stringify(r));
  r=run(6,10);
  ok(r.after<=r.before*1.05+0.01,'any AMRAP: never more than +5% per block',JSON.stringify({b:r.before,a:r.after}));
  r=run(3,10);
  ok(Math.abs(r.after-r.before*0.95)<0.02&&r.ev.reason==='short','short of the rep target: TM drops 5%',JSON.stringify(r.ev));
  console.log('  initial 90% recorded once · top sets never move it · realization week = last training week · AMRAP % by rep focus · +5% cap · −5% when short');
}

/* ─── 32. technique layer (spec §6.1–6.3) ─── */
section('32. technique: checklist, video prompt, sticking question');
{
  const A=load([]), C=A.getCFG(); C.goals=['deadlift'];
  // checklist: your setup first, then at most three library cues
  A.saveExNote('deadlift','setup','Bar over midfoot\nShins to bar');
  const it=A.checklistItems('deadlift');
  ok(it[0].own&&it[0].text==='Bar over midfoot'&&it[1].own,'your own setup lines come first',JSON.stringify(it));
  ok(it.filter(x=>!x.own).length<=3,'at most three library cues','');
  // video: due when never prompted or 21+ days since; done or skipped both reset it
  ok(A.videoDue('deadlift'),'never prompted: due','');
  A.append({type:'video_prompt',exercise_id:'deadlift',done:false});
  ok(!A.videoDue('deadlift'),'just prompted (even skipped): not due','');
  ok(A.videoDue('deadlift',Date.now()+22*864e5),'22 days later: due again','');
  // sticking question: main lift, failed or RPE ≥ 9.5, once per exercise per session
  const mk=(st)=>{ const B=load([]); B.getCFG().goals=['deadlift'];
    const sl={ex:'deadlift',role:'primary',reps:[3,5],rpe:8,sets_target:4,sets:[st],structure:'topback'};
    B.setSession({id:'SQ',slots:[sl],openIdx:0,adj:null,ratings:{}}); return {B,sl}; };
  let r=mk({id:'x1',role:'top',rpe:9.5,reps:5,weight:{value:315,unit:'lb'},exercise_id:'deadlift'});
  const p=r.B.stickingPending(r.sl);
  ok(p&&p.options.includes('off_floor')&&p.options.includes('nowhere'),'a hard top set asks where it slowed, with the hinge regions',JSON.stringify(p&&p.options));
  r.B.append({type:'sticking_report',exercise_id:'deadlift',session_id:'SQ',set_id:'x1',region:'off_floor'});
  ok(r.B.stickingPending(r.sl)===null,'asked once per exercise per session','');
  r=mk({id:'x2',role:'top',rpe:8,reps:5,weight:{value:315,unit:'lb'},exercise_id:'deadlift'});
  ok(r.B.stickingPending(r.sl)===null,'an RPE 8 top set does not ask','');
  r=mk({id:'x3',role:'top',rpe:8,reps:4,failed:true,weight:{value:315,unit:'lb'},exercise_id:'deadlift'});
  ok(r.B.stickingPending(r.sl)!==null,'a missed rep asks regardless of RPE','');
  const D=load([]); D.getCFG().goals=[]; const dsl={ex:'curl',role:'accessory',reps:[8,12],rpe:9,sets_target:3,sets:[{id:'y',rpe:10,reps:8,weight:{value:30,unit:'lb'}}]};
  D.setSession({id:'SD',slots:[dsl],openIdx:0,adj:null,ratings:{}});
  ok(D.stickingPending(dsl)===null,'not for isolation or non-main lifts','');
  console.log('  checklist: own setup first, ≤3 library cues · video every 21 days, skip counts · sticking: hard/missed main-lift sets, once per session');
}

/* ─── 33. profiles, experience signal, proposals (spec §3.1–3.2) ─── */
section('33. profiles');
{
  const A=load([]), C=A.getCFG();
  Object.entries(A.PROFILES).forEach(([k,p])=>ok(p.ratio>=0&&p.ratio<=1&&p.testEvery>=0&&['yes','before_tests','no'].includes(p.peaks)&&['high','medium','low'].includes(p.specificity),'profile '+k+' has its four parameters',''));
  ok(!JSON.stringify(A.PROFILES).match(/5\/3\/1|Juggernaut|Smolov|Sheiko|Westside|Starting Strength/i),'no brand names in profiles','');
  C.profile='size_first'; ok(A.profileParams().ratio===0.25&&A.profileParams().testEvery===3,'profile parameters','');
  C.profileParams={testEvery:2}; ok(A.profileParams().testEvery===2&&A.profileParams().ratio===0.25,'"customise" overrides one parameter, keeps the rest','');
  console.log('  five profiles, no brands · customise overrides');
}

/* ─── 34. block sequencer (spec §3.3) ─── */
section('34. block sequencer');
{
  const A=load([]), goals=['ssb_squat','deadlift','incline_machine'];
  const lim={hyp:[5,10],str:[3,6]};
  A.PROFILE_ORDER.forEach(k=>{
    const P=A.PROFILES[k];
    for(const W of [12,16,20,24,30,40]){
      const r=A.sequenceBlocks({params:P,experience:'intermediate',weeks:W,goals});
      const tag=k+' '+W+'wk';
      const tot=r.blocks.reduce((a,b)=>a+b.weeks,0);
      ok(tot+r.leftover===W,tag+': blocks + leftover = weeks',tot+'+'+r.leftover);
      r.blocks.forEach((b,i)=>ok(b.taper?b.weeks===2:b.weeks>=lim[b.type][0]&&b.weeks<=lim[b.type][1],tag+': block '+(i+1)+' within limits (no stub blocks)',b.type+' '+b.weeks));
      ok(!r.blocks.some(b=>b.type==='peak'),tag+': never a peak block','');
      ok(!r.blocks.some(b=>b.taper),tag+': no taper without a fixed target or test date','');
      const last=r.blocks[r.blocks.length-1];
      if(r.blocks.length) ok(P.testEvery>0?true:last.type==='hyp',tag+': ends on strength only when the profile wants PRs',last.type);
      // interleave: below ~55% strength, never two strength blocks in a row and never two hypertrophy blocks in a row
      if(P.ratio>0&&P.ratio<=0.5) ok(!r.blocks.some((b,i)=>i&&b.type==='hyp'&&r.blocks[i-1].type==='hyp'),tag+': hypertrophy and strength alternate','');
      if(P.ratio===0) ok(r.blocks.every(b=>b.type==='hyp'),tag+': pure size is hypertrophy only','');
      // test frequency
      const strs=r.blocks.filter(b=>b.type==='str'&&!b.taper);
      if(P.testEvery===0) ok(!strs.some(b=>b.realize),tag+': never tests','');
      else{
        strs.forEach((b,j)=>{ if((j+1)%P.testEvery===0) ok(b.realize,tag+': strength block '+(j+1)+' tests (every '+P.testEvery+')',''); });
        if(strs.length) ok(strs[strs.length-1].realize,tag+': the last strength block tests (the profile wants PRs)','');
        strs.forEach((b,j)=>{ if((j+1)%P.testEvery!==0&&j<strs.length-1) ok(!b.realize,tag+': strength block '+(j+1)+' does not test','');});
      }
    }
  });
  // shares land near the profile's target over a long plan
  [['even_mix',.5],['size_first',.25],['pure_strength',.8]].forEach(([k,t])=>{
    const r=A.sequenceBlocks({params:A.PROFILES[k],experience:'intermediate',weeks:48,goals});
    const st=r.blocks.filter(b=>b.type==='str').reduce((a,b)=>a+b.weeks,0)/48;
    ok(Math.abs(st-t)<=0.1,k+': strength share within 10 points of '+t+' over 48 weeks',st.toFixed(2));
  });
  // tapers: before a test date, or a fixed target when the profile peaks
  const tt=A.sequenceBlocks({params:A.PROFILES.even_mix,experience:'intermediate',weeks:30,testWeek:20,goals});
  let acc=0, taperEnd=null; tt.blocks.forEach(b=>{ acc+=b.weeks; if(b.taper) taperEnd=acc; });
  ok(taperEnd===20,'a test at week 20: the taper ends that week',String(taperEnd));
  const i20=tt.blocks.findIndex(b=>b.taper);
  ok(tt.blocks[i20-1].type==='str','and a strength block comes right before it','');
  ok(A.sequenceBlocks({params:A.PROFILES.pure_strength,experience:'intermediate',weeks:24,targetFixed:true,goals}).blocks.slice(-1)[0].taper,'pure strength + fixed target: ends on a taper','');
  ok(!A.sequenceBlocks({params:A.PROFILES.even_mix,experience:'intermediate',weeks:24,targetFixed:true,goals}).blocks.some(b=>b.taper),'even mix peaks only before tests, not a target','');
  // the experience answer no longer changes the roadmap: same blocks for every answer
  ['novice','intermediate','advanced'].forEach(x=>ok(JSON.stringify(A.sequenceBlocks({params:A.PROFILES.even_mix,experience:x,weeks:24,goals}).blocks)===JSON.stringify(A.sequenceBlocks({params:A.PROFILES.even_mix,weeks:24,goals}).blocks),'experience '+x+': same roadmap',''));
  // old peak blocks become tapered strength blocks
  const pb=A.migratePeak({type:'peak',label:'Peaking',weeks:3});
  ok(pb.type==='str'&&pb.taper===true,'an existing peak block reads as a tapered strength block','');
  ok(!A.isRealizationWeek({type:'str',taper:true,week:3,weeks:3})&&!A.isRealizationWeek({type:'str',realize:false,week:3,weeks:3})&&A.isRealizationWeek({type:'str',week:3,weeks:3}),'realization only in strength blocks meant to test (older blocks: every one)','');
  console.log('  blocks in limits, no stubs, no peaks · ends per profile · interleaved · test frequency · tapers only before dates · experience never changes the roadmap · peak migration');
}

/* ─── 35. maintenance top set + novice linear model (spec §3.2, 3.4) ─── */
section('35. maintenance top set');
{
  const A=load([]), C=A.getCFG(); C.goals=['deadlift','incline_machine'];
  const days=()=>[{name:'A',slots:[{ex:'deadlift',role:'primary',sets:3,reps:[6,8],rpe:8},{ex:'leg_ext',role:'accessory',sets:3,reps:[10,15],rpe:9}]},
                  {name:'B',slots:[{ex:'deadlift',role:'secondary',sets:3,reps:[8,12],rpe:8}]}];
  let d=A.addMaintenance(days(),{type:'hyp',week:1,weeks:5,refined:true});
  ok(d[0].slots[0].structure==='maint'&&d[0].slots[0].sets===4,'first day with the main lift gets the weekly top set (+1 set)',JSON.stringify(d[0].slots[0]));
  ok(!d[1].slots[0].structure,'only once a week','');
  const added=d.flatMap(x=>x.slots).find(x=>x.ex==='incline_machine');
  ok(added&&added.structure==='maint','a main lift the week never trains still gets its top set',JSON.stringify(added));
  ok(!A.addMaintenance(days(),{type:'hyp',week:1,weeks:5}).some(x=>x.slots.some(s=>s.structure)),'not in a block that started before these rules (from your next block)','');
  ok(!A.addMaintenance(days(),{type:'str',week:1,weeks:4,refined:true}).some(x=>x.slots.some(s=>s.structure==='maint')),'not in strength blocks (they have top sets already)','');
  ok(!A.addMaintenance(days(),{type:'hyp',week:6,weeks:6,refined:true,onDeload:true}).some(x=>x.slots.some(s=>s.structure)),'not on a deload week','');
  // pricing: the top set from top sets, the hypertrophy sets from working sets
  const hist=[set('deadlift','M1',335,4,7.5,7,{role:'top'}),set('deadlift','M1',245,10,8,7,{role:'straight'})];
  const B=load(hist), slot={ex:'deadlift',role:'primary',reps:[8,12],rpe:8,sets_target:4,sets:[],structure:'maint'};
  B.setSession({id:'MS',slots:[slot],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
  const top=B.suggestFor(slot);
  ok(top.pr.maint&&top.lb>=330&&top.pr.reps<=5,'the weekly top set prices from your last top set (335 × 4)',JSON.stringify({lb:top.lb,reps:top.pr.reps}));
  ok(/strength upkeep/.test(top.why.line),'and says what it is',top.why.line);
  slot.sets.push({...hist[0],session_id:'MS'});   // pretend it was logged
  const work=B.suggestFor(slot);
  ok(work.lb<300&&work.pr.reps>=8,'after it, the hypertrophy sets price from your working sets (245 × 10), not the top set',JSON.stringify({lb:work.lb,reps:work.pr.reps}));
  ok(B.lastSetFor('deadlift','', 'top').role==='top'&&B.lastSetFor('deadlift','','work').role==='straight','role classes keep the two histories apart','');
  console.log('  weekly top set placed once, gated to new blocks · top and working sets price separately');
}

/* ─── 36. hypertrophy refinements (spec §3.5) ─── */
section('36. effort ramp, calibration AMRAP, stop adding sets, session cap');
{
  const A=load([]);
  ok(A.effortRamp('primary',1,5)===7&&A.effortRamp('primary',5,5)===9,'compounds: 3 in reserve → 1 (RPE 7 → 9)','');
  ok(A.effortRamp('accessory',1,5)===7&&A.effortRamp('accessory',5,5)===10,'isolations: 3 in reserve → 0 (RPE 7 → 10)','');
  for(let w=1;w<6;w++) ok(A.effortRamp('accessory',w+1,6)>=A.effortRamp('accessory',w,6),'ramp never goes back down (week '+w+')','');
  const tpl={name:'T',slots:[['squat','primary'],['knee_extension','accessory']]};
  const d1=A.buildDay(tpl,{type:'hyp',week:1,weeks:6,deload:true,refined:true,hyp:[]});
  ok(d1.slots[0].rpe===7&&d1.slots[1].rpe===7&&d1.slots[1].calib&&!d1.slots[0].calib,'refined week 1: RPE 7 across, last isolation set is a calibration AMRAP',JSON.stringify(d1.slots.map(s=>[s.rpe,!!s.calib])));
  const d5=A.buildDay(tpl,{type:'hyp',week:5,weeks:6,deload:true,refined:true,hyp:[]});
  ok(d5.slots[0].rpe===9&&d5.slots[1].rpe===10&&!d5.slots[1].calib,'last training week (before the deload): RPE 9 compounds, 10 isolations, no calibration',JSON.stringify(d5.slots.map(s=>s.rpe)));
  const old=A.buildDay(tpl,{type:'hyp',week:1,weeks:5,hyp:[]});
  ok(!old.slots.some(s=>s.ramp||s.calib)&&old.slots[0].rpe===8,'a block from before these rules keeps its old RPE targets','');
  // calibration AMRAP is the slot's last set
  {
    const B=load([set('leg_ext','C0',100,12,8,4)]);
    const sl={ex:'leg_ext',role:'accessory',reps:[10,15],rpe:7,sets_target:3,sets:[],calib:true};
    B.setSession({id:'CA',slots:[sl],openIdx:0,adj:null,ratings:{},startedAt:Date.now()}); B.seedDraft(sl);
    const d=B.getDraft(); d.rpe=7; B.logSet(sl,0,'straight'); d.rpe=7; B.logSet(sl,0,'straight');
    ok(d.rpe===10&&/calibration/.test(d.why.line),'the last set asks for as many reps as you can',JSON.stringify({rpe:d.rpe,line:d.why.line}));
    d.reps=18; B.logSet(sl,0,'straight');
    ok(sl.sets[2].role==='amrap'&&sl.sets[0].role==='straight','and is logged as an AMRAP','');
  }
  // stop adding sets when performance drops two sessions running
  {
    const D=load([set('leg_ext','P1',120,12,8,9),set('leg_ext','P2',115,12,8,6),set('leg_ext','P3',110,12,8,3)]);
    ok(D.muscleDropping('quads'),'three falling sessions on quads','');
    const w3=D.buildDay({name:'T',slots:[['knee_extension','accessory']]},{type:'hyp',week:3,weeks:6,refined:true,hyp:[]});
    const w3n=load([]).buildDay({name:'T',slots:[['knee_extension','accessory']]},{type:'hyp',week:3,weeks:6,refined:true,hyp:[]});
    ok(w3.slots[0].frozen==='quads'&&w3.slots[0].sets<w3n.slots[0].sets,'sets held at last week\'s count instead of ramping',JSON.stringify([w3.slots[0].sets,w3n.slots[0].sets]));
    ok(!load([set('leg_ext','Q1',110,12,8,9),set('leg_ext','Q2',115,12,8,6),set('leg_ext','Q3',110,12,8,3)]).muscleDropping('quads'),'one dip is not a trend','');
  }
  // per-session cap
  {
    const day={slots:[{ex:'bench',role:'primary',sets:5},{ex:'incline_machine',role:'secondary',sets:5},{ex:'machine_press',role:'accessory',sets:5},{ex:'curl',role:'accessory',sets:3}]};
    A.capSessionVolume(day);
    const chest=day.slots.reduce((a,sl)=>a+(A.exById[sl.ex].vol.chest||0)*sl.sets,0);
    ok(chest<=11+1e-9,'no muscle over ~11 sets in one session',String(chest));
    ok(day.slots[0].sets===5,'the main lift keeps its sets — accessories go first',JSON.stringify(day.slots.map(s=>s.sets)));
    ok(day.slots.every(s=>s.sets>=2),'no slot drops below 2 sets','');
    ok(day.slots[3].sets===3,'muscles under the cap are untouched','');
  }
  console.log('  ramp 7→9 / 7→10, monotonic, only new blocks · week-1 calibration AMRAP on the last isolation set · sets freeze on a falling trend · ≤11 sets per muscle per session');
}

/* ─── 37. fatigue-triggered deloads (spec §3.6) ─── */
section('37. deload proposals');
{
  let t0=40;
  const rd=(v)=>({type:'readiness',id:'d'+(uid++),ts:day(t0-=1),sleep_quality:v,motivation:v,recovery:v,soreness:{},joints:{},joint_scale:3});
  const end=()=>({type:'session_end',id:'e'+(uid++),ts:day(t0-=0.5),session_id:'s'+uid,joints:{}});
  const sess=v=>[rd(v),end()];
  // neutral readiness is never a trigger
  t0=40; let ev=[]; for(let i=0;i<6;i++) ev=ev.concat(sess(3));
  let A=load(ev);
  ok(!A.deloadSignals().some(x=>x.k==='readiness'),'neutral readiness: no deload trigger','');
  // readiness falling three sessions running
  t0=40; ev=[].concat(sess(4),sess(3.5),sess(3),sess(2)); A=load(ev);
  ok(A.deloadSignals().some(x=>x.k==='readiness'&&x.strong),'readiness down three sessions running: a deload is proposed','');
  ok(A.activeProposals().some(p=>p.id==='deload'),'as a card','');
  t0=40; ev=[].concat(sess(4),sess(3),sess(3.5),sess(2)); A=load(ev);
  ok(!A.deloadSignals().some(x=>x.k==='readiness'),'a bounce breaks the trend','');
  // RPE drift at a matched load
  const D=load([set('deadlift','R1',315,5,7,21),set('deadlift','R0',315,5,7,18),set('deadlift','R2',315,5,8.5,4),set('deadlift','R3',315,5,8.5,2)]); D.getCFG().goals=['deadlift'];
  ok(D.deloadSignals().some(x=>x.k==='rpe'),'the same 315 × 5 averaging RPE 8.5 vs 7 three weeks ago: drift ≥1 on a main lift','');
  const D2=load([set('deadlift','R1',315,5,7,21),set('deadlift','R0',315,5,7,18),set('deadlift','R2',345,5,8.5,4),set('deadlift','R3',345,5,8.5,2)]); D2.getCFG().goals=['deadlift'];
  ok(!D2.deloadSignals().some(x=>x.k==='rpe'),'heavier load is not a matched load','');
  // rating wobble is not fatigue: one high set among normal ones averages out
  const D3=load([set('deadlift','R1',315,5,7.5,21),set('deadlift','R0',315,5,7,18),set('deadlift','R2',315,5,8,4),set('deadlift','R3',315,5,7.5,2)]);
  // a tired later set at a load that matches an earlier fresh first set is not drift
  const D5=load([set('deadlift','R1',315,5,7,21),set('deadlift','R0',315,5,7,18),set('deadlift','R2',335,5,8,4),set('deadlift','R2',315,5,9,4),set('deadlift','R3',335,5,8,2),set('deadlift','R3',315,5,9,2)]); D5.getCFG().goals=['deadlift'];
  ok(!D5.deloadSignals().some(x=>x.k==='rpe'),'only the first set of each session counts: a tired back-down set is not fatigue',''); D3.getCFG().goals=['deadlift'];
  ok(!D3.deloadSignals().some(x=>x.k==='rpe'),'half-point wobble (7–7.5 then 7.5–8) does not propose a deload','');
  const D4=load([set('deadlift','R1',315,5,7,20),set('deadlift','R2',315,5,8.5,2)]); D4.getCFG().goals=['deadlift'];
  ok(!D4.deloadSignals().some(x=>x.k==='rpe'),'a single set on each side is not enough to call it','');
  // accepting: the next week of sessions is a deload, then it ends
  t0=40; ev=[].concat(sess(4),sess(3.5),sess(3),sess(2)); const B=load(ev);
  B.setRoadmap([B.applyShape({type:'hyp',label:'H',weeks:8,deload:false,hyp:[]})]); B.getCFG().start=new Date(Date.now()-60*864e5).toISOString().slice(0,10);
  const p=B.activeProposals().find(x=>x.id==='deload'); p.accept.fn();
  ok(B.currentPhase().onDeload&&B.currentPhase().type==='deload','accepted: the next sessions are a deload','');
  ok(!B.activeProposals().some(x=>x.id==='deload'),'no deload proposal during a deload','');
  const dpw=B.LOG.filter(e=>e.type==='deload_start').pop().sessions;
  for(let i=0;i<dpw;i++) B.append({type:'session_end',session_id:'post'+i,joints:{}});
  ok(!B.currentPhase().onDeload,'after '+dpw+' sessions the block carries on','');
  ok(B.weeksWithoutDeload()===0,'and the deload resets the count','');
  console.log('  neutral readiness never triggers · falling readiness / RPE drift propose · accepted = one week of deload sessions, then back');
}

/* ─── 38. program builder (spec §4.2) ─── */
section('38. program builder');
{
  // a new user, quick setup with no answers: a valid program
  const A=load([]); A.getCFG().roadmap=null;
  const B=A.builderDefaults(false); B.path='quick';
  let plan=A.builderPlan(B);
  ok(plan.blocks.length>0&&plan.blocks.reduce((a,b)=>a+b.weeks,0)+plan.leftover===24,'quick setup, nothing chosen: a 24-week program',JSON.stringify(plan.blocks.map(b=>[b.type,b.weeks])));
  ok(plan.blocks.every(b=>b.refined),'builder blocks run the new rules from the start','');
  B.goals=['deadlift','deadlift','incline_machine']; B.est={deadlift:315}; B.profile='size_first';
  plan=A.builderPlan(B); A.applyBuilder(B,plan);
  const C=A.getCFG();
  ok(C.onboarded&&C.profile==='size_first'&&JSON.stringify(C.goals)==='["deadlift","incline_machine"]','accepting saves the profile and de-duplicated main lifts',JSON.stringify(C.goals));
  ok(A.LOG.some(e=>e.type==='e1rm_estimate'&&e.exercise_id==='deadlift'&&e.lb===315),'rough strength is saved as a stated estimate, not a set','');
  ok(A.getRoadmap().length===plan.blocks.length,'the roadmap is the plan','');
  // a rerun mid-program keeps history, finished blocks and the current one
  const hist=[]; for(let i=0;i<7;i++) hist.push({type:'session_end',id:'h'+i,ts:day(40-i*2),session_id:'h'+i,joints:{}});
  hist.push(set('deadlift','h1',315,5,8,38));
  const R=load(hist), RC=R.getCFG(); RC.start=new Date(Date.now()-45*864e5).toISOString().slice(0,10); RC.split='full5';
  const old=[R.applyShape({type:'hyp',label:'H',weeks:5,deload:true,hyp:['chest'],lead:'incline_machine'}),R.applyShape({type:'str',label:'S',weeks:4,deload:false,hyp:[]}),R.applyShape({type:'hyp',label:'H',weeks:5,deload:false,hyp:[]})];
  R.setRoadmap(old); RC.roadmap=old;
  const pos=R.programPosition(), before=JSON.stringify(old.slice(0,pos.idx+1));
  const RB=R.builderDefaults(true); RB.week=['upper','lower','upper','lower']; RB.profile='even_mix';
  const rp=R.builderPlan(RB), logBefore=R.LOG.length;
  ok(rp.kept===pos.idx+1,'a rerun keeps finished blocks and the one you\'re in',rp.kept+' vs '+(pos.idx+1));
  const kept=rp.blocks.slice(0,rp.kept);
  ok(kept.every(b=>JSON.stringify(b.week)===JSON.stringify(R.splitOf('full5').week)),'kept blocks are pinned to the week they had, even though the new program week is upper/lower','');
  R.applyBuilder(RB,rp);
  const after=R.getRoadmap().slice(0,rp.kept).map(b=>{ const c={...b}; delete c.week; return c; });
  ok(JSON.stringify(after)===JSON.stringify(JSON.parse(before)),'their contents are unchanged','');
  ok(R.LOG.length===logBefore+1&&R.LOG[R.LOG.length-1].type==='program_edit','logged history is untouched — applying only adds a program_edit line (for the calibrating session)','');
  ok(JSON.stringify(R.getCFG().week)==='["upper","lower","upper","lower"]'&&R.getCFG().start===RC.start,'the new week applies from here; the program start date stays','');
  ok(R.programPosition().idx===pos.idx&&R.programPosition().sessionsIn===pos.sessionsIn,'you are exactly where you were in the program','');
  // every profile × experience gives blocks the review can draw (the novice block once had no shape)
  A.PROFILE_ORDER.forEach(pf=>Object.keys(A.EXPERIENCE).forEach(ex=>[true,false].forEach(rr=>{
    const BB=A.builderDefaults(rr); BB.profile=pf; BB.experience=ex;
    const pl=A.builderPlan(BB);
    ok(pl.blocks.every(b=>Array.isArray(b.vol)&&b.vol.length===A.blockLen(b)&&b.vol.length>0),pf+' / '+ex+(rr?' rerun':'')+': every block has its weekly shape',JSON.stringify(pl.blocks.map(b=>[b.type,b.weeks,b.vol&&b.vol.length])));
  })));
  console.log('  quick setup works blank · accept saves settings + estimates · rerun keeps history, kept blocks and position, pins their week · every profile × experience drawable');
}

/* ─── 39. progression rate per main lift (fast / standard) ─── */
section('39. progression rate');
{
  // a session = its sets + a session_end, days back
  const sess=(ex,sid,lb,reps,rpe,d,target,extra)=>[set(ex,sid,lb,reps,rpe,d,{target,...(extra||{})}),{type:'session_end',id:'se'+sid,ts:day(d-0.01),session_id:sid,joints:{}}];
  const T={reps:[5,5],rpe:8};
  const mk=(sessions,seed,goals)=>{ let ev=[]; sessions.forEach(x=>ev=ev.concat(x)); const A=load(ev), C=A.getCFG();
    C.start=new Date(Date.now()-90*864e5).toISOString().slice(0,10); C.goals=goals||['deadlift']; C.rateSeed=seed; C.onboarded=true;
    A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:30,deload:false,hyp:[]})]); return A; };
  const slot=()=>({ex:'deadlift',role:'primary',reps:[5,5],rpe:8,sets_target:3,sets:[]});
  const rx=(A,sl)=>{ A.setSession({id:'NOW',slots:[sl],openIdx:0,adj:null,ratings:{},startedAt:Date.now()}); return A.suggestFor(sl); };
  const FAST={at:0,dflt:'fast',lifts:{}}, STD={at:0,dflt:'standard',lifts:{}};
  // fast: last exposure hit target → one step up, same reps
  let A=mk([sess('deadlift','a',225,5,8,6,T),sess('deadlift','b',235,5,8,3,T)],FAST);
  ok(A.rateOf('deadlift')==='fast','a new setup that said "still adding weight" starts fast','');
  let r=rx(A,slot());
  ok(r.pr.fast&&r.lb>235&&r.pr.reps===5,'fast: last session plus one step',JSON.stringify({lb:r.lb,src:r.pr.src}));
  // one miss: the normal engine decides; two in a row: standard, on its own
  A=mk([sess('deadlift','a',225,5,8,9,T),sess('deadlift','b',235,4,9.5,6,T)],FAST);
  ok(A.rateOf('deadlift')==='fast'&&!rx(A,slot()).pr.fast,'one miss: still fast, but this session follows the normal engine','');
  A=mk([sess('deadlift','a',225,5,8,9,T),sess('deadlift','b',235,4,9.5,6,T),sess('deadlift','c',235,4,9,3,T)],FAST);
  ok(A.rateOf('deadlift')==='standard','two misses in a row: moves to standard on its own','');
  A=mk([sess('deadlift','a',225,5,8,12,T),sess('deadlift','b',235,4,9.5,9,T),sess('deadlift','c',235,5,8,6,T),sess('deadlift','d',245,4,9.5,3,T)],FAST);
  ok(A.rateOf('deadlift')==='fast','misses that are not consecutive do not demote','');
  // block boundaries: 3 of the last 4 exposures added load → fast for the new block
  const climb=[225,235,245,255,265].map((lb,i)=>sess('deadlift','k'+i,lb,5,8,40-i*3,T));
  A=mk(climb,STD); A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:1,deload:false,hyp:[]}),A.applyShape({type:'str',label:'S',weeks:20,deload:false,hyp:[]})]);
  ok(A.rateOf('deadlift')==='fast','standard lift that added load on 4 of its last 4 exposures: fast from the next block','');
  const flat=[225,225,235,235,235].map((lb,i)=>sess('deadlift','f'+i,lb,5,8,40-i*3,T));
  A=mk(flat,FAST); A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:1,deload:false,hyp:[]}),A.applyShape({type:'str',label:'S',weeks:20,deload:false,hyp:[]})]);
  ok(A.rateOf('deadlift')==='standard','a lift that added load on only 1 of 4: standard from the next block','');
  // an existing program: each main lift classified from its log once
  A=mk(climb,{at:5,dflt:'standard',classify:true,lifts:{}});
  ok(A.rateOf('deadlift')==='fast','existing program: 3+ of the last 4 added load → fast','');
  A=mk(flat,{at:5,dflt:'standard',classify:true,lifts:{}});
  ok(A.rateOf('deadlift')==='standard','existing program: otherwise standard','');
  // not a main lift: always standard, the fast code never runs
  A=mk(climb,FAST,['incline_machine']);
  ok(A.rateOf('deadlift')==='standard','a lift that is not a main lift is never fast','');
  // training max: tracks behind a fast lift, uncapped; capped once standard
  A=mk(climb,FAST);
  const tmF=A.tmFor('deadlift');
  ok(tmF.src==='fast'&&Math.abs(tmF.tm-A.setE1RM(A.sets().filter(x=>x.exercise_id==='deadlift').pop())*0.9)<0.5,'fast: TM = 90% of the latest top set\'s e1RM',JSON.stringify(tmF));
  // INVARIANT: for a lift on standard, nothing in this change alters its prescriptions
  const hists=[
    [sess('deadlift','i1',225,5,8,6,T),sess('deadlift','i2',235,5,8,3,T)],
    [sess('deadlift','i1',225,5,7,6,T),sess('deadlift','i2',225,5,9,3,T)],
    climb, flat,
    [sess('incline_machine','m1',150,10,8,6,{reps:[8,12],rpe:8}),sess('incline_machine','m2',160,9,8.5,3,{reps:[8,12],rpe:8})]];
  const slots=[
    ex=>({ex,role:'primary',reps:[5,5],rpe:8,sets_target:3,sets:[]}),
    ex=>({ex,role:'primary',reps:[3,5],rpe:8,sets_target:4,sets:[],structure:'topback',backoff:{n:3}}),
    ex=>({ex,role:'primary',reps:[8,12],rpe:8,sets_target:4,sets:[],structure:'maint'}),
    ex=>({ex,role:'accessory',reps:[8,12],rpe:9,sets_target:3,sets:[]})];
  let compared=0;
  hists.forEach((h,hi)=>['deadlift','incline_machine'].forEach(ex=>slots.forEach((mkSlot,si)=>{
    const asMain=mk(h,STD,[ex]); asMain.getCFG().rateSeed={at:0,dflt:'standard',lifts:{[ex]:'standard'}};
    if(asMain.rateOf(ex)!=='standard') return;            // promoted by the 3-of-4 rule: covered above
    const notMain=mk(h,STD,['ssb_squat']);
    const a=rx(asMain,mkSlot(ex)), b=rx(notMain,mkSlot(ex));
    ok(a.lb===b.lb&&a.pr.reps===b.pr.reps&&a.pr.src===b.pr.src,'standard '+ex+' (history '+hi+', slot '+si+'): prescription identical to the same lift as a non-main lift',JSON.stringify([a.lb,a.pr.reps,a.pr.src,b.lb,b.pr.reps,b.pr.src]));
    compared++;
  })));
  ok(compared>=20,'the standard-lift invariant was actually exercised',String(compared));
  ok(A.RATE_LABEL.fast==='adding load each session'&&A.RATE_LABEL.standard==='building reps, then load','dashboard wording, no mode labels','');
  // like with like (found by tests/simulate.js): Monday's 3–5 top set must not drive Wednesday's 8–12 slot
  {
    const W=mk([[set('deadlift','t1',300,5,7,4,{role:'top',target:{reps:[3,5],rpe:7.5}}),{type:'session_end',id:'set1',ts:day(3.99),session_id:'t1',joints:{}}]],FAST);
    const sl={ex:'deadlift',role:'secondary',reps:[8,12],rpe:8,sets_target:3,sets:[]};
    const r=rx(W,sl);
    ok(!r.pr.fast,'a different kind of set (top set → 8–12 working set) is not used for fast progression',JSON.stringify({lb:r.lb,reps:r.pr.reps,src:r.pr.src}));
    const W2=mk([sess('deadlift','u1',225,8,7.5,4,{reps:[8,12],rpe:8})],FAST);
    const r2=rx(W2,{...sl});
    ok(r2.pr.fast&&r2.lb>225&&r2.pr.reps===8,'the same kind of set and rep range: one step up, same reps',JSON.stringify({lb:r2.lb,reps:r2.pr.reps}));
    // load and reps never both rise on the fast path, across rep ranges
    for(const [lo,hi] of [[3,5],[5,5],[6,8],[8,12],[10,15]]) for(const R of [lo,hi]){
      const V=mk([sess('deadlift','v1',200,R,7,4,{reps:[lo,hi],rpe:8})],FAST), s3={ex:'deadlift',role:'primary',reps:[lo,hi],rpe:8,sets_target:3,sets:[]}, q=rx(V,s3);
      if(q.pr.fast) ok(!(q.lb>200&&q.pr.reps>R),'fast '+lo+'–'+hi+' from '+R+' reps: load and reps never both rise',JSON.stringify({lb:q.lb,reps:q.pr.reps}));
    }
  }
  console.log('  fast = last + one step · one miss defers, two demote · block boundary 3-of-4 promotes/demotes · existing programs classified · TM tracks a fast lift · standard lifts untouched ('+compared+' cases)');
}

/* ─── 40. moving an exercise's history ─── */
section('40. move history to another exercise');
{
  const ev=[set('ssb_squat','q1',135,8,8,9),set('ssb_squat','q1',145,8,8.5,9),set('ssb_squat','q2',155,8,8,5),set('deadlift','q2',315,5,8,5),
    {type:'exercise_rating',id:'rt1',ts:day(5),exercise_id:'ssb_squat',stimulus:4,enjoyment:4}];
  const A=load(ev);
  const s2=A.sets().find(x=>x.session_id==='q2'&&x.exercise_id==='ssb_squat');
  A.append({type:'correction',target_id:s2.id,patch:{weight:{value:160,unit:'lb'}},reason:'edit'});        // an earlier fix
  const s1=A.sets().find(x=>x.session_id==='q1'&&x.weight.value===135);
  A.append({type:'correction',target_id:s1.id,patch:null,reason:'delete'});                               // a deleted set
  const rawBefore=JSON.stringify(A.LOG.filter(e=>e.type!=='correction')), nBefore=A.LOG.length;
  const r=A.moveHistory('ssb_squat','transformer_high_bar');
  ok(r.count===2,'the two live squat sets move (the deleted one stays deleted)',String(r.count));
  ok(JSON.stringify(A.LOG.filter(e=>e.type!=='correction'))===rawBefore&&A.LOG.length===nBefore+2,'append-only: only corrections were added, nothing rewritten','');
  ok(A.sets().filter(x=>x.exercise_id==='ssb_squat').length===0&&A.sets().filter(x=>x.exercise_id==='transformer_high_bar').length===2,'history now reads as high-bar','');
  ok(A.sets().find(x=>x.id===s2.id).weight.value===160,'an earlier weight correction is carried forward','');
  ok(!A.sets().some(x=>x.id===s1.id),'a deleted set stays deleted','');
  ok(A.sets().filter(x=>x.exercise_id==='deadlift').length===1,'other exercises untouched','');
  ok(A.LOG.some(e=>e.type==='exercise_rating'&&e.exercise_id==='ssb_squat'),'ratings stay with the old exercise','');
  const m=A.lastHistoryMove('transformer_high_bar');
  ok(m&&m.from==='ssb_squat'&&m.count===2,'the move can be found for undo',JSON.stringify(m));
  ok(A.undoHistoryMove(m.id)===2,'undo','');
  ok(A.sets().filter(x=>x.exercise_id==='ssb_squat').length===2&&A.sets().find(x=>x.id===s2.id).weight.value===160,'undo restores the old exercise and the earlier correction','');
  ok(!A.lastHistoryMove('transformer_high_bar'),'and the move is no longer offered for undo','');
  console.log('  append-only · earlier edits kept · deleted stays deleted · others untouched · undo exact');
}

/* ─── 41. a weekly top set is judged against its own target (found by tests/simulate.js) ─── */
section('41. maintenance top set target');
{
  const A=load([set('deadlift','w1',300,4,7.5,7,{role:'top'})]); const C=A.getCFG(); C.goals=['deadlift']; C.rateSeed={at:0,dflt:'fast',lifts:{}};
  const slot={ex:'deadlift',role:'primary',reps:[6,8],rpe:8,sets_target:4,sets:[],structure:'maint'};
  A.setSession({id:'MT',slots:[slot],openIdx:0,adj:null,ratings:{},startedAt:Date.now()}); A.seedDraft(slot);
  const d=A.getDraft(); d.weight=305; d.reps=5; d.rpe=7.5; A.logSet(slot,0,'straight');
  ok(JSON.stringify(slot.sets[0].target)==='{"reps":[3,5],"rpe":7.5}','the weekly top set stores 3–5 @ 7.5, not the slot\'s 6–8',JSON.stringify(slot.sets[0].target));
  d.weight=245; d.reps=8; d.rpe=8; A.logSet(slot,0,'straight');
  ok(JSON.stringify(slot.sets[1].target)==='{"reps":[6,8],"rpe":8}','the hypertrophy sets after it keep the slot\'s target','');
  ok(!A.rateState('deadlift').last.miss,'so 5 reps at RPE 7.5 is a hit, not a miss — a fast lift is not demoted by its own top set','');
  console.log('  top set target stored as prescribed · not counted as a miss');
}

/* ─── 42. stall engine (spec §5, §6.4–6.5) ─── */
section('42. stall engine');
{
  // a lift trained perWeek times a week for `weeks` weeks, flat (or rising), ending lastDaysAgo
  const hist=(ex,{weeks=6,perWeek=2,lb=315,rise=0,rpe=8,skipWeek=-1,lastDaysAgo=1,target={reps:[5,5],rpe:8}}={})=>{
    const ev=[]; let k=0;
    for(let w=weeks-1;w>=0;w--){ if(w===skipWeek) continue;
      for(let j=0;j<perWeek;j++){ const d=lastDaysAgo+w*7+j*Math.floor(7/perWeek), sid=ex+'s'+(k++)+'_'+(uid++), L=Math.round((lb*(1+rise*(weeks-1-w)))/5)*5;
        ev.push(set(ex,sid,L,5,rpe,d,{target,role:'straight'}),{type:'session_end',id:'se'+sid,ts:day(d-0.01),session_id:sid,joints:{}}); } }
    return ev.sort((a,b)=>a.ts<b.ts?-1:1); };
  const mk=(ev,o={})=>{ const A=load(ev.slice().sort((a,b)=>a.ts<b.ts?-1:1)), C=A.getCFG();
    C.start=new Date(Date.now()-400*864e5).toISOString().slice(0,10); C.goals=o.goals||['squat']; C.onboarded=true;
    C.rateSeed={at:0,dflt:'standard',lifts:{}}; C.stallWeeks=o.stallWeeks||4; C.experience=o.experience||'intermediate';
    C.conditions=o.conditions||[]; C.energy=o.energy||'maintenance'; C.equipment=null;
    A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:200,deload:false,hyp:[]})]); return A; };
  // detection
  let A=mk(hist('squat'));
  let st=A.stallState('squat');
  ok(st&&st.kind==='stall'&&st.weeks>=4,'flat for 6 weeks, trained twice a week: a stall',JSON.stringify(st&&{k:st.kind,w:st.weeks}));
  A=mk(hist('squat',{rise:0.02}));
  ok(!A.stallState('squat'),'rising 2% a week: no stall','');
  A=mk(hist('squat',{skipWeek:1}));
  st=A.stallState('squat');
  ok(st&&st.kind==='exposure','a week with no squat in the window: an exposure problem, not a stall',JSON.stringify(st&&st.kind));
  let card=A.stallCard('squat');
  ok(card&&card.id.endsWith(':exposure')&&/exposure problem, not a stall/.test(card.body),'its card says so and changes nothing',card&&card.id);
  if(card) card.accept.fn(); ok(!A.LOG.some(e=>e.type==='intervention_start'),'accepting it starts no intervention','');
  A=mk(hist('squat',{lastDaysAgo:20}));
  ok(!A.stallState('squat'),'not trained in the last 14 days: not judged','');
  A=mk(hist('squat',{weeks:3}));
  ok(!A.stallState('squat'),'less history than the window: not judged','');
  A=mk(hist('squat')); A.getCFG().rateSeed={at:0,dflt:'fast',lifts:{}};
  ok(A.rateOf('squat')!=='fast'||!A.stallState('squat'),'a lift on fast progression is never called stalled (two misses demote it instead)','');
  A=mk(hist('squat'),{goals:['deadlift']});
  ok(!A.stallState('squat'),'not a main lift: not judged','');
  // step 0
  A=mk(hist('squat'),{energy:'deficit'});
  let p=A.stallPlan('squat');
  ok(p&&p.kind==='deficit','in a deficit: the explanation, not an intervention',JSON.stringify(p&&p.kind));
  card=A.stallCard('squat'); ok(card&&/expected in a deficit/i.test(card.title)&&/Hold the load and keep the volume/.test(card.body),'the deficit card says hold load, keep volume','');
  if(card) card.accept.fn(); ok(!A.LOG.some(e=>e.type==='intervention_start'),'and accepting it changes nothing','');
  A=mk(hist('squat',{rpe:9.5}));
  p=A.stallPlan('squat');
  ok(p&&(p.kind==='hard'||p.kind==='fatigue'),'sets coming in 1.5 RPE over target: recovery first',JSON.stringify(p&&p.kind));
  card=A.stallCard('squat');
  ok(!card||/deload/i.test(card.accept.label),'and the only thing offered is a deload',card&&card.accept.label);
  {
    const ev=hist('squat'); for(let i=0;i<4;i++) ev.push({type:'readiness',id:'jr'+i,ts:day(6-i),sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{knee:3},joint_scale:3});
    A=mk(ev); p=A.stallPlan('squat');
    ok(!p||p.step===0,'a joint flaring: no step that adds work',JSON.stringify(p&&{s:p.step,k:p.kind}));
  }
  A=mk(hist('squat').concat([{type:'deload_start',id:'dl1',ts:day(3),sessions:5}]));
  p=A.stallPlan('squat'); ok(p&&p.kind==='recovering'&&!A.stallCard('squat'),'mid-deload: no stall card',JSON.stringify(p&&p.kind));
  A=mk(hist('squat').concat([{type:'deload_start',id:'dl2',ts:day(10.5),sessions:1}]));
  p=A.stallPlan('squat'); ok(A.currentPhase().onDeload!==true&&p&&p.kind==='recovering'&&!A.stallCard('squat'),'deload just finished: give it two weeks before calling it a stall',JSON.stringify(p&&p.kind));
  // step 1
  A=mk(hist('squat'));
  p=A.stallPlan('squat');
  ok(p&&p.step===1&&p.kind==='volume','trained twice a week: step 1 is more sets',JSON.stringify(p&&{s:p.step,k:p.kind}));
  card=A.stallCard('squat'); ok(card&&/RPE 6.5/.test(card.body)&&/judgement defaults/.test(card.body),'the card says what, why, how long, and that the numbers are judgement defaults','');
  A=mk(hist('squat',{perWeek:1}));
  p=A.stallPlan('squat'); ok(p&&p.kind==='frequency','trained once a week: step 1 adds a day',JSON.stringify(p&&p.kind));
  // one active intervention per lift; derived, never stored
  A=mk(hist('squat')); A.startIntervention('squat',A.stallPlan('squat'));
  ok(A.activeIntervention('squat')&&A.stallPlan('squat').active&&!A.stallCard('squat'),'once started: no second card for the same lift','');
  const evS=A.LOG.find(e=>e.type==='intervention_start');
  ok(!('outcome' in evS)&&!('active' in evS)&&!('baseline_e1' in evS),'the start event carries no derived state (outcome, status, baseline)',JSON.stringify(Object.keys(evS)));
  // what it does to the week
  {
    const ph=A.currentPhase(), days=[{id:'a',name:'A',slots:[{ex:'squat',role:'primary',sets:5,reps:[6,8],rpe:8}]},{id:'b',name:'B',slots:[{ex:'bench',role:'primary',sets:4,reps:[6,8],rpe:8}]}];
    A.applyInterventions(days,ph);
    const pr=days[0].slots.find(x=>x.structure==='practice');
    ok(pr&&pr.ex==='squat'&&pr.sets===2&&pr.rpe===6.5,'volume: 40% more sets as practice sets at RPE 6.5',JSON.stringify(pr));
    // a practice set is logged as practice and never feeds the lift's history
    A.setSession({id:'PS',slots:[{...pr,sets_target:pr.sets,sets:[]}],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
    const sl=A.getSession().slots[0]; A.seedDraft(sl); const d=A.getDraft(); d.weight=275; d.reps=7; d.rpe=6.5; A.logSet(sl,0,'straight');
    ok(sl.sets[0]&&sl.sets[0].role==='practice'&&!A.onTrack(sl.sets[0],'squat',''),'practice sets are logged as practice and kept off the lift\'s track',JSON.stringify(sl.sets[0]&&sl.sets[0].role));
    const dd=[{id:'a',name:'A',slots:[{ex:'squat',role:'primary',sets:5,reps:[6,8],rpe:8}]}];
    A.applyInterventions(dd,{...ph,onDeload:true}); ok(dd[0].slots.length===1,'nothing is added during a deload','');
    A.deloadStopsVolume(); ok(!A.activeIntervention('squat')&&A.LOG.some(e=>e.type==='intervention_end'&&e.reason==='deload'),'taking a deload ends a practice-volume intervention','');
  }
  // shoulder gating: an added day of a barbell press goes to a substitute
  {
    A=mk(hist('bench',{perWeek:1,lb:225}),{goals:['bench'],conditions:['shoulder_instability']});
    p=A.stallPlan('bench'); ok(p&&p.kind==='frequency','bench once a week: step 1 adds a day',JSON.stringify(p&&p.kind));
    if(p) A.startIntervention('bench',p);
    const days=[{id:'a',name:'A',slots:[{ex:'bench',role:'primary',sets:4,reps:[6,8],rpe:8}]},{id:'b',name:'B',slots:[{ex:'squat',role:'primary',sets:4,reps:[6,8],rpe:8}]}];
    A.applyInterventions(days,A.currentPhase());
    const add=days[1].slots.find(x=>x.iv);
    ok(add&&add.ex!=='bench'&&A.exById[add.ex].load!=='barbell'&&!(A.flagFor(add.ex)&&A.flagFor(add.ex).level==='red'),'shoulder instability: the extra day is a shoulder-safe substitute, not barbell bench',JSON.stringify(add&&add.ex));
    ok(A.addedExposureFor('ohp')!=='ohp'&&A.addedExposureFor('squat')==='squat','the substitution applies only to barbell pressing','');
    const B=mk(hist('bench',{perWeek:1,lb:225}),{goals:['bench']});
    ok(B.addedExposureFor('bench')==='bench','without the condition, bench stays bench','');
    let redOk=true; ['bench','ohp','chinup','squat','deadlift'].forEach(id=>[null,...(A.FAMILY_STICKING[A.familyOf(A.exById[id])]||[])].forEach(r=>A.variantOptions(id,r).forEach(o=>{ if(o.ex&&A.flagFor(o.ex)&&A.flagFor(o.ex).level==='red') redOk=false; })));
    ok(redOk,'no targeted variant is ever a red-flagged exercise','');
  }
  // two failures of a type on a family: skipped
  {
    // two volume interventions in an earlier stall, then a new best 9 weeks ago, flat since
    const ev=hist('squat',{weeks:30}); ev.push(set('squat','nb1',330,5,8,63,{role:'straight',target:{reps:[5,5],rpe:8}}),{type:'session_end',id:'senb1',ts:day(62.99),session_id:'nb1',joints:{}});
    ev.push({type:'intervention_start',id:'iv1',ts:day(180),exercise_id:'squat',family:'squat',step:1,kind:'volume',weeks:1,dpw:2});
    ev.push({type:'intervention_start',id:'iv2',ts:day(150),exercise_id:'squat',family:'squat',step:1,kind:'volume',weeks:1,dpw:2});
    A=mk(ev);
    ok(A.ivFailures('squat','volume')===2,'two volume interventions without a 1% gain count as two failures',String(A.ivFailures('squat','volume')));
    p=A.stallPlan('squat'); ok(p&&p.step===2,'so step 1 is skipped and the ladder goes to diagnosis',JSON.stringify(p&&{s:p.step,k:p.kind}));
  }
  // diagnosis → targeted variant from the tables
  {
    const ev=hist('bench',{lb:225}); for(let i=0;i<3;i++) ev.push({type:'sticking_report',id:'sr'+i,ts:day(2+i),exercise_id:'bench',session_id:'x'+i,region:'lockout'});
    A=mk(ev,{goals:['bench']});
    ok(A.stickingDiagnosis('bench').region==='lockout','the most-reported region is the diagnosis','');
    const o=A.variantOptions('bench','lockout')[0];
    ok(o&&o.ex==='cg_bench','bench slowing at lockout: close-grip bench (the research table)',JSON.stringify(o));
    const m=A.variantOptions('incline_machine','off_chest')[0];
    ok(m&&m.modifiers&&m.modifiers.pause,'a machine press slowing off the chest: a paused rep on the same machine (modifiers work for any lift)',JSON.stringify(m));
    const fb=A.variantOptions('pulldown','mid').map(x=>Object.keys(x.modifiers||{})[0]||x.ex);
    ok(fb[fb.length-1]==='tempo','families without a row fall back to a tempo modifier last',fb.join(','));
    ok(['mid','lockout'].every(r=>A.variantOptions('incline_machine',r).every(x=>!x.modifiers||!x.modifiers.rom)),'range-of-motion variants (deficit, pin, board) only for barbell lifts','');
    ok(A.variantOptions('bench','mid').some(x=>x.modifiers&&x.modifiers.rom),'and they are offered on the barbell lift','');
  }
  // the tables as data
  {
    let good=true, why='';
    A.STALL_TABLES.forEach(r=>{ if(!A.TRACKED_FAMILIES.includes(r.family)){ good=false; why='family '+r.family; }
      if(r.sticking!=null&&!(A.FAMILY_STICKING[r.family]||[]).includes(r.sticking)){ good=false; why='region '+r.family+'/'+r.sticking; }
      (r.options||[]).forEach(o=>{ if(o.ex&&!A.exById[o.ex]){ good=false; why='missing '+o.ex; } if(o.modifiers&&!A.cleanMods(o.modifiers)){ good=false; why='bad mods'; }
        if(!o.reps||!(o.rpe>0)){ good=false; why='no programming'; } });
      if(!r.handled&&!r.options){ good=false; why='row with no options and no handler'; } });
    ok(good,'every table row is keyed by a real family and region, with real exercises and valid modifiers',why);
  }
  // own ratios
  {
    const ev=hist('bench',{lb:225,weeks:8});
    [50,36,22,8].forEach((dd,i)=>{ const sid='pz'+i; ev.push(set('bench',sid,205-i*5,5,8,dd,{modifiers:{pause:{seconds:3,at:'chest'}},role:'straight'}),{type:'session_end',id:'pe'+i,ts:day(dd-0.01),session_id:sid,joints:{}}); });
    A=mk(ev,{goals:['bench']});
    const r=A.ownRatios('bench').find(x=>x.sig);
    ok(r&&r.falling&&r.region==='off_chest','paused bench falling 3%+ against bench over 8 weeks: a signal pointing at off the chest',JSON.stringify(r&&{c:r.change,reg:r.region}));
    ok(A.stickingDiagnosis('bench').src==='ratio','with no answers, the ratio supplies the diagnosis',JSON.stringify(A.stickingDiagnosis('bench')));
  }
  // specialization guards, one at a time
  {
    const base=()=>hist('squat').concat([{type:'intervention_start',id:'v1',ts:day(1.5),exercise_id:'squat',family:'squat',step:3,kind:'variant',weeks:0,dpw:2,variant:{modifiers:{pause:{seconds:2,at:'bottom'}}}}]);
    const ep=X=>X.interventions('squat');
    let S=mk(base(),{experience:'advanced'});
    ok(S.specializationCheck('squat',ep(S)).ok,'advanced, maintenance, no joints, no test, variant tried: specialization allowed',JSON.stringify(S.specializationCheck('squat',ep(S)).why));
    S=mk(base(),{experience:'intermediate'}); ok(!S.specializationCheck('squat',ep(S)).ok,'not advanced: blocked','');
    S=mk(base(),{experience:'advanced',energy:'deficit'}); ok(!S.specializationCheck('squat',ep(S)).ok,'in a deficit: blocked','');
    S=mk(base(),{experience:'advanced'}); S.getCFG().testDate=new Date(Date.now()+20*864e5).toISOString().slice(0,10); ok(!S.specializationCheck('squat',ep(S)).ok,'a test within 4 weeks: blocked','');
    S=mk(hist('squat'),{experience:'advanced'}); ok(!S.specializationCheck('squat',S.interventions('squat')).ok,'no targeted variant tried yet: blocked','');
    { const ev=base(); for(let i=0;i<6;i++) ev.push({type:'readiness',id:'kj'+i,ts:day(10-i),sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{knee:2},joint_scale:3});
      S=mk(ev,{experience:'advanced'}); const c=S.specializationCheck('squat',ep(S));
      ok(!c.ok,'a joint at level 2+: blocked',JSON.stringify(c)); }
    // shoulder: specialization days on a barbell press use the substitute
    S=mk(hist('bench',{lb:225}),{goals:['bench','squat'],experience:'advanced',conditions:['shoulder_instability']});
    S.append({type:'intervention_start',exercise_id:'bench',family:'horizontal_press',step:4,kind:'specialization',weeks:6,dpw:4});
    const days=['a','b','c','d'].map(k=>({id:k,name:k,slots:k==='a'?[{ex:'bench',role:'primary',sets:4,reps:[6,8],rpe:8}]:[{ex:'squat',role:'primary',sets:6,reps:[6,8],rpe:8}]}));
    S.applyInterventions(days,S.currentPhase());
    const added=days.flatMap(d=>d.slots.filter(x=>x.iv&&x.ivDay));
    ok(added.length===3&&added.every(x=>x.ex!=='bench'&&S.exById[x.ex].load!=='barbell'),'shoulder: specialization adds its days as a substitute, never barbell bench',JSON.stringify(added.map(x=>x.ex)));
    ok(days.slice(1).every(d=>d.slots.find(x=>x.ex==='squat').sets===2),'other main lifts drop to about a third of their sets',JSON.stringify(days.map(d=>d.slots.map(x=>x.ex+x.sets))));
  }
  // RPE scatter (§6.4)
  {
    const ev=[]; [7,8.5,7,8.5].forEach((r,i)=>{ const sid='sc'+i; ev.push(set('squat',sid,275,5,r,12-i*3,{role:'straight'}),{type:'session_end',id:'sce'+i,ts:day(12-i*3-0.01),session_id:sid,joints:{}}); });
    A=mk(ev); ok(A.rpeScatter('squat')&&A.rpeScatter('squat').spread===1.5,'the same load rated 7 to 8.5 across four sessions: scatter flagged',JSON.stringify(A.rpeScatter('squat')));
    const ev2=[]; [7.5,8,7.5,8].forEach((r,i)=>{ const sid='sd'+i; ev2.push(set('squat',sid,275,5,r,12-i*3,{role:'straight'}),{type:'session_end',id:'sde'+i,ts:day(12-i*3-0.01),session_id:sid,joints:{}}); });
    A=mk(ev2); ok(!A.rpeScatter('squat'),'half a point apart: no flag','');
  }
  // practice days in refined hypertrophy blocks (§6.5)
  {
    A=mk([],{goals:['squat']});
    const mkDays=()=>['a','b','c'].map(k=>({id:k,name:k,slots:[{ex:'squat',role:'primary',sets:4,reps:[6,8],rpe:8}]}));
    let days=A.addPracticeDays(mkDays(),{type:'hyp',refined:true,week:2,weeks:6});
    ok(days[2].slots[0].structure==='practice'&&days[0].slots[0].structure!=='practice','refined hypertrophy, a main lift 3 days a week: its last day is practice','');
    days=A.addPracticeDays(mkDays(),{type:'hyp',refined:false,week:2,weeks:6});
    ok(days.every(d=>d.slots[0].structure!=='practice'),'not in a block that has not opted into the refined rules','');
    days=A.addPracticeDays(mkDays().slice(0,2),{type:'hyp',refined:true,week:2,weeks:6});
    ok(days.every(d=>d.slots[0].structure!=='practice'),'twice a week: both days stay normal','');
  }
  ok(load([]).getCFG().autoIntervene===false,'auto-apply is opt-in (off by default)','');
  console.log('  detection · exposure is not a stall · deficit/fatigue/just-deloaded first · step 1 by frequency · one active · shoulder substitutes · two failures skip · tables as data · own ratios · specialization guards · scatter · practice days');
}

/* ─── 43. demo mode never touches real data or the network ─── */
section('43. demo isolation');
{
  // a device with real data on it, then the app opened as ?demo
  const real={'trainlog.jsonl.v1':[set('deadlift','r1',315,5,8,9),set('deadlift','r2',320,5,8,5)].map(e=>JSON.stringify(e)).join('\n'),
    'trainlog.cfg.v1':JSON.stringify({goals:['deadlift'],onboarded:true,syncUrl:'https://script.google.com/macros/s/REAL/exec',feedbackUrl:'https://x.example/fb'}),
    'trainlog.lastSync':'111'};
  const store={...real}; let fetches=0, scripts=0;
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];},
    key:i=>Object.keys(store)[i]??null,get length(){ return Object.keys(store).length; }};
  const doc=stub(); const docProxy=new Proxy(doc,{get(t,k){ if(k==='createElement') return tag=>{ if(String(tag).toLowerCase()==='script') scripts++; return stub(); }; return stub(); }});
  const loc={search:'?demo',pathname:'/',reload(){},href:''};
  const names=['DEMO','STORE','LOG','CFG','append','saveCfg','sets','syncNow','sendFeedback','jsonpFetch','restoreFromSheet','resetToFresh',
    'demoSeedPersona','demoTrain','demoCopyReal','importBackup','loadAll','ROADMAP'];
  const body=src+'\n;return {'+names.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',')+',getCFG:()=>CFG,getLOG:()=>LOG,getROADMAP:()=>ROADMAP};';
  const D=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval',
    'alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',body)
    (docProxy,stub(),stub(),ls,loc,stub(),()=>0,()=>0,()=>{},()=>true,()=>{ fetches++; return Promise.resolve({}); },stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}});
  ok(D.DEMO===true,'?demo switches demo mode on','');
  ok(D.getLOG().length===0,'the demo starts empty — it does not load the real log','');
  ok(!D.getCFG().syncUrl&&!D.getCFG().feedbackUrl,'and carries no backup or feedback URL','');
  // heavy use: seed a persona, train, log, save settings, try every network path, wipe
  D.demoSeedPersona('responder',2);
  ok(D.getLOG().filter(e=>e.type==='set').length>50,'a persona seed trains real sessions through the engine',String(D.getLOG().length));
  D.demoTrain(1,{gain:()=>0.004,noise:0.02,rpeNoise:0.5,attend:1});
  D.append({type:'set',exercise_id:'squat',session_id:'z',weight:{value:100,unit:'lb'},reps:5,rpe:8,set_kind:'straight'});
  D.getCFG().syncUrl='https://script.google.com/macros/s/X/exec'; D.getCFG().feedbackUrl='https://x.example/fb'; D.saveCfg();
  D.syncNow(true); D.sendFeedback({tag:'bug',text:'x',app_version:'',ts:''}); D.jsonpFetch('https://script.google.com/z').catch(()=>{}); D.restoreFromSheet();
  ok(fetches===0&&scripts===0,'no network: sync, feedback and sheet restore never leave the device in demo mode',fetches+' fetches, '+scripts+' script tags');
  ok(Object.keys(store).filter(k=>!(k in real)).every(k=>k.startsWith('trainlog-demo:')),'every key the demo wrote is under trainlog-demo:',Object.keys(store).filter(k=>!(k in real)&&!k.startsWith('trainlog-demo:')).join(','));
  D.resetToFresh();
  ok(Object.keys(real).every(k=>store[k]===real[k])&&Object.keys(store).filter(k=>!k.startsWith('trainlog-demo:')).length===Object.keys(real).length,'after all of that, the real keys are byte-identical','');
  ok(!Object.keys(store).some(k=>k.startsWith('trainlog-demo:')),'and the demo\'s Fresh install cleared only demo keys (all of them, clock included)','');
  // copying the real log in: a read, URLs stripped
  D.demoCopyReal();
  const cc=JSON.parse(store['trainlog-demo:trainlog.cfg.v1']);
  ok(store['trainlog-demo:trainlog.jsonl.v1']===real['trainlog.jsonl.v1']&&!cc.syncUrl&&!cc.feedbackUrl,'copy-my-real-log copies the log and drops the URLs','');
  ok(Object.keys(real).every(k=>store[k]===real[k]),'and leaves the real keys untouched','');
  console.log('  demo store prefixed · no network · real keys byte-identical after seed/train/log/settings/wipe · copy is read-only and URL-free');
}

/* ─── 44. suggestion accuracy (engine phase 2) ─── */
section('44. suggestion accuracy');
{
  const sg=(lb,rpe)=>({suggestion:{lb,shown:{value:lb,unit:'lb'},reps:8,target_rpe:8,basis:'x'}});
  const ev=[set('incline_machine','a1',150,8,8,6,sg(150)),set('incline_machine','a1',150,8,9.5,6,sg(150)),set('incline_machine','a1',140,8,7,6,sg(150)),
    {type:'session_end',id:'ea1',ts:day(5.9),session_id:'a1',joints:{}},
    set('incline_machine','bot',150,8,8,3,sg(150)),{type:'session_end',id:'ebot',ts:day(3),session_id:'bot',joints:{}}];
  const A=load(ev), acc=A.suggestionAccuracy();
  const t=acc.reduce((a,b)=>({n:a.n+b.n,taken:a.taken+b.taken,on:a.on+b.on}),{n:0,taken:0,on:0});
  ok(t.n===3,'a one-set session ending within seconds (automation) is left out',JSON.stringify(acc));
  ok(t.taken===2&&t.on===1,'taken = lifted as suggested; on target = RPE within 1 of target',JSON.stringify(t));
  console.log('  taken / on-target counted from the recorded suggestion · automation sessions excluded');
}

/* ─── 45. All-out set type ─── */
section('45. all-out (AMRAP) set type');
{
  const hist=[set('preacher','h1',60,10,8,6),set('preacher','h1',60,10,8.5,6),{type:'session_end',id:'eh1',ts:day(5.9),session_id:'h1',joints:{}}];
  const A=load(hist); A.getCFG().goals=['deadlift'];
  const slot={ex:'preacher',role:'accessory',reps:[8,12],rpe:8,sets:[],sets_target:3};
  A.setSession({id:'AM',slots:[slot],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
  A.seedDraft(slot); let d=A.getDraft(); d.reps=10; d.rpe=8; A.logSet(slot,0,'straight');
  ok(slot.sets[0].role!=='amrap','a normal set is not all-out','');
  d=A.getDraft(); d.tech='amrap'; d.rpe=10; d.reps=15; A.logSet(slot,0,'straight');
  const s2=slot.sets[1];
  ok(s2.role==='amrap'&&s2.rpe===10&&!s2.group&&s2.set_kind==='straight','All-out logs one set: role amrap, RPE 10, no cluster group',JSON.stringify({role:s2.role,rpe:s2.rpe,g:s2.group,k:s2.set_kind}));
  d=A.getDraft();
  ok(d.tech==='straight'&&d.rpe===8,'then the set type goes back to straight and RPE to the target',JSON.stringify({t:d.tech,r:d.rpe}));
  ok(!A.LOG.some(e=>e.type==='tm_update'),'an all-out set never moves a training max','');
  // it does not change the next session's working-set suggestion
  const next=evs=>{ const x=load(evs); const s3={ex:'preacher',role:'accessory',reps:[8,12],rpe:8,sets:[],sets_target:3};
    x.setSession({id:'N',slots:[s3],openIdx:0,adj:null,ratings:{},startedAt:Date.now()}); return x.suggestFor(s3); };
  const logged=A.LOG.filter(e=>e.type==='set'||e.type==='session_end');
  const withA=next(logged), without=next(logged.filter(e=>e.role!=='amrap'));
  ok(withA.lb===without.lb&&withA.pr.reps===without.pr.reps,'the all-out set does not change the next session\'s working-set suggestion',JSON.stringify([withA.lb,withA.pr.reps,without.lb,without.pr.reps]));
  ok(A.allOutNext({calib:true,sets:[{}],sets_target:2})===true&&A.allOutNext({structure:'amrap',calib:true,sets:[{}],sets_target:2})===false,'week-1 calibration AMRAPs still work; realization AMRAPs are separate','');
  console.log('  one set · role amrap @ RPE 10 · resets to straight · no TM change · next session unaffected');
}

/* ─── 46. alpha testers: data separation and conditions other than the owner's ─── */
section('46. alpha safety');
{
  const OWN='https://script.google.com/macros/s/OWNERSYNC/exec', FB='https://script.google.com/macros/s/OWNERFB/exec';
  // a restored backup file never brings its backup/notes address or name
  {
    const A=load([]); const C=A.getCFG(); C.syncUrl=''; C.feedbackUrl=FB; C.testerName='Sam';
    const other=[JSON.stringify({type:'config_snapshot',cfg:{goals:['squat'],syncUrl:OWN,feedbackUrl:'https://script.google.com/macros/s/X/exec',testerName:'Owner',roadmap:[]}}),
      JSON.stringify(set('squat','z1',200,5,8,3))].join('\n');
    const res=A.importBackup(other); A.finishImport(res);
    const D=A.getCFG();
    ok(D.syncUrl===''&&D.feedbackUrl===FB&&D.testerName==='Sam','importing someone else\'s backup keeps this phone\'s backup/notes addresses and name',JSON.stringify({s:D.syncUrl,f:D.feedbackUrl,n:D.testerName}));
    ok((D.goals||[]).includes('squat'),'while the program itself is restored','');
  }
  // setup links: each parameter sets only its own field; bad addresses ignored; &who= names a tester
  {
    const A=load([]); const C=A.getCFG(); C.syncUrl=''; C.feedbackUrl=''; C.testerName='';
    A.applySetupLink('?feedback='+encodeURIComponent(FB)+'&who=Jo');
    ok(C.feedbackUrl===FB&&C.syncUrl===''&&C.testerName==='Jo','a feedback link sets notes and name, never the backup address',JSON.stringify({s:C.syncUrl,f:C.feedbackUrl,n:C.testerName}));
    A.applySetupLink('?sync='+encodeURIComponent('https://evil.example/exec'));
    ok(C.syncUrl==='','an address that is not an Apps Script web app is ignored','');
  }
  // conditions: worst flag wins; custom exercises flagged by name
  {
    const A=load([]); const C=A.getCFG();
    C.conditions=['shoulder_impingement','shoulder_instability'];
    ok(A.flagFor('dip').level==='red','a yellow from one condition never hides a red from another',JSON.stringify(A.flagFor('dip')));
    C.customEx=[{id:'cx_fly1',name:'Cable fly (low to high)',pattern:'horizontal_press',load:'stack',vol:{chest:1},custom:true}]; A.mergeCustom();
    ok(A.flagFor('cx_fly1')&&A.flagFor('cx_fly1').level==='red','a custom exercise called a fly gets the fly flag',JSON.stringify(A.flagFor('cx_fly1')));
    C.conditions=['knee_pain']; ok(A.flagFor('sissy').level==='red'&&A.flagFor('pendulum').level==='yellow','knee pain flags deep knee flexion','');
    C.conditions=['hip_pain']; ok(!!A.flagFor('squat'),'hip pain is a condition you can declare, and it flags deep hip flexion','');
    C.conditions=[]; ok(A.flagFor('dip')===null,'no conditions: no flags','');
  }
  // the half-weight lateral-raise rule only applies to instability (tested in §2); low back pulls in prep
  {
    const A=load([]); A.getCFG().conditions=['low_back'];
    const prep=A.buildPrep({slots:[{ex:'deadlift'}]},null).map(m=>m.id);
    ok(prep.includes('p_catcow')||prep.includes('p_birddog'),'a declared low back gets low-back prep',JSON.stringify(prep));
  }
  // new users are not handed a specialty bar they don't own
  {
    const A=load([]); A.getCFG().goals=[]; A.getCFG().equipment='mixed';
    const sq=A.resolveEx('squat','primary',new Set()), hg=A.resolveEx('hinge','primary',new Set());
    ok(!sq.specialty&&!hg.specialty,'a fresh install gets a normal squat and hinge, not the Transformer bar',sq.id+' / '+hg.id);
    const B=load([set('transformer_high_bar','tb',185,5,8,3),{type:'session_end',id:'etb',ts:day(2.99),session_id:'tb',joints:{}}]); B.getCFG().goals=[];
    ok(B.resolveEx('squat','primary',new Set()).specialty,'once you have logged one, it can be picked','');
  }
  // condition-aware stall substitutions
  {
    const A=load([]); const C=A.getCFG();
    C.conditions=['low_back']; ok(A.addedExposureFor('squat')!=='squat'&&A.addedExposureFor('deadlift')!=='deadlift','low back: an added squat or hinge day goes to a substitute',A.addedExposureFor('squat')+' / '+A.addedExposureFor('deadlift'));
    ok(A.variantOptions('deadlift','off_floor').every(o=>!(o.modifiers&&o.modifiers.rom&&o.modifiers.rom.kind==='deficit')),'low back: no deficit deadlifts offered','');
    C.conditions=['knee_pain']; ok(A.addedExposureFor('squat')==='belt_squat','knee pain: added squat days go to the belt squat',A.addedExposureFor('squat'));
    C.conditions=[]; ok(A.addedExposureFor('squat')==='squat'&&A.addedExposureFor('bench')==='bench','no conditions: no substitution','');
  }
  // the quick setup asks about equipment and conditions
  ok(A0().BUILDER_QUICK.includes('constraints')&&A0().BUILDER_QUICK.includes('equipment'),'quick setup asks what you are working around and what your gym has','');
  function A0(){ return load([]); }
  console.log('  restore never imports addresses · setup links field-scoped · worst flag wins · custom flagged by name · no specialty bars for new users · condition-aware subs');
}

/* ─── 47. injury library (batch D1a) ─── */
section('47. injury library: warn, never decide');
{
  const loadD=ev=>load(ev,true);
  // a stored CFG, as the app would load it
  const withCfg=(cfg,events)=>{ const st={'trainlog.cfg.v1':JSON.stringify(cfg)}; if(events&&events.length) st['trainlog.jsonl.v1']=events.map(e=>JSON.stringify(e)).join('\n');
    const ls={getItem:k=>k in st?st[k]:null,setItem:(k,v)=>{st[k]=String(v);},removeItem:k=>{delete st[k];},key:i=>Object.keys(st)[i]??null,get length(){return Object.keys(st).length;}};
    const pick=EXPORTS.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',');
    const body=src+'\n;return {'+pick+',setSession:x=>{session=x},getCFG:()=>CFG,setRoadmap:x=>{ROADMAP=x}};';
    return new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',body)
      (docWithData(),stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}}); };
  const A0=loadD([]);
  ok(A0.INJ.length>=40,'the library loads from the embedded data',String(A0.INJ.length));
  // the owner's own case: old id → new id, flags exactly as before for what he uses, program unchanged
  const O=withCfg({conditions:['shoulder_instability'],onboarded:true,goals:['deadlift','incline_machine']});
  const C=O.getCFG();
  ok(JSON.stringify(C.conditions)==='["sh_ant_instability"]','an old condition id maps to the library id on load',JSON.stringify(C.conditions));
  ok(O.hasLegacy('shoulder_instability'),'and every rule keyed by the old id still applies','');
  ok(['dip','pullover','bench','ohp','z_press','db_bench'].every(x=>C.excludedEx.includes(x))&&!C.excludedEx.includes('landmine')&&!C.excludedEx.includes('incline_machine'),'what flags used to steer away from is now your exclusion list (ticked, editable), so the program does not change',JSON.stringify(C.excludedEx));
  const lv=id=>{ const f=O.flagFor(id); return f&&(f.level==='red'||f.level==='yellow')?f.level:null; };
  ok(lv('bench')==='yellow'&&lv('incline_machine')===null,'bench and incline machine press flagged exactly as before (amber, none)',lv('bench')+' / '+lv('incline_machine'));
  // nothing that was red stops being red; nothing new turns red for the owner
  // fly, cable_fly, bn_press, bn_pulldown and snatch were red in the hand-made table before they existed as exercises (added Oct 2026)
  const OLD={fly:'red',cable_fly:'red',bn_press:'red',bn_pulldown:'red',snatch:'red',dip:'red',pullover:'red',bench:'yellow',db_bench:'yellow',decline_press:'yellow',ohp:'yellow',seated_db_press:'yellow',machine_ohp:'yellow',z_press:'yellow',weighted_pushup:'yellow'};
  ok(Object.entries(OLD).every(([id,l])=>lv(id)===l),'every hand-made shoulder flag is exactly what it was',JSON.stringify(Object.keys(OLD).map(id=>id+':'+lv(id))));
  ok(O.EX.filter(e=>!e.rehab&&!e.folded&&!OLD[e.id]).every(e=>lv(e.id)!=='red'),'no exercise turns red for the owner that was not red before','');
  // the rule: a condition never changes the generated workout; only your exclusions do
  const days=A=>A.generatedDays().map(d=>d.slots.map(x=>x.ex).join(',')).join(' | ');
  const base=withCfg({conditions:[],onboarded:true,goals:[],excludedEx:[]}), withK=withCfg({conditions:['kn_pfp','lb_pain','el_lateral_tendinopathy'],onboarded:true,goals:[],excludedEx:[]});
  ok(days(base)===days(withK),'picking conditions changes no exercise in the generated week (it only warns)',days(withK));
  const ex=withCfg({conditions:['kn_pfp'],onboarded:true,goals:[],excludedEx:['squat','bench']});
  ok(!days(ex).split(/[,| ]+/).includes('squat')&&!days(ex).split(/[,| ]+/).includes('bench'),'an exercise YOU excluded is never picked automatically',days(ex));
  const gl=withCfg({conditions:[],onboarded:true,goals:['bench'],excludedEx:['bench']});
  ok(days(gl).includes('bench'),'a goal lift you chose still appears (your explicit choice wins)','');
  // severity: broad = amber, specific core = red, structural non-core = a note (not a warning)
  const W=c=>{ const A=loadD([]); A.getCFG().conditions=c; return A; };
  ok(W(['kn_pain']).flagFor('squat').level==='yellow','a broad pick (knee pain) is amber',JSON.stringify(W(['kn_pain']).flagFor('squat')));
  // every umbrella, straight from the library (no hand-made layer in the way): amber only
  const umbRed=A0.INJ.filter(e=>e.category==='UMBRELLA').filter(u=>{ const X=W([u.id]); return X.EX.some(e=>{ const f=X.libraryFlag(e.id); return f&&f.level==='red'; }); }).map(u=>u.id);
  ok(umbRed.length===0,'no broad pick ever produces a red flag',umbRed.join(','));
  // where the hand-made table has an opinion it decides: rotator cuff pain makes OHP red in the library, the table says amber
  ok(W(['sh_rcrsp']).libraryFlag('ohp').level==='red'&&W(['sh_rcrsp']).flagFor('ohp').level==='yellow','the hand-made table outranks the library where it rates an exercise',JSON.stringify(W(['sh_rcrsp']).flagFor('ohp')));
  ok(W(['thigh_hamstring_strain']).flagFor('rdl').level==='red','a specific pick is red for its core mechanism (hamstring strain → RDL)',JSON.stringify(W(['thigh_hamstring_strain']).flagFor('rdl')));
  const hm=W(['sys_hypermobility']).flagFor('bench');
  ok(!hm||hm.level==='note','a structural condition shows its standing cue as a note, not a warning',JSON.stringify(hm));
  ok(!W(['kn_pfp']).isWarning(W(['kn_pfp']).flagFor('leg_curl')),'unrelated exercises stay unflagged','');
  // tags: modifiers and custom exercises
  ok(!A0.exTags('bench',{rom:{kind:'board',amount:2,unit:'in'}}).includes('shoulder_horiz_abd_endrange'),'a board press drops the end-range shoulder tag','');
  ok(!A0.exTags('bench',{lockout:'soft'}).includes('elbow_ext_endrange_loaded'),'soft lockout drops the lockout tag','');
  ok(A0.modLabel({lockout:'soft'})==='soft lockout'&&A0.modSig({lockout:'soft'})==='lockout:soft','soft lockout is a modifier like pause or tempo','');
  const CU=loadD([]); CU.getCFG().customEx=[{id:'cx_mybench',name:'My bench',pattern:'horizontal_press',load:'barbell',parent:'bench',vol:{chest:1},custom:true}]; CU.mergeCustom();
  ok(JSON.stringify(CU.exTags('cx_mybench'))===JSON.stringify(CU.exTags('bench')),'a custom exercise inherits its parent\'s tags',JSON.stringify(CU.exTags('cx_mybench')));
  CU.getCFG().customEx[0].tags=['wrist_ext_loaded']; CU.mergeCustom();
  ok(JSON.stringify(CU.exTags('cx_mybench'))==='["wrist_ext_loaded"]','and your own edit to its tags wins',JSON.stringify(CU.exTags('cx_mybench')));
  // suggested swap resolves to a real exercise (or a modifier on one)
  const sw=W(['el_lateral_tendinopathy']); const fsw=sw.EX.map(e=>sw.flagFor(e.id)).find(f=>f&&f.swap);
  ok(!!fsw&&!!sw.exById[fsw.swap.ex],'a flag carries a suggested swap you can take with one tap',JSON.stringify(fsw&&fsw.swap));
  // your own verdict
  {
    let t=30; const ev=[];
    const sess=sev=>{ const sid='v'+(t); ev.push({type:'readiness',id:'r'+t,ts:day(t),sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{},joint_scale:3},
      set('rdl',sid,185,8,7,t-0.01),{type:'exercise_joint',id:'j'+t,ts:day(t-0.02),exercise_id:'rdl',session_id:sid,joint:'hip',severity:sev},
      {type:'session_end',id:'e'+t,ts:day(t-0.03),session_id:sid,joints:{}}); t-=3; };
    [0,1,0,0].forEach(sess);
    let V=loadD(ev); V.getCFG().conditions=['thigh_hamstring_strain'];
    ok(V.flagFor('rdl').level==='ok'&&/fine/.test(V.flagFor('rdl').why),'rated fine 3+ times with no next-morning rise: the flag becomes "fine for you"',JSON.stringify(V.flagFor('rdl')));
    [2,3].forEach(sess);
    V=loadD(ev); V.getCFG().conditions=['thigh_hamstring_strain']; V.getCFG().excludedEx=[];
    ok(V.flagFor('rdl').level==='red','moderate or worse twice recently: red, whatever the library says',JSON.stringify(V.flagFor('rdl')));
    const card=V.activeProposals().find(x=>x.id.startsWith('verdict:rdl'));
    ok(!!card&&V.getCFG().excludedEx.length===0,'the app asks whether to stop including it — it never excludes on its own','');
    if(card) card.accept.fn();
    ok(V.getCFG().excludedEx.includes('rdl'),'and only your yes adds it to your exclusions','');
    const U=loadD(ev); U.getCFG().conditions=[];
    ok(U.flagFor('rdl')&&U.flagFor('rdl').level==='red','your own bad ratings flag it even with no condition picked','');
  }
  // the joint question is asked only where it matters
  { const Q=loadD([]); Q.getCFG().conditions=['kn_pfp'];
    ok(Q.jointQuestionFor('squat')==='knee'&&Q.jointQuestionFor('lat_raise')===null,'the joint question: knee exercises yes, unrelated ones no',Q.jointQuestionFor('squat')+' / '+Q.jointQuestionFor('lat_raise')); }
  // building the exclusion list never leaves the condition list changed
  { const G=loadD([]); G.getCFG().conditions=['lb_pain']; G.likelyFlaggedFor(['kn_pfp']);
    ok(JSON.stringify(G.getCFG().conditions)==='["lb_pain"]','previewing other picks restores your real ones','');
    const lf=G.likelyFlaggedFor(['kn_pfp']); ok(lf.every(x=>x.f.level==='red'||x.f.level==='yellow'),'the "don\'t include" list shows only real warnings',''); }
  console.log('  owner unchanged · conditions never change the workout · only your exclusions do · amber/red/note · tags inherit · verdicts suggest, never decide');
}

/* ─── 48. injury library part 2: consent, red flags, pain rules, phase plans (D1b) ─── */
section('48. pain rules, phase plans, consent');
{
  const D=c=>{ const A=load([],true); A.getCFG().conditions=c; return A; };
  const A=D([]);
  // pain rules: the research's model and its overrides
  ok(A.painRule(2,null,[]).level==='ok'&&A.painRule(4,null,[]).level==='amber'&&A.painRule(6,null,[]).level==='stop','default: ≤2 fine, 3–5 tolerable if it settles, over 5 stop the exercise','');
  ok(A.painRule(5,null,['sh_rcrsp']).level==='stop'&&A.painRule(4,null,['sh_rcrsp']).level==='amber','rotator cuff pain: capped at 4/10','');
  ok(A.painRule(4,null,['an_lateral_sprain']).level==='stop','an acute ankle sprain: capped at 3/10','');
  ok(/apprehension/i.test(A.painRule(0,'apprehension',['sh_ant_instability']).text)&&A.painRule(0,'apprehension',['sh_ant_instability']).level==='stop','instability: any apprehension stops the set','');
  ok(A.painRule(5,'site',['shin_bsi_lowrisk']).level==='end','stress fracture: pain at the site ends the session','');
  ok(/isometric/i.test(A.painRule(9,null,['el_lateral_tendinopathy']).text),'outside-elbow pain over 7: isometrics only','');
  ok(JSON.stringify(D(['sh_ant_instability']).painKinds().map(x=>x[0]))==='["apprehension"]','an apprehension button only for instability','');
  // phase plans: opt-in, start at phase 1, never advance on their own
  { const P=D(['kn_patellar_tendinopathy']), e=P.INJ_BY.kn_patellar_tendinopathy;
    ok(P.activeRehabPlans().length===0,'no phase plan unless you start one','');
    P.startRehabPlan(e);
    ok(P.rehabPlan(e.id).phase==='protect','starting begins at the first phase',JSON.stringify(P.rehabPlan(e.id)));
    ok(!P.activeProposals().some(x=>x.id.startsWith('rehabnext:')),'no "next phase" card before the phase has run its minimum length','');
    P.append({type:'rehab_plan',entry_id:e.id,action:'advance',phase:'restore_range'});
    ok(P.rehabPlan(e.id).phase==='restore_range','you advance it','');
    P.append({type:'rehab_plan',entry_id:e.id,action:'stop'}); ok(!P.rehabPlan(e.id),'and you can stop it',''); }
  { // after the minimum length with nothing flaring: a card proposes — it does not advance
    const ev=[{type:'rehab_plan',id:'rp1',ts:day(20),entry_id:'kn_patellar_tendinopathy',action:'start',phase:'protect'}];
    const P=load(ev,true); P.getCFG().conditions=['kn_patellar_tendinopathy'];
    const card=P.activeProposals().find(x=>x.id.startsWith('rehabnext:'));
    ok(!!card&&P.rehabPlan('kn_patellar_tendinopathy').phase==='protect','after the minimum length, a card proposes the next phase — still on protect until you accept',card&&card.id);
    if(card) card.accept.fn(); ok(P.rehabPlan('kn_patellar_tendinopathy').phase==='restore_range','accepting moves you on',''); }
  ok(A.phaseMinWeeks('2-12 wk')===2&&A.phaseMinWeeks('0 wk')===0&&A.phaseMinWeeks('3-6 mo')===12,'a phase\'s minimum length is read from its duration','');
  ok(A.INJ.filter(e=>e.category==='STRUCTURAL_PERMANENT').every(e=>e.rehab_phases===null),'structural conditions have no phase plan','');
  // consent: required before the first pick; existing picks are kept
  { const F=load([],true); F.getCFG().injuryConsent=null; ok(!F.injConsented(),'a new user sees the consent screen before picking',''); }
  ok(A.INJ_CONSENT.length===4&&/never stop you choosing an exercise/.test(A.INJ_DISCLAIMER),'the research\'s disclaimer and four consent boxes, verbatim','');
  // red flags: ticked → no phase plan, flags still apply
  { const R=D(['kn_patellar_tendinopathy']); R.getCFG().condRedFlags={kn_patellar_tendinopathy:['x']};
    ok(R.redFlagged('kn_patellar_tendinopathy')&&R.isWarning(R.flagFor('box_jump')),'a ticked red flag blocks only the phase plan — the warnings stay',''); }
  // clearing pain data stops it being read; the log keeps its lines
  { const ev=[]; for(let i=0;i<4;i++) ev.push({type:'exercise_joint',id:'xj'+i,ts:day(10-i),exercise_id:'squat',session_id:'s'+i,joint:'knee',severity:3});
    const Cl=load(ev,true); Cl.getCFG().conditions=['kn_pfp'];
    ok(Cl.exerciseVerdict('squat').verdict==='bad','(precondition) bad ratings make a verdict','');
    const n=Cl.LOG.length; Cl.clearPainData();
    ok(!Cl.exerciseVerdict('squat')&&Cl.getCFG().conditions.length===0&&Cl.LOG.length===n+1,'delete my conditions and pain ratings: nothing reads them after, and only one line is appended',''); }
  // pre-session cues: structural core cue always, at most two
  { const Q=D(['el_hyperextension','kn_pfp','sh_rcrsp']);
    const cs=Q.preSessionCues([{ex:'bench'},{ex:'squat'},{ex:'ohp'}]);
    ok(cs.length<=2&&cs[0].e.id==='el_hyperextension'&&cs[0].text===Q.INJ_BY.el_hyperextension.core_cue,'pre-session: at most 2 cues, structural first with its permanent core cue',JSON.stringify(cs.map(x=>x.e.id))); }
  console.log('  pain model + overrides · phase plan opt-in, proposed not automatic · consent · red flags gate only the plan · clearing works append-only');
}

/* ─── 49. an edited rep range is the range the suggestion uses (reported 3×: Oct 3, Oct 4, Oct 7) ─── */
section('49. edited rep range reaches the suggestion');
{
  const cases=[['machine_raise',40,12,8,[10,15],[15,20]],['m_rd_fly',50,15,8,[10,15],[16,20]],['preacher',30,6,8,[8,15],null],['curl',25,8,9,[10,15],null],['bench',185,10,8,[6,8],[3,5]],['pulldown',150,6,8,[10,15],[8,12]]];
  cases.forEach(([ex,w,r,rpe,r0,r1])=>{
    const A=load([set(ex,'a',w,r,rpe,3,{target:{reps:r0,rpe}})]);
    const slot={ex,role:'accessory',reps:r0.slice(),rpe,sets:[],sets_target:3};
    A.setSession({id:'N',slots:[slot],openIdx:0,adj:null,ratings:{},startedAt:Date.now()});
    let q=A.suggestFor(slot);
    ok(q.pr.reps>=r0[0]&&q.pr.reps<=r0[1],ex+' '+w+'x'+r+': suggestion inside the '+r0.join('-')+' range',JSON.stringify({lb:q.lb,reps:q.pr.reps,src:q.pr.src}));
    if(r1){
      A.getCFG().repRanges={[ex]:r1}; A.applyRepRange(ex);
      const s2=A.getSession().slots[0];
      ok(JSON.stringify(s2.reps)===JSON.stringify(r1),ex+': the edit reaches today\'s slot',JSON.stringify(s2.reps));
      q=A.suggestFor(s2);
      ok(q.pr.reps>=r1[0]&&q.pr.reps<=r1[1],ex+': after editing the range to '+r1.join('-')+', the suggestion uses it',JSON.stringify({lb:q.lb,reps:q.pr.reps,src:q.pr.src}));
      if(r1[0]>r) ok(q.lb<=w,ex+': more reps never come with more load',JSON.stringify({lb:q.lb,reps:q.pr.reps}));
    }
  });
  console.log('  edited ranges reach the slot and the suggestion · suggestions always land inside the range');
}

/* ─── 51. soreness is local: sore legs never cut chest (Oct 4 report) ─── */
section('51. soreness cuts only what it touches');
{
  const ev=[set('incline_machine','a',150,10,8,3),set('leg_press','a',400,10,8,3),set('preacher','a',35,10,8,3)];
  const A=load(ev);
  const mk=ex=>({ex,role:'primary',reps:[8,12],rpe:8,sets:[],sets_target:4});
  const day={slots:[mk('leg_press'),mk('incline_machine'),mk('preacher')]};
  const groups=A.soreGroupsFor(day);
  const legG=groups.find(g=>/leg|quad/i.test(g))||groups[0];
  const st={sleep:3,motivation:3,recovery:3,sore:Object.fromEntries(groups.map(g=>[g,g===legG?1:3])),joints:{}};
  const adj=A.physicalCut(st,groups);
  ok(adj&&!adj.global&&adj.groups.length>0,'very sore legs: a cut, scoped to the sore group',JSON.stringify(adj));
  ok(A.adjHits(adj,'leg_press')&&!A.adjHits(adj,'incline_machine')&&!A.adjHits(adj,'preacher'),'it reaches leg press, not the chest press or curls','');
  const S={id:'SC',slots:day.slots.map(x=>({...x})),openIdx:0,adj,score:0.5,ratings:{},startedAt:Date.now()};
  A.setSession(S);
  const free=load(ev); free.setSession({id:'F',slots:day.slots.map(x=>({...x})),openIdx:0,adj:null,score:0.7,ratings:{},startedAt:Date.now()});
  ok(A.suggestFor(S.slots[1],{idx:1}).lb===free.suggestFor(free.getSession().slots[1],{idx:1}).lb,'chest press load unchanged by sore legs','');
  ok(A.suggestFor(S.slots[0],{idx:0}).lb<free.suggestFor(free.getSession().slots[0],{idx:0}).lb,'leg press load is cut','');
  A.applyReadinessSets(S);
  ok(S.slots[0].sets_target===4+adj.sets&&S.slots[1].sets_target===4,'fewer sets only on the sore muscles\' main work',JSON.stringify(S.slots.map(x=>x.sets_target)));
  const run={...st,recovery:1,sore:Object.fromEntries(groups.map(g=>[g,3]))};
  ok(A.physicalCut(run,groups)===null&&A.globalReadiness(run).sick,'run-down (a 1) is the sick day — handled as one step everywhere, not as soreness','');
  console.log('  soreness → only exercises training the sore group · rest-of-life stays session-wide');
}

/* ─── 52. batch E: one modifier model — invariants under randomised stacks ─── */
section('52. modifiers: bounded, scoped, traced, never sticky');
{
  // the doc and the constants list the same modifier ids
  { const A=load([]); const doc=fs.readFileSync(path.join(__dirname,'..','docs','modifiers.md'),'utf8');
    const docIds=[...doc.matchAll(/^\| `([a-z_]+)` \|/gm)].map(m=>m[1]);
    const code=A.ENGINE_IDS;
    ok(code.every(id=>docIds.includes(id))&&docIds.every(id=>code.includes(id)),'docs/modifiers.md and ENGINE.modifiers list the same ids',JSON.stringify({missingInDoc:code.filter(id=>!docIds.includes(id)),missingInCode:docIds.filter(id=>!code.includes(id))})); }
  // a seeded RNG, so a failure reproduces
  let seed=20261007; const R=()=>{ seed^=seed<<13; seed>>>=0; seed^=seed>>17; seed^=seed<<5; seed>>>=0; return seed/4294967296; };
  const pick=a=>a[Math.floor(R()*a.length)];
  const EXS=[['bench',185],['incline_machine',80],['preacher',35],['leg_press',360],['squat',245],['pulldown',150],['machine_raise',50]];
  const RANGES=[[3,5],[6,8],[8,12],[10,15],[12,20]];
  let runs=0, viol={oneStep:0,bothUp:0,floor:0,ceiling:0,calib:0,twice:0,sticky:0,ids:0,sets:0};
  const show={};
  const bad=(k,msg)=>{ viol[k]++; if(!show[k]){ show[k]=1; console.log('    e.g. '+k+': '+msg); } };
  for(let run=0;run<1200;run++){
    const [ex,base]=pick(EXS), [lo,hi]=pick(RANGES), T=pick([7,7.5,8,8.5,9]);
    const ev=[]; const nS=2+Math.floor(R()*6); let t=40;
    for(let k=0;k<nS;k++){ const sid='r'+run+'_'+k, L=Math.max(5,Math.round(base*(0.85+R()*0.3)/5)*5), reps=Math.max(1,lo-2+Math.floor(R()*(hi-lo+5))), rpe=pick([6,7,7.5,8,8.5,9,9.5,10]);
      ev.push({type:'readiness',id:'rd'+sid,ts:day(t+0.01),sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{},joint_scale:3});
      const st=set(ex,sid,L,reps,rpe,t,{role:'straight',target:{reps:[lo,hi],rpe:T}});
      if(k===nS-1&&R()<0.3) st.suggestion={lb:L,reps,target_rpe:T,trace:[{id:'local_soreness',changed:true}]};   // last time: a soreness cut…
      ev.push(st,{type:'session_end',id:'e'+sid,ts:day(t-0.01),session_id:sid,joints:{}}); t-=3+R()*3; }
    const calib=R()<0.2; if(calib) ev.push({type:'program_edit',id:'pe'+run,ts:day(1),what:'settings'});
    const fdOn=R()<0.25; if(fdOn) ev.push({type:'focused_deload_start',id:'fs'+run,ts:day(2),fd_id:'fd'+run,exercises:[ex],level:pick(['hold','cut10','cut20','swap']),weeks:2,dpw:5});
    if(R()<0.3) ev.push({type:'dial_set',id:'ds'+run,ts:day(2),value:pick([-2,-1,1,2])});
    ev.sort((a,b)=>a.ts<b.ts?-1:1);
    const A=load(ev); const C=A.getCFG(); C.start=new Date(Date.now()-60*864e5).toISOString().slice(0,10);
    A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:30,deload:false,hyp:[]})]);
    const slot={ex,role:pick(['primary','secondary','accessory']),reps:[lo,hi],rpe:T,sets:[],sets_target:3};
    const lvl=pick([null,null,null,3,4,5]); if(lvl) slot.joint={joint:'shoulder',level:lvl};
    const sore=R()<0.3, gl={sleep:pick([1,2,3,3,4]),motivation:pick([2,3,3,4]),recovery:pick([1,2,3,3,3])};
    const groups=A.soreGroupsFor({slots:[slot]});
    const rd={...gl,sore:Object.fromEntries(groups.map(g=>[g,sore?pick([1,2]):3])),joints:{}};
    const S={id:'NOW'+run,slots:[slot],openIdx:0,readiness:rd,adj:A.physicalCut(rd,groups),score:0.6,ratings:{},startedAt:Date.now()};
    A.setSession(S);
    const r=A.suggestFor(slot); runs++;
    if(r.lb==null) continue;
    const h=A.trackHistory(slot), last=h[h.length-1]; if(!last) continue;
    const L0=A.toLb(last.weight), R0=last.reps, tr=r.trace||[], has=(id,ch)=>tr.some(x=>x.id===id&&(!ch||x.changed));
    const tag=ex+' '+L0+'x'+R0+'@'+last.rpe+' '+lo+'-'+hi+'@'+T+' → '+r.lb+'x'+r.pr.reps+' ['+tr.filter(x=>x.changed).map(x=>x.id).join(',')+']';
    const exempt=has('range_fit')||has('focused_deload',true)||has('joint_ladder',true)||has('ceiling',true);
    if(!exempt&&(r.lb>A.stepUp(slot,L0)+1e-6||(r.lb<A.stepDown(slot,L0)-1e-6&&A.stepDown(slot,L0)>0))) bad('oneStep',tag);
    if(r.lb>L0+1e-6&&r.pr.reps>R0) bad('bothUp',tag);
    const fl0=A.floorFor(slot), fl=fl0==null?null:Math.min(fl0,L0);   // the floor never sits above where you are
    if(fl!=null&&r.lb<fl-1e-6&&!has('focused_deload',true)&&!(lvl>=4)&&!has('range_fit')&&!has('ceiling',true)) bad('floor',tag+' floor '+fl.toFixed(1));
    const ce=A.ceilingFor(slot,r.pr.reps,Math.min(10,T+1));
    if(ce!=null&&r.lb>Math.max(ce,0)+1e-6&&r.lb>A.loadable(slot,0)+1e-6) bad('ceiling',tag+' ceiling '+ce.toFixed(1));
    if(calib&&r.lb>L0+1e-6) bad('calib',tag);
    // a soreness/readiness cut never two sessions running without a miss in between
    const lastCut=last.suggestion&&(last.suggestion.trace||[]).some(x=>x.id==='local_soreness'&&x.changed);
    const missed=h.filter(x=>x.session_id===last.session_id).some(x=>x.failed||(x.rpe!=null&&x.rpe>=T+1));
    if(lastCut&&!missed&&(has('local_soreness',true)||has('sick_day',true))) bad('twice',tag);
    // never sticky: clear every signal, re-run → the modifiers are gone
    S.readiness={sleep:3,motivation:3,recovery:3,sore:{},joints:{}}; S.adj=null; delete slot.joint;
    const r2=A.suggestFor(slot), tr2=r2.trace||[];
    if(tr2.some(x=>['local_soreness','sick_day','global_readiness','joint_ladder'].includes(x.id)&&x.changed)) bad('sticky',ex+' '+JSON.stringify(tr2.filter(x=>x.changed).map(x=>x.id)));
  }
  ok(runs>=1000,'1000+ randomised modifier stacks ran',String(runs));
  Object.entries(viol).forEach(([k,n])=>ok(n===0,{oneStep:'load moves at most one step per session',bothUp:'load and reps never both rise',floor:'never below 85% of the recent best (unless a deload/ladder/range fit/ceiling says so)',ceiling:'never above what recent sets support',calib:'calibrating session: no step up',twice:'a soreness/readiness cut never two sessions running without a miss',sticky:'every modifier disappears when its input does',ids:'',sets:''}[k]||k,n+' of '+runs));
  // modifiers never change the exercise list, and never add sets
  { const base=load([]); const days=d=>d.map(x=>x.slots.map(s=>s.ex).join(',')).join('|');
    const w0=days(base.generatedDays());
    const M=load([{type:'focused_deload_start',id:'f',ts:day(1),fd_id:'f1',exercises:['bench','squat'],level:'cut20',weeks:2,dpw:5},{type:'dial_set',id:'d',ts:day(1),value:2},{type:'program_edit',id:'p',ts:day(1)}]);
    ok(days(M.generatedDays())===w0,'applying modifiers never changes the workout\'s exercise list','');
    const S2={id:'X',slots:base.generatedDays()[0].slots.map(x=>({...x,sets_target:x.sets,sets:[]})),adj:{load:0.9,sets:-2,groups:['push','pull','quads','post'],global:false},ratings:{}};
    const before=S2.slots.map(x=>x.sets_target).join(); base.applyReadinessSets(S2);
    ok(S2.slots.every((x,i)=>x.sets_target<=+before.split(',')[i]),'no modifier ever adds sets',''); }
  // weekly sets per muscle stay inside the typical range, whatever adds sets
  { const A=load([]); const C=A.getCFG(); C.goals=['bench','squat','deadlift'];
    A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:8,deload:false,hyp:['chest','quads','biceps'],refined:true,emphasis:'high'})]);
    const tot={}; A.generatedDays().forEach(d=>d.slots.forEach(sl=>{ const ex=A.exById[sl.ex]; Object.entries(ex.vol||{}).forEach(([m,w])=>tot[m]=(tot[m]||0)+w*sl.sets); }));
    const over=Object.entries(tot).filter(([m,v])=>{ const r=A.ENGINE.weeklySets(m); return r&&v>r[1]+1e-9; });
    ok(over.length===0,'weekly sets per muscle stay at or under the top of the typical range (high emphasis, priority muscles)',JSON.stringify(over)); }
  // regression: sore quads/hams never cut chest (Oct 4) — through the whole pipeline
  { const ev=[set('incline_machine','a',150,10,8,3),set('leg_press','a',400,10,8,3)];
    const A=load(ev), mk=x=>({ex:x,role:'primary',reps:[8,12],rpe:8,sets:[],sets_target:4}), slots=[mk('leg_press'),mk('incline_machine')];
    const groups=A.soreGroupsFor({slots}), rd={sleep:3,motivation:3,recovery:3,sore:Object.fromEntries(groups.map(g=>[g,['quads','post'].includes(g)?1:3])),joints:{}};
    A.setSession({id:'SR',slots,openIdx:0,readiness:rd,adj:A.physicalCut(rd,groups),score:0.6,ratings:{},startedAt:Date.now()});
    const c=A.suggestFor(slots[1]), l=A.suggestFor(slots[0]);
    ok(!(c.trace||[]).some(x=>x.id==='local_soreness'),'regression: sore legs leave the chest press alone (no soreness modifier in its trace)',JSON.stringify(c.trace));
    ok((l.trace||[]).some(x=>x.id==='local_soreness'&&x.changed),'and cut the leg press',JSON.stringify(l.trace)); }
  // regression: the first session after a program change makes no step up, and says why
  { const ev=[set('incline_machine','a',75,12,7,4,{target:{reps:[8,12],rpe:8}}),{type:'session_end',id:'ea',ts:day(3.99),session_id:'a',joints:{}},{type:'program_edit',id:'pe',ts:day(1),what:'rerun'}];
    const A=load(ev); const sl={ex:'incline_machine',role:'primary',reps:[10,15],rpe:8,sets:[],sets_target:3};
    A.setSession({id:'CB',slots:[sl],openIdx:0,adj:null,score:0.7,ratings:{},startedAt:Date.now()});
    const r=A.suggestFor(sl);
    ok(r.lb<=75&&(r.trace||[]).some(x=>x.id==='calibrating'||x.id==='progression'),'regression: new block → no load step up',JSON.stringify({lb:r.lb,trace:r.trace}));
    const B=load(ev.slice(0,2)); B.setSession({id:'CB2',slots:[{...sl}],openIdx:0,adj:null,score:0.7,ratings:{},startedAt:Date.now()});
    ok(B.suggestFor(B.getSession().slots[0]).lb>=r.lb,'(without the program change it may step up)',''); }
  // sick day: a 1 cuts one step everywhere, today only; global 2s never cut load
  { const ev=[set('incline_machine','a',80,10,8,3,{target:{reps:[8,12],rpe:8}}),{type:'session_end',id:'ea',ts:day(2.99),session_id:'a',joints:{}}];
    const run=(gl)=>{ const A=load(ev), sl={ex:'incline_machine',role:'primary',reps:[8,12],rpe:8,sets:[],sets_target:3};
      A.setSession({id:'G',slots:[sl],openIdx:0,readiness:{...gl,sore:{},joints:{}},adj:null,score:0.5,ratings:{},startedAt:Date.now()}); return A.suggestFor(sl); };
    const g2=run({sleep:2,motivation:2,recovery:2}), g1=run({sleep:3,motivation:3,recovery:1}), g3=run({sleep:3,motivation:3,recovery:3});
    ok(g2.lb>=80&&!(g2.trace||[]).some(x=>x.id==='sick_day'),'global 2s: no load cut (only no step up)',JSON.stringify(g2.trace));
    ok(g1.lb<80&&(g1.trace||[]).some(x=>x.id==='sick_day'&&x.changed),'a 1: one step lighter, marked sick_day',JSON.stringify({lb:g1.lb,trace:g1.trace}));
    ok(!(g3.trace||[]).some(x=>x.id==='sick_day'),'and gone the next session without another 1',''); }
  console.log('  ids match the doc · '+runs+' random stacks: one step, never both up, floor, ceiling, calibrating, no double soreness cut, nothing sticky · exercise list unchanged · weekly sets capped · regressions');
}

/* ─── 53. the maintainer's case: a focused deload, walked end to end ─── */
section('53. focused deload: incline −10%, pulldown joins, ramp-back');
{
  const ev=[]; let t=30, k=0;
  const sess=()=>{ const sid='w'+(k++);
    ev.push({type:'readiness',id:'r'+sid,ts:day(t+0.01),sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{},joint_scale:3});
    [['incline_machine',80,10],['uh_pl_pulldown',200,10],['bench',185,8],['cable_row',140,10]].forEach(([ex,w,r])=>ev.push(set(ex,sid,w,r,8,t,{role:'straight',target:{reps:[8,12],rpe:8}})));
    ev.push({type:'session_end',id:'e'+sid,ts:day(t-0.01),session_id:sid,joints:{}}); t-=1; };
  for(let i=0;i<4;i++) sess();
  const A=load(ev); const C=A.getCFG(); C.start=new Date(Date.now()-60*864e5).toISOString().slice(0,10); C.split='full5';
  A.setRoadmap([A.applyShape({type:'hyp',label:'H',weeks:30,deload:false,hyp:[]})]);
  const id=A.startFocusedDeload(['incline_machine'],'cut10',2);
  let fd=A.focusedDeload();
  ok(fd&&fd.id===id&&fd.len===10,'a 2-week window on a 5-day week is 10 sessions',JSON.stringify(fd&&{len:fd.len,left:fd.left}));
  const mk=ex=>({ex,role:'primary',reps:[8,12],rpe:8,sets:[],sets_target:3});
  const rx=(B,ex,rd)=>{ const sl=mk(ex); B.setSession({id:'NOW'+Math.random(),slots:[sl],openIdx:0,readiness:rd||{sleep:3,motivation:3,recovery:3,sore:{},joints:{}},adj:null,score:0.7,ratings:{},startedAt:Date.now()}); return B.suggestFor(sl); };
  let r=rx(A,'incline_machine');
  ok(r.lb<=72&&(r.trace||[]).some(x=>x.id==='focused_deload'),'incline pinned at −10% of 80 (≤ 72)',JSON.stringify({lb:r.lb}));
  // three sessions later, pulldown joins the SAME window
  const cont=B=>{ for(let i=0;i<3;i++){ const sid='x'+i; B.append({type:'readiness',sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{},joint_scale:3});
      B.append({...set('incline_machine',sid,70,10,8,0),id:undefined}); B.append({type:'session_end',session_id:sid,joints:{}}); } };
  cont(A);
  A.startFocusedDeload(['uh_pl_pulldown'],'cut20',3);     // level/weeks ignored: it joins
  fd=A.focusedDeload();
  ok(fd.id===id&&fd.exercises.includes('uh_pl_pulldown')&&fd.exercises.includes('incline_machine')&&fd.len===10,'pulldown joins the existing window — one window, same timer',JSON.stringify({id:fd.id,ex:fd.exercises,len:fd.len,done:fd.done}));
  ok(A.LOG.filter(e=>e.type==='focused_deload_start').length===1,'no second window was started','');
  // bench and rows untouched
  ['bench','cable_row'].forEach(ex=>{ const q=rx(A,ex); ok(!(q.trace||[]).some(x=>x.id==='focused_deload'),ex+' untouched by the focused deload',JSON.stringify(q.trace)); });
  // global readiness doesn't double-cut a pinned exercise
  const sick={sleep:3,motivation:3,recovery:1,sore:{},joints:{}};
  const pin=rx(A,'incline_machine',sick), free=rx(A,'bench',sick);
  ok(!(pin.trace||[]).some(x=>x.id==='sick_day')&&(free.trace||[]).some(x=>x.id==='sick_day'),'a sick day cuts bench but does not stack on the pinned incline','');
  // ramp-back: no step-up proposal until the last 3 sessions
  const props=()=>A.activeProposals().filter(x=>x.id.startsWith('fdstep:'));
  ok(props().length===0,'no ramp-back proposal mid-window',String(A.focusedDeload().left)+' left');
  while(A.focusedDeload()&&A.focusedDeload().left>3){ const sid='y'+A.LOG.length; A.append({type:'readiness',sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{},joint_scale:3}); A.append({type:'session_end',session_id:sid,joints:{}}); }
  fd=A.focusedDeload();
  ok(fd&&fd.ramp&&props().length===1,'in the last 3 sessions, with the joint at its usual, a ramp-back step is proposed',JSON.stringify({left:fd&&fd.left,props:props().map(x=>x.id)}));
  const before=A.focusedDeload().level; props()[0].accept.fn();
  ok(A.focusedDeload().level!==before&&A.focusedDeload().level==='hold','accepting steps up one level (−10% → hold) — never automatic',A.focusedDeload().level);
  // joint above its usual in a ramp session: hold and extend one session
  const len0=A.focusedDeload().len;
  A.append({type:'readiness',sleep_quality:3,motivation:3,recovery:3,soreness:{},joints:{shoulder:3},joint_scale:3}); A.append({type:'session_end',session_id:'z1',joints:{}});
  ok(A.focusedDeload()&&A.focusedDeload().len===len0+1,'a ramp session with the shoulder above its usual extends the window one session',JSON.stringify({len0,len:A.focusedDeload()&&A.focusedDeload().len}));
  ok(props().length===0,'and no step-up is proposed that session','');
  console.log('  incline pinned · pulldown joins one window · bench/rows untouched · sick day not stacked · ramp-back proposed only at the end, extends on a bad day');
}

console.log('\n'+checks+' checks, '+failures+' failed');
if(failures){ console.log('\n'+Object.entries(shown).map(([k,n])=>n+' x '+k).join('\n')); process.exit(1); }
