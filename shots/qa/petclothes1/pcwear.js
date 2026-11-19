// QA's own pet clothes placement, from PET_SHOP.md's rule only (independent of tools/pet_wear.py):
// cell by fit (body) / 0 (head, neck) / back 0 + front 1 (aura); pivot on the frame's anchor; turn by deg(frame) - deg(cell's frame);
// heads hide in headHide, necks where the anchor is null; pw_cloud ("anchor":"head") on the head anchor, else the aura anchor with pivotAura.
// MODE=each: one row per piece, 11 frames.  MODE=combo PET=wolf FR=0,4,5,6,9: every head x neck x body x aura (81) in those frames.
const pw = require('playwright'), fs = require('fs'); const D = process.argv[2], OUT = process.argv[3]; const MODE = process.env.MODE || 'each', SC = +process.env.SC || 0.5;
const art = JSON.parse(fs.readFileSync(D + '/pet_art.json', 'utf8')), cl = JSON.parse(fs.readFileSync(D + '/pet_clothes.json', 'utf8'));
const img = (n) => 'data:image/webp;base64,' + fs.readFileSync(D + '/art/' + n + '.webp').toString('base64');
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); await p.goto('about:blank');
  const ids = Object.keys(cl).sort(), srcs = {}; for (const pet of ['wolf', 'wyvern']) for (let f = 0; f < 11; f++) srcs[`pgx_${pet}_${f}`] = img(`pgx_${pet}_${f}`);
  for (const id of ids) cl[id].cells.forEach((c) => { srcs[`ppc_${id}_${c.cell}`] = img(`ppc_${id}_${c.cell}`); });
  await p.evaluate(async (srcs) => { window.I = {}; await Promise.all(Object.entries(srcs).map(([k, s]) => new Promise((o) => { const i = new Image(); i.onload = () => { window.I[k] = i; o(); }; i.src = s; }))); }, srcs);
  const res = await p.evaluate(([art, cl, MODE, SC, PET, FR, ONLY]) => {
    const PAD = 160, draw = (g, pet, f, wear, ox, oy, s) => { const A = art.pets[pet], an = A.anchors[f], fit = A.fit; const piece = (id, half) => { const P = cl[id], k = P.kind; let ci = 0, a, piv, deg0 = 0, deg = 0;
        if (k === 'body') ci = fit.cells.indexOf(fit.body[f]); if (k === 'aura') ci = half;
        const c = P.cells.find((q) => q.cell === ci); if (!c) return 'nocell';
        if (k === 'aura') { if (P.anchor === 'head') { if (an.head) { a = an.head; piv = c.pivot; } else { a = an.aura; piv = c.pivotAura || c.pivot; } } else { a = an.aura; piv = c.pivot; } }
        else { if (k === 'head' && (fit.headHide || []).includes(f)) return; a = an[k]; if (!a) return; piv = c.pivot; deg = a[2] || 0; deg0 = (A.anchors[c.frame][k] || [0, 0, 0])[2] || 0; }
        const im = I[`ppc_${id}_${ci}`]; g.save(); g.translate(ox + (PAD + a[0]) * s, oy + (PAD + a[1]) * s); g.rotate(((deg - deg0) * Math.PI) / 180); g.scale(s, s); g.drawImage(im, -piv[0], -piv[1]); g.restore(); };
      const auras = wear.filter((id) => cl[id].kind === 'aura'); auras.forEach((id) => piece(id, 0)); g.drawImage(I[`pgx_${pet}_${f}`], ox + PAD * s, oy + PAD * s, A.w * s, A.h * s);
      ['body', 'neck', 'head'].forEach((k) => wear.filter((id) => cl[id].kind === k).forEach((id) => piece(id, 0))); auras.forEach((id) => piece(id, 1)); };
    const out = [];
    if (MODE === 'each') { for (const pet of ['wolf', 'wyvern']) { const A = art.pets[pet], ids = Object.keys(cl).filter((i) => cl[i].pet === pet && (!ONLY || ONLY.includes(i))).sort(); if (!ids.length) continue; const cw0 = 0, cw = (A.w + 2 * PAD) * SC, ch = (A.h + 2 * PAD) * SC;
        const cv = document.createElement('canvas'); cv.width = 120 + 11 * cw; cv.height = ids.length * ch; const g = cv.getContext('2d'); g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);
        ids.forEach((id, r) => { g.fillStyle = '#222'; g.font = 'bold 14px sans-serif'; g.fillText(id, 4, r * ch + ch / 2); for (let f = 0; f < 11; f++) draw(g, pet, f, [id], 120 + f * cw, r * ch, SC); g.fillStyle = '#999'; g.fillRect(0, (r + 1) * ch - 1, cv.width, 1); });
        out.push([pet, cv.toDataURL('image/png')]); } }
    else { const pet = PET, A = art.pets[pet], by = (k) => Object.keys(cl).filter((i) => cl[i].pet === pet && cl[i].kind === k).sort(); const H = by('head'), N = by('neck'), B = by('body'), U = by('aura'); const combos = [];
      H.forEach((h) => N.forEach((n) => B.forEach((bd) => U.forEach((u) => combos.push([h, n, bd, u]))))); const cw = (A.w + 2 * PAD) * SC, ch = (A.h + 2 * PAD) * SC, cols = FR.length * 3;
      const cv = document.createElement('canvas'); cv.width = cols * cw; cv.height = Math.ceil(combos.length / 3) * (ch + 12); const g = cv.getContext('2d'); g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);
      combos.forEach((cmb, i) => { const X = (i % 3) * FR.length * cw, Y = Math.floor(i / 3) * (ch + 12); g.fillStyle = '#222'; g.font = '10px sans-serif'; g.fillText(cmb.map((q) => q.slice(3)).join(' '), X + 3, Y + 10); FR.forEach((f, j) => draw(g, pet, f, cmb, X + j * cw, Y + 12, SC)); g.fillStyle = '#888'; g.fillRect(X + FR.length * cw - 2, Y, 2, ch + 12); });
      out.push([pet + '_combos', cv.toDataURL('image/png')]); out.push(['n', String(combos.length)]); }
    return out; }, [art, cl, MODE, SC, process.env.PET, (process.env.FR || '0,4,5,6,9').split(',').map(Number), process.env.ONLY ? process.env.ONLY.split(',') : null]);
  for (const [n, u] of res) { if (n === 'n') { console.log('combos', u); continue; } fs.writeFileSync(`${OUT}/qa_${n}.png`, Buffer.from(u.split(',')[1], 'base64')); console.log('wrote', n); } await b.close(); })();
