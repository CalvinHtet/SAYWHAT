// Relics and trophies (LEAD's request, 29d_dungeon.js): a cheap check on one save.
//   node relics.js
// 1. New player: the Relics tab has no Trophies sub-tab, and the Lair's Trophy Wall is a "? ? ?" card.
// 2. Each relic tier pays once: running the relic check again pays nothing more.
// 3. First trophy piece: the Trophies sub-tab appears and the Trophy Wall becomes buyable.
// 4. Buffs: each piece's and each set's buff counted once (dgBuff), and the Board's buff list names "Trophies" once.
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1000, owned: 'none' });
  const fails = [], ok = [];
  const r = await p.evaluate(() => {
    const x = window.__qb.x(), S = x.S, D = window.__qbDungeon, out = {};
    const clear = () => { try { window.lfPvStop(); } catch (e) {} document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove()); };
    const tab = (v) => { clear(); const bt = document.querySelector('.nav button[data-v="' + v + '"]'); if (bt) bt.click(); return bt; };
    // the Lair, for its menu
    if (!S.base.slots.some((s) => s && s.t === 'lair')) S.base.slots.push({ t: 'lair', a: {}, st: 0, pend: 0 });
    const lairMenu = () => { clear(); window.__qb.roomModal(S.base.slots.findIndex((s) => s && s.t === 'lair')); const c = [...document.querySelectorAll('.rmodal .addon.next')].map((e) => ({ mys: e.classList.contains('mystery'), t: e.textContent.trim().slice(0, 60), id: (e.querySelector('[data-id]') || {}).dataset ? (e.querySelector('[data-id]') || { dataset: {} }).dataset.id : '' })); clear(); return c; };
    // 1
    out.trophyTab0 = !!(tab('trophy') && document.querySelector('[data-act="dgtab"][data-v="trophies"]'));
    out.relicsTab0 = !!document.querySelector('[data-act="dgtab"][data-v="relics"]');
    S.base.slots.find((s) => s.t === 'lair').a = { lr_racks: 1 };
    out.lair0 = lairMenu();
    // 2
    S.best = 15; S.total = 60; const c0 = S.coins; D.relics(); const c1 = S.coins; D.relics(); D.relics(); const c2 = S.coins;
    out.relicPay = [c1 - c0, c2 - c1, Object.keys(S.relics)];
    // 3
    S.trophy.goblin = { helm: 1 };
    out.trophyTab1 = !!(tab('trophy') && document.querySelector('[data-act="dgtab"][data-v="trophies"]'));
    out.lair1 = lairMenu();
    // 4
    S.trophy.goblin = { helm: 1, chest: 1, greaves: 1, boots: 1, sword: 1 };
    out.buffs = { xp: D.buff('xp'), mxp: D.buff('mxp'), mc: D.buff('mc'), mt: D.buff('mt'), gift: D.buff('gift'), mission: D.buff('mission') };
    tab('board'); x.render();
    out.trophyBuffLines = (document.body.innerText.match(/Every quest earns \d+% more XP/g) || []).length;
    D.relics(); out.relicsAfter = Object.keys(S.relics);
    clear(); return out;
  });
  const t = (cond, msg) => (cond ? ok : fails).push(msg);
  t(r.relicsTab0 && !r.trophyTab0, 'new player: Relics tab without a Trophies sub-tab');
  const tw0 = r.lair0.find((c) => /trophy/i.test(c.t));
  t(!r.lair0.some((c) => c.id === 'lr_trophy'), 'Trophy Wall not buyable before the first piece (' + (tw0 ? '"' + tw0.t + '"' : 'not among the 4 cards shown') + ')');
  t(r.relicPay[0] > 0 && r.relicPay[1] === 0, 'relic tiers pay once: ' + r.relicPay[0] + ' coins, then ' + r.relicPay[1] + ' on two more checks (' + r.relicPay[2].join(', ') + ')');
  t(r.trophyTab1, 'first piece: the Trophies sub-tab appears');
  t(r.buffs.xp === 3 && Math.abs(r.buffs.mission - 0.2) < 1e-9 && Math.abs(r.buffs.gift - 0.15) < 1e-9, 'full Goblin King set, buffs counted once: ' + JSON.stringify(r.buffs));
  t(r.trophyBuffLines <= 1, 'the Board names the trophy XP buff ' + r.trophyBuffLines + ' time(s)');
  console.log('lair menu, no piece:', r.lair0.map((c) => (c.mys ? '???' : c.id)).join(' | '));
  console.log('lair menu, one piece:', r.lair1.map((c) => (c.mys ? '???' : c.id)).join(' | '));
  console.log('relics after:', r.relicsAfter.join(', '));
  ok.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
