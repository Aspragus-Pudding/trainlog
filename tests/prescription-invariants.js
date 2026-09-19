#!/usr/bin/env node
/* Prescription invariants for Trainlog. Run after ANY change to prescription
   logic (nextPrescription, suggestFor, seedDraft, logSet's recompute, schemeFor):

     node tests/prescription-invariants.js

   No dependencies. It loads the <script> from index.html with a stubbed DOM and
   calls the real functions. Exit code is non-zero if any invariant fails.

   Invariants for a prescribed (load, reps) after a logged (load L0, reps R0, RPE0)
   against a target RPE T and rep range [lo, hi]:
     1. The reps a load is priced for are the reps returned with it.
     2. RPE0 < T (easier): more load; or one more rep while below the range top.
        RPE0 > T (harder): less load, or fewer reps at the same load.
        RPE0 = T: hold exactly (no snapping to the load grid).
     3. Load and reps never both go up.
     4. A set off the %1RM chart (reps-to-failure > 16) is reported as too light
        to price, never silently treated as "no change". */
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
  'MUSCLE_REP_RANGE','CFG','FATIGUE_MIN_PAIRS','FATIGUE_MIN_SESSIONS','CHART_MAX_RTF'];
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
  if(dir>0){
    ok(!down,'easy set got less load',tag);
    ok(!(same&&p.reps<R0),'easy set got same load, fewer reps',tag);
    if(R0<hi) ok(same&&p.reps===R0+1,'easy mid-range: one more rep',tag);
    else ok(up,'easy at range top: no load increase',tag);
  }else if(dir<0){
    ok(!up,'hard set got more load',tag);
    ok(down||(same&&p.reps<R0),'hard set not made easier',tag);
  }else{
    ok(same&&p.reps===R0,'on target: not held exactly',tag);
  }
  const rtf=R0+(10-RPE0);
  if(dir>0&&R0>=hi&&rtf>16) ok(/too light to price/.test(p.note)&&/too light to price/.test(p.src),'off-chart set not reported',tag);
  // priced pair: the returned (load, reps) should feel like the target, unless a whole step is forced
  const A2=A, e1=A2.impliedE1?A2.impliedE1(L0,R0,RPE0):null;
  if(e1!=null){
    const pr=A2.predictedRpe(e1,p.lb,p.reps);
    const forced=/one step/.test(p.src);
    if(pr!=null){
      if(dir>0&&!forced&&up) ok(pr<=T+0.5,'priced pair harder than target ('+pr.toFixed(1)+')',tag);
      if(dir<0&&!(same&&p.reps===Math.max(1,Math.min(R0-1,hi)))) ok(pr<RPE0,'hard set: priced pair not easier ('+pr.toFixed(1)+')',tag);
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
  ok(/too light to price/.test(p.note),'hip abduction: off-chart not stated','');
  p=run([set('pulldown','l',170,11,7.5,1)],{ex:'pulldown',role:'primary',sets:4,reps:[6,8],rpe:8,sets_target:4});
  ok(p.lb>170,'pulldown 170x11@7.5 load did not rise',JSON.stringify(p)); console.log('  lat pulldown 170x11@7.5 ->',p.lb,'x',p.reps,'|',p.src);
  p=run([set('multihip_abd','l',60,6,8.5,1)],{ex:'multihip_abd',role:'secondary',sets:3,reps:[8,12],rpe:8,sets_target:3});
  ok(p.lb<=60&&p.reps<6,'hard set on coarse machine',JSON.stringify(p)); console.log('  hip abduction 60x6@8.5 ->',p.lb,'x',p.reps);
  p=run([set('multihip_abd','l',60,15,9.5,1)],{ex:'multihip_abd',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3});
  ok(p.lb<=60,'hard set raised load',JSON.stringify(p)); console.log('  hip abduction 60x15@9.5 ->',p.lb,'x',p.reps);
  p=run([set('bench','l',185,8,7.5,1)],{ex:'bench',role:'primary',sets:3,reps:[6,8],rpe:6,sets_target:3});
  ok(p.lb<=185,'deload target RPE 6, set at 7.5 raised load',JSON.stringify(p)); console.log('  bench 185x8@7.5 in a deload (RPE 6) ->',p.lb,'x',p.reps);
  p=run([set('multihip_abd','l',55,13,7,1)],{ex:'multihip_abd',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3});
  ok(p.lb===55&&p.reps===14,'off-grid load was snapped',JSON.stringify(p)); console.log('  hip abduction 55x13@7 ->',p.lb,'x',p.reps,'(hold exactly, one more rep)');
}

/* ─── 3. override damping: the probe must respect the last set's RPE ─── */
section('3. override probe');
{
  const ov=(w,reps,rpe,sug,d,sid)=>set('multihip_abd',sid,w,reps,rpe,d,{suggested_lb:sug});
  const mk=(reps,rpe)=>[ov(80,reps,8,90,12,'o1'),ov(75,reps,8,85,9,'o2'),ov(70,reps,8,80,6,'o3'),ov(55,reps,rpe,65,1,'o4')];
  const slot={ex:'multihip_abd',role:'accessory',sets:3,reps:[10,15],rpe:9,sets_target:3};
  for(const [reps,rpe] of [[11,9.5],[15,9.5],[13,7],[15,8],[12,9]]){
    const p=load(mk(reps,rpe)).nextPrescription(slot), up=p.lb>55, down=p.lb<55;
    const tag=`streak, last 55x${reps}@${rpe} -> ${p.lb}x${p.reps} (${p.src})`;
    ok(!(up&&p.reps>reps),'probe: load and reps both up',tag);
    if(rpe>9) ok(!up&&(down||p.reps<reps),'probe: hard set not made easier',tag);
    if(rpe===9) ok(p.lb===55&&p.reps===reps,'probe: on target not held',tag);
    if(rpe<9) ok(!down&&!(p.lb===55&&p.reps<reps),'probe: easy set got less',tag);
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

console.log('\n'+checks+' checks, '+failures+' failed');
if(failures){ console.log('\n'+Object.entries(shown).map(([k,n])=>n+' x '+k).join('\n')); process.exit(1); }
