/* ---------- The inbox (Cal, 2026-11-10) ----------
   Cal: "On the top right where the welcome letter and info are, make that a message inbox. The first letter will be the welcome
   letter with 3000 coins to start off. Then the next letter is a roadmap."
   - An envelope next to the + by the coin count, on every screen, with the number of unread letters. It opens the list (sender,
     subject, date, a dot while unread); a letter opens in the same window, with a way back to the list.
   - Letters live in INBOX: a new letter is one line. A letter with an empty body stays hidden (the roadmap until Cal has its text).
     coins: a gift the letter pays once, with a Claim button. d: the date it shows; without one, the day the player first got it.
   - INBOXGEN holds functions that return more letters made from game data (the weekly Fashion winner, W18).
   - The save keeps S.letters = {read:{id:1}, paid:{id:coins}, at:{id:date}, popped} (S.inbox is the owner's quest inbox, 30_app_b.js). Players from before the inbox get the welcome
     letter, its coins and its one-time opening too (welcomeOnce in 29q_news.js). */
var INBOX=[
  {id:"welcome",from:"Cal",subj:"Welcome to SAYWHAT",body:function(){return WELCOMEBODY},coins:3000},
  {id:"roadmap",from:"Cal",subj:"Roadmap",body:""}
];
var INBOXGEN=[];
function ibState(){if(!S.letters||typeof S.letters!=="object")S.letters={};var I=S.letters;["read","paid","at"].forEach(function(k){if(!I[k]||typeof I[k]!=="object")I[k]={}});return I}
function ibBody(l){var b=typeof l.body==="function"?l.body():l.body;return b?String(b):""}
/* every letter this player can see, newest first; a letter's day is its own d, else the day this player first got it */
function ibDay(l){return l.d||ibState().at[l.id]||""}
function ibAll(){var I=ibState(),t=today(),all=INBOX.slice(),out=[];
  INBOXGEN.forEach(function(f){try{all=all.concat(f()||[])}catch(e){}});
  all.forEach(function(l){if(!l||!l.id||!ibBody(l))return;if(!l.d&&!I.at[l.id])I.at[l.id]=t;out.push(l)});
  return out.map(function(l,i){return [l,i]}).sort(function(a,b){var x=ibDay(a[0]),y=ibDay(b[0]);return x<y?1:x>y?-1:b[1]-a[1]}).map(function(p){return p[0]})}
function ibFind(id){return ibAll().filter(function(l){return l.id===id})[0]||null}
/* a letter counts as new until it is read, and a letter with a gift until the gift is claimed (QA, rc-0.89: closing the welcome
   letter cleared the badge while its 3,000 coins waited) */
function ibNew(l){var I=ibState();return !I.read[l.id]||(l.coins>0&&!I.paid[l.id])}
function ibUnread(){return ibAll().filter(ibNew).length}
function ibDate(d){try{var p=String(d).split("-");return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString([],{month:"short",day:"numeric"})}catch(e){return ""}}
function ibIcon(){return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'}
function ibBtn(){if(!loaded||!S||!S.created)return "";var n=ibUnread();
  return '<button class="ibbtn" data-ib="list" aria-label="Inbox'+(n?', '+n+' unread':'')+'">'+ibIcon()+(n?'<i>'+n+'</i>':'')+'</button>'}
/* the count on the envelope, redrawn in place */
function ibPaint(){[].forEach.call(document.querySelectorAll(".ibbtn"),function(b){var tmp=document.createElement("div");tmp.innerHTML=ibBtn();if(tmp.firstElementChild)b.replaceWith(tmp.firstElementChild)})}
function ibListHtml(){var I=ibState(),L=ibAll();
  return '<div class="card box2 ibox"><span class="label">Inbox</span><h2>Letters</h2>'
    +(L.length?'<div class="iblist">'+L.map(function(l){var un=ibNew(l);
      return '<button class="ibrow'+(un?' un':'')+'" data-ib="open" data-id="'+esc(l.id)+'"><i class="ibdot" aria-hidden="true"></i><span><b>'+esc(l.subj)+'</b><small>'+esc(l.from)+'</small></span><small class="ibd">'+esc(ibDate(ibDay(l)))+'</small></button>'}).join("")+'</div>'
      :'<p class="note">No letters yet.</p>')+'</div>'}
function ibLetterHtml(l){var I=ibState(),paid=I.paid[l.id];
  return '<div class="card box2 ibox welcome"><button class="ibback" data-ib="list">&lsaquo; Inbox</button><span class="label">From '+esc(l.from)+' &middot; '+esc(ibDate(ibDay(l)))+'</span><h2>'+esc(l.subj)+'</h2>'
    +'<div class="ibbody">'+ibBody(l)+'</div>'
    +(l.coins>0?(paid?'<p class="note ibgot">'+(+paid).toLocaleString()+' coins claimed.</p>':'<div class="btns"><button class="btn big" data-ib="claim" data-id="'+esc(l.id)+'">Claim '+l.coins.toLocaleString()+' coins</button></div>')
      :'<div class="btns"><button class="btn" data-act="mclose">Close</button></div>')+'</div>'}
function ibShow(h){closeModals();var m=modal(h);if(m)m.classList.add("ibmodal");return m}
function ibOpen(id){var l=id?ibFind(id):null;if(!l){ibShow(ibListHtml());return}
  var I=ibState();if(!I.read[l.id]){I.read[l.id]=1;persist()}ibShow(ibLetterHtml(l));ibPaint()}
/* a letter's gift, once per player */
function ibClaim(id){var l=ibFind(id),I=ibState();if(!l||!(l.coins>0)||I.paid[id])return;
  I.paid[id]=l.coins;S.coins+=l.coins;S.earnedC=(S.earnedC||0)+l.coins;persist();
  try{burst(innerWidth/2,innerHeight/3,30)}catch(e){}pop("+"+l.coins.toLocaleString()+" coins");ibShow(ibLetterHtml(l));try{render()}catch(e){}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-ib]");if(!b)return;var k=b.dataset.ib;
  if(k==="list"){ibShow(ibListHtml());return}
  if(k==="open"){ibOpen(b.dataset.id);return}
  if(k==="claim"){ibClaim(b.dataset.id);return}});
/* ---------- your coins wherever you can buy (Cal, 2026-11-10: "I also want the total coins to be visible in every menu that has a
   purchase option. Like in the room view I couldnt tell how much money I had left when I bought a room upgrade") ----------
   coinBar(): the header's coin pill with the + (kind words) and the envelope beside it, for the room window, the Build window, the
   Shop and the Loft. Every .coinlive on screen follows S.coins and counts down (or up) to the new total after a purchase. */
function coinPillHtml(cls){var c=Math.floor(S.coins||0);return '<span class="coinpill coinlive'+(cls?' '+cls:'')+'" data-c="'+c+'" aria-label="'+c+' coins"><i class="coin"></i><b>'+c.toLocaleString()+'</b></span>'}
function coinBar(){return '<span class="coinbar">'+coinPillHtml()+(typeof kdBtn==="function"?kdBtn():'')+ibBtn()+'</span>'}
var COINANIM={};
setInterval(function(){try{if(!S)return;var c=Math.floor(S.coins||0);
  [].forEach.call(document.querySelectorAll(".coinlive"),function(el){var from=+el.dataset.c;if(from===c||el._run)return;el.dataset.c=c;el._run=1;el.setAttribute("aria-label",c+" coins");
    var b=el.querySelector("b")||el,t0=performance.now(),d=600,step=function(t){var k=Math.min(1,(t-t0)/d),v=Math.round(from+(c-from)*(1-Math.pow(1-k,3)));b.textContent=v.toLocaleString();
      if(k<1)requestAnimationFrame(step);else{el._run=0;el.classList.remove("coinflash");void el.offsetWidth;el.classList.add("coinflash")}};requestAnimationFrame(step)})}catch(e){}},250);
/* the Shop's own header (the page header is hidden there): its coin pill follows the total, with the + and the envelope beside it.
   Done on the Shop's finished markup, so the Shop's header line can change without this */
var ibShopBase=shopHtml;
shopHtml=function(){return ibShopBase.apply(this,arguments).replace(/<div class="qs-coin"><i class="coin"><\/i><b>(\d+)<\/b><\/div>/,function(m,n){
  return '<div class="qs-cbar"><div class="qs-coin coinlive" data-c="'+n+'"><i class="coin"></i><b>'+(+n).toLocaleString()+'</b></div>'+(typeof kdBtn==="function"?kdBtn():'')+ibBtn()+'</div>'})};
