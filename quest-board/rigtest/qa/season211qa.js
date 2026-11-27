// QA, f4ce0b0c (29zz_v211.js: seasonal brands). Two plain builds: OLD (before v211) and NEW. By moving the clock (__qbShift):
//  A. nothing before 11-30 moves: the live brands every day 11-20..11-29 at 9 am, OLD against NEW
//  B. 2026-11-30 .. 2027-12-31 on NEW, every day at 9 am: the live brands; each seasonal brand only live in its season; always 3 live;
//     the pricier share (every 3rd drop) across the Feb -> Mar change; the state's next / soon fields never name an out-of-season brand
//   OLD=<port> NEW=<port> NODE_PATH=<playwright> node rigtest/qa/season211qa.js
const pw = require('playwright'); const OLD = process.env.OLD || 8819, NEW = process.env.NEW || 8824; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const scan = (port, from, days) => async (b) => { const p = await (await b.newContext({ timezoneId: 'America/Los_Angeles' })).newPage(); await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + port + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbDrops, null, { timeout: 120000 }); await p.waitForTimeout(400);
  const r = await p.evaluate(([from, days]) => { const real = Date.now() - (window.__qbShift || 0), out = []; const prem = (id) => { try { return window.__qbV167 ? !!window.__qbV167.prem(id) : null; } catch (e) { return null; } }; const seasons = (window.V211 && window.V211.brands) || null;
    for (let k = 0; k < days; k++) { const d = new Date(from + 'T09:00:00'); d.setDate(d.getDate() + k); window.__qbShift = d.getTime() - real; let st = null; try { st = window.__qbDrops.state(); } catch (e) {} const ymd = window.__qbDrops.ymd ? window.__qbDrops.ymd() : d.toISOString().slice(0, 10);
      const extra = st ? JSON.stringify(Object.fromEntries(Object.entries(st).filter(([k2]) => /next|soon|up|back/i.test(k2)))) : ''; out.push({ ymd, m: d.getMonth() + 1, live: st ? st.live.map((q) => q.id + (prem(q.id) ? '*' : '')) : null, starts: st ? st.live.map((q) => q.start) : null, extra }); }
    window.__qbShift = 0; return out; }, [from, days]); await p.context().close(); return r; };
(async () => { const b = await pw.chromium.launch();
  /* A */ const a1 = await scan(OLD, '2026-11-20', 10)(b), a2 = await scan(NEW, '2026-11-20', 10)(b); const diff = a1.filter((d, i) => JSON.stringify(d.live) !== JSON.stringify(a2[i].live)).map((d) => d.ymd);
  ok(!diff.length, 'nothing before 11-30 moves: live brands 11-20..11-29 the same on both builds' + (diff.length ? ' (differ on ' + diff.join(', ') + ')' : ''));
  /* B */ const B = await scan(NEW, '2026-11-30', 397)(b); const season = (m) => (m === 12 || m <= 2 || m === 11 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'fall');
  const svDays = B.filter((d) => d.live && d.live.some((x) => /^sv\*?$/.test(x))), kmDays = B.filter((d) => d.live && d.live.some((x) => /^km\*?$/.test(x)));
  const svOut = svDays.filter((d) => season(d.m) !== 'winter'), kmOut = kmDays.filter((d) => season(d.m) !== 'summer');
  note('sv live on ' + svDays.length + ' days, months ' + JSON.stringify([...new Set(svDays.map((d) => d.ymd.slice(0, 7)))]) + '; km live on ' + kmDays.length + ' days, months ' + JSON.stringify([...new Set(kmDays.map((d) => d.ymd.slice(0, 7)))]));
  ok(!svOut.length && !kmOut.length, 'seasonal brands are live only in their season (sv out of winter: ' + svOut.length + ' days, km out of summer: ' + kmOut.length + ')');
  ok(B.every((d) => d.live && d.live.length === 3), 'always 3 live, 11-30 to the end of 2027 (' + B.filter((d) => !(d.live && d.live.length === 3)).length + ' days not)');
  const drops = []; let prev = ''; B.forEach((d) => { const k = d.starts.join(','); if (k !== prev) { const newOnes = d.live.filter((x, i) => prev.split(',').indexOf(d.starts[i]) < 0); drops.push({ ymd: d.ymd, add: newOnes }); prev = k; } });
  const fm = drops.filter((d) => d.ymd >= '2027-02-01' && d.ymd <= '2027-03-31'); note('drops Feb..Mar 2027 (new brand, * pricier): ' + fm.map((d) => d.ymd.slice(5) + ' ' + d.add.join('+')).join(' | '));
  const added = drops.slice(1).map((d) => d.add[0]).filter(Boolean); const premIdx = added.map((x, i) => (/\*$/.test(x) ? i : -1)).filter((i) => i >= 0); const gaps = premIdx.slice(1).map((v, i) => v - premIdx[i]);
  note('pricier drops at positions (every 3rd expected): gaps ' + JSON.stringify(gaps.slice(0, 40))); ok(gaps.length > 5 && gaps.every((g) => g === 3), 'every third drop is pricier through the whole year, across season changes');
  const soonOut = B.filter((d) => /"sv/.test(d.extra) && season(d.m) !== 'winter' && !/^(10|11)$/.test(String(d.m))); note('state fields used for next/soon: ' + (B[0].extra || '(none)').slice(0, 160)); ok(!soonOut.length, 'the next/soon fields never name sv out of winter (' + soonOut.length + ' days)');
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
