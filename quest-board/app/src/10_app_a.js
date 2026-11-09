
(function(){
var MAXL=100, C=2*Math.PI*54;
var GATES=[5,10,20,30,40,50,65,80,100];
var TIER_RANK=[0,1,2,2,3,3,4,4,5,5];
var STATS=[["creativity","Creativity"],["discipline","Discipline"],["fitness","Fitness"],["productivity","Productivity"],["social","Social Balance"]];
var CLUSTERS=[["out","Outside run"],["reset","Reset"],["home","Home sweep"],["body","Body"],["admin","Admin and day job"],["create","Creative block"],["social","People"],["boss","Boss"]];
var REWARDS=[
 /* Cal (2026-11-08): "more universal ... prizes that would excite my friends", then "a bit more unique and stylized" and "give people the
    option to edit their own rewards". Loot in the game's own voice, each matched to its painting (ART rew_<level>). No brands, no set
    budgets. Keyed by level, so what a save has claimed still holds. A player's own wording lives in S.rwEdit (rwT, rwD). */
 [5,"Extra Life","One guilt-free night of whatever you play or watch. Nobody is keeping score."],
 [10,"Cart Liberation","That small thing you keep almost buying. Free it."],
 [15,"Contraband Sweets","The dessert you always talk yourself out of. Today it's legal."],
 [20,"Feast of Allies","Your favorite food, your favorite people. Order what you actually want."],
 [25,"The Hammock Protocol","One afternoon, zero tasks. The list cannot find you."],
 [30,"Side Quest: Unknown Map","A day somewhere you have never been. Bring a party member."],
 [35,"Total Recharge","Massage, soak, or a really good haircut. Phone stays in your inventory."],
 [40,"The White Whale","The bigger thing you keep talking yourself out of. Hunt it down."],
 [45,"Front Row Pass","Concert, game, comedy, theater. Go loud with someone who cares."],
 [50,"Portal Out of Town","One night anywhere that isn't home. Pack the bag first, think later."],
 /* 55, 65, 70, 80, 85, 90 and 95: so the levels past 50 are never more than five apart (2026-11-09, drafts for Cal to reword) */
 [55,"Gear Check","Replace the one worn-out thing you use every day. Shoes, headphones, the pan with the scratched bottom."],
 [60,"The Stopped Clock","A whole day that's only yours. Sleep in. Everyone else can wait."],
 [65,"Field Trip","A day out with no errands attached. Pick a direction, not a plan."],
 [70,"Chef's Table","Dinner somewhere you would normally save for a special occasion. This is the occasion."],
 [75,"The Someday Scroll","The trip or first you keep saying someday about. Today is someday. Book it."],
 [80,"Hall of Fame","Frame something from this run: a photo, a ticket, a page. Hang it where you will see it."],
 [85,"The Upgrade","Trade up one thing you use every week for the version you actually wanted."],
 [90,"First Fragment","Something old and strange for the shelf: a print, a record, a find from a market stall."],
 [95,"Victory Lap","Plan the celebration for 100 now. Book it and invite the party."],
 [100,"Legend's Wish","You reached the top. Name the big one, tell someone, and go do it."]
];
/* a reward as this player worded it, and its rarity by level */
function rwEd(r){return (S.rwEdit&&S.rwEdit[r[0]])||null}
function rwT(r){var e=rwEd(r);return (e&&e.t)||r[1]}
function rwD(r){var e=rwEd(r);return e&&e.d!=null?e.d:r[2]}
function rwTier(r){return r[0]>=60?"Legendary":r[0]>=35?"Epic":r[0]>=20?"Rare":"Common"}
var RANKS=[
 {l:"E",n:"Awakened",f:["Quests, XP, stats, and rewards"]},
 {l:"D",n:"Bass Hunter",f:["Combo meter: chain quests inside 45 minutes for up to x1.5 XP","Stat radar replaces the bars","HUD interface"]},
 {l:"C",n:"Drop Knight",f:["Daily bounty: one big quest pays double each day","Ember forge interface"]},
 {l:"B",n:"Headliner",f:["Stat titles: earn a new title at 5, 15, and 30 in each stat","Crimson stage interface"]},
 {l:"A",n:"Sovereign",f:["Raid timer: clear the Now quest in 25 minutes for +25% XP","Gold regalia interface"]},
 {l:"S",n:"Shadow Monarch",f:["All XP +10%, permanently","Monarch's domain interface"]}
];
var FX=[[2,"grid","Grid overlay"],[3,"burst","Completion bursts"],[4,"pulse","Neon edge pulse"],[6,"brackets","HUD brackets"],[7,"sweep","Scan sweep"],[8,"orbs","Drifting orbs"],[9,"ringglow","Ring afterglow"],[10,"embers","Ember particles"],[11,"chipglow","Chip glow"],[12,"aurora","Aurora sky"],[13,"holo","Holo shimmer"],[14,"shimmer","Stat bar shimmer"],[16,"halo","Orbiting halo"],[18,"glowtext","Glowing headlines"],[20,"flares","Corner flares"],[24,"stars","Starlight"],[28,"vignette","Cinematic vignette"],[34,"edgeglow","Screen edge glow"],[50,"gilded","Gilded headlines"]];
var TITLES={creativity:["Sketcher","Sound Smith","Dreamweaver"],discipline:["Early Riser","Iron Will","Unbreakable"],fitness:["Sprinter","Iron Body","Titan"],productivity:["Operator","Taskmaster","Architect"],social:["Good Friend","Anchor","Heart of the Party"]};
var DEFAULTS=[
 ["Feed dogs",10,"discipline","out","Under 15 minutes, daily routine","daily"],["Walk dogs",25,"fitness","out","About 30 minutes, physical","daily"],["Unload car",10,"productivity","out","Quick, no thinking","once"],
 ["Make bed",10,"discipline","reset","60 seconds, sets the tone","daily"],["Brush teeth",10,"discipline","reset","Daily habit","daily"],["Shower",10,"discipline","reset","Daily habit","daily"],
 ["Take out trash",10,"productivity","home","Quick chore, five minutes","once"],["Fold laundry",10,"productivity","home","Quick and mindless","once"],["Measure carpet",10,"productivity","home","Tape measure, two minutes","once"],["Wash dishes",10,"productivity","home","Short chore","daily"],["Finish laundry",25,"productivity","home","Several steps over time","once"],["Clean living room",25,"productivity","home","Around 30 to 45 minutes","once"],["Put together couch",25,"productivity","home","Hands-on assembly","once"],
 ["Workout",40,"fitness","body","4 times a week, live photo proof","weekly4"],
 ["Clean studio",25,"creativity","create","Resets your creative space","once"],["Edit car 360 vid",25,"creativity","create","Focused edit, one clip","once"],["Edit EP 3",50,"creativity","create","Full episode edit, 1 to 3 hours","once"],["Film EP 4",50,"creativity","create","Setup, shoot, and teardown","once"],["Post 5 things on trial reels",25,"productivity","create","Repetitive posting work","daily"],
 ["Finish artist management platform",75,"productivity","boss","Open-ended build, multi-hour","once"]
];
var CHESTS={3:50,7:100,14:200,30:400,60:800,100:1500};
var BADGES=[["class","Chosen Path","Choose a class"],["spec","Fork in the Road","Choose a specialization"],["asc","Ascended","Clear all 9 advancements"],["first","First Blood","Complete your first quest"],["ten","Ten Down","Clear 10 quests"],["hundred","Centurion","Clear 100 quests"],["s3","On a Roll","3-day streak"],["s7","Locked In","7-day streak"],["s30","Unbreakable","30-day streak"],["early","Early Bird","Clear a quest before 7 AM"],["crit","Critical Hit","Land a critical hit"],["ver10","Honest Hunter","10 verified quests"],["gate","Gate Breaker","Pass a job advancement"],["spend","Retail Therapy","Buy your first shop item"],["decor","Interior Designer","Own 5 shop items"],["coins500","Coin Hoarder","Earn 500 coins"],["l10","Double Digits","Reach level 10"],["l25","Quarter Century","Reach level 25"],["s14","Fortnight","14-day streak"]];
var CREW={
 mochi:{name:"Mochi",role:"Pet Wrangler",a:{skin:"#f2c9a0",hair:"#8a5a3c",hs:"bun",outfit:"#6cb6ff",acc:"scarf",pop:"#ffc857"},buff:{cl:"out",pct:10,text:"Outside quests +10% XP"}},
 juno:{name:"Juno",role:"Bartender",a:{skin:"#c68a5e",hair:"#1a1426",hs:"bob",outfit:"#a78bfa",acc:"visor",pop:"#ff3d81"},buff:{special:"streakcap",text:"Streak bonus cap +5%"}},
 rook:{name:"Rook",role:"Trainer",a:{skin:"#8d5a3b",hair:"#1a1426",hs:"spike",outfit:"#ff3d81",acc:"goggles",pop:"#4dffc3"},buff:{stat:"fitness",pct:10,text:"Fitness quests +10% XP"}},
 nova:{name:"Nova",role:"Producer",a:{skin:"#f2c9a0",hair:"#ff3d81",hs:"long",outfit:"#2a2650",acc:"headphones",pop:"#8b5cff"},buff:{stat:"creativity",pct:10,text:"Creativity quests +10% XP"}},
 bleep:{name:"Bleep",role:"Cleaning Bot",a:{skin:"#b8c4d6",hair:"#b8c4d6",hs:"none",outfit:"#4dffc3",acc:"antenna",pop:"#ffc857"},buff:{cl:"home",pct:10,text:"Home quests +10% XP"}},
 vex:{name:"Vex",role:"Hacker",a:{skin:"#e0b08a",hair:"#4dffc3",hs:"cap",outfit:"#2a2650",acc:"visor",pop:"#4dffc3"},buff:{cl:"admin",pct:10,text:"Admin quests +10% XP"}},
 ko:{name:"Sensei Ko",role:"Discipline Master",a:{skin:"#e8bf98",hair:"#e9e6f5",hs:"bun",outfit:"#ff8a3d",acc:"scarf",pop:"#ff3d3d"},buff:{stat:"discipline",pct:10,text:"Discipline quests +10% XP"}},
 echo:{name:"Echo",role:"Scribe",a:{skin:"#d9a67c",hair:"#6b46d9",hs:"long",outfit:"#6cb6ff",acc:"goggles",pop:"#ffc857"},buff:{stat:"social",pct:10,text:"Social quests +10% XP"}},
 brisa:{name:"Brisa",role:"Quartermaster",a:{skin:"#a86f4c",hair:"#ff8a3d",hs:"bob",outfit:"#3b82f6",acc:"scarf",pop:"#ffd27a"},buff:{special:"crit",text:"Critical hit chance 10% to 15%"}},
 dax:{name:"Dax",role:"Stunt Pilot",a:{skin:"#f2c9a0",hair:"#ffc857",hs:"spike",outfit:"#ff2e4d",acc:"goggles",pop:"#22d3ee"},buff:{cl:"boss",pct:15,text:"Boss quests +15% XP"}},
 luna:{name:"Luna",role:"Archivist",a:{skin:"#f0d4b8",hair:"#b388ff",hs:"long",outfit:"#170c2c",acc:"crown",pop:"#e9d5ff"},buff:{special:"verify",text:"Verified bonus +5%"}}
};
["juno","nova","echo","brisa","luna","mochi"].forEach(function(k){if(CREW[k])CREW[k].a.sex="f"});
var UNLOCKS=[
 {lv:2,room:{kind:"bunk",name:"Bunk Room"},line:"Your hideout exists. It starts with a bed."},
 {lv:3,crew:"mochi",line:"Mochi heard you walk dogs for a living."},
 {lv:4,room:{kind:"bar",name:"Neon Bar"},crew:"juno",line:"The bar is open. Juno keeps your streak glowing."},
 {lv:5,room:{kind:"command",name:"Command Deck"},crew:"rook",line:"The crew has a deck now. Rook drags you to the gym."},
 {lv:6,crew:"nova",line:"Nova plugs in and the hideout finally has a soundtrack."},
 {lv:7,room:{kind:"booth",name:"Studio Booth"},line:"A real booth. Mic stand included."},
 {lv:8,crew:"bleep",line:"Bleep rolls in and starts tidying."},
 {lv:9,room:{kind:"arcade",name:"Arcade Nook",buff:{special:"combo",text:"Combo window 45 to 55 min"}},line:"Neon cabinets that stretch your combos."},
 {lv:10,crew:"vex",line:"Vex takes over your inbox."},
 {lv:11,room:{kind:"training",name:"Training Bay"},line:"A full rack of free weights."},
 {lv:12,crew:"ko",line:"Sensei Ko arrives and sets the morning routine."},
 {lv:13,room:{kind:"garden",name:"Rooftop Garden"},line:"Something green growing on the roof."},
 {lv:14,crew:"echo",line:"Echo keeps your people close."},
 {lv:15,room:{kind:"forge",name:"The Forge"},crew:"brisa",line:"The forge lights up. Brisa sharpens your crits."},
 {lv:16,room:{kind:"observatory",name:"Observatory"},line:"A dome to watch the sky from."},
 {lv:17,crew:"dax",line:"Dax flies in for the big fights."},
 {lv:18,room:{kind:"vault",name:"The Vault"},line:"Locked tight. Your trophies live here."},
 {lv:19,crew:"luna",line:"Luna logs every proof you send."},
 {lv:20,room:{kind:"skyship",name:"Skyship Deck",buff:{special:"all",pct:3,text:"Everything +3% XP"}},line:"The hideout lifts off."}
];
(function(){
 var N=["Tilt","Sable","Orion","Wren","Mako","Jett","Ivy","Rune","Cosmo","Dune","Fable","Nyx","Onyx","Poe","Rex","Sol","Vesper","Yuki","Zed","Atlas"];
 var R=["Scout","Medic","Mechanic","Chef","Navigator","Gunner","Courier","Tailor","Pilot","Cartographer","Archer","Diplomat","Smith","Bard","Sniper","Alchemist","Ranger","Tinkerer","Oracle","Warden"];
 var RN=["Sky Lounge","Sound Cave","Glasshouse","Map Room","Mess Hall","Observation Deck","Chapel of Static","Tea Room","War Table","Dream Lab","Ink Studio","Cold Storage","Tower Clock","Gallery","Night Market","Aquarium","Rooftop Cinema","Archive Stacks","Throne Hall"];
 var SK=["#f2c9a0","#c68a5e","#8d5a3b","#e0b08a","#a86f4c","#f0d4b8","#d9a67c"];
 var HR=["#1a1426","#8a5a3c","#ff3d81","#4dffc3","#ffc857","#b388ff","#e9e6f5","#ff8a3d"];
 var HS=["spike","bob","bun","cap","long"], AC=["headphones","visor","scarf","goggles","crown","antenna"];
 var OU=["#6cb6ff","#a78bfa","#ff3d81","#2a2650","#4dffc3","#ff8a3d","#3b82f6","#ff2e4d"];
 var BUF=[["stat","creativity","Creativity"],["stat","discipline","Discipline"],["stat","fitness","Fitness"],["stat","productivity","Productivity"],["stat","social","Social"],["cl","out","Outside"],["cl","reset","Reset"],["cl","home","Home"],["cl","body","Body"],["cl","admin","Admin"],["cl","create","Creative"],["cl","boss","Boss"]];
 var ci=0, ri2=0, L, b, id, bf;
 for(L=22;L<=98;L+=2){
  if(L%4===2){
   id="g"+ci; b=BUF[ci%12]; bf={pct:5,text:b[2]+" quests +5% XP"}; bf[b[0]]=b[1];
   CREW[id]={name:N[ci],role:R[ci],a:{skin:SK[(ci*3)%7],hair:HR[(ci*5)%8],hs:HS[ci%5],outfit:OU[(ci*3)%8],acc:AC[ci%6],pop:HR[(ci*3+1)%8]},buff:bf};
   UNLOCKS.push({lv:L,crew:id,line:N[ci]+" signs on as your "+R[ci].toLowerCase()+"."});
   ci++;
  }else{
   var rm={kind:"wing"+L,name:RN[ri2]};
   if(ri2%3===0)rm.buff={special:"all",pct:1,text:"Everything +1% XP"};
   UNLOCKS.push({lv:L,room:rm,line:"A new wing of the hideout opens: "+RN[ri2]+"."});
   ri2++;
  }
 }
})();
UNLOCKS.forEach(function(u){if(u.lv>=2&&u.lv<22)u.lv=u.lv*2+1});
var RELICS=["Bass Crystal","Neon Shard","Vinyl Fragment","Ember Core","Moon Coin","Echo Prism","Rift Key","Glitch Gem","Star Token","Pulse Orb","Drop Relic","Halo Charm"];
var FXD={grid:"A faint tech grid fades in behind everything.",burst:"Tap a quest and sparks fly.",pulse:"Your cards breathe with a neon edge.",brackets:"HUD corner brackets lock onto every panel.",sweep:"A scan line sweeps across your status panel.",orbs:"Glowing orbs drift across the background.",ringglow:"Your level ring gets a bright afterglow.",embers:"Embers float up the screen.",chipglow:"XP chips glow gold.",aurora:"An aurora ribbon lights the sky.",holo:"Your Now card gets a holographic shimmer.",shimmer:"Stat bars shimmer.",halo:"A halo orbits your level ring.",glowtext:"Headlines glow.",flares:"Panel corners flare with light.",stars:"Faint stars twinkle in the gaps behind your panels.",vignette:"The edges of your screen fall into shadow.",edgeglow:"Your screen edge glows in your accent color.",gilded:"Headlines turn to moving gold."};
function unlocksFor(L){
  /* The old hideout's crew and vault relics went with the lounge (v34); the team, the story and the Relics tab replaced them,
     so a level-up no longer announces them. */
  return null;
  if(L<2)return null;
  var u=UNLOCKS.filter(function(x){return x.lv===L})[0];
  if(u){if(u.room&&!u.crew)return {lv:L,relic:RELICS[L%12],line:"Something old and strange turned up in the vault."};if(u.room)return {lv:L,crew:u.crew,line:u.line};return u}
  return {lv:L,relic:RELICS[L%12],line:"Something old and strange turned up in the vault."};
}
function activeBuffs(){
  var lv=effLvl(),o=[];
  UNLOCKS.forEach(function(u){if(u.lv<=lv&&S.base&&hasRoom("lounge")){
    if(u.crew&&CREW[u.crew].buff)o.push({who:CREW[u.crew].name,b:CREW[u.crew].buff,crew:true});
    if(u.room&&u.room.buff)o.push({who:u.room.name,b:u.room.buff});
  }});
  if(S.cls&&CLASSES[S.cls])o.push({who:CLASSES[S.cls].name,b:CLASSES[S.cls].perk});
  if(S.spec&&SPECS[S.spec])o.push({who:SPECS[S.spec].name,b:SPECS[S.spec].perk});
  var oo=oathOf(); if(oo)o.push({who:oo.name,b:oo.perk});
  if(S.base)o=o.concat(baseBuffs());o=o.concat(coachBuffs());try{o=o.concat(socialBuffs())}catch(e){}
  SHOP.forEach(function(it){if(it[1]==="buff"&&S.owned&&S.owned[it[0]]){var e=it[6];o.push({who:it[2],b:e.k==="xp"?{special:"all",pct:e.v,text:it[5]}:e.k==="coin"?{special:"coin",pct:e.v,text:it[5]}:{special:"up_"+e.k,text:it[5]}})}});
  if(S.dng&&S.dng.npcs&&typeof DNPC!=="undefined")DNPC.forEach(function(n){if(S.dng.npcs[n.id])o.push({who:n.name,b:n.buff})});
  return o;
}
function hasSpecial(k){return activeBuffs().some(function(x){return x.b.special===k})}
function specialPct(k){return activeBuffs().reduce(function(a,x){return a+(x.b.special===k?(x.b.pct||0):0)},0)}
function streakCap(){return (hasSpecial("streakcap")?.35:.30)+(S.cls==="vanguard"?.10:0)+(S.owned&&S.owned.bf_streak?.05:0)}
function maxFreeze(){return 3+(hasSpecial("freeze")?1:0)+(S.owned&&S.owned.bf_freeze?1:0)}/* 3 (was 2): Cal, 2026-11-09 streak repair */
function crewPct(q){
  var t=0;
  activeBuffs().forEach(function(x){
    var b=x.b, f=(x.crew&&S.cls==="tamer")?1.5:1;
    if(b.special==="all")t+=b.pct;
    else if(b.pct&&((b.stat&&b.stat===q.stat)||(b.cl&&b.cl===q.cl)))t+=b.pct*f;
  });
  return Math.round(Math.min(t,50));
}
function wingSvg(seed){
 var x=seed*9301+49297, r=function(){x=(x*9301+49297)%233280;return x/233280};
 var s='<svg class="room" viewBox="0 0 120 72" width="100%" aria-hidden="true"><rect width="120" height="72" fill="var(--surface)"/><rect y="58" width="120" height="14" fill="var(--line)"/>';
 var cx=4, w, h, wy, wx;
 while(cx<108){
  w=12+Math.round(r()*14); h=20+Math.round(r()*30);
  s+='<rect x="'+cx+'" y="'+(58-h)+'" width="'+w+'" height="'+h+'" fill="var(--surface2)" stroke="var(--line)"/>';
  for(wy=58-h+5;wy<54;wy+=8)for(wx=cx+3;wx<cx+w-3;wx+=6)if(r()>.45)s+='<rect x="'+wx+'" y="'+wy+'" width="3" height="3" fill="'+(r()>.5?"var(--gold)":"var(--accent)")+'" opacity=".85"/>';
  cx+=w+3;
 }
 s+='<rect x="'+(10+Math.round(r()*70))+'" y="8" width="30" height="5" rx="2.5" fill="var(--accent)" class="flick"/>';
 return s+'</svg>';
}
function roomSvg(k){
  if(String(k).indexOf("wing")===0)return wingSvg(+String(k).slice(4));
  var b='<svg class="room" viewBox="0 0 120 72" width="100%" aria-hidden="true"><rect width="120" height="72" fill="var(--surface)"/><rect y="56" width="120" height="16" fill="var(--line)"/>';
  var p={
   bunk:'<rect x="10" y="36" width="52" height="20" rx="4" fill="var(--accent2)" opacity=".8"/><rect x="12" y="30" width="16" height="10" rx="4" fill="var(--fg)" opacity=".85"/><circle cx="92" cy="22" r="10" fill="var(--gold)" opacity=".35"/><rect x="90" y="30" width="4" height="26" fill="var(--muted)"/>',
   bar:'<rect x="14" y="10" width="64" height="6" rx="3" fill="var(--accent)" class="flick"/><rect x="10" y="26" width="100" height="3" fill="var(--line)"/><rect x="18" y="16" width="5" height="10" rx="2" fill="var(--done)"/><rect x="30" y="14" width="5" height="12" rx="2" fill="var(--gold)"/><rect x="42" y="16" width="5" height="10" rx="2" fill="var(--accent2)"/><rect x="6" y="42" width="108" height="14" rx="3" fill="var(--accent)" opacity=".85"/>',
   command:'<rect x="14" y="8" width="92" height="32" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/><polyline points="20,32 38,22 52,28 70,14 88,24 100,16" fill="none" stroke="var(--done)" stroke-width="2"/><rect x="26" y="44" width="22" height="12" rx="4" fill="var(--accent2)"/><rect x="72" y="44" width="22" height="12" rx="4" fill="var(--accent2)"/>',
   booth:'<rect x="10" y="8" width="100" height="26" rx="4" fill="var(--bg)" stroke="var(--line)"/><g class="eq"><rect x="24" y="14" width="6" height="14" fill="var(--accent)"/><rect x="38" y="14" width="6" height="14" fill="var(--done)"/><rect x="52" y="14" width="6" height="14" fill="var(--gold)"/><rect x="66" y="14" width="6" height="14" fill="var(--accent2)"/><rect x="80" y="14" width="6" height="14" fill="var(--accent)"/></g><rect x="14" y="40" width="92" height="16" rx="3" fill="var(--bg)" stroke="var(--accent)"/><circle cx="30" cy="48" r="3" fill="var(--gold)"/><circle cx="46" cy="48" r="3" fill="var(--done)"/><circle cx="62" cy="48" r="3" fill="var(--accent)"/><circle cx="78" cy="48" r="3" fill="var(--accent2)"/>',
   arcade:'<rect x="18" y="12" width="30" height="44" rx="4" fill="var(--accent2)"/><rect x="22" y="16" width="22" height="14" fill="var(--bg)"/><rect x="72" y="12" width="30" height="44" rx="4" fill="var(--accent)"/><rect x="76" y="16" width="22" height="14" fill="var(--bg)"/><circle cx="33" cy="42" r="3" fill="var(--gold)"/><circle cx="87" cy="42" r="3" fill="var(--done)"/>',
   training:'<rect x="14" y="40" width="92" height="4" fill="var(--muted)"/><rect x="18" y="32" width="6" height="20" rx="2" fill="var(--accent)"/><rect x="96" y="32" width="6" height="20" rx="2" fill="var(--accent)"/><rect x="26" y="35" width="5" height="14" rx="2" fill="var(--accent2)"/><rect x="89" y="35" width="5" height="14" rx="2" fill="var(--accent2)"/><rect x="40" y="12" width="40" height="3" fill="var(--muted)"/>',
   garden:'<circle cx="96" cy="16" r="9" fill="var(--gold)" opacity=".8"/><rect x="18" y="42" width="22" height="14" rx="3" fill="var(--accent)"/><circle cx="29" cy="34" r="10" fill="var(--done)"/><rect x="60" y="46" width="18" height="10" rx="3" fill="var(--accent)"/><circle cx="69" cy="40" r="7" fill="var(--done)" opacity=".8"/>',
   forge:'<rect x="40" y="38" width="40" height="10" rx="2" fill="var(--muted)"/><rect x="50" y="48" width="20" height="8" fill="var(--muted)"/><ellipse cx="22" cy="46" rx="10" ry="12" fill="var(--accent)" class="fire"/><ellipse cx="22" cy="48" rx="5" ry="7" fill="var(--gold)" class="fire"/>',
   observatory:'<path d="M20 56 A40 40 0 0 1 100 56Z" fill="var(--accent2)" opacity=".85"/><rect x="54" y="20" width="12" height="36" fill="var(--bg)"/><circle cx="14" cy="12" r="1.6" fill="var(--gold)" class="tw"/><circle cx="104" cy="16" r="1.6" fill="var(--gold)" class="tw"/><circle cx="30" cy="8" r="1.2" fill="var(--fg)" class="tw"/>',
   vault:'<circle cx="60" cy="34" r="24" fill="var(--bg)" stroke="var(--gold)" stroke-width="3"/><circle cx="60" cy="34" r="8" fill="var(--gold)"/><path d="M60 14V54M40 34H80M46 20L74 48M74 20L46 48" stroke="var(--gold)" stroke-width="2"/>',
   skyship:'<ellipse cx="22" cy="18" rx="14" ry="5" fill="var(--fg)" opacity=".25"/><ellipse cx="96" cy="26" rx="16" ry="5" fill="var(--fg)" opacity=".2"/><path d="M14 44 L106 44 L96 60 L24 60Z" fill="var(--accent)"/><rect x="58" y="10" width="3" height="34" fill="var(--muted)"/><path d="M61 12 L92 38 L61 38Z" fill="var(--accent2)"/>'
  };
  return b+(p[k]||"")+"</svg>";
}
function relicSvg(L){
  var c="hsl("+((L*47)%360)+" 85% 62%)";
  return '<svg class="crew" viewBox="0 0 64 64" width="72" height="72" aria-hidden="true"><polygon points="32,4 54,24 44,58 20,58 10,24" fill="'+c+'" stroke="var(--fg)" stroke-width="2"/><polygon points="32,4 44,58 20,58" fill="rgba(255,255,255,.28)"/></svg>';
}
function unlArt(u){
  var h='<div class="unlart">';
  if(u.room)h+=roomSvg(u.room.kind); else h+='<div class="crewbg"></div>';
  if(u.crew)h+='<div class="crewpos">'+crewSvg(CREW[u.crew].a,u.room?56:84)+'</div>';
  if(u.relic)h+=relicSvg(u.lv);
  return h+'</div>';
}
function unlTitle(u){
  if(u.relic)return "Relic found";
  var parts=[];if(u.room)parts.push("New room");if(u.crew)parts.push("New crew member");return parts.join(" + ");
}
function unlBuffs(u){
  var o=[];if(u.crew&&CREW[u.crew].buff)o.push(CREW[u.crew].buff.text);if(u.room&&u.room.buff)o.push(u.room.buff.text);
  return o.length?'<div class="buffs">'+o.map(function(t){return '<span class="chip mult">'+esc(t)+'</span>'}).join("")+'</div>':'';
}
function unlCard(u,i){
  var name=u.relic?u.relic:(u.room?u.room.name:"")+(u.room&&u.crew?" with ":"")+(u.crew?CREW[u.crew].name+", "+CREW[u.crew].role:"");
  return '<div class="unl reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s"><span class="label">'+unlTitle(u)+'</span>'+unlArt(u)+'<b>'+esc(name)+'</b><small>'+esc(u.line)+'</small>'+unlBuffs(u)+'</div>';
}
function pv(id){
  var inner="",i;
  if(id==="burst"){for(i=0;i<10;i++){var an=i/10*6.283;inner+='<i style="--dx:'+Math.round(Math.cos(an)*60)+'px;--dy:'+Math.round(Math.sin(an)*36)+'px"></i>'}}
  if(id==="embers"){for(i=0;i<9;i++)inner+='<i style="left:'+(8+i*10)+'%;animation-delay:'+(i*0.23).toFixed(2)+'s"></i>'}
  if(id==="gilded")inner='<span class="gt" style="background:linear-gradient(90deg,var(--gold),#fff,var(--gold));-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none">LEVEL UP</span>';
  if(id==="pulse")inner='<b></b>';
  if(id==="chipglow")inner='<span class="chip xp">+25 XP</span>';
  if(id==="glowtext")inner='<span class="gt">LEVEL UP</span>';
  if(id==="shimmer")inner='<div class="sb"><i></i></div>';
  if(id==="ringglow"||id==="halo")inner='<div class="pr"></div>';
  return '<div class="pv pv-'+id+'">'+inner+'</div>';
}
function fxCard(f,i){
  return '<div class="unl reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s"><span class="label">UI upgrade</span>'+pv(f[1])+'<b>'+esc(f[2])+'</b><small>'+esc(FXD[f[1]]||"")+'</small></div>';
}
function hideout(){
  var lv=effLvl(), ul=UNLOCKS.filter(function(u){return u.lv<=lv}), rooms=ul.filter(function(u){return u.room}), crew=ul.filter(function(u){return u.crew}), relics=Math.max(0,lv-20);
  var h=charCard()+'<section class="card panel"><h3 class="label">The Loft</h3>';
  if(!ul.length)h+='<p class="note">An empty lot. Reach level 2 and something gets built here.</p><div class="hide"><div class="tile sealed"><b>???</b><small>sealed</small></div></div>';
  else{
    h+='<div class="hide">'+rooms.map(function(u){
      return '<div class="tile">'+roomSvg(u.room.kind)+(u.crew?'<div class="crewpos sm">'+crewSvg(CREW[u.crew].a,44)+'</div>':'')+'<b>'+esc(u.room.name)+'</b><small>'+(u.room.buff?esc(u.room.buff.text):'')+'</small></div>'}).join("")
      +'<div class="tile sealed"><b>???</b><small>sealed</small></div></div>';
    if(crew.length)h+='<h3 class="label" style="margin-top:4px">Crew</h3><div class="crewrow">'+crew.map(function(u){var c=CREW[u.crew];
      return '<div class="member">'+crewSvg(c.a,52)+'<div><b>'+esc(c.name)+'</b><small>'+esc(c.role)+'</small><span class="chip mult">'+esc(c.buff.text)+'</span></div></div>'}).join("")+'</div>';
    if(relics)h+='<p class="note mono">'+relics+' relic'+(relics===1?'':'s')+' on the vault shelf</p>';
  }
  return h+'</section>';
}

var CLASSES={
 vanguard:{name:"Vanguard",tag:"Stand in front. Hit the hardest.",
  role:"For training and physical work. Pick this if the gym is your main quest.",
  sig:{name:"Iron Will",text:"Your streak bonus can climb to +40% instead of +30%."},
  perk:{stat:"fitness",pct:15,text:"Fitness quests +15% XP"},
  tiers:["Novice Vanguard","Adept Vanguard"],
  story:["You kneel at the gate and a worn shield is placed in your hands. It is heavier than it looks.","The training yard has no shortcuts. You show up in the cold, in the dark, in the rain, and the old hunters begin to nod."],
  fork:"Three roads leave the training yard. One is built on raw power, one on never falling, and one on going the distance.",specs:["berserker","bulwark","lancer"],
  p:{bg:"#0c0606",s:"#1a0e0e",s2:"#271616",line:"#5a2222",fg:"#fbeeee",muted:"#b99a9a",a:"#ef4444",b:"#94a3b8",ink:"#1a0505"}},
 runeweaver:{name:"Runeweaver",tag:"Shape sound into spells.",
  role:"For makers: music, video, anything creative. Pick this if your best days are the ones where you made something.",
  sig:{name:"Encore",text:"Every creative quest after your first one each day pays +20% XP."},
  perk:{stat:"creativity",pct:15,text:"Creativity quests +15% XP"},
  tiers:["Novice Runeweaver","Adept Runeweaver"],
  story:["A quiet road, a chipped rune stone, and a tune you cannot stop humming. The first town goes quiet when you play.","In the market, strangers hum your melody back to you, a little off."],
  fork:"Three roads open. One leads to grand stages, one to a quiet tower where spells are written note by note, and one to a cathedral where music heals.",specs:["songcaller","spellwright","cantor"],
  p:{bg:"#07060d",s:"#100f1c",s2:"#1a1830",line:"#2a2650",fg:"#f1f0fb",muted:"#8d89ad",a:"#ff3d81",b:"#8b5cff",ink:"#16050c"}},
 swiftblade:{name:"Swiftblade",tag:"Fast, clean, finished.",
  role:"For getting things done: projects, chores, errands. Pick this if checking boxes is your favorite feeling.",
  sig:{name:"Quick Loot",text:"Productivity quests pay 25% more coins."},
  perk:{stat:"productivity",pct:15,text:"Productivity quests +15% XP"},
  tiers:["Novice Swiftblade","Adept Swiftblade"],
  story:["A thin blade, a lighter step, and a list that is suddenly shorter than it was an hour ago. The market streets blur as you move through them.","You stop wasting motion. Every task has one clean line through it, and you find it. The guild notices how little time you leave behind."],
  fork:"Three roads split from the market. One slips through the shadows, one faces a single great opponent, and one bets everything on luck.",specs:["shadowdancer","duelist","trickster"],
  p:{bg:"#030a14",s:"#08121f",s2:"#0e1d30",line:"#17406a",fg:"#e8f6ff",muted:"#7ea2bd",a:"#22d3ee",b:"#818cf8",ink:"#021018"}},
 tamer:{name:"Tamer",tag:"You never walk alone.",
  role:"For people and companions: friends, your partner, your dogs. Pick this if your best moments are shared.",
  sig:{name:"Bond",text:"Every team member's buff is 50% stronger."},
  perk:{stat:"social",pct:15,text:"Social quests +15% XP"},
  tiers:["Novice Tamer","Adept Tamer"],
  story:["A whistle, an open field, and something small and curious steps out of the tall grass. It does not run.","More follow. Each one brings something different, and each one stays."],
  fork:"Three trails leave the meadow. One follows the wild creatures, one follows the people who light the way home, and one leads back to the hearth.",specs:["beastlord","spiritcaller","hearthkeeper"],
  p:{bg:"#050b07",s:"#0b1610",s2:"#122319",line:"#1f5a35",fg:"#ecfbf1",muted:"#86b399",a:"#4ade80",b:"#fbbf24",ink:"#04150a"}}
};
var SPECS={};
function P(cls,id,name,tag,skill,desc,perk,titles,place,rival,relic,b,fa,fb){
  var forms=[fa,fb].map(function(f,i){return {id:id+(i?"B":"A"),name:f[0],final:f[1],skill:f[2],perk:f[3]}});
  SPECS[id]={cls:cls,name:name,tag:tag,skill:skill,desc:desc,perk:perk,titles:titles,place:place,rival:rival,relic:relic,b:b,awaken:forms};
}
P("vanguard","berserker","Berserker","Win by overwhelming force.","Bloodrush","For heavy training days. Body quests pay +10%.",{cl:"body",pct:10,text:"Body quests +10% XP"},["Reaver","Warlord","Juggernaut","Titan Lord"],"the Crimson Colosseum","the Heavy Silence","Chain of Titans","#fbbf24",
  ["Blood Sovereign","Crimson Monarch","Bloodthirst",{stat:"fitness",pct:10,text:"Fitness quests +10% XP"}],
  ["Storm Titan","Titan of the Dawn","Thunder Step",{special:"crit",text:"Critical hit chance up"}]);
P("vanguard","bulwark","Bulwark","Win by never falling.","Iron Bastion","For protecting your routines. Reset quests pay +10%.",{cl:"reset",pct:10,text:"Reset quests +10% XP"},["Gate Warden","Bastion","Citadel Guardian","Fortress Lord"],"the Last Gate","the Long Siege","Wall-Heart Shield","#60a5fa",
  ["Iron Sovereign","Monarch of Walls","Unbreakable",{special:"streakcap",text:"Streak bonus cap +5%"}],
  ["Radiant Paladin","Archangel of Dawn","Holy Aegis",{special:"freeze",text:"Hold one extra streak freeze"}]);
P("vanguard","lancer","Lancer","Win by going the distance.","Skyward Charge","For time outside and long hauls. Outside quests pay +10%.",{cl:"out",pct:10,text:"Outside quests +10% XP"},["Dragoon","Wyvern Rider","Skybreaker","Dragon Lord"],"the Cloud Spire","the Endless Mile","Wyrmscale Lance","#5eead4",
  ["Dragon Sovereign","Monarch of Dragons","Dragon Rage",{cl:"out",pct:10,text:"Outside quests +10% XP"}],
  ["Celestial Valkyrie","Valkyrie of the Heavens","Wings of Light",{special:"combo",text:"Combo window 45 to 55 min"}]);
P("runeweaver","songcaller","Songcaller","Command the whole room.","Stage Presence","For shows and big moments. Boss quests pay +10%.",{cl:"boss",pct:10,text:"Boss quests +10% XP"},["Spotlight Caller","Starcaller","Skyline Starcaller","Celestial Maestro"],"the Starlit Amphitheater","the Silent Critic","Golden Baton","#ff9a3d",
  ["Stage Sovereign","Monarch of Anthems","Crescendo",{cl:"boss",pct:10,text:"Boss quests +10% XP"}],
  ["Aurora Muse","Muse of Dawn","Curtain Call",{special:"combo",text:"Combo window 45 to 55 min"}]);
P("runeweaver","spellwright","Spellwright","Build worlds from silence.","Studio Flow","For studio days and deep creative work. Creative block quests pay +10%.",{cl:"create",pct:10,text:"Creative block quests +10% XP"},["Sigil Writer","Runemaster","Grand Runemaster","Sage Composer"],"the Tower of Quiet Notes","the Unfinished Melody","Silver Tuning Fork","#7cf0ff",
  ["Void Composer","Monarch of Silence","Resonance",{stat:"creativity",pct:10,text:"Creativity quests +10% XP"}],
  ["Starlight Sage","Sage of Stars","Perfect Pitch",{special:"verify",text:"Verified bonus +5%"}]);
P("runeweaver","cantor","Cantor","Heal the room with a melody.","Calming Hymn","For recovery and steady habits. Discipline quests pay +10%.",{stat:"discipline",pct:10,text:"Discipline quests +10% XP"},["Vesper Cantor","Hymn Priest","High Cantor","Bishop of Echoes"],"the Cathedral of Echoes","the Restless Night","Silver Censer","#c4b5fd",
  ["Dusk Sovereign","Monarch of Twilight","Requiem",{stat:"discipline",pct:10,text:"Discipline quests +10% XP"}],
  ["Choir Seraph","Seraph of Mercy","Sanctuary",{special:"freeze",text:"Hold one extra streak freeze"}]);
P("swiftblade","shadowdancer","Shadowdancer","Clear the board unseen.","Shadowstep","For clearing busywork. Admin quests pay +10%.",{cl:"admin",pct:10,text:"Admin quests +10% XP"},["Nightstep","Phantom Courier","Veilwalker","Grand Veilwalker"],"the Midnight Market","the Pile of Busywork","Ink-Black Dagger","#a78bfa",
  ["Shadow Sovereign","Shadow Monarch","Umbral Step",{cl:"admin",pct:10,text:"Admin quests +10% XP"}],
  ["Twilight Seraph","Seraph of Twilight","Moonlit Veil",{special:"crit",text:"Critical hit chance up"}]);
P("swiftblade","duelist","Duelist","One opponent. One perfect strike.","Focus Strike","For finishing the big thing. Boss quests pay +10%.",{cl:"boss",pct:10,text:"Boss quests +10% XP"},["Rapier Adept","Blade Dancer","Starblade","Grand Starblade"],"the Mirror Court","the Perfect Plan","Glass Rapier","#34d399",
  ["Mirror Sovereign","Monarch of Mirrors","Shatter",{cl:"boss",pct:10,text:"Boss quests +10% XP"}],
  ["Radiant Blade","Blade of Dawn","Final Thrust",{special:"crit",text:"Critical hit chance up"}]);
P("swiftblade","trickster","Trickster","Make your own luck.","Lucky Break","For squeezing extra out of everything. Coins +10% on everything.",{special:"coin",pct:10,text:"Coins +10% on everything"},["Card Sharp","Fortune Weaver","Grand Gambler","Lord of Fortune"],"the Gilded Casino","the House Edge","Loaded Dice","#fbbf24",
  ["Fortune Sovereign","Monarch of Fortune","High Stakes",{stat:"productivity",pct:10,text:"Productivity quests +10% XP"}],
  ["Lucky Phoenix","Phoenix of Fortune","Second Chance",{special:"freeze",text:"Hold one extra streak freeze"}]);
P("tamer","beastlord","Beastlord","Run with the pack.","Pack Instinct","For time outside with your companions. Outside quests pay +10%.",{cl:"out",pct:10,text:"Outside quests +10% XP"},["Packleader","Wild Warden","Alpha Warden","Lord of the Wild"],"the Meadow of Companions","the Lonely Trail","Whistle of Many Voices","#fde68a",
  ["Wolf Sovereign","Monarch of the Pack","Alpha Call",{cl:"out",pct:10,text:"Outside quests +10% XP"}],
  ["Phoenix Warden","Phoenix of the Wild","Trailblaze",{special:"combo",text:"Combo window 45 to 55 min"}]);
P("tamer","spiritcaller","Spiritcaller","Light the way for everyone.","Warm Light","For people time. People quests pay +10%.",{cl:"social",pct:10,text:"People quests +10% XP"},["Lantern Keeper","Soulbinder","Lanternlord","Grand Soulbinder"],"the Great Hearth","the Empty Chair","Ember of Home","#fb7185",
  ["Spirit Sovereign","Monarch of Spirits","Soul Link",{stat:"social",pct:10,text:"Social quests +10% XP"}],
  ["Lantern Seraph","Seraph of Lanterns","Guiding Light",{special:"coin",pct:15,text:"Coins +15% on everything"}]);
P("tamer","hearthkeeper","Hearthkeeper","Make home the strongest base.","Warm Kitchen","For house chores and comfort. Home quests pay +10%.",{cl:"home",pct:10,text:"Home quests +10% XP"},["Kindred Guide","Home Warden","Hearth Sage","Keeper of the Flame"],"the Warm Kitchen","the Messy Room","Ember Ladle","#fb923c",
  ["Flame Sovereign","Monarch of Embers","Inferno Hearth",{cl:"home",pct:10,text:"Home quests +10% XP"}],
  ["Hearth Saint","Saint of the Flame","Healing Fire",{special:"streakcap",text:"Streak bonus cap +5%"}]);
var TIERUI={1:"Your class skin installs: new palette, an emblem banner on the board, and a Hall for your story.",2:"The class backdrop switches on behind everything.",3:"Section headers get diamond markers and the emblem lights a third segment.",4:"The header and nav bar glow in your class color.",5:"Your status card breathes with light.",6:"Stat and progress bars glow.",7:"Every card gets softer, larger corners.",8:"Your level ring pulses with energy.",9:"Ascended. Headlines glow and the full emblem ring is lit."};
function oathOf(){var sp=S.spec&&SPECS[S.spec];return (sp&&S.oath)?(sp.awaken.filter(function(o){return o.id===S.oath})[0]||null):null}
function tierName(t){
  if(t<=0||!S.cls||!CLASSES[S.cls])return RANKS[0].n;
  var c=CLASSES[S.cls];
  if(t<=2)return c.tiers[t-1];
  var sp=S.spec&&SPECS[S.spec]; if(!sp)return c.tiers[1];
  if(t===3)return sp.name;
  if(t<=7)return sp.titles[t-4];
  var oa=oathOf();
  if(t===8)return oa?oa.name:sp.titles[3];
  return oa?oa.final:sp.titles[3];
}
function chapter(t){
  if(!S.cls||!CLASSES[S.cls]||t<1)return null;
  var c=CLASSES[S.cls];
  if(t<=2)return {title:c.tiers[t-1],text:c.story[t-1]};
  var sp=S.spec&&SPECS[S.spec]; if(!sp)return {title:"The fork",text:c.fork};
  var T=tierName(t);
  var tx={3:"You take the road to "+sp.place+". They call you "+T+" now.",
   4:"People in "+sp.place+" use the name "+T+" without being told. "+sp.rival+" hears it too.",
   5:sp.rival+" tests you where nobody is watching. You win by doing the small thing again, and again.",
   6:"Deep in "+sp.place+" you find the "+sp.relic+". It brightens whenever you finish what you started. You are "+T+".",
   7:"As "+T+", you are known well beyond "+sp.place+". One more choice is coming.",
   8:"The road splits one last time. You choose, and become "+T+". "+sp.rival+" is watching.",
   9:sp.rival+" falls. "+T+". Level 100."};
  return {title:T,text:tx[t]};
}
function gateTitle(){var t=S.gates.length;return t===0?"Class awakening trial":t===2?"Path trial":t===7?"Final split trial":"Tier "+(t+1)+" advancement trial"}
function hexRgba(h,a){var n=parseInt(h.slice(1),16);return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+a+")"}
function buildSkinCss(){
  var css="";
  Object.keys(CLASSES).forEach(function(id){var p=CLASSES[id].p;
    css+=':root[data-cls="'+id+'"]{--bg:'+p.bg+';--surface:'+p.s+';--surface2:'+p.s2+';--line:'+p.line+';--fg:'+p.fg+';--muted:'+p.muted+';--accent:'+p.a+';--accent2:'+p.b+';--accent-ink:'+p.ink+';--glow1:'+hexRgba(p.a,.16)+';--glow2:'+hexRgba(p.b,.22)+';--shadow:'+hexRgba(p.a,.3)+';--gridc:'+hexRgba(p.a,.08)+'}';});
  Object.keys(SPECS).forEach(function(id){css+=':root[data-spec="'+id+'"]{--accent2:'+SPECS[id].b+';--glow2:'+hexRgba(SPECS[id].b,.22)+'}'});
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
}
function segPath(k){
  var a0=-90+k*40+4,a1=a0+32;
  function pt(a){var r=a*Math.PI/180;return (32+29*Math.cos(r)).toFixed(1)+" "+(32+29*Math.sin(r)).toFixed(1)}
  return "M"+pt(a0)+" A29 29 0 0 1 "+pt(a1);
}
function emblem(id,sz,t){
  var s='<svg class="emblem" viewBox="0 0 64 64" width="'+sz+'" height="'+sz+'" aria-hidden="true">', k;
  for(k=0;k<9;k++)s+='<path class="seg '+(k<t?"on":"off")+'" d="'+segPath(k)+'"/>';
  if(id==="runeweaver"){[10,18,26,18,10].forEach(function(h,i){s+='<rect class="core eqb" style="animation-delay:'+(i*0.15)+'s" x="'+(17+i*7)+'" y="'+(32-h/2)+'" width="4" height="'+h+'" rx="2"/>'})}
  if(id==="vanguard")s+='<path class="strk" d="M32 15l11 4v9c0 8-5 13-11 16-6-3-11-8-11-16v-9z"/><path class="core pulse" d="M32 21v18M25 29h14" stroke="var(--accent)" stroke-width="2.5" fill="none"/>';
  if(id==="swiftblade")s+='<circle class="core pulse" cx="32" cy="32" r="8"/><path class="strk" d="M16 48L48 16" stroke="var(--accent2)"/><path class="strk" d="M20 20l8 8" stroke="var(--accent2)"/>';
  if(id==="tamer")s+='<ellipse class="core pulse" cx="32" cy="38" rx="8" ry="6.5"/><circle class="core2" cx="21" cy="29" r="3.2"/><circle class="core2" cx="28" cy="23" r="3.2"/><circle class="core2" cx="36" cy="23" r="3.2"/><circle class="core2" cx="43" cy="29" r="3.2"/>';
  return s+'</svg>';
}
function swatch(p){return '<i class="sw" style="background:'+p.a+'"></i><i class="sw" style="background:'+p.b+'"></i><i class="sw" style="background:'+p.s2+';border:1px solid '+p.line+'"></i>'}
var picking=false;
function pickModal(label,title,intro,opts,onPick){
  var m=modal('<div class="card box2 pick"><span class="label">'+label+'</span><h2>'+title+'</h2><p class="note">'+intro+'</p><div class="picks">'+opts.map(function(o,i){return '<button class="pickcard" data-i="'+i+'">'+o.html+'</button>'}).join("")+'</div><div class="pickinfo" id="pkinfo"><span class="note">Tap an option to see what it does.</span></div><button class="btn big" id="pkgo" disabled>Choose</button></div>');
  var sel=-1, go=m.querySelector("#pkgo"), info=m.querySelector("#pkinfo");
  [].forEach.call(m.querySelectorAll(".pickcard"),function(c){
    c.onclick=function(){
      sel=+c.dataset.i;
      [].forEach.call(m.querySelectorAll(".pickcard"),function(x){x.classList.toggle("on",x===c)});
      info.innerHTML=opts[sel].info; if(opts[sel].preview)opts[sel].preview();
      go.disabled=false; go.textContent="Choose "+opts[sel].name;
    };
  });
  go.onclick=function(){if(sel<0)return;m.remove();onPick(opts[sel])};
}
function classChoices(){
  var ids=Object.keys(CLASSES),st=S.stats||{},mx=0;
  ids.forEach(function(id){mx=Math.max(mx,st[CLASSES[id].perk.stat]||0)});
  if(!mx)return ids;
  return ids.map(function(id,i){return {id:id,i:i,v:st[CLASSES[id].perk.stat]||0}}).sort(function(a,b){return b.v-a.v||a.i-b.i}).slice(0,3).map(function(x){return x.id});
}
function pickClass(cb){
  if(picking)return; picking=true;
  var opts=classChoices().map(function(id){var c=CLASSES[id];
    var pn=c.specs.map(function(x){return SPECS[x].name}).join(", ");
    return {id:id,name:c.name,
    html:(clsArt(id)?'<img class="clthumb" src="'+clsArt(id)+'" alt="">':emblem(id,52,0))+'<span><b>'+esc(c.name)+'</b><small>'+esc(c.tag)+'</small></span>',
    info:(clsArt(id)?'<img class="clsplash" src="'+clsArt(id)+'" alt="'+esc(c.name)+'">':'')+'<span>'+esc(c.role)+'</span><span class="chip mult">'+esc(c.perk.text)+'</span><span class="chip mult">'+esc(c.sig.name)+': '+esc(c.sig.text)+'</span>'
      +'<span class="note">Level 20: choose a path. '+esc(pn)+'.</span><span class="note">Level 80: choose a final form. Level 100: ascend.</span><span class="note">UI skin '+swatch(c.p)+'</span>',
    preview:function(){document.documentElement.setAttribute("data-cls",id)}}});
  pickModal("Class awakening","Choose your class","Your three strongest stats open these classes. You evolve at every advancement and this choice is permanent. Tap each one to read what it does and preview its look.",opts,function(o){
    S.cls=o.id; picking=false; checkBadges(); applyFx(); render(); persist(); cb();
  });
}
function pickSpec(cb){
  if(picking||!S.cls)return; picking=true;
  var c=CLASSES[S.cls];
  var opts=c.specs.map(function(id){var sp=SPECS[id];return {id:id,name:sp.name,
    html:emblem(S.cls,52,3)+'<span><b>'+esc(sp.name)+'</b><small>'+esc(sp.tag)+'</small></span>',
    info:'<span>'+esc(sp.desc)+'</span><span class="chip mult">'+esc(sp.skill)+': '+esc(sp.perk.text)+'</span><span class="note">Your titles: '+esc([sp.name].concat(sp.titles).join(" > "))+'.</span><span class="note">Level 80 final forms: '+esc(sp.awaken[0].name)+' or '+esc(sp.awaken[1].name)+'.</span>',
    preview:function(){document.documentElement.setAttribute("data-spec",id)}}});
  pickModal("Path","Choose your path",esc(c.fork),opts,function(o){
    S.spec=o.id; picking=false; checkBadges(); applyFx(); render(); persist(); cb();
  });
}
function pickOath(cb){
  if(picking||!S.cls||!S.spec)return; picking=true;
  var sp=SPECS[S.spec];
  var opts=sp.awaken.map(function(o){return {id:o.id,name:o.name,
    html:emblem(S.cls,52,8)+'<span><b>'+esc(o.name)+'</b><small>'+esc(o.skill)+': '+esc(o.perk.text)+'</small></span>',
    info:'<span>You become <b>'+esc(o.name)+'</b>, then at level 100 <b>'+esc(o.final)+'</b>.</span><span class="chip mult">'+esc(o.skill)+': '+esc(o.perk.text)+'</span>'}});
  pickModal("Final split","Choose your final form","Your last choice. Each form has its own title, its own skill and its own ending.",opts,function(o){
    S.oath=o.id; picking=false; applyFx(); render(); persist(); cb();
  });
}
function checkPending(){
  if(S.gates.length>=1&&!S.cls)pickClass(function(){render();persist()});
  else if(S.gates.length>=3&&S.cls&&!S.spec)pickSpec(function(){render();persist()});
  else if(S.gates.length>=8&&S.cls&&S.spec&&!S.oath)pickOath(function(){render();persist()});
}
function advModal(t,beforeLv,afterLv,savedGym,prevRi){
  var ri=rankIdx(), nr=RANKS[ri], ch=chapter(t), feats=ri>prevRi?nr.f:[];
  var m=modal('<div class="card box2 adv"><span class="label">Advancement complete</span>'+(ART["rank_"+nr.l]?'<div class="rkbig"><img src="'+ART["rank_"+nr.l]+'" alt="Rank '+nr.l+'"></div>':'<div class="big">'+nr.l+'</div>')+'<h2>'+esc(tierName(t))+'</h2>'
   +'<p class="note">Tier '+t+' of 9. Stored XP released: level '+beforeLv+' to level '+afterLv+'.'+(savedGym?' Gym location saved.':'')+'</p>'
   +(ch?'<div class="chap"><b>Chapter '+t+': '+esc(ch.title)+'</b>'+esc(ch.text)+'</div>':'')
   +'<div class="chap"><b>UI overhaul</b>'+esc(TIERUI[t]||"")+'</div>'
   +(feats.length?'<ul>'+feats.map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+'</ul>':'')
   +'<button class="btn big" id="advok">Continue</button></div>');
  var b=m.querySelector("#advok");b.focus({preventScroll:true});
  b.onclick=function(){m.remove();levelUp(afterLv,"Gate cleared. Your stored XP flowed in.",beforeLv)};
}
function storyModal(){
  var t=S.gates.length, ch=chapter(t); if(!ch)return;
  var m=modal('<div class="card box2"><span class="label">Chapter '+t+'</span><h2>'+esc(ch.title)+'</h2><div class="chap">'+esc(ch.text)+'</div><button class="btn big" id="stok">Close</button></div>');
  m.querySelector("#stok").onclick=function(){m.remove()};
}
function classBanner(){
  var t=S.gates.length;
  if(!S.cls||!CLASSES[S.cls])return '<section class="card panel"><span class="label">Class awakening</span><p class="note">At level 5 you pass your first gate and choose a class. It changes your UI, your story and your perks, and you can read exactly what each one does before you commit.</p></section>';
  var c=CLASSES[S.cls], sp=S.spec&&SPECS[S.spec], oa=oathOf(), ng=openGate();
  /* Cal, 2026-11-06: "This banner does not cover the whole width". The art was a ::after layer, which the fx-pulse glow also
     uses, so it shrank to the left half and pulsed. Now its own element across the whole card, darkened behind the text. */
  var ca=clsArt(S.cls);
  return '<section class="card banner'+(ca?' hasart':'')+'">'+(ca?'<i class="clsbg" aria-hidden="true" style="background-image:url('+ca+')"></i>':'')+'<div>'+emblem(S.cls,76,t)+'</div><div><h3>'+esc(tierName(t))+'</h3><div class="sub">'+esc(c.name)+(sp?' &middot; '+esc(sp.name):'')+' &middot; Tier '+t+' of 9</div>'
   +'<div class="row2"><span class="chip mult">'+esc(c.sig.name)+'</span>'+(sp?'<span class="chip mult">'+esc(sp.skill)+'</span>':'')+(oa?'<span class="chip mult">'+esc(oa.skill)+'</span>':'')+'</div>'
   +'<div class="row2"><span class="note">'+(ng?'Next advancement at level '+ng:'Fully ascended')+'</span><button class="btn ghost" data-act="story">Story</button></div></div></section>';
}
function hallHtml(){
  var t=S.gates.length;
  if(!S.cls||!CLASSES[S.cls])return '<section class="card panel"><h3 class="label">Class Hall</h3><p class="note">Pass your first gate to choose a class.</p></section>';
  var c=CLASSES[S.cls], sp=S.spec&&SPECS[S.spec], oa=oathOf(), k, h='';
  h+='<section class="card banner"><div>'+emblem(S.cls,96,t)+'</div><div><h3>'+esc(c.name)+'</h3><div class="sub">'+esc(c.tag)+'</div></div></section>';
  h+='<section class="card panel"><h3 class="label">Your skills</h3><p class="note">'+esc(c.role)+'</p><div class="lrows">'
   +'<div class="chap"><b>'+esc(c.sig.name)+'</b>'+esc(c.sig.text)+'</div>'
   +'<div class="chap"><b>Class bonus</b>'+esc(c.perk.text)+'</div>'
   +(sp?'<div class="chap"><b>'+esc(sp.skill)+'</b>'+esc(sp.perk.text)+'</div>':'<div class="chap lockc"><b>Path skill</b>Unlocks when you choose your path at level 20.</div>')
   +(oa?'<div class="chap"><b>'+esc(oa.skill)+'</b>'+esc(oa.perk.text)+'</div>':'<div class="chap lockc"><b>Final form skill</b>Unlocks at level 80.</div>')
   +'</div></section>';
  h+='<section class="card panel"><h3 class="label">Advancement ladder</h3><div class="lrows">';
  for(k=0;k<9;k++){
    var done=k<t, nxt=k===t, nm;
    if(done)nm=tierName(k+1);
    else if(k===2)nm="Path: "+c.specs.map(function(x){return SPECS[x].name}).join(", ");
    else if(k===7)nm=sp?"Final form: "+sp.awaken[0].name+" or "+sp.awaken[1].name:"Final form";
    else if(k===8)nm="Monarch";
    else nm="Promotion";
    h+='<div class="lrow'+(done?" done":nxt?" next":"")+'"><span class="lv">Lv '+GATES[k]+'</span><span>'+esc(nm)+'</span><span class="note">'+(done?"Cleared":nxt?"Next":"")+'</span></div>';
  }
  h+='</div></section><section class="card panel"><h3 class="label">Story</h3><div class="lrows">';
  for(k=1;k<=9;k++){
    var ch=k<=t?chapter(k):null;
    h+=ch?'<div class="chap"><b>Chapter '+k+': '+esc(ch.title)+'</b>'+esc(ch.text)+'</div>':'<div class="chap lockc"><b>Chapter '+k+'</b>Sealed. Clear the next gate.</div>';
    if(k===t&&t>=2&&!sp)h+='<div class="chap"><b>The fork</b>'+esc(c.fork)+'</div>';
  }
  return h+'</div></section>';
}
var WHEEL=[["100 coins",100,0],["250 coins",250,0],["150 coins",150,0],["500 coins",500,0],["200 coins",200,0],["Streak freeze",0,1],["1000 coins",1000,0],["350 coins",350,0]];
var WHEEL_W=[20,18,20,12,16,6,2,6];
var WCOL=["#ff3d81","#ffc857","#4dffc3","#6cb6ff","#b388ff","#ff8a3d","#f1f0fb","#22d3ee"];
var spinning=false;
function wheelHtml(){
  var can=S.wheel!==today();
  var conic='conic-gradient('+WCOL.map(function(c,i){return c+' '+(i*45)+'deg '+((i+1)*45)+'deg'}).join(",")+')';
  var labels=WHEEL.map(function(w,i){return '<span style="transform:rotate('+(i*45+22.5-90)+'deg) translateX(34px)">'+esc(w[0])+'</span>'}).join("");
  return '<section class="card panel"><h3 class="label">Lucky wheel</h3><p class="note">One free spin every day. Coins, and now and then a streak freeze.</p>'
   +'<div class="wheelwrap"><div class="pointer"></div><div class="wheel" id="wheel" style="background:'+conic+'">'+labels+'</div></div>'
   +'<button class="btn big" data-act="spin"'+(can&&!spinning?'':' disabled')+'>'+(can?"Spin":"Come back tomorrow")+'</button>'
   +(S.wheelRes?'<p class="note" style="text-align:center">Last result: <b>'+esc(S.wheelRes)+'</b></p>':'')+'</section>';
}
function spin(){
  if(spinning||S.wheel===today())return;
  var tot=WHEEL_W.reduce(function(a,b){return a+b},0), r=Math.random()*tot, idx=0;
  while(idx<WHEEL_W.length-1&&r>=WHEEL_W[idx]){r-=WHEEL_W[idx];idx++}
  var pz=WHEEL[idx]; S.wheel=today();
  if(pz[2]){if(S.freezes<maxFreeze()){S.freezes++;S.wheelRes="Streak freeze"}else{S.coins+=300;S.earnedC+=300;S.wheelRes="300 coins (freeze slots were full)"}}
  else{S.coins+=pz[1];S.earnedC+=pz[1];S.wheelRes=pz[0]}
  persist(); spinning=true;
  var w=document.getElementById("wheel"); if(w){void w.offsetWidth;w.style.transform="rotate("+(1800-(idx*45+22.5))+"deg)"}
  setTimeout(function(){spinning=false;checkBadges();render();persist();pop("Wheel: "+S.wheelRes)},3600);
}

/*v51*/
var DNG=[
 {id:"cellar",name:"Mossy Cellar",lv:5,mins:30,c:[40,70],x:[10,15],ic:"\u{1F344}",tag:"Damp stairs and glowing mushrooms."},
 {id:"metro",name:"Forgotten Metro",lv:10,mins:30,c:[70,110],x:[12,18],ic:"\u{1F687}",tag:"A station that was never on any map."},
 {id:"sewer",name:"Neon Sewers",lv:16,mins:45,c:[100,150],x:[15,22],ic:"\u{1F4A1}",tag:"Flickering pipes and standing water."},
 {id:"tower",name:"Clocktower Vault",lv:24,mins:45,c:[130,190],x:[18,26],ic:"\u{23F0}",tag:"Every gear ticks a different time."},
 {id:"mines",name:"Crystal Mines",lv:32,mins:60,c:[170,240],x:[22,32],ic:"\u{1F48E}",tag:"The walls hum when you walk past."},
 {id:"arcade",name:"Sunken Arcade",lv:42,mins:60,c:[220,300],x:[26,38],ic:"\u{1F579}",tag:"Cabinets glow under a foot of water."},
 {id:"spire",name:"Obsidian Spire",lv:55,mins:60,c:[280,380],x:[30,45],ic:"\u{1F5FC}",tag:"The last floor is always one more floor."}];
var DNPC=[
 {id:"pip",d:"cellar",name:"Pip the Cellar Cook",line:"Was stuck behind a barrel door for three weeks.",buff:{special:"coin",pct:3,text:"Coins +3%"}},
 {id:"mara",d:"metro",name:"Mara the Conductor",line:"Still waiting on the 9:15 that never came.",buff:{special:"all",pct:3,text:"All quests +3% XP"}},
 {id:"kit",d:"sewer",name:"Kit the Splicer",line:"Fixed every light in the tunnels, then got lost.",buff:{special:"coin",pct:4,text:"Coins +4%"}},
 {id:"bram",d:"tower",name:"Old Bram the Clockmaker",line:"Wound the vault clock one tick too far.",buff:{special:"all",pct:4,text:"All quests +4% XP"}},
 {id:"juno",d:"mines",name:"Juno the Gem Cutter",line:"Her lantern died two shafts ago.",buff:{special:"coin",pct:5,text:"Coins +5%"}},
 {id:"neo",d:"arcade",name:"Neo the Arcade Ghost",line:"Has been on level 99 since the flood.",buff:{special:"all",pct:5,text:"All quests +5% XP"}},
 {id:"sera",d:"spire",name:"Seraphine the Spire Keeper",line:"Kept the top floor lit for a hundred years.",buff:{special:"coin",pct:6,text:"Coins +6%"}}];
var DNG_OPEN=["You stepped in as the lights flickered on.","A cold draft pushed you down the first stairwell.","Your lantern caught something shiny almost at once.","The door shut behind you with a long creak.","You counted your steps and lost count at forty.","A distant drip kept time with your footsteps."];
var DNG_WIN=["A loose panel gave way to a stash of coins.","You waited out a patrol and slipped past with their supplies.","A map scrawled on the wall pointed to a hidden cache.","You solved a three-switch lock on the first try.","A friendly stranger traded you a pouch for directions out.","You found a dusty chest and sprang only one small trap."];
var DNG_END=["You climbed out with your pack heavier and your head high.","It was bright out when you surfaced.","You were home before the kettle stopped whistling.","Nobody believed the story. The coins were real.","You left a chalk arrow for whoever comes next."];
var DNG_BAD=["You were a bit green for this place: a rockfall cut the path, so you dropped your pack and ran.","A trap you should have spotted at a higher level sent you tumbling. Half the loot stayed behind.","Something large woke up. You left coins on the floor and ran for the exit.","The floor gave out. You climbed back with what you could carry.","Your lantern died in a long corridor. You felt your way out and lost the bag on the stairs.","A goblin at a gate charged a toll. You paid most of what you had."];
var DNG_BAD2=["Level up a little and this place will feel a lot kinder.","Lesson learned: bring a rope next time.","Even the best delvers drop the pack sometimes.","Next time, bring a second lantern."];
function dngInit(){if(!S.dng||typeof S.dng!=="object")S.dng={};var D=S.dng;if(!Array.isArray(D.runs))D.runs=[];if(!D.cd)D.cd={d:"",n:0};if(!D.npcs)D.npcs={};if(!D.log)D.log=[];return D}
function dngSlots(){return 1+(S.owned&&S.owned.bf_away?1:0)}
function dngRand(a){return a[Math.floor(Math.random()*a.length)]}
function dngRoll(d){
  var lv=effLvl(),rec=d.lv+4,risk=lv>=rec?.06:.06+.08*(rec-lv),bad=Math.random()<risk,D=dngInit();
  var c=Math.round(d.c[0]+Math.random()*(d.c[1]-d.c[0])),x=Math.round(d.x[0]+Math.random()*(d.x[1]-d.x[0]));
  var npc=null,story=dngRand(DNG_OPEN)+" ";
  if(bad){c=Math.round(c*(.35+Math.random()*.2));x=Math.round(x*.6);story+=dngRand(DNG_BAD)+" "+dngRand(DNG_BAD2)}
  else{story+=dngRand(DNG_WIN)+" "+dngRand(DNG_END);
    var n=DNPC.filter(function(q){return q.d===d.id&&!D.npcs[q.id]})[0];
    if(n&&Math.random()<.025){npc=n.id;story+=" Behind a rusted gate, someone was waving at you."}}
  return {id:d.id,start:Date.now(),end:Date.now()+d.mins*60000,bad:bad,c:c,x:x,npc:npc,story:story}
}
function dngStart(id){
  var d=DNG.filter(function(q){return q.id===id})[0],D=dngInit(),t=today();
  if(!d||d.lv>effLvl()||D.runs.length>=dngSlots())return;
  if(D.cd.d!==t)D.cd={d:t,n:0};
  if(D.cd.n>=3){pop("Three delves a day is plenty. Rest up.");return}
  D.cd.n++;D.runs.push(dngRoll(d));render();persist();pop("Entered "+d.name+". Go do your day!");
}
function dngClaim(k,ev){
  var D=dngInit(),r=D.runs[k];if(!r||Date.now()<r.end)return;
  var d=DNG.filter(function(q){return q.id===r.id})[0],m=Math.max(.5,openMult()),c=Math.max(5,Math.round(r.c*m)),x=0,n=r.npc&&DNPC.filter(function(q){return q.id===r.npc})[0];
  D.runs.splice(k,1);if(n)D.npcs[n.id]=1;
  D.log.unshift({d:d.name,c:c,x:x,bad:r.bad,t:Date.now()});D.log=D.log.slice(0,6);
  var rel=(m<1?'<p class="note">The town ran at '+Math.round(m*100)+'% today, so the loot was trimmed. Complete the Daily Quest for the full haul.</p>':'');
  var mm=modal('<div class="card box2 adv"><span class="label">'+(r.bad?'Setback':'Delve complete')+'</span><h2>'+esc(d.name)+'</h2><p class="note">'+esc(r.story)+'</p>'
    +'<div class="reward reveal">+'+c+' coins</div>'+rel
    +(n?'<div class="card panel" style="margin-top:10px"><span class="label">Rescued</span><b>'+esc(n.name)+'</b><p class="note">'+esc(n.line)+' Now lives in your Loft.</p><span class="chip mult">'+esc(n.buff.text)+'</span></div>':'')
    +'<div class="row"><button class="btn" id="dgok">Done</button></div></div>');
  var b=mm&&mm.querySelector("#dgok");if(b)b.onclick=function(){mm.remove()};
  grantXp(x,c,null);if(ev&&ev.clientX!=null)burst(ev.clientX,ev.clientY,n?40:20);
}
function dngHtml(){
  var D=dngInit(),now=Date.now(),lv=effLvl(),t=today();if(D.cd.d!==t)D.cd={d:t,n:0};
  var h='<section class="card panel"><h3 class="label">Dungeons</h3><p class="note">Tap a dungeon, put the phone down and go do your real quests. Come back when the timer is up. Delves today: <b>'+D.cd.n+'/3</b>. Quest effort now: <b>'+Math.round(Math.max(.5,openMult())*100)+'%</b>.</p>';
  if(D.runs.length){h+='<div class="lrows">';D.runs.forEach(function(r,k){
    var d=DNG.filter(function(q){return q.id===r.id})[0],left=r.end-now,done=left<=0,pct=Math.min(100,Math.round((now-r.start)/(r.end-r.start)*100)),mins=Math.ceil(left/60000);
    h+='<div class="dng run"><b>'+d.ic+' '+esc(d.name)+'</b>'+(done?'<small class="note"> You made it back.</small><button class="btn" data-act="dclaim" data-k="'+k+'">Return</button>':'<small class="note"> back in '+mins+' min</small><div class="dbar"><i style="width:'+pct+'%"></i></div>')+'</div>'});
    h+='</div>'}
  h+='<div class="lrows">';
  DNG.forEach(function(d){
    var locked=d.lv>lv,rec=d.lv+4,risk=lv>=rec?"Safe":lv>=d.lv+2?"Risky":"Dangerous";
    h+='<div class="dng'+(locked?' lock':'')+'"><b>'+d.ic+' '+esc(d.name)+'</b><small class="note"> '+esc(d.tag)+'</small>'
     +'<div class="dmeta mono"><span>Lv '+d.lv+'</span><span>'+d.mins+' min</span><span>'+d.c[0]+'-'+d.c[1]+' coins</span><span>'+(locked?'Locked':risk)+'</span></div>'
     +(locked?'':(D.runs.length>=dngSlots()?'<small class="note">All delve slots busy.</small>':'<button class="btn alt" data-act="dgo" data-id="'+d.id+'">Enter</button>'))+'</div>'});
  h+='</div></section>';
  var got=DNPC.filter(function(n){return D.npcs[n.id]});
  h+='<section class="card panel"><h3 class="label">Rescued allies</h3>'+(got.length?'<div class="lrows">'+got.map(function(n){return '<div class="dng"><b>'+esc(n.name)+'</b><small class="note"> '+esc(n.line)+'</small><span class="chip mult">'+esc(n.buff.text)+'</span></div>'}).join("")+'</div>':'<p class="note">Very rarely, a delve ends with someone trapped inside waving at you. Rescue one and they move in with a permanent perk.</p>')+'</section>';
  return h;
}

var AWAY_OPT=[[1,100],[4,450],[8,1000]];
function awaySlots(){var lv=effLvl();return (lv>=70?4:lv>=40?3:2)+(S.owned&&S.owned.bf_away?1:0)}
function awayHtml(){
  var now=Date.now(), out=Object.keys(S.away).length, slots=awaySlots();
  var crew=UNLOCKS.filter(function(u){return u.crew&&u.lv<=effLvl()&&hasRoom("lounge")});
  var h='<section class="card panel"><h3 class="label">Expeditions</h3><p class="note">Send crew out in real time. They return with coins. Slots in use: <b>'+out+'/'+slots+'</b>. More slots open at level 40 and 70.</p>';
  if(!crew.length)h+='<p class="note">No crew yet.</p>';
  h+='<div class="lrows">';
  crew.forEach(function(u){
    var c=CREW[u.crew], a=S.away[u.crew], body;
    if(a){
      if(now>=a.end)body='<b>Back with '+a.coins+' coins</b><div class="btns2"><button class="btn" data-act="aclaim" data-id="'+u.crew+'">Collect</button></div>';
      else{var mins=Math.ceil((a.end-now)/60000);body='<b>Out exploring</b><small class="note"> back in '+Math.floor(mins/60)+'h '+(mins%60)+'m</small>'}
    }else if(out<slots){
      body='<b>'+esc(c.name)+'</b><small class="note"> '+esc(c.role)+'</small><div class="btns2">'+AWAY_OPT.map(function(o){return '<button class="btn alt" data-act="asend" data-id="'+u.crew+'" data-h="'+o[0]+'">'+o[0]+'h &middot; '+o[1]+'</button>'}).join("")+'</div>';
    }else body='<b>'+esc(c.name)+'</b><small class="note"> All slots busy</small>';
    h+='<div class="awayrow">'+crewSvg(c.a,48)+'<div>'+body+'</div></div>';
  });
  return h+'</div></section>';
}
function asend(id,hrs){
  var o=AWAY_OPT.filter(function(x){return x[0]===hrs})[0];
  if(!o||S.away[id]||Object.keys(S.away).length>=awaySlots())return;
  S.away[id]={end:Date.now()+hrs*3600000,coins:Math.round(o[1]*(0.9+Math.random()*0.35)*1)};
  render();persist();
}
function aclaim(id,ev){
  var a=S.away[id]; if(!a||Date.now()<a.end)return;
  S.coins+=a.coins;S.earnedC+=a.coins;delete S.away[id];
  checkBadges();render();persist();
  if(ev&&ev.clientX!=null)burst(ev.clientX,ev.clientY,18);
  pop("Expedition done. +"+a.coins+" coins");
}
function viewHtml(v){return v==="train"?trainHtml():v==="shop"?shopHtml():v==="trophy"?trophyHtml():v==="hall"?hallHtml():v==="wheel"?wheelHtml():v==="away"?dngHtml():baseHtml()}

var AREAS=[["board","Board",1],["train","Training",1],["hideout","The Loft",2],["shop","Shop",1],["hall","Hall",4],["trophy","Relics",8],["wheel","Wheel",6],["away","Dungeons",1]];
var AREALINE={shop:"The Shop. A new brand drops every Monday: clothes for your character, plus themes and upgrades.",trophy:"Relics mark what you have achieved. Each one pays coins when you earn it.",hall:"The Hall: the town hall where everyone posts, and your class story, perks and advancements.",wheel:"A free spin every day. Coins, and sometimes a streak freeze.",away:"Send your team out from the Hero\'s Lair. Missions bring home coins, gifts and trophies."};
var view="board";
/* Cal (2026-11-08): "Gym 4 times a week only gives 625 coins but the closet and other big upgrades cost thousands ... I want you to be
   able to upgrade way more per day if you play often." All upgrades cost 381,500 coins; a good day earned about 1,500. Tasks now pay 6
   coins an XP (was 2.5), and the more you do in a day the more each pays: full rate for the first 3, then +12.5% a task, double from
   the 11th. A light day still counts, a big day buys several upgrades. See docs/ECONOMY.md. */
function coinMomentum(){var n=Object.keys(S.cdone||{}).length;return 1+Math.min(1,Math.max(0,n-2)*.125)}
function coinsFor(xp){return Math.max(10,Math.round(xp*6*(1+.01*(effLvl()-1))*coinMomentum()))}
var SHOP=[
 ["th_sunset","theme","Sunset Drive",60,3,"Warm orange and hot pink across the board.",{a:"#ff8a3d",b:"#ff3d81"}],
 ["th_mint","theme","Mint Circuit",70,5,"Cool mint and cyan.",{a:"#4dffc3",b:"#22d3ee"}],
 ["th_ultra","theme","Ultraviolet",90,8,"Deep violet glow.",{a:"#b388ff",b:"#6c5bff"}],
 ["th_gold","theme","Gold Rush",150,12,"Everything gleams.",{a:"#ffc857",b:"#ff8a3d"}],
 ["th_blood","theme","Blood Moon",150,18,"Crimson over black.",{a:"#ff2e4d",b:"#7a1030"}],
 ["fr_neon","frame","Neon Frame",80,4,"Your status cards get a glowing outline."],
 ["fr_circuit","frame","Circuit Frame",120,9,"A dashed tech border."],
 ["fr_royal","frame","Royal Frame",200,15,"A gold outline with a halo."],
 ["bg_stars","bg","Starfield",70,3,"Twinkling stars behind everything."],
 ["bg_rain","bg","Neon Rain",110,7,"Rain falls in your accent color."],
 ["bg_city","bg","City Skyline",160,13,"A lit skyline along the bottom."],
 ["pet_slime","pet","Pixel Slime",90,5,"A slime that bounces on your status card."],
 ["pet_fox","pet","Ember Fox",140,10,"A fox with a spark of ember."],
 ["pet_cat","pet","Void Cat",200,16,"Quiet, watchful, golden eyes."],
 ["tt_grinder","title","The Grinder",40,3,"A title under your name."],
 ["tt_owl","title","Night Owl",40,6,"For the late sessions."],
 ["tt_menace","title","Menace",75,11,"Self explanatory."],
 ["bu_confetti","burst","Confetti Burst",100,4,"Taps burst into multicolor confetti."],
 ["bu_star","burst","Starlight Burst",130,8,"Taps burst into gold and white sparks."],
 ["bf_xp1","buff","Focus Rune I",150,2,"All quests +3% XP, forever.",{k:"xp",v:3}],
 ["bf_coin1","buff","Merchant Seal I",150,2,"All quests +10% coins, forever.",{k:"coin",v:10}],
 ["bf_freeze","buff","Frost Charm",300,6,"Hold one extra streak freeze.",{k:"freeze"}],
 ["bf_xp2","buff","Focus Rune II",450,10,"All quests +3% more XP.",{k:"xp",v:3,req:"bf_xp1"}],
 ["bf_coin2","buff","Merchant Seal II",450,10,"All quests +10% more coins.",{k:"coin",v:10,req:"bf_coin1"}],
 ["bf_streak","buff","Anchor Sigil",500,12,"Streak bonus cap +5%.",{k:"streak"}],
 ["bf_away","buff","Scout Map",600,14,"One extra expedition slot.",{k:"away"}],
 ["bf_xp3","buff","Focus Rune III",1000,25,"All quests +4% more XP.",{k:"xp",v:4,req:"bf_xp2"}],
 ["bf_coin3","buff","Merchant Seal III",1000,25,"All quests +15% more coins.",{k:"coin",v:15,req:"bf_coin2"}],
 ["hr_wolf","a_hair","Wolf Cut",90,2,"Layered and sharp.",{s:"wolf",g:"m"}],
 ["hr_under","a_hair","Undercut",90,3,"Faded sides, sharp top.",{s:"undercut",g:"m"}],
 ["hr_twin","a_hair","Twin Tails",90,2,"High and playful.",{s:"twin",g:"f"}],
 ["hr_buns","a_hair","Space Buns",100,4,"Two buns, zero effort.",{s:"buns",g:"f"}],
 ["dy_honey","a_hairc","Honey Blonde",60,2,"Warm golden blonde.",{c:"#d9a24a"}],
 ["dy_silver","a_hairc","Silver Dye",60,2,"Cold steel hair.",{c:"#dfe3ee"}],
 ["dy_crimson","a_hairc","Crimson Dye",60,3,"Deep red.",{c:"#c81e3a"}],
 ["dy_blue","a_hairc","Electric Blue Dye",70,5,"Bright system blue.",{c:"#2f7bff"}],
 ["dy_violet","a_hairc","Violet Dye",70,7,"Royal purple.",{c:"#8a4dff"}],
 ["ey_ember","a_eyes","Ember Gaze",120,4,"Warm amber eyes.",{c:"#c8741f"}],
 ["ey_frost","a_eyes","Frost Gaze",120,6,"Ice blue eyes.",{c:"#6fb8e8"}],
 ["ey_mon","a_eyes","Monarch Gaze",250,15,"The violet eyes of a ruler.",{c:"#9a6cf0"}],
 ["tp_tank_f","a_top","Satin Tank",80,2,"Smooth and simple.",{s:"tank",c:"#c8323c",g:"f"}],
 ["tp_tee_m","a_top","Graphic Tee",70,2,"Clean green tee.",{s:"tee",c:"#1f8a4c",g:"m"}],
 ["tp_leather","a_top","Leather Jacket",120,2,"Black leather over a white tee.",{s:"leather",c:"#1b1a22",c2:"#f2f2f6"}],
 ["tp_cream","a_top","Cream Hoodie",110,2,"Heavy cotton, relaxed fit.",{s:"hoodie",c:"#efe8d4",c2:"#bfb59c"}],
 ["tp_cardi_f","a_top","Soft Cardigan",120,3,"Warm oat knit.",{s:"cardigan",c:"#e6d6bf",c2:"#f6f0e8",g:"f"}],
 ["tp_cardi_m","a_top","Red Cardigan",130,3,"Open red knit over a white tank.",{s:"cardigan",c:"#d4372c",c2:"#f6f6f8",g:"m"}],
 ["tp_varsity","a_top","Varsity Jacket",160,5,"Navy with a white inner.",{s:"varsity",c:"#2b4a8a",c2:"#eef0f5"}],
 ["tp_blazer_f","a_top","Camel Blazer",190,6,"Soft tailored blazer.",{s:"coat",c:"#d9b48a",c2:"#f4e8dc",g:"f"}],
 ["tp_coat_m","a_top","Charcoal Overcoat",200,6,"Long and sharp.",{s:"coat",c:"#3a3d4a",c2:"#d8dbe6",g:"m"}],
 ["tp_trench","a_top","Trench Coat",220,9,"Belted and dramatic.",{s:"trench",c:"#b89a6a",c2:"#ece2d0"}],
 ["pt_cargo","a_pants","Cargo Pants",80,2,"Pockets for days.",{s:"cargo",c:"#6b6d73"}],
 ["pt_skirt","a_pants","Pleated Skirt",80,2,"Clean pleated cut.",{s:"skirt",c:"#f2efe8",g:"f"}],
 ["pt_shorts","a_pants","Denim Shorts",70,2,"Faded blue.",{s:"shorts",c:"#4a6fa5"}],
 ["pt_jog_f","a_pants","Joggers",90,3,"Soft grey joggers.",{s:"joggers",c:"#8a92a6",g:"f"}],
 ["pt_wide","a_pants","Wide Trousers",130,5,"Dark, wide, easy.",{s:"wide",c:"#2a2d3a"}],
 ["sh_white","a_shoes","White Kicks",90,2,"Fresh and clean.",{s:"sneakers",c:"#f2f3f8"}],
 ["sh_flats","a_shoes","Ballet Flats",100,3,"Cream flats.",{s:"flats",c:"#e9d8c4",g:"f"}],
 ["sh_boots","a_shoes","Combat Boots",130,4,"Black and heavy.",{s:"boots",c:"#2a2226"}],
 ["sh_red","a_shoes","Red Hi-Tops",140,6,"Loud on purpose.",{s:"sneakers",c:"#d4372c"}],
 ["ac_glasses","a_acc","Round Glasses",60,2,"Thin frames.",{s:"glasses"}],
 ["ac_phones","a_acc","Studio Headphones",80,2,"For the producers.",{s:"phones"}],
 ["ac_hoops","a_acc","Gold Hoops",70,2,"Small gold hoops.",{s:"hoops",g:"f"}],
 ["ac_shades","a_acc","Shades",80,3,"Dark lenses.",{s:"sunglasses"}],
 ["ac_bow","a_acc","Silk Bow",70,3,"A white bow in your hair.",{s:"bow",g:"f"}],
 ["ac_chain","a_acc","Silver Chain",100,4,"A thin chain.",{s:"chain"}],
 ["ac_flower","a_acc","Hair Flower",80,4,"A red flower tucked in.",{s:"flower",g:"f"}],
 ["ac_cross","a_acc","Chain and Cross",130,6,"Silver chain with a cross.",{s:"chain+cross",g:"m"}],
 ["ac_halo","a_acc","Halo",260,20,"A ring of gold light.",{s:"halo"}],
 ["ac_crown","a_acc","Crown",320,25,"Heavy is the head.",{s:"crown"}],
 ["bk_katana","a_back","Katana",160,4,"A blade across your back.",{s:"katana"}],
 ["bk_cape","a_back","Cape",220,12,"Crimson cape.",{s:"cape",ac:"#b8323a"}],
 ["bk_wings","a_back","Shadow Wings",450,30,"Dark wings with a violet edge.",{s:"wings",ac:"#8a4dff"}],
 ["hr_fade","a_hair","Fade",70,2,"Tapered and clean.",{s:"fade"}],
 ["hr_slick","a_hair","Slick Back",80,3,"Combed back.",{s:"slick"}],
 ["hr_buzz","a_hair","Buzz Cut",60,2,"Zero maintenance.",{s:"buzz"}],
 ["et_happy","a_eyet","Happy Eyes",70,2,"Curved and cheerful.",{e:"happy"}],
 ["et_dot","a_eyet","Dot Eyes",70,2,"Simple and deadpan.",{e:"dot"}],
 ["et_tired","a_eyet","Tired Eyes",70,3,"Producer hours.",{e:"tired"}],
 ["tp_button","a_top","Button-Up",90,2,"Rolled sleeves, clean fit.",{s:"button",c:"#eef0f5"}],
 ["sh_loafers","a_shoes","Loafers",100,3,"Low and polished.",{s:"loafers",c:"#2a2226"}],
 ["pt_jeans","a_pants","Jeans",80,2,"Everyday denim.",{s:"jeans",c:"#4a6fa5"}]
];
var SLOTS=[["theme","Themes"],["frame","Frames"],["bg","Backdrops"],["pet","Companions"],["title","Titles"],["burst","Tap effects"],["buff","Permanent upgrades"],["a_hair","Hair styles"],["a_hairc","Hair dye"],["a_outfit","Outfits"],["a_eyes","Eye color"],["a_eyet","Eye types"],["a_xface","Face marks"],["a_beard","Facial hair"],["a_mask","Masks"],["a_top","Tops"],["a_pants","Bottoms"],["a_shoes","Shoes"],["a_acc","Accessories"],["a_back","Back gear"]];
var SHOPTABS=[["wardrobe","Wardrobe",["a_hair","a_hairc","a_eyet","a_xface","a_beard","a_mask","a_top","a_pants","a_shoes","a_acc","a_back"]],["upgrades","Upgrades",["buff"]],["interface","Interface",["theme","frame","bg","pet","title","burst"]]];
var THUMB={a_back:1,a_hair:1,a_hairc:1,a_eyes:1,a_eyet:1,a_xface:1,a_beard:1,a_mask:1,a_acc:1,a_top:1,a_pants:1,a_shoes:1};
var shopTab="wardrobe";
var BURST_PAL={bu_confetti:["#ff3d81","#ffc857","#4dffc3","#6cb6ff","#b388ff"],bu_star:["#fff8d6","#ffc857","#ffffff"]};
function shopItem(id){return SHOP.filter(function(x){return x[0]===id})[0]||null}
function eqItem(slot){var id=S.eq&&S.eq[slot];return (id&&S.owned&&S.owned[id])?shopItem(id):null}
function burstColor(i){var b=IF_TRY||eqItem("burst"),p=b&&BURST_PAL[b[0]];return p?p[i%p.length]:(i%2?"var(--accent)":"var(--gold)")}
function areaIcon(k){
  var a='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var d={board:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
   hideout:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
   shop:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
   trophy:'<path d="M8 4h8v6a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 14v4M9 20h6"/>',
   hall:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
   wheel:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>',
   train:'<path d="M7 12h10"/><rect x="3.5" y="7" width="3.5" height="10" rx="1"/><rect x="17" y="7" width="3.5" height="10" rx="1"/><path d="M2 10v4M22 10v4"/>',
   away:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
   lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'};
  return a+(d[k]||"")+'</svg>';
}
function petSvg(id,sz){
  var h='<svg class="crew" viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true">';
  if(id==="pet_slime")h+='<path d="M8 40 Q5 20 24 15 Q43 20 40 40Z" fill="var(--done)"/><ellipse cx="18" cy="29" rx="3" ry="4" fill="#07060d"/><ellipse cx="30" cy="29" rx="3" ry="4" fill="#07060d"/><path d="M20 35 Q24 38 28 35" stroke="#07060d" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="15" cy="23" rx="3" ry="2" fill="#fff" opacity=".5"/>';
  if(id==="pet_fox")h+='<path d="M7 7 L18 18 L9 29Z" fill="#ff8a3d"/><path d="M41 7 L30 18 L39 29Z" fill="#ff8a3d"/><ellipse cx="24" cy="30" rx="16" ry="13" fill="#ff8a3d"/><path d="M11 32 Q24 47 37 32 Q24 38 11 32Z" fill="#fff1e6"/><circle cx="18" cy="28" r="2.2" fill="#1a0800"/><circle cx="30" cy="28" r="2.2" fill="#1a0800"/><circle cx="24" cy="34" r="2" fill="#1a0800"/><circle class="tw" cx="41" cy="12" r="2" fill="var(--gold)"/>';
  if(id==="pet_cat")h+='<path d="M8 8 L19 18 L9 30Z" fill="#2a2650" stroke="var(--accent)" stroke-width="1.5"/><path d="M40 8 L29 18 L39 30Z" fill="#2a2650" stroke="var(--accent)" stroke-width="1.5"/><ellipse cx="24" cy="30" rx="16" ry="13" fill="#2a2650" stroke="var(--accent)" stroke-width="1.5"/><ellipse cx="18" cy="28" rx="3.2" ry="4" fill="var(--gold)"/><ellipse cx="30" cy="28" rx="3.2" ry="4" fill="var(--gold)"/><rect x="17.2" y="25" width="1.6" height="6" fill="#07060d"/><rect x="29.2" y="25" width="1.6" height="6" fill="#07060d"/>';
  return h+'</svg>';
}
function petHtml(){var p=eqItem("pet");return p?'<div class="pet">'+petSvg(p[0],46)+'</div>':''}
function cupSvg(c,sz){
  return '<svg viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path d="M14 7h20v11a10 10 0 0 1-20 0z" fill="'+c+'"/><path d="M14 10H8q0 10 8 11M34 10h6q0 10-8 11" fill="none" stroke="'+c+'" stroke-width="3" stroke-linecap="round"/><rect x="21" y="27" width="6" height="9" fill="'+c+'"/><rect x="13" y="36" width="22" height="6" rx="2" fill="'+c+'"/><path d="M19 11v8" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/></svg>';
}
function areaArt(k){
  if(k!=="shop"&&k!=="trophy")return '<div style="display:grid;place-items:center;width:100%;height:84px;color:var(--accent);filter:drop-shadow(0 0 12px var(--accent))">'+areaIcon(k).replace("<svg ","<svg width=\"56\" height=\"56\" ")+'</div>';
  if(k==="shop")return '<svg class="room" viewBox="0 0 120 72" width="100%" aria-hidden="true"><rect width="120" height="72" fill="var(--surface)"/><rect y="58" width="120" height="14" fill="var(--line)"/><rect x="24" y="28" width="72" height="30" fill="var(--surface2)" stroke="var(--line)"/><path d="M18 28 L26 10 H94 L102 28Z" fill="var(--accent)"/><path d="M40 10 L36 28M54 10 L52 28M68 10 L68 28M82 10 L84 28" stroke="var(--bg)" stroke-width="2" opacity=".5"/><rect x="50" y="38" width="20" height="20" fill="var(--bg)"/><circle cx="104" cy="16" r="5" fill="var(--gold)" class="tw"/><rect x="30" y="36" width="14" height="10" rx="2" fill="var(--accent2)" class="flick"/><rect x="76" y="36" width="14" height="10" rx="2" fill="var(--done)"/>'+'</svg>';
  return '<svg class="room" viewBox="0 0 120 72" width="100%" aria-hidden="true"><rect width="120" height="72" fill="var(--surface)"/><rect y="60" width="120" height="12" fill="var(--line)"/><circle cx="60" cy="34" r="28" fill="var(--gold)" opacity=".12"/><g transform="translate(36 6) scale(1)">'+cupSvg("var(--gold)",48).replace("<svg ","<svg x='0' y='0' ").replace('width="48" height="48"','width="48" height="48"')+'</g><g transform="translate(70 22)"><circle cx="0" cy="0" r="2" fill="var(--gold)" class="tw"/><circle cx="-60" cy="-10" r="1.6" fill="var(--gold)" class="tw"/></g></svg>';
}
function areaCard(a,i){
  if(a[0]==="hideout"||a[0]==="board")return "";
  return '<div class="unl reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s"><span class="label">New area</span><div class="unlart">'+areaArt(a[0])+'</div><b>'+esc(a[1])+' unlocked</b><small>'+esc(AREALINE[a[0]]||"")+'</small></div>';
}
function stockCard(n,i){
  return '<div class="unl reveal" style="animation-delay:'+(0.3+i*0.45).toFixed(2)+'s"><span class="label">Shop restocked</span><b>'+n+' new item'+(n===1?'':'s')+' on the shelves</b><small>Check the Shop tab.</small></div>';
}
function stripHtml(){
  var rk=RANKS[rankIdx()], t=eqItem("title");
  return '<div class="strip"><div class="who"><button class="avbtn" data-act="char" aria-label="Your character">'+'<span class="calfull">'+calImg(lookOf(),"idle",86,"")+'</span>'+'</button><div><span class="brand">'+(ART.logo_board?'<img class="blogo" src="'+ART.logo_board+'" alt="">':'<i></i>')+esc((S.char&&S.char.name)||"Quest Board")+'</span>'+'<div class="ttl">'+(t?'<span class="ttlx '+t[0]+'">'+esc(ifTitle(t))+'</span> &middot; ':'')+'v0.'+APPV+' &middot; <span id="savest">'+saveLbl()+'</span></div></div></div><span class="right"><span class="coinpill" aria-label="'+S.coins+' coins"><i class="coin"></i>'+S.coins+'</span><span class="rankpill">'+(ART["rank_"+rk.l]?'<img class="rkimg" src="'+ART["rank_"+rk.l]+'" alt="Rank '+rk.l+'">':'<b>'+rk.l+'</b>')+''+esc(tierName(S.gates.length))+'</span></span>'+(view==="board"?'<button class="infobtn" data-act="welcome" aria-label="A note from Cal: what SAYWHAT is">i</button>':'')+'</div>';
}
function nxLvl(){var lv=effLvl(),m=99;AREAS.forEach(function(a){if(lv<a[2]&&a[2]<m)m=a[2]});return m}
function navHtml(){
  var lv=effLvl();
  return '<nav class="nav"><div class="bar">'+AREAS.map(function(a){
    var lk=lv<a[2]||areaGate(a[0]),wt=typeof areaWaiting==="function"&&areaWaiting(a[0]);
    /* QA 2026-11-09: the Shop and Dungeons open with a room (areaGate), not a level, so their lock named "Lv 1" to a level 1 player */
    var rg=lk&&!wt&&lv>=a[2]?{shop:"Closet",away:"Lair"}[a[0]]:"";
    return '<button data-act="nav" data-v="'+a[0]+'" class="'+(view===a[0]?"on":"")+(lk?" lk":"")+'" aria-label="'+(wt?a[1]+", opens at your next level-up":rg?a[1]+", opens with the "+(rg==="Closet"?"Walk-in Closet":"Hero's Lair"):(lk&&a[2]!==nxLvl()?"Locked":a[1])+(lk?", unlocks at level "+a[2]:""))+'">'+areaIcon(lk?"lock":a[0])+'<span>'+(lk&&!rg&&a[2]!==nxLvl()?"&nbsp;":a[1])+'</span>'+(lk?'<small>'+(wt?'Soon':rg?rg:'Lv '+a[2])+'</small>':'')+'</button>';
  }).join("")+'</div></nav>';
}
function thumb(it){
  if(it[6]&&it[6].gar)return garThumb(it);
  var sl=it[1];
  if(THUMB[sl]){var o={};o[sl]=it[0];return '<div class="thumb">'+pxImg(lookOf(o),sl,96,72)+'</div>'}
  if(sl==="buff")return '<div class="thumb"><b class="mono" style="font-size:18px;padding:0;color:var(--accent)">'+esc(it[6].k==="xp"?"+"+it[6].v+"% XP":it[6].k==="coin"?"+"+it[6].v+"% coins":it[6].k==="freeze"?"+1 freeze":it[6].k==="streak"?"+5% cap":"+1 slot")+'</b></div>';
  if(sl==="theme")return '<div class="thumb" style="background:linear-gradient(120deg,'+it[6].a+','+it[6].b+')"></div>';
  if(sl==="frame")return '<div class="thumb"><div class="fthumb f_'+it[0]+'"></div></div>';
  if(sl==="bg")return '<div class="thumb" style="background:var(--bg)"><div class="bgx '+it[0]+'"></div></div>';
  if(sl==="pet")return '<div class="thumb">'+petSvg(it[0],54)+'</div>';
  if(sl==="title")return '<div class="thumb"><span class="mono" style="font-size:13px">'+esc(it[2])+'</span></div>';
  var pal=BURST_PAL[it[0]]||[],dots="";
  pal.forEach(function(c,i){dots+='<i style="display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 3px;background:'+c+';transform:rotate('+(i*30)+'deg)"></i>'});
  return '<div class="thumb">'+dots+'</div>';
}
function itemHtml(it){
  var own=!!S.owned[it[0]], on=own&&S.eq[it[1]]===it[0], can=S.coins>=it[3];
  if(it[1]==="buff"){var rq=it[6].req&&!S.owned[it[6].req]?shopItem(it[6].req):null;
    var bb=own?'<span class="chip" style="color:var(--done);border-color:var(--done);display:block;text-align:center">Active</span>':rq?'<button class="btn ghost" disabled>Needs '+esc(rq[2])+'</button>':'<button class="btn" data-act="qsview" data-id="'+it[0]+'">View · <i class="coin"></i>&nbsp;'+it[3]+'</button>';
    return '<div class="item'+(own?" eq":"")+(!own&&(!can||rq)?" cant":"")+'">'+thumb(it)+'<b>'+esc(it[2])+'</b><small>'+esc(it[5])+'</small><div class="act">'+bb+'</div></div>';}
  var btn=on?'<button class="btn ghost" data-act="unequip" data-id="'+it[1]+'">Equipped · Remove</button>'
    :own?'<button class="btn alt" data-act="equip" data-id="'+it[0]+'">Equip</button>'
    :'<button class="btn" data-act="qsview" data-id="'+it[0]+'">View · <i class="coin"></i>&nbsp;'+it[3]+'</button>';
  return '<div class="item'+(on?" eq":"")+(!own&&!can?" cant":"")+'">'+thumb(it)+'<b>'+esc(it[2])+'</b><small>'+esc(it[5])+'</small><div class="act">'+btn+'</div></div>';
}
function shopHtml(){
  var lv=effLvl(), owned=Object.keys(S.owned).length;
  var h='<section class="card panel"><h3 class="label">Shop</h3><p class="note">Every quest pays coins, roughly two and a half coins per XP, plus bonuses for crits, streak chests, trophies and level ups. The shelves restock as you level.</p>'
   +'<div class="sums"><div><b class="mono">'+S.coins+'</b><small>Coins</small></div><div><b class="mono">'+owned+'</b><small>Owned</small></div><div><b class="mono">'+S.earnedC+'</b><small>Earned</small></div></div></section>';
  h+='<div class="tabs">'+SHOPTABS.map(function(t){return '<button class="tab'+(shopTab===t[0]?" on":"")+'" data-act="stab" data-v="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>';
  var tab=SHOPTABS.filter(function(t){return t[0]===shopTab})[0]||SHOPTABS[0];
  if(tab[0]==="wardrobe")h+=charCard();
  if(tab[0]==="upgrades")h+='<section class="card panel"><p class="note">Permanent upgrades stack with your class and crew. Buy once, keep forever.</p></section>';
  SLOTS.filter(function(sl){return tab[2].indexOf(sl[0])>=0}).forEach(function(sl){
    var items=SHOP.filter(function(x){return x[1]===sl[0]&&!x[6].gar&&itemFits(x)});
    var vis=items.filter(function(x){return x[4]<=lv}), nxt=items.filter(function(x){return x[4]>lv})[0];
    if(!vis.length&&!nxt)return;
    h+='<section class="card panel"><h3 class="label">'+sl[1]+'</h3><div class="shopgrid">'+vis.map(itemHtml).join("")
     +(nxt?'<div class="item"><div class="thumb"><b style="font-size:26px;padding:0;color:var(--muted)">???</b></div><b>Sealed</b><small>Restocks at level '+nxt[4]+'</small></div>':'')+'</div></section>';
  });
  return h;
}
function trophyHtml(){
  var got=BADGES.filter(function(b){return S.badges[b[0]]});
  var h='<section class="card panel"><h3 class="label">Trophy room</h3><div class="sums"><div><b class="mono">'+got.length+'/'+BADGES.length+'</b><small>Trophies</small></div><div><b class="mono">'+S.total+'</b><small>Quests</small></div><div><b class="mono">'+(S.best||0)+'d</b><small>Best streak</small></div></div>'
   +'<div class="sums"><div><b class="mono">'+S.crits+'</b><small>Crits</small></div><div><b class="mono">'+S.vcount+'</b><small>Verified</small></div><div><b class="mono">'+S.gates.length+'</b><small>Jobs</small></div></div></section>';
  h+='<section class="card panel"><h3 class="label">Shelf</h3><div class="shelf">'+BADGES.map(function(b,i){
    var g=S.badges[b[0]];
    return '<div class="cup '+(g?"got":"lock")+'">'+cupSvg("hsl("+((i*37+20)%360)+" 85% 62%)",44)+'<b>'+(g?esc(b[1]):"???")+'</b><small>'+(g?esc(b[2]):"Sealed")+'</small></div>';
  }).join("")+'</div></section>';
  var cl=REWARDS.filter(function(r){return S.claimed[r[0]]});
  if(cl.length)h+='<section class="card panel"><h3 class="label">Rewards claimed</h3><div class="titles">'+cl.map(function(r){return '<span class="chip">'+esc(rwT(r))+'</span>'}).join("")+'</div></section>';
  return h;
}
function buy(id,ev){ifSound("buy");
  var it=shopItem(id); if(!it||S.owned[id]||effLvl()<it[4]||!itemFits(it))return;
  if(it[6]&&it[6].req&&!S.owned[it[6].req])return;
  if(S.coins<it[3]){pop("Need "+(it[3]-S.coins)+" more coins");return}
  S.coins-=it[3];S.spent+=it[3];S.owned[id]=true;if(it[1]!=="buff")S.eq[it[1]]=id;
  checkBadges();render();persist();
  if(ev&&ev.clientX!=null)burst(ev.clientX,ev.clientY,22);
  pop(it[1]==="buff"?it[2]+" is now active":"Bought "+it[2]+". Equipped.");
}
function equip(id){var it=shopItem(id);if(!it||!S.owned[id])return;if(qsOriginal(it))delete S.eq[it[1]];else S.eq[it[1]]=id;render();persist()}
function unequip(slot){delete S.eq[slot];render();persist()}

var PixAv=(function(){var module;var win={};
/* PixAv: modular pixel-art avatar engine. 48x100 grid, 3/4 pose facing left. */
(function(root){
var K=1.75,W=Math.round(48*K),H=Math.round(100*K);
function hx(c){var n=parseInt(c.slice(1),16);return [(n>>16)/255,((n>>8)&255)/255,(n&255)/255]}
function rgb2hsv(r,g,b){var mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h/=6;if(h<0)h+=1}return [h,mx?d/mx:0,mx]}
function hsv2rgb(h,s,v){var i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);i%=6;return [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i]}
function hex(a){return "#"+a.map(function(v){var x=Math.max(0,Math.min(255,Math.round(v*255)));return (x<16?"0":"")+x.toString(16)}).join("")}
function ramp(c){
  if(Array.isArray(c))return c;
  var r=hx(c),h=rgb2hsv(r[0],r[1],r[2]);
  function tw(t,a){var d=((t-h[0]+1.5)%1)-.5;return (h[0]+d*a+1)%1}
  function mk(dv,ds,hh){return hex(hsv2rgb(hh,Math.max(0,Math.min(1,h[1]+ds)),Math.max(0,Math.min(1,h[2]+dv))))}
  return [mk(.11,-.12,tw(.13,.12)),c,mk(-.15,.08,tw(.7,.12)),mk(-.32,.12,tw(.74,.2)),mk(-.46,.1,tw(.75,.25))];
}
function mixc(a,b,t){var A=hx(a),B=hx(b);return hex([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t])}
function olc(c){return mixc(c,'#1c0f12',.55)}
function skinRamp(c){var r=hx(c),h=rgb2hsv(r[0],r[1],r[2]);function mk(dv,ds,hh){return hex(hsv2rgb(((hh%1)+1)%1,Math.max(0,Math.min(1,h[1]+ds)),Math.max(0,Math.min(1,h[2]+dv))))}return [mk(.07,-.1,h[0]+.01),c,mk(-.1,.1,h[0]-.025),mk(-.22,.14,h[0]-.05),mk(-.4,.1,h[0]-.06)]}
function Spr(w,h){this.W=w||W;this.H=h||H;this.m=[];this.t=[];for(var y=0;y<this.H;y++){this.m.push(new Array(this.W).fill(null));this.t.push(new Array(this.W).fill(1))}this.R={}}
var P=Spr.prototype;
P.mat=function(n,c){this.R[n]=ramp(c)};
P._p=function(x,y,m,t){x=Math.round(x);y=Math.round(y);if(x>=0&&x<this.W&&y>=0&&y<this.H){this.m[y][x]=m;this.t[y][x]=t}};
P.raw=function(list,m,t){for(var i=0;i<list.length;i++)this._p(list[i][0],list[i][1],m,t)};
P.put=function(x,y,m,t){var q=this.tf(x,y);x=q[0];y=q[1];var a=Math.round(x*K),b=Math.round((x+1)*K),c=Math.round(y*K),d=Math.round((y+1)*K);for(var j=c;j<d;j++)for(var i=a;i<b;i++)this._p(i,j,m,t)};
P.dark=function(fn){var b=this.m.map(function(r){return r.slice()}),bt=this.t.map(function(r){return r.slice()});fn();for(var y=0;y<this.H;y++)for(var x=0;x<this.W;x++)if(this.m[y][x]&&(this.m[y][x]!==b[y][x]||this.t[y][x]!==bt[y][x]))this.t[y][x]=Math.min(3,this.t[y][x]+1)};
P.ell0=function(cx,cy,rx,ry,m){for(var y=Math.floor(cy-ry-1);y<=cy+ry+1;y++)for(var x=Math.floor(cx-rx-1);x<=cx+rx+1;x++){var dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry,d=dx*dx+dy*dy;if(d<=1){var l=.55*dx+.62*dy,t=(l<-.42&&d>.2)?0:(l>.32?2:1);if(d>.8&&l>.15)t=l>.55?3:2;this._p(x,y,m,t)}}};
P.poly0=function(pts,m,sr,hl,bot){sr=sr==null?.3:sr;hl=hl==null?.2:hl;var ys=pts.map(function(p){return p[1]}),y0=Math.floor(Math.min.apply(0,ys)),y1=Math.ceil(Math.max.apply(0,ys));
  for(var y=y0;y<=y1;y++){var yc=y+.5,xs=[];for(var i=0;i<pts.length;i++){var a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&yc<b[1])||(b[1]<=yc&&yc<a[1]))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
    xs.sort(function(p,q){return p-q});for(var k=0;k+1<xs.length;k+=2){var A=xs[k],B=xs[k+1],w=Math.max(B-A,1);for(var x=Math.floor(A+.5);x<Math.floor(B+.5);x++){var f=(x+.5-A)/w,t=f<hl?0:(f>1-sr?2:1);if(bot&&y>y1-bot)t=Math.min(3,t+1);this._p(x,y,m,t)}}}};
P.cap0=function(x0,y0,x1,y1,r0,r1,m){var L=Math.hypot(x1-x0,y1-y0)||1,R=Math.max(r0,r1);for(var y=Math.floor(Math.min(y0,y1)-R-1);y<=Math.max(y0,y1)+R+1;y++)for(var x=Math.floor(Math.min(x0,x1)-R-1);x<=Math.max(x0,x1)+R+1;x++){var px=x+.5,py=y+.5,u=((px-x0)*(x1-x0)+(py-y0)*(y1-y0))/(L*L);u=Math.max(0,Math.min(1,u));var cx=x0+u*(x1-x0),cy=y0+u*(y1-y0),r=r0+(r1-r0)*u;if(Math.hypot(px-cx,py-cy)<=r){var sd=(px-cx)/Math.max(r,.6),t=sd<-.4?0:(sd>.32?2:1);this._p(x,y,m,t)}}};
P.tf=function(x,y){var T=this.T,q=T?[T[0]+(x-T[0])*T[2],T[1]+(y-T[1])*T[3]]:[x,y],U=this.U;if(U){var yy=Math.min(q[1],U.py);q=[q[0]+U.dx+U.lean*(U.py-yy)/U.py,q[1]+U.dy]}var o=this.off;return o?[q[0]+o[0],q[1]+o[1]]:q};
P.ell=function(cx,cy,rx,ry,m){var T=this.T||[0,0,1,1],c=this.tf(cx,cy);this.ell0(c[0]*K,c[1]*K,rx*T[2]*K,ry*T[3]*K,m)};
P.poly=function(pts,m,sr,hl,bot){var self=this;this.poly0(pts.map(function(p){var c=self.tf(p[0],p[1]);return [c[0]*K,c[1]*K]}),m,sr,hl,bot==null?null:bot*K)};
P.cap=function(x0,y0,x1,y1,r0,r1,m){var T=this.T||[0,0,1,1],a=this.tf(x0,y0),b=this.tf(x1,y1),k=(T[2]+T[3])/2;this.cap0(a[0]*K,a[1]*K,b[0]*K,b[1]*K,r0*k*K,r1*k*K,m)};
P.line=function(x0,y0,x1,y1,m,t){var a=this.tf(x0,y0),b=this.tf(x1,y1),X0=Math.round(a[0]*K),Y0=Math.round(a[1]*K),X1=Math.round(b[0]*K),Y1=Math.round(b[1]*K),n=Math.max(Math.abs(X1-X0),Math.abs(Y1-Y0),1);for(var i=0;i<=n;i++)this._p(X0+(X1-X0)*i/n,Y0+(Y1-Y0)*i/n,m,t)};
P.hp=function(x,y){var a=this.tf(x,y);return [Math.round(a[0]*K),Math.round(a[1]*K)]};
P.px=function(list,m,t){for(var i=0;i<list.length;i++)this.put(list[i][0],list[i][1],m,t)};
P.grid=function(){
  var self=this,col=[],y,x;
  for(y=0;y<self.H;y++){col.push(new Array(self.W).fill(null));for(x=0;x<self.W;x++){var m=this.m[y][x];if(m)col[y][x]=this.R[m][this.t[y][x]]}}
  // internal edges: darken where material changes (definition lines)
  var soft={eye:1,white:1,hl:1,mouth:1,blush:1,brow:1,lash:1};
  for(y=1;y<self.H;y++)for(x=0;x<self.W;x++){var a=this.m[y][x],b=this.m[y-1][x];if(a&&b&&a!==b&&!soft[a]&&!soft[b]&&this.zi(b)>this.zi(a))col[y][x]=this.R[a][Math.min(3,this.t[y][x]+1)]}
  for(y=0;y<self.H;y++)for(x=1;x<self.W;x++){var a2=this.m[y][x],b2=this.m[y][x-1];if(a2&&b2&&a2!==b2&&!soft[a2]&&!soft[b2]&&this.zi(b2)>this.zi(a2))col[y][x]=this.R[a2][Math.min(3,this.t[y][x]+1)]}
  // selective outline
  var out=col.map(function(r){return r.slice()});
  for(y=0;y<self.H;y++)for(x=0;x<self.W;x++){if(this.m[y][x])continue;var best=null;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var X=x+d[0],Y=y+d[1];if(X>=0&&X<self.W&&Y>=0&&Y<self.H&&self.m[Y][X]&&!best)best=olc(self.R[self.m[Y][X]][4])});
    if(best)out[y][x]=best}
  return out;
};
P.zi=function(m){return (this.Z&&this.Z[m])||0};
function svg(grid,s,ox,oy){var o=[];ox=ox||0;oy=oy||0;for(var y=0;y<H;y++){var x=0;while(x<W){var c=grid[y][x];if(!c){x++;continue}var x1=x;while(x1+1<W&&grid[y][x1+1]===c)x1++;o.push('<rect x="'+(ox+x*s)+'" y="'+(oy+y*s)+'" width="'+((x1-x+1)*s)+'" height="'+s+'" fill="'+c+'"/>');x=x1+1}}return o.join("")}

/* ---------- body template ---------- */
function T(f){return f?{sh:[18,28.6],wa:[20,27],hip:[18.8,28.4],lr:[2.1,1.6,1.05],ar:[1.9,1.4],nearArm:[[18.2,26.6],[14.8,37],[11.8,45.6]],farArm:[[28.6,26.6],[31.8,37],[34.6,45]],
  nearLeg:[[21,47],[20.2,70],[19.8,91.5]],farLeg:[[26.6,47],[27.2,69],[27.6,89.5]]}
 :{sh:[15.6,31],wa:[17.8,29.4],hip:[17.6,30],lr:[2.9,2.2,1.5],ar:[2.3,1.7],nearArm:[[16.6,26.6],[13.4,38],[11.8,47.4]],farArm:[[30.4,26.6],[33.4,38],[35,46.8]],
  nearLeg:[[20.6,47],[19.6,70],[19.2,91.5]],farLeg:[[27,47],[27.6,69],[28,89.5]]}}
function hand(S,p,d){var x=p[0],y=p[1];S.ell(x,y+2,1.5,1.9,'skin');S.px([[x+d*1.6,y+1.6]],'skin',1);var fy=y+4;S.px([[x-1,fy],[x,fy+1],[x+1,fy]],'skin',2);S.px([[x-1.4,fy-.4]],'skin',1)}
function limb(S,seg,r0,r1,r2,m){S.cap(seg[0][0],seg[0][1],seg[1][0],seg[1][1],r0,r1,m);S.cap(seg[1][0],seg[1][1],seg[2][0],seg[2][1],r1,r2,m)}
function part(seg,u){/* point along 2-segment limb, u in [0,2] */var i=u<1?0:1,k=u<1?u:u-1;return [seg[i][0]+(seg[i+1][0]-seg[i][0])*k,seg[i][1]+(seg[i+1][1]-seg[i][1])*k]}
function limbTo(S,seg,u0,u1,r0,r1,m){var steps=Math.max(2,Math.round((u1-u0)*6));for(var i=0;i<steps;i++){var a=u0+(u1-u0)*i/steps,b=u0+(u1-u0)*(i+1)/steps,pa=part(seg,a),pb=part(seg,b),ra=r0+(r1-r0)*i/steps,rb=r0+(r1-r0)*(i+1)/steps;S.cap(pa[0],pa[1],pb[0],pb[1],ra,rb,m)}}

/* ---------- styles ---------- */
var HAIR={
 m:{
  textured:{name:"Textured",front:function(S){
    S.ell(24.4,9.2,7.6,5.6,"hair");S.poly([[16.6,10],[17,13.8],[18.4,15],[18.6,11.6]],"hair",.3,.2);S.poly([[30.4,10.6],[31.6,15],[32.4,12],[32.2,9]],"hair",.3,.2);
    S.poly([[18.2,9.4],[19.8,11.8],[21.2,9.6],[22.8,11.4],[24.2,9.4],[26,11.2],[27.6,9.6],[29.2,11],[30.6,9.2],[28,6],[21,6]],"hair",.3,.2);
    S.poly([[19,5.6],[20.4,2.2],[22.4,5]],"hair",.3,.2);S.poly([[22.4,5],[24.6,1.2],[26.4,5]],"hair",.3,.2);S.poly([[26.2,5.2],[28.6,2.6],[30,6.4]],"hair",.3,.2);S.poly([[17.6,7.4],[16.4,5],[19,6]],"hair",.3,.2);
    S.line(20.6,4.4,21.4,8.6,"hair",0);S.line(24.6,3,24.2,8.4,"hair",0);S.line(28.2,4.4,27.4,8.6,"hair",0);S.line(22.4,8,21.8,11,"hair",3);S.line(26.6,8,26,11,"hair",3);S.line(18.4,8,18.8,11,"hair",3);S.line(30,8,29.6,10.8,"hair",3)}},
  sidepart:{name:"Side part",front:function(S){
    S.ell(24.4,9.6,7.6,5.4,"hair");S.poly([[16.6,10],[17,14.4],[18.4,15.4],[18.8,11.4]],"hair",.3,.2);S.poly([[30.2,10.6],[31.6,15],[32.4,12],[32.2,9]],"hair",.3,.2);
    S.poly([[17.4,11],[17.6,7.4],[21,4.2],[27,3.8],[31.6,6.8],[32.4,10.4],[30.4,8.2],[26.6,7.6],[22.4,8.6],[19.8,11],[19,12.6]],"hair",.3,.25);
    S.line(21.4,4.8,19.4,9,"hair",0);S.line(23.4,4.4,21.4,8.4,"hair",0);S.line(25.4,4.2,23.6,7.6,"hair",1);S.line(27.4,4.6,26,7.4,"hair",1);S.line(21,4.6,28,5.2,"hair",0);
    S.line(29.2,6.8,30.8,9.6,"hair",3);S.line(26.8,8.2,29.4,9.6,"hair",3);S.line(19.6,10.6,19.2,12,"hair",3)}},
  slick:{name:"Slick back",front:function(S){
    S.ell(24.8,9,7.8,5.8,"hair");S.poly([[17,10],[17.4,13.8],[18.6,14.6],[19,10.8]],"hair",.3,.2);S.poly([[30.4,10.4],[31.8,14.4],[32.6,11.6],[32.4,8.6]],"hair",.3,.2);
    S.poly([[18,10],[18.6,7],[22,4],[28,3.6],[32.4,7.4],[32.6,10.6],[30,8],[24,8],[20,9.4]],"hair",.3,.25);
    for(var i=0;i<6;i++){S.line(19.6+i*2.2,9.6-i*.2,22+i*2.1,4.4+i*.1,"hair",i%2?1:0)}
    S.line(21,7.6,31,8.8,"hair",3);S.line(23,5,30,5.8,"hair",0)}},
  wolf:{name:"Wolf cut",shop:1,back:function(S){S.poly([[16.4,12],[32,11],[33.4,21],[31.6,24],[29,21],[26,23],[22.6,21],[19,24],[16,21]],"hair",.3,.15);S.line(17,14,16.4,20,"hair",3);S.line(31.6,13,32,20,"hair",3)},front:function(S){
    S.ell(24.4,9.2,7.8,5.6,"hair");S.poly([[16.6,10],[16.8,16.8],[18.6,16],[18.8,11.6]],"hair",.3,.2);S.poly([[30.2,10.6],[31.6,17],[32.6,13],[32.4,9]],"hair",.3,.2);
    S.poly([[17.6,9.6],[18.8,12],[20.6,9.8],[22.2,12],[24,9.6],[25.6,12],[27.4,9.8],[29,11.6],[30.8,9.6],[28,5.6],[21,5.6]],"hair",.3,.2);
    S.poly([[19,5.6],[20.6,2.6],[22.6,5]],"hair",.3,.2);S.poly([[24,4.6],[26,2],[28,5]],"hair",.3,.2);
    S.line(21,4.4,21.2,9,"hair",0);S.line(25.4,3.6,25,8.6,"hair",0);S.line(23,8,22.6,10.8,"hair",3);S.line(27.6,8,27.2,10.6,"hair",3)}},
  undercut:{name:"Undercut",shop:1,front:function(S){
    S.ell(24.6,8.8,7,5,"hair");S.poly([[18.4,10.4],[18.6,6.4],[22,3],[28,2.8],[31.8,6],[31.8,10.2],[29.4,8],[24.6,7.6],[21,9.4]],"hair",.3,.25);
    S.line(21,4,20,8.6,"hair",0);S.line(23.6,3.2,22.8,8,"hair",0);S.line(26,3,25.4,7.6,"hair",1);S.line(28.4,3.6,28,7.4,"hair",1);S.line(21.6,7.6,29.4,6.6,"hair",3);
    for(var y=9;y<15;y+=1){S.put(17.6,y,"hair",3);S.put(31.6,y,"hair",3)}}},
  buzz:{name:"Buzz",front:function(S){
    S.ell(24.4,10,7.2,5,"hair");S.poly([[17.6,11.4],[17.8,14.6],[19,13.2]],"hair",.3,.2);S.poly([[30.4,11.4],[31.2,14.4],[31.8,11]],"hair",.3,.2);
    for(var x=19;x<31;x+=1.6){S.put(x,6.4+((x*7)%3)*.8,"hair",(x*3)%2?0:2)}}}
 },
 f:{
  long:{name:"Long straight",back:function(S){S.poly([[16.4,11],[32,10],[33.6,26],[33,40],[30,44],[28.6,30],[19.6,30],[18,42],[15,40],[14.6,26]],"hair",.3,.15);S.px([[32,30],[32,34],[31,38],[16,30],[16,34]],"hair",0)},
       front:function(S){S.ell(24.4,10.4,7.6,5.6,"hair");S.poly([[16.4,10],[31.8,9.4],[32.4,22],[30.6,15.4],[28.6,13],[25.6,12.2],[22.4,13.8],[19.6,12.6],[17.6,15.6],[16,22]],"hair",.25,.18);S.px([[19,6],[20,5],[21,5],[22,6],[20,7]],"hair",0);S.px([[17,18],[17,21],[31,18],[31,21]],"hair",2)}},
  waves:{name:"Long waves",back:function(S){S.poly([[16,11],[32.4,10],[34.4,22],[33,30],[34.6,38],[31.6,46],[28.6,42],[29.6,30],[19,30],[18,40],[15,46],[13.4,38],[15,30],[14,20]],"hair",.3,.15);S.px([[33,24],[32,27],[33,33],[32,36],[15,24],[16,27],[15,33],[16,37]],"hair",0);S.px([[31,29],[30,40],[17,30]],"hair",3)},
       front:function(S){S.ell(24.4,10.4,7.8,5.6,"hair");S.poly([[16.2,10],[32,9.4],[33,22],[30.8,15.2],[28.6,12.6],[25.2,12],[22,13.6],[19.4,12.2],[17.4,15.6],[15.6,22]],"hair",.25,.18);S.px([[19,6],[20,5],[21,5],[22,6]],"hair",0);S.px([[16,19],[17,21],[32,19],[31,21]],"hair",2)}},
  pony:{name:"High ponytail",back:function(S){S.cap(30,8,35,22,3.4,2.6,"hair");S.cap(35,22,34,36,2.6,1.3,"hair");S.px([[34,24],[35,28],[34,32]],"hair",0)},
       front:function(S){S.ell(24.4,10.6,7.6,5.6,"hair");S.poly([[16.6,11],[31.8,10.4],[32,15],[29,12],[26,13.4],[23,11.4],[20,13.4],[17,16]],"hair",.3,.22);S.px([[19,6],[20,5],[21,5]],"hair",0);S.px([[31,8],[32,8],[31,9]],"acc2",1)}},
  twin:{name:"Twin tails",shop:1,back:function(S){S.cap(15.6,10,12,24,3,2.6,"hair");S.cap(12,24,13,38,2.6,1.4,"hair");S.cap(33.2,10,36.4,24,3,2.6,"hair");S.cap(36.4,24,35.4,38,2.6,1.4,"hair");S.px([[12,26],[13,30],[36,26],[35,30]],"hair",0)},
       front:function(S){S.ell(24.4,10.4,7.6,5.6,"hair");S.poly([[16.4,10],[31.8,9.4],[32,17],[30,13.2],[27,12.4],[24,13.8],[21,12.2],[18.6,14],[16.6,18]],"hair",.25,.2);S.px([[19,6],[20,5],[21,5]],"hair",0);S.px([[15,10],[16,10],[33,10],[34,10]],"acc2",1)}},
  buns:{name:"Space buns",shop:1,back:function(S){S.ell(18.6,4.6,3.4,3.2,"hair");S.ell(30.4,4.6,3.4,3.2,"hair");S.px([[18,3],[30,3]],"hair",0)},
       front:function(S){S.ell(24.4,10.6,7.6,5.4,"hair");S.poly([[16.6,11],[31.8,10.4],[32.2,19],[30,14],[27,12.6],[24,14],[21,12.4],[18.4,14.6],[16.6,19]],"hair",.25,.2);S.px([[20,6],[21,6],[22,6]],"hair",0)}},
  bob:{name:"Bob",back:function(S){S.poly([[16,11],[32.4,10],[33.4,22],[31,24.6],[17.6,24.6],[15,22]],"hair",.3,.15)},
       front:function(S){S.ell(24.4,10.4,7.8,5.6,"hair");S.poly([[16.2,10],[32,9.4],[33,23],[31,16],[29,13.4],[26,13.6],[24,12.4],[21,13.8],[18.6,13],[17,17],[15.6,23]],"hair",.25,.2);S.px([[20,5],[21,5],[22,5],[23,6]],"hair",0);S.px([[17,20],[31,20]],"hair",2)}}
 }
};
function build(L){
  var S=new Spr(L.cw,L.ch),f=L.sex==="f",B=T(f);S.off=L.off||null;
  if(L.pose!=null){var ph=L.pose/4*Math.PI*2,sw=Math.sin(ph),lf=Math.max(0,Math.cos(ph)),lf2=Math.max(0,-Math.cos(ph));
    B.nearLeg[1][0]+=sw*2.2;B.nearLeg[2][0]+=sw*4.4;B.nearLeg[2][1]-=lf*3.2;B.nearLeg[1][1]-=lf*1.6;
    B.farLeg[1][0]-=sw*2.2;B.farLeg[2][0]-=sw*4.4;B.farLeg[2][1]-=lf2*3.2;B.farLeg[1][1]-=lf2*1.6;
    B.nearArm[1][0]-=sw*1.6;B.nearArm[2][0]-=sw*3.2;B.nearArm[2][1]-=lf2*1.2;
    B.farArm[1][0]+=sw*1.6;B.farArm[2][0]+=sw*3.2;B.farArm[2][1]-=lf*1.2}
  S.Z={skin:0,pants:2,top:4,inner:3,hair:6,shoes:1,acc:7,acc2:7,coat:5};
  S.mat("skin",skinRamp(L.skin));S.mat("hair",L.hair);S.mat("eye",["#ffffff",L.eyes,"#16121e","#16121e","#16121e"]);S.mat("white",["#ffffff","#f6f5fb","#dcdeea","#a4a8bf","#7a7e98"]);
  S.mat("lash",["#2a1e26","#2a1e26","#1a1218","#1a1218","#1a1218"]);S.mat("hl",["#ffffff","#ffffff","#ffffff","#ffffff","#ffffff"]);
  S.mat("mouth",["#e09a90","#c0646a","#8e3c48","#6a2a36","#5a2430"]);S.mat("blush",["#f4a0a0","#f09a9a","#e08888","#d07878","#c06a6a"]);
  if(L.act){var a=L.act,sn=B.nearArm[0],sf=B.farArm[0];
    function arm(seg,sh,e,hd){seg[1]=[sh[0]+e[0],sh[1]+e[1]];seg[2]=[sh[0]+hd[0],sh[1]+hd[1]]}
    if(a==="sit"||a==="read"||a==="eat"||a==="type"){
      B.nearLeg=[B.nearLeg[0],[B.nearLeg[0][0]-8,B.nearLeg[0][1]+3.6],[B.nearLeg[0][0]-7.4,B.nearLeg[0][1]+24.4]];
      B.farLeg=[B.farLeg[0],[B.farLeg[0][0]-8,B.farLeg[0][1]+3],[B.farLeg[0][0]-7.4,B.farLeg[0][1]+23.4]]}
    if(a==="reach"||a==="water"){arm(B.nearArm,sn,[-3.4,8.4],[-10,12]);arm(B.farArm,sf,[2,8],[-4,14])}
    if(a==="work2"||a==="type"){arm(B.nearArm,sn,[-4,9],[-9,17]);arm(B.farArm,sf,[-2,9],[-8,13])}
    if(a==="up"){arm(B.nearArm,sn,[-3.4,-6],[-2.4,-19]);arm(B.farArm,sf,[3.4,-6],[2.4,-18])}
    if(a==="down"){arm(B.nearArm,sn,[-2,10],[-2,21]);arm(B.farArm,sf,[2,10],[2,21])}
    if(a==="eat"){arm(B.nearArm,sn,[-4,8],[3.6,-4.2]);arm(B.farArm,sf,[2,8],[-4,14])}
    if(a==="carry"){arm(B.nearArm,sn,[-4.4,8],[-9.4,10.6]);arm(B.farArm,sf,[1,8],[-7,11.6])}
    if(a==="read"){arm(B.nearArm,sn,[-4.4,8],[-8,9]);arm(B.farArm,sf,[0,8],[-6,10])}
    if(a==="wave"){arm(B.nearArm,sn,[-6.4,-3],[-9,-15]);}
    if(a==="lean"){arm(B.nearArm,sn,[-3,8],[-8,14]);arm(B.farArm,sf,[2,9],[-2,17])}
  }
  var top=L.top||{s:"tee",c:"#e9edf5"},bot=L.bottom||{s:"pants",c:"#2f3a5a"},shoe=L.shoes||{s:"sneakers",c:"#f2f3f8"};
  S.mat("top",top.c);S.mat("inner",top.c2||"#f2f2f6");S.mat("pants",bot.c);S.mat("shoes",shoe.c);S.mat("sole",["#ffffff","#eceef5","#c4c8da","#8a8ea8","#6a6e88"]);
  S.mat("acc",L.accC||"#c9ced9");S.mat("acc2",L.acc2C||"#f2f2f6");
  var hs=HAIR[f?"f":"m"][L.hair_s]||HAIR[f?"f":"m"][f?"long":"textured"];
  var RG=L.rig,RU=null;
  if(RG){
    RU={dx:RG.dx||0,dy:RG.dy||0,lean:RG.lean||0,py:46};
    var iw=function(p){var y=p[1]-RU.dy,yy=Math.min(y,RU.py);return [p[0]-RU.dx-RU.lean*(RU.py-yy)/RU.py,y]};
    var ik=function(a,b,l1,l2,pick){var dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||.01,mx=l1+l2-.05;if(d>mx){b=[a[0]+dx*mx/d,a[1]+dy*mx/d];dx=b[0]-a[0];dy=b[1]-a[1];d=mx}
      var ca=Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))),an=Math.atan2(dy,dx),da=Math.acos(ca),c1=[a[0]+l1*Math.cos(an+da),a[1]+l1*Math.sin(an+da)],c2=[a[0]+l1*Math.cos(an-da),a[1]+l1*Math.sin(an-da)],e=pick(c1,c2);return [a,e,b]};
    var lo=function(c1,c2){return c1[1]>c2[1]?c1:c2},up=function(c1,c2){return c1[1]<c2[1]?c1:c2},fw=function(c1,c2){return c1[0]<c2[0]?c1:c2},bk=function(c1,c2){return c1[0]>c2[0]?c1:c2};
    var armT=function(seg,spec){var sh=seg[0],l1=Math.hypot(seg[1][0]-sh[0],seg[1][1]-sh[1]),l2=Math.hypot(seg[2][0]-seg[1][0],seg[2][1]-seg[1][1]),tg=spec[2]==="w"?iw([spec[0],spec[1]]):[spec[0],spec[1]];return ik(sh,tg,l1,l2,RG.eup?up:(RG.eout?bk:lo))};
    if(RG.n)B.nearArm=armT(B.nearArm,RG.n);if(RG.f)B.farArm=armT(B.farArm,RG.f);
    var legT=function(seg,o,pick){var hip=[seg[0][0]+RU.dx+(RG.hx||0),seg[0][1]+RU.dy],l1=Math.hypot(seg[1][0]-seg[0][0],seg[1][1]-seg[0][1]),l2=Math.hypot(seg[2][0]-seg[1][0],seg[2][1]-seg[1][1]),ft=[seg[2][0]+o[0],seg[2][1]+o[1]];return ik(hip,ft,l1,l2,pick)};
    if(!RG.keep){B.nearLeg=legT(B.nearLeg,RG.nf||[0,0],RG.kb?bk:fw);B.farLeg=legT(B.farLeg,RG.ff||[0,0],RG.kb?bk:fw)}
    S.uw=function(p){var yy=Math.min(p[1],RU.py);return [p[0]+RU.dx+RU.lean*(RU.py-yy)/RU.py,p[1]+RU.dy]};
  }
  S.U=RU;
  // back hair
  S.T=[24.4,23,.88,.94];
  if(hs.back){hs.back(S);if(f&&(L.hair_s==='long'||L.hair_s==='waves')){S.line(16.4,13,15.4,24,'hair',0);S.line(32,13,33.2,26,'hair',0);S.line(17.6,28,16.4,40,'hair',3);S.line(30.6,28,31.6,40,'hair',3);S.line(15.6,26,14.8,34,'hair',2)}}
  S.T=null;
  if(L.back==="cape"){S.mat("cape",L.accC||"#b8323a");S.poly([[17.4,24],[30.6,24],[35,62],[13,62]],"cape",.35,.2,2);S.line(14,61.4,34,61.4,"cape",0)}
  if(L.back==="wings"){S.mat("wing","#2c2640");S.mat("wglow",L.accC||"#8a4dff");S.poly([[18,25],[4,6],[0,22],[2,38],[8,48],[16,40]],"wing",.4,.15);S.poly([[30,25],[44,6],[48,22],[46,38],[40,48],[32,40]],"wing",.4,.15);S.line(5,8,1,22,"wglow",1);S.line(43,8,47,22,"wglow",1);S.line(3,30,9,46,"wglow",1);S.line(45,30,39,46,"wglow",1)}
  if(L.back==="katana"){S.mat("blade",["#ffffff","#dfe3ee","#9aa3b5","#6a7287","#4a5064"]);S.mat("hilt",["#4a3f66","#2a2440","#1c1830","#141022","#0c0a16"]);S.mat("gold","#e2b44a");S.cap(31,53,18,13,.7,.7,"blade");S.cap(18,13,15.6,6.4,1,1,"hilt");S.px([[16.6,12.6],[17.6,12.4],[18.6,12.2],[19.4,12]],"gold",1)}
  // far arm (skin) + far leg (skin)
  S.dark(function(){limb(S,B.farArm,B.ar[0],B.ar[0]-.2,B.ar[1],"skin");hand(S,B.farArm[2],1)});
  var _U=S.U;S.U=null;
  S.dark(function(){limb(S,B.farLeg,B.lr[0],B.lr[1],B.lr[2],"skin")});
  // far shoe
  var fl=B.farLeg[2],nl=B.nearLeg[2];
  function shoeAt(p,near){var x=p[0],y=p[1],pts=near?[[x-2.6,y-.6],[x+2,y-.6],[x+2.6,y+3],[x-.6,y+5.2],[x-4.4,y+4.8],[x-4,y+2]]:[[x-2,y-.6],[x+2.2,y-.6],[x+3.2,y+2.4],[x+1.2,y+4.2],[x-2.6,y+3.8]];
    if(shoe.s==="boots"){S.cap(x,y-6,x,y,B.lr[2]+.9,B.lr[2]+1,"shoes")}
    S.poly(pts,"shoes",.35,.3);
    var by=Math.round(y+(near?4.6:3.6));if(shoe.s!=="boots"&&shoe.s!=="flats"){for(var k=-4;k<=2;k++)S.put(x+k,by,"sole",1)}
    if(shoe.s==="sneakers"&&near){S.put(x-2,y+1,"shoes",3);S.put(x,y+1.2,"shoes",3);S.put(x-1,y+2,"shoes",3)}}
  S.dark(function(){shoeAt(fl,false)});
  // near leg skin
  limb(S,B.nearLeg,B.lr[0],B.lr[1],B.lr[2],"skin");
  shoeAt(nl,true);
  // bottoms
  var bs=bot.s;
  function legCloth(seg,uEnd,extra,near){var fn=function(){limbTo(S,seg,0,uEnd,B.lr[0]+.6+extra,(uEnd>1.4?B.lr[2]+.7:B.lr[1]+.5)+extra*.6,"pants")};near?fn():S.dark(fn)}
  if(bs==="skirt"){S.poly([[B.hip[0]-.4,43],[B.hip[1]+.4,43],[B.hip[1]+2.6,59],[B.hip[0]-2.8,59]],"pants",.3,.2);for(var x=B.hip[0]+2;x<B.hip[1];x+=3){for(var yy=47;yy<59;yy++)S.put(x-(yy-47)*.12,yy,"pants",2)}}
  else{
    var uE=bs==="shorts"?.62:(bs==="joggers"?1.94:1.98),ex=bs==="cargo"?.5:(bs==="wide"?1.1:0);
    legCloth(B.farLeg,uE,ex,false);legCloth(B.nearLeg,uE,ex,true);
    S.U=RU?{dx:RU.dx,dy:RU.dy,lean:0,py:46}:null;
    S.poly([[B.hip[0]-.4,42],[B.hip[1]+.4,42],[B.hip[1]+.4,50],[24.6,51],[23.6,48],[22,51],[B.hip[0]-.4,50]],"pants",.3,.2);
    S.px([[23,44],[23,45],[23,46],[23,47]],"pants",3);
    S.U=null;
    if(bs==="cargo"){var p=part(B.nearLeg,.56);S.poly([[p[0]-3.6,p[1]-1],[p[0]-.4,p[1]-1],[p[0]-.2,p[1]+5],[p[0]-3.4,p[1]+5]],"pants",.55,.1);S.px([[p[0]-3,p[1]],[p[0]-2,p[1]],[p[0]-1,p[1]]],"pants",3)}
    if(bs==="joggers"){var a=part(B.nearLeg,1.9),b=part(B.farLeg,1.9);S.px([[a[0]-2,a[1]],[a[0]-1,a[1]],[a[0],a[1]],[a[0]+1,a[1]]],"pants",3);S.dark(function(){S.px([[b[0]-1,b[1]],[b[0],b[1]],[b[0]+1,b[1]]],"pants",3)})}
    if(bs!=="shorts"){var k1=part(B.nearLeg,1.0),k2=part(B.farLeg,1.05);S.px([[k1[0]-1,k1[1]],[k1[0],k1[1]+1]],"pants",2);S.px([[k2[0],k2[1]]],"pants",3)}
  }
  S.U=_U;
  // torso
  var ts=top.s,long=ts==="coat";
  var hem=long?(f?57:64):(ts==="crop"?38:46.4);
  S.poly([[B.sh[0],25],[B.sh[1],25.4],[B.wa[1]+.3,36],[B.hip[1]+(long?2.6:.6),hem],[B.hip[0]-(long?3:.6),hem],[B.wa[0]-.3,36]],"top",.32,.2,2);
  if(f)S.px([[21,31],[22,32],[26,32],[27,31]],"top",2);
  // far sleeve (behind torso? draw before torso visually) -> draw dark after torso but clipped by order: draw now with dark
  var sl=ts==="tee"?.62:(ts==="tank"?0:1.94);
  if(sl>0)S.dark(function(){limbTo(S,B.farArm,0,sl,B.ar[0]+.3,B.ar[1]+.3,"top")});
  // near arm skin + sleeve
  limb(S,B.nearArm,B.ar[0],B.ar[0]-.2,B.ar[1],"skin");hand(S,B.nearArm[2],-1);
  if(sl>0){limbTo(S,B.nearArm,0,sl,B.ar[0]+.35,B.ar[1]+.35,"top");var e=part(B.nearArm,1.0);S.px([[e[0]-1,e[1]],[e[0],e[1]+1]],"top",2);if(sl>1.5){var c=part(B.nearArm,1.9);S.px([[c[0]-2,c[1]],[c[0]-1,c[1]],[c[0],c[1]],[c[0]+1,c[1]]],"top",3)}}
  // top details
  if(ts==="tee"||ts==="longsleeve"){S.px([[22,25],[23,26],[24,26],[25,26],[26,25]],"skin",1);S.px([[21,25],[27,25]],"top",3)}
  if(ts==="tank"){S.px([[21,25],[22,26],[23,27],[24,27],[25,27],[26,26],[27,25]],"skin",1);S.px([[20,25],[20,26],[28,25],[28,26]],"top",3)}
  if(ts==="hoodie"){S.poly([[19.4,23.6],[29.4,23.6],[28.4,28],[24.2,30],[20.6,28]],"top",.5,.45);S.px([[22,30],[22,31],[22,32],[26,30],[26,31],[26,32]],"inner",0);S.px([[22,33],[26,33]],"inner",2);S.poly([[19,38],[29,38],[30,45],[18.4,45]],"top",.55,0);S.px([[19,38],[20,38],[21,38],[22,38],[23,38],[24,38],[25,38],[26,38],[27,38],[28,38]],"top",3);for(var x2=B.hip[0];x2<=B.hip[1];x2++)S.put(x2,46,"top",3)}
  if(ts==="jacket"||ts==="cardigan"||ts==="coat"){S.poly([[22,25],[26.4,25],[26,hem-1],[22.4,hem-1]],"inner",.3,.2);for(var y2=26;y2<hem-1;y2++){S.put(21.4,y2,"top",0);S.put(26.8,y2,"top",2)}
    if(ts!=="cardigan"){S.px([[21,25],[20,26],[20,27],[21,28],[27,25],[28,26],[28,27],[27,28]],"top",0)}
    if(ts==="cardigan")for(var y3=30;y3<hem;y3+=5)S.put(21,y3,"top",3);
    if(ts==="coat"){S.poly([[17.6,48],[21,48],[21,53],[17.8,53]],"top",.6,.1);S.poly([[27.4,48],[30.6,48],[30.8,53],[27.4,53]],"top",.8,.1);S.px([[x2=18,42]],"top",3)}}
  if(top.logo){S.px([[25,31],[26,30],[27,31],[28,30]],"lash",1)}
  S.T=[24.4,23,.88,.94];
  // neck + head
  S.cap(24,21,24.2,25,2.1,2.3,"skin");S.px([[23,24],[24,24],[25,24]],"skin",2);
  S.ell(24.4,13.4,6.3,7,"skin");
  S.poly([[17.8,14],[31,14],[30,19],[27.6,22],[24,23.4],[21,22],[18.6,19]],"skin",.28,.18);
  S.dark(function(){S.ell(30.6,15.6,1.3,1.9,"skin")});
  // face
  var ey=16;
  if(L.beard){S.mat("beard",L.beard);S.poly([[18,18],[19.4,21],[21.4,23],[24,24.4],[27,23],[29.4,20],[30.6,16.6],[30.8,20.6],[28,24.2],[24.2,25.6],[20.6,24.2],[18.2,21]],"beard",.3,.2);S.px([[20,ey+5],[21,ey+5],[22,ey+5],[23,ey+5],[24,ey+5]],"beard",1);S.px([[21,ey+6],[22,ey+6]],"mouth",2)}
  // front hair
  hs.front(S);
  (function(){var a=S.hp(19.4,16.2),b=S.hp(26.2,16.2),x0=a[0],y0=a[1],x1=b[0],y1=b[1];
    var hair2=f;
    S.raw([[x0-2,y0-1],[x0-1,y0-1],[x0,y0-1],[x0+1,y0-1],[x0+2,y0-1]],"lash",1);if(f)S.raw([[x0-3,y0-2],[x0-3,y0-1]],"lash",1);
    S.raw([[x0-2,y0],[x0-2,y0+1],[x0+2,y0]],"white",1);S.raw([[x0-1,y0],[x0,y0],[x0+1,y0],[x0-1,y0+1],[x0,y0+1],[x0+1,y0+1]],"eye",1);S.raw([[x0-1,y0+2],[x0,y0+2],[x0+1,y0+2]],"eye",2);S.raw([[x0,y0+1]],"eye",3);S.raw([[x0-1,y0]],"hl",1);
    S.raw([[x1-1,y1-1],[x1,y1-1],[x1+1,y1-1],[x1+2,y1-1]],"lash",1);if(f)S.raw([[x1+3,y1-2],[x1+3,y1-1]],"lash",1);
    S.raw([[x1-1,y1],[x1+2,y1]],"white",1);S.raw([[x1,y1],[x1+1,y1],[x1,y1+1],[x1+1,y1+1]],"eye",1);S.raw([[x1,y1+2],[x1+1,y1+2]],"eye",2);S.raw([[x1,y1]],"hl",1);
    if(f){var c=S.hp(17.4,20),d=S.hp(27.8,20);S.raw([[c[0],c[1]],[c[0]+1,c[1]],[c[0]+2,c[1]],[c[0]+1,c[1]+1],[d[0],d[1]],[d[0]+1,d[1]],[d[0]+2,d[1]],[d[0]+1,d[1]+1]],"blush",1)}
    var bt=f?2:2;S.line(18.2,13.6,21.6,13,"hair",bt);S.line(25,13,28,13.6,"hair",bt);if(!f){S.line(18.2,14.2,21.6,13.6,"hair",bt);S.line(25,13.6,28,14.2,"hair",bt)}
    var n=S.hp(22.4,19.4);S.raw([[n[0],n[1]],[n[0]-1,n[1]+1]],"skin",3);
    var m=S.hp(21.6,22.6),w=f?4:6;for(var i=0;i<w;i++)S._p(m[0]+i,m[1]+(i===0||i===w-1?-1:0),"mouth",f?1:2);if(f)S._p(m[0]+1,m[1]+1,"mouth",0)})();
  if(L.tips){S.mat("tips",L.tips);[[21,5],[22,4],[23,4],[24,4],[25,5],[22,5],[24,5],[26,6],[20,6],[23,6]].forEach(function(p,i){S.put(p[0],p[1],"tips",i%3?1:0)})}
  // accessories
  var A=L.acc||[];
  if(A.indexOf("glasses")>=0){S.px([[17,15],[18,15],[19,15],[20,15],[21,15],[24,15],[25,15],[26,15],[27,15],[22,16],[23,16],[17,16],[21,16],[24,16],[27,16]],"acc",3)}
  if(A.indexOf("earring")>=0){S.put(30,19,"acc",0)}
  if(A.indexOf("chain")>=0){var T0=S.T;S.T=null;[[21,26],[21,27],[22,28],[22,29],[23,30],[24,30],[25,30],[26,29],[26,28],[27,27],[27,26]].forEach(function(p,i){S.put(p[0],p[1],"acc",i%2)});if(A.indexOf("cross")>=0)S.px([[24,31],[24,32],[24,33],[23,32],[25,32]],"acc",0);S.T=T0}
  if(A.indexOf("phones")>=0){S.poly([[17,25.4],[31,25.6],[30,28],[18,28]],"acc2",.3,.2);S.ell(17.4,26.6,2.2,2.4,"acc2");S.dark(function(){S.ell(30.8,26.6,2,2.2,"acc2")})}
  if(A.indexOf("flower")>=0){S.mat("flower","#e0303a");S.ell(29.6,9.6,2.2,2,"flower");S.put(29,9,"flower",0)}
  if(A.indexOf("hoops")>=0){S.mat("gold","#e2b44a");S.px([[30,19],[31,20],[31,21],[30,22],[29,21]],"gold",1)}
  if(A.indexOf("bow")>=0){S.mat("bow","#f6f3f8");S.poly([[27,4],[33,3],[32.4,8],[28,8]],"bow",.3,.2)}
  if(A.indexOf("halo")>=0){S.mat("halo","#ffd35a");for(var ha=0;ha<6.3;ha+=.12)S.put(24.4+6.6*Math.cos(ha),-0.6+1.5*Math.sin(ha),"halo",ha>3.2?0:1)}
  if(A.indexOf("crown")>=0){S.mat("crown","#f2c14e");S.poly([[17.6,7.4],[31.2,7.4],[32,1.4],[28,4.6],[24.4,.2],[20.8,4.6],[16.8,1.4]],"crown",.3,.2);S.px([[24,4],[20,5],[28,5]],"lash",1)}
  if(A.indexOf("sunglasses")>=0){S.px([[17,15],[18,15],[19,15],[20,15],[21,15],[24,15],[25,15],[26,15],[27,15],[18,16],[19,16],[20,16],[25,16],[26,16],[22,16],[23,16]],"lash",1)}
  S.T=null;var o0=S.off||[0,0];S.hands=S.uw?[B.nearArm[2],B.farArm[2]].map(function(p){var q=S.uw(p);return [(q[0]+o0[0])*K,(q[1]+o0[1])*K]}):null;return S;
}

function dog(name){
  var S=new Spr();
  if(name==="chopstick"){
    S.mat("blk","#2a2224");S.mat("tan","#b8743e");S.mat("nose",["#111","#111","#000","#000","#000"]);S.mat("eye",["#ffffff","#2a1a14","#000","#000","#000"]);S.mat("col","#e9e2c8");S.mat("tag","#3a3f55");
    S.ell(15,24,7,6,"blk");S.cap(12,17,11,27,3.2,3,"tan");S.cap(17,27,17,30,1.6,1.4,"tan");S.cap(12,26,11,30,1.6,1.4,"tan");
    S.ell(21,27,4,3,"blk");S.cap(24,26,28,21,1.4,1.0,"blk");S.px([[28,20],[29,19],[27,21]],"blk",1);
    S.ell(12,11,5.6,5.2,"blk");S.poly([[7,11],[12,9],[16,12],[14,16],[10,17],[6,14]],"tan",.3,.2);
    S.ell(7.4,14.6,2.6,2,"tan");S.px([[5,14],[6,14],[5,15]],"nose",1);
    S.px([[9,11],[10,11],[13,11],[14,11]],"eye",1);S.px([[9,10],[14,10]],"tan",0);S.px([[9,11],[13,11]],"eye",0);
    S.poly([[7,7],[10,5],[10,10],[6,12],[3,11],[4,8]],"blk",.4,.2);S.px([[2,9],[2,11],[3,12],[4,13],[1,10]],"blk",2);
    S.poly([[15,6],[19,4],[21,8],[19,12],[16,10]],"blk",.4,.2);S.px([[21,9],[22,10],[21,11],[20,12]],"blk",2);S.px([[17,7],[18,8]],"tan",2);
    S.poly([[9,17],[16,17],[15.6,19],[9.4,19]],"col",.3,.2);S.px([[12,19],[12,20]],"tag",1);
  }else{
    S.mat("fur","#e3b98a");S.mat("swt","#7d838f");S.mat("trim","#3c3f48");S.mat("nose",["#5a3a32","#5a3a32","#5a3a32","#5a3a32","#3a2420"]);S.mat("eye",["#2a1a14","#2a1a14","#2a1a14","#2a1a14","#1a1010"]);
    S.ell(17,19,9,5.4,"fur");S.ell(16,18,7.6,4.6,"swt");for(var x=11;x<22;x++)S.put(x,14,"trim",1);for(x=10;x<23;x++)S.put(x,22,"trim",1);
    S.cap(9,22,4,24,1.8,1.6,"fur");S.cap(13,23,9,25,1.8,1.6,"fur");S.ell(25,17,2.6,2.6,"fur");
    S.ell(8,13,5.8,5.4,"fur");S.ell(8,8.6,3.6,2.8,"fur");S.cap(4,12,3.5,19,2.2,1.8,"fur");S.cap(12,12,12.5,18,2,1.6,"fur");
    S.px([[6,13],[9,13]],"eye",1);S.px([[7,16]],"nose",1);
    var seed=7;function rnd(n){seed=(seed*9301+49297)%233280;return Math.floor(seed/233280*n)}
    for(var i=0;i<46;i++){var X=1+rnd(28),Y=4+rnd(22);if(S.m[Y][X]==="fur")S.t[Y][X]=[0,0,2][rnd(3)]}
    for(i=0;i<30;i++){X=8+rnd(17);Y=14+rnd(9);if(S.m[Y][X]==="swt")S.t[Y][X]=[0,2][rnd(2)]}
  }
  return S.grid();
}

function dog2(name,pose){
  var S=new Spr(),ph=0,walking=false,sit=false,sleep=false;
  if(typeof pose==="number"){walking=true;ph=pose/4*Math.PI*2}else if(pose==="sit")sit=true;else if(pose==="sleep")sleep=true;
  var sw=walking?Math.sin(ph):0,l1=walking?Math.max(0,Math.cos(ph)):0,l2=walking?Math.max(0,-Math.cos(ph)):0;
  var ch=name==="chopstick";
  if(ch){S.mat("blk","#2a2224");S.mat("tan","#c07a3c");S.mat("nose",["#222","#111","#000","#000","#000"]);S.mat("eye",["#fff","#2a1a14","#000","#000","#000"]);S.mat("col","#ece5cc");S.mat("pink","#e8908a")}
  else{S.mat("fur","#e6bc8c");S.mat("swt","#8a909c");S.mat("trim","#454955");S.mat("nose",["#6a4a42","#5a3a32","#3a2420","#3a2420","#2a1810"]);S.mat("eye",["#2a1a14","#2a1a14","#1a1010","#1a1010","#1a1010"]);S.mat("pink","#e8908a")}
  var bx=ch?20:19,by=ch?19:19,m=ch?"blk":"fur";
  if(sleep){
    if(ch){S.ell(20,25,10,4.6,"blk");S.ell(14,26.4,4,2.4,"tan");S.ell(9,25.5,4.4,3.8,"blk");S.ell(6,27,2.4,1.6,"tan");S.poly([[7,19],[10,21],[11,27],[6,26]],"blk",.3,.2);S.cap(30,24,34,20,1.8,1,"blk");S.px([[7,25],[8,25]],"eye",2)}
    else{S.ell(19,25,8,4.4,"fur");S.ell(19,24,6.6,3.4,"swt");S.ell(10,26,4.4,3.8,"fur");S.ell(8,23,3,2.4,"fur");S.ell(14,22,2.4,3,"fur");S.px([[8,26],[9,26]],"eye",2);S.px([[6,27]],"nose",1);S.ell(28,23,2.4,2.4,"fur")}
    return S.grid()}
  if(ch){
    var fl=[[13,21],[15.4,21]],bl=[[26,21],[28.4,21]];
    function leg(x,y,off,lift,dark){var f=function(){S.cap(x,y,x+off,y+8.6-lift,1.5,1.2,"blk");S.ell(x+off-.4,y+9.4-lift,1.7,1.1,"tan")};dark?S.dark(f):f()}
    if(sit){S.dark(function(){S.cap(15.4,22,13,31,1.5,1.2,"blk");S.ell(12.6,32,1.8,1.1,"tan")});S.ell(24,26,6,5,"blk");S.cap(26,30,22,32,2,1.6,"blk");S.ell(21,32.6,3,1.2,"tan");S.cap(13,22,12,31,1.6,1.2,"blk");S.ell(11.6,32,1.8,1.1,"tan");S.cap(30,29,35,31,1.4,1,"blk");S.ell(18,19.4,6,6,"blk")}
    else{
      leg(bl[1][0],bl[1][1],-sw*2.6,l2,1);leg(fl[1][0],fl[1][1],sw*2.6,l1,1);
      S.ell(bx,by,9.6,4.4,"blk");S.ell(bx-4,by+1.4,4,3.2,"tan");S.ell(bx,by+3.2,6,1.6,"tan");
      leg(bl[0][0],bl[0][1],sw*2.6,l1,0);leg(fl[0][0],fl[0][1],-sw*2.6,l2,0)}
    var hx=8.4,hy=sit?10:13.4;
    S.cap(hx+3,hy+2,hx+6,hy+7,3,3.4,"blk");S.ell(hx,hy,4.8,4.4,"blk");S.ell(hx-3.4,hy+1.6,3.2,2.4,"tan");S.px([[hx-6,hy+.4],[hx-6,hy+1.2]],"nose",1);S.px([[hx-3.6,hy+3.4]],"pink",1);
    S.px([[hx-2,hy-1.4],[hx-1,hy-1.4]],"eye",1);S.px([[hx-2,hy-2.6]],"tan",0);S.px([[hx-1.2,hy-2.6]],"tan",1);
    S.poly([[hx+1,hy-3],[hx+4.6,hy-6.6],[hx+6.6,hy+1],[hx+3,hy+3.4]],"blk",.4,.2);S.poly([[hx-.6,hy-3.6],[hx-3.4,hy-8.4],[hx-5.2,hy-1.8],[hx-2.4,hy-.4]],"blk",.4,.2);S.px([[hx+5,hy+2],[hx+5.4,hy+3.4],[hx+4.6,hy+4.4]],"blk",2);
    S.cap(hx+3.6,hy+5.4,hx+8,hy+5.2,1.6,1.6,"col");
    var tw=walking?Math.sin(ph*2)*1.6:0;S.cap(bx+9,by-1,bx+13+tw,by-5,1.8,.9,"blk")}
  else{
    function pleg(x,y,off,lift,dark){var f=function(){S.cap(x,y,x+off,y+7.2-lift,1.9,1.7,"fur");S.ell(x+off-.4,y+8-lift,2.2,1.4,"fur")};dark?S.dark(f):f()}
    if(sit){S.dark(function(){S.cap(15,21,13,30,1.9,1.6,"fur")});S.ell(22,24,6,5.6,"fur");S.ell(22,22.4,5.6,4.2,"swt");S.cap(25,29,21,31,2.2,1.8,"fur");S.cap(13,21,12,30,1.9,1.6,"fur");S.ell(11.6,31,2.2,1.3,"fur");S.ell(29,26,2.4,2.4,"fur")}
    else{pleg(24.4,21,-sw*2.2,l2,1);pleg(14,21,sw*2.2,l1,1);S.ell(bx,by,8,4.4,"fur");S.ell(bx-.4,by-.6,6.8,3.4,"swt");for(var x=13;x<26;x++)S.put(x,by-3.6,"trim",1);for(x=14;x<25;x++)S.put(x,by+3,"trim",1);
      pleg(25,21,sw*2.2,l1,0);pleg(15.4,21,-sw*2.2,l2,0)}
    var hx2=sit?12:9,hy2=sit?14.4:13.6;
    S.ell(hx2,hy2,4.8,4.6,"fur");S.ell(hx2+.4,hy2-3.8,3.6,2.8,"fur");S.ell(hx2-3.2,hy2+1.6,2.4,1.8,"fur");S.px([[hx2-5.6,hy2+.8],[hx2-5.6,hy2+1.6]],"nose",1);S.px([[hx2-1.6,hy2-1]],"eye",1);S.px([[hx2+1,hy2-1]],"eye",1);
    S.ell(hx2+3.6,hy2+1.4,2.2,3.4,"fur");S.ell(hx2-3.6,hy2-1,1.8,3.2,"fur");
    var seed=11;function rnd(n){seed=(seed*9301+49297)%233280;return Math.floor(seed/233280*n)}
    for(var i=0;i<34;i++){var X=3+rnd(26),Y=6+rnd(20);if(S.m[Math.round(Y*K)]&&S.m[Math.round(Y*K)][Math.round(X*K)]==="fur")S.t[Math.round(Y*K)][Math.round(X*K)]=[0,0,2][rnd(3)]}
    S.ell(bx+9,by-2+(walking?Math.sin(ph*2)*.8:0),2.6,2.6,"fur")}
  return S.grid()}
var PixAv={K:K,W:W,H:H,dog2:dog2,HAIR:HAIR,build:build,dog:dog,grid:function(L){return build(L).grid()},svg:function(L,s,ox,oy){return svg(build(L).grid(),s,ox,oy)},ramp:ramp};
if(typeof module!=="undefined")module.exports=PixAv;else root.PixAv=PixAv;
})(win);

return win.PixAv})();
function shade(h,f){
  if(!/^#[0-9a-f]{6}$/i.test(h))return h;
  var n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,t=f<0?0:255,p=Math.abs(f);
  return "rgb("+Math.round((t-r)*p+r)+","+Math.round((t-g)*p+g)+","+Math.round((t-b)*p+b)+")";
}
/* ---------- character (pixel avatars via PixAv) ---------- */
var SKINS=["#f4d2b8","#e9b892","#d8a07a","#b97f56","#8d5a3b","#5e3a26"];
var HAIRC=["#1d1a22","#3a2418","#6b4423","#8a3a26","#d9b36c","#77727f","#e9e6f5","#e07aa8","#4a6ad8","#3fae8a"];
var EYEC=["#3a2418","#2f5fb6","#2e7b4f","#6c7686","#6b4fc6","#a8742a"];
var CLOTH=["#22232e","#eef0f5","#2c3a5c","#4a5233","#b8323a","#8a92a6","#e6cfa8","#6a3a7a","#2f7a6a","#e0a03a","#f0a0bc","#6b4a32"];
var CC={
 sex:[["m","Male"],["f","Female"]],
 hair:[["textured","Fade"],["slick","Slick Back"],["curly","Curly"],["shag","Shaggy"]],
 hair_m:[["textured","Fade"],["slick","Slick Back"],["curly","Curly"],["shag","Shaggy"]],
 hair_f:[["pony","Ponytail"],["lob","Shoulder"],["curtain","Bangs"],["pixie","Pixie"],["long","Long"]],
 eyeT:[["round","Round"],["sharp","Sharp"],["sleepy","Sleepy"]],
 face:[["classic","Classic"],["slim","Slim"],["round","Round"]],
 hat:[["none","None"],["cap","Cap"],["beanie","Beanie"],["bucket","Bucket"]],
 mouth:[["smile","Smile"],["neutral","Calm"],["grin","Grin"],["smirk","Smirk"],["small","Soft"]],
 outfit:[["o1","Street"],["o2","Hoodie"],["o3","Bomber"]],
 top:[["tee","Tee"],["hoodie","Hoodie"],["jacket","Bomber"]],
 pants:[["joggers","Joggers"],["jeans","Jeans"],["shorts","Shorts"]],
 shoes:[["sneakers","Sneakers"],["boots","Boots"],["flips","Flip-flops"]],
 acc:[["none","None"],["glasses","Glasses"],["sunglasses","Shades"],["chain","Chain"],["phones","Headphones"],["earring","Earring"],["hoops","Hoops"]],
 beard:[["0","Clean"],["1","Beard"]]
};
var OUTFITS={o1:{top:"tee",pants:"joggers",shoes:"sneakers"},o2:{top:"hoodie",pants:"jeans",shoes:"sneakers"},o3:{top:"bomber",pants:"pants",shoes:"sneakers"}};
var EYET=["round","sharp","sleepy","bright","cat","happy","dot","tired"],MOUTHS=["smile","neutral","grin","smirk","small"];
function outfitOf(c){for(var k in OUTFITS){var o=OUTFITS[k];if(c.top===o.top&&c.pants===o.pants&&c.shoes===o.shoes)return k}return ""}
function ccList(k,sex){return CC[k+"_"+(sex==="f"?"f":"m")]||CC[k]}
var CCSW=[1,0,5];
function defChar(n,sex){sex=sex||"m";return {name:n||"",sex:sex,skin:1,hair_s:sex==="f"?"pony":"textured",hairC:0,eyes:0,eyeT:"round",face:"classic",mouth:"smile",top:"hoodie",topC:5,pants:"joggers",pantsC:0,shoes:"sneakers",shoesC:1,hat:"none",acc:"none"}}
function fixChar(c){if(c){c.face="classic";c.hat="none";c.acc="none";if(HAIRSW.indexOf(c.hairC)<0)c.hairC=0}var _cw=function(i){var q=CLOTH[i]||"#000",n=parseInt(q.slice(1),16),l=.3*(n>>16)+.59*((n>>8)&255)+.11*(n&255);return l<90?0:(l>200?1:5)};["topC","pantsC","shoesC"].forEach(function(k){if(c&&CCSW.indexOf(c[k])<0)c[k]=_cw(c[k])});
  var d=defChar(c&&c.name,c&&c.sex==="f"?"f":"m");c=Object.assign(d,c||{});
  if(!CHMAP.hair[c.hair_s])c.hair_s=d.hair_s;
  if(!/^(tee|hoodie|jacket)$/.test(c.top))c.top=d.top;if(!/^(joggers|jeans|shorts)$/.test(c.pants))c.pants=d.pants;if(!/^(sneakers|boots|flips)$/.test(c.shoes))c.shoes=d.shoes;
  if(!/^(classic|slim|round)$/.test(c.face))c.face="classic";
  if(/^(cap|beanie|bucket)$/.test(c.acc)){c.hat=c.acc;c.acc="none"}
  if(!/^(none|cap|beanie|bucket)$/.test(c.hat))c.hat="none";
  if(EYET.indexOf(c.eyeT)<0)c.eyeT="round"; if(MOUTHS.indexOf(c.mouth)<0)c.mouth="smile";
  if(!/^(none|glasses|sunglasses|chain|phones|earring|hoops)$/.test(c.acc))c.acc="none";
  var CMX={skin:SKINS.length,hairC:HAIRC.length,eyes:EYEC.length,topC:CLOTH.length,pantsC:CLOTH.length,shoesC:CLOTH.length};["skin","hairC","eyes","topC","pantsC","shoesC"].forEach(function(k){c[k]=Math.max(0,Math.min(CMX[k]-1,+c[k]||0))});c.beard=false;
  c.outfit=outfitOf(c);
  delete c.hair;delete c.face_old;return c;
}
function itemFits(it){var sx=(S.char&&S.char.sex)||"m";if(it&&it[6]&&(it[6].fo||it[6].mo))return it[6].fo?sx==="f":sx==="m";if(it&&it[6]&&(it[6].gar||it[6].basic))return true;var g=it&&it[6]&&it[6].g;return !g||g===((S.char&&S.char.sex)||"m")}
/* What the rig draws for a character. Saves from before the rig map onto the nearest options. */
function rigChoice(c){if(c.rig)return c.rig;var D=QBLoft.data.creator,has=function(list,id){return list.some(function(o){return o.id===id})};
  var shoe=c.shoes==="flips"?"flipflops":c.shoes;
  return {body:c.sex==="f"?"f":"m",top:has(D.tops,c.top)?c.top:D.defaults.top,bottom:has(D.bottoms,c.pants)?c.pants:D.defaults.bottom,shoe:has(D.shoes,shoe)?shoe:D.defaults.shoe}}
function lookOf(ovr,base){
  var c=fixChar(base||S.char);try{if(window.CHMAP&&CHMAP.shoes&&!CHMAP.shoes.flips)CHMAP.shoes.flips=CHMAP.shoes.sneakers}catch(e){}
  var pick=function(sl){var id=(ovr&&ovr[sl]!==undefined)?ovr[sl]:(base?null:((S.eq&&S.eq[sl]&&S.owned&&S.owned[S.eq[sl]])?S.eq[sl]:null));var it=id?shopItem(id):null;return it&&itemFits(it)?it:null};
  var L={rig:rigChoice(c),sex:c.sex,beard:!!c.beard,skin:SKINS[c.skin],hair:HAIRC[c.hairC],hair_s:c.hair_s,eyes:EYEC[c.eyes],top:{s:c.top,c:CLOTH[c.topC],c2:"#eef0f5"},bottom:{s:c.pants,c:CLOTH[c.pantsC]},shoes:{s:c.shoes,c:CLOTH[c.shoesC]},acc:[c.hat,c.acc].filter(function(x){return x&&x!=="none"}),face:c.face,eyeT:c.eyeT,mouth:c.mouth,extra:[]};
  if(c.top==="hoodie")L.top.c2=CLOTH[c.topC]==="#eef0f5"?"#8a92a6":"#eef0f5";
  var it,_eq={};["a_hat","a_top","a_pants","a_shoes","a_acc"].forEach(function(sl){var q=pick(sl),M=q&&q[6].gar&&QBLoft.data.items[q[6].gar];if(M)_eq[M.slot]={art:q[6].gar,frontOnly:M.frontOnly,over:M.over,wide:M.wide,lift:M.lift,clip:M.clip}});
  if(Object.keys(_eq).length)L.rig=Object.assign({},L.rig,{equipped:_eq});
  ["a_top","a_pants","a_shoes","a_hair","a_hairc","a_eyes"].forEach(function(sl){var q=pick(sl),bs=q&&q[6].basic;if(!bs)return;L.rig=Object.assign({},L.rig);L.rig[bs.key]=bs.id;if(bs.ckey)L.rig[bs.ckey]=bs.color});
  if((it=pick("a_hair"))&&!it[6].basic)L.hair_s=it[6].s;
  if((it=pick("a_hairc"))&&!it[6].basic)L.hair=it[6].c;
  if((it=pick("a_eyes"))&&!it[6].basic)L.eyes=it[6].c;
  if((it=pick("a_eyet")))L.eyeT=it[6].e;
  if((it=pick("a_xface")))L.extra=[it[6].x];
  if((it=pick("a_beard"))){L.beard=true;L.beardS=it[6].b}
  if((it=pick("a_mask"))){L.mask=it[6].k;if(it[6].c)L.maskC=it[6].c}
  if((it=pick("a_top"))&&!it[6].gar&&!it[6].basic)L.top={s:it[6].s,c:it[6].c,c2:it[6].c2||"#eef0f5",logo:it[6].logo};
  if((it=pick("a_pants"))&&!it[6].gar&&!it[6].basic)L.bottom={s:it[6].s,c:it[6].c};
  if((it=pick("a_shoes"))&&!it[6].gar&&!it[6].basic)L.shoes={s:it[6].s,c:it[6].c};
  if((it=pick("a_back")))L.back=it[6].s;if(it&&it[6].ac)L.accC=it[6].ac;
  if((it=pick("a_acc"))&&!it[6].gar)L.acc=L.acc.concat(it[6].s.split("+"));
  var _g={},_gm={a_top:"top",a_pants:"pants",a_shoes:"shoes",a_hat:"hat",a_acc:"acc"},_q;Object.keys(_gm).forEach(function(sl){_q=pick(sl);if(_q&&_q[6].gar)_g[_gm[sl]]=_q[6].gar});if(Object.keys(_g).length)L.gar=_g;it=null;
  if(it&&it[6].ac)L.accC=it[6].ac;
  return L;
}
var PXC={};
function pxURL(L){
  var k=typeof L==="string"?L:JSON.stringify(L);if(PXC[k])return PXC[k];
  var g;try{g=typeof L==="string"?PixAv.dog(L):PixAv.grid(L)}catch(e){g=PixAv.grid({sex:L.sex,skin:L.skin,hair:L.hair,hair_s:"textured",eyes:L.eyes,top:{s:"tee",c:(L.top&&L.top.c)||"#22232e"},bottom:{s:"pants",c:(L.bottom&&L.bottom.c)||"#2a2a36"},shoes:{s:"sneakers",c:"#eef1f6"},acc:[]})}var o=[];
  for(var y=0;y<g.length;y++){var x=0,row=g[y];while(x<row.length){var c=row[x];if(!c){x++;continue}var x1=x;while(x1+1<row.length&&row[x1+1]===c)x1++;o.push('<rect x="'+x+'" y="'+y+'" width="'+(x1-x+1)+'" height="1" fill="'+c+'"/>');x=x1+1}}
  var u="data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+PixAv.W+'" height="'+PixAv.H+'" viewBox="0 0 '+PixAv.W+' '+PixAv.H+'" shape-rendering="crispEdges">'+o.join("")+'</svg>');
  PXC[k]=u;return u;
}
var CROP={avatar:[14,1,22,26],a_back:[2,0,44,70],full:[3,0,42,100],head:[14,1,22,26],bust:[10,0,28,36],a_hair:[13,0,24,26],a_hairc:[13,0,24,26],a_eyes:[13,5,24,18],a_acc:[11,0,28,40],a_top:[9,20,32,32],a_pants:[11,40,28,56],a_shoes:[11,84,28,16],dog:[0,0,40,32]};
function pxImg(L,crop,w,h,cls){
  if(L&&typeof L==="object"&&CHB.ready){var chx=chImg(L,crop,w,h,cls);if(chx)return chx}
  var c0=typeof crop==="string"?CROP[crop]:crop,K=PixAv.K,c=c0.map(function(v){return v*K}), s=Math.min(w/c[2],h/c[3]);
  return '<span class="pxa'+(cls?" "+cls:"")+'" style="width:'+w+'px;height:'+h+'px;background-image:url(&quot;'+pxURL(L)+'&quot;);background-size:'+(PixAv.W*s).toFixed(1)+'px '+(PixAv.H*s).toFixed(1)+'px;background-position:'+((w-c[2]*s)/2-c[0]*s).toFixed(1)+'px '+((h-c[3]*s)/2-c[1]*s).toFixed(1)+'px" aria-hidden="true"></span>';
}
function figSvg(L,crop,w,h){return pxImg(L,crop==="14 0 72 194"?"full":crop==="30 6 40 40"?"head":crop,w,h)}
function crewLook(a){
  var f=a.sex==="f"||/long|bob/.test(a.hs);
  var hm={spike:"textured",cap:"buzz",bun:f?"pony":"slick",bob:"bob",long:f?"long":"sidepart",none:"buzz"};
  var acc={headphones:"phones",visor:"sunglasses",goggles:"glasses"}[a.acc];
  return {sex:f?"f":"m",skin:a.skin,hair:a.hair,hair_s:hm[a.hs]||"textured",eyes:"#2a2030",top:{s:"jacket",c:a.outfit,c2:"#eef0f5"},bottom:{s:"pants",c:"#25262f"},shoes:{s:"sneakers",c:"#eef0f5"},acc:acc?[acc]:[],acc2C:"#22232e",accC:a.pop};
}
function crewKeyOf(a){for(var k in CREW)if(CREW[k].a===a)return k;return null}
function crewSvg(a,sz){var s=sz||52,k=crewKeyOf(a),A=k&&typeof ART!=="undefined"&&ART["crew_"+k];if(A)return '<img class="crart" src="'+A+'" width="'+s+'" height="'+s+'" style="width:'+s+'px;height:'+s+'px" alt="">';return pxImg(crewLook(a),"bust",s,s,"crew")}
/* friends who visit */
var FRIENDS={
 logan:{name:"Logan",tag:"Neighbor",look:{sex:"m",skin:"#e9b892",hair:"#1e1a22",hair_s:"sidepart",eyes:"#4a3328",top:{s:"longsleeve",c:"#9fabbd"},bottom:{s:"cargo",c:"#c9cfd9"},shoes:{s:"sneakers",c:"#eef1f6"}}},
 justin:{name:"Justin",tag:"Best friend",look:{sex:"m",skin:"#efc6a2",hair:"#17131a",hair_s:"slick",eyes:"#2e211c",top:{s:"cardigan",c:"#e0392c",c2:"#f6f6f8"},bottom:{s:"pants",c:"#1e2029"},shoes:{s:"boots",c:"#1e2029"},acc:["chain","cross","earring"]}},
 vega:{name:"Vega",tag:"Best friend",look:{sex:"m",skin:"#d8a07a",hair:"#2a1d18",hair_s:"textured",tips:"#c9a46a",eyes:"#3a271c",top:{s:"hoodie",c:"#efe8d4",c2:"#bfb59c",logo:true},bottom:{s:"cargo",c:"#a3a19e"},shoes:{s:"sneakers",c:"#efe8d4"},beard:"#2a1d18",acc:["earring"]}},
 memo:{name:"Memo",tag:"Married to Cynthia",look:{sex:"m",skin:"#d99e78",hair:"#1a1416",hair_s:"buzz",eyes:"#3a2418",top:{s:"tee",c:"#1f8a4c"},bottom:{s:"pants",c:"#1e2029"},shoes:{s:"sneakers",c:"#eef1f6"},acc:["sunglasses"]}},
 cynthia:{name:"Cynthia",tag:"Married to Memo",look:{sex:"f",skin:"#d29a74",hair:"#1d1416",hair_s:"waves",eyes:"#3a2418",top:{s:"tank",c:"#1f5a3c"},bottom:{s:"skirt",c:"#f4f1ea"},shoes:{s:"flats",c:"#e9d8c4"},acc:["flower","hoops"]}}
};
var VISITS=[
 {who:["logan"],w:25,text:"Logan came by with leftovers and stayed a while.",coin:200},
 {who:["justin"],w:20,text:"Justin dropped by to write a hook. You wrote one too.",boost:{stat:"creativity",pct:25,label:"Justin's session x1.25"}},
 {who:["memo","cynthia"],w:18,text:"Memo and Cynthia came over for dinner.",coin:150,boost:{coin:25,label:"Dinner night: coins +25%"}},
 {who:["vega"],w:10,text:"Vega showed up unannounced, as usual, and left you a gift.",coin:600},
 {who:["dog:chopstick"],w:14,text:"Chopstick ran off with a sock. Chasing him, you found coins under the couch.",coin:80},
 {who:["dog:pluto"],w:13,text:"Pluto fell asleep on your lap in his sweater. Discipline quests +15% today.",boost:{stat:"discipline",pct:15,label:"Pluto nap x1.15"}}
];
function visitorImg(w,big){var k=w.indexOf("dog:")===0?"dog_"+w.slice(4):"friend_"+w;if(big&&typeof ART!=="undefined"&&ART[k])return '<img class="vart" src="'+ART[k]+'" alt="">';return w.indexOf("dog:")===0?pxImg(w.slice(4),"dog",big?96:56,big?76:44,"dogimg"):pxImg(FRIENDS[w].look,"full",big?76:30,big?238:94)}
function maybeVisit(chance){
  if(!S.created||!loaded)return;
  if(!hasRoom("lounge"))return;if(Date.now()-(S.base.loungeT||0)<20*36e5)return;if(S.visit&&S.visit.t&&Date.now()-S.visit.t<(3+chash("v"+S.visit.t)%3)*864e5)return;chance=chance*.5;
  var t=today();if(S.visit&&S.visit.d===t)return;
  if(Math.random()>chance)return;
  var tot=VISITS.reduce(function(a,v){return a+v.w},0),r=Math.random()*tot,v=VISITS[0];
  for(var i=0;i<VISITS.length;i++){r-=VISITS[i].w;if(r<=0){v=VISITS[i];break}}
  S.visit={d:t,t:Date.now(),who:v.who};S.base.visits=(S.base.visits||0)+1;
  if(v.coin){S.coins+=v.coin;S.earnedC+=v.coin}
  if(v.boost)S.boost=Object.assign({d:t},v.boost);
  persist();
  setTimeout(function(){
    var names=v.who.map(function(w){return w.indexOf("dog:")===0?(w==="dog:pluto"?"Pluto":"Chopstick"):FRIENDS[w].name}).join(" and ");
    var m=modal('<div class="card box2 adv visit"><span class="label">Someone stopped by</span><h2 style="font-size:32px">'+esc(names)+'</h2><div class="vfig">'+v.who.map(function(w){return visitorImg(w,true)}).join("")+'</div><p>'+esc(v.text)+'</p>'
      +(v.coin?'<div class="reward">+'+v.coin+' coins</div>':'')+(v.boost?'<div class="reward">'+esc(v.boost.label)+' today</div>':'')+'<button class="btn big" id="vok">Nice</button></div>');
    m.querySelector("#vok").onclick=function(){m.remove();render()};
  },1600);
}
function visitorsToday(){return (S.visit&&S.visit.d===today())?S.visit.who:[]}

/* ---------- intro and creator ---------- */
/*v55*//*v56*/
var CALPOSE={idle:["m_idle"],walk:["m_w1","m_w2","m_w3","m_w2"],stretch:["m_stretch"],sleep:["m_sleep"]};
function calImg(L,pose,H,cls){return '<img class="calp '+(cls||"")+'" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-pose="'+(pose||"idle")+'" data-h="'+H+'" data-look="'+esc(JSON.stringify(L))+'">'}
function calHyd(img){if(img.dataset.hy||!window.QBLoft)return;img.dataset.hy=1;
  var L=JSON.parse(img.dataset.look),ch=L.rig,H=+img.dataset.h,clip=img.dataset.pose==="walk"?"walk":img.dataset.pose==="stretch"?"stretch":"idle",D=QBLoft.data.loft;
  if(!ch)return;QBLoft.warm(ch,clip);img.style.width=(H*D.frame[0]/D.standPx).toFixed(1)+"px";img.style.height=(H*D.frame[1]/D.standPx).toFixed(1)+"px";
  /* "still": one idle frame, no timer (neighbors in the Hall: ten of them animating would cost for nothing) */
  if(img.dataset.pose==="still"){var tries=0,one=function(){if(!img.isConnected)return;var u=QBLoft.frameOrNear(ch,"idle",0);if(u){img.src=u;return}if(++tries<40)setTimeout(one,250)};one();return}
  var f=0,t=setInterval(function(){if(!img.isConnected){clearInterval(t);return}var c=QBLoft.clips[clip],u=QBLoft.frameOrNear(ch,clip,f);if(u&&img.src!==u)img.src=u;f=(f+QBLoft.step(clip))%c.frames},1000/QBLoft.clips[clip].fps*QBLoft.step(clip))}
function calHydAll(){var l=document.querySelectorAll("img.calp:not([data-hy])");for(var i=0;i<l.length;i++)calHyd(l[i])}
/* QA (3f6c696, Cal: "post a picture of your character with your current outfit"): neighbors are drawn with the rig, outfit and
   all; a world doc from an old version without a rig look still gets the old drawing */
function nbAv(L,sz){return L&&L.rig?'<span class="calav nbav" style="width:'+sz+'px;height:'+sz+'px">'+calImg(L,"still",Math.round(sz*2.5),"")+'</span>':figSvg(L||lookOf(),"30 6 40 40",sz,sz)}
function calAv(L,sz){return '<span class="calav" style="width:'+sz+'px;height:'+sz+'px">'+calImg(L,"idle",Math.round(sz*2.2),"")+'</span>'}
(function(){var go=function(){new MutationObserver(calHydAll).observe(document.body,{childList:true,subtree:true});calHydAll();var n=0,t=setInterval(function(){calHydAll();if(++n>20)clearInterval(t)},500)};if(document.body)go();else document.addEventListener("DOMContentLoaded",go)})();
var cc=null, ccStage="name", ccEdit=false, ccBlank=true, loaded=false;
function isNewPlayer(){return !(S.total||S.xp)}
function optRow(lbl,k,list){
  return '<div class="ccrow"><span class="label">'+lbl+'</span><div class="ccopts">'+list.map(function(o){return '<button class="ccopt'+(cc[k]===o[0]?" on":"")+'" data-act="cco" data-k="'+k+'" data-v="'+o[0]+'" aria-pressed="'+(cc[k]===o[0])+'">'+o[1]+'</button>'}).join("")+'</div></div>';
}
function swRow2(lbl,k,idx){return '<div class="ccrow"><span class="label">'+lbl+'</span><div class="ccopts">'+idx.map(function(i){var c=CLOTH[i];return '<button class="ccsw'+(cc[k]===i?" on":"")+'" style="background:'+c+'" data-act="cco" data-k="'+k+'" data-v="'+i+'" aria-label="'+lbl+' '+c+'" aria-pressed="'+(cc[k]===i)+'"></button>'}).join("")+'</div></div>'}
var HAIRSW=[0,1,2,4,5];
function swRow2h(lbl,k,idx){return '<div class="ccrow"><span class="label">'+lbl+'</span><div class="ccopts">'+idx.map(function(i){var c=HAIRC[i];return '<button class="ccsw'+(cc[k]===i?" on":"")+'" style="background:'+c+'" data-act="cco" data-k="'+k+'" data-v="'+i+'" aria-label="'+lbl+' '+c+'" aria-pressed="'+(cc[k]===i)+'"></button>'}).join("")+'</div></div>'}
function swRow(lbl,k,list){
  return '<div class="ccrow"><span class="label">'+lbl+'</span><div class="ccopts">'+list.map(function(c,i){return '<button class="ccsw'+(cc[k]===i?" on":"")+'" style="background:'+c+'" data-act="cco" data-k="'+k+'" data-v="'+i+'" aria-label="'+lbl+' option '+(i+1)+'" aria-pressed="'+(cc[k]===i)+'"></button>'}).join("")+'</div></div>';
}
var ccPose=0;
function thRow(lbl,k,list,crop){
  if(!CHB.ready)return optRow(lbl,k,list);
  return '<div class="ccrow"><span class="label">'+lbl+'</span><div class="ccopts ccthumbs">'+list.map(function(o){var o2=JSON.parse(JSON.stringify(cc));o2[k]=o[0];if(k==="outfit")Object.assign(o2,OUTFITS[o[0]]);var on=k==="outfit"?outfitOf(cc)===o[0]:String(cc[k])===String(o[0]);
    return '<button class="ccth'+(on?" on":"")+'" data-act="cco" data-k="'+k+'" data-v="'+o[0]+'" aria-pressed="'+on+'" aria-label="'+esc(o[1])+'">'+pxImg(lookOf(null,fixChar(o2)),crop,58,58)+'<small>'+esc(o[1])+'</small></button>'}).join("")+'</div></div>';
}
function introHtml(){
  if(!cc)cc=JSON.parse(JSON.stringify(S.char||defChar()));
  if(ccStage==="name"&&!ccEdit){
    var nw=isNewPlayer();
    return '<section class="card intro"><span class="label">System notice</span><h1 class="ititle">A new hunter awakens</h1>'
     +'<p class="note">Every task is a quest. Every quest pays XP and coins. Level up, pass the gates, choose a class, and evolve.</p>'
     +'<label class="label" for="ccname">Name your character</label><input id="ccname" class="tin" maxlength="16" autocomplete="off" autocapitalize="words" placeholder="Your name" value="'+esc(cc.name||"")+'">'
     +(nw?'<span class="label">Starting quests</span><div class="ccopts"><button class="ccopt'+(ccBlank?" on":"")+'" data-act="ccq" data-v="blank">Blank board</button><button class="ccopt'+(!ccBlank?" on":"")+'" data-act="ccq" data-v="ex">Example quests</button></div><p class="note">'+(ccBlank?'You start empty and add your own tasks in the brain dump.':'You start with a sample list you can edit or delete.')+'</p>':'')
     +'<button class="btn big" data-act="ccnext">Continue</button></section>';
  }
  setTimeout(ccMount,0);
  return '<section class="card creator qbcc"><div class="ccinfo"><span class="label">'+(ccEdit?"Edit look":"Create your character")+'</span><h2>'+esc(cc.name||"Hunter")+'</h2>'
   +(ccEdit?'<input id="ccname" class="tin" maxlength="16" autocomplete="off" value="'+esc(cc.name||"")+'" aria-label="Character name">':'')+'</div>'
   +'<div id="qbcc"></div><div class="ccbtns"><button class="btn ghost" data-act="'+(ccEdit?"cccancel":"ccback")+'">'+(ccEdit?"Cancel":"Back")+'</button><button class="btn" data-act="ccdone">'+(ccEdit?"Save":"Begin")+'</button></div></section>';
}
function ccMount(){var el=document.getElementById("qbcc");if(!el||el.dataset.on||!window.QBCreator||!cc)return;el.dataset.on=1;
  cc.rig=cc.rig||rigChoice(cc);QBLoft.warm(cc.rig);
  var rig=QBCreatorRig();rig.then(function(r){if(!el.isConnected||!cc)return;QBCreator.mount(el,{rig:r,data:QBLoft.data.creator,clips:QBLoft.clips,initial:cc.rig,showDone:false,onChange:function(c){if(cc){cc.rig=c;cc.sex=c.body}}})})}
var _ccRig=null;
function QBCreatorRig(){if(!_ccRig){var D=QBLoft.data,{clips:clips,...poses}=D.poses;_ccRig=QBRig.create({rig:D.rig,bodies:D.bodies,poses:poses,clips:clips,assetUrl:function(p){return (window.QBART&&QBART[p])||D.loft.artBase+p+artQ(p)}})}return _ccRig}
function ccAct(a,b,e){
  if(a==="ccpose"){ccPose=b.dataset.v!=null?+b.dataset.v:(ccPose+1)%3;render();return}
  if(a==="cco"&&b.dataset.k==="outfit"){Object.assign(cc,OUTFITS[b.dataset.v]);render();return}
  if(a==="cco"&&b.dataset.k==="sex"){cc.sex=b.dataset.v;var _l=ccList("hair",cc.sex);if(!_l.some(function(x){return x[0]===cc.hair_s}))cc.hair_s=_l[0][0];render();return}
  if(a==="cco"){var k=b.dataset.k,v=b.dataset.v;cc[k]=/^(skin|hairC|eyes|topC|pantsC|shoesC)$/.test(k)?+v:k==="beard"?v==="1":v;if(k==="sex"){}cc=fixChar(cc);render();return}
  if(a==="ccq"){ccBlank=b.dataset.v==="blank";render();return}
  if(a==="ccnext"){if(!String(cc.name||"").trim()){pop("Name your character first");var i=document.getElementById("ccname");if(i)i.focus();return}ccStage="look";render();window.scrollTo(0,0);return}
  if(a==="ccback"){ccStage="name";render();return}
  if(a==="cccancel"){cc=null;ccEdit=false;render();return}
  if(a==="ccdone"){
    cc.name=String(cc.name||"").trim().slice(0,16)||"Hunter";
    var first=!S.created;
    if(first&&isNewPlayer()&&ccBlank)S.quests=S.quests.filter(function(q){return q.rep==="weekly4"});
    S.char=cc;S.created=true;cc=null;ccEdit=false;ccStage="name";qsGrantOriginals();
    /* a new character starts with no areas seen, so The Loft takes day 1's unlock and the Hall waits (29h_unlocks.js; QA) */
    if(first&&(!S.areaOn||typeof S.areaOn!=="object"))S.areaOn={};
    /* test copy only (QB_TEST_START in 29_prices.js; Cal: "Start me at level 5 as if I've just completed the job advancement"):
       a new character begins at that level with its trials passed and the areas below it already open; the class is still theirs to pick */
    if(first&&typeof QB_TEST_START==="number"&&QB_TEST_START>1&&!(window.QB_WEB&&QB_WEB.sandbox)){S.xp=Math.max(S.xp||0,cum(QB_TEST_START));
      GATES.forEach(function(g){if(g<=QB_TEST_START&&S.gates.indexOf(g)<0)S.gates.push(g)});
      AREAS.forEach(function(x){if(x[2]<QB_TEST_START)S.areaOn[x[0]]=1});S.unlockDay="";
      /* and the coins that player would have earned on the way (QA): quest pay on the XP so far plus each level's pay, marked paid */
      var tc=Math.round(cum(QB_TEST_START)*2.5),pl;for(pl=(S.lvPaid||1)+1;pl<=QB_TEST_START;pl++)tc+=levelPay(pl);
      S.coins=(S.coins||0)+tc;S.earnedC=(S.earnedC||0)+tc;S.lvPaid=Math.max(S.lvPaid||0,QB_TEST_START)}
    render();persist();
    if(first){var f=document.createElement("div");f.className="flash";document.body.appendChild(f);setTimeout(function(){f.remove()},800);burst(innerWidth/2,innerHeight/3,34);pop("Welcome, "+S.char.name+". Your first quest awaits.");setTimeout(welcomeOnce,2600)}
    else pop("Look saved");
  }
}
function charCard(){
  var c=S.char||defChar();
  return '<section class="card charcard"><div class="figwrap">'+calImg(lookOf(),"idle",190,"")+'</div><div><span class="label">Character</span><h2>'+esc(c.name||"Hunter")+'</h2><div class="note">'+esc(tierName(S.gates.length))+' &middot; Level '+effLvl()+'</div>'
   +'<div class="row" style="margin-top:12px"><button class="btn ghost" data-act="wardrobe">Wardrobe</button></div></div></section>';
}
/* the avatar opens the profile (Cal, 2026-11-09): the character, then everything that used to crowd the Board (profileHtml) */
function charModal(){
  var m=modal('<div class="card box2 adv prof"><div class="prof-top"><div class="figwrap">'+calImg(lookOf(),"idle",120,"")+'</div><div><h2>'+esc((S.char&&S.char.name)||"Hunter")+'</h2><p class="note">'+esc(tierName(S.gates.length))+' &middot; Level '+effLvl()+' &middot; '+S.coins+' coins</p>'
   +'<button class="btn ghost" data-act="wardrobe">Wardrobe</button></div></div><div class="prof-body">'+profileHtml()+'</div></div>');
  m.classList.add("profm");
  return m;
}

function wdOpts(tab){
  var c=fixChar(S.char),L={top:CC.top,pants:CC.pants,shoes:CC.shoes,hat:CC.hat,acc:CC.acc}[tab].map(function(o){return {v:o[0],n:o[1],it:0}});
  var sl={top:"a_top",pants:"a_pants",shoes:"a_shoes",acc:"a_acc",hat:"a_hat"}[tab];
  if(sl)SHOP.forEach(function(it){if(it[1]===sl&&S.owned&&S.owned[it[0]]&&itemFits(it))L.push({v:it[0],n:it[2],it:1})});
  return L;
}
function wdCur(tab){var c=fixChar(S.char);var sl={top:"a_top",pants:"a_pants",shoes:"a_shoes",acc:"a_acc",hat:"a_hat"}[tab];if(sl&&S.eq&&S.eq[sl]&&S.owned&&S.owned[S.eq[sl]])return S.eq[sl];return c[tab]}
function wardrobeHtml(tab){
  var tabs=[["top","Tops"],["pants","Pants"],["shoes","Shoes"],["hat","Hats"],["acc","Extras"]],cur=wdCur(tab),c=fixChar(S.char);
  var h='<div class="card box2 adv wdr"><div class="figwrap">'+calImg(lookOf(),"idle",190,"")+'</div><h2 style="font-size:28px">Wardrobe</h2><p class="note">Tap anything you own to wear it.</p>'
   +'<div class="ccopts" style="justify-content:center;margin:8px 0">'+tabs.map(function(t){return '<button class="ccopt'+(t[0]===tab?" on":"")+'" data-wd="tab" data-v="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>'
   +'<div class="ccopts" style="justify-content:center">'+wdOpts(tab).map(function(o){return '<button class="ccopt'+(String(cur)===String(o.v)?" on":"")+'" data-wd="pick" data-it="'+o.it+'" data-v="'+esc(o.v)+'" aria-pressed="'+(String(cur)===String(o.v))+'">'+esc(o.n)+'</button>'}).join("")+'</div>';
  var ck={top:"topC",pants:"pantsC",shoes:"shoesC"}[tab];
  if(ck)h+='<div class="ccopts" style="justify-content:center;margin-top:10px">'+CCSW.map(function(i){return '<button class="ccsw'+(c[ck]===i?" on":"")+'" style="background:'+CLOTH[i]+'" data-wd="col" data-k="'+ck+'" data-v="'+i+'" aria-label="Color"></button>'}).join("")+'</div>';
  return h+'<div class="row" style="justify-content:center;margin-top:12px"><button class="btn ghost" data-act="mclose">Close</button></div></div>';
}
function wardrobeModal(tab){
  var T=tab||"top",m=modal(wardrobeHtml(T));
  var redo=function(){var box=m.querySelector(".card");var n=document.createElement("div");n.innerHTML=wardrobeHtml(T);var nc=n.firstElementChild;var x=document.createElement("button");x.className="mx";x.setAttribute("data-act","mclose");x.setAttribute("aria-label","Close");x.textContent="✕";nc.insertBefore(x,nc.firstChild);nc.innerHTML=nc.innerHTML.split('<button class="btn ghost" data-act="mclose">Close</button>').join("");box.replaceWith(nc);if(typeof calHydAll==="function")calHydAll()};
  m.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-wd]");if(!b)return;e.stopPropagation();var a=b.dataset.wd,v=b.dataset.v;
    if(a==="tab"){T=v;redo();return}
    if(a==="col"){S.char=fixChar(Object.assign({},S.char,(function(o){o[b.dataset.k]=+v;return o})({})));persist();redo();return}
    if(a==="pick"){var sl={top:"a_top",pants:"a_pants",shoes:"a_shoes",acc:"a_acc",hat:"a_hat"}[T];
      if(b.dataset.it==="1"){S.eq=S.eq||{};S.eq[sl]=v}
      else{if(sl&&S.eq)delete S.eq[sl];var o={};o[T]=v;S.char=fixChar(Object.assign({},S.char,o))}
      persist();redo();try{render()}catch(x){}}});
  if(typeof calHydAll==="function")calHydAll();return m;
}
/*V063*/
/* ===== v0.06 snap-on shop, brands, weekly drops ===== */
SKINS.length=5;
SLOTS.splice(SLOTS.map(function(x){return x[0]}).indexOf("a_top"),0,["a_hat","Hats"]);
THUMB.a_hat=1;
var BRANDS=[
 {id:"hanga",name:"HANGANG",tag:"Two sizes too big, on purpose",c:["#15151b","#2a2a36","#e9e2d0"],ac:"#c9ff3d",start:"2026-11-03",sub:"한강"},
 {id:"y2k",name:"DIAL-UP",tag:"Low-rise, high drama",c:["#ff4fa3","#b46bff","#6cf0ff"],ac:"#fff",start:"2026-11-09",sub:"y2k thrift"},
 {id:"over",name:"OVERPASS",tag:"Built for kickflips you will never land",c:["#141416","#3a3a40","#ff6a1a"],ac:"#ff6a1a",start:"2026-11-16",sub:"street supply"},
 {id:"rose",name:"VENOM ROSE",tag:"Soft velvet, sharper tongue",c:["#160a12","#3a0f24","#d81b60"],ac:"#ff4f8a",start:"2026-11-23",sub:"dark glam"},
 /* Cal: NICE COCK, his own brand, is drop 5; ALTITUDE moves back a week */
 {id:"nc",name:"NICE COCK",tag:"Something to crow about",c:["#111214","#3b3f46","#c9ccd2"],ac:"#f2efe8",start:"2026-11-30",sub:"luxury leisurewear"},
 {id:"alt",name:"ALTITUDE",tag:"Trail gear that never sees a trail",c:["#12303a","#2c6e6e","#d7f0ff"],ac:"#8ef0ff",start:"2026-12-07",sub:"mountain supply"},
 /* Cal's music project (approved 2026-11-06); the next free Monday after ALTITUDE until the launch schedule places it */
 {id:"kp",name:"KODE PINK",tag:"One in the pink, two in the\u2026 other one",c:["#f6a5c8","#8f9bea","#c7a6f0"],ac:"#ffd84d",start:"2026-12-14",sub:"anime city-pop"},
 /* Cal's artist brand (approved 2026-11-06), palette and mark from his song covers */
 {id:"sm",name:"SAYM\u00d8RE",tag:"Trust the motion",c:["#08090c","#101319","#ff7a18"],ac:"#17d4e6",start:"2026-12-21",sub:"bass culture"},
 /* Cal's first approved five, in BRANDS_15.md order: the next free Monday each until the launch schedule places them */
 {id:"smk",name:"SMOKE BOMB",tag:"Vanish in style",c:["#111114","#3a3d44","#ff6a1f"],ac:"#f2e6c8",start:"2026-12-28",sub:"ninja anime"},
 {id:"gp",name:"GACHA POP",tag:"Every outfit a rare drop",c:["#ffb3d1","#9fd3ff","#c9a8f5"],ac:"#ffd65a",start:"2027-01-04",sub:"MMO cash shop"},
 {id:"sp",name:"SAVE POINT",tag:"Respawn looking good",c:["#3b1e54","#6c389a","#8a8a8a"],ac:"#3daf9d",start:"2027-01-11",sub:"retro video games"},
 {id:"bb",name:"BARD & BLADE",tag:"Dressed for the side quest",c:["#4c3227","#3f5e4c","#dddee3"],ac:"#b8925a",start:"2027-01-18",sub:"high fantasy"},
 {id:"cr",name:"CHROME RAIN",tag:"Upgrades sold separately",c:["#0b1313","#989898","#48e2e2"],ac:"#df4071",start:"2027-01-25",sub:"cyberpunk"},
 {id:"km",name:"KAIMANA",tag:"Back when the waves were bigger",c:["#e6d7c2","#34a1a0","#fb7167"],ac:"#fb7167",start:"2027-02-01",sub:"surf club"},
 {id:"oak",name:"OAKMONT",tag:"Members only, dress code optional",c:["#f2e6cb","#26345c","#641b38"],ac:"#641b38",start:"2027-02-08",sub:"80s country-club athletic"},
 {id:"sv",name:"S\u00d8LVBERG",tag:"Never actually skied",c:["#f0f1f3","#bb2b35","#2d4066"],ac:"#bb2b35",start:"2027-02-15",sub:"apr\u00e8s-ski"}];
var GITEMS=[
 ["gx_h_snap","a_hat","Flat-brim Snapback",90,1,"Black cap, cream HANGANG patch.",{gar:"h_snap",b:"hanga"}],
 ["gx_h_beret","a_hat","Wool Beret",80,1,"Charcoal wool, tilted.",{gar:"h_beret",b:"hanga"}],
 ["gx_h_news","a_hat","Newsboy Cap",85,1,"Grey herringbone wool.",{gar:"h_news",b:"hanga"}],
 ["gx_h_mask","a_acc","Airport Face Mask",60,1,"Plain black, ear loops.",{gar:"h_mask",b:"hanga"}],
 ["gx_h_shades","a_acc","Slim Tinted Shades",70,1,"Thin black frames, dark lenses.",{gar:"h_shades",b:"hanga"}],
 ["gx_h_varsity","a_top","Oversized Varsity Jacket",160,1,"Black and cream, HANGANG chest.",{gar:"h_varsity",b:"hanga"}],
 ["gx_h_hoodie","a_top","Oversized Cream Hoodie",120,1,"Heavy fleece, boxy.",{gar:"h_hoodie",b:"hanga"}],
 ["gx_h_cardi","a_top","Oatmeal Knit Cardigan",110,1,"Chunky knit over a white tee.",{gar:"h_cardi",b:"hanga"}],
 ["gx_h_cargo","a_pants","Baggy Cargo Pants",100,1,"Olive, loose, big pockets.",{gar:"h_cargo",b:"hanga"}],
 ["gx_h_denim","a_pants","Wide-leg Washed Denim",100,1,"Light wash, puddle hem.",{gar:"h_denim",b:"hanga"}],
 ["gx_h_trous","a_pants","Pleated Wide Trousers",95,1,"Off-black, long drop.",{gar:"h_trous",b:"hanga"}],
 ["gx_h_sneak","a_shoes","Chunky Sneakers",110,1,"Cream layered soles.",{gar:"h_sneak",b:"hanga"}],
 ["gx_h_boots","a_shoes","Lug-sole Combat Boots",120,1,"Black, thick laces.",{gar:"h_boots",b:"hanga"}],
 ["gx_h_high","a_shoes","Canvas High-tops",90,1,"Off-white, white toe cap.",{gar:"h_high",b:"hanga"}],
 ["gx_y_truck","a_hat","Pink Rhinestone Trucker",90,1,"Mesh trucker, star on front.",{gar:"y_truck",b:"y2k"}],
 ["gx_y_velcap","a_hat","Velour Newsboy Cap",85,1,"Chocolate velour, buckle.",{gar:"y_velcap",b:"y2k"}],
 ["gx_y_bfly","a_acc","Butterfly Shades",65,1,"Tiny pink lenses.",{gar:"y_bfly",b:"y2k"}],
 ["gx_y_pend","a_acc","Rhinestone Star Pendant",70,1,"Long ball chain, big star.",{gar:"y_pend",b:"y2k"}],
 ["gx_y_baby","a_top","Butterfly Baby Tee",85,1,"Cropped, rhinestone butterfly.",{gar:"y_baby",b:"y2k",fo:1}],
 ["gx_y_vjkt","a_top","Velour Track Jacket",140,1,"Chocolate zip-up, white stripes.",{gar:"y_vjkt",b:"y2k"}],
 ["gx_y_ring","a_top","Retro Ringer Tee",75,1,"White with black trim.",{gar:"y_ring",b:"y2k"}],
 ["gx_y_flare","a_pants","Low-rise Flare Jeans",105,1,"Dark wash, wide flare.",{gar:"y_flare",b:"y2k"}],
 ["gx_y_track","a_pants","Velour Track Pants",95,1,"Chocolate, white side stripe.",{gar:"y_track",b:"y2k"}],
 ["gx_y_plat","a_shoes","Platform Sneakers",115,1,"White and pastel pink.",{gar:"y_plat",b:"y2k"}],
 ["gx_y_mary","a_shoes","Platform Mary-Janes",110,1,"Black patent, silver buckle.",{gar:"y_mary",b:"y2k",fo:1}]];
GITEMS.forEach(function(x){SHOP.push(x)});
var GORDER=[["a_hat","Hats"],["a_acc","Accessories"],["a_top","Tops"],["a_pants","Bottoms"],["a_shoes","Shoes"]];
function ptMidnight(ds){var p=ds.split("-").map(Number);for(var o=7;o<=8;o++){var t=Date.UTC(p[0],p[1]-1,p[2],o);var f=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",hour12:false,day:"numeric"}).formatToParts(new Date(t));var hh=+f.filter(function(q){return q.type==="hour"})[0].value%24,dd=+f.filter(function(q){return q.type==="day"})[0].value;if(hh===0&&dd===p[2])return t}return Date.UTC(p[0],p[1]-1,p[2],8)}
function dropNow(){return Date.now()+(S.simWeeks||0)*6048e5}
function dropState(){var n=dropNow(),rel=BRANDS.filter(function(b){return ptMidnight(b.start)<=n}),live=rel.slice(-3),vault=rel.slice(0,Math.max(0,rel.length-3)),nx=BRANDS.filter(function(b){return ptMidnight(b.start)>n})[0]||null;return {n:n,live:live,vault:vault,next:nx}}
function cdTxt(ms){if(ms<=0)return "now";var m=Math.floor(ms/6e4),d=Math.floor(m/1440),hh=Math.floor(m%1440/60),mm=m%60;return d?d+"d "+hh+"h":hh?hh+"h "+mm+"m":mm+"m"}
function gDot(it){var f=it[6].fo;return '<span class="gdot g_'+(f?"f":"u")+'" title="'+(f?"Female":"Unisex")+'">'+(f?"♀":"U")+'</span>'}
function garThumb(it){var g=window.LFVAR&&LFVAR.gar&&LFVAR.gar[it[6].gar];return '<div class="thumb">'+(g?'<img class="garth" src="'+g[2]+'" alt="">':'<b class="mono" style="color:var(--muted)">...</b>')+gDot(it)+'</div>'}
/* an art file's URL with its content fingerprint (tools/build.py), so a phone never shows a cached old picture */
function artQ(n){var H=QBLoft.data.arthash;return H&&H[n]?"?h="+H[n]:""}
/* Brand badges travel in the art_ui pack (build.py), so a publish stays under its file limit; a loose file still works. */
function brandLogoSrc(id){var n='logo_'+id+'.webp';return (window.QBART&&QBART[n])||QBLoft.data.loft.artBase+n+artQ(n)}
function brandLogo(b,big){return '<div class="blg'+(big?" big":"")+' blg_'+b.id+'"><img class="blg_e" src="'+brandLogoSrc(b.id)+'" alt="" onerror="this.remove()"><span><b>'+b.name+'</b><small>'+b.sub+'</small></span></div>'}
var _shopOld=shopHtml;
shopHtml=function(){
  var d=dropState();
  SHOPTABS=[["wardrobe","Wardrobe",["a_hair","a_hairc","a_eyet","a_xface","a_beard","a_mask","a_hat","a_top","a_pants","a_shoes","a_acc","a_back"]]];
  d.live.slice().reverse().forEach(function(b){SHOPTABS.push([b.id,b.name,[]])});
  SHOPTABS.push(["vault","Vault",[]],["upgrades","Upgrades",["buff"]],["interface","Interface",["theme","frame","bg","pet","title","burst"]]);
  if(!SHOPTABS.some(function(t){return t[0]===shopTab}))shopTab="wardrobe";
  var h=_shopOld(),b=d.live.filter(function(x){return x.id===shopTab})[0];
  if(b)h+=brandHtml(b,d);else if(shopTab==="vault")h+=vaultHtml(d);
  h+='<section class="card panel"><p class="note"><span class="gdot g_u">U</span> unisex &nbsp; <span class="gdot g_f">♀</span> female only. Everything you buy snaps onto your character in every pose and activity.</p>'
   +'<p class="note">Sandbox: <button class="btn ghost" data-act="simwk">Skip ahead one week</button> <button class="btn ghost" data-act="simrs">Reset</button> (week offset '+(S.simWeeks||0)+')</p></section>';
  return h;
};
function brandHtml(b,d){
  var h='<section class="card panel brandhead" style="background:linear-gradient(135deg,'+b.c[0]+','+b.c[1]+' 60%,'+b.c[2]+')">'+brandLogo(b,1)+'<p class="note" style="color:#fff;opacity:.9">'+b.tag+'. Weekly drop, 15 pieces.</p></section>';
  GORDER.forEach(function(g){var items=SHOP.filter(function(x){return x[6].b===b.id&&x[1]===g[0]&&itemFits(x)});if(!items.length)return;
    h+='<section class="card panel"><h3 class="label">'+g[1]+'</h3><div class="shopgrid">'+items.map(itemHtml).join("")+'</div></section>'});
  var nx=d.next;h+='<section class="card panel"><p class="note">'+(nx?'Next drop: <b>'+nx.name+'</b> in '+cdTxt(ptMidnight(nx.start)-d.n)+' ('+dropCadence()+', midnight Pacific).':'More brands drop every '+dropCadence().replace(/s and /,' and ').replace(/s$/,'')+'.')+'</p></section>';
  return h;
}
function vaultHtml(d){
  var h='<section class="card panel"><h3 class="label">Vault</h3><p class="note">Only 3 brands stay live. When a 4th drops, the oldest retires here and returns much later. Vaulted brands are unavailable until they return. Pieces you own stay in your wardrobe.</p>';
  if(!d.vault.length)h+='<p class="note">Empty for now. First retirement happens when the 4th brand drops.</p>';
  else h+='<div class="vcar">'+d.vault.map(function(b){var back=ptMidnight(b.start)+105*864e5;return '<div class="vcard" style="background:linear-gradient(135deg,'+b.c[0]+','+b.c[1]+')">'+brandLogo(b)+'<small>Returns in '+cdTxt(back-d.n)+'</small></div>'}).join("")+'</div>';
  if(d.next)h+='<p class="note">Next release: <b>'+d.next.name+'</b> in '+cdTxt(ptMidnight(d.next.start)-d.n)+'.</p>';
  return h+'</section>';
}
function dropCheck(){
  if(!S||!S.created||ccEdit||areaGate("shop")||document.querySelector(".dropsplash"))return;
  S.seenDr=S.seenDr||{};var d=dropState(),b=d.live.filter(function(x){return !S.seenDr[x.id]})[0];if(!b)return;
  var prev=GORDER.map(function(g){var it=SHOP.filter(function(x){return x[6].b===b.id&&x[1]===g[0]&&itemFits(x)})[0];return it?'<div class="dsp"><img src="'+itemArt(it)+'" alt=""><small>'+g[1]+'</small></div>':''}).join("");
  var el=document.createElement("div");el.className="dropsplash";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");
  el.style.background='radial-gradient(circle at 30% 20%,'+b.c[2]+' 0,transparent 45%),linear-gradient(160deg,'+b.c[0]+','+b.c[1]+')';
  el.innerHTML='<button class="dsx" aria-label="Close">✕</button><div class="dsin"><small class="mono">NEW DROP</small>'+brandLogo(b,1)+'<p>'+b.tag+'</p><div class="dsrow">'+prev+'</div></div><button class="btn dsgo">Open Shop</button>';
  var close=function(){S.seenDr[b.id]=1;persist();el.remove();try{dropCheck()}catch(e){}};
  el.querySelector(".dsx").onclick=close;
  el.querySelector(".dsgo").onclick=function(){S.seenDr[b.id]=1;persist();el.remove();view="shop";shopTab=b.id;render();window.scrollTo(0,0)};
  document.body.appendChild(el);
}
(function(){var c=document.createElement("style");c.textContent='.thumb{position:relative}.garth{max-width:86px;max-height:68px;object-fit:contain}.gdot{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;font:700 10px/1 sans-serif;border:1px solid rgba(0,0,0,.35)}.thumb .gdot{position:absolute;top:5px;left:5px}.g_u{background:#fff;color:#222}.g_f{background:#ff8cc4;color:#5a0a34}.g_m{background:#5aa9ff;color:#06264d}.blg{display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1}.blg b{font:900 22px/1 system-ui,sans-serif;letter-spacing:.04em}.blg small{font:600 10px/1 system-ui,sans-serif;letter-spacing:.3em;opacity:.85;margin-top:4px;text-transform:uppercase}.blg.big b{font-size:44px}.blg_hanga b{color:#e9e2d0;letter-spacing:.14em;font-weight:800}.blg_hanga small{color:#c9ff3d}.blg_y2k b{color:#fff;font-style:italic;text-shadow:2px 2px 0 #b46bff,-1px -1px 0 #6cf0ff;letter-spacing:.02em}.blg_y2k small{color:#fff}.brandhead{color:#fff}.vcar{display:flex;gap:10px;overflow-x:auto;padding:6px 0}.vcard{flex:0 0 190px;border-radius:14px;padding:16px;color:#fff;display:flex;flex-direction:column;gap:12px;filter:grayscale(.6)}.dropsplash{position:fixed;inset:0;z-index:5000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px 16px 28px;color:#fff;animation:dsin .45s cubic-bezier(.2,1.2,.3,1)}@keyframes dsin{from{opacity:0;transform:scale(1.08)}to{opacity:1;transform:none}}.dsx{position:absolute;top:14px;right:14px;width:42px;height:42px;border-radius:50%;border:0;background:rgba(0,0,0,.4);color:#fff;font-size:18px}.dsin{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;max-width:560px}.dsin .blg{align-items:center}.dsrow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}.dsp{width:92px;height:106px;border-radius:14px;background:rgba(255,255,255,.16);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;animation:dspop .5s both}.dsp:nth-child(2){animation-delay:.08s}.dsp:nth-child(3){animation-delay:.16s}.dsp:nth-child(4){animation-delay:.24s}.dsp:nth-child(5){animation-delay:.32s}@keyframes dspop{from{opacity:0;transform:translateY(18px) scale(.8)}to{opacity:1;transform:none}}.dsp img{max-width:72px;max-height:68px;object-fit:contain}.dsp small{font-size:10px;opacity:.85}.dsgo{min-width:220px;font-size:17px;padding:14px 22px}';document.head.appendChild(c)})();
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=simwk],[data-act=simrs]");if(!b)return;e.stopPropagation();if(b.dataset.act==="simwk")qbWeek();else qbReset()},true);
setTimeout(function(){try{Object.defineProperty(window.__qb,"S",{get:function(){return S}})}catch(e){}},0);

window.__qb={lookOf:lookOf,fixChar:fixChar,wardrobeModal:wardrobeModal,roomModal:roomModal,x:function(){return {S:S,toggle:toggle,remove:remove,onTap:onTap,mults:mults,cum:cum,need:need,effLvl:effLvl,lvlOf:lvlOf,gated:gated,coinsFor:coinsFor,isCrit:isCrit,SHOP:SHOP,ADDONS:ADDONS,ROOMT:ROOMT,render:render,simulate:simulate,rollover:rollover,persist:persist,CHESTS:CHESTS}}};window.addEventListener("lfvar",function(){try{render()}catch(e){}});
function lfVarLoad(){if(window.LFVAR||!window.LFVAR_URL||window.__lfvl)return;window.__lfvl=1;
  fetch(window.LFVAR_URL).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){window.LFVAR=j;window.dispatchEvent(new Event("lfvar"))}).catch(function(){window.__lfvl=0;setTimeout(lfVarLoad,4000)})}
setTimeout(lfVarLoad,60);
function fix1022(){
  var cb=0;
  Object.keys(S.done||{}).forEach(function(id){var q=S.quests.filter(function(x){return x.id===id})[0];if(q)S.stats[q.stat]=Math.max(0,(S.stats[q.stat]||0)-1);S.total=Math.max(0,S.total-1);cb+=(S.cdone[id]||0)});
  S.done={};S.vdone={};S.cdone={};S.combo=null;S.raid=null;
  S.coins-=cb;S.earnedC=Math.max(0,S.earnedC-cb);
  if(S.lvPaid>3){S.coins-=200*(S.lvPaid-3);S.lvPaid=3}
  S.coins=Math.max(0,S.coins);S.xp=cum(3);S.vxp=0;S.bigxp=0;S.dayXp={d:"",x:0};S.fx1022=true;S.rst2=true;
}

/* ---------- hideout base (side-view tower) ---------- */
var FLOORLV=[1,8,12,16,22,26,32,38];
var PAL={
 bedroom:[["#2a2540","#3a2a34","#ff8ab8"],["#1f2a3d","#2b2f3a","#6cb6ff"],["#2d2540","#3b2a33","#ffd27a"],["#22302a","#3a3226","#9cff8a"]],
 lounge:[["#2b2236","#3a2a24","#ff9d5c"],["#1f2a3d","#2b2f3a","#6cb6ff"],["#2d1f2a","#3b2a33","#ff5c8a"],["#22302a","#3a3226","#ffd27a"]],
 bar:[["#2a1626","#3b2318","#ff3d81"],["#141c33","#2b2230","#4dd2ff"],["#2a2214","#3a2a18","#ffc857"],["#1c1426","#2b1d33","#b388ff"]],
 restaurant:[["#3a2a22","#4a3626","#ffb066"],["#26303a","#3a3326","#9fe0ff"],["#3a2226","#432a24","#ff7a6a"],["#2a3424","#3e3424","#e6ff9a"]],
 garden:[["#1f3326","#3a2a1e","#9cff8a"],["#22303a","#3a2a1e","#8affd8"],["#2f2a1e","#3a2a1e","#ffd27a"],["#2a1f33","#3a2a1e","#d68aff"]],
 farm:[["#3a2a1c","#4a3a22","#ffd27a"],["#2e2a1e","#4a3a22","#ffb066"],["#30261c","#4a3a22","#9cff8a"],["#2a2420","#4a3a22","#ff8a5c"]],
 pond:[["#14283a","#24303a","#5ce1ff"],["#1a2236","#24303a","#8a9cff"],["#14302c","#24303a","#5cffc3"],["#26203a","#24303a","#ff8ad8"]],
 gameroom:[["#1c1630","#2a2238","#b388ff"],["#141f30","#22283a","#4dd2ff"],["#2a1428","#33202e","#ff3d81"],["#1a2a22","#22302a","#5cff9a"]],
 studio:[["#141420","#22222e","#ff3d81"],["#141a26","#22262e","#4dd2ff"],["#201414","#2e2222","#ff8a3d"],["#18141f","#26202e","#b388ff"]],
 gym:[["#1e2226","#2a2a2e","#ff4d4d"],["#1a2230","#2a2a2e","#4dd2ff"],["#22201a","#2a2a2e","#ffc857"],["#1a2620","#2a2a2e","#5cff9a"]],
 library:[["#2a1e18","#3a2a1e","#ffc76a"],["#1c2230","#2e2a24","#9fc4ff"],["#2a1a22","#3a2a1e","#ff9a8a"],["#1e2a22","#3a2a1e","#b6ff9a"]],
 sky:[["#0d1430","#2a2a33","#ffb36b"],["#1a1030","#2a2a33","#ff7ad8"],["#0b1a2a","#2a2a33","#5ce1ff"],["#1a1414","#2a2a33","#ffd27a"]],
 theater:[["#2a1620","#3a2026","#ff4d6d"],["#1a1626","#2a2030","#ffd27a"],["#201420","#301a26","#b388ff"],["#1a2020","#2a2a2a","#4dd2ff"]],
 spa:[["#cfe0d6","#a98a6a","#7fe0c0"],["#e0d6cf","#a98a6a","#ffb8a0"],["#d6dce0","#a98a6a","#9fc4ff"],["#dce0cf","#a98a6a","#d6ff9a"]],
 club:[["#1a1430","#14121c","#ff3df0"],["#14182a","#14121c","#4dd2ff"],["#201420","#14121c","#9cff8a"],["#1a1a1a","#14121c","#ffd24a"]],
 dojo:[["#2e2418","#6b5a3a","#ff5c4d"],["#262a2e","#6b5a3a","#9fe0ff"],["#2a2020","#6b5a3a","#ffc857"],["#1e2420","#6b5a3a","#9cff8a"]]
};
var ROOMT={
 bedroom:{name:"Bedroom",lv:1,cost:0,desc:"Your private room. Nobody visits here.",fixed:true,home:true,note:"Your personal space."},
 lounge:{name:"Lounge",lv:5,cost:120,desc:"A living room for guests. Friends and coaches start dropping by once it is built.",home:true,needCls:true,note:"Visitors and coaches hang out here."},
 bar:{name:"Rooftop Bar",lv:14,cost:60,desc:"An upscale rooftop speakeasy: craft cocktails, string lights and low velvet seating. Coins trickle in.",coin:.6,store:8},
 garden:{name:"Garden",lv:10,cost:80,desc:"Grows vegetables that feed the restaurant.",food:"veg",rate:2},
 restaurant:{name:"Restaurant",lv:12,cost:150,desc:"Guests order, the kitchen cooks, the waiter serves. Recipes add coins when ingredients are in stock.",coin:.9,store:8},
 gameroom:{name:"Game Room",lv:18,cost:180,desc:"The crew unwinds. Every quest +2% XP.",buff:{special:"all"},pct:2},
 studio:{name:"Studio",lv:16,cost:200,desc:"Creative quests +5% XP.",buff:{stat:"creativity"},pct:5},
 gym:{name:"Gym",lv:8,cost:200,desc:"Fitness quests +5% XP.",buff:{stat:"fitness"},pct:5},
 farm:{name:"Farm",lv:24,cost:250,desc:"Grain and eggs for bigger recipes.",food:"grain",rate:2},
 library:{name:"Library",lv:22,cost:300,desc:"Discipline quests +5% XP.",buff:{stat:"discipline"},pct:5},
 sky:{name:"Sky Lounge",lv:34,cost:900,desc:"An open-air deck: fire pit, daybeds, a telescope and a DJ deck. The best coin room until the club.",coin:10.8,store:8},
 dojo:{name:"Dojo",lv:42,cost:1200,desc:"Every quest +3% XP.",buff:{special:"all"},pct:3},
 theater:{name:"Movie Theater",lv:28,cost:1400,desc:"A full cinema: a lobby with ticket booth and snack counter, plus an auditorium next door (comes with it). Guests buy tickets, grab snacks and take their seats.",coin:10.0,store:8},
 auditorium:{name:"Auditorium",lv:0,cost:0,desc:"The screening room that comes with the Movie Theater: stepped seating, a giant screen and a looping feature.",coin:.8,store:8,bundled:true},
 spa:{name:"Spa",lv:32,cost:1100,desc:"A luxury onsen: hot tub, sauna, massages and silk lounges. Calm guests, steady coins.",coin:10.0,store:10},
 club:{name:"Nightclub",lv:38,cost:1500,desc:"Calibur on the decks, bottles at the booths. The top coin room.",coin:20.0,store:8}
};
var FOODN={veg:"Veg",grain:"Grain",fish:"Fish"};
var DISHES={salad:["Garden Salad",{veg:1},.2],omelet:["Farm Omelette",{grain:1},.2],rice:["Fried Rice",{veg:1,grain:1},.35],sushi:["Sushi Platter",{fish:1},.5],ramen:["Signature Ramen",{veg:1,grain:1,fish:1},.8]};
/* add-ons: [id,name,cost,effect,line]  effect: p=+production, cap=+storage hours, xp=+buff pct, dish=recipe, crew=+crew slot, req=room type needed, served=dishes served needed */
var ADDONS={
 bedroom:[["bd_bed1","Memory Foam Bed",70,{},"Upgrade: a thick memory foam mattress."],["bd_bed2","Premium LED Bed",190,{},"Upholstered headboard with a warm backlight."],["bd_chair0","Desk Chair",35,{},"Padded seat, fixed back."],["bd_chair1","Ergo Chair",85,{},"Mesh back, adjustable arms and height."],["bd_chair2","Racing Chair",160,{},"Bucket seat with a lumbar pillow."],["bd_ward1","Sleek Wardrobe",90,{},"Handleless doors, more room."],["bd_ward2","Walk-in Closet",200,{},"Knocks out the wall: a lit walk-in closet bulges out of your room, with a backlit shoe & bag wall and a marble dressing island."],["bd_lair","Hero's Lair",280,{adv:1},"A walkway out of the closet to a bare, dark hideout. Fill it with gear."],["bd_lr_rack","Server Racks",150,{},"Humming towers on the walls."],["bd_lr_desk","Supercomputer Console",320,{},"Curved command desk and a wall of live screens."],["bd_lr_trophy","Trophy Wall",170,{},"Lit shelves for your best loot."],["bd_lr_arm","Armory Wall",230,{},"Tools and gadgets, racked and ready."],["bd_lr_suit","Hero Suit Cases",300,{},"Three armor suits lit like museum pieces."],["bd_lr_holo","Holo War Table",310,{},"Plan the next quest in 3D."],["bd_desk1","Standing Desk",80,{},"An oak top on a motorised frame."],["bd_pc1","Gaming PC",140,{},"A tower with a glass side panel and lit fans."],["bd_pc2","Ultrawide Rig",320,{},"A curved ultrawide that loops your best visuals."],["bd_win2","Picture Window",110,{},"A wide black-framed window with a proper view."],["bd_win3","Floor-to-Ceiling Glass",190,{},"Knocks out the wall: three sliding glass panels."],["bd_patio","Patio Deck",260,{},"A deck behind the glass with a glass railing and planters."],["bd_swing","Egg Swing",150,{},"A rattan egg seat swinging over the deck."],["bd_pdeco","Patio Decor",110,{},"Outdoor rug, lanterns, string lights and more plants."],["bd_rug","Area Rug",20,{},"Softer floors."],["bd_plant","Fiddle Leaf",25,{},"A fiddle leaf fig in a clay pot."],["bd_nstand","Nightstand",25,{},"Oak, one drawer, a small lamp."],["bd_art1","Canvas Art",40,{},"One large abstract canvas."],["bd_art2","Gallery Prints",55,{},"Three framed prints."],["bd_art3","Anime Poster",65,{},"A framed print from your favourite series."],["bd_shelf","Bookshelf",60,{},"Five shelves of paperbacks and records."],["bd_fshelf","Figurine Shelf",75,{},"A shelf of painted figurines."],["bd_mirror","Full-length Mirror",120,{},"A floor mirror. Your outfit shows here."],["bd_clock","Wall Clock",30,{},"A plain white wall clock."],["bd_lights","LED Strips & Grass Panels",90,{},"Gradient LED cove lighting and a living grass wall."],["bd_neon","Neon Sign",120,{},"Pink neon script over the bed."]],
 lounge:[["l_couch","Sofa",30,{},"A deep three-seat couch."],["l_rug","Shag Rug",20,{},"A thick wool rug."],["l_plant","Monstera",25,{},"A monstera in a woven basket."],["l_art","Wall Art Set",40,{},"A gallery wall of mixed frames."],["l_tv","Wall Screen",60,{},"A wall-mounted TV."],["l_arcade","Arcade Cabinet",90,{},"An upright cabinet with a light-up marquee."],["l_neon","Neon HOME Sign",120,{},"Pink neon script over the bed."],["l_table","Coffee Table",35,{},"Mugs and magazines."],["l_beans","Bean Bags",55,{},"Floor seating for the crew."],["l_sofa2","Lounge Chairs",80,{crew:1},"Two swivel armchairs."],["l_plant2","Corner Fern",30,{},"Fills the empty corner."],["l_cart","Side Tables",70,{},"A lamp and a drink within reach."],["l_speaker","Speaker Stacks",90,{},"Parties start here."],["l_lux1","Boucle Sectional",600,{xp:1,p:.05},"Upgrade: a cream boucle sectional."],["l_lux2","Marble Coffee & Side",800,{xp:1,p:.05},"Upgrade: marble and brass tables."],["l_lux3","Emerald Chair & Media Wall",1050,{xp:1,p:.05},"Upgrade: velvet chairs and a walnut console."],["l_lux4","Penthouse Shelf & Tree",1350,{xp:1,p:.05},"Upgrade: display shelf and a sculptural tree."]],
 bar:[["b_shelf","Back Bar Shelf",50,{p:.2},"More bottles, more orders."],["b_neon","Speakeasy Neon",70,{p:.2},"A quiet pink glow over the bar."],["b_string","String Lights",120,{p:.2},"Warm bulbs strung across the rooftop."],["b_juke","Palm Planters",100,{p:.25},"Rooftop greenery."],["b_menu","Cocktail Menu",140,{p:.3},"A chalkboard of house cocktails."],["b_taps","Bar Station",180,{cap:4},"A copper mixing station with a sink."],["b_dj","Fire Pit Lounge",260,{p:.5},"A gas fire pit ringed with stone."],["b_pool","Lounge Sofa",160,{p:.25},"Low seating for long nights."],["b_snack","Champagne Bucket",90,{m:["Wings","Fries"],tip:1},"Chilled and ready."],["b_hightop","High-Top Tables",150,{p:.15},"Two more spots to stand and sip."],["b_mixo","Mixology Course",220,{spd:.25,m:"Espresso Martini"},"A bartender who works both wells at once."],["b_lounge","Velvet Booth",260,{pat:25},"Guests settle in and wait longer."],["b_rare","Rare Whiskey Shelf",350,{m:"Rare Pour",tip:1},"Top shelf, top tips."],["b_lux1","Marble & Gold Bar",600,{xp:1,p:.05},"Upgrade: black marble and brass."],["b_lux2","Velvet Lounge Suite",800,{xp:1,p:.05},"Upgrade: emerald velvet and a gold fire table."],["b_lux3","Gold Station & Champagne Tower",1050,{xp:1,p:.05},"Upgrade: gold bar cart and a champagne tower."],["b_lux4","Skyline Terrace",1350,{xp:1,p:.05},"Upgrade: olive tree, marble bistro tables and pink-gold string lights."]],
 restaurant:[["r_tab1","Marble Tables",70,{p:.15},"Upgrade: the wood tables go marble."],["r_tab2","Fine Dining Tables",240,{p:.25,tip:1},"Upgrade: linen, crystal, velvet chairs."],["r_stl1","Leather Stools",60,{p:.1},"Upgrade: diner stools with cushions."],["r_stl2","Gold Velvet Stools",180,{p:.15},"Upgrade: gold frames, velvet seats."],["r_ctr1","Marble Counter",90,{p:.15},"Upgrade: the laminate counter goes marble."],["r_ctr2","Black Marble & Gold Counter",300,{p:.25,tip:1},"Upgrade: fluted gold and amber light."],["r_bar","Add a Bar",120,{m:["Cocktail","Draft Beer"],tip:1,p:.2},"The counter extends into a proper bar."],["r_oven","Pizza Grill & Oven",200,{m:"Pizza",p:.3},"A wood-fired oven window in the kitchen wall."],["r_booth","Booth Seating",260,{cap:4,p:.25},"Upgrade: wall tables become diner booths."],["r_booth2","Velvet Banquettes",380,{cap:4,p:.3,tip:1},"Upgrade: tufted velvet and gold trim."],["r_pend","Pendant Lights",90,{p:.15},"Warm light over the counter."],["r_chan","Crystal Chandeliers",320,{p:.25},"Upgrade: crystal over the dining floor."],["r_coffee","Coffee Machine",60,{p:.2},"A second register for the morning rush."],["r_salad","Recipe: Garden Salad",80,{dish:"salad",req:"garden"},"Needs veg from the Garden."],["r_espresso","Espresso Bar",120,{m:["Latte","Espresso"],tip:1},"An espresso machine behind the counter."],["r_dessert","Dessert Case",160,{m:["Cheesecake","Mochi"],tip:1},"A chilled dessert case by the till."],["r_train","Waiter Training",200,{spd:.25},"Another server on the floor."],["r_wine","Wine Wall",260,{m:"Wine",tip:1},"A short wine list and a rack to hold it."],["r_wine2","Glass Wine Cellar",340,{tip:1,p:.2},"Upgrade: a lit glass cellar."],["r_chef","Chef's Plaque",450,{m:"Tasting",tip:2,p:.2},"Fine dining. Bigger tips."],["r_tbl2","Back Dining Row",110,{p:.25},"More floor tables. More guests."],["r_host","Host Stand",90,{p:.15},"Someone greets the door."],["r_plants","Planters",50,{p:.1},"Greenery between tables."],["r_flora","Orchid Arrangements",110,{p:.1},"Fresh flowers, every day."],["r_mirror","Gilded Mirror",140,{p:.05},"A statement piece."],["r_omelet","Recipe: Farm Omelette",160,{dish:"omelet",req:"farm"},"Needs grain from the Farm."],["r_rice","Recipe: Fried Rice",200,{dish:"rice",req:"farm"},"Veg plus grain."],["r_sushi","Recipe: Sushi Platter",260,{dish:"sushi",req:"sky"},"Needs fish from the Sky Lounge koi pond."],["r_ramen","Recipe: Signature Ramen",400,{dish:"ramen",req:"sky"},"Veg, grain and fish on one plate."],["r_art","Wall Art",50,{p:.05},"A neon sign and menu boards."],["r_star","Gold Star Award",0,{p:1,served:300},"Earned after 300 dishes served. Doubles base income."]],
 garden:[["g_box","Planter Boxes",50,{p:.3},"More rows, more veg."],["g_spr","Sprinklers",90,{p:.3},"Waters itself."],["g_lamp","Grow Lamps",150,{p:.5},"Purple light, fast growth."],["g_koi","Koi Fountain",200,{p:.2},"A trickling fountain between the beds."],["g_scare","Scarecrow",70,{p:.1},"A scarecrow in a straw hat."],["g_berry","Berry Patch",140,{m:"Berry",p:.2},"Strawberries join the rotation."],["g_bee","Beehive",200,{p:.2},"Bees speed up every plot."],["g_green","Greenhouse",320,{p:.4},"A fast-growing plot under glass."]],
 farm:[["f_coop","Chicken Coop",100,{p:.4},"Eggs for days."],["f_tractor","Mini Tractor",180,{p:.4},"A small red tractor."],["f_silo","Silo",240,{p:.3},"Bulk storage, bulk harvest."],["f_corn","Corn Field",150,{p:.2},"Two tall rows of sweet corn."],["f_pump","Irrigation",180,{p:.1},"Rows water themselves."],["f_cow","Dairy Cow",260,{p:.3},"Fresh milk for the kitchen."],["f_stand","Farm Stand",300,{tip:1},"Neighbors buy produce. Tips in the jar."]],
 pond:[["p_net","Fishing Nets",100,{p:.3},"Better catches."],["p_lant","Paper Lanterns",140,{p:.2},"Fish like the glow."],["p_pump","Aerator Pump",220,{p:.5},"Healthy water, bigger fish."],["p_lily","Lily Pads",90,{p:.1},"Frogs approve."],["p_dock","Fishing Dock",180,{p:.2},"Two more fishing spots."],["p_bait","Bait Shop",160,{m:"Rare",p:.1},"Rare fish start biting."],["p_rod","Pro Rods",240,{spd:.3},"Reel in faster."]],
 gameroom:[["gm_tft","Pinball Machine",80,{xp:1},"A classic cabinet with real flippers."],["gm_cab","Arcade Row",140,{xp:1},"Fighter cabinets and a racing seat."],["gm_pool","Foosball Table",200,{xp:1},"Spin to win."],["gm_snack","Vending Machine",100,{m:["Nachos","Pocky"],tip:1},"Fuel for the grind."],["gm_claw","Claw Machine",140,{tip:1},"Rigged? Never."],["gm_hockey","Air Hockey",200,{xp:1},"Fast hands only."],["gm_vr","VR Pod",280,{xp:1,tip:1},"Full immersion."],["gm_league","Weekly League",340,{pat:30,xp:1},"Regulars stick around longer."],["gm_couch","Console Sofa",260,{xp:1},"Big screen, two controllers."],["gm_lux1","Pro Cabinets",300,{xp:1,p:.1},"Upgrade: black glass and gold trim."],["gm_lux2","Designer Game Tables",340,{xp:1,p:.1},"Upgrade: walnut, brass and glass."],["gm_lux3","Velvet Sectional",320,{xp:1,p:.1},"Upgrade: purple leather lounge."],["gm_lux4","Gourmet Kiosk",260,{tip:1,p:.1},"Upgrade: a lit glass-front kiosk."],["gm_lux5","Designer Prize Cabinet",280,{tip:1,p:.1},"Upgrade: gold-framed prize case."]],
 studio:[["s_mon","Studio Monitors",90,{xp:1},"Hear the low end properly."],["s_panel","Acoustic Panels",120,{xp:1},"Dead room, clean mix."],["s_synth","Synth Keyboard",180,{xp:2},"Saw waves for days."],["s_plaque","Platinum Plaques",160,{tip:1},"Clients pay more for a proven room."],["s_drums","Drum Kit",240,{xp:1,m:"Drum take"},"Live drums on the menu."],["s_lounge","Green Room",220,{pat:30},"Artists wait without stressing."],["s_console","Analog Console",320,{spd:.3,xp:1},"Faster mixes, warmer sound."],["s_booth","Vocal Booth",260,{xp:2},"For the hooks."]],
 gym:[["y_bag","Dumbbell Rack",80,{xp:1},"Heavy iron, neatly racked."],["y_rack","Squat Rack",150,{xp:2},"A steel cage with safety bars, for heavy squats."],["y_bench","Bench Press",130,{xp:1},"A flat bench and a squat rack."],["y_tread","Treadmill",180,{xp:1},"Cardio, technically."],["y_mirror","Mirror Wall",220,{xp:1},"Check the form."],["y_smoothie","Rowing Machine",150,{m:"Shake",tip:1},"Full-body cardio."],["y_bike","Spin Bikes",180,{xp:1},"Two more members ride."],["y_cable","Cable Machine",220,{xp:1},"Every angle covered."],["y_sauna","Recovery Corner",240,{pat:30},"Foam rollers and mats by the door."],["y_pt","Trainer Certification",320,{spd:.3,tip:1},"Your coaches level up their service."],["y_lux1","Pro Bench & Rack",600,{xp:1,p:.05},"Upgrade: black-and-gold power rack."],["y_lux2","Pro Cardio",800,{xp:1,p:.05},"Upgrade: curved treadmill, smart bikes and a rowing machine."],["y_lux3","Pro Cable & Dumbbells",1050,{xp:1,p:.05},"Upgrade: dual-stack cable tower and chrome dumbbells."],["y_lux4","Recovery Suite",1350,{xp:1,p:.05},"Upgrade: marble recovery table and gold plate tree."]],
 library:[["lb_lamp","Reading Chair",90,{xp:1},"Deep focus seat."],["lb_globe","Antique Globe",140,{xp:1},"A brass-mounted globe on a stand."],["lb_fire","Banker Lamps",240,{xp:2},"Warm green-glass reading light."],["lb_ladder","Corner Bookcase",100,{spd:.25},"More shelves, more stories."],["lb_carrel","Study Carrels",160,{xp:1},"Two quiet desks."],["lb_cafe","Coffee Nook",140,{m:"Coffee",tip:1},"Fuel for focus."],["lb_rare","Rare Books Case",280,{m:"First Edition",tip:1},"Collectors pay to browse."],["lb_quiet","Quiet Hours",220,{pat:30,xp:1},"Readers settle in."],["lb_lux1","Mahogany Shelves",600,{xp:1,p:.05},"Upgrade: dark mahogany shelving."],["lb_lux2","Leather Reading Suite",800,{xp:1,p:.05},"Upgrade: a tufted leather chair."],["lb_lux3","Executive Desk & Globe",1050,{xp:1,p:.05},"Upgrade: mahogany desks and a brass globe."],["lb_lux4","Marble Salon",1350,{xp:1,p:.05},"Upgrade: marble table, brass lamps, fern."]],
 sky:[["k_lights","String Lights",150,{p:.3},"Instant ambience."],["k_fire","Fire Pit",250,{p:.3},"Warm nights, long tabs."],["k_cabana","VIP Cabana",400,{p:.5},"A curtained cabana for VIPs."],["k_bar","Sky Bar Upgrade",160,{spd:.2,m:"Mojito"},"Faster pours under the stars."],["k_day","Daybeds",220,{p:.2},"Two more VIP spots to lie back."],["k_scope","Telescope",200,{pat:20},"Guests stargaze while they wait."],["k_bottle","Bottle Service",320,{m:"Bottle",tip:1},"Sparklers included."],["k_dj","Rooftop DJ",420,{tip:1,p:.25},"Sunset sets by Calibur."]],
 dojo:[["d_dummy","Training Dummy",200,{xp:1},"It never hits back."],["d_rack","Katana Rack",300,{xp:1},"Practice swords on a lacquered rack."],["d_bonsai","Bonsai",350,{xp:1},"Patience, visualized."],["d_mats","Extra Mats",150,{xp:1},"Room for two more students."],["d_gong","Gong",180,{tip:1},"A bronze gong for belt tests."],["d_cush","Meditation Cushions",200,{pat:30},"Students wait calmly."],["d_belt","Belt Wall",260,{m:"Belt test",tip:1},"Promotions on the menu."],["d_ring","Sparring Ring",380,{xp:1,tip:1},"Ropes, corners, glory."],["d_lux1","Ebony Dummy & Bag",600,{xp:1,p:.05},"Upgrade: black lacquer training gear."],["d_lux2","Lacquer Rack & Gong",800,{xp:1,p:.05},"Upgrade: gold-inlaid weapons and a grand gong."],["d_lux3","Zen Garden Suite",1050,{xp:1,p:.05},"Upgrade: jade-pot bonsai, carved panel and tea set."],["d_lux4","Silk Mats & Cabinet",1350,{xp:1,p:.05},"Upgrade: silk cushions and a lacquered armoire."]],
 theater:[["t_pop","Popcorn Cart",120,{m:"Popcorn",p:.15},"A popcorn machine with a glass hood."],["t_soda","Soda Fountain",140,{m:"Soda",p:.1},"Ice-cold refills."],["t_marquee","Neon Marquee",160,{p:.15},"A marquee ringed with bulbs."],["t_candy","Candy Case",180,{m:["Candy","Gummies"],tip:1},"A glass case of sweets."],["t_usher","Usher Training",220,{spd:.3},"Snacks arrive before the trailer ends."],["t_hotdog","Hot Food & Nachos",260,{m:["Hot dog","Nachos"],tip:1},"Hot dogs and a nacho station."],["t_bar","Drinks Bar",320,{m:"Cocktail",p:.2},"Pull up a stool and order a drink."],["t_lux1","Premium Floors & Carpet",600,{xp:1,p:.05},"Upgrade: marble lobby floor, plush wine carpet and a velvet sofa."],["t_lux2","Gourmet Menu & Copper Popcorn",800,{xp:1,p:.05},"Upgrade: pastry case, copper popcorn cart and a gourmet snack bar."],["t_lux3","Brass Tap Bar",1050,{xp:1,p:.05},"Upgrade: marble bar with brass taps and velvet stools."],["t_lux4","Gold Ticket Booth & Concessions",1350,{xp:1,p:.05},"Upgrade: marble-and-gold booth, counter and bins."]],
 auditorium:[["au_aisle","Aisle Lights",150,{pat:10},"Glowing step edges."],["au_sound","Surround Sound",240,{tip:1,p:.2},"You feel the bass."],["au_carpet","Plush Carpet",300,{p:.1},"Deep wine carpet on every tier."],["au_rows","Back Row",380,{p:.25,pat:20},"A fourth, higher row of seats."],["au_recline","Leather Recliners",480,{p:.2,pat:10},"Black leather seats that lean back."],["au_imax","IMAX Screen",650,{tip:1,p:.4},"Wall-to-wall picture."],["au_lux1","Velvet VIP Seating",600,{xp:1,p:.05},"Upgrade: tufted velvet seats throughout."],["au_lux2","Gold Trim & Marble Landing",800,{xp:1,p:.05},"Upgrade: gold sconces and a marble back landing."],["au_lux3","Reference Speaker Towers",1050,{xp:1,p:.05},"Upgrade: gold speaker towers beside the screen."],["au_lux4","Vintage Gold Projector",1350,{xp:1,p:.05},"Upgrade: a gold-plated cinema projector."]],
 spa:[["sp_wine","Onsen Hot Tub",200,{tip:1,p:.15},"A Hakone-style soak. Every onsen starts here."],["sp_candle","Candles",80,{pat:15},"Instant calm."],["sp_stone","Hot Stone Kit",160,{m:"Hot stone",tip:1},"Premium treatment."],["sp_sauna","Sauna",260,{p:.2},"Room on the benches for two more."],["sp_robe","Plush Robes",120,{tip:1},"Robes, slippers and cold towels."],["sp_table","Third Massage Table",240,{p:.2},"More bookings."],["sp_facial","Facial Chair",200,{m:"Facial",tip:1},"Skincare menu."],["sp_zen","Zen Garden",220,{pat:25},"Raked sand, zero stress."],["sp_lux1","Marble Massage Tables",600,{xp:1,p:.05},"Upgrade: heated marble with silk linens."],["sp_lux2","Marble Onsen & Glass Sauna",800,{xp:1,p:.05},"Upgrade: sunken marble tub, gold fixtures."],["sp_lux3","Silk Lounge",1050,{xp:1,p:.05},"Upgrade: silk chaise and plush robes."],["sp_lux4","Jade & Gold Accents",1350,{xp:1,p:.05},"Upgrade: crystal candles, jade stones, orchids."]],
 club:[["c_laser","Laser Rig",160,{p:.2},"Green lasers that sweep the floor."],["c_fog","Fog Machine",140,{pat:15},"Mystery and mood."],["c_led","LED Dance Floor",240,{p:.2,tip:1},"Two more dancers. The floor reacts to the drop."],["c_rope","Velvet Rope",120,{pat:20},"Exclusivity. People wait patiently."],["c_vip","VIP Booth",300,{tip:1},"Bottle service with sparklers."],["c_podium","Go-Go Podiums",260,{tip:1},"Dancers on the podiums keep the floor full."],["c_bar2","Bar Staff Training",260,{spd:.3},"Faster pours on a packed night."],["c_sound","Speaker Stacks",420,{tip:1,p:.3},"Two speaker stacks either side of the booth."],["c_vip2","Second VIP Booth",480,{p:.2},"More bottles, more sparklers."],["c_lux1","Pro DJ Booth",650,{xp:1,p:.05},"Upgrade: gold-framed decks with an LED front."],["c_lux2","Marble Gold Bar",850,{xp:1,p:.05},"Upgrade: black marble and brushed gold."],["c_lux3","Velvet VIP Suite",1100,{xp:1,p:.05},"Upgrade: tufted velvet booths and mirrored tables."],["c_lux4","Gold Speaker Towers",1400,{xp:1,p:.05},"Upgrade: gold-trimmed towers."]]
};
var ADDREQ={bd_bed2:"bd_bed1",bd_chair1:"bd_chair0",bd_chair2:"bd_chair1",bd_ward2:"bd_ward1",bd_win3:"bd_win2",bd_patio:"bd_win3",bd_swing:"bd_patio",bd_pdeco:"bd_patio",bd_cl_shoe:"bd_ward2",bd_cl_isle:"bd_ward2",bd_lair:"bd_ward2",bd_lr_rack:"bd_lair",bd_lr_desk:"bd_lair",bd_lr_trophy:"bd_lair",bd_lr_arm:"bd_lair",bd_lr_suit:"bd_lair",bd_lr_holo:"bd_lair",bd_pc1:"bd_desk1",bd_pc2:"bd_pc1",bd_neon:"bd_art1",bd_fshelf:"bd_shelf",l_lamp:"bd_nstand",l_dogbeds:"bd_rug",l_tv:"l_couch",l_arcade:"l_tv",l_neon:"l_art",l_pc:"l_desk",l_pad:"l_pc",l_chair:"l_pad",bd_bean:"bd_rug",l_table:"l_couch",l_sofa2:"l_couch",l_beans:"l_rug",l_plant2:"l_plant",l_cart:"l_table",l_speaker:"l_tv",
 b_neon:"b_shelf",b_taps:"b_shelf",b_menu:"b_taps",b_dj:"b_juke",
 r_oven:"r_bar",r_booth:"r_oven",r_booth2:"r_booth",r_tab2:"r_tab1",r_stl2:"r_stl1",r_ctr2:"r_ctr1",r_chan:"r_pend",r_wine2:"r_wine",r_omelet:"r_salad",r_rice:"r_omelet",r_sushi:"r_rice",r_ramen:"r_sushi",
 g_spr:"g_box",g_lamp:"g_spr",g_koi:"g_spr",f_tractor:"f_coop",f_silo:"f_tractor",p_lant:"p_net",p_pump:"p_net",
 gm_cab:"gm_tft",gm_pool:"gm_cab",gm_couch:"gm_tft",s_synth:"s_mon",s_booth:"s_panel",y_rack:"y_bag",y_mirror:"y_tread",
 lb_globe:"lb_lamp",lb_fire:"lb_lamp",k_fire:"k_lights",k_tub:"k_fire",d_rack:"d_dummy",d_bonsai:"d_dummy",r_espresso:"r_coffee",r_dessert:"r_espresso",r_train:"r_host",r_comfy:"r_booth",r_wine:"r_dessert",r_chef:"r_wine",b_snack:"b_taps",b_hightop:"b_snack",b_mixo:"b_menu",b_lounge:"b_hightop",b_rare:"b_mixo",k_bar:"k_lights",k_day:"k_fire",k_scope:"k_lights",k_bottle:"k_day",k_dj:"k_bottle",g_scare:"g_box",g_berry:"g_box",g_bee:"g_berry",g_green:"g_lamp",f_corn:"f_coop",f_pump:"f_tractor",f_cow:"f_corn",f_stand:"f_cow",p_lily:"p_net",p_dock:"p_net",p_bait:"p_lant",p_rod:"p_dock",gm_snack:"gm_tft",gm_claw:"gm_cab",gm_hockey:"gm_pool",gm_vr:"gm_couch",gm_league:"gm_hockey",gm_lux1:"gm_cab",gm_lux2:"gm_hockey",gm_lux3:"gm_couch",gm_lux4:"gm_snack",gm_lux5:"gm_claw",d_lux1:"d_dummy",d_lux2:"d_rack",d_lux3:"d_bonsai",d_lux4:"d_cush",c_lux1:"c_led",c_lux2:"c_bar2",c_lux3:"c_vip",c_lux4:"c_sound",sp_lux1:"sp_table",sp_lux2:"sp_sauna",sp_lux3:"sp_facial",sp_lux4:"sp_zen",t_lux1:"t_candy",t_lux2:"t_hotdog",t_lux3:"t_bar",t_lux4:"t_lux2",l_lux1:"l_couch",l_lux2:"l_table",l_lux3:"l_tv",l_lux4:"l_plant",y_lux1:"y_rack",y_lux2:"y_tread",y_lux3:"y_cable",y_lux4:"y_sauna",b_lux1:"b_shelf",b_lux2:"b_pool",b_lux3:"b_taps",b_lux4:"b_juke",lb_lux1:"lb_ladder",lb_lux2:"lb_lamp",lb_lux3:"lb_carrel",lb_lux4:"lb_cafe",s_plaque:"s_mon",s_drums:"s_synth",s_lounge:"s_plaque",s_console:"s_panel",y_smoothie:"y_bag",y_bike:"y_tread",y_cable:"y_rack",y_sauna:"y_mirror",y_pt:"y_cable",lb_ladder:"lb_lamp",lb_carrel:"lb_lamp",lb_cafe:"lb_carrel",lb_rare:"lb_globe",lb_quiet:"lb_fire",d_mats:"d_dummy",d_gong:"d_rack",d_cush:"d_bonsai",d_belt:"d_gong",d_ring:"d_mats",t_marquee:"t_pop",au_rows:"au_aisle",au_recline:"au_rows",au_imax:"au_sound",au_lux1:"au_recline",au_lux2:"au_aisle",au_lux3:"au_sound",au_lux4:"au_imax",t_soda:"t_pop",t_bar:"t_hotdog",t_candy:"t_pop",t_usher:"t_marquee",t_hotdog:"t_candy",sp_stone:"sp_candle",sp_sauna:"sp_candle",sp_robe:"sp_sauna",sp_table:"sp_stone",sp_facial:"sp_robe",sp_candle:"sp_wine",sp_zen:"sp_facial",c_fog:"c_laser",c_led:"c_laser",c_rope:"c_fog",c_vip:"c_led",c_podium:"c_fog",c_bar2:"c_vip",c_sound:"c_led",c_vip2:"c_vip",l_table:"l_rug",l_beans:"l_rug",l_sofa2:"l_couch",l_plant2:"l_plant",r_tbl2:"r_pend",r_host:"r_coffee",r_plants:"r_coffee",b_pool:"b_taps",y_bench:"y_rack"};
function addonName(r,id){var l=(ADDONS[r.t]||[]).filter(function(x){return x[0]===id})[0];return l?l[1]:id}
var EVENTS=[
 ["A food critic stopped by and left a glowing review.",{coin:250}],["A traveling DJ played a surprise set. Tips everywhere.",{coin:200}],
 ["Mochi found a bag of rare seeds in the alley.",{veg:6}],["A regular paid off an old tab.",{coin:150}],["Someone left fresh fish at the door. No note.",{fish:4}],
 ["The crew found coins in the couch.",{coin:100}],["A farmer's market trade went well.",{grain:6}]
];
function baseFresh(){return {t53:1,v34:1,slots:[{t:"bedroom",a:{},st:0,pend:0}],food:{veg:0,grain:0,fish:0},crew:{},t:Date.now(),served:0,ev:0}}
function bslot(i){return S.base.slots[i]||null}
function floorsOpen(){var lv=effLvl(),n=Math.ceil((S.base.slots.filter(Boolean).length+(nextRoom()?1:0))/2),last=-1;S.base.slots.forEach(function(r,i){if(r)last=i});return Math.max(n,Math.ceil((last+1)/2))}
var ROOMSOPEN={restaurant:1,garden:1,theater:1};
/* rooms open one at a time, in this order */
function nextRoom(){return Object.keys(ROOMSOPEN).filter(function(k){return !hasRoom(k)})[0]||null}
function buildableList(){var k=nextRoom();return k&&ROOMT[k].lv<=effLvl()?[k]:[]}
function coachesOn(){return !!(S.base&&hasRoom("lounge")&&((S.base.visits||0)>0||S.visit||Object.keys(S.cxp||{}).length>0))}
function addonsOf(r){return (ADDONS[r.t]||[]).filter(function(a){return r.a&&r.a[a[0]]})}
function roomCrew(i){return Object.keys(S.base.crew).filter(function(k){return S.base.crew[k]===i&&crewUnlocked().indexOf(k)>=0})}
var CREWHIRE={juno:150,rook:200,nova:200,vex:250,ko:250,brisa:300,dax:300};
(function(){if(window.__k10)return;window.__k10=1;
 Object.keys(CREWHIRE).forEach(function(k){CREWHIRE[k]*=10});
 Object.keys(ROOMT).forEach(function(k){var T=ROOMT[k];if(T.cost)T.cost*=10;if(T.coin)T.coin=Math.round(T.coin*10)});
 Object.keys(ADDONS).forEach(function(k){ADDONS[k].forEach(function(a){if(a[2])a[2]*=10})});
 SHOP.forEach(function(it){it[3]*=10});
})();
(function(){if(window.__k48)return;window.__k48=1;
 /* early-game price curve: cheap first buys, top tiers unchanged */
 var cv=function(c){if(!c)return c;var n=Math.min(c,c*Math.pow(c/6000,.35));return Math.max(40,Math.round(n/10)*10)};
 Object.keys(ROOMT).forEach(function(k){var T=ROOMT[k];if(T.cost)T.cost=cv(T.cost)});
 Object.keys(ADDONS).forEach(function(k){ADDONS[k].forEach(function(a){if(a[2])a[2]=cv(a[2])})});
 var A=ADDONS.sky;if(A&&!A.some(function(a){return a[0]==="k_pond"})){
  A.push(["k_pond","Koi Pond",5000,{p:.3},"A quiet koi pond. Raises fish for the restaurant."]);
  A.push(["k_lux1","Marble Koi Garden",9000,{p:.4,tip:1},"Black marble rim, lanterns, gold koi."]);
  A.push(["k_lux2","Velvet & Silk Lounge",12000,{p:.4,tip:1},"Emerald velvet sofa, silk daybeds and cabana."]);
  A.push(["k_lux3","Black & Gold Deck",15000,{p:.5,tip:1},"Marble fire pit, gold DJ booth and champagne cart."]);
  A.push(["k_lux4","Gold Observatory",18000,{p:.6,pat:20},"Gold telescope and sculpted topiary."]);
  if(typeof ADDREQ!=="undefined"){ADDREQ.k_lux1="k_pond";ADDREQ.k_lux2="k_cabana";ADDREQ.k_lux3="k_dj";ADDREQ.k_lux4="k_scope"}}
})();
function crewByLevel(){if(!S.base||!hasRoom("lounge"))return [];var lv=effLvl();return UNLOCKS.filter(function(u){return u.crew&&u.lv<=lv}).map(function(u){return u.crew})}
function crewUnlocked(){return crewByLevel().filter(function(k){return (S.joined&&S.joined[k])||(S.hired&&S.hired[k])})}
function crewCandidates(){return crewByLevel().filter(function(k){return CREWHIRE[k]&&!(S.hired&&S.hired[k])})}
function chash(t){var h=7;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h}
function communityJoin(){
  if(!S.joined)S.joined={};if(!S.hired)S.hired={};var t=today(),out=[];if(!hasRoom("lounge"))return out;
  crewByLevel().forEach(function(k){if(out.length||CREWHIRE[k]||S.joined[k])return;if(chash(k+t)%100<10){S.joined[k]=1;out.push(k)}});
  if(out.length){persist();setTimeout(function(){out.forEach(function(k,j){setTimeout(function(){pop(CREW[k].name+" moved in.")},j*2200)})},1200)}
  return out;
}
/*V29-ECON*/function crewCap(r){return 2+addonsOf(r).reduce(function(s,a){return s+(a[3].crew||0)},0)}
function roomMult(i){var r=bslot(i);return 1+addonsOf(r).reduce(function(s,a){return s+(a[3].p||0)},0)+.25*roomCrew(i).length}
function roomStore(r){return (ROOMT[r.t].store||8)+addonsOf(r).reduce(function(s,a){return s+(a[3].cap||0)},0)}
function questsToday(){return Object.keys(S.done||{}).length}
function openMult(){var n=questsToday();return n>=3?1:n===2?.75:n===1?.5:.2}
function foodCap(){return 30}
function dishesOn(r){return addonsOf(r).filter(function(a){return a[3].dish}).map(function(a){return a[3].dish})}
function hasRoom(t){return S.base.slots.some(function(r){return r&&r.t===t})}
function coinRate(i){var r=bslot(i),T=ROOMT[r.t];return T.coin?T.coin*roomMult(i)*openMult():0}
function simulate(now){
  var B=S.base; now=now||Date.now();
  var dt=Math.min(24,(now-B.t)/3600000); if(!(dt>0.0005)){return}
  B.t=now;
  var step=Math.min(.25,dt), left=dt, om=openMult(), tc=now-dt*36e5;
  while(left>1e-6){
    var h=Math.min(step,left); left-=h; tc+=h*36e5;
    B.slots.forEach(function(r,i){if(!r)return;var T=ROOMT[r.t];
      /* Cal: the Garden grows only while its beds are watered (29i_garden.js) */
      if(T.food&&r.t==="garden"&&typeof gdWateredAt==="function"&&!gdWateredAt(tc))return;
      if(T.food){B.food[T.food]=Math.min(foodCap(),(B.food[T.food]||0)+T.rate*roomMult(i)*om*h*(LFW.wx==="rain"&&T.food==="veg"?1.3:1))}
      if(r.t==="sky"&&r.a&&r.a.k_pond){B.food.fish=Math.min(foodCap(),(B.food.fish||0)+(r.a.k_lux1?3:2)*om*h)}
    });
    B.slots.forEach(function(r,i){if(!r)return;var T=ROOMT[r.t];
      if(!T.coin)return;
      var amt=T.coin*roomMult(i)*om*h;
      if(r.t==="restaurant"){amt*=1+gdCook(r,om,h);B.served+=h*2}
      r.pend=Math.min(roomStore(r)*T.coin*roomMult(i),(r.pend||0)+amt);
    });
  }
}
function baseBuffs(){
  var o=[];
  S.base.slots.forEach(function(r,i){if(!r)return;var T=ROOMT[r.t];if(!T.buff)return;
    var pct=T.pct+addonsOf(r).reduce(function(s,a){return s+(a[3].xp||0)},0)+roomCrew(i).length;
    var b=Object.assign({},T.buff,{pct:pct,text:(T.buff.stat?statName(T.buff.stat)+" quests":"All quests")+" +"+pct+"% XP"});
    o.push({who:T.name,b:b});
  });
  return o;
}
/* art */
function rshell(t,st,extra){
  var p=(PAL[t]||PAL.lounge)[st||0], w=p[0], f=p[1], ac=p[2];
  var s='<svg class="rsvg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
  if(t==="sky"||extra==="sky"){s+='<rect width="160" height="100" fill="url(#qb-sky)"/><path d="M0 70 L12 70 L12 52 L24 52 L24 62 L34 62 L34 40 L46 40 L46 66 L60 66 L60 48 L74 48 L74 70 L90 70 L90 36 L100 36 L100 58 L116 58 L116 44 L130 44 L130 68 L146 68 L146 50 L160 50 L160 84 L0 84Z" fill="#0a0c1a" opacity=".9"/>'
    +'<g fill="#ffd27a" opacity=".6"><rect x="37" y="46" width="2" height="2"/><rect x="41" y="54" width="2" height="2"/><rect x="93" y="42" width="2" height="2"/><rect x="120" y="50" width="2" height="2"/><rect x="64" y="54" width="2" height="2"/></g>';}
  else{
    s+='<rect width="160" height="100" fill="'+w+'"/><rect width="160" height="100" fill="url(#qb-wall)"/>';
    s+='<rect y="62" width="160" height="22" fill="'+shade(w,-.25)+'"/><rect y="61" width="160" height="1.5" fill="'+shade(w,.18)+'"/>';
  }
  s+='<rect y="84" width="160" height="16" fill="'+f+'"/><rect y="84" width="160" height="16" fill="url(#qb-floor)"/>';
  for(var x=8;x<160;x+=22)s+='<path d="M'+x+' 84 L'+(x-6)+' 100" stroke="'+shade(f,-.3)+'" stroke-width=".6"/>';
  s+='<rect y="84" width="160" height="1" fill="'+shade(f,.25)+'"/>';
  if(t!=="sky")s+='<rect width="160" height="5" fill="#0b0a12"/><path d="M76 5 L84 5 L82 9 L78 9Z" fill="#1a1824"/><circle cx="80" cy="10" r="2" fill="#fff6d8"/><path d="M78 10 L82 10 L120 84 L40 84Z" fill="url(#qb-cone)"/>';
  return {s:s,ac:ac,w:w,f:f};
}
function rend(s){return s+'<rect width="160" height="100" fill="url(#qb-sideL)"/><rect width="160" height="100" fill="url(#qb-sideR)"/></svg>'}
function has(r,id){return !!(r.a&&r.a[id])}
var NEON=' filter="url(#qb-neon)"';
function roomArt(r){
  var t=r.t,R=rshell(t,r.st,t==="garden"?"win":""),s=R.s,ac=R.ac;
  if(t==="lounge"){
    s+='<rect x="96" y="22" width="40" height="26" rx="1" fill="#1a1824" stroke="#000" stroke-width=".6"/><rect x="99" y="25" width="34" height="20" fill="'+shade(R.w,.12)+'"/><path d="M99 45 L110 33 L118 40 L124 35 L133 45Z" fill="'+shade(R.w,-.1)+'"/>';
    if(has(r,"l_rug"))s+='<ellipse cx="50" cy="92" rx="34" ry="5" fill="'+ac+'" opacity=".45"/>';
    s+='<rect x="18" y="62" width="64" height="16" rx="3" fill="#3b2f4a"/><rect x="16" y="58" width="8" height="24" rx="3" fill="#463858"/><rect x="76" y="58" width="8" height="24" rx="3" fill="#463858"/><rect x="24" y="68" width="52" height="8" rx="2" fill="#54426a"/><rect x="20" y="82" width="3" height="4" fill="#111"/><rect x="77" y="82" width="3" height="4" fill="#111"/>';
    if(has(r,"l_plant"))s+='<path d="M146 84 L142 72 L154 72 L150 84Z" fill="#6b4a32"/><path d="M148 72 Q136 60 140 48 Q146 58 148 72 Q150 54 158 46 Q158 62 148 72Z" fill="#2f8a4a"/>';
    if(has(r,"l_tv"))s+='<rect x="96" y="22" width="40" height="26" rx="1" fill="#0b0a12" stroke="#2a2836"/><rect x="98" y="24" width="36" height="22" fill="url(#qb-screen)"/><rect x="98" y="24" width="36" height="22" fill="url(#qb-screen)" class="flick" opacity=".5"/>';
    if(has(r,"l_arcade"))s+='<path d="M104 84 L104 54 L108 50 L124 50 L124 84Z" fill="#1d1830"/><rect x="107" y="54" width="14" height="11" fill="'+ac+'" opacity=".8"/><rect x="106" y="68" width="16" height="4" fill="#2a2440"/><circle cx="110" cy="70" r="1.2" fill="#ff3d81"/><circle cx="115" cy="70" r="1.2" fill="#4dd2ff"/>';
    if(has(r,"l_neon"))s+='<text x="40" y="34" font-family="Arial Black,sans-serif" font-size="13" fill="'+ac+'"'+NEON+'>HOME</text>';
    if(has(r,"l_bunk"))s+='<rect x="130" y="50" width="26" height="34" fill="none" stroke="#5a4a38" stroke-width="1.6"/><rect x="131" y="56" width="24" height="4" fill="#6cb6ff"/><rect x="131" y="74" width="24" height="4" fill="#ff8a5c"/>';
  }
  if(t==="bar"){
    s+='<rect x="12" y="18" width="88" height="3" fill="#5a3a24"/><rect x="12" y="34" width="88" height="3" fill="#5a3a24"/>';
    var bc=["#6cff9a","#ffb066","#b388ff","#ff5c8a","#9fe0ff","#ffd27a"],n=has(r,"b_shelf")?14:6;
    for(var bi=0;bi<n;bi++){var bx=16+(bi%7)*12, by=bi<7?6:22;s+='<rect x="'+bx+'" y="'+(by+3)+'" width="5" height="9" rx="1.2" fill="'+bc[bi%6]+'" opacity=".85"/><rect x="'+(bx+1.5)+'" y="'+by+'" width="2" height="4" fill="'+bc[bi%6]+'"/>';}
    if(has(r,"b_shelf"))s+='<rect x="12" y="20" width="88" height="1" fill="'+ac+'"'+NEON+'/><rect x="12" y="36" width="88" height="1" fill="'+ac+'"'+NEON+'/>';
    s+='<rect x="8" y="58" width="100" height="5" rx="1" fill="#6b4226"/><rect x="10" y="63" width="96" height="21" fill="#3a2418"/><rect x="10" y="63" width="96" height="2" fill="'+ac+'" opacity=".6"/>';
    [24,48,72,96].forEach(function(x){s+='<rect x="'+(x-5)+'" y="70" width="10" height="3" rx="1" fill="#1a1414"/><rect x="'+(x-.8)+'" y="73" width="1.6" height="11" fill="#555"/>'});
    if(has(r,"b_neon"))s+='<text x="112" y="28" font-family="Arial Black,sans-serif" font-size="14" fill="'+ac+'"'+NEON+'>BAR</text>';
    if(has(r,"b_juke"))s+='<path d="M116 84 L116 56 Q116 44 128 44 Q140 44 140 56 L140 84Z" fill="#3a1e2e"/><path d="M119 82 L119 57 Q119 47 128 47 Q137 47 137 57 L137 82Z" fill="none" stroke="url(#qb-rainbow)" stroke-width="2"/><rect x="122" y="60" width="12" height="8" fill="#ffd27a" opacity=".7"/>';
    if(has(r,"b_menu"))s+='<rect x="112" y="34" width="22" height="16" fill="#151018" stroke="#5a3a24"/><path d="M115 39 L131 39 M115 43 L128 43 M115 47 L130 47" stroke="#e9e7ef" stroke-width=".7"/>';
    if(has(r,"b_taps"))s+='<rect x="60" y="48" width="30" height="3" fill="#a8adb8"/><rect x="64" y="51" width="2" height="7" fill="#c9ced8"/><rect x="74" y="51" width="2" height="7" fill="#c9ced8"/><rect x="84" y="51" width="2" height="7" fill="#c9ced8"/>';
    if(has(r,"b_dj"))s+='<rect x="138" y="62" width="20" height="22" fill="#111"/><rect x="136" y="58" width="24" height="5" fill="#222"/><circle cx="142" cy="60" r="2" fill="#333" stroke="'+ac+'" stroke-width=".6"/><circle cx="154" cy="60" r="2" fill="#333" stroke="'+ac+'" stroke-width=".6"/><rect x="141" y="66" width="14" height="14" rx="7" fill="#1a1a1a" stroke="#333"/><circle cx="148" cy="73" r="3" fill="'+ac+'" class="flick"/>';
  }
  if(t==="restaurant"){
    s+='<rect x="40" y="16" width="80" height="26" fill="#14100e"/><rect x="42" y="18" width="76" height="22" fill="#ffb066" opacity=".25"/><rect x="40" y="40" width="80" height="3" fill="#6b4226"/>';
    s+='<path d="M54 28 Q58 22 62 28 M70 30 Q74 24 78 30 M92 28 Q96 22 100 28" stroke="#fff" stroke-width=".7" fill="none" opacity=".5" class="tw"/>';
    var tables=[[30,1],[80,0],[128,0]];
    tables.forEach(function(tb,ti){if(ti>0&&!(has(r,"r_pend")&&ti===1)&&!(has(r,"r_oven")&&ti===2))return;var x=tb[0];
      s+='<ellipse cx="'+x+'" cy="70" rx="16" ry="3" fill="#e9e2d0"/><rect x="'+(x-1)+'" y="70" width="2" height="14" fill="#3a2a22"/><rect x="'+(x-22)+'" y="66" width="4" height="18" fill="#5a3a24"/><rect x="'+(x+18)+'" y="66" width="4" height="18" fill="#5a3a24"/>';
      var dn=dishesOn(r).length;if(dn)s+='<circle cx="'+(x-5)+'" cy="68.5" r="3" fill="#fff" stroke="#ccc" stroke-width=".4"/><circle cx="'+(x-5)+'" cy="68.5" r="1.8" fill="#ff8a5c"/>'+(dn>2?'<circle cx="'+(x+5)+'" cy="68.5" r="3" fill="#fff" stroke="#ccc" stroke-width=".4"/><circle cx="'+(x+5)+'" cy="68.5" r="1.8" fill="#9cff8a"/>':'');});
    if(has(r,"r_pend"))[30,80,128].forEach(function(x){s+='<path d="M'+x+' 5 L'+x+' 30" stroke="#222" stroke-width=".6"/><path d="M'+(x-5)+' 34 L'+(x+5)+' 34 L'+(x+3)+' 30 L'+(x-3)+' 30Z" fill="'+ac+'"/><circle cx="'+x+'" cy="36" r="10" fill="url(#qb-glow)" opacity=".7"/>'});
    if(has(r,"r_coffee"))s+='<rect x="128" y="46" width="28" height="4" fill="#6b4226"/><rect x="132" y="32" width="16" height="14" rx="1.5" fill="#c9ced8"/><rect x="134" y="35" width="12" height="5" fill="#1a1a22"/><circle cx="144" cy="37.5" r="1" fill="#4dff9a"/><rect x="138" y="42" width="4" height="3" fill="#fff"/>';
    if(has(r,"r_oven"))s+='<path d="M4 84 L4 56 Q18 40 32 56 L32 84Z" fill="#8a4a32"/><path d="M10 84 L10 68 Q18 58 26 68 L26 84Z" fill="#1a0d08"/><path d="M13 84 Q18 70 23 84Z" fill="#ff8a3d" class="fire"/><path d="M15 84 Q18 76 21 84Z" fill="#ffd27a" class="fire"/>';
    if(has(r,"r_booth"))s+='<rect x="140" y="56" width="18" height="28" rx="3" fill="#7a1e2e"/><rect x="140" y="56" width="18" height="4" rx="2" fill="#9a2e3e"/>';
    if(dishesOn(r).length)s+='<rect x="6" y="14" width="26" height='+'"'+(8+dishesOn(r).length*5)+'"'+' fill="#141016" stroke="'+ac+'" stroke-width=".6"/>'+dishesOn(r).map(function(d,k){return '<rect x="9" y="'+(19+k*5)+'" width="'+(12+((k*7)%8))+'" height="1.6" fill="#e9e7ef" opacity=".8"/>'}).join("");
    if(has(r,"r_star"))s+='<path d="M150 10 L152.4 15 L158 15.6 L153.8 19.2 L155 24.6 L150 21.8 L145 24.6 L146.2 19.2 L142 15.6 L147.6 15Z" fill="#ffd27a"'+NEON+'/>';
  }
  if(t==="garden"){
    s+='<rect x="20" y="10" width="120" height="46" fill="url(#qb-sky)"/><path d="M20 46 Q50 36 80 44 Q110 34 140 44 L140 56 L20 56Z" fill="#1d3a2a"/><rect x="20" y="10" width="120" height="46" fill="none" stroke="#2a2a2e" stroke-width="2.5"/><path d="M80 10 L80 56 M20 33 L140 33" stroke="#2a2a2e" stroke-width="1.6"/>';
    var rows=has(r,"g_box")?2:1;
    for(var gi=0;gi<rows;gi++){var gy=gi?72:80;s+='<rect x="'+(8+gi*6)+'" y="'+gy+'" width="'+(144-gi*12)+'" height="'+(gi?6:5)+'" fill="#4a2e1c"/>';
      for(var px=14+gi*6;px<150-gi*6;px+=10)s+='<path d="M'+px+' '+gy+' Q'+(px-4)+' '+(gy-8)+' '+(px-1)+' '+(gy-12)+' Q'+(px+1)+' '+(gy-6)+' '+px+' '+gy+' Q'+(px+3)+' '+(gy-9)+' '+(px+5)+' '+(gy-10)+' Q'+(px+3)+' '+(gy-4)+' '+px+' '+gy+'Z" fill="'+(gi?"#3fae5a":"#56c26a")+'"/>'+(px%20===4?'<circle cx="'+(px+1)+'" cy="'+(gy-7)+'" r="1.6" fill="#ff5c4d"/>':'');}
    if(has(r,"g_spr"))s+='<g fill="#8ad8ff" opacity=".8" class="tw"><circle cx="40" cy="64" r=".9"/><circle cx="44" cy="60" r=".9"/><circle cx="100" cy="62" r=".9"/><circle cx="104" cy="58" r=".9"/><circle cx="72" cy="61" r=".9"/></g>';
    if(has(r,"g_lamp"))s+='<rect x="20" y="58" width="120" height="2" fill="#d68aff"'+NEON+'/><rect x="20" y="60" width="120" height="16" fill="#d68aff" opacity=".08"/>';
    if(has(r,"g_koi"))s+='<ellipse cx="146" cy="90" rx="12" ry="4" fill="url(#qb-water)"/><path d="M142 90 Q145 88 148 90 Q145 92 142 90Z" fill="#ff8a3d"/>';
  }
  if(t==="farm"){
    for(var wy=10;wy<62;wy+=6)s+='<rect y="'+wy+'" width="160" height=".6" fill="'+shade(R.w,-.3)+'"/>';
    s+='<rect x="10" y="66" width="22" height="18" rx="3" fill="#d9b36c"/><path d="M10 72 L32 72 M10 78 L32 78" stroke="#a8843e" stroke-width=".8"/>';
    for(var fx=40;fx<150;fx+=7)s+='<path d="M'+fx+' 84 L'+fx+' 70" stroke="#c8a24a" stroke-width="1"/><ellipse cx="'+fx+'" cy="69" rx="1.6" ry="3.5" fill="#e6c25a"/>';
    if(has(r,"f_coop"))s+='<path d="M120 60 L138 48 L156 60Z" fill="#7a2e22"/><rect x="122" y="60" width="32" height="24" fill="#a8432e"/><rect x="134" y="70" width="8" height="14" fill="#2a1410"/><ellipse cx="114" cy="82" rx="4" ry="3" fill="#fff"/><circle cx="117" cy="79" r="2" fill="#fff"/><path d="M117 77 L118 76" stroke="#ff4d4d"/>';
    if(has(r,"f_tractor"))s+='<rect x="50" y="64" width="22" height="12" rx="2" fill="#3fae5a"/><rect x="64" y="56" width="10" height="10" fill="#2f8a4a"/><circle cx="54" cy="80" r="5" fill="#222"/><circle cx="72" cy="81" r="3.5" fill="#222"/>';
    if(has(r,"f_silo"))s+='<rect x="140" y="14" width="16" height="48" fill="#b8bfcc"/><path d="M140 14 Q148 4 156 14Z" fill="#9aa3b5"/>';
  }
  if(t==="pond"){
    s+='<rect y="70" width="160" height="16" fill="url(#qb-water)"/><path d="M0 70 Q20 67 40 70 Q60 73 80 70 Q100 67 120 70 Q140 73 160 70" stroke="#bff3ff" stroke-width=".7" fill="none" opacity=".7"/>';
    [[30,77,"#ff8a3d"],[70,80,"#ffffff"],[118,76,"#ffd27a"]].forEach(function(f2){s+='<path d="M'+f2[0]+' '+f2[1]+' Q'+(f2[0]+5)+' '+(f2[1]-3)+' '+(f2[0]+10)+' '+f2[1]+' Q'+(f2[0]+5)+' '+(f2[1]+3)+' '+f2[0]+' '+f2[1]+'Z M'+(f2[0]+10)+' '+f2[1]+' L'+(f2[0]+13)+' '+(f2[1]-2)+' L'+(f2[0]+13)+' '+(f2[1]+2)+'Z" fill="'+f2[2]+'"/>'});
    if(has(r,"p_net"))s+='<path d="M10 20 L50 20 L46 50 L14 50Z" fill="none" stroke="#c9b48a" stroke-width=".6"/><path d="M14 30 L48 30 M14 40 L47 40 M24 20 L22 50 M36 20 L36 50" stroke="#c9b48a" stroke-width=".4"/>';
    if(has(r,"p_lant"))[60,90,120].forEach(function(x){s+='<path d="M'+x+' 5 L'+x+' 16" stroke="#222" stroke-width=".5"/><ellipse cx="'+x+'" cy="21" rx="4" ry="5" fill="#ff5c4d"/><circle cx="'+x+'" cy="21" r="9" fill="url(#qb-glow)" opacity=".6"/>'});
    if(has(r,"p_pump"))s+='<rect x="140" y="58" width="12" height="14" fill="#5d6577"/><g fill="#dff6ff" class="tw"><circle cx="146" cy="66" r="1"/><circle cx="143" cy="62" r=".8"/></g>';
  }
  if(t==="gameroom"){
    s+='<rect x="44" y="14" width="72" height="34" rx="2" fill="#0b0a12" stroke="#2a2836"/><rect x="47" y="17" width="66" height="28" fill="url(#qb-screen)" opacity=".7"/>';
    if(has(r,"gm_tft")){s+='<ellipse cx="80" cy="74" rx="28" ry="6" fill="#2a1e14"/>';for(var hx2=60;hx2<102;hx2+=7)s+='<path d="M'+hx2+' 72 l3 -1.6 l3 1.6 l0 2 l-3 1.6 l-3 -1.6Z" fill="'+(hx2%14?ac:"#ffd27a")+'" opacity=".8"/>';s+='<rect x="78" y="78" width="4" height="6" fill="#1a1410"/>'}
    if(has(r,"gm_cab"))[6,22].forEach(function(x){s+='<path d="M'+x+' 84 L'+x+' 52 L'+(x+4)+' 48 L'+(x+14)+' 48 L'+(x+14)+' 84Z" fill="#1d1830"/><rect x="'+(x+3)+'" y="52" width="9" height="9" fill="'+ac+'" opacity=".85"/>'});
    if(has(r,"gm_pool"))s+='<rect x="110" y="66" width="44" height="8" rx="2" fill="#2f8a4a" stroke="#5a3a24" stroke-width="2"/><rect x="114" y="74" width="3" height="10" fill="#5a3a24"/><rect x="147" y="74" width="3" height="10" fill="#5a3a24"/>';
    if(has(r,"gm_couch"))s+='<rect x="52" y="52" width="56" height="4" fill="#2a2440"/><ellipse cx="66" cy="82" rx="8" ry="4" fill="'+ac+'" opacity=".7"/><ellipse cx="94" cy="82" rx="8" ry="4" fill="#ff8a5c" opacity=".7"/>';
  }
  if(t==="studio"){
    s+='<rect x="30" y="58" width="100" height="4" fill="#3a2a22"/><rect x="34" y="62" width="3" height="22" fill="#222"/><rect x="123" y="62" width="3" height="22" fill="#222"/>';
    s+='<rect x="58" y="38" width="20" height="14" fill="#0b0a12" stroke="#333"/><rect x="60" y="40" width="16" height="10" fill="url(#qb-screen)"/><rect x="82" y="38" width="20" height="14" fill="#0b0a12" stroke="#333"/><rect x="84" y="40" width="16" height="10" fill="'+ac+'" opacity=".5"/><rect x="66" y="52" width="4" height="6" fill="#222"/><rect x="90" y="52" width="4" height="6" fill="#222"/>';
    if(has(r,"s_mon"))[40,112].forEach(function(x){s+='<rect x="'+x+'" y="40" width="10" height="18" rx="1" fill="#141418"/><circle cx="'+(x+5)+'" cy="51" r="3" fill="#2a2a30" stroke="'+ac+'" stroke-width=".5"/><circle cx="'+(x+5)+'" cy="44" r="1.6" fill="#2a2a30"/>'});
    if(has(r,"s_panel"))[8,20,136,148].forEach(function(x,k){s+='<rect x="'+x+'" y="'+(16+(k%2)*14)+'" width="10" height="12" fill="'+shade(ac,-.5)+'"/>'});
    if(has(r,"s_synth"))s+='<rect x="54" y="55" width="52" height="4" fill="#1a1a1a"/><path d="M56 56 L104 56" stroke="#eee" stroke-width="1.2" stroke-dasharray="1.6 .6"/>';
    if(has(r,"s_booth"))s+='<rect x="138" y="44" width="20" height="40" fill="#1a1820" stroke="#333"/><rect x="141" y="48" width="14" height="12" fill="#2a3a4a" opacity=".6"/><path d="M148 64 L148 76" stroke="#888"/><circle cx="148" cy="63" r="2" fill="#555"/>';
    s+='<rect x="0" y="5" width="160" height="1.2" fill="'+ac+'"'+NEON+' opacity=".8"/>';
  }
  if(t==="gym"){
    s+='<rect x="10" y="66" width="30" height="3" fill="#333"/>';for(var di=0;di<4;di++)s+='<rect x="'+(12+di*7)+'" y="62" width="5" height="4" rx="1" fill="#555"/>';
    if(has(r,"y_bag"))s+='<path d="M60 5 L60 30" stroke="#666"/><rect x="55" y="30" width="10" height="30" rx="4" fill="#8a1e1e"/>';
    if(has(r,"y_rack"))s+='<rect x="84" y="30" width="3" height="54" fill="#444"/><rect x="112" y="30" width="3" height="54" fill="#444"/><rect x="78" y="46" width="44" height="2" fill="#bbb"/><rect x="76" y="40" width="4" height="14" rx="1" fill="#222"/><rect x="120" y="40" width="4" height="14" rx="1" fill="#222"/>';
    if(has(r,"y_tread"))s+='<path d="M128 82 L156 82 L156 78 L130 78Z" fill="#222"/><path d="M154 78 L150 52 L154 52" stroke="#555" stroke-width="2" fill="none"/>';
    if(has(r,"y_mirror"))s+='<rect x="20" y="12" width="120" height="44" fill="#9fc4ff" opacity=".12"/><path d="M30 14 L44 54 M90 14 L104 54" stroke="#fff" stroke-width=".6" opacity=".25"/>';
  }
  if(t==="library"){
    [8,40,104,136].forEach(function(x){s+='<rect x="'+x+'" y="10" width="20" height="74" fill="#3a2414"/>';for(var sy=14;sy<80;sy+=14){s+='<rect x="'+x+'" y="'+(sy+11)+'" width="20" height="2" fill="#5a3a24"/>';for(var bk=0;bk<5;bk++)s+='<rect x="'+(x+1+bk*3.8)+'" y="'+(sy+2+(bk%2))+'" width="3" height="'+(9-(bk%2))+'" fill="'+["#8a2e2e","#2e4a8a","#c8a24a","#2e7a4a","#6a3a8a"][(bk+sy)%5]+'"/>'}});
    if(has(r,"lb_lamp"))s+='<rect x="66" y="66" width="22" height="16" rx="4" fill="#7a2e22"/><path d="M92 84 L92 50" stroke="#c8a24a"/><path d="M86 50 L98 50 L95 44 L89 44Z" fill="#ffd27a"/><circle cx="92" cy="52" r="12" fill="url(#qb-glow)" opacity=".7"/>';
    if(has(r,"lb_globe"))s+='<circle cx="72" cy="50" r="6" fill="#2e6a8a"/><path d="M68 47 Q72 45 75 49 Q71 52 69 51Z" fill="#3fae5a"/><path d="M72 56 L72 62 M68 62 L76 62" stroke="#c8a24a"/>';
    if(has(r,"lb_fire"))s+='<rect x="60" y="54" width="40" height="30" fill="#5a4a44"/><rect x="66" y="64" width="28" height="20" fill="#1a0d08"/><path d="M70 84 Q80 64 90 84Z" fill="#ff8a3d" class="fire"/><path d="M74 84 Q80 72 86 84Z" fill="#ffd27a" class="fire"/>';
  }
  if(t==="sky"){
    s+='<rect y="74" width="160" height="2" fill="#666"/>';for(var rx=4;rx<160;rx+=10)s+='<rect x="'+rx+'" y="74" width="1.2" height="10" fill="#666"/>';
    s+='<rect x="60" y="62" width="40" height="4" fill="#6b4226"/><rect x="62" y="66" width="36" height="18" fill="#2a1a14"/>';
    if(has(r,"k_lights")){s+='<path d="M0 12 Q40 24 80 12 Q120 24 160 12" stroke="#333" stroke-width=".5" fill="none"/>';for(var lx=8;lx<160;lx+=12)s+='<circle cx="'+lx+'" cy="'+(12+6*Math.sin(lx/160*Math.PI*2+1.6)*-1+4)+'" r="1.4" fill="#ffd27a"'+NEON+' class="tw"/>'}
    if(has(r,"k_fire"))s+='<ellipse cx="24" cy="82" rx="12" ry="3" fill="#444"/><path d="M16 82 Q24 66 32 82Z" fill="#ff8a3d" class="fire"/>';
    if(has(r,"k_tub"))s+='<rect x="114" y="68" width="40" height="16" rx="4" fill="#c9ced8"/><rect x="117" y="70" width="34" height="5" rx="2" fill="url(#qb-water)"/>';
  }
  if(t==="dojo"){
    s+='<rect x="64" y="12" width="32" height="44" fill="#e9e2d0"/><path d="M80 18 L80 50 M72 26 L88 26 M74 36 L86 40" stroke="#1a1414" stroke-width="2"/>';
    for(var tx=0;tx<160;tx+=32)s+='<rect x="'+tx+'" y="84" width="32" height="16" fill="none" stroke="#4a3a22" stroke-width=".8"/>';
    if(has(r,"d_dummy"))s+='<rect x="24" y="40" width="4" height="44" fill="#6b4a32"/><rect x="18" y="46" width="16" height="22" rx="4" fill="#a8843e"/><circle cx="26" cy="40" r="6" fill="#a8843e"/>';
    if(has(r,"d_rack"))s+='<rect x="114" y="40" width="34" height="3" fill="#3a2414"/><path d="M114 48 L148 46 M114 54 L148 52" stroke="#c9ced8" stroke-width="1.6"/>';
    if(has(r,"d_bonsai"))s+='<rect x="136" y="76" width="16" height="8" fill="#5a3a24"/><path d="M144 76 Q140 68 146 64" stroke="#6b4a32" stroke-width="2" fill="none"/><ellipse cx="146" cy="62" rx="9" ry="5" fill="#2f8a4a"/>';
  }
  return rend(s);
}
function walkerHtml(look,k,n){
  var d=(7+((k*37)%6)).toFixed(1), x0=6+((k*23)%20), x1=56+((k*31)%28);
  return '<div class="walker" style="--d:'+d+'s;--x0:'+x0+'%;--x1:'+x1+'%;animation-delay:-'+(k*1.7).toFixed(1)+'s"><div class="flip" style="animation-delay:-'+(k*1.7).toFixed(1)+'s">'+figSvg(look,"14 0 72 194",20,54)+'</div></div>';
}
