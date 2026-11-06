// The Mall–Karaoke shortcut (ROOMS's c829e7e): arrows with and without Bowling, the shortcut walked both ways, and gone once Bowling is owned.
//   BASE=<server> node karaokeshortcut.js
const { open } = require('./lib.js');
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 900, owned: 'none' });
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)), out = {};
    const set = (list) => { S.base.slots = S.base.slots.filter((s) => !['bowling', 'karaoke', 'mall', 'theater', 'arcade'].includes(s.t)); list.forEach((t) => S.base.slots.push({ t, a: {}, st: 0, pend: 0 })); };
    const arrows = async (k) => { document.querySelectorAll('#layer .modal,.dropsplash').forEach((e) => e.remove()); window.__qb.roomModal(S.base.slots.findIndex((s) => s.t === k)); await w(350); return [...document.querySelectorAll('.rmodal .prtb-b')].map((e) => e.textContent.trim() + '(' + e.parentElement.className.replace('prtb ', '') + ')'); };
    const title = () => (document.querySelector('.rmodal .rm-title') || {}).textContent || '';
    set(['mall', 'bowling', 'karaoke']); out.withBowling = { mall: await arrows('mall'), bowling: await arrows('bowling'), karaoke: await arrows('karaoke') };
    set(['mall', 'karaoke']); out.noBowling = { mall: await arrows('mall'), karaoke: await arrows('karaoke') };
    await arrows('mall'); [...document.querySelectorAll('.rmodal .prtb-b')].find((e) => /Karaoke/.test(e.textContent)).click(); await w(450); const a1 = title();
    [...document.querySelectorAll('.rmodal .prtb-b')].find((e) => /Mall/.test(e.textContent)).click(); await w(450); out.walk = 'Mall -> ' + a1 + ' -> ' + title();
    // then buy Bowling: the shortcut goes
    set(['mall', 'karaoke', 'bowling']); out.afterBowling = { mall: await arrows('mall'), karaoke: await arrows('karaoke') };
    return out; });
  console.log(JSON.stringify(r, null, 1)); console.log('page errors', errs.length, errs.slice(0, 2));
  await b.close();
})();
