/* ---------- The 1.80 patch letter (ships in v1.80 itself, Cal 11-25: sequential versions) ----------
   The rules: what changed since 1.70, in general terms; no brands, no dates, nothing coming; nothing about the monthly story, its prizes,
   or other surprises; at most 10 lines, one sentence each (Cal 11-26); 700 coins (Cal 11-26). Only for a player who was already playing
   on the day it went out. */
var V212LETTER={id:"patch180",from:"Cal",d:"2026-11-27",subj:"Update 1.80",coins:700,body:'<ul class="wl">'
  +'<li>Tasks can repeat on the days you pick, and tiny chores now pay a little.</li>'
  +'<li>Cleaning tasks can take a before and after photo, side by side.</li>'
  +'<li>Your photos stay clean and private in a gallery on your profile, and the town board shows them six at a time.</li>'
  +'<li>Nothing waits on syncing any more, and the game opens faster.</li>'
  +'<li>The Shop has a new week, with brands three times a week, three pieces in each category per drop, and a weekly mix from every brand.</li>'
  +'<li>The Shop and the Closet sort by category, with an All tab.</li>'
  +'<li>There is a daily login calendar, an inbox with Unread and Read, and notices for new posts and bounties about to end.</li>'
  +'<li>Training pays for every set you finish.</li>'
  +'<li>Dungeon Crawls has a tab of its own.</li>'
  +'<li>Effects live in your profile now, and banners open at level 5.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
INBOXGEN.push(function(){var I=ibState(),join=I.at.welcome||today();return join<=V212LETTER.d?[V212LETTER]:[]});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV212={letter:V212LETTER};
