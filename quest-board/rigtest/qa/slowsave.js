// LEAD's slower start (ce5123f): a save as v0.94 writes it, loaded on the new build: every owned upgrade stays owned, coins and XP don't move,
// nothing is refunded or charged. Each seed is first brought up to date on the old build (its one-time resets run there), then that save is
// loaded once more on the old build and once on the new one, and the two compared.   OLD=<v0.94 sandbox> NEW=<candidate sandbox> node slowsave.js
const fs = require('fs'), path = require('path'); const { browser, sleep } = require('./cdp.js');
const OLD = process.env.OLD || 'http://127.0.0.1:8818', NEW = process.env.NEW || 'http://127.0.0.1:8817'; let bad = 0;
const load = async (br, base, store) => { const pg = await br.page({ fresh: true }); await pg.go(base + '/version.json');
  await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(store)})`);
  await pg.go(base + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(6000);
  const r = await pg.ev(`(function(){var S=window.__qb.x().S,o={};(S.base.slots||[]).forEach(function(s,i){if(s)o[i+':'+s.t]=Object.keys(s.a||{}).filter(function(k){return s.a[k]}).sort().join(',')});
    var st={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);st[k]=localStorage.getItem(k)}
    return {coins:S.coins,xp:S.xp,earnedC:S.earnedC,spent:S.spent,rooms:o,errs:0,store:st}})()`); r.errs = pg.errs.slice(); await pg.close(); return r; };
(async () => { const br = await browser();
  for (const f of ['v88_adv', 'v89_mid', 'v90_adv', 'v90_mid']) {
    const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', f + '.json'), 'utf8'));
    const cur = await load(br, OLD, seed); // brought up to date on v0.94
    // on v0.94: buy the Loft's rooms through their windows' Buy buttons (half of each room for the _mid seeds, all of it for the others), then save
    { const pg = await br.page({ fresh: true }); await pg.go(OLD + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(cur.store)})`);
      await pg.go(OLD + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(3000);
      const got = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,half=${/_mid/.test(f) ? 1 : 0},n=0;
        ['bedroom','closet','patio','gameroom','lair'].forEach(function(t){if(!S.base.slots.some(function(s){return s&&s.t===t}))S.base.slots.push({t:t,a:{},st:0,pend:0})});x.persist();
        for(var t of ['bedroom','closet','patio','gameroom','lair']){var k=S.base.slots.findIndex(function(s){return s&&s.t===t}),tot=(x.ADDONS[t]||[]).filter(function(u){return !(u[3]&&u[3].retired)}).length,lim=half?Math.ceil(tot/2):tot,m=0;
          for(var g=0;g<60&&m<lim;g++){S.coins=Math.max(S.coins,5e6);document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});window.__qb.roomModal(k);await w(120);document.querySelectorAll('.rmodal details').forEach(function(d){d.open=true});
            var b=[].slice.call(document.querySelectorAll('.rmodal [data-act="raddon"]')).find(function(e){return !e.disabled});if(!b)break;b.click();await w(60);m++;n++}}
        document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(e){e.remove()});x.persist();await w(1500);
        var st={};for(var i=0;i<localStorage.length;i++){var kk=localStorage.key(i);st[kk]=localStorage.getItem(kk)}return {n:n,store:st}})()`);
      await pg.close(); cur.store = got.store; console.log('     ' + f + ': bought ' + got.n + ' Loft upgrades on v0.94'); }
    const a = await load(br, OLD, cur.store), b = await load(br, NEW, cur.store);
    const sameRooms = JSON.stringify(a.rooms) === JSON.stringify(b.rooms), owned = Object.values(b.rooms).reduce((n, s) => n + (s ? s.split(',').length : 0), 0);
    const good = sameRooms && a.coins === b.coins && a.xp === b.xp && a.earnedC === b.earnedC && a.spent === b.spent && !a.errs.length && !b.errs.length; if (!good) bad++;
    console.log((good ? 'ok   ' : 'BAD  ') + f + `: ${Object.keys(b.rooms).length} rooms, ${owned} upgrades owned, the same on both: ${sameRooms}; coins ${a.coins} -> ${b.coins}, xp ${a.xp} -> ${b.xp}, earned ${a.earnedC} -> ${b.earnedC}, spent ${a.spent} -> ${b.spent}` + (a.errs.length + b.errs.length ? ' errors ' + JSON.stringify([...a.errs, ...b.errs].slice(0, 2)) : ''));
    if (!sameRooms) Object.keys({ ...a.rooms, ...b.rooms }).forEach((k) => { if (a.rooms[k] !== b.rooms[k]) console.log('     ' + k + ': old ' + a.rooms[k] + ' | new ' + b.rooms[k]); });
  }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
