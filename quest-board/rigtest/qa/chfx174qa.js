// QA, 176cb761 (29zz_v174.js: the chapter prize worn on the player card). Do NOT name the prize to Cal (LEAD 11-25: it is a surprise).
// What ch174.js leaves out: the effect at 320 and 390 on the Board's header card, the profile's banner card and the big card (inside
// each card, not cut off by it), another player's view of it through the world doc (fshSafe passes only a known prize id; a made-up or
// hostile chfx draws nothing), reduced motion (spin, pulse and dust stop), and no filter on the figure's picture (the old rim filter
// outlined the whole frame as a rectangle).
//   PORT=<plain build> OUT=<dir> node chfx174qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const [W, rm] of [[390, 'no-preference'], [320, 'no-preference'], [390, 'reduce']]) { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, reducedMotion: rm }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    p.on('dialog', (d) => { errs.push('DIALOG ' + d.message()); d.dismiss(); });
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV174 && window.__qbV152 && window.__qbV135, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    const tag = W + (rm === 'reduce' ? ' reduced motion' : '');
    await p.evaluate((T) => { window.__qbShift = new Date('2026-12-10T12:00:00').getTime() - Date.now(); const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Keeper', sex: 'f' }); S.xp = x.cum(30) + 10; S.gates = [5, 10, 20, 30]; S.tutDone = 1; S.tours = T; S.total = 120;
      S.ch = { m: '2026-12', t0: 20, done: { '2026-12': Date.now() }, prize: { '2026-12': 'px_halo' }, open: { '2026-12': Date.now() } }; S.owned = S.owned || {}; S.owned.px_halo = true; S.chfx = 'px_halo'; x.persist(); x.render(); }, T);
    await p.waitForTimeout(2500); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); });
    const fit = (sel) => p.evaluate((sel) => { const host = document.querySelector(sel); if (!host) return null; const f = host.querySelector('.pc-fig.v74on'); if (!f) return { on: false }; const card = host.closest('.pcard,.avbtn') || host; const C = card.getBoundingClientRect(), H = f.querySelector('.v74halo').getBoundingClientRect(), im = f.querySelector('img.calp');
      const spin = getComputedStyle(f.querySelector('.v74spin')).animationName, dust = getComputedStyle(f.querySelector('.v74dust')).display, imf = im ? getComputedStyle(im).filter : '?';
      return { on: true, halo: [Math.round(H.left - C.left), Math.round(H.top - C.top), Math.round(C.right - H.right), Math.round(H.width)], inside: H.left >= C.left - 1 && H.right <= C.right + 1 && H.top >= C.top - 1, spin, dust, imgFilter: imf }; }, sel);
    const hdr = await fit('.strip .avbtn'); await p.screenshot({ path: OUT + '/chfx_header_' + W + rm + '.png', clip: { x: 0, y: 0, width: W, height: 260 } });
    ok(hdr && hdr.on && hdr.inside, tag + ': the header card wears it, inside the card ' + JSON.stringify(hdr));
    ok(hdr && hdr.imgFilter === 'none', tag + ': no filter on the figure\'s picture (no rectangle outline) ' + (hdr && hdr.imgFilter));
    if (rm === 'reduce') ok(hdr && hdr.spin === 'none' && hdr.dust === 'none', tag + ': reduced motion stops the spin and hides the dust ' + JSON.stringify(hdr));
    await p.evaluate(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1800); await p.evaluate(() => { for (const m of [...document.querySelectorAll('#layer > *')]) if (!m.querySelector('.prof')) m.remove(); });
    const prof = await fit('#layer .prof'); await p.screenshot({ path: OUT + '/chfx_profile_' + W + rm + '.png' });
    ok(prof && prof.on && prof.inside, tag + ': the profile\'s card wears it, inside the card ' + JSON.stringify(prof));
    await p.evaluate(() => { const b = document.querySelector('#layer [data-act="pcard"]'); if (b) b.click(); else window.__qbV152.open(); }); await p.waitForTimeout(2000);
    const big = await fit('#layer .pcm'); if (W === 390) await (await p.$('#layer .pcm .pcard')).screenshot({ path: OUT + '/chfx_card_' + W + rm + '.png' }).catch(() => {});
    ok(big && big.on && big.inside, tag + ': the big card wears it, inside the card ' + JSON.stringify(big));
    /* another player: one with the prize, one with a made-up id, one hostile */
    if (rm !== 'reduce') { await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); const me = window.__qb.x().S; const look = JSON.parse(JSON.stringify(window.__qb.lookOf())); const w = (id, name, chfx) => ({ id, name, look, lv: 30, ep: 8, chfx, xp: 1, total: 100 });
        window.__qbV135.setWorlds([w('u2', 'Keeper Two', 'px_halo'), w('u3', 'Faker', 'px_crown'), w('u4', 'Hostile', '"><img src=x onerror=alert(1)>')]); });
      const other = []; for (const u of ['u2', 'u3', 'u4']) { await p.evaluate((u) => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); const bt = document.createElement('button'); bt.setAttribute('data-act', 'fshview'); bt.setAttribute('data-u', u); document.body.appendChild(bt); bt.click(); bt.remove(); }, u); await p.waitForTimeout(1500);
        other.push(await p.evaluate(() => { const m = document.querySelector('#layer .fsh-modal'); if (!m) return 'no window'; return (m.querySelector('.pc-fig.v74on') ? 'worn' : 'plain') + (m.querySelector('img[src="x"]') ? ' INJECTED' : ''); })); if (W === 390 && u === 'u2') await p.screenshot({ path: OUT + '/chfx_other_' + W + '.png' }); }
      ok(other[0] === 'worn' && other[1] === 'plain' && other[2] === 'plain', tag + ': another player\'s view: the real prize id shows it, a made-up id and a hostile string draw nothing ' + JSON.stringify(other)); }
    await ctx.close(); }
  ok(!errs.length, 'no page errors or dialogs ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
