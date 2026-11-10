// rc-0.89 QA, drops check 8: the brand splashes. Fresh saves, the Closet built through __qbRooms.open('closet'), the clock moved with
// __qbShift. Every splash that opens is shot, then closed with its X; anything else that pops up is logged and removed.
//   SC=A|B|C (default all)
const L = require('./rc089_wheel_lib.js');
const LOG = L.OUTD + '/d3_splash.jsonl';
const setT = (pg, Y, M, D, h, m = 0, s = 0) => pg.ev(`(function(){var real=Date.now()-(window.__qbShift||0);window.__qbShift=${Date.UTC(Y, M - 1, D, h + 8, m, s)}-real;try{window.__qb.x().render()}catch(e){}return new Date().toString().slice(0,24)})()`);
async function drain(pg, tag, o = {}) {
  const quiet = o.quiet || 9000, max = o.max || 90000, seq = [], others = []; let multi = 0, last = Date.now(); const t0 = Date.now();
  while (Date.now() - last < quiet && Date.now() - t0 < max) {
    const st = await pg.ev(`(function(){var b=document.querySelectorAll('.bsplash');var o=[];document.querySelectorAll('#layer .modal').forEach(function(m){if(!m.querySelector('.bsplash')){o.push((m.textContent||'').replace(/\\s+/g,' ').slice(0,100));m.remove()}});
      return {o:o,n:b.length,name:b[0]&&(b[0].querySelector('.blg b')||{}).textContent,id:b[0]&&(b[0].querySelector('[data-act=bsgo]')||{dataset:{}}).dataset.b}})()`);
    if (st.o.length) { others.push(...st.o); last = Date.now(); }
    if (st.n > 1) multi++;
    if (st.n >= 1) {
      await L.sleep(900);
      const f = `${tag}_${seq.length + 1}_${st.id}.png`; await pg.shot(L.OUTD + '/' + f);
      seq.push(st.name);
      await pg.ev(`(function(){var b=document.querySelector('.bsplash');var x=b&&b.querySelector('.mx');if(x)x.click();else{var m=b&&b.closest('.modal');if(m)m.remove()}return 1})()`);
      last = Date.now();
    }
    if (st.n === 0 && (await pg.ev('document.querySelectorAll(".bsplash").length')) === 0) { /* nothing */ }
    // logged others (removed in the probe)
    await L.sleep(400);
  }
  const seen = await pg.ev('JSON.stringify(window.__qb.x().S.brandSeen||{})');
  const r = { tag, splashes: seq, moreThanOneAtOnce: multi, otherModals: others, brandSeen: seen, at: await pg.ev('new Date().toString().slice(0,24)') };
  console.log(JSON.stringify(r)); L.out(LOG, r); return r;
}
const closet = (pg) => pg.ev(`(function(){window.__qbRooms.open('closet');document.querySelectorAll('#layer .modal').forEach(function(m){if(!m.querySelector('.bsplash'))m.remove()});return window.__qb.x().S.base.slots.filter(Boolean).map(function(r){return r.t}).join(',')})()`);
const sc = process.env.SC || 'ABC';
(async () => {
  if (sc.indexOf('A') >= 0) {
    const { br, pg } = await L.open();
    await L.newPlayer(pg); await L.sleep(3000); await L.closeModals(pg);
    await pg.ev('(function(){var x=window.__qb.x();x.S.brandSeen={hanga:1};x.persist();return 1})()');
    await drain(pg, 'A0_noCloset', { quiet: 7000 });
    console.log('rooms', await closet(pg), 'shopDay', await pg.ev('window.__qb.x().S.shopDay'));
    await drain(pg, 'A1_closet');
    await pg.ev('window.__qb.x().persist();1'); await L.sleep(500);
    await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await L.sleep(1500);
    await drain(pg, 'A2_reload');
    await setT(pg, 2026, 11, 13, 8, 0, 30); await drain(pg, 'A3_fri1113');
    await setT(pg, 2026, 11, 16, 9); await drain(pg, 'A4_mon1116');
    await setT(pg, 2026, 11, 18, 9); await drain(pg, 'A5_wed1118');
    await setT(pg, 2026, 11, 19, 8, 1); await drain(pg, 'A6_thu1119');
    await setT(pg, 2026, 11, 25, 9); await drain(pg, 'A7_wed1125');
    console.log('A errors', pg.errs.length, pg.errs.slice(0, 5));
    await br.close();
  }
  if (sc.indexOf('B') >= 0) {
    const { br, pg } = await L.open();
    console.log('B clock', await setT(pg, 2026, 11, 16, 9));
    await L.newPlayer(pg); await L.sleep(3000); await L.closeModals(pg);
    await drain(pg, 'B0_noCloset', { quiet: 6000 });
    console.log('rooms', await closet(pg));
    await drain(pg, 'B1_mon1116');
    console.log('B errors', pg.errs.length, pg.errs.slice(0, 5));
    await br.close();
  }
  if (sc.indexOf('C') >= 0) {
    const { br, pg } = await L.open();
    console.log('C clock', await setT(pg, 2026, 12, 9, 9));
    await L.newPlayer(pg); await L.sleep(3000); await L.closeModals(pg);
    console.log('rooms', await closet(pg));
    await drain(pg, 'C1_wed1209');
    await setT(pg, 2027, 1, 27, 9); await drain(pg, 'C2_wed0127');
    console.log('C errors', pg.errs.length, pg.errs.slice(0, 5));
    await br.close();
  }
  process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
