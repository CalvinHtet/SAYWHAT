/* ---------- Cal 2026-11-26: a 7-day login calendar ----------
   Cal (idea 12, yes): a 7-day login calendar.
   - The first time the game is opened on a new day, a card shows seven days with today's lit; Claim pays it. Day 7 pays the most and a
     streak freeze (coins in its place when the freezes are full), then the week starts over at day 1.
   - A missed day costs nothing: the calendar waits on the day you are at, so a casual player still reaches day 7.
   - It is small next to tasks on purpose (Cal: passive income must not overshadow tasks): 2,200 coins a week, flat at
     every level, so it never matters more than a day of tasks.
   - It waits for the tutorial and never covers another window: it shows on the Board once nothing else is open. Closed without
     claiming, it comes back the next time the game is opened that day. */
var V92PAY=[100,150,200,250,300,400,800];
function v92St(){if(!S.v92||typeof S.v92!=="object")S.v92={n:0,d:""};return S.v92}
function v92Due(){try{if(!loaded||!S||!S.created||!(S.tutDone||effLvl()>=3))return false;return v92St().d!==today()}catch(e){return false}}
function v92Coins(i){return V92PAY[i]}
function v92Html(){var o=v92St(),n=o.n%7;
  return '<div class="card box2 v92m"><span class="label">Daily login</span><h2 style="font-size:24px">Day '+(n+1)+' of 7</h2><p class="note">Open the game each day for a little extra. Miss a day and it just waits.</p><div class="v92grid">'
    +V92PAY.map(function(c,i){var st=i<n?' v92got':i===n?' v92now':'';return '<div class="v92d'+st+(i===6?' big':'')+'"><small>Day '+(i+1)+'</small><b><i class="coin"></i> '+v92Coins(i).toLocaleString()+'</b>'+(i===6?'<em>+ streak freeze</em>':'')+(i<n?'<span class="v92ck">&#10003;</span>':'')+'</div>'}).join("")
    +'</div><div class="btns"><button class="btn" data-v92="claim">Claim day '+(n+1)+'</button></div></div>'}
function v92Open(){if(!v92Due()||document.querySelector("#layer .v92m"))return false;try{modal(v92Html())}catch(e){return false}return true}
function v92Claim(){if(!v92Due())return;var o=v92St(),n=o.n%7,c=v92Coins(n),extra="";
  S.coins=(S.coins||0)+c;S.earnedC=(S.earnedC||0)+c;
  if(n===6){try{if((S.freezes||0)<maxFreeze()){S.freezes=(S.freezes||0)+1;extra=" and a streak freeze"}else{var x=v92Coins(2);S.coins+=x;S.earnedC+=x;c+=x}}catch(e){}}
  o.d=today();o.n=(n+1)%7;persist();try{qbSnd("coins")}catch(e){}
  var m=document.querySelector("#layer .v92m");if(m&&m.closest(".modal"))m.closest(".modal").remove();render();pop("+"+c.toLocaleString()+" coins"+extra)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-v92="claim"]');if(!b)return;e.preventDefault();e.stopPropagation();v92Claim()},true);
/* shown once a day, when nothing else is open */
var V92TRY="";setInterval(function(){try{if(!v92Due()||V92TRY===today()+"|"+(document.hidden?1:0))return;if(document.hidden)return;
    if(document.querySelector("#layer .modal,.dropsplash,.bsplash,#qbtour .tour-bub,.lvup"))return;if(typeof view!=="undefined"&&view!=="board")return;
    if(v92Open())V92TRY=today()+"|0"}catch(e){}},2500);
htabCss("qb-v192-css",".v92grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0 14px}.v92d{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;border-radius:12px;border:1px solid var(--line,#2a2f45);background:rgba(255,255,255,.03);text-align:center}"
  +".v92d small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#9aa0b6)}.v92d b{font-size:14px;white-space:nowrap}.v92d em{font-style:normal;font-size:10px;color:#7cf0ff}"
  +".v92d.big{grid-column:span 2;background:linear-gradient(160deg,rgba(124,240,255,.10),rgba(155,92,255,.12))}.v92d.v92got{opacity:.45}.v92d.v92now{border-color:#7cf0ff;box-shadow:0 0 0 1px #7cf0ff,0 0 16px rgba(124,240,255,.35);opacity:1}"
  +".v92ck{position:absolute;top:4px;right:6px;color:#4de8b0;font-weight:800}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV192={st:v92St,due:v92Due,open:v92Open,claim:v92Claim,pay:function(i){return v92Coins(i)}};
