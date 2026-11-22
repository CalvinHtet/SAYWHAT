/* ---------- one price dial for everything (Cal, 2026-11-22) ----------
   Cal: "the money scaling is too fast ... I am basically able to buy the entire shop right now. Can you make things a tiny
   more expensive? Maybe 10-15%." Every coin price in the game goes up by PRICEK, applied once, after every other price rule
   (29_prices.js, 29e_economy.js, 29i_garden.js), so the tiers keep their shape: small things stay the same as each other,
   rooms later in the story still cost more. Covers the Shop (clothes, interface, buffs), new rooms, room upgrades, decor
   sets and crew hires. The file sorts after 29p and before 30_app_b.js, which reads these tables when it draws and charges.
   Rounding: under 1,000 to the nearest 10, from 1,000 to the nearest 50. Set PRICEK to 1 to undo it. */
var PRICEK=1.15;
function priceK(c){if(!c||c<0||PRICEK===1)return c;var n=c*PRICEK;return n<1000?Math.round(n/10)*10:Math.round(n/50)*50}
(function(){if(window.__qbPriceK)return;window.__qbPriceK=PRICEK;
  SHOP.forEach(function(it){if(it[3])it[3]=priceK(it[3])});
  Object.keys(ROOMT).forEach(function(k){var T=ROOMT[k];if(T&&T.cost)T.cost=priceK(T.cost)});
  Object.keys(ADDONS).forEach(function(k){(ADDONS[k]||[]).forEach(function(a){if(a&&a[2])a[2]=priceK(a[2])})});
  Object.keys(LFDS).forEach(function(k){(LFDS[k]||[]).forEach(function(q){if(q&&q.cost)q.cost=priceK(q.cost)})});
  Object.keys(CREWHIRE).forEach(function(k){CREWHIRE[k]=priceK(CREWHIRE[k])});
})();
/* rooms with no LFDS entry get their decor sets (Industrial, Modern) made fresh on every call in 20_loft.js */
var pkDecBase=lfDecSets;lfDecSets=function(t){if(LFDS[t])return LFDS[t];return pkDecBase(t).map(function(q){if(q.cost)q.cost=priceK(q.cost);return q})};
