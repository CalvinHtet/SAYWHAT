// rc-0.90 QA (d8869a0), re-check of w-drops f938ea2: the Wednesday brand over 40 Wednesdays from 2026-11-18, worked out here from
// __qbDrops.mine(t) and __qbDrops.back(t) alone (ms; Pacific = UTC-8, 08:00 PT). Checks: all 16 brands come back; the one back is the
// one out of the Shop longest; none back within a week of leaving; none back on the Wednesday right before it drops again.
//   BASE=http://127.0.0.1:8816 OUT=<dir/> bash tools/windows/node.sh rigtest/qa/rc090_fix_drops.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/fixes/drops/';
fs.mkdirSync(OUT, { recursive: true });
const PT = (Y, M, D, h = 0, m = 0) => Date.UTC(Y, M - 1, D, h + 8, m);
const NW = +(process.env.NW || 40);
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbDrops && window.__qb)', 120000); await sleep(1500);
  // the Shop at noon (UTC-8) of every day from 2026-11-10 to the last Wednesday + 30 days, and the Wednesday brand at 08:00 UTC-8
  const days = NW * 7 + 40;
  const r = await pg.ev(`(function(t0,nd){var o=[];for(var k=0;k<nd;k++){var t=t0+k*864e5,m=__qbDrops.mine(t),b=__qbDrops.back(t);
      o.push({d:new Date(t-8*36e5).toISOString().slice(0,10),live:m.live.map(function(x){return x.id}),back:b?b.id:null})}
    var names={};__qbDrops.mine(t0+nd*864e5).live.concat(__qbDrops.mine(t0+nd*864e5).vault).forEach(function(x){names[x.id]=x.name});
    return {o:o,names:names,n:Object.keys(names).length}})(${PT(2026, 11, 10, 12)},${days})`, 300000);
  const D = r.o, ix = {}; D.forEach((x, i) => (ix[x.d] = i));
  const all = Object.keys(r.names);
  // the Wednesday brand exactly at 08:00 PT (UTC-8), one minute before, and Thursday 07:59 / 08:00
  const weds = [];
  for (let k = 0; k < NW; k++) {
    const t = PT(2026, 11, 18, 8) + k * 7 * 864e5;
    weds.push(await pg.ev(`(function(t){var b=__qbDrops.back(t),b0=__qbDrops.back(t-6e4),th=__qbDrops.back(t+864e5-6e4),th2=__qbDrops.back(t+864e5),m=__qbDrops.mine(t);
      return {d:new Date(t-8*36e5).toISOString().slice(0,10),back:b&&b.id,backName:b&&b.name,at0759:b0&&b0.id,thu0759:th&&th.id,thu0800:th2&&th2.id,live:m.live.map(function(x){return x.id}),vault:m.vault.map(function(x){return x.id+'<'+(x.left||'')})}})(${t})`));
  }
  const inShop = (b, i) => D[i].live.indexOf(b) >= 0 || D[i].back === b;
  const lines = [], bad = [], cnt = {};
  for (const w of weds) {
    const i = ix[w.d], b = w.back;
    // left: the day after this brand's last day in the Shop before Wednesday i
    const leftOf = (id) => { for (let j = i - 1; j >= 0; j--) if (inShop(id, j)) return j + 1; return null; };
    const nextDrop = (id) => { for (let j = i + 1; j < D.length; j++) if (D[j].live.indexOf(id) >= 0 && D[j - 1].live.indexOf(id) < 0) return j - i; return null; };
    const retired = all.filter((id) => D[i].live.indexOf(id) < 0 && leftOf(id) != null);
    const cands = retired.map((id) => ({ id, out: i - leftOf(id), nd: nextDrop(id) })).sort((a, c) => c.out - a.out);
    const longest = cands[0], longestOK = cands.filter((c) => c.nd == null || c.nd > 5)[0];
    const me = cands.find((c) => c.id === b);
    const prob = [];
    if (!b) prob.push('no brand back');
    else {
      cnt[b] = (cnt[b] || 0) + 1;
      if (!me) prob.push('back brand ' + b + ' is not a retired brand (live or never dropped)');
      else {
        if (me.out < 7) prob.push('back ' + me.out + ' days after leaving');
        if (me.nd != null && me.nd <= 5) prob.push('drops again ' + me.nd + ' days later');
        if (me.out < longestOK.out) prob.push('not the longest out: ' + longestOK.id + ' out ' + longestOK.out + 'd, ' + b + ' out ' + me.out + 'd');
      }
    }
    if (w.at0759 === w.back && w.back) prob.push('already back at Wed 07:59');
    if (w.thu0800) prob.push('still back Thu 08:00 (' + w.thu0800 + ')');
    if (w.thu0759 !== w.back) prob.push('Thu 07:59 shows ' + w.thu0759);
    if (prob.length) bad.push({ d: w.d, prob });
    lines.push(`${w.d}  back ${String(b).padEnd(5)} (${r.names[b] || '-'}) out ${me ? me.out : '?'}d, next drop ${me && me.nd != null ? '+' + me.nd + 'd' : 'none in range'} | live ${w.live.join('+')} | longest out ${longest ? longest.id + ' ' + longest.out + 'd' + (longest.nd != null && longest.nd <= 5 ? ' (drops +' + longest.nd + 'd)' : '') : '-'}${prob.length ? '  <<< ' + prob.join('; ') : ''}`);
  }
  const firstBack = {}; weds.forEach((w, k) => { if (w.back && firstBack[w.back] == null) firstBack[w.back] = w.d; });
  const out = [];
  out.push('brands in the calendar: ' + r.n + ' ' + all.join(','));
  out.push('Wednesdays checked: ' + weds.length + ' (' + weds[0].d + ' .. ' + weds[weds.length - 1].d + ')');
  out.push('first ' + Math.min(20, lines.length) + ' Wednesdays:'); lines.slice(0, 20).forEach((l) => out.push('  ' + l));
  out.push('Wednesdays 21..' + lines.length + ':'); lines.slice(20).forEach((l) => out.push('  ' + l));
  out.push('times back per brand: ' + all.map((id) => id + ':' + (cnt[id] || 0)).join(' '));
  out.push('brands that came back: ' + Object.keys(cnt).length + ' / ' + all.length + '; never: ' + JSON.stringify(all.filter((id) => !cnt[id])));
  out.push('first return per brand: ' + JSON.stringify(firstBack));
  out.push('problems: ' + bad.length + ' ' + JSON.stringify(bad));
  out.push('page errors ' + pg.errs.length + ' ' + JSON.stringify(pg.errs.slice(0, 4)));
  console.log(out.join('\n'));
  fs.writeFileSync(OUT + 'drops_weds.txt', out.join('\n') + '\n');
  fs.writeFileSync(OUT + 'drops_days.json', JSON.stringify({ days: D, weds }, null, 0));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
