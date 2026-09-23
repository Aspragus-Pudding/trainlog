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
  'exerciseSessionHistory','STAGNATION_SESSIONS','STAGNATION_SUPPRESS','RPE_HOLD_TOL','GROUP_LABEL','JOINT_PATTERNS'];
function load(events){
  const store={};
  if(events&&events.length) store['trainlog.jsonl.v1']=events.map(e=>JSON.stringify(e)).join('\n');
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
  // exports are looked up defensively so an older build can be run against the suite
  const pick=EXPORTS.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',');
  const body=src+'\n;return {'+pick+',setSession:x=>{session=x},getSession:()=>session,getDraft:()=>draft};';
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

  // a flagged joint whose pattern is in today's session cuts; elsewhere, doesn't
  const jointIn=A.physicalCut({sleep:3,motivation:3,sore:{push:3},joints:{shoulder:1}},['push'],['horizontal_press']);
  ok(jointIn&&jointIn.label==='Slightly reduced','a flagged joint trained today should cut',JSON.stringify(jointIn));
  ok(A.physicalCut({sleep:3,motivation:3,sore:{push:3},joints:{knee:1}},['push'],['horizontal_press'])===null,
    'a flagged joint NOT trained today should not cut','');
  console.log('  all-3s: no cut · sleep/motivation alone: no cut · soreness/joint in trained group: cuts');
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

console.log('\n'+checks+' checks, '+failures+' failed');
if(failures){ console.log('\n'+Object.entries(shown).map(([k,n])=>n+' x '+k).join('\n')); process.exit(1); }
