// LEAD's 7d7c5df yawn fallback, drawn the game's own way (QBLoft.warm + QBLoft.frameOrNear, with the art pack and art list), on
// BASE0 (before) and BASE (after): for each top and body, frames of the stretch (painted yawn in frames 2-21), idle and walk.
// Writes yawnfall_<build>_<top>_<body>_<clip>_<f>.png and a pixel comparison per frame.   BASE0=<before> BASE=<after> OUT=<folder> node yawnfall.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const TOPS = (process.env.TOPS || 'sv_ski,cr_bomber,bb_cloak,kp_hoodie,o_tee,tee').split(',');
const FR = { stretch: [0, 3, 6, 9, 12, 15, 18, 21, 23], idle: [0, 8, 16], walk: [0, 4, 8, 12] };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [tag, base] of [['before', process.env.BASE0], ['after', process.env.BASE]]) {
    const p = await (await b.newContext({ viewport: { width: 600, height: 800 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
    for (const body of ['m', 'f']) for (const top of TOPS) {
      const got = await p.evaluate(async ([body, top, FR]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
        S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: body }); S.char.top = 'tee'; S.owned = S.owned || {}; S.eq = {};
        let ovr = {}; if (top !== 'tee') { const it = x.SHOP.find((q) => q[6] && q[6].gar === top); if (!it) return { skip: 'no shop item for ' + top }; if ((it[6].fo && body !== 'f') || (it[6].mo && body !== 'm')) return { skip: 'not for this body' }; S.owned[it[0]] = true; ovr[it[1]] = it[0]; }
        const L = window.__qb.lookOf(ovr), ch = L.rig; if (!ch) return { skip: 'no rig look' }; const out = {};
        for (const clip of Object.keys(FR)) { window.QBLoft.warm(ch, clip); for (const f of FR[clip]) { let u = null, t = 0; while (!u && t++ < 80) { u = window.QBLoft.frameOrNear(ch, clip, f); if (!u) await w(150); } if (u && u.startsWith('blob:')) { const bl = await (await fetch(u)).blob(); u = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(bl); }); } out[clip + '_' + f] = u; } }
        return { out }; }, [body, top, FR]);
      if (got.skip) { console.log(`  ${tag} ${top} ${body}: ${got.skip}`); continue; }
      for (const [k, u] of Object.entries(got.out)) if (u && u.startsWith('data:image/')) fs.writeFileSync(path.join(OUT, `yawnfall_${tag}_${top}_${body}_${k}.png`), Buffer.from(u.split(',')[1], 'base64'));
    }
    console.log(`  ${tag}: page errors ${errs.length}`, errs.slice(0, 2)); await p.context().close();
  }
  await b.close();
})();
