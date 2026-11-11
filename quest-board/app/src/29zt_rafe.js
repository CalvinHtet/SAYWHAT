/* ---------- Rafe's legendary hunts (W35: SPEC3 part 6, SPEC4 part 3, SPEC5 part 1) ----------
   Cal, 2026-11-10: "Legendary levels can be lvl 27, 52, 77, and 93." "The hunt is how you meet him." "No two active days. Just go
   outside for a walk or do something active." And: "Before you are able to go with him on the journey, he says he needs to make sure
   you won't die along the way ... a picture of you at the gym or doing something active ... Then I want a few pictures of a cutscene
   (3-4 full page pictures) ... in a 4-5 second montage where you finally get the legendary relic. And then he takes off and says he'll
   let us know when there are more treasures in the future."
   - Each hunt is a side-quest (29zs_side.js): Rafe's scene, then "Show me" sits on the Board until a photo passes. Photo only, no
     honor path; a rejected photo can be tried again any time. One hunt at a time, in order: a save already past 52 gets the first
     hunt, and the next one the day after it is done.
   - The first hunt is how a player who has not met Rafe meets him: he joins the team when they say yes, and his Lock and Key scene
     (29b_story.js "rafe") never plays; he shows up at the bar later as a return visit instead, without introducing himself again.
   - Passed: the montage (4 full-screen pictures over about 4.6 s, tap to skip), the legendary relic card (RELICS2, its buff in
     ECON.relicBuff, each stronger than the last), then Rafe leaves and says he will send word.
   Art (Mac, all optional): ui_hunt<n>_<k>.webp, n = hunt 1-4, k = picture 1-4, portrait, Rafe ahead and the player's own hands, no
   player character (SPEC4 part 3); until then each picture is a dark panel with its line. The relic icons are ui_relic2_<id>.webp. */
var RFHUNT=[
  {lv:27,relic:"r2_crown",name:"Rafe's hunt: the drowned temple",hue:178,
    meet:["A sunburnt man with a map tattooed on his forearm is waiting by your door.","\"Rafe Calloway. I hear you finish what you start.\"","\"There's a crown at the bottom of a drowned temple off the Coral Reach. I need someone who can keep up.\"","\"Show me you can. A picture of you outside, moving. A walk counts.\""],
    ask:["\"That sunken temple I keep talking about? I found the way in.\"","\"There's a crown at the bottom. I need someone who can keep up.\"","\"Show me you can. A picture of you outside, moving. A walk counts.\""],
    frames:["Low tide. The temple steps go down into green water.","A rope, a ledge, and Rafe already on the other side.","The water falls away into a dry throne room.","The crown is lighter than it looks."],
    leave:["\"Told you it was an easy one.\"","\"I'm heading north for a while. I'll send word when I hear of the next one.\""]},
  {lv:52,relic:"r2_wyrmheart",name:"Rafe's hunt: the Ashfall Range",hue:18,
    ask:["\"There's a coal in the Ashfall Range that hasn't gone out in four hundred years.\"","\"The climb is the easy part. Show me you're still moving.\""],
    frames:["Switchbacks of black rock, warm under your hands.","Rafe stops on a ridge and points at the smoke.","The cave breathes out. You wait, then go in.","The ember sits in the ribs of something enormous."],
    leave:["\"Keep it away from the curtains.\"","\"I'll be in touch.\""]},
  {lv:77,relic:"r2_veil",name:"Rafe's hunt: the room that didn't burn",hue:268,
    ask:["\"A library in Valmora burned down in 1640. One room didn't.\"","\"Getting in means a long walk and no sleep. Show me you're up for it.\""],
    frames:["A door in a field, with nothing behind it.","Rafe opens it. Stone stairs go down.","The corridors fold back on themselves. Rafe chalks every turn.","The veil hangs in the last room, moving without wind."],
    leave:["\"Don't open every fold at once.\"","\"There's one more out there. I'll find it.\""]},
  {lv:93,relic:"r2_worldseed",name:"Rafe's hunt: under the glacier",hue:205,
    ask:["\"This is the last one I know of.\"","\"A seed under a glacier at the top of the world. Show me you can still keep up.\""],
    frames:["White, in every direction.","Rafe cuts steps into blue ice.","Under the glacier, a forest's roots hold up the ceiling.","The seed is warm in your hand."],
    leave:["\"That's the whole list.\"","\"If I hear of anything else, you'll be the first to know.\""]}];
/* hunt k (1-4) is due: the level reached, its relic not owned, and the hunt before it done on an earlier day */
function rfDue(k){var h=RFHUNT[k-1],o=sdqState(),prev=k>1?o.done["hunt"+(k-1)]:"x";if(!h||effLvl()<h.lv||r2State()[h.relic])return false;
  return k===1||(!!prev&&prev<today())}
function rfMet(){return teamHas("rafe")}
RFHUNT.forEach(function(h,i){var k=i+1,r=r2Of(h.relic);
  SIDEQ.splice(i,0,{id:"hunt"+k,pic:"rafe",who:"Rafe Calloway",role:"Traveling adventurer",hunt:k,added:"Rafe's hunt",
    get at(){return (k===1&&!rfMet())||!styHas("skybar")?"your door":"Lock and Key"},name:h.name,gate:function(){return rfDue(k)},
    get ask(){return h.meet&&!rfMet()?h.meet:h.ask},yes:"Show him",
    snap:"A picture of you outside on a walk, or doing anything active.",
    check:"a person being active: out on a walk, a run or a hike, at the gym, playing a sport or working out. A photo of the view from a walk or hike outdoors also counts",
    done:h.leave,reward:(r?r.name+": ":"")+r2BuffTxt(h.relic),
    /* the first hunt is how Rafe joins, and his bar introduction is then never played */
    onYes:function(){if(rfMet())return;var o=styState();o.done.rafe=1;o.huntMet=1;persist();try{teamJoin("rafe")}catch(e){}},
    give:function(){if(r&&!r2State()[r.id])r2Give(r)},
    fin:function(){rfMontage(k,function(){rfRelic(k)})}})});
/* Rafe at the bar for a player who met him on the first hunt (in place of his introduction) */
BEATS.unshift({id:"rafe0",pic:"rafe",who:"Rafe Calloway",role:"Traveling adventurer",at:"Lock and Key",gate:function(){return teamHas("rafe")&&!!styState().huntMet&&styUps("skybar")>=3},
  lines:["Rafe takes the stool at the end of your bar. Old Fashioned, stirred.","\"Best drink since a dockside bar off the Coral Reach. I'll drink here between trips.\""]});
/* the montage: 4 full-screen pictures, about 1.15 s each */
var RFSTEP=1150;
function rfFrame(k,j){var h=RFHUNT[k-1],u=window.QBART&&QBART["ui_hunt"+k+"_"+(j+1)+".webp"];
  return '<div class="rfm-f'+(j?'':' on')+'" style="--rfh:'+h.hue+'">'+(u?'<img src="'+u+'" alt="">':'<div class="rfm-ph" aria-hidden="true"></div>')+'<p>'+esc(h.frames[j])+'</p></div>'}
function rfMontage(k,done){var h=RFHUNT[k-1],el=document.createElement("div"),j=0,t=null,end=false;el.className="rfm";el.setAttribute("role","dialog");el.setAttribute("aria-label",h.name);
  el.innerHTML=h.frames.map(function(x,i){return rfFrame(k,i)}).join("")+'<button class="rfm-skip" type="button">Skip</button>';
  var fin=function(){if(end)return;end=true;clearInterval(t);el.remove();done()};
  el.querySelector(".rfm-skip").onclick=fin;
  document.getElementById("layer").appendChild(el);
  t=setInterval(function(){var f=el.querySelectorAll(".rfm-f");j++;if(j>=f.length){fin();return}f.forEach(function(x,i){x.classList.toggle("on",i===j)})},RFSTEP)}
/* the legendary relic card, then Rafe leaves */
function rfRelic(k){var h=RFHUNT[k-1],r=r2Of(h.relic);
  var m=modal('<div class="card box2 rf-relic"><span class="label">Legendary relic</span><h2>'+esc(r?r.name:"")+'</h2>'+(r?r2Card(r):'')
    +'<div class="btns"><button class="btn" data-act="rfleave" data-k="'+k+'">Continue</button></div></div>');
  try{if(typeof qbSnd==="function")qbSnd("chest")}catch(e){}return m}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=rfleave]");if(!b)return;var k=+b.dataset.k,q=sdqOf("hunt"+k),m=b.closest(".modal");if(m)m.remove();if(!q)return;
  modal(sdqCard(q,q.done,'<button class="btn" data-act="mclose">Continue</button><small class="sty-xp">'+esc(q.reward)+'</small>'))});
if(window.__qbSide)window.__qbSide.hunt={due:rfDue,list:RFHUNT,montage:rfMontage,step:function(ms){RFSTEP=+ms||1150}};
