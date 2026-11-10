// rc-0.89 QA, Wheel check 2: force each of the 16 segments (Math.random's first call stubbed), where the wheel stops and what it pays.
// Part A (real timing, the 3.6 s result timer stretched to 6 s so the stopped wheel can be shot): one spin per segment, landing random.
// Part B (fast timing): every segment with the landing's random forced to 0 and to 0.999999 (both edges), plus 20 random landings.
const L = require('./rc089_wheel_lib.js');
const CUM = [20, 21, 33, 34, 54, 55, 61, 62, 78, 79, 85, 86, 95, 96, 99, 100];
const NAMES = ['300', 'sliver', '1000', 'sliver', '500', 'sliver', '2500', 'sliver', '750', 'sliver', 'freeze', 'sliver', '1500', 'sliver', '5000', 'sliver'];
const LOG = L.OUTW + '/w2_segments.jsonl';
// one spin: first Math.random = segment's midpoint, later ones = rest (null: real random). Returns what was drawn and paid.
const SPIN = (idx, rest) => `(function(){var x=window.__qb.x(),S=x.S;S.wheel='';S.freezes=0;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();
  var lo=${idx ? CUM[idx - 1] : 0},hi=${CUM[idx]},orig=Math.random,calls=[],first=null;
  Math.random=function(){var v;if(!calls.length){v=(lo+hi)/2/100;first=(new Error().stack||'').split('\\n').slice(1,4).join(' / ')}else v=${rest == null ? 'orig()' : rest};calls.push(v);return v};
  var b0={coins:S.coins,fr:S.freezes,owned:Object.keys(S.owned).filter(function(k){return S.owned[k]})};
  var btn=document.querySelector('[data-act=spin]');if(!btn||btn.disabled){Math.random=orig;return {err:'no spin button '+(btn&&btn.outerHTML)}}
  window.__qaPops.length=0;btn.click();Math.random=orig;
  var w=document.getElementById('wheel'),tr=w.style.transform,m=/rotate\\(([-0-9.]+)deg\\)/.exec(tr),rot=m?+m[1]:null,ang=rot==null?null:((360-rot%360)%360);
  var nOwned=Object.keys(S.owned).filter(function(k){return S.owned[k]&&b0.owned.indexOf(k)<0});
  return {idx:${idx},rot:rot,ang:ang,calls:calls.length,firstFrom:first,res:S.wheelRes,dCoins:S.coins-b0.coins,dFr:S.freezes-b0.fr,newItems:nOwned,dayKey:S.wheel}})()`;
const deg = (i) => (i % 2 ? 4 : 41), start = (i) => { let a = 0; for (let k = 0; k < i; k++) a += deg(k); return a; };
const expectPay = (i, r) => {
  if (i % 2) return r.newItems.length === 1 && / from [A-ZØ&\- ]+ \(/.test(r.res) && r.dCoins === 0;
  if (i === 10) return r.dFr === 1 && r.dCoins === 0 && r.res === 'Streak freeze';
  const c = +NAMES[i]; return r.dCoins === c && r.dFr === 0 && r.newItems.length === 0;
};
(async () => {
  const { br, pg } = await L.open();
  await L.newPlayer(pg); await L.sleep(800); await L.closeModals(pg);
  await L.nav(pg, 'wheel'); await L.sleep(1000); await L.closeModals(pg);
  await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(300);
  const rect = await pg.ev(`(function(){var r=document.querySelector('.wheelwrap').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()`);
  const clip = { x: rect[0] - 14, y: rect[1] - 16, width: rect[2] + 28, height: rect[3] + 30 };
  const bad = [];
  // Part A
  await pg.ev('window.__qaSpinDelay=6000;1');
  for (let i = 0; i < 16; i++) {
    const r = await pg.ev(SPIN(i, null));
    await L.sleep(4100); // transition is 3.4 s
    await pg.shot(L.OUTW + `/w2_seg${String(i).padStart(2, '0')}_${NAMES[i]}.png`, clip);
    await pg.wait('window.__qaPops.some(function(p){return p.txt.indexOf("Wheel:")===0})', 8000);
    r.pop = await pg.ev('(window.__qaPops.filter(function(p){return p.txt.indexOf("Wheel:")===0})[0]||{}).txt');
    r.lastResult = await pg.ev(`(function(){var n=[].filter.call(document.querySelectorAll('.note'),function(e){return e.textContent.indexOf('Last result')===0})[0];return n&&n.textContent})()`);
    r.btnAfter = await pg.ev(`(function(){var b=document.querySelector('[data-act=spin]');return b&&(b.textContent+(b.disabled?' [disabled]':''))})()`);
    const a0 = start(i), wd = deg(i);
    r.inSeg = r.ang > a0 && r.ang < a0 + wd; r.edgeDist = Math.round(Math.min(r.ang - a0, a0 + wd - r.ang) * 100) / 100; r.payOK = expectPay(i, r);
    r.firstIsSpin = /spin/.test(r.firstFrom || '');
    if (!r.inSeg || !r.payOK || !r.firstIsSpin) bad.push(r);
    L.out(LOG, Object.assign({ part: 'A' }, r));
    console.log('A', i, NAMES[i], 'ang', r.ang, 'edge', r.edgeDist, 'pay', r.res, r.dCoins, r.dFr, r.newItems.join(','), '|', r.pop, '|', r.btnAfter, r.payOK && r.inSeg ? 'OK' : 'BAD');
  }
  // the wheel after the result: is it still showing where it stopped?
  await pg.shot(L.OUTW + '/w2_after_result.png', clip);
  // Part B: edges and random landings, fast
  await pg.ev('window.__qaSpinDelay=0;1');
  const run = async (i, rest) => { const r = await pg.ev(SPIN(i, rest)); await pg.wait(`!!document.querySelector('[data-act=spin][disabled]')&&window.__qaPops.some(function(p){return p.txt.indexOf("Wheel:")===0})`, 5000); return r; };
  const stats = {};
  for (let i = 0; i < 16; i++) {
    const a0 = start(i), wd = deg(i), s = (stats[i] = { min: 999, max: -1, n: 0, bad: 0 });
    for (const rest of ['0', '0.999999', ...Array(20).fill(null)]) {
      const r = await run(i, rest);
      const ok = r.ang > a0 && r.ang < a0 + wd && expectPay(i, r);
      s.n++; s.min = Math.min(s.min, r.ang - a0); s.max = Math.max(s.max, r.ang - a0); if (!ok) { s.bad++; bad.push(Object.assign({ rest }, r)); }
      if (rest === '0' || rest === '0.999999') { // edge shots for a slice and a sliver
        if (i === 0 || i === 1 || i === 15) {
          // re-show the stopped wheel: set the same transform without transition and shoot
          await pg.ev(`(function(){var w=document.getElementById('wheel');w.style.transition='none';w.style.transform='rotate(${r.rot}deg)';return 1})()`); await L.sleep(200);
          await pg.shot(L.OUTW + `/w2_edge_seg${String(i).padStart(2, '0')}_${rest === '0' ? 'lo' : 'hi'}.png`, clip);
          await pg.ev(`(function(){var w=document.getElementById('wheel');w.style.transition='';w.style.transform='';return 1})()`);
        }
      }
    }
    s.min = Math.round(s.min * 100) / 100; s.max = Math.round(s.max * 100) / 100;
    console.log('B', i, NAMES[i], `seg ${a0}..${a0 + wd}`, 'landed offset', s.min, '..', s.max, 'of', wd, 'bad', s.bad);
  }
  L.out(LOG, { part: 'B', stats });
  console.log('BAD', bad.length, JSON.stringify(bad.slice(0, 5)));
  console.log('errors', pg.errs.length, pg.errs.slice(0, 5));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
