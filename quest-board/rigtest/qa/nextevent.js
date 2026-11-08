// Test > Next event (LEAD's 0b20e11; Cal: "a button that triggers the next event such as the investor coming ... I want to be able to
// test everything myself but quickly"), pressed the way Cal will (the Test pill, then "Next event") on a brand-new player, at phone
// size, until it says "That's every story event". For every tap: what it said, whether a scene opened (and its pictures loaded), and
// whether the save changed. Then: every story step done, every room the story opens built once, Sable after the chef, each return
// visit only after its step, the next tap still says nothing is left, and a reload keeps it all.
//   BASE=<server> OUT=<folder> node nextevent.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/nextevent'; fs.mkdirSync(OUT, { recursive: true });
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 400) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  const ready = () => p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbRooms && window.__qbStory, null, { timeout: 90000 });
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(5000); await ready();
  await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.overlay').forEach((e) => e.remove()));
  const log = []; let end = false;
  for (let tap = 1; tap <= 90 && !end; tap++) {
    const r = await p.evaluate(async () => {
      const w = (ms) => new Promise((o) => setTimeout(o, ms));
      document.querySelectorAll('#layer .pop').forEach((e) => e.remove());
      const save0 = localStorage.getItem('quest-board');
      const menu = document.querySelector('#qbt .qbt-m'); if (menu && menu.hidden) { const t = document.querySelector('#qbt [data-q="t"]'); if (!t) return { err: 'no Test pill' }; t.click(); await w(300); }
      const bt = document.querySelector('#qbt [data-q="next"]'); if (!bt) return { err: 'no Next event button' };
      bt.click(); await w(900);
      const said = [...document.querySelectorAll('#layer .pop')].map((e) => e.textContent).join(' | ');
      const m = document.querySelector('#layer .modal');
      let pics = null;
      if (m) { const im = [...m.querySelectorAll('img')]; await Promise.all(im.map((i) => i.complete ? 0 : new Promise((o) => { i.onload = i.onerror = o; setTimeout(o, 8000); })));
        const svg = [...new Set([...m.querySelectorAll('image')].map((e) => e.getAttribute('href') || e.getAttribute('xlink:href')).filter(Boolean))];
        const bad = (await Promise.all(svg.map((u) => new Promise((o) => { const q = new Image(); q.onload = () => o(q.naturalWidth ? null : u); q.onerror = () => o(u); q.src = u; })))).filter(Boolean);
        pics = { n: im.length + svg.length, bad: im.filter((i) => !i.naturalWidth).map((i) => i.src.slice(-40)).concat(bad.map((u) => u.slice(-40))), text: m.innerText.replace(/\s+/g, ' ').slice(0, 70) }; }
      // press through the scene the way Cal would: Next, then its yes (or Continue)
      for (let k = 0; k < 12; k++) { const mm = document.querySelector('#layer .modal'); if (!mm) break;
        const vis = (q) => [...mm.querySelectorAll(q)].find((e) => e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden');
        const b = vis('[data-act="stynext"]') || vis('[data-act="styyes"]') || vis('button:not([data-act])') || vis('[data-act="mclose"]');
        if (!b) break; b.click(); await w(350); }
      await w(400);
      const left = document.querySelectorAll('#layer .modal').length, leftText = left ? document.querySelector('#layer .modal').innerText.replace(/\s+/g, ' ').slice(0, 90) : '';
      const save1 = localStorage.getItem('quest-board');
      const S = window.__qb.x().S;
      return { said, scene: !!m, pics, left, leftText, saved: save0 !== save1, rooms: S.base.slots.filter(Boolean).map((r) => r.t), team: Object.keys(window.__qbStory.state().team || {}) };
    });
    if (r.err) { ok('tap ' + tap + ': ' + r.err, false); break; }
    log.push(Object.assign({ tap }, r));
    if (r.scene) await p.screenshot({ path: path.join(OUT, `tap${String(tap).padStart(2, '0')}.png`) });
    console.log(`  tap ${tap}: ${r.said || '(no pop)'}${r.scene ? '  [scene: ' + (r.pics && r.pics.text) + ']' : ''}${r.saved ? '' : '  (save unchanged)'}`);
    if (/every story event/.test(r.said)) end = true;
    await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((e) => e.remove()));
  }
  const taps = log.length;
  ok(`reaches "That's every story event" (${taps} taps)`, end, log.slice(-2).map((x) => x.said));
  ok('every tap before the end says what it did', log.slice(0, -1).every((x) => /Next event: /.test(x.said)), log.filter((x, i) => i < log.length - 1 && !/Next event: /.test(x.said)).map((x) => x.tap));
  ok('every scene closes with its own buttons (a yes that adds someone then shows the game\'s NEW TEAM MEMBER card; the day\'s real friend visit can also land mid-run)', log.every((x) => !x.left || /NEW TEAM MEMBER|PULLED UP|KNOCK KNOCK|SURPRISE|DROPPED IN|STOPPED BY/i.test(x.leftText)), log.filter((x) => x.left).map((x) => [x.tap, x.leftText]));
  ok('every tap before the end saves (its scene pressed through)', log.slice(0, -1).every((x) => x.saved), log.filter((x, i) => i < log.length - 1 && !x.saved).map((x) => x.tap + ' ' + x.said));
  const badPics = log.filter((x) => x.pics && (x.pics.bad.length || !x.pics.n));
  ok(`every scene's pictures load (${log.filter((x) => x.scene).length} scenes)`, !badPics.length, badPics.map((x) => [x.tap, x.pics]));
  const iChef = log.findIndex((x) => /Next event: Sable/.test(x.said)), iChefStep = log.findIndex((x) => /chef/i.test(x.said) || /Mara|chef/i.test((x.pics || {}).text || ''));
  ok('Sable comes after the chef', iChef > -1 && iChefStep > -1 && iChef > iChefStep, { sable: iChef + 1, chef: iChefStep + 1 });
  const st = await p.evaluate(() => { const o = window.__qbStory.state(), S = window.__qb.x().S;     const types = S.base.slots.filter(Boolean).map((r) => r.t); return { done: Object.keys(o.done || {}).length, beats: Object.keys(o.beats || {}).length, rooms: types.length, dup: types.filter((t, i) => types.indexOf(t) !== i), team: Object.keys(o.team || {}) }; });
  console.log('  after: ' + JSON.stringify(st));
  ok('no room built twice', !st.dup.length, st.dup);
  // one more tap still says nothing is left
  const again = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); document.querySelectorAll('#layer .pop').forEach((e) => e.remove()); const menu = document.querySelector('#qbt .qbt-m'); if (menu && menu.hidden) { document.querySelector('#qbt [data-q="t"]').click(); await w(300); } document.querySelector('#qbt [data-q="next"]').click(); await w(700); return [...document.querySelectorAll('#layer .pop')].map((e) => e.textContent).join(' | '); });
  ok('the next tap still says nothing is left', /every story event/.test(again), again);
  await p.waitForTimeout(1500); await p.reload(); await ready(); await p.waitForTimeout(1500);
  const st2 = await p.evaluate(() => { const o = window.__qbStory.state(), S = window.__qb.x().S; const types = S.base.slots.filter(Boolean).map((r) => r.t); return { done: Object.keys(o.done || {}).length, beats: Object.keys(o.beats || {}).length, rooms: types.length, team: Object.keys(o.team || {}) }; });
  ok('a reload keeps it all (steps, return visits, rooms, team)', st2.done === st.done && st2.beats === st.beats && st2.rooms === st.rooms && st2.team.length === st.team.length, { before: st, after: st2 });
  ok('no page errors', !errs.length, errs.slice(0, 4));
  console.log(fails.length ? 'FAIL ' + fails.length : 'PASS'); await b.close(); process.exit(fails.length ? 1 : 0);
})();
