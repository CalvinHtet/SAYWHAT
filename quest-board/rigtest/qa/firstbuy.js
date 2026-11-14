// LEAD's first-steps fix 5ded710: the Loft's __m35 key no longer ticks "Buy your first upgrade"; then Show me on that step, followed like a
// player (the Loft tab, the Bedroom, a Buy button), and the step ticks with +50 only on the real purchase.   BASE=<sandbox> OUT= CHROME_PORT=9375 node firstbuy.js
const fs = require('fs'); const { browser, sleep } = require('./cdp.js'); const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || 'qa-out/fb/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); };
(async () => { const br = await browser(); const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`);
  const tapAt = async (pt) => { for (const t of ['mousePressed', 'mouseReleased']) await pg.s('Input.dispatchMouseEvent', { type: t, x: pt[0], y: pt[1], button: 'left', clickCount: 1 }); };
  const ringOn = () => E('var r=document.getElementById("qbtour");if(!r||r.style.visibility==="hidden")return null;var g=r.querySelector(".tour-ring").getBoundingClientRect();return {t:r.querySelector(".tour-t").textContent,x:r.querySelector(".tour-x").textContent.slice(0,70),c:[Math.round(g.x+g.width/2),Math.round(g.y+g.height/2)]}');
  const st = () => E('var S=window.__qb.x().S;return {fsd:JSON.stringify(S.fsd),coins:S.coins,bed:Object.keys((S.base.slots[0]||{}).a||{}).join("+")}');
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500);
  await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.welcomed=1;S.char=window.__qb.fixChar({name:'Qa',sex:'f'});delete S.calm;delete S.tours;delete S.fsd;delete S.fsall;S.xp=0;S.quests=[{id:'qq',t:'Dishes',xp:20,c:5,cl:'chores',rep:'once'}];x.persist();x.render();return 1`); await sleep(3500);
  for (const k of [1, 2, 3]) { await E("window.__qb.x().toggle('qq');return 1"); await sleep(3200); }
  const a = await st(); ok('two level-ups later the Bedroom has __m35 and nothing bought: the step is not ticked', /__m35/.test(a.bed) && !/"buy"/.test(a.fsd), a);
  // open the Loft once (that step), back to the Board
  await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();document.querySelector(".nav button[data-v=hideout]").click();return 1'); await sleep(3000);
  for (let k = 0; k < 3; k++) { await E('document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var t=document.querySelector("#qbtour [data-tour=skip]");t&&t.click();return 1'); await sleep(700); }
  await E('document.querySelector(".nav button[data-v=board]").click();return 1'); await sleep(3500);
  const card = await E('var c=[].slice.call(document.querySelectorAll("#app section,#app .card")).filter(function(e){return /First steps/i.test(e.innerText)})[0];return c?c.innerText.replace(/\\s+/g," ").slice(0,240):null'); console.log('     card: ' + card);
  const c0 = (await st()).coins; if (process.env.POOR) { await E('var S=window.__qb.x().S;S.coins=10;window.__qb.x().persist();window.__qb.x().render();return 1'); await sleep(1500); }
  ok('before Show me: the step is open', !/"buy"/.test((await st()).fsd));
  // Show me on the upgrade step, followed like a player
  await E('var b=[].slice.call(document.querySelectorAll("#app button")).filter(function(b){return /Show me/i.test(b.innerText)})[0];b&&b.scrollIntoView({block:"center"});b&&b.click();return 1'); await sleep(1500);
  const seq = []; let r = await ringOn(); seq.push(r && r.t + ': ' + r.x); await pg.shot(OUT + 'buy_ring1.png');
  for (let k = 0; k < 6 && r; k++) { await tapAt(r.c); await sleep(2500); await E('document.querySelectorAll("#layer .modal:not(:has(.rmodal))").forEach(function(m){if(!m.querySelector(".rmodal"))m.remove()});return 1'); await sleep(800); r = await ringOn(); seq.push(r ? r.t + ': ' + r.x : (await E('return "(no ring) window: "+((document.querySelector("#layer .rmodal .rm-title")||{}).textContent||"none")')));
    await pg.shot(OUT + `buy_ring${k + 2}.png`); if (!r) break; }
  console.log('     Show me, followed: ' + seq.join('  >  '));
  await sleep(4000); const z = await st();
  if (!process.env.POOR) ok('following the rings ends in a real purchase that ticks the step and pays +50', /"buy":1/.test(z.fsd), { before: c0, after: z });
  else { await sleep(12000); const left = await E('var r=document.getElementById("qbtour");return {ring:!!(r&&r.style.visibility!=="hidden"),win:!!document.querySelector("#layer .rmodal")}'); ok('no upgrade affordable: nothing bought, the step stays open, the ring does not stay stuck', !/"buy"/.test(z.fsd) && !left.ring, { z, left }); }
  console.log('     page errors', JSON.stringify(pg.errs || [])); console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
