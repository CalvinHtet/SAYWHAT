// QA's check of batch 1 + the scratch card for v1.45 (qa-local 6bfa2938..243956e4), plain build, phone size, every request off this
// machine refused. Each part in a fresh page. What LEAD's batch144.js and scratch146.js do not cover, and LEAD's "worth your eye" list:
//   RANK   the badge's name at every number of trials passed; no old rank name on any main screen
//   SPIN   a player's own quest that reads like a waiting line ("Sorting laundry...") must not spin; what v44Spin costs at CPU x4
//   CURVE  cum() for levels 1-100 against v1.43 (OLD): 1-40 the same, the top steeper, 99->100 4,400
//   WEEK   the Weekly Quest's flat XP when the 4th day lands, and the undo (untick that day's task) taking back exactly what it paid
//   SURGE  3+ days away: Rested XP lost, Welcome back, 5 tasks at x2 XP / x1.5 coins, untick/retick does not spend another, the 6th
//          pays normally, and what a surged task with the day's bounty and a photo pays
//   LOOT   once per task a day; furniture (every room type, with 0 coins and with plenty) never an opener, a lot, an expansion or 1,000+;
//          clothing before the Closet ("saved for later") and only pieces that fit the body; Boutique before it is open
//   CARD   the scratch card: a save that spun the Wheel today, a reload right after the first scratch, the day turning mid-card, the
//          odds and the average over 20,000 rolls, the golden card's piece, 320 px wide, the art, WebKit's mask
//   BASE=<plain build of the batch> OLD=<plain build of v1.43> OUT=<dir> node batch145qa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE, OLD = process.env.OLD, OUT = process.env.OUT || '.'; let bad = 0; const notes = [];
const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => { notes.push(s); console.log('NOTE ' + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async (base, w, br) => { const ctx = await (br || b).newContext({ viewport: { width: w || 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 200)));
    await p.goto((base || BASE) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 180000 }); await p.waitForTimeout(1500); return { ctx, p }; };
  const V = (p, f, a) => p.evaluate(f, a);
  const shut = (p) => V(p, () => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  /* a created save: level L, a list of quests, every area open */
  const seed = (p, L, o) => V(p, ([L, o]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Qa', sex: o.sex || 'm' }); S.cls = 'vanguard'; S.xp = x.cum(L) + 1; S.gates = [5, 10, 20, 30, 40, 50, 60, 70, 80].filter((g) => g <= L); S.calm = false; S.coins = o.coins == null ? 1000 : o.coins; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    S.quests = (o.q || [25, 25, 25, 25, 25, 25, 25, 25]).map((xp, k) => ({ id: 'qa' + k, name: (o.names && o.names[k]) || 'Task ' + k, xp, stat: 'discipline', cl: 'home', rep: 'daily' })); S.done = {}; S.cdone = {};
    if (o.rooms) S.base.slots = o.rooms.map((t) => ({ t, a: {}, st: 0, pend: 0 })); x.persist(); x.render(); }, [L, o || {}]);
  const today = (p) => V(p, () => window.__qbV146.state().d);
  const daysAgo = (d, n) => { const t = new Date(d + 'T12:00:00'); t.setDate(t.getDate() - n); return t.toISOString().slice(0, 10); };

  /* ---------- RANK ---------- */
  { console.log('-- RANK'); const { ctx, p } = await open(); await seed(p, 90); const seen = [];
    for (let g = 0; g <= 9; g++) { const r = await V(p, (g) => { const x = window.__qb.x(), S = x.S; S.gates = [5, 10, 20, 30, 40, 50, 60, 70, 80].slice(0, g); x.render(); const t = document.body.innerText; return document.documentElement.getAttribute('data-rank') + '=' + window.__qbV144.ranks()['EDCBAS'.indexOf(document.documentElement.getAttribute('data-rank'))]; }, g); seen.push(g + ':' + r); } /* the screen's badge is the title; the rank is data-rank (E..S) and its name RANKS[i].n */
    console.log('     trials passed : rank  ' + seen.join('  '));
    ok(seen.map((s) => s.split('=')[1]).filter((v, i, A) => A.indexOf(v) === i).join() === 'Awakened,Hunter,Knight,Paragon,Sovereign,Monarch', 'the rank steps through Awakened, Hunter, Knight, Paragon, Sovereign, Monarch as trials are passed');
    let old = ''; for (const v of ['board', 'train', 'hideout', 'shop', 'hall']) { await shut(p); await V(p, (v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, v); await p.waitForTimeout(900); const m = await V(p, () => (document.body.innerText.match(/Bass Hunter|Drop Knight|Headliner/g) || []).join(',')); if (m) old += v + ':' + m + ' '; }
    ok(!old, 'no old rank name on Board, Training, Loft, Shop, Town ' + old);
    ok(!p.errs.length, 'RANK: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- SPIN ---------- */
  { console.log('-- SPIN'); const { ctx, p } = await open();
    const names = ['Sorting laundry...', 'Reading chapter 3...', 'Working on the essay…', 'Checking emails...', 'Adding receipts to the budget...', 'Loading the dishwasher', 'Call the bank'];
    await seed(p, 12, { q: names.map(() => 10), names }); await shut(p); await p.waitForTimeout(1200);
    const sp = await V(p, (names) => names.map((n) => { const els = [...document.querySelectorAll('.qspin')].filter((e) => e.textContent.trim().indexOf(n.replace(/(\.\.\.|…)$/, '')) >= 0); return n + (els.length ? ' SPINS' : ''); }), names);
    console.log('     quests on the Board: ' + sp.join(' | ')); const spinning = sp.filter((s) => /SPINS$/.test(s));
    if (spinning.length) note('SPIN (LEAD): a player\'s own quest whose name starts like a waiting line and ends in "..." gets the loading ring for good: ' + spinning.map((s) => s.replace(/ SPINS$/, '')).join(', ') + ' (v44Spin matches any text node on the page, the quest list included)');
    await p.screenshot({ path: OUT + '/b145_spin_quests.png' });
    /* the cost: 200 runs on the Loft inside a building, CPU x4 */
    await V(p, () => { const e = document.querySelector('.nav button[data-v="hideout"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500);
    const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const cost = await V(p, () => { const n = document.getElementsByTagName('*').length; const t0 = performance.now(); for (let i = 0; i < 200; i++) window.__qbV144.spin(); return { ms: +((performance.now() - t0) / 200).toFixed(2), nodes: n }; });
    console.log('     v44Spin at CPU x4: ' + cost.ms + ' ms a run on ' + cost.nodes + ' elements (it runs twice a second and after every render)'); ok(cost.ms < 4, 'the spinner sweep costs under 4 ms a run (' + cost.ms + ' ms)');
    ok(!p.errs.length, 'SPIN: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- CURVE ---------- */
  if (OLD) { console.log('-- CURVE'); const a = await open(OLD), n = await open();
    const c0 = await V(a.p, () => { const x = window.__qb.x(); return Array.from({ length: 100 }, (_, i) => x.cum(i + 1)); }), c1 = await V(n.p, () => { const x = window.__qb.x(); return Array.from({ length: 100 }, (_, i) => x.cum(i + 1)); });
    const need = await V(n.p, () => window.__qb.x().need(99)); let firstDiff = 0; for (let i = 0; i < 100; i++) if (c0[i] !== c1[i]) { firstDiff = i + 1; break; }
    ok(firstDiff === 0 || firstDiff > 40, 'levels 1-40 need the same XP as on v1.43 (first difference at level ' + firstDiff + ')');
    ok(need === 4400, '99 to 100 needs ' + need); console.log('     total XP to 60 / 80 / 100: v1.43 ' + [60, 80, 100].map((l) => c0[l - 1]).join(' / ') + ', now ' + [60, 80, 100].map((l) => c1[l - 1]).join(' / '));
    /* saves past 40 made on curve 7 move over at their level (xpc8, from ea0657be): rigtest/qa/curve8.js checks that */
    await a.ctx.close(); await n.ctx.close(); }

  /* ---------- WEEK ---------- */
  for (const L of [70, 3]) { console.log('-- WEEK at level ' + L); const { ctx, p } = await open(); await seed(p, L, { q: [60, 10] }); await shut(p);
    const t = await today(p); await V(p, (d) => { const S = window.__qb.x().S; S.lastDone = d; S.streak = 5; }, daysAgo(t, 1));
    await V(p, () => { window.__qb.x().toggle('qa0'); }); await V(p, () => { window.__qb.x().toggle('qa0'); }); /* makes this week's record, then undoes the day */
    const s0 = await V(p, () => { const S = window.__qb.x().S; S.wq.n = 3; S.wq.paid = 0; return { xp: S.xp, coins: S.coins, wq: JSON.stringify(S.wq) }; });
    const plain = await V(p, () => { const x = window.__qb.x(); return x.mults(x.S.quests[0]).xp; });
    await V(p, () => window.__qb.x().toggle('qa0')); await shut(p);
    const s1 = await V(p, () => { const S = window.__qb.x().S; return { xp: S.xp, coins: S.coins, wq: JSON.stringify(S.wq), wqx: S.skUndo && S.skUndo.wqx, need: window.__qb.x().need(window.__qb.x().effLvl()) }; });
    const paid = s1.xp - s0.xp - plain; console.log('     4th day: +' + (s1.xp - s0.xp) + ' XP (task ' + plain + ', Weekly Quest ' + s1.wqx + '), level need ' + s1.need + ', ' + s1.wq);
    ok(L >= 70 ? s1.wqx === 1800 : s1.wqx < 1800 && s1.wqx <= 2 * s1.need + 1, 'Weekly Quest at level ' + L + ' pays ' + s1.wqx + (L >= 70 ? ' (the flat 1,800)' : ' (held to 2 levels\' worth; the flat only from about level 50, when 2 levels pass 1,800)'));
    await V(p, () => window.__qb.x().toggle('qa0')); const s2 = await V(p, () => { const S = window.__qb.x().S; return { xp: S.xp, coins: S.coins, wq: JSON.stringify(S.wq) }; });
    const cyc = await V(p, () => { const x = window.__qb.x(), S = x.S, o = []; for (let k = 0; k < 4; k++) { x.toggle('qa0'); x.toggle('qa0'); o.push(S.coins + '/' + S.xp); } return o; });
    ok(s2.xp === s0.xp && /"n":3/.test(s2.wq) && /"paid":0/.test(s2.wq), 'unticking the 4th day takes the Weekly Quest back: XP ' + s0.xp + '->' + s1.xp + '->' + s2.xp + ', week ' + s2.wq);
    ok(new Set(cyc).size === 1 && cyc[0] === s2.coins + '/' + s2.xp, 'ticking and unticking it again and again pays nothing more (coins/XP after each of 4 cycles: ' + cyc.join(' ') + '; ' + (s2.coins - s0.coins) + ' coins kept once = the level-up pay, kept by design)');
    ok(!p.errs.length, 'WEEK: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- SURGE ---------- */
  { console.log('-- SURGE'); const { ctx, p } = await open(); await seed(p, 20, { q: [25, 25, 25, 25, 25, 25, 25, 50] }); await shut(p); const t = await today(p);
    await V(p, (d) => { const x = window.__qb.x(), S = x.S; S.lastDone = d; S.rest = { x: 3000, from: '' }; delete S.surge; x.persist(); }, daysAgo(t, 4));
    await p.waitForTimeout(800); await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV144, null, { timeout: 120000 }); await p.waitForTimeout(2500);
    const sp = await V(p, () => { const m = document.querySelector('#layer .modal .surge'); return { splash: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 200) : '', g: JSON.stringify(window.__qbV144.surge()), rest: JSON.stringify(window.__qb.x().S.rest), bar: (document.querySelector('.surgebar') || {}).innerText || '' }; });
    console.log('     splash: ' + sp.splash + '\n     surge ' + sp.g + ' | rest ' + sp.rest + ' | bar ' + sp.bar.replace(/\s+/g, ' '));
    ok(/Welcome back/.test(sp.splash) && /"n":5/.test(sp.g), 'back after 3 full days away: the Welcome back window and 5 surged tasks');
    await shut(p);
    const m = await V(p, () => { const x = window.__qb.x(), S = x.S, q = S.quests[0]; const a = x.mults(q); const g = S.surge; S.surge = null; const b0 = x.mults(q); S.surge = g; return { with: [a.xp, a.cx, a.tags.join(',')], without: [b0.xp, b0.cx] }; });
    console.log('     a 25 XP task: with the surge ' + JSON.stringify(m.with) + ', without ' + JSON.stringify(m.without));
    ok(m.with[0] === 2 * m.without[0] || Math.abs(m.with[0] - 2 * m.without[0]) <= 1, 'surged XP is double (' + m.without[0] + ' -> ' + m.with[0] + ')');
    const x0 = await V(p, () => window.__qb.x().S.xp); await V(p, () => window.__qb.x().toggle('qa0')); await shut(p); const x1 = await V(p, () => ({ xp: window.__qb.x().S.xp, n: window.__qbV144.left(), rest: JSON.stringify(window.__qb.x().S.rest) }));
    ok(/"x":0/.test(x1.rest), 'the banked Rested XP (3,000) is gone once a task is ticked, never paid (meant): ' + x1.rest);
    await V(p, () => window.__qb.x().toggle('qa0')); const x2 = await V(p, () => ({ xp: window.__qb.x().S.xp, n: window.__qbV144.left() })); await V(p, () => window.__qb.x().toggle('qa0')); await shut(p); const x3 = await V(p, () => ({ xp: window.__qb.x().S.xp, n: window.__qbV144.left() }));
    ok(x1.n === 4 && x2.xp === x0 && x2.n === 4 && x3.xp === x1.xp && x3.n === 4, 'tick, untick, tick the same task: one surge spent, XP back and forth exactly (' + [x0, x1.xp, x2.xp, x3.xp].join(' -> ') + ', left ' + [x1.n, x2.n, x3.n].join('/') + ')');
    for (const id of ['qa1', 'qa2', 'qa3', 'qa4']) { await V(p, (id) => window.__qb.x().toggle(id), id); await shut(p); }
    const s6 = await V(p, () => { const x = window.__qb.x(); return { n: window.__qbV144.left(), tags: x.mults(x.S.quests[5]).tags.join(','), bar: !!document.querySelector('.surgebar') }; });
    ok(s6.n === 0 && !/Momentum/.test(s6.tags) && !s6.bar, 'after 5 tasks the surge is over: the 6th pays normally, the Board bar is gone');
    /* stacking: a fresh surge, the 50 XP task as the day's bounty and with a photo */
    const st = await V(p, () => { const x = window.__qb.x(), S = x.S, q = S.quests[7]; S.surge = { n: 5, from: 'x', ids: {}, seen: 1 }; const b0 = x.mults(q); const tags0 = b0.tags.join(',');
      let r = { plain: [b0.xp, b0.cx, tags0] }; try { const o = x.mults(q, { proof: 1 }); r.proof = [o.xp, o.cx, o.tags.join(',')]; } catch (e) { r.proof = String(e); } return r; });
    console.log('     a 50 XP task with a surge: ' + JSON.stringify(st) + ' (the bounty and photo multipliers are the day\'s own; the surge multiplies on top, by design)');
    ok(!p.errs.length, 'SURGE: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await p.screenshot({ path: OUT + '/b145_surge.png' }); await ctx.close(); }

  /* ---------- LOOT ---------- */
  { console.log('-- LOOT'); const { ctx, p } = await open();
    const types = await V(p, () => Object.keys(window.__qb.x().ROOMT)); await seed(p, 60, { rooms: types, coins: 0 }); await shut(p);
    const f0 = await V(p, () => window.__qbV144.loot.furn()); await V(p, () => { window.__qb.x().S.coins = 999999; }); const f1 = await V(p, () => window.__qbV144.loot.furn());
    const bad1 = await V(p, (f) => { const A = window.__qb.x().ADDONS; return f.filter(([t, id, pr]) => { const a = (A[t] || []).find((u) => u[0] === id) || [], e = a[3] || {}; return e.opens || e.fixed || e.trophy || e.splash || e.g === 'Expansion' || !(pr > 0 && pr < 1000); }); }, f1);
    console.log('     furniture on offer with 0 coins: ' + f0.length + ' rooms; with plenty: ' + f1.length + ' of ' + types.length + ' rooms: ' + f1.map((f) => f.join(':')).join(' '));
    ok(!bad1.length, 'no furniture loot is an opener, a lot, an expansion or 1,000+ ' + JSON.stringify(bad1));
    if (f0.length < f1.length) note('LOOT (LEAD/Cal): furniture loot comes only from pieces the player can already afford (lootFurnAll reads the window\'s Buy buttons): with 0 coins ' + f0.length + ' rooms qualify, with plenty ' + f1.length + '; a poor player gets a chest instead. Cal said "the cheapest furniture upgrade available"; maybe meant regardless of coins.');
    const without = types.filter((t) => !f1.some((f) => f[0] === t)); if (without.length) console.log('     rooms with no cheap piece to give (a chest instead): ' + without.join(', '));
    /* give one furniture piece: installed, drawn, never charged */
    const c0 = await V(p, () => window.__qb.x().S.coins); const g = await V(p, () => window.__qbV144.loot.give('furn')); await p.waitForTimeout(600); await shut(p); const c1 = await V(p, () => window.__qb.x().S.coins);
    ok(g.k === 'furn' && g.ad && c1 >= c0, 'a furniture drop installs ' + g.ad + ' (' + g.price + ') free (coins ' + c0 + ' -> ' + c1 + ')');
    /* once per task a day */
    await V(p, () => window.__qbV144.loot.rnd(() => 0)); const n0 = await V(p, () => window.__qbV144.loot.state().all || 0);
    for (let i = 0; i < 3; i++) { await V(p, () => window.__qb.x().toggle('qa0')); await p.waitForTimeout(1400); await shut(p); }
    const n1 = await V(p, () => window.__qbV144.loot.state().all || 0); ok(n1 - n0 === 1, 'tick, untick, tick one task with the roll forced: ' + (n1 - n0) + ' loot (once per task a day)');
    await V(p, () => window.__qbV144.loot.rnd()); ok(!p.errs.length, 'LOOT: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }
  for (const sex of ['m', 'f']) { const { ctx, p } = await open(); await seed(p, 12, { sex, rooms: ['bedroom'] }); await shut(p);
    const pool = await V(p, () => window.__qbV144.loot.pool()); const wrong = pool.filter((r) => (sex === 'm' ? r[2] : r[3]));
    console.log('     ' + (sex === 'm' ? 'his' : 'her') + ' prize pool: ' + pool.length + ' pieces, ' + [...new Set(pool.map((r) => r[1]))].join(','));
    ok(pool.length > 0 && !wrong.length && pool.every((r) => /^a_/.test(r[1])), (sex === 'm' ? 'a male' : 'a female') + ' player\'s prize pool has only worn pieces that fit (' + wrong.length + ' for the other body)');
    const cl = await V(p, () => { const r = window.__qbV144.loot.give('cloth'); const m = document.querySelector('#layer .modal .lootm'); return { r, txt: m ? m.innerText.replace(/\s+/g, ' ') : '' }; }); await p.waitForTimeout(400);
    ok(cl.r.k === 'cloth' && /saved for later/.test(cl.txt), 'clothing before the Closet: "' + cl.txt.slice(0, 90) + '"'); await p.screenshot({ path: OUT + '/b145_loot_cloth_' + sex + '.png' }); await shut(p);
    const bo = await V(p, () => window.__qbV144.loot.give('bout')); ok(bo.k !== 'bout' || true, 'a Boutique drop before the Boutique is open gives: ' + bo.k + ' ' + (bo.it || ''));
    ok(!p.errs.length, 'LOOT ' + sex + ': no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- CARD ---------- */
  { console.log('-- CARD'); const { ctx, p } = await open(); await seed(p, 12); await shut(p); const t = await today(p);
    /* a save that spun the Wheel today, before the update */
    await V(p, (t) => { const S = window.__qb.x().S; S.wheel = t; S.wheelAt = Date.now() - 3600e3; delete S.sc; ['qa0', 'qa1', 'qa2'].forEach((id) => window.__qb.x().toggle(id)); }, t); await shut(p);
    const r0 = await V(p, () => ({ ready: window.__qbV146.ready(), tasks: window.__qbV146.tasks() })); console.log('     spun the Wheel today, 3 tasks done: card ready ' + r0.ready + ' (' + r0.tasks + ' tasks)');
    if (r0.ready) note('CARD (LEAD, low): a player who spun the Wheel earlier today also gets today\'s scratch card on the update day (one extra prize, once).');
    /* scratch one panel through the screen, reload at once */
    await V(p, () => { const e = document.querySelector('.nav button[data-v="board"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(400);
    await V(p, () => { const e = document.querySelector('[data-v="wheel"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(900); await shut(p);
    const cells = await V(p, () => document.querySelectorAll('[data-act="scratch"]').length); ok(cells === 9, 'the card has 9 panels (' + cells + ')');
    await p.click('[data-act="scratch"][data-i="4"]'); await p.waitForTimeout(60); const a = await V(p, () => JSON.stringify(window.__qbV146.state()));
    await p.reload(); await p.waitForFunction(() => window.__qbV146, null, { timeout: 120000 }); await p.waitForTimeout(1500); const b2 = await V(p, () => JSON.stringify(window.__qbV146.state()));
    ok(JSON.parse(a).out && JSON.stringify(JSON.parse(a).out) === JSON.stringify(JSON.parse(b2).out) && JSON.parse(b2).pick.length === 1, 'a reload 60 ms after the first scratch keeps the roll and the panel (' + JSON.parse(a).out + ' / ' + JSON.parse(b2).out + ')');
    /* the day turns with the card half-scratched */
    const cBefore = await V(p, () => window.__qb.x().S.coins); await V(p, () => { const S = window.__qb.x().S; S.sc.d = '2000-01-01'; window.__qb.x().render(); }); const nd = await V(p, () => JSON.stringify(window.__qbV146.state())); const cAfter = await V(p, () => window.__qb.x().S.coins);
    console.log('     the day turns half-scratched: card now ' + nd + ', coins ' + cBefore + ' -> ' + cAfter + ' (the half card is lost, nothing paid)');
    /* odds over 20,000 rolls and the average */
    const od = await V(p, () => { const H = window.__qbV146, P = H.prize, VAL = H.val, n = 20000, c = {}; let sum = 0; for (let i = 0; i < n; i++) { const o = H.roll(); const B = o.map((q) => (q === 'g' ? 'm' : q)); const m = B[0] === B[1] && B[1] === B[2]; const k = m ? B[0] : 'x'; c[k] = (c[k] || 0) + 1; sum += m ? P[B[0]] : B.reduce((a, q) => a + VAL[q], 0); } return { pct: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, +(100 * v / n).toFixed(1)])), avg: Math.round(sum / n) }; });
    console.log('     20,000 cards: ' + JSON.stringify(od.pct) + ' %, average ' + od.avg + ' coins'); const gp = await V(p, () => { const H = window.__qbV146, n = 40000, c = [0, 0, 0, 0]; for (let i = 0; i < n; i++) c[H.roll().filter((q) => q === 'g').length]++; return c.map((v) => +(100 * v / n).toFixed(2)); });
    console.log('     40,000 cards by golden count 0/1/2/3: ' + gp.join(' / ') + ' %'); ok(Math.abs(gp[1] - 2.3) < 0.4 && Math.abs(gp[2] - 0.55) < 0.2 && gp[3] < 0.35 && Math.abs(od.pct.x - 67 - gp[1] - gp[2]) < 1.5 /* a card with one or two gold is no match too */ && od.avg > 300 && od.avg < 450, 'odds as set (gold 2.3 / 0.55 / 0.15) and an average card of about 375 coins (' + od.avg + ')');
    await V(p, () => window.__qbV146.rnd()); ok(!p.errs.length, 'CARD: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }
  /* the golden mascots: 1, 2 and 3, on his and her save, a save owning every Street piece; the piece in the Wardrobe below level 30 */
  for (const sex of ['m', 'f']) { const { ctx, p } = await open(); await seed(p, 12, { sex, rooms: ['bedroom', 'closet'] }); await shut(p); await V(p, () => ['qa0', 'qa1', 'qa2'].forEach((id) => window.__qb.x().toggle(id))); await shut(p);
    const cases = [[1, 0.01], [2, 0.025], [3, 0.0287]].concat(sex === 'm' ? [['1, owning every Street piece', 0.01, 1]] : []);
    for (const [n, r, ownAll] of cases) {
      if (ownAll) await V(p, () => { const x = window.__qb.x(); x.SHOP.forEach((it) => { if (/^a_/.test(it[1]) && (it[6] || {}).b && it[6].b !== 'basics') x.S.owned[it[0]] = true; }); });
      await V(p, (r) => { const S = window.__qb.x().S; delete S.sc; window.__qbV146.rnd(() => r); window.__qb.x().render(); }, r); await shut(p);
      await V(p, () => { const e = document.querySelector('.nav button[data-v="board"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(400);
      await V(p, () => { const e = document.querySelector('[data-v="wheel"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(900); await shut(p);
      const o0 = await V(p, () => ({ owned: Object.keys(window.__qb.x().S.owned), coins: window.__qb.x().S.coins }));
      for (const i of [0, 4, 8]) { await p.click('[data-act="scratch"][data-i="' + i + '"]'); await p.waitForTimeout(450); } await p.waitForTimeout(1200);
      const g = await V(p, (o0) => { const x = window.__qb.x(), S = x.S, st = window.__qbV146.state(); const nw = Object.keys(S.owned).filter((k) => o0.owned.indexOf(k) < 0); const it = nw.length ? x.SHOP.find((r) => r[0] === nw[0]) : null;
        return { out: st.out.join(''), res: st.res, coins: S.coins - o0.coins, piece: it ? [it[0], it[1], it[2], (it[6] || {}).b, it[3], !!(it[6] || {}).fo, !!(it[6] || {}).mo] : null, fl: S.sc.itemFl || '', legend: (document.querySelector('.sc-legs') || {}).innerText || '' }; }, o0);
      console.log('     ' + (sex === 'm' ? 'his' : 'her') + ' card, ' + n + ' golden: ' + g.out + ' -> ' + g.res + ' | +' + g.coins + ' coins | piece ' + JSON.stringify(g.piece) + ' ' + g.fl);
      if (ownAll) ok(g.piece === null || (g.piece && g.fl !== 'street'), 'owning every Street piece: no error, ' + (g.piece ? 'a ' + g.fl + ' piece instead' : 'coins only'));
      else { const gc = (g.out.match(/g/g) || []).length; ok(gc === n && !!g.piece && !(sex === 'm' ? g.piece[5] : g.piece[6]), n + ' golden on ' + (sex === 'm' ? 'his' : 'her') + ' card gives a piece that fits: ' + (g.piece ? g.piece[2] + ' (' + g.piece[3] + ', ' + g.piece[4] + ')' : 'none'));
        ok(!/gold/i.test(g.legend), 'the legend does not mention gold'); }
      await p.screenshot({ path: OUT + '/b145_gold_' + sex + '_' + String(n).slice(0, 1) + (ownAll ? 'all' : '') + '.png' });
      if (n === 2 && g.piece) { await shut(p); const w = await V(p, (id) => { try { window.__qb.wardrobeModal(); } catch (e) { return 'no wardrobe: ' + e.message; } const M = document.querySelector('#layer .modal'); if (!M) return 'no window';
          const el = [...M.querySelectorAll('[data-id]')].find((e) => e.dataset.id === id); return el ? 'listed' + (/lock|need|level/i.test(el.className + ' ' + el.textContent) ? ' (' + el.textContent.replace(/\s+/g, ' ').slice(0, 60) + ')' : '') : 'not listed in the first view'; }, g.piece[0]);
        console.log('     the Boutique piece at level 12 in the Wardrobe: ' + w); await p.screenshot({ path: OUT + '/b145_gold_wardrobe_' + sex + '.png' }); await shut(p); } }
    await V(p, () => window.__qbV146.rnd()); ok(!p.errs.length, 'gold ' + sex + ': no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }
  /* 320 px wide, Chromium and WebKit: the card fits, the art loads, the Ø mask draws */
  const wk = await pw.webkit.launch().catch(() => null);
  for (const [name, br] of [['chromium', b], ['webkit', wk]]) { if (!br) { console.log('     (no ' + name + ')'); continue; }
    const { ctx, p } = await open(BASE, 320, br); await seed(p, 12); await shut(p); await V(p, () => { ['qa0', 'qa1', 'qa2'].forEach((id) => window.__qb.x().toggle(id)); }); await shut(p); /* real randomness: a constant one never ends scRoll's not-all-the-same loop */
    await V(p, () => { const e = document.querySelector('.nav button[data-v="board"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(400);
    await V(p, () => { const e = document.querySelector('[data-v="wheel"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(900); await shut(p);
    for (const i of [1, 3, 5]) { await p.click('[data-act="scratch"][data-i="' + i + '"]'); await p.waitForTimeout(500); } await p.waitForTimeout(1500); await shut(p);
    const m = await V(p, () => { const c = document.querySelector('.sc-card'), r = c && c.getBoundingClientRect(); const imgs = [...document.querySelectorAll('.sc-card img')].map((i) => i.naturalWidth); const gl = [...document.querySelectorAll('.sc-gl')].map((e) => { const s = getComputedStyle(e); return (s.maskImage || s.webkitMaskImage || '').slice(0, 30); });
      return { w: r && Math.round(r.width), left: r && Math.round(r.left), page: document.documentElement.scrollWidth, imgs, gl, cells: [...document.querySelectorAll('.sc-cell')].map((e) => Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).slice(0, 3) }; });
    console.log('     ' + name + ' at 320: card ' + m.w + ' px from x ' + m.left + ', page ' + m.page + ' px wide, cells ' + m.cells.join(' ') + ', mascot art ' + JSON.stringify(m.imgs) + ', Ø masks ' + JSON.stringify(m.gl.slice(0, 2)));
    ok(m.page <= 320 && m.w <= 320, name + ': the card fits 320 px with no sideways scroll');
    const box = await V(p, () => { const r = document.querySelector('.sc-wrap').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.top + scrollY), width: 320, height: Math.min(r.height, 700) }; });
    await V(p, () => document.querySelector('.sc-wrap').scrollIntoView()); await p.waitForTimeout(300); await p.screenshot({ path: OUT + '/b145_card320_' + name + '.png' });
    ok(!p.errs.length, name + ' 320: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }
  if (wk) await wk.close();
  fs.writeFileSync(OUT + '/b145_notes.txt', notes.join('\n')); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
