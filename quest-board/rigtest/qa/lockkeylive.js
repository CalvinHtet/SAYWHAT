// ROOMS's 05500d3, Lock and Key: every stage of buying it (each upgrade bought in the menu's order), the four moved pieces on their own, then the
// real room window left to run, fully bought and part bought: who stands where, and anyone in a footprint.   OUT=<folder> [MODE=static|live] [SECS=70] node lockkeylive.js
const fs = require('fs'), path = require('path');
const { open, openRoom, audit } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true }); const MODE = process.env.MODE || 'static', SECS = +(process.env.SECS || 70);
const line = (lab, a) => console.log(`${lab}: ${a.items.length} pieces` + (a.outside.length ? ' OUTSIDE ' + a.outside.join(' ') : '') + (a.overlap.length ? ' overlaps ' + a.overlap.map((o) => o.slice(0, 2).join('+')).join(' ') : '') + (a.depth.length ? ' depth ' + a.depth.slice(0, 6).join('; ') : '') + (a.stations.length ? ' spots ' + [...new Set(a.stations)].join('; ') : ''));
(async () => {
  const { b, p, errs } = await open({ width: 1200, height: 1100, owned: 'all' });
  const i = await p.evaluate(() => window.__qb.x().S.base.slots.findIndex((s) => s.t === 'skybar'));
  const list = await p.evaluate(() => window.__qb.x().ADDONS.skybar.filter((u) => !(u[3] && (u[3].retired || u[3].opens)) ).map((u) => u[0]));
  const raw = await p.evaluate(() => window.__qb.x().ADDONS.skybar.map((u) => [u[0], u[1], u[3] && u[3].retired ? 'retired' : '', u[3] && u[3].opens ? 'opens ' + u[3].opens : '', Array.isArray(u[9]) ? '' : (u[9] && u[9].retired ? 'retired' : '')].filter(Boolean).join(':')));
  console.log('upgrades: ' + raw.join(' | '));
  const setA = (ids) => p.evaluate(({ i, ids }) => { const x = window.__qb.x(), r = x.S.base.slots[i]; r.a = Object.fromEntries(ids.map((k) => [k, 1])); x.persist(); }, { i, ids });
  if (MODE === 'static') {
    for (let n = 0; n <= list.length; n++) { await setA(list.slice(0, n)); await openRoom(p, i, 620, 500); const a = await audit(p, i); line(`stage ${String(n).padStart(2)} (${n ? list[n - 1] : 'bare'})`, a); await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `lk_stage_${String(n).padStart(2, '0')}.png`) }); }
    for (const k of ['sb_bottles', 'sb_oyster', 'sb_sofa', 'sb_side']) { if (!list.includes(k)) { console.log('no such upgrade ' + k); continue; } await setA([k]); await openRoom(p, i, 620, 500); line('alone ' + k, await audit(p, i)); await (await p.$('#qahost')).screenshot({ path: path.join(OUT, `lk_alone_${k}.png`) }); }
    await setA(list); await openRoom(p, i, 1400, 1100); await (await p.$('#qahost')).screenshot({ path: path.join(OUT, 'lk_full_big.png') });
  } else {
    const partIds = list.filter((k) => /sb_bar|sb_bottles|sb_stool|sb_tender|sb_sofa|sb_side/.test(k));
    const sparse = list.filter((k) => /sb_bar|sb_tender|sb_oyster/.test(k));
    for (const [lab, ids] of [['full', list], ['part', partIds], ['sparse', sparse]].filter((q) => !process.env.ONLY || process.env.ONLY === q[0])) {
      await setA(ids);
      await p.evaluate(() => { const x = window.__qb.x(); x.S.areaOn = null; x.S.visit = null; x.render(); document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="board"]').click(); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(3000);
      const nB = await p.evaluate(() => document.querySelectorAll('[data-act="bldgo"]').length); let opened = 0; console.log(lab, 'buildings', nB);
      for (let k = 0; k < nB && !opened; k++) { await p.evaluate((k) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); const g = document.querySelectorAll('[data-act="bldgo"]')[k]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }, k); await p.waitForTimeout(3000);
        opened = await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.overlay,#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(i); return document.querySelector('#rbigw svg') ? 1 : 0; }, i); await p.waitForTimeout(3500);
        const cnt = await p.evaluate((i) => Object.values(window.__qbLoft().A).filter((a) => a.pv && a.pvslot === i).length, i); if (!cnt) { opened = 0; await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find((e) => /Street/.test(e.textContent)); if (bt) bt.click(); }); await p.waitForTimeout(1200); } }
      const obs = await p.evaluate((i) => { const q = window.__qbLoft(); return q.roomCtx(window.__qb.x().S.base.slots[i], 90 + i).obsRaw; }, i);
      console.log(lab, 'obstacles', obs.length, 'opened', opened);
      const seen = {}, inside = {}, t0 = Date.now(); let shots = 0, nSamp = 0;
      while (Date.now() - t0 < SECS * 1000) { await p.waitForTimeout(150); nSamp++;
        const st = await p.evaluate((i) => Object.values(window.__qbLoft().A).filter((a) => a.pv && a.pvslot === i && a.alpha > .5).map((a) => ({ id: a.id, r: a.role, m: a.mode, ac: a.act || '', x: +a.x, y: +a.y, l: a.st && (a.st.lbl || a.st.tag || a.st.kind), lift: !!(a.st && a.st.lift), s: !!a.sit })), i);
        st.forEach((a) => { const k = `${a.r}:${a.m}:${a.ac}@${a.l || ''}`; seen[k] = (seen[k] || 0) + 1; const h = obs.find((o) => a.x > o[0] + .12 && a.x < o[2] - .12 && a.y > o[1] + .12 && a.y < o[3] - .12); if (h && !a.s && !a.lift) { const kk = `${a.r}:${a.m}:${a.ac} in [${h.slice(0, 4).map((v) => (+v).toFixed(1))}]`; inside[kk] = (inside[kk] || 0) + 1; } });
        if ((Date.now() - t0) > (shots + 1) * SECS * 300 && shots < 3) { shots++; const el = await p.$('#rbigw'); if (el) await el.screenshot({ path: path.join(OUT, `lk_live_${lab}_${shots}.png`) }).catch(() => {}); }
      }
      console.log(lab, 'samples', nSamp, 'seen', JSON.stringify(seen).slice(0, 1400)); console.log(lab, 'obstacle boxes', JSON.stringify(obs.map((o) => o.slice(0, 4).map((v) => +(+v).toFixed(2)))).slice(0, 600)); console.log(lab, 'IN A FOOTPRINT', JSON.stringify(inside).slice(0, 800));
    }
  }
  console.log('page errors', errs.length, errs.slice(0, 3)); await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
