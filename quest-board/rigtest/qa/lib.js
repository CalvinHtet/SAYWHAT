// QA shared setup. Like rigtest/browser/drv.js, but on QA's port (8769, BASE to change it), with a choice of how much is
// owned, and helpers to render one room on its own (no people) and to compare two pictures in the page.
// Playwright: NODE_PATH must point at a node_modules holding it (see docs/QA.md).
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
exports.BASE = BASE;
exports.ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'restaurant', 'skybar', 'rooftop', 'boba', 'dessert', 'speakeasy', 'garden', 'theater', 'auditorium', 'mall', 'bowling', 'karaoke', 'arcade', 'rhythm', 'vr', 'club'];

// owned: 'all' (every upgrade), 'none' (every room, no upgrades)
exports.open = async function ({ width = 1280, height = 900, body = 'm', owned = 'all', mobile = false, slow = 0 } = {}) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext(mobile ? { viewport: { width, height }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { viewport: { width, height }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 300)));
  p.on('console', (m) => { if (m.type() === 'error' && !/TUNNEL|favicon/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  p.on('requestfailed', (r) => { if (!/favicon/.test(r.url())) errs.push('requestfailed: ' + r.url().replace(BASE, '') + ' ' + (r.failure() || {}).errorText); });
  p.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errs.push('http ' + r.status() + ': ' + r.url().replace(BASE, '')); });
  await p.goto(BASE + '/dist/index.html');
  await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 });
  await p.waitForTimeout(800);
  await p.evaluate(({ body, owned, order }) => {
    const x = window.__qb.x(), S = x.S;
    S.created = true;
    S.char = window.__qb.fixChar({ name: 'Cal', sex: body });
    S.gates = Array.from({ length: 200 }, (_, i) => i);
    S.xp = x.cum(60);
    S.coins = 999999;
    S.base.served = 1e6;
    // 'none': like a real game, a room that an upgrade opens (the Closet from the Walk-in Closet...) does not exist yet
    const opened = new Set(); Object.values(x.ADDONS).forEach((l) => l.forEach((u) => { if (u[3] && u[3].opens) opened.add(u[3].opens); }));
    S.base.slots = order.filter((t) => owned === 'all' || !opened.has(t)).map((t) => ({ t, a: owned === 'all' ? Object.fromEntries((x.ADDONS[t] || []).map((u) => [u[0], 1])) : {}, st: 0, pend: 0 }));
    window.__order = order;
    x.render();
  }, { body, owned, order: exports.ORDER });
  // the Board is the lightest screen to sit on: every purchase re-renders the current screen
  if (process.env.TAB !== 'keep') await p.evaluate(() => { const bt = document.querySelector('.nav button[data-v="board"]'); if (bt) bt.click(); });
  await p.waitForTimeout(500);
  if (slow) { const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: slow }); }
  return { b, p, errs };
};

// In the page: open room slot i's window (the real upgrade screen, fixed random seed), copy its room picture without
// people into #qahost (animations off), and leave the window open so its buttons can be pressed.
// Returns the first upgrade the window offers to buy, in the order the window lists them.
exports.openRoom = async function (p, i, w = 900, h = 700) {
  return p.evaluate(async ({ i, w, h }) => {
    let host = document.getElementById('qahost');
    if (!host) {
      host = document.createElement('div'); host.id = 'qahost';
      document.body.appendChild(host);
      const st = document.createElement('style');
      st.textContent = '#qahost{position:fixed;left:0;top:0;z-index:99999;background:#1b1530}#qahost svg{width:100%;height:100%;display:block}#qahost *{animation:none!important;transition:none!important}';
      document.head.appendChild(st);
    }
    host.style.width = w + 'px'; host.style.height = h + 'px';
    document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove());
    let s = 48271; const o = Math.random; Math.random = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    try { window.__qb.roomModal(i); } finally { Math.random = o; }
    // some pieces (the desk chair) are filled in a moment later
    await new Promise((ok) => setTimeout(ok, 30)); await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
    const src = document.querySelector('#rbigw svg');
    if (!src) return { err: 'no room picture' };
    const svg = src.cloneNode(true);
    svg.querySelectorAll('.lfa,[id^="lfa-"]').forEach((e) => e.remove());
    host.innerHTML = ''; host.appendChild(svg);
    const hrefs = [...host.querySelectorAll('image')].map((e) => e.getAttribute('href') || e.getAttribute('xlink:href')).filter(Boolean);
    await Promise.all([...new Set(hrefs)].map((u) => new Promise((ok) => { const im = new Image(); im.onload = im.onerror = ok; im.src = u; })));
    await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
    const bt = [...document.querySelectorAll('.rmodal button[data-act="raddon"]')].find((b) => !b.disabled);
    const blocked = [...document.querySelectorAll('.rmodal .addon.next button[disabled]')].map((b) => b.textContent.trim());
    const r = window.__qb.x().S.base.slots[i];
    // the upgrade menu: its heading, how many cards it shows, and what is still unbought (retired ones never show)
    const summary = ((document.querySelector('.rmodal details.acol[data-k="av"] summary') || {}).textContent || '').trim();
    const cards = document.querySelectorAll('.rmodal details.acol[data-k="av"] .addon.next').length;
    const left = (window.__qb.x().ADDONS[r.t] || []).filter((u) => !(u[3] && u[3].retired) && !(r.a && r.a[u[0]])).map((u) => u[0]);
    return { next: bt ? bt.dataset.id : null, blocked, summary, cards, left, owned: Object.keys(r.a || {}).filter((k) => r.a[k]) };
  }, { i, w, h });
};

// In the page: footprints of every piece in #qahost, and the three audits from rigtest/browser (gaps, depth, stations) for
// the room as it is now.
exports.audit = async function (p, i) {
  return p.evaluate((i) => {
    const r = window.__qb.x().S.base.slots[i], q = window.__qbLoft();
    const C = q.roomCtx(r, 90 + i);
    const gs = [...document.querySelectorAll('#qahost .lfitems > g[data-b]')];
    const it = gs.map((g, n) => { const bb = g.getBBox(); return { n, b: g.getAttribute('data-b').split(',').map(Number), r: [bb.x, bb.y, bb.x + bb.width, bb.y + bb.height], name: (g.innerHTML.match(/([a-z0-9]+x?_[a-z0-9_]+)\.webp/) || g.innerHTML.match(/art\/([a-z0-9_]+)/) || [, 'box'])[1] }; });
    const overlap = [], stack = [], depth = [], outside = [];
    const area = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
    for (let a = 0; a < it.length; a++) for (let c = a + 1; c < it.length; c++) {
      const A = it[a].b, B = it[c].b;
      const ix = Math.min(A[2], B[2]) - Math.max(A[0], B[0]), iy = Math.min(A[3], B[3]) - Math.max(A[1], B[1]);
      if (ix > 0.05 && iy > 0.05) {
        const inter = ix * iy, iou = inter / (area(A) + area(B) - inter);
        overlap.push([it[a].name, it[c].name, +inter.toFixed(2)]);
        if (iou > 0.5) stack.push([it[a].name, it[c].name, +iou.toFixed(2)]);
      }
    }
    const e = 0.02;
    for (const A of it) for (const B of it) {
      if (A.n >= B.n) continue;
      const bx = B.b[2] <= A.b[0] + e, by = B.b[3] <= A.b[1] + e;
      const bBehind = (bx && !(A.b[3] <= B.b[1] + e)) || (by && !(A.b[2] <= B.b[0] + e));
      if (!bBehind) continue;
      const ov = Math.min(A.r[2], B.r[2]) - Math.max(A.r[0], B.r[0]), oh = Math.min(A.r[3], B.r[3]) - Math.max(A.r[1], B.r[1]);
      if (ov > 2 && oh > 2) depth.push(B.name + ' drawn over ' + A.name);
    }
    it.forEach((x) => { if (x.b[0] < -0.05 || x.b[1] < -0.05 || x.b[2] > C.W + 0.05 || x.b[3] > C.D + 0.05) outside.push(x.name); });
    const obs = C.obsRaw || [], st = [];
    const dist = (x, y) => Math.min(99, ...obs.map((o) => Math.hypot(Math.max(0, o[0] - x, x - o[2]), Math.max(0, o[1] - y, y - o[3]))));
    const inside = (x, y) => obs.some((o) => x > o[0] + .02 && x < o[2] - .02 && y > o[1] + .02 && y < o[3] - .02);
    C.st.forEach((s) => {
      if (s.kind === 'door') return;
      const seat = !!s.lift || (s.kind === 'sit' && !s.cust) || s.kind === 'bed', d = dist(s.x, s.y), tag = s.kind + ':' + (s.tag || '');
      if (!seat && inside(s.x, s.y)) st.push('stand-in ' + tag);
      else if (!seat && d < 0.18) st.push('stand-touch ' + tag);
      if (seat && s.kind !== 'bed' && d > 0.6) st.push('seat-on-air ' + tag);
      if (s.x < 0 || s.y < 0 || s.x > C.W || s.y > C.D) st.push('spot-outside ' + tag);
    });
    return { size: C.W + 'x' + C.D, items: it.map((x) => x.name), overlap, stack, depth, outside, stations: st, spots: C.st.length };
  }, i);
};

// Press a room window's buy button for upgrade id, and check the coins and the save changed.
exports.buy = async function (p, i, id) {
  return p.evaluate(({ i, id }) => {
    const S = window.__qb.x().S, r = S.base.slots[i], c0 = S.coins;
    const bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="' + id + '"]');
    if (!bt) return { ok: false, why: 'no button' };
    bt.click();
    const ad = (window.__qb.x().ADDONS[r.t] || []).find((x) => x[0] === id);
    const ok = !!(r.a && r.a[id]) && c0 - S.coins === ad[2];
    try { window.lfPvStop(); } catch (e) {}
    document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove());
    return { ok, name: ad[1], cost: ad[2], paid: c0 - S.coins, why: ok ? '' : 'owned ' + !!(r.a && r.a[id]) + ', paid ' + (c0 - S.coins) };
  }, { i, id });
};

// In the page: share of pixels that differ between two PNG screenshots (0..1), and the box around the change.
exports.diff = async function (p, a, b) {
  return p.evaluate(async ({ a, b }) => {
    const load = (s) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.src = 'data:image/png;base64,' + s; });
    const [A, B] = await Promise.all([load(a), load(b)]);
    const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.drawImage(A, 0, 0); const da = g.getImageData(0, 0, w, h).data;
    g.clearRect(0, 0, w, h); g.drawImage(B, 0, 0); const db = g.getImageData(0, 0, w, h).data;
    let n = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = (y * w + x) * 4;
      if (Math.abs(da[k] - db[k]) + Math.abs(da[k + 1] - db[k + 1]) + Math.abs(da[k + 2] - db[k + 2]) > 48) { n++; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
    }
    return { share: n / (w * h), px: n, box: n ? [x0, y0, x1, y1] : null };
  }, { a, b });
};
