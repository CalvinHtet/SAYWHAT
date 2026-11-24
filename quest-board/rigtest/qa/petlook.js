// QA, v1.49 pets: the changed forms by eye. For each kind changed (k5 wolf, k6 wyvern, k4 slime) and a set-up of beds (both beds: it
// should sleep on the large one; only the small one: beside it on the floor; none: on the floor), the companion is kept in the Bedroom
// (a spell length whose spell keeps it home), the Bedroom's window is opened and photographed every 3 s for 45 s with the companion's
// state; one picture per state (walk, sit, stand, sleep) is kept. Then a room change watched closely: the spell shortened, the companion
// sampled every 60 ms in the building view, its last spots before the switch and the first after.
//   BASE=<plain build> OUT=<dir> node petlook.js
const pw = require('playwright');
const BASE = process.env.BASE, OUT = process.env.OUT || '.';
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const run = async (K, beds, tag) => { const ctx = await b.newContext({ viewport: { width: 1500, height: 1100 }, deviceScaleFactor: 2 }); /* a big window: the building view's rooms are large enough to see the companion */ await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV150 && window.__qbV151 && window.__qbLoft && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(2500);
    await p.evaluate(([K, beds]) => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Pet', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(30) + 5; S.gates = [5, 10, 20, 30]; S.calm = false; S.coins = 99999; S.tutDone = 1;
      S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1, lounge: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
      const full = (t) => Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1]));
      S.base.slots = ['bedroom', 'closet', 'gameroom', 'lair', 'patio'].map((t) => ({ t, a: full(t), st: 0, pend: 0 })); delete S.base.slots[0].a.bd_pbed; delete S.base.slots[0].a.bd_pbed2; beds.forEach((k) => { S.base.slots[0].a[k] = 1; });
      S.pet = { k: K, t: Date.now() }; const P = window.__qbV150.state(); P.own = {}; P.own[K] = { n: 'Ash', xp: 954, evo: 1, form: 1, asked: 1, t: Date.now() }; x.persist(); x.render(); }, [K, beds]);
    /* a spell that keeps it in the Bedroom */
    /* keep it in the Bedroom: empty the list of rooms it may visit (P3ROOMS, through the test hook; put back for the room-change watch) */
    const sp = await p.evaluate(() => { const R = window.__qbV151.rooms; window.__qbKeep = Object.assign({}, R); Object.keys(R).forEach((k) => delete R[k]); return 'home only'; });
    await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hideout"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500);
    await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const g = document.querySelector('[data-act="bldgo"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000);
    /* no room window: it would pause the building's characters; pictures are cropped around the companion in the building view */
    const kept = {}; const states = [];
    for (let i = 0; i < 22; i++) { await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove())); const st = await p.evaluate(() => { const L = window.__qbLoft(), A = L.A, arr = Array.isArray(A) ? A : Object.values(A); const a = arr.find((q) => q.id === 'dog:pet'); const S = window.__qb.x().S; if (!a) return 'none'; return (S.base.slots[a.room] || {}).t + ':' + (a.sleep || a.act === 'sleep' ? 'sleep' : a.mode === 'walk' ? 'walk' : (a.act || a.mode)); });
      states.push(st); const k = st.split(':')[1]; await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()));
      if (st.startsWith('bedroom') && !kept[k]) { const bx = await p.evaluate(() => { const g = document.getElementById('lfa-dog_pet'); if (!g) return null; const r = g.getBoundingClientRect(); if (!r.width) return null; const pad = Math.max(160, r.width * 2.2); return { x: Math.max(0, r.left + r.width / 2 - pad), y: Math.max(0, r.top + r.height / 2 - pad * 0.7), width: pad * 2, height: pad * 1.4 }; });
        if (bx) { kept[k] = 1; await p.screenshot({ path: OUT + '/look_' + K + '_' + tag.replace(/ /g, '_') + '_' + k + '.png', clip: bx }); } }
      await p.waitForTimeout(2500); }
    console.log('     ' + K + ' changed, ' + tag + ' (spell ' + sp + '): ' + states.join(' ') + ' | pictures: ' + Object.keys(kept).join(','));
    /* a room change, watched */
    if (tag === 'both beds') { await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove())); await p.evaluate(() => { Object.assign(window.__qbV151.rooms, window.__qbKeep); window.__qbV151.spell(12000); });
      const tr = await p.evaluate(async () => { const L = window.__qbLoft(), S = window.__qb.x().S, out = []; const t0 = performance.now(); let last = null; while (performance.now() - t0 < 40000 && out.length < 3) { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const A = L.A, arr = Array.isArray(A) ? A : Object.values(A); const a = arr.find((q) => q.id === 'dog:pet');
          const cur = a ? { room: (S.base.slots[a.room] || {}).t, x: +(+a.x).toFixed(2), y: +(+a.y).toFixed(2), mode: a.mode, alpha: a.alpha == null ? 1 : +(+a.alpha).toFixed(2), fade: a.fade || 0, leaving: !!a.leaving } : null;
          if (last && cur && cur.room !== last.room) out.push({ before: last, after: cur, t: Math.round(performance.now() - t0) }); last = cur; await new Promise((r) => setTimeout(r, 60)); } return out; });
      tr.forEach((c) => console.log('       room change at ' + c.t + ' ms: ' + JSON.stringify(c.before) + ' -> ' + JSON.stringify(c.after))); }
    if (errs.length) console.log('     page errors: ' + JSON.stringify(errs.slice(0, 2))); await ctx.close(); };
  for (const K of ['wolf', 'wyvern', 'slime']) { await run(K, ['bd_pbed', 'bd_pbed2'], 'both beds'); await run(K, ['bd_pbed'], 'small bed only'); }
  await run('wolf', [], 'no bed');
  await b.close(); })();
