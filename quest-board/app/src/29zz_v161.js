/* ---------- Cal 2026-11-25: a tidy profile ----------
   Cal: "In the profile page, there are too many things going on. First, the player card, closet, sound:on, replay tutorial, and relics
   are all placed in random areas. Remove Sound On and just make the sound permanently on. Remove '6 UI upgrades active. Next upgrade
   at level 9.' Move this into the interface shop as an already purchased item. Make sure we can toggle these interface items on and
   off and that they place nice with each other. Remove the weekly warrior section and just put that in the training tab instead. In
   the training tab, remove 'after it passes, you can post it to town hall'. When clicking on the top left profile card, it takes me
   to my banner. Instead, take me to the profile page but have the banner show in full on this page on the top left. Change Player
   card button here to 'Change banner'. On this page, there should just be 'Closet', 'Change Banner'. 'Replay Tutorial' can be on the
   bottom of this profile page. Remove 'Path Skill' card and the 'Final Form skill card.' We havent unlocked this yet so it just takes
   up room. Change the text under your skills: 'For makers: art, writing, etc' This is just a repeat of the class advancement text.
   Remove this text altogether. Remove all text underneath the stats diagram."
   - The profile: the banner whole at the top left (tapping it opens the big card, where "Post my card" lives), the name and one
     line beside it, and two buttons: Closet, Change banner. Then the level card, the class card, the skills that are unlocked, the
     stats card, Relics (once open), and at the bottom Replay tutorial and Start over.
   - Gone from it: the sound switch (sound is always on), the "UI upgrades" line, Weekly Warrior (it is the Training tab's head
     already), the two locked skill cards, the line under "Your skills", and the photo-proof paragraph under the stats card.
   - The header's card opens the profile again (29zz_v155.js).
   - The level's interface effects (FX, 10_app_a.js) are in the Shop's Interface, tab "Effects": each one the level has reached is
     listed as owned with an On / Off switch (S.fxOff), the next one shows its level. applyFx leaves a switched-off effect out. */
sndBtn=function(){return ""};
function v61Sound(){try{if(loaded&&S&&S.sndOff){S.sndOff=0;persist()}}catch(e){}}
var v61Prof=profileHtml;profileHtml=function(){var h=v61Prof.apply(this,arguments);v61Sound();
  try{var relics=/data-v="trophy"/.test(h),tour=/data-act="tourreplay"/.test(h);
    h=h.replace(/<div class="zx-me">[\s\S]*?<\/div>/,"").replace(/<div class="upg">[\s\S]*?<\/div>/,"").replace(/<section class="card wstrip"[\s\S]*?<\/section>/,"")
       .replace(/(<h3 class="label">Your skills<\/h3>)<p class="note">[\s\S]*?<\/p>/,"$1").replace(/<div class="chap lockc">[\s\S]*?<\/div>/g,"").replace(/<div class="foot">[\s\S]*?<\/div>/,"")
       ;/* Cal, later on 11-25: "for the text underneath the stats, I just meant remove the 'Photo proof: 0% of your etc etc --- once cleared.' Keep the stat diagram and the text in that box." The Stats card stays whole; only the paragraph under it (.foot, above) is gone. */
    var end=(relics?'<div class="zx-me v61rel"><button type="button" class="btn ghost" data-act="nav" data-v="trophy">Relics</button></div>':'')+(tour?'<div class="v61end"><button type="button" class="btn ghost" data-act="tourreplay">Replay tutorial</button></div>':'');
    var i=h.indexOf('<section class="card panel rsp">');h=i<0?h+end:h.slice(0,i)+end+h.slice(i);
    /* Cal, later on 11-25: "put the circular level icon to the left of that box, and then the xp and remaining exp to level 9 to the
       right", and on the class card: "remove the Runeweaver: tier 1 of 9 text. Remove the story button. and remove the 'next advancement
       at level 10' text. Remove Encore in the box above your skills. Just have the skills slowly fill up the table underneath 'Your
       Skills' as you unlock them." The level card is one row (ring, then XP and what is left) with the streak row under it; the class
       card is its emblem and title. */
    var d=document.createElement("div");d.innerHTML=h;var hero=d.querySelector("section.hero"),ring=hero&&hero.querySelector(".ring"),inner=ring&&ring.nextElementSibling;
    if(hero&&ring&&inner){var row=document.createElement("div");row.className="v61lv";var txt=document.createElement("div");txt.className="v61xp";
      [].slice.call(inner.children).forEach(function(c){if(!/\b(meta|streakline)\b/.test(c.className))txt.appendChild(c)});hero.insertBefore(row,ring);row.appendChild(ring);row.appendChild(txt);
      [].slice.call(inner.children).forEach(function(c){hero.appendChild(c)});inner.remove()}
    var ban=d.querySelector("section.banner");if(ban)[].forEach.call(ban.querySelectorAll(".sub,.row2"),function(e){e.remove()});
    /* Cal, later: "combine the novice runeweaver and the skills tab into one box where the gradient of the art comes down into the
       skills and fades out": the class card holds its skills; its art runs down behind them and fades out */
    var sk=[].slice.call(d.querySelectorAll("section")).filter(function(e){var t=e.querySelector("h3");return t&&/Your skills/i.test(t.textContent)})[0];
    if(ban&&sk){var head=document.createElement("div");head.className="v61clshead";[].slice.call(ban.children).forEach(function(c){if(!c.classList.contains("clsbg"))head.appendChild(c)});ban.appendChild(head);
      var body=document.createElement("div");body.className="v61sk";[].slice.call(sk.children).forEach(function(c){body.appendChild(c)});ban.appendChild(body);ban.classList.add("v61cls");sk.remove()}
    h=d.innerHTML}catch(e){}
  return h};
charModal=function(){var p=pcMe(),ban="";try{ban=pcHtml(p,104)}catch(e){ban='<div class="figwrap">'+calImg(lookOf(),"idle",120,"")+'</div>'}
  var m=modal('<div class="card box2 adv prof v61"><div class="prof-top v61top"><button type="button" class="v61ban" data-act="pcard" aria-label="Your banner. Open your player card">'+ban+'</button>'
    +'<div class="v61id"><h2>'+esc((S.char&&S.char.name)||"Hunter")+'</h2><p class="note">'+esc(tierName(S.gates.length))+' &middot; Level '+effLvl()+' &middot; '+(+S.coins||0).toLocaleString()+' coins</p>'
    +'<div class="v61btns"><button class="btn ghost" data-act="wardrobe">Closet</button><button class="btn ghost" data-act="pcbgs">Change banner</button></div></div></div><div class="prof-body">'+profileHtml()+'</div></div>');
  m.classList.add("profm");return m};
/* ---- the level's effects: owned, and switched on or off, in the Shop's Interface ---- */
function v61Off(){var o=S.fxOff;if(!o||typeof o!=="object")o=S.fxOff={};return o}
var V61FXD={grid:"A faint grid behind every screen.",burst:"A burst of sparks when you finish a task.",pulse:"A slow neon pulse on card edges.",brackets:"Corner brackets on the main cards.",sweep:"On your profile: a scan line sweeps the level card.",orbs:"Soft orbs drifting in the background.",ringglow:"On your profile: your level ring keeps a glow.",embers:"Embers rising from the bottom of the screen.",chipglow:"Chips and tags glow.",aurora:"An aurora across the top of the sky.",holo:"A holographic shimmer on cards.",shimmer:"A shimmer along your progress bars.",halo:"On your profile: a halo orbits your level.",glowtext:"On your profile: headlines glow.",flares:"Light flares in the corners.",stars:"Starlight in the background.",vignette:"A cinematic vignette.",edgeglow:"The screen's edge glows.",gilded:"Headlines turn gold."};
/* QA 716955df: Holo shimmer and Stat bar shimmer style elements no screen has any more, so they are not offered; four others only
   touch the profile's level card, and their line says so */
var V61DEAD={holo:1,shimmer:1};
function v61FxList(){return FX.filter(function(f){return !V61DEAD[f[1]]})}
function v61FxHtml(){var lv=effLvl(),off=v61Off(),L=v61FxList(),got=L.filter(function(f){return f[0]<=lv}),nxt=L.filter(function(f){return f[0]>lv})[0];
  var card=function(f,lock){var on=!off[f[1]];return '<article class="v61fx'+(lock?' lock':on?' on':'')+'" data-fx="'+f[1]+'"><div><b>'+esc(f[2])+'</b><small>'+esc(lock?"Yours at level "+f[0]+".":(V61FXD[f[1]]||"An interface effect."))+'</small></div>'
    +(lock?'<span class="chip">Level '+f[0]+'</span>':'<button type="button" class="qs-btn'+(on?'':' alt')+'" data-act="fxtog" data-id="'+f[1]+'" aria-pressed="'+on+'">'+(on?"On":"Off")+'</button>')+'</article>'};
  return '<section class="qs-sec"><h3>Effects</h3>'
    +(got.length>1?'<div class="v61all"><button type="button" class="qs-link" data-act="fxall" data-id="on">All on</button><button type="button" class="qs-link" data-act="fxall" data-id="off">All off</button></div>':'')
    +'<div class="v61fxs">'+got.map(function(f){return card(f,0)}).join("")+(nxt?card(nxt,1):"")+'</div></section>'}
var v61Fx=applyFx;applyFx=function(){var r=v61Fx.apply(this,arguments);try{var off=(S&&S.fxOff)||{};Object.keys(off).forEach(function(k){if(off[k])document.body.classList.remove("fx-"+k)})}catch(e){}return r};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=fxtog],[data-act=fxall]");if(!b)return;e.preventDefault();e.stopPropagation();var off=v61Off(),id=b.dataset.id;
  if(b.dataset.act==="fxall"){v61FxList().forEach(function(f){if(f[0]<=effLvl()){if(id==="off")off[f[1]]=1;else delete off[f[1]]}})}
  else if(v61FxList().some(function(f){return f[1]===id&&f[0]<=effLvl()})){if(off[id])delete off[id];else off[id]=1}
  persist();render()},true);
htabCss("qb-v161-css",".prof.v61 .v61top{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:center;text-align:left;margin-bottom:14px}.v61ban{display:block;width:148px;padding:0;border:0;background:none;cursor:pointer;border-radius:18px}"
  +".v61ban .pcard{width:148px;max-width:none;margin:0;border-radius:16px}.v61ban .pc-plate{display:none}.v61ban .pc-stage{bottom:8%}.v61ban:focus-visible{outline:2px solid var(--accent);outline-offset:3px}"
  +".v61id{min-width:0}.v61id{padding-top:46px}/* the name starts under the close button, so it has the column's whole width */.v61id h2{margin:0 0 4px;font-size:clamp(19px,5.8vw,26px);line-height:1.1;overflow-wrap:break-word}.v61id .note{margin:0 0 12px}.v61btns{display:grid;gap:8px}.v61btns .btn{width:100%;margin:0}"
  +".prof.v61 .zx-me.v61rel,.prof.v61 .v61end{display:flex;justify-content:center;margin:12px 0}.prof.v61 .v61rel .btn,.prof.v61 .v61end .btn{min-width:180px}"
  +".prof.v61 .hero{display:block}.prof.v61 .v61lv{display:flex;align-items:center;justify-content:center;gap:18px;margin:0 0 12px}.prof.v61 .v61lv .ring{flex:none;margin:0}.prof.v61 .v61xp{min-width:0;text-align:left}.prof.v61 .v61xp .xp{line-height:1}.prof.v61 .v61xp .note{margin-top:6px}"
  +".prof.v61 section.banner h3{margin:0}"
  +".prof.v61 section.banner.v61cls{display:block;padding:0 0 16px;overflow:hidden}.prof.v61 .v61cls .v61clshead{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center;padding:16px 14px 10px;min-height:150px}"
  +".prof.v61 .v61cls.hasart .clsbg{inset:0 0 auto 0;height:min(100%,360px);-webkit-mask-image:linear-gradient(180deg,#000 0,#000 38%,rgba(0,0,0,.35) 70%,transparent 100%);mask-image:linear-gradient(180deg,#000 0,#000 38%,rgba(0,0,0,.35) 70%,transparent 100%)}"
  +".prof.v61 .v61cls.hasart .clsbg:after{background:linear-gradient(90deg,rgba(10,8,8,.78) 0%,rgba(10,8,8,.45) 50%,rgba(10,8,8,.25) 100%),linear-gradient(180deg,transparent 40%,rgba(10,8,8,.55) 100%)}"
  +".prof.v61 .v61cls .v61sk{padding:4px 14px 0}.prof.v61 .v61cls .v61sk>h3{margin:4px 0 10px}"
  +"@media (max-width:350px){.v61ban,.v61ban .pcard{width:120px}}"
  +".v61fxs{display:grid;gap:8px}.v61fx{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:var(--cardbg,#141829);color:var(--ink,#eef1f8)}.v61fx>div{min-width:0;display:grid;gap:3px}.v61fx b{font-size:15px}.v61fx small{color:var(--soft,#a3a9bd);font-size:12.5px;line-height:1.3}"
  +".v61fx .qs-btn{flex:none;min-width:64px}.v61fx.lock{opacity:.6}.v61fx .chip{flex:none}.v61all{display:flex;gap:14px;margin:0 0 8px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV161={fx:function(){return v61FxList().map(function(f){return f.slice()})},off:function(){return Object.keys(v61Off())},fxHtml:v61FxHtml};
