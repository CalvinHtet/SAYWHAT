// Cal's experience review (2026-11-14): open a seed save like a returning player, count the windows that interrupt on open, list the Board's
// sections top to bottom with the page height, and take full-page pictures of the Board, Town and Players.   BASE=<sandbox> OUT=<folder> node midplayer.js
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8817', OUT = process.env.OUT || 'qa-out/mid/'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch();
  for (const f of (process.env.SEEDS || 'v90_mid,v90_adv').split(',')) { const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', f + '.json'), 'utf8'));
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(BASE + '/manifest.webmanifest'); await p.evaluate((d) => { localStorage.clear(); Object.keys(d).forEach((k) => localStorage.setItem(k, d[k])); }, seed);
    await p.goto(BASE + '/'); await p.waitForFunction(() => window.QBGAME && window.QBGAME.ready(), null, { timeout: 120000 });
    const pops = []; for (let k = 0; k < 10; k++) { await p.waitForTimeout(1200); const m = await p.evaluate(() => { const r = []; document.querySelectorAll('#layer .modal, .dropsplash').forEach((x) => { r.push(x.innerText.replace(/\s+/g, ' ').slice(0, 90)); x.remove(); }); const t = document.querySelector('#qbtour'); if (t && t.style.visibility !== 'hidden') { r.push('TOUR: ' + t.innerText.replace(/\s+/g, ' ').slice(0, 70)); const s = t.querySelector('[data-tour=skip]'); s && s.click(); } return r; }); pops.push(...m); }
    const S = await p.evaluate(() => { const S = window.__qb.x().S; return { lvl: window.__qb.x().effLvl ? window.__qb.x().effLvl() : null, coins: S.coins, quests: (S.quests || []).length }; });
    await p.evaluate(() => { document.querySelector('.nav button[data-v=board]').click(); window.scrollTo(0, 0); }); await p.waitForTimeout(1500);
    const board = await p.evaluate(() => { const a = document.querySelector('#app'); const secs = [...a.querySelectorAll('section, .card, .zx-tile, .bty, .nextline, [class*=next]')].filter((e) => e.offsetParent && !e.parentElement.closest('section, .card')).map((e) => (e.innerText || '').replace(/\s+/g, ' ').slice(0, 70)); return { h: document.documentElement.scrollHeight, secs: secs.filter(Boolean) }; });
    console.log(`\n== ${f}: level ${S.lvl}, ${S.quests} quests, coins ${S.coins}; on open ${pops.length} windows/tours:`); pops.forEach((x) => console.log('   - ' + x));
    console.log(`   Board height ${board.h}px (${(board.h / 844).toFixed(1)} screens); sections top to bottom:`); board.secs.forEach((x, i) => console.log(`   ${i + 1}. ${x}`));
    await p.screenshot({ path: OUT + f + '_board.png', fullPage: true });
    for (const v of ['hall', 'players']) { await p.evaluate((v) => { const b = document.querySelector('.nav button[data-v=' + v + ']'); b && b.click(); window.scrollTo(0, 0); }, v); await p.waitForTimeout(3000);
      await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((x) => x.remove()); const s = document.querySelector('#qbtour [data-tour=skip]'); s && s.click(); });
      const t = await p.evaluate(() => document.querySelector('#app').innerText.replace(/\n+/g, ' | ').slice(0, 1400)); console.log(`   ${v}: ${t}`); await p.screenshot({ path: OUT + f + '_' + v + '.png', fullPage: true }); }
    console.log('   page errors: ' + errs.length); await c.close(); }
  await b.close(); })();
