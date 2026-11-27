// The 1.90 letter (29zz_v221.js): off before 1.90; at 1.90 a player who joined before that day gets it (700 coins), a new one does not.
//   PORT=<plain build server> NODE_PATH=<playwright's parent> node rigtest/lead/patch190.js
const { chromium } = require('playwright'); const PORT = process.env.PORT || 8838; let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 160)));
  await p.goto('http://127.0.0.1:' + PORT + '/dist/index.html'); await p.waitForFunction(() => window.__qb && window.__qbV221, null, { timeout: 90000 });
  const r = await p.evaluate(() => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'C', sex: 'm' }); const ids = () => { let out = []; try { INBOXGEN; } catch (e) {} return out; };
    const list = () => (window.__qbIB && window.__qbIB.list ? window.__qbIB.list() : null);
    const has = () => { const L = (typeof window.__qbInbox === 'object' && window.__qbInbox.items) ? window.__qbInbox.items() : null; return L; };
    return { off: window.__qbV221.on(), lines: (window.__qbV221.letter.body.match(/<li>/g) || []).length, coins: window.__qbV221.letter.coins, brands: /NICE|SMOKE|SØLV|Vault|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i.test(window.__qbV221.letter.body) }; });
  ok(r.lines === 6 && r.coins === 700 && !r.brands, '6 short lines (Cal 11-27), 700 coins, no brand, weekday or Vault ' + JSON.stringify(r));
  /* forced on (as 1.90 would be): a player from before today gets it, one who joined today does not */
  const inbox = async (join) => p.evaluate(async (join) => { const x = window.__qb.x(), S = x.S; S.created = true; S.char = window.__qb.fixChar({ name: 'Cal', sex: 'm' }); S.xp = x.cum(12); S.gates = [5, 10]; S.cls = 'vanguard'; S.tutDone = 1;
    S.tours = { welcome: 1, hideout: 1, train: 1, dq: 1, bty: 1, hall: 1, shop: 1, players: 1, wheel: 1, away: 1, banner: 1 }; S.unl = Object.assign({ console: 1, pets: 1, acc2: 1, sable7: 1 }, S.unl || {}); S.areaOn = { board: 1, shop: 1, hideout: 1 }; delete S.v221d;
    S.letters = { read: { welcome: 1, roadmap: 1 }, paid: { welcome: 3000 }, at: { welcome: join, roadmap: join } }; window.__qbV221.force(1); x.persist(); x.render(); await new Promise((o) => setTimeout(o, 500));
    document.querySelectorAll('#layer .modal,.dropsplash,.bsplash').forEach((m) => m.remove()); document.querySelector('.ibbtn').click(); await new Promise((o) => setTimeout(o, 400));
    const r = !!document.querySelector('.ibrow[data-id="patch190"]'); document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return r; }, join);
  const old = await inbox('2026-11-10'); const fresh = await inbox(await p.evaluate(() => window.__qb.x().S.v221d || ''));
  ok(old && !fresh, 'at 1.90 a player from before gets the letter, one who started that day does not ' + JSON.stringify({ old, fresh }));
  /* the body: the four Crawls lines only for a player who has allies */
  const body = async (team) => p.evaluate(async (team) => { const x = window.__qb.x(), S = x.S; S.story = S.story || {}; S.story.team = team ? { sable: 1 } : {}; x.render(); await new Promise((o) => setTimeout(o, 300));
    document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); document.querySelector('.ibbtn').click(); await new Promise((o) => setTimeout(o, 400)); const r = document.querySelector('.ibrow[data-id="patch190"]'); if (!r) return null; r.click(); await new Promise((o) => setTimeout(o, 400));
    const t = (document.querySelector('.ibox') || document.querySelector('#layer .modal') || {}).innerText || ''; document.querySelectorAll('#layer .modal').forEach((m) => m.remove()); return t.replace(/\s+/g, ' '); }, team);
  await inbox('2026-11-10'); const noAlly = await body(false), withAlly = await body(true);
  ok(noAlly && !/\bally|allies|dungeon/i.test(noAlly) && (noAlly.match(/\. /g) || []).length >= 1 && !/got bigger/.test(noAlly) && withAlly && /allies/i.test(withAlly), 'no Crawls lines for a player without allies; the full letter with them ' + JSON.stringify({ noAlly: (noAlly || '').slice(0, 120), withAlly: (withAlly || '').slice(0, 80) }));
  ok(!errs.length, 'no page errors ' + JSON.stringify(errs.slice(0, 3))); await b.close(); console.log(bad ? 'FAILED ' + bad : 'PASS'); })();
