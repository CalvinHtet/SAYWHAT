// KODE PINK "Night drive" in the Shop (Cal 11-13: "Make it more city pop but actually cool and more sleek"; approved 11-18; ROOMS 52dda64;
// text shots/pending_art/kodepink/final/shop_text.md, copied below): on the plain build (PORT) against the last release (REF):
//  - every floor 11-10 .. 11-22 is as in the last release (lifting the hold moves no drop that already happened)
//  - KODE PINK never drops before Mon 11-23 and does drop on the Street within 16 weeks after
//  - all 15 rows have the new names and lines, same ids, slots and prices as the last release; its tab, on a day it is live, lists all 15
//  - no page errors
//   PORT=<plain build> REF=<last release build> NODE_PATH=<playwright's parent> node rigtest/lead/kprows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), ref = 'http://127.0.0.1:' + (process.env.REF || 8839);
const TEXT = {
  gx_kp_bucket: ["Neon Stripe Bucket", "Black bucket hat, a pink-to-coral neon band."],
  gx_kp_phones: ["Chrome Night Headphones", "Black and chrome, cups lit pink."],
  gx_kp_clips: ["Neon Tube Clips", "Two glowing pink-to-coral tube clips."],
  gx_kp_bag: ["Patent Mini Crossbody", "Black patent, push-lock, chrome chain strap."],
  gx_kp_pendant: ["Chrome Crescent Pendant", "A mirror-chrome moon on a fine silver chain."],
  gx_kp_varsity: ["Midnight Varsity", "Black body, navy sleeves, sunset-stripe trims."],
  gx_kp_sailor: ["Night Palm Shirt", "Navy camp-collar shirt, coral palm print."],
  gx_kp_hoodie: ["Sunset Stripe Hoodie", "Black hoodie, a pink-to-coral stripe down each sleeve."],
  gx_kp_bomber: ["Gloss Leather Bomber", "Black glossy leather, silver zip, ribbed hem."],
  gx_kp_track: ["Sunset Track Pants", "Black, one pink-to-coral side stripe, cropped."],
  gx_kp_skirt: ["Navy Pleated Skirt", "Deep navy knife pleats, a silver-buckle belt."],
  gx_kp_cargo: ["Charcoal Wide-Leg Cargo", "Charcoal wide legs, deep side pockets."],
  gx_kp_runner: ["Chrome Night Runners", "Black mesh, silver-blue chrome panels."],
  gx_kp_loafer: ["Patent Penny Loafers", "Glossy navy patent, white socks."],
  gx_kp_slipon: ["Navy Canvas Slip-Ons", "Navy canvas, white rubber soles."] };
const page = async (b, url) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
  await p.goto(url + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
const live = (p, from, n) => p.evaluate(([from, n]) => { const o = []; for (let d = 0; d < n; d++) { const t = new Date(2026, 10, from + d, 10, 0).getTime(), r = {};
  for (const fl of ['street', 'boutique', 'atelier']) { const f = window.__qbDrops.floor(fl, t); r[fl] = ((f && f.live) || []).map((q) => q.id).sort().join(','); } o.push(r); } return o; }, [from, n]);
const rows = (p) => p.evaluate(() => window.__qb.x().SHOP.filter((it) => it[6] && it[6].b === 'kp').map((it) => [it[0], it[1], it[2], it[3], it[5]]));
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const P = await page(b, base), R = await page(b, ref);
  const a = await live(P, 10, 13), r = await live(R, 10, 13);
  ok(JSON.stringify(a) === JSON.stringify(r), 'every floor 11-10 .. 11-22 is as in the last release ' + JSON.stringify(a.map((o) => o.street)));
  const f = await live(P, 10, 13 + 112), first = f.findIndex((o) => o.street.split(',').includes('kp')), on = new Date(2026, 10, 10 + first).toDateString();
  ok(first >= 13, 'KODE PINK first live on the Street on ' + on + ' (not before Mon 11-23)');
  const rp = await rows(P), rr = await rows(R);
  ok(rp.length === 15 && rp.every((x) => TEXT[x[0]] && x[2] === TEXT[x[0]][0] && x[4] === TEXT[x[0]][1]), 'all 15 have the new names and lines ' + JSON.stringify(rp.filter((x) => !TEXT[x[0]] || x[2] !== TEXT[x[0]][0] || x[4] !== TEXT[x[0]][1]).map((x) => x[0])));
  ok(rp.every((x, i) => rr[i] && rr[i][0] === x[0] && rr[i][1] === x[1] && rr[i][3] === x[3]), 'same ids, slots and prices as the last release');
  const tab = await P.evaluate(async (day) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, day, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.xp = x.cum(12); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render();
    const clear = () => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="shop"]').click(); for (let i = 0; i < 4; i++) { await new Promise((o) => setTimeout(o, 900)); clear(); }
    const t = document.querySelector('[data-act="stab"][data-v="kp"]'); if (!t) return null; t.click(); await new Promise((o) => setTimeout(o, 900)); clear(); return [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.dataset.card); }, 10 + first);
  ok(tab && tab.length === 15, 'its tab lists all 15 on ' + on + ' ' + (tab ? tab.length : 'no tab'));
  ok(!P.errs.length && !R.errs.length, 'no page errors ' + JSON.stringify(P.errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
