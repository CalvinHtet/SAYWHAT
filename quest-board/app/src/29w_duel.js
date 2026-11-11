/* ---------- Challenges with a coin pot (Cal, 2026-11-09) ----------
   Cal: "Can there be a challenge minigame where you can challenge someone to a productivity or fitness challenge? And you can
   bet money and the two players who agree would have to put in some money that goes into a pot and gets paid out to the winner."
   - A challenge: the most quest XP (productivity) or the most Training XP (fitness) in 1, 3 or 7 days, both players putting in
     the same stake. XP, not quest counts, so a pile of tiny quests does not win it.
   - Each player writes only their own duel/<id> doc (firestore.rules): {name, out:{<cid>:{to,toName,kind,stake,days,t,cancel}},
     ans:{<cid>:{acc,t}}, sc:{<cid>:{n,fin,t}}, t}. The challenger's out holds the challenge, the other player's ans the answer,
     and each player's sc their own score.
   - The stake leaves a player's coins when they send or accept (S.duel.held) and comes back if the challenge is cancelled,
     declined or not answered within a day. It starts when accepted. When it ends each game pays itself, once (S.duel.done): the
     winner the whole pot, a tie each their stake back.
   - Scores come from a log with times (S.dlog), so only XP earned inside the window counts however late a game reads the
     acceptance, and an undone quest comes off. A score is final once its player's game has seen the end (fin), or 36 hours after
     the end with whatever that player last published.
   - They all show in the Town Hall's Posts tab, with Challenge someone at the top.
   GYM PACT (W28, v0.92; Cal: "betting each other to see who can go to the gym for 4 days this week ... If you both go, you get the
   amount back plus an extra 50%. If one of you loses, you give that other person your coins that you put in (2 x what you put in)",
   "If both lose, then both lose their stake", "A run or walk or anything active counts as a gym day"):
   - A third kind in Challenge someone. Same stakes, a goal of 3, 4 or 5 active days in the 7 days (DL.pDays) from the accept.
   - An active day (SPEC part D; ARCHITECT 06:05: Cal never said photo-only for the pact): a game day (5 am) with a full Training
     session (the gym plan or their own workout, ECON.trainXp or more, as Training pays) or a fitness quest finished with a verified
     photo (the Workout quest, a run, a walk ...). Each is logged with its time in S.dlog.a. An honor tap does not count, two in a
     day count once, an undo takes a quest off. DL.pTrain:false is the one-line switch to photo-only.
   - Both reach the goal: each gets 1.5 x the stake. One does: they get 2 x the stake, the other nothing. Neither: both stakes are
     gone. One pact at a time per player, so at most 0.5 x 2,500 = 1,250 new coins a week (SPEC part D).
   - Its own maps in the same duel/<id> doc, so a game from before the pact never reads one as a quest XP challenge:
     pout:{<cid>:{to,toName,stake,goal,days,t,cancel}}, pans:{<cid>:{acc,t}}, psc:{<cid>:{n,fin,t}} (n = that player's active days).
     Held stakes, results and seen notices share S.duel.held / done / seen with the challenges (results carry kind "p"). */
var DL={kinds:{q:["Productivity","quest XP"],w:["Fitness","Training XP"],p:["Gym Pact","workout days"]},days:[1,3,7],stakes:[100,250,500,1000,2500],goals:[3,4,5],pDays:7,pTrain:true,docs:{},busy:0,t:0,boot:0,err:"",
  ask:24*36e5,grace:36*36e5,maxOut:3,f:{to:"",kind:"q",days:3,stake:250,goal:4}};
function dlOn(){return typeof socOn==="function"&&socOn()&&loaded&&S&&S.created}
function dlSt(){if(!S.duel||typeof S.duel!=="object")S.duel={};var d=S.duel;["held","done","seen"].forEach(function(k){if(!d[k]||typeof d[k]!=="object")d[k]={}});return d}
function dlLog(){if(!S.dlog||typeof S.dlog!=="object")S.dlog={};var g=S.dlog;if(!g.q||typeof g.q!=="object")g.q={};if(!Array.isArray(g.w))g.w=[];if(!Array.isArray(g.a))g.a=[];return g}
function dlFmt(n){return Math.round(n).toLocaleString()}
function dlLeft(ms){ms=Math.max(0,ms);var h=Math.floor(ms/36e5),d=Math.floor(h/24);return d?d+"d "+(h%24)+"h":h?h+"h":Math.max(1,Math.ceil(ms/6e4))+"m"}
htabCss("qb-duel-css",
  ".dlc .dli{border-top:1px solid var(--line);padding:10px 0}.dlc .dli:first-of-type{border-top:0}"
  +".dlc .dli p{margin:0 0 8px;line-height:1.4}.dlc .dlgo{display:flex;gap:8px;flex-wrap:wrap}"
  +".dlc .dlvs{display:grid;grid-template-columns:auto 1fr auto;gap:6px 10px;align-items:center;margin:6px 0}"
  +".dlc .dlvs i{display:block;height:8px;border-radius:999px;background:var(--surface2);overflow:hidden}.dlc .dlvs i b{display:block;height:100%;background:var(--accent)}"
  +".dlc .dlvs i.o b{background:var(--muted)}.dlc .dlvs span.mono{text-align:right}"
  +".dlc .dlwin{color:var(--good,#5fe3a1)}.dlc .dllose{color:var(--muted)}"
  +".dlm .dlseg{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px}.dlm .dlseg button{flex:1 1 auto;min-height:40px;border-radius:10px;border:1px solid var(--line);background:var(--surface2);color:var(--fg);font:600 14px/1 var(--font-body,system-ui);cursor:pointer;padding:0 10px}"
  +".dlm .dlseg button.on{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);color:var(--accent)}.dlm .dlseg button:disabled{opacity:.4;cursor:default}"
  +".dlm .dlseg button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}");

/* ---- the log: quest XP by quest and time, Training XP by time; anything older than 9 days goes (the longest challenge is 7).
   The Gym Pact's active days (a) stay 16 days: a pact can be asked a day before it starts and settle 36 hours after its 7 days. ---- */
function dlPrune(){var g=dlLog(),old=Date.now()-9*864e5,oldA=Date.now()-16*864e5;Object.keys(g.q).forEach(function(k){if(!(g.q[k][0]>=old))delete g.q[k]});g.w=g.w.filter(function(x){return x[0]>=old});g.a=g.a.filter(function(x){return x&&x[0]>=oldA})}
var dlToggleBase=toggle;
toggle=function(id){var was=!!(S.done&&S.done[id]),r=dlToggleBase.apply(this,arguments);
  try{var now=!!S.done[id],g=dlLog(),t=Date.now();
    if(!was&&now){g.q[id+"|"+t]=[t,+S.done[id]||0];if(gpProven(id))g.a.push([t,String(id)]);dlPrune()}
    else if(was&&!now){var ks=Object.keys(g.q).filter(function(k){return k.slice(0,k.lastIndexOf("|"))===String(id)}).sort(function(a,b){return g.q[b][0]-g.q[a][0]});if(ks[0])delete g.q[ks[0]];
      for(var ai=g.a.length-1;ai>=0;ai--)if(g.a[ai]&&g.a[ai][1]===String(id)){g.a.splice(ai,1);break}}
    if(was!==now){persist();dlTick()}}catch(e){}
  return r};
var dlTrainBase=trainAct;
trainAct=function(a){var x0=S.xp,r=dlTrainBase.apply(this,arguments);
  try{if(a==="wkdone"&&S.xp>x0){var g=dlLog(),t=Date.now();g.w.push([t,S.xp-x0]);if(DL.pTrain&&S.xp-x0>=((typeof ECON!=="undefined"&&ECON.trainXp)||50))g.a.push([t,"wk"]);dlPrune();persist();dlTick()}}catch(e){}
  return r};
function dlScore(kind,a,b){var g=dlLog(),n=0;
  if(kind==="w")g.w.forEach(function(x){if(x[0]>=a&&x[0]<b)n+=x[1]});
  else Object.keys(g.q).forEach(function(k){var x=g.q[k];if(x[0]>=a&&x[0]<b)n+=x[1]});
  return Math.round(n)}

/* ---- every challenge this player is in, from everyone's docs ---- */
function dlAll(){var out=[],me=MYUID,now=Date.now();
  Object.keys(DL.docs).forEach(function(from){var d=DL.docs[from]||{},o=d.out||{};
    Object.keys(o).forEach(function(cid){var c=o[cid];if(!c||!c.to||(from!==me&&c.to!==me))return;var td=DL.docs[c.to]||{};
      var ch={cid:cid,from:from,to:c.to,kind:c.kind==="w"?"w":"q",stake:Math.max(0,Math.round(+c.stake||0)),days:Math.max(1,Math.min(7,+c.days||1)),t:+c.t||0,cancel:!!c.cancel,
        ans:(td.ans||{})[cid]||null,scF:(d.sc||{})[cid]||null,scT:(td.sc||{})[cid]||null};
      ch.me=from===me?"from":"to";ch.other=ch.me==="from"?c.to:from;ch.otherName=ch.me==="from"?(td.name||c.toName||"Someone"):(d.name||"Someone");
      ch.opp=ch.me==="from"?ch.scT:ch.scF;
      if(ch.cancel)ch.st="cancel";else if(!ch.ans)ch.st=now<ch.t+DL.ask?"ask":"expired";else if(!ch.ans.acc)ch.st="declined";
      else{ch.start=+ch.ans.t||ch.t;ch.end=ch.start+ch.days*864e5;ch.st=now<ch.end?"live":"over"}
      out.push(ch)})});
  return out.sort(function(a,b){return b.t-a.t})}
/* this player's doc: read fresh, change, write back, one write at a time; challenges done a month ago go */
function dlWrite(mut){var run=async function(){var ref=db.doc("duel/"+MYUID),s=await ref.get(),d=s.exists?(s.data()||{}):{};
    ["out","ans","sc","pout","pans","psc"].forEach(function(k){if(!d[k]||typeof d[k]!=="object")d[k]={}});mut(d);
    var old=Date.now()-30*864e5;["out","pout"].forEach(function(f){Object.keys(d[f]).forEach(function(k){if(!(d[f][k]&&d[f][k].t>=old))delete d[f][k]})});
    ["ans","sc","pans","psc"].forEach(function(f){Object.keys(d[f]).forEach(function(k){if(!(d[f][k]&&d[f][k].t>=old))delete d[f][k]})});
    d.name=(S.char&&S.char.name)||"Someone";d.t=Date.now();await ref.set(d);DL.docs[MYUID]=d;return d};
  var p=(DL.q||Promise.resolve()).then(run);DL.q=p.catch(function(){});return p}
async function dlLoad(){if(!dlOn()||DL.busy)return;DL.busy=1;
  try{var q=await db.collection("duel").limit(300).get(),docs={};(q.docs||[]).forEach(function(d){docs[d.id]=d.data()||{}});
    DL.docs=docs;DL.t=Date.now();DL.err="";dlNotice();dlTick()}
  catch(e){DL.err=(e&&e.code)||"error"}
  DL.busy=0;dlPaint()}
/* a new challenge to this player pops once */
function dlNotice(){var st=dlSt(),n=0;dlAll().forEach(function(c){if(c.me!=="to"||c.st!=="ask"||st.seen[c.cid])return;st.seen[c.cid]=1;n++;
  pop(c.otherName+" challenged you: "+DL.kinds[c.kind][1]+", "+dlFmt(c.stake)+" coins each. See the Town Hall.")});
  try{gpAll().forEach(function(c){if(c.me!=="to"||c.st!=="ask"||st.seen[c.cid])return;st.seen[c.cid]=1;n++;
    pop(c.otherName+" asked you to a Gym Pact: "+gpWhat(c)+". See the Town Hall.")})}catch(e){}
  if(n)persist()}
/* publishes this player's scores and settles what has ended */
function dlTick(){if(!dlOn()||!DL.t)return;var st=dlSt(),sc=(DL.docs[MYUID]||{}).sc||{},pub={},now=Date.now(),paid=0,msgs=[];
  dlAll().forEach(function(c){
    if(c.st==="live"||c.st==="over"){var n=dlScore(c.kind,c.start,c.end),fin=c.st==="over",o=sc[c.cid];
      if(!o||o.n!==n||(fin&&!o.fin))pub[c.cid]={n:n,fin:fin,t:now}}
    if(st.done[c.cid])return;var held=+st.held[c.cid]||0,r=null;
    if(c.st==="cancel"||c.st==="expired"||c.st==="declined"){if(c.me==="to"&&!held){st.done[c.cid]={r:"none",t:now};return}
      r={r:"back",c:held,why:c.st}}
    else if(c.st==="over"&&((c.opp&&c.opp.fin)||now>c.end+DL.grace)){var my=dlScore(c.kind,c.start,c.end),on=c.opp?Math.round(+c.opp.n||0):0;
      r={r:my>on?"won":my<on?"lost":"tie",my:my,on:on,c:my>on?2*c.stake:my===on?c.stake:0}}
    if(!r)return;r.name=c.otherName;r.kind=c.kind;r.stake=c.stake;r.t=now;st.done[c.cid]=r;delete st.held[c.cid];
    if(r.c){S.coins+=r.c;paid+=r.c;if(r.r==="won")S.earnedC+=c.stake}
    msgs.push(r.r==="won"?"You beat "+r.name+", "+dlFmt(r.my)+" to "+dlFmt(r.on)+": +"+dlFmt(r.c)+" coins":r.r==="lost"?r.name+" won the challenge, "+dlFmt(r.on)+" to "+dlFmt(r.my):r.r==="tie"?"A tie with "+r.name+": your "+dlFmt(r.c)+" coins are back"
      :"Challenge with "+r.name+" "+(r.why==="cancel"?"cancelled":r.why==="declined"?"declined":"not answered")+": "+dlFmt(r.c)+" coins back")});
  var ppub={};try{gpTick(st,now,ppub,msgs)}catch(e){}
  if(Object.keys(pub).length||Object.keys(ppub).length)dlWrite(function(d){Object.keys(pub).forEach(function(k){d.sc[k]=pub[k]});Object.keys(ppub).forEach(function(k){d.psc[k]=ppub[k]})}).catch(function(){});
  if(msgs.length){persist();render();msgs.forEach(function(m,i){setTimeout(function(){pop(m)},i*1900)})}}

/* ---- actions ---- */
function dlCid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
async function dlSend(){if(DL.f.kind==="p")return gpSend();var f=DL.f,w=(SOC.worlds||[]).filter(function(x){return x.id===f.to})[0],st=dlSt(),ch=dlAll();
  if(!w){pop("Pick who to challenge");return}
  if(!(DL.stakes.indexOf(f.stake)>=0)||!(DL.days.indexOf(f.days)>=0)||!DL.kinds[f.kind])return;
  if(S.coins<f.stake){pop("You need "+dlFmt(f.stake)+" coins for that stake");return}
  if(ch.filter(function(c){return c.me==="from"&&c.st==="ask"}).length>=DL.maxOut){pop("Three challenges are already waiting for an answer");return}
  if(ch.some(function(c){return c.other===w.id&&(c.st==="ask"||c.st==="live")})){pop("You already have a challenge going with "+w.name);return}
  var cid=dlCid();S.coins-=f.stake;st.held[cid]=f.stake;persist();render();closeModals();
  try{await dlWrite(function(d){d.out[cid]={to:w.id,toName:w.name,kind:f.kind,stake:f.stake,days:f.days,t:Date.now()}});pop("Challenge sent to "+w.name)}
  catch(e){delete st.held[cid];S.coins+=f.stake;persist();render();pop("Could not send ("+((e&&e.code)||"error")+"). Your coins are back.")}
  dlPaint()}
function dlFind(cid){return dlAll().filter(function(c){return c.cid===cid})[0]||null}
async function dlAccept(cid){var c=dlFind(cid),st=dlSt();if(!c||c.me!=="to"||c.st!=="ask"||st.held[cid])return;
  if(S.coins<c.stake){pop("You need "+dlFmt(c.stake)+" coins to accept");return}
  S.coins-=c.stake;st.held[cid]=c.stake;persist();render();
  try{await dlWrite(function(d){d.ans[cid]={acc:true,t:Date.now()}});pop("Challenge on. "+dlLeft(c.days*864e5)+" to go.")}
  catch(e){delete st.held[cid];S.coins+=c.stake;persist();render();pop("Could not accept ("+((e&&e.code)||"error")+"). Your coins are back.")}
  dlTick();dlPaint()}
async function dlDecline(cid){var c=dlFind(cid);if(!c||c.me!=="to"||c.st!=="ask")return;
  try{await dlWrite(function(d){d.ans[cid]={acc:false,t:Date.now()}})}catch(e){pop("Could not answer ("+((e&&e.code)||"error")+")")}
  dlTick();dlPaint()}
async function dlCancel(cid){var c=dlFind(cid);if(!c||c.me!=="from"||c.st!=="ask")return;
  try{await dlWrite(function(d){if(d.out[cid])d.out[cid].cancel=Date.now()})}catch(e){pop("Could not cancel ("+((e&&e.code)||"error")+")")}
  dlTick();dlPaint()}

/* ---- the Gym Pact (W28): its log, its view of both docs, its settling, its actions ---- */
/* a proven session: a fitness quest finished with a verified photo (an honor tap leaves vdone at 0) */
function gpProven(id){var q=(S.quests||[]).filter(function(x){return x.id===id})[0];return !!(q&&S.vdone&&S.vdone[id]>0&&q.stat==="fitness")}
function gpDayOf(t){return dstr(new Date(t-DAYSTART*36e5))}
/* this player's active days in [a, b): game days (5 am) with a proven session, each counted once */
function gpCount(a,b){var seen={};dlLog().a.forEach(function(x){if(x&&x[0]>=a&&x[0]<b)seen[gpDayOf(x[0])]=1});return Object.keys(seen).length}
function gpD(n){return n+" day"+(n===1?"":"s")}
function gpAll(){var out=[],me=MYUID,now=Date.now();
  Object.keys(DL.docs).forEach(function(from){var d=DL.docs[from]||{},o=d.pout||{};
    Object.keys(o).forEach(function(cid){var c=o[cid];if(!c||!c.to||(from!==me&&c.to!==me))return;
      var stake=Math.round(+c.stake||0),goal=Math.round(+c.goal||0);if(DL.stakes.indexOf(stake)<0||DL.goals.indexOf(goal)<0)return;
      var td=DL.docs[c.to]||{},ch={cid:cid,from:from,to:c.to,kind:"p",stake:stake,goal:goal,days:DL.pDays,t:+c.t||0,cancel:!!c.cancel,
        ans:(td.pans||{})[cid]||null,scF:(d.psc||{})[cid]||null,scT:(td.psc||{})[cid]||null};
      ch.me=from===me?"from":"to";ch.other=ch.me==="from"?c.to:from;ch.otherName=ch.me==="from"?(td.name||c.toName||"Someone"):(d.name||"Someone");
      ch.opp=ch.me==="from"?ch.scT:ch.scF;ch.mine=ch.me==="from"?ch.scF:ch.scT;
      if(ch.cancel)ch.st="cancel";else if(!ch.ans)ch.st=now<ch.t+DL.ask?"ask":"expired";else if(!ch.ans.acc)ch.st="declined";
      else{ch.start=+ch.ans.t||ch.t;ch.end=ch.start+ch.days*864e5;ch.st=now<ch.end?"live":"over"}
      out.push(ch)})});
  return out.sort(function(a,b){return b.t-a.t})}
/* this player's days in a pact: the published final count once there is one (so both games settle on the same numbers), else the log */
function gpMine(c){var o=c.mine;return o&&o.fin?Math.round(+o.n||0):gpCount(c.start,Math.min(Date.now(),c.end))}
/* one pact at a time: another one running, or this player's own offer still waiting */
function gpBusy(except){var st=dlSt();return gpAll().filter(function(c){return c.cid!==except&&!st.done[c.cid]&&(c.st==="live"||(c.st==="ask"&&c.me==="from"))})[0]||null}
function gpBusyTxt(c,raw){var nm=raw?c.otherName:esc(c.otherName);return c.st==="ask"?"Your Gym Pact offer to "+nm+" is still waiting. Cancel it to start another.":"You have a Gym Pact going with "+nm+". One at a time."}
function gpWhat(c){return c.goal+" workout days in "+c.days+", "+dlFmt(c.stake)+" coins each"}
function gpRules(){return "You both put in the stake and have "+DL.pDays+" days once it's accepted. A day counts when you "+(DL.pTrain?"finish a full Training session or ":"")
  +"prove a fitness quest with a photo: a workout, a run, a walk. Two in a day count once. Both reach the goal: each gets 1.5 times the stake. Only one does: they take both stakes. Neither does: both stakes are lost."}
/* called from dlTick: publishes this player's days (into pub, written with the challenge scores) and settles each ended pact once */
function gpTick(st,now,pub,msgs){var chg=0;
  gpAll().forEach(function(c){var my=0,o=c.mine;
    if(c.st==="live"||c.st==="over"){my=o&&o.fin?Math.round(+o.n||0):gpCount(c.start,c.end);
      if(!(o&&o.fin)&&(!o||o.n!==my||c.st==="over"))pub[c.cid]={n:my,fin:c.st==="over",t:now}}
    if(st.done[c.cid])return;var held=+st.held[c.cid]||0,r=null;
    if(c.st==="cancel"||c.st==="expired"||c.st==="declined"){if(!held){st.done[c.cid]={r:"none",kind:"p",t:now};chg=1;return}r={r:"back",c:held,why:c.st}}
    else if(c.st==="over"&&((c.opp&&c.opp.fin)||now>c.end+DL.grace)){if(!held){st.done[c.cid]={r:"none",kind:"p",t:now};chg=1;return}
      var on=c.opp?Math.round(+c.opp.n||0):0,mk=my>=c.goal,ok=on>=c.goal;
      r={r:mk&&ok?"both":mk?"won":ok?"lost":"miss",my:my,on:on,goal:c.goal,c:mk?(ok?Math.round(1.5*c.stake):2*c.stake):0}}
    if(!r)return;r.name=c.otherName;r.kind="p";r.stake=c.stake;r.t=now;st.done[c.cid]=r;delete st.held[c.cid];chg=1;
    if(r.c){S.coins+=r.c;if(r.r==="both"||r.r==="won")S.earnedC+=r.c-c.stake}
    msgs.push(gpLine(r,0))});
  if(chg&&!msgs.length)persist()}
function gpLine(r,h){var nm=h?'<b>'+esc(r.name)+'</b>':r.name;
  return r.r==="both"?"Gym Pact with "+nm+": you both made it, "+r.my+" and "+r.on+" days. +"+dlFmt(r.c)+" coins"
    :r.r==="won"?"Gym Pact with "+nm+": you made it with "+gpD(r.my)+", they had "+r.on+". +"+dlFmt(r.c)+" coins"
    :r.r==="lost"?"Gym Pact with "+nm+": they made it with "+gpD(r.on)+", you had "+r.my+". Your "+dlFmt(r.stake)+" coins went to them"
    :r.r==="miss"?"Gym Pact with "+nm+": neither of you made it ("+r.my+" and "+r.on+" days). Both stakes are lost"
    :"Gym Pact with "+nm+" "+(r.why==="cancel"?"cancelled":r.why==="declined"?"declined":"not answered")+": "+dlFmt(r.c)+" coins back"}
async function gpSend(){var f=DL.f,w=(SOC.worlds||[]).filter(function(x){return x.id===f.to})[0],st=dlSt();
  if(!w){pop("Pick who to challenge");return}
  if(DL.stakes.indexOf(f.stake)<0||DL.goals.indexOf(f.goal)<0)return;
  if(!DL.t){pop("Still reaching the other players. Try again in a moment.");dlPaint();return}
  if(S.coins<f.stake){pop("You need "+dlFmt(f.stake)+" coins for that stake");return}
  var busy=gpBusy("");if(busy){pop(gpBusyTxt(busy,1));dlPaint();return}
  var cid=dlCid();S.coins-=f.stake;st.held[cid]=f.stake;persist();render();closeModals();
  try{await dlWrite(function(d){d.pout[cid]={to:w.id,toName:w.name,stake:f.stake,goal:f.goal,days:DL.pDays,t:Date.now()}});pop("Gym Pact sent to "+w.name)}
  catch(e){delete st.held[cid];S.coins+=f.stake;persist();render();pop("Could not send ("+((e&&e.code)||"error")+"). Your coins are back.")}
  dlPaint()}
function gpFind(cid){return gpAll().filter(function(c){return c.cid===cid})[0]||null}
async function gpAccept(cid){var c=gpFind(cid),st=dlSt();if(!c||c.me!=="to"||c.st!=="ask"||st.held[cid])return;
  if(S.coins<c.stake){pop("You need "+dlFmt(c.stake)+" coins to accept");return}
  var busy=gpBusy(cid);if(busy){pop(gpBusyTxt(busy,1));dlPaint();return}
  S.coins-=c.stake;st.held[cid]=c.stake;persist();render();
  try{await dlWrite(function(d){d.pans[cid]={acc:true,t:Date.now()}});pop("Gym Pact on: "+c.goal+" workout days in the next "+c.days+".")}
  catch(e){delete st.held[cid];S.coins+=c.stake;persist();render();pop("Could not accept ("+((e&&e.code)||"error")+"). Your coins are back.")}
  dlTick();dlPaint()}
async function gpDecline(cid){var c=gpFind(cid);if(!c||c.me!=="to"||c.st!=="ask")return;
  try{await dlWrite(function(d){d.pans[cid]={acc:false,t:Date.now()}})}catch(e){pop("Could not answer ("+((e&&e.code)||"error")+")")}
  dlTick();dlPaint()}
async function gpCancel(cid){var c=gpFind(cid);if(!c||c.me!=="from"||c.st!=="ask")return;
  try{await dlWrite(function(d){if(d.pout[cid])d.pout[cid].cancel=Date.now()})}catch(e){pop("Could not cancel ("+((e&&e.code)||"error")+")")}
  dlTick();dlPaint()}
function gpDots(n,goal){var h='<span class="gpdots" aria-hidden="true">';for(var i=0;i<goal;i++)h+='<i'+(i<n?' class="on"':'')+'></i>';return h+'</span>'}
function gpItem(c){var h='<div class="dli gpi">';
  if(c.st==="ask"&&c.me==="to"){var busy=gpBusy(c.cid),poor=S.coins<c.stake;
    h+='<p><b>'+esc(c.otherName)+'</b> asks you to a Gym Pact: '+gpWhat(c)+'.</p><p class="note">'+gpRules()+'</p><div class="dlgo"><button class="btn sm" data-dl="pacc" data-c="'+esc(c.cid)+'"'+(poor||busy?' disabled':'')+'>Accept, put in '+dlFmt(c.stake)+'</button><button class="btn ghost sm" data-dl="pdec" data-c="'+esc(c.cid)+'">Decline</button></div><small class="note">'+(busy?gpBusyTxt(busy)+' ':poor?'You need '+dlFmt(c.stake)+' coins. ':'')+dlLeft(c.t+DL.ask-Date.now())+' to answer</small>'}
  else if(c.st==="ask")h+='<p>Waiting for <b>'+esc(c.otherName)+'</b> to accept a Gym Pact: '+gpWhat(c)+'.</p><div class="dlgo"><button class="btn ghost sm" data-dl="pcan" data-c="'+esc(c.cid)+'">Cancel</button></div><small class="note">Your '+dlFmt(c.stake)+' coins are in. '+dlLeft(c.t+DL.ask-Date.now())+' left to accept.</small>';
  else{var my=gpMine(c),on=c.opp?Math.round(+c.opp.n||0):0,row=function(nm,n){return '<span>'+nm+'</span>'+gpDots(n,c.goal)+'<span class="mono">'+Math.min(n,c.goal)+'/'+c.goal+'</span>'};
    h+='<p>'+(c.st==="live"?'':'<b>Ended.</b> ')+'Gym Pact with <b>'+esc(c.otherName)+'</b>, '+dlFmt(c.stake)+' coins each</p>'
      +'<div class="dlvs">'+row('You',my)+row(esc(c.otherName),on)+'</div>'
      +'<small class="note">'+(c.st==="live"?dlLeft(c.end-Date.now())+' left'+(c.opp?' &middot; '+esc(c.otherName)+'\'s days as of '+socAgo(+c.opp.t||0):''):'Waiting for '+esc(c.otherName)+'\'s final count (at most '+dlLeft(c.end+DL.grace-Date.now())+')')+'</small>'}
  return h+'</div>'}
function gpPast(r){return '<div class="dli"><p class="'+(r.r==="both"||r.r==="won"?'dlwin':r.r==="lost"||r.r==="miss"?'dllose':'')+'">'+gpLine(r,1)+'</p></div>'}

/* ---- drawing ---- */
function dlWhat(c){return 'most '+DL.kinds[c.kind][1]+' in '+c.days+' day'+(c.days>1?'s':'')+', '+dlFmt(c.stake)+' coins each'}
function dlItem(c){var h='<div class="dli">';
  if(c.st==="ask"&&c.me==="to")h+='<p><b>'+esc(c.otherName)+'</b> challenges you: '+dlWhat(c)+'. The winner takes '+dlFmt(2*c.stake)+'.</p><div class="dlgo"><button class="btn sm" data-dl="acc" data-c="'+esc(c.cid)+'"'+(S.coins<c.stake?' disabled':'')+'>Accept, put in '+dlFmt(c.stake)+'</button><button class="btn ghost sm" data-dl="dec" data-c="'+esc(c.cid)+'">Decline</button></div><small class="note">'+(S.coins<c.stake?'You need '+dlFmt(c.stake)+' coins. ':'')+dlLeft(c.t+DL.ask-Date.now())+' to answer</small>';
  else if(c.st==="ask")h+='<p>Waiting for <b>'+esc(c.otherName)+'</b> to accept: '+dlWhat(c)+'.</p><div class="dlgo"><button class="btn ghost sm" data-dl="can" data-c="'+esc(c.cid)+'">Cancel</button></div><small class="note">Your '+dlFmt(c.stake)+' coins are in the pot. '+dlLeft(c.t+DL.ask-Date.now())+' left to accept.</small>';
  else{var my=dlScore(c.kind,c.start,Math.min(Date.now(),c.end)),on=c.opp?Math.round(+c.opp.n||0):0,mx=Math.max(1,my,on);
    h+='<p>'+(c.st==="live"?'':'<b>Ended.</b> ')+DL.kinds[c.kind][1].replace(/^\w/,function(x){return x.toUpperCase()})+' against <b>'+esc(c.otherName)+'</b>, pot '+dlFmt(2*c.stake)+'</p>'
      +'<div class="dlvs"><span>You</span><i><b style="width:'+(my/mx*100)+'%"></b></i><span class="mono">'+dlFmt(my)+'</span><span>'+esc(c.otherName)+'</span><i class="o"><b style="width:'+(on/mx*100)+'%"></b></i><span class="mono">'+dlFmt(on)+'</span></div>'
      +'<small class="note">'+(c.st==="live"?dlLeft(c.end-Date.now())+' left'+(c.opp?' &middot; '+esc(c.otherName)+'\'s score as of '+socAgo(+c.opp.t||0):''):'Waiting for '+esc(c.otherName)+'\'s final score (at most '+dlLeft(c.end+DL.grace-Date.now())+')')+'</small>'}
  return h+'</div>'}
function dlPast(r){var k=DL.kinds[r.kind]||DL.kinds.q;
  return '<div class="dli"><p class="'+(r.r==="won"?'dlwin':r.r==="lost"?'dllose':'')+'">'+(r.r==="won"?'You beat <b>'+esc(r.name)+'</b> at '+k[1]+', '+dlFmt(r.my)+' to '+dlFmt(r.on)+': +'+dlFmt(r.c)+' coins'
    :r.r==="lost"?'<b>'+esc(r.name)+'</b> won at '+k[1]+', '+dlFmt(r.on)+' to '+dlFmt(r.my):r.r==="tie"?'A tie with <b>'+esc(r.name)+'</b> at '+k[1]+' ('+dlFmt(r.my)+'): stakes back'
    :'Challenge with <b>'+esc(r.name)+'</b> '+(r.why==="cancel"?'cancelled':r.why==="declined"?'declined':'not answered')+': '+dlFmt(r.c)+' coins back')+'</p></div>'}
function dlCard(){if(!dlOn())return "";var st=dlSt(),ch=dlAll(),act=ch.filter(function(c){return (c.st==="ask"||c.st==="live"||c.st==="over")&&!st.done[c.cid]});
  var pacts=[];try{pacts=gpAll().filter(function(c){return (c.st==="ask"||c.st==="live"||c.st==="over")&&!st.done[c.cid]})}catch(e){}
  var past=Object.keys(st.done).map(function(k){return st.done[k]}).filter(function(r){return r&&r.r&&r.r!=="none"}).sort(function(a,b){return b.t-a.t}).slice(0,3);
  var h='<section class="card panel dlc" id="dlcard"><div class="row" style="justify-content:space-between"><h3 class="label">Challenges</h3><button class="btn sm" data-dl="new">Challenge someone</button></div>';
  if(!act.length&&!pacts.length)h+='<p class="note">Bet coins on who earns more quest XP or Training XP in 1, 3 or 7 days. You both put in the same stake. The winner takes the pot. A Gym Pact bets on workout days instead: you both aim for 3 to 5 in a week.</p>';
  h+=pacts.map(gpItem).join("")+act.map(dlItem).join("");
  if(past.length)h+='<details><summary class="note">Finished</summary>'+past.map(function(r){return r.kind==="p"?gpPast(r):dlPast(r)}).join("")+'</details>';
  if(DL.err)h+='<p class="note">Could not reach the other players ('+esc(DL.err)+').</p>';
  return h+'</section>'}
function dlNewHtml(){var f=DL.f,ws=(SOC.worlds||[]).filter(function(w){return w&&w.id&&w.name});
  if(f.to&&!ws.some(function(w){return w.id===f.to}))f.to="";
  var seg=function(k,list,lab){return '<div class="dlseg" role="radiogroup">'+list.map(function(v){var on=f[k]===v,dis=k==="stake"&&S.coins<v;
    return '<button type="button" role="radio" aria-checked="'+on+'" class="'+(on?'on':'')+'" data-dl="f" data-k="'+k+'" data-v="'+esc(String(v))+'"'+(dis?' disabled':'')+'>'+lab(v)+'</button>'}).join("")+'</div>'};
  var pk=f.kind==="p",busy=pk?gpBusy(""):null;
  var h='<div class="card box2 dlm"><div class="rm-head"><h3>Challenge someone</h3>'+coinPillHtml()+'</div><p class="note">'+(pk?gpRules():'You both put in the stake. Whoever earns more before it ends wins the whole pot. A tie gives both stakes back.')+' They have a day to accept.</p>';
  h+='<h4 class="label">Who</h4>'+(ws.length?seg("to",ws.slice(0,24).map(function(w){return w.id}),function(id){var w=ws.filter(function(x){return x.id===id})[0];return esc(w.name)+' <small class="note">Lv '+(+w.lv||1)+'</small>'}):'<p class="note">'+(SOC.loaded?'No one else in town yet.':'Looking for players...')+'</p>');
  h+='<h4 class="label">What</h4>'+seg("kind",["q","w","p"],function(k){return DL.kinds[k][0]+' <small class="note">'+DL.kinds[k][1]+'</small>'});
  h+=pk?'<h4 class="label">Workout days out of '+DL.pDays+'</h4>'+seg("goal",DL.goals,function(d){return d+' days'}):'<h4 class="label">How long</h4>'+seg("days",DL.days,function(d){return d+' day'+(d>1?'s':'')});
  h+='<h4 class="label">Stake each</h4>'+seg("stake",DL.stakes,function(s){return dlFmt(s)});
  if(busy)h+='<p class="note">'+gpBusyTxt(busy)+'</p>';
  h+='<button class="btn" data-dl="send"'+(f.to&&S.coins>=f.stake&&!busy?'':' disabled')+'>'+(pk?'Send Gym Pact':'Send challenge')+'</button>';
  return h+'</div>'}
function dlNew(){closeModals();if(S.coins<DL.f.stake)DL.f.stake=DL.stakes[0];var m=modal(dlNewHtml());m.classList.add("dlmm");if(!SOC.loaded&&typeof socLoad==="function")socLoad().then(dlPaint)}
function dlPaint(){var c=document.getElementById("dlcard");if(c){var t=document.createElement("div");t.innerHTML=dlCard();if(t.firstElementChild)c.replaceWith(t.firstElementChild)}
  var m=document.querySelector("#layer .dlmm .dlm");if(m){var x=m.querySelector(".mx"),t2=document.createElement("div");t2.innerHTML=dlNewHtml();var nm=t2.firstElementChild;if(x)nm.insertBefore(x,nm.firstChild);m.replaceWith(nm)}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-dl]");if(!b||b.disabled)return;var a=b.dataset.dl,cid=b.dataset.c;
  if(a==="new")dlNew();
  else if(a==="f"){var k=b.dataset.k,v=b.dataset.v;DL.f[k]=k==="days"||k==="stake"||k==="goal"?+v:v;dlPaint()}
  else if(a==="send"){b.disabled=true;dlSend()}
  else if(a==="acc"){b.disabled=true;dlAccept(cid)}
  else if(a==="dec"){b.disabled=true;dlDecline(cid)}
  else if(a==="can"){b.disabled=true;dlCancel(cid)}
  else if(a==="pacc"){b.disabled=true;gpAccept(cid)}
  else if(a==="pdec"){b.disabled=true;gpDecline(cid)}
  else if(a==="pcan"){b.disabled=true;gpCancel(cid)}});
/* at the top of the Town Hall's Posts tab */
var dlPostsBase=htabPosts;
htabPosts=function(){var h="";try{h=dlCard()}catch(e){}return h+dlPostsBase.apply(this,arguments)};
/* read every minute while a challenge is open or the Hall is on screen, else every 3 minutes */
(function dlBoot(){var open=S&&S.duel&&Object.keys(S.duel.held||{}).length,hall=typeof view!=="undefined"&&view==="hall";
  setTimeout(function(){if(dlOn()&&!document.hidden)dlLoad();dlBoot()},DL.boot++?(open||hall?60000:180000):5000)})();
window.__qbDuel={st:DL,load:dlLoad,tick:dlTick,all:dlAll,score:dlScore,send:dlSend,accept:dlAccept,decline:dlDecline,cancel:dlCancel,newOpen:dlNew,pAll:gpAll,pCount:gpCount,pSend:gpSend,pAccept:gpAccept,pDecline:gpDecline,pCancel:gpCancel,pBusy:gpBusy};
