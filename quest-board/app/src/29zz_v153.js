/* ---------- Cal's 2026-11-24, late: nothing in the Shop is bought by one tap ----------
   Cal: "Refund all the shop items I bought for my character. Everything in The shop, including stylist and pets and banners, can be
   viewed first on the character and then confirm to buy it when checking out. Should not automatically buy it and spend my money."
   - Clothes already worked that way (15_shop.js: "Try on", then the basket's checkout). The Stylist's pieces (a cut, a dye, highlights,
     eye colour, and tattoos and scars when they come) were bought on the first tap: they are tried on the mirror like clothes now.
   - Pet clothes, Care, the form switch (29zz_v150.js) and card backdrops (29zz_v152.js) preview where there is something to show, and
     all end in a checkout with the price and "Confirm purchase".
   - Anything else still sold with a plain price button (permanent upgrades and interface pieces on the Upgrades tab) asks first too.
   - The refund: Cal's own save (QB_WEB.owners), once (S.ref53). Every Shop piece for the character that has a price and is not the
     look the character was made with goes back for its price: clothes and Stylist pieces, whether bought or won (the save does not
     record which). What was worn falls back to the creator's look. Other players' saves are not touched. */
(function(){["a_hair","a_hairc","a_hairhi","a_eyes","a_tattoo","a_scar"].forEach(function(sl){if(QS_TRYSL.indexOf(sl)<0)QS_TRYSL.push(sl)})})();
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="buy"]');if(!b||b.disabled)return;var it=shopItem(b.dataset.id);if(!it)return;
  e.preventDefault();e.stopPropagation();
  if(S.coins<it[3]){pop("Need "+(it[3]-S.coins)+" more coins");return}
  modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+esc(it[2])+'</h3>'+(it[5]?'<p class="note">'+esc(it[5])+'</p>':'')
    +'<p class="note">Price <b><i class="coin"></i>'+it[3].toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="v53buy" data-id="'+esc(it[0])+'">Confirm purchase</button><button class="btn ghost" data-act="mclose">Not now</button></div></div>')},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="v53buy"]');if(!b)return;e.preventDefault();e.stopPropagation();var id=b.dataset.id;closeModals();try{buy(id,null)}catch(x){}},true);
function v53Refund(){if(!S||!S.created||typeof loaded==="undefined"||!loaded||S.ref53)return 0;var W=window.QB_WEB||{};if(!MYUID||(W.owners||[]).indexOf(MYUID)<0)return 0;return v53RefundNow()}
function v53RefundNow(){var c=0,n=0;
  SHOP.forEach(function(it){if(!isRigItem(it)||!S.owned[it[0]]||!(it[3]>0))return;try{if(qsOriginal(it))return}catch(e){}
    c+=it[3];n++;delete S.owned[it[0]];Object.keys(S.eq||{}).forEach(function(k){if(S.eq[k]===it[0])delete S.eq[k]})});
  S.ref53={at:Date.now(),c:c,n:n};if(c){S.coins=(S.coins||0)+c;S.spent=Math.max(0,(S.spent||0)-c)}try{QS_TRY={}}catch(e){}persist();
  if(n){try{render()}catch(e){}setTimeout(function(){pop("Refunded "+n+" Shop piece"+(n>1?"s":"")+": +"+c.toLocaleString()+" coins")},1200)}return c}
var v53Render=render;render=function(){try{v53Refund()}catch(e){}return v53Render.apply(this,arguments)};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV153={refund:function(){delete S.ref53;return v53RefundNow()},tryslots:function(){return QS_TRYSL.slice()}};
