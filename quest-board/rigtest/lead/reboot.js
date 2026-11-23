// Cal's 11-23 reboot (29zz_v135.js), on the plain build (PORT):
// his 4 starting cuts; 2 letters only (Welcome 1000, live 500), no Town notice; new group names; Wave, Fist bump, High five; the brand
// window only inside the Shop and the Shop's "!" once it opens; a window that opens by itself waits for the tutorial; the fashion
// competition shut until 5 players have 5 buys, then 2 votes a week, one a person, never yourself, counts hidden, only voters of both
// place; challenges in town only for their two players, a productivity challenge shows the other's quest names.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/reboot.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV135, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const hair = await p.evaluate(() => window.QBDATA.creator.hairStyles.m.filter((o) => !o.stylistOnly).map((o) => o.label));
  ok(hair.join() === 'Buzz Cut,Mid Part,Tousled,Combover', 'his starting cuts: ' + hair.join(', '));
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.calm = false; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, players: 1 }; x.render(); });
  const V = (f) => p.evaluate(f);
  const inbox = await V(() => window.__qbV135.inbox()); ok(inbox.length === 2 && inbox.some((l) => l[0] === 'welcome' && l[2] === 1000) && inbox.some((l) => l[0] === 'live135' && l[2] === 500), 'two letters: ' + JSON.stringify(inbox));
  const cl = await V(() => window.__qbV135.cl().map((c) => c[0] + '=' + c[1]).join(', ')); ok(/reset=Self care/.test(cl) && /admin=Work and admin/.test(cl), 'groups: ' + cl);
  const sq = await V(() => Object.keys(window.__qbV135.sqk()).map((k) => window.__qbV135.sqk()[k][1])); ok(sq.join() === 'Wave,Fist bump,High five', 'greetings: ' + sq.join(', '));
  /* the Shop: built Closet, a brand never seen. On the Board: no brand window; the Shop button has "!"; in the Shop: the window */
  await V(() => { const S = window.__qb.x().S; window.__qbRooms.open('closet', 1); S.areaOn.shop = 1; S.brandSeen = {}; S.seenDr = {}; S.alSeen = { init: 1, room: {}, bld: {}, tab: { shop: 1 }, brand: {} }; /* a save first seen while the Shop was shut */ window.__qb.x().render(); });
  await p.waitForTimeout(6000);
  let s = await V(() => ({ splash: !!document.querySelector('.bsplash,.dropsplash'), bang: !!document.querySelector('.nav button[data-v="shop"] .nbang'), view: document.querySelector('.nav button.on') && document.querySelector('.nav button.on').dataset.v }));
  ok(!s.splash && s.bang, 'on the Board: no brand window, "!" on the Shop ' + JSON.stringify(s));
  await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(600); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); /* the Welcome letter opens by itself on a first visit */ await p.waitForTimeout(4500);
  s = await V(() => ({ dbg: [document.documentElement.getAttribute('data-view'), [...document.querySelectorAll('#layer > *')].map((m) => m.className + ':' + (m.innerText || '').slice(0, 40).replace(/\s+/g, ' '))], splash: !!document.querySelector('.bsplash,.flsplash'), bang: !!document.querySelector('.nav button[data-v="shop"] .nbang') }));
  ok(s.splash, 'opening the Shop shows the brand window ' + JSON.stringify(s));
  await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  /* the tutorial first */
  await V(() => { const T = window.__qbV135.tour; T.id = 'shop'; T.i = 0; }); await p.waitForTimeout(1700); /* no tap for 1.7 s: the next window opens by itself */
  await V(() => { const fn = window.__qb.roomModal; fn(0); });
  s = await V(() => ({ shown: !!document.querySelector('#layer .modal'), held: !!document.querySelector('#layer .qb-held') }));
  ok(!s.shown && s.held, 'during a tour, a window that opens by itself is held ' + JSON.stringify(s));
  await V(() => { window.__qbV135.tour.id = null; }); await p.waitForTimeout(1500);
  s = await V(() => ({ shown: !!document.querySelector('#layer .modal'), held: !!document.querySelector('#layer .qb-held') }));
  ok(s.shown, 'after the tour it comes up (one at a time) ' + JSON.stringify(s));
  await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  /* fashion */
  const f0 = await V(() => { const H = window.__qbV135; H.setMe('me'); H.setWorlds([{ id: 'a', name: 'Ann', sb: 5 }, { id: 'b', name: 'Bo', sb: 9 }, { id: 'c', name: 'Cy', sb: 5 }, { id: 'd', name: 'Di', sb: 4 }]); window.__qb.x().S.shopBuys = 5; return { on: H.on(), buyers: H.buyers(), tg: H.tg() }; });
  ok(!f0.on && f0.buyers === 4 && !/data-m="fashion"/.test(f0.tg), 'shut with 4 players at 5 buys, no Fashion tab ' + JSON.stringify({ on: f0.on, buyers: f0.buyers }));
  const f1 = await V(() => { const H = window.__qbV135; H.setWorlds([{ id: 'a', name: 'Ann', sb: 5 }, { id: 'b', name: 'Bo', sb: 9 }, { id: 'c', name: 'Cy', sb: 5 }, { id: 'd', name: 'Di', sb: 5 }]); const on = H.on(); return { on, tg: /data-m="fashion"/.test(H.tg()), letter: H.inbox().filter((l) => l[0] === 'fsh-on').length }; });
  ok(f1.on && f1.tg && f1.letter === 1, 'opens at 5 players with 5 buys, with its letter and the Fashion tab ' + JSON.stringify(f1));
  const f2 = await V(() => { const H = window.__qbV135, F = H.fsh, wk = H.wk().key; F.ready = 1; F.mine = { wk, c: {}, d: '', td: {}, prev: null };
    F.likes = { me: F.mine, a: { wk, c: { b: 1, c: 1 } }, b: { wk, c: { a: 1 } }, c: { wk, c: { a: 1, b: 1 } } };
    const r = { left0: H.left('a'), self: H.left(undefined) }; F.mine.c = { a: 1 }; r.leftA = H.left('a'); r.leftB = H.left('b'); F.mine.c = { a: 1, b: 1 }; r.leftC = H.left('c');
    F.likes.me = F.mine; r.counts = H.counts(wk); window.__qb.x().S.fshOn = window.__qb.x().S.fshOn; return r; });
  ok(f2.left0 === 2 && f2.leftA === 0 && f2.leftB === 1 && f2.leftC === 0, '2 votes, one a person ' + JSON.stringify(f2));
  ok(f2.counts.a === 3 && f2.counts.c === 1 && f2.counts.b === undefined, 'only players who used both votes place (Bo voted once: not counted) ' + JSON.stringify(f2.counts));
  await V(() => { window.__qbV135.fsh.mode = 'fashion'; }); const box = await V(() => window.__qbV135.box()); console.log('box text:', box.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400)); ok(!/\d+\s*(♥|likes?)|\d+ votes? (from|got)/.test(box.replace(/\d+ votes? left/, '')) && /You used both votes/.test(box), 'the Fashion box shows no counts and says you qualify');
  const lb = await V(() => window.__qbV135.likeBox({ id: 'c', name: 'Cy', me: 0, earnedC: 0, lv: 1 })); ok(/No votes left/.test(lb), 'no votes left after two: ' + lb.replace(/<[^>]+>/g, ' ').slice(0, 80));
  /* challenges */
  const d = await V(() => { const H = window.__qbV135; return { what: H.what({ kind: 'q', days: 3, stake: 100, cash: 0 }), item: H.item({ kind: 'q', st: 'live', start: Date.now() - 1e5, end: Date.now() + 1e7, stake: 100, otherName: 'Ann', opp: { n: 30, t: Date.now(), qs: ['Laundry', 'Taxes'] }, cid: 'x' }) }; });
  ok(/see each other's finished quests/.test(d.what) && /Ann's quests \(2\)/.test(d.item) && /Laundry/.test(d.item), 'a productivity challenge says both see the quests and lists the other\'s');
  await p.screenshot({ path: OUT + '/reboot_end.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
