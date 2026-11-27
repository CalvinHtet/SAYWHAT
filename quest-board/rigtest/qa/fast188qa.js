// QA, af6a81be + 71407471 (29zz_v188.js: taps while the save syncs are queued and replayed; look-only taps go at once). A real fast start
// on the sandbox web build: qb-lastuid + a device copy ("quest-board") make the boot draw the device copy with html.qb-sync on, and an
// init script holds the sandbox's online save (window.claude "db") for HOLD ms, so the syncing window is real and long enough to tap in.
//  A. the same save on both sides: during sync, tick a task (queued, marked), look-only taps (Edit, enter a building, the Shop's doors and
//     tabs, a gym plan) work at once and are not queued; type in the brain dump and ADD (queued); after the save is in: the task is done
//     once, the typed task was added
//  B. the online save is newer and already has the task ticked (ticked on another device): the device copy shows it open; tick it during
//     sync; after the save is in it must still be done (a replayed toggle would untick it)
//  C. the header (hdr185): the card's picture during the sync window is a real figure, not the empty gif
//   BASE=<sandbox dist-web index> OUT=<dir with state.json from _explore186.js> [HOLD=12000] NODE_PATH=<playwright> node rigtest/qa/fast188qa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8824/dist-web/index.html', OUT = process.env.OUT, HOLD = +process.env.HOLD || 12000;
const EPOCH = +process.env.EPOCH || 6; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const INIT = (HOLD) => { const t0 = Date.now(); const left = () => Math.max(0, HOLD - (Date.now() - t0)); window.__qaHoldEnd = t0 + HOLD;
  const later = (p) => p.then((v) => new Promise((r) => setTimeout(() => r(v), left())));
  const wrap = (o) => (!o || (typeof o !== 'object' && typeof o !== 'function') ? o : new Proxy(o, { get(t, k) { const v = t[k]; if (typeof v !== 'function') return v;
    return function (...a) { if (k === 'onSnapshot' && typeof a[0] === 'function') { const nx = a[0]; a[0] = (x) => setTimeout(() => nx(x), left()); } const r = v.apply(t, a); return r && typeof r.then === 'function' ? later(r) : wrap(r); }; } }));
  let C; Object.defineProperty(window, 'claude', { configurable: true, get() { return C; }, set(v) { C = v && v.use ? Object.assign({}, v, { use: (w) => { const r = v.use(w); return w === 'db' ? r.then(wrap) : r; } }) : v; } }); };
const Q = [{ id: 'qa1', name: 'Clean my room', xp: 20, stat: 'productivity', cl: 'home', rep: 'daily' }, { id: 'qa2', name: 'Read 10 pages', xp: 10, stat: 'creativity', cl: 'create', rep: 'daily' }];
const stateWith = (mut) => { const st = JSON.parse(fs.readFileSync(OUT + '/state.json', 'utf8')); const o = st.origins.find((x) => /8824/.test(x.origin)); const get = (k) => o.localStorage.find((x) => x.name === k);
  const dev = JSON.parse(get('quest-board').value), cl = JSON.parse(get('qbsbx:data/users/sandbox/state').value);
  for (const s of [dev, cl]) { s.quests = (s.quests || []).filter((q) => q.rep === 'weekly4').concat(JSON.parse(JSON.stringify(Q))); s.done = {}; s.tours = Object.assign({}, s.tours || {}, { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }); s.tutDone = 1; s.savedAt = Date.now() - 600000; s.epoch = EPOCH; }
  mut(dev, cl); get('quest-board').value = JSON.stringify(dev); get('qbsbx:data/users/sandbox/state').value = JSON.stringify(cl); const f = OUT + '/state_fast.json'; fs.writeFileSync(f, JSON.stringify(st)); return f; };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const open = async (stf) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, storageState: stf }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    await ctx.addInitScript(INIT, HOLD); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); const t0 = Date.now(); await p.goto(BASE);
    const okk = await p.waitForFunction(() => document.documentElement.classList.contains('qb-sync') && document.querySelector('.qmain[data-id="qa1"]'), null, { timeout: 30000 }).then(() => 1).catch(() => 0);
    if (!okk) { const d = await p.evaluate(() => ({ cls: document.documentElement.className, ids: [...document.querySelectorAll('.qmain[data-id]')].map((e) => e.dataset.id), last: localStorage.getItem('qb-lastuid'), dev: (() => { try { const d = JSON.parse(localStorage.getItem('quest-board')); return { epoch: d.epoch, created: d.created, uid: d.uid, q: (d.quests || []).map((q) => q.id) }; } catch (e) { return String(e); } })(), text: document.body.innerText.replace(/\s+/g, ' ').slice(0, 200) })); console.log('DEBUG ' + JSON.stringify(d)); await p.screenshot({ path: OUT + '/fast_dbg.png' }); throw new Error('no fast start'); }
    note('board on screen, syncing, after ' + (Date.now() - t0) + ' ms');
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub,#qbt,#qbsandbox{display:none!important}' }); return { ctx, p }; };
  const V = (p, f, a) => p.evaluate(f, a); const sync = (p) => V(p, () => document.documentElement.classList.contains('qb-sync'));
  const clr = (p) => V(p, () => document.querySelectorAll('#layer > *,.bsplash,.dropsplash').forEach((m) => m.remove()));
  const tapSee = async (p, lab, sel, see) => { const r = await V(p, ([sel, see]) => { const q0 = window.__qbV188 ? window.__qbV188.q().length : -1; const e = document.querySelector(sel); if (!e) return { miss: 1 };
      if (e.tagName === 'g') e.dispatchEvent(new MouseEvent('click', { bubbles: true })); else e.click(); return new Promise((res) => setTimeout(() => res({ queued: window.__qbV188.q().length > q0, saw: see ? !!document.querySelector(see) : null, sync: document.documentElement.classList.contains('qb-sync') }), 600)); }, [sel, see]);
    ok(!r.miss && !r.queued && (see ? r.saw : true) && r.sync, 'during sync, ' + lab + ' works at once (queued ' + r.queued + ', its screen ' + r.saw + ', still syncing ' + r.sync + ')'); return r; };
  /* A */
  { const { ctx, p } = await open(stateWith(() => {}));
    const hdr = await V(p, () => { const i = document.querySelector('.strip .avbtn img'); return { real: !!i && !/^data:image\/gif/.test(i.getAttribute('src') || ''), cached: !!i && i.getAttribute('data-v85') === '1', w: i ? i.naturalWidth : 0 }; });
    note('header during sync (first load of this save, may have no kept frame yet): ' + JSON.stringify(hdr));
    const t = await V(p, () => { const e = document.querySelector('.qmain[data-id="qa2"]'); e.click(); return new Promise((r) => setTimeout(() => { const S = window.__qb.x().S; r({ q: window.__qbV188.q(), marked: !!document.querySelector('.qmain[data-id="qa2"].v88q'), done: !!S.done.qa2 }); }, 400)); });
    await V(p, () => { window.__tl = []; let last = ''; setInterval(() => { try { const S = window.__qb.x().S; const k = [document.documentElement.classList.contains('qb-sync') ? 'SYNC' : 'in', S.done && S.done.qa2 ? 'done' : 'open', S.xp, S.total, window.__qbV188.q().length].join(' '); if (k !== last) { last = k; window.__tl.push(Date.now() % 100000 + ' ' + k); } } catch (e) {} }, 30); });
    ok(t.q.length === 1 && t.marked && !t.done, 'during sync, ticking a task is queued and marked, not done yet ' + JSON.stringify(t));
    await tapSee(p, 'Board Edit', '[data-act="qedit"]', null);
    await V(p, () => { const e = document.querySelector('[data-act="qedit"]'); if (e) e.click(); }); /* back out of edit */
    await clr(p); await tapSee(p, 'the Loft tab', '.nav button[data-v="hideout"]', '[data-act="bldgo"]');
    await tapSee(p, 'entering a building', '[data-act="bldgo"][data-v="0"]', '[data-act="bldout"]');
    await tapSee(p, '"← Street"', '[data-act="bldout"]', '[data-act="bldgo"]');
    await tapSee(p, 'the Shop tab', '.nav button[data-v="shop"]', '.qshop'); await V(p, () => { try { window.__qbV149.go('home'); } catch (e) {} }); await clr(p);
    await tapSee(p, 'the Street Shop door', '[data-shub="street"]', '.qs-sec'); await tapSee(p, 'a category tab', '.v81cats .v81c:nth-child(2)', '.v81cats .v81c.on');
    await V(p, () => { try { window.__qbV149.go('iface'); } catch (e) {} }); await tapSee(p, 'the Interface Effects tab', '[data-act="iftab"][data-v="fx"]', null);
    await clr(p); await tapSee(p, 'the Training tab', '.nav button[data-v="train"]', '[data-act="wkplan"]'); await tapSee(p, 'a gym plan', '[data-act="wkplan"]', '#layer .modal');
    await clr(p); await tapSee(p, 'the Board tab', '.nav button[data-v="board"]', '.qmain');
    const ty = await V(p, () => { const ta = document.querySelector('textarea'); if (!ta) return { miss: 1 }; ta.focus(); ta.value = 'Water the plants'; ta.dispatchEvent(new Event('input', { bubbles: true })); const add = [...document.querySelectorAll('button')].find((b) => /^add$/i.test(b.textContent.trim())); if (add) add.click();
      return new Promise((r) => setTimeout(() => r({ q: window.__qbV188.q(), val: (document.querySelector('textarea') || {}).value, added: window.__qb.x().S.quests.some((q) => /water the plants/i.test(q.name)) }), 400)); });
    ok(!ty.miss && ty.q.length === 2 && !ty.added, 'during sync, typing works and ADD is queued ' + JSON.stringify(ty));
    const still = await sync(p); note('still syncing after the taps: ' + still + ' (hold ' + HOLD + ' ms)');
    await p.waitForFunction(() => !document.documentElement.classList.contains('qb-sync'), null, { timeout: HOLD + 30000 }); await p.waitForTimeout(2500);
    const A = await V(p, () => { const S = window.__qb.x().S; return { done: !!S.done.qa2, ta: (document.querySelector('textarea') || {}).value, q: window.__qbV188.q().length, added: S.quests.filter((q) => /water the plants/i.test(q.name)).map((q) => q.name), marks: document.querySelectorAll('.v88q').length, pops: [...document.querySelectorAll('.pop,#pop,.toast')].map((e) => e.innerText).join(' | ').slice(0, 160) }; });
    note('A timeline: ' + JSON.stringify(await V(p, () => window.__tl)));
    ok(A.done && A.q === 0 && A.marks === 0, 'after the save is in: the queued tick went through once, the queue is empty, no marks left ' + JSON.stringify(A));
    ok(A.added.length === 1, 'after the save is in: the typed task was added (' + JSON.stringify(A.added) + ')');
    await p.screenshot({ path: OUT + '/fast_A.png' }); await ctx.close(); }
  /* B: ticked on another device */
  { const { ctx, p } = await open(stateWith((dev, cl) => { cl.done = { qa1: 20 }; cl.xp = (+cl.xp || 0) + 20; cl.total = (+cl.total || 0) + 1; cl.savedAt = Date.now() - 1000; }));
    const s0 = await V(p, () => !!window.__qb.x().S.done.qa1); await V(p, () => document.querySelector('.qmain[data-id="qa1"]').click());
    await V(p, () => { window.__tl = []; let last = ''; setInterval(() => { try { const S = window.__qb.x().S; const k = [document.documentElement.classList.contains('qb-sync') ? 'SYNC' : 'in', S.done && S.done.qa1 ? 'done' : 'open', S.xp, S.total, window.__qbV188.q().length].join(' '); if (k !== last) { last = k; window.__tl.push(Date.now() % 100000 + ' ' + k); } } catch (e) {} }, 30); });

    await p.waitForFunction(() => !document.documentElement.classList.contains('qb-sync'), null, { timeout: HOLD + 30000 }); await p.waitForTimeout(2500);
    const B = await V(p, () => { const S = window.__qb.x().S, m = document.querySelector('.qbsv'); return { done: !!S.done.qa1, xp: S.xp, picker: !!m }; });
    note('B timeline: ' + JSON.stringify(await V(p, () => window.__tl)));
    ok(!s0 && B.done && !B.picker, 'ticked on another device (the online save is newer and has it done; the device copy shows it open), ticked again during sync: it is still done after the save is in ' + JSON.stringify(B));
    await p.screenshot({ path: OUT + '/fast_B.png' }); await ctx.close(); }
  /* C: a second start of the same save: the kept header frame */
  { const { ctx, p } = await open(stateWith(() => {})); await p.waitForTimeout(HOLD + 4000); await ctx.storageState({ path: OUT + '/state_fast2.json' }); await ctx.close();
    const { ctx: c2, p: p2 } = await open(OUT + '/state_fast2.json'); const H = await V(p2, () => { const i = document.querySelector('.strip .avbtn img'); return { real: !!i && !/^data:image\/gif/.test(i.getAttribute('src') || ''), cached: !!i && i.getAttribute('data-v85') === '1', kept: !!localStorage.getItem('qb-hdr') }; });
    ok(H.real && H.cached, 'second start, still syncing: the header shows the kept picture at once ' + JSON.stringify(H)); await p2.screenshot({ path: OUT + '/fast_C.png' }); await c2.close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
