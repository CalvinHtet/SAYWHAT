// QA's own pet clothes placer v2 (PET_SHOP.md rule, independent of tools/pet_wear.py), creatures and dogs.
// creature: body/base cell = fit.cells.indexOf(fit.body[f]); head cell = headCells.indexOf(fit.head[f]) if fit.head else 0; neck 0; aura back 0 / front 1.
//   anchors: head->head, neck->neck, body->body, base->neck; turn = deg(frame) - deg(cell's frame). headHide hides heads; null anchor hides.
// dogs: cells per dog (cell.pet = dog); head/neck cell by dog; body by dogFit (per dog, 3 cells each); anchors head, neck, back (body), aura.
// A missing cell is drawn as a red NO CELL tag. OUT/qa2_<pet>.png, one row per piece. ONLY=id,id  SC=scale
const pw = require('playwright'), fs = require('fs'); const D = process.argv[2], OUT = process.argv[3], SC = +process.env.SC || 0.45, ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null, PETS = (process.env.PETS || 'wolf,wyvern,slime,dogs').split(',');
const art = JSON.parse(fs.readFileSync(D + '/pet_art.json', 'utf8')), cl = JSON.parse(fs.readFileSync(D + '/pet_clothes.json', 'utf8'));
const img = (n) => (fs.existsSync(D + '/art/' + n + '.webp') ? 'data:image/webp;base64,' + fs.readFileSync(D + '/art/' + n + '.webp').toString('base64') : null);
(async () => { const b = await pw.chromium.launch(); const p = await (await b.newContext()).newPage(); await p.goto('about:blank');
  const srcs = {}; for (const pet of ['wolf', 'wyvern', 'slime']) for (let f = 0; f < 11; f++) srcs[`pgx_${pet}_${f}`] = img(`pgx_${pet}_${f}`);
  for (const dog of ['chopstick', 'pluto']) for (let f = 0; f < 4; f++) srcs[`dgx_${dog}_${f}`] = img(`dgx_${dog}_${f}`);
  for (const id of Object.keys(cl)) cl[id].cells.forEach((c) => { srcs[`ppc_${id}_${c.cell}`] = img(`ppc_${id}_${c.cell}`); });
  await p.evaluate(async (srcs) => { window.I = {}; await Promise.all(Object.entries(srcs).filter(([, s]) => s).map(([k, s]) => new Promise((o) => { const i = new Image(); i.onload = () => { window.I[k] = i; o(); }; i.onerror = o; i.src = s; }))); }, srcs);
  const res = await p.evaluate(([art, cl, SC, ONLY, PETS]) => { const PAD = 170, out = [], miss = [];
    const put = (g, id, ci, a, piv, rot, ox, oy, s) => { const im = I[`ppc_${id}_${ci}`]; g.save(); g.translate(ox + (PAD + a[0]) * s, oy + (PAD + a[1]) * s); g.rotate((rot * Math.PI) / 180); g.scale(s, s); if (im) g.drawImage(im, -piv[0], -piv[1]); else { g.fillStyle = 'red'; g.fillRect(-40, -12, 80, 24); } g.restore(); };
    const tag = (g, x, y, t) => { g.fillStyle = '#d00'; g.font = 'bold 13px sans-serif'; g.fillText(t, x, y); };
    const creature = (g, pet, f, id, ox, oy, s) => { const A = art.pets[pet], an = A.anchors[f], fit = A.fit, P = cl[id], k = P.kind;
      const piece = (half) => { let ci = 0, a, piv, rot = 0, cell;
        if (k === 'body' || k === 'base') ci = fit.cells.indexOf(fit.body[f]); else if (k === 'head' && fit.head) ci = (fit.headCells || []).indexOf(fit.head[f]); else if (k === 'aura') ci = half;
        if (k === 'head' && (fit.headHide || []).includes(f)) return; cell = P.cells.find((q) => q.cell === ci); if (!cell) { miss.push(`${id} f${f} cell ${ci}`); tag(g, ox + 8, oy + 40 + half * 16, `NO CELL ${ci}`); return; }
        if (k === 'aura') { if (P.anchor === 'head' && an.head) { a = an.head; piv = cell.pivot; } else if (P.anchor === 'head') { a = an.aura; piv = cell.pivotAura || cell.pivot; } else { a = an.aura; piv = cell.pivot; } }
        else { const ak = k === 'base' ? 'neck' : k; a = an[ak]; if (!a) return; piv = cell.pivot; rot = (a[2] || 0) - (((A.anchors[cell.frame] || {})[ak] || [0, 0, 0])[2] || 0); }
        put(g, id, ci, a, piv, rot, ox, oy, s); };
      if (k === 'aura') piece(0); const pi = I[`pgx_${pet}_${f}`]; g.drawImage(pi, ox + PAD * s, oy + PAD * s, A.w * s, A.h * s); if (k !== 'aura') piece(0); else piece(1); };
    const dog = (g, dg, f, id, ox, oy, s) => { const key = `dgx_${dg}_${f}`, an = art.dogs[key], fit = art.dogFit, P = cl[id], k = P.kind, di = dg === 'chopstick' ? 0 : 1;
      const piece = (half) => { let ci, a, piv, rot = 0, cell;
        if (k === 'body') ci = di * fit.cells.length + fit.cells.indexOf(fit.body[f]); else if (k === 'aura') ci = di * 2 + half; else ci = di;
        if (k === 'head' && (fit.headHide || []).includes(f)) return; cell = P.cells.find((q) => q.cell === ci); if (!cell) { miss.push(`${id} ${dg} f${f} cell ${ci}`); tag(g, ox + 8, oy + 40, `NO CELL ${ci}`); return; }
        const ak = k === 'body' ? 'back' : k; a = an[ak]; if (!a) return; piv = cell.pivot; const ref = art.dogs[`dgx_${dg}_${cell.frame || 0}`]; rot = (a[2] || 0) - (((ref || {})[ak] || [0, 0, 0])[2] || 0); put(g, id, ci, a, piv, rot, ox, oy, s); };
      if (k === 'aura') piece(0); const pi = I[key]; g.drawImage(pi, ox + PAD * s, oy + PAD * s, an.size[0] * s, an.size[1] * s); if (k !== 'aura') piece(0); else piece(1); };
    for (const pet of PETS) { const ids = Object.keys(cl).filter((i) => (pet === 'dogs' ? cl[i].pet === 'dogs' : cl[i].pet === pet) && (!ONLY || ONLY.includes(i))).sort(); if (!ids.length) continue;
      const isDog = pet === 'dogs', W = isDog ? 444 : art.pets[pet].w, H = isDog ? 300 : art.pets[pet].h, cols = isDog ? 8 : 11, cw = (W + 2 * PAD) * SC, ch = (H + 2 * PAD) * SC;
      const cv = document.createElement('canvas'); cv.width = 120 + cols * cw; cv.height = ids.length * ch; const g = cv.getContext('2d'); g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);
      ids.forEach((id, r) => { g.fillStyle = '#222'; g.font = 'bold 14px sans-serif'; g.fillText(id, 4, r * ch + ch / 2);
        for (let c = 0; c < cols; c++) { const ox = 120 + c * cw, oy = r * ch; if (isDog) dog(g, c < 4 ? 'chopstick' : 'pluto', c % 4, id, ox, oy, SC); else creature(g, pet, c, id, ox, oy, SC); } g.fillStyle = '#999'; g.fillRect(0, (r + 1) * ch - 1, cv.width, 1); });
      out.push([pet, cv.toDataURL('image/png')]); }
    return { out, miss }; }, [art, cl, SC, ONLY, PETS]);
  for (const [n, u] of res.out) { fs.writeFileSync(`${OUT}/qa2_${n}.png`, Buffer.from(u.split(',')[1], 'base64')); console.log('wrote', n); }
  console.log('missing cells:', res.miss.length ? res.miss.join('; ') : 'none'); await b.close(); })();
