/* ---------- Cal's 2026-11-23 Town Hall ----------
   Cal: "Also add the socials tab to the town hall as a tab next to chat. Add room 3 to the chat. Posts, Chat, and Players. Then the players
   tab will show a list of the current players organized by levels. You can click on each player to wave, fist bump, high five, which
   gives each other coins. The other players also occassionally show up in our buildings and rooms and they might eat at a restaurant or
   watch a movie in the cinema sometimes (keep this sparse because there is already lots of NPCs)."
   - The Town Hall has three tabs: Posts, Chat, Players. Players is the ranking that was its own bottom tab (29u_style.js fshHtml): it opens
     on Highest level, with Most rich and (once it opens) Fashion beside it, and the Town square and Neighbors folds under it. Tap a
     player for their card: Wave, Fist bump, High five. The bottom tab goes; the Hall is where players are.
   - Chat has Room 3 again (29zz_v109.js had cut it to two).
   - A greeting pays both sides: the sender as before (once per person, 29p_square.js), and now the one greeted, SQPAY once per sender
     every 2 hours (S.social.sqt.got), when their game sees it.
   - Other players visiting: already in (29kv_visitors.js): 0 to 3 a day, at most one in a room, taking a free table or seat (a dinner, a
     film, a drink) or looking around, with their name over them. Unchanged, so it stays sparse. */

/* ---- the tabs ---- */
if(!HTAB.tabs.some(function(t){return t[0]==="style"}))HTAB.tabs.push(["style","Players"]);
(function(){try{var t=sessionStorage.getItem("qbHallTab");if(t==="style")HTAB.tab=t}catch(e){}
  try{if(!sessionStorage.getItem("qbStyleMode"))FSH.mode="level"}catch(e){FSH.mode="level"}})();
htabCss("qb-hall3-css",".htab{grid-template-columns:repeat(3,1fr)!important}");
NAVHIDE.players=1;
var v37Shown=htabShown;htabShown=function(t){if(t==="style"&&view==="hall")return HTAB.tab==="style"&&loaded&&S&&S.created&&!ccEdit&&!!document.getElementById("fshbox");return v37Shown.apply(this,arguments)};
/* anything that sent the player to the old Players tab goes to the Hall's */
var v37View=viewHtml;viewHtml=function(v){if(v==="players"){view="hall";htabSet("style");return v37View.call(this,"hall")}return v37View.apply(this,arguments)};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="nav"][data-v="players"]');if(!b)return;htabSet("style")},true);

/* ---- Chat: Room 3 ---- */
if(!TCHROOMS.some(function(r){return r[0]===3}))TCHROOMS.push([3,"Room 3"]);

/* ---- greetings pay the one greeted too ---- */
function v37Got(){var P=sqPaid();if(!P.got||typeof P.got!=="object")P.got={};return P.got}
sqScan=async function(){if(!socOn())return;var q=await db.collection("pings").limit(200).get(),all=[],now=Date.now();
  (q.docs||[]).forEach(function(d){var x=d.data(),m=x&&x.emo;if(!m||typeof m!=="object")return;
    Object.keys(m).forEach(function(to){var e=m[to];if(!e||!sqKind(e.k)||now-(+e.t||0)>864e5)return;all.push({from:d.id,fromName:x.fromName||"Neighbor",to:to,k:e.k,t:+e.t})})});
  all.sort(function(a,b){return b.t-a.t});SQ.feed=all.slice(0,8);
  var o=socState(),seen=o.sqSeen||(o.sqSeen={}),G=v37Got(),got=[];
  all.forEach(function(e){if(e.to!==MYUID||e.from===MYUID||(seen[e.from]||0)>=e.t)return;seen[e.from]=e.t;var pay=0;
    if(now-(+G[e.from]||0)>=SQGAP){pay=SQPAY;G[e.from]=now;S.coins+=pay;S.earnedC+=pay}got.push({e:e,pay:pay})});
  if(!got.length)return;persist();got.forEach(function(g,i){setTimeout(function(){pop(sqName(g.e.from,g.e.fromName)+" "+sqKind(g.e.k)[2]+" you "+sqKind(g.e.k)[0]+(g.pay?"  +"+g.pay+" coins":""))},i*2400)})};

/* the fashion warning's "Vote now" (29zz_v135.js) opens the Hall's Players tab */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=v35fsh]");if(!b)return;e.stopImmediatePropagation();try{closeModals()}catch(x){}FSH.mode="fashion";htabSet("style");view="hall";render();window.scrollTo(0,0)},true);
