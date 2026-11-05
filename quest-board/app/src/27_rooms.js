/* ---------- every room beyond the first few ----------
   A room is a list of things. autoRoom lays them out with space between them: "B" along the
   back wall, "L" along the left wall, "F" on the open floor, in the order listed. Sprites
   that are not drawn yet are skipped, so the room still works. */
window.rmPortalsOn=1;window.LFNOANX=true;
var UP_S=200,UP_M=400,UP_L=800;
/* item: [id, name, price, sprite, where, w, d, height, line, extra] */
function autoRoom(t,o){var jogW=(o.jogs&&o.jogs[0])?o.jogs[0][2]:0,W0=o.size[0][0]-jogW,D0=o.size[0][1],bx=.5,ly=1.2,fi=0,lv=o.lv||1,cols=Math.max(2,Math.floor((W0-3.2)/3.4));
  var ups=o.items.map(function(q,n){var e=Object.assign({lv:o.startLv+Math.floor(n*(o.step||1)),g:o.group||"Upgrades"},q[9]||{}),w=q[5],d=q[6],where=q[4];
    if(q[3]&&where){var x,y,flip=0;
      if(where==="B"&&bx+w>W0-1.8)where="F";if(where==="L"&&ly+d>D0-.8)where="F";
      if(where==="B"){x=bx;y=.25;bx+=w+1.1;flip=1;e.cust=e.cust||[[x+w/2,y+d+1,-1]]}
      else if(where==="L"){x=.25;y=ly;ly+=d+1.1;e.cust=e.cust||[[x+w+1,y+d/2,-1]]}
      else{x=2.6+(fi%cols)*3.4;y=Math.min(D0-d-.8,2.8+Math.floor(fi/cols)*3.0);fi++;e.cust=e.cust||[[x+w/2,y+d+.8,1]]}
      e.art=[q[3],x,y,w,d,q[7],{flip:flip?1:0}]}
    var line=q[8];if(!e.opens&&e.g!=="Expansion"){var size=q[2]>=UP_L?2:q[2]>=UP_M?1:0;
      if(o.coin){if(e.p==null){e.p=[.06,.12,.24][size];line+=" Earns +"+Math.round(e.p*100)+"% here."}}
      else if(o.xpBase){e.xp=e.xp||[.5,1,2][size];line+=" +"+e.xp+"% XP on all quests."}}
    return [q[0],q[1],q[2],e,line]});
  roomDef(t,Object.assign({},o,{ups:ups}))}
/* ---- home ---- */
ADDONS.bedroom=ADDONS.bedroom.filter(function(a){return !/^bd_(cl_|lr_|lair|swing|pdeco)/.test(a[0])});
ADDONS.bedroom.forEach(function(a){var e=a[3];
  if(a[0]==="bd_ward2"){a[1]="Walk-in Closet";a[4]="Opens a whole new room through a glowing door. The Shop opens with it.";e.opens="closet"}
  if(a[0]==="bd_patio"){a[1]="Patio Door";a[4]="Slide the glass open to your own patio, 30 floors up.";e.opens="patio"}});
ADDONS.bedroom.push(["bd_game","Knock Into the Game Room",1500,{lv:18,opens:"gameroom",fp:1,g:"Expansion"},"A door to a room with one job: having fun."]);
ADDONS.bedroom.push(["bd_dbed1","Dog Bed",200,{fp:1,g:"Dogs"},"A soft round bed by the window."]);
ADDONS.bedroom.push(["bd_pluto","Adopt Pluto",400,{fp:1,g:"Dogs"},"A toy poodle with opinions."]);
ADDONS.bedroom.push(["bd_dbed2","Second Dog Bed",200,{fp:1,g:"Dogs"},"So nobody has to share."]);
ADDONS.bedroom.push(["bd_chop","Adopt Chopstick",400,{fp:1,g:"Dogs"},"A chihuahua dachshund mix. Very fast, very long."]);
Object.assign(ADDREQ,{bd_pluto:"bd_dbed1",bd_dbed2:"bd_pluto",bd_chop:"bd_dbed2"});
/* Painted walls (Cal approved the four tiers 2026-11-05). Tier 1 is the bare start; each tier is a painting of the walls
   and floor, in each Room style's colours (tools/shell_styles.py): art/app/bdw_t<tier>[_<style>].webp. */
ADDONS.bedroom.push(["bd_wt2","Fresh Paint & Oak Floors",120,{g:"Walls"},"Two soft paint colours, crown moulding and warm oak planks."]);
ADDONS.bedroom.push(["bd_wt3","Living Grass Wall",240,{g:"Walls"},"A floor-to-ceiling panel of soft living grass behind the bed, deep painted walls around it."]);
ADDONS.bedroom.push(["bd_wt4","Cove Lighting",360,{g:"Walls"},"Warm light washes down the walls and the grass, and along a brass rail."]);
Object.assign(ADDREQ,{bd_wt3:"bd_wt2",bd_wt4:"bd_wt3"});
/* A painted shell is drawn as the room's floor and walls, clipped to the same shapes the game draws them in. Its frame is
   tools/shell_guide.py's: floor corners 12 px in from the sides and 12 px above the bottom, 5:4. */
var LFSHELLK=null;
function lfShellPart(uid,part){var k=LFSHELLK,S0=k&&window.LFSPR&&LFSPR[k];if(!S0)return null;var N=LF.W,M=LF.D,H=LF.H,th=.42,
  w=(N+M)*26+24,h=w/1.25,x=-M*26-12,y=(N+M)*13+12-h,id="lfshc"+part+uid,
  P=function(a){return a.map(function(q){return lfPt(lfP(q[0],q[1],q[2]||0))}).join(" ")},
  polys=part==="floor"?[[[0,0],[N,0],[N,M],[0,M]]]:[[[-th,M,0],[0,M,0],[0,0,0],[0,0,H],[-th,-th,H],[-th,M,H]],[[0,0,0],[N,0,0],[N,-th,0],[N,-th,H],[-th,-th,H],[0,0,H]]];
  return '<clipPath id="'+id+'">'+polys.map(function(a){return '<polygon points="'+P(a)+'"/>'}).join("")+'</clipPath><image href="'+S0.u+'" x="'+x+'" y="'+y.toFixed(1)+'" width="'+w+'" height="'+h.toFixed(1)+'" preserveAspectRatio="none" clip-path="url(#'+id+')"/>'}
(function(){var f=lfFloor,w=lfWalls,r=lfRoomSvg;
  lfFloor=function(T,kind,st,uid){return lfShellPart(uid,"floor")||f(T,kind,st,uid)};
  lfWalls=function(t,st,uid,wx){return lfShellPart(uid,"walls")||w(t,st,uid,wx)};
  /* nested rooms (the Patio seen through the Bedroom glass) draw their own shell, so the key is saved and put back */
  lfRoomSvg=function(rr,i,C){var prev=LFSHELLK;LFSHELLK=(C&&C.shellK)||null;try{return r.apply(this,arguments)}finally{LFSHELLK=prev}}})();
function bdShellKey(C){var H=C.has,t=H("bd_wt4")?4:H("bd_wt3")?3:H("bd_wt2")?2:1,d=C.room&&C.T?lfDecFor(C.room,C.T):null,
  k="bdw_t"+t+(d&&d.id!=="mid"?"_"+d.id:"");return LFSPR[k]?k:LFSPR["bdw_t"+t]?"bdw_t"+t:null}
/* the old Bedroom drew these rooms inside itself. They are their own rooms now. */
var bedBase=LFROOM.bedroom;
LFROOM.bedroom=function(C){var h=C.has;C.has=function(k){return /^bd_(patio|swing|pdeco)$/.test(k)?false:h(k)};bedBase(C);C.has=h;rsArtReady();C.shellK=bdShellKey(C);
  /* Both dog beds along the front edge on the closet side, well apart: the corner by the plant stays clear. */
  /* each bed is a low platform: a dog in it sits on the cushion, drawn over the bed (without it the bed hid the dog) */
  var dbed=function(x){lfSpr(C,"hmx_dogbed",x,7.8,1.2,1.0,{h:6,ctr:1,H:40,dk:.5});C.plat.push({x0:x,y0:7.8,x1:x+1.2,y1:8.8,z:7,key:x+1.2+8.8+.01})};
  if(h("bd_dbed1")){dbed(2.0);if(h("bd_dbed2"))dbed(4.7)}
  C.dogs=[];if(h("bd_pluto"))C.dogs.push({id:"pluto",bed:[2.6,8.3]});if(h("bd_chop"))C.dogs.push({id:"chopstick",bed:[5.3,8.3]})};
/* the Closet and the Lair are single painted rooms: the art is the room */
function artRoom(C,k,T,a,b,c,d){var Sp=LFSP4[k];if(!Sp)return;var t=lfP(0,0,0),e=t[0]-(a*T[0]+c*T[1]),f=t[1]-(b*T[0]+d*T[1]);return '<image href="'+lfSp4Url(k,"d")+'" preserveAspectRatio="none" width="'+Sp.w+'" height="'+Sp.h+'" transform="matrix('+[a,b,c,d,e,f].map(function(v){return v.toFixed(5)}).join(",")+')"/>'}
/* The Closet grows in stages you can see (Cal approved the paintings 2026-11-05), all the same room, one painting each
   (art/raw/walls/closet, keyed with tools/key_green.py):
     start        clx_st0   closed walnut doors, lights off
     cl_glow      clx_st0l  Wardrobe Lights: warm LED strips along the top and the base of every wardrobe
     cl_shoe      clx_st1   the shoe and bag wall opens
     cl_jewel     clx_stj   two doors on the left wall open onto the jewelry display
     cl_isl       clx_st2   the marble island and the rug
     cl_mirror    clx_room  the glass doors, lit from inside
     cl_disp      clx_modern Super Sleek Modern: smoked glass, black marble, white light on every edge
   The ids are the old upgrades', renamed, so saves keep what they paid for. The Velvet Ottoman and Shoe Bench are retired:
   hidden from the shop, drawn nowhere. Any stage picture that is missing falls back to the finished painting. */
function clPaint(C,k,dim){var S0=LFSPR[k];if(!S0)return false;var W=C.W,D=C.D,x0=-D*26-6,w=(W+D)*26+12,h=w*S0.h/S0.w,y0=(W+D)*13+16-h;
  C.decals.push('<image href="'+S0.u+'" x="'+x0+'" y="'+y0.toFixed(1)+'" width="'+w+'" height="'+h.toFixed(1)+'"'+(dim?' style="filter:brightness(.62) saturate(.8)"':'')+'/>');return {x0:x0,y0:y0,k:w/S0.w}}
/* The closed corner cabinet (clx_lairdoor, cut from the Super Sleek Modern painting) slides along the upper wall into the
   wall, clipped to its own doorway, uncovering the Lair painting under it. Painting px: at (302.9, 106.4), 85 x 255. */
function clLairSlide(C,P){var S0=LFSPR.clx_lairdoor;if(!S0)return;var k=P.k,x=P.x0+302.9*k,y=P.y0+106.4*k,w=85*k,h=255*k,id="cllair"+(window.__clLairN=(window.__clLairN||0)+1),
  q=[[0,0],[w,w*.5],[w,h],[0,h-w*.5]].map(function(p){return (x+p[0]).toFixed(1)+","+(y+p[1]).toFixed(1)}).join(" ");
  C.decals.push('<clipPath id="'+id+'"><polygon points="'+q+'"/></clipPath><g clip-path="url(#'+id+')" pointer-events="none"><image href="'+S0.u+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'"><animateTransform id="'+id+'a" attributeName="transform" type="translate" from="0 0" to="'+w.toFixed(1)+' '+(w*.5).toFixed(1)+'" begin="indefinite" dur="2.2s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".45 0 .3 1"/></image></g>');
  /* Buying it opens the "You found the Hero's Lair" window over the room: slide only once that is closed and you can see it. */
  (function go(n){if(n<0){setTimeout(function(){go(0)},1500);return}var a=document.getElementById(id+"a");if(a&&!document.querySelector(".dropsplash,.rsplash")&&document.querySelectorAll("#layer .modal").length<=1){setTimeout(function(){try{a.beginElement()}catch(e){}},500);return}if(n<300)setTimeout(function(){go(n+1)},300)})(-1)}
autoRoom("closet",{name:"Walk-in Closet",lv:1,startLv:3,step:1,wall:"#3a2a20",wain:"#2a1e16",acc:"#ffd27a",fl:"w",size:[[7,7]],H:200,shell:1,door:false,guests:0,group:"Closet",desc:"Your clothes finally have a room of their own. Everything you buy in the Shop lives here.",
 req:[["cl_shoe","cl_glow"],["cl_jewel","cl_shoe"],["cl_isl","cl_jewel"],["cl_mirror","cl_isl"],["cl_disp","cl_mirror"],["cl_lair","cl_disp"]],
 /* Every stage is its own painting of the same room (Cal approved them 2026-11-05): lights off, Wardrobe Lights (LED strips
    top and base), the shoe wall opens, the jewelry wall opens, the island, glass doors, Super Sleek Modern, and last the
    Hero's Lair: the corner cabinet on the upper wall has slid away from a secret stair up. Right after buying it the
    cabinet slides into the wall once (clLairSlide). A save that opened the Lair before Super Sleek Modern keeps its stage. */
 draw:function(C,H){var lair=H("cl_lair")&&H("cl_disp"),k=lair?"clx_lair":H("cl_disp")?"clx_modern":H("cl_mirror")?"clx_room":H("cl_isl")?"clx_st2":H("cl_jewel")?"clx_stj":H("cl_shoe")?"clx_st1":H("cl_glow")?"clx_st0l":"clx_st0";
  var P=clPaint(C,k,0)||clPaint(C,"clx_room",0);
  /* bought just now: this closet was last drawn without it. Every copy drawn in the next few seconds slides (the room
     window's picture is built a moment after the purchase). Opening the game with it owned plays nothing. */
  var had=window.__clLair;window.__clLair=lair;if(had===false&&lair)window.__clLairT=Date.now();
  if(lair&&P&&k==="clx_lair"&&window.__clLairT&&Date.now()-window.__clLairT<5000)clLairSlide(C,P);
  C.s("look",2.6,1.2,1,"look",[6,11],{fxwall:1});C.s("look",1.2,3.9,-1,"look",[6,11],{fxwall:1});if(H("cl_shoe"))C.s("look",4.4,1.2,1,"look",[6,11],{fxwall:1})},
 help:{k:"New room",t:"The Closet is open!",sub:"Your own room for clothes, and it opens the Shop.",pts:[["The Shop is open","Buy clothes from the brands that drop every week."],["Build it up","Lights, a shoe wall, jewelry and an island, then glass doors. There may be a secret door."]]},
 items:[["cl_glow","Wardrobe Lights",UP_M,"","",0,0,0,"The closet lights up, top to bottom."],
  ["cl_shoe","Shoe & Bag Wall",UP_S,"","",0,0,0,"One wardrobe opens into lit shelves for every pair and every bag."],
  ["cl_jewel","Jewelry Wall",UP_S,"","",0,0,0,"Two wardrobe doors open onto velvet trays of rings, watches and necklaces."],
  ["cl_isl","Center Island",UP_M,"","",0,0,0,"Marble top, jewelry drawers and a soft rug, right in the middle."],
  ["cl_mirror","Glass Closet",UP_L,"","",0,0,0,"Every wardrobe door turns to glass, lit from inside."],
  ["cl_disp","Super Sleek Modern",UP_L,"","",0,0,0,"Smoked glass, black marble and white light along every edge."],
  ["cl_ott","Velvet Ottoman",UP_S,"","",0,0,0,"Retired.",{retired:1}],["cl_bench","Shoe Bench",UP_S,"","",0,0,0,"Retired.",{retired:1}],
  ["cl_lair","???",2500,"","",0,0,0,"A panel at the back of the closet sounds hollow.",{g:"Expansion",opens:"lair",lv:12}]]});
LFRS.closet=1.15;
var LAIRU={lr_rack:"rack",lr_console:"desk",lr_trophy:"trophy",lr_armory:"arm",lr_suit:"suit",lr_holo:"holo"};
autoRoom("lair",{name:"Hero's Lair",lv:1,startLv:12,step:1,wall:"#1a2036",wain:"#0f1424",acc:"#58a6ff",fl:"k",size:[[12,11.5]],shell:1,door:false,guests:0,group:"Lair",desc:"A hidden base behind your closet. From here you send people out on missions.",
 /* The room is one painting with its upgrades as painted layers. The war table's layer is painted between the console
    and the armory; it is drawn moved onto the floor emblem in the middle of the room (painting px +5,+60, room 7.0,6.5)
    and sorted with people, so anyone behind it is hidden by it and anyone in front is not. */
 draw:function(C,H){var A=LFLR,add=function(k){var x=artRoom(C,k,A.T,A.a,A.b,0,A.d);if(x)C.decals.push(x)};add("lair_in");Object.keys(LAIRU).forEach(function(u){if(H(u)&&u!=="lr_holo")add("lair_u_"+LAIRU[u])});
  if(H("lr_holo")){var x=artRoom(C,"lair_u_holo",[A.T[0]-5,A.T[1]-60],A.a,A.b,0,A.d);if(x){if(LFREC)lfRecBox(6.1,5.6,0,1.8,1.8,40);C._lb=[6.1,5.6,7.9,7.4];C.add(15.3,x)}}},
 help:{k:"Secret room",t:"You found the Hero's Lair!",sub:"A hidden base behind a sliding panel in your closet.",pts:[["Dungeons unlocked","The Dungeons tab is open. Send people on up to 5 missions a day."],["Bigger jobs pay more","Some missions need 2 or 3 people and pay far more."],["Fill it with gear","Servers, a command console, trophies and suits."]]},
 items:[["lr_rack","Server Racks",UP_S,"","",0,0,0,"Humming towers."],["lr_trophy","Trophy Wall",UP_M,"","",0,0,0,"Lit shelves for your best loot."],["lr_console","Command Console",UP_M,"","",0,0,0,"A curved desk with live screens."],["lr_armory","Armory Wall",UP_M,"","",0,0,0,"Tools and gadgets, racked and ready."],["lr_suit","Hero Suit Cases",UP_L,"","",0,0,0,"Three suits lit like museum pieces."],["lr_holo","Holo War Table",UP_L,"","",0,0,0,"Plan the next mission in 3D, right in the middle of the room.",{cust:[[7.0,8.0,-1],[5.5,6.6,1],[8.4,5.2,-1,{fxwall:1}]]}],PL("lr_drone","Drone Dock",UP_M,"hmx_drone",10.5,5.0,1.2,1.2,0,"Scouts missions before your team goes in.",{cust:[[9.9,6.7,1]]}),PL("lr_cans","Energy Canisters",UP_S,"hmx_cans",3.6,9.8,0.9,1.6,0,"Spare cells for the reactor. Blue, humming, do not shake.",{cust:[[5.0,10.6,1]]}),PL("lr_map","Gadget Workbench",UP_M,"hmx_bench",2.7,1.15,1.9,1.0,1,"Under the armory wall, where gadgets get built, and fixed, and built again.",{cust:[[3.65,2.75,-1,{fxwall:1}]]}),["lr_pad","Teleport Pad",UP_L,"","",0,0,0,"It probably works.",{art:["hmx_pad",9.0,8.6,1.8,1.8,40,{}],plat:6,cust:[[9.9,9.5,-1]]}],["lr_core","Reactor Core",UP_L,"","",0,0,0,"A glowing blue column. Do not touch.",{art:["hmx_core",.7,9.8,1.2,1.2,120,{}]}]]});
/* Downtown LA at golden hour, far behind the railing */
function patioSky(C){var W=Math.max(C.W,15),D=Math.max(C.D,11),a=lfP(0,D,0),b=lfP(W,0,0),t=lfP(0,0,0),x0=a[0]-150,x1=b[0]+150,y1=lfP(W,D,0)[1]+200,y0=t[1]-310,cx=(x0+x1)/2,g=t[1]+30;
  var s='<clipPath id="ptClip"><rect x="'+x0+'" y="'+y0+'" width="'+(x1-x0)+'" height="'+(y1-y0)+'" rx="12"/></clipPath><linearGradient id="ptSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6aa8"/><stop offset=".38" stop-color="#e58f7a"/><stop offset=".62" stop-color="#ffc27a"/><stop offset="1" stop-color="#ffe8b8"/></linearGradient><g clip-path="url(#ptClip)"><rect x="'+x0+'" y="'+y0+'" width="'+(x1-x0)+'" height="'+(y1-y0)+'" fill="url(#ptSky)"/><circle cx="'+(cx+110)+'" cy="'+(g-60)+'" r="30" fill="#fff3c4"/><circle cx="'+(cx+110)+'" cy="'+(g-60)+'" r="56" fill="#ffe6a8" opacity=".35"/>';
  var hill='M'+x0+' '+(g-40);for(var hx=x0;hx<=x1;hx+=40)hill+=' L'+hx+' '+(g-54-Math.sin(hx/70)*20-Math.sin(hx/23)*5).toFixed(0);s+='<path d="'+hill+' L'+x1+' '+y1+' L'+x0+' '+y1+'Z" fill="#b5808f"/>';
  var R=lfSeed(44),tower=function(x,w,h,col,lit,crown){var y=g-h,o='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+(h+120)+'" fill="'+col+'"/><rect x="'+x+'" y="'+y+'" width="'+(w*.3)+'" height="'+(h+120)+'" fill="rgba(255,190,120,.28)"/>';for(var fy=y+6;fy<g+60;fy+=7)for(var fx=x+3;fx<x+w-3;fx+=5)if(R()<.5)o+='<rect x="'+fx+'" y="'+fy+'" width="2.6" height="3" fill="'+lit+'"/>';
    if(crown==="spire")o+='<rect x="'+(x+w/2-1)+'" y="'+(y-34)+'" width="2" height="34" fill="'+col+'"/><path d="M'+x+' '+y+' Q'+(x+w/2)+' '+(y-16)+' '+(x+w)+' '+y+'Z" fill="'+col+'"/>';
    if(crown==="round")o+='<rect x="'+(x+3)+'" y="'+(y-14)+'" width="'+(w-6)+'" height="14" fill="'+col+'"/><rect x="'+(x+7)+'" y="'+(y-26)+'" width="'+(w-14)+'" height="12" fill="#e9c9a0"/>';return o};
  for(var bx=x0;bx<x1;bx+=30+R()*26)s+=tower(Math.round(bx),24+Math.round(R()*16),36+Math.round(R()*46),"#a06a7c","rgba(255,226,170,.5)");
  [[-120,30,120,"#6c4a70"],[-78,34,186,"#4a3a68","spire"],[-36,30,150,"#7a5468"],[-4,36,216,"#e0b48c","round"],[40,30,170,"#3e3a6c"],[74,26,132,"#8a5a62"],[104,34,104,"#5a4670"],[-168,30,92,"#6c4a70"],[144,28,84,"#7a5468"]].forEach(function(q){s+=tower(Math.round(cx+q[0]),q[1],q[2],q[3],"rgba(255,222,160,.65)",q[4])});
  s+='<rect x="'+x0+'" y="'+(g+22)+'" width="'+(x1-x0)+'" height="1400" fill="#3e3048"/>';for(var lx=x0;lx<x1;lx+=16+R()*22)s+='<rect x="'+lx.toFixed(0)+'" y="'+(g+18+R()*14).toFixed(0)+'" width="'+(10+R()*14).toFixed(0)+'" height="6" fill="'+["#6e5468","#8a6470","#54405e"][Math.floor(R()*3)]+'"/>';
  C.bg=s+'</g>'}
function ptRail(C){var W=C.W,D=C.D,z=30,s='',seg=function(A,B){var p=[lfP(A[0],A[1],2),lfP(B[0],B[1],2),lfP(B[0],B[1],z),lfP(A[0],A[1],z)];s+=lfPoly(p,"rgba(205,232,245,.3)","none");s+='<path d="M'+lfPt(p[3])+' L'+lfPt(p[2])+'" stroke="#39404c" stroke-width="2.4"/><path d="M'+lfPt(p[0])+' L'+lfPt(p[1])+'" stroke="#39404c" stroke-width="1.2"/>';for(var i=0;i<=Math.round(Math.hypot(B[0]-A[0],B[1]-A[1]));i++){var f=i/Math.max(1,Math.round(Math.hypot(B[0]-A[0],B[1]-A[1]))),x=A[0]+(B[0]-A[0])*f,y=A[1]+(B[1]-A[1])*f;s+='<path d="M'+lfPt(lfP(x,y,2))+' L'+lfPt(lfP(x,y,z))+'" stroke="#39404c" stroke-width="1"/>'}};
  seg([0,D],[0,0]);seg([0,0],[W,0]);C.walls.push(s);s='';seg([W,0],[W,D]);C.front.push('<g pointer-events="none">'+s+'</g>');
  /* The front-left edge is the building: the Bedroom's sliding door opens onto it (Cal's rule: the Bedroom's upper wall
     leads here, entered from this edge). A stone sill along it and a mat at the door. */
  var sill=[lfP(0,D-.22,0),lfP(W,D-.22,0),lfP(W,D,0),lfP(0,D,0)];C.decals.push(lfPoly(sill,"#cfc6b8","rgba(40,30,30,.35)",.6));
  C.decals.push(lfPoly([lfP(5.7,D-1.0,0),lfP(7.1,D-1.0,0),lfP(7.1,D-.25,0),lfP(5.7,D-.25,0)],"#7a5a3c","rgba(30,20,10,.4)",.6))}
/* Plush artificial turf (Cal: the old one "looks like a green square tile"): a painted seamless texture laid over the
   floor, about two tiles per repeat. False without its art, and the plain green floor is drawn instead. */
function ptTurf(C){var S0=window.LFSPR&&LFSPR.ptx_turf;if(!S0)return false;var U=LF.U,W=C.W,D=C.D,id="pttf"+(C.chu||0),t=U*2.2;
  C.decals.push(lfFloorG(.04,.04,'<defs><pattern id="'+id+'" patternUnits="userSpaceOnUse" width="'+t.toFixed(1)+'" height="'+t.toFixed(1)+'"><image href="'+S0.u+'" width="'+t.toFixed(1)+'" height="'+t.toFixed(1)+'" preserveAspectRatio="none"/></pattern></defs><rect width="'+(U*(W-.08)).toFixed(1)+'" height="'+(U*(D-.08)).toFixed(1)+'" fill="url(#'+id+')"/>'));return true}
/* String lights strung overhead (Cal: no more light tower): posts along the back rail, strands zigzagging across the
   patio to the building wall above the door edge, warm bulbs that glow more as it gets dark. */
function ptStrings(C){var W=C.W,D=C.D,L=lfLS(),dk=Math.max(0,Math.min(1,L.dark||0)),ho=(.4+dk*.55).toFixed(2),id="ptsl"+(C.chu||0),
  posts=[[.25,.25],[W/2,.25],[W-.25,.25]],tops=posts.map(function(q){return [q[0],q[1],118]}),hang=[[W*.25,D,128],[W*.75,D,128]],
  pairs=[[tops[0],hang[0]],[hang[0],tops[1]],[tops[1],hang[1]],[hang[1],tops[2]]],wire="",bulbs="",halo="";
  posts.forEach(function(q){C.add(q[0]+q[1]+.3,lfBox(q[0]-.06,q[1]-.06,0,.12,.12,120,"#2b2a30",{l:"#3a3940",r:"#1c1b20",top:"#4a4950"}))});
  pairs.forEach(function(pr){var a=lfP(pr[0][0],pr[0][1],pr[0][2]),b=lfP(pr[1][0],pr[1][1],pr[1][2]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+26;
    wire+='M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' Q'+mx.toFixed(1)+' '+my.toFixed(1)+' '+b[0].toFixed(1)+' '+b[1].toFixed(1)+' ';
    for(var k=1;k<10;k++){var t=k/10,x=(1-t)*(1-t)*a[0]+2*t*(1-t)*mx+t*t*b[0],y=(1-t)*(1-t)*a[1]+2*t*(1-t)*my+t*t*b[1]+3;
      halo+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="9" fill="url(#'+id+')"/>';
      bulbs+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.1" fill="#fff4cf" stroke="#c99a3a" stroke-width=".5"/>'}});
  C.front.push('<g pointer-events="none"><defs><radialGradient id="'+id+'"><stop offset="0" stop-color="#fff1c2" stop-opacity="'+ho+'"/><stop offset=".4" stop-color="#ffd27a" stop-opacity="'+(ho*.45).toFixed(2)+'"/><stop offset="1" stop-color="#ffb25a" stop-opacity="0"/></radialGradient></defs><path d="'+wire+'" fill="none" stroke="#2a2420" stroke-width="1"/>'+halo+bulbs+'</g>')}
autoRoom("patio",{name:"Sky Patio",lv:1,startLv:6,step:1,shell:2,door:false,wall:"#c9b6a2",wain:"#a58e78",acc:"#ffb36b",fl:"w",size:[[7.5,5]],guests:0,group:"Patio",xpBase:1,desc:"Your own balcony, 30 floors above Los Angeles, at golden hour.",
 draw:function(C,H){patioSky(C);if(!(H("pt_grass")&&ptTurf(C)))roomFloor(C,H("pt_grass")?["#6fa84f","rgba(50,90,30,.16)",.5]:["#9a7a5c","rgba(60,40,25,.3)",.5]);ptRail(C);if(H("pt_lights"))ptStrings(C)},
 help:{k:"New room",t:"Your patio is open!",sub:"Thirty floors up, with the whole LA skyline at sunset.",pts:[["Make it yours","Artificial grass, a chair that works up to an egg swing, string lights and more."],["Good dogs welcome","There is room for a dog bed out here too."]]},
 items:[["pt_grass","Artificial Grass",UP_M,"","",0,0,0,"Soft green underfoot, no mowing."],["pt_chair0","Simple Chair",UP_S,"","",0,0,0,"Somewhere to sit and watch.",{art:["hmx_chair0",1.0,1.0,1.0,1.0,52,{}]}],["pt_plant","Planter",UP_S,"","",0,0,0,"Green against the sunset.",{art:["hmx_pplant",3.0,.3,1.8,.6,58,{flip:1}]}],["pt_table","Bistro Table",UP_S,"","",0,0,0,"Coffee with a view.",{art:["hmx_table",6.45,.3,.8,.8,40,{}]}],["pt_lights","String Lights",UP_M,"","",0,0,0,"Warm bulbs strung across the patio for when the sun goes.",{light:[3.75,2.5,110,"#ffd890",3.2,.4]}],["pt_dbed","Patio Dog Bed",UP_S,"","",0,0,0,"For sunbathing.",{art:["hmx_dogbed",1.4,3.6,1.1,.9,30,{}]}],["pt_dbed2","Second Patio Dog Bed",UP_S,"","",0,0,0,"Chopstick's own. Nobody has to share the sun.",{art:["hmx_dogbed",.2,3.6,1.1,.9,30,{}]}],["pt_chair1","Wicker Lounge Chair",UP_M,"","",0,0,0,"A real upgrade.",{art:["hmx_chair1",1.0,1.0,1.2,1.2,58,{}]}],["pt_bowl","Fire Bowl",UP_M,"","",0,0,0,"A low fire in the middle of the patio.",{art:["hmx_bowl",3.15,1.9,1.2,1.2,34,{}],light:[3.75,2.5,30,"#ff9a3a",2.2,.55]}],PL("pt_rug","Outdoor Rug",UP_S,"hmx_rug",2.5,1.05,2.7,2.5,0,"Soft ground around the fire.",{cust:[[3.7,4.6,1]],o:{dk:9}}),PL("pt_scope","Brass Telescope",UP_S,"hmx_scope",5.7,3.3,0.8,0.8,0,"Look straight into someone else's patio.",{cust:[[6.1,4.8,-1]]}),PL("pt_cart","Rattan Bar Cart",UP_S,"hmx_cart",5.2,0.3,0.9,0.7,1,"Sunset drinks, no walking required.",{cust:[[5.65,1.7,-1]]}),["pt_egg","Egg Swing",UP_L,"","",0,0,0,"The premium seat. Swings a little.",{art:["bd4_swing",1.0,.9,1.4,1.4,100,{}]}]],sup:[["pt_chair0","pt_chair1"],["pt_chair1","pt_egg"]],req:[["pt_dbed2","pt_dbed"]]});
/* ---- business ---- */
ROOMBUY.forEach(function(){});
var RSK={body:"f",skin:"s2",hairStyle:"h2",hairColor:"black",top:"tee",topColor:"white",bottom:"jeans",bottomColor:"black",shoe:"sneakers",shoeColor:"white"};
autoRoom("skybar",{name:"Upstairs Bar",lv:1,startLv:30,step:1,dark:1,wall:"#191619",wain:"#141214",acc:"#ffb46a",fl:"d",size:[[14,10]],layout:[12,9,7,4],coin:20,guests:4,group:"Bar",staff:[["sb_tender",RSK]],desc:"A dark cocktail bar above the Restaurant. Marble, brass and low light.",
 walls:function(){return ["#191619","#141214","rgba(201,160,110,.12)"]},floor:function(){return ["#231b16","rgba(0,0,0,.3)",.8]},
 draw:function(C){lfLight(C,3.6,1.2,50,"#ffb46a",3.2,.55);C.s("work",3.6,1.55,-1,"work",[6,12],{tag:"cook"})},
 help:{k:"New room",t:"The Upstairs Bar is open!",sub:"Sleek, moody and all yours. It sits above the Restaurant and earns on its own.",pts:[["The bar comes first","Add the back bar and stools so people have somewhere to sit."],["Then a reason to stay","A lounge, a grand piano and an oyster station all bring in a bigger crowd."],["Keep going up","One day this leads to the roof."]]},
 items:[["sb_bar","Black Marble Bar",UP_M,"sbx_bar","",0,0,0,"Long enough for a crowd, lit from underneath.",{art:["sbx_bar",.7,2.0,6.2,1.2,70,{flip:1}]}],["sb_bottles","Mirrored Back Bar",UP_M,"sbx_back","",0,0,0,"Glowing shelves and a brass ladder.",{art:["sbx_back",.7,.1,5.6,.7,140,{flip:1}]}],["sb_stool","Bar Stools",UP_S,"sbx_gstool","",0,0,0,"Three seats at the bar.",{art:[["sbx_gstool",1.5,3.45,.64,.64,54,{flip:1,dk:-4.0}],["sbx_gstool",3.1,3.45,.64,.64,54,{flip:1,dk:-2.4}],["sbx_gstool",4.7,3.45,.64,.64,54,{flip:1,dk:-.8}]],sit:[[1.82,3.75,1,10,1],[3.42,3.75,1,10,1],[5.02,3.75,1,10,1]]}],["sb_tender","Hire a Bartender",UP_M,"","",0,0,0,"Knows your usual."],["sb_high1","High-Top Tables",UP_S,"sbx_hi","",0,0,0,"Stand, drink, talk.",{art:[["sbx_hi",8.0,1.6,1.0,1.0,76,{}],["sbx_hi",10.0,1.6,1.0,1.0,76,{}]],cust:[[8.1,2.9,1],[10.1,2.9,-1]]}],["sb_sofa","Emerald Lounge",UP_M,"sbx_sofa","",0,0,0,"A deep curved sofa, low and green.",{art:["sbx_sofa",.4,5.1,2.0,3.2,60,{}],cust:[[3.3,7.6,-1]]}],["sb_side","Lounge Table",UP_S,"sbx_tbl","",0,0,0,"Smoked glass and brass, always a cocktail on it.",{art:["sbx_tbl",2.7,5.9,1.2,1.2,36,{}]}],["sb_high2","More High-Tops",UP_S,"sbx_hi","",0,0,0,"Room for a bigger crowd.",{art:[["sbx_hi",8.0,4.0,1.0,1.0,76,{}],["sbx_hi",10.0,4.0,1.0,1.0,76,{}]],cust:[[8.1,5.2,1],[10.1,5.2,-1]]}],["sb_oyster","Oyster & Champagne Station",UP_M,"sbx_ice","",0,0,0,"Crushed ice and something to celebrate.",{art:["sbx_ice",6.4,.3,1.3,1.0,60,{flip:1}]}],["sb_humidor","Glass Humidor",UP_M,"sbx_cig","",0,0,0,"A tall glowing cabinet in the back.",{art:["sbx_cig",8.3,.1,.9,.6,104,{flip:1}]}],["sb_piano","Grand Piano",UP_L,"sbx_piano","",0,0,0,"Live music every night. People stay for another round.",{art:["sbx_piano",6.2,6.3,2.4,2.0,70,{}],cust:[[5.6,7.2,1],[7.2,5.9,1]],splash:"A grand piano in the corner. The whole room slows down and stays longer."}],PL("sb_chester","Chesterfield",UP_M,"sbx_chester",3.3,7.6,2.4,1,1,"Brown leather and brass studs.",{cust:[[4.5,9.3,1]]}),PL("sb_stage","Jazz Corner",UP_L,"sbx_stage",9.9,6.5,1.9,1.9,0,"One microphone. Nobody leaves.",{cust:[[10.85,9.1,-1]]}),PL("sb_trolley","Champagne Trolley",UP_S,"rtx_trolley",5.8,4.4,1,0.8,0,"It rolls right to your table.",{cust:[[7.9,6,-1]]}),["sb_roof","Open the Roof",2500,"","",0,0,0,"Stairs up to a rooftop bar.",{g:"Expansion",opens:"rooftop",lv:40}]]});
/* Pool guests stand at its open sides. Behind it, the raised far wall hid everyone below the shoulders. */
/* Bar stools sit in front of the long counter, but a long piece sorts by its far corner, so the stools are lifted
   just past it, each by its own amount, so they still sort under anything in front of them (a single
   dk of -4.2 put the end stool over the champagne trolley). Without it the counter's brass footrail is drawn across the stool legs. */
function rfRail(C){var W=C.W,D=C.D,z=26,s='',seg=function(A,B){var p=[lfP(A[0],A[1],0),lfP(B[0],B[1],0),lfP(B[0],B[1],z),lfP(A[0],A[1],z)];s+=lfPoly(p,"rgba(170,215,235,.22)","none")+'<path d="M'+lfPt(p[0])+' L'+lfPt(p[1])+'" stroke="#ffcf8a" stroke-width="2.2" opacity=".9"/><path d="M'+lfPt(p[3])+' L'+lfPt(p[2])+'" stroke="rgba(235,245,250,.7)" stroke-width="1.1"/>'};seg([0,D],[0,0]);seg([0,0],[W,0]);C.walls.push(s);s='';seg([0,D],[W-1.4,D]);C.front.push('<g pointer-events="none">'+s+'</g>')}
function rfPool(C,x,y,w,d){var P=[lfP(x+.35,y+.4,1),lfP(x+w-.35,y+.4,1),lfP(x+w-.35,y+d-.35,1),lfP(x+.35,y+d-.35,1)],s='';for(var i=0;i<7;i++){var f=(i+.5)/7,a=lfP(x+.5+f*(w-1),y+.7+((i*37)%10)/10*(d-1.4),1);s+='<ellipse class="rfg" style="animation-delay:-'+(i*.7).toFixed(1)+'s" cx="'+a[0].toFixed(1)+'" cy="'+a[1].toFixed(1)+'" rx="'+(9+i%3*5)+'" ry="2.2" fill="#eafcff"/>'}C.add(x+y+w+d-1.2,'<g pointer-events="none">'+s+'</g>')}
autoRoom("rooftop",{name:"Rooftop Bar",lv:1,startLv:40,step:1,shell:2,door:false,wall:"#c9b6a2",wain:"#a58e78",acc:"#ffb36b",fl:"w",size:[[15,11]],layout:[12,9],coin:40,guests:5,group:"Rooftop",desc:"Open air, a pool and the whole city at sunset.",
 floor:function(){return ["#b9a78f","rgba(70,55,40,.22)",1]},
 draw:function(C,H){patioSky(C);rfRail(C);if(H("rf_pool"))rfPool(C,roomSpread("rooftop",4.2,6.4,0),roomSpread("rooftop",3.0,3.8,1),6.4,3.8)},
 help:{k:"New room",t:"The Rooftop is open!",sub:"Stone, sky and nothing above you. It earns more than anything else in this building.",pts:[["The pool changes everything","Build it first and the rest of the roof forms around it."],["Then fill the deck","Loungers, cabanas, a bar, a DJ and a hot tub."]]},
 items:[["rf_bar","Outdoor Bar",UP_M,"rfx_bar","",0,0,0,"Stone and teak with four stools.",{art:["rfx_bar",.5,.4,3.8,1.3,74,{flip:1}],cust:[[1.4,2.3,-1],[3.0,2.3,-1]]}],["rf_plant","Tall Planters",UP_S,"rfx_planter","",0,0,0,"Grasses and small palms in the corners.",{art:[["rfx_planter",.3,7.6,1.0,1.0,90,{}],["rfx_planter",10.8,.3,1.0,1.0,90,{}]]}],["rf_pool","Rooftop Pool",UP_L,"rfx_pool","",0,0,0,"Turquoise water thirty floors up. The whole roof turns around it.",{art:["rfx_pool",4.2,3.0,6.4,3.8,70,{dk:2.2}],cust:[[3.6,4.2,1],[3.6,6.2,1],[11.2,5.2,-1]],splash:"The pool is in. Guests come up just to stand at the edge and look at it.",light:[7.4,4.9,60,"#7fe9ff",3.4,.45]}],["rf_lng","Sun Loungers",UP_S,"rfx_lng","",0,0,0,"Two more people staying all afternoon.",{art:["rfx_lng",4.4,7.0,2.2,1.5,44,{flip:1}],cust:[[4.0,7.8,1]]}],["rf_lng2","More Loungers",UP_S,"rfx_lng","",0,0,0,"The other side of the pool fills up.",{art:["rfx_lng",7.4,7.0,2.2,1.5,44,{flip:1}],cust:[[7.0,7.8,1]]}],["rf_umb","Parasol Table",UP_S,"rfx_umb","",0,0,0,"Shade and lunch for four.",{art:["rfx_umb",.6,5.2,2.3,2.3,110,{}],cust:[[3.1,6.4,-1]]}],["rf_sect","Fire Table Lounge",UP_M,"rfx_sect","",0,0,0,"A long fire table for when the sun goes.",{art:["rfx_sect",.5,2.4,2.6,2.6,50,{}],cust:[[3.2,3.6,-1]],light:[1.8,3.7,50,"#ff9a3a",2.6,.5]}],["rf_dj","DJ Booth",UP_M,"rfx_dj","",0,0,0,"Music you can hear from the street.",{art:["rfx_dj",5.0,.3,2.4,1.2,80,{flip:1}],cust:[[6.2,2.1,-1]]}],["rf_cab","White Cabana",UP_L,"rfx_cab","",0,0,0,"Curtains, cushions and a minimum spend.",{art:["rfx_cab",8.0,.2,2.6,2.2,110,{flip:1}],cust:[[8.6,2.7,-1]]}],PL("rf_towel","Towel Station",UP_S,"rfx_towel",10.8,4.6,1,0.7,0,"Rolled, white and always warm.",{cust:[[11.3,6,-1]]}),PL("rf_shower","Stone Shower",UP_S,"rfx_shower",10.9,2.6,0.9,0.9,0,"Rinse off with a view.",{cust:[[11.35,4.2,-1]]}),PL("rf_ice","Ice Cream Cart",UP_S,"rfx_icecart",3,7.5,1,0.9,0,"Melts before you finish it.",{cust:[[3.5,9.1,1]]}),PL("rf_float","Flamingo Float",UP_S,"rfx_float",6.6,4.2,1.6,1.4,0,"A giant pink flamingo on the water.",{o:{dk:-3}}),["rf_tub","Hot Tub",UP_L,"rfx_tub","",0,0,0,"Steam against the skyline.",{art:["rfx_tub",10.2,7.0,1.6,1.6,50,{}],cust:[[9.7,8.5,1]]}]]});
/* ---- entertainment ---- */
/* the empty units along the walls. A shop fills one when you buy it. */
var MLBACK=[.5,5.0,9.5],MLLEFT=[6.0,1.4];
function mlCut(k,w,lit,acc){var U=LF.U,W=U*w,o='<rect width="'+W+'" height="120" fill="#14151c"/><rect x="5" y="20" width="'+(W-10)+'" height="100" fill="#20222c"/>';for(var y=26;y<118;y+=7)o+='<path d="M6 '+y+'H'+(W-6)+'" stroke="rgba(255,255,255,.05)" stroke-width="1.4"/>';o+='<rect x="0" y="0" width="'+W+'" height="16" fill="#b8b2a6"/><rect x="0" y="16" width="'+W+'" height="3" fill="'+acc+'" opacity=".85"/><rect x="0" y="0" width="4" height="120" fill="#b8b2a6"/><rect x="'+(W-4)+'" y="0" width="4" height="120" fill="#b8b2a6"/>';return o}
function mlShell(C){var R=lfSeed(9),v='',W=C.W,D=C.D;
  for(var sx=0;sx<W;sx+=2)for(var sy=0;sy<D;sy+=2)if((sx+sy)%4===0)v+=lfPoly([lfP(sx,sy,0),lfP(Math.min(W,sx+2),sy,0),lfP(Math.min(W,sx+2),Math.min(D,sy+2),0),lfP(sx,Math.min(D,sy+2),0)],"rgba(255,255,255,.4)","none");
  for(var i=0;i<26;i++){var x=R()*W,y=R()*D,a=lfP(x,y,0),b=lfP(Math.min(W,x+1.2+R()*2),Math.min(D,y+R()*1.4),0),m=[(a[0]+b[0])/2+(R()-.5)*26,(a[1]+b[1])/2+(R()-.5)*14];v+='<path d="M'+lfPt(a)+' Q'+m[0].toFixed(1)+' '+m[1].toFixed(1)+' '+lfPt(b)+'" fill="none" stroke="rgba(120,112,118,'+(.08+R()*.1).toFixed(2)+')" stroke-width="'+(.5+R()*.7).toFixed(1)+'"/>'}C.decals.push('<g pointer-events="none">'+v+'</g>');
  MLBACK.forEach(function(x){C.walls.push(lfFaceY(x,0,120,mlCut(0,3.8,0,"#6cd0ff")))});MLLEFT.forEach(function(y){C.walls.push(lfFaceX(0,y+3.4,120,mlCut(0,3.4,0,"#6cd0ff")))})}
autoRoom("mall",{name:"Mall",lv:30,cost:3000,buy:1,startLv:30,step:1,wall:"#efe9df",wain:"#d9d1c4",acc:"#6cd0ff",fl:"t",size:[[14,10]],coin:40,guests:5,group:"Mall",desc:"An empty strip mall: polished marble and five empty storefronts. Fill them and people come.",
 floor:function(){return ["#ece8e2","rgba(135,125,118,.2)",2]},
 draw:function(C){mlShell(C)},
 help:{k:"New room",t:"The Mall is open!",sub:"For now it is an empty marble strip mall with a row of empty storefronts.",pts:[["Fill the storefronts","Each shop or kiosk draws a bigger crowd and earns more."],["Three doors to more","The Arcade, the Bowling Alley and Karaoke are their own rooms. Open them from here."]]},
 items:[["ml_shop1","Clothing Store",UP_M,"mlx_shop1","",0,0,0,"Fills the first storefront.",{art:["mlx_shop1",.5,.15,3.8,.6,120,{flip:1}],cust:[[2.4,1.7,-1]]}],["ml_kiosk1","Phone Case Kiosk",UP_S,"mlx_kiosk1","",0,0,0,"Every mall has one.",{art:["mlx_kiosk1",2.8,3.0,1.6,1.4,70,{}],cust:[[3.6,5.0,-1]]}],["ml_shop2","Sneaker Store",UP_M,"mlx_shop2","",0,0,0,"Fills the second storefront.",{art:["mlx_shop2",5.0,.15,3.8,.6,120,{flip:1}],cust:[[6.9,1.7,-1]]}],["ml_bench","Benches & Planters",UP_S,"mlx_bench","",0,0,0,"Where dads wait.",{art:["mlx_bench",3.0,7.4,2.2,.8,50,{}],cust:[[2.6,8.6,1]]}],["ml_kiosk2","Pretzel Kiosk",UP_S,"mlx_kiosk2","",0,0,0,"You smell it first.",{art:["mlx_kiosk2",10.4,7.0,1.6,1.4,70,{}],cust:[[11.2,9.0,-1]]}],PL("ml_palm","Indoor Palm",UP_S,"mlx_palm",1.3,8.8,.8,.8,0,"A little green on all that marble."),["ml_dir","Directory Screen",UP_S,"","",0,0,0,"A screen that cycles through the stores.",{fx:function(C){C.walls.push(lfFaceX(0,1.3,122,scrMenu(["Clothing","Sneakers","Pretzels","Phones","Arcade","Bowling","Karaoke"],LF.U*1.2,58)))}}],["ml_shop3","Toy Store",UP_M,"mlx_shop3","",0,0,0,"Fills the storefront on the left wall.",{art:["mlx_shop3",.15,6.0,.6,3.4,120,{}],cust:[[1.7,7.7,1]]}],["ml_foun","Mall Fountain",UP_L,"mlx_foun","",0,0,0,"Pennies and all. Everyone meets here.",{art:["mlx_foun",5.6,3.2,3.2,3.2,100,{}],cust:[[5.0,5.0,1],[7.2,6.9,-1],[9.2,4.8,-1]],splash:"A fountain at the center of the mall. Everyone meets here."}],["ml_esc","Escalator",UP_L,"mlx_esc","",0,0,0,"Up to the Bowling Alley, against the back wall.",{art:["mlx_esc",10.6,.3,1.7,3.4,120,{}]}],PL("ml_food","Food Court Table",UP_S,"mlx_food",7.5,7.6,2,2,0,"Four stools, shared fries.",{cust:[[9.8,10,-1]]}),PL("ml_photo","Photo Booth",UP_S,"mlx_photo",12.4,4.2,1.2,1.2,0,"Four poses, one good one.",{cust:[[11.8,4.8,1]]}),PL("ml_gum","Gumball Machines",UP_S,"mlx_gum",0.9,4.3,1.3,0.7,0,"Every kid needs a coin.",{cust:[[1.55,5.7,1]]}),PL("ml_ride","Coin Rocket Ride",UP_S,"mlx_ride",5.4,7.4,1,1,0,"It goes up four inches.",{cust:[[5.9,9.1,-1]]}),PL("ml_flower","Flower Kiosk",UP_M,"mlx_flower",12.3,5.8,1.4,1.2,0,"The whole corner smells good.",{cust:[[12.5,9.5,-1]]}),["ml_arc","Open the Arcade",2000,"","",0,0,0,"Its own room, through a door on the right.",{g:"Expansion",opens:"arcade",lv:34}],["ml_bow","Open the Bowling Alley",2500,"","",0,0,0,"Its own room, up from the last storefront.",{g:"Expansion",opens:"bowling",lv:38}],["ml_kar","Open Karaoke",2000,"","",0,0,0,"Its own room, up from the left wall.",{g:"Expansion",opens:"karaoke",lv:42}]]});
/* ---- doors ---- [from, to, side, position, color, label]. BL/BR are the back walls, FL/FR the open front edges. */
portal("bedroom","closet","BL",6.5,"#ffd27a","Closet");portal("closet","bedroom","FR",2.6,"#ffd27a","Bedroom");
portal("bedroom","patio","BR",8.9,"#ffb070","Patio");portal("patio","bedroom","FL",6.4,"#ffb070","Bedroom");
portal("bedroom","gameroom","FR",7.2,"#7df9ff","Game Room");portal("gameroom","bedroom","FL",2.4,"#7df9ff","Bedroom");
/* Cal: the Closet's upper (back-right) wall leads up, so the Lair sits above the Closet, its door the painted secret one. */
portal("closet","lair","BR",1.1,"#2a6bff","Hidden Door");portal("lair","closet","FL",6,"#2a6bff","Closet");
portal("restaurant","skybar","BR",4.2,"#ffb46a","Upstairs");portal("skybar","restaurant","FR",3,"#ffb46a","Downstairs");
portal("skybar","rooftop","BR",12.5,"#ffb36b","Roof");portal("rooftop","skybar","FR",3,"#ffb36b","Bar");
portal("boba","dessert","BR",8.8,"#c79aff","Upstairs");portal("dessert","boba","FR",3,"#ff9ec4","Downstairs");
portal("dessert","speakeasy","BR",10,"#ffb46a","Hidden Door");portal("speakeasy","dessert","FR",3,"#c79aff","Dessert");
portal("theater","auditorium","BL",4.2,"#ffd27a","Auditorium");portal("auditorium","theater","FR",2,"#ffd27a","Lobby");
portal("theater","mall","FR",7.4,"#6cd0ff","Mall");portal("mall","theater","FL",3,"#ffd27a","Theater");
portal("mall","arcade","FR",8,"#ff4fa3","Arcade");portal("arcade","mall","FL",3,"#6cd0ff","Mall");
portal("mall","bowling","BR",11.4,"#ffc857","Bowling");portal("bowling","mall","FR",3,"#6cd0ff","Mall");
portal("mall","karaoke","BL",3.1,"#ff7ad8","Karaoke");portal("karaoke","mall","FR",3,"#6cd0ff","Mall");
portal("arcade","rhythm","BR",11,"#7df9ff","Rhythm");portal("rhythm","arcade","FR",3,"#ff4fa3","Arcade");
portal("arcade","vr","FR",6,"#58d6ff","VR");portal("vr","arcade","FL",3,"#ff4fa3","Arcade");
/* ---- what unlocks what ---- */
function areaGate(id){if(id==="shop")return !hasRoom("closet");if(id==="away")return !hasRoom("lair");return false}
function worldMigrate(){var B=S.base;if(!B)return;var bd=B.slots[0],a=bd&&bd.a||{},add=function(t){if(!hasRoom(t))B.slots.push({t:t,a:{},st:0,pend:0})};
  if(a.bd_ward2)add("closet");if(a.bd_patio)add("patio");
  var cl=B.slots.filter(function(r){return r&&r.t==="closet"})[0];if(a.bd_lair&&cl){cl.a.cl_lair=1;add("lair")}
  var map={bd_cl_shoe:["closet","cl_shoes"],bd_cl_isle:["closet","cl_isle"],bd_lr_rack:["lair","lr_rack"],bd_lr_desk:["lair","lr_console"],bd_lr_trophy:["lair","lr_trophy"],bd_lr_arm:["lair","lr_armory"],bd_lr_suit:["lair","lr_suit"],bd_lr_holo:["lair","lr_holo"],bd_swing:["patio","pt_egg"]};
  Object.keys(map).forEach(function(k){if(a[k]){var r=B.slots.filter(function(q){return q&&q.t===map[k][0]})[0];if(r)r.a[map[k][1]]=1}})}
