// SPEC9 QA, static half: every room's description and every upgrade's name, text and splash, checked for the name of a room that
// comes later in the story than the room it is in (the player can own this room without that one). Read only.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/nospoil_static.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const { ROOMW } = require('./nospoil_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8815', OUT = process.env.OUT || 'C:/Users/clvh/qa-wt/out/nospoil';
const ORDER = ['bedroom', 'closet', 'lair', 'patio', 'gameroom', 'trophy', 'garden', 'restaurant', 'boba', 'dessert', 'skybar', 'rooftop', 'mall', 'theater', 'auditorium', 'arcade', 'rhythm', 'vr', 'bowling', 'karaoke', 'club'];
(async () => {
  const br = await browser();
  const pg = await br.page({ fresh: true });
  await pg.go(BASE + '/');
  await pg.wait('!!(window.__qb && window.__qbStory && document.querySelector("#app") && !document.querySelector("#app .boot"))', 120000); await sleep(1500);
  const data = await pg.ev(`(function(){var x=window.__qb.x(),o={};Object.keys(x.ROOMT).forEach(function(t){var T=x.ROOMT[t];
    o[t]={name:T.name,desc:T.desc||"",note:T.note||"",ups:(x.ADDONS[t]||[]).map(function(a){var m=a[3]||{};return {id:a[0],name:a[1],d:a[4]||"",splash:m.splash||"",opens:m.opens||"",retired:!!m.retired,trophy:!!m.trophy,g:m.g||""}})}});
    o.__story=window.__qbStory.steps.map(function(s){return s.room});return o})()`);
  const story = new Set(data.__story.filter(Boolean));
  const out = [];
  ORDER.forEach((X, i) => {
    const R = data[X]; if (!R) return;
    const check = (what, text, up) => {
      ORDER.slice(i + 1).forEach((Y) => {
        if (Y === X) return;
        (ROOMW[Y] || []).forEach((re) => {
          const m = re.exec(text); if (!m) return;
          let note = '';
          if (up && up.opens === Y) note = story.has(Y) ? '(opener of a story room: a "? ? ?" card until the story offers it)' : '(opener: a normal card by design)';
          if (up && up.retired) note += ' (retired: never shown)';
          out.push(`${X} | ${what} | names ${Y} ("${m[0]}") ${note} | ${text.slice(0, 220)}`);
        });
      });
    };
    check('desc', R.desc); if (R.note) check('note', R.note);
    R.ups.forEach((u) => { check('upgrade ' + u.id + ' name', u.name, u); check('upgrade ' + u.id + ' text', u.d, u); if (u.splash) check('upgrade ' + u.id + ' splash', u.splash, u); });
  });
  fs.writeFileSync(OUT + '/static.txt', out.join('\n'));
  console.log(out.join('\n'));
  console.log('rooms ' + Object.keys(data).length + '; page errors ' + pg.errs.length);
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
