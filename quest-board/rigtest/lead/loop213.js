// Cal 11-25/26 (29zz_v213.js): a banner with a painted loop plays it behind the character on the cards people look at (muted, inline,
// looping, paused off screen); a banner without one keeps the drawn sparkle layer.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/loop213.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV213, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const u = await V(() => ({ a: window.__qbV213.url('ink_peaks'), b: window.__qbV213.url('neon') }));
  ok(/bl_pc_ink_peaks_loop\.mp4\?h=/.test(u.a || '') && !u.b, 'the build carries the loops (ink_peaks has one, neon does not) ' + JSON.stringify(u));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(20); S.gates = [5, 10, 20]; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 }; S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 };
    S.pc = Object.assign(S.pc || {}, { bg: 'ink_peaks', own: Object.assign((S.pc && S.pc.own) || {}, { ink_peaks: 1 }) }); S.bfix = Object.assign(S.bfix || {}, { ink_peaks: 15 }); if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  await p.waitForTimeout(2500);
  const h = await V(() => { const v = document.querySelector('.strip .avbtn video.v213'); return v ? { bg: v.getAttribute('data-bg'), muted: v.muted, loop: v.loop, inline: v.hasAttribute('playsinline'), playing: !v.paused, t: v.currentTime, fxHidden: getComputedStyle(v.parentNode.querySelector('.v77fx') || document.body).display === 'none' } : null; });
  ok(h && h.bg === 'ink_peaks' && h.muted && h.loop && h.inline && h.playing && h.t > 0, 'the header card plays the loop, muted, inline, looping ' + JSON.stringify(h));
  await V(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1500);
  const pr = await V(() => { const v = document.querySelector('#layer .v61ban video.v213'); return v ? { playing: !v.paused } : null; });
  ok(pr && pr.playing, 'the profile banner plays it too ' + JSON.stringify(pr));
  await p.screenshot({ path: OUT + '/loop213_profile.png' });
  const off = await V(async () => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.scrollTo(0, 3000); await new Promise((r) => setTimeout(r, 900)); const v = document.querySelector('.strip .avbtn video.v213'); const r = v.getBoundingClientRect(); return { paused: v.paused, top: Math.round(r.top) }; });
  ok(off.paused || off.top > -10, 'scrolled off screen, the header\'s loop pauses ' + JSON.stringify(off));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
