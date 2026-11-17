/* ---------- Cal's notes, 2026-11-17 (after v1.12) ---------- */

/* The Wheel. Cal: "once the wheel spins and we collect the money, I want the menu to close and disappear from the board so it clears up
   space." The prize lands (3.6 s), stays on the wheel 3 s so it can be read (QA
   9eb7f13: 1.6 s was short for a long prize like a piece of clothing), then the Wheel closes back to the Board. Its row on the
   Board is already gone until the next spin is ready (zxSpin), and the prize stays on screen in the pop-up. A window that opened meanwhile
   (a badge) stays on top of the Board. */
var v12Spin=spin;spin=function(){var was=spinning;v12Spin.apply(this,arguments);
  if(!was&&spinning)setTimeout(function(){try{if(view==="wheel"&&!spinning){view="board";render();window.scrollTo(0,0)}}catch(e){}},6600)};

/* Streak freezes. Cal: "There is no button to use a streak freeze. does it apply automatically? If so, please add that in the tutorial so
   we know it gets applied automatically." It does: the first quest after a missed day spends the week's free rest day, then freezes
   (creditStreak, streakGap). A tour shows it once, the first time the player holds a freeze, and the line that pays a freeze says it. */
TOURS.push({id:"freeze",ready:function(){return view==="board"&&(S.freezes||0)>0&&!!tourVis(".avbtn")},steps:[
  {sel:".avbtn",t:"Streak freezes",get x(){var n=S.freezes||0;return "You have "+n+" streak freeze"+(n===1?"":"s")+". There is no button. If you miss a day, your weekly rest day "
    +"covers it first, then a freeze is used for you the next time you finish a quest. Miss more days than that covers and the streak drops. "
    +"Tap your character to see how many you have."}/* QA 9eb7f13: the whole rule (streakGap), not half of it */}]});
var v12Credit=creditStreak;creditStreak=function(){var r=v12Credit.apply(this,arguments);
  return typeof r==="string"?r.replace("Earned a streak freeze","Earned a streak freeze (used for you if you miss a day)"):r};
