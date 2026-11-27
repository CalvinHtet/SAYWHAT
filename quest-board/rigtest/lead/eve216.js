// Cal 11-26 evening (29zz_v216.js): Checkout with a shopping list; card posts keep the banner they were posted with; feet not clipped;
// delete asks first; no relic box until the first relic, then only what was found; the Trophy Room is the Armory; new relics wait for art.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/eve216.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV216 && window.__qbV155, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a); const w = (ms) => p.waitForTimeout(ms);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.coins = 50000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
    S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 }; S.story = S.story || {}; S.story.team = { sable: 1 }; S.dng = S.dng || {}; S.dng.npcs = {}; S.dng.runs = []; S.trophy = {};
    S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1, away: 1 };
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  /* relics */
  await V(() => document.querySelector('.nav button[data-v="away"]').click()); await w(800); await clear();
  const r0 = await V(() => ({ box: /relics found/i.test(document.querySelector('#app').innerText), q: [...document.querySelectorAll('.v210rs')].some((e) => /\? \? \?/.test(e.innerText)) }));
  await V(() => { const S = window.__qb.x().S; S.trophy = { goblin: { helm: Date.now() } }; window.__qb.x().render(); }); await w(400);
  const r1 = await V(() => { const t = document.querySelector('#app').innerText; return { box: /relics found/i.test(t), helm: /Iron Crown-Helm/.test(t), q: [...document.querySelectorAll('.v210rs')].some((e) => /\? \? \?/.test(e.innerText)), others: /Scrap-Plate|Hollow Amulet/.test(t) }; });
  ok(!r0.box && !r0.q && r1.box && r1.helm && !r1.q && !r1.others, 'no relic box before the first relic; after it, only the found piece (no "? ? ?", no other sets) ' + JSON.stringify({ r0, r1 }));
  /* the Armory */
  const ar = await V(() => { const x = window.__qb.x(); const loot = JSON.stringify(window.__qbV216.where); const tr = x.ADDONS.lair.filter((a) => a[0] === 'lr_troom')[0]; return { addon: tr && tr[1], sets: Object.keys(window.__qbV216.sets), art: window.__qbV216.art('wall', 'dragon') }; });
  ok(ar.addon === 'Stairs to the Armory' && ar.sets.length === 4 && ar.art === true, 'the Trophy Room is the Armory; four new relic sets defined, their icons in (8a4eeb1d) ' + JSON.stringify(ar));
  /* Checkout */
  await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await w(700); await clear();
  await V(() => { const s = document.querySelector('[data-shub="street"]'); if (s) s.click(); }); await w(700); await clear();
  const co = await V(async () => { const ws = (ms) => new Promise((r) => setTimeout(r, ms)); const bs = [...document.querySelectorAll('[data-act="qstry"]')]; const seen = {}; let n = 0;
    for (const b of bs) { const it = window.__qb.x().SHOP.find((x) => x[0] === b.dataset.id); if (!it || seen[it[1]]) continue; seen[it[1]] = 1; document.querySelector('[data-act="qstry"][data-id="' + it[0] + '"]').click(); await ws(250); if (++n >= 2) break; }
    const btn = document.querySelector('[data-act="qscheck"]'); const label = btn ? btn.textContent : ''; if (btn) btn.click(); await ws(300); const m = document.querySelector('#layer .v216co');
    return { n, label, rows: m ? [...m.querySelectorAll('.v216ls li')].map((li) => ({ img: !!li.querySelector('img,.qs-swatch'), nm: li.querySelector('.v216nm').textContent, pr: li.querySelector('.v216pr').textContent })) : null, tot: m ? m.querySelector('.v216tot').textContent : '', confirm: m ? !!m.querySelector('[data-act="qsconfirm"]') : false }; });
  ok(co.n === 2 && /^Checkout \(2\)$/.test(co.label.trim()) && co.rows && co.rows.length === 2 && co.rows.every((r) => r.img && r.nm && /\d/.test(r.pr)) && /Total/.test(co.tot) && co.confirm, 'Checkout lists each piece (picture, name, price), the total, and Confirm purchase ' + JSON.stringify(co));
  await p.screenshot({ path: OUT + '/eve216_checkout.png' });
  const bought = await V(async () => { const S = window.__qb.x().S, ids = [...document.querySelectorAll('#layer .v216ls .v216nm')].map((e) => e.textContent); document.querySelector('#layer [data-act="qsconfirm"]').click(); await new Promise((r) => setTimeout(r, 400)); return { owned: ids.map((n) => { const it = window.__qb.x().SHOP.find((x) => x[2] === n); return !!(it && S.owned[it[0]]); }) }; });
  ok(bought.owned.length === 2 && bought.owned.every(Boolean), 'Confirm purchase buys them ' + JSON.stringify(bought)); await clear();
  /* posts: a card post keeps its own banner; an older one keeps the first card this phone saw */
  const po = await V(() => { const h = window.__qbV155.feed([{ from: 'ME', name: 'C', t: Date.now() - 1000, snap: { bg: 'ink_peaks', pose: 'stand', lv: 12 } }, { from: 'zed', name: 'Zed', t: Date.now() - 9e7 }]); const d = document.createElement('div'); d.innerHTML = h;
    const cards = [...d.querySelectorAll('.pcard')].map((c) => (/\bpc-([a-z0-9_]+)/.exec(c.className) || [])[1] || ''); const img = d.querySelector('.pc-post img'); return { cards, mb: img ? img.getAttribute('style') : '', fz: Object.keys(window.__qbV216.freeze()) }; });
  ok(po.cards[0] === 'ink_peaks' && /margin-bottom:-\d+px/.test(po.mb), 'a card post draws the banner it was posted with, the figure lifted a little ' + JSON.stringify(po));
  /* delete asks first */
  const dl = await V(async () => { const ws = (ms) => new Promise((r) => setTimeout(r, ms)); const b = document.createElement('button'); b.setAttribute('data-act', 'sndel'); b.setAttribute('data-p', 'me|1'); b.textContent = 'delete'; document.querySelector('#app').appendChild(b); b.click(); await ws(300);
    const m = document.querySelector('#layer .v216del'); const t = m ? m.innerText.replace(/\s+/g, ' ') : null; b.remove(); return { t }; });
  ok(dl.t && /Delete this post\?/.test(dl.t) && /Keep it/.test(dl.t), 'deleting a post asks first ' + JSON.stringify(dl));
  await p.screenshot({ path: OUT + '/eve216_delete.png' }); await clear();
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
