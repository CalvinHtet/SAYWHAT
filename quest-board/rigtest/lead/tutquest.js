// Cal 11-23: a new character starts with the quest "Finish the tutorial"; the welcome tour's second card rings it ("Tasks you enter get
// categorized automatically and show up here. Tick this box to complete it and claim your reward.") and moves on when it is ticked;
// the First steps card's "Add today's tasks" is not ticked off by it; the Welcome letter never opens by itself (Cal 11-23).
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/tutquest.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV136, null, { timeout: 90000 });
  await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 60000 }); await p.fill('#ccname', 'Tester'); await p.click('[data-act="ccnext"]');
  await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(3000);
  const q = await p.evaluate(() => window.__qb.x().S.quests.filter((x) => x.tut).map((x) => x.name)); ok(q.join() === 'Finish the tutorial', 'the first quest: ' + JSON.stringify(q));
  const qt = await p.evaluate(() => { const q = window.__qb.x().S.quests.find((x) => x.tut), e = document.querySelector('.qmain[data-id="' + q.id + '"]'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; }); ok(/1 min/.test(qt) && !/30 min/.test(qt), 'it says about a minute: ' + qt);
  await p.waitForTimeout(3000); const wl = await p.evaluate(() => ({ modal: [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.slice(0, 40)), badge: ((document.querySelector('[data-act="inbox"],.ibbtn,.ib-n,.ibn') || {}).innerText || '').trim() }));
  ok(!wl.modal.some((t) => /Welcome to SAYWHAT/i.test(t)), 'the Welcome letter does not open by itself ' + JSON.stringify(wl));
  await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => { const c = m.querySelector('[data-act="mclose"],.x'); if (c) c.click(); else m.remove(); })); /* the Welcome letter */
  await p.waitForFunction(() => window.__qbV136.tour.id === 'welcome', null, { timeout: 20000 }).catch(() => {});
  let t = await p.evaluate(() => ({ id: window.__qbV136.tour.id, i: window.__qbV136.tour.i, txt: (document.getElementById('qbtour') || {}).innerText || '' }));
  ok(t.id === 'welcome' && t.i === 0, 'the welcome tour starts ' + JSON.stringify(t).slice(0, 160));
  await p.evaluate(() => { const n = [...document.querySelectorAll('#qbtour [data-tour]')].find((b) => b.dataset.tour !== 'skip'); if (n) n.click(); }); await p.waitForTimeout(1500);
  t = await p.evaluate(() => ({ i: window.__qbV136.tour.i, txt: ((document.getElementById('qbtour') || {}).innerText || '').replace(/\s+/g, ' ') }));
  ok(t.i === 1 && /Tasks you enter get categorized automatically and show up here\. Tick this box to complete it and claim your reward\./.test(t.txt) && !/Add one first/.test(t.txt), 'the second card: ' + t.txt.slice(0, 160));
  await p.screenshot({ path: OUT + '/tut_card2.png' });
  const xy = await p.evaluate(() => { const q = window.__qb.x().S.quests.find((x) => x.tut), e = document.querySelector('.qmain[data-id="' + q.id + '"]'); const r = e.getBoundingClientRect(); return [r.x + 30, r.y + r.height / 2]; });
  await p.mouse.click(xy[0], xy[1]); await p.waitForTimeout(2500);
  t = await p.evaluate(() => { const S = window.__qb.x().S, q = S.quests.find((x) => x.tut); return { done: !!(q && S.done[q.id]), i: window.__qbV136.tour.i, id: window.__qbV136.tour.id, tutDone: S.tutDone, add: !!(S.fsd && S.fsd.add) }; });
  ok(t.done && (t.i >= 2 || t.id === null), 'ticking it completes it and the tour moves on ' + JSON.stringify(t));
  ok(!t.add, 'First steps\' "Add today\'s tasks" still waits for a task you add');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
