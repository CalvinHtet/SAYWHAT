/* ---------- Cal 2026-11-26: Training pays as you go ----------
   Cal: "For working out using the guided training tab, grant some exp and coins for completing and recording each set. And then a final
   reward for logging the workout for the day. Decide how much to give players for this since there is another reward for doing 4 in a
   week".
   - Each set ticked (in the guided session or on the plan's list): 3 XP and 15 coins, at once. Unticking it takes them back.
     At most 25 paid sets a day, so a long session or ticking on and off cannot farm it (a real hour's session is 15 to 25 sets).
   - Logging the workout keeps its own reward (100 XP and 500 coins for a full session, 29zz_v170.js) and the 4-a-week bonus stays on
     top, so a typical session pays about 150 XP and 750 to 875 coins, about what an hour-long task pays, and the week's bonus still
     matters. No bonus multipliers on the per-set pay. */
var V98XP=3,V98COIN=15,V98CAP=25;
function v98Day(){var t=today(),o=S.wkpay;if(!o||typeof o!=="object"||o.d!==t)o=S.wkpay={d:t,n:0};return o}
function v98Grant(x,c){var before=effLvl(),wasGate=gated(),t=today();if(!S.dayXp||S.dayXp.d!==t)S.dayXp={d:t,x:0};
  S.xp=Math.max(0,S.xp+x);S.dayXp.x=Math.max(0,S.dayXp.x+x);S.coins=(S.coins||0)+c;S.earnedC=Math.max(0,(S.earnedC||0)+c);
  var after=effLvl();try{if(after>before)setTimeout(function(){levelUp(after,null,before)},350);else if(!wasGate&&gated())gateOpened(gated())}catch(e){}}
var v98Tap=wkSetTap;wkSetTap=function(id,n,val){var wk=S.wk;if(!wk)return v98Tap.apply(this,arguments);var key=id+":"+n,had=!!(wk.sets&&wk.sets[id]&&wk.sets[id][n]);
  var r=v98Tap.apply(this,arguments);
  try{if(!wk.pay||typeof wk.pay!=="object")wk.pay={};var D=v98Day(),now=!!(wk.sets[id]&&wk.sets[id][n]);
    if(now&&!had&&!wk.pay[key]&&D.n<V98CAP){wk.pay[key]=1;D.n++;v98Grant(V98XP,V98COIN);try{pop("Set done: +"+V98XP+" XP, +"+V98COIN+" coins")}catch(e){}}
    else if(!now&&had&&wk.pay[key]){delete wk.pay[key];D.n=Math.max(0,D.n-1);v98Grant(-V98XP,-V98COIN)}}catch(e){}
  return r};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV198={day:v98Day,tap:function(id,n,v){return wkSetTap(id,n,v)}};
