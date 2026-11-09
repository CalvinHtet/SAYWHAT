// ROOMS's b3d6b28: each Patio bed belongs to its dog. The real Bedroom window runs for SECS seconds with the Patio furnished and the beds
// as given; samples both dogs: where they lie down, whether one is ever on the other's bed, both on one spot, or standing in a
// Patio footprint.   STATE=one|two|chop|none SECS=150 node patiobeds.js
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', STATE = process.env.STATE || 'two', SECS = +(process.env.SECS || 150), OUT = process.env.OUT || 'qa-out';
const PT0 = ['pt_grass', 'pt_chair1', 'pt_egg', 'pt_plant', 'pt_table', 'pt_lights', 'pt_bowl', 'pt_rug', 'pt_cart'];
const BD = ['bd_bed2', 'bd_win2', 'bd_win3', 'bd_wt2', 'bd_dbed1', 'bd_pluto', 'bd_dbed2', 'bd_chop', 'bd_nstand', 'bd_rug'];
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 90000 });
  const PT = PT0.concat(STATE === 'one' ? ['pt_dbed'] : STATE === 'chop' ? ['pt_dbed2'] : STATE === 'two' ? ['pt_dbed', 'pt_dbed2'] : []);
  await p.evaluate(([BD, PT]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.areaOn = null; S.xp = x.cum(20); S.gates = Array.from({ length: 200 }, (_, i) => i);
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(BD.map((k) => [k, 1])), st: 0, pend: 0 }, { t: 'patio', a: Object.fromEntries(PT.map((k) => [k, 1])), st: 0, pend: 0 }]; x.render(); }, [BD, PT]);
  await p.evaluate(() => { const t = [...document.querySelectorAll('.nav button[data-v="hideout"]')][0]; if (t) t.click(); }); await p.waitForTimeout(1800);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelector('[data-act=bldgo]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(0); }); await p.waitForTimeout(2500);
  console.log(STATE, 'actors', await p.evaluate(() => Object.keys(window.__qbLoft().A).slice(0, 14).join(' ')));
  const R = { ox: 1.35, oy: -5.45, beds: (STATE === 'one' ? [[3.3, -1.4, 'pluto']] : STATE === 'chop' ? [[2.1, -1.4, 'chopstick']] : STATE === 'two' ? [[3.3, -1.4, 'pluto'], [2.1, -1.4, 'chopstick']] : []), spots: [], box: await p.evaluate(() => { const S = window.__qb.x().S, q = window.__qbLoft(), C = q.roomCtx(S.base.slots[1], 901); return ((C.nav && C.nav.obs) || []).map((o) => [o.x0, o.y0, o.x1, o.y1]); }) };
  R.box = R.box.filter((o) => !R.beds.some((q) => { const px = q[0] - R.ox, py = q[1] - R.oy; return px > o[0] && px < o[2] && py > o[1] && py < o[3]; }));
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(0); }); await p.waitForTimeout(1500);
  console.log(STATE, 'patio real:', R ? JSON.stringify({ beds: R.beds, spots: R.spots.length, boxes: R.box.length }) : 'not readable');
  const beds = {}, tally = {}; let same = 0, inBox = [], crossed = [], n = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < SECS * 1000) { await p.waitForTimeout(700);
    const st = await p.evaluate(() => { const A = window.__qbLoft().A; return ['pluto', 'chopstick'].map((d) => { const a = A['pv:dog:' + d]; return a ? { d, x: +a.x.toFixed(2), y: +a.y.toFixed(2), m: a.mode, sl: !!a.sleep, act: a.act || '', k: a.st && (a.st.kind || a.st) } : { d, none: 1 }; }); });
    n++;
    st.forEach((s) => { if (s.none) { tally[s.d + ':none'] = (tally[s.d + ':none'] || 0) + 1; return; } const w = s.y < -.3 ? 'patio' : 'inside'; const key = s.d + ':' + w + ':' + (s.m === 'do' ? (s.sl ? 'bed' : s.act) : 'walk'); tally[key] = (tally[key] || 0) + 1;
      if (s.m === 'do' && s.sl) { const k = s.d + '@' + s.x.toFixed(1) + ',' + s.y.toFixed(1); beds[k] = (beds[k] || 0) + 1; }
      if (R && s.y < -.3 && s.m !== 'do') { const px = s.x - R.ox, py = s.y - R.oy; const hit = R.box.find((o) => px > o[0] + .1 && px < o[2] - .1 && py > o[1] + .1 && py < o[3] - .1); if (hit) inBox.push(`${s.d} ${s.x},${s.y}`); }
      if (R && s.m === 'do' && s.sl && s.y < -.3) { const mine = R.beds.filter((q) => q[2] === s.d); const near = R.beds.find((q) => Math.hypot(q[0] - s.x, q[1] - s.y) < .5); if (near && near[2] !== s.d) crossed.push(`${s.d} on ${near[2]}'s`); if (!near && R.beds.length) crossed.push(`${s.d} lies at ${s.x},${s.y} with no bed`); } });
    if (st[0] && st[1] && !st[0].none && !st[1].none && Math.hypot(st[0].x - st[1].x, st[0].y - st[1].y) < .35 && st[0].m === 'do' && st[1].m === 'do') same++;
  }
  const el = await p.$('#rbigw'); if (el) await el.screenshot({ path: `${OUT}/patio_${STATE}.png` }).catch(() => {});
  console.log(STATE, 'samples', n, 'tally', JSON.stringify(tally)); console.log(STATE, 'lying at', JSON.stringify(beds)); console.log(STATE, 'both on one spot:', same, ' in a footprint while walking:', inBox.length, inBox.slice(0, 4).join(' | '), ' crossed:', crossed.length, [...new Set(crossed)].slice(0, 4).join(' | ')); console.log(STATE, 'errors', errs.slice(0, 3)); await b.close(); })().catch((e) => { console.error(e); process.exit(1); });
