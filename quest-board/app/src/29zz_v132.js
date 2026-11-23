/* ---------- Cal's 2026-11-23 list, part 2: the game master, a fresh drop order, starting over, official notices ----------
   Cal: "Randomize the clothing drop order so i can be surprised as well. Only for my character profile only as the game master, show me
   the clothing drops 1 day before so i can do a quality check on the clothes going into the shop", "give users an option to reset progress
   in their character profile screen", "post a notice in the board that says latest version is now live ... Give a 500 coin reward for any
   official notices that we release in the message board". */

/* ---- the game master: Cal's account (web/config.js owners, the same list firestore.rules trusts); the sandbox build counts too ---- */
function qbGM(){try{var W=window.QB_WEB;if(!W)return false;if(W.sandbox)return true;return !!(typeof MYUID!=="undefined"&&MYUID&&(W.owners||[]).indexOf(MYUID)>=0)}catch(e){return false}}

/* ---- a fresh drop order from DROPS.shuf2 on, with a seed nobody has seen (not even Cal, who reads the drops a day ahead in the Shop).
   Every drop before shuf2 stays as it was (29zz_ncstreet.js); from it, each floor's rounds are shuffled anew with seed2, by the same rule
   (a brand rests after it leaves, held brands wait their turn). If this ships after shuf2's 8 am, move shuf2 to the next drop day. ---- */
DROPS.shuf2="2026-11-30";DROPS.seed2="v132-9f4c27e1b";
var D3J={},D3={},d3Fl=flOrderAt;
function d3J2(F){if(D3J[F.id]!=null)return D3J[F.id];var d=zxSlotDays(F,400),j=0;while(j<d.length&&d[j]<DROPS.shuf2)j++;return D3J[F.id]=j}
function d3Ord(F,ids,upto){var lv=F.live||DROPS.live,k=F.id+"|"+ids.join(",")+"|"+lv+"|"+DROPS.shuf2+"|"+DROPS.seed2+"|"+JSON.stringify(DROPS.hold||[]),c=D3[k];
  if(!c){var j2=d3J2(F),ord=[];for(var j=0;j<j2;j++)ord.push(d3Fl(F,ids,j));c=D3[k]={ord:ord,days:[],bag:[],r:0}}
  if(c.days.length<=upto+1)c.days=zxSlotDays(F,upto+40);
  var ord=c.ord;
  while(ord.length<=upto){var at=ord.length,day=c.days[at]||"9999",last={};ord.forEach(function(id,i){if(id!=null)last[id]=i});
    var fr=ids.filter(function(id){return !zxHeld(id,day)}),gap=lv+Math.max(1,Math.floor((fr.length-lv)/2)),
      cool=function(g){return function(id){return last[id]==null||at-last[id]>g}};
    var el=c.bag.filter(function(id){return fr.indexOf(id)>=0&&cool(gap)(id)});
    if(!el.length){c.bag=c.bag.concat(dropShuffle(fr.filter(function(id){return c.bag.indexOf(id)<0}),DROPS.seed2+"|"+F.id+"|"+(c.r++)));
      el=c.bag.filter(function(id){return fr.indexOf(id)>=0&&cool(gap)(id)})}
    if(!el.length)el=fr.filter(cool(gap));if(!el.length)el=fr.filter(cool(lv));if(!el.length)el=fr.length?fr:ids;
    var pick=el[0],bi=c.bag.indexOf(pick);if(bi>=0)c.bag.splice(bi,1);ord.push(pick)}
  return ord[upto]}
flOrderAt=function(F,ids,j){try{if(!ids||!ids.length||(F.id==="street"&&DROPS.on)||j<d3J2(F))return d3Fl.apply(this,arguments);
  if(!DROPS.rerun&&j>=ids.length)return null;return d3Ord(F,ids,j)}catch(e){return d3Fl.apply(this,arguments)}};

/* ---- the game master's preview: from a day before a drop, the Shop has a "Next drop" tab with what each floor gets, piece by piece ---- */
function gmNextDrop(){var n=dropNow(),base=dropYmd(n);
  for(var d=0;d<8;d++){var ymd=ymdAdd(base,d),t=dropStart(ymd);if(t<=n)continue;var out=[];
    (ECON.floors||[]).forEach(function(F){var a=dropFloor(n,F),b=dropFloor(t+60000,F),was={};((a&&a.live)||[]).forEach(function(x){was[x.id]=1});
      ((b&&b.live)||[]).forEach(function(x){if(!was[x.id])out.push({fl:F,b:x})})});
    if(out.length)return {t:t,ymd:ymd,list:out}}
  return null}
function gmTab(){var nd=gmNextDrop();if(!nd)return '<p class="qs-note">No drop in the next week.</p>';
  var h='<p class="qs-note qs-lead">Only you see this. It goes on sale '+esc(new Date(nd.t).toLocaleString([],{weekday:"long",hour:"numeric",minute:"2-digit"}))+'.</p>';
  nd.list.forEach(function(q){var its=SHOP.filter(function(it){return it[6]&&it[6].b===q.b.id&&!it[6].cut&&!it[6].gone&&isRigItem(it)});
    h+='<section class="qs-sec"><h3>'+esc(q.fl.name||q.fl.id)+': '+esc(q.b.name)+' ('+its.length+' pieces)</h3><div class="qs-grid">'+its.map(function(it){
      return '<article class="qs-card" data-card="'+esc(it[0])+'">'+qsThumb(it)+'<h4>'+esc(it[2])+'</h4><p>'+esc(it[5]||"")+'</p><span class="qs-btn ghost"><i class="coin"></i>'+it[3].toLocaleString()+'</span></article>'}).join("")+'</div></section>'});
  return h}
var gmShop=shopHtml;shopHtml=function(){var want=shopTab==="gmnext"&&qbGM();if(want){shopTab="wardrobe";window._qsSeen=1}var h=gmShop.apply(this,arguments);
  try{if(qbGM()){var nd=gmNextDrop(),soon=nd&&nd.t-dropNow()<=864e5;
    if(soon||want){h=h.replace(/(<nav class="qs-tabs" aria-label="Shop sections">)/,'$1<button class="qs-tab'+(want?" on":"")+'" data-act="stab" data-v="gmnext">Next drop</button>');
      if(want){shopTab="gmnext";h=h.replace(/(<button class="qs-tab qs-wdb) on(" data-act="stab" data-v="wardrobe">)/,'$1$2');
        var a=h.indexOf('<p class="qs-note qs-lead">Everything you own'),b=h.indexOf('<p class="qs-dev">');if(b<0)b=h.lastIndexOf('</div>');if(a>=0&&b>a)h=h.slice(0,a)+gmTab()+h.slice(b)}}}}catch(e){}
  return h};

/* ---- starting over, from the profile ---- */
var rsProf=profileHtml;profileHtml=function(){var h=rsProf.apply(this,arguments);
  return h+'<section class="card panel rsp"><h3 class="label">Start over</h3><p class="note">Reset your character to level 1: no coins, rooms or clothes, a new character to make.</p><button class="btn ghost" data-act="rspask">Reset progress</button></section>'};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=rspask],[data-act=rspok]");if(!b)return;
  if(b.dataset.act==="rspask"){modal('<div class="card box2"><span class="label">Start over</span><h3>Reset your progress?</h3><p class="note">Your level, XP, coins, rooms, clothes and pet all go, and you make a new character. This cannot be undone.</p><div class="row"><button class="btn" data-act="rspok">Reset everything</button><button class="btn ghost" data-act="mclose">Keep playing</button></div></div>');return}
  /* the old save is kept as a backup (on this device and in the cloud), as every version keeps the one before */
  var old=JSON.stringify(S);try{localStorage.setItem("quest-board-backup-reset",old)}catch(x){}
  try{if(db&&MYUID)db.doc("data/users/"+MYUID+"/backup_reset").set(JSON.parse(old)).catch(function(){})}catch(x){}
  try{closeModals()}catch(x){}S=fresh();view="board";persist();render();window.scrollTo(0,0)});

/* ---- official notices on the Town board: pinned at the top of Posts, 500 coins each, once per player ---- */
var NOTICES=[
  {id:"n131",d:"2026-11-23",title:"The latest version is live",text:"A new version of the game is live. It is still a work in progress, so expect changes as we go. I hope this becomes a way for all of us to be productive, through accountability and a little competition. Have fun, and get after it."}];
var NOTICECOINS=500;
function ntPaid(){if(!S.notices||typeof S.notices!=="object")S.notices={};return S.notices}
function ntHtml(){var P=ntPaid();return NOTICES.slice().reverse().map(function(n){var got=!!P[n.id];
  return '<section class="card panel ntc"><span class="label">Official notice &middot; '+esc(n.d)+'</span><h3>'+esc(n.title)+'</h3><p>'+esc(n.text)+'</p>'
    +(got?'<small class="note">Collected <i class="coin"></i>'+NOTICECOINS+'</small>':'<button class="btn" data-act="ntget" data-id="'+esc(n.id)+'">Collect <i class="coin"></i>'+NOTICECOINS+'</button>')+'</section>'}).join("")}
var ntPosts=htabPosts;htabPosts=function(){var h=ntPosts.apply(this,arguments);try{return ntHtml()+h}catch(e){return h}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=ntget]");if(!b)return;var id=b.dataset.id,P=ntPaid();
  if(P[id]||!NOTICES.some(function(n){return n.id===id}))return;P[id]=Date.now();S.coins+=NOTICECOINS;S.earnedC=(S.earnedC||0)+NOTICECOINS;try{qbSnd("coins")}catch(x){}persist();render();pop("+"+NOTICECOINS+" coins")});
(function(){var st=document.createElement("style");st.textContent='.ntc{border:1px solid var(--accent,#9b7bff)}.ntc h3{margin:4px 0}.ntc p{margin:6px 0 10px;line-height:1.4}.rsp .btn{margin-top:6px}';document.head.appendChild(st)})();
/* each player's worlds/<id> doc carries the save epoch, so after a reset of everyone (QB_EPOCH) the Town lists only players who have
   played since (30_app_b.js socLoad), not last epoch's levels and coins */
var epWorld=socWorldDoc;socWorldDoc=function(){var d=epWorld.apply(this,arguments);try{d.ep=QB_EPOCH}catch(e){}return d};
