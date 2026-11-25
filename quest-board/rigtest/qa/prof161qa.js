// QA, 22749d21 + 7569506f (29zz_v161.js, the tidy profile). What LEAD's prof161.js leaves out: the profile at level 3 (no class yet),
// at 12 with Relics open, and at 35 (rank B, Titles). For each: the top (banner, name, Closet, Change banner, no Sound), what is gone
// (UI upgrades line, Weekly Warrior, Path / Final Form skill cards, the "Photo proof ..." note), the Stats card (diagram, counts, Titles
// at rank B), Relics and Replay tutorial at the bottom, nothing wider than the window; pictures of the top and the bottom.
//   PORT=<plain build> OUT=<dir> node prof161qa.js
const pw = require('playwright');
const PORT = process.env.PORT || 8819, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  for (const [lv, gates, W] of [[3, [], 390], [12, [5, 10], 390], [35, [5, 10, 20, 30], 390], [35, [5, 10, 20, 30], 320]]) { const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2 }); await ctx.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1:') ? r.continue() : r.abort()));
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
    await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV161, null, { timeout: 120000 }); await p.waitForTimeout(800); await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' });
    await p.evaluate(([lv, gates]) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Profile Person', sex: 'f' }); S.xp = x.cum(lv); S.gates = gates; if (lv >= 5) { S.cls = 'vanguard'; } if (lv >= 20) S.spec = 'berserker'; S.tutDone = 1; S.calm = false; S.sndOff = 1;
      S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1 }; S.areaOn = { board: 1, train: 1, hall: 1, shop: 1, trophy: lv >= 12 ? 1 : 0 }; try { window.__qbRooms.open('closet', 1); } catch (e) {} x.persist(); x.render(); document.querySelector('.nav button[data-v="board"]').click(); }, [lv, gates]);
    await p.waitForTimeout(1000); await p.evaluate(() => { for (const m of document.querySelectorAll('#layer .modal,#layer .qb-held,.bsplash,.dropsplash')) m.remove(); document.querySelector('.strip .avbtn').click(); }); await p.waitForTimeout(1200);
    const r = await p.evaluate(() => { const m = document.querySelector('#layer .prof'); if (!m) return null; const t = m.innerText; const btn = [...m.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean); const st = [...m.querySelectorAll('h3')].map((h) => h.textContent.trim());
      const stats = [...m.querySelectorAll('h3')].find((h) => /stat/i.test(h.textContent)); const sc = stats ? stats.closest('.card, section, div') : null; const r = m.getBoundingClientRect();
      return { btn, heads: st, sound: /sound/i.test(btn.join(' ')), ui: /UI upgrades? active|Next upgrade at level/i.test(t), warrior: /weekly warrior/i.test(t), path: /path skill|final form/i.test(t), proof: /photo proof/i.test(t), stats: sc ? { radar: !!sc.querySelector('svg, canvas'), counts: (sc.innerText.match(/\d+/g) || []).length, titles: /title/i.test(sc.innerText) } : null,
        relics: btn.some((b) => /relic/i.test(b)), last: btn.slice(-3), sndOff: window.__qb.x().S.sndOff, wide: m.scrollWidth > m.clientWidth + 1, w: Math.round(r.width), cls: (t.match(/Vanguard|Berserker|Choose your|class/i) || [''])[0] }; });
    const tag = 'level ' + lv + ' at ' + W; console.log('     ' + tag + ': ' + JSON.stringify(r));
    ok(r && r.btn.includes('Closet') && r.btn.includes('Change banner') && !r.sound && !r.sndOff, tag + ': Closet and Change banner at the top, no Sound button, sound back on');
    ok(r && !r.ui && !r.warrior && !r.path && !r.proof, tag + ': no UI upgrades line, Weekly Warrior, Path or Final Form cards, or "Photo proof" note');
    ok(r && r.stats && r.stats.radar && r.stats.counts >= 5, tag + ': the Stats card keeps its diagram and counts' + (lv >= 35 ? ' (Titles: ' + (r.stats && r.stats.titles) + ')' : ''));
    ok(r && /replay tutorial/i.test(r.last.join(' ')) && (lv < 12 || r.relics) && !r.wide, tag + ': Replay tutorial at the bottom' + (lv >= 12 ? ', Relics there' : '') + ', nothing wider than the window');
    await p.screenshot({ path: OUT + '/prof_' + lv + '_' + W + '_top.png' }); await p.evaluate(() => { const m = document.querySelector('#layer .modal'); if (m) m.scrollTop = m.scrollHeight; const c = document.querySelector('#layer .prof'); if (c) c.scrollIntoView({ block: 'end' }); }); await p.waitForTimeout(400); await p.screenshot({ path: OUT + '/prof_' + lv + '_' + W + '_bottom.png' });
    await ctx.close(); }
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
