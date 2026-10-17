/* node shots.js <dir with the mockup html> <out dir> — 390 px screenshots of every screen, light and dark.
   Only Google Fonts may load (the open-licensed fonts); everything else off-host is blocked. */
const { webkit } = require('playwright');
const http=require('http'), fs=require('fs'), path=require('path');
const [, , SRC, OUT]=process.argv; fs.mkdirSync(OUT,{recursive:true});
const PORT=9300+Math.floor(Math.random()*200);
const server=http.createServer((req,res)=>{ const f=path.join(SRC,decodeURIComponent(req.url.split('?')[0].split('#')[0])); if(!fs.existsSync(f)){ res.statusCode=404; return res.end(); }
  res.setHeader('Content-Type','text/html; charset=utf-8'); res.end(fs.readFileSync(f)); }).listen(PORT);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const browser=await webkit.launch();
  const ctx=await browser.newContext({viewport:{width:390,height:844}, deviceScaleFactor:2});
  await ctx.route(/^(?!http:\/\/localhost|https:\/\/fonts\.googleapis\.com|https:\/\/fonts\.gstatic\.com)/,r=>r.abort());
  const page=await ctx.newPage(); page.on('pageerror',e=>console.log('PAGEERR',e.message));
  for(const dir of ['logbook','chalk','grove']) for(const scr of ['today','train','checkin','program']) for(const mode of ['light','dark']){
    await page.goto('http://localhost:'+PORT+'/'+dir+'.html?'+scr+'-'+mode); await page.waitForLoadState('networkidle'); await page.evaluate(()=>document.fonts.ready); await sleep(150);
    await page.screenshot({path:path.join(OUT,dir+'-'+scr+'-'+mode+'.png'), clip:{x:0,y:0,width:390,height:844}});
  }
  console.log('24 screenshots');
  await browser.close(); server.close();
})().catch(e=>{ console.error(e); server.close(); process.exit(1); });
