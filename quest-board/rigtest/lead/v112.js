// Cal's two notes after v1.12 (2026-11-17), on the plain build, at 390 wide:
// 1. The Wheel: a ready spin shows its row on the Board; spinning pays the prize, and about 5 s later the Wheel has closed back to the
//    Board, with no Wheel row left on it.
// 2. Streak freezes: a player holding a freeze gets a one-time tip on the Board that says it is used for them; with no freeze, no tip;
//    the line that pays a freeze says so; and a missed day really is covered by a freeze on the next quest (streak carries on, one freeze gone).
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/v112.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const page = async (fz) => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    await p.evaluate((fz) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(20); S.gates = Array.from({ length: 200 }, (_, i) => i);
      S.coins = 1000; S.calm = false; S.freezes = fz; S.wheel = ''; S.wheelAt = 0;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {});
      S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; x.render(); }, fz);
    /* a new save's welcome letter and the like open on their own and hold back tours: keep closing them */
    await p.evaluate(() => { const S = window.__qb.x().S; setInterval(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => { if (!window.__keepModal) m.remove(); }), 300); }); return p; };
  // the Wheel
  let p = await page(0);
  const before = await p.evaluate(() => ({ row: !!document.querySelector('.zx-spin'), coins: window.__qb.x().S.coins }));
  ok(before.row, 'a ready spin shows its Wheel row on the Board');
  await p.evaluate(() => document.querySelector('.zx-spin').click()); await p.waitForTimeout(800);
  ok(await p.evaluate(() => !!document.querySelector('[data-act="spin"]')), 'the row opens the Wheel');
  await p.evaluate(() => document.querySelector('[data-act="spin"]').click()); await p.waitForTimeout(6000);
  const landed = await p.evaluate(() => ({ wheelOpen: !!document.querySelector('[data-act="spin"]'), res: window.__qb.x().S.wheelRes }));
  ok(landed.wheelOpen && landed.res, 'the prize lands and is still on the Wheel 2.4 s later (closes at 6.6 s, QA 9eb7f13) ' + JSON.stringify(landed));
  await p.waitForTimeout(1500);
  const after = await p.evaluate(() => ({ wheel: !!document.querySelector('[data-act="spin"]'), board: !!document.querySelector('#cap,.card.dq,.zx-hub'), row: !!document.querySelector('.zx-spin'), coins: window.__qb.x().S.coins, freezes: window.__qb.x().S.freezes }));
  ok(!after.wheel && after.board && !after.row, 'then the Wheel closes back to the Board, with no Wheel row on it ' + JSON.stringify(after));
  ok(after.coins > before.coins || after.freezes > 0 || /from|Wardrobe|saved/.test(landed.res), 'the prize was paid ' + JSON.stringify({ was: before.coins, now: after.coins, res: landed.res }));
  ok(!p.errs.length, 'no page errors ' + JSON.stringify(p.errs.slice(0, 3))); await p.context().close();
  // freezes: no freeze, no tip
  p = await page(0); await p.waitForTimeout(3500);
  ok(!(await p.evaluate(() => /Streak freezes/.test((document.getElementById('qbtour') || {}).innerText || ''))), 'with no freeze, no freeze tip');
  await p.context().close();
  // one freeze: the tip shows once, on the character, and says it is automatic
  p = await page(1); await p.waitForTimeout(3500);
  const tip = await p.evaluate(() => { const t = document.getElementById('qbtour'); return t && t.style.visibility !== 'hidden' ? t.innerText : ''; });
  ok(/Streak freezes/.test(tip) && /no button/i.test(tip) && /rest day covers it first/.test(tip) && /used for you/.test(tip) && /streak drops/.test(tip), 'with a freeze, the tip says it is used for you ' + JSON.stringify(tip.replace(/\n/g, ' ')));
  await p.evaluate(() => { const g = document.querySelector('[data-tour="next"]'); if (g) g.click(); }); await p.waitForTimeout(2500);
  ok(await p.evaluate(() => !!window.__qb.x().S.tours.freeze && !document.getElementById('qbtour')), 'Got it closes it for good');
  await p.context().close();
  // a real quest on the Board: add one, tick it, read what the game says
  const quest = async (fz, streak, gap) => { const p = await page(fz); await p.evaluate(([streak, gap]) => { const S = window.__qb.x().S, t = new Date(Date.now() - gap * 864e5);
      S.tours.freeze = 1; S.streak = streak; S.lastDone = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); window.__qb.x().render(); }, [streak, gap]);
    await p.waitForTimeout(600); await p.fill('#cap', 'Wash the dishes'); await p.evaluate(() => document.getElementById('capgo').click()); await p.waitForTimeout(800);
    await p.evaluate(() => { const S = window.__qb.x().S, q = (S.quests || []).filter((q) => /Wash the dishes/.test(q.t || q.n || q.title || q.name || ''))[0] || S.quests[S.quests.length - 1]; q.xp = 60; window.__qb.x().toggle(q.id); });  /* what a tap on the quest calls; 60 XP, as the streak counts a day from 50 */
    let txt = ''; for (let k = 0; k < 6; k++) { await p.waitForTimeout(500); txt += ' ' + await p.evaluate(() => [...document.querySelectorAll('.pop,.toast,#layer')].map((e) => e.innerText).join(' ')); }
    const st = await p.evaluate(() => { const S = window.__qb.x().S; return { streak: S.streak, fz: S.freezes }; }); const errs = p.errs; await p.context().close(); return { txt: txt.replace(/\s+/g, ' '), st, errs }; };
  /* missed 2 days, 1 freeze: the week's free rest day covers one, the freeze the other */
  const m = await quest(1, 8, 3);
  ok(m.st.streak === 9 && m.st.fz === 0 && /freeze used/.test(m.txt), 'two missed days: the rest day and the freeze are used by themselves, the streak carries on ' + JSON.stringify({ st: m.st, said: (m.txt.match(/Streak saved[^|]*/) || [''])[0] }));
  const e5 = await quest(0, 4, 1);
  ok(e5.st.streak === 5 && e5.st.fz === 1 && /Earned a streak freeze \(used for you if you miss a day\)/.test(e5.txt), 'day 5 earns a freeze and says it is used for you ' + JSON.stringify({ st: e5.st, said: (e5.txt.match(/Earned[^|]*/) || [''])[0] }));
  ok(!m.errs.length && !e5.errs.length, 'no page errors ' + JSON.stringify(m.errs.concat(e5.errs).slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
