// Cal 11-25 (29zz_v170.js): a full workout session pays 100 XP and 500 coins, and ticks today on the 4-a-week meter; a day counts
// once (the Workout photo after it adds nothing to the meter, and undoing that photo leaves the day counted); Training's card says
// today's workout is logged and offers the photo as an extra.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/train170.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV170, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(6); S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1 }; S.tutDone = 1; x.render(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="train"]').click(); }); await p.waitForTimeout(700);
  const w0 = await p.evaluate(() => ({ n: window.__qbV170.wcount(), on: window.__qbV170.active() }));
  await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('[data-act="wkplan"]').click(); }); await p.waitForTimeout(500);
  const s = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.wk.list.forEach((id) => { S.wk.sets[id] = [1, 1, 1, 1, 1, 1] }); const c0 = S.coins, x0 = S.xp; x.render(); await new Promise((r) => setTimeout(r, 300));
    document.querySelector('[data-act="wkdone"]').click(); await new Promise((r) => setTimeout(r, 900));
    const m = document.querySelector('#layer .wksum'); return { coins: S.coins - c0, xp: S.xp - x0, text: m ? (m.innerText.replace(/\s+/g, ' ').match(/\+\d+ XP, \+\d+ coins/) || [''])[0] : '', n: window.__qbV170.wcount(), on: window.__qbV170.active() }; });
  ok(s.xp === 100 && s.coins === 500 && s.text === '+100 XP, +500 coins', 'a full session pays 100 XP and 500 coins, and the summary says so ' + JSON.stringify(s));
  ok(!w0.on && s.on && s.n === w0.n + 1, 'it ticks today on the 4-a-week meter (' + w0.n + ' -> ' + s.n + ')');
  const g = await p.evaluate(async () => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const x = window.__qb.x(); x.render(); await new Promise((r) => setTimeout(r, 300));
    const h = document.getElementById('app').innerHTML; const card = /Today&rsquo;s workout is logged|Today’s workout is logged/.test(h) && !!document.querySelector('[data-act="v35wk"]') && !/Log today/.test(document.getElementById('app').innerText);
    const q = x.S.quests.find((q) => q.rep === 'weekly4'); const n0 = window.__qbV170.wcount(); x.onTap(q.id, { target: document.body }); await new Promise((r) => setTimeout(r, 500)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    return { card, n0, quest: !!q, chip: (document.querySelector('.trhead .chip') || {}).innerText || '' }; });
  ok(g.card, 'Training\'s card says today\'s workout is logged and offers "Add a photo" ' + JSON.stringify(g));
  const dbl = await p.evaluate(() => { const n0 = window.__qbV170.wcount(); window.__qbV170.mark(); const n1 = window.__qbV170.wcount(); window.__qbV170.unmark(); const n2 = window.__qbV170.wcount(); return { n0, n1, n2, on: window.__qbV170.active() }; });
  ok(dbl.n1 === dbl.n0 && dbl.n2 === dbl.n0 && dbl.on, 'a verified photo the same day adds nothing to the meter, and undoing it leaves the day counted ' + JSON.stringify(dbl));
  /* QA 250a711b A: the photo first, then a session, then the photo undone: the day stays counted */
  const pa = await p.evaluate(() => { const S = window.__qb.x().S, t = Object.keys(S.active || {}).sort().pop(); delete S.active[t]; const wk = Object.keys(S.wcount)[0]; S.wcount[wk] = 0; S.v70tr = null; window.__qbV170.mark(); const n1 = window.__qbV170.wcount();
    window.__qbV170.trained(window.__qbEcon.ECON.trainXp, 'pull'); const n2 = window.__qbV170.wcount(); window.__qbV170.unmark(); return { n1, n2, n3: window.__qbV170.wcount(), on: window.__qbV170.active() }; });
  ok(pa.n1 === 1 && pa.n2 === 1 && pa.n3 === 1 && pa.on, 'photo first, then a full session, then the photo undone: the day stays counted ' + JSON.stringify(pa));
  await p.screenshot({ path: OUT + '/train170.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
