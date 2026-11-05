// Saving, with a fake database that behaves like the real one: every snapshot's data() is deep frozen (that frozen data is
// what broke online saves from about v37 to v44). Each case seeds what is online and what is on this device, loads the real
// app, and checks what got loaded, what was written back, and that the other save is kept.
// BASE=http://127.0.0.1:8766 node savecheck.js [case,case]
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8766';
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const UID = 'u_test', STATE = 'data/users/' + UID + '/state', BACKUP = 'data/users/' + UID + '/backup', OTHER = 'data/users/' + UID + '/backup_choice';

// A save as an older version wrote it: no savedAt. Flags that make merge() leave the numbers alone.
const save = (over) => Object.assign({ epoch: 2, appv: 34, created: true, rst2: true, xpc2: 1, v001: 1, k10: 1, hire1: true, char: { name: 'Tester', sex: 'f' }, xp: 700, total: 10, coins: 1000, earnedC: 1000, spent: 0, lvPaid: 8, runDate: '2026-11-05', quests: [], stats: { creativity: 2, discipline: 3, fitness: 0, productivity: 7, social: 0 } }, over);
const ONLINE = save({ xp: 715, total: 12, coins: 8000, char: { name: 'Online', sex: 'f' } });
const DEVICE = save({ xp: 980, total: 31, coins: 2500, char: { name: 'Device', sex: 'f' }, appv: 44 });

function fakeRuntime() {
  const KEY = '__fakedb';
  const load = () => JSON.parse(localStorage.getItem(KEY) || '{}');
  const store = (o) => localStorage.setItem(KEY, JSON.stringify(o));
  const freeze = (o) => { if (o && typeof o === 'object') { Object.values(o).forEach(freeze); Object.freeze(o); } return o; };
  const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
  const doc = (path) => ({
    get: async () => { const v = load()[path]; return { exists: v !== undefined, id: path.split('/').pop(), data: () => freeze(copy(v)) }; },
    set: async (d) => { const o = load(); o[path] = copy(d); store(o); window.__fakeWrites = (window.__fakeWrites || 0) + 1; },
    delete: async () => { const o = load(); delete o[path]; store(o); },
    onSnapshot: () => () => {},
  });
  const collection = (path) => {
    const q = {
      where: () => q, orderBy: () => q, limit: () => q, doc: (k) => doc(path + '/' + k),
      get: async () => { const o = load(), n = path.split('/').length + 1; return { docs: Object.keys(o).filter((k) => k.startsWith(path + '/') && k.split('/').length === n).map((k) => ({ id: k.split('/').pop(), data: () => freeze(copy(o[k])) })) }; },
    };
    return q;
  };
  const db = { doc, collection };
  const user = { id: async () => 'u_test', isOwner: async () => true };
  window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) };
}

async function start(b, { online, device, others }) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(fakeRuntime);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE + '/dist/art_ui.js');
  await p.evaluate(({ online, device, others, STATE }) => {
    const o = Object.assign({}, others || {});
    if (online) o[STATE] = online;
    localStorage.setItem('__fakedb', JSON.stringify(o));
    if (device) localStorage.setItem('quest-board', JSON.stringify(device));
  }, { online, device, others, STATE });
  return { ctx, p, errs };
}
const open = async (p) => { await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 60000 }); await p.waitForTimeout(1500); };
const now = (p) => p.evaluate(() => { const S = window.__qb.x().S, el = document.getElementById('savest'); return { name: S.char && S.char.name, xp: S.xp, total: S.total, label: el ? el.textContent : null, boot: window.__qbBootErr || null, dialog: !!document.querySelector('.qbsv') }; });
const dbDoc = (p, path) => p.evaluate((path) => JSON.parse(localStorage.getItem('__fakedb') || '{}')[path] || null, path);
const device = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('quest-board') || 'null'));
const settle = (p) => p.waitForTimeout(900);
const fails = [];
const check = (name, ok, got) => { console.log((ok ? '  ok   ' : '  FAIL ') + name + (ok ? '' : '  got: ' + JSON.stringify(got))); if (!ok) fails.push(name); };

const CASES = {
  async online_only(b) {
    const { ctx, p, errs } = await start(b, { online: ONLINE });
    await open(p);
    const s = await now(p);
    check('loads the online save', s.name === 'Online' && s.xp === 715, s);
    check('no boot error', !s.boot, s.boot);
    check('saving online, not stuck on this device', s.label && !/this device only/.test(s.label), s.label);
    check('no dialog', !s.dialog, s);
    check('no page errors', !errs.length, errs);
    await ctx.close();
  },
  async save_and_reload(b) {
    const { ctx, p, errs } = await start(b, { online: save({ coins: 8000, savedAt: 1000 }), device: null });
    await open(p);
    await p.evaluate(() => { const x = window.__qb.x(); x.S.coins = 7000; x.S.spent = 1000; x.S.owned.gx_h_beret = true; x.persist(); });
    await settle(p);
    const online = await dbDoc(p, STATE);
    check('a change reaches the online save', online && online.coins === 7000 && online.owned.gx_h_beret && online.savedAt > 1000, online && { coins: online.coins, savedAt: online.savedAt });
    const s = await now(p);
    check('header says it saved online', /^saved \d/.test(s.label || ''), s.label);
    await open(p);
    const c = await p.evaluate(() => ({ coins: window.__qb.x().S.coins, beret: !!window.__qb.x().S.owned.gx_h_beret }));
    check('still there after a reload', c.coins === 7000 && c.beret, c);
    check('no page errors', !errs.length, errs);
    await ctx.close();
  },
  async conflict_pick_device(b) {
    const { ctx, p, errs } = await start(b, { online: ONLINE, device: DEVICE });
    await p.goto(BASE + '/dist/index.html');
    await p.waitForSelector('.qbsv', { timeout: 60000 });
    if (process.env.SHOT) { await p.waitForTimeout(400); await p.screenshot({ path: process.env.SHOT }); }
    const text = await p.$eval('.qbsv', (e) => e.innerText);
    check('dialog shows both saves', /Level/.test(text) && /31 quests/i.test(text) && /12 quests/i.test(text), text);
    const onlineBefore = await dbDoc(p, STATE);
    check('nothing overwritten while the question is open', onlineBefore.xp === 715, onlineBefore.xp);
    await p.click('.qbsv [data-pick="local"]');
    await p.waitForFunction(() => !document.querySelector('.qbsv'));
    await p.waitForTimeout(1500);
    const s = await now(p), online = await dbDoc(p, STATE), other = await dbDoc(p, OTHER);
    check('plays on the device save', s.name === 'Device' && s.xp === 980, s);
    check('online save now holds it', online.xp === 980 && online.char.name === 'Device', online.xp);
    check('old online save kept as a backup', other && other.xp === 715, other && other.xp);
    await open(p);
    const r = await now(p);
    check('no second question after a reload', !r.dialog && r.xp === 980, r);
    check('no page errors', !errs.length, errs);
    await ctx.close();
  },
  async conflict_pick_online(b) {
    const { ctx, p, errs } = await start(b, { online: ONLINE, device: DEVICE });
    await p.goto(BASE + '/dist/index.html');
    await p.waitForSelector('.qbsv', { timeout: 60000 });
    await p.click('.qbsv [data-pick="cloud"]');
    await p.waitForFunction(() => !document.querySelector('.qbsv'));
    await p.waitForTimeout(1500);
    const s = await now(p), other = await dbDoc(p, OTHER), dev = await device(p);
    check('plays on the online save', s.name === 'Online' && s.xp === 715, s);
    check('device save kept as a backup', other && other.xp === 980, other && other.xp);
    check('this device now matches', dev && dev.xp === 715, dev && dev.xp);
    await open(p);
    const r = await now(p);
    check('no second question after a reload', !r.dialog && r.xp === 715, r);
    check('no page errors', !errs.length, errs);
    await ctx.close();
  },
  async newest_wins_quietly(b) {
    const { ctx, p } = await start(b, { online: save({ xp: 800, total: 20, char: { name: 'Online', sex: 'f' }, savedAt: 2000 }), device: save({ xp: 750, total: 15, char: { name: 'Device', sex: 'f' }, savedAt: 1000 }) });
    await open(p);
    const s = await now(p);
    check('online is newer: loads it, no question', s.name === 'Online' && !s.dialog, s);
    await ctx.close();
    const t = await start(b, { online: save({ xp: 800, total: 20, char: { name: 'Online', sex: 'f' }, savedAt: 1000 }), device: save({ xp: 850, total: 25, char: { name: 'Device', sex: 'f' }, savedAt: 2000 }) });
    await open(t.p);
    await t.p.waitForTimeout(800);
    const u = await now(t.p), online = await dbDoc(t.p, STATE);
    check('device is newer: loads it, no question, uploads it', u.name === 'Device' && !u.dialog && online.xp === 850, { u, xp: online.xp });
    await t.ctx.close();
  },
  async same_save_no_question(b) {
    const { ctx, p } = await start(b, { online: ONLINE, device: Object.assign({}, ONLINE) });
    await open(p);
    const s = await now(p);
    check('identical progress: no question', !s.dialog && s.xp === 715, s);
    await ctx.close();
  },
  async device_only(b) {
    const { ctx, p } = await start(b, { online: null, device: DEVICE });
    await open(p);
    await p.waitForTimeout(800);
    const s = await now(p), online = await dbDoc(p, STATE);
    check('loads the device save, no question', s.name === 'Device' && !s.dialog, s);
    check('and uploads it', online && online.xp === 980, online && online.xp);
    await ctx.close();
  },
  async someone_elses_device_save(b) {
    const { ctx, p } = await start(b, { online: ONLINE, device: save({ xp: 999, total: 99, uid: 'u_other', savedAt: 9e12, char: { name: 'Other', sex: 'm' } }) });
    await open(p);
    const s = await now(p);
    check("another person's save on this browser is ignored", s.name === 'Online' && !s.dialog, s);
    await ctx.close();
  },
  async speed_log(b) {
    const { ctx, p, errs } = await start(b, { online: ONLINE });
    await open(p);
    await p.waitForTimeout(9000);
    const d = await dbDoc(p, 'diag/perf');
    const log = d ? JSON.parse(d.log) : [];
    check('owner speed log reaches diag/perf', log.length > 0 && log[0].fps > 0, d && d.log);
    check('no page errors', !errs.length, errs);
    await ctx.close();
  },
  async curve_keeps_level(b) {
    // Saves from before the new XP curve (no xpc2): level 8 (cheaper now: may rise), 30 and 60 (dearer now: must not drop).
    const old = (L) => Math.round(((L - 1) * 100 + .19 * (L - 2) * (L - 1) * (2 * L - 3) / 6) / 5) * 5;
    for (const L of [8, 30, 60]) {
      const xp = Math.round((old(L) + old(L + 1)) / 2);
      const { ctx, p, errs } = await start(b, { online: save({ xp, xpc2: undefined, lvPaid: L, char: { name: 'Old' + L, sex: 'f' } }) });
      await open(p);
      const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; return { lv: x.lvlOf(S.xp), xp: S.xp, c2: S.xpc2, need: x.need(x.lvlOf(S.xp)) }; });
      check('old level ' + L + ' does not drop (now ' + r.lv + ')', r.lv >= L && r.c2 === 1, r);
      check('no page errors', !errs.length, errs);
      await ctx.close();
    }
  },
  async new_player(b) {
    const { ctx, p, errs } = await start(b, { online: null, device: null });
    await open(p);
    const s = await now(p), online = await dbDoc(p, STATE);
    check('starts clean, no question, nothing blank written online', !s.dialog && !online, { s, online });
    check('no page errors', !errs.length, errs);
    await ctx.close();
  },
};

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const name of Object.keys(CASES)) {
    if (ONLY.length && !ONLY.includes(name)) continue;
    console.log(name);
    try { await CASES[name](b); } catch (e) { check(name + ' ran', false, String(e.message || e).slice(0, 300)); }
  }
  await b.close();
  console.log(fails.length ? 'FAILED: ' + fails.length : 'all passed');
  process.exit(fails.length ? 1 : 0);
})();
