// QA, v1.49 pets (qa-local c34a8e3b; 29zz_v150.js, 29zz_v151.js): the companion in the real Loft, for minutes. A level-30 save with the
// Bedroom, Closet, Game Room, Lair and Patio and every upgrade, the companion bed (and the large one once changed), one companion out.
// For each kind (wolf, wyvern, slime), first form and changed form: the spell shortened to SPELL ms so it changes room often; the companion
// sampled every 150 ms for SECS: its room, position, mode, activity, pose, alpha, and whether its spot is a blocked cell of that room's
// nav grid (lfBlockedAt, the same test routes use). While walking (mode "walk") a blocked spot means it crossed a piece; resting on its own
// bed or sitting by the player is not a crossing. Room changes: the alpha around each switch (a fade, not a jump). Pictures: the room's
// window when it walks, sits and sleeps, for the changed forms; and the Patio with the companion.
//   BASE=<plain build> SECS=150 SPELL=25000 OUT=<dir> node petroam.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE, SECS = +(process.env.SECS || 150), SPELL = +(process.env.SPELL || 25000), OUT = process.env.OUT || '.';
const KINDS = (process.env.KINDS || 'wolf,wyvern,slime').split(','), FORMS = (process.env.FORMS || '0,1').split(',').map(Number);
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const all = {};
  for (const K of KINDS) for (const F of FORMS) { const tag = K + (F ? ' changed' : ' first form'); console.log('-- ' + tag);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV150 && window.__qbV151 && window.__qbLoft && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(2500);
    await p.evaluate(([K, F]) => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Pet', sex: 'm' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(30) + 5; S.gates = [5, 10, 20, 30]; S.calm = false; S.coins = 99999; S.tutDone = 1;
      S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
      const full = (t) => Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1]));
      S.base.slots = ['bedroom', 'closet', 'gameroom', 'lair', 'patio'].map((t) => ({ t, a: full(t), st: 0, pend: 0 }));
      S.base.slots[0].a.bd_pbed = 1; if (F) S.base.slots[0].a.bd_pbed2 = 1; else delete S.base.slots[0].a.bd_pbed2;
      S.pet = { k: K, t: Date.now() }; const P = window.__qbV150.state(); P.own = {}; P.own[K] = { n: 'Ash', xp: 954, evo: F ? 1 : 0, form: F ? 1 : 0, asked: 1, t: Date.now() }; x.persist(); x.render(); }, [K, F]);
    await p.evaluate((ms) => window.__qbV151.spell(ms), SPELL);
    const info = await p.evaluate(() => ({ form: (() => { try { return window.__qbV150.form(window.__qb.x().S.pet.k); } catch (e) { return '?'; } })(), beds: Object.keys(window.__qb.x().S.base.slots[0].a).filter((k) => /pbed/.test(k)), flags: (() => { try { return JSON.stringify(window.__qbV150.flags()); } catch (e) { return ''; } })() }));
    console.log('     form ' + JSON.stringify(info.form) + ', Bedroom beds ' + info.beds.join(',') + ' ' + info.flags);
    await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hideout"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000);
    await p.evaluate(() => { const g = document.querySelectorAll('[data-act="bldgo"]'); if (g[0]) g[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); }); await p.waitForTimeout(3000);
    /* sample in the building view (every room drawn, the companion's own room changing with the spell) */
    const rows = await p.evaluate(async ([secs]) => { const L = window.__qbLoft(), S = window.__qb.x().S, out = []; const t0 = performance.now();
      while (performance.now() - t0 < secs * 1000) { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const A = L.A, arr = Array.isArray(A) ? A : Object.values(A); const a = arr.find((q) => q.id === 'dog:pet');
        if (a) { let blk = null; try { const C = L.C(a); blk = C ? L.blocked(C, a.x, a.y) : null; } catch (e) { blk = 'err'; } out.push({ t: Math.round(performance.now() - t0), room: (S.base.slots[a.room] || {}).t, x: +a.x.toFixed(2), y: +a.y.toFixed(2), mode: a.mode, act: a.act || '', pose: a.pose, sleep: !!a.sleep, alpha: a.alpha == null ? 1 : +(+a.alpha).toFixed(2), blk }); }
        else out.push({ t: Math.round(performance.now() - t0), room: '-', none: 1 });
        await new Promise((r) => setTimeout(r, 150)); } return out; }, [SECS]);
    const modes = {}; rows.forEach((r) => { const k = r.room + ' ' + (r.none ? 'absent' : r.mode + (r.act ? '/' + r.act : '') + (r.sleep ? '/sleep' : '')); modes[k] = (modes[k] || 0) + 1; });
    const walkBlk = rows.filter((r) => r.mode === 'walk' && r.blk === true); const restBlk = rows.filter((r) => r.mode !== 'walk' && r.blk === true && !r.sleep && r.act !== 'sleep');
    const rooms = []; rows.forEach((r, i) => { if (i && r.room !== rows[i - 1].room) rooms.push(rows[i - 1].room + '->' + r.room + '@' + Math.round(r.t / 1000) + 's (alpha ' + rows[i - 1].alpha + '->' + r.alpha + ')'); });
    const poses = [...new Set(rows.filter((r) => !r.none).map((r) => r.pose))].sort((a, b) => a - b);
    console.log('     ' + rows.length + ' samples over ' + SECS + ' s: ' + Object.entries(modes).map(([k, v]) => k + ' ' + v).join(' | '));
    console.log('     room changes: ' + (rooms.join(', ') || 'none') + ' | poses used: ' + poses.join(','));
    if (walkBlk.length) console.log('     walking on blocked cells: ' + walkBlk.slice(0, 8).map((r) => r.room + '(' + r.x + ',' + r.y + ')@' + r.t).join(' '));
    if (restBlk.length) console.log('     standing still on blocked cells: ' + [...new Set(restBlk.map((r) => r.room + '(' + r.x + ',' + r.y + ') ' + r.mode + '/' + r.act))].slice(0, 6).join(' | '));
    ok(walkBlk.length === 0, tag + ': never walks through a piece (' + rows.filter((r) => r.mode === 'walk').length + ' walking samples)');
    ok(rooms.length >= 1, tag + ': changes room with the spell (' + rooms.length + ' changes)');
    all[tag] = { modes, rooms, walkBlk: walkBlk.length, restBlk: restBlk.length, poses };
    /* the room windows: the companion's room now, then the Bedroom and the Patio */
    const cur = rows.filter((r) => !r.none).slice(-1)[0];
    for (const want of [cur && cur.room, 'bedroom', 'patio']) { if (!want) continue; await p.evaluate((t) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const S = window.__qb.x().S; window.__qb.roomModal(S.base.slots.findIndex((r) => r && r.t === t)); }, want); await p.waitForTimeout(4000);
      const box = await p.evaluate(() => { const e = document.querySelector('#rbigw, .rbig'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
      const st = await p.evaluate(() => { const L = window.__qbLoft(), A = L.A, a = (Array.isArray(A) ? A : Object.values(A)).find((q) => q.id === 'dog:pet'); const S = window.__qb.x().S; return a ? (S.base.slots[a.room] || {}).t + ' ' + a.mode + '/' + (a.act || '') + (a.sleep ? '/sleep' : '') : 'no companion'; });
      if (box) await p.screenshot({ path: OUT + '/roam_' + K + (F ? '_changed' : '') + '_' + want + '.png', clip: box }); console.log('     ' + want + ' window: companion ' + st); }
    ok(!errs.length, tag + ': no page errors ' + JSON.stringify(errs.slice(0, 2))); await ctx.close(); }
  fs.writeFileSync(OUT + '/petroam.json', JSON.stringify(all, null, 1)); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
