/* ---------- Cal 2026-11-26: animations rest when nobody can see them ----------
   Cal said yes to "Pause banner loops and aura effects when they're off-screen or the app is in the background". Every looping effect
   (the banners' 8 s loops, the chapter prizes on a card, the seasons over the Loft, the scratch card's glints) is watched; while it is out
   of view its animations hold (animation-play-state: paused) and pick up where they were when it comes back. A hidden app already holds
   every animation (the browser stops painting it). */
var V86SEL=".v77fx,.pc-fig.v74on,.pc-fig.v76on,.v75air,.v74fx,.v76show";
var V86IO=null;try{V86IO=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle("v86off",!e.isIntersecting)})},{rootMargin:"40px"})}catch(e){}
function v86Scan(){if(!V86IO)return;try{[].forEach.call(document.querySelectorAll(V86SEL),function(el){if(el.__v86)return;el.__v86=1;V86IO.observe(el)})}catch(e){}}
var V86T=0;function v86Soon(){if(V86T)return;V86T=setTimeout(function(){V86T=0;v86Scan()},120)}
try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)if(ms[i].addedNodes&&ms[i].addedNodes.length){v86Soon();return}}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
htabCss("qb-v186-css",".v86off,.v86off *,.v86off::before,.v86off::after,.v86off *::before,.v86off *::after{animation-play-state:paused!important}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV186={scan:v86Scan};
