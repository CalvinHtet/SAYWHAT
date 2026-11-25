// QA, f6b98742 (29zz_v165.js: the Board starts at the tasks; the level bar, NEXT, the Daily Quest and the trial move into the profile;
// Cal 11-25). What LEAD's board165.js leaves out:
//   A  every .zx-next on the Board before and after (the wrapper drops only the FIRST .zx-next: the scratch card's button shares the class)
//   B  a new player's welcome tour: its "Your level" step points at .bline, which is gone (the tour hides ~10 s, then skips it)
//   C  passing a trial from inside the profile (sandbox build: the stand-in photo check): Board row -> profile at the trial -> a photo
//      through #ph1 -> the gate clears, the level-up shows, the profile and the Board lose the trial
//   D  the Daily Quest card's (i) inside the profile opens its sheet
//   BASE=<server root> node board165qa.js   (needs dist/ plain and dist-web/ built with QB_SANDBOX=1 QB_TARGET=web)
const pw = require('playwright'), fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const TOURS_DONE = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const page = async (dist, W) => { const ctx = await b.newContext({ viewport: { width: W || 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(BASE + '/' + dist + '/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV165, null, { timeout: 120000 }); await p.waitForTimeout(800); return p; };
  const clr = (p) => p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,#layer .qb-held,.bsplash,.dropsplash,.flsplash')) m.remove(); });
  /* A */
  { const p = await page('dist'); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    for (const lv of [8, 12, 20, 30]) { const r = await p.evaluate(([lv, T]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Next', sex: 'm' }); S.xp = x.cum(lv) + 5; S.gates = [5, 10, 20, 30].filter((g) => g <= lv); S.tutDone = 1; S.tours = T; S.quests = [{ id: 'h1', name: 'Dishes', xp: 10, stat: 'productivity', cl: 'home', rep: 'daily', mins: 10 }]; S.done = {}; x.persist(); x.render(); document.querySelector('.nav button[data-v="board"]').click();
        const P = window.__qbV165.parts(); const tmp = document.createElement('div'); tmp.innerHTML = P.next;
        return { board: [...document.querySelectorAll('#app .zx-next')].map((e) => e.className + ' [' + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 50) + ']'), movedNext: tmp.firstElementChild ? tmp.firstElementChild.className + ' [' + tmp.textContent.replace(/\s+/g, ' ').trim().slice(0, 50) + ']' : '' }; }, [lv, TOURS_DONE]);
      const scratchOnBoard = r.board.some((c) => /zx-spin|zx-sc/.test(c)), nextOnBoard = r.board.some((c) => !/zx-spin|zx-sc/.test(c)), movedIsScratch = /zx-spin|zx-sc/.test(r.movedNext);
      ok(!movedIsScratch && !nextOnBoard, 'A lv' + lv + ': the profile gets the NEXT line, not the scratch card; no NEXT left on the Board ' + JSON.stringify(r) + (scratchOnBoard ? ' (scratch button stays on the Board)' : '')); }
    await p.context().close(); }
  /* B: a new player's welcome tour */
  { const p = await page('dist'); await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'New', sex: 'f' }); S.xp = 0; S.gates = []; S.tours = {}; x.persist(); x.render(); document.querySelector('.nav button[data-v="board"]').click(); });
    const log = []; let last = ''; const t0 = Date.now();
    for (let i = 0; i < 60; i++) { await p.waitForTimeout(500); const s = await p.evaluate(() => { const r = document.getElementById('qbtour'); const vis = r && r.style.visibility !== 'hidden' && getComputedStyle(r).display !== 'none'; const t = r && r.querySelector('.tour-t'); return { vis: !!vis, t: t ? t.textContent : '', n: r && r.querySelector('.tour-n') ? r.querySelector('.tour-n').textContent : '', modal: !!document.querySelector('#layer .modal') }; });
      const k = (s.vis ? s.t + ' ' + s.n : '(hidden' + (s.modal ? ', a window is open' : '') + ')'); if (k !== last) { log.push(((Date.now() - t0) / 1000).toFixed(1) + 's ' + k); last = k; }
      if (s.modal) await clr(p);
      if (s.vis) { const nb = await p.$('#qbtour [data-tour="next"]'); const shown = nb && await nb.evaluate((e) => e.style.display !== 'none'); if (shown) await nb.click(); else { const tq = await p.evaluate(() => { const r = document.querySelector('#qbtour .tour-ring').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); await p.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); if (e) e.click(); }, tq); } }
      if (await p.evaluate(() => !!(window.__qb.x().S.tours || {}).welcome)) { log.push(((Date.now() - t0) / 1000).toFixed(1) + 's welcome done'); break; } }
    console.log('     B welcome tour: ' + log.join(' | '));
    const sawLevel = log.some((l) => /Your level/.test(l) && !/hidden/.test(l)); const gap = (() => { for (let i = 1; i < log.length; i++) if (/hidden/.test(log[i]) && i + 1 < log.length) { const a = parseFloat(log[i]), z = parseFloat(log[i + 1]); if (z - a > 6) return (z - a).toFixed(1); } return 0; })();
    ok(!gap, 'B the welcome tour runs without a long hidden pause (a gap of ' + gap + ' s means a step aims at something no longer on the Board); "Your level" step shown: ' + sawLevel);
    await p.context().close(); }
  /* C and D: a trial passed inside the profile, on the sandbox build */
  { const p = await page('dist-web'); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Trial', sex: 'm' }); S.xp = x.cum(5) + 300; S.gates = []; S.tutDone = 1; S.tours = T; S.quests = [{ id: 'h1', name: 'Dishes', xp: 10, stat: 'productivity', cl: 'home', rep: 'daily', mins: 10 }]; S.done = {}; S.hashes = []; x.persist(); x.render(); document.querySelector('.nav button[data-v="board"]').click(); }, TOURS_DONE);
    await p.waitForTimeout(800); await clr(p);
    const row = await p.$('#app .v65gate'); ok(!!row, 'C the Board shows the Level trial row while a trial waits');
    if (row) { await row.click(); await p.waitForTimeout(1500);
      const pos = await p.evaluate(() => { const g = document.querySelector('#layer .prof section.card.gate'); if (!g) return null; const r = g.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), vh: innerHeight }; });
      ok(pos && pos.top >= -2 && pos.top < pos.vh / 2, 'C the row opens the profile with the trial in view ' + JSON.stringify(pos));
      await p.screenshot({ path: OUT + '/trial_profile_390.png' });
      /* D: the Daily Quest's (i) in the profile */
      const qi = await p.$('#layer .prof .card.dq .qbi'); if (qi) { await qi.scrollIntoViewIfNeeded(); await qi.click(); await p.waitForTimeout(700); const sheet = await p.evaluate(() => [...document.querySelectorAll('#layer .modal')].length); ok(sheet >= 2, 'D the Daily Quest (i) inside the profile opens its sheet (windows open: ' + sheet + ')'); await p.keyboard.press('Escape'); await p.evaluate(() => { const ms = document.querySelectorAll('#layer .modal'); if (ms.length > 1) ms[ms.length - 1].remove(); }); } else ok(false, 'D no Daily Quest (i) in the profile');
      /* the photo: a bright JPEG through the trial's own input */
      const jpg = path.join(OUT, 'bright.jpg'); if (!fs.existsSync(jpg)) { const pg = await (await b.newContext()).newPage(); const u = await pg.evaluate(() => { const c = document.createElement('canvas'); c.width = 640; c.height = 480; const g = c.getContext('2d'); g.fillStyle = '#9ac'; g.fillRect(0, 0, 640, 480); g.fillStyle = '#fff'; g.fillRect(100, 100, 300, 200); g.fillStyle = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'); g.fillRect(200, 150, 100, 100); return c.toDataURL('image/jpeg', 0.9); }); fs.writeFileSync(jpg, Buffer.from(u.split(',')[1], 'base64')); await pg.context().close(); }
      const lvBefore = await p.evaluate(() => window.__qb.x().S.gates.length);
      await p.setInputFiles('#layer .prof #ph1', jpg); let st = null;
      for (let i = 0; i < 30; i++) { await p.waitForTimeout(500); st = await p.evaluate(() => ({ gates: window.__qb.x().S.gates.slice(), lines: [...document.querySelectorAll('#layer .prof .card.gate .proof > div')].map((d) => d.className + ':' + d.textContent.trim().slice(0, 60)), gateInProf: !!document.querySelector('#layer .prof section.card.gate'), profOpen: !!document.querySelector('#layer .prof'), flash: !!document.querySelector('.flash, .lvup, .levelup, .rankup'), windows: [...document.querySelectorAll('#layer .modal')].map((m) => (m.querySelector('h2,h3,.label') || m).textContent.trim().slice(0, 40)) })); if (st.gates.length > lvBefore) break; }
      await p.waitForTimeout(1500); const after = await p.evaluate(() => ({ gates: window.__qb.x().S.gates.slice(), gateInProf: !!document.querySelector('#layer .prof section.card.gate'), profOpen: !!document.querySelector('#layer .prof'), windows: [...document.querySelectorAll('#layer .modal')].map((m) => (m.querySelector('h2,h3,.label') || m).textContent.replace(/\s+/g, ' ').trim().slice(0, 40)) }));
      await p.screenshot({ path: OUT + '/trial_passed_390.png' });
      ok(after.gates.length > lvBefore && !after.gateInProf, 'C a photo taken in the profile passes the trial, and the profile drops the trial card ' + JSON.stringify({ during: st, after }));
      await clr(p); await p.evaluate(() => window.__qb.x().render()); await p.waitForTimeout(400);
      ok(!(await p.$('#app .v65gate')), 'C after the pass the Board has no Level trial row'); }
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
