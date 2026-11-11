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
  shareBare:.20,shareFull:.60,                    /* the most all businesses may pay a day, as a share of today's task coins */
  /* w-econ3 (Cal, 2026-11-10, via ARCHITECT: businesses about 10% of a day's coins when the Garden opens, 15% with the Restaurant,
     20% with the Mall, 25 to 30% at the end, never above 30%; quests stay the large majority. And Cal: "some upgrades say +22% produce,
     but I dont see the number of coins you earn a day increasing"): each business pays at most its own day, bizDay[room] coins fully
     upgraded at full speed, and less with fewer upgrades: its coins an hour (set from bizDay) x its "+N%" upgrades x the hours it holds,
     x the town's efficiency today. So every earning upgrade raises that business's day, and the room says it ("Earns about 1,240 a
     day, +22% from upgrades"). Above them all, the share of today's task coins (payRoom, the W21 cap, now shareFull flat instead of
     growing with every upgrade in the game) is the most all businesses together may pay, and produce sold (vegCoin each, was 4)
     counts in it too */
  bizDay:{garden:900,restaurant:1100,skybar:300,rooftop:300,boba:250,dessert:250,mall:400,theater:650,auditorium:600,arcade:400,
    rhythm:350,vr:350,bowling:400,karaoke:400,club:800},
  vegCoin:7,
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
  slotFree:{garden:1,chef:1,lockkey:1,boba:1,dessert:1,rooftop:1,mall:1,theater:1,auditorium:1,arcade:1,rhythm:1,vr:1,bowling:1,karaoke:1,club:1},                     /* story steps the one-a-day early unlock slot never holds back (Cal: Garden day 1) */
  /* Cal, 2026-11-05: "the garden can be unlocked at lvl 5 and scale things up from there. Otherwise we are unlocking too
     many things before lvl 10." The least level for each story step, on top of its own gate; one step every few levels. */
  waterH:24,sprAlso:"g_x2",sprPrice:2000,         /* Cal: Sprinklers "much later": only with the Garden's Estate stage (was 6,000) */
                                      /* Cal: watering the Garden lasts a day; Sprinklers make it automatic */
  oneSlotBelow:10,                                /* below this level, one unlock (area or story step) a day in all */
  /* Cal, 2026-11-09: the Loft and the Garden on day 1 and the Restaurant by day 2 or 3, for everyone (were levels 5 and 7) */
  /* SPEC8: Lock and Key now comes before Boba and Dessert, so their level floors swap */
  /* w-unlock: the rooms open on Cal's table (ECON.unlock) with no level floor; the two people who join keep theirs */
  stepLv:{rafe:15,nova:21},
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
  /* w-econ3 round 2 (econsim on w-unlock: 16% bought at level 30 against 33%, 96% at 90): every room price x0.75, the late rooms'
     multiplier back up to 1 so the last rooms keep their weight (estimate: everything bought about level 89) */
  tier:{decor:150,furniture:245,equipment:375,big:560},
  /* W21: later rooms cost more again, by their phase (x (1 + lateK x (phase - 1))): the Loft as before, the Restaurant about 2.1x,
     the Nightclub about 4.9x, so every upgrade lasts about three months of Cal's routine (econsim) */
  /* w-econ3 (Cal, 2026-11-10: "everything bought around lvl 90 ... reaching level 100 but having 200 upgrades left is severely
     unbalanced"): the late rooms' multiplier comes down from 1.25 so buying keeps up with levels in the second half */
  lateK:1,
  kindOf:{au_proj1:"equipment"},                 /* the plain Digital Projector, so the IMAX one is the clear step up */
  grandK:.45,opener:1050,lot:1500,lotGarden:750,ramp:.5,
  /* measured (econsim.js, a heavy player): about 3,700 a day in the Loft's first days, 6,000 when the Garden opens, 10,000 at
     the Restaurant, then 13,000 to 15,000 from Boba on, where it levels off; the phases follow that, a bit under it */
  /* SPEC8: Lock and Key opens before Boba and Dessert, so it takes their place in the price phases; w-unlock: then the Rooftop, Boba, Dessert */
  phase:{bedroom:1,patio:1,closet:1,gameroom:1.2,lair:1.3,trophy:1.3,garden:1.3,restaurant:1.8,skybar:2.2,rooftop:2.3,boba:2.5,dessert:2.7,mall:2.8,theater:3,auditorium:3,arcade:3.2,rhythm:3.3,vr:3.3,bowling:3.4,karaoke:3.5,club:3.8},
  /* the Shop: clothes keep each brand's own spread x shopK, between clothesMin and clothesMax (Cal: "the shop is almost 1000
     for some items"); interface items cost uiBase + uiLv x the level they open at; permanent upgrades pay for themselves in
     about a week or two of quests, so each is priced by what it returns (Merchant Seal I was 500 for +10% coins forever) */
  shopK:.4,clothesMin:150,clothesMax:700,uiBase:200,uiLv:25,
  /* clothes by quality (SPEC3 part 5; QA's grades through clothTier in 29e_tiers.js): a graded piece costs inside its tier's band,
     placed by its slot (a coat above a cap), its brand's overall level (VENOM ROSE high, KAIMANA low) and its old price against
     the brand's other pieces. designer waits for a designer brand (Cal: "could cost 3000 for a specific pair of pants or a top";
     no art yet). Pieces nobody graded keep shopK, clothesMin and clothesMax */
  cloth:{thrift:[100,250],standard:[250,500],premium:[600,1200],luxury:[1300,2200],designer:[2400,3000]},
  clothSlot:{a_top:.55,a_pants:.45,a_shoes:.45,a_back:.7,a_acc:.3,a_hat:.3,a_mask:.25},
  clothBrand:{rose:.25,cr:.2,nc:.15,bb:.05,sm:.05,sp:-.05,smk:-.05,oak:-.05,y2k:-.1,km:-.15,basics:-.25},
  clothNudge:.3,
  /* the Shop's floors (W42, Cal 2026-11-10: "Go on the shop floor plans"): the Street opens with the Closet, the Boutique at level
     30, the Atelier at 70. A brand's floor is fl in BRANDS (10_app_a.js; none means the Street). days: its drop weekdays (0 is
     Sunday), every: weeks between drop weeks, live: brands on sale at once, line: the Shop's header. A floor with no brands stays
     hidden (the Atelier until its art arrives) */
  floors:[{id:"street",name:"Street",lv:0,days:[1,5],every:1,live:2,line:"New brands Mondays and Fridays, 8 am"},
    {id:"boutique",name:"Boutique",lv:30,days:[5],every:1,live:2,line:"A new brand every Friday, 8 am"},
    {id:"atelier",name:"Atelier",lv:70,days:[5],every:2,live:1,line:"A new brand every other Friday, 8 am"}],
  /* a piece costs what its brand's floor charges, and QA's grade orders it inside the floor: Street 110 to 460, Boutique about
     600 to 1,200, Atelier about 1,300 to 3,000 */
  clothFloor:{street:{thrift:[110,250],standard:[250,440],premium:[440,460],luxury:[440,460]},
    boutique:{thrift:[600,650],standard:[600,800],premium:[800,1050],luxury:[1050,1200]},
    atelier:{thrift:[1300,1400],standard:[1300,1800],premium:[1800,2400],luxury:[2400,3000]}},
  /* SPEC8 (Cal, 2026-11-10: "by capping the amount of features, it allows more focus in the beginning and then the next expansion
     makes more sense"): a story room opens only when its trigger is met AND every room the player has in its building (the building
     before it, for a building's first room) has at least focusMin of its upgrades, plus its level floor. No day wait. The Garden's
     trigger is gardenLoft of the upgrades in loftCore (Cal: "garden at 50% of Loft upgrades"); Boba's is bobaEarn coins collected
     in the Restaurant since it opened */
  /* w-unlock (Cal, 2026-11-10: "make the next room upgrades available only after you hit a certain percentage of all available
     upgrades in that room"): what opens each room. at: that share of the room's own upgrades (openers, retired pieces and Trophy Room
     finds don't count); loft: that share of all the Loft's core upgrades, built or not; earn: coins the Garden has made selling
     produce; noir: the Restaurant's Noir upgrade; plaza: that share of all Kode Plaza upgrades, built or not. Replaces SPEC8's focus
     rule. The Mall-building numbers are mine, from econsim (Cal: "Use this same logic") */
  unlock:{closet:{at:"bedroom",pct:.3},patio:{at:"bedroom",pct:.5},gameroom:{at:"bedroom",pct:.7},garden:{loft:.6},
    restaurant:{earn:"garden",coins:3000},skybar:{noir:1},rooftop:{at:"skybar",pct:.5},boba:{at:"skybar",pct:.75},dessert:{at:"boba",pct:.6},
    mall:{plaza:.6},theater:{at:"mall",pct:.3},auditorium:{at:"theater",pct:.4},arcade:{at:"auditorium",pct:.4},rhythm:{at:"arcade",pct:.4},
    vr:{at:"rhythm",pct:.4},bowling:{at:"vr",pct:.4},karaoke:{at:"bowling",pct:.4},club:{at:"karaoke",pct:.4}},
  /* the one-time reset (Cal: "initialize the loft and refund all the money they have spent so far"): a save from before APPV
     resetBefore gets its rooms and buildings reset and refunded once; resetScope "all" or "loft" (the Loft's rooms only). LEAD
     (16:03): the reset is keyed on "never reset" (S.reset91), so resetBefore is only a note of the version that brought it */
  resetBefore:91,resetScope:"all",
  focusMin:.5,gardenLoft:.5,loftCore:["bedroom","closet","gameroom","patio"],bobaEarn:20000,
  /* the Mall waits for every Kode Plaza room to be built (econsim: going by only the rooms a player had, it opened on day 18, before
     Lock and Key, Boba and Dessert), then for the focus rule */
  plazaAll:["garden","restaurant","skybar","rooftop","boba","dessert"],   /* also Kode Plaza for the Mall's plaza share */
  /* the building Goals (SPEC8 part 3): [coins, XP] for a room half upgraded, fully upgraded and a story step; coins x the room's
     phase, paid once on a tap */
  goal:{half:[400,25],full:[1200,75],story:[300,25]},   /* w-econ3: half the XP, so level 100 does not come sooner */
  /* w-econ3 (Cal: "im okay with keeping the big purchases to a day's income. only some of them should be that expensive"): each room's
     big moments (1 or 2) cost about bigDay of a regular player's daily income at the time that room opens (roomDay, measured with
     econsim); everything else is priced for its tier as before */
  bigDay:.75,
  roomDay:{gameroom:6500,lair:11500,garden:11500,restaurant:11500,skybar:15500,rooftop:17000,boba:17000,dessert:18500,mall:18500,
    theater:19000,auditorium:19000,arcade:21000,rhythm:21000,vr:21000,bowling:21000,karaoke:21000,club:22000},
  bigMoment:{gameroom:["gm_tv80"],lair:["lr_core"],garden:["g_green2"],restaurant:["r_x2"],skybar:["sb_piano"],rooftop:["rf_pool","rf_tub"],
    boba:["bo_shake"],dessert:["de_soft"],mall:["ml_esc"],theater:["t_wing"],auditorium:["au_imax","au_proj2"],rhythm:["rh_lights"],
    vr:["vr_wall"],bowling:["bw_lane1"],karaoke:["ka_booth"],club:["cb_vip","cb_floor"]},
  /* w-econ3: what a regular player makes in a day at a level and how much of it is quest coins (econsim), what a permanent upgrade
     takes to pay back (payDays), and the share of a day an interface item or a non-percent upgrade costs */
  dayInc:[[1,6000],[10,10000],[30,11400],[60,21200],[90,32200],[100,32200]],
  questInc:[[1,3500],[10,4900],[30,5700],[60,6600],[90,12200],[100,12200]],
  payDays:15,utilDay:{freeze:.5,streak:.6,away:.6},uiDay:.12,
  buff:{bf_coin1:1500,bf_coin2:3000,bf_coin3:5000,bf_xp1:800,bf_xp2:1500,bf_xp3:2500,bf_freeze:1000,bf_streak:1500,bf_away:2000},
};
/* a story lot's padlock on the street is its story level (ROOMT.lv said 16 for the Boba lot, 24 the Theater, 30 the Mall, 50
   the Club, so the street and the story disagreed) */
/* Cal (2026-11-10): no level on story rooms; the story and its triggers open them (a lot no longer says "unlocks at level N") */
["garden","boba","theater","mall","club"].forEach(function(k){if(ROOMT[k])ROOMT[k].lv=ECON.stepLv[k]||1});
/* ---- today's effort ---- */
function dqState(){var t=today();if(!S.dq||S.dq.d!==t){var prev=S.dq||{};S.dq={d:t,tx:0,spent:0,paid:0,done:0,hid:0,buff:prev.hidFor===t?1:0}}return S.dq}
function dqGoal(){return ECON.dqGoal}
/* the next Daily Quest chest still closed today ([XP, coins]), or null when all are open */
function dqNext(){var x=dqXp(),t=ECON.dqTiers;for(var i=0;i<t.length;i++)if(x<t[i][0])return t[i];return null}
/* w-econ3 (Cal, 2026-11-10: "all quests and sources of income should make sense and scale a bit"): a flat payout grows with level at
   the rate quest coins do (ECON.coinLv a level); Cal's numbers (the chests' 200 / 400 / 600, the Wheel's slices, Weekly Warrior's
   3,000, a greeting's 3) are the level-1 values */
function econScaled(c,step){step=step||10;var L=1;try{L=effLvl()}catch(e){}return Math.max(step>1?step:1,Math.round(c*(1+(ECON.coinLv||.01)*(L-1))/step)*step)}
function dqChest(c){return Math.round(econScaled(c)*(1+Math.min(ECON.intMax,stats4().int*ECON.int)))}
function dqXp(){var d=dqState();return Object.keys(S.done||{}).reduce(function(a,k){return a+(+S.done[k]||0)},0)+(d.tx||0)}
function dqEff(){var x=dqXp(),p=x/ECON.effGoal,e;if(x<=0)return 0;e=p<1?ECON.effFirst+(1-ECON.effFirst)*p:Math.min(ECON.effOver,1+(ECON.effOver-1)*(p-1)/(ECON.hidden-1));return dqState().buff?e*1.1:e}
function stats4(){if(!S.sp||typeof S.sp!=="object")S.sp={str:0,agi:0,vit:0,int:0};return S.sp}
/* QA (2026-11-09): only rooms a player can open count (the old Lounge, Gym, Spa and the rest are still in ADDONS, so a town with
   every upgrade read 74% and the payout share never reached shareFull) */
function upRooms(){return Object.keys(ADDONS).filter(function(k){return typeof ROOMCELL!=="undefined"&&ROOMCELL[k]&&!(typeof styStep==="function"&&(styStep(k)||{}).how==="never")})}
function upFrac(){var own=0,all=0;upRooms().forEach(function(k){var r=S.base.slots.filter(function(x){return x&&x.t===k})[0];(ADDONS[k]||[]).forEach(function(a){if(!a[0]||(a[3]&&a[3].retired))return;all++;if(r&&r.a&&r.a[a[0]])own++})});return all?own/all:0}
/* w-econ3: flat, so one upgrade anywhere no longer moves it by a hair; each business has its own day (bizLeft) under it */
function payShare(){return ECON.shareFull+Math.min(ECON.vitMax,stats4().vit*ECON.vit)}
/* ---- each business's own day (w-econ3, Cal: an earning upgrade must visibly raise what that business pays) ----
   bizInit sets a business's coins an hour from ECON.bizDay: fully upgraded (every "+N%" and every extra hour it holds) at full speed
   it makes bizDay[room] in the hours it holds. It reads the room's upgrades as they are, so a file that adds one later is covered
   (it runs again from econEarn and on the first simulate). */
function bizInit(k){Object.keys(ECON.bizDay).forEach(function(t){if(k&&t!==k)return;var T=ROOMT[t];if(!T)return;var sp=0,cp=0;
  (ADDONS[t]||[]).forEach(function(a){var e=a[3]||{};if(e.retired)return;sp+=+e.p||0;cp+=+e.cap||0});T.coin=Math.round(ECON.bizDay[t]/(1+sp)/((T.store||8)+cp)*1000)/1000})}
var BIZINIT=0;function bizReady(){if(!BIZINIT){BIZINIT=1;bizInit();econSort()}}
function bizVit(){return 1+Math.min(ECON.vitMax,stats4().vit*ECON.vit)}
/* a business's day at full speed now, and how much its upgrades add over the bare room */
function bizDayOf(i){bizReady();var r=bslot(i),T=r&&ROOMT[r.t];if(!T||!T.coin||!ECON.bizDay[r.t])return 0;return T.coin*roomMult(i)*roomStore(r)*bizVit()}
function bizUpPct(r){var sp=0;addonsOf(r).forEach(function(a){sp+=+a[3].p||0});return Math.round(((1+sp)*roomStore(r)/((ROOMT[r.t]||{}).store||8)-1)*100)}
/* what it may still pay today (the town's efficiency today, less what it paid) */
function bizLeft(r,i){if(!r||!ECON.bizDay[r.t])return Infinity;var d=dqState().d,p=r.pd&&r.pd.d===d?r.pd.n:0;return Math.max(0,Math.floor(bizDayOf(i)*openMult()-p))}
function bizPaid(r,n){var d=dqState().d;if(!r.pd||r.pd.d!==d)r.pd={d:d,n:0};r.pd.n+=n}
var bizSimBase=simulate;simulate=function(){bizReady();return bizSimBase.apply(this,arguments)};
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
    +'<div class="dq-bar'+(dqTarget()?'':' dq-past')+'"><i style="width:'+(f[0]*100)+'%"></i><i class="ot" style="width:'+(f[1]*100)+'%"></i></div>'
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
    if(typeof maxFreeze==="function"&&S.freezes<maxFreeze()){S.freezes++;r="A streak freeze"}else if(sp.int*ECON.int<ECON.intMax){sp.int++;r="+1 INT: "+STATD.int}else{var hc=econScaled(300);S.coins+=hc;S.earnedC+=hc;r="+"+hc.toLocaleString()+" coins"}}
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
/* what each upgrade is, read once from its price before the pass below re-prices it (QA: read afterwards, nearly everything
   came out "grand", so earn by size was flat) */
var ECONKIND={};
function econKind(k,a){if(ECONKIND[k+"|"+a[0]])return ECONKIND[k+"|"+a[0]];var e=a[3]||{},st=(typeof ROOMSTEP!=="undefined"&&ROOMSTEP[k])||1,base=a[2]/st,T=ROOMT[k]||{};
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
  L.forEach(function(a){ECONKIND[k+"|"+a[0]]=econKind(k,a)});
  L.forEach(function(a,i){var e=a[3]||{};if(e.fixed)return;a[2]=econPrice(k,a,i,L.length)});
  /* the room's big moments: about a day of income when the room opens (two of them: the second about two thirds of that) */
  (ECON.bigMoment[k]||[]).forEach(function(id,j){var a=L.filter(function(x){return x[0]===id})[0];if(a&&ECON.roomDay[k])a[2]=Math.round(ECON.roomDay[k]*ECON.bigDay*(j?.65:1)/50)*50})});
  /* lots on the street, and the Garden's knock-through that opens the Restaurant (it keeps the Restaurant's own price) */
  ["boba","theater","mall","club"].forEach(function(k){if(ROOMT[k])ROOMT[k].cost=Math.round(ECON.lot*econPhase(k)*econLate(k)/50)*50});
  if(ROOMT.garden)ROOMT.garden.cost=ECON.lotGarden;
  if(ROOMT.restaurant){ROOMT.restaurant.cost=Math.round(ECON.opener*econPhase("restaurant")*econLate("restaurant")/50)*50;(ADDONS.garden||[]).forEach(function(a){if(a[0]==="gd_rest")a[2]=ROOMT.restaurant.cost})}
  econRules()})();
/* ---- Cal's price rules (w-econ3, 2026-11-10: "For small upgrades that are looks only, they should be cheaper in every room. For items
   that increase the passive income, those can be priced higher. The order of upgrades need to make sense too. if a table is 800, but
   plants are 1800, there is a problem here in continuity"), after the pass above, room by room:
   1. looks only (in a business: no "+N%"; elsewhere: decor with no effect) costs the room's decor price, flat (no list ramp), and never
      more than the room's cheapest other upgrade;
   2. in a business, the earning upgrades share what the room's earners and looks cost before, by their "+N%" as written (what the piece
      does, not its old price), so each pays itself back in the same number of days and the card can say its coins a day;
   3. moments keep their price (openers, expansions, PRICE_HUGE pieces, the big moments, fixed:1);
   4. each list is in price order, cheapest first, and a piece that needs another comes right after it (at its own price).
   No invisible upgrades: the Back Office Safe and the Root Cellar drew nothing and only held more hours, so they leave the shop
   (ECON.retire); owners keep them and what they do, and the ids stay. */
function econRules(){(ECON.retire=ECON.retire||["r_safe","g_cellar"]).forEach(function(id){Object.keys(ADDONS).forEach(function(k){(ADDONS[k]||[]).forEach(function(a){if(a[0]===id)a[3]=Object.assign({},a[3]||{},{retired:1})})})});
  Object.keys(ADDONS).forEach(function(k){var T=ROOMT[k]||{},biz=!!(T.coin||T.food),A=ADDONS[k]||[],L=A.filter(function(a){return a[2]&&!(a[3]&&a[3].retired)});if(!L.length)return;
    var hard=function(a){var e=a[3]||{};return !!(e.fixed||e.opens||e.g==="Expansion")},bare=function(a){var e=a[3]||{};return !(+e.p>0)&&!e.xp&&!e.cap&&!e.shelf&&!e.fresh&&!e.dish};
    /* a looks-only piece is cheap even if it was a big moment (the Stone Fountain) */
    var mom=function(a){var e=a[3]||{};return hard(a)||!(biz&&bare(a))&&!!(ECONKIND[k+"|"+a[0]]==="grand"||(ECON.bigMoment[k]||[]).indexOf(a[0])>=0)};
    var looks=function(a){return !mom(a)&&bare(a)&&(biz||ECONKIND[k+"|"+a[0]]==="decor")};
    var flat=Math.max(50,Math.round(ECON.tier.decor*econPhase(k)*econLate(k)/50)*50),Lk=L.filter(looks),Le=biz?L.filter(function(a){return !mom(a)&&!looks(a)&&+(a[3]||{}).p>0}):[];
    var before=0;Lk.concat(Le).forEach(function(a){before+=+a[2]});
    Lk.forEach(function(a){a[2]=flat});
    if(Le.length){var sp=0;Le.forEach(function(a){sp+=+a[3].p});var rest=Math.max(flat*Le.length,before-flat*Lk.length);
      Le.forEach(function(a){a[2]=Math.max(flat,Math.round(rest*a[3].p/sp/50)*50)})}
    var minO=L.filter(function(a){return !looks(a)}).reduce(function(m,a){return Math.min(m,+a[2])},Infinity);
    if(minO<Infinity)Lk.forEach(function(a){if(a[2]>minO)a[2]=Math.max(50,Math.floor(minO/50)*50)});
    /* a piece that needs another keeps its own price; econSort lists it after what it needs */
    });
  econSort()}
/* each list in price order, cheapest first (stable), a piece right after what it needs if that costs more, the retired ones last.
   Runs again on the first simulate, after every file has set its prices (29i_garden.js sets the Sprinklers') */
function econSort(){Object.keys(ADDONS).forEach(function(k){var A=ADDONS[k]||[],by={},pos={},key={};A.forEach(function(a,i){by[a[0]]=a;pos[a[0]]=i});
  var kf=function(a,d){if(key[a[0]]!=null)return key[a[0]];var e=a[3]||{},q=by[ADDREQ[a[0]]]||by[e.also],v=+a[2]||0;if(q&&d<5&&!(q[3]&&q[3].retired))v=Math.max(v,kf(q,d+1)+.5);return key[a[0]]=v};
  A.forEach(function(a){kf(a,0)});
  A.sort(function(x,y){var rx=x[3]&&x[3].retired?1:0,ry=y[3]&&y[3].retired?1:0;return rx-ry||key[x[0]]-key[y[0]]||pos[x[0]]-pos[y[0]]})})}
/* Shop prices (SHOP and GITEMS in 10_app_a.js, EXTRA_ITEMS in 15_shop.js), each item once even if it sits in two lists:
   graded clothes by their quality tier (ECON.cloth), the rest x shopK between clothesMin and clothesMax (the free-to-cheap basics
   just x shopK), permanent upgrades from ECON.buff, and interface items (themes, frames, backdrops, companions, titles, tap
   effects, HUD, sounds, scenes) by the level they open */
/* w-econ3 (Cal, 2026-11-10: "These upgrades should be much more expensive because they are permanent. Merchant seal is 10% extra coins
   forever and it only costs 1500? ... Make sure these are scaled and balanced properly"): a regular player's daily income at a level
   (ECON.dayInc) and its quest coins (ECON.questInc), from econsim, read between the measured levels */
function econCurve(T,L){for(var i=1;i<T.length;i++)if(L<=T[i][0]){var a=T[i-1],b=T[i];return a[1]+(b[1]-a[1])*(L-a[0])/(b[0]-a[0])}return T[T.length-1][1]}
function econDayInc(L){return econCurve(ECON.dayInc,L)}
/* a permanent upgrade pays itself back in ECON.payDays at the level it opens: +X% coins against that day's quest coins, +X% XP
   against the day's income (XP has no coin price, so a point of XP counts like a point of coins), and the other three (a freeze, the
   streak, the time away) at ECON.utilDay of a day's income */
function econBuffPrice(it){var e=it[6]||{},L=+it[4]||1,p;
  if(e.k==="coin")p=ECON.payDays*e.v/100*econCurve(ECON.questInc,L);
  else if(e.k==="xp")p=ECON.payDays*e.v/100*econDayInc(L);
  else p=(ECON.utilDay[e.k]||.5)*econDayInc(L);
  return Math.max(500,Math.round(p/50)*50)}
/* a brand's Shop floor (W42): fl in BRANDS, else the Street (the Basics and the creator's pieces too) */
function brandFloor(id){var b=(typeof BRANDS!=="undefined"?BRANDS:[]).filter(function(x){return x.id===id})[0];return (b&&b.fl)||"street"}
(function(){var seen=typeof WeakSet==="function"?new WeakSet():null,graded=[];
  [typeof SHOP!=="undefined"?SHOP:[],typeof GITEMS!=="undefined"?GITEMS:[],typeof EXTRA_ITEMS!=="undefined"?EXTRA_ITEMS:[]].forEach(function(l){
    (l||[]).forEach(function(it){if(!Array.isArray(it)||!(+it[3]>0)||(seen&&seen.has(it)))return;if(seen)seen.add(it);var e=it[6]||{},s=it[1];
      if(s==="buff"){it[3]=econBuffPrice(it);return}
      var tr=/^a_/.test(s)&&ECON.clothSlot[s]!=null&&clothTier(it[0]);if(tr&&ECON.cloth[tr]){graded.push([it,tr]);return}
      if(/^a_/.test(s)){var v=Math.max(10,Math.round(it[3]*ECON.shopK/10)*10);it[3]=e.basic?v:Math.min(ECON.clothesMax,Math.max(ECON.clothesMin,v));return}
      it[3]=Math.round(ECON.uiDay*econDayInc(+it[4]||1)/50)*50})});
  /* each brand's average old price, so a piece its brand priced above the rest sits higher in its band */
  var avg={};graded.forEach(function(g){var b=(g[0][6]&&g[0][6].b)||"",a=avg[b]=avg[b]||[0,0];a[0]+=+g[0][3];a[1]++});
  graded.forEach(function(g){var it=g[0],b=(it[6]&&it[6].b)||"",fb=ECON.clothFloor[brandFloor(b)],B=(fb&&fb[g[1]])||ECON.cloth[g[1]],a=avg[b],rel=a[0]/a[1]>0?it[3]/(a[0]/a[1])-1:0,
      p=ECON.clothSlot[it[1]]+(ECON.clothBrand[b]||0)+Math.max(-.2,Math.min(.2,ECON.clothNudge*rel));
    it[3]=Math.round((B[0]+(B[1]-B[0])*Math.max(0,Math.min(1,p)))/10)*10})})();
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
   definitely start generating more income"): in a room that earns, each earning upgrade's share of the room's income follows its
   price (QA, v0.90: a pricier piece never earns less than a cheaper one; late prices scale a whole room alike, so this is the price
   before them too), and the room's total stays what it was. In a room that does not earn coins (the Pond) the shares keep their
   sizes but go in price order. econEarn(t) does one room; a file that sets a price later runs it again (29i_garden.js, the
   Sprinklers). The card's "Earns +N% here." follows the share (QA, v0.90: it used to be added a second time). ---- */
function econEarn(t){Object.keys(ADDONS).forEach(function(k){if(t&&k!==t)return;var T=ROOMT[k]||{},earns=!!(T.coin||T.food);if(ECON.bizDay&&ECON.bizDay[k])bizInit(k);
  var L=(ADDONS[k]||[]).filter(function(a){var e=a[3]||{};return e.p>0&&!e.retired&&!e.opens&&+a[2]>0});if(L.length<2)return;
  var tot=0,wt=L.map(function(a){tot+=a[3].p;return earns?+a[2]:a[3].p});
  if(!earns){var mx=0;L.map(function(a,i){return i}).sort(function(x,y){return L[x][2]-L[y][2]||x-y}).forEach(function(i){if(wt[i]<mx)wt[i]=mx;mx=wt[i]})}
  var ws=wt.reduce(function(s,w){return s+w},0);if(!(ws>0))return;
  L.forEach(function(a,i){var e=a[3],np=Math.round(tot*wt[i]/ws*1000)/1000,s=String(a[4]||""),had=/Earns \+\d+% here\./.test(s);e.p=np;
    /* w-econ3: a business's card also says about what it adds a day, fully at full speed */
    var day=ECON.bizDay&&ECON.bizDay[k]&&T.coin?Math.round(T.coin*np*(T.store||8)/10)*10:0;
    a[4]=s.replace(/\s*Earns \+\d+% here[^.]*\./g,"")+(earns||had?" Earns +"+Math.round(np*100)+"% here"+(day>0?", about +"+day.toLocaleString()+" coins a day":"")+".":"")})})}
econEarn();
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
    return ECON.roomBonusRooms[r.t]+" +"+rbPct(r)+"% XP on every quest ("+n+" bought, up to +"+ECON.roomBonus+"%)"+(roomCrew(i).length?", crew +"+roomCrew(i).length+"%":"")}
  /* w-econ3: a business says what it earns a day and what its upgrades add (Cal: "+22% produce" has to show in coins) */
  if(T.coin&&ECON.bizDay[r.t]){var bd=bizDayOf(i),up=bizUpPct(r);
    return "Earns about "+(Math.round(bd/10)*10).toLocaleString()+" coins a day"+(up>0?" (+"+up+"% from upgrades)":"")+". Town at "+Math.round(dqEff()*100)+"% today, "+own+" upgrades bought"}
  if(T.coin||T.food)return base+". Town at "+Math.round(dqEff()*100)+"% today, "+own+" upgrades bought";
  return base}
/* Cal (2026-11-10): upgrades have no level locks, so the Restaurant's and the Garden's "Next big step: X at level N" lose the level */
var econRsNoteBase=rsNote;rsNote=function(){return econRsNoteBase.apply(this,arguments).replace(/ at level \d+\./g,".")};
var econGdNoteBase=gdNote;gdNote=function(){return econGdNoteBase.apply(this,arguments).replace(/ at level \d+\./g,".")};
/* ---- the Wheel every 4 hours (w-econ3; Cal, 2026-11-10: "i want the wheel to be able to be spun once every 4 hours") ----
   One spin, then the next opens ECON.wheelEvery hours after it; nothing banks up while away (at most one waiting). A 4-spin day pays
   about 1.5x the old daily wheel (~310 a spin against ~835 a day), so every prize is x wheelK, and the streak freeze and the gold
   slivers are x wheelOdds as likely, so freezes and free clothes stay about where they were a day (a sliver about every 12 days).
   S.wheelAt is when the last spin was; S.wheel (the day of the last spin) stays as it was. */
ECON.wheelEvery=4;ECON.wheelK=.33;ECON.wheelOdds=.25;
WHEEL.forEach(function(w,i){if(w[1]>0)w[1]=Math.round(w[1]*ECON.wheelK/50)*50;if(w[2]||w[3])WHEEL_W[i]*=ECON.wheelOdds});
WHEELALL=Math.round(WHEELALL*ECON.wheelK/50)*50;
function wheelLeft(){var t=+S.wheelAt||0;return t?Math.max(0,t+ECON.wheelEvery*36e5-Date.now()):0}
function wheelCd(ms){var m=Math.ceil(ms/60000),h=Math.floor(m/60);return (h?h+"h ":"")+(m%60)+"m"}
var wheelSpinBase=spin;spin=function(){if(spinning||wheelLeft()>0)return;var w0=S.wheel;S.wheel="";wheelSpinBase.apply(this,arguments);
  if(S.wheel===today()){S.wheelAt=Date.now();persist()}else S.wheel=w0};
var wheelHtmlBase=wheelHtml;wheelHtml=function(){var w0=S.wheel,left=wheelLeft();S.wheel=left>0?today():"";var h;try{h=wheelHtmlBase.apply(this,arguments)}finally{S.wheel=w0}
  return h.replace("One free spin every day.","One free spin every "+ECON.wheelEvery+" hours.").replace(">Come back tomorrow<",'><span class="wheelcd">Next spin in '+wheelCd(left)+'</span><')};
setInterval(function(){var b=document.querySelector(".wheelcd");if(!b)return;var l=wheelLeft();if(l>0)b.textContent="Next spin in "+wheelCd(l);else try{render()}catch(e){}},30000);
