// w-unlock (W51/W52) prep: what a room costs to get (ROOMT cost/price/lot, opener upgrades, buildings) next to what the reset refunds.
//   BASE=http://127.0.0.1:8817 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wunlock_probe.js
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true, phone: false, width: 800, height: 600 });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && window.__qb.x().ADDONS)', 120000); await sleep(1500);
  const r = await pg.ev(`(function(){var x=window.__qb.x(),T=x.ROOMT,A=x.ADDONS,o={rooms:[]};
    Object.keys(T).forEach(function(k){var t=T[k],op=[];Object.keys(A).forEach(function(rk){(A[rk]||[]).forEach(function(a){if(a[3]&&a[3].opens===k)op.push(rk+'.'+a[0]+'='+a[2])})});
      o.rooms.push(k+' cost='+t.cost+(t.price!=null?' price='+t.price:'')+(t.lot!=null?' lot='+t.lot:'')+(op.length?' openedBy '+op.join(','):'')+' bld='+JSON.stringify((window.ROOMCELL||{})[k]||null))});
    o.econKeys=Object.keys(window.ECON||{}).join(',');o.unlock=JSON.stringify((window.ECON||{}).unlock||null).slice(0,1500);
    o.hooks=Object.keys(window).filter(function(k){return /^__qb/.test(k)}).join(',');return o})()`);
  console.log(r.rooms.join('\n')); console.log('hooks', r.hooks); console.log('ECON keys', r.econKeys); console.log('unlock', r.unlock); console.log('errs', pg.errs);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
