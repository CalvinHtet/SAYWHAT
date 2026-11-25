/* ---------- Cal 2026-11-25: the building view, coins only, and the four seasons ----------
   Cal: "Remove the n/hr and as for the weather, let's keep it simple and just do the 4 seasons. If it's in winter ish, there could be snow.
   There may be some Xmas decorations. If it's in the spring, it could be sunny and have flowers blooming around the area in the building
   view. If it's fall, it could be autumn leaves and beautiful orange leaves everywhere."
   - No live weather any more (no fetch, no temperature, no rain or fog): the season sets the sky. Winter (December to February) is soft
     overcast with snow falling, snow on the roofs and drifts on the sidewalk; December adds strings of warm lights along the roofs.
     Spring (March to May) is clear, with petals in the air and flowers blooming along the sidewalk. Summer (June to August) is clear and
     bright. Fall (September to November) is clear and golden, with leaves falling and piled orange along the sidewalk.
   - The line over the view names the season.
   - Rain used to water the Garden and grow it 30% faster; with no rain, the Garden's own sprinklers and lamps do that. */
function v75Season(){var m=+today().slice(5,7);return m===12||m<=2?"winter":m<=5?"spring":m<=8?"summer":"fall"}
function v75Xmas(){return today().slice(5,7)==="12"}
var V75NAME={winter:"Winter",spring:"Spring",summer:"Summer",fall:"Fall"};
lfWeatherInit=function(){var s=v75Season();LFW.src="season";LFW.temp=null;LFW.storm=0;LFW.wx=s==="winter"?"cloud":"sun";LFW.cloud=s==="winter"?.55:s==="fall"?.15:.05;LFW.t=Date.now()};
lfLightLabel=function(){var s=v75Season();return V75NAME[s]+(v75Xmas()?" \u00b7 Holidays":"")};
var v75WxText=lfWxText;lfWxText=function(){return lfLightLabel()};
/* the ground and the roofs */
function v75R(i){var x=Math.sin(i*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
function v75Ground(y,x0,x1){var s=v75Season(),o="";
  if(s==="winter"){o+='<rect x="'+x0+'" y="'+(y-3)+'" width="'+(x1-x0)+'" height="18" rx="9" fill="#f4f8ff" opacity=".95"/>';
    for(var x=x0,i=0;x<x1;x+=90+v75R(i)*70,i++){var w=110+v75R(i+7)*140,h=16+v75R(i+3)*18;o+='<ellipse cx="'+x.toFixed(0)+'" cy="'+(y+2)+'" rx="'+(w/2).toFixed(0)+'" ry="'+h.toFixed(0)+'" fill="#ffffff"/><ellipse cx="'+(x-w*.12).toFixed(0)+'" cy="'+(y-h*.35).toFixed(0)+'" rx="'+(w*.22).toFixed(0)+'" ry="'+(h*.35).toFixed(0)+'" fill="#e3ecfa"/>'}}
  else if(s==="spring"){for(var x2=x0,j=0;x2<x1;x2+=70+v75R(j)*60,j++){var c=["#ff8fb8","#ffd166","#fff3f8","#c79bff","#ff6f91"][j%5],b=x2.toFixed(0);
      o+='<g transform="translate('+b+','+(y+6)+') scale(1.8)"><path d="M-14 0 Q-10 -18 -4 -22 M0 0 Q2 -26 6 -30 M12 0 Q10 -16 16 -20" stroke="#3f8f4e" stroke-width="3" fill="none"/><ellipse cx="-10" cy="-6" rx="10" ry="5" fill="#4fae5f"/><ellipse cx="10" cy="-5" rx="9" ry="4" fill="#5dbb6c"/>'
        +[[-4,-23],[6,-31],[16,-21]].map(function(p,k){return '<g transform="translate('+p[0]+','+p[1]+')">'+[0,72,144,216,288].map(function(a){return '<ellipse rx="3.6" ry="6" cy="-5" fill="'+(k===1?["#ff8fb8","#ffd166","#fff3f8","#c79bff","#ff6f91"][(j+2)%5]:c)+'" transform="rotate('+a+')"/>'}).join("")+'<circle r="2.6" fill="#ffe066"/></g>'}).join("")+'</g>'}}
  else if(s==="fall"){for(var x3=x0,k=0;x3<x1;x3+=70+v75R(k)*60,k++){var w3=70+v75R(k+5)*90;o+='<ellipse cx="'+x3.toFixed(0)+'" cy="'+(y+2)+'" rx="'+(w3/2).toFixed(0)+'" ry="'+(10+v75R(k+9)*9).toFixed(0)+'" fill="'+["#d9631e","#b9411a","#e8952c","#a8571d"][k%4]+'"/>'}
    for(var x4=x0,q=0;x4<x1;x4+=24+v75R(q+11)*30,q++)o+='<ellipse cx="'+x4.toFixed(0)+'" cy="'+(y+14+v75R(q)*90).toFixed(0)+'" rx="11" ry="5" fill="'+["#e0702a","#c2471c","#f2a33a","#9c4a18"][q%4]+'" transform="rotate('+(v75R(q+2)*180).toFixed(0)+' '+x4.toFixed(0)+' '+(y+14+v75R(q)*90).toFixed(0)+')"/>'}
  return o}
function v75Roof(x,y,w){var s=v75Season(),o="";
  if(s==="winter")o+='<path d="M'+(x-4)+' '+(y+4)+' q'+(w/2+4)+' -30 '+(w+8)+' 0 l0 10 q-'+(w/2+4)+' 12 -'+(w+8)+' 0z" fill="#ffffff" opacity=".96"/>';
  if(v75Xmas()){var n=Math.max(4,Math.round(w/60)),d="M"+x+" "+(y+8);for(var i=1;i<=n;i++){var xa=x+w*i/n;d+=" Q"+(xa-w/n/2).toFixed(1)+" "+(y+40)+" "+xa.toFixed(1)+" "+(y+8)}
    o+='<path d="'+d+'" stroke="#2c3a2a" stroke-width="3" fill="none"/>';
    for(var k=0;k<n*2;k++){var t=(k+.5)/(n*2),xb=x+w*t,fr=(t*n)%1,yb=y+8+32*4*fr*(1-fr)*.9+5;o+='<circle class="v75bulb" style="animation-delay:-'+(k%4*.4).toFixed(1)+'s" cx="'+xb.toFixed(1)+'" cy="'+yb.toFixed(1)+'" r="7.5" fill="'+["#ff4d5e","#ffd166","#4de8b0","#6aa8ff"][k%4]+'"/>'}}
  return o}
var v75Facade=worldFacade;worldFacade=function(L){var s=v75Facade.apply(this,arguments);
  try{var bot=LFROOF+L.rows*LFFP,add="";
    /* the building's top edge: each roof cap (14 high) in the building view; each building's top on the street */
    s.replace(/<rect x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="14" rx="3" fill="[^"]*"\/>/g,function(m,x,y,w){add+=v75Roof(+x,+y-4,+w);return m});
    if(LFBSEL==null)bldList().forEach(function(o,n){var x=60+n*(BLDW+BLDGAP),h=o.f*BLDF+160;add+=v75Roof(x,bot-h-6,BLDW)});
    s+='<g class="v75g" pointer-events="none">'+add+v75Ground(bot,-600,LFWW+600)+'</g>'}catch(e){}
  return s};
/* a building's painted backdrop in its season: bld_bg_<id>_<season>.webp (ROOMS), else the one painting as before */
var v75Bg=bldBgArt;bldBgArt=function(id){try{var n="bld_bg_"+id+"_"+v75Season()+".webp",D=QBLoft.data,u=(window.QBART&&QBART[n])||(D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:null);if(u)return u}catch(e){}return v75Bg.apply(this,arguments)};
/* what falls through the air, over the whole view */
function v75Air(){var s=v75Season();if(s==="summer")return "";var n=s==="winter"?34:18,h="";
  for(var i=0;i<n;i++){var L=(v75R(i+1)*100).toFixed(1),d=(s==="winter"?7:9)+v75R(i+4)*6,dl=-(v75R(i+8)*d),sz=s==="winter"?2+v75R(i)*3.5:6+v75R(i)*5;
    h+='<i style="left:'+L+'%;width:'+sz.toFixed(1)+'px;height:'+(s==="winter"?sz:sz*.55).toFixed(1)+'px;animation-duration:'+d.toFixed(1)+'s,'+(2.6+v75R(i+3)*2).toFixed(1)+'s;animation-delay:'+dl.toFixed(1)+'s,'+dl.toFixed(1)+'s;--c:'+(s==="winter"?"#fff":s==="spring"?["#ffb3cf","#fff0f6","#ffd6e6"][i%3]:["#e0702a","#c2471c","#f2a33a"][i%3])+'"></i>'}
  return '<div class="v75air v75-'+s+'" aria-hidden="true">'+h+'</div>'}
var v75Html=lfHtml;lfHtml=function(){var h=v75Html.apply(this,arguments);try{h=h.replace('<div class="lfwxb mono" id="lfwxb">',v75Air()+'<div class="lfwxb mono" id="lfwxb">')}catch(e){}return h};
htabCss("qb-v175-css",".lfwrap{position:relative}.v75air{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}"
  +".v75air i{position:absolute;top:-20px;border-radius:50%;background:var(--c);opacity:.9;animation-name:v75fall,v75sway;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-direction:normal,alternate}"
  +".v75-winter i{box-shadow:0 0 4px rgba(255,255,255,.8)}.v75-spring i,.v75-fall i{border-radius:60% 0 60% 0}"
  +"@keyframes v75fall{to{top:105%}}@keyframes v75sway{from{margin-left:-14px;transform:rotate(-30deg)}to{margin-left:14px;transform:rotate(40deg)}}"
  +".v75bulb{animation:v75tw 1.6s ease-in-out infinite}@keyframes v75tw{0%,100%{opacity:1}50%{opacity:.35}}"
  +"@media (prefers-reduced-motion:reduce){.v75air{display:none}.v75bulb{animation:none}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV175={season:v75Season,xmas:v75Xmas};
