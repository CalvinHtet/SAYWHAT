// A door both ways, in the live windows (doors.js reads portal() statically and cannot read a door whose position is a function, as
// the Restaurant's Garden door is since ROOMS's e884ffd). Opens room A's window, taps its door to B, checks B's window opened, taps
// B's door back, checks A again.   A=restaurant B=garden BASE=<server> node doorlive.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  const A = process.env.A || 'restaurant', B = process.env.B || 'garden';
  const r = await p.evaluate(async ([A, B]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const name = (t) => x.ROOMT[t].name;
    const title = () => ((document.querySelector('.rmodal .rm-title, .rmodal h2') || {}).innerText || '').trim();
    const tap = (t) => { const bt = [...document.querySelectorAll('.rmodal button, .rmodal [data-act]')].find((e) => new RegExp(name(t), 'i').test(e.innerText || '') && e.offsetParent); if (!bt) return false; bt.click(); return true; };
    const k = S.base.slots.findIndex((s) => s && s.t === A); document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(1500);
    const t0 = title(); const go = tap(B); await w(1500); const t1 = title(); const back = tap(A); await w(1500); const t2 = title();
    return { t0, go, t1, back, t2 }; }, [A, B]);
  console.log(`${A} window "${r.t0}" -> its ${B} door ${r.go ? 'tapped' : 'MISSING'} -> "${r.t1}" -> its ${A} door ${r.back ? 'tapped' : 'MISSING'} -> "${r.t2}"`);
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
