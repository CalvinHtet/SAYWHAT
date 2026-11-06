/*LOFT-END*/
function roomCell(i){
  var r=bslot(i), lv=effLvl(), fl=Math.floor(i/2);
  if(!r)return '<button class="rcell empty" data-act="rbuild" data-i="'+i+'"><span class="plus">+</span><span class="label">Build</span></button>';
  var T=ROOMT[r.t], h='<div class="rcell" data-act="room" data-i="'+i+'">'+roomArt(r);
  var ws=roomCrew(i).map(function(k,j){return walkerHtml(crewLook(CREW[k].a),j+i*3)});
  if(r.t==="lounge"){ws.unshift(walkerHtml(lookOf(),99));crewUnlocked().filter(function(k){return S.base.crew[k]==null}).slice(0,3).forEach(function(k,j){ws.push(walkerHtml(crewLook(CREW[k].a),j+40))})}
  h+='<div class="walkers">'+ws.join("")+'</div>';
  var pend=Math.floor(r.pend||0);
  if(T.coin&&pend>=1&&(typeof payRoom!=="function"||payRoom()>=1))h+='<button class="bub" data-act="rcollect" data-i="'+i+'" aria-label="Collect '+pend+' coins"><i class="coin"></i><b class="mono">'+pend+'</b></button>';
  h+='<div class="rlabel"><b>'+esc(T.name)+'</b><span class="mono">'+(T.coin?Math.round(coinRate(i))+'/h':T.food?FOODN[T.food]+' '+(T.rate*roomMult(i)*openMult()).toFixed(1)+'/h':T.buff?'+'+baseBuffs().filter(function(x){return x.who===T.name})[0].b.pct+'% XP':'')+'</span></div>';
  return h+'</div>';
}
function baseHtml(){
  simulate();
  var B=S.base,rate=B.slots.reduce(function(s,r,i){return s+(r&&ROOMT[r.t].coin?coinRate(i):0)},0),tot=B.slots.reduce(function(s,r){return s+(r&&r.pend?Math.floor(r.pend):0)},0);
  var hud='<div class="lfhud mono"><span><i class="coin"></i>&nbsp;'+Math.floor(S.coins)+'</span>'+(B.slots.some(function(r){return r&&r.t==="restaurant"})?'<span>'+Math.round(rate)+' / hr</span>':'')+'</div>'+(function(){/* Cal, 2026-11-06: "it still says collect coins when I have nothing left to collect": the button offers only what
    today's share still pays (payRoom); coins past it wait in the rooms, shown as a quiet note, not a Collect button */
    var can=Math.min(tot,typeof payRoom==="function"?payRoom():tot);return can>=1?'<button class="btn lfcol" data-act="rall"><i class="coin"></i>&nbsp;Collect '+can+'</button>':tot>=1?'<span class="lfcol lfwait mono">'+tot+' waiting &middot; finish a quest</span>':''})();
  if(LFBSEL!=null)hud+='<div class="lfbtop"><button class="btn ghost" data-act="bldout" aria-label="Back to the street">&larr; Street</button><b>'+esc(BLD[LFBSEL].name)+'</b></div>';
  return lfHtml().replace('<div class="lfctl">',hud+'<div class="lfctl">');
}
var DROP=null;
function dropCrate(){return '<svg viewBox="0 0 16 16" width="64" height="64" shape-rendering="crispEdges"><rect x="1" y="3" width="14" height="12" fill="#8a5a30"/><rect x="1" y="3" width="14" height="2" fill="#c08a4c"/><rect x="7" y="3" width="2" height="12" fill="#ffc857"/><rect x="1" y="8" width="14" height="2" fill="#6b4524"/><rect x="5" y="0" width="6" height="3" fill="#ffc857"/><rect x="2" y="14" width="12" height="1" fill="#4a2f17"/></svg>'}
function decorHtml(i,r){
  var th=LFTH[r.t];if(!window.LFTEX||!th||th.out||r.t==="theater"||r.t==="auditorium"||ROOMDEF[r.t])return "";
  /* QA (Restaurant pass #9): Noir's painted shell sets the whole look, so every Room style looked the same: hide the list then */
  if(r.t==="restaurant"&&r.a&&r.a.r_noir&&r.a.r_x2)return "";
  var sets=lfDecSets(r.t),cur=lfDecFor(r,th),s='<details class="acol" data-k="st"'+(LFACOL.st?' open':'')+'><summary>Room style</summary><div class="dstyles">';
  sets.forEach(function(q){var un=lfDecUnlocked(r,q),on=cur&&cur.id===q.id,acc=q.acc?'<i style="'+(q.acc.tex?'background-image:url('+lfTexUrl("w_"+q.acc.tex)+')':'background:'+q.acc.c)+'"></i>':'';
    s+='<div class="dst'+(on?' on':'')+'"><div class="dsprev"><i style="background-image:url('+lfTexUrl("f_"+q.fl)+')"></i><i style="background:'+(q.wc||'#ccc')+'"></i>'+acc+'</div><b>'+esc(q.name)+'</b>'+(on?'<span class="chip">Active</span>':un?'<button class="btn ghost" data-act="decuse" data-i="'+i+'" data-v="'+q.id+'">Use</button>':'<button class="btn" data-act="decbuy" data-i="'+i+'" data-v="'+q.id+'"><i class="coin"></i>&nbsp;'+q.cost+'</button>')+'</div>'});
  return s+'</div></details>'}
function decorSet(i,act,v){var r=bslot(i);if(!r)return;var q=lfDecSets(r.t).filter(function(x){return x.id===v})[0];if(!q)return;
  if(act==="decbuy"&&!lfDecUnlocked(r,q)){if(S.coins<q.cost){pop("Need "+(q.cost-S.coins)+" more coins");return}S.coins-=q.cost;S.spent+=q.cost;if(!r.du)r.du={};r.du[q.id]=1;pop(q.name+" unlocked")}
  if(!lfDecUnlocked(r,q))return;r.ds=q.id;render();persist();roomModal(i)}
var LFACOL={av:1,in:0,st:0};
var LFRMS={};
function roomModal(i){
  var osc=document.querySelector(".rmodal .rm-scroll");if(osc&&osc.dataset.i===String(i))LFRMS[i]=osc.scrollTop;else if(!osc)LFRMS[i]=0;
  closeModals();
  simulate();
  var r=bslot(i); if(!r)return; var T=ROOMT[r.t], list=ADDONS[r.t]||[], own=addonsOf(r);
  var cph=Math.round(coinRate(i)),stat=T.coin?cph+' coin'+(cph===1?'':'s')+' an hour, holds '+roomStore(r)+' hours':T.food?(T.rate*roomMult(i)*openMult()).toFixed(1)+' '+FOODN[T.food].toLowerCase()+' an hour':T.buff?baseBuffs().filter(function(x){return x.who===T.name})[0].b.text:(T.note||'Yours to fill.');
  /* QA: the payout sentence ran off a phone inside the chip; it is its own line now */
  var payln=T.coin?'<p class="note">Your businesses can pay out '+payRoom().toLocaleString()+' more coins today.</p>':'';
  var h='<div class="card box2 rmodal">'+'<h2 class="rm-title">'+esc(T.name)+'</h2><div class="rbig" id="rbigw" data-room="'+i+'" style="background:linear-gradient(180deg,'+lfSkyCols()[0]+','+lfSkyCols()[1]+')">'+lfPreview(r,90+i)+rmArrows(r)+'</div><div class="rm-scroll" data-i="'+i+'"><p class="note">'+esc(T.desc)+'</p><div class="chip xp" style="align-self:flex-start;white-space:normal;max-width:100%">'+esc(stat)+'</div>'+payln;
  if(r.t==="restaurant")h+=rsNote(r)+'<p class="note">Menu: '+esc(SVC.restaurant.menu(r).join(", "))+'. '+(openMult()<1?'The kitchen runs at '+Math.round(openMult()*100)+'% today. Complete the Daily Quest for full speed.':'Full speed today.')+'</p>';
  if(r.t==="garden")h+=gdNote(r)+gdWaterHtml()+stySellHtml();if(r.t==="theater")h+=thNote(r);h+=helpBtn(r.t);
  if(false){
    var rc=roomCrew(i), free=crewUnlocked().filter(function(k){return S.base.crew[k]==null});
    h+='<span class="label">Crew '+rc.length+'/'+crewCap(r)+'</span><div class="crewpick">'+rc.map(function(k){return '<button class="cpk on" data-act="runassign" data-c="'+k+'" data-i="'+i+'">'+crewSvg(CREW[k].a,36)+'<small>'+esc(CREW[k].name)+'</small></button>'}).join("")
      +(rc.length<crewCap(r)?free.map(function(k){return '<button class="cpk" data-act="rassign" data-c="'+k+'" data-i="'+i+'">'+crewSvg(CREW[k].a,36)+'<small>+ '+esc(CREW[k].name)+'</small></button>'}).join(""):'')
      +(!rc.length&&!free.length?'<span class="note">No free crew. Hire specialists on the Loft tab, or wait for neighbours to move in on their own.</span>':'')+'</div>';
  }
  h+=decorHtml(i,r)+'<details class="acol" data-k="av"'+(LFACOL.av?' open':'')+'><summary>@@AV@@</summary><div class="addons">';
  var inst=[],avail=[],lockd=[];
  lfMigA(r);var TSUP={gm_lux1:[],r_tab1:['r_tab2'],r_stl1:['r_stl2'],r_ctr1:['r_ctr2'],r_booth:['r_booth2'],r_pend:['r_chan'],r_wine:['r_wine2'],bd_bed1:['bd_bed2'],bd_chair0:['bd_chair1','bd_chair2'],bd_chair1:['bd_chair2'],bd_ward1:['bd_ward2'],bd_pc1:['bd_pc2'],bd_win2:['bd_win3']},TCH={au_lux1:1,au_lux2:1,au_lux3:1,au_lux4:1,au_imax:1,au_recline:1,au_rows:1,t_bar:1,l_lux1:1,l_lux2:1,l_lux3:1,l_lux4:1,y_lux1:1,y_lux2:1,y_lux3:1,y_lux4:1,b_lux1:1,b_lux2:1,b_lux3:1,b_lux4:1,lb_lux1:1,lb_lux2:1,lb_lux3:1,lb_lux4:1,t_lux1:1,t_lux2:1,t_lux3:1,t_lux4:1,d_lux1:1,d_lux2:1,d_lux3:1,d_lux4:1,c_lux1:1,c_lux2:1,c_lux3:1,c_lux4:1,sp_lux1:1,sp_lux2:1,sp_lux3:1,sp_lux4:1,gm_lux1:1,gm_lux2:1,gm_lux3:1,gm_lux4:1,gm_lux5:1,r_tab2:1,r_stl2:1,r_ctr2:1,r_booth2:1,r_chan:1,r_wine2:1,bd_bed2:1,bd_chair1:1,bd_chair2:1,bd_ward2:1,bd_pc1:1,bd_pc2:1,bd_win3:1,bd_patio:1,bd_swing:1,bd_pdeco:1,bd_neon:1,bd_fshelf:1};
  Object.assign(TSUP,window.RSSUP||{});Object.assign(TCH,window.RSTCH||{});
  list.forEach(function(a){
    if(a[3]&&a[3].retired)return;/* retired upgrades stay in saves but are never shown or sold */
    var got=r.a&&r.a[a[0]];if((TSUP[a[0]]||[]).some(function(k){return r.a&&r.a[k]}))return;if(TCH[a[0]]&&ADDREQ[a[0]]&&!(r.a&&r.a[ADDREQ[a[0]]]))return;
    if(got){inst.push('<div class="addon got"><b>'+esc(a[1])+'</b><small>'+esc(a[4])+'</small><span class="chip" style="color:var(--done);border-color:var(--done)">Installed</span></div>');return}
    var e=a[3],pre=ADDREQ[a[0]],price=a[2]?'<i class="coin"></i>&nbsp;'+a[2]:'Claim';
    if(pre&&!(r.a&&r.a[pre])){lockd.push('<div class="addon sealed"><b>'+esc(a[1])+'</b><small>'+esc(a[4])+'</small><span class="chip">Needs '+esc(addonName(r,pre))+'</span></div>');return}
    /* Cal: keep the next upgrade a surprise. One level up shows its name; two or more is a mystery card. */
    /* Cal, 2026-11-05: no level locks on upgrades. An upgrade that opens a new room waits for the story (29b_story.js). */
    if(e.trophy&&!dgPieces()){avail.push('<div class="addon next mystery" aria-label="A mystery upgrade"><b>? ? ?</b><small>Bring home your first trophy from a mission</small><button class="btn ghost" disabled>Not yet</button></div>');return}
    var elv=0;if(e.opens&&!styAllows(e.opens)){avail.push('<div class="addon next mystery" aria-label="A mystery upgrade"><b>? ? ?</b><small>'+esc(styWhy(e.opens))+'</small><button class="btn ghost" disabled>Not yet</button></div>');return}
    if(elv&&elv-effLvl()>=2){avail.push('<div class="addon next mystery" aria-label="A mystery upgrade, unlocks at level '+e.lv+'"><b>? ? ?</b><small>A mystery upgrade</small><button class="btn ghost" disabled>Unlocks at level '+e.lv+'</button></div>');return}
    var blk=elv&&effLvl()<elv?'Reach level '+elv:e.also&&!(r.a&&r.a[e.also])?'Needs '+addonName(r,e.also):false&&!(S.cls||(S.gates&&S.gates.length>=e.adv))?'Needs a job advancement first':e.req&&!hasRoom(e.req)?'Build a '+ROOMT[e.req].name+' first':e.served&&S.base.served<e.served?'Serve '+e.served+' dishes ('+Math.floor(S.base.served)+' so far)':'';
    var tag=T.coin||T.food?(e.p?'<em class="uptag up">+'+Math.round(e.p*100)+'% '+(T.food?'produce':'income')+'</em>':'<em class="uptag">Looks only</em>'):'';
    avail.push('<div class="addon next">'+(e.g?'<span class="label">'+esc(e.g)+'</span>':'')+'<b>'+esc(a[1])+'</b><small>'+esc(a[4])+'</small>'+tag+(blk?'<button class="btn ghost" disabled>'+esc(blk)+'</button>':'<button class="btn'+(S.coins<a[2]?' ghost':'')+'" data-act="raddon" data-i="'+i+'" data-id="'+a[0]+'">'+(S.coins<a[2]?price+' · need '+(a[2]-S.coins)+' more':price)+'</button>')+'</div>');
  });
  /* QA (Restaurant pass): three "Needs Knock Through the Wall" cards filled the slots ahead of Knock Through itself, so nothing
     could be bought. Buyable cards first, then mystery cards, then cards waiting on another upgrade; each group keeps its order. */
  avail=avail.map(function(h,k){return {h:h,k:k,g:/ mystery/.test(h)?1:/<button class="btn ghost" disabled>/.test(h)?2:0}}).sort(function(x,y){return x.g-y.g||x.k-y.k}).map(function(x){return x.h});
  /* Cal: only the next 5 at any time, in unlock order, so there is always something new to find. */
  var more=avail.length>4;avail=avail.slice(0,4);if(avail.length===4&&avail[3].indexOf(' mystery')<0)avail[3]='<div class="addon next mystery" aria-label="A mystery upgrade"><b>? ? ?</b><small>A mystery upgrade</small><button class="btn ghost" disabled>Buy one above to reveal it</button></div>';
  h=h.replace("@@AV@@",avail.length?"Next upgrades":lockd.length?"Next upgrades: install the ones before them first":"All upgrades installed");
  h+=avail.join("")+(more?'<p class="note addmore">More appear as you install these.</p>':'')+'</div></details>'+(inst.length?'<details class="acol" data-k="in"'+(LFACOL.in?' open':'')+'><summary>Installed ('+inst.length+')</summary><div class="addons">'+inst.join("")+'</div></details>':'');
  /* owner-only testing link (hidden from guests like the Shop's Testing row; remove both before release): refunds this
     room's upgrades so its stages can be bought again one at a time. Upgrades that open another room stay. */
  if(inst.length)h+='<p class="qs-dev">Testing: <button class="qs-link" data-act="simundo" data-i="'+i+'">Undo this room\'s upgrades</button></p>';
  h+='</div><div class="row"><button class="btn ghost" data-act="mclose">Close</button></div></div>';
  var dp=(DROP&&DROP.i===i)?DROP:null;DROP=null;
  var mm=modal(h);
  mm.querySelectorAll("details.acol").forEach(function(d){d.addEventListener("toggle",function(){LFACOL[d.getAttribute("data-k")]=d.open?1:0})});
  try{lfPvStart(i,mm)}catch(e){}
  var rsc=mm.querySelector(".rm-scroll");if(rsc){rsc.scrollTop=LFRMS[i]||0;requestAnimationFrame(function(){rsc.scrollTop=LFRMS[i]||0});rsc.addEventListener("scroll",function(){LFRMS[i]=rsc.scrollTop},{passive:true})}
  if(dp){var w=mm.querySelector('#rbigw');if(w){try{lfInstallFx(w,r,dp,i,mm)}catch(e){}}}
}
/*V32-INSTALL*/
function isoCrate(){return '<svg viewBox="0 0 60 64" width="60" height="64"><polygon points="30,4 56,17 30,30 4,17" fill="#e0a75e"/><polygon points="4,17 30,30 30,60 4,47" fill="#a8692f"/><polygon points="56,17 30,30 30,60 56,47" fill="#86501f"/><polygon points="17,10.5 43,23.5 43,27 17,14" fill="#ffd36b"/><polygon points="43,10.5 17,23.5 17,27 43,14" fill="#ffd36b" opacity=".85"/><polygon points="15,22.5 19,24.5 19,55 15,53" fill="#ffd36b"/><polygon points="45,22.5 41,24.5 41,55 45,53" fill="#ffd36b"/><polyline points="4,17 30,30 56,17" fill="none" stroke="#5a3414" stroke-width="1.2"/><line x1="30" y1="30" x2="30" y2="60" stroke="#5a3414" stroke-width="1.2"/><polygon points="30,4 56,17 56,47 30,60 4,47 4,17" fill="none" stroke="#3a2210" stroke-width="1.6" stroke-linejoin="round"/></svg>'}
function lfSig(el){return el.outerHTML.replace(/(data-i|id|data-k)="[^"]*"/g,'').replace(/url\(#[^)]*\)/g,'u')}
function lfKids(svg){var out=[].slice.call(svg.children).filter(function(e){return e.tagName!=="defs"&&!e.classList.contains("lfitems")});var it=svg.querySelector(".lfitems");if(it)[].forEach.call(it.children,function(e){if(!/^lfa-/.test(e.id||""))out.push(e)});return out}
function lfSeeded(fn){var s=48271,o=Math.random;Math.random=function(){s=(s*16807)%2147483647;return (s-1)/2147483646};try{return fn()}finally{Math.random=o}}
function lfInstallFx(w,r,dp,i,mm){
  var it0=w.querySelector(".lfitems"),uid=it0?+it0.getAttribute("data-i"):90+i;
  var r2=JSON.parse(JSON.stringify(r));delete r2.a[dp.id];
  var tmp=document.createElement("div");tmp.style.cssText="position:absolute;left:-9999px;top:0;width:10px;height:10px;overflow:hidden;visibility:hidden";
  tmp.innerHTML=lfSeeded(function(){return lfPreview(r2,uid)});document.body.appendChild(tmp);
  var base={},bs=tmp.querySelector("svg");if(bs)lfKids(bs).forEach(function(e){var s=lfSig(e);base[s]=(base[s]||0)+1});tmp.remove();
  /* Cal (v0.48): the door arrows live in the same box, so redraw them with the picture (a new room's arrow showed only after reopening) */
  w.innerHTML=lfSeeded(function(){return lfPreview(r,uid)})+(typeof rmArrows==="function"?rmArrows(r):"");try{lfPvStart(i,mm)}catch(e){}
  var svg=w.querySelector("svg");if(!svg)return;
  var all=lfKids(svg),fresh=all.filter(function(e){var s=lfSig(e);if(base[s]>0){base[s]--;return false}return true});
  if(fresh.length>all.length*.5)fresh=[];
  var wr=w.getBoundingClientRect(),tx=wr.width/2,ty=wr.height*.6;
  if(fresh.length){var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;fresh.forEach(function(e){var b=e.getBoundingClientRect();if(!b.width&&!b.height)return;x0=Math.min(x0,b.left);y0=Math.min(y0,b.top);x1=Math.max(x1,b.right);y1=Math.max(y1,b.bottom)});
    if(x1>x0){tx=(x0+x1)/2-wr.left;ty=y1-wr.top-Math.min(18,(y1-y0)*.25)}
    fresh.forEach(function(e){e.style.opacity="0";e.style.transition="opacity .45s ease-out"})}
  var cr=document.createElement("div");cr.className="isocrate";cr.innerHTML=isoCrate();cr.style.left=(tx-30)+"px";cr.style.top=(ty-60)+"px";
  var sh=document.createElement("div");sh.className="isoshadow";sh.style.left=(tx-26)+"px";sh.style.top=(ty-7)+"px";
  w.appendChild(sh);w.appendChild(cr);
  setTimeout(function(){if(!w.isConnected)return;w.classList.add("dropshake2");
    for(var k=0;k<8;k++){var p=document.createElement("i");p.className="isodust";var a=k/8*Math.PI*2;p.style.left=tx+"px";p.style.top=(ty-6)+"px";p.style.setProperty("--dx",(Math.cos(a)*38).toFixed(0)+"px");p.style.setProperty("--dy",(Math.sin(a)*16).toFixed(0)+"px");w.appendChild(p);(function(p){setTimeout(function(){p.remove()},900)})(p)}
  },620);
  setTimeout(function(){if(!w.isConnected)return;cr.classList.add("open");},1050);
  setTimeout(function(){if(!w.isConnected)return;cr.remove();sh.remove();w.classList.remove("dropshake2");
    fresh.forEach(function(e){e.style.opacity="1";e.classList.add("isonew")});
    var g=document.createElement("div");g.className="isoglow";g.style.left=(tx-60)+"px";g.style.top=(ty-90)+"px";w.appendChild(g);setTimeout(function(){g.remove()},1600);
    var n=document.createElement("div");n.className="dropname";n.style.animationDelay="0s";n.textContent=dp.name+(fresh.length?" installed":" upgrade active");w.appendChild(n);setTimeout(function(){n.remove()},2600);
    setTimeout(function(){fresh.forEach(function(e){e.classList.remove("isonew")})},1800)},1400);
}
function buildModal(i){
  closeModals();
  var lv=effLvl(), types=buildableList();if(!buildableList().length){pop("Nothing to build yet.");return}
  var h='<div class="card box2"><span class="label">Construction</span><h2 style="font-size:30px">Build a room</h2><div class="addons">';
  types.forEach(function(k){var T=ROOMT[k];
    if(T.lv>lv||hasRoom(k)){return}
    h+='<div class="addon next"><div class="bpart'+(ART["room_"+k]?' post':'')+'">'+(ART["room_"+k]?'<img class="rpost" src="'+ART["room_"+k]+'" alt="">':lfPreview({t:k,a:{},st:0},95))+'</div><b>'+esc(T.name)+'</b><small>'+esc(T.desc)+'</small><button class="btn" data-act="rdo" data-i="'+i+'" data-t="'+k+'"><i class="coin"></i>&nbsp;'+T.cost+'</button></div>';
  });
  if(h.indexOf('addon next')<0)h+='<p class="note">No new blueprints yet. Keep leveling.</p>';
  h+='</div><button class="btn ghost" data-act="mclose">Close</button></div>';
  modal(h);
}
function closeModals(){try{lfPvStop()}catch(e){}[].forEach.call(document.querySelectorAll("#layer .modal"),function(m){m.remove()})}
function baseEvent(){
  if(Math.random()>.12)return null;
  var e=EVENTS[Math.floor(Math.random()*EVENTS.length)], g=e[1];
  if(g.coin){S.coins+=g.coin;S.earnedC+=g.coin}
  ["veg","grain","fish"].forEach(function(k){if(g[k])S.base.food[k]=Math.min(foodCap(),S.base.food[k]+g[k])});
  return e[0]+" +"+(g.coin?g.coin+" coins":Object.keys(g).map(function(k){return g[k]+" "+FOODN[k].toLowerCase()}).join(""));
}
function baseAct(a,b,e){
  var i=+b.dataset.i;
  if(a.indexOf("sn")===0&&typeof socialAct==="function"&&socialAct(a,b,e))return true;
  if(a==="lfz"){lfZoom(+b.dataset.d);return true}
  if(a==="lflight"){var rm=bslot(i);if(!rm)return true;rm.lit=rm.lit?0:1;delete S.lfLight;persist();var sc=b.closest(".modal"),top=sc?sc.scrollTop:0;roomModal(i);var nm=document.querySelector("#layer .modal");if(nm)nm.scrollTop=top;render();return true}
  if(a==="room"){roomModal(i);return true}
  if(a==="gotoaud"||a==="gotolobby"){var tt=a==="gotoaud"?"auditorium":"theater",ix=-1;S.base.slots.forEach(function(r,k){if(r&&r.t===tt)ix=k});if(ix<0){pop("Build the Auditorium from Construction (needs the Movie Theater).");return true}roomModal(ix);return true}
  if(a==="rbuild"){buildModal(i);return true}
  if(a==="rdo"){var t=b.dataset.t,T=ROOMT[t];if(hasRoom(t)||S.base.slots[i]||(T.needCls&&!S.cls)||T.bundled)return true;if(S.coins<T.cost){pop("Need "+(T.cost-S.coins)+" more coins");return true}
    S.coins-=T.cost;S.spent+=T.cost;simulate();S.base.slots[i]={t:t,a:{},st:0,pend:0};if(t==="lounge")S.base.loungeT=Date.now();closeModals();render();persist();roomSplash(t);return true}
  if(a==="rcollect"||a==="rall"){simulate();var got=0,room=payRoom(),capped=false;S.base.slots.forEach(function(r,k){if(r&&(a==="rall"||k===i)){var n=Math.min(Math.floor(r.pend||0),Math.max(0,room-got));if(n<Math.floor(r.pend||0))capped=true;r.pend-=n;got+=n}});payTake(got);
    if(capped&&!got){pop("Your businesses have paid out today's share. Finish a quest to collect more.");return true}if(capped)setTimeout(function(){pop("That is today's share. Finish a quest to collect the rest.")},1600);
    if(got){S.coins+=got;S.earnedC+=got;try{styState().biz+=got}catch(x){}var ev=baseEvent();checkBadges();render();persist();if(e&&e.clientX!=null)burst(e.clientX,e.clientY,18);pop("+"+got+" coins");if(ev)setTimeout(function(){pop(ev)},1500)}return true}
  if(a==="rhire"){var hk=b.dataset.c,hc=CREWHIRE[hk];if(!hc||crewCandidates().indexOf(hk)<0)return true;if(S.coins<hc){pop("Need "+(hc-S.coins)+" more coins");return true}
    S.coins-=hc;S.spent+=hc;S.hired[hk]=1;render();persist();burst(innerWidth/2,innerHeight/3,26);pop("Hired "+CREW[hk].name);return true}
  if(a==="raddon"){var r=bslot(i),ad=(ADDONS[r.t]||[]).filter(function(x){return x[0]===b.dataset.id})[0];if(!ad||r.a[ad[0]])return true;
    if(ad[3].req&&!hasRoom(ad[3].req))return true;if(false&&!(S.cls||(S.gates&&S.gates.length>=ad[3].adv))){pop('Needs a job advancement first');return true}if(ADDREQ[ad[0]]&&!r.a[ADDREQ[ad[0]]]){pop("Install "+addonName(r,ADDREQ[ad[0]])+" first");return true}if(ad[3].trophy&&!dgPieces()){pop("Bring home your first trophy first");return true}if(ad[3].opens&&!styAllows(ad[3].opens)){pop("Not yet. Keep growing your business");return true}if(ad[3].also&&!r.a[ad[3].also]){pop("Install "+addonName(r,ad[3].also)+" first");return true}if(ad[3].served&&S.base.served<ad[3].served)return true;
    if(S.coins<ad[2]){pop("Need "+(ad[2]-S.coins)+" more coins");return true}
    simulate();S.coins-=ad[2];S.spent+=ad[2];r.a[ad[0]]=1;if(ad[3].opens&&!hasRoom(ad[3].opens))S.base.slots.push({t:ad[3].opens,a:{},st:0,pend:0});DROP={i:i,id:ad[0],name:ad[1]};render();persist();roomModal(i);if(ad[3].opens&&ROOMHELP[ad[3].opens])roomSplash(ad[3].opens);else if(ad[3].splash)upSplash(ad);try{var fw=document.querySelector(".rmodal .rbig");if(fw)fw.classList.add("rflash")}catch(e){}burst(innerWidth/2,innerHeight/3,24);pop(ad[1]+" installed");return true}
  if(a==="decuse"||a==="decbuy"){decorSet(i,a,b.dataset.v||"");return true}
  if(a==="rpaint"){var r2=bslot(i);if(S.coins<150){pop("Need 150 coins");return true}S.coins-=150;S.spent+=150;r2.st=((r2.st||0)+1)%4;render();persist();roomModal(i);return true}
  if(a==="rassign"){var r3=bslot(i);if(roomCrew(i).length>=crewCap(r3))return true;simulate();S.base.crew[b.dataset.c]=i;render();persist();roomModal(i);pop(CREW[b.dataset.c].name+" clocked in");return true}
  if(a==="runassign"){simulate();delete S.base.crew[b.dataset.c];render();persist();roomModal(i);return true}
  return false;
}
function bpCard(k,i){var T=ROOMT[k];return '<div class="unl reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s"><span class="label">New blueprint</span><div class="unlart'+(ART["room_"+k]?' post':'')+'">'+(ART["room_"+k]?'<img class="rpost" src="'+ART["room_"+k]+'" alt="">':lfPreview({t:k,a:{},st:0},95))+'</div><b>'+esc(T.name)+'</b><small>'+esc(T.desc)+' Build it in your Hideout.</small></div>'}
function floorCard(n,i){return '<div class="unl reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s"><span class="label">The Loft expanded</span><b>Floor '+n+' is open</b><small>Two new slots to build on.</small></div>'}

/* ---------- training tracker ---------- */
/* EX: [name, coach group, sets, reps, lb step (0 = bodyweight)] */
var EX={
 bench:["Barbell Bench Press","chest",4,"6-8",5],incline:["Incline Dumbbell Press","chest",3,"8-10",5],fly:["Cable Fly","chest",3,"12-15",5],dips:["Dips","chest",3,"8-12",0],
 ohp:["Overhead Press","shoulders",3,"6-8",5],lateral:["Lateral Raise","shoulders",3,"12-15",2.5],rear:["Rear Delt Fly","shoulders",3,"12-15",2.5],shrug:["Dumbbell Shrug","shoulders",3,"12-15",5],
 cgbench:["Close-Grip Bench Press","arms",4,"6-8",5],curl:["Barbell Curl","arms",3,"8-10",5],incurl:["Incline Dumbbell Curl","arms",3,"10-12",2.5],hammer:["Hammer Curl","arms",3,"10-12",5],
 pushdown:["Triceps Pushdown","arms",3,"10-12",5],ohext:["Overhead Triceps Extension","arms",3,"10-12",5],farmer:["Farmer Carry","arms",3,"120 ft walk",10],
 chinup:["Chin-up","back",3,"6-10",0],pulldown:["Lat Pulldown","back",4,"8-10",5],row:["Barbell Row","back",4,"6-8",5],cablerow:["Seated Cable Row","back",3,"10-12",5],facepull:["Face Pull","back",3,"12-15",5],deadlift:["Deadlift","back",3,"4-6",10],
 squat:["Back Squat","legs",4,"5-8",10],rdl:["Romanian Deadlift","legs",3,"8-10",10],legpress:["Leg Press","legs",3,"10-12",20],legcurl:["Leg Curl","legs",3,"10-12",5],calf:["Standing Calf Raise","legs",4,"12-15",10],lunge:["Walking Lunge","legs",3,"10 each leg",5],
 hang:["Hanging Leg Raise","core",3,"10-15",0],plank:["Plank","core",3,"45 sec",0],crunch:["Cable Crunch","core",3,"12-15",5],twist:["Russian Twist","core",3,"20 total",5],backext:["Back Extension","core",3,"12-15",0]
};
var MUSC={chest:"chest",shoulders:"shoulders",back:"back",legs:"legs",core:"core",
 bench:"chest",incline:"chest",fly:"chest",dips:"triceps",ohp:"shoulders",lateral:"shoulders",rear:"shoulders",shrug:"shoulders",cgbench:"triceps",curl:"biceps",incurl:"biceps",hammer:"biceps",pushdown:"triceps",ohext:"triceps",farmer:"forearms",
 chinup:"back",pulldown:"back",row:"back",cablerow:"back",facepull:"shoulders",deadlift:"back",squat:"legs",rdl:"legs",legpress:"legs",legcurl:"legs",calf:"legs",lunge:"legs",hang:"core",plank:"core",crunch:"core",twist:"core",backext:"core"};
/* splits: fixed lists. focus days: built around the focus with support work picked by recovery */
var PLANS=[["push","Push"],["pull","Pull"],["legs","Legs"],["full","Full body + abs"],["arms","Arms"],["chest","Chest"],["back","Back"],["shoulders","Shoulders"],["core","Core"]];
var SPLITS={
 push:[["bench","Main lift",4],["incline","Main lift",3],["ohp","Strength",3],["lateral","Superset A"],["pushdown","Superset A"],["facepull","Finisher"],["plank","Finisher"]],
 pull:[["pulldown","Main lift",4],["row","Main lift",3],["cablerow","Superset A"],["curl","Superset A"],["facepull","Superset B"],["hammer","Superset B"],["hang","Finisher"]],
 legs:[["squat","Main lift",4],["rdl","Main lift",3],["legpress","Strength",3],["legcurl","Superset A"],["calf","Superset A"],["chinup","Support pair",3],["dips","Support pair",3],["hang","Finisher"]],
 full:[["squat","Main lift",3],["bench","Main lift",3],["row","Strength",3],["ohp","Strength",3],["hang","Superset A"],["plank","Superset A"],["twist","Finisher"]]
};
var FOCUS={
 arms:{core:[["cgbench","Main lift",3],["chinup","Main lift",3],["curl","Superset A"],["ohext","Superset A"],["incurl","Superset B"],["pushdown","Superset B"]],
  support:[["lateral","shoulders","Side delts make arms look bigger from the front."],["facepull","shoulders","Rear delts balance all the pressing and keep elbows healthy."],["crunch","core","Core work while shoulders recover."],["lunge","legs","A lower-body movement so the day is not upper-only."]],
  finish:["farmer","Grip, forearms and core in one move."],why:"Big compound lifts first while you are fresh, then biceps and triceps paired so one rests while the other works."},
 chest:{core:[["bench","Main lift",4],["incline","Main lift",3],["dips","Superset A"],["fly","Superset A"]],
  support:[["facepull","shoulders","Pulling work balances the pressing."],["pushdown","triceps","Triceps already warm from pressing. Finish them."],["cablerow","back","Upper back work for posture and balance."],["lateral","shoulders","Side delts round out the upper body."]],
  finish:["plank","Core brace for a cleaner bench next time."],why:"Heavy flat press, incline for upper chest, then dips and flies back to back. Support work pulls so the session stays balanced."},
 back:{core:[["deadlift","Main lift",3],["pulldown","Main lift",3],["cablerow","Superset A"],["hammer","Superset A"]],
  support:[["incline","chest","A press balances the pulling."],["facepull","shoulders","Rear delts and upper back together."],["backext","core","Low back endurance."],["lunge","legs","Single-leg work rounds out the day."]],
  finish:["hang","Hanging work stretches the lats and trains the core."],why:"Hinge first for total back strength, then vertical and horizontal pulls, with a press so you are not all pull."},
 shoulders:{core:[["ohp","Main lift",3],["incline","Main lift",3],["lateral","Superset A"],["rear","Superset A"]],
  support:[["chinup","back","Vertical pull balances the overhead press."],["ohext","triceps","Triceps lock out every press."],["shrug","shoulders","Traps finish the yoke."],["crunch","core","Core work if back is still recovering."]],
  finish:["twist","Rotational core to finish."],why:"Overhead press and incline press for strength, then side and rear delts together, plus a pull for balance."},
 core:{core:[["hang","Main lift"],["crunch","Superset A"],["twist","Superset A"]],
  support:[["lunge","legs","Single-leg work forces the core to stabilize."],["backext","core","Low back balances all the ab work."],["chinup","back","Hanging pulls train the trunk too."],["incline","chest","A press so the session covers the upper body."]],
  finish:["farmer","Loaded carry trains the whole trunk."],why:"Flexion and rotation, then full-body support lifts so a core day still trains everything."}
};
var COACH={chest:["rook","Bar to chest, drive it up. Ego stays in the locker."],back:["brisa","Pull with your elbows. Squeeze at the top like you mean it."],shoulders:["dax","Strict press. Leaning back is cheating and we both know it."],
 arms:["juno","Slow on the way down. That is where it grows."],legs:["ko","Depth first. Weight second. Always."],core:["vex","Brace like someone is about to punch you. Breathe behind the brace."]};
var REST={"Main lift":"Rest 2 min","Strength":"Rest 2 min","Superset A":"Back to back, rest 90 sec after both","Superset B":"Back to back, rest 90 sec after both","Support pair":"Back to back, rest 60 sec after both","Finisher":"Rest 45 sec"};
var RESTM={"Main lift":2,"Strength":2,"Finisher":.75};
var DAYPLAN={1:"push",3:"legs",5:"pull",0:"full"};
function planOf(id){return PLANS.filter(function(p){return p[0]===id})[0]||null}
function recentMuscles(days){
  var cut=new Date();cut.setDate(cut.getDate()-days);var c=dstr(cut),o={};
  Object.keys(S.gymlog||{}).forEach(function(k){(S.gymlog[k]||[]).forEach(function(x){if(x.d>=c&&x.d<today())o[MUSC[k]]=1})});
  return o;
}
function estMin(list,roles,setsN){
  var m=5,seen={};
  list.forEach(function(id){if(seen[id])return;var r=roles[id]||"",n=setsN[id]||EX[id][2];
    if(/Superset|Support pair/.test(r)){var mate=list.filter(function(x){return x!==id&&roles[x]===r})[0];if(mate)seen[mate]=1;var n2=mate?Math.max(n,setsN[mate]||EX[mate][2]):n;m+=n2*((mate?1.5:.75)+(r==="Support pair"?1:1.5));}
    else m+=n*(.75+(RESTM[r]||1.25));seen[id]=1});
  return Math.round(m);
}
function buildPlan(id){
  var src=SPLITS[id],F=FOCUS[id],list=[],roles={},notes={},setsN={},note="";
  var add=function(x){list.push(x[0]);roles[x[0]]=x[1];if(x[2])setsN[x[0]]=x[2]};
  if(src){src.forEach(add)}
  else{
    var rec=recentMuscles(2);F.core.forEach(add);
    var picks=F.support.filter(function(x){return !rec[x[1]]&&list.indexOf(x[0])<0}).slice(0,2);
    F.support.forEach(function(x){if(picks.length<2&&picks.indexOf(x)<0&&list.indexOf(x[0])<0)picks.push(x)});
    picks.forEach(function(x){list.push(x[0]);roles[x[0]]="Support pair";setsN[x[0]]=3;notes[x[0]]=x[2]});
    if(F.finish&&list.indexOf(F.finish[0])<0){list.push(F.finish[0]);roles[F.finish[0]]="Finisher";notes[F.finish[0]]=F.finish[1]}
    var sk=F.support.filter(function(x){return rec[x[1]]}).map(function(x){return x[1]}).filter(function(v,i,a){return a.indexOf(v)===i});
    note=F.why+(sk.length?" You trained "+sk.join(" and ")+" in the last 2 days, so support work skips "+(sk.length>1?"them":"it")+".":"");
  }
  var guard=0;while(estMin(list,roles,setsN)>60&&guard++<10){var cut=-1;for(var k=list.length-1;k>=0;k--){if(!/Main/.test(roles[list[k]])){cut=k;break}}if(cut<0)break;list.splice(cut,1)}
  return {list:list,roles:roles,notes:notes,setsN:setsN,note:note,min:estMin(list,roles,setsN)};
}
function wkList(){return (S.wk&&S.wk.list)||[]}
function wkKey(d){d=d||new Date();var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return dstr(x)}
function weekDays(){var m=wkKey(),p=m.split("-"),b=new Date(+p[0],+p[1]-1,+p[2]),o=[];for(var i=0;i<7;i++){var d=new Date(b);d.setDate(b.getDate()+i);o.push(dstr(d))}return o}
function weekCount(){return (S.wcount&&S.wcount[wkKey()])||0}
function unmarkActive(){var wk=wkKey();if(!S.wcount)S.wcount={};S.wcount[wk]=Math.max(0,(S.wcount[wk]||0)-1);if(S.active)delete S.active[today()];persist()}
function weekBonus(){var x=Math.round(Math.max(250,need(Math.min(effLvl(),MAXL-1))*1.2));return {xp:x,coins:Math.round(x*2.5)}}
function grantXp(x,coins,stat){
  var before=effLvl(),wasGate=gated();
  S.xp+=x;if(stat)S.stats[stat]=(S.stats[stat]||0)+1;S.coins+=coins;S.earnedC+=coins;
  var t=today();if(S.dayXp.d!==t)S.dayXp={d:t,x:0};S.dayXp.x+=x;
  render();persist();
  var after=effLvl();if(after>before)levelUp(after,null,before);else if(!wasGate&&gated())gateOpened(gated());
}
function markActive(){
  if(!S.active)S.active={};S.active[today()]=1;
  var wk=wkKey();if(!S.weekPaid)S.weekPaid={};if(!S.wcount)S.wcount={};S.wcount[wk]=(S.wcount[wk]||0)+1;
  if(weekCount()>=4&&!S.weekPaid[wk]){
    S.weekPaid[wk]=1;var wb=weekBonus();
    setTimeout(function(){
      var live=dropState().live.map(function(x){return x.id}),pool=SHOP.filter(function(it){return /^a_/.test(it[1])&&isRigItem(it)&&(it[6].b==="basics"||live.indexOf(it[6].b)>=0)&&!S.owned[it[0]]&&itemFits(it)&&it[4]<=effLvl()+5}),pz=pool.length?pool[Math.floor(Math.random()*pool.length)]:null;
      if(pz){S.owned[pz[0]]=true;persist()}
      var m=modal('<div class="card box2 adv"><span class="label">Weekly quest complete</span><h2>Weekly Warrior</h2><p class="note">4 proven workouts this week.</p><div class="reward reveal">+'+wb.xp+' XP</div><div class="reward reveal" style="animation-delay:.5s">+'+wb.coins+' coins</div>'+(pz?'<div class="reward reveal" style="animation-delay:1s">Prize: '+esc(pz[2])+' (in your Wardrobe)</div>':'')+'<button class="btn big" id="wwok">Claim</button></div>');
      var b=m.querySelector("#wwok");b.onclick=function(){m.remove();grantXp(wb.xp,wb.coins,"fitness");burst(innerWidth/2,innerHeight/3,40)};
    },2200);
  }
  persist();
}
function weekDots(){
  var t=today();
  return '<div class="wdots">'+weekDays().map(function(d,i){var on=S.active&&S.active[d];return '<span class="wd'+(on?" on":"")+(d===t?" tdy":"")+'"><i></i><small>'+"MTWTFSS"[i]+'</small></span>'}).join("")+'</div>';
}
function weekStrip(){
  var n=weekCount(),paid=S.weekPaid&&S.weekPaid[wkKey()],wb=weekBonus();
  return '<section class="card wstrip" data-act="nav" data-v="train"><div><span class="label">Weekly Warrior</span><div class="note">'+(paid?'Claimed this week. Keep moving anyway.':n+'/4 proven workouts. Pays +'+wb.xp+' XP, +'+wb.coins+' coins and a prize')+'</div></div>'+weekDots()+'</section>';
}
function exSuggest(id){
  var E=EX[id],lg=((S.gymlog&&S.gymlog[id])||[]).filter(function(x){return !E[4]||x.w>0}),last=lg[lg.length-1];
  var top=(E[3].match(/(\d+)(?!.*\d)/)||[])[1]||"";
  if(!last)return {w:"",line:E[4]?"First time. Pick a weight you can move for "+top+" clean reps.":"Bodyweight. Clean reps, full range."};
  if(!E[4])return {w:"",line:"Last time: "+last.n+" sets "+(last.hit?"with every rep hit. Add a rep per set.":"done.")};
  var miss=0;for(var i=lg.length-1;i>=0&&!lg[i].hit;i--)miss++;
  var w=last.hit?last.w+E[4]:miss>=3?Math.max(E[4],Math.round(last.w*0.9/E[4])*E[4]):last.w;
  var why=last.hit?"You hit every rep. Go up "+E[4]+" lb.":miss>=3?"Three sessions stuck. Drop about 10% and build back.":"Same weight. Own every rep first.";
  return {w:w,line:"Last: "+last.w+" lb on "+last.d.slice(5)+". "+why};
}
/* Demos show the start and end of a rep, drawn for your body, fading between the two.
   Every copy runs on one clock, so a screen redraw never makes them jump. */
var EXPLAN={push:"bench",pull:"pulldown",legs:"squat",full:"deadlift",arms:"curl",chest:"incline",back:"row",shoulders:"ohp",core:"hang"};
function exBody(){return (S.char&&S.char.sex)==="f"?"f":"m"}
function exDemo(id,cls){var bd=exBody(),t=-(Date.now()%2800);
  /* Walking swaps legs on each step; a fade would show four legs at once. */
  if(id==="farmer")cls=(cls?cls+" ":"")+"steps";
  return '<div class="xd'+(cls?" "+cls:"")+'" role="img" aria-label="'+esc(EX[id][0])+' demonstration" style="--xt:'+t+'ms"><img class="xa" src="'+exArt('ex_'+id+'_'+bd+'_a.webp')+'" alt=""><img class="xb" src="'+exArt('ex_'+id+'_'+bd+'_b.webp')+'" alt=""></div>'}
/* exercise pictures travel in art_ex.js (a page holds at most 512 files); the plain file is the fallback */
function exArt(n){return (window.QBART&&QBART[n])||"art/"+n}
function exStill(id){return '<div class="xd still"><img src="'+exArt('ex_'+id+'_'+exBody()+'_b.webp')+'" alt=""></div>'}
function exCard(id){
  var E=EX[id],wk=S.wk,NS=(wk.setsN&&wk.setsN[id])||EX[id][2],sg=exSuggest(id),sets=(wk.sets[id]||[]),role=(wk.roles&&wk.roles[id])||"",nt=wk.notes&&wk.notes[id];
  var val=wk.w[id]!=null&&wk.w[id]!==""?wk.w[id]:sg.w,done=sets.filter(Boolean).length>=NS;
  var h='<div class="ex'+(done?" done":"")+(/Superset|Support pair/.test(role)?" ss":"")+'"><button class="exthumb" data-act="wkopen" data-i="'+wkList().indexOf(id)+'" aria-label="Show how to do '+esc(E[0])+'">'+exDemo(id)+'</button><div class="exbody">'
   +(role?'<div class="exrole"><span class="label">'+esc(role)+'</span><span class="note mono">'+esc(REST[role]||"")+'</span></div>':'')
   +'<div class="exhead"><b>'+esc(E[0])+'</b><span class="chip xp">'+NS+' &times; '+esc(E[3])+'</span></div>';
  if(nt)h+='<div class="note">'+esc(nt)+'</div>';
  h+='<div class="note">'+esc(sg.line)+'</div><div class="exrow">';
  if(E[4])h+='<label class="kgw"><input class="kg" type="number" inputmode="decimal" step="'+(E[4]<5?2.5:5)+'" min="0" data-ex="'+id+'" value="'+esc(val)+'" placeholder="0" aria-label="'+esc(E[0])+' weight in pounds"><span>lb</span></label>';
  h+='<div class="setb">';for(var i=0;i<NS;i++)h+='<button class="sb'+(sets[i]?" on":"")+'" data-act="wkset" data-ex="'+id+'" data-n="'+i+'" aria-pressed="'+!!sets[i]+'">'+(sets[i]?"&#10003;":"Set "+(i+1))+'</button>';
  h+='</div></div><button class="hitb'+(wk.hit[id]?" on":"")+'" data-act="wkhit" data-ex="'+id+'" aria-pressed="'+!!wk.hit[id]+'">'+(wk.hit[id]?"&#10003; ":"")+'Hit the top of the rep range on every set</button></div></div>';
  return h;
}
function trainHtml(){
  var n=weekCount(),paid=S.weekPaid&&S.weekPaid[wkKey()],wb=weekBonus(),dp=DAYPLAN[new Date().getDay()];
  var h='<section class="card panel trhead"><div class="row" style="justify-content:space-between"><h3 class="label">Training</h3><span class="chip '+(paid?"":"xp")+'">'+(paid?"Weekly bonus claimed":n+"/4 this week")+'</span></div>'+weekDots()
   +'<p class="note">Each Workout quest proven with a live photo counts once per day. Hit 4 in a week (Monday to Sunday) for <b style="color:var(--gold)">+'+wb.xp+' XP and +'+wb.coins+' coins</b> plus a random wardrobe prize.</p></section>';
  if(!S.wk||!wkList().length){
    h+='<section class="card panel"><h3 class="label">Pick today\'s workout</h3><p class="note">Every session is balanced across the body and capped at about an hour, using supersets to save time. Pick a body part and the plan builds around it.</p><div class="plans">'+PLANS.map(function(p){var bp=buildPlan(p[0]);return '<button class="plan'+(p[0]===dp?" today":"")+'" data-act="wkplan" data-v="'+p[0]+'">'+exStill(EXPLAN[p[0]])+'<b>'+esc(p[1])+'</b><small>'+bp.list.length+' exercises &middot; ~'+bp.min+' min</small>'+(p[0]===dp?'<span class="plantag">Scheduled today</span>':'')+'</button>'}).join("")+'</div></section>';
    h+=coachRoster();
    var ss=(S.sessions||[]).slice(-5).reverse();
    if(ss.length)h+='<section class="card panel"><h3 class="label">Recent sessions</h3><div class="lrows">'+ss.map(function(x){var pl=planOf(x.plan);return '<div class="lrow"><span class="lv">'+esc(x.d.slice(5))+'</span><span>'+esc(pl?pl[1]:x.plan)+'</span><span class="mono note">'+x.n+' lifts</span></div>'}).join("")+'</div></section>';
    var prs=Object.keys(S.gymlog||{}).filter(function(k){return EX[k]&&EX[k][4]}).map(function(k){return [k,Math.max.apply(null,S.gymlog[k].map(function(x){return x.w||0}))]}).filter(function(x){return x[1]>0});
    if(prs.length)h+='<section class="card panel"><h3 class="label">Best weights</h3><div class="lrows">'+prs.map(function(x){return '<div class="lrow"><span class="lv mono">'+x[1]+'</span><span>'+esc(EX[x[0]][0])+'</span><span class="note">lb</span></div>'}).join("")+'</div></section>';
    return h;
  }
  var pl=planOf(S.wk.plan);
  h+='<section class="card panel"><div class="row" style="justify-content:space-between"><h3 class="label">'+esc(pl?pl[1]:"Workout")+' day &middot; ~'+(S.wk.min||estMin(wkList(),S.wk.roles||{},S.wk.setsN||{}))+' min</h3><button class="btn ghost" data-act="wkcancel">Change</button></div>'
   +(S.wk.note?'<p class="note">'+esc(S.wk.note)+'</p>':'')+'<button class="btn big" data-act="wkcoach">Start guided session</button><div class="exlist">'+wkList().map(exCard).join("")+'</div>'
   +'<button class="btn big" data-act="wkdone">Finish workout</button><p class="note">Logging pays a little XP and saves your weights. The big reward is the Workout quest: prove it with a live photo.</p></section>';
  return h;
}
function trainAct(a,b){
  if(a==="wkplan"){var bp=buildPlan(b.dataset.v);S.wk={coach:coachPick(),plan:b.dataset.v,list:bp.list,roles:bp.roles,notes:bp.notes||{},note:bp.note,setsN:bp.setsN,min:bp.min,sets:{},w:{},hit:{},t:today()};render();persist();window.scrollTo(0,0);setTimeout(function(){coachOpen(0)},60);return true}
  if(a==="wkcoach"){coachOpen(0);return true}
  if(a==="wkopen"){coachOpen(+b.dataset.i);return true}
  if(a==="wkcancel"){S.wk=null;render();persist();return true}
  if(a==="wkset"){var id=b.dataset.ex,n=+b.dataset.n;S.wk.sets[id]=S.wk.sets[id]||[];S.wk.sets[id][n]=!S.wk.sets[id][n];
    if(S.wk.sets[id][n]){var inp=document.querySelector('.kg[data-ex="'+id+'"]');if(inp&&inp.value!=="")S.wk.w[id]=parseFloat(inp.value)}render();persist();return true}
  if(a==="wkhit"){S.wk.hit[b.dataset.ex]=!S.wk.hit[b.dataset.ex];render();persist();return true}
  if(a==="wkdone"){
    var done=0,full=0,t=today();if(!S.gymlog)S.gymlog={};
    wkList().forEach(function(id){var E=EX[id],NS=(S.wk.setsN&&S.wk.setsN[id])||E[2],ns=(S.wk.sets[id]||[]).filter(Boolean).length;if(!ns)return;done++;if(ns>=NS)full++;
      var inp=document.querySelector('.kg[data-ex="'+id+'"]'),w=inp&&inp.value!==""?parseFloat(inp.value):(S.wk.w[id]!=null&&S.wk.w[id]!==""?+S.wk.w[id]:0);
      S.gymlog[id]=(S.gymlog[id]||[]).concat([{d:t,w:isNaN(w)?0:w,n:ns,hit:!!S.wk.hit[id]&&ns>=NS,u:"lb"}]).slice(-12)});
    if(!done){pop("Tap the sets you finished first");return true}
    S.sessions=(S.sessions||[]).concat([{d:t,plan:S.wk.plan,n:done}]).slice(-30);var cgm=coachGain(S.wk.coach,done,full);S.wk=null;
    var x=econTrainXp(done,full);
    grantXp(x,x>=ECON.trainXp?ECON.trainCoins:Math.max(10,Math.round(x*2)),"fitness");econTrained(x,S.sessions[S.sessions.length-1].plan);pop("Workout logged. +"+x+" XP");if(cgm)setTimeout(function(){pop(cgm)},2800);
    var gq=S.quests.filter(function(q){return q.stat==="fitness"&&!S.done[q.id]&&/gym|workout|lift|train/i.test(q.name)})[0];
    if(gq)setTimeout(function(){onTap(gq.id)},1200);
    return true}
  return false;
}

/*COACH-BEGIN*/
/* ---------- coaches ---------- */
var COACHES=[
 {id:"brick",name:"Sgt. Brick",tag:"Drill sergeant",v:"drill",L:{sex:"m",skin:"#8d5a3b",hair:"#1a1426",hair_s:"buzz",eyes:"#2a2030",top:{s:"tank",c:"#4b5d3a"},bottom:{s:"cargo",c:"#3b4630"},shoes:{s:"boots",c:"#1e2029"},acc:["sunglasses"],accC:"#111"}},
 {id:"tam",name:"Coach Tam",tag:"Ex-track captain",v:"drill",L:{sex:"f",skin:"#c68a5e",hair:"#2a1a14",hair_s:"pony",eyes:"#2a2030",top:{s:"jacket",c:"#e0392c",c2:"#f6f6f8"},bottom:{s:"pants",c:"#1e2029"},shoes:{s:"sneakers",c:"#f6f6f8"},acc:["phones"],accC:"#f6f6f8"}},
 {id:"oru",name:"Master Oru",tag:"Calm sensei",v:"zen",L:{sex:"m",skin:"#e9b892",hair:"#d8d8e0",hair_s:"slick",eyes:"#2a2030",top:{s:"longsleeve",c:"#e8e4d8"},bottom:{s:"pants",c:"#2b2f4a"},shoes:{s:"sneakers",c:"#2b2f4a"},acc:[]}},
 {id:"lio",name:"Lio",tag:"Breathwork nerd",v:"zen",L:{sex:"f",skin:"#f2c9a0",hair:"#6b8f71",hair_s:"bob",eyes:"#2a2030",top:{s:"hoodie",c:"#9fc9b0"},bottom:{s:"pants",c:"#33404a"},shoes:{s:"sneakers",c:"#eef0f5"},acc:["glasses"],accC:"#22232e"}},
 {id:"blaze",name:"Blaze",tag:"Hype man",v:"hype",L:{sex:"m",skin:"#c68a5e",hair:"#ff7a1a",hair_s:"textured",eyes:"#2a2030",top:{s:"tank",c:"#ff3d81"},bottom:{s:"pants",c:"#1a1426"},shoes:{s:"sneakers",c:"#ffd24a"},acc:["chain"],accC:"#ffd24a"}},
 {id:"pixie",name:"Pixie",tag:"Hype queen",v:"hype",L:{sex:"f",skin:"#f2c9a0",hair:"#8b5cff",hair_s:"pony",eyes:"#2a2030",top:{s:"tank",c:"#4dffc3"},bottom:{s:"pants",c:"#2a2650"},shoes:{s:"sneakers",c:"#ff3d81"},acc:["earring"],accC:"#ffd24a"}},
 {id:"vanta",name:"Vanta",tag:"Deadpan",v:"dry",L:{sex:"m",skin:"#b88a6a",hair:"#101018",hair_s:"sidepart",eyes:"#2a2030",top:{s:"longsleeve",c:"#22232e"},bottom:{s:"pants",c:"#16161c"},shoes:{s:"boots",c:"#0e0e12"},acc:["glasses"],accC:"#22232e"}},
 {id:"mags",name:"Mags",tag:"Unimpressed gym lifer",v:"dry",L:{sex:"f",skin:"#8d5a3b",hair:"#3a2a22",hair_s:"waves",eyes:"#2a2030",top:{s:"jacket",c:"#5d6b86",c2:"#e9edf5"},bottom:{s:"pants",c:"#25262f"},shoes:{s:"sneakers",c:"#c9cfd9"},acc:[]}},
 {id:"ryo",name:"Captain Ryo",tag:"Shonen hero",v:"hero",L:{sex:"m",skin:"#f0c8a0",hair:"#1a1426",hair_s:"textured",eyes:"#2a2030",top:{s:"jacket",c:"#2a5fff",c2:"#ffffff"},bottom:{s:"pants",c:"#1d2540"},shoes:{s:"sneakers",c:"#ffd24a"},acc:[]}},
 {id:"hikari",name:"Hikari",tag:"Rival arc",v:"hero",L:{sex:"f",skin:"#f2d2b0",hair:"#ff5c8a",hair_s:"long",eyes:"#2a2030",top:{s:"crop",c:"#ffffff"},bottom:{s:"pants",c:"#3a2a66"},shoes:{s:"sneakers",c:"#ff5c8a"},acc:["phones"],accC:"#ff5c8a"}},
 {id:"quill",name:"Prof. Quill",tag:"Biomechanics geek",v:"nerd",L:{sex:"m",skin:"#e9b892",hair:"#7a4a2a",hair_s:"sidepart",eyes:"#2a2030",top:{s:"cardigan",c:"#8a5a3c",c2:"#f6f6f8"},bottom:{s:"pants",c:"#2b2f3a"},shoes:{s:"boots",c:"#3a2a22"},acc:["glasses"],accC:"#22232e"}},
 {id:"dot",name:"Dot",tag:"Data goblin",v:"nerd",L:{sex:"f",skin:"#d9a67a",hair:"#22d3ee",hair_s:"bob",eyes:"#2a2030",top:{s:"hoodie",c:"#22d3ee"},bottom:{s:"cargo",c:"#33404a"},shoes:{s:"sneakers",c:"#f6f6f8"},acc:["glasses"],accC:"#ff3d81"}}
];
var CVOICE={
 drill:{
  o:["Eyes up, {n} starts now.","Listen close, rookie.","On my count.","No slouching. Not today.","Fall in. {n} is next.","Back straight, chin level.","Move it, move it.","Stand tall, soldier.","Quiet in the ranks.","Orders are simple here.","Boots planted. Go time.","Clock is running.","Look alive.","I did not wake up to watch you coast.","Attention.","Mission brief for {n}.","Chest proud.","Hands ready, mind sharper.","Settle in. Then attack.","This is the part where you earn it."],
  c:["Execute.","Do not negotiate with the weight.","Show me clean reps.","Move.","That is an order.","No excuses on my floor.","Make me proud.","Finish what you start.","Log it. Then do the next one.","Reps do not count themselves.","Dismissed when I say so.","Earn the rest.","Own it.","Sweat is the receipt.","Again, then again.","Quit is not in my vocabulary.","Prove it.","Hit the top of the range.","Now go.","Stay locked in."],
  s:["Set down. Next one is harder.","Clean. Do not get comfortable.","Logged. Shake it out.","Not bad, recruit.","Good. Breathe, then reload.","That is how it is done.","Marked and counted.","Acceptable. Better next.","You held formation. Nice.","One more in the bank.","Hold that standard.","I saw that. Respect.","Ugly is fine. Quit is not.","Soldier is warming up."],
  r:["Rest. Water. Eyes on the clock.","Breathe, do not wander.","Recover. The next set is waiting.","Stay on your feet and shake the arms out.","Rest is part of the mission.","Walk it off, stay ready.","Reload. Do not scroll.","Heart rate down, focus up.","Two minutes of honest rest, then back.","Sip, breathe, return."],
  f:["Mission complete. Dismissed.","That session was earned. Fall out.","Good work today. I mean it.","Hit the showers, soldier.","Another day in the books.","Report to the couch with honor.","Standards met.","You showed up. That is the whole war."]},
 zen:{
  o:["Breathe in. {n} begins.","Let the shoulders drop.","Be here. Only here.","The weight is a teacher.","Soft eyes, strong body.","Begin from stillness.","One breath, one rep.","Find your center.","Nothing to prove. Only to do.","Quiet the mind first.","The bar waits without hurry.","Feel the floor.","Let go of the last set.","Start slowly. Finish steady.","Water finds its way.","Notice the body.","Today is a fresh page.","Rooted like a tree.","Be a calm river.","Respect the movement."],
  c:["Exhale on effort.","The work is the reward.","Let it flow.","Strength grows in patience.","Smooth is fast.","Listen to your joints.","Be gentle, be firm.","Enjoy the burn like weather.","Return to the breath.","Hold the form, release the ego.","The mountain does not rush.","Move with intention.","Find the quiet in the effort.","All is well. Lift.","Let the set come to you.","Small, honest reps.","Smile a little.","Stillness lives inside the movement.","Gratitude for a body that moves.","Begin."],
  s:["A good set, like a good tea.","Well done. Let it settle.","Breathe. That one is finished.","The body remembers.","Gently, onward.","Another stone in the path.","Nicely balanced.","Let that set go.","You moved with grace.","A deeper breath, please.","Calm mind, strong back.","That is the way.","The river keeps flowing.","Be proud and quiet."],
  r:["Rest is also training.","Breathe in four, out six.","Empty the mind.","Shake out the hands. Let the heart settle.","Be still for a moment.","Drink. Notice the heartbeat.","The pause is part of the song.","Soften the jaw.","Stillness. Then movement.","Recover without hurry."],
  f:["The session ends. The strength stays.","Bow to yourself. Well done.","Rest well, you have earned it.","Peace in the muscles today.","A good day on the mat.","The work is done. Walk gently.","Return to the world a little stronger.","Thank you for training with care."]},
 hype:{
  o:["LET'S GOOOO, {n} time!","Oh it is ON.","Crowd is going wild for {n}!","This is your moment!","All eyes on you!","Up, up, UP!","You were born for this set!","Hit the music, hit the weights!","Let's go. You're ready.","Camera is rolling on {n}!","Turn it up!","Big energy, bigger lift!","Buckle up, superstar!","Okay okay okay, here we go!","The arena is yours!","Let me see that smile!","Here comes the big one!","That is podium form!","Here we go!","On the beat, on the bar!"],
  c:["You are unstoppable!","Look at you GO!","Pure fire!","Do not stop, do not stop!","Make it look EASY!","Beautiful rep!","That set was loud!","Ten out of ten!","Lock in and light it up!","Everyone is watching, so shine!","BOOM!","Yes yes YES!","You have this!","Send it!","You are the headliner!","Make some noise with that rep!","That is the energy!","Textbook!","Go go go!","Keep that fire burning!"],
  s:["YESSS, set down!","Great set!","That one gets a replay!","Crowd goes wild!","Clap clap clap!","Another hit for the album!","Chef's kiss!","Look at that form!","You are on a heater!","That is a headliner set!","Take a bow, then breathe!","Unreal!","So proud, so loud!","Encore! Encore!"],
  r:["Water break, champ!","Catch your breath, star!","Intermission! Stretch it out!","Drink some water!","Quick shake, big return!","Shake it out, we go again soon!","Rest up, the finale needs you!","Chill with me for a sec!","Backstage break, back soon!","Big breath in!"],
  f:["We did it! Great session!","That was a great session!","Done! Go eat something good!","Standing ovation from me!","Roll credits, roll credits!","What a session!","You owned that session!","Victory lap time!"]},
 dry:{
  o:["Fine. {n}.","Here we go, I guess.","Another {n}. Thrilling.","Try not to die.","I have seen worse. Slightly.","Do the thing.","Let us not make this dramatic.","Okay.","No pressure. Some pressure.","Start whenever. Preferably now.","Same as always. Do it correctly.","The weights are not going to lift themselves.","Brace yourself. Emotionally too.","This is fun for no one.","You will survive. Probably.","Alright, champion.","Go on. I am watching. Sort of.","I will pretend to be excited.","Get it over with, but properly.","Reps. Sets. The usual."],
  c:["Impress me. Or do not.","I have low expectations. Beat them.","Try harder than yesterday. Low bar.","That is all. Carry on.","It is just a barbell.","Pain is a feature.","Do not hurt yourself. I would have to fill in a form.","Breathe. Then lift.","Good luck with that.","It builds character, allegedly.","Form over ego. Please.","Quietly crush it.","My coffee is cold. Make it count.","You have done harder things.","Nobody claps. Do it anyway.","Next.","Gravity is undefeated. Fight anyway.","Keep it clean, keep it moving.","No pressure.","Count them yourself."],
  s:["Set down. Great. Whatever.","Adequate. Good.","I did not notice anything wrong.","Fine. Next.","Not terrible.","That counted. I think.","You are doing okay. Do not tell anyone I said that.","Meh. Good meh.","I nodded. That is the praise.","One closer to lunch.","Solid. Do not let it go to your head.","Good form. I am shocked.","Technically excellent.","Moving on."],
  r:["Rest. Stare at nothing.","Breathe. I will be here, disappointed.","Sit. Or do not. Up to you.","Rest is mandatory. Enjoy.","Water exists. Use it.","Take your time. The clock does not care.","Recover. Silently.","Take two minutes. Do not make it weird.","Stretch something.","Look busy. Rest."],
  f:["It is over. You may go.","Done. I am slightly proud.","Fine work. Do not tell anyone.","Go home. Eat food.","Session complete. Zero complaints.","You showed up. Weird.","Not bad at all. See you next time.","Credits. Roll them yourself."]},
 hero:{
  o:["This is where you get strong!","{n} is the next gate!","The training montage starts now!","Trust your training!","Power level rising!","Today, we surpass yesterday!","Show me your resolve!","This is the one you will remember!","The rival is yourself!","A hero never skips a set!","Gather your spirit!","This is for everyone who believed in you!","Ready? The tournament begins!","Draw upon your hidden power!","Eyes forward, hero!","Flames of will, ignite!","We have trained for this moment!","Let the training begin!","I will not lose, and neither will you!","Push past your limits!"],
  c:["Go beyond!","Never give up!","Your power is limitless!","Believe it!","Let that spirit burn!","Surpass yourself!","Plus ultra, plus one rep!","Every rep, cleaner than the last!","The finale needs you!","Awaken your true strength!","One more. Make it count!","Your friends are watching!","Rise!","This rep decides everything!","Power comes from the heart!","I know you can do it!","Gather everything, release it all!","The bar does not stand a chance!","For honor!","Fight on!"],
  s:["A true warrior's set!","Power up!","Your aura is blazing!","Another level cleared!","That felt like a boss fight!","Incredible resolve!","The rival is shaking!","You grew stronger just now!","Training arc approved!","One more chapter written!","That is heroic!","Your spirit never wavered!","Impressive, hero!","Stronger with every set!"],
  r:["Recover your spirit, hero.","Even heroes rest between battles.","Catch your breath. Next fight is soon.","Drink. Heal. Return.","Rest, and plan your comeback.","The next round begins shortly.","Restore your energy.","Brace for the next wave.","Quiet before the storm.","Gather power during the pause."],
  f:["Session complete. Well fought!","Another training day, conquered!","Same time next week, then!","Next episode: even stronger!","That was a champion's session!","Rest well. Tomorrow we go again!","The villains tremble.","Credits roll. Cue the theme song."]},
 nerd:{
  o:["Hypothesis: {n} will be excellent.","According to the literature, {n} is next.","Fun fact before {n}:","Let us optimize this.","Initializing {n} protocol.","Technically speaking,","By my calculations,","Quick biomechanics note.","Data suggests you are ready.","Experiment {n}, trial begins.","Observe your bar path.","Time to collect data.","Muscle fibers, assemble.","Interesting setup.","Ahem. Form check first.","Let me adjust my glasses.","The numbers want you to start.","Neural drive, engage.","Entering the lab.","Peer review begins now."],
  c:["Control the eccentric.","Tension equals growth.","Mind the range of motion.","Progressive overload, that is the whole secret.","Hit the target rep range.","Record it for later.","Brace, then move.","The sarcomeres approve.","Small changes, compounding results.","Keep the elbows tracking.","Stay slightly under maximum effort.","Quality reps count extra.","Consistency beats intensity.","Small gains, measured weekly.","The research is clear on this one.","Log everything.","Efficiency is beautiful.","Mechanical tension, activated.","Math says go.","Verify with reps."],
  s:["Set logged. Data is clean.","Hypothesis confirmed.","Efficient. I like it.","The graph goes up.","Statistically excellent.","Nice bar path.","That was within tolerance.","Notes taken, results strong.","Muscle fibers are thrilled.","Clean reps. Good data.","Peer reviewed and approved.","Variance minimal. Good.","Adding that to the dataset.","Marginal gains compounding."],
  r:["Rest improves the dataset.","Recovery is when adaptation happens.","Hydrate. That is science.","The ATP system is recharging.","Resting heart rate falling, good.","Shake out the working muscle.","Pause the experiment.","Stand tall, breathe low.","Recharge the creatine system.","Take your time, the data can wait."],
  f:["Experiment complete. Results strong.","Excellent data collection today.","Training stimulus delivered.","Now eat protein and sleep. That is science.","Logged. Same protocol next session.","Great session. I will update the charts.","Progress logged.","The lab is proud of you."]}
};
/* form cues per exercise. {n} not needed. 3 specific + group cues appended */
var CCUE={
 bench:["Shoulder blades pinned back and down.","Lower the bar to the lower chest, then drive.","Feet planted, heels dug in."],
 incline:["Dumbbells travel in a slight arc.","Do not flare the elbows past 45 degrees.","Lower slowly, press with purpose."],
 fly:["Slight bend in the elbows, hug a tree.","Squeeze the chest at the center.","Do not let the cables yank the shoulders forward."],
 dips:["Lean slightly forward, elbows tucked.","Descend until the shoulder hits elbow height.","Lock out at the top."],
 ohp:["Squeeze the glutes, ribs down.","Head moves through once the bar clears the face.","Bar over mid foot at lockout."],
 lateral:["Lead with the elbows, not the hands.","Stop at shoulder height.","Light weight, loud control."],
 rear:["Chest toward the floor, thumbs slightly down.","Squeeze shoulder blades together.","Small, smooth, no swinging."],
 shrug:["Straight up and down, ears to shoulders.","Pause at the top for a beat.","Do not roll the shoulders."],
 cgbench:["Hands just inside shoulder width.","Elbows brush the ribs.","Triceps finish every rep."],
 curl:["Elbows pinned at the sides.","Squeeze the biceps at the top.","Lower for a slow three count."],
 incurl:["Let the arms hang behind you for a full stretch.","Keep the shoulders pulled back.","Curl, rotate, squeeze."],
 hammer:["Neutral grip, thumbs up.","Keep the upper arm still.","Control the way down."],
 pushdown:["Elbows locked at the sides.","Full lockout at the bottom.","Slow return, no bouncing."],
 ohext:["Elbows point at the ceiling.","Lower behind the head, press to lockout.","Ribs down, core braced."],
 farmer:["Tall chest, short fast steps.","Grip like you are crushing something.","Shoulders down and back."],
 chinup:["Start from a dead hang, shoulders active.","Chin over the bar.","Lower fully, no kipping."],
 pulldown:["Pull the elbows to the back pockets.","Chest up to meet the bar.","Control the stretch at the top."],
 row:["Hinge, flat back, pull to the lower ribs.","Squeeze the shoulder blades.","No bouncing off the thighs."],
 cablerow:["Sit tall, pull to the navel.","Elbows close, squeeze the back.","Reach forward with control."],
 facepull:["Pull the rope to the forehead, elbows high.","Thumbs back, squeeze the rear delts.","Light weight, perfect reps."],
 deadlift:["Bar over mid foot, wedge in.","Push the floor away.","Lock the hips and finish tall."],
 squat:["Brace like a punch is coming.","Knees track over the toes.","Hit depth, drive up through the whole foot."],
 rdl:["Hips back, bar glued to the legs.","Soft knees, flat back.","Feel the hamstrings load."],
 legpress:["Feet shoulder width, knees tracking.","Do not lock the knees.","Full depth, no butt lift."],
 legcurl:["Hips pinned, curl the heels to the glutes.","Pause at the peak.","Slow lowering."],
 calf:["Full stretch at the bottom.","Pause at the top.","Slow and deliberate."],
 lunge:["Long step, upright torso.","Back knee kisses the floor.","Push through the front heel."],
 hang:["No swinging, lift with the abs.","Curl the pelvis up at the top.","Lower with control."],
 plank:["Glutes squeezed, ribs down.","Straight line from head to heels.","Breathe, do not hold your breath."],
 crunch:["Round the spine, hips still.","Exhale as you crunch.","Elbows toward the knees."],
 twist:["Rotate from the ribs, not the arms.","Feet up if you can.","Eyes follow the weight."],
 backext:["Squeeze the glutes at the top.","Do not hyperextend.","Slow and controlled."]
};
var CGEN={
 chest:["Chest up, shoulders back.","Feel the pecs stretch, then squeeze.","Controlled tempo, full range."],
 shoulders:["Ribs down, no leaning back.","Stay strict.","Light shoulders, heavy intent."],
 arms:["No swinging, the arms do the work.","Squeeze at peak contraction.","Slow on the way down."],
 back:["Think elbows, not hands.","Pull the shoulder blades together.","Keep the chest proud."],
 legs:["Brace the core, hit depth.","Push through the full foot.","Stay tight from top to bottom."],
 core:["Breathe behind the brace.","Quality over reps.","Keep the ribs down."]
};
var MOTION={bench:"press",incline:"press",ohp:"press",cgbench:"press",dips:"press",fly:"fly",lateral:"raise",rear:"raise",shrug:"shrug",curl:"curl",incurl:"curl",hammer:"curl",pushdown:"push",ohext:"curl",farmer:"carry",chinup:"chin",pulldown:"pull",row:"row",cablerow:"row",facepull:"row",deadlift:"hinge",rdl:"hinge",backext:"hinge",squat:"squat",legpress:"squat",lunge:"squat",legcurl:"squat",calf:"calf",hang:"hang",plank:"plank",crunch:"crunch",twist:"twist"};
var PROPK={bench:"bar",incline:"db",fly:"db",ohp:"bar",cgbench:"bar",lateral:"db",rear:"db",shrug:"db",curl:"bar",incurl:"db",hammer:"db",ohext:"db",farmer:"db",row:"bar",deadlift:"bar",rdl:"bar",squat:"bar",lunge:"db"};
function cseen(k){if(!S.cseen)S.cseen=[];return S.cseen.indexOf(k)>=0}
function cmark(k){if(!S.cseen)S.cseen=[];S.cseen.push(k);if(S.cseen.length>900)S.cseen=S.cseen.slice(-700)}
function coachById(id){return COACHES.filter(function(c){return c.id===id})[0]||COACHES[0]}
function coachPick(){
  if(!coachesOn())return "";
  var hist=S.coachHist||[],pool=COACHES.filter(function(c){return hist.slice(-3).indexOf(c.id)<0});
  var c=pool[Math.floor(Math.random()*pool.length)]||COACHES[0];
  S.coachHist=hist.concat([c.id]).slice(-8);return c.id;
}
function cfill(t,exid,c){var E=EX[exid]||["this"];return t.replace(/\{n\}/g,E[0].toLowerCase()).replace(/\{c\}/g,c.name)}
function coachCues(exid){var E=EX[exid];return (CCUE[exid]||[]).concat(CGEN[E[1]]||[])}
function coachLine(c,exid,kind){
  var V=CVOICE[c.v];
  if(kind==="o"||!kind){
    var cu=coachCues(exid),bo=V.o,bc=V.c,k,t=0;
    do{var i=Math.floor(Math.random()*bo.length),q=Math.floor(Math.random()*cu.length),j=Math.floor(Math.random()*bc.length);k=c.v+":"+exid+":"+i+":"+q+":"+j;t++}while(cseen(k)&&t<60);
    cmark(k);return cfill(bo[i]+" "+cu[q]+" "+bc[j],exid,c);
  }
  var b=V[kind],t2=0,idx,key;
  do{idx=Math.floor(Math.random()*b.length);key=c.v+":"+kind+":"+idx;t2++}while(cseen(key)&&t2<40);
  if(t2>=40){S.cseen=(S.cseen||[]).filter(function(x){return x.indexOf(c.v+":"+kind+":")!==0})}
  cmark(key);return cfill(b[idx],exid,c);
}
function coachMini(exid){var c=coachById(S.wk&&S.wk.coach);if(!S.wk._ln)S.wk._ln={};if(!S.wk._ln[exid])S.wk._ln[exid]=coachLine(c,exid,"o");return S.wk._ln[exid]}
/* demo figure */
function coachArt(c){return (typeof ART!=="undefined"&&c&&ART["coach_"+c.id])||""}
function coachFig(c,exid){return '<div class="cstage">'+exDemo(exid,"big")+'</div>'}
function coachForm(exid){var q=(CCUE[exid]||[]).slice(0,3);return q.length?'<ul class="cform">'+q.map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+'</ul>':''}
var CSCR=null,CIDX=0,CTYPE=null;
function coachClose(){if(CTYPE){clearInterval(CTYPE);CTYPE=null}if(CSCR){CSCR.remove();CSCR=null}}
function coachSay(txt){
  var el=CSCR&&CSCR.querySelector(".cbub-t");if(!el)return;if(CTYPE){clearInterval(CTYPE);CTYPE=null}
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){el.textContent=txt;return}
  var i=0;el.textContent="";CTYPE=setInterval(function(){i+=2;el.textContent=txt.slice(0,i);if(i>=txt.length){clearInterval(CTYPE);CTYPE=null}},22);
}
function coachOpen(idx){
  if(!S.wk||!wkList().length)return;
  if(!S.wk.coach){S.wk.coach=coachPick();persist()}
  CIDX=Math.max(0,Math.min(idx||0,wkList().length-1));
  if(!CSCR){CSCR=document.createElement("div");CSCR.className="coachscr";document.getElementById("layer").appendChild(CSCR);
    CSCR.addEventListener("click",coachClick);CSCR.addEventListener("input",function(e){var t=e.target;if(t.classList&&t.classList.contains("ckg")){S.wk.w[t.dataset.ex]=t.value===""?"":parseFloat(t.value);persist()}});}
  coachDraw(true);
}
function coachDraw(newLine){
  if(!CSCR)return;var list=wkList(),id=list[CIDX],E=EX[id],wk=S.wk,c=coachById(wk.coach),NS=(wk.setsN&&wk.setsN[id])||E[2],sets=wk.sets[id]||[],sg=exSuggest(id),role=(wk.roles&&wk.roles[id])||"",nt=wk.notes&&wk.notes[id];
  var val=wk.w[id]!=null&&wk.w[id]!==""?wk.w[id]:sg.w,ndone=sets.filter(Boolean).length;
  var h='<div class="cinner"><div class="ctop"><span class="label">'+esc(c.name)+' &middot; '+esc(c.tag)+'</span><span class="mono note">'+(CIDX+1)+'/'+list.length+'</span><button class="btn ghost csm" data-ca="full">See full workout</button><button class="btn ghost csm" data-ca="x" aria-label="Close">&times;</button></div>'
   +'<div class="cbar">'+list.map(function(x,i){var d=((wk.sets[x]||[]).filter(Boolean).length>=((wk.setsN&&wk.setsN[x])||EX[x][2]));return '<i class="'+(i===CIDX?"cur":d?"dn":"")+'"></i>'}).join("")+'</div>'
   +coachFig(c,id)
   +'<div class="cbub'+(coachArt(c)?' hasav':'')+'">'+(coachArt(c)?'<img class="cbav" src="'+coachArt(c)+'" alt="">':'')+'<b>'+esc(c.name)+'</b><span class="cbub-t"></span><button class="cmore" data-ca="more" aria-label="Another line">&#8635;</button></div>'
   +'<div class="cex"><h2>'+esc(E[0])+'</h2>'+coachForm(id)+'<div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip xp">'+NS+' &times; '+esc(E[3])+'</span>'+(role?'<span class="chip">'+esc(role)+'</span>':'')+'<span class="note mono">'+esc(REST[role]||"")+'</span></div>'
   +(nt?'<div class="note">'+esc(nt)+'</div>':'')+'<div class="note">'+esc(sg.line)+'</div>'
   +'<div class="exrow">'+(E[4]?'<label class="kgw"><input class="ckg" type="number" inputmode="decimal" step="'+(E[4]<5?2.5:5)+'" min="0" data-ex="'+id+'" value="'+esc(val)+'" placeholder="0" aria-label="'+esc(E[0])+' weight in pounds"><span>lb</span></label>':'')
   +'<div class="setb">'+(function(){var s="";for(var i=0;i<NS;i++)s+='<button class="sb'+(sets[i]?" on":"")+'" data-ca="set" data-n="'+i+'" aria-pressed="'+!!sets[i]+'">'+(sets[i]?"&#10003;":"Set "+(i+1))+'</button>';return s})()+'</div></div>'
   +'<button class="hitb'+(wk.hit[id]?" on":"")+'" data-ca="hit" aria-pressed="'+!!wk.hit[id]+'">'+(wk.hit[id]?"&#10003; ":"")+'Hit the top of the rep range on every set</button></div>'
   +'<div class="cnav"><button class="btn ghost" data-ca="prev"'+(CIDX?'':' disabled')+'>Back</button>'+(CIDX<list.length-1?'<button class="btn big" data-ca="next">Next exercise</button>':'<button class="btn big" data-ca="finish">Finish workout</button>')+'</div></div>';
  CSCR.innerHTML=h;CSCR.scrollTop=0;
  if(newLine){if(!wk._ln)wk._ln={};if(!wk._ln[id]){wk._ln[id]=coachLine(c,id,"o");persist()}coachSay(wk._ln[id])}
}
function coachFull(){
  var list=wkList(),wk=S.wk,c=coachById(wk.coach);
  var h='<div class="cinner"><div class="ctop"><span class="label">Full workout &middot; '+esc(c.name)+'</span><button class="btn ghost csm" data-ca="back">Back to card</button></div><div class="lrows">'+list.map(function(x,i){var E=EX[x],NS=(wk.setsN&&wk.setsN[x])||E[2],n=(wk.sets[x]||[]).filter(Boolean).length,role=(wk.roles&&wk.roles[x])||"";
    return '<button class="cfrow'+(n>=NS?" dn":"")+'" data-ca="go" data-i="'+i+'"><b>'+(i+1)+'. '+esc(E[0])+'</b><small>'+NS+' &times; '+esc(E[3])+(role?' &middot; '+esc(role):'')+'</small><span class="mono">'+n+'/'+NS+'</span></button>'}).join("")+'</div></div>';
  CSCR.innerHTML=h;CSCR.scrollTop=0;
}
function coachClick(e){
  var b=e.target.closest("[data-ca]");if(!b||!S.wk)return;var a=b.dataset.ca,list=wkList(),id=list[CIDX],c=coachById(S.wk.coach);
  if(a==="x"){coachClose();render();return}
  if(a==="full"){coachFull();return}
  if(a==="back"){coachDraw(false);var cl=S.wk._ln&&S.wk._ln[id];if(cl)coachSay(cl);return}
  if(a==="go"){CIDX=+b.dataset.i;coachDraw(true);return}
  if(a==="prev"){CIDX=Math.max(0,CIDX-1);coachDraw(true);return}
  if(a==="next"){CIDX=Math.min(list.length-1,CIDX+1);coachDraw(true);return}
  if(a==="more"){var l=coachLine(c,id,"o");S.wk._ln[id]=l;persist();coachSay(l);return}
  if(a==="hit"){S.wk.hit[id]=!S.wk.hit[id];persist();coachDraw(false);coachSay((S.wk._ln&&S.wk._ln[id])||"");return}
  if(a==="set"){var n=+b.dataset.n;S.wk.sets[id]=S.wk.sets[id]||[];S.wk.sets[id][n]=!S.wk.sets[id][n];
    var inp=CSCR.querySelector(".ckg");if(S.wk.sets[id][n]&&inp&&inp.value!=="")S.wk.w[id]=parseFloat(inp.value);
    var NS=(S.wk.setsN&&S.wk.setsN[id])||EX[id][2],dn=S.wk.sets[id].filter(Boolean).length;persist();
    coachDraw(false);
    if(S.wk.sets[id][n]){var kind=dn>=NS?(CIDX<list.length-1?"s":"s"):"r";var ln=dn>=NS?coachLine(c,id,"s"):coachLine(c,id,"r");S.wk._ln[id]=ln;coachSay(ln)}
    else coachSay(S.wk._ln[id]||"");
    return}
  if(a==="finish"){var fl=coachLine(c,id,"f");coachClose();render();trainAct("wkdone",b);setTimeout(function(){pop(c.name+": "+fl)},900);return}
}
/* coach levels and buffs */
var CLV=[0,30,80,150,250];
var CSTAT={drill:["discipline","Discipline quests"],zen:["social","Social quests"],hype:["creativity","Creativity quests"],dry:["productivity","Productivity quests"],hero:["fitness","Fitness quests"],nerd:[null,"Coins earned"]};
function coachXp(id){return (S.cxp&&S.cxp[id])||0}
function coachLv(id){var x=coachXp(id),l=0;CLV.forEach(function(t){if(x>=t)l++});return Math.max(1,l)}
function coachBuff(c){var l=coachLv(c.id),cs=CSTAT[c.v];return cs[0]?{stat:cs[0],pct:l,text:cs[1]+" +"+l+"% XP"}:{special:"coin",pct:l,text:cs[1]+" +"+l+"%"}}
function coachRanked(){if(!coachesOn())return [];return COACHES.filter(function(c){return coachXp(c.id)>0}).sort(function(a,b){return coachXp(b.id)-coachXp(a.id)})}
function coachBuffs(){return coachRanked().map(function(c){return {who:c.name,b:coachBuff(c)}})}
function coachGain(id,done,full){
  if(!id)return "";var c=coachById(id);if(!S.cxp)S.cxp={};var l0=coachLv(id),g=10+done*2+full;S.cxp[id]=(S.cxp[id]||0)+g;var l1=coachLv(id);
  return c.name+" +"+g+" coach XP"+(l1>l0&&S.cxp[id]>=CLV[l1-1]&&l1>1?" · Level "+l1+": "+coachBuff(c).text:"");
}
function coachRoster(){
  if(!coachesOn())return "";
  var h='<section class="card panel"><h3 class="label">Coaches</h3><p class="note">A new coach runs each session. Every session earns that coach XP. Higher levels boost your quests, and top coaches show up in your Gym.</p><div class="croster">';
  COACHES.forEach(function(c){
    var x=coachXp(c.id),l=coachLv(c.id),met=x>0,nxt=CLV[l]!=null?CLV[l]:null,lo=CLV[l-1]||0,pc=nxt==null?100:Math.round((x-lo)/(nxt-lo)*100);
    h+='<div class="ccard'+(met?"":" lock")+'">'+(coachArt(c)?'<img class="crav'+(met?'':' sil')+'" src="'+coachArt(c)+'" alt="">':pxImg(c.L,"bust",40,40,"crew"))+'<div><b>'+esc(met?c.name:"???")+'</b><small>'+(met?"Lv "+l+" &middot; "+esc(coachBuff(c).text):"Not met yet")+'</small><div class="track"><div class="fill" style="width:'+(met?pc:0)+'%;background-color:var(--accent)"></div></div></div></div>';
  });
  return h+'</div></section>';
}
/*COACH-END*/
/*SOCIAL-BEGIN*/
/* ---------- neighbors: visit each other's Lofts, say hi, town board ---------- */
var MYUID=null,SOC={worlds:[],posts:[],notes:{},loaded:0,busy:0,lastPub:0,lastPost:0,err:""};
function socOn(){return !!(db&&MYUID)}
function socToday(){return today()}
function socAgo(t){var s=Math.max(0,(Date.now()-t)/1000);return s<60?"just now":s<3600?Math.floor(s/60)+"m ago":s<86400?Math.floor(s/3600)+"h ago":Math.floor(s/86400)+"d ago"}
function socState(){if(!S.social||typeof S.social!=="object")S.social={};var o=S.social;if(o.d!==socToday()){o.d=socToday();o.vis=[];o.gave={}}if(!o.seen)o.seen={};if(!o.vis)o.vis=[];if(!o.gave)o.gave={};return o}
function socWorldDoc(){
  return {name:(S.char&&S.char.name)||"Player",look:lookOf(),lv:effLvl(),streak:S.streak||0,cls:S.cls||"",
    rooms:S.base.slots.map(function(r){return r?{t:r.t,a:r.a||{},st:r.st||0}:null}),
    crew:crewUnlocked().length,served:Math.floor(S.base.served||0),t:Date.now(),appv:APPV}
}
function socPublish(force){
  if(!socOn()||!S.created)return;var t=Date.now();if(!force&&t-SOC.lastPub<90000)return;SOC.lastPub=t;
  try{db.doc("worlds/"+MYUID).set(socWorldDoc()).catch(function(e){SOC.err=(e&&e.code)||"error"})}catch(e){}
}
async function socLoad(){
  if(!socOn()||SOC.busy)return;SOC.busy=1;
  try{
    var ws=await db.collection("worlds").limit(60).get();
    SOC.worlds=(ws.docs||[]).map(function(d){return Object.assign({},d.data(),{id:d.id})}).filter(function(x){return x&&x.id!==MYUID&&x.name});
    SOC.worlds.sort(function(a,b){return (b.t||0)-(a.t||0)});
    /* one doc per player, board/<their id>, holding their last few posts (the database rules let each player write only their own) */
    var ps=await db.collection("board").limit(60).get(),all=[];SOC.rxDocs=[];
    (ps.docs||[]).forEach(function(d){var x=d.data();if(x&&x.rx&&typeof x.rx==="object")SOC.rxDocs.push({id:d.id,rx:x.rx});if(!x||!Array.isArray(x.posts))return;
      x.posts.forEach(function(p){if(p&&p.text)all.push({id:d.id+"|"+(p.t||0),from:d.id,name:x.name||"Neighbor",text:p.text,t:p.t||0,look:p.look||null})})});
    all.sort(function(a,b){return b.t-a.t});SOC.posts=all.slice(0,30);
    await socCheckPings();
    SOC.loaded=Date.now();SOC.err="";
  }catch(e){SOC.err=(e&&e.code)||"error"}
  SOC.busy=0;socPaint();
}
/* visit notes: one doc per sender, pings/<their id>, {sent:{<to id>:{d,t,msg,look,toName}}}, the newest note to each Loft */
async function socPingsTo(uid){var q=await db.collection("pings").limit(200).get(),out=[];
  (q.docs||[]).forEach(function(d){var x=d.data(),e=x&&x.sent&&x.sent[uid];if(e&&typeof e==="object")out.push({from:d.id,fromName:x.fromName||"Neighbor",to:uid,toName:e.toName||"",d:e.d||"",t:e.t||0,msg:e.msg||"",look:e.look||null})});
  return out}
/* this player's own board and pings docs: read fresh, change, write back, one write at a time */
function socMine(kind,mut){var run=async function(){var ref=db.doc(kind+"/"+MYUID),s=await ref.get(),d=s.exists?(s.data()||{}):{};
    mut(d);d.name=(S.char&&S.char.name)||"Neighbor";d.fromName=d.name;d.t=Date.now();await ref.set(d);return d};
  var p=(SOC.q||Promise.resolve()).then(run);SOC.q=p.catch(function(){});return p}
async function socCheckPings(){
  if(!socOn())return;var o=socState(),got=[];
  try{var docs=await socPingsTo(MYUID);
    docs.forEach(function(x){if(x.d!==socToday())return;var key=x.from+"|"+(x.t||0);
      if(!o.vis.some(function(v){return v.from===x.from}))o.vis.push({from:x.from,name:x.fromName||"Neighbor",look:x.look||null,t:x.t||Date.now(),msg:x.msg||""});
      else{o.vis.forEach(function(v){if(v.from===x.from){v.msg=x.msg||v.msg;v.t=x.t||v.t}})}
      if(!o.seen[key]){o.seen[key]=1;got.push(x)}});
    var hist=docs.slice();hist.sort(function(a,b){return (b.t||0)-(a.t||0)});SOC.notes[MYUID]=hist.slice(0,8);
  }catch(e){}
  if(got.length){persist();got.forEach(function(x,k){setTimeout(function(){pop((x.fromName||"A neighbor")+" visited your Loft"+(x.msg?": “"+x.msg+"”":" and said hi")+"  +5% XP today")},k*2400)});if(view==="hideout"&&typeof lfSync==="function")try{lfSync()}catch(e){}}
}
function socialBuffs(){var o=socState(),n=Math.min(3,o.vis.length),g=Math.min(3,Object.keys(o.gave).length),out=[];
  if(n)out.push({who:"Neighbors",b:{special:"all",pct:5*n,text:"All quests +"+(5*n)+"% XP ("+n+" visit"+(n>1?"s":"")+" today)"}});
  if(g)out.push({who:"Good neighbor",b:{special:"all",pct:2*g,text:"All quests +"+(2*g)+"% XP (you visited "+g+")"}});
  return out}
/* friends who said hi today walk around your lounge for half an hour */
function socVisitors(){var o=socState(),now=Date.now();return o.vis.filter(function(v){return v.look&&now-v.t<30*60000}).map(function(v,k){return {id:"sv:"+v.from,room:0,role:"visitor",look:v.look,visitor:1,fresh:now-v.t<90000,leaveAt:v.t+30*60000,k:k+5}})}
function socWorldCard(w){
  return '<div class="snw"><div class="snav">'+figSvg(w.look||lookOf(),"30 6 40 40",44,44)+'</div><div class="sni"><b>'+esc(w.name)+'</b><small>Lv '+(w.lv||1)+' · '+((w.rooms||[]).filter(Boolean).length)+' rooms · '+(w.streak||0)+'-day streak · '+socAgo(w.t||0)+'</small></div><button class="btn" data-act="snvisit" data-u="'+esc(w.id)+'">Visit</button></div>';
}
function socialHtml(){
  var h='<section class="card panel snpanel" id="socnb">'+socInner()+'</section>';
  setTimeout(function(){if(socOn()&&(!SOC.loaded||Date.now()-SOC.loaded>60000))socLoad();socPublish()},50);
  return h;
}
function socInner(){
  if(!db)return '<h3 class="label">Neighbors</h3><p class="note">Visiting other Lofts needs the cloud save. Open the shared link while signed in.</p>';
  if(!MYUID)return '<h3 class="label">Neighbors</h3><p class="note">Connecting…</p>';
  var o=socState(),h='<div class="row" style="justify-content:space-between"><h3 class="label">Neighbors</h3><button class="btn ghost sm" data-act="snref">Refresh</button></div>';
  if(o.vis.length)h+='<p class="note">Visited you today: '+o.vis.map(function(v){return '<b>'+esc(v.name)+'</b>'+(v.msg?' “'+esc(v.msg)+'”':'')}).join(", ")+'</p>';
  if(SOC.err)h+='<p class="note">Could not reach the neighborhood ('+esc(SOC.err)+'). Your access may be view-only.</p>';
  h+=SOC.worlds.length?SOC.worlds.map(socWorldCard).join(""):'<p class="note">'+(SOC.loaded?'No neighbors yet. Share this page with a friend as a Contributor and they will show up here once they open it.':'Looking for neighbors…')+'</p>';
  h+='<h3 class="label" style="margin-top:16px">Town board</h3><div class="snpost"><textarea id="sntext" maxlength="280" rows="2" placeholder="Post something for everyone in the neighborhood">'+esc(SOC.draft||"")+'</textarea><button class="btn" data-act="snpost">Post</button></div>';
  h+=SOC.posts.length?'<div class="snposts">'+SOC.posts.map(function(p){return '<div class="snp"><div><b>'+esc(p.name||"Neighbor")+'</b><small>'+socAgo(p.t||0)+'</small>'+(p.from===MYUID?'<button class="lnk" data-act="sndel" data-p="'+esc(p.id)+'">delete</button>':'')+'</div><p>'+esc(p.text||"")+'</p>'+(typeof townRxBar==="function"?townRxBar(p):'')+'</div>'}).join("")+'</div>':'<p class="note">No posts yet. Be the first.</p>';
  return h;
}
function socPaint(){var el=document.getElementById("socnb");if(el)el.innerHTML=socInner()}
function socVisitModal(uid){
  var w=SOC.worlds.filter(function(x){return x.id===uid})[0];if(!w)return;closeModals();
  var o=socState(),done=!!o.gave[uid],rooms=(w.rooms||[]).map(function(r,i){return r?'<div class="snroom"><div class="snrp">'+lfPreview({t:r.t,a:r.a||{},st:r.st||0},400+i)+'</div><small>'+esc((ROOMT[r.t]||{}).name||r.t)+' · '+Object.keys(r.a||{}).length+' upgrades</small></div>':''}).join("");
  var h='<div class="card box2 snvisit"><span class="label">Visiting</span><div class="row" style="gap:12px;align-items:center">'+figSvg(w.look||lookOf(),"30 6 40 40",56,56)+'<div><h2 style="font-size:26px;margin:0">'+esc(w.name)+'’s Loft</h2><small class="mono">Lv '+(w.lv||1)+' · '+(w.crew||0)+' crew · '+(w.served||0)+' dishes served</small></div></div>'
    +'<div class="snrooms">'+rooms+'</div>'
    +'<div class="snhi"><input id="snmsg" maxlength="80" placeholder="Leave a note (optional)"/><button class="btn" data-act="snhi" data-u="'+esc(uid)+'">'+(done?'Update note':'Say hi')+'</button></div>'
    +'<p class="note">Saying hi gives '+esc(w.name)+' +5% XP today and you +2% XP. You walk into their lounge for half an hour.</p>'
    +'<div id="snnotes"></div><div class="row"><button class="btn ghost" data-act="mclose">Close</button></div></div>';
  modal(h);socLoadNotes(uid);
}
async function socLoadNotes(uid){
  try{var a=await socPingsTo(uid);a.sort(function(x,y){return (y.t||0)-(x.t||0)});
    var el=document.getElementById("snnotes");if(el)el.innerHTML=a.length?'<h3 class="label">Guest book</h3>'+a.slice(0,6).map(function(x){return '<div class="snp"><div><b>'+esc(x.fromName||"Neighbor")+'</b><small>'+socAgo(x.t||0)+'</small></div><p>'+esc(x.msg||"Said hi")+'</p></div>'}).join(""):''}catch(e){}
}
function socialAct(a,b,e){
  if(a==="snref"){SOC.loaded=0;socLoad();return true}
  if(a==="snvisit"){socVisitModal(b.dataset.u);return true}
  if(a==="snhi"){var uid=b.dataset.u,w=SOC.worlds.filter(function(x){return x.id===uid})[0];if(!w||!socOn())return true;
    var inp=document.getElementById("snmsg"),msg=inp?String(inp.value||"").trim().slice(0,80):"",o=socState(),first=!o.gave[uid];
    b.disabled=true;
    socMine("pings",function(d){var sent=d.sent&&typeof d.sent==="object"?d.sent:{},cut=Date.now()-14*864e5;
        Object.keys(sent).forEach(function(k){if(!sent[k]||(sent[k].t||0)<cut)delete sent[k]});
        sent[uid]={toName:w.name,d:socToday(),t:Date.now(),msg:msg,look:lookOf()};d.sent=sent})
      .then(function(){if(first){o.gave[uid]=1;persist()}pop(first?"Said hi to "+w.name+". +2% XP today":"Note updated");socLoadNotes(uid);b.disabled=false;b.textContent="Update note"})
      .catch(function(er){b.disabled=false;pop("Could not send: "+((er&&er.code)||"error"))});
    return true}
  if(a==="snpost"){var ta=document.getElementById("sntext"),tx=ta?String(ta.value||"").trim().slice(0,280):"";if(!tx||!socOn())return true;
    if(Date.now()-SOC.lastPost<15000){pop("Slow down a little");return true}SOC.lastPost=Date.now();
    var pt=Date.now(),lk=lookOf();socMine("board",function(d){var a=Array.isArray(d.posts)?d.posts:[];a.unshift({t:pt,text:tx,look:lk});d.posts=a.slice(0,10)})
      .then(function(){SOC.draft="";SOC.posts.unshift({id:MYUID+"|"+pt,from:MYUID,name:(S.char&&S.char.name)||"Neighbor",text:tx,t:pt,look:lk});socPaint()})
      .catch(function(er){pop("Could not post: "+((er&&er.code)||"error"))});return true}
  if(a==="sndel"){var pid=b.dataset.p,pt2=+pid.split("|").pop();socMine("board",function(d){d.posts=(Array.isArray(d.posts)?d.posts:[]).filter(function(p){return p&&p.t!==pt2})}).then(function(){SOC.posts=SOC.posts.filter(function(p){return p.id!==pid});socPaint()}).catch(function(){});return true}
  return false;
}
setInterval(function(){if(socOn()&&!document.hidden){socCheckPings();socPublish()}},120000);
/*SOCIAL-END*/
/*ART-BEGIN*/
var ART={"coach_brick":__B[181],"coach_tam":__B[182],"coach_oru":__B[183],"coach_lio":__B[184],"coach_blaze":__B[185],"coach_pixie":__B[186],"coach_vanta":__B[187],"coach_mags":__B[188],"coach_ryo":__B[189],"coach_hikari":__B[190],"coach_quill":__B[191],"coach_dot":__B[192],"crew_mochi":__B[193],"crew_juno":__B[194],"crew_rook":__B[195],"crew_nova":__B[196],"crew_bleep":__B[197],"crew_vex":__B[198],"crew_ko":__B[199],"crew_echo":__B[200],"crew_brisa":__B[201],"crew_dax":__B[202],"crew_luna":__B[203],"room_bar":__B[204],"room_lounge":__B[205],"room_restaurant":__B[206],"room_garden":__B[207],"room_farm":__B[208],"room_pond":__B[209],"room_gameroom":__B[210],"room_studio":__B[211],"room_gym":__B[212],"room_library":__B[213],"room_dojo":__B[214],"room_sky":__B[215],"room_theater":__B[216],"room_club":__B[217],"room_spa":__B[218],"logo_board":__B[219],"rank_E":__B[220],"rank_D":__B[221],"rank_C":__B[222],"rank_A":__B[223],"rew_15":__B[224],"rew_20":__B[225],"rew_60":__B[226],"rew_75":__B[227],"rew_100":__B[228],"dog_chopstick":__B[229],"cl_home":__B[230],"cl_body":__B[231],"levelup":__B[232],"cl_boss":__B[233],"cl_social":__B[234],"cl_create":__B[235],"cl_admin":__B[236],"cl_reset":__B[237],"cl_out":__B[238],"friend_cynthia":__B[239],"friend_memo":__B[240],"friend_vega":__B[241],"friend_justin":__B[242],"friend_logan":__B[243],"dog_pluto":__B[244],"rew_50":__B[245],"rew_45":__B[246],"rew_40":__B[247],"rew_35":__B[248],"rew_30":__B[249],"rew_25":__B[250],"rew_5":__B[251],"class_tamer":__B[252],"class_swiftblade":__B[253],"class_runeweaver":__B[254],"class_vanguard":__B[255],"rank_S":__B[256],"rank_B":__B[257],"chest":__B[258],"rew_10":__B[259]};
/* A picture redrawn in the game's own style ships as art/app/ui_<name>.webp and replaces the built-in one here. */
(function(){var Q=window.QBART||{};Object.keys(ART).forEach(function(k){var u=Q["ui_"+k+".webp"];if(u)ART[k]=u})})();
/*ART-END*/
/*ART2-HELPERS*/
function rwImg(r,lock){var A=ART["rew_"+r[0]];return A?'<span class="rwimg'+(lock?' lock':'')+'"><img src="'+A+'" alt=""></span>':''}
function chestModal(note){var parts=String(note).split(" | "),main=parts.filter(function(x){return /Streak chest/.test(x)})[0]||note,rest=parts.filter(function(x){return x!==main});
  var m=modal('<div class="card box2 adv chestm"><span class="label">Day '+S.streak+' streak</span><div class="chestimg"><img src="'+ART.chest+'" alt=""></div><h2>Streak chest</h2><div class="reward">'+esc(main.replace("Streak chest: ",""))+'</div>'+rest.map(function(x){return '<p class="note">'+esc(x)+'</p>'}).join("")+'<button class="btn big" id="chok">Collect</button></div>');
  var b=m.querySelector("#chok");b.focus({preventScroll:true});b.onclick=function(){m.remove();render()};burst(innerWidth/2,innerHeight/3,30)}
window.qbDbg={S:function(){return S},levelUp:levelUp,adv:advModal,chest:chestModal,visit:maybeVisit,pickClass:pickClass,render:render,ADDONS:ADDONS,ADDREQ:ADDREQ,pv:lfPreview};
/*PXDATA-BEGIN*/var PXDATA={"frames":[{"x":0,"w":117,"h":273,"ax":71.8,"ay":260.9},{"x":119,"w":135,"h":272,"ax":74.9,"ay":258.0},{"x":256,"w":124,"h":272,"ax":54.8,"ay":258.0},{"x":382,"w":157,"h":250,"ax":105.2,"ay":240.0},{"x":541,"w":144,"h":265,"ax":70.2,"ay":256.4},{"x":687,"w":165,"h":265,"ax":67.7,"ay":256.4}],"sw":854,"sh":273,"layers":{"base0":__B[260],"base1":__B[261],"base2":__B[262],"base3":__B[263],"base4":__B[264],"base5":__B[265],"wbase0":__B[266],"wbase1":__B[267],"wbase2":__B[268],"wbase3":__B[269],"wbase4":__B[270],"wbase5":__B[271],"b_jeans":__B[272],"b_joggers":__B[273],"b_slacks":__B[274],"cw_astro":__B[275],"cw_dj":__B[276],"cw_hunter":__B[277],"cw_pop":__B[278],"cw_racer":__B[279],"cw_royalty":__B[280],"cw_samurai":__B[281],"cw_techwear":__B[282],"e_bright":__B[283],"e_cat":__B[284],"e_dot":__B[285],"e_happy":__B[286],"e_round":__B[287],"e_sharp":__B[288],"e_sleepy":__B[289],"e_tired":__B[290],"h_bob":__B[291],"h_buzz":__B[292],"h_curly":__B[293],"h_fade":__B[294],"h_long":__B[295],"h_slick":__B[296],"h_spiky":__B[297],"h_waves":__B[298],"m_grin":__B[299],"m_neutral":__B[300],"m_small":__B[301],"m_smile":__B[302],"m_smirk":__B[303],"s_loafers":__B[304],"s_sneakers":__B[305],"t_bomber":__B[306],"t_button":__B[307],"t_hoodie":__B[308],"t_tee":__B[309],"w_b_jeans":__B[310],"w_b_joggers":__B[311],"w_b_skirt":__B[312],"w_b_slacks":__B[313],"w_h_curtain":__B[314],"w_h_halfup":__B[315],"w_h_lob":__B[316],"w_h_pixie":__B[317],"w_h_pony":__B[318],"w_h_shag":__B[319],"w_h_sidep":__B[320],"w_s_loafers":__B[321],"w_s_sneakers":__B[322],"w_t_bomber":__B[323],"w_t_button":__B[324],"w_t_dress":__B[325],"w_t_hoodie":__B[326],"w_t_tee":__B[327]}};/*PXDATA-END*/
/*SPRDATA-BEGIN*/var LFSPR=window.LFSPR={"bd_bed2":{"w":700,"h":580,"u":__B[328]},"bd_nstand":{"w":344,"h":466,"u":__B[329]},"bd_ward2":{"w":312,"h":1037,"u":__B[330]},"bd_mirror":{"w":230,"h":507,"u":__B[331]},"bd_shelf":{"w":322,"h":521,"u":__B[332]},"bd_deskpc2":{"w":700,"h":743,"u":__B[333]},"bd_chair2":{"w":276,"h":510,"u":__B[334]},"bd_rug":{"w":700,"h":364,"u":__B[335]},"bd_plant":{"w":283,"h":504,"u":__B[336]},"bd_bed0":{"w":571,"h":477,"u":__B[337]},"bd_desk0":{"w":394,"h":404,"u":__B[338]},"bd_ward0":{"w":327,"h":542,"u":__B[339]},"bd_chair0":{"w":268,"h":446,"u":__B[340]},"bd_bed1":{"w":620,"h":507,"u":__B[341]},"bd_desk1":{"w":436,"h":449,"u":__B[342]},"bd_ward1":{"w":339,"h":538,"u":__B[343]},"bd_pc1":{"w":487,"h":457,"u":__B[344]},"bd_chair1":{"w":282,"h":522,"u":__B[345]},"w_win1_m":{"w":426,"h":750,"u":__B[346]},"w_win1":{"w":426,"h":750,"u":__B[347]},"w_win2_m":{"w":614,"h":773,"u":__B[348]},"w_win2":{"w":614,"h":773,"u":__B[349]},"w_art1":{"w":527,"h":649,"u":__B[350]},"w_art3":{"w":302,"h":605,"u":__B[351]},"w_fshelf":{"w":522,"h":438,"u":__B[352]},"w_clock":{"w":311,"h":352,"u":__B[353]},"w_neon":{"w":242,"h":507,"u":__B[354]},"rs_tbl2":{"w":469,"h":328,"u":__B[355]},"rs_tbl4":{"w":610,"h":493,"u":__B[356]},"rs_host":{"w":334,"h":514,"u":__B[357]},"rs_dessert":{"w":421,"h":514,"u":__B[358]},"rs_coffee":{"w":537,"h":480,"u":__B[359]},"w_winrs_m":{"w":600,"h":837,"u":__B[360]},"w_winrs":{"w":600,"h":837,"u":__B[361]},"rs_pend1":{"w":131,"h":567,"u":__B[362]},"rs_pend2":{"w":130,"h":571,"u":__B[363]},"rs_pend3":{"w":133,"h":651,"u":__B[364]},"rs_wine":{"w":513,"h":696,"u":__B[365]},"rs_star":{"w":309,"h":643,"u":__B[366]},"rs_chef":{"w":395,"h":641,"u":__B[367]},"w_prs":{"w":504,"h":486,"u":__B[368]},"w_winrs2_m":{"w":446,"h":900,"u":__B[369]},"w_winrs2":{"w":446,"h":900,"u":__B[370]},"rs2_counter":{"w":651,"h":523,"u":__B[371]},"rs2_bar":{"w":643,"h":524,"u":__B[372]},"rs2_stool":{"w":356,"h":454,"u":__B[373]},"w_pass":{"w":539,"h":577,"u":__B[374]},"w_backbar":{"w":558,"h":577,"u":__B[375]},"w_neonrs":{"w":435,"h":510,"u":__B[376]},"w_menu":{"w":520,"h":504,"u":__B[377]},"w_ovenwin":{"w":314,"h":468,"u":__B[378]},"gd_bed1":{"w":641,"h":509,"u":__B[379]},"gd_bed2":{"w":641,"h":456,"u":__B[380]},"gd_green":{"w":494,"h":536,"u":__B[381]},"gd_koi":{"w":522,"h":407,"u":__B[382]},"gd_lamp":{"w":286,"h":510,"u":__B[383]},"gd_berry":{"w":487,"h":400,"u":__B[384]},"gd_bee":{"w":338,"h":449,"u":__B[385]},"gd_crate":{"w":440,"h":388,"u":__B[386]},"gd_scare":{"w":350,"h":496,"u":__B[387]},"w_gtrel":{"w":549,"h":471,"u":__B[388]},"w_gfence":{"w":414,"h":519,"u":__B[389]},"rs3_tbl2":{"w":700,"h":515,"u":__B[390]},"rs3_tbl4":{"w":668,"h":548,"u":__B[391]},"rs3_stool":{"w":289,"h":538,"u":__B[392]},"rs3_counter":{"w":700,"h":551,"u":__B[393]},"rs3_chand":{"w":493,"h":545,"u":__B[394]},"rs3_cellar":{"w":406,"h":550,"u":__B[395]},"w_mirror3":{"w":440,"h":553,"u":__B[396]},"rs3_flora":{"w":441,"h":554,"u":__B[397]},"bld_a":{"w":190,"h":865,"u":__B[398]},"bld_a_m":{"w":190,"h":865,"u":__B[399]},"bld_b":{"w":300,"h":720,"u":__B[400]},"bld_b_m":{"w":300,"h":720,"u":__B[401]},"bld_c":{"w":300,"h":656,"u":__B[402]},"bld_c_m":{"w":300,"h":656,"u":__B[403]},"bld_d":{"w":300,"h":530,"u":__B[404]},"bld_d_m":{"w":300,"h":530,"u":__B[405]},"bld_e":{"w":300,"h":654,"u":__B[406]},"bld_e_m":{"w":300,"h":654,"u":__B[407]},"bld_f":{"w":300,"h":612,"u":__B[408]},"bld_f_m":{"w":300,"h":612,"u":__B[409]},"bld_g":{"w":300,"h":577,"u":__B[410]},"bld_g_m":{"w":300,"h":577,"u":__B[411]},"bld_h":{"w":300,"h":622,"u":__B[412]},"bld_h_m":{"w":300,"h":622,"u":__B[413]},"bld_i":{"w":300,"h":718,"u":__B[414]},"bld_i_m":{"w":300,"h":718,"u":__B[415]},"bld_j":{"w":300,"h":580,"u":__B[416]},"bld_j_m":{"w":300,"h":580,"u":__B[417]},"bld_k":{"w":300,"h":855,"u":__B[418]},"bld_k_m":{"w":300,"h":855,"u":__B[419]},"rsb_t2":{"w":700,"h":540,"u":__B[420]},"rsb_l1":{"w":700,"h":557,"u":__B[421]},"ar_fight":{"w":275,"h":542,"u":__B[422]},"ar_race":{"w":340,"h":472,"u":__B[423]},"ar_claw1":{"w":313,"h":560,"u":__B[424]},"ar_pin":{"w":340,"h":490,"u":__B[425]},"ar_hockey":{"w":340,"h":257,"u":__B[426]},"ar_foos":{"w":340,"h":320,"u":__B[427]},"ar_bean":{"w":340,"h":180,"u":__B[428]},"ar_vend":{"w":326,"h":523,"u":__B[429]},"ar_ticket":{"w":340,"h":358,"u":__B[430]},"arL_fight":{"w":329,"h":542,"u":__B[431]},"arL_race":{"w":340,"h":380,"u":__B[432]},"arL_prize":{"w":314,"h":572,"u":__B[433]},"arL_hockey":{"w":340,"h":243,"u":__B[434]},"arL_foos":{"w":340,"h":309,"u":__B[435]},"arL_sofa":{"w":340,"h":194,"u":__B[436]},"arL_vend":{"w":340,"h":478,"u":__B[437]},"arL_vr":{"w":340,"h":354,"u":__B[438]},"w_arneon":{"w":260,"h":261,"u":__B[439]},"w_arart":{"w":260,"h":439,"u":__B[440]},"w_arled":{"w":260,"h":148,"u":__B[441]},"w_arscore":{"w":260,"h":230,"u":__B[442]},"w_artv":{"w":260,"h":241,"u":__B[443]},"w_arclock":{"w":260,"h":302,"u":__B[444]},"lg_sofa":{"w":340,"h":271,"u":__B[445]},"lg_coffee":{"w":340,"h":234,"u":__B[446]},"lg_chair":{"w":340,"h":322,"u":__B[447]},"lg_media":{"w":340,"h":376,"u":__B[448]},"lg_dogbed":{"w":340,"h":210,"u":__B[449]},"lg_lamp":{"w":340,"h":380,"u":__B[450]},"lg_shelf":{"w":335,"h":595,"u":__B[451]},"lg_side":{"w":202,"h":413,"u":__B[452]},"lg_plant":{"w":313,"h":533,"u":__B[453]},"w_lgart":{"w":260,"h":164,"u":__B[454]},"w_lgshelf":{"w":260,"h":263,"u":__B[455]},"gy_bench":{"w":340,"h":355,"u":__B[456]},"gy_rack":{"w":340,"h":430,"u":__B[457]},"gy_db":{"w":340,"h":305,"u":__B[458]},"gy_tread":{"w":340,"h":376,"u":__B[459]},"gy_cable":{"w":291,"h":536,"u":__B[460]},"gy_bike":{"w":340,"h":375,"u":__B[461]},"gy_row":{"w":340,"h":285,"u":__B[462]},"gy_plates":{"w":340,"h":241,"u":__B[463]},"gy_mat":{"w":340,"h":474,"u":__B[464]},"gyL_bench":{"w":340,"h":339,"u":__B[465]},"gyL_rack":{"w":340,"h":437,"u":__B[466]},"gyL_db":{"w":340,"h":309,"u":__B[467]},"gyL_tread":{"w":340,"h":378,"u":__B[468]},"gyL_cable":{"w":340,"h":444,"u":__B[469]},"gyL_bike":{"w":340,"h":415,"u":__B[470]},"gyL_row":{"w":340,"h":196,"u":__B[471]},"gyL_kb":{"w":263,"h":491,"u":__B[472]},"gyL_stretch":{"w":340,"h":306,"u":__B[473]},"w_gymirror":{"w":260,"h":435,"u":__B[474]},"w_gybolt":{"w":224,"h":463,"u":__B[475]},"w_gytv":{"w":260,"h":171,"u":__B[476]},"w_gyclock":{"w":260,"h":307,"u":__B[477]},"w_gyposter":{"w":260,"h":497,"u":__B[478]},"br_bar":{"w":340,"h":260,"u":__B[479]},"br_stool":{"w":273,"h":520,"u":__B[480]},"br_back":{"w":340,"h":305,"u":__B[481]},"br_high":{"w":340,"h":486,"u":__B[482]},"br_sofa":{"w":340,"h":290,"u":__B[483]},"br_fire":{"w":340,"h":236,"u":__B[484]},"br_station":{"w":340,"h":260,"u":__B[485]},"br_ice":{"w":194,"h":521,"u":__B[486]},"br_palm":{"w":340,"h":434,"u":__B[487]},"brL_bar":{"w":340,"h":259,"u":__B[488]},"brL_stool":{"w":254,"h":468,"u":__B[489]},"brL_back":{"w":340,"h":418,"u":__B[490]},"brL_high":{"w":282,"h":451,"u":__B[491]},"brL_sofa":{"w":340,"h":200,"u":__B[492]},"brL_fire":{"w":340,"h":234,"u":__B[493]},"brL_station":{"w":340,"h":429,"u":__B[494]},"brL_tower":{"w":306,"h":531,"u":__B[495]},"brL_tree":{"w":340,"h":488,"u":__B[496]},"w_brneon":{"w":260,"h":311,"u":__B[497]},"w_brshelf":{"w":260,"h":144,"u":__B[498]},"w_brclock":{"w":260,"h":278,"u":__B[499]},"w_brmenu":{"w":260,"h":205,"u":__B[500]},"lb_shelf":{"w":327,"h":595,"u":__B[501]},"lb_corner":{"w":340,"h":376,"u":__B[502]},"lb_chair":{"w":340,"h":378,"u":__B[503]},"lb_desk":{"w":340,"h":359,"u":__B[504]},"lb_dchair":{"w":304,"h":490,"u":__B[505]},"lb_globe":{"w":339,"h":452,"u":__B[506]},"lb_table":{"w":340,"h":298,"u":__B[507]},"lb_lamp":{"w":339,"h":476,"u":__B[508]},"lb_fern":{"w":340,"h":344,"u":__B[509]},"w_lbmap":{"w":260,"h":308,"u":__B[510]},"w_lbclock":{"w":260,"h":319,"u":__B[511]},"w_lbpeg":{"w":260,"h":327,"u":__B[512]},"dj_dummy":{"w":267,"h":536,"u":__B[513]},"dj_rack":{"w":300,"h":357,"u":__B[514]},"dj_bonsai":{"w":300,"h":377,"u":__B[515]},"dj_bag":{"w":300,"h":527,"u":__B[516]},"dj_tatami":{"w":300,"h":228,"u":__B[517]},"dj_gong":{"w":300,"h":426,"u":__B[518]},"dj_cush":{"w":300,"h":173,"u":__B[519]},"dj_tea":{"w":300,"h":237,"u":__B[520]},"djL_dummy":{"w":277,"h":517,"u":__B[521]},"djL_rack":{"w":300,"h":287,"u":__B[522]},"djL_bonsai":{"w":300,"h":413,"u":__B[523]},"djL_bag":{"w":300,"h":440,"u":__B[524]},"djL_tatami":{"w":300,"h":245,"u":__B[525]},"djL_gong":{"w":300,"h":437,"u":__B[526]},"djL_cush":{"w":300,"h":173,"u":__B[527]},"djL_cab":{"w":300,"h":291,"u":__B[528]},"djL_tea":{"w":300,"h":237,"u":__B[529]},"w_djscroll":{"w":300,"h":630,"u":__B[530]},"w_djbelts":{"w":300,"h":226,"u":__B[531]},"w_djwave":{"w":300,"h":412,"u":__B[532]},"w_djshoji":{"w":300,"h":418,"u":__B[533]},"w_djcarve":{"w":300,"h":297,"u":__B[534]},"w_djclock":{"w":300,"h":358,"u":__B[535]},"th_sofa":{"w":300,"h":288,"u":__B[536]},"th_pop":{"w":272,"h":497,"u":__B[537]},"th_ctr":{"w":300,"h":299,"u":__B[538]},"th_spk":{"w":168,"h":415,"u":__B[539]},"th_drk":{"w":278,"h":386,"u":__B[540]},"th_proj":{"w":260,"h":489,"u":__B[541]},"cl_dj":{"w":300,"h":261,"u":__B[542]},"cl_spk":{"w":176,"h":422,"u":__B[543]},"cl_bar":{"w":300,"h":263,"u":__B[544]},"cl_sofa":{"w":300,"h":229,"u":__B[545]},"cl_high":{"w":300,"h":276,"u":__B[546]},"cl_ball":{"w":254,"h":525,"u":__B[547]},"cl_rope":{"w":300,"h":339,"u":__B[548]},"cl_truss":{"w":300,"h":345,"u":__B[549]},"cl_fog":{"w":300,"h":337,"u":__B[550]},"clL_dj":{"w":300,"h":287,"u":__B[551]},"clL_spk":{"w":160,"h":399,"u":__B[552]},"clL_bar":{"w":300,"h":277,"u":__B[553]},"clL_sofa":{"w":300,"h":231,"u":__B[554]},"clL_high":{"w":300,"h":277,"u":__B[555]},"clL_ball":{"w":300,"h":426,"u":__B[556]},"clL_rope":{"w":300,"h":351,"u":__B[557]},"w_clbolt":{"w":237,"h":494,"u":__B[558]},"w_clled":{"w":300,"h":262,"u":__B[559]},"w_clart":{"w":300,"h":402,"u":__B[560]},"w_cllaser":{"w":300,"h":186,"u":__B[561]},"sp_table":{"w":300,"h":252,"u":__B[562]},"sp_tub":{"w":300,"h":258,"u":__B[563]},"sp_sauna":{"w":300,"h":303,"u":__B[564]},"sp_stones":{"w":300,"h":195,"u":__B[565]},"sp_candle":{"w":300,"h":342,"u":__B[566]},"sp_robes":{"w":300,"h":184,"u":__B[567]},"sp_chaise":{"w":300,"h":255,"u":__B[568]},"sp_foot":{"w":300,"h":228,"u":__B[569]},"sp_bamboo":{"w":300,"h":712,"u":__B[570]},"cl_spk2":{"w":176,"h":420,"u":__B[571]},"clL_spk2":{"w":160,"h":398,"u":__B[572]},"spL_table":{"w":300,"h":245,"u":__B[573]},"spL_tub":{"w":300,"h":185,"u":__B[574]},"spL_sauna":{"w":300,"h":370,"u":__B[575]},"spL_stones":{"w":300,"h":170,"u":__B[576]},"spL_candle":{"w":220,"h":498,"u":__B[577]},"spL_robes":{"w":300,"h":421,"u":__B[578]},"spL_chaise":{"w":300,"h":266,"u":__B[579]},"spL_foot":{"w":300,"h":350,"u":__B[580]},"spL_orchid":{"w":300,"h":441,"u":__B[581]},"thL_sofa":{"w":300,"h":294,"u":__B[582]},"thL_pop":{"w":300,"h":433,"u":__B[583]},"thL_ctr":{"w":300,"h":245,"u":__B[584]},"thL_spk":{"w":272,"h":503,"u":__B[585]},"thL_cart":{"w":300,"h":369,"u":__B[586]},"thL_proj":{"w":225,"h":521,"u":__B[587]},"w_thposter":{"w":300,"h":489,"u":__B[588]},"w_thsconce":{"w":251,"h":416,"u":__B[589]},"w_threel":{"w":300,"h":323,"u":__B[590]},"w_thmarq":{"w":300,"h":286,"u":__B[591]},"w_thclap":{"w":300,"h":399,"u":__B[592]},"w_spart":{"w":300,"h":587,"u":__B[593]},"w_spglass":{"w":300,"h":434,"u":__B[594]},"w_spfount":{"w":300,"h":405,"u":__B[595]},"w_spclock":{"w":300,"h":342,"u":__B[596]},"w_thclock":{"w":300,"h":324,"u":__B[597]},"th_spk2":{"w":168,"h":415,"u":__B[598]},"ts_r1":{"w":260,"h":322,"u":__B[599]},"ts_r2":{"w":260,"h":221,"u":__B[600]},"ts_b1":{"w":260,"h":264,"u":__B[601]},"ts_b2":{"w":260,"h":218,"u":__B[602]},"ts_v1":{"w":260,"h":288,"u":__B[603]},"ts_v2":{"w":260,"h":223,"u":__B[604]},"lgL_sofa":{"w":300,"h":172,"u":__B[605]},"lgL_coffee":{"w":300,"h":219,"u":__B[606]},"lgL_chair":{"w":300,"h":366,"u":__B[607]},"lgL_media":{"w":300,"h":294,"u":__B[608]},"lgL_shelf":{"w":300,"h":509,"u":__B[609]},"lgL_side":{"w":224,"h":435,"u":__B[610]},"lgL_plant":{"w":300,"h":418,"u":__B[611]},"lbL_shelf":{"w":300,"h":505,"u":__B[612]},"lbL_corner":{"w":300,"h":224,"u":__B[613]},"lbL_chair":{"w":300,"h":380,"u":__B[614]},"lbL_desk":{"w":300,"h":291,"u":__B[615]},"lbL_globe":{"w":300,"h":414,"u":__B[616]},"lbL_table":{"w":300,"h":277,"u":__B[617]},"lbL_lamp":{"w":233,"h":334,"u":__B[618]},"lbL_fern":{"w":300,"h":292,"u":__B[619]},"lo_booth":{"w":300,"h":487,"u":__B[620]},"lo_ctr":{"w":300,"h":246,"u":__B[621]},"lo_candy":{"w":300,"h":329,"u":__B[622]},"lo_soda":{"w":300,"h":411,"u":__B[623]},"lo_stand":{"w":286,"h":501,"u":__B[624]},"lo_pop":{"w":300,"h":510,"u":__B[625]},"lo_nacho":{"w":300,"h":413,"u":__B[626]},"lo_dog":{"w":300,"h":375,"u":__B[627]},"lo_bins":{"w":300,"h":359,"u":__B[628]},"loL_sign":{"w":300,"h":436,"u":__B[629]},"loL_ctr":{"w":300,"h":211,"u":__B[630]},"loL_candy":{"w":300,"h":331,"u":__B[631]},"loL_taps":{"w":300,"h":259,"u":__B[632]},"loL_stand":{"w":300,"h":521,"u":__B[633]},"loL_pop":{"w":300,"h":448,"u":__B[634]},"loL_nacho":{"w":300,"h":245,"u":__B[635]},"loL_dog":{"w":300,"h":392,"u":__B[636]},"loL_bins":{"w":300,"h":346,"u":__B[637]},"sk_pond":{"w":300,"h":221,"u":__B[638]},"sk_fire":{"w":300,"h":243,"u":__B[639]},"sk_bed":{"w":300,"h":329,"u":__B[640]},"sk_scope":{"w":286,"h":422,"u":__B[641]},"sk_dj":{"w":300,"h":266,"u":__B[642]},"sk_cart":{"w":300,"h":367,"u":__B[643]},"sk_cab":{"w":300,"h":351,"u":__B[644]},"sk_sofa":{"w":300,"h":207,"u":__B[645]},"sk_tree":{"w":300,"h":528,"u":__B[646]},"skL_pond":{"w":300,"h":206,"u":__B[647]},"skL_fire":{"w":300,"h":227,"u":__B[648]},"skL_bed":{"w":300,"h":312,"u":__B[649]},"skL_scope":{"w":299,"h":418,"u":__B[650]},"skL_dj":{"w":300,"h":266,"u":__B[651]},"skL_cart":{"w":300,"h":357,"u":__B[652]},"skL_cab":{"w":300,"h":321,"u":__B[653]},"skL_sofa":{"w":300,"h":230,"u":__B[654]},"skL_tree":{"w":289,"h":454,"u":__B[655]},"bd_pc2o":{"w":568,"h":466,"u":__B[656]}};var LFTEX=window.LFTEX={"f_oak":__B[657],"f_grey":__B[658],"f_walnut":__B[659],"f_herring":__B[660],"f_concrete":__B[661],"f_marble":__B[662],"f_slate":__B[663],"f_white":__B[664],"f_bamboo":__B[665],"w_brick":__B[666],"w_brickw":__B[667],"w_brickd":__B[668],"w_plaster":__B[669],"w_navy":__B[670],"w_sage":__B[671],"w_slat":__B[672],"w_concw":__B[673],"w_blush":__B[674]};/*SPRDATA-END*/
/*CHIBI-BEGIN*/
/* ---------- chibi paper-doll: painted layers composed on canvas ---------- */
var CHB={meta:null,img:{},ready:false,cache:{},want:0,K:.235,FLIP:1};
var CHMAP={
  hair:{textured:"fade",undercut:"fade",fade:"fade",sidepart:"side",side:"side",slick:"slick",buzz:"buzz",curly:"curly",spiky:"spiky",spike:"spiky",wolf:"wolf",long:"long",waves:"waves",pony:"pony",twin:"twin",bob:"bob",lob:"lob",curtain:"curtain",pixie:"pixie",shag:"shag",halfup:"halfup",bun:"bun",buns:"bun",afro:"afro",mohawk:"mohawk",braids:"braids",none:"buzz"},
  top:{tee:"tee",hoodie:"hoodie",longsleeve:"sweater",turtle:"sweater",sweater:"sweater",cardigan:"sweater",coat:"blazer",blazer:"blazer",jacket:"bomber",bomber:"bomber",crop:"crop",tank:"crop",button:"button",plaid:"plaid",flannel:"plaid",dress:"dress",leather:"leather",varsity:"varsity",puffer:"puffer",trench:"trench",denim:"denim",cloak:"cloak"},
  bot:{pants:"slacks",slacks:"slacks",wide:"slacks",joggers:"joggers",cargo:"cargo",jeans:"jeans",shorts:"shorts",skirt:"skirt"},
  shoes:{sneakers:"sneakers",flats:"loafers",loafers:"loafers",boots:"boots",heels:"boots",hightops:"hightops"},
  acc:{glasses:"glasses",sunglasses:"sunglasses",phones:"headphones",headphones:"headphones",chain:"chain","chain+cross":"chain",cap:"cap",beanie:"beanie",bucket:"bucket",scarf:"scarf"}
};
var CHHAT={cap:1,beanie:1,bucket:1};
var CHSK=["#ecc3a4","#e9b892","#d8a07a","#b97f56","#8d5a3b","#5e3a26"];
function chRGB(h){h=String(h||"#888").replace("#","");if(h.length===3)h=h.split("").map(function(c){return c+c}).join("");var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]}
function chSkin(hex){var c=chRGB(hex),b=0,bd=1e9;CHSK.forEach(function(s,i){var d=chRGB(s),e=(d[0]-c[0])*(d[0]-c[0])+(d[1]-c[1])*(d[1]-c[1])+(d[2]-c[2])*(d[2]-c[2]);if(e<bd){bd=e;b=i}});return b}
function chHas(k){return !!(CHB.meta&&CHB.meta.layers[k])}
function chW(k,fem){return (fem&&chHas("w_"+k))?"w_"+k:k}
function chParts(L){
  if(!L||typeof L!=="object")return null;
  var fem=L.sex==="f",cs=L.costume&&chHas((fem&&chHas("cw_"+L.costume)?"cw_":"c_")+L.costume)?((fem&&chHas("cw_"+L.costume)?"cw_":"c_")+L.costume):null,t=CHMAP.top[L.top&&L.top.s]||"tee",b=CHMAP.bot[L.bottom&&L.bottom.s]||"joggers",p=[[(fem&&chHas("wbase0")?"w":"")+"base"+chSkin(L.skin),null]];
  if(cs){p.push([cs,null])}else{
  if(t!=="dress")p.push([chW("b_"+b,fem),(L.bottom&&L.bottom.c)||"#2a2a36"]);
  var sh=CHMAP.shoes[L.shoes&&L.shoes.s]||"sneakers";p.push([chW("s_"+sh,fem),(L.shoes&&L.shoes.c)||(sh==="boots"?"#6a4a32":"#f2f2f6")]);
  p.push([chW("t_"+t,fem),(L.top&&L.top.c)||"#22232e"]);}
  p.push(["e_"+(L.eyeT||"round"),(L.eyes&&L.eyes!==EYEC[0])?L.eyes:null]);
  p.push(["m_"+(L.mouth||"smile"),null]);
  (L.extra||[]).forEach(function(x){p.push(["x_"+x,null])});
  if(L.beard)p.push(["f_"+(L.beardS||"beard"),L.hair||"#1d1a22"]);
  if(L.mask)p.push(["mk_"+L.mask,L.maskC||null]);
  var acc=(L.acc||[]).map(function(a){return CHMAP.acc[a]}).filter(Boolean);
  var hk=CHMAP.hair[L.hair_s]||"curly";if(!chHas("h_"+hk)&&!chHas("w_h_"+hk))hk="curly";p.push([chW("h_"+hk,fem),L.hair||"#1d1a22"]);
  acc.forEach(function(k){p.push(["a_"+k,CHHAT[k]?(L.accC||"#2a2a36"):null])});
  return p.filter(function(x){return chHas(x[0])});
}
function chLoad(){
  if(CHB.want)return;CHB.want=1;
  var go=function(m){CHB.meta=m;Object.keys(m.dogs||{}).forEach(function(d){m.layers["dog_"+d]=m.dogs[d].f});var ks=Object.keys(m.layers),n=ks.length;
    ks.forEach(function(k){var im=new Image();im.onload=im.onerror=function(){if(--n===0){CHB.ready=true;CHB.cache={};try{PXC={}}catch(e){}try{Object.keys(LFA).forEach(function(id){LFA[id]._k=null})}catch(e){}try{render()}catch(e){}}};im.src=m.layers[k];CHB.img[k]=im})};
  if(typeof PXDATA!=="undefined"&&PXDATA){go(PXDATA);return}
  fetch("sp2/pix.json").then(function(r){return r.json()}).then(go).catch(function(){});
}
function chTintCanvas(img,f,tint){
  var c=document.createElement("canvas");c.width=f.w;c.height=f.h;var x=c.getContext("2d");
  x.drawImage(img,f.x,0,f.w,f.h,0,0,f.w,f.h);
  if(tint){x.globalCompositeOperation="multiply";x.fillStyle=tint;x.fillRect(0,0,f.w,f.h);x.globalCompositeOperation="destination-in";x.drawImage(img,f.x,0,f.w,f.h,0,0,f.w,f.h)}
  return c;
}
function chEyeCanvas(img,f,hex){
  var c=document.createElement("canvas");c.width=f.w;c.height=f.h;var x=c.getContext("2d");
  x.drawImage(img,f.x,0,f.w,f.h,0,0,f.w,f.h);if(!hex)return c;
  var d=x.getImageData(0,0,f.w,f.h),a=d.data,t=chRGB(hex),i,r,g,b,mx,mn,v,sa,lum,k;
  for(i=0;i<a.length;i+=4){if(a[i+3]<8)continue;r=a[i];g=a[i+1];b=a[i+2];mx=Math.max(r,g,b);mn=Math.min(r,g,b);v=mx/255;sa=mx?(mx-mn)/mx:0;
    if(sa>.28&&v>.26&&v<.9&&r>b+22){lum=(.3*r+.59*g+.11*b)/255;k=Math.max(.55,Math.min(1.45,lum/.34));a[i]=Math.min(255,t[0]*k);a[i+1]=Math.min(255,t[1]*k);a[i+2]=Math.min(255,t[2]*k)}}
  x.putImageData(d,0,0);return c;
}
function chDog(n,p){
  if(!CHB.ready||!CHB.meta.dogs||!CHB.meta.dogs[n])return null;var D=CHB.meta.dogs[n],fi=p==="sleep"?3:p==="sit"?2:(typeof p==="number"&&p%2)?1:0,key="dog|"+n+"|"+fi;if(CHB.cache[key])return CHB.cache[key];
  var im=CHB.img["dog_"+n];if(!im||!im.naturalWidth)return null;var f=D.frames[fi],c=document.createElement("canvas");c.width=f.w;c.height=f.h;c.getContext("2d").drawImage(im,f.x,0,f.w,f.h,0,0,f.w,f.h);
  var o={u:c.toDataURL("image/png"),w:f.w,h:f.h,ax:f.ax,ay:f.ay};CHB.cache[key]=o;return o}
/* pose index: 0 stand, 1 walk, 2 back-walk, 3 sit, 4 wave, 5 arms forward */
function chFrame(L,pi){
  if(!CHB.ready)return null;var parts=chParts(L);if(!parts||!parts.length)return null;
  var key=pi+"|"+JSON.stringify(parts);if(CHB.cache[key])return CHB.cache[key];
  var f=CHB.meta.frames[pi],c=document.createElement("canvas");c.width=f.w;c.height=f.h;var x=c.getContext("2d");
  parts.forEach(function(p){var im=CHB.img[p[0]];if(!im||!im.naturalWidth)return;x.drawImage(p[0].indexOf("e_")===0?chEyeCanvas(im,f,p[1]):chTintCanvas(im,f,p[1]),0,0)});
  var o={u:c.toDataURL("image/png"),w:f.w,h:f.h,ax:f.ax,ay:f.ay};CHB.cache[key]=o;return o;
}
var CHCROP={full:[0,0,1,1],head:[.3,.01,.64,.22],avatar:[.345,.06,.52,.245],face:[.38,.02,.48,.15],bust:[0,0,1,.66],a_hair:[.3,.01,.64,.22],a_hairc:[.3,.01,.64,.22],a_eyes:[.38,.02,.48,.15],a_eyet:[.38,.02,.48,.15],a_xface:[.38,.02,.48,.15],a_beard:[.38,.02,.48,.15],a_mask:[.38,.02,.48,.15],a_outfit:[0,.1,1,.9],a_acc:[0,0,1,.66],a_top:[0,.14,1,.4],a_pants:[0,.5,1,.4],a_shoes:[0,.82,1,.18],a_back:[0,0,1,1],outfit:[0,.1,1,.9]};
function chImg(L,crop,w,h,cls,pi){
  var fr=chFrame(L,pi||0);if(!fr)return null;
  var c=typeof crop==="string"?(CHCROP[crop]||CHCROP.full):[0,0,1,1],cx=c[0]*fr.w,cy=c[1]*fr.h,cw=c[2]*fr.w,ch=c[3]*fr.h,s=Math.min(w/cw,h/ch);
  return '<span class="pxa chb'+(cls?" "+cls:"")+'" style="width:'+w+'px;height:'+h+'px;background-image:url(&quot;'+fr.u+'&quot;);background-size:'+(fr.w*s).toFixed(1)+'px '+(fr.h*s).toFixed(1)+'px;background-position:'+((w-cw*s)/2-cx*s).toFixed(1)+'px '+((h-ch*s)/2-cy*s).toFixed(1)+'px" aria-hidden="true"></span>';
}
/* loft pose from the agent's animation state */
function chPose(a,f){
  if(a.mode==="walk"){if(a.carry)return 5;return a.back?2:(f.p%2?1:0)}
  var act=f.act;
  if(act==="sit"||act==="type"||act==="read"||act==="eat"||act==="lie")return 3;
  if(act==="up"||act==="wave")return 4;
  if(act==="work2"||act==="reach"||act==="carry"||act==="water"||act==="lean")return 5;
  return 0;
}
/* friends' looks now live in 29k_friends.js, drawn by the rig like the player */
/*CHIBI-END*/
function fresh(){
  return {xp:0,done:{},stats:{creativity:0,discipline:0,fitness:0,productivity:0,social:0},streak:0,lastDone:"",
    quests:DEFAULTS.map(function(d,i){return {id:"q"+i,name:d[0],xp:d[1],stat:d[2],cl:d[3],why:d[4],rep:d[5]}}),next:DEFAULTS.length,
    xpc2:1,gates:[],claimed:{},gym:null,combo:null,raid:null,vdone:{},vxp:0,bigxp:0,total:0,vcount:0,freezes:0,chests:{},badges:{},hashes:[],dayXp:{d:"",x:0},runDate:"",cleared:0,crits:0,coins:0,earnedC:0,spent:0,k10:1,v001:1,cdone:{},owned:{},eq:{},lvPaid:1,best:0,cls:"",spec:"",oath:"",wheel:"",wheelRes:"",away:{},char:defChar(""),created:false,fx1022:true,rst2:true,base:baseFresh(),active:{},weekPaid:{},gymlog:{},sessions:[],wk:null};
}
var S=fresh(), db=null, saveT=null, busy=false, status="", newIds={}, draft="", gateLines=[], gateBusy=false;

function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function dstr(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function today(){return dstr(new Date())}
function yest(){var d=new Date();d.setDate(d.getDate()-1);return dstr(d)}
function dayDiff(a,b){var p=function(x){var t=x.split("-");return new Date(+t[0],+t[1]-1,+t[2])};return Math.round((p(b)-p(a))/86400000)}
function streakNow(){if(!S.lastDone)return 0;var g=dayDiff(S.lastDone,today());return (g<=1||(g===2&&S.freezes>0))?S.streak:0}
function visQ(q){return !(q.rep==="weekly4"&&typeof weekCount==="function"&&weekCount()>=4)}
function ordered(){var o=[];CLUSTERS.forEach(function(c){S.quests.forEach(function(q){if(q.cl===c[0]&&visQ(q))o.push(q)})});return o}
function statName(k){return (STATS.filter(function(s){return s[0]===k})[0]||["","General"])[1]}
function doneXp(q){var d=S.done[q.id];return typeof d==="number"?d:q.xp}

/* level, gates, ranks */
/* a level a day early on, about ten days a level at the cap. See docs/ECONOMY.md */
/* XP to reach level L. Cal, 2026-11-05 (docs/PROGRESSION.md): level L to L+1 costs min(600, 50+6L+0.2L²), so level 10 comes in
   about 4 days and no level takes more than about 3 normal days. cumOld is the old curve, kept for moving old saves over. */
/* Cal, 2026-11-05: "a serious player can get to lvl 100 in 50 ish days". With XP only from real life a heavy player earns
   about 950 a day, so level 100 costs about 46,700 XP: min(ECON.xpCap, ECON.xpK x (50 + 6L + 0.2L^2)), xpK 1, cap 600. */
var CUMT=[0,0];(function(){for(var L=1;L<=MAXL+50;L++)CUMT.push(CUMT[L]+Math.min(ECON.xpCap,Math.round(ECON.xpK*(50+6*L+.2*L*L))))})();
function cum(L){return L<=1?0:L<CUMT.length?CUMT[L]:CUMT[CUMT.length-1]+(L-CUMT.length+1)*ECON.xpCap}
function cumOld(L){return Math.round(((L-1)*100+.19*(L-2)*(L-1)*(2*L-3)/6)/5)*5}
function levelPay(L){return 100+10*L}
function lvlOf(xp){var L=1;while(L<MAXL&&xp>=cum(L+1))L++;return L}
function need(L){return cum(L+1)-cum(L)}
function rawLvl(){return lvlOf(S.xp)}
function integrity(){return S.bigxp>0?Math.min(1,S.vxp/S.bigxp):1}
function hashFile(buf){var u=new Uint8Array(buf),h=2166136261;for(var i=0;i<Math.min(u.length,8192);i++){h^=u[i];h=Math.imul(h,16777619)>>>0}return h+":"+buf.byteLength}
function isCrit(q){if(q.xp<10)return false;var d=q.id+today(),h=0;for(var i=0;i<d.length;i++)h=(h*31+d.charCodeAt(i))>>>0;return h%20<(hasSpecial("crit")?3:2)}
function openGate(){for(var i=0;i<GATES.length;i++){if(S.gates.indexOf(GATES[i])<0)return GATES[i]}return null}
function gated(){var g=openGate();return (g!==null&&rawLvl()>=g)?g:null}
function effLvl(){var g=gated();return g!==null?g-1:rawLvl()}
function rankIdx(){return TIER_RANK[Math.min(S.gates.length,9)]}

/* multipliers */
function bountyId(){var l=ordered().filter(function(q){return q.xp>=25});if(!l.length)return null;var d=today(),h=0;for(var i=0;i<d.length;i++)h=(h*31+d.charCodeAt(i))>>>0;return l[h%l.length].id}
function mults(q,o){
  o=o||{};var m=1,tags=[],now=Date.now(),ri=rankIdx();
  if(q.xp>=50&&!o.verified){m*=.5;tags.push("Honor x0.5")}
  /* Prove it pays double, coins included (coins follow XP), so a photo is always worth taking (Cal, 2026-11-05) */
  if(q.xp>=25&&o.verified){var vb2=hasSpecial("verify")?2.1:2;m*=vb2;tags.push("Verified x"+vb2)}
  var sm=1+Math.min(streakCap(),.02*streakNow());if(sm>1){m*=sm;tags.push("Streak x"+sm.toFixed(2))}
  var cp=crewPct(q);if(cp>0){m*=1+cp/100;tags.push("Perks +"+cp+"%")}
  if(S.cls==="runeweaver"&&q.stat==="creativity"&&S.quests.some(function(q2){return q2.id!==q.id&&q2.stat==="creativity"&&S.done[q2.id]})){m*=1.2;tags.push("Encore x1.2")}
  if(ri>=1){var n=(S.combo&&now-S.combo.t<(hasSpecial("combo")?3300000:2700000))?S.combo.n+1:1;var c=Math.min(1.5,1+0.1*(n-1));if(c>1){m*=c;tags.push("Combo x"+c.toFixed(1))}if(o.commit)S.combo={n:n,t:now}}
  if(ri>=2&&q.id===bountyId()){m*=2;tags.push("Bounty x2")}
  if(ri>=4&&S.raid&&S.raid.id===q.id&&now<=S.raid.end){m*=1.25;tags.push("Raid x1.25")}
  if(ri>=5){m*=1.1;tags.push("Monarch x1.1")}
  if(o.commit&&isCrit(q)){m*=1.5;tags.push("CRITICAL HIT")}
  return {m:m,tags:tags,xp:Math.max(1,Math.round(q.xp*m))};
}

var SAVEOK=0,SAVEERR="";function saveLbl(){if(saveMode!=="cloud")return "this device only"+(window.__qbBootErr?" ("+String(window.__qbBootErr).replace(/[<>]/g,"").slice(0,80)+")":"");if(SAVEERR)return "NOT SAVING ("+SAVEERR+")";if(!SAVEOK)return "cloud save";var d=new Date(SAVEOK);return "saved "+d.getHours()+":"+String(d.getMinutes()).padStart(2,"0")}
var DOC="player/state", ownerView=false, APPV=62, saveMode="local", newerSeen=false, saveWarned=false;
async function checkInbox(){
  if(!db||!ownerView||!loaded)return;
  try{var sn=await db.doc("inbox/owner").get();if(!sn.exists)return;var it=(sn.data().items)||[],n=0;if(!S.inbox||typeof S.inbox!=="object")S.inbox={};
    it.forEach(function(x){if(!x||!x.id||S.inbox[x.id]||!x.name)return;S.inbox[x.id]=1;var id="q"+(S.next++);
      S.quests.push({id:id,name:String(x.name).slice(0,90),xp:clampXp(x.xp||10),stat:STATS.some(function(s){return s[0]===x.stat})?x.stat:"productivity",cl:CLUSTERS.some(function(c){return c[0]===x.cl})?x.cl:"admin",why:String(x.why||"").slice(0,80),rep:x.rep==="daily"?"daily":"once"});newIds[id]=1;n++});
    if(n){render();persist();pop(n+" new quest"+(n>1?"s":"")+" added")}}catch(e){}
}

function persist(){
  if(!loaded)return;
  var blank=!S.created&&isNewPlayer();
  if(newerSeen){pop("A newer version saved your progress. Reload to continue.");return}
  S.appv=APPV;S.epoch=QB_EPOCH;S.tshift=window.__qbShift||0;
  clearTimeout(saveT);
  saveT=setTimeout(function(){
    S.savedAt=Date.now();if(MYUID)S.uid=MYUID;
    var js=JSON.stringify(S);
    try{localStorage.setItem("quest-board",js)}catch(e){}
    try{ if(db&&!blank){ db.doc(DOC).set(JSON.parse(js)).then(function(){SAVEOK=Date.now();SAVEERR="";var el=document.getElementById("savest");if(el)el.textContent=saveLbl()}).catch(function(er){SAVEERR=(er&&er.code)||"error";var el=document.getElementById("savest");if(el)el.textContent=saveLbl();if(!saveWarned){saveWarned=true;pop("Not saving: "+SAVEERR+". Reload the page.")}}) } }catch(e){}
  },350);
}
/* The database hands back deep frozen objects, and merge writes into what it is given (S.stats below threw on `creativity`,
   which sent every device to "this device only" from about v37 on). So it works on its own copy. */
function merge(d){if(!d||d.epoch!==QB_EPOCH)return;d=JSON.parse(JSON.stringify(d));window.__qbShift=d.tshift||0;
  /* the areas-seen record belongs to the save: one merged in without it (another device's save, a backup) gets a new one at its own level (29h_unlocks.js) */
  if(!d.areaOn&&S)delete S.areaOn;
  if(d&&(+d.appv||0)>APPV)newerSeen=true;
  var f=fresh(), needFix=!!(d&&!d.rst2&&(d.xp||0)>0), curve2=!!(d&&!d.xpc2);
  S=Object.assign(f,d||{});
  S.stats=Object.assign(f.stats,(d&&d.stats)||{});
  if(!Array.isArray(S.quests))S.quests=f.quests;
  if(!Array.isArray(S.gates))S.gates=[];
  S.gates=S.gates.filter(function(g,i,a){return GATES.indexOf(g)>=0&&a.indexOf(g)===i}).sort(function(x,y){return x-y});
  if(typeof S.cls!=="string"||!CLASSES[S.cls])S.cls="";if(typeof S.spec!=="string"||!SPECS[S.spec]||SPECS[S.spec].cls!==S.cls)S.spec="";if(typeof S.oath!=="string")S.oath="";if(!oathOf())S.oath="";
  ["claimed","vdone","chests","badges","cdone","owned","eq","away","active","weekPaid","gymlog"].forEach(function(k){if(!S[k]||typeof S[k]!=="object")S[k]={}});
  if(!Array.isArray(S.hashes))S.hashes=[];
  if(!S.dayXp)S.dayXp={d:"",x:0};
  if(d&&d.coins==null){S.coins=Math.round((S.xp||0)/4);S.earnedC=S.coins}
  if(d&&d.lvPaid==null)S.lvPaid=Math.max(1,lvlOf(S.xp||0));
  if(!S.char||typeof S.char!=="object")S.char=defChar("");S.char=Object.assign(defChar(""),S.char);if(!S.created&&!isNewPlayer()){S.created=true;if(!S.char.name)S.char.name="Hunter"}
  if(needFix)fix1022();
  /* the new curve (xpc2): a save keeps its level and its progress through it; it never drops */
  if(curve2){var ox=S.xp||0,oL=1;while(oL<MAXL&&ox>=cumOld(oL+1))oL++;if(lvlOf(ox)<oL){var fr=(ox-cumOld(oL))/Math.max(1,cumOld(oL+1)-cumOld(oL));S.xp=Math.round(cum(oL)+fr*(cum(oL+1)-cum(oL)))}}
  S.xpc2=1;
  if(!S.wcount||typeof S.wcount!=="object")S.wcount={};if(!S.joined||typeof S.joined!=="object")S.joined={};if(!S.hired||typeof S.hired!=="object")S.hired={};if(!S.hire1){S.hire1=true;try{crewByLevel().forEach(function(k){S.joined[k]=1})}catch(e){}}
  S.quests.forEach(function(q){if(/^go to (the )?gym$/i.test(q.name)){q.name="Workout";q.xp=40;q.rep="weekly4";q.why="4 times a week, live photo proof"}});
  if(!S.quests.some(function(q){return q.rep==="weekly4"})){S.quests.push({id:"q"+(S.next++),name:"Workout",xp:40,stat:"fitness",cl:"body",why:"4 times a week, live photo proof",rep:"weekly4"})}
  if(!Array.isArray(S.sessions))S.sessions=[];if(S.wk&&(!S.wk.plan||!planOf(S.wk.plan)))S.wk=null;if(S.wk&&!Array.isArray(S.wk.list)){var bp0=buildPlan(S.wk.plan);S.wk.list=bp0.list;S.wk.roles=bp0.roles;S.wk.setsN=bp0.setsN;S.wk.min=bp0.min;S.wk.notes=bp0.notes||{};S.wk.note=bp0.note}if(S.wk){S.wk.sets=S.wk.sets||{};S.wk.w=S.wk.w||{};S.wk.hit=S.wk.hit||{}}
  if(!S.base||!Array.isArray(S.base.slots))S.base=baseFresh();if(S.base.slots[0]&&S.base.slots[0].t==="lounge"&&!S.base.v34){var ol=S.base.slots[0],bd={t:"bedroom",a:{},st:ol.st||0,pend:0};["l_desk","l_pc","l_pad","l_chair","l_lamp","l_dogbeds"].forEach(function(k){if(ol.a&&ol.a[k]){bd.a[k]=1;delete ol.a[k]}});if(ol.a&&ol.a.l_bunk)delete ol.a.l_bunk;S.base.slots.unshift(bd);var nc={};Object.keys(S.base.crew||{}).forEach(function(k){nc[k]=S.base.crew[k]+1});S.base.crew=nc;S.base.loungeT=Date.now()-3*864e5;S.base.visits=1}S.base.v34=1;if(!S.base.slots[0])S.base.slots[0]={t:"bedroom",a:{},st:0,pend:0};S.base.food=Object.assign({veg:0,grain:0,fish:0},S.base.food||{});if(!S.base.crew||typeof S.base.crew!=="object")S.base.crew={};if(typeof S.base.t!=="number")S.base.t=Date.now();S.base.served=S.base.served||0;S.base.slots.forEach(function(r){if(r&&r.t==="library_x"){var rf=3000;(ADDONS.library||[]).forEach(function(a){if(r.a&&r.a[a[0]])rf+=a[2]});S.coins+=rf;pop&&0}});if(!S.k10){S.k10=1;S.coins=Math.round((S.coins||0)*10);S.earnedC=Math.round((S.earnedC||0)*10);S.spent=Math.round((S.spent||0)*10);Object.keys(S.cdone||{}).forEach(function(k){S.cdone[k]=Math.round(S.cdone[k]*10)});Object.keys(S.away||{}).forEach(function(k){if(S.away[k]&&S.away[k].coins)S.away[k].coins*=10});S.base.slots.forEach(function(r){if(r&&r.pend)r.pend*=10});if(S.base.tipd&&S.base.tipd.n)Object.keys(S.base.tipd.n).forEach(function(k){S.base.tipd.n[k]*=10})}
S.base.slots.forEach(function(r){if(r&&(r.t==="library"||r.t==="pond")){var rf=3000;(ADDONS[r.t]||[]).forEach(function(a){if(r.a&&r.a[a[0]])rf+=a[2]});S.coins+=rf}});
if(S.coins>=1e7){S.coins=2000+300*lvlOf(S.xp||0);S.earnedC=S.coins;S.spent=0}/*retires the old test balance*/
if(!S.v001){S.v001=1;if(S.xp<cum(3))S.xp=cum(3)}
if(!S.base.t53){S.base.slots=["bedroom"].map(function(t){return {t:t,a:{},st:0,pend:0}});S.base.t53=1;S.base.loungeT=Date.now()}/*v53 TEST ROOMS*/
S.base.slots=S.base.slots.map(function(r){return r&&ROOMT[r.t]?Object.assign({a:{},st:0,pend:0},r):null});
var rsKeep=S.base.slots.filter(function(r){return r&&r.t!=="bedroom"&&ROOMCELL[r.t]});S.base.slots=S.base.slots.filter(function(r){return r&&r.t==="bedroom"}).slice(0,1);if(!S.base.slots.length)S.base.slots=[{t:"bedroom",a:{},st:0,pend:0}];S.base.slots=S.base.slots.concat(rsKeep);S.base.crew={};try{worldMigrate()}catch(e){}
  S.quests.forEach(function(q){if(!q.rep){var d=DEFAULTS.filter(function(x){return x[0]===q.name})[0];q.rep=d?d[5]:"once"}});
}
function rollover(){
  var t=today(); if(S.runDate===t)return false;
  var keep=[];S.quests.forEach(function(q){if(q.rep==="once"&&S.done[q.id]){S.cleared++}else keep.push(q)});
  S.quests=keep;S.done={};S.vdone={};S.cdone={};S.raid=null;S.combo=null;S.runDate=t;return true;
}

/* ---------- FX ---------- */
var cv=null,raf=0;
function embers(on){
  if(!on){if(cv){cancelAnimationFrame(raf);cv.remove();cv=null}return}
  if(cv)return;
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  cv=document.createElement("canvas");cv.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0";
  document.body.appendChild(cv);
  var c=cv.getContext("2d");function rs(){cv.width=innerWidth;cv.height=innerHeight}rs();addEventListener("resize",rs);
  var pts=[];for(var i=0;i<46;i++)pts.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:1+Math.random()*2,v:.2+Math.random()*.6,a:Math.random()});
  (function loop(){
    if(!cv)return;
    c.clearRect(0,0,cv.width,cv.height);
    c.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"#ff3d81";
    pts.forEach(function(p){p.y-=p.v;p.x+=Math.sin((p.y+p.a*100)/40)*.3;if(p.y<-4){p.y=cv.height+4;p.x=Math.random()*cv.width}
      c.globalAlpha=.15+.35*Math.abs(Math.sin(p.y/60+p.a*6));c.beginPath();c.arc(p.x,p.y,p.r,0,6.283);c.fill()});
    raf=requestAnimationFrame(loop);
  })();
}
function applyFx(){
  var lv=effLvl(), ri=rankIdx();
  document.documentElement.setAttribute("data-rank",RANKS[ri].l);
  document.documentElement.style.setProperty("--gk",Math.min(1,lv/30).toFixed(2));
  var cl=[];FX.forEach(function(f){if(lv>=f[0])cl.push("fx-"+f[1])});
  var fr=eqItem("frame"); if(fr)cl.push(fr[0].replace("_","-"));
  document.body.className=cl.join(" ");
  var th=eqItem("theme"), st=document.documentElement.style;
  if(th){st.setProperty("--accent",th[6].a);st.setProperty("--accent2",th[6].b);st.setProperty("--accent-ink","#120a14")}
  else{st.removeProperty("--accent");st.removeProperty("--accent2");st.removeProperty("--accent-ink")}
  var bgi=eqItem("bg"), dc=document.getElementById("deco");
  if(bgi){if(!dc){dc=document.createElement("div");dc.id="deco";dc.setAttribute("aria-hidden","true");document.body.appendChild(dc)}dc.className="bgx "+bgi[0]}
  else if(dc)dc.remove();
  embers(lv>=10);
  applyClass();
}
function ensureEl(id,on,cls){
  var e=document.getElementById(id);
  if(on){if(!e){e=document.createElement("div");e.id=id;e.className=cls||"fxo";e.setAttribute("aria-hidden","true");document.body.appendChild(e)}}
  else if(e)e.remove();
  return e;
}
function applyClass(){
  var t=S.gates.length, r=document.documentElement, k, lv=effLvl();
  if(S.cls)r.setAttribute("data-cls",S.cls);else r.removeAttribute("data-cls");
  if(S.spec)r.setAttribute("data-spec",S.spec);else r.removeAttribute("data-spec");
  r.style.setProperty("--t",t);
  for(k=1;k<=t;k++)document.body.classList.add("tier-"+k);
  var cb=ensureEl("clsbg",!!S.cls&&t>=2,"");
  if(cb){cb.className="cls-"+S.cls;cb.style.setProperty("--ci",(0.1+0.04*t).toFixed(2))}
  ensureEl("fxo-scan",lv>=24);ensureEl("fxo-vignette",lv>=28);ensureEl("fxo-edgeglow",lv>=34);
}
function burst(x,y,n){
  var L=document.getElementById("layer");
  for(var i=0;i<(n||14);i++){var s=document.createElement("i");s.className="spark "+ifSpark().cls;var a=Math.random()*6.283,d=40+Math.random()*70;
    s.style.cssText="left:"+x+"px;top:"+y+"px;--dx:"+(Math.cos(a)*d)+"px;--dy:"+(Math.sin(a)*d-30)+"px;background:"+burstColor(i);
    L.appendChild(s);(function(el,ms){setTimeout(function(){el.remove()},ms)})(s,ifSpark().ms)}
}

/* ---------- render ---------- */
function radar(){
  var vals=STATS.map(function(s){return S.stats[s[0]]||0}), mx=Math.max(10,Math.max.apply(null,vals)), cx=130,cy=118,R=78, svg='<svg class="radar" viewBox="0 0 260 236" role="img" aria-label="Stat radar">';
  function pt(i,r){var a=-Math.PI/2+i*2*Math.PI/5;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]}
  [1/3,2/3,1].forEach(function(f){svg+='<polygon points="'+STATS.map(function(_,i){return pt(i,R*f).join(",")}).join(" ")+'" fill="none" stroke="var(--line)" stroke-width="1"/>'});
  STATS.forEach(function(_,i){var p=pt(i,R);svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="var(--line)"/>'});
  svg+='<polygon points="'+vals.map(function(v,i){return pt(i,Math.max(3,R*v/mx)).join(",")}).join(" ")+'" fill="var(--accent)" fill-opacity=".28" stroke="var(--accent)" stroke-width="2"/>';
  STATS.forEach(function(s,i){var p=pt(i,R+22),anc=p[0]<cx-4?"end":(p[0]>cx+4?"middle":"middle");if(p[0]>cx+10)anc="start";if(p[0]<cx-10)anc="end";
    svg+='<text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="'+anc+'" font-size="11" fill="var(--muted)" font-family="var(--font-body)">'+s[1].split(" ")[0]+'</text>'});
  return svg+'</svg>';
}
function titleFor(k){var v=S.stats[k]||0,t=TITLES[k],r=null;[5,15,30].forEach(function(th,i){if(v>=th)r=t[i]});return r}

function boardHtml(){
  var lv=effLvl(), g=gated(), ri=rankIdx(), rk=RANKS[ri], nd=need(Math.min(lv,MAXL-1)), maxed=(lv>=MAXL&&!g), into=(maxed||g)?nd:S.xp-cum(lv);
  var all=ordered();
  var total=all.reduce(function(a,q){return a+q.xp},0);
  var gained=all.reduce(function(a,q){return a+(S.done[q.id]?doneXp(q):0)},0);
  var cur=all.filter(function(q){return !S.done[q.id]})[0];
  var h=stripHtml();

  var nextFx=FX.filter(function(f){return f[0]>lv})[0], unlocked=FX.filter(function(f){return f[0]<=lv}).length;
  h+='<section class="card hero">'+petHtml()+'<div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent2)"/></linearGradient></defs>'
   +'<circle class="t" cx="60" cy="60" r="54"/><circle class="p" cx="60" cy="60" r="54" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+(C*(1-into/nd)).toFixed(1)+'"/></svg>'
   +'<div class="c"><small>LEVEL</small><b>'+lv+'</b></div></div><div>'
   +'<div class="xp mono">'+S.xp+'<span>XP</span></div><div class="note mono" style="margin-top:6px">'+(maxed?"MAX LEVEL. Monarch XP keeps flowing.":g?"Bar full. Pass the gate to level up.":(nd-into)+" XP to level "+(lv+1))+'</div>'
   +'<div class="meta"><div><span class="label">Streak</span><b class="mono">'+streakNow()+'d</b></div><div><span class="label">Today</span><b class="mono">'+gained+'/'+total+'</b></div><div><span class="label">Integrity</span><b class="mono" style="color:'+(integrity()<.5?"var(--accent)":"var(--done)")+'">'+Math.round(integrity()*100)+'%</b></div></div>'
   +'<div class="streakline">Streak bonus <b>+'+Math.round(Math.min(streakCap(),.02*streakNow())*100)+'% XP</b>'+(function(){var n=[3,7,14,30,60,100].filter(function(d){return d>streakNow()})[0];return n?'. Chest at day <b>'+n+'</b>':''})()+'. Freezes: <b>'+(S.freezes||0)+'</b></div>'
   +'<div class="upg">'+unlocked+' UI upgrade'+(unlocked===1?"":"s")+' active'+(nextFx?'. Next upgrade at <b>level '+nextFx[0]+'</b>.':'.')+'</div>'
   +'</div></section>';

  h+=classBanner()+weekStrip();
  if(g){
    var nr=RANKS[Math.min(ri+1,5)], stored=Math.max(0,S.xp-cum(g));
    h+='<section class="card gate">'+(ART["rank_"+nr.l]?'<img class="gateem" src="'+ART["rank_"+nr.l]+'" alt="">':'')+'<span class="label">Job advancement trial</span><h2>'+esc(gateTitle())+'</h2>'
     +'<p class="note">Your XP bar is full, so you cannot reach level '+g+' until you move your body. Send a fresh photo of you being active: a workout, a run, a walk with the dogs, a hike, a game, a class.</p>'
     +'<div class="stored"><span>Stored XP, released when you pass</span><b class="mono">+'+stored+'</b></div>'
     +'<ul><li>Live camera only, and the photo must be from the last 20 minutes</li><li>Screenshots and old photos fail</li><li>Claude checks the scene'+(S.gym?'; a photo at your saved gym also passes on location alone':'; a pass at a gym saves its location')+'</li><li>The photo is not saved anywhere</li></ul>'
     +'<div class="btns"><label class="btn" for="ph1"'+(gateBusy?' aria-disabled="true"':'')+'>Open camera</label></div>'
     +'<input class="vh" type="file" id="ph1" accept="image/jpeg" capture="environment" aria-label="Take a workout photo">'
     +(gateLines.length?'<div class="proof">'+gateLines.map(function(l){return '<div class="'+l.k+'"><span>'+(l.k==="ok"?"&#10003;":l.k==="bad"?"&#10007;":"&bull;")+'</span><span>'+esc(l.t)+'</span></div>'}).join("")+'</div>':'')
     +'</section>';
  }

  h+='<section class="card capture"><span class="label">Brain dump</span><div class="cap-row"><textarea id="cap" rows="2" placeholder="Dump everything here, messy is fine. Bullets, run-on sentences, notes to self. I split it into tasks, score the XP, and sort each one." aria-label="Brain dump">'+esc(draft)+'</textarea>'
   +'<button class="btn" id="capgo"'+(busy?" disabled":"")+'>'+(busy?"Sorting":"Sort it")+'</button></div><div class="cap-status">'+status+'</div></section>';

  if(cur){
    var mv=mults(cur,{verified:true}), mh=mults(cur,{verified:false}), heavy=cur.xp>=25;
    h+='<section class="card now"><span class="label">Now</span><h2>'+esc(cur.name)+'</h2>'+(cur.why?'<p class="why">'+esc(cur.why)+'</p>':'')
     +'<div class="row">'+(heavy?'<span class="chip xp'+(mv.xp>=50?" big":"")+'">+'+mv.xp+' XP verified</span><span class="chip">+'+mh.xp+' honor</span>':'<span class="chip xp">+'+mh.xp+' XP</span>')+'<span class="chip">+1 '+esc(statName(cur.stat))+'</span><span class="chip xp"><i class="coin"></i> +'+coinsFor(heavy?mv.xp:mh.xp)+'</span>'
     +mv.tags.filter(function(t){return !/^(Honor|Verified)/.test(t)}).map(function(t){return '<span class="chip mult">'+esc(t)+'</span>'}).join("")+'</div>';
    if(ri>=4){
      if(S.raid&&S.raid.id===cur.id&&Date.now()<S.raid.end)h+='<div class="row"><span class="chip mult">Raid live</span><b class="mono" id="raidt"></b></div>';
      else h+='<button class="btn ghost" data-act="raid" data-id="'+cur.id+'">Start 25-min raid</button>';
    }
    h+='<button class="btn big" data-act="toggle" data-id="'+cur.id+'">'+(heavy?"Prove it":"Quest done")+'</button></section>';
  }else{
    h+='<section class="card allclear"><span class="label">'+(S.quests.length?'Run complete':'Empty board')+'</span><h2>'+(S.quests.length?'Every quest cleared':'No quests yet')+'</h2><p class="note" style="margin:6px 0 12px">'+(S.quests.length?'XP and stats stay. Start a fresh run tomorrow.':'Type your tasks in the brain dump above. Each one becomes a quest with XP and coins.')+'</p><button class="btn ghost" data-act="newday">New run</button></section>';
  }

  var bid=ri>=2?bountyId():null;
  CLUSTERS.forEach(function(c){
    var qs=S.quests.filter(function(q){return q.cl===c[0]&&visQ(q)}); if(!qs.length)return;
    var dn=qs.filter(function(q){return S.done[q.id]}).length;
    h+='<section class="cluster"><header'+(ART["cl_"+c[0]]?' class="hasart" style="--cl:url('+ART["cl_"+c[0]]+')"':'')+'><h3 class="label">'+c[1]+'</h3><span class="note mono">'+dn+'/'+qs.length+'</span></header><div class="cbar"><i style="width:'+(dn/qs.length*100)+'%"></i></div>';
    var doneH='';
    qs.slice().sort(function(x,y){return (S.done[x.id]?1:0)-(S.done[y.id]?1:0)}).forEach(function(q){
      var d=!!S.done[q.id]; var h0=h; if(d)h='';
      h+='<div class="q'+(d?" done":"")+(cur&&cur.id===q.id?" current":"")+(newIds[q.id]?" new":"")+'"><button class="qmain" data-act="toggle" data-id="'+q.id+'" aria-pressed="'+d+'">'
       +'<span class="box" aria-hidden="true">&#10003;</span><span><span class="name">'+esc(q.name)+'</span>'+'<span class="sub">'+(q.why?esc(q.why)+' &middot; ':'')+(q.rep==="daily"?'Daily':q.rep==="weekly4"?'This week '+weekCount()+'/4':'One-off')+(d&&S.vdone[q.id]?' &middot; <span class="vtag">verified</span>':'')+'</span></span>'
       +'<span class="tags">'+(bid===q.id&&!d?'<span class="chip mult">x2</span>':'')+'<span class="dot" style="background:var(--s-'+q.stat+')" title="'+esc(statName(q.stat))+'"></span><span class="chip xp'+(q.xp>=50?" big":"")+'">'+(d?doneXp(q):q.xp)+'</span></span></button>'
       +'<button class="x" data-act="del" data-id="'+q.id+'" aria-label="Remove '+esc(q.name)+'">&times;</button></div>';
      if(d){doneH+=h;h=h0}
    });
    if(doneH)h+='<details class="donebox"><summary class="note mono">Completed ('+dn+') &middot; tap to review or undo</summary>'+doneH+'</details>';
    h+='</section>';
  });

  /* rewards: unlocked-unclaimed, next two locked, then a mystery row */
  var ready=REWARDS.filter(function(r){return r[0]<=lv&&!S.claimed[r[0]]});
  var locked=REWARDS.filter(function(r){return r[0]>lv}), vis=locked.slice(0,2), hid=locked.length-vis.length, nClaimed=Object.keys(S.claimed).length;
  h+='<section class="card panel"><h3 class="label">Rewards</h3><div class="ladder">';
  ready.forEach(function(r){h+='<div class="rw ready'+(ART["rew_"+r[0]]?' hasimg':'')+'">'+rwImg(r)+'<span class="lv">Lv '+r[0]+'</span><span>'+esc(r[1])+'<small>'+esc(r[2])+'</small></span><button class="btn claim" data-act="claim" data-lv="'+r[0]+'">Claim</button></div>'});
  vis.forEach(function(r){h+='<div class="rw'+(ART["rew_"+r[0]]?' hasimg':'')+'">'+rwImg(r,1)+'<span class="lv">Lv '+r[0]+'</span><span>'+esc(r[1])+'<small>'+esc(r[2])+'</small></span><span class="st">LOCKED</span></div>'});
  if(hid>0)h+='<div class="rw mystery"><span class="lv">???</span><span>'+hid+' more reward'+(hid===1?"":"s")+' hidden<small>You find out when you get there.</small></span><span class="st">SEALED</span></div>';
  if(!ready.length&&!vis.length&&!hid)h+='<div class="note">Every reward claimed.</div>';
  h+='</div>'+(nClaimed?'<div class="note mono">'+nClaimed+' reward'+(nClaimed===1?"":"s")+' claimed</div>':'')+'</section>';

  var mx=Math.max(10,Math.max.apply(null,STATS.map(function(s){return S.stats[s[0]]||0})));
  h+='<section class="card panel"><h3 class="label">Stats</h3>';
  if(ri>=1){
    h+=radar()+'<div class="titles">'+STATS.map(function(s){return '<span class="chip">'+s[1].split(" ")[0]+' <span style="color:var(--fg)">'+(S.stats[s[0]]||0)+'</span></span>'}).join("")+'</div>';
  }else{
    STATS.forEach(function(s){
      var v=S.stats[s[0]]||0;
      h+='<div class="stat"><span>'+s[1]+'</span><div class="track"><div class="fill" style="width:'+(v/mx*100)+'%;background-color:var(--s-'+s[0]+');color:var(--s-'+s[0]+')"></div></div><span class="n mono">'+v+'</span></div>';
    });
  }
  if(ri>=3){
    h+='<h3 class="label" style="margin-top:4px">Titles</h3><div class="titles">'+STATS.map(function(s){var t=titleFor(s[0]);return '<span class="chip" style="'+(t?'color:var(--s-'+s[0]+');border-color:var(--s-'+s[0]+')':'')+'">'+(t?esc(t):s[1].split(" ")[0]+': next title at '+([5,15,30].filter(function(x){return x>(S.stats[s[0]]||0)})[0]||"max"))+'</span>'}).join("")+'</div>';
  }
  h+='</section>';
  var ig=integrity();
  h+='<section class="card panel"><h3 class="label">Integrity</h3><div class="integ'+(ig<.5?" low":"")+'"><div class="track"><i style="width:'+Math.round(ig*100)+'%"></i></div><span>'+Math.round(ig*100)+'% of your big-quest XP is verified. Rewards need 50%. Honor-system XP on 50+ quests pays half, and a photo or screenshot pays a 20% bonus.</span></div></section>';
  h+='<div class="foot"><span class="note">Level cap '+MAXL+'. Daily quests reset each morning; one-offs vanish once cleared. Saves automatically.</span></div>';

  return h;
}
function render(){
  if(!loaded){document.getElementById("app").innerHTML='<div class="boot mono">Loading</div>';return}
  if(!S.created||ccEdit){document.getElementById("app").innerHTML=introHtml();applyFx();return}
  var ar=AREAS.filter(function(x){return x[0]===view})[0];
  if(!ar||effLvl()<ar[2])view="board";
  var h;
  if(view==="board")h=boardHtml();
  else h=stripHtml()+viewHtml(view);
  h+=navHtml();
  var ta=document.getElementById("cap"), hadFocus=ta&&document.activeElement===ta;
  document.getElementById("app").innerHTML=h;
  newIds={};
  var nt=document.getElementById("cap");
  if(nt){ fit(nt); if(hadFocus){nt.focus();nt.setSelectionRange(nt.value.length,nt.value.length)} }
  applyFx();
  document.body.classList.toggle("shopmode",view==="shop");
  if(view==="hideout"&&typeof lfMount==="function")lfMount();
  try{dropCheck()}catch(e){}
}
function fit(t){t.style.height="auto";t.style.height=Math.min(160,t.scrollHeight+2)+"px"}

function pop(txt){
  var el=document.createElement("div");el.className="pop mono";el.textContent=txt;
  document.getElementById("layer").appendChild(el);
  setTimeout(function(){el.classList.add("out")},1200);
  setTimeout(function(){el.remove()},1700);
}
function modal(inner){
  var m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");
  m.innerHTML=inner.split('<button class="btn ghost" data-act="mclose">Close</button>').join("");var cd=m.firstElementChild;if(cd){var x=document.createElement("button");x.className="mx";x.setAttribute("data-act","mclose");x.setAttribute("aria-label","Close");x.textContent="\u2715";cd.insertBefore(x,cd.firstChild)}document.getElementById("layer").appendChild(m);return m;
}
function statBars(){
  var mx=Math.max(10,Math.max.apply(null,STATS.map(function(s){return S.stats[s[0]]||0})));
  return STATS.map(function(s){return '<div class="stat"><span>'+s[1]+'</span><div class="track"><div class="fill" style="width:'+((S.stats[s[0]]||0)/mx*100)+'%;background-color:var(--s-'+s[0]+');color:var(--s-'+s[0]+')"></div></div><span class="n mono">'+(S.stats[s[0]]||0)+'</span></div>'}).join("");
}
function levelUp(lv,extra,from){
  from=(from==null)?lv-1:from;
  ifOnLevel();
  var pay=0;for(var pl=S.lvPaid+1;pl<=lv;pl++)pay+=levelPay(pl);
  if(pay>0){S.coins+=pay;S.earnedC+=pay;S.lvPaid=lv;persist()}
  var start=Math.max(from+1,lv-3), cards="", i=0, L;
  for(L=start;L<=lv;L++){
    /* new areas are revealed one per level-up (29h_unlocks.js), so a trial that releases several levels at once shows one */
    if(L===lv){var na=areaReveal();if(na)cards+=areaCard(na,i++)}
    var u=unlocksFor(L); if(u)cards+=unlCard(u,i++);
    /* Rooms open through the story (docs/STORYBOARD.md), not by level, so level-ups no longer announce room blueprints or new
       floors (QA: they promised the Restaurant at level 8, before the Garden, in saves where it never opens). */
    FX.filter(function(f){return f[0]===L}).forEach(function(f){cards+=fxCard(f,i++)});
    var ns=SHOP.filter(function(x){return x[4]===L}).length; if(ns&&L>=3)cards+=stockCard(ns,i++);
  }
  var more=start>from+1?'<p class="note">Plus '+(start-from-1)+' earlier unlock'+(start-from-1===1?'':'s')+' waiting in The Loft.</p>':'';
  var rws=REWARDS.filter(function(r){return r[0]>from&&r[0]<=lv});
  var m=modal('<div class="card box2">'+(ART.levelup?'<div class="rhero lvhero" style="background-image:url('+ART.levelup+')"><span class="label">Level up</span><h2>Level '+lv+'</h2></div>':'<span class="label">Level up</span><h2>Level '+lv+'</h2>')
   +(extra?'<p class="note">'+extra+'</p>':'')
   +cards+more
   +(pay?'<div class="reward reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s">Level bonus: +'+pay+' coins</div>':'')+rws.map(function(r){return '<div class="reward reveal'+(ART["rew_"+r[0]]?' rwun':'')+'" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s">'+(ART["rew_"+r[0]]?'<img src="'+ART["rew_"+r[0]]+'" alt="">':'')+'<span>Reward unlocked: '+esc(r[1])+'</span></div>'}).join("")
   +'<div style="display:flex;flex-direction:column;gap:10px">'+statBars()+'</div>'
   +'<p class="note">Level '+(lv+1)+': ???</p><button class="btn big" id="lvok">Keep going</button></div>');
  var b=m.querySelector("#lvok");b.focus({preventScroll:true});b.onclick=function(){m.remove()};
  burst(innerWidth/2,innerHeight/3,26);
}
function gateOpened(g){
  var nr=RANKS[Math.min(rankIdx()+1,5)];
  var m=modal('<div class="card box2"><span class="label">Gate opened</span><h2>Job advancement trial</h2><p>Your bar is full at level '+(g-1)+'. Extra XP is stored. Send a fresh photo of you being active in the trial card to start your '+gateTitle().toLowerCase()+'.</p><button class="btn big" id="gok">Show me the trial</button></div>');
  var b=m.querySelector("#gok");b.focus();b.onclick=function(){m.remove();window.scrollTo({top:0,behavior:"smooth"})};
}

function addBadge(id){if(S.badges[id])return;S.badges[id]=true;S.coins+=250;S.earnedC+=250;var b=BADGES.filter(function(x){return x[0]===id})[0];if(b)setTimeout(function(){pop("Milestone reached: "+b[1]+"  +250 coins")},2400)}
function checkBadges(){
  if(S.total>=1)addBadge("first");if(S.total>=10)addBadge("ten");if(S.total>=100)addBadge("hundred");
  if(S.streak>=3)addBadge("s3");if(S.streak>=7)addBadge("s7");if(S.streak>=30)addBadge("s30");
  if(S.crits>=1)addBadge("crit");if(S.vcount>=10)addBadge("ver10");if(S.gates.length>=1)addBadge("gate");
  if(new Date().getHours()<7)addBadge("early");
  if(S.spent>0)addBadge("spend");if(Object.keys(S.owned).filter(function(k){var it=shopItem(k);return it&&!(it[6]&&qsOriginal(it))}).length>=5)addBadge("decor");if(S.earnedC>=5000)addBadge("coins500");
  if(S.cls)addBadge("class");if(S.spec)addBadge("spec");if(S.gates.length>=9)addBadge("asc");
  var el2=effLvl();if(el2>=10)addBadge("l10");if(el2>=25)addBadge("l25");if(S.streak>=14)addBadge("s14");
}
function creditStreak(){
  var t=today(); if(S.lastDone===t)return null;
  var g=S.lastDone?dayDiff(S.lastDone,t):99, out=[];
  S.skUndo={d:t,streak:S.streak,lastDone:S.lastDone,freezes:S.freezes,best:S.best||0,chest:0};
  if(g===1)S.streak++;
  else if(g===2&&S.freezes>0){S.freezes--;S.streak++;out.push("A streak freeze saved your streak")}
  else S.streak=1;
  S.lastDone=t;if(S.streak>(S.best||0))S.best=S.streak;
  if(CHESTS[S.streak]&&!S.chests[S.streak]){S.skUndo.chest=S.streak;S.chests[S.streak]=true;S.xp+=CHESTS[S.streak];var cc=Math.round(CHESTS[S.streak]*5);S.coins+=cc;S.earnedC+=cc;out.push("Streak chest: +"+CHESTS[S.streak]+" XP and "+cc+" coins")}
  if(S.streak%7===0&&S.freezes<maxFreeze()){S.freezes++;out.push("Earned a streak freeze")}
  return out.join(" | ")||("Streak: day "+S.streak);
}
function uncreditStreak(){
  var u=S.skUndo; if(!u||u.d!==today()||S.lastDone!==today())return;
  if(u.chest){var cx=CHESTS[u.chest],cc=Math.round(cx*5);delete S.chests[u.chest];S.xp=Math.max(0,S.xp-cx);S.coins-=cc;S.earnedC=Math.max(0,S.earnedC-cc)}
  S.streak=u.streak;S.lastDone=u.lastDone;S.freezes=u.freezes;S.best=u.best;S.skUndo=null;
}
function onTap(id,ev){
  var q=S.quests.filter(function(x){return x.id===id})[0]; if(!q)return;
  if(!S.done[id]&&q.xp>=25)askProof(id); else toggle(id,ev);
}
function toggle(id,ev,mode){
  var q=S.quests.filter(function(x){return x.id===id})[0]; if(!q)return;
  if(q.rep==="weekly4"&&!S.done[id]&&mode!=="v"){askProof(id);return}
  var actFlag=false;
  var before=effLvl(), wasGate=gated(), note=null, crit=false;
  if(S.done[id]){
    var back=doneXp(q), vb=S.vdone[id]||0; delete S.done[id]; delete S.vdone[id]; if(q.rep==="weekly4"&&vb>0)unmarkActive();
    S.xp=Math.max(0,S.xp-back); S.vxp=Math.max(0,S.vxp-vb); if(q.xp>=25)S.bigxp=Math.max(0,S.bigxp-back);
    S.total=Math.max(0,S.total-1); if(vb>0)S.vcount=Math.max(0,S.vcount-1);
    var cb=S.cdone[id]||0;S.coins-=cb;S.earnedC=Math.max(0,S.earnedC-cb);delete S.cdone[id];
    S.stats[q.stat]=Math.max(0,(S.stats[q.stat]||0)-1);
    if(S.dayXp.d===today()){S.dayXp.x=Math.max(0,S.dayXp.x-back);if(S.dayXp.x<50)uncreditStreak()}
    if(S.combo){if(S.combo.n>1)S.combo.n--;else S.combo=null}
  }else{
    var ver=(mode==="v"), mu=mults(q,{commit:true,verified:ver}); if(ver&&q.rep==="weekly4")actFlag=true;
    S.done[id]=mu.xp; S.vdone[id]=ver?mu.xp:0; S.xp+=mu.xp; if(ver)S.vxp+=mu.xp; if(q.xp>=25)S.bigxp+=mu.xp;
    S.total++; if(ver)S.vcount++; crit=mu.tags.indexOf("CRITICAL HIT")>=0; if(crit)S.crits++;
    S.stats[q.stat]=(S.stats[q.stat]||0)+1;
    var cn=coinsFor(mu.xp)+(crit?50:0); if(S.cls==="swiftblade"&&q.stat==="productivity")cn=Math.round(cn*1.25); cn=Math.round(cn*(1+specialPct("coin")/100));S.cdone[id]=cn;S.coins+=cn;S.earnedC+=cn;
    if(S.raid&&S.raid.id===id)S.raid=null;
    var t=today(); if(S.dayXp.d!==t)S.dayXp={d:t,x:0}; S.dayXp.x+=mu.xp;
    if(S.dayXp.x>=50)note=creditStreak();
    pop("+"+mu.xp+" XP  +"+cn+" coins"+(mu.tags.length?"  "+mu.tags.join(", "):""));
    if(note&&/Streak chest/.test(note)&&ART.chest)setTimeout(function(){chestModal(note)},1800);else if(note)setTimeout(function(){pop(note)},1800);
    if(ev&&ev.clientX!=null&&effLvl()>=3)burst(ev.clientX,ev.clientY);
    if(crit)burst(innerWidth/2,innerHeight/2,30);
    ifOnDone(crit);
    checkBadges();
  }
  render(); persist();
  var after=effLvl();
  if(after>before)levelUp(after,null,before);
  else if(!wasGate&&gated())gateOpened(gated());
  if(actFlag)markActive();
}
function remove(id){
  var q=S.quests.filter(function(x){return x.id===id})[0]; if(!q)return;
  if(S.done[id])toggle(id);
  S.quests=S.quests.filter(function(x){return x.id!==id}); render(); persist();
}

/* ---------- quest proof ---------- */
var proofId=null, proofBusy=false, proofModal=null;
function closeProof(){if(proofModal){proofModal.remove();proofModal=null}proofId=null;proofBusy=false}
function isDigital(q){return /^(create|admin|boss)$/.test(q.cl)}
function askProof(id){
  var q=S.quests.filter(function(x){return x.id===id})[0]; if(!q)return;
  proofId=id;
  var mv=mults(q,{verified:true}), mh=mults(q,{verified:false});
  proofModal=modal('<div class="card box2"><span class="label">Prove it</span><h2 style="font-size:26px">'+esc(q.name)+'</h2>'
   +'<p class="note">'+(isDigital(q)?"Take a live photo of your screen showing the finished work.":"Take a live photo of the finished result.")+' Camera only: screenshots and saved photos are turned off, and each photo counts once.</p>'
   +'<div class="row"><span class="chip xp">Verified +'+mv.xp+' XP</span><span class="chip">Honor +'+mh.xp+' XP</span></div>'
   +'<div class="btns"><label class="btn" for="pf1">Open camera</label></div>'
   +'<input class="vh" type="file" id="pf1" accept="image/jpeg" capture="environment" aria-label="Take a proof photo">'
   +'<div class="proof" id="proofmsg"></div>'+(q.rep==="weekly4"?'<p class="note">Workouts only count with a live photo. No honor system.</p>':'<button class="btn ghost" data-act="honor">Use the honor system</button>')+'<button class="btn ghost" data-act="closeproof">Cancel</button></div>');
}
function pl(k,t){var el=document.getElementById("proofmsg");if(!el)return;var d=document.createElement("div");d.className=k;d.innerHTML='<span>'+(k==="ok"?"&#10003;":k==="bad"?"&#10007;":"&bull;")+'</span><span>'+esc(t)+'</span>';el.appendChild(d)}
function clockMins(c){var m=String(c||"").match(/(\d{1,2}):(\d{2})/);return m?(+m[1])*60+(+m[2]):null}
async function handleProof(file){
  if(!file||proofBusy||!proofId)return;
  var q=S.quests.filter(function(x){return x.id===proofId})[0]; if(!q)return;
  proofBusy=true; var box=document.getElementById("proofmsg"); if(box)box.innerHTML="";
  /* the camera gives a JPEG; a screenshot or a saved PNG/WebP is refused before anything else */
  if(file.type&&!/jpe?g/i.test(file.type)){pl("bad","That is a screenshot or a saved image. Use the camera.");proofBusy=false;return}
  pl("info","Reading the image...");
  var ok=true, ex={}, hh=null, buf=null, now=new Date(), nowM=now.getHours()*60+now.getMinutes();
  try{buf=await file.slice(0,262144).arrayBuffer()}catch(e){}
  if(buf){hh=hashFile(buf);if(S.hashes.indexOf(hh)>=0){pl("bad","This exact image was already used. Take a new one.");proofBusy=false;return}ex=readExif(buf)}
  var exifOk=null;
  if(ex&&ex.dt){
    var m=ex.dt.match(/^(\d{4}):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/);
    if(m){var mins=(Date.now()-new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6]).getTime())/60000;
      if(mins<-3||mins>30){exifOk=false;pl("bad","The photo is "+Math.round(Math.abs(mins))+" minutes "+(mins<0?"in the future":"old")+". It has to be from the last 30.");ok=false}
      else{exifOk=true;pl("ok","Taken "+(mins<1?"just now":Math.round(mins)+" min ago"))}}
  }
  var vis=null;
  if(ok){
    pl("info","Claude is reviewing it...");
    try{
      var sample=window.claude?await window.claude.use("sample"):null;
      var lim=sample?await sample.limits().catch(function(){return null}):null;
      if(sample&&lim&&lim.images){
        var hhmm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
        vis=await sample.json('A person claims they just completed this task for a habit game: "'+q.name+'". The current local time is '+hhmm+'. Look at the image. Return ONLY JSON: {"matches":true,"what":"","clock":null,"screen":false,"note":""} where matches = the image plausibly shows this task completed or clearly in progress (be fair but skeptical), what = what you see in under 14 words, clock = HH:MM in 24-hour time if any clock or time is visible (phone status bar, computer menu bar or taskbar) else null, screen = true if it is a screenshot or a photo of a screen, note = short reason under 12 words.',{images:file,modelTier:"quick",cache:false});
      }
    }catch(e){vis=null}
    if(!vis){pl("bad","Verification needs Claude access on this page. Allow it and retry, or use the honor system.");ok=false}
    else{
      if(!vis.matches){pl("bad","Doesn't look like this task. "+(vis.note||""));ok=false}
      else pl("ok","Looks right: "+(vis.what||q.name));
      if(vis.screen&&!isDigital(q)){pl("bad","That looks like a screen. This quest needs a real photo.");ok=false}
    }
  }
  proofBusy=false;
  if(!ok)return;
  if(hh){S.hashes.push(hh);S.hashes=S.hashes.slice(-300)}
  var id=proofId; closeProof(); toggle(id,null,"v");
}

/* ---------- gate trial: photo proof ---------- */
function readExif(buf){
  try{
    var v=new DataView(buf); if(v.byteLength<4||v.getUint16(0)!==0xFFD8)return {bad:true};
    var o=2;
    while(o+10<v.byteLength){
      var m=v.getUint16(o); if(m===0xFFDA)break;
      var len=v.getUint16(o+2);
      if(m===0xFFE1&&v.getUint32(o+4)===0x45786966)return parseTiff(v,o+10);
      o+=2+len;
    }
    return {};
  }catch(e){return {}}
}
function parseTiff(v,s){
  var le=v.getUint16(s)===0x4949;
  function u16(p){return v.getUint16(p,le)} function u32(p){return v.getUint32(p,le)}
  function ifd(p){var n=u16(p),t={};for(var i=0;i<n;i++){var e=p+2+i*12;t[u16(e)]={cnt:u32(e+4),p:e+8}}return t}
  function ascii(en){var p=en.cnt>4?s+u32(en.p):en.p,r="";for(var i=0;i<en.cnt-1;i++)r+=String.fromCharCode(v.getUint8(p+i));return r}
  function rats(en){var p=s+u32(en.p),r=[];for(var i=0;i<en.cnt;i++){var d=u32(p+i*8+4);r.push(d?u32(p+i*8)/d:0)}return r}
  var out={}, i0=ifd(s+u32(s+4));
  if(i0[0x8769]){var ex=ifd(s+u32(i0[0x8769].p));var d=ex[0x9003]||ex[0x9004];if(d)out.dt=ascii(d)}
  if(i0[0x8825]){var g=ifd(s+u32(i0[0x8825].p));
    if(g[1]&&g[2]&&g[3]&&g[4]){var la=rats(g[2]),lo=rats(g[4]);
      out.lat=(la[0]+la[1]/60+la[2]/3600)*(ascii(g[1])==="S"?-1:1);out.lon=(lo[0]+lo[1]/60+lo[2]/3600)*(ascii(g[3])==="W"?-1:1)}}
  return out;
}
function feetBetween(a,b,c,d){
  var R=20902231,r=Math.PI/180,dl=(c-a)*r,dn=(d-b)*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dn/2)*Math.sin(dn/2);
  return 2*R*Math.asin(Math.sqrt(x));
}
var VISION="This photo was just submitted as proof that the player is being physically active right now, for a habit game. Any activity counts, not only the gym. Decide: active_setting (true if it shows physical activity or a place where it is happening: a gym or studio, a run, walk or hike outdoors, walking a dog, cycling, swimming, a sport, a dance or yoga class, stretching or a home workout, or someone visibly sweaty or in workout clothes outside; false for sitting at a desk, on a couch, in a car, in bed, or a photo of food or a screen), setting (2 to 4 words), screen (true if it is a screenshot or a photo of a screen), note (under 12 words). Return ONLY JSON: {\"active_setting\":true,\"setting\":\"\",\"screen\":false,\"note\":\"\"}";
function gl(k,t){gateLines.push({k:k,t:t});render()}
async function handlePhoto(file){
  if(!file||gateBusy||gated()===null)return;
  gateBusy=true;gateLines=[];gl("info","Reading the photo...");
  var ok=true, ex={}, near=null;
  var hh=null;
  try{
    var gbuf=await file.slice(0,262144).arrayBuffer();
    hh=hashFile(gbuf); ex=readExif(gbuf);
  }catch(e){ex={}}
  if(hh&&S.hashes.indexOf(hh)>=0){gl("bad","This exact photo was already used. Take a new one.");gateBusy=false;render();return}
  if(ex.bad){gl("bad","Unsupported photo type. Use a regular camera photo (JPEG).");ok=false}
  else{
    var dt=null;
    if(ex.dt){var m=ex.dt.match(/^(\d{4}):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/);if(m)dt=new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6])}
    if(!dt){gl("bad","No camera timestamp found. Screenshots and edited photos cannot pass. Take a new photo.");ok=false}
    else{
      var mins=(Date.now()-dt.getTime())/60000;
      if(mins<-3){gl("bad","The photo's timestamp is in the future. Check your phone clock.");ok=false}
      else if(mins>20){gl("bad","This photo is "+Math.round(mins)+" minutes old. It has to be from the last 20.");ok=false}
      else gl("ok","Taken "+(mins<1?"just now":Math.round(mins)+" min ago"));
    }
    if(ex.lat!=null){
      if(S.gym){var ft=feetBetween(S.gym.lat,S.gym.lon,ex.lat,ex.lon);near=ft<=1000;
        gl(near?"ok":"info",near?"Location matches your gym ("+Math.round(ft)+" ft away)":"Not at your saved gym ("+(ft>5280?(ft/5280).toFixed(1)+" mi":Math.round(ft)+" ft")+" away)")}
      else gl("info","Location found. It saves as your gym if the scene checks out.");
    }else gl("info","No location in this photo");
  }
  var vis=null,visUnavail=false;
  if(ok){
    gl("info","Checking the photo");
    try{
      var sample=window.claude?await window.claude.use("sample"):null;
      var lim=sample?await sample.limits().catch(function(){return null}):null;
      if(sample&&lim&&lim.images){vis=await sample.json(VISION,{images:file,modelTier:"quick",cache:false})}
      else visUnavail=true;
    }catch(e){visUnavail=true}
    if(vis){
      if(vis.screen){gl("bad","That looks like a screenshot or a screen. Take a real photo.");ok=false}
      else if(!vis.active_setting){gl("bad","Doesn't look like you're being active"+(vis.setting?" ("+vis.setting+")":"")+". "+(vis.note||""));ok=false}
      else gl("ok","Scene: "+(vis.setting||"workout space")+(vis.note?". "+vis.note:""));
    }else if(visUnavail){
      if(near===true)gl("info","Scene check unavailable, but your location matches your gym.");
      else{gl("bad","Scene check is unavailable and the location doesn't confirm your gym. Allow Claude for this page and try again.");ok=false}
    }
  }
  gateBusy=false;
  if(!ok){render();return}
  var savedGym=false;
  if(hh){S.hashes.push(hh);S.hashes=S.hashes.slice(-300)}
  if(ex.lat!=null&&!S.gym&&(!vis||/gym|fitness|weight|workout|training/i.test(vis.setting||""))){S.gym={lat:ex.lat,lon:ex.lon};savedGym=true}
  clearGate(savedGym);
}
function clearGate(savedGym){
  var g=gated(); if(g===null)return;
  var beforeLv=effLvl(), prevRi=rankIdx();
  S.gates.push(g); gateLines=[]; checkBadges();
  var afterLv=effLvl(), t=S.gates.length;
  render(); persist();
  var fl=document.createElement("div");fl.className="flash";document.getElementById("layer").appendChild(fl);setTimeout(function(){fl.remove()},800);
  burst(innerWidth/2,innerHeight/2,40);
  var next=function(){advModal(t,beforeLv,afterLv,savedGym,prevRi)};
  if(t===1)pickClass(next); else if(t===3)pickSpec(next); else if(t===8)pickOath(next); else next();
}

/* ---------- brain dump: parse, score, sort ---------- */
function fallbackSplit(txt){
  var parts=[];txt.split(/\n|;|\s+and then\s+|,\s*then\s+|\s+also\s+/i).forEach(function(x){var c=x.split(/,\s*/);if(c.length>1&&c.every(function(p){return p.trim().split(/\s+/).length>=2}))parts=parts.concat(c);else parts.push(x)});
  return parts.map(function(x){return x.replace(/^\s*(?:[-*•]|\d+[.)])\s*/,"").trim()}).filter(function(x){return x.length>1}).slice(0,40);
}
function clampXp(n){n=Math.round((+n||25)/5)*5;return Math.max(5,Math.min(100,n))}
function guess(t){
  var s=t.toLowerCase(), r={xp:25,stat:"productivity",cl:"admin"};
  if(/gym|workout|lift|run\b|jog|walk|stretch|swim|yoga/.test(s)){r.stat="fitness";r.cl=/walk/.test(s)?"out":"body";r.xp=25}
  else if(/edit|film|shoot|record|produce|mix|master|song|track|beat|studio|mashup|video|reel|cover art|epk|design/.test(s)){r.stat="creativity";r.cl="create";r.xp=/edit|film|shoot|produce|finish|mix|master/.test(s)?50:25}
  else if(/bed|teeth|shower|floss|skincare|meds|vitamin|water/.test(s)){r.stat="discipline";r.cl="reset";r.xp=10}
  else if(/dish|laundry|clean|vacuum|trash|sweep|tidy|organi[sz]e|assemble|put together|groom/.test(s)){r.stat="productivity";r.cl="home";r.xp=/clean|laundry|assemble|put together/.test(s)?25:10}
  else if(/call|text|dinner|friend|date|party|hang|visit|birthday/.test(s)){r.stat="social";r.cl="social";r.xp=25}
  else if(/unload|groceries|errand|mail|gas|feed|pick up/.test(s)){r.stat="productivity";r.cl="out";r.xp=10}
  if(/finish|build|platform|app|launch|submit|ship|migrate|tax|taxes/.test(s)&&r.xp<50)r.xp=50;
  if(t.length<22&&r.xp>10&&/^(post|send|reply|pay|book|buy|check)\b/.test(s))r.xp=10;
  return {name:t,xp:r.xp,stat:r.stat,cl:r.cl,why:"Quick offline estimate",rep:/daily|every day|feed|walk|teeth|shower|bed\b|gym|dishes/.test(s)?"daily":"once"};
}
function validate(o,src){
  o=o||{};
  var st=STATS.some(function(s){return s[0]===o.stat})?o.stat:"productivity";
  var cl=CLUSTERS.some(function(c){return c[0]===o.cluster||c[0]===o.cl})?(o.cluster||o.cl):"admin";
  return {name:String(o.name||src).slice(0,90),xp:clampXp(o.xp),stat:st,cl:cl,why:String(o.why||"").slice(0,80),rep:o.repeat==="daily"?"daily":"once"};
}
var PARSE="The user pasted a messy brain dump for a gamified to-do app (bullets, run-on sentences, commas, 'and then', notes to self). Extract every distinct actionable task and ignore anything that is not a task. Split compound sentences into separate tasks. Merge duplicates. For each task return an object with: name (tidy short rewrite, keep the meaning), xp (integer, multiple of 5), stat, cluster, repeat, why (under 9 words, say what drove the XP).\n"
 +"repeat is 'daily' for routines that recur every day (feeding pets, hygiene, making the bed, gym) and 'once' for one-off tasks.\n"
 +"XP scale: 5 = trivial, under 5 minutes. 10 = under 15 minutes. 25 = 15 to 60 minutes. 50 = 1 to 3 hours of focused or physically demanding work. 75 = multi-hour, open-ended, or something the person is likely avoiding. 100 = whole-day effort or a major milestone. Reward effort and difficulty, not importance. Open-ended building or 'finish X' tasks score at least 50.\n"
 +"stat must be one of: creativity (music, video, design, content making), discipline (habits, hygiene, routines, things avoided), fitness (exercise, walking), productivity (chores, admin, work, building, logistics), social (time with people, relationships, rest and fun).\n"
 +"cluster must be one of: out (errands and things done outside the house, dogs, car), reset (morning and night routines, hygiene), home (cleaning, laundry, household), body (gym, workouts), admin (day job, accounts, paperwork, messages, building software), create (music, filming, editing, posting content), social (people and plans), boss (a single dreaded or very large task).\n"
 +"Return ONLY a JSON array of at most 40 objects, in the order the tasks appear.\nBrain dump:\n";
async function scoreAll(text){
  var sample=null;
  try{ sample=window.claude?await window.claude.use("sample"):null }catch(e){}
  if(sample){
    try{
      var out=await sample.json(PARSE+text.slice(0,4000),{modelTier:"quick",cache:false});
      if(Array.isArray(out)&&out.length)return out.slice(0,40).map(function(o){return validate(o,"Task")});
    }catch(e){}
  }
  return fallbackSplit(text).map(guess);
}
async function submitCap(){
  if(busy)return;
  var ta=document.getElementById("cap"); draft=ta?ta.value:draft;
  var text=draft.trim(); if(!text)return;
  busy=true; status="Reading your brain dump..."; render();
  var res=await scoreAll(text);
  var est=res.some(function(r){return r.why==="Quick offline estimate"}), sum=0, by={};
  res.forEach(function(r){var id="q"+(S.next++); S.quests.push({id:id,name:r.name,xp:r.xp,stat:r.stat,cl:r.cl,why:r.why,rep:r.rep}); newIds[id]=1; sum+=r.xp; by[r.cl]=(by[r.cl]||0)+1});
  var parts=CLUSTERS.filter(function(c){return by[c[0]]}).map(function(c){return by[c[0]]+" "+c[1]});
  draft=""; busy=false;
  status="Sorted <b>"+res.length+"</b> task"+(res.length===1?"":"s")+" worth <b>"+sum+" XP</b>: "+esc(parts.join(", "))+(est?". AI scoring was unavailable, so these are rough estimates.":".");
  render(); persist();
}

document.addEventListener("click",function(e){
  if(e.target.id==="capgo"){submitCap();return}
  var b=e.target.closest("[data-act]"); if(!b)return;
  var a=b.dataset.act;
  if(baseAct(a,b,e))return;
  if(/^wk/.test(a)&&trainAct(a,b))return;
  if(a==="toggle")onTap(b.dataset.id,e);
  if(a==="del")remove(b.dataset.id);
  if(a==="nav"){var ar2=AREAS.filter(function(x){return x[0]===b.dataset.v})[0];if(ar2&&areaWaiting(ar2[0])){pop(ar2[1]+" opens at your next level-up");return}if(ar2&&areaGate(ar2[0])){pop(ar2[0]==="shop"?"Build the Walk-in Closet in your Bedroom to open the Shop":"Find the Hero's Lair to open Dungeons");return}if(ar2&&effLvl()<ar2[2]){pop((ar2[2]===nxLvl()?ar2[1]+" unlocks":"Unlocks")+" at level "+ar2[2]);return}view=b.dataset.v;render();window.scrollTo(0,0);if(view==="hideout")roomSplash("loft");setTimeout(brandCheck,600)}
  /* the street and its three buildings (26_world.js); a drag that ends on a building is not a tap */
  if(a==="bldgo"){var pd=window.__lfpd;if(pd&&Math.hypot(LFV.x-pd[0],LFV.y-pd[1])>6)return;LFBSEL=+b.dataset.v;LFV.init=0;render();return}
  if(a==="bldout"){LFBSEL=null;LFV.init=0;render();return}
  if(a==="gotoroom"){var gi=-1;S.base.slots.forEach(function(r,k){if(r&&r.t===b.dataset.t)gi=k});if(gi>=0)roomModal(gi);return}
  if(a==="rhelp"){roomSplash(b.dataset.t,1);return}
  if(a==="thdoorlock"){pop("Open the Auditorium to see what is behind these doors");return}
  if(a==="bsgo"){var bm=b.closest(".modal");if(bm)bm.remove();view="shop";shopTab=b.dataset.b;render();window.scrollTo(0,0);return}
  if(a==="simcoin"){S.coins+=10000;render();persist();pop("Test coins added");return}
  if(a==="simundo"){var ui=+b.dataset.i,ur=bslot(ui),back=0,n=0;if(!ur)return;(ADDONS[ur.t]||[]).forEach(function(u){if(ur.a[u[0]]&&!(u[3]&&u[3].opens)){delete ur.a[u[0]];back+=u[2]||0;n++}});S.coins+=back;persist();render();roomModal(ui);pop("Undid "+n+" upgrades, refunded "+back+" coins");return}
  if(a==="simlvl"){var sl0=effLvl();var g0=gated();if(g0!==null)S.gates.push(g0);S.xp=Math.max(S.xp,cum(sl0+1));/* testing (Cal): also pass the trial this level-up reaches, no gym photo */var g1,gn=0;while((g1=gated())!==null&&gn++<9)S.gates.push(g1);render();persist();levelUp(effLvl(),null,sl0);return}
  if(a==="buy")buy(b.dataset.id,e);
  if(/^cc/.test(a)){ccAct(a,b,e);return}
  if(a==="iftry"){ifTry(b.dataset.id,b);return}
  if(a==="qsdeny"){var cd=b.closest(".qs-card");if(cd){cd.classList.remove("deny");void cd.offsetWidth;cd.classList.add("deny")}return}
  if(a==="char"){charModal();return}
  if(a==="mclose"){var m2=b.closest(".modal");if(m2)m2.remove();return}
  if(a==="wardrobe"){var m3=b.closest(".modal");if(m3)m3.remove();if(areaGate("shop")){pop("Build the Walk-in Closet in your Bedroom to open the Shop");return}view="shop";shopTab="wardrobe";render();window.scrollTo(0,0);return}
  if(a==="stab"){shopTab=b.dataset.v;render();return}
  if(a==="story")storyModal();
  if(a==="spin")spin();
  if(a==="dgo")dngStart(b.dataset.id);
  if(a==="dclaim")dngClaim(+b.dataset.k,e);
  if(a==="asend")asend(b.dataset.id,+b.dataset.h);
  if(a==="aclaim")aclaim(b.dataset.id,e);
  if(a==="equip")equip(b.dataset.id);
  if(a==="unequip")unequip(b.dataset.id);
  if(a==="raid"){S.raid={id:b.dataset.id,end:Date.now()+25*60000};render();persist()}
  if(a==="claim"){
    if(integrity()<.5){pop("Integrity "+Math.round(integrity()*100)+"%. Verify more big quests to claim (need 50%).");return}
    S.claimed[b.dataset.lv]=true;render();persist();burst(e.clientX,e.clientY,26);pop("Reward claimed. Enjoy it.");
  }
  if(a==="honor"){var id=proofId;closeProof();if(id)toggle(id,e,"h")}
  if(a==="closeproof")closeProof();
});
document.addEventListener("change",function(e){
  var t=e.target; if(!t||!t.id)return;
  if(t.id==="ph1"){var f=t.files&&t.files[0];t.value="";handlePhoto(f)}
  if(t.id==="pf1"){var f2=t.files&&t.files[0];t.value="";handleProof(f2)}
});
document.addEventListener("input",function(e){if(e.target.classList&&e.target.classList.contains("kg")&&S.wk){var v=parseFloat(e.target.value);S.wk.w[e.target.dataset.ex]=isNaN(v)?"":v;persist()}if(e.target.id==="cap"){draft=e.target.value;fit(e.target)}if(e.target.id==="ccname"&&cc){cc.name=e.target.value;var hh=document.querySelector(".ccinfo h2");if(hh)hh.textContent=cc.name||"Hunter"}});
document.addEventListener("keydown",function(e){
  if(e.target.id==="cap"&&e.key==="Enter"&&!e.shiftKey){e.preventDefault();submitCap()}
  if(e.target.id==="ccname"&&e.key==="Enter"&&ccStage==="name"&&!ccEdit){e.preventDefault();var bn=document.querySelector('[data-act="ccnext"]');if(bn)bn.click()}
});
setInterval(function(){
  var el=document.getElementById("raidt"); if(!el)return;
  if(!S.raid||Date.now()>=S.raid.end){S.raid=null;render();persist();return}
  var r=Math.ceil((S.raid.end-Date.now())/1000);el.textContent=Math.floor(r/60)+":"+String(r%60).padStart(2,"0");
},1000);
var lastBub="";setInterval(function(){if(view!=="hideout"||document.hidden||!loaded||document.querySelector("#layer .modal"))return;simulate();var k=S.base.slots.map(function(r){return r?Math.floor(r.pend||0):0}).join(",");if(k!==lastBub){lastBub=k;render();persist()}},20000);
setInterval(function(){if(view==="away"&&!document.hidden&&!spinning)render()},30000);
document.addEventListener("visibilitychange",function(){if(!document.hidden)checkInbox();if(!document.hidden&&rollover()){render();persist()}});

buildSkinCss();
/* Which save to play when the database and this device disagree. Online saves stopped working for a while, so both can
   hold progress the other lacks. Saves with a savedAt are compared by it. Older ones cannot be, and more progress is not
   proof of the right one (testing can inflate it), so the player picks once and the other is kept in backup_choice. */
function saveOnDevice(uid){try{var r=localStorage.getItem("quest-board"),d=r?JSON.parse(r):null;
  if(!d||d.epoch!==QB_EPOCH||!(d.created||d.total||d.xp))return null;if(d.uid&&d.uid!==uid)return null;return d}catch(e){return null}}
function saveSame(a,b){return ["xp","total","earnedC","spent","coins"].every(function(k){return (+a[k]||0)===(+b[k]||0)})}
function saveWhich(cloud,local){
  if(!local)return {use:"cloud"};if(!cloud)return {use:"local"};if(saveSame(cloud,local))return {use:"cloud"};
  if(cloud.savedAt&&local.savedAt)return {use:+local.savedAt>+cloud.savedAt?"local":"cloud"};
  return new Promise(function(done){
    var line=function(d){var rooms=((d.base&&d.base.slots)||[]).filter(Boolean).length,when=d.savedAt?new Date(+d.savedAt):d.lastDone?new Date(d.lastDone+"T12:00:00"):null;
      return '<b>Level '+lvlOf(+d.xp||0)+'</b><span>'+(+d.total||0)+' quests done</span><span>'+Math.floor(+d.coins||0).toLocaleString()+' coins</span><span>'+rooms+' room'+(rooms===1?'':'s')+'</span>'
        +(when&&!isNaN(when)?'<span>Last played '+when.toLocaleDateString(undefined,{month:"short",day:"numeric"})+'</span>':'')};
    var m=document.createElement("div");m.className="modal qbsv";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");
    m.innerHTML='<div class="card box2"><h3>Two saves found</h3><p class="note">This device and your online save don\'t match. Pick the one to keep playing. The other is kept as a backup.</p>'
      +'<div class="qbsv-r"><button class="qbsv-c" data-pick="local"><small>This device</small>'+line(local)+'</button><button class="qbsv-c" data-pick="cloud"><small>Online save</small>'+line(cloud)+'</button></div></div>';
    m.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-pick]");if(!b)return;var use=b.getAttribute("data-pick");m.remove();done({use:use,asked:true,keep:use==="local"?cloud:local})});
    document.body.appendChild(m)})}
document.addEventListener("pointerdown",function(){try{window.__lfpd=[LFV.x,LFV.y]}catch(e){}},true);
render();try{chLoad()}catch(e){}
(async function(){
  var migrated=false;
  try{
    db=window.claude?await window.claude.use("db"):null;
    var usr=null; try{usr=window.claude?await window.claude.use("user"):null}catch(e){}
    var uid=null, own=true; if(usr){try{uid=await usr.id();own=await usr.isOwner()}catch(e){}}
    MYUID=uid||null;if(usr&&!own){window.__qbGuest=1;document.body.classList.add("qb-guest");var qt=document.getElementById("qbt");if(qt)qt.remove()}
    /* every save, the owner's too, lives in a private per-person path */
    if(db&&uid){
      DOC="data/users/"+uid+"/state";
      var snap=await db.doc(DOC).get(),sd0=snap.exists?snap.data():null,ld0=saveOnDevice(uid);
      /* a copy of the save from the last version, before this version writes anything */
      if(sd0&&(+sd0.appv||0)!==APPV)db.doc("data/users/"+uid+"/backup").set(sd0).catch(function(){});
      if(!sd0&&!ld0&&own){var old=await db.doc("player/state").get();if(old.exists){merge(old.data());migrated=true;db.doc("player/state").delete().catch(function(){})}}
      else{var pick=await saveWhich(sd0&&sd0.epoch===QB_EPOCH?sd0:null,ld0);
        if(pick.keep)db.doc("data/users/"+uid+"/backup_choice").set(pick.keep).catch(function(){});
        if(pick.use==="local"){merge(ld0);migrated=true}else if(sd0){merge(sd0);if(pick.asked)migrated=true}}
    }else if(db&&own){var s2=await db.doc("player/state").get();if(s2.exists)merge(s2.data());else{var rw=localStorage.getItem("quest-board");if(rw)merge(JSON.parse(rw))}}
    else{window.__qbBootErr=!window.claude?"no runtime":!db?"no database":"no id";db=null;var raw=localStorage.getItem("quest-board");if(raw)merge(JSON.parse(raw))}
  }catch(e){window.__qbBootErr=String((e&&(e.code||e.message))||e);db=null;try{var raw2=localStorage.getItem("quest-board");if(raw2)merge(JSON.parse(raw2))}catch(e2){}}
  loaded=true;
  /* areas seen so far, from the level this save loads at (29h_unlocks.js): a new save starts with none past level 1 */
  try{areaOn()}catch(e){}
  setTimeout(brandCheck,1500);
  saveMode=db?"cloud":"local";
  ownerView=own&&!!db;
  if(rollover()||migrated||S.fx1022)persist();
  checkInbox();
  render();
  checkPending();
  try{if(db&&MYUID){socPublish(true);socCheckPings()}}catch(e){}
})();
})();
