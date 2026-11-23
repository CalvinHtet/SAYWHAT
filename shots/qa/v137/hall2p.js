// QA: two players on the v1.37 web build with LEAD's stand-in Firebase (rigtest/lead/mockfirebase.js; pages of one context share its
// store), every non-local request blocked. Ann waves at Bo from the Town Hall's Players tab; Bo's game pays 3 coins once and says so.
// Ann posts in Chat Room 3; Bo opens Room 3 and reads it. Real clicks.   PORT=<serving quest-board/> MOCK=<mockfirebase.js> node hall2p.js
const { chromium } = require('playwright'); const fs = require('fs');
const PORT = process.env.PORT, URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html', MOCK = fs.readFileSync(process.env.MOCK, 'utf8'), OUT = process.env.OUT;
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
  const errs = [];
  const open = async (uid) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(uid + ': ' + e.message.slice(0, 160))); await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid); await p.goto(URL); return p; };
  const create = async (p, name) => { await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 }); await p.fill('#ccname', name); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(4000); };
  const shut = (p) => p.evaluate(() => { document.querySelectorAll('#layer .modal, #layer .qb-held, .tour-bub, .tour-ring, #qbtour').forEach((m) => m.remove()); try { TOUR.id = null; } catch (e) {} });
  const coins = (p) => p.evaluate(() => +((document.querySelector('.coinpill') || {}).innerText || '').replace(/\D/g, '') || 0);
  const tap = async (p, sel) => { const e = await p.$(sel); if (!e) return false; await e.scrollIntoViewIfNeeded().catch(() => {}); const r = await e.boundingBox(); if (!r) return false; await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); return true; };
  let ann = await open('ann1'); await create(ann, 'Ann'); let bo = await open('bo2'); await create(bo, 'Bo'); const keep = await ctx.newPage(); await keep.goto('http://127.0.0.1:' + PORT + '/dist-web/version.json'); await ann.close(); await bo.close();
  // the Town Hall opens at level 2: raise both saves in the stand-in store (XP only), then reload so each publishes its worlds doc
  const lift = await keep.evaluate(() => Object.keys(localStorage).filter((k) => /^__mfb:data\/users\/(ann1|bo2)\/state$/.test(k)).map((k) => { const raw = JSON.parse(localStorage.getItem(k)); const d = typeof raw.j === 'string' ? JSON.parse(raw.j) : raw; d.xp = 120; d.areaOn = null; const out = typeof raw.j === 'string' ? { j: JSON.stringify(d), t: Date.now() } : d; localStorage.setItem(k, JSON.stringify(out)); return k.split('/')[2] + ':' + d.xp; }));
  console.log('raised', JSON.stringify(lift));
  ann = await open('ann1'); bo = await open('bo2'); await ann.waitForTimeout(9000); await bo.waitForTimeout(2000);
  for (const p of [ann, bo]) { await shut(p); await tap(p, '.nav button[data-v="hall"]'); await p.waitForTimeout(1500); await shut(p); }
  console.log('worlds docs', await ann.evaluate(() => Object.keys(localStorage).filter((k) => /__mfb:worlds\//.test(k)).length));
  // Ann: Players tab, Bo's row, Wave
  await tap(ann, '[data-act="htab"][data-t="style"]'); await ann.waitForTimeout(1500); await shut(ann);
  const rows = await ann.evaluate(() => [...document.querySelectorAll('[data-act="fshview"]')].map((e) => (e.getAttribute('aria-label') || e.innerText || '').replace(/\s+/g, ' ').slice(0, 30)));
  console.log('Ann sees players', JSON.stringify(rows), '| tabs', JSON.stringify(await ann.evaluate(() => [...document.querySelectorAll('[data-act="htab"]')].map((e) => e.dataset.t)))); await ann.screenshot({ path: OUT + '_players.png' });
  const boId = 'bo2'; const opened = await tap(ann, `[data-act="fshview"][data-u="${boId}"]`); await ann.waitForTimeout(1200);
  const card = await ann.evaluate(() => [...document.querySelectorAll('#layer .modal [data-act="sqgo"]')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
  console.log('Bo\'s card opened', opened, 'buttons', JSON.stringify(card));
  const a0 = await coins(ann), b0 = await coins(bo);
  await tap(ann, '#layer .modal [data-act="sqgo"][data-k="wave"]'); await ann.waitForTimeout(2500);
  console.log('Ann coins', a0, '->', await coins(ann), '| pings docs', await ann.evaluate(() => Object.keys(localStorage).filter((k) => /__mfb:pings\//.test(k)).length));
  // Bo's game scans the pings on its own timer; wait up to 90 s for the pay
  await bo.reload(); await bo.waitForTimeout(6000);
  let b1 = b0, pops = []; for (let i = 0; i < 12 && b1 === b0; i++) { await bo.waitForTimeout(3000); b1 = await coins(bo); const t = await bo.evaluate(() => [...document.querySelectorAll('.pop,.toast,[class*=pop]')].map((e) => e.innerText).join(' | ').slice(0, 120)); if (t) pops.push(t); }
  console.log('Bo coins', b0, '->', b1, '| messages', JSON.stringify([...new Set(pops)].slice(0, 3)));
  // a second wave inside 2 h pays nobody
  await shut(ann); await tap(ann, `[data-act="fshview"][data-u="${boId}"]`); await ann.waitForTimeout(1200); await tap(ann, '#layer .modal [data-act="sqgo"][data-k="five"]'); await ann.waitForTimeout(3000);
  await bo.reload(); await bo.waitForTimeout(9000); let b2 = await coins(bo);
  console.log('after a high five inside 2 h: Ann', await coins(ann), 'Bo', b2);
  // Chat Room 3
  await shut(ann); await tap(ann, '[data-act="htab"][data-t="chat"]'); await ann.waitForTimeout(1500); await shut(ann);
  const roomsA = await ann.evaluate(() => [...document.querySelectorAll('[data-act="tchroom"]')].map((e) => e.getAttribute('aria-label') || e.innerText));
  await tap(ann, '[data-act="tchroom"][data-r="3"]'); await ann.waitForTimeout(800); await ann.fill('#tchin', 'QA hello from room 3'); await tap(ann, '[data-act="tchsend"]'); await ann.waitForTimeout(2500);
  await shut(bo); await tap(bo, '.nav button[data-v="hall"]'); await bo.waitForTimeout(1500); await shut(bo); await tap(bo, '[data-act="htab"][data-t="chat"]'); await bo.waitForTimeout(1500); await tap(bo, '[data-act="tchroom"][data-r="3"]'); let seen = false; for (let i = 0; i < 15 && !seen; i++) { await bo.waitForTimeout(2000); seen = await bo.evaluate(() => ((document.getElementById('tchlog') || {}).innerText || '').includes('QA hello from room 3')); }
  const in1 = await bo.evaluate(() => { const b = document.querySelector('[data-act="tchroom"][data-r="1"]'); if (b) b.click(); return new Promise((r) => setTimeout(() => r(((document.getElementById('tchlog') || {}).innerText || '').includes('QA hello from room 3')), 1500)); });
  console.log('Ann\'s rooms', JSON.stringify(roomsA), '| Bo sees it in Room 3', seen, '| and not in Room 1', !in1);
  await ann.screenshot({ path: OUT + '_ann.png' }); await tap(bo, '[data-act="tchroom"][data-r="3"]'); await bo.waitForTimeout(1500); await bo.screenshot({ path: OUT + '_bo.png' });
  console.log('store', await ann.evaluate(() => JSON.stringify(Object.keys(localStorage).filter((k) => /__mfb:(chat|pings|data\/users\/(ann1|bo2)\/state)/.test(k)).map((k) => { const raw = JSON.parse(localStorage.getItem(k)); const d = raw && typeof raw.j === 'string' ? JSON.parse(raw.j) : raw; return k.slice(6) + ' ' + (k.includes('/state') ? 'coins=' + d.coins + ' sqt=' + JSON.stringify((d.social || {}).sqt || null) : JSON.stringify(d).slice(0, 220)); }))));
  console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 3))); await b.close(); })();
