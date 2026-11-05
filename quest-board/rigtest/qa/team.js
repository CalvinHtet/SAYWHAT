// The team (29c_team.js), the last part of LEAD's upgrade-income request, a cheap check on one save:
//  each member's buff applies once to the rooms it names (the room window's coins/hr) and to mission pay (the mission card);
//  the join banner shows name, role, stats and buff; team members lead the missions; Sable joins on the first mission home.
//   node team.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1000, owned: 'all' });
  const r = await p.evaluate(async () => {
    const x = window.__qb.x(), S = x.S, T = window.__qbTeam, wait = (ms) => new Promise((ok) => setTimeout(ok, ms)), out = { rooms: [], ms: {} };
    const clear = () => { try { window.lfPvStop(); } catch (e) {} document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove()); };
    S.story = S.story || {}; S.story.team = {}; S.cls = null;
    const rate = (t) => { clear(); const i = S.base.slots.findIndex((s) => s && s.t === t); window.__qb.roomModal(i); const c = (document.querySelector('.rmodal .chip.xp') || {}).textContent || ''; clear(); const m = c.match(/([\d,]+) coins\/hr/); return m ? +m[1].replace(/,/g, '') : null; };
    const card = () => { clear(); const bt = document.querySelector('.nav button[data-v="away"]'); if (bt) bt.click(); const c = [...document.querySelectorAll('section.card.panel')].find((s) => /Check the Old Metro/.test(s.textContent)); const m = c && c.innerText.match(/Pays ([\d,]+) coins/); const team = [...document.querySelectorAll('section.card.panel')].find((s) => /Your team/.test(s.textContent)); return { pay: m ? +m[1].replace(/,/g, '') : null, team: team ? team.innerText.replace(/\s+/g, ' ').slice(0, 120) : '' }; };
    const check = { mara: ['restaurant', 'boba', 'dessert', 'garden'], rafe: ['skybar', 'rooftop', 'restaurant'], nova: ['mall', 'club', 'theater'], theo: ['theater', 'auditorium', 'mall'] };
    for (const id of Object.keys(check)) {
      const before = Object.fromEntries(check[id].map((t) => [t, rate(t)]));
      S.story.team[id] = 1;
      const after = Object.fromEntries(check[id].map((t) => [t, rate(t)]));
      check[id].forEach((t) => out.rooms.push({ id, t, before: before[t], after: after[t], ratio: before[t] ? +(after[t] / before[t]).toFixed(3) : null, named: (T.TEAM[id].buff.rooms || []).includes(t) }));
      S.story.team = {};
    }
    // Tamer's Bond: team buffs 50% stronger
    S.cls = 'tamer'; const t0 = rate('restaurant'); S.story.team.mara = 1; const t1 = rate('restaurant'); S.story.team = {}; S.cls = null; out.tamer = +(t1 / t0).toFixed(3);
    // missions: Sable's 10%, and who leads
    out.ms.before = card(); S.story.team.sable = 1; out.ms.after = card(); S.story.team = {};
    // the join banner, then Sable joining on the first mission home
    T.join('theo'); await wait(700); const bn = document.querySelector('.tmj'); out.banner = bn ? bn.innerText.replace(/\s+/g, ' ').slice(0, 220) : null; clear(); S.story.team = {};
    S.ms = null; const q = { id: 'qa', name: 'QA', xp: 100, stat: 'discipline', cl: 'home', rep: 'daily' }; S.quests.push(q); x.toggle('qa', null, 'v'); clear();
    const act = (a, d) => { const e = document.createElement('button'); e.dataset.act = a; Object.assign(e.dataset, d); document.body.appendChild(e); e.click(); e.remove(); };
    act('msgo', { id: 'm1' }); window.__qbShift = (window.__qbShift || 0) + 25 * 60000; act('msclaim', { id: 'm1' }); await wait(1600);
    out.sable = { joined: T.list().includes('sable'), banner: !!document.querySelector('.tmj') }; clear();
    out.lead = card().team;
    return out;
  });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const want = { mara: 1.15, rafe: 1.15, nova: 1.10, theo: 1.20 };
  r.rooms.forEach((x) => t(x.named ? Math.abs(x.ratio - want[x.id]) < 0.02 : Math.abs(x.ratio - 1) < 0.01, `${x.id} on ${x.t}: ${x.before} to ${x.after} coins/hr (x${x.ratio}, ${x.named ? 'named, want x' + want[x.id] : 'not named, want x1'})`));
  t(Math.abs(r.tamer - 1.225) < 0.02, `Tamer's Bond: Mara's 15% becomes 22.5% (x${r.tamer})`);
  const mr = r.ms.after.pay / r.ms.before.pay; t(Math.abs(mr - 1.1) < 0.02, `Sable: mission pay ${r.ms.before.pay} to ${r.ms.after.pay} (x${mr.toFixed(3)})`);
  t(r.banner && /Theo/.test(r.banner) && /Theater crew/i.test(r.banner) && /20%/.test(r.banner), `join banner: ${r.banner}`);
  t(r.sable.joined && r.sable.banner, `Sable joins on the first mission home (joined ${r.sable.joined}, banner ${r.sable.banner})`);
  t(/Sable/.test(r.lead), `missions led by the team: "${r.lead}"`);
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
