// QA, batch 1a (qa-local 6bfa2938, 29kv_visitors.js): the visiting player's name under their feet, white on dark, over the furniture
// (Cal 11-24: "put their username under their character in white text just like in Maplestory"). LEAD's headless run drew no visitor,
// so this one makes two: the sandbox web build (dist-web built with QB_SANDBOX=1, test tools on) with its own in-browser
// database (web.js sandboxHost, uid "sandbox"); the player's own worlds/<uid> doc, once published, is copied as two friends ("Sy" and a 24-letter name) with fresh
// timestamps; after a reload the Town knows them, and __qbVisit.force puts one in the Restaurant and one in the Garden. Then, over
// 20 s of walking: where the tag sits against the character's feet (screen boxes), that it is the last thing drawn in its room (over
// the furniture), that its text is white and whole, in the building view and in each room's window; and pictures to look at.
//   WEB=<server of quest-board/ with a sandbox dist-web> OUT=<dir> node nametag144.js
const pw = require('playwright'), fs = require('fs');
const WEB = process.env.WEB, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const VW = +(process.env.VW || 390), VH = +(process.env.VH || 844); console.log('     viewport', VW + 'x' + VH);
  const ctx = await b.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  const V = (f, a) => p.evaluate(f, a);
  const shut = () => V(() => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const ready = () => p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbVisit && window.QBLoft && QBLoft.data, null, { timeout: 180000 });
  await p.goto(WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]') || (window.__qb && window.__qb.x && window.__qb.x().S.created), null, { timeout: 180000 });
  if (await V(() => !!document.querySelector('[data-act="ccnext"]'))) { await p.fill('#ccname', 'Host'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); }
  await ready(); await p.waitForTimeout(2000); await shut();
  /* the host: level 30 with the Garden and the Restaurant fully upgraded (businesses: visitors only come to rooms that earn) */
  await V(() => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.xp = x.cum(30); S.gates = [5, 10, 20]; S.calm = false; S.coins = 5000; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    const full = (t) => Object.fromEntries((A[t] || []).filter((u) => !(u[3] && (u[3].retired || u[3].opens))).map((u) => [u[0], 1]));
    S.base.slots = ['bedroom', 'closet', 'garden', 'restaurant'].map((t) => ({ t, a: full(t), st: 0, pend: 0 })); x.persist(); x.render(); });
  /* the game publishes worlds/qa144; copy it as two friends */
  await p.waitForFunction(() => localStorage.getItem('qbsbx:worlds/sandbox'), null, { timeout: 40000 }).catch(() => {});
  console.log('     sandbox keys:', JSON.stringify(await V(() => Object.keys(localStorage).filter((k) => k.indexOf('qbsbx:worlds') === 0))));
  const mine = await V(() => localStorage.getItem('qbsbx:worlds/sandbox')); ok(!!mine, 'the host\'s own Town doc is published (' + (mine ? mine.length : 0) + ' bytes)'); if (!mine) { await b.close(); console.log('FAILED'); return; }
  await V(() => { const d = JSON.parse(localStorage.getItem('qbsbx:worlds/sandbox')); const now = Date.now();
    [['qaf1', 'Sy', 'm'], ['qaf2', 'Maximilian Thunderbolt X', 'f']].forEach(([id, n]) => { const w = JSON.parse(JSON.stringify(d)); w.name = n; w.t = now; w.lv = 20; localStorage.setItem('qbsbx:worlds/' + id, JSON.stringify(w)); }); });
  await p.waitForTimeout(2500); await p.reload(); await ready(); await p.waitForTimeout(3000); await shut();
  /* the Town loads its players when the Hall opens */
  await V(() => { const e = document.querySelector('.nav button[data-v="hall"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(4000); await shut();
  const fr = await V(() => window.__qbVisit.friends()); console.log('     friends the game sees:', JSON.stringify(fr));
  ok(fr.some((f) => f.u === 'qaf1') && fr.some((f) => f.u === 'qaf2'), 'both stand-in friends are in town');
  const v1 = await V(() => window.__qbVisit.force('restaurant', 'qaf1', 0, 60)), v2 = await V(() => window.__qbVisit.force('garden', 'qaf2', 0, 60));
  ok(!!v1 && !!v2, 'two visits forced: ' + (v1 && v1.n) + ' in the Restaurant, ' + (v2 && v2.n) + ' in the Garden');
  /* the tag against the character, the draw order, the text */
  const measure = () => V(() => [...document.querySelectorAll('.pv-tag')].map((t) => { const a = document.getElementById(t.dataset.a); const tr = t.getBoundingClientRect(), txt = t.querySelector('text'), rc = t.querySelector('rect');
    const host = t.parentNode; const ar = a ? a.getBoundingClientRect() : null; const fill = txt ? getComputedStyle(txt).fill : '';
    return { name: txt ? txt.textContent : '', vis: tr.width > 0 && tr.height > 0, tagTop: Math.round(tr.top), tagBot: Math.round(tr.bottom), tagW: Math.round(tr.width), tagH: Math.round(tr.height), tagCx: Math.round(tr.left + tr.width / 2),
      feet: ar ? Math.round(ar.bottom) : null, head: ar ? Math.round(ar.top) : null, charCx: ar ? Math.round(ar.left + ar.width / 2) : null, charH: ar ? Math.round(ar.height) : null,
      last: host && host.lastElementChild === t, fill, op: getComputedStyle(t).opacity, k: (() => { try { const m = t.getScreenCTM(); return +Math.sqrt(m.a * m.a + m.b * m.b).toFixed(3); } catch (e) { return null; } })(), f: t._f || null, textPx: txt ? +(txt.getBoundingClientRect().height).toFixed(1) : 0, textW: txt ? Math.round(txt.getBBox().width) : 0, rectW: rc ? Math.round(+rc.getAttribute('width')) : 0 }; }));
  const rows = [];
  /* the building view: inside the building that holds them */
  await V(() => { const e = document.querySelector('.nav button[data-v="hideout"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2500); await shut();
  const nb = await V(() => document.querySelectorAll('[data-act="bldgo"]').length);
  for (let i = 0; i < Math.max(nb, 1); i++) { if (nb) { await V(() => { const e = document.querySelector('[data-act="bldout"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(800); await V((i) => { const g = document.querySelectorAll('[data-act="bldgo"]')[i]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, i); }
    await p.waitForTimeout(4000); await shut();
    for (let k = 0; k < 4; k++) { const m = await measure(); m.forEach((r) => rows.push(Object.assign({ where: 'building ' + i, t: k * 5 }, r))); if (k === 0) await p.screenshot({ path: OUT + '/tag_building' + i + '.png' }); await p.waitForTimeout(5000); } }
  /* each room's window */
  for (const t of ['restaurant', 'garden']) { await shut(); const idx = await V((t) => window.__qb.x().S.base.slots.findIndex((r) => r && r.t === t), t); await V((i) => window.__qb.roomModal(i), idx); await p.waitForTimeout(4000);
    for (let k = 0; k < 4; k++) { const m = await measure(); m.forEach((r) => rows.push(Object.assign({ where: t + ' window', t: k * 5 }, r)));
      /* a close-up of each readable tag with its character, scrolled into view */
      for (const r of m.filter((q) => +q.op > 0 && q.vis)) { await V((n) => { const t = [...document.querySelectorAll('.pv-tag')].find((q) => q.textContent === n); if (t) t.scrollIntoView({ block: 'center' }); }, r.name); await p.waitForTimeout(300);
        const bx = await V((n) => { const t = [...document.querySelectorAll('.pv-tag')].find((q) => q.textContent === n); const a = t && document.getElementById(t.dataset.a); if (!t || !a) return null; const tr = t.getBoundingClientRect(), ar = a.getBoundingClientRect(); const x0 = Math.min(tr.left, ar.left) - 90, y0 = ar.top - 60, x1 = Math.max(tr.right, ar.right) + 90, y1 = tr.bottom + 50; return { x: Math.max(0, x0), y: Math.max(0, y0), width: x1 - Math.max(0, x0), height: y1 - Math.max(0, y0) }; }, r.name);
        if (bx && k < 2) await p.screenshot({ path: OUT + '/tag_close_' + t + '_' + k + '_' + r.name.slice(0, 4) + '.png', clip: bx }); }
      const box = await V(() => { const e = document.querySelector('#rbigw, .rbig'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
      await p.screenshot({ path: OUT + '/tag_' + t + '_' + k + '.png', clip: box ? { x: box.x, y: box.y, width: box.w, height: box.h } : undefined }); await p.waitForTimeout(5000); } }
  fs.writeFileSync(OUT + '/tag_rows.json', JSON.stringify(rows, null, 1));
  rows.forEach((r) => console.log('     ' + r.where.padEnd(19) + ' t' + String(r.t).padStart(2) + ' ' + r.name.padEnd(25) + ' tag ' + r.tagTop + '-' + r.tagBot + ' (' + r.tagW + 'x' + r.tagH + ') feet ' + r.feet + ' head ' + r.head + ' | dx ' + (r.tagCx - r.charCx) + ' | last ' + r.last + ' | text ' + r.textW + '/' + r.rectW + ' ' + r.fill + ' | opacity ' + r.op + ' k ' + r.k + ' scale ' + r.f + ' text ' + r.textPx + 'px'));
  const seen = rows.filter((r) => r.vis);
  const readable = rows.filter((r) => r.vis && +r.op > 0 && r.textPx >= 8);
  ok(readable.length > 0, 'a player can read a tag: ' + readable.length + ' of ' + rows.length + ' sightings visible with text 8 px or taller (' + [...new Set(readable.map((r) => r.where))].join(', ') + ')');
  ok(seen.length > 0, 'name tags drawn: ' + seen.length + ' sightings');
  ok(seen.every((r) => r.tagTop >= r.feet - Math.max(8, r.charH * 0.12) && r.tagTop <= r.feet + 14), 'every tag sits at the feet, not above the head (tag top vs feet within the character\'s shadow line)');
  ok(seen.every((r) => Math.abs(r.tagCx - r.charCx) <= Math.max(6, r.tagW * 0.25)), 'every tag is centred under its character');
  ok(seen.every((r) => r.last), 'every tag is drawn last in its room (over the furniture)');
  ok(seen.every((r) => /rgb\(255, 255, 255\)|#fff/i.test(r.fill)), 'the text is white');
  ok(seen.every((r) => r.textW <= r.rectW), 'the whole name fits inside its pill, the 24-letter one too');
  ok(seen.some((r) => r.name === 'Sy') && seen.some((r) => /^Maximilian/.test(r.name)), 'both names shown');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
