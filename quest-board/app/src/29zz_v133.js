/* ---------- Cal's 2026-11-23 list, part 3 ----------
   Cal: "i want the shop to open faster so go ahead and allow the walk in closet upgrade a bit sooner. Once the loft is upgraded about
   70%, not including the loft or trophy room, then the garden should open. Pet shop and boutique can open at lvl 30. The other dead
   stretches should still have something that happes every 5 levels to keep it interesting." And on the interface: "I would also like
   to be able to preview the interface upgrades before I purchase them. The interface upgrade menu has a few cosmetic bugs and items
   that [are not] fitting onto the screen ... The backdrops do not show any preview ... The comapnions are pointless. Remove status
   displays tab in upgrades". The Pet Shop and the Boutique already open together at level 30 (ECON.floors). */

/* ---- the Walk-in Closet comes straight after the Figurine Cabinet it needs, not last in the Bedroom (it was after ~28 others,
   about day 7 for a daily player). Its price is unchanged. ---- */
/* Cal 11-23: "I want the walk in closet to be purchasable for a bit cheaper. Make it 600 coins so that the shop can be unlocked sooner."
   600 flat: marked fixed so the economy's re-pricing (econEarn) leaves it, and set again after every sort and after the 1.15 price rise
   (29zzz_econ.js calls v33Closet) */
var CLOSETP=600;function v33Closet(){try{(ADDONS.bedroom||[]).forEach(function(a){if(a[0]==="bd_ward2"){a[2]=CLOSETP;a[3]=Object.assign({},a[3]||{},{fixed:1})}})}catch(e){}}
var v33Sort=econSort;econSort=function(){v33Closet();v33Sort.apply(this,arguments);try{var A=ADDONS.bedroom,i=A.map(function(a){return a[0]}).indexOf("bd_ward2");
  if(i<0)return;var w=A.splice(i,1)[0],j=A.map(function(a){return a[0]}).indexOf("bd_ward1");A.splice(j<0?0:j+1,0,w)}catch(e){}};
econSort();

/* ---- the Garden at about 70% of The Loft's upgrades (ECON.loftCore: the Bedroom, Closet, Game Room and Patio; never the Lair or the
   Trophy Room), was 50% ---- */
/* the gate that runs is ECON.unlock (29b_story.js line 148 replaces each room's story gate with unlockMet); gardenLoft is set to match */
ECON.gardenLoft=.7;if(ECON.unlock&&ECON.unlock.garden)ECON.unlock.garden.loft=.7;
/* and the Walk-in Closet's own gate: 15% of the Bedroom's upgrades, was 30% */
if(ECON.unlock&&ECON.unlock.closet)ECON.unlock.closet.pct=.15;
(function(){var g=STORY.filter(function(s){return s.id==="garden"})[0];if(!g)return;g.why="Fill most of The Loft and you might pick up a new hobby.";
  if(g.scene&&g.scene.lines)g.scene.lines[0]="Most of the Loft done, and the place finally feels like home. You decided to pick up a new hobby: gardening."})();

/* ---- a milestone every 5 levels: choose one of three pieces of clothing you do not own, from the brands on sale now. Levels 5, 10,
   15 ... had nothing on their level-up since the real-life rewards went (Cal 11-13) and they never got a level crate (lvEmpty). The three
   are picked once per level and kept (S.mile), so closing the window and coming back shows the same three; a milestone stays waiting
   (it opens again on the next screen) until one is chosen. With fewer than three pieces left, coins make up the rest. ---- */
var MS_EVERY=5,MS_FROM=5;
/* S.mile, not S.ms: 28_missions.js deletes S.ms (the old Missions) every 5 s (QA bbcfb26). since: the milestone this save had already passed when it first saw this code; only the ones after it are offered (a save past
   level 40 does not get eight windows at once). Set on first use, so a save loaded later (the cloud's) gets its own. */
function msState(){if(!S.mile||typeof S.mile!=="object")S.mile={};var M=S.mile;if(typeof loaded!=="undefined"&&loaded&&S.created){var base=Math.floor(effLvl()/MS_EVERY)*MS_EVERY;
    if(M.since==null){M.since=base;M.fx1=1;persist()}
    /* QA: a save that opened v1.31's first ship (its levels halved) took its since from the halved level, so 20, 25 and 30 would all
       fall due once its level came back; once, with nothing picked yet, since moves up to today's level and the offers go */
    else if(!M.fx1){M.fx1=1;if(!Object.keys(M).some(function(k){return /^g\d/.test(k)})&&M.since<base){M.since=base;Object.keys(M).forEach(function(k){if(/^o\d/.test(k))delete M[k]})}persist()}}
  return M}
function msOffer(L){var M=msState(),k="o"+L;if(M[k])return M[k];var pool=[];try{pool=freePool({slots:/^a_/,basics:false})}catch(e){}
  for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=pool[i];pool[i]=pool[j];pool[j]=t}
  var o=pool.slice(0,3).map(function(it){return it[0]});while(o.length<3)o.push("coins");M[k]=o;persist();return o}
function msCoins(L){return econScaled(Math.max(500,L*40),50)}
function msWaiting(){var M=msState(),lv=effLvl(),out=[];for(var L=MS_FROM;L<=Math.min(lv,100);L+=MS_EVERY){if(!M["g"+L]&&(M.since||0)<L)out.push(L)}return out}
function msHtml(L){var o=msOffer(L);
  return '<div class="card box2 ms-pick"><span class="label">Level '+L+' milestone</span><h3>Choose one</h3><p class="note">One piece is yours to keep. The other two go back on the rack.</p><div class="ms-row">'
    +o.map(function(id,i){if(id==="coins")return '<button class="ms-opt" data-act="mspick" data-l="'+L+'" data-id="coins"><div class="qs-img ms-coin"><i class="coin"></i></div><b>'+msCoins(L).toLocaleString()+' coins</b><small>&nbsp;</small></button>';
      var it=shopItem(id);if(!it)return "";return '<button class="ms-opt" data-act="mspick" data-l="'+L+'" data-id="'+esc(id)+'">'+qsThumb(it)+'<b>'+esc(it[2])+'</b><small>'+esc(freeBrand(it))+'</small></button>'}).join("")
    +'</div><button class="btn ghost" data-act="mclose">Later</button></div>'}
function msOpen(L){/* a held copy (a tour is running, 29zz_v135.js) counts too: it was opened again on every redraw */if(document.querySelector("#layer .modal .ms-pick,#layer .qb-held .ms-pick"))return;modal(msHtml(L))}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=mspick]");if(!b)return;var L=+b.dataset.l,id=b.dataset.id,M=msState();if(M["g"+L])return;
  var got;if(id==="coins"){var c=msCoins(L);S.coins+=c;S.earnedC+=c;got="+"+c+" coins"}else{var it=shopItem(id);if(!it||S.owned[id])return;S.owned[id]=true;got=it[2]+" is in your Closet"}
  M["g"+L]=id;delete M["o"+L];persist();var m=b.closest(".modal");if(m)m.remove();try{qbSnd("coins")}catch(x){}pop(got);render()});
/* after the level-up window, and on any later screen with no window open */
var v33Render=render;render=function(){var r=v33Render.apply(this,arguments);try{if(S&&S.created&&msState().since!=null&&!document.querySelector("#layer .modal")){var w=msWaiting();if(w.length)setTimeout(function(){if(!document.querySelector("#layer .modal"))msOpen(w[0])},400)}}catch(e){}return r};
document.addEventListener("click",function(e){if(!(e.target&&e.target.id==="lvok"))return;setTimeout(function(){try{var w=msWaiting();if(w.length&&!document.querySelector("#layer .modal"))msOpen(w[0])}catch(x){}},350)});

/* ---- the interface: no Companions, no Status displays ---- */
var V33IFX=["pet","hud"];
(function(){var t=setInterval(function(){try{if(typeof loaded==="undefined"||!loaded||!S)return;clearInterval(t);var ch=0;V33IFX.forEach(function(sl){if(S.eq&&S.eq[sl]){delete S.eq[sl];ch=1}});if(ch){persist();render()}}catch(e){}},1000)})();

/* ---- a bigger preview that shows every look: the theme's colours, the frame on your status card, the backdrop and your title.
   The Interface tab shows it with what you wear; each piece's View window shows it with that piece on, before you buy. ---- */
function ifPrev2(){var th=eqItem("theme"),fr=eqItem("frame"),bg=eqItem("bg"),t=eqItem("title"),lv=effLvl();
  var vars=th&&th[6]&&th[6].a?' style="--accent:'+th[6].a+';--accent2:'+th[6].b+'"':'';
  return '<div class="ifp"'+vars+'><div class="ifp-scr">'+(bg?'<div class="bgx '+bg[0]+'"></div>':'')
    +'<div class="ifp-card'+(fr?' f_'+fr[0]:'')+'"><div class="if-ring"><small>LV</small><b>'+lv+'</b></div><div class="ifp-who"><b>'+esc((S.char&&S.char.name)||"You")+'</b>'
    +(t?'<small class="ttlx '+t[0]+'">'+esc(ifTitle(t))+'</small>':'<small>No title</small>')+'</div></div>'
    +'<div class="ifp-quest"><i></i><span>Today&rsquo;s quest</span></div><div class="if-btn">Complete</div></div></div>'}
var v33View=qsViewHtml;qsViewHtml=function(it){var h=v33View.apply(this,arguments);if(!/^(theme|frame|bg|title)$/.test(it[1]))return h;
  var pv='<div class="ifp-view">'+ifWith(it,ifPrev2)+'<small class="note">With this on</small></div>';
  /* the old preview (or thumbnail) is replaced; everything else in the window stays */
  var a=h.indexOf('<div class="qs-mirror if-prev qv-prev">'),b0=h.indexOf('<div class="qv-thumb">');
  if(a>=0){var e=h.indexOf('<p class="note">',a);return h.slice(0,a)+pv+h.slice(e)}
  if(b0>=0){var e2=h.indexOf('<p class="note">',b0);return h.slice(0,b0)+pv+h.slice(e2)}
  return h};
(function(){var st=document.createElement("style");st.textContent=[
  /* the Shop's look hid every backdrop (it keeps the page plain), the thumbnails and previews with them: black cards */
  "body.shopmode .thumb .bgx,body.shopmode .ifp .bgx{display:block!important}",
  ".ifp-wrap{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:14px;align-items:center;margin:14px 0 6px;padding:10px;border-radius:16px;background:rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.08);color:inherit}",
  ".ifp-wrap p{margin:0;font-size:13px;line-height:1.4;color:inherit;opacity:.85}.ifp-wrap p b{display:block;font-size:15px;margin-bottom:4px;opacity:1}",
  /* the stars and the rain are drawn for a whole screen; in a small card they were a few dots on black */
  ".thumb .bgx.bg_stars,.ifp .bgx.bg_stars{background-size:70px 70px}.thumb .bgx.bg_rain,.ifp .bgx.bg_rain{opacity:1;background-size:24px 60px}",
  ".ifp{min-width:0}.ifp-scr{position:relative;overflow:hidden;border-radius:12px;background:var(--bg,#0d0b16);padding:12px;display:flex;flex-direction:column;gap:10px;min-height:170px;isolation:isolate}",
  ".ifp-scr>.bgx{position:absolute;inset:0;z-index:0}",
  ".ifp-card{position:relative;z-index:1;display:flex;gap:10px;align-items:center;padding:10px;border-radius:10px;background:var(--surface,#1a1626);color:var(--fg,#f1edff);min-width:0}",
  ".ifp-card,.ifp-quest{text-align:left}.ifp-who{min-width:0;flex:1}.ifp-who b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ifp-who small{display:block;font-size:11px;color:var(--muted,#a99fc4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".ifp-quest{position:relative;z-index:1;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:var(--surface,#1a1626);color:var(--fg,#f1edff);font-size:12px}",
  ".ifp-quest i{flex:none;width:14px;height:14px;border-radius:4px;border:2px solid var(--accent)}",
  ".ifp .if-btn{white-space:nowrap}",
  ".ifp-view{width:min(320px,100%);margin:0 auto 10px}.ifp-view .ifp-scr{min-height:210px}.ifp-view small{display:block;text-align:center;margin-top:6px}",
  "@media (max-width:420px){.ifp-wrap{grid-template-columns:1fr}.ifp-scr{min-height:150px}}",
  ".ms-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}",
  ".ms-opt{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.15));background:var(--surface,#1a1626);color:var(--fg,#f1edff);min-width:0;cursor:pointer}",
  ".ms-opt:hover{border-color:var(--accent)}.ms-opt .qs-img{width:100%;aspect-ratio:1;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#f6f2ea}.ms-opt .qs-img img{width:100%;height:100%;object-fit:contain}",
  ".ms-opt b{font-size:12px;line-height:1.2;text-align:center;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.ms-opt small{font-size:10px;color:var(--muted,#a99fc4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}",
  ".ms-coin i.coin{width:40px;height:40px}"].join("");document.head.appendChild(st)})();

/* ---- highlights in the Stylist (Cal 11-23: "allow for highlights in the hair as well"): one item per hair colour, slot a_hairhi, worn as
   choice.hairHi (src/look.js tints ROOMS's <b>_<style>hi_* streak layer; all 13 styles have one). Same price as that colour's dye.
   Taking it off in the Wardrobe takes the highlights out. ---- */
(function(){var D=window.QBDATA&&QBDATA.creator;if(!D||!D.hairColors)return;
  if(!SLOTS.some(function(x){return x[0]==="a_hairhi"}))SLOTS.splice(SLOTS.map(function(x){return x[0]}).indexOf("a_hairc")+1,0,["a_hairhi","Highlights"]);
  if(!QS_GROUPS.some(function(x){return x[0]==="a_hairhi"}))QS_GROUPS.splice(QS_GROUPS.map(function(x){return x[0]}).indexOf("a_hairc")+1,0,["a_hairhi","Highlights"]);
  STYLIST.a_hairhi=1;THUMB.a_hairhi=1;
  SHOPTABS.forEach(function(t){if(t[0]==="wardrobe"&&t[2].indexOf("a_hairhi")<0)t[2].splice(t[2].indexOf("a_hairc")+1,0,"a_hairhi")});
  D.hairColors.forEach(function(c){var id="bs_hi_"+c.id;if(SHOP.some(function(x){return x[0]===id}))return;var dye=SHOP.filter(function(x){return x[0]==="bs_dye_"+c.id})[0];
    SHOP.push([id,"a_hairhi",c.label+" Highlights",dye?dye[3]:400,1,"Thin streaks of "+c.label.toLowerCase()+" through your hair.",{basic:{key:"hairHi",id:c.id},b:"basics",swatch:"repeating-linear-gradient(115deg,#3a2f36 0 12px,"+c.swatch+" 12px 17px)"/* streaks, so it never reads as the dye */}])})})();

/* ---- the letter (Cal 11-23: "include the message in their inbox that the testing phase is now over and v1.31 is live with new level
   curves, economy scaling, features, and late game shop items"); the board notice n131 pays the 500 ---- */
PATCHES.push({id:"patch131",d:"2026-11-23",subj:"Update 1.31: testing is over",body:'<p>The testing phase is over. Version 1.31 is live for everyone.</p><ul class="wl">'
  +'<li>A new level curve. The first days move fast, and the late levels take a real day of work each. Your level stayed where it was.</li>'
  +'<li>The economy is rebalanced. Coins come in slower, so everything you own is earned.</li>'
  +'<li>New features: an Upgrades tab, new cuts, dyes and highlights at the Stylist, a reward to pick every 5 levels, and a Reset progress option in your profile.</li>'
  +'<li>Late-game items in the Shop to work toward.</li>'
  +'</ul><p>Thanks for testing with me. Now get after it.</p>'});

/* (the one-time reset of Cal's own save that v1.31 carried is gone: the reboot (29zz_v135.js, QB_EPOCH 7) starts everyone over) */
