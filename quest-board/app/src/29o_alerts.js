/* ---------- "Something new" alerts (Cal, 2026-11-07: "If there's a new major update like expanding to the restaurant or adding a
   new room, make sure it's obvious by adding an exclamation point on that tab, also allow the + icon for the room in the building
   view, and an exclamation point animation on the building view to let players know there is something exciting to add like a
   new room or new shop or new feature") ----------
   What counts:
   - a new room you can add now: a lot the story has opened (its level reached), or an upgrade that opens a room ("Knock Through
     to a Restaurant", "Open the Auditorium", ...) that the room window would sell right now (story allows it, nothing it needs is
     missing), whether or not the coins are there yet;
   - a tab that just unlocked (Shop, Hall, Wheel, Relics, Dungeons, ...), until it is first opened;
   - a new brand in the Shop, until the Shop is opened while it is live.
   Where it shows:
   - a bouncing "!" on the tab: The Loft for rooms, the tab itself for a new area, the Shop for a new brand; gone once that tab is
     opened (rooms: once The Loft is opened after the room became available);
   - in the street view, a bouncing "!" over each building with a new room in it you have not looked at yet (gone once you go in);
   - inside the building, a "+" on the spot the new room will take, until it is built; tapping it opens the room window that sells
     it, where that upgrade is listed first. Lots already had their "+"; they get the "!" too. */
function alSeen(){if(!S.alSeen||typeof S.alSeen!=="object")S.alSeen={};var o=S.alSeen;o.room=o.room||{};o.bld=o.bld||{};o.tab=o.tab||{};o.brand=o.brand||{};
  /* first run on a save: what is already open counts as seen, so an old save does not light every tab at once */
  if(!o.init&&loaded&&S.created){o.init=1;try{AREAS.forEach(function(a){if(!areaGate(a[0]))o.tab[a[0]]=1});dropState().live.forEach(function(b){o.brand[b.id]=1})}catch(e){}}
  return o}
/* the upgrades that would open a room now: [{room, slot, id, name}] */
function alOpeners(){var out=[];if(!S||!S.base)return out;
  S.base.slots.forEach(function(r,i){if(!r)return;(ADDONS[r.t]||[]).forEach(function(a){var e=a[3]||{};if(!e.opens||e.retired||(r.a&&r.a[a[0]])||hasRoom(e.opens))return;
    var pre=typeof ADDREQ!=="undefined"&&ADDREQ[a[0]];if(pre&&!(r.a&&r.a[pre]))return;
    if(e.trophy&&typeof dgPieces==="function"&&!dgPieces())return;
    if(typeof styAllows==="function"&&!styAllows(e.opens))return;
    if(e.also&&!(r.a&&r.a[e.also]))return;if(e.req&&!hasRoom(e.req))return;if(e.served&&(S.base.served||0)<e.served)return;
    if(out.some(function(x){return x.room===e.opens}))return;
    out.push({room:e.opens,slot:i,id:a[0],name:a[1]})})});return out}
/* every new room on offer: openers plus open lots whose level is reached */
function alRooms(){var out=alOpeners().map(function(x){return Object.assign({lot:0},x)});
  try{lotsOpen().forEach(function(k){if(ROOMT[k]&&effLvl()>=ROOMT[k].lv&&!out.some(function(x){return x.room===k}))out.push({room:k,lot:1})})}catch(e){}
  return out.filter(function(x){return ROOMCELL[x.room]})}
function alTabs(){var o=alSeen(),t={};if(!o.init)return t;
  if(alRooms().some(function(x){return !o.room[x.room]}))t.hideout=1;
  try{AREAS.forEach(function(a){if(a[0]!=="hideout"&&!areaGate(a[0])&&!o.tab[a[0]])t[a[0]]=1})}catch(e){}
  try{if(!areaGate("shop")&&dropState().live.some(function(b){return !o.brand[b.id]}))t.shop=1}catch(e){}
  return t}
/* opening a tab clears its "!" */
function alVisit(){if(!S||!S.created||!loaded)return;var o=alSeen();if(!o.init)return;var ch=0;
  if(!o.tab[view]){o.tab[view]=1;ch=1}
  if(view==="hideout")alRooms().forEach(function(x){if(!o.room[x.room]){o.room[x.room]=1;ch=1}});
  if(view==="shop")try{dropState().live.forEach(function(b){if(!o.brand[b.id]){o.brand[b.id]=1;ch=1}})}catch(e){}
  if(view==="hideout"&&typeof LFBSEL!=="undefined"&&LFBSEL!=null)alRooms().forEach(function(x){if(ROOMCELL[x.room][0]===LFBSEL&&!o.bld[x.room]){o.bld[x.room]=1;ch=1}});
  if(ch)persist()}
function alPaint(){var t=alTabs();document.querySelectorAll(".nav button[data-v]").forEach(function(b){var on=!!t[b.dataset.v]&&b.dataset.v!==view,el=b.querySelector(".nbang");
    if(on&&!el){el=document.createElement("i");el.className="nbang";el.setAttribute("aria-label","New");el.textContent="!";b.appendChild(el)}else if(!on&&el)el.remove()})}
var alRenderBase=render;
render=function(){var r=alRenderBase.apply(this,arguments);try{alVisit();alPaint()}catch(e){}return r};
setInterval(function(){try{if(S&&S.created&&loaded)alPaint()}catch(e){}},15000);
/* the building view: "!" over buildings (street) and "+" on the new room's spot (inside) */
function alBang(x,y,k){return '<g class="albang" pointer-events="none" transform="translate('+x.toFixed(0)+','+y.toFixed(0)+') scale('+k+')"><g class="albob"><circle r="40" fill="#ffc857" stroke="#14121c" stroke-width="6"/><path d="M0 -22V6" stroke="#14121c" stroke-width="11" stroke-linecap="round"/><circle cy="20" r="6.5" fill="#14121c"/></g></g>'}
function alPlus(x,y,slot,name){return '<g class="lfroom alplus" transform="translate('+x.toFixed(0)+','+y.toFixed(0)+') scale(2.2)"><g data-lf="room:'+slot+'" style="cursor:pointer"><rect x="-90" y="-90" width="180" height="180" fill="rgba(0,0,0,.001)"/><g class="lfplus"><circle r="34" fill="rgba(20,18,28,.8)" stroke="#ffc857" stroke-width="3" stroke-dasharray="7 5"/><path d="M-14 0H14M0 -14V14" stroke="#ffc857" stroke-width="5" stroke-linecap="round"/></g><rect x="-150" y="44" width="300" height="44" rx="22" fill="#14121c" stroke="#ffc857" stroke-width="2"/><text y="73" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="Inter,system-ui,sans-serif">'+esc(name)+'</text></g></g>'}
function alWorldExtra(){var L=window.LFLAY;if(!L||!S||!S.base)return '';var o=alSeen(),rooms=alRooms(),s='',bot=LFROOF+L.rows*LFFP;
  if(LFBSEL==null){
    bldList().forEach(function(b,n){var fresh=rooms.some(function(x){return ROOMCELL[x.room][0]===b.bi&&!o.bld[x.room]});if(!fresh)return;
      var x=60+n*(BLDW+BLDGAP),top=bot-(b.f*BLDF+160);s+=alBang(x+BLDW+10,top-200,1.6)});
    var nb=bldList().length;try{streetLots().forEach(function(k,j){if(effLvl()<ROOMT[k].lv||o.bld[k])return;s+=alBang(60+(nb+j)*(BLDW+BLDGAP)+BLDW/2,bot-230,1.4)})}catch(e){}
  }else{
    rooms.forEach(function(x){if(x.lot||ROOMCELL[x.room][0]!==LFBSEL)return;var p=cellXY(x.room,L);s+=alPlus(p.x,Math.max(LFROOF+60,p.y),x.slot,(ROOMT[x.room]||{}).name||x.room)});
  }
  return s}
/* the building's layout takes in the spot of a room an upgrade can open, so the view inside the building includes its "+" (lots
   were already in it); only while the layout is made, so nothing else treats it as a lot */
var AL_LAY=0,alLotsBase=lotsOpen;
lotsOpen=function(){var o=alLotsBase.apply(this,arguments);if(AL_LAY){o=o.slice();alOpeners().forEach(function(x){if(o.indexOf(x.room)<0&&ROOMCELL[x.room])o.push(x.room)})}return o};
var alLayBase=worldLayout;
worldLayout=function(){AL_LAY=1;try{return alLayBase.apply(this,arguments)}finally{AL_LAY=0}};
var alWorldBase=lfWorld;
lfWorld=function(){var w=alWorldBase.apply(this,arguments),x='';try{x=alWorldExtra()}catch(e){}/* going into a building counts as looking at its new rooms (the + stays until built) */try{if(LFBSEL!=null&&S&&S.created){var o=alSeen(),ch=0;alRooms().forEach(function(r){if(ROOMCELL[r.room][0]===LFBSEL&&!o.bld[r.room]){o.bld[r.room]=1;ch=1}});if(ch)setTimeout(persist,0)}}catch(e){}if(!x)return w;var k=w.lastIndexOf("</g>");return k<0?w+x:w.slice(0,k)+x+w.slice(k)};
window.__qbAlerts={rooms:alRooms,openers:alOpeners,tabs:alTabs,seen:alSeen,paint:alPaint};
