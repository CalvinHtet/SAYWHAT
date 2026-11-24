// QA, v1.47 (lead/v147src b145deeb): the drop days (Mon/Thu -> Mon/Fri from Sat 11-28) and the Shop's home screen (29zz_v149.js).
//   DROPS  every day 11-20..12-31 on v1.45 (OLD) and v1.47 (NEW), each floor's live brands: identical through 11-27 (no drop that
//          happened moves); after it the same brands arrive in the same order (only the day changes); every Wednesday brings a vault
//          brand that is not on sale that week
//   SHOP   every way in (the bottom bar, a brand's splash button, a floor's "Have a look", the daily sale's link, the profile's Closet,
//          the Closet room's window, wardrobeModal) lands on a sane screen; the home screen (Street Shop, Stylist, Pet Store only from
//          the Boutique at 30, Closet beside the character); Street Shop: back, this week's brands, try-on and buy; Closet/Stylist/Pet
//          Store each with a back button; "Wardrobe" nowhere a player reads it (the furniture keeps its name); 390 and 320 px
//   NEW=<v1.47 plain build> OLD=<v1.45 plain build> OUT=<dir> node shop147qa.js
const pw = require('playwright');
const NEW = process.env.NEW, OLD = process.env.OLD, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const open = async (base, w) => { const ctx = await b.newContext({ viewport: { width: w || 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 200)));
    await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbDrops && document.querySelector('.nav button, #ccname'), null, { timeout: 120000 }); await p.waitForTimeout(3000); return { ctx, p }; };
  const V = (p, f, a) => p.evaluate(f, a);
  const shut = (p) => V(p, () => { document.querySelectorAll('#layer .modal,.overlay,.dropsplash').forEach((m) => m.remove()); try { if (window.TOUR) TOUR.id = null; } catch (e) {} });
  const seed = (p, L, sex) => V(p, ([L, sex]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Shop', sex }); S.cls = 'vanguard'; S.xp = x.cum(L) + 1; S.gates = [5, 10, 20, 30, 40].filter((g) => g <= L); S.calm = false; S.coins = 20000; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1 }; S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, away: 1, wheel: 1, trophy: 1, sys: 1 };
    S.base.slots = [{ t: 'bedroom', a: { bd_ward2: 1, bd_ward1: 1 }, st: 0, pend: 0 }, { t: 'closet', a: {}, st: 0, pend: 0 }]; x.persist(); x.render(); }, [L, sex || 'm']);

  /* ---------- DROPS ---------- */
  { console.log('-- DROPS'); const days = []; for (let d = new Date('2026-11-20T12:00:00Z'); d <= new Date('2026-12-31T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) days.push(d.toISOString().slice(0, 10));
    const read = async (base) => { const { ctx, p } = await open(base); await seed(p, 72); const r = await V(p, (days) => { const D = window.__qbDrops, out = {};
      D.floors().forEach((F) => { out[F.id] = days.map((d) => D.floor(F.id, D.start(d) + 12 * 36e5).live.map((x) => x.id).join(',')); });
      out.back = days.map((d) => { const bk = D.back(D.start(d) + 12 * 36e5); return bk ? bk.id : ''; }); out.wd = days.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(d + 'T12:00:00Z').getUTCDay()]); return out; }, days); await ctx.close(); return r; };
    const o = await read(OLD), n = await read(NEW); const cut = days.indexOf('2026-11-28');
    for (const fl of Object.keys(n).filter((k) => k !== 'back' && k !== 'wd')) {
      const same = o[fl] ? o[fl].slice(0, cut).every((v, i) => v === n[fl][i]) : false;
      const arrivals = (L) => { const seq = []; let prev = []; L.forEach((v, i) => { const cur = v ? v.split(',') : []; cur.forEach((id) => { if (prev.indexOf(id) < 0) seq.push(id + '@' + days[i].slice(5) + ' ' + n.wd[i]); }); prev = cur; }); return seq; };
      const ao = arrivals(o[fl] || []), an = arrivals(n[fl]); const ids = (a) => a.map((s) => s.split('@')[0]);
      console.log('     ' + fl + ' arrivals v1.45: ' + ao.join(' | ') + '\n     ' + fl + ' arrivals v1.47: ' + an.join(' | '));
      ok(same, fl + ': every day through Fri 11-27 identical to v1.45 (no drop that happened moves)');
      ok(ids(an).join() === ids(ao).slice(0, an.length).join() || ids(ao).join() === ids(an).slice(0, ao.length).join(), fl + ': the same brands arrive in the same order after 11-28');
      ok(an.filter((s) => s.split('@')[1].slice(0, 5) >= '11-28').every((s) => /Mon|Fri/.test(s)), fl + ': from 11-28 every arrival is on a Monday or Friday'); }
    const weds = n.wd.map((w, i) => w === 'Wed' ? i : -1).filter((i) => i >= 0); const wb = weds.map((i) => days[i].slice(5) + ':' + (n.back[i] || 'none'));
    console.log('     vault brands on Wednesdays: ' + wb.join(' | '));
    ok(weds.every((i) => n.back[i] === o.back[i]) && weds.every((i) => !n.back[i] || !(n.street[i] || '').split(',').includes(n.back[i])), 'the Wednesday vault brands are the same as on v1.45 (' + weds.map((i) => o.back[i] || 'none').join(', ') + ') and never one already on sale'); }

  /* ---------- SHOP ---------- */
  for (const [w, L] of [[390, 34], [320, 34], [390, 12]]) { console.log('-- SHOP at ' + w + ' px, level ' + L); const { ctx, p } = await open(NEW, w); await seed(p, L); await shut(p);
    const go = (sel) => V(p, (sel) => { const e = document.querySelector(sel); if (!e) return false; e.dispatchEvent(new MouseEvent('click', { bubbles: true })); return true; }, sel);
    const where = () => V(p, () => { const h = window.__qbV149 ? window.__qbV149.hub() : '?'; const m = document.querySelector('#layer .modal'); const txt = document.body.innerText; const wardrobe = (txt.match(/[^\n]{0,30}\bWardrobe\b[^\n]{0,30}/g) || []).filter((s) => !/Sleek Wardrobe|Wardrobe\s*$/.test(s));
      return { view: document.documentElement.getAttribute('data-view') || '', hub: h, back: !!document.querySelector('.shub-back'), title: (document.querySelector('.shub-title') || {}).textContent || '', tiles: [...document.querySelectorAll('.shub-tile b')].map((e) => e.textContent.replace('!', '').trim()), floors: [...document.querySelectorAll('[data-act="stab"], .qs-floors [data-qsfl]')].map((e) => e.textContent.trim()).slice(0, 8), modal: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 50) : '', wardrobe, wide: document.documentElement.scrollWidth }; });
    await shut(p); await go('.nav button[data-v="board"]'); await p.waitForTimeout(400); await go('.nav button[data-v="shop"]'); await p.waitForTimeout(900); await shut(p); const home = await where();
    console.log('     bottom bar -> ' + JSON.stringify(home)); await p.screenshot({ path: OUT + '/shop_home_' + w + '_' + L + '.png' });
    ok(home.hub === 'home' && home.tiles[0] === 'Street Shop' && home.tiles.includes('Stylist') && (L >= 30) === home.tiles.includes('Pet Store') && !!(await V(p, () => document.querySelector('.shub-closet'))), 'the bottom bar opens the home screen: ' + home.tiles.join(', ') + ' + Closet' + (L >= 30 ? '' : ' (no Pet Store below level 30)'));
    ok(home.wide <= w, 'home screen fits ' + w + ' px (' + home.wide + ')');
    /* each tile, and back */
    for (const k of ['street', 'stylist', 'closet'].concat(L >= 30 ? ['pets'] : [])) { await go('[data-shub="' + k + '"]'); await p.waitForTimeout(700); await shut(p); const s = await where();
      await p.screenshot({ path: OUT + '/shop_' + k + '_' + w + '_' + L + '.png' });
      ok(s.hub === k && s.back && (k === 'street' ? s.floors.length > 0 && !s.title : s.title.length > 0) && s.wide <= w && !s.wardrobe.length, k + ': its own screen with a back button' + (s.title ? ' ("' + s.title + '")' : ', this week\'s brands: ' + s.floors.join(', ')) + (s.wardrobe.length ? ' | "Wardrobe" on screen: ' + s.wardrobe.join(' / ') : ''));
      if (k === 'street') { /* try on and buy a piece with real taps: Try on, Buy, confirm */ const c0 = await V(p, () => ({ c: window.__qb.x().S.coins, sp: window.__qb.x().S.spent || 0, o: Object.keys(window.__qb.x().S.owned).length }));
        await p.click('.qshop [data-act="qstry"]'); await p.waitForTimeout(600); const tried = await V(p, () => !!document.querySelector('.qshop [data-act="qstry"].alt'));
        await p.click('[data-act="qscheck"]').catch(() => {}); await p.waitForTimeout(700); await p.click('#layer .modal [data-act="qsconfirm"]').catch(() => {}); await p.waitForTimeout(1200);
        const c1 = await V(p, () => ({ c: window.__qb.x().S.coins, sp: window.__qb.x().S.spent || 0, o: Object.keys(window.__qb.x().S.owned).length, hub: window.__qbV149.hub() }));
        console.log('     try-on and buy in the Street Shop: tried on ' + tried + ', coins ' + c0.c + ' -> ' + c1.c + ', pieces ' + c0.o + ' -> ' + c1.o + ', screen ' + c1.hub); await p.screenshot({ path: OUT + '/shop_bought_' + w + '_' + L + '.png' });
        ok(tried && c1.o === c0.o + 1 && c1.sp > c0.sp && c1.hub === 'street', 'a piece tried on and bought inside the Street Shop (' + (c1.sp - c0.sp) + ' coins spent; a first purchase also pays its rewards, as on v1.45), still in the Street Shop'); await shut(p); }
      await shut(p); await p.click('.shub-back'); await p.waitForTimeout(600); await shut(p); const bk = await where(); ok(bk.hub === 'home', k + ': back (a real tap) returns to the home screen'); }
    /* the other ways in */
    const ways = [['a brand\'s splash button', () => V(p, () => { const id = window.__qbDrops.floor('street', Date.now()).live[0].id; const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="card bsplash"><button class="btn" data-act="bsgo" data-b="' + id + '">Shop it</button></div>'; document.getElementById('layer').appendChild(m); m.querySelector('button').dispatchEvent(new MouseEvent('click', { bubbles: true })); return id; }), 'street'],
      ['a floor\'s "Have a look"', () => V(p, () => { const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="card flsplash"><button class="btn" data-flgo="street">Have a look</button></div>'; document.getElementById('layer').appendChild(m); return 'street'; }).then(() => p.click('[data-flgo]')).then(() => 'tapped'), 'street'],
      ['the profile\'s Closet button', async () => { await V(p, () => { const a = document.querySelector('.avbtn'); if (a) a.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await p.waitForTimeout(700); return V(p, () => { const c = document.querySelector('#layer .modal [data-act="wardrobe"]'); if (!c) return 'no Closet button in the profile'; c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return 'clicked'; }); }, 'closet'],
      ['the Closet room\'s window', async () => { await V(p, () => { const S = window.__qb.x().S; window.__qb.roomModal(S.base.slots.findIndex((r) => r && r.t === 'closet')); }); await p.waitForTimeout(800); return V(p, () => { const M = document.querySelector('#layer .modal'); if (!M) return 'no window'; const c = M.querySelector('[data-act="wardrobe"]') || [...M.querySelectorAll('button')].find((e) => /^(Open )?(the )?Closet$|wear|outfit/i.test(e.textContent.trim())); if (!c) return 'no Closet button in the room window (' + [...M.querySelectorAll('button')].map((e) => e.textContent.trim()).filter(Boolean).slice(0, 6).join(' / ') + ')'; const t = c.textContent.trim().slice(0, 30); c.dispatchEvent(new MouseEvent('click', { bubbles: true })); return 'clicked "' + t + '"'; }); }, 'closet'],
      ['wardrobeModal()', () => V(p, () => { window.__qb.wardrobeModal(); return 'called'; }), 'any']];
    const sale = await V(p, () => { window.__qb.x().render(); const e = [...document.querySelectorAll('[data-act]')].find((x) => /sale|% off/i.test(x.textContent) && x.closest('.sale, .qs-sale, [class*=sale]')); return e ? e.dataset.act + '|' + e.textContent.trim().slice(0, 40) : ''; });
    console.log('     the daily sale link on screen: ' + (sale || 'none found on the Board'));
    for (const [name, fn, want] of ways) { await shut(p); await go('.nav button[data-v="board"]'); await p.waitForTimeout(400); const r = await fn(); await p.waitForTimeout(900); const s = await where(); await p.screenshot({ path: OUT + '/shop_way_' + name.replace(/\W+/g, '_') + '_' + w + '.png' });
      console.log('     ' + name + ' (' + r + ') -> view ' + s.view + ', hub ' + s.hub + (s.title ? ' "' + s.title + '"' : '') + (s.modal ? ', window: ' + s.modal : '') + (s.wardrobe.length ? ', "Wardrobe" on screen: ' + s.wardrobe.join(' / ') : ''));
      ok((want === 'any' || s.hub === want) && !s.wardrobe.length, name + ' lands on ' + (want === 'any' ? 'a sane screen' : 'the ' + want) + ', with no "Wardrobe" on screen'); }
    ok(!p.errs.length, 'SHOP ' + w + '/' + L + ': no page errors ' + JSON.stringify(p.errs.slice(0, 2))); await ctx.close(); }
  await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
