/* ---------- Cal's 2026-11-24, late: nothing in the Shop is bought by one tap ----------
   Cal: "Refund all the shop items I bought for my character. Everything in The shop, including stylist and pets and banners, can be
   viewed first on the character and then confirm to buy it when checking out. Should not automatically buy it and spend my money."
   - Clothes already worked that way (15_shop.js: "Try on", then the basket's checkout). The Stylist's pieces (a cut, a dye, highlights,
     eye colour, and tattoos and scars when they come) were bought on the first tap: they are tried on the mirror like clothes now.
   - Pet clothes, Care, the form switch (29zz_v150.js) and card backdrops (29zz_v152.js) preview where there is something to show, and
     all end in a checkout with the price and "Confirm purchase".
   - Anything else still sold with a plain price button (permanent upgrades and interface pieces on the Upgrades tab) asks first too.
   - The refund: Cal's own save (QB_WEB.owners), once (S.ref53). Every Shop piece for the character that has a price and is not the
     look the character was made with may go back for its price: clothes and Stylist pieces. Bought only (Cal), and the save does not
     record which were won, so he ticks them himself (below). What was worn falls back to the creator's look. Other players' saves are not touched. */
(function(){["a_hair","a_hairc","a_hairhi","a_eyes","a_tattoo","a_scar"].forEach(function(sl){if(QS_TRYSL.indexOf(sl)<0)QS_TRYSL.push(sl)})})();
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="buy"]');if(!b||b.disabled)return;var it=shopItem(b.dataset.id);if(!it)return;
  e.preventDefault();e.stopPropagation();
  if(S.coins<it[3]){pop("Need "+(it[3]-S.coins)+" more coins");return}
  modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+esc(it[2])+'</h3>'+(it[5]?'<p class="note">'+esc(it[5])+'</p>':'')
    +'<p class="note">Price <b><i class="coin"></i>'+it[3].toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="v53buy" data-id="'+esc(it[0])+'">Confirm purchase</button><button class="btn ghost" data-act="mclose">Not now</button></div></div>')},true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="v53buy"]');if(!b)return;e.preventDefault();e.stopPropagation();var id=b.dataset.id;closeModals();try{buy(id,null)}catch(x){}},true);
/* Cal 11-24, asked whether won pieces are refunded too: "Bought only". The save never recorded which pieces were bought and which
   were prizes (loot, scratch card, crates, chests), so the refund cannot know: Cal is shown the list once, everything ticked, and
   unticks what he won. Only the ticked pieces go back for their price; the rest stay owned and worn. "Later" asks again next launch. */
var V53ASKED=0;
function v53Owner(){var W=window.QB_WEB||{};return !!MYUID&&(W.owners||[]).indexOf(MYUID)>=0}
function v53List(){return SHOP.filter(function(it){if(!isRigItem(it)||!S.owned[it[0]]||!(it[3]>0))return false;try{if(qsOriginal(it))return false}catch(e){}return true}).sort(function(a,b){return b[3]-a[3]})}
function v53Refund(force){if(!S||!S.created||typeof loaded==="undefined"||!loaded)return 0;if(!force&&(S.ref53||V53ASKED||!v53Owner()))return 0;
  var L=v53List();if(!L.length){S.ref53={at:Date.now(),c:0,n:0};persist();return 0}
  if(document.querySelector("#layer .modal,.dropsplash"))return 0;V53ASKED=1;
  var m=modal('<div class="card box2 v53ref"><span class="label">One-time refund</span><h3>Shop pieces for your character</h3><p class="note">Ticked pieces go back to the Shop for their price. The save does not record which pieces were prizes, so untick anything you won: it stays yours and pays nothing.</p>'
    +'<div class="v53list">'+L.map(function(it){return '<label class="v53row"><input type="checkbox" checked data-id="'+esc(it[0])+'" data-c="'+it[3]+'"><span>'+esc(it[2])+'</span><b><i class="coin"></i>'+it[3].toLocaleString()+'</b></label>'}).join("")+'</div>'
    +'<p class="note v53tot"></p><div class="row"><button class="btn" id="v53go">Refund the ticked pieces</button><button class="btn ghost" data-act="mclose">Later</button></div></div>');
  if(!m)return 0;var tot=function(){var c=0,n=0;m.querySelectorAll(".v53row input").forEach(function(q){if(q.checked){c+=+q.dataset.c;n++}});m.querySelector(".v53tot").innerHTML=n+" piece"+(n===1?"":"s")+': <b><i class="coin"></i>'+c.toLocaleString()+'</b> back';return n};
  tot();m.addEventListener("change",tot);
  m.querySelector("#v53go").onclick=function(){var ids={};m.querySelectorAll(".v53row input").forEach(function(q){if(q.checked)ids[q.dataset.id]=1});m.remove();v53RefundNow(ids)};return 0}
function v53RefundNow(ids){var c=0,n=0;
  v53List().forEach(function(it){if(ids&&!ids[it[0]])return;
    c+=it[3];n++;delete S.owned[it[0]];Object.keys(S.eq||{}).forEach(function(k){if(S.eq[k]===it[0])delete S.eq[k]})});
  S.ref53={at:Date.now(),c:c,n:n};if(c){S.coins=(S.coins||0)+c;S.spent=Math.max(0,(S.spent||0)-c)}try{QS_TRY={}}catch(e){}persist();
  try{render()}catch(e){}if(n)setTimeout(function(){pop("Refunded "+n+" Shop piece"+(n>1?"s":"")+": +"+c.toLocaleString()+" coins")},1200);return c}
htabCss("qb-v53-css",".v53ref .v53list{max-height:46vh;overflow:auto;margin:8px 0;border:1px solid var(--line);border-radius:10px}.v53ref .v53row{display:flex;align-items:center;gap:10px;padding:9px 10px;border-bottom:1px solid var(--line);cursor:pointer;text-align:left}.v53ref .v53row:last-child{border-bottom:0}.v53ref .v53row span{flex:1;min-width:0;overflow-wrap:anywhere}.v53ref .v53row input{width:20px;height:20px;flex:none}.v53ref .v53row b{white-space:nowrap}");
var v53Render=render;render=function(){try{v53Refund()}catch(e){}return v53Render.apply(this,arguments)};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV153={refund:function(ids){delete S.ref53;return v53RefundNow(ids)},ask:function(){delete S.ref53;return v53Refund(1)},list:function(){return v53List().map(function(it){return it[0]})},tryslots:function(){return QS_TRYSL.slice()}};
