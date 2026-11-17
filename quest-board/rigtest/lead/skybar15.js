// Lock and Key's +15 (ROOMS fff49a2 + c1c8c12, QA PASS 19c1cba / 6b254cd), priced by LEAD (2026-11-17), plain build against a v1.12
// reference build: 28 upgrades on sale; the 15 new ones priced in the room's own tiers (1,100 / 2,250 / 4,450); the old ones within 3%
// of v1.12; a full room earns bizDay (360), a room of the old 13 earns at least its v1.12 day (250), an empty one within 5% of v1.12; and
// the rooms after it open at the same counts as in v1.12: the Rooftop at 7 of Lock and Key's upgrades, Boba at 10 (not 14 and 21).
//   BASE=<build> REF=<v1.12 build> NODE_PATH=<playwright's parent> node rigtest/lead/skybar15.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const BASE = process.env.BASE || 'http://127.0.0.1:8838', REF = process.env.REF || 'http://127.0.0.1:8839';
const OLD = ['sb_stool', 'sb_high1', 'sb_side', 'sb_high2', 'sb_bar', 'sb_bottles', 'sb_tender', 'sb_sofa', 'sb_oyster', 'sb_humidor', 'sb_stage', 'sb_band', 'sb_roof', 'sb_piano', 'sb_trolley', 'sb_chester'];
const NEW = ['sb_keys', 'sb_mirror', 'sb_neon', 'sb_rug', 'sb_stool2', 'sb_back2', 'sb_tower', 'sb_malt', 'sb_stage2', 'sb_hi3', 'sb_lamps', 'sb_spots', 'sb_singer', 'sb_pianist', 'sb_server'];
(async () => { const b = await chromium.launch(); const get = async (u) => { const p = await (await b.newContext()).newPage(); await p.goto(u + '/dist/index.html');
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbEcon && window.__qbStory, null, { timeout: 90000 }); await p.waitForTimeout(800);
    const o = await p.evaluate((OLD) => { const x = window.__qb.x(), E = window.__qbEcon.ECON, T = x.ROOMT.skybar, A = x.ADDONS.skybar, live = A.filter((a) => !(a[3] && a[3].retired)), sold = live.filter((a) => !(a[3] && a[3].opens));
      const day = (L) => Math.round((T.coin || 0) * (1 + L.reduce((s, a) => s + (+(a[3] || {}).p || 0), 0)) * ((T.store || 8) + L.reduce((s, a) => s + (+(a[3] || {}).cap || 0), 0)));
      return { n: sold.length, price: Object.fromEntries(A.map((a) => [a[0], a[2]])), full: day(live), old: day(live.filter((a) => OLD.indexOf(a[0]) >= 0)), none: day([]), biz: E.bizDay.skybar,
        order: sold.map((a) => a[0]) }; }, OLD);
    /* the gates, in the game: a player with the Restaurant at Noir and Lock and Key holding k of its upgrades (in list order) */
    o.gate = {}; for (const k of [6, 7, 9, 10]) o.gate[k] = await p.evaluate(([k, order]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(60); S.calm = false;
      S.base.slots = ['bedroom', 'closet', 'gameroom', 'patio', 'garden', 'restaurant', 'skybar'].map((t) => ({ t, a: t === 'skybar' ? Object.fromEntries(order.slice(0, k).map((id) => [id, 1])) : Object.fromEntries((x.ADDONS[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 }));
      const st = window.__qbStory, g = (room) => { const s = st.steps.filter((q) => q.room === room)[0]; return s && s.gate ? !!s.gate() : null; }; return { rooftop: g('rooftop'), boba: g('boba') }; }  /* each story room's gate is its unlock (29b_story.js) */, [k, o.order]);
    await p.context().close(); return o; };
  const N = await get(BASE), R = await get(REF);
  ok(N.n === 28 && R.n === 13, `28 upgrades on sale (v1.12: ${R.n}): ${N.n}`);
  const tiers = [1100, 2250, 4450]; const odd = NEW.filter((id) => !(id in N.price) || tiers.indexOf(N.price[id]) < 0);
  ok(!odd.length, 'the 15 new ones sit in the room\'s tiers ' + JSON.stringify(NEW.map((id) => id + ' ' + N.price[id])));
  const moved = OLD.filter((id) => Math.abs(N.price[id] - R.price[id]) > R.price[id] * .03); ok(!moved.length, 'the old ones within 3% of v1.12 ' + JSON.stringify(moved.map((id) => id + ' ' + R.price[id] + '->' + N.price[id])));
  ok(N.full === N.biz && N.biz === 360, `a full Lock and Key earns its bizDay: ${N.full} a day (v1.12 ${R.full})`);
  ok(N.old >= R.old, `a Lock and Key of the old 13 earns at least what it did: ${R.old} -> ${N.old}`);
  ok(Math.abs(N.none - R.none) <= R.none * .05, `an empty one about the same: ${R.none} -> ${N.none}`);
  ok(R.gate[6].rooftop === N.gate[6].rooftop && R.gate[7].rooftop === N.gate[7].rooftop && !N.gate[6].rooftop && N.gate[7].rooftop, 'the Rooftop opens at 7 of Lock and Key\'s upgrades, as in v1.12 ' + JSON.stringify({ now: [N.gate[6].rooftop, N.gate[7].rooftop], v112: [R.gate[6].rooftop, R.gate[7].rooftop] }));
  ok(!N.gate[9].boba && N.gate[10].boba && R.gate[10].boba === N.gate[10].boba, 'Boba opens at 10, as in v1.12 ' + JSON.stringify({ now: [N.gate[9].boba, N.gate[10].boba], v112: [R.gate[9].boba, R.gate[10].boba] }));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
