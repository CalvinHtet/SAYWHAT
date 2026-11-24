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
  /* Momentum Surge: away 3 full days, 5 tasks at x2 XP and x1.5 coins, then gone; Rested XP is gone */
  const day = (n) => V((n) => { const d = new Date(); d.setHours(12); d.setDate(d.getDate() - n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }, n);
  const mkq = () => V(() => { const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); S.quests = [1, 2, 3, 4, 5, 6, 7].map((k) => ({ id: 's' + k, name: 'Task ' + k, xp: 15, stat: 'discipline', cl: 'home', rep: 'once', mins: 10 })); S.done = {}; S.vdone = {}; S.cdone = {}; S.combo = null; S.streak = 0; delete S.surge; S.rest = { x: 500, from: '' }; });
  await mkq(); await V((d) => { window.__qb.x().S.lastDone = d; window.__qb.x().render(); }, await day(3)); ok(!(await V(() => window.__qbV144.surge())), 'away 2 full days: no surge');
  await mkq(); await V((d) => { const x = window.__qb.x(); x.S.lastDone = d; document.querySelector('.nav button[data-v="board"]').click(); x.render(); }, await day(4)); await p.waitForTimeout(500);
  const sg = await V(() => ({ g: window.__qbV144.surge(), splash: (document.querySelector('#layer .surge') || {}).innerText || '', bar: (document.querySelector('.surgebar') || {}).innerText || '' }));
  ok(sg.g && sg.g.n === 5 && /Welcome back/.test(sg.splash) && /Momentum Surge/i.test(sg.splash) && /badass/.test(sg.splash), 'away 3 full days: the welcome back window and 5 surged tasks: ' + sg.splash.replace(/\s+/g, ' ').slice(0, 150));
  await p.screenshot({ path: OUT + '/batch144_surge.png' }); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const pays = await V(() => { const x = window.__qb.x(), S = x.S, out = []; for (let k = 1; k <= 7; k++) { const q = S.quests.find((z) => z.id === 's' + k), base = x.mults(q, {}), c0 = S.coins, x0 = S.xp; const tags = base.tags.join(); x.toggle(q.id); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); out.push({ xp: S.xp - x0, coins: S.coins - c0, surged: /Momentum Surge/.test(tags), left: window.__qbV144.left() }); S.combo = null; } return out; });
  console.log('pays', JSON.stringify(pays)); const s5 = pays.slice(0, 5), s2 = pays.slice(5);
  ok(s5.every((r) => r.surged) && s2.every((r) => !r.surged) && pays[4].left === 0, 'tasks 1 to 5 are surged, 6 and 7 are not');
  ok(s5.every((r) => r.xp >= 2 * s2[0].xp * 0.9) && s2[0].xp < 30, 'surged tasks pay about double XP (' + s5.map((r) => r.xp).join(',') + ' vs ' + s2.map((r) => r.xp).join(',') + '): Rested XP adds nothing');
  ok(await V(() => { const x = window.__qb.x(), S = x.S; const x0 = S.xp; x.toggle('s1'); const back = x0 - S.xp; const x1 = S.xp; x.toggle('s1'); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return back > 0 && S.xp - x1 >= back * 0.9 && window.__qbV144.left() === 0; }), 'unticking a surged task and ticking it again keeps its surge and uses no other');
  await V(() => window.__qbV144.check()); ok((await V(() => window.__qbV144.left())) === 0 && !(await V(() => document.querySelector('#layer .surge'))), 'not given twice for the same absence');
  /* surprise loot */
  const kinds = await V(() => { const c = {}; for (let i = 0; i < 1000; i++) { const k = window.__qbV144.loot.kind((i + .5) / 1000); c[k] = (c[k] || 0) + 1; } return c; });
  ok(kinds.chest === 450 && kinds.stone === 350 && kinds.cloth === 120 && kinds.furn === 60 && kinds.bout === 20 && Math.abs(await V(() => window.__qbV144.loot.p) - 1 / 15) < 1e-9, '1 in 15, split ' + JSON.stringify(kinds));
  await mkq(); await V(() => { const S = window.__qb.x().S; S.lastDone = null; delete S.loot; window.__qbV144.loot.rnd(() => .5); });
  const noLoot = await V(async () => { const x = window.__qb.x(), S = x.S; x.toggle('s1'); await new Promise((r) => setTimeout(r, 1500)); return { n: window.__qbV144.loot.state().n, m: !!document.querySelector('#layer .lootm') }; });
  ok(noLoot.n === 0 && !noLoot.m, 'a roll over 1/15: no loot');
  const chest = await V(async () => { const x = window.__qb.x(), S = x.S; let k = 0; window.__qbV144.loot.rnd(() => (k++ ? .01 : .01)); const plain = S.cdone.s1; const c0 = S.coins; x.toggle('s2'); const got = S.coins - c0 - S.cdone.s2; await new Promise((r) => setTimeout(r, 1600));
    const m = document.querySelector('#layer .lootm'), txt = m ? m.innerText.replace(/\s+/g, ' ') : ''; document.querySelectorAll('#layer .modal').forEach((q) => q.remove());
    const c1 = S.coins; x.toggle('s2'); x.toggle('s2'); await new Promise((r) => setTimeout(r, 1500)); const again = !!document.querySelector('#layer .lootm'); return { got, txt, again, n: window.__qbV144.loot.state().n, lv: x.effLvl() }; });
  ok(chest.got >= 180 && chest.got <= 520 && /SURPRISE LOOT/i.test(chest.txt) && /Treasure chest/.test(chest.txt), 'a roll under 1/15: a chest of ' + chest.got + ' coins and its window: ' + chest.txt.slice(0, 80));
  ok(!chest.again && chest.n === 1, 'unticking and ticking the same task does not roll again');
  await V(() => window.__qbV144.loot.rnd(null));
  const st = await V(() => { const x = window.__qb.x(), S = x.S, x0 = S.xp; const o = window.__qbV144.loot.give('stone'); document.querySelectorAll('#layer .modal').forEach((q) => q.remove()); return { o, d: S.xp - x0, need: x.need(x.effLvl()) }; });
  ok(st.o.k === 'stone' && st.d === st.o.xp && st.d >= 40 && st.d <= 400, 'a soul stone: +' + st.d + ' XP (a level here is ' + st.need + ')');
  const cl = await V(() => { const x = window.__qb.x(), S = x.S, out = []; for (let i = 0; i < 12; i++) { const o = window.__qbV144.loot.give(i % 2 ? 'bout' : 'cloth'); document.querySelectorAll('#layer .modal').forEach((q) => q.remove()); const it = x.SHOP.find((z) => z[0] === o.it); out.push({ k: o.k, id: o.it, owned: !!S.owned[o.it], slot: it && it[1], b: it && it[6] && it[6].b }); } return out; });
  ok(cl.every((c) => c.k === 'cloth' && c.owned && /^a_/.test(c.slot || '')) , 'clothing: owned at once; a Boutique roll before the Boutique opens is a Street piece: ' + cl.slice(0, 4).map((c) => c.id + '/' + c.b).join(', '));
  const fu = await V(() => { const x = window.__qb.x(), S = x.S; try { window.__qbRooms.open('closet', 1); } catch (e) {} const list = window.__qbV144.loot.furn(), c0 = S.coins, sp0 = S.spent || 0; const o = window.__qbV144.loot.give('furn'); document.querySelectorAll('#layer .modal').forEach((q) => q.remove());
    const r = S.base.slots.find((q) => q && (x.ADDONS[q.t] || []).some((a) => a[0] === o.ad)); const ad = r && (x.ADDONS[r.t] || []).find((a) => a[0] === o.ad); return { list, o, in: !!(r && r.a[o.ad]), free: S.coins >= c0 && (S.spent || 0) === sp0, dc: S.coins - c0, opens: !!(ad && ad[3] && ad[3].opens) }; });
  ok(fu.list.length > 0 && fu.list.every((f) => f[2] > 0 && f[2] < 1000), 'furniture on offer for loot: the cheapest buyable piece per room, all under 1,000: ' + JSON.stringify(fu.list));
  ok(fu.o.k === 'furn' && fu.in && fu.free && !fu.opens && fu.o.price < 1000, 'a furniture drop is installed, costs nothing and opens no room: ' + JSON.stringify(fu.o) + ' ' + JSON.stringify({ in: fu.in, free: fu.free, dc: fu.dc, opens: fu.opens }));
  await V(() => { window.__qbV144.loot.give('stone'); }); await p.waitForTimeout(700); await p.screenshot({ path: OUT + '/batch144_loot.png' }); await V(() => document.querySelectorAll('#layer .modal').forEach((q) => q.remove()));
  /* the info sheets */
  const inf = await V(() => ({ dq: window.__qbV144.info('dq').join(' | '), tr: window.__qbV144.info('train').join(' | ') }));
  ok(!/half a level|Rested/.test(inf.dq) && /Weekly Quest: be active \(50\+ XP\) on 4 days, Monday to Sunday, for \+[\d,]+ XP/.test(inf.dq) && /Momentum Surge/.test(inf.dq), 'the Daily Quest (i): ' + inf.dq.slice(-230));
  ok(/x0\.25/.test(inf.tr) && !/x3|starts over/.test(inf.tr), 'the Training (i): ' + inf.tr.slice(-120));
  await p.screenshot({ path: OUT + '/batch144.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
