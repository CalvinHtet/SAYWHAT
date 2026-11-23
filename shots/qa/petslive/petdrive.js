// QA: drive the Pet Shop creature in the Loft (Bedroom): sleep, wake and roam, forced walks across the room, sit. Every 100 ms: mode,
// position, facing vs travel direction, the drawn sprite (composite or plain = shown without clothes), sprite size, and whether its
// spot is inside furniture (lfBlockedAt). Crops of the pet every 200 ms go to a contact sheet. Non-local requests blocked.
const pw = require('playwright'), fs = require('fs'); const base = process.env.BASE, OUT = process.env.OUT, PET = process.env.PET || 'wolf';
const WEAR = { wolf: { head: 'pw_helm', neck: 'pw_ruff', body: 'pw_hoodie', aura: 'pw_aurora' }, wyvern: { head: 'pv_wizard', neck: 'pv_scarf', body: 'pv_bomber', aura: 'pv_lanterns' }, slime: { head: 'ps_crown', neck: 'ps_pearls', body: 'ps_float', aura: 'ps_flames' } };
(async () => { fs.mkdirSync(OUT, { recursive: true }); const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1300, height: 1000 } });
  await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const info = await p.evaluate(() => { const A = window.__qb.x().ADDONS || {}; return { bd: (A.bedroom || []).map((a) => a[0]) }; });
  await p.evaluate(([info, PET, W]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.pet = { k: PET, t: 1 };
    S.owned = S.owned || {}; Object.values(W).forEach((id) => { S.owned['pc_' + id] = true; }); S.petw = {}; S.petw[PET] = W; S.dogw = { pluto: { head: 'pd_bucket', neck: 'pd_bandana', body: 'pd_rain' }, chopstick: { head: 'pd_poppy', neck: 'pd_studs', body: 'pd_rain' } };
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(info.bd.filter((k) => k !== 'bd_game').map((k) => [k, 1])), st: 0, pend: 0 }]; window.__qbRooms.open('closet', 1); x.render(); }, [info, PET, WEAR[PET]]);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); for (let i = 0; i < 3; i++) { await p.waitForTimeout(1500); await p.evaluate(() => document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove())); }
  const sample = () => p.evaluate(() => { document.querySelectorAll('.modal,.overlay,.dropsplash').forEach((m) => m.remove()); const a = window.LFA['dog:pet']; if (!a) return null; const g = document.getElementById('lfa-dog_pet'); const im = g && g.querySelector('.lfi'); const h = im ? im.getAttribute('href') || '' : ''; const C = window.lfC(a); const r = g ? g.getBoundingClientRect() : null;
    return { mode: a.mode, act: a.act || '', x: a.x, y: a.y, face: a.face, flip: im ? (im.getAttribute('transform') || '') + '|' + (g.getAttribute('transform') || '') : '', src: h.startsWith('data:') ? 'comp' : h.replace(/^.*\//, '').replace(/\?.*$/, ''), w: im ? +im.getAttribute('width') : 0, h: im ? +im.getAttribute('height') : 0, sig: h.length, blocked: C ? !!window.lfBlockedAt(C, a.x, a.y) : null, r: r ? [r.x, r.y, r.width, r.height] : null }; });
  const log = []; const crops = []; let k = 0;
  const run = async (label, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const s = await sample(); if (s) { s.ph = label; s.t = Date.now(); log.push(s); if (k++ % 2 === 0 && s.r && s.r[2] > 0 && crops.length < 140) { const cx = s.r[0] + s.r[2] / 2, cy = s.r[1] + s.r[3] / 2; try { crops.push((await p.screenshot({ clip: { x: Math.max(0, cx - 60), y: Math.max(0, cy - 70), width: 120, height: 110 } })).toString('base64')); } catch (e) {} } } await p.waitForTimeout(100); } };
  await run('sleep', 2500);
  await p.evaluate(() => { const a = window.LFA['dog:pet']; a.sleep = 0; window.lfNext(a); }); await run('roam', 14000);
  const targets = await p.evaluate(() => { const a = window.LFA['dog:pet']; const C = window.lfC(a); const N = C.nav; return { W: (C.W || C.w || 10), D: (C.D || C.d || 9) }; });
  for (const [tx, ty] of [[1.5, 6.8], [8.5, 1.8], [2.2, 2.2], [8.8, 7.2]]) { await p.evaluate(([tx, ty]) => { const a = window.LFA['dog:pet']; a.sleep = 0; window.lfGo(a, tx, ty); }, [tx, ty]); await run('walk->' + tx + ',' + ty, 6000); }
  await p.evaluate(() => { const a = window.LFA['dog:pet']; a.mode = 'do'; a.act = 'sit'; a.t = 6; }); await run('sit', 2500);
  fs.writeFileSync(OUT + '/log.json', JSON.stringify(log));
  // analysis
  const plain = log.filter((q) => q.src !== 'comp'); const walk = log.filter((q) => q.mode === 'walk'); let wrongFace = 0, moves = 0; for (let i = 1; i < log.length; i++) { const a = log[i - 1], c = log[i]; if (c.mode !== 'walk' || a.mode !== 'walk') continue; const dx = c.x - a.x, dy = c.y - a.y; if (Math.abs(dx - dy) < 0.02) continue; moves++; const screenRight = (dx - dy) > 0; const flipped = /scale\(-1/.test(c.flip); if (screenRight === flipped) wrongFace++; }
  const blocked = log.filter((q) => q.blocked); const sizes = [...new Set(log.map((q) => q.w.toFixed(1) + 'x' + q.h.toFixed(1)))];
  console.log(PET, 'samples', log.length, '| phases', [...new Set(log.map((q) => q.ph))].join(' '), '| modes', JSON.stringify(log.reduce((m, q) => { const kk = q.mode + (q.act ? ':' + q.act : ''); m[kk] = (m[kk] || 0) + 1; return m; }, {})));
  console.log('  shown without clothes (plain frame):', plain.length, plain.slice(0, 6).map((q) => q.ph + ' ' + q.mode + ' ' + q.src).join('; '));
  console.log('  walking samples', walk.length, '; facing vs travel (screen x) mismatches', wrongFace, 'of', moves, '(sign convention unverified; see sheet)');
  console.log('  samples standing inside furniture (lfBlockedAt):', blocked.length, blocked.slice(0, 5).map((q) => q.ph + ' ' + q.x.toFixed(2) + ',' + q.y.toFixed(2)).join('; '));
  console.log('  distinct sprite sizes', sizes.length, sizes.slice(0, 12).join(' '));
  // contact sheet
  const png = await p.evaluate(async (crops) => { const ims = await Promise.all(crops.map((c) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.src = 'data:image/png;base64,' + c; }))); const cols = 14, cv = document.createElement('canvas'); cv.width = cols * 120; cv.height = Math.ceil(ims.length / cols) * 110; const g = cv.getContext('2d'); ims.forEach((im, i) => g.drawImage(im, (i % cols) * 120, Math.floor(i / cols) * 110)); return cv.toDataURL('image/png'); }, crops);
  fs.writeFileSync(OUT + '/sheet.png', Buffer.from(png.split(',')[1], 'base64'));
  console.log('  page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
