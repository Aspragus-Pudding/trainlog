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
  'programPosition','splitKeyFor','todayDay','generatedDays','MUSCLE_ORDER','sessionTonnage','primaryMuscle','lintRoadmap','SPLITS','roundLoads','shownLoad','LB','SCALE_SPEC','fromNeutral','jointDriftNote','jointBaseline','splitOf','weekTemplate','validWeek','DAY_TYPES','WEEK_STYLES','styleOfWeek','weekCoverage','splitFor'];
function load(events){
  const store={};
  if(events&&events.length) store['trainlog.jsonl.v1']=events.map(e=>JSON.stringify(e)).join('\n');
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
  // exports are looked up defensively so an older build can be run against the suite
  const pick=EXPORTS.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',');
  const body=src+'\n;return {'+pick+',setSession:x=>{session=x},getSession:()=>session,getDraft:()=>draft,'+
    'setRoadmap:x=>{ROADMAP=x},getRoadmap:()=>ROADMAP,getCFG:()=>CFG};';
  const fn=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval',
    'alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',body);
  return fn(stub(),stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}});
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
  if(!atTarget&&dir>0){
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
    if(!chartFree||R0<=hi) ok(same&&p.reps===R0,'on target: not held exactly',tag);
    else ok(up,'chart-free: on target but strictly past ceiling should raise load',tag);
  }
  if(!chartFree){
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
  ok(p.lb===60&&p.reps===6,'0.5 off target is within hold tolerance, should not change',JSON.stringify(p)); console.log('  hip abduction 60x6@8.5 (0.5 off target) ->',p.lb,'x',p.reps);
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
  // move the third exercise up: the open panel follows the exercise moved, not the one it displaced
  A.moveSlot(2,-1);
  ok(S.slots[1].ex==='curl'&&S.openIdx===1,'reorder up: panel did not follow moved exercise',`order ${S.slots.map(s=>s.ex)} open ${S.openIdx}`);
  A.moveSlot(0,1);   // bench down one: it becomes the open one
  ok(S.slots[1].ex==='bench'&&S.openIdx===1,'reorder down: panel did not follow moved exercise',`order ${S.slots.map(s=>s.ex)} open ${S.openIdx}`);
  S.openIdx=0; A.moveSlot(2,-1);
  ok(S.openIdx===1&&S.slots[1].ex===mkSlot('ohp').ex||S.openIdx===1,'reorder while another is open','');
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
  ok(p.lb>60&&p.reps===10,'easier, reps would exceed ceiling: should step load up and reset to floor',JSON.stringify(p));
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
  // abduction: half weight, never past load held
  const A6=load(many(6,1));
  const press=A6.jointNoteFor('horizontal_press'), raise=A6.jointNoteFor('abduction'), curl=A6.jointNoteFor('elbow_flexion');
  ok(press&&press.level===5,'presses should be level 5 at 6 moderate shoulder sessions',JSON.stringify(press));
  ok(raise&&raise.level===3,'abduction should be half weight and capped at load held',JSON.stringify(raise));
  ok(curl===null,'a curl is not a shoulder pattern',JSON.stringify(curl));
  ok(load(many(2,1)).jointNoteFor('abduction').level===2,'abduction at score 2 (half = 1) should only lengthen the warmup','');

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
  ok(pr.days===Math.ceil(pr.remaining/pr.pace.perWeek*7),'projection = remaining sessions at recent pace',String(pr.days));
  ok(pr.behindDays>A.DRIFT_DAYS,'2.45 sessions/week against a 5-day split should be well behind a 120-day target',String(pr.behindDays));
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
  ok(c1&&c1.label==='Reduced'&&/run-down/.test(c1.signal),'recovery 1 should cut hard and say run-down',JSON.stringify(c1));
  ok(c2&&c2.label==='Slightly reduced'&&/life stress/.test(c2.signal),'recovery 2 should cut lightly and say life stress',JSON.stringify(c2));
  [3,4,5].forEach(v=>ok(A.physicalCut(st(v),['push'])===null,'recovery '+v+' must not cut',''));
  ok(A.readinessScore(st(5),['push'])===A.readinessScore(st(3),['push']),'recovery 4-5 must never add to readiness','');
  ok(A.readinessScore(st(4),['push'])===A.readinessScore(st(3),['push']),'recovery 4 must never add to readiness','');
  ok(A.readinessScore(st(1),['push'])<A.readinessScore(st(3),['push']),'recovery 1 should lower the warmup score','');
  const both=A.physicalCut(st(2,1),['push']);
  ok(both&&both.label==='Reduced'&&/sore/.test(both.signal),'the worse of soreness and recovery decides the cut',JSON.stringify(both));
  const both2=A.physicalCut(st(1,1),['push']);
  ok(both2&&/sore/.test(both2.signal)&&/run-down/.test(both2.signal),'when both hit the same tier, both are named',JSON.stringify(both2));
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
  const lbEx=A.EX.find(e=>!e.unitPref);
  ok(A.shownLoad({ex:lbEx.id},185).value===185,'an lb suggestion is recorded as shown','');
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

console.log('\n'+checks+' checks, '+failures+' failed');
if(failures){ console.log('\n'+Object.entries(shown).map(([k,n])=>n+' x '+k).join('\n')); process.exit(1); }
