// Friends stay all day in their visit's room (LEAD's 3bcbb44): every room owned, each visit forced in turn, then every building's view
// opened and its live characters read: which room the friend (or dog) stands in, against the room the card names; that they are still
// there hours later; and that a dog visit doesn't make a second copy of a dog already living there.   BASE=<server> node friendsroom.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  const nb = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); return 0; });
  await p.waitForTimeout(3000);
  const visits = (process.env.ONLY || 'logan_stream,justin_hook,habibimbaps,cynthia_garden,memo_cynthia,chopstick,pluto,vega_manager').split(',');
  for (const id of visits) {
    const card = await p.evaluate((id) => { const S = window.__qb.x().S; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); S.visit = null; window.__qbFriends.force(id); const m = document.querySelector('#layer .modal'); const t = m ? (m.innerText.match(/hanging out in (?:the )?([^.]+?) today/) || [])[1] : null; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); return t; }, id);
    const seen = [];
    const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length);
    for (let k = 0; k < nB; k++) {
      await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k);
      await p.waitForTimeout(3500);
      const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, A = window.__qbLoft ? window.__qbLoft().A : {}; const out = [];
        Object.values(A).forEach((a) => { if (!a) return; const sl = S.base.slots[a.room]; const nm = sl ? x.ROOMT[sl.t] && x.ROOMT[sl.t].name : '?';
          if (String(a.id).startsWith('v:') || a.role === 'dog') out.push(`${a.id}@${nm}${a.visitor ? '' : '(home)'}`); }); return out; });
      seen.push(...r);
      await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1200);
    }
    console.log(`${id.padEnd(15)} card: ${card}   live: ${[...new Set(seen)].join(', ') || 'nobody'}`);
  }
  // hours later
  await p.evaluate(() => { window.__qbShift += 5 * 36e5; });
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelectorAll('[data-act="bldgo"]')[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await p.waitForTimeout(4000);
  const later = await p.evaluate(() => { const A = window.__qbLoft().A; return Object.values(A).filter((a) => a && String(a.id).startsWith('v:')).map((a) => a.id + '@' + a.room); });
  console.log('5 h later, first building:', JSON.stringify(later));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
