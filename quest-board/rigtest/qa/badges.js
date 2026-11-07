// Brand badges on the Shop (LEAD's 8be03dc: logo_<id>.webp now from the art_ui pack, loose file as fallback): for every brand, step the
// clock until it is live (and once for the Wednesday return tab), open its Shop tab, and check its badge image: loaded (naturalWidth > 0)
// and its source (pack data/blob or the loose art/ file). Also counts loose logo_ requests the page made.   BASE=<server> node badges.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1280, height: 1000 });
  const reqs = []; p.on('request', (r) => { if (/logo_/.test(r.url())) reqs.push(r.url().replace(/^.*\/(art\/)?/, '')); });
  const res = await p.evaluate(async () => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
    const out = {}; const keep = window.__qbShift || 0;
    for (let wk = 0; wk < 60; wk++) { S.simWeeks = wk; x.render(); const bt = document.querySelector('.nav button[data-v="shop"]'); if (bt) bt.click(); await w(150);
      const tabs = [...document.querySelectorAll('.qs-tab[data-v]')];
      for (const t of tabs) { const id = t.getAttribute('data-v'); if (out[id]) continue; t.click(); await w(250);
        const imgs = [...document.querySelectorAll('#app img, #app [style*="logo"]')].filter((im) => /logo|qs-badge|brand/i.test((im.getAttribute('src') || '') + ' ' + (im.className || '') + ' ' + (im.alt || '') + ' ' + (im.getAttribute('style') || '')));
        const want = (window.QBART && window.QBART['logo_' + id + '.webp']) || null; const im = [...document.querySelectorAll('#app img, #layer img')].find((e) => want && e.getAttribute('src') === want) || null; const bg = !im && want && [...document.querySelectorAll('#app *')].some((e) => (e.getAttribute('style') || '').includes(want.slice(0, 200))); const h = (s) => { let x = 0; for (let i = 0; i < s.length; i += 97) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x.toString(16); };
        out[id] = !want ? { ok: null, tab: t.innerText.trim().slice(0, 20), src: 'no logo_' + id + ' in the pack' } : im ? { ok: im.complete && im.naturalWidth > 0, src: 'pack logo_' + id + ' #' + h(want) + ' ' + im.naturalWidth + 'px', tab: t.innerText.trim().slice(0, 20) } : bg ? { ok: true, tab: t.innerText.trim().slice(0, 20), src: 'pack logo_' + id + ' as a background' } : { ok: false, tab: t.innerText.trim().slice(0, 20), src: 'logo_' + id + ' is in the pack but not on its tab' }; } }
    S.simWeeks = 0; return out; });
  Object.entries(res).forEach(([id, r]) => console.log(`${(r.ok === true ? 'ok  ' : r.ok === false ? 'FAIL' : 'none')} ${id.padEnd(10)} tab "${r.tab}" badge ${r.src || '(no logo image on this tab)'}`));
  console.log('loose logo_ files requested:', reqs.length, reqs.slice(0, 5));
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
