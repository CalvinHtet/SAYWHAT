/* ---------- W41 Wardrobe filters (Cal, 2026-11-10: "In the wardrobe, there should be categories for different item pieces, and also can be
   filtered by brand and the category of items") ----------
   The Shop's Wardrobe tab (15_shop.js) gets a row of category chips (only the categories you own pieces in) and, once your pieces come
   from two or more places, a row of brand chips (only brands you own pieces from, each with a dot in its colours, then Basics). The two
   combine; when nothing matches, the rack says so and offers to show everything. The choice (WDF) is not saved: it lasts while the Shop
   is open and starts at All when the Shop is opened again (wdReset, from shopHtml). The rack is grouped by the same categories, so the
   heading over a section is the chip that shows it. Face is glasses, masks and eye colour; Accessories the rest (necklaces, wristwear). */
var WDCAT=[["all","All"],["top","Tops"],["bottom","Bottoms"],["shoes","Shoes"],["hat","Hats"],["face","Face"],["acc","Accessories"],["back","Back"],["hair","Hair"]];
/* the order of pieces inside a section: by slot (hair styles before dyes, glasses and masks before eye colour), then the Shop's order */
var WDSLOT=["a_hat","a_acc","a_mask","a_xface","a_eyet","a_eyes","a_top","a_pants","a_shoes","a_back","a_hair","a_hairc","a_beard"];
var WDF={cat:"all",brand:"all"},WDSX=0;
function wdReset(){WDF={cat:"all",brand:"all"};WDSX=0}
function wdCatOf(x){var s=x[1];
  if(s==="a_tattoo"||s==="a_scar")return "face";/* QA fd5c2713: face marks belong under Face, not Accessories */
  if(s==="a_top")return "top";if(s==="a_pants")return "bottom";if(s==="a_shoes")return "shoes";if(s==="a_hat")return "hat";if(s==="a_back")return "back";
  if(s==="a_hair"||s==="a_hairc"||s==="a_beard")return "hair";if(s==="a_eyes"||s==="a_eyet"||s==="a_mask"||s==="a_xface")return "face";
  var z=typeof acc2Slot==="function"?acc2Slot(x):"";return z==="mask"||z==="glasses"?"face":z==="back"?"back":"acc"}
/* where a piece came from: a brand's id, "basics", or "found" (anything else, like a piece from a reward) */
function wdSrcOf(x){var b=(x[6]&&x[6].b)||"";if(b==="basics")return "basics";
  return (typeof BRANDS!=="undefined"?BRANDS:[]).some(function(y){return y.id===b})?b:"found"}
function wdOk(x){return (WDF.cat==="all"||wdCatOf(x)===WDF.cat)&&(WDF.brand==="all"||wdSrcOf(x)===WDF.brand)}
/* the chips for the pieces you own (mine): a choice that no longer has pieces (sold, or a body change) goes back to All */
function wdBar(mine){var cats={},srcs={},ns=0;mine.forEach(function(x){cats[wdCatOf(x)]=1;var s=wdSrcOf(x);if(!srcs[s]){srcs[s]=1;ns++}});
  if(!cats[WDF.cat])WDF.cat="all";if(!srcs[WDF.brand]||ns<2)WDF.brand="all";
  var chip=function(k,v,txt,dot){var on=WDF[k]===v;return '<button class="qs-wdc'+(on?' on':'')+'" data-wdf="'+k+'" data-v="'+esc(v)+'" aria-pressed="'+on+'">'+(dot?'<i class="qs-wddot" style="background:'+dot+'" aria-hidden="true"></i>':'')+esc(txt)+'</button>'};
  var h='<div class="qs-wdf qs-wdcat" role="group" aria-label="Filter by category">'+WDCAT.filter(function(k){return k[0]==="all"||cats[k[0]]}).map(function(k){return chip("cat",k[0],k[1])}).join("")+'</div>';
  if(ns>1)h+='<div class="qs-wdf qs-wdbr" role="group" aria-label="Filter by brand">'+chip("brand","all","All brands")
    +(typeof BRANDS!=="undefined"?BRANDS:[]).filter(function(b){return srcs[b.id]}).map(function(b){return chip("brand",b.id,b.name,"linear-gradient(135deg,"+b.c[0]+" 0 50%,"+(b.ac||b.c[2])+" 50% 100%)")}).join("")
    +(srcs.basics?chip("brand","basics","Basics"):"")+(srcs.found?chip("brand","found","Found"):"")+'</div>';
  if(ns>1)Promise.resolve().then(wdKeep);
  return h}
/* the categories wrap; the brands scroll sideways, and a redraw (a chip, Equip) keeps that row where it was, its chosen brand in view */
document.addEventListener("scroll",function(e){var t=e.target;if(t&&t.classList&&t.classList.contains("qs-wdbr"))WDSX=t.scrollLeft},true);
function wdKeep(){var r=document.querySelector(".qs-wdbr");if(!r)return;r.scrollLeft=WDSX;var on=r.querySelector(".on");
  if(on&&(on.offsetLeft<r.scrollLeft||on.offsetLeft+on.offsetWidth>r.scrollLeft+r.clientWidth))r.scrollLeft=Math.max(0,on.offsetLeft-12)}
/* the rack: the pieces that pass both filters, one section per category */
function wdRack(mine){var list=mine.filter(wdOk);
  if(!list.length)return '<div class="qs-wdnone"><p class="qs-empty">Nothing you own matches these filters.</p><button class="qs-btn alt" data-wdf="reset">Show everything</button></div>';
  var at=function(x){var i=WDSLOT.indexOf(x[1]);return i<0?99:i};
  return WDCAT.slice(1).map(function(k){var its=list.filter(function(x){return wdCatOf(x)===k[0]}).sort(function(a,b){return at(a)-at(b)});
    return its.length?'<section class="qs-sec"><h3>'+k[1]+'</h3><div class="qs-grid">'+its.map(qsCard).join("")+'</div></section>':''}).join("")}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-wdf]");if(!b)return;
  if(b.dataset.wdf==="reset")wdReset();else WDF[b.dataset.wdf]=b.dataset.v;render()});
