// Test > Unlock everything (LEAD's 0f7ce90; Cal: "I need the test to be able to allow me to access every upgradable room and section
// so I can test every section and cutscene and room"), pressed from the Test pill like Cal will, on (A) a brand-new player and
// (B) a mid-game save (level 20, five rooms partly bought, half the story). Checks: level >= 50, no locked tab, every room built once
// with nothing lost from the mid-game save, the whole team, +500,000 coins, every story step done and "Next story step" has none
// left, a reload keeps it all; then every room window opens and every upgrade in every room can be bought through the window (the
// first buyable card, again and again), noting when coins run out; Review still plays (a sample).   BASE=<server> OUT=<folder> node unlockall.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 360) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const mode of (process.env.MODES || 'fresh,midgame').split(',')) {
    console.log('== ' + mode);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    const ready = () => p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbRooms, null, { timeout: 90000 });
    const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
    await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(5000); await ready(); await clear();
    let before = null;
    if (mode === 'midgame') {
      before = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(20); S.gates = [5, 10, 20];
        ['garden', 'restaurant', 'boba', 'closet'].forEach((t) => window.__qbRooms.open(t, 1));
        S.base.slots.forEach((r) => { if (!r) return; (x.ADDONS[r.t] || []).filter((u) => !(u[3] && (u[3].retired || u[3].opens))).slice(0, 4).forEach((u) => { r.a[u[0]] = 1; }); });
        const st = window.__qbStory.state(); st.done.garden = 1; st.offer.chef = 1; st.done.chef = 1; S.coins = 4321; x.persist(); x.render();
        return { coins: S.coins, rooms: S.base.slots.filter(Boolean).map((r) => r.t + ':' + Object.keys(r.a).sort().join(',')) }; });
      await p.waitForTimeout(1500); await p.reload(); await ready(); await p.waitForTimeout(1500); await clear();
      const kept = await p.evaluate((rooms) => { const S = window.__qb.x().S; return rooms.every((s) => { const [t, ids] = s.split(':'); const r = S.base.slots.find((q) => q && q.t === t); return r && (ids ? ids.split(',') : []).every((id) => r.a[id]); }); }, before.rooms);
      ok('midgame: the mid-game save is in place before pressing', kept);
    }
    const c0 = await p.evaluate(() => window.__qb.x().S.coins);
    // press it the way Cal will: the Test pill, then "Unlock everything"
    const pressed = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const t = document.querySelector('#qbt [data-q="t"]'); if (!t) return 'no Test pill'; t.click(); await w(400); const a = document.querySelector('#qbt [data-q="all"]'); if (!a) return 'no Unlock everything button'; a.click(); await w(2500); return 'pressed'; });
    ok(`${mode}: Test pill > Unlock everything`, pressed === 'pressed', pressed);
    const st = await p.evaluate((c0) => { const x = window.__qb.x(), S = x.S, sto = window.__qbStory.state(); const types = S.base.slots.filter(Boolean).map((r) => r.t);
      const dup = types.filter((t, i) => types.indexOf(t) !== i);
      return { lvl: x.effLvl(), locked: [...document.querySelectorAll('.nav button[data-v].lk')].map((e) => e.dataset.v), rooms: types.length, types, dup, coinsAdded: S.coins - c0,
        ups: S.base.slots.filter(Boolean).map((r) => r.t + ':' + Object.keys(r.a || {}).filter((id) => { const u = (x.ADDONS[r.t] || []).find((q) => q[0] === id); return !(u && u[3] && u[3].opens); }).join(',')).filter((s) => !/:$/.test(s)), team: Object.keys(sto.team || {}).length, done: Object.keys(sto.done || {}).length,
        steps: (Array.isArray(window.__qbStory.steps) ? window.__qbStory.steps.length : 0) }; }, c0);
    console.log('  rooms built: ' + st.types.join(' '));
    ok(`${mode}: level ${st.lvl} (at least 50)`, st.lvl >= 50);
    ok(`${mode}: no locked tab`, st.locked.length === 0, st.locked);
    ok(`${mode}: ${st.rooms} rooms, none twice`, st.rooms >= 20 && !st.dup.length, st.dup);
    ok(`${mode}: +500,000 coins (${st.coinsAdded}; anything over is income in the same seconds)`, st.coinsAdded >= 500000 && st.coinsAdded < 501000, st.coinsAdded);
    if (mode === 'fresh') ok('fresh: rooms come with no upgrades but the ones that open other rooms (so each can be bought)', st.ups.length === 0, st.ups);
    else { const lost = await p.evaluate((rooms) => { const S = window.__qb.x().S, out = []; rooms.forEach((s) => { const [t, ids] = s.split(':'); const r = S.base.slots.find((q) => q && q.t === t); if (!r) { out.push(t + ' gone'); return; } (ids ? ids.split(',') : []).forEach((id) => { if (!r.a[id]) out.push(t + ':' + id); }); }); return out; }, before.rooms);
      ok('midgame: every room and upgrade the save had is still there', lost.length === 0, lost); }
    ok(`${mode}: whole team (${st.team}) and story steps done (${st.done})`, st.team >= 5 && st.done >= 8, { team: st.team, done: st.done, steps: st.steps });
    // Next story step: nothing left
    const nx = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qbRooms.rooms ? 0 : 0;
      const t = document.querySelector('#qbt [data-q="t"]'); t.click(); await w(300); const r = document.querySelector('#qbt [data-q="rooms"]'); r.click(); await w(1200);
      const nb = document.querySelector('[data-qr="next"]'); if (!nb) return { none: 'no Next story step button' }; const before = document.querySelectorAll('.sty, #layer .modal').length; nb.click(); await w(1500);
      const pops = [...document.querySelectorAll('.pop, .toast, #pop')].map((e) => e.innerText).join(' | '); const sty = document.querySelector('.sty'); return { pops: pops.slice(0, 160), scene: sty ? sty.innerText.slice(0, 80) : null }; });
    ok(`${mode}: "Next story step" has nothing left (no scene, nothing opened)`, !nx.scene && !/Opened/.test(nx.pops), nx);
    // reload keeps it
    await p.reload(); await ready(); await p.waitForTimeout(1500); await clear();
    const rl = await p.evaluate(() => ({ lvl: window.__qb.x().effLvl(), rooms: window.__qb.x().S.base.slots.filter(Boolean).length, locked: [...document.querySelectorAll('.nav button[data-v].lk')].length }));
    ok(`${mode}: a reload keeps it (rooms ${st.rooms}, plus the one Next story step opened)`, rl.lvl >= 50 && rl.rooms >= st.rooms && rl.locked === 0, rl);
    if (mode === 'fresh') {
      // every room: the window opens and every upgrade can be bought, one card at a time
      const res = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const out = []; let topups = 0;
        for (let i = 0; i < S.base.slots.length; i++) { const r = S.base.slots[i]; if (!r) continue; document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(i); await w(700);
          const opened = !!document.querySelector('.rmodal'); let bought = 0, guard = 0;
          while (guard++ < 120) { const bt = [...document.querySelectorAll('.rmodal [data-act="raddon"]')].find((e) => !e.disabled && !e.classList.contains('dis'));
            if (!bt) break; const c = S.coins; bt.click(); await w(250); document.querySelectorAll('#layer .modal:not(.rmodal), .dropsplash').forEach((e) => { if (!e.querySelector('.rmodal') && !e.classList.contains('rmodal')) e.remove(); });
            if (!document.querySelector('.rmodal')) { window.__qb.roomModal(i); await w(400); }
            if (S.coins === c) { if (S.coins < 200000) { S.coins += 1000000; topups++; continue; } break; } bought++; }
          const live = (x.ADDONS[r.t] || []).filter((u) => !(u[3] && u[3].retired)); const own = live.filter((u) => r.a[u[0]]).length;
          out.push({ t: r.t, opened, bought, own, live: live.length, left: live.filter((u) => !r.a[u[0]]).map((u) => u[0]) }); }
        return { out, topups, spent: S.spent }; });
      res.out.forEach((r) => console.log(`  ${r.t.padEnd(11)} window ${r.opened ? 'opens' : 'DID NOT OPEN'}, bought ${r.bought}, owns ${r.own}/${r.live}${r.left.length ? ' (not bought: ' + r.left.join(' ') + ')' : ''}`));
      ok('fresh: every room window opens', res.out.every((r) => r.opened));
      ok('fresh: every upgrade in every room could be bought through its window', res.out.every((r) => r.left.length === 0), res.out.filter((r) => r.left.length).map((r) => r.t + ': ' + r.left.join(',')));
      console.log(`  coins ran out ${res.topups} time(s) buying everything (the test added 1,000,000 each time)`);
      // Review still plays (a sample)
      const rv = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); window.__qbRooms.review(); await w(600); const bs = [...document.querySelectorAll('#layer .modal [data-rv]')].map((e) => [e.dataset.rv, e.dataset.v]); let n = 0, opened = 0;
        for (let i = 0; i < bs.length; i += Math.max(1, Math.floor(bs.length / 20))) { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qbRooms.play(bs[i][0], bs[i][1]); await w(900); n++; if (document.querySelector('#layer .modal, .dropsplash')) opened++; } return { total: bs.length, n, opened }; });
      ok(`fresh: Review still plays (${rv.opened} of ${rv.n} sampled, of ${rv.total})`, rv.total >= 100 && rv.opened === rv.n, rv);
      await clear(); await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(3000); await clear(); await p.screenshot({ path: path.join(OUT, 'unlockall_street.png') });
    }
    ok(`${mode}: no page errors`, errs.length === 0, errs.slice(0, 3));
    await ctx.close();
  }
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
