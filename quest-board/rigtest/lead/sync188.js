// Cal 11-26 (29zz_v188.js): nothing stalls while the save syncs. A tap that changes the save is queued, marked at once, and goes
// through when the save is in; tapping a queued task again takes it back; looking around works at once; nothing is blocked by CSS.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/sync188.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV188, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
    S.quests = [{ id: 'a1', name: 'Water the plants', cl: 'home', xp: 15, stat: 'discipline', rep: 'daily' }, { id: 'a2', name: 'Read ten pages', cl: 'learn', xp: 15, stat: 'intellect', rep: 'daily' }]; S.done = {}; x.render(); });
  await p.waitForTimeout(400); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  await V(() => document.documentElement.classList.add('qb-sync'));
  const tap = async (sel) => { const r = await V((s) => { const e = document.querySelector(s); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel); if (r) await p.mouse.click(r.x, r.y); await p.waitForTimeout(250); return !!r; };
  const pe = await V(() => getComputedStyle(document.querySelector('.qmain[data-id="a1"]')).pointerEvents);
  ok(pe !== 'none', 'while syncing, the screen takes taps (no blanket pointer-events block) ' + pe);
  await tap('.qmain[data-id="a1"]'); await tap('.qmain[data-id="a2"]');
  const s1 = await V(() => ({ q: window.__qbV188.q(), done: Object.keys(window.__qb.x().S.done), m1: document.querySelector('.qmain[data-id="a1"]').classList.contains('v88q'), m2: document.querySelector('.qmain[data-id="a2"]').classList.contains('v88q') }));
  ok(s1.q.length === 2 && !s1.done.length && s1.m1 && s1.m2, 'two task ticks while syncing are queued and marked, not done yet ' + JSON.stringify(s1));
  await p.screenshot({ path: OUT + '/sync188_queued.png' });
  await tap('.qmain[data-id="a2"]');
  const s2 = await V(() => ({ q: window.__qbV188.q().length, m2: document.querySelector('.qmain[data-id="a2"]').classList.contains('v88q') }));
  ok(s2.q === 1 && !s2.m2, 'tapping a queued task again takes it back off ' + JSON.stringify(s2));
  await V(() => window.__qb.x().render()); const s3 = await V(() => document.querySelector('.qmain[data-id="a1"]').classList.contains('v88q'));
  ok(s3, 'a redraw keeps the mark');
  const look = await tap('.nav button[data-v="board"]'); ok(look, 'the bottom bar still takes taps');
  await V(() => document.documentElement.classList.remove('qb-sync')); await p.waitForTimeout(900);
  const s4 = await V(() => ({ done: Object.keys(window.__qb.x().S.done), q: window.__qbV188.q().length, m: !!document.querySelector('.v88q') }));
  ok(s4.done.length === 1 && s4.done[0] === 'a1' && !s4.q && !s4.m, 'when the save is in, the queued tick goes through on its own, the mark goes ' + JSON.stringify(s4));
  await tap('.qmain[data-id="a2"]'); await p.waitForTimeout(300);
  const s5 = await V(() => Object.keys(window.__qb.x().S.done).sort());
  ok(s5.indexOf('a2') >= 0, 'after the sync, taps act at once as before ' + JSON.stringify(s5));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
