/* ---------- Cal 2026-11-26: a splash for anything newly unlocked ----------
   Cal: "Create tutorial splash screens for anything that is newly unlocked. I just upgraded the command console but it never told me that
   you can go into the interface shop in the shop tab to purchase permanent upgrades and buffs".
   Unlocks that had no tour of their own now each get a window once, the first time they open, with what it is, where to find it and a
   button that goes there. The Board, the Loft, Town, Training, Crawls, the Shop, Relics, the Wheel, the Daily Quest, Bounties, streak
   freezes and banners already have their tours and keep them.
   - The Command Console: permanent Upgrades and buffs, and Interface pieces, in the Shop: Interface (Upgrades and Interface tabs).
   - The Pet Store (level 25): adopt a companion and dress it, in the Shop: Pet Store.
   - A second accessory (level 20): wear two accessories at once, from any brand's Accessories.
   A save that already had the Pet Store or the second accessory before this version is not told again; the Console is told once to
   everyone who has it, since it was never explained. */
var V204=[
  {id:"console",test:function(){return typeof sysHas==="function"&&sysHas()},t:"Command Console online",
   x:"Your console unlocks the Shop's Interface upgrades: permanent Upgrades and buffs that keep working, and Interface pieces. Find them in the Shop: Interface, then the Upgrades tab.",go:"Open Upgrades",
   act:function(){sysOpen("upgrades")}},
  {id:"pets",test:function(){return typeof PETLV!=="undefined"&&effLvl()>=PETLV&&!(typeof areaGate==="function"&&areaGate("shop"))},t:"The Pet Store is open",
   x:"Adopt a companion, name it and dress it. It levels up with your tasks and walks beside you on your card. Find it in the Shop: Pet Store.",go:"Visit the Pet Store",
   act:function(){try{closeModals()}catch(e){}view="shop";window._qsSeen=1;shubGo("pets");render()}},
  {id:"acc2",test:function(){return typeof ECON!=="undefined"&&effLvl()>=ECON.accLv&&!(typeof areaGate==="function"&&areaGate("shop"))},t:"Two accessories",
   x:"You can wear a second accessory now, as long as it sits on another part of you (glasses and a necklace, say). Owned accessories show a Wear as second button.",go:"See the Shop",
   act:function(){try{closeModals()}catch(e){}view="shop";window._qsSeen=1;shubGo("street");render()}}];
function v204St(){if(!S.unl||typeof S.unl!=="object"){S.unl={};V204.forEach(function(u){try{if(u.id!=="console"&&u.test())S.unl[u.id]=1}catch(e){}});persist()}return S.unl}
var V204OPEN="";
function v204Tick(){try{if(!loaded||!S||!S.created||document.hidden)return;var o=v204St();
    if(document.querySelector("#layer .modal,#layer .qb-held,.coachscr")||(typeof TOUR!=="undefined"&&TOUR.id))return;
    for(var i=0;i<V204.length;i++){var u=V204[i];if(o[u.id])continue;var ok=false;try{ok=!!u.test()}catch(e){}if(!ok)continue;
      o[u.id]=1;persist();V204OPEN=u.id;try{qbSnd("big")}catch(e){}
      modal('<div class="card box2 v204u" data-u="'+u.id+'"><span class="label">Unlocked</span><h2 style="font-size:26px">'+esc(u.t)+'</h2><p class="note">'+esc(u.x)+'</p>'
        +'<div class="btns"><button class="btn" data-v204="go">'+esc(u.go)+'</button><button class="btn ghost" data-act="mclose">Got it</button></div></div>');return}}catch(e){}}
setInterval(v204Tick,2000);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-v204="go"]');if(!b)return;e.preventDefault();e.stopPropagation();
  var m=b.closest(".v204u"),id=m&&m.getAttribute("data-u"),u=V204.filter(function(x){return x.id===id})[0];try{closeModals()}catch(x){}if(u)try{u.act()}catch(x){}},true);
htabCss("qb-v204-css",".v204u .label{color:#4de8b0}.v204u h2{margin-top:4px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV204={st:v204St,tick:v204Tick,list:function(){return V204.map(function(u){return u.id})}};
