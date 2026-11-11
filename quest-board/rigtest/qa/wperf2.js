// w-perf2 (v0.92, W1b): the room pictures (blobs.js, 14 MB of base64) became 657 art/bl_*.webp files fetched when a room draws.
// Proof that nothing went missing: one player with every room and every upgrade (made in the page: level 90, __qbRooms.unlockAll, every
// live upgrade installed; an old seed would lose its rooms to the v0.91 reset) on two builds (BASES=<before>,<after>);
// in the street, each building view and each room window, every picture element (svg <image>, <img>, CSS url()) is listed and loaded
// (people walking about are left out: they come and go); the before build shows the room pictures as blob: URLs made from its base64,
// the after build as art/bl_*.webp files (20_loft.js lfSprUrl / lfSp4Url use a file URL as it is);
// the counts must match between the builds and nothing may fail. Then on the after build: offline (the service worker's copy): a room
// seen before draws all its pictures, a room never opened draws without them and no page error; one picture file failing (blocked)
// leaves only that picture out.
//   BASES=http://127.0.0.1:8818,http://127.0.0.1:8817 CHROME_PORT=9374 OUT=<dir/> bash tools/windows/node.sh rigtest/qa/wperf2.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASES = (process.env.BASES || 'http://127.0.0.1:8818,http://127.0.0.1:8817').split(','), OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wperf2/';
fs.mkdirSync(OUT, { recursive: true });
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const clear = '(function(){document.querySelectorAll("#layer .modal,.dropsplash,.bsplash").forEach(function(m){m.remove()});return 1})()';
// every picture the page shows now (in the given root), loaded one by one: {n elements, u unique urls, bl (art/bl_ files), failed}
const PICS = (root) => `(async function(){var R=document.querySelector('${root}')||document;var urls=[];
  var who=function(e){return e.closest('[id^="lfa-"],.pv-tag')};[].forEach.call(R.querySelectorAll('image'),function(e){if(who(e))return;var h=e.getAttribute('href')||e.getAttribute('xlink:href');if(h)urls.push(h)});
  [].forEach.call(R.querySelectorAll('img'),function(e){var h=e.getAttribute('src');if(h)urls.push(h)});
  [].forEach.call(R.querySelectorAll('[style*="url("]'),function(e){var m=(e.getAttribute('style')||'').match(/url\\(["']?([^"')]+)/g);(m||[]).forEach(function(x){urls.push(x.replace(/^url\\(["']?/,''))})});
  var uniq=urls.filter(function(u,i){return urls.indexOf(u)===i}),failed=[];
  await Promise.all(uniq.map(function(u){return new Promise(function(r){var i=new Image();var t=setTimeout(function(){failed.push('timeout '+u.slice(0,60));r()},20000);i.onload=function(){clearTimeout(t);r()};i.onerror=function(){clearTimeout(t);failed.push(u.slice(0,80));r()};i.src=u})}));
  return {n:urls.length,u:uniq.length,bl:uniq.filter(function(u){return /bl_\\d+/.test(u)}).length,data:uniq.filter(function(u){return u.indexOf('data:')===0}).length,failed:failed.slice(0,4),nFailed:failed.length}})()`;
const open = async (pg, base, fresh = true) => {
  await pg.go(base + '/'); await pg.wait('!!(window.__qb && window.__qbRooms && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  if (fresh) { await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fey',sex:'f'});S.welcomed=1;S.xp=x.cum(90);var g,n=0;S.gates=S.gates||[];while((g=x.gated())!==null&&n++<120)S.gates.push(g);
      window.__qbRooms.unlockAll();S.base.slots.forEach(function(r){if(!r)return;r.a=r.a||{};(x.ADDONS[r.t]||[]).forEach(function(a){var e=a[3]||{};if(!e.retired)r.a[a[0]]=1})});S.coins=1e6;S.reset91={refund:0,fresh:1,at:Date.now()};x.persist();return S.base.slots.filter(Boolean).length})()`);
    await pg.go(base + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))', 120000); await sleep(3000); }
  await pg.ev(clear);
};
// the views: the street, every building, every room window
const views = async (pg, tag, only) => {
  const out = {}; await pg.ev(clear);
  await pg.ev('(function(){var b=document.querySelector(".nav button[data-v=hideout]");b&&b.click();return 1})()'); await sleep(2500); await pg.ev(clear);
  await pg.ev('(function(){var o=document.querySelector("[data-act=bldout]");if(o)o.dispatchEvent(new MouseEvent("click",{bubbles:true}));return 1})()'); await sleep(2000); await pg.ev(clear);
  if (!only) out.street = await pg.ev(PICS('#app'));
  const bl = await pg.ev('[].map.call(document.querySelectorAll("[data-act=bldgo]"),function(e){return e.dataset.v})');
  for (const b of bl) { if (only && !only.includes('b' + b)) continue;
    await pg.ev('(function(){var o=document.querySelector("[data-act=bldout]");if(o)o.dispatchEvent(new MouseEvent("click",{bubbles:true}));return 1})()'); await sleep(900);
    await pg.ev(`(function(){var e=document.querySelector('[data-act=bldgo][data-v="${b}"]');if(e)e.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 1})()`); await sleep(3000); await pg.ev(clear);
    out['b' + b] = await pg.ev(PICS('#app')); }
  const slots = await pg.ev('window.__qb.x().S.base.slots.map(function(r,i){return r?r.t+"#"+i:null}).filter(Boolean)');
  for (const s of slots) { const [t, i] = s.split('#'); if (only && !only.includes(t)) continue;
    await pg.ev(clear); await pg.ev(`(function(){window.__qb.roomModal(${i});return 1})()`); await sleep(1800);
    out[t] = await pg.ev(PICS('#layer .rmodal')); }
  await pg.ev(clear); return out;
};
(async () => {
  const br = await browser(); const R = {};
  for (const base of BASES) { const pg = await br.page({ fresh: true }); await open(pg, base); R[base] = await views(pg, base); R[base].errs = pg.errs.slice(0, 3); R[base].nErrs = pg.errs.length; await pg.close(); }
  const [A, B] = BASES; const keys = Object.keys(R[A]).filter((k) => !/errs/i.test(k));
  let same = 0, diff = [];
  keys.forEach((k) => { const a = R[A][k], b = R[B][k] || {}; if (a.n === b.n && a.u === b.u) same++; else diff.push(`${k}: ${a.n}/${a.u} -> ${b.n}/${b.u}`); });
  const failA = keys.reduce((s, k) => s + (R[A][k].nFailed || 0), 0), failB = keys.reduce((s, k) => s + ((R[B][k] || {}).nFailed || 0), 0);
  const blB = keys.reduce((s, k) => s + ((R[B][k] || {}).bl || 0), 0), blA = keys.reduce((s, k) => s + (R[A][k].bl || 0), 0);
  console.log('   per view (elements/unique urls, before -> after):'); keys.forEach((k) => console.log(`   ${k.padEnd(12)} ${R[A][k].n}/${R[A][k].u} -> ${(R[B][k] || {}).n}/${(R[B][k] || {}).u}  (after: ${(R[B][k] || {}).bl} bl_ files, ${(R[B][k] || {}).data} data urls)`));
  ok(!diff.length, `the same pictures in ${same} of ${keys.length} views (street, buildings, every room window)${diff.length ? ': ' + diff.join('; ') : ''}`);
  ok(!failA && !failB && blB > 50 && blA === 0, `every picture loads: failures before ${failA}, after ${failB}; bl_ files loaded after ${blB} (before: all inline)`);
  ok(!R[A].nErrs && !R[B].nErrs, `page errors: before ${R[A].nErrs}, after ${R[B].nErrs} ${JSON.stringify(R[B].errs)}`);
  // offline on the after build: the service worker's copy
  const pg = await br.page({ fresh: true }); await open(pg, B);
  await pg.ev('navigator.serviceWorker.ready.then(function(){return 1})'); await sleep(1500);
  await pg.go(B + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  const ctl = await pg.ev('!!(navigator.serviceWorker&&navigator.serviceWorker.controller)');
  const slots = await pg.ev('window.__qb.x().S.base.slots.map(function(r,i){return r?r.t:null}).filter(Boolean)');
  const seenRooms = slots.slice(0, 3), unseen = slots.slice(-2);
  await views(pg, 'online', seenRooms.concat(['b0']));
  const cached = await pg.ev('caches.open("qb-files").then(function(k){return k.keys()}).then(function(r){return {all:r.length,bl:r.filter(function(q){return /bl_\\d+/.test(q.url)}).length}})');
  await pg.s('Network.enable', {}); await pg.s('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  const e0 = pg.errs.length; let offOk = true;
  try { await pg.go(B + '/'); await pg.wait('!!(window.__qb && document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))', 60000); await sleep(2500); } catch (e) { offOk = false; }
  const off = offOk ? await views(pg, 'offline', seenRooms.concat(unseen, ['b0'])) : {};
  ok(ctl && offOk, `offline: the service worker (controller ${ctl}) opens the game with the network off; its copy holds ${cached.all} files, ${cached.bl} of them room pictures`);
  seenRooms.forEach((t) => ok(off[t] && off[t].nFailed === 0 && off[t].u > 0, `offline, a room opened before (${t}): ${off[t] && off[t].u} pictures, ${off[t] && off[t].nFailed} missing`));
  unseen.forEach((t) => console.log(`   offline, a room never opened (${t}): ${off[t] && off[t].u} pictures, ${off[t] && off[t].nFailed} missing ${JSON.stringify(off[t] && off[t].failed.slice(0, 2))}`));
  const offErr = pg.errs.slice(e0).filter((e) => !/net::|Failed to load resource|ERR_INTERNET_DISCONNECTED|firebase|fetch/i.test(e));
  ok(!offErr.length, `offline: no page errors besides network ones (${offErr.length}) ${JSON.stringify(offErr.slice(0, 2))}`);
  await pg.s('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }); await pg.close();
  // one picture file that fails: the room draws without it, nothing else breaks
  const p3 = await br.page({ fresh: true }); await p3.s('Network.enable', {});
  await open(p3, B); const room = slots.find((t) => t === 'restaurant') || slots[1];
  const urls = await p3.ev(`(async function(){var S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${room}'});window.__qb.roomModal(i);await new Promise(function(r){setTimeout(r,2000)});var u=[].map.call(document.querySelectorAll('#layer .rmodal image'),function(e){return e.getAttribute('href')||''}).filter(function(h){return /bl_\\d+/.test(h)});document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});return u})()`);
  const block = (urls[0] || '').replace(/\?.*$/, '').replace(/^.*\//, '');
  await p3.s('Network.setBlockedURLs', { urls: ['*' + block + '*'] }); await p3.s('Network.setCacheDisabled', { cacheDisabled: true });
  const p3b = await br.page({ fresh: true }); await p3b.s('Network.enable', {}); await p3b.s('Network.setBlockedURLs', { urls: ['*' + block + '*'] });
  await open(p3b, B); const one = await views(p3b, 'blocked', [room]);
  ok(block && one[room] && one[room].nFailed === 1 && one[room].u > 1 && !p3b.errs.filter((e) => !/net::|Failed to load resource/i.test(e)).length, `one picture blocked (${block}) in the ${room}: ${one[room] && one[room].nFailed} missing of ${one[room] && one[room].u}, no page error`);
  await p3b.shot(OUT + 'blocked_room.png');
  console.log(P.length ? `W-PERF2: ${P.length} problem(s)` : 'W-PERF2: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
