// Tiptoe heels (Cal 11-18: "the character needs to look like they are wearing heels with a tippy toe stance"; ROOMS 7f30c13, 1d16b66)
// on the plain build, with the game's rig: her look picks f_base_heel with the Ankle-Strap Stilettos, f_base_bare_heel with them and a
// bare top, f_base_bare with a bare top alone, today's base with any other shoes; his body never changes. ROOMS's tiptoe feet reach
// the floor line themselves, so there is no lift (heelLift unset): in every pose the heeled figure's head is where the same outfit in
// flat shoes has it, and in standing poses (idle, walk2, wave1, cheer1, stretch, rearStand) its lowest pixel is within 2 px of the
// flat outfit's (the heel tip on the floor). With heelLift forced to 72 in the page, standing poses lift by it and sitting and
// sleeping do not (the machinery for a later shoe). No page errors.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/heels.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 900, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 90000 }); await p.waitForTimeout(1200);
  const r = await p.evaluate(async () => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S;
    const look = (sex, ovr) => { S.created = true; S.char = window.__qb.fixChar({ name: 'Sam', sex }); S.char.rig = Object.assign({}, Q.creator.defaults, { body: sex, hairStyle: 'h2' }); S.owned = S.owned || {}; Object.values(ovr).forEach((id) => { S.owned[id] = true; }); return QBLook.build(Q.creator, window.__qb.lookOf(ovr).rig); };
    const pick = {}; for (const [k, sex, o] of [['heel', 'f', { a_top: 'gx_h_varsity', a_shoes: 'gx_v_sandal' }], ['bareheel', 'f', { a_top: 'gx_v_bralette', a_shoes: 'gx_v_sandal' }], ['bare', 'f', { a_top: 'gx_v_bralette', a_shoes: 'gx_h_sneak' }], ['flat', 'f', { a_top: 'gx_h_varsity', a_shoes: 'gx_v_stiletto' }], ['him', 'm', { a_top: 'gx_h_varsity', a_shoes: 'gx_v_sandal' }]]) { const L = look(sex, o); pick[k] = { body: L.layers.body.front, lift: L.lift || 0 }; }
    const { clips, ...poses } = Q.poses; const rig = await QBRig.create({ rig: Q.rig, bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const ext = (cv) => { const g = document.createElement('canvas'); g.width = cv.width; g.height = cv.height; const c = g.getContext('2d'); c.drawImage(cv, 0, 0); const d = c.getImageData(0, 0, g.width, g.height).data; let top = -1, bot = -1;
      for (let y = 0; y < g.height; y++) { for (let x2 = 0; x2 < g.width; x2++) if (d[(y * g.width + x2) * 4 + 3] > 40) { if (top < 0) top = y; bot = y; break; } } return { top, bot }; };
    const H = look('f', { a_top: 'gx_h_varsity', a_pants: 'gx_h_denim', a_shoes: 'gx_v_sandal' }), F = look('f', { a_top: 'gx_h_varsity', a_pants: 'gx_h_denim', a_shoes: 'gx_v_stiletto' }); /* from behind, flat shoes end 391-398 (the Platform Combat Boots at 398, as these heels), so 3 px there; from the front flat shoes end 394-398 px here (chunky sneakers highest, Mary Janes lowest); the old Patent Stilettos are the closest kin */
    const HL = Object.assign({}, H, { lift: 72 }), out = {}; for (const ps of ['idle', 'walk2', 'wave1', 'cheer1', 'stretch', 'rearStand', 'sitFront', 'sleep']) out[ps] = { heel: ext(await rig.render(H, ps)), flat: ext(await rig.render(F, ps)), lifted: ext(await rig.render(HL, ps)) };
    return { pick, out, k: Q.rig.frameScale }; });
  const P = r.pick;
  ok(/f_base_heel_front/.test(P.heel.body) && !P.heel.lift, 'stilettos: her tiptoe base, no lift ' + JSON.stringify(P.heel));
  ok(/f_base_bare_heel_front/.test(P.bareheel.body) && !P.bareheel.lift, 'stilettos and a bare top: the base with both ' + JSON.stringify(P.bareheel));
  ok(/f_base_bare_front/.test(P.bare.body) && !P.bare.lift, 'a bare top in sneakers: the bare base, no lift ' + JSON.stringify(P.bare));
  ok(/f_base_front/.test(P.flat.body) && !P.flat.lift, 'the old Patent Stilettos: today\'s base, no lift ' + JSON.stringify(P.flat));
  ok(/m_base_front/.test(P.him.body) && !P.him.lift, 'his body never changes ' + JSON.stringify(P.him));
  const up = 72 * r.k;
  for (const [ps, o] of Object.entries(r.out)) { const stand = !/^(sitFront|sleep)$/.test(ps);
    ok(Math.abs(o.heel.top - o.flat.top) <= 1 && (!stand || Math.abs(o.heel.bot - o.flat.bot) <= (ps === 'rearStand' ? 3 : 2)), `${ps}: no lift (head ${o.heel.top} vs ${o.flat.top})` + (stand ? `, heel tip on the floor (lowest px ${o.heel.bot} vs flat ${o.flat.bot})` : ''));
    const d = o.heel.top - o.lifted.top; ok(stand ? Math.abs(d - up) <= 1.5 : Math.abs(d) <= 1, `${ps}: heelLift 72 forced: ${stand ? 'lifted' : 'not lifted'} by ${d} px (${stand ? up.toFixed(1) : 0})`); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
