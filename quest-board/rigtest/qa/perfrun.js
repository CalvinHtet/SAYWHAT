// W1 runtime: each screen at phone size with the CPU slowed (4x), from a saved game (SEED=<localStorage json>, mkseed.js).
//   SEED=<file> PHASE=tabs|soak|hidden|scroll CPU=4 BASE=http://127.0.0.1:8810 bash tools/windows/node.sh rigtest/qa/perfrun.js
// tabs: for every screen (Board, Training, Shop, Crawls, Hall and its tabs, the Loft, Relics, Wheel, a fully bought room's window):
//   the switch (tap to drawn, ms), then IDLE seconds with nothing touched: main thread busy % (Performance.getMetrics
//   TaskDuration), script, layout and style time, layouts and style recalcs per second, timers and frame callbacks per second
//   (counted by wrappers put in before the app runs); then FPS seconds of frames (rAF): fps, median, p95 and worst frame time.
// soak: SOAK seconds of switching screens every 3 s; JS heap after a forced GC, DOM nodes, listeners, live intervals, every 60 s.
// hidden: the Board, then the Loft, then the Board again (does the Loft keep working off screen?), then the page itself hidden.
// scroll: a finger scroll down and up each long screen (Board, Training, Hall): frame times while it moves.
const fs = require('fs'), path = require('path');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8810', CPU = +(process.env.CPU || 4), PHASE = process.env.PHASE || 'tabs';
const SEED = process.env.SEED ? JSON.parse(fs.readFileSync(process.env.SEED, 'utf8')) : null;
const IDLE = +(process.env.IDLE || 10), FPS = +(process.env.FPS || 8), SOAK = +(process.env.SOAK || 300);
const TABS = (process.env.TABS || 'board,train,shop,away,hall,hall:chat,hall:style,hideout,room:restaurant,room:mall,trophy,wheel,board').split(',');
// counts what the app schedules, before the app runs
const HOOK = `(function(){var C=window.__qaC={iv:{},ivN:0,to:0,raf:0,ael:{win:0,doc:0,el:0},rel:{win:0,doc:0,el:0}};
var site=function(){var s=(new Error().stack||'').split('\\n');for(var i=2;i<s.length;i++){if(s[i].indexOf('__qaC')<0&&s[i].indexOf('<anonymous>')<0)return s[i].trim().replace(/^at /,'').replace(/https?:\\/\\/[^/]+\\//,'').replace(/\\?h=[0-9a-f]+/,'').slice(0,90)}return '?'};
var si=window.setInterval,ci=window.clearInterval,st=window.setTimeout,ra=window.requestAnimationFrame;
window.setInterval=function(f,ms){var id=si.apply(this,arguments);C.iv[id]=site()+' @'+ms;C.ivN++;return id};
window.clearInterval=function(id){delete C.iv[id];return ci.apply(this,arguments)};
window.setTimeout=function(){C.to++;return st.apply(this,arguments)};
window.requestAnimationFrame=function(f){C.raf++;if(window.__qaNoEmbers&&f&&f.name==='loop'&&(f.__qe===undefined?(f.__qe=/--accent/.test(String(f))):f.__qe))return 0;return ra.apply(this,arguments)};
var ae=EventTarget.prototype.addEventListener,re=EventTarget.prototype.removeEventListener;
var kind=function(t){return t===window?'win':t===document?'doc':'el'};
EventTarget.prototype.addEventListener=function(){C.ael[kind(this)]++;return ae.apply(this,arguments)};
EventTarget.prototype.removeEventListener=function(){C.rel[kind(this)]++;return re.apply(this,arguments)};
})();`;
const pct = (a, p) => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * (b.length - 1)))]; };
const r1 = (x) => Math.round(x * 10) / 10;

(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: HOOK });
  await pg.s('Performance.enable', { timeDomain: 'timeTicks' });
  if (process.env.NOEMBERS) await pg.s('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__qaNoEmbers=1' }); // only the level-10 embers loop stops (its frame callback is dropped)
  if (process.env.NOFX) await pg.s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); // the embers (level 10+) never start
  if (SEED) { await pg.go(BASE + '/version.json'); await pg.ev(`(function(d){localStorage.clear();Object.keys(d).forEach(function(k){localStorage.setItem(k,d[k])});return 1})(${JSON.stringify(SEED)})`); }
  await pg.go(BASE + '/');
  await pg.wait('!!document.querySelector(".nav button[data-v=board]")', 120000);
  await sleep(4000);
  if (CPU > 1) await pg.s('Emulation.setCPUThrottlingRate', { rate: CPU });
  await sleep(3000);
  const metrics = async () => { const m = {}; (await pg.s('Performance.getMetrics')).metrics.forEach((x) => (m[x.name] = x.value)); return m; };
  const counts = () => pg.ev('JSON.stringify({ivLive:Object.keys(__qaC.iv).length,ivN:__qaC.ivN,to:__qaC.to,raf:__qaC.raf,ael:__qaC.ael,rel:__qaC.rel})').then(JSON.parse);
  const closeModals = () => pg.ev('(function(){document.querySelectorAll("#layer .modal").forEach(function(e){e.remove()});return 1})()');
  // go to a screen: returns ms from the tap to the next frame after it drew
  const goTab = async (t) => {
    const [v, sub] = t.split(':');
    if (v === 'room') { // a room's own window (the upgrade screen), every upgrade bought
      return pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${sub}'});if(i<0)return -1;
        document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});var t0=performance.now();window.__qb.roomModal(i);
        return new Promise(function(ok){requestAnimationFrame(function(){setTimeout(function(){ok(Math.round(performance.now()-t0))},0)})})})()`);
    }
    await closeModals();
    const ms = await pg.ev(`(function(){var b=document.querySelector('.nav button[data-v="${v}"]');if(!b)return -1;var t0=performance.now();b.click();
      return new Promise(function(ok){requestAnimationFrame(function(){setTimeout(function(){ok(Math.round(performance.now()-t0))},0)})})})()`);
    if (sub) { // a tab inside the screen: the first button whose text is the tab's name
      await sleep(800);
      const ms2 = await pg.ev(`(function(){var want=${JSON.stringify(sub)};var b=[].filter.call(document.querySelectorAll('#app button,#app [data-act]'),function(e){return (e.innerText||'').trim().toLowerCase().indexOf(want)===0})[0];if(!b)return -1;var t0=performance.now();b.click();
        return new Promise(function(ok){requestAnimationFrame(function(){setTimeout(function(){ok(Math.round(performance.now()-t0))},0)})})})()`);
      return ms2;
    }
    return ms;
  };
  const idle = async (secs) => {
    const c0 = await counts(), m0 = await metrics(), w0 = Date.now();
    await sleep(secs * 1000);
    const c1 = await counts(), m1 = await metrics(), dt = (Date.now() - w0) / 1000;
    return { busyPct: r1((m1.TaskDuration - m0.TaskDuration) / dt * 100), scriptMs: Math.round((m1.ScriptDuration - m0.ScriptDuration) * 1000 / dt), layoutMs: Math.round((m1.LayoutDuration - m0.LayoutDuration) * 1000 / dt),
      styleMs: Math.round((m1.RecalcStyleDuration - m0.RecalcStyleDuration) * 1000 / dt), layouts: r1((m1.LayoutCount - m0.LayoutCount) / dt), styles: r1((m1.RecalcStyleCount - m0.RecalcStyleCount) / dt),
      timeouts: r1((c1.to - c0.to) / dt), rafs: r1((c1.raf - c0.raf) / dt), ivLive: c1.ivLive, newIntervals: c1.ivN - c0.ivN, heapMB: r1(m1.JSHeapUsedSize / 1048576), nodes: m1.Nodes, listeners: m1.JSEventListeners };
  };
  const frames = async (secs) => {
    const d = await pg.ev(`new Promise(function(ok){var a=[],l=0,t0=performance.now();function f(t){if(l)a.push(t-l);l=t;if(t-t0<${secs * 1000})requestAnimationFrame(f);else ok(a)}requestAnimationFrame(f)})`, (secs + 30) * 1000);
    return { fps: r1(d.length / secs), frameMed: r1(pct(d, 0.5)), frameP95: r1(pct(d, 0.95)), frameWorst: Math.round(Math.max(...d)), over50: d.filter((x) => x > 50).length };
  };
  const out = (o) => console.log(JSON.stringify(o));

  if (PHASE === 'tabs') {
    for (const t of TABS) {
      const sw = await goTab(t); await sleep(2000);
      const i = await idle(IDLE); const f = await frames(FPS);
      out(Object.assign({ tab: t, switchMs: sw }, i, f));
    }
  } else if (PHASE === 'hidden') {
    await goTab('board'); await sleep(2000); out(Object.assign({ step: 'board, Loft never opened' }, await idle(IDLE)));
    await goTab('hideout'); await sleep(4000); out(Object.assign({ step: 'Loft' }, await idle(IDLE)));
    await goTab('board'); await sleep(2000); out(Object.assign({ step: 'board after the Loft' }, await idle(IDLE)));
    await goTab('hideout'); await sleep(3000);
    await pg.ev('(function(){Object.defineProperty(document,"hidden",{configurable:true,get:function(){return true}});Object.defineProperty(document,"visibilityState",{configurable:true,get:function(){return "hidden"}});document.dispatchEvent(new Event("visibilitychange"));return 1})()');
    await sleep(2000); out(Object.assign({ step: 'Loft, page hidden (document.hidden true; a real browser would also stop frames)' }, await idle(IDLE)));
    await pg.ev('(function(){delete document.hidden;delete document.visibilityState;document.dispatchEvent(new Event("visibilitychange"));return 1})()');
  } else if (PHASE === 'soak') {
    const cyc = ['board', 'train', 'shop', 'away', 'hall', 'hideout', 'trophy', 'wheel'];
    const t0 = Date.now(); let k = 0, next = 0, sws = [];
    const sample = async (tag) => { await pg.s('HeapProfiler.collectGarbage'); await sleep(300); const m = await metrics(), c = await counts(), dc = await pg.s('Memory.getDOMCounters');
      out({ t: Math.round((Date.now() - t0) / 1000), tag, heapMB: r1(m.JSHeapUsedSize / 1048576), nodes: dc.nodes, docs: dc.documents, listeners: dc.jsEventListeners, ivLive: c.ivLive, ivMade: c.ivN, aelWin: c.ael.win - c.rel.win, aelDoc: c.ael.doc - c.rel.doc, switchMed: pct(sws, 0.5), switchP95: pct(sws, 0.95) }); sws = []; };
    await goTab('board'); await sample('start');
    while (Date.now() - t0 < SOAK * 1000) {
      sws.push(await goTab(cyc[k++ % cyc.length])); await sleep(3000);
      if (Date.now() - t0 > next + 60000) { next += 60000; await goTab('board'); await sleep(1500); await sample('board'); }
    }
    await goTab('board'); await sleep(1500); await sample('end');
    const ivs = await pg.ev('JSON.stringify(Object.values(__qaC.iv).reduce(function(a,s){a[s]=(a[s]||0)+1;return a},{}))');
    out({ liveIntervalsBySite: JSON.parse(ivs) });
  } else if (PHASE === 'scroll') {
    for (const t of (process.env.SCROLLTABS || 'board,train,hall,hall:chat,shop').split(',')) {
      await goTab(t); await sleep(2500);
      const h = await pg.ev('(function(){var s=document.scrollingElement;return s.scrollHeight})()');
      const rec = pg.ev(`new Promise(function(ok){var a=[],l=0,t0=performance.now();function f(t){if(l)a.push(t-l);l=t;if(t-t0<6000)requestAnimationFrame(f);else ok(a)}requestAnimationFrame(f)})`, 60000);
      await pg.s('Input.synthesizeScrollGesture', { x: 195, y: 600, yDistance: -Math.min(h, 6000), speed: 1600, gestureSourceType: 'touch', repeatCount: 0 });
      await pg.s('Input.synthesizeScrollGesture', { x: 195, y: 300, yDistance: Math.min(h, 6000), speed: 1600, gestureSourceType: 'touch', repeatCount: 0 });
      const d = await rec;
      out({ tab: t, pageHeight: h, nodes: (await metrics()).Nodes, fps: r1(d.length / 6), frameMed: r1(pct(d, 0.5)), frameP95: r1(pct(d, 0.95)), frameWorst: Math.round(Math.max(...d)), over50: d.filter((x) => x > 50).length });
    }
  } else if (PHASE === 'fxab') { // the level effects one by one on one screen (FXTAB, default board): body fx-* classes and embers
    await goTab(process.env.FXTAB || 'board'); await sleep(3000);
    const cls = await pg.ev('[].filter.call(document.body.classList,function(c){return c.indexOf("fx-")===0})');
    const setCls = (list) => pg.ev(`(function(l){[].slice.call(document.body.classList).forEach(function(c){if(c.indexOf("fx-")===0)document.body.classList.remove(c)});l.forEach(function(c){document.body.classList.add(c)});return 1})(${JSON.stringify(list)})`);
    const m = async (label) => { await sleep(1500); const i = await idle(IDLE); out(Object.assign({ step: label }, i)); return i.busyPct; };
    await m('all effects (' + cls.length + ' fx classes + embers)');
    await setCls([]); await m('fx classes off, embers on');
    await setCls(cls); await pg.ev('window.__qaNoEmbers=1'); await sleep(500); await m('fx classes on, embers stopped');
    await setCls([]); const base = await m('fx classes off, embers stopped');
    for (const c of cls) { await setCls([c]); await m('only ' + c); }
    await setCls(cls);
  } else if (PHASE === 'tap') { // ticking quests on the Board: tap to the next frame, 12 taps (on, off) on quests not yet done
    await goTab('board'); await sleep(2500);
    const ids = await pg.ev('[].slice.call(document.querySelectorAll("button.qmain[data-act=toggle][aria-pressed=false]")).slice(0,6).map(function(b){return b.dataset.id})');
    const times = [];
    for (const id of ids.concat(ids)) {
      const ms = await pg.ev(`(function(){var b=document.querySelector('button.qmain[data-act=toggle][data-id="${id}"]');if(!b)return -1;var t0=performance.now();b.click();
        return new Promise(function(ok){requestAnimationFrame(function(){setTimeout(function(){ok(Math.round(performance.now()-t0))},0)})})})()`);
      times.push(ms); await sleep(700); await closeModals(); await sleep(300);
    }
    out({ tab: 'board', quests: await pg.ev('document.querySelectorAll("button.qmain").length'), nodes: (await metrics()).Nodes, tapMs: times, tapMed: pct(times.filter((x) => x >= 0), 0.5), tapWorst: Math.max(...times) });
  }
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 4).join(' | '));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
