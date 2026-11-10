/* ---------- Wardrobe filters (Cal, 2026-11-10: "In the wardrobe, there should be categories for different item pieces, and also can be
   filtered by brand and the category of items") ----------
   Category chips (only the categories this list has) and brand chips in each brand's colour (only brands it has); the two combine.
   The choice lasts for the session (WDF, not saved). The Wardrobe tab gets both; a brand's tab gets the categories. */
var WDCAT=[["all","All"],["top","Tops",["a_top"]],["bottom","Bottoms",["a_pants"]],["shoes","Shoes",["a_shoes"]],["acc","Accessories",["a_acc"]],["hat","Hats",["a_hat"]],
  ["back","Back",["a_back"]],["face","Face",["a_mask","a_xface","a_eyet","a_eyes"]],["hair","Hair",["a_hair","a_hairc","a_beard"]]];
var WDF={cat:"all",brand:"all"};
function wdCatOf(x){var c=WDCAT.filter(function(k){return k[2]&&k[2].indexOf(x[1])>=0})[0];return c?c[0]:""}
function wdOk(x,noBrand){return (WDF.cat==="all"||wdCatOf(x)===WDF.cat)&&(noBrand||WDF.brand==="all"||((x[6]&&x[6].b)||"")===WDF.brand)}
/* the chips for a list of items: its categories, and (unless noBrand) its brands */
function wdBar(list,noBrand){var cats={},brs={};list.forEach(function(x){cats[wdCatOf(x)]=1;var b=x[6]&&x[6].b;if(b)brs[b]=1});
  if(WDF.cat!=="all"&&!cats[WDF.cat])WDF.cat="all";if(!noBrand&&WDF.brand!=="all"&&!brs[WDF.brand])WDF.brand="all";
  var C=WDCAT.filter(function(k){return k[0]==="all"||cats[k[0]]}),B=(typeof BRANDS!=="undefined"?BRANDS:[]).filter(function(b){return brs[b.id]});
  var chip=function(k,v,txt,on,col){return '<button class="qs-wdc'+(on?' on':'')+'" data-wdf="'+k+'" data-v="'+esc(v)+'"'+(col?' style="--wdc:'+col+'"':'')+' aria-pressed="'+on+'">'+esc(txt)+'</button>'};
  var h='<div class="qs-wdf" role="group" aria-label="Filter by category">'+C.map(function(k){return chip("cat",k[0],k[1],WDF.cat===k[0])}).join("")+'</div>';
  if(!noBrand&&B.length>1)h+='<div class="qs-wdf qs-wdb" role="group" aria-label="Filter by brand">'+chip("brand","all","All brands",WDF.brand==="all")
    +B.map(function(b){return chip("brand",b.id,b.name,WDF.brand===b.id,b.ac||(b.c&&b.c[2]))}).join("")+(brs.basics?chip("brand","basics","Basics",WDF.brand==="basics"):"")+'</div>';
  return h}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-wdf]");if(!b)return;WDF[b.dataset.wdf]=b.dataset.v;render()});
