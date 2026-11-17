/* ---------- Cut the fat (Cal, 2026-11-16) ----------
   Cal: "Some text on the app is just a lot of clutter with not a necessary need. Such as the explanation of how exp compounds and stuff
   in the main board. This could be explained in the tutorial or info screen, which would clear up a lot of random text clutter. Review
   the rest of the game and find where we can cut the fat."
   Every screen kept its numbers (counts, timers, rewards) and lost its paragraph of rules. The rules live here, one entry per card, and
   open from a small (i) next to the card's title: qbI("dq") returns that button. Nothing is lost: the same words, in a sheet. */
var QBINFO={
  dq:["Daily Quest",function(){var w=(ECON&&ECON.wqDays)||4;return [
    "Ticking tasks fills the bar. Each chest you pass opens, and one more chest is hidden past the last.",
    "Quick tasks count a little less here (a 5 XP task counts 60%, a 10 XP task 80%); bigger tasks and workouts fill it fastest. Bonus XP from combos, crits, rested days and your class still goes to your level and coins, only not to this bar. In your first week every task counts in full.",
    "Your town runs at the bar's speed: the fuller it is, the more your rooms earn today. The hidden chest adds 10% tomorrow.",
    "Weekly Quest: be active (50+ XP) on "+w+" days, Monday to Sunday, for half a level of XP.",
    "Rested: after time away, quests pay double until the rested XP runs out."]}],
  trial:["Level trial",function(){return [
    "Your XP keeps counting while the bar is full and is released when you pass.",
    "Pass with a fresh photo of you being active: the gym, a run, a walk, a hike, a game, a class, a home workout. Or pass on honor by being active (50+ XP) on "+((ECON&&ECON.trialDays)||2)+" days.",
    "Screenshots and photos you already used fail. Claude checks the scene; "+(S&&S.gym?"a photo at your saved gym also passes on location alone.":"a pass at a gym saves its location."),
    "The photo is not saved anywhere."]}],
  train:["Training",function(){var wb={xp:"",coins:""};try{wb=weekBonus()}catch(e){}return [
    "Each Workout quest you prove with a live photo counts once a day.",
    "4 in a week (Monday to Sunday) pays +"+wb.xp+" XP and +"+wb.coins+" coins plus a random prize.",
    /* QA (c7051f3): the streak goes x2, x3 and so on up to wwMax, and the coins above already include this week's */
    "Each week in a row raises the coins: "+(function(){var m=(ECON&&ECON.wwMax)||4,o=[];for(var i=2;i<=m;i++)o.push("x"+i);return o.length>1?o.slice(0,-1).join(", ")+", then "+o[o.length-1]+" at most":o.join("")})()+". Miss a week and it starts over."]}],
  gym:["Gym plans",["Every session is balanced across the body and capped at about an hour, with supersets to save time. Pick a body part and the plan builds around it.",
    "Tap Swap on any exercise to change it for good in that plan."]],
  own:["Your own workouts",["No gym? Add what you do instead: a run, a walk, a bike ride, yoga, a sport. It goes into a plan of its own and keeps the same log as the gym."]],
  wk:["Logging a workout",["Set the weight, then tap the set you just did: it keeps that weight, and next time it shows what you lifted.",
    "Logging pays a little XP and saves your weights. The big reward is the Workout quest: prove it with a live photo."]],
  crawl:["Dungeon Crawls",["Pick a dungeon, put the phone down and go do your real quests. Come back when the timer is up.",
    "Every crawl brings home coins, and deeper dungeons hide more. Now and then you find something rare.",
    "Quest effort: the fuller your Daily Quest, the better the loot."]],
  allies:["Rescued allies",["Someone is trapped in every dungeon. Find them on a crawl and they move into your Loft with a perk for good."]],
  wheel:["The Wheel",["One free spin every 4 hours. Coins, now and then a streak freeze, and the thin gold slivers hold a piece of clothing from any brand in the game."]],
  likes:["Likes",function(){var r="";try{r=fshRule()+". "}catch(e){}var pz="";try{pz=" The top 3 win "+FSHPRIZE.map(function(c){return c.toLocaleString()}).join(" / ")+" coins and a medal."}catch(e){}return [
    "Tap a look to like it. "+r+"Every like counts.","The week ends Sunday 7 pm Pacific."+pz]}],
  coach:["Coaches",["A new coach runs each session. Every session earns that coach XP. Higher levels boost your quests, and top coaches show up in your Gym."]],
  vault:["The Vault",["Only 3 brands stay live. When a 4th drops, the oldest retires here and returns much later.","Vaulted brands are unavailable until they return. Pieces you own stay in your wardrobe."]]
};
function qbI(k){return QBINFO[k]?'<button type="button" class="qbi" data-act="qbinfo" data-k="'+k+'" aria-label="How '+esc(QBINFO[k][0])+' works">i</button>':''}
function qbInfo(k){var e=QBINFO[k];if(!e)return;var t=typeof e[1]==="function"?e[1]():e[1];
  modal('<div class="card box2 qbinfo"><span class="label">How it works</span><h2>'+esc(e[0])+'</h2>'+t.map(function(x){return '<p class="note">'+esc(x)+'</p>'}).join("")
    +'<div class="row"><button type="button" class="btn" data-act="mclose">Got it</button></div></div>')}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=qbinfo]");if(!b)return;e.preventDefault();e.stopPropagation();qbInfo(b.dataset.k)},true);
/* ---------- The Loft's first open (Cal, 2026-11-16: "a little slow here and there"; his phone: The Loft 1.2 s on the first open, 0.1-0.4 s
   after). The first time you appear in The Loft, every frame of you (standing, walking both ways, each bed) is rendered then and there.
   A few seconds after the app opens, while you sit on another tab, the same frames are queued (the rig's queue does one frame, then lets
   the page breathe), so The Loft finds them ready. Same look, same frames: nothing changes but when the work happens. */
var QBWARM=0;
function qbWarmMe(){if(QBWARM||!window.QBLoft||!S||!S.created||typeof lookOf!=="function")return;if(document.hidden||view==="hideout"){QBWARM=0;return}
  try{var L=lookOf();if(L&&L.rig){QBWARM=1;QBLoft.warm(L.rig)}}catch(e){}}
setTimeout(function tick(){try{qbWarmMe()}catch(e){}if(!QBWARM)setTimeout(tick,5000)},6000);
(function(){var st=document.createElement("style");
  st.textContent=".qbi{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;margin-left:6px;padding:0;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--muted,inherit);font:600 12px/1 var(--font-body,inherit);font-style:italic;cursor:pointer;vertical-align:middle;flex:none}"
    +".qbi:hover,.qbi:focus-visible{color:var(--fg);border-color:var(--accent)}.qbinfo p.note{margin:8px 0;line-height:1.45}.lbi{display:inline-flex;align-items:center}";
  (document.head||document.documentElement).appendChild(st)})();
