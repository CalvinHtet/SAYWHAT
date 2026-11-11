/* ---------- w-ui92 (v0.92): W58 the Board shortest first, W59 the quest toast at the top, W60 the next room's own window ---------- */

/* W58 (Cal, 2026-11-10): "the Board sorted shortest task first". Each quest carries q.mins, its estimated minutes: the brain dump's
   AI returns it (PARSE, 30_app_b.js); without it (the offline split, the inbox, a bounty, a quest from an older save) it is estimated
   once from the quest's words, then its XP, and kept on the quest. The Board lists open quests shortest first inside each category
   (boardHtml) and shows "~10 min" in grey on each card. */
var QMKW=[
  [/\b(move|moving|taxes|tax return|renovat\w*|garage|attic|road trip)\b/,180],
  [/\b(deep clean\w*|spring clean\w*|edit\w*|film\w*|shoot\w*|record\w*|produc\w*|mixing|master\w*|studio|hike|hiking)\b/,120],
  [/\b(gym|workout|work out|lift\w*|swim\w*|class|groceries|grocery|errands?|meal prep|assembl\w*|put together)\b/,60],
  [/\b(laundry|clean\w*|cook\w*|run|running|jog\w*|walk\w*|yoga|stretch\w*|vacuum\w*|mop\w*|study\w*|read\w*|practi[cs]e\w*)\b/,30],
  [/\b(dishes|shower\w*|tidy\w*|sweep\w*|organi[sz]e\w*|iron\w*|fold\w*|wash\w*|shave|call\w*)\b/,15],
  [/\b(e-?mails?|reply|replies|text\w*|message\w*|pay\w*|book\w*|order\w*|schedule\w*|post\w*|send\w*|check\w*|feed\w*|trash|mail|bed|teeth|floss\w*|meds|medicine|vitamins?|pills?|water\w*|skincare)\b/,5]];
/* a minutes value to keep: a whole number from 1 to a day, else 0 */
function qMinOk(v){v=Math.round(+v);return v>=1&&v<=1440?v:0}
function qMinEst(q){var s=String((q&&q.name)||"").toLowerCase(),m,x=+(q&&q.xp)||25,k=0;
  if(q&&q.bty)return q.bty.k>=2?120:30;/* a bounty: under an hour today, or a few hours over two days (29f_bounty.js; an old 3-day one too) */
  if((m=s.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/)))return qMinOk(+m[1]*60)||60;
  if((m=s.match(/(\d+)\s*(?:min|mins|minute|minutes)\b/)))return qMinOk(m[1])||30;
  for(var i=0;i<QMKW.length&&!k;i++)if(QMKW[i][0].test(s))k=QMKW[i][1];
  /* the XP scale the AI scores on (PARSE): 5 under 5 minutes, 10 under 15, 25 up to an hour, 50 one to three hours, 75 several, 100 a day */
  var b=x<=5?[1,5,5]:x<=10?[5,15,10]:x<=25?[15,60,30]:x<=50?[60,180,90]:x<=75?[120,360,180]:[240,600,300];
  return k?Math.max(b[0],Math.min(b[1],k)):b[2]}
/* a quest's minutes, estimated and kept the first time it is asked for */
function qMin(q){var m=qMinOk(q&&q.mins);if(!m&&q){m=qMinEst(q);q.mins=m}return m||30}
function qMinTxt(m){if(m<60)return "~"+(m<=10?m:Math.round(m/5)*5)+" min";var h=Math.round(m/30)/2;return "~"+h+" h"}
/* shortest first; equal times keep their order */
function qByMin(list){return list.map(function(q,i){return [q,i,qMin(q)]}).sort(function(a,b){return a[2]-b[2]||a[1]-b[1]}).map(function(x){return x[0]})}

/* W59 (Cal, 2026-11-10: "make the amount of experience and coins earned and streak percentage popup whenever you finish a quest appear
   at the top of the screen in a more compact text box and make it last 3 seconds and slowly fade out"). A small box under the
   header: "+45 XP  +270 coins", and under it at most three bonuses ("Streak +12%  On a roll +25%"). 3 s, then a 1 s fade; a new one
   replaces the open one. It sits below the coins and the envelope (and follows them while the page scrolls), never over them, and it
   lets taps through. Every other message still uses pop() at the bottom. */
var QT=null;
function qtFmt(t){if(t==="CRITICAL HIT")return "Critical hit";if(/^Rested \+\d+$/.test(t))return t+" XP";
  return t.replace(/ x(1\.\d+)$/,function(m,v){return " +"+Math.round((+v-1)*100)+"%"})}
function qtBonus(roll,tags){var big=/^(CRITICAL HIT|Verified|Bounty|Streak)/,by=function(re){return tags.filter(function(t){return re.test(t)}).map(qtFmt)};
  return [].concat(by(/^CRITICAL HIT/),by(/^Verified/),by(/^Bounty/),by(/^Streak/),roll>1?["On a roll +"+Math.round((roll-1)*100)+"%"]:[],
    tags.filter(function(t){return !big.test(t)}).map(qtFmt)).slice(0,3)}
/* under whatever header is on screen: the Board's strip, the Shop's head, a coin count or the envelope near the top */
function qtPlace(el){var y=0,H=innerHeight;
  [].forEach.call(document.querySelectorAll("#app .strip,#app .qs-head,#app .coinlive,#app .ibbtn"),function(e){var r=e.getBoundingClientRect();if(r.width&&r.bottom>0&&r.top<H*.4)y=Math.max(y,r.bottom)});
  el.style.setProperty("--qty",Math.round(y+8)+"px")}
function qToast(xp,cn,roll,tags){
  try{if(QT){clearTimeout(QT.t1);clearTimeout(QT.t2);removeEventListener("scroll",QT.on);QT.el.remove();QT=null}
    var b=qtBonus(roll||1,tags||[]),el=document.createElement("div");el.className="qtoast";el.setAttribute("role","status");
    el.innerHTML='<b><span>+'+Number(xp).toLocaleString()+' XP</span> <span>+'+Number(cn).toLocaleString()+' coins</span></b>'+(b.length?'<small>'+b.map(function(t){return '<span>'+esc(t)+'</span>'}).join(" ")+'</small>':'');
    document.getElementById("layer").appendChild(el);
    var on=function(){if(el.isConnected)qtPlace(el)};on();requestAnimationFrame(on);addEventListener("scroll",on,{passive:true});
    var me={el:el,on:on};me.t1=setTimeout(function(){el.classList.add("out")},3000);
    me.t2=setTimeout(function(){removeEventListener("scroll",on);el.remove();if(QT===me)QT=null},4050);QT=me;
  }catch(e){pop("+"+xp+" XP  +"+cn+" coins")}}

/* W60 (Cal, 2026-11-10: "in the building view, clicking on the + icon for the next room upgrade should have a separate screen for that
   upgrade rather than it leading back to the room that you can purchase that upgrade from. So you should have the option to upgrade
   from the building view or the room view"). The "+" on a new room's spot (29o_alerts.js alPlus, data-lf "open:slot:id:room") and the
   marker on an empty lot (26_world.js lotHtml, data-lf "lot:room") open this window (20_loft.js lfBind calls nxTap):
   - ready: the room's picture (or a drawing of it), the upgrade's or the lot's name, its line, the coins, Buy (the room window's own
     purchase, baseAct raddon, or the lot's, baseAct rdo, so prices, refunds and Goals are the same), and for an upgrade "See the
     <room>", today's way to its room window. After a buy the player stays in the building view, with the new room's splash.
   - not ready yet: "?" and what to do (unlockLine, the same lines as the room window's mystery card, no totals); no name, no picture. */
function nxTap(q){if(q[0]==="lot")nxModal({room:q[1],lot:1});else nxModal({room:q[3],slot:+q[1],aid:q[2]})}
function nxReady(o){try{if(o.lot)return lotsOpen().indexOf(o.room)>=0&&effLvl()>=ROOMT[o.room].lv;
  return alOpeners().some(function(x){return x.room===o.room&&x.slot===o.slot&&x.id===o.aid})}catch(e){return false}}
/* what the new room waits for: [met, text, bar 0-1], naming only what the player has */
function nxLines(o,r,a){var L=[],e=(a&&a[3])||{},u=null;try{u=unlockLine(o.room)}catch(x){}
  if(u)L.push([!!u[1],u[2],u[3]]);
  if(a&&r){var pre=ADDREQ[a[0]];if(pre&&!(r.a&&r.a[pre]))L.push([false,"Install "+addonName(r,pre)+" first"]);
    if(e.also&&!(r.a&&r.a[e.also]))L.push([false,"Install "+addonName(r,e.also)+" first"]);
    if(e.served&&(S.base.served||0)<e.served)L.push([false,"Dishes served: "+Math.floor(S.base.served||0).toLocaleString(),Math.min(1,(S.base.served||0)/e.served)]);
    if(e.trophy&&typeof dgPieces==="function"&&!dgPieces())L.push([false,"Bring home your first trophy from a dungeon crawl"])}
  if(!L.length)L.push([false,"Keep growing your business"]);else if(L.every(function(x){return x[0]}))L.push([false,"Something new is waiting"]);
  return L}
function nxModal(o){var k=o.room,T=ROOMT[k];if(!T||hasRoom(k)){render();return}
  closeModals();
  var src=o.lot?null:bslot(o.slot),a=src&&(ADDONS[src.t]||[]).filter(function(x){return x[0]===o.aid})[0],ready=nxReady(o)&&(o.lot||!!a);
  var see=src?'<button class="btn ghost" data-act="nxsee" data-i="'+o.slot+'">See the '+esc(rmName(src.t))+'</button>':'',h;
  if(!ready){
    h='<div class="card box2 nxm"><span class="label">New room</span><h2 class="rm-title">? ? ?</h2><div class="nxpic nxq" aria-hidden="true">?</div>'
      +'<p class="note">Not yet. To open it:</p><span class="stytr nxlines">'+nxLines(o,src,a).map(function(x){return '<span'+(x[0]?' class="ok">✓ ':'>')+esc(x[1])+(x[2]!=null&&!x[0]?'<i class="stybar"><i style="width:'+Math.round(x[2]*100)+'%"></i></i>':'')+'</span>'}).join("")+'</span>'
      +'<div class="nxbtns">'+see+'<button class="btn ghost" data-act="mclose">Close</button></div></div>'}
  else{var price=o.lot?T.cost:a[2],art=ART["room_"+k],can=S.coins>=price,pr='<i class="coin"></i>&nbsp;'+price.toLocaleString();
    h='<div class="card box2 nxm"><span class="label">New room</span><div class="rm-head"><h2 class="rm-title">'+esc(o.lot?T.name:a[1])+'</h2>'+(typeof coinBar==="function"?coinBar():'')+'</div>'
      +'<div class="bpart nxpic'+(art?' post':'')+'">'+(art?'<img class="rpost" src="'+art+'" alt="">':lfPreview({t:k,a:{},st:0},95))+'</div>'
      +'<p class="note">'+esc(o.lot?T.desc:a[4])+'</p>'
      +'<div class="nxbtns"><button class="btn'+(can?'':' ghost')+'" data-act="nxbuy" '+(o.lot?'data-t="'+k+'"':'data-i="'+o.slot+'" data-id="'+a[0]+'"')+'>'+(can?'Buy &middot; '+pr:pr+' &middot; need '+(price-S.coins).toLocaleString()+' more')+'</button>'
      +see+'<button class="btn ghost" data-act="mclose">Close</button></div></div>'}
  modal(h)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=nxbuy],[data-act=nxsee]");if(!b)return;
  if(b.dataset.act==="nxsee"){roomModal(+b.dataset.i);return}
  if(b.dataset.t){baseAct("rdo",{dataset:{i:S.base.slots.length,t:b.dataset.t}},e);return}
  var i=+b.dataset.i,r=bslot(i),id=b.dataset.id;if(!r)return;baseAct("raddon",{dataset:{i:i,id:id}},e);
  /* bought: the purchase opened the room it came from (with its install box); the player asked from the building view, so that
     window closes again and the building shows the new room, under its splash */
  if(r.a&&r.a[id]){var m=document.querySelector("#layer .rmodal");if(m){try{lfPvStop()}catch(x){}m.closest(".modal").remove()}}});
