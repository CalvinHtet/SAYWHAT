// QA on v1.37: a tour step never draws over an open window; it shows once the window is closed.
//   PORT=<plain build> NODE_PATH=<playwright's parent> node rigtest/lead/tourcard.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV136, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(3); S.calm = { days: [] }; S.tours = { welcome: 1, train: 1, dq: 1, bty: 1 }; S.areaOn = { board: 1, hideout: 1, hall: 1, train: 1 }; S.seen = {}; S.letters = { read: { welcome: 1, live137: 1 }, paid: {}, at: {}, popped: 1 }; x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  await p.waitForTimeout(3000);
  const t0 = await p.evaluate(() => window.__qbV136.tour.id); ok(t0 === 'hideout', 'the Loft tour starts (' + t0 + ')');
  await p.mouse.click(...(await p.evaluate(() => { const r = document.querySelector('.nav button[data-v="hideout"]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }))); await p.waitForTimeout(2500);
  const s = await p.evaluate(() => { const m = document.querySelector('#layer .modal'), t = document.getElementById('qbtour'); return { card: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 60) : null, tourShown: !!t && t.style.visibility !== 'hidden' && getComputedStyle(t).display !== 'none', step: window.__qbV136.tour.i }; });
  ok(s.card && !s.tourShown, 'with the welcome card open the tour waits unseen ' + JSON.stringify(s));
  await p.evaluate(() => { const b = [...document.querySelectorAll('#layer .modal button')].find((x) => /got it|close|✕/i.test(x.textContent)) || document.querySelector('#layer .modal [data-act="mclose"]'); if (b) b.click(); else document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); }); await p.waitForTimeout(2500);
  const s2 = await p.evaluate(() => { const t = document.getElementById('qbtour'); return { modal: !!document.querySelector('#layer .modal'), tourShown: !!t && t.style.visibility !== 'hidden', text: t ? t.innerText.replace(/\s+/g, ' ').slice(0, 60) : '', step: window.__qbV136.tour.i }; });
  ok(!s2.modal && s2.tourShown && /This is The Loft/.test(s2.text), 'after closing it the step shows: ' + JSON.stringify(s2));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
