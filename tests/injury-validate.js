#!/usr/bin/env node
/* Validates the injury library before it ships (research handoff checks,
   adapted to this app) and the over-flagging limits.

     node tests/injury-validate.js        exit 1 on any failure

   Over-flagging was the owner's first concern, so it's a hard check: no
   single condition may flag more than 30% of the exercise library, its red
   (core) flags may cover at most 10%, and no condition may turn a whole
   movement family red. Judgement defaults — if an entry can't pass, narrow
   its tags; don't loosen this. */
const fs=require('fs'), path=require('path');
const R=path.join(__dirname,'..');
const src=JSON.parse(fs.readFileSync(path.join(R,'docs','injuries.json'),'utf8'));
const der=JSON.parse(fs.readFileSync(path.join(R,'docs','injuries.derived.json'),'utf8'));
const MOVE=JSON.parse(fs.readFileSync(path.join(R,'docs','movement_tags.json'),'utf8'));
const html=fs.readFileSync(path.join(R,'index.html'),'utf8');
let fails=0, warns=0; const fail=m=>{ fails++; console.log('  FAIL '+m); }, warn=m=>{ warns++; console.log('  warn '+m); };
const CATS=['UMBRELLA','ACUTE','CHRONIC_RECURRENT','STRUCTURAL_PERMANENT','POST_SURGICAL'];
const REGIONS=['neck','shoulder','elbow','wrist_hand','thoracic_ribs','lower_back','hip_thigh','knee','ankle_foot_shin','systemic'];
const PHASES=['protect','restore_range','build_capacity','return_to_load','maintain'];
const RUN=new Set(MOVE.running_tags||[]);
const exIds=new Set(Object.keys(MOVE.exercises));
// families and patterns from the app itself
const famOf={}; (html.match(/\{id:'[a-z0-9_]+',[^\n]*pattern:'[a-z_]+'/g)||[]).forEach(s=>{ const id=s.match(/id:'([a-z0-9_]+)'/)[1], p=s.match(/pattern:'([a-z_]+)'/)[1]; famOf[id]=p; });
const byId=Object.fromEntries(src.map(e=>[e.id,e])), dById=Object.fromEntries(der.map(e=>[e.id,e]));
const subOk=s=>{ const [id,mod]=String(s).split('+'); if(!exIds.has(id)) return false;
  return !mod||['lockout:soft','grip:close','grip:neutral','grip:wide','rom:board','rom:pin','rom:partial','pause:bottom'].includes(mod); };

console.log('Injury library: '+src.length+' entries');
// 1. shape
src.forEach(e=>{
  const p=e.id+': ';
  ['id','chip_label','clinical_name','region','category','parent_id','one_liner','self_id_cues','core_cue','warmup','do_more_of','avoid','modify','in_workout_cues','red_flags','rehab_phases','running','interactions','evidence_grade','sources']
    .forEach(k=>{ if(!(k in e)) fail(p+'missing '+k); });
  if(!/^[a-z]+_[a-z0-9_]+$/.test(e.id)) fail(p+'bad id');
  if(!REGIONS.includes(e.region)) fail(p+'bad region '+e.region);
  if(!CATS.includes(e.category)) fail(p+'bad category '+e.category);
  if((e.chip_label||'').length>40) fail(p+'chip_label > 40');
  if((e.one_liner||'').length>160) fail(p+'one_liner > 160');
  if((e.core_cue||'').length>140) fail(p+'core_cue > 140');
  if(!Array.isArray(e.self_id_cues)||e.self_id_cues.length<2||e.self_id_cues.length>4) fail(p+'self_id_cues must be 2–4');
  if(!Array.isArray(e.do_more_of)||e.do_more_of.length<1||e.do_more_of.length>5) fail(p+'do_more_of must be 1–5');
  if(!Array.isArray(e.red_flags)||!e.red_flags.length) fail(p+'red_flags empty');
  (e.in_workout_cues||[]).forEach(c=>{ if(!['pre_session','per_exercise','pain_threshold'].includes(c.trigger)) fail(p+'bad cue trigger'); if((c.message||'').length>120) fail(p+'cue > 120: '+c.message); });
  if(!['A','B','C','D'].includes(e.evidence_grade)) fail(p+'evidence_grade must be A–D (never pending in a shipped build)');
  if(!Array.isArray(e.sources)||!e.sources.length) fail(p+'sources empty');
  if('reviewed' in e) fail(p+'no "reviewed" field (decided Oct 2026)');
  // 2. parent
  if(e.category==='UMBRELLA'){ if(e.parent_id!==null) fail(p+'umbrella must have parent_id null'); }
  else { const par=byId[e.parent_id]; if(!par) fail(p+'parent '+e.parent_id+' missing');
    else { if(par.category!=='UMBRELLA') fail(p+'parent is not an umbrella'); if(par.region!==e.region) fail(p+'parent in another region'); } }
  // avoid / modify vocabulary
  (e.avoid||[]).forEach(a=>{ if(!MOVE.tags[a.movement]) fail(p+'unknown movement tag '+a.movement); if(!['core','caution'].includes(a.level)) fail(p+'avoid level must be core|caution'); });
  if((e.avoid||[]).filter(a=>a.level==='core').length>2) fail(p+'more than 2 core tags');
  if(e.category==='UMBRELLA'&&(e.avoid||[]).some(a=>a.level==='core')) fail(p+'umbrella with a core tag');
  (e.modify||[]).forEach(m=>{ if(!exIds.has(m.exercise)) fail(p+'modify exercise not in the app: '+m.exercise); if(!subOk(m.substitute)) fail(p+'substitute not resolvable: '+m.substitute); });
  // 4. every non-running avoid has a covering modify (on the source entry; umbrellas checked after derive)
  if(e.category!=='UMBRELLA') (e.avoid||[]).forEach(a=>{ if(RUN.has(a.movement)) return;
    if(!Object.values(MOVE.exercises).some(ts=>ts.includes(a.movement))){ warn(p+a.movement+' is carried by no library exercise (applies to custom exercises and modifiers only)'); return; }
    if(!(e.modify||[]).some(m=>(MOVE.exercises[m.exercise]||[]).includes(a.movement))) fail(p+'no modify covers '+a.movement); });
  // 5–7. phases and running
  if(e.category==='STRUCTURAL_PERMANENT'||e.category==='UMBRELLA'){ if(e.rehab_phases!==null) fail(p+'structural/umbrella must have rehab_phases null'); }
  else if(!Array.isArray(e.rehab_phases)||e.rehab_phases.map(x=>x.phase).join()!==PHASES.join()) fail(p+'needs all 5 rehab phases in order');
  if(['hip_thigh','knee','ankle_foot_shin'].includes(e.region)&&!['STRUCTURAL_PERMANENT','UMBRELLA'].includes(e.category)&&!e.running) fail(p+'lower-limb entry needs running guidance');
  (e.interactions||[]).forEach(x=>{ if(!byId[x.with_id]) warn(p+'interaction with '+x.with_id+' (not in this build)'); });
});
// 3. subset rule on the derived file
der.filter(e=>e.category!=='UMBRELLA').forEach(e=>{ const par=dById[e.parent_id]; if(!par) return;
  const pm=new Set((par.avoid||[]).map(a=>a.movement));
  (e.avoid||[]).filter(a=>a.level==='core').forEach(a=>{ if(!pm.has(a.movement)) fail(e.id+': core '+a.movement+' not in derived parent '+par.id); }); });
// over-flagging, per entry as the app applies it (umbrella → all amber)
const all=Object.keys(MOVE.exercises), N=all.length;
console.log('\nOver-flagging (of '+N+' exercises; limits 30% flagged, 10% red):');
der.forEach(e=>{
  // as the app applies it: structural caution tags are notes, not warnings
  const tags=(e.avoid||[]).filter(a=>!RUN.has(a.movement)&&!(e.category==='STRUCTURAL_PERMANENT'&&a.level!=='core'));
  const coreT=new Set(e.category==='UMBRELLA'?[]:tags.filter(a=>a.level==='core').map(a=>a.movement)), anyT=new Set(tags.map(a=>a.movement));
  const flagged=all.filter(id=>MOVE.exercises[id].some(t=>anyT.has(t))), red=all.filter(id=>MOVE.exercises[id].some(t=>coreT.has(t)));
  const line=e.id.padEnd(26)+String(flagged.length).padStart(3)+' flagged ('+Math.round(flagged.length/N*100)+'%), '+red.length+' red';
  if(flagged.length/N>0.30) fail(line+' — over 30%'); else if(red.length/N>0.10) fail(line+' — red over 10%'); else console.log('  '+line);
  // no whole family red
  const fams={}; all.forEach(id=>{ const f=famOf[id]; if(!f) return; (fams[f]=fams[f]||{n:0,r:0}).n++; if(red.includes(id)) fams[f].r++; });
  Object.entries(fams).forEach(([f,c])=>{ if(c.n>=3&&c.r===c.n) fail(e.id+': every '+f+' exercise is red'); });
});
// embedded copies
const emb=id=>{ const m=html.match(new RegExp('<script type="application/json" id="'+id+'">([\\s\\S]*?)</script>')); return m?m[1]:null; };
if(emb('injuries')!==fs.readFileSync(path.join(R,'docs','injuries.derived.json'),'utf8')) fail('index.html injuries block differs from docs/injuries.derived.json — run node tools/derive-injuries.js');
if(emb('movement-tags')!==fs.readFileSync(path.join(R,'docs','movement_tags.json'),'utf8')) fail('index.html movement-tags block differs from docs/movement_tags.json — run node tools/derive-injuries.js');
// every built-in exercise has a tag entry
famOf && Object.keys(famOf).forEach(id=>{ if(!exIds.has(id)&&!/^(er_|ir_|iso_|serratus|scap_|prone_t|rhythmic|quadruped|bear_|low_trap|scaption|belly_|jps_|thoracic|tib_|slant_|atg_|wrist_ext_iso|ecc_wrist|bird_dog|side_plank|board_press|neutral_pulldown)/.test(id)) warn('exercise '+id+' has no movement tags'); });
console.log('\n'+(fails?fails+' failure(s)':'all checks passed')+(warns?' · '+warns+' warning(s)':''));
process.exit(fails?1:0);
