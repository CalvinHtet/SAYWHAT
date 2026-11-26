// Cal 11-26 (29zz_v183.js): no time stamp on any photo; the checker is not asked for one; a town post shows its date and time.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/stamp183.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV183, null, { timeout: 90000 });
  const r = await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 400; c.height = 300; const x = c.getContext('2d'); x.fillStyle = '#4060a0'; x.fillRect(0, 0, 400, 300); const before = c.toDataURL();
    if (typeof window.qbStamp === 'function') window.qbStamp(c, 'NOV 26  3:15 PM'); const t = new Date(2026, 10, 26, 15, 15).getTime();
    const v = window.__qbV183.view({ id: 'u~' + t, u: 'u', t, name: 'Cal', cap: '', what: '', kind: 'photo', thumb: '', full: '', w: 1, h: 1 });
    return { same: c.toDataURL() === before, stamp: window.__qbV183.stamp(), when: (v.match(/<small>([^<]*)<\/small>/) || [])[1] || '' }; });
  ok(r.same, 'a photo is left untouched (no stamp burnt in)');
  ok(r.stamp === '', 'the photo checker is not asked to read a stamp');
  ok(/Nov 26/.test(r.when) && /3:15/.test(r.when), 'a town post shows its date and time: ' + r.when);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs)); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
