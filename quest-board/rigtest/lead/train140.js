// Cal 11-23 (29zz_v140.js): a finished session pays XP and coins once a day and the summary says both; Weekly Warrior's coins go x1,
// x1.25 ... x2 after a 4 week streak and drop 0.25 a missed week; the Board's category count is the open quests only; dates and calls
// to people are People, the bank, a membership, a laptop are Work and admin, and quests already on the Board are moved once.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/train140.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV140, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(6); S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1 }; S.tutDone = 1; x.render(); });
  /* the multiplier */
  const mm = await p.evaluate(() => { const S = window.__qb.x().S, H = window.__qbV140, wk = (n) => { const d = new Date(); d.setHours(12); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7 * n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    const r = {}, set = (ns) => { S.weekPaid = {}; ns.forEach((n) => { S.weekPaid[wk(n)] = 1 }); return H.mult(); };
    r.none = set([]); r.one = set([1]); r.four = set([1, 2, 3, 4]); r.six = set([1, 2, 3, 4, 5, 6]); r.miss1 = set([2, 3, 4, 5, 6]); r.miss3 = set([4, 5, 6, 7, 8, 9]); r.miss9 = set([10, 11, 12, 13]);
    r.line0 = (set([]), H.line(false)); r.lineP = (set([1]), H.line(true)); r.line2 = (set([1, 2, 3, 4]), H.line(false)); r.coins = (set([1, 2]), H.bonus().coins); r.base = (set([]), H.bonus().coins); S.weekPaid = {}; return r; });
  ok(mm.none === 1 && mm.one === 1.25 && mm.four === 2 && mm.six === 2, 'x1, x1.25 after a week, x2 after a 4 week streak, never more ' + JSON.stringify(mm));
  ok(mm.miss1 === 1.75 && mm.miss3 === 1.25 && mm.miss9 === 1, 'a missed week takes 0.25 off, down to x1');
  ok(mm.line0 === 'Keep it up for x1.25 coins next week.' && /x1.25 coins\. Keep it up for x1.5/.test(mm.lineP) && /x2 coins\. Miss it and next week drops to x1.75/.test(mm.line2), 'the lines: ' + [mm.line0, mm.lineP, mm.line2].join(' | '));
  ok(mm.coins === Math.round(mm.base * 1.5), 'coins x1.5 after 2 weeks: ' + mm.base + ' -> ' + mm.coins);
  /* a session */
  const sess = async () => { await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="train"]').click(); }); await p.waitForTimeout(700);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const bt = document.querySelector('[data-act="wkplan"]'); bt.click(); });
    await p.waitForTimeout(500);
    return p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.wk.list.forEach((id) => { S.wk.sets[id] = [1, 1, 1, 1, 1, 1] }); const c0 = S.coins, x0 = S.xp, tx0 = window.__qbEcon && JSON.stringify(window.__qbEcon.stats()), dq0 = (S.dq && S.dq.tx) || 0; x.render(); await new Promise((r) => setTimeout(r, 300));
      const d = document.querySelector('[data-act="wkdone"]'); d.click(); await new Promise((r) => setTimeout(r, 900));
      const m = document.querySelector('#layer .wksum'); return { stat: JSON.stringify(window.__qbEcon.stats()) !== tx0, coins: S.coins - c0, xp: S.xp - x0, text: m ? m.innerText.replace(/\s+/g, ' ').match(/(\+\d+ XP.*?session\.|Logged\..*?tomorrow\.)/) : null }; }); };
  const s1 = await sess(); ok(s1.xp >= 50 && s1.coins > 0 && s1.text && new RegExp('\\+' + s1.xp + ' XP, \\+' + s1.coins + ' coins').test(s1.text[0]), 'the first session pays XP and coins, and says so: ' + JSON.stringify(s1));
  await p.screenshot({ path: OUT + '/train140_sum.png' });
  const s2 = await sess(); ok(s2.xp === 0 && s2.coins === 0 && !s2.stat && s2.text && /already paid/.test(s2.text[0]), 'a second one the same day is logged, not paid: ' + JSON.stringify(s2));
  const s3 = await p.evaluate(() => (window.__qb.x().S.sessions || []).length); ok(s3 >= 2, 'both sessions are in the log (' + s3 + ')');
  /* the Board count */
  const bc = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    S.quests = [{ id: 'a1', name: 'Call Mom', xp: 25, stat: 'social', cl: 'social', rep: 'once', mins: 10 }, { id: 'a2', name: 'Text Jo', xp: 10, stat: 'social', cl: 'social', rep: 'once', mins: 5 }, { id: 'a3', name: 'Plan a date', xp: 25, stat: 'social', cl: 'social', rep: 'once', mins: 20 },
      { id: 'b1', name: 'Taxes', xp: 50, stat: 'productivity', cl: 'admin', rep: 'once', mins: 60 }]; S.done = { a1: 25, a2: 10 }; x.render(); document.querySelector('.nav button[data-v="board"]').click(); await new Promise((r) => setTimeout(r, 600));
    return [...document.querySelectorAll('.cluster header')].map((h) => h.innerText.replace(/\s+/g, ' ').trim()); });
  ok(bc.some((t) => /People 1$/i.test(t)) && bc.some((t) => /admin 1$/i.test(t)), 'the category counts are the open quests: ' + JSON.stringify(bc));
  await p.screenshot({ path: OUT + '/train140_board.png' });
  /* quests already on the Board move once */
  const mv = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.done = {}; delete S.cl140;
    S.quests = [{ id: 'c1', name: 'Call the bank about the fee', stat: 'social', cl: 'social' }, { id: 'c2', name: 'Cancel gym membership', stat: 'fitness', cl: 'body' }, { id: 'c3', name: 'Go on a date with Sydney', stat: 'productivity', cl: 'admin' }, { id: 'c4', name: 'Update the website', stat: 'productivity', cl: 'admin' }, { id: 'c5', name: 'Help Dad with his laptop', stat: 'social', cl: 'social' }];
    const n = window.__qbV140.sort(), again = window.__qbV140.sort.call(null) && 0; return { n, q: S.quests.map((q) => q.id + ':' + q.cl).join(' ') }; });
  ok(mv.q === 'c1:admin c2:admin c3:social c4:admin c5:admin', 'quests on the Board move: ' + JSON.stringify(mv));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
