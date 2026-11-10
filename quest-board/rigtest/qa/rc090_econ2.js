// rc-0.90 economy QA, part 2: Room Bonus (XP of one quest with 0 / 1 / 4 Loft rooms fully upgraded, partial rooms, the stat
// panel), the second accessory gate (level 19 vs 20, same piece, same body part) and its rig frames (male and female, idle / walk /
// sit), face cosmetics (a_xface) in the Shop. Fresh profiles on the rc-0.90 sandbox; nothing is saved outside the page.
//   CHROME_PORT=9374 bash tools/windows/node.sh rigtest/qa/rc090_econ2.js
const fs = require('fs');
const { browser, sleep } = require('./cdp.js');
const BASE = process.env.BASE || 'http://127.0.0.1:8816', OUT = 'C:/Users/clvh/qa-wt/out/rc090/econ/';
const PART = process.env.PART || 'rb,acc';
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await browser();
  const boot = async (sex) => {
    const pg = await br.page({ fresh: true });
    await pg.go(BASE + '/');
    await pg.wait('!!(window.__qb && window.__qb.x && window.QBLoft && document.querySelector("#app"))', 120000);
    await sleep(1500);
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.created=true;S.char=window.__qb.fixChar({name:'QA',sex:'${sex}'});S.welcomed=1;S.xp=Math.max(S.xp||0,10);
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});x.persist();x.render();return 1})()`);
    await sleep(800);
    return pg;
  };
  const clear = (pg) => pg.ev(`(function(){document.querySelectorAll('#layer .modal,.modal,.dropsplash').forEach(function(e){e.remove()});return 1})()`);
  if (PART.includes('rb')) {
    const pg = await boot('m');
    // a 100 XP quest and a 25 XP quest; no streak, no rested XP, rank 0 (no combo / bounty), so only room buffs move the XP
    const setup = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.quests.push({id:'qa100',name:'QA 100',xp:100,stat:'discipline',cl:'home',rep:'daily'},{id:'qa25',name:'QA 25',xp:25,stat:'fitness',cl:'body',rep:'daily'});
      S.rest={x:0,from:''};S.streak=0;S.gates=[];x.persist();return {lvl:x.effLvl(),rooms:S.base.slots.filter(Boolean).map(function(r){return r.t+':'+Object.keys(r.a||{}).length})}})()`);
    console.log('setup', JSON.stringify(setup));
    const measure = (tag) => pg.ev(`(function(){var x=window.__qb.x(),S=x.S,q=S.quests.filter(function(q){return q.id==='qa100'})[0],q2=S.quests.filter(function(q){return q.id==='qa25'})[0];
      var m=x.mults(q,{}),m2=x.mults(q2,{}),bonus={};S.base.slots.forEach(function(r,i){if(!r)return;if(['bedroom','closet','gameroom','patio'].indexOf(r.t)<0)return;
        var L=(x.ADDONS[r.t]||[]),sh=L.filter(function(a){return r.a&&r.a[a[0]]}).reduce(function(s,a){return s+((a[3]&&a[3].xp)||0)},0);bonus[r.t]=Math.round(sh*1000)/1000});
      /* one real completion of the 100 XP quest and its undo */
      var x0=S.xp;x.toggle('qa100');var got=S.xp-x0;x.toggle('qa100');var back=S.xp===x0;
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      return {tag:'${tag}',xp100:m.hx,xp25:m2.hx,tags:m.tags.join('|'),toggleXp:got,undoOk:back,roomShares:bonus}})()`);
    const rows = [];
    rows.push(await measure('0 rooms (bare bedroom)'));
    await pg.ev(`(function(){window.__qbRooms.all('bedroom',1);return 1})()`); await clear(pg);
    rows.push(await measure('bedroom full'));
    await pg.ev(`(function(){['closet','gameroom','patio'].forEach(function(t){window.__qbRooms.all(t,1)});return 1})()`); await clear(pg);
    rows.push(await measure('4 rooms full'));
    // partial: bedroom half its bonus upgrades, the others empty
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;['closet','gameroom','patio'].forEach(function(t){var r=S.base.slots.filter(function(r){return r&&r.t===t})[0];if(r)r.a={}});
      var r=S.base.slots.filter(function(r){return r&&r.t==='bedroom'})[0],L=(x.ADDONS.bedroom||[]).filter(function(a){var e=a[3]||{};return a[2]>0&&!e.retired&&!e.opens&&e.g!=='Expansion'});
      var keep={};Object.keys(r.a).forEach(function(k){if(!L.some(function(a){return a[0]===k}))keep[k]=1});L.slice(0,14).forEach(function(a){keep[a[0]]=1});r.a=keep;x.persist();x.render();return 1})()`); await clear(pg);
    rows.push(await measure('bedroom 14 bonus upgrades'));
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,r=S.base.slots.filter(function(r){return r&&r.t==='bedroom'})[0],L=(x.ADDONS.bedroom||[]);
      var keep={};Object.keys(r.a).forEach(function(k){var a=L.filter(function(a){return a[0]===k})[0];if(a&&a[3]&&(a[3].opens||a[3].g==='Expansion'))keep[k]=1});keep.bd_bed1=1;r.a=keep;x.persist();x.render();return 1})()`); await clear(pg);
    rows.push(await measure('bedroom only bd_bed1'));
    rows.forEach((r) => console.log(JSON.stringify(r)));
    // the stat panel: bedroom (one piece), then bedroom with 14, the closet full, and a business-less view
    const panel = async (t, file) => {
      await clear(pg);
      const info = await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='${t}'});if(i<0)return null;window.__qb.roomModal(i);
        var c=document.querySelector('.rmodal .chip.xp');return {i:i,chip:c?c.textContent:null,cards:[].slice.call(document.querySelectorAll('.rmodal .addon')).slice(0,6).map(function(e){return e.innerText.replace(/\\s+/g,' ').slice(0,90)})}})()`);
      await sleep(1500);
      await pg.shot(OUT + file);
      console.log('panel ' + t + ' ' + file + ' ' + JSON.stringify(info));
    };
    await panel('bedroom', 'rb_bedroom_1piece.png');
    await pg.ev(`(function(){window.__qbRooms.all('closet',1);window.__qbRooms.all('bedroom',1);var x=window.__qb.x(),S=x.S,r=S.base.slots.filter(function(r){return r&&r.t==='bedroom'})[0],L=(x.ADDONS.bedroom||[]).filter(function(a){var e=a[3]||{};return a[2]>0&&!e.retired&&!e.opens&&e.g!=='Expansion'});
      L.slice(14).forEach(function(a){delete r.a[a[0]]});x.persist();x.render();return 1})()`);
    await panel('bedroom', 'rb_bedroom_14.png');
    await panel('closet', 'rb_closet_full.png');
    // scroll the bedroom window to its upgrade cards with their "+x% XP" shares
    await clear(pg);
    await pg.ev(`(function(){var x=window.__qb.x(),S=x.S,i=S.base.slots.findIndex(function(r){return r&&r.t==='bedroom'});window.__qb.roomModal(i);var sc=document.querySelector('.rmodal .rm-scroll'),c=document.querySelector('.rmodal .addon');if(sc&&c)sc.scrollTop=c.offsetTop-40;return 1})()`);
    await sleep(1200); await pg.shot(OUT + 'rb_bedroom_cards.png');
    const cardTxt = await pg.ev(`[].slice.call(document.querySelectorAll('.rmodal .addon')).slice(0,8).map(function(e){return e.innerText.replace(/\\s+/g,' ').slice(0,120)})`);
    console.log('bedroom cards', JSON.stringify(cardTxt));
    console.log('rb page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    await pg.close();
  }
  if (PART.includes('acc')) {
    const pg = await boot('m');
    const inv = await pg.ev(`(function(){var x=window.__qb.x(),I=QBLoft.data.items,acc=x.SHOP.filter(function(it){return it[1]==='a_acc'&&it[6]&&it[6].gar&&I[it[6].gar]}).map(function(it){return [it[0],it[2],I[it[6].gar].slot,!!it[6].fo,!!it[6].mo]});
      var face=x.SHOP.filter(function(it){return it[1]==='a_xface'}).map(function(it){return [it[0],it[2],it[4]]});
      return {acc:acc,face:face,clips:Object.keys(QBLoft.clips)}})()`);
    const bySlot = {}; inv.acc.forEach((a) => { if (a[3] || a[4]) return; (bySlot[a[2]] = bySlot[a[2]] || []).push(a); });
    console.log('accessories with rig art: ' + inv.acc.length + ' by slot ' + JSON.stringify(Object.fromEntries(Object.entries(bySlot).map(([k, v]) => [k, v.length]))));
    console.log('a_xface items in SHOP: ' + JSON.stringify(inv.face));
    console.log('clips: ' + inv.clips.join(','));
    const slots = Object.keys(bySlot).sort((a, b) => bySlot[b].length - bySlot[a].length);
    const A = bySlot[slots[0]][0], A2 = bySlot[slots[0]][1], B = bySlot[slots[1]][0];
    console.log('first ' + JSON.stringify(A) + ' second ' + JSON.stringify(B) + ' same-slot ' + JSON.stringify(A2));
    const ids = JSON.stringify([A[0], A2[0], B[0]]);
    const gate = (lvl) => pg.ev(`(function(ids,L){var x=window.__qb.x(),S=x.S;S.xp=x.cum(L);S.gates=[];var g,n=0;while((g=x.gated())!==null&&n++<20)S.gates.push(g);
      ids.forEach(function(id){S.owned[id]=true});S.eq.a_acc=ids[0];delete S.eq.a_acc2;S.areaOn=S.areaOn||{};S.areaOn.shop=1;if(!S.base.slots.some(function(r){return r&&r.t==='closet'}))window.__qbRooms.open('closet',1);
      var click=function(id){var b=document.createElement('button');b.dataset.act='equip2';b.dataset.id=id;document.body.appendChild(b);b.click();b.remove();return S.eq.a_acc2||null};
      var out={lvl:x.effLvl()};out.same=click(ids[0]);delete S.eq.a_acc2;out.sameSlot=click(ids[1]);delete S.eq.a_acc2;out.other=click(ids[2]);
      /* the Wardrobe's buttons */
      document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});
      var nb=document.createElement('button');nb.dataset.act='nav';nb.dataset.v='shop';document.body.appendChild(nb);nb.click();nb.remove();
      var tb=document.querySelector('[data-act=stab][data-v=wardrobe]');if(tb)tb.click();
      out.view=document.querySelector('.qshop')?'shop':'?';out.wearSecond=[].slice.call(document.querySelectorAll('[data-act=equip2],[data-act=unequip2]')).map(function(b){return b.dataset.act+':'+(b.dataset.id||'')+':'+b.textContent});
      var lk=window.__qb.lookOf();out.equipped=Object.keys((lk.rig&&lk.rig.equipped)||{});return out})(${ids},${lvl})`);
    const g19 = await gate(19); console.log('level 19: ' + JSON.stringify(g19));
    await pg.shot(OUT + 'acc2_wardrobe_lv19.png');
    const g20 = await gate(20); console.log('level 20: ' + JSON.stringify(g20));
    await sleep(800);
    await pg.ev(`(function(){var b=document.querySelector('[data-act=equip2]');if(b)b.scrollIntoView({block:'center'});return 1})()`); await sleep(800);
    await pg.shot(OUT + 'acc2_wardrobe_lv20.png');
    // switching the first accessory onto the second's body part drops the second from the drawing (not both on one part)
    const swap = await pg.ev(`(function(ids){var x=window.__qb.x(),S=x.S;S.eq.a_acc2=ids[2];var a=Object.keys((window.__qb.lookOf().rig||{}).equipped||{});S.eq.a_acc=ids[2];var b=Object.keys((window.__qb.lookOf().rig||{}).equipped||{});S.eq.a_acc=ids[0];
      var lv=x.effLvl();S.xp=x.cum(19);S.gates=[];var g,n=0;while((g=x.gated())!==null&&n++<20)S.gates.push(g);var c=Object.keys((window.__qb.lookOf().rig||{}).equipped||{});S.xp=x.cum(20);n=0;while((g=x.gated())!==null&&n++<20)S.gates.push(g);
      return {both:a,secondSameAsFirst:b,droppedTo19:c,lvNow:x.effLvl()}})(${ids})`);
    console.log('draw: ' + JSON.stringify(swap));
    // frames: male and female, first only vs both, idle / walk / sit
    const pick = (re) => inv.clips.filter((c) => re.test(c));
    const clips = [pick(/^idle$/)[0] || pick(/idle/)[0], pick(/^walk$/)[0] || pick(/walk/)[0], pick(/^sit/)[0] || pick(/sit|seat|chair/)[0]].filter(Boolean);
    console.log('clips used: ' + clips.join(','));
    const sheet = await pg.ev(`(async function(ids,clips){var x=window.__qb.x(),S=x.S,w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},rows=[];
      for(var sx of ['m','f']){S.char=window.__qb.fixChar(Object.assign({},S.char,{sex:sx}));
        for(var both of [false,true]){S.eq.a_acc=ids[0];if(both)S.eq.a_acc2=ids[2];else delete S.eq.a_acc2;var ch=window.__qb.lookOf().rig,row={sx:sx,both:both,eq:Object.keys(ch.equipped||{}),ims:[]};
          for(var c of clips){var cl=QBLoft.clips[c],fr=cl&&cl.frames>2?Math.floor(cl.frames/3):0;QBLoft.warm(ch,c);var u=null,t=0;while(!u&&t++<200){u=QBLoft.frame(ch,c,fr);if(!u)await w(100)}
            row.ims.push(u?await new Promise(function(ok){var m=new Image();m.onload=function(){ok(m)};m.onerror=function(){ok(null)};m.src=u}):null)}
          rows.push(row)}}
      var fw=Math.max.apply(null,rows.map(function(r){return Math.max.apply(null,r.ims.map(function(m){return m?m.width:0}))})),fh=Math.max.apply(null,rows.map(function(r){return Math.max.apply(null,r.ims.map(function(m){return m?m.height:0}))}));
      var cv=document.createElement('canvas');cv.width=clips.length*fw+40;cv.height=rows.length*(fh+30)+40;var g=cv.getContext('2d');g.fillStyle='#f4f0ea';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#222';g.font='bold 16px sans-serif';
      rows.forEach(function(r,j){g.fillText((r.sx==='m'?'male':'female')+(r.both?' first+second accessory':' first accessory only')+' ['+r.eq.join(',')+']  '+clips.join(' / '),10,j*(fh+30)+30);r.ims.forEach(function(m,k){if(m)g.drawImage(m,20+k*fw,j*(fh+30)+38);else{g.fillStyle='#c00';g.fillText('NOT DRAWN',20+k*fw+20,j*(fh+30)+100);g.fillStyle='#222'}})});
      return {png:cv.toDataURL('image/png'),rows:rows.map(function(r){return {sx:r.sx,both:r.both,eq:r.eq,drawn:r.ims.map(function(m){return !!m})}}),fw:fw,fh:fh}})(${ids},${JSON.stringify(clips)})`, 240000);
    fs.writeFileSync(OUT + 'acc2_frames.png', Buffer.from(sheet.png.split(',')[1], 'base64'));
    console.log('frames ' + sheet.fw + 'x' + sheet.fh + ' ' + JSON.stringify(sheet.rows));
    console.log('acc page errors', pg.errs.length, JSON.stringify(pg.errs.slice(0, 4)));
    await pg.close();
  }
  await br.close(); process.exit(0);
})().catch((e) => { console.log('FAIL ' + e.stack); process.exit(1); });
