/* ---------- The 1.60 patch letter (ships on v1.61, as 1.50 did on v1.51) ----------
   The same rules as 29zz_v154.js: what changed since 1.50, in general terms; no brands, no dates, nothing coming; nothing about
   companions or other surprises. 500 coins. Only for a player who was already playing on the day it went out. */
var V69LETTER={id:"patch160",from:"Cal",d:"2026-11-25",subj:"Update 1.60",coins:500,body:'<ul class="wl">'
  +'<li>Your player card sits at the top of the Board now. Tap it anywhere to open your profile, and change its banner there.</li>'
  +'<li>Posting your card to the town board saves that exact outfit, so you can post more than one look.</li>'
  +'<li>Your photos stay private until you choose to post them.</li>'
  +'<li>Mark a task with up to three ! to keep it at the top of your list.</li>'
  +'<li>The Board is tidier. Your level, trial and Daily Quest live in your profile, and a new Goals button shows everything you are working toward.</li>'
  +'<li>The scratch card sits by your mailbox. Rub it to scratch.</li>'
  +'<li>The Shop has a new look. Every brand now takes turns in one row, and the pricier ones cost less than before. If you bought one at the old price, the difference is back in your coins.</li>'
  +'<li>Bounties pay more, and every bounty chore needs a photo.</li>'
  +'</ul><p>500 coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V69LETTER.d?[V69LETTER]:[]});
