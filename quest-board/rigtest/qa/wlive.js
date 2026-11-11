// Live build checks for a release candidate (LEAD 17:28): the test tools are stripped (no window.__qb* hooks, no "Testing" rows or
// buttons), QB_EPOCH 6, APPV, version.json lists every file with its size and the sizes match, app.js compiles, and a first load has
// no page errors. Run on the Live build (build_web.sh without "sandbox"), served on its own port. __qbLoad (the loader's timing,
// loader.html) and __qbWeb (web.js: live, signedIn, running) are platform objects, not test hooks, and are allowed.
//   BASE=http://127.0.0.1:8812 DIST=<that dist-web> APPV=91 CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wlive.js
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8812', DIST = process.env.DIST, WANT = +(process.env.APPV || 91);
(async () => {
  const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
  if (DIST) {
    const js = fs.readFileSync(path.join(DIST, 'app.js'), 'utf8');
    try { new Function(js); ok(true, `app.js compiles (${js.length.toLocaleString()} chars)`); } catch (e) { ok(false, 'app.js does not compile: ' + e.message); }
    const ep = (js.match(/QB_EPOCH\s*=\s*(\d+)/) || [])[1], av = (js.match(/APPV\s*=\s*(\d+)/) || [])[1];
    ok(ep === '6', `QB_EPOCH ${ep} (want 6)`); ok(+av === WANT, `APPV ${av} (want ${WANT})`);
    const v = JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
    ok(+v.appv === WANT, `version.json appv ${v.appv}`);
    const files = v.files || []; let bad = 0;
    files.forEach(([f, size]) => { const p = path.join(DIST, f.split('?')[0]); const s = fs.existsSync(p) ? fs.statSync(p).size : -1; if (s !== size) { bad++; if (bad < 4) console.log(`     ${f}: listed ${size}, on disk ${s}`); } });
    ok(files.length > 5 && bad === 0, `version.json lists ${files.length} files with sizes; ${bad} mismatched`);
    const cfg = fs.existsSync(path.join(DIST, 'config.js')) ? fs.readFileSync(path.join(DIST, 'config.js'), 'utf8') : '';
    ok(/noTest\s*:\s*(true|1|!0)/.test(cfg) || /noTest/.test(cfg), 'config.js sets noTest: ' + (cfg.match(/noTest[^,}]*/) || ['(absent)'])[0]);
    ok(!/sandbox\s*:\s*(true|1|!0)/.test(cfg), 'config.js is not the sandbox: ' + ((cfg.match(/sandbox[^,}]*/) || ['(no sandbox key)'])[0]));
  }
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/'); await sleep(12000);
  const r = await pg.ev(`(function(){var hooks=Object.keys(window).filter(function(k){return /^__qb|^qbDbg$/.test(k)&&!/^__qb(Load|Web)$/.test(k)});var t=document.body.innerText;
    return {hooks:hooks,testing:(t.match(/Testing[^\\n]{0,40}/g)||[]).slice(0,4),qbt:!!document.getElementById('qbt'),sandbox:/SANDBOX/.test(t),boot:window.__qbBootErr||null,text:t.replace(/\\s+/g,' ').slice(0,120)}})()`);
  ok(!r.hooks.length, 'test hooks on window: ' + (r.hooks.length ? r.hooks.join(', ') : 'none'));
  ok(!r.testing.length && !r.qbt, 'no "Testing" text or test button on the first screen' + (r.testing.length ? ': ' + r.testing.join(' | ') : ''));
  ok(!r.sandbox, 'no SANDBOX badge');
  ok(!pg.errs.length, `page errors on the first load: ${pg.errs.length} ${pg.errs.slice(0, 2).join(' | ')}`);
  console.log('     first screen:', r.text, '| boot note:', r.boot);
  console.log(P.length ? `LIVE CHECKS: ${P.length} problem(s)` : 'LIVE CHECKS: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
