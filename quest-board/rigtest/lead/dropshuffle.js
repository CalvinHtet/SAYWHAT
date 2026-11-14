// Brand drops in a shuffled order (Cal via ROOMS, 2026-11-14): the Street floor brand on each drop day for 80 drop days, the live pair and the Wednesday vault, as JSON. Run it on two builds and compare: the slots before DROPS.shuf0 must match the old order, later ones are shuffled, each round of N slots has every brand once, no brand drops while still live.   NODE_PATH=<playwright parent> node rigtest/lead/dropshuffle.js <port of a plain build>
const pw = require('playwright'); const PORT = process.argv[2] || 8766;
(async () => { const b = await pw.chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const D = window.__qbDrops, x = window.__qb.x(); const S = x.S; S.created = true; S.xp = x.cum(40);
    const fl = D.floors().map((F) => F.id); const out = { floors: fl, cfg: { cal0: D.cfg.cal0, on: D.cfg.on, live: D.cfg.live, rerun: D.cfg.rerun }, seq: [], wed: [], liveBad: 0 };
    const add = (ymd, k) => { const a = ymd.split('-').map(Number); return new Date(Date.UTC(a[0], a[1] - 1, a[2] + k)).toISOString().slice(0, 10); };
    let day = D.cfg.cal0, prev = null;
    for (let i = 0; i < 420 && out.seq.length < 80; i++) { const t = D.start(day) + 3600e3; const d = D.floor('street', t); const ids = d.live.map((q) => q.id);
      if (new Set(ids).size !== ids.length) out.liveBad++;
      const newest = d.live[d.live.length - 1]; if (newest && newest.start === day) out.seq.push(day + ':' + newest.id);
      if (new Date(day + 'T12:00:00Z').getUTCDay() === 3) { const bk = D.back(t); out.wed.push(day + ':' + (bk ? bk.id : '-')); }
      day = add(day, 1); }
    return out; });
  console.log(JSON.stringify(r)); console.log('errors', JSON.stringify(errs.slice(0, 3))); await b.close(); })();
