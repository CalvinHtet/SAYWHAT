/* ---------- Cal 2026-11-26: the header's character is there at once ----------
   Cal: "When launching the game, the character does not show up in the banner on the top left until after a few seconds. Probably it is
   loading in. i want everything to be quick and snappy and no visible loading".
   The figure is drawn by the WebGL rig once the game has loaded (calHyd), so the header card stood empty for a few seconds. The last
   picture drawn for the header is now kept on this phone (localStorage "qb-hdr": the look, the size and a small WebP of the frame); at
   launch the header shows it at once, and the live figure takes over as soon as it is drawn. A changed outfit or banner simply waits
   for its first live frame, as before, and is kept from then on. */
var V85K="qb-hdr",V85SAVED="";
function v85Key(im){return (im.getAttribute("data-look")||"")+"|"+(im.getAttribute("data-h")||"")+"|"+(im.getAttribute("data-pose")||"")}
function v85Get(){try{return JSON.parse(localStorage.getItem(V85K)||"null")}catch(e){return null}}
/* the header card, built with the kept picture in place of the empty one */
var v85Av=v55Av;v55Av=function(){var h=v85Av.apply(this,arguments);
  try{var c=v85Get();if(!c||!c.d)return h;var m=/data-pose="([^"]*)" data-h="([^"]*)" data-look="([^"]*)"/.exec(h);if(!m)return h;
    var d=document.createElement("textarea");d.innerHTML=m[3];var k=d.value+"|"+m[2]+"|"+m[1];if(k!==c.k)return h;
    return h.replace(/src="data:image\/gif;base64,[^"]*"/,'src="'+c.d+'" data-v85="1"')}catch(e){return h}};
/* keep the header's live picture once it is drawn */
function v85Save(im){try{if(!im.isConnected||!/^blob:|^data:image\/(png|webp)/.test(im.currentSrc||im.src)||!im.naturalWidth||im.getAttribute("data-v85")==="1"&&!im.dataset.hy)return;
    var k=v85Key(im);if(k===V85SAVED)return;var w=im.naturalWidth,h=im.naturalHeight,s=Math.min(1,360/h),c=document.createElement("canvas");c.width=Math.round(w*s);c.height=Math.round(h*s);
    c.getContext("2d").drawImage(im,0,0,c.width,c.height);var d=c.toDataURL("image/webp",.9);if(!/^data:image\/webp/.test(d))d=c.toDataURL("image/png");
    if(d.length>400000)return;localStorage.setItem(V85K,JSON.stringify({k:k,d:d,t:Date.now()}));V85SAVED=k}catch(e){}}
document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.classList&&t.classList.contains("calp")&&t.closest&&t.closest(".strip .avbtn")&&t.dataset.hy)setTimeout(function(){v85Save(t)},400)},true);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV185={get:v85Get,clear:function(){try{localStorage.removeItem(V85K)}catch(e){}V85SAVED=""}};
