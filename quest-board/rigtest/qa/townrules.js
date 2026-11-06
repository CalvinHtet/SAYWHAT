// The town database rules (LEAD's ab6a66e): LEAD's two-player test (shots/townrules_lead.js) on a stand-in database that applies
// the rules in app/dbcaps.json themselves (not a hand-written guard): the most specific matching rule wins, {self} is the
// player's own id, levels view < interact < admin < owner, data/users/<id>/ private to that id, a path with no rule open to
// every signed-in reader and every Contributor (interact) writer (the db capability's default). Friends are Contributors.
// On top of LEAD's 16 checks: a friend (Ben) tries to write every doc that is not his (another player's worlds, board and pings,
// the owner's quest inbox, the old save, diag, another player's private save): each must be refused; a third player; the board
// keeps 10 posts per player; a note older than 14 days is dropped when the sender writes a new one.
//   BASE=<server> QB=<quest-board folder of the build> node townrules.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
const CAPS = JSON.parse(fs.readFileSync(path.join(process.env.QB || '.', 'app/dbcaps.json'), 'utf8')).capabilities.db.rules;
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (c ? '' : '  ' + JSON.stringify(g))); if (!c) fails.push(n); };
const MOCK = ({ uid, owner, rules }) => {
  const K = '__mockdb', load = () => JSON.parse(localStorage.getItem(K) || '{}'), save = (o) => localStorage.setItem(K, JSON.stringify(o));
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
    set: async (d) => { guard(p, 'write'); const o = load(); o[p] = JSON.parse(JSON.stringify(d)); save(o); },
    delete: async () => { guard(p, 'write'); const o = load(); delete o[p]; save(o); } });
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
  const clickAct = (p, act, extra) => p.evaluate(([act, extra]) => { const el = document.querySelector('[data-act="' + act + '"]' + (extra || '')); if (!el) return false; el.click(); return true; }, [act, extra]);
  // LEAD's checks
  const ana = await open('u_ana', true, 'Ana');
  await ana.evaluate(() => { const o = JSON.parse(localStorage.getItem('__mockdb') || '{}'); o['board/u_old_123'] = { from: 'u_old', text: 'old layout', t: 1 }; localStorage.setItem('__mockdb', JSON.stringify(o)); });
  await ana.fill('#sntext', 'hello from Ana'); ok('Ana posts', await clickAct(ana, 'snpost'), null); await ana.waitForTimeout(600);
  const ben = await open('u_ben', false, 'Ben');
  await ben.waitForTimeout(800);
  await ben.fill('#sntext', 'Ben was here'); await clickAct(ben, 'snpost'); await ben.waitForTimeout(600);
  await clickAct(ben, 'snref'); await ben.waitForTimeout(800);
  const bt = await ben.evaluate(() => document.getElementById('socnb').innerText);
  ok('Ben sees Ana in the neighbors', /Ana/.test(bt), bt.slice(0, 400));
  ok('Ben sees both posts, newest first', bt.indexOf('Ben was here') >= 0 && bt.indexOf('hello from Ana') > bt.indexOf('Ben was here'), bt.slice(0, 600));
  ok('the old-layout doc is not shown', !/old layout/.test(bt), null);
  ok('Ben can delete only his own post', (await ben.evaluate(() => document.querySelectorAll('#socnb [data-act="sndel"]').length)) === 1, null);
  ok('posts carry the poster\'s look', await ben.evaluate(() => document.querySelectorAll('#socnb .snp.has-look').length >= 2), await ben.evaluate(() => document.querySelectorAll('#socnb .snp').length));
  ok('Ben opens Ana\'s Loft', await clickAct(ben, 'snvisit', '[data-u="u_ana"]'), null); await ben.waitForTimeout(800);
  await ben.fill('#snmsg', 'nice garden'); await clickAct(ben, 'snhi', '[data-u="u_ana"]'); await ben.waitForTimeout(800);
  ok('the guest book shows Ben\'s note', /nice garden/.test(await ben.evaluate(() => (document.getElementById('snnotes') || {}).innerText || '')), null);
  await ben.evaluate(() => document.querySelectorAll('.modal').forEach((e) => e.remove()));
  await clickAct(ben, 'snvisit', '[data-u="u_ana"]'); await ben.waitForTimeout(600);
  await ben.fill('#snmsg', 'see you tomorrow'); await clickAct(ben, 'snhi', '[data-u="u_ana"]'); await ben.waitForTimeout(800);
  const gb = await ben.evaluate(() => (document.getElementById('snnotes') || {}).innerText || '');
  ok('one note per visitor, the newest', /see you tomorrow/.test(gb) && !/nice garden/.test(gb), gb);
  await ben.evaluate(() => document.querySelectorAll('.modal').forEach((e) => e.remove()));
  await clickAct(ana, 'snref'); await ana.waitForTimeout(1000);
  const at = await ana.evaluate(() => document.getElementById('socnb').innerText);
  ok('Ana sees Ben visited, with his note', /Visited you today: Ben/.test(at) && /see you tomorrow/.test(at), at.slice(0, 300));
  ok('Ana gets the visit buff', await ana.evaluate(() => (window.__qb.x().S.social.vis || []).length === 1), null);
  await clickAct(ben, 'sndel'); await ben.waitForTimeout(600); await clickAct(ben, 'snref'); await ben.waitForTimeout(800);
  const bt2 = await ben.evaluate(() => document.getElementById('socnb').innerText);
  ok('Ben\'s post is gone, Ana\'s stays', !/Ben was here/.test(bt2) && /hello from Ana/.test(bt2), bt2.slice(0, 400));
  const store = await ben.evaluate(() => JSON.parse(localStorage.getItem('__mockdb')));
  ok('docs are one per player', Object.keys(store).filter((k) => /^(board|pings|worlds)\//.test(k)).sort().join(' ') === 'board/u_ana board/u_ben board/u_old_123 pings/u_ben worlds/u_ana worlds/u_ben', Object.keys(store).filter((k) => /^(board|pings|worlds)\//.test(k)));
  ok('no game write was refused (Ana, the owner)', (await ana.evaluate(() => window.__denied)).length === 0, await ana.evaluate(() => window.__denied));
  ok('no game write was refused (Ben), diag aside', (await ben.evaluate(() => window.__denied.filter((x) => !/ diag\//.test(x)))).length === 0, await ben.evaluate(() => window.__denied));
  // QA: a third player sees both
  const cy = await open('u_cy', false, 'Cy');
  await cy.fill('#sntext', 'Cy says hi'); await clickAct(cy, 'snpost'); await cy.waitForTimeout(600); await clickAct(cy, 'snref'); await cy.waitForTimeout(900);
  const ct = await cy.evaluate(() => document.getElementById('socnb').innerText);
  ok('Cy (a third player) sees Ana, Ben and their own post', /Ana/.test(ct) && /Ben/.test(ct) && /Cy says hi/.test(ct) && /hello from Ana/.test(ct), ct.slice(0, 400));
  // QA: the board keeps each player's last 10 posts
  // posting waits 15 s between posts ("Slow down a little"): the page's clock is stepped 16 s before each
  await cy.evaluate(() => { const real = Date.now.bind(Date); window.__off = 0; Date.now = () => real() + window.__off; });
  for (let i = 1; i <= 12; i++) { await cy.evaluate(() => { window.__off += 16000; }); await cy.fill('#sntext', 'cy post ' + i); await clickAct(cy, 'snpost'); await cy.waitForTimeout(300); }
  await cy.waitForTimeout(600);
  const cp = await cy.evaluate(() => { const d = JSON.parse(localStorage.getItem('__mockdb'))['board/u_cy']; return d && d.posts ? d.posts.map((p) => p.text) : null; });
  ok('Cy\'s board doc keeps the newest 10 posts', cp && cp.length === 10 && cp[0] === 'cy post 12' && !cp.includes('Cy says hi'), cp);
  // QA: an old note (15 days) is dropped when the sender writes a new one; a 13-day one stays
  await ben.evaluate(() => { const o = JSON.parse(localStorage.getItem('__mockdb')), d = o['pings/u_ben'];
    d.sent.u_old15 = { toName: 'Old', d: '2026-10-22', t: Date.now() - 15 * 864e5, msg: 'old' }; d.sent.u_old13 = { toName: 'Mid', d: '2026-10-24', t: Date.now() - 13 * 864e5, msg: 'mid' }; localStorage.setItem('__mockdb', JSON.stringify(o)); });
  await clickAct(ben, 'snref'); await ben.waitForTimeout(900); await clickAct(ben, 'snvisit', '[data-u="u_cy"]'); await ben.waitForTimeout(700); await ben.fill('#snmsg', 'hi Cy'); await clickAct(ben, 'snhi', '[data-u="u_cy"]'); await ben.waitForTimeout(800);
  const sent = await ben.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('__mockdb'))['pings/u_ben'].sent).sort());
  ok('Ben\'s note doc: 15-day note dropped, 13-day kept, new note to Cy added', sent.join(' ') === 'u_ana u_cy u_old13', sent);
  // QA: a friend (Ben, a Contributor) writes every doc that is not his: each must be refused by the rules
  const tries = ['worlds/u_ana', 'board/u_ana', 'pings/u_ana', 'board/u_ana_123', 'inbox/owner', 'player/state', 'diag/frame', 'data/users/u_ana/state', 'worlds/u_ana/x/y'];
  const res = await ben.evaluate(async (tries) => { const db = await window.claude.use('db'), out = {};
    for (const t of tries) { try { await db.doc(t).set({ by: 'ben', items: [{ id: 'evil', name: 'Planted quest', xp: 999 }] }); out[t] = 'WRITTEN'; } catch (e) { out[t] = 'refused'; } }
    return out; }, tries);
  for (const t of tries) ok(`a friend cannot write ${t}`, res[t] === 'refused', res[t]);
  const reads = await ben.evaluate(() => ({ inbox: window.__can('inbox/owner', 'read'), diag: window.__can('diag/frame', 'read'), anaSave: window.__can('data/users/u_ana/state', 'read'), oldSave: window.__can('player/state', 'read') }));
  ok('a friend cannot read the owner\'s inbox, diag, old save or another player\'s save', !reads.inbox && !reads.diag && !reads.anaSave && !reads.oldSave, reads);
  ok('no page errors', errs.length === 0, errs);
  await b.close();
  console.log(fails.length ? 'FAILED ' + fails.length + ': ' + fails.join('; ') : 'all passed');
})();
