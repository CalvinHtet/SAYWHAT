/* ---------- Cal 2026-11-25: category tabs in the Shop's rooms ----------
   Cal: "Just under my character box at the top, I want tabs for the different categories. Place the different cosmetics into these category
   tabs for easier access so we don't need to scroll all the way down" (the Stylist's Hair, Hair color, Highlights, Eye color, Tattoos,
   Scars; a brand's Hats, Accessories, Tops, Bottoms, Shoes; the Closet's own).
   Any Shop page whose rack has two or more sections gets a row of tabs, one per section, named as the section was; only the chosen
   section shows (its own heading goes, the tab says it). The row stays just under the character card while the page scrolls (or at the
   top when the card is not showing), and each page remembers its tab while the Shop is open. */
var V81SEL={};
function v81Key(){try{return (typeof SHUB!=="undefined"?SHUB:"")+"|"+(typeof shopTab!=="undefined"?shopTab:"")}catch(e){return "?"}}
function v81Apply(){try{if(typeof view==="undefined"||view!=="shop")return;var rack=document.querySelector(".qshop .qs-rack");if(!rack)return;
    var secs=[].filter.call(rack.children,function(e){return e.classList&&e.classList.contains("qs-sec")&&e.querySelector("h3")});
    var old=document.querySelector(".qshop .v81cats");if(secs.length<2){if(old)old.remove();secs.forEach(function(s){s.classList.remove("v81off")});return}
    var names=secs.map(function(s){return s.querySelector("h3").textContent.trim()}),k=v81Key(),sel=V81SEL[k];if(names.indexOf(sel)<0)sel=V81SEL[k]=names[0];
    if(!old||old.getAttribute("data-k")!==k+"|"+names.join(",")){if(old)old.remove();
      rack.insertAdjacentHTML("beforebegin",'<nav class="v81cats qs-tabs" data-k="'+esc(k+"|"+names.join(","))+'" aria-label="Categories">'+names.map(function(n){return '<button type="button" class="qs-tab v81c" data-v81="'+esc(n)+'">'+esc(n)+'</button>'}).join("")+'</nav>')}
    [].forEach.call(document.querySelectorAll(".qshop .v81cats .v81c"),function(b){b.classList.toggle("on",b.getAttribute("data-v81")===sel)});
    secs.forEach(function(s,i){var on=names[i]===sel;s.classList.toggle("v81off",!on);s.classList.add("v81sec")});v81Stick()}catch(e){}}
/* just under the character card when it shows (it is pinned to the top on a phone and fades in with the scroll, 29zz_v160.js) */
/* Cal 11-25 (later): "Instead of having the opaque fade in for the character box in the shop, just have it sit under the stuff on top, and
   then have it follow me when I scroll down": on a phone the card is in the page under the header and tabs, always shown, and sticks to
   the top once scrolled to; the category tabs stick right under it (CSS below overrides 29zz_v160.js's fixed, fading card) */
function v81Stick(){try{var n=document.querySelector(".qshop .v81cats");if(!n)return;var m=document.querySelector(".qs-mirror.v60m"),top=6;
    if(m&&window.innerWidth<=640)top=Math.round(6+m.offsetHeight+6);n.style.top=top+"px"}catch(e){}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v81]");if(!b)return;e.preventDefault();e.stopPropagation();V81SEL[v81Key()]=b.getAttribute("data-v81");v81Apply();
  try{var n=document.querySelector(".qshop .v81cats"),r=document.querySelector(".qshop .qs-rack");if(n&&r){var y=r.getBoundingClientRect().top+window.scrollY-n.offsetHeight-(parseFloat(n.style.top)||6)-8;if(window.scrollY>y)window.scrollTo(0,Math.max(0,y))}}catch(x){}},true);
var v81Render=render;render=function(){var r=v81Render.apply(this,arguments);try{if(view!=="shop")V81SEL={};v81Apply()}catch(e){}return r};
window.addEventListener("scroll",function(){requestAnimationFrame(v81Stick)},{passive:true});window.addEventListener("resize",v81Stick);
htabCss("qb-v181-css",".qshop .v81cats{position:sticky;z-index:29;display:flex;flex-wrap:nowrap;gap:8px;overflow-x:auto;scrollbar-width:none;margin:6px 0 10px;padding:6px 2px;background:linear-gradient(180deg,rgba(11,14,26,.92),rgba(11,14,26,.78));border-radius:14px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}"
  +".qshop .v81cats::-webkit-scrollbar{display:none}.qshop .v81cats .qs-tab{flex:none;white-space:nowrap}"
  +".qs-sec.v81off{display:none}.qs-sec.v81sec>h3{display:none}"
  /* QA b2755c42: another .qs-tabs rule wrapped the row onto two lines; and the fixed coin pill sat over the end of the card's piece names */
  +".qshop nav.v81cats{flex-wrap:nowrap!important;overflow-x:auto!important;justify-content:flex-start!important}"
  +"@media (max-width:640px){.qs-mirror.v60m .qs-worn{padding-right:clamp(78px,26vw,112px)}}"
  +"@media (max-width:640px){.qs-mirror.v60m{position:sticky!important;top:6px!important;left:auto!important;right:auto!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;margin:0 0 6px!important;transition:none!important}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV181={apply:v81Apply,sel:function(){return V81SEL}};
