/* ---------- Cal's welcome note and the "New Update!" notice (Cal, 2026-11-09) ----------
   Welcome: a note from Cal to his friends, now the first letter in the inbox (the envelope at the top right, 29x_inbox.js); it
   also opens by itself once, the first time a player reaches the game.
   Update: the build writes version.json ({"appv": N}, tools/build.py). A page running an older APPV checks it when the game opens,
   when it comes back to the foreground and every 10 minutes, and offers a Refresh. After the reload the page says whether it is
   now on the new version, or that the update has not reached this phone yet. */
/* Cal's note is now the first letter in the inbox (29x_inbox.js), with 3,000 coins to start (Cal, 2026-11-10) */
var WELCOMEBODY='<p>I&rsquo;m bad at finishing my to-do list. The boring stuff (laundry, dishes, emails, the gym) always slides to tomorrow. So I built SAYWHAT to make those tasks worth doing.</p>'
 +'<h3 class="label">How it works</h3><ul class="wl">'
 +'<li><b>Add your tasks.</b> Type them, messy is fine, in the box at the top of the Board and each one becomes a quest.</li>'
 +'<li><b>Finish quests</b> to earn XP and coins. Prove the big ones with a photo for double rewards.</li>'
 +'<li><b>Level up</b> as your XP adds up. Each level pays coins.</li>'
 +'<li><b>Spend coins</b> on your room.</li>'
 +'<li><b>Work out</b> and prove it with a live photo. Four workouts in a week earn the Training bonus.</li>'
 +'<li><b>Start with your Bedroom.</b> Tap it to see what you can add.</li>'
 +'</ul><p>No guilt, no pressure. Do a little every day and watch it add up. See you in town.</p>';
function showWelcome(){ibOpen("welcome")}
/* once per player, after any other window (the creator, a level-up) has closed. Cal, 2026-11-10: "for the people who are already
   playing, retrigger that message so they can get it": a save from before the inbox (S.welcomed already set) gets it once more */
function welcomeOnce(){
  if(!loaded)return;if(!S.created){setTimeout(welcomeOnce,5000);return}
  var I=ibState();if(I.popped)return;
  if(document.querySelector("#layer .modal")){setTimeout(welcomeOnce,3000);return}
  S.welcomed=1;I.popped=1;persist();ibOpen("welcome");
}


/* ---------- updates (SPEC7, Cal 2026-11-10: "if someone is playing on it while a new update is pushed, it can say New update
   available, Refresh? or Later. If choosing later, there will be a notification on the top right of a green exclamation point
   which will open the refresh splash screen again ... a visual loading bar that counts the kb downloaded with a forward slash in
   between and the total size") ----------
   version.json is {appv, files: [[name?h=fingerprint, bytes], ...]}, the same shape from tools/build.py and build_web.sh. The
   window waits until nothing else is open (a photo check, a purchase, a chest, a text field). Later leaves a green "!" by the
   envelope. Refresh downloads the files this phone's copy lacks (by fingerprint) itself, counting the bytes; the service worker
   (web/sw.js) keeps them, so the reload after is quick. A cold start does the same in the loader (app/loader.html). */
var UPDT=0,UPDK="qbUpd",UPDLATER=0,UPDWAIT=0,UPDINFO=null;
function updCheck(){
  if(!loaded||Date.now()-UPDT<60000)return;UPDT=Date.now();
  fetch("version.json?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(j){
    var v=j&&+j.appv;if(!v||v<=APPV)return;UPDINFO=j;
    if(UPDLATER>=v){updPaint();return}updOffer(v);
  }).catch(function(){}); /* the Claude build has no version.json; offline is fine too */
}
/* something the player is in the middle of: any window, a splash, or typing */
function updBusy(){var a=document.activeElement;return !!(document.querySelector("#layer .modal,.bsplash,.dropsplash")||(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))||window.__qbPendN>0)}
function updOffer(v){clearTimeout(UPDWAIT);if(document.querySelector("#layer .modal .upd"))return;
  if(updBusy()){UPDWAIT=setTimeout(function(){updOffer(v)},3000);return}showUpdate(v)}
function showUpdate(v,still){
  if(document.querySelector("#layer .modal .upd"))return;
  modal('<div class="card box2 upd"><span class="label">Update</span><h2>New update available</h2>'
   +'<p class="note">Version <b>'+pnVer(v)+'</b> is ready. You&rsquo;re on '+pnVer(APPV)+'.</p>'
   +(still?'<p class="note">The update hasn&rsquo;t reached this phone yet. Give it a minute and tap Refresh again.</p>':'<p class="note">Your progress is saved.</p>')
   +'<div class="btns"><button class="btn" data-upd="now" data-v="'+v+'">Refresh</button><button class="btn ghost" data-upd="later" data-v="'+v+'">Later</button></div></div>');
}
/* the green "!" by the envelope while an update waits (ibBtn draws it, so it is wherever the envelope is) */
function updBtn(){return UPDLATER>APPV?'<button class="updbtn" data-upd="open" aria-label="Update '+pnVer(UPDLATER)+' is ready">!</button>':''}
var updIbBase=ibBtn;ibBtn=function(){return updIbBase()?updBtn()+updIbBase():""};
function updPaint(){try{render()}catch(e){}}
function updLater(v){UPDLATER=Math.max(UPDLATER,v);closeModals();updPaint()}
function updNow(v){
  try{sessionStorage.setItem(UPDK,String(v))}catch(e){}
  try{persist()}catch(e){}
  setTimeout(function(){location.reload()},400); /* a moment for the save to leave */
}
/* 286 KB / 850 KB: KB under 1,000 of them, MB above */
function updFmt(n){return n<999500?Math.round(n/1e3).toLocaleString()+" KB":(n/1e6).toFixed(1)+" MB"}
/* Refresh: fetch what this phone lacks, two files at a time, counting bytes as they arrive, then reload. Without the cache API or
   a file list it just reloads. With the service worker in charge the worker keeps each file as it passes; without it, the page
   keeps them in the same cache. */
function updInstall(v){
  closeModals();
  var m=modal('<div class="card box2 upd"><span class="label">Update</span><h2>Installing update</h2><div class="updbar"><i style="width:2%"></i></div><p class="note mono updtx">Checking what is new</p></div>');
  var bar=m&&m.querySelector(".updbar i"),tx=m&&m.querySelector(".updtx"),fin=false,
    done=function(){if(fin)return;fin=true;if(tx)tx.textContent="Restarting";if(bar)bar.style.width="100%";updNow(v)};
  if(m)m.classList.add("updmodal");
  var files=UPDINFO&&+UPDINFO.appv===v?Promise.resolve(UPDINFO):fetch("version.json?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.json():null});
  files.then(function(j){var F=j&&Array.isArray(j.files)?j.files:null;if(!F||!F.length||!window.caches){done();return}
    var ctl=navigator.serviceWorker&&navigator.serviceWorker.controller;
    return caches.open("qb-files").then(function(k){
      var abs=F.map(function(f){return new URL(f[0],location.href).href});
      return Promise.all(abs.map(function(u){return k.match(u)})).then(function(hits){
        var miss=[],tot=0,known=true,got=0;hits.forEach(function(h,i){if(!h){miss.push(i);if(+F[i][1]>0)tot+=+F[i][1];else known=false}});
        if(!miss.length){done();return}
        var paint=function(){if(bar)bar.style.width=(known&&tot?Math.max(2,Math.min(100,got/tot*100)):Math.min(95,2+got/1e5)).toFixed(1)+"%";
          if(tx)tx.textContent=(known&&tot?updFmt(got)+" / "+updFmt(tot):updFmt(got))+" downloaded"};
        var one=function(i){var u=abs[i];return fetch(u).then(function(r){if(!r.ok)throw new Error("http "+r.status);
          var ct=r.headers.get("content-type")||"",rd=r.body&&r.body.getReader?r.body.getReader():null,parts=[];
          var keep=function(b){return ctl?null:k.put(u,new Response(b,{headers:{"Content-Type":ct}}))};
          if(!rd)return r.blob().then(function(b){got+=b.size;paint();return keep(b)});
          var pump=function(){return rd.read().then(function(x){if(x.done)return keep(new Blob(parts,{type:ct}));got+=x.value.length;if(!ctl)parts.push(x.value);paint();return pump()})};
          return pump()})};
        var q=miss.slice(),run=function(){var i=q.shift();return i==null?null:one(i).then(run)};
        paint();
        /* then a moment for the worker to finish keeping the last file, so the reload finds every one */
        return Promise.all([run(),run()]).then(function(){return updCached(k,miss.map(function(i){return abs[i]}),3000)})})})
  }).then(done,done);
}
function updCached(k,urls,ms){var t0=Date.now();return new Promise(function(ok){(function poll(){
  Promise.all(urls.map(function(u){return k.match(u)})).then(function(h){if(h.every(Boolean)||Date.now()-t0>ms)ok();else setTimeout(poll,150)},ok)})()})}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-upd]");if(!b)return;var k=b.dataset.upd,v=+b.dataset.v||UPDLATER;
  if(k==="now"){updInstall(v);return}
  if(k==="later"){updLater(v);return}
  if(k==="open"){showUpdate(UPDLATER);return}});
/* after a Refresh: did it work? */
function updAfterReload(){
  var want=0;try{want=+sessionStorage.getItem(UPDK)||0}catch(e){}
  if(!want)return;
  if(APPV>=want){try{sessionStorage.removeItem(UPDK)}catch(e){}
    modal('<div class="card box2 upd"><span class="label">Update</span><h2>You&rsquo;re up to date</h2><p class="note">Now on <b>'+pnVer(APPV)+'</b>.</p><div class="btns"><button class="btn" data-act="mclose">Nice</button></div></div>')}
  else showUpdate(want,true);
}

/* ---------- patch notes (SPEC7, Cal: "with each push, if it is worth including in the patch notes for the players, you could include
   a very very simple version of what changed and give a 200 coin bonus for opening the patch notes letter") ----------
   Cal (2026-11-10, the amendment): one letter every 10 versions (v0.90, v1.00, ...), 500 coins once on opening, and a player who
   skipped some gets each missed letter with coins on the newest 2 only. "dont give away too much of the game right away": a letter
   says what changed, never how it works. PATCHNOTES = [{v, subj, lines}] (subj optional; a version not a multiple of 10, or one with
   no lines, shows nothing). Coins go in S.letters.paid. S.pn.from is the version a save last ran before it first saw patch notes,
   so a new player gets only later letters. */
var PATCHNOTES=[
  {v:90,subj:"Ten updates in one letter",lines:[
    "Level scaling and economy rebalanced",
    "Daily quest goals and payouts rebalanced",
    "Introduced relic tiers (low, med, high, legendary)",
    "Town Hall: posts, chat, a weekly ranking and coin challenges",
    "Training: your own workouts and progress graphs",
    "New brand drops twice a week, with clothes priced by quality"]},
  /* Cal, 2026-11-17: a letter every 10th version, 500 coins, vague, no spoilers ("Too much info in the update logs that give info on what
     is next"). What changed since Update 1.06's letter (29zz_patch.js): v1.07 to v1.10 */
  {v:110,lines:[
    "Cleaner screens: less text, and the explanations sit behind the small (i) buttons",
    "Your coins, letters and class sit right next to your character",
    "The Town Hall has a new look",
    "The Shop has its own Upgrades tab",
    "Side quests now last a week",
    "The Restaurant and the Garden have fewer, better upgrades",
    "Coaches and the Town Boss are resting for now"]},
  /* v1.11 to v1.20, same rules: vague, no brand or room names, nothing still to come */
  {v:120,lines:[
    "Training is back in the tab bar",
    "The Wheel tidies itself away after a spin",
    "Streak freezes are used for you when you miss a day, and the tips now say so",
    "Quick desk tasks pay a little less XP, but still count in full toward your streak",
    "Some rooms have more to build, and some crews keep to their posts",
    "New pieces in the Shop, and a few retired ones paid back",
    "Fixes in several rooms"]}
];
var PNCOINS=500,PNPAID=2,PNEVERY=10;
/* 90 -> "v0.90", 100 -> "v1.00" */
function pnVer(v){return "v"+Math.floor(v/100)+"."+("0"+v%100).slice(-2)}
function pnFrom(){if(!S.pn||typeof S.pn!=="object")S.pn={from:+S.appv||APPV};return +S.pn.from||0}
/* a save loaded from before patch notes: start from the version it last ran (S.appv), so it gets the letters since */
var pnMergeBase=merge;merge=function(d){var r=pnMergeBase.apply(this,arguments);try{if(S&&d&&!S.pn)S.pn={from:d.created?(+d.appv||0):APPV}}catch(e){}return r};
INBOXGEN=INBOXGEN||[];INBOXGEN.push(function(){if(!S||!S.created)return [];var from=pnFrom(),L=PATCHNOTES.filter(function(p){return p&&p.v%PNEVERY===0&&p.v>from&&p.v<=APPV&&p.lines&&p.lines.length}).sort(function(a,b){return a.v-b.v});
  return L.map(function(p,i){return {id:"pn"+p.v,from:"Cal",subj:p.subj||"What’s new in "+pnVer(p.v),pay:"open",coins:i>=L.length-PNPAID?PNCOINS:0,
    body:'<ul class="wl">'+p.lines.map(function(s){return '<li>'+esc(s)+'</li>'}).join("")+'</ul>'}})});
/* opening a patch-notes letter pays its coins at once */
var pnOpenBase=ibOpen;ibOpen=function(id){pnOpenBase(id);var l=id?ibFind(id):null;if(l&&l.pay==="open"&&l.coins>0&&!ibState().paid[l.id])ibClaim(l.id)};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbUpd={check:function(){UPDT=0;updCheck()},offer:updOffer,install:updInstall,notes:PATCHNOTES,from:pnFrom,fmt:updFmt,later:function(){return UPDLATER}};

function newsBoot(){
  updAfterReload();
  setTimeout(updCheck,8000);
  setInterval(updCheck,600000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)updCheck()});
  setTimeout(welcomeOnce,1500);
}
