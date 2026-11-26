/* ---------- Cal 2026-11-25: a level-up says what it unlocked ----------
   Cal: "When i level up, I want to see what I unlocked. If I unlocked the pet, make sure you put that in the level up banner. If i
   unlocked 5 more banners, make sure you include that as well in the level up banner so I am not wondering if i unlocked something
   important". For each level reached in this level-up, the window adds a line for: the Pet Store (PETLV), a new set of banners (the
   painted ones that open at that level, 29zz_v152.js / 29zz_v173.js), and a new interface effect (FX, in the Shop's Interface, Effects). */
function v79Unlocks(from,lv){var out=[];
  for(var L=from+1;L<=lv;L++){
    try{if(typeof PETLV!=="undefined"&&L===PETLV)out.push("The Pet Store is open")}catch(e){}
    try{var n=PCBG.filter(function(b){return b[3]===L&&typeof pcHas==="function"&&pcHas(b[0])}).length;if(n)out.push(n+" new banner"+(n>1?"s":"")+" in the Shop")}catch(e){}
    try{(typeof FX!=="undefined"?FX:[]).forEach(function(f){if(f[0]===L&&!(typeof V61DEAD!=="undefined"&&V61DEAD[f[1]]))out.push("New effect: "+f[2])})}catch(e){}}
  return out}
var v79Lv=levelUp;levelUp=function(lv,extra,from){var f=(from==null)?lv-1:from,had=document.getElementById("lvok");var r=v79Lv.apply(this,arguments);
  try{var b=document.getElementById("lvok");if(b&&b!==had){var U=v79Unlocks(f,lv);if(U.length)b.insertAdjacentHTML("beforebegin",U.map(function(t,i){return '<div class="reward reveal v79u" style="animation-delay:'+(0.2+i*0.35).toFixed(2)+'s"><span>'+esc(t)+'</span></div>'}).join(""))}}catch(e){}
  return r};
htabCss("qb-v179-css",".reward.v79u{border-color:#ffd56b;color:#ffe3a1}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV179={unlocks:v79Unlocks,show:function(lv){levelUp(lv,null,lv-1)}};
