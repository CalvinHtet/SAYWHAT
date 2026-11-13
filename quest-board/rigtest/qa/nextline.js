// LEAD's "Next" line (4211a7e): at 390 and 360, for a calm day-1 player with no tasks, with tasks, a mid player with coins, one with a trial waiting;
// the top bar shows level progress; stats hidden below level 10. And the promise: when it says "You can afford a Loft upgrade", is there a Buy
// button the player can press with those coins? (each room's window, the cards it really offers)   BASE=<sandbox> OUT=<folder> CHROME_PORT=9375 node nextline.js
const fs = require('fs'), path = require('path'); const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || 'qa-out/next/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 460) : '')); };
const READ = `(function(){var n=document.querySelector('.zx-next'),b=document.querySelector('.bline'),st=document.querySelector('.dq-st');return {next:n?n.innerText.replace(/\\s+/g,' '):null,act:n&&n.dataset.v||'',bar:b?b.innerText.replace(/\\s+/g,' '):null,stats:!!st&&st.offsetParent!==null,lv:window.__qb.x().effLvl(),coins:window.__qb.x().S.coins,sw:document.documentElement.scrollWidth}})()`;
const OFFER = `(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,best=0,where='';for(var k=0;k<S.base.slots.length;k++){var r=S.base.slots[k];if(!r)continue;document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});window.__qb.roomModal(k);await w(150);document.querySelectorAll('.rmodal details').forEach(function(d){d.open=true});
  [].forEach.call(document.querySelectorAll('.rmodal [data-act="raddon"]'),function(bt){var ad=(x.ADDONS[r.t]||[]).filter(function(u){return u[0]===bt.dataset.id})[0];if(ad&&ad[2]>0&&(!best||ad[2]<best)){best=ad[2];where=r.t+'.'+ad[0]}})}document.querySelectorAll('#layer .modal').forEach(function(m){m.remove()});return {best:best,where:where}})()`;
(async () => { const br = await browser();
  for (const [w, h] of [[390, 844], [360, 740]]) {
    const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500);
    const cases = [
      ['day1_notasks', `S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'m'});S.xp=0;S.total=0;S.quests=[];S.calm={days:[S.runDate]};S.tours={welcome:1};S.coins=0;`],
      ['day1_tasks', `S.quests=[{id:'q1',t:'Dishes',xp:20,c:5,cl:'chores',rep:'once'},{id:'q2',t:'Laundry',xp:20,c:5,cl:'chores',rep:'once'}];`],
      ['mid_coins', `S.xp=x.cum(14)+5;S.gates=Array.from({length:200},function(_,i){return i});S.calm=false;S.coins=900;S.areaOn=null;window.__qbUnlock.on().hideout=1;`],
      ['mid_poor', `S.coins=10;`],
      ['trial', `S.gates=[];S.xp=x.cum(6);`]];
    for (const [lab, js] of cases) {
      await E(`var x=window.__qb.x(),S=x.S;${js}x.persist();x.render();document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v=board]');b&&b.click();window.scrollTo(0,0);return 1`); await sleep(900);
      const r = await pg.ev(READ); await pg.shot(OUT + `${lab}_${w}.png`); console.log(`${w} ${lab}: Next "${r.next}"${r.act ? ' -> ' + r.act : ''} | bar "${r.bar}" | stats ${r.stats ? 'shown' : 'hidden'} (lv ${r.lv}) | coins ${r.coins}`);
      ok(`${w} ${lab}: no sideways scroll; stats hidden below level 10`, r.sw <= w && (r.lv >= 10 || !r.stats), { sw: r.sw, stats: r.stats, lv: r.lv });
      if (/afford/.test(r.next || '')) { const o = await pg.ev(OFFER); ok(`${w} ${lab}: "afford a Loft upgrade" is true: a Buy button at or under ${r.coins} coins`, o.best > 0 && o.best <= r.coins, o); }
      if (/Daily Quest/.test(r.next || '')) { const dq = await E('return !!document.querySelector(".card.dq")'); ok(`${w} ${lab}: names the Daily Quest only when its card is there`, dq, dq); }
    }
    ok(`${w}: no page errors`, !(pg.errs || []).length, pg.errs); await pg.close(); }
  // the promise over the seed saves (coins as saved, then at the cheapest upgrade's price)
  for (const f of ['v88_adv', 'v89_mid', 'v90_adv', 'v90_mid']) { const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', f + '.json'), 'utf8'));
    const pg = await br.page({ fresh: true }); await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(2500);
    const o = await pg.ev(OFFER); if (!o.best) { console.log(`${f}: nothing to buy`); await pg.close(); continue; }
    for (const c of [o.best, o.best - 50]) { await pg.ev(`(function(){var x=window.__qb.x();x.S.coins=${c};x.S.quests=[{id:'q1',t:'Dishes',xp:20,c:5,cl:'chores',rep:'once'}];x.render();document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v=board]');b&&b.click();return 1})()`); await sleep(700);
      const r = await pg.ev(READ); const says = /afford/.test(r.next || ''); ok(`${f} with ${c} coins (cheapest Buy button ${o.best}, ${o.where}): says "afford" ${says}`, says === (c >= o.best) || /trial/.test(r.next || ''), r.next); }
    await pg.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
