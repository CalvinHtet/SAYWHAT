/* ---------- Live sync (Cal, 2026-11-07: "There's only going to be about 10 people playing. I need this to work with 10 ppl and
   have everything synced perfectly so we can all see each others progress") ----------
   Before this, a player's progress went up every 90 s to 2 min and everyone else's came down every 20 s (Hall open) or 60 s.
   Now:
   - Up: a few seconds after anything changes (a quest, a level, an upgrade, a new outfit), this player's worlds/<id> doc is
     written, but only when what others see actually changed, so a quiet session writes nothing.
   - Down: the database pushes changes to worlds, board and pings as they happen (onSnapshot). Any push re-reads the
     neighborhood (socLoad: neighbors, posts, reactions, visit notes), at most once a second, so with ten players a change
     shows on every open screen within a second or two.
   - Back: a tab coming back from the background, or the network coming back, reloads at once and re-subscribes if the
     database dropped a subscription. If this database cannot push at all, the old polling keeps working as before. */
var LIVE={subs:[],on:0,lastErr:"",pend:0,timer:0,pubT:0,pubJson:"",retry:0};
/* what others see of this player, without the timestamp, to tell whether anything changed */
function liveShape(d){var c=Object.assign({},d);delete c.t;return JSON.stringify(c)}
function livePublish(){if(!socOn()||!S||!S.created||!loaded)return;var d;try{d=socWorldDoc()}catch(e){return}var j=liveShape(d);if(j===LIVE.pubJson)return;
  LIVE.pubJson=j;SOC.lastPub=Date.now();
  try{db.doc("worlds/"+MYUID).set(d).catch(function(e){LIVE.pubJson="";SOC.err=(e&&e.code)||"error"})}catch(e){LIVE.pubJson=""}}
function liveQueuePub(){if(!socOn())return;clearTimeout(LIVE.pubT);LIVE.pubT=setTimeout(livePublish,4000)}
/* the old 90 s publish stays as a heartbeat (it keeps "seen 2m ago" true); a forced one also resets what was sent */
var liveSocPublishBase=socPublish;
socPublish=function(force){var before=SOC.lastPub;liveSocPublishBase(force);if(SOC.lastPub!==before){try{LIVE.pubJson=liveShape(socWorldDoc())}catch(e){}}};
var livePersistBase=persist;
persist=function(){var r=livePersistBase.apply(this,arguments);try{liveQueuePub()}catch(e){}return r};
/* a push: re-read the neighborhood, at most once a second, and again right after if another push came in meanwhile */
function liveKick(){if(LIVE.timer){LIVE.pend=1;return}LIVE.timer=setTimeout(async function(){LIVE.timer=0;
    if(SOC.busy){LIVE.pend=1}else{LIVE.pend=0;try{await socLoad()}catch(e){}}
    if(LIVE.pend){LIVE.pend=0;liveKick()}},1000)}
function liveStop(){LIVE.subs.forEach(function(u){try{u()}catch(e){}});LIVE.subs=[];LIVE.on=0}
function liveStart(){if(!socOn()||LIVE.on)return;var ok=0;liveStop();
  ["worlds","board","pings"].forEach(function(c){try{var ref=db.collection(c);if(!ref||typeof ref.onSnapshot!=="function")return;
      var u=ref.onSnapshot(function(){liveKick()},function(e){LIVE.lastErr=(e&&e.code)||"error";LIVE.on=0;clearTimeout(LIVE.retry);LIVE.retry=setTimeout(liveStart,30000)});
      if(typeof u==="function"){LIVE.subs.push(u);ok++}}catch(e){LIVE.lastErr=(e&&e.code)||String(e)}});
  /* some collections pushing and some not is fine: the polls in 29g_town.js cover the rest */LIVE.on=ok?1:0}
/* catch up the moment the player comes back */
function liveWake(){if(!socOn()||document.hidden)return;if(!LIVE.on)liveStart();SOC.loaded=0;liveKick();try{livePublish()}catch(e){}}
document.addEventListener("visibilitychange",liveWake);
window.addEventListener("online",function(){LIVE.on=0;liveWake()});
window.addEventListener("focus",liveWake);
/* start once the save and the player id are in */
(function liveBoot(){if(socOn()&&loaded&&S&&S.created){liveStart();liveKick();liveQueuePub();return}setTimeout(liveBoot,1500)})();
/* the 20 s and 60 s polls in 29g_town.js keep running underneath: with ten players they cost little and cover a dropped push */
window.__qbLive={soc:function(){return {worlds:SOC.worlds.map(function(w){return {id:w.id,lv:w.lv,streak:w.streak,rooms:(w.rooms||[]).filter(Boolean).length,ups:(w.rooms||[]).reduce(function(a,r){return a+(r?Object.keys(r.a||{}).length:0)},0)}}),posts:SOC.posts.map(function(p){return p.text}),vis:socState().vis.map(function(v){return v.name})}},state:function(){return {on:LIVE.on,subs:LIVE.subs.length,err:LIVE.lastErr,pub:LIVE.pubJson?JSON.parse(LIVE.pubJson):null}},kick:liveKick,publish:livePublish,start:liveStart};
