// Walk doors both ways through the real room windows (ROOMS's 3962ee2 moved some): for each pair, open the first room, click the arrow
// that leads to the second, check the window shows it, click the arrow back, check we are home again; prints each arrow's corner.
//   BASE=<server> node doorwalk.js [from:to,from:to,...]
const { open } = require('./lib.js');
const PAIRS = (process.argv[2] || 'bedroom:gameroom,garden:boba,dessert:speakeasy,mall:arcade,arcade:rhythm,restaurant:skybar,restaurant:garden').split(',').map((x) => x.split(':'));
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  for (const [a, z] of PAIRS) {
    const r = await p.evaluate(async ({ a, z }) => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms));
      [a, z].forEach((k) => { if (!S.base.slots.some((s) => s && s.t === k)) S.base.slots.push({ t: k, a: {}, st: 0, pend: 0 }); });
      const nm = (k) => (x.ROOMT[k] && x.ROOMT[k].name) || k;
      const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent || '';
      const arrows = () => [...document.querySelectorAll('.rmodal .prtb-b')];
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.findIndex((s) => s && s.t === a)); await w(350);
      const t0 = title(), list0 = arrows().map((e) => e.textContent.trim());
      // the arrow to z: click each in turn until the window shows z
      let go = null, t1 = '', back = null, t2 = '';
      for (const lab of list0) { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.findIndex((s) => s && s.t === a)); await w(300);
        const e = arrows().find((q) => q.textContent.trim() === lab); const corner = e.parentElement.className.replace('prtb ', ''); e.click(); await w(400);
        const now = window.__qb.x().S.base.slots[+((document.querySelector('.rmodal .rm-scroll') || {}).dataset || {}).i] || {};
        if (now.t === z || title() === nm(z)) { go = lab + ' (' + corner + ')'; t1 = title(); break; } }
      if (go) { const list1 = arrows().map((e) => e.textContent.trim());
        for (const lab of list1) { const e = arrows().find((q) => q.textContent.trim() === lab); const corner = e.parentElement.className.replace('prtb ', ''); e.click(); await w(400);
          if (title() === t0) { back = lab + ' (' + corner + ')'; t2 = title(); break; }
          document.querySelectorAll('#layer .modal,.dropsplash').forEach((q) => q.remove()); window.__qb.roomModal(S.base.slots.findIndex((s) => s && s.t === z)); await w(300); } }
      return { t0, go, t1, back, t2, list0 }; }, { a, z });
    t(r.go && r.back, `${a} -> ${z}: "${r.t0}" by [${r.go || 'no arrow (' + r.list0.join(', ') + ')'}] -> "${r.t1}" by [${r.back || 'no way back'}] -> "${r.t2}"`);
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
