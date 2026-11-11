/* ---------- Cal's own fresh start (v0.91; Cal, 2026-11-10: "initialize my profile from scratch ... keep everyone else's profiles.
   just reset my Cal profile back to square 1") ----------
   Only for the owner's account (QB_WEB.owners[0]) and never in the sandbox (there only through the test hook below). Once, after
   load: the whole save is backed up (data/users/<uid>/backup_calfresh91 online, quest-board-backup-calfresh91 on this device), then
   the save becomes exactly what a new player gets (fresh(): the character creator, the first Board), keeping only his Training
   (CFKEEP: the lift log, the sessions behind the graphs, today's session, his own workouts and their units, the coach's notes). No
   letter. Run once, on more than one key, so a lost flag can't wipe him twice: the new save carries S.calfresh91 and S.joinedAt; the
   online backup's existence is checked first on every device (another device with an old copy finds it and only sets the flag); and
   it never runs after CFUNTIL. The new save also carries S.reset91 {fresh:1}, so the v0.91 Loft reset never runs on it. */
var CFKEEP=["gymlog","sessions","wk","cex","cexN","cseen","gymFold","coachHist","gym"],CFUNTIL=Date.UTC(2026,10,14),CFBUSY=0;
function cfUid(){return window.__qbCfUid||((window.QB_WEB&&QB_WEB.owners)||[])[0]||null}
function cfDue(){return !!(S&&S.created&&MYUID&&MYUID===cfUid()&&!S.calfresh91&&!S.joinedAt&&Date.now()<CFUNTIL&&(!(window.QB_WEB&&QB_WEB.sandbox)||window.__qbCfUid))}
function cfRun(){if(!cfDue())return null;var before=JSON.parse(JSON.stringify(S));
  try{localStorage.setItem("quest-board-backup-calfresh91",JSON.stringify(before))}catch(e){}
  try{if(db&&MYUID&&!window.__qbCfUid)db.doc("data/users/"+MYUID+"/backup_calfresh91").set(before).catch(function(){})}catch(e){}
  var n=fresh(),t=Date.now();CFKEEP.forEach(function(k){if(before[k]!=null)n[k]=before[k]});
  n.calfresh91={at:t,d:today()};n.joinedAt=t;n.reset91={at:t,d:today(),refund:0,rooms:0,ups:0,fresh:1,cal:1};
  S=n;persist();try{render()}catch(e){}return S.calfresh91}
/* first look for the backup: it exists once this ran anywhere */
function cfCheck(){if(CFBUSY||!loaded||!cfDue())return;CFBUSY=1;
  var go=function(seen){CFBUSY=0;if(!cfDue())return;if(seen){S.calfresh91={at:Date.now(),d:today(),seen:1};persist();return}cfRun()};
  try{if(db&&MYUID&&!window.__qbCfUid){db.doc("data/users/"+MYUID+"/backup_calfresh91").get().then(function(s){go(!!(s&&s.exists))}).catch(function(){CFBUSY=0});return}}catch(e){}
  go(!!localStorage.getItem("quest-board-backup-calfresh91"))}
/* his old save would also be due the Loft reset: this one goes first */
var cfMergeBase=merge;merge=function(d){var r=cfMergeBase.apply(this,arguments);try{if(cfDue())delete S.r91p}catch(e){}return r};
setInterval(function(){try{cfCheck()}catch(e){}},1000);
/* test hook (sandbox): fake(uid) makes this save count as Cal's; clear() forgets the device backup so it can run again */
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbCalFresh={fake:function(u){window.__qbCfUid=u||MYUID;return window.__qbCfUid},unfake:function(){delete window.__qbCfUid},
  clear:function(){try{localStorage.removeItem("quest-board-backup-calfresh91")}catch(e){}return 1},due:cfDue,keep:CFKEEP};
