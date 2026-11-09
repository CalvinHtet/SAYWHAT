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
  dqGoals:[50,100,150,200,300],dqGoal:150,       /* Daily Quest goal choices, in today's task XP (50: Cal, 2026-11-09, a light day completes it) */
  effFirst:.25,effOver:1.5,hidden:2,              /* efficiency after the first task; cap in overtime; hidden quest at 2x goal */
  shareBare:.20,shareFull:.50,                    /* rooms' daily payout, as a share of today's task coins */
  mcost:{m1:50,m2:80,m3:200,m4:300,m5:500},       /* mission energy (QA: doubled once missions ran twice a day; target under 20% of coins) */
  mcoinLv:.01,                                    /* mission coins grow 1% a level */
  /* Cal, 2026-11-09: "if they used it for daily tasks and chores everyday, they could lvl up 1-2 times. If they pair that with
     working out, using the trainer, and other things, you could level up 3-4 times". The level curve, lvNeed() in 30_app_b.js:
     level 1 to 2 costs lvFirst, the cost ramps to lvFlat by level lvRamp, then grows lvGrow a level (135 at 6, 144 at 50, 154 at
     100; 13,905 XP to level 100). Chores only (about 180 XP a day): 1.2 to 1.3 levels a day all the way up, level 100 around day 77.
     Chores, a photo workout, a Training session and a bounty (about 500 a day): 3.2 to 3.7 a day, level 100 around day 28. */
  lvFirst:20,lvRamp:6,lvFlat:135,lvGrow:.0015,
  trialDays:2,                                    /* a level trial also passes on honor: active (50+ XP) on this many days */
  restDay:.25,restMax:1,                          /* rested XP: a quarter level banked per day with no quest, one level at most */
  wqDays:4,                                       /* Weekly Quest: active (50+ XP) on this many days, Monday to Sunday, pays a level */
  freeMiss:1,freezeEvery:5,streakKeep:.5,         /* streak: one missed day a week is free; a freeze every 5 days; short of freezes it halves */
  catchGap:8,catchPct:25,                         /* 8+ levels under the median of friends active this week: quests +25% XP */
  slotFree:{garden:1,chef:1},                     /* story steps the one-a-day early unlock slot never holds back (Cal: Garden day 1) */
  msPerDay:2,msGapH:3,                            /* Cal: each mission twice a day, 3 hours apart */
  /* Cal, 2026-11-05: "the garden can be unlocked at lvl 5 and scale things up from there. Otherwise we are unlocking too
     many things before lvl 10." The least level for each story step, on top of its own gate; one step every few levels. */
  waterH:24,sprAlso:"g_x2",sprPrice:2000,         /* Cal: Sprinklers "much later": only with the Garden's Estate stage (was 6,000) */
                                      /* Cal: watering the Garden lasts a day; Sprinklers make it automatic */
  oneSlotBelow:10,                                /* below this level, one unlock (area or story step) a day in all */
  /* Cal, 2026-11-09: the Loft and the Garden on day 1 and the Restaurant by day 2 or 3, for everyone (were levels 5 and 7) */
  stepLv:{garden:2,chef:3,boba:9,dessert:11,lockkey:14,rafe:15,rooftop:17,mall:20,nova:21,theater:23,auditorium:25,arcade:28,rhythm:31,vr:31,bowling:34,karaoke:37,club:40},
  gateLockKey:25000,gateMall:30000,               /* Cal: story gates count every coin ever earned (S.earnedC); Mall was 80,000 */
  trainXp:50,trainCoins:300,trainFull:3,          /* a session with at least 3 exercises done */
  vit:.01,vitMax:.10,agi:.01,agiMax:.20,str:.005,strMax:.10,int:.05,  /* each stat point, and its cap */
  chest:2.5,                                      /* Daily Quest chest: coins = goal x this x (1 + INT bonus) */
  /* Cal, 2026-11-09: "make everything very very accessible so you are excited to open the app rather than having it feel very
     grindy": room upgrades at half (was decor 150, furniture 300, equipment 600, big 1200, moments x1, later rooms up to x2) */
  price:{decor:75,furniture:150,equipment:300,big:600,moment:.5},
  stepK:.25,stepMax:1.5,                          /* the room's story step, softened: min(1.5, 1 + (ROOMSTEP-1) x 0.25) */
  shopK:.5,                                       /* every Shop price (clothes, interface, gear) x this, once at load */
};
/* a story lot's padlock on the street is its story level (ROOMT.lv said 16 for the Boba lot, 24 the Theater, 30 the Mall, 50
   the Club, so the street and the story disagreed) */
["garden","boba","theater","mall","club"].forEach(function(k){if(ROOMT[k]&&ECON.stepLv[k])ROOMT[k].lv=ECON.stepLv[k]});
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
    +'<p class="note">'+(x<=0?'Finish a task to start your day. ':p<1?'<b>'+(g-x)+' XP left</b> to finish today\'s Daily Quest. ':o<1?'Daily Quest done. Overtime counts toward the hidden quest. ':'Hidden quest complete. ')+(x>0?'Town running at <b>'+Math.round(e*100)+'%</b>'+(d.buff?' (yesterday\'s hidden quest: +10%)':'')+'.':'')+'</p>'
    +'<p class="note">Weekly Quest: <b>'+wqState().n+' of '+ECON.wqDays+'</b> active days'+(wqState().paid?', done for this week.':', pays a level of XP.')+(S.rest&&S.rest.x>0?' Rested: <b>'+S.rest.x+' XP</b>, quests pay double until it runs out.':'')+'</p>'
    /* Cal, 2026-11-09: "I don't understand the 100, 150, 200, 250 buttons for the goal" */
    +'<p class="note dq-gx"><b>Daily goal</b>: how much XP counts as a full day. Reaching it pays a coin chest and runs your town at full speed. A bigger goal pays a bigger chest.</p>'
    +'<div class="dq-row">'+ECON.dqGoals.map(function(n){return '<button class="dq-g'+(n===g?' on':'')+'" data-act="dqgoal" data-v="'+n+'">'+n+'</button>'}).join("")+'</div>'
    +'<div class="dq-row">'+Object.keys(STATN).map(function(k){var ic=econArt("ui_stat_"+k+".webp");return '<span class="chip dq-st" title="'+STATD[k]+'">'+(ic?'<img src="'+ic+'" alt="">':'')+STATN[k]+' '+sp[k]+'</span>'}).join("")+'</div></section>'}
function econArt(n){return window.QBART&&QBART[n]}
function dqCheck(){if(!loaded||!S.created)return;var d=dqState(),x=dqXp(),g=dqGoal(),sp=stats4();
  if(!d.done&&x>=g){d.done=1;var c=Math.round(g*ECON.chest*(1+sp.int*ECON.int));S.coins+=c;S.earnedC+=c;persist();
    modal('<div class="card box2 dqc"><span class="label">Daily Quest complete</span>'+(econArt("ui_dq_chest.webp")?'<img class="dg-gift" src="'+econArt("ui_dq_chest.webp")+'" alt="">':'<div class="dg-gift dg-gift0">'+isoCrate()+'</div>')+'<h3>+'+c.toLocaleString()+' coins</h3><p class="note">Your town runs at full speed today. Keep going for overtime.</p><div class="row"><button class="btn" data-act="mclose">Done</button></div></div>')}
  if(!d.hid&&x>=g*ECON.hidden){d.hid=1;var tm=new Date();tm.setDate(tm.getDate()+1);d.hidFor=dstr(tm);var r;
    if(typeof maxFreeze==="function"&&S.freezes<maxFreeze()){S.freezes++;r="A streak freeze"}else{sp.int++;r="+1 INT: "+STATD.int}
    persist();modal('<div class="card box2 dqc"><span class="label">Hidden quest</span>'+(econArt("ui_hidden_quest.webp")?'<img class="dq-hid" src="'+econArt("ui_hidden_quest.webp")+'" alt="">':'')+'<h3>Twice the Daily Quest</h3><p class="note">Nobody told you this one existed.</p><p class="dg-buff">'+esc(r)+'</p><p class="note">Tomorrow your quests earn 10% more XP and the town runs 10% faster.</p><div class="row"><button class="btn" data-act="mclose">Done</button></div></div>')}}
setInterval(dqCheck,4000);
/* a level trial also passes on honor (Cal, 2026-11-09: photos are a bonus, never a wall): ECON.trialDays active days (50+ XP,
   the streak's test, whatever the Daily Quest goal) while the trial waits. A fresh activity photo still passes it at once. */
function trialHonor(){if(!loaded||!S.created||gated()===null)return;var t=today();if(S.lastDone!==t||S.trialDay===t||document.querySelector("#layer .modal"))return;
  S.trialDay=t;S.trialN=(S.trialN||0)+1;persist();if(S.trialN>=ECON.trialDays)clearGate(false);else{render();pop("Trial: active day "+S.trialN+" of "+ECON.trialDays+". A fresh activity photo passes it now.")}}
setInterval(trialHonor,4000);
var econSocBase=socialBuffs;socialBuffs=function(){var o=econSocBase();if(dqState().buff)o.push({who:"Hidden quest",b:{special:"all",pct:10,text:"All quests +10% XP today"}});return o};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=dqgoal]");if(!b)return;S.dqg=+b.dataset.v;persist();render()});
/* the Daily Quest lives in the profile now, right under the level card (Cal, 2026-11-09: a simpler Board) */
var econProfBase=profileHtml;
profileHtml=function(){var h=econProfBase(),i=h.indexOf('<section class="card wstrip"');var c=dqHtml();return i<0?c+h:h.slice(0,i)+c+h.slice(i)};
/* ---- prices by what a thing is (QA's effort_model.py, new_price) ---- */
var DECORW=/\b(art|painting|poster|mural|vases?|sconces?|plants?|planters?|flowers?|rug|curtains?|frames?|prints|clock|sign|garland|neon|lamp|lights?|palm|fern|leaf|trim|plaque)\b/i;
(function(){Object.keys(ADDONS).forEach(function(k){var st=(typeof ROOMSTEP!=="undefined"&&ROOMSTEP[k])||1;(ADDONS[k]||[]).forEach(function(a){if(!a[2]||(a[3]&&a[3].fixed))return;var base=a[2]/st,P=ECON.price,b;
  if((a[3]&&a[3].decor)||DECORW.test(a[1]))b=P.decor;else if(base<=250)b=P.furniture;else if(base<=500)b=P.equipment;else if(base<=1000)b=P.big;else b=base*P.moment;
  var st2=Math.min(ECON.stepMax,1+(st-1)*ECON.stepK);a[2]=Math.round(b*st2/50)*50})})})();
/* Shop prices (SHOP and GITEMS in 10_app_a.js, EXTRA_ITEMS in 15_shop.js) x ECON.shopK, each item once even if it sits in two lists */
(function(){var seen=typeof WeakSet==="function"?new WeakSet():null;
  [typeof SHOP!=="undefined"?SHOP:[],typeof GITEMS!=="undefined"?GITEMS:[],typeof EXTRA_ITEMS!=="undefined"?EXTRA_ITEMS:[]].forEach(function(l){
    (l||[]).forEach(function(it){if(!Array.isArray(it)||!(+it[3]>0)||(seen&&seen.has(it)))return;if(seen)seen.add(it);it[3]=Math.max(10,Math.round(it[3]*ECON.shopK/10)*10)})})})();
window.__qbEcon={ECON:ECON,eff:dqEff,xp:dqXp,energy:msEnergy,room:payRoom,share:payShare,stats:stats4,check:dqCheck,trainXp:econTrainXp,trained:econTrained};
