/* ---------- Room tester (Cal, 2026-11-06). Testing only: removed at release with the Test pill and window.__qb. ----------
   "There's no way for me to properly test the restaurant or other time based or selling based unlocks without waiting. Give me a
   way to test each room and its assets."
   Test pill > Rooms: every room in every building, each with Open (builds it now, plus the rooms the story puts before it, the
   way the story's own free opening does), Everything (owns every upgrade, so all its art shows), Empty (no upgrades) and View
   (opens its window). Along the top: +6 hours (the game clock jumps, so rooms earn, the Garden grows, waters dry out), +20
   produce, +12 sold (Mara's trigger) and Next story step (plays the next step now, its scene included). */
function qbtRooms(){var o={};Object.keys(ROOMCELL).forEach(function(t){var b=ROOMCELL[t][0];(o[b]=o[b]||[]).push(t)});return o}
function qbtSlot(t){var sl=S.base.slots;for(var i=0;i<sl.length;i++)if(sl[i]&&sl[i].t===t)return i;return -1}
function qbtOpen(t,quiet){if(qbtSlot(t)>=0)return;var o=styState(),s=styStep(t);
  /* the story's earlier rooms first, so the street and the knock-throughs make sense */
  if(s){for(var k=0;k<STORY.length&&STORY[k]!==s;k++){var p=STORY[k];if(p.room&&ROOMCELL[p.room]&&qbtSlot(p.room)<0)qbtOpen(p.room,1);if(p.how==="team"){o.done[p.id]=1;o.offer[p.id]=1;try{o.team[(p.scene&&p.scene.team)||p.id]=1}catch(e){}}}o.done[s.id]=1;o.offer[s.id]=1}
  S.base.slots.push({t:t,a:{},st:0,pend:0});
  S.base.slots.forEach(function(r){if(!r)return;(ADDONS[r.t]||[]).forEach(function(a){if(a[3]&&a[3].opens===t){r.a=r.a||{};r.a[a[0]]=1}})});
  try{if(typeof LFV!=="undefined")LFV.init=0}catch(e){}
  if(!quiet){persist();render();pop("Opened "+((ROOMT[t]||{}).name||t))}}
function qbtAll(t,on){var i=qbtSlot(t);if(i<0){qbtOpen(t,1);i=qbtSlot(t)}var r=S.base.slots[i];r.a={};
  /* QA: retired pieces stay out (the game no longer sells them); an upgrade that opens a room opens that room too */
  if(on)(ADDONS[t]||[]).forEach(function(a){var m=a[3]||{};if(m.retired)return;r.a[a[0]]=1;if(m.opens&&qbtSlot(m.opens)<0)qbtOpen(m.opens,1)});persist();render();pop(((ROOMT[t]||{}).name||t)+(on?": every upgrade":": no upgrades"))}
/* QA: a lot or upgrade step only offered the room, so every tap re-offered the Garden. A step plays its scene first (if it has
   one and hasn't been accepted), and otherwise is built right away, the way Open does it. */
function qbtNextStep(){var o=styState();for(var k=0;k<STORY.length;k++){var s=STORY[k];if(o.done[s.id]||(s.room&&styHas(s.room)))continue;
    document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});
    if(s.scene&&!o.offer[s.id]&&!(o.seen&&o.seen[s.id])){try{styScene(s);return}catch(e){}}
    if(s.room&&ROOMCELL[s.room]){qbtOpen(s.room);return}
    styOpen(s);o.done[s.id]=1;persist();pop("Story: "+s.id);return}
  pop("The story has no steps left")}
function qbtHtml(){var B=qbtRooms(),h='<div class="card box2 qbtr"><span class="label">Testing</span><h2 style="font-size:28px;margin:0 0 6px">Rooms</h2>'
  +'<p class="note">Skip the waiting. Open any room, own all of its upgrades to see every piece of art, or move the clock.</p>'
  +'<div class="qbtr-row"><button class="btn sm" data-qr="time">+6 hours</button><button class="btn sm" data-qr="veg">+20 produce</button><button class="btn sm" data-qr="sold">+12 sold</button><button class="btn sm" data-qr="next">Next story step</button></div>';
  Object.keys(B).sort().forEach(function(b){h+='<h3 class="label" style="margin-top:14px">'+esc((BLD[b]||{}).name||("Building "+b))+'</h3>';
    B[b].forEach(function(t){var i=qbtSlot(t),r=i>=0?S.base.slots[i]:null,n=(ADDONS[t]||[]).length,have=r?Object.keys(r.a||{}).length:0;
      h+='<div class="qbtr-room"><div><b>'+esc((ROOMT[t]||{}).name||t)+'</b><small>'+(r?'open &middot; '+have+'/'+n+' upgrades':'not open')+'</small></div><div class="qbtr-b">'
        +(r?'<button class="btn ghost sm" data-qr="view" data-t="'+t+'">View</button>':'<button class="btn sm" data-qr="open" data-t="'+t+'">Open</button>')
        +(n?'<button class="btn ghost sm" data-qr="all" data-t="'+t+'">Everything</button><button class="btn ghost sm" data-qr="none" data-t="'+t+'">Empty</button>':'')+'</div></div>'})});
  return h+'<div class="row" style="margin-top:12px"><button class="btn ghost" data-act="mclose">Close</button></div></div>'}
function qbRooms(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var m=modal(qbtHtml());
  m.addEventListener("click",function(e){var b=e.target.closest("[data-qr]");if(!b)return;var q=b.dataset.qr,t=b.dataset.t;
    if(q==="view"){var i=qbtSlot(t);m.remove();roomModal(i);return}
    if(q==="open")qbtOpen(t);
    if(q==="all")qbtAll(t,1);
    if(q==="none")qbtAll(t,0);
    if(q==="time"){window.__qbShift=(window.__qbShift||0)+6*36e5;try{simulate()}catch(x){}persist();render();pop("Six hours later")}
    if(q==="veg"){S.base.food=S.base.food||{};S.base.food.veg=Math.min(foodCap()*10,(S.base.food.veg||0)+20);persist();render();pop("+20 produce")}
    if(q==="sold"){var o=styState();o.sold=(o.sold||0)+12;persist();try{styCheck()}catch(x){}pop(o.sold+" produce sold so far")}
    if(q==="next"){m.remove();qbtNextStep();return}
    var c=m.querySelector(".qbtr");if(c){var y=m.scrollTop;c.outerHTML=qbtHtml();m.scrollTop=y}})}
window.__qbRooms={open:qbtOpen,all:qbtAll,next:qbtNextStep,show:qbRooms,list:qbtRooms};
