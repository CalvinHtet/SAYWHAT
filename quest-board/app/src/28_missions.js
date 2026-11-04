/* ---------- missions: the Hero's Lair sends people out, 5 a day ---------- */
var MS_LIST=[{id:"m1",n:"Check the Old Metro",k:1,mins:20,c:120,x:25,t:"Quick look. Back by lunch."},{id:"m2",n:"Cellar Sweep",k:1,mins:30,c:160,x:35,t:"Something is living down there."},{id:"m3",n:"Clocktower Break-In",k:2,mins:45,c:420,x:80,t:"One to climb, one to watch."},{id:"m4",n:"Neon Sewer Rescue",k:2,mins:60,c:560,x:110,t:"Needs a second pair of hands."},{id:"m5",n:"Obsidian Spire",k:3,mins:90,c:1200,x:240,t:"A real team job. The big payout."}];
var MS_HERO=["Mina","Jae","Rook","Sol","Dae","Vera"];
function msState(){var t=today();if(!S.ms||S.ms.d!==t){var run=(S.ms&&S.ms.run)||{};S.ms={d:t,done:{},run:run}}return S.ms}
function msHeroes(){var lair=S.base.slots.filter(function(r){return r&&r.t==="lair"})[0],n=lair?addonsOf(lair).length:0;return MS_HERO.slice(0,Math.min(6,3+Math.floor(n/2)))}
function msBusy(){var m=msState(),b={};Object.keys(m.run).forEach(function(id){m.run[id].party.forEach(function(h){b[h]=1})});return b}
function msPay(q){var f=1+.02*effLvl();return {c:Math.round(q.c*f),x:Math.round(q.x*f)}}
awayHtml=function(){var m=msState(),hs=msHeroes(),busy=msBusy(),free=hs.filter(function(h){return !busy[h]}),now=Date.now();
  var h='<section class="card panel"><h3 class="label">Missions</h3><p class="note">Send your people out from the Hero\'s Lair. Five jobs a day. Bigger jobs need more people and pay far more.</p><p class="note"><b>Your team:</b> '+hs.map(function(n){return busy[n]?'<s>'+esc(n)+'</s>':esc(n)}).join(", ")+'. Upgrade the Lair to recruit more.</p></section>';
  MS_LIST.forEach(function(q){var pay=msPay(q),run=m.run[q.id],done=m.done[q.id],body;
    if(done)body='<span class="chip">Done for today</span>';
    else if(run&&run.end<=now)body='<button class="btn" data-act="msclaim" data-id="'+q.id+'">Collect +'+pay.c+' coins, +'+pay.x+' XP</button>';
    else if(run){var mn=Math.ceil((run.end-now)/6e4);body='<span class="chip">'+esc(run.party.join(", "))+' back in '+mn+' min</span>'}
    else body='<button class="btn'+(free.length<q.k?' ghost':'')+'" data-act="msgo" data-id="'+q.id+'"'+(free.length<q.k?' disabled':'')+'>Send '+q.k+(q.k>1?' people':' person')+'</button>';
    h+='<section class="card panel"><h3 style="margin:0 0 4px">'+esc(q.n)+'</h3><p class="note">'+esc(q.t)+' '+q.mins+' min. Team of '+q.k+'. Pays '+pay.c+' coins and '+pay.x+' XP.</p>'+body+'</section>'});
  return h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=msgo],[data-act=msclaim],[data-act=dogclean]");if(!b)return;var a=b.dataset.act;
  if(a==="dogclean"){var P=S.base.poops||[];P.shift();S.base.poops=P;S.coins+=20;S.earnedC+=20;S.xp+=5;pop("Cleaned up. +20 coins, +5 XP");persist();render();var om=document.querySelector(".rmodal .rm-scroll");if(om)roomModal(+om.dataset.i);return}
  var q=MS_LIST.filter(function(x){return x.id===b.dataset.id})[0];if(!q)return;var m=msState();
  if(a==="msgo"){var busy=msBusy(),free=msHeroes().filter(function(h){return !busy[h]});if(free.length<q.k)return;m.run[q.id]={end:Date.now()+q.mins*6e4,party:free.slice(0,q.k)};persist();render();pop(free.slice(0,q.k).join(" and ")+" set out")}
  else{var pay=msPay(q),before=effLvl();delete m.run[q.id];m.done[q.id]=1;S.coins+=pay.c;S.earnedC+=pay.c;S.xp+=pay.x;persist();render();pop("+"+pay.c+" coins  +"+pay.x+" XP");var af=effLvl();if(af>before)levelUp(af,null,before)}});
/* ---------- the dogs ---------- */
var dogNextBase=lfDogNext;
lfDogNext=function(a,C){if(!a.visitor&&!a.pv&&Math.random()<.06&&(S.base.poops||[]).length<3&&!lfBlockedAt(C,a.x,a.y)){S.base.poops=S.base.poops||[];S.base.poops.push({x:+a.x.toFixed(1),y:+a.y.toFixed(1)});a.mode="do";a.act="sit";a.t=2.4;a.at=0;a.last="poop";persist();setTimeout(function(){if(!document.querySelector("#layer .modal"))render()},2600);return}return dogNextBase(a,C)};
var bedDogs=LFROOM.bedroom;
LFROOM.bedroom=function(C){bedDogs(C);(S.base.poops||[]).forEach(function(p){var q=lfP(p.x,p.y,0);C.decals.push('<g transform="translate('+q[0]+','+q[1]+')"><ellipse rx="7" ry="3.4" fill="#6b4524"/><ellipse cy="-3" rx="5" ry="2.6" fill="#7c5230"/><ellipse cy="-5.6" rx="3" ry="1.8" fill="#8a5c36"/></g>')});
};
/* the Dungeons tab opens on today's missions; the old delves stay below them */
var dngBase=dngHtml;dngHtml=function(){return awayHtml()+dngBase()};
