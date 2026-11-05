// ROOMS's Bedroom wall tiers (f4362b1): in each of the Bedroom's Room styles, the walls bare, then Fresh Paint, Living Grass
// Wall and Cove Lighting bought in turn through the room window. Every other Bedroom upgrade owned, so the furniture is in.
//   OUT=<folder> node loft.js   -> <OUT>/loft_walls.png (one row per style, one column per tier) and the pixels each tier changed
const fs = require('fs'), path = require('path');
const { open, openRoom, diff } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const TIERS = ['bd_wt2', 'bd_wt3', 'bd_wt4'];
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1000, owned: 'none' });
  const i = await p.evaluate((TIERS) => { const x = window.__qb.x(), S = x.S, r = S.base.slots[0];
    r.a = Object.fromEntries((x.ADDONS.bedroom || []).filter((u) => !TIERS.includes(u[0])).map((u) => [u[0], 1])); return 0; }, TIERS);
  // the styles the room window offers
  await openRoom(p, i);
  const styles = await p.evaluate(() => [...document.querySelectorAll('.rmodal .dst')].map((d) => ({ name: (d.querySelector('b') || {}).textContent, v: (d.querySelector('[data-v]') || { dataset: {} }).dataset.v || null, on: d.classList.contains('on') })));
  console.log('styles:', styles.map((s) => s.name + (s.on ? ' (on)' : '')).join(', '));
  const cells = [], report = [];
  for (const st of styles) {
    // pick the style through its own button (buy, then use), and take the walls back to bare
    await p.evaluate(({ v, TIERS }) => { const r = window.__qb.x().S.base.slots[0]; TIERS.forEach((k) => delete r.a[k]);
      if (!v) return; for (const a of ['decbuy', 'decuse']) { const bt = document.querySelector('.rmodal [data-act="' + a + '"][data-v="' + v + '"]'); if (bt) bt.click(); } }, { v: st.v, TIERS });
    let prev = null;
    for (let k = 0; k <= TIERS.length; k++) {
      if (k) await p.evaluate(({ id }) => { const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="' + id + '"]'); if (bt) bt.click(); }, { id: TIERS[k - 1] });
      await openRoom(p, i, 900, 700);
      const owned = await p.evaluate((TIERS) => TIERS.filter((t) => window.__qb.x().S.base.slots[0].a[t]), TIERS);
      const png = await (await p.$('#qahost')).screenshot();
      const f = path.join(OUT, `lw_${st.name.replace(/\W+/g, '_')}_${k}.png`); fs.writeFileSync(f, png);
      const ch = prev ? await diff(p, prev.toString('base64'), png.toString('base64')) : null; prev = png;
      cells.push({ f, lab: st.name + ' · ' + ['bare', 'Fresh Paint', 'Living Grass Wall', 'Cove Lighting'][k] + (ch ? ' · ' + ch.px + ' px' : '') + (k && owned.length !== k ? ' · NOT BOUGHT' : '') });
      if (ch) report.push(`${st.name} tier ${k}: ${ch.px} px changed${owned.length !== k ? ' (buy failed: owns ' + owned.join(',') + ')' : ''}`);
    }
  }
  const html = cells.map((c) => `<figure><img src="data:image/png;base64,${fs.readFileSync(c.f).toString('base64')}"><figcaption>${c.lab}</figcaption></figure>`).join('');
  const sp = await b.newPage({ viewport: { width: 1500, height: 800 } });
  await sp.setContent(`<style>body{margin:0;background:#120e20;color:#eee;font:13px system-ui}div{display:grid;grid-template-columns:repeat(4,360px);gap:8px;padding:8px}img{width:360px;height:280px;display:block}figure{margin:0}</style><div>${html}</div>`);
  await sp.screenshot({ path: path.join(OUT, 'loft_walls.png'), fullPage: true });
  report.forEach((l) => console.log('  ' + l));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
