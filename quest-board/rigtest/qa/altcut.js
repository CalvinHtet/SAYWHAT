// ALTITUDE's drop day (Fri Nov 20) on a plain build, female character: which of the 15 ALTITUDE pieces the Shop lists (by name), whether
// ALTITUDE is live, the free-item pool for ALTITUDE, and an owner's view. EXPECT_ANORAK=0 (cut, default) or 1 (back on sale).
// The version label too.   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/qa/altcut.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const WANT = process.env.EXPECT_ANORAK === '1';
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto('http://127.0.0.1:' + (process.env.PORT || 8821) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const ver = await p.evaluate(() => (document.querySelector('.vline') || {}).innerText || '');
  const run = (own) => p.evaluate(async (own) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, 20, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Jina', sex: 'f' }); S.xp = x.cum(30); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = own ? { gx_al_anorak: 1 } : {}; window.__qbRooms.open('closet', 1); x.render();
    const live = window.__qbDrops.state().live.map((q) => q.id);
    document.querySelector('.nav button[data-v="shop"]').click(); await new Promise((o) => setTimeout(o, 1500)); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); x.render(); await new Promise((o) => setTimeout(o, 800));
    const t = document.getElementById('app').innerText; const AL = x.SHOP.filter((q) => q[6] && q[6].b === 'alt');
    const fits = AL.filter((q) => window.__qb.x().itemFits ? window.__qb.x().itemFits(q) : true).map((q) => q[0]);
    let free = null; try { free = typeof freePool === 'function' ? freePool({ brands: ['alt'] }).map((q) => q[0]) : null; } catch (e) { free = 'ERR ' + e.message; }
    return { live, listed: AL.filter((q) => t.indexOf(q[2]) >= 0).map((q) => q[0]), all: AL.map((q) => q[0]), fits, free, cutFlag: !!(AL.find((q) => q[0] === 'gx_al_anorak')[6].cut) }; }, own);
  ok(/v1\.0\d/.test(ver), 'version line: ' + ver.replace(/\s+/g, ' ').slice(0, 40));
  const a = await run(false); console.log('     ' + JSON.stringify(a));
  ok(a.live.indexOf('alt') >= 0, 'Fri Nov 20: ALTITUDE live ' + JSON.stringify(a.live));
  const fem = a.all.filter((id) => !/henley|al_short/.test(id));
  const others = fem.filter((id) => id !== 'gx_al_anorak');
  ok(others.every((id) => a.listed.indexOf(id) >= 0), 'the Shop lists every other ALTITUDE piece a woman can wear (' + others.length + ')');
  ok((a.listed.indexOf('gx_al_anorak') >= 0) === WANT, 'the anorak ' + (WANT ? 'is' : 'is not') + ' on sale (listed: ' + (a.listed.indexOf('gx_al_anorak') >= 0) + ', cut flag ' + a.cutFlag + ')');
  if (Array.isArray(a.free)) ok((a.free.indexOf('gx_al_anorak') >= 0) === WANT, 'free-item pool ' + (WANT ? 'has' : 'leaves out') + ' the anorak (' + a.free.length + ' pieces)');
  if (!WANT) { const w = await run(true); console.log('     owner: ' + JSON.stringify({ listed: w.listed.indexOf('gx_al_anorak') >= 0 })); ok(w.listed.indexOf('gx_al_anorak') >= 0, 'an owner still sees their anorak'); }
  await b.close(); console.log('errors', JSON.stringify(errs.slice(0, 3))); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
