/* node build.js <out dir> — writes <direction>.html for each brand direction: four screens (Today, Train with a
   set card open, the check-in, the program) in light and dark, from data.json (the demo) and tokens.json.
   Open <direction>.html to see all eight; <direction>.html?today-dark (or #today-dark) shows one at 390 px. */
const fs=require('fs'), path=require('path');
const OUT=process.argv[2]; fs.mkdirSync(OUT,{recursive:true});
const T=JSON.parse(fs.readFileSync(path.join(__dirname,'..','tokens.json'),'utf8'));
const D=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data.json'),'utf8'));
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const FONTS={logbook:'family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700',
  chalk:'family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700',
  grove:'family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700'};
// the tab icons in each direction's style: same five shapes, different hands
const SHAPES={today:'<path d="M3 19h18"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0"/><path d="M12 6.5V9M5.4 10.4l1.6 1.6M18.6 10.4L17 12"/>',
  train:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3.5v3.2"/>',
  lifts:'<path d="M5 19h14M5 14h10M5 9h6M5 4v15"/>', progress:'<path d="M4 19V5M4 19h16"/><path d="M7 15l4-5 3 3 5-7"/>',
  settings:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'};
const ICON={logbook:k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">'+SHAPES[k]+'</svg>',
  chalk:k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'+SHAPES[k]+'</svg>',
  grove:k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="var(--accent-soft)" stroke="none"/>'+SHAPES[k]+'</svg>'};
const tabs=(dir,on)=>'<nav class="tabs">'+[['today','Today'],['train','Train'],['lifts','Lifts'],['progress','Progress'],['settings','Settings']]
  .map(([k,l])=>'<span class="tab'+(k===on?' on':'')+'">'+ICON[dir](k)+'<b>'+l+'</b></span>').join('')+'</nav>';
const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(1);
const range=r=>r[0]===r[1]?String(r[0]):r[0]+'–'+r[1];
// the block track, shared: segments by weeks, a pattern per type, this week marked
const track=(big)=>{ const P=D.program, segs=P.blocks.map(b=>{ const main=Math.min(b.len,b.weeks), dl=b.len-main;
    return '<span class="tseg" style="flex:'+main+'"><i class="blk '+b.type+'"></i>'+(big?'<em>'+(main>=5?esc(b.name)+' · ':'')+main+'w</em>':'')+'</span>'+(dl>0?'<span class="tseg" style="flex:'+dl+'"><i class="blk deload"></i></span>':''); }).join('');
  return '<div class="track'+(big?' wide':'')+'"><div class="tsegs">'+segs+'</div><span class="tnow" style="left:'+((P.at+.5)/P.total*100).toFixed(2)+'%"></span></div>'; };
const legend=()=>'<div class="tleg">'+[...new Set(D.program.blocks.map(b=>b.type))].map(t=>'<span><i class="blk '+t+'"></i>'+({hyp:'Hypertrophy',str:'Strength',peak:'Taper',deload:'Deload'}[t])+'</span>').join('')+'</div>';
const head=(dir,title,sub)=>dir==='logbook'?'<header class="hd"><div class="stamp">'+esc(D.date.toUpperCase())+' — '+esc(sub.toUpperCase())+'</div><h1>'+esc(title)+'</h1></header>'
  :dir==='chalk'?'<header class="hd"><div class="kick">'+esc(sub)+'</div><h1>'+esc(title)+'</h1></header>'
  :'<header class="hd"><div class="kick">'+esc(D.date)+' · '+esc(sub)+'</div><h1>'+esc(title)+'</h1></header>';
// ── the four screens ──
const S={};
S.today=dir=>{ const pl=D.plan, counts=[[pl.held,'held back'],[pl.push,'pushing'],[pl.warn,'with a warning']].filter(x=>x[0]).map(x=>x[0]+' '+x[1]).join(' · ');
  return head(dir,'Today',D.block+', week '+D.week)
  +'<section class="card lead"><div class="lab">Today\'s plan</div><h2>'+esc(D.day)+'</h2><p>'+esc(pl.top)+'</p><div class="dim">'+esc(counts)+'</div><div class="dim">Before your check-in. It can change this when you start.</div>'
  +'<div class="row"><span class="btn ghost">Details</span><span class="btn go grow">Go to Train</span></div></section>'
  +'<section class="card"><div class="lab">Joints</div>'+D.joints.map(j=>'<div class="st"><i class="dot '+(j.band==='Green'?'ok':j.band==='Yellow'?'caution':'stop')+'"></i><span>'+esc(j.text)+'</span></div>').join('')+'</section>'
  +'<section class="card"><div class="rowb"><b>Program</b><span class="dim">week '+(D.program.at+1)+' of '+D.program.total+'</span></div>'+track(false)+'<p class="sm">'+esc(D.program.sentence)+'</p>'+legend()+'</section>'
  +'<section class="card"><div class="rowb"><b>This week</b><span class="dim">'+D.thisWeek.done+' of '+D.thisWeek.planned+' sessions</span></div><div class="pips">'+Array.from({length:D.thisWeek.planned},(_,i)=>'<i class="'+(i<D.thisWeek.done?'on':'')+'"></i>').join('')+'</div></section>'
  +tabs(dir,'today'); };
S.train=dir=>{ const sl=D.slots[0], lb=sl.lb, sets=[{w:lb,r:sl.rx,rpe:7.5},{w:lb,r:sl.rx,rpe:8}], top=Math.max(lb,...D.slots.map(s=>s.lb||0));
  const setRow=(i,w,r,rpe,done)=>{ const pct=Math.round(w/lb*100);
    return '<div class="srow'+(done?' done':'')+'"><span class="idx">'+(done?'✓':i)+'</span>'+(dir==='grove'?'<span class="plate" style="width:'+Math.max(30,pct*0.55)+'%"></span>':'')+'<span class="num">'+fmt(w)+' × '+r+'</span><span class="rpe">RPE '+rpe+'</span></div>'; };
  return '<header class="hd one"><div><h1 class="sm1">'+esc(D.day)+' <small>· '+esc(D.block)+', week '+D.week+'</small></h1><div class="dim">'+D.slots.length+' exercises · '+D.slots.reduce((a,s)=>a+s.sets,0)+' working sets · about '+D.minutes+' min</div></div><span class="more">⋯</span></header>'
  +'<section class="card ex open"><div class="exh"><div><b>'+esc(sl.name)+'</b><div class="dim">'+sl.sets+' sets × '+range(sl.reps)+' reps · RPE '+sl.rpe+' · main lift</div></div><span class="grip">═</span></div>'
  +'<div class="sets">'+sets.map((s,i)=>setRow(i+1,s.w,s.r,s.rpe,true)).join('')
  +'<div class="entry"><div class="lab">Set 3</div><div class="big"><span class="num">'+fmt(lb)+'</span><small>lb</small><span class="x">×</span><span class="num">'+sl.rx+'</span><small>reps</small></div>'
  +'<div class="chips">'+[7,7.5,8,8.5,9].map(v=>'<span class="chip'+(v===8?' on':'')+'">'+v+'</span>').join('')+'</div>'
  +'<div class="why">'+esc(sl.why)+'</div><span class="btn go wide">Log set 3</span></div>'
  +[4,5,6].map(i=>'<div class="srow todo"><span class="idx">'+i+'</span>'+(dir==='grove'?'<span class="plate ghost" style="width:55%"></span>':'')+'<span class="num">'+fmt(lb)+' × '+sl.rx+'</span><span class="rpe">last '+esc(sl.last?sl.last.w+' × '+sl.last.reps:'—')+'</span></div>').join('')+'</div></section>'
  +D.slots.slice(1,4).map(s=>'<section class="card ex"><div class="exh"><div><b>'+esc(s.name)+'</b>'+(s.flag?' <span class="flagc">For your '+esc(s.flag)+'</span>':'')+'<div class="dim">'+s.sets+' sets × '+range(s.reps)+' · '+(s.lb?fmt(s.lb)+' lb':'')+'</div></div><span class="grip">═</span></div></section>').join('')
  +tabs(dir,'train'); };
S.checkin=dir=>{ const areas=D.soreAreas.length?D.soreAreas:['Quads','Glutes / hamstrings'];
  return '<div class="sheet"><h1 class="sh">Check-in</h1><p class="muted">Anything off today? Tap only what is; everything else counts as normal.</p>'
  +'<div class="qb"><div class="lab">Anything off?</div><div class="chips">'+['Slept badly','Low motivation','Stressed or run-down','Feeling sick'].map(c=>'<span class="chip">'+c+'</span>').join('')+'<span class="chip on">Sore</span><span class="chip">A joint</span></div>'
  +'<div class="dim" style="margin-top:12px">Where?</div><div class="chips">'+areas.map((a,i)=>'<span class="chip'+(i===areas.length-1?' on':'')+'">'+esc(a)+'</span>').join('')+'</div>'
  +'<div class="howm"><span>'+esc(areas[areas.length-1])+'</span><span class="chip on">A little</span><span class="chip">A lot</span></div></div>'
  +'<div class="qb"><div class="lab">Better than usual?</div><div class="chips"><span class="chip on">Slept well</span><span class="chip">Keen to train</span><span class="chip">Fresh</span></div></div>'
  +'<div class="qb rowb"><span>Bodyweight <b class="num">182.5</b> lb</span><span class="btn ghost s">Change</span></div>'
  +'<div class="row foot"><span class="btn ghost grow">Skip</span><span class="btn go grow">Start</span></div></div>'; };
S.program=dir=>{ let acc=0; const P=D.program;
  return head(dir,'Program',D.block+', week '+D.week)
  +'<section class="card">'+track(true)+'<p class="lead2">'+esc(P.sentence)+'</p>'+legend()+'</section>'
  +'<section class="card">'+P.blocks.map((b,i)=>{ const from=acc+1, to=acc+b.len; acc+=b.len; const cur=i===P.idx;
      return '<div class="brow'+(cur?' cur':'')+'"><i class="blk '+b.type+'"></i><div class="grow"><b>Block '+(i+1)+' · '+esc(b.name)+'</b><div class="dim">weeks '+from+'–'+to+'</div></div><span class="dim">'+(cur?'week '+D.week+' of '+b.len:i<P.idx?'done':b.len+' weeks')+'</span></div>'; }).join('')+'</section>'
  +'<section class="card"><p class="sm">About 12 sets a week per muscle in week 1, rising to 16 by week 8, then a lighter week.</p></section>'
  +tabs(dir,'today'); };
// ── styles: shared bones, then each direction's hand ──
const vars=t=>Object.entries(t).map(([k,v])=>'--'+k+':'+v).join(';');
const BASE=`*{box-sizing:border-box;margin:0}body{background:#888;font-family:var(--ft);}
.gallery{display:flex;flex-wrap:wrap;gap:24px;padding:24px}.phone{width:390px;height:844px;overflow:hidden;position:relative;background:var(--bg);color:var(--ink);font-family:var(--ft);font-size:16px;line-height:1.4}
.solo .gallery{padding:0;gap:0}.solo .phone:not(.show){display:none}
.scroll{position:absolute;inset:0 0 0 0;overflow:hidden;padding:0 16px 96px}
.hd{padding:56px 4px 14px}.hd h1{font-size:34px;line-height:1.1}.hd.one{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.hd .sm1{font-size:24px}.hd .sm1 small{font-size:15px;font-weight:500;color:var(--muted)}
.more{font-size:24px;color:var(--muted);line-height:1}
.card{background:var(--card);border-radius:var(--r);padding:16px;margin-bottom:12px}.card h2{font-size:24px;margin:2px 0 6px}.card p{margin:6px 0}
.lab{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.dim{color:var(--dim);font-size:13px;margin-top:4px}.muted{color:var(--muted)}.sm{font-size:14px}
.row{display:flex;gap:10px;margin-top:14px}.rowb{display:flex;justify-content:space-between;align-items:center;gap:8px}.grow{flex:1}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:var(--r);font-weight:600;font-size:15px}
.btn.go{background:var(--accent-fill);color:var(--on-accent)}.btn.ghost{background:var(--card-2);color:var(--ink)}.btn.wide{display:flex;width:100%;margin-top:12px}.btn.s{min-height:34px;font-size:13px}
.st{display:flex;gap:10px;align-items:flex-start;font-size:14px;margin-top:8px}.dot{flex:none;width:9px;height:9px;border-radius:50%;margin-top:6px}.dot.ok{background:var(--ok)}.dot.caution{background:var(--caution)}.dot.stop{background:var(--danger)}
.track{position:relative;margin-top:14px;padding-top:8px}.tsegs{display:flex;gap:3px;height:14px}.track.wide .tsegs{height:26px}.tseg{display:flex;flex-direction:column;min-width:3px;position:relative}
.tseg em{position:absolute;top:32px;left:0;font-style:normal;font-size:11px;color:var(--muted);white-space:nowrap}.track.wide{margin-bottom:26px}
.blk{display:block;width:100%;height:100%;border-radius:3px}.blk.hyp{background:var(--hyp)}.blk.str{background:repeating-linear-gradient(135deg,var(--str) 0 4px,var(--card-2) 4px 7px)}
.blk.peak{background:radial-gradient(circle,var(--peak) 0 1.7px,var(--card-2) 2px) 0 0/6px 6px}.blk.deload{background:transparent;box-shadow:inset 0 0 0 1.5px var(--deload)}
.tnow{position:absolute;top:0;width:3px;height:26px;margin-left:-1.5px;background:var(--ink);border-radius:2px}.track.wide .tnow{height:40px}
.tleg{display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;font-size:12px;color:var(--muted)}.tleg span{display:inline-flex;align-items:center;gap:6px}.tleg .blk{display:inline-block;width:18px;height:10px}
.pips{display:flex;gap:6px;margin-top:10px}.pips i{flex:1;height:8px;border-radius:4px;background:var(--card-2)}.pips i.on{background:var(--accent-fill)}
.ex .exh{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.grip{color:var(--dim);font-size:18px;line-height:1;padding:4px}
.sets{margin-top:10px}.srow{display:flex;align-items:center;gap:12px;padding:9px 0;font-size:15px;position:relative}.srow .idx{width:22px;color:var(--dim);text-align:center}.srow .rpe{margin-left:auto;color:var(--muted);font-size:13px}.srow.todo{color:var(--dim)}
.srow.done .idx{color:var(--ok)}
.entry{background:var(--card-2);border-radius:var(--r);padding:14px;margin:8px 0}.big{display:flex;align-items:baseline;gap:6px;margin:4px 0 10px}.big .num{font-size:40px;font-weight:600;color:var(--ink)}.big small{color:var(--muted);font-size:14px}.big .x{color:var(--dim);font-size:24px;margin:0 4px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.chip{display:inline-flex;align-items:center;min-height:36px;padding:0 12px;border-radius:999px;background:var(--card);border:1px solid var(--line);font-size:14px;color:var(--ink)}
.entry .chip{background:var(--card)}.chip.on{background:var(--accent-soft);border-color:var(--accent);color:var(--ink);font-weight:600}
.why{font-size:13px;color:var(--muted);margin-top:10px}.flagc{font-size:12px;color:var(--warn);font-weight:600;margin-left:6px}
.sheet{position:absolute;inset:44px 0 0 0;background:var(--card);border-radius:22px 22px 0 0;padding:22px 18px}.sheet .sh{font-size:30px;margin-bottom:6px}
.qb{border-top:1px solid var(--line);padding:14px 0;margin-top:12px}.howm{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:14px}.howm>span:first-child{flex:1}
.foot{position:absolute;left:18px;right:18px;bottom:34px}.lead2{font-size:17px;margin-top:6px}
.brow{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line)}.brow:first-child{border-top:0}.brow .blk{width:14px;height:36px;flex:none}.brow.cur b{color:var(--accent)}
.tabs{position:absolute;left:0;right:0;bottom:0;height:84px;padding:8px 6px 26px;display:flex;background:var(--bar);border-top:1px solid var(--line)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--dim);font-size:11px}.tab svg{width:24px;height:24px}.tab b{font-weight:500}.tab.on{color:var(--accent)}
.num{font-family:var(--fn);font-variant-numeric:tabular-nums lining-nums}`;
const DIR={
 logbook:`--ft:'IBM Plex Sans',sans-serif;--fn:'IBM Plex Mono',monospace;--r:4px;`,
 chalk:`--ft:'Barlow',sans-serif;--fn:'Barlow Condensed',sans-serif;--r:10px;`,
 grove:`--ft:'Work Sans',sans-serif;--fn:'Fraunces',serif;--r:18px;`};
const SIG={
 // Logbook: a ruled page. Rules under every row, a margin line in the accent, mono numbers, a date stamp, square corners.
 logbook:`.logbook .stamp{font-family:var(--fn);font-size:12px;letter-spacing:.08em;color:var(--accent);margin-bottom:6px}
.logbook .hd h1{font-weight:600;letter-spacing:-.01em}.logbook .card{border:1px solid var(--line);background:var(--card)}
.logbook .sets{border-left:2px solid var(--accent);padding-left:10px;margin-left:4px}.logbook .srow{border-bottom:1px solid var(--line);font-family:var(--fn)}
.logbook .srow .idx{font-family:var(--fn)}.logbook .entry{background:transparent;border:1px dashed var(--line);border-radius:2px}
.logbook .big .num{font-weight:500;letter-spacing:-.02em}.logbook .chip{border-radius:3px;font-family:var(--fn);font-size:13px}.logbook .lab{font-family:var(--fn);font-weight:500}
.logbook .card.lead h2{border-bottom:3px double var(--line);padding-bottom:6px;margin-bottom:10px}.logbook .card h2{font-weight:600}
.logbook .btn{border-radius:3px}.logbook .tab.on b{text-decoration:underline;text-underline-offset:3px}`,
 // Chalk: big condensed numbers, uppercase condensed heads, a lime bar on the current thing, chalk dust.
 chalk:`.chalk .phone{background-image:radial-gradient(rgba(255,255,255,.035) 1px,transparent 1.2px);background-size:5px 5px}
.chalk .hd h1{font-family:var(--fn);font-weight:800;font-size:48px;text-transform:uppercase;letter-spacing:.01em;line-height:.95}.chalk .hd .sm1{font-size:32px}.chalk .hd .sm1 small{font-family:var(--ft);text-transform:none;font-size:14px}
.chalk .kick,.chalk .lab{font-family:var(--fn);font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px;color:var(--accent)}
.chalk .card h2{font-family:var(--fn);font-weight:800;font-size:34px;text-transform:uppercase}
.chalk .big .num{font-family:var(--fn);font-weight:800;font-size:76px;line-height:.9;letter-spacing:-.01em}.chalk .big .x{font-size:40px}
.chalk .srow{font-family:var(--fn);font-size:19px;font-weight:600}.chalk .entry{border-left:5px solid var(--accent);border-radius:4px}
.chalk .card.lead{border-left:5px solid var(--accent)}.chalk .btn{text-transform:uppercase;font-family:var(--fn);font-weight:700;letter-spacing:.06em;font-size:17px}
.chalk .sheet .sh{font-family:var(--fn);font-weight:800;text-transform:uppercase;font-size:44px}.chalk .chip{border-radius:6px}`,
 // Grove: each set is a plate, a bar as long as its load against the top set; soft serif numbers; round, calm.
 grove:`.grove .hd h1{font-family:var(--fn);font-weight:600;font-size:38px;letter-spacing:-.01em}.grove .hd .sm1{font-family:var(--fn);font-size:30px}.grove .hd .sm1 small{font-family:var(--ft);font-weight:500;font-size:15px;letter-spacing:0}
.grove .card h2{font-family:var(--fn);font-weight:600}.grove .kick{font-size:13px;color:var(--muted)}
.grove .srow{padding:7px 0}.grove .srow .plate{position:absolute;left:30px;top:5px;bottom:5px;border-radius:999px;background:var(--accent-soft);z-index:0}
.grove .srow.done .plate{background:color-mix(in srgb,var(--hyp) 28%,transparent)}.grove .srow .plate.ghost{background:transparent;border:1.5px dashed var(--line)}
.grove .srow>*:not(.plate){position:relative;z-index:1}.grove .srow .num{padding-left:8px;font-weight:600}
.grove .big .num{font-weight:600;font-size:46px}.grove .entry{border-radius:22px}.grove .card{box-shadow:0 1px 0 var(--line)}
.grove .lab{text-transform:none;letter-spacing:0;font-size:14px;font-weight:600;color:var(--accent)}`};
for(const dir of Object.keys(T)){
  const t=T[dir], phones=[];
  for(const scr of ['today','train','checkin','program']) for(const mode of ['light','dark']){
    const k={...t[mode], r:''}; delete k.r;
    phones.push('<div class="phone p-'+scr+'-'+mode+'" style="'+vars(k)+'"><div class="scroll">'+S[scr](dir)+'</div></div>');
  }
  const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    +'<title>'+t.name+': brand direction mockups</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?'+FONTS[dir]+'&display=swap" rel="stylesheet">'
    +'<style>:root{'+DIR[dir]+'}'+BASE+'\n'+SIG[dir]+'</style></head><body class="'+dir+'"><div class="gallery">'+phones.join('\n')+'</div>'
    +'<script>var k=(location.search||location.hash).slice(1);if(k){document.body.classList.add("solo");var p=document.querySelector(".p-"+k);if(p)p.classList.add("show");}<\/script></body></html>';
  fs.writeFileSync(path.join(OUT,dir+'.html'),html);
}
console.log('wrote '+Object.keys(T).map(d=>d+'.html').join(', '));
