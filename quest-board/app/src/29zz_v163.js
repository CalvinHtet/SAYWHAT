/* ---------- Cal 2026-11-25: priority on a task ----------
   Cal: "Allow us to prioritize tasks with a button that toggles between off, 1 exclamation point, 2 exclamation points, and 3
   exclamation points. These tasks should be bumped to the top of the task list"
   - Each open task has a button beside Daily: off, !, !!, !!!, then off again (q.pri 0 to 3; saved with the task).
   - On the Board, every open task with a priority leaves its category and sits in a "Priority" group at the very top, !!! first,
     then !!, then !, shortest first within each. Categories it left count one fewer; a category left empty is not shown.
   - It is only order: XP, coins and everything else stay as they were. A finished task keeps its priority (a daily one comes back
     with it) and goes to Completed like any other. Done on the drawn Board, so no category data is changed. */
function v63Pri(q){var p=Math.round(+(q&&q.pri)||0);return p>=1&&p<=3?p:0}
function v63Btn(q){var p=v63Pri(q);return '<button type="button" class="qpri p'+p+'" data-act="qpri" data-id="'+esc(q.id)+'" aria-label="'+esc(q.name)+': priority '+(p?p+" of 3":"off")+'. Tap to change">'
  +'<b aria-hidden="true">'+(p?"!!!".slice(0,p):"!")+'</b><small>'+(p?"Priority":"Priority")+'</small></button>'}
function v63Board(){try{if(view!=="board")return;var app=document.getElementById("app");if(!app)return;var rows=[].slice.call(app.querySelectorAll(".q"));if(!rows.length)return;
    var byId={};(S.quests||[]).forEach(function(q){byId[q.id]=q});var pri=[];
    rows.forEach(function(r){var m=r.querySelector(".qmain[data-act=toggle]");if(!m)return;var q=byId[m.dataset.id];if(!q)return;
      if(!r.querySelector(".qpri"))m.insertAdjacentHTML("afterend",v63Btn(q));r.classList.add("v63");
      if(!S.done[q.id]&&v63Pri(q)&&!r.closest(".donebox"))pri.push([r,q])});
    var old=app.querySelector("section.v63pri");if(old&&!pri.length){old.remove();return}if(!pri.length)return;
    pri.sort(function(a,b){return v63Pri(b[1])-v63Pri(a[1])||qMin(a[1])-qMin(b[1])});
    var first=app.querySelector("section.cluster:not(.v63pri)"),sec=old;
    if(!sec){sec=document.createElement("section");sec.className="cluster v63pri";sec.innerHTML='<header><h3 class="label">Priority</h3><span class="note mono"></span></header>'}
    if(first&&first.parentNode&&sec.parentNode!==first.parentNode)first.parentNode.insertBefore(sec,first);else if(!first&&!sec.parentNode)return;
    var left=[];pri.forEach(function(x){var from=x[0].closest("section.cluster");if(from&&from!==sec&&left.indexOf(from)<0)left.push(from);sec.appendChild(x[0])});
    sec.querySelector(".note").textContent=pri.length;
    left.forEach(function(c){var n=c.querySelectorAll(".q").length,nt=c.querySelector("header .note");if(!n)c.remove();else if(nt)nt.textContent=n})}catch(e){}}
var v63Render=render;render=function(){var r=v63Render.apply(this,arguments);v63Board();return r};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=qpri]");if(!b)return;e.preventDefault();e.stopPropagation();
  var q=(S.quests||[]).filter(function(x){return x.id===b.dataset.id})[0];if(!q)return;var p=(v63Pri(q)+1)%4;if(p)q.pri=p;else delete q.pri;persist();render();
  try{var nb=document.querySelector('.qpri[data-id="'+b.dataset.id.replace(/"/g,"")+'"]');if(nb)nb.focus({preventScroll:true})}catch(x){}},true);
htabCss("qb-v163-css",".q.v63{grid-template-columns:1fr auto auto auto}"
  +".qpri{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:46px;padding:0 6px;background:none;border:0;border-left:1px solid var(--line);color:var(--muted);cursor:pointer;font:inherit;line-height:1}"
  +".qpri b{font:900 17px/1 var(--font-display,system-ui);letter-spacing:.02em}.qpri small{font-size:9px;letter-spacing:.04em;text-transform:uppercase}.qpri.p0 b{opacity:.45}"
  +".qpri.p1{color:#ffc857;background:rgba(255,200,87,.08)}.qpri.p2{color:#ff9a3d;background:rgba(255,154,61,.12)}.qpri.p3{color:#ff5a5a;background:rgba(255,90,90,.15)}"
  +".qpri:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.q.done .qpri{opacity:.6}"
  +".cluster.v63pri>header .label{color:#ff9a3d}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV163={pri:v63Pri,board:v63Board};
