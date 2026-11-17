// NICE COCK's 10 repainted pieces (ROOMS bcd8f73, Cal approved the comfort redo 2026-11-17) on the plain build, clock Tue Nov 17 10 am:
// every piece is on sale with ROOMS's name and line, inside its grade's Boutique band (standard 600-800, premium 800-1050), the Shop
// lists it on the Boutique, its art loads (front, back, icon), and the old names are gone.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/ncrows.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const WANT = { band: ['Fleece Dad Cap', 'standard'], pendant: ['Cashmere Scarf', 'premium'], shades: ['Rimless Aviators', 'standard'],
  hoodie: ['Embossed Crest Hoodie', 'premium'], tee: ['Layered Lounge Tee', 'standard'], tank: ['Waffle Lounge Zip', 'premium'],
  qzip: ['Sherpa Fleece Zip', 'premium'], court: ['Silver Court High-Top', 'premium'], knit: ['Suede Runner', 'premium'], slide: ['Shearling Clogs & Socks', 'premium'] };
const OLD = ['Sweatband', 'Rooster Pendant', 'Sport Shades', 'Heavyweight Hoodie', 'Boxy Tee', 'Seamless Gym Tank', 'Performance Quarter-Zip', 'Knit Trainer', 'Pool Slide',
  'Leather Five-Panel', 'Iced Rooster Chain', 'Satin Track Jacket', 'Shearling Leather Bomber', 'Lug Chelsea Boot', 'Cracked Crest Tee'];
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  const base = 'http://127.0.0.1:' + (process.env.PORT || 8779);
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r = await p.evaluate(async (WANT) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, 17, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(31); S.gates = [5, 10, 20, 30, 40, 50, 65, 80, 100]; S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render(); await new Promise((o) => setTimeout(o, 500));
    const bf = window.__qbDrops.floor('boutique', new Date(2026, 10, 17, 10, 0).getTime()), live = ((bf && bf.live) || []).map((q) => q.id);
    const rows = {}; Object.keys(WANT).forEach((k) => { const it = x.SHOP.find((q) => q[0] === 'gx_nc_' + k); rows[k] = it ? { n: it[2], p: it[3], line: it[5] } : null; });
    document.querySelector('.nav button[data-v="shop"]').click(); await new Promise((o) => setTimeout(o, 1500)); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); x.render(); await new Promise((o) => setTimeout(o, 800));
    const fb = document.createElement('button'); fb.dataset.flgo = 'boutique'; document.body.appendChild(fb); fb.click(); fb.remove(); await new Promise((o) => setTimeout(o, 1500)); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); x.render(); await new Promise((o) => setTimeout(o, 800));
    return { live, rows, text: document.getElementById('app').innerText }; }, WANT);
  ok(r.live.indexOf('nc') >= 0, 'Tue Nov 17: NICE COCK live ' + JSON.stringify(r.live));
  const band = { standard: [600, 800], premium: [800, 1050] };
  for (const k of Object.keys(WANT)) { const w = WANT[k], g = r.rows[k];
    ok(g && g.n === w[0] && g.p >= band[w[1]][0] && g.p <= band[w[1]][1], `${k}: ${g && g.n} ${g && g.p} coins (${w[1]} ${band[w[1]].join('-')}) "${g && g.line}"`);
    ok(r.text.indexOf(w[0]) >= 0, `  the Shop lists ${w[0]}`);
    for (const f of ['f_nc_' + k + '_front', 'icon_nc_' + k].concat(k === 'shades' ? [] : ['f_nc_' + k + '_back']))  /* shades are front-only, like every other brand's */ { const s = (await p.request.get(base + '/dist/art/app/' + f + '.webp').catch(() => null)); if (!s || s.status() !== 200) { const s2 = await p.request.get(base + '/art/app/' + f + '.webp'); ok(s2.status() === 200, `  ${f} ${s2.status()}`); } } }
  const lines = r.text.split('\n').map((t) => t.trim()); ok(OLD.every((n) => lines.indexOf(n) < 0), 'no old NICE COCK name on the Shop ' + JSON.stringify(OLD.filter((n) => lines.indexOf(n) >= 0)));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
