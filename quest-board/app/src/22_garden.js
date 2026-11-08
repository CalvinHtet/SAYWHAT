/* ---------- the garden ----------
   Passive: it grows ingredients on its own. The Restaurant uses them and earns more while
   the pantry has stock, and crops add dishes to its menu. To add an upgrade, add a line to
   GD_UPS and, if it shows in the room, a line in LFROOM.garden. */
/* the Garden lot goes up for sale at level 5, as The Loft's welcome card says (QA ba1758a; LEAD: level 5) */
ROOMT.garden=Object.assign(ROOMT.garden,{lv:5,cost:3000,food:"veg",rate:3,coin:6,store:8,desc:"A small plot behind the building. It grows ingredients on its own, the Restaurant cooks with them and earns more, and spare produce sells for coins."});
/* effect: p output, fresh Restaurant income bonus, dish adds to its menu, shelf pantry size, cap stored hours, lv, g, also */
var GD_UPS=[
 /* plots */
 ["g_p1","Raised Bed",500,{p:.2,fresh:.04,lv:14,g:"Plots"},"A third bed with proper timber sides."],
 ["g_let","Salad Rows",900,{p:.15,fresh:.05,lv:15,g:"Plots",dish:"Garden Salad"},"Lettuce, carrots and a new salad on the menu."],
 ["g_tom","Tomato Stakes",1200,{p:.15,fresh:.05,lv:16,g:"Plots",dish:"Tomato Soup"},"Tall vines and a soup people ask about."],
 ["g_herb","Herb Planters",1500,{p:.1,fresh:.05,lv:17,g:"Plots",dish:"Pesto Pasta"},"Basil, thyme and rosemary by the fence."],
 ["g_p2","More Plots",2800,{p:.3,fresh:.05,lv:21,g:"Plots",also:"g_x1"},"Two more beds on the new ground."],
 ["g_berry","Berry Patch",3200,{p:.15,fresh:.07,lv:23,g:"Plots",also:"g_x1",dish:"Berry Tart"},"Red and blue, and a tart to match."],
 ["g_p3","Full Rows",9000,{p:.5,fresh:.08,lv:34,g:"Plots",also:"g_x2"},"Every row in use, right up to the path."],
 /* water */
 ["g_can","Hose & Watering Can",300,{p:.1,lv:14,g:"Water"},"Beats carrying a bucket."],
 ["g_spr","Sprinklers",1500,{p:.25,lv:16,g:"Water"},"Waters itself. You can watch it work."],
 ["g_barrel","Rain Barrels",1100,{p:.1,shelf:15,lv:19,g:"Water"},"Free water, and room to keep more stock."],
 ["g_drip","Drip Irrigation",5000,{p:.3,lv:26,g:"Water",also:"g_x1"},"Every root gets exactly enough."],
 ["g_pump","Solar Water Pump",12000,{p:.4,lv:38,g:"Water",also:"g_x2"},"Runs all day on sunlight."],
 /* tools */
 ["g_scare","Scarecrow",300,{p:.05,lv:14,g:"Tools"},"Keeps the crows honest."],
 ["g_bench","Potting Bench",700,{p:.1,lv:15,g:"Tools"},"Seedlings start here."],
 ["g_wheel","Wheelbarrow",900,{p:.08,lv:17,g:"Tools"},"Soil goes in, harvest comes out."],
 ["g_comp","Compost Bins",1600,{p:.15,fresh:.03,lv:18,g:"Tools"},"Kitchen scraps feed next month's dinner."],
 ["g_gard","Hire a Gardener",2500,{p:.3,fresh:.04,lv:20,g:"Tools"},"Someone to look after it all, so you never have to."],
 ["g_stand","Farm Stand",2500,{p:.2,cap:2,lv:21,g:"Tools"},"Spare produce goes to the street and sells for more."],
 ["g_shed","Tool Shed",3500,{p:.2,lv:24,g:"Tools",also:"g_x1"},"Everything has a hook now."],
 ["g_cellar","Root Cellar",6000,{shelf:40,cap:2,lv:31,g:"Tools",also:"g_x1"},"The pantry holds much more between visits."],
 ["g_lamp","Grow Lamps",8000,{p:.35,fresh:.06,lv:30,g:"Tools",also:"g_x1"},"Purple light, fast growth."],
 ["g_gard2","Head Gardener",15000,{p:.5,fresh:.08,lv:42,g:"Tools",also:"g_x2"},"Knows every plant by name."],
 /* living things */
 ["g_bee","Beehive",4000,{p:.2,fresh:.05,lv:25,g:"Orchard",also:"g_x1",dish:"Honey Toast"},"Bees speed up every plot."],
 ["g_orch","Apple Trees",6000,{p:.2,fresh:.07,lv:28,g:"Orchard",also:"g_x1",dish:"Apple Pie"},"Two young trees, then pie."],
 ["g_coop","Chicken Coop",7000,{p:.2,fresh:.07,lv:30,g:"Orchard",also:"g_x1",dish:"Farm Omelette"},"Fresh eggs every morning."],
 ["g_grape","Grape Trellis",9000,{p:.25,fresh:.08,lv:33,g:"Orchard",also:"g_x1",dish:"House Wine"},"A long green wall that ends in a bottle."],
 ["g_mush","Mushroom Logs",8000,{p:.15,fresh:.08,lv:36,g:"Orchard",also:"g_x2",dish:"Mushroom Risotto"},"Damp, shady and very profitable."],
 /* the grounds */
 ["g_x1","Clear the Back Lot",4000,{p:.3,fresh:.05,cap:2,lv:20,g:"Expansion",splash:"The garden doubled. There is room now for trees, a shed and a greenhouse."},"A much bigger garden."],
 ["g_x2","Buy the Empty Lot",15000,{p:.5,fresh:.08,cap:2,lv:32,g:"Expansion",splash:"The whole block is green now. Next up: a glass conservatory and proper grounds."},"The whole block goes green."],
 ["g_green1","Small Greenhouse",10000,{p:.4,fresh:.1,lv:29,g:"Expansion",also:"g_x1",dish:"Winter Greens",splash:"Crops under glass grow all year. The Restaurant earns more from it right away."},"Grows through every season."],
 ["g_green2","Glass Conservatory",40000,{p:.9,fresh:.25,lv:55,g:"Expansion",also:"g_x2",dish:"Chef's Garden Plate",splash:"The finest building on the block, and the best produce in the city."},"A grand glass hall of rare plants."],
 ["g_walk","Stone Walkway",5000,{p:.1,lv:28,g:"Grounds",also:"g_x1",splash:"People from the neighborhood now wander through your garden."},"A winding path. Visitors start strolling through."],
 ["g_bench2","Garden Benches",3000,{p:.08,lv:29,g:"Grounds"},"Somewhere to sit and look at it all."],
 ["g_lant","Lantern Posts",6000,{p:.1,lv:34,g:"Grounds"},"The path glows after dark."],
 ["g_arch","Rose Archway",8000,{p:.15,lv:32,g:"Grounds"},"Climbing roses over the path."],
 ["g_sun","Sundial",2000,{p:.06,lv:30,g:"Grounds"},"Tells the time, slowly."],
 ["g_birdb","Bird Bath",2000,{p:.06,lv:31,g:"Grounds"},"Small visitors."],
 ["g_topi","Clipped Topiary",2000,{p:.06,lv:33,g:"Grounds"},"Round, tidy and a little smug."],
 ["g_gate","Iron Garden Gate",12000,{p:.15,lv:38,g:"Grounds",also:"g_x2"},"Black iron and a little ceremony."],
 ["g_koi","Koi Pond",14000,{p:.2,lv:40,g:"Grounds",also:"g_x2"},"The plants seem calmer."],
 ["g_fount","Stone Fountain",18000,{p:.3,lv:44,g:"Grounds",also:"g_x2",splash:"The grounds now center on a stone plaza and a working fountain. A new path leads up to it, and visitors stop to admire it."},"Reshapes the grounds around a stone plaza and running water."]
];
GD_UPS.sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});
ADDONS.garden=GD_UPS;
Object.assign(ADDREQ,{g_x2:"g_x1",g_green2:"g_green1",g_spr:"g_can",g_drip:"g_spr",g_pump:"g_drip",g_p2:"g_p1",g_p3:"g_p2",g_gard2:"g_gard",g_bench2:"g_walk",g_lant:"g_walk",g_arch:"g_walk",g_gate:"g_arch",g_fount:"g_walk",g_koi:"g_walk",g_sun:"g_walk",g_birdb:"g_walk",g_topi:"g_walk"});
Object.assign(window.RSSUP,{g_green1:["g_green2"],g_gard:["g_gard2"]});
Object.assign(window.RSTCH,{g_x2:1,g_green2:1,g_drip:1,g_pump:1,g_p3:1,g_gard2:1,g_bench2:1,g_lant:1,g_arch:1,g_gate:1,g_fount:1,g_koi:1,g_sun:1,g_birdb:1,g_topi:1});

var GDSIZE=[[12,10],[18,13],[24,16]],GDNAME=["Back Plot","Kitchen Garden","Garden Estate"];
function gdRoom(){var B=S&&S.base;return B&&B.slots?B.slots.filter(function(r){return r&&r.t==="garden"})[0]:null}
function gdStage(a){return a&&a.g_x2?2:a&&a.g_x1?1:0}
var gdDimBase=lfDimOf;
/* the Estate's painted lot (gdw_s2) has lower walls than the rest, so its walls are cut at its stone coping */
lfDimOf=function(t){if(t!=="garden")return gdDimBase(t);var r=gdRoom(),g=gdStage(r&&r.a);LFWH.garden=g===2&&window.LFSPR&&LFSPR.gdw_s2?119:136;return GDSIZE[g]};
LFRS.garden=.86;
delete SVC.garden;
function gdUps(){var r=gdRoom();return r?addonsOf(r):[]}
foodCap=function(){return 30+gdUps().reduce(function(s,a){return s+(a[3].shelf||0)},0)};
/* what the Restaurant gets out of the garden */
function gdFresh(){var r=gdRoom();if(!r)return 0;return .15+gdUps().reduce(function(s,a){return s+(a[3].fresh||0)},0)}
function gdDishes(){return gdUps().filter(function(a){return a[3].dish}).map(function(a){return a[3].dish})}
function gdUse(r){return 2+2*rsStage(r.a)}
/* takes this slice of time's ingredients out of the pantry, returns the income bonus they earned */
function gdCook(r,om,h){if(!gdRoom())return 0;var need=gdUse(r)*om*h,F=S.base.food;if(need<=0)return 0;var used=Math.min(F.veg||0,need);F.veg=(F.veg||0)-used;return gdFresh()*(used/need)}
function gdRate(){var i=S.base.slots.indexOf(gdRoom());return i<0?0:ROOMT.garden.rate*roomMult(i)*openMult()}
function gdPantry(){return Math.floor(S.base.food.veg||0)}
function gdNote(r){var a=r.a||{},st=gdStage(a),nx=st===0?"g_x1":st===1?"g_x2":a.g_green2?null:"g_green2",N=nx&&GD_UPS.filter(function(u){return u[0]===nx})[0],rs=rsRoom(),d=gdDishes();
  return '<p class="note"><b>'+GDNAME[st]+'.</b> Growing '+gdRate().toFixed(1)+' ingredients an hour. Pantry '+gdPantry()+'/'+foodCap()+'. '+(rs?'The Restaurant uses '+gdUse(rs)+' an hour and earns +'+Math.round(gdFresh()*100)+'% while it has stock.':'Build the Restaurant to put these to use.')+(N?' Next big step: '+esc(N[1])+'.':'')+'</p>'+(d.length?'<p class="note">On the Restaurant menu because of you: '+esc(d.join(", "))+'.</p>':'')}
/* the garden draws plain ground: fence, beds and things in rows */
function gdS(C,k,x,y,w,d,h,o){return lfSpr(C,k,x,y,w,d,Object.assign({h:h,ctr:1},o||{}))}
/* Cal: the beds sat at a steeper angle than the room. Each bed's top face (t back, r right, l left corner, as fractions of
   the MIRRORED art, and rim, its side height) is mapped exactly onto its footprint, so every bed lines up with the walls. */
var GDFIT={gdx_seed:{t:[.33,.03],r:[.99,.66],l:[.01,.37],rim:.03},gdx_raised:{t:[.31,.12],r:[.995,.585],l:[.005,.305],rim:.21},
  gdx_tomato:{t:[.31,.27],r:[.995,.65],l:[.005,.44],rim:.17},gdx_herb:{t:[.31,.2],r:[.995,.616],l:[.005,.387],rim:.186}/* Cal: "the same type of plot as the others": the tomato bed's box, planted with herbs (its box geometry, offset for the shorter plants) */,
  gd_bed1:{t:[.33,.12],r:[.995,.55],l:[.005,.35],rim:.22},gd_bed2:{t:[.33,.03],r:[.995,.48],l:[.005,.26],rim:.26},
  gd_berry:{t:[.53,.08],r:[.995,.47],l:[.005,.33],rim:.26,w:2.2}};
/* a grow light along a bed, drawn on the room's own grid: two thin posts, an LED bar down the middle, a violet wash */
function gdGrowLight(C,x,y,w,d){var m=y+d/2,z=62,P=function(a,b,c){return lfPt(lfP(a,b,c))},x0=x+.25,x1=x+w-.25,
    s='<polygon points="'+[lfP(x0,y+.2,18),lfP(x1,y+.2,18),lfP(x1,y+d-.2,18),lfP(x0,y+d-.2,18)].map(lfPt).join(" ")+'" fill="rgba(214,138,255,.16)"/>'
    +'<polygon points="'+[lfP(x0,m,z-2),lfP(x1,m,z-2),lfP(x1,y+d-.2,18),lfP(x0,y+d-.2,18)].map(lfPt).join(" ")+'" fill="rgba(214,138,255,.12)"/>';
  [x0,x1].forEach(function(px){s+='<path d="M'+P(px,m,0)+' L'+P(px,m,z)+'" stroke="#26232e" stroke-width="2.2"/>'});
  s+='<path d="M'+P(x0-.1,m,z)+' L'+P(x1+.1,m,z)+'" stroke="#26232e" stroke-width="4.2" stroke-linecap="round"/><path d="M'+P(x0,m,z-2.4)+' L'+P(x1,m,z-2.4)+'" stroke="#f4b8ff" stroke-width="1.8" stroke-linecap="round"/>';
  C.add(x+w+y+d-.05,'<g pointer-events="none">'+s+'</g>')}
function gdFit(C,k,x,y,w,d,dk){var S=window.LFSPR&&LFSPR[k],F=GDFIT[k];if(!S||!F)return gdS(C,k,x,y,w,d,16,{flip:1});
  if(F.w){x+=(w-F.w)/2;w=F.w}
  var T=[F.t[0]*S.w,F.t[1]*S.h],u1=F.r[0]*S.w-T[0],v1=F.r[1]*S.h-T[1],u2=F.l[0]*S.w-T[0],v2=F.l[1]*S.h-T[1],det=u1*v2-u2*v1,
    p=lfP(x,y,0),q=lfP(x+w,y,0),r=lfP(x,y+d,0),X1=q[0]-p[0],Y1=q[1]-p[1],X2=r[0]-p[0],Y2=r[1]-p[1],
    a=(X1*v2-X2*v1)/det,c=(X2*u1-X1*u2)/det,b=(Y1*v2-Y2*v1)/det,dd=(Y2*u1-Y1*u2)/det,z=dd*F.rim*S.h,
    e=p[0]-a*T[0]-c*T[1],f=p[1]-z-b*T[0]-dd*T[1];
  /* Cal: "this one's legs look weirdly warped". An exact fit of the top face shears the picture, so posts and legs lean.
     Upright: no shear (c=0), the width from the left-to-right span, the heights fitted exactly, centred on the corners. */
  a=(X1-X2)/(u1-u2);c=0;e=(p[0]+(q[0]-a*u1)+(r[0]-a*u2))/3-a*T[0];
  /* the fractions are for the mirrored art: fold the mirror (x -> width - x) into the matrix */
  var M=[-a,-b,c,dd,e+a*S.w,f+b*S.w];
  if(LFREC)lfRecBox(x,y,0,w,d,z);
  C.add(x+w+y+d-.01,'<polygon points="'+[lfP(x,y,0),lfP(x+w,y,0),lfP(x+w,y+d,0),lfP(x,y+d,0)].map(lfPt).join(" ")+'" fill="rgba(10,8,24,.18)"/>');
  /* dry beds look parched, watered beds damp (LEAD's gdWatered, 29i_garden.js). Cal: "separate art for when it looks like
     the garden needs watering": a painted dry twin (<bed>_dry: cracked soil, wilted plants) while dry, the colour shift
     only if that painting is missing. Right after Water (gdWaterAnim), the dry twin fades off the damp bed. */
  var wet=typeof gdWatered!=="function"||gdWatered(),DK=window.LFSPR&&LFSPR[k+"_dry"],el=Date.now()-(window.GDWAT||0),anim=wet&&el<2600,
    fl=wet?'saturate(1.12) brightness(.96)':DK?'saturate(.95)':'saturate(.45) sepia(.35) brightness(1.1)',
    mt=' width="'+S.w+'" height="'+S.h+'" preserveAspectRatio="none" transform="matrix('+M.map(function(n){return n.toFixed(4)}).join(" ")+')"',
    img='<image style="filter:'+fl+'" href="'+lfSprUrl(!wet&&DK?k+"_dry":k)+'"'+mt+'/>';
  if(anim)img+='<image class="gddryfade" style="animation-delay:'+(500-el)+'ms;'+(DK?'':'filter:saturate(.45) sepia(.35) brightness(1.1)')+'" href="'+lfSprUrl(DK?k+"_dry":k)+'"'+mt+'/>'+gdCan(x,y,w,d,z,el);
  C._lb=[x,y,x+w,y+d];C.add(x+w+y+d-(dk||0),img);
  return z}
/* the watering animation over one bed: a can tips in, pours a few seconds of drops onto the soil, and lifts away */
function gdCan(x,y,w,d,z,el){var c=lfP(x+w*.5,y+d*.5,0),X=c[0],Y=c[1]-z,D=function(n){return 'animation-delay:'+(n-el)+'ms'},
    can='<g class="gdcan" style="'+D(0)+'"><g transform="translate('+(X+8).toFixed(1)+','+(Y-52).toFixed(1)+') scale(1.5)">'
      +'<path d="M-9 -2 L9 -2 L7 14 L-7 14 Z" fill="#7fa7b8" stroke="#2f3d44" stroke-width="1.2"/><path d="M-9 -2 Q0 -6 9 -2" fill="#9cc3d2" stroke="#2f3d44" stroke-width="1"/>'
      +'<path d="M-6 -3 Q0 -14 6 -3" fill="none" stroke="#2f3d44" stroke-width="1.8"/><path d="M-8 6 L-22 -4" stroke="#2f3d44" stroke-width="3.2" stroke-linecap="round"/><path d="M-8 6 L-22 -4" stroke="#7fa7b8" stroke-width="1.6" stroke-linecap="round"/>'
      +'<ellipse cx="-23" cy="-5" rx="3" ry="2" fill="#5f7d89" stroke="#2f3d44" stroke-width=".8"/></g></g>',
    drops='';
  for(var i=0;i<12;i++){var dx=X-34+(i%4)*5+(i*7%5),dy=Y-36+(i%3)*3;drops+='<ellipse class="gddrop" style="'+D(900+i*55)+'" cx="'+dx.toFixed(1)+'" cy="'+dy.toFixed(1)+'" rx="1.6" ry="3" fill="#bfe6ff" stroke="#6aa6c8" stroke-width=".4"/>'}
  return '<g pointer-events="none">'+can+'<g class="gdpour" style="'+D(0)+'">'+drops+'<ellipse cx="'+(X-22).toFixed(1)+'" cy="'+(Y+4).toFixed(1)+'" rx="20" ry="6" fill="rgba(60,40,20,.3)"/></g></g>'}
/* water from anywhere (the lot's can, the Garden window's button): remember when, before LEAD's handler re-renders */
if(!window.__gdWatAnim){window.__gdWatAnim=1;document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-act=gdwater]"))window.GDWAT=Date.now()},true);
  var gst=document.createElement("style");gst.textContent='.gddryfade{animation:gdfade 1.6s ease-in forwards}@keyframes gdfade{to{opacity:0}}'
    +'.gdcan{opacity:0;transform-box:fill-box;transform-origin:70% 80%;animation:gdcan 2.5s ease-in-out forwards}'
    +'@keyframes gdcan{0%{opacity:0;transform:translateY(-12px) rotate(0)}12%{opacity:1;transform:translateY(0) rotate(0)}28%{opacity:1;transform:rotate(-34deg)}82%{opacity:1;transform:rotate(-34deg)}100%{opacity:0;transform:translateY(-10px) rotate(-6deg)}}'
    +'.gdpour{opacity:0;animation:gdpour 2.5s linear forwards}@keyframes gdpour{0%,26%{opacity:0}34%,80%{opacity:1}100%{opacity:0}}'
    +'.gddrop{opacity:0;transform-box:fill-box;animation:gddrop .5s linear infinite}@keyframes gddrop{0%{opacity:0;transform:translateY(0)}20%{opacity:.95}100%{opacity:0;transform:translateY(36px)}}';
  (document.head||document.documentElement).appendChild(gst)}
/* QA audit: the sprinkler was a 3 px post. A brass head on a dark riser, with a wide fan of spray and drops, so it reads on a phone */
function gdMist(C,x,y){var q=lfP(x,y,0),X=q[0],Y=q[1],t=Y-14,sp='',dr='';
  [-1,1].forEach(function(s){sp+='<path d="M'+X+' '+t+' q'+(s*16)+' -20 '+(s*30)+' -2" stroke="rgba(190,230,255,.85)" stroke-width="1.6" fill="none"/><path d="M'+X+' '+t+' q'+(s*10)+' -26 '+(s*20)+' -10" stroke="rgba(190,230,255,.6)" stroke-width="1.2" fill="none"/>';
    for(var k=0;k<4;k++)dr+='<circle cx="'+(X+s*(8+k*6))+'" cy="'+(t-8+k*2.5)+'" r="1.2" fill="#cfeaff" opacity=".85"/>'});
  C.add(x+y+.2,'<g class="lfmist"><path d="M'+(X-28)+' '+(t+2)+' Q'+X+' '+(t-30)+' '+(X+28)+' '+(t+2)+' Z" fill="rgba(180,225,255,.16)"/>'+sp+dr+'</g><rect x="'+(X-1.8)+'" y="'+(t)+'" width="3.6" height="14" fill="#3a3f48"/><rect x="'+(X-3)+'" y="'+(t-3)+'" width="6" height="4" rx="1.2" fill="#c9a24a" stroke="#6d5420" stroke-width=".5"/>')}
LFROOM.garden=function(C){
  rsArtReady();
  var H=function(k){return C.has(k)},st=H("g_x2")?2:H("g_x1")?1:0,W=C.W,D=C.D,BX=[1.2,6.2,11.2],BY=[1.4,4.6,7.8,11];
  C.out=1;
  C.s("door",W-.5,D-.5,1,"look",[1,1]);C.door={x:W-.5,y:D-.5};
  /* the painted lot for this stage (gdw_s0..2): ground through the shell key; an outdoor room draws no walls, so the
     painted brick walls are put in here. Without the painting, the fence sprites as before. */
  var gk="gdw_s"+st;
  /* Knock Through to a Restaurant: a lit doorway in the back-left wall into the Restaurant's kitchen */
  var kt=typeof hasRoom==="function"&&hasRoom("restaurant");
  /* its own id for clip paths: one shared with a hidden view would clip the walls and the doorway away */
  if(C.chu==null)C.chu="gd"+(window.LFGDU=(window.LFGDU||0)+1);
  if(window.LFSPR&&LFSPR[gk]){C.shellK=gk;C.noOut=1;var sv=LFSHELLK;LFSHELLK=gk;try{C.walls.push(lfShellPart(C.chu,"walls"))}finally{LFSHELLK=sv}}
  else{for(var fx=.2;fx<W-.4;fx+=1.7)lfSpr(C,"w_gfence",fx,.08,1.6,.1,{flip:1,h:1,H:50,ctr:1,nosh:1,dk:99});
    for(var fy=.2;fy<D-.4;fy+=1.7)lfSpr(C,"w_gfence",.05,fy,.1,1.6,{h:1,H:50,ctr:1,nosh:1,dk:99})}
  if(kt)lfDoorL(C,1.15,2.65,96,"#ffd27a",!!(window.LFSPR&&LFSPR[gk]));
  /* beds, with a walkable lane all round each one */
  var cols=[2,2,3][st],rows=[3,3,4][st],spots=[];
  for(var ry=0;ry<rows;ry++)for(var cx=0;cx<cols;cx++){if(!(st===2&&H("g_koi")&&cx===2&&ry===3))spots.push([BX[cx],BY[ry]])}
  /* QA audit: More Plots added nothing because crops each took a new bed and the Kitchen Garden's six spots were full.
     Plot upgrades add beds; crop upgrades plant into a seed or plain bed, and only add a bed when none is free. */
  var beds=["gdx_seed","gdx_seed"];
  if(H("g_p1"))beds.push("gdx_raised");if(H("g_p2"))beds.push("gd_bed1","gdx_raised");if(H("g_p3"))beds.push("gd_bed1","gdx_raised","gd_bed1");
  [["g_let","gd_bed2"],["g_tom","gdx_tomato"],["g_herb","gdx_herb"],["g_berry","gd_berry"]].forEach(function(c){if(!H(c[0]))return;
    var j=beds.indexOf("gdx_seed");if(j<0)j=beds.indexOf("gd_bed1");if(j>=0)beds[j]=c[1];else beds.push(c[1])});
  beds=beds.slice(0,spots.length);
  beds.forEach(function(k,i){var p=spots[i];gdFit(C,k,p[0],p[1],3.4,1.6);C.s("work",p[0]+1.7,p[1]+2.2,i%2?-1:1,i%3?"water":"reach",[6,12],{tag:"tend"})});
  if(H("g_spr"))beds.forEach(function(k,i){var p=spots[i];gdMist(C,p[0]+3.7,p[1]+.8)});/* QA re-audit: one per bed, not every other */
  /* QA audit: a hairline before. A black drip hose along each bed's front with water beads, so it can be seen */
  if(H("g_drip"))beds.forEach(function(k,i){var p=spots[i];C.decals.push(lfPoly([lfP(p[0]-.1,p[1]+1.66,0),lfP(p[0]+3.5,p[1]+1.66,0),lfP(p[0]+3.5,p[1]+1.82,0),lfP(p[0]-.1,p[1]+1.82,0)],"#16191f"));
    for(var b=0;b<6;b++){var d=lfP(p[0]+.25+b*.6,p[1]+1.9,0);C.decals.push('<ellipse cx="'+d[0].toFixed(1)+'" cy="'+d[1].toFixed(1)+'" rx="2.4" ry="1.2" fill="#7fc3ff" opacity=".75"/>')}});
  /* tools down the far side */
  /* The Estate (stage 2) is laid out on a measured plan: the tools column steps out from the orchard, and every piece
     on the right keeps at least .3 of a tile to its neighbour and .5 to anything you walk past. */
  var E=st===2,Rx=E?W-1.75:W-2.0,TY=E?[.6,2.0,3.4,4.9,6.1]:st===0?[.6,2.2,3.75,5.4,5.4]:[.7,2.3,3.9,5.5,7.0]/* rule 20: on the Back Plot the barrel and bench sat into the stand */,tool=function(id,k,y,w,d,h,o){if(H(id))gdS(C,k,Rx,y,w,d,h,o)};
  tool("g_can","gdx_can",TY[0],1.2,1.0,14,{act:"gdwater",hit:110});
  /* the watering can in the back corner waters the beds when tapped (LEAD's gdwater); the Hose & Watering Can takes over */
  if(!H("g_can"))gdS(C,"gdx_can",.3,.3,.8,.7,12,{act:"gdwater",hit:110});/* QA (Cal's use check): the compost crate stood in front of the potting bench's work side; the bench ends the column now, open
     in front, and the low wheelbarrow takes its old place */
  tool("g_wheel","gdx_wheel",TY[1],1.4,1.0,16);tool("g_comp","gdx_comp",TY[2],st===0?1.0:1.2,st===0?.95:1.1,24);if(st===0){if(H("g_barrel"))gdS(C,"gdx_barrel",.05,3.75,.75,.75,28,{H:56})/* rule 20: the Back Plot's tool column has no room for it; under the wall tap instead */}else tool("g_barrel","gdx_barrel",TY[3],.9,.9,28,{H:64});tool("g_bench","gdx_bench",TY[4],1.4,1.0,26);
  /* the Back Plot's gate corner is the produce stand's */
  if(H("g_scare"))gdS(C,"gd_scare",st===1?5.05:.3,st===0?8.3:st===1?3.45:6.0,/* rule 20: in the Kitchen Garden the hanging pots painted on the left wall run its whole front, so there it guards the crossing between the four back beds */.7,.7,50,{H:100});/* by the left wall, clear of every bed (QA) */
  /* where produce is sold (the story's selling, from the first day): a homemade crate stand until the Farm Stand
     replaces it, at every stage (the Farm Stand used to show only from the Kitchen Garden on) */
  /* in the Estate the stand sorts just after the wide bed behind it and just before the lantern in front of it */
  /* on the Back Plot the stand takes the wheelbarrow's place, a tile further in, so a wide screen shows it whole (QA) */
  var sp=st===0?[10.1,8.3]:/* rule 20: the tool column closes up (the barrel lives under the wall tap) and the stand ends it, on open floor; front-left it stood behind the front bed (QA v0.74) */st===2?[.4,12.9]:[14.0,4.8],sdk=st===2?-1.12:0;
  /* tap either stand to sell (LEAD's stysell, 29b_story.js) */
  if(H("g_stand"))gdS(C,"gdx_stand",sp[0],sp[1],1.8,1.0,34,{H:86,dk:sdk,act:"stysell"});else if(window.LFSPR&&LFSPR.gdx_stand0)gdS(C,"gdx_stand0",sp[0],sp[1],1.6,.9,24,{dk:sdk,act:"stysell"});
  if(st===0)lfWander(C,[[10.8,8.0,1],[5.7,3.8,-1],[5.7,7.0,1]]);
  if(st>0){var zx=st===2?16.4:11.2;
    if(H("g_green2")&&st===2){gdS(C,"gdx_conserv",zx-.2,.7,5.2,3.6,80,{H:184,dk:1});lfLight(C,zx+2.4,2.4,70,"#c8f0ff",3,.35)}
    else if(H("g_green1")){gdS(C,"gdx_ghouse",zx,.8,3.6,2.8,70,{H:132});lfLight(C,zx+1.8,2.2,50,"#c8f0ff",2.4,.3)}
    if(H("g_orch")){gdS(C,"gdx_tree",E?zx-.2:zx+.2,4.8,1.1,1.1,70,{H:112});gdS(C,"gdx_tree",E?zx+1.8:zx+1.5,4.8,1.1,1.1,70,{H:120})}
    if(H("g_grape"))gdS(C,"gdx_grape",E?zx-.2:zx,E?6.8:6.6,3.6,1.0,50,{H:96});
    var hx=st===2?Rx:zx,hy=st===2?10.6:8.6;
    if(st===1){hx=.4;hy=9.9}/* the Kitchen Garden spreads its front out: hive and coop on the strip left of the beds' fronts, shed and pump on the right (QA: they piled up) */
    if(H("g_bee")){gdS(C,"gdx_hive",hx,hy,1.2,.9,24,{H:56});var bp=lfP(hx+.6,hy+.4,40);for(var b=0;b<4;b++)C.front.push('<circle class="lfbee" style="animation-delay:'+(b*.6)+'s" cx="'+bp[0]+'" cy="'+bp[1]+'" r="1.6" fill="#2a2a2a"/>')}
    if(H("g_coop"))gdS(C,"gdx_coop",st===2?Rx:3.0,/* rule 20: off the hive, a lantern between them */st===2?12.2:9.65,1.7,1.3,36,{H:78});
    if(H("g_shed"))gdS(C,"gdx_shed",st===2?zx+3.7:Rx,st===2?4.8:8.4,1.6,1.3,50,{H:92});
    if(H("g_mush"))gdS(C,"gdx_logs",st===2?zx+4.0:zx,st===2?6.9:9.9,1.4,.8,16,{H:48});
    if(H("g_pump"))gdS(C,"gdx_pump",E?Rx+.1:14.3,E?7.8:8.6,.9,.8,40,{H:70});
    /* grow lamps stand at the back of the first beds, over the soil (QA: alone on the lawn they read as screens) */
    if(H("g_lamp"))beds.slice(0,4).forEach(function(k,i){var p=spots[i];
      gdGrowLight(C,p[0],p[1],3.4,1.6);
      lfLight(C,p[0]+1.7,p[1]+.8,60,"#d68aff",2.6,.5)});
    if(H("g_walk")){var py=D-1.9,R=lfSeed(11),stones=function(x0,x1,y0,y1){var pl='';for(var sx=x0;sx<x1-.1;sx+=.62)for(var sy=y0;sy<y1-.1;sy+=.62){var c=["#b9b0a2","#a79f92","#c4bcae","#ad9e8c"][Math.floor(R()*4)];pl+=lfPoly([lfP(sx+.03,sy+.03,0),lfP(sx+.58,sy+.03,0),lfP(sx+.58,sy+.58,0),lfP(sx+.03,sy+.58,0)],c,"rgba(50,40,30,.45)",.7)}return pl};
      C.decals.push(stones(.4,W-.2,py,py+1.25));
      lfWander(C,[[W*.25,py+.6,1],[W*.55,py+.6,-1],[W*.8,py+.6,1]]);
      if(H("g_fount")&&st===2){var fc=[19.4,11.2];
        var ring=[];for(var a=0;a<28;a++){var t=a/28*6.283;ring.push(lfP(fc[0]+Math.cos(t)*2.6,fc[1]+Math.sin(t)*2.6,0))}
        C.decals.push(lfPoly(ring,"#cfc7b8","rgba(60,50,40,.5)",1.2)+stones(18.7,20.1,fc[1]+2.3,py+.05));
        gdFountain(C,fc[0],fc[1]);
        [[-2.3,.6,1],[.5,-2.3,1],[2.0,-.9,-1],[-1.1,2.1,1],[1.3,2.0,-1]].forEach(function(o){C.s("look",fc[0]+o[0],fc[1]+o[1],o[2],"look",[6,12],{tag:"admire"})})}
      if(H("g_bench2"))[W*.22,W*.5].forEach(function(x){gdS(C,"gdx_seat",x,py+1.25,1.5,.45,14,{nosh:1,sh:1,nob:1})});
      if(H("g_lant"))(st===1?[.12,.38,.62,.8]:[.12,.38,.62,.86]).forEach(/* Kitchen Garden: the last one stood on the shed */function(f){var lx=W*f;if(E&&H("g_fount")&&Math.abs(lx-19.4)<3)return;/* not inside the fountain's plaza */gdS(C,"gdx_lantern",lx,py-.45,.35,.35,50,{H:88});lfLight(C,lx,py,50,"#ffcf7a",2.4,.55)});
      var open=function(k,x,y,w,d,HH){var RR=LFREC;LFREC=null;gdS(C,k,x,y,w,d,1,{H:HH,nosh:1,nob:1});LFREC=RR};
      if(H("g_arch"))open("gdx_arch",W*.7,py-.15,.9,1.55,132);
      if(H("g_gate"))open("gdx_gate",W-.6,py-.2,.5,1.6,92);/* where the walk leaves the lot */
      /* Cal: no room may look crowded. In the Estate the fountain is the centrepiece and takes the place of the sundial,
         the birdbath and the topiaries (still owned; they show again only without it) */
      var calm=E&&H("g_fount");
      if(H("g_sun")&&!calm)gdS(C,"gdx_sundial",W*.3-.3,py-.95,.6,.6,30,{H:52});/* clear of the lantern post (QA) */
      if(H("g_topi")&&!calm)[W*.7-.7,W*.7+1.2].forEach(function(x){gdS(C,"gdx_topiary",x,py-.95,.6,.6,34,{H:56})});
      if(H("g_birdb")&&!calm)gdS(C,"gdx_birdbath",E?10.3:W*.46,py-.95,.6,.6,30,{H:52});
      if(H("g_koi")&&st===2)gdS(C,"gd_koi",11.3,11,3.4,2.0,16,{dk:1});
    }
  }
};
/* water that actually moves, and it sits in a new stone plaza */
function gdFountain(C,cx,cy){gdS(C,"gdx_fount",cx-1.5,cy-1.5,3,3,26,{H:126});var t=lfP(cx,cy,92),s='',k=C.items.length?cx+1.5+cy+1.5+.02:0;
  [-1,-.55,.55,1].forEach(function(d,i){var ex=t[0]+d*36,ey=t[1]+70-Math.abs(d)*14;s+='<path class="gfw" style="animation-delay:-'+(i*.3)+'s" d="M'+t[0]+' '+(t[1]-14)+' Q'+(t[0]+d*22)+' '+(t[1]-34)+' '+ex+' '+ey+'" fill="none" stroke="rgba(190,232,255,.95)" stroke-width="2.4" stroke-linecap="round"/>'});
  s+='<path class="gfw" d="M'+t[0]+' '+t[1]+' V'+(t[1]-30)+'" stroke="rgba(225,245,255,.95)" stroke-width="3.2" stroke-linecap="round"/>';
  [0,1,2].forEach(function(i){s+='<ellipse class="gfr" style="animation-delay:-'+(i*.6)+'s" cx="'+t[0]+'" cy="'+(t[1]+68)+'" rx="30" ry="12" fill="none" stroke="rgba(235,250,255,.8)" stroke-width="1.2"/>'});
  C.add(k,'<g pointer-events="none">'+s+'</g>')}
function gdPeople(r,i,C,out){var a=r.a||{};
  if(a.g_gard)out.push({id:"gd:g1",room:i,role:"crew",look:rsNpc({body:"m",skin:"s2",hairStyle:"h2",hairColor:"brown",top:"tee",topColor:"grey",bottom:"jeans",bottomColor:"black",shoe:"boots",shoeColor:"black"}),ix:0});
  if(a.g_gard2)out.push({id:"gd:g2",room:i,role:"crew",look:rsNpc({body:"f",skin:"s3",hairStyle:"h2",hairColor:"auburn",top:"hoodie",topColor:"grey",bottom:"joggers",bottomColor:"black",shoe:"boots",shoeColor:"black"}),ix:1});
  if(a.g_walk)RSGUESTS.slice(0,3+rsStageGd(a)).forEach(function(g,j){out.push({id:"gd:v"+j,room:i,role:"crew",look:rsNpc(g),ix:2+j,wand:1,idle:1})})}
function rsStageGd(a){return gdStage(a)}
