// The room upgrade menu (LEAD, after v45: only the next 5 unbought upgrades show, anything two or more levels above the
// player is a "? ? ?" card). A player with endless coins goes from level 1 to 60; at each level QA opens every room's
// window and buys whatever the menu lets it, in the menu's order, then checks:
//  - never more than 5 cards;
//  - a "? ? ?" card only for an upgrade two or more levels up, one level up shows its name and "Reach level";
//  - nothing shows "All upgrades installed" while something is still unbought, and nothing is offered that cannot be bought;
//  - at level 60, what was never bought (and why the menu never offered it).
//   node menu.js [room,room]
const { open, ORDER } = require('./lib.js');
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1000, owned: 'none' });
  const res = await p.evaluate(({ order, only, maxL }) => {
    const x = window.__qb.x(), S = x.S;
    order.forEach((t) => { if (!S.base.slots.some((s) => s.t === t)) S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); });
    const out = { seen: { mystery: 0, reach: 0, cards: 0 } }, bad = (t, m) => (out[t] = out[t] || []).push(m);
    const rooms = order.filter((t) => !only.length || only.includes(t));
    const clear = () => { try { window.lfPvStop(); } catch (e) {} document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); };
    const bought = {};
    for (let L = 1; L <= maxL; L++) {
      S.xp = x.cum(L); S.coins = 999999;
      const eff = x.effLvl();
      if (eff !== L) { bad('all', 'level ' + L + ': effLvl() is ' + eff); }
      for (const t of rooms) {
        const i = S.base.slots.findIndex((s) => s.t === t), r = S.base.slots[i];
        const list = (x.ADDONS[t] || []).filter((u) => !(u[3] && u[3].retired));
        for (let guard = 0; guard < 60; guard++) {
          clear(); window.__qb.roomModal(i);
          const cards = [...document.querySelectorAll('.rmodal details.acol[data-k="av"] .addon.next')];
          const summary = ((document.querySelector('.rmodal details.acol[data-k="av"] summary') || {}).textContent || '').trim();
          const left = list.filter((u) => !(r.a && r.a[u[0]]));
          if (cards.length > 5) bad(t, 'L' + L + ': ' + cards.length + ' cards');
          if (/All upgrades installed/.test(summary) && left.length) bad(t, 'L' + L + ': "All upgrades installed" with ' + left.length + ' unbought');
          cards.forEach((c) => {
            const mys = c.classList.contains('mystery'), name = (c.querySelector('b') || {}).textContent || '';
            const btn = c.querySelector('button'), txt = btn ? btn.textContent.trim() : '';
            out.seen.cards++; if (mys) out.seen.mystery++; else if (/Reach level/.test(txt)) out.seen.reach++;
            if (mys) {
              const m = (c.getAttribute('aria-label') || '').match(/level (\d+)/); const lv = m ? +m[1] : 0;
              if (lv - eff < 2) bad(t, 'L' + L + ': mystery card for level ' + lv);
            } else {
              const u = list.find((u) => u[1] === name);
              if (!u) return;
              const lv = (u[3] && u[3].lv) || 0;
              if (lv - eff >= 2) bad(t, 'L' + L + ': ' + name + ' (level ' + lv + ') shown by name, should be a mystery card');
              if (lv > eff && !/Reach level/.test(txt)) bad(t, 'L' + L + ': ' + name + ' (level ' + lv + ') buyable before its level: "' + txt + '"');
            }
          });
          const bt = [...document.querySelectorAll('.rmodal button[data-act="raddon"]')].find((e) => !e.disabled);
          if (!bt) break;
          const id = bt.dataset.id, u = list.find((u) => u[0] === id), c0 = S.coins;
          bt.click();
          if (!(r.a && r.a[id])) { bad(t, 'L' + L + ': pressing Buy on ' + u[1] + ' did nothing (' + (c0 - S.coins) + ' coins)'); break; }
          if ((u[3] && u[3].lv || 0) > L) bad(t, 'L' + L + ': bought ' + u[1] + ' below its level ' + u[3].lv);
          (bought[t] = bought[t] || []).push([L, u[1]]);
        }
      }
    }
    clear();
    rooms.forEach((t) => {
      const r = S.base.slots.find((s) => s.t === t), list = (x.ADDONS[t] || []).filter((u) => !(u[3] && u[3].retired));
      const never = list.filter((u) => !(r.a && r.a[u[0]]));
      if (never.length) bad(t, 'never offered by level ' + maxL + ': ' + never.map((u) => u[1] + ' (' + u[0] + ')').join(', '));
      out[t + ':count'] = [(bought[t] || []).length, list.length];
    });
    return out;
  }, { order: ORDER, only: ONLY, maxL: +(process.env.MAXL || 60) });
  for (const t of ORDER) {
    if (ONLY.length && !ONLY.includes(t)) continue;
    const c = res[t + ':count'] || [0, 0];
    console.log(`${t}: bought ${c[0]} of ${c[1]}` + (res[t] ? '' : '  ok'));
    (res[t] || []).forEach((m) => console.log('   ' + m));
  }
  (res.all || []).forEach((m) => console.log('   ' + m));
  console.log('cards looked at:', JSON.stringify(res.seen));
  console.log('page errors:', errs.length, errs.slice(0, 5));
  await b.close();
})();
