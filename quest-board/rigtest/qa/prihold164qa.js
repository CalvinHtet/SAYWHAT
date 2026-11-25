// QA, 558f60dc (29zz_v163.js V63SNAP: a priority tap holds the Board's order until a tap on something else; Cal 11-25). What LEAD's
// pri163.js leaves out, by real taps at 390 and 320:
//   A  cycle one row !, !!, !!!, off, ! again: the row never moves, its button shows each level
//   B  a second row's button while held: still held (it is a priority button too)
//   C  a sync redraw while held (S.quests replaced from a copy, render()): still held, order unchanged
//   D  a tap on the Edit button: released, the Priority group builds in level order
//   E  hold, then a tap that opens a window (the header avatar's card/profile): released behind it, the window stays open
//   F  hold, then a tap on the row's tick: the task ticks, the hold ends, the ticked task is not in Priority
//   G  hold, then another tab and back: released
//   H  a tap on the page background (Chromium fires click; iOS Safari may not, see the finding)
//   PORT=<plain build> OUT=<dir> node prihold164qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const W of [390, 320]) { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV163 && window.__qbV163.held, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    const clr = () => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,#layer .qb-held,.bsplash,.dropsplash,.flsplash')) m.remove(); });
    const setup = () => p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Hold', sex: 'f' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.calm = false; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
      S.quests = [{ id: 'a1', name: 'Dishes', xp: 10, stat: 'productivity', cl: 'home', rep: 'daily', mins: 10 }, { id: 'a2', name: 'Laundry', xp: 25, stat: 'productivity', cl: 'home', rep: 'once', mins: 30 }, { id: 'a3', name: 'Vacuum', xp: 25, stat: 'productivity', cl: 'home', rep: 'once', mins: 20 }, { id: 'a4', name: 'Pay the bills', xp: 25, stat: 'productivity', cl: 'admin', rep: 'once', mins: 15 }]; S.done = {}; x.persist(); x.render(); document.querySelector('.nav button[data-v="board"]').click(); });
    await setup(); await p.waitForTimeout(900); await clr();
    const st = () => p.evaluate(() => { const S = window.__qb.x().S; return { held: window.__qbV163.held(), order: [...document.querySelectorAll('#app .q .qmain[data-act=toggle]')].map((m) => m.dataset.id).join(','), group: [...document.querySelectorAll('section.v63pri .qmain')].map((m) => m.dataset.id).join(','), pri: Object.fromEntries((S.quests || []).filter((q) => q.pri).map((q) => [q.id, q.pri])), btn: Object.fromEntries([...document.querySelectorAll('.qpri')].map((e) => [e.dataset.id, e.querySelector('b').textContent + (e.classList.contains('p0') ? '0' : '')])), done: Object.keys(S.done || {}), modal: !!document.querySelector('#layer .modal'), view: document.querySelector('.nav button.on, .nav button[aria-current]') ? (document.querySelector('.nav button.on, .nav button[aria-current]').dataset.v || '') : '' }; });
    const tapPri = async (id) => { const el = await p.$('.qpri[data-id="' + id + '"]'); await el.scrollIntoViewIfNeeded(); await el.click(); await p.waitForTimeout(250); };
    const base = await st();
    /* A */ const seen = []; let still = true; for (let i = 0; i < 5; i++) { await tapPri('a3'); const s = await st(); seen.push(s.btn.a3); if (s.order !== base.order || !s.held) still = false; }
    ok(still && seen.join(' ') === '! !! !!! !0 !', W + ': A five taps on one row cycle ! !! !!! off ! and the row never moves ' + JSON.stringify({ seen, base: base.order }));
    await tapPri('a3'); await tapPri('a3'); /* a3 at !!! */
    /* B */ await tapPri('a4'); let s = await st(); ok(s.held && s.order === base.order && s.group === '', W + ': B a second row\'s button keeps the hold, nothing moves ' + JSON.stringify(s));
    /* C */ await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.quests = JSON.parse(JSON.stringify(S.quests)); document.documentElement.classList.add('qb-sync'); x.render(); document.documentElement.classList.remove('qb-sync'); x.render(); }); await p.waitForTimeout(300);
    s = await st(); ok(s.held && s.order === base.order && s.group === '', W + ': C a sync redraw keeps the hold and the order ' + JSON.stringify(s));
    await p.screenshot({ path: OUT + '/hold_' + W + '.png' });
    /* D */ const ed = await p.evaluate(() => { const e = [...document.querySelectorAll('#app button')].find((x) => /^edit$/i.test(x.textContent.trim())); if (e) e.setAttribute('data-qa-edit', '1'); return !!e; });
    if (ed) { await p.click('[data-qa-edit]'); await p.waitForTimeout(400); s = await st(); ok(!s.held && s.group === 'a3,a4', W + ': D a tap on Edit releases, Priority holds a3 (!!!) over a4 (!) ' + JSON.stringify(s)); await p.screenshot({ path: OUT + '/released_' + W + '.png' }); await p.click('[data-qa-edit]').catch(() => {}); await p.waitForTimeout(300); } else ok(false, W + ': D no Edit button');
    /* E */ await tapPri('a1'); s = await st(); const heldE = s.held; await p.click('.strip .avbtn'); await p.waitForTimeout(900); s = await st(); ok(heldE && !s.held && s.modal && s.group.split(',').includes('a1'), W + ': E a tap that opens a window releases behind it, the window stays open ' + JSON.stringify({ heldE, ...s })); await clr(); await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(300);
    /* F (a1 is daily: a one-off task opens the photo window first) */ await tapPri('a1'); s = await st(); const heldF = s.held; const tick = await p.$('.qmain[data-act=toggle][data-id="a1"]'); await tick.scrollIntoViewIfNeeded(); await tick.click(); await p.waitForTimeout(900); await clr(); s = await st();
    ok(heldF && !s.held && s.done.includes('a1') && !s.group.split(',').includes('a1'), W + ': F a tap on the tick ticks the task and releases; the ticked task is not in Priority ' + JSON.stringify(s));
    /* G */ await tapPri('a4'); s = await st(); const heldG = s.held; await p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal')) m.remove(); }); await p.evaluate(() => window.__qb.x().S); const other = await p.evaluate(() => { const o = [...document.querySelectorAll('.nav button[data-v]')].find((x) => x.dataset.v !== 'board'); return o ? o.dataset.v : null; });
    if (other) { await p.click('.nav button[data-v="' + other + '"]'); await p.waitForTimeout(500); await clr(); await p.click('.nav button[data-v="board"]'); await p.waitForTimeout(600); await clr(); s = await st(); ok(heldG && !s.held, W + ': G another tab and back releases ' + JSON.stringify({ heldG, other, held: s.held, group: s.group })); }
    /* H */ await tapPri('a4'); s = await st(); const heldH = s.held; await p.mouse.click(W / 2, 830 - 120).catch(() => {}); const bg = await p.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, 710); return e ? e.tagName + '.' + e.className : ''; }); await p.waitForTimeout(400); s = await st();
    console.log('     ' + W + ': H background tap at (' + W / 2 + ',710) on ' + bg + ': held before ' + heldH + ', after ' + s.held);
    await ctx.close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
