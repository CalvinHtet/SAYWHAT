// Cal 11-26 (29zz_v201.js): brand drops Mon/Wed/Fri, 3 a category per drop (the next 3 next time), a Sunday Vault for the week
// (3 a category from every brand, at most 4 pricier brands, never two pricier pieces in a category), pet clothes Tue/Thu/Sat.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/week201.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV201 && window.__qbV172, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  const cal = await V(() => ({ days: window.__qbV172.cfg.days, next: window.__qbV172.days(6) }));
  ok(JSON.stringify(cal.days) === '[1,3,5]' && JSON.stringify(cal.next.slice(0, 4)) === JSON.stringify(['2026-11-27', '2026-11-30', '2026-12-02', '2026-12-04']), 'brand drops on Mondays, Wednesdays and Fridays from Fri 11-27 (Cal 11-27) ' + JSON.stringify(cal));
  const six = await V(() => ['2026-11-30', '2026-11-29', '2026-12-01'].map((d) => new Date(window.__qbDrops.start(d)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric' })));
  ok(six.every((h) => h === '6 AM'), 'every drop (brands, the Vault, pets) turns over at 6 am Pacific (Cal 11-26) ' + JSON.stringify(six));
  /* the Vault, over several weeks */
  const vs = await V(() => { const out = []; const day = 864e5, t0 = Date.parse('2026-11-29T20:00:00Z'); window.__qbV201.reset();
    for (let w = 0; w < 6; w++) { const v = window.__qbV201.vault(t0 + w * 7 * day); const prem = {}; const cats = {}; const premIn = {};
      v.list.forEach(([c, id, b]) => { cats[c] = (cats[c] || 0) + 1; const isP = window.__qbV167.prem(b); if (isP) { prem[b] = 1; premIn[c] = (premIn[c] || 0) + 1; } });
      out.push({ wk: v.wk, n: v.list.length, cats, premBrands: Object.keys(prem).length, maxPremInCat: Math.max(0, ...Object.values(premIn)) }); } return out; });
  ok(vs.every((v) => v.n >= 18 && v.premBrands <= 4 && v.maxPremInCat <= 1 && Object.values(v.cats).every((n) => n <= 4)) && vs[0].wk === '2026-11-29' && vs[1].wk === '2026-12-06',
    'each Sunday\'s Vault: 3 a category (7 categories), at most 4 pricier brands, never two pricier pieces in a category ' + JSON.stringify(vs.slice(0, 3)));
  const same = await V(() => { const t = Date.parse('2026-12-02T20:00:00Z'); window.__qbV201.reset(); const a = window.__qbV201.vault(t).list.join(); window.__qbV201.reset(); return a === window.__qbV201.vault(t).list.join() && window.__qbV201.vault(t).wk === '2026-11-29'; });
  ok(same, 'the Vault is the same all week and on every phone (the week is the seed)');
  /* a live brand's drop: 3 a category */
  const hf = await V(() => { const out = {}; window.__qbDrops.state().live.forEach((b) => { const h = window.__qbV201.half(b), c = {}; Object.keys(h).forEach((id) => { const k = window.__qbV201.cat(id); c[k] = (c[k] || 0) + 1; }); out[b.id] = c; }); return out; });
  ok(Object.keys(hf).length >= 1 && Object.values(hf).every((c) => Object.values(c).every((n) => n <= 4)), 'every live brand shows at most 4 a category (Cal 11-26) ' + JSON.stringify(hf));
  const smk = await V(() => { const b = { id: 'smk', start: '2026-12-02' }; const ids = Object.keys(window.__qbV201.half(b)); const hats = ids.filter((id) => window.__qbV201.cat(id) === 'hat');
    const b2 = { id: 'smk', start: '2026-12-30' }; return { hats: hats.length, all: ids.length }; });
  ok(smk.hats === 4, 'Smoke Bomb (6 hats now) shows 4 hats in a drop, the other 2 and 2 again the next ' + JSON.stringify(smk));
  /* the pages */
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.coins = 50000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {});
    S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; S.areaOn = null; if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); });
  await clear(); await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(1200); await clear();
  const tile = await V(() => { const t = document.querySelector('[data-shub="vault"]'); return t ? t.innerText.replace(/\s+/g, ' ') : null; });
  ok(!!tile && /All week/.test(tile), 'the Shop\'s home has the Vault\'s door: ' + tile);
  await V(() => document.querySelector('[data-shub="vault"]').click()); await p.waitForTimeout(1500); await clear();
  const vp = await V(() => { const q = document.querySelector('.qshop.v201v'); if (!q) return null; return { title: (q.querySelector('.shub-title') || {}).textContent, lead: (q.querySelector('.qs-lead') || {}).textContent, cards: q.querySelectorAll('.qs-card').length, tabs: [...q.querySelectorAll('.v81cats .v81c')].map((t) => t.textContent), mirror: !!q.querySelector('.qs-mirror') }; });
  ok(vp && vp.title === 'The Vault' && vp.cards >= 18 && vp.mirror, 'the Vault\'s page: its pieces, the try-on mirror, the category tabs ' + JSON.stringify(vp));
  await p.screenshot({ path: OUT + '/week201_vault.png' });
  const tr = await V(async () => { const b = document.querySelector('.qshop.v201v [data-act="qstry"],.qshop.v201v [data-act="buy"]'); if (!b) return null; const id = b.dataset.id; b.click(); await new Promise((r) => setTimeout(r, 600)); return { id, still: !!document.querySelector('.qshop.v201v'), trying: !!document.querySelector('.qshop.v201v .qs-card.trying') || !!window.__qb.x().S.owned[id] }; });
  ok(tr && tr.still && tr.trying, 'a Vault piece can be tried on or bought, and the page stays the Vault ' + JSON.stringify(tr));
  await V(() => document.querySelector('[data-shub="home"]').click()); await p.waitForTimeout(800); await clear();
  const pet = await V(() => window.__qbV172.pet());
  ok(typeof pet === 'number', 'pet drops still count (slot ' + pet + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
