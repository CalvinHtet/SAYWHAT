/* ---------- Cal 2026-11-26: repeat on the days you choose ----------
   Cal: "allow the repeat button to open another edit screen that allows you to schedule tasks for repeat for whatever days you choose".
   The repeat button (↻) on a task opens a small window: Once, Every day, or the days of the week to pick (any mix). A task on chosen days
   is rep "days" with q.days (0 Sunday .. 6 Saturday): it shows on the Board only on those days, and like a daily task it is fresh again
   each morning. Its button reads the days ("M W F"). */
var V87D=["S","M","T","W","T","F","S"],V87N=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function v87Wd(){try{var a=today().split("-").map(Number);return new Date(a[0],a[1]-1,a[2],12).getDay()}catch(e){return new Date().getDay()}}
function v87Lbl(q){if(q.rep==="days"&&Array.isArray(q.days)){var d=q.days.slice().sort();if(d.length===7)return "Daily";if(d.join()==="1,2,3,4,5")return "Weekdays";if(d.join()==="0,6")return "Weekends";
    return d.map(function(i){return V87N[i]}).join(" ")}return q.rep==="daily"?"Daily":"Once"}
/* a "days" task is on the Board only on its days */
var v87Vis=visQ;visQ=function(q){if(q&&q.rep==="days"&&Array.isArray(q.days)&&q.days.indexOf(v87Wd())<0&&!(typeof qEdit!=="undefined"&&qEdit))return false;return v87Vis.apply(this,arguments)};
function v87Open(id){var q=S.quests.filter(function(x){return x.id===id})[0];if(!q)return;try{closeModals()}catch(e){}
  var sel=q.rep==="days"&&Array.isArray(q.days)?q.days.slice():q.rep==="daily"?[0,1,2,3,4,5,6]:[];
  var m=modal('<div class="card box2 v87m" data-id="'+esc(id)+'"><span class="label">Repeat</span><h2 style="font-size:22px">'+esc(q.name)+'</h2>'
    +'<div class="v87row"><button type="button" class="v87t'+(q.rep==="once"?' on':'')+'" data-v87="once">Once</button><button type="button" class="v87t'+(sel.length===7?' on':'')+'" data-v87="all">Every day</button></div>'
    +'<p class="note">Or pick the days:</p><div class="v87days">'+[1,2,3,4,5,6,0].map(function(i){return '<button type="button" class="v87d'+(sel.indexOf(i)>=0?' on':'')+'" data-v87d="'+i+'" aria-pressed="'+(sel.indexOf(i)>=0)+'">'+V87N[i]+'</button>'}).join("")+'</div>'
    +'<div class="btns"><button class="btn" data-v87="save">Save</button><button class="btn ghost" data-act="mclose">Cancel</button></div></div>');
  return m}
function v87Save(m){var id=m.getAttribute("data-id"),q=S.quests.filter(function(x){return x.id===id})[0];if(!q)return;
  var once=m.querySelector('[data-v87="once"].on'),d=[].map.call(m.querySelectorAll(".v87d.on"),function(b){return +b.getAttribute("data-v87d")});
  if(once||!d.length){q.rep="once";delete q.days}else if(d.length===7){q.rep="daily";delete q.days}else{q.rep="days";q.days=d.sort()}
  persist();m.closest(".modal")?m.closest(".modal").remove():0;render();pop(q.rep==="once"?"Once: gone when it's done":"Repeats: "+v87Lbl(q))}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-act="qrep"]');if(b){e.preventDefault();e.stopPropagation();v87Open(b.getAttribute("data-id"));return}
  var t=e.target.closest&&e.target.closest("[data-v87],[data-v87d]");if(!t)return;var m=t.closest(".v87m");if(!m)return;e.preventDefault();e.stopPropagation();
  if(t.hasAttribute("data-v87d")){t.classList.toggle("on");t.setAttribute("aria-pressed",t.classList.contains("on"));var on=m.querySelector('[data-v87="once"]');if(on)on.classList.remove("on");var all=m.querySelector('[data-v87="all"]');if(all)all.classList.toggle("on",m.querySelectorAll(".v87d.on").length===7);return}
  var k=t.getAttribute("data-v87");
  if(k==="once"){t.classList.add("on");[].forEach.call(m.querySelectorAll(".v87d"),function(x){x.classList.remove("on")});var a=m.querySelector('[data-v87="all"]');if(a)a.classList.remove("on");return}
  if(k==="all"){t.classList.add("on");[].forEach.call(m.querySelectorAll(".v87d"),function(x){x.classList.add("on")});var o=m.querySelector('[data-v87="once"]');if(o)o.classList.remove("on");return}
  if(k==="save")v87Save(m)},true);
/* the Board's rows: a days task gets its button too, and every button names its repeat */
var v87Render=render;render=function(){var r=v87Render.apply(this,arguments);
  try{[].forEach.call(document.querySelectorAll(".q .qmain[data-id]"),function(mb){var id=mb.getAttribute("data-id"),q=S.quests.filter(function(x){return x.id===id})[0];if(!q||q.rep==="weekly4")return;
      var row=mb.parentNode,btn=row.querySelector(".qrep");
      if(!btn&&q.rep==="days"){mb.insertAdjacentHTML("afterend",'<button class="qrep on" data-act="qrep" data-id="'+esc(id)+'" aria-label="'+esc(q.name)+': repeats '+esc(v87Lbl(q))+'"><span aria-hidden="true">&#8635;</span><small></small></button>');btn=row.querySelector(".qrep")}
      if(btn){var s=btn.querySelector("small");if(s)s.textContent=v87Lbl(q)}
      /* QA d2676c78 LOW: the row's sub-line names the days too, not "One-off" */
      if(q.rep==="days"){var sub=mb.querySelector(".sub");if(sub)[].forEach.call(sub.childNodes,function(n){if(n.nodeType===3&&n.nodeValue.indexOf("One-off")>=0)n.nodeValue=n.nodeValue.replace("One-off",v87Lbl(q))})}})}catch(e){}
  return r};
htabCss("qb-v187-css",".v87t{min-height:44px;padding:8px 18px;border-radius:999px;border:1px solid var(--line,#3a2a22);background:transparent;color:var(--fg,#fff);font:inherit;font-weight:700;cursor:pointer}.v87t.on{background:#fff;border-color:#fff;color:#0b0e1a}.v87row{display:flex;gap:8px;margin:6px 0 10px}.v87days{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 14px}.v87d{min-width:44px;padding:8px 6px;border-radius:12px;border:1px solid var(--line,#3a2a22);background:transparent;color:var(--fg,#fff);font:inherit;font-weight:700;cursor:pointer}.v87d.on{background:var(--accent,#ff8a3d);border-color:var(--accent,#ff8a3d);color:#140a04}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV187={wd:v87Wd,lbl:v87Lbl,open:v87Open};
