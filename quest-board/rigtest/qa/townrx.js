// Town board reactions (LEAD's 01deb94, Cal: "live board and reactions", "No cap on coins earned from reactions"): Ana and Ben on one
// stand-in database with the dbcaps.json rules (as in townlive.js). Ana posts; she cannot react to it; Ben sees four reactions and taps
// one, kept in his own board doc; Ana gets 5 coins and the count; Ben takes it back and picks another, then taps six more times:
// no more coins. Then Ana on the Board, Ben posts: the Hall tab badge, cleared by opening the Hall.
//   BASE=<server> QB=<quest-board folder of the build> node townrx.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
const CAPS = JSON.parse(fs.readFileSync(path.join(process.env.QB || '.', 'app/dbcaps.json'), 'utf8')).capabilities.db.rules;
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(g))); if (!c) fails.push(n); };
const MOCK = ({ uid, owner, rules }) => {
  const P = '__mdb:', load = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(P)) o[k.slice(P.length)] = JSON.parse(localStorage.getItem(k)); } return o; }, put = (p, d) => (d === undefined ? localStorage.removeItem(P + p) : localStorage.setItem(P + p, JSON.stringify(d)));
  const LV = { view: 1, interact: 2, admin: 3, owner: 4, self: 9 }, me = owner ? 4 : 2;
  window.__denied = [];
  // the most specific rule whose path is a prefix of the doc path ({self} only matching this player's id)
  const rule = (p) => { const s = p.split('/'); let best = null, bl = -1;
    rules.forEach((r) => { const rs = r.path.split('/'); if (rs.length > s.length) return;
      for (let i = 0; i < rs.length; i++) { if (rs[i] === '{self}') { if (s[i] !== uid) return; } else if (rs[i] !== s[i]) return; }
      if (rs.length > bl) { best = r; bl = rs.length; } });
    return best; };
  const can = (p, op) => { const s = p.split('/');
    if (s[0] === 'data' && s[1] === 'users') return s[2] === uid;
    const r = rule(p); if (!r) return me >= (op === 'read' ? LV.view : LV.interact);
    return me >= LV[r[op] || (op === 'read' ? 'view' : 'interact')]; };
  window.__can = can;
  const guard = (p, op) => { if (!can(p, op)) { window.__denied.push(op + ' ' + p); throw { code: 'permission-denied' }; } };
  const snap = (p, d) => ({ id: p.split('/').pop(), exists: d !== undefined, data: () => (d === undefined ? undefined : JSON.parse(JSON.stringify(d))) });
  const doc = (p) => ({ id: p.split('/').pop(), get: async () => { guard(p, 'read'); return snap(p, load()[p]); },
    set: async (d) => { guard(p, 'write'); put(p, JSON.parse(JSON.stringify(d))); },
    delete: async () => { guard(p, 'write'); put(p, undefined); } });
  const coll = (p, lim) => ({ doc: (k) => doc(p + '/' + k), limit: (n) => coll(p, n), orderBy: () => coll(p, lim),
    where: () => { throw new Error('where() is not used any more'); },
    get: async () => { const o = load(), n = p.split('/').length + 1;
      const docs = Object.keys(o).filter((k) => k.startsWith(p + '/') && k.split('/').length === n && can(k, 'read')).map((k) => snap(k, o[k]));
      return { docs: docs.slice(0, lim || 1e9) }; } });
  const db = { doc, collection: (p) => coll(p) };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? { id: async () => uid, isOwner: async () => owner } : null) };
};

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errs = [];
  const open = async (uid, owner, name) => {
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(name + ': ' + e.message));
    await p.addInitScript(MOCK, { uid, owner, rules: CAPS });
    await p.goto(BASE + '/dist/index.html');
    await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 60000 }); await p.waitForTimeout(800);
    await p.evaluate((name) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name, sex: 'm' }); S.xp = x.cum(10); delete S.areaOn; x.render(); }, name);
    await p.evaluate(() => document.querySelectorAll('.modal').forEach((e) => e.remove()));
    await p.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await p.waitForTimeout(1500);
    return p;
  };
  const ana = await open('u_ana', true, 'Ana'), ben = await open('u_ben', false, 'Ben');
  const coins = (p) => p.evaluate(() => Math.floor(window.__qb.x().S.coins));
  const reload = (p) => p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const n0 = JSON.stringify(window.__qbTown && window.__qbTown.rx ? window.__qbTown.rx() : null); document.querySelector('.nav button[data-v="board"]').click(); await w(300); document.querySelector('.nav button[data-v="hall"]').click(); await w(2500); /* the Hall reloads the board every 20 s: wait for one */ for (let k = 0; k < 24; k++) { await w(1000); if (JSON.stringify(window.__qbTown.rx()) !== n0 || k > 21) break; } });
  const waitPost = (p, text) => p.evaluate(async (text) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); for (let k = 0; k < 30; k++) { if ([...document.querySelectorAll('.snp')].some((e) => e.innerText.includes(text))) return k; await w(1000); } return -1; }, text);
  const bar = (p, text) => p.evaluate((text) => { const post = [...document.querySelectorAll('.snp')].find((e) => e.innerText.includes(text)); if (!post) return null;
    return [...post.querySelectorAll('.snrxb')].map((b) => ({ e: b.textContent.replace(/\d+/g, ''), n: +((b.querySelector('small') || {}).textContent || 0), on: b.classList.contains('on'), dis: b.disabled })); }, text);
  // Ana posts
  await ana.bringToFront(); await ana.fill('#sntext', 'Ana: the garden is up'); await ana.evaluate(() => document.querySelector('[data-act="snpost"]').click()); await ana.waitForTimeout(800);
  const anaOwn = await bar(ana, 'Ana: the garden is up');
  ok('Ana cannot react to her own post (no buttons, or all disabled)', anaOwn && anaOwn.every((b) => b.dis), anaOwn);
  // Ben sees it with four reactions and taps fire
  await ben.bringToFront(); console.log('  Ben saw the post after', await waitPost(ben, 'Ana: the garden is up'), 's');
  const benBar = await bar(ben, 'Ana: the garden is up');
  ok('Ben sees Ana\'s post with four reactions to tap', benBar && benBar.length === 4 && benBar.every((b) => !b.dis), benBar);
  const c0 = await coins(ana);
  await ben.evaluate(() => { const post = [...document.querySelectorAll('.snp')].find((e) => e.innerText.includes('Ana: the garden is up')); post.querySelectorAll('.snrxb')[0].click(); });
  await ben.waitForTimeout(1200);
  const benStore = await ben.evaluate(() => JSON.parse(localStorage.getItem('__mdb:board/u_ben') || '{}').rx || {});
  ok('Ben\'s reaction is kept in his own board doc', Object.keys(benStore).length === 1, benStore);
  ok('no write was refused', (await ben.evaluate(() => window.__denied)).length === 0, await ben.evaluate(() => window.__denied));
  // Ana reloads: +5, the count shows
  await ana.bringToFront(); await reload(ana);
  const c1 = await coins(ana), a1 = await bar(ana, 'Ana: the garden is up');
  ok('Ana gets 5 coins for the reaction', c1 - c0 === 5, { c0, c1 });
  ok('Ana\'s post shows the count', a1 && a1.some((b) => b.n === 1), a1);
  // Ben takes it back and picks another: still one reaction, no second payment
  await ben.bringToFront(); await reload(ben);
  await ben.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const q = () => [...document.querySelectorAll('.snp')].find((e) => e.innerText.includes('Ana: the garden is up')).querySelectorAll('.snrxb');
    q()[0].click(); await w(900); q()[1].click(); await w(900); });
  await ana.bringToFront(); await reload(ana);
  const c2 = await coins(ana), a2 = await bar(ana, 'Ana: the garden is up');
  ok('taking it back and choosing another pays nothing more', c2 === c1, { c1, c2 });
  ok('the count moved to the new reaction', a2 && a2.filter((b) => b.n).length === 1 && a2.find((b) => b.n).e !== a1.find((b) => b.n).e, a2);
  // toggling many times cannot farm coins
  await ben.bringToFront(); await reload(ben);
  await ben.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const q = () => [...document.querySelectorAll('.snp')].find((e) => e.innerText.includes('Ana: the garden is up')).querySelectorAll('.snrxb');
    for (let k = 0; k < 6; k++) { q()[k % 4].click(); await w(500); } });
  await ana.bringToFront(); await reload(ana);
  ok('six more taps by the same player pay nothing more', (await coins(ana)) === c1, { c1, now: await coins(ana) });
  // the Hall badge: Ana on the Board, Ben posts, Ana's board check
  await ana.evaluate(() => document.querySelector('.nav button[data-v="board"]').click());
  await ben.bringToFront(); await ben.fill('#sntext', 'Ben: anyone for the gym'); await ben.evaluate(() => document.querySelector('[data-act="snpost"]').click()); await ben.waitForTimeout(800);
  await ana.bringToFront();
  let badge = null; const t0 = Date.now();
  while (Date.now() - t0 < 70000) { await ana.waitForTimeout(2000); badge = await ana.evaluate(() => { const e = document.querySelector('.nav button[data-v="hall"] .twbadge'); return e ? e.textContent : null; }); if (badge) break; }
  ok('the Hall tab shows a badge for Ben\'s new post within 70 s', !!badge, { badge, s: Math.round((Date.now() - t0) / 1000) });
  await ana.evaluate(() => document.querySelector('.nav button[data-v="hall"]').click()); await ana.waitForTimeout(1500);
  ok('opening the Hall clears the badge', !(await ana.evaluate(() => document.querySelector('.nav button[data-v="hall"] .twbadge'))));
  ok('no page errors', errs.length === 0, errs);
  await b.close();
  console.log(fails.length ? 'FAILED ' + fails.length : 'all passed');
})();
