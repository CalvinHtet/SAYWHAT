/* ---------- Cal's 2026-11-23 reboot: the real game begins ----------
   Cal: "We are doing a full reboot of the progress of the game. There should only be 2 messages in the inbox. One is the welcome message
   which grants 1000 coins. Update this message with new info if it is relevant. And the current version live message that explains it
   is [now] live for everyone. Did some testing for a few weeks and it is still a work in progress, so expect periodic updates as we go.
   I hope this becomes a way for all of us to be productive, through accountaibility and a little competition. Have fun and get after it.
   With 500 coins on that message as a reward." "Remove the official notice in the town hall." */

/* ---- the inbox: two letters. Every other letter goes (the roadmap, the patch notes, the old-save refunds); letters made by events
   that have not happened yet in this world (the Town Boss, the fashion competition) still arrive when they do ---- */
WELCOMEBODY='<p>I&rsquo;m bad at finishing my to-do list. The boring stuff (laundry, dishes, emails, the gym) always slides to tomorrow. So I built SAYWHAT to make those tasks worth doing.</p>'
  +'<h3 class="label">How it works</h3><ul class="wl">'
  +'<li><b>Add your tasks.</b> Type them, messy is fine, in the box at the top of the Board and each one becomes a quest. Your quests are private.</li>'
  +'<li><b>Finish quests</b> to earn XP and coins. Prove the big ones with a photo for bigger rewards.</li>'
  +'<li><b>Level up</b> as your XP adds up. Each level pays coins, and every 5th level lets you pick a reward.</li>'
  +'<li><b>Spend coins</b> on your Loft. Start with your Bedroom: tap it to see what you can add. The Walk-in Closet opens the Shop.</li>'
  +'<li><b>Work out</b> and prove it with a live photo. Four workouts in a week earn the Training bonus.</li>'
  +'<li><b>Challenge a friend</b> from the Town Hall. Only the two of you see that challenge.</li>'
  +'</ul><p>No guilt, no pressure. Do a little every day and watch it add up. See you in town.</p>';
var V35LAUNCH='<p>SAYWHAT is now live for everyone. We did some testing for a few weeks, and it is still a work in progress, so expect periodic updates as we go.</p>'
  +'<p>I hope this becomes a way for all of us to be productive, through accountability and a little competition. Have fun and get after it.</p>';
INBOX.length=0;
INBOX.push({id:"welcome",from:"Cal",subj:"Welcome to SAYWHAT",body:function(){return WELCOMEBODY},coins:1000},
  {id:"live135",from:"Cal",subj:"SAYWHAT is live",d:"2026-11-23",body:V35LAUNCH,coins:500});
if(typeof PATCHES!=="undefined")PATCHES.length=0;
if(typeof PATCHNOTES!=="undefined")PATCHNOTES.length=0;
/* the refund letter for saves from before the v0.91 reset never applies to a save made in this world; drop it with the rest */
(function(){var keep=INBOXGEN.filter(function(f){return !/reset91|PATCHES|PATCHNOTES/.test(String(f))});INBOXGEN.length=0;keep.forEach(function(f){INBOXGEN.push(f)})})();

/* ---- no official notice on the Town board (the launch letter carries the 500) ---- */
if(typeof NOTICES!=="undefined")NOTICES.length=0;

/* ---- the quest groups (Cal: "i just don't like the name Reset. Can we change that to self care? And then admin/job, or something like
   that. The names could be reworked for the categories"): the ids stay (saves keep them), the names change; perk texts say the same
   names (10_app_a.js, 29k_friends.js) and the AI's sorting prompt files meals under self care (30_app_b.js PARSE, guess) ---- */
var V35CL={out:"Outside",reset:"Self care",home:"Home",body:"Fitness",admin:"Work and admin",create:"Creative",social:"People",boss:"Boss"};
CLUSTERS.forEach(function(c){if(V35CL[c[0]])c[1]=V35CL[c[0]]});try{Object.keys(V35CL).forEach(function(k){if(R2CLN[k])R2CLN[k]=V35CL[k]})}catch(e){}

/* ---- Town square greetings (Cal: "remove the spank and replace with Wave, Fist Bump, high five"): poke goes too; old feed entries
   still read (SQOLD) ---- */
(function(){SQOLD.poke=SQK.poke;SQOLD.spank=SQK.spank;var w=SQK.wave,f=SQK.five;Object.keys(SQK).forEach(function(k){delete SQK[k]});
  SQK.wave=w;SQK.fist=["\u{1F44A}","Fist bump","fist-bumped"];SQK.five=f})();/* in Cal's order: Wave, Fist Bump, High five */
(function(){var st=document.createElement("style");st.textContent=".sq-acts{grid-template-columns:repeat(3,minmax(0,1fr))!important}";document.head.appendChild(st)})();

/* ---- fewer first-day windows (Cal: "There are also too many popups in the beginning ... The shop brand drop splash screen should only
   appear if you open the shop and never on the other screens. There should be an exclamation point on the shop button once it is
   unlocked and there is a new brand to look at") ---- */
var v35Brand=brandCheck;brandCheck=function(){if(view!=="shop")return;return v35Brand.apply(this,arguments)};
dropCheck=function(){};/* the old full-screen "NEW DROP" overlay: the brand's window in the Shop says it */
/* the Shop's "!" (29o_alerts.js): a save first seen with the Shop still shut no longer counts the brands on sale then as seen, so the
   "!" is there when the Walk-in Closet opens it; opening the Shop (each floor) clears it as before */
alSeen=function(){if(!S.alSeen||typeof S.alSeen!=="object")S.alSeen={};var o=S.alSeen;o.room=o.room||{};o.bld=o.bld||{};o.tab=o.tab||{};o.brand=o.brand||{};
  if(!o.init&&loaded&&S.created){o.init=1;try{AREAS.forEach(function(a){if(alOpenTab(a))o.tab[a[0]]=1});if(!areaGate("shop"))dropState().live.forEach(function(b){o.brand[b.id]=1})}catch(e){}}
  return o};
fshNewsOpen=function(){};/* the fashion winners' letter waits in the inbox; it never opens by itself */

/* ---- the tutorial first (Cal: "Tutorial should take precedent and everything else should appear after the tutorial is done or skipped"):
   while a tour step is on screen, a window that opens by itself (a brand's window, a letter, a milestone, a visitor, a story card) is
   held back, unshown, and comes up after the tour ends or is skipped, one at a time. A window the player opens with a tap (within
   1.5 s of it) shows as always, and the tour steps aside for it as it did. ---- */
var V35TAP=0;["pointerdown","keydown"].forEach(function(t){document.addEventListener(t,function(){V35TAP=Date.now()},true)});
var v35Modal=modal;modal=function(inner){var m=v35Modal.apply(this,arguments);
  try{if(m&&TOUR&&TOUR.id&&Date.now()-V35TAP>1500){m.classList.remove("modal");m.classList.add("qb-held");m.style.display="none"}}catch(e){}
  return m};
setInterval(function(){try{if(TOUR&&TOUR.id)return;if(document.querySelector("#layer .modal"))return;var h=document.querySelector("#layer .qb-held");
  if(h){h.classList.remove("qb-held");h.classList.add("modal");h.style.display=""}}catch(e){}},1000);

/* ---- the fashion competition (Cal: "only unlock this feature once the fashion competition arrives. Which only unlocks after at least 5
   players have bought 5 items each from any shop. There should be a new message that says the fashion competition has begun. Players can
   vote twice during the week long competition and they can't vote for themselves or for the same person twice. In order to qualify, you
   must use both votes and the number of votes each person has gotten is private. If it gets close to the end of the week and you still
   haven't voted, you will receive a warning popup message that you will be disqualified if you don't place your votes.") ----
   - S.shopBuys counts this player's purchases (the Shop, the Stylist, the Pet Shop), published on worlds/<id> as sb. When 5 players of
     this world (the epoch's worlds docs, this player included) have sb >= 5, the competition opens for this player: S.fshOn = {wk, d}.
   - Votes: the likes docs as before, but 2 a week in all, at most 1 a person, never yourself; a vote can be taken back while its week
     is open. Only players who used both votes that week can place. Nobody sees counts: no numbers, no hearts, no who-voted list; the
     Fashion list is in name order; last week's top 3 are named without counts.
   - In the week's last 24 hours, a player with votes left gets a warning window once a day. */
var V35FSH=5,V35BUYS=5;
var v35Buy=buy;buy=function(id){var had=!!(S.owned&&S.owned[id]);var r=v35Buy.apply(this,arguments);try{if(!had&&S.owned[id]){S.shopBuys=(S.shopBuys||0)+1;persist()}}catch(e){}return r};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=pzclbuy],[data-act=pzbuy]");if(!b)return;var c0=S.coins;
  setTimeout(function(){try{if(S.coins<c0){S.shopBuys=(S.shopBuys||0)+1;persist()}}catch(x){}},400)},true);
var v35World=socWorldDoc;socWorldDoc=function(){var d=v35World.apply(this,arguments);try{d.sb=Math.min(9999,S.shopBuys||0)}catch(e){}return d};
function fshBuyers(){var n=(S.shopBuys||0)>=V35BUYS?1:0;try{(SOC.worlds||[]).forEach(function(w){if(w&&w.id!==MYUID&&(+w.sb||0)>=V35BUYS)n++})}catch(e){}return n}
function fshIsOn(){if(S.fshOn&&S.fshOn.wk)return true;if(!loaded||!S.created)return false;if(fshBuyers()>=V35FSH){S.fshOn={wk:fshWk().key,d:today()};persist();try{ibPaint()}catch(e){}return true}return false}
setInterval(function(){try{fshIsOn()}catch(e){}},30000);
INBOXGEN.push(function(){if(!S||!S.fshOn||!S.fshOn.wk)return [];return [{id:"fsh-on",from:"Town Hall",subj:"The fashion competition has begun",d:S.fshOn.d,
  body:'<p>Five players have each bought five pieces, so the town has a fashion competition. It runs every week and closes Sunday at 7 pm Pacific.</p><ul class="wl">'
    +'<li>You have <b>2 votes</b> a week. Vote for two different people, never yourself.</li>'
    +'<li>Use <b>both</b> votes to qualify. If you do not vote, you cannot place that week.</li>'
    +'<li>Votes are private. Nobody sees how many anyone got.</li>'
    +'<li>The top 3 win '+FSHPRIZE.map(function(c){return c.toLocaleString()}).join(", ")+' coins and a medal.</li></ul><p>Find everyone under Players, Fashion. Dress up.</p>'}]});
/* the votes */
function fshUsed(){var c=fshMyTo();return Object.keys(c).reduce(function(s,u){return s+(c[u]>0?1:0)},0)}
fshLeft=function(uid){if(!fshIsOn())return 0;if(uid&&(fshMyTo()[uid]||0)>0)return 0;return Math.max(0,2-fshUsed())};
fshBackable=function(uid){return Math.min(1,fshMyTo()[uid]||0)};
fshRule=function(){return "You have 2 votes a week, for two different people and never yourself. Use both to qualify. Votes are private"};
var v35Like=fshLike;fshLike=function(uid,back){if(!fshIsOn()){pop("The fashion competition has not begun yet");return}
  if(!back){if(uid===MYUID){pop("You can't vote for yourself");return}if((fshMyTo()[uid]||0)>0){pop("You already voted for "+fshNameOf(uid));return}if(fshUsed()>=2){pop("You've used both votes this week");return}}
  /* the day's record (td) must allow a take-back of this week's vote */
  try{if(back&&FSH.mine){if(FSH.mine.d!==today()){FSH.mine.d=today();FSH.mine.td={}}FSH.mine.td[uid]=Math.max(1,FSH.mine.td[uid]||0)}}catch(e){}
  return v35Like.apply(this,arguments)};
/* only players who used both votes in a week can place in it */
function fshQual(wk){var q={};Object.keys(FSH.likes||{}).forEach(function(u){var d=FSH.likes[u],x=d&&(d.wk===wk?d.c:(d.prev&&d.prev.wk===wk?d.prev.c:null));if(x&&Object.keys(x).filter(function(k){return k!==u&&x[k]>0}).length>=2)q[u]=1});return q}
var v35Counts=fshCounts;fshCounts=function(wk){var c=v35Counts.apply(this,arguments),q=fshQual(wk),o={};Object.keys(c).forEach(function(u){if(q[u])o[u]=c[u]});return o};
var v35Pay=fshPayCheck;fshPayCheck=function(){if(!fshIsOn())return;var wk=fshWk();if(wk.prev<S.fshOn.wk){if(!S.fsh||typeof S.fsh!=="object")S.fsh={};if(!(typeof S.fsh.last==="string"&&S.fsh.last>=wk.prev)){S.fsh.last=wk.prev;persist()}return}return v35Pay.apply(this,arguments)};
/* nothing shows a count */
fshHeart=function(){return ""};fshDot=function(){};fshWhoHtml=function(){return ""};
fshStats=function(p){return '<span><b>'+(p.earnedC==null?'—':p.earnedC.toLocaleString())+'</b> coins earned</span><span><b>Lv '+p.lv+'</b></span>'};
var v35Rank=fshRank;fshRank=function(mode){if(mode!=="fashion")return v35Rank.apply(this,arguments);var ps=fshPlayers(),nm=function(p){return p.name.toLowerCase()};
  ps.forEach(function(p){p.v=0;p.place=""});ps.sort(function(a,b){return (b.me?1:0)-(a.me?1:0)||(nm(a)<nm(b)?-1:nm(a)>nm(b)?1:0)});return ps};
var v35Val=fshValTxt;fshValTxt=function(p,mode){if(mode==="fashion")return fshMyTo()[p.id]?"Voted":"";return v35Val.apply(this,arguments)};
fshLastWeek=function(){var c=fshCounts(fshWk().prev),ids=Object.keys(c).filter(function(u){return fshNameOf(u)&&c[u]>0});if(!ids.length)return "";
  ids.sort(function(a,b){return c[b]-c[a]||(a<b?-1:1)});var out=ids.map(function(u){return {id:u,p:1+ids.filter(function(v){return c[v]>c[u]}).length}}).filter(function(x){return x.p<=3}).slice(0,6);
  return '<p class="note">Last week: '+out.map(function(x){return FSHMEDAL[x.p-1]+' '+esc(fshNameOf(x.id))}).join(" &middot; ")+'</p>'};
var v35Box=fshBoxInner;fshBoxInner=function(){if(FSH.mode!=="fashion")return v35Box.apply(this,arguments);
  var wk=fshWk(),left=Math.max(1,7*1440-wk.mins),dd=Math.floor(left/1440),hh=Math.floor(left%1440/60),u=fshUsed(),rk=fshRank("fashion");
  return '<p class="note lbi">Fashion week &middot; ends in '+(dd?dd+'d '+hh+'h':hh?hh+'h':(left%60)+' min')+'</p>'+fshLastWeek()
    +'<div class="fsh-you"><span>'+(u>=2?'You used both votes this week. You qualify.':'You have '+(2-u)+' vote'+(2-u===1?'':'s')+' left this week. Use both to qualify.')+'</span></div>'
    +'<p class="note">'+fshRule()+'. Tap a look to vote.</p>'+fshList(rk,"fashion")};
fshLikeBox=function(p){if(p.me)return '<p class="note">Your look. Others vote here. The week closes Sunday 7 pm Pacific.</p>';
  if(!fshIsOn())return '';if(FSH.err==="permission-denied")return '<p class="note">Voting is not switched on yet.</p>';
  var mine=(fshMyTo()[p.id]||0)>0,left=fshLeft(p.id);
  if(mine)return '<button type="button" class="btn ghost big fsh-like on" disabled>You voted for this look</button><button type="button" class="btn ghost sm fsh-back" data-act="fshunlike" data-u="'+esc(p.id)+'">Take back my vote</button><p class="note">'+fshRule()+'.</p>';
  return '<button type="button" class="btn big fsh-like" data-act="fshlike" data-u="'+esc(p.id)+'"'+(left?'':' disabled')+'>'+(left?'Vote for this look <small>'+(2-fshUsed())+' left</small>':'No votes left this week')+'</button><p class="note">'+fshRule()+'.</p>'};
/* until it opens, there is no Fashion tab in the ranking */
var v35Tg=fshTg;fshTg=function(){if(!fshIsOn()&&FSH.mode==="fashion")FSH.mode="level";var h=v35Tg.apply(this,arguments);return fshIsOn()?h:h.replace(/<button[^>]*data-m="fashion"[^>]*>[^<]*<\/button>/,"")};
var v35BoxGate=fshBoxInner;fshBoxInner=function(){if(!fshIsOn()&&FSH.mode==="fashion")FSH.mode="level";return v35BoxGate.apply(this,arguments)};
var v35Start=fshStart;fshStart=function(){if(!fshIsOn())return;return v35Start.apply(this,arguments)};
setInterval(function(){try{if(fshIsOn()&&!FSH.on)fshStart()}catch(e){}},30000);
/* the warning in the week's last day */
setInterval(function(){try{if(!fshIsOn()||!FSH.ready||!loaded||document.querySelector("#layer .modal")||(TOUR&&TOUR.id))return;var wk=fshWk();if(wk.mins<6*1440||fshUsed()>=2)return;
  if(!S.fsh||typeof S.fsh!=="object")S.fsh={};var k=wk.key+"|"+today();if(S.fsh.warn===k)return;S.fsh.warn=k;persist();
  modal('<div class="card box2"><span class="label">Fashion week</span><h3>Vote before Sunday 7 pm Pacific</h3><p class="note">You have '+(2-fshUsed())+' vote'+(2-fshUsed()===1?'':'s')+' left. If you don\'t use both votes, you are disqualified this week.</p><div class="row"><button class="btn" data-act="v35fsh">Vote now</button><button class="btn ghost" data-act="mclose">Later</button></div></div>')}catch(e){}},60000);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=v35fsh]");if(!b)return;try{closeModals()}catch(x){}FSH.mode="fashion";var nb=document.querySelector('.nav [data-v="players"]');if(nb)nb.click()});

/* ---- challenges between the two players only (Cal: "The challenges finished collapsible in the town hall should be private. except to
   the people you challenged ... The challenge for the productivity quest will be public only to the people in the challenge, which means
   the two challengers will be able to see the other's quests and make sure this is stated so there are no surprises. Everyone else like
   in the main board, your individual productivity quests remain private.")
   - "Challenges in town" lists only challenges this player is in.
   - A productivity challenge publishes, with its score, the names of the quests that scored (duel/<id>.sc[cid].qs, at most 30), and the
     card shows the other player's list. The rules say so wherever a productivity challenge is made, offered or shown. ---- */
var v35Pub=dlpAll;dlpAll=function(){return v35Pub.apply(this,arguments).filter(function(p){return dlpMine(p)})};
var v35Tog=toggle;toggle=function(id){var r=v35Tog.apply(this,arguments);try{if(S.done&&S.done[id]){var q=(S.quests||[]).filter(function(x){return x&&x.id===id})[0];
  if(q){if(!S.dlqn||typeof S.dlqn!=="object")S.dlqn={};S.dlqn[id]=String(q.name||"").slice(0,60);var ks=Object.keys(S.dlqn);if(ks.length>300)ks.slice(0,ks.length-300).forEach(function(k){delete S.dlqn[k]})}}}catch(e){}return r};
function dlQuests(a,b){var g=dlLog(),N=S.dlqn||{},out=[];Object.keys(g.q).forEach(function(k){var x=g.q[k];if(x[0]>=a&&x[0]<b){var id=k.slice(0,k.lastIndexOf("|"));out.push([x[0],N[id]||"A quest"])}});
  return out.sort(function(p,q){return p[0]-q[0]}).map(function(p){return p[1]}).slice(-30)}
var v35DlWrite=dlWrite;dlWrite=function(mut){return v35DlWrite.call(this,function(d){mut(d);try{var now=Date.now();dlAll().forEach(function(c){if(c.kind==="q"&&d.sc&&d.sc[c.cid])d.sc[c.cid].qs=dlQuests(c.start,Math.min(now,c.end))})}catch(e){}})};
var V35QNOTE="In a productivity challenge you both see each other's finished quests. Nobody else sees the challenge.";
var v35What=dlWhat;dlWhat=function(c){var h=v35What.apply(this,arguments);return c&&c.kind==="q"?h+'. '+V35QNOTE.replace(/\.$/,""):h};
var v35Item=dlItem;dlItem=function(c){var h=v35Item.apply(this,arguments);try{if(c&&c.kind==="q"&&(c.st==="live"||c.st==="over")){var qs=c.opp&&Array.isArray(c.opp.qs)?c.opp.qs:[];
    var add='<details class="dlqs"><summary>'+esc(c.otherName)+'\'s quests ('+qs.length+')</summary>'+(qs.length?'<ul>'+qs.map(function(n){return '<li>'+esc(String(n))+'</li>'}).join("")+'</ul>':'<p class="note">None finished yet.</p>')+'<p class="note">'+V35QNOTE+'</p></details>';
    var i=h.lastIndexOf("</div>");if(i>=0)h=h.slice(0,i)+add+h.slice(i)}}catch(e){}return h};
var v35New=dlNewHtml;dlNewHtml=function(){var h=v35New.apply(this,arguments);try{if(DL.f&&DL.f.kind==="q")h=h.replace('<div class="card box2 dlm"><div class="rm-head"><h3>Challenge someone</h3>'+coinPillHtml()+'</div>','$&<p class="note"><b>'+V35QNOTE+'</b></p>')}catch(e){}return h};
(function(){var st=document.createElement("style");st.textContent=".dlqs{margin-top:6px}.dlqs summary{cursor:pointer;font-weight:600}.dlqs ul{margin:6px 0 4px 18px;padding:0}.dlqs li{line-height:1.4}";document.head.appendChild(st)})();

/* test hook (never on a Live build: QB_WEB.noTest) */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV135={on:fshIsOn,buyers:fshBuyers,left:fshLeft,used:fshUsed,counts:fshCounts,rank:fshRank,box:function(){return fshBoxInner()},likeBox:fshLikeBox,tg:fshTg,
  fsh:FSH,setWorlds:function(w){SOC.worlds=w},myId:function(){return MYUID},setMe:function(id){MYUID=id},wk:function(){return fshWk()},
  pub:dlpAll,quests:dlQuests,item:dlItem,what:dlWhat,sqk:function(){return SQK},cl:function(){return CLUSTERS},inbox:function(){return ibAll().map(function(l){return [l.id,l.subj,l.coins||0]})},tour:TOUR};

/* ---- Training (Cal: "Where is the training tab? It disappeared? Move the workout task that is always present on the main board, to the
   training tab. And have a checkmark tick option at the top that shows which days of the week we went. And allow for photo proof as
   well. When taking a photo, allow the option to post to the town hall"):
   - Training is a tab in the bar again, from day one (it had moved to a Board tile, and hid in the calm first days: 29zz_v115.js).
   - The weekly Workout quest leaves the Board's list; Training's top card logs it: its week strip ticks the days you worked out, and
     "Log today's workout" takes the live photo proof, as tapping the quest did (onTap: askProof). A photo that passes its check offers
     "Post to the town board" in its result window (29ph_photos.js phOffer), as before. ---- */
delete NAVHIDE.train;
var v35Vis=visQ;visQ=function(q){if(q&&q.rep==="weekly4")return false;return v35Vis.apply(this,arguments)};
function v35Gq(){return (S.quests||[]).filter(function(q){return q&&q.rep==="weekly4"})[0]||null}
var v35Train=trainHtml;trainHtml=function(){var h=v35Train.apply(this,arguments);try{var q=v35Gq();if(!q)return h;var done=!!(S.done&&S.done[q.id]),full=weekCount()>=4;
    var add=done?'<p class="note v35wk"><b>&#10003; Today&rsquo;s workout is logged.</b></p>'
      :'<button class="btn big v35wk" data-act="v35wk">'+(full?'Log another workout':'Log today&rsquo;s workout')+'</button><p class="note">Take a live photo as proof. After it passes, you can post it to the Town Hall.</p>';
    var i=h.indexOf('</section>');if(i>=0)h=h.slice(0,i)+add+h.slice(i)}catch(e){}return h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=v35wk]");if(!b)return;var q=v35Gq();if(q)onTap(q.id,e)});

/* ---- the Town Hall's photos as small squares, three a row; tap one for the photo full size, likes and comments (29ph_photos.js phOpen) ---- */
(function(){var st=document.createElement("style");st.textContent=[
  ".ph-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}",
  ".ph-card{padding:0!important;gap:0!important;border-radius:10px!important;position:relative}",
  ".ph-card .ph-img{display:block;aspect-ratio:1/1;overflow:hidden}.ph-card .ph-img img{width:100%;height:100%;object-fit:cover;display:block}",
  ".ph-card .ph-meta{position:absolute;left:4px;bottom:4px;right:4px;display:flex;align-items:center;gap:4px;font-size:10px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.8);pointer-events:none}",
  ".ph-card .ph-meta small,.ph-card .ph-cap{display:none!important}.ph-card .ph-meta b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".ph-card .ph-n{position:absolute;top:4px;right:4px;font-size:10px;padding:1px 5px;border-radius:999px;background:rgba(0,0,0,.55);color:#fff}",
  ".v35wk{margin-top:10px}"].join("");document.head.appendChild(st)})();
