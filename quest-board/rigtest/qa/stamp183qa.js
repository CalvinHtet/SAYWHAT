// QA, 5cdb0ddd (29zz_v183.js + 29zs_side.js: no time stamp on any photo). LEAD asked: the sleep side quest (Night watch, "sable") still
// passes a night photo and fails a daytime one. The sandbox's stand-in checker reads the night from the phone's hour, so it passes either
// way; this runs the real path with a fake photo checker (window.claude) that records the prompt, answering as a checker that follows it:
// a "night_ok" that must be read from a time stamp is false when the photo has no stamp. Also the quest checker's prompt (no stamp ask).
//   PORT=<plain build> NODE_PATH=<playwright> node rigtest/qa/stamp183qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
(async () => { const b = await pw.chromium.launch(); const errs = [];
  for (const [hh, lab, want] of [[21, 'night (21:30)', true], [15, 'day (15:30)', false]]) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    await p.addInitScript(() => { window.__prompts = []; const sample = { warm() {}, limits: async () => ({ images: true }), json: async (prompt, o) => { window.__prompts.push({ prompt, stamp: o && o.stamp });
      const a = { matches: true, what: 'a bed, lights low', screen: false, note: '' }; if (/stamp_ok/.test(prompt)) a.stamp_ok = false; if (/night_ok/.test(prompt)) a.night_ok = /time stamp/.test(prompt) ? false : true; return a; } };
      window.claude = { use: async (k) => (k === 'sample' ? sample : null) }; });
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbSide, null, { timeout: 120000 }); await p.waitForTimeout(500);
    const r = await p.evaluate(async ([hh, T]) => { const d = new Date(); d.setHours(hh, 30, 0, 0); window.__qbShift = d.getTime() - Date.now(); const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Nw', sex: 'm' }); S.xp = x.cum(12); S.tutDone = 1; S.tours = T;
      const o = window.__qbSide.state(); o.on = o.on || {}; o.on.sable = window.__qbSide.when(Date.now()).d; delete (o.done || {}).sable; o.nw = { d: '', n: 0 }; window.__qbSide.wait(0); x.persist(); x.render();
      { S.story = S.story || {}; S.story.team = Object.assign({}, S.story.team || {}, { sable: Date.now() }); const o2 = window.__qbSide.state(); o2.on.sable = window.__qbSide.when(Date.now()).d; delete o2.done.sable; o2.nw = { d: '', n: 0 }; } window.__qbSide.ask('sable'); const c = document.createElement('canvas'); c.width = 640; c.height = 480; const g = c.getContext('2d'); g.fillStyle = '#806040'; g.fillRect(0, 0, 640, 480); for (let i = 0; i < 400; i++) { g.fillStyle = 'hsl(' + (i * 37 % 360) + ',40%,' + (30 + i % 40) + '%)'; g.fillRect((i * 53) % 640, (i * 29) % 480, 20, 14); }
      const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.9)); const f = new File([blob], 'n.jpg', { type: 'image/jpeg' }); const dbg = { on: JSON.stringify(window.__qbSide.state().on), modal: !!document.querySelector('#layer .sdq-ask'), cl: String(window.claude && window.claude.use).slice(0, 60) }; await window.__qbSide.file(f); await new Promise((r) => setTimeout(r, 2500)); window.__dbg = dbg;
      const st = window.__qbSide.state(); const txt = [...document.querySelectorAll('#layer .modal, .pop, #pop, .toast')].map((m) => m.innerText.replace(/\s+/g, ' ')).join(' | ').slice(0, 300);
      return { dbg: window.__dbg, n: (st.nw || {}).n || 0, nwd: (st.nw || {}).d, txt, prompts: window.__prompts.map((q) => ({ night: /night_ok/.test(q.prompt), stampWords: /time stamp/.test(q.prompt), stampOk: /stamp_ok/.test(q.prompt), stamp: q.stamp, tail: q.prompt.slice(-260) })) }; }, [hh, T]);
    note(lab + ': ' + JSON.stringify(r).slice(0, 900));
    ok(r.prompts.length === 1 && !r.prompts[0].stampOk, lab + ': the checker is asked once and not for stamp_ok');
    ok((r.n > 0) === want, lab + ': Night watch ' + (want ? 'counts the night photo' : 'refuses the daytime photo') + ' (night logged: ' + (r.n > 0) + '; checker asked for night_ok "from the time stamp": ' + (r.prompts[0] && r.prompts[0].night && r.prompts[0].stampWords) + ')');
    await p.context().close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
