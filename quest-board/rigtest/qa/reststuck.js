// Can a Restaurant player reach the Knock Through the Wall (r_x1)? The window at the point the upgrade sweep stopped (the first 13 in
// the order the window offers them), with every card the window shows: its name, its button, and whether r_x1 is anywhere on it.
// Then the same at a real player's level for that point.   BASE=<server> [LV=60] node reststuck.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  for (const lv of [60, 14]) {
    const r = await p.evaluate(async (lv) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; S.xp = x.cum(lv);
      const k = S.base.slots.findIndex((s) => s && s.t === 'restaurant'); const r = S.base.slots[k]; r.a = {};
      ['r_sign', 'r_cf1', 'r_m1', 'r_k1', 'r_t1', 'r_d1', 'r_d2', 'r_k2', 'r_s1', 'r_till', 'r_l1', 'r_m2', 'r_k3'].forEach((u) => { r.a[u] = 1; });
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(1500);
      document.querySelectorAll('.rmodal details').forEach((d) => { d.open = true; }); await w(300);
      const m = document.querySelector('.rmodal'); const txt = m.innerText;
      const cards = [...m.querySelectorAll('.upcard, .ucard, [data-act="rbuy"], [data-act="buyup"], .rup')].map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 90));
      return { lv: x.lvlOf(S.xp), knock: /Knock Through the Wall/.test(txt), knockCard: (txt.match(/[^\n]*Knock Through[^\n]*\n?[^\n]*/g) || []).slice(0, 4), acts: [...new Set([...m.querySelectorAll('[data-act]')].map((e) => e.dataset.act))].join(' '), tail: txt.replace(/\s+/g, ' ').slice(-700) }; }, lv);
    console.log(`level ${r.lv}: "Knock Through the Wall" named in the window: ${r.knock}`);
    console.log('  lines naming it:', JSON.stringify(r.knockCard));
    console.log('  actions:', r.acts);
    console.log('  window text (end):', r.tail);
  }
  console.log('page errors', errs.length);
  await b.close();
})();
