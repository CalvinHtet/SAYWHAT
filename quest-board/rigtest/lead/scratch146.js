// Cal 11-24 (29zz_v146.js): the scratch card in the Wheel's place: one a day after 3 tasks, scratch 3 of 9, three of a kind wins
// (mascot > orange > cyan), no match pays each icon's coins, always under the smallest match.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/scratch146.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV146 && window.__qbV144, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.calm = false; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, wheel: 1 };
    window.__qbV144.loot.rnd(() => .5); S.quests = [1, 2, 3, 4].map((k) => ({ id: 't' + k, name: 'Task ' + k, xp: 10, stat: 'discipline', cl: 'home', rep: 'once', mins: 5 })); S.done = {}; S.cdone = {}; x.render(); });
  const row = () => V(() => { const e = document.querySelector('.zx-sc'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; });
  const open = async () => { await V(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="board"]').click(); }); await p.waitForTimeout(300); await V(() => { const e = document.querySelector('.zx-sc'); if (e) e.click(); }); await p.waitForTimeout(500); };
  const card = () => V(() => ({ cells: document.querySelectorAll('.sc-cell').length, enabled: document.querySelectorAll('.sc-cell:not(:disabled)').length, foot: (document.querySelector('.sc-foot') || {}).innerText || '', wheel: !!document.querySelector('#wheel,[data-act="spin"]'), legs: document.querySelectorAll('.sc-leg').length, imgs: [...document.querySelectorAll('.sc-leg img')].every((i) => i.complete && i.naturalWidth > 0) }));
  ok(/Finish 3 more tasks/.test(await row()), 'no tasks yet: the Board row says 3 more tasks: ' + await row());
  await open(); let c = await card(); ok(c.cells === 9 && c.enabled === 0 && /Finish 3 more tasks/.test(c.foot) && !c.wheel && c.legs === 3 && c.imgs, 'the card: 9 panels, locked, no wheel, the three prizes shown with their pictures ' + JSON.stringify(c)); await p.screenshot({ path: OUT + '/sc_locked.png' });
  await V(() => { const x = window.__qb.x(); ['t1', 't2', 't3'].forEach((id) => { x.toggle(id); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); }); document.querySelector('.nav button[data-v="board"]').click(); }); await p.waitForTimeout(400);
  ok(/ready/.test(await row()) && await V(() => window.__qbV146.ready()), '3 tasks done: ' + await row());
  /* a no-match card: cyan, orange, mascot */
  await open(); c = await card(); ok(c.enabled === 9 && /Scratch 3 panels/.test(c.foot), 'ready: 9 panels to scratch'); await p.screenshot({ path: OUT + '/sc_ready.png' });
  await V(() => { const seq = [.99, .1, .6, .95]; let k = 0; window.__qbV146.rnd(() => (k < seq.length ? seq[k++] : Math.random())); });
  const c0 = await V(() => window.__qb.x().S.coins); await V(() => document.querySelectorAll('.sc-cell')[4].click()); await p.waitForTimeout(250); await p.screenshot({ path: OUT + '/sc_one.png' });
  await V(() => document.querySelectorAll('.sc-cell')[4].click()); await V(() => document.querySelectorAll('.sc-cell')[0].click()); await p.waitForTimeout(200); await V(() => document.querySelectorAll('.sc-cell')[8].click()); await p.waitForTimeout(900);
  const r1 = await V(() => { const S = window.__qb.x().S; return { st: JSON.parse(JSON.stringify(S.sc)), coins: S.coins, open: document.querySelectorAll('.sc-cell.open').length, rest: document.querySelectorAll('.sc-cell.rest').length, foot: document.querySelector('.sc-foot').innerText, vals: [...document.querySelectorAll('.sc-v')].map((e) => e.innerText) }; });
  ok(r1.st.out.join('') === 'com' && r1.st.done === 1 && !r1.st.win && r1.open === 3 && r1.rest === 6, 'three scratched (a tap on an open panel does nothing), the other six shown dimmed: ' + r1.st.out.join(','));
  ok(r1.coins - c0 === r1.st.coins && r1.vals.length === 3 && r1.st.coins > 0, 'no match pays each icon: ' + r1.vals.join(' ') + ' = ' + r1.st.coins + ' coins'); await p.screenshot({ path: OUT + '/sc_nomatch.png' });
  ok((await row()) === '' && !(await V(() => window.__qbV146.ready())), 'one card a day: the row is gone');
  /* every match beats every no-match, at the same level */
  const pz = await V(() => { const x = window.__qb.x(), S = x.S, H = window.__qbV146, out = {}; const play = (seq) => { S.sc = null; let k = 0; H.rnd(() => (k < seq.length ? seq[k++] : .5)); const c0 = S.coins, f0 = S.freezes, o0 = Object.keys(S.owned).length; [0, 1, 2].forEach((i) => H.scratch(i)); return { win: S.sc.win, coins: S.coins - c0, fr: S.freezes - f0, own: Object.keys(S.owned).length - o0, out: S.sc.out.join('') }; };
    out.m = play([.001]); out.o = play([.05]); out.c = play([.2]); out.best = play([.99, .99, .99, .6, .99, .99, .6]); H.rnd(null); return out; });
  ok(pz.m.win === 'm' && pz.o.win === 'o' && pz.c.win === 'c' && pz.m.coins > pz.o.coins && pz.o.coins > pz.c.coins, 'mascots ' + pz.m.coins + ' > orange ' + pz.o.coins + ' > cyan ' + pz.c.coins);
  ok(pz.m.own === 1 && pz.o.fr === 1, 'mascots also give a piece of clothing, orange a streak freeze');
  ok(!pz.best.win && pz.best.coins < pz.c.coins, 'the best no-match (' + pz.best.out + ': ' + pz.best.coins + ') pays less than three cyan (' + pz.c.coins + ')');
  /* the odds over many cards */
  const od = await V(() => { const H = window.__qbV146, n = { m: 0, o: 0, c: 0, x: 0 }; for (let i = 0; i < 20000; i++) { const r = H.roll(); n[r[0] === r[1] && r[1] === r[2] ? r[0] : 'x']++; } return n; });
  ok(Math.abs(od.m / 200 - 2) < .5 && Math.abs(od.o / 200 - 8) < 1 && Math.abs(od.c / 200 - 20) < 1.5 && Math.abs(od.x / 200 - 70) < 1.5, 'odds over 20,000 cards (%): mascots ' + od.m / 200 + ', orange ' + od.o / 200 + ', cyan ' + od.c / 200 + ', none ' + od.x / 200);
  /* a winning card on screen */
  await V(() => { const x = window.__qb.x(), S = x.S; S.sc = null; let k = 0; window.__qbV146.rnd(() => (k++ ? .5 : .001)); x.render(); }); await open(); await V(() => [2, 4, 6].forEach((i) => document.querySelectorAll('.sc-cell')[i].click())); await p.waitForTimeout(1200);
  ok(await V(() => document.querySelectorAll('.sc-cell.win').length === 3 && /Three mascots/.test(document.querySelector('.sc-foot').innerText)), 'a win lights its three panels: ' + (await V(() => document.querySelector('.sc-foot').innerText)).replace(/\s+/g, ' ')); await p.screenshot({ path: OUT + '/sc_win.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
