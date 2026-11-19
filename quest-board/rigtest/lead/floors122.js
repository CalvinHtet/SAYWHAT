// v1.22 (Cal, 2026-11-18): SØLVBERG's hold lifted ("I like altitude and solvberg. Redo everything else."), Monday and Thursday drops on every floor from Thu 11-19 (Wednesday vault unchanged), CHROME RAIN held,
// OVERPASS's chain and skate tool off sale, NICE COCK's drop on Thu 11-19 (was Fri 11-20), and Basics becomes the Stylist (hair, dye, eyes; the plain clothes off sale,
// owners keep). On the plain build (PORT) against the last release (REF):
//  - every floor's live brands at 10 am each day 11-10 .. 11-18 are the same as the last release (nothing that already dropped moves)
//  - Thu 11-19: NICE COCK is live on the Street; Fri 11-20 the Street is as on Thursday; from 11-19 over 16 weeks the Street and the
//    Boutique change only on Mondays and Thursdays; CHROME RAIN drops on the Street, never on the Boutique; the Boutique has only its own
//  - CHROME RAIN's pieces cost inside the Street's band (110-450)
//  - the Shop's line says Mondays and Thursdays; the Stylist tab sells only haircuts, dyes and eye colours; no plain basic tee, jogger or
//    shoe is offered anywhere to a non-owner; an owner's basic tee is still in their Wardrobe; a new player's creator clothes are theirs
//  - no page errors
//   PORT=<plain build> REF=<last release build> NODE_PATH=<playwright's parent> node rigtest/lead/floors122.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), ref = 'http://127.0.0.1:' + (process.env.REF || 8839);
const sched = (from, n) => { const out = []; for (let d = 0; d < n; d++) out.push([2026, 10, from + d]); return out; };
const at = (url) => async (b) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
  await p.goto(url + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
const live = (p, days) => p.evaluate((days) => days.map(([y, m, d]) => { const t = new Date(y, m, d, 10, 0).getTime(), o = {};
  for (const fl of ['street', 'boutique', 'atelier']) { const f = window.__qbDrops.floor(fl, t); o[fl] = ((f && f.live) || []).map((q) => q.id).sort().join(','); } return o; }), days);
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const P = await at(base)(b), R = await at(ref)(b);
  const past = sched(10, 9), a = await live(P, past), r = await live(R, past);
  ok(JSON.stringify(a) === JSON.stringify(r), 'every floor 11-10 .. 11-18 is as in the last release ' + JSON.stringify(a.map((o) => o.street)));
  const days = []; for (let d = 0; d < 112; d++) days.push([2026, 10, 19 + d]); const f = await live(P, days);
  const wd = (i) => new Date(2026, 10, 19 + i).getDay();
  ok(f[0].street.split(',').includes('nc'), 'Thu 11-19: NICE COCK live on the Street ' + f[0].street);
  ok(f[1].street === f[0].street, 'Fri 11-20: no drop, the Street as on Thursday ' + f[1].street);
  const changes = { street: [], boutique: [] }; for (let i = 1; i < f.length; i++) for (const fl of ['street', 'boutique']) if (f[i][fl] !== f[i - 1][fl]) changes[fl].push(wd(i));
  ok(changes.street.length > 10 && changes.street.every((w) => w === 1 || w === 4), 'the Street changes only on Mondays and Thursdays: ' + changes.street.length + ' changes, weekdays ' + [...new Set(changes.street)].join(','));
  ok(changes.boutique.every((w) => w === 1 || w === 4), 'the Boutique changes only on Mondays and Thursdays (' + changes.boutique.length + ' changes)');
  ok(!f.some((o) => (o.street + ',' + o.boutique).split(',').includes('cr')), 'CHROME RAIN never drops from 11-19 (Cal: "Not a fan of chrome rain")');
  ok(f.some((o) => o.street.split(',').includes('sv')) && f.some((o) => o.street.split(',').includes('alt')), 'SØLVBERG and ALTITUDE drop on the Street (Cal: "I like altitude and solvberg")');
  ok(!f.some((o) => /\b(gp|sp|bb|km|oak)\b/.test(o.street + ',' + o.boutique)), 'GACHA POP, SAVE POINT, BARD & BLADE, KAIMANA and OAKMONT never drop while held for their redo');
  ok(f.every((o) => o.boutique.split(',').every((id) => !id || ['rose', 'sm', 'gd', 'oc', 'rg'].includes(id))), 'the Boutique shows only VENOM ROSE, SAYMØRE, (v1.25) GILDED, (v1.26) OIL & CANVAS and (v1.27) REGIMENT ' + [...new Set(f.map((o) => o.boutique))].join(' | '));
  /* (itemFits is not on the test hook: what is offered is read from the Shop's own cards below) */
  // the Shop: the line, the Stylist, basics off sale, owners keep, a new player's originals
  const shop = await P.evaluate(async () => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, 19, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 };
    S.owned = { bs_tee_black: true }; S.eq = {}; window.__qbRooms.open('closet', 1); x.render();
    const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove());
    document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 4; i++) { await new Promise((o) => setTimeout(o, 1000)); clear(); } x.render(); await new Promise((o) => setTimeout(o, 500));
    const app = () => document.getElementById('app').innerText, tabs = [...document.querySelectorAll('[data-act="stab"]')].map((t) => t.dataset.v + ':' + t.innerText.trim());
    const line = /Mon and Thu|Mondays and Thursdays/.test(app()), fri = /Fri/.test(app());
    document.querySelector('[data-act="stab"][data-v="basics"]').click(); await new Promise((o) => setTimeout(o, 800)); clear();
    const ids = [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card), sty = { ids: [...new Set(ids)], txt: app().slice(0, 400) };
    const cards = async (v) => { const t = document.querySelector('[data-act="stab"][data-v="' + v + '"]'); if (!t) return null; t.click(); await new Promise((o) => setTimeout(o, 800)); clear(); return [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card); };
    const all = []; for (const v of tabs.map((t) => t.split(':')[0]).filter((v) => v !== 'wardrobe' && v !== 'basics')) all.push(...((await cards(v)) || []));
    const over1 = await cards('over'); S.owned.gx_o_lock = true; x.render(); await new Promise((o) => setTimeout(o, 300)); const over2 = await cards('over'); delete S.owned.gx_o_lock;
    const offered = all.concat(sty.ids).filter((i) => /^bs_(tee|hoodie|bomber|joggers|jeans|shorts|sneakers|boots|flipflops)_/.test(i));
    const ov = { tool: over1.includes('gx_o_tool') || over2.includes('gx_o_tool'), lockNon: over1.includes('gx_o_lock'), lockOwner: over2.includes('gx_o_lock'), tags: over1.includes('gx_o_tags'), n: over1.length };
    document.querySelector('[data-act="stab"][data-v="wardrobe"]').click(); await new Promise((o) => setTimeout(o, 800)); clear();
    const ward = [...document.querySelectorAll('[data-id]')].map((e) => e.dataset.id);
    return { tabs, line, fri, sty, offered, ov, ward: ward.filter((i) => /^bs_/.test(i)) }; });
  ok(shop.line && !shop.fri, 'the Shop says Mondays and Thursdays, no Friday ' + JSON.stringify({ line: shop.line, fri: shop.fri }));
  ok(shop.tabs.includes('basics:Stylist') && !shop.tabs.some((t) => /Basics/.test(t)), 'a Stylist tab, no Basics tab ' + JSON.stringify(shop.tabs));
  ok(shop.sty.ids.length === 14 && shop.sty.ids.every((i) => /^bs_(hair|dye|eye)_/.test(i)), `the Stylist sells only haircuts, dyes and eye colours: ${shop.sty.ids.length} ` + JSON.stringify(shop.sty.ids.slice(0, 6)));
  ok(!shop.offered.length, 'no plain basic clothes on any Shop tab ' + JSON.stringify(shop.offered.slice(0, 5)));
  ok(!shop.ov.tool && !shop.ov.lockNon && shop.ov.lockOwner && shop.ov.tags, 'OVERPASS: no skate tool; the padlock chain only for its owner; the dog tags on sale ' + JSON.stringify(shop.ov));
  // Mon 11-23, VENOM ROSE and SAYMØRE live on the Boutique: Cal's seven VENOM ROSE pieces and the GO OFF Tee off sale
  // each Boutique brand on a day it is live (from v1.25 GILDED takes a turn, so they are not always live together)
  const tabOn = (br) => P.evaluate(async (br) => { const x = window.__qb.x(), S = x.S; let day = null;
      for (let d = 0; d < 120 && !day; d++) { const t = new Date(2026, 10, 19 + d, 10, 0).getTime(), f = window.__qbDrops.floor('boutique', t); if (f && (f.live || []).some((q) => q.id === br)) day = t; }
      const real = Date.now() - (window.__qbShift || 0); window.__qbShift = (day || Date.now()) - real; S.owned = {}; x.render();
      const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); await new Promise((o) => setTimeout(o, 800)); clear();
      const fl = document.querySelector('[data-qsfl="boutique"]'); if (fl) { fl.click(); await new Promise((o) => setTimeout(o, 900)); clear(); }
      const t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); if (!t) return { day: day && new Date(day).toDateString(), cards: [] }; t.click(); await new Promise((o) => setTimeout(o, 800)); clear();
      return { day: day && new Date(day).toDateString(), cards: [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card) }; }, br);
  const rose = await tabOn('rose'), sm = await tabOn('sm'), roseCut = ['gx_v_cap', 'gx_v_leather', 'gx_v_tulle', 'gx_v_shade', 'gx_v_rose', 'gx_v_mesh', 'gx_v_biker'].filter((i) => rose.cards.includes(i));
  ok(rose.cards.length === 30 && !roseCut.length, `VENOM ROSE (${rose.day}): 30 on sale (23, then Cal 11-18 replacements: 6 new, the harness removed, and the tiptoe stilettos), none of the seven Cal removed ` + JSON.stringify({ n: rose.cards.length, roseCut }));
  ok(sm.cards.length === 15 && !sm.cards.includes('gx_sm_tee'), `SAYMØRE (${sm.day}): 15 on sale (14 and the grille bomber), no GO OFF Tee ` + sm.cards.length);
  ok(shop.ward.includes('bs_tee_black'), 'an owner\'s basic tee is still in their Wardrobe ' + JSON.stringify(shop.ward));
  const fresh = await P.evaluate(() => { const x = window.__qb.x(), S = x.S; S.owned = {}; S.eq = {}; S.char = window.__qb.fixChar({ name: 'New', sex: 'f' }); x.qsGrantOriginals ? x.qsGrantOriginals() : null; x.render(); return Object.keys(S.owned).filter((k) => /^bs_/.test(k)); });
  ok(fresh.filter((k) => /^bs_(tee|hoodie|bomber|joggers|jeans|shorts|sneakers|boots|flipflops)_/.test(k)).length >= 3, 'a new player owns their creator top, bottom and shoes ' + JSON.stringify(fresh));
  ok(!P.errs.length && !R.errs.length, 'no page errors ' + JSON.stringify(P.errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
