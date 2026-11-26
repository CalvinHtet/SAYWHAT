// QA, 38a3fed4 (29zz_v182.js: before and after photos for cleaning tasks, Cal 11-26). What LEAD's ba182.js leaves out:
//  A. which chores ask: every bounty chore name (29f_bounty.js) and a list of how players type tasks, the misses and the false asks
//  B. a real phone-size before through the real file input (#v82in): what is kept, its size in localStorage, five of them at once
//  C. a full localStorage: the before fails softly ("Could not keep the photo on this phone")
//  D. two cleaning tasks back to back: the first after still being checked while the second is tapped (V82CUR is one slot)
//  E. "Done without a photo" with a before kept: is the before cleared
//  F. the pair as the town board shows it: the grid's square thumbnail (object-fit: cover) at 390, and the full picture
//   PORT=<plain build> OUT=<dir> NODE_PATH=<playwright> node rigtest/qa/ba182qa.js
const pw = require('playwright'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); }; const note = (s) => console.log('     ' + s);
const T = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 };
const src = fs.readFileSync(path.join(__dirname, '../../app/src/29f_bounty.js'), 'utf8');
const BTY = [...src.matchAll(/^\s*\["([^"]+)","[^"]*",\d+,"\w+","(\w+)"\]/gm)].map((m) => [m[1], m[2]]);
const TYPED = ['Clean my room', 'clean up my room', 'Clean the bathroom', 'Tidy up', 'Take out the trash', 'Wash the dishes', 'Do laundry', 'Fold laundry', 'Fold the clothes',
  'Put away clothes', 'Clean car', 'Wash my car', 'Mop the floor', 'Scrub the toilet', 'Wipe down the counters', 'Empty the dishwasher', 'Load the dishwasher', 'Declutter closet',
  'Hoover the stairs', 'Sweep the porch', 'Dust the shelves', 'Change the bed sheets', 'Make my bed', 'Clean the fridge', 'Clean the kitchen', 'Organise my desk', 'Clear my desk',
  'Clean eating for a day', 'Clean code refactor', 'Dust off my resume', 'Organize my files', 'Clean up my inbox', 'Organize my calendar', 'Sweep the leg', 'Clear my head', 'Wipe my phone', 'Mop up the backlog'];
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV182, null, { timeout: 120000 }); await p.waitForTimeout(600);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  const clr = () => V(() => document.querySelectorAll('#layer .modal,#layer > *').forEach((m) => m.remove()));
  /* A */
  const A = await V(([B, TY]) => ({ b: B.map(([n, cl]) => [n, cl, window.__qbV182.is({ name: n })]), t: TY.map((n) => [n, window.__qbV182.is({ name: n })]) }), [BTY, TYPED]);
  note('bounty chores: ' + A.b.length + ', asking ' + A.b.filter((r) => r[2]).length);
  note('home chores that do NOT ask: ' + JSON.stringify(A.b.filter((r) => r[1] === 'home' && !r[2]).map((r) => r[0])));
  note('non-home chores that ask: ' + JSON.stringify(A.b.filter((r) => r[1] !== 'home' && r[2]).map((r) => r[0] + ' (' + r[1] + ')')));
  note('typed, asking: ' + JSON.stringify(A.t.filter((r) => r[1]).map((r) => r[0])));
  note('typed, not asking: ' + JSON.stringify(A.t.filter((r) => !r[1]).map((r) => r[0])));
  ok(await V(() => !window.__qbV182.is({ name: 'Clean my desk', bty: 'x' }) && !window.__qbV182.is({ name: 'Clean my desk', rep: 'weekly4' })), 'bounties and the workout never ask');
  /* set up */
  await V((T) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.tours = T;
    S.quests = [{ id: 'c1', name: 'Clean my desk', cl: 'home', xp: 30, stat: 'productivity', rep: 'daily' }, { id: 'c3', name: 'Make my bed', cl: 'home', xp: 10, stat: 'productivity', rep: 'daily' },
      { id: 'c4', name: 'Vacuum the hall', cl: 'home', xp: 20, stat: 'productivity', rep: 'daily' }, { id: 'c5', name: 'Mop the floor', cl: 'home', xp: 20, stat: 'productivity', rep: 'daily' },
      { id: 'c6', name: 'Do the dishes', cl: 'home', xp: 10, stat: 'productivity', rep: 'daily' }];
    S.done = {}; Object.keys(localStorage).filter((k) => /^qb-ba-/.test(k)).forEach((k) => localStorage.removeItem(k)); x.persist(); x.render(); }, T);
  await p.waitForTimeout(600); await clr();
  /* B: a 12 MP phone photo with real detail (noise), landscape, through the input */
  const mkPhoto = (w, h, seed) => V(async ([w, h, seed]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const im = g.createImageData(w, h); let s = seed;
    for (let i = 0; i < im.data.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const v = s & 255, y = Math.floor(i / 4 / w); im.data[i] = (v + y / 8) & 255; im.data[i + 1] = (v >> 1) + 40; im.data[i + 2] = 255 - v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); g.fillStyle = '#fff'; g.font = 'bold ' + Math.round(h / 6) + 'px sans-serif'; g.fillText('L', w * 0.05, h * 0.3); g.fillText('R', w * 0.85, h * 0.3);
    const bl = await new Promise((o) => c.toBlob(o, 'image/jpeg', 0.9)); const a = new Uint8Array(await bl.arrayBuffer()); let str = ''; for (let i = 0; i < a.length; i += 32768) str += String.fromCharCode.apply(null, a.subarray(i, i + 32768)); return btoa(str); }, [w, h, seed]);
  const f1 = path.join(OUT, 'ba_before_land.jpg'), f2 = path.join(OUT, 'ba_after_port.jpg');
  fs.writeFileSync(f1, Buffer.from(await mkPhoto(4032, 3024, 7), 'base64')); fs.writeFileSync(f2, Buffer.from(await mkPhoto(3024, 4032, 11), 'base64'));
  note('test photos: before ' + Math.round(fs.statSync(f1).size / 1024) + ' KB (4032x3024), after ' + Math.round(fs.statSync(f2).size / 1024) + ' KB (3024x4032)');
  await V(() => document.querySelector('.qmain[data-id="c1"]').click()); await p.waitForTimeout(300);
  await p.setInputFiles('#v82in', f1); await p.waitForTimeout(2500);
  const B1 = await V(() => { const o = window.__qbV182.get('c1'); const raw = localStorage.getItem('qb-ba-c1') || ''; let exif = null; if (o) { const bin = atob(o.d.split(',')[1]); exif = /Exif/.test(bin.slice(0, 200)); }
    return { kept: !!o, bytes: raw.length, chip: !!document.querySelector('.qmain[data-id="c1"] .v82chip'), modal: !!document.querySelector('#layer .v82m'), exif, inSave: Object.keys(localStorage).filter((k) => !/^qb-ba-/.test(k)).some((k) => (localStorage.getItem(k) || '').indexOf('data:image/jpeg') >= 0), toast: [...document.querySelectorAll('.pop,.toast,#pop,.qpop')].map((e) => e.innerText).join(' | ').slice(0, 120) }; });
  const dim = await V(() => new Promise((o) => { const im = new Image(); im.onload = () => o([im.naturalWidth, im.naturalHeight]); im.src = window.__qbV182.get('c1').d; }));
  ok(B1.kept && B1.chip && !B1.modal && B1.exif === false && !B1.inSave, 'a 12 MP before through the input is kept on the phone only, scaled to ' + JSON.stringify(dim) + ', ' + Math.round(B1.bytes / 1024) + ' KB in localStorage, no EXIF, not in the save; the row says Before ✓; toast: ' + B1.toast);
  await p.screenshot({ path: OUT + '/ba_row.png' });
  for (const id of ['c3', 'c4', 'c5', 'c6']) { await clr(); await V((id) => document.querySelector('.qmain[data-id="' + id + '"]').click(), id); await p.waitForTimeout(250); await p.setInputFiles('#v82in', f1); await p.waitForTimeout(1800); }
  const B5 = await V(() => { let ba = 0, all = 0; for (const k of Object.keys(localStorage)) { const n = (localStorage.getItem(k) || '').length + k.length; all += n; if (/^qb-ba-/.test(k)) ba += n; } return { ba, all, n: Object.keys(localStorage).filter((k) => /^qb-ba-/.test(k)).length }; });
  note('five befores kept: ' + B5.n + ', ' + Math.round(B5.ba / 1024) + ' KB of ' + Math.round(B5.all / 1024) + ' KB in localStorage (Safari allows about 5 MB a site)');
  /* C: localStorage full */
  await clr(); const C = await V(() => { const pad = 'x'.repeat(256 * 1024); const ks = []; try { for (let i = 0; i < 80; i++) { localStorage.setItem('qa-pad-' + i, pad); ks.push('qa-pad-' + i); } } catch (e) {}
    const r = window.__qbV182.set('zz', 'data:image/jpeg;base64,' + 'A'.repeat(300 * 1024)); let saveOk = true; try { window.__qb.x().persist(); } catch (e) { saveOk = false; } ks.forEach((k) => localStorage.removeItem(k)); return { setOk: r, saveOk }; });
  ok(C.setOk === false && C.saveOk, 'a full localStorage: keeping a before fails softly (set returns false), the save does not throw ' + JSON.stringify(C));
  /* D: two cleaning tasks back to back */
  await clr(); await V(() => document.querySelector('.qmain[data-id="c1"]').click()); await p.waitForTimeout(300); const d1 = await V(() => ({ proof: !!document.getElementById('pf1'), cur: (window.__qbV182.cur() || {}).id }));
  await clr(); await V(() => document.querySelector('.qmain[data-id="c3"]').click()); await p.waitForTimeout(300); const d2 = await V(() => (window.__qbV182.cur() || {}).id);
  const D = await V(async () => { const blob = await (await fetch(window.__qbV182.get('c3').d)).blob(); const r = window.__qbV182.rem({ file: blob, kind: 'quest', what: 'Clean my desk' }); return { ba: r && r.ba || 0, cur: (window.__qbV182.cur() || {}).id }; });
  ok(D.ba === 1, 'two cleaning tasks back to back (c1 tapped, proof sent, c3 tapped while c1 is still being checked; c1 passes): c1\'s after is offered as the pair. Got ba ' + D.ba + ' (V82CUR went ' + d1.cur + ' -> ' + d2 + ')');
  await V(() => { const S = window.__qb.x().S; S.done.c1 = 30; window.__qb.x().render(); }); const D2 = await V(() => !!window.__qbV182.get('c1')); note('c1 done after that: its before still kept: ' + D2);
  /* E: Done without a photo with a before kept */
  await V(() => { const S = window.__qb.x().S; delete S.done.c1; S.done = {}; window.__qb.x().render(); }); await clr();
  await V(() => document.querySelector('.qmain[data-id="c4"]').click()); await p.waitForTimeout(300);
  await V(() => { const h = document.querySelector('#layer [data-act="honor"]'); if (h) h.click(); }); await p.waitForTimeout(600); await V(() => window.__qb.x().render());
  const E = await V(() => ({ done: !!window.__qb.x().S.done.c4, kept: !!window.__qbV182.get('c4'), cur: (window.__qbV182.cur() || {}).id }));
  ok(E.done && !E.kept, '"Done without a photo" with a before kept: the task is done and the before is cleared ' + JSON.stringify(E));
  /* F: the pair on the town board */
  const F = await V(async (f2b64) => { const a = Uint8Array.from(atob(f2b64), (c) => c.charCodeAt(0)); const after = new Blob([a], { type: 'image/jpeg' });
    const pair = await window.__qbV182.compose(window.__qbV182.get('c3').d, after); const pu = URL.createObjectURL(pair); const im = new Image(); await new Promise((o) => { im.onload = o; im.src = pu; });
    const can = (img, max) => { const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, k = Math.min(1, max / Math.max(w, h)), c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c; };
    const full = can(im, 1080), th = can(full, 360), tu = th.toDataURL('image/jpeg', 0.72), fu = full.toDataURL('image/jpeg', 0.82);
    const plain = document.createElement('canvas'); plain.width = 270; plain.height = 360; const g = plain.getContext('2d'); g.fillStyle = '#556'; g.fillRect(0, 0, 270, 360); g.fillStyle = '#fff'; g.font = '40px sans-serif'; g.fillText('plain', 70, 190);
    document.querySelectorAll('#layer > *').forEach((m) => m.remove()); const sec = document.createElement('section'); sec.className = 'card panel ph-feed'; sec.id = 'qaph';
    const card = (u, n) => '<button type="button" class="ph-card"><span class="ph-img"><img src="' + u + '" alt=""></span><span class="ph-meta"><b>' + n + '</b></span><span class="ph-n">&#9829; 0</span></button>';
    sec.innerHTML = '<div class="row ph-top"><h3 class="label">Photos</h3></div><div class="ph-grid">' + card(tu, 'You') + card(plain.toDataURL(), 'Sam') + card(plain.toDataURL(), 'Ana') + '</div>';
    const host = document.querySelector('main') || document.body; host.prepend(sec); sec.scrollIntoView(); await new Promise((o) => setTimeout(o, 400));
    const ib = sec.querySelector('.ph-card img').getBoundingClientRect(); const fit = getComputedStyle(sec.querySelector('.ph-card img')).objectFit;
    /* the part of the pair a square cover crop shows, in the pair's own pixels */
    const W = im.naturalWidth, H = im.naturalHeight, vis = H, x0 = (W - vis) / 2; const bw = Math.round((W - 10) * 0), ws = [];
    return { pair: [W, H], kb: Math.round(pair.size / 1024), full: [full.width, full.height], thumb: [th.width, th.height], cell: [Math.round(ib.width), Math.round(ib.height)], fit, shownX: [Math.round(x0), Math.round(x0 + vis)], fullUrl: fu, thumbUrl: tu }; }, fs.readFileSync(f2).toString('base64'));
  await p.screenshot({ path: OUT + '/ba_grid390.png' }); await p.locator('#qaph .ph-card').first().screenshot({ path: OUT + '/ba_grid_cell.png' });
  fs.writeFileSync(OUT + '/ba_pair_full.jpg', Buffer.from(F.fullUrl.split(',')[1], 'base64'));
  const bW = Math.round(900 * 4 / 3), labelB = [18, 18 + 32 + 120]; const shows = (a, z) => a >= F.shownX[0] && z <= F.shownX[1];
  note('the pair ' + JSON.stringify(F.pair) + ' ' + F.kb + ' KB; posted full ' + JSON.stringify(F.full) + ', thumb ' + JSON.stringify(F.thumb) + '; grid cell ' + JSON.stringify(F.cell) + ' ' + F.fit + '; the cell shows x ' + JSON.stringify(F.shownX) + ' of ' + F.pair[0]);
  ok(shows(labelB[0], labelB[1]), 'the grid cell shows the BEFORE label (it sits at x 18..170 of the pair): ' + (shows(labelB[0], labelB[1]) ? 'yes' : 'no, cut off; the cell shows the inner ' + Math.round(100 * (F.shownX[1] - F.shownX[0]) / F.pair[0]) + '% and AFTER only'));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
