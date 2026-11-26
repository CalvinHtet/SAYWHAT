// QA, 73160da0 (29zz_v175.js: the four seasons in place of live weather; Cal 11-25). LEAD checked these by screenshot only; this asserts.
// Per month (Jan, Mar, Jun, Sep, Nov, Dec) with the clock moved there: the season and its label ("Holidays" in December only), the
// Loft's street and a building view drawn: snow caps on the roofs only in winter, the warm string lights only in December, flowers in
// spring, leaf piles in fall, the falling overlay (snow / petals / leaves; none in summer) hidden under reduced motion; no request to the
// old weather service; no "N / hr" pill. Pictures of each season's building view.
//   PORT=<plain build> OUT=<dir> node season175qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1 };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = []; const wx = [];
  for (const [mon, want, rm] of [['01', 'winter'], ['03', 'spring'], ['06', 'summer'], ['09', 'fall'], ['11', 'fall'], ['12', 'winter'], ['12', 'winter', 'reduce']]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: rm || 'no-preference' }); await ctx.route('**/*', (r) => { const u = r.request().url(); if (/open-meteo/.test(u)) wx.push(u); return u.startsWith('http://127.0.0.1:') ? r.continue() : r.abort(); });
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.addInitScript((iso) => { const real = Date.now; const d = new Date(iso).getTime() - real(); Date.now = () => real() + d; const RD = Date; window.Date = class extends RD { constructor(...a) { if (!a.length) super(real() + d); else super(...a); } static now() { return real() + d; } }; }, '2027-' + mon + '-15T12:00:00');
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV175, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Seas', sex: 'm' }); S.xp = x.cum(30); S.gates = Array.from({ length: 200 }, (_, i) => i); S.tutDone = 1; S.calm = false; S.v67ref = 1; S.tours = T; S.areaOn = { board: 1, hideout: 1, shop: 1, train: 1 }; S.base.slots = ['bedroom', 'closet', 'garden', 'restaurant'].map((t) => ({ t, a: {}, st: 0, pend: 0 })); x.persist(); x.render(); for (const m of document.querySelectorAll('#layer > *')) m.remove(); const n = document.querySelector('.nav button[data-v="hideout"]'); if (n) n.click(); }, T);
    await p.waitForTimeout(2500); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); });
    const street = await p.evaluate(() => ({ season: window.__qbV175.season(), xmas: window.__qbV175.xmas(), text: (document.querySelector('#app') || document.body).innerText.replace(/\s+/g, ' '), bulbs: document.querySelectorAll('.v75bulb').length }));
    await p.evaluate(() => { const g = document.querySelector('[data-act="bldgo"][data-v="0"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(1500); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer > *')) m.remove(); });
    const bld = await p.evaluate(() => { const svg = document.querySelector('#lfwrap svg') || document.querySelector('#app svg'); const src = svg ? svg.outerHTML : ''; const air = document.querySelector('.v75air'); const hud = (document.querySelector('.lfhud') || {}).innerText || '';
      return { snowCaps: (src.match(/fill="#ffffff" opacity="\.96"/g) || []).length, bulbs: document.querySelectorAll('.v75bulb').length, flowers: (src.match(/stroke="#3f8f4e"/g) || []).length, leaves: (src.match(/#d9631e|#b9411a|#e8952c|#a8571d/g) || []).length, air: air ? { cls: air.className.baseVal || air.className, shown: getComputedStyle(air).display !== 'none' && getComputedStyle(air).visibility !== 'hidden', kids: air.childElementCount } : null, hud, label: ((document.body.innerText.match(/(Winter|Spring|Summer|Fall)( · Holidays)?/) || [])[0]) || '' }; });
    await p.screenshot({ path: OUT + '/season_' + mon + (rm ? '_rm' : '') + '.png' });
    const tag = '2027-' + mon + (rm ? ' reduced motion' : '');
    ok(street.season === want && street.xmas === (mon === '12'), tag + ': season ' + street.season + (street.xmas ? ' + Holidays' : ''));
    ok(new RegExp('^' + want[0].toUpperCase() + want.slice(1) + (mon === '12' ? ' · Holidays' : '') + '$').test(bld.label), tag + ': the label reads "' + bld.label + '"');
    ok((want === 'winter') === (bld.snowCaps > 0) && (mon === '12') === (bld.bulbs > 0) && (want === 'spring') === (bld.flowers > 0) && (want === 'fall') === (bld.leaves > 0), tag + ': the building view draws only its season\'s things ' + JSON.stringify({ snowCaps: bld.snowCaps, bulbs: bld.bulbs, flowers: bld.flowers, leaves: bld.leaves }));
    if (rm) ok(!bld.air || !bld.air.shown, tag + ': reduced motion hides the falling overlay ' + JSON.stringify(bld.air));
    else ok(want === 'summer' ? (!bld.air || !bld.air.kids || !bld.air.shown) : (bld.air && bld.air.shown && bld.air.kids > 0), tag + ': the falling overlay ' + (want === 'summer' ? 'is off in summer' : 'shows') + ' ' + JSON.stringify(bld.air));
    ok(!/\/ hr/.test(bld.hud) && !/°F/.test(street.text + bld.hud), tag + ': no "N / hr" and no temperature ' + JSON.stringify(bld.hud));
    await ctx.close(); }
  ok(!wx.length, 'no request to the old weather service (' + wx.length + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
