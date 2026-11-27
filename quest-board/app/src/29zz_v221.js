/* ---------- The 1.90 patch letter (ships in v1.90 itself, Cal 11-25: sequential versions) ----------
   The rules: what changed since 1.80, in general terms; no brands, no dates, nothing coming; nothing about the monthly story, its prizes,
   or other surprises; at most 10 lines, one sentence each (Cal 11-26); 700 coins (Cal 11-26).
   Written ahead (LEAD, 11-26) and switched off until the app is 1.90 (APPV 1900): it goes to a player who was already playing before the
   day their game first ran 1.90, so someone who starts on 1.90 does not get it. */
var V221LETTER={id:"patch190",from:"Cal",d:"",subj:"Update 1.90",coins:700,body:'<ul class="wl">'
  +'<li>Everyone who crawls with you is an ally now, each with a perk of their own.</li>'
  +'<li>Each ally can crawl twice a day, and they wave when they are back.</li>'
  +'<li>Every dungeon pays a set amount, and its chests show what is still hidden there.</li>'
  +'<li>A dungeon above your level can send an ally home hurt for a few days.</li>'
  +'<li>Hats now sit naturally on every hairstyle.</li>'
  +'<li>Painted banners move, and the banner shop is sorted by style.</li>'
  +'<li>Checkout lists everything you are trying on before you buy.</li>'
  +'<li>Each brand drop shows four pieces in a category, and the next drop shows the others.</li>'
  +'<li>Posted cards keep the banner they were posted with, and deleting a post asks first.</li>'
  +'<li>New places explain themselves the first time you open them.</li>'
  +'</ul><p>Some coins on me. Thanks for playing.</p>'};
var V221FORCE=0;/* tests only, through the hook below */
/* QA: a player who has not opened Crawls yet gets the letter without the four Crawls lines and nothing in their place (no spoilers) */
var V221SHORT=V221LETTER.body.replace(/<li>Everyone who crawls[\s\S]*?for a few days\.<\/li>/,'');
function v221Crawls(){try{return effLvl()>=V210LV&&v210Team().length>0}catch(e){return false}}
function v221On(){try{return V221FORCE||(typeof APPV!=="undefined"&&APPV>=1900)}catch(e){return false}}
function v221Day(){try{if(!v221On())return "";if(!S.v221d){S.v221d=today();persist()}return S.v221d}catch(e){return ""}}
INBOXGEN.push(function(){var d=v221Day();if(!d)return [];var I=ibState(),join=I.at.welcome||today();return join<d?[Object.assign({},V221LETTER,{d:d},v221Crawls()?{}:{body:V221SHORT})]:[]});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV221={letter:V221LETTER,on:v221On,force:function(v){V221FORCE=v?1:0}};
