// QA, v1.49 (29zz_v150.js): the companion's change is a secret until it happens (Cal 11-24: big features are never announced). A save
// with a wolf one level short of the change: every Pet Store screen (home, each companion tab, its clothes), the Bedroom's window and
// upgrades, my player card; all text on screen scanned for anything that names the change (evolve, change, form, outgrown, Grand
// Companion Bed, the I/II form tabs). Then the same wolf changed, as a control: the sweep must find the bed and the form tabs there.
//   BASE=<plain build> node secret149.js
const pw = require('playwright');
const BASE = process.env.BASE; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const BANNED = /evol|outgrow|grand companion|next form|true form|new form|changed? (form|shape)|it will change|grows? (up|into)/i;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const sweep = async (evo) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
    await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV150 && window.__qbV149 && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(2500);
    await p.evaluate((evo) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Sec', sex: 'f' }); S.cls = 'vanguard'; S.spec = 'berserker'; S.xp = x.cum(35) + 5; S.gates = [5, 10, 20, 30]; S.coins = 99999; S.tutDone = 1;
      S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1, lounge: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
      S.base.slots = [{ t: 'bedroom', a: { bd_ward2: 1, bd_pbed: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }];
      S.pet = { k: 'wolf', t: Date.now() }; const P = window.__qbV150.state(); P.own = { wolf: evo ? { n: 'Ash', xp: 954, evo: 1, form: 1, asked: 1, t: Date.now() } : { n: 'Ash', xp: 700, t: Date.now() } }; x.persist(); x.render(); }, evo);
    const texts = []; const grab = async (where) => { const t = await p.evaluate(() => { const a = document.querySelector('#app') ? document.querySelector('#app').innerText : ''; const m = [...document.querySelectorAll('#layer .modal')].map((e) => e.innerText).join('\n'); const lbl = [...document.querySelectorAll('[aria-label],[title],img[alt]')].map((e) => (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('title') || '') + ' ' + (e.getAttribute('alt') || '')).join(' '); return a + '\n' + m + '\n' + lbl; }); texts.push([where, t]); };
    const clr = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()));
    await clr(); await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await p.waitForTimeout(1200); await clr(); await p.evaluate(() => window.__qbV149.go('pets')); await p.waitForTimeout(1200); await clr(); await grab('Pet Store home');
    const tabs = await p.evaluate(() => [...document.querySelectorAll('[data-act="p2tab"]')].map((e) => e.dataset.id)); 
    for (const id of tabs) { await p.evaluate((id) => document.querySelector('[data-act="p2tab"][data-id="' + id + '"]').click(), id); await p.waitForTimeout(900); await clr(); await grab('Pet Store tab ' + id);
      const sub = await p.evaluate(() => [...document.querySelectorAll('.qshop button, .qshop [data-act]')].filter((e) => /^p2(?!tab|buy|adopt)/.test(e.dataset.act || '') && e.getBoundingClientRect().width).map((e) => e.dataset.act + '|' + (e.dataset.id || '')).slice(0, 8));
      for (const s of sub) { const [a, i] = s.split('|'); await p.evaluate(([a, i]) => { const e = document.querySelector('[data-act="' + a + '"]' + (i ? '[data-id="' + i + '"]' : '')); if (e) e.click(); }, [a, i]); await p.waitForTimeout(600); await grab('Pet Store ' + id + ' > ' + a + ' ' + i); await clr(); } }
    const formTabs = texts.filter((x) => / > p2f(t|orm) /.test(x[0])).length;
    const bed2 = await p.evaluate(() => { const a = (window.__qb.x().ADDONS.bedroom || []).find((u) => u[0] === 'bd_pbed2'); return a ? (a[3].retired ? 'hidden' : 'listed') : 'absent'; });
    await clr(); await p.evaluate(() => window.__qb.roomModal(0)); await p.waitForTimeout(2500); await grab('Bedroom window');
    const ups = await p.evaluate(() => { const b = [...document.querySelectorAll('#layer button, #layer [data-act]')].find((e) => /upgrade/i.test(e.textContent)); if (b) b.click(); return !!b; }); await p.waitForTimeout(1200); await grab('Bedroom upgrades (' + ups + ')');
    await clr(); await p.evaluate(() => window.__qbV152.open()); await p.waitForTimeout(1200); await grab('my card');
    const hits = []; texts.forEach(([w, t]) => { const m = t.match(new RegExp(BANNED.source, 'gi')); if (m) hits.push(w + ': ' + [...new Set(m)].join(', ')); });
    console.log('     ' + (evo ? 'changed' : 'one level short') + ': ' + texts.length + ' screens (' + texts.map((x) => x[0]).join('; ') + '), form tabs ' + formTabs + ', page errors ' + errs.length);
    await ctx.close(); return { hits, formTabs, n: texts.length, errs, bed2, bedOn: texts.some((x) => /Grand Companion Bed/.test(x[1])) }; };
  const pre = await sweep(0); console.log('     before: ' + (pre.hits.join(' | ') || 'nothing'));
  ok(pre.n >= 6 && !pre.hits.length && !pre.formTabs && pre.bed2 === 'hidden', 'before the change nothing on screen names it, no form buttons or I/II tabs, the Grand Companion Bed unlisted (' + pre.bed2 + ')');
  const post = await sweep(1); console.log('     control, changed: words ' + (post.hits.join(' | ') || 'none') + ', form screens ' + post.formTabs + ', Grand Companion Bed ' + post.bed2 + (post.bedOn ? ' and on screen' : ''));
  ok(post.formTabs > 0 && post.bed2 === 'listed', 'control: once changed the same sweep reaches the form buttons and I/II tabs, and the large bed is listed');
  ok(!pre.errs.length && !post.errs.length, 'no page errors ' + JSON.stringify(pre.errs.concat(post.errs).slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
