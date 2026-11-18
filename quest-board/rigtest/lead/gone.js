// Cal, 2026-11-17 (via ROOMS): "Get rid of all durags and anything that could be misinterpreted as cultural appropriation ..." The 14
// pieces in 29zz_v117.js on the plain build: not on OVERPASS's Shop tab (the rest of its new pieces are); an owner wearing two of them
// gets each one's price back once, they come off the character and out of what is owned, and a reload pays nothing more; SMOKE BOMB is
// v1.19 (Cal: "The ninja ones are cool."): only the durag and bandana stay gone; SMOKE BOMB's pieces stay with their owners and drop
// again; a save v1.18 refunded gets them back with the refund taken back (not below 0 coins), once; no page errors. (Its subtitle and Pip's look are checked by eye.)
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/gone.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
const GONE = ['gx_o_durag', 'gx_o_bandana'];  /* v1.19: SMOKE BOMB's 12 are back (Cal: "The ninja ones are cool.") */
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  const load = async () => { await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    await p.evaluate(() => setInterval(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()), 300)); };
  await load();
  // an owner wearing the durag and the hakama; the prices they paid are today's
  const own = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, 18, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 };
    S.owned = { gx_o_durag: true, gx_smk_hakama: true, gx_o_5panel: true }; S.eq = { a_hat: 'gx_o_durag', a_pants: 'gx_smk_hakama' }; S.goneRef = {}; S.coins = 1000; window.__qbRooms.open('closet', 1); x.render();
    const pr = (id) => (x.SHOP.find((q) => q[0] === id) || [])[3]; return { durag: pr('gx_o_durag'), hakama: pr('gx_smk_hakama'), persist: (x.persist && x.persist(), 1) }; });
  await p.waitForTimeout(6500);
  const after = await p.evaluate(() => { const S = window.__qb.x().S; return { coins: S.coins, owned: Object.keys(S.owned), eq: S.eq, ref: S.goneRef, txt: document.body.innerText.match(/Retired[^\n]*/) && document.body.innerText.match(/Retired[^\n]*/)[0] }; });
  ok(after.coins === 1000 + own.durag && !after.owned.includes('gx_o_durag') && after.owned.includes('gx_smk_hakama') && after.owned.includes('gx_o_5panel') && !after.eq.a_hat && after.eq.a_pants === 'gx_smk_hakama',
    `an owner gets the durag's ${own.durag} back and it comes off; the hakama stays on (v1.19) and the cap stays ` + JSON.stringify(after));
  await p.evaluate(() => { const x = window.__qb.x(); try { x.persist && x.persist(); } catch (e) {} });
  await p.waitForTimeout(6000);
  const again = await p.evaluate(() => window.__qb.x().S.coins); ok(again === after.coins, `no second refund: ${after.coins} -> ${again}`);
  // the Shop: OVERPASS without them, with its other new pieces
  const shop = await p.evaluate(async () => { document.querySelector('.nav button[data-v="shop"]').click(); await new Promise((o) => setTimeout(o, 2500)); window.__qb.x().render(); await new Promise((o) => setTimeout(o, 800));
    const t = document.querySelector('[data-act="stab"][data-v="over"]'); if (!t) return { none: 1 }; t.click(); await new Promise((o) => setTimeout(o, 900)); return { txt: document.getElementById('app').innerText }; });
  ok(!shop.none && !/Satin Durag|Paisley Bandana/.test(shop.txt) && /Five-Panel Skate Cap/.test(shop.txt) && /Reflective Bucket/.test(shop.txt), 'OVERPASS\'s tab: no durag or bandana, its other pieces still there');
  // SMOKE BOMB: no Street drop for 120 days; its subtitle
  const smk = await p.evaluate(() => { const live = []; for (let d = 0; d < 120; d++) { const t = new Date(2026, 10, 18 + d, 10, 0).getTime(); const f = window.__qbDrops.floor('street', t); if (f && (f.live || []).some((q) => q.id === 'smk')) live.push(d); }
    const B = (window.__qb.x().BRANDS || []).find((q) => q.id === 'smk'); return { live, sub: B && B.sub }; });
  ok(smk.live.length > 0, 'v1.19: SMOKE BOMB drops on the Street again within 120 days (no hold) ' + JSON.stringify(smk.live.slice(0, 3)));
  /* its "techwear" subtitle: BRANDS is not on the test hook, so QA checks it on screen */
  // a save refunded by v1.18: the hakama comes back to its Wardrobe and the refund goes back (never below 0), once
  const back = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.owned = { gx_o_5panel: true }; S.eq = {}; S.goneRef = { gx_o_durag: 140, gx_smk_hakama: 340, gx_smk_tabi: 350 }; S.coins = 500;
    await new Promise((o) => setTimeout(o, 6000)); const a = { coins: S.coins, owned: Object.keys(S.owned).filter((k) => /^gx_/.test(k)).sort(), ref: Object.keys(S.goneRef) }; await new Promise((o) => setTimeout(o, 5500)); return { a, coins2: S.coins }; });
  ok(back.a.owned.join() === 'gx_o_5panel,gx_smk_hakama,gx_smk_tabi' && back.a.coins === 0 && back.a.ref.join() === 'gx_o_durag' && back.coins2 === 0,
    'a v1.18-refunded owner gets the ninja pieces back, the refund taken back down to 0 coins, the durag still refunded, once ' + JSON.stringify(back));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
