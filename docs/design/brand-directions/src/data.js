/* node data.js <repo root> — the mockups' content, from the real app in demo mode (a made-up lifter, network blocked) */
const { webkit, devices } = require('playwright');
const http=require('http'), fs=require('fs'), path=require('path');
const ROOT=process.argv[2], PORT=9400+Math.floor(Math.random()*200);
const server=http.createServer((req,res)=>{ let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/') p='/index.html';
  const f=path.join(ROOT,p); if(!fs.existsSync(f)){ res.statusCode=404; return res.end(); }
  res.setHeader('Content-Type',p.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'); res.end(fs.readFileSync(f)); }).listen(PORT);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const browser=await webkit.launch(); const ctx=await browser.newContext({...devices['iPhone 15']});
  await ctx.route(/^(?!http:\/\/localhost)/,r=>r.abort());
  const page=await ctx.newPage(); page.on('pageerror',e=>console.log('PAGEERR',e.message)); page.on('dialog',x=>x.accept());
  await page.goto('http://localhost:'+PORT+'/?demo'); await sleep(800);
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await sleep(800);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:3})); await sleep(2500);
  const data=await page.evaluate(()=>{
    const p=currentPhase(), raw=todayDay(), day=planFor(raw);
    const pre=buildBriefing({dayName:day.name, slots:day.slots.map(s=>Array.isArray(s.sets)?s:{...s,sets_target:s.sets,sets:[]})});
    const rows=pre.groups.flatMap(g=>g.rows.map(r=>({...r,group:g.key})));
    let before=0; ROADMAP.slice(0,p.idx).forEach(b=>before+=blockLen(b));
    const blocks=ROADMAP.map(b=>({type:b.taper?'peak':b.type, name:blockName(b), weeks:b.weeks||blockLen(b), len:blockLen(b), deload:blockLen(b)>(b.weeks||blockLen(b))}));
    const next=ROADMAP[p.idx+1];
    const from=weekStart(new Date()).getTime();
    const slots=day.slots.map(sl=>{ const ex=exById[sl.ex], pr=previewRx(sl), last=lastTimeRows(sl,sl.sets)[0]||null;
      return {name:ex.name, sets:sl.sets, reps:sl.reps, rpe:sl.rpe, lb:pr.lb, rx:pr.reps, last:last?{w:typedLabel(last.exercise_id||sl.ex,last.weight),reps:last.reps}:null,
        why:(()=>{ try{ return explainRx(sl,pr,{}).line; }catch(e){ return ''; } })(), flag:(f=>f&&isWarning(f)?condArea(f.cond||'')||'shoulder':null)(flagFor(sl.ex,sl.modifiers)), main:(CFG.goals||[]).includes(sl.ex)}; });
    const jl=jointLines();
    return {app:APP_NAME, date:new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}),
      day:day.name, block:p.label, week:p.week, weeks:p.weeks,
      plan:{top:pre.top, held:rows.filter(r=>r.group==='hold'&&!r.flagOnly).length, push:rows.filter(r=>r.group==='push'||(r.flagOnly&&r.dir>0)).length, warn:rows.filter(r=>r.flagOnly).length},
      joints:jl.map(j=>({band:j.band,text:j.text})),
      program:{blocks, idx:p.idx, at:before+Math.max(0,p.week-1), total:roadmapWeeks(), sentence:blockName(ROADMAP[p.idx])+' block · week '+p.week+' of '+(ROADMAP[p.idx].weeks||blockLen(ROADMAP[p.idx]))+' · '+(next?'next: '+blockName(next):'the last block')},
      thisWeek:{done:LOG.filter(e=>e.type==='session_end'&&new Date(e.ts).getTime()>=from).length, planned:activeSplit().days},
      minutes:estSessionLength(day), slots,
      soreAreas:SORE_GROUPS.filter(g=>soreGroupsFor(day).includes(g.id)).map(g=>g.label)};
  });
  fs.writeFileSync(path.join(__dirname,'..','data.json'),JSON.stringify(data,null,1));
  console.log('ok: '+data.day+', '+data.slots.length+' exercises, '+data.program.blocks.length+' blocks');
  await browser.close(); server.close();
})().catch(e=>{ console.error(e); server.close(); process.exit(1); });
