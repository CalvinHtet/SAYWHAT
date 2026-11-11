/* ---------- the weekly Town Boss (W54, SPEC10 part 1 with Cal's final decisions, 2026-11-10: "I love the idea of a town boss ...
   multiple different art phases that show it at full health, 75%, 50%, 25% and a dead carcass in the town hall for 1 day once it has
   been slain. The boss can appear on Monday and its HP scales with how many people use the app. By Saturday night at 11:59 PM, if we
   beat it, all of us receive a chest in our mail ...") ----------
   - The week is the game's (days start at DAYSTART): it appears Monday, the fight runs to Saturday's end, Sunday shows the result.
   - It only comes once enough players are active (Cal: "First town boss goes live on the next monday after there are at least 5
     players who are actively using it for 3 days in the past week"). Active = played on 3 or more game days in the 7 days before
     that Monday. HP = 800 x active players (ECON.bossHp), at least 2 players' worth, fixed for the week.
   - Damage = the player's own quest XP + Training XP each day Monday to Saturday (the Daily Quest's dqXp), at most 600 a day
     (ECON.bossDay), so one grinder can't solo it.
   - Every player writes only their own numbers into their own worlds/<id> doc (pd: the game days they played, bw/bd: this week's
     damage); every phone adds them up. Fine among friends, not cheat-proof (like duels).
   - Win (HP 0 before Saturday ends): a letter with a chest for everyone who dealt damage (about a day of their own quest coins plus
     a relic or accessory roll; the 3 biggest hitters roll twice), and the carcass on Sunday. Lose: no coin penalty (Cal): the Town
     Hall burns on Sunday and stays scorched until the next win (fire drawn here; the Mac paints the real pictures).
   - Art: the Mac paints 6 pictures per boss (full, 75, 50, 25, carcass, rampage); until then BOSSART is empty and a drawn stand-in shows.
   - No spoilers: the boss is never named before its Monday; it has no name until the art comes. */
ECON.bossHp=800;ECON.bossDay=600;ECON.bossMin=5;ECON.bossActive=3;   /* Cal 16:10 / 16:20 and SPEC10 */
var BOSSART={};   /* the Mac's pictures by phase when they exist: {full,p75,p50,p25,dead,fire} -> QBART keys */
function bossDay(){return ymdN(today())}
function bossWeek(n){n=n==null?bossDay():n;return n-((n+3)%7)}      /* the Monday of a game day (day numbers from 1970-01-01, a Thursday) */
function bossDow(){var n=bossDay();return n-bossWeek(n)}            /* 0 Monday ... 5 Saturday, 6 Sunday */
function bossKey(m){return ymdOfN(m==null?bossWeek():m)}
function bossState(){if(!S.boss||typeof S.boss!=="object")S.boss={};var B=S.boss;if(!Array.isArray(B.pd))B.pd=[];if(!B.d||typeof B.d!=="object")B.d={};return B}
/* this player: the days played (last 14) and today's damage, Monday to Saturday */
function bossTick(){if(!loaded||!S||!S.created)return;var B=bossState(),t=today(),wk=bossKey(),ch=0;
  if(B.pd[B.pd.length-1]!==t){B.pd.push(t);B.pd=B.pd.slice(-14);ch=1}
  if(B.w!==wk){B.w=wk;B.d={};ch=1}
  if(bossDow()<6&&typeof dqXp==="function"){var v=Math.min(ECON.bossDay,Math.floor(dqXp()));if(v>(B.d[t]||0)){B.d[t]=v;ch=1}}
  if(ch)persist()}
function bossMine(){var B=bossState();return B.w===bossKey()?Object.keys(B.d).reduce(function(s,k){return s+(+B.d[k]||0)},0):0}
/* everyone: this player plus the neighbors (SOC.worlds), as {id, name, pd, bw, bd} */
var BOSSFAKE=null;
function bossPlayers(){var me={id:MYUID||"me",name:(S.char&&S.char.name)||"You",pd:bossState().pd,bw:bossState().w,bd:bossMine(),me:1};
  var o=(BOSSFAKE||((typeof SOC!=="undefined"&&SOC.worlds)||[])).map(function(w){return {id:w.id,name:w.name,pd:w.pd||[],bw:w.bw,bd:+w.bd||0}});
  return [me].concat(o.filter(function(w){return w.id!==me.id}))}
function bossActive(L,m){var a=ymdOfN(m-7),b=ymdOfN(m-1);return L.filter(function(p){var s={};(p.pd||[]).forEach(function(d){if(d>=a&&d<=b)s[d]=1});return Object.keys(s).length>=ECON.bossActive}).length}
/* this week's fight: null when no boss comes this week */
function bossNow(){var m=bossWeek(),L=bossPlayers(),act=bossActive(L,m);if(act<ECON.bossMin)return null;
  var hp=ECON.bossHp*Math.max(2,act),wk=bossKey(m),hit=L.filter(function(p){return p.bw===wk&&p.bd>0}),dmg=hit.reduce(function(s,p){return s+p.bd},0);
  hit.sort(function(a,b){return b.bd-a.bd});
  return {wk:wk,hp:hp,dmg:Math.min(hp,dmg),left:Math.max(0,hp-dmg),won:dmg>=hp,dow:bossDow(),act:act,fighters:hit.length,top:hit.slice(0,3).map(function(p){return p.id}),mine:bossMine()}}
function bossPhase(f){if(!f)return "";if(f.won)return "dead";if(f.dow===6)return "fire";var r=f.left/f.hp;return r>.75?"full":r>.5?"p75":r>.25?"p50":"p25"}
/* the stand-in: an original, drawn monster (no art yet) */
function bossSvg(ph){var dead=ph==="dead",fire=ph==="fire",hurt={full:0,p75:1,p50:2,p25:3}[ph]||0,c=dead?"#6b6f7a":fire?"#d6402e":"#5b3fa8";
  var cracks=['','<path d="M60 42l8 10-6 6" />','<path d="M60 42l8 10-6 6"/><path d="M96 60l-9 7 5 8"/>','<path d="M60 42l8 10-6 6"/><path d="M96 60l-9 7 5 8"/><path d="M74 88l6-9 8 4"/>'][hurt];
  return '<svg class="bs-mon'+(dead?' bs-dead':'')+'" viewBox="0 0 160 120" aria-hidden="true">'
    +(dead?'<ellipse cx="80" cy="100" rx="62" ry="14" fill="'+c+'"/><circle cx="58" cy="94" r="4" fill="#222"/><path d="M52 90l12 8M64 90l-12 8" stroke="#222" stroke-width="3"/>'
      :'<path d="M28 108 Q20 50 52 34 L46 12 L64 30 Q80 24 96 30 L114 12 L108 34 Q140 50 132 108 Z" fill="'+c+'"/><circle cx="64" cy="62" r="8" fill="#ffd34d"/><circle cx="96" cy="62" r="8" fill="#ffd34d"/>'
       +'<circle cx="64" cy="63" r="3" fill="#1a1020"/><circle cx="96" cy="63" r="3" fill="#1a1020"/><path d="M60 86 Q80 98 100 86" stroke="#1a1020" stroke-width="4" fill="none"/>'
       +'<g stroke="#1a1020" stroke-width="2" fill="none">'+cracks+'</g>')
    +'</svg>'}
function bossArt(ph){var k=BOSSART[ph],u=k&&window.QBART&&QBART[k];return u?'<img class="bs-art" src="'+u+'" alt="">':bossSvg(ph)}
/* the Town Hall card: the boss over the picture, its HP bar, how many are fighting, your damage */
function bossHtml(){var f=bossNow(),B=bossState();
  if(!f)return B.lost?'<div class="bs-box bs-scorched"><i class="bs-flames" aria-hidden="true"></i><b>The town is still smoking</b><small>Beat the next boss to clear it.</small></div>':'';
  var ph=bossPhase(f),pct=Math.round(100*f.left/f.hp);
  var head=f.won?(f.dow===6?"The boss is down":"Slain"):f.dow===6?"The boss got away":"Town Boss";
  var line=f.won?"Everyone who hit it has a chest in their letters.":f.dow===6?"It burned the Hall. The next boss comes Monday.":f.fighters+" fighting · ends Saturday night";
  return '<div class="bs-box bs-'+ph+'">'+(ph==="fire"?'<i class="bs-flames" aria-hidden="true"></i>':'')+bossArt(ph)
    +'<div class="bs-txt"><b>'+esc(head)+'</b><div class="bs-hp" role="img" aria-label="'+pct+'% health left"><i style="width:'+pct+'%"></i></div>'
    +'<small>'+f.left.toLocaleString()+' / '+f.hp.toLocaleString()+' HP · '+esc(line)+'</small>'
    +'<small>Your damage this week: <b>'+f.mine.toLocaleString()+'</b>'+(f.dow<6?' (today '+Math.min(ECON.bossDay,Math.floor((bossState().d||{})[today()]||0))+' of '+ECON.bossDay+')':'')+'</small></div></div>'}
/* in the Town Hall card, over its picture */
var bossHallBase=hallHtml;hallHtml=function(){var h=bossHallBase.apply(this,arguments),b="";try{b=bossHtml()}catch(e){}if(!b)return h;
  var i=h.indexOf('<h3 class="label">Town hall</h3>');return i<0?b+h:h.slice(0,i)+b+h.slice(i)};
/* the chest letter: about a day of the player's own quest coins, then a roll (a relic or an accessory, never one owned) on claim,
   and a second roll for the 3 biggest hitters */
INBOXGEN=INBOXGEN||[];INBOXGEN.push(function(){var B=bossState(),w=B.won;if(!w||!(B.hit&&B.hit[w]>0))return [];
  var c=Math.round(econCurve(ECON.questInc,effLvl())/50)*50;
  return [{id:"boss-"+w,from:"The town",subj:"We beat the Town Boss",d:w,coins:c,
    body:'<p>The boss fell before Saturday night. Your share of the chest is below. Claim it for one more find.</p>'
      +((B.top||{})[w]?'<p>You were one of the three biggest hitters this week: you get a second find.</p>':'')}]});
/* the result, kept in the save (the neighbors' docs move on to the next week by Monday): a lost week leaves the Hall scorched until a
   win; a won week keeps this player's part for the chest letter */
function bossKeep(){var f=bossNow(),B=bossState();if(!f)return;
  if(!f.won){if(f.dow===6&&B.lost!==f.wk){B.lost=f.wk;persist()}return}
  if(B.won!==f.wk){B.won=f.wk;B.lost=null;persist()}if(!B.hit)B.hit={};if(!B.top)B.top={};
  if(B.hit[f.wk]==null&&f.mine>0){B.hit[f.wk]=f.mine;B.top[f.wk]=f.top.indexOf(MYUID||"me")>=0?1:0;persist()}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-ib="claim"]');if(!b||!/^boss-/.test(b.dataset.id||""))return;
  var w=b.dataset.id.slice(5),B=bossState();if(!B.got)B.got={};if(B.got[w])return;B.got[w]=1;
  setTimeout(function(){var n=(B.top||{})[w]?2:1,got=[];for(var k=0;k<n;k++){try{var r=chest3Roll();got.push(r.kind==="relic"?r.r.name:r.kind==="wear"?r.it[2]:r.n.toLocaleString()+" coins")}catch(x){}}
    persist();if(got.length)pop("Chest find: "+got.join(", "))},400)});
/* what others see: the days played and this week's damage */
var bossWorldBase=socWorldDoc;socWorldDoc=function(){var d=bossWorldBase.apply(this,arguments);try{var B=bossState();d.pd=B.pd.slice(-10);d.bw=B.w||"";d.bd=bossMine()}catch(e){}return d};
setInterval(function(){try{bossTick();bossKeep()}catch(e){}},5000);
/* test hook (sandbox): fake neighbors, e.g. __qbBoss.fake([{id:"a",name:"A",pd:[...],bw:"2026-11-09",bd:900}]) */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbBoss={now:bossNow,players:bossPlayers,tick:bossTick,keep:bossKeep,week:bossKey,dow:bossDow,
  fake:function(L){BOSSFAKE=L||null;try{render()}catch(e){}return bossNow()},state:bossState};
