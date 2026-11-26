// Cal 11-25 (29o_alerts.js): the "+" where the next room opens says "???", never the room's name.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/lot180.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x, null, { timeout: 90000 }); await p.waitForTimeout(400);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
  const r = await p.evaluate(async () => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(14); S.gates = [5, 10]; S.tutDone = 1; S.v67ref = 1;
    S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, loft: 1, hall: 1, players: 1, shop: 1, away: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, hideout: 1, shop: 1, train: 1 };
    const full = (t) => { const a = {}; (x.ADDONS[t] || []).forEach((q) => { if (!(q[3] && (q[3].opens || q[3].retired))) a[q[0]] = 1; }); return a; };
    S.base.slots = [{ t: 'bedroom', a: full('bedroom'), st: 0, pend: 0 }, { t: 'closet', a: full('closet'), st: 0, pend: 0 }]; x.render();
    await new Promise((o) => setTimeout(o, 600)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    document.querySelector('.nav button[data-v="hideout"]').click(); await new Promise((o) => setTimeout(o, 2500)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    const e = document.querySelector('[data-act="bldgo"][data-v="0"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); await new Promise((o) => setTimeout(o, 2500)); document.querySelectorAll('#layer .modal').forEach((m) => m.remove());
    const names = Object.keys(x.ROOMT).map((k) => x.ROOMT[k].name).filter(Boolean);
    const plus = [...document.querySelectorAll('.alplus text')].map((t) => t.textContent); const svg = document.getElementById('lfsvg'); const txt = svg ? [...svg.querySelectorAll('text')].map((t) => t.textContent) : [];
    const rects = [...document.querySelectorAll('.alplus rect[rx="22"]')].map((e) => e.getBoundingClientRect()); let lap = false; for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) { const a = rects[i], c = rects[j]; if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) lap = true; }
    window.__names = names;
    return { plus, lap, leak: txt.filter((t) => names.indexOf(t) >= 0 && ['Bedroom', 'Walk-in Closet'].indexOf(t) < 0) }; });
  ok(r.plus.length >= 1 && r.plus.every((t) => t === '???') && !r.leak.length, 'the next room\'s "+" says ??? and no unbuilt room is named ' + JSON.stringify(r));
  ok(!r.lap, 'the pills do not overlap each other');
  const gb = await p.evaluate(() => { const g = document.querySelector('.alplus .lfplus'); const q = g.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; });
  await p.mouse.click(gb[0], gb[1]); await p.waitForTimeout(800);
  Object.assign(r, await p.evaluate(() => { const m = document.querySelector('#layer .nxm'), mt = m ? m.innerText.replace(/\s+/g, ' ') : ''; return { win: mt.slice(0, 140), winLeak: window.__names.filter((n) => n && ['Bedroom', 'Walk-in Closet'].indexOf(n) < 0 && mt.indexOf(n) >= 0) }; }));
  ok(/\? \? \?/.test(r.win) && !r.winLeak.length, 'the window the "+" opens names nothing either: ' + r.win);
  const t = await p.evaluate(() => { const H = window.__qbStory, o = H.state(); const st = H.steps.find((s) => s.room && s.how !== 'never'); if (!st) return null; o.offer[st.id] = 1; return { room: st.room, teased: true }; });
  console.log('     a story beat offered: ' + JSON.stringify(t));
  await p.screenshot({ path: OUT + '/lot180.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
