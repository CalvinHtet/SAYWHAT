/* ---------- Cal 2026-11-25: every brand in one rotation, the pricier ones cheaper and less often; the Goals button ----------
   Cal: "All brands ... rotate across the shop at the same time instead of being level locked", then "But the ones that cost more
   should come to the shop at a later date so that we can rack up more coins", and picked "1. Cheaper and less often, but not too rare.
   When they come into the shop, I want their brand banner in the background to feel special and extend all the way to the bottom of
   the shop rather than just a gradient like the street shops."
   - ECON.floors (29e_economy.js): no floor has a level; the Boutique drops one brand each Monday, the Atelier every other Friday.
     ECON.clothFloor: the Boutique about 2x the Street, the Atelier about 3x.
   - The Street Shop shows every live brand in one row of tabs (newest first), whatever its floor; no Street / Boutique tabs. The
     countdown is the next drop on any floor. A Boutique or Atelier brand's tab has a small diamond.
   - A Boutique or Atelier brand's room: its picture covers the whole page, top to bottom, held still while the rack scrolls (its tall
     picture ui_banner_<id>_p.webp when ROOMS has made one, else the wide one), under the brand's sparkles.
   - An owner of a Boutique or Atelier piece bought at the old price gets the difference back, once (S.v67ref).
   Cal: "Remove the Next: text box and just incorporate it into a Goals button under the class name on the main board next to the
   profile picture. Goals for the entire platform should be here, not just the loft goals."
   - The profile loses its NEXT line (29zz_v165.js). The Board's header gets a Goals button under the name, coins and rank, with
     the count of things ready (goals to claim, the scratch card, a waiting trial). It opens one window: what to do next, the level,
     the trial, the Daily Quest, the Weekly Quest, the scratch card and every building's goals (each opens that building's list,
     where they are claimed, as before).
   Cal: "In the shops my character is cut off a little bit": the try-on card's character is fitted to its frame by its drawn pixels
   (v64Box), so a hat, hair or shoes never touch the edge. */

/* ---- one row of brands ---- */
function v67All(){try{var d=dropState(),L=[];Object.keys(d.floors||{}).forEach(function(k){L=L.concat((d.floors[k]||{}).live||[])});
    if(d.back&&!L.some(function(b){return b.id===d.back.id}))L.push(d.back);
    return L.slice().sort(function(a,b){return a.start<b.start?1:a.start>b.start?-1:0})}catch(e){return []}}
function v67Prem(id){try{return brandFloor(id)!=="street"}catch(e){return false}}
function v67Next(){try{var d=dropState(),t=null;Object.keys(d.floors||{}).forEach(function(k){var n=(d.floors[k]||{}).next;if(n){var s=dropStart(n.start);if(t==null||s<t)t=s}});return t==null?null:t-d.n}catch(e){return null}}
var v67Shop=shopHtml;shopHtml=function(){
  var street=false;try{street=SHUB!=="home"&&shubOf()==="street"}catch(e){}
  if(street){try{var A=v67All(),vb=shubVault(),L=A.filter(function(b){return !vb||b.id!==vb.id});
      if(L.length&&(!window._qsSeen||!L.some(function(b){return b.id===shopTab}))){shopTab=L[0].id;window._qsSeen=1}
      var cur=L.filter(function(b){return b.id===shopTab})[0];if(cur)QSFLOOR=brandFloor(cur.id)}catch(e){}}
  var h=v67Shop.apply(this,arguments);if(!street)return h;
  try{var A2=v67All(),vb2=shubVault(),L2=A2.filter(function(b){return !vb2||b.id!==vb2.id});
    h=h.replace(/<nav class="qs-tabs qs-floors"[\s\S]*?<\/nav>/,"");
    var tabs=L2.map(function(b){return '<button class="qs-tab'+(shopTab===b.id?" on":"")+(v67Prem(b.id)?" v67p":"")+'" data-act="stab" data-v="'+esc(b.id)+'">'+(v67Prem(b.id)?'<i class="v67dia" aria-hidden="true"></i>':'')+esc(b.name)+'</button>'}).join("");
    h=h.replace(/(<nav class="qs-tabs" aria-label="Shop sections">)[\s\S]*?(<\/nav>)/,function(m,a,z){return a+tabs+z});
    var ms=v67Next();if(ms!=null)h=h.replace(/(<small class="qs-cd">)[\s\S]*?(<\/small>)/,function(m,a,z){return a+"New brand in "+cdTxt(ms)+z});
    if(v67Prem(shopTab)&&/class="qshop[^"]*v60room/.test(h)){var art=null;try{art=(window.QBART&&(QBART["ui_banner_"+shopTab+"_p.webp"]||QBART["ui_banner_"+shopTab+".webp"]))||null}catch(e){}
      if(art)h=h.replace(/class="qshop([^"]*)v60room"/,'class="qshop$1v60room v67room"').replace(/(<div class="qshop[^"]*v67room">)/,'$1<div class="v67bg" aria-hidden="true" style="background-image:linear-gradient(180deg,rgba(8,10,18,.42) 0,rgba(8,10,18,.12) 22%,rgba(8,10,18,.2) 55%,rgba(8,10,18,.62) 100%),url(&quot;'+art+'&quot;)"></div>')}}catch(e){}
  return h};
/* the page behind a Boutique brand's room: dark, so nothing shows past its picture */
var v67Theme=qsTheme;qsTheme=function(b){var r=v67Theme.apply(this,arguments);
  try{if(b&&v67Prem(b.id)&&SHUB!=="home"&&SHUB!=="iface"&&window.QBART&&(QBART["ui_banner_"+b.id+"_p.webp"]||QBART["ui_banner_"+b.id+".webp"])){var st=document.body.style;st.setProperty("--shopbg","#07090f");st.setProperty("--shopsolid","rgba(7,9,15,.92)")}}catch(e){}return r};

/* ---- the old price back, once ---- */
function v67Refund(){try{if(!loaded||!S||!S.created||S.v67ref)return;var back=0,n=0;
    SHOP.forEach(function(it){var w=CLOTHWAS[it[0]];if(!w||!S.owned||!S.owned[it[0]]||!(w[0]>w[1])||!(w[1]>0))return;var now=+it[3]||0,was=Math.round(now*w[0]/w[1]/10)*10;if(was>now){back+=was-now;n++}});
    S.v67ref=Date.now();if(back>0){S.coins=(S.coins||0)+back;try{pop("Boutique prices dropped: +"+back.toLocaleString()+" coins back for "+n+" piece"+(n>1?"s":""))}catch(e){}}
    persist()}catch(e){}}
setInterval(v67Refund,4000);setTimeout(v67Refund,1500);

/* ---- Goals: one window for everything ---- */
function v67Goals(){var out=[],ready=0;
  try{var g=gated(),dqOn=!(typeof calmOn==="function"&&calmOn()&&calmDay()<2),open=(S.quests||[]).filter(function(q){return q&&!S.done[q.id]});
    if(g!==null){out.push({k:"trial",t:"Pass your level trial",s:"It holds your levelling until you do.",go:'data-act="char" data-v65="gate"',ready:1});ready++}
    else if(!open.length)out.push({k:"tasks",t:"Add today's tasks",s:"Every one pays XP and coins.",go:'data-v67="add"'});
    var L=effLvl(),into=Math.max(0,(S.xp||0)-cum(L)),nd=need(L);
    out.push({k:"level",t:"Reach level "+(L+1),s:Math.max(0,nd-into).toLocaleString()+" XP to go",fr:nd>0?Math.min(1,into/nd):0});
    if(dqOn&&typeof dqGoal==="function"){var x=dqXp(),gl=dqGoal();if(gl)out.push({k:"dq",t:"Daily Quest",s:x>=gl?"Done today":(gl-x)+" XP of tasks to go",fr:Math.min(1,x/gl),done:x>=gl})}
    if(typeof wqState==="function"){var w=wqState();out.push({k:"wq",t:"Weekly Quest",s:w.paid?"Done this week":w.n+" of "+ECON.wqDays+" active days",fr:Math.min(1,w.n/ECON.wqDays),done:!!w.paid})}
    if(typeof scReady==="function"&&typeof zxOpen==="function"&&zxOpen("wheel")){var c=scState(),n=scTasks();
      if(c.done)out.push({k:"sc",t:"Scratch card",s:"Scratched today. A new one tomorrow.",done:1});
      else if(scReady()){out.push({k:"sc",t:"Scratch card",s:"Today's card is ready.",go:'data-act="nav" data-v="wheel"',ready:1});ready++}
      else out.push({k:"sc",t:"Scratch card",s:"Finish "+(SCNEED-n)+" more task"+(SCNEED-n===1?"":"s")+" to scratch it.",fr:n/SCNEED})}
    (typeof BLD!=="undefined"?BLD:[]).forEach(function(B,bi){var G;try{G=glList(bi)}catch(e){G=[]}if(!G.length)return;var r=G.filter(function(q){return q.met&&!q.got}).length,nx=G.filter(function(q){return !q.met})[0];
      ready+=r;out.push({k:"b"+bi,t:B.name+" goals",s:r?r+" ready to claim":nx?nx.txt+(nx.prog?" · "+nx.prog:""):"All done",fr:nx&&nx.fr!=null?nx.fr:null,go:'data-gl="open" data-b="'+bi+'"',ready:r,done:!r&&!nx})})}catch(e){}
  return {list:out,ready:ready}}
function v67GoalsHtml(){var G=v67Goals();
  return '<div class="card box2 v67g"><h2>Goals</h2><div class="v67list">'+G.list.map(function(q){var tag=q.go?"button":"div";
    return '<'+tag+(q.go?' type="button" '+q.go:'')+' class="v67row'+(q.ready?' ready':'')+(q.done?' done':'')+'" data-k="'+q.k+'"><span class="v67tx"><b>'+esc(q.t)+'</b><small>'+esc(q.s)+'</small>'
      +(q.fr!=null&&!q.done?'<i class="stybar"><i style="width:'+Math.round(q.fr*100)+'%"></i></i>':'')+'</span>'+(q.ready?'<i class="v67n">'+(q.ready>1?q.ready:"!")+'</i>':q.done?'<span class="v67ck" aria-label="Done">&#10003;</span>':q.go?'<span class="v67go" aria-hidden="true">&rsaquo;</span>':'')+'</'+tag+'>'}).join("")
    +'</div><div class="btns"><button class="btn ghost" data-act="mclose">Close</button></div></div>'}
function v67Open(){try{closeModals()}catch(e){}var m=modal(v67GoalsHtml());if(m)m.classList.add("v67modal")}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v67]");if(!b)return;e.preventDefault();e.stopPropagation();
  if(b.dataset.v67==="goals"){v67Open();return}
  if(b.dataset.v67==="add"){try{closeModals()}catch(x){}setTimeout(function(){var i=document.querySelector("#cap");if(i){i.scrollIntoView({block:"center"});i.focus()}},60)}},true);
/* a row that opens something else closes the Goals window first */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".v67modal .v67row[data-act]");if(!b)return;try{var m=b.closest(".modal");if(m)m.remove()}catch(x){}},true);
/* the Board's header: Goals under the name, the coins and the rank */
var v67Board=boardHtml;boardHtml=function(){var h=v67Board.apply(this,arguments);
  try{var n=v67Goals().ready,btn='<button type="button" class="v67btn" data-v67="goals" aria-label="Goals'+(n?', '+n+' ready':'')+'"><i class="v67ic" aria-hidden="true"></i>Goals'+(n?'<i class="v67n">'+n+'</i>':'')+'</button>';
    var d=document.createElement("div");d.innerHTML=h;var col=d.querySelector(".strip .v9col")||d.querySelector(".strip .who");if(col){col.insertAdjacentHTML("beforeend",btn);h=d.innerHTML}}catch(e){}
  return h};

/* ---- the try-on card's character fits its frame ---- */
function v67Fit(im){try{var gl=im.closest(".qs-glass");if(!gl||gl.classList.contains("qs-face"))return;im.style.transform="";var b=v64Box(im);if(!b)return;
    var G=gl.getBoundingClientRect(),R=im.getBoundingClientRect();if(G.width<10||R.height<10)return;var m=Math.max(3,G.height*.05),
      dw=(b[2]-b[0])*R.width,dh=(b[3]-b[1])*R.height,s=Math.min(1,(G.width-2*m)/dw,(G.height-2*m)/dh),
      cx=R.left+(b[0]+b[2])/2*R.width,by=R.top+b[3]*R.height,ty=R.top+b[1]*R.height,dx=(G.left+G.width/2)-cx,dy=0;
    /* scaled about the feet; then the drawn figure is centred across, and held inside top and bottom */
    var top=by-(by-ty)*s;if(by>G.bottom-m)dy=G.bottom-m-by;else if(top<G.top+m)dy=G.top+m-top;
    im.style.transformOrigin=(cx-R.left).toFixed(1)+"px "+(by-R.top).toFixed(1)+"px";
    im.style.transform="translate("+dx.toFixed(1)+"px,"+dy.toFixed(1)+"px)"+(s<.999?" scale("+s.toFixed(3)+")":"")}catch(e){}}
function v67FitAll(){[].forEach.call(document.querySelectorAll(".qs-glass img"),v67Fit)}
document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.closest&&t.closest(".qs-glass"))v67Fit(t)},true);
var v67Render=render;render=function(){var r=v67Render.apply(this,arguments);setTimeout(v67FitAll,0);return r};
window.addEventListener("resize",v67FitAll);

htabCss("qb-v167-css",".v67btn{display:inline-flex;align-items:center;gap:7px;padding:6px 12px 6px 10px;border-radius:999px;border:1px solid var(--line,#3a2a22);background:rgba(0,0,0,.28);color:var(--fg,#fff);font:inherit;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}"
  +".v67ic{width:14px;height:14px;border-radius:50%;border:2px solid currentColor;box-shadow:inset 0 0 0 2px transparent;position:relative;flex:none}.v67ic::after{content:\"\";position:absolute;inset:3px;border-radius:50%;background:currentColor}"
  +".v67n{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#ff4d5e;color:#fff;font-style:normal;font-size:11px;letter-spacing:0;line-height:1}"
  +".v67g h2{margin:0 0 12px}.v67list{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}"
  +".v67row{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:1px solid var(--line,#3a2a22);background:var(--surface,rgba(255,255,255,.03));color:var(--fg,#fff);font:inherit;text-align:left}"
  +"button.v67row{cursor:pointer}.v67row.ready{border-color:#ff8a3d}.v67row.done{opacity:.6}.v67tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.v67tx b{font-size:15px}.v67tx small{opacity:.78;font-size:13px;overflow-wrap:anywhere}"
  +".v67tx .stybar{margin-top:6px}.v67ck{color:#4de8b0;font-weight:700}.v67go{font-size:22px;opacity:.6}"
  +".qs-tab.v67p .v67dia{display:inline-block;width:7px;height:7px;margin-right:7px;transform:rotate(45deg) translateY(-1px);background:linear-gradient(135deg,#ffe7a3,#c9973f);box-shadow:0 0 6px rgba(255,214,120,.7)}"
  +".qshop.v67room .v67bg{position:fixed;inset:0;z-index:-2;pointer-events:none;background-size:cover,cover;background-position:center top,center top;background-repeat:no-repeat}"
  +"@media (max-width:370px){.v67btn{padding:4px 10px 4px 8px;font-size:12px;gap:6px}.strip .v9col{gap:6px}}"
  +".qs-glass{overflow:hidden}.qs-glass img{will-change:transform}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV167={all:v67All,next:v67Next,goals:v67Goals,open:v67Open,refund:v67Refund,fit:v67FitAll,prem:v67Prem};
