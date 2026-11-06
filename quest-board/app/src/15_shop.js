/* ---------- the shop ----------
   A boutique with its own light look, separate from the dark game screens. Items show
   as cut-outs on their own. Adding an item takes one line in EXTRA_ITEMS (or GITEMS) plus
   an entry in data/items.json. */
var EXTRA_ITEMS=[
 ["gx_h_chain","a_acc","Silver Curb Chain",750,1,"Chunky silver links.",{gar:"h_chain",b:"hanga"}],
 ["gx_h_coach","a_top","Nylon Coach Jacket",1300,1,"Black, boxy, snapped shut.",{gar:"h_coach",b:"hanga",mo:1}],
 ["gx_h_knit","a_top","Cropped Cable Cardigan",1200,1,"Oatmeal knit, buttoned up.",{gar:"h_knit",b:"hanga",fo:1}],
 ["gx_h_tech","a_pants","Tapered Tech Trousers",1200,1,"Charcoal, zipped thigh pockets.",{gar:"h_tech",b:"hanga",mo:1}],
 ["gx_h_pleat","a_pants","Long Pleated Skirt",1200,1,"Charcoal knife pleats to mid shin.",{gar:"h_pleat",b:"hanga",fo:1}],
 ["gx_h_derby","a_shoes","Chunky Derby Shoes",1300,1,"Black leather, thick white sole.",{gar:"h_derby",b:"hanga",mo:1}],
 ["gx_h_loafer","a_shoes","Platform Loafers",1300,1,"Glossy black, white ankle socks.",{gar:"h_loafer",b:"hanga",fo:1}],
 ["gx_y_bucket","a_hat","Denim Bucket Hat",850,1,"Faded denim, white stitching.",{gar:"y_bucket",b:"y2k"}],
 ["gx_y_choker","a_acc","Star Choker",600,1,"Black velvet, silver stars.",{gar:"y_choker",b:"y2k"}],
 ["gx_y_flame","a_top","Flame Bowling Shirt",1100,1,"Black with hot-rod flames.",{gar:"y_flame",b:"y2k",mo:1}],
 ["gx_y_skirt","a_pants","Plaid Mini Skirt",1300,1,"Pleated red and black.",{gar:"y_skirt",b:"y2k",fo:1}],
 ["gx_y_jorts","a_pants","Baggy Jorts",1100,1,"Light wash, frayed below the knee.",{gar:"y_jorts",b:"y2k",mo:1}],
 ["gx_y_skate","a_shoes","Chunky Skate Shoes",1500,1,"Black and sky blue, fat laces.",{gar:"y_skate",b:"y2k"}],
 ["gx_y_runner","a_shoes","Retro Runners",1300,1,"Silver mesh, cobalt accents.",{gar:"y_runner",b:"y2k",mo:1}],
 ["gx_o_beanie","a_hat","Fisherman Beanie",800,1,"Black rib, rolled cuff.",{gar:"o_beanie",b:"over"}],
 ["gx_o_camp","a_hat","Nylon Camp Cap",900,1,"Washed olive, orange strap.",{gar:"o_camp",b:"over"}],
 ["gx_o_bandana","a_hat","Paisley Bandana",750,1,"Black and white, tied at the back.",{gar:"o_bandana",b:"over"}],
 ["gx_o_wrap","a_acc","Shield Shades",950,1,"Wraparound, orange mirror lens.",{gar:"o_wrap",b:"over"}],
 ["gx_o_lock","a_acc","Padlock Chain",900,1,"Heavy silver links and a padlock.",{gar:"o_lock",b:"over"}],
 ["gx_o_gaiter","a_acc","Tech Gaiter",700,1,"Black, up over the nose.",{gar:"o_gaiter",b:"over"}],
 ["gx_o_tee","a_top","Spray Paint Boxy Tee",1000,1,"Oversized, one of a kind splatter.",{gar:"o_tee",b:"over"}],
 ["gx_o_puffer","a_top","Cropped Puffer",1700,1,"Glossy safety orange.",{gar:"o_puffer",b:"over"}],
 ["gx_o_flannel","a_top","Plaid Overshirt",1200,1,"Grey plaid over a white tee.",{gar:"o_flannel",b:"over"}],
 ["gx_o_wind","a_top","Color-Block Windbreaker",1500,1,"Black, teal, one orange stripe.",{gar:"o_wind",b:"over"}],
 ["gx_o_crop","a_top","Cropped Zip Hoodie",1300,1,"Washed black, cut high.",{gar:"o_crop",b:"over",fo:1}],
 ["gx_o_work","a_top","Canvas Chore Jacket",1500,1,"Tan duck canvas, corduroy collar.",{gar:"o_work",b:"over",mo:1}],
 ["gx_o_para","a_pants","Parachute Pants",1400,1,"Black nylon, ankle toggles.",{gar:"o_para",b:"over"}],
 ["gx_o_camo","a_pants","Urban Camo Cargos",1300,1,"Grey camo, wide leg.",{gar:"o_camo",b:"over"}],
 ["gx_o_shorts","a_pants","Mesh Ball Shorts",950,1,"Past the knee, orange stripe.",{gar:"o_shorts",b:"over",mo:1}],
 ["gx_o_skirt","a_pants","Cargo Mini Skirt",1100,1,"Charcoal with buckled straps.",{gar:"o_skirt",b:"over",fo:1}],
 ["gx_o_hoop","a_shoes","Retro High-Top Hoops",1600,1,"White, black, orange heel.",{gar:"o_hoop",b:"over"}],
 ["gx_o_slides","a_shoes","Socks & Slides",800,1,"White crew socks, black slides.",{gar:"o_slides",b:"over"}],
 ["gx_o_rigg","a_shoes","Trail Runners",1450,1,"Grey mesh, neon accents.",{gar:"o_rigg",b:"over"}],
 ["gx_v_cap","a_hat","Leather Dad Cap",850,1,"Soft black leather.",{gar:"v_cap",b:"rose"}],
 ["gx_v_lace","a_hat","Lace Headband",700,1,"Black lace and one rose.",{gar:"v_lace",b:"rose",fo:1}],
 ["gx_v_choke","a_acc","Spiked Choker",750,1,"Black leather, silver spikes.",{gar:"v_choke",b:"rose"}],
 ["gx_v_shade","a_acc","Tiny Oval Shades",800,1,"Small black lenses.",{gar:"v_shade",b:"rose"}],
 ["gx_v_thorn","a_acc","Thorn Chain",900,1,"Silver links like a thorny vine.",{gar:"v_thorn",b:"rose"}],
 ["gx_v_corset","a_top","Lace Corset Top",1400,1,"Black lace, laced up the front.",{gar:"v_corset",b:"rose",fo:1}],
 ["gx_v_biker","a_top","Leather Biker Jacket",1700,1,"Black, zipped, silver hardware.",{gar:"v_biker",b:"rose"}],
 ["gx_v_mesh","a_top","Sheer Mesh Top",1000,1,"Long sleeves, black mesh.",{gar:"v_mesh",b:"rose"}],
 ["gx_v_rose","a_top","Rose Print Tee",950,1,"Black with a big red rose.",{gar:"v_rose",b:"rose"}],
 ["gx_v_blazer","a_top","Wine Velvet Blazer",1600,1,"Deep red velvet.",{gar:"v_blazer",b:"rose",mo:1}],
 ["gx_v_leather","a_pants","Leather Pants",1400,1,"Black, straight leg.",{gar:"v_leather",b:"rose"}],
 ["gx_v_tulle","a_pants","Black Tulle Skirt",1300,1,"Layers and layers.",{gar:"v_tulle",b:"rose",fo:1}],
 ["gx_v_flare","a_pants","Velvet Flares",1300,1,"Wine velvet, wide hem.",{gar:"v_flare",b:"rose"}],
 ["gx_v_boot","a_shoes","Platform Combat Boots",1600,1,"Black, buckled, tall.",{gar:"v_boot",b:"rose"}],
 ["gx_v_heel","a_shoes","Strappy Heeled Boots",1500,1,"Black straps and a block heel.",{gar:"v_heel",b:"rose",fo:1}],
 ["gx_al_bucket","a_hat","Hiking Bucket Hat",750,1,"Sage with a chin cord.",{gar:"al_bucket",b:"alt"}],
 ["gx_al_flap","a_hat","Earflap Cap",850,1,"Fleece lined, orange trim.",{gar:"al_flap",b:"alt"}],
 ["gx_al_goggle","a_acc","Glacier Goggles",950,1,"Round lenses, leather sides.",{gar:"al_goggle",b:"alt"}],
 ["gx_al_buff","a_acc","Patterned Neck Buff",700,1,"Up over the nose.",{gar:"al_buff",b:"alt"}],
 ["gx_al_carab","a_acc","Carabiner Lanyard",650,1,"Bright rope, silver clip.",{gar:"al_carab",b:"alt"}],
 ["gx_al_fleece","a_top","Color-Block Fleece",1300,1,"Teal, cream, half zip.",{gar:"al_fleece",b:"alt"}],
 ["gx_al_shell","a_top","Waterproof Shell",1600,1,"Ice blue, taped seams.",{gar:"al_shell",b:"alt"}],
 ["gx_al_vest","a_top","Puffy Vest",1200,1,"Rust vest over a white tee.",{gar:"al_vest",b:"alt"}],
 ["gx_al_henley","a_top","Thermal Henley",1000,1,"Oatmeal waffle knit.",{gar:"al_henley",b:"alt",mo:1}],
 ["gx_al_anorak","a_top","Cropped Anorak",1400,1,"Sage pullover, big pocket.",{gar:"al_anorak",b:"alt",fo:1}],
 ["gx_al_cargo","a_pants","Convertible Hike Pants",1200,1,"Khaki, zip knees.",{gar:"al_cargo",b:"alt"}],
 ["gx_al_tight","a_pants","Trail Tights & Shorts",1100,1,"Black tights, teal shorts.",{gar:"al_tight",b:"alt",fo:1}],
 ["gx_al_short","a_pants","Hiking Shorts",900,1,"Olive, belt included.",{gar:"al_short",b:"alt",mo:1}],
 ["gx_al_hiker","a_shoes","Hiking Boots",1500,1,"Brown leather, red laces.",{gar:"al_hiker",b:"alt"}],
 ["gx_al_sandal","a_shoes","Trail Sandals & Socks",850,1,"Thick straps, wool socks.",{gar:"al_sandal",b:"alt"}],
 ["gx_nc_jog_black","a_pants","Signature Jogger, Black",1500,1,"Heavyweight fleece, white wordmark.",{gar:"nc_jog_black",b:"nc"}],
 ["gx_nc_jog_ash","a_pants","Signature Jogger, Ash",1500,1,"Heather grey, navy wordmark.",{gar:"nc_jog_ash",b:"nc"}],
 ["gx_nc_jog_slate","a_pants","Signature Jogger, Slate",1500,1,"Mid grey, cuffs that stack.",{gar:"nc_jog_slate",b:"nc"}],
 ["gx_nc_short","a_pants","Training Short",950,1,"Seven inches, wordmark on the leg.",{gar:"nc_short",b:"nc"}],
 ["gx_nc_cap","a_hat","Wordmark Cap",800,1,"Black six-panel. nicecock.",{gar:"nc_cap",b:"nc"}],
 ["gx_nc_beanie","a_hat","Rooster Beanie",750,1,"Ash rib knit, woven rooster.",{gar:"nc_beanie",b:"nc"}],
 ["gx_nc_band","a_hat","Sweatband",600,1,"White terry, says it on the front.",{gar:"nc_band",b:"nc"}],
 ["gx_nc_pendant","a_acc","Rooster Pendant",1100,1,"Silver rooster, fine box chain.",{gar:"nc_pendant",b:"nc"}],
 ["gx_nc_shades","a_acc","Sport Shades",900,1,"Smoked wraparound lens.",{gar:"nc_shades",b:"nc"}],
 ["gx_nc_hoodie","a_top","Heavyweight Hoodie",1700,1,"Navy, white tee hem underneath.",{gar:"nc_hoodie",b:"nc"}],
 ["gx_nc_tee","a_top","Boxy Tee",1000,1,"Bone white, rooster on the back.",{gar:"nc_tee",b:"nc"}],
 ["gx_nc_tank","a_top","Seamless Gym Tank",900,1,"Slate rib knit.",{gar:"nc_tank",b:"nc"}],
 ["gx_nc_qzip","a_top","Performance Quarter-Zip",1400,1,"Black, rooster on the sleeve.",{gar:"nc_qzip",b:"nc"}],
 ["gx_nc_court","a_shoes","Court High-Top",1600,1,"White leather, ash suede.",{gar:"nc_court",b:"nc"}],
 ["gx_nc_knit","a_shoes","Knit Trainer",1300,1,"Black sock-knit runner.",{gar:"nc_knit",b:"nc"}],
 ["gx_nc_slide","a_shoes","Pool Slide",700,1,"Debossed rooster.",{gar:"nc_slide",b:"nc"}]];
/* NICE COCK (Cal's brand, drop 5): ROOMS's 67d0e85 pieces and shop lines, prices a notch above ALTITUDE */
EXTRA_ITEMS.forEach(function(x){if(!x[6].soon)SHOP.push(x)});

/* The basics from the character creator, each sold on its own. They set the same options
   the creator does, so they need no art of their own beyond a shop icon. */
(function(){
  var D=window.QBDATA.creator,add=function(id,slot,name,price,desc,basic,extra){SHOP.push([id,slot,name,price,1,desc,Object.assign({basic:basic,b:"basics"},extra||{})])};
  [["tops","a_top","top","topColor",{tee:200,hoodie:350,bomber:350},"Everyday basic."],["bottoms","a_pants","bottom","bottomColor",{joggers:250,jeans:250,shorts:200},"Everyday basic."],["shoes","a_shoes","shoe","shoeColor",{sneakers:200,boots:300,flipflops:150},"Everyday basic."]].forEach(function(g){
    D[g[0]].forEach(function(o){D.clothColors.forEach(function(c){add("bs_"+o.id+"_"+c.id,g[1],c.label+" "+o.label,g[4][o.id],g[5],{key:g[2],id:o.id,ckey:g[3],color:c.id},{icon:"basic_"+o.id+"_"+c.id})})})});
  ["m","f"].forEach(function(b){D.hairStyles[b].forEach(function(o){var x={};x[b==="f"?"fo":"mo"]=1;x.icon="basic_"+b+"_"+o.id;add("bs_hair_"+b+"_"+o.id,"a_hair",o.label+" Cut",500,"A new hairstyle.",{key:"hairStyle",id:o.id},x)})});
  D.hairColors.forEach(function(c){add("bs_dye_"+c.id,"a_hairc",c.label+" Dye",400,"Changes your hair color.",{key:"hairColor",id:c.id},{swatch:c.swatch})});
  D.eyeColors.forEach(function(c){add("bs_eye_"+c.id,"a_eyes",c.label+" Eyes",400,"Changes your eye color.",{key:"eyeColor",id:c.id},{swatch:c.swatch,round:1})});
})();

function isRigItem(x){return !!(x[6]&&(x[6].gar||x[6].basic))}
function itemArt(it){var k="icon_"+(it[6].icon||it[6].gar)+".webp";return (window.QBART&&QBART[k])||"art/"+k}
/* Every piece carries its mark. Anyone can browse anything; only your own can be bought. */
function qsMark(it){var f=it[6].fo,m=it[6].mo;return '<span class="qs-mark '+(f?"f":m?"m":"u")+'" title="'+(f?"Women's":m?"Men's":"Unisex")+'" aria-label="'+(f?"Women's":m?"Men's":"Unisex")+'">'+(f?"♀":m?"♂":"⚥")+'</span>'}
function qsThumb(it){return '<div class="qs-img">'+(it[6].swatch?'<i class="qs-swatch'+(it[6].round?" round":"")+'" style="background:'+it[6].swatch+'"></i>':'<img src="'+itemArt(it)+'" alt="" loading="lazy">')+qsMark(it)+'</div>'}
garThumb=qsThumb;

/* The creator's choice for a slot counts as worn while nothing else is. */
function qsOriginal(it){var bs=it[6].basic;if(!bs||!S.char)return false;var c=rigChoiceFull();return c[bs.key]===bs.id&&(!bs.ckey||c[bs.ckey]===bs.color)}
function rigChoiceFull(){return Object.assign({},QBLoft.data.creator.defaults,rigChoice(fixChar(S.char)))}
function qsGrantOriginals(){if(!S.created||!S.char)return;SHOP.forEach(function(it){if(it[6]&&it[6].basic&&itemFits(it)&&qsOriginal(it))S.owned[it[0]]=true})}
function qsCard(it){
  var fits=itemFits(it),orig=qsOriginal(it),own=!!S.owned[it[0]],on=own&&(S.eq[it[1]]===it[0]||(!S.eq[it[1]]&&orig)),can=S.coins>=it[3];
  var price='<i class="coin"></i>'+it[3];
  var btn=!fits?'<button class="qs-btn" data-act="qsdeny" data-id="'+it[0]+'">'+price+'</button>'
    :on?(orig?'<button class="qs-btn ghost" disabled>Wearing</button>':'<button class="qs-btn ghost" data-act="unequip" data-id="'+it[1]+'">Equipped · Remove</button>')
    :own?'<button class="qs-btn alt" data-act="equip" data-id="'+it[0]+'">Equip</button>'
    :QS_TRYSL.indexOf(it[1])>=0?(QS_TRY[it[1]]===it[0]?'<button class="qs-btn alt" data-act="qstry" data-id="'+it[0]+'">Trying on · '+price+'</button>':'<button class="qs-btn" data-act="qstry" data-id="'+it[0]+'">Try on · '+price+'</button>')
    :can?'<button class="qs-btn" data-act="buy" data-id="'+it[0]+'">'+price+'</button>'
    :'<button class="qs-btn ghost" disabled>'+price+' · need '+(it[3]-S.coins)+' more</button>';
  return '<article class="qs-card'+(on?" on":"")+(QS_TRY[it[1]]===it[0]?" trying":"")+'" data-card="'+it[0]+'">'+qsThumb(it)+'<h4>'+esc(it[2])+'</h4><p>'+esc(it[5])+'</p>'+btn+'</article>';
}
var QS_GROUPS=[["a_hat","Hats"],["a_acc","Accessories"],["a_top","Tops"],["a_pants","Bottoms"],["a_shoes","Shoes"],["a_hair","Hair"],["a_hairc","Hair color"],["a_eyes","Eye color"]];
function qsGroups(pick){
  return QS_GROUPS.map(function(g){var items=SHOP.filter(function(x){return x[1]===g[0]&&isRigItem(x)&&pick(x)});
    return items.length?'<section class="qs-sec"><h3>'+g[1]+'</h3><div class="qs-grid">'+items.map(qsCard).join("")+'</div></section>':''}).join("");
}
function qsLegacy(tab){
  /* Upgrades and interface items keep their own art, on the light cards. */
  return SLOTS.filter(function(sl){return tab.indexOf(sl[0])>=0}).map(function(sl){
    var lv=effLvl(),items=SHOP.filter(function(x){return x[1]===sl[0]&&!isRigItem(x)&&itemFits(x)}),vis=items.filter(function(x){return x[4]<=lv}),nxt=items.filter(function(x){return x[4]>lv})[0];
    if(!vis.length&&!nxt)return "";
    return '<section class="qs-sec"><h3>'+sl[1]+'</h3><div class="shopgrid">'+vis.map(itemHtml).join("")+(nxt?'<div class="item"><div class="thumb"><b style="font-size:26px;padding:0">???</b></div><b>Sealed</b><small>Restocks at level '+nxt[4]+'</small></div>':'')+'</div></section>'}).join("");
}
/* Each tab has its own page colour (Cal, 2026-11-05): a brand in its banner's palette, Basics and Vault the shop's cream,
   the Wardrobe the walk-in closet's champagne, Upgrades and Interface the Hero's Lair. Cards stay white; page text flips. */
var QS_THEME={basics:["#f6f2ea","#1f1b16"],vault:["#f6f2ea","#1f1b16"],wardrobe:["linear-gradient(180deg,#efe4d4,#dcc7aa)","#2b2116"],
  upgrades:["linear-gradient(180deg,#1a2036,#0f1424)","#e6ecff"],interface:["linear-gradient(180deg,#1a2036,#0f1424)","#e6ecff"]};
function qsTheme(b){var t=b?["linear-gradient(180deg,"+b.c[1]+","+b.c[0]+")","#f4f1ea"]:(QS_THEME[shopTab]||QS_THEME.basics),st=document.body.style;
  st.setProperty("--shopbg",t[0]);st.setProperty("--shopfg",t[1]);st.setProperty("--shopsolid",b?b.c[0]:/^#/.test(t[0])?t[0]:shopTab==="wardrobe"?"#dcc7aa":"#0f1424")}
/* Try before you buy (Cal, 2026-11-05: "a preview option that allows me to try on the clothes before committing ... and
   then a final button to confirm purchase"). Clothes go on the mirror one per slot without being bought; the basket under
   the mirror buys them all at once, after a confirm. Nothing tried on is saved. */
var QS_TRY={},QS_TRYSL=["a_hat","a_top","a_pants","a_shoes","a_acc"];
function qsTryList(){return Object.keys(QS_TRY).map(function(k){return shopItem(QS_TRY[k])}).filter(function(it){return it&&!S.owned[it[0]]&&itemFits(it)})}
/* Stays in view beside the rack (sticky), so you can see each piece on as you try, buy or equip it. */
function qsMirror(){
  var tl=qsTryList(),ovr={};tl.forEach(function(it){ovr[it[1]]=it[0]});
  var worn=SHOP.filter(function(x){return isRigItem(x)&&(ovr[x[1]]?ovr[x[1]]===x[0]:S.eq[x[1]]===x[0])}).map(function(x){return esc(x[2])});
  var cost=tl.reduce(function(a,it){return a+it[3]},0),bask=tl.length?'<div class="qs-bask"><small>Trying on '+tl.length+' piece'+(tl.length>1?'s':'')+'</small>'
    +(S.coins>=cost?'<button class="qs-btn" data-act="qscheck">Buy '+(tl.length>1?'all ':'')+'· <i class="coin"></i>'+cost.toLocaleString()+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+cost.toLocaleString()+' · need '+(cost-S.coins).toLocaleString()+' more</button>')
    +'<button class="qs-link" data-act="qsclear">Take them off</button></div>':'';
  return '<aside class="qs-mirror'+(tl.length?' trying':'')+'"><div class="qs-glass">'+calImg(lookOf(ovr),"idle",window.innerWidth<=640?92:150,"")+'</div><div class="qs-worn"><b>'+esc((S.char&&S.char.name)||"You")+'</b><small>'+(worn.length?worn.join(" · "):"Just the basics")+'</small>'+bask+'</div></aside>';
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=qstry],[data-act=qsclear],[data-act=qscheck],[data-act=qsconfirm]");if(!b)return;var a=b.dataset.act;
  if(a==="qstry"){var it=shopItem(b.dataset.id);if(!it)return;if(QS_TRY[it[1]]===it[0])delete QS_TRY[it[1]];else QS_TRY[it[1]]=it[0];render();return}
  if(a==="qsclear"){QS_TRY={};render();return}
  var tl=qsTryList(),cost=tl.reduce(function(x,it){return x+it[3]},0);if(!tl.length)return;
  if(a==="qscheck"){modal('<div class="card box2 qs-confirm"><span class="label">Checkout</span><h3>'+tl.length+' piece'+(tl.length>1?'s':'')+'</h3><ul>'+tl.map(function(it){return '<li><span>'+esc(it[2])+'</span><b><i class="coin"></i>'+it[3].toLocaleString()+'</b></li>'}).join("")+'</ul><p class="note">Total <b><i class="coin"></i>'+cost.toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="qsconfirm">Confirm purchase</button><button class="btn ghost" data-act="mclose">Keep looking</button></div></div>');return}
  if(a==="qsconfirm"){if(S.coins<cost){pop("Need "+(cost-S.coins)+" more coins");return}var m=b.closest(".modal");if(m)m.remove();
    tl.forEach(function(it){S.coins-=it[3];S.spent+=it[3];S.owned[it[0]]=true;S.eq[it[1]]=it[0]});QS_TRY={};try{ifSound("buy")}catch(x){}
    checkBadges();render();persist();try{burst(innerWidth/2,innerHeight/3,30)}catch(x){}pop("Bought "+(tl.length>1?tl.length+" pieces":tl[0][2])+". Wearing "+(tl.length>1?"them":"it")+" now.")}});
shopHtml=function(){
  var d=dropState(),live=d.live.slice().reverse();
  qsGrantOriginals();
  var tabs=live.map(function(b){return [b.id,(b.back?"\u21BA ":"")+b.name]}).concat([["basics","Basics"],["wardrobe","Wardrobe"],["upgrades","Upgrades"],["interface","Interface"]]);
  /* Opening the shop lands on the newest brand, not whichever tab was last in the save. */
  if(!window._qsSeen||!tabs.some(function(t){return t[0]===shopTab})){window._qsSeen=1;shopTab=live.length?live[0].id:"wardrobe"}
  /* Cal: the next drop is a small countdown on the Shop itself, not part of the banner. */
  var h='<div class="qshop"><header class="qs-top"><div><small>New pieces every '+dropCadence().replace(/s and /," and ").replace(/s$/,"")+', a favourite back every Wednesday</small><h1>The Shop</h1>'+(d.next?'<small class="qs-cd">'+esc(d.next.name)+' drops in '+cdTxt(ptMidnight(d.next.start)-d.n)+'</small>':'')+'</div><div class="qs-coin"><i class="coin"></i><b>'+S.coins+'</b></div></header>';
  h+='<nav class="qs-tabs" aria-label="Shop sections">'+tabs.map(function(t){return '<button class="qs-tab'+(shopTab===t[0]?" on":"")+'" data-act="stab" data-v="'+t[0]+'">'+esc(t[1])+'</button>'}).join("")+'</nav>';
  var b=d.live.filter(function(x){return x.id===shopTab})[0];qsTheme(b);
  if(b){
    h+=qsBanner(b,d);
    /* Cal: a brand back on Wednesday is here for the week only */
    if(b.back)h+='<p class="qs-note qs-lead">Back for one week only. It leaves '+(function(){var t=ptMidnight(b.backUntil)-d.n;return t>0?'in '+cdTxt(t):'today'})()+'.</p>';
    h+='<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+qsGroups(function(x){return x[6].b===b.id})+'</div></div>';
  }else if(shopTab==="basics"){
    h+='<p class="qs-note qs-lead">The everyday pieces from character creation, sold one at a time.</p>';
    h+='<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+qsGroups(function(x){return x[6].b==="basics"})+'</div></div>';
  }else if(shopTab==="wardrobe"){
    var mine=SHOP.filter(function(x){return isRigItem(x)&&S.owned[x[0]]&&itemFits(x)});
    h+='<p class="qs-note qs-lead">Everything you own stays here, even after its brand leaves the shop.</p>';
    h+='<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+(mine.length?qsGroups(function(x){return !!S.owned[x[0]]&&itemFits(x)}):'<p class="qs-empty">Nothing here yet. Pieces you buy will wait for you here.</p>')+'</div></div>';
  }else if(shopTab==="upgrades"){
    h+='<p class="qs-note">Permanent upgrades stack with your class and crew. Buy once, keep forever.</p>'+qsLegacy(["buff"]);
  }else{
    h+='<div class="qs-fit qs-fitif">'+ifPreview()+'<div class="qs-rack">'+qsLegacy(["theme","frame","bg","pet","title","burst","hud","sound","scene"])+'</div></div>';
  }
  h+='<p class="qs-dev">Testing: <button class="qs-link" data-act="simwk">Skip ahead one week</button> <button class="qs-link" data-act="simrs">Reset</button> <button class="qs-link" data-act="simcoin">Add 10,000 coins</button> <button class="qs-link" data-act="simlvl">Level up</button></p></div>';
  return h;
};
/* The wardrobe button in the room opens the same screen. */
wardrobeModal=function(){view="shop";shopTab="wardrobe";render();window.scrollTo(0,0)};
/* The brand banner at the top of the Shop (Cal, 2026-11-05: "a full stylized and classy banner"). The brand's own colours
   deepen to near black, with its logo as a faint watermark, fine pinstripes, a light sheen and a thin frame in its accent,
   the name between hairline ornaments. When banner art exists (art/app/ui_banner_<id>.webp, bundled into art_ui.js) it
   fills the banner behind the same text. */
function qsBanner(b,d){var art=window.QBART&&QBART["ui_banner_"+b.id+".webp"],wm=QBLoft.data.loft.artBase+'logo_'+b.id+'.webp'+artQ('logo_'+b.id+'.webp');
  return '<section class="qs-hero qs-banner'+(art?' has-art':'')+'" style="--b1:'+b.c[0]+';--b2:'+b.c[1]+';--b3:'+b.c[2]+';--ba:'+b.ac+';--wm:url(\''+wm+'\')">'
    +(art?'<img class="qs-bnart" src="'+art+'" alt=""><i class="qs-bnshade" aria-hidden="true"></i>':'')
    +'<div class="qs-bnin"><span class="qs-bnkick">The '+esc(b.name)+' drop</span>'+brandLogo(b,1)
    +'<i class="qs-bnrule" aria-hidden="true"><b></b><em></em><b></b></i><p>'+esc(b.tag)+'</p></div></section>'}
