// QA, Cal 11-26 ("quick and snappy, no visible loading or freezing or missing assets"; LEAD's list). Sandbox web build (QB_SANDBOX=1
// QB_TARGET=web), 390x844 at DPR 3, CPU throttled (RATE, default 4x) through CDP. Software WebGL (swiftshader) draws the rig far slower
// than an iPhone GPU, so rig numbers are an upper bound; compare steps with each other, not with a phone.
//  1. cold start (empty HTTP cache, saved player): time to the header card, to its character, to the Board; also with a 4G-like network
//     and a warm reload
//  2. steps (tabs, Shop doors and tabs, Interface, Stylist, Pet Store, Closet, player card, banners, profile, Loft street, a building, a
//     room window, buying an upgrade, the Town and its tabs, the scratch card, a level-up): time to first change and to the step's
//     content, time until it stops changing, long tasks over 100 ms, pictures that land after the content (pop-in), pictures still blank
//     at the content time, and the top self-time functions (CDP Profiler) when a long task ran
//  3. "Still syncing": html.qb-sync forced on each screen; every visible control a tap cannot reach (29zz_v158.js lets only looking through)
//   SETUP: run rigtest/qa/_explore186.js first (OUT/state.json, a level-30 sandbox player with every area and the Closet)
//   OUT=<dir> [RATE=4] NODE_PATH=<playwright> node rigtest/qa/perf186qa.js
const pw = require('playwright'), fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8824/dist-web/index.html', OUT = process.env.OUT, RATE = +process.env.RATE || 4;
const INIT = () => { window.__pf = { lt: [], loads: [], lastMut: 0, nmut: 0, cold: {} };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__pf.lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  document.addEventListener('load', (e) => { const t = e.target; if (!t || t.tagName !== 'IMG') return; if (t.classList && t.classList.contains('calp') && t.closest && t.closest('.strip')) { window.__pf.hdr = (window.__pf.hdr || 0) + 1; return; } const r = t.getBoundingClientRect(); const vis = r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    window.__pf.loads.push([Math.round(performance.now()), String(t.className || (t.parentElement && t.parentElement.className) || t.alt || '').slice(0, 28), String(t.currentSrc || t.src || '').replace(/^data:([^;,]*)[\s\S]*/, 'data:$1').replace(/^.*\//, '').slice(0, 40), vis ? 1 : 0]); }, true);
  const mo = new MutationObserver((ms) => { const real = ms.filter((m) => !(m.type === 'attributes' && m.target && m.target.closest && m.target.closest('.strip .avbtn'))); if (!real.length) return; window.__pf.lastMut = performance.now(); window.__pf.nmut += real.length; });
  const C = window.__pf.cold; const tick = () => { const n = performance.now(); const a = document.querySelector('.strip .avbtn'); if (a && !C.card) C.card = Math.round(n);
    const im = a && a.querySelector('img'); if (im && !C.fig && im.naturalWidth > 0 && im.complete && !/^data:image\/gif/.test(im.getAttribute('src') || '')) { C.fig = Math.round(n); C.figSrc = (im.getAttribute('src') || '').slice(0, 30); }
    if (a && !C.cv) { const cv = a.querySelector('canvas'); if (cv && cv.width) C.cv = Math.round(n); }
    if (!C.board && document.querySelector('.qmain')) C.board = Math.round(n); if (!C.creator && document.querySelector('[data-act="ccnext"]')) C.creator = Math.round(n);
    if (!(C.fig && C.board) && n < 60000) requestAnimationFrame(tick); };
  document.addEventListener('DOMContentLoaded', () => { mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'class', 'style'] }); C.dcl = Math.round(performance.now()); requestAnimationFrame(tick); }); };
const top = (prof, n) => { const self = {}; const byId = {}; prof.nodes.forEach((nd) => { byId[nd.id] = nd; }); const dt = prof.timeDeltas; for (let i = 0; i < prof.samples.length; i++) { const nd = byId[prof.samples[i]]; const cf = nd.callFrame; const k = (cf.functionName || '(anon)') + ' ' + (cf.url ? cf.url.replace(/^.*\//, '').replace(/\?.*$/, '') + ':' + (cf.lineNumber + 1) : ''); self[k] = (self[k] || 0) + (dt[i] || 0) / 1000; }
  return Object.entries(self).filter(([k]) => !/^\(idle\)/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => k.trim() + ' ' + Math.round(v)); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const res = { rate: RATE, cold: [], steps: [], sync: {} }; const errs = [];
  const mk = async (net) => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, storageState: OUT + '/state.json' }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    await ctx.addInitScript(INIT); const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160))); const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
    if (net) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 70, downloadThroughput: 1.6e6, uploadThroughput: 0.75e6 }); } return { ctx, p, cdp }; };
  const coldRead = async (p, lab) => { await p.waitForFunction(() => window.__pf && window.__pf.cold.fig && window.__pf.cold.board, null, { timeout: 120000 }).catch(() => {}); await p.waitForTimeout(3000);
    const r = await p.evaluate(() => { const C = window.__pf.cold; return Object.assign({}, C, { lt100: window.__pf.lt.filter((x) => x[1] > 100 && x[0] < (C.fig || 9e9) + 500), ltAll: window.__pf.lt.filter((x) => x[1] > 100).length, ltMax: Math.max(0, ...window.__pf.lt.map((x) => x[1])) }); }); r.lab = lab; res.cold.push(r); console.log('COLD ' + lab + ' ' + JSON.stringify(r)); };
  /* 1. cold starts */
  { const { ctx, p } = await mk(false); await p.goto(BASE); await coldRead(p, 'empty cache, local network'); await p.reload(); await coldRead(p, 'warm reload'); await ctx.close(); }
  { const { ctx, p } = await mk(true); await p.goto(BASE); await coldRead(p, 'empty cache, 4G-like (70 ms, 1.6 MB/s)'); await ctx.close(); }
  /* 2. steps, one page */
  const { ctx, p, cdp } = await mk(false); await p.goto(BASE); await coldRead(p, 'empty cache (step page)'); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
  const V = (f, a) => p.evaluate(f, a); const clr = () => V(() => document.querySelectorAll('#layer > *,.bsplash,.dropsplash,#qbtour,.tour-ring,.tour-bub').forEach((m) => m.remove()));
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); await clr();
  /* the header's idle animation: how often its picture changes, how many different pictures, and what it costs, over 10 s on the Board */
  { await cdp.send('Profiler.start'); const h = await V(async () => { const im = document.querySelector('.strip .avbtn img'); const seen = new Set(); let n = 0; const lt0 = window.__pf.lt.length; const t0 = performance.now();
      const ob = new MutationObserver(() => { n++; seen.add(im.getAttribute('src')); }); ob.observe(im, { attributes: true, attributeFilter: ['src'] }); await new Promise((r) => setTimeout(r, 10000)); ob.disconnect();
      const lts = window.__pf.lt.slice(lt0); return { changes: n, distinct: seen.size, blob: [...seen].filter((s) => /^blob:/.test(s)).length, lt50: lts.length, ltMs: lts.reduce((a, x) => a + x[1], 0) }; });
    const { profile } = await cdp.send('Profiler.stop'); h.top = top(profile, 8); res.header = h; console.log('HEADER ' + JSON.stringify(h)); }
  const quiet = (ms, cap) => p.waitForFunction(([ms]) => performance.now() - Math.max(window.__pf.lastMut, (window.__pf.loads.slice(-1)[0] || [0])[0]) > ms, [ms], { timeout: cap, polling: 100 }).catch(() => null);
  const step = async (name, act, sel, keep) => { if (!keep) await clr(); await quiet(500, 6000); await cdp.send('Profiler.start');
    const t0 = await V((act) => { window.__pf.t0 = performance.now(); window.__pf.mut0 = window.__pf.nmut; window.__pf.first = 0; window.__pf.ready = 0; window.__pf.blank = null; (0, eval)(act); return window.__pf.t0; }, act);
    const ready = await p.waitForFunction((sel) => { const P = window.__pf, n = performance.now(); if (!P.first && P.nmut > P.mut0) P.first = n; let ok = false;
      if (sel) { const e = [...document.querySelectorAll(sel)].find((x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0; }); ok = !!e; } else ok = !!P.first;
      if (ok) { P.ready = n; P.blank = [...document.querySelectorAll('img')].filter((i) => { const r = i.getBoundingClientRect(); return r.width > 8 && r.height > 8 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(i).visibility !== 'hidden' && !(i.complete && i.naturalWidth > 0); }).map((i) => String(i.className || (i.parentElement && i.parentElement.className) || '').slice(0, 24) + ':' + String(i.getAttribute('src') || '').replace(/^data:([^;,]*)[\s\S]*/, 'data:$1').replace(/^.*\//, '').slice(0, 30)); }
      return ok; }, sel, { timeout: 15000, polling: 'raf' }).then(() => true).catch(() => false);
    await quiet(700, 12000); const { profile } = await cdp.send('Profiler.stop');
    const r = await V((t0) => { const P = window.__pf, rdy = P.ready || 0, settle = Math.max(P.lastMut, (P.loads.slice(-1)[0] || [0])[0]) - t0;
      return { first: P.first ? Math.round(P.first - t0) : null, ready: rdy ? Math.round(rdy - t0) : null, settle: Math.round(settle), lt: P.lt.filter((x) => x[0] >= t0 - 20 && x[1] > 100).map((x) => [Math.round(x[0] - t0), x[1]]),
        pop: P.loads.filter((x) => x[0] > (rdy || t0) + 40 && x[3]).map((x) => '+' + Math.round(x[0] - t0) + ' ' + x[1] + ' ' + x[2]).slice(0, 8), blank: (P.blank || []).slice(0, 8) }; }, t0);
    r.name = name; r.found = ready; if (r.lt.length) r.top = top(profile, 7); res.steps.push(r); console.log('STEP ' + JSON.stringify(r));
    await p.screenshot({ path: OUT + '/pf_' + name.replace(/\W+/g, '_') + '.png', scale: 'css' }).catch(() => {}); return r; };
  const nav = (v) => "document.querySelector('.nav button[data-v=\"" + v + "\"]').click()";
  /* tabs */
  for (const [v, sel] of [['train', '[data-act="wkplan"]'], ['hideout', '[data-act="bldgo"]'], ['shop', '.qshop'], ['hall', '[data-act="htab"]'], ['board', '.qmain']]) await step('tab ' + v, nav(v), sel);
  for (const [v, sel] of [['train', '[data-act="wkplan"]'], ['hideout', '[data-act="bldgo"]'], ['shop', '.qshop'], ['hall', '[data-act="htab"]'], ['board', '.qmain']]) await step('tab ' + v + ' (again)', nav(v), sel);
  /* the Shop */
  await step('tab shop', nav('shop'), '.shub-tiles');
  await step('Shop door Street', "document.querySelector('[data-shub=\"street\"]').click()", '.qs-sec [data-act="qstry"]');
  const brands = await V(() => [...document.querySelectorAll('[data-act="stab"]')].map((e) => e.dataset.v));
  for (const v of brands) await step('brand tab ' + v, "document.querySelector('[data-act=\"stab\"][data-v=\"" + v + "\"]').click()", null);
  const cats = await V(() => [...document.querySelectorAll('.v81cats .v81c')].length);
  for (let i = 0; i < Math.min(cats, 4); i++) await step('category tab ' + i, "document.querySelectorAll('.v81cats .v81c')[" + i + "].click()", null);
  await step('try on a piece', "document.querySelector('[data-act=\"qstry\"]').click()", null);
  for (const [k, sel] of [['stylist', '[data-act="qstry"]'], ['iface', '[data-act="pctry"]'], ['pets', '[data-act="p2tab"]'], ['closet', null]]) {
    await step('Shop home', "document.querySelector('[data-shub=\"home\"]').click()", '.shub-tiles'); await step('Shop door ' + k, "document.querySelector('[data-shub=\"" + k + "\"]').click()", sel);
    if (k === 'iface') { await step('Interface tab effects', "document.querySelector('[data-act=\"iftab\"][data-v=\"fx\"]').click()", null); await step('Interface tab banners', "document.querySelector('[data-act=\"iftab\"][data-v=\"ban\"]').click()", null); await step('try on a banner', "document.querySelector('[data-act=\"pctry\"]').click()", null); }
    if (k === 'pets') await step('Pet Store tab wolf', "document.querySelector('[data-act=\"p2tab\"][data-id=\"wolf\"]').click()", null);
    if (k === 'stylist') await step('Stylist try a hair', "document.querySelectorAll('[data-act=\"qstry\"]')[2].click()", null); }
  /* the player card, banners, the profile */
  await step('tab board', nav('board'), '.qmain');
  await step('player card', "document.querySelector('.strip .avbtn').click()", '#layer .modal');
  await step('player card: banners', "document.querySelector('#layer [data-act=\"pcbgs\"]').click()", null, 1);
  await step('profile', "document.querySelector('[data-act=\"char\"]:not(.avbtn)') ? document.querySelector('[data-act=\"char\"]:not(.avbtn)').click() : document.querySelector('[data-act=\"char\"]').click()", '#layer .modal');
  /* the Loft */
  await step('tab hideout', nav('hideout'), '[data-act="bldgo"]');
  await step('enter the building', "document.querySelector('[data-act=\"bldgo\"][data-v=\"0\"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))", '[data-act="bldout"]');
  await step('room window (Bedroom)', "window.__qb.roomModal(window.__qb.x().S.base.slots.findIndex((r)=>r&&r.t==='bedroom'))", '#layer .modal', 1);
  await step('buy an upgrade', "(()=>{const x=window.__qb.x();const b=[...document.querySelectorAll('#layer [data-act=\"raddon\"]')].find((e)=>!e.disabled);if(b)b.click();window.__pfBuy=b?b.dataset.id:'none'})()", null, 1);
  console.log('     bought: ' + await V(() => window.__pfBuy));
  await step('back to the street', "document.querySelector('[data-act=\"bldout\"]').click()", '[data-act="bldgo"]');
  /* the Town */
  await step('tab hall', nav('hall'), '[data-act="htab"]');
  const ht = await V(() => [...document.querySelectorAll('[data-act="htab"]')].map((e) => e.dataset.v || e.textContent.trim()));
  for (let i = 0; i < ht.length; i++) await step('Town tab ' + ht[i], "document.querySelectorAll('[data-act=\"htab\"]')[" + i + "].click()", null);
  /* the scratch card, a level-up */
  await step('tab board', nav('board'), '.qmain');
  await step('scratch card', "document.querySelector('[data-act=\"nav\"][data-v=\"wheel\"]').click()", null);
  await step('tab board', nav('board'), '.qmain');
  await step('level-up', "document.querySelector('[data-act=\"simlvl\"]').click()", '#layer .modal');
  await step('tick a task', "(()=>{const t=document.querySelector('[data-act=\"toggle\"]');if(t)t.click()})()", null);
  /* 3. Still syncing */
  const blocked = async (lab) => { const r = await V(() => { document.documentElement.classList.add('qb-sync'); const out = [], ok = [];
    for (const e of document.querySelectorAll('button,[data-act],[data-shub],input,textarea,select,label,[role=button]')) { const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue; const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
      const h = document.elementFromPoint(x, y); const k = (e.dataset.act || (e.dataset.shub ? 'shub=' + e.dataset.shub : e.tagName.toLowerCase())) + (e.dataset.v ? '=' + e.dataset.v : '') + (e.dataset.id ? '#' + e.dataset.id.slice(0, 12) : '') + ' "' + (e.innerText || e.value || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 24) + '"';
      const pe = getComputedStyle(e).pointerEvents; if (pe === 'none' || !(h && (h === e || e.contains(h) || h.contains(e)))) out.push(k); else ok.push(k); }
    document.documentElement.classList.remove('qb-sync'); return { blocked: [...new Set(out)], open: [...new Set(ok)] }; }); res.sync[lab] = r; console.log('SYNC ' + lab + ' blocked ' + r.blocked.length + ': ' + r.blocked.join(' | ')); };
  await clr(); await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(1500); await clr(); await blocked('Board');
  await V(() => document.querySelector('.nav button[data-v="train"]').click()); await p.waitForTimeout(1500); await clr(); await blocked('Training');
  await V(() => document.querySelector('.nav button[data-v="hideout"]').click()); await p.waitForTimeout(2000); await clr(); await blocked('Loft street');
  await V(() => document.querySelector('[data-act="bldgo"][data-v="0"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await p.waitForTimeout(2000); await clr(); await blocked('Loft building');
  await V(() => window.__qb.roomModal(window.__qb.x().S.base.slots.findIndex((r) => r && r.t === 'bedroom'))); await p.waitForTimeout(1500); await blocked('Room window'); await clr();
  await V(() => document.querySelector('.nav button[data-v="shop"]').click()); await p.waitForTimeout(1500); await clr(); await V(() => { try { window.__qbV149.go('home'); } catch (e) {} }); await p.waitForTimeout(800); await blocked('Shop home');
  await V(() => window.__qbV149.go('street')); await p.waitForTimeout(1500); await clr(); await blocked('Street Shop');
  await V(() => window.__qbV149.go('iface')); await p.waitForTimeout(1500); await clr(); await blocked('Interface');
  await V(() => document.querySelector('.nav button[data-v="hall"]').click()); await p.waitForTimeout(1500); await clr(); await blocked('Town');
  await V(() => document.querySelector('.nav button[data-v="board"]').click()); await p.waitForTimeout(1000); await clr(); await V(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1500); await blocked('Player card');
  await clr(); await V(() => document.querySelector('[data-act="nav"][data-v="wheel"]').click()); await p.waitForTimeout(1500); await blocked('Scratch card');
  res.errs = errs; fs.writeFileSync(OUT + '/perf186.json', JSON.stringify(res, null, 1)); console.log('page errors ' + errs.length + ' ' + JSON.stringify(errs.slice(0, 3))); await b.close(); })();
