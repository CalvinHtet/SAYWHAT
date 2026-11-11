// w-floors QA: a few prices on a reference build (eye styles, eye colors, Shadow Wings) to tell old prices from the floor bands
const { browser, sleep } = require('./cdp.js');
(async () => { const br = await browser();
  for (const B of ['http://127.0.0.1:8816', 'http://127.0.0.1:8819']) { const pg = await br.page({ fresh: true, phone: false, width: 800, height: 600 });
    await pg.go(B + '/'); await pg.wait('!!(window.__qb && window.__qb.x)', 120000); await sleep(800);
    console.log(B, JSON.stringify(await pg.ev(`window.__qb.x().SHOP.filter(function(s){return /^(et_|ey_mon|bk_wings|ac_crown|ac_halo)/.test(s[0])}).map(function(s){return s[0]+' '+s[1]+' '+(s._p0||s[3])})`)), 'errs', pg.errs.length); await pg.close(); }
  await br.close(); process.exit(0); })().catch((e) => { console.log('FAIL ' + e.message); process.exit(1); });
