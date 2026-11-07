/* ---------- Room tester (Cal, 2026-11-06). Testing only: removed at release with the Test pill and window.__qb. ----------
   "There's no way for me to properly test the restaurant or other time based or selling based unlocks without waiting. Give me a
   way to test each room and its assets."
   Test pill > Rooms: every room in every building, each with Open (builds it now, plus the rooms the story puts before it, the
   way the story's own free opening does), Everything (owns every upgrade, so all its art shows), Empty (no upgrades) and View
   (opens its window). Along the top: +6 hours (the game clock jumps, so rooms earn, the Garden grows, waters dry out), +20
   produce, +12 sold (Mara's trigger) and Next story step (plays the next step now, its scene included). */
/* the old Speakeasy never opens (it became Lock and Key's second floor), so the tester leaves it out too (QA's story read) */
function qbtRooms(){var o={};Object.keys(ROOMCELL).forEach(function(t){if(t==="speakeasy")return;var b=ROOMCELL[t][0];(o[b]=o[b]||[]).push(t)});return o}
function qbtSlot(t){var sl=S.base.slots;for(var i=0;i<sl.length;i++)if(sl[i]&&sl[i].t===t)return i;return -1}
function qbtOpen(t,quiet){if(qbtSlot(t)>=0)return;var o=styState(),s=styStep(t);
  /* the story's earlier rooms first, so the street and the knock-throughs make sense */
  if(s){for(var k=0;k<STORY.length&&STORY[k]!==s;k++){var p=STORY[k];if(p.room&&ROOMCELL[p.room]&&qbtSlot(p.room)<0)qbtOpen(p.room,1);if(p.how==="team"){o.done[p.id]=1;o.offer[p.id]=1;try{o.team[(p.scene&&p.scene.team)||p.id]=1}catch(e){}}}o.done[s.id]=1;o.offer[s.id]=1}
  S.base.slots.push({t:t,a:{},st:0,pend:0});
  /* QA (unlockall.js): the opener comes with what it needs first (the Walk-in Closet needs the wardrobe), as buying it would */
  S.base.slots.forEach(function(r){if(!r)return;(ADDONS[r.t]||[]).forEach(function(a){if(a[3]&&a[3].opens===t){r.a=r.a||{};r.a[a[0]]=1;var q=ADDREQ[a[0]],n=0;while(q&&!r.a[q]&&n++<9){r.a[q]=1;q=ADDREQ[q]}}})});
  try{if(typeof LFV!=="undefined")LFV.init=0}catch(e){}
  if(!quiet){persist();render();pop("Opened "+((ROOMT[t]||{}).name||t))}}
function qbtAll(t,on){var i=qbtSlot(t);if(i<0){qbtOpen(t,1);i=qbtSlot(t)}var r=S.base.slots[i];r.a={};
  /* QA: retired pieces stay out (the game no longer sells them); an upgrade that opens a room opens that room too */
  if(on)(ADDONS[t]||[]).forEach(function(a){var m=a[3]||{};if(m.retired)return;r.a[a[0]]=1;if(m.opens&&qbtSlot(m.opens)<0)qbtOpen(m.opens,1)});persist();render();pop(((ROOMT[t]||{}).name||t)+(on?": every upgrade":": no upgrades"))}
/* QA: a lot or upgrade step only offered the room, so every tap re-offered the Garden. A step plays its scene first (if it has
   one and hasn't been accepted), and otherwise is built right away, the way Open does it. */
function qbtNextStep(){var o=styState();for(var k=0;k<STORY.length;k++){var s=STORY[k];if(s.how==="never"||o.done[s.id]||(s.room&&styHas(s.room)))continue;
    document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});
    if(s.scene&&!o.offer[s.id]&&!(o.seen&&o.seen[s.id])){try{styScene(s);return}catch(e){}}
    if(s.room&&ROOMCELL[s.room]){qbtOpen(s.room);return}
    styOpen(s);o.done[s.id]=1;persist();pop("Story: "+s.id);return}
  pop("The story has no steps left")}
/* Cal (2026-11-07): "a button that triggers the next event such as the investor coming ... I want to be able to test everything
   myself but quickly". Test > Next event plays the next thing in the story's order for real (it saves, unlike Review): a team
   member's return visit whose step is done, Sable after the first mission, else the next story step (its scene first, then a tap
   later its room, built free). It skips what the game would wait for (income, level, one step a day) and says what that was. */
function qbtNextEvent(){var o=styState();o.beats=o.beats||{};
  document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});
  STORY.forEach(function(s){if(!o.done[s.id]&&s.room&&styHas(s.room))o.done[s.id]=1});
  var beatsAfter=function(id){return BEATS.filter(function(b){return QBRV_BEATAFTER[b.id]===id&&!o.beats[b.id]})},
    showBeat=function(b){o.beats[b.id]=1;o.lastScene=Date.now();S.coins+=60;S.earnedC+=60;persist();render();
      modal(styCard(b,styBeatPic(b),'<button class="btn" data-act="mclose">Continue</button><small class="sty-xp">+60 coins</small>'))};
  for(var k=0;k<STORY.length;k++){var s=STORY[k];if(s.how==="never")continue;
    if(o.done[s.id]){
      if(s.id==="chef"&&TEAM.sable&&!teamHas("sable")){teamJoin("sable");pop("Next event: Sable (normally after your first mission)");return}
      var bs=beatsAfter(s.id);if(bs.length){showBeat(bs[0]);pop("Next event: "+bs[0].who+(QBRV_BEATWHEN[bs[0].id]?" (normally: "+QBRV_BEATWHEN[bs[0].id]+")":""));return}
      continue}
    var why=s.why?" (normally: "+s.why.replace(/\.$/,"")+")":"";
    if(s.scene&&!(o.seen&&o.seen[s.id])){try{styScene(s);pop("Next event: "+s.scene.who+why);return}catch(e){}}
    if(s.room&&ROOMCELL[s.room]){qbtOpen(s.room);o.done[s.id]=1;persist();pop("Next event: "+((ROOMT[s.room]||{}).name||s.room)+" opened");return}
    styOpen(s);o.done[s.id]=1;persist();render();pop("Next event: "+s.id+why);return}
  var left=BEATS.filter(function(b){return !o.beats[b.id]});if(left.length){showBeat(left[0]);return}
  pop("That's every story event. Nothing left to trigger.")}
function qbtHtml(){var B=qbtRooms(),h='<div class="card box2 qbtr"><span class="label">Testing</span><h2 style="font-size:28px;margin:0 0 6px">Rooms</h2>'
  +'<p class="note">Skip the waiting. Open any room, own all of its upgrades to see every piece of art, or move the clock.</p>'
  +'<div class="qbtr-row"><button class="btn sm" data-qr="time">+6 hours</button><button class="btn sm" data-qr="veg">+20 produce</button><button class="btn sm" data-qr="sold">+12 sold</button><button class="btn sm" data-qr="next">Next story step</button></div>';
  Object.keys(B).sort().forEach(function(b){h+='<h3 class="label" style="margin-top:14px">'+esc((BLD[b]||{}).name||("Building "+b))+'</h3>';
    B[b].forEach(function(t){var i=qbtSlot(t),r=i>=0?S.base.slots[i]:null,n=(ADDONS[t]||[]).length,have=r?Object.keys(r.a||{}).length:0;
      h+='<div class="qbtr-room"><div><b>'+esc((ROOMT[t]||{}).name||t)+'</b><small>'+(r?'open &middot; '+have+'/'+n+' upgrades':'not open')+'</small></div><div class="qbtr-b">'
        +(r?'<button class="btn ghost sm" data-qr="view" data-t="'+t+'">View</button>':'<button class="btn sm" data-qr="open" data-t="'+t+'">Open</button>')
        +(n?'<button class="btn ghost sm" data-qr="all" data-t="'+t+'">Everything</button><button class="btn ghost sm" data-qr="none" data-t="'+t+'">Empty</button>':'')+'</div></div>'})});
  return h+'<div class="row" style="margin-top:12px"><button class="btn ghost" data-act="mclose">Close</button></div></div>'}
function qbRooms(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var m=modal(qbtHtml());
  m.addEventListener("click",function(e){var b=e.target.closest("[data-qr]");if(!b)return;var q=b.dataset.qr,t=b.dataset.t;
    if(q==="view"){var i=qbtSlot(t);m.remove();roomModal(i);return}
    if(q==="open")qbtOpen(t);
    if(q==="all")qbtAll(t,1);
    if(q==="none")qbtAll(t,0);
    if(q==="time"){window.__qbShift=(window.__qbShift||0)+6*36e5;try{simulate()}catch(x){}persist();render();pop("Six hours later")}
    if(q==="veg"){S.base.food=S.base.food||{};S.base.food.veg=Math.min(foodCap()*10,(S.base.food.veg||0)+20);persist();render();pop("+20 produce")}
    if(q==="sold"){var o=styState();o.sold=(o.sold||0)+12;persist();try{styCheck()}catch(x){}pop(o.sold+" produce sold so far")}
    if(q==="next"){m.remove();qbtNextStep();return}
    var c=m.querySelector(".qbtr");if(c){var y=m.scrollTop;c.outerHTML=qbtHtml();m.scrollTop=y}})}
window.__qbRooms={pay:function(){return {room:payRoom(),quest:payQuest(),share:payShare(),eff:dqEff(),paid:dqState().paid}},open:qbtOpen,all:qbtAll,next:qbtNextStep,nextEvent:qbtNextEvent,show:qbRooms,list:qbtRooms};
/* ---------- Review (Cal, 2026-11-07: "Show me all the cutscenes and visitors and unlocks in this next test pass so I can give my
   opinion"). Testing only, removed at release with the Test pill. Test pill > Review lists everything a player meets along the
   way, in the order they meet it, each with a Play button that shows it exactly as the game does. Playing changes nothing in
   the save: no coins, no team member, no seen flags, no brand marked as shown. */
var QBRV_BEATWHEN={mara1:"Restaurant with 5 upgrades",mara2:"Boba Shop with 2 upgrades",mara3:"Dessert Parlour with 3 upgrades",
  desmond2:"Lock and Key with 6 upgrades",rafe2:"Rafe on the team and a Rooftop",rafe3:"Rafe and Sable on the team, 5 missions",
  sable2:"Sable on the team, 8 missions",priya2:"the Movie Theater opens",nova2:"Nova on the team, mall with 6 upgrades",
  nova3:"Nova on the team and an Arcade",theo2:"Theo on the team, Auditorium with 3 upgrades",sable3:"the Goblin King's set finished in Relics",
  rafe4:"the amulet's five shards found"};
var QBRV_CLOSE='<button class="btn" data-act="mclose">Close</button><small class="sty-xp">Review: nothing saved</small>';
function qbrvName(t){return (ROOMT[t]||{}).name||t}
function qbrvRow(title,sub,btns){return '<div class="qbtr-room"><div><b>'+esc(title)+'</b><small>'+sub+'</small></div><div class="qbtr-b">'+btns+'</div></div>'}
function qbrvBtn(k,v,label){return '<button class="btn ghost sm" data-rv="'+k+'" data-v="'+esc(String(v))+'">'+esc(label||"Play")+'</button>'}
function qbrvHtml(){var h='<div class="card box2 qbtr qbrv"><span class="label">Testing</span><h2 style="font-size:28px;margin:0 0 6px">Review</h2>'
  +'<p class="note">Everything a player meets along the way, in order. Play shows it the way the game does; nothing is saved.</p>'
  +'<div class="qbtr-row"><button class="btn" data-rv="story" data-v="all">Play the whole story</button></div>';
  /* 1. the story: each step's scene, the room's welcome window and a new team member */
  h+='<h3 class="label" style="margin-top:14px">The story, in order</h3>';
  STORY.forEach(function(s,k){if(s.how==="never")return;var L=(ECON.stepLv||{})[s.id],b="";
    if(s.scene)b+=qbrvBtn("scene",s.id,"Scene");
    if(s.room&&ROOMHELP[s.room])b+=qbrvBtn("welcome",s.room,"Welcome");
    if(s.scene&&s.scene.team&&TEAM[s.scene.team])b+=qbrvBtn("team",s.scene.team,"Joins");
    var title=(k+1)+". "+(s.room?qbrvName(s.room):(s.scene?s.scene.who+" joins":s.id));
    h+=qbrvRow(title,(L?"Level "+L+" &middot; ":"")+esc(s.why)+(s.scene?" &middot; "+esc(s.scene.who)+", "+esc(s.scene.role):""),b)});
  if(ROOMHELP.loft)h+=qbrvRow("The first time in The Loft","The welcome window on day one",qbrvBtn("welcome","loft","Welcome"));
  if(TEAM.sable)h+=qbrvRow("Sable joins","After the first mission comes home",qbrvBtn("team","sable","Joins"));
  /* 2. return visits from the people you met */
  h+='<h3 class="label" style="margin-top:14px">Return visits (+60 coins each, one at a time)</h3>';
  BEATS.forEach(function(b){h+=qbrvRow(b.who+" at "+b.at,esc(QBRV_BEATWHEN[b.id]||"later in the story"),qbrvBtn("beat",b.id))});
  /* 3. friends who drop by, at most one a day */
  h+='<h3 class="label" style="margin-top:14px">Friends who visit (one a day)</h3>';
  FVISITS.forEach(function(v){var r=v.buff?v.buff.text:v.coin?"+"+v.coin+" coins":v.freeze?"+1 streak freeze":v.water?"waters the Garden":"just hanging out";
    h+=qbrvRow(fvNames(v.who),(v.need?"Needs the "+esc(qbrvName(v.need))+" &middot; ":"")+esc(r),qbrvBtn("visit",v.id))});
  /* 4. level-up unlocks: new areas, UI upgrades, rewards */
  h+='<h3 class="label" style="margin-top:14px">Level-up unlocks</h3>';
  AREAS.filter(function(a){return a[2]>1&&a[0]!=="hideout"&&a[0]!=="board"}).sort(function(x,y){return x[2]-y[2]}).forEach(function(a){h+=qbrvRow(a[1]+" (new area)","Level "+a[2],qbrvBtn("area",a[0]))});
  FX.forEach(function(f){h+=qbrvRow(f[2]+" (UI upgrade)","Level "+f[0],qbrvBtn("fx",f[1]))});
  REWARDS.forEach(function(r){h+=qbrvRow(r[1]+" (reward)","Level "+r[0],"")});
  /* 5. big upgrades that celebrate */
  var ups=[];Object.keys(ADDONS).forEach(function(t){(ADDONS[t]||[]).forEach(function(a){if(a[3]&&a[3].splash&&!a[3].retired)ups.push([t,a])})});
  if(ups.length){h+='<h3 class="label" style="margin-top:14px">Big upgrades</h3>';ups.forEach(function(x){h+=qbrvRow(x[1][1],esc(qbrvName(x[0])),qbrvBtn("up",x[0]+"|"+x[1][0]))})}
  /* 6. brand drops, by date */
  h+='<h3 class="label" style="margin-top:14px">Brand drops</h3>';
  BRANDS.forEach(function(b){h+=qbrvRow(b.name,esc(b.sub)+" &middot; "+esc(b.start),qbrvBtn("brand",b.id))});
  return h+'<div class="row" style="margin-top:12px"><button class="btn ghost" data-act="mclose">Close</button></div></div>'}
function qbrvPlay(k,v){
  if(k==="story"){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});qbrvStory();return}
  if(k==="scene"){var s=STORY.filter(function(x){return x.id===v})[0];if(s&&s.scene)modal(styCard(s.scene,styPortrait(s),QBRV_CLOSE));return}
  if(k==="beat"){var b=BEATS.filter(function(x){return x.id===v})[0];if(b)modal(styCard(b,styBeatPic(b),QBRV_CLOSE));return}
  if(k==="visit"){var f=FVISITS.filter(function(x){return x.id===v})[0];if(f)fvShow(f,1);return}
  if(k==="welcome"){S.seen=S.seen||{};var was=S.seen[v];roomSplash(v,true);if(!was)delete S.seen[v];persist();return}
  if(k==="team"){var o=styState(),had=o.team[v];teamJoin(v);if(!had)delete o.team[v];persist();return}
  if(k==="area"){var a=AREAS.filter(function(x){return x[0]===v})[0];if(a)modal('<div class="card box2"><span class="label">Level up</span><h2>Level '+a[2]+'</h2>'+areaCard(a,0)+'<div class="row" style="margin-top:10px">'+QBRV_CLOSE+'</div></div>');return}
  if(k==="fx"){var x=FX.filter(function(y){return y[1]===v})[0];if(x)modal('<div class="card box2"><span class="label">Level up</span><h2>Level '+x[0]+'</h2>'+fxCard(x,0)+'<div class="row" style="margin-top:10px">'+QBRV_CLOSE+'</div></div>');return}
  if(k==="up"){var p=v.split("|"),ad=(ADDONS[p[0]]||[]).filter(function(y){return y[0]===p[1]})[0];if(ad)upSplash(ad);return}
  if(k==="brand"){var br=BRANDS.filter(function(y){return y.id===v})[0];if(!br)return;var m=brandSplash(br),g=m&&m.querySelector(".bs-go");if(g){g.removeAttribute("data-b");g.setAttribute("data-act","mclose");g.textContent="Close"}return}}
function qbReview(){document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});var m=modal(qbrvHtml());
  m.addEventListener("click",function(e){var b=e.target.closest("[data-rv]");if(!b)return;qbrvPlay(b.dataset.rv,b.dataset.v)})}
window.__qbRooms.review=qbReview;window.__qbRooms.play=qbrvPlay;
/* ---------- Unlock everything (Cal, 2026-11-07: "I need the test to be able to allow me to access every upgradable room and section
   so I can test every section and cutscene and room"). Testing only, removed at release with the Test pill. One tap: level 50
   (its trials passed), every tab open, every room built in story order (each with no upgrades, so every upgrade can still be
   bought and seen), every story step done and the whole team hired, and 500,000 coins to buy with. Cutscenes play from Review. */
function qbUnlockAll(){if(!S||!S.created)return;var x=S,g,n=0;
  x.xp=Math.max(x.xp||0,cum(50));while((g=gated())!==null&&n++<40)x.gates.push(g);
  x.areaOn=x.areaOn||{};AREAS.forEach(function(a){x.areaOn[a[0]]=1});x.unlockDay="";
  var o=styState();o.sold=Math.max(o.sold||0,12);
  STORY.forEach(function(s){if(s.how==="never")return;o.done[s.id]=1;o.offer[s.id]=1;if(s.scene&&s.scene.team)o.team[s.scene.team]=1});
  Object.keys(TEAM).forEach(function(id){o.team[id]=1});
  /* the story's rooms first, in its order, then every other room (Closet, Lair, Patio, Game Room ...) */
  STORY.forEach(function(s){if(s.room&&s.how!=="never"&&ROOMCELL[s.room])qbtOpen(s.room,1)});
  Object.keys(ROOMCELL).forEach(function(t){if(t==="speakeasy")return;if(STORY.some(function(s){return s.room===t&&s.how==="never"}))return;qbtOpen(t,1)});
  x.coins=(x.coins||0)+500000;
  try{if(typeof LFV!=="undefined")LFV.init=0}catch(e){}persist();render();pop("Everything unlocked: level "+effLvl()+", every room and tab, +500,000 coins")}
window.__qbRooms.unlockAll=qbUnlockAll;
/* ---------- Review > Play the whole story (Cal, 2026-11-07: "I also want every story beat and character cutscenes to make
   sense"). Plays everything a player meets, one after another in the order they meet it: each story step (a short card saying
   what happens and why, when it has no scene of its own), its scene, the room's welcome window, a new team member, and the return
   visits where they fall. Close a window to go on; Stop ends it. Nothing is saved. */
/* where each return visit falls: right after this story step */
var QBRV_BEATAFTER={mara1:"chef",mara2:"boba",mara3:"dessert",desmond2:"rafe",rafe2:"rooftop",priya2:"theater",nova2:"theater",theo2:"auditorium",nova3:"arcade",sable2:"club",rafe3:"club",sable3:"club",rafe4:"club"};
function qbrvSeq(){var q=[],n=0;
  q.push(["note","The Loft","Day one. Your home base: quests pay coins, and coins build it up."]);
  if(ROOMHELP.loft)q.push(["welcome","loft"]);
  STORY.forEach(function(s){if(s.how==="never")return;n++;
    var name=s.room?qbrvName(s.room):(s.scene?s.scene.who:s.id),lv=(ECON.stepLv||{})[s.id];
    q.push(["note","Step "+n+": "+(s.room?name:s.scene.who+" joins"),(lv?"Level "+lv+". ":"")+s.why]);
    if(s.scene)q.push(["scene",s.id]);
    if(s.scene&&s.scene.team&&TEAM[s.scene.team])q.push(["team",s.scene.team]);
    if(s.room&&ROOMHELP[s.room])q.push(["welcome",s.room]);
    if(s.id==="chef"){q.push(["note","Meanwhile, at home","The Walk-in Closet opens the Shop, and a hollow panel at its back opens onto the Hero's Lair, where missions start."]);
      if(ROOMHELP.closet)q.push(["welcome","closet"]);if(ROOMHELP.lair)q.push(["welcome","lair"]);
      if(TEAM.sable)q.push(["note","Your first mission comes home","It brings someone back with it: Sable, found trapped below the city."],["team","sable"])}
    BEATS.forEach(function(b){if(QBRV_BEATAFTER[b.id]===s.id)q.push(["beat",b.id])})});
  q.push(["note","The end, for now","That is every story step, scene and return visit."]);
  return q}
var QBRV_RUN=null;
function qbrvStory(){var q=qbrvSeq(),k=0,run={stop:0};QBRV_RUN=run;
  var next=function(){if(run.stop||QBRV_RUN!==run)return;if(k>=q.length){QBRV_RUN=null;return}var it=q[k++],before=document.querySelectorAll("#layer .modal").length;
    if(it[0]==="note"){var m=modal('<div class="card box2"><span class="label">The story &middot; '+k+' / '+q.length+'</span><h2 style="font-size:26px">'+esc(it[1])+'</h2><p>'+esc(it[2])+'</p><div class="row"><button class="btn" data-act="mclose">Next</button><button class="btn ghost" data-qrv="stop">Stop</button></div></div>');
      m.querySelector("[data-qrv=stop]").onclick=function(){run.stop=1;m.remove()}}
    else qbrvPlay(it[0],it[1]);
    /* wait for the window it opened to close (a team join opens after a short delay), then go on */
    var waited=0,t=setInterval(function(){waited+=300;var now=document.querySelectorAll("#layer .modal").length;if(now>before||waited>1500){if(now<=before){clearInterval(t);next()}}},300)};
  next()}
window.__qbRooms.story=qbrvStory;window.__qbRooms.storySeq=qbrvSeq;
window.__qbRooms.gate=function(id){var s=STORY.filter(function(x){return x.id===id})[0];try{return !!(s&&s.gate())}catch(e){return "err:"+e.message}};
