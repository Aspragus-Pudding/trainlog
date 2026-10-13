#!/usr/bin/env node
/* Copies CHANGELOG.md's top entry into index.html's
   <script type="application/json" id="whats-new"> — the "what's new" card shown
   once after an update — and the last 12 entries into id="whats-new-history"
   (Settings → About). Run after adding an entry:  node tools/embed-changelog.js
   tests/prescription-invariants.js checks the copy, the top entry and APP_VERSION agree. */
const fs=require('fs'), path=require('path');
const root=path.join(__dirname,'..');
const md=fs.readFileSync(path.join(root,'CHANGELOG.md'),'utf8');
const i=md.indexOf('\n## '), j=md.indexOf('\n## ',i+1);
if(i<0) throw new Error('CHANGELOG.md has no "## x.y.z" entry');
const sec=md.slice(i+1,j<0?undefined:j);
const version=(sec.match(/^## (\d+\.\d+\.\d+)/)||[])[1];
const lines=sec.split('\n').filter(l=>l.startsWith('- ')).map(l=>l.slice(2).trim());
if(!version||!lines.length) throw new Error('top entry needs a version and bullet lines');
const file=path.join(root,'index.html');
const html=fs.readFileSync(file,'utf8');
const re=/(<script type="application\/json" id="whats-new">)[\s\S]*?(<\/script>)/;
if(!re.test(html)) throw new Error('no whats-new block in index.html');
let out=html.replace(re,(a,b,c)=>b+JSON.stringify({version,lines})+c);
// the last 12 entries, for Settings → About → What's new, by version
const hist=md.split('\n## ').slice(1,13).map(s=>{
  const head=s.split('\n')[0], m=head.match(/^(\d+\.\d+\.\d+)(?:\s+—\s+(\S+))?/); if(!m) return null;
  return {version:m[1], date:m[2]||'', lines:s.split('\n').filter(l=>l.startsWith('- ')).map(l=>l.slice(2).trim())};
}).filter(Boolean);
const hre=/(<script type="application\/json" id="whats-new-history">)[\s\S]*?(<\/script>)/;
if(!hre.test(out)) throw new Error('no whats-new-history block in index.html');
out=out.replace(hre,(a,b,c)=>b+JSON.stringify(hist).replace(/<\//g,'<\\/')+c);
fs.writeFileSync(file,out);
const app=(html.match(/const APP_VERSION='([^']+)'/)||[])[1];
console.log('embedded '+version+' ('+lines.length+' lines, '+hist.length+' in the history)'+(app!==version?' — WARNING: APP_VERSION is '+app:''));
