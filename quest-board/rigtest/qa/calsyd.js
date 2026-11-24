// QA, v1.49 pets phase 2 (29zz_v151.js): Calvin and Sydney's visit with Pluto and Chopstick (v:calvin, v:sydney, v:dog:pluto,
// v:dog:chopstick) in the Game Room, started with window.__qbFriends.force('calsyd'). The visit's card (its four pictures), then the four
// in the Game Room's window for SECS: sampled every 150 ms against the room's nav grid (walking on a blocked cell = through a piece), their
// on-screen sizes against the player's, the poses the dogs use; pictures of the card and of the room.
//   BASE=<plain build> SECS=90 OUT=<dir> node calsyd.js
const pw = require('playwright');
const BASE = process.env.BASE, SECS = +(process.env.SECS || 90), OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbFriends && window.__qbLoft && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(2500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Host', sex: 'f' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(30) + 5; S.gates = [5, 10, 20, 30]; S.calm = false; S.coins = 99999; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    const full = (t) => Object.fromEntries((A[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1]));
    S.base.slots = ['bedroom', 'closet', 'gameroom', 'lair'].map((t) => ({ t, a: full(t), st: 0, pend: 0 })); x.persist(); x.render(); });
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hideout"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000);
  const f = await p.evaluate(() => { try { return JSON.stringify(window.__qbFriends.force('calsyd')).slice(0, 200); } catch (e) { return 'force failed: ' + e.message; } }); console.log('     force: ' + f);
  await p.waitForTimeout(2500);
  const card = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); if (!m) return null; return { text: m.innerText.replace(/\s+/g, ' ').slice(0, 160), imgs: [...m.querySelectorAll('img, canvas, .vfig, .fvpose')].map((e) => e.tagName + ':' + (e.naturalWidth != null ? e.naturalWidth : e.width) + 'x' + (e.naturalHeight != null ? e.naturalHeight : e.height) + (e.getBoundingClientRect().width ? '' : '(hidden)')) }; });
  console.log('     the visit card: ' + JSON.stringify(card)); await p.screenshot({ path: OUT + '/calsyd_card.png' });
  ok(card && /Calvin|Sydney/.test(card.text), 'the visit\'s card names Calvin and Sydney');
  const shapes = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); return m ? [...m.querySelectorAll('img')].filter((i) => i.naturalWidth > 1).map((i) => { const r = i.getBoundingClientRect(), fit = getComputedStyle(i).objectFit; const nat = i.naturalWidth / i.naturalHeight, shown = r.width / r.height; return { src: i.src.slice(-24), nat: +nat.toFixed(2), shown: +shown.toFixed(2), fit, squashed: fit === 'fill' && Math.abs(shown / nat - 1) > 0.15 }; }) : []; });
  console.log('     card pictures: ' + shapes.map((x) => x.src.replace(/^.*\//, '').slice(0, 18) + ' ' + x.nat + '->' + x.shown + ' ' + x.fit).join(' | '));
  ok(!shapes.some((x) => x.squashed), 'no card picture is squashed out of its shape (' + shapes.filter((x) => x.squashed).length + ' squashed)');
  /* close the card through its own buttons, then the Game Room's window */
  await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); const b = m && [...m.querySelectorAll('button')].find((e) => /let|open|welcome|come|ok|nice|go/i.test(e.textContent)); if (b) b.click(); }); await p.waitForTimeout(1500);
  /* sample in the building view (the Loft hook follows it; the room window draws its own copy) */
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const g = document.querySelectorAll('[data-act="bldgo"]'); if (g[0]) g[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(5000);
  const rows = await p.evaluate(async (secs) => { const L = window.__qbLoft(), S = window.__qb.x().S, out = []; const t0 = performance.now();
    while (performance.now() - t0 < secs * 1000) { const A = L.A, arr = Array.isArray(A) ? A : Object.values(A);
      arr.filter((a) => /^v:(calvin|sydney|dog:pluto|dog:chopstick)$/.test(a.id) || a.id === 'me').forEach((a) => { let blk = null; try { const C = L.C(a); blk = C ? L.blocked(C, a.x, a.y) : null; } catch (e) { blk = 'err'; }
        const g = document.getElementById('lfa-' + String(a.id).replace(/[^a-z0-9_-]/gi, '_')); const r = g ? g.getBoundingClientRect() : null;
        out.push({ id: a.id, room: (S.base.slots[a.room] || {}).t, x: +(+a.x).toFixed(2), y: +(+a.y).toFixed(2), mode: a.mode, act: a.act || '', pose: a.pose, blk, h: r ? Math.round(r.height) : 0 }); });
      await new Promise((r) => setTimeout(r, 150)); } return out; }, SECS);
  const ids = [...new Set(rows.map((r) => r.id))]; console.log('     in the room over ' + SECS + ' s: ' + ids.map((id) => { const R = rows.filter((r) => r.id === id); const m = {}; R.forEach((r) => { const k = r.room + ' ' + r.mode + (r.act ? '/' + r.act : ''); m[k] = (m[k] || 0) + 1; }); return id + ' [' + Object.entries(m).map(([k, v]) => k + ' ' + v).join(', ') + '; poses ' + [...new Set(R.map((r) => r.pose))].join(',') + '; drawn height ' + Math.max(...R.map((r) => r.h)) + ' px]'; }).join('\n       '));
  const walkBlk = rows.filter((r) => r.id !== 'me' && r.mode === 'walk' && r.blk === true); const still = rows.filter((r) => r.id !== 'me' && r.mode !== 'walk' && r.blk === true);
  if (walkBlk.length) console.log('     walking on blocked cells: ' + walkBlk.slice(0, 8).map((r) => r.id + ' (' + r.x + ',' + r.y + ')').join(' '));
  if (still.length) console.log('     still on blocked cells: ' + [...new Set(still.map((r) => r.id + ' (' + r.x + ',' + r.y + ') ' + r.mode + '/' + r.act))].slice(0, 8).join(' | '));
  ok(['v:calvin', 'v:sydney', 'v:dog:pluto', 'v:dog:chopstick'].every((id) => ids.includes(id)), 'all four came to the Game Room: ' + ids.filter((i) => i !== 'me').join(', '));
  ok(walkBlk.length === 0, 'nobody walks through a piece (' + rows.filter((r) => r.mode === 'walk' && r.id !== 'me').length + ' walking samples)');
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const S = window.__qb.x().S; window.__qb.roomModal(S.base.slots.findIndex((r) => r && r.t === 'gameroom')); }); await p.waitForTimeout(4000);
  for (const k of [0, 1, 2]) { await p.waitForTimeout(3000); const box = await p.evaluate(() => { const e = document.querySelector('#rbigw, .rbig'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }); if (box) await p.screenshot({ path: OUT + '/calsyd_room_' + k + '.png', clip: box }); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
