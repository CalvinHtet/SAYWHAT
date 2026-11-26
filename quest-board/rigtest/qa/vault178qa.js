// QA, b364ae1d (29zz_v178.js: a premium brand's drop window says "A premium brand has entered the Shop"). LEAD asked: on a Wednesday,
// a premium brand back in the Vault must still get the Vault's own window ("THE VAULT IS OPEN"), not the premium wording. Finds the first
// Wednesdays from 12-02 whose Vault brand is a premium one (and one whose Vault brand is a street one), opens the Shop at 8:30 that day as
// a player who saw the week's brands, and reads the window.
//   PORT=<plain build> OUT=<dir> node vault178qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const probe = await (await b.newContext()).newPage(); await probe.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await probe.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await probe.waitForFunction(() => window.__qb && window.__qbDrops && window.__qbV167, null, { timeout: 120000 });
  const weds = await probe.evaluate(() => { const out = []; const real = Date.now() - (window.__qbShift || 0); for (let d = 0; d < 112 && out.length < 6; d++) { const t = new Date('2026-12-02T12:00:00'); t.setDate(t.getDate() + d); if (t.getDay() !== 3) continue; window.__qbShift = t.getTime() - real; const st = window.__qbDrops.state(); if (st.back) out.push({ ymd: window.__qbDrops.ymd(), id: st.back.id, name: st.back.name, prem: window.__qbV167.prem(st.back.id) }); } window.__qbShift = 0; return out; });
  await probe.context().close(); console.log('     Wednesdays and their Vault brand: ' + JSON.stringify(weds));
  const pick = [weds.find((w) => w.prem), weds.find((w) => !w.prem)].filter(Boolean);
  ok(pick.length === 2, 'found a premium and a street Vault Wednesday');
  for (const w of pick) { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbDrops, null, { timeout: 120000 }); await p.waitForTimeout(600); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(([ymd, T]) => { window.__qbShift = new Date(ymd + 'T08:30:00').getTime() - Date.now(); const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Vault', sex: 'm' }); S.xp = x.cum(20); S.gates = [5, 10, 20]; S.tutDone = 1; S.tours = T; S.v67ref = 1; try { window.__qbRooms.open('closet', 1); } catch (e) {}
      S.brandSeen = {}; const sh = window.__qbShift; window.__qbShift = sh - 864e5; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} window.__qbShift = sh; x.persist(); x.render(); for (const m of document.querySelectorAll('#layer > *')) m.remove(); document.querySelector('.nav button[data-v="shop"]').click(); }, [w.ymd, T]);
    await p.waitForTimeout(3000); const sp = await p.evaluate(() => [...document.querySelectorAll('#layer .modal, .bsplash, .dropsplash')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 140)));
    await p.screenshot({ path: OUT + '/vault_' + w.ymd + '.png' });
    const txt = sp.join(' | ').toUpperCase(); ok(/VAULT IS OPEN/.test(txt) && !/PREMIUM BRAND HAS ENTERED/.test(txt), w.ymd + ' (' + w.name + (w.prem ? ', premium' : ', street') + ' back in the Vault): the Vault\'s own window ' + JSON.stringify(sp));
    await ctx.close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
