// Does a Room style change the room? The real room window (roomModal) of one room, fully bought, once per style id, at noon: a picture
// each and a hash of its pixels, so styles that draw the same room show up. ROOM=restaurant STYLES=lino,bistro BASE=<server> OUT=<folder>
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 900, height: 900, owned: 'all' });
  const ROOM = process.env.ROOM || 'restaurant';
  await p.evaluate((h) => { const now = new Date(Date.now()), t = new Date(now); t.setHours(h, 0, 0, 0); window.__qbShift = (window.__qbShift || 0) + (t - now); }, 13);
  const styles = (process.env.STYLES || 'lino,bistro,brickbar,modern,trattoria,marble').split(',');
  const seen = {};
  for (const ds of styles) {
    const info = await p.evaluate(async ([R, ds]) => { const w = (ms) => new Promise((o) => setTimeout(o, ms)); const x = window.__qb.x(), S = x.S; const k = S.base.slots.findIndex((s) => s && s.t === R); const r = S.base.slots[k];
      x.ADDONS[R].forEach((u) => { if (u[3] && (u[3].retired || u[3].opens)) return; r.a[u[0]] = 1; }); r.ds = ds; r.du = r.du || {}; r.du[ds] = 1; x.persist();
      document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(k); await w(2500);
      const st = [...document.querySelectorAll('.rmodal .dstyles *')].filter((e) => e.classList && (e.classList.contains('on') || e.getAttribute('aria-pressed') === 'true')).map((e) => e.innerText.trim()).join('|');
      return { k, chosen: st.slice(0, 60) }; }, [ROOM, ds]);
    const buf = await (await p.$('.rmodal .rbig')).screenshot({ path: path.join(OUT, `win_${ROOM}_${ds}.png`) });
    const h = crypto.createHash('md5').update(buf).digest('hex').slice(0, 8); (seen[h] = seen[h] || []).push(ds);
    console.log(`${ds.padEnd(10)} picture ${h}  style list shows chosen: ${info.chosen || '?'}`);
  }
  console.log('identical groups:', Object.values(seen).filter((g) => g.length > 1).map((g) => g.join('=')).join('; ') || 'none');
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
