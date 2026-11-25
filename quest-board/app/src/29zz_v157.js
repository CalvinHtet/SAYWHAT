/* ---------- Cal 2026-11-25: steps are not tasks; a bounty photo can stay private ----------
   Cal: "make the AI that categorizes the tasks smarter. There are some tasks that could be faked and spammed such as 'put on socks' or
   'walk to car' and even those would give ample experience", and "For all bounties and everything across the app actually, give users
   the ability to post to town hall, or not. It should require photo proof for the ones that need it, but users can choose to share it
   with the town or not."
   1. Quick steps. The rater (PARSE in 30_app_b.js) now has a rung under 5 XP: a single motion or a sub-minute step on the way to
      something else is "step": 1 XP, and steps of one activity are folded into that activity. The offline estimate knows the common
      ones (V57STEP). A quick step (any quest under 5 XP) is ticked off like any task but pays 1 XP and nothing else: no coins, no
      bonuses, no critical hit, no loot roll, no Momentum Surge slot, no bounty or pet progress, and it is not one of the day's tasks
      (coin momentum, the scratch card's 3 tasks, lifetime totals and stats do not count it). It is handled here, before every other
      wrapper of toggle().
   2. Repeats. The same small one-off task (10 XP or less, same name) finished a third time in a day counts as a quick step too.
   3. A 3-day bounty's photo: "Post a photo" from a bounty card now offers "Keep it private" beside "Post to the town". Private, the
      photo is not uploaded anywhere: the photo checker looks at it against the bounty (as for a quest's proof), and a pass counts
      toward the bounty. Posted, it counts as before. Quest, Workout and level-trial photos were already private with an optional
      "Post to the town board" after the check (29ph_photos.js); they are unchanged. */
var V57STEP=/^(?:(?:put|pull|slip) on (?:my |the |some |a )?(?:socks?|shoes?|slippers|shirt|t-?shirt|pants|shorts|jacket|coat|hoodie|hat|cap|clothes|glasses|watch|belt)|take off (?:my |the )?(?:socks?|shoes?|jacket|coat|hat|hoodie)|walk(?:ed)? (?:to|into|out of) (?:the |my )?(?:car|door|front door|kitchen|bathroom|bedroom|living room|room|desk|couch|sofa|mailbox|garage|fridge)|get (?:out of|up from|into|in) (?:the |my )?(?:bed|couch|sofa|chair|car)|stand up|sit down|sit up|wake up|open (?:the |my )?(?:door|laptop|fridge|window|app|phone|eyes|curtains|blinds|computer)|close (?:the |my )?(?:door|laptop|fridge|window|curtains|blinds)|turn (?:on|off) (?:the |my )?(?:lights?|lamp|tv|fan|computer|laptop|phone|alarm)|(?:un)?lock (?:the |my )?(?:phone|door|front door|car)|grab (?:my |the )?(?:keys|phone|wallet|bag|water|coffee)|pick up (?:my |the )?(?:phone|keys)|check (?:the )?time|breathe|blink|yawn|stretch my (?:arms|legs))\s*[.!]?$/i;
function v57Micro(q){return !!q&&!q.bty&&(+q.xp||0)<5}
function v57Step(r){r.xp=1;r.mins=1;r.proof=false;r.rep="once";r.why="A quick step, not a task";return r}
/* the rater's answer: a step, an xp of 0, or a known motion is a quick step; minutes and XP have to agree at the bottom of the scale */
var v57Val=validate;validate=function(o,src){var r=v57Val.apply(this,arguments);
  try{if(o&&(o.step===true||o.xp===0||o.xp==="0"||V57STEP.test(String(r.name||"").trim())))return v57Step(r);
    var m=+r.mins||0;if(m&&m<=4&&r.xp>5)r.xp=5;else if(m&&m<15&&r.xp===25)r.xp=10}catch(e){}
  return r};
var v57Guess=guess;guess=function(t){var r=v57Guess.apply(this,arguments);try{if(V57STEP.test(String(t||"").trim()))v57Step(r)}catch(e){}return r};
/* the day's finished small one-offs by name, for the repeat rule */
function v57Key(q){return String(q.name||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function v57Rpt(){var t=today(),o=S.rpt;if(!o||typeof o!=="object"||o.d!==t)o=S.rpt={d:t,n:{},m:{}};if(!o.n||typeof o.n!=="object")o.n={};if(!o.m||typeof o.m!=="object")o.m={};return o}
function v57Small(q){return !!q&&!q.bty&&q.rep!=="daily"&&q.rep!=="weekly4"&&(+q.xp||0)>=5&&(+q.xp||0)<=10}
var V57REPEAT=2;/* this many of the same small task a day pay in full */
var v57Toggle=toggle;toggle=function(id,ev,mode){var q=(S.quests||[]).filter(function(x){return x.id===id})[0];if(!q)return v57Toggle.apply(this,arguments);
  var R=v57Rpt(),was=!!(S.done&&S.done[id]),asStep=v57Micro(q)||(was?!!R.m[id]:(v57Small(q)&&(R.n[v57Key(q)]||0)>=V57REPEAT));
  if(!asStep){var r=v57Toggle.apply(this,arguments);try{if(v57Small(q)){var k=v57Key(q),now=!!(S.done&&S.done[id]);if(now&&!was)R.n[k]=(R.n[k]||0)+1;else if(!now&&was&&R.n[k])R.n[k]--;persist()}}catch(e){}return r}
  var before=effLvl(),wasGate=gated();
  if(was){var back=+S.done[id]||0;delete S.done[id];delete S.vdone[id];delete R.m[id];S.xp=Math.max(0,S.xp-back);if(S.dayXp&&S.dayXp.d===today())S.dayXp.x=Math.max(0,S.dayXp.x-back)}
  else{S.done[id]=1;S.vdone[id]=0;S.xp+=1;var t=today();if(!S.dayXp||S.dayXp.d!==t)S.dayXp={d:t,x:0};S.dayXp.x+=1;if(!v57Micro(q))R.m[id]=1;
    try{qToast(1,0,1,[v57Micro(q)?"Quick step: 1 XP, no coins":"Same small task again today: counts as a quick step"])}catch(e){}}
  render();persist();var after=effLvl();try{if(after>before)levelUp(after,null,before);else if(!wasGate&&gated())gateOpened(gated())}catch(e){}};
/* ---- every bounty needs a photo (Cal 11-25: "Even the 1 day bounty chores need a photo. And remember that all photos are private until
   they decide to post it to the townhall") ----
   A 1-day or 2-day bounty is a chore on the Board. Ticking it opens the photo check, with no "Done without a photo": it is finished
   only by a photo that passes, taken in the app, and that photo stays private (the check's result offers "Post to the town board",
   as for any quest). Where no photo checker can exist (a device-only build) the chore is ticked on trust as before, since nothing
   could ever pass. */
var V57FORCE=null;/* tests: true or false overrides whether a checker exists */
function v57Checker(){if(V57FORCE!==null)return !!V57FORCE;try{return !!window.claude||!!(window.QB_WEB&&QB_WEB.sandbox)}catch(e){return false}}
function v57IsBty(id){var q=(S.quests||[]).filter(function(x){return x.id===id})[0];return !!(q&&q.bty)}
/* QA 716955df: the buttons came back on "Try another photo" (askProof called directly) and on a result window shown later (held
   behind a tour). Every proof window is swept whenever one is opened or added to the page. */
function v57BtyProof(){try{if(!v57Checker())return;[].forEach.call(document.querySelectorAll("#layer .modal"),function(m){
      [].forEach.call(m.querySelectorAll('[data-act="proofhonor"]'),function(b){if(v57IsBty(b.dataset.id))b.remove()});
      var cam=m.querySelector("#pf1"),isAsk=cam&&m.querySelector('[data-act="closeproof"],[data-act="honor"],.v57bty');if(!isAsk||!proofId||!v57IsBty(proofId))return;
      [].forEach.call(m.querySelectorAll('[data-act="honor"]'),function(b){b.remove()});[].forEach.call(m.querySelectorAll(".chip"),function(c){if(/^No photo/.test(c.textContent))c.remove()});
      var n=m.querySelector(".note");if(n&&!m.querySelector(".v57bty")){var d=document.createElement("p");d.className="note v57bty";d.textContent="This is a bounty: it needs a photo to count. The photo stays private unless you choose to post it.";n.parentNode.insertBefore(d,n.nextSibling)}})}catch(e){}}
var v57Ask=askProof;askProof=function(){var r=v57Ask.apply(this,arguments);v57BtyProof();return r};
(function(){var go=function(){try{var L=document.getElementById("layer");if(!L){setTimeout(go,500);return}new MutationObserver(function(){v57BtyProof()}).observe(L,{childList:true,subtree:true})}catch(e){}};go()})();
var v57TogB=toggle;toggle=function(id,ev,mode){var q=(S.quests||[]).filter(function(x){return x.id===id})[0];
  if(q&&q.bty&&!(S.done&&S.done[id])&&mode!=="v"&&v57Checker()){askProof(id);return}
  return v57TogB.apply(this,arguments)};
var v57Verdict=proofVerdict;proofVerdict=function(q,ok){var r=v57Verdict.apply(this,arguments);try{if(q&&q.bty&&!ok)v57BtyProof()}catch(e){}return r};

/* QA 716955df, the list LEAD asked for: with a photo needed for every bounty, a chore whose doing a photo cannot show (an absence,
   no phone, rest, "every time today", a kindness in person) can never be finished, and one whose proof means photographing banking,
   passwords, ID or private messages should not be asked for. They leave the 1-day and 2-day pools. */
var V57NOPHOTO=["Take a 20-minute walk with no phone","Make every coffee or tea at home today","Take the stairs every time today","Sit outside for 15 minutes with no screen","Drink eight glasses of water today","Eat a vegetable with every meal","Skip sugary drinks for the whole day","Walk during one phone call","Go to bed 30 minutes earlier","No screens in the last hour before bed","Sit quietly for ten minutes","Take a long shower or bath with no phone","Leave your phone in another room for an hour","Rest for 30 minutes on purpose","Get up at the same time as yesterday","Ask someone how they really are","Give three people a specific compliment","Return a favour you owe","Eat a meal with someone, phones away","Teach someone something you know",
  "Drink only water, tea or coffee for two days","No snacks after dinner for two nights","Go to bed by 11 two nights in a row","Spend two mornings without your phone for an hour","Switch screens off after dinner, two evenings","Sit quietly for ten minutes on both days","Do something kind for two strangers","Walk or cycle every short trip for two days","Cook every meal at home for two days",
  "Pay or schedule every bill due this week","Read your bank statement line by line","Set up one automatic payment","Change the passwords on two accounts","Turn on two-step login for your email","Renew whatever expires next","Fill in the form you have been putting off","Update your address everywhere","Check your credit report","Move some money into savings","Settle the smallest money you owe someone","Set up a password manager","Read and sign the document you set aside","Reply to the message you have been avoiding","Apologise for the thing you know you should",
  "Review your insurance policies","Gather everything you need for taxes","Update the recovery info on every account","Sort out the money task you dread"],V57CUT=[];
(function(){try{var norm=function(t){return String(t||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()},K=V57NOPHOTO.map(norm);
    [BTY1,BTY2].forEach(function(A){for(var i=A.length-1;i>=0;i--){var n=norm(A[i][0]);if(K.some(function(k){return n===k||n.indexOf(k)===0}))V57CUT.push(A.splice(i,1)[0][0])}})}catch(e){}})();

/* ---- a bounty's photo, kept private ---- */
var V57CHK=null;/* tests set a stand-in checker */
async function v57Check(A,file){if(V57CHK)return V57CHK(A,file);var vis=null;
  try{var sample=window.claude?await window.claude.use("sample"):null;
    if(!sample&&window.QB_WEB&&QB_WEB.sandbox){var lum=await sbLum(file);vis={matches:lum>35,what:"your test photo (sandbox stand-in check)",note:lum>35?"":"Too dark to see anything (sandbox stand-in)."}}
    var lim=sample?await sample.limits().catch(function(){return null}):null;
    if(sample&&lim&&lim.images)vis=await sample.json('A person claims this photo shows them doing this challenge for a habit game: "'+String(A.n||"").replace(/"/g,"'")+'" ('+String(A.why||"").replace(/"/g,"'")+'). Look at the image. Return ONLY JSON: {"matches":true,"what":"","note":""} where matches = the image plausibly shows this challenge done or clearly in progress (be fair but skeptical; a blank, black or unrelated picture does not match), what = what you see in under 14 words, note = short reason under 12 words. A screenshot, or a photo of a screen, counts when the challenge is about something on a screen: a song playing in a music app (any app), a film or show, a game.',{images:file,modelTier:"quick",cache:false})}catch(e){vis=null}
  if(!vis)return {ok:false,why:"The photo checker couldn't be reached, so nothing was counted. Try again in a minute, or post it to the town."};
  return vis.matches?{ok:true,what:vis.what||""}:{ok:false,why:"It doesn't look like this bounty."+(vis.note?" "+vis.note:"")}}
async function v57Private(btn){var arm=BQARM,src=PH.sel;if(!arm||!src||!src.file)return false;var A=bqState().act[arm.k];if(!A||A.done||A.ty!=="p")return false;
  var msg=function(t){var e=document.getElementById("bqprivmsg");if(e)e.textContent=t};
  if(A.daily&&A.days&&A.days[today()]){msg("That one counts once a day. Add the next photo tomorrow.");return false}
  var hh="";try{hh=hashFile(await src.file.arrayBuffer())}catch(e){}
  if(hh&&(S.hashes.indexOf(hh)>=0||pendHash(hh))){msg("This exact image was already used. Take a new one.");return false}
  if(btn){btn.disabled=true;btn.textContent="Checking…"}msg("");
  var v=await v57Check(A,src.file);
  if(!v.ok){if(btn&&btn.isConnected){btn.disabled=false;btn.textContent="Keep it private"}msg(v.why);return false}
  if(hh){S.hashes.push(hh);S.hashes=S.hashes.slice(-300)}
  BQARM=null;if(!src.k&&src.url){try{URL.revokeObjectURL(src.url)}catch(e){}}PH.sel=null;closeModals();
  if(bqPhoto(arm.k))pop("Counted for your bounty. The photo was not shared.");return true}
/* QA f5f960fe: "Post to the town" counted any picture (an all-black one three times finished a bounty). A bounty's photo is checked
   the same way whichever button is pressed; it is posted only on a pass, and the same image never counts twice. */
if(typeof phPublish==="function"){var v57Pub=phPublish;phPublish=async function(src,cap){var arm=BQARM,A=null;try{A=arm&&Date.now()-arm.t<15*60000?bqState().act[arm.k]:null}catch(e){}
  if(!A||A.done||A.ty!=="p"||!src||!src.file)return v57Pub.apply(this,arguments);
  var msg=function(t){var e=document.getElementById("bqprivmsg");if(e)e.textContent=t;else if(t)pop(t)};
  if(A.daily&&A.days&&A.days[today()]){msg("That one counts once a day. Post the next one tomorrow.");return false}
  var hh="";try{hh=hashFile(await src.file.arrayBuffer())}catch(e){}
  if(hh&&(S.hashes.indexOf(hh)>=0||pendHash(hh))){msg("This exact image was already used. Take a new one.");return false}
  msg("");var v=await v57Check(A,src.file);if(!v.ok){msg(v.why.replace(", or post it to the town",""));return false}
  var ok=await v57Pub.apply(this,arguments);if(ok&&hh){S.hashes.push(hh);S.hashes=S.hashes.slice(-300);persist()}return ok}}
if(typeof phNewHtml==="function"){var v57New=phNewHtml;phNewHtml=function(){var h=v57New.apply(this,arguments);
  try{var arm=BQARM,A=arm&&Date.now()-arm.t<15*60000?bqState().act[arm.k]:null;if(!A||A.ty!=="p")return h;var sel=PH.sel;
    h=h.replace("<h2>Post a photo</h2>","<h2>Bounty photo</h2>").replace(/<p class="note">Everyone in town sees the photo[^<]*<\/p>/,'<p class="note">Your choice: post it to the town, or keep it private. Either way it counts toward <b>'+esc(A.n)+'</b>. A private photo is checked and is not saved or shown to anyone.</p><p class="note" id="bqprivmsg" role="status"></p>')
      .replace(/<button class="btn" data-act="phsend"([^>]*)>Post<\/button>/,'<button class="btn ghost" data-act="bqpriv"'+(sel?'':' disabled')+'>Keep it private</button><button class="btn" data-act="phsend"$1>Post to the town</button>')}catch(e){}
  return h}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=bqpriv]");if(!b||b.disabled)return;e.preventDefault();e.stopPropagation();v57Private(b)},true);
htabCss("qb-v157-css","#bqprivmsg:empty{display:none}#bqprivmsg{color:var(--bad,#ff6b6b)}.ph-new .btns{flex-wrap:wrap}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV157={micro:v57Micro,val:function(o){return validate(o,"Task")},guess:function(t){return guess(t)},rpt:v57Rpt,step:V57STEP,
  cut:function(){return V57CUT.slice()},nophoto:V57NOPHOTO,pools:function(){return [BTY1.length,BTY2.length]},chk:function(f){V57CHK=f||null},force:function(v){V57FORCE=v===undefined?null:v;return v57Checker()},pub:function(file,inner){/* the posted path with a stand-in for the real upload */var real=v57Pub;v57Pub=inner||function(){return Promise.resolve(true)};return phPublish({file:file,kind:'photo',what:''},'').then(function(r){v57Pub=real;return r},function(e){v57Pub=real;throw e})},priv:function(file){PH.sel=file?{file:file,kind:"photo",what:"",url:""}:null;return v57Private(null)},newHtml:function(file){PH.sel=file?{file:file,kind:"photo",what:"",url:"data:,"}:null;return phNewHtml()},parse:function(){return PARSE}};
