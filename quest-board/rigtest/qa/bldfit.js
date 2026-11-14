// LEAD's fixed building view (bf09ce0): every building with every room built, at 390x844, 375x667, 360x740 and in landscape (844x390): the
// view is locked; each room's furniture (.lfitems) is on screen, below the top buttons and above the tab bar; a tap on each room's floor
// opens that room. One picture per building and size.   BASE=<plain build> OUT=<folder> node bldfit.js
const fs = require('fs'), path = require('path'); const pw = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/bld/'; fs.mkdirSync(OUT, { recursive: true });
const ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club', 'trophy'];
let bad = 0;
(async () => { for (const [w, h] of [[390, 844], [375, 667], [360, 740], [844, 390]]) {
  const b = await pw.webkit.launch(); const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(1000);
  await p.evaluate((order) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(60); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, away: 1, trophy: 1, wheel: 1 }; S.areaOn = null; S.coins = 1e6;
    S.base.slots = order.map((t) => ({ t, a: Object.fromEntries((x.ADDONS[t] || []).filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 })); x.persist(); x.render(); }, ORDER);
  await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500);
  for (let k = 0; k < 4; k++) { await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove())); await p.waitForTimeout(400); }
  const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length);
  for (let k = 0; k < nB; k++) {
    await p.evaluate((k) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; window.__lfpd = null; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(3000);
    await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove())); await p.waitForTimeout(500);
    const r = await p.evaluate(() => { const top = Math.max(0, ...[...document.querySelectorAll('.lfhud,.lfbtop,.glnext,.lfwxb')].filter((e) => e.offsetParent !== null).map((e) => e.getBoundingClientRect().bottom)); const nav = document.querySelector('.nav .bar') || document.querySelector('.nav'); const bot = nav ? nav.getBoundingClientRect().top : innerHeight;
      const name = (document.querySelector('.lfbtop, .lfhud') || {}).innerText || ''; const rooms = [...document.querySelectorAll('#lfsvg .lfroom[data-i]')].map((g) => { const it = (g.querySelector('.lfitems') || g).getBoundingClientRect(); const fl = g.querySelector('[data-lf^="room:"]'); return { i: g.getAttribute('data-i'), lf: fl && fl.getAttribute('data-lf'), it: [it.left, it.top, it.right, it.bottom].map(Math.round) }; }).filter((q) => q.it[2] - q.it[0] > 4);
      const out = rooms.filter((q) => q.it[0] < -2 || q.it[2] > innerWidth + 2 || q.it[1] < top - 2 || q.it[3] > bot + 2);
      return { lock: !!document.querySelector('#lfwrap[data-zxlock]'), name: name.replace(/\s+/g, ' ').slice(0, 40), top: Math.round(top), bot: Math.round(bot), n: rooms.length, out: out.map((q) => q.i + ':' + q.it.join(',')), rooms }; });
    // tap the middle of each room's furniture area and see which window opens
    let tapped = 0, wrong = [];
    for (const q of r.rooms) { await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await p.waitForTimeout(200);
      const cx = Math.min(w - 2, Math.max(2, (q.it[0] + q.it[2]) / 2)), cy = Math.min(r.bot - 4, Math.max(r.top + 4, (q.it[1] + q.it[3]) / 2)); await p.mouse.click(cx, cy); await p.waitForTimeout(900);
      const t = await p.evaluate(() => (document.querySelector('#layer .rmodal .rm-title') || {}).textContent || ''); if (t) tapped++; else wrong.push(q.i); }
    await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, `b${k}_${w}x${h}.png`) });
    const fine = r.lock && !r.out.length && r.n > 0 && tapped === r.n; if (!fine) bad++;
    console.log(`${fine ? 'ok  ' : 'BAD '} ${w}x${h} building ${k} "${r.name}": ${r.n} rooms, locked ${r.lock}, off screen or under the buttons/tab bar: ${r.out.length ? r.out.join(' ') : 'none'} (visible band ${r.top}-${r.bot}); taps open ${tapped}/${r.n}${wrong.length ? ' (not: ' + wrong.join(',') + ')' : ''}`);
    await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1500); }
  if (errs.length) { bad++; console.log('BAD  page errors', errs.slice(0, 2)); } await b.close(); }
  console.log(bad ? 'FAILED ' + bad : 'PASS'); })().catch((e) => { console.error(e); process.exit(1); });
