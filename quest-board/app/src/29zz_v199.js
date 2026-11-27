/* ---------- Cal 2026-11-26: the Players board: one place each, a face on every row ----------
   Cal: "Add the player head icons on the other people. Don't put two people on the same rank. If they are the same level, rank them by
   streak length, and if that is the same, rank by who is more rich".
   - Every board (Level, Rich, Style) gives each player a place of their own: a tie on the board's number goes to the longer streak, then
     to more coins earned, then to the higher level, then by name, so the order is the same on every phone.
   - Every row of the list has the player's head (it was only places 4 to 10). */
function v99Sk(p){try{return p.me?Math.max(0,Math.floor(+S.streak||0)):plStreakN(p)}catch(e){return 0}}
var v99Rank=fshRank;fshRank=function(mode){var ps=v99Rank.apply(this,arguments);
  try{var nm=function(p){return String(p.name||"").toLowerCase()},ec=function(p){return p.earnedC==null?-1:+p.earnedC||0};
    ps.sort(function(a,b){return (b.v-a.v)||(v99Sk(b)-v99Sk(a))||(ec(b)-ec(a))||((+b.lv||0)-(+a.lv||0))||(nm(a)<nm(b)?-1:nm(a)>nm(b)?1:0)||(a.id<b.id?-1:a.id>b.id?1:0)});
    ps.forEach(function(p,i){p.place=i+1;if(p.me&&!p.streak)p.streak=v99Sk(p)})}catch(e){}
  return ps};
var V99AV=30;
var v99List=fshList;fshList=function(rk,mode){var h=v99List.apply(this,arguments);
  try{var d=document.createElement("div");d.innerHTML=h;var rows=d.querySelectorAll(".fsh-row"),ch=0;
    [].forEach.call(rows,function(r,i){if(i>=V99AV||r.querySelector(".fsh-av")||!rk[i])return;var p=rk[i],rkEl=r.querySelector(".fsh-rk");if(!rkEl)return;
      rkEl.insertAdjacentHTML("afterend",'<span class="fsh-av">'+(p.look?nbAv(p.look,36):'<span class="calav" style="width:36px;height:36px"></span>')+'</span>');ch=1});
    if(ch)h=d.innerHTML}catch(e){}
  return h};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV199={rank:function(m){return fshRank(m).map(function(p){return {id:p.id,name:p.name,v:p.v,place:p.place,sk:v99Sk(p),ec:p.earnedC}})},list:function(rk,m){return fshList(rk,m)},full:function(m){return fshRank(m)},box:function(){return fshBoxInner()}};
