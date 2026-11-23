/* ---------- after v1.37 ----------
   QA (live check of v1.37): on a new player's first Loft tap the room's welcome card ("Welcome home ... Start with your Bedroom") opens,
   and the tour's next step ("This is The Loft. Tap it to see the rooms inside") drew on top of it: the ring on the card, the bubble over
   its text, the building to tap under it. A tour step that is not about a window now waits, unseen, while any window is open, and shows
   once it is closed (tourDraw; a waiting step does not count as missing, so it is never skipped for it). */
var v38Draw=tourDraw;tourDraw=function(){try{var st=tourStep();if(st&&!st.modal&&document.querySelector("#layer .modal")){var r=document.getElementById("qbtour");if(r)r.style.visibility="hidden";return}}catch(e){}return v38Draw.apply(this,arguments)};
