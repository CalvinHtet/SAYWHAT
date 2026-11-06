/* ---------- the town hall and the weekly town meter (Cal, 2026-11-05, requests 1 and 4) ----------
   1. "turn on the town hall and allow you to post a picture of your character with your current outfit and a short message
      for everyone to read": the Neighbors panel (socialHtml, written earlier, never shown) now opens at the top of the Hall
      tab, and each post carries the poster's look, drawn beside the message.
   4. "a weekly town meter everyone fills ... each player's coins and XP gained, but it should keep the amount of tasks and
      the descriptions of tasks private": every player's world doc carries only this week's coins and XP gained (wk); the
      meter adds them up against a goal of TOWNGOAL XP per player. Nothing about tasks leaves the device.
   Everything here needs the cloud save; on a device-only save the panel says so. */
var TOWNGOAL=2500;
function townWeek(){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return dstr(d)}
function townMine(){var w=townWeek();if(!S.wkg||S.wkg.w!==w)S.wkg={w:w,c0:S.earnedC||0,x0:S.xp||0};return {w:w,c:Math.max(0,(S.earnedC||0)-S.wkg.c0),x:Math.max(0,(S.xp||0)-S.wkg.x0)}}
var townDocBase=socWorldDoc;
socWorldDoc=function(){var d=townDocBase();d.wk=townMine();return d};
function townRows(worlds){var w=townWeek(),me=townMine(),rows=[{name:(S.char&&S.char.name)||"You",c:me.c,x:me.x,me:1}];
  (worlds||[]).forEach(function(o){if(o&&o.wk&&o.wk.w===w)rows.push({name:o.name||"Neighbor",c:+o.wk.c||0,x:+o.wk.x||0})});
  rows.sort(function(a,b){return b.x-a.x});return rows}
function townMeter(worlds){var rows=townRows(worlds),goal=TOWNGOAL*rows.length,sum=rows.reduce(function(a,r){return a+r.x},0),pct=Math.min(100,Math.round(sum/goal*100));
  return '<div class="tw-meter"><div class="row" style="justify-content:space-between"><h3 class="label">Town meter &middot; this week</h3><span class="mono">'+sum.toLocaleString()+' / '+goal.toLocaleString()+' XP</span></div>'
    +'<div class="tw-bar"><i style="width:'+pct+'%"></i></div>'
    +'<div class="tw-rows">'+rows.map(function(r){return '<div class="tw-row'+(r.me?' me':'')+'"><b>'+esc(r.name)+'</b><span class="mono">+'+r.x.toLocaleString()+' XP</span><span class="mono">+'+r.c.toLocaleString()+' coins</span></div>'}).join("")+'</div>'
    +'<p class="note">Everyone fills it together. Only XP and coins are shared, never your tasks.</p></div>'}
var townInnerBase=socInner;
socInner=function(){var h=townInnerBase();if(!db||!MYUID)return h;
  /* posts show the poster's character in the outfit they wore when posting */
  (SOC.posts||[]).forEach(function(p){if(!p.look)return;var key='<div class="snp"><div><b>'+esc(p.name||"Neighbor")+'</b>';h=h.split(key).join('<div class="snp has-look"><div class="snp-fig">'+figSvg(p.look,"30 6 40 40",52,52)+'</div><div><b>'+esc(p.name||"Neighbor")+'</b>')});
  return townMeter(SOC.worlds)+h};
var townHallBase=hallHtml;
hallHtml=function(){var bd=window.QBART&&QBART["ui_town_board.webp"];return '<section class="card panel tw-hall'+(bd?' has-art':'')+'">'+(bd?'<i class="tw-bg" style="background-image:url('+bd+')" aria-hidden="true"></i>':'')+'<h3 class="label">Town hall</h3><p class="note">Post your look and a short message for everyone in town.</p></section>'+socialHtml()+townHallBase()};
/* many players at once (Cal, 2026-11-06: "make sure the town hall works with multiple people using the app and typing on the
   board"): a half-typed post survives every repaint (SOC.draft, focus and caret kept); while the Hall is open the board reloads
   every 20 seconds so others' posts appear on their own; posts newer than the last one this player saw carry a "new" tag. */
document.addEventListener("input",function(e){if(e.target&&e.target.id==="sntext")SOC.draft=e.target.value});
socPaint=function(){var el=document.getElementById("socnb");if(!el)return;var a=document.activeElement,typing=a&&a.id==="sntext",s0=typing?a.selectionStart:0,s1=typing?a.selectionEnd:0;
  el.innerHTML=socInner();if(typing){var t=document.getElementById("sntext");if(t){t.focus();try{t.setSelectionRange(s0,s1)}catch(e){}}}
  var o=socState(),top=(SOC.posts[0]&&SOC.posts[0].t)||0;if(top>(o.boardT||0)){o.boardT=top;persist()}};
var townNewBase=socInner;
socInner=function(){var o=socState(),seen=o.boardT;if(seen===undefined&&SOC.loaded){o.boardT=(SOC.posts[0]&&SOC.posts[0].t)||1;seen=o.boardT}
  var h=townNewBase();if(!seen)return h;
  var now=Date.now(),fr=SOC.fresh||(SOC.fresh={});
  SOC.posts.forEach(function(p){if(p.from!==MYUID&&p.t>seen&&!fr[p.id])fr[p.id]=now});
  SOC.posts.forEach(function(p){if(!fr[p.id]||now-fr[p.id]>120000)return;var at=h.indexOf('<b>'+esc(p.name||"Neighbor")+'</b><small>'+socAgo(p.t||0)+'</small>');
    if(at>=0){var cut=at+('<b>'+esc(p.name||"Neighbor")+'</b>').length;h=h.slice(0,cut)+'<em class="tw-new">new</em>'+h.slice(cut)}});
  return h};
setInterval(function(){if(socOn()&&!document.hidden&&!SOC.busy&&document.getElementById("socnb"))socLoad()},20000);
window.__qbTown={meter:townMeter,mine:townMine,week:townWeek};
