// LEAD's hairFront slot (4f30ef5) with ROOMS's f_h1front_front.webp (30d93a9): the long hair's front lock drawn over the near shoulder
// after the sleeve. Drawn the game's own way (QBLoft.warm + QBLoft.frame) on BASE0 (before) and BASE (after). Cases:
//  A  f h1, every top that fits her, in idle 0, walk 4, sit 0, stretch 12 (front views: the lock may change these)
//  B  f h1 in four hair colours, idle 0 (the lock takes the hair's colour)
//  C  f h1 with hats (the hat's hair clip trims the lock like the hair), idle 0 and walk 4
//  D  f h1 back views (back 0, walkBack 4): must be pixel-identical
//  E  m h1/h2/h3 and f h2/h3 with a few tops in idle, walk, stretch: must be pixel-identical
// Writes hf_<case>_<build>_<label>.png and lists which pictures changed.   BASE0=<before> BASE=<after> OUT=<folder> node hairfront.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  let cases = null;
  for (const [tag, base] of [['before', process.env.BASE0], ['after', process.env.BASE]]) {
    const p = await (await b.newContext({ viewport: { width: 600, height: 800 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
    if (!cases) cases = await p.evaluate(() => { const x = window.__qb.x(), I = window.QBLoft.data.items || {}; const fits = (q, b) => !((q[6].fo && b !== 'f') || (q[6].mo && b !== 'm'));
      const tops = x.SHOP.filter((q) => q[6] && q[6].gar && I[q[6].gar] && I[q[6].gar].slot === 'top' && fits(q, 'f')).map((q) => q[6].gar);
      const hats = ['gp_cathood', 'sm_halomask', 'o_beanie', 'km_straw', 'al_bucket', 'gp_bow'].filter((g) => x.SHOP.some((q) => q[6] && q[6].gar === g));
      const out = []; const FRONT = [['idle', 0], ['walk', 4], ['sit', 0], ['stretch', 12]];
      ['tee', ...tops].forEach((t) => FRONT.forEach(([c, f]) => out.push({ k: 'A', label: `${t}_${c}${f}`, body: 'f', hs: 'h1', hc: 'brown', top: t, clip: c, f })));
      ['black', 'brown', 'blonde', 'auburn'].forEach((hc) => ['tee', 'kp_hoodie', 'sv_ski'].forEach((t) => out.push({ k: 'B', label: `${hc}_${t}`, body: 'f', hs: 'h1', hc, top: t, clip: 'idle', f: 0 })));
      hats.forEach((h) => [['idle', 0], ['walk', 4]].forEach(([c, f]) => out.push({ k: 'C', label: `${h}_${c}${f}`, body: 'f', hs: 'h1', hc: 'brown', top: 'kp_hoodie', hat: h, clip: c, f })));
      ['tee', 'kp_hoodie', 'sv_ski', 'bb_cloak'].forEach((t) => [['back', 0], ['walkBack', 4]].forEach(([c, f]) => out.push({ k: 'D', label: `${t}_${c}${f}`, body: 'f', hs: 'h1', hc: 'brown', top: t, clip: c, f })));
      [['m', 'h1'], ['m', 'h2'], ['m', 'h3'], ['f', 'h2'], ['f', 'h3']].forEach(([bd, hs]) => ['tee', 'kp_hoodie', 'sv_ski'].forEach((t) => [['idle', 0], ['walk', 4], ['stretch', 12]].forEach(([c, f]) => out.push({ k: 'E', label: `${bd}${hs}_${t}_${c}${f}`, body: bd, hs, hc: 'brown', top: t, clip: c, f }))));
      return out; });
    const shots = await p.evaluate(async (cases) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const res = {};
      for (const cs of cases) { S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: cs.body }); S.char.rig = Object.assign({}, window.QBLoft.data.creator.defaults, { body: cs.body, hairStyle: cs.hs, hairColor: cs.hc }); S.owned = S.owned || {};
        const ovr = {}; for (const g of [cs.top, cs.hat]) { if (!g || g === 'tee') continue; const q = x.SHOP.find((z) => z[6] && z[6].gar === g); if (!q) continue; S.owned[q[0]] = true; ovr[q[1]] = q[0]; }
        const ch = window.__qb.lookOf(ovr).rig; window.QBLoft.warm(ch, cs.clip); let u = null, t = 0; while (!u && t++ < 100) { u = window.QBLoft.frame(ch, cs.clip, cs.f); if (!u) await w(120); }
        if (u && u.startsWith('blob:')) { const bl = await (await fetch(u)).blob(); u = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(bl); }); }
        res[cs.k + '_' + cs.label] = u; }
      return res; }, cases);
    Object.entries(shots).forEach(([k, u]) => { if (u && u.startsWith('data:image/')) fs.writeFileSync(path.join(OUT, `hf_${tag}_${k}.png`), Buffer.from(u.split(',')[1], 'base64')); });
    console.log(`  ${tag}: ${Object.values(shots).filter(Boolean).length} of ${cases.length} drawn, page errors ${errs.length}`, errs.slice(0, 2)); await p.context().close();
  }
  fs.writeFileSync(path.join(OUT, 'cases.json'), JSON.stringify(cases)); await b.close();
})();
