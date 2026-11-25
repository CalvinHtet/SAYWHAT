/* ---------- Cal 2026-11-25: a pose on the player card ----------
   Cal: "Is there any way to have the characters do some sort of pose in these banner pics without having to redo EVERY single asset in
   the game?" Yes: the character is a rig, and its clips (wave, cheer, laugh, dance, think, clap, stretch, and the back view: data/poses.json) already
   move every piece of clothing, as they do in the Loft. A card pose is one frame of one of those clips, drawn sharp like the
   standing figure. No new art.
   - S.pc.pose, chosen on the player card (a row of poses under the card); free. It shows wherever the card is drawn: the big card,
     the profile's banner, a card post on the Town board, and to other players (card.pose in the world doc, whitelisted).
   - The header's small card keeps the breathing idle figure. */
var PCPOSE=[["stand","Stand","idle",0],["wave","Wave","wave",2],["cheer","Cheer","cheer",2],["laugh","Laugh","laugh",2],["dance","Dance","dance",2],["think","Think","think",24],["clap","Clap","clap",2],["stretch","Stretch","stretch",10],["back","Back","back",0]],PCPTRY="";
function pcPoseBy(id){return PCPOSE.filter(function(p){return p[0]===id})[0]||null}
var v62Open=pcOpen;pcOpen=function(){var r=v62Open.apply(this,arguments);
  try{var m=document.querySelector("#layer .pcm"),row=m&&m.querySelector(".pc-row");if(m&&row&&!m.querySelector(".pc-poses")){var cur=pcMine().pose;
      row.insertAdjacentHTML("beforebegin",'<div class="pc-poses" role="group" aria-label="Pose">'+PCPOSE.map(function(p){return '<button type="button" class="pc-pose'+(p[0]===cur?" on":"")+'" data-act="pcpose" data-id="'+p[0]+'" aria-pressed="'+(p[0]===cur)+'">'+p[1]+'</button>'}).join("")+'</div>')}}catch(e){}
  return r};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=pcpose]");if(!b)return;e.preventDefault();e.stopPropagation();var P=pcPoseBy(b.dataset.id);if(!P)return;
  var o=pcSt();if(o.pose===P[0]||(!o.pose&&P[0]==="stand"))return;o.pose=P[0];persist();try{socPublish(true)}catch(x){}pcOpen();render()},true);
htabCss("qb-v162-css",".pc-poses{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:12px 0 0}.pc-pose{min-height:36px;padding:0 13px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--fg,inherit);font:inherit;font-size:.9em;cursor:pointer}.pc-pose.on{border-color:var(--accent);background:var(--accent);color:var(--accent-ink,#120a14);font-weight:700}.pc-pose:focus-visible{outline:2px solid var(--accent);outline-offset:2px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV162={poses:PCPOSE,by:pcPoseBy};
