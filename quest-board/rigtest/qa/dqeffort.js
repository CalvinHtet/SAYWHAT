// LEAD's Daily Quest effort counting (689d212): fresh character on a sandbox; quests of 5, 10, 25 and 40 XP (once and daily); tick each
// and read dqXp against the expected weighting (5 -> 60%, 10 -> 80%, 25+ full, base XP only); then "Clear completed" (qclear) and read
// it again: one-offs leave S.quests but stay in S.done. Also the boss and the card's note.   BASE=<sandbox> node dqeffort.js
const { chromium } = require('playwright'); const BASE = process.env.BASE || 'http://127.0.0.1:8817';
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); };
(async () => { const b = await chromium.launch(); const c = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '/'); await p.waitForFunction(() => window.__qb && window.__qb.x && document.querySelector('#app'), null, { timeout: 120000 }); await p.waitForTimeout(1500);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.welcomed = 1; S.char = window.__qb.fixChar({ name: 'Qa', sex: 'f' }); S.calm = false; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1 };
    S.quests = [{ id: 'a5', t: 'Bed', xp: 5, c: 2, cl: 'chores', rep: 'once' }, { id: 'b10', t: 'Email', xp: 10, c: 5, cl: 'chores', rep: 'once' }, { id: 'c25', t: 'Laundry', xp: 25, c: 10, cl: 'chores', rep: 'daily' }, { id: 'd40', t: 'Clean garage', xp: 40, c: 20, cl: 'chores', rep: 'once' }];
    S.done = {}; S.dq = null; x.persist(); x.render(); });
  await p.waitForTimeout(1500); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const rows = [];
  for (const id of ['a5', 'b10', 'c25', 'd40']) { await p.evaluate((id) => window.__qb.x().toggle(id), id); await p.waitForTimeout(1200); await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => { const b = [...m.querySelectorAll('button')].find((b) => /without a photo/i.test(b.innerText)); if (b) b.click(); else m.remove(); })); await p.waitForTimeout(1200);
    await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(300); rows.push(await p.evaluate((id) => { const S = window.__qb.x().S; return { id, paid: S.done[id], dq: +((document.querySelector('.card.dq .mono')||{}).textContent||'').split('/')[0].trim(), hook: window.__qbEcon.xp() }; }, id)); }
  console.log('     ticks: ' + JSON.stringify(rows));
  const want = Math.round(5 * .6 + 10 * .8 + 25 + 40);
  ok(`after all four, the bar counts base XP weighted: ${want}`, rows[3].dq === want, rows[3]);
  ok('every tick paid at least its base XP (bonuses still pay the level)', rows.every((r) => r.paid >= +r.id.slice(1)), rows);
  const card = await p.evaluate(() => { document.querySelector('.nav button[data-v=board]').click(); const n = document.querySelector('.dq-eff'); return n ? n.textContent : null; }); ok('the card says quick tasks count less', !!card, card);
  const boss = await p.evaluate(() => { try { return typeof bossDow === 'function' ? bossDow() : 'n/a'; } catch (e) { return e.message; } });
  // Clear completed
  await p.evaluate(() => { const b = document.querySelector('[data-act=qclear]'); if (b) b.click(); }); await p.waitForTimeout(1500);
  await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(300); const after = await p.evaluate(() => { const S = window.__qb.x().S; return { quests: S.quests.map((q) => q.id), done: Object.keys(S.done), dq: +((document.querySelector('.card.dq .mono')||{}).textContent||'').split('/')[0].trim(), hook: window.__qbEcon.xp() }; });
  ok(`"Clear completed" leaves the bar where it was (${rows[3].dq})`, after.dq === rows[3].dq, after);
  // a reload after the clear: the bar reads the same (what each tick counted is saved)
  await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && document.querySelector('.card.dq .mono'), null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const re = await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qb.x().render(); return +((document.querySelector('.card.dq .mono') || {}).textContent || '').split('/')[0].trim(); });
  ok(`after a reload the bar still reads ${rows[3].dq}`, re === rows[3].dq, re);
  ok('no page errors', !errs.length, errs); console.log(bad ? 'FAILED ' + bad : 'PASS', '(boss day ' + boss + ')'); await b.close(); })();
