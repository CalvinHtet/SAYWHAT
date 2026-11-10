// QA w-chests check 5: relic buffs measured with and without the relic. Quest XP (group, stat, all, first 3, a tier set) through
// mults(); business and room income through each room's window ("N coins an hour"); Training XP through a real session (the
// wkplan and wkdone actions); Daily Quest chest coins through dqCheck; crawl rare-find chance through __qbDungeon.chance().
const { open, log, closeModals, nav, sleep } = require('./wchests_lib.js');
const L = log('buffs');
(async () => {
  const { br, pg } = await open({ lv: 60 });
  const E = (s, t) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S,F=window.__qbFree;${s}})()`, t);
  await E(`S.done={};S.cdone={};S.dq=null;window.__qbEcon.xp();S.dq.tx=150;S.relics2={};S.combo=null;x.persist();return 1`);
  const own = (ids) => E(`S.relics2={};${JSON.stringify(ids)}.forEach(function(id){S.relics2[id]=1});return Object.keys(S.relics2).length`);
  // quest XP: a 1,000 XP copy of a quest, never the bounty, per group or stat
  const qx = async (cl, stat) => E(`var q=Object.assign({},S.quests[0],{id:'qa_x',xp:1000,cl:'${cl}',stat:'${stat}',rep:'daily'});var m=x.mults(q,{});return {xp:m.xp,tags:m.tags.join(', ')}`);
  const cases = [
    ['home group, Brass Key Ring (+0.5%)', 'home', 'productivity', ['r2_keyring']],
    ['home group, 4 home heirlooms (+2%)', 'home', 'productivity', ['r2_keyring', 'r2_leash', 'r2_recipe', 'r2_peg']],
    ['admin group, Codex of Ashen Stars (+3% admin and create)', 'admin', 'productivity', ['r2_codex']],
    ['create group, Codex (+3%)', 'create', 'creativity', ['r2_codex']],
    ['social group, Codex (should be 0)', 'social', 'social', ['r2_codex']],
    ['fitness stat, Oathbound Gauntlet (+3%)', 'body', 'fitness', ['r2_gauntlet']],
    ['any quest, Sunken Crown (+2% all)', 'out', 'productivity', ['r2_crown']],
    ['first 3 quests, Mirror (+5%)', 'out', 'productivity', ['r2_mirror']],
  ];
  for (const [name, cl, stat, ids] of cases) {
    await own([]); const a = await qx(cl, stat); await own(ids); const b = await qx(cl, stat);
    L('XP ' + name, { without: a.xp, with: b.xp, pct: +((b.xp / a.xp - 1) * 100).toFixed(2), tagsWithout: a.tags, tagsWith: b.tags });
  }
  // tier set: all 12 low vs 11 low (missing the Brass Doorbell, a social one) on an "out" quest: the 12th adds only the set's +1%
  const low = await E(`return F.relics.filter(function(r){return r.tier==='low'}).map(function(r){return r.id})`);
  await own(low.filter((i) => i !== 'r2_doorbell')); const s11 = await qx('out', 'productivity');
  await own(low); const s12 = await qx('out', 'productivity');
  await own([]); const s0 = await qx('out', 'productivity');
  L('XP low set (out quest): none / 11 low / 12 low', { none: s0.xp, l11: s11.xp, l12: s12.xp, tags12: s12.tags });
  const mid = await E(`return F.relics.filter(function(r){return r.tier==='mid'}).map(function(r){return r.id})`);
  await own(mid); const m8 = await qx('home', 'productivity'); await own(mid.slice(1)); const m7 = await qx('home', 'productivity');
  L('XP mid set (+1.5%) on a home quest: 7 mid / 8 mid (the 8th, the Lantern, has no XP buff)', { m7: m7.xp, m8: m8.xp, tags8: m8.tags });
  // rounding probe: crewPct rounds the summed perk % to a whole number
  await own([]); const r0 = await qx('reset', 'productivity'); await own(['r2_teacup']); const r1 = await qx('reset', 'productivity');
  await own(['r2_teacup', 'r2_hourglass']); const r2 = await qx('reset', 'productivity');
  L('rounding: reset quest none / Tea Cup +0.5 / Tea Cup + Hourglass +1.5', { r0: r0.xp, r1: r1.xp, r2: r2.xp, tags: [r0.tags, r1.tags, r2.tags] });

  // rooms: each coin room's window, then the Garden
  const rooms = await E(`var o=[];S.base.slots.forEach(function(r,i){if(r&&x.ROOMT[r.t]&&(x.ROOMT[r.t].coin||x.ROOMT[r.t].food))o.push([i,r.t])});return o`);
  const rate = async () => {
    const o = {};
    for (const [i, t] of rooms) {
      o[t] = await pg.ev(`(function(){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(${i});var m=document.querySelector('#layer .modal');var tx=m?m.innerText:'';var a=tx.match(/([\\d,.]+) coins? an hour/)||tx.match(/([\\d.]+) [a-z ]+ an hour/i);if(m)m.remove();return a?a[0]:null})()`);
    }
    return o;
  };
  await own([]); const base = await rate();
  await own(['r2_wyrmheart']); const wy = await rate();
  await own(['r2_foxbell']); const fox = await rate();
  await own(['r2_shell']); const sh = await rate();
  L('rooms', { rooms: rooms.map((r) => r[1]), base, wyrmheart_biz5: wy, foxbell_bobaDessert2: fox, shell_garden2: sh });

  // Daily Quest chest coins: the 100 chest, without and with the Clockwork Familiar
  const chest = async (ids) => { await own(ids); return E(`S.dq=null;S.done={};window.__qbEcon.xp();S.dq.tx=100;var c=S.coins;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qbEcon.check();var m=document.querySelector('#layer .dqc');var t=m?m.innerText.replace(/\\s+/g,' '):null;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return {coins:S.coins-c,modal:t}`); };
  L('DQ 100 chest: without / with Familiar (+5%)', await chest([]), await chest(['r2_familiar']));
  await E(`S.dq.tx=150;return 1`);

  // crawl rare-find chance: without and with the Moth-Wing Lantern (+1%)
  await own([]); const c0 = await E(`return window.__qbDungeon.chance()`); await own(['r2_lantern']); const c1 = await E(`return window.__qbDungeon.chance()`);
  L('crawl chance without / with Lantern', { c0, c1, delta: +(c1 - c0).toFixed(4) });
  // crawls a day (Veil, +1): the Crawls screen's "Crawls today: n/N"
  const perDay = async () => { await nav(pg, 'away'); await sleep(600); return pg.ev(`(function(){var m=document.body.innerText.match(/Crawls today: \\d+\\/\\d+/);return m?m[0]:null})()`); };
  await own([]); const pd0 = await perDay(); await own(['r2_veil']); await E('x.render();return 1'); const pd1 = await perDay();
  L('crawls a day without / with Veil', pd0, pd1);
  await closeModals(pg); await nav(pg, 'board');

  // Training XP: a real Push session (3+ exercises, every set ticked), without and with Ronin's Broken Hilt (+1%)
  const train = async (ids) => {
    await own(ids); await closeModals(pg); await nav(pg, 'train'); await sleep(500);
    await E(`S.wk=null;var b=document.createElement('button');b.dataset.act='wkplan';b.dataset.v='push';document.body.appendChild(b);b.click();b.remove();return !!S.wk`);
    await sleep(500);
    return E(`S.wk.list.forEach(function(id){var n=(S.wk.setsN&&S.wk.setsN[id])||8;var a=[];for(var i=0;i<n;i++)a.push(true);S.wk.sets[id]=a});var xp0=S.xp,tx0=S.dq.tx,n=S.wk.list.length;
      document.querySelectorAll('.coach,#cscr,[class*=coach]').forEach(function(e){if(getComputedStyle(e).position==='fixed')e.style.display='none'});
      var b=document.createElement('button');b.dataset.act='wkdone';document.body.appendChild(b);b.click();b.remove();return {exercises:n,xp:S.xp-xp0,dqTx:S.dq.tx-tx0,wk:S.wk}`);
  };
  const t0 = await train([]); await sleep(1500); await closeModals(pg);
  const t1 = await train(['r2_hilt']); await sleep(1500);
  await pg.shot('C:/Users/clvh/qa-wt/out/wchests/buffs_train_summary.png');
  await closeModals(pg);
  L('Training without / with Hilt', t0, t1);
  // the Phoenix Ash Vial's monthly freeze (30 s timer): own it, free a slot, wait
  await own(['r2_phoenix']); const f0 = await E(`S.freezes=0;delete S.r2frz;x.persist();return S.freezes`);
  await sleep(31000);
  L('Phoenix: freezes before / after 31 s, r2frz', f0, await E(`return [S.freezes,S.r2frz]`));
  L('page errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
