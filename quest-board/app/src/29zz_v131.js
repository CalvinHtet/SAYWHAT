/* ---------- Cal's 2026-11-23 list (the parts that are code only) ----------
   - "Remove flip phone lanyard, retro tee, and butterfly tee. These clothes are really lame and nobody would buy them." Off sale (cut, as
     ZXCUT in 29zx_simple.js and V22CUT in 29zz_v122.js); an owner keeps wearing theirs.
   - "For the stylist, allow the stylist to be available as soon as you unlock the shop." It already was (the Stylist tab, from the
     Walk-in Closet on), but last in a row that scrolls sideways; its button now sits beside the Wardrobe's, always in sight.
   - "Change upgrades and interface upgrades from the shop to a separate tab on the bottom that unlocks when you purchase the console in
     the hero's lair." A bottom tab "Upgrades" (view "sys"), drawn only once the Lair's console is bought (sysHas, 29sy_system.js), with
     the permanent upgrades and the interface pieces; the Shop no longer has them. The console's own screen opens it (sysOpen). */
var V31CUT=["gx_y_phone","gx_y_ring","gx_y_baby"];
SHOP.forEach(function(it){if(it&&it[6]&&V31CUT.indexOf(it[0])>=0)it[6].cut=1});

/* ---- the Upgrades tab ---- */
AREAS.splice(AREAS.map(function(a){return a[0]}).indexOf("shop")+1,0,["sys","Upgrades",1]);
var v31Gate=areaGate;areaGate=function(id){if(id==="sys")return !(typeof sysHas==="function"&&sysHas());return v31Gate.apply(this,arguments)};
var v31Icon=areaIcon;areaIcon=function(k){if(k!=="sys")return v31Icon.apply(this,arguments);
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h10"/><path d="M18 6h2"/><circle cx="16" cy="6" r="2"/><path d="M4 12h4"/><path d="M12 12h8"/><circle cx="10" cy="12" r="2"/><path d="M4 18h12"/><path d="M20 18h0"/><circle cx="18" cy="18" r="2"/></svg>'};
/* QA: the arrow read as "upload"; sliders, as in settings */
/* no "?" before the console is bought: the tab is not drawn at all (as the Shop before the Walk-in Closet) */
var v31Nav=navHtml;navHtml=function(){var h=v31Nav.apply(this,arguments);if(areaGate("sys"))h=h.replace(/<button data-act="nav" data-v="sys"[\s\S]*?<\/button>/,"");return h};
var SXTAB="upgrades";
function sxHtml(){var t=SXTAB==="interface"?"interface":"upgrades";
  var h='<div class="qshop sxv"><header class="qs-top qs-head"><h1>Upgrades</h1><div class="qs-coin"><i class="coin"></i><b>'+S.coins+'</b></div><small class="qs-when">From your Lair’s console</small></header>';
  h+='<nav class="qs-tabs" aria-label="Upgrade sections"><button class="qs-tab'+(t==="upgrades"?" on":"")+'" data-act="sxtab" data-v="upgrades">Upgrades</button><button class="qs-tab'+(t==="interface"?" on":"")+'" data-act="sxtab" data-v="interface">Interface</button></nav>';
  if(t==="upgrades")h+='<p class="qs-note">Each upgrade is permanent and stacks with your other bonuses.</p>'+qsLegacy(["buff"]);
  /* Cal 11-23: "The comapnions are pointless. Remove status displays", and a preview that fits (29zz_v133.js ifPrev2, View shows each piece on) */
  else h+='<div class="ifp-wrap">'+(typeof ifPrev2==="function"?ifPrev2():ifPreview())+'<p><b>Your interface</b>Tap View on anything to see it here on your setup before you buy.</p></div>'+qsLegacy(["theme","frame","bg","title","burst","sound","scene"]);
  return h+'</div>'}
var v31View=viewHtml;viewHtml=function(v){if(v==="sys")return areaGate("sys")?v31View.call(this,"board"):sxHtml();return v31View.apply(this,arguments)};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=sxtab]");if(!b)return;SXTAB=b.dataset.v;render();window.scrollTo(0,0)});
sysOpen=function(tab){try{closeModals()}catch(e){}view="sys";SXTAB=tab==="interface"?"interface":"upgrades";render();window.scrollTo(0,0)};
/* the Shop's look for the tab (its styles key on body.shopmode and the data-view palette) */
(function(){var st=document.createElement("style");st.textContent=".sxv .qs-tab{min-height:44px;padding-left:18px;padding-right:18px}";document.head.appendChild(st)})();/* QA: tap targets were 37-45 px */
var v31Render=render;render=function(){var r=v31Render.apply(this,arguments);if(view==="sys"){document.body.classList.add("shopmode");document.documentElement.setAttribute("data-view","shop")}return r};

/* ---- the Shop: no Upgrades or Interface; the Stylist beside the Wardrobe ---- */
var v31Shop=shopHtml;shopHtml=function(){if(shopTab==="upgrades"||shopTab==="interface")shopTab="wardrobe";var h=v31Shop.apply(this,arguments);
  try{h=h.replace(/<button class="qs-tab[^"]*" data-act="stab" data-v="(upgrades|interface)">[^<]*<\/button>/g,"");
    var sty=/<button class="qs-tab( on)?" data-act="stab" data-v="basics">Stylist<\/button>/;if(sty.test(h)){h=h.replace(sty,"");
      h=h.replace(/(data-v="wardrobe">Closet<\/button>)/,'$1<button class="qs-tab qs-wdb'+(shopTab==="basics"?" on":"")+'" data-act="stab" data-v="basics">Stylist</button>')}}catch(e){}
  return h};
