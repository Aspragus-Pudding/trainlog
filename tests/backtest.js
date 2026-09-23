#!/usr/bin/env node
/* Backtest the prescription engine against real logged sessions.
 *
 * For every logged working set, this recomputes what the engine would have
 * suggested using ONLY the data that existed before that set was logged
 * (truncating the log by timestamp, then calling the real suggestFor() /
 * nextPrescription() straight out of index.html), and compares that
 * suggestion to what was actually lifted. It never modifies the export it
 * reads and never writes anywhere inside the repo.
 *
 * Usage:
 *   node tests/backtest.js <export.jsonl> [--out report.json] [--csv rows.csv]
 *
 * <export.jsonl> is the app's own "Export backup" text (Lifts tab), the
 * Google Sheet "Raw backup" column pasted to a file, or the Apps Script
 * ?action=fetch response — with or without a leading
 * {"type":"config_snapshot",...} line.
 *
 * Re-run this after any prescription redesign and diff the summary against
 * a saved run to see whether accuracy actually improved.
 */
const fs=require('fs'), path=require('path');

function usageExit(msg){
  if(msg) console.error(msg);
  console.error('Usage: node tests/backtest.js <export.jsonl> [--out report.json] [--csv rows.csv]');
  process.exit(1);
}

const args=process.argv.slice(2);
const flagVal=name=>{ const i=args.indexOf(name); return i>=0?args[i+1]:null; };
const outPath=flagVal('--out'), csvPath=flagVal('--csv');
const filePath=args.find(a=>!a.startsWith('--')&&args[args.indexOf(a)-1]!=='--out'&&args[args.indexOf(a)-1]!=='--csv');
if(!filePath) usageExit();
if(!fs.existsSync(filePath)) usageExit('File not found: '+filePath);

/* ---------- parse the export ---------- */
const rawText=fs.readFileSync(filePath,'utf8');
let cfgSnapshot=null; const events=[];
rawText.split('\n').forEach(l=>{
  l=l.trim(); if(!l) return;
  let o; try{ o=JSON.parse(l); }catch{ return; }
  if(o.type==='config_snapshot'){ cfgSnapshot=o.cfg; return; }
  if(o.ts==null) return;              // can't place it on the timeline
  events.push(o);
});
if(!events.length) usageExit('No usable events found in '+filePath);
events.sort((a,b)=>new Date(a.ts)-new Date(b.ts));

/* ---------- load index.html's real functions, stubbed DOM (same pattern as
   tests/prescription-invariants.js) ---------- */
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
function stub(){
  const f=function(){};
  return new Proxy(f,{
    get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },
    set(){ return true; }, apply(){ return stub(); }, construct(){ return stub(); }
  });
}
const EXPORTS=['nextPrescription','suggestFor','schemeFor','EX','exById','LOG','sets','toLb','setE1RM','bestE1RM',
  'currentPhase','readinessScoreFromEvent','physicalCut','jointLevel','jointTrend','JOINT_PATTERNS','JOINTS',
  'lastEarlyPain','impliedE1','predictedRpe','rtfFromPct','repProfile','CFG','pct1RM','isCoarseMachine','isChartFree'];
function loadApp(){
  const store={};
  if(cfgSnapshot) store['trainlog.cfg.v1']=JSON.stringify(cfgSnapshot);
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
  // exports are looked up defensively so this still runs against an older build
  const pick=EXPORTS.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',');
  const body=src+'\n;return {'+pick+
    // test-only hooks: replace the working log wholesale and clear every
    // length-keyed memo cache, since two different truncations can share a
    // length by coincidence and must not be confused for the same log.
    ',setLog:function(x){LOG=x;},resetCaches:function(){'+
    '_setsCache=null;_setsLen=-1;_prCache=null;_prLen=-1;'+
    '_jointCache={};_jointLen=-1;_bwCache=null;_bwLen=-1;_fatCache={};_fatLen=-1;'+
    '},setSession:function(x){session=x}};';
  const fn=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval',
    'alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',body);
  return fn(stub(),stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),stub(),()=>stub(),()=>0,
    {log(){},warn(){},error(){}});
}
const A=loadApp();

/* ---------- canonical replay: corrections applied, same rule sets() uses ---------- */
function resolvedSets(list){
  const patch={};
  for(const e of list) if(e.type==='correction') patch[e.target_id]=e;
  const out=[];
  for(const e of list){
    if(e.type!=='set') continue;
    const p=patch[e.id];
    if(p){ if(p.patch===null) continue; out.push({...e,...p.patch}); }
    else out.push(e);
  }
  return out;
}
const allSets=resolvedSets(events);
// Only top/straight sets carry a suggestion in the first place — drop-set /
// myo-rep / cluster extensions are priced by TECHNIQUES, not the engine, and
// warmups were never priced against a target.
const workingSets=allSets.filter(s=>s.set_kind!=='warmup' && (!s.group||s.group.pos===0)
  && s.target && Array.isArray(s.target.reps) && s.target.rpe!=null);

console.log('Loaded '+events.length+' events -> '+allSets.length+' resolved sets, '
  +workingSets.length+' with target metadata to backtest.');
if(!workingSets.length){ console.error('Nothing to backtest — no working sets carry target.reps/target.rpe.'); process.exit(1); }

// Which patterns each session actually trained — a structural fact of that
// day's plan, fixed before the first set was ever logged, so using the full
// (not truncated) history to build this map isn't hindsight about anything
// the engine wouldn't have known at check-in time.
const sessionPatterns={};
allSets.forEach(s=>{
  const ex=A.exById[s.exercise_id]; if(!ex) return;
  (sessionPatterns[s.session_id]=sessionPatterns[s.session_id]||new Set()).add(ex.pattern);
});

/* ---------- walk forward: predict each set from only what came before it ---------- */
const rows=[]; const skipped={no_exercise:0, no_prediction:0};
const seenFirst=new Set();   // session_id:exercise_id already has a logged working set

for(const w of workingSets){
  const t=new Date(w.ts).getTime();
  const truncated=events.filter(e=>{ const et=new Date(e.ts).getTime(); return !isNaN(et)&&et<t; });
  A.setLog(truncated); A.resetCaches();

  const ex=A.exById[w.exercise_id];
  if(!ex){ skipped.no_exercise++; continue; }

  const key=w.session_id+':'+w.exercise_id;
  const fresh=!seenFirst.has(key);

  // Joint ladder for this pattern, replicating buildDay()'s own logic
  // (index.html, buildDay) against only the truncated history.
  let jl=1, jname=null;
  (A.JOINTS||[]).forEach(j=>{
    if(!((A.JOINT_PATTERNS||{})[j]||[]).includes(ex.pattern)) return;
    const L=A.jointLevel(A.jointTrend(j,6));
    if(L>jl){ jl=L; jname=j; }
  });
  const ep=A.lastEarlyPain();
  if(ep&&Object.keys(ep.joints||{}).some(j=>((A.JOINT_PATTERNS||{})[j]||[]).includes(ex.pattern))) jl=Math.max(jl,3);
  const joint=jl>=2?{level:jl,joint:jname}:null;

  // Readiness for the session this set belongs to: the nearest preceding
  // readiness-or-session_end marker. If a session_end comes first, the
  // check-in for this session was skipped, so there is no adjustment. The
  // load/set cut now needs a physical signal (soreness or a flagged joint in
  // today's patterns) rather than a blended score — see physicalCut() in
  // index.html and the v1.14.0 investigation for why. The readiness event's
  // own soreness keys ARE that session's trained groups: the check-in only
  // ever asks about groups the day's plan actually trains.
  let adj=null, score=null;
  for(let i=truncated.length-1;i>=0;i--){
    const e=truncated[i];
    if(e.type==='readiness'){
      score=A.readinessScoreFromEvent(e);
      const st={sleep:e.sleep_quality,motivation:e.motivation,sore:e.soreness||{},joints:e.joints||{}};
      const groups=Object.keys(e.soreness||{});
      const patterns=[...(sessionPatterns[w.session_id]||[])];
      adj=A.physicalCut(st,groups,patterns);
      break;
    }
    if(e.type==='session_end') break;
  }

  const slot={ex:w.exercise_id, reps:w.target.reps, rpe:w.target.rpe, joint, sets:new Array(fresh?0:1)};
  A.setSession({id:w.session_id, score, adj, adjReason:null, slots:[slot], ratings:{}});

  let pred;
  try{ pred=A.suggestFor(slot); }catch(err){ skipped.no_prediction++; continue; }
  seenFirst.add(key);
  if(pred.lb==null){ skipped.no_prediction++; continue; }   // e.g. first-ever set, no estimate to go on

  const actualLb=A.toLb(w.weight);
  const predE1=A.impliedE1(pred.lb, pred.pr.reps, w.target.rpe);
  const actualE1=w.rpe!=null?A.impliedE1(actualLb, w.reps, w.rpe):null;
  rows.push({
    ts:w.ts, exercise_id:w.exercise_id, load_type:ex.load, fresh,
    predicted_lb:pred.lb, predicted_reps:pred.pr.reps, target_rpe:w.target.rpe, basis:pred.pr.src,
    fatigue_applied:!!(pred.pr.fatigue&&pred.pr.fatigue.applied),
    readiness_applied:!!(pred.o&&pred.o.adj&&pred.o.adjApplied),
    joint_applied:!!(pred.o&&pred.o.jointCut&&pred.o.jointApplied),
    off_chart:/too light to price/.test(pred.pr.src||''),
    actual_lb:actualLb, actual_reps:w.reps, actual_rpe:w.rpe,
    load_err_lb:actualLb-pred.lb,
    load_err_pct:pred.lb?(actualLb-pred.lb)/pred.lb*100:null,
    reps_err:w.reps-pred.pr.reps,
    pred_e1:predE1, actual_e1:actualE1,
    e1_err_pct:(predE1&&actualE1)?(actualE1-predE1)/predE1*100:null
  });
}

/* ---------- aggregation helpers ---------- */
const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
const median=a=>{ if(!a.length) return null; const s=[...a].sort((x,y)=>x-y); const m=Math.floor(s.length/2);
  return s.length%2?s[m]:(s[m-1]+s[m])/2; };
const fmt=(v,d)=>v==null?'n/a':v.toFixed(d==null?1:d);
const pick=(rows,key)=>rows.map(r=>r[key]).filter(v=>v!=null&&isFinite(v));

function directionStats(vals, label, unit){
  if(!vals.length) return '  '+label+': no data';
  const over=vals.filter(v=>v>0.01).length, under=vals.filter(v=>v<-0.01).length, on=vals.length-over-under;
  return '  '+label+': mean '+fmt(mean(vals))+unit+' · median '+fmt(median(vals))+unit
    +' · mean |error| '+fmt(mean(vals.map(Math.abs)))+unit
    +'  (suggested too light '+over+', too heavy '+under+', exact '+on+', n='+vals.length+')';
}

function report(rows, title){
  console.log('\n=== '+title+' (n='+rows.length+') ===');
  if(rows.length<5){ console.log('  Fewer than 5 sets — not enough to say anything.'); return; }
  console.log(directionStats(pick(rows,'load_err_lb'),'Load error','lb'));
  console.log(directionStats(pick(rows,'load_err_pct'),'Load error','%'));
  console.log(directionStats(pick(rows,'reps_err'),'Reps error',' reps'));
  const e1rows=rows.filter(r=>r.e1_err_pct!=null);
  if(e1rows.length>=5) console.log(directionStats(pick(e1rows,'e1_err_pct'),'e1RM-equivalent error (n='+e1rows.length+')','%'));
  else console.log('  e1RM-equivalent error: not enough sets with a reported RPE ('+e1rows.length+')');
}

/* ---------- 1. overall ---------- */
report(rows, 'OVERALL');

/* ---------- 2. by equipment type ---------- */
console.log('\n=== BY EQUIPMENT TYPE ===');
const byLoad={};
rows.forEach(r=>{ (byLoad[r.load_type]=byLoad[r.load_type]||[]).push(r); });
Object.keys(byLoad).sort((a,b)=>byLoad[b].length-byLoad[a].length).forEach(lt=>report(byLoad[lt], lt));

/* ---------- 3. first set of an exercise vs later sets in the same session ---------- */
report(rows.filter(r=>r.fresh), 'FIRST SET of an exercise in its session');
report(rows.filter(r=>!r.fresh), 'LATER SETS of the same exercise, same session');

/* ---------- 4. by exercise (worst offenders, min 5 sets) ---------- */
console.log('\n=== BY EXERCISE (mean |load error %|, min 5 sets) ===');
const byEx={};
rows.forEach(r=>{ (byEx[r.exercise_id]=byEx[r.exercise_id]||[]).push(r); });
const exStats=Object.entries(byEx).map(([id,rs])=>({id, n:rs.length,
    mape:mean(pick(rs,'load_err_pct').map(Math.abs)), bias:mean(pick(rs,'load_err_pct'))}))
  .filter(x=>x.n>=5 && x.mape!=null).sort((a,b)=>b.mape-a.mape);
exStats.slice(0,15).forEach(x=>console.log('  '+x.id.padEnd(22)+' n='+String(x.n).padEnd(4)
  +' mean |err| '+fmt(x.mape)+'%'.padEnd(3)+'  bias '+(x.bias>=0?'+':'')+fmt(x.bias)+'% ('+(x.bias>0?'suggests light':x.bias<0?'suggests heavy':'no bias')+')'));
if(exStats.length>15) console.log('  ... and '+(exStats.length-15)+' more exercises with >=5 sets');

/* ---------- 5. worst misses and which modifiers were active on them ---------- */
console.log('\n=== WORST 20 MISSES BY |LOAD ERROR %| ===');
const worst=[...rows].filter(r=>r.load_err_pct!=null).sort((a,b)=>Math.abs(b.load_err_pct)-Math.abs(a.load_err_pct)).slice(0,20);
worst.forEach(r=>{
  const mods=[r.fatigue_applied&&'fatigue', r.readiness_applied&&'readiness', r.joint_applied&&'joint', r.off_chart&&'off-chart', !r.fresh&&'later-set'].filter(Boolean);
  console.log('  '+r.ts.slice(0,10)+' '+r.exercise_id.padEnd(18)+' predicted '+fmt(r.predicted_lb,0)+'x'+r.predicted_reps
    +' -> actual '+fmt(r.actual_lb,0)+'x'+r.actual_reps+'@'+(r.actual_rpe??'?')
    +'  ('+(r.load_err_pct>=0?'+':'')+fmt(r.load_err_pct)+'%)'
    +(mods.length?'  ['+mods.join(', ')+']':'  [no modifier active]'));
});
const modTally={}; worst.forEach(r=>{
  [['fatigue',r.fatigue_applied],['readiness',r.readiness_applied],['joint',r.joint_applied],['off_chart',r.off_chart],['later_set',!r.fresh]]
    .forEach(([k,v])=>{ if(v) modTally[k]=(modTally[k]||0)+1; });
});
console.log('  Modifier present on worst-20 misses: '+(Object.keys(modTally).length
  ?Object.entries(modTally).map(([k,v])=>k+' '+v+'/20').join(', '):'none of the tracked modifiers — plain chart pricing missed on its own'));

/* ---------- 6. machine/chart-bias hypothesis, via repProfile() on the full history ---------- */
console.log('\n=== HYPOTHESIS: chart underestimates reps-at-%1RM on machines ===');
console.log('(repProfile() compares the e1RM implied by <=5-rep sets against 6-12-rep sets for the');
console.log(' same exercise, on the SAME chart. A positive gap means high-rep sets imply a bigger max');
console.log(' than low-rep sets do — i.e. more reps came out than the chart expects at that load.)');
A.setLog(events); A.resetCaches();
const exIds=[...new Set(allSets.map(s=>s.exercise_id))];
const profiles=exIds.map(id=>{ const ex=A.exById[id]; if(!ex) return null;
  const p=A.repProfile(id); return p?{id, load:ex.load, gapPct:p.gapPct, loN:p.loN, hiN:p.hiN}:null; }).filter(Boolean);
if(!profiles.length) console.log('  No exercise has both >=3 low-rep and >=3 high-rep sets yet — can\'t test this.');
else{
  const grp={barbell:[], dumbbell:[], 'machine/stack/cable':[], other:[]};
  profiles.forEach(p=>{ const k=p.load==='barbell'?'barbell':p.load==='dumbbell'?'dumbbell'
    :['machine','stack','cable'].includes(p.load)?'machine/stack/cable':'other'; grp[k].push(p); });
  Object.entries(grp).forEach(([k,ps])=>{
    if(!ps.length) return;
    console.log('  '+k+' (n='+ps.length+' exercises): mean gap '+fmt(mean(ps.map(p=>p.gapPct)))+'% · median '+fmt(median(ps.map(p=>p.gapPct)))+'%');
    ps.sort((a,b)=>b.gapPct-a.gapPct).forEach(p=>console.log('    '+p.id.padEnd(20)+(p.gapPct>=0?'+':'')+fmt(p.gapPct)+'%  ('+p.loN+' low-rep, '+p.hiN+' high-rep sets)'));
  });
  const mCoarse=mean(grp['machine/stack/cable'].map(p=>p.gapPct)), mBar=mean(grp.barbell.map(p=>p.gapPct).concat(grp.dumbbell.map(p=>p.gapPct)));
  if(mCoarse!=null&&mBar!=null){
    console.log('\n  Machine/stack/cable mean gap: '+fmt(mCoarse)+'%   Barbell/dumbbell mean gap: '+fmt(mBar)+'%');
    console.log('  '+(mCoarse-mBar>5?'Supports the hypothesis: machines run a meaningfully bigger positive gap.'
      :mCoarse-mBar<-5?'Does not support the hypothesis as stated: machines do not run a bigger gap here.'
      :'Inconclusive at this sample size — the two groups are not meaningfully different.'));
  }
}

/* ---------- output ---------- */
console.log('\nSkipped: '+JSON.stringify(skipped));
if(outPath){
  fs.writeFileSync(outPath, JSON.stringify({generated_at:new Date().toISOString(), n:rows.length, skipped, rows}, null, 1));
  console.log('\nWrote full row-level data to '+outPath);
}
if(csvPath){
  const cols=['ts','exercise_id','load_type','fresh','predicted_lb','predicted_reps','target_rpe','basis',
    'actual_lb','actual_reps','actual_rpe','load_err_lb','load_err_pct','reps_err','e1_err_pct',
    'fatigue_applied','readiness_applied','joint_applied','off_chart'];
  const lines=[cols.join(',')].concat(rows.map(r=>cols.map(c=>{
    const v=r[c]; return v==null?'':(typeof v==='string'&&v.includes(',')?'"'+v+'"':v);
  }).join(',')));
  fs.writeFileSync(csvPath, lines.join('\n'));
  console.log('Wrote row-level CSV to '+csvPath);
}
