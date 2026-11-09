/* ---------- Cal's welcome note and the "New Update!" notice (Cal, 2026-11-09) ----------
   Welcome: an (i) button at the top right of the Board opens a note from Cal to his friends; it also opens by itself once, the
   first time a player reaches the Board.
   Update: the build writes version.json ({"appv": N}, tools/build.py). A page running an older APPV checks it when the game opens,
   when it comes back to the foreground and every 10 minutes, and offers a Refresh. After the reload the page says whether it is
   now on the new version, or that the update has not reached this phone yet. */
var WELCOME='<div class="card box2 welcome"><span class="label">A note from Cal</span><h2>Hey, it&rsquo;s Cal &#128075;</h2>'
 +'<p>I&rsquo;m bad at finishing my to-do list. The boring stuff (laundry, dishes, emails, the gym) always slides to tomorrow. So I built SAYWHAT to make those tasks worth doing.</p>'
 +'<h3 class="label">How it works</h3><ul class="wl">'
 +'<li><b>Add your tasks.</b> Type them, messy is fine, in the box at the top of the Board and each one becomes a quest.</li>'
 +'<li><b>Finish quests</b> to earn XP and coins. Prove the big ones with a photo for double rewards.</li>'
 +'<li><b>Level up</b> to unlock new places, dungeons and gear.</li>'
 +'<li><b>Spend coins</b> on your character and your Loft.</li>'
 +'<li><b>Show off</b> your character in the Town Hall and see how your friends are doing.</li>'
 +'<li><b>Challenges</b> are coming: see your friends&rsquo; wins in the Town Hall, then bet coins you can beat them this week (like more gym days). <i>Coming soon.</i></li>'
 +'</ul><p>No guilt, no pressure. Do a little every day and watch it add up. See you in town.</p>'
 +'<div class="btns"><button class="btn" data-act="mclose">Let&rsquo;s go</button></div></div>';
function showWelcome(){if(document.querySelector("#layer .modal .welcome"))return;modal(WELCOME)}
/* once per player, after any other window (the creator, a level-up) has closed */
function welcomeOnce(){
  if(!loaded||!S.created||S.welcomed)return;
  if(document.querySelector("#layer .modal")){setTimeout(welcomeOnce,3000);return}
  S.welcomed=1;persist();showWelcome();
}

var UPDT=0,UPDK="qbUpd";
function updCheck(){
  if(!loaded||Date.now()-UPDT<60000)return;UPDT=Date.now();
  fetch("version.json?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(j){
    var v=j&&+j.appv;if(v&&v>APPV)showUpdate(v);
  }).catch(function(){}); /* the Claude build has no version.json; offline is fine too */
}
function showUpdate(v,still){
  if(document.querySelector("#layer .modal .upd"))return;
  modal('<div class="card box2 upd"><span class="label">Update</span><h2>New Update!</h2>'
   +'<p class="note">Version <b>v0.'+v+'</b> is out. You&rsquo;re on v0.'+APPV+'.</p>'
   +(still?'<p class="note">The update hasn&rsquo;t reached this phone yet. Give it a minute and tap Refresh again.</p>':'<p class="note">Your progress is saved. Refresh to get it.</p>')
   +'<div class="btns"><button class="btn" data-act="updnow" data-v="'+v+'">Refresh</button></div></div>');
}
function updNow(v){
  try{sessionStorage.setItem(UPDK,String(v))}catch(e){}
  try{persist()}catch(e){}
  setTimeout(function(){location.reload()},400); /* a moment for the save to leave */
}
/* after a Refresh: did it work? */
function updAfterReload(){
  var want=0;try{want=+sessionStorage.getItem(UPDK)||0}catch(e){}
  if(!want)return;
  if(APPV>=want){try{sessionStorage.removeItem(UPDK)}catch(e){}
    modal('<div class="card box2 upd"><span class="label">Update</span><h2>You&rsquo;re up to date</h2><p class="note">Now on <b>v0.'+APPV+'</b>.</p><div class="btns"><button class="btn" data-act="mclose">Nice</button></div></div>')}
  else showUpdate(want,true);
}
function newsBoot(){
  updAfterReload();
  setTimeout(updCheck,8000);
  setInterval(updCheck,600000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)updCheck()});
  setTimeout(welcomeOnce,1500);
}
