// QA: the game's pet compositor (29zz_pets.js pzSprite) against QA's own reading of PET_SHOP.md's rule (as pcwear2.js), every piece x
// every frame (dogs: both dogs x 4 frames), drawn on the same canvas. Counts pixels whose alpha or colour differ (>48).
const pw = require('playwright'), fs = require('fs'); const BASE = process.env.BASE, OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.QBDATA && QBDATA.pet_art && window.QBLoft && QBLoft.data, null, { timeout: 120000 }); await p.addScriptTag({ content: fs.readFileSync(process.env.PZSRC, 'utf8') });
  const r = await p.evaluate(async () => { const D = QBDATA.pet_art, C = QBDATA.pet_clothes, res = [], worst = [];
    const ld = (u) => new Promise((o) => { const i = new Image(); i.onload = () => o(i); i.onerror = () => o(null); i.src = u; });
    const art = (n) => __pz.pzArt(n); const pzSprite = __pz.pzSprite;
    const mine = async (who, f, id, W, H, ax, ay) => { const isDog = !D.pets[who], P = C[id], k = P.kind, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
      let an, fit, img, fw, fh, cx; if (isDog) { const A = D.dogs[`dgx_${who}_${f}`]; an = { head: A.head, neck: A.neck, body: A.back, aura: A.aura }; fit = D.dogFit; img = `dgx_${who}_${f}`; fw = A.size[0]; fh = A.size[1]; cx = fw / 2; }
      else { const A = D.pets[who]; an = A.anchors[f]; fit = A.fit; img = `pgx_${who}_${f}`; fw = A.w; fh = A.h; cx = A.cx; }
      const ox = ax - cx, oy = ay - fh, cells = isDog ? P.cells.filter((c) => c.pet === who) : P.cells;
      const refA = (fr, key) => { if (isDog) { const A = D.dogs[`dgx_${who}_${fr}`]; return ({ head: A.head, neck: A.neck, body: A.back })[key]; } return D.pets[who].anchors[fr][key]; };
      const piece = async (half) => { let ci = 0, a, piv, rot = 0;
        if (k === 'body' || k === 'base') ci = fit.cells.indexOf(fit.body[f]); else if (k === 'head' && fit.head) ci = fit.headCells.indexOf(fit.head[f]); else if (k === 'aura') ci = half;
        if (k === 'head' && (fit.headHide || []).includes(f)) return; const c = cells[ci]; if (!c) return;
        if (k === 'aura') { if (P.anchor === 'head' && an.head) { a = an.head; piv = c.pivot; } else { a = an.aura; piv = (P.anchor === 'head' ? c.pivotAura : null) || c.pivot; } }
        else { const ak = k === 'base' ? 'neck' : k; a = an[ak]; if (!a) return; piv = c.pivot; const r0 = refA(c.frame, ak); rot = (a[2] || 0) - ((r0 && r0[2]) || 0); }
        const im = await ld(art(`ppc_${id}_${c.cell}`)); if (!im) return; g.save(); g.translate(ox + a[0], oy + a[1]); g.rotate((rot * Math.PI) / 180); g.drawImage(im, -piv[0], -piv[1], c.w, c.h); g.restore(); };
      if (k === 'aura') await piece(0); const bi = await ld(art(img)); g.drawImage(bi, ox, oy, fw, fh); if (k === 'aura') await piece(1); else await piece(0); return cv; };
    const slotOf = (k) => (k === 'base' ? 'neck' : k);
    for (const id of Object.keys(C).sort()) { const P = C[id], whos = P.pet === 'dogs' ? ['chopstick', 'pluto'] : [P.pet], nf = P.pet === 'dogs' ? 4 : 11;
      for (const who of whos) for (let f = 0; f < nf; f++) { const worn = {}; worn[slotOf(P.kind)] = id;
        const s = await new Promise((o) => { const r = pzSprite(who, f, worn, o); if (r && !r.plain) o(r); setTimeout(() => o(null), 8000); });
        if (!s) { res.push({ id, who, f, err: 'no sprite' }); continue; } const gi = await ld(s.u), W = gi.width, H = gi.height;
        const m = await mine(who, f, id, W, H, s.ax, s.ay); const g1 = document.createElement('canvas'); g1.width = W; g1.height = H; const c1 = g1.getContext('2d'); c1.drawImage(gi, 0, 0);
        const d1 = c1.getImageData(0, 0, W, H).data, d2 = m.getContext('2d').getImageData(0, 0, W, H).data; let n = 0;
        for (let i = 0; i < d1.length; i += 4) { const da = Math.abs(d1[i + 3] - d2[i + 3]); const dc = d1[i + 3] > 128 && d2[i + 3] > 128 ? Math.abs(d1[i] - d2[i]) + Math.abs(d1[i + 1] - d2[i + 1]) + Math.abs(d1[i + 2] - d2[i + 2]) : 0; if (da > 48 || dc > 96) n++; }
        res.push({ id, who, f, n }); if (n > 40) worst.push({ id, who, f, n, a: s.u, b: m.toDataURL() }); } }
    worst.sort((x, y) => y.n - x.n); return { res, worst: worst.slice(0, 12) }; });
  const bad = r.res.filter((q) => q.err || q.n > 40); console.log('compared', r.res.length, 'piece-frames; differing (>40 px):', bad.length);
  console.log(bad.slice(0, 40).map((q) => `${q.id}/${q.who}/${q.f}:${q.err || q.n}`).join(' '));
  const mx = r.res.reduce((m, q) => Math.max(m, q.n || 0), 0); console.log('max diff px', mx, 'page errors', errs.length, JSON.stringify(errs.slice(0, 2)));
  r.worst.forEach((w, i) => { fs.writeFileSync(`${OUT}/w${i}_${w.id}_${w.who}_${w.f}_game.png`, Buffer.from(w.a.split(',')[1], 'base64')); fs.writeFileSync(`${OUT}/w${i}_${w.id}_${w.who}_${w.f}_qa.png`, Buffer.from(w.b.split(',')[1], 'base64')); });
  await b.close(); })();
