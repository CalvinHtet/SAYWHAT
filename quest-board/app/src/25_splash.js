/* ---------- splash screens ----------
   A short congratulations and explanation whenever something new opens, plus the
   "Now on sale" card for a new brand. Each only shows once; rooms keep a How it works
   button so the text can be read again. */
var ROOMHELP={
 loft:{k:"Welcome",t:"This is The Loft",sub:"Your home base. Quests pay coins, and coins build this place up.",pts:[["Your Bedroom","Tap it to buy upgrades: a better bed, a real desk, a closet and more."],["Passive money","Businesses you open here earn coins by themselves, even while you are away."],["What's next","The Restaurant opens at level 8, then the Garden at level 14 and the Movie Theater at level 24."]]},
 restaurant:{k:"New room",t:"You opened the Restaurant!",sub:"Your first business. Guests come in, eat and pay, and coins pile up by themselves.",pts:[["Collect your coins","Coins build up while you are away. Tap the coin bubble on The Loft to collect them. It fills up after 8 hours, so check in once or twice a day."],["Quests run the kitchen","It earns at full speed after 3 quests that day and only 20% with none. Do your real quests and it takes care of itself."],["Upgrade it","Better tables, kitchen gear, staff and bigger rooms all raise your coins per hour."],["Unlock more of your base","Spend your earnings on the Garden at level 14 and the Movie Theater at level 24."]]},
 garden:{k:"New room",t:"You planted a Garden!",sub:"It grows fresh ingredients all by itself. Nothing to water, nothing to harvest.",pts:[["It feeds the Restaurant","While the pantry has stock, your Restaurant earns more. The more you upgrade the Garden, the bigger that bonus gets."],["New dishes","Crops add dishes to the Restaurant's menu, so you will see them on order bubbles."],["Spare coins","Extra produce sells at the gate. Collect those coins just like the Restaurant's."]]},
 theater:{k:"New room",t:"Your Movie Theater is open!",sub:"For now it is just a lobby. Guests line up, buy a ticket and head through the double doors.",pts:[["Tickets pay you","Ticket money piles up by itself. Collect it from The Loft like the other rooms."],["Grow the lobby","Add a snack bar, a concession stand, better floors and walls, decorations and, later, a bar."],["What is behind the doors?","At level 30 you can open the Auditorium and see for yourself."]]},
 auditorium:{k:"New room",t:"The doors are open!",sub:"This is the screening room behind the double doors, and it earns coins of its own.",pts:[["Make it a real cinema","Upgrade the seats, the projector, the sound, the walls and the floors."],["Dream big","Work up to a wall-to-wall IMAX screen."]]}
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
  var m=modal('<div class="card box2 bsplash" style="--b1:'+b.c[0]+';--b2:'+b.c[1]+';--b3:'+b.c[2]+';--ba:'+b.ac+'"><div class="bs-burst">NOW ON SALE</div>'+brandLogo(b,1)+'<p class="bs-tag">'+esc(b.tag)+'</p><div class="bs-items">'+picks.map(function(it){return '<div class="bs-item"><img src="'+itemArt(it)+'" alt=""><b>'+esc(it[2])+'</b><span><i class="coin"></i>&nbsp;'+it[3]+'</span></div>'}).join("")+'</div><button class="btn big bs-go" data-act="bsgo" data-b="'+b.id+'">Go to Shop</button></div>');
  return m}
/* the newest live brand this player has not been shown yet */
function brandCheck(){if(!S.created||areaGate("shop")||document.querySelector(".bsplash")||document.querySelector("#layer .modal"))return;if(!S.brandSeen)S.brandSeen={};var live=dropState().live,fresh=live.filter(function(b){return !S.brandSeen[b.id]});if(!fresh.length)return;
  live.forEach(function(b){S.brandSeen[b.id]=1});persist();brandSplash(fresh[fresh.length-1])}
