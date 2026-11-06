// Every player-facing line the live game holds (upgrade names and lines, Shop items, story scenes and return visits, team
// and relic text), checked against docs/VOICE.md's mechanical rules: no exclamation marks, no em dashes, the banned words,
// the quip endings it names, upgrade and item lines under about 90 characters. Prints each hit with the source file and line.
//   QB=<built quest-board> node voice.js
const fs = require('fs'), path = require('path');
const { open } = require('./lib.js');
const QB = process.env.QB || path.join(__dirname, '..', '..');
const SRC = fs.readdirSync(path.join(QB, 'app', 'src')).filter((f) => f.endsWith('.js')).map((f) => [f, fs.readFileSync(path.join(QB, 'app', 'src', f), 'utf8').split('\n')]);
const where = (txt) => { const k = txt.slice(0, 40).replace(/[“”"]/g, ''); for (const [f, L] of SRC) { const i = L.findIndex((l) => l.includes(k)); if (i >= 0) return f + ':' + (i + 1); } return '?'; };
const BANNED = /\b(perfect|ultimate|stylish|elevate[sd]?|next level|game-?changer|must-have|epic|boss|vibes?|level up your|delve|embark|journey|realm|unleash|seamless|curated|vibrant|testament|tapestry|bustling|cozy nook|oasis|haven|whimsical|slay|omg)\b/i;
const QUIP = /(not guaranteed|says thanks|obviously\.|now decorative|big feelings|probably works|don'?t tell anyone|print money|someone has to|you know you want|meets\b|not just .{1,30}, it'?s|whether you'?re)/i;
(async () => {
  const { b, p } = await open({ width: 900, height: 800, owned: 'none' });
  const lines = await p.evaluate(() => {
    const x = window.__qb.x(), out = [];
    Object.entries(x.ADDONS).forEach(([room, l]) => l.forEach((u) => { if (u[3] && u[3].retired) return; out.push(['upgrade ' + room + ' ' + u[0], u[1], 'name']); if (u[4]) out.push(['upgrade ' + room + ' ' + u[0], u[4], 'desc']); }));
    x.SHOP.forEach((it) => { if (it[5]) out.push(['shop ' + it[0], it[5], 'desc']); });
    const ST = window.__qbStory; (ST.steps || []).forEach((s) => { if (s.why) out.push(['story ' + s.id, s.why, 'help']); if (s.scene) { s.scene.lines.forEach((l) => out.push(['scene ' + s.id + ' ' + s.scene.who, typeof l === 'function' ? l() : l, 'line'])); out.push(['scene ' + s.id + ' button', s.scene.yes, 'button']); } });
    (ST.beats || []).forEach((bt) => bt.lines.forEach((l) => out.push(['visit ' + bt.id + ' ' + bt.who, l, 'line'])));
    const T = window.__qbTeam && window.__qbTeam.TEAM; if (T) Object.entries(T).forEach(([id, t]) => { out.push(['team ' + id, t.how, 'desc']); out.push(['team ' + id + ' buff', t.buff.text, 'buff']); });
    const D = window.__qbDungeon && window.__qbDungeon.SETS; if (D) Object.entries(D).forEach(([id, st]) => { out.push(['set ' + id, st.lore, 'desc']); st.pieces.forEach((pc) => out.push(['piece ' + pc.id, pc.d, 'desc'])); });
    return out;
  });
  await b.close();
  const hits = [];
  for (const [who, txt, kind] of lines) {
    const why = [];
    if (/!/.test(txt)) why.push('exclamation mark');
    if (/—/.test(txt)) why.push('em dash');
    const bw = txt.match(BANNED); if (bw) why.push('word "' + bw[0] + '"');
    const q = txt.match(QUIP); if (q) why.push('quip "' + q[0] + '"');
    if (kind === 'desc' && /^upgrade|^shop/.test(who) && txt.length > 95) why.push(txt.length + ' characters');
    if (why.length) hits.push(`${who} (${where(txt)}): "${txt}" -> ${why.join(', ')}`);
  }
  console.log(lines.length, 'lines checked,', hits.length, 'break a rule');
  hits.forEach((h) => console.log('  ' + h));
})();
