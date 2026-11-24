// Cal 11-24, batch 1 (29zz_v144.js): the six rank names; one greeting (Wave); a spinning ring in front of every waiting line.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/batch144.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV144, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.calm = false; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1 }; x.render(); });
  const rk = await V(() => window.__qbV144.ranks()); ok(rk.join() === 'Awakened,Hunter,Knight,Paragon,Sovereign,Monarch', 'ranks: ' + rk.join(', '));
  const page = await V(() => document.body.innerText); ok(!/Bass Hunter|Drop Knight|Headliner|Shadow Monarch/.test(page), 'no old rank name on the Board');
  ok((await V(() => window.__qbV144.sqk())).join() === 'wave', 'one greeting: Wave');
  /* the spinner */
  const sp = await V(async () => { const mk = (t, tag) => { const e = document.createElement(tag || 'p'); e.textContent = t; e.className = 'note'; document.querySelector('main, #app, body').appendChild(e); return e; };
    const a = mk('Loading…'), b2 = mk('Reading your brain dump...'), c = mk('syncing…', 'span'), d = mk('Welcome home…'), e = mk('Loading the dishwasher is a chore'); await new Promise((r) => setTimeout(r, 700));
    const r = { a: a.classList.contains('qspin'), b: b2.classList.contains('qspin'), c: c.classList.contains('qspin'), d: d.classList.contains('qspin'), e: e.classList.contains('qspin'), anim: getComputedStyle(a, '::before').animationName, w: getComputedStyle(a, '::before').width };
    a.textContent = 'Loaded'; await new Promise((r2) => setTimeout(r2, 700)); r.off = !a.classList.contains('qspin'); [a, b2, c, d, e].forEach((q) => q.remove()); return r; });
  ok(sp.a && sp.b && sp.c && !sp.d && !sp.e, 'waiting lines get a ring, other lines do not ' + JSON.stringify(sp)); ok(sp.anim === 'qspin' && parseFloat(sp.w) > 5, 'the ring is drawn and turns (' + sp.anim + ', ' + sp.w + ')'); ok(sp.off, 'it goes when the wait is over');
  /* adding tasks: the status line under the box spins while it sorts */
  const cap = await V(async () => { document.querySelector('.nav button[data-v="board"]').click(); await new Promise((r) => setTimeout(r, 400)); const ta = document.getElementById('cap'); if (!ta) return { none: 1 }; ta.value = 'Call the bank, Do laundry, Go for a run'; ta.dispatchEvent(new Event('input', { bubbles: true }));
    const bt = document.querySelector('[data-act="submit"],[data-act="cap"],#capgo,.capgo'); if (!bt) return { nobtn: [...document.querySelectorAll('[data-act]')].map((e) => e.dataset.act).filter((v, i, A) => A.indexOf(v) === i).slice(0, 60) }; bt.click(); let saw = 0, txt = '';
    for (let i = 0; i < 40; i++) { const q = document.querySelector('.qspin'); if (q) { saw = 1; txt = q.textContent; break; } await new Promise((r) => setTimeout(r, 25)); } return { saw, txt }; });
  console.log('cap:', JSON.stringify(cap)); if (cap.saw !== undefined) ok(cap.saw === 1, 'adding tasks shows a spinning line while it sorts: "' + cap.txt + '"');
  await p.screenshot({ path: OUT + '/batch144.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
