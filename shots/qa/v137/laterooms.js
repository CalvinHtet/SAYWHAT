// Cal 2026-11-23: "Do a QA check on the later rooms and make sure all the furniture assets are placed correctly and characters are not
// phasing through furniture." Every room from the Restaurant on (lib.js ORDER), every upgrade bought:
//   static: the room on its own (no people) at 1400x1100, lib.js audit (pieces outside the room, overlapping footprints, drawn over the
//           wrong piece), one big picture each for the eye;
//   live:   the real room window inside its building for SECS: every guest and staff member every 150 ms against the room's furniture
//           footprints (obsRaw, shrunk 0.12); anyone inside one who is not seated and not on a lift is walking through furniture.
//           Two pictures of the live room, plus one when someone is first caught inside a footprint.
//   BASE=<server> OUT=<folder> [SECS=45] [ROOMS=restaurant,garden] node laterooms.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit, ORDER } = require('./lib.js');
const FULL = process.env.FULL === '1'; async function fullView(p) { if (!FULL) return; await p.evaluate(() => { const s = document.querySelector('#rbigw svg'); if (!s) return; const b = s.getBBox(); s.setAttribute('viewBox', [b.x - 10, b.y - 10, b.width + 20, b.height + 20].join(' ')); }).catch(() => {}); }

const OUT = process.env.OUT || 'qa-out/laterooms', SECS = +(process.env.SECS || 45); fs.mkdirSync(OUT, { recursive: true }); const PEOPLE = +(process.env.PEOPLE || 4), MAXSHOTS = +(process.env.SHOTS || 3), ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null; // SHOTS=n pictures at most; ONLY=regex on the flag key picks which flags take one
(async () => {
  const rooms = process.env.ROOMS ? process.env.ROOMS.split(',') : ORDER.slice(ORDER.indexOf('restaurant'));
  const summary = [], allErrs = [];
  for (const t of rooms) {
    const { b, p, errs } = await open({ width: 1200, height: 1100, owned: 'all' }); /* a fresh page per room: the street view resets */
    const i = await p.evaluate((t) => window.__qb.x().S.base.slots.findIndex((s) => s.t === t), t); if (i < 0) { console.log(t, 'no slot'); continue; }
    // static (STATIC=0 skips it)
    let a = { items: [], outside: [], depth: [], overlap: [] };
    if (process.env.STATIC !== '0') { await openRoom(p, i, 1400, 1100); a = await audit(p, i); const host = await p.$('#qahost'); if (host) await host.screenshot({ path: path.join(OUT, `${t}_static.png`) }); }
    // live
    await p.evaluate(() => { const x = window.__qb.x(); x.S.areaOn = null; x.S.visit = null; x.render(); document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="board"]').click(); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(2500);
    const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length); let opened = 0;
    for (let k = 0; k < nB && !opened; k++) {
      await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(2500);
      opened = await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); window.__qb.roomModal(i); return document.querySelector('#rbigw svg') ? 1 : 0; }, i); await p.waitForTimeout(3500);
      const cnt = await p.evaluate((i) => Object.values(window.__qbLoft().A).filter((a) => a.pv && a.pvslot === i).length, i);
      if (!cnt) { opened = 0; await p.evaluate(() => { document.querySelectorAll('.modal').forEach((m) => m.remove()); const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1200); }
    }
    const obs = opened ? await p.evaluate((i) => { const q = window.__qbLoft(); return q.roomCtx(window.__qb.x().S.base.slots[i], 90 + i).obsRaw; }, i) : [];
    const pend0 = opened ? await p.evaluate((i) => +(window.__qb.x().S.base.slots[i].pend || 0), i) : 0; /* the room's earnings bank, to compare service speed */
    const seen = {}, inside = {}, who = new Set(); const t0 = Date.now(); let nSamp = 0, caught = 0, shots = 0, peopleShot = 0;
    while (opened && Date.now() - t0 < SECS * 1000) { await p.waitForTimeout(150); nSamp++;
      const st = await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay').forEach((e) => e.remove()); return Object.values(window.__qbLoft().A).filter((a) => a.pv && a.pvslot === i && a.alpha > .5).map((a) => ({ id: a.id, r: a.role, m: a.mode, ac: a.act || '', x: +a.x, y: +a.y, l: a.st && (a.st.lbl || a.st.tag || a.st.kind), lift: !!(a.st && a.st.lift), s: !!a.sit })); }, i);
      st.forEach((a) => { who.add(a.id); const kk = `${a.r}:${a.m}`; seen[kk] = (seen[kk] || 0) + 1; const h = obs.find((o) => a.x > o[0] + .12 && a.x < o[2] - .12 && a.y > o[1] + .12 && a.y < o[3] - .12);
        if (h && !a.s && !a.lift) { const key = `${a.r}:${a.m}${a.ac ? ':' + a.ac : ''}${a.l ? '@' + a.l : ''} in [${h.slice(0, 4).map((v) => (+v).toFixed(1))}]`; inside[key] = (inside[key] || 0) + 1; if (!ONLY || ONLY.test(key)) caught++; } });
      if (caught && shots < MAXSHOTS) { shots++; caught = 0; await fullView(p); const el = await p.$('#rbigw'); if (el) await el.screenshot({ path: path.join(OUT, `${t}_inside_${shots}.png`) }).catch(() => {}); }
      /* the first moment at least PEOPLE guests/staff are at their spots (mode do): a picture of the room in use */
      if (!peopleShot && st.filter((a) => a.m === 'do').length >= PEOPLE) { peopleShot = 1; await fullView(p); const el = await p.$('#rbigw'); if (el) await el.screenshot({ path: path.join(OUT, `${t}_people.png`) }).catch(() => {}); }
      if ((Date.now() - t0) > SECS * 500 && !fs.existsSync(path.join(OUT, `${t}_live.png`))) { await fullView(p); const el = await p.$('#rbigw'); if (el) await el.screenshot({ path: path.join(OUT, `${t}_live.png`) }).catch(() => {}); }
    }
    const pend1 = opened ? await p.evaluate((i) => +(window.__qb.x().S.base.slots[i].pend || 0), i) : 0;
    const row = { t, banked: Math.round(pend1 - pend0), pieces: a.items.length, outside: a.outside, depth: a.depth, overlaps: a.overlap.length, live: opened ? 'yes' : 'NOT OPENED', people: who.size, samples: nSamp, obstacles: obs.length, seen, inside };
    summary.push(row);
    console.log(`${t}: ${a.items.length} pieces; outside ${a.outside.length ? a.outside.join(' ') : 'none'}; drawn over the wrong piece ${a.depth.length ? a.depth.join(' | ') : 'none'}; ${a.overlap.length} footprint overlaps`);
    console.log(`   live ${row.live}: ${who.size} people, ${nSamp} samples, banked ${row.banked}, ${obs.length} footprints; IN A FOOTPRINT ${Object.keys(inside).length ? JSON.stringify(inside) : 'none'}`);
    allErrs.push(...errs.map((e) => t + ': ' + e)); await b.close();
  }
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
  console.log('page errors', allErrs.length, JSON.stringify(allErrs.slice(0, 3)));
})().catch((e) => { console.error(e); process.exit(1); });
