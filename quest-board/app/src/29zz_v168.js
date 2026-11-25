/* ---------- Cal 2026-11-25: a bought piece shows at once ----------
   Cal: "There are also some items I bought in the loft where the item did not appear right away or it showed an empty space where it
   used to be until I went to a different menu and came back."
   On the web build a room's pictures are files fetched the first time something draws them (01_blobs.js, w-perf2). The room is an
   inline SVG whose <image> elements point at those files; Safari does not always repaint an SVG <image> whose file arrives after the
   room was drawn, so a new piece (or the upgraded one that replaced the old) stays blank until the room is drawn again.
   Now every room picture still on its way is fetched once more as a plain Image; when it has arrived, each <image> that shows it
   gets its href set again and its SVG nudged, which makes Safari paint it. Pictures already fetched are left alone; data: and blob:
   pictures (the Claude build) never need it. */
var V68={};/* href -> 1 fetching, 2 arrived (or failed: nothing more to do) */
var V68N=0;/* how many times a picture was re-set (the test reads it) */
function v68Esc(u){return String(u).replace(/["\\]/g,"\\$&")}
function v68Kick(u){try{var L=document.querySelectorAll('svg image[href="'+v68Esc(u)+'"]');
    /* QA 0d64dd6a: the nudge must not touch the SVG's own transform (the Loft's pan and zoom live there): it brushes the <image>'s own
       opacity and puts back whatever was there */
    [].forEach.call(L,function(im){im.setAttribute("href",u);V68N++;var o=im.style.opacity;im.style.opacity=o&&o!=="1"?String(Math.max(0,+o-.001)):"0.999";requestAnimationFrame(function(){im.style.opacity=o})})}catch(e){}}
function v68Scan(){try{var L=document.querySelectorAll("svg image[href]");
    for(var i=0;i<L.length;i++){var u=L[i].getAttribute("href");if(!u||V68[u]||/^(data|blob):/.test(u)||u.charAt(0)==="#")continue;
      V68[u]=1;(function(u){var I=new Image();I.onload=I.onerror=function(){V68[u]=2;v68Kick(u)};I.src=u})(u)}}catch(e){}}
var V68T=0;function v68Soon(){if(V68T)return;V68T=setTimeout(function(){V68T=0;v68Scan()},120)}
try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)if(ms[i].addedNodes&&ms[i].addedNodes.length){v68Soon();return}}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV168={scan:v68Scan,state:function(){return V68},kicks:function(){return V68N}};
