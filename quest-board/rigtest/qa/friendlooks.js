// Every friend's outfit (29k_friends FRIENDS, portrait pieces included) drawn the game's own way (QBLoft.warm + frame, so the
// painted yawn pictures show in the stretch) on both bodies in every clip: idle, walk, stretch (every other frame: the yawn),
// sit, type, sleep, back, walkBack, sitBack. One sheet per friend: rows are body and clip, columns are frames. Also lists any
// frame that never drew and any piece the friend wears that the game has no art for.   BASE=<server> OUT=<folder> [WHO=a,b] node friendlooks.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/friendlooks'; fs.mkdirSync(OUT, { recursive: true });
const CLIPS = { idle: [0, 6, 12, 18], walk: [0, 4, 8, 12], stretch: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], sit: [0, 12], type: [0, 6], sleep: [0, 4], back: [0, 12], walkBack: [0, 4, 8, 12], sitBack: [0, 2] };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 1000 } })).newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qbFriends && window.QBLoft && window.QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  const who = process.env.WHO ? process.env.WHO.split(',') : await p.evaluate(() => Object.keys(window.__qbFriends.friends));
  let bad = 0;
  for (const id of who) {
    const r = await p.evaluate(async ([id, CLIPS]) => {
      const w = (ms) => new Promise((o) => setTimeout(o, ms)), F = window.__qbFriends.friends[id], I = window.QBLoft.data.items || {};
      const missing = (F.spec.eq || []).filter((g) => !I[g]);
      const rows = [], fails = [];
      for (const body of [F.spec.body, F.spec.body === 'm' ? 'f' : 'm']) {
        // on the other body a piece cut for one body only is left off, as the Shop would
        const eq = (F.spec.eq || []).filter((g) => I[g] && !(body === 'm' && I[g].femaleOnly) && !(body === 'f' && I[g].maleOnly));
        const ch = window.__qbFriends.look(Object.assign({}, F.spec, { body, eq })).rig;
        for (const clip of Object.keys(CLIPS)) {
          window.QBLoft.warm(ch, clip); const cells = [];
          for (const f of CLIPS[clip]) { let u = null, t = 0; while (!u && t++ < 120) { u = window.QBLoft.frame(ch, clip, f); if (!u) await w(100); } if (!u) fails.push(body + ' ' + clip + ' ' + f); cells.push(u); }
          rows.push({ label: body + ' ' + clip, cells, off: (F.spec.eq || []).filter((g) => !eq.includes(g)) });
        }
      }
      // contact sheet
      const cw = 110, chh = 150, cols = 12, lw = 90, cv = document.createElement('canvas'); cv.width = lw + cols * cw; cv.height = rows.length * chh + 24;
      const g = cv.getContext('2d'); g.fillStyle = '#d9d4cc'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#222'; g.font = 'bold 14px sans-serif';
      g.fillText(id + ' (' + F.spec.body + '): ' + (F.spec.eq || []).join(', '), 6, 16);
      for (let ri = 0; ri < rows.length; ri++) { const R = rows[ri], y = 24 + ri * chh; g.font = '12px sans-serif'; g.fillStyle = '#222'; g.fillText(R.label, 4, y + 20); if (R.off.length && ri % 9 === 0) g.fillText('no ' + R.off.join(','), 4, y + 36);
        for (let ci = 0; ci < R.cells.length; ci++) { const u = R.cells[ci]; if (!u) { g.fillStyle = '#c00'; g.fillText('MISSING', lw + ci * cw + 20, y + 70); continue; }
          const im = await new Promise((ok) => { const m = new Image(); m.onload = () => ok(m); m.onerror = () => ok(null); m.src = u; }); if (!im) { g.fillStyle = '#c00'; g.fillText('BROKEN', lw + ci * cw + 20, y + 70); continue; }
          const s = Math.min((cw - 4) / im.width, (chh - 4) / im.height); g.drawImage(im, lw + ci * cw + (cw - im.width * s) / 2, y + (chh - im.height * s) / 2, im.width * s, im.height * s); } }
      return { png: cv.toDataURL('image/png'), fails, missing, n: rows.reduce((a, R) => a + R.cells.length, 0) };
    }, [id, CLIPS]);
    fs.writeFileSync(path.join(OUT, `friend_${id}.png`), Buffer.from(r.png.split(',')[1], 'base64'));
    if (r.fails.length || r.missing.length) bad++;
    console.log(`  ${id}: ${r.n - r.fails.length} of ${r.n} frames drawn` + (r.fails.length ? ' MISSING ' + r.fails.slice(0, 6).join('; ') : '') + (r.missing.length ? ' NO ART FOR ' + r.missing.join(',') : ''));
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); console.log(bad || errs.length ? 'FAIL' : 'PASS'); await b.close(); process.exit(bad || errs.length ? 1 : 0);
})();
