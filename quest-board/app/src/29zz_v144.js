/* ---------- Cal's 2026-11-24 list, batch 1 (docs/specs/2026-11-24_SPEC_cal_list.md) ---------- */

/* ---- the ranks: Awakened, Hunter, Knight, Paragon, Sovereign, Monarch (Cal: "Change the ranks to Awakened, Hunter, Knight, (Something
   else), Sovereign, Monarch", then "Paragon and keep everything else"). They were Bass Hunter, Drop Knight, Headliner and Shadow Monarch:
   two were music words and one was another story's title. Classes and paths keep their names. ---- */
(function(){var n=["Awakened","Hunter","Knight","Paragon","Sovereign","Monarch"];RANKS.forEach(function(r,i){if(n[i])r.n=n[i]})})();

/* ---- one greeting: Wave (Cal: "Just have a wave button instead of the other buttons. They do the same thing"). Fist bump and High five
   leave the card; greetings already sent with them still read right (SQOLD, 29p_square.js sqKind). ---- */
(function(){["fist","five"].forEach(function(k){if(SQK[k]){SQOLD[k]=SQK[k];delete SQK[k]}})})();

/* ---- nothing waits without a spinner (Cal: "For anything that is loading such as the syncing text on the top right, make sure you add a
   spinning circle. There should never be anything that is waiting idly with no loading animation, otherwise people will think the app is
   frozen ... even after adding tasks and it is sorting through my tasks"). Every waiting line in the app ends in "…" or "..." and starts
   with one of the words below (syncing…, Loading…, Posting…, Reading your brain dump..., Looking for players…, Connecting…): each gets a
   small spinning ring in front of it, in its own colour, for as long as it shows. Found after every render and twice a second, so a line
   written later (a fetch that answers, a window that opens) gets one too. ---- */
var V44WAIT=/^(loading|posting|looking for|reading|opening|checking|connecting|syncing|saving|sending|sorting|uploading|verifying|adding|working|thinking)\b[^\n]{0,60}(…|\.\.\.)$/i;
htabCss("qb-spin-css",".qspin::before{content:\"\";display:inline-block;box-sizing:border-box;width:.78em;height:.78em;margin-right:.42em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;vertical-align:-.08em;animation:qspin .7s linear infinite}@keyframes qspin{to{transform:rotate(360deg)}}");
function v44Spin(){try{var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,on=[];
    while((n=w.nextNode())){var t=n.nodeValue;if(t.length<5||t.length>80)continue;t=t.trim();if(!V44WAIT.test(t))continue;var p=n.parentNode;if(!p||!p.closest||p.closest("svg,script,style,textarea,option"))continue;on.push(p)}
    document.querySelectorAll(".qspin").forEach(function(e){if(on.indexOf(e)<0)e.classList.remove("qspin")});
    on.forEach(function(e){e.classList.add("qspin")})}catch(e){}}
var v44Render=render;render=function(){var r=v44Render.apply(this,arguments);v44Spin();return r};
setInterval(v44Spin,500);

if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV144={spin:v44Spin,ranks:function(){return RANKS.map(function(r){return r.n})},sqk:function(){return Object.keys(SQK)}};
