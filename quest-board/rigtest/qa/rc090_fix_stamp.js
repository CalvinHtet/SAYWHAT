// rc-0.90 QA (d8869a0), w-stamp 99e87ca re-check: (1) the served app.js and web.js compile (b9ad3ef broke on an apostrophe) and the
// game loads with no page errors; (2) window.qbStampText() reads "NOV 10  11:42 PM"-style text in the phone's own time zone (4 zones,
// a fixed moment and now), checked against Intl in Node; (3) the build carries the stamp prompt pieces.
//   BASE=http://127.0.0.1:8816 bash tools/windows/node.sh rigtest/qa/rc090_fix_stamp.js
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816';
const fmt = (t, tz) => { const o = {}; new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(new Date(t)).forEach((p) => (o[p.type] = p.value)); return (o.month + ' ' + o.day + '  ' + o.hour + ':' + o.minute + ' ' + (o.dayPeriod || '')).toUpperCase().trim(); };
(async () => {
  for (const f of ['app.js', 'web.js', 'config.js']) {
    const r = await fetch(BASE + '/' + f); const src = r.ok ? await r.text() : null;
    if (!src) { console.log(f, 'HTTP', r.status); continue; }
    let ok = true, err = ''; try { new Function(src); } catch (e) { ok = false; err = e.message; }
    console.log(`compile ${f} (${src.length} chars): ${ok ? 'OK' : 'SYNTAX ERROR ' + err}` + (f === 'app.js' ? ` | has stampAsk ${src.includes('function stampAsk(')} STAMPBAD ${src.includes('var STAMPBAD=')} "stamp_ok" ${(src.match(/stamp_ok/g) || []).length}x` : '') + (f === 'web.js' ? ` | qbStamp ${src.includes('window.qbStamp =')} qbStampText ${src.includes('window.qbStampText =')}` : ''));
  }
  const FIX = Date.UTC(2026, 10, 11, 7, 42); // 2026-11-10 11:42 PM Pacific
  const RE = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{1,2}  \d{1,2}:\d\d (AM|PM)$/;
  const br = await browser(); let bad = 0;
  for (const tz of ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Tokyo']) {
    const pg = await br.page({ fresh: true });
    await pg.s('Emulation.setTimezoneOverride', { timezoneId: tz });
    await pg.go(BASE + '/'); await pg.wait('!!(window.__qb && typeof window.qbStampText==="function" && document.querySelector("#app"))', 120000); await sleep(2500);
    const r = await pg.ev(`({now:Date.now(),txt:window.qbStampText(),fixed:window.qbStampText(${FIX}),noon:window.qbStampText(${Date.UTC(2026, 11, 1, 20, 5)}),tz:Intl.DateTimeFormat().resolvedOptions().timeZone,app:window.__qb.x().S.created!==undefined})`);
    const exp = { txt: fmt(r.now, tz), fixed: fmt(FIX, tz), noon: fmt(Date.UTC(2026, 11, 1, 20, 5), tz) };
    const okAll = ['txt', 'fixed', 'noon'].every((k) => (r[k] === exp[k] || (k === 'txt' && Math.abs(Date.parse('2026 ' + r[k]) - Date.parse('2026 ' + exp[k])) <= 60000)) && RE.test(r[k]));
    if (!okAll) bad++;
    console.log(`${tz.padEnd(20)} page tz ${r.tz}: now "${r.txt}" (expect "${exp.txt}") | 2026-11-11 07:42 UTC "${r.fixed}" (expect "${exp.fixed}") | 2026-12-01 20:05 UTC "${r.noon}" (expect "${exp.noon}") | format ${RE.test(r.fixed)} ${okAll ? 'OK' : 'BAD'} | page errors ${pg.errs.length}${pg.errs.length ? ' ' + pg.errs.slice(0, 3).join(' | ') : ''}`);
    await pg.close();
  }
  console.log('stamp text checks BAD', bad);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
