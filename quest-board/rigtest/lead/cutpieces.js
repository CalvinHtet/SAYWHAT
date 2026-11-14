// The audit's cut pieces (ROOMS, Cal approved) on the plain build, the clock on Tue Nov 17 (OVERPASS on sale): the Shop lists OVERPASS's
// kept pieces but none of its cut ones; a player who owns a cut piece still finds it in their wardrobe; KODE PINK (held) is not on sale.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/cutpieces.js
const { chromium } = require('playwright');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--mute-audio'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 150)));
  await p.goto('http://127.0.0.1:' + (process.env.PORT || 8779) + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(800);
  const CUT = ['gx_o_beanie', 'gx_o_camp', 'gx_o_slides'];
  const shop = (own) => p.evaluate(async ([CUT, own]) => { const x = window.__qb.x(), S = x.S; const real = Date.now() - (window.__qbShift || 0); window.__qbShift = new Date(2026, 10, 17, 10, 0).getTime() - real;
    S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(30); S.calm = false; S.fsall = 1; S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.owned = own ? { gx_o_beanie: 1 } : {}; window.__qbRooms.open('closet', 1); x.render();
    const live = window.__qbDrops.state().live.map((q) => q.id);
    document.querySelector('.nav button[data-v="shop"]').click(); await new Promise((o) => setTimeout(o, 1500)); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); x.render(); await new Promise((o) => setTimeout(o, 800));
    const t = document.getElementById('app').innerText, h = document.getElementById('app').innerHTML;
    return { live, overKept: /Bandana|Gaiter|Tee/i.test(t) && /OVERPASS/i.test(t), names: ['Fisherman Beanie', 'Nylon Camp Cap', 'Socks & Slides'].filter((n) => t.indexOf(n) >= 0), kp: /KODE PINK/i.test(t) }; }, [CUT, own]);
  const a = await shop(false);
  ok(a.live.indexOf('over') >= 0 && a.live.indexOf('kp') < 0, `Tue Nov 17: OVERPASS live, KODE PINK not ${JSON.stringify(a.live)}`);
  ok(a.overKept && a.names.length === 0, `the Shop shows OVERPASS's kept pieces and none of the cut ones ${JSON.stringify(a)}`);
  const w = await shop(true);
  const ward = await p.evaluate(() => { const x = window.__qb.x(); try { const L = x.wardrobeList ? x.wardrobeList('a_hat') : null; } catch (e) {} const it = (x.SHOP || []).find((q) => q[0] === 'gx_o_beanie'); return { owned: !!x.S.owned.gx_o_beanie, inShopText: /Fisherman Beanie/.test(document.getElementById('app').innerText) }; });
  console.log('     owner view: ' + JSON.stringify({ w, ward }));
  ok(ward.owned && ward.inShopText, 'an owner still sees their Fisherman Beanie (as owned)');
  await b.close(); console.log('errors', JSON.stringify(errs.slice(0, 3))); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
