/* ---------- after v1.37 ----------
   QA (live check of v1.37): on a new player's first Loft tap the room's welcome card ("Welcome home ... Start with your Bedroom") opens,
   and the tour's next step ("This is The Loft. Tap it to see the rooms inside") drew on top of it: the ring on the card, the bubble over
   its text, the building to tap under it. A tour step that is not about a window now waits, unseen, while any window is open, and shows
   once it is closed (tourDraw; a waiting step does not count as missing, so it is never skipped for it). */
var v38Draw=tourDraw;tourDraw=function(){try{var st=tourStep();if(st&&!st.modal&&document.querySelector("#layer .modal")){var r=document.getElementById("qbtour");if(r)r.style.visibility="hidden";return}}catch(e){}return v38Draw.apply(this,arguments)};

/* the "Finish the tutorial" quest (Cal 11-23): ticking it is remembered (S.tutDone), so the First steps card's "Add today's tasks" still waits
   for a task the player adds (29zx_simple.js) */
var v38Tog=toggle;toggle=function(id){var r=v38Tog.apply(this,arguments);try{var q=(S.quests||[]).filter(function(x){return x&&x.id===id})[0];if(q&&q.tut){S.tutDone=S.done&&S.done[id]?1:0;persist()}}catch(e){}return r};

/* ---- Cal 11-23: "On the training tab, the coins are covering the top right of the screen": the floating coin count (#zxcoins, shown
   once the header scrolls away) sat over a workout's "See full workout" and close buttons. It is not drawn on Training. ---- */
(function(){var st=document.createElement("style");st.textContent='html[data-view="train"] #zxcoins{display:none!important}';document.head.appendChild(st)})();

/* ---- Cal 11-23: "I also don't want the welcome splash message to appear automatically. I want it to only show in the message inbox as a
   number to show how many new messages there are": the Welcome letter never opens by itself (29q_news.js welcomeOnce); it waits in the
   inbox, counted in the envelope's number until read. ---- */
welcomeOnce=function(){try{if(!loaded||!S.created)return;var I=ibState();if(!I.popped){S.welcomed=1;I.popped=1;persist()}}catch(e){}};
