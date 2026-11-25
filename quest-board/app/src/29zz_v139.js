/* ---------- Cal 11-23: Players, player cards and friendship ----------
   Cal: "As for the players tab in the town hall, remove the richest and highest level tab. The default players tab should just be a
   leaderboard of the highest level. Clicking on a user's player icon in any of the chat rooms or posts or player tab should open up
   their player card where we can say wave, or fist bump, or high 5, which increases your friendship level. Higher friendship level means
   you get more and more coins next time you high five them. You can only wave, fist bump, or high five 2 different people per day. Max
   friendship level is 10 for now. It should take a while to get to friendship level 10 where you then unlock a special outfit piece that
   only you two share. More to come on this later."
   - Players: one leaderboard, by level (Fashion beside it once that opens). No Most rich, no Highest level tab.
   - A player's card opens from their picture in chat, their name on a town board post, the photo they posted, and the leaderboard.
   - Friendship: each greeting counts once per person per day. Each player's pings/<id> doc keeps fr: {other: greetings sent}; a pair's
     points are both sides added together, so both see the same level. Levels 1 to 10 at 1, 3, 6, 10, 15, 21, 28, 36, 45 and 55 points:
     greeting each other every day, level 10 is about a month away; one-sided, about two.
   - A greeting pays the sender and the one greeted 5 + 5 x the pair's level (5 at level 0, 55 at level 10); the one greeted once per
     sender per day, when their game sees it.
   - 2 different people a day (S.social.sqDay), and the same person once a day.
   - Level 10 says a shared outfit piece is coming (Cal: "More to come on this later"); no piece yet. */
var V39FR=[1,3,6,10,15,21,28,36,45,55],V39FRMAX=10;
function v39Lv(pts){var l=0;for(var i=0;i<V39FR.length;i++)if(pts>=V39FR[i])l=i+1;return Math.min(V39FRMAX,l)}
function v39Pts(uid){var F=SQ.frMine||{},T=SQ.frTheirs||{};return (+F[uid]||0)+(+T[uid]||0)}
function v39Pay(uid){return 5+5*v39Lv(v39Pts(uid))}
function v39Day(){var o=socState(),d=o.sqDay;if(!d||d.d!==today()){d=o.sqDay={d:today(),to:{}}}return d}

/* ---- Players: the leaderboard ---- */
FSHMODES=[["level","Leaderboard"],["fashion","Fashion"]];if(FSH.mode==="rich")FSH.mode="level";
var v39Tg=fshTg;fshTg=function(){var h=v39Tg.apply(this,arguments);return (h.match(/data-m=/g)||[]).length<2?"":h};
var v39Head=fshHead;fshHead=function(mode){if(mode==="level")return '';return v39Head.apply(this,arguments)};
fshStats=function(p){return '<span><b>Lv '+p.lv+'</b></span>'+(p.me?'':'<span>'+v39FrLine(p.id)+'</span>')};

/* ---- the card: friendship and the greetings ---- */
function v39FrLine(uid){var pts=v39Pts(uid),l=v39Lv(pts);if(l>=V39FRMAX)return '<b>Friendship '+l+'</b> &middot; max';
  return '<b>Friendship '+l+'</b> &middot; '+(V39FR[l]-pts)+' to go'}
function v39FrBox(p){if(p.me)return "";var pts=v39Pts(p.id),l=v39Lv(pts),d=v39Day(),done=!!d.to[p.id],full=Object.keys(d.to).length>=2&&!done,pay=v39Pay(p.id);
  var pc=l>=V39FRMAX?100:Math.round(100*(pts-(l?V39FR[l-1]:0))/Math.max(1,V39FR[l]-(l?V39FR[l-1]:0)));
  return '<div class="v39fr"><div class="v39frh"><b>Friendship level '+l+'</b><small>'+(l>=V39FRMAX?'Max':'Level '+(l+1)+' in '+(V39FR[l]-pts)+' more')+'</small></div><i class="v39bar"><b style="width:'+pc+'%"></b></i>'
    +'<p class="note">'+(l>=V39FRMAX?'Best friends. A piece of clothing only you two share is coming.':done?'You greeted '+esc(p.name)+' today. Come back tomorrow.':full?'You have greeted 2 people today. Come back tomorrow.':'A greeting pays you both '+pay+' coins. You can greet 2 different people a day.')+'</p></div>'}
var v39View=fshViewHtml;fshViewHtml=function(p){var h=v39View.apply(this,arguments);try{if(!p.me){var d=v39Day(),off=!!d.to[p.id]||(Object.keys(d.to).length>=2);
    h=h.replace('<div class="sq-acts">',v39FrBox(p)+'<div class="sq-acts">');if(off)h=h.replace(/(<button type="button" class="btn" data-act="sqgo")/g,'$1 disabled')}}catch(e){}return h};

/* ---- greeting ---- */
sqSend=function(uid,k){if(!socOn()||!Object.prototype.hasOwnProperty.call(SQK,k))return;var w=SOC.worlds.filter(function(x){return x.id===uid})[0];if(!w)return;var t=Date.now();
  if(t-SQ.lastSend<2500){pop("One at a time");return}var d=v39Day();if(d.to[uid]){pop("You greeted "+w.name+" today. Come back tomorrow.");return}
  if(Object.keys(d.to).length>=2){pop("You can greet 2 people a day");return}
  SQ.lastSend=t;closeModals();var pay=v39Pay(uid);
  SQ.shown[MYUID+"|"+uid+"|"+t]=1;SQ.feed.unshift({from:MYUID,fromName:(S.char&&S.char.name)||"Neighbor",to:uid,k:k,t:t});sqPaint();sqPlay(MYUID,uid,k);
  socMine("pings",function(dd){var m=dd.emo&&typeof dd.emo==="object"?dd.emo:{},cut=t-14*864e5;Object.keys(m).forEach(function(x){if(!m[x]||(m[x].t||0)<cut)delete m[x]});m[uid]={k:k,t:t};dd.emo=m;
      var fr=dd.fr&&typeof dd.fr==="object"?dd.fr:{};fr[uid]=Math.min(9999,(+fr[uid]||0)+1);dd.fr=fr;dd.fromName=String((S.char&&S.char.name)||"Neighbor").slice(0,24)})
    .then(function(){var before=v39Lv(v39Pts(uid));if(!SQ.frMine)SQ.frMine={};SQ.frMine[uid]=(+SQ.frMine[uid]||0)+1;d.to[uid]=t;S.coins+=pay;S.earnedC+=pay;persist();try{render()}catch(x){}
      var after=v39Lv(v39Pts(uid));pop("You "+SQK[k][2]+" "+w.name+"  +"+pay+" coins"+(after>before?" · Friendship level "+after+"!":""))})
    .catch(function(er){pop("Could not send: "+((er&&er.code)||"error"))})};
/* reading everyone's greetings: the feed, friendship from both sides, and the one greeted paid once per sender a day */
sqScan=async function(){if(!socOn())return;var q=await db.collection("pings").limit(200).get(),all=[],now=Date.now(),mine={},theirs={};
  (q.docs||[]).forEach(function(d){var x=d.data();if(!x)return;var fr=x.fr&&typeof x.fr==="object"?x.fr:null;
    if(fr){if(d.id===MYUID)Object.keys(fr).forEach(function(u){mine[u]=Math.min(9999,+fr[u]||0)});else if(fr[MYUID])theirs[d.id]=Math.min(9999,+fr[MYUID]||0)}
    var m=x.emo;if(!m||typeof m!=="object")return;
    Object.keys(m).forEach(function(to){var e=m[to];if(!e||!sqKind(e.k)||now-(+e.t||0)>864e5)return;all.push({from:d.id,fromName:x.fromName||"Neighbor",to:to,k:e.k,t:+e.t})})});
  SQ.frMine=mine;SQ.frTheirs=theirs;
  all.sort(function(a,b){return b.t-a.t});SQ.feed=all.slice(0,8);
  var o=socState(),seen=o.sqSeen||(o.sqSeen={}),got=[],td=today();
  /* the once-a-day mark has its own store: sqPaid() (29p_square.js) drops social.sqt.got entries that do not read as a time within 2 hours,
     so a date there was gone on the next read (QA 11-23) */
  var G=o.sqGotD&&typeof o.sqGotD==="object"?o.sqGotD:(o.sqGotD={});Object.keys(G).forEach(function(u){if(G[u]!==td)delete G[u]});
  all.forEach(function(e){if(e.to!==MYUID||e.from===MYUID||(seen[e.from]||0)>=e.t)return;seen[e.from]=e.t;var pay=0;
    if(G[e.from]!==td){pay=5+5*v39Lv(Math.max(0,v39Pts(e.from)-1))/* the level before this greeting, as the sender was paid */;G[e.from]=td;S.coins+=pay;S.earnedC+=pay}got.push({e:e,pay:pay})});
  try{fshModalPaint()}catch(x){}
  if(!got.length)return;persist();try{if(got.some(function(g){return g.pay}))render()}catch(x){}
  got.forEach(function(g,i){setTimeout(function(){pop(sqName(g.e.from,g.e.fromName)+" "+sqKind(g.e.k)[2]+" you "+sqKind(g.e.k)[0]+(g.pay?"  +"+g.pay+" coins":""))},i*2400)})};
/* the card refreshes its friendship line when the greetings are read */
var v39MP=fshModalPaint;fshModalPaint=function(){v39MP.apply(this,arguments);try{var m=document.querySelector("#layer .modal.fsh-modal");if(!m)return;var p=fshFind(m.getAttribute("data-u"));if(!p||p.me)return;var b=m.querySelector(".v39fr");if(b){var h=v39FrBox(p);if(b.outerHTML!==h)b.outerHTML=h}}catch(e){}};
var v39Open=fshView;fshView=function(uid){var r=v39Open.apply(this,arguments);try{sqScan()}catch(e){}return r};

/* ---- a player's picture opens their card: chat, photo posts (the town board's names are in 30_app_b.js) ---- */
var v39Av=tchAv;tchAv=function(m,w){var h=v39Av.apply(this,arguments);if(!m||m.id===MYUID||!w)return h;return '<button type="button" class="v39who v39avb" data-act="fshview" data-u="'+esc(m.id)+'" aria-label="'+esc(m.name||"Player")+'\'s card">'+h+'</button>'};
var v39Ph=phViewHtml;phViewHtml=function(p){var h=v39Ph.apply(this,arguments);if(!p||p.u===MYUID)return h;
  return h.replace('<div class="ph-vhead">','<div class="ph-vhead v39who" role="button" tabindex="0" data-act="fshview" data-u="'+esc(p.u)+'">')};
(function(){var st=document.createElement("style");st.textContent=".v39who{cursor:pointer}.v39avb{padding:0;border:0;background:none;color:inherit;font:inherit}"
  +".v39fr{margin:10px 0;padding:10px;border-radius:12px;background:var(--surface2);text-align:left}.v39frh{display:flex;justify-content:space-between;align-items:baseline;gap:8px}"
  +".v39bar{display:block;height:8px;border-radius:999px;background:rgba(255,255,255,.1);margin:6px 0;overflow:hidden}.v39bar b{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2))}"
  +".sq-acts .btn[disabled]{opacity:.45}";document.head.appendChild(st)})();
/* ---- kind notes to Cal (Cal 11-23: "For the nice notes to me, make it always private unless i choose to post it in the town hall where it
   posts just for 48 hours. Make the reward 500 coins only if i choose to accept the coins."): Cal's queue answers each note with two
   choices, the 500 coins and a post, in any mix: "+500", "+500 and post", "Post only", "No". A posted note goes on Cal's town board for 48
   hours (board/<Cal> post with until; 30_app_b.js drops it after), as "A note from <name>". Otherwise nothing is shown anywhere. ---- */
KD.max=500;KD.pick=[500];
async function v39KdAnswer(uid,id,c,post){var r=KD.all.filter(function(x){return x.uid===uid&&x.id===id})[0];if(!r||!kdOwner())return;
  try{var ref=db.doc("kudosok/"+uid),s=await ref.get(),d=s.exists?(s.data()||{}):{};if(!d.items||typeof d.items!=="object")d.items={};var t=Date.now();
    d.items[id]={ok:c>0,c:c,text:"",name:r.name,d:r.d,t:t,post:post?1:0};
    var ks=Object.keys(d.items).sort(function(a,b){return (d.items[b].t||0)-(d.items[a].t||0)});ks.slice(30).forEach(function(k){delete d.items[k]});
    d.name=r.name;d.t=t;await ref.set(d);
    if(post){var tx=("A note from "+r.name+": \u201C"+String(r.text||"").slice(0,240)+"\u201D").slice(0,280);
      await socMine("board",function(b){var a=Array.isArray(b.posts)?b.posts:[];a.unshift({t:t,text:tx,look:lookOf(),kd:1,until:t+48*36e5});b.posts=a.slice(0,10)});
      try{SOC.posts.unshift({id:MYUID+"|"+t,from:MYUID,name:(S.char&&S.char.name)||"Cal",text:tx,t:t,look:lookOf(),kd:1});socPaint()}catch(x){}}
    pop(c>0&&post?r.name+" gets 500 coins, and the note is posted for 48 hours":c>0?r.name+" gets 500 coins":post?"Posted for 48 hours":"Passed on "+r.name+"'s note");
    KD.all=KD.all.filter(function(x){return x!==r});await kdLoad()}
  catch(e){pop("Could not save ("+((e&&e.code)||"error")+")")}}
var v39KdHtml=kdHtml;kdHtml=function(){if(!kdOwner()){var h=v39KdHtml.apply(this,arguments);
    return h.replace(/If he approves yours, it is pinned in the Town Hall and up to [\d,]+ coins land in your account\./,"If he likes it, he can send you 500 coins, and he might post it on the Town Hall board for 2 days. Otherwise it stays between you two.")
      .replace(/Approved and pinned, \+([\d,]+) coins/g,"Cal sent you +$1 coins")};
  var h='<h3>Kind words</h3><p class="note">They stay private unless you post one: it goes on the Town Hall board for 48 hours. The 500 coins go only if you choose them. One note per person a day.</p>';
  h+=KD.all.length?KD.all.map(function(r){var a='data-u="'+esc(r.uid)+'" data-i="'+esc(r.id)+'"';return kdNote(r,'<div class="kdgo"><button class="btn" data-kd="v39" '+a+' data-c="500" data-p="0">+500</button><button class="btn" data-kd="v39" '+a+' data-c="500" data-p="1">+500 and post</button><button class="btn ghost" data-kd="v39" '+a+' data-c="0" data-p="1">Post only</button><button class="btn ghost" data-kd="v39" '+a+' data-c="0" data-p="0">No</button></div>')}).join(""):'<p class="note">'+(KD.t?'Nothing waiting.':'Loading...')+'</p>';
  if(KD.done.length)h+='<details><summary class="note">Answered ('+KD.done.length+')</summary>'+KD.done.map(function(r){var a=r.a||{};return kdNote(r,'<small class="'+(a.ok||a.post?'kdok':'kdno')+'">'+(a.ok?'+'+kdFmt(a.c)+' coins':'No coins')+(a.post?', posted for 48 hours':'')+'</small>')}).join("")+'</details>';
  return '<div class="card box2 kd">'+h+'</div>'};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-kd="v39"]');if(!b)return;b.disabled=true;v39KdAnswer(b.dataset.u,b.dataset.i,+b.dataset.c||0,b.dataset.p==="1")});
/* the writer's own list says what Cal chose */
var v39KdNote=kdNote;kdNote=function(n,tail){try{if(tail&&/Not this time/.test(tail)&&!kdOwner()){var a=null,mine=KD.ok[MYUID]||{};Object.keys(mine).forEach(function(k){var x=mine[k];if(x&&x.d===n.d&&x.post)a=x});if(a)tail='<small class="kdok">Posted in the Town Hall for 2 days</small>'}}catch(e){}return v39KdNote.call(this,n,tail)};

/* a window held back for a tour (29zz_v135.js) goes too when the game closes its windows, so a stale card never comes up later */
var v39Close=closeModals;closeModals=function(){var r=v39Close.apply(this,arguments);try{document.querySelectorAll("#layer .qb-held").forEach(function(m){m.remove()})}catch(e){}return r};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV139={lv:v39Lv,pts:v39Pts,pay:v39Pay,sq:SQ,day:v39Day,box:v39FrBox};
