// NICE COCK's 10 repainted pieces (ROOMS bcd8f73, Cal approved the comfort redo 2026-11-17) on the plain build. NICE COCK moved to the
// Street and drops there Fri 11-20 (Cal, 2026-11-17; 29zz_ncstreet.js). A level-12 player (Street only), clock Fri Nov 20 10 am: NICE COCK
// is live on the Street with DIAL-UP and OVERPASS (3 live, Cal 2026-11-17) and its splash shows; every piece has ROOMS's name and line inside its grade's Street band
// (standard 250-440, premium 440-450); the Shop lists all 10; art loads; no old names. The day before (Thu 11-19), HANGANG, DIAL-UP and OVERPASS, no NICE COCK.
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
  const shop = (DAY) => p.evaluate(async ([WANT, DAY]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, DAY, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.brandSeen = {}; ['hanga', 'y2k', 'over', 'alt', 'smk'].forEach((id) => { S.brandSeen[id] = 1; }); S.cls = Object.keys(window.__qbCls || {})[0] || S.cls || 'vanguard'; S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = {}; window.__qbRooms.open('closet', 1); x.render(); await new Promise((o) => setTimeout(o, 500));
    const bf = window.__qbDrops.floor('street', new Date(2026, 10, DAY, 10, 0).getTime()), live = ((bf && bf.live) || []).map((q) => q.id);
    const rows = {}; Object.keys(WANT).forEach((k) => { const it = x.SHOP.find((q) => q[0] === 'gx_nc_' + k); rows[k] = it ? { n: it[2], p: it[3], line: it[5] } : null; });
    document.querySelector('.nav button[data-v="shop"]').click(); let splash = ''; for (let i = 0; i < 5; i++) { await new Promise((o) => setTimeout(o, 1500)); const bs = [...document.querySelectorAll('.bsplash')].map((m) => m.innerText.split('\n').filter(Boolean).slice(1, 3).join(' ')); splash += bs.join(' | ') + ' | '; document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); } document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); x.render(); await new Promise((o) => setTimeout(o, 800));
    return { live, rows, splash, text: document.getElementById('app').innerText }; }, [WANT, DAY]);
  const t = await shop(19); ok(t.live.join() === 'hanga,y2k,over' && !/NICE COCK/.test(t.text) && ['HANGANG', 'DIAL-UP', 'OVERPASS'].every((n) => t.text.includes(n)), 'Thu Nov 19: the Street shows HANGANG, DIAL-UP and OVERPASS (3 live, Cal 11-17), no NICE COCK ' + JSON.stringify(t.live));
  await p.reload(); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r = await shop(20);
  ok(r.live.join() === 'y2k,over,nc', 'Fri Nov 20: the Street is DIAL-UP, OVERPASS and NICE COCK (HANGANG retires) ' + JSON.stringify(r.live));
  ok(/NICE COCK/i.test(r.splash), 'Fri Nov 20: the NICE COCK splash shows (the splashes in turn) ' + JSON.stringify(r.splash.slice(0, 120)));
  const band = { standard: [250, 440], premium: [440, 450] };
  for (const k of Object.keys(WANT)) { const w = WANT[k], g = r.rows[k]; if (k === 'band') { await p.evaluate(() => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); window.__qb.x().render(); }); await p.waitForTimeout(800); r.text = await p.evaluate(() => document.getElementById('app').innerText); }
    ok(g && g.n === w[0] && g.p >= band[w[1]][0] && g.p <= band[w[1]][1], `${k}: ${g && g.n} ${g && g.p} coins (${w[1]} ${band[w[1]].join('-')}) "${g && g.line}"`);
    ok(r.text.indexOf(w[0]) >= 0, `  the Shop lists ${w[0]}`);
    for (const f of ['f_nc_' + k + '_front', 'icon_nc_' + k].concat(k === 'shades' ? [] : ['f_nc_' + k + '_back']))  /* shades are front-only, like every other brand's */ { const s = (await p.request.get(base + '/dist/art/app/' + f + '.webp').catch(() => null)); if (!s || s.status() !== 200) { const s2 = await p.request.get(base + '/art/app/' + f + '.webp'); ok(s2.status() === 200, `  ${f} ${s2.status()}`); } } }
  const lines = r.text.split('\n').map((t) => t.trim()); ok(OLD.every((n) => lines.indexOf(n) < 0), 'no old NICE COCK name on the Shop ' + JSON.stringify(OLD.filter((n) => lines.indexOf(n) >= 0)));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
