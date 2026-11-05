/* ---------- prices ----------
   A task pays about 50 coins and a good day about 1,000. So a small thing costs a few tasks
   and costs the same as every other small thing, anything normal fits inside one day, and
   only the moments that change a room cost a few days. See docs/ECONOMY.md. */
var PRICE={small:200,medium:400,large:800};
var PRICE_HUGE={r_x1:1500,r_x2:3000,r_patio:2000,r_bar:2500,r_noir:2500,r_t3:1500,
 g_x1:1200,g_x2:2500,g_green1:1500,g_green2:4000,g_fount:1500,
 t_aud:2500,t_wing:2000,t_bar:1500,au_scr2:1500,au_imax:4000,au_proj2:2000,au_recline:1500,
 bd_ward2:1000,bd_lair:2500,bd_patio:1500};
function priceFlat(a){var id=a[0],e=a[3]||{};if(e.fp)return a[2];if(PRICE_HUGE[id])return PRICE_HUGE[id];if(!a[2])return 0;
  if(e.g==="Decor"||e.g==="Menu"||e.g==="Grounds")return a[2]>6000?PRICE.medium:PRICE.small;
  return a[2]<=1200?PRICE.small:a[2]<=6000?PRICE.medium:PRICE.large}
Object.keys(ADDONS).forEach(function(k){(ADDONS[k]||[]).forEach(function(a){a[2]=priceFlat(a);if(a[3]&&a[3].p)a[3].p=Math.round(a[3].p*50)/100})});
ROOMT.restaurant.cost=1000;ROOMT.garden.cost=1500;ROOMT.theater.cost=2500;ADDONS.theater=TH_UPS;ADDONS.auditorium=AU_UPS;
/* interface items and permanent buffs: top out within a few days too */
SHOP.forEach(function(it){var e=it[6]||{};if(it[1]==="buff")it[3]=it[3]<=1500?1000:it[3]<=6000?1500:2500;
  else if(!e.gar&&!e.basic&&it[3]>800)it[3]=it[3]<=2000?1000:it[3]<=5000?1500:2500});
LFDS.restaurant.forEach(function(q){if(q.cost)q.cost=q.cost>=10000?1500:600});
/* Cal, 2026-11-05 (docs/PROGRESSION.md): rooms later in the story cost more, since passive income and dungeons pay more by then. */
var ROOMSTEP={garden:1,restaurant:1.25,boba:1.5,dessert:1.75,skybar:2,speakeasy:2,rooftop:2.5,mall:3,theater:3.5,auditorium:3.5,arcade:4.5,rhythm:4.5,vr:4.5,bowling:5,karaoke:5.5,club:6};
Object.keys(ROOMSTEP).forEach(function(k){(ADDONS[k]||[]).forEach(function(a){if(a[2])a[2]=Math.round(a[2]*ROOMSTEP[k]/50)*50})});
/* Cal, 2026-11-05: equipment earns, decor does not. Better kitchen gear means more coins; new art or a nicer table design does
   not. Decor's share of a room's income moves onto its equipment, so a fully upgraded room earns what it did before. A room's
   own data can say {decor:1} or {earn:1} to settle any upgrade this guesses wrong. */
var UPEARN=/^(Kitchen|Menu|Seating|Staff|Money|Counter|Expansion|Snacks|Screen|Projector|Sound|Seats|Plots|Tools|Water|Orchard|Bar)$/,
    UPDECO=/^(Decor|Walls|Floors|Grounds)$/,
    UPSELLN=/\b(cooler|menu|ticket|booth|bar|counter|register|oven|grill|stove|fryer|machine|kiosk|stand|cart|tap|station|press)\b/i,
    UPDECON=/\b(art|painting|poster|mural|vases?|sculpt\w*|sconces?|chandeliers?|neon|sign|plants?|planters?|flowers?|rug|curtains?|frames?|lamps?|lights|lanterns?|garland|mirror|wallpaper|statue|pictures|olive trees?|candles?|disco ball|trophy|trophies)\b/i;
function upIsDecor(a){var e=a[3]||{};if(e.decor)return true;if(e.earn||e.opens)return false;if(UPEARN.test(e.g||"")||UPSELLN.test(a[1]))return false;return UPDECO.test(e.g||"")||UPDECON.test(a[1])}
Object.keys(ADDONS).forEach(function(k){if(!ROOMT[k]||!(ROOMT[k].coin||ROOMT[k].food))return;var L=ADDONS[k]||[],p0=0,p1=0;
  L.forEach(function(a){var e=a[3]||{};p0+=e.p||0;if(!upIsDecor(a))p1+=e.p||0});if(!p0||!p1)return;
  L.forEach(function(a){var e=a[3];if(!e||!e.p)return;e.p=upIsDecor(a)?0:Math.round(e.p*p0/p1*1000)/1000;if(upIsDecor(a))e.decor=1})});
/* ---------- test controls: a small button on every screen. Remove before release. ---------- */
function qbWeek(){window.__qbShift=(window.__qbShift||0)+7*864e5;persist();render();pop("Skipped one week");setTimeout(brandCheck,200)}
function qbReset(){loaded=false;window.__qbShift=0;try{localStorage.removeItem("quest-board")}catch(e){}var go=function(){location.reload()};if(db&&DOC)db.doc(DOC).delete().then(go,go);else go()}
/* a page still open from an older version stops saving as soon as a newer version has saved, so it cannot overwrite that progress */
function qbWatchSave(){if(!db||!DOC||!db.doc(DOC).onSnapshot)return;db.doc(DOC).onSnapshot(function(s){var d=s&&s.exists?s.data():null;if(d&&(+d.appv||0)>APPV&&!newerSeen){newerSeen=true;pop("A new version is out. Reload to keep playing.")}})}
function qbRestore(){if(!db||!MYUID){pop("No backup on this device");return}db.doc("data/users/"+MYUID+"/backup").get().then(function(s){if(!s.exists){pop("No backup yet");return}loaded=false;db.doc(DOC).set(s.data()).then(function(){try{localStorage.removeItem("quest-board")}catch(e){}location.reload()},function(){location.reload()})})}
setTimeout(function(){try{qbWatchSave()}catch(e){}if(window.__qbGuest||document.getElementById("qbt"))return;var d=document.createElement("div");d.id="qbt";d.innerHTML='<div class="qbt-m" hidden><button data-q="w">Skip a week</button><button data-act="simlvl">Level up</button><button data-act="simcoin">Get 10,000 coins</button><button data-q="b">Restore backup</button><button data-q="r">Reset everything</button></div><button class="qbt-t" data-q="t">Test</button>';document.body.appendChild(d);var m=d.querySelector(".qbt-m"),armed=0;
  d.addEventListener("click",function(e){var b=e.target.closest("[data-q]");if(!b)return;var q=b.dataset.q;if(q==="t")m.hidden=!m.hidden;if(q==="w")qbWeek();if(q==="b")qbRestore();if(q==="r"){if(armed)qbReset();else{armed=1;b.textContent="Tap again to wipe it all";setTimeout(function(){armed=0;b.textContent="Reset everything"},4000)}}})},600);
/* Temporary, the owner's device only: how smoothly the game runs on the real phone. Each time the tab changes or a window opens
   or closes, it counts frames for 5 s, then writes the last 16 samples to diag/perf, where Claude can read them. Remove it with
   the phone log (qbFrame) at release. */
var QBPL=[],QBPT=0,QBPK="",QBPB=0;
function qbPerf(why){try{if(QBPB||window.__qbGuest||!db||!ownerView||document.hidden)return;QBPB=1;
  var t0=performance.now(),last=t0,n=0,worst=0,slow=0,long=0,po=null;
  try{po=new PerformanceObserver(function(l){long+=l.getEntries().length});po.observe({entryTypes:["longtask"]})}catch(e){}
  var done=function(){QBPB=0;if(po)po.disconnect();var an=0;try{an=document.getAnimations().filter(function(a){return a.playState==="running"}).length}catch(e){}
    QBPL.push({why:why,tab:view,win:!!document.querySelector("#layer .modal"),fps:+(n/5).toFixed(1),worst:Math.round(worst),slow:slow,long:long,anim:an,nodes:document.getElementsByTagName("*").length,img:document.images.length,t:Date.now()});QBPL=QBPL.slice(-16);
    clearTimeout(QBPT);QBPT=setTimeout(function(){db.doc("diag/perf").set({appv:APPV,ua:navigator.userAgent,dpr:devicePixelRatio,w:innerWidth,h:innerHeight,cores:navigator.hardwareConcurrency||0,mem:navigator.deviceMemory||0,log:JSON.stringify(QBPL)}).catch(function(){})},1500)};
  var f=function(t){n++;var d=t-last;last=t;if(d>worst)worst=d;if(d>50)slow++;if(t-t0<5000)requestAnimationFrame(f);else done()};
  requestAnimationFrame(f)}catch(e){QBPB=0}}
setInterval(function(){if(!loaded)return;var k=view+"|"+!!document.querySelector("#layer .modal");if(k!==QBPK){QBPK=k;qbPerf("change")}},2500);
