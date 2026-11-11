// v0.91 reset with two saves (a phone and a laptop): the device and the online save differ when the app opens.
// A: the device holds the old v0.90 save, the online save was already reset on another device and played on (newer): the newer one
//    loads (no "Two saves found" window, savedAt decides), nothing resets again, no second refund.
// B: the online save is the old one and the device holds a newer old save: the device's loads and resets once.
// C: neither has savedAt: the "Two saves found" window; picking the device's old save resets it once, the other is kept as backup_choice.
//   BASE=<v0.91 build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wunlock_twodev.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
const CLOUD = 'qbsbx:data/users/sandbox/state', LOCAL = 'quest-board';
const seed = JSON.parse(fs.readFileSync(process.env.SEED || SEEDS + 'v90_mid.json', 'utf8'));
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const sum = (s) => s ? { coins: Math.floor(s.coins), rooms: (s.base.slots || []).filter(Boolean).map((r) => r.t + '(' + Object.keys(r.a || {}).length + ')').join(' '), reset91: s.reset91 ? { refund: s.reset91.refund, fresh: s.reset91.fresh || 0, at: s.reset91.at } : null, savedAt: s.savedAt } : null;
async function open(br, ls, pick) {
  const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(ls)})`);
  await pg.go(BASE + '/'); let dialog = null;
  for (let k = 0; k < 120; k++) { await sleep(500);
    const st = await pg.ev('(function(){var m=document.querySelector(".qbsv");if(m)return {dialog:m.innerText.replace(/\\s+/g," ")};var x=window.__qb&&window.__qb.x&&window.__qb.x();return x&&x.S&&x.S.created&&document.querySelector(".nav button[data-v=board]")?{ready:1}:null})()');
    if (st && st.dialog && !dialog) { dialog = st.dialog; if (pick) await pg.ev(`(function(){var b=document.querySelector('.qbsv [data-pick=${pick}]');b&&b.click();return !!b})()`); }
    if (st && st.ready) break; }
  await sleep(4500);
  const S = await pg.ev('JSON.parse(JSON.stringify(window.__qb.x().S))');
  const keys = await pg.ev(`(function(){return Object.keys(localStorage).filter(function(k){return /backup/.test(k)}).map(function(k){var v=JSON.parse(localStorage.getItem(k)||'null');return k+': '+(v?Math.floor(v.coins)+' coins, '+((v.base&&v.base.slots)||[]).filter(Boolean).length+' rooms, reset91 '+(v.reset91?'yes':'no'):'null')})})()`);
  return { pg, S, dialog, keys };
}
(async () => {
  const br = await browser();
  // the save after the reset on device 1, then played on: bought 3 Bedroom upgrades
  let p = await open(br, seed);
  await p.pg.ev(`(function(){var x=window.__qb.x(),S=x.S,b=S.base.slots[0],n=0;(x.ADDONS.bedroom||[]).forEach(function(a){if(n<3&&!(a[3]||{}).opens&&!b.a[a[0]]&&S.coins>=a[2]){b.a[a[0]]=1;S.coins-=a[2];S.spent+=a[2];n++}});x.persist();return n})()`); await sleep(1500);
  const after = await p.pg.ev(`(function(){return {c:localStorage.getItem('${CLOUD}'),l:localStorage.getItem('${LOCAL}')}})()`); await p.pg.close();
  const post = JSON.parse(after.c), old = JSON.parse(seed[LOCAL]);
  log('device 1 after the reset and 3 purchases:', sum(post));
  // A
  let ls = Object.assign({}, seed); ls[CLOUD] = after.c; ls[LOCAL] = seed[LOCAL];
  p = await open(br, ls); log('A. device old (savedAt', old.savedAt + '), online reset + played (savedAt', post.savedAt + '):', 'dialog', p.dialog ? p.dialog.slice(0, 80) : 'none', '| loaded', sum(p.S));
  log('   same as online save:', Math.floor(p.S.coins) === Math.floor(post.coins) && JSON.stringify(p.S.reset91) === JSON.stringify(post.reset91), '| errors', p.pg.errs.length); await p.pg.close();
  // B
  const newer = JSON.parse(seed[LOCAL]); newer.savedAt = Date.now() - 60000; newer.coins += 777; ls = Object.assign({}, seed); ls[LOCAL] = JSON.stringify(newer);
  p = await open(br, ls); log('B. online old, device old but newer (+777 coins):', 'dialog', p.dialog ? p.dialog.slice(0, 80) : 'none', '| loaded', sum(p.S), '| errors', p.pg.errs.length); await p.pg.close();
  // C
  const a = JSON.parse(seed[LOCAL]), c = JSON.parse(after.c); delete a.savedAt; delete c.savedAt; a.coins += 5; ls = Object.assign({}, seed); ls[LOCAL] = JSON.stringify(a); ls[CLOUD] = JSON.stringify(c);
  p = await open(br, ls, 'local'); log('C. no savedAt, pick "This device" (the old save):', 'dialog', p.dialog ? p.dialog.slice(0, 160) : 'none', '| loaded', sum(p.S), '| backups', p.keys, '| errors', p.pg.errs.length); await p.pg.close();
  p = await open(br, ls, 'cloud'); log('C2. the same, pick "Online save" (already reset):', 'loaded', sum(p.S), '| errors', p.pg.errs.length); await p.pg.close();
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
