/* ---------- the garden ----------
   Passive: it grows ingredients on its own. The Restaurant uses them and earns more while
   the pantry has stock, and crops add dishes to its menu. To add an upgrade, add a line to
   GD_UPS and, if it shows in the room, a line in LFROOM.garden. */
ROOMT.garden=Object.assign(ROOMT.garden,{lv:14,cost:3000,food:"veg",rate:3,coin:6,store:8,desc:"A small plot behind the building. It grows ingredients on its own, the Restaurant cooks with them and earns more, and spare produce sells for coins."});
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
 ["g_gate","Iron Garden Gate",12000,{p:.15,lv:38,g:"Grounds",also:"g_x2"},"Black iron and a little ceremony."],
 ["g_koi","Koi Pond",14000,{p:.2,lv:40,g:"Grounds",also:"g_x2"},"The plants seem calmer."],
 ["g_fount","Stone Fountain",18000,{p:.3,lv:44,g:"Grounds",also:"g_x2"},"The center of the whole garden."]
];
GD_UPS.sort(function(a,b){return (a[3].lv-b[3].lv)||(a[2]-b[2])});
ADDONS.garden=GD_UPS;
Object.assign(ADDREQ,{g_x2:"g_x1",g_green2:"g_green1",g_spr:"g_can",g_drip:"g_spr",g_pump:"g_drip",g_p2:"g_p1",g_p3:"g_p2",g_gard2:"g_gard",g_bench2:"g_walk",g_lant:"g_walk",g_arch:"g_walk",g_gate:"g_arch",g_fount:"g_walk",g_koi:"g_walk"});
Object.assign(window.RSSUP,{g_green1:["g_green2"],g_gard:["g_gard2"]});
Object.assign(window.RSTCH,{g_x2:1,g_green2:1,g_drip:1,g_pump:1,g_p3:1,g_gard2:1,g_bench2:1,g_lant:1,g_arch:1,g_gate:1,g_fount:1,g_koi:1});

var GDSIZE=[[10,8],[14,10],[18,12]],GDNAME=["Back Plot","Kitchen Garden","Garden Estate"];
function gdRoom(){var B=S&&S.base;return B&&B.slots?B.slots.filter(function(r){return r&&r.t==="garden"})[0]:null}
function gdStage(a){return a&&a.g_x2?2:a&&a.g_x1?1:0}
var gdDimBase=lfDimOf;
lfDimOf=function(t){if(t!=="garden")return gdDimBase(t);var r=gdRoom();return GDSIZE[gdStage(r&&r.a)]};
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
  return '<p class="note"><b>'+GDNAME[st]+'.</b> Growing '+gdRate().toFixed(1)+' ingredients an hour. Pantry '+gdPantry()+'/'+foodCap()+'. '+(rs?'The Restaurant uses '+gdUse(rs)+' an hour and earns +'+Math.round(gdFresh()*100)+'% while it has stock.':'Build the Restaurant to put these to use.')+(N?' Next big step: '+esc(N[1])+' at level '+N[3].lv+'.':'')+'</p>'+(d.length?'<p class="note">On the Restaurant menu because of you: '+esc(d.join(", "))+'.</p>':'')}
/* the garden draws plain ground: fence, beds and things in rows */
function gdS(C,k,x,y,w,d,h,o){return lfSpr(C,k,x,y,w,d,Object.assign({h:h,ctr:1},o||{}))}
function gdMist(C,x,y){var q=lfP(x,y,6);C.add(x+y+.2,'<rect x="'+(q[0]-1.5)+'" y="'+(q[1]-6)+'" width="3" height="6" fill="#aab"/><path d="M'+q[0]+' '+(q[1]-8)+' q-12 -14 -18 -4 M'+q[0]+' '+(q[1]-8)+' q12 -14 18 -4" stroke="rgba(180,225,255,.8)" stroke-width="1.4" fill="none" class="lfmist"/>')}
LFROOM.garden=function(C){
  rsArtReady();
  var H=function(k){return C.has(k)},st=H("g_x2")?2:H("g_x1")?1:0,W=C.W,D=C.D;
  C.out=1;
  C.s("door",W-.5,D-.5,1,"look",[1,1]);C.door={x:W-.5,y:D-.5};
  /* fences on the two back edges */
  for(var fx=.2;fx<W-.4;fx+=1.7)lfSpr(C,"w_gfence",fx,.08,1.6,.1,{flip:1,h:1,H:50,ctr:1,nosh:1,dk:-1});
  for(var fy=.2;fy<D-.4;fy+=1.7)lfSpr(C,"w_gfence",.05,fy,.1,1.6,{h:1,H:50,ctr:1,nosh:1,dk:-1});
  /* beds fill from the fence out, newest crops first in line */
  var cols=[[1.0,4.7],[1.0,4.7],[1.0,4.7,8.4]][st],rows=[[1.3,3.6,5.9],[1.3,3.6,5.9],[1.3,3.6,5.9,8.2]][st],spots=[];
  rows.forEach(function(y){cols.forEach(function(x){spots.push([x,y])})});
  var beds=["gdx_seed","gdx_seed"];
  if(H("g_p1"))beds.push("gdx_raised");if(H("g_let"))beds.push("gd_bed2");if(H("g_tom"))beds.push("gdx_tomato");if(H("g_herb"))beds.push("gdx_herb");
  if(H("g_p2")){beds.push("gd_bed1");beds.push("gdx_raised")}if(H("g_berry"))beds.push("gd_berry");if(H("g_p3")){beds.push("gd_bed2");beds.push("gdx_tomato");beds.push("gd_bed1")}
  beds.slice(0,spots.length).forEach(function(k,i){var p=spots[i];gdS(C,k,p[0],p[1],3.1,1.5,18,{dk:.5})});
  C.s("work",2.6,3.05,1,"water",[6,12],{tag:"water"});C.s("work",6.3,3.05,-1,"water",[6,12],{tag:"water"});C.s("work",2.6,5.35,1,"reach",[6,12],{tag:"weed"});
  if(H("g_spr")){var sn=Math.min(spots.length,beds.length);for(var si=0;si<sn;si+=2){var sp=spots[si];gdMist(C,sp[0]+3.3,sp[1]+.7)}}
  if(H("g_drip"))spots.slice(0,beds.length).forEach(function(p){C.decals.push(lfPoly([lfP(p[0]-.1,p[1]+1.55,0),lfP(p[0]+3.2,p[1]+1.55,0),lfP(p[0]+3.2,p[1]+1.62,0),lfP(p[0]-.1,p[1]+1.62,0)],"#27303a"))});
  /* the tool line down the far side */
  var Rx=W-1.8;
  if(H("g_can"))gdS(C,"gdx_can",Rx,.5,1.1,.9,16);
  if(H("g_bench"))gdS(C,"gdx_bench",Rx,1.5,1.3,.9,26);
  if(H("g_comp"))gdS(C,"gdx_comp",Rx,2.8,1.1,1.0,24);
  if(H("g_barrel"))gdS(C,"gdx_barrel",Rx+.1,4.0,.9,.9,28);
  if(H("g_wheel"))gdS(C,"gdx_wheel",Rx-.1,5.1,1.3,.9,16);
  if(H("g_stand"))gdS(C,"gdx_stand",Rx-.3,6.2,1.7,1.0,28);
  if(H("g_scare"))gdS(C,"gd_scare",st===0?8.4:Rx,st===0?.4:D-3.2,.7,.7,50,{H:100});
  /* the open ground between the beds and the tools */
  if(st>0){var zx=st===2?12.2:8.4;
    if(H("g_green2")){gdS(C,"gdx_conserv",zx-.1,.3,3.9,3.2,90,{H:150});lfLight(C,zx+1.9,1.9,70,"#c8f0ff",3,.35)}
    else if(H("g_green1")){gdS(C,"gdx_ghouse",zx,.4,3.0,2.4,70,{H:112});lfLight(C,zx+1.5,1.6,50,"#c8f0ff",2.4,.3)}
    if(H("g_shed"))gdS(C,"gdx_shed",st===2?Rx-2.2:zx+.1,st===2?.3:2.9,1.9,1.5,60,{H:86});
    if(H("g_orch")){gdS(C,"gdx_tree",zx+.1,3.5,1.2,1.2,70,{H:106});gdS(C,"gdx_tree",zx+2.0,3.5,1.2,1.2,70,{H:112})}
    if(H("g_grape"))gdS(C,"gdx_grape",zx,5.0,3.1,.8,50,{H:84});
    if(H("g_bee")){gdS(C,"gdx_hive",zx+.1,6.1,1.2,.9,30,{H:60});var bp=lfP(zx+.7,6.5,44);for(var b=0;b<4;b++)C.front.push('<circle class="lfbee" style="animation-delay:'+(b*.6)+'s" cx="'+bp[0]+'" cy="'+bp[1]+'" r="1.6" fill="#2a2a2a"/>')}
    if(H("g_coop"))gdS(C,"gdx_coop",zx+1.7,6.0,1.7,1.2,40,{H:74});
    if(H("g_mush"))gdS(C,"gdx_logs",zx+.1,7.2,1.3,.8,20,{H:46});
    if(H("g_lamp"))[[3.4,.15],[7.1,.15]].forEach(function(p){gdS(C,"gd_lamp",p[0]+.6,p[1],.7,.7,40,{H:84,dk:-1});lfLight(C,p[0]+.9,p[1]+.6,60,"#d68aff",2.8,.6)});
    if(H("g_fount")){gdS(C,"gdx_fount",zx+.5,st===2?7.4:6.0,2.2,2.2,30,{H:92});lfLight(C,zx+1.6,8.5,30,"#9ad8ff",1.8,.2)}
    if(H("g_koi"))gdS(C,"gd_koi",zx+1.3,st===2?9.0:7.8,2.2,1.2,18,{dk:1});
    if(H("g_pump"))gdS(C,"gdx_pump",Rx-.1,D-4.3,1.2,1.0,34,{H:66})
    /* the walkway along the front */
    if(H("g_walk")){var py=D-1.75,pl='',R=lfSeed(11);for(var sx=.5;sx<W-.2;sx+=.62){var a0=sx,a1=sx+.54,w1=py+R()*.2,w2=py+1.2-R()*.2;
        pl+=lfPoly([lfP(a0,w1,0),lfP(a1,w1,0),lfP(a1,w2,0),lfP(a0,w2,0)],["#b9b0a2","#a79f92","#c4bcae","#ad9e8c"][Math.floor(R()*4)],"rgba(50,40,30,.45)",.8)}
      C.decals.push(pl);
      lfWander(C,[[W*.25,py+.6,1],[W*.55,py+.6,-1],[W*.8,py+.6,1]]);
      C.s("smell",3.0,py-.4,-1,"smell",[5,9],{tag:"smell"});C.s("smell",7.0,py-.4,1,"smell",[5,9],{tag:"smell"});
      if(H("g_bench2"))[W*.3,W*.62].forEach(function(x){gdS(C,"gdx_seat",x,py+1.3,1.5,.5,18,{nosh:1,dk:-.5})});
      if(H("g_lant"))[.25,.5,.75].forEach(function(f){var lx=W*f;gdS(C,"gdx_lantern",lx,py-.5,.4,.4,60,{H:82,dk:-1});lfLight(C,lx,py,50,"#ffcf7a",2.2,.5)});
      if(H("g_arch"))gdS(C,"gdx_arch",W*.68,py-.2,1.0,1.6,80,{H:128,nosh:1,dk:-2});
      if(H("g_gate"))gdS(C,"gdx_gate",W-1.1,py-.2,.5,1.6,50,{H:80,nosh:1,dk:-2})}
  }
  if(st===0)lfWander(C,[[8.3,2.0,1]]);
};
function gdPeople(r,i,C,out){var a=r.a||{};
  if(a.g_gard)out.push({id:"gd:g1",room:i,role:"crew",look:rsNpc({body:"m",skin:"s2",hairStyle:"h2",hairColor:"brown",top:"tee",topColor:"grey",bottom:"jeans",bottomColor:"black",shoe:"boots",shoeColor:"black"}),ix:0});
  if(a.g_gard2)out.push({id:"gd:g2",room:i,role:"crew",look:rsNpc({body:"f",skin:"s3",hairStyle:"h2",hairColor:"auburn",top:"hoodie",topColor:"grey",bottom:"joggers",bottomColor:"black",shoe:"boots",shoeColor:"black"}),ix:1});
  if(a.g_walk)RSGUESTS.slice(0,3+rsStageGd(a)).forEach(function(g,j){out.push({id:"gd:v"+j,room:i,role:"crew",look:rsNpc(g),ix:2+j,wand:1,idle:1})})}
function rsStageGd(a){return gdStage(a)}
