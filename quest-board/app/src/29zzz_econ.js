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
var PRICEK=1.15,MOMENTUM_MAX=.5,PROOFX=1.5,COINLV=0;
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
coinsFor=function(xp){return Math.max(10,Math.round(xp*((typeof ECON!=="undefined"&&ECON.coinXp)||6)*(1+COINLV*(effLvl()-1))*coinMomentum()))};
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
(function(){var E=ECON;E.coinXp=Math.round(6*EARNK*100)/100;E.vegCoin=Math.max(1,Math.round(E.vegCoin*EARNK));/* whole coins: a fraction left coin balances like 299.76 (sims) */E.trainCoins=Math.round(E.trainCoins*EARNK);
  E.lvPay=[Math.round(E.lvPay[0]*EARNK),Math.max(1,Math.round(E.lvPay[1]*EARNK))];E.wqCoins=3000;
  E.goal={half:[100,150],full:[300,400],story:[75,100]};
  /* curve 6, take three (Cal 11-23: "use the new slower level curve. But make it a bit faster. meet in the middle. Later levels should be
     harder to level, but still obtainable. The first few days can ramp up faster, but late game would take a heavy day for 1 level"):
     levels 1-6 as fast as curve 5 (20 to 170), then 170 + .65 x (L - 6)^2, plus .35 x (L - 40)^2 above 40. Level 30 needs 544 (curve 5
     316, the pulled curve 820), 80 needs 4,289 and 100 needs 7,173: a heavy player (about 1,940 XP a day) takes about 1 day for level 60,
     2 for 80, 3.6 for 99 (QA f83ec7bf; Cal: "This is fine. Keep it for now"). At the sims' average XP a day, a daily player
     is level 7 on day 1, 14 on day 3, 44 on day 30 (curve 5: 55, the pulled curve: 35); a heavy one 66 on day 30. Saves move over at the
     same level (xpc6 below). */
  E.lvFirst=20;E.lvRamp=6;E.lvFlat=170;E.lvK=.65;E.lvP=2;E.lvTop=.35;E.lvTopFrom=40;
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
