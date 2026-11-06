/* ---------- interface upgrades ----------
   Everything here changes how the app behaves or reports your progress, not only its colors.
   An item is one line in the list below; what it does lives in the functions after it. */
SLOTS.splice(SLOTS.map(function(x){return x[0]}).indexOf("buff"),0,["hud","Status displays"],["sound","Sound packs"],["scene","Level-up scenes"]);
[
 ["hud_xp","hud","XP Bar",600,6,"Your level and XP stay in view at the top of every screen."],
 ["so_arcade","sound","Arcade Chimes",800,7,"Finishing a quest rings a pickup chime. Crits and level-ups get their own."],
 ["hud_day","hud","Day Tracker",1500,13,"The bar adds quests left today and your streak, on every screen."],
 ["bu_petal","burst","Petal Storm",1600,14,"Finished quests scatter drifting petals."],
 ["so_temple","sound","Temple Bells",1500,16,"Soft bells with a long ring. Good for early mornings."],
 ["sc_flare","scene","Solar Flare",2200,17,"Reaching a new level floods the screen with light before the reward."],
 ["tt_streak","title","Streak Keeper",1200,19,"A title that counts your live streak, like \"12-Day Flame\"."],
 ["fr_ember","frame","Streak Ember",2500,20,"Your status card glows hotter the longer your streak runs, up to 30 days.",{}],
 ["pet_wisp","pet","Hearth Wisp",3000,21,"Grows with your streak and tells you how many quests are left today."],
 ["th_sky","theme","Living Sky",3000,22,"Your colors follow the real sky in LA through the day.",{a:"#ffb86b",b:"#57c7ff"}],
 ["hud_next","hud","Next Quest Pin",3000,23,"The bar adds your next quest. Tap it from any screen to jump there."],
 ["bg_weather","bg","Live Weather",3500,24,"Real LA weather behind everything: rain when it rains, stars on clear nights."],
 ["bu_bolt","burst","Thunderclap",3000,25,"Lightning on every quest, and a white flash on crits."],
 ["tt_class","title","Rank Title",1800,26,"Always shows your current rank and level under your name."],
 ["so_synth","sound","Neon Synth",2500,27,"Rising synth arpeggios that climb higher on crits and level-ups."],
 ["fr_holo","frame","Holo Frame",4000,28,"A rainbow foil border that slowly turns around your status card."],
 ["th_aurora","theme","Aurora",5000,30,"Your colors drift slowly through the whole spectrum.",{a:"#7cf5c4",b:"#b388ff"}],
 ["bu_coin","burst","Coin Shower",4500,32,"Finished quests spray spinning gold coins."],
 ["bg_skyline","bg","Your Skyline",6000,34,"The LA skyline behind every screen, matching the real time of day."],
 ["sc_storm","scene","Storm Break",5000,36,"Reaching a new level brings lightning down across the whole screen."],
 ["pet_drake","pet","Pocket Drake",9000,40,"An egg that hatches at level 45 and grows up at 60. Shows the XP you still need."],
 ["tt_legend","title","Living Legend",6000,50,"A shimmering gold title that counts every quest you have ever finished."]
].forEach(function(x){if(!x[6])x[6]={};SHOP.push(x)});

BURST_PAL.bu_petal=["#ffd1e3","#ff9ec7","#fff0f6"];BURST_PAL.bu_bolt=["#fff7c2","#ffe45c","#ffffff"];BURST_PAL.bu_coin=["#ffd24a","#ffb300","#ffe88a"];
var IF_SPARK={bu_petal:{cls:"petal",ms:1500},bu_bolt:{cls:"bolt",ms:600},bu_coin:{cls:"coinp",ms:1100}};
var IF_TRY=null;
function ifSpark(){var b=IF_TRY||eqItem("burst");return (b&&IF_SPARK[b[0]])||{cls:"",ms:800}}

/* ---- titles ---- */
function ifTitle(t){
  if(t[0]==="tt_streak"){var n=streakNow();return n?n+"-Day Flame":"Unlit Flame"}
  if(t[0]==="tt_class")return RANKS[rankIdx()].l+"-Rank · Level "+effLvl();
  if(t[0]==="tt_legend")return "Legend of "+Number(S.total||0).toLocaleString("en-US")+" Quests";
  return t[2];
}

/* ---- companions ---- */
function ifLeft(){var all=ordered();return all.filter(function(q){return !S.done[q.id]}).length}
function ifToNext(){var lv=effLvl(),g=gated();if(lv>=MAXL&&!g)return null;return g?0:need(Math.min(lv,MAXL-1))-(S.xp-cum(lv))}
function ifPetLine(id){
  if(id==="pet_wisp"){var l=ifLeft();return l?l+(l===1?" quest":" quests")+" left today":"All done today"}
  if(id==="pet_drake"){var n=ifToNext();return n===null?"Max level":n===0?"Your gate is open":n+" XP to level "+(effLvl()+1)}
  return "";
}
var _petSvg=petSvg;
petSvg=function(id,sz){
  if(id==="pet_wisp"){var k=Math.min(1,streakNow()/30),c=k>.66?"#7fd8ff":k>.33?"#ffd24a":"#ff8a3d",c2=k>.66?"#e4f7ff":"#fff1b8";
    return '<svg class="crew" viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path class="pfl" d="M24 3C30 13 40 19 40 31a16 16 0 0 1-32 0C8 22 15 19 17 11c3 4 5 6 7-8z" fill="'+c+'"/><path d="M24 20c3 5 8 7 8 13a8 8 0 0 1-16 0c0-6 5-8 8-13z" fill="'+c2+'"/><circle cx="20" cy="32" r="2" fill="#2a1408"/><circle cx="28" cy="32" r="2" fill="#2a1408"/><path d="M21 37q3 2 6 0" stroke="#2a1408" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>'}
  if(id==="pet_drake"){var lv=effLvl();
    if(lv<45)return '<svg class="crew" viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path d="M24 4c10 0 17 15 17 25a17 17 0 0 1-34 0C7 19 14 4 24 4z" fill="#f4e7c8" stroke="#8a6a3a" stroke-width="1.5"/><path d="M15 19l5 4 4-4 5 4 5-4" stroke="#6fbf8f" stroke-width="2.4" fill="none" stroke-linejoin="round"/><circle cx="17" cy="33" r="3" fill="#6fbf8f"/><circle cx="30" cy="37" r="2.2" fill="#6fbf8f"/></svg>';
    var big=lv>=60,b=big?"#3fa877":"#6fd6a0",w=big?"#2a7f58":"#4fb886";
    return '<svg class="crew" viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true">'+(big?'<path d="M9 24L1 10l14 6zM39 24l8-14-14 6z" fill="'+w+'"/>':'<path d="M11 26L5 17l10 3zM37 26l6-9-10 3z" fill="'+w+'"/>')+'<ellipse cx="24" cy="31" rx="15" ry="13" fill="'+b+'"/><path d="M15 20l-3-9 8 5M33 20l3-9-8 5" fill="#ffd24a"/><ellipse cx="24" cy="36" rx="9" ry="6" fill="#d9f5e4"/><ellipse cx="18" cy="28" rx="3" ry="3.6" fill="#10201a"/><ellipse cx="30" cy="28" rx="3" ry="3.6" fill="#10201a"/><circle cx="19" cy="27" r="1" fill="#fff"/><circle cx="31" cy="27" r="1" fill="#fff"/></svg>'}
  return _petSvg(id,sz);
};
petHtml=function(){
  var p=eqItem("pet");if(!p)return "";
  var sz=p[0]==="pet_wisp"?Math.round(34+24*Math.min(1,streakNow()/30)):p[0]==="pet_drake"?(effLvl()>=60?58:50):46,line=ifPetLine(p[0]);
  return '<div class="pet">'+(line?'<span class="petsay">'+esc(line)+'</span>':'')+petSvg(p[0],sz)+'</div>';
};

/* ---- status bar ---- */
function ifHud(){
  var h=eqItem("hud"),el=document.getElementById("qbhud"),on=!!(h&&S.created);
  document.body.classList.toggle("has-hud",on);
  if(!on){if(el)el.remove();return}
  if(!el){el=document.createElement("div");el.id="qbhud";document.body.appendChild(el)}
  var lv=effLvl(),g=gated(),nd=need(Math.min(lv,MAXL-1)),full=(lv>=MAXL&&!g)||g,into=full?nd:S.xp-cum(lv);
  var s='<div class="hudfill" style="width:'+Math.max(2,Math.min(100,into/nd*100)).toFixed(1)+'%"></div><div class="hudrow"><b>Lv '+lv+'</b><span>'+(full?"Full":(nd-into)+" XP")+'</span>';
  if(h[0]==="hud_day"||h[0]==="hud_next"){var l=ifLeft();s+='<span>'+(l?l+" left":"Done")+'</span><span>'+streakNow()+'d streak</span>'}
  if(h[0]==="hud_next"){var nx=ordered().filter(function(q){return !S.done[q.id]})[0];if(nx)s+='<button class="hudnext" data-act="nav" data-v="board">'+esc(nx.name)+'</button>'}
  el.innerHTML=s+'</div>';
}

/* ---- backdrops and colors that follow the world ---- */
var IF_SKY=[[-8,"#8f9dff","#5f6bd8"],[0,"#ff7a8a","#b05fd8"],[6,"#ffb86b","#ff7a52"],[18,"#57c7ff","#4f8cff"]];
function ifSkyColors(el){var A=IF_SKY;if(el<=A[0][0])return [A[0][1],A[0][2]];for(var i=1;i<A.length;i++)if(el<=A[i][0]){var k=(el-A[i-1][0])/(A[i][0]-A[i-1][0]);return [lfMix(A[i-1][1],A[i][1],k),lfMix(A[i-1][2],A[i][2],k)]}return [A[A.length-1][1],A[A.length-1][2]]}
function ifColors(){
  var th=eqItem("theme"),st=document.documentElement.style;if(!th)return;
  if(th[0]==="th_sky"){var c=ifSkyColors(lfLS().el);st.setProperty("--accent",c[0]);st.setProperty("--accent2",c[1])}
  if(th[0]==="th_aurora"){var h=Math.round(Date.now()/1000/2)%360;st.setProperty("--accent","hsl("+h+" 85% 68%)");st.setProperty("--accent2","hsl("+((h+55)%360)+" 85% 62%)")}
}
function ifBackdrop(){
  var b=eqItem("bg"),dc=document.getElementById("deco");
  document.body.classList.toggle("has-bg",!!b);
  if(!dc)return;
  if(b&&(b[0]==="bg_weather"||b[0]==="bg_skyline")){
    var L=lfLS(),sk=lfSkyCols(L);dc.style.background="linear-gradient(180deg,"+sk[0]+","+sk[1]+")";
    if(b[0]==="bg_weather")dc.className="bgx bg_weather "+(L.wx==="rain"?"wx-rain":L.wx==="fog"?"wx-fog":L.wx==="cloud"?"wx-cloud":L.dark>.5?"wx-night":"wx-sun");
    else dc.className="bgx bg_skyline"+(L.dark>.4?" sk-night":"");
    try{lfWeatherInit()}catch(e){}
  }else dc.style.background="";
}
var _applyFx=applyFx;
applyFx=function(){_applyFx();document.body.style.setProperty("--sk",Math.min(1,streakNow()/30).toFixed(2));ifColors();ifBackdrop();ifHud()};
setInterval(function(){if(!S||!S.created||document.hidden)return;ifColors()},2000);
setInterval(function(){if(!S||!S.created||document.hidden)return;ifBackdrop()},60000);

/* ---- sound ---- */
var IF_SND={
 so_arcade:{wave:"square",vol:.045,gap:.07,decay:.12,done:[659,988],crit:[659,880,1319],level:[523,659,784,1047,1319],buy:[880,1175]},
 so_temple:{wave:"sine",vol:.13,gap:.2,decay:1.5,ring:2.76,done:[528],crit:[528,792],level:[396,528,660,792],buy:[660]},
 so_synth:{wave:"sawtooth",vol:.05,gap:.075,decay:.22,cut:1800,done:[330,494,659],crit:[330,494,659,988],level:[262,330,392,523,659,784,1047],buy:[494,659]}
};
var IF_AC=null;
function ifSound(kind,id){
  var p=id?IF_SND[id]:(eqItem("sound")&&IF_SND[eqItem("sound")[0]]);if(!p||!p[kind])return;
  try{
    IF_AC=IF_AC||new (window.AudioContext||window.webkitAudioContext)();if(IF_AC.state==="suspended")IF_AC.resume();
    var t0=IF_AC.currentTime+.01,out=IF_AC.destination;
    if(p.cut){var f=IF_AC.createBiquadFilter();f.type="lowpass";f.frequency.value=p.cut;f.connect(out);out=f}
    p[kind].forEach(function(hz,i){var t=t0+i*p.gap;[[hz,1]].concat(p.ring?[[hz*p.ring,.28]]:[]).forEach(function(v){
      var o=IF_AC.createOscillator(),g=IF_AC.createGain();o.type=p.wave;o.frequency.value=v[0];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(p.vol*v[1],t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+p.decay);o.connect(g);g.connect(out);o.start(t);o.stop(t+p.decay+.02)})});
  }catch(e){}
}

/* ---- level-up scenes ---- */
function ifScene(id){
  if(!id)return;
  var d=document.createElement("div");d.className="ifscene "+id;d.setAttribute("aria-hidden","true");
  if(id==="sc_storm")d.innerHTML=[12,38,63,84].map(function(x,i){return '<svg style="left:'+x+'%;animation-delay:'+(i*.24)+'s" viewBox="0 0 60 400" preserveAspectRatio="none"><path d="M34 0L10 150h20L6 270h22L14 400l40-190H32L52 0z" fill="#fff" /></svg>'}).join("");
  document.body.appendChild(d);setTimeout(function(){d.remove()},2600);
}

/* ---- hooks the rest of the app calls ---- */
function ifOnDone(crit){
  ifSound(crit?"crit":"done");
  if((eqItem("burst")||[])[0]==="bu_bolt"&&crit){var f=document.createElement("div");f.className="ifwhite";document.body.appendChild(f);setTimeout(function(){f.remove()},420)}
  setTimeout(function(){var p=document.querySelector(".hero .pet");if(p){p.classList.remove("hop");void p.offsetWidth;p.classList.add("hop")}},60);
}
function ifOnLevel(){ifSound("level");var s=eqItem("scene");if(s)ifScene(s[0])}
function ifTry(id,b){
  var it=shopItem(id);if(!it)return;var r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top;
  if(it[1]==="burst"){IF_TRY=it;burst(x,y,22);IF_TRY=null}
  if(it[1]==="sound")ifSound("level",id);
  if(it[1]==="scene"){ifSound("level");ifScene(id)}
}

/* ---- in the shop ---- */
var _thumb=thumb;
thumb=function(it){
  if(it[1]==="hud")return '<div class="thumb"><div class="ifhudth"><i style="width:'+({hud_xp:62,hud_day:62,hud_next:62})[it[0]]+'%"></i><span>'+({hud_xp:"Lv 12 · 340 XP",hud_day:"Lv 12 · 3 left · 9d",hud_next:"Lv 12 · Next: Gym"})[it[0]]+'</span></div></div>';
  if(it[1]==="sound")return '<div class="thumb ifsndth"><i></i><i></i><i></i><i></i><i></i></div>';
  if(it[1]==="scene")return '<div class="thumb ifscth '+it[0]+'"></div>';
  if(it[1]==="title"&&/^tt_(streak|class|legend)$/.test(it[0]))return '<div class="thumb"><span class="mono ttlx '+it[0]+'" style="font-size:13px">'+esc(ifTitle(it))+'</span></div>';
  if(it[1]==="burst"&&IF_SPARK[it[0]])return '<div class="thumb ifbth">'+(BURST_PAL[it[0]]||[]).map(function(c){return '<i class="spk '+IF_SPARK[it[0]].cls+'" style="background:'+c+'"></i>'}).join("")+'</div>';
  return _thumb(it);
};
var _itemHtml=itemHtml;
itemHtml=function(it){
  var h=_itemHtml(it);
  return h;
};
/* View, then Checkout (Cal, 2026-11-05): the card says View; the window shows the piece on your setup, or plays it, and
   holds the Checkout button. After buying, the card says Equip or Equipped · Remove. */
function ifWith(it,fn){var o=S.eq[it[1]],ow=S.owned[it[0]];S.eq[it[1]]=it[0];S.owned[it[0]]=true;try{return fn()}finally{if(o===undefined)delete S.eq[it[1]];else S.eq[it[1]]=o;if(!ow)delete S.owned[it[0]]}}
function qsViewHtml(it){var sl=it[1],pv,play=/^(sound|scene|burst)$/.test(sl);
  if(/^(bg|title|hud|pet)$/.test(sl))pv=ifWith(it,ifPreview).replace('<aside class="qs-mirror if-prev">','<div class="qs-mirror if-prev qv-prev">').replace(/<div class="qs-worn">[\s\S]*<\/aside>$/,'</div>');
  else pv='<div class="qv-thumb">'+thumb(it)+'</div>';
  var rq=it[6]&&it[6].req&&!S.owned[it[6].req]?shopItem(it[6].req):null,can=S.coins>=it[3];
  return '<div class="card box2 qs-view"><span class="label">'+(sl==="buff"?"Upgrade":"Interface")+'</span><h3>'+esc(it[2])+'</h3>'+pv
    +(play?'<button class="btn ghost" data-act="iftry" data-id="'+it[0]+'">Play it</button>':'')
    +'<p class="note">'+esc(it[5])+'</p><div class="row">'
    +(rq?'<button class="btn ghost" disabled>Needs '+esc(rq[2])+'</button>':can?'<button class="btn" data-act="qsvbuy" data-id="'+it[0]+'">Checkout · <i class="coin"></i>&nbsp;'+it[3]+'</button>':'<button class="btn ghost" disabled><i class="coin"></i>&nbsp;'+it[3]+' · need '+(it[3]-S.coins)+' more</button>')
    +'<button class="btn ghost" data-act="mclose">Close</button></div></div>'}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=qsview],[data-act=qsvbuy]");if(!b)return;var it=shopItem(b.dataset.id);if(!it)return;
  if(b.dataset.act==="qsview"){modal(qsViewHtml(it));return}
  var m=b.closest(".modal");if(m)m.remove();buy(it[0],e)});
/* What your setup looks like, right beside the items you are buying. */
function ifPreview(){
  var bg=eqItem("bg"),t=eqItem("title"),h=eqItem("hud"),lv=effLvl();
  return '<aside class="qs-mirror if-prev"><div class="if-screen">'+(bg?'<div class="bgx '+bg[0]+'"></div>':'')
    +(h?'<div class="if-hud"><i style="width:58%"></i></div>':'')
    +'<div class="hero if-card">'+petHtml()+'<div class="if-ring"><small>LV</small><b>'+lv+'</b></div><div class="if-who"><b>'+esc((S.char&&S.char.name)||"You")+'</b>'+(t?'<small class="ttlx '+t[0]+'">'+esc(ifTitle(t))+'</small>':'<small>No title</small>')+'</div></div>'
    +'<div class="if-btn">Your accent color</div></div>'
    +'<div class="qs-worn"><b>Your interface</b><small>Updates as you equip. Backdrops and frames show across the game.</small></div></aside>';
}
