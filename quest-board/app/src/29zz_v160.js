/* ---------- Cal 2026-11-25: a brand's room wears its banner as the background ----------
   Cal: "I like the banner for the brand drops, but it takes up too much space. Can we not have a separate banner but have it be
   integrated into the background for each brand? Instead of The Shop at the top left here, the name and logo of the brand should be
   there. And remove the 'new brands mon and Fri at 8 am' message and place the new brand in 1 D 1H message on the top right to the
   left of the coins I own. Remove the plus icon and mail icon since that can just be on the main board. As for my character where it
   shows my clothes I'm wearing and the name of each item, make that slowly appear as I scroll down and the top of the screen goes out
   of view. So when I scroll down, the opacity of my player card should go from 0% to 100%. I don't like how trying something on makes
   this box with my character longer. Remove the username from this card and change 'take them off' to 'take off' and place it to the
   right of the purchase text so it doesn't create a larger box."
   - A brand's room (and the Vault's): the banner block is gone. Its picture is the top of the page's background, fading into the
     brand's colours, and stays put while the rack scrolls over it. The header's title is the brand's emblem and name.
   - The Shop's header everywhere: no "New brands Mon and Fri 8 am" line, no kind-words "+" and no mailbox (both are on the Board).
     In a brand's room the countdown sits to the left of the coins.
   - The character card inside the Shop's rooms (not the one on the home screen): no name, the worn list held to two lines, and one
     row under it: the buy button, then "Take off". The box is the same height whether or not something is tried on. On a phone it
     is out of the page's flow, pinned to the top, and fades in as the page scrolls (0 at the top, full once the header has gone);
     while a piece is tried on it shows at once, since that is the only place the try-on and its price can be seen. */
function v60Brand(){try{var d=dropState(),L=(d.live||[]).slice();if(d.back)L.push(d.back);return L.filter(function(b){return b&&b.id===shopTab})[0]||null}catch(e){return null}}
function v60Art(b){try{return (window.QBART&&QBART["ui_banner_"+b.id+".webp"])||null}catch(e){return null}}
var V60BG="";/* the brand whose picture is the page's background now */
var v60Shop=shopHtml;shopHtml=function(){var h=v60Shop.apply(this,arguments);
  try{var home=/class="qshop shub"/.test(h),b=!home&&SHUB!=="iface"&&/class="qs-hero qs-banner/.test(h)?v60Brand():null;
    /* the header: no schedule line, no "+" or mailbox */
    h=h.replace(/<small class="qs-when">[\s\S]*?<\/small>/,"").replace(/<header class="qs-top qs-head">[\s\S]*?<\/header>/,function(hd){
      return hd.replace(/<button class="ibbtn"[\s\S]*?<\/button>/g,"").replace(/<button[^>]*class="kdbtn[^"]*"[\s\S]*?<\/button>/g,"")});
    V60BG=b?b.id:"";
    if(b){var cd=(/<small class="qs-cd">[\s\S]*?<\/small>/.exec(h)||[""])[0];
      h=h.replace(/<section class="qs-hero qs-banner[\s\S]*?<\/section>/,"").replace(/<h1>The Shop<\/h1>/,'<h1 class="qs-bh">'+brandLogo(b,0)+'</h1>');
      if(cd)h=h.replace(cd,"").replace('<div class="qs-cbar">','<div class="qs-cbar">'+cd);
      h=h.replace(/class="qshop( shub-in shub-vault)?"/,function(m,v){return 'class="qshop'+(v||"")+' v60room"'})}
    if(!home){/* the character card: no name, one row for buying and taking off */
      h=h.replace(/<aside class="qs-mirror[\s\S]*?<\/aside>/,function(m){/* only the card's own basket: the Pet Store's keeps its line */
        return m.replace(/(<div class="qs-worn">)<b>[\s\S]*?<\/b>/,"$1").replace(/<div class="qs-bask"><small>Trying on \d+ pieces?<\/small>/,'<div class="qs-bask">').replace(">Take them off<",">Take off<").replace(/<aside class="qs-mirror/,'<aside class="qs-mirror v60m')})}}catch(e){}
  return h};
/* the page's background in a brand's room: its banner at the top, then its colours */
var v60Theme=qsTheme;qsTheme=function(b){var r=v60Theme.apply(this,arguments);
  try{var art=b&&SHUB!=="home"&&SHUB!=="iface"?v60Art(b):null;
    if(art)document.body.style.setProperty("--shopbg","linear-gradient(180deg,rgba(8,10,18,.5) 0,rgba(8,10,18,.18) 120px,"+b.c[1]+" 300px,"+b.c[0]+" 100%),url(\""+art+"\") center top/auto 320px no-repeat,"+b.c[1])}catch(e){}
  return r};
/* the card fades in with the scroll (phones); shown at once while something is tried on */
function v60Fade(){try{var m=document.querySelector(".qs-mirror.v60m");if(!m)return;var on=false;try{on=qsTryList().length>0||!!PCTRY}catch(e){}
    var y=window.scrollY||0,o=window.innerWidth>640||on?1:Math.max(0,Math.min(1,(y-70)/150));m.style.opacity=o.toFixed(2);m.style.pointerEvents=o<.4?"none":"";m.style.visibility=o<=0?"hidden":""}catch(e){}}
window.addEventListener("scroll",v60Fade,{passive:true});window.addEventListener("resize",v60Fade);
var v60Render=render;render=function(){var r=v60Render.apply(this,arguments);v60Fade();return r};
htabCss("qb-v160-css",(typeof v59Up==="function"?v59Up:function(x){return x})(
  ".qs-bh{margin:0}.qs-bh .blg{gap:10px}.qs-bh .blg_e{width:42px;height:42px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.5))}.qs-bh .blg b{font-size:22px;line-height:1.05;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.65)}.qs-bh .blg small{font-size:11px;letter-spacing:.28em;color:rgba(255,255,255,.88);text-shadow:0 1px 4px rgba(0,0,0,.7)}"
  +".qshop.v60room .qs-top{align-items:center}.qshop.v60room .qs-cbar{display:flex;align-items:center;gap:10px}.qshop.v60room .qs-cbar .qs-cd{color:#fff;opacity:.92;text-shadow:0 1px 4px rgba(0,0,0,.7);white-space:normal;text-align:right;max-width:78px;line-height:1.25;margin:0}.qshop.v60room .qs-top h1{min-width:0}.qshop.v60room .qs-cbar{flex:none}"
  +".qs-mirror.v60m .qs-worn small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.qs-mirror.v60m .qs-bask{flex-direction:row;flex-wrap:nowrap;align-items:center;gap:8px;margin-top:8px}.qs-mirror.v60m .qs-bask .qs-btn{flex:0 1 auto;min-width:0;white-space:nowrap}.qs-mirror.v60m .qs-bask .qs-link{flex:none;white-space:nowrap}"
  +"@media (max-width:640px){.qs-mirror.v60m{position:fixed;left:10px;right:10px;top:max(6px,env(safe-area-inset-top));margin:0;z-index:30;opacity:0;transition:opacity .12s linear}.qs-mirror.v60m .qs-glass{width:84px;height:96px}}"));
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV160={brand:function(){var b=v60Brand();return b?b.id:""},bg:function(){return V60BG},fade:v60Fade};
