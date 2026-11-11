// w-unlock (W51, Cal's table): each room's unlock checked at its edge on a fresh level-1 save. One upgrade short: still closed;
// at the share: open. Rooms are added in the table's order, as a player would open them. Then the room windows and the Goals list
// of a mid-game player are read for totals ("N / M", "of M" on upgrade steps) and for names of rooms the player doesn't have.
//   BASE=http://127.0.0.1:8817 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wunlock_order.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || require('os').tmpdir() + '/qa-out/wunlock/order/';
fs.mkdirSync(OUT, { recursive: true });
const ORDER = ['closet', 'patio', 'gameroom', 'garden', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'mall', 'theater', 'auditorium', 'arcade', 'rhythm', 'vr', 'bowling', 'karaoke', 'club'];
const LIB = `var x=window.__qb.x(),S=x.S,A=x.ADDONS,T=x.ROOMT,E=window.__qbEcon.ECON,Q=window.__qbStory;
  function find(t){return S.base.slots.filter(function(r){return r&&r.t===t})[0]}
  function slot(t){var r=find(t);if(r)return r;r={t:t,a:{},st:0,pend:0};var i=S.base.slots.indexOf(null);if(i<0)S.base.slots.push(r);else S.base.slots[i]=r;return r}
  function cnt(t){return (A[t]||[]).filter(function(a){var e=a[3]||{};return !e.retired&&!e.opens&&!e.trophy})}
  function setN(t,n){var r=slot(t),k={};Object.keys(r.a||{}).forEach(function(id){if((A[t]||[]).some(function(a){return a[0]===id&&(a[3]||{}).opens}))k[id]=1});cnt(t).slice(0,n).forEach(function(a){k[a[0]]=1});r.a=k}
  function share(list,n){var all=[];list.forEach(function(t){(A[t]||[]).forEach(function(a){if(!(a[3]||{}).retired)all.push([t,a[0]])})});list.forEach(function(t){if(find(t))find(t).a={}});
    all.slice(0,n).forEach(function(p){var r=find(p[0]);if(r)r.a[p[1]]=1});return all.length}
  function step(t){return Q.steps.filter(function(s){return s.room===t&&s.how!=="never"})[0]}
  function ok(t){var s=step(t);return s?!!s.gate():!!Q.allows(t)}`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(2500);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Order',sex:'f'});x.persist();x.render();return 1})()`);
  await pg.wait('!!(window.__qbEcon && window.__qbStory && document.querySelector(".nav button[data-v=board]"))', 60000); await sleep(2000);
  const R = await pg.ev(`(function(ORDER){${LIB}
    var out=[],lv=window.__qb.x().effLvl?window.__qb.x().effLvl():null;
    ORDER.forEach(function(t){var u=E.unlock[t];if(!u){out.push({t:t,rule:'none in ECON.unlock'});return}var o={t:t,rule:JSON.stringify(u)};
      if(u.at){var tot=cnt(u.at).length,need=Math.ceil(tot*u.pct);o.of=u.at+' '+tot+' countable';o.need=need;setN(u.at,need-1);o.before=ok(t);setN(u.at,need);o.after=ok(t);setN(u.at,tot)}
      else if(u.loft){var tot2=share(E.loftCore,0),n2=Math.ceil(tot2*u.loft);o.of='Loft core '+E.loftCore.join('+')+' '+tot2;o.need=n2;share(E.loftCore,n2-1);o.before=ok(t);share(E.loftCore,n2);o.after=ok(t);share(E.loftCore,tot2)}
      else if(u.earn){var g=slot(u.earn);o.of=u.earn+' sales';o.need=u.coins;g.earn=u.coins-1;o.before=ok(t);g.earn=u.coins;o.after=ok(t)}
      else if(u.noir){var rr=slot('restaurant');delete rr.a.r_noir;o.of='Restaurant r_noir';o.before=ok(t);rr.a.r_noir=1;o.after=ok(t)}
      else if(u.plaza){var P=E.plazaAll;P.forEach(function(p){slot(p)});var tot3=share(P,0),n3=Math.ceil(tot3*u.plaza);
        var miss=P[P.length-1],keep=find(miss);share(P,tot3);S.base.slots[S.base.slots.indexOf(keep)]=null;o.allButOneRoomFull=ok(t);slot(miss);
        o.of='Kode Plaza '+P.join('+')+' '+tot3;o.need=n3;share(P,n3-1);o.before=ok(t);share(P,n3);o.after=ok(t);share(P,tot3)}
      o.pass=o.before===false&&o.after===true&&(o.allButOneRoomFull===undefined||o.allButOneRoomFull===false);
      out.push(o);slot(t)});
    return {lv:lv,rows:out}})(${JSON.stringify(ORDER)})`, 60000);
  console.log('level during the walk:', R.lv);
  R.rows.forEach((o) => console.log(`${o.pass ? 'ok  ' : 'BAD '} ${o.t.padEnd(10)} ${o.rule.padEnd(36)} ${o.of || ''} need ${o.need}: one short ${o.before}, at the share ${o.after}${o.allButOneRoomFull !== undefined ? ', every Plaza upgrade but one room missing ' + o.allButOneRoomFull : ''}`));
  // the room windows and Goals of a mid-game player: Bedroom at 60% (Closet and Patio open), Closet at 2, Patio at 1
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbEcon && document.querySelector(".nav button[data-v=board]"))', 120000); await sleep(1500);
  const names = await pg.ev(`(function(){${LIB}
    S.base.slots=S.base.slots.map(function(r,i){return i===0?r:null});setN('bedroom',0);var b=find('bedroom');
    (A.bedroom||[]).forEach(function(a){if((a[3]||{}).opens==='closet'||(a[3]||{}).opens==='patio')b.a[a[0]]=1});
    setN('bedroom',Math.ceil(cnt('bedroom').length*.6));setN('closet',2);setN('patio',1);S.coins=50000;x.persist();x.render();
    var have=S.base.slots.filter(Boolean).map(function(r){return r.t});return Object.keys(T).filter(function(k){return have.indexOf(k)<0}).map(function(k){return T[k].name})})()`);
  const scan = (label, text) => {
    const tot = (text.match(/\b\d+\s*(\/|of)\s*\d[\d,]*\b/g) || []).filter((s) => !/coins/.test(s));
    const nm = names.filter((n) => n && n.length > 2 && new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(text));
    console.log(`${label}: totals ${tot.length ? JSON.stringify(tot) : 'none'}; names of rooms not owned ${nm.length ? JSON.stringify(nm) : 'none'}`);
    return [tot, nm];
  };
  for (const t of ['bedroom', 'closet', 'patio']) {
    await pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});window.__qbRooms.show();return 1})()'); await sleep(500);
    await pg.ev(`(function(){var b=document.querySelector('#layer [data-qr=view][data-t="${t}"]');b&&b.click();return !!b})()`); await sleep(900);
    const txt = await pg.ev('(function(){var m=document.querySelector("#layer .modal");return m?m.innerText:""})()');
    fs.writeFileSync(OUT + `room_${t}.txt`, txt); await pg.shot(OUT + `room_${t}.png`);
    const lines = txt.split('\n').filter((l) => /bought|upgrades|opens|Coming|More |Something/i.test(l)).slice(0, 8);
    scan(`window ${t}`, txt); console.log('   lines:', JSON.stringify(lines));
  }
  const goals = await pg.ev('(function(){try{return JSON.stringify(window.__qbGoals.list())}catch(e){return "ERR "+e.message}})()');
  fs.writeFileSync(OUT + 'goals.json', goals); scan('Goals list', goals); console.log('   goals:', goals.slice(0, 600));
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 3));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
