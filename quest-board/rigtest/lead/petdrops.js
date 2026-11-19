// The Pet Shop's drops (29zz_pets.js pzOrder/pzDrop) with the real data, 40 Mon/Thu slots, in Node: each line shows 2 pieces a drop
// (1 where a missing piece has no stand-in), never a piece in two drops running, and every piece with art within one round (6 drops).
// Then, as if the 4 missing dog pieces' art landed: every slot that then shows only pieces that had art before is unchanged (a slot that
// used a stand-in for a missing piece switches to the real one).
//   node rigtest/lead/petdrops.js
const fs = require('fs'), src = fs.readFileSync(__dirname + '/../../app/src/29zz_pets.js', 'utf8');
let bad = 0; const ok = (c, s) => { if (!c) bad++; console.log((c ? 'ok   ' : 'BAD  ') + s); };
const grab = (name) => { const i = src.indexOf('function ' + name + '('); let d = 0, j = src.indexOf('{', i); for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}' && !--d) break; } return src.slice(i, j + 1); };
const pre = src.match(/var PCNAME=\{[\s\S]*?\};/)[0], pzp = src.match(/var PZPRE=[^;]*;/)[0];
const run = (C) => { let slot = 0; const env = new Function('C', 'slotRef', pre + pzp + 'var pzCl=function(){return C},pzSlotNow=function(){return slotRef.s};' + grab('pzLine') + grab('pzOrder') + grab('pzDrop') + 'return pzDrop;');
  const ref = { s: 0 }, f = env(C, ref), res = {}; for (const line of ['wolf', 'wyvern', 'slime', 'dogs']) { res[line] = []; for (let s = 0; s < 40; s++) { ref.s = s; res[line].push(f(line)); } } return res; };
const C = JSON.parse(fs.readFileSync(__dirname + '/../../data/pet_clothes.json', 'utf8')), A = run(C);
for (const line of Object.keys(A)) { const d = A[line], have = Object.keys(C).filter((id) => (line === 'dogs' ? id.startsWith('pd_') : C[id].pet === line));
  const run2 = d.every((x, i) => i === 0 || !x.some((id) => d[i - 1].includes(id))), sizes = d.every((x) => x.length >= 1 && x.length <= 2), cover = have.every((id) => d.slice(0, 6).some((x) => x.includes(id)));
  ok(run2 && sizes && cover, `${line}: ${have.length} with art, sizes ${[...new Set(d.map((x) => x.length))]}, no piece two drops running ${run2}, all within 6 drops ${cover}; first 3: ${JSON.stringify(d.slice(0, 3))}`); }
const C2 = JSON.parse(JSON.stringify(C)); ['pd_fleece', 'pd_hearts', 'pd_bubbles', 'pd_treats'].forEach((id) => { C2[id] = { pet: 'dogs', kind: 'body', cells: [] }; }); const B = run(C2);
const keep = B.dogs.every((x, i) => !x.every((id) => C[id]) || JSON.stringify(x) === JSON.stringify(A.dogs[i])), others = ['wolf', 'wyvern', 'slime'].every((l) => JSON.stringify(A[l]) === JSON.stringify(B[l]));
ok(keep && others, 'new dog art changes only the slots that used a stand-in, and leaves the other lines untouched');
console.log(bad ? 'FAILED ' + bad : 'PASS');
