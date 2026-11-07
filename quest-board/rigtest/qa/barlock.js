// ROOMS's 633ffe2: the Upstairs Bar (r_bar) is not offered until White Linen Service (r_t3) is installed, and a save that already owns
// the bar keeps it (and the Sky Bar room). Every other Restaurant upgrade owned, Restaurant window read.   BASE=<server> node barlock.js
const { open } = require('./lib.js');
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 300) : '')); if (!c) fails.push(n); };
(async () => {
  const { b, p, errs } = await open({ width: 1100, height: 1000, owned: 'all' });
  const win = (own) => p.evaluate(async (own) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
    S.base.slots = S.base.slots.filter((r) => r.t !== 'skybar'); const k = S.base.slots.findIndex((r) => r.t === 'restaurant'), r = S.base.slots[k];
    x.ADDONS.restaurant.forEach((u) => { r.a[u[0]] = 1; }); own.off.forEach((id) => delete r.a[id]); const st = window.__qbStory.state(); st.offer = st.offer || {}; if (own.story) st.offer.lockkey = 1; else delete st.offer.lockkey; if (own.sky) S.base.slots.push({ t: 'skybar', a: {}, st: 0, pend: 0 });
    x.persist(); x.render(); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(1500);
    const cards = [...document.querySelectorAll('.rmodal [data-act="raddon"]')].map((e) => e.dataset.id); const all = document.querySelector('.rmodal').innerText;
    return { offered: cards, barText: /Upstairs Bar/.test(all), sky: S.base.slots.some((r) => r.t === 'skybar'), hasBar: !!r.a.r_bar }; }, own);
  const a = await win({ off: ['r_bar', 'r_t3'] }); ok('without White Linen: White Linen offered, the bar not', a.offered.includes('r_t3') && !a.offered.includes('r_bar') && !a.barText, a);
  const c0 = await win({ off: ['r_bar'] }); ok('with White Linen, before the story\'s earnings step: still hidden', !c0.barText, c0);
  const c = await win({ off: ['r_bar'], story: 1 }); ok('with White Linen and the story step open: the bar card shows', c.barText || c.offered.includes('r_bar'), c);
  const d = await win({ off: ['r_t3'], sky: 1 }); ok('an old save owning the bar but not White Linen keeps the bar and the Sky Bar', d.hasBar && d.sky, d);
  await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 }); await p.waitForTimeout(1500);
  const e = await p.evaluate(() => { const S = window.__qb.x().S, r = S.base.slots.find((x) => x.t === 'restaurant'); return { hasBar: !!r.a.r_bar, sky: S.base.slots.some((x) => x.t === 'skybar') }; });
  ok('...and still after a reload', e.hasBar && e.sky, e);
  ok('no page errors', errs.length === 0, errs.slice(0, 3)); console.log(fails.length ? 'FAILED ' + fails.length : 'PASS'); await b.close();
})();
