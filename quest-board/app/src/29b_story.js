/* ---------- the story that opens rooms (Cal, 2026-11-05; docs/PROGRESSION.md) ----------
   Kode Plaza and Calibur Mall open one step at a time. A step opens when its gate is met: some with a short scene, in the
   style of Dave the Diver, where someone walks in and offers the next step; some quietly. "lot" puts a lot on the street to
   buy with your own coins, "upgrade" lets a room's own "Open the ..." upgrade be bought, "free" opens the room at once.
   A room a save already owns counts as done, so nobody loses anything. The Loft keeps opening as before. */
/* Each step has a "why": the reason it happens now, shown when it opens and on its locked card until then. Investors look at
   every coin ever earned (S.earnedC, ECON.gateLockKey and gateMall; Cal: "it should never feel like you are at a
   standstill"), so upgrading other rooms while a gate fills still counts. */
/* rooms built in The Loft (building 0 in ROOMCELL: Bedroom, Walk-in Closet, Hero's Lair, Trophy Room, Patio, Game Room) */
function loftRooms(){return S.base.slots.filter(function(r){return r&&ROOMCELL[r.t]&&ROOMCELL[r.t][0]===0}).length}
var STORY=[
  /* Cal, 2026-11-05: the Garden is its own lot, at level 5 (ECON.stepLv); each later step has a least level too */
  /* Cal, 2026-11-09: "garden should be available after you build 4 rooms. For example, the bedroom, the walk in closet, the game
     room, and the patio, or sub out one for the heros lair ... then there should be a popup that says something like you decided
     to pick up a new hobby and try gardening." Four rooms in The Loft (the Bedroom counts), then a short scene. */
  {id:"garden",room:"garden",how:"lot",why:"Build 4 rooms in The Loft and you might pick up a new hobby.",gate:function(){var ls=loftShare();return ls[0]>=Math.ceil(ls[1]*ECON.gardenLoft)},
    scene:{who:"A new hobby",role:"The Loft",lines:["Half the Loft done, and the place finally feels like home. You decided to pick up a new hobby: gardening.","There's an empty lot right next to your building, and nobody's using it."],yes:"Check out the lot"}},
  /* Cal: "the next upgrade should be a restaurant that expands from it": Mara's yes unlocks the Garden's expansion upgrade */
  /* Cal, 2026-11-06: "The restaurant upgrade should come sooner so we have incentive to keep upgrading the garden past the main
     lot": 12 produce sold (about a day of a watered first bed), not 60 */
  {id:"chef",room:"restaurant",how:"upgrade",why:"Keep the Garden growing. Someone in the neighborhood is paying attention.",gate:function(){return styHas("garden")&&styState().sold>=12},
    scene:{who:"Mara",role:"Chef",lines:["Wait, you grew these? I've been buying your vegetables from that window.","Knock through into the space next to your garden and I'll run the stove. Partners?"],yes:"Partners. Let's build it",team:"mara"}},
  {id:"boba",room:"boba",how:"lot",why:"Once the restaurant is busy, customers start asking for drinks.",gate:function(){return styHas("restaurant")&&roomEarn("restaurant")>=ECON.bobaEarn},
    scene:{who:"Mara",role:"Chef",lines:["Half our customers ask for something cold to drink on the way out.","The corner unit next door is empty. A boba shop there would never be quiet."],yes:"Let's do it"}},
  {id:"dessert",room:"dessert",how:"upgrade",why:"When the boba line runs out the door, the space upstairs can become a dessert parlor.",gate:function(){return styUps("boba")>=4}},
  /* Cal, 2026-11-07: "I want the bar to be available after it starts to look like a fine dining luxury restaurant": Desmond only
     came once the Restaurant had White Linen Service (r_t3); see the next note for the rule now */
  /* Cal (2026-11-08, v0.73 phone test): "whats the trigger for opening the bar? After unlocking the noir upgrade, I want the bar to be a
     next event". Desmond comes once the Restaurant goes Noir (r_noir, level 28), with no earnings threshold; before, it waited for Fine
     Dining Service (r_t3, level 36) and 25,000 coins earned. */
  {id:"lockkey",room:"skybar",how:"free",why:"Once the Restaurant goes Noir, an investor starts eating there.",gate:function(){return styHas("restaurant")&&styNoir()},
    scene:{who:"Desmond Hale",role:"Investor",lines:["I've eaten here four nights running. Charcoal walls, low light, a real kitchen. I keep asking for the same table.","Your second floor is just storage? Let me fund a speakeasy up there. Live band, singers. Lock and Key."],yes:"Open Lock and Key"}},
  {id:"rafe",room:null,how:"team",why:"Someone has become a regular at Lock and Key.",gate:function(){return styUps("skybar")>=3},
    scene:{who:"Rafe Calloway",role:"Traveling adventurer",at:"Lock and Key",lines:["A sunburnt stranger with a map tattooed on his forearm takes the stool at the end of your bar. Old Fashioned, stirred.","\"Best drink since a dockside bar off the Coral Reach. I'm in town between expeditions. Mind if I make this my spot?\""],yes:"Pour him another",team:"rafe"}},
  {id:"rooftop",room:"rooftop",how:"upgrade",why:"Lock and Key's regulars keep asking about the roof.",gate:function(){return styUps("skybar")>=6}},
  /* Cal, 2026-11-09: "The Calibur Mall should be currently locked away in the live game because all the assets need to have a
     proper QA check ... I want to personally review all this". MALLHOLD keeps the Mall step (and so everything inside the Mall:
     Theater, Auditorium, Arcade, Bowling, Karaoke, Club) closed in a Live build (QB_WEB.noTest) until Cal approves the layout;
     the sandbox keeps it open for his review. A save that already owns the Mall keeps it. Set MALLHOLD to false to open it. */
  {id:"mall",room:"mall",how:"lot",why:"Another investor is watching how much you earn.",gate:function(){return !mallHeld()&&ECON.plazaAll.every(styHas)},
    scene:{who:"Priya Okafor",role:"Investor",lines:["I've been counting foot traffic on your plaza. Nothing else on the street comes close.","There's an empty strip mall up the street. Buy in with me and fill it one store at a time."],yes:"Buy the strip mall"}},
  {id:"nova",room:null,how:"team",why:"Someone keeps filming in your mall.",gate:function(){return styUps("mall")>=3&&styMallHas("ml_shop1")},
    scene:{who:"Nova Lin",role:"Fashion vlogger",at:"the strip mall",lines:["A girl with a ring light clipped to her phone is filming a haul outside your clothing store.","\"Are you the owner? My followers keep asking where I shop. Could I film here every week?\""],yes:"Deal. Roll the camera",team:"nova"}},
  {id:"theater",room:"theater",how:"lot",why:"Once the mall has a few stores, shoppers want a reason to stay: its empty end unit could be a movie theater.",gate:function(){return styUps("mall")>=4}},
  /* Cal: the Auditorium opens free once the lobby has its basics (ticket booth, popcorn, soda) and someone to run it: Theo */
  {id:"auditorium",room:"auditorium",how:"free",why:"A theater needs its basics in the lobby (a ticket booth, popcorn and a soda fountain) and someone to run it.",gate:function(){var r=S.base.slots.filter(function(x){return x&&x.t==="theater"})[0];return !!r&&["t_booth1","t_pop","t_soda"].every(function(k){return r.a&&r.a[k]})},
    scene:{who:"Theo",role:"Theater crew",lines:["Saw the ticket stand go up. You're going to need someone behind it.","Hire me and we can open the screen room tonight."],yes:"Hire Theo, open the Auditorium",team:"theo"}},
  {id:"arcade",room:"arcade",how:"upgrade",why:"Movie crowds want something to do before the show: the mall can open an arcade.",gate:function(){return styUps("auditorium")>=3}},
  {id:"rhythm",room:"rhythm",how:"upgrade",why:"When the arcade is packed, the room upstairs can become a rhythm floor.",gate:function(){return styUps("arcade")>=4}},
  {id:"vr",room:"vr",how:"upgrade",why:"When the arcade is packed, the unit next door can become a VR arena.",gate:function(){return styUps("arcade")>=4}},
  {id:"bowling",room:"bowling",how:"upgrade",why:"The arcade crowd wants league nights: the mall can open a bowling alley.",gate:function(){return styUps("arcade")>=6}},
  {id:"karaoke",room:"karaoke",how:"upgrade",why:"After a few rounds of bowling everyone wants to sing: the mall can open karaoke.",gate:function(){return styUps("bowling")>=6}},
  {id:"club",room:"club",how:"lot",why:"Once everyone stays out late, the last empty unit becomes a nightclub.",gate:function(){return styUps("karaoke")>=6}},
  /* the Speakeasy is now part of Lock and Key, the second floor (Cal): its old door never opens */
  {id:"speakeasy",room:"speakeasy",how:"never",why:"Part of Lock and Key now.",gate:function(){return false}}
];
/* the Garden's expansion that opens the Restaurant, at the Restaurant's own price; a mystery card until Mara says yes */
(function(){if(!ADDONS.garden||ADDONS.garden.some(function(a){return a[0]==="gd_rest"}))return;
  /* first in the Garden's menu, so it shows as the teaser from day one and as the next buy once Mara says yes */
  ADDONS.garden.unshift(["gd_rest","Knock Through to a Restaurant",(ROOMT.restaurant&&ROOMT.restaurant.cost)||2500,{opens:"restaurant",g:"Expansion",fixed:1},"Open the wall next to the beds into a small kitchen and a dining room. Mara runs the stove."])})();
function styState(){if(!S.story||typeof S.story!=="object")S.story={};var o=S.story;o.done=o.done||{};o.offer=o.offer||{};o.team=o.team||{};o.sold=o.sold||0;o.later=o.later||{};o.biz=o.biz||0;return o}
function styNoir(){var r=S.base&&S.base.slots.filter(function(x){return x&&x.t==="restaurant"})[0];return !!(r&&r.a&&r.a.r_noir)}
function styFine(){var r=S.base&&S.base.slots.filter(function(x){return x&&x.t==="restaurant"})[0];return !!(r&&r.a&&r.a.r_t3)}
function styMallHas(k){var r=S.base&&S.base.slots.filter(function(x){return x&&x.t==="mall"})[0];return !!(r&&r.a&&r.a[k])}
function styHas(t){return !!t&&S.base&&S.base.slots.some(function(r){return r&&r.t===t})}
function styUps(t){var r=S.base&&S.base.slots.filter(function(x){return x&&x.t===t})[0];return r?addonsOf(r).length:0}
function styStep(room){return STORY.filter(function(s){return s.room===room})[0]}
/* may this room be opened now (as a lot or by its upgrade)? Rooms outside the story always may. */
function styAllows(room){var s=styStep(room);if(!s)return styHas(room)||!(typeof ECON!=="undefined"&&ECON.unlock&&ECON.unlock[room])||unlockMet(room);var o=styState();return !!(o.done[s.id]||o.offer[s.id]||styHas(room))}
/* the street's lots: the story's lots that are open and not yet built, plus anything outside the story */
var styLotsBase=lotsOpen;
lotsOpen=function(){var o=styState(),out=styLotsBase().filter(function(k){return !styStep(k)});
  STORY.forEach(function(s){if(s.how==="lot"&&o.offer[s.id]&&!styHas(s.room)&&out.indexOf(s.room)<0)out.push(s.room)});return out};
nextRoom=function(){return lotsOpen()[0]||null};
buildableList=function(){return lotsOpen()};

function styOpen(s){var o=styState();o.offer[s.id]=1;if(s.how==="team"){o.done[s.id]=1;persist();render();return}
  if(s.how==="free"&&!styHas(s.room)){S.base.slots.push({t:s.room,a:{},st:0,pend:0});o.done[s.id]=1;
    /* a free opening also counts as the room's paid opener, so it never sits on a menu for coins (the Theater's Open the Auditorium) */
    S.base.slots.forEach(function(r){if(!r)return;(ADDONS[r.t]||[]).forEach(function(a){if(a[3]&&a[3].opens===s.room){r.a=r.a||{};r.a[a[0]]=1}})});try{if(typeof LFV!=="undefined")LFV.init=0}catch(e){}render();persist();try{roomSplash(s.room)}catch(e){};return}
  persist();render();
  pop((s.why&&!s.scene?s.why+" ":"")+(s.how==="lot"?"A new lot is open on the street: "+ROOMT[s.room].name+".":ROOMT[s.room].name+" can now be opened from its room's upgrades."))}
/* ---- story rooms open a day apart, on several triggers (Cal, 2026-11-10: "Rooms should open a day apart ... only the ones that have
   questlines tagged to them such as the restaurant, boba shop, bar, dessert parlor, strip mall. There has to be multiple triggers that
   are met. One is the level cap, one is the amount of money gained before someone decides to open up another business with you and at
   least a day.") ----
   STYCHAIN: the story rooms in order, the Garden first (SPEC8: Lock and Key now before Boba). When each room opened lives in
   S.story.open; rooms a save already had count as opened long ago.
   w-unlock (Cal, 2026-11-10): a room opens on its line in ECON.unlock (a share of a room's upgrades, of the Loft or of Kode Plaza, the
   Garden's sales, or Noir), with no level floor and no day wait; it replaced SPEC8's focus rule. The card lines say what to do and how
   far along it is, never what opens. */
var STYCHAIN=[["garden","garden"],["chef","restaurant"],["lockkey","skybar"],["boba","boba"],["dessert","dessert"],["mall","mall"]];
function styOpened(){var o=styState();if(!o.open||typeof o.open!=="object"){o.open={};STYCHAIN.forEach(function(c){if(styHas(c[1]))o.open[c[1]]={d:"",c:0}})}
  STYCHAIN.forEach(function(c){if(styHas(c[1])&&!o.open[c[1]]){o.open[c[1]]={d:today(),c:Math.floor(S.earnedC||0)};persist()}});return o.open}
/* the room a step's trigger happens in (for the Goals list, 29bg_goals.js) */
function unlockSrc(room){var u=(ECON.unlock||{})[room];if(!u)return null;return u.at||u.earn||(u.loft?"bedroom":u.noir?"restaurant":u.plaza?ECON.plazaAll[ECON.plazaAll.length-1]:null)}
function rmName(t){return (ROOMT[t]||{}).name||t}
function slotOf(t){return S.base&&S.base.slots.filter(function(x){return x&&x.t===t})[0]}
/* a room's fill: upgrades bought of the ones it can take (not retired, not openers, not the Trophy Room's finds) */
function roomFill(r){var L=(ADDONS[r.t]||[]).filter(function(a){var e=a[3]||{};return !e.retired&&!e.opens&&!e.trophy}),n=L.filter(function(a){return r.a&&r.a[a[0]]}).length;
  return {n:n,tot:L.length,half:Math.ceil(L.length*ECON.focusMin)}}
/* [bought, all] over a set of rooms, built or not (the Loft's and Kode Plaza's shares) */
function roomsShare(list){var n=0,tot=0;list.forEach(function(t){var L=(ADDONS[t]||[]).filter(function(a){return !(a[3]&&a[3].retired)}),r=slotOf(t);tot+=L.length;
  if(r)n+=L.filter(function(a){return r.a&&r.a[a[0]]}).length});return [n,tot]}
function loftShare(){return roomsShare(ECON.loftCore)}
/* coins a room has made: collected from it (r.earn, 30_app_b.js rcollect), or from its produce sales for the Garden */
function roomEarn(t){var r=slotOf(t);return r?Math.floor(r.earn||0):0}
/* is room t's unlock met (ECON.unlock), and its line: [what, met, text, bar 0-1, goal text, goal progress], naming only rooms the
   player has. An upgrade step never shows its total (Cal: "so it remains a mystery when upgrading to see how far it will go") */
function unlockUps(kind,met,place,n,need){return [kind,met,place+" upgrades: "+n+" bought",need?Math.min(1,n/need):1,"More "+place+" upgrades",n+" bought"]}
function unlockMet(t){var l=unlockLine(t);return !l||l[1]}
/* LEAD (Cal stuck at level 14 on "Something else opens first"): a room waiting on a room the player doesn't have shows that room's own
   next step, as far back as it takes, so the line is always something to do and never names a room the player doesn't have */
function unlockVia(t,d){var s=styStep(t),o=styState();if(s&&(o.offer[s.id]||(d<6&&unlockMet(t)&&!o.done[s.id])))return ["wait",false,o.offer[s.id]?"Something new is ready to build":"Someone wants to talk to you"];
  var l=d<6?unlockLine(t,d+1):null;return l||["wait",false,"Keep playing"]}
/* the next thing to buy toward an upgrade (its own needs first), in a room the player has */
function unlockNext(room,id){var r=slotOf(room),by={};if(!r)return null;(ADDONS[room]||[]).forEach(function(a){by[a[0]]=a});var a=by[id],n=0;
  while(a&&n++<6){var e=a[3]||{},q=by[ADDREQ[a[0]]]||by[e.also];if(q&&!(r.a&&r.a[q[0]]))a=q;else break}return a&&!(r.a&&r.a[a[0]])?a:null}
/* the upgrade in this room that the story waits on next (the Restaurant's way to Noir, which opens the bar), so the room window
   lists it first, even while it waits for its dishes, like an upgrade that opens a room (Cal: "make sure my dead end bug doesnt appear") */
function styNextBuy(room){if(room!=="restaurant"||styNoir()||styHas("skybar"))return null;var a=unlockNext("restaurant","r_noir");return a?a[0]:null}
function unlockLine(t,d){d=d||0;var u=(ECON.unlock||{})[t];if(!u)return null;
  if(u.at){var r=slotOf(u.at);if(!r)return unlockVia(u.at,d);var f=roomFill(r),need=u.n!=null?Math.min(u.n,f.tot):Math.ceil(f.tot*u.pct);/* n: a fixed count, so a room's +15 does not push the next room back (LEAD, 2026-11-17) */
    return unlockUps("at",f.n>=need,rmName(u.at),f.n,need)}
  if(u.loft){var ls=loftShare(),nl=Math.ceil(ls[1]*u.loft);return unlockUps("loft",ls[0]>=nl,"Loft",ls[0],nl)}
  if(u.earn){if(!slotOf(u.earn))return unlockVia(u.earn,d);var e=roomEarn(u.earn);
    return ["earn",e>=u.coins,rmName(u.earn)+" sales: "+Math.min(e,u.coins).toLocaleString()+" of "+u.coins.toLocaleString()+" coins"]}
  /* the bar: the Restaurant's Noir; the line names the next upgrade to buy toward it (Noir, or what it needs first) */
  if(u.noir){if(!slotOf("restaurant"))return unlockVia("restaurant",d);if(styNoir())return ["noir",true,"Restaurant: Noir"];/* Noir comes up in the Restaurant's list in price order, so the line says to keep going until it, not to buy a piece the window
       may not show yet (QA: "a player is told to buy something they can't find") */
    return ["noir",false,"Keep upgrading the Restaurant until Noir",null,"Restaurant: reach Noir",""]}
  /* the Mall: every Kode Plaza room built first (econsim: with only the Garden and the Restaurant it opened before Lock and Key) */
  if(u.plaza){var miss=ECON.plazaAll.filter(function(k){return !styHas(k)})[0];if(miss)return unlockVia(miss,d);var ps=roomsShare(ECON.plazaAll),np=u.n!=null?Math.min(u.n,ps[1]):Math.ceil(ps[1]*u.plaza);
    return unlockUps("plaza",ps[0]>=np,"Kode Plaza",ps[0],np)}
  return null}
/* Cal (2026-11-10): "I want the garden, then the restaurant, and then bar as soon as the noir upgrade unlocks. Don't need to lock any of
   these by level since they have a coin earned goal": Lock and Key goes right after the Restaurant in the story (ahead of Boba and
   Dessert), and a save that already has Boba or Dessert but no bar gets it at once */
(function(){var f=function(id){for(var i=0;i<STORY.length;i++)if(STORY[i].id===id)return i;return -1},i=f("lockkey"),j=f("boba");if(i>j&&j>=0){var s=STORY.splice(i,1)[0];STORY.splice(j,0,s)}})();
/* a story step's trigger (the Goals use it) */
function styTrig(s){return s&&s.room?unlockLine(s.room):null}
/* [what, met, text] for each trigger of a story step: its level (the people who join keep one) and its unlock */
function styTriggers(s){if(!s||!s.room||s.how==="never")return null;var L=ECON.stepLv[s.id]||0,lv=effLvl(),out=[],tr=unlockLine(s.room);
  if(L>1)out.push(["lv",lv>=L,"Level "+Math.min(lv,L)+" of "+L]);if(tr)out.push(tr);return out}
/* SPEC8's focus rule is gone (Cal replaced it with the table) */
function styChainOk(s){return true}
/* each story room's gate is its unlock (the Mall also waits while it is held) */
STORY.forEach(function(s){if(!s.room||s.how==="never")return;var g0=s.gate;s.gate=function(){return ECON.unlock&&ECON.unlock[s.room]?(unlockMet(s.room)||(s.id==="lockkey"&&(styHas("boba")||styHas("dessert"))))&&(s.id!=="mall"||!mallHeld()):g0()}});
/* the reason a room is still closed, for its locked card */
var MALLHOLD=true;
function mallHeld(){return MALLHOLD&&!!(window.QB_WEB&&QB_WEB.noTest)&&!styHas("mall")}
/* SPEC9: a locked card says what to do and how far along it is, never the story's why line (it names what comes next) */
function styWhy(room){var s=styStep(room);if(s&&s.id==="mall"&&mallHeld())return "Something new is waiting. It comes in a later update.";
  var T=s?styTriggers(s):(unlockLine(room)?[unlockLine(room)]:null);if(T&&T.length)return T.map(function(x){return (x[1]?"✓ ":"")+x[2]}).join(". ")+".";
  return "Keep growing your business."}
/* W25 (QA, 2026-11-10): the triggers one per line, a tick on each one met */
function styWhyHtml(room){var s=styStep(room),T=s&&s.id==="mall"&&mallHeld()?null:s?styTriggers(s):(unlockLine(room)?[unlockLine(room)]:null);if(!T||!T.length)return esc(styWhy(room));
  return '<span class="stytr">'+T.map(function(x){return '<span'+(x[1]?' class="ok">✓ ':'>')+esc(x[2])+(x[3]!=null&&!x[1]?'<i class="stybar"><i style="width:'+Math.round(x[3]*100)+'%"></i></i>':'')+'</span>'}).join("")+'</span>'}
/* a story room that no upgrade opens (a lot on the street, or one that is given) shows its triggers at the top of the room its
   trigger happens in: the Garden in the Bedroom, Boba in Lock and Key, the Mall in the Restaurant, the Theater in the Mall ... */
function styNextHtml(t){var o=styState(),h="";
  STORY.forEach(function(s){if(!s.room||s.how==="never"||(s.how!=="lot"&&s.how!=="free")||o.done[s.id]||o.offer[s.id]||styHas(s.room))return;
    if(unlockSrc(s.room)!==t)return;
    if(Object.keys(ADDONS).some(function(rt){return (ADDONS[rt]||[]).some(function(a){return a[3]&&a[3].opens===s.room})}))return;
    h+='<div class="addon next mystery stynext" aria-label="A room still to come"><span class="label">Coming next</span><b>? ? ?</b><small>'+styWhyHtml(s.room)+'</small><button class="btn ghost" disabled>Not yet</button></div>'});
  return h}
/* QA (v0.66): a step without its own portrait uses the same person's portrait from another step (the boba scene is Mara's: chef) */
function styPortrait(s){var n="ui_story_"+s.id+".webp",u=window.QBART&&QBART[n];
  /* the Garden's scene is the player's own idea: their character, not a stranger's initials */
  if(!u&&s.id==="garden")return '<span class="sty-pic sty-me">'+calImg(lookOf(),"idle",88,"")+'</span>';
  if(!u&&window.QBART&&s.scene)STORY.some(function(o){if(o!==s&&o.scene&&o.scene.who===s.scene.who&&QBART["ui_story_"+o.id+".webp"]){u=QBART["ui_story_"+o.id+".webp"];return true}});
  return u?'<img class="sty-pic" src="'+u+'" alt="">':'<div class="sty-pic sty-pic0" aria-hidden="true">'+esc(s.scene.who.split(" ").map(function(w){return w[0]}).join("").slice(0,2))+'</div>'}
/* one line per screen, tap to continue (Cal: a lot of reading for one screen); the choices come with the last line */
function styCard(c,pic,acts){var n=c.lines.length;
  return '<div class="card box2 sty">'+(c.at?'<span class="label">At '+esc(c.at)+'</span>':'')+'<div class="sty-who">'+pic+'<div><b>'+esc(c.who)+'</b><small>'+esc(c.role)+'</small></div></div>'
    +c.lines.map(function(l,i){return '<p class="sty-line"'+(i?' hidden':'')+' data-k="'+i+'">'+esc(typeof l==="function"?l():l)+'</p>'}).join("")
    +(n>1?'<div class="sty-act sty-more"><button class="btn ghost" data-act="stynext">Next &rsaquo;</button><small>1 / '+n+'</small></div>':'')
    +'<div class="sty-act sty-last"'+(n>1?' hidden':'')+'>'+acts+'</div></div>'}
function styScene(s){var c=s.scene,o=styState();o.seen=o.seen||{};o.seen[s.id]=1;o.lastScene=Date.now();
  modal(styCard(c,styPortrait(s),'<button class="btn" data-act="styyes" data-v="'+s.id+'">'+esc(c.yes)+'</button><button class="btn ghost" data-act="styno" data-v="'+s.id+'">Not yet</button>'))}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=stynext]");if(!b)return;var card=b.closest(".sty"),ls=card.querySelectorAll(".sty-line"),k=0;
  ls.forEach(function(p,i){if(!p.hidden)k=i});if(k+1>=ls.length)return;ls[k].hidden=true;ls[k+1].hidden=false;var sm=card.querySelector(".sty-more small");if(sm)sm.textContent=(k+2)+" / "+ls.length;
  if(k+2>=ls.length){card.querySelector(".sty-more").hidden=true;card.querySelector(".sty-last").hidden=false}});

/* Return visits: the people you have met drop by as the businesses grow, so they are part of the world, not a one-time
   conversation. Each plays once, at most one every 25 minutes, never over a story step that opens something. */
var BEATS=[
  {id:"mara1",pic:"mara",who:"Mara",role:"Chef",at:"the restaurant",gate:function(){return styUps("restaurant")>=5},lines:["Table six sent their compliments to the chef.","I'm keeping the note."]},
  {id:"mara2",pic:"mara",who:"Mara",role:"Chef",at:"the boba shop",gate:function(){return styUps("boba")>=2},lines:["Your boba kid keeps borrowing my tapioca for dessert experiments.","I'm letting it go. Two of them are going on the menu."]},
  {id:"mara3",pic:"mara",who:"Mara",role:"Chef",at:"the dessert parlor",gate:function(){return styUps("dessert")>=3},lines:["Someone proposed at table four tonight. She said yes.","I sent out dessert on the house."]},
  {id:"desmond2",pic:"lockkey",who:"Desmond Hale",role:"Investor",at:"Lock and Key",gate:function(){return styUps("skybar")>=6},lines:["The singer you booked? Sold out three weekends running.","I've backed a lot of rooms. This is one of the good ones."]},
  {id:"rafe2",pic:"rafe",who:"Rafe Calloway",role:"Traveling adventurer",at:"the rooftop",gate:function(){return teamHas("rafe")&&styHas("rooftop")},lines:["You can see the whole city from up here. Reminds me of the lighthouse at the edge of the Coral Reach.","Did I ever tell you about the sunken temple? Pull up a chair."]},
  /* QA (story read): Sable names the Old Metro first, Rafe asks about it later */
  {id:"sable2",pic:"sable",who:"Sable",role:"Scout",at:"the lounge",gate:function(){return teamHas("sable")&&(styState().missions||0)>=5},lines:["The Old Metro's gone quiet.","Something deeper down is collecting crowns. I've seen the scratch marks."]},
  {id:"rafe3",pic:"rafe",who:"Rafe Calloway",role:"Traveling adventurer",at:"Lock and Key",gate:function(){return teamHas("rafe")&&teamHas("sable")&&(styState().missions||0)>=8},lines:["Your scouts have been down in the Old Metro? Next time, take me.","I've been down worse tunnels than those."]},
  {id:"priya2",pic:"mall",who:"Priya Okafor",role:"Investor",at:"the strip mall",gate:function(){return styHas("theater")},lines:["A movie theater. In our strip mall.","Do you know what this does to foot traffic? Weekends are going to be full."]},
  {id:"nova2",pic:"nova",who:"Nova Lin",role:"Fashion vlogger",at:"the strip mall",gate:function(){return teamHas("nova")&&styUps("mall")>=6},lines:["The haul video just passed a million views.","Brace yourself for Saturday."]},
  {id:"nova3",pic:"nova",who:"Nova Lin",role:"Fashion vlogger",at:"the arcade",gate:function(){return teamHas("nova")&&styHas("arcade")},lines:["I'm streaming from the arcade tonight.","Twelve thousand people watching me lose at the claw machine."]},
  {id:"theo2",pic:"theo",who:"Theo",role:"Theater crew",at:"the auditorium",gate:function(){return teamHas("theo")&&styUps("auditorium")>=3},lines:["First sold-out screening.","I watched the whole thing from the projection booth."]},
  /* the dungeon sets (29d_dungeon.js): someone remarks when each is finished */
  {id:"sable3",pic:"sable",who:"Sable",role:"Scout",at:"the Armory",gate:function(){return teamHas("sable")&&typeof dgDone==="function"&&dgDone("goblin")},lines:["That's the whole set. Helm to boots.","Whatever was wearing that crown down there isn't wearing it anymore."]},
  {id:"rafe4",pic:"rafe",who:"Rafe Calloway",role:"Traveling adventurer",at:"Lock and Key",gate:function(){return teamHas("rafe")&&typeof dgDone==="function"&&dgDone("amulet")},lines:["Those five shards your scouts kept bringing up from the Old Metro? Together they make an amulet. I saw a drawing of it once, in a museum in Lisbon.","The card under it said lost at sea, 1891."]}
];
/* a return visit uses the character's own portrait, else their first scene's (Mara: chef, Theo: auditorium), else their team banner */
var STYPICAKA={mara:"chef",theo:"auditorium"};
function styBeatPic(b){var u=window.QBART&&(QBART["ui_story_"+b.pic+".webp"]||QBART["ui_story_"+(STYPICAKA[b.pic]||"-")+".webp"]||QBART["ui_team_"+b.pic+".webp"]);
  return u?'<img class="sty-pic" src="'+u+'" alt="">':'<div class="sty-pic sty-pic0" aria-hidden="true">'+esc(b.who.split(" ").map(function(w){return w[0]}).join("").slice(0,2))+'</div>'}
function styBeat(){var o=styState(),now=Date.now();o.beats=o.beats||{};if(now-(o.lastScene||0)<25*60000)return false;
  for(var i=0;i<BEATS.length;i++){var b=BEATS[i],ok=false;if(o.beats[b.id])continue;try{ok=b.gate()}catch(e){}if(!ok)continue;
    o.beats[b.id]=1;o.lastScene=now;S.coins+=60;S.earnedC+=60;persist();modal(styCard(b,styBeatPic(b),'<button class="btn" data-act="mclose">Continue</button><small class="sty-xp">+60 coins</small>'));return true}
  return false}
/* every dungeon crawl brought home counts in styState().missions (dngClaim in 10_app_a.js) */
/* look for the next step now and then, never over another window, one scene at a time */
/* a story step below the shared-slot level that is ready to open (gate and level met), for 29h_unlocks.js */
/* returns that step's own level, or 0 when none is ready */
function styReadyLow(){var o=styState();if(o.stepDay===today()&&!(S.testFree>0))return 0;for(var i=0;i<STORY.length;i++){var s=STORY[i],L=ECON.stepLv[s.id]||0;
  if(o.done[s.id]||o.offer[s.id]||s.how==="never"||L>=ECON.oneSlotBelow||ECON.slotFree[s.id])continue;var ok=false;try{ok=s.gate()&&effLvl()>=L&&styChainOk(s)}catch(e){}if(ok)return L||1}return 0}
function styCheck(){if(!loaded||!S.base||!S.created||view==="shop"||view==="away")return;/* QA v1.79: not over the Crawls tab either *//* QA: never in the middle of a purchase */var o=styState(),now=Date.now();
  STORY.forEach(function(s){if(!o.done[s.id]&&styHas(s.room))o.done[s.id]=1});styOpened();
  /* the 4-room Garden rule (2026-11-09) also applies to a save that was offered the lot before it and never built it: the offer
     goes back, and the hobby scene comes once The Loft has 4 rooms */
  if(o.offer.garden&&!o.done.garden&&!styHas("garden")&&loftRooms()<4){delete o.offer.garden;persist()}
  if(document.querySelector("#layer .modal,.modal.qbsv,.dropsplash"))return;
  for(var i=0;i<STORY.length;i++){var s=STORY[i];if(o.done[s.id]||o.offer[s.id]||s.how==="never")continue;
    var ok=false;try{ok=s.gate()&&effLvl()>=(ECON.stepLv[s.id]||0)&&styChainOk(s)}catch(e){}if(!ok)continue;
    /* QA (2026-11-05): at most one new story step a day, so unlocks arrive along the way (Cal) */
    /* Cal, 2026-11-09: the Garden and the Restaurant (ECON.slotFree) never wait for the early one-a-day slot or an area */
    var sf=!!ECON.slotFree[s.id];
    /* Cal (2026-11-10): a room whose trigger is met opens now, not days later; the one-a-day rule is for the early team steps */
    if((!sf&&o.stepDay===today()&&!(S.testFree>0))||(!sf&&!unlockSlotFree(ECON.stepLv[s.id]||0)))break;
    /* QA (3d65b70): early unlocks go in order of their own level, so an area waiting from a lower level (the Hall at 4) goes before this step */
    var wa=typeof areaLowestWaiting==="function"?areaLowestWaiting():0;if(!sf&&wa&&wa<(ECON.stepLv[s.id]||0)&&wa<ECON.oneSlotBelow)break;
    if(s.scene){if((o.later[s.id]||0)>now)continue;o.stepDay=today();if(!sf)unlockTake();styScene(s);return}
    o.stepDay=today();if(!sf)unlockTake();styOpen(s);return}
  styBeat()}
setInterval(styCheck,15000);setTimeout(styCheck,4000);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=styyes],[data-act=styno],[data-act=stysell]");if(!b)return;
  var a=b.dataset.act,o=styState();
  if(a==="stysell"){var n=Math.floor((S.base.food&&S.base.food.veg)||0);if(!n){pop("Nothing to sell yet");return}var c=n*((typeof ECON!=="undefined"&&ECON.vegCoin)||4);S.base.food.veg-=n;/* w-econ3: counts in the day's business payout (payRoom) */if(typeof payTake==="function")payTake(c);o.sold+=n;S.coins+=c;S.earnedC+=c;var gs=slotOf("garden");if(gs)gs.earn=(gs.earn||0)+c;/* w-unlock: the Garden's sales open the Restaurant */persist();render();pop("Sold "+n+" produce: +"+c+" coins");var om=document.querySelector(".rmodal .rm-scroll");if(om)roomModal(+om.dataset.i);return}
  var s=STORY.filter(function(x){return x.id===b.dataset.v})[0];if(!s)return;var m=b.closest(".modal");if(m)m.remove();
  if(a==="styno"){o.later[s.id]=Date.now()+30*60000;persist();return}
  if(s.scene&&s.scene.team){o.team[s.scene.team]=1;try{teamJoin(s.scene.team)}catch(e){}}styOpen(s)});
/* the Garden window sells what it grew; that is how the restaurant's partner finds you */
/* Cal, 2026-11-06: "don't mention you can sell produce until we get to that point in the garden ... Everything should unlock
   sequentially and never revealed outright": the sell row stays hidden until the first produce is ready, which says so once */
function stySellHtml(){var n=Math.floor((S.base.food&&S.base.food.veg)||0),o=styState();
  /* then (same day): "Selling should happen once we have our first plot that is growing produce ... There's no clear indication of
     how to sell produce or when the selling starts": from the first growing bed this row says plainly what happens and when */
  if(n<1&&!o.sold){var wet=typeof gdWateredAt!=="function"||gdWateredAt(Date.now()),rt=typeof gdRate==="function"?gdRate():0,mins=rt>0?Math.max(1,Math.round(60/rt)):0;
    return '<div class="sty-sell sty-first"><span>'+(wet?'Your first bed is growing. Each vegetable it grows lands here, and you sell it from this window'+(mins?' (about one every '+(mins>=60?Math.round(mins/60)+' h':mins+' min')+')':'')+'.':'Once the beds are watered, your first harvest starts growing. Each vegetable lands here and you sell it from this window.')+'</span></div>'}
  if(!o.sellSeen){o.sellSeen=1;persist();setTimeout(function(){pop("Your first produce is ready. Tap Sell in the Garden window.")},400)}
  return '<div class="sty-sell"><span>'+n+' produce ready'+(o.sold?' &middot; '+o.sold+' sold so far':'')+'</span><button class="btn'+(n?'':' ghost')+'" data-act="stysell"'+(n?'':' disabled')+'>Sell for '+(n*4)+' coins</button></div>'}
/* test hook, removed at release with window.__qb */
window.__qbStory={check:styCheck,state:styState,steps:STORY,beats:BEATS,lots:function(){return lotsOpen()},allows:styAllows};
