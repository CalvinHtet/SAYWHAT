// Cal 11-26 (29zz_v194.js): "Edit tasks" sits on the first list's heading line (Priority and its count), no row of its own.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/edit194.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV194, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const setup = (pri) => V((pri) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
    S.quests = [{ id: 'p1', name: 'schedule 5 reels to TikTok', cl: 'admin', xp: 25, stat: 'productivity', rep: 'once', pri: pri ? 3 : 0 }, { id: 'p2', name: 'schedule 5 reels to YT', cl: 'admin', xp: 25, stat: 'productivity', rep: 'once', pri: pri ? 2 : 0 }, { id: 'h1', name: 'Water the plants', cl: 'home', xp: 15, stat: 'discipline', rep: 'daily' }]; S.done = {};
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); }, pri);
  const look = () => V(() => { const b = document.querySelector('#app .qedit'), h = b && b.closest('header'), lab = h && h.querySelector('.label'), cnt = h && h.querySelector('.note');
    const r = (e) => e ? e.getBoundingClientRect() : null, rb = r(b), rl = r(lab), rc = r(cnt);
    return { txt: b && b.textContent, inHead: !!h, head: lab && lab.textContent, row: !!document.querySelector('#app .qhead'), same: !!(rb && rl && rc && (h.classList.contains('hasart') ? Math.abs(rb.bottom - rl.bottom) < 10 && Math.abs(rb.bottom - rc.bottom) < 10 : Math.abs((rb.top + rb.bottom) / 2 - (rl.top + rl.bottom) / 2) < 8 && Math.abs((rb.top + rb.bottom) / 2 - (rc.top + rc.bottom) / 2) < 8)), art: !!(h && h.classList.contains('hasart')), order: !!(rl && rb && rc && rl.right <= rb.left && rb.right <= rc.left), fits: !!(rb && rb.right <= 390) }; });
  await setup(true); await p.waitForTimeout(600); const a = await look();
  ok(a.txt === 'Edit tasks' && a.inHead && /priority/i.test(a.head) && !a.row && a.same && a.order && a.fits, '"Edit tasks" is on the Priority line, between the name and the count, no row of its own ' + JSON.stringify(a));
  const h = await V(() => { const s = document.querySelector('#app section.cluster'); return s ? Math.round(s.getBoundingClientRect().top) : 0; });
  await V(() => document.querySelector('#app section.cluster').scrollIntoView({ block: 'center' })); await p.screenshot({ path: OUT + '/edit194.png' });
  const e = await V(async () => { document.querySelector('#app .qedit').click(); await new Promise((r) => setTimeout(r, 300)); const b = document.querySelector('#app .qedit'); return { txt: b && b.textContent, inHead: !!(b && b.closest('header')), on: !!(b && b.classList.contains('on')) }; });
  ok(e.txt === 'Done' && e.inHead && e.on, 'tapping it turns on editing; it reads "Done" and stays on the line ' + JSON.stringify(e));
  await V(async () => { document.querySelector('#app .qedit').click(); await new Promise((r) => setTimeout(r, 300)); });
  await setup(false); await p.waitForTimeout(600); const c = await look();
  ok(c.txt === 'Edit tasks' && c.inHead && !c.row && c.same, 'with no priority tasks it sits on the first category\'s line ' + JSON.stringify(c));
  await V(() => document.querySelector('#app section.cluster').scrollIntoView({ block: 'center' })); await p.screenshot({ path: OUT + '/edit194_cat.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
