// Every Shop floor's drops, slot by slot, from FROM to TO (the brand that starts each drop day and what is live): run it on two builds
// and diff, to see exactly which slots a change to DROPS (holds, pins) moved. Cal (via ROOMS, 2026-11-16): "ship NICE COCK on friday".
//   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> [FROM=2026-11-13 TO=2027-01-31] node rigtest/lead/dropcal.js
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8779', FROM = process.env.FROM || '2026-11-13', TO = process.env.TO || '2027-01-31';
(async () => {
  const b = await chromium.launch({ args: ['--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qbDrops && window.__qb && window.__qb.x, null, { timeout: 90000 });
  const rows = await p.evaluate(({ FROM, TO }) => { const D = window.__qbDrops, out = [];
    const add = (s, k) => { const a = s.split('-').map(Number); return new Date(Date.UTC(a[0], a[1] - 1, a[2] + k)).toISOString().slice(0, 10); };
    for (let d = FROM; d <= TO; d = add(d, 1)) {
      const wd = new Date(d + 'T12:00:00Z').getUTCDay(); if (wd !== 1 && wd !== 5) continue;
      ['street', 'boutique', 'atelier'].forEach((id) => { const r = D.floor(id, D.start(d) + 3600e3); if (!r || !r.live) return;
        const nw = r.live.filter((x) => x.start === d).map((x) => x.id); out.push(d + ' ' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][wd] + ' ' + id.padEnd(8) + ' drops ' + (nw.join(',') || '-').padEnd(6) + ' live ' + r.live.map((x) => x.id).join(',')); }); }
    return out; }, { FROM, TO });
  rows.forEach((r) => console.log(r));
  await b.close();
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
