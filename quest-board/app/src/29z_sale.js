/* ---------- the daily sale (Cal, 2026-11-10: "there should be 2 things on sale in the shop each day but for only 1 brand each day. The
   next day, even if they are all the same brands, I only want 2 things on sale from a different brand in rotation. The sale could be
   25% or 50% off") ----------
   Each drop day (8 am Pacific, like the drops) one brand has 2 pieces on sale. The brand rotates through the brands in this player's
   Shop that day (the open floors' live brands, oldest first, and the Wednesday one), by the date, so everyone with the same floors
   sees the same brand, and never the same brand two days running. The 2 pieces are the brand's that fit this body, the ones not owned   first, in an order seeded by the date; each is 25% or 50% off. The day's pick is kept in S.sale so a reload or a purchase does not
   change it. The sale price is written on the item itself (it[3], the full price kept in it._p0), so the cards, the try-on total,
   "need N more" and the checkout all charge it; tomorrow the old price comes back. */
function saleRand(seed){var r=dropRand("sale|"+seed);return r}
/* the brands in this player's Shop on drop day ymd: each open floor's live ones, oldest first, then the Wednesday one */
function saleBrands(ymd){var n=dropStart(ymd)+36e5,L=[];try{shopFloors().forEach(function(F){dropFloor(n,F).live.forEach(function(b){if(L.indexOf(b.id)<0)L.push(b.id)})});
  var bk=dropBack(n);if(bk&&L.indexOf(bk.id)<0)L.push(bk.id)}catch(e){}return L}
function salePlace(ymd){var L=saleBrands(ymd),k=ymdN(ymd);return L.length?L[((k%L.length)+L.length)%L.length]:null}
/* the brand on sale on drop day ymd: the date picks a place in that day's list, moved one on if it lands on the day before's brand;
   worked forward from a week back, so the day before is its real sale brand and every phone agrees */
function saleBrandOn(ymd){var k=ymdN(ymd),prev=null;for(var j=k-7;j<=k;j++){var d=ymdOfN(j),L=saleBrands(d),p=salePlace(d);
  if(p&&p===prev&&L.length>1)p=L[(L.indexOf(p)+1)%L.length];prev=p}return prev}
function salePick(ymd){var b=saleBrandOn(ymd);if(!b)return {d:ymd,b:null,ids:[]};var r=saleRand(ymd+"|"+b);
  var L=SHOP.filter(function(it){return it[6]&&it[6].b===b&&/^a_/.test(it[1])&&+it[3]>0&&itemFits(it)}).map(function(it){return [it,r()]});
  L.sort(function(x,y){var ox=S.owned[x[0][0]]?1:0,oy=S.owned[y[0][0]]?1:0;return ox-oy||x[1]-y[1]});
  return {d:ymd,b:b,ids:L.slice(0,2).map(function(p){return [p[0][0],dropHash("salepct|"+ymd+"|"+p[0][0])%2?25:50]})}}
/* today's sale on the items: put back yesterday's prices, then mark today's */
function saleApply(){if(!loaded||!S||!S.created)return null;var day=dropYmd(dropNow());
  if(!S.sale||typeof S.sale!=="object"||S.sale.d!==day){S.sale=salePick(day);persist()}
  var on={};(S.sale.ids||[]).forEach(function(p){on[p[0]]=p[1]});
  SHOP.forEach(function(it){if(it._p0!=null&&!on[it[0]]){it[3]=it._p0;delete it._p0;delete it._pc}
    if(on[it[0]]&&it._p0==null){it._p0=it[3];it._pc=on[it[0]];it[3]=Math.max(10,Math.round(it._p0*(1-it._pc/100)/10)*10)}});
  return S.sale}
/* the strip at the top of the Shop: the brand, its 2 pieces (the old price struck through) and when the next sale starts */
function saleHtml(){var s=saleApply();if(!s||!s.b||!(s.ids||[]).length)return "";var br=BRANDS.filter(function(x){return x.id===s.b})[0]||{name:s.b};
  var n=dropNow(),next=dropStart(ymdOfN(ymdN(s.d)+1))-n;
  return '<section class="qs-sale" aria-label="On sale today"><div class="qs-sale-h"><b>On sale today</b><small>'+esc(br.name)+' &middot; next sale in '+cdTxt(next)+'</small></div><div class="qs-sale-row">'
    +s.ids.map(function(p){var it=shopItem(p[0]);if(!it)return "";var own=!!S.owned[it[0]];
      return '<button class="qs-sale-it" data-qssale="'+esc(it[0])+'"><img src="'+itemArt(it)+'" alt=""><span><b>'+esc(it[2])+'</b><small>'+(own?'Owned':'<s>'+(it._p0||it[3]).toLocaleString()+'</s> <i class="coin"></i>'+it[3].toLocaleString())+'</small></span><em>-'+p[1]+'%</em></button>'}).join("")+'</div></section>'}
/* tapping a piece opens its brand's tab, on its floor */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-qssale]");if(!b)return;var it=shopItem(b.dataset.qssale);if(!it)return;
  var bid=it[6]&&it[6].b;if(typeof brandFloor==="function"&&typeof QSFLOOR!=="undefined")QSFLOOR=brandFloor(bid);shopTab=bid;window._qsSeen=1;render();
  setTimeout(function(){var c=document.querySelector('[data-card="'+it[0]+'"]');if(c)c.scrollIntoView({block:"center",behavior:"smooth"})},60)});
var saleShopBase=shopHtml;shopHtml=function(){saleApply();var h=saleShopBase.apply(this,arguments),s=saleHtml(),i=h.indexOf('<nav class="qs-tabs');return s&&i>0?h.slice(0,i)+s+h.slice(i):h};
/* a card on sale: its badge and the full price struck through */
var saleCardBase=qsCard;qsCard=function(it){var h=saleCardBase(it);if(it._p0==null)return h;
  return h.replace('<article class="qs-card','<article class="qs-card qs-onsale').replace('<h4>','<span class="qs-salebadge">-'+it._pc+'%</span><h4>').replace(/<i class="coin"><\/i>(\d+)/,'<s>'+it._p0+'</s> <i class="coin"></i>$1')};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbSale={apply:saleApply,pick:salePick,brandOn:saleBrandOn,brands:saleBrands};
