// A favourite back every Wednesday (LEAD's 5688ce3): two separate pages step the clock every 6 h for 120 days (today's weekly mode,
// then the launch schedule on): the brand back must be the same on both pages, change only at Wednesday midnight Pacific, never repeat
// two Wednesdays running while two or more are retired, and show in the Shop as its own tab.   BASE=<server> node wedback.js
const { chromium } = require('playwright');
const load = async (b) => { const p = await (await b.newContext({ viewport: { width: 440, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbDrops, null, { timeout: 90000 }); await p.waitForTimeout(1000); return { p, errs }; };
const walk = (p, on) => p.evaluate((on) => { const D = window.__qbDrops; D.cfg.on = on; const keep = window.__qbShift || 0, real = Date.now() - keep; const t0 = on ? new Date(D.cfg.launch + 'T09:00:00Z').getTime() : real; const out = [];
  for (let h = 0; h < 120 * 24; h += 6) { window.__qbShift = t0 + h * 36e5 - real; const s = D.state(); const pt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).format(new Date(Date.now()));
    out.push([pt, s.back ? s.back.id : '-', s.live.length]); }
  window.__qbShift = keep; D.cfg.on = false; return out; }, on);
(async () => {
  const b = await chromium.launch(); const A = await load(b), B = await load(b);
  for (const on of [false, true]) {
    const a = await walk(A.p, on), c = await walk(B.p, on);
    const same = JSON.stringify(a.map((x) => x[1])) === JSON.stringify(c.map((x) => x[1]));
    let changes = [], wrong = 0; for (let k = 1; k < a.length; k++) if (a[k][1] !== a[k - 1][1]) { changes.push(a[k][0] + ' ' + a[k][1]); if (!/^Wed/.test(a[k][0]) || !/, 0[0-5]$/.test(a[k][0])) wrong++; }
    const weeks = changes.map((c) => c.split(' ').pop()); let rep = 0; for (let k = 1; k < weeks.length; k++) if (weeks[k] === weeks[k - 1]) rep++;
    console.log(`${on ? 'launch schedule' : 'weekly mode'}: pages agree ${same}; ${changes.length} changes, ${wrong} not at Wednesday 00-05h PT; back to back repeats ${rep}`);
    console.log('  ' + changes.slice(0, 12).join(' | '));
  }
  await A.p.evaluate(() => { const x = window.__qb.x(); const real = Date.now() - (window.__qbShift || 0); window.__qbShift = 21 * 864e5; x.S.created = true; x.S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); x.S.xp = x.cum(12); x.S.gates = [5, 10]; x.render(); /* the Shop opens with levels */ document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); (document.querySelector('.nav button[data-v="shop"]') || [...document.querySelectorAll('.nav button, nav button')].find((e) => /shop/i.test(e.textContent + (e.dataset.v || ''))) || { click() {} }).click(); });
  await A.p.waitForTimeout(1500);
  const shop = await A.p.evaluate(() => { const t = document.querySelector('#app').innerText; const tabs = [...document.querySelectorAll('#app button, #app [data-b], #app .tab')].map((e) => e.innerText.trim()).filter((x) => x && x.length < 24); return { all: tabs.slice(0, 16).join(' | '), head: t.slice(0, 300).replace(/\s+/g, ' '), tabs: (t.match(/[^\n]*↺[^\n]*/) || ['no ↺ tab'])[0].slice(0, 160), header: (t.match(/[^\n]*(every Monday|every Wednesday)[^\n]*/) || ['no header'])[0].slice(0, 160), vault: /vault/i.test(t) }; });
  console.log('Shop at +3 weeks:', JSON.stringify(shop));
  console.log('page errors', A.errs.length + B.errs.length, [...A.errs, ...B.errs].slice(0, 2));
  await b.close();
})();
