// Shop sweep: on each body, buy every piece that fits through the real Shop buttons (brand by brand, skipping weeks ahead
// with the Shop's own week offset so every brand is live once), check the coins, that it is owned and worn, that the
// mirror lists it, then take it off again. Then every brand's whole outfit at once, and the Wardrobe tab.
//   OUT=<folder> node shop.js [m|f]
// Writes <OUT>/shop_<body>.png (every piece alone in the mirror, labelled), <OUT>/outfits_<body>.png, <OUT>/shop.json,
// and prints what failed.
const fs = require('fs');
const path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out';
fs.mkdirSync(OUT, { recursive: true });
const BODIES = process.argv[2] ? [process.argv[2]] : ['m', 'f'];
const BIG = 300; // mirror height QA renders at, so clipping is visible

const mirrorShot = async (p, file) => {
  // the Shop's own mirror, plus a bigger copy of the same look in the same renderer
  await p.evaluate((BIG) => {
    document.querySelectorAll('#qabig').forEach((e) => e.remove());
    const m = document.querySelector('.qs-glass img.calp'); if (!m) return;
    const d = document.createElement('div'); d.id = 'qabig';
    d.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;width:240px;height:' + (BIG + 20) + 'px;background:#efe9df;display:flex;align-items:flex-end;justify-content:center';
    const im = m.cloneNode(); im.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; im.setAttribute('data-h', BIG); im.removeAttribute('style'); im.removeAttribute('data-hy');
    d.appendChild(im); document.body.appendChild(d);
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
  }, BIG);
  const ok = await p.waitForFunction(() => { const i = document.querySelector('#qabig img'), m = document.querySelector('.qs-glass img.calp'); return i && m && !/^data:image\/gif/.test(i.src) && i.complete && i.naturalWidth > 2 && !/^data:image\/gif/.test(m.src); }, null, { timeout: 20000 }).then(() => true, () => false);
  if (ok) await (await p.$('#qabig')).screenshot({ path: file });
  return ok;
};

(async () => {
  const res = {};
  for (const body of BODIES) {
    const { b, p, errs } = await open({ width: 1280, height: 1000, body });
    const fails = [], cells = [];
    // which week offset makes each brand live
    const weeks = await p.evaluate(() => {
      const S = window.__qb.x().S, map = {};
      for (let w = 0; w < 60; w++) {
        S.simWeeks = w; window.__qb.x().render();
        const bt = document.querySelector('.nav button[data-v="shop"]'); if (bt) bt.click();
        document.querySelectorAll('.qs-tab[data-v]').forEach((t) => { const v = t.getAttribute('data-v'); if (!(v in map)) map[v] = w; });
      }
      S.simWeeks = 0; return map;
    });
    const brands = await p.evaluate(() => [...new Set(window.__qb.x().SHOP.filter((x) => x[6] && (x[6].gar || x[6].basic)).map((x) => x[6].b))]);
    const never = brands.filter((x) => !(x in weeks));
    if (never.length) fails.push('brands never live in 60 weeks: ' + never.join(', '));
    // the test page does not check the creator look: the Shop calls a basic piece "Wearing" when it matches it
    for (const br of brands.filter((x) => x in weeks)) {
      await p.evaluate(({ br, w }) => {
        const S = window.__qb.x().S; S.simWeeks = w; window.__qb.x().render();
        const bt = document.querySelector('.nav button[data-v="shop"]'); if (bt) bt.click();
        const t = document.querySelector('.qs-tab[data-v="' + br + '"]'); if (t) t.click();
      }, { br, w: weeks[br] });
      await p.waitForTimeout(400);
      const items = await p.evaluate((br) => {
        const S = window.__qb.x().S, sx = S.char.sex;
        return window.__qb.x().SHOP.filter((x) => x[6] && (x[6].gar || x[6].basic) && x[6].b === br).map((x) => ({ id: x[0], slot: x[1], name: x[2], cost: x[3], fits: x[6].fo ? sx === 'f' : x[6].mo ? sx === 'm' : true, card: !!document.querySelector('[data-card="' + x[0] + '"]') }));
      }, br);
      for (const it of items) {
        if (!it.card) { fails.push(br + ' ' + it.id + ' has no card in its tab'); continue; }
        if (!it.fits) {
          const deny = await p.evaluate((id) => !!document.querySelector('[data-card="' + id + '"] [data-act="qsdeny"]'), it.id);
          if (!deny) fails.push(it.id + ' does not fit this body but has no "not your size" button');
          continue;
        }
        const r = await p.evaluate((it) => {
          const x = window.__qb.x(), S = x.S, c0 = S.coins;
          const card = () => document.querySelector('[data-card="' + it.id + '"]');
          const bt = card() && card().querySelector('button');
          const state = bt ? (bt.dataset.act || (bt.disabled ? 'disabled:' + bt.textContent.trim() : '')) : 'none';
          if (state === 'buy') bt.click();
          else if (state === 'equip') bt.click();
          const worn = (document.querySelector('.qs-worn small') || {}).textContent || '';
          return { state, paid: c0 - S.coins, owned: !!S.owned[it.id], eq: S.eq[it.slot] === it.id, worn, after: card() ? card().querySelector('button').textContent.trim() : 'no card' };
        }, it);
        const label = it.name + ' (' + it.id + ')';
        if (r.state === 'buy' && r.paid !== it.cost) fails.push(label + ': paid ' + r.paid + ', price ' + it.cost);
        if (!r.owned) fails.push(label + ': not owned after buying (' + r.state + ')');
        const original = /^disabled:Wearing/.test(r.state);
        if (!r.eq && !original) fails.push(label + ': not worn after buying (' + r.state + ', button now "' + r.after + '")');
        if (!original && !r.worn.includes(it.name)) fails.push(label + ': the mirror does not list it ("' + r.worn.slice(0, 80) + '")');
        const file = path.join(OUT, `shop_${body}_${it.id}.png`);
        const shot = await mirrorShot(p, file);
        if (!shot) fails.push(label + ': the mirror never drew the look');
        cells.push({ file: shot ? file : null, label: it.name, sub: it.id + (original ? ' (creator pick)' : '') });
        // take it off again so the next piece is seen alone
        await p.evaluate((it) => { const bt = document.querySelector('[data-card="' + it.id + '"] [data-act="unequip"]'); if (bt) bt.click(); }, it);
        const off = await p.evaluate((it) => !window.__qb.x().S.eq[it.slot] || window.__qb.x().S.eq[it.slot] !== it.id, it);
        if (!off && !original) fails.push(label + ': Remove did not take it off');
      }
    }
    // Wardrobe: every owned piece that fits
    const wr = await p.evaluate(() => {
      const x = window.__qb.x(), S = x.S; S.simWeeks = 0; x.render();
      const t = document.querySelector('.qs-tab[data-v="wardrobe"]'); if (t) t.click();
      const sx = S.char.sex, own = x.SHOP.filter((it) => it[6] && (it[6].gar || it[6].basic) && S.owned[it[0]] && (it[6].fo ? sx === 'f' : it[6].mo ? sx === 'm' : true)).map((it) => it[0]);
      const cards = [...document.querySelectorAll('.qs-rack [data-card]')].map((e) => e.getAttribute('data-card'));
      return { own: own.length, cards: cards.length, missing: own.filter((k) => !cards.includes(k)), extra: cards.filter((k) => !own.includes(k)) };
    });
    if (wr.missing.length || wr.extra.length) fails.push('Wardrobe: ' + wr.cards + ' cards for ' + wr.own + ' owned; missing ' + wr.missing.join(',') + '; extra ' + wr.extra.join(','));
    // each brand's whole outfit, one piece per slot, in the mirror
    const outfits = [];
    for (const br of brands) {
      const fit = await p.evaluate((br) => {
        const x = window.__qb.x(), S = x.S, sx = S.char.sex, used = {};
        Object.keys(S.eq).forEach((k) => delete S.eq[k]);
        x.SHOP.filter((it) => it[6] && it[6].gar && it[6].b === br && (it[6].fo ? sx === 'f' : it[6].mo ? sx === 'm' : true) && /^a_(hat|acc|top|pants|shoes)$/.test(it[1]))
          .forEach((it) => { if (!used[it[1]] && S.owned[it[0]]) { used[it[1]] = it[2]; S.eq[it[1]] = it[0]; } });
        x.render(); const t = document.querySelector('.qs-tab[data-v="wardrobe"]'); if (t) t.click();
        return Object.values(used);
      }, br);
      if (!fit.length) continue;
      const file = path.join(OUT, `outfit_${body}_${br}.png`);
      const shot = await mirrorShot(p, file);
      outfits.push({ file: shot ? file : null, label: br, sub: fit.join(' · ') });
    }
    const sheet = async (list, name, title) => {
      const html = list.map((c) => `<figure>${c.file ? `<img src="data:image/png;base64,${fs.readFileSync(c.file).toString('base64')}">` : '<div class=miss>no picture</div>'}<figcaption><b>${c.label}</b><br>${c.sub}</figcaption></figure>`).join('');
      const sp = await b.newPage({ viewport: { width: 1700, height: 800 } });
      await sp.setContent(`<style>body{margin:0;background:#120e20;font:12px system-ui;color:#eee}h1{font-size:18px;margin:10px}div.g{display:grid;grid-template-columns:repeat(8,200px);gap:8px;padding:8px}figure{margin:0}img{width:200px;display:block}.miss{width:200px;height:270px;background:#400}figcaption{padding:2px}</style><h1>${title}</h1><div class=g>${html}</div>`);
      await sp.screenshot({ path: path.join(OUT, name), fullPage: true }); await sp.close();
    };
    await sheet(cells, `shop_${body}.png`, `Shop sweep, ${body === 'm' ? 'male' : 'female'} body: every piece bought through the Shop and worn alone (mirror look, drawn ${BIG}px tall)`);
    await sheet(outfits, `outfits_${body}.png`, `Each brand's outfit worn at once, ${body === 'm' ? 'male' : 'female'} body`);
    res[body] = { fails, errs: errs.slice(), pieces: cells.length, wardrobe: wr };
    console.log(`\n## ${body}: ${cells.length} pieces bought and worn, ${outfits.length} outfits`);
    fails.forEach((f) => console.log('  ' + f));
    errs.forEach((e) => console.log('  ' + e));
    await b.close();
  }
  fs.writeFileSync(path.join(OUT, 'shop.json'), JSON.stringify(res, null, 1));
})();
