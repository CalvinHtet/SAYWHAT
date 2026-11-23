// Cal 11-23: "Adopt pluto (... Calvin's dog). Adopt Chopstick (... Sydney's dog). Then purchase dog beds for the dogs." The Bedroom's
// window offers (everything else in the room bought, so the dogs are next) Pluto first, then Chopstick, then Pluto's bed, then Chopstick's; the dogs nap on the floor until their beds come.
//   PORT=<build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/dogorder.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const st = (own) => p.evaluate((own) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(10); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.coins = 99999; S.areaOn = { board: 1, shop: 1, hideout: 1, hall: 1, players: 1 };
    const i = S.base.slots.findIndex((r) => r && r.t === 'bedroom'), r = S.base.slots[i]; r.a = {}; x.ADDONS.bedroom.forEach((a) => { if (!(a[3] && a[3].g === 'Dogs')) r.a[a[0]] = 1; }); own.forEach((k) => r.a[k] = 1); x.render();
    const A = x.ADDONS.bedroom, dogs = A.filter((a) => a[3] && a[3].g === 'Dogs').map((a) => a[0]);
    window.__qb.roomModal(i); const m = document.querySelector('#layer .modal:last-child') || document.body;
    const buy = [...m.querySelectorAll('.addon.next')].filter((d) => !d.classList.contains('mystery')).map((d) => (d.querySelector('b') || {}).textContent);
    const txt = {}; A.filter((a) => a[3] && a[3].g === 'Dogs').forEach((a) => txt[a[0]] = a[1] + ': ' + a[4]);
    document.querySelectorAll('#layer .modal').forEach((q) => q.remove()); return { dogs, buy, txt }; }, own);
  let s = await st([]); console.log(JSON.stringify(s.txt));
  ok(s.dogs.join() === 'bd_pluto,bd_chop,bd_dbed1,bd_dbed2', 'the Dogs group in order ' + s.dogs.join());
  ok(/Calvin's dog/.test(s.txt.bd_pluto) && /Sydney's dog/.test(s.txt.bd_chop), 'Pluto is Calvin\'s, Chopstick Sydney\'s');
  const dogBuy = (s) => s.buy.filter((n) => /Pluto|Chopstick/.test(n));
  ok(dogBuy(s).join() === 'Adopt Pluto', 'nothing bought: only Adopt Pluto on offer ' + JSON.stringify(dogBuy(s)));
  s = await st(['bd_pluto']); ok(dogBuy(s).join() === 'Adopt Chopstick', 'with Pluto: Adopt Chopstick ' + JSON.stringify(dogBuy(s)));
  s = await st(['bd_pluto', 'bd_chop']); ok(dogBuy(s).join() === "Pluto's Bed", "with both: Pluto's Bed " + JSON.stringify(dogBuy(s)));
  s = await st(['bd_pluto', 'bd_chop', 'bd_dbed1']); ok(dogBuy(s).join() === "Chopstick's Bed", "then Chopstick's Bed " + JSON.stringify(dogBuy(s)));
  for (const [own, nm] of [[['bd_pluto', 'bd_chop'], 'nobeds'], [['bd_pluto', 'bd_chop', 'bd_dbed1', 'bd_dbed2'], 'beds']]) {
    await st(own); await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]') && document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500);
    await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.overlay').forEach((m) => m.remove()); const g = document.querySelector('[data-act="bldgo"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000);
    await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.overlay').forEach((m) => m.remove()));
    const d = await p.evaluate(() => { const L = window.__qbLoft(); return Object.values(L.A || {}).filter((a) => a && a.role === 'dog').map((a) => a.dname); }).catch(() => null);
    ok(d && d.includes('pluto') && d.includes('chopstick'), nm + ': both dogs in the Loft ' + JSON.stringify(d));
    await p.screenshot({ path: OUT + '/dogs_' + nm + '.png' }); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
