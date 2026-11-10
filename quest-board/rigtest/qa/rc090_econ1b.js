// rc-0.90 econ: offline analysis of econ1_raw.json (no browser)
const r = JSON.parse(require('fs').readFileSync((process.env.OUT || 'C:/Users/clvh/qa-wt/out/rc090/econ/') + 'econ1_raw.json', 'utf8')), N = r.new;
const open = ['bedroom','closet','lair','trophy','patio','gameroom','garden','restaurant','boba','dessert','skybar','rooftop','mall','theater','auditorium','arcade','rhythm','vr','bowling','karaoke','club'];
let n = 0, t = 0; open.forEach((k) => { (N.rooms[k] || []).filter((a) => a.c > 0 && !a.ret).forEach((a) => { n++; t += a.c; }); });
console.log('openable rooms upgrades', n, 'total', t);
console.log('rooms in ADDONS', Object.keys(N.rooms).join(','));
console.log('bedroom', N.rooms.bedroom.filter((a) => a.c > 0 && !a.ret).map((a) => a.id + '=' + a.c).join(' '));
['bedroom','closet','gameroom','patio'].forEach((k) => { const L = N.rooms[k].filter((a) => a.c > 0 && !a.ret); console.log(k, 'n', L.length, 'xp sum', Math.round(L.reduce((s, a) => s + a.xp, 0) * 100) / 100, 'openers', L.filter((a) => a.opens).map((a) => a.id + '>' + a.opens).join(','), 'expansions', L.filter((a) => a.g === 'Expansion').map((a) => a.id).join(','), 'min/max xp', Math.min(...L.filter((a)=>a.xp>0).map((a) => a.xp)), Math.max(...L.map((a) => a.xp))); });
['theater','club','boba','mall'].forEach((k)=>{console.log(k, N.rooms[k].filter((a)=>a.p>0&&!a.ret&&!a.opens).map((a)=>a.id+'='+a.c+'/p'+a.p).join(' '))});
