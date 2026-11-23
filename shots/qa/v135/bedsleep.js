// QA: the player asleep in the Bedroom's bed, at each bed stage (starting bed bd4_bed0 after c192b451, Memory Foam bd_bed1, LED bd_bed2):
// the lying overlay (lfslp) must sit in the bed. Loft scene at 2x, the player put on the bed spot lying down, a crop around the bed.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch(); const out = [];
  for (const stage of ['bed0', 'bed1', 'bed2']) { const ctx = await b.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 120)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(800);
    await p.evaluate((stage) => { const x = window.__qb.x(), S = x.S, A = x.ADDONS; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(20); S.gates = Array.from({ length: 200 }, (_, i) => i); S.areaOn = { board: 1, shop: 1, hideout: 1 }; S.pet = null;
      const a = Object.fromEntries(A.bedroom.map((u) => u[0]).filter((k) => !/^bd_bed[12]$/.test(k) && !/^bd_dbed|^bd_pluto|^bd_chop/.test(k)).map((k) => [k, 1])); if (stage === 'bed1') a.bd_bed1 = 1; if (stage === 'bed2') { a.bd_bed1 = 1; a.bd_bed2 = 1; }
      S.base.slots = [{ t: 'bedroom', a, st: 0, pend: 0 }]; x.render(); }, stage);
    await p.evaluate(() => { document.querySelectorAll('.dropsplash,.overlay,.modal').forEach((e) => e.remove()); document.querySelector('.nav button[data-v="hideout"]').click(); }); await p.waitForTimeout(1500);
    await p.evaluate(() => { const g = document.querySelectorAll('[data-act="bldgo"]')[0]; if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(2000);
    let info = null;
    for (let i = 0; i < 10; i++) { info = await p.evaluate(() => { document.querySelectorAll('.modal,.overlay,.dropsplash,[class*=splash]').forEach((m) => m.remove()); const a = window.LFA && window.LFA.me; if (!a) return { err: 'no me' }; const C = window.lfC(a); const sp = (C.st || []).find((s) => s.tag === 'bed');
        if (!sp) return { err: 'no bed spot', tags: (C.st || []).map((s) => s.tag || s.kind).join(',') }; a.st = sp; a.x = +sp.x; a.y = +sp.y; a.mode = 'do'; a.act = 'lie'; a.t = 60;
        const sl = document.querySelector('[id^="lfslp"]'), bd = document.querySelector('[id^="lfbed"]'); const r = (e) => { if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.x), Math.round(q.y), Math.round(q.width), Math.round(q.height)]; };
        return { spot: [+sp.x, +sp.y], slp: r(sl), slpVis: sl ? getComputedStyle(sl).display + '/' + (sl.getAttribute('visibility') || sl.style.visibility || '') + '/' + (sl.style.opacity || '') : null, bed: r(bd), bedVis: bd ? (bd.style.opacity || bd.getAttribute('opacity') || '') : null, me: r(document.getElementById('lfa-me')) }; }); await p.waitForTimeout(500); }
    console.log(stage, JSON.stringify(info), 'errors', errs.length);
    const box = (info && info.bed) || (info && info.slp); if (box) { const f = `${OUT}_${stage}.png`; await p.screenshot({ path: f, clip: { x: Math.max(0, box[0] - 60), y: Math.max(0, box[1] - 60), width: Math.min(560, box[2] + 120), height: Math.min(460, box[3] + 120) } }); out.push(f); }
    await ctx.close(); }
  console.log(out.join(' ')); await b.close(); })();
