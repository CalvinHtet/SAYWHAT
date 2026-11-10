// rc-0.89 QA, Wheel check 5: the odds. (a) 1,000,000 draws with the shipped weight table and the shipped draw loop (both cut out of
// the served app.js); (b) N real spins through the Wheel tab (fast result timer), tallied by what they paid.
const L = require('./rc089_wheel_lib.js');
(async () => {
  const src = await (await fetch(L.BASE + '/app.js')).text();
  const tab = src.slice(src.indexOf('var WHEEL=['), src.indexOf('var WCOL='));
  const fnS = src.indexOf('function spin(){'), body = src.slice(fnS, src.indexOf('var pz=WHEEL[idx]', fnS));
  const draw = body.slice(body.indexOf('var tot='));
  console.log('table:', tab.replace(/\s+/g, ' ').slice(0, 600));
  console.log('draw:', draw);
  const sim = new Function(tab + '; var cnt=WHEEL.map(function(){return 0}); for(var n=0;n<1e6;n++){' + draw + ' cnt[idx]++} return {WHEEL:WHEEL,W:WHEEL_W,cnt:cnt}')();
  const tot = sim.W.reduce((a, b) => a + b, 0);
  let ev = 0, evSim = 0;
  const rows = sim.WHEEL.map((w, i) => { ev += (w[1] || 0) * sim.W[i] / tot; evSim += (w[1] || 0) * sim.cnt[i] / 1e6; return { i, label: w[3] ? 'sliver' : w[0], weight: sim.W[i], expPct: +(100 * sim.W[i] / tot).toFixed(2), simPct: +(100 * sim.cnt[i] / 1e6).toFixed(3) }; });
  console.table(rows);
  console.log('weights total', tot, 'EV coins (coin slices only)', ev.toFixed(2), 'simulated', evSim.toFixed(2),
    'slivers', (100 * sim.W.filter((w, i) => sim.WHEEL[i][3]).reduce((a, b) => a + b, 0) / tot) + '%', 'freeze', (100 * sim.W[10] / tot) + '%');
  L.out(L.OUTW + '/w4.jsonl', { part: 'sim', rows, ev, evSim });

  const N = +(process.env.N || 10000);
  const { br, pg } = await L.open();
  await L.newPlayer(pg); await L.sleep(4000); await L.closeModals(pg);
  await L.nav(pg, 'wheel'); await L.sleep(800); await L.closeModals(pg);
  await pg.ev('window.__qaSpinDelay=0;window.__qaT={};window.__qaC=0;window.__qaN=0;1');
  const t0 = Date.now();
  for (let done = 0; done < N; done += 500) {
    await pg.ev(`(async function(){var x=window.__qb.x(),S=x.S,T=window.__qaT;
      for(var i=0;i<${Math.min(500, N - done)};i++){S.wheel='';S.freezes=0;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();
        var c0=S.coins,b=document.querySelector('[data-act=spin]');b.click();
        var k=0;while(document.querySelector('[data-act=spin]')===b&&k++<200)await new Promise(function(r){setTimeout(r,1)});
        var res=S.wheelRes,key=/ from [^(]+\\(/.test(res)?'sliver: item':/you own every piece/.test(res)?'sliver: 1,000 (pool empty)':res;
        T[key]=(T[key]||0)+1;window.__qaC+=S.coins-c0;window.__qaN++}
      document.querySelectorAll('#layer .pop').forEach(function(e){e.remove()});return 1})()`, 600000);
  }
  const T = await pg.ev('window.__qaT'), C = await pg.ev('window.__qaC'), n = await pg.ev('window.__qaN');
  const coinOnly = Object.keys(T).filter((k) => /^[0-9,]+ coins$/.test(k)).reduce((a, k) => a + (+k.replace(/[^0-9]/g, '')) * T[k], 0);
  console.log('real spins', n, 'in', Math.round((Date.now() - t0) / 1000) + 's');
  Object.keys(T).sort().forEach((k) => console.log('  ', k.padEnd(34), T[k], (100 * T[k] / n).toFixed(2) + '%'));
  console.log('mean coins per spin, coin slices only', (coinOnly / n).toFixed(1), '; all coins incl. 1,000 for empty-pool slivers', (C / n).toFixed(1));
  L.out(L.OUTW + '/w4.jsonl', { part: 'real', n, T, coinOnly: coinOnly / n, allCoins: C / n });
  console.log('errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
