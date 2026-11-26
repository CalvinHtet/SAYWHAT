// QA, Cal 11-26 ("some actions are blocked while syncing"): on each screen and window, every visible control a tap reaches normally but not
// with html.qb-sync on (29zx_simple.js pointer-events:none, 29zz_v158.js's allow-list). Same page, same moment, with and without the class,
// so a window covering the page counts for neither. Sandbox web build with OUT/state.json (rigtest/qa/_explore186.js).
//   BASE=<sandbox dist-web index> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/sync186qa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8824/dist-web/index.html', OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, storageState: OUT + '/state.json' }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE); await p.waitForFunction(() => window.__qb && document.querySelector('.strip .avbtn'), null, { timeout: 120000 }); await p.waitForTimeout(3000);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub,#qbt,#qbsandbox{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const clr = () => V(() => document.querySelectorAll('#layer > *,.bsplash,.dropsplash').forEach((m) => m.remove()));
  const scan = () => V(() => { const one = () => { const reach = {}; for (const e of document.querySelectorAll('button,[data-act],[data-shub],input,textarea,select,label,[role=button],.v81c')) { const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue; const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2)); const h = document.elementFromPoint(x, y);
        const k = (e.dataset.act || (e.dataset.shub ? 'shub=' + e.dataset.shub : e.className && typeof e.className === 'string' && /v81c/.test(e.className) ? 'v81c' : e.tagName.toLowerCase())) + (e.dataset.v ? '=' + e.dataset.v : '') + ' "' + (e.innerText || e.value || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 26) + '"';
        reach[k] = reach[k] || (cs.pointerEvents !== 'none' && !!(h && (h === e || e.contains(h)))); } return reach; };
      const a = one(); document.documentElement.classList.add('qb-sync'); const s = one(); document.documentElement.classList.remove('qb-sync');
      return { blocked: Object.keys(a).filter((k) => a[k] && !s[k]), open: Object.keys(a).filter((k) => a[k] && s[k]).length }; });
  const out = {}; const rec = async (lab) => { out[lab] = await scan(); console.log('## ' + lab + ' (' + out[lab].open + ' still work): ' + out[lab].blocked.join(' | ')); };
  const go = async (v) => { await clr(); await V((v) => document.querySelector('.nav button[data-v="' + v + '"]').click(), v); await p.waitForTimeout(1500); await clr(); };
  await go('board'); await rec('Board');
  await V(() => { const t = document.querySelector('[data-act="qpri"]'); if (t) t.click(); }); await p.waitForTimeout(600); await rec('Board: priority window'); await clr();
  await V(() => { const t = document.querySelector('[data-act="qrep"]'); if (t) t.click(); }); await p.waitForTimeout(600); await rec('Board: repeat window'); await clr();
  await go('train'); await rec('Training');
  await V(() => { const t = document.querySelector('[data-act="wkplan"]'); if (t) t.click(); }); await p.waitForTimeout(800); await rec('Training: a gym plan'); await clr();
  await go('hideout'); await rec('Loft street');
  await V(() => document.querySelector('[data-act="bldgo"][data-v="0"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await p.waitForTimeout(1500); await clr(); await rec('Loft building');
  await V(() => window.__qb.roomModal(window.__qb.x().S.base.slots.findIndex((r) => r && r.t === 'bedroom'))); await p.waitForTimeout(1200); await rec('Room window (Bedroom)'); await clr();
  await go('shop'); await V(() => { try { window.__qbV149.go('home'); } catch (e) {} }); await p.waitForTimeout(900); await clr(); await rec('Shop home');
  for (const k of ['street', 'stylist', 'iface', 'pets', 'closet']) { await V((k) => window.__qbV149.go(k), k); await p.waitForTimeout(1200); await clr(); await rec('Shop ' + k); }
  await go('hall'); await rec('Town');
  for (const t of ['chat', 'players']) { await V((t) => { const e = [...document.querySelectorAll('[data-act="htab"]')].find((x) => (x.dataset.v || x.textContent).toLowerCase().includes(t)); if (e) e.click(); }, t); await p.waitForTimeout(1200); await rec('Town ' + t); }
  await go('board'); await V(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1200); await rec('Player card');
  await V(() => { const e = document.querySelector('#layer [data-act="pcbgs"]'); if (e) e.click(); }); await p.waitForTimeout(1200); await rec('Player card: banners'); await clr();
  await V(() => { const e = document.querySelector('[data-act="char"]:not(.avbtn)'); if (e) e.click(); }); await p.waitForTimeout(1000); await rec('Profile'); await clr();
  await V(() => { const e = document.querySelector('.ibbtn,[data-act="inbox"]'); if (e) e.click(); }); await p.waitForTimeout(1000); await rec('Mailbox'); await clr();
  await go('board'); await V(() => document.querySelector('[data-act="nav"][data-v="wheel"]').click()); await p.waitForTimeout(1200); await rec('Scratch card');
  fs.writeFileSync(OUT + '/sync186.json', JSON.stringify(out, null, 1)); console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 3))); await b.close(); })();
