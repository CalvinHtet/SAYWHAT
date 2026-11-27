/* ---------- Cal 2026-11-26: who goes matters; chests; injuries; fixed pay ----------
   Cal: "When there are more people in your team, allow us to choose who goes on the crawl. Different characters should have different perks
   but make it easy to understand. Like 15% higher chance to recover a relic or rescue a new member ... Remove the '3 rare left' and replace
   it with 3 treasure chest icons that are lit up. When someone comes back from the crawl with an item in that dungeon, the chest remains
   but is no longer lit up ... For the risky dungeons, have scenarios where the team members can come back injured for 1 - 3 days if they are
   not strong enough for it. Have a splash screen that shows that character injured. Use a detailed picture ... Make sure the rewards for
   these dungeon crawls make sense and are not too little or too crazy and legendary. Maybe we should make these rewards fixed instead of
   random? I'll leave it up to you".
   - Who goes: with two or more free, Crawl asks (29zz_v210.js); each face now carries its one perk, in plain words.
   - Perks (one each): a better chance of a rare find, more coins, back sooner, a better chance the find is someone rescued or a relic
     piece, never injured, half the injury risk.
   - Pay is fixed: each dungeon pays the middle of its old range (Cellar 55 up to the Spire 300), shown on its card, times the day's quest
     effort as before. No more random big hauls. Rare finds stay a chance (the reason to keep going back).
   - Each dungeon shows one chest per rare thing it hides: lit while still there, dark once your team brought it home.
   - Risky and Dangerous dungeons (by your level, as the cards say) can send someone home injured: Risky 1 day, 20%; Dangerous 1 to 3 days,
     40%. An injured teammate rests (not in the lounge, not pickable) until then; a window shows them hurt (ROOMS's painted picture
     ui_hurt_<id>.webp once made; until then their portrait with a bandage). */
var V214PERK={"t:sable":{t:"+15% chance of a rare find",rare:.15},"t:mara":{t:"+15% coins",coins:.15},"t:rafe":{t:"Never gets injured",safe:1},"t:nova":{t:"Back 25% sooner",time:.25},
  "t:theo":{t:"+15% chance the find is someone to rescue",rare:.15,pref:"ally"},"a:pip":{t:"+10% coins",coins:.10},"a:kit":{t:"Back 20% sooner",time:.20},"a:bram":{t:"+10% chance of a rare find",rare:.10},
  "a:juno":{t:"Half the injury risk",tough:.5},"a:neo":{t:"+15% coins",coins:.15},"a:sera":{t:"+15% chance the find is a relic piece",rare:.15,pref:"piece"}};
function v214Perk(k){return V214PERK[k]||null}
function v214Pay(d){return Math.round((d.c[0]+d.c[1])/2/5)*5}
/* ---- injuries ---- */
function v214Hurt(){var D=dngInit();if(!D.hurt||typeof D.hurt!=="object")D.hurt={};var t=today();Object.keys(D.hurt).forEach(function(k){if(D.hurt[k].until<=t)delete D.hurt[k]});return D.hurt}
function v214Days(k){var h=v214Hurt()[k];if(!h)return 0;return Math.max(1,Math.round((ymdN(h.until)-ymdN(today()))))}
var v214Free=v210Free;v210Free=function(){var H=v214Hurt();return v214Free.apply(this,arguments).filter(function(k){return !H[k]})};
/* ---- the run: fixed pay, back sooner ---- */
var v214Roll=dngRoll;dngRoll=function(d){var r=v214Roll.apply(this,arguments);try{r.c=v214Pay(d);if(r.bad)r.c=Math.round(r.c*.5);r.lv=effLvl()}catch(e){}return r};
var v214Start=dngStart;dngStart=function(id){var D=dngInit(),n0=D.runs.length,r=v214Start.apply(this,arguments);
  try{if(D.runs.length>n0){var run=D.runs[D.runs.length-1],P=v214Perk(run.who);if(P&&P.time){run.end=run.start+Math.round((run.end-run.start)*(1-P.time));persist();render()}}}catch(e){}return r};
/* ---- the claim: more coins, a better chance, the kind of find, and maybe an injury ---- */
var V214CUR=null;
var v214Chance=crawlChance;crawlChance=function(){var c=v214Chance.apply(this,arguments);try{var P=V214CUR&&v214Perk(V214CUR.who);if(P&&P.rare)c+=P.rare}catch(e){}return c};
var v214Hidden=crawlHidden;crawlHidden=function(d){var out=v214Hidden.apply(this,arguments);try{var P=V214CUR&&v214Perk(V214CUR.who);if(P&&P.pref){var f=out.filter(function(g){return g.kind===P.pref});if(f.length)return f}}catch(e){}return out};
function v214Risk(r,d){var lv=r.lv||effLvl(),rec=dngRec(d);return lv>=rec?0:lv>=rec-2?1:2}
var V214SHOW=[];
var v214Claim=dngClaim;dngClaim=function(k,ev){var D=dngInit(),r=D.runs[k];if(!r||Date.now()<r.end)return v214Claim.apply(this,arguments);
  var d=DNG.filter(function(q){return q.id===r.id})[0]||DNG[0],P=v214Perk(r.who),who=r.who;
  try{if(P&&P.coins)r.c=Math.round(r.c*(1+P.coins))}catch(e){}
  V214CUR=r;var out;try{out=v214Claim.apply(this,arguments)}finally{V214CUR=null}
  try{var risk=v214Risk(r,d);if(who&&risk&&!(P&&P.safe)){var ch=(risk===1?.20:.40)*(P&&P.tough?P.tough:1);
      if(Math.random()<ch){var days=risk===1?1:1+Math.floor(Math.random()*3);v214Hurt()[who]={until:ymdAdd(today(),days),d:d.id,t:Date.now()};persist();V214SHOW.push({k:who,days:days,d:d.name})}}}catch(e){}
  return out};
/* the injury window, once nothing else is open */
function v214Pic(k){var p=k.split(":"),id=p[1];try{var u=window.QBART&&(QBART["ui_hurt_"+id+".webp"]||null);if(u)return {u:u,real:1};
    var t=window.QBART&&(QBART["ui_team_"+id+".webp"]||QBART["ui_ally_"+id+".webp"]||QBART["ui_story_"+id+".webp"]);if(t)return {u:t,real:0}}catch(e){}return null}
setInterval(function(){try{if(!V214SHOW.length||document.querySelector("#layer .modal,#layer .qb-held"))return;var s=V214SHOW.shift(),pic=v214Pic(s.k),L=v210Look(s.k);
    modal('<div class="card box2 v214hurt"><span class="label">Back from '+esc(s.d)+'</span><h2 style="font-size:26px">'+esc(v210Name(s.k))+' is hurt</h2>'
      +'<div class="v214pic">'+(pic?'<img src="'+esc(pic.u)+'" alt="">'+(pic.real?'':'<i class="v214band" aria-hidden="true"></i>'):(L?calImg(L,"still",200,""):''))+'</div>'
      +'<p class="note">That dungeon was more than '+esc(v210Name(s.k))+' was ready for. Resting for '+s.days+' day'+(s.days>1?'s':'')+', then back on the team. A stronger level, or a tougher teammate, keeps this from happening.</p>'
      +'<div class="btns"><button class="btn" data-act="mclose">Get well soon</button></div></div>')}catch(e){}},1500);
/* ---- the screen: pay and chests on each dungeon, perks in the picker and the team ---- */
function v214Chests(d){var tot=0,left=0;try{(DGLOOT[d.id]||[]).forEach(function(L){tot+=L[1].length});DNPC.forEach(function(n){if(n.d===d.id)tot++});if(DGWEAR.from.indexOf(d.id)>=0)tot++;left=crawlLeft(d)}catch(e){}
  if(!tot)return "";var h='<span class="v214ch" aria-label="'+left+' of '+tot+' treasures still hidden">';for(var i=0;i<tot;i++)h+='<i class="v214c'+(i<left?' lit':'')+'"></i>';return h+'</span>'}
var v214Html=dngHtml;dngHtml=function(){var h=v214Html.apply(this,arguments);
  try{DNG.forEach(function(d){var key='<b>'+d.ic+' '+esc(d.name)+'</b>',i=h.indexOf(key);if(i<0)return;var j=h.indexOf('<div class="dmeta mono">',i);if(j<0)return;var e=h.indexOf('</div>',j);if(e<0)return;
      var meta=h.slice(j,e).replace(/<span>Loot: [^<]*<\/span>/,'<span>+'+v214Pay(d)+' coins</span>').replace(/<span>\d+ rare left<\/span>/,'');h=h.slice(0,j)+meta+'</div>'+v214Chests(d)+h.slice(e+6)});
    /* who is resting */
    var H=v214Hurt(),ks=Object.keys(H);if(ks.length){var row='<div class="v214rest"><b>Resting</b> '+ks.map(function(k){var n=v214Days(k);return esc(v210Name(k))+' <small class="note">('+n+' day'+(n>1?'s':'')+')</small>'}).join(", ")+'</div>';h=h.replace('<div class="v210cap">',row+'<div class="v210cap">')}
  }catch(e){}return h};
v210Pick=function(id,free){try{closeModals()}catch(e){}var d=DNG.filter(function(q){return q.id===id})[0],risk=d?v214Risk({lv:effLvl()},d):0;
  modal('<div class="card box2 v210pick"><span class="label">Who goes?</span><h2 style="font-size:24px">'+esc(d?d.name:"The dungeon")+'</h2>'+(risk?'<p class="note v214warn">'+(risk===1?'Risky at your level: whoever goes may come back hurt for a day.':'Dangerous at your level: whoever goes may come back hurt for up to 3 days.')+'</p>':'')+'<div class="v210pk">'
    +free.map(function(k){var L=v210Look(k),P=v214Perk(k);return '<button type="button" class="v210who" data-v210go="'+esc(id)+'" data-who="'+esc(k)+'" style="--c:'+v210Col(k)+'">'+(L?calImg(L,"still",72,""):'')+'<b>'+esc(v210Name(k))+'</b>'+(P?'<small class="v214perk">'+esc(P.t)+'</small>':'')+'</button>'}).join("")
    +'</div><div class="btns"><button class="btn ghost" data-act="mclose">Cancel</button></div></div>')};
htabCss("qb-v214-css",".v214ch{display:flex;gap:6px;margin:8px 0 2px}.v214c{width:22px;height:18px;display:inline-block;border-radius:4px 4px 3px 3px;background:linear-gradient(#5a4536 0 42%,#3a2c22 42% 48%,#4a3828 48%);border:1px solid #2a1f18;position:relative;opacity:.45}"
  +".v214c::after{content:'';position:absolute;left:50%;top:38%;width:5px;height:6px;margin-left:-2.5px;background:#6b5a3a;border-radius:1px}"
  +".v214c.lit{opacity:1;background:linear-gradient(#a8662a 0 42%,#e7b14a 42% 48%,#8a4f1e 48%);border-color:#ffd27a;box-shadow:0 0 10px rgba(255,200,90,.7)}.v214c.lit::after{background:#fff2b0}"
  +".v214perk{display:block;font-size:11px;line-height:1.25;color:var(--muted,#c9bba8);text-align:center}.v210who{width:110px!important}.v214warn{color:#ffb066}"
  +".v214pic{position:relative;margin:10px auto;max-width:260px;border-radius:14px;overflow:hidden}.v214pic img{display:block;width:100%}.v214band{position:absolute;left:22%;top:16%;width:56%;height:9%;background:repeating-linear-gradient(90deg,#f3ead8 0 8px,#e6dcc6 8px 9px);transform:rotate(-14deg);border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.35)}"
  +".v214rest{padding:6px 14px 0;font-size:13px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV214={perk:v214Perk,pay:v214Pay,hurt:v214Hurt,show:V214SHOW,chests:v214Chests};
