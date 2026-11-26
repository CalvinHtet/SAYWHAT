/* ---------- Cal 2026-11-25: premium brands look premium; leaving the Shop takes off what was only tried on ----------
   Cal: "The top tabs of the shop when it's a special and more expensive shop, highlight the tab in gold so we know that it is special. And
   the splash screen should say that a premium brand has entered the shop", and "I still have the clothes on if I don't unequip it from the
   shop tab. If I leave the shop, unequip all unpurchased items".
   - A Boutique or Atelier brand's tab (v67p, 29zz_v167.js) is gold: gold edge and lettering, a dark gold fill, and solid gold when open.
   - Its drop window says "A premium brand has entered the Shop." in gold, under a gold "Premium" burst.
   - Leaving the Shop for any other screen clears every try-on (clothes, Stylist, banner preview, companion clothes). Bought pieces stay
     on as they were. */
function v78Prem(b){try{return !!b&&!b.back&&brandFloor(b.id)!=="street"}catch(e){return false}}
var v78Splash=brandSplash;brandSplash=function(b){var m=v78Splash.apply(this,arguments);
  try{if(m&&v78Prem(b)){var c=m.querySelector(".bsplash")||m,bu=c.querySelector(".bs-burst");if(bu)bu.textContent="PREMIUM";c.classList.add("v78prem");
      var logo=c.querySelector(".blg")||bu;if(logo)logo.insertAdjacentHTML("afterend",'<p class="v78line">A premium brand has entered the Shop.</p>')}}catch(e){}return m};
var V78VIEW="";
var v78Render=render;render=function(){try{if(V78VIEW==="shop"&&view!=="shop"){QS_TRY={};PCTRY="";if(typeof P2TRY==="object"&&P2TRY)Object.keys(P2TRY).forEach(function(k){delete P2TRY[k]})}V78VIEW=view}catch(e){}return v78Render.apply(this,arguments)};
htabCss("qb-v178-css",".qs-tab.v67p{border-color:#d9a94a!important;color:#ffe3a1!important;background:linear-gradient(180deg,#3a2c12,#1f1709)!important;box-shadow:0 0 0 1px rgba(255,214,120,.25),0 0 14px rgba(230,170,60,.28)}"
  +".qs-tab.v67p.on{background:linear-gradient(180deg,#ffe7a3,#d8a440)!important;color:#2a1d05!important;border-color:#ffe7a3!important}.qs-tab.v67p.on .v67dia{background:#2a1d05;box-shadow:none}"
  +".bsplash.v78prem{box-shadow:0 0 0 2px #e2b552,0 0 40px rgba(230,170,60,.45)}.bsplash.v78prem .bs-burst{background:linear-gradient(90deg,#ffe7a3,#d8a440);color:#2a1d05}"
  +".v78line{margin:8px 0 0;color:#ffe3a1;font-weight:700;letter-spacing:.04em;text-align:center;position:relative;z-index:1;text-shadow:0 1px 6px rgba(0,0,0,.7)}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV178={prem:v78Prem,splash:function(id){var b=null;BRANDS.forEach(function(x){if(x.id===id)b=Object.assign({},x,{start:today()})});return b?brandSplash(b):null},tries:function(){return Object.keys(QS_TRY).length}};
