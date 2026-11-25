// Cal 11-24: brand drops Monday and Friday again (they were Monday and Thursday since 11-19), from Sat 11-28 so no drop that already
// happened moves; Wednesday's one-day vault brand as before. And a window opened while the save syncs can be closed (QA).
//   PORT=<plain build> NODE_PATH=<playwright's parent> node rigtest/lead/drops148.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const D = window.__qbDrops, x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(40); S.gates = [5, 10, 20, 30, 40]; try { window.__qbRooms.open('closet', 1); } catch (e) {}
    const wd = (ymd) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(ymd + 'T12:00:00Z').getUTCDay()], out = { street: [], boutique: [], line: [] };
    ['street', 'boutique'].forEach((fl) => { ['2026-11-20', '2026-11-25', '2026-11-27', '2026-12-01', '2026-12-05', '2026-12-08', '2026-12-12'].forEach((d) => { const f = D.floor(fl, D.start(d) + 12 * 36e5); out[fl].push(d + ' -> ' + (f.next ? f.next.start + ' ' + wd(f.next.start) : 'none')); }); });
    out.wed = ['2026-12-02', '2026-12-03'].map((d) => { const bk = D.back(D.start(d) + 12 * 36e5); return d + ':' + (bk ? 'vault ' + bk.id : 'none'); }); out.floors = D.floors().map((F) => F.id + ': ' + F.line); return out; });
  console.log(JSON.stringify(r, null, 1));
  const nx = (a) => a.map((s) => s.split(' -> ')[1]);
  /* Cal 11-25 (29zz_v172.js): one rotation, Mondays and Thursdays */ ok(nx(r.street).join() === '2026-11-23 Mon,2026-11-26 Thu,2026-11-30 Mon,2026-12-03 Thu,2026-12-07 Mon,2026-12-10 Thu,2026-12-14 Mon', 'Street: Mondays and Thursdays: ' + nx(r.street).join(' | '));
  ok(nx(r.boutique).every((s) => /none/.test(s)), 'Boutique: no drops of its own (its brands are in the one rotation): ' + nx(r.boutique).join(' | '));
  ok(r.floors.some((l) => /Mondays and Thursdays/.test(l)) && r.floors.every((l) => !/Friday/.test(l)), 'the floors say Mondays and Thursdays: ' + r.floors.join(' | '));
  const txt = await p.evaluate(() => /Mondays and Fridays|Monday and Friday/.test(document.documentElement.innerHTML)); ok(!txt, 'no "Mondays and Fridays" on screen');
  /* a window during sync can be closed */
  const cl = await p.evaluate(async () => { const x = window.__qb.x(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const bt = document.createElement('button'); bt.dataset.act = 'qbinfo'; bt.dataset.k = 'trial'; bt.style.display = 'none'; document.body.appendChild(bt); bt.click(); bt.remove(); /* v1.61: the Daily Quest's (i) moved into the profile; any (i) window will do */ await new Promise((r) => setTimeout(r, 300)); document.documentElement.classList.add('qb-sync'); await new Promise((r) => setTimeout(r, 100));
    const m = document.querySelector('#layer .modal'), xb = m && m.querySelector('.mx'), ok2 = m && m.querySelector('[data-act="mclose"]:not(.mx)'); const r = { modal: !!m, x: xb ? getComputedStyle(xb).pointerEvents : 'none?', btn: ok2 ? getComputedStyle(ok2).pointerEvents : 'n/a', other: m ? getComputedStyle(m.querySelector('p,h2')).pointerEvents : '' }; document.documentElement.classList.remove('qb-sync'); document.querySelectorAll('#layer .modal').forEach((q) => q.remove()); return r; });
  ok(cl.modal && cl.x === 'auto' && cl.other === 'none', 'while syncing a window\'s close button takes taps ' + JSON.stringify(cl));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
