// ROOMS's painted Restaurant shells (1eb8040, 156683a, 64e4735): each size (Hole in the Wall, Corner Diner, Bistro, Noir)
// bare and fully bought, with and without the Sidewalk Patio. Pictures in one sheet, and the audits per case: pieces
// outside the room, depth, spots inside furniture.
//   OUT=<folder> node restshell.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const SIZES = [['Hole in the Wall', []], ['Corner Diner', ['r_x1']], ['Bistro', ['r_x1', 'r_x2']], ['Noir', ['r_x1', 'r_x2', 'r_noir']]];
const EXP = ['r_x1', 'r_x2', 'r_noir'], PATIO = ['r_patio', 'r_p1', 'r_p2', 'r_p3', 'r_p4', 'r_p5', 'r_p6', 'r_p7'];
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'restaurant')) S.base.slots.push({ t: 'restaurant', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'restaurant'); });
  const cells = [], lines = [];
  for (const [name, exp] of SIZES) for (const full of [false, true]) for (const patio of [false, true]) {
    const own = await p.evaluate(({ i, exp, full, patio, EXP, PATIO }) => { const x = window.__qb.x(), r = x.S.base.slots[i];
      r.a = {}; exp.forEach((k) => (r.a[k] = 1)); if (patio) r.a.r_patio = 1;
      if (full) x.ADDONS.restaurant.forEach((u) => { if (u[3] && u[3].retired) return; if (EXP.includes(u[0])) return; if (PATIO.includes(u[0]) && !patio) return; r.a[u[0]] = 1; });
      return { n: Object.keys(r.a).length, shell: null }; }, { i, exp, full, patio, EXP, PATIO });
    await openRoom(p, i, 900, 700);
    const shell = await p.evaluate(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/rsw_s[0-9n]+/) || [])[0]).filter(Boolean))].join(','));
    const a = await audit(p, i);
    const lab = `${name}, ${full ? 'fully bought' : 'bare'}${patio ? ', with patio' : ''}`;
    const f = path.join(OUT, `rs_${cells.length}.png`); await (await p.$('#qahost')).screenshot({ path: f }); cells.push({ f, lab: lab + ' · shell ' + (shell || 'none') });
    lines.push(`${lab}: shell ${shell || 'NONE'}, ${own.n} upgrades, ${a.items.length} pieces` + (a.outside.length ? `, OUTSIDE ${a.outside.join(' ')}` : '') + (a.depth.length ? `, depth: ${a.depth.slice(0, 4).join('; ')}` : '') + (a.stations.length ? `, spots: ${[...new Set(a.stations)].slice(0, 4).join('; ')}` : '') + (a.stack.length ? `, STACKED ${a.stack.map((s) => s.slice(0, 2).join('+')).join(' ')}` : ''));
  }
  const html = cells.map((c) => `<figure><img src="data:image/png;base64,${fs.readFileSync(c.f).toString('base64')}"><figcaption>${c.lab}</figcaption></figure>`).join('');
  const sp = await b.newPage({ viewport: { width: 1500, height: 800 } });
  await sp.setContent(`<style>body{margin:0;background:#111;color:#eee;font:12px system-ui}div{display:grid;grid-template-columns:repeat(4,360px);gap:8px;padding:8px}img{width:360px;height:280px;display:block}figure{margin:0}</style><div>${html}</div>`);
  await sp.screenshot({ path: path.join(OUT, 'restshell.png'), fullPage: true });
  lines.forEach((l) => console.log('  ' + l));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
