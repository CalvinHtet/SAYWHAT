// Review > Play the whole story (LEAD's 40c4b14; Cal: "I also want every story beat and character cutscenes to make sense"): a
// new player at phone size plays it through; every part it shows is written out in order (its heading, who speaks, every line
// of a multi-line scene, its buttons) with a picture, for reading the story once for sense. Also: the save is unchanged after.
//   BASE=<server> OUT=<folder> node storyread.js      (writes story.md and story_NN.png)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8769', OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto(BASE + '/dist/index.html'); await p.waitForFunction(() => document.querySelector('[data-act="ccnext"]'), null, { timeout: 90000 });
  await p.fill('#ccname', 'Cal'); await p.click('[data-act="ccnext"]'); await p.waitForFunction(() => document.querySelector('[data-act="ccdone"]'), null, { timeout: 60000 }); await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector('[data-act="ccdone"]').click()); await p.waitForTimeout(5000);
  await p.evaluate(() => document.querySelectorAll('#layer .modal,.dropsplash').forEach((m) => m.remove()));
  const snap = () => p.evaluate(() => { const S = window.__qb.x().S; const c = JSON.parse(JSON.stringify(S)); delete c.savedAt; delete c.lastSave; delete c.seen; return JSON.stringify(c); });
  const before = await snap(); const seq = await p.evaluate(() => window.__qbRooms.storySeq().map((x) => x.slice(0, 2).join(':')));
  await p.evaluate(() => window.__qbRooms.story());
  const parts = []; let idle = 0;
  while (idle < 15 && parts.length < 200) {
    await p.waitForTimeout(450);
    const top = await p.evaluate(() => { const ms = [...document.querySelectorAll('#layer .modal, .dropsplash')]; const m = ms[ms.length - 1]; if (!m) return null;
      const t = (sel) => [...m.querySelectorAll(sel)].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
      const lines = t('.sty-line'); const imgs = [...m.querySelectorAll('img')].map((i) => (i.getAttribute('alt') || '') + ' ' + (i.getAttribute('src') || '').replace(/^data:.{0,30}.*/, 'data').replace(/^.*\//, '').slice(0, 40));
      return { head: t('h1,h2,h3,.label,.sty-who,.sty-k').slice(0, 4), lines, body: lines.length ? '' : m.innerText.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n').trim().slice(0, 900), buttons: t('button').filter((x) => x !== '✕').slice(0, 4), imgs: imgs.slice(0, 3) }; });
    if (!top) { idle++; continue; } idle = 0;
    const n = parts.length; parts.push(top); await p.screenshot({ path: path.join(OUT, `story_${String(n).padStart(2, '0')}.png`) });
    await p.evaluate(() => { const ms = [...document.querySelectorAll('#layer .modal, .dropsplash')]; ms[ms.length - 1].remove(); });
  }
  await p.waitForTimeout(800); const after = await snap();
  const md = ['# The whole story, as Review plays it (' + parts.length + ' parts; the sequence lists ' + seq.length + ')', ''];
  parts.forEach((q, i) => { md.push(`## ${i}. ${q.head.join(' / ')}`); if (q.imgs.length) md.push('(pictures: ' + q.imgs.join('; ') + ')'); q.lines.forEach((l) => md.push('- ' + l)); if (q.body) md.push(q.body); md.push('[' + q.buttons.join(' | ') + ']', ''); });
  fs.writeFileSync(path.join(OUT, 'story.md'), md.join('\n'));
  if (before !== after) { const a = JSON.parse(before), c = JSON.parse(after); console.log('save keys that changed:', Object.keys(c).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(c[k])).map((k) => k + ': ' + (typeof c[k] === 'object' && c[k] && a[k] ? Object.keys(Object.assign({}, a[k], c[k])).filter((q) => JSON.stringify(a[k][q]) !== JSON.stringify(c[k][q])).map((q) => q + ' ' + JSON.stringify(a[k][q]) + ' -> ' + JSON.stringify(c[k][q])).join(', ') : JSON.stringify(a[k]) + ' -> ' + JSON.stringify(c[k]))).join(' || ')); }
  console.log(`parts shown ${parts.length}, sequence ${seq.length}; save unchanged: ${before === after}; page errors ${errs.length}`, errs.slice(0, 2));
  await b.close();
})();
