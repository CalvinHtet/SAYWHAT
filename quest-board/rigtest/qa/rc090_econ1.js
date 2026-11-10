// rc-0.90 economy QA, part 1 (static data): level curve 4 (cum/need 1-100), late room prices vs the econPrice rule,
// bigger upgrades earn more (income share per upgrade, vs v0.88's room totals). Read-only; nothing is bought or saved.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_econ1.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const NEW = process.env.BASE || 'http://127.0.0.1:8816', OLD = process.env.OLD || 'http://127.0.0.1:8810';
const OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/econ/';
const HUGE = { r_x1: 1500, r_x2: 3000, r_patio: 2000, r_bar: 2500, r_noir: 2500, r_t3: 1500, g_x1: 1200, g_x2: 2500, g_green1: 1500, g_green2: 4000, g_fount: 1500,
  t_aud: 2500, t_wing: 2000, t_bar: 1500, au_scr2: 1500, au_imax: 4000, au_proj2: 2000, au_recline: 1500, bd_ward2: 1000, bd_lair: 2500, bd_patio: 1500 };
(async () => {
  const br = await browser();
  const res = {};
  for (const [tag, base] of [['new', NEW], ['old', OLD]]) {
    const pg = await br.page({ fresh: true });
    await pg.go(base + '/');
    await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000);
    await sleep(1500);
    res[tag] = await pg.ev(`(function(HUGE){var x=window.__qb.x(),E=window.__qbEcon&&__qbEcon.ECON,A=x.ADDONS,T=x.ROOMT,o={};
      o.cum=[];for(var L=1;L<=101;L++)o.cum.push(x.cum(L));
      o.rooms={};Object.keys(A).forEach(function(k){o.rooms[k]=(A[k]||[]).map(function(a){var e=a[3]||{};return {id:a[0],n:a[1],c:a[2],p:e.p||0,xp:e.xp||0,ret:!!e.retired,fixed:!!e.fixed,opens:e.opens||'',g:e.g||'',decor:!!e.decor}})});
      o.rt={};Object.keys(T).forEach(function(k){o.rt[k]={name:T[k].name,coin:T[k].coin||0,food:T[k].food||'',cost:T[k].cost||0,rate:T[k].rate||0}});
      o.E=E?{phase:E.phase,tier:E.tier,lateK:E.lateK,grandK:E.grandK,opener:E.opener,ramp:E.ramp,earnW:E.earnW,kindOf:E.kindOf}:null;
      return o})(${JSON.stringify(HUGE)})`);
    res[tag].errs = pg.errs.slice();
    await pg.close();
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(OUT + 'econ1_raw.json', JSON.stringify(res));
  const N = res.new, E = N.E, lines = [];
  const log = (s) => { lines.push(s); console.log(s); };
  // ---- 1. curve ----
  const formula = (L) => Math.round(L < 6 ? 20 + 115 * (L - 1) / 5 : 135 + 0.315 * Math.pow(L - 6, 2));
  let bad = [], tbl = [];
  for (let L = 1; L <= 100; L++) { const d = N.cum[L] - N.cum[L - 1]; tbl.push(L + ':' + d); if (d !== formula(L)) bad.push(L + ' game ' + d + ' formula ' + formula(L)); }
  log('CURVE need(L) = cum(L+1)-cum(L), L=1..100:');
  for (let i = 0; i < 100; i += 10) log('  ' + tbl.slice(i, i + 10).join('  '));
  log('  mismatches vs doc formula: ' + (bad.length ? bad.join('; ') : 'none'));
  const nd = (L) => N.cum[L] - N.cum[L - 1];
  log('  anchors: 1->2 ' + nd(1) + ', 5->6 ' + nd(5) + ', 6->7 ' + nd(6) + ', 10 ' + nd(10) + ', 20 ' + nd(20) + ', 40 ' + nd(40) + ', 60 ' + nd(60) + ', 80 ' + nd(80) + ', 99 ' + nd(99) + ', 100 ' + nd(100));
  log('  cum(40)=' + N.cum[39] + ' cum(100)=' + N.cum[99] + ' (old v0.88 cum(100)=' + res.old.cum[99] + ')');
  // ---- 2. prices ----
  const ph = (k) => E.phase[k] || 1, late = (k) => 1 + E.lateK * (ph(k) - 1), r50 = (p) => Math.round(p / 50) * 50;
  log('\nPRICES (late rooms): actual vs rule candidates');
  const late_rooms = ['restaurant', 'boba', 'dessert', 'skybar', 'rooftop', 'mall', 'theater', 'auditorium', 'arcade', 'rhythm', 'vr', 'bowling', 'karaoke', 'club', 'garden', 'bedroom', 'gameroom'];
  let nomatch = [], total = 0, cnt = 0;
  Object.keys(N.rooms).forEach((k) => {
    const L = N.rooms[k].filter((a) => a.c > 0 && !a.ret); if (!N.rt[k]) return;
    L.forEach((a, i) => {
      total += a.c; cnt++;
      if (a.fixed) return;
      const ramp = 1 + E.ramp * (L.length > 1 ? i / (L.length - 1) : 0), c = [];
      if (a.opens) c.push(['opener', r50(E.opener * ph(a.opens) * late(a.opens))]);
      else {
        Object.keys(E.tier).forEach((t) => c.push([t, r50(E.tier[t] * ph(k) * ramp * late(k))]));
        if (HUGE[a.id]) c.push(['grand(HUGE)', r50(HUGE[a.id] * E.grandK * ph(k) * late(k))]);
      }
      const m = c.filter((q) => q[1] === a.c);
      if (!m.length) nomatch.push(k + ':' + a.id + ' "' + a.n + '" ' + a.c + ' (i ' + i + '/' + L.length + ', min grand base ' + Math.round(a.c / (E.grandK * ph(k) * late(k))) + ')');
      a.kind = m.length ? m.map((q) => q[0]).join('|') : '?';
    });
  });
  log('  all non-retired room upgrades: ' + cnt + ', total ' + total.toLocaleString());
  const lots = ['garden', 'boba', 'theater', 'mall', 'club', 'restaurant'].map((k) => k + ' ' + N.rt[k].cost);
  log('  lots/openers: ' + lots.join(', ') + '; lots sum (garden,boba,theater,mall,club) ' + ['garden', 'boba', 'theater', 'mall', 'club'].reduce((s, k) => s + N.rt[k].cost, 0));
  const au = N.rooms.auditorium.filter((a) => /imax/i.test(a.n));
  log('  IMAX: ' + au.map((a) => a.id + ' "' + a.n + '" ' + a.c + ' kind ' + a.kind).join('; '));
  ['bedroom', 'restaurant', 'boba', 'mall', 'theater', 'auditorium', 'club'].forEach((k) => {
    const L = N.rooms[k].filter((a) => a.c > 0 && !a.ret);
    log('  ' + k + ' (phase ' + ph(k) + ', late x' + late(k) + ', n ' + L.length + '): ' + L.slice(0, 4).concat(L.slice(-3)).map((a) => a.id + '=' + a.c + '[' + a.kind + ']').join(', '));
  });
  log('  upgrades matching NO rule candidate (non-fixed): ' + nomatch.length);
  nomatch.forEach((s) => log('    ' + s));
  log('  fixed:1 upgrades: ' + Object.keys(N.rooms).reduce((a, k) => a.concat(N.rooms[k].filter((x) => x.fixed && !x.ret).map((x) => k + ':' + x.id + '=' + x.c)), []).join(', '));
  // ---- 4. earning shares ----
  log('\nINCOME SHARE per upgrade (e.p), rooms that earn; total vs v0.88');
  Object.keys(N.rooms).forEach((k) => {
    const T = N.rt[k]; if (!T || !(T.coin || T.food)) return;
    const L = N.rooms[k].filter((a) => a.p > 0 && !a.ret && !a.opens), O = (res.old.rooms[k] || []).filter((a) => a.p > 0 && !a.ret && !a.opens);
    const sum = (l) => Math.round(l.reduce((s, a) => s + a.p, 0) * 1000) / 1000;
    const ps = [...new Set(L.map((a) => a.p))].sort((a, b) => a - b);
    log('  ' + k + ' coin ' + T.coin + '/h food ' + (T.food || '-') + ': ' + L.length + ' earners, total p ' + sum(L) + ' (v0.88 ' + sum(O) + ', ' + O.length + ' earners); distinct p ' + ps.join(','));
  });
  const A = N.rooms.auditorium.filter((a) => !a.ret), AO = res.old.rooms.auditorium.filter((a) => !a.ret);
  log('  auditorium coin/h base ' + N.rt.auditorium.coin + ' (v0.88 ' + res.old.rt.auditorium.coin + '):');
  A.forEach((a) => { const o = AO.find((z) => z.id === a.id); log('    ' + a.id.padEnd(12) + ' ' + String(a.c).padStart(6) + '  p ' + a.p + ' (+' + Math.round(a.p * N.rt.auditorium.coin * 10) / 10 + '/h at 100%)  kind ' + a.kind + (o ? '  | v0.88 p ' + o.p + ' price ' + o.c : '')); });
  log('\npage errors new ' + JSON.stringify(N.errs) + ' old ' + JSON.stringify(res.old.errs.length));
  fs.writeFileSync(OUT + 'econ1.txt', lines.join('\n'));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
