/* ---------- the economy dials (Cal, 2026-11-22 and 11-23; docs/HANDOFF_ECONOMY_2026-11-23.md) ----------
   Cal: "the money scaling is too fast ... I am basically able to buy the entire shop right now. Can you make things a tiny more expensive?
   Maybe 10-15%", then "cap momentum to 1.5x and 15% increase. I don't want them to be able to have nothing to purchase by day 25. I want
   each upgrade to feel earned", and "Photo proof 2x to 1.5x, and 1% bonus per level". Part 1 of the handoff (a cloud chat's branch
   claude/wizardly-hopper-sp10lg, built on the old main), ported here. This file sorts after every other app/src file but 30_app_b.js and
   31_release.js, so the price tiers keep their shape and every price set before it, the Pet Shop's included, rises once.
   - PRICEK: every coin price x1.15 (the Shop, the Pet Shop, new rooms, room upgrades, decor sets, crew hires). Rounding: under 1,000 to
     the nearest 10, from 1,000 to the nearest 50; free stays free. PRICEK=1 undoes it.
   - MOMENTUM_MAX: a day's quest coins grow to 1.5x (was 2x), reached on the 7th task.
   - PROOFX: a verified photo pays 1.5x (was 2x), read in mults (30_app_b.js); the verify perk still adds 0.1.
   - COINLV: task coins no longer grow 1% a level (missions, the wheel and chests still do, econScaled). */
var PRICEK=1.15,MOMENTUM_MAX=.5,PROOFX=1.5,COINLV=.01,COINLVMAX=.5;/* Cal 11-25 (later): "I still want it a bit faster in terms of upgrades ... casual players will play once and step away": task coins grow 1% a level again, up to +50% (level 51), so income keeps up with the dearer rooms */
function priceK(c){if(!c||c<0||PRICEK===1)return c;var n=c*PRICEK;return n<1000?Math.round(n/10)*10:Math.round(n/50)*50}
(function(){
  SHOP.forEach(function(it){if(it&&it[3])it[3]=priceK(it[3])});
  Object.keys(ROOMT).forEach(function(k){var T=ROOMT[k];if(T&&T.cost)T.cost=priceK(T.cost)});
  Object.keys(ADDONS).forEach(function(k){(ADDONS[k]||[]).forEach(function(a){if(a&&a[2])a[2]=priceK(a[2])})});
  Object.keys(LFDS).forEach(function(k){(LFDS[k]||[]).forEach(function(q){if(q&&q.cost)q.cost=priceK(q.cost)})});
  Object.keys(CREWHIRE).forEach(function(k){CREWHIRE[k]=priceK(CREWHIRE[k])});
  if(typeof PET_PRICE!=="undefined")PET_PRICE=priceK(PET_PRICE);
  if(typeof PC_PRICE!=="undefined")Object.keys(PC_PRICE).forEach(function(k){PC_PRICE[k]=priceK(PC_PRICE[k])});
})();
/* rooms with no LFDS entry get their decor sets (Industrial, Modern) made fresh on every call in 20_loft.js */
var pkDecBase=lfDecSets;lfDecSets=function(t){if(LFDS[t])return LFDS[t];return pkDecBase(t).map(function(q){if(q.cost)q.cost=priceK(q.cost);return q})};
coinMomentum=function(){var n=Object.keys(S.cdone||{}).length;return 1+Math.min(MOMENTUM_MAX,Math.max(0,n-2)*.125)};
coinsFor=function(xp){return Math.max(10,Math.round(xp*((typeof ECON!=="undefined"&&ECON.coinXp)||6)*(1+Math.min(COINLVMAX,COINLV*(effLvl()-1)))*coinMomentum()))};
/* ---------- Part 2 (Cal, 2026-11-23, after the sims: "i definitely want better balancing so its not too easy to become super rich.
   Everything should be earned ... Luxury clothes can be a tiny bit pricier, but I think we can also make everything about 2 times slower
   instead of 5 times", "Reduce the coin rewards for completing goals in the loft ... Change this to exp gain instead of so much money",
   "reoptimize the level scaling as well so I am not leveling up 5-10 times a day") ----------
   - EARNK: every coin reward x0.77 on top of Part 1 (tasks and so room income, which is a share of them, level pay, the wheel, chests,
     relic and accessory repeats, Garden produce, training, the weekly quest), so with prices x1.15 what a day buys is about half of before.
   - The weekly quest pays a set 3,000 (scaled like the other rewards) instead of one level's XP x 6 coins.
   - Luxury clothes x1.1 on top of PRICEK.
   - The Loft's Goals: a few hundred coins at most and more XP (were up to 1,200 x the room's phase, 4,500 for the last rooms).
   - The level curve (curve 6): curve 5 with every level 25% longer (see below); the first curve 6 (60 to 500 by level 10, then 500 +
     0.8 x (L - 10)^2) was only safe with the reset of everyone, which Cal called off. */
var EARNK=.77;
/* Cal 11-25: "I've been playing for 3 days i just hit level 10, but have not upgraded much in my base ... can we increase the coin gain
   by a little bit more?", with "the main focus should still be the tasks done and not relying on passive money". Tasks pay a fifth
   more coins (TASKK); businesses, chests and the rest are unchanged. */
var TASKK=1.45;/* Cal 11-25 (later): a fifth more again for tasks (was 1.2) */
(function(){var E=ECON;E.coinXp=Math.round(6*EARNK*TASKK*100)/100;E.vegCoin=Math.max(1,Math.round(E.vegCoin*EARNK));/* whole coins: a fraction left coin balances like 299.76 (sims) */E.trainCoins=Math.round(E.trainCoins*EARNK);/* Cal 11-25: a full workout pays 500 coins flat */E.trainCoins=500;
  E.lvPay=[Math.round(E.lvPay[0]*EARNK),Math.max(1,Math.round(E.lvPay[1]*EARNK))];E.wqCoins=3000;
  E.goal={half:[100,150],full:[300,400],story:[75,100]};
  /* curve 6, take three (Cal 11-23: "use the new slower level curve. But make it a bit faster. meet in the middle. Later levels should be
     harder to level, but still obtainable. The first few days can ramp up faster, but late game would take a heavy day for 1 level"):
     levels 1-6 as fast as curve 5 (20 to 170), then 170 + .65 x (L - 6)^2, plus .35 x (L - 40)^2 above 40. Level 30 needs 544 (curve 5
     316, the pulled curve 820), 80 needs 4,289 and 100 needs 7,173: a heavy player (about 1,940 XP a day) takes about 1 day for level 60,
     2 for 80, 3.6 for 99 (QA f83ec7bf; Cal: "This is fine. Keep it for now"). At the sims' average XP a day, a daily player
     is level 7 on day 1, 14 on day 3, 44 on day 30 (curve 5: 55, the pulled curve: 35); a heavy one 66 on day 30. Saves move over at the
     same level (xpc6 below). */
  /* curve 7 (Cal 11-23: "that is way too hard of a level scale. shorten it even more. 4000 exp for lvl 99-100 sounds good to me"): the same
     shape at 0.56 of the climb above level 6, so levels 1-6 do not change and 99 to 100 needs 4,001 (was 7,010). Level 30 needs 380, 60
     1,310, 80 2,477; 129,313 XP to level 100 (was 218,055). Heavy player (about 1,940 XP a day): level 44 on day 7, 77 on day 30, 100 about
     day 62, 2 days for 99 to 100. Daily player (about 610 a day): 50 on day 30, 75 on day 90, about 6.5 days for 99 to 100. Saves keep their
     XP, so anyone past level 6 lands a little higher (the level-ups play in order, 29zz_v136.js). */
  E.lvFirst=20;E.lvRamp=6;E.lvFlat=170;E.lvK=.364;E.lvP=2;E.lvTop=.196;E.lvTopFrom=40;
  SHOP.forEach(function(it){if(it&&it[3]&&typeof clothTier==="function"&&clothTier(it[0])==="luxury"){var n=it[3]*1.1;it[3]=n<1000?Math.round(n/10)*10:Math.round(n/50)*50}})})();
var ekScaled=econScaled;econScaled=function(c,step){return ekScaled(c*EARNK,step)};
/* the Loft's Goals pay their coins as they are (glCoins x the room's phase), so the phase no longer multiplies them up */
glCoins=function(k,t){return Math.round(ECON.goal[k][0]/50)*50};
/* the Walk-in Closet stays at its flat 600 (Cal 11-23, 29zz_v133.js), after the rise above */
if(typeof v33Closet==="function")v33Closet();
/* ---- curve 6 for saves made on curve 5 (v1.30 and before): the same level and the same share of the way to the next, as curves 3 to 5
   moved over (30_app_b.js merge, xpc4/xpc5). XP is the only number moved, with the Weekly Warrior's start (wkg.x0) by the same amount;
   level pay, gates and the level a player has reached stay as they were. Saves made new from here are on curve 6 already. ---- */
var CUMT5=[0,0];(function(){for(var L=1;L<=MAXL+50;L++)CUMT5.push(CUMT5[L]+Math.round(L<6?20+115*(L-1)/5:135+.315*Math.pow(L-6,2)+(L>40?.2*Math.pow(L-40,2):0)))})();
function cum5(L){return L<=1?0:L<CUMT5.length?CUMT5[L]:CUMT5[CUMT5.length-1]+(L-CUMT5.length+1)*(CUMT5[CUMT5.length-1]-CUMT5[CUMT5.length-2])}
var c6Fresh=fresh;fresh=function(){var f=c6Fresh.apply(this,arguments);f.xpc6=1;return f};
var c6Merge=merge;merge=function(d){var move=!!(d&&d.epoch===QB_EPOCH&&!d.xpc6&&d.xpc5);/* a save from before curve 5 is put on this curve by merge itself (QA) */var r=c6Merge.apply(this,arguments);
  if(move&&S){var x=S.xp||0,L=1;while(L<MAXL+49&&x>=cum5(L+1))L++;var fr=(x-cum5(L))/Math.max(1,cum5(L+1)-cum5(L)),nx=Math.round(cum(L)+fr*(cum(L+1)-cum(L)));
    if(S.wkg&&typeof S.wkg.x0==="number")S.wkg.x0+=nx-x;S.xp=nx}
  if(S&&d&&d.epoch===QB_EPOCH)S.xpc6=1;return r};

/* ---------- curve 8 and the flat weekly XP (Cal, 2026-11-24) ----------
   Cal: "Lets do a flat weekly bonus and a slightly steeper top. Just increase by 10%. I think it is already difficult to get people to
   play consistently", and "Lets make it 4 months for a normal player to reach level 100". Sims on v1.41 (LEAD 11-24): the two weekly
   bonuses paid a level's worth each (half a level and 1.2 levels), so they grew with the curve and were about 30% of a heavy player's XP
   by month 2; a heavy day (26 tasks, 605 listed XP) reached 100 on day 61, a normal one (12 tasks, 200) 86 on day 90.
   - The Weekly Quest pays ECON.wqFlat XP and the Weekly Warrior ECON.wwFlat, the same at every level, except in a player's first weeks,
     where each is held to 2 and 2.5 levels' worth so week 1 is not ten levels at once.
   - The top: the part of a level above 40 is 1.585 times what it was, so 99 to 100 needs 4,400 (was 4,001), 80 needs 2,664 (2,477), 60
     1,356 (1,310). Levels 1 to 40 do not change, so no save moves: one day after the reboot nobody is past 40.
   - Sims on this build (rigtest/qa/sim.js, LEAD 11-24): flats of 1,400 and 1,800 put the normal player at 100 on day 135; 1,800 and 2,400
     put them there on day 122 (99 on day 118; 57 on day 30, 77 on day 60, 90 on day 90) and the heavy player on day 62 (76 on day 30).
     The same sum for everyone is worth far more to a normal player than to a heavy one: showing up 4 days a week is about 45% of a
     normal player's XP. */
(function(){var E=ECON;E.lvTop=.3107;E.wqFlat=1800;E.wwFlat=2400})();
function wkNeed(){return need(Math.min(effLvl(),MAXL-1))}
function wqXp(){return Math.min(ECON.wqFlat,Math.round(2*wkNeed()))}
function wwXp(){return Math.min(ECON.wwFlat,Math.max(250,Math.round(2.5*wkNeed())))}
/* ---- curve 8 for a save past level 40 made on curve 7 (QA 11-24: "curve 8 has no migration, so any save past level 40 drops one
   level"). Nobody should be there a day after the reboot, but the cost of being wrong is a player losing a level, so such a save moves
   over at the same level and the same share of the way to the next, as curves 3 to 6 did (xpc8; curve 7 is frozen here). At level 40
   and under the two curves are the same numbers, so nothing moves. ---- */
var CUMT7=[0,0];(function(){for(var L=1;L<=MAXL+50;L++)CUMT7.push(CUMT7[L]+Math.round(L<6?20+150*(L-1)/5:170+.364*Math.pow(L-6,2)+(L>40?.196*Math.pow(L-40,2):0)))})();
function cum7(L){return L<=1?0:L<CUMT7.length?CUMT7[L]:CUMT7[CUMT7.length-1]+(L-CUMT7.length+1)*(CUMT7[CUMT7.length-1]-CUMT7[CUMT7.length-2])}
var c8Fresh=fresh;fresh=function(){var f=c8Fresh.apply(this,arguments);f.xpc8=1;return f};
var c8Merge=merge;merge=function(d){var move=!!(d&&d.epoch===QB_EPOCH&&!d.xpc8);var r=c8Merge.apply(this,arguments);
  if(move&&S){var x=S.xp||0,L=1;while(L<MAXL+49&&x>=cum7(L+1))L++;
    if(L>40){var fr=(x-cum7(L))/Math.max(1,cum7(L+1)-cum7(L)),nx=Math.round(cum(L)+fr*(cum(L+1)-cum(L)));if(S.wkg&&typeof S.wkg.x0==="number")S.wkg.x0+=nx-x;S.xp=nx}}
  if(S&&d&&d.epoch===QB_EPOCH)S.xpc8=1;return r};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbC8={cum7:cum7};

