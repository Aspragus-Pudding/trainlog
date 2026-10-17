#!/usr/bin/env node
/* Copies APP_NAME (index.html) into the places a script can't reach: the page
   <title>, the iOS home-screen title and manifest.webmanifest's name and
   short_name. Renaming the app is: change APP_NAME, run this.
   Storage keys, backup format and file contents never change with the name.
   §93 fails if these copies disagree with APP_NAME. */
const fs=require('fs'), path=require('path');
const R=path.join(__dirname,'..');
const htmlPath=path.join(R,'index.html'), manPath=path.join(R,'manifest.webmanifest');
let html=fs.readFileSync(htmlPath,'utf8');
const m=html.match(/const APP_NAME='([^'\\]+)';/);
if(!m){ console.error('APP_NAME not found in index.html'); process.exit(1); }
const name=m[1], attr=name.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
html=html.replace(/<title>[^<]*<\/title>/, '<title>'+attr+'</title>');
html=html.replace(/<meta name="apple-mobile-web-app-title" content="[^"]*">/, '<meta name="apple-mobile-web-app-title" content="'+attr+'">');
fs.writeFileSync(htmlPath, html);
const man=JSON.parse(fs.readFileSync(manPath,'utf8'));
man.name=name; man.short_name=name.length>12?name.slice(0,12):name;
fs.writeFileSync(manPath, JSON.stringify(man,null,2).replace(/\{\n\s+"src": ([^\n]+),\n\s+"sizes": ([^\n]+),\n\s+"type": ([^\n]+),\n\s+"purpose": ([^\n]+)\n\s+\}/g,'{ "src": $1, "sizes": $2, "type": $3, "purpose": $4 }')+'\n');
console.log('name: '+name+' (title, home-screen title, manifest)');
