// QA, 22749d21: does each of the nineteen effects (now switchable in Interface > Effects) still touch anything on screen? For every
// CSS rule "body.fx-<key> <selector>", the selector (pseudo-elements stripped) is matched against the Board, Train, the Town Hall and
// the Shop of a level-50 save. An effect whose selectors match nothing anywhere is a switch that does nothing.
//   PORT=<plain build> node fxreach161.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV161, null, { timeout: 120000 }); await p.waitForTimeout(800);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Reach', sex: 'm' }); S.xp = x.cum(50); S.gates = [5, 10, 20, 30, 40, 50]; S.tutDone = 1; S.fxOff = {}; S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1 };
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; try { window.__qbRooms.open('closet', 1); } catch (e) {} S.quests = [{ id: 'r1', name: 'A task', xp: 25, stat: 'fitness', cl: 'home', rep: 'once', mins: 20 }]; S.done = {}; x.persist(); x.render(); });
  await p.waitForTimeout(800);
  const rules = await p.evaluate(() => { const out = {}; const walk = (list) => { for (const r of list) { if (r.cssRules && !r.selectorText) { try { walk(r.cssRules); } catch (e) {} continue; } if (!r.selectorText) continue; for (const sel of r.selectorText.split(',')) { const m = /body\.fx-([a-z]+)(.*)$/.exec(sel.trim()); if (m) { (out[m[1]] = out[m[1]] || new Set()).add((m[2] || '').replace(/::?(before|after|placeholder|selection)/g, '').trim() || 'body'); } } } };
    for (const s of document.styleSheets) { try { walk(s.cssRules); } catch (e) {} } return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v]])); });
  const hits = {}; const fx = (await p.evaluate(() => window.__qbV161.fx())).map((f) => f[1]);
  for (const v of ['board', 'train', 'hall', 'shop', 'profile', 'loft']) { await p.evaluate((v) => { if (v !== 'profile') for (const m of document.querySelectorAll('#layer .modal,#layer .qb-held')) m.remove(); if (v === 'profile') { document.querySelector('.nav button[data-v="board"]').click(); setTimeout(() => { const a = document.querySelector('.strip .avbtn'); if (a) a.click(); }, 300); } else { const e = document.querySelector('.nav button[data-v="' + (v === 'loft' ? 'hideout' : v) + '"]'); if (e) e.click(); } }, v); await p.waitForTimeout(900);
    const h = await p.evaluate((rules) => { const o = {}; for (const [k, sels] of Object.entries(rules)) { o[k] = 0; for (const s of sels) { try { o[k] += s === 'body' ? 1 : [...document.querySelectorAll(s)].filter((e) => e.getBoundingClientRect().width).length; } catch (e) {} } } return o; }, rules);
    for (const [k, n] of Object.entries(h)) hits[k] = (hits[k] || []).concat(v + ':' + n); }
  for (const k of fx) console.log((rules[k] ? '' : 'NO CSS ') + k + ': ' + (rules[k] ? rules[k].slice(0, 6).join(' | ') : '') + '  ->  ' + (hits[k] || []).join(' '));
  await b.close(); })();
