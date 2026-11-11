/* ---------- the one-time reset (Cal, 2026-11-10: "initialize the loft and refund all the money they have spent so far") ----------
   With the new way rooms open (ECON.unlock), every save that has never been reset gets, once, after it loads:
   - a backup of the whole save first: data/users/<id>/backup_v91 online and quest-board-backup-v91 on this device;
   - every room and building purchase reset: the rooms, their upgrades, the lots, decor styles, paint and hires (ECON.resetScope
     "loft" keeps the other buildings); the Bedroom is back as it starts;
   - the coins refunded at TODAY's prices (enough to buy the same things again) and S.spent lowered by the same amount;
   - the room story steps cleared so they open again in order (the people who joined, the goals claimed, level, XP, clothes,
     relics, quests, Training, social and the coins on hand all stay);
   - a letter in the inbox with the amount.
   The merge marks a made save with no S.reset91 (S.r91p; LEAD: keyed on "never reset", not on the version, so nothing can skip
   it); S.reset91 records what was done, so it never runs twice. A character made on this version gets S.reset91 {fresh:1} at once,
   so it is never reset. */
/* what a room cost at today's prices: its upgrades (openers included), its decor styles, its paint and, for a room with a price
   (ROOMT cost) that no owned upgrade opened, the room itself. QA (v0.91): before 11-05 the Restaurant was built from a lot, not
   through the Garden's gd_rest, and old saves never got gd_rest, so a lot-built room is counted from its price. L: the slots it
   was built among (the save's own by default) */
function rsOpened(t,L){return (L||S.base.slots).some(function(r){return r&&r.a&&(ADDONS[r.t]||[]).some(function(a){return a[3]&&a[3].opens===t&&r.a[a[0]]})})}
function rsRoomValue(r,L){var v=0;
  (ADDONS[r.t]||[]).forEach(function(a){if(r.a&&r.a[a[0]]&&+a[2]>0)v+=+a[2]});
  try{if(r.du&&typeof lfDecSets==="function")lfDecSets(r.t).forEach(function(q){if(r.du[q.id]&&q.cost)v+=q.cost})}catch(e){}
  if(r.st)v+=150*r.st;
  if(r.t!=="bedroom"&&ROOMT[r.t]&&+ROOMT[r.t].cost>0&&!rsOpened(r.t,L))v+=+ROOMT[r.t].cost;
  return v}
function rsInScope(r){return !!r&&(ECON.resetScope!=="loft"||!!(ROOMCELL[r.t]&&ROOMCELL[r.t][0]===0))}
function rsRun(){if(!S||!S.r91p||S.reset91)return null;
  var before=JSON.parse(JSON.stringify(S));delete before.r91p;
  try{localStorage.setItem("quest-board-backup-v91",JSON.stringify(before))}catch(e){}
  try{if(db&&MYUID)db.doc("data/users/"+MYUID+"/backup_v91").set(before).catch(function(){})}catch(e){}
  var refund=0,rooms=0,ups=0,keep=[];
  S.base.slots.forEach(function(r){if(!r)return;if(!rsInScope(r)){keep.push(r);return}refund+=rsRoomValue(r);if(r.t!=="bedroom")rooms++;ups+=Object.keys(r.a||{}).length});
  if(S.hired&&ECON.resetScope!=="loft")Object.keys(S.hired).forEach(function(k){if(S.hired[k]&&CREWHIRE[k])refund+=CREWHIRE[k]});
  var nb=baseFresh();
  if(ECON.resetScope==="loft"){nb.slots=nb.slots.concat(keep);["food","served","crew","ev"].forEach(function(k){if(S.base[k]!=null)nb[k]=S.base[k]})}else S.hired={};
  S.base=nb;
  /* the room story steps open again in order; the people who joined stay */
  var o=styState();STORY.forEach(function(s){if(!s.room||s.how==="never")return;if(ECON.resetScope==="loft"&&!(ROOMCELL[s.room]&&ROOMCELL[s.room][0]===0))return;
    delete o.done[s.id];delete o.offer[s.id];if(o.open)delete o.open[s.room]});
  if(ECON.resetScope!=="loft"){o.sold=0;o.biz=0}
  S.coins=(S.coins||0)+refund;S.spent=Math.max(0,(S.spent||0)-refund);
  S.reset91={at:Date.now(),d:today(),refund:refund,rooms:rooms,ups:ups,spent0:before.spent||0,scope:ECON.resetScope};delete S.r91p;
  persist();try{render()}catch(e){}
  if(refund>0)setTimeout(function(){if(!document.querySelector("#layer .modal")&&typeof ibOpen==="function")ibOpen("reset91");else pop("The Loft has been reset: see your inbox")},1500);
  return S.reset91}
var rsMergeBase=merge;merge=function(d){var r=rsMergeBase.apply(this,arguments);try{if(S&&d&&S.created&&!S.reset91)S.r91p=1}catch(e){}return r};
setInterval(function(){try{if(loaded&&S&&S.created&&!S.reset91){if(S.r91p)rsRun();else{S.reset91={at:Date.now(),d:today(),refund:0,rooms:0,ups:0,fresh:1};persist()}}}catch(e){}},1000);
/* the letter (29x_inbox.js), only for a save that had something to reset */
INBOXGEN=INBOXGEN||[];INBOXGEN.push(function(){var R=S&&S.reset91;if(!R||!(R.refund>0))return [];
  /* Cal's text, approved 2026-11-10 */
  return [{id:"reset91",from:"Cal",subj:"The Loft has been reset",d:R.d,
    body:'<p>To balance the economy, every room and building has been reset and your coins refunded: +'+(+R.refund).toLocaleString()+' coins.</p>'
      +'<p>Your clothes and everything from the Shop are untouched. Rooms now open in a new order as you upgrade.</p>'}]});
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbReset={run:rsRun,
  /* a room's value among L, or (after the reset) among the backed-up slots it came from */
  value:function(r,L){var B=null;if(!L&&S.reset91){try{B=JSON.parse(localStorage.getItem("quest-board-backup-v91"))}catch(e){}}return rsRoomValue(r,L||(B&&B.base&&B.base.slots)||null)},mark:function(){S.r91p=1;delete S.reset91;return 1}};
