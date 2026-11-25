/* ---------- Cal's 2026-11-24 list, batch 2: the 1, 2 and 3 day bounties (docs/specs/2026-11-24_SPEC_cal_list.md item 11) ----------
   Cal: "I like the bounties that are easy to achieve and grant rewards. Such as 'Post a picture of 3 meals that you ate to give the
   restaurant some new menu ideas' with a timer of 3 days ... Even challenge someone to a gym challenge, which has a 3 day timer. Once
   someone accepts your challenge, it overwrites that bountie's timer and description with the details of the challenge and who you
   challenged", and "Add 1, 2, and 3 day bounties and allow us to re-roll them 3 times a day. not 3 each, but 3 total rerolls per day.
   When choosing 2 bounties, the 3rd one disappears. You can also click on the x to forfeit the bounty so that a new bounty card can
   appear. Unless there are no more rerolls, then the same bounty will appear. If accepting the same bounty, the card does not restart
   the timer. It should continue the timer so people do not get unlimited rerolls. Rerolling again after having no more re-rolls will
   cost 150 coins. The bounties should pay more money than it costs to reroll obviously."
   - Three cards on the Board: a 1-day, a 2-day and a 3-day bounty. Two can run at once; while two run, the third card is not shown.
   - A bounty's timer starts when it is taken (1, 2 or 3 x 24 hours), not at midnight.
   - 1-day and 2-day: the chores of 29f_bounty.js (BTY1, BTY2), put on the Board as a quest as before (its XP x1.5 or x2 through the old
     mults wrapper); ticking it finishes the bounty. 3-day (BTY3P, the fourteen Cal picked): finished by posting photos on the Town
     Hall's board (29ph_photos.js phPublish) from the card's own button, or, for the Gym Challenge, by a 3-day fitness challenge
     (29w_duel.js) that the other player accepts: the card then shows who, what and that challenge's own end.
     With no photo board (a device-only save, the Claude build) the 3-day card is a 2-day chore given three days.
   - Pay (BQPAY): 250 / 400 / 600 coins, flat, on top of the XP; all above the 150 a paid reroll costs.
   - Rerolls: 3 a day over all cards (S.bq.rr). After that a reroll costs 150 coins. The x on a running bounty gives it up: with a
     reroll left it uses one and a new card comes; with none the same bounty comes back, and taking it again goes on with its old timer
     and progress (S.bq.hold).
   - A finished bounty's slot opens again when its window ends (so a 3-day done on day 1 is not a 600 a day tap); a bounty that runs out
     unfinished goes, and the next card comes at no cost.
   S.bq = {d, rr, off:{1,2,3}, act:{k: bounty}, hold:{k: bounty}}; a bounty = {k, pi (its place in the pool), n, why, xp, stat, cl, ty
   (q chore, p photos, d challenge), t0, end, qid, need, daily, got, days, cid, done, at}. */
var BQPAY={1:500,2:1000,3:2000},/* Cal 11-25: "a 1 day bounty can pay 500, a 2 day can pay 1000, 3 day pays 2000" (was 250 / 400 / 600) */BQRR=3,BQCOST=150,BQARM=null;
var BTY3P=[
  {id:"menu",n:"Menu Ideas",why:"Post photos of 3 meals you ate. The Restaurant wants new menu ideas.",need:3,xp:150},
  {id:"water",n:"Hydration Check",why:"Post your water bottle on 3 different days.",need:3,daily:1,xp:150},
  {id:"chef",n:"Home Chef",why:"Cook one meal from scratch and post it.",need:1,xp:100},
  {id:"sweep",n:"Clean Sweep",why:"Pick one messy spot. Post it before, then after.",need:2,xp:120},
  {id:"bed",n:"Made Bed",why:"Make your bed 3 mornings and post it each time.",need:3,daily:1,xp:150},
  {id:"fit",n:"Fit Check",why:"Post one photo of what you are really wearing.",need:1,xp:80},
  {id:"desk",n:"Desk Reset",why:"Tidy your workspace and post it.",need:1,xp:100},
  {id:"grass",n:"Touch Grass",why:"Ten minutes outside on 3 days. Post where you went.",need:3,daily:1,xp:150},
  {id:"made",n:"Made It Myself",why:"Draw, write or build something and post it.",need:1,xp:120},
  {id:"letgo",n:"Let It Go",why:"Donate or throw out 3 things. Post each one on its way out.",need:3,xp:150},
  {id:"movie",n:"Movie Night",why:"Post what you are watching.",need:1,xp:80},
  {id:"song",n:"Song of the Day",why:"Post your song of the day on 3 days.",need:3,daily:1,xp:120},
  {id:"game",n:"Game Night",why:"Play a game with someone, or alone, and post it.",need:1,xp:80},
  {id:"gym",n:"Gym Challenge",why:"Challenge another player to 3 days of training. It counts once they accept.",duel:1,xp:150}
];
function bqPhotos(){try{return typeof phOn==="function"&&phOn()}catch(e){return false}}
function bqOthers(){try{return typeof socOn==="function"&&socOn()&&(SOC.worlds||[]).some(function(w){return w&&w.id&&w.id!==MYUID})}catch(e){return false}}
function bqState(){var d=today(),o=S.bq;if(!o||typeof o!=="object")o=S.bq={d:d,rr:0,off:{},act:{},hold:{}};
  if(o.d!==d){o.d=d;o.rr=0}["off","act","hold"].forEach(function(k){if(!o[k]||typeof o[k]!=="object")o[k]={}});return o}
/* the pool a slot draws from now */
function bqPool(k){if(k===1)return BTY1.map(function(x,i){return {pi:i,n:x[0],why:x[1],xp:x[2],stat:x[3],cl:x[4],ty:"q"}});
  var chores=function(){return BTY2.map(function(x,i){return {pi:i,n:x[0],why:x[1],xp:x[2],stat:x[3],cl:x[4],ty:"q"}})};
  if(k===2)return chores();
  if(!bqPhotos())return chores();
  return BTY3P.map(function(x,i){return {pi:"p"+i,id:x.id,n:x.n,why:x.why,xp:x.xp,need:x.need||0,daily:x.daily||0,ty:x.duel?"d":"p"}}).filter(function(x){return x.ty!=="d"||bqOthers()})}
var BQPERM={};
function bqPerm(k,len){var key=k+":"+btySeed()+":"+len;if(BQPERM[key])return BQPERM[key];var a=[],s=btySeed()^(k*40503+len*97),r=function(){s=(s+0x6D2B79F5)|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296};
  for(var i=0;i<len;i++)a.push(i);for(var j=len-1;j>0;j--){var q=Math.floor(r()*(j+1)),t2=a[j];a[j]=a[q];a[q]=t2}return BQPERM[key]=a}
function bqOffer(k){var b=bqState(),P=bqPool(k);if(!P.length)return null;var h=b.hold[k];
  if(h){var same=P.filter(function(x){return x.pi===h.pi})[0];if(same)return same}
  var pm=bqPerm(k,P.length),i=((+b.off[k]||0)%pm.length+pm.length)%pm.length;return P[pm[i]]}
function bqRunning(){var b=bqState();return [1,2,3].filter(function(k){return b.act[k]&&!b.act[k].done}).length}
function bqQuestOff(A){if(A&&A.qid&&!(S.done&&S.done[A.qid]))S.quests=S.quests.filter(function(q){return !q||q.id!==A.qid})}
function bqTake(k){var b=bqState();if(b.act[k]||bqRunning()>=2)return null;var x=bqOffer(k);if(!x)return null;var now=Date.now(),h=b.hold[k],A;
  if(h&&h.pi===x.pi&&now<h.end){A=h;delete b.hold[k]}/* the same bounty again: its timer and progress go on */
  else{delete b.hold[k];A={k:k,pi:x.pi,id:x.id||"",n:x.n,why:x.why,xp:x.xp,stat:x.stat||"",cl:x.cl||"",ty:x.ty,t0:now,end:now+k*864e5,need:x.need||0,daily:x.daily||0,got:0,days:{},done:0}}
  if(A.ty==="q"&&!(A.qid&&S.quests.some(function(q){return q&&q.id===A.qid}))){var id="q"+(S.next++);A.qid=id;
    S.quests.push({id:id,name:A.n,xp:clampXp(A.xp),stat:A.stat,cl:A.cl,why:A.why,rep:"once",bty:{k:k,end:dstr(new Date(A.end)),key:"n"+k+":"+A.t0}})}
  b.act[k]=A;persist();render();pop(A.ty==="q"?"Bounty added to your board":"Bounty taken");return A}
function bqNext(k){var b=bqState();b.off[k]=(+b.off[k]||0)+1;delete b.hold[k]}
function bqDrop(k){var b=bqState(),A=b.act[k];if(!A||A.done)return;bqQuestOff(A);delete b.act[k];
  if(b.rr<BQRR){b.rr++;bqNext(k);pop("Bounty dropped. "+(BQRR-b.rr)+" reroll"+(BQRR-b.rr===1?"":"s")+" left today")}
  else{b.hold[k]=A;pop("No rerolls left: the same bounty is back, with its timer")}
  persist();render()}
function bqRoll(k){var b=bqState();if(b.act[k])return false;
  if(b.rr<BQRR){b.rr++}else{if(S.coins<BQCOST){pop("Need "+(BQCOST-S.coins)+" more coins to reroll");return false}S.coins-=BQCOST;S.spent=(S.spent||0)+BQCOST}
  bqNext(k);persist();render();return true}
function bqFinish(A){if(!A||A.done)return;A.done=1;A.at=Date.now();var c=BQPAY[A.k]||0,x=A.ty==="q"?0:(A.xp||0);
  grantXp(x,c);try{qbSnd("big")}catch(e){}try{burst(innerWidth/2,innerHeight/3,26)}catch(e){}
  pop("Bounty complete: "+A.n+"  +"+c+" coins"+(x?", +"+x+" XP":""))}
/* the challenge a Gym Challenge bounty is tied to: this player's newest fitness challenge sent since the bounty was taken */
function bqDuel(A){try{var me=MYUID,L=dlAll().filter(function(c){return c.from===me&&c.kind==="w"&&c.t>=A.t0-2000&&(!A.cid||c.cid===A.cid)});return L[0]||null}catch(e){return null}}
function bqTick(){if(!S||!S.created||typeof loaded==="undefined"||!loaded)return;var b=bqState(),now=Date.now(),ch=0;
  [1,2,3].forEach(function(k){var A=b.act[k],h=b.hold[k];
    if(h&&now>=h.end){delete b.hold[k];b.off[k]=(+b.off[k]||0)+1;ch=1}
    if(!A)return;
    if(!A.done){
      if(A.ty==="q"&&A.qid&&S.done&&S.done[A.qid]){bqFinish(A);ch=1}
      else if(A.ty==="p"&&A.need&&A.got>=A.need){bqFinish(A);ch=1}
      else if(A.ty==="d"){var c=bqDuel(A);
        if(c&&(c.st==="live"||c.st==="over")){if(A.cid!==c.cid||A.end!==c.end){A.cid=c.cid;A.vs=String(c.otherName||"a player").slice(0,24);A.end=c.end;A.stake=c.cash?0:c.stake;ch=1}
          if(c.st==="over"){bqFinish(A);ch=1}}
        else if(A.cid&&(!c||c.st!=="ask")){/* declined, cancelled or never answered: the card asks again, on the bounty's own clock */delete A.cid;delete A.vs;A.end=A.t0+A.k*864e5;ch=1}
        else if(c&&c.st==="ask"&&A.wait!==c.otherName){A.wait=String(c.otherName||"").slice(0,24);ch=1}
        if(!c&&A.wait){delete A.wait;ch=1}}
    }
    if(!A.done&&now>=A.end){bqQuestOff(A);delete b.act[k];b.off[k]=(+b.off[k]||0)+1;ch=1;pop("Bounty ran out: "+A.n)}
    else if(A.done&&now>=Math.max(A.end,A.t0+A.k*864e5)){delete b.act[k];b.off[k]=(+b.off[k]||0)+1;ch=1}});
  if(ch)persist();return ch}
/* a photo posted from a bounty's button counts toward it */
function bqPhoto(k){var b=bqState(),A=b.act[k];if(!A||A.done||A.ty!=="p")return 0;var t=today();
  if(A.daily&&A.days&&A.days[t]){pop("That one counts once a day. Post the next one tomorrow.");return 0}
  A.got=(A.got||0)+1;A.days=A.days||{};A.days[t]=1;persist();if(A.got<A.need)pop(A.n+": "+A.got+" of "+A.need);bqTick();render();return 1}
if(typeof phPublish==="function"){var bqPub=phPublish;phPublish=async function(src,cap){var arm=BQARM;var ok=await bqPub.apply(this,arguments);
  try{if(ok&&arm&&Date.now()-arm.t<15*60000){BQARM=null;bqPhoto(arm.k)}}catch(e){}return ok}}
function bqLeft(ms){var m=Math.max(0,Math.ceil(ms/60000));if(m>=36*60)return Math.round(m/1440)+" days left";if(m>=120)return Math.round(m/60)+" hours left";if(m>=60)return "1h "+(m-60)+"m left";return m+" min left"}
function bqCard(k){var b=bqState(),A=b.act[k],now=Date.now(),lab=k+"-day bounty",pay='<span class="chip coin2">+'+BQPAY[k]+' coins</span>';
  if(A){var xp=A.ty==="q"?Math.round(A.xp*(k===1?1.5:2)):A.xp,name=A.ty==="d"&&A.vs?"Gym Challenge vs "+A.vs:A.n,
      why=A.ty==="d"&&A.vs?"Most Training XP by the end wins the pot"+(A.stake?" of "+(2*A.stake).toLocaleString()+" coins":"")+". Finish it to complete the bounty.":A.why,btn="";
    if(A.done)return '<div class="bty-card bq done"><span class="label">'+lab+' &middot; done</span><b>'+esc(name)+'</b><div class="bty-row"><span class="chip done">Completed</span><span class="note">Next one in '+bqLeft(Math.max(A.end,A.t0+k*864e5)-now).replace(" left","")+'</span></div></div>';
    if(A.ty==="q")btn='<span class="chip">On your board</span>';
    else if(A.ty==="p")btn='<button class="btn" data-act="bqphoto" data-k="'+k+'">Post a photo</button><span class="chip">'+(A.got||0)+' of '+A.need+'</span>';
    else btn=A.vs?'<span class="chip">Challenge on</span>':A.wait?'<span class="chip">Waiting for '+esc(A.wait)+'</span>':'<button class="btn" data-act="bqduel" data-k="'+k+'">Challenge a player</button>';
    return '<div class="bty-card bq on"><button type="button" class="bq-x" data-act="bqdrop" data-k="'+k+'" aria-label="Give up this bounty">&times;</button><span class="label">'+lab+' &middot; '+bqLeft(A.end-now)+'</span><b>'+esc(name)+'</b><small>'+esc(why)+'</small>'
      +'<div class="bty-row"><span class="chip xp">+'+xp+' XP</span>'+pay+btn+'</div></div>'}
  if(bqRunning()>=2)return '';var x=bqOffer(k);if(!x)return '';var xo=x.ty==="q"?Math.round(x.xp*(k===1?1.5:2)):x.xp,back=b.hold[k]&&b.hold[k].pi===x.pi;
  return '<div class="bty-card bq"><span class="label">'+lab+(back?' &middot; '+bqLeft(b.hold[k].end-now):'')+'</span><b>'+esc(x.n)+'</b><small>'+esc(x.why)+'</small>'
    +'<div class="bty-row"><span class="chip xp">+'+xo+' XP</span>'+pay+'<button class="btn" data-act="bqtake" data-k="'+k+'">Take it</button>'
    +'<button class="btn ghost" data-act="bqroll" data-k="'+k+'">'+(b.rr<BQRR?'Reroll':'Reroll &middot; '+BQCOST+' coins')+'</button></div></div>'}
btyHtml=function(){if(!S||!S.created)return '';try{if(typeof calmOn==="function"&&calmOn()&&calmDay()<3)return ''}catch(e){}
  var c='',b;try{b=bqState();c=bqCard(1)+bqCard(2)+bqCard(3)}catch(e){c=''}
  return c?'<section class="card panel bty"><div class="row" style="justify-content:space-between"><h3 class="label">Bounties</h3><span class="note mono">'+(b.rr<BQRR?(BQRR-b.rr)+' reroll'+(BQRR-b.rr===1?'':'s')+' left today':'Rerolls: '+BQCOST+' coins')+'</span></div><div class="bty-grid">'+c+'</div></section>':''};
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-act=bqtake],[data-act=bqroll],[data-act=bqdrop],[data-act=bqphoto],[data-act=bqduel]");if(!t)return;e.preventDefault();e.stopPropagation();
  var k=+t.dataset.k,a=t.dataset.act;if(k!==1&&k!==2&&k!==3)return;
  if(a==="bqtake"){bqTake(k);return}
  if(a==="bqroll"){bqRoll(k);return}
  if(a==="bqdrop"){bqDrop(k);return}
  if(a==="bqphoto"){var A=bqState().act[k];if(!A)return;if(!bqPhotos()||typeof phNew!=="function"){pop("Photos need the Town Hall's photo board (an online save)");return}
    BQARM={k:k,t:Date.now()};phNew();setTimeout(function(){try{var c=document.getElementById("phcap");if(c&&!c.value)c.value="Bounty: "+A.n+(A.need>1?" ("+((A.got||0)+1)+"/"+A.need+")":"")}catch(x){}},350);return}
  if(a==="bqduel"){if(!bqOthers()||typeof dlNew!=="function"){pop("Nobody to challenge yet");return}try{DL.f.kind="w";DL.f.days=3}catch(x){}dlNew();return}},true);
/* bounties are checked after every tick of a quest, a few seconds after the game opens and every 20 s (a timer running out, a challenge
   accepted or over, a finished slot opening again); never from inside the Board's own drawing, since finishing one pays and redraws */
/* QA 11-24 (FIX): unticking a finished chore bounty's quest kept the bounty's coins, the one undo that did not undo. The untick takes
   them back and reopens the bounty on its own clock, as uncreditStreak does for the Weekly Quest. */
function bqUndo(){var b=bqState(),ch=0;[1,2,3].forEach(function(k){var A=b.act[k];if(!A||!A.done||A.ty!=="q"||!A.qid)return;
    if(S.done&&S.done[A.qid])return;if(!S.quests.some(function(q){return q&&q.id===A.qid}))return;
    var c=BQPAY[A.k]||0;S.coins-=c;S.earnedC=Math.max(0,(S.earnedC||0)-c);A.done=0;delete A.at;ch=1});
  if(ch)persist();return ch}
var bqToggle=toggle;toggle=function(){var r=bqToggle.apply(this,arguments);try{var u=bqUndo();if(bqTick()||u)render()}catch(e){}return r};
/* QA 11-24 (NOTE): a photo counts only when it is posted from the composer the card opened. Backing out of it disarms the card, so
   an unrelated Town Hall photo a few minutes later does not count. */
function bqDisarm(){try{if(BQARM&&Date.now()-BQARM.t>900&&!document.getElementById("phcap")&&!(typeof PH!=="undefined"&&PH.posting))BQARM=null}catch(e){}}
document.addEventListener("click",function(){setTimeout(bqDisarm,450)},true);
function bqBeat(){bqDisarm();try{if(S&&S.created&&loaded&&!document.hidden){if(bqTick()&&view==="board"&&!document.querySelector("#layer .modal"))render()}}catch(e){}}
setTimeout(bqBeat,4000);setInterval(bqBeat,20000);
htabCss("qb-bq-css",".bty-card.bq{position:relative}.bq-x{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--muted,inherit);font-size:17px;line-height:1;cursor:pointer}.bq-x:hover{color:var(--fg);border-color:var(--accent)}"
  +".bty-card.bq.on{border-color:var(--gold,#ffc857)}.bty-card.bq .label{padding-right:30px}.chip.coin2{color:var(--gold,#ffc857);border-color:var(--gold,#ffc857)}.bty-card.bq.done{opacity:.75}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV147={state:bqState,offer:bqOffer,take:bqTake,drop:bqDrop,roll:bqRoll,tick:bqTick,photo:bqPhoto,running:bqRunning,pool:bqPool,pay:BQPAY,P3:BTY3P,
  arm:function(k){if(k!==undefined)BQARM=k?{k:k,t:Date.now()-1000}:null;return BQARM?BQARM.k:0},disarm:bqDisarm,photosOn:function(v){bqPhotos=v==null?bqPhotos:function(){return !!v}},othersOn:function(v){bqOthers=function(){return !!v}},duel:function(f){bqDuel=f}};
