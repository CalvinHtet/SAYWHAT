/* ---------- The 1.50 patch letter (Cal 11-24: "message update every 10 ships... no spoilers") ----------
   29zz_patch.js holds the rules: what changed, never what is coming, no brands, no dates. Cal 11-24 as well: the big features are
   surprises ("All these features should be discrete and never blurted out obviously"), so this letter names only what a player
   meets on the Board and in the Shop anyway. Nothing about companions. 500 coins, as every 10th-version letter carries (Cal 11-17). */
/* v1.35 (the launch) emptied PATCHES and took its generator out of the inbox, so a letter pushed there never shows. This one brings
   its own generator, with the same rule: only for a player who was already playing on the day it went out. */
var V54LETTER={id:"patch150",from:"Cal",d:"2026-11-24",subj:"Update 1.50",coins:700,/* Cal 11-26: patch letters pay 700 from now on (were 1,000; a letter already claimed keeps what it paid) */body:'<ul class="wl">'/* Cal 11-26: at most 10 lines, one sentence each, like things grouped */
  +'<li>Bounties come as 1, 2 and 3-day cards: take two at a time and reroll the rest.</li>'
  +'<li>The Wheel is gone: finish 3 tasks a day and scratch a card instead.</li>'
  +'<li>The Shop has a new front door, and everything is tried on before you confirm a buy.</li>'
  +'<li>You have a player card, one tap away on the Board.</li>'
  +'<li>Back after a few days away, your first tasks are worth more.</li>'
  +'<li>The late levels are re-tuned and the ranks have new names.</li>'
  +'<li>The Closet opens earlier, and tabs still work while your save syncs.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V54LETTER.d?[V54LETTER]:[]});
