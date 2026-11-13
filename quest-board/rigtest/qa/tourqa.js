// LEAD's guided tours (0241042) on a sandbox: (A) a new player at 390 and 360: the welcome letter first, then the welcome tour, each step's ring
// and card on screen (pictures); level 2: The Loft, Town and Players open together and their tours run one at a time, in order; Skip ends one
// for good. (B) the seed saves: no tour, and the Daily Quest, bounties and the Training tile still on the Board.   BASE=<sandbox> OUT=<folder> CHROME_PORT=9375 node tourqa.js
const fs = require('fs'), path = require('path'); const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', PLAIN = process.env.PLAIN || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/tour/'; fs.mkdirSync(OUT, { recursive: true });
let bad = 0; const ok = (n, c, g) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 420) : '')); };
const TOURQ = `(function(){var r=document.getElementById('qbtour');if(!r||r.style.visibility==='hidden')return null;var b=r.querySelector('.tour-bub').getBoundingClientRect(),g=r.querySelector('.tour-ring').getBoundingClientRect();
  return {t:r.querySelector('.tour-t').textContent,n:r.querySelector('.tour-n').textContent,bub:[b.left,b.top,b.right,b.bottom].map(Math.round),ring:[g.left,g.top,g.right,g.bottom].map(Math.round),vw:innerWidth,vh:innerHeight,next:getComputedStyle(r.querySelector('[data-tour=next]')).display!=='none'}})()`;
(async () => { const br = await browser();
  for (const [w, h] of [[390, 844], [360, 740]]) {
    const pg = await br.page({ fresh: true }); await pg.s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    const E = (js) => pg.ev(`(function(){try{${js}}catch(e){return 'ERR '+e.message}})()`); const tap = async (sel) => { const r = await E(`var e=document.querySelector('${sel}');if(!e)return null;var b=e.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2]`); if (!r || typeof r === 'string') return false; for (const type of ['mousePressed', 'mouseReleased']) await pg.s('Input.dispatchMouseEvent', { type, x: r[0], y: r[1], button: 'left', clickCount: 1 }); return true; };
    await pg.go(PLAIN + '/dist/index.html'); await pg.wait('!!(window.__qb && window.__qb.x && window.QBLoft)', 120000); await sleep(1200);
    await E(`var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Qa',sex:'f'});delete S.calm;delete S.tours;x.render();return 1`);
    let both = 0, sawLetter = 0; for (let k = 0; k < 10; k++) { await sleep(400); const st = await E('var m=document.querySelectorAll("#layer .modal").length,r=document.getElementById("qbtour");return {m:m,t:!!r&&r.style.visibility!=="hidden"}'); if (st.m) sawLetter = 1; if (st.m && st.t) both++; if (k === 3) await pg.shot(OUT + `A_letter_${w}.png`); if (k >= 5) await E('document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return 1'); }
    ok(`${w}: the welcome letter comes first, never a tour on top of it`, sawLetter && !both, { sawLetter, both });
    await sleep(2500);
    const steps = []; for (let k = 0; k < 6; k++) { const q = await pg.ev(TOURQ); if (!q) break; steps.push(q); await pg.shot(OUT + `A_welcome_${w}_${k + 1}.png`); const on = q.bub[0] >= 0 && q.bub[2] <= q.vw && q.bub[1] >= 0 && q.bub[3] <= q.vh; if (!on) ok(`${w}: step "${q.t}" card on screen`, false, q);
      if (!q.next) break; await tap('#qbtour [data-tour=next]'); await sleep(900); }
    ok(`${w}: the welcome tour, ${steps.length} steps, every card on screen`, steps.length === 4 && steps.every((q) => q.bub[0] >= 0 && q.bub[2] <= q.vw && q.bub[1] >= 0 && q.bub[3] <= q.vh), steps.map((q) => q.t + ' ' + q.bub.join(',')));
    if (w === 390) {
      // level 2: the Loft, Town and Players at once
      await E(`var x=window.__qb.x(),S=x.S;S.xp=x.cum(2)+1;var o=window.__qbUnlock.on();o.hideout=1;o.hall=1;o.players=1;x.persist();x.render();return 1`); await sleep(3000);
      const seq = []; let skipped = null;
      for (let k = 0; k < 24; k++) { const q = await pg.ev(TOURQ); const n = await E('return document.querySelectorAll("#qbtour").length'); if (n > 1) ok('only one tour at a time', false, n);
        if (q) { if (!seq.length || seq[seq.length - 1] !== q.t) { seq.push(q.t); await pg.shot(OUT + `A_l2_${seq.length}.png`); }
          if (/Town/.test(q.t) && !skipped) { await tap('#qbtour [data-tour=skip]'); skipped = q.t; await sleep(1500); continue; }
          if (!q.next) { const sel = /Loft/.test(q.t) ? '.nav button[data-v="hideout"]' : /Town/.test(q.t) ? '.nav button[data-v="hall"]' : '.nav button[data-v="players"]'; await tap(sel); } else await tap('#qbtour [data-tour=next]'); }
        if (!q) { const m = await E('var m=document.querySelector("#layer .modal");if(!m)return null;var t=m.innerText.slice(0,40);m.remove();return t'); if (m) seq.push('(window: ' + m.replace(/\\s+/g, ' ') + ')'); }
        await sleep(1400); }
      const after = await E('var t=window.__qb.x().S.tours||{};return {hideout:t.hideout,hall:t.hall,players:t.players}');
      console.log('     level 2, the tours in the order shown: ' + seq.join(' > '));
      ok('level 2: The Loft first, then Town (skipped), then Players, one at a time; Skip marks Town as done', /Loft/.test(seq[0] || '') && seq.some((t) => /Town/.test(t)) && seq.some((t) => /players/i.test(t)) && after.hall === 1 && after.players === 1, { seq, after });
      await sleep(4000); const again = await pg.ev(TOURQ); ok('a skipped tour does not come back', !again || !/Town/.test(again.t), again && again.t);
    }
    ok(`${w}: no page errors`, !(pg.errs || []).length, pg.errs); await pg.close(); }
  // B: seed saves
  if (!process.env.NOSEEDS) for (const f of ['v88_adv', 'v89_adv', 'v89_mid', 'v90_adv', 'v90_mid']) { const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', f + '.json'), 'utf8'));
    const pg = await br.page({ fresh: true }); await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
    await pg.go(BASE + '/'); await pg.wait('!!(window.QBGAME && window.QBGAME.ready())', 120000); await sleep(3000);
    await pg.ev('(function(){document.querySelectorAll("#layer .modal,.dropsplash").forEach(function(m){m.remove()});var b=document.querySelector(".nav button[data-v=board]");b&&b.click();return 1})()');
    let seen = null; for (let k = 0; k < 5; k++) { await sleep(1300); const q = await pg.ev(TOURQ); if (q) { seen = q.t; break; } }
    const bd = await pg.ev('(function(){var S=window.__qb.x().S;return {dq:!!document.querySelector(".card.dq"),bty:!!document.querySelector(".bty"),train:!!document.querySelector(".zx-tile[data-v=train]"),calm:S.calm}})()');
    ok(`${f}: no tour, the Board keeps the Daily Quest, bounties and Training (calm ${JSON.stringify(bd.calm)})`, !seen && bd.dq && bd.bty && bd.train && bd.calm === false, { seen, bd }); await pg.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); process.exit(0); })().catch((e) => { console.error(e); process.exit(1); });
