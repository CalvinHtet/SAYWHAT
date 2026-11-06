// Can every room be bought to the end through its own window? Each room starts empty at level LV (default 60, every gate passed,
// coins to spare); QA taps the window's first Buy button again and again (data-act="raddon"), the way a player would, until none
// is left. A room is stuck if upgrades remain (not retired, not trophy-only) while the window offers nothing to buy; it prints what
// the window shows then. No pictures: this only checks the buying path.   BASE=<server> [LV=60] node stuckscan.js [room,room]
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: process.env.OWNED || 'all' });
  const LV = +(process.env.LV || 60);
  const only = process.argv[2] ? process.argv[2].split(',') : null;
  const rooms = await p.evaluate(([LV, only]) => { const x = window.__qb.x(), S = x.S; S.xp = x.cum(LV); S.coins = 1e7; S.base.served = 1e7;
    return S.base.slots.map((s, i) => s && s.t).filter((t) => t && x.ADDONS[t] && x.ADDONS[t].length && (!only || only.includes(t))); }, [LV, only]);
  let stuck = 0;
  for (const t of rooms) {
    const r = await p.evaluate(async (t) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S;
      const k = S.base.slots.findIndex((s) => s && s.t === t); const r = S.base.slots[k]; r.a = {}; let n = 0;
      for (let g = 0; g < 200; g++) { S.coins = 1e7; document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(120);
        document.querySelectorAll('.rmodal details').forEach((d) => { d.open = true; });
        const btn = [...document.querySelectorAll('.rmodal [data-act="raddon"]')].find((e) => !e.disabled); if (!btn) break;
        btn.click(); await w(80); n++; }
      const left = x.ADDONS[t].filter((u) => !r.a[u[0]] && !(u[3] && (u[3].retired || u[3].trophy || u[3].opens && S.base.slots.some((s) => s && s.t === u[3].opens))));
      const m = document.querySelector('.rmodal'); const cards = m ? [...m.querySelectorAll('.addon')].map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 70)).slice(0, 6) : [];
      document.querySelectorAll('#layer .modal').forEach((e) => e.remove());
      return { t, n, left: left.map((u) => u[0] + (u[3] && u[3].lv ? '@' + u[3].lv : '')), cards }; }, t);
    if (r.left.length) { stuck++; console.log(`STUCK ${r.t}: bought ${r.n}, ${r.left.length} left: ${r.left.slice(0, 8).join(' ')}`); r.cards.forEach((c) => console.log('    card: ' + c)); }
    else console.log(`ok    ${r.t}: all ${r.n} bought`);
  }
  console.log(`${rooms.length} rooms at level ${LV}, ${stuck} stuck; page errors ${errs.length}`, errs.slice(0, 2));
  await b.close();
})();
