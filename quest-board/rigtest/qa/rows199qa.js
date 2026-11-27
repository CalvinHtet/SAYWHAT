// QA, b579d677 (Smoke Bomb's 18 pieces on sale as GITEMS rows): each new row through the Shop's own path (lookOf with the row id, as a
// try-on does) on each body it fits, idle and stretch: the piece draws (pixels changed against the bare figure), its slot, price, tier.
//   BASE=<server> NODE_PATH=<playwright> node rigtest/qa/rows199qa.js
const pw = require('playwright'); const BASE = process.env.BASE || 'http://127.0.0.1:8824'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const IDS = (process.env.IDS || 'hoodcap,visorbeanie,platehood,tails,ventmask,scoutlens,slitvisor,resp,goggles,trailscarf,kunai,bracers,handwraps,grips,hoodie,wrapjacket,harness,bomber').split(',').map((s) => 'gx_smk_' + s);
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.QBLoft && window.QBDATA && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(1500);
  const r = await p.evaluate(async (IDS) => { const Q = window.QBDATA, x = window.__qb.x(), S = x.S, I = QBLoft.data.items; const { clips, ...poses } = Q.poses;
    const rig = await QBRig.create({ rig: Q.rig, bodies: Q.bodies, poses, clips, assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const px = (c) => c.getContext('2d').getImageData(0, 0, c.width, c.height).data; const diff = (a, b) => { let n = 0; for (let i = 3; i < a.length; i += 16) if (Math.abs(a[i] - b[i]) > 40 || Math.abs(a[i - 3] - b[i - 3]) > 40) n++; return n; };
    const look = (sex, ov) => { S.created = true; S.char = window.__qb.fixChar({ name: 'R', sex }); S.owned = S.owned || {}; Object.values(ov).forEach((id) => { S.owned[id] = true; }); return QBLook.build(Q.creator, window.__qb.lookOf(ov).rig); };
    const out = []; for (const id of IDS) { const it = x.SHOP.find((q) => q[0] === id); if (!it) { out.push({ id, missing: 1 }); continue; } const g = it[6] && it[6].gar, M = I[g] || {}; const row = { id, slot: it[1], gar: g, inItems: !!I[g], price: it[3], tier: it[6] && it[6].tier, fo: !!(it[6].fo || M.femaleOnly), mo: !!(it[6].mo || M.maleOnly), px: {} };
      for (const sex of ['m', 'f']) { if ((sex === 'm' && row.fo) || (sex === 'f' && row.mo)) continue; for (const ps of ['idle', 'stretch']) { try { const base = px(await rig.render(look(sex, {}), ps)); const ov = {}; ov[it[1]] = id; const on = px(await rig.render(look(sex, ov), ps)); row.px[sex + ps] = diff(base, on); } catch (e) { row.px[sex + ps] = 'ERR ' + String(e).slice(0, 40); } } }
      out.push(row); } return out; }, IDS);
  for (const row of r) { const vals = Object.values(row.px || {}); ok(!row.missing && row.inItems && vals.length && vals.every((v) => typeof v === 'number' && v > 150), row.id + ' ' + JSON.stringify(row)); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 2))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
