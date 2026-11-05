// node guests.js room[,room] -> $OUT/g_<room>_<pass>.png : a guest frozen on every station, pass by pass
// VIS=1 fills a visitors-only room (the Game Room) with ordinary guests, to test its spots before any visitor exists
const OUT = process.env.OUT || 'shots'; require('fs').mkdirSync(OUT, { recursive: true });
const { open } = require('./drv.js');
(async () => {
  const rooms = process.argv[2].split(',');
  const { b, p, errs } = await open({ width: 1400, height: 1400 });
  await p.evaluate((vis) => { Object.values((window.__qbLoft && window.__qbLoft().defs) || window.ROOMDEF || {}).forEach((d) => { if (vis && d.visitors) { d.visitors = null; d.guests = 99; } if (d.guests !== 0) d.guests = 99; }); }, !!process.env.VIS);
  await p.evaluate(() => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); const t = [...document.querySelectorAll('button')].find((e) => /the loft/i.test(e.textContent)); if (t) t.click(); });
  await p.waitForTimeout(1500);
  for (const room of rooms) {
    const i = await p.evaluate((room) => window.__order.indexOf(room), room);
    await p.evaluate((i) => { document.querySelectorAll('.dropsplash,.modal,.overlay').forEach((e) => e.remove()); window.__qb.roomModal(i); }, i);
    await p.waitForTimeout(3000);
    const info = await p.evaluate((i) => {
      const q = window.__qbLoft();
      const ag = Object.values(q.A).filter((a) => a.pv && a.pvslot === i && a.role !== 'dog' && a.role !== 'me');
      if (!ag.length) return { n: 0 };
      const C = q.C(ag[0]);
      // Guests only ever use guest spots and staff only staff spots, as in the game.
      const gs = ag.filter((a) => a.role === 'guest'), cs = ag.filter((a) => a.role !== 'guest');
      const cst = C.st.filter((s) => s.cust), wst = C.st.filter((s) => s.kind === 'work');
      const passes = Math.max(Math.ceil(cst.length / Math.max(1, gs.length)), Math.ceil(wst.length / Math.max(1, cs.length)), 1);
      const plan = [];
      for (let ps = 0; ps < passes; ps++) { const m = []; gs.forEach((a, k) => m.push([a.id, cst[ps * gs.length + k]])); cs.forEach((a, k) => m.push([a.id, wst[ps * cs.length + k]])); plan.push(m); }
      const st = C.st.filter((s) => s.kind !== 'door' && s.kind !== 'wander');
      window.__gst = { ag: ag.map((a) => a.id), st, plan };
      return { n: ag.length, passes: plan.length, guests: gs.length, staff: cs.length, cust: cst.length, work: wst.length, st: st.length, kinds: [...new Set(st.map((s) => s.kind + ':' + (s.tag || '')))].slice(0, 30) };
    }, i);
    console.log(room, JSON.stringify(info));
    if (!info.n) continue;
    const passes = info.passes;
    for (let ps = 0; ps < passes; ps++) {
      await p.evaluate((ps) => {
        const q = window.__qbLoft(), G = window.__gst;
        G.plan[ps].forEach(([id, s]) => {
          const a = q.A[id];
          if (!a) return;
          if (!s) { a.alpha = 0; a.x = -50; a.y = -50; a.mode = 'do'; a.t = 1e6; q.draw(a, true); return; }
          a.alpha = 1; a.fade = 0; a.wp = []; a.x = s.x; a.y = s.y; a.leaving = 0;
          s.by = a.id; q.arrive(a, s); if (s.cust) { a.sat = 1; a.act = s.wact || (s.lift ? 'sit' : s.lie ? 'lie' : 'look'); } a.t = 1e6; a.emo = null; a.emot = 0; q.draw(a, true);
        });
      }, ps);
      // Wait until every placed guest has a rendered frame (the rig renders slowly on a software GPU).
      let ready = 0;
      for (let w = 0; w < 45 && !ready; w++) {
        await p.waitForTimeout(1000);
        ready = await p.evaluate(() => { const q = window.__qbLoft(); let ok = 1; window.__gst.ag.forEach((id) => { const a = q.A[id]; if (!a || !a.alpha) return; a.t = 1e6; q.draw(a, true); if (!a._k) ok = 0; /* lfCalImg clears _k while the frame for this pose is still rendering */ }); return ok; });
      }
      if (!ready) { const miss = await p.evaluate(() => { const q = window.__qbLoft(); return window.__gst.ag.filter((id) => { const a = q.A[id]; return a && a.alpha && !a._k; }).map((id) => id + ':' + (q.A[id].st && (q.A[id].st.tag || q.A[id].st.kind))); }); console.log(room, 'pass', ps, 'not rendered after 45s:', miss.join(' ')); }
      await p.waitForTimeout(400);
      const el = await p.$('#rbigw'); const bb = await el.boundingBox();
      await p.screenshot({ path: `${OUT}/g_${room}_${ps}.png`, clip: bb, timeout: 60000 }).catch((e) => console.log('shot fail', e.message.slice(0, 60)));
    }
    console.log(room, 'passes', passes);
  }
  console.log('errs', errs.filter((e) => !/TUNNEL/.test(e)).slice(0, 4));
  await b.close();
})();
