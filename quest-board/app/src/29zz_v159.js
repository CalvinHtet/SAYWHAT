/* ---------- Cal 2026-11-25: a sleeker Shop, four picture doors, and one Interface shop ----------
   Cal: "The shop color can be a sleeker color rather than this cream or pastel white color. The text is also white so it's very hard
   to see. Instead of two text boxes for street shop and stylist, can you turn this into a square button where there is a picture of a
   street of clothing stores and then the stylist could be a barber shop. The bottom left will be the 'Interface' shop for the banners
   and upgrades/interface upgrades once the hero console is unlocked. Remove the separate upgrade tab I originally had planned and just
   place everything that can be purchased onto the shop. Eventually there will be a pet shop on the bottom right and that will make a
   perfect 4 square menu."
   - Colour: the Shop's own screens (home, Closet, Stylist, Interface, Pet Store) are dark: night-blue paper, light ink, dark cards.
     A brand's room keeps the brand's own colours behind the same dark cards. The wells that pictures of clothes sit in stay light,
     so a black piece still reads.
   - Home: a 2 x 2 grid of square doors. Street Shop (top left), Stylist (top right), Interface (bottom left), Pet Store (bottom
     right, only once the player has it: nothing is shown before). Each is ROOMS's picture (art/app/ui_shop_<street|stylist|iface|
     pets>.webp) with its name over the bottom; until a picture is in the build the door is a dark panel with a line drawing. The
     Vault's one-day door is a wide one above the grid.
   - Interface: the card's banners (they leave the Stylist, which is Cosmetics only), and, once the Lair's console is owned, the
     permanent Upgrades and the Interface pieces. The bottom bar's Upgrades tab is gone; the console's screen opens this instead.
   - "Backdrop" is "banner" wherever a player reads it (Cal's word for it). */
var V59TAB="ban";
function v59Art(k){try{var n="ui_shop_"+k+".webp",D=window.QBLoft&&QBLoft.data;return (window.QBART&&QBART[n])||(D&&D.arthash&&D.arthash[n]?D.loft.artBase+n+"?h="+D.arthash[n]:null)}catch(e){return null}}
var V59IC={street:'<path d="M3 21h18"/><path d="M4 21V10l4-4 4 4v11"/><path d="M12 21V8l4-3 4 3v13"/><path d="M7 13h2M7 17h2M15 12h2M15 16h2"/>',
  stylist:'<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.4L20 18M8.2 15.6L20 6"/>',
  iface:'<path d="M4 6h10"/><path d="M18 6h2"/><circle cx="16" cy="6" r="2"/><path d="M4 12h4"/><path d="M12 12h8"/><circle cx="10" cy="12" r="2"/><path d="M4 18h12"/><circle cx="18" cy="18" r="2"/>',
  pets:'<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M8 17c0-2.5 1.8-5 4-5s4 2.5 4 5c0 1.6-1.4 2.4-4 2.4S8 18.600 8 17z"/>',
  vault:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v1M12 14v1M9 12h1M14 12h1"/>'};
function v59Door(k,name,sub,bang,wide){var u=v59Art(k);
  return '<button type="button" class="shub-sq shub-'+k+(wide?' wide':'')+(u?' has-art':'')+'" data-shub="'+k+'"'+(u?' style="background-image:url(&quot;'+esc(u)+'&quot;)"':'')+'>'
    +(u?'':'<span class="sq-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+V59IC[k]+'</svg></span>')
    +'<span class="sq-lab"><b>'+name+(bang?'<i class="qs-flnew" aria-label="New">!</i>':'')+'</b><small>'+sub+'</small></span></button>'}
function v59Home(h){var sub=function(k){var m=new RegExp('data-shub="'+k+'"><b>[\\s\\S]*?</b><small>([\\s\\S]*?)</small>').exec(h);return m?m[1]:null},bang=function(k){return new RegExp('data-shub="'+k+'"><b>[^<]*<i class="qs-flnew"').test(h)};
  var st=sub("street"),va=sub("vault"),pe=sub("pets"),con=false;try{con=sysHas()}catch(e){}
  var g=(va!==null?v59Door("vault","The Vault",va,1,1):"")+'<div class="shub-grid">'+v59Door("street","Street Shop",st||"This week&rsquo;s brands",bang("street"))+v59Door("stylist","Stylist","Hair, eyes, tattoos and scars",0)
    +v59Door("iface","Interface",con?"Banners, upgrades and interface":"Banners for your player card",0)+(pe!==null?v59Door("pets","Pet Store",pe,0):'<span class="shub-sq empty" aria-hidden="true"></span>')+'</div>';
  return h.replace(/<div class="shub-tiles">[\s\S]*?<\/div>/,g)}
function v59Iface(base){var head=(/<header class="qs-top qs-head">[\s\S]*?<\/header>/.exec(base)||[""])[0].replace(/<small class="qs-when">[\s\S]*?<\/small>/,""),dev=(/<p class="qs-dev">[\s\S]*?<\/p>/.exec(base)||[""])[0],con=false;try{con=sysHas()}catch(e){}
  if(!con)V59TAB="ban";var t=V59TAB,tab=function(k,n){return '<button class="qs-tab'+(t===k?" on":"")+'" data-act="iftab" data-v="'+k+'">'+n+'</button>'},body="";
  if(t==="ban")body=pcShop();
  else{var o=SXTAB;SXTAB=t==="ifc"?"interface":"upgrades";try{var sx=sxHtml(),a=sx.indexOf("</nav>");body=a>=0?sx.slice(a+6).replace(/<\/div>$/,""):""}finally{SXTAB=o}}
  return '<div class="qshop sxv shub-in shub-iface">'+head+'<div class="qs-bar shub-bar"><button type="button" class="shub-back" data-shub="home">&lsaquo; Shop</button><b class="shub-title">Interface</b></div>'
    +(con?'<nav class="qs-tabs" aria-label="Interface sections">'+tab("ban","Banners")+tab("upg","Upgrades")+tab("ifc","Interface")+'</nav>':'')+body+dev+'</div>'}
var v59Shop=shopHtml;shopHtml=function(){if(SHUB==="iface"){var keep=SHUB,base;SHUB="home";try{base=v59Shop.apply(this,arguments)}finally{SHUB=keep}try{return v59Iface(base)}catch(e){SHUB="home"}}
  if(shopTab==="basics")STYTAB="cos";var h=v59Shop.apply(this,arguments);
  try{if(/class="qshop shub"/.test(h))h=v59Home(h);
    /* the Stylist is Cosmetics only: its one-tab row goes */
    h=h.replace(/<nav class="qs-tabs sty-tabs"[\s\S]*?<\/nav>/,"")}catch(e){}
  return h};
function v59Banners(){STYTAB="cos";PCTRY=PCTRY||"";SHUB="iface";V59TAB="ban";window._qsSeen=1;view="shop";render();window.scrollTo(0,0)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=iftab]");if(!b)return;e.preventDefault();V59TAB=b.dataset.v==="upg"?"upg":b.dataset.v==="ifc"?"ifc":"ban";render();window.scrollTo(0,0)},true);
/* the bottom bar has no Upgrades tab; the console's screen and anything else that opened it land in the Shop's Interface */
var v59Gate=areaGate;areaGate=function(id){if(id==="sys")return true;return v59Gate.apply(this,arguments)};
sysOpen=function(tab){try{closeModals()}catch(e){}V59TAB=tab==="interface"?"ifc":"upg";SHUB="iface";window._qsSeen=1;view="shop";render();window.scrollTo(0,0)};
var v59View=viewHtml;viewHtml=function(v){if(v==="sys"){view="shop";SHUB="iface";return v59View.call(this,"shop")}return v59View.apply(this,arguments)};
/* the Shop's own screens are dark; a brand's room keeps the brand's colours */
var v59Theme=qsTheme;qsTheme=function(b){var r=v59Theme.apply(this,arguments);try{if(!b||SHUB==="home"||SHUB==="iface"){/* the home screen and Interface are the Shop's own, whatever brand tab is remembered */var st=document.body.style;st.setProperty("--shopbg","linear-gradient(180deg,#151b31 0%,#0b0e1a 70%)");st.setProperty("--shopfg","#eef1f8");st.setProperty("--shopsolid","#0b0e1a")}}catch(e){}return r};
/* the app's own stylesheet comes after the ones added here, so each selector gets "html " in front to win over its light rules */
function v59Up(css){return css.replace(/(^|})([^{}]+)\{/g,function(m,a,sel){return a+sel.split(",").map(function(x){return "html "+x.trim()}).join(",")+"{"})}
htabCss("qb-shopdark-css",v59Up(
  ".qshop{--ink:#eef1f8;--soft:#a3a9bd;--line:#2b3046;--pad:#1b2033;--well:#dfe3ec;--cardbg:#141829}body.shopmode{background:var(--shopbg,#0b0e1a)!important}body.shopmode .nav{background:linear-gradient(180deg,transparent,var(--shopsolid,#0b0e1a) 42%)!important}"
  +".qs-coin,.qs-tab,.qs-mirror,.qs-card,.qshop .card.panel,.qshop .item,.qshop .btn.ghost,.qs-wdc,.qs-mark{background:var(--cardbg);color:var(--ink)}"
  +".qs-tab.on,.qs-wdc.on{background:var(--ink);border-color:var(--ink);color:#0b0e1a}.qs-btn{background:var(--ink);border-color:var(--ink);color:#0b0e1a}.qs-btn.alt{background:transparent;color:var(--ink)}.qs-btn.ghost{background:transparent;border-color:var(--line);color:var(--soft)}"
  +".qs-img,.qs-glass,.qshop .thumb{background:var(--well)}.qs-card p,.qs-worn small{color:var(--soft)}.qs-card.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}.qs-mirror{box-shadow:0 8px 22px rgba(0,0,0,.35)}"
  +"body.shopmode .qs-top,body.shopmode .qs-top h1,body.shopmode .qs-top small,body.shopmode .qs-sec>h3,body.shopmode .qs-note,body.shopmode .qs-lead,body.shopmode .qs-dev,body.shopmode .qs-empty,body.shopmode .qs-bar .qs-cd{color:var(--shopfg,#eef1f8)}"
  +".shub-back,.shub-title{color:var(--shopfg,#eef1f8)}.shub-back{border-color:rgba(255,255,255,.22)}.qs-link{color:var(--ink)}"
  /* the doors */
  +".shub-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 16px}.shub-sq{position:relative;aspect-ratio:1;padding:0;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.16);background:#141829 center/cover no-repeat;color:#fff;cursor:pointer;font:inherit;text-align:left;box-shadow:0 10px 26px rgba(0,0,0,.4);-webkit-tap-highlight-color:transparent}"
  +".shub-sq:active{transform:scale(.98)}.shub-sq:focus-visible{outline:2px solid #7cf0ff;outline-offset:2px}.shub-sq.empty{visibility:hidden}.shub-sq.wide{display:block;width:100%;aspect-ratio:auto;min-height:92px;margin:0 0 12px}"
  +".shub-sq.shub-street{background-color:#13233a;background-image:radial-gradient(120% 90% at 20% 0%,#1d4466 0%,#13233a 55%,#0c1422 100%)}.shub-sq.shub-stylist{background-color:#2a1638;background-image:radial-gradient(120% 90% at 80% 0%,#5a2a6e 0%,#2a1638 55%,#140c1e 100%)}"
  +".shub-sq.shub-iface{background-color:#14263a;background-image:radial-gradient(120% 90% at 20% 100%,#1f4a5a 0%,#14263a 55%,#0b1420 100%)}.shub-sq.shub-pets{background-color:#16301f;background-image:radial-gradient(120% 90% at 80% 100%,#2c6142 0%,#16301f 55%,#0b1811 100%)}.shub-sq.shub-vault{background-color:#3a2a10;background-image:linear-gradient(135deg,#6a4a14,#2a1c0a);border-color:#ffc857}"
  +".sq-ic{position:absolute;left:0;right:0;top:12%;display:flex;justify-content:center;color:rgba(255,255,255,.82)}.sq-ic svg{width:46%;height:auto}.shub-sq.wide .sq-ic{left:auto;right:16px;top:50%;transform:translateY(-50%)}.shub-sq.wide .sq-ic svg{width:54px}"
  +".sq-lab{position:absolute;left:0;right:0;bottom:0;display:grid;gap:3px;padding:26px 12px 12px;background:linear-gradient(180deg,rgba(6,8,16,0),rgba(6,8,16,.86) 46%)}.sq-lab b{display:flex;align-items:center;gap:8px;font-size:1.06em;letter-spacing:.02em;color:#fff}.sq-lab small{color:rgba(255,255,255,.82);font-size:.8em;line-height:1.25}.sq-lab .qs-flnew{position:static;flex:none}"
  +".shub-sq.wide .sq-lab{position:relative;background:none;padding:18px 84px 18px 16px}"
  +".qshop.shub-iface .shub-title{color:#8fe3ff}"));
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV159={hub:function(){return SHUB},tab:function(k){if(k)V59TAB=k;return V59TAB},art:v59Art,banners:v59Banners,sysOpen:function(t){return sysOpen(t)}};
