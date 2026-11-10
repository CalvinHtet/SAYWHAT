// W1: reads a Chrome trace (perfload.js TRACE=<file>) and prints where the page's main thread spent its time: self time by kind
// (script run, compile and parse, style and layout, paint, HTML, GC, image decode, other), per script file (evaluate, compile),
// the longest tasks, and the background threads' compile and parse.   bash tools/windows/node.sh rigtest/qa/traceparse.js <trace.json>
const fs = require('fs');
const T = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const ev = T.traceEvents || T;
// the renderer main thread that ran our page: the CrRendererMain with the most EvaluateScript time
const names = {}; ev.filter((e) => e.ph === 'M' && e.name === 'thread_name').forEach((e) => (names[e.pid + ':' + e.tid] = e.args.name));
const evalBy = {}; ev.filter((e) => e.name === 'EvaluateScript' && e.ph === 'X').forEach((e) => { const k = e.pid + ':' + e.tid; evalBy[k] = (evalBy[k] || 0) + e.dur; });
const main = Object.keys(evalBy).filter((k) => names[k] === 'CrRendererMain').sort((a, b) => evalBy[b] - evalBy[a])[0];
const [mpid] = main.split(':');
const KIND = (n) => /^(v8\.compile|V8\.CompileCode|v8\.compileModule|V8\.CompileLazy|v8\.parseOnBackground|V8\.ParseProgram|V8\.ParseFunction|v8\.produceCache|v8\.deserialize|V8\.Deserialize|V8\.CompileEager|V8\.ScriptCompiler)/i.test(n) ? 'compile+parse'
  : /^(EvaluateScript|FunctionCall|TimerFire|EventDispatch|v8\.run|v8\.callFunction|RunMicrotasks|FireAnimationFrame|FireIdleCallback|V8\.Execute|v8\.execute|XHRReadyStateChange|XHRLoad|V8\.Run)/.test(n) ? 'script'
  : /^(UpdateLayoutTree|RecalculateStyles|Layout|InvalidateLayout|ScheduleStyleRecalculation|ParseAuthorStyleSheet|UpdateLayout)/.test(n) ? 'style+layout'
  : /^(Paint|PaintImage|CompositeLayers|UpdateLayerTree|PrePaint|Layerize|RasterTask|Commit|PaintSetup|UpdateLayer)/.test(n) ? 'paint+composite'
  : /^(ParseHTML)/.test(n) ? 'html'
  : /(GC|MinorGC|MajorGC|V8\.GC|BlinkGC|ThreadState|CppGC)/.test(n) ? 'gc'
  : /(Decode|ImageDecode|Resize)/i.test(n) ? 'image decode' : 'other';
const mainEv = ev.filter((e) => e.pid + ':' + e.tid === main && (e.ph === 'X') && e.dur != null).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
// self time with a stack
const self = {}, byName = {}; const st = [];
for (const e of mainEv) {
  while (st.length && st[st.length - 1].ts + st[st.length - 1].dur <= e.ts) st.pop();
  if (st.length) st[st.length - 1]._kid = (st[st.length - 1]._kid || 0) + Math.min(e.dur, st[st.length - 1].ts + st[st.length - 1].dur - e.ts);
  st.push(e);
}
for (const e of mainEv) { if (e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask') continue; const s = Math.max(0, e.dur - (e._kid || 0)); const k = KIND(e.name); self[k] = (self[k] || 0) + s; byName[e.name] = (byName[e.name] || 0) + s; }
const ms = (x) => Math.round(x / 1000);
// top-level tasks only (a RunTask inside ThreadControllerImpl::RunTask is the same task)
const tasks = (() => { const all = mainEv.filter((e) => e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask'); const out = []; let end = -1; for (const e of all) { if (e.ts >= end) { out.push(e); end = e.ts + e.dur; } } return out; })();
const t0 = Math.min(...tasks.map((e) => e.ts));
console.log('main thread ' + main + ' (' + names[main] + '), tasks ' + tasks.length + ', busy ' + ms(tasks.reduce((a, e) => a + e.dur, 0)) + ' ms');
console.log('self time by kind (ms): ' + Object.entries(self).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + ms(v)).join(', '));
console.log('top event names (self ms): ' + Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => k + ' ' + ms(v)).join(', '));
const per = {};
const urlOf = (e) => ((e.args && (e.args.data && (e.args.data.url || e.args.data.fileName) || e.args.fileName || e.args.url)) || '').replace(/^.*\//, '').replace(/\?h=.*/, '');
ev.filter((e) => e.pid == mpid && e.ph === 'X' && /^(EvaluateScript|v8\.compile|v8\.parseOnBackground|v8\.produceCache|v8\.deserializeOnBackground|V8\.CompileCode)$/.test(e.name)).forEach((e) => {
  const u = urlOf(e) || '(none)', k = e.name + (e.pid + ':' + e.tid === main ? '' : ' (bg)'); per[u] = per[u] || {}; per[u][k] = (per[u][k] || 0) + e.dur; });
console.log('per file (ms):');
Object.entries(per).sort((a, b) => (b[1].EvaluateScript || 0) - (a[1].EvaluateScript || 0)).slice(0, 14).forEach(([u, o]) => console.log('  ' + u + ': ' + Object.entries(o).map(([k, v]) => k + ' ' + ms(v)).join(', ')));
console.log('longest tasks (start ms from first task, ms): ' + tasks.filter((e) => e.dur > 50000).sort((a, b) => b.dur - a.dur).slice(0, 12).map((e) => ms(e.ts - t0) + '+' + ms(e.dur)).join(', '));
console.log('tasks over 50 ms: ' + tasks.filter((e) => e.dur > 50000).length + ', total ' + ms(tasks.filter((e) => e.dur > 50000).reduce((a, e) => a + e.dur, 0)) + ' ms');
// what the longest tasks did, by self time
for (const L of tasks.filter((e) => e.dur > 50000).sort((a, b) => b.dur - a.dur).slice(0, 5)) {
  const inn = mainEv.filter((e) => e.ts >= L.ts && e.ts + e.dur <= L.ts + L.dur && e !== L);
  const agg = {}; inn.forEach((e) => { const s = Math.max(0, e.dur - (e._kid || 0)); const n = e.name + (urlOf(e) ? ' ' + urlOf(e) : '') + (e.args && e.args.data && e.args.data.functionName ? ' ' + e.args.data.functionName : ''); agg[n] = (agg[n] || 0) + s; });
  console.log('  task at ' + ms(L.ts - t0) + ' (' + ms(L.dur) + ' ms): ' + Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => k + ' ' + ms(v)).join('; '));
}
