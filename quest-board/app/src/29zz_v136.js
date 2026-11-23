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

/* ---- Training: sets and swaps, kept in this character's own save (S.exSets, S.swap; never published, nobody else sees them) (the buttons became one Edit, below) ----
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
function v36Apply(o,on){var from=on?o:v36SwId(o),to=on?v36SwId(o):o,wk=S.wk;if(!wk||!Array.isArray(wk.list))return;var i=wk.list.indexOf(from);if(i<0)return;wk.list[i]=to;
  ["roles","notes","setsN","sets","w","hit"].forEach(function(k){if(wk[k]&&wk[k][from]!=null){wk[k][to]=wk[k][from];delete wk[k][from]}})}
var v36Train=trainHtml;trainHtml=function(){try{v36SwSync()}catch(e){}return v36Train.apply(this,arguments)};
/* Cal 11-23: "move the - set, + set, swap, into just one edit button. Inside here, I want to be able to remove or add sets, edit the reps,
   and edit the name of the workout, and even upload a photo of the workout if you want, but it should default to a relevant emoji first."
   One ✎ Edit on every exercise card opens one window: sets (− / +, 1 to 10), reps (any text: "8-10", "12", "30 sec"), the name, and a
   photo. A plan's exercise keeps the character's demonstration until its name changes or it gets a photo; then it is drawn with an emoji
   for its name, or the photo (S.swap[id] = {n, ic, img}; "Back to <original>" undoes it). Your own activities keep their emoji until you
   give them a photo (S.cex[id].img). Reps: S.exReps[id] for a plan's exercise, S.cex[id].t for yours. The photo is made small on the phone
   (240 px JPEG) and kept in the save; nothing here is published. */
if(!window.EXREP0)window.EXREP0={};
function v36Reps(o){var R=S.exReps||{};if(R[o]!=null)return R[o];return EXREP0[o]!=null?EXREP0[o]:(EX[o]?EX[o][3]:"")}
function v36RepSync(){var R=S.exReps||{};Object.keys(R).forEach(function(o){if(!EX[o])return;if(EXREP0[o]==null)EXREP0[o]=EX[o][3];EX[o][3]=String(R[o]).slice(0,16)})}
var v36SwSyncBase=v36SwSync;v36SwSync=function(){v36RepSync();v36SwSyncBase.apply(this,arguments)};
function v36Img(id){try{if(/^sw_/.test(id)){var w=(S.swap||{})[id.slice(3)];return w&&w.img||""}var c=S.cex&&S.cex[id];return c&&c.img||""}catch(e){return ""}}
var v36Tile=cexTile;cexTile=function(id,cls){var im=v36Img(id);if(im&&/^data:image\/jpeg;base64,/.test(im))return '<div class="xd xcust xphoto'+(cls?" "+cls:"")+'" role="img" aria-label="'+esc(EX[id][0])+'"><img src="'+im+'" alt=""></div>';return v36Tile.apply(this,arguments)};
var v36Card=exCard;exCard=function(id){var h=v36Card.apply(this,arguments);try{
    var bar='<div class="v36ex"><button class="btn ghost sm" data-act="v36ed" data-ex="'+esc(id)+'" aria-label="Edit this exercise">&#9998; Edit</button></div>';
    var i=h.lastIndexOf("</div></div>");if(i>=0)h=h.slice(0,i)+bar+h.slice(i)}catch(e){}return h};
var V36ED={id:"",img:null};
/* the guided session (one exercise a screen, 30_app_b.js coachDraw) has the same Edit, and redraws after a save */
var v36Coach=coachExHtml;coachExHtml=function(id){var h=v36Coach.apply(this,arguments);try{var bar='<div class="v36ex"><button class="btn ghost sm" data-act="v36ed" data-ex="'+esc(id)+'" aria-label="Edit this exercise">&#9998; Edit</button></div>';
  var i=h.lastIndexOf("</div>");if(i>=0)h=h.slice(0,i)+bar+h.slice(i)}catch(e){}return h};
function v36Redraw(){try{if(typeof CSCR!=="undefined"&&CSCR&&CSCR.isConnected&&CSCR.querySelector(".ctop .label")&&!/Full workout/.test(CSCR.querySelector(".ctop .label").textContent))coachDraw(false)}catch(e){}}
function v36EdHtml(id){var custom=EX[id][1]==="custom"&&!/^sw_/.test(id),o=v36Orig(id),c=custom?S.cex[id]:null,w=custom?null:(S.swap||{})[o];
  var name=custom?c.n:(w?w.n:EX[o][0]),reps=custom?c.t:v36Reps(o),sets=(S.wk&&S.wk.setsN&&S.wk.setsN[id])||EX[id][2],img=V36ED.img!=null?V36ED.img:v36Img(id),ic=custom?(c.ic||v36Ic(name)):v36Ic(name);
  var inp='font:inherit;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--fg);width:100%';
  return '<div class="card box2 v36edm" data-ex="'+esc(id)+'"><span class="label">Edit exercise</span>'
    +'<div class="v36pic">'+(img?'<img src="'+img+'" alt="">':'<span>'+esc(ic)+'</span>')+'</div>'
    +'<label class="v36f"><small>Name</small><input id="v36n" type="text" maxlength="28" value="'+esc(name)+'" style="'+inp+'"></label>'
    +'<div class="v36row"><div class="v36f"><small>Sets</small><div class="v36st"><button class="btn ghost sm" data-act="v36s" data-d="-1">&minus;</button><b id="v36sv">'+sets+'</b><button class="btn ghost sm" data-act="v36s" data-d="1">+</button></div></div>'
    +'<label class="v36f"><small>Reps</small><input id="v36r" type="text" maxlength="16" value="'+esc(reps)+'" placeholder="8-10" style="'+inp+'"></label></div>'
    +'<div class="v36f"><small>Photo (optional)</small><div class="row" style="gap:8px;flex-wrap:wrap"><label class="btn ghost sm" style="cursor:pointer">'+(img?'Change photo':'Add a photo')+'<input id="v36p" type="file" accept="image/*" hidden></label>'+(img?'<button class="btn ghost sm" data-act="v36pnone">Use the emoji</button>':'')+'</div></div>'
    +'<p class="note">Only you see this. It changes this exercise wherever it comes up.</p>'
    +'<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn" data-act="v36save">Save</button>'+(!custom&&w?'<button class="btn ghost" data-act="v36orig">Back to '+esc(EX[o][0])+'</button>':'')+'<button class="btn ghost" data-act="mclose">Cancel</button></div></div>'}
function v36EdOpen(id){V36ED={id:id,img:null,sets:null};modal(v36EdHtml(id))}
function v36EdRedraw(){var m=document.querySelector("#layer .v36edm");if(!m)return;var n=document.getElementById("v36n"),r=document.getElementById("v36r"),sv=document.getElementById("v36sv"),keep={n:n&&n.value,r:r&&r.value,s:sv&&sv.textContent};
  var t=document.createElement("div");t.innerHTML=v36EdHtml(V36ED.id);m.replaceWith(t.firstElementChild);
  if(keep.n!=null)document.getElementById("v36n").value=keep.n;if(keep.r!=null)document.getElementById("v36r").value=keep.r;if(keep.s!=null)document.getElementById("v36sv").textContent=keep.s}
document.addEventListener("change",function(e){if(!e.target||e.target.id!=="v36p")return;var f=e.target.files&&e.target.files[0];if(!f)return;var img=new Image(),u=URL.createObjectURL(f);
  img.onload=function(){try{var k=Math.min(1,240/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.naturalWidth*k));c.height=Math.max(1,Math.round(img.naturalHeight*k));
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);V36ED.img=c.toDataURL("image/jpeg",.72);URL.revokeObjectURL(u);v36EdRedraw()}catch(x){pop("That photo could not be read")}};img.onerror=function(){pop("That photo could not be read")};img.src=u});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=v36ed],[data-act=v36s],[data-act=v36save],[data-act=v36orig],[data-act=v36pnone]");if(!b)return;var a=b.dataset.act;
  if(a==="v36ed"){v36EdOpen(b.dataset.ex);return}
  if(a==="v36s"){var sv=document.getElementById("v36sv");if(sv)sv.textContent=Math.max(1,Math.min(10,(+sv.textContent||1)+(+b.dataset.d)));return}
  if(a==="v36pnone"){V36ED.img="";v36EdRedraw();return}
  var id=V36ED.id;if(!id||!EX[id])return;var custom=EX[id][1]==="custom"&&!/^sw_/.test(id),o=v36Orig(id);if(!S.swap||typeof S.swap!=="object")S.swap={};if(!S.exReps||typeof S.exReps!=="object")S.exReps={};if(!S.exSets||typeof S.exSets!=="object")S.exSets={};
  if(a==="v36orig"){delete S.swap[o];delete S.exReps[o];if(EXREP0[o]!=null)EX[o][3]=EXREP0[o];v36Apply(o,false);delete EX[v36SwId(o)];try{closeModals()}catch(x){}persist();render();v36Redraw();pop("Back to "+EX[o][0]);return}
  var n=((document.getElementById("v36n")||{}).value||"").replace(/\s+/g," ").trim().slice(0,28),r=((document.getElementById("v36r")||{}).value||"").replace(/\s+/g," ").trim().slice(0,16),sets=Math.max(1,Math.min(10,+((document.getElementById("v36sv")||{}).textContent)||1));
  var img=V36ED.img!=null?V36ED.img:v36Img(id),cur=id;
  if(custom){var c=S.cex[id];if(n)c.n=n;if(r)c.t=r;c.sets=sets;if(img)c.img=img;else delete c.img;cexSync()}
  else{var orig=EX[o][0],sw=!!S.swap[o];if(r&&r!==String(EXREP0[o]!=null?EXREP0[o]:EX[o][3]))S.exReps[o]=r;else if(!r||r===String(EXREP0[o]!=null?EXREP0[o]:EX[o][3]))delete S.exReps[o];
    if((n&&n!==orig)||img){S.swap[o]={n:n||orig,ic:v36Ic(n||orig),img:img||""};if(!img)delete S.swap[o].img;v36SwSync();if(!sw)v36Apply(o,true);cur=v36SwId(o)}
    else if(sw){delete S.swap[o];v36Apply(o,false);delete EX[v36SwId(o)];cur=o}
    v36SwSync();if(EX[v36SwId(o)])EX[v36SwId(o)][3]=v36Reps(o)}
  if(S.wk){if(!S.wk.setsN)S.wk.setsN={};S.wk.setsN[cur]=sets;if(S.wk.sets&&S.wk.sets[cur]&&S.wk.sets[cur].length>sets)S.wk.sets[cur]=S.wk.sets[cur].slice(0,sets)}
  if(!custom)S.exSets[cur]=sets;
  try{closeModals()}catch(x){}persist();render();v36Redraw();pop("Saved")});
(function(){var st=document.createElement("style");st.textContent=".v36ex{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v36ex .btn{min-height:34px}"
  +".v36edm .v36pic{width:96px;height:96px;margin:8px auto 10px;border-radius:16px;background:var(--surface2);display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:52px}.v36edm .v36pic img{width:100%;height:100%;object-fit:cover}"
  +".v36f{display:flex;flex-direction:column;gap:4px;margin:8px 0;min-width:0;flex:1}.v36row{display:flex;gap:10px}.v36st{display:flex;align-items:center;gap:10px}.v36st b{min-width:22px;text-align:center;font-size:18px}"
  +".xd.xphoto img{width:100%;height:100%;object-fit:cover;border-radius:inherit}"+".cstage .xd.xcust span{font-size:110px;line-height:1}";document.head.appendChild(st)})();
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV136={lv:function(){return levelUp.apply(null,arguments)},ex:function(id){return EX[id]},tour:TOUR};
