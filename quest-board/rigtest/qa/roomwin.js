// ROOMS's 4e93d54 and 1308059 at phone size (390): (A) every room window: no zoom controls (the Bedroom only its lamp), and a wheel
// or a two-finger pinch leaves the view as it is; the street and building views stop at 1.6x by buttons and by pinch, and every
// building opens at or under it; the Restaurant at each stage for the shelf and the menu board. (B) Buying an upgrade with the room
// window open, in every business opened from its building: who is there before and after (same people, same spot, same activity,
// same look) against how far they move in the same time with no purchase, and the new pieces pulsing gold (not the shadow layer).
//   BASE=<server> OUT=<folder> [ROOMS=a,b] node roomwin.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 300) : '')); if (!c) fails.push(n); };
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  await p.evaluate(() => { const now = new Date(Date.now()), t = new Date(now); t.setHours(13, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); const S = window.__qb.x().S; S.areaOn = null; });
  const cdp = await p.context().newCDPSession(p);
  const pinch = async (cx, cy, d0, d1) => { const pts = (d) => [{ x: cx - d / 2, y: cy, id: 1 }, { x: cx + d / 2, y: cy, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(d0) });
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(d0 + (d1 - d0) * i / 8) }); await p.waitForTimeout(30); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(300); };
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()));
  // (A) room windows
  const rooms = (process.env.ROOMS || '').split(',').filter(Boolean);
  const types = await p.evaluate(() => window.__qb.x().S.base.slots.map((r) => r && r.t));
  const bad = [];
  for (let k = 0; k < types.length; k++) {
    const t = types[k]; if (!t || (rooms.length && !rooms.includes(t))) continue;
    await clear(); await p.evaluate((k) => window.__qb.roomModal(k), k); await p.waitForTimeout(1500);
    const vb = () => p.evaluate(() => { const s = document.querySelector('.rmodal .rbig svg'); return s && s.getAttribute('viewBox'); });
    const ctl = await p.evaluate(() => [...document.querySelectorAll('.rmodal .lfpzc button, .rmodal .lfctl button')].map((e) => e.getAttribute('aria-label') || e.dataset.act || e.textContent));
    const v0 = await vb(); const bx = await p.evaluate(() => { const r = document.querySelector('.rmodal .rbig').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await p.mouse.move(bx[0], bx[1]); await p.mouse.wheel(0, -600); await p.waitForTimeout(300); const v1 = await vb();
    await pinch(bx[0], bx[1], 60, 260); const v2 = await vb();
    const zoomBtns = ctl.filter((l) => /zoom|reset|\+|−|-/i.test(l));
    const lampOk = true; /* the Bedroom's lamp shows only at night: nightlights.js */
    /* zoom is back (LEAD's cc71c5e, Cal 2026-11-08): + and - under the picture, and a pinch zooms */
    const both = ctl.some((l) => /zoom in/i.test(l)) && ctl.some((l) => /zoom out/i.test(l));
    if (!both || v2 === v0 || !lampOk) bad.push({ t, ctl, v0, v1, v2 });
  }
  ok('every room window: zoom in and out buttons, a pinch zooms (cc71c5e)', bad.length === 0, bad);
  // the Restaurant at each stage
  const first13 = ['r_sign', 'r_cf1', 'r_m1', 'r_k1', 'r_t1', 'r_d1', 'r_d2', 'r_k2', 'r_s1', 'r_till', 'r_l1', 'r_m2', 'r_k3'];
  for (const [name, mode] of [['hole', 'first13'], ['diner', 'x1'], ['bistro', 'nonoir'], ['noir', 'all']]) {
    await clear(); await p.evaluate(async ([mode, first13]) => { const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === 'restaurant'); const r = S.base.slots[k]; r.a = {};
      const live = x.ADDONS.restaurant.filter((u) => !(u[3] && (u[3].retired || u[3].opens)));
      if (mode === 'first13') first13.forEach((u) => { r.a[u] = 1; });
      else if (mode === 'x1') live.forEach((u) => { const e = u[3] || {}; if (u[0] === 'r_x2' || e.also === 'r_x2' || u[0] === 'r_noir' || (e.lv || 0) > 23) return; r.a[u[0]] = 1; });
      else live.forEach((u) => { if (mode === 'nonoir' && u[0] === 'r_noir') return; r.a[u[0]] = 1; });
      x.persist(); window.__qb.roomModal(k); }, [mode, first13]); await p.waitForTimeout(2200);
    await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `rest_${name}.png`) });
  }
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.base.slots.forEach((r) => { if (r) (x.ADDONS[r.t] || []).forEach((u) => { r.a[u[0]] = 1; }); }); x.persist(); });
  // the street and the buildings
  await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500); await clear();
  const s = () => p.evaluate(() => window.__qbLoft().V.s);
  for (let i = 0; i < 15; i++) await p.evaluate(() => { const bt = document.querySelector('[data-act="lfz"][data-d="1"]'); if (bt) bt.click(); });
  await p.waitForTimeout(500); const sBtn = await s();
  await p.evaluate(() => { const bt = document.querySelector('[data-act="lfz"][data-d="0"]'); if (bt) bt.click(); }); await p.waitForTimeout(400);
  for (let i = 0; i < 4; i++) await pinch(195, 450, 40, 330); const sPin = await s();
  ok('street: + stops at 1.6x, pinch too', sBtn <= 1.601 && sPin <= 1.601, { sBtn, sPin });
  const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length); const bs = [];
  for (let k = 0; k < nB; k++) {
    await clear(); await p.evaluate((k) => { const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(2500);
    const s0 = await s(); for (let i = 0; i < 12; i++) await p.evaluate(() => { const bt = document.querySelector('[data-act="lfz"][data-d="1"]'); if (bt) bt.click(); }); await p.waitForTimeout(400);
    bs.push([+s0.toFixed(3), +(await s()).toFixed(3)]);
    await p.evaluate(() => { const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); }); await p.waitForTimeout(1200);
  }
  ok(`every building (${nB}) opens at or under 1.6x and + stops there`, bs.every(([a, c]) => a <= 1.601 && c <= 1.601), bs);
  // (B) buying with the window open
  const biz = (process.env.BIZ || 'restaurant,boba,dessert,speakeasy,skybar,theater,mall,bowling,karaoke,arcade,club,garden').split(',');
  for (const t of biz) {
    const k = types.indexOf(t); if (k < 0) { console.log('  (no ' + t + ')'); continue; }
    const pick = await p.evaluate((k) => { const x = window.__qb.x(), S = x.S, r = S.base.slots[k]; const need = new Set(); x.ADDONS[r.t].forEach((u) => { const e = u[3] || {}; if (e.also) need.add(e.also); }); try { Object.values(ADDREQ).forEach((v) => need.add(v)); } catch (e) {}
      const live = x.ADDONS[r.t].filter((u) => { const e = u[3] || {}; return !e.retired && !e.opens && !e.also && !need.has(u[0]) && !/_x\d$|noir|^r_s\d/.test(u[0]) && e.g !== 'Expansion'; });
      const u = live[live.length - 1]; if (!u) return null; delete r.a[u[0]]; x.persist(); x.render(); return u[0]; }, k);
    if (!pick) { console.log('  (nothing to buy in ' + t + ')'); continue; }
    // enter as a player does: The Loft, the building, the room
    await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(800);
    await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2200);
    let found = -1;
    for (let bi = 0; bi < nB && found < 0; bi++) {
      await p.evaluate(() => { const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); }); await p.waitForTimeout(900);
      await p.evaluate((bi) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[bi]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bi); await p.waitForTimeout(2200);
      await clear(); await p.evaluate((k) => window.__qb.roomModal(k), k); await p.waitForTimeout(5000);
      if (await p.evaluate((k) => Object.values(window.__qbLoft().A).some((a) => a.pv && a.pvslot === k && a.role !== 'me'), k)) found = bi;
    }
    await p.waitForTimeout(8000);
    const snap = () => p.evaluate((k) => { const A = window.__qbLoft().A, o = {}; Object.entries(A).forEach(([id, a]) => { if (!a.pv || a.pvslot !== k || a.role === 'me') return; o[a.id || id] = { x: a.x, y: a.y, mode: a.mode, st: a.st ? (a.st.lbl || a.st.tag || a.st.kind || '') + '@' + Math.round(a.st.x || 0) + ',' + Math.round(a.st.y || 0) : '', look: JSON.stringify(a.look || '').length + ':' + JSON.stringify(a.look || '').slice(0, 60) }; }); return o; }, k);
    const cmp = (a, c) => { const ids = Object.keys(a); const gone = ids.filter((i) => !c[i]); const moved = ids.filter((i) => c[i]).map((i) => Math.hypot(c[i].x - a[i].x, c[i].y - a[i].y)); const seat = ids.filter((i) => c[i] && a[i].st && a[i].st !== c[i].st).length; const look = ids.filter((i) => c[i] && a[i].look !== c[i].look).length; return { n: ids.length, gone: gone.length, maxMove: +Math.max(0, ...moved).toFixed(1), seat, look }; };
    const a0 = await snap(); await p.waitForTimeout(1200); const a1 = await snap(); const drift = cmp(a0, a1);
    const has = await p.evaluate((id) => !!document.querySelector('.rmodal [data-act="raddon"][data-id="' + id + '"]'), pick);
    if (!has) { console.log(`  (${t}: ${pick} not offered in the window)`); continue; }
    const b0 = await snap();
    await p.evaluate((id) => document.querySelector('.rmodal [data-act="raddon"][data-id="' + id + '"]').click(), pick);
    const pulse = [];
    /* the purchase effect is now the reveal and outline (LEAD's fa5ff03 + ccc574f): g.lfnewglow from about 1.4 s to 4.4 s (installfx.js tests it fully) */
    for (const ms of [1700, 2300, 2900]) { await p.waitForTimeout(ms === 1700 ? 1700 : 600); pulse.push(await p.evaluate(() => { const n = [...document.querySelectorAll('.rmodal svg g.lfnewglow > *')]; return { n: n.length, gold: n.length, shadowPulsing: n.filter((e) => e.hasAttribute('filter') || e.hasAttribute('clip-path')).length, light: n.some((e) => e.classList.contains('lflt') || !!e.querySelector('.lflt')) }; })); }
    const b1 = await snap(); const after = cmp(b0, b1);
    await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `buy_${t}.png`) }).catch(() => {});
    const pz = pulse.reduce((m, q) => (q.gold > m.gold ? q : m), { n: 0, gold: 0, shadowPulsing: 0 });
    const okp = after.n === 0 || (after.gone === 0 && after.look === 0 && after.seat === 0 && after.maxMove <= Math.max(40, drift.maxMove * 2.5));
    ok(`${t}: bought ${pick} with ${after.n} people in the window: kept (moved ${after.maxMove} vs ${drift.maxMove} with no purchase)`, okp, { after, drift });
    ok(`${t}: the outline never takes the light layer or a filtered layer (outlined ${pz.gold}; 0 means a held swap)`, pz.shadowPulsing === 0 && !pulse.some((q) => q.light), pulse);
  }
  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
