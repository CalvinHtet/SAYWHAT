/* ---------- businesses follow the chores (QA's simulator, 2026-11-05) ----------
   Rooms kept earning whatever the player did, and by month two paid 70% of all coins. Now the businesses pay out each day
   up to 1.5 times what the day's quests earned, plus a small base, so real tasks stay the engine. What is not collected
   stays in the room (up to its storage) for later. */
var PAYK=1.5,PAYBASE=200;
function payDay(){var d=new Date().toISOString().slice(0,10),p=S.base.pay;if(!p||p.d!==d)p=S.base.pay={d:d,n:0};return p}
function payQuest(){return Object.keys(S.cdone||{}).reduce(function(a,k){return a+(S.cdone[k]||0)},0)}
function payRoom(){return Math.max(0,Math.round(PAYBASE+PAYK*payQuest())-payDay().n)}
function payTake(n){payDay().n+=n}
window.__qbPay={room:payRoom,quest:payQuest,day:payDay};
