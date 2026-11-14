// A brand's pieces worn on both bodies in every pose the rig has (QBDATA.poses, 35 with the base), drawn by the game's own rig at
// HI x the room frame, in outfits that cover every piece the body may wear (maleOnly/femaleOnly honoured), some mixed with other
// brands' pieces, across the three hairstyles. One sheet per body: a row per outfit, a column per pose; a red NOT DRAWN cell if a
// frame fails. Also an icon sheet with each Shop row's name, slot and flags, and the list of pieces with missing art.
//   POSES=idle,walk2 limits the columns (for a close look at a bigger HI).
//   BRAND=al BASE=<server of quest-board/> OUT=<folder> NODE_PATH=<playwright's parent> node rigtest/qa/brandwear.js
const pw = require('playwright'), fs = require('fs');
const POSES = process.env.POSES ? process.env.POSES.split(',') : null, BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || 'qa-out/brandwear', HI = +process.env.HI || 1.2, BR = process.env.BRAND || 'al';
fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const info = await p.evaluate((BR) => { const x = window.__qb.x(), I = QBLoft.data.items;
    return x.SHOP.filter((q) => q[6] && q[6].gar && q[6].gar.indexOf(BR + '_') === 0).map((q) => ({ id: q[0], type: q[1], name: q[2], price: q[3], desc: q[5], gar: q[6].gar, mo: !!q[6].mo, fo: !!q[6].fo, slot: (I[q[6].gar] || {}).slot, item: I[q[6].gar] ? { maleOnly: !!I[q[6].gar].maleOnly, femaleOnly: !!I[q[6].gar].femaleOnly, frontOnly: !!I[q[6].gar].frontOnly } : null })); }, BR);
  fs.writeFileSync(OUT + '/rows.json', JSON.stringify(info, null, 1));
  info.forEach((r) => console.log(r.id.padEnd(16), r.type.padEnd(8), (r.slot || '-').padEnd(8), (r.mo ? 'mo ' : '') + (r.fo ? 'fo ' : '') + JSON.stringify(r.item), '|', r.name));
  // icon sheet
  const icon = await p.evaluate(async (L) => { const cols = 5, cw = 260, ch = 250, cv = document.createElement('canvas'); cv.width = cols * cw; cv.height = Math.ceil(L.length / cols) * ch; const g = cv.getContext('2d'); g.fillStyle = '#f4f1ec'; g.fillRect(0, 0, cv.width, cv.height); const miss = [];
    for (let i = 0; i < L.length; i++) { const it = L[i], x = (i % cols) * cw, y = Math.floor(i / cols) * ch; g.fillStyle = '#fff'; g.fillRect(x + 4, y + 4, cw - 8, ch - 8); const k0 = 'icon_' + it.gar + '.webp';
      const im = await new Promise((ok) => { const m = new Image(); m.onload = () => ok(m); m.onerror = () => ok(null); m.src = (window.QBART && QBART[k0]) || ('../art/app/' + k0); });
      if (im) { const k = Math.min(200 / im.width, 170 / im.height); g.drawImage(im, x + (cw - im.width * k) / 2, y + 8 + (170 - im.height * k) / 2, im.width * k, im.height * k); } else { miss.push(k0); g.fillStyle = '#c00'; g.fillText('NO ICON', x + 100, y + 90); }
      g.fillStyle = '#222'; g.font = 'bold 13px sans-serif'; g.fillText(it.name.slice(0, 32), x + 10, y + 198); g.font = '12px sans-serif'; g.fillText(it.id + ' | ' + it.slot + (it.mo ? ' | men' : '') + (it.fo ? ' | women' : ''), x + 10, y + 215); g.fillText(it.desc.slice(0, 38), x + 10, y + 232); }
    return { png: cv.toDataURL('image/png'), miss }; }, info);
  fs.writeFileSync(OUT + '/icons.png', Buffer.from(icon.png.split(',')[1], 'base64')); console.log('icons missing:', JSON.stringify(icon.miss));
  for (const body of ['m', 'f']) {
    const r = await p.evaluate(async ([info, body, HI, POSES]) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items;
      const { clips, ...poses } = Q.poses; const names = POSES ? POSES.filter((k) => poses[k]) : Object.keys(poses);
      const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
        assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
      const ok = info.filter((r) => !(body === 'm' && (r.fo || (r.item && r.item.femaleOnly))) && !(body === 'f' && (r.mo || (r.item && r.item.maleOnly))));
      const byType = {}; ok.forEach((r) => { (byType[r.type] = byType[r.type] || []).push(r); });
      // other brands' pieces to mix in, by type
      const other = {}; x.SHOP.forEach((q) => { const m = q[6] || {}; if (!m.gar || !I[m.gar] || m.gar.indexOf(info[0].gar.split('_')[0] + '_') === 0) return; const it = I[m.gar]; if ((body === 'm' && (m.fo || it.femaleOnly)) || (body === 'f' && (m.mo || it.maleOnly))) return; (other[q[1]] = other[q[1]] || []).push(q[0]); });
      const n = Math.max(...Object.values(byType).map((a) => a.length)), rows = [];
      for (let i = 0; i < n; i++) { const o = {}; Object.keys(byType).forEach((t) => { const a = byType[t]; o[t] = a[i % a.length].id; }); rows.push({ ovr: o, hair: ['h1', 'h2', 'h3'][i % 3], tag: 'all brand' }); }
      // each piece of the brand alone with other brands' pieces around it (only its own slot from the brand)
      ok.forEach((r, i) => { const o = {}; o[r.type] = r.id; ['a_top', 'a_pants', 'a_shoes', 'a_hat'].forEach((t) => { if (t !== r.type && other[t] && other[t].length) o[t] = other[t][(i * 7 + t.length) % other[t].length]; }); rows.push({ ovr: o, hair: ['h3', 'h1', 'h2'][i % 3], tag: 'mixed' }); });
      const cw = Math.round(64 * HI), chh = Math.round(100 * HI), top = 24, left = 230;
      const cv = document.createElement('canvas'); cv.width = left + names.length * cw; cv.height = top + rows.length * chh; const g = cv.getContext('2d');
      g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.font = 'bold 10px sans-serif'; g.fillStyle = '#fff'; names.forEach((nm, i) => g.fillText(nm.slice(0, 11), left + i * cw + 2, 16));
      let bad = 0; const labels = [];
      for (let w = 0; w < rows.length; w++) { const R = rows[w]; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: body }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body, hairStyle: R.hair, hairColor: 'brown' }); S.owned = S.owned || {}; Object.values(R.ovr).forEach((id) => { S.owned[id] = true; });
        const L = window.__qb.lookOf(R.ovr), ch = L.rig; const eq = Object.keys(ch.equipped || {}).map((s) => s + ':' + ((ch.equipped[s] || {}).art || '?'));
        const lab = R.tag + ' ' + R.hair + ' | ' + Object.values(R.ovr).map((id) => id.replace(/^g[x]?_/, '')).join(' '); labels.push(lab + ' || ' + eq.join(' '));
        g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; const words = lab.split(' '); let line = '', ly = top + w * chh + 16; words.forEach((wd) => { if ((line + wd).length > 34) { g.fillText(line, 4, ly); ly += 13; line = ''; } line += wd + ' '; }); g.fillText(line, 4, ly);
        for (let i = 0; i < names.length; i++) { const X = left + i * cw, Y = top + w * chh;
          try { const c = await rig.render(QBLook.build(Q.creator, ch), names[i]); g.drawImage(c, X, Y, cw, chh); } catch (e) { bad++; g.fillStyle = '#c00'; g.fillText('NOT DRAWN', X + 2, Y + chh / 2); } } }
      return { png: cv.toDataURL('image/png'), rows: rows.length, poses: names.length, bad, labels }; }, [info, body, HI, POSES]);
    fs.writeFileSync(OUT + `/wear_${body}.png`, Buffer.from(r.png.split(',')[1], 'base64'));
    console.log(`body ${body}: outfits ${r.rows}, poses ${r.poses}, not drawn ${r.bad}`); r.labels.forEach((l) => console.log('  ' + l));
  }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 3))); await b.close(); })();
