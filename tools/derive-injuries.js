#!/usr/bin/env node
/* Injury library: derive umbrellas and embed the data in index.html.

     node tools/derive-injuries.js

   docs/injuries.json is the editable source (one entry per condition, the
   research's schema plus avoid[].level). This writes
   docs/injuries.derived.json — every umbrella gets the union of its
   children (research A3.4) — and pastes it, with docs/movement_tags.json,
   into index.html's two <script type="application/json"> blocks. There is
   no build step: run this after editing either JSON file, then run
   node tests/injury-validate.js. tests/prescription-invariants.js fails if
   the embedded copies drift from the files. */
const fs=require('fs'), path=require('path');
const R=path.join(__dirname,'..');
const src=JSON.parse(fs.readFileSync(path.join(R,'docs','injuries.json'),'utf8'));
const MOVE=JSON.parse(fs.readFileSync(path.join(R,'docs','movement_tags.json'),'utf8'));
const byId=Object.fromEntries(src.map(e=>[e.id,e]));
const kids=id=>src.filter(e=>e.parent_id===id);
const dedupe=(arr,key)=>{ const seen=new Set(); return arr.filter(x=>{ const k=key(x); if(seen.has(k)) return false; seen.add(k); return true; }); };
const derived=src.map(e=>{
  if(e.category!=='UMBRELLA') return e;
  const ch=kids(e.id);
  // umbrella flags are always amber at runtime; level kept as 'caution' so the data says so too
  // DEVIATION from research A3.4 (union of every child's avoid), decided Oct 2026 to avoid
  // over-flagging: a broad pick ("not sure") flags its own authored tags plus each child's
  // CORE mechanism only. The union of every child's caution tags flagged ~30% of the library.
  const avoid=dedupe([...(e.avoid||[]),...ch.flatMap(c=>(c.avoid||[]).filter(a=>a.level==='core'))].map(a=>({...a,level:'caution'})),a=>a.movement);
  const movements=new Set(avoid.map(a=>a.movement));
  const modify=dedupe([...(e.modify||[]),...ch.flatMap(c=>c.modify||[])].filter(m=>[...movements].some(t=>(MOVE.exercises[m.exercise]||[]).includes(t))),m=>m.exercise+'|'+m.substitute);
  const red_flags=dedupe([...(e.red_flags||[]),...ch.flatMap(c=>c.red_flags||[])],x=>x);
  const pre=(e.in_workout_cues||[]).filter(c=>c.trigger==='pre_session').slice(0,1);
  const rest=dedupe([...(e.in_workout_cues||[]),...ch.flatMap(c=>c.in_workout_cues||[])].filter(c=>c.trigger!=='pre_session'),c=>c.trigger+'|'+c.message);
  return {...e, avoid, modify, red_flags, in_workout_cues:[...pre,...rest], derived_from:ch.map(c=>c.id), movements_count:movements.size};
});
const out=JSON.stringify(derived,null,1)+'\n';
fs.writeFileSync(path.join(R,'docs','injuries.derived.json'),out);
const tags=fs.readFileSync(path.join(R,'docs','movement_tags.json'),'utf8');
let html=fs.readFileSync(path.join(R,'index.html'),'utf8');
const put=(id,text)=>{
  const re=new RegExp('(<script type="application/json" id="'+id+'">)([\\s\\S]*?)(</script>)');
  if(!re.test(html)) throw new Error('index.html has no <script id="'+id+'"> block');
  html=html.replace(re,(m,a,b,c)=>a+text+c);
};
put('injuries',out); put('movement-tags',tags);
fs.writeFileSync(path.join(R,'index.html'),html);
console.log('derived '+derived.length+' entries ('+derived.filter(e=>e.category==='UMBRELLA').length+' umbrellas); embedded injuries + movement-tags in index.html');
