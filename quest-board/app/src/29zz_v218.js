/* ---------- Cal 2026-11-26 (via APPROVALS): the banner shop grouped by style ----------
   Cal: "Organize the banners purchase page so that similar styles are grouped together. Right now, it is tedious to have to scroll down
   to see the bottom banner."
   The Banners page gets a row of style chips (like the Shop's category tabs); one style shows at a time, so nothing is far down. The
   style comes from the banner's id: ink-wash, papercut, glass, the psychedelic and intricate sets (ROOMS's "psy"/"intr" ids), and the
   first painted worlds. It opens on the style of the banner on your card. Sets I and II (from level 30) still split by tier first. */
var V218ST=[["ink","Ink Wash",/ink/],["paper","Papercut",/paper/],["glass","Glass",/glass/],["psy","Psychedelic",/psy|trip|acid|neon_/],["intr","Intricate",/intr|filig|mosaic|lace/],["world","Painted Worlds",/./]];
var V218SEL="";
function v218Style(id){if(id==="studio")return "world";for(var i=0;i<V218ST.length;i++)if(V218ST[i][2].test(id))return V218ST[i][0];return "world"}
var v218Shop=pcShop;pcShop=function(){var h=v218Shop.apply(this,arguments);
  try{var a=h.indexOf('<div class="qs-grid">');if(a<0)return h;var b=h.lastIndexOf("</div></section>");if(b<a)return h;var grid=h.slice(a+21,b),cards=grid.split(/(?=<article class="qs-card pc-bgc)/).filter(function(c){return c.indexOf("<article")===0});
    if(cards.length<5)return h;var by={},order=[];cards.forEach(function(c){var m=/data-card="pcbg_([a-z0-9_]+)"/.exec(c),st=v218Style(m?m[1]:"");if(!by[st]){by[st]=[];order.push(st)}by[st].push(c)});
    if(order.length<2)return h;order.sort(function(x,y){var ix=V218ST.map(function(s){return s[0]}),i=ix.indexOf(x),j=ix.indexOf(y);return i-j});
    var mine="";try{mine=v218Style(pcSt().bg||"studio")}catch(e){}var sel=by[V218SEL]?V218SEL:by[mine]?mine:order[0];
    var chips='<nav class="v218st" aria-label="Banner styles">'+order.map(function(st){var nm=V218ST.filter(function(s){return s[0]===st})[0][1];return '<button class="qs-tab'+(st===sel?" on":"")+'" data-v218="'+st+'">'+nm+' <small>'+by[st].length+'</small></button>'}).join("")+'</nav>';
    return h.slice(0,a)+chips+'<div class="qs-grid">'+by[sel].join("")+h.slice(b)}catch(e){return h}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v218]");if(!b)return;e.preventDefault();e.stopPropagation();V218SEL=b.getAttribute("data-v218");render()},true);
htabCss("qb-v218-css",".v218st{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:8px;scrollbar-width:none;margin:6px 0 10px}.v218st::-webkit-scrollbar{display:none}.v218st .qs-tab{white-space:nowrap;flex:0 0 auto}.v218st small{opacity:.6;margin-left:2px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV218={style:v218Style,html:function(){return pcShop()},sel:function(s){V218SEL=s}};
