// QA, b0de3dbb (29zz_v155.js, Cal 11-25: the header's avatar is the player card). What LEAD's header155.js leaves out:
//   A  a cold load at 390: how long the header card shows without its character; after a render(), whether the character drops out
//   B  the Relics "!" (alMark on .avbtn) shows whole on the header card (overflow:hidden), and on the card's Profile button
//   C  320 px: the changed wolf dressed in four pieces, and the first-form wolf dressed: inside the card, nothing cut (pcClamp)
//   D  the Relics and streak-freeze tours really run and ring the level bar
//   PORT=<plain build> OUT=<dir> node header155qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const open = async (W, setup) => { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV152 && window.__qbV150 && window.__qbV155, null, { timeout: 120000 }); await p.waitForTimeout(800);
    await p.evaluate((setup) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Calzone Longname', sex: 'm' }); S.xp = x.cum(26); S.gates = [5, 10, 20]; S.calm = false; S.tutDone = 1; S.coins = 123456;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, shop: 1, trophy: 1 };
      S.brandSeen = S.brandSeen || {}; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {}
      const H = window.__qbV150.state(); H.own.wolf = { n: 'Fenrir', xp: 954, evo: setup.evo ? 1 : 0, form: setup.evo ? 1 : 0, asked: 1, t: Date.now() }; H.seen = 1; S.pet = { k: 'wolf', t: Date.now() }; S.dogref = { at: 1 };
      if (setup.dress) { S.petw = { wolf: { body: 'pw_armour', aura: 'pw_aurora', head: 'pw_beanie', neck: 'pw_collar' } }; S.petOwned = S.petOwned || {}; }
      if (setup.bg) { const o = window.__qbV152.st(); o.own[setup.bg] = 1; o.bg = setup.bg; }
      if (setup.tours) setup.tours.forEach((t) => delete S.tours[t]); if (setup.freezes) S.freezes = setup.freezes;
      if (setup.relics) { S.alSeen = { init: 1, room: {}, bld: {}, tab: {}, brand: {} }; ['board', 'train', 'hideout', 'hall', 'shop', 'players', 'away', 'wheel', 'sys'].forEach((k) => { S.alSeen.tab[k] = 1; }); }
      x.persist(); x.render(); const n = document.querySelector('.nav button[data-v="board"]'); if (n) n.click(); }, setup);
    return p; };
  const clear = (p) => p.evaluate(() => document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove()));
  const figOn = (p) => p.evaluate(() => { const i = document.querySelector('.strip .avbtn img.calp'); return i ? !/^data:image\/gif/.test(i.getAttribute('src')) && i.naturalWidth > 1 : null; });
  /* A */
  { const p = await open(390, {}); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const t0 = Date.now(); let at = null; for (let i = 0; i < 60; i++) { if (await figOn(p)) { at = Date.now() - t0; break; } await p.waitForTimeout(250); }
    ok(at !== null, 'A 390 cold: the character is drawn on the header card ' + (at === null ? 'never (15 s)' : at + ' ms after the save is set'));
    await clear(p); let worst = 0; for (let k = 0; k < 5; k++) { await p.evaluate(() => window.__qb.x().render()); const t1 = Date.now(); let ms = null; for (let i = 0; i < 40; i++) { if (await figOn(p)) { ms = Date.now() - t1; break; } await p.waitForTimeout(25); } worst = Math.max(worst, ms === null ? 9999 : ms); }
    console.log('     A after render(): the header character is back within ' + worst + ' ms (5 renders; before b0de3dbb the old avatar took about 180 ms too)');
    await p.screenshot({ path: OUT + '/qa155_A_390.png', clip: { x: 0, y: 0, width: 390, height: 260 } }); await p.context().close(); }
  /* B */
  for (const W of [390, 320]) { const p = await open(W, { relics: 1, bg: 'moon' }); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); await p.waitForTimeout(2500); await clear(p); await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(800);
    const m = await p.evaluate(() => { const a = document.querySelector('.strip .avbtn'), n = a && a.querySelector('.nbang'); if (!n) return { none: 1, tabs: JSON.stringify(Object.keys((window.__qb.x().S.alSeen || {}).tab || {})) }; const r = n.getBoundingClientRect(), q = a.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { n: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)], card: [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)], inside: r.left >= q.left && r.right <= q.right && r.top >= q.top && r.bottom <= q.bottom }; /* .nbang has pointer-events:none, so no elementFromPoint test; overflow:hidden cuts what is outside */ });
    ok(!m.none && m.inside, 'B ' + W + ': the Relics "!" is whole and on top on the header card ' + JSON.stringify(m)); await p.screenshot({ path: OUT + '/qa155_B_' + W + '.png', clip: { x: 0, y: 0, width: W, height: 260 } });
    await p.click('.strip .avbtn'); await p.waitForTimeout(600); const c = await p.evaluate(() => { const b = document.querySelector('#layer .pcm [data-act="char"]'), n = b && b.querySelector('.nbang'); if (!n) return { none: 1 }; const r = n.getBoundingClientRect(), q = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; return { on: cx >= q.left - 6 && cx <= q.right + 6 && cy >= q.top - 14 && cy <= q.bottom, bang: [Math.round(r.left), Math.round(r.top)], btn: [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)] }; });
    ok(!c.none && c.on, 'B ' + W + ': the card\'s Profile button carries the "!" ' + JSON.stringify(c)); if (W === 390) await p.screenshot({ path: OUT + '/qa155_B_card.png' });
    await p.click('#layer .pcm [data-act="char"]'); await p.waitForTimeout(600); const pr = await p.evaluate(() => { const r = document.querySelector('#layer .prof'); return r ? { relicsBang: !!r.querySelector('.nbang'), btns: [...r.querySelectorAll('button')].map((q) => q.textContent.trim()).filter(Boolean).slice(0, 8).join('|') } : null; });
    console.log('     B ' + W + ': the profile it opens (Relics "!" is painted by alPaint on the next render or 15 s tick, not by this change): ' + JSON.stringify(pr)); await p.context().close(); }
  /* C */
  for (const [evo, tag] of [[1, 'changed'], [0, 'first form']]) for (const bg of ['studio', 'neon']) { const p = await open(320, { evo, dress: 1, bg: bg === 'studio' ? null : bg }); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); await p.waitForTimeout(4000); await clear(p);
    const g = await p.evaluate(() => { const a = document.querySelector('.strip .avbtn'), pet = a && a.querySelector('.fsh-pet'), fig = a && a.querySelector('img.calp'); if (!a || !pet) return null; const q = a.getBoundingClientRect(), r = pet.getBoundingClientRect(), f = fig.getBoundingClientRect(); return { pzk: pet.dataset.pzk, card: [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)], pet: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)], fig: [Math.round(f.left), Math.round(f.top), Math.round(f.right), Math.round(f.bottom)], tf: pet.style.transform, nat: pet.naturalWidth }; });
    ok(g && g.nat > 1 && g.pet[0] >= g.card[0] && g.pet[2] <= g.card[2] && g.pet[3] <= g.card[3], 'C 320 ' + tag + ' dressed, ' + bg + ': the companion is inside the card ' + JSON.stringify(g));
    await p.screenshot({ path: OUT + '/qa155_C_320_' + (evo ? 'changed' : 'first') + '_' + bg + '.png', clip: { x: 0, y: 0, width: 320, height: 240 } }); await p.context().close(); }
  /* D */
  for (const [tour, setup] of [['trophy', { tours: ['trophy'] }], ['freeze', { tours: ['freeze'], freezes: 2 }]]) { const p = await open(390, setup); let seen = null;
    for (let i = 0; i < 40 && !seen; i++) { await p.waitForTimeout(500); await p.evaluate(() => document.querySelectorAll('.bsplash,.dropsplash').forEach((m) => m.remove()));
      seen = await p.evaluate(() => { const r = document.querySelector('.tour-ring'), bub = document.querySelector('.tour-bub'), bl = document.querySelector('.bline'); if (!r || !bl || !r.getBoundingClientRect().width) return null; const a = r.getBoundingClientRect(), c = bl.getBoundingClientRect(); return { ringOnBar: a.left <= c.left + 4 && a.right >= c.right - 4 && a.top <= c.top + 4 && a.bottom >= c.bottom - 4, ring: [Math.round(a.left), Math.round(a.top), Math.round(a.right), Math.round(a.bottom)], bar: [Math.round(c.left), Math.round(c.top), Math.round(c.right), Math.round(c.bottom)], text: bub ? bub.innerText.replace(/\s+/g, ' ').slice(0, 400) : '' }; }); }
    ok(seen && seen.ringOnBar && /tap your level bar/i.test(seen.text) && !/tap your character/i.test(seen.text), 'D the ' + tour + ' tour runs and rings the level bar: ' + JSON.stringify(seen)); await p.screenshot({ path: OUT + '/qa155_D_' + tour + '.png' });
    if (seen) { await p.click('.bline', { force: true }).catch(() => {}); await p.waitForTimeout(800); const pr = await p.evaluate(() => !!document.querySelector('#layer .prof')); console.log('     tapping the ringed level bar opens the profile: ' + pr); }
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
