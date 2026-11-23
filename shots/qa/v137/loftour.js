// QA: the Loft tab's tour on a new character (bc37e855): it should ring The Loft on the street ("Tap it to see the rooms inside"),
// wait for the tap, then ring the rooms ("Your rooms"). Real taps (mouse clicks at the element), phone size. Pictures of each step.
const pw = require('playwright'); const base = process.env.BASE, OUT = process.env.OUT;
(async () => { const b = await pw.chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(base + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && QBLoft.data, null, { timeout: 90000 }); await p.waitForTimeout(1000);
  await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); x.persist(); x.render(); });
  await p.waitForTimeout(1500);
  const bub = () => p.evaluate(() => { const t = document.querySelector('.tour-bub'); const r = document.querySelector('.tour-ring'); const rr = r ? r.getBoundingClientRect() : null; const lo = document.querySelector('[data-act="bldgo"][data-v="0"]'); const lr = lo ? lo.getBoundingClientRect() : null;
    return { text: t ? t.innerText.replace(/\s+/g, ' ').slice(0, 120) : null, ring: rr ? [Math.round(rr.x), Math.round(rr.y), Math.round(rr.width), Math.round(rr.height)] : null, loft: lr ? [Math.round(lr.x), Math.round(lr.y), Math.round(lr.width), Math.round(lr.height)] : null, view: document.querySelector('#lfwrap') ? 'inside' : 'street', modal: !!document.querySelector('#layer .modal'), hidden: (document.getElementById('qbtour') || {}).style ? document.getElementById('qbtour').style.visibility : null }; });
  // let the tours run as a new player sees them: answer each step; the Loft's tour taps its targets
  let n = 0, bumped = 0; for (let k = 0; k < 60 && n < 8; k++) { await p.waitForTimeout(1300); const s = await bub();
    if (!s.text && k > 6 && !bumped) { bumped = 1; const ao = await p.evaluate(() => { const x = window.__qb.x(); x.S.xp = x.cum(3); x.persist(); x.render(); return JSON.stringify(x.S.areaOn || null); }); console.log('XP to level 3; areas', ao); continue; }
    if (!s.text) { await p.evaluate(() => { const m = document.querySelector('#layer .modal'); if (m) { const c = m.querySelector('[data-ib="claim"]') || m.querySelector('[data-act="mclose"]') || m.querySelector('.btn'); if (c) c.click(); } }); continue; }
    const tag = s.text.slice(0, 40); const isLoft = /Loft|rooms/i.test(s.text); if (isLoft) { n++; console.log('loft step', n, JSON.stringify(s)); await p.screenshot({ path: `${OUT}_${n}.png` }); }
    if (/You unlocked The Loft/.test(s.text)) { await p.click('.nav button[data-v="hideout"]'); continue; }
    if (/Tap it to see the rooms/.test(s.text) && s.loft) { await p.mouse.click(s.loft[0] + s.loft[2] / 2, s.loft[1] + s.loft[3] / 2); continue; }
    const btn = await p.evaluate(() => { const v = (e) => e && e.offsetParent && e.getBoundingClientRect().width > 0; const L = [...document.querySelectorAll('.tour-btns button')].filter(v); const b = L[L.length - 1] || [...document.querySelectorAll('.tour-x')].find(v); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, b.textContent.trim()]; }); if (btn) await p.mouse.click(btn[0], btn[1]); else { const r = s.ring; if (r) await p.mouse.click(r[0] + r[2] / 2, r[1] + r[3] / 2); }
    if (!isLoft) console.log('other tour:', tag); }
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 2))); await b.close(); })();
