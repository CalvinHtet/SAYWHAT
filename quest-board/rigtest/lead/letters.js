// Cal 11-26 (via ROOMS): "Consolidate all patch note updates to 10 lines of messages. Group similar updates together into one sentence if it
// fits." Every update letter (a V..LETTER with subj "Update x.yz") has at most 10 lines, each one sentence. No browser needed.
//   node rigtest/lead/letters.js
const fs = require('fs'), path = require('path'); const dir = path.join(__dirname, '../../app/src'); let bad = 0, n = 0;
for (const f of fs.readdirSync(dir).filter((x) => /\.js$/.test(x))) { const s = fs.readFileSync(path.join(dir, f), 'utf8'); const re = /subj:"Update [\d.]+"[\s\S]*?<\/ul>/g; let m;
  while ((m = re.exec(s))) { n++; const li = [...m[0].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => x[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, "'"));
    const multi = li.filter((t) => /[.!?]\s+[A-Z]/.test(t)); const ok = li.length <= 10 && !multi.length; if (!ok) bad++;
    console.log((ok ? 'ok   ' : 'BAD  ') + f + ' ' + (/subj:"(Update [\d.]+)"/.exec(m[0]) || [])[1] + ': ' + li.length + ' lines' + (multi.length ? ', more than one sentence: ' + multi.join(' | ') : '')); } }
console.log(n && !bad ? 'PASS' : 'FAILED ' + (bad || 'no letters found'));
