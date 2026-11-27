/* ---------- Cal 2026-11-26: notices for new town posts and bounties about to run out ----------
   Cal (idea 9, yes): notifications for town hall posts and bounties about to expire.
   - A new post on the town board by someone else puts a "!" on the Town tab until the Posts tab is opened. The board is asked for its
     newest post every 3 minutes while the game is open (one small read).
   - A running bounty with under 8 hours left says so once ("Hydration Check ends in 2 hours"), at launch or while playing.
   - Phone notifications: the profile has "Notifications: off/on" beside Sound. Switched on (the phone asks once), the same two notices
     also come as a notification while the game is open in the background. A notification to a closed app needs a server to send it;
     that part waits on Cal (APPROVALS). Nothing is ever sent from a Live phone to anyone else. */
var V93H=8*3600e3,/* Cal 11-26 (APPROVALS): "Give an 8 hr heads up before a bounty ends rather than a 3 hr" */V93POLL=180e3,V93NEW=0,V93LAST=0;
function v93St(){if(!S.v93||typeof S.v93!=="object")S.v93={seen:0,b:{}};if(!S.v93.b||typeof S.v93.b!=="object")S.v93.b={};return S.v93}
function v93Perm(){try{return typeof Notification!=="undefined"&&Notification.permission==="granted"&&!!S.ntfOn}catch(e){return false}}
/* a phone notification, only while the game is in the background (in front, the game shows its own notice) */
function v93Note(title,body,tag){try{if(!v93Perm()||!document.hidden)return;var o={body:body,tag:tag,icon:"icons/icon-192.png",badge:"icons/icon-192.png"};
    if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(function(r){r.showNotification(title,o)}).catch(function(){try{new Notification(title,o)}catch(e){}});
    else new Notification(title,o)}catch(e){}}
/* ---- the town board ---- */
function v93Poll(){try{if(!loaded||!S||!S.created||typeof db==="undefined"||!db||typeof socOn!=="function"||!socOn())return;if(Date.now()-V93LAST<V93POLL-2000)return;V93LAST=Date.now();
    var col=db.collection("photos");if(typeof col.latest!=="function")return;
    col.latest(1).get().then(function(q){var d=q&&q.docs&&q.docs[0];if(!d)return;var x=d.data()||{},t=+x.t||0,o=v93St();if(!o.seen){o.seen=t;persist();return}
      if(t>o.seen&&x.u!==MYUID){if(!V93NEW){V93NEW=t;try{alPaint()}catch(e){}v93Note("New on the town board",String(x.name||"Someone").slice(0,24)+" posted a photo.","qb-town")}V93NEW=Math.max(V93NEW,t)}}).catch(function(){})}catch(e){}}
function v93HallSeen(){try{if(view==="hall"&&typeof HTAB!=="undefined"&&HTAB.tab==="posts"){var o=v93St(),t=Math.max(V93NEW,(PH&&PH.posts&&PH.posts[0]&&PH.posts[0].t)||0);if(t>o.seen){o.seen=t;persist()}if(V93NEW){V93NEW=0;try{alPaint()}catch(e){}}}}catch(e){}}
var v93Tabs=alTabs;alTabs=function(){var t=v93Tabs.apply(this,arguments);try{if(V93NEW&&!areaGate("hall"))t.hall=1}catch(e){}return t};
/* ---- bounties ---- */
function v93Bty(){try{if(!loaded||!S||!S.created||!S.bq||!S.bq.act)return;var o=v93St(),now=Date.now(),ch=0;
    Object.keys(S.bq.act).forEach(function(k){var b=S.bq.act[k];if(!b||b.done||!b.end)return;var left=b.end-now,key=k+":"+b.end;if(left<=0||left>V93H||o.b[key])return;
      o.b[key]=1;ch=1;var h=Math.max(1,Math.round(left/3600e3)),msg=(b.n||"Your bounty")+" ends in "+(left<3600e3?"under an hour":h+" hour"+(h>1?"s":""))+".";
      try{pop(msg)}catch(e){}v93Note("A bounty is running out",msg,"qb-bty-"+k)});
    Object.keys(o.b).forEach(function(key){var e=+key.split(":")[1];if(e&&e<now-864e5){delete o.b[key];ch=1}});if(ch)persist()}catch(e){}}
setInterval(function(){v93Poll();v93Bty();v93HallSeen()},15000);setTimeout(function(){v93Poll();v93Bty()},6000);
var v93Render=render;render=function(){var r=v93Render.apply(this,arguments);v93HallSeen();return r};
/* ---- the switch, beside Sound in the profile ---- */
function v93Btn(){var on=v93Perm();return '<button class="btn ghost v93tog" data-v93="tog" aria-pressed="'+on+'">Notifications: '+(on?'on':'off')+'</button>'}
var v93Char=charModal;charModal=function(){var m=v93Char.apply(this,arguments);
  try{if(typeof Notification==="undefined")return m;var host=document.querySelector("#layer .prof .v61btns")||document.querySelector("#layer .prof .sndtog");if(host&&!document.querySelector("#layer .v93tog")){if(host.classList&&host.classList.contains("v61btns"))host.insertAdjacentHTML("beforeend",v93Btn());else host.insertAdjacentHTML("afterend",v93Btn())}}catch(e){}return m};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-v93="tog"]');if(!b)return;e.preventDefault();e.stopPropagation();
  if(v93Perm()){S.ntfOn=0;persist();b.outerHTML=v93Btn();pop("Notifications off");return}
  if(Notification.permission==="denied"){pop("Notifications are blocked for this site in your phone's settings.");return}
  Promise.resolve(Notification.requestPermission()).then(function(p){if(p==="granted"){S.ntfOn=1;persist();pop("Notifications on")}else pop("Notifications stay off");var c=document.querySelector("#layer .v93tog");if(c)c.outerHTML=v93Btn()})},true);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV193={st:v93St,bty:v93Bty,poll:function(){V93LAST=0;v93Poll()},newT:function(){return V93NEW},setNew:function(t){V93NEW=t;try{alPaint()}catch(e){}},seen:v93HallSeen};
