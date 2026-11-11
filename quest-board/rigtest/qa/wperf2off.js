// w-perf2 offline (v0.92, W1b): the room pictures are files now, kept by the service worker once fetched. Serve a build on a port of its
// own (PORT), visit a building and two rooms online, stop that server (a real "offline": nothing answers), reload: the game must open
// from the worker's copy, the rooms seen before draw every picture, a room never opened draws without its pictures, and no page
// errors besides the failed requests. Needs the server's PID to stop it (SRVPID) or STOP=<command>.
//   BASE=http://127.0.0.1:8820 SRVPID=<pid of that qserve> CHROME_PORT=9375 bash tools/windows/node.sh rigtest/qa/wperf2off.js
const { execSync } = require('child_process');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8820';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const log = (...a) => console.log('   ' + a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
const PICS = (root) => `(async function(){var R=document.querySelector('${root}')||document,urls=[];var who=function(e){return e.closest('[id^="lfa-"],.pv-tag')};
  [].forEach.call(R.querySelectorAll('image'),function(e){if(who(e))return;var h=e.getAttribute('href')||'';if(h)urls.push(h)});
  var uniq=urls.filter(function(u,i){return urls.indexOf(u)===i}),failed=[];
  await Promise.all(uniq.map(function(u){return new Promise(function(r){var i=new Image(),t=setTimeout(function(){failed.push('timeout '+u.slice(-40));r()},8000);i.onload=function(){clearTimeout(t);r()};i.onerror=function(){clearTimeout(t);failed.push(u.split('?')[0].split('/').pop());r()};i.src=u})}));
  return {u:uniq.length,bl:uniq.filter(function(u){return /bl_\\d+/.test(u)}).length,nFailed:failed.length,failed:failed.slice(0,3)}})()`;
const room = (pg, t) => pg.ev(`(async function(){document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});var S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${t}'});if(i<0)return null;window.__qb.roomModal(i);await new Promise(function(r){setTimeout(r,2500)});return 1})()`).then(() => pg.ev(PICS('#layer .rmodal')));
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qbRooms && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fey',sex:'f'});S.welcomed=1;S.xp=x.cum(90);var g,n=0;S.gates=S.gates||[];while((g=x.gated())!==null&&n++<120)S.gates.push(g);
    window.__qbRooms.unlockAll();S.base.slots.forEach(function(r){if(!r)return;r.a=r.a||{};(x.ADDONS[r.t]||[]).forEach(function(a){var e=a[3]||{};if(!e.retired)r.a[a[0]]=1})});S.reset91={refund:0,fresh:1,at:Date.now()};x.persist();return 1})()`);
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))', 120000); await sleep(3000); await pg.ev(clear);
  // the sandbox build returns before web.js registers the worker (Live registers it at load; LIVE= checks that), so here the same sw.js
  // is registered by hand, then the page reloads under it
  const manual = await pg.ev("navigator.serviceWorker.getRegistrations().then(function(r){if(r.length)return false;return navigator.serviceWorker.register('sw.js').then(function(){return navigator.serviceWorker.ready}).then(function(){return true})})");
  if (manual) { await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))', 120000); await sleep(2500); await pg.ev(clear); }
  log('registered by hand (sandbox):', manual, '| registrations:', await pg.ev('navigator.serviceWorker.getRegistrations().then(function(r){return r.map(function(x){return x.scope+" "+(x.active&&x.active.state)})})'));
  const ctl = await pg.wait('!!(navigator.serviceWorker && navigator.serviceWorker.controller)', 30000).catch(() => false); log('service worker controls the page:', !!ctl);
  const seen = ['bedroom', 'theater'], unseen = ['lair'];
  for (const t of seen) log(`online ${t}:`, await room(pg, t));
  await sleep(1500);
  const cached = await pg.ev('caches.open("qb-files").then(function(k){return k.keys()}).then(function(r){return {all:r.length,bl:r.filter(function(q){return /bl_\\d+/.test(q.url)}).length}})'); log('the worker\'s copy:', cached);
  // offline for real: stop the server
  if (process.env.SRVPID) process.kill(+process.env.SRVPID); else if (process.env.STOP) execSync(process.env.STOP);
  await sleep(1500); let up = true; try { await fetch(BASE + '/version.json'); } catch (e) { up = false; } log('server answering after the stop:', up);
  const e0 = pg.errs.length; let opened = true;
  try { await pg.go(BASE + '/', false); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))', 60000); await sleep(3000); await pg.ev(clear); } catch (e) { opened = false; log('reload failed:', e.message.slice(0, 120)); }
  ok(ctl && !up && opened, `offline (server stopped): the game opens from the service worker's copy (${cached.all} files kept, ${cached.bl} room pictures)`);
  if (opened) {
    for (const t of seen) { const r = await room(pg, t); ok(r && r.nFailed === 0 && r.u > 0, `offline, a room opened before (${t}): ${r && r.u} pictures, ${r && r.nFailed} missing ${JSON.stringify(r && r.failed)}`); }
    for (const t of unseen) { const r = await room(pg, t); log(`offline, a room never opened (${t}): ${r && r.u} pictures, ${r && r.nFailed} missing ${JSON.stringify(r && r.failed)} (expected: its room pictures missing until online)`); }
    await pg.shot((process.env.OUT || require('os').tmpdir() + '/') + 'offline_unseen_room.png');
    const errs = pg.errs.slice(e0).filter((e) => !/net::|Failed to load resource|ERR_|NetworkError|Failed to fetch|firebase/i.test(e));
    ok(!errs.length, `offline: no page errors besides failed requests (${errs.length}) ${JSON.stringify(errs.slice(0, 2))}`);
  }
  if (process.env.LIVE) { // the Live build registers the worker itself at load (the sign-in screen is as far as it gets here)
    const p2 = await br.page({ fresh: true }); await p2.go(process.env.LIVE + '/'); await sleep(10000);
    const reg = await p2.ev('navigator.serviceWorker.getRegistrations().then(function(r){return r.map(function(x){return x.scope+" "+(x.active&&x.active.state)})})');
    const ctl2 = await p2.ev('!!navigator.serviceWorker.controller'); await p2.go(process.env.LIVE + '/'); await sleep(6000);
    const c2 = await p2.ev('caches.keys().then(function(k){return k.join(",")})'); const n2 = await p2.ev('caches.open("qb-files").then(function(k){return k.keys()}).then(function(r){return r.length})');
    ok(reg.length && /activated/.test(reg[0]), `Live (${process.env.LIVE}): the game registers its worker at load: ${JSON.stringify(reg)}; after a reload caches ${c2}, ${n2} files kept`); }
  console.log(P.length ? `W-PERF2-OFFLINE: ${P.length} problem(s)` : 'W-PERF2-OFFLINE: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
