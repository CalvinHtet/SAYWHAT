// LEAD's text and story audit (ca1068d), a cheap check: level-ups from 1 to 100 announce no crew, vault or relic and never
// "[object Object]"; the New area cards for Shop, Hall, Relics, Wheel and Dungeons read their new lines; the two return visits
// (Sable after the goblin set, Rafe after the amulet) come only once the set is done; the Dungeons and Relics screens draw
// with set emblems or stand-ins and no "[object Object]" or "undefined".
//   OUT=<folder> node audit49.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const OUT = process.env.OUT || 'qa-out'; fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const { b, p, errs } = await open({ width: 1000, height: 1000, owned: 'none' });
  const fails = [], oks = [], t = (c, m) => (c ? oks : fails).push(m);
  const bad = /\[object Object\]|undefined|NaN/;
  // level-ups: the code (unlocksFor returns null first thing; AREALINE read from the built page), then every level-up screen
  // from 1 to 100 through the game's own "simlvl" action
  const src = await p.evaluate(async () => { const h = await (await fetch('/dist/index.html', { cache: 'no-store' })).text();
    const u = h.match(/function unlocksFor\(L\)\{\s*(?:\/\*[\s\S]*?\*\/\s*)?([^;]*);/); const al = h.match(/var AREALINE=(\{[^}]*\})/); const ar = h.match(/var AREAS=(\[\[[^;]*\]\]);/);
    return { first: u ? u[1].trim() : null, AREALINE: al ? al[1] : null, AREAS: ar ? ar[1] : null }; });
  t(src.first === 'return null', `unlocksFor's first statement: "${src.first}"`);
  const lvl = await p.evaluate(async () => {
    const x = window.__qb.x(), S = x.S, w = (ms) => new Promise((o) => setTimeout(o, ms)), out = [];
    S.xp = 0; S.gates = []; x.render();
    const bt = document.createElement('button'); bt.dataset.act = 'simlvl'; bt.style.display = 'none'; document.body.appendChild(bt);
    for (let k = 0; k < 120 && x.effLvl() < 100; k++) {
      document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove());
      const L0 = x.effLvl(); bt.click(); await w(30);
      const txt = [...document.querySelectorAll('#layer .modal,.modal')].map((e) => e.innerText).join(' | ').replace(/\s+/g, ' ');
      out.push([L0 + '->' + x.effLvl(), txt.slice(0, 600)]);
    }
    document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove());
    return out;
  });
  const shown = lvl.filter((x) => x[1]);
  t(shown.length >= 90, `level-up screens: ${shown.length} shown on the way to level ${lvl.length ? lvl[lvl.length - 1][0] : '?'}`);
  const crew = lvl.filter((x) => /crew|vault|hideout|wing of|joins your|Something old/i.test(x[1]) || bad.test(x[1]));
  t(!crew.length, 'level-up screens: no crew, vault, hideout wing or bad text' + (crew.length ? ': ' + crew.slice(0, 3).map((x) => x[0] + ' "' + x[1].slice(0, 200) + '"').join('; ') : ''));
  fs.writeFileSync(path.join(OUT, 'levelups.txt'), lvl.map((x) => x[0] + ': ' + x[1]).join('\n'));
  // the area lines
  const areas = src.AREALINE && src.AREAS ? [eval(src.AREAS), eval('(' + src.AREALINE + ')')] : null;
  if (areas) {
    for (const [k, name] of areas[0]) { const l = areas[1][k]; if (!l) continue; t(!/crew|expedition|vault|lounge|hideout/i.test(l) && !bad.test(l), `${name}: "${l}"`); }
  } else t(false, 'AREAS / AREALINE not found in the built page');
  // return visits
  const rv = await p.evaluate(async () => {
    const x = window.__qb.x(), S = x.S, ST = window.__qbStory, out = {};
    const B = ST.beats || [];
    const ids = B.map((b) => b.id);
    out.ids = ids.filter((i) => /sable|rafe/.test(i));
    const find = (id) => B.find((b) => b.id === id);
    for (const [id, set] of [['sable3', 'goblin'], ['rafe4', 'amulet']]) {
      const bt = find(id); if (!bt) { out[id] = 'missing'; continue; }
      const before = (() => { try { return !!bt.gate(); } catch (e) { return 'ERR ' + e.message; } })();
      out[id] = { before, lines: bt.lines, at: bt.at, pic: bt.pic };
    }
    return out;
  });
  t(rv.ids && rv.ids.includes('sable3') && rv.ids.includes('rafe4'), `return visits listed: ${JSON.stringify(rv.ids)}`);
  for (const id of ['sable3', 'rafe4']) { const r = rv[id]; if (r && r !== 'missing') { t(r.before === false, `${id} not due on a new save (gate ${r.before})`); t(r.lines.every((l) => !bad.test(l) && !/!/.test(l)), `${id} at ${r.at}: "${r.lines.join(' / ')}"`); } }
  // finish the sets and see the gates open
  const rv2 = await p.evaluate(async () => {
    const x = window.__qb.x(), S = x.S, ST = window.__qbStory;
    S.team = S.team || {}; const out = {};
    window.__qbTeam.join('sable'); window.__qbTeam.join('rafe');
    const B = ST.beats; const g = (id) => { const bt = B.find((b) => b.id === id); try { return !!bt.gate(); } catch (e) { return 'ERR ' + e.message; } };
    const th = (k) => !!(S.story && S.story.team && S.story.team[k]); out.team = { sable: th('sable'), rafe: th('rafe') };
    out.sable_half = g('sable3'); out.rafe_half = g('rafe4');
    const T = window.__qbDungeon.SETS; S.trophy = S.trophy || {};
    for (const set of ['goblin', 'amulet']) { S.trophy[set] = {}; T[set].pieces.forEach((pc) => (S.trophy[set][pc.id] = 1)); }
    const dn = (k) => T[k].pieces.every((pc) => S.trophy[k] && S.trophy[k][pc.id]); out.done = { goblin: dn('goblin'), amulet: dn('amulet') };
    out.sable_done = g('sable3'); out.rafe_done = g('rafe4');
    const A = window.QBART || {}; out.pics = ['sable', 'rafe'].map((k) => k + ':' + (A['ui_story_' + k + '.webp'] ? 'own' : A['ui_team_' + k + '.webp'] ? 'team banner' : 'none'));
    return out;
  });
  t(rv2.team.sable && rv2.team.rafe, `Sable and Rafe on the team for the test (${JSON.stringify(rv2.team)})`);
  t(rv2.sable_half === false && rv2.rafe_half === false, `with the sets unfinished neither visit is due (${rv2.sable_half}, ${rv2.rafe_half})`);
  t(rv2.done.goblin && rv2.done.amulet && rv2.sable_done === true && rv2.rafe_done === true, `sets finished ${JSON.stringify(rv2.done)}: both visits due (${rv2.sable_done}, ${rv2.rafe_done}); pictures ${rv2.pics.join(' ')}`);
  // the Dungeons screen and the Relics tab
  const scr = await p.evaluate(async () => {
    const w = (ms) => new Promise((o) => setTimeout(o, ms)), out = {};
    document.querySelectorAll('#layer .modal,.modal,.overlay,.dropsplash').forEach((e) => e.remove());
    const S = window.__qb.x().S; S.relics = S.relics || {};
    window.__qbDungeon.relics();
    for (const v of ['away', 'trophy']) { const btn = document.querySelector(`.nav button[data-v="${v}"]`); if (btn) { btn.click(); await w(800); } const main = document.querySelector('main') || document.body;
      out[v] = { txt: main.innerText.replace(/\s+/g, ' ').slice(0, 3000), seticons: main.querySelectorAll('.dg-set-ic').length, icons: main.querySelectorAll('.dg-ic').length, stand: main.querySelectorAll('.dg-ic0').length, found: btn ? 1 : 0 }; }
    return out;
  });
  for (const v of ['away', 'trophy']) {
    const s = scr[v];
    t(s.found, `${v} tab button found`);
    t(!bad.test(s.txt), `${v} screen text has no "[object Object]", "undefined" or NaN` + (bad.test(s.txt) ? ': ...' + s.txt.slice(Math.max(0, s.txt.search(bad) - 80), s.txt.search(bad) + 60) + '...' : ''));
    console.log(`  ${v}: ${s.icons} icons (${s.stand} stand-ins), ${s.seticons} set emblems`);
  }
  await p.screenshot({ path: path.join(OUT, 'relics.png'), fullPage: false });
  oks.forEach((m) => console.log('  ok   ' + m)); fails.forEach((m) => console.log('  FAIL ' + m));
  console.log('page errors', errs.length, errs.slice(0, 3));
  await b.close();
})();
