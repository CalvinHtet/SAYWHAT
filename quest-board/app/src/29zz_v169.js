/* ---------- The 1.60 patch letter (ships on v1.61, as 1.50 did on v1.51) ----------
   The same rules as 29zz_v154.js: what changed since 1.50, in general terms; no brands, no dates, nothing coming; nothing about
   companions or other surprises. 500 coins. Only for a player who was already playing on the day it went out. */
var V69LETTER={id:"patch160",from:"Cal",d:"2026-11-25",subj:"Update 1.60",coins:700,/* Cal 11-26: patch letters pay 700 from now on (were 1,000; a letter already claimed keeps what it paid) */body:'<ul class="wl">'/* Cal 11-26: at most 10 lines, one sentence each, like things grouped */
  +'<li>Your player card sits at the top of the Board: tap it for your profile and its banner.</li>'
  +'<li>Posting your card saves that outfit, so you can post more than one look, and your photos stay private until you post them.</li>'
  +'<li>Mark a task with up to three ! to keep it at the top.</li>'
  +'<li>The Board is tidier, with your level, trial and Daily Quest in your profile and a Goals button for everything you&rsquo;re working toward.</li>'
  +'<li>The scratch card sits by your mailbox, ready to rub.</li>'
  +'<li>The Shop has a new look with every brand in one row and cheaper pricier brands, and if you paid the old price the difference is back in your coins.</li>'
  +'<li>Bounties pay more, and every bounty chore needs a photo.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V69LETTER.d?[V69LETTER]:[]});

/* Cal 11-25: "Change the patch update messages to give 1000 coins": a player who claimed 500 from Update 1.50 or 1.60 got the rest, once.
   Cal 11-26: "Change the patch update message coin reward to 700 going forward ... Let ppl keep money if they already claimed": a letter
   claimed at 500 is now topped up to 700 (+200); one already topped up to 1,000 keeps it. */
function v69TopUp(){try{if(!loaded||!S||!S.created)return;var I=ibState(),n=0;["patch150","patch160"].forEach(function(id){if(+I.paid[id]===500){I.paid[id]=700;n+=200}});
    if(n){S.coins=(S.coins||0)+n;S.earnedC=(S.earnedC||0)+n;persist();try{pop("Patch letters now pay 700: +"+n.toLocaleString()+" coins")}catch(e){}}}catch(e){}}
setTimeout(v69TopUp,2500);setInterval(v69TopUp,30000);
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV169={topUp:v69TopUp};
