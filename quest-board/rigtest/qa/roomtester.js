// The Test pill's room tester (LEAD's 0b21495): from a fresh level-5 player, through window.__qbRooms (the pill's own functions):
// Open each room in story order, Everything, Empty; per room: upgrades owned against ADDONS, extra keys, retired pieces owned, rooms an
// owned upgrade "opens" that don't exist, and <image> tags with no picture in its window. Then Next story step from the start to the end.
//   BASE=<server> node roomtester.js
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 440, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(600);
  await p.click('[data-act="ccdone"]'); await p.waitForTimeout(6000);
  const rooms = await p.evaluate(() => Object.values(window.__qbRooms.list()).flat());
  console.log(rooms.length, 'rooms in the tester');
  for (const t of rooms) {
    const r = await p.evaluate(async (t) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; document.querySelectorAll('#layer .modal').forEach((e) => e.remove());
      window.__qbRooms.open(t, 1); window.__qbRooms.all(t, 1); await w(300); const i = S.base.slots.findIndex((s) => s && s.t === t); const r = S.base.slots[i];
      const A = x.ADDONS[t] || [], ids = A.map((u) => u[0]); const keys = Object.keys(r.a || {}); const extra = keys.filter((k) => !ids.includes(k));
      const retired = A.filter((u) => u[3] && u[3].retired && r.a[u[0]]).map((u) => u[0]); const opensMissing = A.filter((u) => u[3] && u[3].opens && r.a[u[0]] && !S.base.slots.some((s) => s && s.t === u[3].opens)).map((u) => u[0] + '->' + u[3].opens);
      document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); await w(1500);
      const imgs = [...document.querySelectorAll('.rmodal image')]; const empty = imgs.filter((im) => !(im.getAttribute('href') || im.getAttribute('xlink:href'))).map((im) => (im.closest('[data-u],[data-k],[id]') || {}).id || (im.parentNode.getAttribute && (im.parentNode.getAttribute('data-u') || im.parentNode.getAttribute('class'))) || '?');
      window.__qbRooms.all(t, 0); await w(200); const after = Object.keys(S.base.slots[i].a || {});
      return { t, n: A.length, own: keys.length, extra, retired, opensMissing, images: imgs.length, empty, emptyAfter: after }; }, t);
    const flag = r.extra.length || r.retired.length || r.opensMissing.length || r.empty.length || r.emptyAfter.length;
    console.log(`${flag ? '!!' : 'ok'} ${r.t.padEnd(11)} ${r.own}/${r.n} owned` + (r.extra.length ? `  extra ${r.extra}` : '') + (r.retired.length ? `  retired owned ${r.retired.length}: ${r.retired.slice(0, 6)}` : '') + (r.opensMissing.length ? `  opens a missing room ${r.opensMissing}` : '') + `  ${r.images} images` + (r.empty.length ? `, ${r.empty.length} empty: ${r.empty.slice(0, 6)}` : '') + (r.emptyAfter.length ? `  Empty leaves ${r.emptyAfter}` : ''));
  }
  // Next story step from a fresh save to the end
  console.log('Next story step, fresh player:');
  const p2 = await (await b.newContext({ viewport: { width: 440, height: 900 } })).newPage(); p2.on('pageerror', (e) => errs.push('p2 ' + e.message.slice(0, 200)));
  await p2.goto(BASE + '/dist/index.html'); await p2.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p2.fill('#ccname', 'Cal'); await p2.click('[data-act="ccnext"]'); await p2.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p2.waitForTimeout(600);
  await p2.click('[data-act="ccdone"]'); await p2.waitForTimeout(6000);
  for (let k = 0; k < 26; k++) {
    const s = await p2.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const S = window.__qb.x().S; const before = S.base.slots.map((s) => s && s.t).join(',');
      window.__qbRooms.next(); await w(1200);
      // play the scene through: tap its next/done buttons
      for (let j = 0; j < 30; j++) { const bt = document.querySelector('#layer [data-act="stynext"],#layer [data-act="styyes"]'); if (!bt) break; bt.click(); await w(250); }
      const modals = [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText.replace(/\s+/g, ' ').slice(0, 70));
      const acc = document.querySelector('#layer [data-act="styopen"],#layer [data-act="stybuild"]');
      document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); await w(300);
      return { slots: S.base.slots.map((s) => s && s.t).join(','), before, modals, acc: acc ? acc.textContent.slice(0, 40) : null, pop: (document.querySelector('.pop,.toast') || {}).innerText }; });
    console.log(`  ${k + 1}: ${s.before === s.slots ? 'no new room' : 'rooms ' + s.slots}  | window: ${JSON.stringify(s.modals).slice(0, 160)}${s.acc ? ' | button ' + s.acc : ''}`);
    if (/no steps left/.test(JSON.stringify(s))) break;
  }
  console.log('page errors', errs.length, errs.slice(0, 4));
  await b.close();
})();
