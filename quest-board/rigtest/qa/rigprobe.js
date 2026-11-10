// W1 probe: after the game opens (SEED save) on one screen, counts every 10 s how many character frames the rig renders
// (canvas.toBlob calls, the loft bridge's encoder), blob URLs made and revoked, and character images on the page.
//   SEED=<file> TAB=board SECS=120 bash tools/windows/node.sh rigtest/qa/rigprobe.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', CPU = +(process.env.CPU || 4), TAB = process.env.TAB || 'board', SECS = +(process.env.SECS || 120);
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
const HOOK = `(function(){var C=window.__qaR={blob:0,url:0,rev:0,warm:{}};var tb=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(){C.blob++;return tb.apply(this,arguments)};
var cu=URL.createObjectURL,ru=URL.revokeObjectURL;URL.createObjectURL=function(){C.url++;return cu.apply(URL,arguments)};URL.revokeObjectURL=function(){C.rev++;return ru.apply(URL,arguments)};
var iv=setInterval(function(){if(window.QBLoft&&QBLoft.warm&&!QBLoft.__w){var w=QBLoft.warm;QBLoft.warm=function(ch,only){var k=JSON.stringify(ch).length+':'+(ch&&ch.hairStyle)+':'+(only||'room');C.warm[k]=(C.warm[k]||0)+1;return w.apply(this,arguments)};QBLoft.__w=1;clearInterval(iv)}},5)})();`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: HOOK });
  if (SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); }
  if (CPU > 1) await pg.s('Emulation.setCPUThrottlingRate', { rate: CPU });
  await pg.go(BASE + '/'); await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000);
  if (TAB !== 'board') await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${TAB}"]');b&&b.click();return 1})()`);
  let last = { blob: 0, url: 0, rev: 0 };
  for (let t = 10; t <= SECS; t += 10) {
    await sleep(10000);
    const r = JSON.parse(await pg.ev('JSON.stringify({blob:__qaR.blob,url:__qaR.url,rev:__qaR.rev,warmed:Object.keys(__qaR.warm).length,calp:document.querySelectorAll("img.calp").length,looks:new Set([].map.call(document.querySelectorAll("img.calp"),function(i){return i.dataset.look})).size,imgs:document.images.length,nodes:document.getElementsByTagName("*").length})'));
    console.log(`t=${t}s frames rendered +${r.blob - last.blob} (total ${r.blob}), blob urls +${r.url - last.url}, revoked +${r.rev - last.rev}, characters warmed ${r.warmed}, character imgs ${r.calp} (${r.looks} looks), imgs ${r.imgs}, nodes ${r.nodes}`);
    last = r;
  }
  const w = JSON.parse(await pg.ev('JSON.stringify(__qaR.warm)'));
  console.log('warm calls by character (json length:hair:clip): ' + Object.entries(w).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => k + ' x' + v).join(', '));
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 3).join(' | '));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
