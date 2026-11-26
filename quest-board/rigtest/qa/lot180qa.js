// QA, 2b951ed7 (Cal 11-25: "Don't spoil the next room upgrade ... Keep it as question marks"). LEAD's lot180 checks the "+" pills in the
// building view. This looks everywhere else a player can be with Bedroom and Closet fully upgraded and nothing else built: the Board,
// the Goals window, the profile, the Loft's street, the building view, the window the "+" opens, the Shop home, Training; and lists any
// unbuilt room's name (ROOMT names other than Bedroom and Walk-in Closet) in visible text or SVG text, with its context.
//   PORT=<plain build> OUT=<dir> node lot180qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV167, null, { timeout: 120000 }); await p.waitForTimeout(600); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const names = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(14); S.gates = [5, 10]; S.tutDone = 1; S.v67ref = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, shop: 1, train: 1 };
    const full = (t) => { const a = {}; (x.ADDONS[t] || []).forEach((q) => { if (!(q[3] && (q[3].opens || q[3].retired))) a[q[0]] = 1; }); return a; };
    S.base.slots = [{ t: 'bedroom', a: full('bedroom'), st: 0, pend: 0 }, { t: 'closet', a: full('closet'), st: 0, pend: 0 }]; x.persist(); x.render();
    return Object.keys(x.ROOMT).map((k) => x.ROOMT[k].name).filter((n) => n && ['Bedroom', 'Walk-in Closet'].indexOf(n) < 0); });
  const clr = () => p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); });
  const grab = (where) => p.evaluate(([where, names]) => { const txt = document.body.innerText + '\n' + [...document.querySelectorAll('svg text')].map((t) => t.textContent).join('\n'); const hits = []; for (const n of names) { const re = new RegExp(n.replace(/[.*+?^${}()|[\]\\']/g, '.'), 'g'); let m; while ((m = re.exec(txt))) hits.push(n + ' <' + txt.slice(Math.max(0, m.index - 40), m.index + n.length + 40).replace(/\s+/g, ' ') + '>'); } return { where, hits: [...new Set(hits)].slice(0, 6) }; }, [where, names]);
  const res = []; await p.waitForTimeout(700); await clr();
  res.push(await grab('Board'));
  await p.evaluate(() => { const g = document.querySelector('[data-v67="goals"]'); if (g) g.click(); }); await p.waitForTimeout(600); res.push(await grab('Goals window')); await clr();
  await p.evaluate(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1200); res.push(await grab('Profile')); await clr();
  await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500); await clr(); res.push(await grab('Loft street'));
  await p.evaluate(() => { const e = document.querySelector('[data-act="bldgo"][data-v="0"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500); await clr(); res.push(await grab('Building view'));
  await p.evaluate(() => { const a = document.querySelector('.alplus [data-lf^="open:"] rect'); if (a) { const r = a.getBoundingClientRect(); const o = { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }; for (const ty of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) a.dispatchEvent(new MouseEvent(ty, o)); } }); await p.waitForTimeout(1200); const opened = await p.evaluate(() => [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 160))); console.log('     the "+" window: ' + JSON.stringify(opened)); res.push(await grab('The "+" window')); await p.screenshot({ path: OUT + '/lot_plus_window.png' }); await clr();
  await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(1000); await clr(); res.push(await grab('Shop home'));
  await p.evaluate(() => document.querySelector('.nav button[data-v="train"]').click()); await p.waitForTimeout(1000); await clr(); res.push(await grab('Training'));
  for (const r of res) ok(!r.hits.length, r.where + ': no unbuilt room named ' + JSON.stringify(r.hits));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
