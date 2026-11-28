/* ---------- The 2.10 patch letter (ships in v2.10 itself) ----------
   Cal 11-27: "a max of 5-6 bullet points. Can be very vague ... so there is less to read". What changed since 2.00, in general terms:
   no brands, no dates or weekdays, nothing coming, no "Vault", nothing about the story or other surprises; 700 coins. Off until the app
   is 2.10 (APPV 2100); it goes to a player who was already playing before the day their game first ran 2.10. Nothing in it is about
   crawls, so every player gets the same five lines. */
var V228LETTER={id:"patch210",from:"Cal",d:"",subj:"Update 2.10",coins:700,body:'<ul class="wl">'
  +'<li>Even more new clothes across the brands.</li>'
  +'<li>A few older pieces left the Shop. You keep anything you own.</li>'
  +'<li>Scarves and stoles now sit over your sleeves.</li>'
  +'<li>The weekly picks stay the same all week.</li>'
  +'<li>Fixes to how some tops and hats look.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
var V228FORCE=0;/* tests only, through the hook below */
function v228On(){try{return V228FORCE||(typeof APPV!=="undefined"&&APPV>=2100)}catch(e){return false}}
function v228Day(){try{if(!v228On())return "";if(!S.v228d){S.v228d=today();persist()}return S.v228d}catch(e){return ""}}
INBOXGEN.push(function(){var d=v228Day();if(!d)return [];var I=ibState(),join=I.at.welcome||today();return join<d?[Object.assign({},V228LETTER,{d:d})]:[]});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV228={letter:V228LETTER,on:v228On,force:function(v){V228FORCE=v?1:0}};
