/* ---------- Cal's 2026-11-24 list, batch 4: the Stylist's tabs and the player card (docs/specs/2026-11-24_SPEC_cal_list.md 21 to 23) ----------
   Cal: "Give users an option to post their character with their outfits to the town hall. In the profile icon on the town board, there
   should be a button to customize your player card, or even clicking on your character in the shop, should open your player card",
   "You can also see your player card by clicking the player card icon on the top left of the board menu", "On the Stylist tab, there
   should be sub tabs for Cosmetics, Backdrops", "Forget the poses. Just the backdrops are great ideas ... Prices are okay for the
   backdrops", "Can choose to post my profile card on the town hall feed", and Wave as the one greeting on a card.
   - The card: a backdrop, the character standing on it, the companion beside them, and a plate with name, rank, class and level.
   - Backdrops (PCBG): Studio is free and drawn in CSS; the ten others are ROOMS's paintings (art/app/bl_pc_<id>.webp, 3:4, floor in the
     bottom third). One that is not painted yet is simply not on sale (pcHas), so nothing here waits on the art. S.pc = {bg, own}.
     They are bought in the Stylist's Backdrops tab and are never a prize (29zz_v144.js freePool keeps to worn slots).
   - Where it opens: a small card button beside the avatar on the Board, the character on the Shop's home screen, a button in the
     profile, and any player in the Town Hall (their card, with Wave). "Post my card" puts it on the Town board: a board post like any
     other (30_app_b.js snpost), drawn as that player's card.
   - Other players: worlds/<id> carries card = {bg, r rank, c class}; read back through fshSafe, whitelisted. Their companion is drawn
     in its first form whatever this player's own has become (pzFrameInfo has no owner; P2OTHER switches the form off while another
     player's picture is made), which also keeps the change a secret.
   - Cosmetics is the Stylist's rack as it was (cuts, dyes, highlights, eyes). Face tattoos and scars need a new face layer in the rig
     and ROOMS's art; they come with that art. */
var PCBG=[["studio","Studio",0],["neon","Neon Alley",800],["skyline","Skyline Boulevard",1000],["roof","Loft Rooftop",1200],["mist","Mist Gate",1400],["sunrise","Sunrise Court",1600],
          ["maple","Crimson Maple",1800],["fire","Fireworks Night",2000],["lantern","Lantern Sky",2200],["ember","Ember Throne",2400],["moon","Blood Moon",2500]],
    STYTAB="cos",PCTXT="Shared a player card.",P2OTHER=0,PCTRY="";/* PCTRY: a backdrop being looked at on the card before it is bought */
function pcBy(id){return PCBG.filter(function(b){return b[0]===id})[0]||null}
function pcArt(id){try{var n="bl_pc_"+id+".webp",D=window.QBLoft&&QBLoft.data;return (window.QBART&&QBART[n])||(D&&D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:null)}catch(e){return null}}
function pcHas(id){return id==="studio"||!!pcArt(id)}
function pcSt(){var o=S.pc;if(!o||typeof o!=="object")o=S.pc={bg:"studio",own:{}};if(!o.own||typeof o.own!=="object")o.own={};if(!pcBy(o.bg)||!pcHas(o.bg)||(o.bg!=="studio"&&!o.own[o.bg]))o.bg="studio";return o}
function pcMine(){var r="",c="";try{r=RANKS[rankIdx()].n}catch(e){}try{c=S.cls&&CLASSES[S.cls]?CLASSES[S.cls].name:""}catch(e){}return {bg:pcSt().bg,r:r,c:c}}
function pcMe(){var pet=null;try{pet=pzMyPet();if(pet)pet._me=1}catch(e){}return {id:MYUID||"me",me:1,name:(S.char&&S.char.name)||"Player",look:lookOf(),lv:effLvl(),pet:pet,card:pcMine()}}
function pcSafe(c){try{if(!c||typeof c!=="object")return null;var s=function(v){return String(v==null?"":v).replace(/[<>&"']/g,"").slice(0,28)};return {bg:pcBy(c.bg)?c.bg:"studio",r:s(c.r),c:s(c.c)}}catch(e){return null}}
/* another player's companion is always drawn in its first form */
var v52Form=p2Form;p2Form=function(k){return P2OTHER?null:v52Form.apply(this,arguments)};
var v52MyPet=pzMyPet;pzMyPet=function(){var p=v52MyPet.apply(this,arguments);if(p)p._me=1;return p};
var v52Ped=pzPedPic;pzPedPic=function(pet,H){if(pet&&!pet._me){P2OTHER=1;try{return v52Ped.apply(this,arguments)}finally{P2OTHER=0}}return v52Ped.apply(this,arguments)};
function pcHtml(p,H,tryBg){var card=p.me?pcMine():(p.card||{});if(tryBg)card=Object.assign({},card,{bg:tryBg});var bg=pcBy(card.bg)&&pcHas(card.bg)?card.bg:"studio",u=bg==="studio"?null:pcArt(bg),pet="";H=H||200;
  try{if(p.pet)pet=pzPedPic(p.pet,H)}catch(e){}
  var line=[card.r,card.c,"Level "+(p.lv||1)].filter(Boolean).join(" · ");
  return '<div class="pcard pc-'+bg+'"'+(u?' style="background-image:url(&quot;'+esc(u)+'&quot;)"':'')+'><div class="pc-stage"><span class="fsh-fig pc-fig">'+fshChar(p.look,H)+pet+'</span></div>'
    +'<div class="pc-plate"><b>'+esc(p.name||"Player")+'</b><small>'+esc(line)+'</small></div></div>'}
function pcOpen(){closeModals();var p=pcMe(),on=typeof socOn==="function"&&socOn();
  modal('<div class="card box2 pcm"><span class="label">Player card</span>'+pcHtml(p,210)
    +'<div class="row pc-row"><button type="button" class="btn ghost" data-act="pcbgs">Change backdrop</button>'+(on?'<button type="button" class="btn" data-act="pcpost">Post my card</button>':'')+'</div></div>')}
function pcPost(){if(!(typeof socOn==="function"&&socOn())){pop("Posting needs an online save");return}if(Date.now()-SOC.lastPost<15000){pop("Slow down a little");return}SOC.lastPost=Date.now();
  var pt=Date.now(),lk=lookOf();socMine("board",function(d){var a=Array.isArray(d.posts)?d.posts:[];a.unshift({t:pt,text:PCTXT,look:lk,pc:1});d.posts=a.slice(0,10)})
    .then(function(){SOC.posts.unshift({id:MYUID+"|"+pt,from:MYUID,name:(S.char&&S.char.name)||"Neighbor",text:PCTXT,t:pt,look:lk});try{socPublish(true)}catch(e){}try{socPaint()}catch(e){}closeModals();pop("Your card is on the Town board")})
    .catch(function(er){pop("Could not post: "+((er&&er.code)||"error"))})}
/* a card post on the Town board is drawn as that player's card */
var v52Soc=socInner;socInner=function(){var h=v52Soc.apply(this,arguments);
  try{var key="<p>"+esc(PCTXT)+"</p>",parts=h.split(key);if(parts.length<2)return h;var ps=(SOC.posts||[]).filter(function(p){return p.text===PCTXT}),out=parts[0];
    for(var i=1;i<parts.length;i++){var p=ps[i-1],q=null;if(p){q=p.from===MYUID?pcMe():(typeof fshFind==="function"&&fshFind(p.from))||{name:p.name,look:p.look,lv:1}}
      out+=(q?'<div class="pc-post"'+(p.from!==MYUID?' role="button" tabindex="0" data-act="fshview" data-u="'+esc(p.from)+'"':' data-act="pcard"')+'>'+pcHtml(q,150)+'</div>':key)+parts[i]}
    return out}catch(e){return h}};
/* another player's window: their card in place of the plain figure; your own gets "Customize" */
var v52View=fshViewHtml;fshViewHtml=function(p){var h=v52View.apply(this,arguments);
  try{h=h.replace(/<div class="fsh-big">[\s\S]*?<\/div>(?=<h2>)/,'<div class="fsh-big pc-wrap">'+pcHtml(p,200)+'</div>');
    if(p.me)h=h.replace(/<\/div>$/,'<div class="sq-acts"><button type="button" class="btn ghost" data-act="pcbgs">Customize card</button></div></div>')}catch(e){}
  return h};
var v52World=socWorldDoc;socWorldDoc=function(){var d=v52World.apply(this,arguments);try{d.card=pcMine();if(d.pet)d.pet={k:d.pet.k,w:d.pet.w}}catch(e){}return d};
var v52Safe=fshSafe;fshSafe=function(w){var o=v52Safe.apply(this,arguments);try{o.card=pcSafe(w&&w.card)}catch(e){o.card=null}return o};
/* ---- the ways in ---- */
var v52Strip=stripHtml;stripHtml=function(){var h=v52Strip.apply(this,arguments);
  try{h=h.replace(/(<button class="avbtn"[\s\S]*?<\/button>)/,'$1<button type="button" class="pcbtn" data-act="pcard" aria-label="Your player card"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="10" r="2.6"/><path d="M8 17c1-2.4 7-2.4 8 0"/></svg></button>')}catch(e){}
  return h};
var v52Char=charModal;charModal=function(){var r=v52Char.apply(this,arguments);
  try{var t=document.querySelector("#layer .prof .prof-top");if(t&&!t.querySelector("[data-act=pcard]"))t.insertAdjacentHTML("beforeend",'<button type="button" class="btn ghost" data-act="pcard">Player card</button>')}catch(e){}return r};
/* ---- the Stylist: Cosmetics and Backdrops ---- */
function pcShop(){var o=pcSt(),me=pcMe(),list=PCBG.filter(function(b){return pcHas(b[0])});
  var cards=list.map(function(b){var id=b[0],own=id==="studio"||o.own[id],use=o.bg===id,btn;
    if(use)btn='<button class="qs-btn ghost" disabled>On your card</button>';else if(own)btn='<button class="qs-btn alt" data-act="pcuse" data-id="'+id+'">Use</button>';
    else btn='<button class="qs-btn'+(PCTRY===id?" alt":"")+'" data-act="pctry" data-id="'+id+'">'+(PCTRY===id?"Previewing":"Preview")+' &middot; <i class="coin"></i>'+b[2].toLocaleString()+'</button>';
    var u=id==="studio"?null:pcArt(id);
    return '<article class="qs-card pc-bgc'+(use?" on":"")+'" data-card="pcbg_'+id+'"><div class="pcard pc-'+id+' mini"'+(u?' style="background-image:url(&quot;'+esc(u)+'&quot;)"':'')+'></div><h4>'+esc(b[1])+'</h4>'+btn+'</article>'}).join("");
  var T=PCTRY&&pcBy(PCTRY)&&pcHas(PCTRY)&&!o.own[PCTRY]?pcBy(PCTRY):null;if(!T)PCTRY="";
  var bask=T?'<div class="qs-bask pc-bask"><small>Previewing '+esc(T[1])+'</small>'+(S.coins>=T[2]?'<button class="qs-btn" data-act="pccheck" data-id="'+T[0]+'">Buy &middot; <i class="coin"></i>'+T[2].toLocaleString()+'</button>':'<button class="qs-btn ghost" disabled><i class="coin"></i>'+T[2].toLocaleString()+' &middot; need '+(T[2]-S.coins).toLocaleString()+' more</button>')+'<button class="qs-link" data-act="pctry" data-id="">Back to mine</button></div>':"";
  return '<div class="pc-prev">'+pcHtml(me,190,T?T[0]:"")+bask+'</div><section class="qs-sec"><h3>Backdrops</h3><p class="qs-note">Where your character stands on your player card.'+(list.length<2?' More are on their way.':'')+'</p><div class="qs-grid">'+cards+'</div></section>'}
var v52Shop=shopHtml;shopHtml=function(){var h=v52Shop.apply(this,arguments);
  try{if(typeof SHUB==="undefined"||SHUB==="home"||shopTab!=="basics")return h;
    var nav='<nav class="qs-tabs sty-tabs" aria-label="Stylist"><button class="qs-tab'+(STYTAB==="cos"?" on":"")+'" data-act="stytab" data-id="cos">Cosmetics</button><button class="qs-tab'+(STYTAB==="bg"?" on":"")+'" data-act="stytab" data-id="bg">Backdrops</button></nav>';
    var a=h.indexOf('<p class="qs-note qs-lead">A new cut'),b=h.indexOf('<p class="qs-dev">');if(b<0)b=h.lastIndexOf("</div>");if(a<0||b<a)return h;
    h=STYTAB==="bg"?h.slice(0,a)+nav+pcShop()+h.slice(b):h.slice(0,a)+nav+h.slice(a)}catch(e){}
  return h};
document.addEventListener("click",function(e){var c=e.target.closest&&e.target.closest(".shub-char");if(c&&!e.target.closest("button")){e.preventDefault();pcOpen();return}
  var b=e.target.closest&&e.target.closest("[data-act=pcard],[data-act=pcbgs],[data-act=pcpost],[data-act=stytab],[data-act=pctry],[data-act=pccheck],[data-act=pcbuy],[data-act=pcuse]");if(!b)return;e.preventDefault();e.stopPropagation();var a=b.dataset.act,id=b.dataset.id,o=pcSt();
  if(a==="pcard"){pcOpen();return}
  if(a==="pcpost"){pcPost();return}
  if(a==="stytab"){STYTAB=id==="bg"?"bg":"cos";render();return}
  if(a==="pcbgs"){closeModals();if(typeof areaGate==="function"&&areaGate("shop")){pop("Backdrops are in the Shop's Stylist. The Shop opens with the Walk-in Closet.");return}STYTAB="bg";SHUB="in";shopTab="basics";window._qsSeen=1;/* else the Shop's first draw lands on the newest brand (15_shop.js) */view="shop";render();window.scrollTo(0,0);return}
  if(a==="pctry"){PCTRY=PCTRY===id?"":(id||"");render();window.scrollTo(0,0);return}
  var B=pcBy(id);if(!B||!pcHas(id))return;
  if(a==="pccheck"){if(o.own[id]||id==="studio")return;modal('<div class="card box2 qs-confirm"><div class="rm-head"><span class="label">Checkout</span>'+coinPillHtml()+'</div><h3>'+esc(B[1])+'</h3><p class="note">A backdrop for your player card, yours for good.</p><p class="note">Price <b><i class="coin"></i>'+B[2].toLocaleString()+'</b>. You have '+S.coins.toLocaleString()+'.</p><div class="row"><button class="btn" data-act="pcbuy" data-id="'+id+'">Confirm purchase</button><button class="btn ghost" data-act="mclose">Keep looking</button></div></div>');return}
  if(a==="pcbuy"){if(o.own[id]||id==="studio")return;if(S.coins<B[2]){pop("Need "+(B[2]-S.coins)+" more coins");return}closeModals();PCTRY="";S.coins-=B[2];S.spent=(S.spent||0)+B[2];o.own[id]=1;o.bg=id;try{qbSnd("buy")}catch(x){}render();persist();try{socPublish(true)}catch(x){}pop(B[1]+" is on your card.");return}
  if(a==="pcuse"){if(id!=="studio"&&!o.own[id])return;o.bg=id;render();persist();try{socPublish(true)}catch(x){}return}},true);
htabCss("qb-pc-css",".pcard{position:relative;width:100%;max-width:300px;aspect-ratio:3/4;margin:0 auto;border-radius:18px;overflow:hidden;background:#141826 center/cover no-repeat;border:1px solid rgba(255,255,255,.18);box-shadow:0 10px 30px rgba(0,0,0,.45)}"
  +".pcard.pc-studio{background:radial-gradient(120% 70% at 50% 18%,#3a4470 0%,#1a1f38 55%,#0c0e1a 100%)}.pcard.pc-studio::before{content:\"\";position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border-top:1px solid rgba(255,255,255,.12)}"
  +".pc-stage{position:absolute;left:0;right:0;bottom:17%;display:flex;justify-content:center;align-items:flex-end}.pc-fig{display:inline-flex;align-items:flex-end;position:relative}/* QA 11-24: the figure's picture is a wide transparent frame, so left-of-the-figure was off the card; the companion stands inside the frame's left side, where the frame is empty */.pc-fig .fsh-pet{left:21%!important;right:auto}.pc-stage{overflow:hidden}.pc-fig{max-width:100%}"
  +".pc-plate{position:absolute;left:0;right:0;bottom:0;padding:9px 12px 10px;background:linear-gradient(180deg,rgba(8,9,16,0),rgba(8,9,16,.82) 38%);color:#fff;text-align:center;display:grid;gap:2px}.pc-plate b{font-size:1.08em;letter-spacing:.03em}.pc-plate small{font-size:.74em;letter-spacing:.06em;text-transform:uppercase;opacity:.85}"
  +".pcard.mini{max-width:none;border-radius:12px;box-shadow:none}.pc-bgc.on .pcard{outline:2px solid var(--gold,#ffc857)}.pc-prev{margin:4px 0 14px}.pc-bask{display:grid;gap:6px;justify-items:center;margin-top:10px}.pc-row{justify-content:center;margin-top:12px}.pcm{text-align:center}.pc-wrap{display:block}"
  +".pc-post{max-width:210px;margin:8px 0 4px;cursor:pointer}.pc-post .pcard{margin:0}"
  +".pcbtn{flex:none;width:30px;height:30px;margin-left:-14px;margin-right:6px;align-self:flex-end;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--line);background:var(--surface,#14121c);color:var(--fg,inherit);cursor:pointer;position:relative;z-index:1}.pcbtn:hover{border-color:var(--accent)}"
  +".sty-tabs{margin:0 0 10px}.shub-char{cursor:pointer}");
/* ---- face tattoos and scars (Cal: "Cosmetics (which has hairstyles, hair color, eye styles, eye colors, and even face tattoos and
   scars)", "Tribal tattoos are pretty cool. no gang tattoos such as a teardrop or religion based art"). ROOMS's layer: <b>_mark_<id>_
   front.webp, ids t1..t6 and s1..s4, rig slots markT and markS (data/rig.json, src/look.js), icons icon_mark_<id>. One tattoo and one
   scar can be worn together. Each is a Stylist item (slots a_tattoo, a_scar) that exists only once its art is in the build, so the
   Cosmetics tab shows nothing until ROOMS has painted one. Names are placeholders until ROOMS names what it paints (PCMARKN). ---- */
var PCMARKN={},PCMARKP={t:700,s:500};
function pcMarkArt(id){try{var D=window.QBDATA,QA=window.QBART;return ["m","f"].some(function(b){var n=b+"_mark_"+id+"_front.webp";return !!((QA&&QA[n])||(D&&D.arthash&&D.arthash[n]))})}catch(e){return false}}
function pcMarks(){try{[["a_tattoo","Tattoos"],["a_scar","Scars"]].forEach(function(g){
      if(!SLOTS.some(function(x){return x[0]===g[0]}))SLOTS.push(g.slice());if(!QS_GROUPS.some(function(x){return x[0]===g[0]}))QS_GROUPS.push(g.slice());STYLIST[g[0]]=1;try{THUMB[g[0]]=1}catch(e){}
      try{SHOPTABS.forEach(function(t){if(t[0]==="wardrobe"&&t[2].indexOf(g[0])<0)t[2].push(g[0])})}catch(e){}});
    ["t1","t2","t3","t4","t5","t6","s1","s2","s3","s4"].forEach(function(id,i){var sid="bs_mark_"+id;if(SHOP.some(function(x){return x[0]===sid})||!pcMarkArt(id))return;var tat=id.charAt(0)==="t",nm=PCMARKN[id]||[(tat?"Ink No. ":"Scar No. ")+id.slice(1),tat?"Inked for good. Or until you change your mind.":"There is a story behind it."];
      SHOP.push([sid,tat?"a_tattoo":"a_scar",nm[0],PCMARKP[id.charAt(0)],1,nm[1],{basic:{key:tat?"markT":"markS",id:id},b:"basics",icon:"mark_"+id}])})}catch(e){}}
pcMarks();

if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV152={st:pcSt,list:PCBG,has:pcHas,html:pcHtml,me:pcMe,safe:pcSafe,open:pcOpen,tab:function(k){STYTAB=k},txt:PCTXT,marks:pcMarks};
