/* ---------- Cal's own fresh start (v0.91; Cal, 2026-11-10: "initialize my profile from scratch ... keep everyone else's profiles.
   just reset my Cal profile back to square 1") ----------
   Only for the owner's account (QB_WEB.owners[0]) and never in the sandbox (there only through the test hook below). After load,
   whenever his save is still the old one (made, but with no S.joinedAt, which every save made from here on carries), and only before
   CFUNTIL:
   1. the old save is backed up, once: data/users/<uid>/backup_calfresh91 online and quest-board-backup-calfresh91 on this device, each
      written only if it isn't there yet, so a second wipe never overwrites the first backup;
   2. the save becomes exactly what a new player gets (fresh(): the character creator, the first Board), keeping only his Training
      (CFKEEP: the lift log, the sessions behind the graphs, today's session, his own workouts and their units, the coach's notes);
   3. the new save is written online at once, before the creator is finished (persist() leaves a not-yet-made save on the device only).
   No letter. QA (v0.91): with only the device holding the new save, a reload during the creator loaded the old online save back for
   good. Now a reload finds the new save online; and should an old save turn up anyway (written offline, another device), it is wiped
   again rather than kept. The new save also carries S.reset91 {fresh:1}, so the v0.91 Loft reset never runs on it. */
/* LEAD 2026-11-11: until 11-21 (was 11-14), so it still runs if Cal publishes later this week */
var CFKEEP=["gymlog","sessions","wk","cex","cexN","cseen","gymFold","coachHist","gym"],CFUNTIL=Date.UTC(2026,10,21);
function cfUid(){return window.__qbCfUid||((window.QB_WEB&&QB_WEB.owners)||[])[0]||null}
function cfDue(){return !!(S&&S.created&&!S.joinedAt&&MYUID&&MYUID===cfUid()&&Date.now()<CFUNTIL&&(!(window.QB_WEB&&QB_WEB.sandbox)||window.__qbCfUid))}
function cfRun(){if(!cfDue())return null;var before=JSON.parse(JSON.stringify(S)),bk="data/users/"+MYUID+"/backup_calfresh91";
  /* the backup of the old save, never overwritten */
  try{if(!localStorage.getItem("quest-board-backup-calfresh91"))localStorage.setItem("quest-board-backup-calfresh91",JSON.stringify(before))}catch(e){}
  try{if(db)db.doc(bk).get().then(function(s){if(!(s&&s.exists))return db.doc(bk).set(before)}).catch(function(){})}catch(e){}
  var n=fresh(),t=Date.now();CFKEEP.forEach(function(k){if(before[k]!=null)n[k]=before[k]});
  n.calfresh91={at:t,d:today()};n.joinedAt=t;n.reset91={at:t,d:today(),refund:0,rooms:0,ups:0,fresh:1,cal:1};
  n.appv=APPV;n.epoch=QB_EPOCH;n.tshift=qbShift();n.savedAt=t;n.uid=MYUID;delete S.r91p;
  S=n;
  /* online at once: persist() keeps a save whose character isn't made yet on the device only */
  try{localStorage.setItem("quest-board",JSON.stringify(S))}catch(e){}
  try{if(db&&DOC)db.doc(DOC).set(JSON.parse(JSON.stringify(S))).catch(function(){})}catch(e){}
  try{render()}catch(e){}return S.calfresh91}
/* his old save would also be due the Loft reset: this one goes first */
var cfMergeBase=merge;merge=function(d){var r=cfMergeBase.apply(this,arguments);try{if(cfDue())delete S.r91p}catch(e){}return r};
setInterval(function(){try{if(loaded&&cfDue())cfRun()}catch(e){}},1000);
/* test hook (sandbox): fake(uid) makes this save count as Cal's (set window.__qbCfUid before the app starts to stand in from the very
   first load); clear() forgets the device backup */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbCalFresh={fake:function(u){window.__qbCfUid=u||MYUID;return window.__qbCfUid},unfake:function(){delete window.__qbCfUid},
  clear:function(){try{localStorage.removeItem("quest-board-backup-calfresh91")}catch(e){}return 1},due:cfDue,keep:CFKEEP};
