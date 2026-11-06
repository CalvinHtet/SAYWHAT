// ROOMS's painted Garden lots (4725457, cd73831, 5fa3fec): Back Plot, Kitchen Garden (g_x1) and Garden Estate (g_x2), each
// bare and fully bought. Pictures in one sheet, the shell drawn, and the audit (pieces outside the lot, depth, overlaps).
//   OUT=<folder> node gardenlots.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const SIZES = [['Back Plot', []], ['Kitchen Garden', ['g_x1']], ['Garden Estate', ['g_x1', 'g_x2']]];
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'garden')) S.base.slots.push({ t: 'garden', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'garden'); });
  const cells = [], lines = [];
  for (const [name, exp] of SIZES) for (const full of [false, true]) {
    const n = await p.evaluate(({ i, exp, full }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; exp.forEach((k) => (r.a[k] = 1));
      if (full) x.ADDONS.garden.forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; if (/^g_x\d$/.test(u[0])) return; r.a[u[0]] = 1; });
      return Object.keys(r.a).length; }, { i, exp, full });
    await openRoom(p, i, 1000, 760);
    const shell = await p.evaluate(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/gdw_s[0-9]/) || [])[0]).filter(Boolean))].join(','));
    const a = await audit(p, i);
    const lab = `${name}, ${full ? 'fully bought' : 'bare'}`;
    const f = path.join(OUT, `gd_${cells.length}.png`); await (await p.$('#qahost')).screenshot({ path: f }); cells.push({ f, lab: lab + ' · ' + (shell || 'no shell') });
    lines.push(`${lab}: shell ${shell || 'NONE'}, ${n} upgrades, ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.overlap.length ? `, overlaps ${a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ')}` : '') + (a.depth.length ? `, depth: ${a.depth.slice(0, 4).join('; ')}` : '') + (a.stations.length ? `, spots: ${[...new Set(a.stations)].slice(0, 4).join('; ')}` : ''));
  }
  const html = cells.map((c) => `<figure><img src="data:image/png;base64,${fs.readFileSync(c.f).toString('base64')}"><figcaption>${c.lab}</figcaption></figure>`).join('');
  const sp = await b.newPage({ viewport: { width: 1500, height: 800 } });
  await sp.setContent(`<style>body{margin:0;background:#111;color:#eee;font:12px system-ui}div{display:grid;grid-template-columns:repeat(2,600px);gap:8px;padding:8px}img{width:600px;display:block}figure{margin:0}</style><div>${html}</div>`);
  await sp.screenshot({ path: path.join(OUT, 'gardenlots.png'), fullPage: true });
  lines.forEach((l) => console.log('  ' + l));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
