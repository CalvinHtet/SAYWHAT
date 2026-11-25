// QA, 932471e1 (29zz_v164.js: the character and the companion centred together on the card, scaled down only if the pair does not fit;
// Cal 11-25). What LEAD's pair164.js leaves out: each companion fully dressed (per slot the widest piece in data/pet_clothes.json, so
// capes, auras and wings widen it), first and evolved form, on the big card, the header card and the profile's banner card, at 390 and
// 320. (Waits up to 20 s for the character picture: under swiftshader the header card's sharp picture can come late.)
//   PORT=<plain build> OUT=<dir> node pair164qa.js
const pw = require('playwright'), fs = require('fs');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const CL = JSON.parse(fs.readFileSync(__dirname + '/../../data/pet_clothes.json', 'utf8'));
const widest = (pet) => { const by = {}; for (const [id, it] of Object.entries(CL)) { if (it.pet !== pet) continue; const w = Math.max(...it.cells.map((c) => c.w)); if (!by[it.kind] || w > by[it.kind][1]) by[it.kind] = [id, w]; } const o = {}; for (const [k, v] of Object.entries(by)) o[k] = v[0]; return o; };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const W of [390, 320]) { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV164 && window.__qbV150 && window.__qbV152, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    const clr = () => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,#layer .qb-held,.bsplash,.dropsplash,.flsplash')) m.remove(); });
    const measure = (sel) => p.evaluate((sel) => { const st = document.querySelector(sel); if (!st) return null; const fig = st.querySelector('.pc-fig'), ch = fig && fig.querySelector('img.calp'), pet = fig && fig.querySelector('img.fsh-pet'), H = window.__qbV164; if (!pet || !ch) return { pet: !!pet, ready: false };
      const on = (im) => { const bx = H.box(im); if (!bx) return null; const r = im.getBoundingClientRect(); return { l: r.left + bx[0] * r.width, r: r.left + bx[2] * r.width, t: r.top + bx[1] * r.height, b: r.top + bx[3] * r.height }; };
      const A = on(ch), B = on(pet); if (!A || !B) return { pet: true, ready: false, ch: !!A, petBox: !!B, chSrc: (ch.src || '').slice(0, 40), chW: ch.naturalWidth, petW: pet.naturalWidth, chDone: ch.complete }; const C = (st.closest('.pcard,.avbtn') || st).getBoundingClientRect(); const U = { l: Math.min(A.l, B.l), r: Math.max(A.r, B.r), t: Math.min(A.t, B.t), b: Math.max(A.b, B.b) };
      return { ready: true, inside: U.l >= C.left + 1 && U.r <= C.right - 1 && U.t >= C.top && U.b <= C.bottom + 1, off: Math.round((U.l + U.r) / 2 - (C.left + C.right) / 2), wfrac: +((U.r - U.l) / C.width).toFixed(2), tr: fig.style.transform, src: pet.src.slice(0, 30) + '..' + pet.src.length }; }, sel);
    const wait = async (sel) => { let m = null; for (let i = 0; i < 80; i++) { await p.waitForTimeout(250); m = await measure(sel); if (m && m.ready) break; } await p.waitForTimeout(2300); return measure(sel); };
    for (const k of ['wolf', 'wyvern', 'slime']) { const worn = widest(k);
      for (const form of [0, 1]) {
        await p.evaluate((a) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'f' }); S.xp = x.cum(30); S.gates = [5, 10, 20, 30]; S.tutDone = 1; S.pc = { bg: 'ink_peaks', own: { ink_peaks: 1 } }; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
          const H = window.__qbV150.state(); H.own = {}; H.own[a.k] = { n: 'Pal', xp: 0, evo: a.form, form: a.form, t: Date.now() }; H.seen = 1; S.pet = { k: a.k, t: Date.now() }; S.dogref = { at: 1 }; S.petw = {}; S.petw[a.k] = a.worn; S.owned = S.owned || {}; Object.values(a.worn).forEach((id) => { S.owned[id] = true; }); x.persist(); x.render(); }, { k, form, worn });
        await clr(); const nm = W + ': ' + k + (form ? ' evolved' : '') + ' dressed (' + Object.values(worn).join(' ') + ')';
        await p.evaluate(() => window.__qbV152.open()); const big = await wait('#layer .pcm .pc-stage'); if (W === 390 || form) await (await p.$('#layer .pcm .pcard')).screenshot({ path: OUT + '/pairqa_' + W + '_' + k + form + '.png' }).catch(() => {});
        ok(big && big.ready && big.inside && Math.abs(big.off) <= 3, nm + ', big card: whole and centred ' + JSON.stringify(big));
        await clr(); const hdr = await wait('.strip .avbtn .pc-stage'); ok(hdr && hdr.ready && hdr.inside && Math.abs(hdr.off) <= 3, nm + ', header card: whole and centred ' + JSON.stringify(hdr));
        await clr(); await p.evaluate(() => document.querySelector('.strip .avbtn').click()); const ban = await wait('#layer .v61ban .pc-stage'); ok(ban && ban.ready && ban.inside && Math.abs(ban.off) <= 3, nm + ', profile banner card: whole and centred ' + JSON.stringify(ban));
        if (W === 390 && form) await (await p.$('#layer .v61ban')).screenshot({ path: OUT + '/pairqa_ban_' + k + '.png' }).catch(() => {});
        await clr(); } }
    await clr(); await ctx.close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
