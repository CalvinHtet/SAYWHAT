/* ---------- Cal 2026-11-26: syncing never stalls anything ----------
   Cal: "I see that i am not able to do certain things while it is syncing. If there is a way to do this in parallel or in the background
   so nothing stalls, that would be great".
   At launch the copy on this phone is on screen while the online save loads (the fast start, 30_app_b.js). Until now everything that
   changes the save (ticking a task, buying, claiming, collecting) was switched off for those seconds and said "Still syncing".
   Now every tap is taken: anything that only looks works at once as before, and anything that changes the save is queued, marked on its
   button at once (a ticked box for a task), and goes through by itself the moment the online save is in, on whichever save won. So a
   tap is never lost and never lands on a save about to be replaced. Tapping a queued task again takes it back off the queue.
   Typing works throughout (a window keeps what was typed; its Save button is queued like any other). Only the camera waits, since a
   photo picker cannot be opened later on a phone's behalf; it says so. */
/* the blanket tap block of the fast start goes; this file decides per tap instead */
(function(){try{[].forEach.call(document.querySelectorAll("style"),function(st){var t=st.textContent;if(t.indexOf("html.qb-sync body *{pointer-events:none!important}")>=0)st.textContent=t.replace("html.qb-sync body *{pointer-events:none!important}","")})}catch(e){}})();
var V88Q=[],V88LOOK=['.avbtn','[data-act="pcard"]','[data-act="char"]','[data-act="qbinfo"]','.ibbtn','.ibrow','.ibback','.scbtn','[data-act="pcbgs"]','[data-act="wardrobe"]','[data-shub]','.shub-char','[data-act="stab"]','[data-qsfl]','[data-act="stytab"]','[data-wdf]',
  '[data-act="qstry"]','[data-act="qsclear"]','[data-act="pctry"]','[data-act="fshview"]','[data-act="phopen"]','[data-act="sxtab"]','.nav','[data-act="nav"]','.htab','.mx','[data-act="mclose"]','.v81cats','[data-v87]','[data-v87d]','.v87m'].join(","),V88POP=0;
function v88Sync(){return document.documentElement.classList.contains("qb-sync")}
/* the tapped control, named by its data attributes so it can be found again after the screen is redrawn */
function v88Sel(el){var s=el.tagName.toLowerCase();[].forEach.call(el.attributes,function(a){if(/^data-/.test(a.name)&&!/^data-(v88|hy|v85|v67k)/.test(a.name))s+='['+a.name+'="'+(window.CSS&&CSS.escape?CSS.escape(a.value):a.value.replace(/"/g,'\\"'))+'"]'});return s}
function v88Mark(sel,on){try{[].forEach.call(document.querySelectorAll(sel),function(el){el.classList.toggle("v88q",on)})}catch(e){}}
window.addEventListener("click",function(e){if(!v88Sync())return;var t=e.target;if(!t||!t.closest)return;
  if(t.closest(V88LOOK))return;
  var el=t.closest("button,[data-act],label,[role=button]");if(!el)return;
  if(el.matches("input,textarea,select")||t.matches("input,textarea,select"))return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  /* the camera: a photo picker must come from the tap itself */
  if(el.tagName==="LABEL"&&el.getAttribute("for")){var inp=document.getElementById(el.getAttribute("for"));if(inp&&inp.type==="file"){pop("The camera opens once your save is in. One moment.");return}}
  var sel=v88Sel(el);if(sel===el.tagName.toLowerCase()){pop("One moment, your save is coming in.");return}
  var i=V88Q.indexOf(sel);
  if(i>=0){if(el.getAttribute("data-act")==="toggle"){V88Q.splice(i,1);v88Mark(sel,false)}return}
  V88Q.push(sel);v88Mark(sel,true);
  if(!V88POP){V88POP=1;pop("Got it. It goes through as soon as your save is in.")}},true);
/* a redraw while syncing keeps the marks */
var v88Render=render;render=function(){var r=v88Render.apply(this,arguments);if(V88Q.length)V88Q.forEach(function(s){v88Mark(s,true)});return r};
/* the save is in: run the queue in order on the save that won */
function v88Run(){var q=V88Q.slice();V88Q=[];var miss=0;
  q.forEach(function(sel,n){setTimeout(function(){try{v88Mark(sel,false);var el=document.querySelector(sel);if(el&&el.isConnected&&!el.disabled)el.click();else miss++}catch(e){miss++}
      if(n===q.length-1&&miss)pop(miss===1?"One tap from while it synced no longer applies.":miss+" taps from while it synced no longer apply.")},60+n*140)})}
new MutationObserver(function(){if(!v88Sync()&&V88Q.length)setTimeout(v88Run,80)}).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
htabCss("qb-v188-css",".v88q{position:relative;animation:v88pulse 1.1s ease-in-out infinite}.qmain.v88q .box{background:var(--accent,#7cf0ff)!important;border-color:var(--accent,#7cf0ff)!important;color:#0b0e1a!important;opacity:.75}"
  +"@keyframes v88pulse{0%,100%{box-shadow:0 0 0 0 rgba(124,240,255,0)}50%{box-shadow:0 0 0 3px rgba(124,240,255,.45)}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV188={q:function(){return V88Q.slice()},sel:v88Sel,run:v88Run};
