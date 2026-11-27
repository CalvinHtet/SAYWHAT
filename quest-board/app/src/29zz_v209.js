/* ---------- Cal 2026-11-26: the Closet has one row of tabs ----------
   Cal: "Remove the brands tabs on the top. And having two sections for clothing categories is redundant. Remove the tabs on top and just
   add an All tab to the bottom one".
   The Closet had three rows: category chips (All, Tops, ...), brand chips (All brands, SMOKE BOMB, Basics) and, under the character card,
   the category tabs (29zz_v181.js). The two chip rows are gone (the Closet always shows everything you own); the tabs row starts with All.
   Its categories match the Shop's: Hats, Glasses & Masks, Necklaces, Gloves, Tops, Bottoms, Shoes, then Face (eyes, tattoos, scars),
   Hair and Back. */
WDCAT=[["all","All"],["hat","Hats"],["head","Glasses & Masks"],["neck","Necklaces"],["gloves","Gloves"],["top","Tops"],["bottom","Bottoms"],["shoes","Shoes"],["face","Face"],["hair","Hair"],["back","Back"],["acc","Accessories"]];
var v209Cat=wdCatOf;wdCatOf=function(x){var c=v209Cat.apply(this,arguments);
  try{if(x[1]==="a_mask")return "head";if(x[1]==="a_acc"){var k=v201Cat(x);return k==="head"||k==="neck"||k==="gloves"?k:c}if(c==="face"&&/^(a_eyes|a_eyet|a_tattoo|a_scar|a_xface)$/.test(x[1]))return "face";
    if(c==="face"){var z=typeof acc2Slot==="function"?acc2Slot(x):"";if(z==="mask"||z==="glasses")return "head"}}catch(e){}return c};
wdBar=function(){try{WDF={cat:"all",brand:"all"}}catch(e){}return ""};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV209={cat:function(id){var it=SHOP.filter(function(x){return x[0]===id})[0];return it?wdCatOf(it):null}};
