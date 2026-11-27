/* ---------- Cal 2026-11-27: the Mon/Wed/Fri brand drops start now ----------
   Cal (Friday 11-27): "Today is Friday, so shouldn't there have been a new brand drop? I asked for brand drops on Monday, Wednesday, and
   Friday for clothing brands. Tuesday and Thursday are for pet shop brands. And Sunday to Sunday, all week, we'll have a rotating vault."
   The one rotation (29zz_v172.js, days Mon/Wed/Fri from 29zz_v201.js) was set to begin on Mon 11-30, so this week still ran the old
   Monday/Thursday calendar. It begins today, Fri 11-27 at 6 am, instead: today is its first drop, then Mon, Wed and Fri. Nothing from
   before today moves. Pet clothes (Tue/Thu/Sat from Sat 11-28) and the Sunday Vault (from Sun 11-29) are as they were. */
try{V72.day="2026-11-27";V72C=null}catch(e){}
/* Cal 11-27 (later): "can you move solvberg out of rotation and put in a new brand drop?" SØLVBERG leaves today and HANGANG (the
   Street brand out the longest, since 11-19) drops in its place, dated today, so it stays a full week like any drop (it leaves when the
   third drop after it comes, Fri 12-04). SØLVBERG is held from today: no drops and no Vault until Cal brings it back. */
/* Cal 11-27: "for the relics, let's do 15% chance to get a relic from a dungeon crawl" (was 12%; Hero's Lair upgrades and perks still add) */
try{ECON.crawlRare=.15}catch(e){}
var V224SWAP={day:"2026-11-27",out:"sv",inn:"hanga"};
try{DROPS.hold.push({from:"2026-11-27",until:"",ids:["sv"]})}catch(e){}
var v224Run=v72Run;v72Run=function(k){v224Run(0);var C=V72C;
  if(C&&!C.v224){C.v224=1;var s=C.snap[0],W=V224SWAP;
    if(s&&s.day===W.day&&!s.live.some(function(b){return b.id===W.inn})){var i=-1;s.live.forEach(function(b,j){if(b.id===W.out)i=j});
      if(i>=0){s.live.splice(i,1);s.live.push({id:W.inn,start:W.day});s.left[W.out]=W.day;s.since[W.out]=0;delete s.left[W.inn];delete s.since[W.inn]}}}
  return v224Run(k)};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV224={chance:function(){return crawlChance()},ba:function(n){return v82Is({name:n,cl:"chores"})},live:function(n){var d=dropFloor(n==null?dropNow():n,flGet("street"));return {live:(d.live||[]).map(function(b){return b.id+"@"+b.start}),soon:(d.soon||[]).map(function(b){return b.id+"@"+b.start})}},cfg:V72,brands:function(){var t=dropYmd(dropNow());return BRANDS.map(function(b){return b.id+" "+b.name+" "+brandFloor(b.id)+(zxHeld(b.id,t)?" HELD":"")+" n="+SHOP.filter(function(it){return it[6]&&it[6].b===b.id&&!it[6].cut}).length})}};
