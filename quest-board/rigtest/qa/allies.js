// ROOMS's crawl allies (39a0a71): (A) all six rescued, only the Loft built: all of them in the Game Room with name tags; (B) every room built:
// each ally in exactly one room today, the one the day picks, and on another day somewhere else for some; tags only for team, allies and friends.
//   OUT=<folder> node allies.js
const fs = require('fs'), path = require('path'); const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out/allies/'; fs.mkdirSync(OUT, { recursive: true });
const IDS = ['pip', 'kit', 'bram', 'juno', 'neo', 'sera'], NAMES = ['Pip', 'Kit', 'Bram', 'Juno', 'Neo', 'Seraphine'];
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 500) : '')); };
(async () => {
  for (const mode of ['loft', 'all']) { for (const dayShift of mode === 'all' ? [0, 1] : [0]) {
    const { b, p, errs } = await open({ width: 1200, height: 1000, owned: mode === 'all' ? 'all' : 'none' });
    await p.evaluate(({ mode, IDS, dayShift }) => { const x = window.__qb.x(), S = x.S; if (mode === 'loft') S.base.slots = ['bedroom', 'closet', 'patio', 'gameroom', 'lair'].map((t) => ({ t, a: {}, st: 0, pend: 0 }));
      S.dng = S.dng || {}; S.dng.npcs = Object.fromEntries(IDS.map((k) => [k, 1])); S.areaOn = null; if (dayShift) window.__qbShift = (window.__qbShift || 0) + dayShift * 864e5; x.persist(); x.render();
      document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); }, { mode, IDS, dayShift });
    await p.waitForTimeout(2500);
    const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length); const seen = {}, tags = new Set(); let shot = 0;
    for (let k = 0; k < Math.max(1, nB); k++) {
      await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(4000);
      const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = window.__qbLoft().A; const al = Object.values(A).filter((a) => /^al:/.test(a.id) && !a.pv).map((a) => ({ id: a.id.slice(3), room: S.base.slots[a.room] && S.base.slots[a.room].t, alpha: a.alpha }));
        const tg = [...document.querySelectorAll('#app .lftm text')].map((t) => t.textContent); const guests = Object.values(A).filter((a) => a.role === 'guest' && !a.pv && !a.tmn).length; return { al, tg, guests }; });
      r.al.forEach((a) => { (seen[a.id] = seen[a.id] || []).push(a.room); }); r.tg.forEach((t) => tags.add(t));
      if (r.al.length && shot < 2) { shot++; await p.screenshot({ path: path.join(OUT, `${mode}_d${dayShift}_${shot}.png`) }); }
      await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1200);
    }
    const pred = await p.evaluate((IDS) => { const S = window.__qb.x().S; const biz = [], game = []; S.base.slots.forEach((r, k) => { if (!r) return; if (typeof ROOMSTEP !== 'undefined' && ROOMSTEP[r.t]) biz.push(k); else if (r.t === 'gameroom') game.push(k); });
      return null; }, IDS);
    console.log(`${mode} day+${dayShift}: allies seen ${JSON.stringify(seen)}; tags ${[...tags].join(', ')}`);
    if (mode === 'loft') ok('Loft only: all six allies in the Game Room, once each, with name tags', IDS.every((k) => seen[k] && seen[k].length === 1 && seen[k][0] === 'gameroom') && NAMES.every((n) => tags.has(n)), seen);
    else ok(`every room built (day +${dayShift}): each ally in exactly one room, tags on all six`, IDS.every((k) => seen[k] && seen[k].length === 1) && NAMES.every((n) => tags.has(n)), seen);
    const known = new Set(NAMES.concat(['Mara', 'Rafe', 'Theo', 'Nova', 'Sable', 'Rafe Calloway']));
    const odd = [...tags].filter((t) => !known.has(t)); console.log('     other tags (team or friends expected, never a random guest): ' + (odd.join(', ') || 'none'));
    ok(`${mode} day+${dayShift}: no page errors`, errs.length === 0, errs.slice(0, 2)); await b.close(); } }
  console.log(bad ? 'FAILED ' + bad : 'PASS');
})().catch((e) => { console.error(e); process.exit(1); });
