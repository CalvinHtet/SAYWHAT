// Cal 11-26 (29zz_v182.js): before and after photos for cleaning tasks. A cleaning task asks for a before photo (or skip); with one kept,
// the row says "Before ✓" and the next tap opens the photo proof (the after); a passed after is offered for the town board as one picture,
// the two side by side.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/ba182.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV182, null, { timeout: 90000 }); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const yes = ['Clean my desk', 'Tidy my room', 'Vacuum the living room', 'Do the dishes', 'Make my bed', 'Wash the bedding', 'Clear the kitchen counter', 'Wipe every light switch', 'Take out the trash', 'Empty the dishwasher', 'Change the bed sheets', 'Put away clothes', 'Fold the clothes', 'Wash every window inside the home', 'Wash the throw blankets', 'Clear the hallway', 'Clear out one closet', 'Clear the shower drain', 'Sweep the drive'];
  const no = ['Email Bob', 'Go for a run', 'Read 20 pages', 'Clean up my inbox', 'Organize my files', 'Organize my calendar', 'Clean code refactor', 'Dust off my resume', 'Clean eating', 'Mop up the backlog', 'Put away 100 for savings'];
  const is = await V(([y, n]) => ({ y: y.filter((t) => !window.__qbV182.is({ name: t })), n: n.filter((t) => window.__qbV182.is({ name: t })), admin: window.__qbV182.is({ name: 'Tidy your desktop', cl: 'admin' }) }), [yes, no]);
  ok(!is.y.length && !is.n.length && !is.admin, 'cleaning chores are recognised (the misses QA found too); digital, admin and figurative ones are not ' + JSON.stringify(is));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
    S.quests = [{ id: 'c1', name: 'Clean my desk', cl: 'home', xp: 30, stat: 'productivity', rep: 'daily' }, { id: 'c2', name: 'Email Bob', cl: 'admin', xp: 10, stat: 'productivity', rep: 'daily' }]; S.done = {}; localStorage.removeItem('qb-ba-c1'); x.render(); });
  await p.waitForTimeout(500); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  await V(() => document.querySelector('.qmain[data-id="c1"]').click()); await p.waitForTimeout(300);
  const a1 = await V(() => { const m = document.querySelector('#layer .v82m'); return m ? m.innerText.replace(/\s+/g, ' ') : null; });
  ok(a1 && /take a before photo/i.test(a1) && /skip, just do it/i.test(a1), 'tapping a cleaning task asks for a before photo: ' + a1);
  await p.screenshot({ path: OUT + '/ba182_ask.png' });
  await V(() => document.querySelector('[data-v82="skip"]').click()); await p.waitForTimeout(300);
  const a2 = await V(() => ({ ask: !!document.querySelector('#layer .v82m'), proof: !!document.getElementById('pf1'), done: !!window.__qb.x().S.done.c1 }));
  ok(!a2.ask && (a2.proof || a2.done), 'skip carries on as a normal tap ' + JSON.stringify(a2));
  await V(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const S = window.__qb.x().S; delete S.done.c1; window.__qb.x().render(); });
  await V(() => document.querySelector('.qmain[data-id="c2"]').click()); await p.waitForTimeout(300);
  ok(await V(() => !document.querySelector('#layer .v82m')), 'a task that is not cleaning never asks');
  await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const mk = (w, h, col) => V(([w, h, col]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = col; x.fillRect(0, 0, w, h); return c.toDataURL('image/jpeg', .8); }, [w, h, col]);
  const bd = await mk(600, 800, '#884422');
  await V((d) => { window.__qbV182.set('c1', d); window.__qb.x().render(); }, bd); await p.waitForTimeout(300);
  ok(await V(() => /Before/.test((document.querySelector('.qmain[data-id="c1"] .v82chip') || {}).innerText || '')), 'with a before kept, the row says Before ✓');
  await V(() => document.querySelector('.qmain[data-id="c1"]').click()); await p.waitForTimeout(300);
  const a3 = await V(() => ({ proof: !!document.getElementById('pf1'), cur: window.__qbV182.cur() && window.__qbV182.cur().id }));
  ok(a3.proof && a3.cur === 'c1', 'the next tap opens the photo proof, for the after ' + JSON.stringify(a3));
  const ad = await mk(900, 1200, '#2266aa');
  const co = await V(async ([bd, ad]) => { const blob = await (await fetch(ad)).blob(); const out = await window.__qbV182.compose(bd, blob); const u = URL.createObjectURL(out); const im = new Image(); await new Promise((o) => { im.onload = o; im.src = u; }); return { w: im.naturalWidth, h: im.naturalHeight }; }, [bd, ad]);
  ok(co.h === 900 && co.w === 675 + 10 + 675, 'the pair is one picture, side by side at one height: ' + JSON.stringify(co));
  const e2e = await V(async (ad) => { const blob = await (await fetch(ad)).blob(); const r = window.__qbV182.rem({ file: blob, kind: 'quest', what: 'Clean my desk' }); if (!r || !r.ready) return { ba: r && r.ba }; await r.ready; const u = URL.createObjectURL(r.file); const im = new Image(); await new Promise((o) => { im.onload = o; im.src = u; }); return { ba: r.ba, w: im.naturalWidth, h: im.naturalHeight, cur: window.__qbV182.cur() }; }, ad);
  ok(e2e.ba === 1 && e2e.w === 1360 && e2e.h === 900 && !e2e.cur, 'a passed after photo is offered as the side-by-side pair ' + JSON.stringify(e2e));
  /* QA MED: two chores with befores, their afters in flight together: each pairs with its own before */
  const two = await V(async ([bd, ad]) => { const S = window.__qb.x().S; S.quests.push({ id: 'c3', name: 'Make my bed', cl: 'home', xp: 25, stat: 'discipline', rep: 'daily' }); window.__qbV182.set('c1', bd); window.__qbV182.set('c3', bd); window.__qb.x().render();
    document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.qmain[data-id="c1"]').click(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.qmain[data-id="c3"]').click(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    const both = window.__qbV182.pend().slice().sort(); const blob = await (await fetch(ad)).blob(); const r1 = window.__qbV182.rem({ file: blob, kind: 'quest', what: 'Clean my desk' }); await r1.ready; const left = window.__qbV182.pend(); const r2 = window.__qbV182.rem({ file: blob, kind: 'quest', what: 'Make my bed' }); await r2.ready;
    return { both, r1: r1.ba, left, r2: r2.ba, after: window.__qbV182.pend() }; }, [bd, ad]);
  ok(two.both.join() === 'c1,c3' && two.r1 === 1 && two.left.join() === 'c3' && two.r2 === 1 && !two.after.length, 'two afters in flight each pair with their own before ' + JSON.stringify(two));
  /* QA LOW 1: "Done without a photo" ends the before */
  const hon = await V(async (bd) => { const x = window.__qb.x(), S = x.S; delete S.done.c1; window.__qbV182.set('c1', bd); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.qmain[data-id="c1"]').click(); await new Promise((o) => setTimeout(o, 200));
    document.querySelector('[data-act="honor"]').click(); await new Promise((o) => setTimeout(o, 400)); x.render(); return { done: !!S.done.c1, kept: !!window.__qbV182.get('c1'), pend: window.__qbV182.pend(), chip: !!document.querySelector('.qmain[data-id="c1"] .v82chip') }; }, bd);
  ok(hon.done && !hon.kept && !hon.pend.length && !hon.chip, '"Done without a photo" finishes the task and drops its before ' + JSON.stringify(hon));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
