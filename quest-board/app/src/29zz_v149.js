/* ---------- Cal's 2026-11-24 list, batch 3: the Shop's layout (docs/specs/2026-11-24_SPEC_cal_list.md item 13) ----------
   Cal: "The Street shop, Pet Store, and Stylist should be the 3 buttons on the top of the shop. Next to the player card, should be Closet
   instead of wardrobe. When opening Street Shop, the other buttons disappear and the brand names of this weeks shop drops appear up
   top", and "in the shop, the interface and upgrades tab should be moved into its own tab on the bottom once we unlock the hero lair's
   console" (that part was done in v1.31, 29zz_v131.js: the Upgrades tab).
   - The Shop opens on a home screen: the player's character, Closet beside it, and the big buttons Street Shop, Pet Store (only once
     the player has it: nothing is shown before, it is a surprise) and Stylist.
   - Street Shop: a back button, then what the Shop was: its floors and this week's brands across the top, the brand's rack under them.
     No Closet, Stylist or Pets button in there.
   - Stylist, Closet and Pet Store: each its own screen with a back button. The Stylist has its own background colour.
   - "Wardrobe" is "Closet" everywhere a player reads it (the furniture named Wardrobe keeps its name).
   Everything under it is 15_shop.js's shopHtml and its wrappers; this one decides which of its parts to show (SHUB), and anything that
   jumps to a tab of the old Shop (a brand's splash, a sale link, the Loft's closet, "Have a look") still lands on the right screen. */
var SHUB="home",V49KEEP=0;
/* the Vault (Cal 11-24: "the vault is a separate shop that is for 1 day only"): Wednesday's returning brand (29l_drops.js dropBack) is
   its own button on the home screen that day and its own screen; it is no longer a tab among the Street Shop's brands. */
function shubVault(){try{var d=dropState();return d&&d.back?d.back:null}catch(e){return null}}
function shubOf(){if(SHUB==="home")return "home";if(shopTab==="wardrobe")return "closet";var vb=shubVault();if(vb&&shopTab===vb.id)return "vault";if(shopTab==="basics")return "stylist";if(shopTab==="pets")return "pets";return "street"}
function shubPets(){try{return shopFloors().some(function(F){return F.id==="boutique"})}catch(e){return false}}
function shubGo(k){SHUB=k;
  if(k==="closet")shopTab="wardrobe";else if(k==="stylist")shopTab="basics";else if(k==="pets"){QSFLOOR="boutique";shopTab="pets"}
  else if(k==="vault"){var vb=shubVault();if(!vb){SHUB="home"}else{QSFLOOR=vb.fl||QSFLOOR;shopTab=vb.id;window._qsSeen=1}}
  else if(k==="street"){var v2=shubVault();if(shopTab==="wardrobe"||shopTab==="basics"||shopTab==="pets"||(v2&&shopTab===v2.id)){shopTab="";window._qsSeen=0}}
  render();window.scrollTo(0,0)}
var v49Shop=shopHtml;shopHtml=function(){var hub=shubOf(),h;
  if(hub==="street"&&(shopTab==="wardrobe"||shopTab==="basics"||shopTab==="pets")){shopTab="";window._qsSeen=0}
  h=v49Shop.apply(this,arguments);hub=SHUB==="home"?"home":shubOf();
  try{var head=(/<header class="qs-top qs-head">[\s\S]*?<\/header>/.exec(h)||[""])[0],cd=(/<small class="qs-cd">[\s\S]*?<\/small>/.exec(h)||[""])[0],dev=(/<p class="qs-dev">[\s\S]*?<\/p>/.exec(h)||[""])[0],
      back='<button type="button" class="shub-back" data-shub="home">&lsaquo; Shop</button>',bar=/<div class="qs-bar">[\s\S]*?<\/div>/,floors=/<nav class="qs-tabs qs-floors"[\s\S]*?<\/nav>/,secs=/<nav class="qs-tabs" aria-label="Shop sections">[\s\S]*?<\/nav>/;
    if(hub==="home"){var d=dropState(),fresh=0;try{fresh=brandFresh().length}catch(e){}
      var tile=function(k,t,sub,bang){return '<button type="button" class="shub-tile shub-'+k+'" data-shub="'+k+'"><b>'+t+(bang?'<i class="qs-flnew" aria-label="New">!</i>':'')+'</b><small>'+sub+'</small><span aria-hidden="true">&rsaquo;</span></button>'};
      return '<div class="qshop shub"><header class="qs-top qs-head">'+head.replace(/^<header[^>]*>|<\/header>$/g,"").replace(/<small class="qs-when">[\s\S]*?<\/small>/,"")+'</header>'
        +'<div class="shub-me"><div class="shub-char">'+qsMirror()+'</div><button type="button" class="qs-tab shub-closet" data-shub="closet">Closet</button></div>'
        +'<div class="shub-tiles">'+tile("street","Street Shop",cd?cd.replace(/<\/?small[^>]*>/g,""):"This week&rsquo;s brands",fresh>0)
        +(function(){var vb=shubVault();return vb?tile("vault","The Vault","Open today only: "+esc(vb.name)+" is back",1):""})()
        +(shubPets()?tile("pets","Pet Store","Companions and what they wear",0):"")
        +tile("stylist","Stylist","Hair, colour and eyes",0)+'</div>'+dev+'</div>'}
    var vbk=shubVault();
    if(hub==="vault"){h=h.replace(bar,'<div class="qs-bar shub-bar">'+back+'<b class="shub-title">The Vault</b></div>').replace(floors,"").replace(secs,"").replace('<div class="qshop">','<div class="qshop shub-in shub-vault">');return h}
    if(hub==="street"&&vbk)h=h.replace(new RegExp('<button class="qs-tab[^"]*" data-act="stab" data-v="'+vbk.id.replace(/[^a-z0-9_-]/gi,"")+'">[\\s\\S]*?<\\/button>'),"");
    if(hub==="street"){h=h.replace(bar,'<div class="qs-bar shub-bar">'+back+cd+'</div>').replace(/<button class="qs-tab[^"]*" data-act="stab" data-v="(basics|pets|wardrobe)">[\s\S]*?<\/button>/g,"");return h}
    var title=hub==="closet"?"Closet":hub==="stylist"?"Stylist":"Pet Store";
    h=h.replace(bar,'<div class="qs-bar shub-bar">'+back+'<b class="shub-title">'+title+'</b></div>').replace(floors,"").replace(secs,"").replace('<div class="qshop">','<div class="qshop shub-in shub-'+hub+'">');
  }catch(e){}
  return h};
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-shub]");if(t){e.preventDefault();e.stopPropagation();shubGo(t.dataset.shub);return}
  /* the bottom bar's Shop button opens the home screen; anything else that picks a tab or a floor leaves it */
  /* QA 11-24 (v1.47): "Have a look" on a floor's window (29l_drops.js) picks the floor and then clicks the bottom bar's Shop button
     itself; that click must not send the player home (V49KEEP). And closing a brand's window with its x is not a jump anywhere: only
     its "Shop it" (bsgo) leaves the home screen. */
  var n=e.target.closest&&e.target.closest('.nav [data-v="shop"]');if(n){SHUB=Date.now()-V49KEEP<800?"in":"home";return}
  if(e.target.closest&&e.target.closest("[data-flgo]")){V49KEEP=Date.now();SHUB="in";return}
  if(e.target.closest&&e.target.closest('[data-act="stab"],[data-qsfl],[data-act="wardrobe"],[data-act="bsgo"],.dsgo'))SHUB="in"},true);/* .dsgo: the NEW DROP window's "Open Shop" (QA's note on v1.47) */
var v49Wd=wardrobeModal;wardrobeModal=function(){SHUB="in";return v49Wd.apply(this,arguments)};
htabCss("qb-shub-css",".shub-me{display:flex;flex-direction:column;align-items:center;gap:10px;margin:6px 0 14px}.shub-char{width:100%;max-width:260px}.shub-char .qs-bask{display:none}.shub-closet{min-width:140px;min-height:44px}"
  +".shub-tiles{display:grid;gap:10px;margin:0 0 16px}.shub-tile{position:relative;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto auto;align-items:center;text-align:left;gap:2px 10px;padding:16px 18px;min-height:74px;border-radius:16px;border:1px solid var(--line);background:var(--surface,rgba(255,255,255,.04));color:var(--fg,inherit);cursor:pointer;font:inherit}"
  +".shub-tile b{font-size:1.12em;letter-spacing:.02em;display:flex;align-items:center;gap:8px}.shub-tile small{grid-column:1;color:inherit;opacity:.82}.shub-tile span{grid-column:2;grid-row:1 / span 2;font-size:1.6em;opacity:.6}.shub-tile:active{transform:scale(.985)}"
  +".shub-vault{border-color:var(--gold,#ffc857);background:linear-gradient(135deg,rgba(255,200,87,.16),rgba(255,90,40,.08))}.shub-street{border-color:var(--accent,#7cf0ff);background:linear-gradient(135deg,rgba(0,229,255,.10),rgba(255,90,40,.08))}.shub-pets{background:linear-gradient(135deg,rgba(124,255,178,.10),rgba(255,200,87,.07))}.shub-stylist{background:linear-gradient(135deg,rgba(255,61,129,.12),rgba(139,92,255,.10))}"
  +".shub-bar{display:flex;align-items:center;gap:12px}.shub-back{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--fg,inherit);font:inherit;cursor:pointer}.shub-title{font-size:1.05em;letter-spacing:.06em;text-transform:uppercase}"
  /* the Stylist's own colour (Cal: "i want this to be a different color background than the regular shop when clicking into it") */
  +"html[data-view=\"shop\"] .qshop.shub-stylist{margin:-8px -10px 0;padding:8px 10px 18px;border-radius:18px;background:linear-gradient(180deg,rgba(255,61,129,.16),rgba(139,92,255,.12) 45%,rgba(139,92,255,0) 100%)}.qshop.shub-stylist .shub-title{color:#ff8fb8}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV149={hub:function(){return SHUB==="home"?"home":shubOf()},go:shubGo};
