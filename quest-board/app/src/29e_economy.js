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
  /* Cal, 2026-11-10: "I would like the daily quest to be 100, 200, and 300. the 100exp daily quest should grant 200 coins, And the
     200 exp should grant 400 coins, and then the 300 exp should grant 600 plus either a low tier, mid tier, or high tier relic, or
     an accessory we don't own yet from any clothing brand that has dropped or not dropped yet" (chest3, 29y_free.js) */
  /* Cal, later: "make the hidden chest at 300 exp instead of the 300 exp being shown. At first, it should say 100 exp is the goal,
     then once that finishes, the goal bar expands to 200 exp without any text indication. And then any additional exp gained will
     move the bar farther until it reached 300 exp for the hidden chest." The first dqShown tiers are shown, the rest never named. */
  dqGoal:100,dqTiers:[[100,200],[200,400],[300,600]],dqShown:2,
  /* Cal: "the odds should be 50% low tier relic, 33% accessory, 13% mid, 4% high"; chestNone coins when every accessory is owned,
     relicDup coins by tier when every relic of the tier is owned (a relic is never given twice) */
  chest3:[["low",50],["acc",33],["mid",13],["high",4]],chestNone:300,relicDup:{low:150,mid:400,high:1000,legendary:2500},
  /* the relics' buffs (Cal's list, SPEC6; the kinds are explained in 29y_free.js). Low: +0.5% XP on one quest group; mid: +1% on one
     group or +2% income in one business; high: a small rule-bender; legendary (Rafe's hunts): each stronger than the last.
     relicSet: owning every relic of a tier adds this % XP on every quest. */
  relicBuff:{r2_keyring:{cl:"home",xp:.5},r2_compass:{cl:"out",xp:.5},r2_pen:{cl:"admin",xp:.5},r2_teacup:{cl:"reset",xp:.5},
    r2_leash:{cl:"home",xp:.5},r2_whetstone:{cl:"body",xp:.5},r2_thimble:{cl:"create",xp:.5},r2_libcard:{cl:"admin",xp:.5},
    r2_recipe:{cl:"home",xp:.5},r2_peg:{cl:"home",xp:.5},r2_doorbell:{cl:"social",xp:.5},r2_lunchtin:{cl:"body",xp:.5},
    r2_lantern:{gift:.01},r2_shell:{rooms:["garden"],inc:2},r2_hilt:{train:1},r2_inkwell:{cl:"admin",xp:1},
    r2_foxbell:{rooms:["boba","dessert"],inc:2},r2_monocle:{cl:"social",xp:1},r2_emberfox:{cl:"create",xp:1},r2_hourglass:{cl:"reset",xp:1},
    r2_starcompass:{mt:.10},r2_phoenix:{freeze:1},r2_mirror:{first3:5},r2_familiar:{chest:5},r2_gauntlet:{stat:"fitness",xp:3},
    r2_codex:{cl:["admin","create"],xp:3},
    r2_crown:{all:2},r2_wyrmheart:{all:3,biz:5},r2_veil:{all:4,crawl:1},r2_worldseed:{all:5,rb:1.25}},
  relicSet:{low:1,mid:1.5,high:2},
  /* the town's efficiency keeps its own 150 XP mark (the old goal), so the lower Daily Quest goal does not raise business income */
  effGoal:150,effFirst:.25,effOver:1.5,hidden:2,  /* efficiency after the first task; cap in overtime, reached at hidden x effGoal */
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
  /* Cal, 2026-11-10: "I am aiming for 3 months to reach lvl 100 and unlock everything", "about 2 weeks of proper play to get to
     lvl 40", and "The leveling should definitely ramp up more ... The last few levels ... should take a day or 2 or even 3":
     curve 4. Levels 1 to 5 as before, then lvFlat + lvK x (L - lvRamp)^lvP: 140 at 10, 197 at 20, 499 at 40, 1,053 at 60, 1,856
     at 80, 2,859 at 99; about 97,000 XP to level 100 (was 13,905). Measured (econsim, Cal's routine): the spec's first fit (4.04 x
     (L - 6)^1.25) put level 100 at day 65, so the top is steeper. */
  lvFirst:20,lvRamp:6,lvFlat:135,lvK:.315,lvP:2,
  wwCoins:3000,                                   /* Weekly Warrior's coins, fixed (its XP follows the curve) */
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
  /* W25: coins earned since the story room before it opened (STYCHAIN in 29b_story.js) */
  storyCoins:{chef:2000,boba:6000,dessert:8000,lockkey:12000,mall:20000},
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
  /* W21: later rooms cost more again, by their phase (x (1 + lateK x (phase - 1))): the Loft as before, the Restaurant about 2.1x,
     the Nightclub about 4.9x, so every upgrade lasts about three months of Cal's routine (econsim) */
  lateK:1.25,
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
function dqEff(){var x=dqXp(),p=x/ECON.effGoal,e;if(x<=0)return 0;e=p<1?ECON.effFirst+(1-ECON.effFirst)*p:Math.min(ECON.effOver,1+(ECON.effOver-1)*(p-1)/(ECON.hidden-1));return dqState().buff?e*1.1:e}
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
/* ---- the Daily Quest card, its chests, and the hidden chest ---- */
/* the goal the bar shows: the first shown tier still ahead (100, then 200), or null past them, when the bar fills on toward the
   hidden chest with no number */
function dqTarget(){var x=dqXp(),T=ECON.dqTiers.slice(0,ECON.dqShown);for(var i=0;i<T.length;i++)if(x<T[i][0])return T[i][0];return null}
function dqHidden(){var T=ECON.dqTiers;return T[T.length-1][0]}
/* [main fill, overtime fill]: toward the shown goal, then past it toward the hidden chest */
function dqFill(){var x=dqXp(),t=dqTarget(),top=ECON.dqTiers[ECON.dqShown-1][0];return t?[Math.min(1,x/t),0]:[1,Math.min(1,Math.max(0,(x-top)/(dqHidden()-top)))]}
function dqHtml(){if(!S.created)return '';var x=dqXp(),g=dqGoal(),t=dqTarget(),f=dqFill(),e=dqEff(),sp=stats4(),d=dqState();
  return '<section class="card panel dq"><div class="row" style="justify-content:space-between"><h3 class="label">Daily Quest</h3><span class="mono">'+(t?x+' / '+t+' XP':x+' XP')+'</span></div>'
    +'<div class="dq-bar"><i style="width:'+(f[0]*100)+'%"></i><i class="ot" style="width:'+(f[1]*100)+'%"></i></div>'
    +'<p class="note">'+(x<=0?'Finish a task to start your day. ':x<g?'<b>'+(g-x)+' XP left</b> to finish today\'s Daily Quest. ':'Daily Quest done. ')+(x>0?'Town running at <b>'+Math.round(e*100)+'%</b>'+(d.buff?' (yesterday\'s hidden chest: +10%)':'')+'.':'')+'</p>'
    +'<p class="note">Weekly Quest: <b>'+wqState().n+' of '+ECON.wqDays+'</b> active days'+(wqState().paid?', done for this week.':', pays a level of XP.')+(S.rest&&S.rest.x>0?' Rested: <b>'+S.rest.x+' XP</b>, quests pay double until it runs out.':'')+'</p>'
    +'<div class="dq-row">'+Object.keys(STATN).map(function(k){var ic=econArt("ui_stat_"+k+".webp");return '<span class="chip dq-st" title="'+STATD[k]+'">'+(ic?'<img src="'+ic+'" alt="">':'')+STATN[k]+' '+sp[k]+'</span>'}).join("")+'</div></section>'}
function econArt(n){return window.QBART&&QBART[n]}
/* each tier's chest once a day (d.tier: how many are open; a save from before the tiers had d.done for the one chest). The shown
   chests say nothing about the next one; the last, hidden one adds the relic or accessory roll, the old hidden quest's reward (a
   streak freeze, else +1 INT, else 300 coins) and tomorrow's +10% */
function dqCheck(){if(!loaded||!S.created)return;var d=dqState(),x=dqXp(),sp=stats4(),T=ECON.dqTiers;
  if(d.done&&!d.tier)d.tier=1;
  if((d.tier||0)>=T.length||x<T[d.tier||0][0]||document.querySelector("#layer .dqc"))return;
  var k=d.tier||0,c=dqChest(T[k][1]),hid=k>=ECON.dqShown,art=econArt("ui_dq_chest.webp"),g3=null,r="";d.tier=k+1;d.done=1;S.coins+=c;S.earnedC+=c;
  if(hid){g3=chest3Roll();d.hid=1;var tm=gameNow();tm.setDate(tm.getDate()+1);d.hidFor=dstr(tm);
    if(typeof maxFreeze==="function"&&S.freezes<maxFreeze()){S.freezes++;r="A streak freeze"}else if(sp.int*ECON.int<ECON.intMax){sp.int++;r="+1 INT: "+STATD.int}else{S.coins+=300;S.earnedC+=300;r="+300 coins"}}
  persist();
  modal('<div class="card box2 dqc"><span class="label">'+(hid?'Hidden chest':k?'Bonus chest':'Daily Quest complete')+'</span>'
    +(hid&&econArt("ui_hidden_quest.webp")?'<img class="dq-hid" src="'+econArt("ui_hidden_quest.webp")+'" alt="">':art?'<img class="dg-gift" src="'+art+'" alt="">':'<div class="dg-gift dg-gift0">'+isoCrate()+'</div>')
    +'<h3>+'+c.toLocaleString()+' coins</h3>'+(hid?'<p class="note">Nobody told you this one existed.</p>'+chest3Html(g3)+'<p class="dg-buff">'+esc(r)+'</p><p class="note">Tomorrow your quests earn 10% more XP and the town runs 10% faster.</p>':'<p class="note">'+(!k&&dqEff()>=1?'Your town runs at full speed today.':'')+'</p>')
    +'<div class="row"><button class="btn" data-act="mclose">Done</button></div></div>')}
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
  p*=econLate(kind==="opener"?e.opens:k);
  return Math.round(p/50)*50}
function econLate(k){return 1+ECON.lateK*(econPhase(k)-1)}
(function(){Object.keys(ADDONS).forEach(function(k){var L=(ADDONS[k]||[]).filter(function(a){return a[2]&&!(a[3]&&a[3].retired)});
  L.forEach(function(a,i){var e=a[3]||{};if(e.fixed)return;a[2]=econPrice(k,a,i,L.length)})});
  /* lots on the street, and the Garden's knock-through that opens the Restaurant (it keeps the Restaurant's own price) */
  ["boba","theater","mall","club"].forEach(function(k){if(ROOMT[k])ROOMT[k].cost=Math.round(ECON.lot*econPhase(k)*econLate(k)/50)*50});
  if(ROOMT.garden)ROOMT.garden.cost=ECON.lotGarden;
  if(ROOMT.restaurant){ROOMT.restaurant.cost=Math.round(ECON.opener*econPhase("restaurant")*econLate("restaurant")/50)*50;(ADDONS.garden||[]).forEach(function(a){if(a[0]==="gd_rest")a[2]=ROOMT.restaurant.cost})}})();
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
/* ---- Room Bonus (Cal, 2026-11-10: "some assets should provide a buff but very miniscule ... a new bed would increase your
   productivity by 0.2% exp gain ... each room should have some stats on the screen that show you how much passive buff increase is
   provided by that fully decked out room"): each Loft room gives at most ECON.roomBonus % XP on every quest when fully upgraded,
   split across its upgrades by price (a[3].xp), so a 7-upgrade room and a 35-upgrade room both top out at the same. It replaces
   the Patio's and Game Room's old per-upgrade XP. Crew in a room still add their 1% each. ---- */
ECON.roomBonus=3;ECON.roomBonusRooms={bedroom:"Rested",closet:"Room bonus",gameroom:"Room bonus",patio:"Room bonus"};
function rbList(t){return (ADDONS[t]||[]).filter(function(a){var e=a[3]||{};return a[2]>0&&!e.retired&&!e.opens&&e.g!=="Expansion"})}
(function(){Object.keys(ECON.roomBonusRooms).forEach(function(t){var T=ROOMT[t];if(!T)return;var L=rbList(t),tot=L.reduce(function(s,a){return s+a[2]},0);if(!tot)return;
  T.buff={special:"all"};T.pct=0;
  (ADDONS[t]||[]).forEach(function(a){var e=a[3]=a[3]||{};if(L.indexOf(a)<0){if(e.xp)e.xp=0;return}e.xp=Math.round(ECON.roomBonus*a[2]/tot*100)/100;
    a[4]=String(a[4]||"").replace(/ ?\+[\d.]+% XP on all quests\./,"")})})})();
/* a Loft room's bonus now, rounded for the screen */
function rbPct(r){return Math.round(addonsOf(r).reduce(function(s,a){return s+((a[3]&&a[3].xp)||0)},0)*rbMult(r.t)*10)/10}
/* The Worldseed (a legendary relic) multiplies every Loft room's bonus */
function rbMult(t){return ECON.roomBonusRooms[t]&&typeof r2Rb==="function"?r2Rb():1}
/* ---- bigger upgrades earn more (Cal, 2026-11-10: "bigger upgrades should give bigger passive buffs. Such as the imax screen should
   definitely start generating more income"): in a room that earns, each earning upgrade's share follows what it is (econKind)
   by ECON.earnW, and the room's total stays what it was ---- */
ECON.earnW={decor:1,furniture:1,equipment:2,big:3,grand:5};
(function(){Object.keys(ADDONS).forEach(function(k){var T=ROOMT[k];if(!T||!(T.coin||T.food))return;
  var L=(ADDONS[k]||[]).filter(function(a){var e=a[3]||{};return e.p>0&&!e.retired&&!e.opens});if(L.length<2)return;
  var tot=L.reduce(function(s,a){return s+a[3].p},0),wt=L.map(function(a){return ECON.earnW[econKind(k,a)]||1}),ws=wt.reduce(function(s,w){return s+w},0);
  L.forEach(function(a,i){var e=a[3],np=Math.round(tot*wt[i]/ws*1000)/1000,old=Math.round(e.p*100);e.p=np;
    a[4]=String(a[4]||"").replace(new RegExp(" Earns \+"+old+"% here\."),"")+" Earns +"+Math.round(np*100)+"% here."})})})();
/* ---- level gates (Cal, 2026-11-10, W22): face cosmetics at level ECON.faceLv (anyone already wearing one keeps it); level 90
   items get ECON.l90 in econPrice when the Mac makes them; pets at 30 come with their art (W23) ---- */
ECON.faceLv=40;ECON.accLv=20;
(function(){(typeof SHOP!=="undefined"?SHOP:[]).forEach(function(it){if(it[1]==="a_xface")it[4]=Math.max(+it[4]||1,ECON.faceLv)})})();
/* the second accessory: worn from S.eq.a_acc2 once the level is reached, never the same piece as the first, never on the same part
   of the body (two necklaces would draw on top of each other) */
function acc2Slot(it){var M=it&&it[6]&&it[6].gar&&QBLoft.data.items[it[6].gar];return M?M.slot:""}
function acc2Ok(it){if(!it||it[1]!=="a_acc"||effLvl()<ECON.accLv)return false;var a1=S.eq.a_acc&&S.owned[S.eq.a_acc]?shopItem(S.eq.a_acc):null;
  return !a1||(a1[0]!==it[0]&&acc2Slot(a1)!==acc2Slot(it))}
function acc2Item(base,ovr){if(base||!S||!S.eq||!S.eq.a_acc2||effLvl()<ECON.accLv)return null;var it=shopItem(S.eq.a_acc2);
  if(!it||!S.owned[it[0]]||!itemFits(it))return null;var a1=ovr&&ovr.a_acc!==undefined?(ovr.a_acc?shopItem(ovr.a_acc):null):(S.eq.a_acc&&S.owned[S.eq.a_acc]?shopItem(S.eq.a_acc):null);
  return a1&&(a1[0]===it[0]||acc2Slot(a1)===acc2Slot(it))?null:it}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=equip2],[data-act=unequip2]");if(!b)return;
  if(b.dataset.act==="equip2"){var it=shopItem(b.dataset.id);if(!acc2Ok(it))return;S.eq.a_acc2=it[0];pop(it[2]+" worn as your second accessory")}else delete S.eq.a_acc2;
  persist();render()});
function rmStats(r,i,base){var T=ROOMT[r.t],L=ADDONS[r.t]||[],own=addonsOf(r).length,all=L.filter(function(a){return !(a[3]&&(a[3].retired||a[3].opens))}).length;
  if(ECON.roomBonusRooms[r.t]){var n=rbList(r.t).filter(function(a){return r.a&&r.a[a[0]]}).length,tot=rbList(r.t).length;
    return ECON.roomBonusRooms[r.t]+" +"+rbPct(r)+"% XP on every quest ("+n+" of "+tot+" upgrades, up to +"+ECON.roomBonus+"%)"+(roomCrew(i).length?", crew +"+roomCrew(i).length+"%":"")}
  if(T.coin||T.food)return base+". Town at "+Math.round(dqEff()*100)+"% today, payout share "+Math.round(payShare()*100)+"%, "+own+" of "+all+" upgrades";
  return base}
