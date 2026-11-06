/* ---------- screens that are switched on ----------
   Monitors, menu boards and showtimes play something. Everything here is SVG and CSS
   (classes scr* in index.html), so it costs almost nothing and needs no art. */
var SCRN=0;
function scrBox(W,H,inner,bg){var id="scrc"+(++SCRN);return '<clipPath id="'+id+'"><rect width="'+W+'" height="'+H+'"/></clipPath><g clip-path="url(#'+id+')"><rect width="'+W+'" height="'+H+'" fill="'+(bg||"#0b0d16")+'"/>'+inner+'</g>'}
function scrFrame(W,H,inner,col){return '<rect x="-3" y="-3" width="'+(W+6)+'" height="'+(H+6)+'" rx="2" fill="'+(col||"#14141a")+'" stroke="'+LFOL+'" stroke-width=".8"/>'+inner}
/* three pages taking turns, 12 seconds around */
function scrPages(pages){return pages.slice(0,3).map(function(p,i){return '<g class="scrS" style="animation-delay:'+(i*4)+'s">'+p+'</g>'}).join("")}
function scrTxt(x,y,t,sz,col,anchor,w){return '<text x="'+x+'" y="'+y+'" font-size="'+sz+'" font-weight="'+(w||700)+'" font-family="Arial,sans-serif" fill="'+col+'"'+(anchor?' text-anchor="'+anchor+'"':'')+'>'+esc(t)+'</text>'}
function scrTicker(W,y,t,col){return '<g class="scrT"><text x="'+W+'" y="'+y+'" font-size="6" font-weight="700" font-family="Arial,sans-serif" fill="'+col+'">'+esc(t)+'</text></g>'}
/* the Restaurant's menu, on rotation */
function scrMenu(items,W,H){var pages=[[],[],[]],h=function(s){var n=0;for(var i=0;i<s.length;i++)n=(n*31+s.charCodeAt(i))>>>0;return n};
  items.slice(-12).forEach(function(m,i){pages[i%3].push(m)});
  var heads=["TODAY","FRESH","HOUSE"],cols=["#ffcf6a","#9dffb4","#ff9ec4"];
  return scrFrame(W,H,scrBox(W,H,scrPages(pages.map(function(p,pi){return scrTxt(W/2,11,heads[pi],8.5,cols[pi],"middle",800)+'<rect x="8" y="14" width="'+(W-16)+'" height=".8" fill="'+cols[pi]+'" opacity=".6"/>'+p.slice(0,4).map(function(m,i){return scrTxt(7,24+i*9.5,m,6.6,"#f3f0ff")+scrTxt(W-7,24+i*9.5,"$"+(6+h(m)%14),6.6,cols[pi],"end")}).join("")}))))}
/* the Movie Theater's showtimes and ticker */
function scrShowtimes(W,H,films,snacks){var cols=["#ffd27a","#9fe0ff","#ff9ec4"],times=[["1:30","4:15","7:00"],["2:10","5:05","8:30"],["3:00","6:20","9:45"]];
  return scrFrame(W,H,scrBox(W,H,scrPages(films.slice(0,3).map(function(f,i){return scrTxt(W/2,10,"NOW SHOWING",6,"#fff","middle",800)+scrTxt(W/2,23,f,10,cols[i],"middle",800)+times[i].map(function(t,j){return '<rect x="'+(W/2-37+j*26)+'" y="28" width="22" height="10" rx="2" fill="rgba(255,255,255,.14)"/>'+scrTxt(W/2-26+j*26,35.5,t,6.2,"#fff","middle")}).join("")}))+'<rect y="'+(H-9)+'" width="'+W+'" height="9" fill="#000" opacity=".5"/>'+scrTicker(W,H-2.5,snacks,"#ffd27a")),"#1a1014")}
function thBoard(C,u,z,H){var snacks=TH_UPS.filter(function(x){return H(x[0])&&x[3].menu}).map(function(x){return x[3].menu}).concat(["Tickets on sale now","Please silence your phone"]).join("   *   ");
  C.walls.push(lfFaceY(u,0,122,scrShowtimes(LF.U*3.8,50,LFFILMS.slice(0,3),snacks)))}
function scrTrailer(C,W,H){return scrFrame(W,H,scrBox(W,H,lfToon(C.uid+"t",W,H)))}
/* where a sprite's image lands, the same sums lfSpr4 does */
function scrSp4Box(k,x,y,w,d,o){var Sp=LFSP4[k],a=lfP(x+w,y+d,0),W=(w+d)*LF.sx*(o.sc||1),Hh=W*Sp.h/Sp.w,bxo=W/2;
  if(o.fit&&Sp.bl!=null){var bl=Sp.bl,br=Sp.br;if(br-bl<.6){bl=0;br=1}var kf=((w+d)*LF.sx*(o.sc||1))/((br-bl)*Sp.w);W=Sp.w*kf;Hh=Sp.h*kf;bxo=o.flip?br*W-LF.sx*w:LF.sx*w+bl*W}
  return {ax:a[0]+(o.ax||0),ay:a[1]+(o.dy||0),fx:o.flip?-1:1,x0:-bxo,y0:-Hh,W:W,H:Hh}}
/* paints a w by h picture onto a screen. tl, tr and bl are fractions of the sprite image */
function scrMap(b,tl,tr,bl,w,h,inner){var pt=function(f){return [b.x0+f[0]*b.W,b.y0+f[1]*b.H]},A=pt(tl),B=pt(tr),L=pt(bl);
  return '<g transform="translate('+b.ax.toFixed(1)+','+b.ay.toFixed(1)+') scale('+b.fx+',1)"><g transform="matrix('+((B[0]-A[0])/w).toFixed(4)+','+((B[1]-A[1])/w).toFixed(4)+','+((L[0]-A[0])/h).toFixed(4)+','+((L[1]-A[1])/h).toFixed(4)+','+A[0].toFixed(2)+','+A[1].toFixed(2)+')">'+inner+'</g></g>'}
function scrCode(w,h){var s='',R=lfSeed(5),cs=["#7dd3fc","#a5f3a0","#fcd34d","#f0abfc","#e5e7eb"];for(var i=0;i<26;i++){var ind=Math.floor(R()*3)*7,len=14+R()*60;s+='<rect x="'+(6+ind)+'" y="'+(i*5.2)+'" width="'+len.toFixed(0)+'" height="2.6" rx="1" fill="'+cs[Math.floor(R()*5)]+'" opacity=".9"/>'}
  return scrBox(w,h,'<g class="scrU">'+s+s.replace(/y="([\d.]+)"/g,function(_,v){return 'y="'+(+v+135.2)+'"'})+'</g>','#111827')}
function scrGame(w,h){var R=lfSeed(9),hills='',stars='',coins='';for(var i=0;i<14;i++){var hh=8+R()*18;hills+='<rect x="'+(i*24)+'" y="'+(h-hh)+'" width="22" height="'+hh.toFixed(0)+'" fill="#3b1d6e"/>'}
  for(var k=0;k<20;k++)stars+='<circle class="scrB" style="animation-delay:-'+(Math.floor(R()*4)*.5).toFixed(1)+'s" cx="'+(R()*w).toFixed(0)+'" cy="'+(R()*h*.6).toFixed(0)+'" r=".8" fill="#fff"/>';
  for(var c=0;c<6;c++)coins+='<circle cx="'+(c*56+30)+'" cy="'+(h-34)+'" r="3" fill="#ffd34d"/>';
  return scrBox(w,h,stars+'<g class="scrL">'+hills+hills.replace(/x="(\d+)"/g,function(_,v){return 'x="'+(+v+336)+'"'})+'</g><g class="scrL2">'+coins+coins.replace(/cx="(\d+)"/g,function(_,v){return 'cx="'+(+v+336)+'"'})+'</g><g class="scrJ"><rect x="34" y="'+(h-20)+'" width="9" height="11" rx="2" fill="#7df9ff"/><rect x="38" y="'+(h-18)+'" width="3" height="3" fill="#0b0d16"/></g><rect y="'+(h-9)+'" width="'+w+'" height="9" fill="#ff4fa3"/>','#1a0b3a')}
function scrEq(w,h){var s='',R=lfSeed(3);for(var i=0;i<14;i++)s+='<rect class="scrE" style="animation-delay:-'+(R()*1.2).toFixed(2)+'s;transform-origin:'+(i*w/14+w/28).toFixed(1)+'px '+h+'px" x="'+(i*w/14+1.5).toFixed(1)+'" y="'+(h*.2).toFixed(0)+'" width="'+(w/14-3).toFixed(1)+'" height="'+(h*.8).toFixed(0)+'" fill="'+(i%3?"#58d6ff":"#ff7ad8")+'"/>';return scrBox(w,h,s,'#0f1320')}
/* the Bedroom desk */
var SCRPC={bd4_desk1:{tl:[.428,.022],tr:[.746,.143],bl:[.428,.225],w:120,h:70,f:scrEq},bd4_pc1:{tl:[.194,.281],tr:[.525,.050],bl:[.194,.630],w:160,h:130,f:scrCode},bd4_pc2:{tl:[.177,.410],tr:[.585,.129],bl:[.177,.691],w:200,h:80,f:scrGame}};
function scrPc(C,k,x,y,w,d,o){var Q=SCRPC[k];if(!Q||!window.LFSP4||!LFSP4[k])return;var b=scrSp4Box(k,x,y,w,d,o);C._lb=null;C.add(x+w+y+d-(o.dk||0)+.002,scrMap(b,Q.tl,Q.tr,Q.bl,Q.w,Q.h,Q.f(Q.w,Q.h)))}
