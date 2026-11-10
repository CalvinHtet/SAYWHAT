// W11 (Cal, 2026-11-10: "print me a page of all the friend character visitors that are in the game? Put it all on one page with
// their names above them"). Every friend in 29k_friends.js (window.__qbFriends.friends, so new ones come in by themselves) drawn
// by the game's own rig (QBLoft.warm + QBLoft.frame, the idle front view, frame 0) in their visit outfit (fvLook of their spec),
// all at one scale so heights compare, in a grid on a light background with each name above. Also lists any piece a friend's
// spec names that the game has no art for (fvLook drops those silently) and any frame that never drew.
//   BASE=http://127.0.0.1:8810 OUT=docs/friends-sheet.png bash tools/windows/node.sh rigtest/qa/friendsheet.js
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', OUT = process.env.OUT || 'docs/friends-sheet.png';
const COLS = +process.env.COLS || 5;
(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true, phone: false, width: 1400, height: 1000, dpr: 1 });
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qbFriends && window.QBLoft && QBLoft.data && QBLoft.data.items && QBLoft.frame)', 120000);
  await sleep(1500);
  const r = await pg.ev(`(async () => {
    const w = (ms) => new Promise((o) => setTimeout(o, ms)), D = QBLoft.data, I = D.items || {}, FR = window.__qbFriends.friends;
    const ids = Object.keys(FR), out = [];
    // HI > 1: the same rig, data and pose, drawn at HI times the room's frame size (sharper print); 1: QBLoft's own frames
    const HI = ${+process.env.HI || 1}, Q = window.QBDATA;
    let big = null;
    if (HI > 1) { const { clips, ...poses } = Q.poses; big = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }),
      bodies: Q.bodies, poses, clips, assetUrl: (p) => (window.QBART && QBART[p]) || Q.loft.artBase + p + (Q.arthash && Q.arthash[p] ? '?h=' + Q.arthash[p] : '') }); }
    for (const id of ids) {
      const F = FR[id], ch = window.__qbFriends.look(F.spec).rig;
      let u = null, t = 0;
      if (big) { const c = await big.render(QBLook.build(Q.creator, ch), big.clipPose('idle', 0)); u = c.toDataURL ? c.toDataURL('image/png') : null; }
      else { QBLoft.warm(ch, 'idle'); while (!u && t++ < 150) { u = QBLoft.frame(ch, 'idle', 0); if (!u) await w(100); } }
      const im = u ? await new Promise((ok) => { const m = new Image(); m.onload = () => ok(m); m.onerror = () => ok(null); m.src = u; }) : null;
      out.push({ id, name: F.name, body: F.spec.body, hair: F.spec.hairStyle, eq: F.spec.eq || [], noArt: (F.spec.eq || []).filter((g) => !I[g]),
        hairArt: !!(D.creator && JSON.stringify(D.creator).indexOf('"' + F.spec.hairStyle + '"') >= 0) || !!I[F.spec.hairStyle],
        slots: Object.keys(ch.equipped || {}), im, w: im ? im.width : 0, h: im ? im.height : 0 });
    }
    // trim each frame to its drawn pixels so the grid sits tight, keeping one scale for everybody
    const box = (im) => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return x1 < 0 ? null : { x0, y0, x1, y1 }; };
    out.forEach((o) => { o.bb = o.im ? box(o.im) : null; });
    const ok = out.filter((o) => o.bb);
    const maxW = Math.max(...ok.map((o) => o.bb.x1 - o.bb.x0 + 1)), maxH = Math.max(...ok.map((o) => o.bb.y1 - o.bb.y0 + 1));
    const S = Math.min(1, 300 * HI / maxH, 200 * HI / maxW), cols = ${COLS}, rows = Math.ceil(out.length / cols);
    const cw = Math.ceil(Math.max(maxW * S, 150 * HI) + 36 * HI), nameH = 46 * HI, ch = Math.ceil(maxH * S + nameH + 28 * HI), top = 70 * HI, pad = 24 * HI;
    const cv = document.createElement('canvas'); cv.width = cols * cw + pad * 2; cv.height = top + rows * ch + pad;
    const g = cv.getContext('2d'); g.fillStyle = '#f6f3ee'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#2a2420'; g.font = 'bold ' + 26 * HI + 'px Segoe UI, Arial, sans-serif'; g.textAlign = 'center';
    g.fillText('SAYWHAT friend visitors (' + out.length + ')', cv.width / 2, 44 * HI);
    out.forEach((o, i) => {
      const r = Math.floor(i / cols), inRow = Math.min(cols, out.length - r * cols), c = i % cols;
      const x = pad + (cols - inRow) * cw / 2 + c * cw, y = top + r * ch;
      g.fillStyle = '#ffffff'; g.strokeStyle = '#e2dcd2'; g.lineWidth = 2 * HI; g.beginPath(); g.roundRect(x + 6 * HI, y + 4 * HI, cw - 12 * HI, ch - 12 * HI, 14 * HI); g.fill(); g.stroke();
      g.fillStyle = '#2a2420'; g.font = 'bold ' + 24 * HI + 'px Segoe UI, Arial, sans-serif'; g.textAlign = 'center'; g.fillText(o.name, x + cw / 2, y + 36 * HI);
      if (!o.bb) { g.fillStyle = '#c00'; g.font = 'bold 16px sans-serif'; g.fillText('NOT DRAWN', x + cw / 2, y + ch / 2); return; }
      const bw = o.bb.x1 - o.bb.x0 + 1, bh = o.bb.y1 - o.bb.y0 + 1, dw = bw * S, dh = bh * S;
      g.imageSmoothingQuality = 'high';
      // feet on one line per row
      g.drawImage(o.im, o.bb.x0, o.bb.y0, bw, bh, x + (cw - dw) / 2, y + nameH + 8 * HI + (maxH * S - dh), dw, dh);
    });
    return { png: cv.toDataURL('image/png'), size: [cv.width, cv.height], scale: S, frame: [out[0].w, out[0].h],
      list: out.map((o) => ({ id: o.id, name: o.name, body: o.body, hair: o.hair, eq: o.eq, noArt: o.noArt, slots: o.slots, drawn: !!o.bb, bb: o.bb })) };
  })()`, 180000);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(r.png.split(',')[1], 'base64'));
  console.log('sheet ' + OUT + ' ' + r.size.join('x') + ' scale ' + r.scale.toFixed(3) + ' frame ' + r.frame.join('x'));
  for (const o of r.list) console.log(`  ${o.id} (${o.name}, ${o.body}, hair ${o.hair}): ${o.drawn ? 'drawn' : 'NOT DRAWN'}; slots ${o.slots.join(',')}; eq ${o.eq.join(',')}` + (o.noArt.length ? '; NO ART FOR ' + o.noArt.join(',') : ''));
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.message); process.exit(1); });
