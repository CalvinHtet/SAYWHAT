/* ---------- Patch notes in the inbox (Cal, 2026-11-17) ----------
   Cal: "When v1.06 gets published, send a short update summary of the patch changes in the mailbox. And give everyone 500 coins."
   One letter per update in PATCHES (newest last): id, d (the day it went out), subj, body, coins (claimed once, 29x_inbox.js). A player
   gets a letter only if they were already playing that day (the day they got the welcome letter is on or before d), so someone who
   joins in a month does not open their inbox to old patch notes. Cal: "Too much info in the update logs that give info on what is
   next. Just be vague about it and don't spoil anything": what changed, never what is coming (no brands, no dates). */
var PATCHES=[
  {id:"patch106",d:"2026-11-17",subj:"Update 1.06",coins:500,body:'<ul class="wl">'
    +'<li>The Street now has 3 brands on sale at once.</li>'
    +'<li>New brands drop in a new order. Keep checking the Shop.</li>'
    +'<li>Photos you post now go up on the town board.</li>'
    +'<li>The Shop fits small phones better.</li>'
    +'</ul><p>500 coins on me. Thanks for playing.</p>'}
];
INBOXGEN=INBOXGEN||[];INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();
  return PATCHES.filter(function(p){return join<=p.d}).map(function(p){return {id:p.id,from:"Cal",subj:p.subj,d:p.d,coins:p.coins||0,body:p.body}})});
/* QA's note on v1.06: with 3 brands (4 on a vault Wednesday) the Shop's section tabs ran off a phone's edge with no cue (BASICS cut
   at 375 and 390, the vault tab read "SMO"). The row wraps instead, so every tab is on screen. The floor tabs stay one row */
(function(){var st=document.createElement("style");
  st.textContent=".qshop .qs-tabs:not(.qs-floors){flex-wrap:wrap;overflow-x:visible;row-gap:8px}";
  (document.head||document.documentElement).appendChild(st)})();
