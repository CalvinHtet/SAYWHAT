// QA, v1.49 (29zz_v152.js): another player's companion is always drawn in its first form, whatever this player's own has become
// (P2OTHER), on their card, their Hall window and their card posts; the published world doc carries no form; "Post my card" puts the
// card on the Town board and its delete takes it off. The sandbox web build (its own uid "sandbox", posting works offline).
//   WEB=<server of quest-board/ with a sandbox dist-web> OUT=<dir> node p2other149.js
const pw = require('playwright');
const WEB = process.env.WEB, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
  await p.fill('#ccname', 'Mine'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]');
  await p.waitForFunction(() => window.__qb && window.__qbV152 && window.__qbV150 && document.querySelector('.nav button'), null, { timeout: 180000 }); await p.waitForTimeout(3000);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(30) + 5; S.gates = [5, 10, 20, 30]; S.tutDone = 1; S.tours = Object.assign(S.tours || {}, { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }); S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    S.pet = { k: 'wolf', t: Date.now() }; const P = window.__qbV150.state(); P.own = { wolf: { n: 'Ash', xp: 954, evo: 1, form: 1, asked: 1, t: Date.now() } }; x.persist(); x.render(); });
  const src = (sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => (e.getAttribute('src') || '').slice(-60)), sel);
  const ref = await p.evaluate(() => { const V = window.__qbV152; const s = (h) => { const d = document.createElement('div'); d.innerHTML = h; const i = d.querySelector('.pc-stage img.fsh-pet'); return i ? i.dataset.pzk : 'none'; };
    const me = V.me(); return { changed: s(V.html(me)), first: s(V.html({ name: 'X', look: me.look, lv: 5, pet: { k: 'wolf', w: {} } })), look: me.look }; });
  console.log('     my card\'s wolf ...' + ref.changed + '; a first-form wolf ...' + ref.first);
  ok(ref.changed !== 'none' && ref.changed !== ref.first, 'my own card shows my changed wolf');
  /* another player in the sandbox's database: a world doc (its wolf flagged changed, card text with markup) and a card post */
  await p.evaluate((look) => { const t = Date.now(); localStorage.setItem('qbsbx:worlds/qa_other', JSON.stringify({ name: 'Other', look, lv: 22, streak: 3, cls: 'vanguard', rooms: [], crew: 0, served: 0, earnedC: 100, fw: 0, t, appv: 149, pet: { k: 'wolf', w: {}, form: 1, evo: 1 }, card: { bg: 'neon', r: 'Rank<b>', c: 'Cls' } }));
    localStorage.setItem('qbsbx:board/qa_other', JSON.stringify({ posts: [{ t: t - 60000, text: 'Shared a player card.', look, pc: 1 }] })); }, ref.look);
  const keys = await p.evaluate(() => Object.keys(localStorage).filter((k) => /^qbsbx:(worlds|board)\//.test(k))); console.log('     sandbox docs: ' + keys.join(' '));
  await p.waitForTimeout(2000); await p.reload(); await p.waitForFunction(() => window.__qb && window.__qbV152 && document.querySelector('.nav button'), null, { timeout: 180000 }); await p.waitForTimeout(5000);
  const mine = await p.evaluate(() => JSON.parse(localStorage.getItem('qbsbx:worlds/sandbox') || 'null')); console.log('     my published world doc pet: ' + JSON.stringify(mine && mine.pet) + ', card ' + JSON.stringify(mine && mine.card));
  ok(mine && mine.pet && !('form' in mine.pet) && !('evo' in mine.pet), 'my published world doc carries no form or change flag');
  /* Post my card, for real */
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); window.__qbV152.open(); }); await p.waitForTimeout(1200);
  const pb = await p.evaluate(() => { const e = document.querySelector('#layer [data-act="pcpost"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  ok(!!pb, 'my card window has "Post my card"'); if (pb) { await p.mouse.click(pb.x, pb.y); await p.waitForTimeout(2500); }
  const bd = await p.evaluate(() => JSON.parse(localStorage.getItem('qbsbx:board/sandbox') || 'null')); console.log('     my board doc: ' + JSON.stringify(bd).slice(0, 200));
  ok(bd && (bd.posts || []).some((q) => q.pc && q.text === 'Shared a player card.'), 'the card post is saved to my board');
  /* the Town board on screen */
  await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()); const n = document.querySelector('.nav button[data-v="hall"]'); if (n) n.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500);
  const hall = await p.evaluate(() => ({ tab: window.__qbHall && window.__qbHall.tab(), board: !!document.querySelector('#socnb'), navs: [...document.querySelectorAll('.nav button')].map((e) => e.dataset.v).join(','), tabs: [...document.querySelectorAll('[data-act="htab"],[data-htab]')].map((e) => (e.dataset.v || e.dataset.htab) + ':' + e.textContent.trim()).join(',') })); console.log('     the Hall: ' + JSON.stringify(hall));
  await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()));
  const board = await p.evaluate(() => [...document.querySelectorAll('.pc-post')].map((e) => ({ act: e.dataset.act, u: e.dataset.u || '', pet: (e.querySelector('.pc-stage img.fsh-pet') || { dataset: { pzk: 'none' } }).dataset.pzk })));
  console.log('     board card posts: ' + JSON.stringify(board)); await p.screenshot({ path: OUT + '/board_cards.png', fullPage: true });
  ok(board.some((q) => q.act === 'pcard' && q.pet === ref.changed), 'my post is drawn as my card, wolf changed');
  ok(board.some((q) => q.act === 'fshview' && q.u === 'qa_other' && q.pet === ref.first), 'their post is drawn as their card, wolf in its first form');
  /* their window from their post */
  const op = await p.evaluate(() => { const e = document.querySelector('.pc-post[data-u="qa_other"]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (op) { await p.mouse.click(op.x, op.y); await p.waitForTimeout(1500); }
  const win = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); if (!m) return null; const i = m.querySelector('.pc-wrap .pc-stage img.fsh-pet'); return { pet: i ? i.dataset.pzk : 'none', text: m.innerText.replace(/\s+/g, ' ').slice(0, 120), html: /[<>]/.test(m.querySelector('.pc-plate small') ? m.querySelector('.pc-plate small').textContent : '') }; });
  console.log('     their window: ' + JSON.stringify(win)); await p.screenshot({ path: OUT + '/their_window.png' });
  ok(win && win.pet === ref.first, 'their window (from the board) shows their card with the wolf in its first form');
  ok(win && !win.html, 'their card text is cleaned of markup');
  await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove())); await p.waitForTimeout(300);
  /* delete my card post */
  const del = await p.evaluate(() => { const post = document.querySelector('.pc-post[data-act="pcard"]'); const d = post && post.closest('.snp') && post.closest('.snp').querySelector('[data-act="sndel"]'); if (!d) return null; d.scrollIntoView({ block: 'center' }); const r = d.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  ok(!!del, 'my card post has a delete button'); if (del) { await p.mouse.click(del.x, del.y); await p.waitForTimeout(900); const cf = await p.evaluate(() => { const m = [...document.querySelectorAll('#layer .modal')].pop(); const b = m && [...m.querySelectorAll('button')].find((e) => /delete|remove|yes/i.test(e.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); if (cf) await p.mouse.click(cf.x, cf.y); await p.waitForTimeout(2500); }
  const after = await p.evaluate(() => ({ saved: ((JSON.parse(localStorage.getItem('qbsbx:board/sandbox') || '{}').posts) || []).filter((q) => q.pc).length, onScreen: document.querySelectorAll('.pc-post[data-act="pcard"]').length, theirs: document.querySelectorAll('.pc-post[data-u="qa_other"]').length }));
  ok(after.saved === 0 && after.onScreen === 0 && after.theirs === 1, 'deleting it takes my card post off the board, theirs stays (' + JSON.stringify(after) + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
