// Cal 11-23: Training in the bar from day one; the weekly Workout off the Board; Training's top card ticks the week's days and logs
// today's workout with the photo proof window.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/training.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const s = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.calm = { days: [x.S.calm && 0 || ''] }; S.xp = 0; S.tours = {}; x.render();
    const nav = [...document.querySelectorAll('.nav button[data-v]')].map((b) => b.dataset.v); const wq = S.quests.filter((q) => q.rep === 'weekly4').length;
    const board = [...document.querySelectorAll('.quest .name,.q .name,.name')].map((e) => e.textContent).filter((t) => /Workout/.test(t)).length; return { nav, wq, board }; });
  ok(s.nav.includes('train'), 'Training is in the bar on day one: ' + s.nav.join(','));
  ok(s.wq === 1 && s.board === 0, 'the Workout quest exists but is not on the Board (' + JSON.stringify(s) + ')');
  await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="train"]').click(); }); await p.waitForTimeout(900);
  await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const t = await p.evaluate(() => ({ dots: document.querySelectorAll('.trhead .wdots .wd').length, btn: !!document.querySelector('.trhead [data-act="v35wk"]') }));
  ok(t.dots === 7 && t.btn, 'Training\'s top card: the week\'s 7 days and "Log today\'s workout" ' + JSON.stringify(t));
  await p.screenshot({ path: OUT + '/training.png' });
  await p.evaluate(() => document.querySelector('[data-act="v35wk"]').click()); await p.waitForTimeout(800);
  const m = await p.evaluate(() => { const e = document.querySelector('#layer .modal'); return e ? e.innerText.replace(/\s+/g, ' ').slice(0, 120) : null; });
  ok(m && /photo|proof|camera|Verif/i.test(m), 'it opens the photo proof: ' + m);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, q = S.quests.filter((q) => q.rep === 'weekly4')[0]; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); S.done[q.id] = 40; S.active = S.active || {}; S.active[x.S.today || ''] = 1; x.render(); });
  await p.evaluate(() => document.querySelector('.nav button[data-v="train"]').click()); await p.waitForTimeout(700);
  const d = await p.evaluate(() => !!document.querySelector('.trhead .v35wk') && /logged/.test(document.querySelector('.trhead').innerText)); ok(d, 'logged today: the card says so');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
