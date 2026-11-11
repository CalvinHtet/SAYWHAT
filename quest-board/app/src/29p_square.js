/* ---------- The Town Square (Cal, 2026-11-08: "new additions to the community aspect of the game which allows everyone using this game
   to see each other's characters and interact with them in some way") ----------
   At the top of the Hall: every player's own character, in the outfit they have on now, standing together. Tap one for their card
   and greet them (wave, high five, poke, spank). A greeting reaches every open screen within a second or two: both characters hop and
   the emoji floats up, the player greeted gets a message wherever they are in the app, and a feed under the square shows who greeted whom.
   - No new database rules: players may write only their own docs, so a greeting lives in the sender's pings/<id>.emo = {<to id>:{k,t}},
     beside the visit notes, and pings is already pushed live (29n_live.js). Additive: an old doc simply has no emo.
   - Pays the GIVER SQPAY coins, once per person every SQGAP (Cal, 2026-11-10: "3 coins for each person you give a hug to and
     that resets every 2 hrs"; confirmed in his audit, LEAD 2026-11-11: the person greeted gets no coins, nothing scales with level),
     so it cannot be farmed. The times live in the save (social.sqt).
   - The hop and the float are CSS on one still frame, so no outfit can break in a new pose.
   - Art: ui_town_square.webp replaces the plaza painted in CSS when ROOMS has one Cal approved. Until then it fails softly.
   - In the sandbox (web.js) there is nobody else, so the story's friends stand in and greet back. */
/* W53 (Cal, 2026-11-10: "Just keep 4 greetings. keep the spank in."): exactly these four buttons, no opt-out. Cheer and Hug are gone
   from the buttons; SQOLD only reads them, so a greeting from a phone still on an older version shows in the feed and pays as before. */
var SQK={wave:["\u{1F44B}","Wave","waved at"],five:["\u{1F64C}","High five","high-fived"],poke:["\u{1F449}","Poke","poked"],spank:["\u{1F351}","Spank","spanked"]},SQPAY=3,SQGAP=2*36e5;
var SQOLD={cheer:["\u{1F389}","Cheer","cheered for"],hug:["\u{1F917}","Hug","hugged"]};
function sqKind(k){return (Object.prototype.hasOwnProperty.call(SQK,k)&&SQK[k])||(Object.prototype.hasOwnProperty.call(SQOLD,k)&&SQOLD[k])||null}
var SQ={feed:[],shown:{},lastSend:0,seeded:0};
/* [left %, feet at top %, height px]: the front row first, so a small town fills the front */
var SQSLOTS=[[38,96,104],[62,96,104],[14,96,104],[86,96,104],[26,72,88],[50,72,88],[74,72,88],[14,50,72],[38,50,72],[62,50,72],[86,50,72]];
function sqSandboxOn(){return !!(window.QB_WEB&&QB_WEB.sandbox)}
/* W57 (Cal, 2026-11-10): a green dot by another player's name in the Hall while they have the game open, plus their streak. A phone
   with the game on screen writes its worlds/<id> doc about every 2 minutes (the heartbeat in 30_app_b.js), so a doc written in the
   last 5 minutes counts as online. Both read a hostile doc: the time and the streak are coerced to numbers. */
var PLONLINE=5*60000;
function plOnline(w){var t=+(w&&w.t)||0,now=Date.now();return t>0&&now-t<PLONLINE&&t-now<PLONLINE}
function plDot(w){return plOnline(w)?'<i class="pl-on" title="Online now" aria-label="Online now"></i>':''}
/* Cal (#96): "Streak: 1 day", "Streak: 5 days"; the number is coerced, the doc may be hostile */
function plStreakN(w){var n=Math.floor(+(w&&w.streak)||0);return n>0&&isFinite(n)?Math.min(n,99999):0}
function plStreak(w){var n=plStreakN(w);return n>0?'<small class="pl-sk">Streak: '+Math.min(n,99999)+' day'+(n===1?'':'s')+'</small>':''}
/* when each greeting last paid: sent[<to id>] and got[<from id>] in ms; a pair pays again SQGAP later (older times are dropped) */
function sqPaid(){var o=socState(),P=o.sqt,now=Date.now();if(!P||typeof P!=="object")P=o.sqt={sent:{},got:{}};
  ["sent","got"].forEach(function(k){var m=P[k];if(!m||typeof m!=="object")m=P[k]={};Object.keys(m).forEach(function(u){if(!(now-(+m[u]||0)<SQGAP))delete m[u]})});
  return P}
function sqHm(t){try{return new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}catch(e){return ""}}
function sqPlayers(){var me={id:MYUID,name:(S.char&&S.char.name)||"You",look:lookOf(),t:Date.now(),me:1};
  return [me].concat(SOC.worlds.filter(function(w){return w&&w.look&&w.look.rig}))}
function sqNear(p){return !!p.me||Date.now()-(p.t||0)<15*60000}
function sqName(id,fallback){if(id===MYUID)return (S.char&&S.char.name)||"You";var w=SOC.worlds.filter(function(x){return x.id===id})[0];return (w&&w.name)||fallback||"Someone"}
function sqSig(){return JSON.stringify(sqPlayers().slice(0,SQSLOTS.length).map(function(p){return [p.id,p.name,p.look,sqNear(p)]}))+"|"+sqPlayers().length}
function sqStage(){var all=sqPlayers(),art=window.QBART&&QBART["ui_town_square.webp"];
  return '<div class="sq-stage'+(art?' has-art':'')+'"'+(art?' style="background-image:url('+art+')"':'')+'>'+all.slice(0,SQSLOTS.length).map(function(p,i){var s=SQSLOTS[i],near=sqNear(p);
    return '<button class="sq-p'+(p.me?' me':'')+(near?'':' away')+'" data-act="sqtap" data-u="'+esc(p.id)+'" style="left:'+s[0]+'%;top:'+s[1]+'%;z-index:'+s[1]+'" aria-label="'+esc(p.name)+'">'+calImg(p.look,"still",s[2],"")+'<span class="sq-n">'+(plOnline(p)&&!p.me?'<i class="sq-on"></i>':'')+esc(p.me?p.name+" (you)":p.name)+'</span></button>'}).join("")+'</div>'
    +(all.length>SQSLOTS.length?'<p class="note">+'+(all.length-SQSLOTS.length)+' more under Neighbors.</p>':'')}
function sqFeed(){return '<div class="sq-feed">'+(SQ.feed.length?SQ.feed.slice(0,5).map(function(e){return '<div class="sq-f"><b>'+esc(sqName(e.from,e.fromName))+'</b> <span>'+sqKind(e.k)[0]+'</span> <b>'+esc(sqName(e.to))+'</b><small>'+socAgo(e.t)+'</small></div>'}).join(""):'<p class="note">Tap someone to say hi.</p>')+'</div>'}
function sqInner(){return '<h3 class="label">Town square</h3>'+sqStage()+sqFeed()}
function sqHtml(){if(!socOn())return "";sqSeed();return '<section class="card panel sq" id="sqbox" data-sig="'+esc(sqSig())+'">'+sqInner()+'</section>'}
function sqPaint(){var el=document.getElementById("sqbox");if(!el||!socOn())return;var sig=sqSig();
  if(el.dataset.sig!==sig){el.dataset.sig=sig;el.innerHTML=sqInner()}else{var f=el.querySelector(".sq-feed");if(f)f.outerHTML=sqFeed()}
  sqFx()}
/* the two characters hop and the emoji floats up from the one being greeted */
function sqPlay(from,to,k){[from,to].forEach(function(u){var p=document.querySelector('#sqbox .sq-p[data-u="'+CSS.escape(u)+'"]');if(!p)return;p.classList.remove("hop");void p.offsetWidth;p.classList.add("hop");setTimeout(function(){p.classList.remove("hop")},1700)});
  var t=document.querySelector('#sqbox .sq-p[data-u="'+CSS.escape(to)+'"]'),st=document.querySelector("#sqbox .sq-stage");if(!t||!st||!sqKind(k))return;
  var e=document.createElement("span");e.className="sq-e";e.textContent=sqKind(k)[0];e.style.left=t.style.left;e.style.top="calc("+t.style.top+" - "+(t.offsetHeight+4)+"px)";st.appendChild(e);setTimeout(function(){e.remove()},2500)}
function sqFx(){var now=Date.now();SQ.feed.forEach(function(e){var key=e.from+"|"+e.to+"|"+e.t;if(SQ.shown[key])return;SQ.shown[key]=1;if(now-e.t<20000)sqPlay(e.from,e.to,e.k)})}
/* everyone's greetings from the last day: the feed, and any addressed to this player */
async function sqScan(){if(!socOn())return;var q=await db.collection("pings").limit(200).get(),all=[],now=Date.now();
  (q.docs||[]).forEach(function(d){var x=d.data(),m=x&&x.emo;if(!m||typeof m!=="object")return;
    Object.keys(m).forEach(function(to){var e=m[to];if(!e||!sqKind(e.k)||now-(+e.t||0)>864e5)return;all.push({from:d.id,fromName:x.fromName||"Neighbor",to:to,k:e.k,t:+e.t})})});
  all.sort(function(a,b){return b.t-a.t});SQ.feed=all.slice(0,8);
  var o=socState(),seen=o.sqSeen||(o.sqSeen={}),P=sqPaid(),got=[];
  all.forEach(function(e){if(e.to!==MYUID||(seen[e.from]||0)>=e.t)return;seen[e.from]=e.t;var pay=0;/* the greeted player gets the message, no coins (Cal's audit) */got.push({e:e,pay:pay})});
  if(!got.length)return;persist();got.forEach(function(g,i){setTimeout(function(){pop(sqName(g.e.from,g.e.fromName)+" "+sqKind(g.e.k)[2]+" you "+sqKind(g.e.k)[0]+(g.pay?"  +"+g.pay+" coins":""))},i*2400)})}
function sqSeed(){if(!sqSandboxOn()||SQ.seeded||!S.created||typeof FRIENDS==="undefined"||!(window.QBLoft&&QBLoft.data&&QBLoft.data.items))return;SQ.seeded=1;
  Object.keys(FRIENDS).slice(0,6).forEach(function(k,i){var f=FRIENDS[k];db.doc("worlds/sb_"+k).set({name:f.name,look:f.look,lv:8+i*3,streak:i*2,cls:"",rooms:[],crew:i,served:i*12,t:Date.now()-i*6*60000,appv:APPV})})}
function sqCard(uid){if(uid===MYUID){pop("That's you. Looking good.");return}
  var w=SOC.worlds.filter(function(x){return x.id===uid})[0];if(!w||!w.look)return;closeModals();var paid=+sqPaid().sent[uid]||0,rooms=(w.rooms||[]).filter(Boolean).length;
  modal('<div class="card box2 sq-card"><div class="sq-big">'+calImg(w.look,"idle",200,"")+'</div><h2>'+esc(w.name)+plDot(w)+'</h2><small class="mono">Lv '+(w.lv||1)+' · '+rooms+' room'+(rooms===1?'':'s')+' · Streak: '+plStreakN(w)+' day'+(plStreakN(w)===1?'':'s')+' · '+socAgo(w.t||0)+'</small>'
    +'<div class="sq-acts">'+Object.keys(SQK).map(function(k){return '<button class="btn" data-act="sqgo" data-u="'+esc(uid)+'" data-k="'+k+'"><span>'+SQK[k][0]+'</span> '+SQK[k][1]+'</button>'}).join("")+'</div>'
    +'<p class="note">'+(paid?'You earned '+SQPAY+' coins for greeting '+esc(w.name)+' at '+sqHm(paid)+'. Greeting them pays again from '+sqHm(paid+SQGAP)+'.':'Greeting someone pays you '+SQPAY+' coins, once every 2 hours for each person.')+'</p>'
    +'<div class="row"><button class="btn ghost" data-act="mclose">Close</button></div></div>')}
function sqSend(uid,k){if(!socOn()||!Object.prototype.hasOwnProperty.call(SQK,k))return;var w=SOC.worlds.filter(function(x){return x.id===uid})[0];if(!w)return;var t=Date.now();if(t-SQ.lastSend<2500){pop("One at a time");return}SQ.lastSend=t;closeModals();
  SQ.shown[MYUID+"|"+uid+"|"+t]=1;SQ.feed.unshift({from:MYUID,fromName:(S.char&&S.char.name)||"Neighbor",to:uid,k:k,t:t});sqPaint();sqPlay(MYUID,uid,k);
  socMine("pings",function(d){var m=d.emo&&typeof d.emo==="object"?d.emo:{},cut=t-14*864e5;Object.keys(m).forEach(function(x){if(!m[x]||(m[x].t||0)<cut)delete m[x]});m[uid]={k:k,t:t};d.emo=m})
    .then(function(){var P=sqPaid(),first=!P.sent[uid];if(first){P.sent[uid]=t;S.coins+=SQPAY;S.earnedC+=SQPAY;persist()}pop("You "+SQK[k][2]+" "+w.name+(first?"  +"+SQPAY+" coins":""))})
    .catch(function(er){pop("Could not send: "+((er&&er.code)||"error"))});
  if(sqSandboxOn()&&uid.indexOf("sb_")===0)setTimeout(function(){var m={};m[MYUID]={k:k,t:Date.now()};db.doc("pings/"+uid).set({name:w.name,fromName:w.name,emo:m,t:Date.now()})},2200)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=sqtap],[data-act=sqgo]");if(!b)return;if(b.dataset.act==="sqtap")sqCard(b.dataset.u);else sqSend(b.dataset.u,b.dataset.k)});
var sqPingsBase=socCheckPings;
socCheckPings=async function(){var r=await sqPingsBase.apply(this,arguments);try{await sqScan()}catch(e){}return r};
var sqPaintBase=socPaint;
socPaint=function(){var r=sqPaintBase.apply(this,arguments);try{sqPaint()}catch(e){}return r};
var sqHallBase=hallHtml;
hallHtml=function(){return sqHtml()+sqHallBase()};
