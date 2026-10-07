#!/usr/bin/env node
/* The exercise library as the app builds it (batch F part 1a):

     node tools/library-report.js

   1. Count by implement (working exercises: no rehab, no folded entries).
   2. Hand-check list: every generated entry whose movement tags, or whose flag
      under any condition in the library, differ from its parent's — with the
      reason. Light implements (band, bodyweight) drop the "heavy" mechanisms
      automatically; everything else that differs was set by hand in LIB_GEN.
   Reads index.html only; writes nothing. */
const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
function stub(){ return new Proxy(function(){},{get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },set(){return true;},apply(){return stub();},construct(){return stub();}}); }
const doc={getElementById:id=>{ const m=html.match(new RegExp('<script type="application/json" id="'+id+'">([\\s\\S]*?)</script>')); return m?{textContent:m[1]}:null; },
  querySelector:()=>stub(),querySelectorAll:()=>[],createElement:()=>stub(),addEventListener(){},body:stub(),documentElement:stub()};
const store={'trainlog.cfg.v1':JSON.stringify({injuryConsent:{ts:'2026-10-07',v:1}})};
const ls={getItem:k=>k in store?store[k]:null,setItem(){},removeItem(){}};
const A=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','console',
  src+';return {EX,exById,exTags,flagFor,CFG,INJ,implementOf,IMPLEMENT_LABEL,LIGHT_DROP,LIB_GEN};')(doc,stub(),stub(),ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),{log(){},warn(){},error(){}});

const work=A.EX.filter(e=>!e.rehab&&!e.folded&&!e.custom);
const gen=work.filter(e=>e.gen);
console.log('Library: '+work.length+' working exercises ('+(work.length-gen.length)+' existing, '+gen.length+' new)\n');
console.log('By implement             total   new   auto-pickable');
const by={}; work.forEach(e=>{ const k=A.implementOf(e); (by[k]=by[k]||{n:0,g:0,a:0}).n++; if(e.gen) by[k].g++; if(!e.manualOnly&&!e.named) by[k].a++; });
Object.entries(by).sort((a,b)=>b[1].n-a[1].n).forEach(([k,v])=>console.log('  '+(A.IMPLEMENT_LABEL[k]||k).padEnd(24)+String(v.n).padStart(4)+String(v.g).padStart(6)+String(v.a).padStart(10)));
console.log('  (named variants and manual-only entries are addable everywhere; named ones are auto-picked once logged)\n');

console.log('Hand-check: generated entries that differ from their parent');
const conds=A.INJ.map(e=>e.id);
let n=0;
gen.forEach(e=>{
  const p=A.exById[e.parent], lines=[];
  const t=A.exTags(e.id).sort(), tp=A.exTags(p.id).sort();
  const gone=tp.filter(x=>!t.includes(x)), added=t.filter(x=>!tp.includes(x));
  if(gone.length||added.length){
    const auto=!e.tags&&gone.every(x=>A.LIGHT_DROP.includes(x))&&!added.length;
    lines.push('tags '+(added.length?'+'+added.join(' +'):'')+(gone.length?' −'+gone.join(' −'):'')+' — '+(auto?'light implement: no heavy load':e.why||'(no reason given)'));
  }
  const fd=[];
  conds.forEach(c=>{ A.CFG.conditions=[c]; const f=A.flagFor(e.id), fp=A.flagFor(p.id);
    const l=f?f.level:'none', lp=fp?fp.level:'none'; if(l!==lp) fd.push(c+': '+lp+' → '+l); });
  if(fd.length) lines.push('flags '+fd.join(' · ')+(e.why&&!(gone.length||added.length)?' — '+e.why:''));
  if(lines.length){ n++; console.log('  '+e.id.padEnd(20)+' ('+e.name+', from '+p.id+')'); lines.forEach(l=>console.log('      '+l)); }
});
console.log('\n'+n+' of '+gen.length+' new entries differ from their parent; the rest inherit tags and flags unchanged.');
