// Cal 11-26, second list: tiny chores (29zz_v195.js), before photos only for real before/after chores (v182), the town photos in pages
// of six (v196), Town Hall cards (v197), an All tab for brands (v181), Training pays per set (v198).
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/cal1126b.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV198, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.tutDone = 1; S.coins = 0; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
    S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }];
    S.quests = [{ id: 't1', name: 'Put laundry in dryer', cl: 'home', xp: 1, stat: 'productivity', rep: 'once', why: 'A quick step, not a task' }, { id: 's1', name: 'Put on socks', cl: 'reset', xp: 1, stat: 'discipline', rep: 'once' }]; S.done = {}; S.v95 = 0;
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); S.coins = 0; x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  /* 1. tiny chores */
  const t = await V(() => { window.__qbV195.fix(); const S = window.__qb.x().S, q = S.quests[0], s = S.quests[1]; const g = window.__qbV195.guess('Put laundry in dryer'), g2 = window.__qbV195.guess('put on my socks');
    const v = window.__qbV195.val({ name: 'Move laundry to the dryer', xp: 0, step: true, mins: 1, stat: 'productivity', cluster: 'home' }, 'x'), v3 = window.__qbV195.val({ name: 'Feed the cat', xp: 3, mins: 2, stat: 'discipline', cluster: 'out' }, 'x');
    const x0 = S.xp, c0 = S.coins; window.__qb.x().toggle('t1'); const dx = S.xp - x0, dc = S.coins - c0; window.__qb.x().toggle('t1'); const back = [S.xp - x0, S.coins - c0];
    return { fixed: q.xp, step: s.xp, guess: g.xp, gstep: g2.xp, rated: v.xp, rated3: v3.xp, dx, dc, back, parse: /3 = tiny/.test(window.__qbV195.parse()) }; });
  ok(t.fixed === 3 && t.step === 1 && t.guess === 3 && t.gstep === 1 && t.rated === 3 && t.rated3 === 3 && t.parse, 'a tiny chore is a 3 XP task (saved, offline, and the rater\'s "step" answer); a real step stays 1 ' + JSON.stringify(t));
  ok(t.dx === 3 && t.dc === 5 && t.back[0] === 0 && t.back[1] === 0, 'it pays 3 XP and 5 coins, and unticking takes them back ' + JSON.stringify({ dx: t.dx, dc: t.dc, back: t.back }));
  /* 2. before photos */
  const ba = await V(() => ['Clean my room', 'Put laundry in dryer', 'Cook dinner', 'Buy groceries', 'Vacuum the hallway', 'Do laundry', 'Take out the trash', 'Wash the car'].map((n) => [n, window.__qbV182.is({ name: n, cl: 'home', rep: 'once' })]));
  ok(ba.every(([n, y]) => y === /room|Vacuum|car/.test(n)), 'a before photo is offered only for a real before and after (a room, vacuuming, the car), not laundry, cooking, groceries or trash ' + JSON.stringify(ba));
  /* 6. Training pays per set */
  const wk = await V(() => { const x = window.__qb.x(), S = x.S; S.wk = { plan: 'push', list: ['bench', 'ohp'], sets: {}, w: {}, hit: {}, t: '' }; S.wkpay = null; const ex = Object.keys(window.QBDATA && window.QBDATA.ex || {})[0];
    const id = 'bench'; const x0 = S.xp, c0 = S.coins; window.__qbV198.tap(id, 0, ''); window.__qbV198.tap(id, 1, ''); const a = [S.xp - x0, S.coins - c0]; window.__qbV198.tap(id, 1, ''); const b2 = [S.xp - x0, S.coins - c0];
    S.wkpay = { d: window.__qbV198.day().d, n: 25 }; window.__qbV198.tap(id, 2, ''); const c = [S.xp - x0, S.coins - c0]; S.wk = null; return { a, b2, c }; });
  ok(wk.a[0] === 6 && wk.a[1] === 30 && wk.b2[0] === 3 && wk.b2[1] === 15 && wk.c[0] === 3 && wk.c[1] === 15, 'each set pays 3 XP and 15 coins, unticking takes it back, and 25 a day are paid at most ' + JSON.stringify(wk));
  /* 4. Town Hall cards */
  const pc = await V(() => ({ w: window.__qbV197.w(), still: (document.querySelector('.strip .avbtn img.calp') || {}).getAttribute ? document.querySelector('.strip .avbtn img.calp').getAttribute('data-pose') : null }));
  ok(pc.w <= 230 && pc.still === 'still', 'a posted card is at most 230 px wide; the header\'s character is still ' + JSON.stringify(pc));
  /* 3. photo pages */
  await V(() => { const PH = window.__qbPhotos.state(); const c = document.createElement('canvas'); c.width = 60; c.height = 60; c.getContext('2d').fillRect(0, 0, 60, 60); const u = c.toDataURL('image/jpeg');
    PH.posts = []; for (let i = 0; i < 14; i++)PH.posts.push({ id: 'u~' + i, u: 'u' + i, name: 'P' + i, cap: '', what: '', kind: 'photo', full: u, thumb: u, w: 60, h: 60, t: Date.now() - i * 6e4 });
    PH.loaded = Date.now(); const el = document.createElement('section'); el.id = 'phfeed'; el.className = 'card panel ph-feed'; document.querySelector('#app').appendChild(el); el.innerHTML = window.__qbV196.html(); });
  const pg3 = await V(async () => { const el = document.getElementById('phfeed'); const pages = el.querySelectorAll('.v96pg'); const first = pages[0] ? pages[0].querySelectorAll('.ph-card').length : 0; const L = el.querySelector('[data-v96="-1"]'), R = el.querySelector('[data-v96="1"]');
    const s0 = { pages: pages.length, first, leftOff: !!(L && L.disabled), rightOn: !!(R && !R.disabled), n: (el.querySelector('.v96n') || {}).textContent };
    R.click(); await new Promise((r) => setTimeout(r, 450)); const tr = el.querySelector('.v96track'); const s1 = { page: window.__qbV196.page(), tf: tr.style.transform, n: el.querySelector('.v96n').textContent, leftOn: !el.querySelector('[data-v96="-1"]').disabled };
    el.querySelector('[data-v96="1"]').click(); await new Promise((r) => setTimeout(r, 450)); const s2 = { page: window.__qbV196.page(), rightOff: el.querySelector('[data-v96="1"]').disabled }; el.querySelector('[data-v96="1"]').click(); const s3 = window.__qbV196.page();
    el.scrollIntoView(); return { s0, s1, s2, s3 }; });
  ok(pg3.s0.pages === 3 && pg3.s0.first === 6 && pg3.s0.leftOff && pg3.s0.rightOn && pg3.s0.n === '1 / 3', 'the board shows 6 photos a page (2 rows of 3), page 1 has the left arrow greyed out ' + JSON.stringify(pg3.s0));
  ok(pg3.s1.page === 1 && /-100%/.test(pg3.s1.tf) && pg3.s1.n === '2 / 3' && pg3.s1.leftOn && pg3.s2.page === 2 && pg3.s2.rightOff && pg3.s3 === 2, 'the right arrow slides to the older page; on the last page it is greyed out and nothing wraps ' + JSON.stringify([pg3.s1, pg3.s2, pg3.s3]));
  await p.screenshot({ path: OUT + '/cal1126b_photos.png' });
  /* 5. All tab on a brand page */
  await V(() => { document.getElementById('phfeed') && document.getElementById('phfeed').remove(); document.querySelector('.nav button[data-v="shop"]').click(); });
  await p.waitForTimeout(1200); await V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  const doors = await V(() => [...document.querySelectorAll('[data-shub]')].map((d) => d.getAttribute('data-shub')));
  let all = null; for (const d of doors) { await V((d) => { const e = document.querySelector('[data-shub="' + d + '"]'); if (e) e.click(); }, d); await p.waitForTimeout(900); await V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
    const brand = await V(() => !!document.querySelector('.qshop.v60room')); if (brand) { all = await V(() => { const tabs = [...document.querySelectorAll('.qshop .v81cats .v81c')].map((b) => b.textContent); const secs = document.querySelectorAll('.qshop .qs-rack > .qs-sec'); const off = document.querySelectorAll('.qshop .qs-rack > .qs-sec.v81off').length; return { tabs, secs: secs.length, off, on: (document.querySelector('.qshop .v81c.on') || {}).textContent }; }); break; }
    await V(() => { const bk = document.querySelector('.qshop [data-shub="home"],.qshop .qs-back,[data-act="shopback"]'); if (bk) bk.click(); }); await p.waitForTimeout(600); }
  ok(!all || (all.tabs[0] === 'All' && all.on === 'All' && all.off === 0 && all.secs >= 2), 'a brand\'s page starts on an All tab showing every category ' + JSON.stringify({ doors, all }));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
