// The Pet Shop (docs/PET_SHOP.md): on the plain build (PORT), for PET=wolf|wyvern|slime. The Pets tab is on the Boutique (floor 2) with
// the three creatures; adopting warns first, takes 3,000 and makes it yours; the other two then say "You already have a pet"; this drop
// shows 2 of its line and 2 of the dogs'; the giving-up screen shows it crying and costs 3,000, after which it is gone and any can be
// adopted again. In the Loft: the creature is an actor drawn with its clothes, its beds are in the Bedroom and on the Patio (the fire-
// side chair gone), and dressed dogs draw their clothes. Pictures in OUT. No page errors.
//   PORT=<plain build> PET=wolf OUT=<folder> NODE_PATH=<playwright's parent> node rigtest/lead/petshop.js
const { chromium } = require('playwright'), fs = require('fs');
const PORT = process.env.PORT || 8779, PET = process.env.PET || 'wolf', OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const WEAR = { wolf: { head: 'pw_helm', neck: 'pw_collar', body: 'pw_hoodie', aura: 'pw_cloud' }, wyvern: { head: 'pv_wizard', neck: 'pv_scarf', body: 'pv_pack', aura: 'pv_embers' }, slime: { head: 'ps_crown', neck: 'ps_ruffle', body: 'ps_cape', aura: 'ps_flames' } };
const base = 'http://127.0.0.1:' + PORT, gone = (p) => p.evaluate(() => document.querySelectorAll('.dropsplash,.overlay,#layer .modal:not(.pzk),.bsplash,.tour,.tourtip').forEach((e) => { if (!e.querySelector('[data-act^=pz]')) e.remove(); }));
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] }); fs.mkdirSync(OUT, { recursive: true });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const info = await p.evaluate(() => { const A = window.__qb.x().ADDONS || {}; return { bd: (A.bedroom || []).map((a) => a[0]), pt: (A.patio || []).map((a) => a[0]) }; });
  await p.evaluate((info) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(35); S.gates = Array.from({ length: 200 }, (_, i) => i); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.coins = 20000; S.pet = null; S.petw = {}; S.dogw = {};
    S.base.slots = [{ t: 'bedroom', a: Object.fromEntries(info.bd.filter((k) => k !== 'bd_game').map((k) => [k, 1])), st: 0, pend: 0 }, { t: 'patio', a: Object.fromEntries(info.pt.map((k) => [k, 1])), st: 0, pend: 0 }]; window.__qbRooms.open('closet', 1); x.render(); }, info);
  await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); for (let i = 0; i < 3; i++) { await p.waitForTimeout(900); await gone(p); }
  await p.evaluate(() => { const f = document.querySelector('[data-qsfl="boutique"]'); if (f) f.click(); }); await p.waitForTimeout(700); await gone(p);
  const tab = await p.evaluate(() => { const t = document.querySelector('[data-act="stab"][data-v="pets"]'); if (t) t.click(); return !!t; }); await p.waitForTimeout(1500); await gone(p);
  const cards = await p.evaluate(() => [...document.querySelectorAll('[data-card^=pet_]')].map((e) => e.dataset.card));
  ok(tab && cards.join() === 'pet_wolf,pet_wyvern,pet_slime', 'Pets tab on the Boutique with the three creatures ' + cards.join());
  await p.evaluate((PET) => document.querySelector(`[data-act="pzbuy"][data-id="${PET}"]`).click(), PET); await p.waitForTimeout(1000);
  const warn = await p.evaluate(() => { const m = document.querySelector('.pz-confirm'); return m ? m.textContent : ''; });
  ok(/only have one pet/.test(warn) && /3,000/.test(warn), 'adopting warns first: one pet only, giving up costs 3,000'); await p.screenshot({ path: `${OUT}/${PET}_1_confirm.png` });
  const c0 = await p.evaluate(() => window.__qb.x().S.coins);
  await p.evaluate(() => document.querySelector('[data-act="pzbuyok"]').click()); await p.waitForTimeout(1200); await gone(p);
  let s = await p.evaluate(() => { const S = window.__qb.x().S; return { pet: S.pet && S.pet.k, coins: S.coins, others: [...document.querySelectorAll('.pz-pet')].map((e) => e.textContent.includes('You already have a pet')), drop: [...document.querySelectorAll('[data-card^=pc_]')].map((e) => e.dataset.card.slice(3)) }; });
  ok(s.pet === PET && s.coins === c0 - 3000, `adopted: ${s.pet}, coins ${c0} -> ${s.coins}`); const c1 = s.coins;
  ok(s.others.filter(Boolean).length === 2, 'the other two say "You already have a pet"');
  const C = await p.evaluate(() => QBDATA.pet_clothes); const lines = s.drop.map((id) => C[id] && C[id].pet);
  ok(s.drop.length === 4 && lines.filter((l) => l === PET).length === 2 && lines.filter((l) => l === 'dogs').length === 2, 'this drop: 2 for it, 2 for the dogs ' + s.drop.join(','));
  await p.evaluate(([PET, W]) => { const S = window.__qb.x().S; Object.values(W).forEach((id) => { S.owned['pc_' + id] = true; }); S.petw = {}; S.petw[PET] = W; S.dogw = { pluto: { head: 'pd_bucket', neck: 'pd_bandana' }, chopstick: { neck: 'pd_studs', head: 'pd_poppy' } }; window.__qb.x().render(); }, [PET, WEAR[PET]]);
  await p.waitForTimeout(2500); await gone(p); await p.screenshot({ path: `${OUT}/${PET}_2_tab.png`, fullPage: true });
  await p.evaluate(() => document.querySelector('[data-act="pzadopt"]').click()); await p.waitForTimeout(1600);
  const cry = await p.evaluate(() => { const im = document.querySelector('.pz-cryf'); return im ? im.getAttribute('data-pzk') : null; }); await p.screenshot({ path: `${OUT}/${PET}_3_cry.png` });
  ok(cry && /\|(7|8|9|10)\|/.test(cry), 'the giving-up screen shows it crying (' + cry + ')');
  /* the Loft before giving it up: actors and beds */
  await p.evaluate(() => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  for (let i = 0; i < 5; i++) { await p.waitForTimeout(2500); await gone(p); }
  const act = await p.evaluate(() => [...document.querySelectorAll('[id^=lfa-dog]')].map((g) => { const im = g.querySelector('.lfi'); return [g.id, (im.getAttribute('href') || '').slice(0, 22)]; }));
  ok(act.some((a) => a[0] === 'lfa-dog_pet' && a[1].startsWith('data:image/png')), 'in the Loft the creature is drawn with its clothes ' + JSON.stringify(act));
  ok(['pluto', 'chopstick'].every((d) => act.some((a) => a[0] === 'lfa-dog_' + d && a[1].startsWith('data:image/png'))), 'the dressed dogs draw their clothes');
  for (const [ix, nm] of [[0, 'bedroom'], [1, 'patio']]) { await p.setViewportSize({ width: 1300, height: 1000 }); await p.evaluate((ix) => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); window.__qb.roomModal(ix); }, ix); await p.waitForTimeout(3500);
    const el = await p.$('#rbigw'); await (el || p).screenshot({ path: `${OUT}/${PET}_4_${nm}.png` }); }
  const beds = await p.evaluate((PET) => [...document.querySelectorAll('image')].filter((im) => (im.getAttribute('href') || '').includes('pbed_' + PET)).length, PET);
  ok(beds >= 2, 'its bed is in the Bedroom and on the Patio (' + beds + ' pictures)');
  /* giving it up */
  await p.evaluate(() => { document.querySelectorAll('.modal').forEach((e) => e.remove()); }); await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(1000); await gone(p);
  await p.evaluate(() => { const f = document.querySelector('[data-qsfl="boutique"]'); if (f) f.click(); }); await p.waitForTimeout(600); await p.evaluate(() => { const t = document.querySelector('[data-act="stab"][data-v="pets"]'); if (t) t.click(); }); await p.waitForTimeout(900); await gone(p);
  await p.evaluate(() => document.querySelector('[data-act="pzadopt"]').click()); await p.waitForTimeout(800); await p.evaluate(() => document.querySelector('[data-act="pzadoptok"]').click()); await p.waitForTimeout(1000); await gone(p);
  s = await p.evaluate(() => { const S = window.__qb.x().S; return { pet: S.pet, coins: S.coins, buy: document.querySelectorAll('[data-act="pzbuy"]').length, kept: Object.keys(S.owned).filter((k) => k.startsWith('pc_')).length }; });
  ok(!s.pet && s.coins === c1 - 3000 && s.buy === 3 && s.kept === 4, `given up: no pet, coins ${c1} -> ${s.coins}, all three adoptable again, ${s.kept} clothes kept`);
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })().catch((e) => { console.error(e); process.exit(1); });
