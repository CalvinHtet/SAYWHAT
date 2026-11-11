// Old saves load (LEAD 20:41, after the v0.92 bounty blocker): every seed save (v0.88, v0.89 x2, v0.90 x2), each with its bounty state
// set to today's (as the old version wrote it), yesterday's, three days old, junk (null, a string, an array) and missing, plus a v0.91
// save in the middle of a bounty (a 1-day and a 3-day bounty quest on the board). Each must get to the Board with its bounty cards and
// 0 page errors.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wsaveload.js
const fs = require('fs');
const SEEDS = require('path').join(__dirname, 'seeds') + '/';
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8814';
const log = (...a) => console.log(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));
const ymd = (d) => new Date(Date.now() - d * 864e5 - 5 * 36e5).toLocaleDateString('en-CA');   // the game day starts at 5 am
const BTY = {
  today: (s) => ({ d: ymd(0), rr: 1, o1: 2, e3: ymd(-1), o3: 1, ai1: null, ai3: null }),
  todayAI: (s) => ({ d: ymd(0), rr: 2, o1: 0, e3: ymd(-1), o3: 0, ai1: { n: 'AI bounty', why: 'x', xp: 25, stat: 'discipline', cl: 'home' }, ai3: { n: 'AI 3-day', why: 'y', xp: 50 } }),
  yesterday: (s) => ({ d: ymd(1), rr: 3, o1: 1, e3: ymd(0), o3: 2, ai1: null, ai3: null }),
  old: (s) => ({ d: ymd(3), rr: 0, o1: 5, e3: ymd(2), o3: 0 }),
  nullish: () => null, string: () => 'junk', array: () => [1, 2], missing: undefined,
};
(async () => {
  const br = await browser(); let bad = 0, n = 0;
  const runOne = async (file, label, mut) => {
    const d = JSON.parse(fs.readFileSync(SEEDS + file, 'utf8'));
    for (const k of ['quest-board', 'qbsbx:data/users/sandbox/state']) if (d[k]) { const s = JSON.parse(d[k]); mut(s); d[k] = JSON.stringify(s); }
    const pg = await br.page({ fresh: true });
    await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(d)})`);
    await pg.go(BASE + '/'); let ok = false;
    for (let i = 0; i < 40 && !ok; i++) { await sleep(500); ok = await pg.ev('!!(document.querySelector(".nav button[data-v=board]") && !document.querySelector("#app .boot"))'); }
    await sleep(1500);
    const r = await pg.ev('(function(){var c=document.querySelectorAll(".bty-card").length;var q=window.__qb.x().S.quests.filter(function(q){return q.bty}).map(function(q){return q.bty.k+":"+q.bty.end});return {cards:c,btyQuests:q,bty:JSON.stringify(window.__qb.x().S.bty)}})()').catch(() => ({ cards: -1 }));
    n++; const fine = ok && !pg.errs.length && r.cards === 2; if (!fine) bad++;
    log(`${fine ? 'ok ' : 'BAD'} ${file.padEnd(13)} ${label.padEnd(16)} Board ${ok ? 'up' : 'STUCK'}, bounty cards ${r.cards}${r.btyQuests && r.btyQuests.length ? ', bounty quests ' + r.btyQuests.join(' ') : ''}, page errors ${pg.errs.length}${pg.errs.length ? ' ' + pg.errs[0].slice(0, 120) : ''}`);
    await pg.close();
  };
  for (const file of ['v88_adv.json', 'v89_adv.json', 'v89_mid.json', 'v90_adv.json', 'v90_mid.json']) {
    for (const [label, f] of Object.entries(BTY)) await runOne(file, 'S.bty ' + label, (s) => { if (f === undefined) delete s.bty; else s.bty = f(s); });
  }
  // a v0.91 save in the middle of bounties: a 1-day quest taken today and a 3-day quest running to tomorrow
  await runOne('v90_mid.json', 'v0.91 mid-bounty', (s) => { s.appv = 91; s.bty = BTY.today(s); s.next = (s.next || 100) + 2;
    s.quests.push({ id: 'q_b1', name: 'Fix the wobbly chair', xp: 25, stat: 'discipline', cl: 'home', rep: 'once', bty: { k: 1, end: ymd(0), key: '1:' + ymd(0) } });
    s.quests.push({ id: 'q_b3', name: 'Clear out the garage', xp: 50, stat: 'discipline', cl: 'home', rep: 'once', bty: { k: 3, end: ymd(-1), key: '3:' + ymd(-1) } }); });
  log(`${n} loads, ${bad} bad`);
  await br.close(); process.exit(bad ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(2); });
