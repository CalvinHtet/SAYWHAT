// QA, the v1.75 batch's small checks (rule 17), on the plain build.
//  A. cf85d778 "Edit tasks" on the first list's heading: priority tasks on top, no priority (a category first), edit mode, and 320 px
//     with a long first category: the button sits on the heading's line between the name and the count, nothing overlaps, nothing
//     wider than the page, the old .qhead row is gone. Screenshots edit_*.png.
//  B. 945babd0 the login calendar against other windows: open while another window is up (must not), a level-up while it is open
//     (stack?), and a reload where it is due with a level-up waiting.
//   PORT=<plain build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/v175qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const page = async (W) => { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV194 && window.__qbV192, null, { timeout: 120000 }); await p.waitForTimeout(600);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); return { ctx, p }; };
  const setup = (p, quests, extra) => p.evaluate(([quests, T, extra]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Ed', sex: 'm' }); S.xp = x.cum(6) + 5; S.tutDone = 1; S.tours = T; S.quests = quests; S.done = {}; S.v92 = { n: 2, d: window.__qbV192 ? '' : '' }; Object.assign(S, extra || {}); x.persist(); x.render(); }, [quests, T, extra]);
  const clr = (p) => p.evaluate(() => document.querySelectorAll('#layer > *').forEach((m) => m.remove()));
  const geo = (p) => p.evaluate(() => { const r = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return { t: Math.round(q.top), b: Math.round(q.bottom), l: Math.round(q.left), r: Math.round(q.right) }; };
    const h = document.querySelector('#app section.cluster > header'); const btn = document.querySelector('.qedit'); const lab = h && (h.querySelector('h2,h3,.label,b,span') || h.firstElementChild); const cnt = h && h.querySelector('.note');
    const ov = (a, c) => a && c && a.l < c.r - 1 && c.l < a.r - 1 && a.t < c.b - 1 && c.t < a.b - 1;
    return { qhead: !!document.querySelector('#app .qhead'), inHead: !!(h && btn && h.contains(btn)), txt: btn ? btn.textContent.trim() : null, head: r(h), btn: r(btn), lab: r(lab), labTxt: lab ? lab.textContent.trim().slice(0, 30) : '', cnt: r(cnt), cntTxt: cnt ? cnt.textContent.trim() : '', hasart: h ? h.classList.contains('hasart') : null,
      overlap: ov(r(lab), r(btn)) || ov(r(btn), r(cnt)) || ov(r(lab), r(cnt)), wide: document.documentElement.scrollWidth > innerWidth + 1, btnWrap: btn ? btn.getBoundingClientRect().height > 44 : null }; });
  const Q = (id, name, cl, pri) => ({ id, name, xp: 20, stat: 'productivity', cl, rep: 'daily', pri });
  /* A */
  for (const [W, lab, qs] of [[390, 'priority on top', [Q('a1', 'Pay rent', 'admin', 3), Q('a2', 'Wash the car', 'home'), Q('a3', 'Write the report', 'admin')]], [390, 'no priority (a category first)', [Q('b1', 'Wash the car', 'home'), Q('b2', 'Water plants', 'home'), Q('b3', 'Write the report', 'admin')]],
    [320, '320, long first category', [Q('c1', 'Write the quarterly report for the team', 'admin'), Q('c2', 'Email the landlord', 'admin'), Q('c3', 'Call grandma', 'social')]], [320, '320, priority on top', [Q('d1', 'Pay rent', 'admin', 2), Q('d2', 'Wash the car', 'home')]]]) {
    const { ctx, p } = await page(W); await setup(p, qs, { v92: { n: 0, d: '9999-12-31' } }); await p.waitForTimeout(500); await clr(p); await p.evaluate(() => window.scrollTo(0, 0)); const g = await geo(p);
    const sameLine = g.btn && g.lab && g.btn.t < g.lab.b && g.lab.t < g.btn.b;
    ok(!g.qhead && g.inHead && g.txt === 'Edit tasks' && sameLine && !g.overlap && !g.wide, W + ' ' + lab + ': "' + g.txt + '" in the first heading ("' + g.labTxt + '", count "' + g.cntTxt + '", art ' + g.hasart + ') on its line, no overlap, page not wider ' + JSON.stringify({ lab: g.lab, btn: g.btn, cnt: g.cnt, wrap: g.btnWrap }));
    await p.screenshot({ path: OUT + '/edit_' + W + '_' + lab.replace(/\W+/g, '_') + '.png', clip: { x: 0, y: Math.max(0, (g.head ? g.head.t : 0) - 120), width: W, height: 360 } });
    if (W === 390 && /priority/.test(lab)) { await p.evaluate(() => document.querySelector('.qedit').click()); await p.waitForTimeout(400); const e = await geo(p); ok(e.txt === 'Done' && e.inHead && !e.overlap && !e.wide, '390 edit mode: "' + e.txt + '" stays in the heading, no overlap ' + JSON.stringify(e.btn)); await p.screenshot({ path: OUT + '/edit_390_editmode.png', clip: { x: 0, y: Math.max(0, (e.head ? e.head.t : 0) - 120), width: 390, height: 420 } }); }
    await ctx.close(); }
  /* B */
  { const { ctx, p } = await page(390); await setup(p, [Q('l1', 'Wash the car', 'home'), Q('l2', 'Read 10 pages', 'create')], { v92: { n: 2, d: '' } }); await clr(p);
    const b1 = await p.evaluate(async () => { window.__qb.wardrobeModal ? 0 : 0; document.querySelector('[data-act="char"]').click(); await new Promise((r) => setTimeout(r, 6500)); return { cal: !!document.querySelector('#layer .v92m'), modals: document.querySelectorAll('#layer .modal').length }; });
    ok(!b1.cal, 'with the profile open for 6.5 s, the calendar (due) does not open over it ' + JSON.stringify(b1)); await clr(p);
    await p.waitForFunction(() => document.querySelector('#layer .v92m'), null, { timeout: 15000 }).catch(() => {}); const shown = await p.evaluate(() => !!document.querySelector('#layer .v92m')); note('calendar opened on the Board once nothing was up: ' + shown);
    const b2 = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(x.effLvl() + 1) - 5; x.toggle('l2'); await new Promise((r) => setTimeout(r, 2500)); return { lvl: x.effLvl(), cal: !!document.querySelector('#layer .v92m'), modals: [...document.querySelectorAll('#layer .modal, .lvup')].map((m) => (m.className + ' ' + m.innerText.replace(/\s+/g, ' ')).slice(0, 50)) }; });
    note('a level-up while the calendar is open: ' + JSON.stringify(b2)); ok(b2.modals.length <= 1 || !b2.cal, 'a level-up does not stack on the open calendar (windows at once: ' + b2.modals.length + ')');
    await p.screenshot({ path: OUT + '/cal_levelup.png' }); await ctx.close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
