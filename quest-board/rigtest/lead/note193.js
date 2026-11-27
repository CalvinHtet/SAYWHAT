// Cal 11-26 idea 9 (29zz_v193.js): a bounty with under 3 hours left says so once; a new town post marks the Town tab until Posts is
// opened; the profile has the Notifications switch.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/note193.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV193, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.tutDone = 1; S.v92 = { n: 0, d: '2099-01-01' }; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = null; x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  const bt = await V(async () => { const S = window.__qb.x().S, now = Date.now(); S.bq = S.bq || {}; S.bq.act = { 1: { k: 1, n: 'Hydration Check', end: now + 7 * 3600e3 + 60e3 }, 2: { k: 2, n: 'Menu Ideas', end: now + 30 * 3600e3 } };
    const pops = []; const o = window.pop; const seen = []; const obs = new MutationObserver(() => document.querySelectorAll('.toast,#toast,.pop').forEach((e) => seen.push(e.textContent))); obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.__qbV193.bty(); await new Promise((r) => setTimeout(r, 300)); const n1 = Object.keys(window.__qbV193.st().b); window.__qbV193.bty(); const n2 = Object.keys(window.__qbV193.st().b); obs.disconnect();
    return { keys: n1, again: n2.length, txt: document.body.innerText.match(/Hydration Check ends in [^.]*\./) ? document.body.innerText.match(/Hydration Check ends in [^.]*\./)[0] : seen.join('|').slice(0, 120) }; });
  ok(bt.keys.length === 1 && /^1:/.test(bt.keys[0]) && bt.again === 1, 'only the bounty with under 8 hours left is called out, once ' + JSON.stringify(bt));
  const tw = await V(async () => { window.__qbV193.setNew(Date.now()); await new Promise((r) => setTimeout(r, 100)); const tab = document.querySelector('.nav button[data-v="hall"]'); const bang = !!(tab && tab.querySelector('.nbang'));
    tab.click(); await new Promise((r) => setTimeout(r, 900)); return { bang, after: window.__qbV193.newT(), bang2: !!document.querySelector('.nav button[data-v="hall"] .nbang') }; });
  ok(tw.bang && tw.after === 0 && !tw.bang2, 'a new town post puts a "!" on the Town tab until Posts is opened ' + JSON.stringify(tw));
  const pf = await V(async () => { document.querySelector('.nav button[data-v="board"]').click(); await new Promise((r) => setTimeout(r, 400)); document.querySelector('.strip .avbtn').click(); await new Promise((r) => setTimeout(r, 900)); const b = document.querySelector('#layer .v93tog'); return b ? b.textContent : null; });
  ok(pf === 'Notifications: off', 'the profile has the Notifications switch, off by default ' + pf);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
