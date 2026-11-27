/* ---------- Cal 2026-11-26: the inbox has Unread and Read ----------
   Cal: "Create an unread and read messages tab in the inbox".
   The letters window has two tabs: Unread (a letter not opened yet, or one whose coins are still waiting) and Read. It opens on Unread
   when anything is in it, else on Read; each tab shows how many it holds. Going back from a letter returns to the tab you were on. */
var V203T="";
function v203Rows(L){return '<div class="iblist">'+L.map(function(l){var un=ibNew(l);
    return '<button class="ibrow'+(un?' un':'')+'" data-ib="open" data-id="'+esc(l.id)+'"><i class="ibdot" aria-hidden="true"></i><span><b>'+esc(l.subj)+'</b><small>'+esc(l.from)+'</small></span><small class="ibd">'+esc(ibDate(ibDay(l)))+'</small></button>'}).join("")+'</div>'}
ibListHtml=function(){var L=ibAll(),un=L.filter(ibNew),rd=L.filter(function(l){return !ibNew(l)});
  var t=V203T==="read"||V203T==="unread"?V203T:(un.length?"unread":"read"),show=t==="unread"?un:rd;
  return '<div class="card box2 ibox"><span class="label">Inbox</span><h2>Letters</h2>'
    +'<nav class="v203tabs" role="tablist"><button type="button" role="tab" class="v203t'+(t==="unread"?" on":"")+'" data-v203="unread" aria-selected="'+(t==="unread")+'">Unread <i>'+un.length+'</i></button>'
    +'<button type="button" role="tab" class="v203t'+(t==="read"?" on":"")+'" data-v203="read" aria-selected="'+(t==="read")+'">Read <i>'+rd.length+'</i></button></nav>'
    +(show.length?v203Rows(show):'<p class="note">'+(t==="unread"?"You're all caught up.":(L.length?"Nothing read yet.":"No letters yet."))+'</p>')+'</div>'};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v203]");if(!b)return;e.preventDefault();e.stopPropagation();V203T=b.getAttribute("data-v203");
  var c=b.closest(".ibox");if(c){var d=document.createElement("div");d.innerHTML=ibListHtml();c.replaceWith(d.firstChild)}},true);
/* the envelope opens on Unread when there is something new */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('.ibbtn[data-ib="list"]');if(b)V203T=""},true);
htabCss("qb-v203-css",".v203tabs{display:flex;gap:8px;margin:8px 0 12px}.v203t{flex:1;min-height:40px;border-radius:999px;border:1px solid var(--line,#2a2f45);background:transparent;color:var(--fg,#fff);font:inherit;font-weight:700;cursor:pointer}"
  +".v203t i{font-style:normal;opacity:.7;margin-left:4px}.v203t.on{background:#fff;border-color:#fff;color:#0b0e1a}.v203t.on i{opacity:.6}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV203={html:function(){return ibListHtml()},tab:function(t){V203T=t||""}};
