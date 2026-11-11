// Cal's fresh start window (rc-v0.92c: CFUNTIL 11-21, was 11-14; LEAD 2026-11-11 "so it still runs if Cal publishes later this week").
// The clock is moved before the page's own scripts (Date shifted in an init script; 00_clock.js builds on it), Cal's stand-in uid is
// set, and his old v0.90 save is loaded: on 11-17 (after the old cutoff) and 11-20 the fresh start must run (backup + S.calfresh91);
// on 11-22 it must not (the normal v0.91 reset only).
//   BASE=<sandbox build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wcfuntil.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8822';
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const SHIFT = (iso) => `(function(){var R=Date,off=Date.parse('${iso}')-R.now();var D=function(){var a=[].slice.call(arguments);if(!(this instanceof D))return new R(R.now()+off).toString();return a.length?new (Function.prototype.bind.apply(R,[null].concat(a)))():new R(R.now()+off)};
  D.now=function(){return R.now()+off};D.parse=R.parse;D.UTC=R.UTC;D.prototype=R.prototype;window.Date=D;window.__qbCfUid="sandbox";})();`;
(async () => {
  const br = await browser(); const seed = JSON.parse(fs.readFileSync(SEEDS + 'v90_mid.json', 'utf8'));
  for (const [day, want] of [['2026-11-17T18:00:00Z', true], ['2026-11-20T18:00:00Z', true], ['2026-11-22T18:00:00Z', false]]) {
    const pg = await br.page({ fresh: true }); await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: SHIFT(day) });
    await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(seed)})`);
    await pg.go(BASE + '/'); await sleep(9000);
    const r = await pg.ev(`(function(){var x=window.__qb&&window.__qb.x&&window.__qb.x(),S=x&&x.S;return {now:new Date().toISOString().slice(0,16),calfresh91:S?S.calfresh91||null:null,backup:(localStorage.getItem('quest-board-backup-calfresh91')||'').length,reset91:S&&S.reset91?1:0,created:S?!!S.created:null}})()`);
    ok(want ? (r.calfresh91 && r.backup > 1000) : (!r.calfresh91 && !r.backup), `${day.slice(0, 10)}: fresh start ${want ? 'runs' : 'does not run'}: ${JSON.stringify(r)}`);
    ok(!pg.errs.length, `${day.slice(0, 10)}: page errors ${pg.errs.length} ${pg.errs.slice(0, 1)}`);
    await pg.close();
  }
  console.log(P.length ? `W-CFUNTIL: ${P.length} problem(s)` : 'W-CFUNTIL: PASS');
  await br.close(); process.exit(P.length ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
