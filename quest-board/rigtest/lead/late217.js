// Cal 11-26 late (29zz_v217.js, 10_app_a.js, 29zz_v210.js): Plated Collar off sale; round head icons zoomed out; the Vault's "!" goes
// after one visit; a teammate back from a crawl waves, "<Name> has returned!" by the dungeon's name, Claim; a "!" on the Crawls tab.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/late217.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV217 && window.__qbV210, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a); const w = (ms) => p.waitForTimeout(ms);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.coins = 5000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
    S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 }; S.story = S.story || {}; S.story.team = { sable: 1 }; S.dng = { runs: [], cd: { d: '', n: 0 }, npcs: {}, log: [] };
    S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1, away: 1 };
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  const pc = await V(() => { const it = window.__qb.x().SHOP.find((x) => x[0] === 'gx_smk_platecollar'); return it && it[6].cut; });
  ok(pc === 1, 'the Plated Collar is off sale');
  /* Vault "!" */
  await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await w(700); await clear();
  const v0 = await V(() => !!document.querySelector('[data-shub="vault"] .qs-flnew'));
  await V(() => document.querySelector('[data-shub="vault"]').click()); await w(700); await clear(); await V(() => document.querySelector('.shub-back[data-shub="home"]').click()); await w(500);
  const v1 = await V(() => ({ vault: !!document.querySelector('[data-shub="vault"] .qs-flnew'), street: document.querySelectorAll('[data-shub="street"] .qs-flnew').length }));
  ok(v0 && !v1.vault, 'the Vault\'s "!" is there until the Vault is opened, then gone ' + JSON.stringify({ v0, v1 }));
  /* Crawls: back, waving, Claim, a "!" on the tab */
  await V(() => document.querySelector('.nav button[data-v="away"]').click()); await w(700); await clear();
  await V(async () => { document.querySelector('[data-act="dgo"][data-id="cellar"]').click(); await new Promise((r) => setTimeout(r, 400)); const D = window.__qb.x().S.dng; D.runs[0].end = Date.now() - 1000; });
  await V(() => document.querySelector('.nav button[data-v="board"]').click()); await w(600); await clear(); await V(() => window.__qb.x().render()); await w(300);
  const tab = await V(() => !!document.querySelector('.nav button[data-v="away"] .nbang'));
  await V(() => document.querySelector('.nav button[data-v="away"]').click()); await w(1200); await clear();
  const row = await V(() => { const r = document.querySelector('.dng.run'); if (!r) return null; const im = r.querySelector('.v210rimg'); const b = r.querySelector('b'), s = r.querySelector('.v217back'); return { txt: r.innerText.replace(/\s+/g, ' '), btn: (r.querySelector('[data-act="dclaim"]') || {}).textContent, done: im && im.getAttribute('data-done'), src: im && (im.getAttribute('src') || '').slice(0, 30), sameLine: b && s ? Math.abs(b.getBoundingClientRect().top - s.getBoundingClientRect().top) < 12 : false }; });
  ok(tab && row && /Sable has returned!/.test(row.txt) && row.btn === 'Claim' && row.done === '1' && row.src && row.sameLine, 'a "!" on the Crawls tab; the row reads "Sable has returned!" beside the dungeon, Claim, and she waves ' + JSON.stringify({ tab, row }));
  await p.screenshot({ path: OUT + '/late217_back.png' });
  await V(() => document.querySelector('[data-act="dclaim"]').click()); await w(600); await clear(); await V(() => document.querySelector('.nav button[data-v="board"]').click()); await w(600); await clear();
  const tab2 = await V(() => !!document.querySelector('.nav button[data-v="away"] .nbang'));
  ok(!tab2, 'claimed: the Crawls "!" is gone');
  const ch = await V(() => { const h = window.__qbV214.chests({ id: 'cellar' }); return (h.match(/v214c/g) || []).length - 1; });
  ok(ch === 3, 'the Mossy Cellar hides 3 (two Goblin King pieces and Pip) ' + ch);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
