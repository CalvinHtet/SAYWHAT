// Fewer tabs (Cal, 2026-11-13, "Fewer tabs first"): the bar is Board, The Loft, Shop, Town and Players; Training, Dungeon Crawls and the
// Wheel open from tiles on the Board, Relics from the profile; each moved screen has a way back and lights the Board tab.
//   BASE=<server of quest-board/> NODE_PATH=<playwright's parent> node rigtest/lead/tabs5.js [screenshot dir]
process.env.TAB = 'keep';
const { open } = require('../qa/lib.js');
const OUT = process.argv[2] || '';
let fails = 0; const ok = (n, c, i) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(i))); };
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  await p.evaluate(() => { const S = window.__qb.x().S; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; window.__qb.x().render(); });
  const clear = () => p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const state = () => p.evaluate(() => ({ nav: [...document.querySelectorAll('.nav button')].map((n) => n.dataset.v), on: (document.querySelector('.nav button.on') || { dataset: {} }).dataset.v, back: !!document.querySelector('.zx-back'), tiles: [...document.querySelectorAll('.zx-tile')].map((t) => t.dataset.v) }));
  const click = async (sel) => { await clear(); await p.evaluate((sel) => { const e = document.querySelector(sel); if (e) e.click(); }, sel); await p.waitForTimeout(1500); };
  await click('.nav button[data-v="board"]');
  const s0 = await state();
  ok('the bar: Board, The Loft, Shop, Town, Players', JSON.stringify(s0.nav) === JSON.stringify(['board', 'hideout', 'shop', 'hall', 'players']), s0.nav);
  ok('the Town tab is named Town', await p.evaluate(() => /Town/.test((document.querySelector('.nav button[data-v="hall"]') || { getAttribute: () => '' }).getAttribute('aria-label') || '')));
  ok('Board tiles: Training, Dungeon Crawls, Wheel', JSON.stringify(s0.tiles) === JSON.stringify(['train', 'away', 'wheel']), s0.tiles);
  if (OUT) await p.screenshot({ path: OUT + '/tabs5_board.png', fullPage: true });
  for (const v of ['train', 'away', 'wheel']) {
    await click('.zx-tile[data-v="' + v + '"]');
    const s = await state(); const cur = await p.evaluate(() => document.querySelector('.zx-back') ? document.querySelector('.zx-back').innerText : '');
    ok(v + ': opens from its tile, Board stays lit, a way back', s.on === 'board' && s.back && /Board/.test(cur), s);
    if (OUT && v === 'train') await p.screenshot({ path: OUT + '/tabs5_train.png' });
    await click('.zx-back'); const s2 = await state();
    ok(v + ': back goes to the Board', s2.on === 'board' && !s2.back && s2.tiles.length === 3, s2);
  }
  await clear(); await p.evaluate(() => document.querySelector('.bline').click()); await p.waitForTimeout(1500);
  const rel = await p.evaluate(() => !!document.querySelector('#layer .modal [data-act="nav"][data-v="trophy"]'));
  ok('the profile has Relics', rel);
  await p.evaluate(() => document.querySelector('#layer .modal [data-act="nav"][data-v="trophy"]').click()); await p.waitForTimeout(1500);
  const t = await state(); const modal = await p.evaluate(() => !!document.querySelector('#layer .modal'));
  ok('Relics opens, the profile closes, a way back', t.back && !modal && /Relic|Trophy/i.test(await p.evaluate(() => document.body.innerText)), { t, modal });
  // a new player: no tiles that are not open yet, the bar has no locked "?" for the moved tabs
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = 0; S.gates = []; S.areaOn = { board: 1, train: 1 }; S.base.slots = [{ t: 'bedroom', a: {}, st: 0, pend: 0 }]; x.render(); });
  await click('.nav button[data-v="board"]');
  const n = await state();
  ok('a new player: Training only, no locked moved tabs in the bar', JSON.stringify(n.tiles) === JSON.stringify(['train']) && !n.nav.some((v) => ['train', 'trophy', 'wheel', 'away'].includes(v)), n);
  ok('no page errors', errs.filter((e) => /pageerror/.test(e)).length === 0, errs.slice(0, 4));
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS');
})().catch((e) => { console.log('crash', e.message); process.exit(2); });
