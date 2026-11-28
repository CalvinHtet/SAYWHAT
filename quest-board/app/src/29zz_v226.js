/* ---------- The 2.00 patch letter (ships in v2.00 itself) ----------
   Cal 11-27: "make the update patch message a max of 5-6 bullet points. Can be very vague ... so there is less to read". What changed
   since 1.90, in general terms: no brands, no dates or weekdays, nothing coming, nothing about the Vault, the monthly story or other
   surprises; 700 coins. Off until the app is 2.00 (APPV 2000); it goes to a player who was already playing before the day their game
   first ran 2.00. A player without allies gets it without the crawl line and nothing in its place (no spoilers), like the 1.90 one. */
var V226LETTER={id:"patch200",from:"Cal",d:"",subj:"Update 2.00",coins:700,body:'<ul class="wl">'
  +'<li>Lots of new clothes across the brands.</li>'
  +'<li>New brands arrive more often.</li>'
  +'<li>Every room upgrade now adds a little XP.</li>'
  +'<li>Dungeon finds turn up a little more often.</li>'
  +'<li>The daily card is fairer.</li>'
  +'<li>Links in posts open with a tap.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
var V226FORCE=0;/* tests only, through the hook below */
var V226SHORT=V226LETTER.body.replace(/<li>Dungeon finds[^<]*<\/li>/,'');
function v226On(){try{return V226FORCE||(typeof APPV!=="undefined"&&APPV>=2000)}catch(e){return false}}
function v226Day(){try{if(!v226On())return "";if(!S.v226d){S.v226d=today();persist()}return S.v226d}catch(e){return ""}}
INBOXGEN.push(function(){var d=v226Day();if(!d)return [];var I=ibState(),join=I.at.welcome||today();
  return join<d?[Object.assign({},V226LETTER,{d:d},(typeof v221Crawls==="function"&&v221Crawls())?{}:{body:V226SHORT})]:[]});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV226={letter:V226LETTER,short:function(){return V226SHORT},on:v226On,force:function(v){V226FORCE=v?1:0}};
