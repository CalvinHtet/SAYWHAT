/* ---------- QA 11-28: a dated cut is on sale until its day, and after it only where a running Vault or drop still holds it ----------
   A retired brand piece carries cut:"YYYY-MM-DD" (its brand's next drop, docs/ADDING_CONTENT.md). Every check on it[6].cut (the
   Shop's racks, itemFits, the Vault and drop racks, counts) now asks this: before the day, not cut; from the day, cut, except inside a
   Vault week or a live drop that started before the day and drew the piece, so a running Vault or drop never loses a card mid-way.
   The pools (29zz_v201.js v201Cut) read the date as cutOn. Plain cut:1 is unchanged. */
function v227Off(it){var m=it[6],on=m.cutOn,id=it[0];try{if(dropYmd(dropNow())<on)return 0}catch(e){return 1}
  try{var V=v201VaultW();if(V&&V.wk<on&&V.keep&&V.keep[id])return 0}catch(e){}
  try{var d=dropFloor(dropNow(),flGet("street")),r=1;(d.live||[]).forEach(function(b){if(b.id===m.b&&(b.start||"")<on&&v201Half(b)[id])r=0});if(!r)return 0}catch(e){}
  return 1}
try{SHOP.forEach(function(it){var m=it&&it[6];if(!m||typeof m.cut!=="string")return;m.cutOn=m.cut;delete m.cut;
  Object.defineProperty(m,"cut",{get:function(){return v227Off(it)},set:function(v){if(v&&typeof v!=="string"){delete m.cutOn;Object.defineProperty(m,"cut",{value:v,writable:true,configurable:true,enumerable:true})}},configurable:true,enumerable:false})})}catch(e){}
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV227={off:function(id){var it=SHOP.filter(function(x){return x[0]===id})[0];return it?!!it[6].cut:null}};
