// Economy and play simulator: a new player plays the real game, day after day, through the game's own buttons, with the
// clock moved forward (the game's own __qbShift). No formula is copied: quests, coins, level pay, the wheel, missions,
// room income, the Garden's produce sales, story scenes, lots and room upgrades all run the game's code.
//   node sim.js <type> <days>     type: casual | regular | grinder
// Prints one line per day and writes <OUT>/sim_<type>.json.
//
// The players (Cal's numbers, docs/PROGRESSION.md: a normal day is about a dozen tasks, 200 XP; a busy day 450 XP):
//  casual  : 6 tasks a day (95 XP), 5 days a week, no photo proof, 2 workouts a week, opens the game twice a day
//  regular : 12 tasks (200 XP), every day, photo proof on two 25 XP tasks, 4 workouts a week, three visits a day
//  grinder : 20 tasks (450 XP), every day, photo proof on every 25+ XP task, 4 workouts a week, three visits a day
// Everyone: spins the wheel, collects room income at each visit, sells Garden produce, says yes to every story scene,
// builds every lot it can afford, sends and collects missions, clears each level trial (the gym photo) the day after it
// appears, and spends coins on the cheapest room upgrade on offer until nothing affordable is left. No clothes bought.
// Not modelled: training sessions (15 XP at most each), dungeon delves, crew, the Shop, dogs' clean-ups, neighbours.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { BASE } = require('./lib.js');
// 2026-11-05: the effort-first economy (29e_economy.js): each player has a Daily Quest goal, logs training on workout days
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
const TYPE = process.argv[2] || 'regular', DAYS = +(process.argv[3] || 30);
const P = {
  casual: { goal: 100, tasks: [10, 10, 10, 10, 25, 30], proof: 0, workouts: [1, 4], play: [1, 2, 3, 4, 5], visits: [9, 20] },
  regular: { goal: 150, tasks: [10, 10, 10, 10, 10, 10, 25, 25, 25, 25, 15, 25], proof: 2, workouts: [1, 2, 4, 5], play: [0, 1, 2, 3, 4, 5, 6], visits: [8, 13, 20] },
  grinder: { goal: 300, tasks: [10, 10, 10, 10, 10, 10, 10, 10, 25, 25, 25, 25, 25, 25, 25, 25, 50, 50, 25, 25], proof: 99, workouts: [1, 2, 4, 5], play: [0, 1, 2, 3, 4, 5, 6], visits: [8, 13, 20] },
}[TYPE];

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbStory, null, { timeout: 60000 });
  await p.waitForTimeout(1500);
  // a new player, created today; the board holds this player type's own daily tasks and the weekly workout
  await p.evaluate((P) => {
    const x = window.__qb.x(), S = x.S;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Sim', sex: 'm' }); S.dqg = P.goal;
    const wk = S.quests.find((q) => q.rep === 'weekly4');
    S.quests = P.tasks.map((xp, k) => ({ id: 'sim' + k, name: 'Task ' + k, xp, stat: ['discipline', 'fitness', 'productivity', 'creativity'][k % 4], cl: 'home', rep: 'daily' }));
    if (wk) S.quests.push(wk);
    const nav = document.querySelector('.nav button[data-v="board"]'); if (nav) nav.click();
    // in-page helpers
    const R0 = Date.now() - (window.__qbShift || 0), mid = new Date(R0); mid.setHours(0, 0, 0, 0);
    window.__sim = {
      day0: mid.getTime() - (window.__qbShift || 0) + (R0 - (Date.now() - (window.__qbShift || 0))),
      at(day, hour) { const target = mid.getTime() + day * 864e5 + hour * 36e5; window.__qbShift = target - (Date.now() - (window.__qbShift || 0)); },
      clear() { try { window.lfPvStop(); } catch (e) {} document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => { if (!e.querySelector('#wwok')) e.remove(); }); },
      act(a, d) { const el = document.createElement('button'); el.dataset.act = a; Object.assign(el.dataset, d || {}); el.style.display = 'none'; document.body.appendChild(el); el.click(); el.remove(); },
      led: { quests: 0, level: 0, missions: 0, rooms: 0, produce: 0, wheel: 0, weekly: 0, dq: 0, training: 0, other: 0 },
      spend: { upgrades: 0, lots: 0 },
      xpled: {},
      track(k, f) { const S = window.__qb.x().S, c0 = S.coins, x0 = S.xp, lp = S.lvPaid, b0 = Object.keys(S.badges || {}).length; f(); const S2 = window.__qb.x().S; let d = S2.coins - c0;
        if (S2.xp > x0) this.xpled[k] = (this.xpled[k] || 0) + (S2.xp - x0);
        // trophies pay 250 each, inside whatever earned them
        const tb = (Object.keys(S2.badges || {}).length - b0) * 250; if (tb > 0 && d >= tb) { this.led.trophies = (this.led.trophies || 0) + tb; d -= tb; }
        // level pay lands inside whatever caused the level-up
        let lv = 0; for (let L = lp + 1; L <= S2.lvPaid; L++) lv += 100 + 10 * L; if (lv && d >= lv) { this.led.level += lv; d -= lv; }
        if (d > 0) this.led[k] += d; },
    };
  }, P);

  const days = [];
  for (let d = 0; d < DAYS; d++) {
    const dow = d % 7, playing = P.play.includes(dow);
    const day = { d: d + 1, played: playing, bought: [], built: [], story: [] };
    for (let v = 0; v < P.visits.length; v++) {
      if (!playing) break;
      const res = await p.evaluate(async ({ d, hour, first, last, P, dow }) => {
        const sim = window.__sim, x = window.__qb.x(), S = x.S, out = { bought: [], built: [], story: [] };
        sim.at(d, hour); x.rollover(); sim.clear();
        // a level trial waiting since an earlier day: the player goes to the gym and proves it
        if (first && x.gated() !== null && S.__gateDay !== undefined && S.__gateDay < d) { S.gates.push(x.gated()); delete S.__gateDay; }
        if (x.gated() !== null && S.__gateDay === undefined) S.__gateDay = d;
        sim.track('rooms', () => sim.act('rall'));
        if (S.base.food && S.base.food.veg >= 1) sim.track('produce', () => sim.act('stysell'));
        if (first) sim.track('wheel', () => sim.act('spin'));
        // missions: collect what is back, send what the team can
        // (the claim button itself does not check that the team is back: only press it when it would show)
        ['m1', 'm2', 'm3', 'm4', 'm5'].forEach((id) => { const run = S.ms && S.ms.run && S.ms.run[id]; if (run && run.end <= Date.now()) sim.track('missions', () => sim.act('msclaim', { id })); });
        sim.clear();
        // only what the Missions screen would offer: not done today and not already out (its buttons do not check)
        if (S.base.slots.some((r) => r && r.t === 'lair')) ['m5', 'm4', 'm3', 'm2', 'm1'].forEach((id) => { const m = S.ms; if (m && m.d === S.runDate && (m.run || {})[id]) return; sim.act('msgo', { id }); }); // since f629518 the Send button checks runs and the 3-hour gap itself
        // the day's tasks, spread over the visits
        if (P.tasks) {
          const qs = S.quests.filter((q) => q.rep === 'daily'), per = Math.ceil(qs.length / P.visits.length);
          const mine = qs.slice(per * P.visits.indexOf(hour), per * (P.visits.indexOf(hour) + 1));
          let proofs = S.__proofs || 0; if (first) proofs = 0;
          mine.forEach((q) => { if (S.done[q.id]) return; const v = q.xp >= 25 && proofs < P.proof; if (v) proofs++; sim.track('quests', () => x.toggle(q.id, null, v ? 'v' : undefined)); sim.clear(); });
          S.__proofs = proofs;
        }
        if (first && P.workouts.includes(dow)) { const w = S.quests.find((q) => q.rep === 'weekly4'); if (w && !S.done[w.id]) sim.track('quests', () => x.toggle(w.id, null, 'v'));
          // and logs the session in Training: a plan, every set of every exercise ticked, Done
          const plan = ['push', 'legs', 'pull', 'full'][(d + dow) % 4]; sim.act('wkplan', { v: plan }); sim.clear();
          if (S.wk) { (S.wk.list || []).forEach((id) => { const n = (S.wk.setsN && S.wk.setsN[id]) || 3; S.wk.sets[id] = Array.from({ length: n }, () => true); }); sim.track('training', () => sim.act('wkdone')); sim.clear(); } }
        // the Daily Quest's chest and the hidden quest pay when the game checks (every few seconds in the page)
        if (window.__qbEcon) { sim.track('dq', () => window.__qbEcon.check()); sim.clear(); }
        // story: let it look for the next step, say yes to any scene, build any open lot
        for (let k = 0; k < 4; k++) {
          sim.clear(); window.__qbStory.check();
          const yes = document.querySelector('[data-act="styyes"]');
          if (yes) { out.story.push(yes.dataset.v); yes.click(); sim.clear(); continue; }
          const st = window.__qbStory.state(); const nOff = Object.keys(st.offer).length; if (out.__n === nOff) break; out.__n = nOff;
        }
        const lots = window.__qbStory.lots();
        lots.forEach((t) => { const T = x.ROOMT[t]; if (!T || S.base.slots.some((r) => r && r.t === t)) return; if (S.coins >= T.cost) { const c0 = S.coins; sim.act('rdo', { i: String(S.base.slots.length), t }); if (S.coins < c0) { sim.spend.lots += c0 - S.coins; out.built.push(t + ' ' + (c0 - S.coins)); } sim.clear(); } });
        // shopping: the cheapest upgrade any room's menu offers, again and again
        for (let g = 0; g < 60; g++) {
          let best = null;
          S.base.slots.forEach((r, i) => {
            if (!r) return; sim.clear(); window.__qb.roomModal(i);
            document.querySelectorAll('.rmodal button[data-act="raddon"]').forEach((bt) => {
              if (bt.disabled) return; const ad = (x.ADDONS[r.t] || []).find((u) => u[0] === bt.dataset.id); if (!ad) return;
              if (ad[2] <= S.coins && (!best || ad[2] < best.c)) best = { i, id: ad[0], c: ad[2], n: ad[1], t: r.t };
            });
          });
          sim.clear();
          if (!best) break;
          window.__qb.roomModal(best.i);
          const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="' + best.id + '"]');
          const c0 = S.coins; if (bt) bt.click(); sim.clear();
          if (S.coins < c0) { sim.spend.upgrades += c0 - S.coins; out.bought.push(best.t + ':' + best.n + ' ' + best.c); } else break;
        }
        delete out.__n;
        return out;
      }, { d, hour: P.visits[v], first: v === 0, last: v === P.visits.length - 1, P, dow });
      day.bought.push(...res.bought); day.built.push(...res.built); day.story.push(...res.story);
      // the weekly workout bonus is paid when its window is closed
      const ww = await p.$('#wwok');
      if (!ww && v === 0 && P.workouts.includes(dow)) await p.waitForTimeout(2400);
      await p.evaluate(() => { const b2 = document.querySelector('#wwok'); if (b2) window.__sim.track('weekly', () => b2.click()); window.__sim.clear(); });
    }
    // end of the day
    const s = await p.evaluate(() => { const x = window.__qb.x(), S = x.S, sim = window.__sim;
      const ups = S.base.slots.reduce((n, r) => n + (r ? Object.keys(r.a || {}).filter((k) => r.a[k]).length : 0), 0);
      const offer = []; S.base.slots.forEach((r, i) => { if (!r) return; window.__qb.roomModal(i); document.querySelectorAll('.rmodal button[data-act="raddon"]').forEach((bt) => { if (!bt.disabled) { const ad = (x.ADDONS[r.t] || []).find((u) => u[0] === bt.dataset.id); if (ad) offer.push(ad[2]); } }); sim.clear(); });
      return { lv: x.effLvl(), raw: window.__qb.x().lvlOf(S.xp), xp: S.xp, coins: S.coins, earned: S.earnedC, spent: S.spent, streak: S.streak, gates: S.gates.length,
        rooms: S.base.slots.filter(Boolean).map((r) => r.t), ups, cheapest: offer.length ? Math.min(...offer) : null, led: Object.assign({}, sim.led), xpled: Object.assign({}, sim.xpled), spend: Object.assign({}, sim.spend),
        story: Object.keys(window.__qbStory.state().done).length, sold: window.__qbStory.state().sold, biz: Math.round(window.__qbStory.state().biz), served: Math.round(S.base.served || 0) }; });
    Object.assign(day, s);
    days.push(day);
    console.log(`day ${String(d + 1).padStart(3)} ${playing ? 'play' : 'rest'} lv ${s.lv}${s.raw > s.lv ? '(' + s.raw + ' trial)' : ''} xp ${s.xp} coins ${s.coins} earned ${s.earned} rooms ${s.rooms.length} ups ${s.ups} bought ${day.bought.length}${day.built.length ? ' built ' + day.built.join(',') : ''}${day.story.length ? ' story ' + day.story.join(',') : ''} cheapest ${s.cheapest} streak ${s.streak}`);
    fs.writeFileSync(path.join(OUT, `sim_${TYPE}.json`), JSON.stringify({ type: TYPE, P, days, errs }, null, 0));
  }
  console.log('page errors', errs.length, [...new Set(errs)].slice(0, 5));
  await b.close();
})();
