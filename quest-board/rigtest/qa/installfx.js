// Buying an upgrade from its room window (LEAD's fa5ff03; Cal, v0.73 phone test: "some of the upgrades appear before the box fully
// drops" and "a glowing sort of outline around the newly added object that dissapears after 3 secones"), in Chromium or WebKit
// (iPhone Safari's engine), at phone size. For each case the room owns every live upgrade but the one bought (and what needs it),
// then the window's buy button is pressed. Sampled at fixed times: the new pieces stay hidden while the box drops and shakes
// (120 to 1300 ms), carry the gold outline once it opens (1.9 s) and are fully shown by 2.6 s, and at 4.7 s the outline and its filter are gone,
// the pieces visible, in the same order as before. Also: an upgrade that changes the picture but hides nothing (the code skips
// the effect when over half the picture is new) is listed, and the frame times while the outline runs (Chromium, CPU x4).
// Pictures at 1.9 s (outline) per case.   B=chromium|webkit BASE=<server> OUT=<folder> [CASES="room:name,room:name"] node installfx.js
const fs = require('fs'), path = require('path');
const pw = require('playwright');
const ENG = process.env.B || 'chromium', BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out/installfx';
fs.mkdirSync(OUT, { recursive: true });
let CASES = (process.env.CASES || 'bedroom:Desk Chair,bedroom:Memory Foam Bed,bedroom:Velvet Tufted Bed,bedroom:Bookshelf,bedroom:Floor-to-Ceiling,bedroom:Feature Walls,bedroom:Cove Lighting,lounge:Sofa,lounge:Boucle Sectional,gameroom:Couch & Console,gameroom:Cream Sectional,gameroom:Pool Table,gameroom:LED Wall Panels,gameroom:Carpet & Wall,restaurant:Walnut Dining Tables,restaurant:Marble Round Tables,restaurant:White Linen,restaurant:Brass Sconces,restaurant:Grand French Range').split(',').map((c) => c.split(':'));
const fails = []; const ok = (n, c, g) => { console.log((c ? '  ok   ' : '  FAIL ') + n + (g !== undefined ? '  ' + JSON.stringify(g).slice(0, 500) : '')); if (!c) fails.push(n); };
(async () => {
  const b = await pw[ENG].launch(ENG === 'chromium' ? { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft, null, { timeout: 120000 }); await p.waitForTimeout(1000);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.gates = Array.from({ length: 200 }, (_, i) => i); S.xp = x.cum(60); S.coins = 1e7; S.base.served = 1e6; x.render(); });
  // what each upgrade needs first (ADDREQ is not reachable from the page): with no coins the buy button answers "Install <name> first"
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S, REQ = {}, c = S.coins; S.coins = 0;
    Object.keys(x.ADDONS).filter((t) => x.ROOMT[t] && (x.ADDONS[t] || []).length).forEach((t) => { let k = S.base.slots.findIndex((z) => z && z.t === t); if (k < 0) { S.base.slots.push({ t, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; }
      const L = x.ADDONS[t], keep = S.base.slots[k]; S.base.slots[k] = { t, a: {}, st: 0, pend: 0 }; document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k);
      L.forEach((u) => { document.querySelectorAll('#layer .pop').forEach((e) => e.remove()); const b = document.createElement('button'); b.dataset.act = 'raddon'; b.dataset.i = k; b.dataset.id = u[0]; (document.querySelector('.rmodal') || document.body).appendChild(b); b.click(); b.remove();
        const m = [...document.querySelectorAll('#layer .pop')].map((e) => e.textContent).join(' ').match(/Install (.+?) first/); if (m) { const q = L.find((z) => z[1] === m[1]) || L.find((z) => m[1].includes(z[1]) || z[1].includes(m[1])); if (q) REQ[u[0]] = q[0]; } });
      S.base.slots[k] = keep; });
    S.coins = c; document.querySelectorAll('#layer .pop,#layer .modal').forEach((e) => e.remove()); window.__qaReq = REQ; });
  let cdp = null; if (ENG === 'chromium' && process.env.SLOW !== '0') { cdp = await ctx.newCDPSession(p); }
  if (process.env.MIN === '1') await p.evaluate(() => { window.__qaMin = 1; });
  if (process.env.ALL) { const ids = await p.evaluate((rooms) => { const x = window.__qb.x(); return rooms.flatMap((t) => (x.ADDONS[t] || []).filter((q) => !(q[3] && (q[3].retired || q[3].opens))).map((q) => [t, '#' + q[0]])); }, process.env.ALL.split(',')); CASES.length = 0; ids.forEach((c) => CASES.push(c)); }
  for (const [room, name] of CASES) {
    const tag = room + '_' + name.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    const setup = await p.evaluate(([room, name]) => {
      const x = window.__qb.x(), S = x.S, L = (x.ADDONS[room] || []); const u = name[0] === '#' ? L.find((q) => q[0] === name.slice(1)) : L.find((q) => q[1].toLowerCase().includes(name.toLowerCase()));
      if (!u) return { err: 'no upgrade named ' + name + ' in ' + room + ': ' + L.map((q) => q[1]).join(', ') };
      // leave out the one bought and everything that needs it (ADDREQ chains and "also")
      const out = new Set([u[0]]); let grew = true; const REQ = (window.__qaReq || {});
      while (grew) { grew = false; L.forEach((q) => { const need = (q[3] && q[3].also) || REQ[q[0]]; if (need && out.has(need) && !out.has(q[0])) { out.add(q[0]); grew = true; } }); }
      let k = S.base.slots.findIndex((s) => s && s.t === room); if (k < 0) { S.base.slots.push({ t: room, a: {}, st: 0, pend: 0 }); k = S.base.slots.length - 1; }
      const r = S.base.slots[k]; r.a = {};
      if (window.__qaMin) { let need = (u[3] && u[3].also) || REQ[u[0]]; while (need && !r.a[need]) { r.a[need] = 1; const q = L.find((z) => z[0] === need); need = q && ((q[3] && q[3].also) || REQ[q[0]]); } }
      else L.forEach((q) => { if (q[3] && (q[3].retired || q[3].opens)) return; if (!out.has(q[0])) r.a[q[0]] = 1; });
      document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((e) => e.remove()); x.render();
      return { i: k, id: u[0], label: u[1], left: [...out] };
    }, [room, name]);
    if (setup.err) { ok(tag + ': ' + setup.err, false); continue; }
    if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.evaluate(({ i, id }) => { window.__qaRun = (async () => {
      const w = (ms) => new Promise((o) => setTimeout(o, ms));
      window.__qb.roomModal(i); await w(900);
      const W = () => document.querySelector('#rbigw'), SV = () => W() && W().querySelector('svg');
      const hrefs = () => [...(SV() ? SV().querySelectorAll('image') : [])].map((e) => (e.getAttribute('href') || '').split('/').pop().slice(0, 40));
      const before = hrefs();
      let bt = document.querySelector('.rmodal button[data-act="raddon"][data-id="' + id + '"]'), fake = false;
      if (!bt) { bt = document.createElement('button'); bt.dataset.act = 'raddon'; bt.dataset.i = i; bt.dataset.id = id; const card = document.querySelector('.rmodal .addon') || document.querySelector('.rmodal'); card.appendChild(bt); fake = true; }
      const t0 = performance.now(); bt.click();
      const samples = {}; let fresh = null; const frames = []; let last = performance.now(), run = true;
      const tick = () => { const n = performance.now(); frames.push([n - t0, n - last]); last = n; if (run) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
      for (const at of [120, 600, 1000, 1300, 1900, 2600, 4700]) {
        await w(Math.max(0, at - (performance.now() - t0)));
        const svg = SV(); if (!svg) { samples[at] = { err: 'no picture' }; continue; }
        if (!fresh) fresh = [...svg.querySelectorAll('*')].filter((e) => e.style && e.style.opacity === '0' && !e.closest('.lfnewglow') && e.parentNode && (e.parentNode === svg || e.parentNode.parentNode === svg || e.closest('svg') === svg));
        const live = fresh.filter((e) => e.isConnected);
        const op = live.map((e) => +getComputedStyle(e).opacity);
        samples[at] = { fresh: fresh.length, live: live.length, maxOp: op.length ? Math.max(...op) : null, minOp: op.length ? Math.min(...op) : null,
          wrapped: live.filter((e) => e.parentNode && e.parentNode.classList && e.parentNode.classList.contains('lfnewglow')).length,
          glows: svg.querySelectorAll('g.lfnewglow').length, filters: svg.querySelectorAll('filter[id^="lfnewglow"]').length,
          crate: !!(W() && W().querySelector('.isocrate')), open: !!(W() && W().querySelector('.isocrate.open')) };
        if (at === 1900) { const sb = svg.getBoundingClientRect(); samples[at].big = [...svg.querySelectorAll('g.lfnewglow')].map((g) => g.firstElementChild).filter(Boolean).map((e) => { const q = e.getBoundingClientRect(); return { tag: e.tagName, cls: (e.getAttribute('class') || '').slice(0, 40), area: +((q.width * q.height) / (sb.width * sb.height)).toFixed(2), what: (e.innerHTML.match(/([a-z0-9_]+)\.webp/) || [, e.innerHTML.replace(/\s+/g, ' ').slice(0, 60)])[1] }; }).filter((x) => x.area > 0.4); }
        if (at === 1900) { const bb = live.map((e) => e.getBoundingClientRect()).filter((q) => q.width || q.height); window.__qaBox = bb.length ? [Math.min(...bb.map((q) => q.left)), Math.min(...bb.map((q) => q.top)), Math.max(...bb.map((q) => q.right)), Math.max(...bb.map((q) => q.bottom))] : null; }
      }
      run = false; const after = hrefs();
      const glowFrames = frames.filter((f) => f[0] > 1450 && f[0] < 4400).map((f) => f[1]);
      const changed = JSON.stringify(before) !== JSON.stringify(after);
      return { fake, samples, changed, nBefore: before.length, nAfter: after.length, box: window.__qaBox, worst: glowFrames.length ? Math.round(Math.max(...glowFrames)) : null, fps: glowFrames.length ? +(glowFrames.length / ((glowFrames.reduce((a, c) => a + c, 0)) / 1000)).toFixed(1) : null };
    })(); window.__qaT0 = 0; }, setup);
    // the clock starts at the click, 900 ms after the window opens: take the outline picture at about 1.95 s after the click
    await p.waitForTimeout(900 + 1950);
    const shot = await p.$('#rbigw'); if (shot) await shot.screenshot({ path: path.join(OUT, `${ENG}_${tag}_win.png`) }).catch(() => {});
    const r = await p.evaluate(() => window.__qaRun);
    if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const s = r.samples;
    const early = [120, 600, 1000, 1300].map((t) => s[t]);
    const hidden = s[120].fresh > 0 && early.every((q) => q.live === q.fresh && q.maxOp === 0 && q.crate);
    // outlined at 1.9 s (pieces that carry their own filter or clip, the soft-shadow layer, are left without one by design); fully shown by 2.6 s
    const shown = s[1900].glows > 0 && s[1900].wrapped > 0 && !s[1900].crate && s[2600].minOp === 1;
    ok(`${tag}: no room-sized layer outlined (it would paint over the whole room)`, !(s[1900].big || []).length, s[1900].big);
    const gone = s[4700].glows === 0 && s[4700].filters === 0 && s[4700].minOp === 1 && s[4700].live === s[4700].fresh;
    console.log(`  ${tag} (${setup.id}${r.fake ? ', button made: not in the menu' : ''}): ${s[120].fresh} new of ${r.nAfter} pictures; hidden ${early.map((q) => q.maxOp).join('/')}; at 1.9 s opacity ${s[1900].minOp}, outlined ${s[1900].wrapped}/${s[1900].live}; at 4.7 s glows ${s[4700].glows}, filters ${s[4700].filters}${ENG === 'chromium' ? `; while outlined at CPU x4 ${r.fps} fps, worst ${r.worst} ms` : ''}`);
    if (!s[120].fresh) ok(`${tag}: ${r.changed ? 'the picture changed but nothing was hidden: it shows before the box drops' : 'nothing new in the picture'}`, !r.changed, { before: r.nBefore, after: r.nAfter });
    else { ok(`${tag}: hidden while the box drops (120-1300 ms)`, hidden, early); ok(`${tag}: outlined once the box opens (1.9 s), fully shown by 2.6 s`, shown, [s[1900], s[2600]]); ok(`${tag}: outline gone by 4.7 s, pieces visible`, gone, s[4700]); }
    await p.evaluate(() => document.querySelectorAll('#layer .modal').forEach((e) => e.remove()));
  }
  ok('no page errors', !errs.length, errs.slice(0, 4));
  console.log(fails.length ? 'FAIL ' + fails.length : 'PASS'); await b.close(); process.exit(fails.length ? 1 : 0);
})();
