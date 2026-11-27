/* ---------- Cal 2026-11-26 (via APPROVALS): one group, allies ----------
   Cal: "dont have allies and team. Just make them all allies."
   The Crawls tab shows one list, "Your allies": the five who joined through the story and everyone rescued from a dungeon, each with
   their picture, what they do and their buff. The old "Rescued allies" section is gone, and the words players see say ally/allies
   (the welcome window, the lounge, the tutorial, the (i) sheets, the relic texts, the injury window). Code names stay as they are. */
teamHtml=function(){var rows=[];
  try{teamList().forEach(function(id){var t=TEAM[id],art=window.QBART&&QBART["ui_team_"+id+".webp"];
      rows.push('<div class="tm-card" style="--tac:'+t.ac+'">'+(art?'<img src="'+art+'" alt="">':'<i>'+esc(t.name[0])+'</i>')+'<b>'+esc(t.name)+'</b><small>'+esc(t.role)+'</small><span>'+esc(tmBuffTxt(t))+'</span></div>')});
    var D=dngInit();DNPC.forEach(function(n){if(!D.npcs[n.id])return;var L=window.ALLOOK&&ALLOOK[n.id]||null,art=window.QBART&&(QBART["ui_ally_"+n.id+".webp"]||null),nm=L?L.n:n.name.split(" ")[0],
      role=n.name.indexOf(" the ")>0?n.name.slice(n.name.indexOf(" the ")+5):"";
      rows.push('<div class="tm-card" style="--tac:'+((L&&L.c)||"#ffd27a")+'">'+(art?'<img src="'+art+'" alt="">':v220Fig(n.id,nm))+'<b>'+esc(nm)+'</b><small>'+esc(role)+'</small><span>'+esc(n.buff.text)+'</span></div>')})}catch(e){}
  if(!rows.length)return '';
  return '<section class="card panel"><h3 class="label lbi">Your allies'+(typeof qbI==="function"?qbI("allies"):"")+'</h3><div class="tm-grid">'+rows.join("")+'</div></section>'};
/* a rescued ally with no painting yet shows their own figure, not a letter */
function v220Fig(id,nm){try{var L=typeof v210Look==="function"?v210Look("a:"+id):null;if(L)return '<i class="v220fig">'+calImg(L,"still",112,"")+'</i>'}catch(e){}return '<i>'+esc(nm[0])+'</i>'}
htabCss("qb-v220-css",".tm-card>i.v220fig{display:flex;align-items:flex-start;justify-content:center;overflow:hidden;padding-top:0}.tm-card>i.v220fig img{width:auto!important;height:118px!important;max-height:none;object-fit:initial;background:none;border-radius:0;margin-top:-4px}");
var v220Html=dngHtml;dngHtml=function(){var h=v220Html.apply(this,arguments);
  try{var i=h.indexOf('<section class="card panel"><h3 class="label lbi">Rescued allies');if(i>=0){var j=h.indexOf("</section>",i);if(j>i)h=h.slice(0,i)+h.slice(j+10)}}catch(e){}return h};
/* the room and upgrade lines (27_rooms.js) */
function v220Fix(s){return typeof s!=="string"?s:s.replace("makes your team's crawls","makes your allies' crawls").replace("what the team brings home","what your allies bring home")
  .replace("Every set piece your team brings home","Every set piece your allies bring home").replace("your team brings home","your allies bring home")}
try{Object.keys(ADDONS).forEach(function(r){(ADDONS[r]||[]).forEach(function(a){for(var i=0;i<a.length;i++)if(typeof a[i]==="string")a[i]=v220Fix(a[i])})})}catch(e){}
try{Object.keys(ROOMDEF).forEach(function(k){var d=ROOMDEF[k];if(!d)return;d.desc=v220Fix(d.desc);[d.help,ROOMHELP[k]].forEach(function(H){if(!H)return;H.sub=v220Fix(H.sub);(H.pts||[]).forEach(function(p){p[0]=v220Fix(p[0]);p[1]=v220Fix(p[1])})})})}catch(e){}
try{Object.keys(ROOMT).forEach(function(k){if(ROOMT[k]&&typeof ROOMT[k].desc==="string")ROOMT[k].desc=v220Fix(ROOMT[k].desc)})}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV220={html:function(){return teamHtml()}};
