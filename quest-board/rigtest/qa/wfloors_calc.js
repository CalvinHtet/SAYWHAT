// w-floors QA (W42): the Shop's floors through the test hooks only (no UI). Calendars per floor, the Wednesday vault at levels 29,
// 30 and 70, the gift pools (wheel, 300-chest, crates, sale) below and at 30, and the clothes prices per floor against QA's grades.
//   BASE=http://127.0.0.1:8819 SRC=<quest-board dir> OUT=<dir/> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wfloors_calc.js
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8819', SRC = process.env.SRC || 'C:/Users/clvh/qa-wt/qa-wsale-50ffa58/quest-board',
  OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/wfloors/', NW = +(process.env.NW || 40);
fs.mkdirSync(OUT, { recursive: true });
const out = []; const log = (s) => { out.push(s); console.log(s); };
// QA's grades and the brands' floors, from the source tree
const BANDS = { thrift: [100, 250], standard: [250, 500], premium: [600, 1200], luxury: [1300, 2200] };
const ORD = { thrift: 0, standard: 1, premium: 2, luxury: 3 };
const tiers = {}; fs.readFileSync(path.join(SRC, 'docs/qa-2026-11-10/CLOTHING_TIERS.md'), 'utf8').split('\n').forEach((l) => {
  const c = l.split('|').map((s) => s.trim()); if (c.length > 7 && /^[a-z0-9_]+$/.test(c[1]) && BANDS[c[6]]) tiers[c[1]] = c[6]; });
const A = fs.readFileSync(path.join(SRC, 'app/src/10_app_a.js'), 'utf8');
const brBlk = A.slice(A.indexOf('var BRANDS=['), A.indexOf('];', A.indexOf('var BRANDS=[')));
const BR = [...brBlk.matchAll(/\{id:"([^"]+)",name:"([^"]+)"(,fl:"([^"]+)")?/g)].map((m) => ({ id: m[1], name: JSON.parse('"' + m[2] + '"'), fl: m[4] || 'street' }));
const FLOOR = {}; BR.forEach((b) => (FLOOR[b.id] = b.fl));
const LVL = `function(L){var x=window.__qb.x(),s=x.S;s.xp=x.cum(L);s.gates=[];var g,n=0;while((g=x.gated())!==null&&n++<80)s.gates.push(g);x.persist();return x.effLvl()}`;
(async () => {
  const br = await browser(); const pg = await br.page({ fresh: true, phone: false, width: 800, height: 600 });
  await pg.go(BASE + '/'); await pg.wait('!!(window.__qbDrops && window.__qb && window.__qb.x && window.__qbFree)', 120000); await sleep(1500);
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'Fl',sex:'f'});S.welcomed=1;x.persist();return 1})()`);
  log('build ' + BASE + '  brands: ' + BR.map((b) => b.id + '/' + b.fl).join(' '));
  log('ECON.floors ' + JSON.stringify(await pg.ev('window.__qbEcon.ECON.floors')));
  log('ECON.clothFloor ' + JSON.stringify(await pg.ev('window.__qbEcon.ECON.clothFloor')));

  // ---------- 4. calendars: every day from 2026-11-09 for 8 weeks, at 07:59 and 08:00 Pacific ----------
  const cal = await pg.ev(`(function(){var o={},ids=["street","boutique","atelier"];var d0=Date.UTC(2026,10,9);
    ids.forEach(function(id){var rows=[];for(var k=0;k<58;k++){var ymd=new Date(d0+k*864e5).toISOString().slice(0,10),t=__qbDrops.start(ymd);
      var a=__qbDrops.floor(id,t-6e4),b=__qbDrops.floor(id,t),c=__qbDrops.floor(id,t+4*36e5);
      rows.push({d:ymd,wd:new Date(d0+k*864e5).getUTCDay(),pre:a.live.map(function(x){return x.id}),at:b.live.map(function(x){return x.id}),noon:c.live.map(function(x){return x.id}),
        next:c.next?c.next.id+"@"+c.next.start:null,vault:c.vault.map(function(x){return x.id})})}o[id]=rows});return o})()`, 120000);
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (const id of ['street', 'boutique', 'atelier']) {
    const rows = cal[id]; const drops = [], stints = {}, cur = {}; let prevNoon = [];
    rows.forEach((r) => {
      const added = r.at.filter((b) => r.pre.indexOf(b) < 0);
      if (added.length) drops.push(r.d + ' ' + WD[r.wd] + ' 08:00 ' + added.join('+') + ' (live ' + r.at.join('+') + ')');
      r.noon.forEach((b) => { if (prevNoon.indexOf(b) < 0) cur[b] = r.d; });
      prevNoon.forEach((b) => { if (r.noon.indexOf(b) < 0) { (stints[b] = stints[b] || []).push(cur[b] + '..' + r.d + ' (' + Math.round((Date.parse(r.d) - Date.parse(cur[b])) / 864e5) + 'd)'); } });
      prevNoon = r.noon;
    });
    const badDay = rows.filter((r) => r.pre.join() !== r.at.join() && [id === 'street' ? [1, 5] : [5]][0].indexOf(r.wd) < 0 && r.d !== '2026-11-10');
    const maxLive = Math.max(...rows.map((r) => r.noon.length));
    log(`\n[4] ${id}: ${drops.length} drop moments in 8 weeks, max live ${maxLive}, changes on a non-drop day: ${badDay.length ? JSON.stringify(badDay.map((r) => r.d)) : 'none'}`);
    drops.forEach((d) => log('   ' + d));
    log('   stints (noon live, first day..day it was gone): ' + Object.keys(stints).map((b) => b + ' ' + stints[b].join(', ')).join(' | '));
    log('   live at 2026-11-10 noon: ' + rows[1].noon.join('+') + '; next ' + rows[1].next);
  }

  // ---------- 5. Wednesday vault at levels 29, 30, 70 ----------
  const lv = {};
  for (const L of [29, 30, 70]) {
    const got = await pg.ev(`(${LVL})(${L})`);
    const r = await pg.ev(`(function(nw){var d0=Date.UTC(2026,10,10),days=[],fl=__qbDrops.floors().map(function(F){return F.id});
      for(var k=0;k<nw*7+40;k++){var ymd=new Date(d0+k*864e5).toISOString().slice(0,10),t=__qbDrops.start(ymd)+4*36e5,row={d:ymd,live:{}};
        fl.forEach(function(id){row.live[id]=__qbDrops.floor(id,t).live.map(function(x){return x.id})});days.push(row)}
      var weds=[];for(var w=0;w<nw;w++){var ymd=new Date(Date.UTC(2026,10,11)+w*7*864e5).toISOString().slice(0,10),t=__qbDrops.start(ymd);
        var b=__qbDrops.back(t),b0=__qbDrops.back(t-6e4),th=__qbDrops.back(t+864e5-6e4),th2=__qbDrops.back(t+864e5);
        weds.push({d:ymd,back:b&&b.id,fl:b&&b.fl,at0759:b0&&b0.id,thu0759:th&&th.id,thu0800:th2&&th2.id})}
      return {fl:fl,days:days,weds:weds}})(${NW})`, 300000);
    lv[L] = r;
    const ix = {}; r.days.forEach((x, i) => (ix[x.d] = i));
    const flBr = (f) => BR.filter((b) => b.fl === f).map((b) => b.id);
    const all = [].concat(...r.fl.map(flBr));
    const liveOn = (b, i) => { const f = FLOOR[b]; return !!(r.days[i] && r.days[i].live[f] && r.days[i].live[f].indexOf(b) >= 0); };
    const lastBack = {}, cnt = {}, bad = [], lines = [];
    for (const w of r.weds) {
      const i = ix[w.d], prob = [];
      const leftOf = (b) => { for (let j = i - 1; j >= 0; j--) if (liveOn(b, j)) return j + 1; return null; };
      const nextDrop = (b) => { for (let j = i + 1; j < r.days.length; j++) if (liveOn(b, j) && !liveOn(b, j - 1)) return j - i; return null; };
      const cands = all.filter((b) => !liveOn(b, i) && leftOf(b) != null).map((b) => {
        const lb = lastBack[b] != null ? lastBack[b] + 1 : -1, since = Math.max(leftOf(b), lb); return { b, gone: i - since, nd: nextDrop(b), lb: lastBack[b] != null ? lastBack[b] : -1 }; });
      const ok = cands.filter((c) => c.gone >= 14 && !(c.nd != null && c.nd <= 5)).sort((a, c) => a.lb - c.lb || c.gone - a.gone);
      const exp = ok[0] ? ok[0].b : null;
      if (w.back) { cnt[w.back] = (cnt[w.back] || 0) + 1; if (r.fl.indexOf(FLOOR[w.back]) < 0) prob.push('brand from a floor not open: ' + w.back + '/' + FLOOR[w.back]); }
      if (w.back !== exp) prob.push('expected ' + exp + ' by the rule, got ' + w.back);
      if (w.back && w.at0759 === w.back) prob.push('back already Wed 07:59');
      if (w.thu0800) prob.push('still back Thu 08:00');
      if (w.thu0759 !== w.back) prob.push('Thu 07:59 shows ' + w.thu0759);
      const me = cands.find((c) => c.b === w.back);
      if (w.back) lastBack[w.back] = i;
      const boutC = cands.filter((c) => FLOOR[c.b] === 'boutique').map((c) => c.b + ' gone ' + c.gone + 'd next +' + c.nd + 'd').join(', ');
      lines.push(`${w.d} back ${w.back || '-'}${w.back ? '/' + FLOOR[w.back] : ''} ${me ? 'gone ' + me.gone + 'd next drop ' + (me.nd == null ? 'none' : '+' + me.nd + 'd') : ''}${boutC ? ' | boutique retired: ' + boutC : ''}${prob.length ? '  <<< ' + prob.join('; ') : ''}`);
      if (prob.length) bad.push(w.d + ': ' + prob.join('; '));
    }
    log(`\n[5] level ${L} (effLvl ${got}), floors open ${r.fl.join(',')}; ${r.weds.length} Wednesdays ${r.weds[0].d}..${r.weds[r.weds.length - 1].d}`);
    lines.slice(0, 12).forEach((l) => log('   ' + l));
    log('   ... (full list in wfloors_calc.txt)');
    out.push(...lines.slice(12).map((l) => '   ' + l));
    log('   returns per brand: ' + all.map((b) => b + ':' + (cnt[b] || 0)).join(' '));
    log('   never back: ' + JSON.stringify(all.filter((b) => !cnt[b])) + '; Wednesdays with no brand: ' + r.weds.filter((w) => !w.back).length);
    log('   boutique brands ever back: ' + JSON.stringify(Object.keys(cnt).filter((b) => FLOOR[b] === 'boutique')));
    log('   rule problems: ' + bad.length + (bad.length ? ' ' + JSON.stringify(bad.slice(0, 6)) : ''));
  }
  // the Street's picks are the same at 29 and 30 when no Boutique brand qualifies
  const diff = lv[29].weds.filter((w, k) => w.back !== lv[30].weds[k].back).map((w, k) => w.d);
  log('   Wednesdays where level 29 and level 30 picks differ: ' + diff.length + ' ' + JSON.stringify(diff.slice(0, 10)));

  // ---------- 1. gifts below 30 and at 30 ----------
  for (const L of [1, 29, 30]) {
    await pg.ev(`(${LVL})(${L})`);
    const g = await pg.ev(`(function(){var re=/^a_(top|pants|shoes|acc|hat|back|mask)$/,x=window.__qb.x(),S=x.S,own0=JSON.stringify(S.owned||{});
      var b=function(it){return (it&&it[6]&&it[6].b)||""};var cnt=function(L){var o={};L.forEach(function(it){var k=b(it);o[k]=(o[k]||0)+1});return o};
      var poolW=__qbFree.pool({slots:re,brands:"all"}),poolA=__qbFree.pool({slots:/^a_acc$/,brands:"all"});
      var wheel={};for(var i=0;i<3000;i++){var it=__qbFree.item({slots:re,brands:"all"});var k=b(it);wheel[k]=(wheel[k]||0)+1}
      var coins0=S.coins,chest={},kinds={};for(var j=0;j<600;j++){var r=__qbFree.roll();kinds[r.kind]=(kinds[r.kind]||0)+1;if(r.kind==="wear"){var k2=b(r.it);chest[k2]=(chest[k2]||0)+1}}
      S.owned=JSON.parse(own0);S.coins=coins0;S.relics2={};x.persist();
      var st=__qbDrops.state(),today=__qbDrops.ymd(),sale=window.__qbSale?{brands:__qbSale.brands(today),on:__qbSale.brandOn(today)}:null;
      var saleW=[];if(window.__qbSale){for(var d=0;d<60;d++){var y=new Date(Date.UTC(2026,10,10)+d*864e5).toISOString().slice(0,10);saleW.push(__qbSale.brandOn(y))}}
      return {lvl:x.effLvl(),floors:__qbDrops.floors().map(function(F){return F.id}),wheelPool:cnt(poolW),accPool:cnt(poolA),wheel:wheel,chest:chest,kinds:kinds,
        live:st.live.map(function(z){return z.id}),open:st.open,sale:sale,saleBrands60:saleW}})()`, 240000);
    const bout = (o) => Object.keys(o).filter((k) => FLOOR[k] === 'boutique');
    log(`\n[1] gifts at level ${L} (effLvl ${g.lvl}), floors ${JSON.stringify(g.floors)}, dropState.open ${JSON.stringify(g.open)}, live ${g.live.join('+')}`);
    log('   wheel pool by brand ' + JSON.stringify(g.wheelPool) + ' -> Boutique brands in pool: ' + JSON.stringify(bout(g.wheelPool)));
    log('   300-chest accessory pool ' + JSON.stringify(g.accPool) + ' -> Boutique: ' + JSON.stringify(bout(g.accPool)));
    log('   3000 wheel-style draws ' + JSON.stringify(g.wheel) + ' -> Boutique: ' + JSON.stringify(bout(g.wheel)));
    log('   600 chest3 rolls kinds ' + JSON.stringify(g.kinds) + ', wear by brand ' + JSON.stringify(g.chest) + ' -> Boutique: ' + JSON.stringify(bout(g.chest)));
    log('   sale today ' + JSON.stringify(g.sale) + '; sale brands over 60 days: Boutique ' + g.saleBrands60.filter((b) => FLOOR[b] === 'boutique').length + ' of ' + g.saleBrands60.length);
  }

  // ---------- 6. prices ----------
  const shop = await pg.ev(`(function(){return window.__qb.x().SHOP.map(function(s){var e=s[6]||{};return [s[0],s[1],s[2],s._p0!=null?s._p0:s[3],e.b||"",!!e.dungeon,!!e.basic]})})()`);
  const cl = shop.filter((s) => /^a_/.test(s[1]) && !s[5]);
  const floorOf = (b) => FLOOR[b] || 'street';
  const SPEC = { street: [120, 450], boutique: [620, 1190] };
  const CF = await pg.ev('window.__qbEcon.ECON.clothFloor');
  for (const f of ['street', 'boutique']) {
    const g = cl.filter((s) => floorOf(s[4]) === f && tiers[s[0]]), ng = cl.filter((s) => floorOf(s[4]) === f && !tiers[s[0]]);
    const ps = g.map((s) => s[3]); const outS = g.filter((s) => s[3] < SPEC[f][0] || s[3] > SPEC[f][1]);
    log(`\n[6] ${f}: ${g.length} graded pieces, ${Math.min(...ps)}..${Math.max(...ps)}; outside the spec's ${SPEC[f].join('-')}: ${outS.length} ${JSON.stringify(outS.map((s) => s[0] + '/' + s[4] + '/' + tiers[s[0]] + ' ' + s[3]).slice(0, 30))}`);
    const byT = {}; g.forEach((s) => { const t = tiers[s[0]]; (byT[t] = byT[t] || []).push(s[3]); });
    log('   by grade: ' + Object.keys(byT).map((t) => t + ' n' + byT[t].length + ' ' + Math.min(...byT[t]) + '..' + Math.max(...byT[t])).join(', '));
    const ngp = ng.map((s) => s[3]);
    log(`   ungraded clothes on this floor: ${ng.length}${ng.length ? ' ' + Math.min(...ngp) + '..' + Math.max(...ngp) + ' e.g. ' + JSON.stringify(ng.slice(0, 8).map((s) => s[0] + '/' + s[1] + '/' + (s[4] || '-') + ' ' + s[3])) : ''}`);
    const ngOut = ng.filter((s) => s[3] < SPEC[f][0] || s[3] > SPEC[f][1]);
    log(`   ungraded outside ${SPEC[f].join('-')}: ${ngOut.length} ${JSON.stringify(ngOut.map((s) => s[0] + '/' + s[1] + '/' + (s[4] || '-') + ' ' + s[3]).slice(0, 40))}`);
    // order: within the floor and slot, a higher grade never cheaper than a lower one
    const viol = [];
    const slots = [...new Set(g.map((s) => s[1]))];
    slots.forEach((sl) => { const L = g.filter((s) => s[1] === sl);
      L.forEach((a) => L.forEach((c) => { if (ORD[tiers[a[0]]] > ORD[tiers[c[0]]] && a[3] < c[3]) viol.push(`${sl}: ${a[0]} (${a[4]}, ${tiers[a[0]]}) ${a[3]} < ${c[0]} (${c[4]}, ${tiers[c[0]]}) ${c[3]}`); })); });
    log(`   grade order violations (same floor, same slot): ${viol.length}`); viol.slice(0, 25).forEach((v) => log('     ' + v));
    // ties
    const eq = []; slots.forEach((sl) => { const L = g.filter((s) => s[1] === sl); L.forEach((a) => L.forEach((c) => { if (ORD[tiers[a[0]]] > ORD[tiers[c[0]]] && a[3] === c[3]) eq.push(`${sl}: ${a[0]} ${tiers[a[0]]} = ${c[0]} ${tiers[c[0]]} ${a[3]}`); })); });
    log(`   equal prices across grades (same slot): ${eq.length} ${JSON.stringify(eq.slice(0, 8))}`);
  }
  const atel = cl.filter((s) => floorOf(s[4]) === 'atelier'); log(`\n[6] atelier pieces: ${atel.length}`);
  const ob = cl.filter((s) => tiers[s[0]]).filter((s) => { const [lo, hi] = BANDS[tiers[s[0]]]; return s[3] < lo || s[3] > hi; });
  log(`[6] graded pieces outside the old QA tier bands: ${ob.length}`);
  const notFloor = [];
  ob.forEach((s) => { const f = floorOf(s[4]), B = CF[f] && CF[f][tiers[s[0]]]; const inF = B && s[3] >= B[0] && s[3] <= B[1];
    if (!inF) notFloor.push(s[0]); log(`   ${s[0].padEnd(16)} ${(s[4] || '-').padEnd(6)} ${f.padEnd(8)} ${s[1].padEnd(8)} ${tiers[s[0]].padEnd(8)} ${String(s[3]).padStart(5)}  old band ${BANDS[tiers[s[0]]].join('-')}, floor band ${B ? B.join('-') : '?'} ${inF ? 'in floor band' : '<<< NOT in floor band'}  ${s[2]}`); });
  log('   outside the old band but not explained by the floor band: ' + notFloor.length + ' ' + JSON.stringify(notFloor));
  const lux = cl.filter((s) => tiers[s[0]] === 'luxury').map((s) => s[0] + '/' + (s[4] || '-') + '/' + floorOf(s[4]) + ' ' + s[3] + ' ' + s[2]);
  log('   luxury pieces: ' + JSON.stringify(lux));
  log('\npage errors ' + pg.errs.length + ' ' + JSON.stringify(pg.errs.slice(0, 5)));
  fs.writeFileSync(OUT + 'wfloors_calc.txt', out.join('\n') + '\n');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); fs.writeFileSync(OUT + 'wfloors_calc.txt', out.join('\n') + '\nFAIL ' + e.stack + '\n'); process.exit(1); });
