/* ---------- Cal 2026-11-26: a tiny chore is still a task ----------
   Cal: "Put laundry in dryer is 1 coin and 1 exp. That is too low. It is still a task. Redo the analysis for the categorization.
   Something that small should be 5 coins and 3 exp because it's so easy."
   The rater had two rungs at the bottom: a quick step (a motion on the way to something else: put on socks, walk to the car; 1 XP,
   nothing else, 29zz_v157.js) and 5 XP. A real chore of a minute or two was sometimes rated a step. Now:
   - A new rung, tiny: a real chore that takes a minute or two (move the laundry to the dryer, feed the cat, take vitamins, water a
     plant, take the trash out). 3 XP and 5 coins, flat: no bonuses or multipliers, so it cannot be farmed, and it still counts as done.
   - The rater is told the difference, and a "step" answer whose name is plainly a chore becomes tiny. The offline estimate knows the
     common tiny chores. Tasks already on a Board that were rated a step but are chores are moved to tiny once.
   - Steps stay steps (1 XP, no coins). */
var V95CHORE=/\b(laundry|dryer|washer|washing machine|dishwasher|dishes|trash|garbage|recycling|bins?|feed (the |my )?(cat|dog|fish|pets?|bird|rabbit)|vitamins?|meds|medicine|pills?|water (the |my )?plants?|litter|make (the |my )?bed|wipe|towels?|sheets|fold|hang up|put away|unload|load)\b/i;
var V95XP=3,V95COIN=5;
function v95Tiny(q){return !!q&&!q.bty&&+q.xp===V95XP}
/* the rater */
/* PARSE is set by 30_app_b.js, after this file: it is amended the first time tasks are rated */
function v95Parse(){try{if(PARSE.indexOf("3 = tiny")>=0)return;PARSE=PARSE.replace("A real small chore is not a step:","A real chore that takes a minute or two is never a step either: it is tiny (xp 3, mins 2), for example moving the laundry to the dryer, feeding the cat, taking vitamins, watering a plant. A real small chore is not a step:")
  .replace("XP scale: 5 = trivial, under 5 minutes.","XP scale: 3 = tiny, a real chore of a minute or two. 5 = trivial, under 5 minutes.")}catch(e){}}
var v95Score=scoreAll;scoreAll=function(){v95Parse();return v95Score.apply(this,arguments)};
var v95Val=validate;validate=function(o,src){var raw=o&&(+o.xp);var r=v95Val.apply(this,arguments);
  try{var nm=String(r.name||"");if(raw===3||(o&&o.tiny===true)){r.xp=V95XP;r.mins=Math.min(r.mins||2,4);r.why="A small task";r.proof=false}
    else if(+r.xp===1&&V95CHORE.test(nm)&&!V57STEP.test(nm.trim())){r.xp=V95XP;r.mins=2;r.why="A small task";r.proof=false}}catch(e){}return r};
var v95Guess=guess;guess=function(t){var r=v95Guess.apply(this,arguments);
  try{var s=String(t||"").trim();if(!V57STEP.test(s)&&V95CHORE.test(s)&&/^(put|move|switch|throw|toss|take|feed|water|start|unload|load|hang)\b/i.test(s)&&s.split(/\s+/).length<=6){r.xp=V95XP;r.why="A small task";r.mins=2;r.proof=false}}catch(e){}return r};
/* tasks already on the Board */
function v95Fix(){try{if(!S||!S.quests||S.v95)return;var n=0;S.quests.forEach(function(q){if(q&&!q.bty&&+q.xp===1&&V95CHORE.test(q.name||"")&&!V57STEP.test(String(q.name||"").trim())){q.xp=V95XP;q.why="A small task";n++}});S.v95=1;if(n)persist()}catch(e){}}
/* the pay: 3 XP and 5 coins, flat */
var v95Toggle=toggle;toggle=function(id,ev,mode){var q=(S.quests||[]).filter(function(x){return x.id===id})[0];if(!v95Tiny(q))return v95Toggle.apply(this,arguments);
  var before=effLvl(),wasGate=gated(),t=today();if(!S.dayXp||S.dayXp.d!==t)S.dayXp={d:t,x:0};if(!S.cdone)S.cdone={};
  if(S.done&&S.done[id]){var back=+S.done[id]||0,cb=+S.cdone[id]||0;delete S.done[id];delete S.vdone[id];delete S.cdone[id];S.xp=Math.max(0,S.xp-back);S.dayXp.x=Math.max(0,S.dayXp.x-back);S.coins=(S.coins||0)-cb;S.earnedC=Math.max(0,(S.earnedC||0)-cb)}
  else{S.done[id]=V95XP;S.vdone[id]=0;S.cdone[id]=V95COIN;S.xp+=V95XP;S.dayXp.x+=V95XP;S.coins=(S.coins||0)+V95COIN;S.earnedC=(S.earnedC||0)+V95COIN;
    try{qToast(V95XP,V95COIN,1,["Small task: 3 XP, 5 coins"])}catch(e){}}
  render();persist();var after=effLvl();try{if(after>before)levelUp(after,null,before);else if(!wasGate&&gated())gateOpened(gated())}catch(e){}};
setTimeout(v95Fix,3000);setInterval(v95Fix,20000);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV195={tiny:v95Tiny,fix:function(){S.v95=0;v95Fix()},val:function(o,s){return validate(o,s)},guess:function(t){return guess(t)},parse:function(){v95Parse();return PARSE}};
