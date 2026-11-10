/* ---------- the building's Goals (SPEC8 part 3; Cal, 2026-11-10: "there should be a goal or quest log in the building view such as
   fully upgraded the bedroom which gives you a little bit of experience and some coins as a reward") ----------
   One list per building: each room half and fully upgraded, and each story step's trigger once the room it happens in is yours.
   A goal that is met waits for a tap (an old save gets no flood of coins) and pays once: S.goals[id] is when it was claimed.
   Rewards are ECON.goal, the coins x the room's price phase. The building view shows a Goals button (with the number ready) and
   a "Next goal" line, the first goal not met yet. Goal lines say what to do, never what opens (VOICE.md "No spoilers"). */
function glState(){if(!S.goals||typeof S.goals!=="object")S.goals={};return S.goals}
function glCoins(k,t){return Math.round(ECON.goal[k][0]*((ECON.phase||{})[t]||1)/50)*50}
/* the building a story step's trigger happens in, while that room is the player's (else it is not shown) */
function glSrcBld(s){var t=unlockSrc(s.room);return t&&slotOf(t)&&ROOMCELL[t]?ROOMCELL[t][0]:-1}
function glList(bi){var out=[],G=ECON.goal,o=styState(),st=glState();
  S.base.slots.forEach(function(r){if(!r||!ROOMCELL[r.t]||ROOMCELL[r.t][0]!==bi)return;var f=roomFill(r),nm=rmName(r.t);if(!f.tot)return;
    out.push({id:"half:"+r.t,txt:nm+": half upgraded",met:f.n>=f.half,prog:f.n+" bought",fr:f.half?Math.min(1,f.n/f.half):1,c:glCoins("half",r.t),xp:G.half[1],ord:1});
    out.push({id:"full:"+r.t,txt:nm+": fully upgraded",met:f.n>=f.tot,prog:f.n+" bought",fr:f.tot?Math.min(1,f.n/f.tot):1,c:glCoins("full",r.t),xp:G.full[1],ord:3})});
  STORY.forEach(function(s){if(!s.room||s.how==="never"||glSrcBld(s)!==bi)return;var tr=null;try{tr=styTrig(s)}catch(e){}if(!tr)return;
    var done=!!(o.done[s.id]||o.offer[s.id]||styHas(s.room));
    out.push({id:"story:"+s.id,txt:tr[4]||tr[2],met:done||tr[1],prog:tr[5]||"",fr:tr[3],c:glCoins("story",s.room),xp:G.story[1],ord:2})});
  out.forEach(function(g){g.got=!!st[g.id]});
  return out.sort(function(a,b){return a.ord-b.ord})}
function glReady(bi){return glList(bi).filter(function(g){return g.met&&!g.got}).length}
function glBtn(bi){var n=glReady(bi);return '<button class="btn ghost glbtn" data-gl="open" data-b="'+bi+'" aria-label="Goals'+(n?', '+n+' ready':'')+'">Goals'+(n?'<i>'+n+'</i>':'')+'</button>'}
/* "Next goal": the first one not met yet; with none left, the ones waiting for a tap */
function glNextHtml(bi){var L=glList(bi),g=L.filter(function(x){return !x.met})[0],n=L.filter(function(x){return x.met&&!x.got}).length;
  if(g)return '<div class="glnext mono" data-gl="open" data-b="'+bi+'">Next goal: '+esc(g.txt)+(g.prog?' &middot; '+esc(g.prog):'')+'</div>';
  return n?'<div class="glnext mono" data-gl="open" data-b="'+bi+'">'+n+' goal'+(n>1?'s':'')+' ready to claim</div>':''}
function glHtml(bi){var L=glList(bi);
  return '<div class="card box2 glbox"><span class="label">'+esc((BLD[bi]||{}).name||"")+'</span><h2>Goals</h2>'
    +(L.length?'<div class="gllist">'+L.map(function(g){
      return '<div class="glrow'+(g.got?' got':g.met?' ready':'')+'"><span class="glck" aria-hidden="true">'+(g.got||g.met?'✓':'')+'</span><span class="gltx"><b>'+esc(g.txt)+'</b><small>'
        +(g.prog&&!g.met?esc(g.prog)+' &middot; ':'')+'+'+g.c.toLocaleString()+' coins &middot; +'+g.xp+' XP</small>'+(g.fr!=null&&!g.met?'<i class="stybar"><i style="width:'+Math.round(g.fr*100)+'%"></i></i>':'')+'</span>'
        +(g.got?'<small class="glgot">Claimed</small>':g.met?'<button class="btn sm" data-gl="claim" data-id="'+esc(g.id)+'" data-b="'+bi+'">Claim</button>':'')+'</div>'}).join("")+'</div>'
      :'<p class="note">Nothing here yet.</p>')
    +'<div class="btns"><button class="btn ghost" data-act="mclose">Close</button></div></div>'}
function glOpen(bi){closeModals();var m=modal(glHtml(bi));if(m)m.classList.add("glmodal")}
/* a goal's reward, once */
function glClaim(id,bi){var g=glList(bi).filter(function(x){return x.id===id})[0],st=glState();if(!g||!g.met||st[id])return;
  st[id]=Date.now();grantXp(g.xp,g.c,null);try{burst(innerWidth/2,innerHeight/3,24)}catch(e){}pop("+"+g.c.toLocaleString()+" coins, +"+g.xp+" XP");glOpen(bi)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-gl]");if(!b)return;var k=b.dataset.gl,bi=+b.dataset.b;
  if(k==="open"){glOpen(bi);return}
  if(k==="claim"){glClaim(b.dataset.id,bi);return}});
/* the room window's stats line: half and full marks (SPEC8 part 4) */
var glStatsBase=rmStats;rmStats=function(r,i,base){var s=glStatsBase(r,i,base),f=roomFill(r);if(!f.tot||!s)return s;
  /* w-unlock (Cal): no totals, so only the marks already reached show */
  return f.n>=f.tot?s+". Fully upgraded ✓":f.n>=f.half?s+". Half upgraded ✓":s};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbGoals={list:glList,claim:glClaim,ready:glReady,fill:function(t){var r=slotOf(t);return r?roomFill(r):null},
  unlock:unlockLine,steps:function(){var o=styState();return STORY.filter(function(s){return s.room&&s.how!=="never"}).map(function(s){var g=null;try{g=!!s.gate()}catch(e){g="err"}return {id:s.id,room:s.room,open:!!(o.done[s.id]||o.offer[s.id]||styHas(s.room)),gate:g,lv:ECON.stepLv[s.id]||0,tr:(styTriggers(s)||[]).map(function(x){return (x[1]?"+":"-")+x[2]})}})},claimAll:function(){var n=0,c=0;[0,1,2].forEach(function(bi){glList(bi).forEach(function(g){if(g.met&&!g.got){glState()[g.id]=Date.now();grantXp(g.xp,g.c,null);n++;c+=g.c}})});return {n:n,c:c}}};
