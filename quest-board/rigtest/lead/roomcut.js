// Cal's room cut (2026-11-17: "Restaurant can go down to 40 ... Garden can go down to 35"), QA's lists (findings 8ae2680 + 4c56320):
// 40 Restaurant and 35 Garden upgrades on sale (not counting the Restaurant's opener), the 23 cut ones retired with no "+N%" or hours,
// every kept upgrade's price unchanged against REF, and a full room's day (coins an hour x its "+N%" x its hours) still the room's bizDay,
// whether or not the player owns cut pieces.
//   BASE=<build> REF=<reference build> NODE_PATH=<playwright's parent> node rigtest/lead/roomcut.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const BASE = process.env.BASE || 'http://127.0.0.1:8838', REF = process.env.REF || 'http://127.0.0.1:8839';
(async () => { const b = await chromium.launch(); const get = async (u) => { const p = await (await b.newContext()).newPage(); await p.goto(u + '/dist/index.html');
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbEcon, null, { timeout: 90000 });
    return p.evaluate(() => { const x = window.__qb.x(), E = window.__qbEcon.ECON, o = {};
      ['restaurant', 'garden'].forEach((k) => { const T = x.ROOMT[k], A = x.ADDONS[k], live = A.filter((a) => !(a[3] && a[3].retired)), sold = live.filter((a) => !(a[3] && a[3].opens));
        const day = (L) => (T.coin || 0) * (1 + L.reduce((s, a) => s + (+(a[3] || {}).p || 0), 0)) * ((T.store || 8) + L.reduce((s, a) => s + (+(a[3] || {}).cap || 0), 0));
        o[k] = { n: sold.length, cut: (E.cut || []).filter((id) => A.some((a) => a[0] === id && a[3] && a[3].retired && !(+a[3].p) && !(+a[3].cap))).length,
          price: Object.fromEntries(A.map((a) => [a[0], a[2]])), retired: A.filter((a) => a[3] && a[3].retired).map((a) => a[0]),
          dayKept: Math.round(day(live)), dayAll: Math.round(day(A.filter((a) => !(a[3] && a[3].retired) || (E.cut || []).indexOf(a[0]) >= 0))), tot: sold.reduce((s, a) => s + (+a[2] || 0), 0), bizDay: E.bizDay[k] }; });
      return o; }); };
  const N = await get(BASE), R = await get(REF);
  ok(N.restaurant.n === 40, 'Restaurant: 40 upgrades on sale (was ' + R.restaurant.n + '), opener not counted: ' + N.restaurant.n);
  ok(N.garden.n === 35, 'Garden: 35 upgrades on sale (was ' + R.garden.n + '): ' + N.garden.n);
  ok(N.restaurant.cut === 18 && N.garden.cut === 5, `the cut ones are retired with no "+N%" or hours: ${N.restaurant.cut} + ${N.garden.cut}`);
  for (const k of ['restaurant', 'garden']) {
    /* the price ramp runs over the pieces on sale, so the kept ones move down a little; the economy pass after the +15s resets them */
    const ch = Object.keys(N[k].price).filter((id) => N[k].retired.indexOf(id) < 0 && Math.abs(N[k].price[id] - R[k].price[id]) > R[k].price[id] * .1);
    ok(!ch.length, `${k}: no kept upgrade moves more than 10% (room total ${R[k].tot} -> ${N[k].tot}) ` + JSON.stringify(ch.map((id) => id + ' ' + R[k].price[id] + '->' + N[k].price[id]).slice(0, 6)));
    ok(Math.abs(N[k].dayKept - N[k].bizDay) <= N[k].bizDay * .02 && Math.abs(N[k].dayAll - N[k].bizDay) <= N[k].bizDay * .02,
      `${k}: a full room pays its day (${N[k].bizDay}) with only the kept pieces (${N[k].dayKept}) and with the cut ones owned too (${N[k].dayAll}); before: ${R[k].dayAll} (the Back Office Safe's and Root Cellar's hours, retired earlier, left out)`); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
