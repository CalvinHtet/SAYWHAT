// Cal 11-25: "The scratch card logo is still a wheel. And the text is still about the wheel. Make sure you check the whole app and make
// sure everything else is consistent." A sweep of the copy a player can meet: every area's name, line and icon, every info window,
// every tour, the ranks, every area's "New area" card, and each screen as drawn, against the words that were retired.
//   PORT=<plain build> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/wording155.js
const { chromium } = require('playwright'); const fs = require('fs'); const PORT = process.env.PORT || 8779, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
// retired words -> why. Furniture and exercises that really are wheels or spins are allowed by name.
const STALE = [[/\bwheel\b|lucky wheel/i, 'the Wheel is the scratch card'], [/\bspin(s|ning)?\b|\bspun\b/i, 'the Wheel is the scratch card'], [/bass hunter|drop knight|headliner|shadow monarch/i, 'old rank names'], [/daily bounty/i, 'bounties are 1, 2 and 3-day cards'], [/\bwardrobe\b/i, 'the Wardrobe is the Closet'],
  [/every 4 hours|every few hours/i, 'the Wheel\'s timer']];
const ALLOW = /Spin Bikes|Spin to win|Spinning vinyl|spinning blue rings|bread on wheels|Wheelbarrow|cockpit with a wheel|Wardrobe Lights|Sleek Wardrobe|Shadow Sovereign/i;
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = []; const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qb.x && window.__qbV155 && window.__qbV150, null, { timeout: 90000 }); await p.waitForTimeout(800);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(40); S.gates = [5, 10, 20, 30, 40]; S.calm = false; S.tutDone = 1; S.coins = 50000; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, away: 1 };
    try { window.__qbRooms.open('closet', 1); } catch (e) {} S.brandSeen = S.brandSeen || {}; try { window.__qbDrops.state().live.forEach((q) => { S.brandSeen[q.id + '|' + q.start] = 1; }); } catch (e) {} x.render(); }); await p.waitForTimeout(500);
  const clear = () => V(() => document.querySelectorAll('#layer .modal,.bsplash,.dropsplash').forEach((m) => m.remove())); await clear();
  const lines = await V(() => window.__qbV155.texts()); ok(lines.length > 60 && !lines.some((l) => /^ERR/.test(l)), 'standing copy read: ' + lines.length + ' lines (areas, info windows, tours, ranks)');
  /* each area's "New area" card and each screen as drawn */
  const areas = await V(() => window.__qbV155.areas());
  for (const k of areas) { const t = await V((k) => { try { return window.__qbV155.card(k); } catch (e) { return 'ERR ' + e.message; } }, k); lines.push('new area card ' + k + ': ' + t); }
  for (const v of ['board', 'train', 'hall', 'players', 'trophy', 'wheel', 'away', 'shop', 'sys']) { await clear(); const t = await V((v) => { try { window.__qbV155.go(v); } catch (e) { return 'ERR ' + e.message; } return null; }, v); await p.waitForTimeout(600); await clear(); const txt = await V(() => document.getElementById('app').innerText); txt.split('\n').map((s) => s.trim()).filter(Boolean).forEach((s) => lines.push('screen ' + v + ': ' + s)); if (t) lines.push('screen ' + v + ': ' + t); }
  /* every info window as it opens */
  const infos = await V(() => window.__qbV155.infoKeys()); for (const k of infos) { await clear(); const t = await V((k) => { try { return window.__qbV155.info(k); } catch (e) { return 'ERR ' + e.message; } }, k); lines.push('info window ' + k + ': ' + String(t).replace(/\s+/g, ' ')); } await clear();
  fs.writeFileSync(OUT + '/wording155.txt', lines.join('\n'));
  const hits = []; lines.forEach((l) => { const body = l.slice(l.indexOf(': ') + 2); if (ALLOW.test(body)) return; STALE.forEach((s) => { if (s[0].test(body)) hits.push(s[1] + ' <- ' + l.slice(0, 200)); }); });
  hits.forEach((h) => console.log('     STALE ' + h)); ok(hits.length === 0, 'no retired wording in ' + lines.length + ' lines');
  /* the scratch card's icon is a card, not a wheel */
  const ic = await V(() => window.__qbV155.icon('wheel')); ok(/<rect /.test(ic) && !/M12 3v18M3 12h18/.test(ic), 'the scratch card\'s icon is a card with scratch strokes and a coin, not the wheel\'s spokes');
  const card = lines.filter((l) => /^new area card wheel/.test(l))[0] || ''; ok(/Scratch card unlocked/i.test(card) && /scratch card every day/i.test(card) && !/spin/i.test(card), 'the level-up card: ' + card.slice(0, 200));
  await V(() => { const d = document.createElement('div'); d.id = 'iconshot'; d.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#0b1220;padding:20px;width:350px;color:#22d3ee'; d.innerHTML = window.__qbV155.cardHtml('wheel'); document.body.appendChild(d); }); await p.waitForTimeout(900); await (await p.$('#iconshot')).screenshot({ path: OUT + '/wording155_card.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
