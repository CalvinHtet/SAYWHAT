// QA: Pet Shop drops over 26 drop slots (wolf owner) plus edge cases: level gate, coin gates, dog clothes with no dogs.
const pw = require('playwright'); const base = process.env.BASE; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const gone = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.overlay').forEach((m) => m.remove()));
  const setup = (o) => p.evaluate((o) => { const x = window.__qb.x(), S = x.S; const A = x.ADDONS || {}; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(o.lvl); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.coins = o.coins; S.pet = o.pet ? { k: o.pet, t: 1 } : null; S.petw = {}; S.dogw = {}; S.owned = S.owned || {};
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries((A.bedroom || []).map((a) => a[0]).filter((k) => o.dogs || (k !== 'bd_pluto' && k !== 'bd_chop')).map((k) => [k, 1])), st: 0, pend: 0 }]; window.__qbRooms.open('closet', 1); x.render(); }, o);
  const pets = async () => { await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); for (let i = 0; i < 2; i++) { await p.waitForTimeout(700); await gone(); }
    const fl = await p.evaluate(() => { const f = document.querySelector('[data-qsfl="boutique"]'); if (f) f.click(); return f ? (f.disabled || f.classList.contains('locked') || f.getAttribute('aria-disabled')) : 'none'; }); await p.waitForTimeout(600); await gone();
    const t = await p.evaluate(() => { const t = document.querySelector('[data-act="stab"][data-v="pets"]'); if (t) t.click(); return !!t; }); await p.waitForTimeout(900); await gone(); return { fl, t }; };
  const drop = () => p.evaluate(() => { const secs = [...document.querySelectorAll('.qs-sec')]; const d = secs.find((s) => /This drop/.test((s.querySelector('h3') || {}).textContent || '')); return d ? [...d.querySelectorAll('[data-card^=pc_]')].map((e) => e.dataset.card.slice(3)) : []; });
  // drops over 26 slots: shift time to each Mon/Thu 10:00 from 11-23
  await setup({ lvl: 35, coins: 20000, pet: 'wolf', dogs: 1 }); await pets(); const seq = [];
  for (let k = 0; k < 26; k++) { const d = new Date(2026, 10, 23); let n = 0; while (true) { const wd = d.getDay(); if (wd === 1 || wd === 4) { if (n === k) break; n++; } d.setDate(d.getDate() + 1); } d.setHours(10);
    await p.evaluate((t) => { const real = Date.now() - (window.__qbShift || 0); window.__qbShift = t - real; window.__qb.x().render(); }, d.getTime()); await p.waitForTimeout(300); seq.push([d.toDateString().slice(0, 10), await drop()]); }
  const C = await p.evaluate(() => QBDATA.pet_clothes); const line = (id) => C[id].pet;
  ok(seq.every((s) => s[1].length === 4 && s[1].filter((i) => line(i) === 'wolf').length === 2 && s[1].filter((i) => line(i) === 'dogs').length === 2), 'every drop: 2 wolf + 2 dog pieces (26 slots)');
  let rep = 0; for (let i = 1; i < seq.length; i++) rep += seq[i][1].filter((x) => seq[i - 1][1].includes(x)).length; ok(rep === 0, 'no piece in two drops running (' + rep + ')');
  const wolfSet = new Set(seq.slice(0, 6).flatMap((s) => s[1].filter((i) => line(i) === 'wolf'))); ok(wolfSet.size === 12, 'the wolf line shows all 12 in 6 drops (' + wolfSet.size + ')');
  const dogIds = Object.keys(C).filter((i) => C[i].pet === 'dogs'); const dogSeen = new Set(seq.flatMap((s) => s[1].filter((i) => line(i) === 'dogs')));
  console.log('     dog pieces in data', dogIds.length, '; seen in 26 drops', dogSeen.size, [...dogSeen].sort().join(','));
  console.log('     first drops:', seq.slice(0, 7).map((s) => s[0] + ' ' + s[1].join('/')).join(' | '));
  await p.evaluate(() => { window.__qbShift = 0; });
  // level gate
  await setup({ lvl: 20, coins: 20000, pet: null, dogs: 1 }); const g = await pets(); ok(!g.t, 'level 20 (Boutique locked): no Pets tab (floor ' + g.fl + ', tab ' + g.t + ')');
  // coins below the price
  await setup({ lvl: 35, coins: 2000, pet: null, dogs: 1 }); await pets(); const lo = await p.evaluate(() => [...document.querySelectorAll('.pz-pet button')].map((b) => b.textContent + (b.disabled ? '[off]' : '')).join(' | ')); ok(/need 1,000 more/.test(lo) && !/Adopt ·/.test(lo), 'with 2,000 coins adopting is blocked: ' + lo);
  await setup({ lvl: 35, coins: 2000, pet: 'slime', dogs: 1 }); await pets(); await p.evaluate(() => { const a = document.querySelector('[data-act="pzadopt"]'); if (a) a.click(); }); await p.waitForTimeout(700);
  const gu = await p.evaluate(() => { const m = document.querySelector('.pz-cry'); return m ? [...m.querySelectorAll('button')].map((b) => b.textContent + (b.disabled ? '[off]' : '')).join(' | ') : 'no modal'; }); ok(/Need 1,000 more/.test(gu), 'giving up with 2,000 coins is blocked: ' + gu); await gone();
  // dog clothes with no dogs
  await setup({ lvl: 35, coins: 20000, pet: null, dogs: 0 }); await pets(); const nd = await p.evaluate(() => [...document.querySelectorAll('[data-card^=pc_pd_] button')].map((b) => b.textContent + (b.disabled ? '[off]' : '')).join(' | '));
  console.log('     no dogs owned, dog piece buttons:', nd);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 2))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
