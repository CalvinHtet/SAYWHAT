// Lock and Key's Friday Band (ROOMS's fe48618): the card shows only once the Jazz Corner (sb_stage) is owned; bought, the mic stage
// leaves the picture and the band stage takes its corner, clear of the door mat and the high-tops; More High-Tops is one table.
// Pictures with the Jazz Corner and with the band, everything else bought.
//   OUT=<folder> node band.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'skybar')) S.base.slots.push({ t: 'skybar', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'skybar'); });
  const cards = (own) => p.evaluate(async ({ i, own }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; own.forEach((k) => (r.a[k] = 1)); x.S.coins = 9e6;
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); await new Promise((o) => setTimeout(o, 400));
    const all = [...document.querySelectorAll('.rmodal .addon')]; const band = all.find((e) => e.querySelector('[data-id="sb_band"]') || /Friday Band/.test(e.innerText));
    return { shown: !!band, buy: !!document.querySelector('.rmodal [data-act="raddon"][data-id="sb_band"]'), mystery: band ? band.classList.contains('mystery') : null }; }, { i, own });
  const ids = await p.evaluate(() => window.__qb.x().ADDONS.skybar.map((u) => u[0] + ':' + u[1]));
  console.log('upgrades:', ids.join(', '));
  const others = await p.evaluate(() => window.__qb.x().ADDONS.skybar.filter((u) => !(u[3] && (u[3].retired || u[3].opens)) && !['sb_band', 'sb_stage'].includes(u[0])).map((u) => u[0]));
  const c0 = await cards(others); t(!c0.buy, `without the Jazz Corner: Friday Band for sale ${c0.buy} (card shown ${c0.shown}, mystery ${c0.mystery})`);
  const c1 = await cards(others.concat(['sb_stage'])); t(c1.buy, `with the Jazz Corner: Friday Band for sale ${c1.buy}`);
  for (const [lab, own] of [['jazz', others.concat(['sb_stage'])], ['band', others.concat(['sb_stage', 'sb_band'])]]) {
    await p.evaluate(({ i, own }) => { const r = window.__qb.x().S.base.slots[i]; r.a = {}; own.forEach((k) => (r.a[k] = 1)); }, { i, own });
    await openRoom(p, i, 1000, 760);
    const keys = await p.evaluate(() => [...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/sbx_[a-z0-9]+/) || [])[0]).filter(Boolean));
    const a = await audit(p, i);
    const his = keys.filter((k) => k === 'sbx_hi').length;
    console.log(`  ${lab}: stage art ${keys.filter((k) => /stage|band|mic|drum|bass/.test(k)).join(',') || 'none'}; high-top tables drawn ${his}`);
    t(!a.outside.length && !a.overlap.filter((o) => /stage|band|mic|drum|bass|mat/.test(o.join(' '))).length, `${lab}: nothing outside, the stage overlaps nothing` + (a.outside.length ? ' OUTSIDE ' + a.outside.join(' ') : '') + (a.overlap.length ? ' overlaps ' + a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ') : ''));
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `lockkey_${lab}.png`) });
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
