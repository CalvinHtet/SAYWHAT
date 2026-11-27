/* ---------- Cal 2026-11-25/26: banners that move (Higgsfield loops) ----------
   Cal: "use higgsfield to generate even better banner animations ... other video animations, wherever it would be good, without hurting
   performance", and later: "Only the banner animation vid, and any animated cosmetics ... Make sure this animation is playing and is
   visible in the town hall chat".
   A banner with a painted loop (ROOMS: art/app/bl_pc_<id>_loop.mp4, 540x720, about 10 s, with a _loop.webp poster) plays it behind the
   character on the cards people look at (29zz_v177.js's list: the header's card, the profile's banner, the big card, the Shop's
   preview, posted cards, another player's window, the Town Hall square's card), in place of the drawn sparkle layer. Muted, inline,
   looping; paused whenever the card is off screen or the page is hidden; the poster (the painting) for anyone who asked for reduced
   motion, and wherever a loop has not been made yet the 8 s drawn layer stays. */
function v213Url(bg){try{var n="bl_pc_"+bg+"_loop.mp4",D=QBLoft.data;return D&&D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:null}catch(e){return null}}
function v213Poster(bg){try{var n="bl_pc_"+bg+"_loop.webp",D=QBLoft.data;return (window.QBART&&QBART[n])||(D&&D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:"")}catch(e){return ""}}
var V213RM=false;try{V213RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
var V213IO=null;try{V213IO=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;try{if(e.isIntersecting&&!document.hidden){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()}catch(x){}})},{threshold:.05})}catch(e){}
document.addEventListener("visibilitychange",function(){[].forEach.call(document.querySelectorAll("video.v213"),function(v){try{if(document.hidden)v.pause()}catch(e){}})});
function v213Scan(){try{[].forEach.call(document.querySelectorAll(V77SEL),function(el){var m=/\bpc-([a-z0-9_]+)\b/.exec(el.className),bg=m?m[1]:"",u=bg?v213Url(bg):null,cur=el.querySelector(":scope>video.v213");
      if(!u){if(cur){try{V213IO&&V213IO.unobserve(cur)}catch(e){}cur.remove();el.classList.remove("v213on")}return}
      if(cur&&cur.getAttribute("data-bg")===bg)return;if(cur){try{V213IO&&V213IO.unobserve(cur)}catch(e){}cur.remove()}
      var v=document.createElement("video");v.className="v213";v.setAttribute("data-bg",bg);v.muted=true;v.defaultMuted=true;v.setAttribute("muted","");v.setAttribute("playsinline","");v.setAttribute("webkit-playsinline","");
      v.loop=true;v.preload="auto";var ps=v213Poster(bg);if(ps)v.poster=ps;v.setAttribute("aria-hidden","true");v.disablePictureInPicture=true;
      if(!V213RM){v.src=u;v.autoplay=true}el.insertAdjacentElement("afterbegin",v);el.classList.add("v213on");if(V213IO&&!V213RM)V213IO.observe(v)})}catch(e){}}
var v213Base=v77Scan;v77Scan=function(){var r=v213Base.apply(this,arguments);v213Scan();return r};
htabCss("qb-v213-css","video.v213{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none;border-radius:inherit}.v213on>.v77fx{display:none}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV213={url:v213Url,scan:v213Scan};
