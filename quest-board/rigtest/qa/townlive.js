// The town board with several players at once (LEAD's 60e3e50, Cal: "make sure the town hall works with multiple people using the app
// and typing on the board"): Ana and Ben on one stand-in database (the dbcaps.json rules applied, as in townrules.js), both in the Hall.
// Ana types half a post and leaves it; the page repaints and the board reloads (every 20 s): her text, focus and caret must hold. Ben
// posts: Ana must see it on her own within 25 s, tagged "new". Then both post in the same moment: both posts must stay.
//   BASE=<server> QB=<quest-board folder of the build> node townlive.js
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
  await ana.bringToFront();
  // Ana types half a post, caret in the middle
  await ana.click('#sntext'); await ana.type('#sntext', 'half a thought about the gar');
  await ana.evaluate(() => { const t = document.getElementById('sntext'); t.setSelectionRange(10, 10); });
  const before = await ana.evaluate(() => { const t = document.getElementById('sntext'); return { v: t.value, s: t.selectionStart, f: document.activeElement === t }; });
  // Ben posts
  await ben.bringToFront(); await ben.fill('#sntext', 'Ben says hi to the town'); await ben.evaluate(() => document.querySelector('[data-act="snpost"]').click()); await ben.waitForTimeout(600);
  await ana.bringToFront();
  let seen = null; const t0 = Date.now();
  while (Date.now() - t0 < 26000) { await ana.waitForTimeout(1000); const r = await ana.evaluate(() => { const nb = document.getElementById('socnb'); if (!nb) return null; const t = nb.innerText; return /Ben says hi to the town/.test(t) ? { tagged: /<b>Ben<\/b><em class="tw-new">/.test(nb.innerHTML) } : null; }); if (r) { seen = Object.assign(r, { s: Math.round((Date.now() - t0) / 1000) }); break; } }
  ok('Ana sees Ben\'s post on her own, within 25 s, tagged new', seen && seen.s <= 25 && seen.tagged, seen);
  const afterReload = await ana.evaluate(() => { const t = document.getElementById('sntext'); return { v: t && t.value, s: t && t.selectionStart, f: !!t && document.activeElement === t }; });
  ok('the reload kept Ana\'s half-typed text, caret and focus', afterReload.v === before.v && afterReload.s === before.s && afterReload.f, afterReload);
  // last: a full game repaint (rare in the Hall: a new area opening, a raid ending)
  await ana.evaluate(() => window.__qb.x().render()); await ana.waitForTimeout(400);
  const afterRender = await ana.evaluate(() => { const t = document.getElementById('sntext'); return { v: t && t.value, s: t && t.selectionStart, f: !!t && document.activeElement === t }; });
  ok('a full game repaint keeps Ana\'s half-typed text, caret and focus', afterRender.v === before.v && afterRender.s === before.s && afterRender.f, { before, afterRender });
  // both post at once
  await ana.fill('#sntext', 'Ana at the same time'); await ben.fill('#sntext', 'Ben at the same time');
  const step = (p) => p.evaluate((now) => { window.__off = now; }, Date.now());
  await Promise.all([ana.evaluate(() => { const r = Date.now; Date.now = () => r() + 20000; document.querySelector('[data-act="snpost"]').click(); }), ben.evaluate(() => { const r = Date.now; Date.now = () => r() + 20000; document.querySelector('[data-act="snpost"]').click(); })]);
  await ana.waitForTimeout(1500);
  console.log('  (debug) pops: Ana', JSON.stringify(await ana.evaluate(() => [...document.querySelectorAll('.pop,.toast,#pop,[class*="pop"]')].map((e) => e.innerText).filter(Boolean).slice(-3))), 'Ben', JSON.stringify(await ben.evaluate(() => [...document.querySelectorAll('.pop,.toast,#pop,[class*="pop"]')].map((e) => e.innerText).filter(Boolean).slice(-3))), 'Ben box', JSON.stringify(await ben.evaluate(() => (document.getElementById('sntext') || {}).value)));
  const store = await ana.evaluate(() => { const g = (k) => JSON.parse(localStorage.getItem('__mdb:' + k) || '{}'); return { ana: (g('board/u_ana').posts || []).map((p) => p.text), ben: (g('board/u_ben').posts || []).map((p) => p.text) }; });
  ok('posting at the same moment keeps both posts', store.ana.includes('Ana at the same time') && store.ben.includes('Ben at the same time') && store.ben.includes('Ben says hi to the town'), store);
  ok('no page errors', errs.length === 0, errs);
  await b.close();
  console.log(fails.length ? 'FAILED ' + fails.length : 'all passed');
})();
