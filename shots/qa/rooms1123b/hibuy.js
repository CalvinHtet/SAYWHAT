// QA: Stylist highlights through real taps (117e1e3): buy Blonde Highlights in the Stylist, it is worn (or Wear works), the look carries
// hairHi and the Loft/rig layer; switch to Pink; take it off in the Wardrobe; coins charged once. Both bodies; also the milestone and chest
// pools must not offer highlights (basics). Non-local requests blocked.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch();
  for (const sex of ['m', 'f']) { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1000);
    await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    const clean = () => p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.overlay').forEach((m) => m.remove()));
    const st = (l) => p.evaluate((l) => { const x = window.__qb.x(), S = x.S, L = window.__qb.lookOf(); const o = window.QBLook.build(window.QBLoft.data.creator, L.rig);
      return l + ' ' + JSON.stringify({ coins: S.coins, owned: Object.keys(S.owned).filter((k) => /^bs_hi_/.test(k)), eq: S.eq.a_hairhi || null, rigHi: L.rig.hairHi || null, layer: !!o.layers.hairHi }); }, l);
    await p.evaluate((sex) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex }); S.xp = x.cum(12); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.calm = false; S.coins = 1000; window.__qbRooms.open('closet', 1); x.persist(); x.render(); }, sex);
    await p.waitForTimeout(800); await clean(); console.log(sex, await st('start'));
    const goStylist = async () => { await clean(); await p.evaluate(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(900); await clean(); await p.evaluate(() => { const t = document.querySelector('[data-act="stab"][data-v="basics"]'); t && t.click(); }); await p.waitForTimeout(1000); await clean(); };
    for (const c of ['blonde', 'pink']) { await goStylist();
      const r = await p.evaluate((c) => { const bt = document.querySelector(`[data-act="buy"][data-id="bs_hi_${c}"]`); if (!bt) return 'no buy button'; bt.click(); return 'bought'; }, c); await p.waitForTimeout(900);
      const w = await p.evaluate((c) => { const m = document.querySelector('#layer .modal'); const t = m ? m.innerText.replace(/\s+/g, ' ').slice(0, 80) : ''; const e = document.querySelector(`[data-act="equip"][data-id="bs_hi_${c}"]`); if (e) { e.click(); return 'window: ' + t + ' | tapped Wear'; } return 'window: ' + t + ' | no Wear button'; }, c);
      await p.waitForTimeout(800); console.log(sex, c, r, '|', w); console.log(sex, await st('after ' + c)); }
    await p.screenshot({ path: `${OUT}_${sex}_pink.png` });
    // the Wardrobe: take the highlights off
    await clean(); await p.evaluate(() => { const t = document.querySelector('[data-act="stab"][data-v="wardrobe"]'); t && t.click(); }); await p.waitForTimeout(900); await clean();
    const off = await p.evaluate(() => { const u = document.querySelector('[data-act="unequip"][data-id="bs_hi_pink"]') || [...document.querySelectorAll('[data-act="unequip"]')].find((e) => /a_hairhi|highlight/i.test(e.outerHTML)); if (u) { u.click(); return 'tapped Take off'; }
      const card = document.querySelector('[data-id="bs_hi_pink"]'); if (card) { card.click(); return 'opened the card: ' + card.dataset.act; } return 'no highlights in the Wardrobe'; }); await p.waitForTimeout(900);
    const off2 = await p.evaluate(() => { const u = document.querySelector('#layer .modal [data-act="unequip"]'); if (u) { u.click(); return 'tapped Take off in its window'; } return ''; }); await p.waitForTimeout(800);
    console.log(sex, off, off2); console.log(sex, await st('after take off'));
    const pools = await p.evaluate(() => { try { const x = window.__qb.x(); return 'milestone offer has highlights: ' + JSON.stringify(Object.values(x.S.mile || {}).flat().filter((v) => /^bs_hi_/.test(String(v)))); } catch (e) { return 'n/a'; } });
    console.log(sex, pools, 'page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await ctx.close(); }
  await b.close(); })();
