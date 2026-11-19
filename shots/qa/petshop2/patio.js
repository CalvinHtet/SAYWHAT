// QA: the Patio fully furnished with both dogs (and a creature if PET), screenshots after the dogs settle, on a given build.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT, PET = process.env.PET || '';
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const info = await p.evaluate(() => { const A = window.__qb.x().ADDONS || {}; return { bd: (A.bedroom || []).map((a) => a[0]), pt: (A.patio || []).map((a) => a[0]) }; });
  await p.evaluate(([info, PET]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.coins = 20000; if (PET) S.pet = { k: PET, t: 1 };
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(info.bd.filter((k) => k !== 'bd_game').map((k) => [k, 1])), st: 0, pend: 0 }, { t: 'patio', a: Object.fromEntries(info.pt.map((k) => [k, 1])), st: 0, pend: 0 }]; window.__qbRooms.open('closet', 1); x.render(); }, [info, PET]);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); window.__qb.roomModal(1); });
  for (const t of [6, 14, 24]) { await p.waitForTimeout(t === 6 ? 6000 : t === 14 ? 8000 : 10000); const el = await p.$('#rbigw'); await (el || p).screenshot({ path: OUT + '_patio_' + t + 's.png' }); }
  console.log('errors', errs.length); await b.close(); })();
