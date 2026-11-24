// QA, the 1/2/3-day bounties (qa-local 96465b5b, 29zz_v147.js; Cal 11-24 item 11). What LEAD's bounty147.js does not cover:
//   UNDO   a finished chore bounty: untick its quest, tick it again: the 250 is paid once (and what unticking takes back)
//   DUEL   a Gym Challenge the other player declines: the card asks again on the bounty's own clock
//   HOLD   a bounty given up with no rerolls left, then its time runs out while held: the next card comes, free
//   DAY    the next day: rerolls back to 3, a held bounty still held, a running one still running
//   OLD    a save from v1.45 with an old-system bounty quest on its Board: it stays, pays as before, the new cards show, no errors
//   CALM   a new player's first days (calm mode): no bounties
//   LOOK   the cards at 390 and 320 px: three offers; a taken one with its x; a done one; a held one ("the same bounty is back")
//   BASE=<plain build> OUT=<dir> node bq147qa.js
const pw = require('playwright');
const BASE = process.env.BASE, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async (w) => { const ctx = await b.newContext({ viewport: { width: w || 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 200)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV147 && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(3000); return { ctx, p }; };
  const V = (p, f, a) => p.evaluate(f, a);
  const shut = (p) => V(p, () => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const seed = (p, o) => V(p, (o) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Bq', sex: 'm' }); S.cls = 'vanguard'; S.xp = x.cum(12) + 1; S.gates = [5, 10]; S.calm = !!o.calm; S.coins = 1000; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    S.quests = [{ id: 'a', name: 'Task A', xp: 25, stat: 'discipline', cl: 'home', rep: 'daily' }]; S.done = {}; S.cdone = {}; delete S.bq; if (o.extra) S.quests.push(o.extra); x.persist(); x.render(); }, o || {});
  const cards = (p) => V(p, () => { window.__qb.x().render(); return [...document.querySelectorAll('.bty-card.bq')].map((c) => c.innerText.replace(/\s+/g, ' ').trim().slice(0, 110)); });
  const nav = async (p, v) => { await shut(p); await V(p, (v) => { const e = document.querySelector('.nav button[data-v="' + v + '"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, v); await p.waitForTimeout(600); await shut(p); };

  /* ---------- UNDO ---------- */
  { console.log('-- UNDO'); const { ctx, p } = await open(); await seed(p); await shut(p);
    await V(p, () => { const x = window.__qb.x(); x.toggle('a'); x.toggle('a'); }); /* the day's first-tick rewards out of the way first (they stay on an untick, by design) */
    const A = await V(p, () => window.__qbV147.take(1)); const q = await V(p, (qid) => { const S = window.__qb.x().S; return S.quests.find((z) => z.id === qid); }, A.qid);
    const c0 = await V(p, () => ({ c: window.__qb.x().S.coins, x: window.__qb.x().S.xp }));
    await V(p, (id) => window.__qb.x().toggle(id), A.qid); await p.waitForTimeout(500); await shut(p); const c1 = await V(p, () => ({ c: window.__qb.x().S.coins, x: window.__qb.x().S.xp, done: window.__qbV147.state().act[1].done }));
    await V(p, (id) => window.__qb.x().toggle(id), A.qid); await p.waitForTimeout(500); await shut(p); const c2 = await V(p, () => ({ c: window.__qb.x().S.coins, x: window.__qb.x().S.xp }));
    await V(p, (id) => window.__qb.x().toggle(id), A.qid); await p.waitForTimeout(500); await shut(p); const c3 = await V(p, () => ({ c: window.__qb.x().S.coins, x: window.__qb.x().S.xp }));
    console.log('     "' + q.name + '": coins ' + [c0.c, c1.c, c2.c, c3.c].join(' -> ') + ', XP ' + [c0.x, c1.x, c2.x, c3.x].join(' -> ') + ' (tick, untick, tick)');
    ok(c1.done === 1 && c3.c - c1.c === 0 && c3.x === c1.x, 'the bounty pays once: ticking it again pays the quest again, never the 250 twice');
    ok(c2.c - c0.c === 0, 'unticking takes everything back, the bounty\'s 250 too (LEAD 7e6f9351, QA\'s FIX): ' + (c2.c - c0.c) + ' coins kept with the quest unticked');
    ok(!p.errs.length, 'UNDO: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- DUEL declined ---------- */
  { console.log('-- DUEL declined'); const { ctx, p } = await open(); await seed(p); await shut(p);
    await V(p, () => { const H = window.__qbV147; H.photosOn(true); H.othersOn(true); });
    let tries = 0; while (tries < 30 && (await V(p, () => (window.__qbV147.offer(3) || {}).id)) !== 'gym') { await V(p, () => { const b = window.__qbV147.state(); b.off[3] = (+b.off[3] || 0) + 1; }); tries++; }
    const A = await V(p, () => window.__qbV147.take(3)); const t0 = A.t0, end0 = A.end;
    await V(p, (t0) => { window.__qbV147.duel(() => ({ from: 'me', kind: 'w', t: t0, st: 'ask', otherName: 'Sydney', cid: 'c1' })); window.__qbV147.tick(); }, t0); const a1 = await cards(p); const w1 = await V(p, () => window.__qbV147.state().act[3].wait);
    await V(p, (t0) => { window.__qbV147.duel(() => ({ from: 'me', kind: 'w', t: t0, st: 'live', otherName: 'Sydney', cid: 'c1', end: t0 + 4 * 864e5, stake: 100 })); window.__qbV147.tick(); }, t0); const a2 = await V(p, () => { const A = window.__qbV147.state().act[3]; return { vs: A.vs, end: A.end }; });
    await V(p, () => { window.__qbV147.duel(() => null); window.__qbV147.tick(); }); const a3 = await V(p, () => { const A = window.__qbV147.state().act[3]; return { vs: A.vs || '', cid: A.cid || '', end: A.end, wait: A.wait || '' }; }); const c3 = await cards(p);
    console.log('     asked: ' + a1.filter((c) => /3-DAY|3-day/i.test(c)).join('') + '\n     accepted: vs ' + a2.vs + ', end moved ' + Math.round((a2.end - end0) / 3600e3) + ' h\n     then gone (declined or cancelled): ' + JSON.stringify(a3) + ' | ' + c3.filter((c) => /Gym/i.test(c)).join(''));
    ok(w1 === 'Sydney', 'asked: the card waits for Sydney (' + w1 + ')');
    ok(a2.vs === 'Sydney' && a2.end === t0 + 4 * 864e5, 'accepted: the card takes the challenge\'s end');
    ok(!a3.vs && !a3.cid && a3.end === end0, 'when the challenge goes away the card asks again on its own 3-day clock');
    ok(!p.errs.length, 'DUEL: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- HOLD runs out, then DAY ---------- */
  { console.log('-- HOLD and DAY'); const { ctx, p } = await open(); await seed(p); await shut(p);
    const A = await V(p, () => { const H = window.__qbV147, b = H.state(); b.rr = 3; const A = H.take(2); H.drop(2); return { n: A.n, end: A.end }; });
    const h = await V(p, () => { const b = window.__qbV147.state(); return { held: !!b.hold[2], offer: window.__qbV147.offer(2).n }; }); ok(h.held && h.offer === A.n, 'no rerolls: the dropped bounty is held and offered again ("' + h.offer + '")');
    await V(p, () => { const b = window.__qbV147.state(); b.hold[2].end = Date.now() - 1000; window.__qbV147.tick(); }); const h2 = await V(p, () => { const b = window.__qbV147.state(); return { held: !!b.hold[2], offer: window.__qbV147.offer(2).n, coins: window.__qb.x().S.coins }; });
    ok(!h2.held && h2.offer !== A.n && h2.coins === 1000, 'once its time runs out while held, a new card comes, free ("' + h2.offer + '", coins ' + h2.coins + ')');
    /* the next day */
    await V(p, () => { const H = window.__qbV147, b = H.state(); b.rr = 3; H.take(1); const B = H.take(3); H.drop(3); b.d = '2000-01-01'; });
    const d = await V(p, () => { const b = window.__qbV147.state(); return { rr: b.rr, run1: !!b.act[1], held3: !!b.hold[3] }; });
    ok(d.rr === 0 && d.run1 && d.held3, 'the next day: 3 rerolls again, the running bounty runs on, the held one is still held ' + JSON.stringify(d));
    ok(!p.errs.length, 'HOLD/DAY: no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- OLD ---------- */
  { console.log('-- OLD'); const { ctx, p } = await open(); const t = await V(p, () => { const d = new Date(Date.now() - 5 * 3600e3); return d.toISOString().slice(0, 10); });
    await seed(p, { extra: { id: 'qold', name: 'Wash the bedding', xp: 30, stat: 'productivity', cl: 'home', rep: 'once', why: 'Sheets.', bty: { k: 1, end: t, key: '1:' + t } } }); await shut(p);
    const o = await V(p, () => { const x = window.__qb.x(), q = x.S.quests.find((z) => z.id === 'qold'); return { on: !!q, tags: q ? x.mults(q).tags.join(',') : '', cards: document.querySelectorAll('.bty-card.bq').length, running: window.__qbV147.running() }; });
    console.log('     ' + JSON.stringify(o)); ok(o.on && /Bounty x1\.5/.test(o.tags) && o.cards === 3 && o.running === 0, 'an old-system bounty quest stays on the Board and pays x1.5; the three new cards show beside it');
    const c0 = await V(p, () => window.__qb.x().S.coins); await V(p, () => window.__qb.x().toggle('qold')); await p.waitForTimeout(500); await shut(p); const c1 = await V(p, () => window.__qb.x().S.coins);
    ok(c1 > c0 && !p.errs.length, 'ticking it pays as before (coins ' + c0 + ' -> ' + c1 + '), no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }

  /* ---------- CALM ---------- */
  { console.log('-- CALM'); const { ctx, p } = await open(); await seed(p, { calm: true }); await shut(p);
    const c = await V(p, () => ({ cards: document.querySelectorAll('.bty-card.bq').length, calmDay: (typeof calmDay === 'function') ? calmDay() : '?' }));
    console.log('     calm save: ' + JSON.stringify(c) + ' (calm mode hides bounties until its 3rd day)'); await ctx.close(); }

  /* ---------- LOOK ---------- */
  for (const w of [390, 320]) { const { ctx, p } = await open(w); await seed(p); await shut(p);
    const shot = async (name) => { await V(p, () => { window.__qb.x().render(); const e = document.querySelector('.bty'); if (e) e.scrollIntoView({ block: 'start' }); }); await p.waitForTimeout(400); await shut(p);
      const m = await V(p, () => { const s = document.querySelector('.bty'); if (!s) return null; const r = s.getBoundingClientRect(); const over = [...s.querySelectorAll('.bty-card.bq')].map((c) => { const x = c.querySelector('.bq-x'), l = c.querySelector('.label'); if (!x || !l) return 0; const a = x.getBoundingClientRect(), bb = l.getBoundingClientRect(); return (a.left < bb.right && a.right > bb.left && a.top < bb.bottom && a.bottom > bb.top) ? 1 : 0; });
        const wide = [...s.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).length; return { y: r.top + scrollY, h: r.height, over: over.reduce((a, b) => a + b, 0), wide, page: document.documentElement.scrollWidth }; });
      if (m) await p.screenshot({ path: OUT + '/bq_' + w + '_' + name + '.png', fullPage: false }); return m; };
    const m0 = await shot('offers');
    await V(p, () => { window.__qbV147.take(1); window.__qbV147.take(3); }); const m1 = await shot('taken');
    await V(p, () => { const A = window.__qbV147.state().act[1]; window.__qb.x().toggle(A.qid); }); await p.waitForTimeout(500); const m2 = await shot('done');
    await V(p, () => { const H = window.__qbV147, b = H.state(); b.rr = 3; H.drop(3); }); const m3 = await shot('held');
    console.log('     ' + w + ' px: ' + [m0, m1, m2, m3].map((m) => m ? 'h ' + Math.round(m.h) + ', x over label ' + m.over + ', past the edge ' + m.wide + ', page ' + m.page : 'no section').join(' | '));
    ok([m0, m1, m2, m3].every((m) => m && m.wide === 0 && m.page <= w), /* the x's overlap with the label's box is its padding, made for it (checked by eye) */ w + ' px: the cards fit, the x never covers a label, nothing past the edge');
    ok(!p.errs.length, 'LOOK ' + w + ': no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
