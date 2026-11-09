/* ---------- the effort-first economy (QA's proposal in docs/QA.md, Cal approved 2026-11-05) ----------
   Cal: "doing chores and training will always reward you more than having a virtual restaurant give you money or sending
   people out on missions." Real life is the engine; the town is a multiplier on it.
   - XP comes only from real life: tasks, workouts, trials, bounties, the Daily Quest. Dungeon crawls, story visits and
     rooms give none.
   - The Daily Quest: a daily XP goal the player picks. Today's progress sets the town's efficiency: closed with no task,
     25% after the first, 100% at the goal, up to 150% at twice the goal, where a hidden quest completes.
   - Rooms pay out each day at most a share of today's task coins (20% with a bare town, 50% fully upgraded), times the
     efficiency. What is not collected waits in the room.
   - Dungeon crawls (5 a day) pay coins times the town's efficiency, and now and then a rare find; no XP.
   - Training: a full session is worth a 50 XP task and gives a stat point (STR, AGI, VIT, INT) that helps the town.
   - Prices go by what a thing is (decor, furniture, equipment, a big piece, a moment), times the room's story step.
   Cal: "take it step by step until it feels right ... it could be tightened more." Every number is in ECON. */
var ECON={
  /* Cal, 2026-11-09: "After completing my daily quest, changing it lower, grants you more chests ... 150 for normal day, then
     every 50 above that opens the next tier chest up to 300 which grants a lot of money". One goal for everyone (no goal
     buttons); each tier's chest opens once a day: [today's task XP, coins], coins x (1 + INT bonus). */
  dqGoal:150,dqTiers:[[150,150],[200,150],[250,200],[300,300]],
  effFirst:.25,effOver:1.5,hidden:2,              /* efficiency after the first task; cap in overtime; hidden quest at 2x goal */
  shareBare:.20,shareFull:.50,                    /* rooms' daily payout, as a share of today's task coins */
  /* Cal, 2026-11-09: "Merge dungeons and missions ... Dungeon Crawls will be the new name ... these items are rare, with success
     gauranteed by the 4th crawl": a crawl brings a rare find this often (crawlFind in 29d_dungeon.js), plus 1% for every Hero's
     Lair upgrade (the Lair's reason now that it sends no missions), and always on the crawlPity-th crawl in a row without one */
  crawlRare:.12,crawlLair:.005,crawlPity:4,
  /* quest coins grow this much a level (was 1%). Quest coins are paid on the listed XP (x2 for a photo or the bounty), not on
     streak, combo, crit and rank XP bonuses, which stay XP only: with all of them, coins ran to 10x by level 100 (QA, 2026-11-09) */
  coinLv:.005,
  dngPerDay:5,                                    /* Cal, 2026-11-09: five dungeon delves a day */
  lvPay:[50,5],                                   /* coins for each level: 50 + 5 x the level (was 100 + 10 x level) */
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
  /* Cal, 2026-11-05: "the garden can be unlocked at lvl 5 and scale things up from there. Otherwise we are unlocking too
     many things before lvl 10." The least level for each story step, on top of its own gate; one step every few levels. */
  waterH:24,sprAlso:"g_x2",sprPrice:2000,         /* Cal: Sprinklers "much later": only with the Garden's Estate stage (was 6,000) */
                                      /* Cal: watering the Garden lasts a day; Sprinklers make it automatic */
  oneSlotBelow:10,                                /* below this level, one unlock (area or story step) a day in all */
  /* Cal, 2026-11-09: the Loft and the Garden on day 1 and the Restaurant by day 2 or 3, for everyone (were levels 5 and 7) */
  stepLv:{garden:2,chef:3,boba:9,dessert:11,lockkey:14,rafe:15,rooftop:17,mall:20,nova:21,theater:23,auditorium:25,arcade:28,rhythm:31,vr:31,bowling:34,karaoke:37,club:40},
  gateLockKey:25000,gateMall:30000,               /* Cal: story gates count every coin ever earned (S.earnedC); Mall was 80,000 */
  trainXp:50,trainCoins:300,trainFull:3,          /* a session with at least 3 exercises done */
  /* each stat point, and its cap. INT had none: the hidden quest adds one most days, so the chest grew without end (QA) */
  vit:.01,vitMax:.10,agi:.01,agiMax:.20,str:.005,strMax:.05,int:.05,intMax:.25,
  /* ---- prices (QA, 2026-11-09). Cal: "i want everyone to feel like buying stuff is worth it and not too expensive, but also
     not too easy. Once the garden and other income generating stuff gets unlocked, certain upgrades should be more expensive.
     But when you are first starting off with no passive income, it is hard to get 2000 ... if we are passively collecting a
     LOT of money, then it makes sense for the imax projector to be 2500". One rule for every room upgrade:
       price = what it is (tier) x when you reach it (phase of its room) x how far down the room's list it sits (ramp).
     Tiers are early-game prices: a day of chores before any business is about 2,500 coins. A phase is about how much more a
     player earns a day by the time the room opens (measured with tools/windows/econsim.js). Big moments (PRICE_HUGE in
     29_prices.js) cost their listed weight x grandK, an upgrade that opens a room costs opener x the new room's phase, and a
     lot on the street costs lot x its phase. Set fixed:1 on an upgrade to keep its price exactly as written (fp:1 only keeps
     29_prices.js from flattening it; this pass still prices it by what it is). */
  tier:{decor:200,furniture:325,equipment:500,big:750},
  kindOf:{au_proj1:"equipment"},                 /* the plain Digital Projector, so the IMAX one is the clear step up */
  grandK:.5,opener:1400,lot:2000,lotGarden:1000,ramp:.5,
  /* measured (econsim.js, a heavy player): about 3,700 a day in the Loft's first days, 6,000 when the Garden opens, 10,000 at
     the Restaurant, then 13,000 to 15,000 from Boba on, where it levels off; the phases follow that, a bit under it */
  phase:{bedroom:1,patio:1,closet:1,gameroom:1.2,lair:1.3,trophy:1.3,garden:1.3,restaurant:1.8,boba:2.2,dessert:2.3,
    skybar:2.5,rooftop:2.7,mall:2.8,theater:3,auditorium:3,arcade:3.2,rhythm:3.3,vr:3.3,bowling:3.4,karaoke:3.5,club:3.8},
  /* the Shop: clothes keep each brand's own spread x shopK, between clothesMin and clothesMax (Cal: "the shop is almost 1000
     for some items"); interface items cost uiBase + uiLv x the level they open at; permanent upgrades pay for themselves in
     about a week or two of quests, so each is priced by what it returns (Merchant Seal I was 500 for +10% coins forever) */
  shopK:.4,clothesMin:150,clothesMax:700,uiBase:200,uiLv:25,
  buff:{bf_coin1:1500,bf_coin2:3000,bf_coin3:5000,bf_xp1:800,bf_xp2:1500,bf_xp3:2500,bf_freeze:1000,bf_streak:1500,bf_away:2000},
};
/* a story lot's padlock on the street is its story level (ROOMT.lv said 16 for the Boba lot, 24 the Theater, 30 the Mall, 50
   the Club, so the street and the story disagreed) */
["garden","boba","theater","mall","club"].forEach(function(k){if(ROOMT[k]&&ECON.stepLv[k])ROOMT[k].lv=ECON.stepLv[k]});
/* ---- today's effort ---- */
function dqState(){var t=today();if(!S.dq||S.dq.d!==t){var prev=S.dq||{};S.dq={d:t,tx:0,spent:0,paid:0,done:0,hid:0,buff:prev.hidFor===t?1:0}}return S.dq}
function dqGoal(){return ECON.dqGoal}
/* the next Daily Quest chest still closed today ([XP, coins]), or null when all are open */
function dqNext(){var x=dqXp(),t=ECON.dqTiers;for(var i=0;i<t.length;i++)if(x<t[i][0])return t[i];return null}
function dqChest(c){return Math.round(c*(1+Math.min(ECON.intMax,stats4().int*ECON.int)))}
function dqXp(){var d=dqState();return Object.keys(S.done||{}).reduce(function(a,k){return a+(+S.done[k]||0)},0)+(d.tx||0)}
function dqEff(){var x=dqXp(),p=x/dqGoal(),e;if(x<=0)return 0;e=p<1?ECON.effFirst+(1-ECON.effFirst)*p:Math.min(ECON.effOver,1+(ECON.effOver-1)*(p-1)/(ECON.hidden-1));return dqState().buff?e*1.1:e}
function stats4(){if(!S.sp||typeof S.sp!=="object")S.sp={str:0,agi:0,vit:0,int:0};return S.sp}
/* QA (2026-11-09): only rooms a player can open count (the old Lounge, Gym, Spa and the rest are still in ADDONS, so a town with
   every upgrade read 74% and the payout share never reached shareFull) */
function upRooms(){return Object.keys(ADDONS).filter(function(k){return typeof ROOMCELL!=="undefined"&&ROOMCELL[k]&&!(typeof styStep==="function"&&(styStep(k)||{}).how==="never")})}
function upFrac(){var own=0,all=0;upRooms().forEach(function(k){var r=S.base.slots.filter(function(x){return x&&x.t===k})[0];(ADDONS[k]||[]).forEach(function(a){if(!a[0]||(a[3]&&a[3].retired))return;all++;if(r&&r.a&&r.a[a[0]])own++})});return all?own/all:0}
function payShare(){return ECON.shareBare+(ECON.shareFull-ECON.shareBare)*upFrac()+Math.min(ECON.vitMax,stats4().vit*ECON.vit)}
/* the names 30_app_b.js calls: what the businesses may still pay out today, and recording what they paid */
function payQuest(){return Object.keys(S.cdone||{}).reduce(function(a,k){return a+(S.cdone[k]||0)},0)}
function payDay(){var d=dqState();return {d:d.d,n:d.paid}}
function payRoom(){return Math.max(0,Math.round(payQuest()*payShare()*dqEff())-dqState().paid)}
function payTake(n){dqState().paid+=n}
/* rooms produce at the Daily Quest's efficiency too (was: full speed after 3 quests), never below 20% */
openMult=function(){return Math.max(.2,dqEff())};
/* ---- Dungeon Crawls (10_app_a.js, the finds in 29d_dungeon.js): STR makes rare finds likelier, AGI brings a crawl back sooner ---- */
var econGiftBase=dgBuff;dgBuff=function(k){return econGiftBase(k)+(k==="gift"?Math.min(ECON.strMax,stats4().str*ECON.str):0)};
/* ---- training ---- */
var TRAINSTAT={push:"str",chest:"str",shoulders:"str",arms:"str",pull:"str",legs:"agi",full:"vit",core:"vit",back:"vit"};
var STATN={str:"STR",agi:"AGI",vit:"VIT",int:"INT"};
var STATD={str:"more rare finds on dungeon crawls",agi:"dungeon crawls come back sooner",vit:"rooms pay a larger share",int:"a bigger Daily Quest chest"};
function econTrainXp(done,full){return done>=ECON.trainFull?ECON.trainXp:10*done}
function econTrained(x,plan){dqState().tx+=x;var k=TRAINSTAT[plan];if(k&&x>=ECON.trainXp){stats4()[k]++;persist();setTimeout(function(){pop("+1 "+STATN[k]+": "+STATD[k])},2600)}}
/* ---- the Daily Quest card, its chest, and the hidden quest ---- */
function dqHtml(){if(!S.created)return '';var x=dqXp(),g=dqGoal(),e=dqEff(),p=Math.min(1,x/g),o=Math.min(1,Math.max(0,x/g-1)),sp=stats4(),d=dqState();
  return '<section class="card panel dq"><div class="row" style="justify-content:space-between"><h3 class="label">Daily Quest</h3><span class="mono">'+x+' / '+g+' XP</span></div>'
    +'<div class="dq-bar"><i style="width:'+(p*100)+'%"></i><i class="ot" style="width:'+(o*100)+'%"></i></div>'
    +'<p class="note">'+(x<=0?'Finish a task to start your day. ':p<1?'<b>'+(g-x)+' XP left</b> to finish today\'s Daily Quest. ':o<1?'Daily Quest done. Overtime counts toward the hidden quest. ':'Hidden quest complete. ')+(x>0?'Town running at <b>'+Math.round(e*100)+'%</b>'+(d.buff?' (yesterday\'s hidden quest: +10%)':'')+'.':'')+'</p>'
    +'<p class="note">Weekly Quest: <b>'+wqState().n+' of '+ECON.wqDays+'</b> active days'+(wqState().paid?', done for this week.':', pays a level of XP.')+(S.rest&&S.rest.x>0?' Rested: <b>'+S.rest.x+' XP</b>, quests pay double until it runs out.':'')+'</p>'
    /* Cal, 2026-11-09: "I don't understand the 100, 150, 200, 250 buttons for the goal": no goal to pick, a chest at each tier */
    +'<p class="note dq-gx"><b>Chests</b>: '+dqGoal()+' XP finishes the Daily Quest and opens the first chest. Every 50 XP after that opens a bigger one, up to '+ECON.dqTiers[ECON.dqTiers.length-1][0]+'.</p>'
    +'<div class="dq-row">'+ECON.dqTiers.map(function(t){var on=x>=t[0];return '<span class="dq-g dq-t'+(on?' on':'')+'" title="'+dqChest(t[1])+' coins">'+t[0]+' XP &middot; <b class="mono">'+dqChest(t[1]).toLocaleString()+'</b></span>'}).join("")+'</div>'
    +'<div class="dq-row">'+Object.keys(STATN).map(function(k){var ic=econArt("ui_stat_"+k+".webp");return '<span class="chip dq-st" title="'+STATD[k]+'">'+(ic?'<img src="'+ic+'" alt="">':'')+STATN[k]+' '+sp[k]+'</span>'}).join("")+'</div></section>'}
function econArt(n){return window.QBART&&QBART[n]}
function dqCheck(){if(!loaded||!S.created)return;var d=dqState(),x=dqXp(),g=dqGoal(),sp=stats4(),T=ECON.dqTiers;
  /* each tier's chest once a day (d.tier: how many are open; a save from before the tiers had d.done for the one chest) */
  if(d.done&&!d.tier)d.tier=1;
  if((d.tier||0)<T.length&&x>=T[d.tier||0][0]&&!document.querySelector("#layer .dqc")){var k=d.tier||0,c=dqChest(T[k][1]),nx=T[k+1];d.tier=k+1;d.done=1;S.coins+=c;S.earnedC+=c;persist();
    modal('<div class="card box2 dqc"><span class="label">'+(k?'Bonus chest: '+T[k][0]+' XP':'Daily Quest complete')+'</span>'+(econArt("ui_dq_chest.webp")?'<img class="dg-gift" src="'+econArt("ui_dq_chest.webp")+'" alt="">':'<div class="dg-gift dg-gift0">'+isoCrate()+'</div>')+'<h3>+'+c.toLocaleString()+' coins</h3><p class="note">'+(k?'':'Your town runs at full speed today. ')+(nx?'The next chest opens at '+nx[0]+' XP.':'Every chest is open today.')+'</p><div class="row"><button class="btn" data-act="mclose">Done</button></div></div>');return}
  if(!d.hid&&x>=g*ECON.hidden&&!document.querySelector("#layer .dqc")){d.hid=1;var tm=new Date();tm.setDate(tm.getDate()+1);d.hidFor=dstr(tm);var r;
    if(typeof maxFreeze==="function"&&S.freezes<maxFreeze()){S.freezes++;r="A streak freeze"}else if(sp.int*ECON.int<ECON.intMax){sp.int++;r="+1 INT: "+STATD.int}else{S.coins+=300;S.earnedC+=300;r="+300 coins"}
    persist();modal('<div class="card box2 dqc"><span class="label">Hidden quest</span>'+(econArt("ui_hidden_quest.webp")?'<img class="dq-hid" src="'+econArt("ui_hidden_quest.webp")+'" alt="">':'')+'<h3>Twice the Daily Quest</h3><p class="note">Nobody told you this one existed.</p><p class="dg-buff">'+esc(r)+'</p><p class="note">Tomorrow your quests earn 10% more XP and the town runs 10% faster.</p><div class="row"><button class="btn" data-act="mclose">Done</button></div></div>')}}
setInterval(dqCheck,4000);
/* a level trial also passes on honor (Cal, 2026-11-09: photos are a bonus, never a wall): ECON.trialDays active days (50+ XP,
   the streak's test, whatever the Daily Quest goal) while the trial waits. A fresh activity photo still passes it at once. */
function trialHonor(){if(!loaded||!S.created||gated()===null)return;var t=today();if(S.lastDone!==t||S.trialDay===t||document.querySelector("#layer .modal"))return;
  S.trialDay=t;S.trialN=(S.trialN||0)+1;persist();if(S.trialN>=ECON.trialDays)clearGate(false);else{render();pop("Trial: active day "+S.trialN+" of "+ECON.trialDays+". A fresh activity photo passes it now.")}}
setInterval(trialHonor,4000);
var econSocBase=socialBuffs;socialBuffs=function(){var o=econSocBase();if(dqState().buff)o.push({who:"Hidden quest",b:{special:"all",pct:10,text:"All quests +10% XP today"}});return o};
/* the Daily Quest lives in the profile now, right under the level card (Cal, 2026-11-09: a simpler Board) */
var econProfBase=profileHtml;
profileHtml=function(){var h=econProfBase(),i=h.indexOf('<section class="card wstrip"');var c=dqHtml();return i<0?c+h:h.slice(0,i)+c+h.slice(i)};
/* ---- prices: what a thing is x when you reach it (ECON.tier, phase, ramp, grandK, opener, lot; QA, 2026-11-09) ----
   The older layers (x10 and the early curve in 10_app_a.js, priceFlat and ROOMSTEP in 29_prices.js) now only say what a thing
   is: a small piece, a normal one, a big one, or a moment (PRICE_HUGE). This pass sets every room price. */
var DECORW=/\b(art|painting|poster|mural|vases?|sconces?|plants?|planters?|flowers?|rug|curtains?|frames?|prints|clock|sign|garland|neon|lamp|lights?|palm|fern|leaf|trim|plaque)\b/i;
function econPhase(k){return ECON.phase[k]||1}
function econKind(k,a){var e=a[3]||{},st=(typeof ROOMSTEP!=="undefined"&&ROOMSTEP[k])||1,base=a[2]/st,T=ROOMT[k]||{};
  if(ECON.kindOf[a[0]])return ECON.kindOf[a[0]];if(e.opens)return "opener";if(typeof PRICE_HUGE!=="undefined"&&PRICE_HUGE[a[0]])return "grand";
  /* in a room that earns, decor is what earns nothing (29_prices.js marks it): "Neon Bar" and "Indoor Palm" earn, so they are
     not priced as decor any more; in the Loft the name says */
  if(e.decor||(!(T.coin||T.food)&&DECORW.test(a[1])))return "decor";
  return base<=250?"furniture":base<=500?"equipment":base<=1000?"big":"grand"}
function econPrice(k,a,i,n){var e=a[3]||{},kind=econKind(k,a),ph=econPhase(k),st=(typeof ROOMSTEP!=="undefined"&&ROOMSTEP[k])||1,p;
  if(kind==="opener")p=ECON.opener*econPhase(e.opens);
  else if(kind==="grand")p=((typeof PRICE_HUGE!=="undefined"&&PRICE_HUGE[a[0]])||a[2]/st)*ECON.grandK*ph;
  else p=ECON.tier[kind]*ph*(1+ECON.ramp*(n>1?i/(n-1):0));
  return Math.round(p/50)*50}
(function(){Object.keys(ADDONS).forEach(function(k){var L=(ADDONS[k]||[]).filter(function(a){return a[2]&&!(a[3]&&a[3].retired)});
  L.forEach(function(a,i){var e=a[3]||{};if(e.fixed)return;a[2]=econPrice(k,a,i,L.length)})});
  /* lots on the street, and the Garden's knock-through that opens the Restaurant (it keeps the Restaurant's own price) */
  ["boba","theater","mall","club"].forEach(function(k){if(ROOMT[k])ROOMT[k].cost=Math.round(ECON.lot*econPhase(k)/50)*50});
  if(ROOMT.garden)ROOMT.garden.cost=ECON.lotGarden;
  if(ROOMT.restaurant){ROOMT.restaurant.cost=Math.round(ECON.opener*econPhase("restaurant")/50)*50;(ADDONS.garden||[]).forEach(function(a){if(a[0]==="gd_rest")a[2]=ROOMT.restaurant.cost})}})();
/* Shop prices (SHOP and GITEMS in 10_app_a.js, EXTRA_ITEMS in 15_shop.js), each item once even if it sits in two lists:
   clothes x shopK between clothesMin and clothesMax (the free-to-cheap basics just x shopK), permanent upgrades from ECON.buff,
   and interface items (themes, frames, backdrops, companions, titles, tap effects, HUD, sounds, scenes) by the level they open */
(function(){var seen=typeof WeakSet==="function"?new WeakSet():null;
  [typeof SHOP!=="undefined"?SHOP:[],typeof GITEMS!=="undefined"?GITEMS:[],typeof EXTRA_ITEMS!=="undefined"?EXTRA_ITEMS:[]].forEach(function(l){
    (l||[]).forEach(function(it){if(!Array.isArray(it)||!(+it[3]>0)||(seen&&seen.has(it)))return;if(seen)seen.add(it);var e=it[6]||{},s=it[1];
      if(s==="buff"){it[3]=ECON.buff[it[0]]||Math.round(it[3]/50)*50;return}
      if(/^a_/.test(s)){var v=Math.max(10,Math.round(it[3]*ECON.shopK/10)*10);it[3]=e.basic?v:Math.min(ECON.clothesMax,Math.max(ECON.clothesMin,v));return}
      it[3]=Math.round((ECON.uiBase+ECON.uiLv*Math.max(1,+it[4]||1))/50)*50})})})();
window.__qbEcon={ECON:ECON,eff:dqEff,xp:dqXp,room:payRoom,share:payShare,stats:stats4,check:dqCheck,trainXp:econTrainXp,trained:econTrained};
