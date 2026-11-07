const { chromium } = require('playwright');
const SH = '/private/tmp/claude-501/-Users-calibur--claude-spares-spare-MOWpiM/afafcbf6-9cc0-455e-8015-335dca1e8917/scratchpad/rv/';
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:65410/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach(m => m.remove()));
  const snap = () => p.evaluate(() => { const S = window.__qb.x().S; return JSON.stringify({ c: S.coins, team: (S.story || {}).team, seen: S.seen || {}, done: (S.story || {}).done, beats: (S.story || {}).beats || {} }); });
  const before = await snap(); const seq = await p.evaluate(() => window.__qbRooms.storySeq().map(x => x[0] + ':' + (x[0] === 'note' ? x[1] : x[1])));
  await p.evaluate(() => window.__qbRooms.story());
  const shown = []; let idle = 0, shots = 0;
  while (idle < 12 && shown.length < 200) { await p.waitForTimeout(400); const top = await p.evaluate(() => { const ms = [...document.querySelectorAll('#layer .modal')]; const m = ms[ms.length - 1]; if (!m) return null; const h = m.querySelector('h2,.sty-who b'); return (h ? h.textContent : '?').slice(0, 40); });
    if (!top) { idle++; continue; } idle = 0; shown.push(top); if (shots < 4 && /Step 5|Desmond|Nova/.test(top)) { await p.screenshot({ path: SH + 'story_' + (shots++) + '.png' }); }
    await p.evaluate(() => { const ms = [...document.querySelectorAll('#layer .modal')]; const m = ms[ms.length - 1]; const more = m.querySelector('[data-act=stynext]'); if (more && !more.closest('[hidden]')) { while (m.querySelector('.sty-more') && !m.querySelector('.sty-more').hidden) m.querySelector('[data-act=stynext]').click(); } m.remove(); }); }
  const after = await snap();
  // the new gates
  const gates = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, R = window.__qbRooms; ['garden', 'restaurant', 'boba', 'dessert'].forEach(t => R.open(t, 1)); S.earnedC = 999999; const st = STORY_REF = null; return 1; }).catch(e => 'n/a');
  console.log(JSON.stringify({ seqLen: seq.length, shownLen: shown.length, unchanged: before === after, first: shown.slice(0, 14), last: shown.slice(-6) }), errs.slice(0, 3)); await b.close(); })();
