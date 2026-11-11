// picsOk() from firestore.rules (rc-v0.92c: chat lines and photo posts may hold pictures only from this project's Storage), run in
// JavaScript on test docs, since the rules themselves can't run here (no emulator). The three regexes are read out of the rules file
// itself (rules string escapes undone), so this follows the file; RE2 and JavaScript agree on everything these patterns use (classes,
// alternation, (?s) as the "s" flag, full-string matches() as ^...$). Each case: the doc's j string, allowed or refused.
//   bash tools/windows/node.sh rigtest/qa/picsok_sim.js [path/to/firestore.rules]
const fs = require('fs');
const src = fs.readFileSync(process.argv[2] || require('path').join(__dirname, '..', '..', 'firestore.rules'), 'utf8');
const fn = src.slice(src.indexOf('function picsOk()'), src.indexOf('}', src.indexOf('function picsOk()')));
const lits = [...fn.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\\\/g, '\\'));
if (lits.length < 4) { console.log('could not read picsOk from the rules:', fn.slice(0, 200)); process.exit(2); }
const re = (s, g) => new RegExp((g ? '' : '^') + s.replace(/^\(\?s\)/, '') + (g ? '' : '$'), 's' + (g ? 'g' : ''));
const [mEsc, rFrom, rTo, mLeft] = lits; const ESC = re(mEsc), FROM = re(rFrom, true), LEFT = re(mLeft);
const picsOk = (j) => !ESC.test(j) && !LEFT.test(j.replace(FROM, rTo));
const B = 'https://firebasestorage.googleapis.com/v0/b/saywhat-b7ae8.firebasestorage.app/o/photos%2Fu1%2F';
const post = (o) => JSON.stringify(Object.assign({ u: 'u1', name: 'Sam', cap: 'Leg day', kind: 'photo', full: B + '1.jpg?alt=media&token=t', thumb: B + '1_t.jpg?alt=media&token=t', sp: 'photos/u1/1', w: 1080, h: 810, t: 1 }, o));
const chat = (p, x) => JSON.stringify({ name: 'Sam', t: 1, msgs: { 1: [{ x: x || 'hi', t: 1 }, p ? { x: '', t: 2, p } : { x: 'yo', t: 2 }], 2: [], 3: [] } });
const P = []; const ok = (c, s) => { console.log((c ? 'ok   ' : 'BAD  ') + s); if (!c) P.push(s); };
const cases = [
  ['a real photo post (our bucket)', post({}), true],
  ['a chat doc with no pictures', chat(null), true],
  ['a chat line with a picture from our bucket', chat({ f: B + 'chat_1.jpg?alt=media', th: B + 'chat_1_t.jpg?alt=media', sp: 'photos/u1/chat_1', w: 720, h: 540 }), true],
  ['a sandbox JPEG data URL', post({ full: 'data:image/jpeg;base64,/9j/4AAQ', thumb: 'data:image/jpeg;base64,/9j/4AAQ' }), true],
  ['an emoji and an accent in the caption', post({ cap: 'Café 🏋️ done' }), true],
  ['a control character in the caption (JSON escapes it as \\u0001)', post({ cap: 'a\u0001b' }), true],
  ['a caption that SAYS "full":"https://evil" (escaped inside the string)', post({ cap: '"full":"https://evil.example/x.jpg"' }), true],
  ['full from another host', post({ full: 'https://evil.example/x.jpg' }), false],
  ['only thumb from another host', post({ thumb: 'https://evil.example/t.jpg' }), false],
  ['another Firebase bucket', post({ full: 'https://firebasestorage.googleapis.com/v0/b/other-proj.appspot.com/o/x.jpg' }), false],
  ['our bucket as a subdomain trick', post({ full: 'https://firebasestorage.googleapis.com.evil.example/v0/b/saywhat-b7ae8.firebasestorage.app/o/x' }), false],
  ['a chat picture from another host', chat({ f: 'https://evil.example/x.jpg', th: B + 'chat_1_t.jpg' }), false],
  ['spaces around the colon', post({}).replace('"full":"' + B, '"full" : "https://evil.example/'), false],
  ['the key spelled with \\u escapes', post({}).replace('"full":', '"\\u0066ull":').replace(B + '1.jpg', 'https://evil.example/'), false],
  ['the scheme spelled with \\u escapes', post({ full: 'PLACEHOLDER' }).replace('PLACEHOLDER', '\\u0068ttps://evil.example/x.jpg'), false],
  ['an array value', post({}).replace('"full":"' + B + '1.jpg?alt=media&token=t"', '"full":["https://evil.example/x.jpg"]'), false],
  ['an object value', post({}).replace('"thumb":"' + B + '1_t.jpg?alt=media&token=t"', '"thumb":{"u":"https://evil.example/x.jpg"}'), false],
  ['a duplicate key: ours, then another host', post({}).replace('"sp":', '"full":"https://evil.example/x.jpg","sp":'), false],
  ['a javascript: URL', post({ full: 'javascript:alert(1)' }), false],
  ['a data URL that is not a JPEG', post({ full: 'data:image/svg+xml;base64,PHN2Zz4=' }), false],
];
for (const [name, j, want] of cases) { const got = picsOk(j); ok(got === want, `${want ? 'allowed' : 'refused'}: ${name} (rules say ${got ? 'allow' : 'refuse'})`); }
console.log(P.length ? `PICSOK: ${P.length} problem(s)` : `PICSOK: PASS (${cases.length} cases)`);
process.exit(P.length ? 1 : 0);
