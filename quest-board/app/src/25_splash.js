/* ---------- splash screens ----------
   A short congratulations and explanation whenever something new opens, plus the
   "Now on sale" card for a new brand. Each only shows once; rooms keep a How it works
   button so the text can be read again. */
var ROOMHELP={
 loft:{k:"Welcome",t:"This is The Loft",sub:"Your home base. Quests pay coins, and coins build this place up.",pts:[["Your Bedroom","Tap it to buy upgrades: a better bed, a real desk, a closet and more."],["Businesses","Rooms you open earn coins, but only on days you do your quests. The more you do, the more they can pay out."],["What comes next","At level 5 the empty lot next door goes up for sale. What you grow there starts everything else."]]},
 restaurant:{k:"New room",t:"The Restaurant is open",sub:"Your first business. Guests come in, eat and pay.",pts:[["Collect your coins","Takings build up in the room. Tap the coin bubble to collect them. It holds 8 hours, so check in once or twice a day."],["Your quests run the kitchen","Each day it pays out a share of what your quests earned. No quests, no takings. The Daily Quest on the board shows how hard the town is working."],["Upgrade it","Kitchen gear and staff raise what it earns. Decor is for looks."],["What comes next","Keep the tables full. When enough people want a drink on the way out, Mara will have an idea."]]},
 garden:{k:"New room",t:"The Garden",sub:"It grows fresh produce on its own. Nothing to water, nothing to harvest.",pts:[["Water it","The beds only grow while they are watered. Water them once a day from the Garden window, or by tapping the watering can. Rain counts. Sprinklers do it for you later."],["Sell at the gate","Sell what it grows from the Garden window. Sell enough and someone will notice, and the Garden can expand into a restaurant."],["It feeds the Restaurant","Once the Restaurant opens, produce in the pantry adds dishes and raises what it earns."],["Upgrade it","Better beds and tools grow more."]]},
 theater:{k:"New room",t:"The Movie Theater is open",sub:"For now it is just a lobby. Guests line up, buy a ticket and head through the double doors.",pts:[["Tickets pay you","Ticket money builds up in the room. Collect it like the others."],["Grow the lobby","Add a ticket stand, a snack bar, better floors and walls, and later a bar."],["Behind the doors","The Auditorium opens once the lobby has its basics and someone to run it."]]},
 auditorium:{k:"New room",t:"The Auditorium",sub:"The screening room behind the double doors. It earns coins of its own.",pts:[["Make it a real cinema","Upgrade the seats, the projector, the sound, the walls and the floors."],["The big screen","Work up to a wall-to-wall IMAX screen."]]}
};
function roomSplash(key,force){var H=ROOMHELP[key];if(!H)return;if(!S.seen)S.seen={};if(S.seen[key]&&!force)return;S.seen[key]=1;persist();
  var art=ART&&ART["room_"+key];
  var m=modal('<div class="card box2 rsplash">'+(art?'<div class="rhero" style="background-image:url('+art+')"><span class="label">'+esc(H.k)+'</span><h2>'+esc(H.t)+'</h2></div>':'<span class="label">'+esc(H.k)+'</span><h2>'+esc(H.t)+'</h2>')
   +'<p class="rsp-sub">'+esc(H.sub)+'</p><div class="rsp-pts">'+H.pts.map(function(p){return '<div><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span></div>'}).join("")+'</div><button class="btn big" data-act="mclose">Got it</button></div>');
  if(!force)try{burst(innerWidth/2,innerHeight/3,26)}catch(e){}return m}
/* a smaller one for a big upgrade */
function upSplash(ad){return modal('<div class="card box2 rsplash"><span class="label">Congratulations</span><h2 style="font-size:28px">'+esc(ad[1])+'</h2><p class="rsp-sub">'+esc(ad[3].splash)+'</p><button class="btn big" data-act="mclose">Nice</button></div>')}
function helpBtn(key){return ROOMHELP[key]?'<button class="btn ghost rsp-help" data-act="rhelp" data-t="'+key+'">How it works</button>':''}
/* a new brand arrives */
function brandPicks(b){var pool=SHOP.filter(function(x){return x[6]&&x[6].b===b.id&&isRigItem(x)&&itemFits(x)}),out=[],seen={};
  ["a_top","a_shoes","a_pants","a_hat","a_acc"].forEach(function(sl){var it=pool.filter(function(x){return x[1]===sl&&!seen[x[0]]})[0];if(it&&out.length<4){out.push(it);seen[it[0]]=1}});return out}
function brandSplash(b){var picks=brandPicks(b);
  /* Cal, 2026-11-05: the drop window carries the brand's banner art, in portrait (ui_banner_<id>_p.webp from ROOMS; until
     then the landscape banner, cropped to the window) */
  var art=window.QBART&&(QBART["ui_banner_"+b.id+"_p.webp"]||QBART["ui_banner_"+b.id+".webp"]);
  var m=modal('<div class="card box2 bsplash'+(art?' has-art':'')+'" style="--b1:'+b.c[0]+';--b2:'+b.c[1]+';--b3:'+b.c[2]+';--ba:'+b.ac+'">'+(art?'<img class="bs-art" src="'+art+'" alt=""><i class="bs-shade" aria-hidden="true"></i>':'')+'<div class="bs-burst">NOW ON SALE</div>'+brandLogo(b,1)+'<p class="bs-tag">'+esc(b.tag)+'</p><div class="bs-items">'+picks.map(function(it){return '<div class="bs-item"><img src="'+itemArt(it)+'" alt=""><b>'+esc(it[2])+'</b><span><i class="coin"></i>&nbsp;'+it[3]+'</span></div>'}).join("")+'</div><button class="btn big bs-go" data-act="bsgo" data-b="'+b.id+'">Go to Shop</button></div>');
  return m}
/* the newest live brand this player has not been shown yet */
function brandCheck(){if(!S.created||areaGate("shop")||document.querySelector(".bsplash")||document.querySelector("#layer .modal"))return;if(!S.brandSeen)S.brandSeen={};var live=dropState().live,fresh=live.filter(function(b){return !S.brandSeen[b.id]});if(!fresh.length)return;
  live.forEach(function(b){S.brandSeen[b.id]=1});persist();brandSplash(fresh[fresh.length-1])}
