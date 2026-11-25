/* ---------- Cal 2026-11-25: a logged workout counts ----------
   Cal: "A workout logged gives too little experience. It should be 100 experience for this and 500 coins" (ECON.trainXp 100 in
   29e_economy.js, trainCoins 500 flat in 29zzz_econ.js), and "the 4 logged per week meter did not complete for today even though I
   logged my work": the week's meter (S.wcount, S.active) counted only the Workout quest's live photo, never a session finished in the
   tracker. Now a full session (ECON.trainXp, at least 3 exercises) ticks today on the meter too. A day counts once, whichever comes
   first, the session or the photo; the photo stays (it pays the Workout quest and can be posted). Undoing the photo on a day the
   session already counted leaves the day counted. */
var v70Mark=markActive;markActive=function(){try{if(S.active&&S.active[today()])return}catch(e){}return v70Mark.apply(this,arguments)};
var v70Unmark=unmarkActive;unmarkActive=function(){try{if(S.v70tr===today())return}catch(e){}return v70Unmark.apply(this,arguments)};
var v70Trained=econTrained;econTrained=function(x,plan){var r=v70Trained.apply(this,arguments);
  try{if(x>=ECON.trainXp){S.v70tr=today();/* QA 250a711b: on every full session, so undoing an earlier photo keeps the day */if(!(S.active&&S.active[today()]))markActive();persist()}}catch(e){}return r};
/* Training's card: a day already counted by a session says so, and the photo is offered as an extra */
var v70Train=trainHtml;trainHtml=function(){var h=v70Train.apply(this,arguments);
  try{if(S.active&&S.active[today()])h=h.replace(/<button class="btn big v35wk" data-act="v35wk">[\s\S]*?<\/button>/,
    '<p class="note v35wk"><b>&#10003; Today&rsquo;s workout is logged.</b></p><button class="btn ghost v35wk" data-act="v35wk">Add a photo</button>')}catch(e){}return h};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV170={trained:function(x,p){econTrained(x,p)},mark:function(){markActive()},unmark:function(){unmarkActive()},wcount:function(){return weekCount()},active:function(){return !!(S.active&&S.active[today()])}};
