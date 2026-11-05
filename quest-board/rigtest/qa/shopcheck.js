// LEAD's Shop changes (e012535, 3a6fdd5), a cheap check at 1280 wide and at 390 x 844:
//  the mirror stays in view while the rack scrolls; Try on two pieces, the basket, its Checkout window, Buy all;
//  each tab's colours and whether its text stays readable (contrast); View then Checkout on an upgrade and an interface
//  item, then Equip or Equipped · Remove; nothing wider than the screen; the drop window and its banner art.
//   OUT=<folder> node shopcheck.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const fails = [], oks = [];
  const t = (c, m) => (c ? oks : fails).push(m);
  for (const [W, H, mobile] of [[1280, 900, false], [390, 844, true]]) {
    const { b, p, errs } = await open({ width: W, height: H, mobile });
    const tag = W + 'px';
    const r = await p.evaluate(async () => {
      const x = window.__qb.x(), S = x.S, out = { tabs: [] }, wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
      const clear = () => document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove());
      const click = (sel) => { const e = document.querySelector(sel); if (e) e.click(); return !!e; };
      const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]); };
      const contrast = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
      const solidRgb = () => { const d = document.createElement('i'); d.style.color = getComputedStyle(document.body).getPropertyValue('--shopsolid').trim() || '#fff'; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
      const bgOf = (el) => { while (el && !el.classList.contains('qshop')) { const c = getComputedStyle(el).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; el = el.parentElement; } return solidRgb(); };
      clear(); click('.nav button[data-v="shop"]'); await wait(600); clear(); const keepClear = setInterval(() => document.querySelectorAll('.modal.sty, #layer .modal:has(.sty)').forEach((e) => e.remove()), 100);
      // every tab: colours, readable text, no sideways scroll
      const tabs = [...document.querySelectorAll('.qs-tab[data-v]')].map((e) => e.dataset.v);
      for (const v of tabs) {
        clear(); click('.qs-tab[data-v="' + v + '"]'); await wait(400);
        const solid = getComputedStyle(document.body).getPropertyValue('--shopsolid').trim();
        let worst = 99, worstTxt = '';
        document.querySelectorAll('.qshop h3, .qshop p, .qshop small, .qshop .qs-card h4, .qshop .qs-tab, .qshop .note').forEach((e) => {
          const q = e.getBoundingClientRect(); if (!q.width || !q.height || !e.textContent.trim() || e.closest('.qs-banner,.qs-hero,.modal')) return;
          const c = contrast(getComputedStyle(e).color, bgOf(e)); if (c < worst) { worst = c; worstTxt = e.textContent.trim().slice(0, 40); }
        });
        out.tabs.push({ v, solid, worst: +worst.toFixed(2), worstTxt, wide: document.documentElement.scrollWidth > innerWidth + 1 });
      }
      // a brand tab: the mirror stays in view while the rack scrolls
      clear(); const brand = tabs.find((v) => !/basics|wardrobe|vault|upgrades|interface/.test(v)); click('.qs-tab[data-v="' + brand + '"]'); await wait(400);
      window.scrollTo(0, 1600); await wait(300);
      const mr = (document.querySelector('.qs-mirror') || document.body).getBoundingClientRect();
      out.mirror = { top: Math.round(mr.top), bottom: Math.round(mr.bottom), vh: innerHeight, scrolled: Math.round(scrollY) };
      window.scrollTo(0, 0);
      // try on two pieces from different slots
      const tries = []; const seen = {};
      document.querySelectorAll('[data-act="qstry"]').forEach((bt) => { const it = x.SHOP.find((s) => s[0] === bt.dataset.id); if (it && !seen[it[1]] && !S.owned[it[0]] && tries.length < 2) { seen[it[1]] = 1; tries.push(it); } });
      const c0 = S.coins, b0 = Object.keys(S.badges || {}).length;
      tries.forEach((it) => click('[data-act="qstry"][data-id="' + it[0] + '"]'));
      await wait(300);
      out.tried = tries.map((it) => it[2]);
      out.worn = (document.querySelector('.qs-worn small') || {}).textContent || '';
      out.bask = (document.querySelector('.qs-bask small') || {}).textContent || '';
      out.charged = c0 - S.coins; out.ownedEarly = tries.some((it) => S.owned[it[0]]);
      click('[data-act="qscheck"]'); await wait(200);
      const cf = document.querySelector('.qs-confirm'); out.confirm = cf ? cf.innerText.replace(/\s+/g, ' ').slice(0, 160) : null;
      click('.qs-confirm [data-act="qsconfirm"]'); await wait(300);
      const cost = tries.reduce((a, it) => a + it[3], 0);
      out.bought = { paid: c0 - S.coins + (Object.keys(S.badges || {}).length - b0) * 250, cost, owned: tries.every((it) => S.owned[it[0]]), worn: tries.every((it) => S.eq[it[1]] === it[0]) };
      // View, Checkout, then Equip on an upgrade and an interface item
      out.view = [];
      for (const v of ['upgrades', 'interface']) {
        clear(); click('.qs-tab[data-v="' + v + '"]'); await wait(400);
        const vb = [...document.querySelectorAll('[data-act="qsview"]')].find((e) => { const it = x.SHOP.find((s) => s[0] === e.dataset.id); return it && !S.owned[it[0]] && S.coins >= it[3]; });
        if (!vb) { out.view.push({ v, err: 'no View button' }); continue; }
        const id = vb.dataset.id; vb.click(); await wait(300);
        const mv = document.querySelector('.qs-view'); const hasCo = !!(mv && mv.querySelector('[data-act="qsvbuy"]'));
        if (mv) mv.querySelector('[data-act="qsvbuy"]') && mv.querySelector('[data-act="qsvbuy"]').click();
        await wait(400); clear();
        const nm = (x.SHOP.find((s) => s[0] === id) || [])[2] || id; const cardEl = [...document.querySelectorAll('.qshop .item, .qshop .qs-card')].find((e) => e.textContent.includes(nm)); const card = cardEl ? cardEl.innerText.replace(/\s+/g, ' ') : '';
        out.view.push({ v, id, window: !!mv, checkout: hasCo, owned: !!S.owned[id], after: card.slice(0, 80) });
      }
      // the drop window: skip a week (the Shop's Testing row), wait for it
      clear(); click('.nav button[data-v="shop"]'); await wait(300);
      click('[data-act="simwk"]'); await wait(2500);
      clearInterval(keepClear); const ds = document.querySelector('.dropsplash') || [...document.querySelectorAll('#layer .modal')].find((m) => /now on sale/i.test(m.innerText)); out.drop = ds ? { text: ds.innerText.replace(/\s+/g, ' ').slice(0, 120), img: [...ds.querySelectorAll('img')].map((i) => (i.naturalWidth || 0) + 'w ' + (i.src || '').slice(0, 40)) } : null;
      return out;
    });
    await p.screenshot({ path: path.join(OUT, `shop_drop_${W}.png`) });
    r.tabs.forEach((x) => { t(!x.wide, `${tag} ${x.v}: nothing wider than the screen`); t(x.worst >= 3, `${tag} ${x.v} (bg ${x.solid}): lowest text contrast ${x.worst}:1 "${x.worstTxt}"`); });
    const m = r.mirror; t(m.top >= 0 && m.bottom <= m.vh, `${tag} mirror in view after scrolling ${m.scrolled}px (top ${m.top}, bottom ${m.bottom}, screen ${m.vh})`);
    t(r.tried.length === 2 && r.charged === 0 && !r.ownedEarly, `${tag} try on ${r.tried.join(' + ')}: nothing charged or owned before checkout`);
    t(r.tried.every((n) => r.worn.includes(n)), `${tag} the mirror lists what is tried on ("${r.worn.slice(0, 80)}")`);
    t(/2 pieces/.test(r.bask), `${tag} basket says "${r.bask}"`);
    t(!!r.confirm, `${tag} checkout window: ${r.confirm}`);
    t(r.bought.paid === r.bought.cost && r.bought.owned && r.bought.worn, `${tag} buy all: paid ${r.bought.paid} of ${r.bought.cost}, owned ${r.bought.owned}, worn ${r.bought.worn}`);
    r.view.forEach((v) => t(!v.err && v.window && v.checkout && v.owned && (v.v === 'upgrades' || /Equip/.test(v.after)), `${tag} ${v.v}: View, Checkout, then "${v.after || v.err}"`));
    t(r.drop && r.drop.img.some((s) => /^\d{3,}w/.test(s)), `${tag} drop window ${r.drop ? '"' + r.drop.text + '", images ' + r.drop.img.join(', ') : 'did not appear'}`);
    t(!errs.length, `${tag} no page errors ${errs.slice(0, 2).join(' | ')}`);
    await b.close();
  }
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
})();
