// Cal 11-26 (29zz_v211.js): a seasonal brand (SØLVBERG, winter) drops only in its season; out of season it waits, and it is never in
// the Vault out of season.
//   PORT=<build server> NODE_PATH=<playwright's parent> node rigtest/lead/season211.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qbV211 && window.__qbV172, null, { timeout: 90000 }); await p.waitForTimeout(300);
  const r = await p.evaluate(() => { const out = { svDays: [], badSv: [], vault: [] }; for (let k = 0; k < 160; k++) { const s = window.__qbV172.run(k); if (s.pick === 'sv') { out.svDays.push(s.day); if (window.__qbV211.season(s.day) !== 'winter') out.badSv.push(s.day); } }
    const day = 864e5; window.__qbV201.reset(); for (let w = 0; w < 52; w++) { const t = Date.parse('2026-11-29T20:00:00Z') + w * 7 * day, v = window.__qbV201.vault(t); if (v.list.some((x) => x[2] === 'sv')) out.vault.push(v.wk); }
    out.vaultBad = out.vault.filter((d) => window.__qbV211.season(d) !== 'winter'); out.seasons = ['2026-11-30', '2027-03-01', '2027-06-15', '2027-09-10', '2027-12-01'].map((d) => window.__qbV211.season(d)); return out; });
  ok(JSON.stringify(r.seasons) === '["winter","spring","summer","fall","winter"]', 'brand seasons: winter Nov-Feb, spring Mar-May, summer Jun-Aug, fall Sep-Oct ' + JSON.stringify(r.seasons));
  ok(r.svDays.length >= 2 && !r.badSv.length, 'SØLVBERG drops only in winter (' + r.svDays.join(', ') + ')');
  ok(r.vault.length >= 1 && !r.vaultBad.length, 'and is in the Sunday Vault only in winter (' + r.vault.length + ' weeks)');
  const sp = await V(() => { const o = window.__qbV211.out; return { oakDec: o('oak', '2026-12-07'), oakApr: o('oak', '2027-04-05'), altDec: o('alt', '2026-12-07'), altOct: o('alt', '2027-10-04') }; });
  ok(sp.oakDec && !sp.oakApr && sp.altDec && !sp.altOct, 'OAKMONT drops only in spring, ALTITUDE only in fall (Cal 11-26) ' + JSON.stringify(sp));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
