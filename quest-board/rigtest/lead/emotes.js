// Your character's emotes (Cal, 2026-11-18; 29zz_v125.js) on the plain build: in The Loft, standing in a room, your character plays the
// three emotes in turn (waveP, think, stretchSide), the next one 25-45 s after the last, only once its frames are drawn; thinking shows
// the "..." bubble; the Loft's short stretch clip is the side stretch now. Watches up to 240 s (your character also walks between spots, which puts an emote off). Also: the rig has the finer mesh (tops, arm
// pieces) and the solid-stretch cap (tops, arm pieces, the body; arms-up poses only) on (data/rig.json). No page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/emotes.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbLoft && window.QBLoft && QBLoft.clips, null, { timeout: 90000 }); await p.waitForTimeout(1000);
  await p.evaluate(() => setInterval(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()), 300));
  const cfg = await p.evaluate(() => { const Q = window.QBDATA, c = QBLoft.clips; return { fine: Q.rig.meshStepFine, slots: (Q.rig.fineSlots || []).join(), cap: Q.rig.solidStretch, capSlots: (Q.rig.solidSlots || []).join(), stretch: c.stretch.keys.join(), think: !!c.think, side: !!c.stretchSide, wave: !!c.waveP }; });
  ok(cfg.fine === 12 && cfg.slots === 'top,arms,skinArms' && cfg.cap === 4 && cfg.capSlots === 'top,arms,body', 'the rig: finer mesh on tops and arm pieces, solid-stretch cap 4 on top/arms/body (arms-up poses only, QA 2d2c911) ' + JSON.stringify(cfg));
  ok(cfg.think && cfg.side && cfg.wave && /sideL/.test(cfg.stretch) && !/^idle,stretch/.test(cfg.stretch), 'clips: think, stretchSide, waveP; the Loft stretch is the side stretch ' + cfg.stretch);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, hideout: 1 }; S.base.slots = [{ t: 'bedroom', a: {}, st: 0, pend: 0 }]; x.render(); });
  await p.evaluate(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2500);
  await p.evaluate(() => { const e = document.querySelector('[data-act="bldgo"][data-v="0"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2000);
  const seen = await p.evaluate(async () => { const out = { em: [], bubble: false, me: false }; const t0 = Date.now();
    while (Date.now() - t0 < 240000) { const A0 = window.__qbLoft().A || {}, A = Array.isArray(A0) ? A0 : Object.values(A0), me = A.find((a) => a && a.role === 'me'); if (me) { out.me = true; const em = me._pe && me._pe.em;
        if (em && out.em[out.em.length - 1] !== em) out.em.push(em); if (em === 'think' && me.emo === '...') out.bubble = true; }
      if (out.em.includes('think') && out.bubble && out.em.length >= 2) break; await new Promise((o) => setTimeout(o, 400)); } out.secs = Math.round((Date.now() - t0) / 1000); return out; });
  ok(seen.me, 'your character is in the room');
  ok(seen.em.length >= 2 && new Set(seen.em).size === seen.em.length && seen.em.every((e) => ['waveP', 'think', 'stretchSide'].includes(e)), `emotes played in turn within ${seen.secs} s: ` + seen.em.join(', '));
  ok(seen.em.includes('think') && seen.bubble, 'thinking plays and shows the "..." bubble ' + JSON.stringify({ think: seen.em.includes('think'), bubble: seen.bubble }));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
