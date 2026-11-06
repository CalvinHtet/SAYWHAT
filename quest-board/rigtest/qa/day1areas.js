// Day one of a new save (ddc2171): when S.areaOn is first made, and whether The Loft (level 2) and the Hall (level 4) take one slot each.
//   BASE=<server> node day1areas.js
const { open } = require('./lib.js');
(async () => {
  const { b, p } = await open({ width: 1000, height: 900, owned: 'none' });
  const r = await p.evaluate(async () => {
    const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)), out = [];
    delete S.areaOn; delete S.areaDay; S.xp = 0; S.gates = []; S.story = {}; x.render(); await w(100);
    out.push(['fresh lv ' + x.effLvl(), JSON.stringify(S.areaOn || null), S.areaDay || '-']);
    S.quests = [{ id: 'qa1', name: 'QA', xp: 200, stat: 'discipline', cl: 'home', rep: 'daily' }, { id: 'qa2', name: 'QA2', xp: 300, stat: 'discipline', cl: 'home', rep: 'daily' }];
    for (const id of ['qa1', 'qa2']) { x.toggle(id); await w(300);
      const cards = [...document.querySelectorAll('.unl')].map((c) => c.innerText.replace(/\s+/g, ' ').slice(0, 40));
      out.push(['after ' + id + ' lv ' + x.effLvl(), JSON.stringify(Object.keys(S.areaOn || {})), S.areaDay || '-', cards.join(' | ')]);
      document.querySelectorAll('#layer .modal,.modal').forEach((e) => e.remove()); }
    const nav = [...document.querySelectorAll('.nav button')].map((b) => b.dataset.v + (b.disabled ? '(locked)' : '') + (/soon/i.test(b.innerText + b.className) ? '(soon)' : ''));
    out.push(['nav', nav.join(' ')]);
    return out;
  });
  r.forEach((x) => console.log(x.join('  ')));
  await b.close();
})();
