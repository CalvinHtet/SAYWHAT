// rc-0.89 QA, Wheel checks 3 and 4 (+ seg 0 re-shot): slivers until the pool is empty, freeze with full slots, one spin per game day.
const L = require('./rc089_wheel_lib.js');
const CUM = [20, 21, 33, 34, 54, 55, 61, 62, 78, 79, 85, 86, 95, 96, 99, 100];
const LOG = L.OUTW + '/w3.jsonl';
const BIDS = ['hanga', 'y2k', 'over', 'rose', 'nc', 'alt', 'kp', 'sm', 'smk', 'gp', 'sp', 'bb', 'cr', 'km', 'oak', 'sv'];
// one spin, segment idx forced (first Math.random), no reset of S.wheel when keepDay
const SPIN = (idx, o = {}) => `(function(){var x=window.__qb.x(),S=x.S;${o.keepDay ? '' : "S.wheel='';"}${o.fr != null ? 'S.freezes=' + o.fr + ';' : ''}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();
  var lo=${idx ? CUM[idx - 1] : 0},hi=${CUM[idx]},orig=Math.random,n=0;Math.random=function(){return n++?orig():(lo+hi)/2/100};
  var b0={coins:S.coins,fr:S.freezes,owned:Object.keys(S.owned).filter(function(k){return S.owned[k]})};
  var btn=document.querySelector('[data-act=spin]');${o.force ? "if(btn)btn.disabled=false;" : ''}var dis=!btn||btn.disabled,label=btn&&btn.textContent;
  window.__qaPops.length=0;if(btn)btn.click();Math.random=orig;
  var nOwned=Object.keys(S.owned).filter(function(k){return S.owned[k]&&b0.owned.indexOf(k)<0});
  return {idx:${idx},disabledBefore:dis,label:label,res:S.wheelRes,dCoins:S.coins-b0.coins,dFr:S.freezes-b0.fr,newItems:nOwned,dayKey:S.wheel,prevOwned:b0.owned.length,rnd:n}})()`;
const settle = (pg) => pg.wait(`!!document.querySelector('[data-act=spin][disabled]')&&window.__qaPops.some(function(p){return p.txt.indexOf("Wheel:")===0})`, 6000)
  .then(() => pg.ev('(window.__qaPops.filter(function(p){return p.txt.indexOf("Wheel:")===0})[0]||{}).txt'));
// what the spec says the pool should be, worked out here (not with the game's own filter)
const POOL = `(function(){var x=window.__qb.x(),S=x.S,sx=S.char.sex,ids=${JSON.stringify(BIDS)};return x.SHOP.filter(function(it){var e=it[6]||{};
  return ids.indexOf(e.b)>=0&&/^a_(top|pants|shoes|acc|hat|back|mask)$/.test(it[1])&&!e.dungeon&&!(e.fo&&sx!=='f')&&!(e.mo&&sx!=='m')&&!S.owned[it[0]]}).map(function(it){return it[0]})})()`;
const ITEM = (id) => `(function(){var it=window.__qb.x().SHOP.filter(function(i){return i[0]==='${id}'})[0];return it&&{id:it[0],slot:it[1],name:it[2],b:it[6].b,fo:it[6].fo,mo:it[6].mo,dungeon:it[6].dungeon,gar:it[6].gar}})()`;
const BRN = { hanga: 'HANGANG', y2k: 'DIAL-UP', over: 'OVERPASS', rose: 'VENOM ROSE', nc: 'NICE COCK', alt: 'ALTITUDE', kp: 'KODE PINK', sm: 'SAYMØRE', smk: 'SMOKE BOMB', gp: 'GACHA POP', sp: 'SAVE POINT', bb: 'BARD & BLADE', cr: 'CHROME RAIN', km: 'KAIMANA', oak: 'OAKMONT', sv: 'SØLVBERG' };

async function exhaust(sex, limit) {
  const { br, pg } = await L.open();
  await L.newPlayer(pg, { sex }); await L.sleep(800); await L.closeModals(pg);
  await L.nav(pg, 'wheel'); await L.sleep(800); await L.closeModals(pg);
  await pg.ev('window.__qaSpinDelay=0;1');
  const pool0 = await pg.ev(POOL);
  const got = [], issues = [], brands = {}; let k = 0, allMsg = null;
  // some owned before: the first 5 of the pool bought by hand, to prove owned pieces are skipped
  const pre = pool0.slice(0, 5); await pg.ev(`(function(){var S=window.__qb.x().S;${JSON.stringify(pre)}.forEach(function(id){S.owned[id]=true});return 1})()`);
  while (k < limit) {
    const idx = [1, 3, 5, 7, 9, 11, 13, 15][k % 8]; k++;
    const r = await pg.ev(SPIN(idx)); r.pop = await settle(pg);
    if (r.newItems.length === 0) { allMsg = r; break; }
    const it = await pg.ev(ITEM(r.newItems[0]));
    const prob = [];
    if (r.newItems.length !== 1) prob.push('gave ' + r.newItems.length);
    if (got.indexOf(it.id) >= 0 || pre.indexOf(it.id) >= 0) prob.push('ALREADY OWNED');
    if (pool0.indexOf(it.id) < 0) prob.push('not in expected pool');
    if (!BRN[it.b]) prob.push('brand ' + it.b);
    if (it.dungeon) prob.push('dungeon');
    if ((it.fo && sex !== 'f') || (it.mo && sex !== 'm')) prob.push('does not fit ' + sex);
    if (r.pop.indexOf(it.name) < 0 || r.pop.indexOf(BRN[it.b]) < 0) prob.push('pop lacks name/brand: ' + r.pop);
    if (r.dCoins !== 0) prob.push('coins ' + r.dCoins);
    if (prob.length) issues.push({ k, id: it.id, prob });
    got.push(it.id); brands[it.b] = (brands[it.b] || 0) + 1;
  }
  const poolLeft = await pg.ev(POOL);
  const res = { sex, expectedPool: pool0.length, preOwned: pre.length, gifts: got.length, distinct: new Set(got).size, missedFromPool: pool0.filter((id) => pre.indexOf(id) < 0 && got.indexOf(id) < 0), poolLeft: poolLeft.length,
    brandsCovered: Object.keys(brands).length, perBrand: brands, issues: issues.slice(0, 10), nIssues: issues.length,
    afterEmpty: allMsg && { res: allMsg.res, dCoins: allMsg.dCoins, pop: allMsg.pop } };
  if (allMsg) { // one more sliver after empty, to see it keeps paying 1,000
    const r2 = await pg.ev(SPIN(15)); r2.pop = await settle(pg); res.afterEmpty2 = { res: r2.res, dCoins: r2.dCoins, items: r2.newItems.length };
  }
  console.log(JSON.stringify(res));
  L.out(LOG, Object.assign({ part: 'exhaust' }, res));
  console.log('errors', pg.errs.length, pg.errs.slice(0, 5));
  return { br, pg };
}

(async () => {
  const PART = process.env.PART || 'all';
  if (PART === 'all' || PART === 'm') { const { br } = await exhaust('m', 400); await br.close(); }
  if (PART === 'all' || PART === 'f') { const { br } = await exhaust('f', 60); await br.close(); }
  if (PART === 'all' || PART === 'misc') {
    const { br, pg } = await L.open();
    await L.newPlayer(pg); await L.sleep(4000); await L.closeModals(pg);
    await L.nav(pg, 'wheel'); await L.sleep(800); await L.closeModals(pg);
    // seg 0 again (the first run's shot was covered by the new player's How it works panel)
    await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(300);
    const rect = await pg.ev(`(function(){var r=document.querySelector('.wheelwrap').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()`);
    const clip = { x: rect[0] - 14, y: rect[1] - 16, width: rect[2] + 28, height: rect[3] + 30 };
    await pg.ev('window.__qaSpinDelay=6000;1');
    let r = await pg.ev(SPIN(0)); await L.sleep(4100); await pg.shot(L.OUTW + '/w3_seg00_300.png', clip); r.pop = await settle(pg);
    console.log('seg0', JSON.stringify(r));
    await pg.ev('window.__qaSpinDelay=0;1');
    // freeze: slots full (3 for this player) then not full
    const mf = await pg.ev(`(function(){var S=window.__qb.x().S;return 3+(S.owned&&S.owned.bf_freeze?1:0)})()`);
    r = await pg.ev(SPIN(10, { fr: mf })); r.pop = await settle(pg); console.log('freeze full', mf, JSON.stringify(r)); L.out(LOG, { part: 'freezeFull', r });
    r = await pg.ev(SPIN(10, { fr: mf - 1 })); r.pop = await settle(pg); console.log('freeze 2/3', JSON.stringify(r)); L.out(LOG, { part: 'freezeNotFull', r });
    // a sliver with the Closet built: the wording
    await pg.ev(`(function(){window.__qbRooms.open('closet',1);return 1})()`); await L.sleep(300); await L.closeModals(pg); await L.nav(pg, 'wheel'); await L.sleep(500);
    r = await pg.ev(SPIN(1)); r.pop = await settle(pg); console.log('sliver w/ closet', JSON.stringify(r));
    // check 4: one spin per game day (5 am)
    const setT = (Y, M, D, h, m, s = 0) => pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${Date.UTC(Y, M - 1, D, h + 8, m, s)}-real;var x=window.__qb.x();document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();
      var b=document.querySelector('[data-act=spin]');return {now:new Date().toString().slice(0,24),btn:b&&b.textContent,disabled:b&&b.disabled,S_wheel:x.S.wheel}})()`);
    const steps = [];
    const st = async (lab, Y, M, D, h, m, s) => { const v = await setT(Y, M, D, h, m, s); steps.push(Object.assign({ lab }, v)); return v; };
    await st('Thu 11-12 04:58, before spin', 2026, 11, 12, 4, 58);
    r = await pg.ev(SPIN(2, { keepDay: 1 })); r.pop = await settle(pg); steps.push({ lab: 'spin at 04:58', dayKey: r.dayKey, res: r.res, disabledBefore: r.disabledBefore });
    await st('04:59:50 same night', 2026, 11, 12, 4, 59, 50);
    r = await pg.ev(SPIN(2, { keepDay: 1, force: 1 })); await L.sleep(300); steps.push({ lab: 'forced click on the disabled button at 04:59:50', dCoins: r.dCoins, res: r.res, pops: await pg.ev('window.__qaPops.length') });
    await st('05:00:10', 2026, 11, 12, 5, 0, 10);
    r = await pg.ev(SPIN(2, { keepDay: 1 })); r.pop = await settle(pg); steps.push({ lab: 'spin at 05:00:10', dayKey: r.dayKey, dCoins: r.dCoins, disabledBefore: r.disabledBefore });
    await st('23:59', 2026, 11, 12, 23, 59);
    r = await pg.ev(SPIN(2, { keepDay: 1, force: 1 })); await L.sleep(300); steps.push({ lab: 'forced click at 23:59', dCoins: r.dCoins });
    await st('Fri 11-13 04:59:50', 2026, 11, 13, 4, 59, 50);
    r = await pg.ev(SPIN(2, { keepDay: 1, force: 1 })); await L.sleep(300); steps.push({ lab: 'forced click at Fri 04:59:50', dCoins: r.dCoins });
    await st('Fri 11-13 05:00:05', 2026, 11, 13, 5, 0, 5);
    r = await pg.ev(SPIN(2, { keepDay: 1 })); r.pop = await settle(pg); steps.push({ lab: 'spin Fri 05:00:05', dayKey: r.dayKey, dCoins: r.dCoins, disabledBefore: r.disabledBefore });
    // a reload keeps the spent spin
    await pg.ev('window.__qb.x().persist();1');
    steps.forEach((s) => console.log('day', JSON.stringify(s))); L.out(LOG, { part: 'day', steps });
    await pg.ev(`document.querySelector('[data-act=spin]').scrollIntoView({block:'center'})`); await L.sleep(300);
    await pg.shot(L.OUTW + '/w3_come_back_tomorrow.png');
    console.log('errors', pg.errs.length, pg.errs.slice(0, 5));
    await br.close();
  }
  process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
