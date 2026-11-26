/* ---------- The 1.50 patch letter (Cal 11-24: "message update every 10 ships... no spoilers") ----------
   29zz_patch.js holds the rules: what changed, never what is coming, no brands, no dates. Cal 11-24 as well: the big features are
   surprises ("All these features should be discrete and never blurted out obviously"), so this letter names only what a player
   meets on the Board and in the Shop anyway. Nothing about companions. 500 coins, as every 10th-version letter carries (Cal 11-17). */
/* v1.35 (the launch) emptied PATCHES and took its generator out of the inbox, so a letter pushed there never shows. This one brings
   its own generator, with the same rule: only for a player who was already playing on the day it went out. */
var V54LETTER={id:"patch150",from:"Cal",d:"2026-11-24",subj:"Update 1.50",coins:1000,/* Cal 11-25: patch letters pay 1,000 */body:'<ul class="wl">'
  +'<li>Bounties now come as 1, 2 and 3-day cards. Take two at a time, and reroll the ones you do not want.</li>'
  +'<li>The Wheel is gone. Finish 3 tasks and scratch a card instead, once a day.</li>'
  +'<li>The Shop has a new front door. Anything you tap is tried on first, and nothing is bought until you confirm.</li>'
  +'<li>You have a player card. Tap the card icon on the Board.</li>'
  +'<li>Away for a few days? Your first tasks back are worth more.</li>'
  +'<li>The late levels are re-tuned, and the ranks have new names.</li>'
  +'<li>The Closet opens earlier, and you can switch tabs while your save syncs.</li>'
  +'</ul><p>1,000 coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V54LETTER.d?[V54LETTER]:[]});
