/* ---------- the movie theater ----------
   Starts as a lobby: guests line up, buy a ticket and vanish through the double doors.
   "Open the Auditorium" builds what is behind those doors as a room of its own. */
ROOMT.theater=Object.assign(ROOMT.theater,{lv:24,cost:9000,coin:40,store:8,desc:"A small cinema lobby. Guests line up, buy a ticket and walk through the double doors. Later you add snacks, a bar and the auditorium behind those doors."});
ROOMT.auditorium=Object.assign(ROOMT.auditorium,{coin:50,store:8,desc:"The screening room behind the double doors. Better seats, sound and a bigger screen bring in more money."});
var TH_UPS=[
 /* snacks */
 ["t_pop","Popcorn Cart",1500,{p:.15,lv:24,g:"Snacks",menu:"Popcorn"},"The smell sells itself."],
 ["t_soda","Soda Fountain",1800,{p:.15,lv:25,g:"Snacks",menu:"Soda"},"Ice-cold refills."],
 ["t_ctr","Concession Stand",5000,{p:.3,lv:28,g:"Snacks",menu:"Combo"},"A proper counter. Guests stop for snacks on the way in."],
 ["t_candy","Candy Case",3000,{p:.15,lv:29,g:"Snacks",menu:"Candy"},"A glass case of sweets."],
 ["t_dog","Hot Dog Roller",3500,{p:.15,lv:30,g:"Snacks",menu:"Hot Dog"},"Rolling all day."],
 ["t_nacho","Nacho Station",3500,{p:.15,lv:31,g:"Snacks",menu:"Nachos"},"Warm cheese, big margins."],
 ["t_lux2","Gourmet Concessions",24000,{p:.35,lv:50,g:"Snacks"},"Copper popcorn, a pastry case and fancy nachos."],
 /* floors */
 ["t_fl1","Carpet Runner",1200,{p:.08,lv:25,g:"Floors"},"A red runner to the double doors."],
 ["t_fl2","Cinema Carpet",6000,{p:.15,lv:33,g:"Floors"},"Patterned wall to wall, the way a cinema should be."],
 ["t_fl3","Marble Lobby",20000,{p:.3,lv:48,g:"Floors"},"Polished marble and a wine-red runner."],
 /* walls */
 ["t_wl1","Painted Walls & Trim",1600,{p:.08,lv:26,g:"Walls"},"Deep red paint and cream trim."],
 ["t_wl2","Velvet Walls & Sconces",8000,{p:.2,lv:36,g:"Walls"},"Dark velvet panels and warm wall lights."],
 ["t_wl3","Gold Trim",16000,{p:.25,lv:47,g:"Walls"},"Gold panel lines around the whole room."],
 /* decorations */
 ["t_bins","Lobby Bins",400,{p:.05,lv:24,g:"Decor"},"Brass bins by the line, for wrappers and cups."],
 ["t_marq","Neon Marquee",2500,{p:.15,lv:26,g:"Decor"},"Bulbs on the wall, lines at the door."],
 ["t_tv","Trailer Screen",3000,{p:.15,lv:27,g:"Decor"},"Trailers on a loop while people wait."],
 ["t_standee","Movie Standee",1500,{p:.08,lv:27,g:"Decor"},"Everyone takes a picture with it."],
 ["t_reel","Film Reel Wall Art",2000,{p:.08,lv:28,g:"Decor"},"Giant gold reel over the seating."],
 ["t_clap","Neon Clapboard",2500,{p:.1,lv:30,g:"Decor"},"Glows blue and pink."],
 ["t_sofa","Lobby Sofas",3000,{p:.1,lv:31,g:"Decor"},"Early arrivals sit here."],
 ["t_arc","Arcade Cabinet",4000,{p:.15,lv:32,g:"Decor"},"Something to do before the show."],
 ["t_claw","Claw Machine",4000,{p:.15,lv:33,g:"Decor"},"A glass box of plush toys and a three-prong claw."],
 ["t_sofa2","Leather Sofas",10000,{p:.15,lv:44,g:"Decor"},"Black leather with gold piping."],
 ["t_chand","Lobby Chandeliers",18000,{p:.25,lv:46,g:"Decor",also:"t_wing"},"A real entrance."],
 ["t_booth1","Classic Ticket Booth",2200,{p:.15,lv:26,g:"Decor"},"Red, gold and a little glass window."],
 ["t_lux4","Gold Ticket Booth",28000,{p:.3,lv:55,g:"Decor"},"Marble and gold, with gold bins to match."],
 /* the bar */
 ["t_bar","Cocktail Bar",14000,{p:.4,lv:38,g:"Bar",also:"t_wing",menu:"Cocktail",splash:"Grown-ups now stop for a drink on the way in, and every drink is pure profit."},"A dark bar and stools. Pull up and order a drink."],
 ["t_bar2","Liquor Wall",8000,{p:.2,lv:40,g:"Bar"},"Backlit bottles floor to ceiling."],
 ["t_taps","Brass Tap Bar",22000,{p:.4,lv:52,g:"Bar"},"Marble top, brass taps, velvet stools."],
 /* staff */
 ["t_st1","Hire an Usher",3000,{p:.2,lv:29,g:"Staff"},"Keeps the line moving."],
 ["t_st2","Concession Staff",5000,{p:.25,lv:31,g:"Staff",also:"t_ctr"},"Someone behind the counter."],
 ["t_st3","Hire a Bartender",7000,{p:.25,lv:39,g:"Staff",also:"t_bar"},"Knows your usual."],
 /* the building */
 ["t_aud","Open the Auditorium",15000,{p:.5,lv:25,g:"Expansion",opens:"auditorium",splash:"You can finally see what is behind the double doors. The Auditorium is now a room of its own, with its own upgrades: seats, projector, walls, floors and, one day, an IMAX screen."},"Builds the room behind the double doors."],
 ["t_wing","Expand the Lobby",12000,{p:.4,cap:2,lv:34,g:"Expansion",splash:"The lobby is much bigger now, with room for a bar and a longer line."},"A bigger lobby, a longer line and room for a bar."]
];
TH_UPS.sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});
ADDONS.theater=TH_UPS;
var AU_UPS=[
 ["au_aisle","Aisle Lights",3000,{p:.1,lv:32,g:"Floors"},"Glowing step edges."],
 ["au_carpet","Plush Carpet",5000,{p:.12,lv:34,g:"Floors"},"Deep wine carpet on every tier."],
 ["au_wall1","Acoustic Panels",6000,{p:.15,lv:35,g:"Walls"},"Dark fabric panels, clean sound."],
 ["au_sound","Surround Sound",9000,{p:.25,lv:37,g:"Sound"},"You feel the bass."],
 ["au_scr2","Bigger Screen",12000,{p:.4,lv:40,g:"Screen"},"The picture nearly fills the wall."],
 ["au_rows","Back Row",14000,{p:.3,lv:42,g:"Seats"},"A fourth, higher row of seats."],
 ["au_proj1","Digital Projector",16000,{p:.4,lv:44,g:"Projector"},"No more scratches and flicker."],
 ["au_recline","Leather Recliners",22000,{p:.5,lv:48,g:"Seats"},"Black leather seats that lean back."],
 ["au_wall2","Velvet Walls",18000,{p:.25,lv:50,g:"Walls"},"Dark velvet from floor to ceiling."],
 ["au_lux2","Gold Trim & Marble Landing",20000,{p:.25,lv:54,g:"Walls"},"Gold sconces and a marble back landing."],
 ["au_lux3","Reference Speaker Towers",26000,{p:.35,lv:58,g:"Sound"},"Gold speaker towers beside the screen."],
 ["au_proj2","IMAX Laser Projector",40000,{p:.7,lv:60,g:"Projector"},"Bright enough for a very large screen."],
 ["au_imax","IMAX Screen",50000,{p:.9,lv:62,g:"Screen",also:"au_proj2",splash:"Wall to wall, floor to ceiling. People will drive across town for this."},"Wall-to-wall picture."],
 ["au_lux1","Velvet VIP Seating",38000,{p:.6,lv:65,g:"Seats"},"Tufted velvet seats throughout."],
 ["au_lux4","Vintage Gold Projector",30000,{p:.3,lv:70,g:"Projector"},"A gold-plated showpiece in the back."]
];
ADDONS.auditorium=AU_UPS;
Object.assign(ADDREQ,{t_fl2:"t_fl1",t_fl3:"t_fl2",t_wl2:"t_wl1",t_wl3:"t_wl2",t_sofa2:"t_sofa",t_bar2:"t_bar",t_taps:"t_bar",t_lux2:"t_ctr",t_lux4:"t_booth1",au_recline:"au_rows",au_lux1:"au_recline",au_wall2:"au_wall1",au_proj2:"au_proj1",au_imax:"au_scr2",au_lux3:"au_sound",au_lux4:"au_proj2"});
Object.assign(window.RSSUP,{t_fl1:["t_fl2"],t_fl2:["t_fl3"],t_wl1:["t_wl2"],t_wl2:["t_wl3"],t_sofa:["t_sofa2"],au_recline:["au_lux1"],au_rows:[],au_wall1:["au_wall2"],au_scr2:["au_imax"],au_proj1:["au_proj2"]});
Object.assign(window.RSTCH,{t_fl2:1,t_fl3:1,t_wl2:1,t_wl3:1,t_sofa2:1,t_bar2:1,t_taps:1,t_lux2:1,au_lux1:1,au_recline:1,au_wall2:1,au_proj2:1,au_imax:1,au_lux3:1,au_lux4:1});
delete SVC.theater;

var THSIZE=[[12,9],[16,10]];
function thRoom(){var B=S&&S.base;return B&&B.slots?B.slots.filter(function(r){return r&&r.t==="theater"})[0]:null}
var thDimBase=lfDimOf;
lfDimOf=function(t){if(t!=="theater")return thDimBase(t);var r=thRoom();return THSIZE[r&&r.a&&r.a.t_wing?1:0]};
LFRS.theater=.86;
/* a flat colored wall behind everything else */
function thWalls(C,col,col2,trim){var D=C.D,W=C.W,Hh=LF.H,P=lfP;
  C.walls.push(lfPoly([P(0,0,0),P(0,D,0),P(0,D,Hh),P(0,0,Hh)],col,"none")+lfPoly([P(0,0,0),P(W,0,0),P(W,0,Hh),P(0,0,Hh)],col2,"none"));
  if(!trim)return;var s='';[0,1].forEach(function(side){var N=side?W:D;for(var u=0;u<N-.4;u+=1.8){var a=side?P(u+.2,0,8):P(0,u+.2,8),b=side?P(u+1.6,0,8):P(0,u+1.6,8),c=side?P(u+1.6,0,Hh-14):P(0,u+1.6,Hh-14),d=side?P(u+.2,0,Hh-14):P(0,u+.2,Hh-14);s+=lfPoly([a,b,c,d],"none",trim,1)}});C.walls.push(s)}
LFROOM.theater=function(C){
  rsArtReady();
  var H=function(k){return C.has(k)},U=LF.U,W=C.W,D=C.D,wing=H("t_wing"),lux2=H("t_lux2"),lux4=H("t_lux4");
  /* walls and floors first: everything else sits on top */
  if(H("t_wl3"))thWalls(C,"#2e1420","#27111b","#e8c56a");else if(H("t_wl2"))thWalls(C,"#2e1420","#27111b","rgba(0,0,0,.35)");else if(H("t_wl1"))thWalls(C,"#7a2a36","#6c2430");
  if(H("t_fl3"))C.decals.push(lfFloorG(.05,.05,'<rect width="'+U*(W-.1)+'" height="'+U*(D-.1)+'" fill="#e6e0d2"/><path d="'+Array.apply(0,Array(Math.ceil(W))).map(function(_,k){return 'M'+U*k+' 0V'+U*(D-.1)}).join("")+Array.apply(0,Array(Math.ceil(D))).map(function(_,k){return 'M0 '+U*k+'H'+U*(W-.1)}).join("")+'" stroke="rgba(0,0,0,.08)"/>'));
  else if(H("t_fl2")){var pat='<rect width="'+U*(W-.1)+'" height="'+U*(D-.1)+'" fill="#3c1020"/>';for(var ci=0;ci<W*2;ci++)for(var cj=0;cj<D*2;cj++)pat+='<circle cx="'+(ci*U/2+7)+'" cy="'+(cj*U/2+7)+'" r="3" fill="'+((ci+cj)%2?"#b0344a":"#d9a441")+'" opacity=".55"/>';C.decals.push(lfFloorG(.05,.05,pat))}
  if(H("t_fl1")||H("t_fl3"))C.decals.push(lfFloorG(.5,3.2,lfRr(0,0,U*(W-1.2),U*1.5,3,H("t_fl3")?"#6a1830":"#7a1a2c","rgba(0,0,0,.3)")+'<rect x="4" y="4" width="'+(U*(W-1.2)-8)+'" height="'+(U*1.5-8)+'" fill="none" stroke="rgba(255,210,122,.6)" stroke-width="1.2"/>'));
  /* the double doors on the left wall: glow in the gap when somebody goes through */
  var audOn=H("t_aud"),dg='<rect class="thdoorgap" width="'+U*1.9+'" height="96" fill="#fff2c0" opacity="0"/>';
  C.walls.push(lfFaceX(0,5.1,104,lfGoDoor(C,0,5.1,104,1.9,audOn?"gotoaud":"thdoorlock",audOn?"SCREEN 1":"NOW SHOWING",audOn?"#ffd27a":"#ff9a6a")+dg));
  C.thq={x:4.7,y:2.5,dx:.95,door:[.75,4.2],xmax:wing?11.4:W-1.3};
  /* the ticket booth, the rope and the line */
  lfSpr(C,lux4?"loL_sign":H("t_booth1")?"lo_booth":"thx_booth0",3.5,.2,1.9,1.5,{h:34,flip:1,ctr:1,H:96});
  C.s("work",2.9,1.5,1,"look",[6,14],{tag:"clerk"});
  var ropeEnd=10.2;for(var rx=4.5;rx<ropeEnd;rx+=1.8)lfSpr(C,"thx_rope",rx,3.25,1.8,.15,{h:6,flip:1,ctr:1,nosh:1,sh:1,dk:-.2});
  /* the screens */
  thBoard(C,6.2,72,H);
  if(H("t_tv"))C.walls.push(lfFaceX(0,2.9,110,scrTrailer(C,U*2.2,56)));
  lfW1(C,"w_thposter",.05,D-.7,64,-70,0);
  if(H("t_marq"))lfW1(C,"w_thmarq",.05,6.7,34,-108,0);
  if(H("t_reel"))lfW1(C,"w_threel",.05,5.9,38,-70,0);/* QA audit: at 8.2 it hung behind the film poster (8.3); now between the Screen 1 doors and the sconce */
  if(H("t_clap"))lfW1(C,"w_thclap",2.2,.05,46,-96,1);
  if(H("t_wl2"))(H("t_tv")?[7.1]:[1.6,7.1]).forEach(function(y){lfW1(C,"w_thsconce",.05,y,44,-60,0)});/* the 1.6 sconce would sit on the trailer screen */
  /* the concession against the left wall, facing the carpet (QA design review): the stand, a staff aisle, and the candy,
     hot dog and nachos on a back counter on the wall behind it; popcorn at the stand's near end, soda at its far end */
  var lx=lux2,cx=1.8;
  if(H("t_candy"))lfSpr(C,lx?"loL_candy":"lo_candy",.15,5.7,.9,1.0,{h:28,ctr:1,H:56});
  if(H("t_dog"))lfSpr(C,lx?"loL_dog":"lo_dog",.15,6.75,.9,1.0,{h:28,ctr:1,H:58});
  if(H("t_nacho"))lfSpr(C,lx?"loL_nacho":"lo_nacho",.15,7.8,.9,1.0,{h:28,ctr:1,H:58});
  if(H("t_ctr")){lfSpr(C,lux4?"loL_ctr":"lo_ctr",cx,6.0,1.2,2.0,{h:30,ctr:1,H:lux4?70:78});C.thsnack=[cx+1.9,7.0];C.s("work",cx-.5,7.0,1,"work",[6,12],{tag:"concession"})}
  if(H("t_pop")){lfSpr(C,lx?"loL_pop":"lo_pop",cx+.1,5.0,1.0,.95,{h:30,ctr:1,H:92});C.front.push(lfSteam(cx+.5,5.4,60,2));if(!C.thsnack)C.thsnack=[cx+1.8,5.5]}
  if(H("t_soda")){lfSpr(C,"lo_soda",cx+.05,8.05,1.05,.85,{h:30,ctr:1,H:80});if(!C.thsnack)C.thsnack=[cx+1.8,8.4]}
  /* along the back and the sides */
  /* games at the back right, behind the end of the line; the standee by the box office */
  if(H("t_arc"))lfSpr(C,"thx_arcade",8.4,.2,1.1,1.0,{h:40,flip:1,ctr:1,H:92});
  if(H("t_claw"))lfSpr(C,"thx_claw",9.7,.2,1.1,1.0,{h:40,flip:1,ctr:1,H:90});
  /* two sofas in an L in the back-left corner under the trailer screen (QA design review) */
  if(H("t_sofa")){var sk=H("t_sofa2")?"thL_sofa":"th_sofa";lfSpr(C,sk,.2,.5,1.2,2.4,{h:30,H:58});lfSpr(C,sk,1.6,.2,1.6,1.1,{h:30,H:58,flip:1})}
  /* the standee by the entrance mat, where people walk in and take the picture */
  if(H("t_standee"))lfSpr(C,"thx_standee",W-1.9,6.7,.8,.5,{h:30,ctr:1,H:84});
  /* the bins by the concession; the poster stand stays out of the picture (it hid the liquor wall and had no poster) */
  if(H("t_bins"))lfSpr(C,lux4?"loL_bins":"lo_bins",3.4,5.2,.8,.8,{h:26,ctr:1,H:52});
  /* the wing: the bar */
  /* one bar at the back right of the wing: the taps bar right in front of the liquor wall, stools facing it */
  if(wing&&H("t_bar")){var bx=12.2;lfSpr(C,H("t_taps")?"loL_taps":"br_bar",bx,1.5,2.8,1.2,{h:24,flip:1,ctr:1,H:62});
    if(H("t_bar2"))lfSpr(C,"thx_liquor",bx+.3,.2,2.6,.7,{h:50,flip:1,ctr:1,H:112});
    var stl=H("t_taps")?"brL_stool":"br_stool";[bx+.5,bx+1.6].forEach(function(x){lfSpr(C,stl,x,3.0,.7,.7,{h:20,ctr:1,H:42})});
    C.thbar=[bx+1.2,3.9];C.s("work",bx+1.4,1.0,-1,"work",[6,12],{tag:"bartender"})}
  /* the chandeliers hang out of view: only their warm light shows (the sprites stood at floor height mid-room) */
  /* QA audit: the chandeliers were light only, so nothing showed by day. Now the brass fixture hangs over each pool of light */
  if(wing&&H("t_chand"))[[7,6.0],[12,5.0]].forEach(function(p){lfSpr(C,"rdx_chand",p[0]-.5,p[1]-.5,1.0,1.0,{h:1,dy:-118,nosh:1,dk:-8,nob:1,ctr:1});lfLight(C,p[0],p[1],90,"#ffd890",3,.5)});
  if(H("t_wl2")||lux4)lfLight(C,W*.45,D*.4,70,"#ffcf8a",3,.3);
  lfDoorAt(C,W);
  lfWander(C,[[W-2.2,D*.5+.4,-1],[3,4.2,1],[6,4.2,-1]]);
};
var THQ={};
function thQ(a){var k=(a.pv?"p":"")+a.room;var q=(THQ[k]||[]).filter(function(id){var g=LFA[id];return g&&g.ths==="line"});return THQ[k]=q}
function thSlot(C,k){var T=C.thq,m=T.xmax||C.W-1.3;return [Math.min(T.x+T.dx*k,m),T.y+(T.x+T.dx*k>m?.25:0)]}
function thSnackFor(r){var a=r.a||{},o=[];TH_UPS.forEach(function(u){if(a[u[0]]&&u[3].menu)o.push(u[3].menu)});return o}
function thDoorFlash(a,C){var d=Math.hypot(a.x-C.thq.door[0],a.y-C.thq.door[1]),ms=d/1.15*1000;setTimeout(function(){var g=document.querySelectorAll(".thdoorgap");for(var i=0;i<g.length;i++){g[i].classList.remove("on");void g[i].getBoundingClientRect();g[i].classList.add("on")}},Math.max(0,ms-500))}
/* what each ticket buyer does next. Called every time one finishes a step. */
function thGuest(a,C,r){
  var Q=thQ(a),T=C.thq,sn=thSnackFor(r);
  switch(a.ths){
    case "line":var k=Q.indexOf(a.id);if(k<0){Q.push(a.id);k=Q.length-1}var sl=thSlot(C,k),dd=Math.hypot(a.x-sl[0],a.y-sl[1]);
      if(k===0&&dd<.6){a.ths="buy";a.mode="do";a.act="reach";a.tag="ticket";a.face=-1;a.t=lfRand(2.2,3.6);a.at=0;a.emo="Ticket";a.emot=3;return}
      if(dd>.4){lfGo(a,sl[0],sl[1],null);return}
      a.mode="idle";a.t=.4;return;
    case "buy":var ki=Q.indexOf(a.id);if(ki>=0)Q.splice(ki,1);a.ths="left";
      if(C.thbar&&Math.random()<.3){a.ths="snack";a.want="Cocktail";lfGo(a,C.thbar[0],C.thbar[1],null);return}
      if(sn.length&&C.thsnack&&Math.random()<.6){a.ths="snack";a.want=lfPick(sn);lfGo(a,C.thsnack[0],C.thsnack[1],null);return}
      return thGuest(a,C,r);
    case "snack":a.ths="left";a.mode="do";a.act="reach";a.tag="snack";a.t=lfRand(2,3.2);a.at=0;a.emo=a.want;a.emot=3;return;
    case "left":a.ths="gone";thDoorFlash(a,C);lfGo(a,T.door[0],T.door[1],"leave");return;
    case "gone":a.ths=null;a.alpha=0;a.fade=0;a.mode="idle";a.t=lfRand(3,14);return;
    default:a.look=lfGuestLook(a);var d=lfDoorOf(C);a.x=d.x;a.y=d.y+.2;a.alpha=0;a.fade=1;a.speed=lfRand(.95,1.2);Q.push(a.id);a.ths="line";var s0=thSlot(C,Q.indexOf(a.id));lfGo(a,s0[0],s0[1],null);
  }
}
var thGuestBase=lfGuestNext;
lfGuestNext=function(a,C,r){return r.t==="theater"?thGuest(a,C,r):thGuestBase(a,C,r)};
function thPeople(r,i,C,out){var a=r.a||{};if(!a.t_aud){out.push({id:"th:clerk",room:i,role:"crew",look:rsNpc(RSSTAFF.r_s2),ix:0});return}var mk=function(id,sp,ix){out.push({id:"th:"+id,room:i,role:"crew",look:rsNpc(sp),ix:ix})};
  mk("clerk",RSSTAFF.r_s2,0);
  if(a.t_st1)mk("usher",RSSTAFF.r_s3,1);
  if(a.t_st2)mk("conc",RSSTAFF.r_s1,2);
  if(a.t_st3)mk("bar",{body:"f",skin:"s5",hairStyle:"h1",hairColor:"black",bottom:"jeans",bottomColor:"black",shoe:"boots",shoeColor:"black",eq:["npc_vest"]},3);
  var n=lfGuestN(3+(a.t_marq?1:0)+(a.t_ctr?1:0)+(a.t_tv?1:0)+(a.t_aud?1:0)+(a.t_wing?2:0)+(a.t_bar?1:0));for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
function auPeople(r,i,C,out){var seats=C.st.filter(function(s){return s.cust}).length,n=Math.min(seats,lfGuestN(4+Math.floor(addonsOf(r).length/2)));for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
function thNote(r){var a=r.a||{},m=thSnackFor(r);return '<p class="note"><b>'+(a.t_wing?"Grand Lobby":"Small Lobby")+'.</b> '+(a.t_aud?'The Auditorium is open.':'Closed until the Auditorium opens: no customers and no money yet. Open it from the upgrades below.')+(m.length?' Selling: '+esc(m.join(", "))+'.':'')+'</p>'}
/* ---- the Auditorium: the screen is the point. Everyone faces it, and a bigger screen makes the room itself bigger. ---- */
AU_UPS=AU_UPS.filter(function(u){return u[0]!=="au_lux4"});
AU_UPS.forEach(function(u){if(u[0]==="au_lux1"){u[1]="Premium Power Recliners";u[4]="Charcoal, heated, with a soft blue strip light."}
  if(u[0]==="au_lux2"){u[1]="Landing Lights";u[4]="A lit back landing and soft blue sconces."}
  if(u[0]==="au_lux3"){u[1]="Reference Speaker Towers";u[4]="Tall towers either side of the screen, aimed at the seats."}
  if(u[0]==="au_scr2"){u[3].splash="The back wall grew to fit it. The room is taller and wider now, and the picture is huge."}
  if(u[0]==="au_imax"){u[3].splash="The whole wall is picture now, and the room grew again to hold it. People will drive across town for this."}});
ADDONS.auditorium=AU_UPS;
var auDimBase=lfDimOf;
lfDimOf=function(t){if(t!=="auditorium")return auDimBase(t);var B=S&&S.base,r=B&&B.slots.filter(function(q){return q&&q.t==="auditorium"})[0],a=r&&r.a||{};LFWH.auditorium=a.au_imax?300:a.au_scr2?236:190;return a.au_imax?[16,17]:a.au_scr2?[14,14]:[12,11]};
function scrMovie(uid,W,H){var S2=function(i,inner){return '<g class="mvS" style="animation-delay:'+(i*8)+'s">'+inner+'</g>'},R=lfSeed(31),stars='';for(var i=0;i<40;i++)stars+='<circle class="scrB" style="animation-delay:-'+(R()*2).toFixed(1)+'s" cx="'+(R()*160).toFixed(0)+'" cy="'+(R()*90).toFixed(0)+'" r=".5" fill="#fff"/>';
  var city=function(c,y,sd){var r=lfSeed(sd),s='';for(var k=0;k<24;k++){var h=10+r()*38;s+='<rect x="'+(k*14)+'" y="'+(y-h).toFixed(0)+'" width="13" height="'+(h+40).toFixed(0)+'" fill="'+c+'"/>'}return s};
  var space='<rect width="160" height="90" fill="#050518"/>'+stars+'<circle cx="124" cy="24" r="16" fill="#7a5cff"/><g class="mvX"><path d="M0 0L18 5L0 10L4 5Z" transform="translate(10,40)" fill="#dfe6ff"/><rect class="mvL" x="30" y="44" width="26" height="1.2" fill="#ff5c7a"/></g><g class="mvXr"><path d="M18 0L0 5L18 10L14 5Z" transform="translate(120,52)" fill="#ff9a6a"/></g><circle class="mvB" cx="96" cy="48" r="9" fill="#ffd27a"/>';
  var dragon='<rect width="160" height="90" fill="#ff8a5c"/><circle cx="118" cy="40" r="17" fill="#ffe08a"/><g class="scrL">'+city("#5a2a48",84,3).replace(/rect/g,'rect rx="6"')+'</g><g class="mvX" transform="translate(0,30)"><path d="M0 8L22 2L36 8L22 12Z" fill="#241022"/><path class="mvW" d="M14 6L24 -10L28 6Z" fill="#241022"/><path d="M36 8L44 5L40 11Z" fill="#241022"/></g>';
  var chase='<rect width="160" height="90" fill="#180b34"/><g class="scrL">'+city("#2d1a5e",62,7)+'</g><g class="scrL2">'+city("#47207a",70,9)+'</g><rect y="68" width="160" height="22" fill="#0c0920"/><g class="scrL2"><rect y="78" width="20" height="2" fill="#ffd27a"/><rect x="40" y="78" width="20" height="2" fill="#ffd27a"/><rect x="80" y="78" width="20" height="2" fill="#ffd27a"/><rect x="120" y="78" width="20" height="2" fill="#ffd27a"/><rect x="160" y="78" width="20" height="2" fill="#ffd27a"/><rect x="200" y="78" width="20" height="2" fill="#ffd27a"/><rect x="240" y="78" width="20" height="2" fill="#ffd27a"/><rect x="280" y="78" width="20" height="2" fill="#ffd27a"/><rect x="320" y="78" width="20" height="2" fill="#ffd27a"/></g><g class="scrJ"><rect x="86" y="62" width="30" height="9" rx="3" fill="#ff3d81"/><rect x="94" y="56" width="14" height="7" rx="2" fill="#7df9ff"/><circle cx="92" cy="72" r="3" fill="#000"/><circle cx="110" cy="72" r="3" fill="#000"/></g><g class="mvX"><rect x="20" y="64" width="28" height="8" rx="3" fill="#4dd2ff"/><circle cx="26" cy="73" r="3" fill="#000"/><circle cx="42" cy="73" r="3" fill="#000"/></g>';
  var r2=lfSeed(5),bub='';for(var b=0;b<14;b++)bub+='<circle class="mvU" style="animation-delay:-'+(r2()*4).toFixed(1)+'s" cx="'+(r2()*160).toFixed(0)+'" cy="88" r="'+(1+r2()*1.6).toFixed(1)+'" fill="rgba(255,255,255,.6)"/>';
  var sea='<rect width="160" height="90" fill="#0a4a7a"/><rect width="160" height="30" fill="#2a8ab8" opacity=".5"/>'+bub+'<g class="mvXr"><path d="M0 12Q30 -8 70 8L88 0L84 12L88 24L70 16Q30 32 0 12Z" transform="translate(60,30)" fill="#0d2a4a"/></g><g class="mvX"><path d="M0 4L10 0L10 8Z M10 4Q18 -2 24 4Q18 10 10 4Z" transform="translate(10,60)" fill="#ffb066"/><path d="M0 4L10 0L10 8Z M10 4Q18 -2 24 4Q18 10 10 4Z" transform="translate(34,70)" fill="#ff7ad8"/></g>';
  var duel='<rect width="160" height="90" fill="#7a1a24"/><circle cx="80" cy="42" r="30" fill="#ff5c3d"/><rect y="70" width="160" height="20" fill="#2a0a10"/><path d="M50 70V44L56 38L62 44V70Z" fill="#14060a"/><path d="M110 70V44L104 38L98 44V70Z" fill="#14060a"/><rect class="mvF" x="58" y="46" width="44" height="1.6" fill="#fff"/>'+[20,50,80,110,140].map(function(x,i){return '<circle class="mvD" style="animation-delay:-'+(i*.9)+'s" cx="'+x+'" cy="4" r="1.3" fill="#ffc4d6"/>'}).join("");
  var kaiju='<rect width="160" height="90" fill="#2a3a4a"/><g class="scrL2">'+city("#16202c",84,4)+'</g><g class="mvK"><path d="M70 90V38L78 22L90 22L98 38V90Z" fill="#0a1018"/><path d="M78 22L72 12L84 18L90 8L92 22Z" fill="#0a1018"/><circle cx="88" cy="30" r="1.8" fill="#ffd34d"/></g><rect class="mvF" x="90" y="28" width="70" height="4" fill="#7df9ff"/><g class="mvX"><rect x="10" y="20" width="12" height="4" fill="#d0d6dc"/><rect x="6" y="18" width="20" height="1" fill="#d0d6dc"/></g>';
  return scrBox(W,H,'<g transform="scale('+(W/160).toFixed(3)+','+(H/90).toFixed(3)+')">'+'<g class="scrBase">'+dragon+'</g>'+[space,dragon,chase,sea,duel,kaiju].map(function(s,i){return S2(i,s)}).join("")+'</g>','#000')}
/* QA (every room against references): the Auditorium screen, the lobby panels and the Boba TV read black whenever animations are
   off (reduced motion, still captures), since every scene and slide starts at opacity 0. Each now has a still first picture under
   it (.scrBase) that hides itself the moment animations run. scrPages lives in LEAD's 24_screens.js; this wraps it. */
var scrPagesBase=scrPages;scrPages=function(pages){return (pages&&pages[0]?'<g class="scrBase">'+pages[0]+'</g>':'')+scrPagesBase(pages)};
LFROOM.auditorium=function(C){rsArtReady();
  var H=function(k){return C.has(k)},U=LF.U,W=C.W,D=C.D,HH=LF.H,big=H("au_imax"),scr2=H("au_scr2"),car=H("au_carpet");
  if(H("au_wall2"))thWalls(C,"#1d1320","#180f1a","rgba(90,140,255,.14)");else if(H("au_wall1"))thWalls(C,"#242630","#1f2029","rgba(255,255,255,.07)");else thWalls(C,"#2a2230","#241d29");
  C.decals.push(lfFloorG(.05,.05,'<rect width="'+U*(W-.1)+'" height="'+U*(D-.1)+'" fill="'+(car?"#3a1830":"#26202a")+'"/>'));
  var nrow=H("au_rows")?4:3,TX=[3.6,5.3,7.0,8.7],TZ=[6,14,22,30],ty0=1.7,carpT=car?"#5a2238":"#3a3040",carpS=car?"#2e1020":"#1c1720",DX=TX[nrow-1]+1.7,DZ=TZ[nrow-1]+8;
  TX.slice(0,nrow).forEach(function(x,i){lfTbox(C,x,ty0,1.7,D-ty0-.2,0,TZ[i],carpS,carpT);C.plat.push({x0:x,y0:ty0,x1:x+1.7,y1:D,z:TZ[i],key:x+1.7+.01})});
  /* the raised back landing reads as one (QA design review): a lighter deck, a low wall along its edge with the aisle left
     open, and a lit EXIT where the aisle steps arrive (the Lobby door is at that end) */
  lfTbox(C,DX,0,W-DX,D,0,DZ,H("au_lux2")?"#2e2e3a":"#2a2430",H("au_lux2")?"#4a4a5e":"#43394c");
  lfTbox(C,DX,1.75,.2,D-1.85,DZ,15,"#1a1520","#d8b45a");
  for(var ly=2.1;ly<D-.2;ly+=.75)C.add(DX+ly+.25,'<circle cx="'+lfP(DX-.02,ly,DZ+5)[0].toFixed(1)+'" cy="'+lfP(DX-.02,ly,DZ+5)[1].toFixed(1)+'" r="1.8" fill="#ffd27a"/><circle cx="'+lfP(DX-.02,ly,DZ+5)[0].toFixed(1)+'" cy="'+lfP(DX-.02,ly,DZ+5)[1].toFixed(1)+'" r="5" fill="#ffd27a" opacity=".22"/>');
  C.walls.push(lfFaceY(W-1.5,0,DZ+66,'<rect width="30" height="13" rx="2" fill="#0c3a1c" stroke="#3dff7a" stroke-width="1"/><text x="15" y="9.6" font-size="8" font-weight="700" fill="#8dffae" text-anchor="middle" font-family="sans-serif">EXIT</text>'));C.plat.push({x0:DX,y0:0,x1:W,y1:D,z:DZ,key:DX+.01});
  var steps=Math.ceil((DX-3.6)/.6);for(var j=0;j<steps;j++){var sz=DZ*(j+1)/steps;lfTbox(C,3.6+.6*j,.2,.6,1.4,0,sz,carpS,carpT);if(H("au_aisle")){lfTbox(C,3.6+.6*j,1.5,.6,.1,sz-1,2.2,"#6cc0ff","#c8ecff");if(j%2===0)lfLight(C,3.9+.6*j,1.6,sz+4,"#6cc0ff",1.1,.35)}/* QA audit: thicker lit step edges with a soft glow */C.plat.push({x0:3.6+.6*j,y0:.2,x1:3.6+.6*(j+1),y1:1.6,z:sz,key:3.6+.6*(j+1)+.01})}
  /* screen */
  var sw=big?D-2.4:scr2?D-3.4:6.0,sh=big?HH-56:scr2?150:92,y0=(D+sw)/2,z0=big?20:30;
  C.walls.push(lfFaceX(0,y0,z0+sh,'<rect x="-6" y="-6" width="'+(U*sw+12)+'" height="'+(sh+12)+'" fill="#08080c" stroke="'+LFOL+'"/>'+scrMovie(C.uid,U*sw,sh)));
  C.decals.push('<ellipse class="lfglow" cx="'+lfP(2.0,D/2,0)[0]+'" cy="'+lfP(2.0,D/2,0)[1]+'" rx="'+(U*sw*.45)+'" ry="'+(U*1.4)+'" fill="rgba(170,190,255,.2)"/>');
  /* speakers stand either side of the screen, aimed into the room, and never in front of it */
  var tall=H("au_lux3")?"aux_ref":"aux_spk",spkH=H("au_lux3")?150:118;[y0+.15,y0-sw-1.05].forEach(function(y){if(y>=.1&&y<D-.8)lfSpr(C,tall,.12,y,.8,.8,{h:30,H:spkH,flip:0})});
  if(H("au_sound")){lfSpr(C,"aux_sub",.5,y0-sw/2-.6,1.0,.9,{h:20,H:50,nosh:1,sh:1});/* the rear surround stands on the back deck against the side wall, firing across the seats, not out at the camera */
    lfSpr(C,"aux_spk",W-1.6,.15,.7,.7,{h:30,H:96,flip:1,dy:-DZ,shz:DZ})}
  if(H("au_wall1")&&!H("au_wall2"))[1.2,3.4,5.6].forEach(function(x){lfSpr(C,"aux_panel",x,.05,.1,.05,{h:1,flip:1,H:80,dy:-60,nosh:1})});
  if(H("au_lux2"))[2,6,10].forEach(function(x){lfSpr(C,"aux_sconce",x,.05,.1,.05,{h:1,flip:1,H:40,dy:-90,nosh:1});lfLight(C,x,.6,70,"#6cc0ff",1.8,.35)});
  /* seats from behind, everybody watching the screen */
  var key=H("au_lux1")?"aux_seat3":H("au_recline")?"aux_seat2":"aux_seat1",blocks=Math.floor((D-ty0-.4)/2.9);
  TX.slice(0,nrow).forEach(function(x,r){for(var b=0;b<blocks;b++){var yb=ty0+.2+b*2.9;lfSpr(C,key,x+.3,yb,1.2,2.7,{h:20,H:74,dy:-TZ[r],fl:"lfdk",shz:TZ[r]});
    /* Seen from behind, a seated guest is drawn just before their own row of seats, so its backs hide them below
       the shoulders, and after the row in front of them. (dk:99 drew them over every seat, perched on top.) */
    for(var s=0;s<3;s++)lfCust(C,x+.55,yb+.5+s*.85,-1,{sit:1,sz:4,facewall:1,dk:3.1-.85*s,uact:"eat",wact:"sit",lbl:String.fromCharCode(65+r),grp:"r"+r,num:b*3+s+1,wx:x+1.6,wy:yb+.5+s*.85,udur:[40,70]})}});
  /* projector, and its beam across the room */
  /* bare: a small projector (the tripod camera read as filming); the upgrades bring the bigger ones */
  lfSpr(C,H("au_proj2")?"thx_proj2":"thx_proj1",W-1.4,D*.5-.5,1.0,1.0,{h:30,ctr:1,H:H("au_proj2")?96:H("au_proj1")?80:58,dy:-DZ,shz:DZ});
  var pj=lfP(W-1.2,D*.5,DZ+50),s1=lfP(0,y0-sw,z0+sh/2),s2=lfP(0,y0,z0+sh/2);C.front.push('<polygon class="mvBeam" points="'+pj.join(",")+' '+s1.join(",")+' '+s2.join(",")+'" fill="rgba(200,220,255,.09)" pointer-events="none"/>');
  C.s("door",W-.8,.9,1,"look",[1,1]);C.door={x:W-.8,y:.9};
  lfPrep(C,"counter",W-1.5,2);
};
