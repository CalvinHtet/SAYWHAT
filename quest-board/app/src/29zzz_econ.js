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
   - The level curve (curve 6): level 1 to 2 is 60 XP, ramping to 500 by level 10, then 500 + 0.8 x (L - 10)^2, plus 0.3 x (L - 40)^2
     above 40: a heavy player levels at most about 3 times a day, a regular one about once (sims: rigtest/qa/sim.js). */
var EARNK=.77;
(function(){var E=ECON;E.coinXp=Math.round(6*EARNK*100)/100;E.vegCoin=Math.max(1,Math.round(E.vegCoin*EARNK));/* whole coins: a fraction left coin balances like 299.76 (sims) */E.trainCoins=Math.round(E.trainCoins*EARNK);
  E.lvPay=[Math.round(E.lvPay[0]*EARNK),Math.max(1,Math.round(E.lvPay[1]*EARNK))];E.wqCoins=3000;
  E.goal={half:[100,150],full:[300,400],story:[75,100]};
  E.lvFirst=60;E.lvRamp=10;E.lvFlat=500;E.lvK=.8;E.lvP=2;E.lvTop=.3;E.lvTopFrom=40;
  SHOP.forEach(function(it){if(it&&it[3]&&typeof clothTier==="function"&&clothTier(it[0])==="luxury"){var n=it[3]*1.1;it[3]=n<1000?Math.round(n/10)*10:Math.round(n/50)*50}})})();
var ekScaled=econScaled;econScaled=function(c,step){return ekScaled(c*EARNK,step)};
/* the Loft's Goals pay their coins as they are (glCoins x the room's phase), so the phase no longer multiplies them up */
glCoins=function(k,t){return Math.round(ECON.goal[k][0]/50)*50};
