// QA: are the retired Patio dog beds really off sale and not drawn? Reads the pt_dbed rows as the app holds them, the Patio's
// upgrade list in its room modal, and the images drawn in the Patio, for an owner of both beds and for a new owner.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1300, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const rows = await p.evaluate(() => { const A = window.__qb.x().ADDONS.patio || []; return A.filter((a) => /^pt_dbed/.test(a[0])).map((a) => JSON.stringify(a.map((v) => (typeof v === 'object' && v ? Object.keys(v).join('+') : v)))); });
  console.log('rows as held:', rows.join(' || '));
  for (const own of [1, 0]) {
    const info = await p.evaluate(() => { const A = window.__qb.x().ADDONS || {}; return { bd: (A.bedroom || []).map((a) => a[0]), pt: (A.patio || []).map((a) => a[0]) }; });
    await p.evaluate(([info, own]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.coins = 20000; S.pet = { k: 'wyvern', t: 1 };
      const pt = Object.fromEntries(info.pt.filter((k) => own || !/^pt_dbed/.test(k)).map((k) => [k, 1]));
      S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(info.bd.filter((k) => k !== 'bd_game').map((k) => [k, 1])), st: 0, pend: 0 }, { t: 'patio', a: pt, st: 0, pend: 0 }]; window.__qbRooms.open('closet', 1); x.render(); }, [info, own]);
    await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); window.__qb.roomModal(1); }); await p.waitForTimeout(5000);
    const r = await p.evaluate(() => { const hrefs = [...document.querySelectorAll('image')].map((im) => im.getAttribute('href') || ''); const txt = (document.querySelector('.modal') || document.body).textContent;
      return { dogbedImgs: hrefs.filter((h) => /hmx_dogbed/.test(h)).length, objImgs: hrefs.filter((h) => /object/.test(h)).length, petBed: hrefs.filter((h) => /pbed_/.test(h)).length, listsBed: /Patio Dog Bed/.test(txt) }; });
    console.log((own ? 'owner of both beds' : 'new owner') + ':', JSON.stringify(r));
    const el = await p.$('#rbigw'); await (el || p).screenshot({ path: OUT + '_own' + own + '.png' });
    // the room's upgrade list (the shop rows inside the room modal), scrolled
    const list = await p.evaluate(() => [...document.querySelectorAll('.modal [data-id], .modal .up-name, .modal h4')].map((e) => e.textContent.trim()).filter((t) => /Dog Bed/.test(t)));
    console.log('   dog bed rows shown in the room modal:', JSON.stringify(list));
    await p.evaluate(() => document.querySelectorAll('.modal').forEach((m) => m.remove())); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 3))); await b.close(); })();
