/* ---------- Cal 2026-11-25: the monthly story chapter ----------
   Cal: "Yes to the monthly story chapters. Create a special item for each completed monthly story chapter that can either go in the loft
   or a cosmetic item that is one of a kind and VERY flashy so you can show it off the people in your profile banner. However 60 tasks for
   300 coins is minuscule ... It needs to be actually worthwhile. And a clock tower key should open a chest and I want you to surprise me
   on what it is ... These monthly chapter upgrades need to be AMAZING overhauls ... If for some reason the monthly chapter was not
   completed by anyone, you can move the prize to next month's story quest but always switch up the story to keep it interesting."
   - Each calendar month with a chapter in CH: on the 1st a letter tells that month's part of the story and its goal (V74GOAL tasks in the
     month). S.ch.t0 is S.total when the month began here, so an undone task comes off the count.
   - The goal met: a window pays V74COINS coins and V74XP XP and hands over the month's key; the key opens a chest (in the window, or later
     from the Board's Goals), which holds the month's prize. The prize is never named before the chest opens (Cal: "surprise me").
   - Each chapter has its own prize (CH[].prize). A chapter nobody (this player or anyone in the town's worlds, field chd) clears runs again
     the next month, told a little differently (Cal changed his mind on moving prizes; see CH below).
   - The first prize is the Timekeeper's Halo: a gilded clockwork halo turning over the head, a golden glow and drifting time-dust, on
     the player card everywhere it is shown (the Board's header, the profile, the card, other players' views of it). S.chfx is the prize
     worn (on by default once won; the card's Effects can come later). */
var V74GOAL=90,V74COINS=10000,V74XP=1000,V74START="2026-12";
/* Cal 11-25 (later): "Forget what I said about transferring the prizes to the next month. The prizes should make sense with the story. If no
   one clears the month's tasks, it repeats again the next month but with a slightly different text story but it is still the same story of
   the timekeeper." The Timekeeper's story, one chapter a month: a chapter stays until somebody clears it, and each month it repeats, its
   letter is told a little differently (texts[r], r = the months it has already run). Each chapter keeps its own prize. */
var CH=[
  {n:1,title:"The Clock Tower",from:"M.",prize:"px_halo",texts:[
    {body:'<p>The lamp in the old clock tower went out last night.</p><p>Nobody in town will say who used to keep it lit. I asked at every shop on the street, and every shopkeeper found something else to look at. The door at the bottom is locked, and the key is not anywhere I have looked.</p><p>If the town gets busy enough this month, somebody is bound to turn it up.</p><p>&mdash; M.</p>',
     found:'<p>It was under the last stair, wrapped in a cloth that smelled of oil and brass. A small key, warm as if somebody had just put it down.</p><p>It does not fit the tower door. It fits something else.</p>'},
    {body:'<p>The tower stayed dark all last month. Nobody found the key.</p><p>Last night the clock struck thirteen. I counted twice. The old woman who sells oranges crossed herself and shut her stall early, and she would not tell me why.</p><p>The key is still out there. Keep the town moving and it will turn up.</p><p>&mdash; M.</p>',
     found:'<p>Somebody had pushed it under the tower door from the inside. A small brass key, still warm.</p><p>It does not open the tower. It opens something else.</p>'},
    {body:'<p>Another month, and the tower is still dark.</p><p>I sat on the steps until midnight. The hands moved on their own, backwards, then stopped at four minutes to twelve. Whoever kept the lamp is still up there, I think. Or something is.</p><p>Somebody has to find that key.</p><p>&mdash; M.</p>',
     found:'<p>It hung from a nail in the stairwell, where the lamp-keeper\'s coat used to hang. Small, brass and warm.</p><p>It fits something else.</p>'}]},
  {n:2,title:"The Keeper's Ring",from:"M.",prize:"px_ring",texts:[
    {body:'<p>The lamp is lit again. Whoever opened that chest woke something.</p><p>The tower clock runs true now, but it hums at night, low, like a held note. The baker swears she saw a ring of light pass across her ceiling at three in the morning. The Keeper wore a ring, the old ones say. Nobody has seen it in forty years.</p><p>&mdash; M.</p>',
     found:'<p>It was inside the clock, caught between two teeth of the great wheel. A plain ring, until you hold it. Then the air around your hand starts to move.</p>'},
    {body:'<p>The humming has not stopped. It moves now, from the tower down the street and back, as if something is looking.</p><p>The Keeper\'s ring is still out there. The clock will not rest until somebody wears it.</p><p>&mdash; M.</p>',
     found:'<p>It rolled out of the gutter in front of the tower and stopped at your feet. The air around it will not keep still.</p>'}]},
  {n:3,title:"The Storm Over the Tower",from:"M.",prize:"px_storm",texts:[
    {body:'<p>Clouds came in last night that did not move with the wind. They sat over the tower, black on one side and white on the other, and the lightning between them made no sound.</p><p>The Keeper did not only keep time. The Keeper kept that.</p><p>&mdash; M.</p>',
     found:'<p>At the top of the tower, where the lamp used to be, the storm had folded itself into a small dark stone with a white seam. When you pick it up, it crackles.</p>'},
    {body:'<p>The storm is still over the tower. The lightning is closer every night, black and white, and still silent.</p><p>Somebody has to go up and take it.</p><p>&mdash; M.</p>',
     found:'<p>The storm came down the stairs to meet you and went quiet in your hands: a dark stone with a white seam, crackling.</p>'}]}];
var V74PRIZE=[{id:"px_halo",name:"Timekeeper's Halo",line:"A gilded clockwork halo that keeps its own time, a golden glow and drifting time-dust."},
  {id:"px_ring",name:"Keeper's Ring",line:"An aura that rises off you and never settles."},
  {id:"px_storm",name:"Silent Storm",line:"Black and white lightning that crackles off you without a sound."}];
function v74Month(){return today().slice(0,7)}
function v74Next(m){var a=m.split("-").map(Number);a[1]++;if(a[1]>12){a[1]=1;a[0]++}return a[0]+"-"+(a[1]<10?"0":"")+a[1]}
function v74St(){if(!S.ch||typeof S.ch!=="object")S.ch={};var C=S.ch;["done","prize","open","seen"].forEach(function(k){if(!C[k]||typeof C[k]!=="object")C[k]={}});
  var m=v74Month();if(C.m!==m){C.m=m;C.t0=+S.total||0;try{persist()}catch(e){}}return C}
function v74Count(){var C=v74St();return Math.max(0,(+S.total||0)-(+C.t0||0))}
/* did anybody clear month m: this player, or a player in the town's worlds (w.chd, a list of months); remembered once seen */
function v74Anyone(m){var C=v74St();if(C.done[m]||C.seen[m])return true;try{if((SOC.worlds||[]).some(function(w){return w&&Array.isArray(w.chd)&&w.chd.indexOf(m)>=0})){C.seen[m]=1;return true}}catch(e){}return false}
/* month m's chapter and the telling: chapters advance only past a month somebody cleared */
function v74Pos(m){if(!m||m<V74START)return null;var k=0,r=0;for(var x=V74START;x<m;x=v74Next(x)){if(v74Anyone(x)){k++;r=0}else r++}
  var c=CH[k];if(!c)return null;var t=c.texts[Math.min(r,c.texts.length-1)];return {c:c,k:k,r:r,t:t}}
function v74Ch(m){var P=v74Pos(m);return P?{n:P.c.n,title:P.c.title,from:P.c.from,body:P.t.body,found:P.t.found,prize:P.c.prize,r:P.r}:null}
function v74PrizeOf(m){var c=v74Ch(m);return c?v74Prize(c.prize):null}
function v74Prize(id){return V74PRIZE.filter(function(p){return p.id===id})[0]||null}
/* the month's goal met: pay once, hand the key over */
function v74Check(){try{if(!loaded||!S||!S.created)return;var m=v74Month(),c=v74Ch(m),C=v74St();if(!c||C.done[m]||v74Count()<V74GOAL)return;
    var p=v74PrizeOf(m);C.done[m]=Date.now();C.prize[m]=p?p.id:"";persist();
    setTimeout(function(){grantXp(V74XP,V74COINS,null);v74Win(m)},600)}catch(e){}}
function v74Win(m){var c=v74Ch(m)||{n:"",title:""},C=v74St();try{closeModals()}catch(e){}
  var md=modal('<div class="card box2 v74win"><span class="label">Chapter '+c.n+' complete</span><h2>'+esc(c.title)+'</h2>'+(c.found||"")
    +'<div class="reward reveal">+'+V74COINS.toLocaleString()+' coins</div><div class="reward reveal" style="animation-delay:.4s">+'+V74XP.toLocaleString()+' XP</div><div class="reward reveal v74key" style="animation-delay:.8s">A key</div>'
    +'<div class="btns"><button class="btn big" data-v74="open" data-m="'+esc(m)+'">Use the key</button><button class="btn ghost" data-act="mclose">Later</button></div></div>');
  try{burst(innerWidth/2,innerHeight/3,40)}catch(e){}return md}
/* the chest: the prize, once */
function v74Open(m){var C=v74St();if(!C.done[m])return;var id=C.prize[m],p=v74Prize(id);try{closeModals()}catch(e){}
  if(!C.open[m]){C.open[m]=Date.now();if(p)S.owned[p.id]=true;persist()}
  var md=modal('<div class="card box2 v74chest"><span class="label">The chest opens</span><div class="v74show">'+(p?v74Stage(p.id):'')+'</div><h2>'+esc(p?p.name:"Empty")+'</h2><p class="note">'+esc(p?p.line:"")+'</p>'
    +(p?'<div class="btns"><button class="btn big" data-v74="equip" data-id="'+esc(p.id)+'">'+(S.chfx===p.id?"Unequip":"Equip")+'</button></div>':'')+'</div>');
  try{burst(innerWidth/2,innerHeight/2.5,60)}catch(e){}try{render()}catch(e){}return md}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v74]");if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.v74==="open")v74Open(b.dataset.m||v74Month());
  /* Cal 11-25: "simply have a button that says equip just like the shop. And we can unequip it in the shop": the chest's button, and
     the prize's card in the Shop's Interface, Effects */
  if(b.dataset.v74==="equip"){var id=b.dataset.id;if(!(S.owned&&S.owned[id])||!v74Prize(id))return;S.chfx=S.chfx===id?null:id;persist();var md=b.closest(".modal");if(md)md.remove();render()}},true);
var v74Fx=v61FxHtml;v61FxHtml=function(){var h=v74Fx.apply(this,arguments);try{var mine=V74PRIZE.filter(function(p){return S.owned&&S.owned[p.id]});if(!mine.length)return h;
    var cards=mine.map(function(p){var on=S.chfx===p.id;return '<article class="v61fx'+(on?' on':'')+'"><div><b>'+esc(p.name)+'</b><small>'+esc(p.line)+'</small></div><button type="button" class="qs-btn'+(on?' alt':'')+'" data-v74="equip" data-id="'+esc(p.id)+'">'+(on?"Unequip":"Equip")+'</button></article>'}).join("");
    h=h.replace('<div class="v61fxs">','<div class="v61fxs">'+cards)}catch(e){}return h};

/* the month's letter, from the 1st (only for a player who has a save by then) */
INBOXGEN.push(function(){try{if(!S||!S.created)return [];var m=v74Month(),c=v74Ch(m);if(!c)return [];
  return [{id:"ch_"+m,from:c.from,d:m+"-01",subj:"Chapter "+c.n+": "+c.title,coins:0,body:c.body+'<p class="note"><b>This month:</b> finish '+V74GOAL+' tasks before the month is out. '
    +V74COINS.toLocaleString()+' coins, '+V74XP.toLocaleString()+' XP and whatever the key opens.</p>'}]}catch(e){return []}});

/* the Board's Goals: the chapter's row (29zz_v167.js) */
var v74Goals=v67Goals;v67Goals=function(){var G=v74Goals.apply(this,arguments);try{var m=v74Month(),c=v74Ch(m),C=v74St();if(!c)return G;var row;
    if(C.done[m]&&!C.open[m]){row={k:"ch",t:"Chapter "+c.n+": "+c.title,s:"You have a key.",go:'data-v74="open" data-m="'+m+'"',ready:1};G.ready++}
    else if(C.done[m])row={k:"ch",t:"Chapter "+c.n+": "+c.title,s:"Complete. The next chapter starts next month.",done:1};
    else{var n=v74Count();row={k:"ch",t:"Chapter "+c.n+": "+c.title,s:n+" of "+V74GOAL+" tasks this month",fr:Math.min(1,n/V74GOAL)}}
    G.list.splice(Math.min(1,G.list.length),0,row)}catch(e){}return G};

/* the town: which months this player finished, and the prize they wear */
var v74World=socWorldDoc;socWorldDoc=function(){var d=v74World.apply(this,arguments);try{d.chd=Object.keys(v74St().done).slice(0,24);d.chfx=v74Prize(S.chfx)&&S.owned&&S.owned[S.chfx]?S.chfx:null}catch(e){}return d};
var v74Safe=fshSafe;fshSafe=function(w){var o=v74Safe.apply(this,arguments);try{o.chfx=w&&typeof w.chfx==="string"&&v74Prize(w.chfx)?w.chfx:null}catch(e){o.chfx=null}return o};

/* ---- the Timekeeper's Halo on the player card ---- */
function v74Halo(){var t="",num=["XII","I","II","III","IIII","V","VI","VII","VIII","IX","X","XI"];
  for(var i=0;i<48;i++){var a=i*7.5;t+='<rect x="98.6" y="'+(i%4?"9":"6")+'" width="2.8" height="'+(i%4?"7":"11")+'" rx="1" transform="rotate('+a+' 100 100)"/>'}
  var n="";num.forEach(function(s,i){var a=i*30;n+='<text x="100" y="33" transform="rotate('+a+' 100 100)">'+s+'</text>'});
  return '<svg class="v74ring" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="v74g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#f2c14e"/><stop offset="1" stop-color="#9a6a12"/></linearGradient></defs>'
    +'<g class="v74spin"><circle cx="100" cy="100" r="88" fill="none" stroke="url(#v74g)" stroke-width="5"/><circle cx="100" cy="100" r="78" fill="none" stroke="url(#v74g)" stroke-width="1.6" stroke-dasharray="3 5"/>'
    +'<g fill="url(#v74g)">'+t+'</g><g class="v74num" fill="#ffe9a8">'+n+'</g></g>'
    +'<g class="v74spin2"><circle cx="100" cy="100" r="60" fill="none" stroke="#ffd56b" stroke-width="1.2" stroke-dasharray="1 7" opacity=".8"/></g></svg>'}
function v74Dust(){var h="";for(var i=0;i<14;i++)h+='<i style="left:'+(8+i*6.2)+'%;animation-delay:-'+(i*.31).toFixed(2)+'s;animation-duration:'+(3.2+(i%3)*.7).toFixed(1)+'s"></i>';return '<span class="v74dust" aria-hidden="true">'+h+'</span>'}
function v74Stage(id){if(id!=="px_halo")return "";return '<span class="v74fx v74big"><span class="v74glow"></span><span class="v74halo">'+v74Halo()+'</span>'+v74Dust()+'</span>'}
function v74Mine(){try{return S.chfx&&S.owned&&S.owned[S.chfx]&&v74Prize(S.chfx)?S.chfx:null}catch(e){return null}}
function v74Wear(h,fx){if(fx!=="px_halo")return h;
  return h.replace('<span class="fsh-fig pc-fig">','<span class="fsh-fig pc-fig v74on"><span class="v74glow" aria-hidden="true"></span>').replace(/(<span class="fsh-fig pc-fig v74on">[\s\S]*?)(<\/span><\/(?:div|span)>)/,function(m,a,z){return a+'<span class="v74halo" aria-hidden="true">'+v74Halo()+'</span>'+v74Dust()+z})}
var v74Pc=pcHtml;pcHtml=function(p,H){var h=v74Pc.apply(this,arguments);try{h=v74Wear(h,p&&(p.me?v74Mine():p.chfx))}catch(e){}return h};
/* the Board's header card (29zz_v155.js) is built on its own */
var v74Av=v55Av;v55Av=function(){var h=v74Av.apply(this,arguments);try{h=v74Wear(h,v74Mine())}catch(e){}return h};
/* the halo sits on the drawn head: measured once the figure's picture is in (v64Box), as a share of the picture's height */
function v74Place(im){try{var f=im.closest(".pc-fig.v74on");if(!f)return;var b=v64Box(im);if(!b)return;var R=im.getBoundingClientRect(),F=f.getBoundingClientRect();if(R.height<10)return;
    var top=R.top-F.top+b[1]*R.height,w=(b[2]-b[0])*R.width,cx=R.left-F.left+(b[0]+b[2])/2*R.width,hw=Math.max(22,w*1.05);
    var hl=f.querySelector(".v74halo");if(hl){hl.style.width=hw.toFixed(1)+"px";hl.style.left=(cx-hw/2).toFixed(1)+"px";hl.style.top=(top-hw*.42).toFixed(1)+"px"}
    var g=f.querySelector(".v74glow");if(g){var gh=(b[3]-b[1])*R.height;g.style.left=(cx-w*1.3).toFixed(1)+"px";g.style.width=(w*2.6).toFixed(1)+"px";g.style.top=(top-gh*.3).toFixed(1)+"px";g.style.height=(gh*1.45).toFixed(1)+"px"}}catch(e){}}
document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.classList&&t.classList.contains("calp")&&t.closest&&t.closest(".pc-fig.v74on"))v74Place(t)},true);
var v74Render=render;render=function(){var r=v74Render.apply(this,arguments);try{v74Check();setTimeout(function(){[].forEach.call(document.querySelectorAll(".pc-fig.v74on img.calp"),v74Place)},50)}catch(e){}return r};
setInterval(function(){try{if(!document.hidden)v74Check()}catch(e){}},20000);
htabCss("qb-v174-css",".pc-fig.v74on{position:relative;isolation:isolate}.pc-fig.v74on>img.calp{position:relative;z-index:1}/* no drop-shadow: the frame's faint alpha would outline the whole frame */"
  +"@keyframes v74rim{0%,100%{filter:drop-shadow(0 0 1.5px #fff1c2) drop-shadow(0 0 5px rgba(255,200,80,.85)) drop-shadow(0 0 12px rgba(255,150,30,.45))}50%{filter:drop-shadow(0 0 2px #fff6d8) drop-shadow(0 0 8px rgba(255,210,90,1)) drop-shadow(0 0 20px rgba(255,150,30,.7))}}"
  +".v74glow{position:absolute;left:10%;width:80%;top:0;height:100%;z-index:0;pointer-events:none;border-radius:50%;background:radial-gradient(closest-side,rgba(255,236,170,.95),rgba(255,190,60,.55) 40%,rgba(230,120,20,.22) 65%,transparent 82%);filter:blur(3px);animation:v74pulse 3.2s ease-in-out infinite}"
  +".v74halo{position:absolute;left:30%;width:40%;top:-6%;z-index:2;pointer-events:none;perspective:300px;filter:drop-shadow(0 0 4px rgba(255,214,107,.9)) drop-shadow(0 0 10px rgba(255,170,40,.6))}"
  +".v74ring{display:block;width:100%;height:auto;transform:rotateX(68deg);overflow:visible}.v74spin{transform-origin:100px 100px;animation:v74rot 18s linear infinite}.v74spin2{transform-origin:100px 100px;animation:v74rot 7s linear infinite reverse}"
  +".v74num{font:700 15px/1 Georgia,serif;text-anchor:middle;letter-spacing:.02em}"
  +".v74dust{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:visible}.v74dust i{position:absolute;bottom:12%;width:3px;height:3px;border-radius:50%;background:#ffe6a0;box-shadow:0 0 6px 2px rgba(255,200,80,.8);opacity:0;animation:v74rise 3.6s ease-in infinite}"
  +"@keyframes v74rot{to{transform:rotate(360deg)}}@keyframes v74pulse{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}@keyframes v74rise{0%{opacity:0;transform:translateY(0) scale(.6)}15%{opacity:1}100%{opacity:0;transform:translateY(-120px) scale(1.1)}}"
  +".v74show{position:relative;height:170px;margin:6px auto 10px;width:170px}.v74fx.v74big{position:absolute;inset:0}.v74big .v74glow{left:0;width:100%;top:10%;height:90%}.v74big .v74halo{left:10%;width:80%;top:18%}"
  +".v74win .v74key{color:#ffd56b}"
  +"@media (prefers-reduced-motion:reduce){.v74spin,.v74spin2,.v74glow,.v74dust i,.pc-fig.v74on>img.calp{animation:none}.v74dust{display:none}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV174={chOf:v74Ch,goals:function(){return v67Goals()},st:v74St,count:v74Count,check:v74Check,open:v74Open,prizeOf:v74PrizeOf,ch:CH,prize:V74PRIZE,goal:V74GOAL};
