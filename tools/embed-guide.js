#!/usr/bin/env node
/* Copies docs/guide.md into index.html's <script type="text/markdown"
   id="guide-md">, and docs/glossary.md into id="glossary-md", byte-for-byte.
   The guide is the user guide (tasks, every setting) and the app's tours (the
   screen sections; every "###" is an entry); the glossary is the app's tap-for-definition text (every "##" is an
   entry). Run after editing either:
     node tools/embed-guide.js
   tests/prescription-invariants.js fails if a copy differs. */
const fs=require('fs'), path=require('path');
const root=path.join(__dirname,'..'), file=path.join(root,'index.html');
let html=fs.readFileSync(file,'utf8');
[['guide.md','guide-md',md=>md.split('\n').filter(l=>/^### /.test(l)).length+' entries'],
 ['glossary.md','glossary-md',md=>md.split('\n').filter(l=>/^## /.test(l)).length+' entries']].forEach(([name,id,count])=>{
  const md=fs.readFileSync(path.join(root,'docs',name),'utf8');
  if(/<\/script/i.test(md)) throw new Error('docs/'+name+' must not contain </script');
  const re=new RegExp('(<script type="text/markdown" id="'+id+'">)[\\s\\S]*?(</script>)');
  if(!re.test(html)) throw new Error('no '+id+' block in index.html');
  html=html.replace(re,(a,b,c)=>b+md+c);
  console.log('embedded docs/'+name+' ('+count(md)+')');
});
fs.writeFileSync(file,html);
