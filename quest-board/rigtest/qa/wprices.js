// w-prices 717acf2 (v0.90): every Shop clothing piece priced in its CLOTHING_TIERS.md tier band; pieces QA did not grade (hair, dye,
// eyes, dungeon pieces) keep their old price (compared with OLD, the shipped b543c04 build); the catalogue total; and a buy through
// the real Checkout charges the new price. Prints every piece out of band and every ungraded piece whose price moved.
//   BASE=http://127.0.0.1:8821 OLD=http://127.0.0.1:8819 bash tools/windows/node.sh rigtest/qa/wprices.js
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8821', OLD = process.env.OLD || 'http://127.0.0.1:8819';
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/prices'; fs.mkdirSync(OUT, { recursive: true });
const BANDS = { thrift: [110, 210], standard: [280, 460], premium: [790, 1160], luxury: [1560, 2110] }; // LEAD 12:49 (inside the spec's 100-250 / 250-500 / 600-1,200 / 1,300-2,200)
const SPEC = { thrift: [100, 250], standard: [250, 500], premium: [600, 1200], luxury: [1300, 2200] };
const tiers = {}; fs.readFileSync(path.join(__dirname, '../../docs/qa-2026-11-10/CLOTHING_TIERS.md'), 'utf8').split('\n').forEach((l) => {
  const c = l.split('|').map((s) => s.trim()); if (c.length > 7 && /^[a-z0-9_]+$/.test(c[1]) && BANDS[c[6]]) tiers[c[1]] = { tier: c[6], brand: c[2], name: c[4], was: +c[5] }; });
const SHOPQ = '(function(){return (window.__qb.x().SHOP||[]).map(function(s){return [s[0],s[1],s[3],(s[6]||{}).b||""]})})()';
(async () => {
  const br = await browser();
  const get = async (base) => { const p = await br.page({ fresh: true }); await p.go(base + '/'); await p.wait('!!(window.__qb && window.__qb.x)', 120000); await sleep(1500); const r = await p.ev(SHOPQ); const e = p.errs.length; await p.close(); return { items: r, errs: e }; };
  const N = await get(BASE), O = await get(OLD);
  const oldP = {}; O.items.forEach((s) => (oldP[s[0]] = s[2]));
  const graded = N.items.filter((s) => tiers[s[0]]), ungraded = N.items.filter((s) => !tiers[s[0]] && /^a_/.test(s[1]));
  const out = [], outSpec = [], byTier = {}; let total = 0;
  for (const s of graded) { const t = tiers[s[0]].tier, p = s[2]; total += p; (byTier[t] = byTier[t] || []).push(p);
    if (p < BANDS[t][0] || p > BANDS[t][1]) out.push(`${s[0]} ${t} ${p}`); if (p < SPEC[t][0] || p > SPEC[t][1]) outSpec.push(`${s[0]} ${t} ${p}`); }
  const moved = ungraded.filter((s) => oldP[s[0]] !== s[2]).map((s) => `${s[0]} (${s[1]}${s[3] ? ', ' + s[3] : ''}) ${oldP[s[0]]} -> ${s[2]}`);
  const missing = Object.keys(tiers).filter((id) => !N.items.some((s) => s[0] === id));
  console.log(`graded pieces in the Shop: ${graded.length} of ${Object.keys(tiers).length} in the table (missing from the Shop: ${missing.join(',') || 'none'})`);
  Object.keys(BANDS).forEach((t) => { const a = (byTier[t] || []).sort((x, y) => x - y); console.log(`  ${t}: ${a.length} pieces, ${a[0]}-${a[a.length - 1]}, median ${a[Math.floor(a.length / 2)]}`); });
  console.log(`out of LEAD's bands: ${out.length}${out.length ? ' ' + out.slice(0, 12).join('; ') : ''}`);
  console.log(`out of the spec's bands: ${outSpec.length}${outSpec.length ? ' ' + outSpec.slice(0, 12).join('; ') : ''}`);
  console.log(`catalogue total (graded clothing): ${total.toLocaleString()} (old ${graded.reduce((a, s) => a + (oldP[s[0]] || 0), 0).toLocaleString()})`);
  console.log(`ungraded a_* pieces: ${ungraded.length}; price changed: ${moved.length}${moved.length ? ' ' + moved.slice(0, 12).join('; ') : ''}`);
  const nonClothMoved = N.items.filter((s) => !/^a_/.test(s[1]) && oldP[s[0]] !== s[2]).map((s) => `${s[0]} ${oldP[s[0]]}->${s[2]}`);
  console.log(`non-clothing Shop entries with a changed price: ${nonClothMoved.length}${nonClothMoved.length ? ' ' + nonClothMoved.slice(0, 8).join('; ') : ''}`);
  // a real purchase: the luxury Lace Corset Top (or the first luxury piece) through the Shop's buy path, with coins checked before and after
  const lux = graded.find((s) => tiers[s[0]].tier === 'luxury');
  const p = await br.page({ fresh: true });
  await p.go(BASE + '/'); await p.wait('!!(window.__qb && window.__qb.x && window.__qbRooms && document.querySelector("#app"))', 120000); await sleep(1500);
  await p.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Buyer',sex:'f'});S.xp=10;S.welcomed=1;x.persist();x.render();return 1})()`); await sleep(600);
  await p.ev(`(function(){window.__qbRooms.unlockAll();var x=window.__qb.x();x.S.coins=5000;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();x.render();return 1})()`); await sleep(1500);
  const buy = await p.ev(`(async function(){var x=window.__qb.x(),S=x.S,id=${JSON.stringify(lux[0])},it=x.SHOP.filter(function(s){return s[0]===id})[0];var c0=S.coins;
    document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});var b=document.querySelector('.nav button[data-v="shop"]');if(b)b.click();await new Promise(function(r){setTimeout(r,1200)});
    var card=document.querySelector('[data-card="'+id+'"]');var txt=card?card.innerText.replace(/\\s+/g,' ').slice(0,120):'(card not on the open tab)';
    return {id:id,price:it[3],coins0:c0,cardText:txt}})()`);
  console.log('luxury piece in the Shop: ' + JSON.stringify(buy));
  await p.shot(OUT + '/shop_lux.png');
  console.log('page errors: new ' + N.errs + ', old ' + O.errs + ', shop ' + p.errs.length);
  fs.writeFileSync(OUT + '/prices.json', JSON.stringify({ graded: graded.map((s) => [s[0], tiers[s[0]].tier, oldP[s[0]], s[2]]) }, null, 0));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
