// Cal 11-26 (29zz_v215.js, 29zz_v201.js, 10_app_a.js): two crawls a day per teammate; no "Your next crawl finds something rare";
// the Vault's "< Shop" goes back to the Shop; the Vault's painted background stays put while the page scrolls.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/crawl215.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV215 && window.__qbV210, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()));
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(11); S.gates = [5, 10]; S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
    S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 }; S.story = S.story || {}; S.story.team = { sable: 1, mara: 1 }; S.dng = S.dng || {}; S.dng.npcs = { pip: 1 }; S.dng.runs = []; S.dng.cd = { d: '', n: 0 }; S.dng.dry = 0;
    S.owned = Object.assign(S.owned || {}, { bf_away: 1 }); S.areaOn = { board: 1, train: 1, hideout: 1, hall: 1, shop: 1, away: 1 }; S.base.slots = [{ t: 'bedroom', a: { bd_ward1: 1, bd_ward2: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }];
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="away"]').click(); });
  await p.waitForTimeout(900); await clear();
  const top = await V(() => { const t = document.querySelector('#app').innerText; return { cap: (t.match(/Crawls today\s*(\d+)\/(\d+)/) || []).slice(1).join('/'), sure: /finds something rare/.test(t) }; });
  ok(top.cap === '0/6' && !top.sure, 'three teammates make 6 crawls a day, and no "Your next crawl finds something rare" ' + JSON.stringify(top));
  const legacy = await V(() => { const x = window.__qb.x(), D = x.S.dng; D.cd = { d: D.cd.d || '', n: 3 }; x.render(); const t = document.querySelector('#app').innerText; const m = t.match(/Crawls today\s*(\d+)\/(\d+)/); x.S.dng.cd = { d: '', n: 0 }; x.render(); return m ? m[1] + '/' + m[2] : ''; });
  ok(legacy === '0/6', 'crawls from before the per-teammate rule do not use up today (Cal: 3/2 and stuck) ' + legacy);
  /* send Sable twice (each run brought home at once), then she is not offered */
  const go = await V(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms)), x = window.__qb.x(), out = [];
    for (let i = 0; i < 2; i++) { x.render(); await w(200); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('[data-act="dgo"][data-id="cellar"]').click(); await w(300);
      const s = [...document.querySelectorAll('#layer .v210who')].find((b) => /Sable/.test(b.textContent)); if (!s) { out.push('no Sable'); break; } s.click(); await w(300);
      const D = x.S.dng; D.runs.forEach((r) => { r.end = Date.now() - 1000; r.bad = false; }); x.render(); await w(200); document.querySelector('[data-act="dclaim"]').click(); await w(300); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); out.push(window.__qbV215.used('t:sable')); }
    x.render(); await w(200); document.querySelector('[data-act="dgo"][data-id="cellar"]').click(); await w(300);
    const who = [...document.querySelectorAll('#layer .v210who b')].map((b) => b.textContent); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    return { used: out, who, n: x.S.dng.cd.n, hurt: Object.keys(window.__qbV214.hurt()) }; });
  ok(go.used.join() === '1,2' && go.n === 2 && go.who.indexOf('Sable') < 0 && go.who.length === 2 + 0 - go.hurt.filter((k) => k !== 't:sable').length, 'Sable goes twice, then Who goes? offers only the others ' + JSON.stringify(go));
  await p.screenshot({ path: OUT + '/crawl215_cards.png' });
  /* the Vault: in, then "< Shop" back to the Shop's home screen */
  await clear(); const navs = []; await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(600); await clear(); await V(() => { const h = document.querySelector('.shub-back[data-shub="home"]'); if (h) h.click(); });
  await p.waitForTimeout(600); await clear();
  const vt = await V(async (NAVS) => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); const d = document.querySelector('[data-shub="vault"]'); if (!d) return { door: false, navs: NAVS }; d.click(); await w(500);
    const inV = !!document.querySelector('.v201v'); document.querySelector('.v201v .shub-back').click(); await w(500);
    const home = !!document.querySelector('.qshop.shub') && !document.querySelector('.v201v');
    /* and into a brand from there still works */
    const st = document.querySelector('[data-shub="street"]'); if (st) st.click(); await w(400); const street = !document.querySelector('.v201v') && !!document.querySelector('.qshop');
    return { door: true, inV, home, street }; }, navs);
  ok(vt.door && vt.inV && vt.home && vt.street, 'the Vault opens, "< Shop" goes back to the Shop, and the Street still opens after ' + JSON.stringify(vt));
  /* the background: with a picture in QBART, the Vault page carries it fixed */
  const bg = await V(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); const c = document.createElement('canvas'); c.width = 90; c.height = 160; const g = c.getContext('2d'); g.fillStyle = '#c33'; g.fillRect(0, 0, 90, 160);
    window.QBART['ui_vault_bg.webp'] = c.toDataURL(); document.querySelector('[data-shub="home"]') && document.querySelector('[data-shub="home"]').click(); await w(300); document.querySelector('[data-shub="vault"]').click(); await w(500);
    const el = document.querySelector('.v201v'); const cs = el && getComputedStyle(el, '::before'); window.scrollTo(0, 600); await w(200);
    const r = { on: !!(el && el.classList.contains('v215bg')), pos: cs && cs.position, img: cs && /url\(/.test(cs.backgroundImage), tall: document.documentElement.scrollHeight > 900, y: window.scrollY };
    delete window.QBART['ui_vault_bg.webp']; return r; });
  ok(bg.on && bg.pos === 'fixed' && bg.img, 'with the painting, the Vault sits on it, held still (fixed) behind the page ' + JSON.stringify(bg));
  await p.screenshot({ path: OUT + '/crawl215_vault.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
