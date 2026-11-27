// Cal 11-26 (29zz_v220.js): "dont have allies and team. Just make them all allies." One "Your allies" list on the Crawls tab, no
// "Rescued allies" section, and no "team" in what players read there.
//   PORT=<build server> NODE_PATH=<playwright's parent> OUT=<dir> node rigtest/lead/allies220.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838, OUT = process.env.OUT || '.'; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV220, null, { timeout: 90000 }); await p.waitForTimeout(300);
  await p.addStyleTag({ content: '#qbtour,.tour-ring,.tour-bub{display:none!important}' }); const V = (f, a) => p.evaluate(f, a);
  await V(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.tutDone = 1; S.seen = { crawls: 1 }; S.tours = { welcome: 1, dq: 1, bty: 1, train: 1, hideout: 1, hall: 1, players: 1, shop: 1, wheel: 1, trophy: 1, freeze: 1, banner: 1, away: 1 };
    S.unl = { console: 1, pets: 1, acc2: 1, sable7: 1 }; S.mile = { since: 999, fx1: 1 }; S.story = S.story || {}; S.story.team = { sable: 1, mara: 1 }; S.dng = { runs: [], cd: { d: '', n: 0 }, npcs: { pip: 1, juno: 1 }, log: [] }; S.areaOn = { board: 1, hideout: 1, away: 1 };
    if (window.__qbV192 && window.__qbV192.due()) window.__qbV192.claim(); x.render(); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.nav button[data-v="away"]').click(); });
  await p.waitForTimeout(1200); await V(() => document.querySelectorAll('#layer .modal').forEach((m) => m.remove()));
  const r = await V(() => { const t = document.querySelector('#app').innerText; const sec = [...document.querySelectorAll('section h3')].map((h) => h.innerText.trim()); const cards = [...document.querySelectorAll('.tm-card b')].map((b) => b.textContent);
    return { sec, cards, team: (t.match(/\b(team|teammate)s?\b/gi) || []), rescued: /Rescued allies/i.test(t), cap: (document.querySelector('.v210cap') || {}).innerText }; });
  ok(r.sec.filter((s) => /your allies/i.test(s)).length === 1 && !r.rescued && r.cards.length === 4 && !r.team.length && /allies/i.test(r.cap || ''), 'one "Your allies" list with all four, no "Rescued allies", no "team" on the tab ' + JSON.stringify(r));
  await V(() => { const s = [...document.querySelectorAll('section')].find((x) => /your allies/i.test((x.querySelector('h3') || {}).innerText || '')); s.scrollIntoView(); }); await p.waitForTimeout(1200); await p.screenshot({ path: OUT + '/allies220.png' });
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
