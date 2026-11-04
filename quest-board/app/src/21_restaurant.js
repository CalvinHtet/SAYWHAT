/* ---------- the restaurant ----------
   Opens as a hole in the wall and grows through its upgrades: bigger room, better tables,
   real kitchen gear, staff, then a patio past the front door. To add an upgrade, add a
   line to RS_UPS and, if it shows in the room, a line in LFROOM.restaurant. Prices and
   the income they buy are explained in docs/ECONOMY.md. */
ROOMT.restaurant=Object.assign(ROOMT.restaurant,{lv:8,cost:1200,coin:15,store:8,desc:"Your own place. It starts as a cramped hole in the wall, earns while you do your real quests, and every upgrade makes it bigger, busier and fancier."});
/* [id,name,cost,effect,line]  effect: p income, cap stored hours, lv level needed, g group, also second requirement */
var RS_UPS=[
 /* kitchen */
 ["r_k1","Gas Range",300,{p:.12,lv:8,g:"Kitchen"},"Swaps the hot plate for four real burners."],
 ["r_k2","Steel Prep Table",700,{p:.1,lv:9,g:"Kitchen"},"Room to chop, plate and hang the pans."],
 ["r_k3","Commercial Fridge",1400,{p:.12,lv:11,g:"Kitchen"},"Retires the dented mini fridge."],
 ["r_k4","Flat-Top Grill",2400,{p:.2,lv:13,g:"Kitchen",also:"r_x1"},"A long griddle and a proper hood. Burgers for days."],
 ["r_k5","Fryer & Sinks",3200,{p:.2,lv:16,g:"Kitchen",also:"r_x1"},"Fries come out faster. Dishes come back cleaner."],
 ["r_k6","Bakery Rack",2200,{p:.12,lv:19,g:"Kitchen",also:"r_x1"},"Fresh bread on wheels, every morning."],
 ["r_k9","Dish Station",2800,{p:.12,lv:20,g:"Kitchen",also:"r_x1"},"Plates stacked, spray faucet, no more waiting on forks."],
 ["r_k7","Wood-Fired Oven",9000,{p:.5,lv:28,g:"Kitchen",also:"r_x2"},"A brick dome with a real fire. Guests can smell it."],
 ["r_k8","Grand French Range",22000,{p:.9,lv:44,g:"Kitchen",also:"r_x2"},"Navy enamel, brass rails, copper pots. The dream."],
 /* coffee */
 ["r_cf1","Drip Coffee",150,{p:.06,lv:8,g:"Kitchen"},"Bottomless, burnt and beloved."],
 ["r_cf2","Espresso Bar",3000,{p:.2,lv:15,g:"Kitchen",also:"r_x1"},"A gold machine on a lit counter."],
 /* seating */
 ["r_t1","Real Wood Tables",450,{p:.15,lv:8,g:"Seating"},"Pine tables and chairs that do not fold."],
 ["r_more1","Extra Tables",900,{p:.15,lv:10,g:"Seating"},"Squeeze in more guests."],
 ["r_b1","Diner Booths",2600,{p:.2,lv:14,g:"Seating",also:"r_x1"},"Teal vinyl booths down the window wall."],
 ["r_t2","Marble Bistro Tables",3800,{p:.25,lv:18,g:"Seating",also:"r_x1"},"White marble tops and curved chairs."],
 ["r_more2","Full Dining Floor",6500,{p:.3,lv:26,g:"Seating",also:"r_x2"},"Every free corner now seats someone."],
 ["r_t3","Fine Dining Service",16000,{p:.7,tip:1,lv:36,g:"Seating",also:"r_x2"},"Linen, crystal, velvet chairs, candles."],
 ["r_b2","Velvet Banquettes",14000,{p:.4,lv:38,g:"Seating",also:"r_x2"},"Emerald velvet and gilded frames."],
 /* front of house */
 ["r_c1","Marble Counter & Stools",1800,{p:.2,lv:12,g:"Counter",also:"r_x1"},"A real diner counter people want to sit at."],
 ["r_hd1","Host Lectern",1100,{p:.08,lv:13,g:"Counter",also:"r_x1"},"A small desk by the door and a reservation book."],
 ["r_hd2","Host Desk",3000,{p:.12,lv:23,g:"Counter",also:"r_x1"},"Black and teal, with a tablet and a soft glow."],
 ["r_bar","Cocktail Bar",7000,{p:.3,lv:26,g:"Counter",also:"r_x2"},"Walnut bar, taps and a lit bottle wall."],
 ["r_c2","Black Marble Counter",13000,{p:.6,lv:34,g:"Counter",also:"r_x2"},"Black marble, gold trim, gold stools."],
 /* the building */
 ["r_x1","Knock Through the Wall",2500,{p:.25,cap:2,lv:12,g:"Expansion"},"Becomes a Corner Diner: a bigger room with space for real equipment."],
 ["r_x2","Take Over Next Door",11000,{p:.6,cap:2,lv:24,g:"Expansion"},"Becomes a Neighborhood Bistro: a full dining room and a bar."],
 ["r_patio","Sidewalk Patio",6000,{p:.3,lv:20,g:"Patio",also:"r_x1"},"A wood deck past the front door, with iron rails."],
 /* patio */
 ["r_p1","Bistro Patio Sets",1500,{p:.1,lv:20,g:"Patio"},"Wrought iron tables out in the fresh air."],
 ["r_p3","Planters & Olive Trees",2000,{p:.08,lv:22,g:"Patio"},"Herbs in the boxes, olives in the pots."],
 ["r_p2","Market Umbrellas",3000,{p:.15,lv:24,g:"Patio"},"Wood tables under cream striped shade."],
 ["r_p4","Patio Heaters",3500,{p:.1,lv:27,g:"Patio"},"Keeps the patio full long after sunset."],
 ["r_p6","Charcoal Grill Station",6500,{p:.2,lv:30,g:"Patio"},"Smoke is the best advertising there is."],
 ["r_p5","Pergola & String Lights",9000,{p:.25,lv:32,g:"Patio"},"Vines overhead and warm bulbs at night."],
 ["r_p7","Fire Pit Lounge",15000,{p:.5,lv:40,g:"Patio"},"Curved seating around a low stone fire."],
 /* lights */
 ["r_l1","Pendant Lights",800,{p:.08,lv:10,g:"Decor"},"Brass pendants instead of one bare bulb."],
 ["r_l2","Crystal Chandeliers",12000,{p:.3,lv:36,g:"Decor",also:"r_x2"},"Three of them, and every table looks better."],
 /* decor */
 ["r_sign","Sidewalk Sign",120,{p:.05,lv:8,g:"Decor"},"A chalkboard out front. Foot traffic loves a doodle."],
 ["r_d1","Potted Plants",400,{p:.06,lv:9,g:"Decor"},"Some green in the corners."],
 ["r_d2","Shelves & Pictures",600,{p:.06,lv:9,g:"Decor"},"Makes it look like someone cares."],
 ["r_d3","Menu Boards",900,{p:.08,lv:11,g:"Decor"},"Real menus on the wall."],
 ["r_scr","Digital Menu Screen",1800,{p:.12,lv:15,g:"Decor"},"A screen that cycles through today's menu."],
 ["r_cool","Drinks Cooler",1300,{p:.1,lv:12,g:"Decor"},"Cold bottles, softly lit."],
 ["r_d4","Neon Sign",1600,{p:.1,lv:14,g:"Decor"},"Pink glow in the back."],
 ["r_d5","Wine Wall",4000,{p:.15,lv:22,g:"Decor",also:"r_x1"},"Bottles on display behind glass."],
 ["r_chef","Chef's Neon",2500,{p:.1,lv:24,g:"Decor"},"A glowing chef hat on the wall."],
 ["r_d8","Orchid Arrangements",5000,{p:.12,lv:33,g:"Decor",also:"r_x2"},"White flowers in gold urns."],
 ["r_d7","Gilded Mirror",6000,{p:.12,lv:34,g:"Decor",also:"r_x2"},"The room looks twice as big and three times as rich."],
 ["r_d6","Wine Cellar",14000,{p:.5,lv:42,g:"Decor",also:"r_x2"},"A floor-to-ceiling gold cellar."],
 ["r_star","Star Plaque",30000,{p:1.5,lv:60,g:"Decor",also:"r_x2"},"The critics came. You won."],
 /* staff */
 ["r_s1","Hire a Cook",1000,{p:.2,lv:9,g:"Staff"},"Takes the orders off your hands. Guests now order and wait to be served."],
 ["r_s2","Hire a Waiter",2000,{p:.25,tip:1,lv:12,g:"Staff"},"Faster plates, better tips."],
 ["r_s3","Hire a Host",5000,{p:.2,lv:22,g:"Staff",also:"r_hd1"},"Someone to greet guests at the door."],
 ["r_s4","Hire a Head Chef",18000,{p:.8,lv:42,g:"Staff"},"A real one, with opinions."],
 /* menu */
 ["r_m1","Breakfast Menu",200,{p:.08,lv:8,g:"Menu",menu:["Eggs","Pancakes"]},"More than instant noodles."],
 ["r_m2","Burger Menu",900,{p:.12,lv:10,g:"Menu",menu:["Burger","Fries"]},"The crowd pleaser."],
 ["r_m3","Pasta Night",2800,{p:.15,lv:17,g:"Menu",menu:["Pasta","Salad"]},"Fresh sauce, cheap ingredients, big margins."],
 ["r_m4","Wood-Fired Pizza",5000,{p:.2,lv:29,g:"Menu",also:"r_k7",menu:["Pizza","Calzone"]},"The oven earns its keep."],
 ["r_m5","Seasonal Menu",9000,{p:.25,lv:37,g:"Menu",menu:["Risotto","Sea Bass"]},"Changes every month. People come back to see."],
 ["r_m6","Tasting Menu",26000,{p:.9,lv:50,g:"Menu",also:"r_k8",menu:["Tasting","Wagyu"]},"Nine courses and a waiting list."],
 /* money */
 ["r_till","Bigger Till",600,{cap:2,lv:10,g:"Money"},"Holds two more hours of takings between visits."],
 ["r_safe","Back Office Safe",5000,{cap:4,lv:25,g:"Money"},"Holds four more hours of takings between visits."]
];
RS_UPS.sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});
ADDONS.restaurant=RS_UPS;
Object.assign(ADDREQ,{r_t2:"r_t1",r_t3:"r_t2",r_b2:"r_b1",r_c2:"r_c1",r_l2:"r_l1",r_k8:"r_k1",r_cf2:"r_cf1",r_hd2:"r_hd1",r_d6:"r_d5",r_x2:"r_x1",r_more2:"r_more1",r_p1:"r_patio",r_p2:"r_p1",r_p3:"r_patio",r_p4:"r_patio",r_p5:"r_p3",r_p6:"r_p1",r_p7:"r_p5",r_s2:"r_s1",r_s4:"r_s2"});
/* an upgrade that replaces another hides it from the Installed list; RSTCH hides the next step until the last one is in */
window.RSSUP={r_t1:["r_t2"],r_t2:["r_t3"],r_b1:["r_b2"],r_c1:["r_c2"],r_l1:["r_l2"],r_k1:["r_k8"],r_cf1:["r_cf2"],r_hd1:["r_hd2"],r_d5:["r_d6"]};
window.RSTCH={r_t2:1,r_t3:1,r_b2:1,r_c2:1,r_l2:1,r_k8:1,r_cf2:1,r_hd2:1,r_d6:1,r_x2:1,r_more2:1,r_p1:1,r_p2:1,r_p3:1,r_p4:1,r_p5:1,r_p6:1,r_p7:1,r_s2:1,r_s4:1};
LFDS.restaurant=[
 {id:"lino",name:"Scuffed Lino",cost:0,fl:"grey",wl:"plaster",wc:"#d9d3c6",wr:"plaster",wcr:"#c9c3b6"},
 {id:"bistro",name:"Warm Oak",cost:600,fl:"oak",wl:"plaster",wc:"#efe3cf",wr:"plaster",wcr:"#e2d3bb"},
 {id:"brickbar",name:"Brick Wall",cost:2800,fl:"herring",wl:"plaster",wc:"#e7ddcc",wr:"plaster",wcr:"#d8ccb8",acc:{w:"L",a:.3,b:4.7,tex:"brick"}},
 {id:"modern",name:"Modern Dining",cost:3400,fl:"concrete",wl:"plaster",wc:"#d9dde6",wr:"plaster",wcr:"#c7ccd8",acc:{w:"L",a:.3,b:4.7,c:"#2b3552"}},
 {id:"trattoria",name:"Trattoria Red",cost:4200,fl:"walnut",wl:"plaster",wc:"#efdcc3",wr:"plaster",wcr:"#e2cdb0",acc:{w:"L",a:.3,b:4.7,c:"#9a3a3a"}},
 {id:"marble",name:"Marble Hall",cost:15000,fl:"marble",wl:"plaster",wc:"#ece6da",wr:"plaster",wcr:"#ddd6c8",acc:{w:"L",a:.3,b:4.7,c:"#1f3a33"}}];

var RSPATIO=7;
function rsRoom(){var B=S&&S.base;return B&&B.slots?B.slots.filter(function(r){return r&&r.t==="restaurant"})[0]:null}
function rsStage(a){return a&&a.r_x2?2:a&&a.r_x1?1:0}
var RSSIZE=[[11,8],[16,10],[21,12]],RSNAME=["Hole in the Wall","Corner Diner","Neighborhood Bistro"];
var rsDimBase=lfDimOf;
lfDimOf=function(t){if(t!=="restaurant")return rsDimBase(t);var r=window.__rsDraw||rsRoom(),a=r&&r.a,d=RSSIZE[rsStage(a)];return [d[0]+(a&&a.r_patio?RSPATIO:0),d[1]]};
LFRS.restaurant=.86;
function rsArtReady(){if(window.__rsa||!window.LFSPR)return;window.__rsa=1;var A=QBLoft.data.rsart||{},base=QBLoft.data.loft.artBase;Object.keys(A).forEach(function(k){LFSPR[k.replace(/^fix_/,"")]={w:A[k].w,h:A[k].h,u:base+k+".webp"}});
  /* until a room's new art arrives, its basics borrow the nearest old sprite */
  var RSFALL={gdx_seed:"gd_bed2",gdx_raised:"gd_bed1",gdx_tomato:"gd_bed1",gdx_herb:"gd_bed2",gdx_ghouse:"gd_green",gdx_conserv:"gd_green",gdx_stand:"gd_crate",gdx_hive:"gd_bee",thx_booth0:"lo_booth"};Object.keys(RSFALL).forEach(function(k){if(!LFSPR[k]&&LFSPR[RSFALL[k]])LFSPR[k]=LFSPR[RSFALL[k]]})}
function rsNote(r){var a=r.a||{},st=rsStage(a),nx=st===0?"r_x1":st===1?"r_x2":a.r_patio?null:"r_patio",N=nx&&RS_UPS.filter(function(u){return u[0]===nx})[0],q=S.base.rstat&&S.base.rstat[S.base.slots.indexOf(r)],stars=q&&q.n?(q.sum/q.n).toFixed(1)+" stars from "+q.n+" reviews. ":"";
  return '<p class="note"><b>'+RSNAME[st]+'.</b> '+stars+(N?'Next big step: '+esc(N[1])+' at level '+N[3].lv+'.':'The whole block is yours.')+'</p>'+(gdRoom()?'<p class="note">Fresh from your Garden: +'+Math.round(gdFresh()*100)+'% income while the pantry has stock. Pantry '+gdPantry()+'/'+foodCap()+', using '+gdUse(r)+' an hour.</p>':'')}
/* a sprite whose footprint is centered on x,y,w,d */
function rsS(C,k,x,y,w,d,h,o){return lfSpr(C,k,x,y,w,d,Object.assign({h:h,ctr:1},o||{}))}
/* a seat guests can use. face: 1 looks right, -1 looks left */
function rsSeat(C,x,y,face,wx,wy,tb,lbl,sz){var n0=C.st.length;C.s("sit",x,y,face,"eat",[10,20],{dk:99,tag:"diner",lift:1,sz:sz,wx:wx,wy:wy,tb:tb});lfConvert(C,n0,"sit",{uact:"eat",lbl:lbl||"T",grp:lbl||"t"})}
/* [sprite,w,d,h, left chair seat, right chair seat] seats are fractions of the image, measured from its top left */
var RSTBL={fold:["rsx_fold",2.0,2.0,18,[.16,.70],[.81,.31]],cafe:["rsx_cafe",2.0,2.0,22,[.19,.70],[.84,.37]],pine:["rsx_pine2",2.0,2.0,22,[.13,.33],[.77,.73]],pine4:["rsx_pine4",2.8,2.2,22,[.10,.31],[.62,.76]],marble:["rs_tbl2",2.0,1.9,22,[.13,.45],[.87,.45]],marble4:["rs_tbl4",2.6,2.1,22,[.10,.30],[.72,.75]],fine:["rs3_tbl2",2.2,2.0,24,[.11,.49],[.92,.37]],fine4:["rs3_tbl4",2.8,2.2,24,[.10,.50],[.85,.40]],iron:["rsx_iron",2.0,2.0,20,[.13,.62],[.84,.32]],umb:["rsx_umbrella",2.0,2.0,24,[.17,.78],[.87,.44]]};
var RSHIP=16;
/* a table with two chairs, both part of the art. Guests sit on the chairs in the picture. */
function rsTable(C,kind,x,y,lbl){var T=RSTBL[kind],S0=T&&window.LFSPR&&LFSPR[T[0]];if(!S0)return;var w=T[1],d=T[2],cx=x+w/2,cy=y+d/2,W=(w+d)*LF.sx,Hh=W*S0.h/S0.w,base=(w+d)/2*LF.sy;
  rsS(C,T[0],x,y,w,d,T[3]);
  [T[4],T[5]].forEach(function(f,i){var dx=(f[0]-.5)*W,dy=base-(1-f[1])*Hh+RSHIP,a=(dx/LF.sx+dy/LF.sy)/2,b=(dy/LF.sy-dx/LF.sx)/2;
    rsSeat(C,cx+a,cy+b,i?-1:1,cx+(i?1.4:.3),cy+(i?.3:1.5),[cx,cy],lbl,0)})}
function rsTierTable(C,big){return C.has("r_t3")?(big?"fine4":"fine"):C.has("r_t2")?(big?"marble4":"marble"):C.has("r_t1")?(big?"pine4":"pine"):null}
LFROOM.restaurant=function(C){
  rsArtReady();
  var H=function(k){return C.has(k)},st=H("r_x2")?2:H("r_x1")?1:0,Wi=RSSIZE[st][0],D=RSSIZE[st][1],patio=H("r_patio"),px=Wi;
  C.rsW=patio?Wi:0;
  lfDoorAt(C,Wi);
  /* windows on the left wall */
  [[3.2],[3.4,6.8],[3.7,7.0,10.3]][st].forEach(function(y){lfSprWin(C,"w_winrs2",.05,y,.1,.05,{H:92,dy:-34})});
  /* back wall */
  C.obsc=.7;
  if(H("r_s1"))lfOrderBoard(C,1.0,96,"ORDERS");
  if(st>0)lfSpr(C,"w_pass",7.6,.05,.1,.05,{flip:1,h:1,H:150,dy:-8,nosh:1});
  if(H("r_d2")){rsS(C,"rsx_shelf",1.0,.02,1.8,.1,1,{flip:1,H:58,dy:-58,nosh:1});if(st>0)rsS(C,"rsx_pics",5.2,.02,1.5,.1,1,{flip:1,H:44,dy:-74,nosh:1})}
  if(H("r_d3"))lfSpr(C,"w_menu",st>0?12.6:6.6,.05,.1,.05,{h:1,flip:1,H:56,dy:-96,nosh:1});
  if(H("r_scr")&&C.room)C.walls.push(lfFaceY(st>0?4.2:2.8,0,126,scrMenu(SVC.restaurant.menu(C.room),LF.U*2.6,58)));
  if(H("r_d4")){lfSpr(C,"w_neonrs",st>0?10.2:4.5,.05,.1,.05,{h:1,flip:1,H:54,dy:-84,nosh:1});lfLight(C,st>0?9.8:4.2,1.0,100,"#ff6aa8",2.2,.35)}
  if(H("r_chef"))lfSpr(C,"rs_chef",3.0,.05,.1,.05,{h:1,flip:1,H:26,dy:-112,nosh:1});
  if(H("r_star"))lfSpr(C,"rs_star",.05,2.2,.1,.1,{h:1,H:34,dy:-108,nosh:1});
  if(H("r_d7"))lfSpr(C,"w_mirror3",.05,D-.9,.1,.1,{h:1,H:84,dy:-30,nosh:1});
  /* the kitchen along the back wall */
  var ky=.15;
  rsS(C,H("r_k8")?"rsx_grand":H("r_k1")?"rsx_range":"rsx_hotplate",.5,ky,1.2,1.0,30,{flip:1});
  C.s("work",1.1,1.45,-1,"work",[8,16],{tag:"cook"});
  if(H("r_k2"))rsS(C,"rsx_prep",1.9,ky,2.2,1.0,30,{flip:1});
  C.s("work",3.0,1.45,-1,"work",[6,10],{tag:"prep"});
  rsS(C,H("r_k3")?"rsx_fridge":"rsx_minifridge",4.4,ky,1.1,.9,50,{flip:1});
  rsS(C,"rsx_rack",5.7,ky,1.0,.8,50,{flip:1});
  if(H("r_cf2"))rsS(C,"rs_coffee",st>0?13.6:7.0,ky,1.6,1.0,26,{flip:1});
  else if(H("r_cf1"))rsS(C,"rsx_drip",7.0,ky,.8,.7,26,{flip:1});
  if(st>0){
    if(H("r_k4"))rsS(C,"rsx_grill",8.0,ky,1.6,1.0,40,{flip:1});
    if(H("r_k5"))rsS(C,"rsx_fryer",9.8,ky,2.0,1.0,30,{flip:1});
    if(H("r_k9"))rsS(C,"rsx_dish",11.9,ky,1.6,.9,30,{flip:1});
    if(H("r_k6"))rsS(C,"rsx_bake",14.2,ky,.9,.8,50,{flip:1})
  }
  if(st>1&&H("r_k7")){rsS(C,"rsx_oven",15.4,ky,1.7,1.4,44,{flip:1});C.s("work",15.8,1.9,-1,"work",[6,12],{tag:"oven"});lfLight(C,16,1.0,40,"#ff9a3a",1.6,.6)}
  /* the counter */
  var cy=2.3,cl=[4.6,7.6,8.4][st],cx0=1.0;
  if(H("r_c2"))rsS(C,"rs3_counter",cx0,cy,cl,1.1,34,{flip:1,dk:cl*.5});
  else if(H("r_c1"))rsS(C,"rs2_counter",cx0,cy,cl,1.1,34,{flip:1,dk:cl*.5});
  else rsS(C,"rsx_counter0",cx0,cy,4.0,1.2,34,{flip:1,dk:2});
  lfPrep(C,"pass",cx0+cl*.5,1.5);
  if(H("r_c1")||H("r_c2")){var sts=[],k;for(k=0;k<[0,5,6][st];k++)sts.push(cx0+.8+k*1.3);sts.forEach(function(x){lfCStool(C,x,cy+1.7,x,cy+.6)})}
  if(st>1&&H("r_bar")){rsS(C,"rs2_bar",12.0,cy,4.6,1.1,34,{flip:1,dk:2.3});lfSpr(C,"w_backbar",15.0,.05,.1,.05,{flip:1,h:1,H:118,dy:-30,nosh:1});lfLight(C,15,1.0,70,"#ffb860",2.4,.4);[12.9,14.2,15.5].forEach(function(x){lfCStool(C,x,cy+1.7,x,cy+.6)})}
  /* booths on the window wall */
  if(H("r_b1")&&st>0)[[3.2,6.3],[3.2,6.2,9.1]][st-1].forEach(function(Y){var n0=C.st.length;lfSpr(C,H("r_b2")?"rsb_l1":"rsb_t2",.05,Y,3.0,2.6,{h:34,ctr:1});
    C.s("sit",.9,Y+1.3,1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:1.7,wy:Y+2.6,tb:[1.7,Y+1.3]});C.s("sit",2.6,Y+1.3,-1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:1.7,wy:Y+2.6,tb:[1.7,Y+1.3]});lfConvert(C,n0,"sit",{uact:"eat",lbl:"B",grp:"b"})});
  /* tables */
  var tier=rsTierTable(C,false),tier4=rsTierTable(C,true);
  var spots=[[[1.4,4.7],[5.2,4.7]],[[4.0,5.6],[7.8,5.6],[11.6,5.6]],[[4.2,6.4],[8.2,6.4],[12.2,6.4],[16.2,6.4]]][st];
  spots.forEach(function(p,i){rsTable(C,tier||(i%2?"cafe":"fold"),p[0],p[1],"T")});
  if(H("r_more1")){var ex=[[[8.2,5.7]],[[4.0,7.9],[9.6,7.9]],[[4.2,9.3],[9.6,9.3]]][st];ex.forEach(function(p,i){rsTable(C,(st>0&&i===0?tier4:tier)||"cafe",p[0],p[1],"T")})}
  if(H("r_more2")&&st>1)[[14.6,9.3],[18.0,9.3],[18.2,3.9]].forEach(function(p,i){rsTable(C,i===0?tier4:tier,p[0],p[1],"T")});
  lfWander(C,[[Wi*.45,cy+2.2,-1],[Wi*.75,cy+2.2,1],[Wi-1.6,D*.5,-1]]);
  /* lights */
  if(H("r_l2")&&st>1)[[6.6,8.0],[11.0,8.0],[15.4,8.0]].forEach(function(p){lfSpr(C,"rs3_chand",p[0],p[1],.2,.2,{h:1,H:112,dy:-84,nosh:1,dk:-6});lfLight(C,p[0],p[1],90,"#ffd890",3.2,.55)});
  else if(H("r_l1"))[0,1,2].forEach(function(i){var x=cx0+cl*(.2+.3*i);lfSpr(C,["rs_pend1","rs_pend2","rs_pend3"][i],x,cy+.7,.2,.2,{h:1,H:[84,92,88][i],dy:-70,nosh:1,dk:-5});lfLight(C,x,cy+.9,70,"#ffc968",2.3,.45)});
  else{var bx=Wi*.42,by=D*.55;rsS(C,"rsx_bulb",bx,by,.2,.2,1,{H:96,dy:-84,nosh:1,dk:-6});lfLight(C,bx,by,80,"#ffe2a8",2.6,.4)}
  /* odds and ends */
  if(!H("r_d1"))rsS(C,"rsx_mop",.25,D-1.4,.9,.9,24);
  if(H("r_d1")){lfSpr(C,"bd_plant",.3,D-1.2,.8,.8,{h:40,H:78});lfSpr(C,"bd_plant",Wi-1.3,.3,.8,.8,{h:40,H:78})}
  if(H("r_cool"))rsS(C,"rsx_cooler",Wi-2.5,.2,1.1,.9,50,{flip:1});
  if(H("r_d5")&&!H("r_d6"))lfSpr(C,"rs_wine",.05,1.0,.1,.1,{h:1,H:60,dy:-30,nosh:1});
  if(H("r_d6"))lfSpr(C,"rs3_cellar",.3,.3,1.4,1.2,{h:50,ctr:1,H:104});
  if(H("r_d8")){lfSpr(C,"rs3_flora",Wi-1.5,3.6,.8,.8,{h:40,H:70});lfSpr(C,"rs3_flora",2.8,D-1.0,.8,.8,{h:40,H:70})}
  if(H("r_hd2")){lfSpr(C,"rs_host",Wi-1.5,1.5,.8,.8,{h:30,flip:1,H:64})}else if(H("r_hd1"))rsS(C,"rsx_lectern",Wi-1.5,1.5,.8,.8,30,{flip:1});
  if(H("r_s3"))C.s("work",Wi-1.1,2.7,-1,"work",[6,12],{tag:"host"});
  if(H("r_sign")&&!patio)rsS(C,"rsx_aframe",Wi-.9,D*.5-2.0,.7,.5,24);
  /* the patio: everything past Wi */
  if(patio){
    var P=[lfP(px,0,0),lfP(C.W,0,0),lfP(C.W,D,0),lfP(px,D,0)],pl='';
    pl+=lfPoly(P,"#b98c5e","rgba(50,30,15,.6)",1);
    for(var q=.5;q<RSPATIO;q+=.5)pl+='<path d="M'+lfPt(lfP(px+q,0,0))+' L'+lfPt(lfP(px+q,D,0))+'" stroke="rgba(60,35,15,.28)" stroke-width="1"/>';
    pl+=lfPoly([lfP(px,0,0),lfP(px,D,0),lfP(px+.12,D,0),lfP(px+.12,0,0)],"#6d4c2e","none");
    C.decals.push(pl);
    if(H("r_sign"))rsS(C,"rsx_aframe",C.W-.9,D*.5-2.0,.7,.5,24);
    /* rails along the back and the far side */
    for(var rx=px+.3;rx<C.W-1;rx+=2.2)rsS(C,"rsx_rail",rx,.1,2.2,.2,20,{flip:1,nosh:1});
    var y2=4.3,y3=D-3.5;
    if(H("r_p1"))[px+.5,px+3.0].forEach(function(x){rsTable(C,"iron",x,1.5,"P")});
    if(H("r_p2"))[px+.4,px+3.4].forEach(function(x){rsTable(C,"umb",x,y2,"P")});
    if(H("r_p3")){rsS(C,"rsx_planter",px+.3,.35,1.9,.7,16,{flip:1});rsS(C,"rsx_planter",px+2.5,.35,1.9,.7,16,{flip:1});rsS(C,"rsx_olive",C.W-1.1,2.2,.9,.9,50)}
    if(H("r_p4")){rsS(C,"rsx_heater",px+2.7,y2+.5,.6,.6,60);lfLight(C,px+3,y2+.8,70,"#ff9a3a",2.4,.5)}
    if(H("r_p6"))rsS(C,"rsx_bbq",C.W-2.1,.4,1.7,1.0,28,{flip:1});
    if(H("r_p5")){rsS(C,"rsx_pergola",px+.3,y3-.2,3.0,3.0,90,{dk:-4});lfLight(C,px+1.8,y3+1.3,90,"#ffd890",3,.5)}
    if(H("r_p7")){rsS(C,"rsx_firepit",px+3.6,y3,2.7,2.7,24);lfLight(C,px+4.9,y3+1.4,50,"#ff9a3a",2.6,.6);rsSeat(C,px+4.0,y3+.9,1,px+3.4,y3+2.9,[px+4.9,y3+1.4],"F");rsSeat(C,px+5.3,y3+.3,-1,px+6.5,y3+1.2,[px+4.9,y3+1.4],"F")}
  }
};
SVC.restaurant={lbl:"T",unit:"Table",boardName:"Order board",verbs:["Waiting","In kitchen","Eating"],short:["wait","cook","eat"],quiet:"Kitchen quiet",
  staffIx:function(n){return n>=2?1:0},
  menu:function(r){var a=r.a||{},o=["Coffee","Noodles","Toast"];RS_UPS.forEach(function(u){if(a[u[0]]&&u[3].menu)o=o.concat(u[3].menu)});if(gdPantry()>0)o=o.concat(gdDishes());return o},
  use:"eat",udur:[12,22],pat:80,
  guests:function(r,C,n){var a=r.a||{};return Math.min(n,2+(a.r_x1?1:0)+(a.r_x2?2:0)+(a.r_patio?1:0)+(a.r_t1?1:0)+(a.r_more1?1:0)+(a.r_more2?2:0)+(a.r_s2?1:0))},
  steps:function(s,X){var A=X.A(s),P=X.P("pass");return [{x:A.x,y:A.y,act:"reach",tag:"order",dur:[1.2,1.9]},{x:P.x,y:P.y,act:"carry",tag:"serve",dur:[1.6,2.4],fx:-1},{x:A.x,y:A.y,act:"reach",tag:"place",dur:[1.1,1.6],carry:1}]}};
function rsStool(C,x,y,tbx,tby){var fancy=C.has("r_c2");lfSpr(C,fancy?"rs3_stool":"rs2_stool",x-.3,y-.3,.6,.6,{h:30,H:fancy?58:50,dk:-1});
  var n0=C.st.length;C.s("sit",x,y,1,"eat",[10,20],{dk:99,tag:"diner",lift:1,wx:x,wy:y+.9,tb:[tbx,tby]});lfConvert(C,n0,"sit",{uact:"eat",lbl:"S",grp:"s"})}
lfCStool=rsStool;
/* ---- the people: guests and staff are drawn by the same rig as the player ---- */
var RSGUESTS=[
 {body:"m",skin:"s2",hairStyle:"h2",hairColor:"brown",eq:["h_varsity","h_denim","h_sneak"]},
 {body:"f",skin:"s1",hairStyle:"h2",hairColor:"blonde",eq:["h_knit","h_pleat","h_loafer"]},
 {body:"m",skin:"s4",hairStyle:"h3",hairColor:"black",eq:["h_hoodie","h_cargo","y_skate"]},
 {body:"f",skin:"s3",hairStyle:"h1",hairColor:"black",eq:["y_baby","y_flare","y_plat"]},
 {body:"m",skin:"s1",hairStyle:"h1",hairColor:"auburn",eq:["y_flame","y_jorts","y_runner"]},
 {body:"f",skin:"s5",hairStyle:"h3",hairColor:"brown",eq:["h_cardi","y_skirt","y_mary"]},
 {body:"m",skin:"s3",hairStyle:"h2",hairColor:"black",eq:["h_coach","h_tech","h_derby","h_shades"]},
 {body:"f",skin:"s2",hairStyle:"h3",hairColor:"auburn",eq:["y_ring","y_track","h_high"]}];
var RSSTAFF={r_s1:{body:"m",skin:"s3",hairStyle:"h1",hairColor:"black",bottom:"joggers",bottomColor:"black",shoe:"sneakers",shoeColor:"black",eq:["npc_chef"]},
 r_s2:{body:"f",skin:"s2",hairStyle:"h2",hairColor:"brown",bottom:"joggers",bottomColor:"black",shoe:"sneakers",shoeColor:"black",eq:["npc_vest"]},
 r_s3:{body:"m",skin:"s4",hairStyle:"h3",hairColor:"black",bottom:"jeans",bottomColor:"black",shoe:"boots",shoeColor:"black",eq:["npc_vest"]},
 r_s4:{body:"f",skin:"s1",hairStyle:"h3",hairColor:"blonde",bottom:"joggers",bottomColor:"grey",shoe:"sneakers",shoeColor:"white",eq:["npc_chef","npc_hat"]}};
function rsNpc(spec){var D=QBLoft.data,c=Object.assign({},spec);delete c.eq;if(spec.eq){var eq={};spec.eq.forEach(function(g){var M=D.items[g];if(M)eq[M.slot]={art:g,frontOnly:M.frontOnly,over:M.over,wide:M.wide,lift:M.lift,clip:M.clip}});c.equipped=eq}
  return {rig:c,sex:spec.body,npc:1}}
lfGuestLook=function(){return rsNpc(RSGUESTS[Math.floor(Math.random()*RSGUESTS.length)])};
var rsRigState0=lfRigState;
lfRigState=function(a){var r=rsRigState0(a);if(r&&r.f!=null&&a.look&&a.look.npc){var q=/^(idle|back|sit)$/.test(r.clip)?4:2;r.f-=r.f%q}return r};
function rsStaffOf(r){var a=r.a||{};return ["r_s1","r_s2","r_s3","r_s4"].filter(function(k){return a[k]})}
function rsPeople(r,i,C,out){rsStaffOf(r).forEach(function(k,j){out.push({id:"rs:"+k,room:i,role:"crew",look:rsNpc(RSSTAFF[k]),ix:j})});
  var seats=C.st.filter(function(s){return s.cust}).length,n=Math.min(seats,SVC.restaurant.guests(r,C,seats));for(var g=0;g<n;g++)out.push({id:"g:"+i+":"+g,room:i,role:"guest",gi:g})}
