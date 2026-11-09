/* ---------- bounties (Cal, 2026-11-05: "a rotating daily bounty or a 3 day bounty", and suggested tasks "such as
   'throw away one thing you have not used for more than 6 months'") ----------
   Two cards on the board: today's bounty (changes at midnight) and a 3-day bounty (changes every third day). Each is a
   chore people put off. "Take it" adds it to the board as a quest that pays 1.5x (the 3-day one 2x) and leaves when its
   window ends. "Another" swaps it, up to three times a day: Claude suggests one from the player's own list when it can,
   otherwise the next one in the list below. */
var BTY1=[
  ["Throw away one thing you have not used in six months","Pick it, bag it, out it goes.",25,"discipline","home"],
  ["Clear the kitchen counter completely","Everything off, wipe it down, put back only what you use daily.",30,"productivity","home"],
  ["Reply to the message you have been avoiding","Two sentences is enough.",25,"social","social"],
  ["Empty the car of everything that does not live there","Receipts, bottles, bags.",25,"productivity","out"],
  ["Wipe down the fridge shelves","Take out anything past its date first.",30,"productivity","home"],
  ["Unsubscribe from five email lists","Open the last five promotions and scroll to the bottom.",20,"discipline","admin"],
  ["Take a 20-minute walk with no phone","Leave it at home.",30,"fitness","out"],
  ["Book the appointment you keep postponing","Dentist, doctor, haircut, mechanic.",25,"discipline","admin"],
  ["Clean the bathroom mirror and sink","Ten minutes.",25,"productivity","home"],
  ["Delete 100 photos you will never look at","Screenshots and duplicates first.",20,"discipline","admin"],
  ["Wash the bedding","Sheets, pillowcases and the duvet cover.",30,"productivity","home"],
  ["Call someone you have not spoken to in a month","Not a text. A call.",30,"social","social"],
  ["Sort the junk drawer","Keep what has a use. Bin the rest.",30,"productivity","home"],
  ["Return or sell one thing you regret buying","List it or drop it off today.",30,"discipline","out"],
  ["Stretch for ten minutes before bed","Hamstrings, hips, shoulders.",20,"fitness","reset"],
  ["Pay or schedule every bill due this week","Check the dates once, then forget them.",25,"discipline","admin"],
  ["Clean out one shelf of the pantry","Check the dates and wipe the shelf.",25,"productivity","home"],
  ["Back up your phone","Photos first.",20,"productivity","admin"],
  ["Cook a meal from what is already in the fridge","No shopping.",30,"creativity","home"],
  ["Take the recycling and donations out","All of it, in one trip.",25,"productivity","out"],
  ["Finish one thing you started and dropped","A sketch, a song, a draft, a repair.",40,"creativity","create"],
  ["Vacuum under the couch and the bed","Move them if you can.",30,"fitness","home"],
  ["Write down three things you need to stop doing","Keep the list where you will see it.",20,"discipline","reset"],
  ["Clean your shoes","The pair you wear most.",20,"productivity","home"],
  ["Tidy your desktop and downloads folder","Files into folders, the rest in the bin.",25,"productivity","admin"],
  ["Water and wipe down every plant","Dust the leaves too.",20,"discipline","home"],
  ["Thank someone properly","A message saying exactly what they did that helped.",20,"social","social"],
  ["Do the dishes before bed","Sink empty when you turn the lights off.",25,"discipline","reset"]
];
var BTY3=[
  ["Clear out one closet","Anything not worn in a year goes to donation.",80,"discipline","home"],
  ["Deep clean the kitchen","Oven, microwave, under the sink.",80,"productivity","home"],
  ["Go through every subscription you pay for","Cancel at least one.",60,"discipline","admin"],
  ["Plan and cook three meals at home","Shop once for all three.",70,"creativity","home"],
  ["Walk 25,000 steps over three days","Split it however you like.",70,"fitness","out"],
  ["Clean out the garage, balcony or storage corner","Whatever space you avoid looking at.",80,"productivity","home"],
  ["Sort every cable, charger and old device","Recycle what you no longer use.",60,"discipline","home"],
  ["See a friend in person","Plan it, then actually go.",60,"social","social"],
  ["Finish and share one creative piece","Post it or send it to one person.",80,"creativity","create"],
  ["Wash the car inside and out","Vacuum the seats and the mats.",60,"productivity","out"],
  ["Get every paper and document into one folder","Scan what matters, shred what does not.",70,"discipline","admin"],
  ["Three workouts in three days","Any kind. One a day.",80,"fitness","body"]
];
function btyDay(){return Math.floor(Date.parse(today()+"T00:00:00Z")/864e5)}
function btyState(){var d=today(),e3=btyEnd(3),o=S.bty;if(!o||o.d!==d){var keep=o&&o.e3===e3;S.bty={d:d,rr:0,ai1:null,o1:0,e3:e3,ai3:keep?o.ai3:null,o3:keep?o.o3:0}}return S.bty}
function btyEnd(k){var n=btyDay();return k===3?dstr(new Date((n-n%3+2)*864e5+43200000)):today()}
function btyPick(k){var b=btyState(),P=k===3?BTY3:BTY1,n=btyDay(),i=(k===3?Math.floor(n/3)*7:n*11)+(k===3?b.o3:b.o1);
  var ai=k===3?b.ai3:b.ai1;if(ai)return ai;var x=P[((i%P.length)+P.length)%P.length];return {n:x[0],why:x[1],xp:x[2],stat:x[3],cl:x[4]}}
function btyTaken(k){var key=(k===3?"3:":"1:")+(k===3?btyEnd(3):today());return S.quests.some(function(q){return q.bty&&q.bty.key===key})}
function btyCard(k){var x=btyPick(k),took=btyTaken(k),b=btyState(),left=k===3?Math.max(1,Math.round((Date.parse(btyEnd(3)+"T23:59:59")-Date.now())/864e5)):0;
  return '<div class="bty-card"><span class="label">'+(k===3?'3-day bounty &middot; '+left+' day'+(left>1?'s':'')+' left':'Today\'s bounty')+'</span><b>'+esc(x.n)+'</b><small>'+esc(x.why)+'</small>'
    +'<div class="bty-row"><span class="chip xp">+'+Math.round(x.xp*(k===3?2:1.5))+' XP</span>'+(took?'<span class="chip">On your board</span>':'<button class="btn" data-act="btytake" data-k="'+k+'">Take it</button>'+(b.rr<3?'<button class="btn ghost" data-act="btynew" data-k="'+k+'"'+(BTYBUSY?' disabled':'')+'>'+(BTYBUSY===k?'Finding one':'Another')+'</button>':''))+'</div></div>'}
function btyHtml(){if(!S.created)return '';return '<section class="card panel bty"><h3 class="label">Bounties</h3><div class="bty-grid">'+btyCard(1)+btyCard(3)+'</div></section>'}
/* bounty quests leave when their window ends, done or not (done ones leave with the day's run as usual) */
function btyPrune(){var t=today();S.quests=S.quests.filter(function(q){return !q.bty||q.bty.end>=t||S.done[q.id]})}
var btyBoardBase=boardHtml;
/* Cal, 2026-11-09: "Bounties should be towards the bottom", under the task categories; finished quests stay last ("Completed
   tasks can be all the way at the bottom") */
boardHtml=function(){btyPrune();var h=btyBoardBase(),i=h.indexOf('<details class="donebox donelast"');var c=btyHtml();return i<0?h+c:h.slice(0,i)+c+h.slice(i)};
var btyMultsBase=mults;
mults=function(q,o){var r=btyMultsBase(q,o);if(q&&q.bty){var f=q.bty.k===3?2:1.5;r.m*=f;r.tags.push("Bounty x"+f);payXp(q,r)}return r};
var BTYBUSY=0;
async function btyAsk(k){var b=btyState(),mine=S.quests.map(function(q){return q.name}).slice(0,40).join("; ");
  try{var sample=window.claude?await window.claude.use("sample"):null;if(!sample)return null;
    var r=await sample.json("Suggest one household or personal chore that people often put off, for a habit game. "+(k===3?"It should take a few hours spread over three days. ":"It should take under an hour today. ")
      +"Make it concrete and specific, like 'Throw away one thing you have not used in six months'. Do not repeat any of these tasks the player already has: "+mine
      +". Plain words, no exclamation marks, no emoji. Return ONLY JSON: {\"n\":\"the task, under 60 characters\",\"why\":\"one short practical tip, under 60 characters\",\"stat\":\"one of creativity, discipline, fitness, productivity, social\",\"cl\":\"one of out, reset, home, body, admin, create, social\"}",{modelTier:"quick",cache:false});
    if(!r||!r.n)return null;return {n:String(r.n).slice(0,70),why:String(r.why||"").slice(0,80),xp:k===3?70:30,stat:STATS.some(function(s){return s[0]===r.stat})?r.stat:"discipline",cl:CLUSTERS.some(function(c){return c[0]===r.cl})?r.cl:"home"}}catch(e){return null}}
document.addEventListener("click",async function(e){var t=e.target.closest&&e.target.closest("[data-act=btytake],[data-act=btynew]");if(!t)return;var k=+t.dataset.k,b=btyState();
  if(t.dataset.act==="btytake"){if(btyTaken(k))return;var x=btyPick(k),id="q"+(S.next++);
    S.quests.push({id:id,name:x.n,xp:clampXp(x.xp),stat:x.stat,cl:x.cl,why:x.why,rep:"once",bty:{k:k,end:btyEnd(k),key:(k===3?"3:":"1:")+btyEnd(k)}});
    persist();render();pop("Bounty added to your board");return}
  if(BTYBUSY||b.rr>=3||btyTaken(k))return;BTYBUSY=k;render();var ai=await btyAsk(k);BTYBUSY=0;b=btyState();b.rr++;
  if(ai){if(k===3)b.ai3=ai;else b.ai1=ai}else{if(k===3){b.ai3=null;b.o3++}else{b.ai1=null;b.o1++}}persist();render()});
window.__qbBounty={pick:btyPick,state:btyState,end:btyEnd,BTY1:BTY1,BTY3:BTY3};
