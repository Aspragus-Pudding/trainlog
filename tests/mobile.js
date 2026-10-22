#!/usr/bin/env node
/* The app on phone-shaped browsers (v1.67, the mobile-layout fix).

     npm i playwright && npx playwright install webkit chromium   (once)
     node tests/mobile.js            every profile, both engines
     node tests/mobile.js --quick    iPhone SE (WebKit) and Pixel 7 (Chromium) only

   Desktop headless Chromium has no toolbar, no keyboard, no home indicator and
   isn't WebKit, which is how the hidden-Next and accidental-exit bugs got past
   the other tests. This runs WebKit and Chromium with iPhone SE, iPhone 13,
   iPhone 15 and Pixel 7 profiles (touch on), and on every setup step and every
   sheet plays the hard cases:
     - toolbar:     the visible height 80px shorter;
     - kb-android:  the page 300px shorter (interactive-widget=resizes-content);
     - kb-ios:      the visible viewport 300px shorter, the layout unchanged
                    (window.__vvOverride, the hook the app reads);
     - safe:        safe-area insets (47px top, 34px bottom).
   For each it asserts: the primary action is fully visible and its centre hits
   it; the body scrolls to its last element; back stays in the app (a setup
   step goes back a step, a sheet closes, nothing leaves the page). Then it runs
   the full setup for the three personas on every profile, and checks that a
   half-finished setup resumes after a reload. Demo mode only, network blocked:
   it never touches real data. Exit code 1 on any failure. */
let pw; try{ pw=require('playwright'); }catch(e){ console.log('Playwright is not installed: npm i playwright && npx playwright install webkit chromium'); process.exit(2); }
const { webkit, chromium, devices } = pw;
const http=require('http'), fs=require('fs'), path=require('path');
const ROOT=process.env.TRAINLOG_ROOT||path.join(__dirname,'..'), QUICK=process.argv.includes('--quick');
const PORT=9200+Math.floor(Math.random()*200);
const server=http.createServer((req,res)=>{ let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/') p='/index.html';
  const f=path.join(ROOT,p); if(!fs.existsSync(f)){ res.statusCode=404; return res.end(); }
  res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':'application/octet-stream'); res.end(fs.readFileSync(f)); }).listen(PORT);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const PROFILES=QUICK?[['iPhone SE (3rd gen)','webkit'],['Pixel 7','chromium']]
  :[['iPhone SE (3rd gen)','webkit'],['iPhone 13','webkit'],['iPhone 15','webkit'],['Pixel 7','chromium'],['iPhone SE (3rd gen)','chromium'],['Pixel 7','webkit']];
const CASES=['normal','toolbar','kb-android','kb-ios','safe','toolbar+safe'];
let fails=0, checks=0; const failList=[];
const ok=(c,what)=>{ checks++; if(!c){ fails++; if(failList.length<60) failList.push(what); } };

async function boot(engine, dev){
  const browser=await (engine==='webkit'?webkit:chromium).launch();
  const d=devices[dev]; const ctx=await browser.newContext({...d, hasTouch:true});
  await ctx.route(/^(?!http:\/\/localhost)/,r=>r.abort());
  const page=await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  page._dialogMode='accept'; page.on('dialog',x=>page._dialogMode==='dismiss'?x.dismiss():x.accept());
  await page.goto('http://localhost:'+PORT+'/?demo'); await sleep(700);
  await page.evaluate(()=>demoReset()); await page.waitForLoadState('load'); await sleep(1200);
  return {browser, page, d, errs};
}
async function applyCase(page, d, c){
  const H=d.viewport.height, W=d.viewport.width;
  await page.setViewportSize({width:W,height:c.includes('toolbar')?H-80:c==='kb-android'?H-300:H});
  await page.evaluate(({c,H})=>{ const st=document.documentElement.style;
    st.setProperty('--safe-t',c.includes('safe')?'47px':'env(safe-area-inset-top,0px)'); st.setProperty('--safe-b',c.includes('safe')?'34px':'env(safe-area-inset-bottom,0px)');
    window.__vvOverride=c==='kb-ios'?{height:innerHeight-300,offsetTop:0}:null; syncViewport(); },{c,H});
  await sleep(120);
}
// the primary action (last footer button; else the first card in the body) fully visible and hit at its centre;
// the body scrolls to its last element
async function checkLayer(page, layer){
  return page.evaluate(layer=>{
    const foot=document.getElementById(layer==='scr'?'scrFoot':'dlgFoot'), body=document.getElementById(layer==='scr'?'scrBody':'dlgBody');
    const vv=window.__vvOverride||window.visualViewport, top=vv&&vv.offsetTop?vv.offsetTop:0, bot=top+(vv&&vv.height?vv.height:innerHeight);
    const btns=[...foot.querySelectorAll('button')].filter(b=>b.offsetParent!==null);
    const target=btns.length?btns[btns.length-1]:body.querySelector('button');
    const out={label:target?target.textContent.trim().slice(0,30):'(none)'};
    if(!target){ out.ok=false; return out; }
    const r=target.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2, hit=document.elementFromPoint(x,y);
    out.visible=r.top>=top-0.5&&r.bottom<=bot+0.5&&r.height>0; out.hit=!!hit&&(hit===target||target.contains(hit));
    body.scrollTop=body.scrollHeight; const last=body.lastElementChild;
    out.scrolls=!last||last.getBoundingClientRect().bottom<=body.getBoundingClientRect().bottom+2;
    body.scrollTop=0; out.ok=out.visible&&out.hit&&out.scrolls; return out; },layer);
}
async function clickText(page,txt,sel){ const done=await page.evaluate(([t,s])=>{ const b=[...document.querySelectorAll(s||'#scr button, #dlg button')].find(x=>x.textContent.trim().replace(/\s+/g,' ').startsWith(t)); if(b){ b.click(); return true; } return false; },[txt,sel]);
  if(!done) throw new Error('no button "'+txt+'"'); await sleep(120); }

const SETUP_STEPS=['welcome','goal','history','schedule','equipment','body','around','priorities','lifts','split','days','reps','blocks','preview'];
async function setupMatrix(page, d, tag){
  await page.evaluate(()=>{ ONB.path='together'; });
  for(const step of SETUP_STEPS){
    await page.evaluate(st=>{ ONB.step=st; drawOnboarding(); },step);
    for(const c of CASES){
      await applyCase(page,d,c);
      if(step==='body'&&c.startsWith('kb')) await page.evaluate(()=>{ const i=document.querySelector('#scr input'); if(i) i.focus(); });
      const r=await checkLayer(page,'scr');
      ok(r.ok, tag+' setup '+step+' ['+c+']: '+JSON.stringify(r));
    }
  }
  await applyCase(page,d,'normal');
}
async function backChecks(page, tag){
  // back goes to the previous setup step and never leaves the page
  await page.evaluate(()=>{ ONB.step='welcome'; ONB.hist=[]; drawOnboarding(); });
  await clickText(page,'Build it for me'); await clickText(page,'Next'); await clickText(page,'Next');
  const before=await page.evaluate(()=>ONB.step);
  await page.goBack(); await sleep(250);
  const after=await page.evaluate(()=>({step:ONB&&ONB.step, url:location.href, open:!document.getElementById('scr').hidden}));
  ok(before==='schedule'&&after.step==='history'&&after.open&&/localhost/.test(after.url), tag+' back goes to the previous setup step: '+before+' → '+JSON.stringify(after));
  // back at the first step asks; saying no keeps setup open
  await page.goBack(); await sleep(200); page._dialogMode='dismiss'; await page.goBack(); await sleep(300); page._dialogMode='accept';
  const root=await page.evaluate(()=>({open:!document.getElementById('scr').hidden, url:location.href}));
  ok(root.open&&/localhost/.test(root.url), tag+' back at the start of setup asks, and "no" keeps setup open: '+JSON.stringify(root));
}
async function personaSetups(page, tag){
  const P={
    beginner:async()=>{ await clickText(page,'Size first'); await clickText(page,'Next'); await clickText(page,'New to lifting'); await clickText(page,'Next');
      await clickText(page,'3 days','#scr .chip'); await clickText(page,'45 min','#scr .chip'); await clickText(page,'Next'); for(let k=0;k<5;k++) await clickText(page,'Skip'); },
    powerbuilder:async()=>{ await clickText(page,'Even mix'); await clickText(page,'Next'); await clickText(page,'Progress takes weeks'); await clickText(page,'Next');
      await clickText(page,'4 days','#scr .chip'); await clickText(page,'75 min','#scr .chip'); await clickText(page,'Next'); await clickText(page,'Barbell gym'); await clickText(page,'Next');
      await page.evaluate(()=>{ ONB.a.bw=190; drawOnboarding(); }); await clickText(page,'Next'); await clickText(page,'Skip'); await clickText(page,'Next');
      await page.evaluate(()=>{ ONB.a.goals=['squat','bench','deadlift']; drawOnboarding(); }); await clickText(page,'Next');
      await clickText(page,'Upper / Lower'); await clickText(page,'Next'); await clickText(page,'Next'); await clickText(page,'Next'); await clickText(page,'Next'); },
    injured:async()=>{ await clickText(page,'Size first'); await clickText(page,'Next'); await clickText(page,'Progress takes weeks'); await clickText(page,'Next');
      await clickText(page,'5 days','#scr .chip'); await clickText(page,'Next'); await clickText(page,'Machine-heavy'); await clickText(page,'Next'); await clickText(page,'Skip');
      await page.evaluate(()=>{ document.querySelectorAll('#scr input[type=checkbox]').forEach(c=>{ c.checked=true; c.dispatchEvent(new Event('change')); }); }); await clickText(page,'Agree and continue');
      await page.evaluate(()=>{ const h=[...document.querySelectorAll('#scr button')].find(b=>/^Shoulder/.test(b.textContent.trim())); if(h) h.click(); }); await sleep(120);
      await page.evaluate(()=>{ const c=[...document.querySelectorAll('#scr .chip')].find(b=>/instab/i.test(b.textContent)); if(c) c.click(); }); await sleep(150);
      await clickText(page,'Next'); await page.evaluate(()=>{ ONB.a.dep.muscles=['calves']; drawOnboarding(); }); await clickText(page,'Next');
      await page.evaluate(()=>{ ONB.a.goals=['leg_press']; drawOnboarding(); }); await clickText(page,'Next'); }
  };
  for(const [name,run] of Object.entries(P)){
    await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(1100);
    try{
      const path2=name==='powerbuilder'?'Build it together':'Build it for me';
      await clickText(page,path2); await run();
      const atPreview=await page.evaluate(()=>ONB&&ONB.step);
      const foot=await checkLayer(page,'scr');
      await clickText(page,'Next'); const how=await page.evaluate(()=>ONB&&ONB.step); const howFoot=await checkLayer(page,'scr');
      ok(how==='how'&&howFoot.ok, tag+' persona '+name+': the plan leads into How your program works, its buttons in reach: '+JSON.stringify({how,howFoot}));
      await clickText(page,'Skip and start'); await sleep(400);
      const after=await page.evaluate(()=>({checkin:document.getElementById('dlg').open&&/check-in/i.test((document.querySelector('#dlg h2')||{}).textContent||''), log:LOG.filter(e=>e.type==='program_edit').length, setupGone:document.getElementById('scr').hidden, draft:CFG.onbDraft}));
      ok(atPreview==='preview'&&foot.ok&&after.checkin&&after.log===1&&after.setupGone&&!after.draft, tag+' persona '+name+': '+JSON.stringify({atPreview,foot,after}));
    }catch(e){ ok(false, tag+' persona '+name+' failed: '+e.message); }
  }
}
async function sheetMatrix(page, d, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:4})); await page.waitForLoadState('load'); await sleep(2500);
  await page.evaluate(()=>{ CFG.seenVersion=APP_VERSION; CFG.tour={t1:'off',seen:{}}; saveCfg(); try{ $('#dlg').close(); }catch(e){} });
  const SHEETS=[
    ['check-in',()=>{ startSession(todayDay()); }, true],
    ["today's plan",()=>{ $('#ckgo').click(); }, false],
    ['readiness',()=>{ $('#dlg').close(); openReadiness(); }, false],
    ['exercise info',()=>{ $('#dlg').close(); openInfo('bench'); }, true],
    ['warm-up editor',()=>{ $('#dlg').close(); openPrepEditor(session?session.dayName:todayDay().name); }, true],
    ['create a warm-up',()=>{ $('#dlg').close(); const n=session?session.dayName:todayDay().name; openPrepCreate(n,n); }, true],
    ['guide',()=>{ $('#dlg').close(); openGuide(); }, true],
    ['picker',()=>{ $('#dlg').close(); exPicker('Pick',()=>true,()=>{}); }, true],
    ['quick note',()=>{ $('#dlg').close(); openNote(); }, true],
    ['edit program',()=>{ $('#dlg').close(); openSettings(); }, true],
    ['explore',()=>{ $('#dlg').close(); openExplore(todayDay()); }, false],
    ['train menu',()=>{ $('#dlg').close(); const d=planFor(todayDay()); openTrainMenu(todayDay(),d); }, false],
    ['explore: keep any',()=>{ $('#dlg').close(); openExploreKeep({session_id:'none',explore_slots:[]}); }, false],
    ['finish session',()=>{ $('#dlg').close(); openPost(); }, true]];
  for(const [name,open,hasInput] of SHEETS){
    try{ await page.evaluate(new Function('('+open.toString()+')()')); }catch(e){ ok(false,tag+' open '+name+': '+e.message); continue; }
    await sleep(250);
    for(const c of CASES){ await applyCase(page,d,c); const r=await checkLayer(page,'dlg'); ok(r.ok, tag+' sheet '+name+' ['+c+']: '+JSON.stringify(r)); }
    await applyCase(page,d,'normal');
  }
  // back closes a read-only sheet; a sheet with input asks, and "no" keeps it
  await page.evaluate(()=>{ $('#dlg').close(); openReadiness(); }); await sleep(200);
  await page.goBack(); await sleep(250);
  const ro=await page.evaluate(()=>({open:document.getElementById('dlg').open, url:location.href}));
  ok(!ro.open&&/localhost/.test(ro.url), tag+' back closes a read-only sheet and stays in the app: '+JSON.stringify(ro));
  await page.evaluate(()=>{ openNote(); }); await sleep(200); page._dialogMode='dismiss'; await page.goBack(); await sleep(300); page._dialogMode='accept';
  const inp=await page.evaluate(()=>document.getElementById('dlg').open);
  ok(inp, tag+' back on a sheet with input asks first, and "no" keeps it open');
  await page.goBack(); await sleep(300);
  const closed=await page.evaluate(()=>({open:document.getElementById('dlg').open, url:location.href}));
  ok(!closed.open&&/localhost/.test(closed.url), tag+' and "yes" closes it, still in the app: '+JSON.stringify(closed));
}
/* The move-up bug (Oct 4, Oct 7, Oct 11): real touch taps on the card buttons, then Log set. */
async function tapSel(page,sel,n){ const r=await page.evaluate(([sel,n])=>{ const b=document.querySelectorAll(sel)[n]; if(!b) return null; b.scrollIntoView({block:'center'}); const q=b.getBoundingClientRect(); return {x:q.left+q.width/2,y:q.top+q.height/2}; },[sel,n||0]);
  if(!r) throw new Error('nothing to tap: '+sel+' #'+(n||0)); await sleep(80); await page.touchscreen.tap(r.x,r.y); await sleep(300); }
/* drag an exercise's handle (batch M) so its card lands on another card's place */
async function dragSlot(page,from,to){
  const r=await page.evaluate(([f,t])=>{ const h=document.querySelector('#v-work .ex[data-slot="'+f+'"] [data-reorder]'), tb=document.querySelector('#v-work .ex[data-slot="'+t+'"]');
    if(!h||!tb) return null; h.scrollIntoView({block:'center'}); const a=h.getBoundingClientRect(), b=tb.getBoundingClientRect(), box=h.closest('.ex').getBoundingClientRect();
    return {x:a.left+a.width/2, y:a.top+a.height/2, dy:(b.top+b.height*(t<f?0.25:0.75))-(box.top+box.height/2)}; },[from,to]);
  if(!r) throw new Error('no handle on exercise '+from);
  await page.mouse.move(r.x,r.y); await page.mouse.down();
  for(let k=1;k<=8;k++){ await page.mouse.move(r.x,r.y+r.dy*k/8); await sleep(16); }
  await page.mouse.up(); await sleep(350);
}
async function reorderCheck(page, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:3})); await page.waitForLoadState('load'); await sleep(2200);
  await page.evaluate(()=>{ CFG.seenVersion=APP_VERSION; CFG.tour={t1:'off',seen:{}}; saveCfg(); try{ $('#dlg').close(); }catch(e){} startSession(todayDay()); });
  await sleep(300); await page.evaluate(()=>{ $('#ckskip').click(); TAB='work'; render(); }); await sleep(300);
  const LOGB='[data-tour="logset"]';
  const state=()=>page.evaluate(()=>({order:session.slots.map(s=>s.ex), open:session.openIdx, logged:session.slots.map(s=>s.sets.length),
    last:(LOG.filter(e=>e.type==='set'&&e.session_id===session.id).slice(-1)[0]||{}).exercise_id}));
  // Oct 11: nothing logged on the current one, the second exercise moved up into its spot, then Log set
  const s0=await state(); await dragSlot(page,1,0); const s1=await state(); await tapSel(page,LOGB); const s2=await state();
  ok(s1.order[0]===s0.order[1]&&s1.open===0&&s2.last===s0.order[1]&&s2.logged[0]===1, tag+' moved up into the current spot, nothing logged: Log set logs the moved exercise: '+JSON.stringify({s0:s0.order.slice(0,3),s1:{o:s1.order.slice(0,3),open:s1.open},last:s2.last}));
  // Oct 4 / Oct 7: mid-exercise on it, the third exercise moved up past it, then Log set stays on it
  await dragSlot(page,2,1); await dragSlot(page,1,0);
  const s3=await state(); await tapSel(page,LOGB); const s4=await state();
  ok(s3.order[0]!==s0.order[1]&&s4.last===s0.order[1]&&s3.order[s3.open]===s0.order[1], tag+' mid-exercise, another moved up above it: Log set stays on the exercise in progress: '+JSON.stringify({order:s3.order.slice(0,3),open:s3.open,last:s4.last}));
  await page.evaluate(()=>{ session=null; saveSession(); stopRest(); TAB='dash'; render(); });
}
/* Every tour step (Appendix A Part 6): the card fits the visible screen, its buttons are
   reachable, and scrolling inside it never ends the tour or breaks the app. */
async function tourCheck(page, d, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:4})); await page.waitForLoadState('load'); await sleep(2200);
  await page.evaluate(()=>{ CFG.seenVersion=APP_VERSION; CFG.tour={t1:'off',seen:{}}; saveCfg(); try{ $('#dlg').close(); }catch(e){} });
  const TOURS=[['dash',()=>{ TAB='dash'; render(); }],['lifts',()=>{ TAB='lifts'; render(); }],['hist',()=>{ TAB='hist'; render(); }],['set',()=>{ TAB='set'; render(); }],
    ['settings',()=>{ openSettings(); }],['work',()=>{ try{ $('#dlg').close(); }catch(e){} startSession(todayDay()); $('#ckskip').click(); TAB='work'; render(); }]];
  for(const c of ['normal','toolbar+safe']){
    await applyCase(page,d,c);
    for(const [key,open] of TOURS){
      await page.evaluate(new Function('('+open.toString()+')()')); await sleep(250);
      const n=await page.evaluate(k=>{ startTour(k); return TOUR&&TOUR.steps?TOUR.steps.length:0; },key); await sleep(350);
      ok(n>0, tag+' tour '+key+' ['+c+'] has steps');
      for(let i=0;i<n;i++){
        const r=await page.evaluate(()=>{ const card=document.getElementById('tourCard'); if(!card) return {gone:true};
          const vv=window.__vvOverride||window.visualViewport, top=vv&&vv.offsetTop?vv.offsetTop:0, bot=top+(vv&&vv.height?vv.height:innerHeight);
          const q=card.getBoundingClientRect(), btns=[...card.querySelectorAll('button')], last=btns[btns.length-1], b=last?last.getBoundingClientRect():null;
          const hit=b?document.elementFromPoint(b.left+b.width/2,b.top+b.height/2):null;
          return {fits:q.top>=top-0.5&&q.bottom<=bot+0.5, btn:!!b&&b.top>=top-0.5&&b.bottom<=bot+0.5&&!!hit&&(hit===last||last.contains(hit)), title:(card.querySelector('h3')||{}).textContent, scrollable:card.scrollHeight>card.clientHeight+1}; });
        ok(!r.gone&&r.fits&&r.btn, tag+' tour '+key+' step '+(i+1)+' ['+c+'] fits the visible screen with its buttons reachable: '+JSON.stringify(r));
        // a touch inside the card, and scrolling the card and the page: the tour stays, nothing breaks
        const pt=await page.evaluate(()=>{ const p=document.querySelector('#tourCard p'); if(!p) return null; const q=p.getBoundingClientRect(); return {x:q.left+8,y:q.top+6}; });
        if(pt) await page.touchscreen.tap(pt.x,pt.y);
        await page.evaluate(()=>{ const card=document.getElementById('tourCard'); if(card){ card.scrollTop=card.scrollHeight; card.dispatchEvent(new Event('scroll',{bubbles:false})); } const b=document.getElementById('dlgBody'); if(b&&document.getElementById('dlg').open){ b.scrollTop+=40; b.dispatchEvent(new Event('scroll')); } window.scrollBy(0,30); });
        await sleep(260);
        const still=await page.evaluate(()=>!!TOUR&&!!document.getElementById('tourCard'));
        ok(still, tag+' tour '+key+' step '+(i+1)+' ['+c+']: a touch and a scroll inside the card keep the tour open');
        if(!still) break;
        await page.evaluate(()=>{ const card=document.getElementById('tourCard'); const btns=[...card.querySelectorAll('button')]; btns[btns.length-1].click(); }); await sleep(300);
      }
      await page.evaluate(()=>{ try{ tourEnd(); }catch(e){} try{ if($('#dlg').open) $('#dlg').close(); }catch(e){} }); await sleep(150);
    }
    await page.evaluate(()=>{ if(session){ session=null; saveSession(); stopRest(); } TAB='dash'; render(); });
  }
  await applyCase(page,d,'normal');
}
/* The Train tab is the preview (Appendix A Part 3; batch M): dragging a handle moves an exercise, Start takes the order. */
async function previewCheck(page, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:3})); await page.waitForLoadState('load'); await sleep(2200);
  await page.evaluate(()=>{ CFG.seenVersion=APP_VERSION; CFG.tour={t1:'off',seen:{}}; saveCfg(); try{ $('#dlg').close(); }catch(e){} TAB='work'; render(); });
  await sleep(300);
  const before=await page.evaluate(()=>planFor(todayDay()).slots.map(s=>s.ex));
  await dragSlot(page,1,0);
  const after=await page.evaluate(()=>planFor(todayDay()).slots.map(s=>s.ex));
  // the arrows work beside the handle: a real tap on Move later puts the first back
  await tapSel(page,'#v-work .ex[data-slot="0"] button[aria-label="Move later"]',0);
  const back=await page.evaluate(()=>planFor(todayDay()).slots.map(s=>s.ex));
  ok(back[0]===before[0]&&back[1]===before[1], tag+' the arrows work beside the handle: Move later undoes the drag: '+JSON.stringify(back.slice(0,2)));
  await tapSel(page,'#v-work .ex[data-slot="1"] button[aria-label="Move earlier"]',0);
  const hasPreview=await page.evaluate(()=>[...document.querySelectorAll('#v-work button')].some(b=>/Preview workout/.test(b.textContent)));
  await tapSel(page,'#v-work [data-tour="start"]'); await sleep(300);
  const sess=await page.evaluate(()=>session&&session.slots.map(s=>s.ex));
  ok(after[0]===before[1]&&after[1]===before[0]&&!hasPreview&&sess&&sess.join()===after.join(), tag+' the Train tab is the preview: a drag moves an exercise and Start takes that order: '+JSON.stringify({before:before.slice(0,2),after:after.slice(0,2),hasPreview,sess:sess&&sess.slice(0,2)}));
  await page.evaluate(()=>{ try{ $('#dlg').close(); }catch(e){} session=null; saveSession(); stopRest(); TAB='dash'; render(); });
}
/* Batch 01 (weights you see): a kg lifter's set card and warm-up read in kg and step a real kg step; the
   check-in's bodyweight + adds up and is only logged when changed; a swap after logging keeps those sets. */
async function batch01Check(page, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:3})); await page.waitForLoadState('load'); await sleep(2200);
  await page.evaluate(()=>{ CFG.seenVersion=APP_VERSION; CFG.tour={t1:'off',seen:{}}; CFG.tipsSeen=Object.fromEntries(TIP_KEYS.map(k=>[k,{at:0,done:true}])); saveCfg(); try{ $('#dlg').close(); }catch(e){}
    for(let i=0;i<6;i++){ const sid='kg'+i; ['a','b'].forEach(()=>append({type:'set',session_id:sid,slot:'deadlift',exercise_id:'deadlift',weight:{value:97.5,unit:'kg'},reps:8,rpe:7,set_kind:'straight',group:null,role:'straight'})); append({type:'session_end',session_id:sid,day_name:'Kg day',joints:{}}); } });
  // the kg card: the suggestion is a real kg step on the grid, and the warm-up reads in kg
  await page.evaluate(()=>{ startSession({id:'kgday',name:'Kg day',slots:[{ex:'deadlift',role:'secondary',sets:3,reps:[5,8],rpe:8}]}); $('#ckskip').click(); TAB='work'; render(); });
  await sleep(300);
  const kg=await page.evaluate(()=>({unit:draft.unit, w:draft.weight, warm:[...document.querySelectorAll('#v-work button')].map(b=>b.textContent).filter(t=>/ × \d+$/.test(t.trim())&&/Set \d|Bar/.test(t)).join(' | ')}));
  ok(kg.unit==='kg'&&kg.w>=100&&Math.abs(kg.w/2.5-Math.round(kg.w/2.5))<1e-6&&(!kg.warm||/kg/.test(kg.warm)&&!/ lb/.test(kg.warm)), tag+' a kg lifter: the card suggests a real 2.5 kg step and the warm-up is in kg: '+JSON.stringify(kg));
  await page.evaluate(()=>{ session=null; saveSession(); stopRest(); TAB='dash'; render(); });
  // the check-in: Change, three taps on +, and the logged bodyweight carries +1.5; untouched logs none
  await page.evaluate(()=>{ startSession(todayDay()); }); await sleep(300);
  await tapSel(page,'#ck .btn.s.ghost',0);
  const v0=await page.evaluate(()=>parseFloat((document.querySelector('#ck .step input')||{}).value));
  for(let i=0;i<3;i++) await tapSel(page,'#ck button[aria-label="Increase lb"]',0);
  const shown=await page.evaluate(()=>parseFloat((document.querySelector('#ck .step input')||{}).value));
  await tapSel(page,'#ckgo',0); await sleep(300);
  const logged=await page.evaluate(()=>{ const r=[...LOG].reverse().find(e=>e.type==='readiness'); return r?r.bodyweight:'none'; });
  ok(Math.abs(shown-(v0+1.5))<1e-6&&Math.abs(logged-(v0+1.5))<1e-6, tag+' check-in bodyweight: three taps on + add 1.5 and that is what is logged: '+JSON.stringify({v0,shown,logged}));
  await page.evaluate(()=>{ try{ $('#dlg').close(); }catch(e){} session=null; saveSession(); stopRest(); startSession(todayDay()); }); await sleep(300);
  await tapSel(page,'#ckgo',0); await sleep(300);
  const untouched=await page.evaluate(()=>{ const r=[...LOG].reverse().find(e=>e.type==='readiness'); return r?r.bodyweight:'none'; });
  ok(untouched==null, tag+' check-in without touching bodyweight logs no bodyweight reading: '+JSON.stringify(untouched));
  // a swap after logging keeps the logged sets where they were and adds the new exercise for the rest
  await page.evaluate(()=>{ try{ $('#dlg').close(); }catch(e){} TAB='work'; render(); const sl=session.slots[0]; seedDraft(sl); logSet(sl,0,'straight'); stopRest(); render(); openSwap(sl,0); });
  await sleep(300); await tapSel(page,'#exl button',0); await sleep(400);
  const sw=await page.evaluate(()=>({kept:session.slots[0].sets.length, target:session.slots[0].sets_target, next:session.slots[1]&&session.slots[1].swapped===true, diff:session.slots[1]&&session.slots[1].ex!==session.slots[0].ex}));
  ok(sw.kept===1&&sw.target===1&&sw.next&&sw.diff, tag+' a swap after logging keeps the logged set on the old exercise and adds the new one for the rest: '+JSON.stringify(sw));
  await page.evaluate(()=>{ try{ $('#dlg').close(); }catch(e){} session=null; saveSession(); stopRest(); TAB='dash'; render(); });
}
/* D10: with "effort" chosen, no screen says RPE (a real browser, the live set card and a sheet). */
async function effortCheck(page, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'shoulder',weeks:3})); await page.waitForLoadState('load'); await sleep(2200);
  await page.evaluate(()=>{ CFG.seenVersion=APP_VERSION; CFG.tour={t1:'off',seen:{}}; CFG.effortWord='effort'; saveCfg(); try{ $('#dlg').close(); }catch(e){} startSession(todayDay()); $('#ckskip').click(); TAB='work'; render(); });
  await sleep(400);
  const work=await page.evaluate(()=>document.getElementById('v-work').innerText);
  await page.evaluate(()=>openReadiness()); await sleep(300);
  const sh=await page.evaluate(()=>document.getElementById('dlg').innerText);
  ok(!/\bRPE\b/.test(work+sh)&&/\beffort\b/i.test(work), tag+' "effort" chosen: no RPE anywhere on the workout or a sheet: '+((work+sh).match(/.{0,30}\bRPE\b.{0,30}/)||[''])[0]);
  await page.evaluate(()=>{ try{ $('#dlg').close(); }catch(e){} CFG.effortWord='rpe'; saveCfg(); session=null; saveSession(); stopRest(); TAB='dash'; render(); });
}
/* Demo "Jump to…" (Part 3e) needs the demo clock, which only a real browser has. */
async function jumpCheck(page, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(900);
  await page.evaluate(()=>demoReset({kind:'persona',key:'responder',weeks:1})); await page.waitForLoadState('load'); await sleep(1800);
  const t=await page.evaluate(()=>{ const T=demoJumpTargets(ROADMAP); return T.find(x=>x.test)||T.find(x=>x.type==='str'&&x.week===1); });
  await page.evaluate(w=>demoReset({kind:'persona',key:'responder',weeks:Math.max(1,w)}),t.weeks); await page.waitForLoadState('load'); await sleep(3000);
  const p=await page.evaluate(()=>{ const q=currentPhase(); return {idx:q.idx, week:q.week, type:q.type}; });
  ok(p.idx===t.block&&Math.abs(p.week-t.week)<=1, tag+' demo Jump to lands on the chosen block and week: '+JSON.stringify({want:[t.block,t.week,t.label],got:p}));
}
async function resumeCheck(page, tag){
  await page.evaluate(()=>{ STORE.clear(); }); await page.reload(); await page.waitForLoadState('load'); await sleep(1100);
  await clickText(page,'Build it for me'); await clickText(page,'Pure strength'); await clickText(page,'Next'); await clickText(page,'Progress takes months'); await clickText(page,'Next');
  await page.reload(); await page.waitForLoadState('load'); await sleep(1100);
  const shown=await page.evaluate(()=>({step:ONB&&ONB.step, text:document.getElementById('scrBody').innerText}));
  await clickText(page,'Continue setup');
  const back=await page.evaluate(()=>({step:ONB.step, goal:ONB.a.goal, history:ONB.a.history, log:LOG.length}));
  ok(shown.step==='resume'&&back.step==='schedule'&&back.goal==='pure_strength'&&back.history==='advanced'&&back.log===0, tag+' a half-finished setup resumes after a reload: '+JSON.stringify({shown:shown.step,back}));
}
(async()=>{
  const rows=[];
  for(const [dev,engine] of PROFILES){
    const tag=dev+' / '+engine, f0=fails;
    let b; try{ b=await boot(engine,dev); }catch(e){ ok(false,tag+' could not start: '+e.message); continue; }
    const {browser,page,d,errs}=b; page._H=d.viewport.height;
    try{
      ok(await page.evaluate(()=>document.getElementById('scr').hidden===false&&!document.getElementById('dlg').open), tag+' a new user gets setup as a full screen, not a popup');
      await setupMatrix(page,d,tag);
      await backChecks(page,tag);
      await resumeCheck(page,tag);
      await personaSetups(page,tag);
      await sheetMatrix(page,d,tag);
      await reorderCheck(page,tag);
      await tourCheck(page,d,tag);
      await previewCheck(page,tag);
      await batch01Check(page,tag);
      await effortCheck(page,tag);
      await jumpCheck(page,tag);
    }catch(e){ ok(false,tag+' crashed: '+e.message); }
    ok(errs.length===0, tag+' no page errors: '+errs.slice(0,2).join(' | '));
    rows.push([tag, fails===f0?'pass':(fails-f0)+' failed']);
    await browser.close();
  }
  server.close();
  console.log('\nDevice matrix'); rows.forEach(([t,r])=>console.log('  '+t.padEnd(34)+r));
  if(failList.length){ console.log('\nFailures:'); failList.forEach(f=>console.log('  '+f)); }
  console.log('\n'+checks+' checks, '+fails+' failed');
  process.exit(fails?1:0);
})().catch(e=>{ console.error(e); server.close(); process.exit(1); });
