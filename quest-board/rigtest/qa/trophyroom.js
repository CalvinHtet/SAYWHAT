// ROOMS's Trophy Room (9be3f51), a cheap check: the Lair's card is a mystery before any piece and "Stairs to the Trophy
// Room" after one; buying it opens the room; the arrows walk up and back; the mannequin wears exactly the owned pieces;
// the building view draws the hall above the Lair.
//   OUT=<folder> node trophyroom.js
const fs = require('fs'), path = require('path');
const { open, openRoom } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1000, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const ev = (f, a) => p.evaluate(f, a);
  await ev(() => { const S = window.__qb.x().S; ['closet', 'lair'].forEach((t) => { if (!S.base.slots.some((s) => s && s.t === t)) S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); });
    const L = S.base.slots.find((s) => s.t === 'lair'); window.__qb.x().ADDONS.lair.forEach((u) => { if (!(u[3] && (u[3].opens || u[3].trophy || u[3].retired))) L.a[u[0]] = 1; }); S.trophy = {}; S.base.slots = S.base.slots.filter((s) => s.t !== 'trophy'); });
  const lairCards = () => ev(() => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); const i = window.__qb.x().S.base.slots.findIndex((s) => s.t === 'lair'); window.__qb.roomModal(i);
    const c = [...document.querySelectorAll('.rmodal .addon.next')].map((e) => ({ mys: e.classList.contains('mystery'), t: e.innerText.replace(/\s+/g, ' ').slice(0, 70), buy: (e.querySelector('[data-act="raddon"]') || { dataset: {} }).dataset.id || null })); return c; });
  const c0 = await lairCards();
  t(c0.some((c) => c.mys) && !c0.some((c) => c.buy === 'lr_troom'), 'no piece yet: a mystery card, the stairs not for sale (' + c0.map((c) => c.mys ? '???' : c.t.slice(0, 25)).join(' | ') + ')');
  await ev(() => { window.__qb.x().S.trophy = { goblin: { helm: 1 } }; });
  const c1 = await lairCards();
  t(c1.some((c) => c.buy === 'lr_troom' && /Stairs to the Trophy Room/.test(c.t)), 'one piece home: "Stairs to the Trophy Room" for sale');
  const bought = await ev(() => { const bt = document.querySelector('.rmodal [data-act="raddon"][data-id="lr_troom"]'); const S = window.__qb.x().S, c0 = S.coins; if (bt) bt.click(); return { paid: c0 - S.coins, room: S.base.slots.some((s) => s && s.t === 'trophy') }; });
  t(bought.room, 'bought (' + bought.paid + ' coins): the Trophy Room exists');
  // walk up and back by the arrows
  const walk = await ev(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent;
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(window.__qb.x().S.base.slots.findIndex((s) => s.t === 'lair')); await w(200);
    const up = [...document.querySelectorAll('.rmodal .prtb-b')].find((e) => /Trophy/.test(e.textContent)); const a0 = title(); if (up) up.click(); await w(400); const a1 = title();
    const down = [...document.querySelectorAll('.rmodal .prtb-b')].find((e) => /Lair/.test(e.textContent)); if (down) down.click(); await w(400); const a2 = title();
    return { a0, up: up ? up.textContent.trim() : null, a1, down: down ? down.textContent.trim() : null, a2, upCorner: up ? up.parentElement.className : '', downCorner: down ? down.parentElement.className : '' }; });
  t(walk.a1 === 'Trophy Room' && /Lair/.test(walk.a2 || ''), `arrows: ${walk.a0} -> "${walk.up}" (${walk.upCorner}) -> ${walk.a1} -> "${walk.down}" (${walk.downCorner}) -> ${walk.a2}`);
  // the mannequin, with different sets of pieces
  const i = await ev(() => window.__qb.x().S.base.slots.findIndex((s) => s.t === 'trophy'));
  const cells = [];
  for (const set of [[], ['helm'], ['helm', 'chest', 'sword'], ['boots', 'greaves'], ['helm', 'chest', 'greaves', 'boots', 'sword']]) {
    await ev((set) => { window.__qb.x().S.trophy = { goblin: Object.fromEntries(set.map((k) => [k, 1])) }; }, set);
    await openRoom(p, i, 700, 600);
    const on = await ev(() => [...new Set([...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/trx_mq(_[a-z]+)?/) || [])[0]).filter(Boolean))]);
    const worn = on.filter((x) => x !== 'trx_mq').map((x) => x.slice(7)).sort();
    t(JSON.stringify(worn) === JSON.stringify([...set].sort()) && on.includes('trx_mq'), `mannequin with [${set.join(', ') || 'nothing'}] wears [${worn.join(', ') || 'nothing'}]`);
    const f = path.join(OUT, `troom_${set.length}_${set.join('_') || 'none'}.png`); await (await p.$('#qahost')).screenshot({ path: f }); cells.push({ f, lab: set.join(', ') || 'no pieces' });
  }
  // the building view: the hall above the Lair
  const bv = await ev(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove());
    document.querySelector('.nav button[data-v="hideout"]').click(); await w(1500); const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); await w(2500);
    return [...document.querySelectorAll('#lfwrap [data-room]')].map((e) => e.getAttribute('data-room')); });
  const html = cells.map((c) => `<figure><img src="data:image/png;base64,${fs.readFileSync(c.f).toString('base64')}"><figcaption>${c.lab}</figcaption></figure>`).join('');
  const sp = await b.newPage({ viewport: { width: 1500, height: 400 } });
  await sp.setContent(`<style>body{margin:0;background:#111;color:#eee;font:13px system-ui;display:flex;gap:6px}img{width:290px}figure{margin:0}</style>${html}`);
  await sp.screenshot({ path: path.join(OUT, 'trophyroom.png'), fullPage: true });
  await p.screenshot({ path: path.join(OUT, 'trophyroom_building.png') });
  console.log('building view rooms:', JSON.stringify(bv));
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
