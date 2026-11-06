// The bed's sleeping figure (QBLoft.sleeper, what the Bedroom bed draws when the player lies down) for hat and face pieces: LEAD's b85b038
// keeps sm_halomask and sm_halo on in bed and hides face pieces under the mask.   BASE=<server> OUT=<folder> node sleeper.js
const fs = require('fs');
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  for (const [hat, face] of [['gx_sm_halomask', 'gx_h_shades'], ['gx_sm_halo', ''], ['gx_nc_cap', ''], ['', 'gx_h_shades']]) {
    const r = await p.evaluate(async ([hat, face]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const it = (id) => x.SHOP.find((q) => q[0] === id);
      S.eq = {}; S.owned = S.owned || {}; [hat, face].filter(Boolean).forEach((id) => { const q = it(id); S.owned[id] = true; S.eq[q[1]] = id; }); x.render();
      const L = window.__qb.lookOf(); const ch = L.rig || L; QBLoft.warm(ch); let u = null; for (let k = 0; k < 40 && !u; k++) { u = QBLoft.sleeper(ch, 'bed0'); if (!u) await w(250); }
      return { eq: JSON.stringify(S.eq), u: u ? (typeof u === 'string' ? u : null) : null }; }, [hat, face]);
    if (!r.u) { console.log(hat || '(no hat)', face, 'sleeper: none'); continue; }
    const name = `sleeper_${hat || 'nohat'}${face ? '_' + face : ''}.png`;
    if (/^data:/.test(r.u)) fs.writeFileSync((process.env.OUT || 'qa-out') + '/' + name, Buffer.from(r.u.split(',')[1], 'base64'));
    else { const buf = await p.evaluate(async (u) => { const bl = await (await fetch(u)).blob(); const a = new Uint8Array(await bl.arrayBuffer()); return Array.from(a); }, r.u); fs.writeFileSync((process.env.OUT || 'qa-out') + '/' + name, Buffer.from(buf)); }
    console.log(hat || '(no hat)', face, 'saved', name);
  }
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
