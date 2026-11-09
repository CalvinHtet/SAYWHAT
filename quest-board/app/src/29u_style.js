/* ---------- Style: everyone's character, a pedestal and three leaderboards (Cal, 2026-11-09) ----------
   Cal: "Style: show characters/outfits; likes; pedestal 1st/2nd/3rd + leaderboard. Toggle: Fashion (likes) / Most rich / Highest
   level, live. Fashion likes: WEEKLY contest, likes reset every Monday; top 3 of the week get a badge and coins. Most rich = total
   coins EARNED (earnedC), so spending never drops you." docs/TOWNHALL.md has the details.
   - Everyone comes from worlds/<id> (name, look, lv, earnedC, fw), live through 29n_live.js; this player's own numbers are local.
   - Likes: likes/<id> = {wk, to:[ids], prev:{wk,to}, t}, written only by the one who likes. A like counts only in the week it was
     given (wk, Monday 00:00 Pacific); one like per player per person per week, never yourself, and it can be taken back.
     When the liker's first like of a new week rolls their doc over, last week's likes move to prev, so last week's final count can
     still be read during the new week.
   - At the end of the week each winner's own phone pays itself, once: the first time it sees the closed week (5 minutes into
     Monday, for phones with slow clocks) it counts last week's likes, and if it placed 1st, 2nd or 3rd (ties share a place,
     at least one like) it adds the coins, the medal and the Best Dressed relic, and records the week in the save (S.fsh.last), so
     a reload never pays twice.
   - The week is Pacific time (pacWeek below): today() and townWeek() use the phone's own clock, the contest must not.
   - At most 10 characters are drawn (the pedestal and list rows 4 to 10), all on one still frame; the Town square and the
     Neighbors list fold out at the bottom. Live updates redraw only when what is shown changed. */
var FSHPRIZE=[1500,1000,500],FSHMODES=[["fashion","Fashion"],["rich","Most rich"],["level","Highest level"]],FSHMEDAL=["\u{1F947}","\u{1F948}","\u{1F949}"];
var FSH={mode:"fashion",likes:{},ready:0,on:0,unsub:null,poll:0,err:"",mine:null,q:null,boxH:"",nbH:"",fold:{square:false,nb:false},wk:""};
(function(){try{var m=sessionStorage.getItem("qbStyleMode");if(m==="fashion"||m==="rich"||m==="level")FSH.mode=m;
  var f=JSON.parse(sessionStorage.getItem("qbStyleFold")||"null");if(f&&typeof f==="object")FSH.fold={square:!!f.square,nb:!!f.nb}}catch(e){}})();
/* the medal on the Relics shelf (pays its 250 coins once, like every relic) */
BADGES.push(["style3","Best Dressed","Finish top 3 in a weekly Fashion contest"]);
htabCss("qb-style-css",
  ".fsh{gap:12px}"
  +".fsh-tg{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:3px;border-radius:12px;background:rgba(0,0,0,.2);border:1px solid var(--line)}"
  +".fsh-tg button{min-height:36px;border:0;border-radius:9px;background:transparent;color:var(--muted);font:700 12px/1.1 var(--font-body,system-ui);cursor:pointer}"
  +".fsh-tg button.on{background:var(--surface2);color:var(--fg);box-shadow:inset 0 -2px 0 var(--gold)}"
  +".fsh-ped{display:grid;grid-template-columns:1fr 1.12fr 1fr;align-items:end;gap:6px;padding:10px 6px 0;border-radius:14px;overflow:hidden;background:radial-gradient(120% 90% at 50% 0%,rgba(255,200,87,.16),transparent 60%),linear-gradient(180deg,rgba(255,255,255,.03),rgba(0,0,0,.25))}"
  +".fsh-st{display:flex;flex-direction:column;align-items:center;min-width:0}"
  +".fsh-fig{display:flex;justify-content:center;align-items:flex-end;width:100%;padding:0;border:0;background:none;cursor:pointer;overflow:visible}"
  +".fsh-fig:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:8px}"
  +".fsh-nm{max-width:100%;margin-top:6px;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}"
  +".fsh-st>small{font-size:11px;color:var(--muted);white-space:nowrap}"
  +".fsh-blk{width:100%;margin-top:6px;display:grid;place-items:center;border-radius:8px 8px 0 0;color:#14121c;font:900 22px/1 var(--font-display,system-ui);box-shadow:inset 0 2px 0 rgba(255,255,255,.45)}"
  +".fsh-st.p1 .fsh-blk{height:74px;background:linear-gradient(180deg,#ffe08a,#e0a43a)}"
  +".fsh-st.p2 .fsh-blk{height:52px;background:linear-gradient(180deg,#eef2f8,#9aa6bd)}"
  +".fsh-st.p3 .fsh-blk{height:38px;background:linear-gradient(180deg,#f2c194,#b8743f)}"
  +".fsh-st.empty .fsh-blk{opacity:.4}"
  +".fsh-open{display:grid;place-items:center;height:96px;color:var(--muted);font-size:12px}"
  +".fsh-ghost{display:block;width:56%;border-radius:40% 40% 8px 8px;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.04))}"
  +".fsh-you{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:12px;color:var(--muted)}"
  +".fsh-list{display:flex;flex-direction:column}"
  +".fsh-row{display:flex;align-items:center;gap:10px;width:100%;min-height:46px;padding:6px 4px;border:0;border-top:1px solid var(--line);background:none;color:var(--fg);font:inherit;text-align:left;cursor:pointer}"
  +".fsh-row.me{background:rgba(255,200,87,.08)}"
  +".fsh-rk{flex:none;width:26px;text-align:center;font:800 14px/1 var(--font-mono,monospace);color:var(--muted)}"
  +".fsh-av{flex:none;width:36px;height:36px}"
  +".fsh-rn{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px}"
  +".fsh-rn small{color:var(--muted)}"
  +".fsh-rv{flex:none;font:700 13px/1 var(--font-mono,monospace);color:var(--gold)}"
  +".fsh-liked{flex:none;color:#ff6b8b;font-style:normal}"
  +".fsh-md{margin-left:6px;font-size:12px;white-space:nowrap}"
  +".fsh-fold{display:flex;align-items:baseline;gap:8px;width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:inherit;text-align:left;cursor:pointer}"
  +".fsh-fold b{font-size:14px}.fsh-fold small{flex:1;min-width:0;color:var(--muted);font-size:12px}"
  +".fsh-fold:after{content:'\\25B8';color:var(--muted)}.fsh-fold.open:after{content:'\\25BE'}"
  +".fsh-card{text-align:center}.fsh-card h2{margin:0}"
  +".fsh-big{display:flex;justify-content:center;align-items:flex-end;min-height:236px}"
  +".fsh-stats{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}"
  +".fsh-stats span{padding:4px 10px;border-radius:999px;background:var(--surface2);font-size:12px;color:var(--muted)}.fsh-stats b{color:var(--fg)}"
  +".fsh-like.on{background:#ff6b8b;color:#14121c}"
  +".fsh-medal{font-size:56px;line-height:1}");
/* ---- Pacific time: the contest week runs Monday 00:00 to Sunday 23:59 in Los Angeles, whatever the phone's own zone ---- */
var PACFMT=null;
function pacParts(ms){
  try{if(!PACFMT)PACFMT=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",year:"numeric",month:"numeric",day:"numeric",weekday:"short",hour:"numeric",minute:"numeric",hour12:false});
    var o={};PACFMT.formatToParts(new Date(ms)).forEach(function(p){o[p.type]=p.value});
    var wd=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(o.weekday);
    if(wd>=0&&+o.year>0)return {y:+o.year,m:+o.month,d:+o.day,wd:wd,h:(+o.hour)%24,mi:+o.minute}}catch(e){}
  /* no time zone support: Pacific by the US rule (daylight time from the second Sunday of March, 2 am, to the first Sunday of
     November, 2 am) */
  var y=new Date(ms).getUTCFullYear(),m1=Date.UTC(y,2,1),n1=Date.UTC(y,10,1),
    on=m1+((7-new Date(m1).getUTCDay())%7+7)*864e5+10*36e5,off=n1+((7-new Date(n1).getUTCDay())%7)*864e5+9*36e5,
    d=new Date(ms+(ms>=on&&ms<off?-7:-8)*36e5);
  return {y:d.getUTCFullYear(),m:d.getUTCMonth()+1,d:d.getUTCDate(),wd:d.getUTCDay(),h:d.getUTCHours(),mi:d.getUTCMinutes()}}
/* ISO week key ("2026-W46") of the Monday that starts a week, given as a day number since 1970 */
function pacIso(mon){var y=new Date((mon+3)*864e5).getUTCFullYear(),w=Math.floor((mon+3-Math.floor(Date.UTC(y,0,1)/864e5))/7)+1;return y+"-W"+(w<10?"0":"")+w}
/* the week a moment falls in: its key, last week's key, and the minutes since Monday 00:00 Pacific */
function pacWeek(ms){var p=pacParts(ms),day=Math.floor(Date.UTC(p.y,p.m-1,p.d)/864e5),k=(p.wd+6)%7,mon=day-k;
  return {key:pacIso(mon),prev:pacIso(mon-7),mins:k*1440+p.h*60+p.mi}}
/* the game clock, so Test > Skip a week moves the contest too */
function fshWk(){return pacWeek(Date.now())}
/* ---- other players' docs are hostile: numbers coerced, strings capped, looks checked ---- */
function fshStr(x,n){return (typeof x==="string"?x:typeof x==="number"&&isFinite(x)?String(x):"").replace(TCHBAD,"").slice(0,n)}
function fshNum(x,lo,hi){x=Math.floor(+x);return isFinite(x)?Math.min(hi,Math.max(lo,x)):lo}
function fshLook(L){try{if(!L||typeof L!=="object"||Array.isArray(L)||!L.rig||typeof L.rig!=="object"||Array.isArray(L.rig))return null;return JSON.stringify(L).length<=6000?L:null}catch(e){return null}}
function fshFw(a){return Array.isArray(a)?[0,1,2].map(function(i){return fshNum(a[i],0,9999)}):[0,0,0]}
function fshSafe(w){return {id:String(w.id).slice(0,128),name:fshStr(w.name,24).trim()||"Player",look:fshLook(w.look),lv:fshNum(w.lv,1,999),
  earnedC:w.earnedC==null?null:fshNum(w.earnedC,0,1e12),fw:fshFw(w.fw),streak:fshNum(w.streak,0,99999),
  rooms:Array.isArray(w.rooms)?w.rooms.slice(0,40).map(function(r){return r&&typeof r==="object"?1:0}):[],t:fshNum(w.t,0,9e15)}}
/* this player's medals, for worlds/<id>.fw: [gold, silver, bronze] */
function fshMedals(){var g=[0,0,0];try{var w=S.fsh&&S.fsh.won;if(w&&typeof w==="object")Object.keys(w).forEach(function(k){var p=w[k]&&+w[k].p;if(p>=1&&p<=3)g[p-1]++})}catch(e){}return g}
function fshMedalHtml(fw){var s="";(fw||[]).forEach(function(n,i){if(n>0)s+=FSHMEDAL[i]+(n>1?n:"")});return s?'<span class="fsh-md" aria-label="Fashion medals">'+s+'</span>':""}
/* ---- likes ---- */
function fshWkOk(s){return typeof s==="string"&&/^\d{4}-W\d{2}$/.test(s)}
function fshIds(a){var out=[],seen={};if(!Array.isArray(a))return out;a.slice(0,200).forEach(function(u){if(typeof u!=="string"||!u||u.length>128||seen[u])return;seen[u]=1;out.push(u)});return out.slice(0,60)}
function fshLikeDoc(d){if(!d||typeof d!=="object"||Array.isArray(d))return null;var o={wk:fshWkOk(d.wk)?d.wk:"",to:fshIds(d.to),prev:null};
  if(d.prev&&typeof d.prev==="object"&&fshWkOk(d.prev.wk))o.prev={wk:d.prev.wk,to:fshIds(d.prev.to)};return o}
/* likes each player received in week wk, from every liker's doc (this week's in wk, last week's in prev); never their own */
function fshCounts(wk){var c={};Object.keys(FSH.likes).forEach(function(from){var d=FSH.likes[from],to=d.wk===wk?d.to:(d.prev&&d.prev.wk===wk?d.prev.to:null);
  if(to)to.forEach(function(u){if(u!==from)c[u]=(c[u]||0)+1})});return c}
/* whom this player likes this week */
function fshMyTo(){var o={},m=FSH.mine;if(m&&m.wk===fshWk().key)m.to.forEach(function(u){o[u]=1});return o}
function fshOnLikes(q){var L={};
  ((q&&q.docs)||[]).slice(0,300).forEach(function(s){try{var id=String(s.id||"");if(!id||id.length>128)return;var d=fshLikeDoc(s.data());if(d)L[id]=d}catch(e){}});
  /* this player's own doc: only this phone writes it, so after the first read the copy here is the truth */
  if(!FSH.ready){FSH.mine=L[MYUID]?JSON.parse(JSON.stringify(L[MYUID])):{wk:"",to:[],prev:null};FSH.ready=1}
  if(MYUID&&FSH.mine)L[MYUID]=FSH.mine;
  FSH.likes=L;FSH.err="";fshPaint();fshModalPaint();try{fshPayCheck()}catch(e){}}
function fshStart(){if(FSH.on||!socOn()||!loaded||!S||!S.created)return;FSH.on=1;
  try{var ref=db.collection("likes");
    if(ref&&typeof ref.onSnapshot==="function"){var u=ref.onSnapshot(function(q){fshOnLikes(q)},function(e){FSH.err=(e&&e.code)||"error";FSH.unsub=null;
        if(FSH.err==="unavailable"){FSH.on=0;setTimeout(fshStart,5000)}fshPaint()});if(typeof u==="function")FSH.unsub=u}
    else{var go=function(){if(!document.hidden)db.collection("likes").limit(200).get().then(fshOnLikes,function(e){FSH.err=(e&&e.code)||"error";if(FSH.err==="permission-denied")clearInterval(FSH.poll);fshPaint()})};go();FSH.poll=setInterval(go,60000)}}
  catch(e){FSH.err=String((e&&e.code)||e)}}
/* like or take back; the whole doc is written each time, one write at a time */
function fshLike(uid){if(!uid||!socOn())return;
  if(uid===MYUID){pop("That's you. Friends like your look here.");return}
  if(FSH.err==="permission-denied"){pop("Likes are not switched on yet");return}
  if(!FSH.ready){pop("Likes are still loading");return}
  var wk=fshWk(),m=FSH.mine,n;
  if(m.wk!==wk.key)n={wk:wk.key,to:[],prev:m.wk===wk.prev?{wk:m.wk,to:m.to.slice()}:(m.prev&&m.prev.wk===wk.prev?m.prev:null)};
  else n={wk:m.wk,to:m.to.slice(),prev:m.prev};
  var i=n.to.indexOf(uid),liked=i<0,who=fshNameOf(uid);
  if(liked){if(n.to.length>=60){pop("That's every like you have this week");return}n.to.push(uid)}else n.to.splice(i,1);
  FSH.mine=n;FSH.likes[MYUID]=n;fshPaint();fshModalPaint();
  var doc={wk:n.wk,to:n.to.slice(),prev:n.prev,t:Date.now()},run=function(){return db.doc("likes/"+MYUID).set(doc)};
  var p=(FSH.q||Promise.resolve()).then(run);FSH.q=p.catch(function(){});
  p.then(function(){pop(liked?"You liked "+who+"'s look":"Like taken back")},function(er){FSH.mine=m;FSH.likes[MYUID]=m;fshPaint();fshModalPaint();pop("Could not like: "+((er&&er.code)||"error"))})}
/* ---- the week's end: a winner pays itself, once per week ---- */
function fshPayCheck(){if(!FSH.ready||FSH.err||!socOn()||!loaded||!S||!S.created||newerSeen)return;
  var wk=fshWk();if(wk.mins<5)return;
  if(!S.fsh||typeof S.fsh!=="object")S.fsh={};var F=S.fsh;if(!F.won||typeof F.won!=="object")F.won={};
  if(typeof F.last==="string"&&F.last>=wk.prev)return;
  var c=fshCounts(wk.prev),n=c[MYUID]||0,place=n>0?1+Object.keys(c).filter(function(u){return u!==MYUID&&c[u]>n}).length:0;
  F.last=wk.prev;
  if(place>=1&&place<=3){var coins=FSHPRIZE[place-1];F.won[wk.prev]={p:place,n:n,c:coins};S.coins+=coins;S.earnedC+=coins;
    try{addBadge("style3")}catch(e){}
    persist();fshWinModal(place,n,coins);
    /* the medal shows at once: on the open Style tab and, for everyone else, on this player's world doc */
    fshPaint();try{socPublish(true)}catch(e){}
    try{if(typeof hallFeedPost==="function")hallFeedPost({kind:"fashion",wk:wk.prev,place:place,likes:n,coins:coins})}catch(e){}}
  else persist()}
function fshWinModal(place,n,coins){setTimeout(function(){try{modal('<div class="card box2 fsh-card"><span class="label">Fashion week results</span><div class="fsh-medal">'+FSHMEDAL[place-1]+'</div><h2>'+["1st","2nd","3rd"][place-1]+' place</h2><p class="note">Your look got '+n+' like'+(n===1?'':'s')+' last week.</p><div class="reward">+'+coins.toLocaleString()+' coins and a medal</div><button class="btn big" data-act="mclose">Nice</button></div>')}catch(e){}},1200)}
/* ---- the ranking ---- */
function fshNameOf(id){if(id===MYUID)return fshStr((S.char&&S.char.name)||"You",24)||"You";var w=(SOC.worlds||[]).filter(function(x){return x&&x.id===id})[0];return w?(fshStr(w.name,24).trim()||"Player"):""}
function fshPlayers(){var out=[{id:MYUID||"me",me:1,name:fshStr((S.char&&S.char.name)||"You",24).trim()||"You",look:fshLook(lookOf()),lv:effLvl(),earnedC:Math.floor(S.earnedC||0),fw:fshMedals()}],seen={};seen[out[0].id]=1;
  (SOC.worlds||[]).slice(0,80).forEach(function(w){try{if(!w||typeof w.id!=="string"||seen[w.id])return;seen[w.id]=1;out.push(fshSafe(w))}catch(e){}});
  return out}
function fshRank(mode){var likes=mode==="fashion"?fshCounts(fshWk().key):{},ps=fshPlayers(),nm=function(p){return p.name.toLowerCase()};
  ps.forEach(function(p){p.v=mode==="rich"?(p.earnedC==null?-1:p.earnedC):mode==="level"?p.lv:(likes[p.id]||0)});
  ps.sort(function(a,b){return b.v-a.v||(nm(a)<nm(b)?-1:nm(a)>nm(b)?1:0)||(a.id<b.id?-1:a.id>b.id?1:0)});
  var place=1;ps.forEach(function(p,i){if(i&&p.v<ps[i-1].v)place=i+1;p.place=place});
  return ps}
function fshFind(uid){return fshPlayers().filter(function(p){return p.id===uid})[0]||null}
function fshValTxt(p,mode,long){if(mode==="rich")return p.earnedC==null?"—":p.earnedC.toLocaleString()+(long?" coins":"");
  if(mode==="level")return "Lv "+p.lv;return p.v+(long?(p.v===1?" like":" likes"):" ♥")}
/* a character on one still frame, feet on the line below it (the frame keeps 11% of its height under the feet) */
function fshChar(look,H){return look?calImg(look,"still",H,"fsh-c").replace("<img ",'<img style="margin-bottom:-'+Math.round(H*0.11)+'px" '):'<span class="fsh-ghost" style="height:'+Math.round(H*0.9)+'px"></span>'}
function fshPed(rk,mode){var top=rk.filter(function(p){return mode!=="fashion"||p.v>0}).slice(0,3);
  return '<div class="fsh-ped">'+[[1,"p2",104],[0,"p1",124],[2,"p3",96]].map(function(q){var p=top[q[0]];
    return '<div class="fsh-st '+q[1]+(p?'':' empty')+'">'+(p?'<button type="button" class="fsh-fig" data-act="fshview" data-u="'+esc(p.id)+'" aria-label="'+esc(p.name)+', place '+p.place+'">'+fshChar(p.look,q[2])+'</button>'
      +'<b class="fsh-nm">'+esc(p.me?p.name+" (you)":p.name)+'</b><small>'+esc(fshValTxt(p,mode,1))+'</small>':'<span class="fsh-open">'+(mode==="fashion"?"Open":"")+'</span>')
      +'<div class="fsh-blk"><span>'+(p?p.place:q[0]+1)+'</span></div></div>'}).join("")+'</div>'}
function fshList(rk,mode){var mine=mode==="fashion"?fshMyTo():{};
  return '<div class="fsh-list">'+rk.slice(0,60).map(function(p,i){
    return '<button type="button" class="fsh-row'+(p.me?' me':'')+'" data-act="fshview" data-u="'+esc(p.id)+'"><span class="fsh-rk">'+p.place+'</span>'
      +(i>=3&&i<10?'<span class="fsh-av">'+(p.look?nbAv(p.look,36):'<span class="calav" style="width:36px;height:36px"></span>')+'</span>':'')
      +'<span class="fsh-rn">'+esc(p.name)+(p.me?' <small>(you)</small>':'')+fshMedalHtml(p.fw)+'</span>'
      +(mine[p.id]?'<i class="fsh-liked" aria-label="You like this look">♥</i>':'')+'<span class="fsh-rv">'+esc(fshValTxt(p,mode))+'</span></button>'}).join("")+'</div>'}
function fshHead(mode){
  if(mode==="rich")return '<p class="note">Total coins earned. Spending never drops you.</p>';
  if(mode==="level")return '<p class="note">Everyone\'s level right now.</p>';
  var wk=fshWk(),left=Math.max(1,7*1440-wk.mins),dd=Math.floor(left/1440),hh=Math.floor(left%1440/60);
  return '<p class="note">Likes this week. Tap a look to like it: one like per person, and you can take it back. Resets Monday 12 am Pacific (in '+(dd?dd+'d ':'')+hh+'h). The top 3 win '+FSHPRIZE.map(function(c){return c.toLocaleString()}).join(" / ")+' coins and a medal.</p>'+fshLastWeek()}
/* last week's top 3, read from the likes everyone gave last week */
function fshLastWeek(){var c=fshCounts(fshWk().prev),ids=Object.keys(c).filter(function(u){return fshNameOf(u)});if(!ids.length)return "";
  ids.sort(function(a,b){return c[b]-c[a]||(a<b?-1:1)});
  var out=ids.map(function(u){return {id:u,n:c[u],p:1+ids.filter(function(v){return c[v]>c[u]}).length}}).filter(function(x){return x.p<=3}).slice(0,6);
  return '<p class="note">Last week: '+out.map(function(x){return FSHMEDAL[x.p-1]+' '+esc(fshNameOf(x.id))+' ('+x.n+')'}).join(" &middot; ")+'</p>'}
function fshYou(mode){if(mode!=="fashion")return "";var md=fshMedalHtml(fshMedals()),n=Object.keys(fshMyTo()).length;
  return '<div class="fsh-you"><span>You like '+n+' look'+(n===1?'':'s')+' this week</span>'+(md?'<span>Your medals: '+md+'</span>':'')+'</div>'}
function fshBoxInner(){var mode=FSH.mode,rk=fshRank(mode);
  return fshHead(mode)+fshPed(rk,mode)+fshYou(mode)+fshList(rk,mode)
    +(mode==="fashion"&&FSH.err?'<p class="note">'+(FSH.err==="permission-denied"?'Likes are not switched on yet. They need a database update from Cal.':'Likes can\'t load right now ('+esc(FSH.err)+').')+'</p>':'')}
/* the Neighbors list (moved here from the top of the Hall): the same cards, Visit and Say hi, fed checked copies */
function fshNbInner(){if(!socOn())return '<h3 class="label">Neighbors</h3><p class="note">Visiting other Lofts needs the cloud save. Open the game signed in.</p>';
  var o=socState(),h='<div class="row" style="justify-content:space-between"><h3 class="label">Neighbors</h3><button class="btn ghost sm" data-act="snref">Refresh</button></div>';
  if(o.vis.length)h+='<p class="note">Visited you today: '+o.vis.map(function(v){return '<b>'+esc(v.name)+'</b>'+(v.msg?' “'+esc(v.msg)+'”':'')}).join(", ")+'</p>';
  if(SOC.err)h+='<p class="note">Could not reach the neighborhood ('+esc(SOC.err)+'). Your access may be view-only.</p>';
  var ws=(SOC.worlds||[]).slice(0,60).map(function(w){try{return socWorldCard(fshSafe(w))}catch(e){return ""}}).join("");
  return h+(ws||'<p class="note">'+(SOC.loaded?'No neighbors yet. They show up here once they open the game.':'Looking for neighbors…')+'</p>')}
function fshFolds(){var sq=!!FSH.fold.square,nb=!!FSH.fold.nb,n=(SOC.worlds||[]).length,h;
  h='<button type="button" class="fsh-fold'+(sq?' open':'')+'" data-act="fshfold" data-k="square" aria-expanded="'+sq+'"><b>Town square</b><small>Wave, high five, cheer or hug</small></button>'+(sq?sqHtml():'');
  if(nb)FSH.nbH=fshNbInner();
  h+='<button type="button" class="fsh-fold'+(nb?' open':'')+'" data-act="fshfold" data-k="nb" aria-expanded="'+nb+'"><b>Neighbors</b><small>'+(n?n+' in town &middot; visit their Lofts':'Visit their Lofts')+'</small></button>'
    +(nb?'<section class="card panel snpanel" id="fshnb">'+FSH.nbH+'</section>':'');
  return h}
function fshTg(){return FSHMODES.map(function(m){var on=FSH.mode===m[0];return '<button type="button" role="tab" aria-selected="'+on+'" class="'+(on?'on':'')+'" data-act="fshmode" data-m="'+m[0]+'">'+m[1]+'</button>'}).join("")}
function fshHtml(){FSH.boxH=fshBoxInner();FSH.wk=fshWk().key;
  return '<section class="card panel fsh" id="fshsec"><div class="fsh-tg" id="fshtg" role="tablist" aria-label="Rank by">'+fshTg()+'</div><div id="fshbox">'+FSH.boxH+'</div></section>'+fshFolds()}
function fshMounted(){fshTick()}
/* live: redraw only what changed */
function fshPaint(){if(!htabShown("style"))return;var el=document.getElementById("fshbox");if(el){var h=fshBoxInner();if(h!==FSH.boxH){FSH.boxH=h;el.innerHTML=h}}
  var nb=document.getElementById("fshnb");if(nb){var h2=fshNbInner();if(h2!==FSH.nbH){FSH.nbH=h2;nb.innerHTML=h2}}}
/* a new week (midnight Monday Pacific, or Test > Skip a week): settle the closed one and redraw */
function fshTick(){var k=fshWk().key;if(k!==FSH.wk){FSH.wk=k;try{fshPayCheck()}catch(e){}fshPaint()}}
setInterval(function(){try{fshTick()}catch(e){}},60000);
var fshSocPaintBase=socPaint;
socPaint=function(){var r=fshSocPaintBase.apply(this,arguments);try{fshPaint();fshModalPaint()}catch(e){}return r};
/* tap a character: a bigger look, the like, greetings and a visit */
function fshStats(p){var n=fshCounts(fshWk().key)[p.id]||0;
  return '<span><b>'+n+'</b> like'+(n===1?'':'s')+' this week</span><span><b>'+(p.earnedC==null?'—':p.earnedC.toLocaleString())+'</b> coins earned</span><span><b>Lv '+p.lv+'</b></span>'}
function fshLikeBox(p){if(p.me)return '<p class="note">Your look. Friends can like it here; likes reset every Monday.</p>';
  if(FSH.err==="permission-denied")return '<p class="note">Likes are not switched on yet.</p>';
  var on=!!fshMyTo()[p.id];
  return '<button type="button" class="btn big fsh-like'+(on?' on':'')+'" data-act="fshlike" data-u="'+esc(p.id)+'" aria-pressed="'+on+'">'+(on?'♥ Liked. Tap to take it back':'♡ Like this look')+'</button><p class="note">One like per person each week. Likes reset Monday 12 am Pacific.</p>'}
function fshViewHtml(p){
  return '<div class="card box2 fsh-card"><div class="fsh-big">'+fshChar(p.look,200)+'</div><h2>'+esc(p.name)+(p.me?' <small>(you)</small>':'')+'</h2>'
    +'<div class="fsh-stats">'+fshStats(p)+'</div>'+(fshMedalHtml(p.fw)?'<div>'+fshMedalHtml(p.fw)+'</div>':'')
    +'<div class="fsh-likebox">'+fshLikeBox(p)+'</div>'
    +(p.me?'':'<div class="sq-acts">'+Object.keys(SQK).map(function(k){return '<button type="button" class="btn" data-act="sqgo" data-u="'+esc(p.id)+'" data-k="'+k+'"><span>'+SQK[k][0]+'</span> '+SQK[k][1]+'</button>'}).join("")+'</div>'
      +'<div class="row" style="justify-content:center"><button type="button" class="btn ghost" data-act="snvisit" data-u="'+esc(p.id)+'">Visit their Loft</button></div>')+'</div>'}
function fshView(uid){var p=fshFind(uid);if(!p)return;closeModals();var m=modal(fshViewHtml(p));m.classList.add("fsh-modal");m.setAttribute("data-u",p.id)}
function fshModalPaint(){var m=document.querySelector("#layer .modal.fsh-modal");if(!m)return;var p=fshFind(m.getAttribute("data-u"));if(!p)return;
  var b=m.querySelector(".fsh-likebox"),s=m.querySelector(".fsh-stats"),h=fshLikeBox(p),h2=fshStats(p);if(b&&b._h!==h){b._h=h;b.innerHTML=h}if(s&&s._h!==h2){s._h=h2;s.innerHTML=h2}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act]");if(!b)return;var a=b.dataset.act;
  if(a==="fshmode"){var m=b.dataset.m;if(m!==FSH.mode&&FSHMODES.some(function(x){return x[0]===m})){FSH.mode=m;try{sessionStorage.setItem("qbStyleMode",m)}catch(er){}
      var tg=document.getElementById("fshtg");if(tg)tg.innerHTML=fshTg();var bx=document.getElementById("fshbox");if(bx){FSH.boxH=fshBoxInner();bx.innerHTML=FSH.boxH}else render()}return}
  if(a==="fshview"){fshView(b.dataset.u);return}
  if(a==="fshlike"){fshLike(b.dataset.u);return}
  if(a==="fshfold"){var k=b.dataset.k;if(k!=="square"&&k!=="nb")return;FSH.fold[k]=!FSH.fold[k];try{sessionStorage.setItem("qbStyleFold",JSON.stringify(FSH.fold))}catch(er){}render()}});
/* test hook (sandbox and main only; a Live build never makes it) */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbHall={tab:function(){return HTAB.tab},set:function(t){htabSet(t);render()},week:function(ms){return pacWeek(ms==null?Date.now():ms)},
  chat:function(){return {room:TCH.room,ready:TCH.ready,err:TCH.err,joined:TCH.joined,nowOk:TCH.nowOk,me:TCH.me,mod:TCH.mod,seen:TCH.seen,msgs:TCHROOMS.map(function(r){return tchRoomMsgs(r[0]).length}),who:TCHROOMS.map(function(r){return tchWho(r[0])})}},
  style:function(m){return fshRank(m||FSH.mode).map(function(p){return {id:p.id,name:p.name,v:p.v,place:p.place}})},likes:function(){return {ready:FSH.ready,err:FSH.err,mine:FSH.mine,fsh:S.fsh}},pay:function(){fshPayCheck();return S.fsh}};
