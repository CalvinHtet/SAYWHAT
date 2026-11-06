/* ---------- the effort-first economy (QA's proposal in docs/QA.md, Cal approved 2026-11-05) ----------
   Cal: "doing chores and training will always reward you more than having a virtual restaurant give you money or sending
   people out on missions." Real life is the engine; the town is a multiplier on it.
   - XP comes only from real life: tasks, workouts, trials, bounties, the Daily Quest. Missions, delves, story visits and
     rooms give none.
   - The Daily Quest: a daily XP goal the player picks. Today's progress sets the town's efficiency: closed with no task,
     25% after the first, 100% at the goal, up to 150% at twice the goal, where a hidden quest completes.
   - Rooms pay out each day at most a share of today's task coins (20% with a bare town, 50% fully upgraded), times the
     efficiency. What is not collected waits in the room.
   - Missions cost energy; every task XP point today is one energy point. They pay coins and loot, no XP.
   - Training: a full session is worth a 50 XP task and gives a stat point (STR, AGI, VIT, INT) that helps the town.
   - Prices go by what a thing is (decor, furniture, equipment, a big piece, a moment), times the room's story step.
   Cal: "take it step by step until it feels right ... it could be tightened more." Every number is in ECON. */
var ECON={
  dqGoals:[100,150,200,300],dqGoal:150,          /* Daily Quest goal choices, in today's task XP */
  effFirst:.25,effOver:1.5,hidden:2,              /* efficiency after the first task; cap in overtime; hidden quest at 2x goal */
  shareBare:.20,shareFull:.50,                    /* rooms' daily payout, as a share of today's task coins */
  mcost:{m1:50,m2:80,m3:200,m4:300,m5:500},       /* mission energy (QA: doubled once missions ran twice a day; target under 20% of coins) */
  mcoinLv:.01,                                    /* mission coins grow 1% a level */
  xpK:1,xpCap:600,                                /* the level curve (Cal: level 100 in about 50 days for a serious player) */
  msPerDay:2,msGapH:3,                            /* Cal: each mission twice a day, 3 hours apart */
  /* Cal, 2026-11-05: "the garden can be unlocked at lvl 5 and scale things up from there. Otherwise we are unlocking too
     many things before lvl 10." The least level for each story step, on top of its own gate; one step every few levels. */
  waterH:24,sprAlso:"g_x2",sprPrice:6000,         /* Cal: Sprinklers "much later": only with the Garden's Estate stage, at a real price */
                                      /* Cal: watering the Garden lasts a day; Sprinklers make it automatic */
  oneSlotBelow:10,                                /* below this level, one unlock (area or story step) a day in all */
  stepLv:{garden:5,chef:7,boba:9,dessert:11,lockkey:14,rafe:15,rooftop:17,mall:20,nova:21,theater:23,auditorium:25,arcade:28,rhythm:31,vr:31,bowling:34,karaoke:37,club:40},
  gateLockKey:25000,gateMall:80000,               /* Cal: story gates count every coin ever earned (S.earnedC) */
  trainXp:50,trainCoins:120,trainFull:3,          /* a session with at least 3 exercises done */
  vit:.01,vitMax:.10,agi:.01,agiMax:.20,str:.005,strMax:.10,int:.05,  /* each stat point, and its cap */
  chest:1.0,                                      /* Daily Quest chest: coins = goal x this x (1 + INT bonus) */
  price:{decor:150,furniture:300,equipment:600,big:1200,moment:1},  /* QA, for Cal's "all upgrades ... around lvl 80" */
  stepK:.25,stepMax:2,                            /* the room's story step, softened: min(2, 1 + (ROOMSTEP-1) x 0.25) */
};
/* ---- today's effort ---- */
function dqState(){var t=today();if(!S.dq||S.dq.d!==t){var prev=S.dq||{};S.dq={d:t,tx:0,spent:0,paid:0,done:0,hid:0,buff:prev.hidFor===t?1:0}}return S.dq}
function dqGoal(){return ECON.dqGoals.indexOf(S.dqg)>=0?S.dqg:ECON.dqGoal}
function dqXp(){var d=dqState();return Object.keys(S.done||{}).reduce(function(a,k){return a+(+S.done[k]||0)},0)+(d.tx||0)}
function dqEff(){var x=dqXp(),p=x/dqGoal(),e;if(x<=0)return 0;e=p<1?ECON.effFirst+(1-ECON.effFirst)*p:Math.min(ECON.effOver,1+(ECON.effOver-1)*(p-1)/(ECON.hidden-1));return dqState().buff?e*1.1:e}
function stats4(){if(!S.sp||typeof S.sp!=="object")S.sp={str:0,agi:0,vit:0,int:0};return S.sp}
function upFrac(){var own=0,all=0;Object.keys(ADDONS).forEach(function(k){var r=S.base.slots.filter(function(x){return x&&x.t===k})[0];(ADDONS[k]||[]).forEach(function(a){if(!a[0]||(a[3]&&a[3].retired))return;all++;if(r&&r.a&&r.a[a[0]])own++})});return all?own/all:0}
function payShare(){return ECON.shareBare+(ECON.shareFull-ECON.shareBare)*upFrac()+Math.min(ECON.vitMax,stats4().vit*ECON.vit)}
/* the names 30_app_b.js calls: what the businesses may still pay out today, and recording what they paid */
function payQuest(){return Object.keys(S.cdone||{}).reduce(function(a,k){return a+(S.cdone[k]||0)},0)}
function payDay(){var d=dqState();return {d:d.d,n:d.paid}}
function payRoom(){return Math.max(0,Math.round(payQuest()*payShare()*dqEff())-dqState().paid)}
function payTake(n){dqState().paid+=n}
/* rooms produce at the Daily Quest's efficiency too (was: full speed after 3 quests), never below 20% */
openMult=function(){return Math.max(.2,dqEff())};
/* ---- missions: energy in, coins out, no XP ---- */
function msCost(q){return ECON.mcost[q.id]||Math.round(q.mins*2)}
function msEnergy(){return Math.max(0,dqXp()-dqState().spent)}
var econMinsBase=msMins;msMins=function(q){return Math.max(5,Math.round(econMinsBase(q)*(1-Math.min(ECON.agiMax,stats4().agi*ECON.agi))))};
var econGiftBase=dgBuff;dgBuff=function(k){return econGiftBase(k)+(k==="gift"?Math.min(ECON.strMax,stats4().str*ECON.str):0)};
var MSWAS={};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=msgo]");if(!b)return;var q=MS_LIST.filter(function(x){return x.id===b.dataset.id})[0];if(!q)return;
  var c=msCost(q);if(msEnergy()<c){e.stopImmediatePropagation();e.preventDefault();pop(dqXp()?"Needs "+c+" energy, you have "+msEnergy()+". Every task XP point is one energy.":"Your team waits for you: finish a task today first.");return}
  MSWAS[q.id]=!!msState().run[q.id]},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=msgo]");if(!b)return;var q=MS_LIST.filter(function(x){return x.id===b.dataset.id})[0];if(!q)return;
  if(!MSWAS[q.id]&&msState().run[q.id]){dqState().spent+=msCost(q);MSWAS[q.id]=true;persist();render()}});
var econAwayBase=awayHtml;
awayHtml=function(){return '<section class="card panel"><h3 class="label">Energy</h3><p class="note"><b class="mono">'+msEnergy()+'</b> energy today. Every XP point from today\'s tasks is one energy; missions spend it.</p></section>'+econAwayBase()};
/* ---- training ---- */
var TRAINSTAT={push:"str",chest:"str",shoulders:"str",arms:"str",pull:"str",legs:"agi",full:"vit",core:"vit",back:"vit"};
var STATN={str:"STR",agi:"AGI",vit:"VIT",int:"INT"};
var STATD={str:"better loot from missions",agi:"missions come back sooner",vit:"rooms pay a larger share",int:"a bigger Daily Quest chest"};
function econTrainXp(done,full){return done>=ECON.trainFull?ECON.trainXp:10*done}
function econTrained(x,plan){dqState().tx+=x;var k=TRAINSTAT[plan];if(k&&x>=ECON.trainXp){stats4()[k]++;persist();setTimeout(function(){pop("+1 "+STATN[k]+": "+STATD[k])},2600)}}
/* ---- the Daily Quest card, its chest, and the hidden quest ---- */
function dqHtml(){if(!S.created)return '';var x=dqXp(),g=dqGoal(),e=dqEff(),p=Math.min(1,x/g),o=Math.min(1,Math.max(0,x/g-1)),sp=stats4(),d=dqState();
  return '<section class="card panel dq"><div class="row" style="justify-content:space-between"><h3 class="label">Daily Quest</h3><span class="mono">'+x+' / '+g+' XP</span></div>'
    +'<div class="dq-bar"><i style="width:'+(p*100)+'%"></i><i class="ot" style="width:'+(o*100)+'%"></i></div>'
    +'<p class="note">'+(x<=0?'Your town is closed until you finish a task today.':'Town running at <b>'+Math.round(e*100)+'%</b>'+(d.buff?' (yesterday\'s hidden quest: +10%)':'')+'. '+(p<1?(g-x)+' XP to complete the Daily Quest.':o<1?'Overtime.':'Hidden quest complete.'))+'</p>'
    +'<div class="dq-row"><span class="note">Goal</span>'+ECON.dqGoals.map(function(n){return '<button class="dq-g'+(n===g?' on':'')+'" data-act="dqgoal" data-v="'+n+'">'+n+'</button>'}).join("")+'</div>'
    +'<div class="dq-row">'+Object.keys(STATN).map(function(k){var ic=econArt("ui_stat_"+k+".webp");return '<span class="chip dq-st" title="'+STATD[k]+'">'+(ic?'<img src="'+ic+'" alt="">':'')+STATN[k]+' '+sp[k]+'</span>'}).join("")+'</div></section>'}
function econArt(n){return window.QBART&&QBART[n]}
function dqCheck(){if(!loaded||!S.created)return;var d=dqState(),x=dqXp(),g=dqGoal(),sp=stats4();
  if(!d.done&&x>=g){d.done=1;var c=Math.round(g*ECON.chest*(1+sp.int*ECON.int));S.coins+=c;S.earnedC+=c;persist();
    modal('<div class="card box2 dqc"><span class="label">Daily Quest complete</span>'+(econArt("ui_dq_chest.webp")?'<img class="dg-gift" src="'+econArt("ui_dq_chest.webp")+'" alt="">':'<div class="dg-gift dg-gift0">'+isoCrate()+'</div>')+'<h3>+'+c.toLocaleString()+' coins</h3><p class="note">Your town runs at full speed today. Keep going for overtime.</p><div class="row"><button class="btn" data-act="mclose">Done</button></div></div>')}
  if(!d.hid&&x>=g*ECON.hidden){d.hid=1;var tm=new Date();tm.setDate(tm.getDate()+1);d.hidFor=dstr(tm);var r;
    if(typeof maxFreeze==="function"&&S.freezes<maxFreeze()){S.freezes++;r="A streak freeze"}else{sp.int++;r="+1 INT: "+STATD.int}
    persist();modal('<div class="card box2 dqc"><span class="label">Hidden quest</span>'+(econArt("ui_hidden_quest.webp")?'<img class="dq-hid" src="'+econArt("ui_hidden_quest.webp")+'" alt="">':'')+'<h3>Twice the Daily Quest</h3><p class="note">Nobody told you this one existed.</p><p class="dg-buff">'+esc(r)+'</p><p class="note">Tomorrow your quests earn 10% more XP and the town runs 10% faster.</p><div class="row"><button class="btn" data-act="mclose">Done</button></div></div>')}}
setInterval(dqCheck,4000);
var econSocBase=socialBuffs;socialBuffs=function(){var o=econSocBase();if(dqState().buff)o.push({who:"Hidden quest",b:{special:"all",pct:10,text:"All quests +10% XP today"}});return o};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=dqgoal]");if(!b)return;S.dqg=+b.dataset.v;persist();render()});
var econBoardBase=boardHtml;
boardHtml=function(){var h=econBoardBase(),i=h.indexOf('<section class="card panel bty"');if(i<0)i=h.indexOf('<section class="cluster"');var c=dqHtml();return i<0?h+c:h.slice(0,i)+c+h.slice(i)};
/* ---- prices by what a thing is (QA's effort_model.py, new_price) ---- */
var DECORW=/\b(art|painting|poster|mural|vases?|sconces?|plants?|planters?|flowers?|rug|curtains?|frames?|prints|clock|sign|garland|neon|lamp|lights?|palm|fern|leaf|trim|plaque)\b/i;
(function(){Object.keys(ADDONS).forEach(function(k){var st=(typeof ROOMSTEP!=="undefined"&&ROOMSTEP[k])||1;(ADDONS[k]||[]).forEach(function(a){if(!a[2]||(a[3]&&a[3].fixed))return;var base=a[2]/st,P=ECON.price,b;
  if((a[3]&&a[3].decor)||DECORW.test(a[1]))b=P.decor;else if(base<=250)b=P.furniture;else if(base<=500)b=P.equipment;else if(base<=1000)b=P.big;else b=base*P.moment;
  var st2=Math.min(ECON.stepMax,1+(st-1)*ECON.stepK);a[2]=Math.round(b*st2/50)*50})})})();
window.__qbEcon={ECON:ECON,eff:dqEff,xp:dqXp,energy:msEnergy,room:payRoom,share:payShare,stats:stats4,check:dqCheck,trainXp:econTrainXp,trained:econTrained};
