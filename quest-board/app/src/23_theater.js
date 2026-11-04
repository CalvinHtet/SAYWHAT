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
 ["t_bins","Poster Stands & Bins",400,{p:.05,lv:24,g:"Decor"},"Now showing, and somewhere to put the wrappers."],
 ["t_marq","Neon Marquee",2500,{p:.15,lv:26,g:"Decor"},"Bulbs on the wall, lines at the door."],
 ["t_tv","Trailer Screen",3000,{p:.15,lv:27,g:"Decor"},"Trailers on a loop while people wait."],
 ["t_standee","Movie Standee",1500,{p:.08,lv:27,g:"Decor"},"Everyone takes a picture with it."],
 ["t_reel","Film Reel Wall Art",2000,{p:.08,lv:28,g:"Decor"},"Giant gold reel over the seating."],
 ["t_clap","Neon Clapboard",2500,{p:.1,lv:30,g:"Decor"},"Glows blue and pink."],
 ["t_sofa","Lobby Sofas",3000,{p:.1,lv:31,g:"Decor"},"Early arrivals sit here."],
 ["t_arc","Arcade Cabinet",4000,{p:.15,lv:32,g:"Decor"},"Something to do before the show."],
 ["t_claw","Claw Machine",4000,{p:.15,lv:33,g:"Decor"},"Nobody has ever won. Everyone keeps trying."],
 ["t_sofa2","Leather Sofas",10000,{p:.15,lv:44,g:"Decor"},"Black leather with gold piping."],
 ["t_chand","Lobby Chandeliers",18000,{p:.25,lv:46,g:"Decor",also:"t_wing"},"A real entrance."],
 ["t_booth1","Classic Ticket Booth",2200,{p:.15,lv:26,g:"Decor"},"Red, gold and a little glass window."],
 ["t_lux4","Gold Ticket Booth",28000,{p:.3,lv:55,g:"Decor"},"Marble and gold, and a matching poster stand."],
 /* the bar */
 ["t_bar","Cocktail Bar",14000,{p:.4,lv:38,g:"Bar",also:"t_wing",menu:"Cocktail",splash:"Grown-ups now stop for a drink on the way in, and every drink is pure profit."},"A dark bar and stools. Pull up and order a drink."],
 ["t_bar2","Liquor Wall",8000,{p:.2,lv:40,g:"Bar"},"Backlit bottles floor to ceiling."],
 ["t_taps","Brass Tap Bar",22000,{p:.4,lv:52,g:"Bar"},"Marble top, brass taps, velvet stools."],
 /* staff */
 ["t_st1","Hire an Usher",3000,{p:.2,lv:29,g:"Staff"},"Keeps the line moving."],
 ["t_st2","Concession Staff",5000,{p:.25,lv:31,g:"Staff",also:"t_ctr"},"Someone behind the counter."],
 ["t_st3","Hire a Bartender",7000,{p:.25,lv:39,g:"Staff",also:"t_bar"},"Knows your usual."],
 /* the building */
 ["t_aud","Open the Auditorium",15000,{p:.5,lv:30,g:"Expansion",splash:"You can finally see what is behind the double doors. The Auditorium is now a room of its own, with its own upgrades: seats, projector, walls, floors and, one day, an IMAX screen."},"Builds the room behind the double doors."],
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
  C.thq={x:4.7,y:2.5,dx:.95,door:[.75,4.2]};
  /* the ticket booth, the rope and the line */
  lfSpr(C,lux4?"loL_sign":H("t_booth1")?"lo_booth":"thx_booth0",3.5,.2,1.9,1.5,{h:34,flip:1,ctr:1,H:96});
  C.s("work",2.9,1.5,1,"look",[6,14],{tag:"clerk"});
  var ropeEnd=wing?13.6:10.2;for(var rx=4.5;rx<ropeEnd;rx+=1.8)lfSpr(C,"thx_rope",rx,3.25,1.8,.15,{h:6,flip:1,ctr:1,nosh:1,dk:-.2});
  /* the screens */
  thBoard(C,6.2,72,H);
  if(H("t_tv"))C.walls.push(lfFaceX(0,2.9,110,scrTrailer(C,U*2.2,56)));
  lfW1(C,"w_thposter",.05,D-.7,64,-70,0);
  if(H("t_marq"))lfW1(C,"w_thmarq",.05,6.7,26,-112,0);
  if(H("t_reel"))lfW1(C,"w_threel",.05,8.2,40,-92,0);
  if(H("t_clap"))lfW1(C,"w_thclap",2.2,.05,36,-100,1);
  if(H("t_wl2"))[1.6,7.1].forEach(function(y){lfW1(C,"w_thsconce",.05,y,44,-60,0)});
  /* the snack island */
  var ix=4.4,iy=5.3,lx=lux2;
  if(H("t_ctr")){lfSpr(C,lux4?"loL_ctr":"lo_ctr",ix,iy,3.0,1.2,{h:30,flip:1,ctr:1,H:lux4?70:78});C.thsnack=[ix+1.5,iy-.6];C.s("work",ix+1.5,iy+1.6,-1,"work",[6,12],{tag:"concession"})}
  if(H("t_pop")){lfSpr(C,lx?"loL_pop":"lo_pop",ix+3.3,iy,1.0,1.0,{h:30,flip:1,ctr:1,H:92});C.front.push(lfSteam(ix+3.7,iy+.4,60,2));if(!C.thsnack)C.thsnack=[ix+3.8,iy-.5]}
  if(H("t_soda"))lfSpr(C,"lo_soda",ix+4.5,iy,1.1,1.1,{h:30,flip:1,ctr:1,H:80});
  if(H("t_candy"))lfSpr(C,lx?"loL_candy":"lo_candy",ix,iy+1.9,1.7,1.2,{h:28,ctr:1,H:64});
  if(H("t_dog"))lfSpr(C,lx?"loL_dog":"lo_dog",ix+1.9,iy+1.9,1.4,1.2,{h:28,ctr:1,H:66});
  if(H("t_nacho"))lfSpr(C,lx?"loL_nacho":"lo_nacho",ix+3.5,iy+1.9,1.3,1.2,{h:28,ctr:1,H:66});
  /* along the back and the sides */
  if(H("t_arc"))lfSpr(C,"thx_arcade",.5,.2,1.1,1.0,{h:40,flip:1,ctr:1,H:92});
  if(H("t_claw"))lfSpr(C,"thx_claw",1.8,.2,1.1,1.0,{h:40,flip:1,ctr:1,H:90});
  if(H("t_sofa"))lfSpr(C,H("t_sofa2")?"thL_sofa":"th_sofa",.15,5.6,1.2,2.6,{h:30,H:58});
  if(H("t_standee"))lfSpr(C,"thx_standee",1.9,6.6,.8,.5,{h:30,ctr:1,H:84});
  if(H("t_bins")){lfSpr(C,lux4?"loL_stand":"lo_stand",W-1.3,1.6,.9,.5,{h:36,ctr:1,H:96});lfSpr(C,lux4?"loL_bins":"lo_bins",W-1.2,D-1.2,.9,.9,{h:26,ctr:1,H:56})}
  /* the wing: the bar */
  if(wing&&H("t_bar")){var bx=12.2;lfSpr(C,H("t_taps")?"loL_taps":"br_bar",bx,5.6,2.8,1.2,{h:24,flip:1,ctr:1,H:62});
    if(H("t_bar2"))lfSpr(C,"thx_liquor",bx+.3,.2,2.6,.7,{h:50,flip:1,ctr:1,H:112});
    var stl=H("t_taps")?"brL_stool":"br_stool";[bx+.5,bx+1.6].forEach(function(x){lfSpr(C,stl,x,7.1,.7,.7,{h:20,ctr:1,H:42})});
    C.thbar=[bx+1.2,7.9];C.s("work",bx+1.4,4.9,-1,"work",[6,12],{tag:"bartender"})}
  if(wing&&H("t_chand"))[[7,6.0],[12,5.0]].forEach(function(p){lfSpr(C,"rs3_chand",p[0],p[1],.2,.2,{h:1,H:100,dy:-90,nosh:1,dk:-6});lfLight(C,p[0],p[1],90,"#ffd890",3,.5)});
  if(H("t_wl2")||lux4)lfLight(C,W*.45,D*.4,70,"#ffcf8a",3,.3);
  lfDoorAt(C,W);
  lfWander(C,[[W-2.2,D*.5+.4,-1],[3,4.2,1],[6,4.2,-1]]);
};
var THQ={};
function thQ(a){var k=(a.pv?"p":"")+a.room;var q=(THQ[k]||[]).filter(function(id){var g=LFA[id];return g&&g.ths==="line"});return THQ[k]=q}
function thSlot(C,k){var T=C.thq;return [Math.min(T.x+T.dx*k,C.W-1.3),T.y+(T.x+T.dx*k>C.W-1.3?.25:0)]}
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
    default:a.look=lfGuestLook();var d=lfDoorOf(C);a.x=d.x;a.y=d.y+.2;a.alpha=0;a.fade=1;a.speed=lfRand(.95,1.2);Q.push(a.id);a.ths="line";var s0=thSlot(C,Q.indexOf(a.id));lfGo(a,s0[0],s0[1],null);
  }
}
var thGuestBase=lfGuestNext;
lfGuestNext=function(a,C,r){return r.t==="theater"?thGuest(a,C,r):thGuestBase(a,C,r)};
function thPeople(r,i,C,out){var a=r.a||{},mk=function(id,sp,ix){out.push({id:"th:"+id,room:i,role:"crew",look:rsNpc(sp),ix:ix})};
  mk("clerk",RSSTAFF.r_s2,0);
  if(a.t_st1)mk("usher",RSSTAFF.r_s3,1);
  if(a.t_st2)mk("conc",RSSTAFF.r_s1,2);
  if(a.t_st3)mk("bar",{body:"f",skin:"s5",hairStyle:"h1",hairColor:"black",bottom:"jeans",bottomColor:"black",shoe:"boots",shoeColor:"black",eq:["npc_vest"]},3);
  var n=3+(a.t_marq?1:0)+(a.t_ctr?1:0)+(a.t_tv?1:0)+(a.t_aud?1:0)+(a.t_wing?2:0)+(a.t_bar?1:0);for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
function auPeople(r,i,C,out){var seats=C.st.filter(function(s){return s.cust}).length,n=Math.min(seats,4+Math.floor(addonsOf(r).length/2),10);for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
function thNote(r){var a=r.a||{},m=thSnackFor(r);return '<p class="note"><b>'+(a.t_wing?"Grand Lobby":"Small Lobby")+'.</b> '+(a.t_aud?'The Auditorium is open.':'What is behind the double doors? Open the Auditorium at level 30 to find out.')+(m.length?' Selling: '+esc(m.join(", "))+'.':'')+'</p>'}
