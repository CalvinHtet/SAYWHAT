// A room grown by 15 (Cal, 2026-11-17: "Add 15 more upgrades to everything else"), on the plain build against the last release's build:
// 15 more upgrades on sale; each new price inside the old pieces' price range; the old ones no dearer and at most 10% cheaper; a full room earns its bizDay; a room
// holding only the old pieces earns at least what it did; an empty one within 5%; and every room it gates opens at the same number of its
// upgrades as before (through each story step's gate()). The rules are in docs/ECONOMY.md, "Rooms growing by 15".
//   ROOM=boba BASE=<build> REF=<last release build> NODE_PATH=<playwright's parent> node rigtest/lead/roomplus.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const ROOM = process.env.ROOM || 'boba', BASE = process.env.BASE || 'http://127.0.0.1:8838', REF = process.env.REF || 'http://127.0.0.1:8839';
(async () => { const b = await chromium.launch(); let OLD = null;
  const get = async (u) => { const p = await (await b.newContext()).newPage(); await p.goto(u + '/dist/index.html');
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbEcon && window.__qbStory, null, { timeout: 90000 }); await p.waitForTimeout(800);
    const o = await p.evaluate(([ROOM, OLD]) => { const x = window.__qb.x(), E = window.__qbEcon.ECON, T = x.ROOMT[ROOM], A = x.ADDONS[ROOM], live = A.filter((a) => !(a[3] && a[3].retired)),
        sold = live.filter((a) => !(a[3] && (a[3].opens || a[3].trophy))), old = OLD || sold.map((a) => a[0]);
      const day = (L) => Math.round((T.coin || 0) * (1 + L.reduce((s, a) => s + (+(a[3] || {}).p || 0), 0)) * ((T.store || 8) + L.reduce((s, a) => s + (+(a[3] || {}).cap || 0), 0)));
      const gates = Object.keys(E.unlock).filter((t) => E.unlock[t].at === ROOM);
      return { n: sold.length, ids: sold.map((a) => a[0]), price: Object.fromEntries(A.map((a) => [a[0], a[2]])), full: day(live), old: day(live.filter((a) => old.indexOf(a[0]) >= 0 || (a[3] && a[3].opens))),
        none: day([]), biz: E.bizDay[ROOM], gates, order: sold.map((a) => a[0]) }; }, [ROOM, OLD]);
    /* where each gated room opens: the smallest k (upgrades bought in list order) whose story gate says yes */
    o.openAt = {}; for (const g of o.gates) { o.openAt[g] = null; for (let k = 0; k <= o.n; k++) {
      const yes = await p.evaluate(([ROOM, g, k, order]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(80); S.calm = false;
        const pre = ['bedroom', 'closet', 'gameroom', 'patio', 'garden', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'mall'], upto = pre.indexOf(ROOM) >= 0 ? pre.slice(0, pre.indexOf(ROOM) + 1) : pre.concat([ROOM]);
        S.base.slots = upto.map((t) => ({ t, a: t === ROOM ? Object.fromEntries(order.slice(0, k).map((id) => [id, 1])) : Object.fromEntries((x.ADDONS[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 }));
        const s = window.__qbStory.steps.filter((q) => q.room === g)[0]; return s && s.gate ? !!s.gate() : null; }, [ROOM, g, k, o.order]);
      if (yes) { o.openAt[g] = k; break; } } }
    await p.context().close(); return o; };
  const R = await get(REF); OLD = R.ids; const N = await get(BASE);
  ok(N.n === R.n + 15, `${ROOM}: ${N.n} upgrades on sale (was ${R.n})`);
  const newIds = N.ids.filter((id) => OLD.indexOf(id) < 0), lo = Math.min(...OLD.map((id) => R.price[id])), hi = Math.max(...OLD.map((id) => R.price[id]));
  const out = newIds.filter((id) => !(N.price[id] >= lo && N.price[id] <= hi)); ok(newIds.length === 15 && !out.length, `the 15 new ones priced inside the old range ${lo}-${hi} ` + JSON.stringify(newIds.map((id) => id + ' ' + N.price[id])));
  /* the price ramp spans more pieces, so old ones may come down a little (as in the Restaurant cut); never up */
  const moved = OLD.filter((id) => N.price[id] > R.price[id] * 1.03 || N.price[id] < R.price[id] * .9); ok(!moved.length, 'the old ones no dearer, at most 10% cheaper ' + JSON.stringify(moved.map((id) => id + ' ' + R.price[id] + '->' + N.price[id])));
  ok(N.full === N.biz, `a full ${ROOM} earns its bizDay: ${N.full} a day (was ${R.full})`);
  ok(N.old >= R.old, `a ${ROOM} of the old pieces earns at least what it did: ${R.old} -> ${N.old}`);
  ok(Math.abs(N.none - R.none) <= R.none * .05, `an empty one about the same: ${R.none} -> ${N.none}`);
  for (const g of R.gates) ok(N.openAt[g] === R.openAt[g] && R.openAt[g] != null, `${g} opens at ${N.openAt[g]} of ${ROOM}'s upgrades (was ${R.openAt[g]})`);
  console.log('total price', OLD.reduce((s, id) => s + R.price[id], 0), '->', N.ids.reduce((s, id) => s + N.price[id], 0), '| payback days', Math.round(OLD.reduce((s, id) => s + R.price[id], 0) / R.full), '->', Math.round(N.ids.reduce((s, id) => s + N.price[id], 0) / N.full));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
