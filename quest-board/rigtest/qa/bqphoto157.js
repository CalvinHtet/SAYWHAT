// QA, 87f32800 bounty sweep (Cal 11-25: "It should require photo proof for the ones that need it, but users can choose to share it with
// the town or not"). The sandbox web build (its own local photo board): a 3-day photo bounty (Menu Ideas, 3 photos) taken for real,
// then "Post a photo" from its card and the same all-black picture posted to the town three times (16 s apart, the board's rate limit);
// does the bounty count them and pay? Then the private path with the same black picture (the sandbox stand-in checker) and with a
// bright one twice (the second must be refused as a repeat).
//   WEB=<server of quest-board/ with a sandbox dist-web> OUT=<dir> node bqphoto157.js
const pw = require('playwright'), fs = require('fs'), zlib = require('zlib');
const WEB = process.env.WEB, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const png = (r, g, b) => { const w = 64, h = 64, raw = Buffer.alloc((w * 3 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; for (let x = 0; x < w; x++) { const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = r; raw[o + 1] = g; raw[o + 2] = (b + x + y) & 255; } }
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } c = 0xffffffff; for (const x of buf) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2; return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]); };
(async () => { fs.mkdirSync(OUT, { recursive: true }); const black = OUT + '/black.png', bright = OUT + '/bright.png', bright2 = OUT + '/bright2.png'; fs.writeFileSync(black, png(0, 0, 0)); fs.writeFileSync(bright, png(230, 200, 120)); fs.writeFileSync(bright2, png(120, 220, 160));
  const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort())); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 200)));
  await p.goto(WEB + '/dist-web/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 180000 });
  await p.fill('#ccname', 'Snap'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 120000 }); await p.waitForTimeout(800); await p.click('[data-act="ccdone"]');
  await p.waitForFunction(() => window.__qb && window.__qbV147 && document.querySelector('.nav button'), null, { timeout: 120000 }); await p.waitForTimeout(4000);
  const clr = () => p.evaluate(() => document.querySelectorAll('#layer .modal:not(:has(.ph-new)),.bsplash,.dropsplash,#qbtour,.tour-ring,.tour-bub').forEach((m) => m.remove()));
  const on = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.coins = 1000; S.calm = false; x.persist(); x.render(); return window.__qbV147.pool(3).map((q) => q.id || q.n).join(','); });
  console.log('     the 3-day pool here (photo board on if it lists photo bounties): ' + on);
  /* roll the 3-day card to Menu Ideas without spending (the reroll count is put back each time) */
  const got = await p.evaluate(() => { const V = window.__qbV147; for (let i = 0; i < 40; i++) { const o = V.offer(3); if (o && o.id === 'menu') return true; V.state().rr = 0; V.roll(3); } return false; });
  await clr(); await p.evaluate(() => (document.querySelector('.nav button[data-v="board"]') || { click() {} }).click()); await p.waitForTimeout(700); await clr();
  if (!got) { console.log('BAD  could not bring Menu Ideas up'); bad++; }
  await p.click('[data-act="bqtake"][data-k="3"]'); await p.waitForTimeout(700); const c0 = await p.evaluate(() => window.__qb.x().S.coins);
  const post = async (file) => { await clr(); await p.click('[data-act="bqphoto"][data-k="3"]'); await p.waitForTimeout(800); await p.setInputFiles('#phfile', file); await p.waitForTimeout(900); if (!post.shot) { post.shot = 1; await p.screenshot({ path: OUT + '/bq_window.png' }); }
    const btns = await p.evaluate(() => [...document.querySelectorAll('#layer .ph-new button')].map((b) => (b.dataset.act || '') + '=' + b.textContent.trim()).join(', ')); await p.click('#layer [data-act="phsend"]'); await p.waitForTimeout(2500); return btns; };
  for (let n = 1; n <= 3; n++) { const btns = await post(black); const A = await p.evaluate(() => { const A = window.__qbV147.state().act[3]; return A ? { got: A.got, need: A.need, done: !!A.done } : null; });
    console.log('     posted the same black picture to the town, #' + n + ': bounty ' + JSON.stringify(A) + (n === 1 ? '  (window buttons: ' + btns + ')' : '')); if (n < 3) await p.waitForTimeout(16000); }
  const end = await p.evaluate(() => { const A = window.__qbV147.state().act[3]; return { done: !!(A && A.done), coins: window.__qb.x().S.coins }; });
  ok(!end.done, 'the same all-black picture posted to the town three times must not finish Menu Ideas (done ' + end.done + ', coins ' + c0 + ' -> ' + end.coins + ')');
  await p.screenshot({ path: OUT + '/bq_posted.png' });
  /* the private path, on a fresh photo bounty */
  await p.evaluate(() => { const V = window.__qbV147, b = V.state(); delete b.act[3]; delete b.hold[3]; for (let i = 0; i < 40; i++) { const o = V.offer(3); if (o && o.id === 'menu') break; b.rr = 0; V.roll(3); } window.__qb.x().render(); }); await p.waitForTimeout(500); await clr();
  await p.click('[data-act="bqtake"][data-k="3"]'); await p.waitForTimeout(700);
  const priv = async (file) => { await clr(); await p.click('[data-act="bqphoto"][data-k="3"]'); await p.waitForTimeout(800); await p.setInputFiles('#phfile', file); await p.waitForTimeout(900); await p.click('#layer [data-act="bqpriv"]'); await p.waitForTimeout(2500);
    return p.evaluate(() => { const A = window.__qbV147.state().act[3], m = document.getElementById('bqprivmsg'); const r = { got: A && A.got, msg: m ? m.textContent : '(window closed)' }; document.querySelectorAll('#layer .modal').forEach((x) => x.remove()); return r; }); };
  const r1 = await priv(black); ok(r1.got === 0 && /dark|doesn|look/i.test(r1.msg), 'private, all-black picture: not counted (' + JSON.stringify(r1) + ')');
  const r2 = await priv(bright); ok(r2.got === 1, 'private, a bright picture: counted (' + JSON.stringify(r2) + ')');
  const r3 = await priv(bright); ok(r3.got === 1 && /already used/i.test(r3.msg), 'private, the same bright picture again: refused (' + JSON.stringify(r3) + ')');
  const r4 = await priv(bright2); ok(r4.got === 2, 'private, a different picture: counted (' + JSON.stringify(r4) + ')');
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
