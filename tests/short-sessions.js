/* node tests/short-sessions.js <export.jsonl>
   Your own week at 20, 30 and 45 minutes (research rule 6, v1.119): no day ends up empty, the heaviest lift
   always stays, 3 rounds per exercise at 20 and 30, the heavy lift at most 5 sets at 45. Reads the export's
   settings and log in memory (the sheet and notes addresses are blanked, nothing goes over the network);
   prints each day and exits 1 on a failure. */
const fs=require('fs'), path=require('path');
const EXP=process.argv[2]; if(!EXP){ console.error('usage: node tests/short-sessions.js <export.jsonl>'); process.exit(2); }
const lines=fs.readFileSync(EXP,'utf8').trim().split('\n'); let cfg=null; const log=[];
lines.forEach(l=>{ let e; try{ e=JSON.parse(l); }catch(x){ return; } if(e.type==='config_snapshot'){ cfg=e.cfg; return; } log.push(e); });
if(!cfg){ console.error('no settings in this export'); process.exit(2); }
cfg.syncUrl=''; cfg.feedbackUrl='';
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'), src=html.match(/<script>([\s\S]*)<\/script>/)[1];
const stub=()=>new Proxy(function(){},{get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },set(){return true;},apply(){return stub();},construct(){return stub();}});
const emb=id=>{ for(const o of ['<script type="application/json" id="'+id+'">','<script type="text/markdown" id="'+id+'">']){ const i=html.indexOf(o); if(i>=0) return html.slice(i+o.length, html.indexOf('</script>',i)); } return null; };
const doc=new Proxy(stub(),{get(t,k){ if(k==='getElementById') return id=>{ const c=emb(id); return c!=null?{textContent:c}:stub(); }; return stub(); }});
const store={'trainlog.cfg.v1':JSON.stringify(cfg),'trainlog.jsonl.v1':log.map(e=>JSON.stringify(e)).join('\n')};
const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];},key:i=>Object.keys(store)[i],get length(){return Object.keys(store).length;}};
const NAV=new Proxy(stub(),{get(t,k){ return k==='storage'?undefined:stub(); }});
const names=['generatedDays','planFor','timeBox','boxMinutes','exById','isMainLift','APP_VERSION'];
const A=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',
  src+'\n;return {'+names.map(n=>n+':(()=>{try{return '+n+'}catch(e){}})()').join(',')+'};')(doc,stub(),NAV,ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>new Promise(()=>{}),stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}});
const nm=id=>(A.exById[id]||{name:id}).name;
let fail=0, n=0;
console.log('Short sessions on your week ('+A.APP_VERSION+')');
A.generatedDays().forEach(day=>{ const p=A.planFor(day); if(!p.slots.length) return;
  const floor=A.timeBox(p,1).slots.map(x=>x.ex)[0];
  console.log(day.name+' · full about '+A.boxMinutes(p.slots)+' min · heaviest: '+nm(floor));
  [45,30,20].forEach(m=>{ n++; const b=A.timeBox(p,m), why=[];
    if(!b.slots.length) why.push('EMPTY');
    if(!b.slots.some(x=>x.ex===floor)) why.push('the heaviest lift was left out');
    if(m<45&&b.slots.some(x=>x.sets>3)) why.push('more than 3 rounds');
    if(m>=45&&b.slots[0]&&b.slots[0].ex===floor&&b.slots[0].sets>5) why.push('the heavy lift over 5 sets');
    if(why.length) fail++;
    console.log('  '+m+' min: '+b.slots.map(x=>nm(x.ex)+' '+x.sets+(x.pairWith?'*':'')).join(', ')+' · about '+A.boxMinutes(b.slots)+' min'+(b.leftOut.length?' · leaves out '+b.leftOut.length:'')+(why.length?'  ✗ '+why.join('; '):'')); }); });
console.log(fail?fail+' of '+n+' FAILED':n+' checks, 0 failed (* = paired)');
process.exit(fail?1:0);
