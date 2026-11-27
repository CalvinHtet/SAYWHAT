/* ---------- Cal 2026-11-26: banners open at level 5, with a short how-to ----------
   Cal: "Once they reach level 5, let the level up splash screen tell them that they unlocked 5 banners. And there should be a mini
   tutorial that shows them how to equip the banner and where to edit it and see it".
   - The five starter banners (Neon Alley, Crimson Maple, Fireworks Night, Lantern Sky, Blood Moon) open at level 5 (they were open from
     the start). Anyone who already owns one keeps it. The painted tiers still open at 10, 15, 20 ... (29zz_v173.js).
   - Level 5's level-up window says "You unlocked 5 banners for your player card" (29zz_v179.js lists unlocks).
   - A short tour, once, after that level-up and once the Shop is open (banners are bought there): your card (tap it) -> Change banner
     in your profile (tap it) -> preview, buy and Use a banner -> where it shows: your card at the top left, your profile, and the Town
     board when you post your card; change it any time from Change banner. */
var V100LV=5,V100IDS={neon:1,maple:1,fire:1,lantern:1,moon:1};
function v100Gate(){try{(typeof PCBG!=="undefined"?PCBG:[]).forEach(function(b){if(V100IDS[b[0]]&&!(+b[3]>0))b[3]=V100LV})}catch(e){}}
v100Gate();var v100Render=render;render=function(){v100Gate();return v100Render.apply(this,arguments)};
/* the level-up line */
var v100Un=v79Unlocks;v79Unlocks=function(from,lv){v100Gate();var out=v100Un.apply(this,arguments);
  try{if(from<V100LV&&lv>=V100LV){var i=-1;out.forEach(function(t,k){if(i<0&&/^\d+ new banners? in the Shop$/.test(t))i=k});
      if(i>=0){var n=+/^\d+/.exec(out[i])[0],shut=typeof areaGate==="function"&&areaGate("shop");out[i]="You unlocked "+n+" banners for your player card"+(shut?" (in the Shop, once it opens)":"")}}}catch(e){}
  return out};
/* the tour */
try{TOURS.push({id:"banner",ready:function(){return effLvl()>=V100LV&&!(typeof areaGate==="function"&&areaGate("shop"))&&view==="board"&&!!tourVis(".strip .avbtn")},steps:[
  {sel:".strip .avbtn",t:"New: banners",x:"Your player card has a banner behind your character. Tap your card.",tap:1},
  {sel:'#layer [data-act="pcbgs"]',modal:1,t:"Change banner",x:"Your banners live here. Tap Change banner.",tap:1},
  {get sel(){return tourVis('.qshop .pc-bgc:not(.lock):not(.on) [data-act="pctry"]')?'.qshop .pc-bgc:not(.lock):not(.on) [data-act="pctry"]':tourVis('.qshop .pc-bgc [data-act="pcuse"]')?'.qshop .pc-bgc [data-act="pcuse"]':".qshop .pc-bgc"},
   t:"Pick one",x:"Preview shows it on your card. Buy it, then tap Use to put it on. A banner you own just needs Use."},
  {sel:".qshop .pc-prev",t:"Where it shows",x:"Your card at the top left, your profile, and the Town board when you post your card. Change it any time from your profile: Change banner."}]})}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV200={gate:v100Gate,unlocks:function(f,l){return v79Unlocks(f,l)},lv:function(id){return pcLv(id)}};
/* QA run (pets150 on the v1.77 batch): steps 3 and 4 are in the Shop; a player who leaves the Shop part-way (or closes the profile at
   step 2 and the tour moves on to a Shop step) ended up with the tour waiting on the Board, and while a tour runs every new window is
   held (29zz_v135.js), so a level-up, a milestone or the pet's change waited behind it. The tour now ends as soon as its Shop steps are
   not on screen. */
setInterval(function(){try{if(TOUR&&TOUR.id==="banner"&&TOUR.i>=2&&typeof view!=="undefined"&&view!=="shop")tourEnd()}catch(e){}},700);
