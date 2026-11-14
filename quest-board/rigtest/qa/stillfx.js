// LEAD's Loft lag batch (dbffcfa + 238b192): in each room window with screens, glows or beams, fully bought: the door glows (.prtG), the
// screens' moving parts (.scrL/.scrL2/.scrJ/.scrB/.scrT/.scrU/.scrE) and the Club's beams (.cbb) no longer animate; the page flips (.scrS)
// still do, one page showing at a time. A picture of each window for the eye.   OUT=<folder> node stillfx.js
const fs = require('fs'), path = require('path'); const { open } = require('./lib.js'); const OUT = process.env.OUT || 'qa-out/still/'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const { b, p, errs } = await open({ width: 1000, height: 820, owned: 'all' }); let bad = 0;
  for (const room of ['bedroom', 'gameroom', 'arcade', 'boba', 'karaoke', 'club', 'theater', 'restaurant', 'skybar']) {
    const i = await p.evaluate((r) => window.__qb.x().S.base.slots.findIndex((s) => s && s.t === r), room); if (i < 0) continue;
    await p.evaluate((i) => { document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); window.__qb.roomModal(i); }, i); await p.waitForTimeout(3000);
    const r = await p.evaluate(() => { const w = document.querySelector('#rbigw'); const moving = (sel) => [...w.querySelectorAll(sel)].filter((e) => { const cs = getComputedStyle(e); return cs.animationName && cs.animationName !== 'none'; }).length;
      const count = (sel) => w.querySelectorAll(sel).length; const pages = [...w.querySelectorAll('.scrS')]; const groups = {}; pages.forEach((e) => { const k = e.parentNode; groups.has ? 0 : 0; }); 
      const shown = pages.filter((e) => +getComputedStyle(e).opacity > .5).length;
      return { glow: [count('.prtG'), moving('.prtG')], scr: [count('.scrL,.scrL2,.scrJ,.scrB,.scrT,.scrU,.scrE'), moving('.scrL,.scrL2,.scrJ,.scrB,.scrT,.scrU,.scrE')], beams: [count('.cbb'), moving('.cbb'), (w.querySelector('.cbb') ? getComputedStyle(w.querySelector('.cbb')).opacity : null)], pages: [pages.length, moving('.scrS'), shown] }; });
    const fine = r.glow[1] === 0 && r.scr[1] === 0 && r.beams[1] === 0; if (!fine) bad++;
    console.log(`${fine ? 'ok  ' : 'BAD '} ${room.padEnd(10)} door glows ${r.glow[0]} (moving ${r.glow[1]}), screen parts ${r.scr[0]} (moving ${r.scr[1]}), beams ${r.beams[0]} (moving ${r.beams[1]}, opacity ${r.beams[2]}), page flips ${r.pages[0]} (animated ${r.pages[1]}, showing now ${r.pages[2]})`);
    await (await p.$('#rbigw')).screenshot({ path: path.join(OUT, `${room}.png`) }).catch(() => {}); }
  console.log('page errors', errs.length, errs.slice(0, 2)); console.log(bad ? 'FAILED ' + bad : 'PASS'); await b.close(); })();
