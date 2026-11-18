/* ---------- v1.15: Training back in the tab bar (Cal, 2026-11-17) ----------
   Cal: "the training tab just completely disappeared" ... "I want the training tab to still be on the bottom as a new tab". Since the
   five tabs (2026-11-13) Training opened from a tile on the Board. Now it is a tab again, after the Board: Board, Training, The Loft,
   Shop, Town, Players. Its Board tile goes (the tab replaces it); Dungeon Crawls keeps its tile. As before, a new player's first three
   days (the calm week) do not show it yet. */
delete NAVHIDE.train;
(function(){for(var i=ZXHUB.length-1;i>=0;i--)if(ZXHUB[i][0]==="train")ZXHUB.splice(i,1)})();
var v15Nav=navHtml;navHtml=function(){var h=v15Nav.apply(this,arguments);
  try{if(typeof calmOn==="function"&&calmOn()&&calmDay()<4)h=h.replace(/<button data-act="nav" data-v="train"[^>]*>[\s\S]*?<\/button>/,"")}catch(e){}
  return h};
/* the Training tour rings the tab now */
TOURS.forEach(function(T){if(T.id!=="train")return;T.ready=function(){return view==="board"&&!!tourVis('.nav button[data-v="train"]')};
  if(T.steps[0])T.steps[0].sel='.nav button[data-v="train"]'});

/* ---------- quick admin pays a little less (Cal, 2026-11-17) ----------
   Cal: "I think the leveling is still too fast by just a tad. Or that my admin and work activities are scaled too high ... It could be
   closing out ten tickets and I'll end up making a task for each email." ... "small tasks like sending emails or repetitive admin work
   gets a little bit less XP because that is annoying but easy to complete". A desk task (cluster admin: day job, accounts, paperwork,
   messages) scored 10 XP or less pays 75% of its XP. Bigger desk work, every other kind of task, bounties and coins are unchanged. */
var QUICKADMIN=.75;
var v15Mults=mults,v15Cut=null;mults=function(q,o){var r=v15Mults.apply(this,arguments);
  try{if(q&&q.cl==="admin"&&(+q.xp||0)<=10&&!q.bty&&q.rep!=="weekly4"&&q.id!==bountyId()){var full=r.xp;r.m*=QUICKADMIN;r.tags.push("Quick admin x"+QUICKADMIN);payXp(q,r);
    if(o&&o.commit)v15Cut={id:q.id,x:Math.max(0,full-r.xp)}}}catch(e){}
  return r};
/* v1.17, Cal: "Yes, count in full" (asked: should quick admin still count in full toward your streak and the Weekly Quest?). The XP it
   pays stays 75%, but the day's active count (S.dayXp, 50 XP makes the day count for the streak and the Weekly Quest) gets the full
   amount: what the cut took is added back there (S.qaDay {id: XP}), and taken off again if the quest is unticked. */
var v15Toggle=toggle;toggle=function(id){var was=!!(S.done&&S.done[id]);v15Cut=null;var r=v15Toggle.apply(this,arguments);
  try{var now=!!(S.done&&S.done[id]),t=today();if(!S.qaDay||typeof S.qaDay!=="object"||S.qaDay.d!==t)S.qaDay={d:t};
    if(!was&&now&&v15Cut&&v15Cut.id===id&&v15Cut.x>0&&S.dayXp&&S.dayXp.d===t){S.qaDay[id]=v15Cut.x;S.dayXp.x+=v15Cut.x;
      if(S.dayXp.x>=50){var note=creditStreak();if(note)setTimeout(function(){if(/Streak chest/.test(note)&&ART.chest)chestModal(note);else pop(note)},1800)}persist()}
    else if(was&&!now&&S.qaDay[id]){if(S.dayXp&&S.dayXp.d===t){S.dayXp.x=Math.max(0,S.dayXp.x-S.qaDay[id]);if(S.dayXp.x<50)uncreditStreak()}delete S.qaDay[id];persist()}}catch(e){}
  v15Cut=null;return r};
