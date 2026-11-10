/* ---------- Kind words for coins (Cal, 2026-11-09) ----------
   Cal: "If people want more coins, there can be a button at the top right. In order to get more coins, 1500 coins max per day,
   they can write me a very nice message and it gets pinned to the town hall. If me and ONLY me approves it, then the coins get
   deposited into their account. But it has to be something nice about me or something funny"
   - The + by the coin count opens it. A player writes one note a game day (the day starts at 5 am) to kudos/<their id>
     {name, items:[{id,text,d,t}]}, their last 10.
   - Cal's + opens his queue instead: every note he has not answered, with 500 / 1,000 / 1,500 or No. His answers go to
     kudosok/<their id> {name, items:{<note id>:{ok,c,text,name,d,t}}}, which the rules let only the owner write, so nobody
     else can approve a note, not even by editing their own docs (firestore.rules).
   - The writer's game reads its kudosok doc and pays each approved note once (S.kudos.paid), never more than 1,500 for one day.
   - Approved notes are pinned at the top of the Town Hall's Posts tab, newest first. */
var KD={max:1500,pick:[500,1000,1500],mine:null,ok:{},all:[],done:[],pins:[],busy:0,t:0,guest:0,boot:0};
function kdOn(){return typeof socOn==="function"&&socOn()&&loaded&&S&&S.created}
function kdOwner(){return !!(ownerView&&MYUID)&&!KD.guest}
function kdSt(){if(!S.kudos||typeof S.kudos!=="object")S.kudos={};var k=S.kudos;if(!k.paid)k.paid={};if(!k.day)k.day={};return k}
function kdFmt(n){return Math.round(n).toLocaleString()}
function kdDate(d){var x=new Date(String(d)+"T12:00:00");return isNaN(x)?"":x.toLocaleDateString(undefined,{month:"short",day:"numeric"})}
htabCss("qb-kudos-css",
  ".kdbtn{position:relative;width:28px;height:28px;border-radius:50%;border:1px solid color-mix(in srgb,var(--gold) 60%,transparent);background:color-mix(in srgb,var(--gold) 16%,var(--surface2));color:var(--gold);font:800 17px/1 var(--font-mono,monospace);cursor:pointer;padding:0;display:inline-grid;place-items:center}"
  +".kdbtn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}"
  +".kdbtn i{position:absolute;top:-5px;right:-6px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:#ff4d5e;color:#fff;font:700 10px/16px var(--font-body,system-ui);font-style:normal}"
  +".kd textarea{width:100%;min-height:96px;resize:vertical;box-sizing:border-box;border-radius:12px;border:1px solid var(--line);background:var(--surface2);color:var(--fg);font:inherit;padding:10px}"
  +".kd .kdrow{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:8px}"
  +".kd .kdn{border-top:1px solid var(--line);padding:10px 0}.kd .kdn:first-of-type{border-top:0}"
  +".kd .kdn q{display:block;white-space:pre-wrap;overflow-wrap:anywhere;margin:4px 0 6px;line-height:1.4}"
  +".kd .kdn q::before,.kd .kdn q::after,.kdpin q::before,.kdpin q::after{content:none}"
  +".kd .kdgo{display:flex;flex-wrap:wrap;gap:6px}.kd .kdgo .btn{flex:1 1 auto;min-width:64px}"
  +".kd .kdok{color:var(--good,#5fe3a1)}.kd .kdno{color:var(--muted)}"
  +".kdpin .kdn{border-top:1px solid var(--line);padding:10px 0}.kdpin .kdn:first-of-type{border-top:0}"
  +".kdpin q{display:block;font-size:15px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;margin-bottom:4px}");

/* ---- reading: Cal's answers (everyone), and the notes themselves (the writer reads theirs, Cal reads all) ---- */
async function kdLoad(){if(!kdOn()||KD.busy)return;KD.busy=1;
  try{
    var oq=await db.collection("kudosok").limit(200).get(),ok={},pins=[];
    (oq.docs||[]).forEach(function(d){var x=d.data(),it=(x&&x.items)||{};ok[d.id]=it;
      Object.keys(it).forEach(function(k){var a=it[k];if(a&&a.ok&&a.text)pins.push({from:d.id,id:k,name:a.name||x.name||"Someone",text:a.text,c:+a.c||0,t:+a.t||0})})});
    pins.sort(function(a,b){return b.t-a.t});KD.ok=ok;KD.pins=pins.slice(0,20);
    if(kdOwner()){var nq=await db.collection("kudos").limit(200).get(),all=[],done=[];
      (nq.docs||[]).forEach(function(d){var x=d.data();((x&&x.items)||[]).forEach(function(n){if(!n||!n.id||!n.text)return;
        var a=(ok[d.id]||{})[n.id],r={uid:d.id,name:x.name||"Someone",id:n.id,text:n.text,d:n.d||"",t:+n.t||0,a:a||null};(a?done:all).push(r)})});
      all.sort(function(a,b){return a.t-b.t});done.sort(function(a,b){return (b.a.t||0)-(a.a.t||0)});KD.all=all;KD.done=done.slice(0,10)}
    else{var s=await db.doc("kudos/"+MYUID).get();KD.mine=s.exists?(s.data()||{}):{}}
    KD.err="";KD.t=Date.now();kdPay();
  }catch(e){KD.err=(e&&e.code)||"error"}
  KD.busy=0;kdPaint()}
/* the writer's game pays each approved note once, up to 1,500 for the day it was written */
function kdPay(){if(!MYUID)return;var it=KD.ok[MYUID]||{},k=kdSt(),got=0;
  Object.keys(it).forEach(function(id){var a=it[id];if(!a||!a.ok||k.paid[id]!=null)return;var d=a.d||today(),room=Math.max(0,KD.max-(k.day[d]||0)),c=Math.max(0,Math.min(+a.c||0,room));
    k.paid[id]=c;k.day[d]=(k.day[d]||0)+c;if(c){S.coins+=c;S.earnedC+=c;got+=c}});
  /* days more than two weeks back are never paid again (a note is one day's), so their totals go */
  var old=new Date(gameNow().getTime()-14*864e5).toISOString().slice(0,10);Object.keys(k.day).forEach(function(d){if(d<old)delete k.day[d]});
  if(got){persist();render();pop("Cal liked your note: +"+kdFmt(got)+" coins")}}

/* ---- writing ---- */
function kdToday(){return ((KD.mine&&KD.mine.items)||[]).filter(function(n){return n&&n.d===today()})[0]||null}
async function kdSend(text){text=String(text||"").replace(/\s+\n/g,"\n").trim().slice(0,280);
  if(text.length<12){pop("Write a little more than that");return}
  if(kdToday()){pop("One note a day. Write another tomorrow.");return}
  try{var ref=db.doc("kudos/"+MYUID),s=await ref.get(),d=s.exists?(s.data()||{}):{};d.items=(Array.isArray(d.items)?d.items:[]);
    if(d.items.some(function(n){return n&&n.d===today()})){KD.mine=d;kdPaint();pop("One note a day. Write another tomorrow.");return}
    d.items=d.items.concat([{id:Date.now().toString(36),text:text,d:today(),t:Date.now()}]).slice(-10);d.name=(S.char&&S.char.name)||"Someone";d.t=Date.now();
    await ref.set(d);KD.mine=d;pop("Sent to Cal");kdPaint()}
  catch(e){pop("Could not send ("+((e&&e.code)||"error")+"). Try again.")}}
/* Cal's answer: c coins, or 0 for no */
async function kdAnswer(uid,id,c){var r=KD.all.filter(function(x){return x.uid===uid&&x.id===id})[0];if(!r||!kdOwner())return;
  try{var ref=db.doc("kudosok/"+uid),s=await ref.get(),d=s.exists?(s.data()||{}):{};if(!d.items||typeof d.items!=="object")d.items={};
    d.items[id]={ok:c>0,c:c,text:c>0?r.text:"",name:r.name,d:r.d,t:Date.now()};
    /* the newest 30 answers are kept; an older paid note is never paid twice (the writer's save remembers it) */
    var ks=Object.keys(d.items).sort(function(a,b){return (d.items[b].t||0)-(d.items[a].t||0)});ks.slice(30).forEach(function(k){delete d.items[k]});
    d.name=r.name;d.t=Date.now();await ref.set(d);pop(c>0?"Approved: "+r.name+" gets "+kdFmt(c)+" coins":"Passed on "+r.name+"'s note");
    KD.all=KD.all.filter(function(x){return x!==r});await kdLoad()}
  catch(e){pop("Could not save ("+((e&&e.code)||"error")+")")}}

/* ---- drawing ---- */
function kdBtn(){if(!kdOn())return "";var n=kdOwner()?KD.all.length:0;
  return '<button class="kdbtn" data-kd="open" aria-label="'+(kdOwner()?'Kind words people wrote you'+(n?', '+n+' waiting':''):'Get more coins: write Cal a kind note')+'">+'+(n?'<i>'+n+'</i>':'')+'</button>'}
function kdNote(n,tail){return '<div class="kdn"><small class="note">'+(n.name?esc(n.name)+' &middot; ':'')+kdDate(n.d)+'</small><q>'+esc(n.text)+'</q>'+(tail||'')+'</div>'}
function kdHtml(){var h;
  if(kdOwner()){
    h='<h3>Kind words</h3><p class="note">Notes people wrote you for coins. Approve one and it is pinned in the Town Hall and the coins go to them. Only you can approve. One note per person a day, '+kdFmt(KD.max)+' coins at most.</p>';
    h+=KD.all.length?KD.all.map(function(r){return kdNote(r,'<div class="kdgo">'+KD.pick.map(function(c){return '<button class="btn" data-kd="ok" data-u="'+esc(r.uid)+'" data-i="'+esc(r.id)+'" data-c="'+c+'">+'+kdFmt(c)+'</button>'}).join("")
      +'<button class="btn ghost" data-kd="ok" data-u="'+esc(r.uid)+'" data-i="'+esc(r.id)+'" data-c="0">No</button></div>')}).join(""):'<p class="note">'+(KD.t?'Nothing waiting.':'Loading...')+'</p>';
    if(KD.done.length)h+='<details><summary class="note">Answered ('+KD.done.length+')</summary>'+KD.done.map(function(r){return kdNote(r,r.a.ok?'<small class="kdok">Approved, +'+kdFmt(r.a.c)+'</small>':'<small class="kdno">Passed</small>')}).join("")+'</details>'}
  else{var k=kdSt(),mine=((KD.mine&&KD.mine.items)||[]).slice().reverse(),ans=KD.ok[MYUID]||{},td=kdToday();
    h='<h3>Kind words for coins</h3><p class="note">Write Cal something genuinely nice about him, or make him laugh. He reads every note. If he approves yours, it is pinned in the Town Hall and up to '+kdFmt(KD.max)+' coins land in your account. One note a day.</p>';
    if(!KD.mine)h+='<p class="note">'+(KD.err?'Could not reach Cal right now ('+esc(KD.err)+').':'Loading...')+'</p>';
    else if(td)h+='<p class="note"><b>'+(ans[td.id]?'Cal answered today\'s note.':'Today\'s note is with Cal.')+'</b> Write another after 5 am.</p>';
    else h+='<textarea id="kdin" maxlength="280" placeholder="Cal, you are the reason..." aria-label="Your note to Cal"></textarea><div class="kdrow"><small class="note" id="kdcnt">0 / 280</small><button class="btn" data-kd="send">Send to Cal</button></div>';
    if(mine.length)h+='<h4 class="label" style="margin-top:14px">Your notes</h4>'+mine.map(function(n){var a=ans[n.id],p=k.paid[n.id];
      return kdNote({d:n.d,text:n.text},a?(a.ok?'<small class="kdok">Approved and pinned, +'+kdFmt(p!=null?p:a.c)+' coins</small>':'<small class="kdno">Not this time</small>'):'<small class="note">Waiting for Cal</small>')}).join("")}
  return '<div class="card box2 kd">'+h+'</div>'}
function kdOpen(){closeModals();var m=modal(kdHtml());m.classList.add("kdm");kdLoad()}
/* redraws the open window and the + without a full render, keeping a note being typed */
function kdPaint(){var m=document.querySelector("#layer .kdm");
  if(m){var ta=document.getElementById("kdin"),keep=ta?ta.value:null,f=ta&&document.activeElement===ta;var c=m.querySelector(".kd");
    if(c){var x=c.querySelector(".mx"),tmp=document.createElement("div");tmp.innerHTML=kdHtml();var nc=tmp.firstElementChild;if(x)nc.insertBefore(x,nc.firstChild);c.replaceWith(nc)}
    var t2=document.getElementById("kdin");if(t2&&keep!=null){t2.value=keep;kdCount(t2);if(f)t2.focus()}}
  var b=document.querySelector(".kdbtn");if(b){var tmp2=document.createElement("div");tmp2.innerHTML=kdBtn();if(tmp2.firstElementChild)b.replaceWith(tmp2.firstElementChild)}}
function kdCount(t){var c=document.getElementById("kdcnt");if(c)c.textContent=t.value.length+" / 280"}
document.addEventListener("input",function(e){if(e.target&&e.target.id==="kdin")kdCount(e.target)});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-kd]");if(!b)return;var a=b.dataset.kd;
  if(a==="open")kdOpen();
  else if(a==="send"){var t=document.getElementById("kdin");if(t&&!b.disabled){b.disabled=true;kdSend(t.value).then(function(){b.disabled=false})}}
  else if(a==="ok"){b.disabled=true;kdAnswer(b.dataset.u,b.dataset.i,+b.dataset.c||0)}});
/* pinned at the top of the Town Hall's Posts tab */
function kdPinsHtml(){if(!KD.pins.length)return "";var p=KD.pins,f=p.slice(0,3),r=p.slice(3);
  var one=function(x){return '<div class="kdn"><q>'+esc(x.text)+'</q><small class="note">'+esc(x.name)+' &middot; approved by Cal</small></div>'};
  return '<section class="card panel kdpin"><h3 class="label">&#128204; Pinned by Cal</h3>'+f.map(one).join("")+(r.length?'<details><summary class="note">'+r.length+' more</summary>'+r.map(one).join("")+'</details>':'')+'</section>'}
var kdPostsBase=htabPosts;
htabPosts=function(){var h="";try{h=kdPinsHtml()}catch(e){}return h+kdPostsBase.apply(this,arguments)};
/* answers are read a few seconds after the save is in, then every 3 minutes while the game is open */
(function kdBoot(){setTimeout(function(){if(kdOn()&&!document.hidden)kdLoad();kdBoot()},KD.boot++?180000:4000)})();
window.__qbKudos={st:KD,load:kdLoad,pay:kdPay,send:kdSend,answer:kdAnswer,open:kdOpen,guest:function(v){KD.guest=v?1:0;KD.mine=null;KD.all=[];KD.done=[]}};
