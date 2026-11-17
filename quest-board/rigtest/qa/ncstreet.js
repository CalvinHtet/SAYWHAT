// NICE COCK on the Street from Fri 11-20 and random drops after (LEAD b10ca52, Cal 2026-11-17). For a level-31 player (all floors) and a
// level-12 player (the Street only), each as an owner of 3 NICE COCK pieces (worn) or not, on Tue 11-17 and Fri 11-20 (10 am): the splashes
// shown on opening the Shop, then each floor's brand tabs, the NICE COCK rack (prices, Equipped) and what the avatar wears.
//   BASE=<server of quest-board/> OUT=<folder> NODE_PATH=<playwright's parent> node rigtest/qa/ncstreet.js
const pw = require('playwright');
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
  let errsAll = 0;
  for (const LV of [31, 12]) for (const OWN of [1, 0]) for (const DAY of [17, 20]) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbDrops, null, { timeout: 120000 }); await p.waitForTimeout(800);
    const r = await p.evaluate(async ([LV, OWN, DAY]) => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms));
      const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, DAY, 10, 0).getTime() - real;
      S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(LV); S.gates = [5, 10, 20, 30, 40, 50, 65, 80, 100].filter((g) => g <= LV);
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1 }; S.calm = false; S.welcomed = 1; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.brandSeen = {};
      S.owned = {}; if (OWN) { ['gx_nc_band', 'gx_nc_tee', 'gx_nc_slide', 'gx_nc_jog_slate'].forEach((id) => { S.owned[id] = true; }); S.eq = { a_hat: 'gx_nc_band', a_top: 'gx_nc_tee', a_shoes: 'gx_nc_slide', a_pants: 'gx_nc_jog_slate' }; }
      window.__qbRooms.open('closet', 1); x.render(); await w(500);
      const e = window.__qb.lookOf().rig.equipped || {}, worn = Object.keys(e).map((s) => e[s].art).join(' ');
      const drops = {}; ['street', 'boutique', 'atelier'].forEach((f) => { const d = window.__qbDrops.floor(f, new Date(2026, 10, DAY, 10, 0).getTime()); drops[f] = ((d && d.live) || []).map((q) => q.id).join(','); });
      document.querySelector('.nav button[data-v="shop"]').click(); let splash = [];
      for (let i = 0; i < 5; i++) { await w(1300); document.querySelectorAll('.bsplash').forEach((m) => splash.push(m.innerText.split('\n').filter(Boolean).slice(0, 3).join(' '))); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); }
      x.render(); await w(600);
      const floors = [...document.querySelectorAll('[data-qsfl]')].map((t) => t.dataset.qsfl + (t.disabled || /lock/i.test(t.className + t.textContent) ? '(locked)' : ''));
      const out = {}; for (const f of floors.length ? floors.map((s) => s.replace('(locked)', '')) : ['-']) {
        if (f !== '-') { const t = document.querySelector('[data-qsfl="' + f + '"]'); t && t.click(); await w(700); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); }
        const tabs = [...document.querySelectorAll('[data-act=stab]')].map((t) => t.dataset.v).filter((v) => v !== 'wardrobe').join(',');
        const nc = document.querySelector('[data-act=stab][data-v="nc"]'); let rack = '';
        if (nc) { nc.click(); await w(700); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); const rk = document.querySelector('.qs-rack'); rack = rk ? rk.innerText.replace(/\s+/g, ' ') : ''; }
        out[f] = { tabs, nc: !!nc, prices: (rack.match(/· \d+/g) || []).map((s) => +s.slice(2)), equipped: (rack.match(/Equipped/g) || []).length };
        if (f === 'street' || f === 'boutique') { const app = document.getElementById('app').innerText; out[f].ncText = /NICE COCK/.test(app); } }
      return { worn, drops, splash, floors, out }; }, [LV, OWN, DAY]);
    await p.screenshot({ path: `${process.env.OUT}/ncstreet_lv${LV}_${OWN ? 'own' : 'new'}_11${DAY}.png` });
    errsAll += errs.length;
    console.log(`L${LV} ${OWN ? 'owner' : 'non-owner'} 11-${DAY}: live ${JSON.stringify(r.drops)} | worn ${r.worn || '-'} | splash ${JSON.stringify(r.splash)} | floors ${r.floors.join(' ')}`);
    Object.keys(r.out).forEach((f) => { const o = r.out[f]; console.log(`    ${f}: tabs ${o.tabs} | NICE COCK tab ${o.nc}${o.nc ? ' prices ' + (o.prices.length ? Math.min(...o.prices) + '-' + Math.max(...o.prices) + ' (' + o.prices.length + ')' : '-') + ' equipped ' + o.equipped : ''}`); });
    if (errs.length) console.log('    page errors', JSON.stringify(errs.slice(0, 2)));
    await p.close(); }
  console.log('page errors in all runs:', errsAll); await b.close(); })();
