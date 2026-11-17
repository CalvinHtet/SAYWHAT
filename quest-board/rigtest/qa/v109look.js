// v1.09 (LEAD 5959380, Cal's cleanup): the Town Hall's picture behind the header under every theme and every page background, and the
// header beside the frame with the longest class and the longest title, on the plain build. One sheet of the Hall's top per theme/bg
// (390 wide), the header at 360 on the Board, Town Hall and Players, and the first time the Hall is drawn a check that its picture is
// on screen (not covered by #deco or the page) by sampling its pixels.
//   BASE=<plain build server> OUT=<folder> NODE_PATH=<playwright's parent> node rigtest/qa/v109look.js
const pw = require('playwright'), fs = require('fs');
const OUT = process.env.OUT || 'qa-out/v109'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await pw.chromium.launch({ args: ['--mute-audio'] }); let E = 0;
  const page = async (W) => { const p = await (await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true })).newPage(); p.errs = []; p.on('pageerror', (e) => p.errs.push(e.message.slice(0, 140)));
    await p.goto(process.env.BASE + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.QBLoft && window.__qbRooms, null, { timeout: 120000 }); await p.waitForTimeout(800);
    await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(40); S.gates = [5, 10, 20, 30, 40]; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, loft: 1, town: 1, shop: 1, players: 1, hall: 1 }; S.calm = false; S.welcomed = 1; S.fsall = 1;
      S.areaOn = { board: 1, train: 1, hideout: 1, shop: 1, hall: 1, players: 1, trophy: 1, wheel: 1, away: 1 }; S.brandSeen = { x: 1 }; S.floorSeen = { boutique: 1, atelier: 1, street: 1 }; S.letters = { read: { welcome: 1, roadmap: 1, patch106: 1 }, paid: { welcome: 3000, patch106: 500 }, at: { welcome: '2026-11-01' }, popped: 1 }; S.owned = S.owned || {}; S.eq = S.eq || {}; window.__qbRooms.open('closet', 1); x.render(); });
    await p.waitForTimeout(500); return p; };
  const go = (p, v) => p.evaluate(async (v) => { document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,#qbtour').forEach((m) => m.remove()); const bt = document.querySelector('.nav button[data-v="' + v + '"]'); if (bt) bt.click(); await new Promise((o) => setTimeout(o, 700)); document.querySelectorAll('#layer .modal,.dropsplash,.bsplash,.coachscr,#qbtour').forEach((m) => m.remove()); window.scrollTo(0, 0); return !!bt; }, v);
  // 1. the Town Hall under every theme and every page background
  const p = await page(390);
  const L = await p.evaluate(() => { const x = window.__qb.x(); return { th: x.SHOP.filter((q) => q[1] === 'theme').map((q) => q[0]), bg: x.SHOP.filter((q) => q[1] === 'bg').map((q) => q[0]) }; });
  const looks = [['none', null, null]].concat(L.th.map((t) => ['theme ' + t, 'theme', t]), L.bg.map((t) => ['bg ' + t, 'bg', t]));
  const tiles = [], res = [];
  for (const [name, slot, id] of looks) {
    await p.evaluate(([slot, id]) => { const x = window.__qb.x(), S = x.S; delete S.eq.theme; delete S.eq.bg; if (slot) { S.owned[id] = true; S.eq[slot] = id; } x.render(); }, [slot, id]);
    await go(p, 'hall');
    const r = await p.evaluate(() => { const el = document.querySelector('.v9hallbg'); if (!el) return { bg: false };
      const rc = el.getBoundingClientRect(), x = Math.round(innerWidth / 2), y = Math.max(5, Math.round(rc.top + 60)); const top = document.elementFromPoint(x, y);
      const dc = document.getElementById('deco'); const dz = dc ? getComputedStyle(dc).zIndex + '/' + getComputedStyle(dc).position : '-';
      return { bg: true, h: Math.round(rc.height), w: Math.round(rc.width), topEl: top ? (top.id || top.className || top.tagName).toString().slice(0, 40) : '-', deco: dz }; });
    const buf = await p.screenshot({ clip: { x: 0, y: 0, width: 390, height: 330 } }); tiles.push({ name, b64: buf.toString('base64') }); res.push(name + ': ' + JSON.stringify(r));
  }
  E += p.errs.length;
  // sheet of tiles, 5 across
  const sheet = await p.evaluate(async (tiles) => { const cols = 5, w = 390, h = 350, c = document.createElement('canvas'); c.width = cols * w; c.height = Math.ceil(tiles.length / cols) * h; const g = c.getContext('2d'); g.fillStyle = '#222'; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < tiles.length; i++) { const im = await new Promise((ok) => { const m = new Image(); m.onload = () => ok(m); m.src = 'data:image/png;base64,' + tiles[i].b64; }); const X = (i % cols) * w, Y = Math.floor(i / cols) * h; g.drawImage(im, X, Y + 20); g.fillStyle = '#fff'; g.font = 'bold 14px sans-serif'; g.fillText(tiles[i].name, X + 6, Y + 15); }
    return c.toDataURL('image/jpeg', 0.75); }, tiles);
  fs.writeFileSync(OUT + '/hall_looks.jpg', Buffer.from(sheet.split(',')[1], 'base64'));
  console.log('Town Hall looks (' + looks.length + '):'); res.forEach((l) => console.log('  ' + l));
  // 2. the header at 360 with the longest class and title
  const q = await page(360);
  const lg = await q.evaluate(() => { const x = window.__qb.x(), S = x.S, C = x.CLASSES || window.CLASSES || {}; const cls = Object.keys(C).sort((a, b) => String((C[b] || {}).name || b).length - String((C[a] || {}).name || a).length)[0];
    const titles = x.SHOP.filter((q) => q[1] === 'title').sort((a, b) => b[2].length - a[2].length); const t = titles[0]; if (cls) S.cls = cls; if (t) { S.owned[t[0]] = true; S.eq.title = t[0]; } S.char.name = 'Maximiliana'; x.render(); return { cls, clsName: cls && (C[cls] || {}).name, title: t && t[2] }; });
  console.log('header at 360 with class', JSON.stringify(lg));
  for (const v of ['board', 'hall', 'players']) { await go(q, v);
    const r = await q.evaluate(() => { const st = document.querySelector('.strip'); if (!st) return { strip: false }; const out = [...st.querySelectorAll('*')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > innerWidth + 0.5 || b.left < -0.5); }).map((e) => e.className || e.tagName).slice(0, 4);
      const pill = st.querySelector('.rankpill'); const cut = pill ? pill.scrollWidth > pill.clientWidth + 1 : null; return { past: out, pillText: pill ? pill.innerText.slice(0, 60) : '-', pillCut: cut, sw: document.documentElement.scrollWidth }; });
    await q.screenshot({ path: `${OUT}/header360_${v}.png`, clip: { x: 0, y: 0, width: 360, height: 260 } }); console.log(`  ${v}: ${JSON.stringify(r)}`); }
  E += q.errs.length; console.log('page errors', E, JSON.stringify(p.errs.concat(q.errs).slice(0, 3))); await b.close(); })();
