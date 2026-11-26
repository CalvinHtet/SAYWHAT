/* ---------- Cal 2026-11-25: every banner breathes, in an 8 second loop ----------
   Cal: "I would like all the banners to have an 8 second perfect looping animation that is very subtle such as wind blowing subtly in the
   back, or the stars glistening, or something sparkling. Is this possible for you to create a perfect loop that does not look like it keeps
   restarting everytime it loops?"
   A layer of light over the painting, under the character, picked to suit each banner (V77FX): stars that twinkle, glints that sparkle,
   mist that drifts, snow, petals or leaves that fall, embers or bubbles that rise, a slow sheen of light. Every motion lasts exactly
   8 seconds and ends where it began (a band slides exactly one tile; a flake falls the full height and the next takes its place; a
   twinkle returns to its first brightness), and each piece starts at its own point in the cycle, so nothing visibly restarts.
   On the cards people look at closely: the Board's header card, the profile's banner, the big card, the Shop's preview. The Shop's grid
   of small banners stays still, so a long list does not run dozens of loops. Reduced motion: still. */
var V77FX={neon:["sheen","sparkle"],maple:["leaves"],fire:["embers"],lantern:["embers","stars"],moon:["stars","mist"],orrery:["stars","sparkle"],
  tidal:["sheen","bubbles"],aurora:["sheen","stars"],hoard_ink:["sparkle","mist"],sky_paper:["stars","mist"],ink_peaks:["mist"],papercut:["mist","sparkle"],
  ink_bamboo:["mist"],paper_village:["stars","mist"],ink_lake:["mist","sparkle"],ink_storm:["mist","sheen"],paper_abyss:["bubbles","sheen"],
  paper_city:["stars"],ink_snow:["snow"],glass_midnight:["stars","sheen"]};
function v77R(i){var x=Math.sin(i*57.31+11.7)*43758.5453;return x-Math.floor(x)}
function v77Layer(kind,seed){var h="",i,n;
  if(kind==="stars"){for(i=0;i<16;i++)h+='<i style="left:'+(4+v77R(seed+i)*92).toFixed(1)+'%;top:'+(3+v77R(seed+i+40)*50).toFixed(1)+'%;animation-delay:-'+(v77R(seed+i+80)*8).toFixed(2)+'s"></i>';return '<span class="v77 v77stars">'+h+'</span>'}
  if(kind==="sparkle"){for(i=0;i<6;i++)h+='<i style="left:'+(8+v77R(seed+i)*84).toFixed(1)+'%;top:'+(8+v77R(seed+i+20)*70).toFixed(1)+'%;animation-delay:-'+(i*8/6+v77R(seed+i+5)*.6).toFixed(2)+'s"></i>';return '<span class="v77 v77spark">'+h+'</span>'}
  if(kind==="mist")return '<span class="v77 v77mist"><i class="m1"></i><i class="m2"></i></span>';
  if(kind==="sheen")return '<span class="v77 v77sheen"><i></i></span>';
  n=kind==="snow"?22:kind==="leaves"?9:kind==="embers"?12:10;
  for(i=0;i<n;i++)h+='<i style="left:'+(3+v77R(seed+i)*94).toFixed(1)+'%;animation-delay:-'+(i*8/n+v77R(seed+i+3)*(8/n)).toFixed(2)+'s,-'+(v77R(seed+i+9)*8).toFixed(2)+'s"></i>';
  return '<span class="v77 v77'+kind+'">'+h+'</span>'}
function v77Html(bg){var L=V77FX[bg]||(bg&&bg!=="studio"?["stars","sparkle"]:null);if(!L)return "";var s=0;for(var i=0;i<bg.length;i++)s+=bg.charCodeAt(i);
  return '<span class="v77fx" aria-hidden="true">'+L.map(function(k,j){return v77Layer(k,s+j*31)}).join("")+'</span>'}
/* which cards: the header's, the profile's banner, the big card and the Shop's preview */
var V77SEL=".strip .avbtn.pcav,.v61ban .pcard,#layer .pcm .pcard,.pc-prev .pcard,#layer .v74chest .pcard";
function v77Scan(){try{[].forEach.call(document.querySelectorAll(V77SEL),function(el){var m=/\bpc-([a-z0-9_]+)\b/.exec(el.className),bg=m?m[1]:"";if(el.getAttribute("data-v77")===bg)return;
      var old=el.querySelector(":scope>.v77fx");if(old)old.remove();el.setAttribute("data-v77",bg);var h=v77Html(bg);if(h)el.insertAdjacentHTML("afterbegin",h)})}catch(e){}}
var V77T=0;function v77Soon(){if(V77T)return;V77T=setTimeout(function(){V77T=0;v77Scan()},80)}
try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++)if(ms[i].addedNodes&&ms[i].addedNodes.length){v77Soon();return}}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
htabCss("qb-v177-css",".v77fx{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;border-radius:inherit}.avbtn.pcav>.pc-stage,.pcard>.pc-stage{z-index:1}.pcard>.pc-plate{z-index:2}"
  +".v77{position:absolute;inset:0}.v77 i{position:absolute;display:block}"
  /* stars: each returns to its first brightness at 8 s */
  +".v77stars i{width:2px;height:2px;border-radius:50%;background:#fff;box-shadow:0 0 4px 1px rgba(255,255,255,.8);opacity:.25;animation:v77tw 8s ease-in-out infinite}"
  +"@keyframes v77tw{0%,100%{opacity:.18;transform:scale(.7)}50%{opacity:1;transform:scale(1.25)}}"
  /* sparkle: a four-point glint, once per cycle each, at its own beat */
  +".v77spark i{width:12px;height:12px;margin:-6px 0 0 -6px;opacity:0;background:radial-gradient(closest-side,#fff,rgba(255,255,255,0)) center/3px 3px no-repeat,linear-gradient(90deg,transparent 45%,rgba(255,248,220,.95) 50%,transparent 55%),linear-gradient(0deg,transparent 45%,rgba(255,248,220,.95) 50%,transparent 55%);animation:v77gl 8s ease-in-out infinite}"
  +"@keyframes v77gl{0%,14%,100%{opacity:0;transform:scale(.3) rotate(0)}6%{opacity:1;transform:scale(1) rotate(45deg)}}"
  /* mist: a band of soft cloud, slid exactly one tile per 8 s (the second band, two tiles the other way) */
  +".v77mist i{left:0;right:0;height:46%;bottom:8%;opacity:.32;filter:blur(3px);background:radial-gradient(60px 18px at 30px 60%,rgba(255,255,255,.9),transparent 70%),radial-gradient(80px 22px at 120px 40%,rgba(255,255,255,.7),transparent 70%);background-size:160px 100%;animation:v77drift 8s linear infinite}"
  +".v77mist .m2{bottom:30%;height:34%;opacity:.2;background-size:240px 100%;animation-name:v77drift2}"
  +"@keyframes v77drift{from{background-position:0 0}to{background-position:160px 0}}@keyframes v77drift2{from{background-position:0 0}to{background-position:-480px 0}}"
  /* sheen: a slow diagonal light, off the card for the last half of the cycle */
  +".v77sheen i{top:-30%;bottom:-30%;width:45%;left:0;background:linear-gradient(100deg,transparent,rgba(255,255,255,.16) 45%,rgba(255,255,255,.28) 50%,rgba(255,255,255,.16) 55%,transparent);mix-blend-mode:screen;animation:v77sw 8s ease-in-out infinite}"
  +"@keyframes v77sw{0%{transform:translateX(-120%) skewX(-12deg)}45%,100%{transform:translateX(260%) skewX(-12deg)}}"
  /* what falls or rises: the whole height in 8 s, spread evenly, so the field is the same at 0 s and 8 s */
  +".v77snow i{top:-4%;width:3px;height:3px;border-radius:50%;background:#fff;opacity:.85;box-shadow:0 0 3px rgba(255,255,255,.9);animation:v77fall 8s linear infinite,v77sway 8s ease-in-out infinite}"
  +".v77leaves i{top:-6%;width:8px;height:5px;border-radius:60% 0 60% 0;background:#e0702a;opacity:.85;animation:v77fall 8s linear infinite,v77spin 8s linear infinite}.v77leaves i:nth-child(3n){background:#c2471c}.v77leaves i:nth-child(3n+1){background:#f2a33a}"
  +".v77embers i{bottom:-4%;width:3px;height:3px;border-radius:50%;background:#ffb347;box-shadow:0 0 5px 2px rgba(255,140,40,.8);animation:v77rise 8s linear infinite,v77sway 8s ease-in-out infinite}"
  +".v77bubbles i{bottom:-4%;width:5px;height:5px;border-radius:50%;border:1px solid rgba(220,250,255,.75);animation:v77rise 8s linear infinite,v77sway 8s ease-in-out infinite}"
  +"@keyframes v77fall{from{top:-6%}to{top:104%}}@keyframes v77rise{from{bottom:-6%;opacity:0}10%{opacity:.9}90%{opacity:.9}to{bottom:104%;opacity:0}}"
  +"@keyframes v77sway{0%,100%{margin-left:-6px}50%{margin-left:6px}}@keyframes v77spin{0%{margin-left:-8px;transform:rotate(0)}50%{margin-left:8px;transform:rotate(180deg)}100%{margin-left:-8px;transform:rotate(360deg)}}"
  +"@media (prefers-reduced-motion:reduce){.v77fx{display:none}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV177={fx:V77FX,scan:v77Scan,html:v77Html};
