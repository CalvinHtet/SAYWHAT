// rc-0.90 QA (d8869a0), re-check of w-wheel 1c8f815: (1) the labels on the left half read the right way up (wheel at rest); (2) after
// the result (the real 3.6 s timer, nothing stretched) the wheel stays where it landed instead of snapping back to 0, also after a
// redraw and a trip to another tab; (3) forced segments still land inside them: 3 slices and 1 sliver. Screenshots of each.
//   BASE=http://127.0.0.1:8816 bash tools/windows/node.sh rigtest/qa/rc090_fix_wheel.js
const L = require('./rc090_fix_wheel_lib.js');
const CUM = [20, 21, 33, 34, 54, 55, 61, 62, 78, 79, 85, 86, 95, 96, 99, 100];
const NAMES = ['300', 'sliver', '1000', 'sliver', '500', 'sliver', '2500', 'sliver', '750', 'sliver', 'freeze', 'sliver', '1500', 'sliver', '5000', 'sliver'];
const deg = (i) => (i % 2 ? 4 : 41), start = (i) => { let a = 0; for (let k = 0; k < i; k++) a += deg(k); return a; };
const LOG = L.OUTW + '/wheel_log.txt';
const out = []; const say = (...a) => { const s = a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' '); console.log(s); out.push(s); };
// one spin with segment idx forced (first Math.random), the landing random real
const SPIN = (idx) => `(function(){var x=window.__qb.x(),S=x.S;S.wheel='';S.freezes=0;document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.render();
  var w0=document.getElementById('wheel'),before=w0&&w0.style.transform;
  var lo=${idx ? CUM[idx - 1] : 0},hi=${CUM[idx]},orig=Math.random,n=0;Math.random=function(){return n++?orig():(lo+hi)/2/100};
  var c0=S.coins,f0=S.freezes,o0=Object.keys(S.owned).filter(function(k){return S.owned[k]}).length;
  var btn=document.querySelector('[data-act=spin]');if(!btn||btn.disabled){Math.random=orig;return {err:'no spin button'}}
  window.__qaPops.length=0;btn.click();Math.random=orig;
  var w=document.getElementById('wheel'),m=/rotate\\(([-0-9.]+)deg\\)/.exec(w.style.transform),rot=m?+m[1]:null;
  return {idx:${idx},before:before,rot:rot,ang:rot==null?null:((360-rot%360)%360),res:S.wheelRes,dCoins:S.coins-c0,dFr:S.freezes-f0,dOwned:Object.keys(S.owned).filter(function(k){return S.owned[k]}).length-o0}})()`;
// the wheel as drawn now: inline transform, computed rotation, the angle under the pointer, the labels' reading angles on screen
const NOW = `(function(){var w=document.getElementById('wheel');if(!w)return null;var cs=getComputedStyle(w).transform,a=0;if(cs&&cs!=='none'){var p=cs.match(/matrix\\(([^)]+)\\)/)[1].split(',').map(Number);a=Math.atan2(p[1],p[0])*180/Math.PI}
  var ang=((360-((a%360)+360)%360)%360);
  var labs=[].map.call(w.querySelectorAll('span'),function(s){var t=getComputedStyle(s).transform,b=0;if(t&&t!=='none'){var q=t.match(/matrix\\(([^)]+)\\)/)[1].split(',').map(Number);b=Math.atan2(q[1],q[0])*180/Math.PI}
    var r=((a+b)%360+540)%360-180,wr=w.getBoundingClientRect(),sr=s.getBoundingClientRect();
    return {t:s.textContent,read:Math.round(r),upright:Math.abs(r)<=90.01,side:(sr.left+sr.width/2)<(wr.left+wr.width/2)?'L':'R'}});
  return {inline:w.style.transform,rotNow:Math.round(a*100)/100,angUnderPointer:Math.round(ang*100)/100,labels:labs}})()`;
(async () => {
  const { br, pg } = await L.open();
  await L.newPlayer(pg); await L.sleep(1500); await L.closeModals(pg);
  await L.nav(pg, 'wheel'); await L.sleep(1200); await L.closeModals(pg);
  await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(400);
  const rect = await pg.ev(`(function(){var r=document.querySelector('.wheelwrap').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()`);
  const clip = { x: rect[0] - 14, y: rect[1] - 16, width: rect[2] + 28, height: rect[3] + 30 };
  // (1) at rest
  const rest = await pg.ev(NOW);
  say('REST', rest.inline || '(no transform)', 'labels:', rest.labels.map((l) => l.t + ' ' + l.side + ' read ' + l.read + (l.upright ? '' : ' UPSIDE-DOWN')).join(' | '));
  say('REST all labels upright:', rest.labels.every((l) => l.upright));
  await pg.shot(L.OUTW + '/fw_rest_labels.png', clip);
  // (2)+(3) forced spins with the real timer
  const bad = [];
  for (const idx of [0, 6, 14, 7]) {
    await L.nav(pg, 'wheel'); await L.sleep(500); await L.closeModals(pg);
    await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(300);
    const r = await pg.ev(SPIN(idx)); const t0 = Date.now();
    await L.sleep(1700); await pg.shot(L.OUTW + `/fw_seg${String(idx).padStart(2, '0')}_${NAMES[idx]}_midspin.png`, clip);
    await pg.wait('window.__qaPops.some(function(p){return p.txt.indexOf("Wheel:")===0})', 9000);
    const popAt = Date.now() - t0; await L.sleep(1200);
    const after = await pg.ev(NOW);
    await pg.shot(L.OUTW + `/fw_seg${String(idx).padStart(2, '0')}_${NAMES[idx]}_after_result.png`, clip);
    const a0 = start(idx), wd = deg(idx), inSeg = r.ang > a0 && r.ang < a0 + wd, stays = Math.abs(after.angUnderPointer - r.ang) < 0.05 || Math.abs(Math.abs(after.angUnderPointer - r.ang) - 360) < 0.05;
    const pay = idx % 2 ? r.dOwned === 1 && r.dCoins === 0 : r.dCoins === +NAMES[idx];
    say(`SPIN seg ${idx} (${NAMES[idx]}, ${a0}..${a0 + wd}deg): started from "${r.before || 'none'}", to rotate(${r.rot}deg), landed at ${r.ang && r.ang.toFixed(2)}deg, inside ${inSeg} | result pop after ${popAt} ms: "${r.res}" coins +${r.dCoins} items +${r.dOwned} pay ok ${pay} | 1.2 s after the result: inline "${after.inline}", under the pointer ${after.angUnderPointer}deg, stays ${stays} | labels upright now ${after.labels.filter((l) => l.upright).length}/${after.labels.length}`);
    if (!inSeg || !stays || !pay) bad.push({ idx, inSeg, stays, pay });
    // a redraw (render) and a trip to another tab: still there?
    await pg.ev('window.__qb.x().render();1'); await L.sleep(300);
    const rr = await pg.ev(NOW);
    await L.nav(pg, 'board'); await L.sleep(900); await L.nav(pg, 'wheel'); await L.sleep(900); await L.closeModals(pg);
    const tb = await pg.ev(NOW);
    say(`   after render(): ${rr.angUnderPointer}deg; after Board and back: ${tb.angUnderPointer}deg`);
    if (Math.abs(rr.angUnderPointer - r.ang) > 0.05 || Math.abs(tb.angUnderPointer - r.ang) > 0.05) bad.push({ idx, redraw: rr.angUnderPointer, tabTrip: tb.angUnderPointer });
  }
  await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(300);
  await pg.shot(L.OUTW + '/fw_after_tab_trip.png', clip);
  // a reload (in-memory WHEELROT): what does the wheel show?
  await pg.ev('window.__qb.x().persist();1'); await L.sleep(500);
  await pg.go(L.BASE + '/'); await pg.wait('!!(window.__qb && window.__qb.x && document.querySelector("#app"))', 120000); await L.sleep(2000); await L.closeModals(pg);
  await L.nav(pg, 'wheel'); await L.sleep(1000); await L.closeModals(pg);
  const rl = await pg.ev(NOW); say('after a reload: under the pointer', rl.angUnderPointer, 'inline', rl.inline || '(none)', 'labels upright', rl.labels.every((l) => l.upright));
  await pg.ev(`document.getElementById('wheel').scrollIntoView({block:'center'})`); await L.sleep(300);
  await pg.shot(L.OUTW + '/fw_after_reload.png', clip);
  say('BAD', bad.length, bad);
  say('page errors', pg.errs.length, pg.errs.slice(0, 5));
  L.fs.writeFileSync(LOG, out.join('\n') + '\n');
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); L.fs.writeFileSync(LOG, out.join('\n') + '\nFAIL ' + e.stack + '\n'); process.exit(1); });
