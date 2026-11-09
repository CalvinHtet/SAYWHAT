/* ---------- the old missions (Cal, 2026-11-09: "Merge dungeons and missions. dont need two separate ones. Dungeon Crawls will be
   the new name") ----------
   Missions and dungeon delves are one thing now, Dungeon Crawls (10_app_a.js, the finds in 29d_dungeon.js). A save with a mission
   still out from before gets that mission's coins once, then the old mission state goes. */
var MS_OLD={m1:45,m2:85,m3:160,m4:250,m5:400};
setInterval(function(){if(typeof loaded==="undefined"||!loaded||!S||!S.created||!S.ms)return;var run=S.ms.run||{},n=0;Object.keys(run).forEach(function(id){n+=MS_OLD[id]||0});
  delete S.ms;if(n){S.coins+=n;S.earnedC+=n;pop("Your team came home from their last missions: +"+n+" coins. Missions are Dungeon Crawls now.")}persist();render()},5000);
/* ---------- the dogs ---------- */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=dogclean]");if(!b)return;
  var P=S.base.poops||[];P.shift();S.base.poops=P;S.coins+=20;S.earnedC+=20;pop("Cleaned up. +20 coins");persist();render();var om=document.querySelector(".rmodal .rm-scroll");if(om)roomModal(+om.dataset.i)});
var dogNextBase=lfDogNext;
lfDogNext=function(a,C){if(!a.visitor&&!a.pv&&Math.random()<.06&&(S.base.poops||[]).length<3&&!lfBlockedAt(C,a.x,a.y)){S.base.poops=S.base.poops||[];S.base.poops.push({x:+a.x.toFixed(1),y:+a.y.toFixed(1)});a.mode="do";a.act="sit";a.t=2.4;a.at=0;a.last="poop";persist();setTimeout(function(){if(!document.querySelector("#layer .modal"))render()},2600);return}return dogNextBase(a,C)};
var bedDogs=LFROOM.bedroom;
LFROOM.bedroom=function(C){bedDogs(C);(S.base.poops||[]).forEach(function(p){var q=lfP(p.x,p.y,0);C.decals.push('<g transform="translate('+q[0]+','+q[1]+')"><ellipse rx="7" ry="3.4" fill="#6b4524"/><ellipse cy="-3" rx="5" ry="2.6" fill="#7c5230"/><ellipse cy="-5.6" rx="3" ry="1.8" fill="#8a5c36"/></g>')});
};
