#!/usr/bin/env node
/* Copies docs/tutorial.md into index.html's <script type="text/markdown"
   id="tutorial-md"> byte-for-byte. The file is both the user guide and the
   app's tours (every "###" is a step). Run after editing it:
     node tools/embed-tutorial.js
   tests/prescription-invariants.js fails if the two differ. */
const fs=require('fs'), path=require('path');
const root=path.join(__dirname,'..'), file=path.join(root,'index.html');
const md=fs.readFileSync(path.join(root,'docs','tutorial.md'),'utf8');
if(/<\/script/i.test(md)) throw new Error('docs/tutorial.md must not contain </script');
const html=fs.readFileSync(file,'utf8'), re=/(<script type="text\/markdown" id="tutorial-md">)[\s\S]*?(<\/script>)/;
if(!re.test(html)) throw new Error('no tutorial-md block in index.html');
fs.writeFileSync(file,html.replace(re,(a,b,c)=>b+md+c));
console.log('embedded docs/tutorial.md ('+md.split('\n').filter(l=>/^### /.test(l)).length+' steps)');
