// Cal 11-24 (29zz_v147.js): three bounty cards (1, 2 and 3 days), two at once, timers from the take, 3 rerolls a day then 150 coins,
// the x gives one up (a new card with a reroll left, the same bounty with its old timer without), 250/400/600 coins, 3-day bounties
// done by Town Hall photos, the Gym Challenge card taking over a challenge's name and end.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/bounty147.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV147 && window.__qbV144, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.calm = false; S.tutDone = 1; S.coins = 1000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1 }; S.quests = []; S.done = {}; delete S.bq;
    window.__qbV144.loot.rnd(() => .5); window.__qbV147.photosOn(1); window.__qbV147.othersOn(1); x.render(); document.querySelector('.nav button[data-v="board"]').click(); });
  await p.waitForTimeout(400);
  const cards = () => V(() => [...document.querySelectorAll('.bty .bty-card')].map((c) => ({ lab: c.querySelector('.label').innerText, name: c.querySelector('b').innerText, txt: c.innerText.replace(/\s+/g, ' '), btns: [...c.querySelectorAll('button')].map((q) => q.dataset.act + ':' + q.innerText.replace(/\s+/g, ' ')) })));
  const click = async (act, k) => { await V(([act, k]) => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.bty [data-act="' + act + '"][data-k="' + k + '"]').click(); }, [act, k]); await p.waitForTimeout(250); };
  let c = await cards(); ok(c.length === 3 && /1-day/i.test(c[0].lab) && /2-day/i.test(c[1].lab) && /3-day/i.test(c[2].lab), 'three cards: ' + c.map((q) => q.lab + ' "' + q.name + '"').join(' | '));
  ok(/\+250 coins/.test(c[0].txt) && /\+400 coins/.test(c[1].txt) && /\+600 coins/.test(c[2].txt) && c.every((q) => q.btns.some((t) => /bqtake/.test(t)) && q.btns.some((t) => /bqroll:Reroll$/.test(t))), 'each pays 250 / 400 / 600 coins and has Take it and Reroll');
  ok(await V(() => /3 rerolls left today/.test(document.querySelector('.bty').innerText)), '3 rerolls a day'); await p.screenshot({ path: OUT + '/bq_offer.png' });
  /* rerolls: 3 free over all cards, then 150 coins */
  const n0 = c[0].name; await click('bqroll', 1); c = await cards(); ok(c[0].name !== n0, 'a reroll swaps the card: "' + n0 + '" -> "' + c[0].name + '"');
  await click('bqroll', 2); await click('bqroll', 1); let st = await V(() => ({ rr: window.__qbV147.state().rr, coins: window.__qb.x().S.coins, t: document.querySelector('.bty').innerText }));
  ok(st.rr === 3 && st.coins === 1000 && /Rerolls: 150 coins/.test(st.t), 'three rerolls used over two cards, free; now they cost 150');
  const n1 = (await cards())[2].name; await click('bqroll', 3); st = await V(() => ({ coins: window.__qb.x().S.coins })); ok(st.coins === 850 && (await cards())[2].name !== n1, 'a 4th reroll costs 150 coins (1000 -> ' + st.coins + ')');
  await V(() => { window.__qb.x().S.coins = 100; }); const n2 = (await cards())[2].name; await click('bqroll', 3); ok((await cards())[2].name === n2 && await V(() => window.__qb.x().S.coins === 100), 'with under 150 coins there is no reroll');
  /* take two: the third card goes; the chore is a quest on the Board */
  await click('bqtake', 1); await click('bqtake', 3); c = await cards(); const A = await V(() => JSON.parse(JSON.stringify(window.__qbV147.state().act)));
  ok(c.length === 2 && A[1] && A[3] && !A[2], 'two taken, the 2-day card is gone: ' + c.map((q) => q.lab).join(' | '));
  ok(await V((id) => window.__qb.x().S.quests.some((q) => q.id === id && q.bty), A[1].qid) && /On your board/i.test(c[0].txt) && /24 hours left/i.test(c[0].lab), 'the 1-day chore is on the Board with a 24 hour timer: ' + c[0].lab);
  ok(Math.abs(A[3].end - A[3].t0 - 3 * 864e5) < 5 && /3 days left/i.test(c[1].lab), 'the 3-day timer starts at the take: ' + c[1].lab); await p.screenshot({ path: OUT + '/bq_two.png' });
  /* giving one up with no rerolls left: the same bounty comes back with its timer; taking it again does not restart it */
  await V(() => { const b = window.__qbV147.state(); b.act[3].t0 -= 36e5; b.act[3].end -= 36e5; }); const end3 = await V(() => window.__qbV147.state().act[3].end); const nm3 = A[3].n;
  await click('bqdrop', 3); c = await cards(); const c3 = c.find((q) => /3-day/i.test(q.lab)); ok(c3 && c3.name === nm3 && c.length === 3, 'no rerolls left: the x brings the same bounty back, and the hidden card shows again (' + c.length + ' cards)');
  await click('bqtake', 3); ok(await V((e) => window.__qbV147.state().act[3].end === e, end3), 'taking it again goes on with the old timer');
  /* with a reroll left the x gives a new card */
  await V(() => { window.__qbV147.state().rr = 2; window.__qb.x().render(); }); await click('bqdrop', 3); c = await cards(); const c3b = c.find((q) => /3-day/i.test(q.lab));
  ok(c3b && c3b.name !== nm3 && await V(() => window.__qbV147.state().rr === 3 && !window.__qbV147.state().hold[3]), 'with a reroll left the x uses it and a new bounty comes: "' + (c3b && c3b.name) + '"');
  /* finishing the chore pays 250 on top of its XP, once */
  const q1 = await V(async () => { const x = window.__qb.x(), S = x.S, A = window.__qbV147.state().act[1]; const base = x.mults(S.quests.find((q) => q.id === A.qid), {}); const c0 = S.coins, x0 = S.xp; x.toggle(A.qid); await new Promise((r) => setTimeout(r, 200)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    const r = { dc: S.coins - c0, questCoins: S.cdone[A.qid], dx: S.xp - x0, tags: base.tags.join(), done: window.__qbV147.state().act[1].done }; const c1 = S.coins; x.toggle(A.qid); x.toggle(A.qid); r.again = S.coins - c1 - 0; return r; });
  ok(q1.done === 1 && q1.dc >= q1.questCoins + 250 && /Bounty x1\.5/.test(q1.tags), 'ticking the chore finishes the bounty: its own coins (' + q1.questCoins + ') + 250, XP x1.5 (' + q1.dx + ' XP)');
  /* QA: unticking the finished chore takes the 250 back and reopens the bounty; ticking again pays it once more, never twice */
  const un = await V(async () => { const x = window.__qb.x(), S = x.S, A = window.__qbV147.state().act[1]; const c0 = S.coins; x.toggle(A.qid); await new Promise((r) => setTimeout(r, 150)); const r = { back: c0 - S.coins, questCoins: 0, open: A.done === 0 }; const c1 = S.coins; x.toggle(A.qid); await new Promise((q) => setTimeout(q, 200)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); r.again = S.coins - c1; r.done = A.done; r.net = S.coins - c0; return r; });
  ok(un.open && un.back >= 250 && un.done === 1 && un.net === 0, 'unticking gives back the quest\'s coins and the bounty\'s 250 (' + un.back + '), and the bounty reopens; ticking again pays the same once (net ' + un.net + ')');
  /* QA: backing out of the photo composer disarms the card */
  ok(await V(async () => { const H = window.__qbV147; H.arm(3); H.disarm(); return H.arm() === 0; }), 'a card armed for a photo is disarmed once the composer is gone');
  c = await cards(); ok(/Completed/.test(c[0].txt) && /Next one in/.test(c[0].txt), 'the finished slot waits for its window: ' + c[0].txt);
  /* a photo bounty: counted by posts, once a day when it says so */
  const ph = await V(async () => { const H = window.__qbV147, x = window.__qb.x(), S = x.S, b = H.state(); delete b.act[3]; delete b.hold[3]; const P = H.pool(3), w = P.find((q) => q.id === 'water'), m = P.find((q) => q.id === 'menu');
    const mk = (q) => { b.act[3] = { k: 3, pi: q.pi, id: q.id, n: q.n, why: q.why, xp: q.xp, ty: 'p', t0: Date.now(), end: Date.now() + 3 * 864e5, need: q.need, daily: q.daily, got: 0, days: {}, done: 0 }; };
    const r = {}; mk(w); r.w1 = H.photo(3); r.w2 = H.photo(3); r.wgot = b.act[3].got; mk(m); const c0 = S.coins, x0 = S.xp; H.photo(3); H.photo(3); r.mid = b.act[3].done; H.photo(3); await new Promise((q) => setTimeout(q, 200)); r.done = b.act[3].done; r.dc = S.coins - c0; r.dx = S.xp - x0; r.pool = P.map((q) => q.id).join(','); return r; });
  ok(ph.w1 === 1 && ph.w2 === 0 && ph.wgot === 1, 'Hydration Check counts one photo a day');
  ok(ph.mid === 0 && ph.done === 1 && ph.dc === 600 && ph.dx === 150, 'Menu Ideas: 3 photos finish it for 600 coins and 150 XP');
  ok(ph.pool === 'menu,water,chef,sweep,bed,fit,desk,grass,made,letgo,movie,song,game,gym', 'the 3-day pool is the fourteen Cal picked: ' + ph.pool);
  /* the Gym Challenge card */
  const gy = await V(async () => { const H = window.__qbV147, b = H.state(), x = window.__qb.x(); delete b.act[3]; const g = H.pool(3).find((q) => q.id === 'gym'); const t0 = Date.now();
    b.act[3] = { k: 3, pi: g.pi, id: 'gym', n: g.n, why: g.why, xp: g.xp, ty: 'd', t0, end: t0 + 3 * 864e5, need: 0, got: 0, days: {}, done: 0 }; x.render(); const card = () => [...document.querySelectorAll('.bty .bty-card')].map((c) => c.innerText.replace(/\s+/g, ' ')).find((t) => /Gym Challenge/.test(t)) || '';
    const r = { a: card() }; let ch = { cid: 'c1', from: 'me', kind: 'w', t: t0 + 10, st: 'ask', otherName: 'Sydney', stake: 250 }; H.duel(() => ch); H.tick(); x.render(); r.b = card();
    ch = Object.assign({}, ch, { st: 'live', start: t0 + 5000, end: t0 + 5000 + 3 * 864e5 }); H.tick(); x.render(); r.c = card(); r.end = b.act[3].end === ch.end;
    const c0 = x.S.coins; ch = Object.assign({}, ch, { st: 'over' }); H.tick(); await new Promise((q) => setTimeout(q, 200)); r.done = b.act[3].done; r.dc = x.S.coins - c0; H.duel(() => null); return r; });
  ok(/Challenge a player/i.test(gy.a) && /Waiting for Sydney/i.test(gy.b), 'Gym Challenge: asks for a player, then waits for their answer');
  ok(/Gym Challenge vs Sydney/.test(gy.c) && /pot of 500 coins/.test(gy.c) && /3 days left/i.test(gy.c) && gy.end, 'once accepted the card is the challenge: who, the pot, and its own end: ' + gy.c.slice(0, 150));
  ok(gy.done === 1 && gy.dc === 600, 'the challenge over finishes the bounty: +600 coins');
  /* a bounty that runs out goes, with its quest, and the next card comes free */
  const ex = await V(() => { const H = window.__qbV147, b = H.state(), x = window.__qb.x(), S = x.S; delete b.act[2]; delete b.act[3]; const off0 = b.off[2] || 0; const A = H.take(2); const qid = A.qid; A.end = Date.now() - 1000; H.tick(); return { gone: !b.act[2], quest: S.quests.some((q) => q.id === qid), off: (b.off[2] || 0) - off0 }; });
  ok(ex.gone && !ex.quest && ex.off === 1, 'a bounty that runs out leaves with its quest and the next card comes');
  /* no photo board: the 3-day card is a chore */
  ok(await V(() => { window.__qbV147.photosOn(0); const o = window.__qbV147.offer(3); return o && o.ty === 'q'; }), 'with no photo board the 3-day card is a chore');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
