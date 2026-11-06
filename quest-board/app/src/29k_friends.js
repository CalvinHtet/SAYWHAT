/* ---------- friends who drop by (Cal, 2026-11-06) ----------
   "There are a few friends I want to inject into the game ... use their Instagram to look up what they look like and add them as
   visitors who drop by to offer buffs, gifts, or just hang out in our loft or other buildings for a day. They should always have
   some reason to visit and not just be meaningless visits."
   Looks: built from the character creator and real Shop garments (the same rig as the player), styled after each friend's public
   profile: hair, skin tone and the way they dress. Nothing else from their profiles is stored.
   Visits: at most one a day, rolled once a day (about four days in seven). Each visit has a reason that fits the friend and does
   something real for that day: an XP buff on the matching quests, a coin gift, a streak freeze, or watering the Garden.
   This replaces maybeVisit's 25-minute lounge-only visits, whose XP "boosts" were never applied (S.boost was written, never read). */
function fvLook(spec){var D=window.QBLoft&&QBLoft.data,c=Object.assign({},(D&&D.creator&&D.creator.defaults)||{},spec);delete c.eq;
  if(spec.eq&&D&&D.items){var eq={};spec.eq.forEach(function(g){var M=D.items[g];if(M)eq[M.slot]={art:g,frontOnly:M.frontOnly,over:M.over,wide:M.wide,lift:M.lift,clip:M.clip}});c.equipped=eq}
  return {rig:c,sex:spec.body,npc:1}}
FRIENDS={
 justin:{name:"Justin",tag:"Singer and dancer, best friend",spec:{body:"m",skin:"s2",hairStyle:"h3",hairColor:"black",top:"tee",topColor:"white",eq:["h_chain","h_trous","h_derby"]}},
 vega:{name:"Vega",tag:"Rapper and manager, best friend",spec:{body:"m",skin:"s3",hairStyle:"h1",hairColor:"black",eq:["o_tee","o_lock","h_cargo","o_hoop"]}},
 logan:{name:"Logan",tag:"Actor and streamer, from the 3rd floor",spec:{body:"m",skin:"s1",hairStyle:"h3",hairColor:"brown",top:"bomber",topColor:"black",bottom:"joggers",bottomColor:"black",eq:["h_sneak"]}},
 kenan:{name:"Kenan",tag:"The other half of Kode PinK",spec:{body:"m",skin:"s2",hairStyle:"h2",hairColor:"black",top:"tee",topColor:"white",eq:["v_biker","h_shades","h_tech","h_boots"]}},
 jina:{name:"Jina",tag:"Food and travel",spec:{body:"f",skin:"s1",hairStyle:"h1",hairColor:"black",eq:["h_knit","h_pleat","h_loafer"]}},
 cynthia:{name:"Cynthia",tag:"Married to Memo",spec:{body:"f",skin:"s3",hairStyle:"h1",hairColor:"black",eq:["v_rose","h_denim","y_plat"]}},
 memo:{name:"Memo",tag:"Married to Cynthia",spec:{body:"m",skin:"s3",hairStyle:"h2",hairColor:"black",eq:["o_flannel","h_denim","h_sneak"]}}
};
Object.keys(FRIENDS).forEach(function(k){var f=FRIENDS[k],L=null;
  Object.defineProperty(f,"look",{enumerable:true,get:function(){if(L)return L;var x=fvLook(f.spec);if(window.QBLoft&&QBLoft.data&&QBLoft.data.items)L=x;return x}})});
/* place: the room they hang out in when you have it (the Lounge otherwise). buff: today only, on matching quests. */
var FVISITS=[
 {id:"justin_dance",who:["justin"],w:10,place:"gym",text:"Justin came by before rehearsal to run the new choreo with you.",buff:{stat:"fitness",pct:15,text:"Rehearsal with Justin: Fitness quests +15% XP today"}},
 {id:"justin_hook",who:["justin"],w:9,place:"studio",text:"Justin had a hook idea and wanted a second opinion. You spent the afternoon on it.",buff:{cl:"create",pct:20,text:"Writing with Justin: Creative quests +20% XP today"}},
 {id:"vega_manager",who:["vega"],w:9,place:"lounge",text:"Vega came over to go through your week with you.",buff:{cl:"admin",pct:20,text:"Vega's plan: Admin and day-job quests +20% XP today"}},
 {id:"vega_merch",who:["vega"],w:6,place:"lounge",text:"Vega dropped off a box of extra merch for you to sell.",coin:250},
 {id:"logan_spot",who:["logan"],w:10,place:"gym",text:"Logan came up from the 3rd floor to train. You took turns spotting.",buff:{cl:"body",pct:20,text:"Spotting Logan: Body quests +20% XP today"}},
 {id:"logan_stream",who:["logan"],w:7,place:"gameroom",text:"Logan streamed from your couch for a few hours. Some of the viewers sent tips.",coin:150},
 {id:"kenan_checkup",who:["kenan"],w:7,place:"lounge",text:"Kenan stopped in after a shift at the clinic to check on you.",freeze:1},
 {id:"kodepink",who:["kenan"],w:9,place:"studio",text:"Kenan brought the decks over for a Kode PinK session.",buff:{cl:"create",pct:25,text:"Kode PinK session: Creative quests +25% XP today"}},
 {id:"jina_food",who:["jina"],w:8,place:"lounge",text:"Jina just got back from a trip and took you around to the food spots nearby.",buff:{cl:"out",pct:15,text:"Food crawl with Jina: Outside quests +15% XP today"}},
 {id:"habibimbaps",who:["kenan","jina"],w:6,place:"restaurant",text:"Kenan and Jina cooked dinner at your place and left the leftovers.",buff:{cl:"home",pct:15,text:"Cooking night: Home quests +15% XP today"},coin:100},
 {id:"cynthia_garden",who:["cynthia"],w:8,place:"garden",need:"garden",text:"Cynthia came by with seedlings and watered the beds.",water:1,buff:{cl:"home",pct:10,text:"Cynthia's visit: Home quests +10% XP today"}},
 {id:"cynthia_sun",who:["cynthia"],w:5,place:"lounge",text:"Cynthia stopped by to check in and stayed for coffee.",buff:{cl:"social",pct:15,text:"Cynthia's sunshine: People quests +15% XP today"}},
 {id:"memo_fix",who:["memo"],w:6,place:"lounge",text:"Memo fixed the loose shelf and stayed for a game.",buff:{cl:"home",pct:15,text:"Memo's fix-it day: Home quests +15% XP today"}},
 {id:"memo_cynthia",who:["memo","cynthia"],w:7,place:"lounge",text:"Memo and Cynthia came over for dinner and brought dessert.",coin:150,buff:{cl:"social",pct:15,text:"Dinner with Memo and Cynthia: People quests +15% XP today"}},
 {id:"chopstick",who:["dog:chopstick"],w:5,place:"lounge",text:"Chopstick ran off with a sock. It turned up under the couch, next to some coins.",coin:80},
 {id:"pluto",who:["dog:pluto"],w:5,place:"lounge",text:"Pluto fell asleep on your lap in his sweater, so you stayed put and worked.",buff:{stat:"discipline",pct:15,text:"Pluto nap: Discipline quests +15% XP today"}}
];
VISITS=FVISITS;
function fvToday(){var v=S.visit;return v&&v.d===today()&&v.id?FVISITS.filter(function(x){return x.id===v.id})[0]||null:null}
function fvNames(who){return who.map(function(w){return w.indexOf("dog:")===0?(w==="dog:pluto"?"Pluto":"Chopstick"):FRIENDS[w].name}).join(" and ")}
/* a friend's picture: the rig, like the player; dogs keep their art */
var fvImgBase=visitorImg;
visitorImg=function(w,big){if(w.indexOf("dog:")===0||!FRIENDS[w])return fvImgBase(w,big);var A=big?fvPoses(w):[];if(A.length)return '<span class="fvposes">'+A.map(function(u,k){return '<img class="vart fvart'+(k?'':' on')+'" src="'+u+'" alt="'+(k?'':esc(FRIENDS[w].name))+'">'}).join("")+'</span>';return calImg(FRIENDS[w].look,"idle",big?150:60,"fvfig")};
/* the day's roll, once a day, the same moment the app first settles */
function fvPick(force){var have=function(t){return typeof hasRoom==="function"&&hasRoom(t)},last=S.visit&&S.visit.id;
  var pool=FVISITS.filter(function(v){return (!v.need||have(v.need))&&v.id!==last});if(force)pool=FVISITS.filter(function(v){return v.id===force});if(!pool.length)return null;
  var tot=pool.reduce(function(a,v){return a+v.w},0),r=Math.random()*tot;for(var i=0;i<pool.length;i++){r-=pool[i].w;if(r<=0)return pool[i]}return pool[0]}
function fvApply(v){var t=today();S.visit={d:t,t:Date.now(),who:v.who.slice(),id:v.id,place:v.place};S.base.visits=(S.base.visits||0)+1;
  if(v.coin){S.coins+=v.coin;S.earnedC+=v.coin}
  /* QA: freezes stop at maxFreeze(); at the cap the gift is 300 coins, as on the wheel */
  v._cap=0;if(v.freeze){if((S.freezes||0)+v.freeze<=maxFreeze())S.freezes=(S.freezes||0)+v.freeze;else{v._cap=1;S.coins+=300;S.earnedC+=300}}
  if(v.water&&typeof gdWater==="function"&&typeof hasRoom==="function"&&hasRoom("garden")){try{S.base.gwater=Date.now()+ECON.waterH*36e5}catch(e){}}
  persist()}
/* Cal, 2026-11-06: "I meant I wanted my friends to have better animations rather than just the rig. Not a random environment
   banner." Each friend gets a detailed illustrated portrait, friend_<id>.webp (ROOMS paints it, transparent background), shown
   on the visit card with an idle animation (breathing, a slight sway, a pop as they arrive). Until the portrait exists the rig
   figure shows, so missing art fails softly. */
/* Cal: "Yeah 2-3 poses per friend": friend_<id>.webp, friend_<id>_2.webp, friend_<id>_3.webp take turns on the card */
function fvPoses(w){var o=[fvArt(w)];[2,3].forEach(function(k){var u=fvArt(w+"_"+k);if(u)o.push(u)});return o[0]?o:[]}
setInterval(function(){var q=document.querySelectorAll(".fvposes");for(var i=0;i<q.length;i++){var e=q[i],im=e.querySelectorAll("img");if(im.length<2)continue;var k=(+e.dataset.k||0)+1;e.dataset.k=k;for(var j=0;j<im.length;j++){var on=j===k%im.length;im[j].classList.toggle("on",on);if(on){im[j].classList.remove("hop");void im[j].offsetWidth;im[j].classList.add("hop")}}}},1700);
/* QA: a 0.45 s cross-fade between different poses read as a double image; now a 0.1 s cut with a small hop */
function fvArt(w){var n="friend_"+w+".webp",D=window.QBLoft&&QBLoft.data;return (window.QBART&&QBART[n])||(D&&D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:null)}
function fvShow(v){var names=fvNames(v.who),hr=function(t){return typeof hasRoom==="function"&&hasRoom(t)&&ROOMT[t]},here="the "+(hr(v.place)?ROOMT[v.place].name:hr("lounge")?ROOMT.lounge.name:"Bedroom");
  var m=modal('<div class="card box2 adv visit"><span class="label">Someone stopped by</span><h2 style="font-size:32px">'+esc(names)+'</h2><div class="vfig">'+v.who.map(function(w,k){return '<span class="fvpose" style="animation-delay:'+(k*.35)+'s">'+visitorImg(w,true)+'</span>'}).join("")+'</div><p>'+esc(v.text)+'</p>'
    +(v.coin?'<div class="reward">+'+v.coin+' coins</div>':'')+(v.freeze?(v._cap?'<div class="reward">+300 coins (your streak freezes are full)</div>':'<div class="reward">+'+v.freeze+' streak freeze</div>'):'')+(v.water&&typeof hasRoom==="function"&&hasRoom("garden")?'<div class="reward">Garden watered</div>':'')+(v.buff?'<div class="reward">'+esc(v.buff.text)+'</div>':'')
    +'<p class="note">'+'They\'re hanging out in '+esc(here)+' today.</p><button class="btn big" id="vok">Nice</button></div>');
  var b=m&&m.querySelector("#vok");if(b)b.onclick=function(){m.remove();render()}}
function fvCheck(){if(!loaded||!S||!S.created)return;if(S.visit&&S.visit.card)fvCard();if(document.querySelector("#layer .modal"))return;
  var t=today();if(S.fvDay===t)return;S.fvDay=t;
  if(S.visit&&S.visit.d===t){persist();return}
  if(Math.random()>.57){persist();return}
  var v=fvPick();if(!v){persist();return}fvApply(v);S.visit.card=1;persist();setTimeout(fvCard,1200)}
/* QA: the card waits until no other window is open, so a reward never lands unseen */
function fvCard(){var v=fvToday();if(!v||!S.visit.card)return;if(document.querySelector("#layer .modal")){setTimeout(fvCard,4000);return}S.visit.card=0;persist();fvShow(v)}
maybeVisit=function(){};
setInterval(fvCheck,20000);setTimeout(fvCheck,7000);
/* today's buff joins the others (Board buff list and the XP math, activeBuffs -> socialBuffs) */
var fvBuffBase=socialBuffs;
socialBuffs=function(){var o=fvBuffBase(),v=fvToday();if(v&&v.buff)o=o.concat([{who:fvNames(v.who),b:v.buff}]);return o};
visitorsToday=function(){return (S.visit&&S.visit.d===today())?S.visit.who:[]};
/* test hook, removed at release with window.__qb */
window.__qbFriends={art:fvArt,visits:FVISITS,friends:FRIENDS,force:function(id){var v=fvPick(id);if(!v)return null;fvApply(v);fvShow(v);return v},today:fvToday,look:fvLook};
