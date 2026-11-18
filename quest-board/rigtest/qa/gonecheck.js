// Cal's removal order (LEAD aec19d9, v1.18): QA's checks on top of LEAD's gone.js.
//  1. An owner of all 14 gone pieces plus a kept SMOKE BOMB piece and an OVERPASS cap, wearing gone pieces in every slot they fit:
//     one refund (coins = the gone pieces' prices), the pieces leave S.owned and S.eq, S.goneRef holds all 14, the kept pieces stay.
//  2. Reload: no second refund. 3. A stale save from before the refund put back (as a cloud merge would replace the whole save): it is
//     refunded once, by itself, and a further reload adds nothing.
//  4. The owner's look after the refund drawn in every pose on both bodies (nothing gone in it, nothing not drawn).
//  5. Pip (crawl ally) before and after (with and without the bandana) in every pose, as rsNpc builds him.
//  6. SMOKE BOMB: never live or in the vault on any floor for 120 days; its subtitle; which of its pieces are still on sale.
//   BASE=<plain build server> OUT=<folder> NODE_PATH=<playwright's parent> node rigtest/qa/gonecheck.js
const pw = require('playwright'), fs = require('fs');
const GONE = ['gx_o_durag', 'gx_o_bandana', 'gx_smk_band', 'gx_smk_wrap', 'gx_smk_cowl', 'gx_smk_tape', 'gx_smk_pouch', 'gx_smk_mesh', 'gx_smk_cargo', 'gx_smk_hakama', 'gx_smk_shorts', 'gx_smk_sandal', 'gx_smk_tabi', 'gx_smk_runner'];
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  const pops = []; await p.exposeFunction('qaPop', (t) => pops.push(t));
  const ready = async () => { await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.QBRig && window.QBLook, null, { timeout: 120000 }); await p.waitForTimeout(800);
    await p.evaluate(() => { new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.classList && n.classList.contains('pop')) window.qaPop(n.textContent); }))).observe(document.getElementById('layer'), { childList: true }); }); };
  await p.goto(process.env.BASE + '/dist/index.html'); await ready();
  const setup = await p.evaluate((GONE) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.calm = false; S.welcomed = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1, freeze: 1 }; S.coins = 1000; S.goneRef = {};
    const keep = x.SHOP.filter((it) => it[6] && it[6].b === 'smk' && GONE.indexOf(it[0]) < 0).map((it) => it[0]);
    S.owned = {}; GONE.concat(keep, ['gx_o_5panel']).forEach((id) => { S.owned[id] = true; });
    const slotOf = (id) => (x.SHOP.find((it) => it[0] === id) || [])[1]; S.eq = {}; ['gx_o_durag', 'gx_smk_mesh', 'gx_smk_hakama', 'gx_smk_tabi', 'gx_smk_pouch'].forEach((id) => { S.eq[slotOf(id)] = id; });
    const price = GONE.reduce((a, id) => a + (+(x.SHOP.find((it) => it[0] === id) || [0, 0, 0, 0])[3] || 0), 0);
    x.persist(); return { keep, eq: Object.assign({}, S.eq), price }; }, GONE);
  await p.waitForTimeout(1500); setup.stale = await p.evaluate(() => localStorage.getItem('quest-board'));
  const sv = JSON.parse(setup.stale || '{}'); console.log('stale save: coins', sv.coins, '| gone owned in it', Object.keys(sv.owned || {}).filter((id) => GONE.indexOf(id) >= 0).length, '| goneRef', JSON.stringify(sv.goneRef || null));
  const onSale = await p.evaluate(() => window.__qb.x().SHOP.filter((it) => it[6] && it[6].b === 'smk').map((it) => it[0].replace('gx_smk_', '') + (it[6].cut ? '(cut)' : '') + (it[6].gone ? '(gone)' : '')).join(' ')); console.log('SMOKE BOMB rows:', onSale);
  console.log('kept SMOKE BOMB pieces:', setup.keep.join(' ') || '(none)', '| worn before:', JSON.stringify(setup.eq), '| gone prices total', setup.price);
  await p.waitForTimeout(6500);
  const after = await p.evaluate((GONE) => { const S = window.__qb.x().S, e = (window.__qb.lookOf().rig.equipped) || {};
    return { coins: S.coins, owned: GONE.filter((id) => S.owned[id]).length, eqGone: Object.values(S.eq || {}).filter((id) => GONE.indexOf(id) >= 0).length, ref: Object.keys(S.goneRef || {}).length,
      keepOwned: Object.keys(S.owned).filter((id) => /gx_smk_|gx_o_5panel/.test(id)), art: Object.keys(e).map((s) => e[s].art) }; }, GONE);
  ok(after.coins === 1000 + setup.price, `one refund: 1000 -> ${after.coins} (+${after.coins - 1000}, the 14 prices sum to ${setup.price}); pops ${JSON.stringify(pops)}`);
  ok(after.owned === 0 && after.eqGone === 0 && after.ref === 14, `the 14 left S.owned (${after.owned}) and S.eq (${after.eqGone}); S.goneRef holds ${after.ref}`);
  ok(after.keepOwned.length === setup.keep.length + 1, 'the kept SMOKE BOMB pieces and the OVERPASS cap stay owned: ' + after.keepOwned.join(' '));
  ok(!after.art.some((a) => /o_durag|o_bandana|smk_(band|wrap|cowl|tape|pouch|mesh|cargo|hakama|shorts|sandal|tabi|runner)/.test(a)), 'nothing gone is drawn: ' + after.art.join(' '));
  const pop1 = pops.length; await p.reload(); await ready(); await p.waitForTimeout(6500);
  const re = await p.evaluate(() => window.__qb.x().S.coins);
  ok(re === after.coins && pops.length === pop1, `reload: no second refund (${re}), no new pop`);
  await p.evaluate((js) => localStorage.setItem('quest-board', js), setup.stale); await p.reload(); await ready(); await p.waitForTimeout(6500);
  const st1 = await p.evaluate(() => window.__qb.x().S.coins); await p.reload(); await ready(); await p.waitForTimeout(6500); const st2 = await p.evaluate(() => window.__qb.x().S.coins);
  ok(st1 === 1000 + setup.price && st2 === st1, `a stale pre-refund save put back is refunded once by itself (${st1}) and not again (${st2})`);
  // 4 and 5: draw
  const PIP = { body: 'm', skin: 's2', hairStyle: 'h2', hairColor: 'brown', top: 'tee', topColor: 'white', bottom: 'jeans', bottomColor: 'black', shoe: 'boots', shoeColor: 'black' };
  const sheet = await p.evaluate(async (PIP) => { const Q = window.QBDATA, D = QBLoft.data, { clips, ...poses } = Q.poses, names = Object.keys(poses), HI = 1.2;
    const rig = await QBRig.create({ rig: Object.assign({}, Q.rig, { frame: [Q.loft.frame[0] * HI, Q.loft.frame[1] * HI], frameScale: Q.loft.frameScale * HI, anchorPad: Q.loft.anchorPad * HI, frameCache: 4 }), bodies: Q.bodies, poses, clips,
      assetUrl: (a) => (window.QBART && QBART[a]) || Q.loft.artBase + a + (Q.arthash && Q.arthash[a] ? '?h=' + Q.arthash[a] : '') });
    const npc = (eqIds) => { const c = Object.assign({}, PIP), eq = {}; eqIds.forEach((g) => { const M = D.items[g]; if (M) eq[M.slot] = { art: g, frontOnly: M.frontOnly, over: M.over, wide: M.wide, lift: M.lift, clip: M.clip }; }); c.equipped = eq; return c; };
    const S = window.__qb.x().S; const me = (sex) => { S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.char.rig = Object.assign({}, QBLoft.data.creator.defaults, { body: sex, hairStyle: 'h1', hairColor: 'brown' }); return window.__qb.lookOf().rig; };
    const rows = [['Pip before (bandana)', npc(['npc_chef', 'o_bandana', 'h_cargo', 'h_boots'])], ['Pip now', npc(['npc_chef', 'h_cargo', 'h_boots'])], ['owner after refund, m', me('m')], ['owner after refund, f', me('f')]];
    const cw = Math.round(64 * HI), chh = Math.round(100 * HI), left = 170, top = 20, cv = document.createElement('canvas'); cv.width = left + names.length * cw; cv.height = top + rows.length * chh; const g = cv.getContext('2d');
    g.fillStyle = '#8b8fa3'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#fff'; g.font = 'bold 10px sans-serif'; names.forEach((nm, i) => g.fillText(nm.slice(0, 11), left + i * cw + 2, 14));
    let nd = 0; const eqs = [];
    for (let w = 0; w < rows.length; w++) { g.fillStyle = '#fff'; g.font = 'bold 12px sans-serif'; g.fillText(rows[w][0], 4, top + w * chh + 20); eqs.push(rows[w][0] + ': ' + Object.keys(rows[w][1].equipped || {}).map((s) => s + ':' + rows[w][1].equipped[s].art).join(' '));
      for (let i = 0; i < names.length; i++) { try { const c = await rig.render(QBLook.build(Q.creator, rows[w][1]), names[i]); g.drawImage(c, left + i * cw, top + w * chh, cw, chh); } catch (e) { nd++; g.fillStyle = '#c00'; g.fillText('NOT DRAWN', left + i * cw, top + w * chh + 50); } } }
    return { png: cv.toDataURL('image/png'), nd, poses: names.length, eqs }; }, PIP);
  fs.writeFileSync(process.env.OUT + '/gone_pip_owner.png', Buffer.from(sheet.png.split(',')[1], 'base64'));
  sheet.eqs.forEach((e) => console.log('   ' + e));
  ok(sheet.nd === 0, `Pip (before and now) and the owner after the refund (both bodies) in all ${sheet.poses} poses: ${sheet.nd} not drawn`);
  // 6: SMOKE BOMB
  const smk = await p.evaluate(() => { const D = window.__qbDrops, out = { live: 0, vault: 0, days: 0, floors: {} }, t0 = Date.now(); const x = window.__qb.x();
    for (let d = 0; d < 120; d++) { const t = t0 + d * 864e5; ['street', 'boutique', 'atelier'].forEach((f) => { let fl = null; try { fl = D.floor(f, t); } catch (e) {} if (!fl) return; out.floors[f] = 1;
      if ((fl.live || []).some((q) => q.id === 'smk')) out.live++; if ((fl.vault || []).some((q) => q.id === 'smk') || (fl.back && fl.back.id === 'smk')) out.vault++; }); out.days++; }
    const B = (typeof BRANDS !== 'undefined' ? BRANDS : null); return out; });
  ok(smk.live === 0 && smk.vault === 0, `SMOKE BOMB live on no floor (${Object.keys(smk.floors).join(', ')}) for ${smk.days} days, and never in the vault`);
  console.log('page errors in all runs:', errs.length, JSON.stringify(errs.slice(0, 2)));
  ok(!errs.length, 'no page errors');
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
