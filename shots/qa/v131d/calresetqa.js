// Cal 11-23: "Only reset my progress". On the Live web build with the stand-in Firebase: the owner's played save is backed up to
// data/users/<uid>/backup_reset131 and starts over at level 1 with no coins, once (a reload does not reset again, and the backup stays);
// another player's save is untouched. Both see the 1.31 letter in the inbox and the board notice.
//   QB_TARGET=web python3 tools/build.py; serve quest-board/ on PORT; NODE_PATH=<playwright's parent> node rigtest/lead/calreset.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const PORT = process.env.PORT || '8766', URL = 'http://127.0.0.1:' + PORT + '/dist-web/index.html'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const MOCK = fs.readFileSync(path.join(__dirname, 'mockfirebase.js'), 'utf8'), CFG = fs.readFileSync(path.join(__dirname, '../../dist-web/config.js'), 'utf8');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
  await ctx.route(/firebase-(app|auth|firestore)-compat\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: /app-compat/.test(r.request().url()) ? MOCK : '' }));
  await ctx.route(/\/__\/firebase\/init\.json/, (r) => r.fulfill({ status: 404, body: '' }));
  await ctx.route(/\/config\.js/, (r) => r.fulfill({ contentType: 'text/javascript', body: CFG + '\nwindow.QB_WEB.owners=["cal"];' }));
  const errs = [];
  const open = async (uid) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(uid + ': ' + e.message.slice(0, 160))); await p.addInitScript((u) => { window.__mockUid = u; window.__mockSignedIn = 1; }, uid); await p.goto(URL); return p; };
  const create = async (p) => { await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 }); await p.fill('#ccname', 'P'); await p.click('[data-act="ccnext"]');
    await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]'); await p.waitForTimeout(4000); };
  /* a played save for each: made on this build, then pushed up to level 30 with coins (as a v1.30 player would have) through the store */
  const seed = async (uid) => { const p = await open(uid); await create(p); await p.close();
    return await ctx.pages()[0].evaluate(([uid]) => { const k = Object.keys(localStorage).filter((k) => k.indexOf('__mfb:') === 0 && k.indexOf('users/' + uid + '/state') > 0)[0]; if (!k) return 'none'; const raw = JSON.parse(localStorage.getItem(k)); const d = typeof raw.j === 'string' ? JSON.parse(raw.j) : raw; d.xp = 8000; d.coins = 5000; d.lvPaid = 30; d.gates = [5, 10, 20, 30]; delete d.calRs131; raw.j = JSON.stringify(d); raw.t = Date.now(); localStorage.setItem(k, JSON.stringify(raw)); return k; }, [uid]).catch(() => null); };
  await (await ctx.newPage()).goto(URL); console.log('seed', await seed('cal'), await seed('pal')); await ctx.pages()[0].evaluate(() => Object.keys(localStorage).filter((k) => /backup_reset131/.test(k)).forEach((k) => localStorage.removeItem(k))); /* seeding made the save on this build, which reset it at once: start from a played save with no mark */ console.log('keys', JSON.stringify(await ctx.pages()[0].evaluate(() => Object.keys(localStorage).filter((k) => k.indexOf('__mfb:') === 0).slice(0, 20))));
  const st = (p) => p.evaluate(() => { const t = document.body.innerText; return { lv: (t.match(/Lv\s*(\d+)/) || [])[1], coins: +((document.querySelector('.coinpill') || {}).innerText || '').replace(/\D/g, '') || 0, creator: !!document.querySelector('#ccname') }; });
  const bk = () => ctx.pages()[0].evaluate(() => Object.keys(localStorage).filter((k) => /backup_reset131/.test(k)).map((k) => k.replace('__mfb:', '')));
  let p = await open('cal'); await p.waitForTimeout(9000); let s = await st(p);
  ok(s.creator || s.lv === '1', 'the owner starts over: ' + JSON.stringify(s)); ok((await bk()).some((k) => /users\/cal\//.test(k)), 'the owner\'s save is backed up: ' + JSON.stringify(await bk()));
  if (s.creator) await create(p); await p.close();
  p = await open('cal'); await p.waitForTimeout(8000); s = await st(p); ok(!s.creator && s.lv === '1', 'a reload does not reset again: ' + JSON.stringify(s)); await p.close();
  p = await open('pal'); await p.waitForTimeout(8000); s = await st(p); ok(!s.creator && +s.lv >= 25 && s.coins >= 5000, 'another player keeps their save: ' + JSON.stringify(s)); ok(!(await bk()).some((k) => /users\/pal\//.test(k)), 'and has no reset backup');
  const inbox = await p.evaluate(() => { const e = document.querySelector('[data-act="inbox"],.ibbtn,[data-act="ibopen"]'); if (e) e.click(); return new Promise((r) => setTimeout(() => r(document.body.innerText.includes('Update 1.31')), 800)); });
  ok(inbox, 'the 1.31 letter is in the inbox');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
