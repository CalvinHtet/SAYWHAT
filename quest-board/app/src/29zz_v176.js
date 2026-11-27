/* ---------- Cal 2026-11-25: the Timekeeper's later prizes, animated on the player card ----------
   Cal: "a ring that causes your character to have an emanating aura that constantly moves like a perfect gif loop in your profile picture
   and your banner", "something that causes white and black lightning to crackle out of your body in a very aesthetic way. All these items
   should have different animations so they are unique."
   - Keeper's Ring (px_ring, Chapter 2): an aura shaped like the character itself. A clean silhouette is cut from the figure's picture
     (alpha over a threshold, so the frame's faint pixels never show), and two layers of moving light are seen through it, a little
     larger than the figure and blurred, so they rise off its edges. Each layer's light is a repeating band that slides exactly one band
     in 8 seconds: the loop has no seam.
   - Silent Storm (px_storm, Chapter 3): jagged bolts, white and black, branching off the figure's outline. Each bolt flashes on its
     own beats inside one 8 second cycle (keyframes, so the cycle ends exactly where it began), plus a faint white and black flicker
     around the silhouette.
   Both sit on the card wherever it is drawn (pcHtml, the Board's header card), as the halo does (29zz_v174.js), and stop moving under
   reduced motion. */
var V76MASK={};
function v76Mask(im){try{var u0=im.currentSrc||im.src,key=u0&&u0.length>200?u0.length+":"+u0.slice(-64):u0;if(!key||!im.complete||!im.naturalWidth)return null;if(V76MASK[key])return V76MASK[key];
    var w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,512/Math.max(w,h)),cw=Math.max(1,Math.round(w*k)),ch=Math.max(1,Math.round(h*k)),c=document.createElement("canvas");c.width=cw;c.height=ch;
    var x=c.getContext("2d",{willReadFrequently:true});x.drawImage(im,0,0,cw,ch);var d=x.getImageData(0,0,cw,ch),a=d.data;for(var i=0;i<a.length;i+=4){var on=a[i+3]>60;a[i]=a[i+1]=a[i+2]=255;a[i+3]=on?255:0}x.putImageData(d,0,0);
    var u=c.toDataURL("image/png"),ks=Object.keys(V76MASK);if(ks.length>40)delete V76MASK[ks[0]];return V76MASK[key]=u}catch(e){return null}}
function v76R(i){var x=Math.sin(i*91.17+7.3)*43758.5453;return x-Math.floor(x)}
/* bolts in a 100 x 100 box (the figure's drawn box), from its outline outwards */
function v76Bolts(){var o="",n=9;for(var b=0;b<n;b++){var side=b%2?1:-1,y0=12+v76R(b)*70,x0=side>0?70+v76R(b+3)*8:30-v76R(b+3)*8,pts=[[x0,y0]],len=4+Math.floor(v76R(b+5)*3);
    for(var s=1;s<=len;s++){var p=pts[s-1];pts.push([p[0]+side*(5+v76R(b*7+s)*7),p[1]+(v76R(b*5+s)-.5)*14])}
    var d="M"+pts.map(function(p){return p[0].toFixed(1)+" "+p[1].toFixed(1)}).join(" L"),br=pts[2],bd="M"+br[0].toFixed(1)+" "+br[1].toFixed(1)+" l"+(side*6).toFixed(1)+" "+(8+v76R(b)*6).toFixed(1)+" l"+(side*4).toFixed(1)+" 4";
    var dark=b%3===1,dl=-(b*8/n+v76R(b+9)*.6).toFixed(2);
    o+='<g class="v76bolt'+(dark?' dk':'')+'" style="animation-delay:'+dl+'s"><path d="'+d+'"/><path d="'+bd+'"/></g>'}
  return '<svg class="v76storm" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+o+'</svg>'}
function v76Layers(fx){if(fx==="px_ring")return '<span class="v76aura v76ring" aria-hidden="true"><i class="a3"></i><i class="a2"></i><i class="a1"></i></span>';
  if(fx==="px_storm")return '<span class="v76aura v76st" aria-hidden="true"><i class="s1"></i><i class="s2"></i></span>'+v76Bolts();return ""}
var v76Wear=v74Wear;v74Wear=function(h,fx){if(fx!=="px_ring"&&fx!=="px_storm")return v76Wear.apply(this,arguments);
  return h.replace('<span class="fsh-fig pc-fig">','<span class="fsh-fig pc-fig v76on" data-fx="'+fx+'">'+v76Layers(fx))};
/* the layers cover the figure's picture exactly; the bolts cover its drawn box */
function v76Place(im){try{var f=im.closest(".pc-fig.v76on");if(!f)return;var R=im.getBoundingClientRect(),F=f.getBoundingClientRect();if(R.height<10)return;var m=v76Mask(im);
    [].forEach.call(f.querySelectorAll(".v76aura"),function(a){a.style.left=(R.left-F.left).toFixed(1)+"px";a.style.top=(R.top-F.top).toFixed(1)+"px";a.style.width=R.width.toFixed(1)+"px";a.style.height=R.height.toFixed(1)+"px";
      if(m){[].forEach.call(a.querySelectorAll("i"),function(i){i.style.webkitMaskImage=i.style.maskImage='url("'+m+'")'})}});
    var sv=f.querySelector(".v76storm"),b=v64Box(im);if(sv&&b){sv.style.left=(R.left-F.left+b[0]*R.width).toFixed(1)+"px";sv.style.top=(R.top-F.top+b[1]*R.height).toFixed(1)+"px";sv.style.width=((b[2]-b[0])*R.width).toFixed(1)+"px";sv.style.height=((b[3]-b[1])*R.height).toFixed(1)+"px"}}catch(e){}}
document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.classList&&t.classList.contains("calp")&&t.closest&&t.closest(".pc-fig.v76on"))v76Place(t)},true);
var v76Render=render;render=function(){var r=v76Render.apply(this,arguments);setTimeout(function(){[].forEach.call(document.querySelectorAll(".pc-fig.v76on img.calp"),v76Place)},60);return r};
/* the chest: the prize on its own, before it is worn */
var v76Stage=v74Stage;v74Stage=function(id){if(id==="px_ring")return '<span class="v76show v76ringshow"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="v76rg"><stop offset="0" stop-color="#d9fbff"/><stop offset="1" stop-color="#7b5cff"/></radialGradient></defs><ellipse cx="50" cy="62" rx="22" ry="9" fill="none" stroke="url(#v76rg)" stroke-width="4"/><ellipse cx="50" cy="62" rx="22" ry="9" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/></svg><i class="r1"></i><i class="r2"></i><i class="r3"></i></span>';
  if(id==="px_storm")return '<span class="v76show v76stshow"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M38 70 Q50 40 64 68 Q52 80 38 70z" fill="#0c0c12" stroke="#fff" stroke-width="1.2"/><path d="M44 66 Q51 58 58 66" stroke="#fff" stroke-width="1.6" fill="none"/></svg>'+v76Bolts()+'</span>';
  return v76Stage.apply(this,arguments)};
htabCss("qb-v176-css",".pc-fig.v76on{position:relative;isolation:isolate}.pc-fig.v76on>img.calp{position:relative;z-index:1}"
  +".v76aura{position:absolute;z-index:0;pointer-events:none}.v76aura i{position:absolute;inset:0;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;transform-origin:50% 75%}"
  /* the ring: violet and pale cyan light rising off the figure, a band of 48 px sliding up exactly one band per 8 s */
  +".v76ring .a1{transform:scale(1.025);filter:blur(2px);opacity:.9;background:repeating-linear-gradient(0deg,rgba(170,140,255,0) 0,rgba(170,140,255,.9) 16px,rgba(225,252,255,1) 24px,rgba(170,140,255,.9) 32px,rgba(170,140,255,0) 48px);background-size:100% 48px;animation:v76up 8s linear infinite}"
  +".v76ring .a2{transform:scale(1.06);filter:blur(6px);opacity:.85;background:repeating-linear-gradient(0deg,rgba(110,80,255,.15) 0,rgba(130,100,255,.95) 22px,rgba(170,240,255,.9) 32px,rgba(110,80,255,.15) 64px);background-size:100% 64px;animation:v76up2 8s linear infinite}"
  +".v76ring .a3{transform:scale(1.1);filter:blur(13px);opacity:.55;background:repeating-linear-gradient(0deg,rgba(80,50,200,.2) 0,rgba(120,90,255,.8) 40px,rgba(80,50,200,.2) 80px);background-size:100% 80px;animation:v76up3 8s linear infinite}"
  +"@keyframes v76up3{from{background-position:0 0}to{background-position:0 -80px}}"
+"@keyframes v76up{from{background-position:0 0}to{background-position:0 -48px}}@keyframes v76up2{from{background-position:0 0}to{background-position:0 -128px}}"
  /* the storm: a white and a dark rim that flicker on the beat */
  +".v76st .s1{transform:scale(1.06);filter:blur(1.5px);background:#fff;opacity:0;animation:v76flk 8s steps(1,end) infinite}.v76st .s2{transform:scale(1.11);filter:blur(3px);background:#000;opacity:0;animation:v76flk 8s steps(1,end) -4.1s infinite}"
  +"@keyframes v76flk{0%,100%{opacity:.15}6%{opacity:.85}8%{opacity:.25}31%{opacity:.7}33%{opacity:.15}58%{opacity:.8}60%{opacity:.2}82%{opacity:.65}84%{opacity:.15}}"
  +".v76storm{position:absolute;z-index:2;pointer-events:none;overflow:visible}.v76bolt{opacity:0;animation:v76zap 8s linear infinite}.v76bolt path{fill:none;stroke:#fff;stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px rgba(200,220,255,.9))}"
  +".v76bolt.dk path{stroke:#07070c;stroke-width:2.4;filter:drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 4px rgba(255,255,255,.7))}"
  +"@keyframes v76zap{0%,100%{opacity:0}1%{opacity:1}2.5%{opacity:.25}4%{opacity:1}8%{opacity:0}46%{opacity:0}47%{opacity:.9}49%{opacity:.2}50%{opacity:1}53%{opacity:0}}"
  +".v76show{position:absolute;inset:0;display:block}.v76show svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}"
  +".v76ringshow i{position:absolute;left:28%;right:28%;bottom:32%;height:40%;border-radius:50% 50% 45% 45%;background:repeating-linear-gradient(0deg,rgba(150,120,255,0) 0,rgba(150,120,255,.6) 14px,rgba(210,250,255,.8) 24px,rgba(150,120,255,0) 48px);background-size:100% 48px;filter:blur(6px);animation:v76up 8s linear infinite;opacity:.8}"
  +".v76ringshow .r2{left:20%;right:20%;height:55%;filter:blur(12px);opacity:.55}.v76ringshow .r3{left:36%;right:36%;height:70%;filter:blur(3px);opacity:.5}"
  +".v76stshow .v76storm{left:25%;top:25%;width:50%;height:50%}"
  +"@media (prefers-reduced-motion:reduce){.v76aura i,.v76bolt,.v76ringshow i{animation:none}.v76bolt{opacity:.6}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV176={mask:v76Mask,place:function(){[].forEach.call(document.querySelectorAll(".pc-fig.v76on img.calp"),v76Place)}};
