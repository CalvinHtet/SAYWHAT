// rc-0.89 QA, drops check 6: the one calendar, from __qbDrops.mine(t) and __qbDrops.back(t) (times in ms; Pacific = UTC-8 until 2027-03-14).
const L = require('./rc089_wheel_lib.js');
const PT = (Y, M, D, h = 0, m = 0, s = 0) => Date.UTC(Y, M - 1, D, h + 8, m, s); // PST wall time
const PDT = (Y, M, D, h = 0, m = 0) => Date.UTC(Y, M - 1, D, h + 7, m);
(async () => {
  const { br, pg } = await L.open();
  await L.newPlayer(pg); await L.sleep(500); await L.closeModals(pg);
  const shop = (t) => pg.ev(`(function(t){var m=__qbDrops.mine(t),b=__qbDrops.back(t);return {live:m.live.map(function(x){return x.id}),back:b?b.id:null,vault:m.vault.map(function(x){return x.id}),next:m.next&&(m.next.id+'@'+m.next.start)}})(${t})`);
  const fmt = (s) => s.live.join('+') + (s.back ? ' | back ' + s.back : '');
  const res = {};
  // (a) the same Shop whatever S.shopDay / S.shopKeep say
  const times = [PT(2026, 11, 10, 12), PT(2026, 11, 13, 8), PT(2026, 11, 18, 9), PT(2026, 12, 9, 9), PT(2027, 1, 27, 9), PT(2027, 2, 24, 9)];
  const same = await pg.ev(`(function(ts){var S=__qb.x().S,o=[];var variants=[[undefined,undefined],['2026-11-10',undefined],['2026-12-01',['y2k','over']],['2027-03-01',undefined],['2026-11-01',['nc']]];
    var key0=S.shopDay,keep0=S.shopKeep;
    ts.forEach(function(t){var outs=variants.map(function(v){S.shopDay=v[0];S.shopKeep=v[1];var m=__qbDrops.mine(t),b=__qbDrops.back(t);return JSON.stringify([m,b])});o.push(outs.every(function(x){return x===outs[0]}))});
    S.shopDay=key0;S.shopKeep=keep0;return o})(${JSON.stringify(times)})`);
  console.log('(a) same Shop for 5 shopDay/shopKeep variants at 6 moments:', JSON.stringify(same));
  res.same = same;
  // (b) the named moments
  const pts = [
    ['Mon 11-09 12:00 (before cal0)', PT(2026, 11, 9, 12)], ['Tue 11-10 00:00', PT(2026, 11, 10, 0)], ['Tue 11-10 12:00', PT(2026, 11, 10, 12)],
    ['Fri 11-13 07:59', PT(2026, 11, 13, 7, 59)], ['Fri 11-13 07:59:59', PT(2026, 11, 13, 7, 59, 59)], ['Fri 11-13 08:00', PT(2026, 11, 13, 8)],
    ['Mon 11-16 07:59', PT(2026, 11, 16, 7, 59)], ['Mon 11-16 08:00', PT(2026, 11, 16, 8)],
    ['Wed 11-18 07:59', PT(2026, 11, 18, 7, 59)], ['Wed 11-18 08:00', PT(2026, 11, 18, 8)], ['Thu 11-19 07:59', PT(2026, 11, 19, 7, 59)],
    ['Thu 11-19 08:00', PT(2026, 11, 19, 8)], ['Thu 11-19 08:01', PT(2026, 11, 19, 8, 1)],
    ['Wed 12-09 09:00', PT(2026, 12, 9, 9)], ['Wed 2027-01-27 09:00', PT(2027, 1, 27, 9)],
    ['Mon 2027-03-15 07:59 PDT', PDT(2027, 3, 15, 7, 59)], ['Mon 2027-03-15 08:00 PDT', PDT(2027, 3, 15, 8)]];
  res.points = [];
  for (const [lab, t] of pts) { const s = await shop(t); res.points.push([lab, s]); console.log('(b)', lab.padEnd(28), fmt(s).padEnd(30), 'next', s.next); }
  // (c) the whole schedule: every minute that the Shop changes, scanned hour by hour then narrowed to the minute, 2026-11-09 .. 2027-04-30
  const tr = await pg.ev(`(function(a,b){var f=function(t){var m=__qbDrops.mine(t),k=__qbDrops.back(t);return m.live.map(function(x){return x.id}).join('+')+(k?' | back '+k.id:'')};
    var out=[],prev=f(a),t=a;for(t=a+36e5;t<=b;t+=36e5){var c=f(t);if(c!==prev){var lo=t-36e5,hi=t;while(hi-lo>6e4){var mid=lo+Math.floor((hi-lo)/2/6e4)*6e4;if(mid===lo)mid+=6e4;if(f(mid)===prev)lo=mid;else hi=mid}
      var d=new Date(hi),p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);
      out.push([p,c]);prev=c}}return out})(${PT(2026, 11, 9, 0)},${PT(2027, 4, 30, 0)})`, 300000);
  res.transitions = tr;
  console.log('(c) every change, Pacific time:');
  tr.forEach((x) => console.log('   ', x[0].padEnd(28), x[1]));
  const off8 = tr.filter((x) => !/, 08:00$/.test(x[0]));
  console.log('changes not at 08:00 PT:', off8.length, JSON.stringify(off8.slice(0, 5)));
  // (d) the drop order and dates (first 2 rounds)
  const order = await pg.ev(`(function(){var o=[],d=__qbDrops.days('${'2026-11-10'}',34);for(var j=0;j<34;j++)o.push(j+' '+__qbDrops.order(j)+' '+d[j]);return o})()`);
  console.log('(d) order:', order.join(' | '));
  res.order = order;
  // (e) the live state() under __qbShift agrees with mine+back
  const agree = [];
  for (const [lab, t] of pts.filter((p) => !/before/.test(p[0]))) {
    const v = await pg.ev(`(function(t){var real=Date.now()-(window.__qbShift||0);window.__qbShift=t-real;var s=__qbDrops.state();window.__qbShift=0;return s.live.map(function(x){return (x.back?'back ':'')+x.id}).sort().join(',')})(${t})`);
    const s = await shop(t); const exp = s.live.concat(s.back && s.live.indexOf(s.back) < 0 ? ['back ' + s.back] : []).sort().join(',');
    agree.push([lab, v === exp, v]);
  }
  console.log('(e) state() under __qbShift == mine+back:', agree.every((a) => a[1]), JSON.stringify(agree.filter((a) => !a[1])));
  // (f) does a Wednesday brand ever equal a live brand, repeat two Wednesdays running, or drop again right after?
  const weds = await pg.ev(`(function(){var o=[];for(var k=0;k<24;k++){var t=${PT(2026, 11, 18, 9)}+k*7*864e5,m=__qbDrops.mine(t),b=__qbDrops.back(t);o.push([new Date(t-8*36e5).toISOString().slice(0,10),b&&b.id,m.live.map(function(x){return x.id}).join('+'),m.next&&m.next.id])}return o})()`);
  console.log('(f) Wednesdays: date, back, live, next drop');
  weds.forEach((w) => console.log('   ', w.join('  ')));
  res.weds = weds;
  L.fs.writeFileSync(L.OUTD + '/d1_calendar.json', JSON.stringify(res, null, 1));
  console.log('errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
