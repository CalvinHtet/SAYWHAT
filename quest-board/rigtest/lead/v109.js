// v1.09, Cal's cleanup (2026-11-17), on the plain build: no coaches (Training, buffs), no Town Boss letter, 2 chat rooms, no Neighbors fold,
// no "On sale today" strip but the sale badge on the brand's cards, one Upgrades tab (beside the Wardrobe) holding upgrades and
// interface, the cluster "Outside", side quests lapse after 7 days (and show days left), the version only on the Board, and the header's
// coins, letters and class beside the frame at 360, 390 and 430 wide with nothing past the edge.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> [SHOTS=<dir>] node rigtest/lead/v109.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779), SHOTS = process.env.SHOTS || '';
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  for (const w of [360, 390, 430]) {
    const p = await (await b.newContext({ viewport: { width: w, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i);
      S.coins = 123456; S.calm = false; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {});
      S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; x.render(); });
    const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr').forEach((m) => m.remove()));
    const go = async (v) => { await clear(); await p.evaluate((v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]') || document.querySelector('[data-act="nav"][data-v="' + v + '"]'); if (e) e.click(); }, v); await p.waitForTimeout(900); await clear(); };
    const head = () => p.evaluate(() => { const st = document.querySelector('.strip'), fr = st && st.querySelector('.avbtn'), col = st && st.querySelector('.v9col'), coin = col && col.querySelector('.coinpill'), rk = col && col.querySelector('.rankpill');
      const R = (e) => e && e.getBoundingClientRect(); const f = R(fr), c = R(coin), k = R(rk);
      return { v: !!document.querySelector('.vline'), beside: !!(f && c && k && c.left >= f.right && k.left >= f.right && c.top < f.bottom && k.bottom <= f.bottom + 30), over: [...document.querySelectorAll('.strip *')].some((e) => e.getBoundingClientRect().right > innerWidth + 1), sw: document.documentElement.scrollWidth }; });
    await p.evaluate(() => { const S = window.__qb.x().S; S.char.name = 'Christopher'; window.__qb.x().render(); });
    await go('board'); let h = await head();
    const vo = await p.evaluate(() => { const v = document.querySelector('.vline'), n = document.querySelector('.strip .brand'); if (!v || !n) return { miss: 1 }; const a = v.getBoundingClientRect(), r = document.createRange(); r.selectNodeContents(n); const c = r.getBoundingClientRect();
      return { hit: !(a.right <= c.left || c.right <= a.left || a.bottom <= c.top || c.bottom <= a.top) }; });
    ok(!vo.miss && !vo.hit, `${w}: the version line clears an 11-letter name ` + JSON.stringify(vo));
    ok(h.v && h.beside && !h.over && h.sw <= w, `${w}: Board has the version; coins and class beside the frame; nothing past the edge ${JSON.stringify(h)}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/v109_board_${w}.png`, clip: { x: 0, y: 0, width: w, height: 300 } });
    for (const v of ['hall', 'players', 'train']) { await go(v); h = await head(); ok(!h.v && h.beside && !h.over, `${w}: ${v} has no version line; header beside the frame ${JSON.stringify(h)}`); }
    if (w === 390) {
      await go('train'); ok(!/Coaches/.test(await p.evaluate(() => document.getElementById('app').innerText)), 'Training: no Coaches card');
      ok(await p.evaluate(() => { try { return window.__qb.x().S && true; } catch (e) { return false; } }), '  (save readable)');
      await go('players'); const pl = await p.evaluate(() => document.getElementById('app').innerText); ok(/Town square/i.test(pl) && !/Neighbors/i.test(pl), 'Players: Town square, no Neighbors');
      await go('board'); const bt = await p.evaluate(() => document.getElementById('app').innerText); ok(!/Outside run/i.test(bt), 'Board: no "Outside run" label');
      // the Shop: no Upgrades tab before the Lair's big screen (29sy_system.js), then one beside the Wardrobe, no strip, both sections inside
      await go('shop'); ok(!(await p.$('[data-v="upgrades"],[data-v="interface"]')), 'Shop: no Upgrades tab before the Lair\'s big screen');
      await p.evaluate(() => { const S = window.__qb.x().S; const x = window.__qb.x(); S.base.slots = ['bedroom', 'closet', 'lair'].map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); window.__qb.x().render(); }); await go('board'); await go('shop'); let sh = await p.evaluate(() => ({ strip: !!document.querySelector('.qs-sale'), inNav: !!document.querySelector('.qs-tabs [data-v="upgrades"],.qs-tabs [data-v="interface"]'), bar: !!document.querySelector('.qs-bar [data-v="upgrades"]') }));
      ok(!sh.strip && !sh.inNav && sh.bar, 'Shop: no "On sale today" strip; Upgrades beside the Wardrobe, not in the brand row ' + JSON.stringify(sh));
      await p.evaluate(() => document.querySelector('.qs-bar [data-v="upgrades"]').click()); await p.waitForTimeout(700);
      const up = await p.evaluate(() => document.getElementById('app').innerText); ok(/permanent/i.test(up) && /Interface/i.test(up) && /Themes/i.test(up), 'Upgrades tab: the permanent upgrades and the Interface items');
      // the sale: its brand's tab shows the badge
      const sale = await p.evaluate(async () => { const S = window.__qb.x().S; const br = S.sale && S.sale.b; if (!br) return { none: 1 }; let t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); if (!t) { for (const fl of ['boutique', 'atelier', 'street']) { const f = document.querySelector('[data-qsfl="' + fl + '"]'); if (!f) continue; f.click(); await new Promise((o) => setTimeout(o, 500)); t = document.querySelector('[data-act="stab"][data-v="' + br + '"]'); if (t) break; } } if (!t) return { br, tab: 0 }; t.click(); await new Promise((o) => setTimeout(o, 700)); return { br, badges: document.querySelectorAll('.qs-salebadge').length }; });
      ok(sale.none || sale.badges >= 1, 'the sale brand\'s cards wear the badge ' + JSON.stringify(sale));
      // chat rooms, the boss letter, coaches' buffs, the cluster name: from the code
      // side quests: taken 8 days ago lapses; taken 2 days ago shows 5 days left
      await go('board');
      const sq = await p.evaluate(async () => { const S = window.__qb.x().S, d = (k) => { const t = new Date(Date.now() - k * 864e5); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
        S.side = { on: { mara: d(8), nova: d(2) }, done: {}, later: {}, walk: [], nw: {}, wk0: d(30) }; window.__qb.x().render(); await new Promise((o) => setTimeout(o, 600));
        const txt = document.getElementById('app').innerText; return { mara: !!S.side.on.mara, later: S.side.later.mara > Date.now(), nova: !!S.side.on.nova, left: /5 days left/.test(txt) }; });
      ok(!sq.mara && sq.later && sq.nova && sq.left, 'side quests: 8 days old lapses (asked again in a week), 2 days old shows 5 days left ' + JSON.stringify(sq));
      // QA (v1.09): a quest taken before the update counts its week from the update's first load (wk0), so 20 days old is not dropped
      const sq2 = await p.evaluate(async () => { const S = window.__qb.x().S, d = (k) => { const t = new Date(Date.now() - k * 864e5); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
        S.side = { on: { dogs: d(20) }, done: {}, later: {}, walk: [d(20), d(19)], nw: {} }; window.__qb.x().render(); await new Promise((o) => setTimeout(o, 600));
        return { on: !!S.side.on.dogs, walks: S.side.walk.length, wk0: !!S.side.wk0, left: /7 days left/.test(document.getElementById('app').innerText) }; });
      ok(sq2.on && sq2.walks === 2 && sq2.wk0 && sq2.left, 'a side quest from before the update keeps its progress and gets 7 days from now ' + JSON.stringify(sq2));
    }
    ok(!errs.length, `${w}: no page errors ` + JSON.stringify(errs.slice(0, 3)));
    await p.context().close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
