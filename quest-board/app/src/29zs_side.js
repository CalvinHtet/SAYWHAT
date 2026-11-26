/* ---------- story side-quests (W36: SPEC4 part 5, SPEC5 part 2, SPEC6 parts 2 and 3) ----------
   Cal, 2026-11-10: "side quests are cool", then "photo only like rafe". Someone you have already met asks for one (a scene in their
   voice, at most one offer a day, never over another window); it sits on the Board until it is done, runs once, and passes only with
   a fresh camera photo the checker accepts. There is no honor button. Rewards are kept for good and never repeat.
   - Mara "Cook for me once": a home-cooked meal -> her signature dish on the Restaurant's menu (the Restaurant earns ECON.sdqDish more).
   - Nova "Clear out your closet": a bag of clothes for donation -> a piece made for you (SDQWEAR: it arrives once the Mac paints it).
   - Theo "Movie night": you and a friend each send a movie-night photo on the same game day, naming each other (worlds/<id>.sqm,
     no rules change) -> the next game day is a premiere day: the Movie Theater earns double, over the day's business limit too.
   - Pluto and Chopstick "Walkies": dog-walk photos on 5 different days -> an outfit for the dogs (SDQWEAR, arrives with its art).
   - Sable "Night watch" (Cal: "night watch is good by snapping a picture of you in bed", then, 2026-11-10 11:15, "dont have it
     match the servers time then. just print the phone's time on there and have the ai judge it based off of that ... time stamping
     the phone time is perfect"): an in-bed photo with the phone's time stamped on it (web.js qbStamp) between 8 pm and midnight, the
     phone's own clock and time zone. The checker is asked to confirm the stamp and that it reads before midnight; the game checks the
     same time. No server clock and no functions change. 3 nights in a row -> Sable shows you a hidden dungeon on the Dungeon Crawls
     list (SDQDNG). The stamped time shows on the photo in the verdict and in Sable's scene.
   Art (Mac, all optional): ui_story_<pic>.webp portraits as for return visits, and the two SDQWEAR pieces. */
ECON.sdqDish=.10;   /* Mara's signature dish: the Restaurant's day */
var SDQNIGHT=[20,24];   /* Night watch counts from 8 pm to midnight, the phone's time */
var SDQWEAR={nova:"gx_sq_closet",dogs:"gx_sq_dogcoat"};   /* SHOP ids the Mac adds with their art; owed until then */
function sdqDogs(){var n={};(S.base?S.base.slots:[]).forEach(function(r){if(r&&r.a){if(r.a.bd_pluto)n.pluto=1;if(r.a.bd_chop)n.chop=1}});return n}
function sdqDogName(){var d=sdqDogs();return d.pluto&&d.chop?"Pluto and Chopstick":d.pluto?"Pluto":"Chopstick"}
var SIDEQ=[
  {id:"mara",pic:"mara",who:"Mara",role:"Chef",at:"the restaurant",name:"Cook for me once",gate:function(){return teamHas("mara")&&styHas("restaurant")},
    ask:["I cook for a full room every night.","Nobody cooks for me.","Make something at home, from scratch. Send me a picture of it."],yes:"I'll cook",
    snap:"A meal you cooked at home, on the plate or still in the pan.",
    check:"a home-cooked meal: real food cooked at home, on a plate, in a bowl or in a pan. Takeout containers, a restaurant table, packaged snacks or raw groceries do not count",
    done:["Real color on that pan. You didn't rush it.","It's going on the menu. Table six gets it first."],reward:"Your dish is on the Restaurant's menu. The Restaurant earns 10% more."},
  {id:"nova",pic:"nova",who:"Nova Lin",role:"Fashion vlogger",at:"the strip mall",name:"Clear out your closet",gate:function(){return teamHas("nova")},
    ask:["I'm filming a closet clear-out and mine's already empty.","Bag up what you never wear. Send me the bag before it goes to donation."],yes:"I'll bag it",
    snap:"The bag or box of clothes you're giving away.",
    check:"a bag or box packed with clothes to give away or donate",
    done:["That's a full bag. Someone's going to love that jacket.","I'm having something made for you. It won't be in any store."],reward:"A piece made for you by Nova's tailor. It lands in your Closet when it's finished."},
  {id:"theo",pic:"theo",who:"Theo",role:"Theater crew",at:"the movie theater",name:"Movie night",gate:function(){return teamHas("theo")&&styHas("theater")},
    ask:["After close I get the projector to myself.","It's not the same alone.","Watch a movie at home with a friend. Both of you send me a picture, same night."],yes:"Pick a night",
    snap:"The movie on the screen, from where you're sitting. Your friend sends one too, the same night.",
    check:"a movie night at home: a TV, projector or laptop screen playing a film, seen from a couch, bed or chair",screenOk:1,
    done:["Two pictures, same night. I'm calling it a premiere.","Tomorrow the theater runs every screen."],reward:"Tomorrow is premiere day: the Movie Theater earns double all day."},
  {id:"dogs",pic:"dogs",who:"",role:"Your dogs",at:"the front door",name:"Walkies",need:5,gate:function(){var d=sdqDogs();return !!(d.pluto||d.chop)},
    ask:[function(){var d=sdqDogs();return d.pluto?"Pluto has his leash in his mouth.":"Chopstick is already at the door."},function(){var d=sdqDogs();return d.pluto&&d.chop?"Chopstick is already at the door.":"He's been waiting there a while."},"Five walks on five different days. A picture on each one."],yes:"Get the leash",
    snap:"Your dog on the walk, outside.",
    check:"a dog being walked outside: a dog on a leash, or a dog out on a walk on a street, path, park or beach",
    done:[function(){return sdqDogName()+(sdqDogName().indexOf(" and ")>0?" know":" knows")+" every tree on the block now."},"There's a box on the porch with their names on it."],reward:"An outfit for the dogs. They wear it once it's finished."},
  {id:"sable",pic:"sable",who:"Sable",role:"Scout",at:"the Hero's Lair",name:"Night watch",need:3,gate:function(){return teamHas("sable")},
    ask:["Your lights were on at two last night.","Bed before midnight. Three nights in a row.","Send me a picture from bed each night. The time goes on it."],yes:"Start the watch",
    snap:"A picture of you in bed, taken between 8 pm and midnight.",
    check:"a person lying in a bed at night: a selfie or photo taken from bed, with low or night-time light. An empty bed, a couch or daylight do not count",self:1,
    done:["Three nights. Good.","Last watch I found a door under the Lair. It's not on any map.","I marked it. It's on your crawl list."],reward:"A hidden dungeon is on your Dungeon Crawls list."}];
function sdqOf(id){return SIDEQ.filter(function(q){return q.id===id})[0]}
function sdqWho(q){return q.id==="dogs"?sdqDogName():q.who}
function sdqLine(l){return typeof l==="function"?l():l}
/* the save: on {id: game day accepted}, done {id: game day finished}, later {id: when to ask again}, walk [game days], nw {d: the
   last night counted (the phone's date), n: nights in a row, t: its stamp}, mv {d, w: friend id, nm} (this player's movie night),
   prem (the premiere game day), offerDay (the last offer) */
function sdqState(){if(!S.side||typeof S.side!=="object")S.side={};var o=S.side;["on","done","later"].forEach(function(k){if(!o[k]||typeof o[k]!=="object")o[k]={}});
  if(!Array.isArray(o.walk))o.walk=[];if(!o.nw||typeof o.nw!=="object")o.nw={};return o}
function sdqOn(id){var o=sdqState();return !!o.on[id]&&!o.done[id]}
/* the phone's time when the photo is stamped: {d: its date, h, m, txt: the stamp's text, "NOV 11  11:42 PM"} */
function sdqWhen(ms){var t=new Date(ms),h=t.getHours(),m=t.getMinutes(),txt=typeof window.qbStampText==="function"?window.qbStampText(ms):"";
  if(!txt)txt=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][t.getMonth()]+" "+t.getDate()+"  "+((h%12)||12)+":"+String(m).padStart(2,"0")+" "+(h<12?"AM":"PM");
  return {d:dstr(t),h:h,m:m,txt:txt}}
function sdqTime(p){return p?p.txt.split("  ")[1]:""}
/* ---- offers: after the return visits, one a day, 25 minutes after the last scene (styBeat in 29b_story.js) ---- */
function sdqPic(q){if(q.id==="dogs"&&typeof fvDogArt==="function"){var u=fvDogArt(sdqDogs().pluto?"pluto":"chopstick",0);if(u)return '<img class="sty-pic sdq-dogpic" src="'+u+'" alt="">'}
  return styBeatPic({pic:q.pic,who:sdqWho(q)})}
function sdqCard(q,lines,acts){return styCard({at:q.at,who:sdqWho(q),role:q.role,lines:lines.map(sdqLine)},sdqPic(q),acts)}
function sdqOffer(force){var o=sdqState(),now=Date.now();if(!force&&(o.offerDay===today()||now-((styState().lastScene)||0)<25*60000))return false;
  for(var i=0;i<SIDEQ.length;i++){var q=SIDEQ[i],ok=false;if(o.on[q.id]||o.done[q.id]||(o.later[q.id]||0)>now)continue;try{ok=q.gate()}catch(e){}if(!ok)continue;
    o.offerDay=today();styState().lastScene=now;persist();
    modal(sdqCard(q,q.ask,'<button class="btn" data-act="sdqyes" data-v="'+q.id+'">'+esc(q.yes)+'</button><button class="btn ghost" data-act="sdqno" data-v="'+q.id+'">Not now</button>'));return true}
  return false}
var sdqBeatBase=styBeat;styBeat=function(){return sdqBeatBase.apply(this,arguments)||sdqOffer()};
/* ---- the Board card: the side-quests taken, with their progress (shown while one is open or on premiere day) ---- */
function sdqProg(q){var o=sdqState();
  if(q.id==="dogs")return o.walk.length+" of 5 walks"+(o.walk.indexOf(today())>=0?" &middot; today's is in":"");
  if(q.id==="sable"){var n=sdqNights();return n+" of 3 nights"+(n&&o.nw.d===sdqWhen(Date.now()).d?" &middot; tonight's is in":"")}
  if(q.id==="theo"){var mv=o.mv&&o.mv.d===today()?o.mv:null;return mv?"Your picture is in. Waiting on "+esc(mv.nm||"your friend")+" tonight.":"Pick a friend and a night."}
  return ""}
/* nights in a row still alive: the last one counted was tonight or last night (the phone's dates). After midnight the night just
   gone is over, so a streak whose last night was the one before it is gone. */
function sdqNights(){var o=sdqState(),p=sdqWhen(Date.now());if(!o.nw.d)return 0;return ymdN(p.d)-ymdN(o.nw.d)<=1?(o.nw.n||0):0}
function sdqHtml(){if(!S.created)return "";var o=sdqState(),on=SIDEQ.filter(function(q){return sdqOn(q.id)}),pr=o.prem===today();
  var fin=SIDEQ.filter(function(q){return o.done[q.id]});if(!on.length&&!pr)return "";
  var h='<section class="card panel sdq"><h3 class="label">Side-quests</h3>'+(pr?'<p class="note sdq-prem"><b>Premiere day.</b> The Movie Theater earns double today.</p>':'');
  on.forEach(function(q){var busy=!!proofPend["sdq:"+q.id];h+='<div class="sdq-row"><div><b>'+esc(q.name)+'</b><small>'+esc(sdqWho(q))+' &middot; '+(busy?'checking photo&hellip;':sdqProg(q)||esc(q.snap))+'</small></div>'
    +(busy?'':'<button class="btn" data-act="sdqsnap" data-v="'+q.id+'">Send a photo</button>')+'</div>'});
  if(fin.length)h+='<details class="sdq-done"><summary>Finished ('+fin.length+')</summary>'+fin.map(function(q){return '<div class="sdq-row"><div><b>'+esc(q.name)+'</b><small>'+esc(q.reward)+'</small></div></div>'}).join("")+'</details>';
  return h+'</section>'}
var sdqBoardBase=boardHtml;boardHtml=function(){var h=sdqBoardBase.apply(this,arguments),c="";try{c=sdqHtml()}catch(e){}if(!c)return h;
  var i=h.indexOf('<section class="card panel bty">');if(i<0)i=h.indexOf('<details class="donebox donelast"');return i<0?h+c:h.slice(0,i)+c+h.slice(i)};
/* ---- the photo window ---- */
var SDQASK=null;
function sdqFriends(){return (SDQFAKE||((typeof SOC!=="undefined"&&SOC.worlds)||[])).filter(function(w){return w&&w.id&&w.name&&w.id!==MYUID})}
function sdqAsk(id){var q=sdqOf(id);if(!q||!sdqOn(id))return;SDQASK=id;
  try{if(window.claude)window.claude.use("sample").then(function(s){if(s&&s.warm)s.warm()}).catch(function(){})}catch(e){}
  var fr=q.id==="theo"?sdqFriends():null,mv=sdqState().mv;
  var pick=fr?(fr.length?'<label class="sdq-pick">Watching with <select id="sdqfr">'+fr.map(function(w){return '<option value="'+esc(w.id)+'"'+(mv&&mv.w===w.id?' selected':'')+'>'+esc(w.name)+'</option>'}).join("")+'</select></label>'
    :'<p class="note">Movie night needs a friend who plays. Once someone joins, they show up here.</p>'):'';
  modal('<div class="card box2 sdq-ask"><span class="label">Side-quest &middot; '+esc(sdqWho(q))+'</span><h2>'+esc(q.name)+'</h2><p class="note">'+esc(q.snap)+' Camera only, and each photo counts once.</p>'+pick
    +(fr&&!fr.length?'':'<div class="btns"><label class="btn" for="sdqf1">Open camera</label></div><input class="vh" type="file" id="sdqf1" accept="image/jpeg" capture="'+(q.self?'user':'environment')+'" aria-label="Take the side-quest photo">')
    +'<div class="proof" id="sdqmsg"></div><button class="btn ghost" data-act="mclose">Cancel</button></div>')}
function sdqMsg(k,t){var el=document.getElementById("sdqmsg");if(!el)return;var d=document.createElement("div");d.className=k;d.innerHTML='<span>'+(k==="bad"?"&#10007;":"&bull;")+'</span><span>'+esc(t)+'</span>';el.appendChild(d)}
function sdqExifMs(ex){var m=ex&&ex.dt&&ex.dt.match(/^(\d{4}):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/);return m?new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6]).getTime():0}
async function sdqFile(file){var id=SDQASK,q=sdqOf(id);if(!file||!q||!sdqOn(id)||proofPend["sdq:"+id])return;var box=document.getElementById("sdqmsg");if(box)box.innerHTML="";
  if(file.type&&!/jpe?g/i.test(file.type)){sdqMsg("bad","That is a screenshot or a saved image. Use the camera.");return}
  var fs=document.getElementById("sdqfr"),fw=fs?fs.value:"",fn=fs&&fs.selectedOptions&&fs.selectedOptions[0]?fs.selectedOptions[0].textContent:"";
  if(id==="theo"&&!fw)return;
  sdqMsg("info","Reading the image...");var hh=null,ex={},buf=null;
  try{buf=await file.slice(0,262144).arrayBuffer()}catch(e){}
  if(buf){hh=hashFile(buf);if(S.hashes.indexOf(hh)>=0||pendHash(hh)){sdqMsg("bad","This exact image was already used. Take a new one.");return}ex=readExif(buf)}
  /* the photo's own time against the phone's clock, as for quests */
  var xm=sdqExifMs(ex);if(xm&&!(window.QB_WEB&&QB_WEB.sandbox)){var mins=(Date.now()-xm)/60000;if(mins<-3||mins>30){sdqMsg("bad","The photo is "+Math.round(Math.abs(mins))+" minutes "+(mins<0?"in the future":"old")+". It has to be from the last 30.");return}}
  if(SDQASK!==id)return;SDQASK=null;
  proofPend["sdq:"+id]={t:Date.now(),h:hh};pendMark();document.querySelectorAll("#layer .modal").forEach(function(m){if(m.querySelector(".sdq-ask"))m.remove()});render();pop("Photo sent. Checking it in the background");
  sdqCheck(id,file,hh,{w:fw,nm:fn})}
var SDQWAIT=6000,SDQFAKE=null;   /* the sandbox stand-in's delay; test friends for Movie night */
/* Cal 11-26: no stamps, so Night watch goes by the phone's hour alone (QA 5cdb0ddd MED); kept for old callers */
function sdqNightAsk(){return ' This is a bedtime check: also return "night_ok": true only if the time stamp reads between 8:00 PM and 11:59 PM, false otherwise.'}
async function sdqCheck(id,file,hh,fr){var q=sdqOf(id),vis=null,at=Date.now(),p=sdqWhen(at),stp="";/* Cal 11-26: no time stamp on any photo, so the checker is not asked to read one (the phone's hour still decides the night) */
  try{var sample=window.claude?await window.claude.use("sample"):null;
    /* local sandbox only, as for quests: a stand-in passes any photo that is not nearly black, and reads the stamp as the game does */
    if(!sample&&window.QB_WEB&&QB_WEB.sandbox){await new Promise(function(r){setTimeout(r,SDQWAIT)});var lum=await sbLum(file);
      vis={matches:lum>35,what:"your test photo (sandbox stand-in check)",screen:false,note:lum>35?"":"Too dark to see anything (sandbox stand-in).",night_ok:p.h>=SDQNIGHT[0]&&p.h<SDQNIGHT[1]}}
    var lim=sample?await sample.limits().catch(function(){return null}):null;
    if(sample&&lim&&lim.images)vis=await sample.json('A player of a habit game sends a photo for a side-quest. It should show '+q.check+'. Look at the image. Return ONLY JSON: {"matches":true,"what":"","screen":false,"note":""'+(stp?',"stamp_ok":true':'')+'} where matches = the photo clearly shows that (be fair but skeptical), what = what you see in under 14 words, screen = true if it is a screenshot or a photo of a screen, note = short reason under 12 words.'+stampAsk(stp),{images:file,stamp:stp,modelTier:"quick",cache:false});
  }catch(e){vis=null}
  delete proofPend["sdq:"+id];pendMark();
  var url="";try{url=URL.createObjectURL(file);setTimeout(function(){URL.revokeObjectURL(url)},600000)}catch(e){}
  var why=!vis?"The photo checker couldn't be reached, so nothing was counted. Try again in a minute."
    :vis.stamp_ok===false?STAMPBAD:!vis.matches?"That doesn't look like it."+(vis.note?" "+vis.note:"")
    :(vis.screen&&!q.screenOk)?"That looks like a photo of a screen. Take a real photo.":"";
  /* Night watch: the time it was taken, by the phone's clock */
  if(!why&&id==="sable"){if(p.h<SDQNIGHT[0])why=p.h<5?"Taken at "+sdqTime(p)+". That's after midnight, so tonight doesn't count.":"Taken at "+sdqTime(p)+". Night watch counts from 8 pm to midnight.";
    else if(sdqState().nw.d===p.d)why="Tonight is already logged.";}
  if(!why&&id==="dogs"&&sdqState().walk.indexOf(today())>=0)why="Today's walk is already logged.";
  if(!sdqOn(id)){render();return}
  if(why){render();sdqVerdict(q,false,why,url,p);return}
  if(hh){S.hashes.push(hh);S.hashes=S.hashes.slice(-300)}
  /* the photo feed (29ph_photos.js): a passed side-quest or hunt photo can be posted from the town board, with its stamp */
  if(typeof phRemember==="function")try{phRemember({file:file,stamp:p.txt,kind:"quest",what:q.name})}catch(e){}
  var o=sdqState(),fin=false,note="";
  if(id==="sable"){var gap=o.nw.d?ymdN(p.d)-ymdN(o.nw.d):9;o.nw={d:p.d,n:gap===1?(o.nw.n||0)+1:1,t:p.txt};fin=o.nw.n>=3;note="Night "+Math.min(3,o.nw.n)+" of 3."+(fin?"":" Send another tomorrow night.")}
  else if(id==="dogs"){o.walk.push(today());fin=o.walk.length>=5;note="Walk "+o.walk.length+" of 5."}
  else if(id==="theo"){o.mv={d:today(),w:fr.w,nm:fr.nm};note="Your picture is in. Theo needs "+(fr.nm||"your friend")+"'s tonight too.";try{socPublish(true)}catch(e){}}
  else fin=true;
  persist();
  if(fin)sdqFinish(q,url,p);else{render();sdqVerdict(q,true,note,url,p,vis.what);if(id==="theo")setTimeout(sdqTheo,1500)}}
/* the photo, with the time stamped on it when it was sent */
function sdqShot(url,p){return url?'<div class="sdq-shot"><img src="'+url+'" alt="Your photo"><span class="sdq-stamp">'+esc(p?p.txt:"")+'</span></div>':''}
function sdqVerdict(q,ok,msg,url,p,what){
  modal('<div class="card box2"><span class="label">Photo check &middot; '+esc(q.name)+'</span><h2>'+(ok?'Verification succeeded':'Verification failed')+'</h2>'+sdqShot(url,p)
    +'<p class="note">'+(ok&&what?'Claude saw: '+esc(what)+'. ':'')+esc(msg)+'</p>'
    +(ok?'<div class="btns"><button class="btn" data-act="mclose">Nice</button></div>':'<p class="note">Nothing was counted. The side-quest is still open.</p><div class="btns"><button class="btn" data-act="sdqsnap" data-v="'+q.id+'">Try another photo</button></div>')+'</div>')}
/* done: the reward, kept at once, then the person's scene */
function sdqFinish(q,url,p){var o=sdqState();if(o.done[q.id])return;o.done[q.id]=today();
  if(q.id==="theo")o.prem=ymdOfN(ymdN(today())+1);
  if(q.id==="sable")sdqDngCheck();
  /* a side-quest with its own ending (Rafe's hunts, 29zt_rafe.js): give keeps the reward, fin plays the ending */
  if(q.give)q.give();
  sdqOwe();persist();render();
  if(q.fin){q.fin(url,p);return}
  var m=modal(sdqCard(q,q.done,'<button class="btn" data-act="mclose">Continue</button><small class="sty-xp">'+esc(q.reward)+'</small>'));
  if(m&&url){var c=m.querySelector(".sty-who");if(c)c.insertAdjacentHTML("afterend",sdqShot(url,p))}}
/* Theo's movie night: done when the friend named this player on the same game day */
function sdqTheo(){var o=sdqState();if(!sdqOn("theo")||!o.mv||o.mv.d!==today())return;
  var f=sdqFriends().filter(function(w){return w.id===o.mv.w})[0],x=f&&f.sqm;if(x&&x.d===today()&&x.w===(MYUID||"me"))sdqFinish(sdqOf("theo"),"",null)}
var sdqWorldBase=socWorldDoc;socWorldDoc=function(){var d=sdqWorldBase.apply(this,arguments);try{var mv=sdqState().mv;if(mv&&mv.d===today())d.sqm={d:mv.d,w:mv.w}}catch(e){}return d};
/* ---- the rewards ---- */
/* Mara's dish and the premiere day: what the Restaurant and the Movie Theater make in a day (bizDayOf in 29e_economy.js) */
function sdqBizX(r){var o=sdqState();if(!r)return 1;if(r.t==="restaurant"&&o.done.mara)return 1+ECON.sdqDish;if(r.t==="theater"&&o.prem&&o.prem===today())return 2;return 1}
var sdqBizBase=bizDayOf;bizDayOf=function(i){var v=sdqBizBase(i);try{v*=sdqBizX(bslot(i))}catch(e){}return v};
/* on premiere day the town's business limit (payRoom) grows by the theater's extra day, so the double is really paid */
var sdqPayBase=payRoom;payRoom=function(){var n=sdqPayBase();try{var o=sdqState();if(o.prem&&o.prem===today())S.base.slots.forEach(function(r,i){if(r&&r.t==="theater")n+=Math.floor(sdqBizBase(i)*openMult())})}catch(e){}return n};
/* Nova's piece and the dogs' outfit: given the first time their SHOP entry exists (the Mac adds it with the art) */
function sdqOwe(){var o=sdqState();Object.keys(SDQWEAR).forEach(function(k){var id=SDQWEAR[k];if(o.done[k]&&!S.owned[id]&&SHOP.some(function(it){return it[0]===id})){S.owned[id]=true;persist()}})}
/* Sable's door: one more dungeon, open to anyone who finished Night watch. It goes first in DNG at level 1, so the Crawls list's
   window of 5 (dngHtml in 10_app_a.js picks it by index) shows the same dungeons as before; when the window leaves it out, it is
   added on top. It pays like the deepest dungeon open to the player, a fifth more. */
var SDQDNG={id:"sq_night",name:"The Night Stair",lv:1,rec:1,mins:45,c:[60,150],loot:"Richer than your deepest crawl",ic:"\u{1F319}",tag:"Sable found the door. Nobody else has.",sdq:1};
function sdqDngBand(){var b=null,lv=effLvl();DNG.forEach(function(d){if(d!==SDQDNG&&(!b||d.lv<=lv))b=d.c});if(b)SDQDNG.c=[Math.round(b[0]*1.2),Math.round(b[1]*1.2)]}
function sdqDngCheck(){if(sdqState().done.sable){if(DNG.indexOf(SDQDNG)<0)DNG.unshift(SDQDNG);sdqDngBand()}}
var sdqDngBase=dngHtml;dngHtml=function(){try{sdqDngCheck()}catch(e){}var h=sdqDngBase.apply(this,arguments);if(DNG.indexOf(SDQDNG)<0||h.indexOf('data-id="'+SDQDNG.id+'"')>=0||h.indexOf(esc(SDQDNG.name)+'</b>')>=0)return h;
  var D=dngInit(),c='<div class="dng sdq-dng"><b>'+SDQDNG.ic+' '+esc(SDQDNG.name)+'</b><small class="note"> '+esc(SDQDNG.tag)+'</small>'
    +'<div class="dmeta mono"><span>Lv 1</span><span>'+crawlMins(SDQDNG)+' min</span><span>Loot: '+esc(SDQDNG.loot)+'</span><span>Safe</span></div>'
    +(D.runs.length>=dngSlots()?'<small class="note">You are already down a dungeon.</small>':D.cd.n>=dngPerDay()?'<small class="note">Done for today.</small>':'<button class="btn alt" data-act="dgo" data-id="'+SDQDNG.id+'">Crawl</button>')+'</div>';
  var j=h.search(/<div class="dng(?: lock)?"><b>/);return j<0?h:h.slice(0,j)+c+h.slice(j)};
var sdqStartBase=dngStart;dngStart=function(){try{sdqDngCheck()}catch(e){}return sdqStartBase.apply(this,arguments)};
var sdqClaimBase=dngClaim;dngClaim=function(){try{sdqDngCheck()}catch(e){}return sdqClaimBase.apply(this,arguments)};
/* ---- taps ---- */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=sdqyes],[data-act=sdqno],[data-act=sdqsnap]");if(!b)return;var id=b.dataset.v,q=sdqOf(id),o=sdqState();if(!q)return;
  var m=b.closest(".modal");
  if(b.dataset.act==="sdqno"){o.later[id]=Date.now()+20*3600000;persist();if(m)m.remove();return}
  if(b.dataset.act==="sdqyes"){if(!o.on[id])o.on[id]=today();persist();if(m)m.remove();render();pop((q.added||"Side-quest")+" added to your board");if(q.onYes)q.onYes();return}
  if(m)m.remove();if(proofPend["sdq:"+id]){pop("Still checking that photo");return}sdqAsk(id)});
document.addEventListener("change",function(e){if(e.target&&e.target.id==="sdqf1"){var f=e.target.files&&e.target.files[0];e.target.value="";sdqFile(f)}});
/* at load and now and then: a saved door, owed pieces, Theo's friend */
setInterval(function(){try{if(!loaded||!S||!S.created)return;sdqDngCheck();sdqOwe();sdqTheo()}catch(e){}},15000);
/* test hook (sandbox): offer(id) shows an offer now, wait(ms) sets the stand-in check's delay, fake(worlds) gives test friends */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbSide={state:sdqState,list:SIDEQ,when:sdqWhen,nights:sdqNights,ask:sdqAsk,file:sdqFile,theo:sdqTheo,dng:SDQDNG,
  offer:function(id){var o=sdqState();delete o.offerDay;if(id){SIDEQ.forEach(function(q){if(q.id!==id&&!o.on[q.id]&&!o.done[q.id])o.later[q.id]=Date.now()+60000})}styState().lastScene=0;var r=sdqOffer(true);if(id)SIDEQ.forEach(function(q){if(q.id!==id)delete o.later[q.id]});return r},
  me:function(){return MYUID||"me"},wait:function(ms){SDQWAIT=+ms||0},fake:function(L){SDQFAKE=L||null},biz:function(i){return bizDayOf(i)},pay:function(){return payRoom()}};
