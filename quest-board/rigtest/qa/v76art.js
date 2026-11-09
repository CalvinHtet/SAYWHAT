// ROOMS's 8c756be in the app: the six relic icons in the Relics tab, Sable's portrait on her two return visits, the portrait brand
// banners in the drop window (two phone sizes, plus a brand with no portrait), the Theater lobby shells at every wall x floor x size,
// bare and fully bought.   OUT=<folder> BASE=<server> node v76art.js [relics|sable|drops|lobby]
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2];
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); if (!c) fails.push(n); };
const clear = (p) => p.evaluate(() => { try { window.lfPvStop(); } catch (e) {} document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove()); });
async function relics() {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.relics = S.relics || {}; ['streak','team','build','exped','quests','collect'].forEach((id) => [1,2,3].forEach((i) => { S.relics[id + i] = 1; }));
    document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qbUnlock.on().trophy = 1; x.render(); const nb = document.querySelector('.nav button[data-v="trophy"]'); if (!nb) return { none: [...document.querySelectorAll('.nav button')].map((e) => e.dataset.v) }; nb.click(); await new Promise((o) => setTimeout(o, 800));
    const ims = [...document.querySelectorAll('.dg-pc img.dg-ic')]; await Promise.all(ims.map((i) => i.decode().catch(() => 0)));
    return { cards: document.querySelectorAll('.dg-pc').length, drawn: document.querySelectorAll('.dg-pc .dg-ic0').length, imgs: ims.map((i) => { const c = i.getBoundingClientRect(); return [i.naturalWidth, i.naturalHeight, Math.round(c.width), Math.round(c.height)]; }), sw: document.documentElement.scrollWidth, view: document.querySelector('#app').innerText.slice(0, 200), keys: Object.keys(window.__qb.x().S.relics).length }; });
  ok('every earned relic has a real icon, none falls back to the drawn star', r.cards > 0 && r.cards === r.imgs.length && r.drawn === 0 && r.imgs.every((a) => a[0] === 128 && a[1] === 128), r);
  ok('no sideways scroll at 390', r.sw <= 390, r.sw);
  await clear(p); await p.waitForTimeout(300); await p.screenshot({ path: path.join(OUT, 'relics_390.png'), fullPage: true });
  ok('no page errors', errs.length === 0, errs.slice(0, 3)); await b.close();
}
async function sable() {
  for (const [w, h] of [[390, 844], [360, 640]]) {
    const { b, p, errs } = await open({ width: w, height: h, owned: 'all', mobile: true });
    for (const id of ['sable2', 'sable3', 'join']) {
      await clear(p);
      const r = await p.evaluate(async (id) => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qbRooms.play(id === 'join' ? 'team' : 'beat', id === 'join' ? 'sable' : id); const went = 1; await new Promise((k) => setTimeout(k, 700)); const c = document.querySelector('#layer .modal .card'); if (!c) return { went, none: 1 }; const im = c.querySelector('img.sty-pic, img'); if (im && im.decode) await im.decode().catch(() => 0);
        const box = c.getBoundingClientRect(), ib = im ? im.getBoundingClientRect() : null, cs = im ? getComputedStyle(im) : {};
        return { went, tag: im && im.tagName, nat: im && im.naturalWidth ? [im.naturalWidth, im.naturalHeight] : null, shown: ib && [Math.round(ib.width), Math.round(ib.height)], fit: cs.objectFit, pos: cs.objectPosition, card: [Math.round(box.left), Math.round(box.top), Math.round(box.right), Math.round(box.bottom)], text: c.innerText.slice(0, 200) }; }, id);
      ok(`${id} at ${w}: ` + (id === 'join' ? 'her join card (not this art, for comparison)' : 'her portrait shows at 300x400'), id === 'join' ? r.tag === 'IMG' : r.tag === 'IMG' && r.nat && r.nat[0] === 300 && r.nat[1] === 400, r);
      ok(`${id} at ${w}: card fits the screen`, r.card && r.card[0] >= 0 && r.card[2] <= w && r.card[1] >= 0 && (r.card[3] <= h || id === 'join'), r.card); if (r.card[3] > h) console.log('  note ' + id + ' taller than the screen, scrolls: ' + await p.evaluate(() => { const m = document.querySelector('#layer .modal'); return JSON.stringify([getComputedStyle(m).overflowY, m.scrollHeight, m.clientHeight]); }));
      await p.screenshot({ path: path.join(OUT, `sable_${id}_${w}.png`) });
    }
    ok(`no page errors at ${w}`, errs.length === 0, errs.slice(0, 3)); await b.close();
  }
}
async function drops() {
  for (const [w, h] of [[390, 844], [360, 640]]) {
    const { b, p, errs } = await open({ width: w, height: h, owned: 'none', mobile: true });
    const ids = await p.evaluate(() => [...new Set(window.__qb.x().SHOP.map((x) => x[6] && x[6].b).filter(Boolean))]);
    console.log('  brands: ' + ids.join(' '));
    for (const id of ['hanga', 'y2k', 'over', 'rose', 'alt', 'nc']) {
      await clear(p);
      const r = await p.evaluate(async (id) => { window.__qbRooms.play('brand', id); await new Promise((k) => setTimeout(k, 600)); const c = document.querySelector('.bsplash'), im = c.querySelector('.bs-art'); if (im && im.decode) await im.decode().catch(() => 0); await Promise.all([...c.querySelectorAll('img')].map((i) => i.decode ? i.decode().catch(() => 0) : 0));
        const rc = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]; };
        const parts = {}; ['.bs-burst', '.bs-tag', '.bs-items'].forEach((s) => { parts[s] = rc(c.querySelector(s)); }); const bts = [...c.querySelectorAll('button')]; parts.btn = rc(bts[bts.length - 1]);
        return { src: im ? (im.currentSrc.match(/ui_banner_[a-z0-9_]+/) || ['data'])[0] : null, nat: im ? [im.naturalWidth, im.naturalHeight] : null, art: rc(im), card: rc(c), parts, ow: c.scrollHeight - c.clientHeight, items: c.querySelectorAll('.bs-item').length, broken: [...c.querySelectorAll('img')].filter((i) => !i.naturalWidth).length }; }, id);
      const portrait = id !== 'nc';
      ok(`${id} at ${w}: ` + (portrait ? 'portrait banner 720x1080' : 'no portrait, fallback'), portrait ? (r.nat && r.nat[0] === 720 && r.nat[1] === 1080) : true, { nat: r.nat, items: r.items });
      ok(`${id} at ${w}: card on screen, nothing broken or cut off`, r.card[0] >= 0 && r.card[2] <= w && r.card[1] >= 0 && r.card[3] <= h && !r.broken && r.ow <= 1 && Object.values(r.parts).every((q) => q && q[3] <= r.card[3] + 1), { card: r.card, parts: r.parts, ow: r.ow, broken: r.broken });
      await (await p.$('.bsplash')).screenshot({ path: path.join(OUT, `drop_${id}_${w}.png`) });
    }
    ok(`no page errors at ${w}`, errs.length === 0, errs.slice(0, 3)); await b.close();
  }
}
async function lobby() {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const i = await p.evaluate(() => { const S = window.__qb.x().S; if (!S.base.slots.some((s) => s.t === 'theater')) S.base.slots.push({ t: 'theater', a: {}, st: 0, pend: 0 }); return S.base.slots.findIndex((s) => s.t === 'theater'); });
  const setA = (w, f, wing, full) => p.evaluate(({ i, w, f, wing, full }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = {}; const skip = new Set(['t_wl1', 't_wl2', 't_wl3', 't_fl1', 't_fl2', 't_fl3', 't_wing']);
    if (full) { const needsWing = (id, seen = {}) => { if (seen[id]) return false; seen[id] = 1; const u = x.ADDONS.theater.find((q) => q[0] === id); if (!u) return false; if (u[3] && u[3].also === 't_wing') return true; const rq = window.ADDREQ && ADDREQ[id]; return rq === 't_wing' || (rq && needsWing(rq, seen)); };
      x.ADDONS.theater.forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; if (skip.has(u[0])) return; if (!wing && needsWing(u[0])) return; r.a[u[0]] = 1; }); }
    for (let k = 1; k <= w; k++) r.a['t_wl' + k] = 1; for (let k = 1; k <= f; k++) r.a['t_fl' + k] = 1; if (wing) r.a.t_wing = 1; x.persist(); }, { i, w, f, wing, full });
  for (const full of [false, true]) for (const wing of [false, true]) for (let w = 0; w <= 3; w++) for (let f = 0; f <= 3; f++) {
    await setA(w, f, wing, full); await openRoom(p, i, 620, 500);
    const sh = await p.evaluate(() => [...document.querySelectorAll('#qahost image')].map((e) => ((e.getAttribute('href') || '').match(/thw_[tw]\d/) || [])[0]).filter(Boolean));
    const tp = wing ? 'thw_w' : 'thw_t', exF = tp + (f >= 3 ? 3 : f >= 2 ? 2 : 1), exW = w ? tp + w : null, set = [...new Set(sh)];
    const good = set.includes(exF) && (!exW || set.includes(exW)) && set.length === (exW && exW !== exF ? 2 : 1);
    ok(`${full ? 'full' : 'bare'} ${wing ? '16x10' : '12x9'} w${w} f${f}: shells`, good, set);
    await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `lobby_${full ? 'full' : 'bare'}_${wing ? 'w' : 't'}_${w}${f}.png`) });
    if (full && w === 3 && f === 3) { const a = await audit(p, i); console.log(`  audit ${a.size}: ${a.items.length} pieces` + (a.outside.length ? ' OUTSIDE ' + a.outside.join(' ') : '') + (a.overlap.length ? ' overlaps ' + a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ') : '') + (a.depth.length ? ' depth ' + a.depth.slice(0, 6).join('; ') : '') + (a.stations.length ? ' spots ' + [...new Set(a.stations)].join('; ') : '')); }
  }
  ok('no page errors', errs.length === 0, errs.slice(0, 3)); await b.close();
}
(async () => {
  for (const [n, f] of [['relics', relics], ['sable', sable], ['drops', drops], ['lobby', lobby]]) { if (only && only !== n) continue; console.log('== ' + n); await f(); }
  console.log(fails.length ? 'FAILED ' + fails.length : 'PASS');
})().catch((e) => { console.error(e); process.exit(1); });
