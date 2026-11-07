// A painted yawn top (ROOMS's yawn pictures) worn in the stretch (frame 12, the painted pose) with every hairstyle and every neck
// item, on both bodies, drawn the game's own way (QBLoft.warm + frameOrNear). One sheet per top and body: rows are hairstyles,
// columns are none + each neck item.   BASE=<server> OUT=<folder> TOPS=a,b node yawnsweep.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const TOPS = (process.env.TOPS || 'nc_hoodie').split(','), F = +(process.env.F || 12);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 600, height: 800 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 140)));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1500);
  const necks = await p.evaluate(() => { const x = window.__qb.x(), I = window.QBLoft.data.items || {}; return x.SHOP.filter((q) => q[6] && q[6].gar && I[q[6].gar] && I[q[6].gar].slot === 'neck').map((q) => q[0]); });
  console.log('neck items:', necks.length);
  for (const top of TOPS) for (const body of ['m', 'f']) {
    const res = await p.evaluate(async ([top, body, necks, F]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const out = []; const hairs = [];
      const it = x.SHOP.find((q) => q[6] && q[6].gar === top); if (!it) return { skip: 'no item' };
      for (const hs of ['h1', 'h2', 'h3']) { S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: body }); S.char.rig = Object.assign({}, window.QBLoft.data.creator.defaults, { body, hairStyle: hs, hairColor: 'brown' }); S.owned = S.owned || {}; S.owned[it[0]] = true;
        for (const nk of [null].concat(necks)) { const ovr = {}; ovr[it[1]] = it[0]; if (nk) { const q = x.SHOP.find((z) => z[0] === nk); S.owned[nk] = true; ovr[q[1]] = nk; }
          const L = window.__qb.lookOf(ovr), ch = L.rig; if (!hairs.includes(hs + '=' + ch.hairStyle)) hairs.push(hs + '=' + (ch.hairStyle || ch.hair || JSON.stringify(ch).slice(0, 60))); window.QBLoft.warm(ch, 'stretch'); let u = null, t = 0; while (!u && t++ < 80) { u = window.QBLoft.frame(ch, 'stretch', F); if (!u) await w(120); }
          if (u && u.startsWith('blob:')) { const bl = await (await fetch(u)).blob(); u = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(bl); }); } out.push([hs, nk || 'none', u]); } }
      return { out, hairs }; }, [top, body, necks, F]);
    if (res.skip) { console.log(top, body, res.skip); continue; }
    res.out.forEach(([hs, nk, u]) => { if (u) fs.writeFileSync(path.join(OUT, `sw_${top}_${body}_${hs}_${nk}.png`), Buffer.from(u.split(',')[1], 'base64')); });
    console.log(`  ${top} ${body}: ${res.out.filter((q) => q[2]).length} of ${res.out.length} drawn; hair styles ${res.hairs.join(' ')}`);
  }
  console.log('page errors', errs.length, errs.slice(0, 2)); await b.close();
})();
