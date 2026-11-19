/* ---------- The Pet Shop (Cal, 2026-11-18; docs/PET_SHOP.md) ----------
   Cal: "pet shop open level 2. but i dont want a basic dog", then: "They can own only 1. Make sure to provide a warning that you can only
   buy one. If you wish to give it up for adoption, the pet should have a sad crying animation splash screen where you confirm if you
   want to give it up for adoption, which costs the same price as the pet to give up. And then you can buy another." Also "12 per pet",
   "Dogs too" (the clothes), "keep chopstick and pluto", the third pet's beds in the Bedroom and on the Patio ("Yes, replace it": the
   fire-side chair), and "Me and my girlfriend dont share accounts": everything here lives in the player's own save.
   - A "Pets" tab on floor 2 (the Boutique, level 30): the three creatures (ROOMS's art, data/pet_art.json) and this drop's clothes.
   - One creature per player (S.pet = {k, t}). Buying warns first; giving it up shows it crying (frames 7-10) and costs its price.
   - Clothes (data/pet_clothes.json, names from ROOMS's pets_clothes.md): a line of 12 per creature and one for the dogs. Each Monday
     and Thursday drop shows 2 of each line, the same for everyone; owned pieces stay yours. What each pet wears: S.petw[kind] and
     S.dogw[dog], per slot (head, neck, body, aura; the slime's base pieces use the neck slot).
   - Drawn as the dogs are (20_loft.js lfDogSpr): the frame with its clothes composited on a canvas (pzSprite), cached per look. */
var PETS={wolf:{name:"Shadow Wolf Pup",line:"Charcoal fur, icy cyan flame on its tail and ears. Trips over its own paws."},
  wyvern:{name:"Void Wyvern",line:"A chubby baby dragon in navy scales and amber-gold markings. Hovers by your shoulder."},
  slime:{name:"Shadow Fox-Slime",line:"A plum-violet jelly with fox ears and a smoky tail. Bounces everywhere."}};
var PET_ORDER=["wolf","wyvern","slime"],PET_PRICE=3000,PZ_K=34/300;/* the dogs' scale (LFDOGH / their 300 px frames), ROOMS painted to it */
var PC_PRICE={head:350,neck:300,base:300,body:500,aura:600};/* below the Boutique's clothes; tuned in the economy pass */
var PCNAME={"pw_helm":["Frost-Rune Half Helm","A tiny brushed-steel half helm with two ear slots, an icy cyan rune-etched brow band, a short crest fin."],"pw_beanie":["Ear-Slot Cable Beanie","Slate-grey cable knit with two ear holes, an icy cyan pompom, a stitched paw patch on the cuff."],"pw_circlet":["Crescent Circlet","A thin silver circlet between the ears, a cyan crescent gem, two short fine chains (they never reach the eyes)."],"pw_collar":["Glow-Stud Collar","Black leather, a row of glowing icy cyan studs, a silver snowflake tag with no letters."],"pw_ruff":["Frost Fur Ruff","A silver-grey faux-fur neck ruff, frosted white tips, an icy cyan crystal clasp at the front."],"pw_torc":["Frost Bell Torc","A twisted silver torc with a small frosted-glass bell and a cyan bead either side."],"pw_armour":["Pup Battle Plate","A steel chest plate and shoulder guards with cyan-lit seams, brown leather straps, a rivet border."],"pw_hoodie":["Oversized Pup Hoodie","A silver-grey hoodie far too big, sleeves pushed up, icy cyan drawstrings, a pouch pocket with a paw print."],"pw_cape":["Frost Star Cape","A short slate-blue velvet cape, silver star embroidery along the hem, an icy cyan clasp at the chest."],"pw_aurora":["Aurora Ribbon","A soft ribbon of icy cyan and silver northern light curling round the pup, a few pale sparkles along it."],"pw_cloud":["Little Snow Cloud","A small silver-grey cloud floating above the pup, white and icy cyan snowflakes drifting down round it."],"pw_shards":["Moon Shard Ring","A ring of tiny pale-blue ice crystals with one small silver crescent moon among them, each crystal catching a glint."],"pv_wizard":["One-Horn Wizard Hat","A tilted rust-orange wizard hat with navy and gold stars and a moon, a hole for one horn, a bent tip."],"pv_goggles":["Flight Goggles","Brass flight goggles with amber lenses on a leather strap between the horns."],"pv_hornring":["Horn-Ring Crown","Two gold filigree rings on the horns joined by a fine chain with an amber bead."],"pv_scarf":["Hoard-Stripe Scarf","A chunky knit scarf in amber and navy stripes, fringed ends flying."],"pv_coins":["Treasure Coin Chain","A gold chain of small blank coins with one amber gem pendant."],"pv_kerchief":["Pilot's Neckerchief","A cream silk neckerchief knotted at the side, an amber stick pin."],"pv_pack":["Tiny Explorer Pack","A brown leather backpack with brass buckles, a rolled map and a lantern hooked on the side."],"pv_bomber":["Wing-Slit Bomber","A tan leather bomber jacket with amber lining, two slits for the wings, a navy flame-shaped patch."],"pv_vest":["Hoard-Keeper Vest","A quilted cream waistcoat with gold embroidery and brass buttons, navy piping, a pocket watch chain."],"pv_embers":["Ember Motes","Small amber embers rising round it with a few glowing gold sparks and faint curls of warm smoke."],"pv_lanterns":["Tiny Lanterns","Three tiny brass lanterns with amber glass circling it, a warm glow and a faint gold trail behind each."],"pv_stars":["Star-Map Ring","A ring of amber star points joined by fine gold lines like invented constellations, one bright navy-rimmed star at the front."],"ps_crown":["Tilted Jewel Crown","A small pink-gold crown tilted to one side between the ears, hot pink gems, tiny pearl tips (never big, gold and centred)."],"ps_phones":["Glow Headphones","Chunky hot pink headphones with a gold band over the ears, glowing pink cups with a gold star on each."],"ps_bow":["Giant Satin Bow","A huge hot pink satin bow on top, plum polka dots, long trailing tails."],"ps_ruffle":["Lace Ruffle Collar","A frilly pink lace ruffle round the base with a plum ribbon bow at the front."],"ps_pearls":["Heart Pearl Belt","A string of big pearls round the base, a pink heart charm hanging at the front."],"ps_scarf":["Chunky Plum Scarf","A chunky plum and pink knit scarf wound round the base, pompom ends."],"ps_cape":["Heart-Clasp Cape","A tiny pink satin cape over the back, plum lining, a gold heart clasp."],"ps_float":["Candy Swim Ring","A plum and pink striped float ring round its middle, a little valve and shine."],"ps_pack":["Star Charm Backpack","A pink mini backpack with gold zips, a plum star charm and a tiny keyring."],"ps_flames":["Spirit Flame Orbit","Four small hot pink spirit flames circling it with plum smoke tails (Cal's \"tiny orbiting spirit flames\")."],"ps_comet":["Comet Loop","A small hot pink comet with a gold tail looping round it, tiny pink sparkles shed along the loop."],"ps_sparkle":["Sparkle Ring","A ring of tiny four-point stars in pink and gold twinkling round it, a faint plum glow behind them."],"pd_bucket":["Corduroy Ear-Slit Bucket Hat","Caramel corduroy with two ear slits, a cherry stitched bone patch on the front, a cream band."],"pd_poppy":["Poppy Chain Crown","A woven ring of cherry-red poppies with navy centres on tan twine (no leaves, no stems), a small navy bow at the side."],"pd_aviator":["Pup Aviator Cap","A brown leather flight cap with cream fleece lining, short fleece-lined ear flaps hanging to the jaw, tiny goggles high on the brow."],"pd_bowtie":["Gingham Bow-Tie Collar","A navy collar with a cherry gingham bow tie and a small brass bell."],"pd_bandana":["Paw-Print Rope Bandana","A cream bandana with cherry paw prints and a twisted rope edge, knotted at the side."],"pd_studs":["Studded Leather Collar","Cherry leather with a row of brass studs and a blank brass bone-shaped tag at the front."],"pd_fleece":["Check Fleece Coat","A cherry and navy check fleece coat with a cream sherpa collar, two navy toggles and a leash loop on the back. (Was pd_puffer: Higgsfield refused it as NSFW on 11-18, a false positive; the rule is a new design, never a resubmit.)"],"pd_rain":["Mustard Rain Slicker","A mustard rain slicker with a little hood, toggle buttons and a cream reflective stripe."],"pd_cable":["Cable-Knit Turtleneck","A navy cable-knit sweater with a cream rolled neck and a cherry heart patch on the side."],"pd_hearts":["Floating Hearts","Small cherry and cream hearts drifting up round the dog, a few with a navy stitched outline like felt patches."],"pd_bubbles":["Soap Bubbles","A few glossy soap bubbles with a pink and sky-blue sheen (no green) and a white shine, one popping into a tiny splash."],"pd_treats":["Orbiting Treats","Three tiny bone-shaped biscuits circling it, golden-baked with cream icing dots, a few crumbs trailing."]};
function pzData(){return (window.QBDATA&&QBDATA.pet_art)||null}
function pzCl(){return (window.QBDATA&&QBDATA.pet_clothes)||{}}
function petMine(){return S&&S.pet&&PETS[S.pet.k]?S.pet:null}

function pzArt(n){var D=QBLoft&&QBLoft.data;return ((D&&D.loft&&D.loft.artBase)||"art/")+n+".webp"+(typeof artQ==="function"?artQ(n+".webp"):"")}
function pzSlot(kind){return kind==="base"?"neck":kind}
function pzDogs(){var o={pluto:false,chopstick:false};try{S.base.slots.forEach(function(r){if(r&&r.t==="bedroom"&&r.a){if(r.a.bd_pluto)o.pluto=true;if(r.a.bd_chop)o.chopstick=true}})}catch(e){}return o}
function pzWorn(who){if(who==="pluto"||who==="chopstick")return (S.dogw&&S.dogw[who])||{};return (S.petw&&S.petw[who])||{}}
/* ---- the drop: 2 pieces of each line per Monday/Thursday 8 am slot, a fixed seeded order per line, so no piece twice running ---- */
var PZ_DAY0="2026-11-16";
function pzSlotNow(){var n=dropNow(),k=0;for(var i=0;i<4000;i++){var ymd=ymdAdd(PZ_DAY0,i),wd=new Date(ymdN(ymd)*864e5).getUTCDay();if(wd!==1&&wd!==4)continue;if(dropStart(ymd)>n)break;k++}return Math.max(0,k-1)}
function pzLine(line){var C=pzCl();return Object.keys(C).filter(function(id){return C[id].pet===line&&PCNAME[id]}).sort()}
function pzOrder(line){var ids=pzLine(line),h=0,s=line+"|pets";for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;
  var r=function(){h=(h*1103515245+12345)|0;return ((h>>>8)&0xffff)/65536};for(var j=ids.length-1;j>0;j--){var q=Math.floor(r()*(j+1)),t=ids[j];ids[j]=ids[q];ids[q]=t}return ids}
function pzDrop(line){var P=pzOrder(line),n=P.length;if(!n)return [];var s=pzSlotNow();return n<3?P.slice():[P[(2*s)%n],P[(2*s+1)%n]]}
/* ---- compositing a pet with its clothes (ROOMS's tools/pet_wear.py is the reference) ---- */
var PZIMG={},PZSPR={},PZWAIT={};
function pzImg(n){if(PZIMG[n])return PZIMG[n];return PZIMG[n]=new Promise(function(ok){var im=new Image();im.onload=function(){ok(im)};im.onerror=function(){ok(null)};im.src=pzArt(n)})}
function pzFrameInfo(who,f){var D=pzData();if(!D)return null;
  if(PETS[who]){var P=D.pets[who];if(!P)return null;return {img:"pgx_"+who+"_"+f,W:P.w,H:P.h,cx:P.cx,a:P.anchors&&P.anchors[f],fit:P.fit,dog:false}}
  var A=D.dogs&&D.dogs["dgx_"+who+"_"+f];if(!A)return null;
  return {img:"dgx_"+who+"_"+f,W:A.size[0],H:A.size[1],cx:A.size[0]/2,a:{head:A.head,neck:A.neck,body:A.back,aura:A.aura},fit:D.dogFit,dog:true}}
/* which cell of a piece a frame uses, and where it goes: [cell, anchor point [x,y,deg], pivot] or null when the slot hides */
function pzPlace(id,who,f,fi,back){var it=pzCl()[id];if(!it||!fi||!fi.a)return null;var cells=fi.dog?it.cells.filter(function(c){return c.pet===who}):it.cells,fit=fi.fit||{},a=fi.a,c=null,an=null,pv=null;
  if(!cells.length)return null;
  if(it.kind==="head"){if((fit.headHide||[]).indexOf(f)>=0||!a.head)return null;var hc=fit.head&&fit.headCells?fit.headCells.indexOf(fit.head[f]):0;c=cells[Math.min(Math.max(hc,0),cells.length-1)];an=a.head}
  else if(it.kind==="neck"){if(!a.neck)return null;c=cells[0];an=a.neck}
  else if(it.kind==="body"||it.kind==="base"){var bi=(fit.cells||[]).indexOf((fit.body||[])[f]);c=cells[Math.min(Math.max(bi,0),cells.length-1)];an=it.kind==="base"?a.neck:a.body;if(!an)return null}
  else if(it.kind==="aura"){/* cell 0 the back half (under the pet), cell 1 the front half (over it) */if(!back&&cells.length<2)return null;c=cells[back?0:1];
    if(it.anchor==="head"&&a.head){an=a.head;pv=c.pivot}else{an=a.aura;pv=c.pivotAura||c.pivot}}
  if(!c||!an)return null;
  /* turned by the anchor's angle here minus its angle on the frame the cell was painted on */
  var deg=0;if(an.length>2){var f0=pzFrameInfo(who,c.frame),a0=f0&&f0.a,k0=it.kind==="body"?"body":it.kind==="base"||it.kind==="neck"?"neck":"head",b0=a0&&a0[k0];deg=(an[2]||0)-((b0&&b0[2])||0)}
  return {c:c,x:an[0],y:an[1],deg:deg,pv:pv||c.pivot,src:"ppc_"+id+"_"+c.cell}}
function pzKey(who,f,worn){return who+"|"+f+"|"+["aura","body","neck","head"].map(function(s){return worn[s]||""}).join(",")}
/* the sprite for a frame: the composite once it is drawn, the plain frame until then (null without art) */
function pzSprite(who,f,worn,cb){worn=worn||pzWorn(who);var key=pzKey(who,f,worn);if(PZSPR[key])return PZSPR[key];
  var fi=pzFrameInfo(who,f);if(!fi)return null;
  if(!PZWAIT[key]){PZWAIT[key]=1;var L=[];
    ["aura","body","neck","head"].forEach(function(s){var id=worn[s];if(!id||!pzCl()[id])return;if(s==="aura"){var b=pzPlace(id,who,f,fi,true),fr=pzPlace(id,who,f,fi,false);if(b){b.back=1;L.unshift(b)}if(fr)L.push(fr)}else{var p=pzPlace(id,who,f,fi,false);if(p)L.push(p)}});
    Promise.all([pzImg(fi.img)].concat(L.map(function(p){return pzImg(p.src)}))).then(function(ims){var base=ims[0];if(!base)return;
      var x0=0,y0=0,x1=fi.W,y1=fi.H;/* the frame plus each piece's own turned corners */L.forEach(function(p){var r=p.deg*Math.PI/180,co=Math.cos(r),si=Math.sin(r);[[0,0],[p.c.w,0],[p.c.w,p.c.h],[0,p.c.h]].forEach(function(q){var dx=q[0]-p.pv[0],dy=q[1]-p.pv[1],X=p.x+dx*co-dy*si,Y=p.y+dx*si+dy*co;x0=Math.min(x0,X);y0=Math.min(y0,Y);x1=Math.max(x1,X);y1=Math.max(y1,Y)})});
      /* the mass centre in the middle and the ground line at the bottom, so the Loft can place it as it places a dog */
      var half=Math.ceil(Math.max(fi.cx-x0,x1-fi.cx)),top=Math.ceil(-y0),bot=Math.ceil(Math.max(0,y1-fi.H)),cw=half*2,ch=top+fi.H+bot;
      var cv=document.createElement("canvas");cv.width=cw;cv.height=ch;var g=cv.getContext("2d"),ox=half-fi.cx,oy=top;
      var drawP=function(p,im){if(!im)return;g.save();g.translate(ox+p.x,oy+p.y);g.rotate(p.deg*Math.PI/180);g.drawImage(im,-p.pv[0],-p.pv[1],p.c.w,p.c.h);g.restore()};
      L.forEach(function(p,i){if(p.back)drawP(p,ims[i+1])});
      g.drawImage(base,ox,oy,fi.W,fi.H);
      L.forEach(function(p,i){if(!p.back)drawP(p,ims[i+1])});
      var u;try{u=cv.toDataURL("image/png")}catch(e){u=null}if(!u)return;
      PZSPR[key]={u:u,w:cw,h:ch,ax:half,ay:top+fi.H};if(cb)cb(PZSPR[key]);pzRefresh(key)})}
  var S0=window.LFSPR&&LFSPR[fi.img];return {u:pzArt(fi.img),w:fi.W,h:fi.H,ax:fi.cx,ay:fi.H,plain:1,s0:S0}}
/* a composite finished: pets on screen redraw with it, and Shop pictures waiting for it swap in */
function pzRefresh(key){try{if(window.LFA)Object.keys(LFA).forEach(function(k){var a=LFA[k];if(a&&a.role==="dog")a._k=null})}catch(e){}
  try{var s=PZSPR[key];document.querySelectorAll('img[data-pzk="'+key.replace(/"/g,"")+'"]').forEach(function(im){im.src=s.u})}catch(e){}}
function pzPic(who,f,cls){var w=pzWorn(who),key=pzKey(who,f,w),s=pzSprite(who,f,w);if(!s)return '';return '<img class="'+(cls||"")+'" data-pzk="'+esc(key)+'" src="'+s.u+'" alt="">'}
/* ---- the Loft: the creature is a dog-like actor (id "pet"), drawn with its clothes; the dogs wear theirs too ---- */
function pzLoftFrame(who,p,a){/* dogs: 0 stand, 1 step, 2 sit, 3 sleep; creatures: 0-1 idle, 2-3 move, 4 sit, 5 sleep, 6 fun */
  if(!PETS[who])return p==="sleep"?3:p==="sit"?2:(typeof p==="number"&&p%2)?1:0;
  if(p==="sleep")return 5;if(p==="sit")return 4;if(p==="fun")return 6;if(typeof p==="string"&&/^idle/.test(p))return +p.slice(4)||0;return typeof p==="number"?2+(p%2):0}
function pzLoftSpr(dname,p){var who=dname==="pet"?(petMine()||{}).k:dname;if(!who)return null;var worn=pzWorn(who),any=Object.keys(worn).some(function(k){return worn[k]});
  if(!PETS[who]&&!any)return undefined;/* an undressed dog: the dogs' own code */
  var f=pzLoftFrame(who,p),s=pzSprite(who,f,worn);if(!s)return null;var k=PZ_K;return {u:s.u,w:s.w*k,h:s.h*k,ax:s.ax*k,ay:s.ay*k}}
/* ---- the Shop's Pets tab ---- */
function pzCard(k){var mine=petMine(),own=mine&&mine.k===k,price='<i class="coin"></i>'+PET_PRICE.toLocaleString(),btn;
  if(own)btn='<button class="qs-btn ghost" disabled>Yours</button><button class="qs-link pz-adopt" data-act="pzadopt">Give up for adoption</button>';
  else if(mine)btn='<button class="qs-btn ghost" disabled>You already have a pet</button>';
  else if(S.coins>=PET_PRICE)btn='<button class="qs-btn" data-act="pzbuy" data-id="'+k+'">Adopt · '+price+'</button>';
  else btn='<button class="qs-btn ghost" disabled>'+price+' · need '+(PET_PRICE-S.coins).toLocaleString()+' more</button>';
  return '<article class="qs-card pz-pet'+(own?" on":"")+'" data-card="pet_'+k+'"><div class="qs-img pz-img">'+pzPic(k,0,"pz-fr")+'</div><h4>'+esc(PETS[k].name)+'</h4><p>'+esc(PETS[k].line)+'</p>'+btn+'</article>'}
function pzClCard(id){var it=pzCl()[id],nm=PCNAME[id]||[id,""],price=PC_PRICE[it.kind]||400,own=!!(S.owned&&S.owned["pc_"+id]),line=it.pet,slot=pzSlot(it.kind),btn="";
  var who=line==="dogs"?null:line,thumb='<img src="'+pzArt("ppc_"+id+"_0")+'" alt="">'+(it.kind==="aura"&&it.cells.length>1?'<img class="pz-front" src="'+pzArt("ppc_"+id+"_1")+'" alt="">':'');/* an aura shows both halves */
  if(!own)btn=S.coins>=price?'<button class="qs-btn" data-act="pzclbuy" data-id="'+id+'"><i class="coin"></i>'+price+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+price+' · need '+(price-S.coins)+' more</button>';
  else if(who){var mine=petMine();if(!mine||mine.k!==who)btn='<button class="qs-btn ghost" disabled>Fits the '+esc(PETS[who].name)+'</button>';
    else btn=pzWorn(who)[slot]===id?'<button class="qs-btn ghost" data-act="pzwear" data-id="'+id+'" data-who="'+who+'">Wearing · Remove</button>':'<button class="qs-btn alt" data-act="pzwear" data-id="'+id+'" data-who="'+who+'">Put on '+esc(PETS[who].name.split(" ").pop())+'</button>'}
  else{var D=pzDogs(),bs=["pluto","chopstick"].filter(function(d){return D[d]});
    btn=bs.length?bs.map(function(d){var on=pzWorn(d)[slot]===id,nm2=d==="pluto"?"Pluto":"Chopstick";return '<button class="qs-btn '+(on?"ghost":"alt")+'" data-act="pzwear" data-id="'+id+'" data-who="'+d+'">'+(on?nm2+" · Remove":"Put on "+nm2)+'</button>'}).join(""):'<button class="qs-btn ghost" disabled>Adopt Pluto or Chopstick in the Bedroom</button>'}
  return '<article class="qs-card pz-cl'+(own?" own":"")+'" data-card="pc_'+id+'"><div class="qs-img">'+thumb+'</div><h4>'+esc(nm[0])+'</h4><p>'+esc(nm[1])+'</p>'+btn+'</article>'}
function pzTab(){var mine=petMine(),lines=(mine?[mine.k]:[]).concat(["dogs"]),h='';
  h+='<p class="qs-note qs-lead">A creature of your own. You can have one at a time.</p>';
  h+='<section class="qs-sec"><h3>Creatures</h3><div class="qs-grid pz-grid">'+PET_ORDER.map(pzCard).join("")+'</div></section>';
  if(mine)h+='<section class="qs-sec pz-mine"><h3>'+esc(PETS[mine.k].name)+' today</h3><div class="pz-stage">'+[0,4,6].map(function(f){return pzPic(mine.k,f,"pz-st")}).join("")+'</div></section>';
  var drop=[];lines.forEach(function(l){pzDrop(l).forEach(function(id){drop.push(id)})});
  h+='<section class="qs-sec"><h3>This drop</h3><p class="qs-note">'+(mine?'New pieces every Monday and Thursday at 8 am: two for your '+esc(PETS[mine.k].name)+' and two for the dogs.':'New pieces every Monday and Thursday at 8 am. Adopt a creature to see its clothes; the dogs’ are here for everyone.')+'</p><div class="qs-grid">'+drop.map(pzClCard).join("")+'</div></section>';
  var C=pzCl(),owned=Object.keys(C).filter(function(id){return S.owned&&S.owned["pc_"+id]&&drop.indexOf(id)<0&&(C[id].pet==="dogs"||(mine&&C[id].pet===mine.k))});
  if(owned.length)h+='<section class="qs-sec"><h3>Your pet clothes</h3><div class="qs-grid">'+owned.map(pzClCard).join("")+'</div></section>';
  return h}
var pzShopBase=shopHtml;
shopHtml=function(){var want=shopTab==="pets";if(want){shopTab="wardrobe";window._qsSeen=1}
  var h=pzShopBase.apply(this,arguments),fl=typeof QSFLOOR!=="undefined"?QSFLOOR:"";
  if(want&&fl!=="boutique")want=false;
  if(fl==="boutique"){var tab='<button class="qs-tab'+(want?" on":"")+'" data-act="stab" data-v="pets">Pets</button>';
    h=h.replace(/(<nav class="qs-tabs" aria-label="Shop sections">)/,'$1'+tab)}
  if(want){shopTab="pets";h=h.replace(/(<button class="qs-tab qs-wdb) on(" data-act="stab" data-v="wardrobe">)/,'$1$2');
    var a=h.indexOf('<p class="qs-note qs-lead">Everything you own'),b=h.indexOf('<p class="qs-dev">');if(b<0)b=h.lastIndexOf('</div>');
    if(a>=0&&b>a)h=h.slice(0,a)+pzTab()+h.slice(b)}
  return h};
/* ---- buying, wearing, giving up ---- */
function pzBuyModal(k){var nm=esc(PETS[k].name);
  modal('<div class="card box2 qs-confirm pz-confirm"><div class="rm-head"><span class="label">Adopt</span>'+coinPillHtml()+'</div><div class="pz-cpic">'+pzPic(k,0,"pz-fr")+'</div><h3>'+nm+'</h3>'
    +'<p class="note"><b>You can only have one pet.</b> To switch later you would give '+nm+' up for adoption, which costs <i class="coin"></i>'+PET_PRICE.toLocaleString()+', the same as adopting.</p>'
    +'<p class="note">'+nm+' gets a bed in your Bedroom, and one on the Patio in the spot by the fire.</p>'
    +'<div class="row"><button class="btn" data-act="pzbuyok" data-id="'+k+'">Adopt for <i class="coin"></i>'+PET_PRICE.toLocaleString()+'</button><button class="btn ghost" data-act="mclose">Cancel</button></div></div>')}
var PZCRY=null;
function pzAdoptModal(){var mine=petMine();if(!mine)return;var k=mine.k,nm=esc(PETS[k].name);
  modal('<div class="card box2 pz-cry"><div class="pz-crypic">'+pzPic(k,7,"pz-cryf")+'</div><h3>Give '+nm+' up for adoption?</h3>'
    +'<p class="note">It costs <i class="coin"></i>'+PET_PRICE.toLocaleString()+', the same as adopting. Its beds leave with it. The clothes you bought stay yours and come back if you adopt this kind again.</p>'
    +'<div class="row">'+(S.coins>=PET_PRICE?'<button class="btn" data-act="pzadoptok">Give up · <i class="coin"></i>'+PET_PRICE.toLocaleString()+'</button>':'<button class="btn" disabled>Need '+(PET_PRICE-S.coins).toLocaleString()+' more coins</button>')+'<button class="btn ghost" data-act="mclose">Keep '+nm+'</button></div></div>');
  /* the crying loop: frames 7-10, a sniffle at four frames a second */
  clearInterval(PZCRY);var i=0;PZCRY=setInterval(function(){var im=document.querySelector(".pz-cryf");if(!im){clearInterval(PZCRY);return}i=(i+1)%4;var w=pzWorn(k),s=pzSprite(k,7+i,w);if(s){im.src=s.u;im.setAttribute("data-pzk",pzKey(k,7+i,w))}},260)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act^=pz]");if(!b)return;var a=b.dataset.act,id=b.dataset.id;
  if(a==="pzbuy"){if(petMine()){pop("You already have a pet");return}pzBuyModal(id);return}
  if(a==="pzbuyok"){if(petMine()||!PETS[id])return;if(S.coins<PET_PRICE){pop("Need "+(PET_PRICE-S.coins)+" more coins");return}var m=b.closest(".modal");if(m)m.remove();
    S.coins-=PET_PRICE;S.spent=(S.spent||0)+PET_PRICE;S.pet={k:id,t:Date.now()};try{qbSnd("buy")}catch(x){}render();persist();try{burst(innerWidth/2,innerHeight/3,30)}catch(x){}pop(PETS[id].name+" is yours. Say hi in the Bedroom.");return}
  if(a==="pzadopt"){pzAdoptModal();return}
  if(a==="pzadoptok"){var mine=petMine();if(!mine)return;if(S.coins<PET_PRICE){pop("Need "+(PET_PRICE-S.coins)+" more coins");return}var m2=b.closest(".modal");if(m2)m2.remove();clearInterval(PZCRY);
    S.coins-=PET_PRICE;S.spent=(S.spent||0)+PET_PRICE;var nm=PETS[mine.k].name;S.pet=null;render();persist();pop(nm+" went to a good home.");return}
  if(a==="pzclbuy"){var it=pzCl()[id],price=it&&(PC_PRICE[it.kind]||400);if(!it)return;if(S.owned["pc_"+id])return;if(S.coins<price){pop("Need "+(price-S.coins)+" more coins");return}
    S.coins-=price;S.spent=(S.spent||0)+price;S.owned["pc_"+id]=true;
    /* put it straight on, as the clothes Shop does: on your creature, or on the first dog you have */
    var who=it.pet==="dogs"?["pluto","chopstick"].filter(function(d){return pzDogs()[d]})[0]:(petMine()&&petMine().k===it.pet?it.pet:null);if(who)pzSetWear(who,pzSlot(it.kind),id);
    try{qbSnd("buy")}catch(x){}render();persist();pop("Bought "+(PCNAME[id]||[id])[0]+".");return}
  if(a==="pzwear"){var who2=b.dataset.who,it2=pzCl()[id];if(!it2||!S.owned["pc_"+id])return;var sl=pzSlot(it2.kind);pzSetWear(who2,sl,pzWorn(who2)[sl]===id?null:id);render();persist();return}});
function pzSetWear(who,slot,id){var dog=who==="pluto"||who==="chopstick",o=dog?(S.dogw=S.dogw||{}):(S.petw=S.petw||{});o[who]=o[who]||{};if(id)o[who][slot]=id;else delete o[who][slot]}
(function(){var st=document.createElement("style");st.textContent=
  '.pz-img img.pz-fr{width:88%;height:88%;object-fit:contain}.pz-adopt{margin-top:2px;font-size:12px}'
  +'.pz-stage{display:flex;gap:2%;overflow:hidden;justify-content:center;align-items:flex-end;background:var(--pad);border-radius:14px;padding:12px}.pz-stage img{width:32%;height:auto;max-height:180px;object-fit:contain}'
  +'.pz-cpic,.pz-crypic{display:flex;justify-content:center;background:var(--pad);border-radius:14px;padding:10px;margin:6px 0}.pz-cpic img{height:150px}.pz-crypic img{height:190px}'
  +'.pz-cl .qs-img img.pz-front{position:absolute;inset:8%}.pz-cry h3{text-align:center}.pz-cl.own .qs-img{outline:2px solid var(--line)}';
  document.head.appendChild(st)})();
/* a creature's bed in a room (27_rooms.js: the Bedroom's window corner, the Patio's spot by the fire), at the dog beds' footprint and
   the frames' scale; a low platform, so the pet asleep on it is drawn on the cushion. false without a creature or its art */
function pzBed(C,x,y){var mine=petMine(),D=pzData();if(!mine||!D||!D.pets[mine.k]||!window.LFSPR)return false;var b=D.pets[mine.k].bed,k="pbed_"+mine.k;
  if(!LFSPR[k])LFSPR[k]={w:b.w,h:b.h,u:pzArt(k)};
  lfSpr(C,k,x,y,1.2,1.0,{h:6,ctr:1,H:b.h*PZ_K,dk:.5});C.plat.push({x0:x,y0:y,x1:x+1.2,y1:y+1.0,z:Math.round(b.sleepOff*PZ_K),key:x+1.2+y+1.0+.01});return true}
