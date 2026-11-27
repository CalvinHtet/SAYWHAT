/* ---------- The 1.70 patch letter (ships on v1.71) ----------
   The same rules as 29zz_v154.js and 29zz_v169.js: what changed since 1.60, in general terms; no brands, no dates, nothing coming; nothing
   about the monthly story, its prizes, companions or other surprises. 1,000 coins (Cal 11-25). Only for a player who was already playing
   on the day it went out. */
var V80LETTER={id:"patch170",from:"Cal",d:"2026-11-25",subj:"Update 1.70",coins:700,/* Cal 11-26: 700 from now on */body:'<ul class="wl">'/* Cal 11-26: at most 10 lines, one sentence each, like things grouped */
  +'<li>The Shop keeps three brands at a time, and the pricier ones come by less often and shine gold.</li>'
  +'<li>Anything you only tried on comes off when you leave the Shop.</li>'
  +'<li>Tasks, goals, chests and level-ups pay more coins, and the scratch card pays up to 2,000.</li>'
  +'<li>A full workout pays 100 XP and 500 coins and counts toward your four a week.</li>'
  +'<li>A level-up tells you what it unlocked.</li>'
  +'<li>Banners move a little now, and your next ones are picked just for you.</li>'
  +'<li>The city follows the seasons.</li>'
  +'<li>Headphones, wings and sunglasses sit properly.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V80LETTER.d?[V80LETTER]:[]});
