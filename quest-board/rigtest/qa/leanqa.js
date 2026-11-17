// v1.04 "cut the fat" (LEAD c7051f3): every card that lost its rules, as text, on this build and on the one before it, so a lost live
// number shows; on the new build each (i) is tapped for real and its sheet read; one phone-size picture per screen. Profiles: mid
// (level 12, trial gate open, rested XP, two Weekly Warrior weeks in a row before this one) and late (level 60, every room) with this
// week's Weekly Warrior paid or not.
//   BASE=<server of quest-board/> OUT=<dir> NODE_PATH=<playwright's parent> node rigtest/qa/leanqa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || '';
const ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];
const TITLES = ['Daily Quest', 'Lucky wheel', 'Dungeon Crawls', 'Rescued allies', 'Vault', 'Your own workouts', 'Training', 'Gym plans', ' day', 'Coaches', 'Job advancement trial', 'Likes this week'];
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const out = []; const say = (s) => { out.push(s); console.log(s); };
  for (const prof of ['mid', 'late', 'late_paid', 'fresh_week']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(800);
    const st = await p.evaluate(({ prof, order }) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' });
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1 }; S.calm = false; S.welcomed = 1;
      S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 };
      S.weekPaid = {}; if (prof !== 'fresh_week') { S.weekPaid['2026-11-09'] = 1; S.weekPaid['2026-11-02'] = 1; } if (prof === 'late_paid') S.weekPaid['2026-11-16'] = 1;
      if (prof === 'mid') { S.xp = x.cum(12); S.coins = 6000; S.rest = { x: 120 }; S.trialN = 1; S.base.slots = order.slice(0, 6).map((t, i) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).slice(0, i < 3 ? 6 : 2).map((u) => [u[0], 1])), st: 0, pend: 0 })); }
      else { S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.base.served = 1e6; S.base.visits = 3; S.cxp = { a: 500 };
        S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])), st: 0, pend: 0 })); }
      S.wheelAt = Date.now() - 3600e3; x.render(); return { lvl: x.effLvl(), gated: x.gated() }; }, { prof, order: ORDER });
    await p.waitForTimeout(1000);
    const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,#qbtour').forEach((m) => m.remove()));
    const go = (v) => p.evaluate((v) => { let el = document.querySelector('.nav button[data-v="' + v + '"]');
      if (!el) { const bt = document.querySelector('.nav button[data-v="board"]'); if (bt) bt.click(); el = document.querySelector('.zx-tile[data-v="' + v + '"],[data-act="nav"][data-v="' + v + '"]'); }
      if (!el) return false; el.click(); return true; }, v);
    say('== ' + prof + ' ' + JSON.stringify(st));
    for (const v of ['board', 'train', 'train_day', 'wheel', 'away', 'players', 'shop_vault']) {
      await clear(); const base = v.split('_')[0]; if (!(await go(base))) { say('  [' + v + '] not open'); continue; } await p.waitForTimeout(1200); await clear();
      if (v === 'shop_vault') { const ok = await p.evaluate(() => { const t = document.querySelector('[data-act=stab][data-v=vault]'); if (t) t.click(); return !!t; }); if (!ok) { say('  [vault] no tab'); continue; } await p.waitForTimeout(800); }
      if (v === 'train_day') { const ok = await p.evaluate(() => { const t = document.querySelector('[data-act=wkplan]'); if (t) t.click(); return !!t; }); await p.waitForTimeout(800); await clear(); if (!ok) { say('  [day] no plan'); continue; } }
      if (v === 'players') { await p.evaluate(() => { const t = [...document.querySelectorAll('button')].find((e) => /^Fashion|Likes/.test(e.textContent.trim())); if (t) t.click(); }); await p.waitForTimeout(600); }
      const cards = await p.evaluate((TITLES) => { const r = []; document.querySelectorAll('main section, #app section').forEach((s) => { const hd = s.querySelector('h3,.label'); const head = hd ? hd.textContent.trim() : '';
        const t = s.innerText.replace(/\s+/g, ' ').trim(); const hit = TITLES.find((x) => head.indexOf(x) >= 0 || (x === 'Likes this week' && t.indexOf(x) >= 0)); if (!hit) return; r.push({ head: head.slice(0, 40), qbi: [...s.querySelectorAll('.qbi')].map((q) => q.dataset.k), t: t.slice(0, 600) }); }); return r; }, TITLES);
      if (OUT) await p.screenshot({ path: OUT + '/' + prof + '_' + v + '.png', fullPage: true });
      for (const c of cards) { say('  [' + v + '] ' + c.head + (c.qbi.length ? '  (i):' + c.qbi.join(',') : '') + '\n      ' + c.t);
        for (const k of c.qbi) { await clear(); const sheet = await p.evaluate(async (k) => { const q = document.querySelector('.qbi[data-k="' + k + '"]'); const r0 = q.getBoundingClientRect();
            const top = document.elementFromPoint(r0.x + r0.width / 2, r0.y + r0.height / 2); const v0 = document.body.innerText.length; q.click(); await new Promise((d) => setTimeout(d, 400));
            const m = document.querySelector('#layer .modal'); return { size: Math.round(r0.width) + 'x' + Math.round(r0.height), onTop: top === q, sheet: m ? m.innerText.replace(/\s+/g, ' ').trim() : 'NO SHEET' }; }, k);
          say('      (i) ' + k + ' ' + sheet.size + (sheet.onTop ? '' : ' COVERED') + ': ' + sheet.sheet);
          if (OUT && prof === 'mid') await p.screenshot({ path: OUT + '/sheet_' + k + '.png' }); } } }
    say('  errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
  if (OUT) fs.writeFileSync(OUT + '/leanqa.txt', out.join('\n')); await b.close(); })().catch((e) => { console.log('crash', e.message); process.exit(2); });
