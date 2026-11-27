// Cal 11-26 idea 8 (29zz_v191.js): a private photo gallery in the profile. On the SANDBOX web build (its database stands in for
// Firestore): a passed photo is kept, the profile shows it, it opens with its date and time, and Delete removes it.
//   QB_TARGET=web QB_SANDBOX=1 python3 tools/build.py; PORT=<server of quest-board/> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/gal191.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist-web/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV191 && window.QBGAME, null, { timeout: 90000 }); await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(8); S.tutDone = 1; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); });
  const k = await V(async () => { const c = document.createElement('canvas'); c.width = 3000; c.height = 2000; const x = c.getContext('2d'); x.fillStyle = '#3a7'; x.fillRect(0, 0, 3000, 2000); x.fillStyle = '#fff'; x.fillRect(800, 500, 1400, 1000);
    const f = await new Promise((o) => c.toBlob((bb) => o(new File([bb], 'p.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.9)); const r = { file: f, kind: 'quest', what: 'Wipe the counters' };
    await window.__qbV191.keep(r); window.__qbV191.reset(); const ix = await window.__qbV191.index(); return { n: ix.items.length, it: ix.items[0] && { id: ix.items[0].id, what: ix.items[0].what, th: ix.items[0].th.length }, rid: r.v91 }; });
  ok(k.n === 1 && k.it.what === 'Wipe the counters' && k.it.th > 500 && k.rid === k.it.id, 'a passed photo is kept in the private gallery (read back from the database) ' + JSON.stringify(k));
  await V(() => document.querySelector('.strip .avbtn').click()); await p.waitForTimeout(1500);
  const sec = await V(() => { const s = document.querySelector('#layer #v91sec'); return s ? { txt: s.innerText.replace(/\s+/g, ' ').slice(0, 80), th: s.querySelectorAll('.v91th').length } : null; });
  ok(sec && sec.th === 1 && /Your photos/i.test(sec.txt) && /Only you/i.test(sec.txt), 'the profile has "Your photos", private, with the photo ' + JSON.stringify(sec));
  await V(() => document.querySelector('#v91sec').scrollIntoView()); await p.screenshot({ path: OUT + '/gal191_profile.png' });
  await V(() => document.querySelector('#layer .v91th').click()); await p.waitForTimeout(1200);
  const vw = await V(() => { const v = document.querySelector('#layer .v91view'); const im = v && v.querySelector('.v91big img'); return v ? { txt: v.innerText.replace(/\s+/g, ' '), big: im ? im.naturalWidth : 0 } : null; });
  ok(vw && /Wipe the counters/.test(vw.txt) && /private/.test(vw.txt) && vw.big >= 800, 'a tap opens it full size with its date and time under it ' + JSON.stringify(vw));
  await p.screenshot({ path: OUT + '/gal191_view.png' });
  const del = await V(async () => { const b = document.querySelector('#layer .v91view [data-v91a="del"]'); b.click(); const t1 = b.textContent; b.click(); await new Promise((o) => setTimeout(o, 500)); window.__qbV191.reset(); const ix = await window.__qbV191.index(); return { ask: t1, n: ix.items.length, grid: document.querySelectorAll('#layer .v91th').length }; });
  ok(/for good/.test(del.ask) && del.n === 0 && del.grid === 0, 'Delete asks once more, then removes it ' + JSON.stringify(del));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
