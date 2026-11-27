/* ---------- Cal 2026-11-26: your banner behind you on the Shop's front page ----------
   Cal: "In the shop tab, show the profile banner in this view as well but don't show it when inside each brand so that we can clearly see
   the item we are purchasing".
   On the Shop's home screen the character card shows your player card's banner (and its 8 s loop, 29zz_v177.js) behind you. Inside a
   brand, the Vault, the Stylist, the Interface or the Pet Store, the card keeps its plain light well, so the piece being tried reads
   clearly. Studio (no banner) stays plain everywhere. */
var v206Mirror=qsMirror;qsMirror=function(){var h=v206Mirror.apply(this,arguments);
  try{if(typeof SHUB==="undefined"||SHUB!=="home")return h;var bg=(pcMine()||{}).bg||"studio";if(!bg||bg==="studio"||!pcHas(bg))return h;var u=pcArt(bg);if(!u)return h;
    h=h.replace('<div class="qs-glass">','<div class="qs-glass v206ban pc-'+esc(bg)+'" style="background-image:url(&quot;'+esc(u)+'&quot;)">')}catch(e){}
  return h};
try{V77SEL+=",.qshop .qs-glass.v206ban"}catch(e){}
htabCss("qb-v206-css",".qs-glass.v206ban{position:relative;background-size:cover;background-position:center;background-color:#0b0e1a}.qs-glass.v206ban>img.calp{position:relative;z-index:1}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV206={html:function(){return qsMirror()}};
