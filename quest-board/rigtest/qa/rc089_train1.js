// rc089 QA, Training W5 part 1: the old heavy save (gymlog 12, sessions 60) loads; Recent sessions and Personal bests; the graphs.
//   SORT=1 puts the seed's gymlog and sessions oldest first (the order the v0.88 code wrote; the seed file holds them newest first)
const fs = require('fs');
const L = require('./rc089_train_lib.js');
const { sleep } = L;
const TAG = process.env.SORT ? 'sorted' : 'seed';
const D = L.OUT + '/train/';
const log = (...a) => console.log(...a);
(async () => {
  const sd = L.seed('seed_heavy');
  if (process.env.SORT) { const s = JSON.parse(sd['quest-board']); Object.keys(s.gymlog).forEach((k) => s.gymlog[k].sort((a, b) => (a.d < b.d ? -1 : 1))); s.sessions.sort((a, b) => (a.d < b.d ? -1 : 1)); sd['quest-board'] = sd['qbsbx:data/users/sandbox/state'] = JSON.stringify(s); }
  const { br, pg } = await L.openGame(sd);
  log('windows on load (closed)', JSON.stringify((await L.settle(pg, null, 20)).seen));
  log('before: ', JSON.stringify(await L.S(pg, '{gymKeys:Object.keys(S.gymlog).length,gymN:Object.keys(S.gymlog).reduce(function(a,k){return a+S.gymlog[k].length},0),sess:S.sessions.length,benchFirst:S.gymlog.bench[0].d,benchLast:S.gymlog.bench[S.gymlog.bench.length-1].d,sessFirst:S.sessions[0].d,sessLast:S.sessions[S.sessions.length-1].d}')));
  await L.closeAll(pg);
  await L.nav(pg, 'train'); await sleep(1500);
  await L.closeAll(pg);
  await pg.shot(D + TAG + '_01_train_top.png');
  const secs = await pg.ev(`[].map.call(document.querySelectorAll('#app section.card'),function(s,i){return i+': '+(s.querySelector('.label')||{}).textContent})`);
  log('sections', JSON.stringify(secs));
  const recent = await pg.ev(`[].map.call(document.querySelectorAll('button.wkrow[data-act=wkinfo]'),function(b){return {s:b.dataset.s,t:b.innerText.replace(/\\s+/g,' '),hasI:!!b.querySelector('.wki'),iRight:(function(){var i=b.querySelector('.wki').getBoundingClientRect(),r=b.getBoundingClientRect();return Math.round(r.right-i.right)})()}})`);
  log('recent rows', JSON.stringify(recent));
  const pbs = await pg.ev(`[].map.call(document.querySelectorAll('button.wkbest'),function(b){return b.innerText.replace(/\\s+/g,' ')})`);
  log('PB rows (' + pbs.length + ')', JSON.stringify(pbs));
  await L.shotEl(pg, 'button.wkrow[data-act=wkinfo]', D + TAG + '_02_recent.png', 0, 0).catch(() => {});
  const recSec = await pg.ev(`(function(){var b=document.querySelector('button.wkrow[data-act=wkinfo]');var s=b.closest('section');s.id='qa_recent';var p=document.querySelector('button.wkbest');if(p)p.closest('section').id='qa_pb';return 1})()`);
  await L.shotEl(pg, '#qa_recent', D + TAG + '_02_recent.png');
  await L.shotEl(pg, '#qa_pb', D + TAG + '_03_pbs.png');
  // all Training text: dates and units
  const txt = await pg.ev(`document.getElementById('app').innerText`);
  const dates = [...new Set((txt.match(/\b\d{1,4}[\/\-.]\d{1,2}([\/\-.]\d{1,4})?\b/g) || []))];
  log('date-like strings on the Training screen', JSON.stringify(dates));
  log('number+unit strings', JSON.stringify([...new Set(txt.match(/\d[\d,.]*\s*(lbs?|kg|mi|km|min|reps|laps|floors|steps)\b/g) || [])].slice(0, 40)));
  log('bare "lb" (singular) occurrences', (txt.match(/\d\s*lb\b/g) || []).length);

  const graphInfo = () => pg.ev(`(function(){var m=document.querySelector('#layer .modal');if(!m)return null;var g=m.querySelector('svg.wkchart');var rg=[].map.call(m.querySelectorAll('[data-wkrg]'),function(b){return b.textContent+(b.classList.contains('on')?'*':'')});
    return {label:(m.querySelector('.label')||{}).textContent,h2:(m.querySelector('h2')||{}).textContent,ranges:rg.join('|'),pts:g?g.querySelectorAll('circle.wkdot').length:0,ringed:g?[].map.call(g.querySelectorAll('circle.wkdot.on'),function(c){return c.parentNode.querySelector('title').textContent}):[],
      xlabels:g?[].map.call(g.querySelectorAll('text.wkt'),function(t){return t.textContent}).join(' '):'',value:g?(g.querySelector('text.wkv')||{}).textContent:'',aria:g?g.getAttribute('aria-label').slice(0,160):'',empty:(m.querySelector('.wkempty')||{}).textContent||'',text:m.innerText.replace(/\\s+/g,' ').slice(0,300)}})()`);
  const ranges = async (tag) => {
    const out = {};
    for (const [k, name] of [['7d', '7 days'], ['1m', '1 month'], ['3m', '3 months'], ['6m', '6 months']]) {
      await L.tapEl(pg, '#layer .modal [data-wkrg="' + k + '"]'); await sleep(400);
      const gi = await graphInfo(); out[k] = gi;
      log('  range ' + name + ':', JSON.stringify({ ranges: gi.ranges, pts: gi.pts, ringed: gi.ringed, x: gi.xlabels, v: gi.value, empty: gi.empty, aria: gi.aria }));
      await pg.shot(D + TAG + '_' + tag + '_' + k + '.png');
    }
    await L.tapEl(pg, '#layer .modal [data-wkrg="1m"]'); await sleep(300);
    return out;
  };
  const gtap = async (sel, i, dx, dy) => { for (let k = 0; k < 4; k++) { await L.closeAll(pg); await L.tapEl(pg, sel, i, dx, dy); await sleep(700); const m = await L.modalInfo(pg); if (m.length === 1 && /wksum/.test(m[0].card)) return; log('  (another window was open: ' + JSON.stringify(m.map((x) => x.text.slice(0, 60))) + ', tapping again)'); } throw new Error('graph did not open ' + sel); };
  // 3. a recent session: tap the row (left side), then the i of another row
  await gtap('button.wkrow[data-act=wkinfo]', 0, 0.3, 0.5);
  let gi = await graphInfo();
  log('RECENT row 0 tapped (row body):', JSON.stringify(gi));
  await pg.shot(D + TAG + '_04_recent0_modal.png');
  await ranges('05_recent0');
  await L.closeAll(pg); await sleep(300);
  await gtap('button.wkrow[data-act=wkinfo] .wki', 2);
  gi = await graphInfo();
  log('RECENT row 2 tapped (its i):', JSON.stringify(gi));
  await pg.shot(D + TAG + '_06_recent2_i_modal.png');
  await L.closeAll(pg); await sleep(300);
  // 4. a personal best: tap the row, then the i of another
  await gtap('button.wkbest', 0, 0.3, 0.5);
  gi = await graphInfo();
  log('PB row 0 tapped (row body):', JSON.stringify(gi));
  await pg.shot(D + TAG + '_07_pb0_modal.png');
  await ranges('08_pb0');
  await L.closeAll(pg); await sleep(300);
  const nPb = pbs.length;
  await gtap('button.wkbest .wki', nPb - 1);
  gi = await graphInfo();
  log('PB last row tapped (its i):', JSON.stringify(gi));
  await pg.shot(D + TAG + '_09_pblast_i_modal.png');
  await L.closeAll(pg); await sleep(300);
  // the range is remembered for the session: pick 3 months, open another graph
  await gtap('button.wkbest', 1, 0.3, 0.5);
  await L.tapEl(pg, '#layer .modal [data-wkrg="3m"]'); await sleep(300);
  await L.closeAll(pg); await sleep(300);
  await gtap('button.wkrow[data-act=wkinfo]', 1, 0.3, 0.5);
  gi = await graphInfo();
  log('after choosing 3 months on a PB graph, a recent-session graph opens on:', gi.ranges, 'sessionStorage', await pg.ev('sessionStorage.getItem("qbWkRange")'));
  await L.tapEl(pg, '#layer .modal [data-wkrg="1m"]'); await sleep(300);
  await L.closeAll(pg);
  log('page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 6)));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
