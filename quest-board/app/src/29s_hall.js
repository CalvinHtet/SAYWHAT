/* ---------- The Town Hall in three tabs: Posts | Chat | Style (Cal, 2026-11-09) ----------
   Cal: "Town Hall = three tabs: Posts (achievements, challenges, updates), Chat (3 public live rooms, people count per room),
   Style" (characters and outfits, likes, a pedestal and a leaderboard). docs/TOWNHALL.md has the whole design.
   Where everything that was in the Hall went (nothing was removed):
   - Posts: the feed from hallPostsHtml() when that file is in the build, then the town hall card, the town meter and the Town
     board (posts, reactions, "new" tags, as before), then the Class Hall (class, skills, advancement ladder, story chapters).
   - Chat: 29t_chat.js.
   - Style: 29u_style.js. The Town square (greetings) and the Neighbors list (Visit, Say hi) fold out at the bottom of it.
   The tab picked is kept for the session, so coming back to the Hall opens where the player left it.
   Contract with the Posts feed (another file): hallPostsHtml() returns the feed's HTML and hallPostsMount(), if it exists, runs
   after every draw of the Posts tab. If the feed draws the Town board itself (its HTML holds id="socnb", or it sets
   HALL_POSTS_HAS_BOARD = true), the old board is not added under it. */
var HTAB={tab:"posts",tabs:[["posts","Posts"],["chat","Chat"],["style","Style"]],booted:0};
(function(){try{var t=sessionStorage.getItem("qbHallTab");if(t==="posts"||t==="chat"||t==="style")HTAB.tab=t}catch(e){}})();
/* the Hall's own CSS goes in from here (as 10_app_a.js and 22_garden.js do), so index.html never clashes with other branches */
function htabCss(id,css){if(document.getElementById(id))return;var st=document.createElement("style");st.id=id;st.textContent=css;(document.head||document.documentElement).appendChild(st)}
htabCss("qb-hall-css",
  ".htab{position:sticky;top:0;z-index:6;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px;border-radius:14px;background:var(--surface);border:1px solid var(--line);box-shadow:0 8px 20px -12px rgba(0,0,0,.7)}"
  +".htab button{position:relative;min-height:40px;border:0;border-radius:10px;background:transparent;color:var(--muted);font:700 13px/1 var(--font-body,system-ui);letter-spacing:.04em;cursor:pointer}"
  +".htab button.on{background:var(--surface2);color:var(--fg);box-shadow:inset 0 -2px 0 var(--accent)}"
  +".htab button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}"
  +".htab .tch-dot{position:absolute;top:8px;right:calc(50% - 26px);width:8px;height:8px;border-radius:50%;background:#ff4d5e}"
  +".htab .tch-dot[hidden]{display:none}");
/* the Hall can be opened: its level reached and nothing gating it (as the nav bar draws it) */
function htabHallOpen(){try{var a=AREAS.filter(function(x){return x[0]==="hall"})[0];return !!a&&effLvl()>=a[2]&&!areaGate("hall")&&!(typeof areaWaiting==="function"&&areaWaiting("hall"))}catch(e){return false}}
function htabSet(t){if(!HTAB.tabs.some(function(x){return x[0]===t}))return;HTAB.tab=t;try{sessionStorage.setItem("qbHallTab",t)}catch(e){}}
function htabBar(){return '<div class="htab" role="tablist" aria-label="Town Hall">'+HTAB.tabs.map(function(x){var on=HTAB.tab===x[0];
  return '<button type="button" role="tab" aria-selected="'+on+'" class="'+(on?'on':'')+'" data-act="htab" data-t="'+x[0]+'">'+x[1]+(x[0]==="chat"?'<i class="tch-dot" aria-label="New messages" hidden></i>':'')+'</button>'}).join("")+'</div>'}
/* Posts: the feed if it is there, the town board (meter and posts) unless the feed already draws it, then the Class Hall */
function htabPosts(){var ph="";
  if(typeof hallPostsHtml==="function"){try{ph=String(hallPostsHtml()||"")}catch(e){ph='<section class="card panel"><p class="note">Posts could not load right now.</p></section>'}}
  var own=ph.indexOf('id="socnb"')>=0||(typeof HALL_POSTS_HAS_BOARD!=="undefined"&&!!HALL_POSTS_HAS_BOARD),h=ph;
  if(!own){var bd=window.QBART&&QBART["ui_town_board.webp"];
    h+='<section class="card panel tw-hall'+(bd?' has-art':'')+'">'+(bd?'<i class="tw-bg" style="background-image:url('+bd+')" aria-hidden="true"></i>':'')+'<h3 class="label">Town hall</h3><p class="note">Post your look and a short message for everyone in town.</p></section>'+socialHtml()}
  return h+townHallBase()}
/* the Neighbors list moved to Style, so the board's panel (#socnb) keeps the meter and the Town board only. If its markup ever
   changes so the cut cannot be found, the whole panel shows, as before. */
var htabInnerBase=socInner;
socInner=function(){var h=htabInnerBase.apply(this,arguments),a=h.indexOf('<h3 class="label">Neighbors</h3>'),b=h.indexOf('>Town board</h3>');
  if(a<0||b<a)return h;a=h.lastIndexOf('<div class="row"',a);b=h.lastIndexOf('<h3',b);if(a<0||b<a)return h;
  return h.slice(0,a)+(SOC.err?'<p class="note">Could not reach the neighborhood ('+esc(SOC.err)+').</p>':'')+h.slice(b)};
/* the Hall itself: the tab bar and the open tab. A tab that throws shows a line instead of taking the whole Hall down. */
var htabOldHall=hallHtml;
hallHtml=function(){htabOpen();var t=HTAB.tab,b;
  try{b=t==="chat"?tchHtml():t==="style"?fshHtml():htabPosts()}catch(e){b='<section class="card panel"><p class="note">This tab could not load ('+esc(String((e&&e.message)||e).slice(0,80))+').</p></section>'}
  return htabBar()+b};
/* opening the Hall: neighbors re-read when stale, this player's world published, the live parts started */
function htabOpen(){setTimeout(function(){try{if(socOn()&&(!SOC.loaded||Date.now()-SOC.loaded>60000))socLoad();socPublish()}catch(e){}
  try{sqSeed()}catch(e){}try{tchStart(1)}catch(e){}try{fshStart()}catch(e){}},50)}
/* every draw: the chat box keeps its focus, caret and scroll, each tab gets its after-draw step, and the chat dot is redrawn on the
   new nav bar */
var htabRenderBase=render;
render=function(){var a=document.activeElement,k={};
  if(a&&a.id==="tchin"){k.f=1;k.s0=a.selectionStart;k.s1=a.selectionEnd}
  var lg=document.getElementById("tchlog");if(lg){k.top=lg.scrollTop;k.bot=lg.scrollHeight-lg.scrollTop-lg.clientHeight<40}
  var r=htabRenderBase.apply(this,arguments);
  try{htabAfter(k)}catch(e){}
  return r};
function htabShown(t){return view==="hall"&&HTAB.tab===t&&loaded&&S&&S.created&&!ccEdit&&!!document.querySelector(".htab")}
function htabAfter(k){
  if(htabShown("chat"))tchMounted(k);else TCH.shown=0;
  if(htabShown("style"))fshMounted();
  if(htabShown("posts")&&typeof hallPostsMount==="function"){try{hallPostsMount()}catch(e){}}
  tchSync();tchDot()}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=htab]");if(!b)return;var t=b.dataset.t;
  if(t===HTAB.tab)return;htabSet(t);render();window.scrollTo(0,0)});
/* the live parts start once the save and the player id are in: likes for everyone (a winner is paid even without opening the
   Hall), the chat listener once the Hall is open (for the unread dot) */
(function htabBoot(){setTimeout(function(){
  if(socOn()&&loaded&&S&&S.created){try{fshStart()}catch(e){}if(htabHallOpen()){try{tchStart()}catch(e){}}}
  htabBoot()},HTAB.booted++?15000:3000)})();
