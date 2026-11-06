/* ---------- the world: three buildings, doors between rooms, and a room builder ----------
   Home, Business and Entertainment stand side by side on one street. A room's spot is one
   line in ROOMCELL. Most rooms open from an upgrade in the room next to them and connect by
   a glowing door with a floating arrow. New rooms are data: see roomDef and 27_rooms.js. */
var BLD=[{id:"loft",name:"The Loft",ac:"#b9a7ff"},{id:"plaza",name:"Kode Plaza",ac:"#ffb066"},{id:"mall",name:"Calibur Mall",ac:"#ff6a9a"}];
/* Cal, 2026-11-05: the street shows each building from outside; tap one to go in. Only the building you are in draws its
   rooms, people and animations, so the rest cost nothing. null = the street. Painted exteriors are art/app/bld_<id>.webp
   (ROOMS); until they exist a plain lit facade stands in. */
var LFBSEL=null;
function bldArt(id){var n="bld_"+id+".webp",D=QBLoft.data;return (window.QBART&&QBART[n])||(D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:null)}
/* The street: one front per building, all the same size, side by side on the same pavement as the rooms' street.
   Only buildings that have a room show. Its own width (STREETW), so a phone sees all three. */
var BLDW=700,BLDGAP=150,BLDF=420;
function bldList(){return BLD.map(function(d,bi){var f=0,any=S.base.slots.some(function(r){var q=r&&ROOMCELL[r.t];if(q&&q[0]===bi){f=Math.max(f,q[2]+1);return true}return false});return any?{bi:bi,f:Math.max(2,f)}:null}).filter(Boolean)}
/* lots for a building with no rooms yet stand on the street after the buildings */
function streetLots(){var have={};bldList().forEach(function(o){have[o.bi]=1});return lotsOpen().filter(function(k){var q=ROOMCELL[k];return q&&!have[q[0]]})}
function streetW(){return 120+(bldList().length+streetLots().length)*(BLDW+BLDGAP)-BLDGAP}
function bldStreet(L,wall,inner,edge,dk){var s='',bot=LFROOF+L.rows*LFFP,lit=lfMix("#ffe7a8","#ffd36b",dk),off=lfMix("#9fb0c8","#2a3050",dk),x0=60;
  bldList().forEach(function(o,n){var bi=o.bi,x=x0+n*(BLDW+BLDGAP),h=o.f*BLDF+160,top=bot-h,art=bldArt(BLD[bi].id),cx=x+BLDW/2;
    if(art)s+='<image href="'+art+'" x="'+(x-60)+'" y="'+(top-120)+'" width="'+(BLDW+120)+'" height="'+(h+120)+'" preserveAspectRatio="xMidYMax meet"/>';
    else{s+='<rect x="'+x+'" y="'+top+'" width="'+BLDW+'" height="'+h+'" fill="'+wall+'" stroke="'+edge+'" stroke-width="5"/><rect x="'+(x-12)+'" y="'+(top-20)+'" width="'+(BLDW+24)+'" height="22" rx="5" fill="'+edge+'"/><rect x="'+x+'" y="'+top+'" width="'+BLDW+'" height="14" fill="'+BLD[bi].ac+'" opacity=".8"/>';
      for(var y=top+60;y<bot-170;y+=110)for(var xx=x+50;xx<x+BLDW-90;xx+=100)s+='<rect x="'+xx+'" y="'+y+'" width="64" height="70" rx="5" fill="'+((xx*7+y*3)%5<3?lit:off)+'" opacity="'+(.6+dk*.35).toFixed(2)+'"/>';
      s+='<rect x="'+(cx-80)+'" y="'+(bot-150)+'" width="160" height="150" rx="8" fill="'+inner+'" stroke="'+edge+'" stroke-width="4"/>'}
    s+='<g class="lfbsign" pointer-events="none"><rect x="'+(x-20)+'" y="'+(top-190)+'" width="'+(BLDW+40)+'" height="120" rx="24" fill="rgba(14,12,24,.85)" stroke="'+BLD[bi].ac+'" stroke-width="5"/><text x="'+cx+'" y="'+(top-108)+'" text-anchor="middle" font-size="76" font-weight="700" fill="#fff" font-family="Chakra Petch,system-ui,sans-serif">'+esc(BLD[bi].name)+'</text></g>';
    s+='<g data-act="bldgo" data-v="'+bi+'" style="cursor:pointer"><rect x="'+(x-20)+'" y="'+(top-200)+'" width="'+(BLDW+40)+'" height="'+(h+200)+'" fill="rgba(0,0,0,.001)"/></g>'});
  return s}
/* room: [building, column, floor] */
var ROOMCELL={lair:[0,1,1],trophy:[0,1,2],closet:[0,1,0],bedroom:[0,2,0],patio:[0,2,1],gameroom:[0,3,0],
 restaurant:[1,0,0],skybar:[1,0,1],rooftop:[1,0,2],boba:[1,1,0],dessert:[1,1,1],speakeasy:[1,1,2],garden:[1,2,0],
 theater:[2,0,0],auditorium:[2,0,1],mall:[2,1,0],bowling:[2,1,1],karaoke:[2,1,2],arcade:[2,2,0],rhythm:[2,2,1],vr:[2,3,0],club:[2,4,0]};
/* rooms you buy from an empty lot on the street. Everything else opens from an upgrade inside a room. */
var ROOMBUY=[["restaurant",null],["garden","restaurant"],["boba","restaurant"],["theater","restaurant"],["mall","auditorium"],["club","mall"]];
ROOMSOPEN={restaurant:1,garden:1,boba:1,theater:1,mall:1,club:1};
function lotsOpen(){return ROOMBUY.filter(function(q){return !hasRoom(q[0])&&(!q[1]||hasRoom(q[1]))}).map(function(q){return q[0]})}
nextRoom=function(){return lotsOpen()[0]||null};
buildableList=function(){return lotsOpen().filter(function(k){return ROOMT[k].lv<=effLvl()})};
var LFCELLW=600,LFBGAP=240;LFFP=440;
function worldLayout(){var B=S.base,used=BLD.map(function(){return {a:99,c:-1,f:1}}),put=function(t){var q=ROOMCELL[t];if(!q)return;var u=used[q[0]];u.a=Math.min(u.a,q[1]);u.c=Math.max(u.c,q[1]);u.f=Math.max(u.f,q[2]+1)};
  B.slots.forEach(function(r){if(r)put(r.t)});lotsOpen().forEach(put);
  var rows=Math.max.apply(0,used.map(function(u){return u.f})),x=60,out=[];
  used.forEach(function(u,i){if(u.c<0){u.a=0;u.c=0}var n=u.c-u.a+1;out.push({i:i,x:x,w:n*LFCELLW,f:u.f,a:u.a});x+=n*LFCELLW+LFBGAP});
  return {rows:rows,b:out,w:x-LFBGAP+60}}
function cellRect(t,L){var q=ROOMCELL[t]||[0,0,0],b=L.b[q[0]];return {x:b.x+LFCELLW*(q[1]-b.a),y:LFROOF+(L.rows-1-q[2])*LFFP}}
function cellXY(t,L){var c=cellRect(t,L);return {x:c.x+LFCELLW/2,y:c.y+LFFP/2}}
/* every room is scaled to fill its own square on the building view */
function roomTop(t){var D=ROOMDEF[t];return D&&D.shell===2?46:(LFWH[t]||136)}
lfRsc=function(t){var d=lfDimOf(t),n=d[0]+d[1];return Math.min(1.7,(LFCELLW-28)/(n*26),(LFFP-28)/(roomTop(t)+n*13+14))};
function roomOpen(t){var D=ROOMDEF[t];return t==="garden"||(D&&(D.out||D.shell===2))}
/* The block only exists where a room does. Nothing is built until the room is. */
function worldFacade(L){var bot=LFROOF+L.rows*LFFP,LS=lfLS(),dk=LS.dark,s='',cells={},mark=function(b,c,f,t){cells[b+":"+c+":"+f]=t||cells[b+":"+c+":"+f]||"x"};
  S.base.slots.forEach(function(r){if(!r||!ROOMCELL[r.t])return;var q=ROOMCELL[r.t];if(LFBSEL!=null&&q[0]!==LFBSEL)return;mark(q[0],q[1],q[2],r.t);for(var f=0;f<q[2];f++)mark(q[0],q[1],f)});
  var wall=lfMix(lfMix("#dbe1ea","#ffd9b0",LS.golden*.35),"#23283f",dk*.9),inner=lfMix(lfMix("#bcc6d6","#d9a988",LS.golden*.3),"#151930",dk*.92),edge=lfMix("#7f8ba3","#3b4263",dk);
  if(LFBSEL==null){s+=bldStreet(L,wall,inner,edge,dk);cells={}}
  Object.keys(cells).forEach(function(k){var q=k.split(":").map(Number),t=cells[k],b=L.b[q[0]],x=b.x+LFCELLW*(q[1]-b.a),y=LFROOF+(L.rows-1-q[2])*LFFP,o=t!=="x"&&roomOpen(t);
    s+='<g'+(o?' opacity=".32"':'')+'><rect x="'+x+'" y="'+y+'" width="'+LFCELLW+'" height="'+LFFP+'" fill="'+wall+'"/><rect x="'+(x+7)+'" y="'+(y+7)+'" width="'+(LFCELLW-14)+'" height="'+(LFFP-14)+'" rx="4" fill="'+inner+'"/></g><rect x="'+x+'" y="'+y+'" width="'+LFCELLW+'" height="'+LFFP+'" fill="none" stroke="'+edge+'" stroke-width="3"/>';
    if(!cells[q[0]+":"+q[1]+":"+(q[2]+1)])s+='<rect x="'+(x-6)+'" y="'+(y-12)+'" width="'+(LFCELLW+12)+'" height="14" rx="3" fill="'+edge+'"/>'});
  var pave=lfMix("#c9ced6","#2a2d3e",dk*.9),road=lfMix("#565c6b","#14162a",dk*.9);
  s+='<rect x="-1800" y="'+bot+'" width="'+(LFWW+3600)+'" height="34" fill="'+pave+'"/><rect x="-1800" y="'+(bot+34)+'" width="'+(LFWW+3600)+'" height="96" fill="'+road+'"/><rect x="-1800" y="'+(bot+130)+'" width="'+(LFWW+3600)+'" height="1600" fill="'+lfMix("#3c4150","#0c0e1c",dk*.9)+'"/>';
  for(var x=-1760;x<LFWW+1800;x+=110)s+='<rect x="'+x+'" y="'+(bot+78)+'" width="56" height="5" rx="2.5" fill="rgba(235,235,225,'+(.55-dk*.3).toFixed(2)+')"/>';
  return s}
/* The city behind everything. Same towers all day; the light on them follows the real sun. */
lfSkyline=function(rows){var Ls=lfLS(),sk=lfSkyCols(Ls),gy=LFROOF+rows*LFFP,X0=-1800,X1=LFWW+1800,dk=Ls.dark,gd=Ls.golden,cx=LFWW/2,hz=lfMix(sk[1],"#ff9458",gd*.6),hr=Ls.S.hr,R=lfSeed(19),o='';
  var winC=lfMix("#eef4fb","#ffd98a",dk);
  o+='<defs><linearGradient id="lfskyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+sk[0]+'"/><stop offset=".6" stop-color="'+lfMix(sk[0],sk[1],.7)+'"/><stop offset="1" stop-color="'+hz+'"/></linearGradient><radialGradient id="lfsung"><stop offset="0" stop-color="#fff4cf" stop-opacity=".85"/><stop offset=".3" stop-color="#ffd690" stop-opacity=".4"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></radialGradient>';
  [[60,76,1],[44,60,2],[32,44,3]].forEach(function(q){var t='',P=lfSeed(q[2]*31),cw=q[0]/4,ch=q[1]/4;for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(P()<.56)t+='<rect x="'+(i*cw+cw*.25)+'" y="'+(j*ch+ch*.22)+'" width="'+(cw*.5)+'" height="'+(ch*.52)+'" fill="'+winC+'" opacity="'+(.45+P()*.55).toFixed(2)+'"/>';o+='<pattern id="lfw'+q[2]+'" width="'+q[0]+'" height="'+q[1]+'" patternUnits="userSpaceOnUse">'+t+'</pattern>'});
  o+='</defs><rect x="'+X0+'" y="-5000" width="'+(X1-X0)+'" height="'+(gy+5000-1700)+'" fill="'+sk[0]+'"/><rect x="'+X0+'" y="'+(gy-1701)+'" width="'+(X1-X0)+'" height="1702" fill="url(#lfskyg)"/>';
  var so=lfCl((dk-.35)/.45,0,1);if(so>0){for(var i=0;i<130;i++)o+='<circle cx="'+(X0+R()*(X1-X0)).toFixed(0)+'" cy="'+(gy-500-R()*2000).toFixed(0)+'" r="'+(.8+R()*1.6).toFixed(1)+'" fill="#fff" opacity="'+((.3+R()*.7)*so).toFixed(2)+'"/>'}else for(var i2=0;i2<390;i2++)R();
  if(Ls.el>-7){var sx=cx+(hr-12)/7*Math.min(LFWW/2+500,1300),sy=gy-420-Ls.el*22;o+='<circle cx="'+sx.toFixed(0)+'" cy="'+sy.toFixed(0)+'" r="340" fill="url(#lfsung)"/><circle cx="'+sx.toFixed(0)+'" cy="'+sy.toFixed(0)+'" r="52" fill="'+lfMix("#fffbe6","#ffc27a",gd)+'"/>'}
  if(dk>.45&&Ls.wx!=="rain"){var h2=((hr+12)%24)-12,mx=cx+h2/7*900,my=gy-1250+Math.abs(h2)*70,ill=Ls.mo.ill;o+='<circle cx="'+mx.toFixed(0)+'" cy="'+my.toFixed(0)+'" r="120" fill="url(#lfsung)" opacity=".28"/><circle cx="'+mx.toFixed(0)+'" cy="'+my.toFixed(0)+'" r="38" fill="#f4f0dc"/><circle cx="'+(mx+(1-ill)*46).toFixed(0)+'" cy="'+(my-4).toFixed(0)+'" r="36" fill="'+sk[0]+'" opacity="'+(1-ill).toFixed(2)+'"/>'}
  var cc=lfMix(lfMix("#ffffff","#ffb48a",gd*.8),"#242a4c",dk*.92),nC=Math.round(6+Ls.cl*24);for(var c=0;c<nC;c++){var ex=X0+R()*(X1-X0),ey=gy-620-R()*1200,ew=110+R()*220;o+='<g fill="'+cc+'" opacity="'+(.3+Ls.cl*.5).toFixed(2)+'"><ellipse cx="'+ex.toFixed(0)+'" cy="'+ey.toFixed(0)+'" rx="'+ew.toFixed(0)+'" ry="'+(ew*.16).toFixed(0)+'"/><ellipse cx="'+(ex-ew*.25).toFixed(0)+'" cy="'+(ey-ew*.1).toFixed(0)+'" rx="'+(ew*.45).toFixed(0)+'" ry="'+(ew*.17).toFixed(0)+'"/></g>'}
  var hC=lfMix(lfMix("#8fa0ba",hz,.5),"#141836",dk*.92),hl='M'+X0+' '+gy;for(var hx=X0;hx<=X1;hx+=70)hl+=' L'+hx+' '+(gy-230-Math.sin(hx/310)*70-Math.sin(hx/97)*22).toFixed(0);o+='<path d="'+hl+' L'+X1+' '+gy+'Z" fill="'+hC+'"/>';
  var rim=hr<12?-1:1,rimO=(gd*.5+(1-dk)*.08).toFixed(2),winO=(.06+dk*.88).toFixed(2),tower=function(x,w,h,col,pid,kind){var y=gy-h,t='';
    if(kind===1)t+='<rect x="'+(x+w/2-2)+'" y="'+(y-70)+'" width="4" height="70" fill="'+col+'"/><path d="M'+x+' '+y+' L'+(x+w/2)+' '+(y-26)+' L'+(x+w)+' '+y+'Z" fill="'+col+'"/>';
    if(kind===2)t+='<rect x="'+(x+w*.14)+'" y="'+(y-22)+'" width="'+(w*.72)+'" height="24" fill="'+col+'"/><rect x="'+(x+w*.3)+'" y="'+(y-44)+'" width="'+(w*.4)+'" height="24" fill="'+col+'"/>';
    if(kind===3)t+='<path d="M'+x+' '+y+' Q'+(x+w/2)+' '+(y-44)+' '+(x+w)+' '+y+'Z" fill="'+col+'"/>';
    if(kind===4)t+='<path d="M'+x+' '+y+' L'+(x+w)+' '+(y-34)+' V'+y+'Z" fill="'+col+'"/>';
    t+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+col+'"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#'+pid+')" opacity="'+winO+'"/><rect x="'+(rim>0?x+w*.74:x)+'" y="'+y+'" width="'+(w*.26)+'" height="'+h+'" fill="#ffd2a0" opacity="'+rimO+'"/>';return t},
   layer=function(col,pid,wa,wb,ha,hb,gap){var x=X0,t='';while(x<X1){var w=Math.round(wa+R()*(wb-wa)),h=Math.round(ha+R()*(hb-ha)),kind=R()<.55?0:1+Math.floor(R()*4);t+=tower(Math.round(x),w,h,col,pid,kind);x+=w+R()*gap}return t};
  o+=layer(lfMix(lfMix("#a3b6d2",hz,.3+gd*.35),"#171b3e",dk*.92),"lfw3",46,96,560,1320,26);
  o+='<rect x="'+X0+'" y="'+(gy-760)+'" width="'+(X1-X0)+'" height="760" fill="'+hz+'" opacity="'+(.12+gd*.14).toFixed(2)+'"/>';
  var midC=lfMix(lfMix("#7488ad",hz,.16+gd*.3),"#10132e",dk*.95);o+=layer(midC,"lfw2",60,120,300,860,46);
  for(var lk=X0+500;lk<X1;lk+=1360){var kk=Math.floor(R()*3);o+=tower(Math.round(lk),kk===0?96:82,kk===0?1180:kk===1?1040:1290,midC,"lfw2",kk===0?2:kk===1?3:1)}
  var nearC=lfMix(lfMix("#4c5e84","#78485a",gd*.6),"#0a0c20",dk*.96);o+=layer(nearC,"lfw1",80,170,110,380,70);
  for(var px=X0+60;px<X1;px+=340+R()*260){var ph=120+R()*90,tc=lfMix(lfMix("#3b4a58","#5a3a3a",gd*.5),"#07081a",dk*.95);o+='<g fill="none" stroke="'+tc+'" stroke-linecap="round"><path d="M'+px.toFixed(0)+' '+gy+' Q'+(px+5).toFixed(0)+' '+(gy-ph/2).toFixed(0)+' '+(px+3).toFixed(0)+' '+(gy-ph).toFixed(0)+'" stroke-width="5"/>';[-1,-.55,0,.55,1].forEach(function(a){o+='<path d="M'+(px+3).toFixed(0)+' '+(gy-ph).toFixed(0)+' q'+(a*24).toFixed(0)+' -'+(16-Math.abs(a)*8).toFixed(0)+' '+(a*46).toFixed(0)+' '+(Math.abs(a)*16).toFixed(0)+'" stroke-width="4"/>'});o+='</g>'}
  return o};
/* nothing on an empty lot but a small marker on the ground. Tapping it says what goes there. */
function lotHtml(k){var T=ROOMT[k],lk=effLvl()<T.lv;
  return '<g data-lf="'+(lk?'lock:'+esc(T.name)+':'+T.lv:'build:'+S.base.slots.length)+'" style="cursor:pointer"><rect x="-70" y="-70" width="140" height="140" fill="rgba(0,0,0,.001)"/>'+(lk?'<g opacity=".6"><circle r="20" fill="rgba(20,18,28,.7)" stroke="rgba(255,200,87,.55)" stroke-width="2"/><rect x="-8" y="-2" width="16" height="12" rx="2.5" fill="#ffc857"/><path d="M-5 -2V-7a5 5 0 0 1 10 0V-2" fill="none" stroke="#ffc857" stroke-width="2.5"/></g>':'<g class="lfplus"><circle r="24" fill="rgba(20,18,28,.75)" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/><path d="M-10 0H10M0 -10V10" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></g>')+'</g>'}
function worldBack(L){return lfSkyline(L.rows)+worldFacade(L)}
lfWorld=function(){
  var B=S.base,L=worldLayout(),rows=L.rows;LFWW=LFBSEL==null?streetW():L.w;window.LFLAY=L;
  var bed=cellXY("bedroom",L);LFOX[0]=bed.x;LFOX[1]=bed.x+LFCELLW;
  var Hh=LFROOF+rows*LFFP+LFSTREET,s='';window.LFSKYK=lfLS().key;
  s+='<g id="lfback">'+worldBack(L)+'</g>';
  var order=[];B.slots.forEach(function(r,i){if(r)order.push(i)});
  order.sort(function(a,b){return ((ROOMCELL[B.slots[b].t]||[0,0,0])[2])-((ROOMCELL[B.slots[a].t]||[0,0,0])[2])||a-b});
  var meta={},bot=LFROOF+rows*LFFP;
  var inB=function(t){var q=ROOMCELL[t];return LFBSEL==null?false:!!q&&q[0]===LFBSEL};
  order=order.filter(function(i){return inB(B.slots[i].t)});
  /* a lot shows inside its building, or on the street while that building has no rooms yet */
  if(LFBSEL==null){var nb=bldList().length;streetLots().forEach(function(k,j){s+='<g class="lfroom" transform="translate('+(60+(nb+j)*(BLDW+BLDGAP)+BLDW/2)+','+(bot-34)+') scale(2.2)">'+lotHtml(k)+'</g>'})}
  lotsOpen().filter(inB).forEach(function(k){var p=cellXY(k,L);s+='<g class="lfroom" transform="translate('+p.x+','+(bot-34)+')">'+lotHtml(k)+'</g>'});
  order.forEach(function(i){var r=B.slots[i],p=cellXY(r.t,L),DM=lfDimOf(r.t),LOFF=(DM[0]-DM[1])*13,RS=lfRsc(r.t),MID=((DM[0]+DM[1])*13+14-roomTop(r.t))/2;
    s+='<g class="lfroom" data-i="'+i+'" transform="translate('+p.x+','+p.y+') scale('+RS.toFixed(4)+') translate('+(-LOFF)+','+(-MID).toFixed(1)+')">';
    var C=lfRoomCtx(r,i);meta[i]={C:C,p:p,r:r};
    s+='<g data-lf="room:'+i+'">'+lfRoomSvg(r,i,C)+'<g class="lfag" id="lfag'+i+'"></g>'+(C.LT?C.LT.post:'')+'</g>';
    if(LFW.wx==="rain"&&C.T.out)s+='<g class="lfrain" clip-path="url(#lfclip)" transform="translate('+LOFF+',150)">'+lfRainG(300,260,i+4)+'</g>';
    if(Math.floor(r.pend||0)>=1)s+='<g class="lfbub" data-lf="collect:'+i+'" transform="translate('+LOFF+','+(MID-(LFFP/2-34)/RS).toFixed(1)+') scale('+(1/RS).toFixed(4)+')"><g class="lfbob"><circle r="19" fill="#14121c" stroke="#ffc857" stroke-width="2"/><circle r="9" fill="#ffc857"/></g></g>';
    s+='</g>'});
  s+='<g id="lfagS"></g><g id="lfwxo" pointer-events="none"></g>';
  window.LFMETA=meta;window.LFDIM={w:LFWW,h:Hh,rows:rows,F:rows,lockF:0};
  setTimeout(function(){var h=document.querySelector(".lfhint");if(h)h.innerHTML="Drag to move &middot; pinch to zoom &middot; tap a "+(LFBSEL==null?"building":"room")},0);
  return '<defs><filter id="prtBlur" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="5"/></filter><clipPath id="lfclip"><rect x="-240" y="-140" width="480" height="362"/></clipPath><radialGradient id="lftvg"><stop offset="0" stop-color="#6aa8ff" stop-opacity=".5"/><stop offset="1" stop-color="#6aa8ff" stop-opacity="0"/></radialGradient></defs><g id="lfw">'+s+'</g>'};
/* the light on the city moves with the clock, without redrawing the rooms */
setInterval(function(){var g=document.getElementById("lfback");if(!g||!window.LFLAY)return;var k=lfLS().key;if(k===window.LFSKYK)return;window.LFSKYK=k;g.innerHTML=worldBack(window.LFLAY);var w=document.getElementById("lfwrap"),c=lfSkyCols();if(w)w.style.background="linear-gradient(180deg,"+c[0]+" 0,"+c[1]+" 100%)"},20000);
/* The view opens on the whole Home building, every room of it in sight, wide screen or phone. Zoom in from there. */
function lfInitViewOf(c){var cw=c.clientWidth||360,ch=c.clientHeight||520,L=window.LFLAY,b=L&&L.b&&(LFBSEL==null?{x:60,w:streetW()-120,f:Math.max(2,Math.ceil(Math.max.apply(0,bldList().map(function(o){return o.f}).concat([2]))*BLDF/LFFP)+1)}:L.b[LFBSEL]);
  if(!b){LFV.s=Math.min(1.4,Math.max(.42,Math.min(cw/(LFCELLW+40),ch/(LFFP+280))));var gy=LFROOF+(LFDIM.rows-.5)*LFFP;LFV.s0=LFV.s;LFV.x=cw/2-LFOX[0]*LFV.s;LFV.y=ch*.46-gy*LFV.s;LFV.init=1;lfClamp();lfApply();return}
  var f=b.f||1,s=Math.max(lfMinS(),Math.min(1.4,(cw-24)/(b.w+(LFBSEL==null?60:Math.max(420,b.w*.24))),(ch-110)/(f*LFFP+170)));
  /* rooms draw past their grid cells, more to the right: inside a building, fit a wider box shifted right (measured by QA and LEAD) */
  var ox=LFBSEL==null?0:Math.min(170,b.w*.06);LFV.s=LFV.s0=s;LFV.x=cw/2-(b.x+b.w/2+ox)*s;LFV.y=ch*.47-(LFROOF+(L.rows-f/2)*LFFP+30)*s;LFV.init=1;lfClamp();lfApply()}
/* The frame a phone app gives the page can change size: refit the building when the height really changed, so it is never
   left framed for the old size. A small change (a bar sliding away) only re-clamps. */
/* Zoomed all the way out, everything in view fits: the street, or the building you are in. lfMinS in 20_loft.js read
   window.LFWW, which is never set, so it stopped at a 2400-wide world and Calibur Mall (3000) never fit (QA). */
lfMinS=function(){var c=document.getElementById("lfwrap"),cw=(c&&c.clientWidth)||360,L=window.LFLAY,w=LFBSEL!=null&&L&&L.b[LFBSEL]?L.b[LFBSEL].w*1.3+600:LFWW+120;return Math.min(.32,cw/w)};
var LFVH=0;
lfInitView=function(c){lfInitViewOf(c);LFVH=c.clientHeight};
addEventListener("resize",function(){var c=document.getElementById("lfwrap");if(!c||!LFV.init)return;if(Math.abs(c.clientHeight-LFVH)>=120){LFV.init=0;lfInitView(c)}else{lfClamp();lfApply()}});
/* Temporary, the owner's device only: what the real phone's frame measures, written to diag/frame where Claude can read it
   (data/users/ is private even from the owner). Remove it, and delete that doc, once the phone is sorted. */
var QBFL=[],QBFT=0,QBFK="";
function qbFrame(why){try{if(window.__qbGuest||!db)return;var D=document.documentElement,B=document.body,v=window.visualViewport,r=function(s){var e=document.querySelector(s);if(!e)return 0;var q=e.getBoundingClientRect();return [Math.round(q.top),Math.round(q.bottom)]};
  var m={tab:view,inner:[innerWidth,innerHeight],screen:[screen.width,screen.height,screen.availHeight],vv:v?[Math.round(v.width),Math.round(v.height),Math.round(v.offsetTop),+v.scale.toFixed(2)]:0,html:[D.clientHeight,D.offsetHeight,D.scrollHeight],body:[B.offsetHeight,B.scrollHeight],wrap:r("#lfwrap"),nav:r(".nav")},k=JSON.stringify(m);if(k===QBFK)return;QBFK=k;m.why=why;m.t=Date.now();QBFL.push(m);if(QBFL.length>30)QBFL.splice(1,1);
  clearTimeout(QBFT);QBFT=setTimeout(function(){db.doc("diag/frame").set({appv:APPV,ua:navigator.userAgent,framed:window!==window.top,dpr:devicePixelRatio,log:JSON.stringify(QBFL)}).catch(function(){})},2000)}catch(e){}}
addEventListener("resize",function(){qbFrame("resize")});setTimeout(function(){qbFrame("boot")},6000);
var lfMount0=lfMount;lfMount=function(){var c=document.getElementById("lfwrap");if(c&&LFV.init&&Math.abs(c.clientHeight-LFVH)>=120)LFV.init=0;lfMount0();qbFrame("loft");setTimeout(function(){qbFrame("loft+1s")},1000);setTimeout(function(){qbFrame("loft+4s")},4000)};
/* ---- doors between rooms ----
   [from, to, wall, position, color, label]. "L" is the left wall at height y=position,
   "R" the back wall at x=position. The door shows once the target room exists. */
var PORTALS=[];
function portal(from,to,wall,pos,col,label){PORTALS.push([from,to,wall,pos,col||"#ffd27a",label||""])}
/* a door is only a soft glow on the floor. The arrow floats outside the room and points at where that room really is. */
function rmPortals(C,r){PORTALS.forEach(function(q){if(q[0]!==r.t||!hasRoom(q[1]))return;var col=q[4],side=q[2],W=C.W,D=C.D,len=.75,dp=.55,lim=side==="BR"||side==="FL"?W:D,p=Math.min(q[3],lim-1);
    var quad=side==="BR"?[[p-len,.02],[p+len,.02],[p+len,dp],[p-len,dp]]:side==="BL"?[[.02,p-len],[.02,p+len],[dp,p+len],[dp,p-len]]:side==="FL"?[[p-len,D-dp],[p+len,D-dp],[p+len,D-.02],[p-len,D-.02]]:[[W-dp,p-len],[W-.02,p-len],[W-.02,p+len],[W-dp,p+len]];
    var hit=' data-act="gotoroom" data-t="'+q[1]+'" style="cursor:pointer"',pts=quad.map(function(k){return lfP(k[0],k[1],0)}).map(lfPt).join(" ");
    C.decals.push('<polygon class="prtG" pointer-events="none" points="'+pts+'" fill="'+col+'" filter="url(#prtBlur)"/>');
    (C.pfront=C.pfront||[]).push('<polygon'+hit+' points="'+pts+'" fill="rgba(0,0,0,.001)"/>');C.portal=1})}
/* the arrows live on the frame, in its empty corners: always in view, never over the room, whatever the zoom.
   They point where the next room really is on the building. */
/* Each arrow sits in the frame corner on its own door's side (QA): left wall top-left, upper wall top-right (left of the
   zoom buttons), front-left edge bottom-left, front-right edge bottom-right. */
function rmArrows(r){var at={tl:'',tr:'',bl:'',br:''};PORTALS.forEach(function(q){if(q[0]!==r.t||!hasRoom(q[1]))return;var a=ROOMCELL[r.t],b=ROOMCELL[q[1]],up=b[2]>a[2],dn=b[2]<a[2],left=!up&&!dn&&b[1]<a[1],rot=up?-90:dn?90:left?180:0,k={BL:"tl",BR:"tr",FL:"bl",FR:"br"}[q[2]]||"br";
    at[k]+='<button type="button" class="prtb-b" data-act="gotoroom" data-t="'+q[1]+'" style="--c:'+q[4]+'"><svg viewBox="-28 -20 56 40" width="20" height="16" aria-hidden="true"><g transform="rotate('+rot+')"><path d="M-20 -8H4V-18L26 0L4 18V8H-20Z" fill="'+q[4]+'"/></g></svg>'+esc(q[5]||ROOMT[q[1]].name)+'</button>'});
  var clean=r.t==="bedroom"&&(S.base.poops||[]).length?'<div class="prtb bc"><button type="button" class="prtb-b" data-act="dogclean" style="--c:#ffc857">Clean up</button></div>':"";
  /* top right: under the zoom buttons, not behind them (inline: index.html is shared) */
  return clean+Object.keys(at).map(function(k){return at[k]?'<div class="prtb '+k+'"'+(k==="tr"?' style="top:44px;right:6px"':'')+'>'+at[k]+'</div>':''}).join("")}
/* tapping an arrow or a glow: drag handlers can swallow the click, so read what is under the finger */
(function(){var dn=null;document.addEventListener("pointerdown",function(e){dn=[e.clientX,e.clientY]},true);
  document.addEventListener("pointerup",function(e){if(!dn||Math.hypot(e.clientX-dn[0],e.clientY-dn[1])>8)return;var els=document.elementsFromPoint(e.clientX,e.clientY),g=null;for(var i=0;i<els.length&&!g;i++)g=els[i].closest&&els[i].closest("[data-act=gotoroom]");if(!g)return;var t=g.getAttribute("data-t");
    setTimeout(function(){var ix=-1;S.base.slots.forEach(function(r,k){if(r&&r.t===t)ix=k});if(ix>=0)roomModal(ix)},30)},true)})();
var lfRoomCtxBase=lfRoomCtx;
var RMPORTAL_OK=1;
/* ---- rooms from data ----
   def: {name,lv,cost,coin,desc,wall,wain,acc,fl,size:[[w,d],...],H,stages:[upgrade ids that grow it],ups:[...],guests,people}
   an upgrade: [id,name,price,effect,line]; effect.art:[sprite,x,y,w,d,H,{flip,dy,wall}] or a list of them,
   effect.cust:[[x,y,face],...] are spots guests stop at; effect.opens names the room it adds. */
var ROOMDEF={};
function roomDef(t,d){ROOMDEF[t]=d;
  ROOMT[t]={name:d.name,lv:d.lv||0,cost:d.cost||0,coin:d.coin||0,store:d.store||8,desc:d.desc,bundled:!d.buy,dark:d.dark,note:d.note||'Yours to fill.'};
  if(d.xpBase){ROOMT[t].buff={special:"all"};ROOMT[t].pct=d.xpBase}
  LFTH[t]={wall:d.wall,wain:d.wain,acc:d.acc,fl:d.fl||"w",out:d.out};
  if(d.H)LFWH[t]=d.H;LFRS[t]=.86;
  (d.ups||[]).forEach(function(u){u[3].fp=1;u[3].lv=u[3].lv||d.lv});
  ADDONS[t]=(d.ups||[]).slice().sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});
  (d.req||[]).forEach(function(q){ADDREQ[q[0]]=q[1];window.RSTCH[q[0]]=1});
  (d.sup||[]).forEach(function(q){window.RSSUP[q[0]]=[q[1]];window.RSTCH[q[1]]=1});
  LFROOM[t]=function(C){rsArtReady();roomDraw(C,t)};
  if(d.door!==false)SVCGEN[t]=1;
  ROOMHELP[t]=d.help||ROOMHELP[t]}
var SVCGEN={};
function roomStageOf(t,a){var d=ROOMDEF[t],s=0;(d.stages||[]).forEach(function(k,i){if(a&&a[k])s=i+1});return s}
var dimGenBase=lfDimOf;
lfDimOf=function(t){var d=ROOMDEF[t];if(!d)return dimGenBase(t);var r=S&&S.base&&S.base.slots.filter(function(q){return q&&q.t===t})[0];return d.size[Math.min(d.size.length-1,roomStageOf(t,r&&r.a))]};
/* A hand-drawn plan keeps working when a room grows. d.layout=[W0,D0,pivotX,pivotY]: anything before the pivot stays
   put (things against the walls, a bar and its stools), anything past it spreads out to fill the room. */
function roomSpread(t,v,size,ax){var d=ROOMDEF[t],L=d&&d.layout;if(!L)return v;var S=d.size[0][ax],p=L[2+ax]||.6,c=v+size/2;if(v<.6||c<=p)return v;return +(p+(c-p)*(S-p)/(L[ax]-p)-size/2).toFixed(2)}
function roomDraw(C,t){var d=ROOMDEF[t],H=function(k){return C.has(k)},sx=function(v,w){return roomSpread(t,v,w||0,0)},sy=function(v,w){return roomSpread(t,v,w||0,1)};
  if(d.out)C.out=1;
  if(!d.out&&d.shell==null){var wc=d.walls?d.walls(H):[d.wall,d.wain];thWalls(C,wc[0],wc[1],wc[2])}
  var fc=d.floor?d.floor(H):d.dark?["#1d1a22","rgba(255,255,255,.04)",1]:null;if(fc)roomFloor(C,fc);
  if(d.shell!=null)C.noshell=d.shell;
  if(d.door===false){C.s("door",C.W-.6,C.D-.6,1,"look",[1,1]);C.door={x:C.W-.6,y:C.D-.6}}else if(!d.out)lfDoorAt(C,C.W);else{C.s("door",C.W-.5,C.D-.5,1,"look",[1,1]);C.door={x:C.W-.5,y:C.D-.5}}
  (d.jogs||[]).forEach(function(q){C._lb=[q[0],q[1],q[0]+q[2],q[1]+q[3]];C.box(q[0],q[1],0,q[2],q[3],LF.H-4,d.wall,{top:d.wain});if(LFREC)lfRecBox(q[0],q[1],0,q[2],q[3],40)});
  var base=[[C.W*.5,C.D*.5,1],[C.W*.3,C.D*.7,-1],[C.W*.7,C.D*.3,1]];lfWander(C,base);
  (d.draw||function(){})(C,H);
  var one=function(q){var k=q[0],o=Object.assign({h:q[7]||30,ctr:1},q[6]||{});if(q[5])o.H=q[5];(o.fit?lfSprFit:window.LFSP4&&LFSP4[k]&&!LFSPR[k]?lfSpr4:lfSpr)(C,k,sx(q[1],q[3]),sy(q[2],q[4]),q[3],q[4],o)};
  (ADDONS[t]||[]).concat(d.base?[["",0,0,d.base]]:[]).forEach(function(u){var e=u[3];if(u[0]&&!H(u[0]))return;
    if(u[0]&&(window.RSSUP[u[0]]||[]).some(H))return;
    /* e.plat: the piece is a stage or a dance floor people stand on, this many units high. It is no obstacle, and
       anyone inside it is lifted onto it and drawn over it, instead of standing inside it with only a head showing. */
    if(e.art){var arts0=Array.isArray(e.art[0])?e.art:[e.art];if(e.plat){var RR=LFREC;LFREC=null;arts0.forEach(one);LFREC=RR;
      arts0.forEach(function(a){var x0=sx(a[1],a[3]),y0=sy(a[2],a[4]);C.plat.push({k:a[0],x0:x0,y0:y0,x1:x0+a[3],y1:y0+a[4],z:e.plat,key:x0+a[3]+y0+a[4]-((a[6]&&a[6].dk)||0)+.01})})}
      else arts0.forEach(one)}
    if(e.light)lfLight(C,sx(e.light[0]),sy(e.light[1]),e.light[2],e.light[3],e.light[4],e.light[5]);
    /* A spot belongs to the piece nearest it, and moves with that piece when the room spreads. Spread on its own
       as a point, a spot just past a table's edge used to land inside the table. */
    var arts=e.art?(Array.isArray(e.art[0])?e.art:[e.art]):[],near=function(x,y,ax){if(!d.layout||!arts.length)return ax?sx(x):sy(y);
      var best=null,bd=1e9;arts.forEach(function(a){var dd=Math.hypot(Math.max(0,a[1]-x,x-a[1]-a[3]),Math.max(0,a[2]-y,y-a[2]-a[4]));if(dd<bd){bd=dd;best=a}});
      if(bd>1.5)return ax?sx(x):sy(y);/* a spot out on the floor (watching a band) spreads with the room, not with a piece */
      /* and never past the room's edge, where a spot in front of a piece near the front can end up once it spreads */
      return ax?Math.min(C.W-.3,sx(best[1],best[3])+(x-best[1])):Math.min(C.D-.3,sy(best[2],best[4])+(y-best[2]))};
    /* q[5].over: the seat is inside its piece (a booth), so the sitter sorts just after that piece instead of behind it */
    var own=function(x,y){var best=null,bd=1e9;arts.forEach(function(a){var dd=Math.hypot(Math.max(0,a[1]-x,x-a[1]-a[3]),Math.max(0,a[2]-y,y-a[2]-a[4]));if(dd<bd){bd=dd;best=a}});return best};
    (e.sit||[]).forEach(function(q){var n0=C.st.length,qx=near(q[0],q[1],1),qy=near(q[0],q[1],0),o={lift:1,sz:q[3]||6,facewall:q[4]?1:0,dk:q[4]?0:undefined,wx:qx,wy:qy+1.1},a=q[5]&&q[5].over&&own(q[0],q[1]);
      if(a){o.dk=sx(a[1],a[3])+a[3]+sy(a[2],a[4])+a[4]-((a[6]&&a[6].dk)||0)+.05-(qx+qy);if(a[6]&&a[6].flip){o.wx=qx+1.1;o.wy=qy}}
      C.s("sit",qx,qy,q[2],"look",[10,20],o);lfConvert(C,n0,"sit",{uact:"look",lbl:"G",grp:"g"})});
    /* s[3]: options for the spot, e.g. {fxwall:1} to stand with your back to the camera */
    (e.cust||[]).forEach(function(s,i){lfCust(C,near(s[0],s[1],1),near(s[0],s[1],0),s[2],Object.assign({wact:"look",uact:"look",lbl:"G",grp:"g",num:i+1,udur:[8,16]},s[3]||{}))});
    (e.work||[]).forEach(function(s){C.s("work",s[0],s[1],s[2]||1,"work",[6,12],{tag:"staff"})});
    if(e.fx)e.fx(C)})}
function roomFloor(C,f){var U=LF.U,W=C.W,D=C.D;var g='<rect width="'+U*(W-.08)+'" height="'+U*(D-.08)+'" fill="'+f[0]+'"/>';if(f[1]){var st=f[2]||1;for(var k=st;k<W;k+=st)g+='<path d="M'+U*k+' 0V'+U*D+'" stroke="'+f[1]+'" stroke-width="1"/>';for(var j=st;j<D;j+=st)g+='<path d="M0 '+U*j+'H'+U*W+'" stroke="'+f[1]+'" stroke-width="1"/>'}C.decals.push(lfFloorG(.04,.04,g))}
function genPeople(r,i,C,out){var d=ROOMDEF[r.t];if(!d)return;var a=r.a||{},seats=C.st.filter(function(s){return s.cust}).length;
  (d.staff||[]).forEach(function(q,j){if(!q[0]||a[q[0]])out.push({id:"st:"+r.t+j,room:i,role:"crew",look:rsNpc(q[1]),ix:j})});
  /* d.visitors: a room only these people visit (the Game Room's friends). Nobody else comes in, and with an empty list nobody does. */
  if(d.visitors){var vs=d.visitors.filter(function(v){return v&&v.look});for(var v=0;v<Math.min(seats,vs.length);v++)out.push({id:"g:"+i+":"+v,room:i,role:"guest",gi:v,vis:vs[v].id});return}
  var n=d.guests===0?0:Math.min(seats,(d.guests||2)+Math.floor(addonsOf(r).length/3));for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
function genNote(r){var d=ROOMDEF[r.t];if(!d||!d.stageNames)return "";return '<p class="note"><b>'+esc(d.stageNames[roomStageOf(r.t,r.a)]||d.name)+'.</b></p>'}
/* ---- the Restaurant: small and plain to start, dark and spacious at the end ---- */
/* The dining room is the square. The kitchen is a wing off its top right corner: [width, depth] past the dining room. */
RSSIZE=[[7.5,8],[13,12],[16,14]];var RSKIT=[[4.8,3.2],[8,4.6],[8.6,5.4]];
lfDimOf=(function(base){return function(t){if(t!=="restaurant")return base(t);var r=window.__rsDraw||rsRoom(),st=rsStage(r&&r.a);return [RSSIZE[st][0]+RSKIT[st][0],RSSIZE[st][1]]}})(lfDimOf);
/* with no patio yet, the space below the kitchen wing is empty air: the floor is an L, with its own edges */
function rsNotchShell(C,uid,sh){var n=C.notch,W=C.W,D=C.D,t=15,P=lfP,A=P(0,0,0),B=P(W,0,0),K=P(W,n[1],0),E=P(n[0],n[1],0),F=P(n[0],D,0),G=P(0,D,0),dn=function(p){return [p[0],p[1]+t]},id="rsn"+uid,pts=[[A[0],A[1]-200],[B[0]+3,B[1]-200],[B[0]+3,B[1]],K,E,F,[G[0]-3,G[1]],[G[0]-3,G[1]-200]];
  return '<clipPath id="'+id+'"><polygon points="'+pts.map(lfPt).join(" ")+'"/></clipPath><g clip-path="url(#'+id+')">'+sh+'</g>'+lfPoly([B,K,dn(K),dn(B)],"#392a3f",LFOL,.8)+lfPoly([K,E,dn(E),dn(K)],"#4d3a52",LFOL,.8)+lfPoly([E,F,dn(F),dn(E)],"#392a3f",LFOL,.8)+lfPoly([F,G,dn(G),dn(F)],"#4d3a52",LFOL,.8)}
/* a low wall sorts in one-tile pieces, so nothing in front of it gets cut off */
function rsWallRun(C,x,y,w,d,h,pc,pt){if(LFREC)lfRecBox(x,y,0,w,d,40);var alX=w>=d,n=alX?w:d;for(var a=0;a<n-.01;a+=1){var q=Math.min(1,n-a),x0=alX?x+a:x,y0=alX?y:y+a,w0=alX?q:w,d0=alX?d:q,o=lfPolyS([lfP(x0,y0+d0,0),lfP(x0+w0,y0+d0,0),lfP(x0+w0,y0+d0,h),lfP(x0,y0+d0,h)],pc)+lfPolyS([lfP(x0+w0,y0,0),lfP(x0+w0,y0+d0,0),lfP(x0+w0,y0+d0,h),lfP(x0+w0,y0,h)],lfSh(pc,-.24))+lfPolyS([lfP(x0,y0,h),lfP(x0+w0,y0,h),lfP(x0+w0,y0+d0,h),lfP(x0,y0+d0,h)],pt),ln=function(a1,b1){return '<path d="M'+lfPt(a1)+' L'+lfPt(b1)+'" stroke="'+LFOL+'" stroke-width=".8" fill="none"/>'};
    o+=alX?ln(lfP(x0,y0,h),lfP(x0+w0,y0,h))+ln(lfP(x0,y0+d0,h),lfP(x0+w0,y0+d0,h))+ln(lfP(x0,y0+d0,0),lfP(x0+w0,y0+d0,0)):ln(lfP(x0,y0,h),lfP(x0,y0+d0,h))+ln(lfP(x0+w0,y0,h),lfP(x0+w0,y0+d0,h))+ln(lfP(x0+w0,y0,0),lfP(x0+w0,y0+d0,0));
    C._lb=[x0,y0,x0+w0,y0+d0];C.add(x0+w0+y0+d0,o)}}RSNAME=["Hole in the Wall","Corner Diner","Noir"];
var RSCH=[["rtx_tb0","rtx_ch0",34,46],["rtx_tb1","rtx_ch1",38,50],["rtx_tb2","rtx_ch2",42,52],["rtx_tb3","rtx_ch3",44,54]];
function rsTier(C){return C.has("r_t3")?3:C.has("r_t2")?2:C.has("r_t1")?1:0}
/* guests sit behind the table, facing out, so a table never cuts through anyone */
/* these sheets are drawn to true proportions, so a height passed in would only squash them */
var lfSprNat=lfSpr;lfSpr=function(C,k,x,y,w,d,o){if(o&&o.H&&/^(rdx|sbx|rfx|bbx|dsx|spx|acx|rhx|vrx|bwx|kax|cbx|gmx|mlx|hmx|clx)_/.test(k)){o=Object.assign({},o);delete o.H}return lfSprNat(C,k,x,y,w,d,o)};
var RDT=[null,["rdx_tlong",2.5,1.5,46],["rdx_tround",2.0,2.0,50],["rdx_tsq",2.2,2.0,50]];
function rsSitAt(C,x,y,face,cx,cy,back,lbl){var n0=C.st.length;C.s("sit",x,y,face,"eat",[10,20],back?{tag:"diner",lift:1,sz:5,facewall:1,dk:0,wx:x,wy:y+1,tb:[cx,cy]}:{tag:"diner",lift:1,sz:5,wx:cx+1.8,wy:cy+1.8,tb:[cx,cy]});lfConvert(C,n0,"sit",{uact:"eat",lbl:lbl||"T",grp:lbl||"t"})}
function rsDinner(C,cx,cy,lbl){var tr=rsTier(C),T=RSCH[tr];
  if(tr===0||!LFSPR.rdx_chairf){[[cx-1.15,cy-.1,1],[cx-.1,cy-1.15,-1]].forEach(function(p){lfSpr(C,T[1],p[0]-.3,p[1]-.3,.6,.6,{h:1,H:T[3],flip:p[2]>0?1:0,dk:.6,nob:1,nosh:1,ctr:1});rsSitAt(C,p[0],p[1],p[2],cx,cy,0,lbl)});lfSpr(C,T[0],cx-.9,cy-.9,1.8,1.8,{h:28,H:T[2],ctr:1});return}
  var K=RDT[tr],w=K[1],d=K[2];
  var chF=tr===1?"rdx_wchf":"rdx_chairf",chB=tr===1?"rdx_wchb":"rdx_chairb";
  [cx-.62,cx+.62].forEach(function(x){var y=cy-d/2-.28;lfSpr(C,chF,x-.36,y-.36,.72,.72,{h:1,flip:1,dk:.6,nob:1,nosh:1,ctr:1});rsSitAt(C,x,y,-1,cx,cy,0,lbl)});
  lfSpr(C,K[0],cx-w/2,cy-d/2,w,d,{h:28,ctr:1,flip:1,dk:1.7});
  [cx-.62,cx+.62].forEach(function(x){var y=cy+d/2+.28;rsSitAt(C,x,y,1,cx,cy,1,lbl);lfSpr(C,chB,x-.36,y-.36,.72,.72,{h:1,flip:1,dk:0,nob:1,nosh:1,ctr:1})})}
/* a booth is two high-backed benches and a table, so a guest can really sit inside one */
function rsBooth(C,x0,Y){if(!LFSPR.rdx_bench)return;lfSpr(C,"rdx_bench",x0,Y,3.2,.9,{h:28,H:74,flip:1,dk:.5,nosh:1,ctr:1});
  [x0+.9,x0+2.3].forEach(function(x){rsSitAt(C,x,Y+.62,-1,x0+1.6,Y+1.65,0,"B")});
  lfSpr(C,"rdx_tlong",x0+.3,Y+1.0,2.6,1.35,{h:26,H:46,flip:1,dk:1.7,ctr:1});
  [x0+.9,x0+2.3].forEach(function(x){rsSitAt(C,x,Y+2.72,1,x0+1.6,Y+1.65,1,"B")});
  lfSpr(C,"rdx_benchb",x0,Y+2.45,3.2,.9,{h:28,H:74,flip:1,dk:0,nosh:1,ctr:1})}
function rsWalls(C){thWalls(C,"#191619","#141214","rgba(201,160,110,.14)");roomFloor(C,["#2b211b","rgba(0,0,0,.28)",.8])}
LFROOM.restaurant=function(C){
  rsArtReady();
  var H=function(k){return C.has(k)},st=H("r_x2")?2:H("r_x1")?1:0,Wi=RSSIZE[st][0],D=RSSIZE[st][1],kw=RSKIT[st][0],kd=RSKIT[st][1],Wt=Wi+kw,patio=H("r_patio"),px=Wi,noir=H("r_noir")&&st===2;
  LFTH.restaurant.wall=noir?"#2c262a":"#7db3ae";LFTH.restaurant.wain=noir?"#1a1619":"#4c8a86";
  C.rsW=0;
  /* the painted shell for this size (rsw_s0..2, rsw_s2n for Noir: walls, windows, dining and kitchen floors in one
     picture; the L is cut by the notch clip). Without it the walls and floors are drawn as before. */
  var shk0=noir?"rsw_s2n":"rsw_s"+st,shk=window.LFSPR&&LFSPR[shk0]?shk0:null;if(shk)C.shellK=shk;
  if(noir&&!shk){thWalls(C,"#191619","#141214","rgba(201,160,110,.14)");var fw=C.W;C.W=Wi;roomFloor(C,["#2b211b","rgba(0,0,0,.28)",.8]);C.W=fw}
  if(!patio){C.notch=[Wi,kd];if(LFREC)lfRecBox(Wi,kd,kw,D-kd,40)}
  var dw=C.W;C.W=Wi;lfDoorAt(C,Wi);C.W=dw;
  if(!shk)[[4.2],[5.0,8.6],[5.0,8.6,12.0]][st].forEach(function(y){lfSprWin(C,"w_winrs2",.05,y,.1,.05,{H:92,dy:-34})});
  C.obsc=.7;
  /* the kitchen wing: its own tile floor and tiled back wall, past the end of the dining room */
  var kf=lfPoly([lfP(Wi,0,0),lfP(Wt,0,0),lfP(Wt,kd,0),lfP(Wi,kd,0)],noir?"#34383c":"#c9d2d0","none");
  for(var kq=1;kq<kw;kq++)kf+='<path d="M'+lfPt(lfP(Wi+kq,0,0))+' L'+lfPt(lfP(Wi+kq,kd,0))+'" stroke="rgba(0,0,0,.14)" stroke-width="1"/>';
  for(var kr=1;kr<kd;kr++)kf+='<path d="M'+lfPt(lfP(Wi,kr,0))+' L'+lfPt(lfP(Wt,kr,0))+'" stroke="rgba(0,0,0,.14)" stroke-width="1"/>';
  if(!shk)C.decals.push(kf);
  if(!shk)C.walls.push(lfFaceY(Wi,0,LF.H,tileBand(LF.U*kw,LF.H*.34,LF.H,9,noir?"#3a3f45":"#e8edec",noir?"rgba(255,255,255,.08)":"rgba(90,110,110,.28)")+'<rect y="'+(LF.H*.34-3)+'" width="'+LF.U*kw+'" height="4" fill="'+(noir?"#b8935a":"#7f9a98")+'"/>'));
  var pc=noir?"#46301f":"#3f6f6b",pt=noir?"#b8935a":"#d9e4e1";
  /* the wall between dining room and kitchen, with a gap by the front for staff */
  rsWallRun(C,Wi-.14,0,.14,kd-1.2,60,pc,pt);
  rsWallRun(C,Wi,kd-.14,kw,.14,26,pc,pt);
  rsWallRun(C,Wt-.14,0,.14,kd-.14,26,pc,pt);
  if(H("r_s1"))lfOrderBoard(C,Wi+.5,96,"ORDERS");
  if(H("r_d2")&&!noir)rsS(C,"rsx_shelf",1.2,.02,1.8,.1,1,{flip:1,H:58,dy:-58,nosh:1});
  if(H("r_scr")&&C.room)C.walls.push(lfFaceY(Math.max(.6,Wi-7.4),0,126,scrMenu(SVC.restaurant.menu(C.room),LF.U*2.6,58)));
  if(H("r_d3")&&!noir&&st>0)lfSpr(C,"w_menu",Wi+3.6,.05,.1,.05,{h:1,flip:1,H:56,dy:-96,nosh:1});
  if(H("r_d4")&&!noir)lfSpr(C,"w_neonrs",st>0?Wi-2.2:1.0,.05,.1,.05,{h:1,flip:1,H:54,dy:-84,nosh:1});
  if(H("r_chef")&&!noir)lfSpr(C,"rs_chef",Wi+1.8,.05,.1,.05,{h:1,flip:1,H:26,dy:-112,nosh:1});
  if(H("r_star"))lfSpr(C,"rs_star",.05,2.4,.1,.1,{h:1,H:34,dy:-108,nosh:1});
  if(H("r_d7")&&st>0)lfSpr(C,"rdx_art",.9,.05,2.3,.05,{h:1,flip:1,dy:-44,nosh:1,nob:1});
  /* appliances along the back of the wing, an island in front of them */
  var isl=[0,2.0,2.5][st],bx=Wi+.35,ix=Wi+.5,back=function(k,w,d,h){rsS(C,k,bx,.15,w,d,h,{flip:1});var at=bx+w/2;bx+=w+.12;return at},front=function(k,w,d,h){rsS(C,k,ix,isl,w,d,h,{flip:1});var at=ix+w/2;ix+=w+.14;return at};
  var cookAt=back(H("r_k8")?"rsx_grand":H("r_k1")?"rsx_range":"rsx_hotplate",1.3,1.0,30);C.s("work",cookAt,1.5,-1,"work",[8,16],{tag:"cook"});
  back(H("r_k3")?"rsx_fridge":"rsx_minifridge",1.1,.9,50);
  if(st>0){if(H("r_k4"))back("rsx_grill",1.6,1.0,40);if(H("r_k5"))back("rsx_fryer",1.9,1.0,30);
    if(st>1&&H("r_k7")){var ov=back("rsx_oven",1.7,1.2,44);C.s("work",ov,1.8,-1,"work",[6,12],{tag:"oven"});lfLight(C,ov,1.0,40,"#ff9a3a",1.4,.5)}
    var prepAt=H("r_k2")?front("rsx_prep",2.0,.95,30):ix+1;C.s("work",prepAt,isl-.45,-1,"work",[6,10],{tag:"prep"});
    if(H("r_k6"))front("rsx_bake",.9,.8,50);if(H("r_k9")&&st>1)front("rsx_dish",1.6,.9,30)}
  else{var pz=H("r_k2")?back("rsx_prep",1.8,.95,30):bx+.8;C.s("work",pz,1.5,-1,"work",[6,10],{tag:"prep"})}
  if(H("r_cf2")&&st>0)rsS(C,"rs_coffee",Wt-1.7,isl,1.3,.9,26,{flip:1});else if(H("r_cf1"))rsS(C,"rsx_drip",st>0?Wt-1.3:Wt-1.0,st>0?isl:1.4,.7,.6,26,{flip:1});
  /* the pass is on the dining room side of that wall: food comes over it, and the good seats face it */
  var fine=H("r_c2")&&st>1,tiles=[1,2,2][st],td=1.8;
  for(var ti=0;ti<tiles;ti++)lfSpr(C,fine?"rdx_pass":"rsx_counter0",Wi-1.1,.2+ti*(td+.05),.95,td,{h:34,ctr:1});
  lfPrep(C,"pass",Wi-1.0,kd-.5);
  if(H("r_c1")||H("r_c2"))for(var tj=0;tj<tiles;tj++)[.45,1.35].forEach(function(o){var x=Wi-1.75,y=.2+tj*(td+.05)+o;lfSpr(C,"sbx_stool",x-.3,y-.3,.6,.6,{h:1,dk:.5,nob:1,nosh:1});
    var n0=C.st.length;C.s("sit",x,y,1,"eat",[10,20],{tag:"diner",lift:1,sz:10,wx:x-1.1,wy:y,tb:[x+.9,y]});lfConvert(C,n0,"sit",{uact:"eat",lbl:"S",grp:"s"})});
  /* booths down the window wall, tables on the rest of the floor with room to walk between them */
  if(H("r_b1")&&st>0)(st===2?[.7,4.3,7.9]:[.7,4.3]).forEach(function(Y){rsBooth(C,.25,Y)});
  ([[[2.6,2.9],[5.0,6.0]],[[5.7,2.4],[5.7,5.9],[9.4,7.2]],[[5.7,2.4],[9.8,2.4],[5.7,6.2],[9.8,6.2],[13.3,7.2]]])[st].forEach(function(p){rsDinner(C,p[0],p[1],"T")});
  if(H("r_more1")&&st>0)({1:[[5.7,9.5],[9.4,10.4]],2:[[5.7,10.2],[9.8,10.2]]})[st].forEach(function(p){rsDinner(C,p[0],p[1],"T")});
  if(H("r_more2")&&st>1&&LFSPR.rdx_curve){var cvx=12.2,cvy=10.4;lfSpr(C,"rdx_curve",cvx,cvy,3.6,3.3,{h:30,dk:2.4,ctr:1});/* the crescent opens toward you: its guests sort after its tall back and before the round table in front of them */
    [[cvx+1.0,cvy+1.0,1],[cvx+2.4,cvy+.9,-1]].forEach(function(q){var n0=C.st.length;rsSitAt(C,q[0],q[1],q[2],cvx+1.8,cvy+2.1,0,"V");for(var k=n0;k<C.st.length;k++)C.st[k].dk=(cvx+3.6+cvy+3.3-2.4+.5)-(C.st[k].x+C.st[k].y)});lfSpr(C,"rdx_tround",cvx+1.0,cvy+1.4,1.7,1.7,{h:26,ctr:1,dk:.6});lfSpr(C,"rdx_bucket",cvx-.8,cvy+2.1,.6,.6,{h:30,ctr:1})}
  lfWander(C,[[Wi-3,1.6,-1],[Wi*.6,D*.72,1],[Wi-1.6,D*.62,-1]]);
  /* light */
  if(H("r_l2")&&st>1)[[5.7,6.2],[9.8,6.2],[9.8,10.2]].forEach(function(p){lfSpr(C,"rdx_chand",p[0]-.5,p[1]-.5,1.0,1.0,{h:1,dy:-126,nosh:1,dk:-8,nob:1,ctr:1});lfLight(C,p[0],p[1],70,"#ffb46a",3,.7)});
  if(H("r_l1"))(st===0?[1.6]:st===1?[3.2,7.0]:[3.2,7.0,10.4]).forEach(function(y){lfSpr(C,"rdx_sconce",.05,y,.9,.05,{h:1,dy:-62,nosh:1,nob:1});lfLight(C,.7,y,70,"#ffc968",2,.35)});
  else if(st===0&&!H("r_l2")){rsS(C,"rsx_bulb",3.8,4.4,.2,.2,1,{H:96,dy:-84,nosh:1,dk:-6,nob:1});lfLight(C,3.8,4.4,60,"#ffe2a8",2.2,.28)}
  /* a few things in the corners, with air around them */
  if(!H("r_d1"))rsS(C,"rsx_mop",.25,D-1.4,.9,.9,24);
  if(H("r_d1"))lfSpr(C,"rdx_olive",.3,D-1.3,1,1,{h:40,ctr:1});
  if(H("r_d8")&&st>1)lfSpr(C,"rdx_olive",4.4,D-1.2,1,1,{h:40,ctr:1});
  if(H("r_d3")&&st>0)(st===2?[.9,4.5,8.1]:[.9,4.5]).forEach(function(y){lfSpr(C,"rdx_div",3.78,y,.25,2.5,{h:50,ctr:1})});
  if(H("r_d5")&&st>0)lfSpr(C,"rdx_wine",st===2?11.4:8.4,.1,1.6,.5,{h:60,flip:1,ctr:1,nosh:1});
  if(H("r_d6")&&st>0)lfSpr(C,"rdx_trolley",Wi-3.2,kd+1.2,.8,.8,{h:30,ctr:1});
  if(H("r_cool")&&st>0)lfSpr(C,"rsx_cooler",Wi-1.0,kd+.3,.8,.7,{h:50,ctr:1});
  if(H("r_hd2")&&noir)lfSpr(C,"rdx_host",Wi-1.5,D*.5+2.2,.9,.7,{h:30,ctr:1});else if(H("r_hd2"))lfSpr(C,"rs_host",Wi-1.5,D*.5+2.2,.8,.8,{h:30,ctr:1,H:64});else if(H("r_hd1"))rsS(C,"rsx_lectern",Wi-1.5,D*.5+2.2,.8,.8,30,{});
  if(H("r_sign")&&!patio)rsS(C,"rsx_aframe",Wi-.9,D*.5+.9,.7,.5,24);
  /* the patio fills the corner below the kitchen wing */
  if(patio){var P=[lfP(px,kd,0),lfP(Wt,kd,0),lfP(Wt,D,0),lfP(px,D,0)],pl=lfPoly(P,"#b98c5e","rgba(50,30,15,.6)",1);
    for(var q=.5;q<kw;q+=.5)pl+='<path d="M'+lfPt(lfP(px+q,kd,0))+' L'+lfPt(lfP(px+q,D,0))+'" stroke="rgba(60,35,15,.28)" stroke-width="1"/>';
    pl+=lfPoly([lfP(px,kd,0),lfP(px,D,0),lfP(px+.12,D,0),lfP(px+.12,kd,0)],"#6d4c2e","none");C.decals.push(pl);
    if(H("r_sign"))rsS(C,"rsx_aframe",px+3.4,D-.75,.7,.5,24,{dk:-.5});/* in front of the umbrella table, so drawn after it */
    if(H("r_p3")){rsS(C,"rsx_planter",px+.4,kd+.4,1.9,.7,16,{flip:1});rsS(C,"rsx_olive",Wt-1.1,kd+.3,.9,.9,50)}
    if(H("r_p1"))[[px+2.2,kd+2.4],[px+5.6,kd+2.4]].forEach(function(p){rsTable(C,"iron",p[0]-1,p[1]-1,"P")});
    if(H("r_p2"))[[px+4.3,D-2.0]].forEach(function(p){rsTable(C,"umb",p[0]-1,p[1]-1,"P")});
    if(H("r_p4")){rsS(C,"rsx_heater",px+3.7,kd+.5,.6,.6,60,{H:96});lfLight(C,px+4,kd+.8,70,"#ff9a3a",2.4,.5)}
    if(H("r_p6"))rsS(C,"rsx_bbq",px+4.7,kd+.3,1.7,1.0,28,{flip:1});
    if(H("r_p5")){rsS(C,"rsx_pergola",px+5.4,D-3.0,2.5,2.5,90,{dk:-4});lfLight(C,px+6.6,D-1.8,90,"#ffd890",3,.5)}
    if(H("r_p7"))rsS(C,"rsx_firepit",px+.4,D-3.0,2.5,2.5,24,{});
  }
};
(function(){RS_UPS.forEach(function(u){var n={r_t1:["Walnut Dining Tables","Long walnut tables for four, plates set, velvet chairs."],r_t2:["Marble Round Tables","Round marble tops, brass pedestals, flowers on every table."],r_t3:["White Linen Service","Square linen tables, crystal and candles. Tips go up."],r_b1:["Leather Booths","Real high-backed booths down the window wall. Guests sit inside them."],r_more2:["Curved Corner Booth","A big crescent banquette around a marble table. The best seat in the house."],r_more1:["Second Row of Tables","Two more tables means two more parties at once."],r_l2:["Brass Chandeliers","Sculptural brass over the room. Everything looks more expensive."],r_d7:["Oil Painting","One big piece on the wall, deep red and gold."],r_d8:["Olive Tree","A real tree in the corner of the dining room."],r_d3:["Walnut Dividers","Slatted screens give the booths some privacy."],r_d6:["Dessert Trolley","Cakes under glass come right to the table."],r_l1:["Brass Sconces","Warm light along the window wall."],r_d5:["Glass Wine Wall","Bottles lit from inside, right where guests can see them."],r_k7:["Wood-Fired Oven","A brick dome in the kitchen with a real fire."]}[u[0]];if(n){u[1]=n[0];u[4]=n[1]}});var drop={r_b2:1,r_bar:0,r_more2:0};RS_UPS=RS_UPS.filter(function(u){return !drop[u[0]]});
  RS_UPS.forEach(function(u){var e=u[3];
    if(u[0]==="r_more1"){e.also="r_x1"}
    if(u[0]==="r_c2"){u[4]="Black marble with a bronze edge and leather stools.";e.also="r_noir"}
    if(u[0]==="r_l2"){e.also="r_noir"}
    if(u[0]==="r_d8"){u[1]="Sculptural Vases";u[4]="Black ceramic and dry branches.";e.also="r_noir"}
    if(u[0]==="r_d5"){u[1]="Backlit Wine Wall"}
    if(u[0]==="r_d6"){u[3].cut=1}
    if(u[0]==="r_x2"){u[4]="A huge room with space between every table.";e.splash="The whole floor is yours now, and it has room to breathe. Next: go dark with Noir, and open the bar upstairs."}
    if(u[0]==="r_bar"){u[1]="Open the Upstairs Bar";u[4]="Stairs up to a moody cocktail bar in its own room above.";e.opens="skybar";e.also="r_x2";e.lv=30;e.splash="A staircase now leads up to a brand new room above the Restaurant: a dark cocktail bar with high-top tables. Tap the glowing door to go up."}});
  RS_UPS=RS_UPS.filter(function(u){return !u[3].cut});
  RS_UPS.push(["r_noir","Noir",2500,{p:.8,lv:28,g:"Expansion",also:"r_x2",splash:"The walls go charcoal, the floor goes dark walnut and the lights drop low. This is the look of a Michelin star."},"Charcoal walls, dark walnut floor, low light. Everything changes."]);
  RS_UPS.sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});ADDONS.restaurant=RS_UPS})();
