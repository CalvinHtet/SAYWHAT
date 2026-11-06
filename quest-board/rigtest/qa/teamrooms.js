// The team in their own rooms (ROOMS's abb6513, LEAD's request 3): with all five joined, each building's view is opened and the
// team agents (a.tm) are listed with the room they stand in; each should be in their home (Mara the Restaurant, Rafe Lock and Key,
// Nova the Mall, Theo the Theater, Sable the Lair), drawn with a ring and a name tag. A picture of each building; then a save with
// only Mara joined shows nobody else.
//   OUT=<folder> BASE=<server> node teamrooms.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const HOME = { mara: 'restaurant', rafe: 'skybar', nova: 'mall', theo: 'theater', sable: 'lair' };
(async () => {
  const { b, p, errs } = await open({ width: 1200, height: 1000, owned: 'all' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const visit = async (who, tag) => {
    await p.evaluate((who) => { const x = window.__qb.x(), S = x.S; S.story = S.story || {}; S.story.team = {}; who.forEach((k) => window.__qbTeam.join(k));
      S.areaOn = null; S.gates = [5, 10, 20, 30, 40]; S.xp = Math.max(S.xp, x.cum(45)); x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="board"]').click(); }, who);
    await p.waitForTimeout(600);
    const found = {};
    for (let bi = 0; bi < 3; bi++) {
      await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); });
      await p.waitForTimeout(2500);
      await p.evaluate((bi) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[bi]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, bi);
      await p.waitForTimeout(9000);
      const r = await p.evaluate(() => { const S = window.__qb.x().S; return Object.values(window.__qbLoft().A || {}).filter((a) => a.tm).map((a) => [a.tm, (S.base.slots[a.room] || {}).t, a.alpha != null ? +(+a.alpha).toFixed(1) : null]); });
      const tags = await p.evaluate(() => [...document.querySelectorAll('.lftm text')].map((e) => e.textContent));
      r.forEach((x) => (found[x[0]] = { room: x[1], alpha: x[2] }));
      console.log(`${tag}, building ${bi}: team ${JSON.stringify(r)}, name tags drawn ${JSON.stringify(tags)}`);
      await p.screenshot({ path: path.join(OUT, `team_${tag}_b${bi}.png`) });
      await p.evaluate(() => { const st = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (st) st.click(); });
      await p.waitForTimeout(1200);
    }
    return found;
  };
  const all = await visit(Object.keys(HOME), 'all');
  for (const [k, home] of Object.entries(HOME)) t(all[k] && all[k].room === home, `${k}: in ${all[k] ? all[k].room : 'nowhere'} (home ${home})`);
  const one = await visit(['mara'], 'mara-only');
  t(Object.keys(one).join() === 'mara', `only Mara joined: team drawn ${JSON.stringify(Object.keys(one))}`);
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
