// LEAD's first steps (b3f7e4d): (1) the seed saves load on the new build with the same coins as on v0.99, the card counting their progress
// for free; (2) a new player's Board on calm days 1 to 4 at 390 and 360 (pictures); (3) tick, untick, tick a quest pays the step once;
// (4) "Show me" on the first-upgrade step, then the Loft tab and the Bedroom: where the ring goes, and that the step stays until a purchase.
//   NEW=<sandbox> OLD=<v0.99 sandbox> OUT=<folder> CHROME_PORT=9375 node firstqa.js
const fs = require('fs'), path = require('path'); const { browser, sleep } = require('./cdp.js');
const NEW = process.env.NEW || 'http://127.0.0.1:8817', OLD = process.env.OLD || 'http://127.0.0.1:8818', OUT = process.env.OUT || 'qa-out/fs/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 420) : '')); };
const CARD = `(function(){var c=[].slice.call(document.querySelectorAll('#app section,#app .card')).filter(function(e){return /First steps/i.test(e.innerText)})[0];return c?c.innerText.replace(/\\s+/g,' ').slice(0,220):null})()`;
(async () => { const br = await browser();
  // 1: seeds
  for (const f of ['v88_adv', 'v89_mid', 'v90_adv', 'v90_mid']) { const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', f + '.json'), 'utf8')); const got = {};
    for (const [lab, base] of [['old', OLD], ['new', NEW]]) { const pg = await br.page({ fresh: true }); await pg.go(base + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
      await pg.go(base + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(7000);
      got[lab] = await pg.ev(`(function(){var S=window.__qb.x().S;document.querySelectorAll('#layer .modal,.dropsplash').forEach(function(m){m.remove()});var b=document.querySelector('.nav button[data-v=board]');b&&b.click();return {coins:S.coins,fsd:S.fsd?JSON.stringify(S.fsd).slice(0,160):null,card:${CARD}}})()`); await pg.close(); }
    ok(`${f}: same coins as v0.99 (${got.old.coins} / ${got.new.coins}); card: ${got.new.card ? '"' + got.new.card.slice(0, 90) + '"' : 'none'}`, got.old.coins === got.new.coins && !(got.new.fsd && /"coins":[1-9]/.test(got.new.fsd)), got.new.fsd); }
  // 2, 3, 4: a new player
  for (const [w, h] of [[390, 844], [360, 740]]) { const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true }); const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
    await pg.go(NEW + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500);
    await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'f'});delete S.calm;delete S.tours;delete S.fsd;delete S.fsall;S.xp=0;S.quests=[];x.persist();x.render();return 1`); await sleep(2500);
    for (let k = 0; k < 4; k++) { await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();return 1'); await sleep(600); }
    for (const day of [1, 2, 3, 4]) { if (day > 1) await E(`var x=window.__qb.x(),S=x.S;S.calm.days.unshift('2000-01-0${day}');x.render();return 1`); await sleep(1500);
      await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();window.scrollTo(0,0);return 1'); await sleep(800);
      const r = await E(`var a=document.querySelector('#app'),secs=[].slice.call(a.querySelectorAll(':scope section, :scope .card')).filter(function(e){return e.offsetParent!==null}).map(function(e){return (e.querySelector('.label,h3')||e).innerText.replace(/\\s+/g,' ').slice(0,26)});return {sw:document.documentElement.scrollWidth,cards:secs.slice(0,9)}`);
      await pg.shot(OUT + `board_day${day}_${w}.png`); console.log(`     ${w} day ${day}: ${r.cards.join(' | ')}`); if (r.sw > w) ok(`${w} day ${day}: no sideways scroll`, false, r.sw); }
    if (w === 390) {
      // 3: tick, untick, tick
      const c0 = await E(`var x=window.__qb.x(),S=x.S;S.quests=[{id:'qq',t:'Dishes',xp:20,c:5,cl:'chores',rep:'once'}];x.persist();x.render();return {coins:S.coins,fs:(S.fsd&&S.fsd.coins)||0}`); await sleep(1500);
      await E("window.__qb.x().toggle('qq');return 1"); await sleep(1500); const c1 = await E('var S=window.__qb.x().S;return {coins:S.coins,fs:(S.fsd&&S.fsd.coins)||0}');
      await E("window.__qb.x().toggle('qq');return 1"); await sleep(1500); await E("window.__qb.x().toggle('qq');return 1"); await sleep(1500); const c2 = await E('var S=window.__qb.x().S;return {coins:S.coins,fs:(S.fsd&&S.fsd.coins)||0}');
      ok('tick, untick, tick: the first-steps pay comes once', c2.fs === c1.fs && c1.fs > c0.fs, { before: c0, tick: c1, again: c2 });
      // 4: Show me on the first upgrade
      await E(`var x=window.__qb.x(),S=x.S;S.xp=x.cum(3);S.coins=5000;S.areaOn=null;var o=window.__qbUnlock.on();o.hideout=1;o.hall=1;x.persist();x.render();document.querySelector('.nav button[data-v=board]').click();return 1`); await sleep(2500);
      await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();return 1'); await sleep(800);
      const card = await pg.ev(CARD); const steps = [];
      const ring = () => E('var r=document.getElementById("qbtour");if(!r||r.style.visibility==="hidden")return null;return r.querySelector(".tour-t").textContent+" / "+r.querySelector(".tour-x").textContent.slice(0,60)');
      await E('var b=[].slice.call(document.querySelectorAll("#app button")).filter(function(b){return /Show me/i.test(b.innerText)})[0];b&&b.click();return !!b'); await sleep(1500); steps.push('after Show me: ' + (await ring()));
      await E('var b=document.querySelector(".nav button[data-v=hideout]");b.click();return 1'); await sleep(3000); await E('document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1'); await sleep(1500); steps.push('in the Loft: ' + (await ring()));
      await pg.shot(OUT + 'showme_loft.png');
      const bed = await E('var g=document.querySelector("#lfsvg .lfroom[data-i=\\"0\\"] .lfitems")||document.querySelector("#lfsvg .lfroom .lfitems");if(!g)return null;var r=g.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]');
      if (bed && typeof bed !== 'string') { for (const t of ['mousePressed', 'mouseReleased']) await pg.s('Input.dispatchMouseEvent', { type: t, x: bed[0], y: bed[1], button: 'left', clickCount: 1 }); await sleep(2000); steps.push('Bedroom window: ' + (await ring()) + ' | window ' + (await E('return (document.querySelector("#layer .rmodal .rm-title")||{}).textContent||""'))); await pg.shot(OUT + 'showme_bedroom.png'); }
      await E('document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});document.querySelector(".nav button[data-v=board]").click();return 1'); await sleep(1500); const card2 = await pg.ev(CARD);
      console.log('     card at level 3: ' + card); steps.forEach((s) => console.log('     ' + s)); console.log('     card after closing without buying: ' + card2);
      ok('the upgrade step is still open after Show me without a purchase', /upgrade/i.test(card2 || ''), card2); }
    ok(`${w}: no page errors`, !(pg.errs || []).length, pg.errs); await pg.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
