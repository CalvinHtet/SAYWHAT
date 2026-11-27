// Cal 11-26 (29zz_v210.js): Dungeon Crawls is its own tab at the bottom right from level 7, when Sable joins (her story in the level-up
// window); the Board has no Crawls tile; the tab has the team's lounge (people move and sit), who goes on a crawl, a running teammate
// beside it, the team and the relics.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/crawl210.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV210 && window.qbDbg, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  /* level 6: no Crawls anywhere */
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(6); S.gates = [5]; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
    S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 }; S.areaOn = null; if (S.story && S.story.team) S.story.team = {}; if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  const l6 = await V(() => ({ tab: !!document.querySelector('.nav button[data-v="away"]'), tile: !!document.querySelector('.zx-tile[data-v="away"]'), team: window.__qbV210.team() }));
  ok(!l6.tab && !l6.tile && !l6.team.length, 'level 6: no Crawls tab, no Board tile, nobody on the team ' + JSON.stringify(l6));
  /* level 7 */
  await V(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(7); window.qbDbg.levelUp(7, null, 6); });
  await p.waitForTimeout(600);
  const lv = await V(() => { const m = document.querySelector('#layer .modal'); return { txt: m ? m.innerText.replace(/\s+/g, ' ') : '', team: window.__qbV210.team(), unl: (window.__qb.x().S.unl || {}).sable7 }; });
  ok(/Sable joined your team/.test(lv.txt) && /Crawls is open/.test(lv.txt) && lv.team.indexOf('t:sable') >= 0 && lv.unl === 1, 'level 7\'s level-up tells Sable\'s story and opens Crawls; she is on the team ' + JSON.stringify({ team: lv.team, txt: lv.txt.slice(0, 220) }));
  await p.screenshot({ path: OUT + '/crawl210_lvup.png' });
  await clear(); await V(() => { window.__qb.x().render(); }); await p.waitForTimeout(400);
  const nav = await V(() => { const bs = [...document.querySelectorAll('.nav button[data-v]')].map((x) => x.dataset.v); return { bs, tile: !!document.querySelector('.zx-tile[data-v="away"]') }; });
  ok(nav.bs[nav.bs.length - 1] === 'away' && !nav.tile, 'Crawls is the last tab on the bottom bar (right), not a Board tile ' + JSON.stringify(nav));
  /* rescued allies too */
  await V(() => { const S = window.__qb.x().S; S.dng = S.dng || {}; S.dng.npcs = Object.assign(S.dng.npcs || {}, { pip: 1, kit: 1, bram: 1 }); window.__qb.x().render(); });
  await V(() => document.querySelector('.nav button[data-v="away"]').click()); await p.waitForTimeout(800); await clear();
  const t0 = await V(() => window.__qbV210.agents()); await p.waitForTimeout(9000); const t1 = await V(() => window.__qbV210.agents());
  const moved = t1.filter((a) => { const o = t0.find((x) => x.k === a.k); return o && (o.x !== a.x || o.y !== a.y || o.mode !== a.mode); }).length;
  const imgs = await V(() => [...document.querySelectorAll('.v210p img')].filter((i) => i.getAttribute('src')).length);
  ok(t1.length === 4 && moved >= 2 && imgs >= 3, 'the lounge has all 4 (Sable, Pip, Kit, Bram), drawn, and they move between spots ' + JSON.stringify({ t0, t1, imgs }));
  await clear(); await V(() => window.scrollTo(0, 0)); await p.waitForTimeout(400); await p.screenshot({ path: OUT + '/crawl210_lounge.png' });
  await p.waitForTimeout(6000); await clear(); await V(() => window.scrollTo(0, 0)); await p.waitForTimeout(300); await p.screenshot({ path: OUT + '/crawl210_lounge2.png' });
  /* who goes */
  await V(() => { const b = document.querySelector('[data-act="dgo"]'); b.click(); }); await p.waitForTimeout(500);
  const pk = await V(() => [...document.querySelectorAll('#layer .v210who b')].map((b) => b.textContent));
  ok(pk.length === 4, 'Crawl asks who goes, out of the 4 ' + JSON.stringify(pk));
  await V(() => { const b = [...document.querySelectorAll('#layer .v210who')].find((x) => /Kit/.test(x.textContent)); b.click(); }); await p.waitForTimeout(1200);
  const run = await V(() => ({ who: (window.__qb.x().S.dng.runs[0] || {}).who, icon: !!document.querySelector('.v210run .v210rimg'), src: !!(document.querySelector('.v210run .v210rimg') || {}).src, lounge: window.__qbV210.agents().map((a) => a.k) }));
  ok(run.who === 'a:kit' && run.icon && run.lounge.indexOf('a:kit') < 0 && run.lounge.length === 3, 'Kit goes: she runs beside the crawl and is not in the lounge ' + JSON.stringify(run));
  await V(() => document.querySelector('.v210run').scrollIntoView({ block: 'center' })); await p.waitForTimeout(800); await p.screenshot({ path: OUT + '/crawl210_run.png' });
  const rel = await V(() => ({ relics: !!document.querySelector('.v210rs'), team: !!document.querySelector('.team, .tmgrid, [class*="team"]') }));
  ok(rel.relics, 'the tab lists the relics found ' + JSON.stringify(rel));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
