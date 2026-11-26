// Cal 11-25 (29zz_v178.js): a premium brand's tab is gold; its drop window says "A premium brand has entered the Shop."; leaving the Shop
// takes off everything only tried on.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/prem178.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV178 && window.__qbV149, null, { timeout: 90000 }); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 11, 8, 12).getTime() - real; const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.coins = 99999; S.v67ref = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; try { window.__qbRooms.open('closet', 1); } catch (e) {} S.brandSeen = {}; window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); x.render(); });
  const clear = async () => { await p.waitForTimeout(1200); await V(() => document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove())); await p.waitForTimeout(300); };
  await clear(); await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await clear(); await V(() => window.__qbV149.go('street')); await clear();
  const tab = await V(() => { const t = document.querySelector('nav.qs-tabs .qs-tab.v67p'), s = t && getComputedStyle(t); return t ? { id: t.dataset.v, on: t.classList.contains('on'), color: s.color, border: s.borderTopColor } : null; });
  ok(tab && (tab.on ? /42, 29, 5/.test(tab.color) && /255, 231, 163/.test(tab.border) : /255, 227, 161/.test(tab.color) && /217, 169, 74/.test(tab.border)), 'the premium brand\'s tab is gold (solid gold when open) ' + JSON.stringify(tab));
  await p.screenshot({ path: OUT + '/prem178_tabs.png', clip: { x: 0, y: 0, width: 390, height: 300 } });
  const sp = await V((id) => { const m = window.__qbV178.splash(id); const c = document.querySelector('#layer .bsplash'); const t = c ? c.innerText.replace(/\s+/g, ' ') : ''; document.querySelectorAll('#layer .modal').forEach((x) => x.remove());
    const m2 = window.__qbV178.splash('over'); const c2 = document.querySelector('#layer .bsplash'); const t2 = c2 ? c2.innerText.replace(/\s+/g, ' ') : ''; document.querySelectorAll('#layer .modal').forEach((x) => x.remove()); return { t, t2 }; }, tab && tab.id);
  ok(/A premium brand has entered the Shop\./.test(sp.t) && /PREMIUM/.test(sp.t) && !/premium/i.test(sp.t2), 'its drop window says a premium brand has entered the Shop; a Street brand\'s does not ' + JSON.stringify(sp));
  const tr = await V(async () => { const c = [...document.querySelectorAll('[data-act="qstry"]')].slice(0, 2); c.forEach((e) => e.click()); await new Promise((r) => setTimeout(r, 500)); const n0 = window.__qbV178.tries();
    document.querySelector('.nav button[data-v="board"]').click(); await new Promise((r) => setTimeout(r, 600)); const n1 = window.__qbV178.tries();
    document.querySelector('.nav button[data-v="shop"]').click(); await new Promise((r) => setTimeout(r, 900)); document.querySelectorAll('#layer .modal,.bsplash').forEach((m) => m.remove()); return { n0, n1, bask: !!document.querySelector('.qs-bask') }; });
  ok(tr.n0 >= 1 && tr.n1 === 0 && !tr.bask, 'leaving the Shop takes off what was only tried on ' + JSON.stringify(tr));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
