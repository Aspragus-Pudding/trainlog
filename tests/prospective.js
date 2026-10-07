#!/usr/bin/env node
/* Prospective check of the engine against what you actually did (engine
   phase 2 checkpoint, roadmap/checkpoint-engine-phase2.md).

     node tests/prospective.js <export.jsonl>

   The backtest asks "would the engine have agreed with what was logged?";
   this asks the questions only the recorded suggestion (v1.13.0+) can answer:
   1. Suggested load increases — how often taken, and did the RPE land within
      ±1 of target when they were?
   2. Per exercise — is there enough data to calibrate (the thresholds in
      docs/calibration-plan.md §3)?
   3. RPE reporting — on chart-path exercises, does the e1RM your RPE implies
      agree across sets of the same session, and across rep ranges? (No set
      here ever went to true failure on purpose, so "reps actually left" can
      only be estimated, and is reported as such.)
   4. Stagnation probes — did they fire, were they taken?
   Sessions made by automation (one set, readiness → set → end within a few
   seconds — a test harness once synced these to the sheet) are excluded and
   listed. Reads the export only; writes nothing. */
const fs=require('fs'), path=require('path');
const file=process.argv[2];
if(!file||!fs.existsSync(file)){ console.error('Usage: node tests/prospective.js <export.jsonl>'); process.exit(1); }
let cfg=null; const events=[];
fs.readFileSync(file,'utf8').split('\n').forEach(l=>{ l=l.trim(); if(!l) return; let o; try{ o=JSON.parse(l); }catch{ return; }
  if(o.type==='config_snapshot'){ cfg=o.cfg; return; } if(o.ts) events.push(o); });
events.sort((a,b)=>new Date(a.ts)-new Date(b.ts));

/* automation fingerprint */
const bySess={}; events.forEach(e=>{ if(e.session_id) (bySess[e.session_id]=bySess[e.session_id]||[]).push(e); });
const synthetic=new Set(Object.entries(bySess).filter(([,es])=>{ const t=es.map(e=>+new Date(e.ts));
  return es.some(e=>e.type==='set')&&es.filter(e=>e.type==='set').length<=1&&Math.max(...t)-Math.min(...t)<5000; }).map(([k])=>k));
const synthTs=[...synthetic].map(k=>+new Date(bySess[k][0].ts));
const clean=events.filter(e=>!(e.session_id&&synthetic.has(e.session_id))&&!(e.type==='readiness'&&synthTs.some(t=>Math.abs(+new Date(e.ts)-t)<5000)));

/* the app's own functions over the clean log */
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'), src=html.match(/<script>([\s\S]*)<\/script>/)[1];
function stub(){ return new Proxy(function(){},{get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },set(){return true;},apply(){return stub();},construct(){return stub();}}); }
const store={'trainlog.jsonl.v1':clean.map(e=>JSON.stringify(e)).join('\n')}; if(cfg) store['trainlog.cfg.v1']=JSON.stringify({...cfg,syncUrl:'',feedbackUrl:''});
const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];},key:i=>Object.keys(store)[i]??null,get length(){return Object.keys(store).length;}};
const A=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','console',
  src+';return {sets,exById,toLb,isChartFree,impliedE1,setE1RM};')(stub(),stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),{log(){},warn(){},error(){}});

const S=A.sets().filter(s=>s.set_kind!=='warmup'&&!(s.group&&s.group.pos>0));
const lbOf=w=>w?(w.unit==='kg'?w.value*2.20462:w.value):0;
const name=id=>(A.exById[id]||{name:id}).name;
const pct=(a,b)=>b?Math.round(a/b*100)+'%':'—';
const first=clean.find(e=>e.type==='set'), last=[...clean].reverse().find(e=>e.type==='set');
console.log('Prospective check — '+S.length+' working sets, '+first.ts.slice(0,10)+' to '+last.ts.slice(0,10));
console.log('Excluded '+synthetic.size+' automation-made session(s): '+[...synthetic].map(k=>bySess[k][0].ts.slice(0,16)).join(', ')+'\n');

/* 1. suggested load increases */
const withSug=S.filter(s=>s.suggestion&&s.suggestion.lb!=null);
const prevOnTrack=s=>{ let p=null; for(const x of S){ if(x===s) break; if(x.exercise_id===s.exercise_id&&JSON.stringify(x.modifiers||null)===JSON.stringify(s.modifiers||null)) p=x; } return p; };
const rows=withSug.map(s=>{ const sg=s.suggestion, shown=sg.shown?lbOf(sg.shown):sg.lb, L=lbOf(s.weight), prev=prevOnTrack(s);
  const up=prev&&shown>lbOf(prev.weight)+0.5;
  return {s, basis:sg.basis||'', up, taken:Math.abs(L-shown)<=Math.max(1,shown*0.005), heavier:L>shown+1, lighter:L<shown-1,
    repsHit:s.reps>=(sg.reps||0), onRpe:s.rpe!=null&&sg.target_rpe!=null&&Math.abs(s.rpe-sg.target_rpe)<=1, rpeDiff:s.rpe!=null&&sg.target_rpe!=null?s.rpe-sg.target_rpe:null, chart:!A.isChartFree(A.exById[s.exercise_id])};
});
const ups=rows.filter(r=>r.up), upTaken=ups.filter(r=>r.taken);
console.log('1. SUGGESTED LOAD INCREASES ('+ups.length+' of '+rows.length+' recorded suggestions)');
console.log('   taken as suggested: '+upTaken.length+' ('+pct(upTaken.length,ups.length)+') · went heavier '+ups.filter(r=>r.heavier).length+' · went lighter '+ups.filter(r=>r.lighter).length);
console.log('   of those taken: reps hit '+pct(upTaken.filter(r=>r.repsHit).length,upTaken.length)+' · RPE within ±1 of target '+pct(upTaken.filter(r=>r.onRpe).length,upTaken.length)
  +' · mean RPE vs target '+(upTaken.filter(r=>r.rpeDiff!=null).reduce((a,r)=>a+r.rpeDiff,0)/Math.max(1,upTaken.filter(r=>r.rpeDiff!=null).length)).toFixed(2));
['chart','machine/cable'].forEach((lab,i)=>{ const g=ups.filter(r=>r.chart===(i===0)), t=g.filter(r=>r.taken);
  console.log('   '+lab.padEnd(13)+' '+g.length+' increases, taken '+pct(t.length,g.length)+', RPE on target when taken '+pct(t.filter(r=>r.onRpe).length,t.length)); });
const byBasis={}; ups.forEach(r=>{ const b=r.basis.replace(/\d+/g,'#'); (byBasis[b]=byBasis[b]||[]).push(r); });
Object.entries(byBasis).sort((a,b)=>b[1].length-a[1].length).forEach(([b,g])=>console.log('     '+String(g.length).padStart(3)+'× '+b.slice(0,48).padEnd(48)+' taken '+pct(g.filter(r=>r.taken).length,g.length)));
const all=rows, allTaken=all.filter(r=>r.taken);
console.log('   all suggestions (incl. holds): taken '+pct(allTaken.length,all.length)+', RPE on target when taken '+pct(allTaken.filter(r=>r.onRpe).length,allTaken.length)+'\n');

/* 2. calibration readiness */
const bin=r=>r<=5?'1-5':r<=8?'6-8':r<=12?'9-12':'13+';
const per={}; S.filter(s=>s.rpe!=null).forEach(s=>{ const p=per[s.exercise_id]=per[s.exercise_id]||{n:0,sess:new Set(),bins:new Set()}; p.n++; p.sess.add(s.session_id); p.bins.add(bin(s.reps)); });
const ready=Object.entries(per).map(([id,p])=>({id,n:p.n,sess:p.sess.size,bins:p.bins.size,chart:!A.isChartFree(A.exById[id]),
  bias:p.n>=15&&p.sess.size>=5, curve:p.n>=20&&p.bins.size>=3})).sort((a,b)=>b.n-a.n);
console.log('2. CALIBRATION READINESS (plan §3: bias ≥15 sets over ≥5 sessions; curve ≥20 sets over ≥3 rep ranges, chart path only)');
ready.slice(0,15).forEach(r=>console.log('   '+name(r.id).slice(0,30).padEnd(30)+' '+String(r.n).padStart(3)+' sets '+String(r.sess).padStart(2)+' sess '+r.bins+' ranges  '+(r.chart?'chart  ':'machine')+'  bias '+(r.bias?'READY':'—')+'  curve '+(r.curve&&r.chart?'READY':'—')));
console.log('   ready for bias correction: '+ready.filter(r=>r.bias).length+' · ready for a personal curve: '+ready.filter(r=>r.curve&&r.chart).length+' (of '+ready.length+' exercises with RPE)\n');

/* 3. RPE consistency on the chart path */
console.log('3. RPE REPORTING (chart-path exercises)');
const sess={}; S.filter(s=>s.rpe!=null&&!A.isChartFree(A.exById[s.exercise_id])).forEach(s=>{ const k=s.session_id+'|'+s.exercise_id; (sess[k]=sess[k]||[]).push(s); });
let spreads=[], drift=[];
Object.values(sess).forEach(g=>{ if(g.length<2) return; const e=g.map(s=>A.impliedE1(lbOf(s.weight),s.reps,s.rpe)).filter(Boolean); if(e.length<2) return;
  spreads.push((Math.max(...e)-Math.min(...e))/Math.max(...e)); drift.push((e[e.length-1]-e[0])/e[0]); });
const med=a=>{ const b=[...a].sort((x,y)=>x-y); return b.length?b[Math.floor(b.length/2)]:null; };
console.log('   same exercise, same session: the e1RM your RPEs imply varies by a median '+(med(spreads)*100||0).toFixed(1)+'% across sets ('+spreads.length+' exercise-sessions)');
console.log('   last set vs first set: median '+((med(drift)||0)*100).toFixed(1)+'% (negative = later sets imply a lower e1RM: within-session fatigue, which the engine fatigue adjustment handles)');
const failed=S.filter(s=>s.failed), amraps=S.filter(s=>s.role==='amrap');
console.log('   true-failure anchors: '+failed.length+' missed-rep sets, '+amraps.length+' AMRAPs — '+(failed.length+amraps.length<5?'too few to measure "reps actually left" directly':'enough for a first look')+'\n');

/* 4. stagnation probes */
const probes=rows.filter(r=>/probe/i.test(r.basis));
console.log('4. STAGNATION PROBES: '+probes.length+' suggested, '+probes.filter(r=>r.taken).length+' taken'+(probes.length?', RPE on target when taken '+pct(probes.filter(r=>r.taken&&r.onRpe).length,probes.filter(r=>r.taken).length):''));
