// Cal 11-26 (29zz_v187.js): the repeat button opens a window: Once, Every day, or chosen days; a "days" task shows only on its days.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/rep187.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV187, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {});
    S.quests = [{ id: 'r1', name: 'Water the plants', cl: 'home', xp: 15, stat: 'discipline', rep: 'daily' }]; S.done = {}; x.render(); });
  await p.waitForTimeout(400); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  await V(() => document.querySelector('.qrep[data-id="r1"]').click()); await p.waitForTimeout(300);
  const m = await V(() => { const m = document.querySelector('#layer .v87m'); return m ? { days: m.querySelectorAll('.v87d').length, on: m.querySelectorAll('.v87d.on').length, txt: m.innerText.replace(/\s+/g, ' ').slice(0, 120) } : null; });
  ok(m && m.days === 7 && m.on === 7, 'the repeat button opens the window: Once, Every day, seven days (a daily task has all seven on) ' + JSON.stringify(m));
  await p.screenshot({ path: OUT + '/rep187.png' });
  const wd = await V(() => window.__qbV187.wd()); const other = (wd + 3) % 7;
  const s1 = await V(async ([wd, other]) => { const m = document.querySelector('#layer .v87m'); m.querySelectorAll('.v87d').forEach((b) => { const i = +b.dataset.v87d; if ((i === wd || i === other) !== b.classList.contains('on')) b.click(); }); m.querySelector('[data-v87="save"]').click(); await new Promise((o) => setTimeout(o, 300));
    const q = window.__qb.x().S.quests[0]; return { rep: q.rep, days: q.days, shown: !!document.querySelector('.qmain[data-id="r1"]'), lbl: (document.querySelector('.qrep[data-id="r1"] small') || {}).textContent, sub: (document.querySelector('.qmain[data-id="r1"] .sub') || {}).textContent }; }, [wd, other]);
  ok(s1.rep === 'days' && s1.days.length === 2 && s1.shown && s1.lbl.split(' ').length === 2 && s1.sub.indexOf(s1.lbl) >= 0 && !/One-off/.test(s1.sub), 'two days chosen, today among them: rep "days", shown today, the button and the sub-line name them ' + JSON.stringify(s1));
  const s2 = await V(async (other) => { const q = window.__qb.x().S.quests[0]; q.days = [other]; window.__qb.x().render(); await new Promise((o) => setTimeout(o, 200)); return { shown: !!document.querySelector('.qmain[data-id="r1"]') }; }, other);
  ok(!s2.shown, 'on a day it is not set for, it stays off the Board');
  const s3 = await V(async () => { const S = window.__qb.x().S, q = S.quests[0]; q.days = [window.__qbV187.wd()]; window.__qb.x().render(); document.querySelector('.qrep[data-id="r1"]').click(); await new Promise((o) => setTimeout(o, 200)); const m = document.querySelector('#layer .v87m'); m.querySelector('[data-v87="once"]').click(); m.querySelector('[data-v87="save"]').click(); await new Promise((o) => setTimeout(o, 200)); return { rep: q.rep, days: q.days, lbl: (document.querySelector('.qrep[data-id="r1"] small') || {}).textContent }; });
  ok(s3.rep === 'once' && !s3.days && s3.lbl === 'Once', 'Once turns it back into a one-off ' + JSON.stringify(s3));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
