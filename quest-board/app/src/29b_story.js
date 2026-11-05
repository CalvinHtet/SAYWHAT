/* ---------- the story that opens rooms (Cal, 2026-11-05; docs/PROGRESSION.md) ----------
   Kode Plaza and Calibur Mall open one step at a time. A step opens when its gate is met: some with a short scene, in the
   style of Dave the Diver, where someone walks in and offers the next step; some quietly. "lot" puts a lot on the street to
   buy with your own coins, "upgrade" lets a room's own "Open the ..." upgrade be bought, "free" opens the room at once.
   A room a save already owns counts as done, so nobody loses anything. The Loft keeps opening as before. */
/* Each step has a "why": the reason it happens now, shown when it opens and on its locked card until then. Investors look at
   what the businesses have actually earned (styState().biz: coins collected from rooms), not at upgrade counts. */
var STORY=[
  {id:"garden",room:"garden",how:"lot",why:"A plot of land in Kode Plaza is up for sale. Grow something you can sell.",gate:function(){return effLvl()>=3}},
  {id:"chef",room:"restaurant",how:"lot",why:"Sell enough produce from the Garden and someone will notice.",gate:function(){return styHas("garden")&&styState().sold>=60},
    scene:{who:"Mara",role:"Chef",lines:["Wait, you grew these? I've been buying your vegetables all week.","Everything I cook with them sells out. Imagine what we could do with a real kitchen.","Put up the money for a little restaurant and I'll run the stove. Partners?"],yes:"Partners. Let's open it",team:"mara"}},
  {id:"boba",room:"boba",how:"lot",why:"Once the restaurant is busy, customers start asking for drinks.",gate:function(){return styHas("restaurant")&&(S.base.served||0)>=80},
    scene:{who:"Mara",role:"Chef",lines:["Half our customers ask for something cold to drink on the way out.","The corner next door is empty. A boba shop would print money."],yes:"Let's do it"}},
  {id:"dessert",room:"dessert",how:"upgrade",why:"When the boba line runs out the door, the space upstairs can become a dessert parlour.",gate:function(){return styUps("boba")>=4}},
  {id:"lockkey",room:"skybar",how:"free",why:"An investor is watching how much the plaza earns.",gate:function(){return styHas("dessert")&&styState().biz>=15000},
    scene:{who:"Desmond Hale",role:"Investor",lines:["I've eaten here four nights running. I had to meet the owner.",function(){return "This plaza has brought in "+Math.floor(styState().biz).toLocaleString()+" coins and it keeps growing. And your second floor is storage?"},"Let me fund it: an upscale speakeasy upstairs. Live band, singers, the works. Lock and Key."],yes:"Open Lock and Key",team:"desmond"}},
  {id:"rooftop",room:"rooftop",how:"upgrade",why:"Lock and Key's regulars keep asking about the roof.",gate:function(){return styUps("skybar")>=6}},
  {id:"mall",room:"mall",how:"lot",why:"Another investor is watching the plaza's earnings.",gate:function(){return styHas("rooftop")&&styState().biz>=60000},
    scene:{who:"Priya Okafor",role:"Investor",lines:["I've been studying your business model. Restaurant, drinks, dessert, a speakeasy. It works.",function(){return Math.floor(styState().biz).toLocaleString()+" coins from one plaza. Imagine it on a bigger lot."},"There's a small strip mall up the street, completely empty. Buy in with me and fill it one store at a time."],yes:"Buy the strip mall",team:"priya"}},
  {id:"theater",room:"theater",how:"lot",why:"Once the mall has a few stores, shoppers want a reason to stay: the lot next door could be a movie theater.",gate:function(){return styUps("mall")>=4}},
  {id:"auditorium",room:"auditorium",how:"free",why:"A theater needs its basics in the lobby, and someone to run it.",gate:function(){return styHas("theater")&&styUps("theater")>=2},
    scene:{who:"Theo",role:"Theater crew",lines:["Saw the ticket stand go up. You're going to need someone behind it.","I'll sell the tickets, run the popcorn and keep the projector alive. Hire me and we can open the screen room tonight."],yes:"Hire Theo, open the Auditorium",team:"theo"}},
  {id:"arcade",room:"arcade",how:"upgrade",why:"Movie crowds want something to do before the show: the mall can open an arcade.",gate:function(){return styUps("auditorium")>=3}},
  {id:"rhythm",room:"rhythm",how:"upgrade",why:"When the arcade is packed, its back room can become a rhythm floor.",gate:function(){return styUps("arcade")>=4}},
  {id:"vr",room:"vr",how:"upgrade",why:"When the arcade is packed, its other back room can become a VR arena.",gate:function(){return styUps("arcade")>=4}},
  {id:"bowling",room:"bowling",how:"upgrade",why:"The arcade crowd wants league nights: the mall can open a bowling alley.",gate:function(){return styUps("arcade")>=6}},
  {id:"karaoke",room:"karaoke",how:"upgrade",why:"After a few rounds of bowling everyone wants to sing: the mall can open karaoke.",gate:function(){return styUps("bowling")>=6}},
  {id:"club",room:"club",how:"lot",why:"Once everyone stays out late, the last empty unit becomes a nightclub.",gate:function(){return styUps("karaoke")>=6}},
  /* the Speakeasy is now part of Lock and Key, the second floor (Cal): its old door never opens */
  {id:"speakeasy",room:"speakeasy",how:"never",why:"Part of Lock and Key now.",gate:function(){return false}}
];
function styState(){if(!S.story||typeof S.story!=="object")S.story={};var o=S.story;o.done=o.done||{};o.offer=o.offer||{};o.team=o.team||{};o.sold=o.sold||0;o.later=o.later||{};o.biz=o.biz||0;return o}
function styHas(t){return S.base&&S.base.slots.some(function(r){return r&&r.t===t})}
function styUps(t){var r=S.base&&S.base.slots.filter(function(x){return x&&x.t===t})[0];return r?addonsOf(r).length:0}
function styStep(room){return STORY.filter(function(s){return s.room===room})[0]}
/* may this room be opened now (as a lot or by its upgrade)? Rooms outside the story always may. */
function styAllows(room){var s=styStep(room);if(!s)return true;var o=styState();return !!(o.done[s.id]||o.offer[s.id]||styHas(room))}
/* the street's lots: the story's lots that are open and not yet built, plus anything outside the story */
var styLotsBase=lotsOpen;
lotsOpen=function(){var o=styState(),out=styLotsBase().filter(function(k){return !styStep(k)});
  STORY.forEach(function(s){if(s.how==="lot"&&o.offer[s.id]&&!styHas(s.room)&&out.indexOf(s.room)<0)out.push(s.room)});return out};
nextRoom=function(){return lotsOpen()[0]||null};
buildableList=function(){return lotsOpen()};

function styOpen(s){var o=styState();o.offer[s.id]=1;
  if(s.how==="free"&&!styHas(s.room)){S.base.slots.push({t:s.room,a:{},st:0,pend:0});o.done[s.id]=1;try{if(typeof LFV!=="undefined")LFV.init=0}catch(e){}render();persist();try{roomSplash(s.room)}catch(e){};return}
  persist();render();
  pop((s.why&&!s.scene?s.why+" ":"")+(s.how==="lot"?"A new lot is open on the street: "+ROOMT[s.room].name+".":ROOMT[s.room].name+" can now be opened from its room's upgrades."))}
/* the reason a room is still closed, for its locked card */
function styWhy(room){var s=styStep(room);return s&&s.why||"Keep growing your business."}
function styPortrait(s){var n="ui_story_"+s.id+".webp",u=window.QBART&&QBART[n];
  return u?'<img class="sty-pic" src="'+u+'" alt="">':'<div class="sty-pic sty-pic0" aria-hidden="true">'+esc(s.scene.who.split(" ").map(function(w){return w[0]}).join("").slice(0,2))+'</div>'}
function styScene(s){var c=s.scene,o=styState();
  var h='<div class="card box2 sty"><div class="sty-who">'+styPortrait(s)+'<div><b>'+esc(c.who)+'</b><small>'+esc(c.role)+'</small></div></div>'
    +c.lines.map(function(l,i){return '<p class="sty-line" style="animation-delay:'+(i*.9).toFixed(1)+'s">'+esc(typeof l==="function"?l():l)+'</p>'}).join("")
    +'<div class="sty-act"><button class="btn" data-act="styyes" data-v="'+s.id+'">'+esc(c.yes)+'</button><button class="btn ghost" data-act="styno" data-v="'+s.id+'">Not yet</button></div></div>';
  o.seen=o.seen||{};o.seen[s.id]=1;modal(h)}
/* look for the next step now and then, never over another window, one scene at a time */
function styCheck(){if(!loaded||!S.base||!S.created)return;var o=styState(),now=Date.now();
  STORY.forEach(function(s){if(!o.done[s.id]&&styHas(s.room))o.done[s.id]=1});
  if(document.querySelector("#layer .modal,.modal.qbsv,.dropsplash"))return;
  for(var i=0;i<STORY.length;i++){var s=STORY[i];if(o.done[s.id]||o.offer[s.id]||s.how==="never")continue;
    var ok=false;try{ok=s.gate()}catch(e){}if(!ok)continue;
    if(s.scene){if((o.later[s.id]||0)>now)continue;styScene(s);return}
    styOpen(s);return}}
setInterval(styCheck,15000);setTimeout(styCheck,4000);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=styyes],[data-act=styno],[data-act=stysell]");if(!b)return;
  var a=b.dataset.act,o=styState();
  if(a==="stysell"){var n=Math.floor((S.base.food&&S.base.food.veg)||0);if(!n){pop("Nothing to sell yet");return}var c=n*4;S.base.food.veg-=n;o.sold+=n;S.coins+=c;S.earnedC+=c;persist();render();pop("Sold "+n+" produce: +"+c+" coins");var om=document.querySelector(".rmodal .rm-scroll");if(om)roomModal(+om.dataset.i);return}
  var s=STORY.filter(function(x){return x.id===b.dataset.v})[0];if(!s)return;var m=b.closest(".modal");if(m)m.remove();
  if(a==="styno"){o.later[s.id]=Date.now()+30*60000;persist();return}
  if(s.scene&&s.scene.team){o.team[s.scene.team]=1;try{teamJoin(s.scene.team)}catch(e){}}styOpen(s)});
/* the Garden window sells what it grew; that is how the restaurant's partner finds you */
function stySellHtml(){var n=Math.floor((S.base.food&&S.base.food.veg)||0),o=styState();
  return '<div class="sty-sell"><span>'+n+' produce ready'+(o.sold?' &middot; '+o.sold+' sold so far':'')+'</span><button class="btn'+(n?'':' ghost')+'" data-act="stysell"'+(n?'':' disabled')+'>Sell for '+(n*4)+' coins</button></div>'}
/* test hook, removed at release with window.__qb */
window.__qbStory={check:styCheck,state:styState,steps:STORY,lots:function(){return lotsOpen()},allows:styAllows};
