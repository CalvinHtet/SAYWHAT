/* ---------- your team (Cal, 2026-11-05) ----------
   Five people who join through the story and the dungeons. Each has base stats, a buff that helps progression, a join banner
   (art/app/ui_team_<id>.webp, anime style, from ROOMS) and a signature look, so in the building view they stand out from the
   guests (ROOMS draws them in their rooms from TEAM[id].look). They also lead the Lair's missions before any hired hands. */
var TEAM={
  sable:{name:"Sable",role:"Scout",how:"Found trapped below the city on your first mission. Stayed to repay the favor.",
    stats:{Cook:2,Charm:4,Hustle:6,Grit:9,Luck:7},buff:{text:"Missions pay 10% more coins",mission:.10},
    look:{body:"f",hairStyle:"h3",hairColor:"black",equipped:{top:{art:"al_shell"},hat:{art:"y_bucket"}}},ac:"#4dffc3"},
  mara:{name:"Mara",role:"Chef",how:"Bought your vegetables all week, then partnered on the restaurant.",
    stats:{Cook:9,Charm:6,Hustle:7,Grit:5,Luck:4},buff:{text:"Restaurant, Boba and Dessert earn 15% more",rooms:["restaurant","boba","dessert"],pct:15},
    look:{body:"f",hairStyle:"h2",hairColor:"brown",equipped:{top:{art:"npc_chef"},hat:{art:"npc_hat"}}},ac:"#ffb066"},
  rafe:{name:"Rafe Calloway",role:"Traveling adventurer",how:"Came in for an Old Fashioned between expeditions. Now the bar fills up whenever he tells a story.",
    stats:{Cook:3,Charm:10,Hustle:4,Grit:8,Luck:8},buff:{text:"Lock and Key and the Rooftop earn 15% more: people come to hear his stories",rooms:["skybar","rooftop"],pct:15},
    look:{body:"m",hairStyle:"h1",hairColor:"brown",equipped:{top:{art:"al_anorak"},hat:{art:"y_bucket"}}},ac:"#d4a8ff"},
  nova:{name:"Nova Lin",role:"Fashion vlogger",how:"Filmed a haul outside your clothing store. Her followers have been shopping here ever since.",
    stats:{Cook:2,Charm:9,Hustle:9,Grit:4,Luck:6},buff:{text:"The mall and its venues earn 10% more: her followers come to shop",rooms:["mall","arcade","rhythm","vr","bowling","karaoke","club"],pct:10},
    look:{body:"f",hairStyle:"h2",hairColor:"black",equipped:{top:{art:"y_baby"},hat:{art:"y_bucket"}}},ac:"#ff6a9a"},
  theo:{name:"Theo",role:"Theater crew",how:"Applied the day the ticket stand went up. Runs the whole theater now.",
    stats:{Cook:4,Charm:7,Hustle:6,Grit:6,Luck:5},buff:{text:"The Theater and Auditorium earn 20% more",rooms:["theater","auditorium"],pct:20},
    look:{body:"m",hairStyle:"h1",hairColor:"brown",equipped:{top:{art:"h_varsity"},hat:{art:"h_snap"}}},ac:"#ffd36b"}
};
function teamHas(id){return !!(S.story&&S.story.team&&S.story.team[id])}
function teamList(){return Object.keys(TEAM).filter(teamHas)}
/* the welcome: a banner, their stats and what they bring */
function teamJoin(id){var t=TEAM[id];if(!t)return;var o=styState();o.team[id]=1;persist();
  var art=window.QBART&&QBART["ui_team_"+id+".webp"],ini=t.name.split(" ").map(function(w){return w[0]}).join("").slice(0,2);
  var bars=Object.keys(t.stats).map(function(k){return '<div class="tm-st"><span>'+k+'</span><i><b style="width:'+(t.stats[k]*10)+'%"></b></i><em>'+t.stats[k]+'</em></div>'}).join("");
  setTimeout(function(){modal('<div class="card box2 tmj" style="--tac:'+t.ac+'"><span class="label">New team member</span>'
    +(art?'<img class="tmj-art" src="'+art+'" alt="">':'<div class="tmj-art tmj-art0"><b>'+esc(ini)+'</b></div>')
    +'<h2>'+esc(t.name)+'</h2><span class="chip">'+esc(t.role)+'</span><p class="note">'+esc(t.how)+'</p>'+bars
    +'<p class="tmj-buff">'+esc(t.buff.text)+'</p><div class="row"><button class="btn" data-act="mclose">Welcome aboard</button></div></div>');try{burst(innerWidth/2,innerHeight/3,30)}catch(e){}},400)}
/* their buffs: business rooms earn more, missions pay more */
var teamRoomMultBase=roomMult;
roomMult=function(i){var m=teamRoomMultBase(i),r=bslot(i);if(!r)return m;var k=S.cls==="tamer"?1.5:1;/* the Tamer's Bond: team buffs 50% stronger */teamList().forEach(function(id){var b=TEAM[id].buff;if(b.rooms&&b.rooms.indexOf(r.t)>=0)m*=1+k*b.pct/100});return m};
var teamMsPayBase=msPay;
msPay=function(q){var p=teamMsPayBase(q),f=1,k=S.cls==="tamer"?1.5:1;teamList().forEach(function(id){f+=k*(TEAM[id].buff.mission||0)});return {c:Math.round(p.c*f),x:Math.round(p.x*f)}};
/* team members lead the missions; hired hands fill the rest */
var teamHeroesBase=msHeroes;
msHeroes=function(){var base=teamHeroesBase(),names=teamList().map(function(id){return TEAM[id].name.split(" ")[0]});return names.concat(base.filter(function(n){return names.indexOf(n)<0})).slice(0,Math.max(base.length,names.length))};
/* Sable: the first mission home brings someone back with it */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=msclaim]");if(!b||teamHas("sable"))return;setTimeout(function(){if(!teamHas("sable"))teamJoin("sable")},900)});
/* the team, on the Dungeons tab above the missions */
function teamHtml(){var ids=teamList();if(!ids.length)return '';
  return '<section class="card panel"><h3 class="label">Your team</h3><div class="tm-grid">'+ids.map(function(id){var t=TEAM[id],art=window.QBART&&QBART["ui_team_"+id+".webp"];
    return '<div class="tm-card" style="--tac:'+t.ac+'">'+(art?'<img src="'+art+'" alt="">':'<i>'+esc(t.name[0])+'</i>')+'<b>'+esc(t.name)+'</b><small>'+esc(t.role)+'</small><span>'+esc(t.buff.text)+'</span></div>'}).join("")+'</div></section>'}
var teamAwayBase=awayHtml;awayHtml=function(){return teamHtml()+teamAwayBase()};
/* class pictures: a man's and a woman's version when ROOMS has painted them (ui_class_<id>_m.webp, _f.webp) */
function clsArt(id){var x=(S.char&&S.char.sex)==="f"?"f":"m",u=window.QBART&&QBART["ui_class_"+id+"_"+x+".webp"];return u||ART["class_"+id]}
window.__qbTeam={join:teamJoin,list:teamList,TEAM:TEAM};
