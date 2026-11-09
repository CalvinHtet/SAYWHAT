/* ---------- missions: the Hero's Lair sends people out, 5 a day ---------- */
/* coins per energy grow with the job (1.8 for the quick look, 2.5 for the Spire), so saving a day's energy for the big one pays;
   energy costs are ECON.mcost in 29e_economy.js (Cal, 2026-11-09: "There needs to be a reason for everything and a balance") */
var MS_LIST=[{id:"m1",n:"Check the Old Metro",k:1,mins:20,c:45,x:25,t:"Quick look. Back by lunch."},{id:"m2",n:"Cellar Sweep",k:1,mins:30,c:85,x:35,t:"Something is living down there."},{id:"m3",n:"Clocktower Break-In",k:2,mins:45,c:160,x:80,t:"One to climb, one to watch."},{id:"m4",n:"Neon Sewer Rescue",k:2,mins:60,c:250,x:110,t:"Needs a second pair of hands."},{id:"m5",n:"Obsidian Spire",k:3,mins:90,c:400,x:240,t:"A real team job. The big payout."}];
var MS_HERO=["Mina","Jae","Rook","Sol","Dae","Vera"];
function msState(){var t=today();if(!S.ms||S.ms.d!==t){var run=(S.ms&&S.ms.run)||{},last=(S.ms&&S.ms.last)||{};S.ms={d:t,done:{},run:run,last:last}}if(!S.ms.last)S.ms.last={};return S.ms}
/* Cal, 2026-11-05: each mission runs twice a day, with 3 hours between runs (ECON.msPerDay, ECON.msGapH) */
function msRuns(id){var d=msState().done[id];return d===true?1:(+d||0)}
function msWait(id){var l=msState().last[id]||0;return Math.max(0,l+ECON.msGapH*36e5-Date.now())}
function msCan(q){return msRuns(q.id)<ECON.msPerDay&&!msWait(q.id)&&!msState().run[q.id]}
function msHeroes(){var lair=S.base.slots.filter(function(r){return r&&r.t==="lair"})[0],n=lair?addonsOf(lair).length:0;return MS_HERO.slice(0,Math.min(6,3+Math.floor(n/2)))}
function msBusy(){var m=msState(),b={};Object.keys(m.run).forEach(function(id){m.run[id].party.forEach(function(h){b[h]=1})});return b}
/* minutes a mission takes; trophies can shorten it (29d_dungeon.js) */
function msMins(q){return q.mins}
/* QA's simulator: a tap should not out-earn real tasks. Missions pay coins (1% more per level) and a little XP, flat. */
function msPay(q){return {c:Math.round(q.c*(1+ECON.mcoinLv*effLvl())),x:0}}
awayHtml=function(){var m=msState(),hs=msHeroes(),busy=msBusy(),free=hs.filter(function(h){return !busy[h]}),now=Date.now();
  var h='<section class="card panel"><h3 class="label">Missions</h3><p class="note">Send your people out from the Hero\'s Lair. They run on the energy your real tasks made today (it never costs you XP), bring home coins, and are the only way to find trophy pieces. Each job runs twice a day, 3 hours apart. Bigger jobs need more people and pay more for each point of energy.</p><p class="note"><b>Your team:</b> '+hs.map(function(n){return busy[n]?'<s>'+esc(n)+'</s>':esc(n)}).join(", ")+'. Upgrade the Lair to recruit more.</p></section>';
  MS_LIST.forEach(function(q){var pay=msPay(q),run=m.run[q.id],done=msRuns(q.id)>=ECON.msPerDay,wait=msWait(q.id),body;
    if(done&&!run)body='<span class="chip">Done for today</span>';
    else if(!run&&wait){var wm=Math.ceil(wait/6e4);body='<span class="chip">Back out in '+(wm>=60?Math.floor(wm/60)+' h '+(wm%60)+' min':wm+' min')+'</span>'}
    else if(run&&run.end<=now)body='<button class="btn" data-act="msclaim" data-id="'+q.id+'">Collect +'+pay.c+' coins</button>';
    else if(run){var mn=Math.ceil((run.end-now)/6e4);body='<span class="chip">'+esc(run.party.join(", "))+' back in '+mn+' min</span>'}
    else body='<button class="btn'+(free.length<q.k?' ghost':'')+'" data-act="msgo" data-id="'+q.id+'"'+(free.length<q.k?' disabled':'')+'>Send '+q.k+(q.k>1?' people':' person')+'</button>';
    h+='<section class="card panel"><h3 style="margin:0 0 4px">'+esc(q.n)+'</h3><p class="note">'+esc(q.t)+' '+msMins(q)+' min. Team of '+q.k+'. Costs '+msCost(q)+' energy. Pays '+pay.c+' coins. Run '+Math.min(ECON.msPerDay,msRuns(q.id)+(run?1:0))+' of '+ECON.msPerDay+' today.</p>'+body+'</section>'});
  return h};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=msgo],[data-act=msclaim],[data-act=dogclean]");if(!b)return;var a=b.dataset.act;
  if(a==="dogclean"){var P=S.base.poops||[];P.shift();S.base.poops=P;S.coins+=20;S.earnedC+=20;pop("Cleaned up. +20 coins");persist();render();var om=document.querySelector(".rmodal .rm-scroll");if(om)roomModal(+om.dataset.i);return}
  var q=MS_LIST.filter(function(x){return x.id===b.dataset.id})[0];if(!q)return;var m=msState();
  if(a==="msgo"){if(!msCan(q))return;var busy=msBusy(),free=msHeroes().filter(function(h){return !busy[h]});if(free.length<q.k)return;m.run[q.id]={end:Date.now()+msMins(q)*6e4,party:free.slice(0,q.k)};persist();render();pop(free.slice(0,q.k).join(" and ")+" set out")}
  else{if(!m.run[q.id])return;var pay=msPay(q),before=effLvl();m.last[q.id]=Math.min(Date.now(),m.run[q.id].end);delete m.run[q.id];m.done[q.id]=msRuns(q.id)+1;S.coins+=pay.c;S.earnedC+=pay.c;persist();render();pop("+"+pay.c+" coins");var af=effLvl();if(af>before)levelUp(af,null,before)}});
/* ---------- the dogs ---------- */
var dogNextBase=lfDogNext;
lfDogNext=function(a,C){if(!a.visitor&&!a.pv&&Math.random()<.06&&(S.base.poops||[]).length<3&&!lfBlockedAt(C,a.x,a.y)){S.base.poops=S.base.poops||[];S.base.poops.push({x:+a.x.toFixed(1),y:+a.y.toFixed(1)});a.mode="do";a.act="sit";a.t=2.4;a.at=0;a.last="poop";persist();setTimeout(function(){if(!document.querySelector("#layer .modal"))render()},2600);return}return dogNextBase(a,C)};
var bedDogs=LFROOM.bedroom;
LFROOM.bedroom=function(C){bedDogs(C);(S.base.poops||[]).forEach(function(p){var q=lfP(p.x,p.y,0);C.decals.push('<g transform="translate('+q[0]+','+q[1]+')"><ellipse rx="7" ry="3.4" fill="#6b4524"/><ellipse cy="-3" rx="5" ry="2.6" fill="#7c5230"/><ellipse cy="-5.6" rx="3" ry="1.8" fill="#8a5c36"/></g>')});
};
/* the Dungeons tab opens on today's missions; the old delves stay below them */
var dngBase=dngHtml;dngHtml=function(){return awayHtml()+dngBase()};
