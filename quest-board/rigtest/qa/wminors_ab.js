// QA minors a/b on the final tip: (a) a business's "Earns about N coins a day" to the coin and each "+N% income" card "about +M coins a
// day" or "+<1" (never missing); buying one raises N; (b) the Garden list cheapest first, a piece right after what it needs.
const { browser, sleep, boot, E } = require('./wfocus_lib.js');
(async () => {
  const br = await browser(); const pg = await boot(br, { base: process.env.BASE }); await E(pg, 'W.closeAll()'); await E(pg, 'W.lvl(20)');
  await pg.ev(`(function(){var x=window.__qb.x(),S=x.S;S.coins=5e6;['closet','patio','gameroom','garden','restaurant','skybar','rooftop','boba','dessert','mall','arcade'].forEach(function(t){window.__qbRooms.open(t,1)});x.persist();x.render();return 1})()`); await E(pg, 'W.closeAll()');
  for (const t of ['restaurant', 'boba', 'garden', 'mall']) {
    const r = await pg.ev(`(async function(){var w=function(ms){return new Promise(function(o){setTimeout(o,ms)})},S=window.__qb.x().S,i=S.base.slots.findIndex(function(q){return q&&q.t==='${t}'}),out={buys:0,cards:[]};
      var day=function(){var m=document.querySelector('#layer .modal');var s=(m&&m.innerText.match(/Earns about [^\\n.]*/))||null;return s?s[0]:null};
      for(var k=0;k<30;k++){document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(450);
        [].forEach.call(document.querySelectorAll('#layer .addon'),function(e){var m=e.innerText.match(/Earns \\+\\d+% here[^.]*\\./);if(m&&out.cards.length<4&&out.cards.indexOf(m[0])<0)out.cards.push(m[0])});
        var b=[].filter.call(document.querySelectorAll('#layer [data-act=raddon]'),function(x){return !x.classList.contains('ghost')&&!x.disabled})[0];if(!b)break;
        var card=b.closest('.addon').innerText.replace(/\\s+/g,' ');if(/\\+\\d+% (income|produce)/.test(card)){out.before=day();out.card=(card.match(/Earns \\+\\d+% here[^.]*\\./)||[card.slice(0,80)])[0];b.click();await w(700);document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});window.__qb.roomModal(i);await w(450);out.after=day();break}
        b.click();await w(400);out.buys++}document.querySelectorAll('#layer .modal').forEach(function(e){e.remove()});return out})()`, 90000);
    console.log(`a. ${t}: "${r.before}" -> bought "${r.card}" -> "${r.after}" | cards seen: ${JSON.stringify(r.cards)}`);
  }
  const o = await pg.ev(`(function(){var x=window.__qb.x(),R=window.qbDbg.ADDREQ||{},L=(x.ADDONS.garden||[]),by={},key={};L.forEach(function(a){by[a[0]]=a});
    var kf=function(a,d){if(key[a[0]]!=null)return key[a[0]];var e=a[3]||{},q=by[R[a[0]]]||by[e.also],v=+a[2]||0;if(q&&d<5&&!(q[3]&&q[3].retired))v=Math.max(v,kf(q,d+1)+.5);return key[a[0]]=v};
    var live=L.filter(function(a){return !(a[3]&&a[3].retired)}),bad=[];for(var i=1;i<live.length;i++){if(kf(live[i],0)<kf(live[i-1],0))bad.push(live[i-1][0]+' '+live[i-1][2]+' > '+live[i][0]+' '+live[i][2])}
    var ids=live.map(function(a){return a[0]});return {bad:bad,grape:ids.indexOf('g_grape'),spr:ids.indexOf('g_spr'),pump:ids.indexOf('g_pump'),x2:ids.indexOf('g_x2')}})()`);
  console.log('b. Garden order:', JSON.stringify(o));
  console.log('page errors', pg.errs.length); await br.close(); process.exit(0);
})();
