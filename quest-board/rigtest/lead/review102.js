// QA's experience review fixes (2026-11-14) on the plain build: the welcome tour's tick step rings Add (no own task) or the player's own
// task, never the Workout; the Town tour waits for a day after The Loft's; Players opens at level 3; the Bedroom window lists buys before a
// "Coming next ? ? ? Not yet"; claiming the welcome letter closes it.   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/review102.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s, i) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] });
  const page = async () => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 150)));
    await p.goto('http://127.0.0.1:' + (process.env.PORT || 8779) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbRooms, null, { timeout: 90000 }); await p.waitForTimeout(800); return p; };
  const clear = (p) => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  const tour = (p) => p.evaluate(() => { const r = document.getElementById('qbtour'); if (!r || r.style.visibility === 'hidden') return null; const g = r.querySelector('.tour-ring').getBoundingClientRect(); const e = document.elementFromPoint(g.x + g.width / 2, g.y + g.height / 2); return { t: r.querySelector('.tour-t').textContent, at: e ? (e.id || e.className || e.tagName) + (e.closest('[data-id]') ? ' ' + e.closest('[data-id]').dataset.id : '') : '' }; });
  // 1) the welcome tour's tick step
  { const p = await page();
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'New', sex: 'f' }); delete S.calm; delete S.tours; S.quests = S.quests.filter((q) => q.rep === 'weekly4'); x.render(); });
    for (let k = 0; k < 6; k++) { await p.waitForTimeout(700); await clear(p); }
    let t = null; for (let k = 0; k < 12 && !(t && /Welcome/.test(t.t)); k++) { t = await tour(p); await p.waitForTimeout(400); }
    await p.evaluate(() => document.querySelector('#qbtour [data-tour="next"]').click()); await p.waitForTimeout(600);
    const t2 = await tour(p); ok(t2 && t2.t === 'Add one first' && /capgo/.test(t2.at), 'no own task yet: step 2 rings Add, not the Workout', t2);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.quests.push({ id: 'qown', name: 'Dishes', xp: 10, stat: 'productivity', cl: 'home', rep: 'once' }); x.render(); }); await p.waitForTimeout(900);
    const t3 = await tour(p); ok(t3 && t3.t === 'Do it, then tick it' && /qown/.test(t3.at), 'with a task of their own: step 2 rings it', t3);
    ok(p.errs.length === 0, 'no page errors (tour)', p.errs); await p.close(); }
  // 2) Town's tour waits a day after The Loft's; 3) Players at level 3
  { const p = await page();
    const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'L2', sex: 'm' }); S.calm = false; S.fsall = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1 }; const td = (d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))(new Date()); S.tourOn = { hideout: td }; S.xp = x.cum(2); S.areaOn = { board: 1, hideout: 1, hall: 1 }; x.render();
      const w = async (ms) => { for (let k = 0; k < ms / 500; k++) { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); await new Promise((o) => setTimeout(o, 500)); } }; await w(4000); const t = document.getElementById('qbtour'); const sameDay = t && t.style.visibility !== 'hidden' ? t.querySelector('.tour-t').textContent : null;
      S.tourOn = { hideout: '2000-01-01' }; x.render(); await w(4000); const t2 = document.getElementById('qbtour'); const later = t2 && t2.style.visibility !== 'hidden' ? t2.querySelector('.tour-t').textContent : null;
      return { sameDay, later, today: td }; });
    ok(r.today !== null && !/Town/.test(r.sameDay || '') && /Town/.test(r.later || ''), 'the Town tour waits for a day after The Loft tour', r);
    const pl = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(2); delete S.areaOn; x.render(); const a = S.areaOn || {}; return { lv: x.effLvl ? x.effLvl() : null, players: !!a.players, hall: !!a.hall }; });
    ok(!pl.players, 'Players is not open at level 2', pl);
    ok(p.errs.length === 0, 'no page errors (pacing)', p.errs); await p.close(); }
  // 4) the Bedroom window: buys before a "Not yet"
  { const p = await page();
    const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'B', sex: 'm' }); S.calm = false; S.fsall = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1 }; S.xp = x.cum(2); S.coins = 3900; S.areaOn = { board: 1, hideout: 1, hall: 1 }; x.render();
      document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); const i = S.base.slots.findIndex((q) => q && q.t === 'bedroom'); const btn = document.createElement('button'); btn.dataset.act = 'zxroom'; btn.dataset.i = i; document.body.appendChild(btn); btn.click(); btn.remove();
      await new Promise((o) => setTimeout(o, 1500)); const cards = [...document.querySelectorAll('#layer .rmodal .addons .addon')].map((c) => (c.className.indexOf('mystery') >= 0 ? 'M' : c.querySelector('[data-act=raddon]:not([disabled])') ? 'B' : '-') + (c.className.indexOf('stynext') >= 0 ? 's' : ''));
      return cards; });
    const firstM = r.findIndex((c) => c[0] === 'M'), lastB = r.map((c) => c[0]).lastIndexOf('B');
    ok(r.length && r[0][0] === 'B' && (firstM < 0 || firstM > lastB), 'the Bedroom window: what you can buy first, any "Not yet" after', r);
    ok(p.errs.length === 0, 'no page errors (Bedroom)', p.errs); await p.close(); }
  // 5) claiming the welcome letter closes it
  { const p = await page();
    const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'f' }); x.render(); const w = (ms) => new Promise((o) => setTimeout(o, ms)); await w(2500);
      let b = document.querySelector('#layer [data-ib="claim"]'); if (!b) { const l = document.querySelector('[data-ib="list"]'); if (l) { l.click(); await w(600); const o = document.querySelector('#layer [data-ib="open"]'); if (o) { o.click(); await w(600); } } b = document.querySelector('#layer [data-ib="claim"]'); }
      if (!b) return { found: false }; b.click(); await w(400); const right = !!document.querySelector('#layer .modal .ibgot'); await w(1800); return { found: true, claimedShown: right, stillOpen: !!document.querySelector('#layer .modal .ibgot') }; });
    ok(r.found && r.claimedShown && !r.stillOpen, 'claiming the letter shows the coins, then the letter closes', r);
    ok(p.errs.length === 0, 'no page errors (letter)', p.errs); await p.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'ALL PASS'); })();
