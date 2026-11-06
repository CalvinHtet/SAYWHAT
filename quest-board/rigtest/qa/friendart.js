// Friend portraits on the visit card (LEAD's 76a99a4, ROOMS's art): a phone-size card for each visit given (default the friend
// ones with art), pictured at its first pose, mid cross-fade and each next pose; the portrait's size on the card, which poses show,
// and that the feet stay on one line between poses.   VISITS=justin_dance,habibimbaps BASE=<server> OUT=<folder> node friendart.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 390, height: 844, owned: 'all', mobile: true });
  const ids = (process.env.VISITS || 'justin_dance,justin_hook').split(',');
  for (const id of ids) {
    await p.evaluate((id) => { document.querySelectorAll('#layer .modal').forEach((e) => e.remove()); const S = window.__qb.x().S; S.visit = null; window.__qbFriends.force(id); }, id);
    await p.waitForTimeout(900);
    const shots = [];
    for (const [tag, ms] of [['a', 0], ['fade', 1500], ['b', 1100], ['c', 1700], ['d', 1700]]) {
      await p.waitForTimeout(ms);
      const info = await p.evaluate(() => { const m = document.querySelector('#layer .modal .card'); const ims = [...m.querySelectorAll('.fvposes img, .vfig img')];
        return ims.map((im) => { const r = im.getBoundingClientRect(); return { src: (im.getAttribute('src') || '').slice(-26).replace(/^.*?(friend_[a-z_0-9]+).*$/, '$1'), op: +getComputedStyle(im).opacity, w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) }; }); });
      await (await p.$('#layer .modal .card')).screenshot({ path: path.join(OUT, `fart_${id}_${tag}.png`) });
      shots.push(`${tag}: ` + info.map((i) => `${i.src || 'img'} ${i.op.toFixed(2)} ${i.w}x${i.h} feet@${i.bottom}`).join(' / '));
    }
    console.log(id); shots.forEach((s) => console.log('  ' + s));
    // the order poses come in: which one is fully shown, every 250 ms for 9 s
    const seq = await p.evaluate(() => new Promise((ok) => { const out = []; const t0 = performance.now(); const tick = () => { const ims = [...document.querySelectorAll('#layer .modal .fvposes img')]; const on = ims.findIndex((im) => +getComputedStyle(im).opacity > 0.95); out.push(on); if (performance.now() - t0 < 9000) setTimeout(tick, 250); else ok(out); }; tick(); }));
    console.log('  pose shown every 250 ms (index, -1 = mid fade): ' + seq.join(''));
  }
  console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
