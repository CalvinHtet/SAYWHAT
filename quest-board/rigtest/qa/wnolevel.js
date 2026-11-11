// rc-v0.91 rule (Cal, LEAD 17:59): the building tab has NO level or day gates. A level-1 save with plenty of coins opens every room
// (test hook) and reads every room window (all its cards), the build window of an empty lot and the Goals: no "Level N", "Lv N",
// "Reach level", "Unlocks at level", "tomorrow" or "a new day". Also the data: upgrades with a level (meta lv > 1) and lots with
// ROOMT lv > 1, and whether either still blocks a level-1 buy. Level gates stay on Shop floors, clothes, Rafe/Nova and dungeons.
//   BASE=<build> CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/wnolevel.js
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8817';
const RE = /\b(Level \d+|Lv\.? ?\d+|LV \d+|Reach level|Unlocks? at level|level \d+|tomorrow|a new day|next day|come back)\b/gi;
(async () => {
  const br = await browser(); const pg = await boot(br, { base: BASE }); await E(pg, 'W.closeAll()');
  const data = await pg.ev(`(function(){var x=window.__qb.x(),A=x.ADDONS,T=x.ROOMT,up=[],lots=[];Object.keys(A).forEach(function(k){(A[k]||[]).forEach(function(a){var e=a[3]||{};if((e.lv||0)>1&&!e.retired)up.push(k+'.'+a[0]+' lv'+e.lv)})});
    Object.keys(T).forEach(function(k){if((T[k].lv||0)>1)lots.push(k+' lv'+T[k].lv)});return {lvl:x.effLvl(),up:up,lots:lots}})()`);
  console.log(`level ${data.lvl}; upgrades with a level in their data: ${data.up.length}${data.up.length ? ' [' + data.up.slice(0, 12).join(', ') + (data.up.length > 12 ? ' ...' : '') + ']' : ''}; lots/rooms with ROOMT lv > 1: ${data.lots.length}${data.lots.length ? ' [' + data.lots.join(', ') + ']' : ''}`);
  // every room open (Loft, Kode Plaza, the Mall), 10M coins, the story steps done so nothing waits on them
  const rooms = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=1e7;['closet','patio','gameroom','lair','garden','restaurant','skybar','rooftop','boba','dessert','mall','theater','auditorium','arcade','rhythm','vr','bowling','karaoke','club'].forEach(function(t){try{window.__qbRooms.open(t,1)}catch(e){}});
    x.persist();x.render();return S.base.slots.filter(Boolean).map(function(r){return r.t})})()`);
  console.log('rooms open:', rooms.join(' '), '| level', await pg.ev('window.__qb.x().effLvl()'));
  let hits = 0;
  for (const t of rooms) {
    const txt = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${t}'});
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(500);var m=document.querySelector('#layer .modal');if(!m)return '';
      m.querySelectorAll('details').forEach(function(d){d.open=true});var t=m.innerText;[].forEach.call(m.querySelectorAll('[aria-label]'),function(e){t+='\\n'+e.getAttribute('aria-label')});document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return t})()`);
    const h = [...new Set((txt.match(RE) || []))]; if (h.length) { hits++; const ctx = []; const g = new RegExp(RE.source, 'gi'); let m; while ((m = g.exec(txt)) && ctx.length < 3) ctx.push(txt.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' '));
      console.log(`  ${t}: ${JSON.stringify(h)} :: ${ctx.join(' || ')}`); }
  }
  console.log(`room windows with level/day words: ${hits} of ${rooms.length}`);
  // a level-1 buy of the most "level-gated" upgrades in the data, through the card
  if (data.up.length) {
    const tryBuy = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},x=window.__qb.x(),S=x.S,out=[];var L=${JSON.stringify(data.up.slice(0, 6))};
      for(var s of L){var k=s.split('.')[0],id=s.split('.')[1].split(' ')[0],i=S.base.slots.findIndex(function(r){return r&&r.t===k});if(i<0){out.push(s+': room not open');continue}
        document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(400);var b=document.querySelector('#layer [data-act=raddon][data-id="'+id+'"]');
        var c=b?b.closest('.addon').innerText.replace(/\\s+/g,' ').slice(0,80):'(no card shown)';out.push(s+': '+c)}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return out})()`);
    tryBuy.forEach((l) => console.log('  level-1 card for ' + l));
  }
  // the Goals and an empty lot's build window
  const goals = await pg.ev('[0,1,2].map(function(b){return window.__qbGoals.list(b).map(function(g){return g.txt+" "+(g.prog||"")}).join(" | ")}).join("\\n")');
  const gh = goals.match(RE) || []; console.log('Goals with level/day words:', gh.length ? JSON.stringify([...new Set(gh)]) : 'none');
  console.log('page errors', pg.errs.length, pg.errs.slice(0, 2));
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
