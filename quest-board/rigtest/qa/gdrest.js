// The Garden's "Knock Through to a Restaurant" (gd_rest, 16e72c3): a mystery card until Mara says yes, then for sale.
// Three saves: Garden owned and 0 sold; 60 sold but Mara not yet asked; Mara said yes. Reads the Garden's menu card each time.
//   node gdrest.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const r = await p.evaluate(() => {
    const x = window.__qb.x(), S = x.S, ST = window.__qbStory, out = [];
    S.base.slots = [{ t: 'bedroom', a: {}, st: 0, pend: 0 }, { t: 'garden', a: {}, st: 0, pend: 0 }]; S.xp = x.cum(20); S.gates = [5, 10, 20]; S.coins = 99999;
    S.story = {}; const st = ST.state(); st.done = st.done || {}; st.done.garden = Date.now();
    const card = (lab) => { document.querySelectorAll('#layer .modal,.modal').forEach((e) => e.remove()); window.__qb.roomModal(1);
      const cards = [...document.querySelectorAll('.rmodal .addon')]; const c = cards.find((e) => /Knock Through/.test(e.innerText) || e.querySelector('[data-id="gd_rest"]'));
      const bt = document.querySelector('.rmodal [data-act="raddon"][data-id="gd_rest"]');
      const myst = document.querySelectorAll('.rmodal .addon.mystery').length;
      out.push({ lab, shown: !!c, buy: !!(bt && !bt.disabled), mysteries: myst, text: c ? c.innerText.replace(/\s+/g, ' ').slice(0, 80) : '', first: cards.slice(0, 3).map((e) => (e.classList.contains('mystery') ? '[mystery] ' : '') + e.innerText.replace(/\s+/g, ' ').slice(0, 50)) }); };
    st.sold = 0; card('0 sold, no Mara');
    st.sold = 60; card('60 sold, Mara not asked');
    document.querySelectorAll('#layer .modal,.modal').forEach((e) => e.remove()); ST.check(); const yes = document.querySelector('[data-act="styyes"]'); const scene = yes ? yes.dataset.v : null; out.push({ lab: 'scene offered after check', scene });
    if (yes) yes.click(); card('after Mara\'s yes');
    return out;
  });
  r.forEach((o) => console.log(JSON.stringify(o)));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
