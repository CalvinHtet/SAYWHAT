/* ---------- Cal's 2026-11-23 list, after the reboot ----------
   Cal: "coins tutorial does not hover over the coins properly. it hovers over empty space." "When leveling up twice in one go, it shows
   you level 3 first before level 2." "If adding own workouts, allow a plus button next to sets to add more sets." "For each of the
   workouts, allow us to edit the workouts if we don't want to do deadlifts for example. There can be a little pencil edit button to
   swap out the workout. Swapping it out will remove the character animation that demonstrates the workout and replaces it with a
   relevant emoji. Also allow us to add and remove sets for those workouts that we modified. The training tab is specific to each
   character profile and nobody else should be able to see what we changed or our workout schedule." "Remove this text 'XP and stats
   stay. Start a fresh run tomorrow.' and remove the New Run button ... only keep Every quest cleared in that green box." "Remove
   '(Messy is fine)' and replace with 'Add tasks here (Separate by commas)'". */

/* ---- the coins step rings the coin count you can see: scrolled down, the one in the header is hidden and a floating one shows
   (29zx_simple.js #zxcoins), so the ring sat on the hidden one. With neither on screen, the page goes to the top first. ---- */
var v36Vis=tourVis;tourVis=function(sel){if(sel!==".coinpill")return v36Vis.apply(this,arguments);
  var ok=function(e){var r=e.getBoundingClientRect(),cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=="hidden"&&cs.display!=="none"&&+cs.opacity>.2&&r.bottom>0&&r.top<innerHeight};
  var L=Array.prototype.filter.call(document.querySelectorAll(".coinpill"),ok);if(L.length)return L[0];
  try{window.scrollTo(0,0)}catch(e){}var top=document.querySelector(".strip .coinpill")||document.querySelector(".coinpill");return top&&ok(top)?top:null};

/* ---- level-ups in order: a second level-up while one's window is open (a quest's level, then its chest's) waits for it to close ---- */
var V36LV=[];
var v36Lv=levelUp;levelUp=function(){if(document.getElementById("lvok")){V36LV.push([].slice.call(arguments));return}return v36Lv.apply(this,arguments)};
document.addEventListener("click",function(e){if(!(e.target&&e.target.id==="lvok"))return;setTimeout(function(){try{if(V36LV.length&&!document.getElementById("lvok"))levelUp.apply(null,V36LV.shift())}catch(x){}},350)});

/* ---- the Board: the cleared box says only that; the task box asks for commas ---- */
var v36Board=boardHtml;boardHtml=function(){var h=v36Board.apply(this,arguments);
  return h.replace(/<p class="note" style="margin:6px 0 12px">XP and stats stay\. Start a fresh run tomorrow\.<\/p><button class="btn ghost" data-act="newday">New run<\/button>/,"")
    .replace('placeholder="Add tasks (messy is fine)"','placeholder="Add tasks here (Separate by commas)"')};

/* ---- Training: sets and swaps, kept in this character's own save (S.exSets, S.swap; never published, nobody else sees them) ----
   - Every exercise card has "- Set" and "+ Set" (1 to 10). The count holds for today's session and is remembered for that exercise
     next time (S.exSets); for your own activities it is the activity's rounds (S.cex[id].sets).
   - A plan's exercise has a pencil: swap it for one you name. The swap (S.swap[id] = {n, ic}) is used wherever that exercise comes up,
     drawn with an emoji for what it is instead of the character's demonstration, with the same sets, reps and weight logging; it
     can be swapped back. */
function v36Ic(n){var s=String(n||"").toLowerCase();
  return /run|sprint|jog/.test(s)?"\u{1F3C3}":/walk|hike/.test(s)?"\u{1F6B6}":/bike|cycl|spin/.test(s)?"\u{1F6B4}":/swim/.test(s)?"\u{1F3CA}":/row(ing)? machine|erg/.test(s)?"\u{1F6A3}"
    :/yoga|stretch|mobility|pilates/.test(s)?"\u{1F9D8}":/box|punch|kick/.test(s)?"\u{1F94A}":/jump|rope|skip|burpee/.test(s)?"\u{1F938}":/squat|lunge|leg|calf|glute|step/.test(s)?"\u{1F9B5}"
    :/curl|bicep|tricep|arm|row|pull|chin|lat/.test(s)?"\u{1F4AA}":/plank|crunch|core|ab|sit/.test(s)?"\u{1F9D8}":"\u{1F3CB}️"}
function v36SwId(id){return "sw_"+id}
function v36SwSync(){if(!S.swap||typeof S.swap!=="object")S.swap={};Object.keys(S.swap).forEach(function(id){var w=S.swap[id],E=EX[id];if(!E||!w)return;
  EX[v36SwId(id)]=[String(w.n).slice(0,28),E[1],E[2],E[3],E[4]||5,"lb",w.ic||v36Ic(w.n)]})}
function v36Orig(id){return /^sw_/.test(id)?id.slice(3):id}
var v36Build=buildPlan;buildPlan=function(){var p=v36Build.apply(this,arguments);try{v36SwSync();var X=S.exSets||{},W=S.swap||{};
    p.list=p.list.map(function(id){if(!W[id]||!EX[v36SwId(id)])return id;var n=v36SwId(id);["roles","notes","setsN"].forEach(function(k){if(p[k]&&p[k][id]!=null){p[k][n]=p[k][id];delete p[k][id]}});return n});
    p.list.forEach(function(id){if(X[id]>0)p.setsN[id]=X[id]})}catch(e){}return p};
var v36Card=exCard;exCard=function(id){var h=v36Card.apply(this,arguments);try{var NS=(S.wk.setsN&&S.wk.setsN[id])||EX[id][2],custom=EX[id][1]==="custom";
    var bar='<div class="v36ex"><button class="btn ghost sm" data-act="v36set" data-ex="'+esc(id)+'" data-d="-1"'+(NS<=1?' disabled':'')+' aria-label="One set fewer">&minus; Set</button>'
      +'<button class="btn ghost sm" data-act="v36set" data-ex="'+esc(id)+'" data-d="1"'+(NS>=10?' disabled':'')+' aria-label="One set more">+ Set</button>'
      +(custom?'':'<button class="btn ghost sm" data-act="v36sw" data-ex="'+esc(id)+'" aria-label="Swap this exercise">&#9998; Swap</button>')+'</div>';
    var i=h.lastIndexOf("</div></div>");if(i>=0)h=h.slice(0,i)+bar+h.slice(i)}catch(e){}return h};
var v36Train=trainHtml;trainHtml=function(){try{v36SwSync()}catch(e){}return v36Train.apply(this,arguments)};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=v36set]");if(!b||!S.wk)return;var id=b.dataset.ex,d=+b.dataset.d;if(!EX[id])return;
  if(!S.wk.setsN)S.wk.setsN={};var n=Math.max(1,Math.min(10,((S.wk.setsN[id])||EX[id][2])+d));S.wk.setsN[id]=n;
  if(S.wk.sets&&S.wk.sets[id]&&S.wk.sets[id].length>n)S.wk.sets[id]=S.wk.sets[id].slice(0,n);
  if(EX[id][1]==="custom"&&S.cex&&S.cex[id])S.cex[id].sets=n;else{if(!S.exSets||typeof S.exSets!=="object")S.exSets={};S.exSets[id]=n}
  persist();render()});
function v36SwHtml(id){var o=v36Orig(id),E=EX[o],w=(S.swap||{})[o];
  return '<div class="card box2 v36swm"><span class="label">Swap exercise</span><h3>'+esc(E?E[0]:"")+'</h3><p class="note">Name the exercise you want instead. It keeps the same sets and reps, and only you see it.</p>'
    +'<input id="v36swin" type="text" maxlength="28" placeholder="e.g. Hip thrusts" value="'+esc(w?w.n:"")+'" style="width:100%;font:inherit;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--fg)">'
    +'<div class="row" style="margin-top:12px;flex-wrap:wrap;gap:8px"><button class="btn" data-act="v36swok" data-ex="'+esc(o)+'">Swap</button>'+(w?'<button class="btn ghost" data-act="v36swback" data-ex="'+esc(o)+'">Back to '+esc(E[0])+'</button>':'')+'<button class="btn ghost" data-act="mclose">Cancel</button></div></div>'}
function v36Apply(o,on){var from=on?o:v36SwId(o),to=on?v36SwId(o):o,wk=S.wk;if(!wk||!Array.isArray(wk.list))return;var i=wk.list.indexOf(from);if(i<0)return;wk.list[i]=to;
  ["roles","notes","setsN","sets","w","hit"].forEach(function(k){if(wk[k]&&wk[k][from]!=null){wk[k][to]=wk[k][from];delete wk[k][from]}})}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=v36sw],[data-act=v36swok],[data-act=v36swback]");if(!b)return;var a=b.dataset.act,id=b.dataset.ex;
  if(a==="v36sw"){modal(v36SwHtml(id));setTimeout(function(){var i=document.getElementById("v36swin");if(i)i.focus()},50);return}
  if(!S.swap||typeof S.swap!=="object")S.swap={};
  if(a==="v36swok"){var n=((document.getElementById("v36swin")||{}).value||"").replace(/\s+/g," ").trim().slice(0,28);if(!n){pop("Name the exercise first");return}
    var had=!!S.swap[id];S.swap[id]={n:n,ic:v36Ic(n)};v36SwSync();if(!had)v36Apply(id,true);pop("Swapped for "+n)}
  else{delete S.swap[id];v36Apply(id,false);delete EX[v36SwId(id)];pop("Back to "+(EX[id]?EX[id][0]:"the original"))}
  try{closeModals()}catch(x){}persist();render()});
(function(){var st=document.createElement("style");st.textContent=".v36ex{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v36ex .btn{min-height:34px}";document.head.appendChild(st)})();
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV136={lv:function(){return levelUp.apply(null,arguments)},ex:function(id){return EX[id]},tour:TOUR};
