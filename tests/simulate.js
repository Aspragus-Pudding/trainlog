#!/usr/bin/env node
/* Persona simulator for Trainlog.

     node tests/simulate.js            all personas, 26 weeks, summary + checks
     node tests/simulate.js --weeks 40 --persona fatigue --verbose

   Made-up lifters train through the app's REAL code — the program builder,
   generatedDays(), the check-in's readiness and joint logic, suggestFor(),
   logSet(), session_end, proposal cards — with a modelled body behind them:
   a true e1RM per exercise that grows (or doesn't) per exposure, fatigue that
   builds and drains, day-to-day noise, RPE reporting noise, attendance, and
   joint flare-ups. Nothing here changes the app; it loads index.html with a
   stubbed DOM and a controllable clock (same pattern as the invariants test).

   What it's for: things a real log can't show for months — loads running away
   or collapsing, blocks advancing, the joint ladder coming back down after a
   flare, deload proposals under fatigue, progression rates promoting and
   demoting. Batch C's stall engine is validated here (spec §8).

   The body model is deliberately simple and is NOT evidence about training:
   gain rates, fatigue and noise below are made-up persona parameters. The
   reps a lifter can do at a load come from the app's own %1RM chart, so the
   simulation checks the engine's internal consistency, not physiology.
   Exit code is non-zero if a check fails. Deterministic (seeded). */
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(process.env.TRAINLOG_HTML||path.join(__dirname,'..','index.html'),'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
const args=process.argv.slice(2), arg=(k,d)=>{ const i=args.indexOf('--'+k); return i>=0?args[i+1]:d; };
const WEEKS=+arg('weeks',26), ONLY=arg('persona',null), VERBOSE=args.includes('--verbose');

/* ---------- deterministic randomness and a controllable clock ---------- */
function rng(seed){ let s=seed>>>0||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>17; s^=s<<5; s>>>=0; return s/4294967296; }; }
function makeClock(startMs){
  let now=startMs;
  const RealDate=Date;
  class SimDate extends RealDate{
    constructor(...a){ if(a.length) super(...a); else super(now); }
    static now(){ return now; }
  }
  return {Date:SimDate, set:ms=>{ now=ms; }, get:()=>now, advance:ms=>{ now+=ms; }};
}
function stub(){ return new Proxy(function(){},{ get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },
  set(){ return true; }, apply(){ return stub(); }, construct(){ return stub(); } }); }
function boot(clock){
  const store={};
  const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];},key:i=>Object.keys(store)[i],get length(){return Object.keys(store).length;}};
  const names=['CFG','LOG','EX','exById','sets','append','generatedDays','todayDay','programPosition','currentPhase','seedDraft','suggestFor',
    'logSet','soreGroupsFor','readinessScore','physicalCut','jointNoteFor','ensureInitialTM','slotTrack','activeProposals','builderDefaults',
    'builderPlan','applyBuilder','rateOf','tmFor','toLb','loadable','rtfFromPct','pct1RM','bwOffset','isBW','JOINTS','jointLevel','jointTrend',
    'familyOf','splitFor','blockLen','stepUp','deloadSignals','mainEligible','dismissProposal','rateState','stallPlan','stallState','interventions',
    'stallVideoWanted','FAMILY_STICKING','fatigueSignals'];
  const pick=names.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',');
  const body=src+'\n;return {'+pick+',getDraft:()=>draft,setSession:x=>{session=x},getSession:()=>session,getROADMAP:()=>ROADMAP,'+
    'setROADMAP:r=>{ROADMAP=r},getCFG:()=>CFG};';
  const fn=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','console','Date',body);
  return fn(stub(),stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),{log(){},warn(){},error(){}},clock.Date);
}

/* ---------- personas ----------
   base: starting true e1RM (lb) by family; isolation by pattern.
   gain(week): fractional e1RM gain per exposure of a lift that week.
   All made-up — the point is shape, not realism. */
const BASE={squat:285,hinge:335,horizontal_press:215,vertical_press:135,vertical_pull:210,horizontal_pull:190,
  elbow_flexion:70,elbow_extension:80,abduction:45,knee_extension:150,knee_flexion:130,calf_raise:220,trunk:80,
  shrug:250,hip_abduction:160,hip_adduction:160,wrist:50,grip:120,other:80};
const STICK={squat:'bottom',deadlift:'off_floor',bench:'off_chest'};
const PERSONAS={
  responder:{label:'Responder', profile:'even_mix', experience:'intermediate', gain:()=>0.006, noise:0.02, rpeNoise:0.5, attend:1},
  non_responder:{label:'Non-responder', profile:'even_mix', experience:'intermediate', gain:()=>0.0, noise:0.025, rpeNoise:0.5, attend:1},
  stall_week8:{label:'Stalls at week 8', profile:'size_first', experience:'intermediate', gain:w=>w<8?0.006:0, noise:0.02, rpeNoise:0.5, attend:1},
  deficit:{label:'In a deficit', profile:'size_first', experience:'intermediate', energy:'deficit', gain:()=>-0.0015, noise:0.02, rpeNoise:0.5, attend:1, bwStart:200, bwPerWeek:-0.8},
  fatigue:{label:'Stall is fatigue', profile:'even_mix', experience:'intermediate', gain:()=>0.004, fatiguePerWeek:0.012, noise:0.02, rpeNoise:0.5, attend:1, acceptDeload:true},
  novice:{label:'New lifter (fast)', profile:'size_first', experience:'novice', gain:w=>w<10?0.012:0.003, noise:0.02, rpeNoise:0.5, attend:1, base:0.6},
  shoulder:{label:'Shoulder instability', profile:'size_first', experience:'intermediate', gain:()=>0.004, noise:0.02, rpeNoise:0.5, attend:1,
    conditions:['shoulder_instability'], jointUsual:{shoulder:'mild'}, flare:{joint:'shoulder', from:6, to:8}},
  advanced:{label:'Advanced, flat, shoulder', profile:'even_mix', experience:'advanced', gain:()=>0.0, noise:0.02, rpeNoise:0.5, attend:1,
    conditions:['shoulder_instability']},
  sporadic:{label:'Trains less than weekly', profile:'even_mix', experience:'intermediate', gain:()=>0.004, noise:0.02, rpeNoise:0.5, attend:0.18}
};

/* ---------- one persona run ---------- */
function simulate(key){
  const P=PERSONAS[key], R=rng(Object.keys(PERSONAS).indexOf(key)*7919+17);
  const start=Date.UTC(2026,0,5,9,0,0);
  const clock=makeClock(start), A=boot(clock), C=A.getCFG();
  const DAY=864e5;
  // setup through the app's own builder
  C.units='lb'; if(P.conditions) C.conditions=[...P.conditions]; if(P.energy) C.energy=P.energy;
  const B=A.builderDefaults(false); B.path='full'; B.profile=P.profile; B.experience=P.experience; B.conds=[...(P.conditions||[])];
  B.goals=['squat','deadlift','bench'];
  const truth={};   // exercise id → true e1RM (lb, total load)
  // bodyweight lifts: truth is what the lifter can ADD; capacity = bodyweight + that
  const isBodyLift=ex=>ex.load==='bodyweight_plus'||ex.load==='bodyweight';
  const baseFor=ex=>{ if(isBodyLift(ex)) return 40*(P.base||1);
    const f=A.familyOf(ex), b=(f!=='isolation'?BASE[f]:BASE[ex.pattern])||80; return b*(P.base||1)*(ex.load==='machine'||ex.load==='stack'?1.1:1); };
  const added=id=>{ if(truth[id]==null) truth[id]=baseFor(A.exById[id]); return truth[id]; };
  const trueOf=id=>isBodyLift(A.exById[id])?(bw||180)+added(id):added(id);
  B.est={}; B.goals.forEach(id=>{ B.est[id]=Math.round(trueOf(id)*0.95/5)*5; });
  const plan=A.builderPlan(B); A.applyBuilder(B,plan);
  if(P.jointUsual) C.jointUsual={...P.jointUsual};
  const trace=[], issues=[], weekly=[], ivLog=[], ivSlots=[];
  let fatigue=0, bw=P.bwStart||180, deloads=0;
  for(let w=0;w<WEEKS;w++){
    const weekStart=start+w*7*DAY;
    const dpw=(A.splitFor(A.getROADMAP()[A.programPosition().idx])||{days:5}).days;
    // proposals at the start of the week
    const props=A.activeProposals();
    // accept a deload only if this persona would; stall cards are accepted (a
    // lifter following the app's advice) unless the persona says otherwise;
    // everything else is declined like a user would
    const tiredAtStart=A.fatigueSignals().length>0;
    const ivBefore=A.interventions().length;
    props.forEach(p=>{ clock.set(weekStart);
      if((p.id==='deload'||p.id.endsWith(':hard'))&&P.acceptDeload){ p.accept.fn(); A.dismissProposal(p.id); deloads++; }
      else if(p.id.startsWith('stall:')&&!p.id.endsWith(':hard')&&P.acceptStall!==false){ p.accept.fn(); A.dismissProposal(p.id); }
      else A.dismissProposal(p.id); });
    A.interventions().slice(ivBefore).forEach(s=>ivLog.push({w:w+1, ex:s.ev.exercise_id, step:s.ev.step, kind:s.ev.kind,
      variant:s.ev.variant?(s.ev.variant.ex||JSON.stringify(s.ev.variant.modifiers)):null}));
    const ph0=A.currentPhase();
    for(let d=0;d<dpw;d++){
      if(R()>P.attend) continue;
      clock.set(weekStart+Math.round(d*7/dpw)*DAY);
      const day=A.todayDay(); if(!day) continue;
      const phase=A.currentPhase();
      if(phase.onDeload) fatigue=Math.max(0,fatigue-0.03);
      // the check-in, exactly as the app's #ckgo handler does it
      (day.slots||[]).forEach(sl=>{ if(['topback','amrap','maint'].includes(sl.structure)) A.ensureInitialTM(A.slotTrack(sl).ex); });
      day.slots.filter(sl=>sl.iv).forEach(sl=>ivSlots.push({w:w+1, ex:sl.ex, structure:sl.structure||'', sets:sl.sets, addedDay:!!sl.ivDay}));
      const sess={id:'S'+w+'_'+d,dayId:day.id,dayName:day.name,soreGroups:A.soreGroupsFor(day),openIdx:0,ratings:{},adj:null,score:null,
        slots:day.slots.map(s=>({...s,sets_target:s.sets,sets:[]})),startedAt:clock.get()};
      A.setSession(sess);
      const tired=fatigue>0.05;
      const st={bodyweight:bw,sleep:tired?(fatigue>0.1?2:2.5):3,motivation:tired?2.5:3,recovery:3,sore:{},joints:{}};
      sess.soreGroups.forEach(g=>{ st.sore[g]=fatigue>0.12?2:3; });
      if(P.flare){ const inFlare=w>=P.flare.from&&w<=P.flare.to; st.joints[P.flare.joint]=inFlare?3:(R()<0.6?1:0); if(!st.joints[P.flare.joint]) delete st.joints[P.flare.joint]; }
      A.append({type:'readiness',bodyweight:st.bodyweight,sleep_quality:st.sleep,motivation:st.motivation,recovery:st.recovery,soreness:st.sore,joints:st.joints,joint_scale:3});
      sess.readiness={sleep:st.sleep,motivation:st.motivation,recovery:st.recovery,sore:st.sore,joints:st.joints};
      sess.score=A.readinessScore(st,sess.soreGroups); sess.adj=A.physicalCut(st,sess.soreGroups);
      sess.slots.forEach(sl=>{ const before=sl.joint; sl.joint=A.jointNoteFor(A.exById[sl.ex].pattern);
        if(sl.joint&&sl.joint.level>=4&&!(before&&before.level>=4)&&!sl.sets.length&&sl.sets_target>2) sl.sets_target--; });
      if(sess.adj) sess.slots.slice(0,2).forEach(s=>{ s.sets_target=Math.max(1,s.sets_target+sess.adj.sets); });
      // the lifter does the work
      const dayNoise=1+(R()*2-1)*P.noise;
      sess.slots.forEach((slot,i)=>{
        sess.openIdx=i; A.seedDraft(slot);
        const ex=A.exById[slot.ex], E=trueOf(slot.ex)*(1-fatigue)*dayNoise, off=A.bwOffset(ex)||0;
        let withinFatigue=0;
        for(let k=0;k<slot.sets_target&&k<12;k++){
          const dr=A.getDraft();
          // no suggestion yet: the lifter picks something sensible for the target
          if(!(dr.weight>0)||dr.suggested===false&&!slot.sets.length&&!dr.suggestedLb){
            const p=(A.pct1RM(slot.reps[1]+(10-slot.rpe))||70)/100; dr.weight=A.loadable(slot,Math.max(0,E*p-off)); dr.unit='lb';
          }
          const L=(dr.unit==='kg'?dr.weight*2.20462:dr.weight)+off;
          const Eset=E*(1-withinFatigue), rtf=A.rtfFromPct(L/Eset*100);
          const maxReps=rtf==null?(L>Eset?0:30):Math.floor(rtf);
          const target=dr.reps||slot.reps[0];
          // aim for the prescribed reps; stop short only if they can't be done
          let reps=Math.min(target,maxReps), failed=false;
          if(reps<target){ failed=true; if(reps<1) reps=Math.max(1,maxReps); }
          if(slot.structure==='amrap'&&k===0||dr.rpe>=10) reps=Math.max(reps,Math.min(maxReps,30));
          let rpe=rtf==null?(L>Eset?10:5):10-(rtf-reps);
          rpe=Math.round(Math.max(5,Math.min(10,rpe+(R()*2-1)*P.rpeNoise))*2)/2;
          if(L>Eset*1.0001&&rtf==null) issues.push({w,day:day.name,ex:slot.ex,msg:'prescribed above true 1RM',L:Math.round(L),E:Math.round(Eset)});
          dr.reps=reps; dr.rpe=rpe; dr.failed=failed;
          A.logSet(slot,i,'straight');
          withinFatigue+=0.015;
          trace.push({w,d,ex:slot.ex,role:slot.role,structure:slot.structure||'',L:Math.round(L-off),reps,rpe,failed,E:Math.round(Eset),
            sug:dr.suggestedLb!=null?Math.round(dr.suggestedLb):null});
        }
        // the lifter answers "where did it slow down?" after a hard or missed first set, and films when asked
        if(B.goals.includes(slot.ex)&&slot.sets.length){ const f=slot.sets[0];
          if((f.failed||f.rpe>=9.5)&&STICK[slot.ex]&&!A.LOG.some(e=>e.type==='sticking_report'&&e.session_id===sess.id&&e.exercise_id===slot.ex))
            A.append({type:'sticking_report',exercise_id:slot.ex,session_id:sess.id,set_id:f.id,region:STICK[slot.ex]});
          if(A.stallVideoWanted(slot.ex)) A.append({type:'video_prompt',exercise_id:slot.ex,session_id:sess.id,done:true,trigger:'stall'}); }
        // the body adapts: a gain per exposure (persona-specific)
        truth[slot.ex]=added(slot.ex)*(1+P.gain(w));
      });
      A.append({type:'session_end',session_id:sess.id,day_name:sess.dayName,session_rpe:7,joints:{},joint_scale:3,duration_s:3600});
      A.setSession(null);
    }
    fatigue=Math.max(0,fatigue+(P.fatiguePerWeek||0)-(ph0.onDeload?0.06:0));
    if(bw!=null) bw+=P.bwPerWeek||0;
    // weekly snapshot of the main lifts
    const sigFull=A.deloadSignals()||[], sig=sigFull.map(x=>x.k);
    const activeCount={}; A.interventions().filter(s=>s.active).forEach(s=>{ activeCount[s.ev.exercise_id]=(activeCount[s.ev.exercise_id]||0)+1; });
    const snap={tiredAtStart, activeMax:Math.max(0,...Object.values(activeCount)), signals:sig, w:w+1, phase:(()=>{ const p=A.currentPhase(); return (p.onDeload?'deload':p.type)+(p.week?' w'+p.week:''); })(), proposals:props.map(p=>p.id), lifts:{}};
    B.goals.forEach(id=>{
      const top=trace.filter(t=>t.ex===id&&t.w===w).sort((a,b)=>b.L-a.L)[0];
      const tm=A.tmFor(id);
      const j=A.jointNoteFor(A.exById[id].pattern);
      const sp=A.stallPlan(id);
      snap.lifts[id]={stall:sp?(sp.active?'active:'+sp.active.ev.kind:sp.st.kind+(sp.kind?':'+sp.kind:'')):null, top:top?top.L+'×'+top.reps+'@'+top.rpe+(top.failed?'✕':''):'—', truth:Math.round(trueOf(id)*(1-fatigue)), rate:A.rateOf(id), tm:tm?Math.round(tm.tm):null, joint:j?j.level:1};
    });
    weekly.push(snap);
  }
  return {key,P,trace,issues,weekly,truth,deloads,A,ivLog,ivSlots};
}

/* ---------- checks (generic now; batch C adds the stall-engine ones) ---------- */
function checks(run){
  const out=[]; const ok=(c,msg,detail)=>out.push({pass:!!c,msg,detail});
  const {key,P,trace,weekly,issues,A}=run;
  ok(trace.length>0,'it trained','');
  ok(issues.length===0,'never prescribed a load above the lifter\'s true 1RM',JSON.stringify(issues.slice(0,3)));
  const main=['squat','deadlift','bench'];
  // the engine's loads track the body: main-lift top sets within a sane band of true capacity
  main.forEach(id=>{
    const tops=trace.filter(t=>t.ex===id&&!t.failed&&t.reps>=1);
    if(tops.length<4) return;
    const last=tops.slice(-6), ratio=last.map(t=>t.L/t.E);
    ok(ratio.every(r=>r>0.35&&r<1.0),id+': recent loads stay between 35% and 100% of true capacity (no runaway, no collapse)',ratio.map(r=>r.toFixed(2)).join(','));
  });
  const failRate=trace.filter(t=>t.failed).length/Math.max(1,trace.length);
  ok(failRate<0.2,'missed-rep sets under 20% of all sets',(failRate*100).toFixed(1)+'%');
  // blocks advance with sessions
  const phases=[...new Set(weekly.map(w=>w.phase.split(' ')[0]))];
  if(P.attend>=0.9&&WEEKS>=20) ok(phases.length>=2,'the program moves through more than one block type',phases.join(','));
  if(key==='responder'){ const d=main.map(id=>{ const t=trace.filter(x=>x.ex===id&&!x.failed); return t.length>3?t.slice(-3).reduce((a,x)=>Math.max(a,x.L),0)-t.slice(0,3).reduce((a,x)=>Math.max(a,x.L),0):0; });
    ok(d.every(x=>x>0),'responder: every main lift\'s top-set load went up',d.join(',')); }
  if(key==='non_responder'){ main.forEach(id=>{ const t=trace.filter(x=>x.ex===id&&!x.failed); if(t.length<6) return; const hi=Math.max(...t.slice(-6).map(x=>x.L/x.E));
    ok(hi<1.0,'non-responder '+id+': loads don\'t climb past what the lifter can do',hi.toFixed(2)); }); }
  if(key==='fatigue') ok(weekly.some(w=>w.proposals.includes('deload')),'fatigue: a deload is proposed',weekly.map(w=>w.proposals.join('+')||'-').join(' '));
  // without fatigue or a flare, the deload card should be rare (the 10-week calendar note aside)
  // (a deficit lifter's strength is falling, so the same weights really do feel harder — excluded)
  // The 25% bound depends on this file's own made-up noise (±2% daily strength, ±0.5 RPE).
  if(!P.fatiguePerWeek&&!P.flare&&!(P.gain(0)<0)){ const n=weekly.filter(w=>(w.signals||[]).some(k=>k==='rpe'||k==='readiness')).length;
    ok(n<=Math.ceil(WEEKS*0.25),'no fatigue: a fatigue signal (RPE drift / falling readiness) fires in at most a quarter of weeks',n+' of '+WEEKS); }
  if(key==='shoulder'){
    const fl=P.flare, during=weekly.filter(w=>w.w-1>=fl.from&&w.w-1<=fl.to).map(w=>w.lifts.bench.joint), after=weekly.filter(w=>w.w-1>fl.to+6).map(w=>w.lifts.bench.joint);
    ok(during.some(l=>l>=3),'shoulder: the ladder responds to the flare (level 3+ on pressing)',during.join(','));
    ok(after.length===0||after.every(l=>l<=2),'shoulder: and comes back down once the flare has passed',after.join(','));
  }
  /* ---- stall engine (batch C) ---- */
  const {ivLog,ivSlots}=run;
  ok(weekly.every(w=>w.activeMax<=1),'stall engine: never more than one active intervention per lift',weekly.map(w=>w.activeMax).join(''));
  // the ladder climbs in order: step 2 only after a step 1 on that lift, step 3 only after a step 2
  const order=main.every(id=>{ const st=ivLog.filter(x=>x.ex===id).map(x=>x.step);
    return st.every((v,i)=>v<=1||st.slice(0,i).includes(v-1)||v===4&&st.slice(0,i).includes(3)); });
  ok(order,'stall engine: the ladder goes in order (more practice, then diagnose, then a variant)',ivLog.map(x=>x.ex+':'+x.step).join(' '));
  // nothing adds work while fatigue is showing
  const pushedTired=weekly.filter(w=>w.tiredAtStart&&w.proposals.some(id=>/^stall:[^:]+:(1|3)/.test(id)));
  ok(pushedTired.length===0,'stall engine: no more-work card while a fatigue signal is showing',pushedTired.map(w=>'wk'+w.w).join(','));
  // a deload ends added volume
  const L=A.LOG, starts=L.map((e,i)=>({e,i})).filter(x=>x.e.type==='intervention_start'&&(x.e.kind==='volume'||x.e.kind==='frequency'));
  const dl=L.map((e,i)=>({e,i})).filter(x=>x.e.type==='deload_start');
  const leak=starts.filter(x=>{ const end=L.findIndex(e=>e.type==='intervention_end'&&e.start_id===x.e.id);
    const d=dl.find(y=>y.i>x.i); return d&&(end<0||end>d.i)&&A.interventions().find(s=>s.ev.id===x.e.id&&(s.active||new Date(s.endTs)>new Date(d.e.ts))); });
  ok(leak.length===0,'stall engine: taking a deload stops added practice volume',leak.map(x=>x.e.exercise_id).join(','));
  if(key==='fatigue') ok(!weekly.some(w=>w.tiredAtStart&&w.proposals.some(id=>/^stall:[^:]+:1$/.test(id))),'fatigue: gets a deload, not more volume, whenever fatigue is showing',weekly.map(w=>(w.tiredAtStart?'T':'-')+(w.proposals.join('+'))).join(' '));
  if(key==='deficit'){ ok(weekly.some(w=>w.proposals.some(id=>id.endsWith(':deficit'))),'deficit: stalls get the deficit explanation',weekly.map(w=>w.proposals.join('+')||'-').join(' '));
    ok(ivLog.length===0,'deficit: and no intervention',JSON.stringify(ivLog)); }
  if((P.conditions||[]).includes('shoulder_instability')){ const addedDays=ivSlots.filter(x=>x.addedDay).map(x=>x.ex), press=id=>A.exById[id].load==='barbell'&&['horizontal_press','vertical_press'].includes(A.familyOf(A.exById[id]));
    ok(!addedDays.some(press),'shoulder: no intervention adds a day of barbell pressing (added days used: '+([...new Set(addedDays)].join(', ')||'none')+')',addedDays.join(',')); }
  if(key==='sporadic'){ ok(weekly.some(w=>w.proposals.some(id=>id.endsWith(':exposure'))),'less than weekly: flagged as an exposure problem',weekly.map(w=>w.proposals.join('+')||'-').join(' '));
    ok(!weekly.some(w=>w.proposals.some(id=>/^stall:[^:]+:d/.test(id))),'less than weekly: and never treated as a stall',weekly.map(w=>w.proposals.join('+')||'-').join(' ')); }
  if(key==='novice'){ const r=weekly.map(w=>w.lifts.squat.rate);
    ok(r[0]==='fast','new lifter: main lifts start fast',r.join(','));
    ok(r.some(x=>x==='standard')||WEEKS<16,'new lifter: and demote once gains slow',r.join(',')); }
  return out;
}

/* ---------- run ---------- */
let failed=0;
for(const key of Object.keys(PERSONAS)){
  if(ONLY&&key!==ONLY) continue;
  const run=simulate(key), res=checks(run);
  console.log('\n'+run.P.label+' ('+key+') — '+WEEKS+' weeks, '+run.trace.length+' sets'+(run.deloads?', '+run.deloads+' deload(s) taken':''));
  const show=VERBOSE?run.weekly:run.weekly.filter((w,i)=>i%4===0||i===run.weekly.length-1);
  show.forEach(w=>console.log('  wk '+String(w.w).padStart(2)+'  '+w.phase.padEnd(11)+' '+['squat','deadlift','bench'].map(id=>{ const l=w.lifts[id];
    return id.slice(0,5)+' '+String(l.top).padEnd(13)+' true '+String(l.truth).padEnd(4)+' '+(l.rate==='fast'?'F':'s')+(l.joint>1?' j'+l.joint:''); }).join(' | ')+(w.proposals.length?'  ['+w.proposals.join(',')+(w.signals&&w.signals.length?': '+w.signals.join('+'):'')+']':'')));
  const firstStall={}; run.weekly.forEach(w=>Object.entries(w.lifts).forEach(([id,l])=>{ if(l.stall&&!firstStall[id]) firstStall[id]='wk '+w.w+' ('+l.stall+')'; }));
  console.log('  stalls first seen: '+(Object.entries(firstStall).map(([id,v])=>id+' '+v).join(', ')||'none'));
  console.log('  interventions: '+(run.ivLog.map(x=>'wk '+x.w+' '+x.ex+' '+x.step+':'+x.kind+(x.variant?'('+x.variant+')':'')).join(' → ')||'none'));
  res.forEach(r=>{ if(!r.pass) failed++; console.log('  '+(r.pass?'✓':'✗ FAIL')+' '+r.msg+(r.pass?'':'  '+r.detail)); });
}
console.log('\n'+(failed?failed+' check(s) failed':'all checks passed'));
process.exit(failed?1:0);
