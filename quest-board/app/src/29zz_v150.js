/* ---------- Cal's 2026-11-24 list, batch 3b: the pets (docs/specs/2026-11-24_SPEC_cal_list.md items 14 to 20) ----------
   Cal: "i want the fictional pets we purchase to be able to gain experience and grow ... They would gain a small portion of the exp we
   gain and level up and eventually evolve", "remove Pluto and Chopstick from being purchasable in the shop ... have the other 3
   fictional pets be available", "When the pet unlocks at lvl 25, players should get a choice between the 3 pets where we can name them.
   We can decide to buy a different pet in the shop afterwards but price will be doubled. And then if we want to buy the 3rd one, price
   will be doubled again", "the pet shop tab should have a main default tab ... that shows the 3 pets we can purchase. Then there are 3
   buttons on the top that is a little hieroglyphic type logo of each pet ... Each tab would then open a subshop ... Once they level up,
   this sub menu will have two tabs (I and II)", "treats ... that increase affection (increase exp gain), [milk to] keep your pet full
   (increase overall coin gain by a little), and soul stones that permanently increase the chance to pickup random loot from tasks. These
   are all one time purchases", "Once it levels up to level 10, it evolves ... an option to de-evolve them for 1500 gold ... Then also
   1500 gold to evolve them again ... 'what...? Something is happening to [pet name]. Stop the transformation, or see what happens?' I
   also don't want people to know that there is a new evolution", "The pet bed will be an available upgrade after purchasing a pet", and
   through ROOMS: "when the pet evolves, we have a new upgrade available in the bedroom to purchase a larger bed".
   What this file does (29zz_pets.js still draws, dresses and stores them):
   - S.p2 = {own:{kind:{n name, xp, evo, form, ready, asked, t}}, care:{treat,milk,stone: tiers 0..3}, g: today's XP per quest, seen}.
     S.pet = {k,t} stays the one that is out. A pet owned before this is carried over.
   - Level 25 (PETLV): the Pet Store's button shows on the Shop's home screen; the first companion is free and named by the player; a
     second costs 2 x PET_PRICE, a third 4 x. Any owned one can be taken out. No more giving up for adoption.
   - A companion earns a share of every task's XP (10%, +2% a tier of Treats). Level L to L+1 needs 50 + 14 x (L-1), so level 10 is 954
     pet XP: about 5 heavy days at 10% (a heavy day is about 1,900 XP here). The cap is 20.
   - At level 10, once: the "What...?" window. "See what happens" changes its form (art pgx_k4/k5/k6, ROOMS, 1.4x); "Stop" leaves it,
     and the Pet Store then offers it again at no cost. After the first change, switching form costs 1,500 either way. Nothing names
     this before it happens: the store's II tab, the larger bed and the switch only exist for a pet that has changed.
   - Care, each tier bought once (P2CAREP): Treats (the share above), Pet Milk (+1% task coins a tier), Lucky Soul Stones (surprise
     loot + 0.5 of a percentage point a tier: 1 in 15 to about 1 in 12; lootP, read by 29zz_v144.js).
   - The bed is a Bedroom upgrade listed once the player has a companion (bd_pbed), and a larger one once it has changed (bd_pbed2).
     Without a bed it sleeps on the floor; changed but without the larger bed it sleeps beside the small one. No bed on the Patio.
   - Pluto and Chopstick are no longer sold: their four Bedroom upgrades are retired, and a save that has any of them, or dog clothes,
     gets what they cost back, once (S.dogref).
   - Pet clothes drop Tuesdays and Thursdays from 11-28 (were Mondays and Thursdays), and the dogs' line no longer drops.
   Still to come (phase 2): roaming into the Closet, Game Room, Lair and Patio and following the player; Calvin and Sydney's visit
   with their dogs; clothes for the changed forms (ROOMS) and their anchors; pet brands. */
var PETLV=25,PEVO={wolf:"k5",wyvern:"k6",slime:"k4"},PETEVOLV=10,PETSWAP=1500,PETSHARE=.10,PETMAXLV=20,P2TAB="home",P2FORM=1,
    P2CARE={treat:["Treats","A favourite snack. Your companion pays closer attention to everything you do.","learns +2% more of your task XP"],
            milk:["Pet Milk","A full belly and a good mood, and somehow your pockets feel it too.","+1% coins from tasks"],
            stone:["Lucky Soul Stone","It hums when something good is near.","surprise loot turns up a little more often"]},
    P2CAREP=[1500,3000,6000],P2BIG={wolf:[2.0,1.7],wyvern:[1.6,1.4],slime:[1.7,1.4]},P2DOGS=["bd_pluto","bd_chop","bd_dbed1","bd_dbed2"],P2ROM=["I","II","III"];
function p2Def(k){return k==="wolf"?"Wolf":k==="wyvern"?"Wyvern":"Slime"}
function p2(){var o=S.p2;if(!o||typeof o!=="object")o=S.p2={own:{},care:{}};if(!o.own||typeof o.own!=="object")o.own={};if(!o.care||typeof o.care!=="object")o.care={};
  if(S.pet&&PETS[S.pet.k]&&!o.own[S.pet.k])o.own[S.pet.k]={n:p2Def(S.pet.k),xp:0,evo:0,form:0,t:S.pet.t||Date.now()};return o}
function p2Pet(k){k=k||(petMine()||{}).k;return k?(p2().own[k]||null):null}
function p2Count(){return Object.keys(p2().own).filter(function(k){return PETS[k]}).length}
function p2Need(L){return 50+14*(L-1)}
function p2Lv(xp){var L=1;xp=Math.max(0,+xp||0);while(L<PETMAXLV&&xp>=p2Need(L)){xp-=p2Need(L);L++}return {lv:L,into:xp,need:L<PETMAXLV?p2Need(L):0}}
function p2Share(){return PETSHARE+.02*Math.min(3,+p2().care.treat||0)}
function p2Price(){var n=p2Count();return n?PET_PRICE*Math.pow(2,n):0}
function p2Form(k){var P=PETS[k]&&S&&S.p2&&S.p2.own&&S.p2.own[k];return P&&P.form?PEVO[k]:null}
function lootP(){var s=petMine()?Math.min(3,+p2().care.stone||0):0;return LOOTP+.005*s}
function p2Name(s,k){s=String(s||"").replace(/[<>&"']/g,"").replace(/\s+/g," ").trim().slice(0,14);return s||p2Def(k)}
/* ---- the changed form is drawn from its own frames; it has no anchors yet, so it wears nothing (pzPlace needs them) ---- */
var v50FI=pzFrameInfo;pzFrameInfo=function(who,f){var K=p2Form(who),D=pzData();
  if(K&&D&&D.pets&&D.pets[K]){var P=D.pets[K];return {img:"pgx_"+K+"_"+f,W:P.w,H:P.h,cx:P.cx,a:P.anchors&&P.anchors[f],fit:P.fit,dog:false}}return v50FI.apply(this,arguments)};
var v50Key=pzKey;pzKey=function(who){return v50Key.apply(this,arguments)+"|"+(p2Form(who)||"")};
function p2Redraw(k){try{if(typeof PZLAST!=="undefined")delete PZLAST[k]}catch(e){}}
/* ---- a share of each task's XP, and Pet Milk's coins ---- */
function p2Task(id,was){var m=petMine();if(!m)return;var o=p2(),P=o.own[m.k];if(!P)return;var now=!!(S.done&&S.done[id]),t=today();if(!o.g||o.g.d!==t)o.g={d:t,q:{}};
  if(!was&&now){var x=Math.max(1,Math.round((+S.done[id]||0)*p2Share())),L0=p2Lv(P.xp).lv,milk=Math.min(3,+o.care.milk||0),b=0;P.xp=(+P.xp||0)+x;
    if(milk&&S.cdone&&S.cdone[id]){b=Math.round(S.cdone[id]*.01*milk);if(b>0){S.cdone[id]+=b;S.coins+=b;S.earnedC+=b}}
    o.g.q[id]={k:m.k,x:x};var L1=p2Lv(P.xp).lv;
    if(L1>L0){var nm=P.n;setTimeout(function(){pop(nm+" reached level "+L1)},2200);if(L1>=PETEVOLV&&!P.evo)P.ready=1}
    persist()}
  else if(was&&!now&&o.g.q[id]){var g=o.g.q[id],Q=o.own[g.k];if(Q)Q.xp=Math.max(0,(+Q.xp||0)-g.x);delete o.g.q[id];persist()}}
var v50Toggle=toggle;toggle=function(id){var was=!!(S.done&&S.done[id]),r=v50Toggle.apply(this,arguments);try{p2Task(id,was)}catch(e){}return r};
/* ---- the change at level 10 ---- */
function p2Pic(k,K,cls){return '<img class="'+(cls||"")+'" src="'+pzArt("pgx_"+(K||k)+"_0")+'" alt="">'}
function p2Ask(){var m=petMine(),P=m&&p2Pet(m.k);if(!P||!P.ready||P.evo||P.asked)return;if(view!=="board"||document.querySelector("#layer .modal,#layer .qb-held"))return;
  P.asked=1;persist();try{qbSnd("big")}catch(e){}
  modal('<div class="card box2 adv p2evo"><span class="label">'+esc(P.n)+'</span><div class="p2glow">'+p2Pic(m.k,null,"p2shake")+'</div><h2>What...?</h2><p class="note">Something is happening to '+esc(P.n)+'.</p>'
    +'<div class="row" style="justify-content:center"><button type="button" class="btn ghost" data-act="p2evostop">Stop the transformation</button><button type="button" class="btn" data-act="p2evogo" data-id="'+m.k+'">See what happens</button></div></div>')}
function p2Change(k,to){var P=p2Pet(k);if(!P)return;P.form=to?1:0;if(to){P.evo=1;P.ready=0}p2Redraw(k);persist();render()}
function p2Reveal(k){var P=p2Pet(k);if(!P)return;closeModals();p2Change(k,1);try{qbSnd("big")}catch(e){}try{burst(innerWidth/2,innerHeight/3,60)}catch(e){}
  modal('<div class="card box2 adv p2evo done"><span class="label">'+esc(P.n)+'</span><div class="p2glow on">'+p2Pic(k,PEVO[k],"p2grow")+'</div><h2>'+esc(P.n)+' has changed.</h2><p class="note">Bigger, calmer, and looking at you like it always knew.</p>'
    +'<div class="row" style="justify-content:center"><button type="button" class="btn" data-act="mclose">Whoa</button></div></div>')}
/* ---- the Pet Store ---- */
function p2Glyph(k){var p=k==="home"?'<path d="M12 4 3 12h3v8h5v-5h2v5h5v-8h3z"/>':k==="slime"?'<path d="M12 3c3 4 7 6 7 11a7 7 0 0 1-14 0c0-5 4-7 7-11z"/><path d="M9 13h0M15 13h0" stroke-width="2.6"/>'
    :k==="wolf"?'<path d="M4 4l4 5h8l4-5-1 9-7 8-7-8z"/><path d="M9 13l1.5 1M15 13l-1.5 1"/>':'<path d="M3 16c4-9 8-11 12-12-1 3-1 5 1 7 2-1 4-1 5 0-3 1-5 3-6 7-3-3-7-3-12-2z"/>';
  return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+p+'</svg>'}
function p2Hero(){var m=petMine(),P=m&&p2Pet(m.k);if(!P)return '<div class="p2hero none"><h3>Choose your companion</h3><p class="qs-note">One of these three would like to come home with you. The first is free, and you name it.</p></div>';
  var L=p2Lv(P.xp),bar=L.need?Math.round(100*L.into/L.need):100,extra="";
  if(P.ready&&!P.evo)extra='<button type="button" class="qs-btn alt p2stir" data-act="p2evogo" data-id="'+m.k+'">'+esc(P.n)+' is restless&hellip; see what happens</button>';
  else if(P.evo)extra='<button type="button" class="qs-link" data-act="p2form" data-id="'+m.k+'">'+(P.form?'Return to its first form':'Change again')+' &middot; <i class="coin"></i>'+PETSWAP.toLocaleString()+'</button>';
  return '<div class="p2hero"><div class="p2big">'+pzPic(m.k,0,"p2bigpic")+'</div><div class="p2nm"><h3>'+esc(P.n)+'</h3><button type="button" class="qs-link" data-act="p2ren" data-id="'+m.k+'">Rename</button></div>'
    +'<div class="p2lv"><b>Level '+L.lv+'</b><span class="p2bar"><i style="width:'+bar+'%"></i></span><small>'+(L.need?L.into+' / '+L.need:'Max')+'</small></div>'
    +'<p class="qs-note">Learns '+Math.round(p2Share()*100)+'% of the XP from every task you finish.</p>'+extra+'</div>'}
function p2Card(k){var o=p2(),P=o.own[k],m=petMine(),out=m&&m.k===k,price=p2Price(),btn;
  if(P)btn=out?'<button class="qs-btn ghost" disabled>With you</button>':'<button class="qs-btn alt" data-act="p2out" data-id="'+k+'">Take out</button>';
  else if(!price)btn='<button class="qs-btn" data-act="p2choose" data-id="'+k+'">Choose</button>';
  else btn=S.coins>=price?'<button class="qs-btn" data-act="p2choose" data-id="'+k+'">Adopt &middot; <i class="coin"></i>'+price.toLocaleString()+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+price.toLocaleString()+' &middot; need '+(price-S.coins).toLocaleString()+' more</button>';
  return '<article class="qs-card pz-pet'+(out?" on":"")+'" data-card="pet_'+k+'"><div class="qs-img pz-img">'+(P?pzPic(k,0,"pz-fr"):p2Pic(k,null,"pz-fr"))+'</div><h4>'+esc(P?P.n:PETS[k].name)+'</h4><p>'+esc(P?PETS[k].name+" · level "+p2Lv(P.xp).lv:PETS[k].line)+'</p>'+btn+'</article>'}
function p2CareCard(kind){var o=p2(),t=Math.min(3,+o.care[kind]||0),C=P2CARE[kind],has=!!petMine(),btn;
  if(t>=3)btn='<button class="qs-btn ghost" disabled>All three owned</button>';
  else if(!has)btn='<button class="qs-btn ghost" disabled>Needs a companion</button>';
  else{var pr=P2CAREP[t];btn=S.coins>=pr?'<button class="qs-btn" data-act="p2care" data-id="'+kind+'"><i class="coin"></i>'+pr.toLocaleString()+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+pr.toLocaleString()+' &middot; need '+(pr-S.coins).toLocaleString()+' more</button>'}
  return '<article class="qs-card p2care'+(t>=3?" own":"")+'" data-card="care_'+kind+'"><div class="p2pips">'+[0,1,2].map(function(i){return '<i class="'+(i<t?"on":"")+'">'+P2ROM[i]+'</i>'}).join("")+'</div><h4>'+C[0]+(t<3?" "+P2ROM[t]:"")+'</h4><p>'+C[1]+'</p><small class="p2eff">Each one: '+C[2]+'. Bought once, kept for good.</small>'+btn+'</article>'}
/* Cal 11-24: "Everything in The shop, including stylist and pets and banners, can be viewed first on the character and then confirm to
   buy it when checking out. Should not automatically buy it and spend my money". Pet clothes: "Try on" puts a piece on the companion's
   picture at the top of its clothes tab (P2TRY, one per slot, nothing saved); the basket under it opens a checkout that lists the
   pieces and the total, and only "Confirm purchase" spends coins. Care and the 1,500 switch cannot be shown on anything, so they ask
   first with what they cost. */
var P2TRY={};
function p2TryList(k){var C=pzCl(),T=P2TRY[k]||{};return Object.keys(T).map(function(sl){return T[sl]}).filter(function(id){return C[id]&&C[id].pet===k&&!(S.owned&&S.owned["pc_"+id])})}
function p2TryHead(k){var o=p2(),P=o.own[k];if(!P)return "";var C=pzCl(),tl=p2TryList(k),worn=Object.assign({},pzWorn(k));tl.forEach(function(id){worn[pzSlot(C[id].kind)]=id});
  var sp=null;try{sp=pzSprite(k,0,worn)}catch(e){}var pic=sp?'<img class="p2bigpic" data-pzk="'+esc(pzKey(k,0,worn))+'" src="'+sp.u+'" alt="">':"",cost=tl.reduce(function(a,id){return a+(PC_PRICE[C[id].kind]||400)},0);
  return '<div class="p2hero p2tryhero"><div class="p2big">'+pic+'</div><div class="p2nm"><h3>'+esc(P.n)+'</h3></div>'+(tl.length?'<div class="qs-bask"><small>Trying on '+tl.length+' piece'+(tl.length>1?"s":"")+'</small>'
    +(S.coins>=cost?'<button class="qs-btn" data-act="p2check" data-id="'+k+'">Buy '+(tl.length>1?"all ":"")+'&middot; <i class="coin"></i>'+cost.toLocaleString()+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+cost.toLocaleString()+' &middot; need '+(cost-S.coins).toLocaleString()+' more</button>')
    +'<button class="qs-link" data-act="p2tryoff" data-id="'+k+'">Take them off</button></div>':'<p class="qs-note">Tap a piece to see it on '+esc(P.n)+' before you buy it.</p>')+'</div>'}
function p2TryCards(k,h){var o=p2(),T=P2TRY[k]||{};
  return h.replace(/<button class="qs-btn" data-act="pzclbuy" data-id="([^"]+)">([\s\S]*?)<\/button>/g,function(m,id,inner){var C=pzCl()[id];if(!C)return m;
    if(!o.own[k])return '<button class="qs-btn ghost" disabled>'+inner+' &middot; needs a '+esc(PETS[k].name)+'</button>';var on=T[pzSlot(C.kind)]===id;
    return '<button class="qs-btn'+(on?" alt":"")+'" data-act="p2try" data-id="'+id+'">'+(on?"Trying on":"Try on")+' &middot; '+inner+'</button>'})}
function p2Clothes(k){return p2TryCards(k,p2ClothesBase(k))}
function p2ClothesBase(k){var o=p2(),P=o.own[k],C=pzCl(),two=!!(P&&P.evo),tabs=two?'<nav class="qs-tabs p2forms"><button class="qs-tab'+(P2FORM===1?" on":"")+'" data-act="p2ft" data-id="1">I</button><button class="qs-tab'+(P2FORM===2?" on":"")+'" data-act="p2ft" data-id="2">II</button></nav>':"";
  if(two&&P2FORM===2)return tabs+'<p class="qs-note qs-lead">Nothing has been made in this size yet. Check back after the next drop.</p>';
  var drop=pzDrop(k),own=Object.keys(C).filter(function(id){return S.owned&&S.owned["pc_"+id]&&C[id].pet===k&&drop.indexOf(id)<0});
  return p2TryHead(k)+tabs+'<section class="qs-sec"><h3>This drop</h3><p class="qs-note">New pieces Tuesdays and Fridays at 8 am.'+(P?"":" Yours to buy once a "+esc(PETS[k].name)+" lives with you.")+'</p><div class="qs-grid">'+drop.map(pzClCard).join("")+'</div></section>'
    +(own.length?'<section class="qs-sec"><h3>'+esc(P?P.n:PETS[k].name)+'&rsquo;s clothes</h3><div class="qs-grid">'+own.map(pzClCard).join("")+'</div></section>':"")}
function p2Store(){var o=p2();if(!o.seen){o.seen=1;persist()}if(P2TAB!=="home"&&!PETS[P2TAB])P2TAB="home";
  var nav='<nav class="p2nav" aria-label="Pet Store">'+["home"].concat(PET_ORDER.slice().sort(function(a,b){return ["slime","wolf","wyvern"].indexOf(a)-["slime","wolf","wyvern"].indexOf(b)})).map(function(k){
      return '<button type="button" class="p2g'+(P2TAB===k?" on":"")+'" data-act="p2tab" data-id="'+k+'" aria-label="'+(k==="home"?"Pet Store":esc(PETS[k].name)+" clothes")+'">'+p2Glyph(k)+'</button>'}).join("")+'</nav>';
  if(P2TAB!=="home")return nav+p2Clothes(P2TAB);
  return nav+p2Hero()+'<section class="qs-sec"><h3>Companions</h3><div class="qs-grid pz-grid">'+PET_ORDER.map(p2Card).join("")+'</div></section>'
    +'<section class="qs-sec"><h3>Care</h3><div class="qs-grid">'+["treat","milk","stone"].map(p2CareCard).join("")+'</div></section>'}
shubPets=function(){try{return effLvl()>=PETLV}catch(e){return false}};
/* the Pet Store is the Closet's screen with its body swapped (as 29zz_pets.js did for its tab), so it needs no floor of its own */
var v50Shop=shopHtml;shopHtml=function(){if(shopTab!=="pets"||SHUB==="home")return v50Shop.apply(this,arguments);
  shopTab="wardrobe";var h;try{h=v50Shop.apply(this,arguments)}finally{shopTab="pets"}
  try{var a=h.indexOf('<p class="qs-note qs-lead">Everything you own'),b=h.indexOf('<p class="qs-dev">');if(b<0)b=h.lastIndexOf('</div>');
    if(a>=0&&b>a)h=h.slice(0,a)+p2Store()+h.slice(b);
    h=h.replace('<b class="shub-title">Closet</b>','<b class="shub-title">Pet Store</b>').replace('shub-in shub-closet','shub-in shub-pets')}catch(e){}
  return h};
function p2NameModal(k,adopt){var P=p2Pet(k),price=adopt?p2Price():0;
  modal('<div class="card box2 p2name"><span class="label">'+(adopt?(price?"Adopt":"Your companion"):"Rename")+'</span><div class="pz-cpic">'+p2Pic(k,P&&P.form?PEVO[k]:null)+'</div><h2>'+(adopt?"What will you call it?":"A new name")+'</h2>'
    +'<input id="p2nm" class="p2in" maxlength="14" autocomplete="off" placeholder="'+p2Def(k)+'" value="'+esc(P?P.n:"")+'">'
    +'<div class="row"><button type="button" class="btn ghost" data-act="mclose">Cancel</button><button type="button" class="btn" data-act="'+(adopt?"p2adopt":"p2renok")+'" data-id="'+k+'">'+(adopt?(price?"Adopt &middot; "+price.toLocaleString()+" coins":"Bring it home"):"Save")+'</button></div></div>')}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act^=p2]");if(!b)return;e.preventDefault();e.stopPropagation();var a=b.dataset.act,id=b.dataset.id,o=p2(),P;
  if(a==="p2tab"){P2TAB=id;P2FORM=1;render();return}
  if(a==="p2ft"){P2FORM=id==="2"?2:1;render();return}
  if(a==="p2choose"){if(!PETS[id]||o.own[id])return;p2NameModal(id,1);return}
  if(a==="p2adopt"){if(!PETS[id]||o.own[id]||effLvl()<PETLV)return;var price=p2Price(),inp=document.getElementById("p2nm");if(S.coins<price){pop("Need "+(price-S.coins)+" more coins");return}
    S.coins-=price;if(price)S.spent=(S.spent||0)+price;o.own[id]={n:p2Name(inp&&inp.value,id),xp:0,evo:0,form:0,t:Date.now()};S.pet={k:id,t:o.own[id].t};closeModals();try{qbSnd("buy")}catch(x){}render();persist();
    try{burst(innerWidth/2,innerHeight/3,30)}catch(x){}pop(o.own[id].n+" is yours. Say hi in the Bedroom.");return}
  if(a==="p2out"){if(!o.own[id])return;S.pet={k:id,t:o.own[id].t||Date.now()};p2Redraw(id);render();persist();pop(o.own[id].n+" is with you now.");return}
  if(a==="p2ren"){if(o.own[id])p2NameModal(id,0);return}
  if(a==="p2renok"){P=o.own[id];var i2=document.getElementById("p2nm");if(!P)return;P.n=p2Name(i2&&i2.value,id);closeModals();render();persist();return}
  if(a==="p2try"){var c0=pzCl()[id];if(!c0||!o.own[c0.pet])return;var T=P2TRY[c0.pet]=P2TRY[c0.pet]||{},sl=pzSlot(c0.kind);if(T[sl]===id)delete T[sl];else T[sl]=id;render();return}
  if(a==="p2tryoff"){delete P2TRY[id];render();return}
  if(a==="p2check"||a==="p2buyok"){var Cl=pzCl(),tl=p2TryList(id),cost=tl.reduce(function(x,q){return x+(PC_PRICE[Cl[q].kind]||400)},0);if(!tl.length||!o.own[id])return;
    if(a==="p2check"){modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+tl.length+' piece'+(tl.length>1?"s":"")+' for '+esc(o.own[id].n)+'</h3><ul>'+tl.map(function(q){return '<li><span>'+esc((PCNAME[q]||[q])[0])+'</span><b><i class="coin"></i>'+(PC_PRICE[Cl[q].kind]||400).toLocaleString()+'</b></li>'}).join("")
        +'</ul><p class="note">Total <b><i class="coin"></i>'+cost.toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="p2buyok" data-id="'+id+'">Confirm purchase</button><button class="btn ghost" data-act="mclose">Keep looking</button></div></div>');return}
    if(S.coins<cost){pop("Need "+(cost-S.coins)+" more coins");return}closeModals();tl.forEach(function(q){var pr0=PC_PRICE[Cl[q].kind]||400;S.coins-=pr0;S.spent=(S.spent||0)+pr0;S.owned["pc_"+q]=true;pzSetWear(id,pzSlot(Cl[q].kind),q)});delete P2TRY[id];
    try{qbSnd("buy")}catch(x){}render();persist();pop("Bought "+(tl.length>1?tl.length+" pieces":(PCNAME[tl[0]]||[tl[0]])[0])+".");return}
  if(a==="p2care"){if(!P2CARE[id]||!petMine())return;var t0=Math.min(3,+o.care[id]||0);if(t0>=3)return;var pr1=P2CAREP[t0];if(S.coins<pr1){pop("Need "+(pr1-S.coins)+" more coins");return}
    modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+P2CARE[id][0]+' '+P2ROM[t0]+'</h3><p class="note">'+P2CARE[id][1]+' It '+P2CARE[id][2]+', for good.</p><p class="note">Price <b><i class="coin"></i>'+pr1.toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="p2careok" data-id="'+id+'">Confirm purchase</button><button class="btn ghost" data-act="mclose">Not now</button></div></div>');return}
  if(a==="p2careok"){if(!P2CARE[id]||!petMine())return;var t=Math.min(3,+o.care[id]||0);if(t>=3)return;var pr=P2CAREP[t];if(S.coins<pr){pop("Need "+(pr-S.coins)+" more coins");return}closeModals();
    S.coins-=pr;S.spent=(S.spent||0)+pr;o.care[id]=t+1;try{qbSnd("buy")}catch(x){}render();persist();pop(P2CARE[id][0]+" "+P2ROM[t]+": "+P2CARE[id][2]+".");return}
  if(a==="p2evostop"){closeModals();pop("It settles down. For now.");return}
  if(a==="p2evogo"){P=o.own[id];if(!P||P.evo||!P.ready)return;p2Reveal(id);return}
  if(a==="p2form"){P=o.own[id];if(!P||!P.evo)return;if(S.coins<PETSWAP){pop("Need "+(PETSWAP-S.coins)+" more coins");return}
    modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+(P.form?"Back to its first form":"Change again")+'</h3><p class="note">'+esc(P.n)+' can switch back whenever you like, at the same price.</p><p class="note">Price <b><i class="coin"></i>'+PETSWAP.toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="p2formok" data-id="'+id+'">Confirm</button><button class="btn ghost" data-act="mclose">Not now</button></div></div>');return}
  if(a==="p2formok"){P=o.own[id];if(!P||!P.evo)return;if(S.coins<PETSWAP){pop("Need "+(PETSWAP-S.coins)+" more coins");return}closeModals();S.coins-=PETSWAP;S.spent=(S.spent||0)+PETSWAP;p2Change(id,!P.form);try{qbSnd("buy")}catch(x){}return}},true);
/* ---- the bed: an upgrade once there is a companion, a larger one once it has changed ---- */
(function(){var A=ADDONS.bedroom;if(!A)return;
  A.forEach(function(a){if(P2DOGS.indexOf(a[0])>=0)a[3]=Object.assign({},a[3]||{},{retired:1})});
  if(!A.some(function(a){return a[0]==="bd_pbed"})){A.push(["bd_pbed","Companion Bed",600,{g:"Companion",retired:1},"A bed of its own, in the corner by the window."]);
    A.push(["bd_pbed2","Grand Companion Bed",1800,{g:"Companion",retired:1},"Room to stretch out. It has outgrown the old one."]);ADDREQ.bd_pbed2="bd_pbed"}})();
function p2BedFlags(){try{var has=!!petMine(),P=has&&p2Pet(),big=!!(P&&P.evo);(ADDONS.bedroom||[]).forEach(function(a){if(a[0]==="bd_pbed")a[3].retired=has?0:1;else if(a[0]==="bd_pbed2")a[3].retired=big?0:1})}catch(e){}}
var v50Avail=roomAvail;roomAvail=function(){p2BedFlags();return v50Avail.apply(this,arguments)};
var v50Bed=pzBed;pzBed=function(C,room){var mine=petMine(),D=pzData();if(!mine||!D||room!=="bedroom")return null;var sp=(D.spots||{}).bedroom;if(!sp)return null;
  var r=slotOf("bedroom"),has=!!(r&&r.a&&r.a.bd_pbed),big=!!(r&&r.a&&r.a.bd_pbed2),K=p2Form(mine.k),floor=[sp[0]-.7,sp[1]+1.1];
  if(!has)return floor;
  if(K&&big&&D.pets[K]&&D.pets[K].bed&&window.LFSPR){var b=D.pets[K].bed,k=b.id||("pbed_"+K),fp=P2BIG[mine.k]||[1.8,1.5],w=fp[0],d=fp[1],x=sp[0]+1.2-w,y=Math.max(.35,sp[1]+1.0-d);/* QA 11-24 (rule 20): it grew toward the front and sat on the door mat; its front edge stays where the small bed's is and it grows toward the back wall */if(!LFSPR[k])LFSPR[k]={w:b.w,h:b.h,u:pzArt(k)};
    lfSpr(C,k,x,y,w,d,{h:6,ctr:1,H:b.h*PZ_K,dk:.5});var px=x+w-.1,py=px-(x-y)-(w-d)/2,sy=LF.sy,front=(x+w+y+d)*sy,me=(px+py)*sy,z=b.sleepOff*PZ_K-(front-me);
    C.plat.push({x0:x,y0:y,x1:x+w,y1:y+d,z:z,key:x+w+y+d+.01});return [px,py]}
  var pt=v50Bed.apply(this,arguments);return K?floor:(pt||floor)};
pzBedPt=function(){return null};
/* ---- Pluto and Chopstick are no longer sold: what they, their beds and their clothes cost comes back, once ---- */
function p2DogRefund(){if(!S||!S.created||typeof loaded==="undefined"||!loaded||S.dogref)return;var c=0,n=0,C=pzCl();
  (S.base&&S.base.slots||[]).forEach(function(r){if(!r||r.t!=="bedroom"||!r.a)return;P2DOGS.forEach(function(id){if(!r.a[id])return;var a=(ADDONS.bedroom||[]).filter(function(x){return x[0]===id})[0];c+=a?(+a[2]||0):0;delete r.a[id];n++})});
  Object.keys(C).forEach(function(id){if(C[id].pet==="dogs"&&S.owned&&S.owned["pc_"+id]){c+=PC_PRICE[C[id].kind]||400;delete S.owned["pc_"+id];n++}});
  S.dogw={};S.dogref={at:Date.now(),c:c,n:n};if(c){S.coins=(S.coins||0)+c;S.spent=Math.max(0,(S.spent||0)-c)}persist();
  if(n){try{render()}catch(e){}setTimeout(function(){pop("Pluto and Chopstick went home with Calvin and Sydney. "+c.toLocaleString()+" coins are back in your pocket.")},1500)}}
/* ---- pet clothes: Tuesdays and Fridays from 11-28 (Mondays and Thursdays before, so no drop that happened moves) ---- */
pzSlotNow=function(){var n=dropNow(),k=0,cut=ymdN("2026-11-28");for(var i=0;i<4000;i++){var ymd=ymdAdd(PZ_DAY0,i),x=ymdN(ymd),wd=new Date(x*864e5).getUTCDay();
    if(x<cut?(wd!==1&&wd!==4):(wd!==2&&wd!==5))continue;/* Cal 11-25: "The pet shop cycles through on Tuesday and Friday" (was Tuesday and Thursday from 11-28, never shipped a drop) */if(dropStart(ymd)>n)break;k++}return Math.max(0,k-1)};
/* ---- a "!" on the Shop until the level 25 player has opened the Pet Store ---- */
var v50Tabs=alTabs;alTabs=function(){var t=v50Tabs.apply(this,arguments);try{if(effLvl()>=PETLV&&!areaGate("shop")&&!p2().seen)t.shop=1}catch(e){}return t};
var v50Render=render;render=function(){try{p2BedFlags();p2DogRefund()}catch(e){}var r=v50Render.apply(this,arguments);try{p2Ask()}catch(e){}return r};
htabCss("qb-p2-css",".p2nav{display:flex;gap:8px;margin:2px 0 12px}.p2g{flex:1;min-height:46px;display:flex;align-items:center;justify-content:center;border-radius:14px;border:1px solid var(--line);background:transparent;color:inherit;opacity:.7;cursor:pointer}.p2g.on{opacity:1;border-color:var(--accent,#7cf0ff);background:rgba(124,240,255,.10)}"
  +".p2hero{display:grid;justify-items:center;gap:8px;margin:0 0 16px;padding:14px;border-radius:18px;border:1px solid var(--line);background:var(--pad,rgba(255,255,255,.05))}.p2hero.none{text-align:center}.p2big{display:flex;justify-content:center;align-items:flex-end;min-height:190px}.p2big img{height:190px;width:auto;max-width:100%;object-fit:contain}"
  +".p2nm{display:flex;align-items:baseline;gap:10px}.p2nm h3{margin:0;font-size:1.35em}.p2lv{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;width:100%;max-width:300px}.p2bar{display:block;height:8px;border-radius:8px;background:rgba(127,127,127,.25);overflow:hidden}.p2bar i{display:block;height:100%;background:linear-gradient(90deg,#7cffb2,#ffc857)}"
  +".p2stir{animation:p2pulse 1.4s ease-in-out infinite}@keyframes p2pulse{50%{box-shadow:0 0 18px rgba(255,200,87,.7)}}"
  +".p2care{position:relative}.p2pips{display:flex;gap:6px;margin-bottom:6px}.p2pips i{font-style:normal;font-size:.72em;min-width:26px;text-align:center;padding:3px 0;border-radius:8px;border:1px solid var(--line);opacity:.5}.p2pips i.on{opacity:1;border-color:var(--gold,#ffc857);color:var(--gold,#ffc857)}.p2eff{display:block;margin:4px 0 8px;opacity:.8}"
  +".p2in{width:100%;box-sizing:border-box;margin:10px 0;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:transparent;color:inherit;font:inherit;font-size:1.1em;text-align:center}"
  +".p2evo{text-align:center}.p2glow{display:flex;justify-content:center;margin:8px 0;padding:10px;border-radius:18px;background:radial-gradient(circle at 50% 60%,rgba(255,255,255,.28),rgba(255,255,255,0) 65%)}.p2glow img{height:190px;width:auto;max-width:100%;object-fit:contain}"
  +".p2shake{animation:p2shake .5s ease-in-out infinite;filter:brightness(1.5) drop-shadow(0 0 14px #fff)}@keyframes p2shake{0%,100%{transform:translateX(0) scale(1)}25%{transform:translateX(-3px) scale(1.03)}75%{transform:translateX(3px) scale(.98)}}img.p2grow{animation:p2grow .9s cubic-bezier(.2,1.3,.4,1)}@keyframes p2grow{from{transform:scale(.55);filter:brightness(3)}to{transform:none;filter:none}}"
  +".p2forms{margin:0 0 10px}.shub-pets .qs-grid{margin-bottom:6px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV150={state:p2,lv:p2Lv,need:p2Need,share:p2Share,price:p2Price,lootP:function(){return lootP()},task:p2Task,ask:p2Ask,refund:p2DogRefund,slot:function(){return pzSlotNow()},form:p2Form,tab:function(k){P2TAB=k},flags:p2BedFlags};
