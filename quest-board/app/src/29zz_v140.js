/* ---------- Cal's 2026-11-23 Training pay ----------
   Cal: "completing a gym training session for the day should also grant exp and coins. Change scaling to "Keep it up for x1.25 coins next
   week" with a maximum of 2x coins after a 4 week streak. Missing a full session reduces it down by 0.25x each week until its back to 0."
   - A finished session pays XP and coins once a day (30_app_b.js trainAct "wkdone" already paid both, every time; the summary only said the
     XP). The first session of the day pays; another one that day is logged with its sets and graph and pays nothing, so the button is not a
     coin tap. The summary now names both.
   - Weekly Warrior's coins: x1 to start, +0.25 for each week the 4 proven workouts were done, at most x2 (after a 4 week streak); each week
     without them takes 0.25 off, down to x1. Counted from S.weekPaid, oldest week first, over the last year. The XP and the prize stay. */

var V40STEP=.25,V40MAX=2;
function v40Steps(){var p=wkKey().split("-"),d=new Date(+p[0],+p[1]-1,+p[2]),ks=[],s=0,top=Math.round((V40MAX-1)/V40STEP);
  for(var i=0;i<52;i++){d.setDate(d.getDate()-7);ks.unshift(dstr(d))}
  /* the weeks before the first one ever paid do not count against you */
  var first=-1;ks.forEach(function(k,i){if(first<0&&S.weekPaid&&S.weekPaid[k])first=i});if(first<0)return 0;
  for(var j=first;j<ks.length;j++)s=S.weekPaid[ks[j]]?Math.min(top,s+1):Math.max(0,s-1);return s}
function v40X(m){return "x"+(Math.round(m*100)/100)}
wwMult=function(){return 1+V40STEP*v40Steps()};
wwLine=function(paid){var m=wwMult(),nx=Math.min(V40MAX,m+V40STEP),dn=Math.max(1,m-V40STEP);
  if(paid)return (m>1?"This week "+v40X(m)+" coins. ":"")+(m>=V40MAX?"Keep it up to stay at "+v40X(V40MAX)+".":"Keep it up for "+v40X(nx)+" coins next week.");
  return m>1?"This week "+v40X(m)+" coins. Miss it and next week drops to "+v40X(dn)+".":"Keep it up for x1.25 coins next week."};
/* weekBonus (30_app_b.js) multiplies by wwMult(): whole coins */
var v40WB=weekBonus;weekBonus=function(){var o=v40WB.apply(this,arguments);o.coins=Math.round(o.coins);return o};

/* ---- one paid session a day ---- */
var V40WK=null;
function v40Paid(){if(!S.trainPaid||typeof S.trainPaid!=="object")S.trainPaid={};return S.trainPaid}
var v40Grant=grantXp;grantXp=function(x,coins,stat){
  if(V40WK){var P=v40Paid(),t=today();
    if(P.d===t){V40WK.paid=0;V40WK.again=1;x=0;coins=0}else{P.d=t;V40WK.paid=1;V40WK.xp=x;V40WK.coins=coins}}
  return v40Grant.call(this,x,coins,stat)};
var v40Train=trainAct;trainAct=function(a){if(a!=="wkdone")return v40Train.apply(this,arguments);
  V40WK={};try{return v40Train.apply(this,arguments)}finally{setTimeout(function(){V40WK=null},0)}};
var v40Sum=wkSummary;wkSummary=function(o,after){var w=V40WK||{};var r=v40Sum.apply(this,arguments);
  try{var ps=document.querySelectorAll("#layer .wksum p.note"),p=ps[ps.length-1];
    if(p&&/XP logged/.test(p.textContent))p.innerHTML=w.again?'Logged. Today&rsquo;s session already paid; the next one pays tomorrow.'
      :'<b style="color:var(--gold)">+'+(w.xp||o.xp)+' XP, +'+(w.coins||0)+' coins</b> for today&rsquo;s session.'}catch(e){}
  return r};


/* ---- quests already on the Board, sorted once by the 11-23 rule (30_app_b.js guess and PARSE): an open People quest about a service or a
   problem goes to Work and admin (from any group when it cancels something or is about the bank, a refund or insurance), an open quest about a date goes to People. Once per save (S.cl140). ---- */
var V40ADM=/\bbank|cancel|membership|subscription|insurance|refund|\bbills?\b|laptop|computer|\bpc\b|printer|wi-?fi|router|\bdmv\b|appointment|customer service|warranty/i;
function v40Sort(){if(!S||!S.quests||S.cl140)return 0;var n=0;
  S.quests.forEach(function(q){if(!q||S.done[q.id]||q.tut)return;var t=String(q.name||"");
    if(q.cl!=="admin"&&(q.cl==="social"?V40ADM:/\bcancel|membership|subscription|\bbank\b|refund|insurance/i).test(t)){q.cl="admin";q.stat="productivity";n++}
    else if(q.cl!=="social"&&/\b(go on|plan|book|take \w+ on) (a |the |our )?dates?\b|\bdate (night|with)\b/i.test(t)&&!V40ADM.test(t)){q.cl="social";q.stat="social";n++}});
  S.cl140=1;return n}
var v40Merge=typeof merge==="function"?merge:null;
if(v40Merge)merge=function(){var r=v40Merge.apply(this,arguments);try{v40Sort()}catch(e){}return r};

if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV140={steps:v40Steps,mult:function(){return wwMult()},line:function(p){return wwLine(p)},bonus:function(){return weekBonus()},paid:v40Paid,sort:function(){delete S.cl140;return v40Sort()}};
