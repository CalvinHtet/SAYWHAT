// QA: the Karaoke Disco Ball retired (bdb442d1). A save that owns every Karaoke upgrade, ka_disco included, and one that owns all but
// ka_disco: the room opens without errors, the ball is not drawn, the room's upgrade list does not offer it, and the fill/share numbers
// the game shows. BASE=<build> RT=<rigtest dir> OUT=<png>
const path = require('path'); const { open, openRoom, audit, ORDER } = require(path.join(process.env.RT, 'qa/lib.js'));
(async () => { const { b, p, errs } = await open({ width: 1300, height: 1000, owned: 'all' }); const i = ORDER.indexOf('karaoke');
  for (const withBall of [true, false]) {
    const r = await p.evaluate(([i, withBall]) => { const x = window.__qb.x(), S = x.S, sl = S.base.slots[i]; if (!withBall) delete sl.a.ka_disco; else sl.a.ka_disco = 1;
      const A = x.ADDONS.karaoke, row = A.find((a) => a[0] === 'ka_disco'); const live = A.filter((a) => !(a[3] && a[3].retired));
      return { t: sl.t, owned: Object.keys(sl.a).length, list: A.length, live: live.length, ownedLive: live.filter((a) => sl.a[a[0]]).length, row: row ? [row[1], row[2], JSON.stringify(row[3])] : null }; }, [i, withBall]);
    await openRoom(p, i, 1300, 1000); const a = await audit(p, i);
    const dom = await p.evaluate(() => ({ discoImg: [...document.querySelectorAll('image,img')].filter((e) => /kax_disco/.test(e.getAttribute('href') || e.getAttribute('src') || e.getAttribute('xlink:href') || '')).length,
      text: (document.body.innerText.match(/Disco Ball[^\n]{0,40}/g) || []).slice(0, 3), pct: (document.body.innerText.match(/\d+\s*%/g) || []).slice(0, 6) }));
    console.log(withBall ? 'owns the ball' : 'no ball', JSON.stringify(r), '| audit pieces', a.items.length, 'outside', JSON.stringify(a.outside), 'overlaps', a.overlap.length, '| disco art in page', dom.discoImg, '| "Disco Ball" text', JSON.stringify(dom.text), '| % shown', JSON.stringify(dom.pct));
    if (withBall) await p.screenshot({ path: process.env.OUT }); }
  // the room's upgrade list (the Upgrades window for this room), owning nothing: is the ball offered?
  const up = await p.evaluate((i) => { const x = window.__qb.x(); x.S.base.slots[i].a = {}; x.S.coins = 1e6; x.render(); try { window.__qb.roomModal(i); } catch (e) {} const t = [...document.querySelectorAll('#layer .modal')].map((m) => m.innerText).join(' ');
    return { modal: t.length, disco: /Disco Ball/.test(t), sample: t.replace(/\s+/g, ' ').slice(0, 160) }; }, i);
  console.log('room window with nothing owned:', JSON.stringify(up)); console.log('page errors', errs.length, JSON.stringify(errs.slice(0, 3))); await b.close(); })();
