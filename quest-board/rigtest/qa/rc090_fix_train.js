// rc-0.90 QA (d8869a0), re-check of the Training fixes d37bb22 (W5):
//   PART=A  seed_adv2, Legs, Back Squat (4 sets): 4 done sets stay on one row at 95..405 and at 102.5 / 137.5 / 1002.5 (the unit may sit below);
//           list view and the guided view; screenshots.
//   PART=B  seed_heavy, Push: not-yet-done boxes read "last 20 lbs" (a number and its unit), list and guided view; screenshots.
//   PART=C  seed_heavy: every Recent-session graph and the Personal-best graphs PB0..PB1, each range: no two date labels touch.
const L = require('./rc090_fix_train_lib.js');
const { sleep } = L;
const D = L.OUT + '/train/';
const PART = process.env.PART || 'A';
const lines = []; const log = (...a) => { const s = a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '); console.log(s); lines.push(s); };
const typeW = async (pg, id, v) => { await L.tapEl(pg, '.exlist input.kg[data-ex="' + id + '"]'); await pg.ev(`(function(){var i=document.querySelector('.exlist input.kg[data-ex="${id}"]');i.focus();i.select();return 1})()`); await pg.s('Input.insertText', { text: String(v) }); await sleep(150); };
const openPlan = async (pg, plan) => {
  await L.nav(pg, 'train'); await sleep(1000); await L.closeAll(pg);
  await L.tapEl(pg, 'button.plan[data-act=wkplan][data-v="' + plan + '"]'); await sleep(1500);
};
const closeCoach = (pg) => pg.ev(`(function(){var x=document.querySelector('[data-ca="x"]');if(x)x.click();return 1})()`);
// the set boxes of one exercise inside a container: rows, widths, overflow, where the unit sits
const BOXES = (where, id) => `(function(){var bs=[].slice.call(document.querySelectorAll('${where} .setb button.sb${id ? `[data-ex="${id}"]` : ''}'));if(!bs.length)return null;
  var info=bs.map(function(b){var r=b.getBoundingClientRect(),v=b.querySelector('b'),u=b.querySelector('small'),vr=v&&v.getBoundingClientRect(),ur=u&&u.getBoundingClientRect();
    return {txt:b.innerText.replace(/\\s+/g,' ').trim(),top:Math.round(r.top),w:Math.round(r.width),over:b.scrollWidth>b.clientWidth+1||b.scrollHeight>b.clientHeight+1,
      unitBelow:!!(vr&&ur&&ur.top>=vr.bottom-2),inside:!!(!vr||(vr.left>=r.left-0.5&&vr.right<=r.right+0.5))&&!!(!ur||(ur.left>=r.left-0.5&&ur.right<=r.right+0.5&&ur.bottom<=r.bottom+0.5))}});
  var setb=bs[0].closest('.setb'),card=bs[0].closest('.ex')||setb;
  return {rows:new Set(info.map(function(i){return i.top})).size,setbW:Math.round(setb.getBoundingClientRect().width),cardRight:Math.round(card.getBoundingClientRect().right),lastRight:Math.round(bs[bs.length-1].getBoundingClientRect().right),boxes:info}})()`;
(async () => {
  if (PART === 'A') {
    const { br, pg } = await L.openGame(L.seed('seed_adv2'));
    await L.settle(pg, null, 20);
    await openPlan(pg, 'legs'); await closeCoach(pg); await sleep(600); await L.closeAll(pg);
    const bad = [];
    for (const v of ['95', '135', '225', '405', '1002.5', '102.5', '137.5']) {
      await typeW(pg, 'squat', v);
      const n = await pg.ev(`document.querySelectorAll('.exlist .setb button.sb[data-ex="squat"]').length`);
      for (let k = 0; k < n; k++) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="squat"]', k); await sleep(150); await L.closeAll(pg); }
      const r = await pg.ev(BOXES('.exlist', 'squat'));
      const ok = r.rows === 1 && r.boxes.every((b) => !b.over && b.inside) && r.lastRight <= r.cardRight;
      log(`LIST ${v.padEnd(6)} sets ${n} rows ${r.rows} setb ${r.setbW}px boxes ${r.boxes.map((b) => b.w).join(',')} last box right ${r.lastRight} / card ${r.cardRight} | "${r.boxes[0].txt}" unit below ${r.boxes[0].unitBelow} overflow ${r.boxes.some((b) => b.over)} text inside ${r.boxes.every((b) => b.inside)} ${ok ? 'OK' : 'BAD'}`);
      if (!ok) bad.push(v);
      if (/\./.test(v)) { const ei = await pg.ev(`[].findIndex.call(document.querySelectorAll('.exlist .ex'),function(e){return !!e.querySelector('[data-ex="squat"]')})`); await L.shotEl(pg, '.exlist .ex', D + `sets_list_4x${v}.png`, ei); }
      if (v !== '137.5') for (let k = n - 1; k >= 0; k--) { await L.tapEl(pg, '.exlist .setb button.sb[data-ex="squat"]', k); await sleep(120); }
    }
    // the guided view with the squat's 4 sets done at 137.5
    await L.tapEl(pg, 'button[data-act=wkcoach]'); await sleep(1300);
    const cname = await pg.ev(`(function(){var c=document.querySelector('.cinner');return c?(c.querySelector('h2,h3,b')||{}).textContent:null})()`);
    const rc = await pg.ev(BOXES('.cinner', null));
    log('GUIDED view (' + cname + ')', rc && `rows ${rc.rows} boxes ${rc.boxes.map((b) => b.w + ':' + b.txt).join(' | ')} overflow ${rc.boxes.some((b) => b.over)} inside ${rc.boxes.every((b) => b.inside)}`);
    if (rc && rc.rows !== 1) bad.push('guided');
    await pg.shot(D + 'sets_guided_4x137.5.png');
    await closeCoach(pg); await sleep(500);
    await L.tapEl(pg, 'button[data-act=wkcancel]'); await sleep(400); await L.closeAll(pg);
    log('PART A BAD', JSON.stringify(bad), '| page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    L.closeAll(pg); require('fs').writeFileSync(D + 'partA_log.txt', lines.join('\n') + '\n');
    await br.close();
  }
  if (PART === 'B') {
    const { br, pg } = await L.openGame(L.seed('seed_heavy'));
    await L.settle(pg, null, 20);
    await openPlan(pg, 'push');
    const coach = await pg.ev(BOXES('.cinner', null));
    log('GUIDED first exercise boxes:', coach.boxes.map((b) => b.txt).join(' | '));
    await pg.shot(D + 'last_guided_push.png');
    await closeCoach(pg); await sleep(700); await L.closeAll(pg);
    const all = await pg.ev(`[].map.call(document.querySelectorAll('.exlist .ex'),function(e){return {name:e.querySelector('.exhead b').textContent,boxes:[].map.call(e.querySelectorAll('.setb button.sb'),function(b){return b.innerText.replace(/\\s+/g,' ').trim()})}})`);
    const lastTxt = [], bad = [];
    all.forEach((c) => c.boxes.forEach((t) => { const m = t.match(/last\b.*$/); if (m) { lastTxt.push(m[0]); if (!/^last [\d.,]+ (lbs|kg|mi|km|min|reps|laps|floors|steps|sec|s|m)$/.test(m[0])) bad.push(c.name + ': ' + t); } }));
    all.forEach((c) => log('LIST', c.name.padEnd(24), c.boxes.join(' | ')));
    log('"last" texts:', [...new Set(lastTxt)].join(', '), '| count', lastTxt.length, '| without a unit:', JSON.stringify(bad));
    await L.shotEl(pg, '.exlist .ex', D + 'last_list_card0.png', 0);
    await L.shotEl(pg, '.exlist .ex', D + 'last_list_card1.png', 1);
    // the guided view's text against the same check
    const cb = coach.boxes.map((b) => (b.txt.match(/last\b.*$/) || [''])[0]).filter(Boolean);
    log('GUIDED "last" texts:', cb.join(', '), '| all with unit', cb.every((t) => /^last [\d.,]+ [a-z]+$/.test(t)));
    await L.tapEl(pg, 'button[data-act=wkcancel]').catch(() => {}); await sleep(400);
    log('PART B page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    require('fs').writeFileSync(D + 'partB_log.txt', lines.join('\n') + '\n');
    await br.close();
  }
  if (PART === 'C') {
    const PB0 = +(process.env.PB0 || 0), PB1 = +(process.env.PB1 || 9), REC = process.env.REC !== '0';
    const sd = L.seed('seed_heavy');
    // SORT=1: gymlog and sessions oldest first, the order the game itself writes (the seed file holds them newest first)
    if (process.env.SORT) { const s = JSON.parse(sd['quest-board']); Object.keys(s.gymlog).forEach((k) => s.gymlog[k].sort((a, b) => (a.d < b.d ? -1 : 1))); s.sessions.sort((a, b) => (a.d < b.d ? -1 : 1)); sd['quest-board'] = sd['qbsbx:data/users/sandbox/state'] = JSON.stringify(s); }
    const { br, pg } = await L.openGame(sd);
    await L.settle(pg, null, 20);
    await L.nav(pg, 'train'); await sleep(1300); await L.closeAll(pg);
    const GI = `(function(){var m=document.querySelector('#layer .modal');if(!m)return null;var g=m.querySelector('svg.wkchart');if(!g)return {none:(m.querySelector('.wkempty')||{}).textContent||'no chart'};
      var t=[].map.call(g.querySelectorAll('text.wkt'),function(e){var r=e.getBoundingClientRect();return {s:e.textContent,on:e.classList.contains('on'),l:r.left,r:r.right}}).filter(function(x){return /^\\d\\d\\/\\d\\d$/.test(x.s)}).sort(function(a,b){return a.l-b.l});
      var gaps=[];for(var i=1;i<t.length;i++)gaps.push(Math.round((t[i].l-t[i-1].r)*10)/10);
      return {h2:(m.querySelector('h2')||{}).textContent,rg:([].filter.call(m.querySelectorAll('[data-wkrg]'),function(b){return b.classList.contains('on')})[0]||{}).textContent,
        labels:t.map(function(x){return x.s+(x.on?'*':'')}).join(' '),minGap:gaps.length?Math.min.apply(null,gaps):null,ringed:t.some(function(x){return x.on}),pts:g.querySelectorAll('circle.wkdot').length}})()`;
    const gtap = async (sel, i) => { for (let k = 0; k < 4; k++) { await L.closeAll(pg); await L.tapEl(pg, sel, i, 0.3, 0.5); await sleep(700); const m = await L.modalInfo(pg); if (m.length === 1 && /wksum/.test(m[0].card)) return true; } return false; };
    const res = []; let shots = 0;
    const one = async (kind, sel, i) => {
      if (!(await gtap(sel, i))) { log(kind, i, 'did not open'); return; }
      const first = await pg.ev(GI);
      for (const k of ['7d', '1m', '3m', '6m']) {
        await L.tapEl(pg, '#layer .modal [data-wkrg="' + k + '"]'); await sleep(350);
        const g = await pg.ev(GI); if (!g || g.none) { res.push({ kind, i, k, none: g && g.none }); continue; }
        const bad = g.minGap != null && g.minGap < 1;
        res.push({ kind, i, k, h2: g.h2, labels: g.labels, minGap: g.minGap, ringed: g.ringed, bad });
        if (bad || (kind === 'PB' && i === 0 && k === '7d') || (kind === 'REC' && i === 0 && k === '1m') || (g.ringed && g.minGap != null && g.minGap < 8 && shots < 6)) {
          shots++; await pg.shot(D + `graph_${process.env.SORT ? 'sorted_' : ''}${kind}${i}_${k}${bad ? '_OVERLAP' : ''}.png`);
        }
      }
      await L.tapEl(pg, '#layer .modal [data-wkrg="1m"]'); await sleep(250);
      log(kind, i, (first && first.h2) || '', 'opened on', first && first.rg, '|', res.filter((r) => r.kind === kind && r.i === i).map((r) => r.k + ': ' + (r.none ? '(' + r.none + ')' : r.labels + ' gap ' + r.minGap)).join(' || '));
      await L.closeAll(pg);
    };
    const nRec = await pg.ev(`document.querySelectorAll('button.wkrow[data-act=wkinfo]').length`), nPb = await pg.ev(`document.querySelectorAll('button.wkbest').length`);
    log('recent rows', nRec, 'PB rows', nPb);
    if (REC) for (let i = 0; i < nRec; i++) await one('REC', 'button.wkrow[data-act=wkinfo]', i);
    for (let i = PB0; i <= Math.min(PB1, nPb - 1); i++) await one('PB', 'button.wkbest', i);
    const withRing = res.filter((r) => r.ringed), bads = res.filter((r) => r.bad);
    const minAll = Math.min(...res.filter((r) => r.minGap != null).map((r) => r.minGap)), minRing = Math.min(...withRing.filter((r) => r.minGap != null).map((r) => r.minGap));
    log(`PART C: ${res.length} graph views, ${withRing.length} with a ringed date; smallest gap between two date labels ${minAll}px (ringed views ${minRing}px); touching or overlapping: ${bads.length}`, JSON.stringify(bads.slice(0, 5)));
    log('PART C page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    require('fs').writeFileSync(D + `partC_${process.env.SORT ? 'sorted_' : ''}${REC ? 'rec_' : ''}pb${PB0}-${PB1}_log.txt`, lines.join('\n') + '\n');
    await br.close();
  }
  process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); require('fs').writeFileSync(D + 'part' + PART + '_FAIL.txt', lines.join('\n') + '\nFAIL ' + e.stack + '\n'); process.exit(1); });
