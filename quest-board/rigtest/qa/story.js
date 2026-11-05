// The story that opens rooms (LEAD's request, 29b_story.js, hook window.__qbStory), a cheap check on two saves:
//  new save: each step opens only once its gate is met and not before (every gate is first held just short, then met);
//  a scene's "Not yet" puts it off for 30 minutes and it comes back after; lots appear on the street in story order;
//  old save owning every room: no scene and no lot for a room it already owns.
//   node story.js
const { open } = require('./lib.js');
(async () => {
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  // ---- a new save, walked step by step ----
  {
    const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
    const r = await p.evaluate(async () => {
      const x = window.__qb.x(), S = x.S, ST = window.__qbStory, out = { steps: [], lots: [] }, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
      const clear = () => document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove());
      S.base.slots = [{ t: 'bedroom', a: {}, st: 0, pend: 0 }]; S.xp = 0; S.earnedC = 0; S.base.served = 0; S.story = {}; x.render();
      const st = () => ST.state();
      const has = (t) => S.base.slots.some((r) => r && r.t === t);
      const add = (t) => { if (!has(t)) S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); };
      const ups = (t, n) => { const r = S.base.slots.find((r) => r && r.t === t); const l = (x.ADDONS[t] || []).filter((u) => !(u[3] && (u[3].retired || u[3].opens))); for (let i = 0; i < n && i < l.length; i++) r.a[l[i][0]] = 1; };
      // look: what the story offers now (scene, lot, room), saying yes to scenes unless told not to
      const look = (no) => { clear(); ST.check(); const sc = document.querySelector('[data-act="styyes"]'); let scene = null; if (sc) { scene = sc.dataset.v; (no ? document.querySelector('[data-act="styno"]') : sc).click(); } clear(); return { scene, offer: Object.keys(st().offer).sort().join(','), lots: ST.lots().join(',') }; };
      const step = (name, before, after) => { const a = look(); before(); const b0 = look(); after && after(); const c = look(); out.steps.push({ name, held: b0, met: c, early: a }); };
      // Garden: level 3
      S.xp = x.cum(2); const g0 = look(); S.xp = x.cum(3); const g1 = look(); out.steps.push({ name: 'garden (level 2, then 3)', held: g0, met: g1 });
      add('garden');
      // Mara: 60 produce sold; first say Not yet, come back after 30 minutes
      st().sold = 59; const m0 = look(); st().sold = 60; const m1 = look(true); const m2 = look(); window.__qbShift = (window.__qbShift || 0) + 31 * 60000; const m3 = look();
      out.steps.push({ name: 'chef (59 sold, then 60: Not yet, again at once, again after 31 min)', held: m0, met: m1, again: m2, later: m3 });
      add('restaurant');
      S.base.served = 79; const b0 = look(); S.base.served = 80; const b1 = look(); out.steps.push({ name: 'boba (79 served, then 80)', held: b0, met: b1 }); add('boba');
      ups('boba', 3); const d0 = look(); ups('boba', 4); const d1 = look(); out.steps.push({ name: 'dessert (3 boba upgrades, then 4)', held: d0, met: d1 }); add('dessert');
      S.earnedC = 24999; const k0 = look(); S.earnedC = 25000; const k1 = look(); out.steps.push({ name: 'Lock and Key (24,999 earned, then 25,000)', held: k0, met: k1 });
      ups('skybar', 5); const r0 = look(); ups('skybar', 6); const r1 = look(); out.steps.push({ name: 'rooftop (5 Lock and Key upgrades, then 6)', held: r0, met: r1 }); add('rooftop');
      S.earnedC = 79999; const l0 = look(); S.earnedC = 80000; const l1 = look(); out.steps.push({ name: 'mall (79,999 earned, then 80,000)', held: l0, met: l1 }); add('mall');
      ups('mall', 3); const t0 = look(); ups('mall', 4); const t1 = look(); out.steps.push({ name: 'theater (3 mall upgrades, then 4)', held: t0, met: t1 }); add('theater');
      ups('theater', 1); const a0 = look(); ups('theater', 2); const a1 = look(); out.steps.push({ name: 'auditorium (1 theater upgrade, then 2)', held: a0, met: a1 });
      out.rooms = S.base.slots.map((r) => r.t).join(',');
      return out;
    });
    const sum = (o) => o ? `scene ${o.scene || '-'}, offered [${o.offer}], lots [${o.lots}]` : '';
    r.steps.forEach((s) => { console.log(s.name); ['early', 'held', 'met', 'again', 'later'].forEach((k) => s[k] && console.log('   ' + k.padEnd(5) + ' ' + sum(s[k]))); });
    console.log('rooms at the end:', r.rooms, '| errors', errs.length);
    const S = Object.fromEntries(r.steps.map((s) => [s.name.split(' ')[0], s]));
    const offered = (o, id) => o && (o.offer.split(',').includes(id) || o.scene === id);
    [['garden', 'garden'], ['boba', 'boba'], ['dessert', 'dessert'], ['Lock', 'lockkey'], ['rooftop', 'rooftop'], ['mall', 'mall'], ['theater', 'theater'], ['auditorium', 'auditorium']].forEach(([k, id]) => {
      const s = S[k]; if (!s) return t(false, k + ': not reached');
      t(!offered(s.held, id), `${s.name}: nothing before its gate`);
      t(offered(s.met, id), `${s.name}: opens when its gate is met`);
    });
    const c = S.chef; t(!offered(c.held, 'chef'), 'chef: nothing before 60 sold'); t(c.met.scene === 'chef', 'chef: Mara\'s scene at 60 sold');
    t(!c.again.scene, '"Not yet": the scene does not come straight back'); t(c.later.scene === 'chef', '"Not yet": Mara comes back after 30 minutes');
    await b.close();
  }
  // ---- an old save owning every room ----
  {
    const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'all' });
    const r = await p.evaluate(() => { const ST = window.__qbStory, S = window.__qb.x().S; S.story = {}; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); ST.check();
      const sc = document.querySelector('[data-act="styyes"]'); return { scene: sc ? sc.dataset.v : null, lots: ST.lots(), done: Object.keys(ST.state().done).sort() }; });
    t(!r.scene || !['garden', 'chef', 'boba', 'dessert', 'lockkey', 'rooftop', 'mall', 'theater', 'auditorium', 'arcade', 'rhythm', 'vr', 'bowling', 'karaoke', 'club'].includes(r.scene), `old save with every room: no scene for an owned room (scene: ${r.scene || 'none'})`);
    t(!r.lots.length, `old save with every room: no lot on the street (${r.lots.join(',') || 'none'})`);
    console.log('old save: steps marked done', r.done.join(','));
    await b.close();
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
})();
