/* ---------- Cal 2026-11-25: a scratch card you really scratch, and its button by the mailbox ----------
   Cal: "Is there an actual way to scratch this off rather than just tapping the card? If I try to rub my hand on my phone in a
   scratching motion, it scrolls the screen up and down. Instead of its own text box on the board, make this a scratch card icon next
   to the mailbox icon that stays persistent. Going into that menu before completing 3 tasks will still show the scratch card menu, but
   a message that says it is locked until 3 tasks are completed"
   - Scratching: each panel of a live card carries a foil drawn on a canvas. Rubbing a panel rubs the foil away where the finger goes
     (the page does not scroll under a live card: touch-action none on its grid). A stroke belongs to the panel it started on, so a
     wide rub cannot spend a second pick by accident. A panel is one of the three picks from the moment its foil is first rubbed
     (8 px of movement: a plain touch spends nothing), which is when its symbol is fixed and saved, as a tap fixed it before. Half the
     foil gone and the rest clears itself. The card pays when its third panel is clear. Leaving mid-scratch loses nothing: a panel
     begun counts as scratched the next time the card is drawn, and a card with three panels begun is paid even on a later day.
   - The keyboard (and a script's click) still reveals a panel at once: a screen reader user cannot rub.
   - The Board's row is gone. A card button sits beside the mailbox on every screen with the header, from the level the card opens:
     lit when today's card is ready, plain while it is locked or done. The screen behind it always shows the card; before 3 tasks it
     says it is locked. */
var SCCV={},SCDRAG=null,SCDAY="",SCRUBT=0;
function v56Clr(c){if(!Array.isArray(c.clr))c.clr=[];return c.clr}
/* yesterday's card with all three panels begun and never paid is paid before the new day's card replaces it */
var v56State=scState;scState=function(){try{var o=S.sc;if(o&&typeof o==="object"&&o.d!==today()&&!o.done&&o.out&&o.pick&&o.pick.length>=3)scPay(o)}catch(e){}return v56State.apply(this,arguments)};
function v56Celebrate(c){setTimeout(function(){try{checkBadges()}catch(e){}try{qbSnd(c.win||c.gold?"big":"build")}catch(e){}if(c.win||c.gold)try{burst(innerWidth/2,innerHeight/2.6,c.gold?40+20*c.gold:c.win==="m"?60:34)}catch(e){}pop("Scratch card: "+c.res)},650)}
function v56Settle(){var c=scState();if(c.done||c.pick.length<3)return;var clr=v56Clr(c);if(c.pick.some(function(i){return clr.indexOf(i)<0}))return;scPay(c);render();v56Celebrate(c)}
/* a pick made by rubbing: the symbol is fixed and saved now; the foil comes off under the finger */
function v56Begin(i){var c=scState();if(c.done||scTasks()<SCNEED||c.pick.indexOf(i)>=0||c.pick.length>=3||i<0||i>8)return false;
  if(!c.out)c.out=scRoll();c.pick.push(i);v56Clr(c);persist();try{qbSnd("build")}catch(e){}return true}
function v56Done(i){var c=scState(),clr=v56Clr(c);delete SCCV[i];SCRUBT=Date.now();if(c.pick.indexOf(i)>=0&&clr.indexOf(i)<0)clr.push(i);persist();if(c.pick.length>=3&&!c.done)v56Settle();else render()}
function v56Foil(cv){var x=cv.getContext("2d"),w=cv.width,h=cv.height,g=x.createLinearGradient(0,0,w,h);
  [[0,"#8f96ad"],[.22,"#d9dcea"],[.4,"#9aa0b6"],[.58,"#eef0f8"],[.78,"#8a90a8"],[1,"#c6cada"]].forEach(function(s){g.addColorStop(s[0],s[1])});x.fillStyle=g;x.fillRect(0,0,w,h);
  x.strokeStyle="rgba(0,0,0,.10)";x.lineWidth=Math.max(1,w/60);for(var d=-h;d<w;d+=w/14){x.beginPath();x.moveTo(d,0);x.lineTo(d+h,h);x.stroke()}
  x.strokeStyle="rgba(20,24,44,.5)";x.lineWidth=Math.max(1.5,w/45);x.beginPath();x.arc(w/2,h/2,w*.2,0,7);x.stroke();
  x.fillStyle="rgba(20,24,44,.55)";x.font="800 "+Math.round(w*.26)+"px system-ui,sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText("Ø",w/2,h/2+w*.01)}
function v56Canvas(cell,i){var cv=SCCV[i];if(!cv){var r=cell.getBoundingClientRect(),k=Math.min(2,window.devicePixelRatio||1);cv=document.createElement("canvas");cv.className="sc-cv";cv.width=Math.max(40,Math.round(r.width*k));cv.height=Math.max(40,Math.round(r.height*k));v56Foil(cv);SCCV[i]=cv}
  if(cv.parentNode!==cell)cell.appendChild(cv);return cv}
function v56Gone(cv){try{var t=document.createElement("canvas");t.width=t.height=24;var x=t.getContext("2d");x.drawImage(cv,0,0,24,24);var d=x.getImageData(0,0,24,24).data,n=0;for(var p=3;p<d.length;p+=4)if(d[p]<110)n++;return n/576}catch(e){return 0}}
function v56Rub(D,e){var cv=D.cv,r=cv.getBoundingClientRect();if(!r.width)return;var k=cv.width/r.width,x=(e.clientX-r.left)*k,y=(e.clientY-r.top)*k,c=cv.getContext("2d");
  c.globalCompositeOperation="destination-out";c.lineCap="round";c.lineJoin="round";c.lineWidth=cv.width*.3;c.beginPath();c.moveTo(D.lx==null?x:D.lx,D.ly==null?y:D.ly);c.lineTo(x+.01,y+.01);c.stroke();D.lx=x;D.ly=y}
function v56Finish(D){if(D.fin)return;D.fin=1;var cv=D.cv,i=D.i;cv.classList.add("out");setTimeout(function(){try{if(cv.parentNode)cv.parentNode.removeChild(cv)}catch(e){}v56Done(i)},260)}
document.addEventListener("pointerdown",function(e){try{var cell=e.target.closest&&e.target.closest(".sc-card:not(.locked):not(.done) .sc-cell");if(!cell||(e.pointerType==="mouse"&&e.button!==0))return;
    var i=+cell.dataset.i,c=scState(),begun=c.pick.indexOf(i)>=0;if(begun&&!SCCV[i])return;/* already clear */if(!begun&&(c.pick.length>=3||scTasks()<SCNEED))return;
    SCDRAG={i:i,cell:cell,id:e.pointerId,x0:e.clientX,y0:e.clientY,begun:begun,cv:begun?SCCV[i]:null,lx:null,ly:null,last:0};try{cell.setPointerCapture(e.pointerId)}catch(x){}
    if(begun)v56Rub(SCDRAG,e)}catch(x){}},true);
document.addEventListener("pointermove",function(e){var D=SCDRAG;if(!D||e.pointerId!==D.id||D.fin)return;try{
    if(!D.begun){if(Math.abs(e.clientX-D.x0)+Math.abs(e.clientY-D.y0)<8)return;if(!v56Begin(D.i)){SCDRAG=null;return}D.begun=1;
      /* the symbol goes in under a fresh foil, without a redraw (a redraw would drop the finger's stroke) */
      var c=scState(),sym=c.out[c.pick.indexOf(D.i)],old=D.cell.querySelector(".sc-foil");D.cv=v56Canvas(D.cell,D.i);if(old)old.remove();D.cell.classList.add("open","rub");
      D.cell.insertAdjacentHTML("afterbegin",'<span class="sc-face sc-glow-'+sym+'">'+scIcon(sym)+'</span>');
      var ft=document.querySelector(".sc-foot");if(ft&&!c.done){var left=3-c.pick.length;ft.innerHTML='<b>'+(left?'Scratch '+left+' more panel'+(left===1?'':'s'):'Last panel: scratch it clear')+'</b><span>Match three to win big.</span>'}
      [].forEach.call(document.querySelectorAll(".sc-cell"),function(b){var j=+b.dataset.i;if(c.pick.length>=3&&c.pick.indexOf(j)<0)b.disabled=true})}
    e.preventDefault();v56Rub(D,e);var now=Date.now();if(now-D.last>110){D.last=now;if(v56Gone(D.cv)>=.5)v56Finish(D)}}catch(x){}},{capture:true,passive:false});
function v56Up(e){var D=SCDRAG;if(!D||(e&&e.pointerId!==D.id))return;SCDRAG=null;try{if(D.begun&&!D.fin&&D.cv&&v56Gone(D.cv)>=.5)v56Finish(D)}catch(x){}}
document.addEventListener("pointerup",v56Up,true);document.addEventListener("pointercancel",v56Up,true);
/* after every draw: put a half-rubbed foil back on its panel; a panel begun whose foil is gone (the app was closed, the day's first
   draw) counts as scratched; a click that came from a finger or mouse never reveals (v146's handler, below) */
function v56Attach(){try{if(!loaded||!S||!S.created)return;var c=S.sc;if(!c||typeof c!=="object"||c.d!==today()){SCCV={};return}if(SCDAY!==c.d){SCDAY=c.d}
    var clr=v56Clr(c),grid=view==="wheel"?document.querySelector(".sc-card .sc-grid"):null,lost=0;
    c.pick.forEach(function(i){if(clr.indexOf(i)>=0)return;var cv=SCCV[i];if(!cv||c.done){clr.push(i);delete SCCV[i];lost++;return}
      if(grid){var cell=grid.querySelector('.sc-cell[data-i="'+i+'"]');if(cell){cell.classList.add("rub");if(cv.parentNode!==cell)cell.appendChild(cv)}}});
    /* a panel just rubbed clear does not replay the tap's wipe */
    if(grid&&Date.now()-SCRUBT<1500)[].forEach.call(grid.querySelectorAll(".sc-cell.open"),function(b){b.classList.add("rub")});
    if(lost&&!c.done&&c.pick.length>=3&&!SCDRAG)setTimeout(v56Settle,0)}catch(e){}}
var v56Render=render;render=function(){var r=v56Render.apply(this,arguments);v56Attach();return r};
/* ---- the locked card says so; the live card says how ---- */
var v56Html=scHtml;scHtml=function(){var h=v56Html.apply(this,arguments);try{var c=scState(),n=scTasks();
    if(!c.done&&n<SCNEED)h=h.replace(/<b>Finish \d+ more tasks? today to scratch<\/b>/,'<b><span class="sc-lock" aria-hidden="true">'+areaIcon("lock")+'</span>Locked until you finish '+SCNEED+' tasks today</b><span>'+n+' of '+SCNEED+' done</span>');
    else if(!c.done)h=h.replace("<b>Scratch 0 panels</b>","<b>Last panel: scratch it clear</b>").replace("<span>Match three to win big.</span>","<span>Rub a panel with your finger to scratch it. Match three to win big.</span>")}catch(e){}return h};
wheelHtml=function(){return scHtml()};
/* ---- the button by the mailbox; the Board's row goes ---- */
zxSpin=function(){return ""};
function v56Btn(){try{if(!loaded||!S||!S.created||!zxOpen("wheel"))return "";var c=scState(),n=scTasks(),st=c.done?"done":n>=SCNEED?"rdy":"wait";
    return '<button type="button" class="scbtn zx-spin '+st+'" data-act="nav" data-v="wheel" aria-label="Scratch card: '+(st==="rdy"?"today’s card is ready":st==="done"?"scratched today":"locked, "+n+" of "+SCNEED+" tasks done")+'">'+areaIcon("wheel").replace("<svg ",'<svg width="16" height="16" ')+(st==="rdy"?'<i class="scdot"></i>':'')+'</button>'}catch(e){return ""}}
var v56Strip=stripHtml;stripHtml=function(){var h=v56Strip.apply(this,arguments);
  try{var b=v56Btn();if(b){var d=document.createElement("div");d.innerHTML=h;var ib=d.querySelector(".strip .ibbtn"),cp=d.querySelector(".strip .coinpill"),at=ib||d.querySelector(".strip .kdbtn")||cp;if(at){at.insertAdjacentHTML("afterend",b);h=d.innerHTML}}}catch(e){}
  return h};
try{TOURS.forEach(function(t){if(t.id==="wheel"){t.ready=function(){return view==="board"&&tourVis(".scbtn")};t.steps=[{sel:".scbtn",t:"New: the scratch card",x:"One card a day, once you have finished "+SCNEED+" tasks. This button lights up when it is ready. Rub three panels and match them to win.",tap:1}]}})}catch(e){}
htabCss("qb-v156-css",".sc-card:not(.locked):not(.done) .sc-grid{touch-action:none}.sc-cell{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.sc-cell:not(:disabled):active{transform:none}"
  +".sc-cv{position:absolute;inset:0;width:100%;height:100%;display:block;border-radius:inherit;transition:opacity .25s;z-index:1}.sc-cv.out{opacity:0}.sc-cell.rub .sc-dust{display:none}.sc-cell.rub .sc-face{animation:none}"
  +".sc-card:not(.locked):not(.done) .sc-cell:not(.open):not(:disabled){cursor:grab}"
  +".sc-lock{display:inline-flex;vertical-align:-3px;margin-right:6px;opacity:.85}.sc-lock svg{width:16px;height:16px}"
  +".scbtn{position:relative;width:28px;height:28px;border-radius:50%;border:1px solid var(--line);background:var(--surface2);color:var(--fg);padding:0;display:grid;place-items:center;cursor:pointer;flex:none}.scbtn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.scbtn svg{display:block}"
  +".scbtn.wait,.scbtn.done{color:color-mix(in srgb,var(--fg) 55%,transparent)}.scbtn.rdy{border-color:var(--gold,#ffc857);color:var(--gold,#ffc857);box-shadow:0 0 12px -2px var(--gold,#ffc857)}"
  +".scbtn .scdot{position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:50%;background:var(--gold,#ffc857);box-shadow:0 0 8px var(--gold,#ffc857)}"
  /* QA: the dot was styled as any <i> in the button, so the alerts' mark (an <i> too) took its gold disc; the dot has its own class, and steps aside while the mark shows */
  +".scbtn:has(.nbang) .scdot{display:none}.scbtn .nbang{transform:scale(.72);transform-origin:100% 0}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV156={cv:function(){return Object.keys(SCCV).map(Number)},gone:function(i){return SCCV[i]?v56Gone(SCCV[i]):null},btn:v56Btn};
