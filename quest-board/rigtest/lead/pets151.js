// Cal 11-24 (29zz_v151.js): Calvin and Sydney visit with Pluto and Chopstick (the dogs walk in as visiting dogs); the companion keeps
// close to the player and spends some spells in the Game Room, never in a painted room without furniture boxes.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/pets151.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV151 && window.__qbV150, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.gates = [5, 10, 20, 30]; S.calm = false; S.tutDone = 1; S.coins = 9000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, shop: 1 };
    ['closet', 'lounge', 'gameroom', 'lair'].forEach((t) => { try { window.__qbRooms.open(t, 1); } catch (e) {} }); const H = window.__qbV150.state(); H.own.wolf = { n: 'Fenrir', xp: 0, evo: 0, form: 0, t: Date.now() }; H.seen = 1; S.pet = { k: 'wolf', t: Date.now() }; S.dogref = { at: 1, c: 0, n: 0 }; x.render(); });
  /* the visit */
  const vz = await V(() => { const H = window.__qbV151, x = window.__qb.x(), S = x.S; const v = H.pick('calsyd'); let seen = 0; for (let i = 0; i < 400; i++) { S.visit = null; const q = H.pick(); if (q && q.id === 'calsyd') seen++; }
    return { v: v && { id: v.id, who: v.who, text: v.text, place: v.place }, names: H.names(v.who), seen, rooms: S.base.slots.filter(Boolean).map((r) => r.t) }; });
  ok(vz.v && vz.v.text === 'Calvin and Sydney came to visit and they brought their dogs!' && vz.names === 'Calvin, Sydney, Pluto and Chopstick', 'the visit: "' + (vz.v && vz.v.text) + '" (' + vz.names + ')');
  ok(vz.seen > 0, 'it comes up in the ordinary draw with no dogs adopted (' + vz.seen + ' of 400 picks)');
  await V(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500);
  await V(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.overlay').forEach((m) => m.remove()); const g = document.querySelector('[data-act="bldgo"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(3000); await V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.overlay').forEach((m) => m.remove()));
  const vis = await V(async () => { const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const c0 = S.coins; window.__qbFriends.force('calsyd'); await new Promise((r) => setTimeout(r, 400));
    const card = (document.querySelector('#layer .modal') || {}).innerText || ''; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const L = window.__qbV151.vis(); try { window.lfSync(); } catch (e) {} await new Promise((r) => setTimeout(r, 1500)); const A = window.__qbLoft().A || {};
    return { list: L.map((q) => q.id + ':' + q.role + ':' + q.room), actors: Object.keys(A).filter((k) => /^v:/.test(k)), card: card.replace(/\s+/g, ' '), coins: S.coins - c0, lounge: S.base.slots.findIndex((r) => r && r.t === 'lounge') }; });
  ok(/Calvin, Sydney, Pluto and Chopstick/.test(vis.card) && /brought their dogs/.test(vis.card) && vis.coins === 120, 'the visit\'s card names all four and pays its 120 coins: ' + vis.card.slice(0, 150));
  ok(vis.list.length === 4 && vis.list.filter((s) => /^v:dog:(pluto|chopstick):dog:/.test(s)).length === 2 && vis.list.filter((s) => /^v:(calvin|sydney):visitor:/.test(s)).length === 2, 'four visitors in the room: ' + vis.list.join(', '));
  ok(['v:calvin', 'v:sydney', 'v:dog:pluto', 'v:dog:chopstick'].every((k) => vis.actors.indexOf(k) >= 0), 'all four are actors in the Loft: ' + vis.actors.join(', ')); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + '/pets151_visit.png' });
  /* roaming: only rooms with recorded furniture; about two spells in five */
  const rm = await V(async () => { const H = window.__qbV151, x = window.__qb.x(), S = x.S; H.spell(1); const idx = {}; S.base.slots.forEach((r, i) => { if (r) idx[i] = r.t; }); const c = {}; for (let i = 0; i < 300; i++) { const r = H.room(); const k = r < 0 ? 'bedroom' : idx[r]; c[k] = (c[k] || 0) + 1; await new Promise((q) => setTimeout(q, 3)); }
    H.spell(7 * 60000); try { window.lfSync(); } catch (e) {} const pet = (window.__qbLoft().A || {})['dog:pet']; return { c, rooms: Object.keys(H.rooms), petRoom: pet ? idx[pet.room] : 'none' }; });
  ok(rm.c.bedroom > 120 && rm.c.gameroom > 60 && !rm.c.closet && !rm.c.lair && !rm.c.lounge, 'over 300 spells: with the player ' + rm.c.bedroom + ', the Game Room ' + (rm.c.gameroom || 0) + ', never the painted Closet or Lair ' + JSON.stringify(rm.c));
  ok(rm.petRoom === 'bedroom' || rm.petRoom === 'gameroom', 'the companion is an actor in the ' + rm.petRoom);
  /* it walks without leaving the floor: sample its cell for a while */
  const walk = await V(async () => { const L = window.__qbLoft(), out = { n: 0, blockedStill: 0, modes: {} }; for (let i = 0; i < 60; i++) { const a = L.A['dog:pet']; if (a) { const C = L.C(a); out.n++; out.modes[a.mode] = (out.modes[a.mode] || 0) + 1; if (C && C.nav && a.mode !== 'walk' && L.blocked(C, a.x, a.y)) out.blockedStill++; } await new Promise((q) => setTimeout(q, 250)); } return out; });
  ok(walk.n >= 50 && walk.blockedStill === 0, 'over 15 s it never comes to rest inside furniture ' + JSON.stringify(walk));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
