/* ---------- QA's speed sweep 11-26 (Cal: "quick and snappy and no visible loading or freezing or missing assets") ----------
   QA ranked what still held the screen or showed late (TASKS, SPEED SWEEP). This takes:
   2. Buying an upgrade froze about half a second, 199 ms of it the purchase sound being set up at the tap (the audio system and its
      noise sample built on first use). Both are made while the game is idle after it loads, so the tap only plays the notes, and the
      notes are scheduled just after the screen updates.
   3. Shop icons in the categories not on screen were lazy, so a category tab showed blanks that popped in. Once a Shop page is drawn,
      the rest of its rack loads in the background.
   4. The level milestone's three icons were rebuilt by every redraw and reloaded about 440 ms later, so they flashed. A redraw now keeps
      the pictures already on screen when the new one is the same.
   5. The small pictures read for the card fit, the ring aura and the scratch card use a canvas kept on the CPU (no GPU readback).
   And from QA's "Still syncing" list: everything that only looks (into a building, zoom, back to the street, Board Edit, GOALS, Show me,
   the Interface, Pet Store and gym tabs, a room's window) goes at once while syncing instead of waiting in the queue (29zz_v188.js). */
/* 2: the sound system, warmed while idle */
function v90Warm(){try{if(typeof IF_AC==="undefined")return;if(!IF_AC)IF_AC=new (window.AudioContext||window.webkitAudioContext)();
    if(!QBSND_NZ){var ac=IF_AC,n=Math.floor(ac.sampleRate*.25),d;QBSND_NZ=ac.createBuffer(1,n,ac.sampleRate);d=QBSND_NZ.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1}}catch(e){}}
/* a browser allows the audio system to start only after a tap: it is made at the first tap, while idle, before any purchase */
(function(){var done=0;function go(){if(done)return;done=1;var f=function(){v90Warm()};if(window.requestIdleCallback)requestIdleCallback(f,{timeout:1500});else setTimeout(f,300)}
  ["pointerdown","keydown"].forEach(function(t){document.addEventListener(t,go,{capture:true,once:true,passive:true})})})();
var v90Snd=qbSnd;qbSnd=function(){var a=arguments,self=this;requestAnimationFrame(function(){setTimeout(function(){v90Snd.apply(self,a)},0)})};
/* 3: a Shop page's other categories load in the background */
function v90Rack(){try{if(typeof view==="undefined"||view!=="shop")return;[].forEach.call(document.querySelectorAll('.qshop img[loading="lazy"]'),function(im){im.loading="eager";im.decoding="async"})}catch(e){}}
/* 4: a redraw keeps pictures already on screen */
var V90KEEP='.ms-opt img,.qs-worn img';
var v90Render=render;render=function(){var old={};try{[].forEach.call(document.querySelectorAll(V90KEEP),function(im){if(im.complete&&im.naturalWidth){var k=im.getAttribute("src");if(k&&!old[k])old[k]=im}})}catch(e){}
  var r=v90Render.apply(this,arguments);
  try{if(Object.keys(old).length)[].forEach.call(document.querySelectorAll(V90KEEP),function(im){var k=im.getAttribute("src"),o=old[k];if(o&&o!==im&&!o.isConnected&&o.className===im.className){o.removeAttribute("loading");im.replaceWith(o);delete old[k]}})}catch(e){}
  v90Rack();return r};
document.addEventListener("click",function(e){var t=e.target;if(t&&t.closest&&t.closest(".qshop"))setTimeout(v90Rack,30)},true);
/* "Still syncing": what only looks goes at once */
try{V88LOOK+=',[data-lf],.lfz,[data-act="lfz"],[data-act="bldout"],[data-act="bldgo"],[data-act="room"],[data-act="zxroom"],[data-act="gotoroom"],[data-act="qedit"],[data-v67],[data-act="zxfsshow"],[data-act="iftab"],[data-act="p2tab"],[data-act="dgtab"],[data-act="wkopen"],[data-act="wkinfo"],[data-act="wkfold"],[data-act="wkexinfo"],[data-act="qsview"],[data-act="nxsee"],[data-act="fshfold"],[data-act="fshmode"],[data-act="fshwho"],[data-act="rhelp"]'}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV190={warm:v90Warm,ac:function(){return typeof IF_AC!=="undefined"&&IF_AC?IF_AC.state:null},nz:function(){return !!QBSND_NZ},rack:v90Rack};
