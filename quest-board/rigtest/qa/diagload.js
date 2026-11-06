// diag/load (LEAD's a384feb): how a visit loaded, written for the owner only. On a stand-in database (kept across visits in
// localStorage), the owner visits twice (the second a reload, cache on) and a friend once: the owner's diag/load must hold one
// entry per visit, 18 scripts each, the bar and ready times, and on the second visit files from the cache or only checked; the
// friend writes nothing there.   BASE=<server> node diagload.js
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
const MOCK = ({ uid, owner }) => {
  const K = '__mockdb', load = () => JSON.parse(localStorage.getItem(K) || '{}'), save = (o) => localStorage.setItem(K, JSON.stringify(o));
  const snap = (p, d) => ({ id: p.split('/').pop(), exists: d !== undefined, data: () => (d === undefined ? undefined : JSON.parse(JSON.stringify(d))) });
  const doc = (p) => ({ id: p.split('/').pop(), get: async () => snap(p, load()[p]), set: async (d) => { if (/^diag\//.test(p) && !owner) throw { code: 'permission-denied' }; const o = load(); o[p] = JSON.parse(JSON.stringify(d)); save(o); }, delete: async () => { const o = load(); delete o[p]; save(o); }, onSnapshot: () => () => {} });
  const coll = (p, lim) => ({ doc: (k) => doc(p + '/' + k), limit: (n) => coll(p, n), orderBy: () => coll(p, lim), where: () => coll(p, lim),
    get: async () => { const o = load(), n = p.split('/').length + 1; return { docs: Object.keys(o).filter((k) => k.startsWith(p + '/') && k.split('/').length === n).map((k) => snap(k, o[k])).slice(0, lim || 1e9) }; } });
  window.claude = { use: async (n) => (n === 'db' ? { doc, collection: (p) => coll(p) } : n === 'user' ? { id: async () => uid, isOwner: async () => owner } : null) };
};
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(); const errs = [];
  const visit = async (p) => { await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(10500); };
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(MOCK, { uid: 'u_cal', owner: true });
  await p.goto(BASE + '/dist/index.html'); await visit(p);
  await p.reload(); await visit(p);
  const d = await p.evaluate(() => { const o = JSON.parse(localStorage.getItem('__mockdb') || '{}')['diag/load']; return o ? JSON.parse(o.log) : null; });
  if (!d) console.log('FAIL owner: no diag/load');
  else d.forEach((v, k) => console.log(`owner visit ${k + 1}: appv ${v.appv}, ${v.files} scripts, bar ${v.bar} ms, ready ${v.ready} ms, dcl ${v.dcl} ms, downloaded ${(v.tx / 1e6).toFixed(2)} MB of ${(v.body / 1e6).toFixed(1)} MB, from cache ${v.cached}, checked ${v.checked}`));
  const f = await ctx.newPage(); f.on('pageerror', (e) => errs.push('friend: ' + e.message));
  await f.addInitScript(MOCK, { uid: 'u_ben', owner: false });
  await f.goto(BASE + '/dist/index.html'); await visit(f);
  const d2 = await f.evaluate(() => { const o = JSON.parse(localStorage.getItem('__mockdb') || '{}')['diag/load']; return o ? JSON.parse(o.log).length : 0; });
  console.log(`after a friend's visit: diag/load entries ${d2} (the owner's ${d ? d.length : 0}; the friend must add none)`);
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
