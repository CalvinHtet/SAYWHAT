// w-update 21d8106 (SPEC7): the update window (Refresh / Later), the green "!", the busy guard, the in-game byte counter, the cold-start
// loader counter, and the patch-notes letters. The served folder SERVE starts as version A (APPV 89); the script swaps in version B
// (APPV 90, a test build of the same commit with APPV raised) while the page is open, as a publish would.
//   SERVE=/c/Users/clvh/qa-wt/upd/serve A=<dist A> B=<dist B> BASE=http://127.0.0.1:8823 bash tools/windows/node.sh rigtest/qa/wupdate.js
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8823', SERVE = process.env.SERVE, A = process.env.A, B = process.env.B;
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/update'; fs.mkdirSync(OUT, { recursive: true });
const SEED = JSON.parse(fs.readFileSync('C:/Users/clvh/qa-wt/out/seed_adv2.json', 'utf8'));
const copyTop = (from) => { for (const f of fs.readdirSync(from)) { const p = path.join(from, f); if (fs.statSync(p).isFile()) fs.copyFileSync(p, path.join(SERVE, f)); } };
const SLOW = { offline: false, latency: 562.5, downloadThroughput: 1.6e6 / 8 * 0.9, uploadThroughput: 750e3 / 8 * 0.9 };
const log = (...a) => console.log(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '));
(async () => {
  copyTop(A);
  const br = await browser();
  const slowWorkers = async (ctxId, cond) => { const { targetInfos } = await br.send("Target.getTargets"); let n = 0; for (const t of targetInfos) if (t.type === "service_worker" && t.browserContextId === ctxId) { try { const { sessionId } = await br.send("Target.attachToTarget", { targetId: t.targetId, flatten: true }); await br.send("Network.enable", {}, sessionId); await br.send("Network.emulateNetworkConditions", cond, sessionId); n++; } catch (e) {} } return n; };
  const REC = "(function(){var T=window.__updT=[];var last='';setInterval(function(){var e=document.querySelector('.updtx')||document.getElementById('qbloadtx');var l=document.getElementById('qbloadlb');var t=e?((l?l.textContent+' | ':'')+e.textContent):'';if(t&&t!==last){last=t;T.push(Math.round(performance.now())+'ms '+t)}},40);return 1})()";
  let pg = await br.page({ fresh: true });
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbUpd && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(2500);
  // a Live build registers the service worker itself; the sandbox doesn't, so register it as Live would, then open once more so it holds the files
  await pg.ev("navigator.serviceWorker.register('sw.js').then(function(){return navigator.serviceWorker.ready}).then(function(){return 1})"); await sleep(800);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbUpd && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(3000);
  const clear = () => pg.ev('(function(){document.querySelectorAll(".dropsplash .dsx").forEach(function(b){b.click()});document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});if(document.activeElement)document.activeElement.blur();return 1})()');
  for (let k = 0; k < 6; k++) { await clear(); await sleep(400); }
  log('A open: version text', await pg.ev('(document.body.innerText.match(/v0\\.\\d+/)||[""])[0]'), 'controlled by worker', await pg.ev('!!(navigator.serviceWorker&&navigator.serviceWorker.controller)'));
  // publish B while the page is open
  copyTop(B);
  // busy guard: a window is open when the check finds the update
  await pg.ev('(function(){var b=document.querySelector(".ibbtn");b&&b.click();return 1})()'); await sleep(600);
  await pg.ev('window.__qbUpd.check()'); await sleep(2500);
  const busy = await pg.ev('[].map.call(document.querySelectorAll("#layer .modal"),function(m){return m.innerText.slice(0,40).replace(/\\s+/g," ")})');
  log('1. with the inbox open, windows:', busy, '(the update window must not be among them)');
  await clear(); await sleep(4000);
  const offer = await pg.ev('(function(){var m=document.querySelector("#layer .modal .upd");return m?m.innerText.replace(/\\s+/g," "):null})()');
  log('   after closing it, within 4 s:', offer);
  await pg.shot(OUT + '/upd_offer.png');
  // Later -> green "!" by the envelope; tap it -> the window again
  await pg.ev('(function(){var b=document.querySelector("[data-upd=later]");b&&b.click();return !!b})()'); await sleep(800);
  const bang = await pg.ev('(function(){var b=document.querySelector(".updbtn");if(!b)return null;var r=b.getBoundingClientRect(),e=document.querySelector(".ibbtn").getBoundingClientRect();return {text:b.textContent,color:getComputedStyle(b).backgroundColor,x:Math.round(r.left),y:Math.round(r.top),envX:Math.round(e.left)}})()');
  log('2. after Later: green "!"', bang); await pg.shot(OUT + '/upd_later_bang.png', { x: 0, y: 0, width: 390, height: 260 });
  for (const v of ['train', 'hall', 'shop', 'hideout']) { await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');b&&b.click();return 1})()`); await sleep(1200); await clear(); log('   "!" on ' + v + ':', await pg.ev('!!document.querySelector(".updbtn")')); }
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()'); await sleep(1000);
  const r = await pg.ev('(function(){var b=document.querySelector(".updbtn");if(!b)return null;var x=b.getBoundingClientRect();return {x:x.left+x.width/2,y:x.top+x.height/2}})()');
  if (r) await pg.tap(r.x, r.y); await sleep(800);
  log('3. tap "!" (a real tap):', await pg.ev('(function(){var m=document.querySelector("#layer .modal .upd");return m?m.innerText.replace(/\\s+/g," ").slice(0,80):null})()'));
  // Refresh on Slow 4G: the counter climbs to the total, then the reload
  await pg.s('Network.enable'); await pg.s('Network.emulateNetworkConditions', SLOW);
  log('   service workers throttled:', await slowWorkers(pg.browserContextId, SLOW)); await pg.ev(REC);
  await pg.ev('(function(){var b=document.querySelector("[data-upd=now]");b&&b.click();return !!b})()');
  const seen = []; let rec = []; const t0 = Date.now();
  while (Date.now() - t0 < 90000) { let t; try { t = await pg.ev('(function(){var m=document.querySelector(".updtx");return m?m.textContent:"(gone)"})()'); const rr = await pg.ev("window.__updT||null"); if (rr && rr.length >= rec.length) rec = rr; } catch (e) { t = '(reloading)'; }
    if (seen[seen.length - 1] !== t) seen.push(t); if (/reloading|\(gone\)/.test(t) && seen.length > 2) break; await sleep(300); }
  log('4. Installing update texts (Slow 4G):', seen.slice(0, 14), '... last', seen.slice(-3));
  log("   every counter text seen (40 ms poll):", rec.slice(0, 12), "... last", rec.slice(-3), "count", rec.length);
  await pg.s('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await pg.wait('!!(window.__qbUpd && document.querySelector(".nav button[data-v=board]"))', 120000).catch(() => {}); await sleep(3500);
  log('   after the reload: version', await pg.ev('(document.body.innerText.match(/v0\\.\\d+/)||[""])[0]'), 'pops', await pg.ev('[].map.call(document.querySelectorAll(".pop,#layer .modal"),function(p){return p.innerText.slice(0,60).replace(/\\s+/g," ")})'));
  const ctx = pg.browserContextId; pg.keepCtx = true; await pg.close();
  // cold start: version A again in the profile's copy? Publish A->B already happened; publish B again with a fresh fingerprint is not
  // possible here, so the cold start is tested the other way: a new tab in the same profile opening B (now held) shows no counter
  const p2 = await br.page({ ctx });
  await p2.s('Network.enable'); await p2.s('Network.emulateNetworkConditions', SLOW);
  const loader = []; p2.go(BASE + '/', false);
  const t1 = Date.now(); while (Date.now() - t1 < 25000) { let t; try { t = await p2.ev('(function(){var l=document.getElementById("qbloadlb"),x=document.getElementById("qbloadtx");return l||x?((l?l.textContent:"")+" | "+(x?x.textContent:"")):"(no loader)"})()'); } catch (e) { t = null; }
    if (t && loader[loader.length - 1] !== t) loader.push(t); if (t === '(no loader)' && loader.length > 1) break; await sleep(250); }
  log('5. second start with nothing new (Slow 4G): loader texts', loader);
  await p2.close();
  // cold start onto a newer version: swap back to A's files under B's name is not a newer version, so make the profile miss B's app.js
  const p3 = await br.page({ ctx });
  await p3.go(BASE + '/version.json');
  const removed = await p3.ev('caches.open("qb-files").then(function(k){return k.keys().then(function(rs){var a=rs.filter(function(q){return /app\\.js\\?h=|qbdata\\.js\\?h=/.test(q.url)});return Promise.all(a.map(function(q){return k.delete(q)})).then(function(){return a.map(function(q){return q.url.replace(/^.*\\//,"")})})})})');
  await p3.s('Network.enable'); await p3.s('Network.emulateNetworkConditions', SLOW);
  await p3.s('Page.addScriptToEvaluateOnNewDocument', { source: REC }); log('   service workers throttled:', await slowWorkers(ctx, SLOW));
  const loader3 = []; p3.go(BASE + '/', false);
  const t3 = Date.now(); while (Date.now() - t3 < 60000) { let t; try { t = await p3.ev('(function(){var l=document.getElementById("qbloadlb"),x=document.getElementById("qbloadtx");return l||x?((l?l.textContent:"")+" | "+(x?x.textContent:"")):"(no loader)"})()'); } catch (e) { t = null; }
    if (t && loader3[loader3.length - 1] !== t) loader3.push(t); if (t === '(no loader)' && loader3.length > 1) break; await sleep(250); }
  log("   loader texts (40 ms poll):", (await p3.ev("window.__updT||[]")).slice(0, 12), "...", (await p3.ev("window.__updT||[]")).slice(-3));
  log('6. cold start missing ' + JSON.stringify(removed) + ' (Slow 4G): loader texts', loader3.slice(0, 12), '... last', loader3.slice(-3));
  await p3.s('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await p3.wait('!!(window.__qbUpd && document.querySelector(".nav button[data-v=board]"))', 120000).catch(() => {}); await sleep(3000);
  // patch notes: lines for v90 and three older releases, a save that last ran v85
  const pn = await p3.ev(`(async function(){var U=window.__qbUpd,x=window.__qb.x(),S=x.S;U.notes.length=0;
    [[86,['Eighty-six one','Eighty-six two','Eighty-six three']],[87,['Eighty-seven one','Eighty-seven two','Eighty-seven three']],[88,['Eighty-eight one','Eighty-eight two','Eighty-eight three']],[90,['Ninety one','Ninety two','Ninety three']]].forEach(function(p){U.notes.push({v:p[0],lines:p[1]})});
    S.pn={from:85};if(S.letters&&S.letters.paid){delete S.letters.paid.pn86;delete S.letters.paid.pn87;delete S.letters.paid.pn88;delete S.letters.paid.pn90}
    document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();var b=document.querySelector('.ibbtn');var badge=b&&b.querySelector('i')?b.querySelector('i').textContent:'0';b&&b.click();await new Promise(function(r){setTimeout(r,700)});
    var rows=[].map.call(document.querySelectorAll('#layer .ibrow'),function(r){return r.innerText.replace(/\\s+/g,' ')});
    var c0=S.coins,pays={};for(var v of [90,88,87,86]){var row=document.querySelector('#layer .ibrow[data-id="pn'+v+'"]');if(!row){pays[v]='no row';continue}var c=S.coins;row.click();await new Promise(function(r){setTimeout(r,600)});pays[v]=S.coins-c;
      var back=document.querySelector('#layer [data-ib=list]');back&&back.click();await new Promise(function(r){setTimeout(r,400)})}
    var again=document.querySelector('#layer .ibrow[data-id="pn90"]'),c1=S.coins;again&&again.click();await new Promise(function(r){setTimeout(r,600)});
    return {badge:badge,rows:rows,pays:pays,secondOpen:S.coins-c1}})()`);
  log('7. patch notes (save last ran v85; letters for 86, 87, 88, 90):', pn);
  await p3.shot(OUT + '/upd_patch_letter.png');
  log('page errors', pg.errs.length, p2.errs.length, p3.errs.length, p3.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
