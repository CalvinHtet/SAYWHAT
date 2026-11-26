/* ---------- The 1.60 patch letter (ships on v1.61, as 1.50 did on v1.51) ----------
   The same rules as 29zz_v154.js: what changed since 1.50, in general terms; no brands, no dates, nothing coming; nothing about
   companions or other surprises. 500 coins. Only for a player who was already playing on the day it went out. */
var V69LETTER={id:"patch160",from:"Cal",d:"2026-11-25",subj:"Update 1.60",coins:1000,/* Cal 11-25: patch letters pay 1,000 */body:'<ul class="wl">'
  +'<li>Your player card sits at the top of the Board now. Tap it anywhere to open your profile, and change its banner there.</li>'
  +'<li>Posting your card to the town board saves that exact outfit, so you can post more than one look.</li>'
  +'<li>Your photos stay private until you choose to post them.</li>'
  +'<li>Mark a task with up to three ! to keep it at the top of your list.</li>'
  +'<li>The Board is tidier. Your level, trial and Daily Quest live in your profile, and a new Goals button shows everything you are working toward.</li>'
  +'<li>The scratch card sits by your mailbox. Rub it to scratch.</li>'
  +'<li>The Shop has a new look. Every brand now takes turns in one row, and the pricier ones cost less than before. If you bought one at the old price, the difference is back in your coins.</li>'
  +'<li>Bounties pay more, and every bounty chore needs a photo.</li>'
  +'</ul><p>1,000 coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V69LETTER.d?[V69LETTER]:[]});

/* Cal 11-25: "Change the patch update messages to give 1000 coins": a player who claimed 500 from Update 1.50 or 1.60 gets the other 500, once */
function v69TopUp(){try{if(!loaded||!S||!S.created)return;var I=ibState(),n=0;["patch150","patch160"].forEach(function(id){if(+I.paid[id]===500){I.paid[id]=1000;n+=500}});
    if(n){S.coins=(S.coins||0)+n;S.earnedC=(S.earnedC||0)+n;persist();try{pop("Patch letters now pay 1,000: +"+n.toLocaleString()+" coins")}catch(e){}}}catch(e){}}
setTimeout(v69TopUp,2500);setInterval(v69TopUp,30000);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV169={topUp:v69TopUp};
