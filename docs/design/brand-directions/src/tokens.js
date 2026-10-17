// The three brand directions as full token sets (the same keys as DEFAULT_TOKENS + the theme extras),
// checked with the app's own themeReport/readableTokens. node tokens.js <repo root> → writes tokens.json next to this file.
const fs=require('fs'), path=require('path');
const D={
 logbook:{
  name:'Logbook', fonts:{text:'IBM Plex Sans', num:'IBM Plex Mono'},
  light:{bg:'#F5F0E6',card:'#FBF8F1','card-2':'#EFE8DA',line:'#D9CFBD',ink:'#1D1B17',muted:'#57524A',dim:'#7A7366',
   hyp:'#4F6B2A',str:'#5B4636',peak:'#B83A12',deload:'#6F6A60','on-block':'#FFFFFF',
   accent:'#B83A12','on-accent':'#1D1B17','accent-fill':'#E4572E','accent-soft':'rgba(228,87,46,.12)',
   warn:'#94570A','warn-soft':'rgba(148,87,10,.10)',danger:'#B3261E',go:'#1D1B17',skip:'#B3261E',ok:'#2F7D4A',caution:'#A87400',
   steel:'#8C8475',pr:'#E4572E','on-pr':'#1D1B17',bar:'rgba(245,240,230,.94)',backdrop:'rgba(29,27,23,.42)'},
  dark:{bg:'#1C1A17',card:'#25221E','card-2':'#2E2A25',line:'#3A352F',ink:'#F2ECE1',muted:'#B9B0A2',dim:'#8C8477',
   hyp:'#A3BE6E',str:'#D8C3A5',peak:'#FF8A5C',deload:'#A0998B','on-block':'#1C1A17',
   accent:'#FF7A4D','on-accent':'#1C1A17','accent-fill':'#E4572E','accent-soft':'rgba(255,122,77,.14)',
   warn:'#F0B35A','warn-soft':'rgba(240,179,90,.12)',danger:'#FF6B5E',go:'#F2ECE1',skip:'#FF6B5E',ok:'#7BC48E',caution:'#E6C15A',
   steel:'#7D766A',pr:'#FF8A5C','on-pr':'#1C1A17',bar:'rgba(28,26,23,.94)',backdrop:'rgba(0,0,0,.55)'}},
 chalk:{
  name:'Chalk', fonts:{text:'Barlow', num:'Barlow Condensed'},
  dark:{bg:'#16181A',card:'#202326','card-2':'#2A2E32',line:'#363B40',ink:'#F2F2EC',muted:'#B4B7B0',dim:'#878B85',
   hyp:'#C8F03C',str:'#FFD23F',peak:'#FF6FB0',deload:'#959A93','on-block':'#16181A',
   accent:'#C8F03C','on-accent':'#16181A','accent-fill':'#C8F03C','accent-soft':'rgba(200,240,60,.12)',
   warn:'#FFB547','warn-soft':'rgba(255,181,71,.12)',danger:'#FF6B5E',go:'#C8F03C',skip:'#FF6B5E',ok:'#4FD1A1',caution:'#FFD23F',
   steel:'#707670',pr:'#C8F03C','on-pr':'#16181A',bar:'rgba(22,24,26,.94)',backdrop:'rgba(0,0,0,.55)'},
  light:{bg:'#ECEDE8',card:'#F9F9F5','card-2':'#E3E5DF',line:'#D3D6CF',ink:'#17191B',muted:'#4E534E',dim:'#6E736A',
   hyp:'#4E6B00',str:'#7D5E00',peak:'#B4135F',deload:'#636862','on-block':'#FFFFFF',
   accent:'#4E6B00','on-accent':'#C8F03C','accent-fill':'#17191B','accent-soft':'rgba(78,107,0,.10)',
   warn:'#8A5A00','warn-soft':'rgba(138,90,0,.10)',danger:'#B3261E',go:'#17191B',skip:'#B3261E',ok:'#1F7D52',caution:'#8F6D00',
   steel:'#8D928A',pr:'#4E6B00','on-pr':'#FFFFFF',bar:'rgba(236,237,232,.94)',backdrop:'rgba(23,25,27,.42)'}},
 grove:{
  name:'Grove', fonts:{text:'Work Sans', num:'Fraunces'},
  light:{bg:'#EEF2EC',card:'#FFFFFF','card-2':'#E4EAE2',line:'#D2DBD0',ink:'#13241B',muted:'#46574D',dim:'#68776D',
   hyp:'#2B7350',str:'#7A5A2E',peak:'#B93A24',deload:'#68776D','on-block':'#FFFFFF',
   accent:'#B93A24','on-accent':'#FFFFFF','accent-fill':'#1F5A3D','accent-soft':'rgba(185,58,36,.10)',
   warn:'#94570A','warn-soft':'rgba(148,87,10,.10)',danger:'#B3261E',go:'#1F5A3D',skip:'#B3261E',ok:'#2B7350',caution:'#A87400',
   steel:'#8FA096',pr:'#E2533B','on-pr':'#13241B',bar:'rgba(238,242,236,.94)',backdrop:'rgba(19,36,27,.42)'},
  dark:{bg:'#0F1A14',card:'#16241C','card-2':'#1E2E25',line:'#2A3B31',ink:'#ECF2EC',muted:'#A9B8AE',dim:'#80908A',
   hyp:'#7FCB9B',str:'#D9B07A',peak:'#FF7A5C',deload:'#93A198','on-block':'#0F1A14',
   accent:'#FF8466','on-accent':'#0F1A14','accent-fill':'#57B383','accent-soft':'rgba(255,132,102,.12)',
   warn:'#F0B35A','warn-soft':'rgba(240,179,90,.12)',danger:'#FF6B5E',go:'#57B383',skip:'#FF6B5E',ok:'#7FCB9B',caution:'#E6C15A',
   steel:'#5F7066',pr:'#FF8466','on-pr':'#0F1A14',bar:'rgba(15,26,20,.94)',backdrop:'rgba(0,0,0,.55)'}}};
// the app's checker: load index.html's script with a stub DOM and call themeReport / readableTokens
const root=process.argv[2]; const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const src=html.match(/<script>([\s\S]*)<\/script>/)[1];
const stub=()=>new Proxy(function(){},{get(t,k){ if(k===Symbol.toPrimitive) return ()=>''; if(k==='length') return 0; if(k==='then') return undefined; return stub(); },set(){return true;},apply(){return stub();},construct(){return stub();}});
const store={}, ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
const NAV=new Proxy(stub(),{get(t,k){ return k==='storage'?undefined:stub(); }});
const A=new Function('document','window','navigator','localStorage','location','history','setTimeout','setInterval','alert','confirm','fetch','Notification','matchMedia','requestAnimationFrame','console',
  src+'\n;return {themeReport,readableTokens,contrastOf,rgbOf,deltaE,DEFAULT_TOKENS};')(stub(),stub(),NAV,ls,stub(),stub(),()=>0,()=>0,()=>{},()=>true,()=>Promise.resolve({}),stub(),()=>stub(),()=>0,{log(){},warn(){},error(){}});
const out={}; let allOk=true;
for(const [k,d] of Object.entries(D)){
  out[k]={name:d.name,fonts:d.fonts};
  for(const mode of ['light','dark']){
    const missing=Object.keys(A.DEFAULT_TOKENS).filter(t=>!(t in d[mode]));
    const bad=A.themeReport(d[mode]);
    const fix=bad.length?A.readableTokens(d[mode]):null;
    out[k][mode]=fix?fix.tokens:d[mode];
    console.log(d.name+' '+mode+': '+(missing.length?'MISSING '+missing.join(','):'all tokens')+' · '+(bad.length?bad.length+' rule(s) failed, nudged: '+fix.changed.join(', ')+' → '+(A.themeReport(fix.tokens).length?'STILL FAILING':'passes'):'passes every readability rule'));
    if(bad.length) bad.forEach(b=>console.log('   '+b.fg+' on '+b.bg+': '+b.ratio+' (need '+b.min+', '+b.what+')'));
    if(missing.length||(fix&&A.themeReport(fix.tokens).length)) allOk=false;
  }
}
fs.writeFileSync(path.join(__dirname,'..','tokens.json'),JSON.stringify(out,null,1));
console.log(allOk?'ALL DIRECTIONS PASS':'SOMETHING FAILS');
