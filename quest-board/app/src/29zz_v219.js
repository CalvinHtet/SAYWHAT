/* ---------- Cal 2026-11-26: teach every new screen; never spoil what comes later ----------
   Cal: "create tutorials for the dungeon crawl. I want you to create tutorials or just have a splash screen for any new menus that we
   unlock. No one is going to know how to use the dungeon tab if we don't teach them. Same with the garden or restaurant. We need to teach
   them that this is the garden and you'll gain passive income as you start selling more produce. Don't have any text or explanation of
   future upgrades that will spoil the rest of the game such as "Eventually you can open a restaurant" or "once you install sprinklers, you
   will no longer need to water the plants." This ruins the future upgrade surprises. Also make sure any mechanics like watering your
   plants is explained in a short tutorial".
   - A welcome window the first time each of these opens: the Crawls tab, the Vault, the Game Room (the others already had one); the
     Garden's and the Restaurant's are rewritten to teach what they do today (watering, growing, selling; collecting takings).
   - Lines that told of later rooms or upgrades are gone: sprinklers, the Restaurant (from the Garden's upgrades), the Theater's bar and
     what is behind its doors, the IMAX screen, the Patio's pet bed, the Closet's secret door, "what comes next", clothes "once those open",
     "your rooms earn" before any business, the Shop's "upgrades".
   - Each window shows once; "How it works" opens it again where the room has that button, and the Crawls tab's (i). */
try{
  ROOMHELP.garden={k:"New room",t:"The Garden",sub:"Your own beds, right next door. Grow produce and sell it for coins.",pts:[
    ["Water the beds","Plants only grow while the beds are damp. Tap Water the plants in the Garden window. One watering lasts about a day, and rain counts too."],
    ["Grow and sell","Produce builds up as it grows. Tap Sell in the Garden window to turn it into coins."],
    ["Coins while you are away","The more you grow and sell, the more the Garden earns on its own."],
    ["Upgrade it","New beds and tools grow more, and grow it faster."]]};
  ROOMHELP.restaurant={k:"New room",t:"The Restaurant is open",sub:"Your first business. Guests come in, eat and pay, even while you are away.",pts:[
    ["Collect your takings","Coins build up in the room. Tap the coin bubble to collect them. It holds 8 hours, so check in once or twice a day."],
    ["Your quests run the kitchen","Each day it pays out a share of what your quests earned. No quests, no takings."],
    ["Upgrade it","Kitchen gear and staff raise what it earns. Decor is for looks."]]};
  if(ROOMHELP.theater)ROOMHELP.theater.pts=[["Tickets pay you","Ticket money builds up in the room. Collect it like the others."],["Grow the lobby","Upgrades bring in more guests and more ticket money."]];
  if(ROOMHELP.auditorium)ROOMHELP.auditorium.pts=[["Make it a real cinema","Upgrade the seats, the projector, the sound, the walls and the floors."],["Collect your coins","Takings build up in the room. Tap the coin bubble to collect them."]];
  if(ROOMHELP.loft)ROOMHELP.loft.pts=[["Start with your Bedroom","Tap it to see what you can add."],["Make it yours","Every upgrade changes how the room looks."]];
  ROOMHELP.crawls={k:"New tab",t:"Dungeon Crawls",sub:"Your team lives in the lounge. Send them into dungeons for coins and rare finds.",pts:[
    ["Send someone","Tap Crawl on a dungeon and pick who goes. Each teammate has one perk, and each can go twice a day."],
    ["They go on their own","A crawl takes a while. Get on with your day; they come back by themselves."],
    ["Claim","When someone is back, tap Claim for the coins and anything they found."],
    ["Chests","Each lit chest is something rare still hidden in that dungeon. Bring it home and the chest goes dark."],
    ["Mind the danger","A dungeon above your level can send someone home hurt for a few days."]]};
  ROOMHELP.vault={k:"New",t:"The Vault",sub:"Every Sunday morning, a mix from every brand: three pieces in each category, on sale all week.",pts:[
    ["One week only","When the week ends, the Vault restocks with a new mix."],["Try it on","Try pieces on your character first, then check out."]]};
  /* the Game Room's own window */
  Object.keys(ROOMDEF).forEach(function(k){var d=ROOMDEF[k];if(d&&d.name==="Game Room"&&!ROOMHELP[k])ROOMHELP[k]={k:"New room",t:"The Game Room is open",sub:"Games, snacks and a couch. Friends drop by to hang out.",pts:[["Make it fun","Upgrades add games and places to sit."],["Rest up","A good room to unwind in after a day of quests."]]}});
}catch(e){}
/* ---- the spoiler lines, fixed where they are written ---- */
function v219Fix(s){return typeof s!=="string"?s:s
  .replace("Lettuce, carrots and a new salad on the menu.","Lettuce and carrots, row after row.")
  .replace("Kitchen scraps feed next month's dinner.","Scraps turn into rich soil for the beds.")
  .replace("Someone to look after it all, so you never have to.","Someone to look after the beds with you.")
  .replace(" A Pet Shop creature gets its own bed out here.","").replace("A Pet Shop creature gets its own bed out here.","A warm spot to sit out by the fire.")
  .replace(" There may be a secret door.","")
  .replace("Coins build your home and buy clothes, once those open. For now, finish a few tasks.","Coins pay for everything you build. Finish a few tasks to get started.")
  .replace("Later you add snacks and a bar.","Add snacks and more as it grows.")
  .replace("The fuller the bar, the more your rooms earn today.","The fuller the bar, the more you earn today.")
  .replace("New brands drop Mondays and Thursdays","New brands drop three times a week")
  .replace(" plus themes and upgrades","").replace(", plus themes and upgrades","")}
try{Object.keys(ADDONS).forEach(function(r){(ADDONS[r]||[]).forEach(function(a){for(var i=0;i<a.length;i++)if(typeof a[i]==="string")a[i]=v219Fix(a[i])})})}catch(e){}
try{Object.keys(ROOMDEF).forEach(function(k){var d=ROOMDEF[k];if(!d)return;d.desc=v219Fix(d.desc);if(d.help&&d.help.pts)d.help.pts.forEach(function(p){p[1]=v219Fix(p[1])});if(ROOMHELP[k]&&ROOMHELP[k].pts)ROOMHELP[k].pts=ROOMHELP[k].pts.filter(function(p){return p[1]!==""}).map(function(p){return [p[0],v219Fix(p[1])]})})}catch(e){}
try{Object.keys(ROOMT).forEach(function(k){if(ROOMT[k]&&typeof ROOMT[k].desc==="string")ROOMT[k].desc=v219Fix(ROOMT[k].desc)})}catch(e){}
try{TOURS.forEach(function(T){(T.steps||[]).forEach(function(s){if(typeof s.x==="string")s.x=v219Fix(s.x)})})}catch(e){}
try{Object.keys(AREALINE).forEach(function(k){AREALINE[k]=v219Fix(AREALINE[k])})}catch(e){}
try{Object.keys(QBINFO).forEach(function(k){var v=QBINFO[k];if(v&&Array.isArray(v[1]))v[1]=v[1].map(v219Fix)})}catch(e){}
try{var v219Th=thNote;thNote=function(){var h=v219Th.apply(this,arguments);return typeof h==="string"?h.replace(/Behind these doors: not yet\.?/,""):h}}catch(e){}
/* ---- the first-time windows for the Crawls tab and the Vault ---- */
setInterval(function(){try{if(!S||!S.created||!loaded)return;if(document.querySelector("#layer .modal,#layer .qb-held,#qbtour"))return;if(typeof TOUR!=="undefined"&&TOUR&&TOUR.id)return;
    if(view==="away"&&!(S.seen&&S.seen.crawls))roomSplash("crawls");
    else if(view==="shop"&&document.querySelector(".v201v")&&!(S.seen&&S.seen.vault))roomSplash("vault")}catch(e){}},1200);
/* the Crawls (i) says the same as the window */
try{QBINFO.crawl=["Dungeon Crawls",ROOMHELP.crawls.pts.map(function(p){return p[0]+": "+p[1]})]}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV219={fix:v219Fix,help:ROOMHELP};
