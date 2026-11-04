/* ---------- the world: three buildings, doors between rooms, and a room builder ----------
   Home, Business and Entertainment stand side by side on one street. A room's spot is one
   line in ROOMCELL. Most rooms open from an upgrade in the room next to them and connect by
   a glowing door with a floating arrow. New rooms are data: see roomDef and 27_rooms.js. */
var BLD=[{id:"home",name:"HOME",ac:"#b9a7ff"},{id:"biz",name:"BUSINESS",ac:"#ffb066"},{id:"fun",name:"ENTERTAINMENT",ac:"#ff6a9a"}];
/* room: [building, column, floor] */
var ROOMCELL={bedroom:[0,0,0],patio:[0,0,1],closet:[0,1,0],lair:[0,1,1],gameroom:[0,2,0],
 restaurant:[1,0,0],skybar:[1,0,1],rooftop:[1,0,2],boba:[1,1,0],dessert:[1,1,1],speakeasy:[1,1,2],garden:[1,2,0],
 theater:[2,0,0],auditorium:[2,0,1],club:[2,0,2],mall:[2,1,0],bowling:[2,1,1],karaoke:[2,1,2],arcade:[2,2,0],rhythm:[2,2,1],vr:[2,3,0]};
/* rooms you buy from an empty lot. Everything else opens from an upgrade. */
var ROOMBUY=[["restaurant",null],["garden","restaurant"],["boba","restaurant"],["theater","restaurant"]];
ROOMSOPEN={restaurant:1,garden:1,boba:1,theater:1};
function lotsOpen(){return ROOMBUY.filter(function(q){return !hasRoom(q[0])&&(!q[1]||hasRoom(q[1]))}).map(function(q){return q[0]})}
nextRoom=function(){return lotsOpen()[0]||null};
buildableList=function(){return lotsOpen().filter(function(k){return ROOMT[k].lv<=effLvl()})};
var LFCELLW=620,LFBGAP=200;
function worldLayout(){var B=S.base,used=BLD.map(function(){return {c:1,f:1}}),put=function(t){var q=ROOMCELL[t];if(!q)return;var u=used[q[0]];u.c=Math.max(u.c,q[1]+1);u.f=Math.max(u.f,q[2]+1)};
  B.slots.forEach(function(r){if(r)put(r.t)});lotsOpen().forEach(put);
  var rows=Math.max.apply(0,used.map(function(u){return u.f})),x=60,out=[];
  used.forEach(function(u,i){out.push({i:i,x:x,w:u.c*LFCELLW,f:u.f});x+=u.c*LFCELLW+LFBGAP});
  return {rows:rows,b:out,w:x-LFBGAP+60}}
function cellXY(t,L){var q=ROOMCELL[t]||[0,0,0],b=L.b[q[0]];return {x:b.x+LFCELLW*(q[1]+.5),y:LFROOF+118+(L.rows-1-q[2])*LFFP}}
function worldFacade(L){var bot=LFROOF+L.rows*LFFP-14,s='';
  s+='<defs><linearGradient id="lffg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6f1"/><stop offset="1" stop-color="#c3cddd"/></linearGradient></defs>';
  L.b.forEach(function(b){var top=LFROOF+(L.rows-b.f)*LFFP-40,B=BLD[b.i];
    s+='<rect x="'+b.x+'" y="'+top+'" width="'+b.w+'" height="'+(bot-top)+'" rx="12" fill="url(#lffg)" stroke="rgba(60,72,98,.35)" stroke-width="2"/>';
    for(var f=1;f<b.f;f++){var y=bot-f*LFFP+2;s+='<rect x="'+b.x+'" y="'+(y-5)+'" width="'+b.w+'" height="10" fill="#8d99b0"/>'}
    for(var c=1;c*LFCELLW<b.w;c++)s+='<rect x="'+(b.x+c*LFCELLW-3)+'" y="'+(top+24)+'" width="6" height="'+(bot-top-30)+'" fill="rgba(90,104,130,.22)"/>';
    s+='<rect x="'+(b.x-10)+'" y="'+(top-14)+'" width="'+(b.w+20)+'" height="22" rx="7" fill="#8d99b0"/>';
    var cx=b.x+b.w/2;s+='<g transform="translate('+cx+','+(top-40)+')"><rect x="-96" y="-18" width="192" height="36" rx="9" fill="#14121c" stroke="'+B.ac+'" stroke-width="2"/><text y="6" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="17" letter-spacing="2" fill="'+B.ac+'">'+B.name+'</text></g>'});
  /* ground and road run under all of them */
  s+='<rect x="-600" y="'+bot+'" width="'+(LFWW+1200)+'" height="34" fill="#cfd4dc"/><rect x="-600" y="'+(bot+34)+'" width="'+(LFWW+1200)+'" height="82" fill="#59606f"/>';
  for(var x=-560;x<LFWW+600;x+=110)s+='<rect x="'+x+'" y="'+(bot+73)+'" width="56" height="5" rx="2.5" fill="rgba(235,235,225,.55)"/>';
  return s}
function lotHtml(k){var T=ROOMT[k],lk=effLvl()<T.lv;lfSetDim("");var N=LF.W,s=lfSlab();
  s+=lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,N,0),lfP(0,N,0)],"#23212f","rgba(255,255,255,.22)",1.2,' stroke-dasharray="6 5"');
  s+=lfPoly([lfP(0,0,0),lfP(0,N,0),lfP(0,N,40),lfP(0,0,40)],"rgba(255,255,255,.05)","rgba(255,255,255,.14)",1,' stroke-dasharray="6 5"')+lfPoly([lfP(0,0,0),lfP(N,0,0),lfP(N,0,40),lfP(0,0,40)],"rgba(255,255,255,.07)","rgba(255,255,255,.14)",1,' stroke-dasharray="6 5"');
  s+=lk?'<g transform="translate(0,100)"><circle r="26" fill="rgba(20,18,28,.85)" stroke="rgba(255,200,87,.7)" stroke-width="2"/><rect x="-10" y="-3" width="20" height="15" rx="3" fill="#ffc857"/><path d="M-6 -3V-9a6 6 0 0 1 12 0V-3" fill="none" stroke="#ffc857" stroke-width="3"/></g>':lfPlusG();
  s+='<rect x="-128" y="136" width="256" height="40" rx="20" fill="#14121c" stroke="rgba(255,255,255,.4)" stroke-width="2"/><text y="162" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" font-family="Inter,sans-serif">'+esc(T.name)+(lk?' &middot; Level '+T.lv:' &middot; Build')+'</text>';
  return '<g data-lf="'+(lk?'lock:'+esc(T.name)+':'+T.lv:'build:'+S.base.slots.length)+'">'+s+'</g>'}
lfWorld=function(){
  var B=S.base,L=worldLayout(),rows=L.rows;LFWW=L.w;
  var bed=cellXY("bedroom",L);LFOX[0]=bed.x;LFOX[1]=bed.x+LFCELLW;
  var Hh=LFROOF+rows*LFFP+LFSTREET,s='';
  s+=lfSkyline(rows)+worldFacade(L);
  var order=[];B.slots.forEach(function(r,i){if(r)order.push(i)});
  order.sort(function(a,b){return ((ROOMCELL[B.slots[b].t]||[0,0,0])[2])-((ROOMCELL[B.slots[a].t]||[0,0,0])[2])||a-b});
  var meta={};
  lotsOpen().forEach(function(k){var p=cellXY(k,L);s+='<g class="lfroom" transform="translate('+p.x+','+p.y+')">'+lotHtml(k)+'</g>'});
  order.forEach(function(i){var r=B.slots[i],p=cellXY(r.t,L),DM=lfDimOf(r.t),LOFF=(DM[0]-DM[1])*13,RS=lfRsc(r.t);
    s+='<g class="lfroom" data-i="'+i+'" transform="'+(RS===1?'translate('+(p.x-LOFF)+','+p.y+')':'translate('+p.x+','+p.y+') scale('+RS+') translate('+(-LOFF)+',0)')+'">';
    var C=lfRoomCtx(r,i);meta[i]={C:C,p:p,r:r};
    s+='<g data-lf="room:'+i+'">'+lfRoomSvg(r,i,C)+'<g class="lfag" id="lfag'+i+'"></g>'+(C.LT?C.LT.post:'')+'</g>';
    if(LFW.wx==="rain"&&C.T.out)s+='<g class="lfrain" clip-path="url(#lfclip)" transform="translate('+LOFF+',150)">'+lfRainG(300,260,i+4)+'</g>';
    s+=lfRoomLabel(r,i);
    var pend=Math.floor(r.pend||0);
    if(pend>=1)s+='<g class="lfbub" data-lf="collect:'+i+'" transform="translate('+LOFF+',-70) scale('+(1/RS)+')"><g class="lfbob"><circle r="19" fill="#14121c" stroke="#ffc857" stroke-width="2"/><circle cy="-4" r="7" fill="#ffc857"/><text y="14" text-anchor="middle" class="lflbl" fill="#fff">'+pend+'</text></g></g>';
    s+='</g>'});
  s+='<g id="lfagS"></g><g id="lfwxo" pointer-events="none"></g>';
  window.LFMETA=meta;window.LFDIM={w:LFWW,h:Hh,rows:rows,F:rows,lockF:0};
  return '<defs><clipPath id="lfclip"><rect x="-240" y="-140" width="480" height="362"/></clipPath><radialGradient id="lftvg"><stop offset="0" stop-color="#6aa8ff" stop-opacity=".5"/><stop offset="1" stop-color="#6aa8ff" stop-opacity="0"/></radialGradient></defs><g id="lfw">'+s+'</g>'};
function lfInitViewOf(c){var cw=c.clientWidth||360,ch=c.clientHeight||520;LFV.s=Math.min(1.5,Math.max(.5,cw/700));var gy=LFROOF+118+(LFDIM.rows-1)*LFFP+20;LFV.s0=LFV.s;LFV.x=cw/2-LFOX[0]*LFV.s;LFV.y=ch*.5-gy*LFV.s;LFV.init=1;lfClamp();lfApply()}
lfInitView=lfInitViewOf;
/* ---- doors between rooms ----
   [from, to, wall, position, color, label]. "L" is the left wall at height y=position,
   "R" the back wall at x=position. The door shows once the target room exists. */
var PORTALS=[];
function portal(from,to,wall,pos,col,label){PORTALS.push([from,to,wall,pos,col||"#ffd27a",label||""])}
function rmPortals(C,r){PORTALS.forEach(function(q,n){if(q[0]!==r.t||!hasRoom(q[1]))return;var U=LF.U,w=1.5,hh=94,col=q[4],wall=q[2],pos=q[3];
    var door='<g><rect x="-4" y="-4" width="'+(U*w+8)+'" height="'+(hh+4)+'" fill="#17141f"/><rect class="prtG" width="'+(U*w)+'" height="'+hh+'" fill="'+col+'"/><rect class="prtH" x="-10" y="-10" width="'+(U*w+20)+'" height="'+(hh+12)+'" fill="none" stroke="'+col+'" stroke-width="5"/></g>';
    var hit=' data-act="gotoroom" data-t="'+q[1]+'" style="cursor:pointer"';
    C.walls.push('<g'+hit+'>'+(wall==="L"?lfFaceX(0,pos,hh+6,door):lfFaceY(pos,0,hh+6,door))+'</g>');
    /* the arrow floats outside the room, past the wall, pointing the way */
    var a=wall==="L"?lfP(-1.9,pos-w/2,70):lfP(pos+w/2,-1.9,70),rot=wall==="L"?-153:-27,nm=ROOMT[q[1]].name;
    C.front.push('<g'+hit+' transform="translate('+a[0].toFixed(1)+','+a[1].toFixed(1)+')"><g class="prtA"><g transform="rotate('+rot+')"><path d="M-24 -9H4V-20L30 0L4 20V9H-24Z" fill="'+col+'" stroke="#14121c" stroke-width="2.5" stroke-linejoin="round"/></g></g><rect x="-58" y="24" width="116" height="20" rx="10" fill="#14121c" stroke="'+col+'" stroke-width="1.2"/><text y="38" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="Inter,sans-serif">'+esc(q[5]||nm)+'</text></g>');
    C.portal=1;lfLight(C,wall==="L"?.6:pos-w/2,wall==="L"?pos-w/2:.6,50,col,2.2,.45)})}
var lfRoomCtxBase=lfRoomCtx;
var RMPORTAL_OK=1;
/* ---- rooms from data ----
   def: {name,lv,cost,coin,desc,wall,wain,acc,fl,size:[[w,d],...],H,stages:[upgrade ids that grow it],ups:[...],guests,people}
   an upgrade: [id,name,price,effect,line]; effect.art:[sprite,x,y,w,d,H,{flip,dy,wall}] or a list of them,
   effect.cust:[[x,y,face],...] are spots guests stop at; effect.opens names the room it adds. */
var ROOMDEF={};
function roomDef(t,d){ROOMDEF[t]=d;
  ROOMT[t]={name:d.name,lv:d.lv||0,cost:d.cost||0,coin:d.coin||0,store:d.store||8,desc:d.desc,bundled:!d.buy,dark:d.dark};
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
function roomDraw(C,t){var d=ROOMDEF[t],H=function(k){return C.has(k)};
  if(d.out)C.out=1;
  if(d.walls){var wc=d.walls(H);thWalls(C,wc[0],wc[1],wc[2])}
  if(d.floor){var fc=d.floor(H);if(fc)roomFloor(C,fc)}
  if(!d.out)lfDoorAt(C,C.W);else{C.s("door",C.W-.5,C.D-.5,1,"look",[1,1]);C.door={x:C.W-.5,y:C.D-.5}}
  var base=[[C.W*.5,C.D*.5,1],[C.W*.3,C.D*.7,-1],[C.W*.7,C.D*.3,1]];lfWander(C,base);
  (d.draw||function(){})(C,H);
  var one=function(q){var k=q[0],o=Object.assign({h:q[7]||30,ctr:1},q[6]||{});if(q[5])o.H=q[5];lfSpr(C,k,q[1],q[2],q[3],q[4],o)};
  (ADDONS[t]||[]).concat(d.base?[["",0,0,d.base]]:[]).forEach(function(u){var e=u[3];if(u[0]&&!H(u[0]))return;
    if(u[0]&&(window.RSSUP[u[0]]||[]).some(H))return;
    if(e.art){(Array.isArray(e.art[0])?e.art:[e.art]).forEach(one)}
    if(e.light)lfLight(C,e.light[0],e.light[1],e.light[2],e.light[3],e.light[4],e.light[5]);
    (e.cust||[]).forEach(function(s,i){lfCust(C,s[0],s[1],s[2],{wact:"look",uact:"look",lbl:"G",grp:"g",num:i+1,udur:[8,16]})});
    (e.work||[]).forEach(function(s){C.s("work",s[0],s[1],s[2]||1,"work",[6,12],{tag:"staff"})});
    if(e.fx)e.fx(C)})}
function roomFloor(C,f){var U=LF.U,W=C.W,D=C.D;var g='<rect width="'+U*(W-.08)+'" height="'+U*(D-.08)+'" fill="'+f[0]+'"/>';if(f[1]){var st=f[2]||1;for(var k=st;k<W;k+=st)g+='<path d="M'+U*k+' 0V'+U*D+'" stroke="'+f[1]+'" stroke-width="1"/>';for(var j=st;j<D;j+=st)g+='<path d="M0 '+U*j+'H'+U*W+'" stroke="'+f[1]+'" stroke-width="1"/>'}C.decals.push(lfFloorG(.04,.04,g))}
function genPeople(r,i,C,out){var d=ROOMDEF[r.t];if(!d)return;var a=r.a||{},seats=C.st.filter(function(s){return s.cust}).length;
  (d.staff||[]).forEach(function(q,j){if(!q[0]||a[q[0]])out.push({id:"st:"+r.t+j,room:i,role:"crew",look:rsNpc(q[1]),ix:j})});
  var n=Math.min(seats,(d.guests||2)+Math.floor(addonsOf(r).length/3));for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
function genNote(r){var d=ROOMDEF[r.t];if(!d||!d.stageNames)return "";return '<p class="note"><b>'+esc(d.stageNames[roomStageOf(r.t,r.a)]||d.name)+'.</b></p>'}
/* ---- the Restaurant: small and plain to start, dark and spacious at the end ---- */
RSSIZE=[[11,9],[18,12],[26,16]];RSNAME=["Hole in the Wall","Corner Diner","Noir"];
var RSCH=[["rtx_tb0","rtx_ch0",34,46],["rtx_tb1","rtx_ch1",38,50],["rtx_tb2","rtx_ch2",42,52],["rtx_tb3","rtx_ch3",44,54]];
function rsTier(C){return C.has("r_t3")?3:C.has("r_t2")?2:C.has("r_t1")?1:0}
/* guests sit behind the table, facing out, so a table never cuts through anyone */
function rsDinner(C,cx,cy,lbl){var T=RSCH[rsTier(C)],pair=[[cx-1.15,cy-.1,1],[cx-.1,cy-1.15,-1]];
  pair.forEach(function(p){lfSpr(C,T[1],p[0]-.3,p[1]-.3,.6,.6,{h:1,H:T[3],flip:p[2]>0?1:0,dk:.6,nob:1,nosh:1,ctr:1});
    var n0=C.st.length;C.s("sit",p[0],p[1],p[2],"eat",[10,20],{tag:"diner",lift:1,sz:5,wx:cx+1.3,wy:cy+1.3,tb:[cx,cy]});lfConvert(C,n0,"sit",{uact:"eat",lbl:lbl||"T",grp:lbl||"t"})});
  lfSpr(C,T[0],cx-.8,cy-.8,1.6,1.6,{h:28,H:T[2],ctr:1})}
function rsWalls(C){thWalls(C,"#191619","#141214","rgba(201,160,110,.14)");roomFloor(C,["#2b211b","rgba(0,0,0,.28)",.8])}
LFROOM.restaurant=function(C){
  rsArtReady();
  var H=function(k){return C.has(k)},st=H("r_x2")?2:H("r_x1")?1:0,Wi=RSSIZE[st][0],D=RSSIZE[st][1],patio=H("r_patio"),px=Wi,noir=H("r_noir")&&st===2;
  C.rsW=patio?Wi:0;
  if(noir)rsWalls(C);
  lfDoorAt(C,Wi);
  [[4.2],[3.6,8.0],[4.0,9.5,13.2]][st].forEach(function(y){lfSprWin(C,"w_winrs2",.05,y,.1,.05,{H:92,dy:-34})});
  C.obsc=.7;
  if(H("r_s1"))lfOrderBoard(C,1.0,96,"ORDERS");
  if(st>0)lfSpr(C,noir?"rtx_pass":"w_pass",7.6,.05,.1,.05,{flip:1,h:1,H:150,dy:-8,nosh:1});
  if(H("r_d2")&&!noir)lfSpr(C,"gdx_seat",0,0,0,0,{}),rsS(C,"rsx_shelf",1.2,.02,1.8,.1,1,{flip:1,H:58,dy:-58,nosh:1});
  if(H("r_scr")&&C.room)C.walls.push(lfFaceY(st>0?4.0:2.8,0,126,scrMenu(SVC.restaurant.menu(C.room),LF.U*2.6,58)));
  if(H("r_d3")&&!noir&&st>0)lfSpr(C,"w_menu",13.2,.05,.1,.05,{h:1,flip:1,H:56,dy:-96,nosh:1});
  if(H("r_d4")&&!noir)lfSpr(C,"w_neonrs",st>0?10.4:5.6,.05,.1,.05,{h:1,flip:1,H:54,dy:-84,nosh:1});
  if(H("r_chef")&&!noir)lfSpr(C,"rs_chef",3.0,.05,.1,.05,{h:1,flip:1,H:26,dy:-112,nosh:1});
  if(H("r_star"))lfSpr(C,"rs_star",.05,2.2,.1,.1,{h:1,H:34,dy:-108,nosh:1});
  if(H("r_d7"))lfSpr(C,"rtx_art",.05,D-1.3,.1,.1,{h:1,H:84,dy:-40,nosh:1});
  /* the kitchen keeps to the back wall */
  var ky=.15;
  rsS(C,H("r_k8")?"rsx_grand":H("r_k1")?"rsx_range":"rsx_hotplate",.5,ky,1.2,1.0,30,{flip:1});
  C.s("work",1.1,1.5,-1,"work",[8,16],{tag:"cook"});
  if(H("r_k2"))rsS(C,"rsx_prep",2.0,ky,2.2,1.0,30,{flip:1});
  C.s("work",3.1,1.5,-1,"work",[6,10],{tag:"prep"});
  rsS(C,H("r_k3")?"rsx_fridge":"rsx_minifridge",4.6,ky,1.1,.9,50,{flip:1});
  if(st===0||!H("r_k3"))rsS(C,"rsx_rack",6.0,ky,1.0,.8,50,{flip:1});
  if(H("r_cf2"))rsS(C,"rs_coffee",st>0?14.8:7.6,ky,1.6,1.0,26,{flip:1});else if(H("r_cf1"))rsS(C,"rsx_drip",7.6,ky,.8,.7,26,{flip:1});
  if(st>0){if(H("r_k4"))rsS(C,"rsx_grill",8.6,ky,1.6,1.0,40,{flip:1});if(H("r_k5"))rsS(C,"rsx_fryer",10.6,ky,2.0,1.0,30,{flip:1});if(H("r_k9")&&st>1)rsS(C,"rsx_dish",17,ky,1.6,.9,30,{flip:1});if(H("r_k6"))rsS(C,"rsx_bake",13.2,ky,.9,.8,50,{flip:1})}
  if(st>1&&H("r_k7")){rsS(C,"rsx_oven",19.2,ky,1.8,1.5,44,{flip:1});C.s("work",20,2.2,-1,"work",[6,12],{tag:"oven"});lfLight(C,20,1.2,40,"#ff9a3a",1.6,.6)}
  /* the counter */
  var cy=2.5,cl=[4.2,7.0,9.0][st],cx0=1.0;
  if(H("r_c2")&&st>1)rsS(C,"rtx_ctr",cx0,cy,cl,1.1,34,{flip:1,dk:cl*.5});else if(H("r_c1"))rsS(C,"rs2_counter",cx0,cy,cl,1.1,34,{flip:1,dk:cl*.5});else rsS(C,"rsx_counter0",cx0,cy,4.0,1.2,34,{flip:1,dk:2});
  lfPrep(C,"pass",cx0+cl*.5,1.6);
  /* stools: guests face the counter with their backs to us */
  if(H("r_c1")||H("r_c2")){var fancy=H("r_c2")&&st>1;[0,1,2,3,4].slice(0,[0,4,5][st]).forEach(function(k){var x=cx0+1.0+k*1.55,y=cy+1.75;lfSpr(C,fancy?"rtx_stool":"rs2_stool",x-.3,y-.3,.6,.6,{h:1,H:fancy?52:48,dk:.5,nob:1,nosh:1});
    var n0=C.st.length;C.s("sit",x,y,1,"eat",[10,20],{tag:"diner",lift:1,sz:10,facewall:1,dk:0,wx:x,wy:y+1});lfConvert(C,n0,"sit",{uact:"eat",lbl:"S",grp:"s"})})}
  /* banquette along the window wall, once there is room */
  if(H("r_b1")&&st>0){var by=st===2?[5.8,10.0]:[6.0];by.forEach(function(Y){lfSpr(C,"rtx_banq",.1,Y,1.1,3.0,{h:24,H:72,nosh:1});[[.8,Y+.8],[.8,Y+2.2]].forEach(function(p){var n0=C.st.length;C.s("sit",p[0],p[1],1,"eat",[10,20],{tag:"diner",lift:1,sz:6,wx:3.6,wy:p[1],tb:[2.1,Y+1.5]});lfConvert(C,n0,"sit",{uact:"eat",lbl:"B",grp:"b"})});var T=RSCH[rsTier(C)];lfSpr(C,T[0],1.5,Y+.8,1.4,1.4,{h:28,H:T[2],ctr:1})})}
  /* tables, far apart */
  var spots=[[[3.0,6.2],[7.4,6.2]],[[5.4,7.0],[10.0,7.0],[14.6,7.0]],[[7.2,7.6],[12.4,7.6],[17.6,7.6],[22.4,7.6]]][st];
  spots.forEach(function(p){rsDinner(C,p[0],p[1],"T")});
  if(H("r_more1")&&st>0)({1:[[7.7,10.0],[12.3,10.0]],2:[[9.8,11.8],[15.0,11.8]]})[st].forEach(function(p){rsDinner(C,p[0],p[1],"T")});
  if(H("r_more2")&&st>1)[[20.2,11.8],[5.8,13.4]].forEach(function(p){rsDinner(C,p[0],p[1],"T")});
  lfWander(C,[[Wi*.5,cy+2.6,-1],[Wi*.75,cy+2.6,1],[Wi-1.6,D*.5,-1]]);
  /* light */
  if(H("r_l2")&&st>1)[[7.2,7.6],[12.4,7.6],[17.6,7.6],[22.4,7.6]].forEach(function(p){lfSpr(C,"rtx_pend",p[0],p[1],.2,.2,{h:1,H:150,dy:-74,nosh:1,dk:-6,nob:1});lfLight(C,p[0],p[1],60,"#ffb46a",2.6,.7)});
  else if(H("r_l1"))[0,1,2].forEach(function(i){var x=cx0+cl*(.2+.3*i);lfSpr(C,["rs_pend1","rs_pend2","rs_pend3"][i],x,cy+.7,.2,.2,{h:1,H:[84,92,88][i],dy:-70,nosh:1,dk:-5,nob:1});lfLight(C,x,cy+.9,70,"#ffc968",2.3,.45)});
  else{var bx=Wi*.46,by2=D*.6;rsS(C,"rsx_bulb",bx,by2,.2,.2,1,{H:96,dy:-84,nosh:1,dk:-6,nob:1});lfLight(C,bx,by2,80,"#ffe2a8",2.6,.4)}
  /* a few things, against the walls, with air around them */
  if(!H("r_d1"))rsS(C,"rsx_mop",.25,D-1.4,.9,.9,24);
  if(H("r_d1")&&!noir)lfSpr(C,"bd_plant",.3,D-1.2,.8,.8,{h:40,H:78});
  if(H("r_d8")&&noir){lfSpr(C,"rtx_vase",.3,D-1.3,.7,.7,{h:40,H:96});lfSpr(C,"rtx_vase",Wi-1.4,.4,.7,.7,{h:40,H:96})}
  if(H("r_cool")&&st>0&&!noir)rsS(C,"rsx_cooler",Wi-1.8,.3,1.1,.9,50,{flip:1});
  if(H("r_d5")&&st>0)rsS(C,"rtx_wine",Wi-3.4,.1,1.4,.5,50,{flip:1,H:118});
  if(H("r_hd2")&&noir)lfSpr(C,"rtx_host",Wi-1.7,D*.5-2.3,.9,.7,{h:30,flip:1,H:66});else if(H("r_hd2"))lfSpr(C,"rs_host",Wi-1.5,D*.5-2.3,.8,.8,{h:30,flip:1,H:64});else if(H("r_hd1"))rsS(C,"rsx_lectern",Wi-1.5,D*.5-2.3,.8,.8,30,{flip:1});
  if(H("r_sign")&&!patio)rsS(C,"rsx_aframe",Wi-.9,D*.5+1.6,.7,.5,24);
  if(patio){var P=[lfP(px,0,0),lfP(C.W,0,0),lfP(C.W,D,0),lfP(px,D,0)],pl=lfPoly(P,"#b98c5e","rgba(50,30,15,.6)",1);
    for(var q=.5;q<RSPATIO;q+=.5)pl+='<path d="M'+lfPt(lfP(px+q,0,0))+' L'+lfPt(lfP(px+q,D,0))+'" stroke="rgba(60,35,15,.28)" stroke-width="1"/>';
    pl+=lfPoly([lfP(px,0,0),lfP(px,D,0),lfP(px+.12,D,0),lfP(px+.12,0,0)],"#6d4c2e","none");C.decals.push(pl);
    if(H("r_sign"))rsS(C,"rsx_aframe",C.W-.9,D*.5+1.6,.7,.5,24);
    for(var rx=px+.3;rx<C.W-1;rx+=2.2)rsS(C,"rsx_rail",rx,.1,2.2,.2,20,{flip:1,nosh:1,nob:1,dk:99});
    if(H("r_p3")){rsS(C,"rsx_planter",px+.4,.5,1.9,.7,16,{flip:1});rsS(C,"rsx_olive",C.W-1.2,.5,.9,.9,50)}
    if(H("r_p1"))[[px+2.0,3.2],[px+5.2,3.2]].forEach(function(p){rsTable(C,"iron",p[0]-1,p[1]-1,"P")});
    if(H("r_p2"))[[px+2.0,D-4.2]].forEach(function(p){rsTable(C,"umb",p[0]-1,p[1]-1,"P")});
    if(H("r_p4")){rsS(C,"rsx_heater",px+3.6,4.6,.6,.6,60,{H:96});lfLight(C,px+3.9,4.9,70,"#ff9a3a",2.4,.5)}
    if(H("r_p6"))rsS(C,"rsx_bbq",C.W-2.1,D-5.8,1.7,1.0,28,{flip:1});
    if(H("r_p5")){rsS(C,"rsx_pergola",px+3.6,D-5,3.2,3.2,90,{dk:-4});lfLight(C,px+5.2,D-3.4,90,"#ffd890",3,.5)}
    if(H("r_p7"))rsS(C,"rsx_firepit",px+.6,D-3.2,2.6,2.6,24,{});
  }
};
(function(){var drop={r_b2:1,r_bar:0,r_more2:0};RS_UPS=RS_UPS.filter(function(u){return !drop[u[0]]});
  RS_UPS.forEach(function(u){var e=u[3];
    if(u[0]==="r_more1"){e.also="r_x1"}
    if(u[0]==="r_t3"){u[1]="Fine Dining Sets";u[4]="Black lacquer, charcoal velvet, one candle per table."}
    if(u[0]==="r_c2"){u[4]="Black marble with a bronze edge and leather stools.";e.also="r_noir"}
    if(u[0]==="r_b1"){u[1]="Wall Banquettes";u[4]="Long charcoal leather seating down the window wall."}
    if(u[0]==="r_l2"){u[1]="Smoked Glass Pendants";u[4]="One low amber pool of light over every table.";e.also="r_noir"}
    if(u[0]==="r_d7"){u[1]="Bronze Leaf Painting";u[4]="One big dark canvas on the far wall."}
    if(u[0]==="r_d8"){u[1]="Sculptural Vases";u[4]="Black ceramic and dry branches.";e.also="r_noir"}
    if(u[0]==="r_d5"){u[1]="Backlit Wine Wall"}
    if(u[0]==="r_d6"){u[3].cut=1}
    if(u[0]==="r_x2"){u[4]="A huge room with space between every table.";e.splash="The whole floor is yours now, and it has room to breathe. Next: go dark with Noir, and open the bar upstairs."}
    if(u[0]==="r_bar"){u[1]="Open the Upstairs Bar";u[4]="Stairs up to a moody cocktail bar in its own room above.";e.opens="skybar";e.also="r_x2";e.lv=30;e.splash="A staircase now leads up to a brand new room above the Restaurant: a dark cocktail bar with high-top tables. Tap the glowing door to go up."}});
  RS_UPS=RS_UPS.filter(function(u){return !u[3].cut});
  RS_UPS.push(["r_noir","Noir",2500,{p:.8,lv:28,g:"Expansion",also:"r_x2",splash:"The walls go charcoal, the floor goes dark walnut and the lights drop low. This is the look of a Michelin star."},"Charcoal walls, dark walnut floor, low light. Everything changes."]);
  RS_UPS.sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});ADDONS.restaurant=RS_UPS})();
