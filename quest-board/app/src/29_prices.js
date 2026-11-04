/* ---------- prices ----------
   A task pays about 50 coins and a good day about 1,000. So a small thing costs a few tasks
   and costs the same as every other small thing, anything normal fits inside one day, and
   only the moments that change a room cost a few days. See docs/ECONOMY.md. */
var PRICE={small:200,medium:400,large:800};
var PRICE_HUGE={r_x1:1500,r_x2:3000,r_patio:2000,r_bar:2500,r_noir:2500,r_t3:1500,
 g_x1:1200,g_x2:2500,g_green1:1500,g_green2:4000,g_fount:1500,
 t_aud:2500,t_wing:2000,t_bar:1500,au_scr2:1500,au_imax:4000,au_proj2:2000,au_recline:1500,
 bd_ward2:1000,bd_lair:2500,bd_patio:1500};
function priceFlat(a){var id=a[0],e=a[3]||{};if(e.fp)return a[2];if(PRICE_HUGE[id])return PRICE_HUGE[id];if(!a[2])return 0;
  if(e.g==="Decor"||e.g==="Menu"||e.g==="Grounds")return a[2]>6000?PRICE.medium:PRICE.small;
  return a[2]<=1200?PRICE.small:a[2]<=6000?PRICE.medium:PRICE.large}
Object.keys(ADDONS).forEach(function(k){(ADDONS[k]||[]).forEach(function(a){a[2]=priceFlat(a);if(a[3]&&a[3].p)a[3].p=Math.round(a[3].p*50)/100})});
ROOMT.restaurant.cost=1000;ROOMT.garden.cost=1500;ROOMT.theater.cost=2500;ADDONS.theater=TH_UPS;ADDONS.auditorium=AU_UPS;
/* interface items and permanent buffs: top out within a few days too */
SHOP.forEach(function(it){var e=it[6]||{};if(it[1]==="buff")it[3]=it[3]<=1500?1000:it[3]<=6000?1500:2500;
  else if(!e.gar&&!e.basic&&it[3]>800)it[3]=it[3]<=2000?1000:it[3]<=5000?1500:2500});
LFDS.restaurant.forEach(function(q){if(q.cost)q.cost=q.cost>=10000?1500:600});
