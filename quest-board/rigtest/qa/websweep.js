// The web build (dist-web, LEAD's a827114 / be38e7c) the way Cal will see it, art arriving on demand: on LEAD's stand-in Firebase
// (rigtest/lead/mockfirebase.js, signed in), for each body a save that owns every room and every live upgrade. Opens every bottom-nav
// tab, every room window fully bought, every friend visit card, the Shop and the Wardrobe, and for each one waits for its pictures,
// then lists any picture that failed (an <img> with no size, an SVG <image> that will not load, an /art/ request that failed or
// answered 400+), and any page error. One picture per room and per tab.   BASE=<server> OUT=<folder> [BODIES=m,f] node websweep.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', URL = BASE + '/dist-web/index.html';
const OUT = process.env.OUT || 'qa-out/websweep'; fs.mkdirSync(OUT, { recursive: true });
const MOCK = fs.readFileSync(path.join(__dirname, '../lead/mockfirebase.js'), 'utf8');
const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
let fails = 0; const ok = (name, cond, info) => { if (!cond) fails++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond || info === undefined ? '' : '  ' + JSON.stringify(info).slice(0, 600))); };

// in the page: every picture inside `sel` (imgs and SVG images), loaded or not, after waiting for them
const pics = (p, sel) => p.evaluate(async (sel) => {
  const root = sel ? document.querySelector(sel) : document; if (!root) return { n: 0, bad: ['(no ' + sel + ')'] };
  const imgs = [...root.querySelectorAll('img')].filter((i) => i.src && !/^data:,?$/.test(i.src));
  // lazy pictures load only when scrolled to (the Shop's lower rows), as on a phone: scroll each one into view first
  for (const i of imgs) if (i.loading === 'lazy' && !i.complete && i.offsetParent) { i.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 60)); }
  await Promise.all(imgs.map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 15000); })));
  const hrefs = [...new Set([...root.querySelectorAll('image')].map((e) => e.getAttribute('href') || e.getAttribute('xlink:href')).filter(Boolean))];
  const svgBad = (await Promise.all(hrefs.map((u) => new Promise((r) => { const im = new Image(); im.onload = () => r(im.naturalWidth ? null : u); im.onerror = () => r(u); setTimeout(() => r('timeout ' + u), 15000); im.src = u; })))).filter(Boolean);
  const imgBad = imgs.filter((i) => !i.naturalWidth).map((i) => i.src);
  const short = (u) => String(u).replace(/^.*\/art\//, 'art/').replace(/\?h=.*$/, '').slice(0, 80);
  return { n: imgs.length + hrefs.length, bad: imgBad.concat(svgBad).map(short) };
}, sel);

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const body of (process.env.BODIES || 'm,f').split(',')) {
    console.log('== body ' + body);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
    await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
    await ctx.route(/\/api\/sample/, (r) => r.fulfill({ contentType: 'application/json', body: '{"result":{"matches":true}}' }));
    const p = await ctx.newPage(); const errs = [], artBad = [], artGot = new Set();
    p.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 200)));
    // the stand-in answers Firebase's init.json with 404 on purpose (as webtest.js does), so that one is not an error
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon|init\.json/.test(m.text() + ' ' + ((m.location() || {}).url || ''))) errs.push('console: ' + m.text().slice(0, 200)); });
    p.on('requestfailed', (r) => { if (/\/art\//.test(r.url())) artBad.push('failed ' + r.url().split('/art/')[1]); });
    p.on('response', (r) => { const u = r.url(); if (/\/art\//.test(u)) { if (r.status() >= 400) artBad.push(r.status() + ' ' + u.split('/art/')[1]); else artGot.add(u.split('/art/')[1].split('?')[0]); } else if (r.status() >= 400 && !/favicon|init\.json/.test(u)) errs.push('http ' + r.status() + ' ' + u.replace(BASE, '')); });
    await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, 'qa_' + body);
    await p.goto(URL);
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
    // the save lib.js gives: every room, every live upgrade, level 60, both bodies
    const rooms = await p.evaluate((body) => {
      const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: body });
      S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 999999; S.base.served = 1e6;
      const ts = Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length);
      S.base.slots = ts.map((t) => ({ t, a: Object.fromEntries(x.ADDONS[t].filter((u) => !(u[3] && u[3].retired)).map((u) => [u[0], 1])), st: 0, pend: 0 }));
      document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((e) => e.remove()); x.render(); return ts;
    }, body);
    await wait(3000);
    // 1. every bottom-nav tab
    const tabs = await p.evaluate(() => [...document.querySelectorAll('.nav button[data-v]')].map((e) => e.dataset.v));
    for (const t of tabs) {
      await p.evaluate((t) => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="' + t + '"]').click(); }, t);
      await wait(2500); const r = await pics(p, null);
      await p.screenshot({ path: path.join(OUT, `${body}_tab_${t}.png`) });
      ok(`tab ${t}: ${r.n} pictures`, !r.bad.length, r.bad.slice(0, 8));
    }
    // 2. every room window, fully bought
    let roomPics = 0; const roomBad = [];
    for (let i = 0; i < rooms.length; i++) {
      await p.evaluate((i) => { document.querySelectorAll('#layer .modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
      await wait(1200); const r = await pics(p, '#layer'); roomPics += r.n;
      const m = await p.$('#layer .modal'); if (m) await m.screenshot({ path: path.join(OUT, `${body}_room_${rooms[i]}.png`) }).catch(() => {});
      if (r.bad.length) roomBad.push([rooms[i], r.bad.slice(0, 5)]);
    }
    ok(`${rooms.length} room windows fully bought: ${roomPics} pictures`, !roomBad.length, roomBad);
    // 3. every friend visit card
    const visits = await p.evaluate(() => window.__qbFriends.visits.map((v) => v.id));
    const vBad = [];
    for (const id of visits) {
      await p.evaluate((id) => { const S = window.__qb.x().S; document.querySelectorAll('#layer .modal,.overlay').forEach((e) => e.remove()); S.visit = null; window.__qbFriends.force(id); }, id);
      await wait(1500); const r = await pics(p, '#layer');
      if (!r.n || r.bad.length) vBad.push([id, r.n, r.bad.slice(0, 4)]);
    }
    await p.screenshot({ path: path.join(OUT, `${body}_visit_last.png`) });
    ok(`${visits.length} visit cards, each with its pictures`, !vBad.length, vBad);
    await p.evaluate(() => document.querySelectorAll('#layer .modal,.overlay').forEach((e) => e.remove()));
    // 4. fetch-ahead has had time; the character's own layers arrived and none for the other body
    await wait(8000);
    const mine = [...artGot].filter((n) => n.startsWith(body + '_')).length, other = [...artGot].filter((n) => n.startsWith((body === 'm' ? 'f' : 'm') + '_'));
    ok(`character art arrived as files (${mine} ${body}_ layers, ${artGot.size} art files in all)`, mine > 20, mine);
    ok("none of the other body's layers fetched", !other.length, other.slice(0, 5));
    ok('no /art/ request failed', !artBad.length, artBad.slice(0, 8));
    ok('no page errors', !errs.length, errs.slice(0, 5));
    await ctx.close();
  }
  console.log(fails ? 'FAIL ' + fails : 'PASS'); await b.close(); process.exit(fails ? 1 : 0);
})();
