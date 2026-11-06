// The Dessert Parlor's retired Speakeasy opener (ROOMS's ef0ecc8): a new player sees no card and no Hidden Door; an owner keeps the Speakeasy and its door.
//   BASE=<server> node speakretired.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)), out = {};
    const op = x.ADDONS.dessert.filter((u) => u[3] && u[3].opens).map((u) => u[0] + ':' + u[1] + (u[3].retired ? ' (retired)' : '') + ' opens ' + u[3].opens);
    out.openers = op;
    // a new player with a Dessert Parlor fully bought: is any Speakeasy opener for sale or shown?
    S.base.slots = S.base.slots.filter((s) => !['dessert', 'speakeasy'].includes(s.t)); S.base.slots.push({ t: 'dessert', a: {}, st: 0, pend: 0 }); const d = S.base.slots[S.base.slots.length - 1];
    x.ADDONS.dessert.forEach((u) => { if (!(u[3] && (u[3].retired || u[3].opens))) d.a[u[0]] = 1; });
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.indexOf(d)); await w(500);
    out.cards = [...document.querySelectorAll('.rmodal .addon')].map((e) => (e.classList.contains('mystery') ? '[mystery] ' : '') + e.innerText.replace(/\s+/g, ' ').slice(0, 50)).filter((t) => /speak|\?\?\?|hidden|book/i.test(t));
    out.arrowsNoSpeak = [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim());
    // an owner: Speakeasy already built (and the old opener bought)
    op.forEach((o) => { d.a[o.split(':')[0]] = 1; }); S.base.slots.push({ t: 'speakeasy', a: {}, st: 0, pend: 0 }); x.render();
    document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.indexOf(d)); await w(500);
    out.arrowsOwner = [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim());
    out.ownerKeeps = S.base.slots.some((s) => s.t === 'speakeasy');
    return out; });
  console.log(JSON.stringify(r, null, 1)); console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
