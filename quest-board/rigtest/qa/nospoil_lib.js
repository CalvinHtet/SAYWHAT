// SPEC9 (no spoilers) QA: in-page helpers and the spoiler word list. Read only on the game: it moves a save forward through the
// test hooks (window.__qb, __qbRooms, __qbStory) the way the story would, and reads text. Nothing in the game is edited.
const fs = require('fs'), path = require('path');
const SRC = process.env.SRC || 'C:/Users/clvh/qa-wt/qa-wnospoil-adaf255/quest-board/app/src';

// names from the source (they live inside the app's closure)
function srcNames() {
  const rd = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
  const a = rd('10_app_a.js'), fr = rd('29y_free.js'), dg = rd('29d_dungeon.js');
  const dngBlk = a.slice(a.indexOf('var DNG=['), a.indexOf('];', a.indexOf('var DNG=[')));
  const dng = [...dngBlk.matchAll(/name:"([^"]+)",lv:(\d+)/g)].map((m) => ({ name: m[1], lv: +m[2] }));
  const brBlk = a.slice(a.indexOf('var BRANDS=['), a.indexOf('var GITEMS'));
  const brands = [...brBlk.matchAll(/\{id:"([^"]+)",name:"([^"]+)"/g)].map((m) => ({ id: m[1], name: JSON.parse('"' + m[2] + '"') }));
  const rBlk = fr.slice(fr.indexOf('var RELICS2=['), fr.indexOf('];', fr.indexOf('var RELICS2=[')));
  const relics = [...rBlk.matchAll(/\{id:"([^"]+)",tier:"([^"]+)",(?:lv:\d+,)?name:"([^"]+)"/g)].map((m) => ({ id: m[1], tier: m[2], name: m[3] }));
  return { dng, brands, relics };
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// room keywords; each is flagged when the player does not own the room and the story has not offered it yet
const ROOMW = {
  closet: [/\bWalk-in Closet\b/, /\bCloset\b/i], lair: [/Hero's Lair/i, /\bLair\b/i], trophy: [/\bTrophy Room\b/i], patio: [/\bPatio\b/i],
  gameroom: [/\bGame Room\b/i], garden: [/\bGarden\b/i, /\bgardening\b/i], restaurant: [/\bRestaurants?\b/i], boba: [/\bBoba\b/i],
  dessert: [/\bDessert\b/i, /\bparlou?r\b/i], skybar: [/Lock and Key/i, /\bspeakeasy\b/i, /cocktail bar/i, /\bUpstairs Bar\b/i, /\bbar upstairs\b/i],
  rooftop: [/\bRooftop\b/i, /\broof\b/i], mall: [/\bMall\b/i, /\bCalibur\b/i], theater: [/\bTheat(er|re)\b/i, /\bcinema\b/i],
  auditorium: [/\bAuditorium\b/i, /\bIMAX\b/i, /\bscreening room\b/i], arcade: [/\bArcade\b/i], rhythm: [/\bRhythm\b/i], vr: [/\bVR\b/],
  bowling: [/\bBowling\b/i], karaoke: [/\bKaraoke\b/i], club: [/\bNightclub\b/i, /\bclub\b/i],
};
const TEAMW = { mara: /\bMara\b/, rafe: /\bRafe\b|\bCalloway\b/, sable: /\bSable\b/, nova: /\bNova\b/, theo: /\bTheo\b/ };
const PEOPLEW = { desmond: [/\bDesmond\b/, 'skybar'], priya: [/\bPriya\b/, 'mall'] };
const TABW = { hall: [/\bHall\b/, 2], wheel: [/\bWheel\b/i, 6], trophy: [/\bRelics?\b/i, 8], hideout: [/\bThe Loft\b/, 2] };
const SETW = [/Goblin King/i, /\bRegalia\b/i, /Hollow Amulet/i, /\bamulet\b/i, /\bshards?\b/i];

// st: {rooms:[], allows:{room:bool}, team:[], lvl, brandsLive:[], relics2:[], pieces, lair:bool}
function spoilerHits(text, st, names, where) {
  const hits = [], seen = new Set();
  const add = (kind, key, re) => {
    const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); let m;
    while ((m = g.exec(text))) {
      const ctx = text.slice(Math.max(0, m.index - 70), m.index + m[0].length + 70).replace(/\s+/g, ' ');
      const k = kind + key + ctx; if (seen.has(k)) continue; seen.add(k);
      hits.push({ where, kind, key, word: m[0], ctx });
    }
  };
  for (const [room, res] of Object.entries(ROOMW)) {
    if (st.rooms.includes(room) || st.allows[room]) continue;
    // the rooftop's words are also part of other owned names ("Rooftop Bar" is the old bar too): keep it simple, flag them
    res.forEach((re) => add('room', room, re));
  }
  for (const [id, re] of Object.entries(TEAMW)) if (!st.team.includes(id)) add('team', id, re);
  for (const [id, v] of Object.entries(PEOPLEW)) if (!st.rooms.includes(v[1])) add('person', id, v[0]);
  for (const [id, v] of Object.entries(TABW)) if (!st.tabsOpen.includes(id)) add('tab', id, v[0]);
  if (!st.lair) { add('tab', 'away', /\bCrawls?\b/i); add('tab', 'away', /\bdungeons?\b/i); }
  names.dng.forEach((d) => { if (d.lv > st.lvl || !st.lair) add('dungeon', d.name, new RegExp(esc(d.name))) });
  names.brands.forEach((b) => { if (!st.brandsLive.includes(b.id)) add('brand', b.name, new RegExp('\\b' + esc(b.name) + '\\b')) });
  names.relics.forEach((r) => { if (!st.relics2.includes(r.id)) add('relic', r.name, new RegExp(esc(r.name))) });
  if (!st.pieces) SETW.forEach((re) => add('set', 'trophy sets', re));
  return hits;
}

// helpers put into the page once it has loaded
const PAGE = String.raw`window.__ns=(function(){
  var X=function(){return window.__qb.x()};
  var pops=[];new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&n.classList&&n.classList.contains("pop"))pops.push(n.textContent)})})}).observe(document.getElementById("layer"),{childList:true});
  function slot(t){var sl=X().S.base.slots;for(var i=0;i<sl.length;i++)if(sl[i]&&sl[i].t===t)return i;return -1}
  function txt(el,noNav){if(!el)return "";
    var t=el.innerText||"",ex=[];el.querySelectorAll("[aria-label],[title],img[alt]").forEach(function(e){if(e.closest(".qs-dev")||(noNav&&e.closest(".nav")))return;["aria-label","title","alt"].forEach(function(a){var v=e.getAttribute(a);if(v)ex.push("["+a+"] "+v)})});
    el.querySelectorAll("svg text,svg title").forEach(function(e){var v=(e.textContent||"").trim();if(v)ex.push("[svg] "+v)});
    el.querySelectorAll(".qs-dev"+(noNav?",.nav":"")).forEach(function(e){t=t.split(e.innerText).join("")});
    return t+(ex.length?"\n"+ex.join("\n"):"")}
  function modals(){return [].map.call(document.querySelectorAll("#layer .modal"),function(m){m.querySelectorAll("details").forEach(function(d){d.open=true});m.querySelectorAll(".sty-line,.sty-last").forEach(function(p){p.hidden=false});return txt(m)})}
  function closeAll(){var o=[];var ds=document.querySelector(".dropsplash");if(ds){o.push("[dropsplash] "+txt(ds));var x=ds.querySelector(".dsx");if(x)x.click();if(ds.parentNode)ds.remove()}
    document.querySelectorAll("#layer .modal").forEach(function(m){m.remove()});return o}
  function lvl(L){var x=X(),s=x.S;s.xp=Math.max(s.xp||0,x.cum(L));var g,n=0;while((g=x.gated())!==null&&n++<80)s.gates.push(g);
    s.areaOn=s.areaOn||{};var lv=x.effLvl();[["hideout",2],["hall",2],["wheel",6],["trophy",8]].forEach(function(a){if(a[1]<=lv)s.areaOn[a[0]]=1});x.persist();x.render();return lv}
  function earn(n){var s=X().S;s.coins+=n;s.earnedC=(s.earnedC||0)+n;X().persist();return s.earnedC}
  function nextDay(){var o=window.__qbStory.state(),s=X().S;if(o.open)Object.keys(o.open).forEach(function(k){o.open[k].d="2000-01-01"});o.stepDay="";o.later={};o.lastScene=0;s.unlockDay="";s.areaDay="";X().persist();return 1}
  function setUps(t,n,ids){var x=X(),i=slot(t);if(i<0)return -1;var r=x.S.base.slots[i];r.a=r.a||{};(ids||[]).forEach(function(k){r.a[k]=1});
    (x.ADDONS[t]||[]).forEach(function(a){var m=a[3]||{};if(Object.keys(r.a).length>=n)return;if(m.retired||m.opens||m.trophy)return;r.a[a[0]]=1});x.persist();x.render();return Object.keys(r.a).length}
  function state(){var x=X(),s=x.S,o=window.__qbStory.state(),d=window.__qbDrops.state()||{},rooms=s.base.slots.filter(Boolean).map(function(r){return r.t}),al={};
    window.__qbStory.steps.forEach(function(st){if(st.room)al[st.room]=window.__qbStory.allows(st.room)&&!!(o.offer[st.id]||o.done[st.id])});
    var tabs=[].filter.call(document.querySelectorAll(".nav button"),function(b){return !b.classList.contains("lk")}).map(function(b){return b.dataset.v});
    return {rooms:rooms,allows:al,team:Object.keys(o.team||{}).filter(function(k){return o.team[k]}),lvl:x.effLvl(),coins:s.coins,earned:s.earnedC,
      brandsLive:[].concat((d.live||[]).map(function(b){return b.id}),(d.vault||[]).map(function(b){return b.id})),relics2:Object.keys(s.relics2||{}),
      pieces:Object.keys(s.trophy||{}).reduce(function(a,k){return a+Object.keys(s.trophy[k]||{}).length},0),lair:rooms.indexOf("lair")>=0,tabsOpen:tabs,
      done:Object.keys(o.done),offer:Object.keys(o.offer)}}
  function check(){closeAll();window.__qbStory.check();return modals()}
  function yes(){var b=document.querySelector("#layer [data-act=styyes]");if(!b)return "no yes button";var t=b.textContent;b.click();return t}
  function nav(v){var b=document.querySelector('.nav button[data-v="'+v+'"]');if(!b)return "absent";b.click();return (b.classList.contains("lk")?"locked: ":"")+b.getAttribute("aria-label")}
  function navInfo(){return [].map.call(document.querySelectorAll(".nav button"),function(b){return "label: "+b.innerText.replace(/\s+/g," ").trim()+" | aria: "+b.getAttribute("aria-label")+(b.classList.contains("lk")?" | locked":"")})}
  function room(t){closeAll();var i=slot(t);if(i<0)return null;window.__qb.roomModal(i);return 1}
  function help(){var b=document.querySelector("#layer .rmodal [data-act=rhelp]");if(!b)return null;b.click();var m=document.querySelectorAll("#layer .modal");return m.length?txt(m[m.length-1]):null}
  function buy(t,id){var i=slot(t);if(i<0)return "no room";closeAll();window.__qb.roomModal(i);var b=document.querySelector('#layer [data-act=raddon][data-id="'+id+'"]');if(!b)return "no button for "+id;b.click();return "bought "+id}
  function buyFirst(t){var i=slot(t);if(i<0)return "no room";closeAll();window.__qb.roomModal(i);var b=[].filter.call(document.querySelectorAll('#layer [data-act=raddon]'),function(e){return !e.classList.contains("ghost")})[0];if(!b)return "none buyable";var id=b.dataset.id;b.click();return id}
  return {X:X,pops:pops,slot:slot,txt:txt,modals:modals,closeAll:closeAll,lvl:lvl,earn:earn,nextDay:nextDay,setUps:setUps,state:state,check:check,yes:yes,nav:nav,navInfo:navInfo,room:room,help:help,buy:buy,buyFirst:buyFirst}})();1`;

module.exports = { srcNames, spoilerHits, PAGE, ROOMW };
