// Cal 11-26, third list: the inbox's Unread and Read tabs (29zz_v203.js), a splash for a new unlock such as the Command Console (v204),
// Effects in the profile and the profile's buttons and close button (v205), the banner behind you on the Shop's front page only (v206).
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/cal1126c.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV206 && window.__qbV204, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Calzone', sex: 'm' }); S.xp = x.cum(17); S.gates = [5, 10]; S.tutDone = 1; S.coins = 5000;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 }; S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }];
    S.unl = null; if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); });
  await clear();
  /* 1. the inbox */
  await V(() => document.querySelector('.ibbtn').click()); await p.waitForTimeout(500);
  const ib = await V(() => ({ t: [...document.querySelectorAll('#layer .v203t')].map((b) => b.textContent.replace(/\s+/g, ' ').trim() + (b.classList.contains('on') ? '*' : '')), rows: document.querySelectorAll('#layer .ibrow').length }));
  ok(ib.t.length === 2 && /^Unread \d+\*$/.test(ib.t[0]) && /^Read \d+$/.test(ib.t[1]) && ib.rows >= 1, 'the inbox opens on Unread, with a Read tab beside it ' + JSON.stringify(ib));
  await p.screenshot({ path: OUT + '/cal1126c_inbox.png' });
  const ib2 = await V(async () => { document.querySelector('#layer .ibrow').click(); await new Promise((r) => setTimeout(r, 400)); const cl = document.querySelector('#layer [data-ib="claim"]'); if (cl) { cl.click(); await new Promise((r) => setTimeout(r, 400)); } /* a letter with coins stays new until they are claimed */ const bk = document.querySelector('#layer .ibback'); if (bk) bk.click(); else document.querySelector('.ibbtn').click(); await new Promise((r) => setTimeout(r, 400));
    document.querySelector('#layer [data-v203="read"]').click(); await new Promise((r) => setTimeout(r, 300)); return { read: document.querySelectorAll('#layer .ibrow').length, on: (document.querySelector('#layer .v203t.on') || {}).textContent }; });
  ok(ib2.read >= 1 && /^Read/.test(ib2.on || ''), 'a letter opened (and its coins claimed) moves to Read ' + JSON.stringify(ib2));
  await clear();
  /* 2. the console splash */
  await V(() => { const S = window.__qb.x().S; S.base.slots.push({ t: 'lair', a: { lr_console: 1 }, st: 0, pend: 0 }); window.__qb.x().render(); window.__qbV204.tick(); });
  await p.waitForTimeout(400);
  const sp = await V(() => { const m = document.querySelector('#layer .v204u'); return m ? m.innerText.replace(/\s+/g, ' ') : null; });
  ok(!!sp && /Command Console/.test(sp) && /Interface/.test(sp) && /Upgrades/.test(sp), 'buying the Command Console says where its Upgrades and buffs are: ' + sp);
  await p.screenshot({ path: OUT + '/cal1126c_unlock.png' });
  const go = await V(async () => { document.querySelector('#layer [data-v204="go"]').click(); await new Promise((r) => setTimeout(r, 900)); return { hub: window.__qbV149.hub(), tabs: [...document.querySelectorAll('.qshop [data-act="iftab"]')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.textContent + (b.classList.contains('on') ? '*' : '')) }; });
  ok(go.tabs.some((t) => /Upgrades\*/.test(t)) && !go.tabs.some((t) => /Effects/.test(t)), 'its button opens the Interface on its Upgrades tab; the Interface has no Effects tab now ' + JSON.stringify(go));
  const again = await V(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qbV204.tick(); return !!document.querySelector('#layer .v204u'); });
  ok(!again, 'it is shown once');
  /* 3. the Shop's front page: the banner behind you; a brand: plain */
  await V(() => { const S = window.__qb.x().S; for (const k of Object.keys(S)) { if (S[k] && typeof S[k] === 'object' && 'bg' in S[k] && 'own' in S[k]) { S[k].own.neon = 1; S[k].bg = 'neon'; } } window.__qbV149.go('home'); window.__qb.x().render(); });
  await p.waitForTimeout(500); await clear();
  const sh = await V(async () => { const g = () => { const e = document.querySelector('.qshop .qs-glass'); return e ? { ban: e.classList.contains('v206ban'), fx: !!e.querySelector('.v77fx') } : null; }; const home = g(); const door = (document.querySelector('[data-shub="vault"] b') || {}).textContent, iface = (document.querySelector('[data-shub="iface"] small') || {}).textContent;
    window.__qbV149.go('street'); await new Promise((r) => setTimeout(r, 900)); const brand = g(); return { home, brand, door, iface }; });
  ok(sh.home && sh.home.ban && sh.brand && !sh.brand.ban && /The Vault/.test(sh.door || '') && !/effects/i.test(sh.iface || ''), 'the Shop\'s front page shows your banner behind you, a brand does not; the Vault door keeps its name; the Interface door no longer lists effects ' + JSON.stringify(sh));
  /* 4. the profile */
  await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(400); await clear();
  await V(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1200);
  const pr = await V(() => { const r = (e) => e.getBoundingClientRect(); const bs = [...document.querySelectorAll('#layer .prof .v61btns .btn')]; const x = document.querySelector('#layer .modal .mx'), ban = document.querySelector('#layer .prof .v61ban');
    const gaps = bs.slice(1).map((b, i) => Math.round(r(b).top - r(bs[i]).bottom)); return { names: bs.map((b) => b.textContent), gaps, xTop: Math.round(r(x).top), banTop: Math.round(r(ban).top), wraps: bs.filter((b) => r(b).height > 48).length }; });
  ok(pr.names.join('|') === 'Closet|Change banner|Notifications: off|Effects' && pr.gaps.every((g) => g <= 8) && Math.abs(pr.xTop - pr.banTop) <= 4 && !pr.wraps,
    'the profile: Closet, Change banner, Notifications, Effects, 6 px apart, on one line each; the close button level with the banner ' + JSON.stringify(pr));
  await p.screenshot({ path: OUT + '/cal1126c_profile.png' });
  const fx = await V(async () => { document.querySelector('#layer [data-v205="fx"]').click(); await new Promise((r) => setTimeout(r, 400)); const w = document.querySelector('#layer .v205fx'); if (!w) return null; const b = w.querySelector('[data-act="fxtog"]'); const before = b && b.textContent, id = b && b.dataset.id; if (b) b.click(); await new Promise((r) => setTimeout(r, 300)); const b2 = w.querySelector('[data-act="fxtog"][data-id="' + id + '"]'); return { n: w.querySelectorAll('.v61fx').length, before, after: b2 && b2.textContent }; });
  ok(fx && fx.n >= 1 && fx.before && fx.after && fx.before !== fx.after, 'Effects opens your effects; a switch flips in place ' + JSON.stringify(fx));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
