// Duplicate names across app/src (QA, v0.92 after w-side's sqHtml/sqCard clash with 29p_square.js): the app is one closure of every
// app/src/*.js in filename order, so two "function x(" declarations anywhere means the LAST one wins everywhere, silently, and two
// top-level "var x=" means the later file overwrites the earlier. Lists every name declared more than once at the start of a line;
// with a reference folder, only the names that are new duplicates (not duplicated in the reference) are flagged.
//   bash tools/windows/node.sh rigtest/qa/dupfn.js <quest-board folder> [reference quest-board folder]
const fs = require('fs'), path = require('path');
const scan = (qb) => {
  const dir = path.join(qb, 'app', 'src'), names = {};
  fs.readdirSync(dir).filter((f) => f.endsWith('.js')).sort().forEach((f) => {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const re of [/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm, /^var\s+([A-Za-z_$][\w$]*)\s*=/gm]) {
      let m; while ((m = re.exec(src))) { const line = src.slice(0, m.index).split('\n').length; (names[m[1]] = names[m[1]] || []).push(`${f}:${line}${re.source.includes('function') ? '' : ' (var)'}`); }
    }
  });
  return Object.fromEntries(Object.entries(names).filter(([, v]) => v.length > 1));
};
const [qb, ref] = process.argv.slice(2);
const d = scan(qb), r = ref ? scan(ref) : {};
const fresh = Object.keys(d).filter((k) => !r[k] || r[k].length < d[k].length);
console.log(`${Object.keys(d).length} names declared more than once${ref ? `; ${Object.keys(r).length} in the reference` : ''}`);
fresh.forEach((k) => console.log(`NEW  ${k}: ${d[k].join(', ')}`));
console.log(fresh.length ? `DUPFN: ${fresh.length} new duplicate(s)` : 'DUPFN: no new duplicates');
process.exit(fresh.length ? 1 : 0);
