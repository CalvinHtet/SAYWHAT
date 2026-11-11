/* ---------- Challenges in town (Cal, 2026-11-11, the last v0.92 add: "other people can see the posting and keep up with the progress
   of the challenge") ----------
   Every coin-pot challenge and Gym Pact between two players shows on the Town Hall's Posts tab for everyone, under Challenges:
   - a start post once it is accepted ("Cal and Sydney started a Gym Pact: 4 workout days in 7, 500 coins each"), with a live line under
     it (pact: each player's days with the dots; challenge: both scores and the time left);
   - a result post once both final counts are in, or 36 hours after the end on what each last published, as the games settle it
     (who made it, who took the pot; both missed: both stakes are gone).
   Read from the duel/<id> docs the game already loads for everyone (DL.docs; firestore.rules lets every signed-in player read them),
   so nobody writes anything new and nobody writes anyone else's doc. A challenge counts only when the other player's own doc accepted
   it, so a sender cannot make one up. Asked, cancelled, declined and unanswered challenges never post. The usual reactions work
   (townRxBar: each player keeps theirs in their own board doc); the two players in it cannot react to their own. Names and numbers
   come from other players' docs and are treated as hostile. Shows the last 14 days, newest first, 12 posts at most. */
var DLPDAYS=14,DLPMAX=12;
function dlpName(x){return String(typeof x==="string"?x:"").replace(/[\u0000-\u001f]/g," ").trim().slice(0,24)||"Someone"}
function dlpN(o,cap){var n=o&&typeof o==="object"?Math.round(+o.n||0):0;return isFinite(n)?Math.max(0,Math.min(cap,n)):0}
/* every accepted challenge and pact in town, from everyone's docs */
function dlpAll(){var out=[],now=Date.now(),docs=DL.docs||{};
  Object.keys(docs).forEach(function(from){var d=docs[from];if(!d||typeof d!=="object")return;
    [["out","ans","sc",0],["pout","pans","psc",1]].forEach(function(K){var o=d[K[0]];if(!o||typeof o!=="object")return;
      Object.keys(o).forEach(function(cid){var c=o[cid];if(!c||typeof c!=="object"||c.cancel||typeof c.to!=="string"||!c.to||c.to===from)return;
        var td=docs[c.to];if(!td||typeof td!=="object")return;var a=(td[K[1]]||{})[cid];if(!a||typeof a!=="object"||a.acc!==true)return;
        var stake=Math.round(+c.stake||0);if(DL.stakes.indexOf(stake)<0)return;
        var p={cid:cid,from:from,to:c.to,pact:!!K[3],stake:stake,nf:dlpName(d.name),nt:dlpName(td.name||c.toName)};
        if(p.pact){p.goal=Math.round(+c.goal||0);if(DL.goals.indexOf(p.goal)<0)return;p.days=DL.pDays;p.kind="p"}
        else{p.kind=c.kind==="w"?"w":"q";p.days=Math.max(1,Math.min(7,Math.round(+c.days||1)))}
        p.start=+a.t||+c.t||0;if(!(p.start>0)||p.start>now+6e4||p.start<now-(DLPDAYS+p.days)*864e5)return;
        p.end=p.start+p.days*864e5;var cap=p.pact?p.days:1e7,sf=(d[K[2]]||{})[cid],st=(td[K[2]]||{})[cid];p.af=dlpN(sf,cap);p.at=dlpN(st,cap);
        p.fin=now>=p.end&&((sf&&sf.fin&&st&&st.fin)||now>p.end+DL.grace);p.live=now<p.end;
        out.push(p)})})});
  return out}
function dlpMine(p){return p.from===MYUID||p.to===MYUID}
function dlpStart(p){var a='<b>'+esc(p.nf)+'</b>',b='<b>'+esc(p.nt)+'</b>';
  return p.pact?a+' and '+b+' started a Gym Pact: '+p.goal+' workout days in '+p.days+', '+dlFmt(p.stake)+' coins each.'
    :a+' challenged '+b+': '+dlWhat(p)+'.'}
function dlpLive(p){var h='<div class="dlvs">';
  if(p.pact){var row=function(nm,n){return '<span>'+esc(nm)+'</span>'+gpDots(Math.min(n,p.goal),p.goal)+'<span class="mono">'+Math.min(n,p.goal)+'/'+p.goal+'</span>'};h+=row(p.nf,p.af)+row(p.nt,p.at)}
  else{var mx=Math.max(1,p.af,p.at),row2=function(nm,n,o){return '<span>'+esc(nm)+'</span><i'+(o?' class="o"':'')+'><b style="width:'+(n/mx*100)+'%"></b></i><span class="mono">'+dlFmt(n)+'</span>'};h+=row2(p.nf,p.af,0)+row2(p.nt,p.at,1)}
  return h+'</div>'}
function dlpState(p){return p.live?dlLeft(p.end-Date.now())+' left':p.fin?'Finished':'Ended, waiting for the final counts'}
function dlpResult(p){var a='<b>'+esc(p.nf)+'</b>',b='<b>'+esc(p.nt)+'</b>';
  if(p.pact){var ma=p.af>=p.goal,mb=p.at>=p.goal;
    return ma&&mb?'Gym Pact done: '+a+' and '+b+' both made it, '+p.af+' and '+p.at+' days. Each gets 1.5 times the stake back.'
      :ma||mb?'Gym Pact done: '+(ma?a:b)+' made it with '+gpD(ma?p.af:p.at)+', '+(ma?b:a)+' had '+(ma?p.at:p.af)+'. '+(ma?a:b)+' takes both stakes.'
      :'Gym Pact done: neither '+a+' nor '+b+' made it ('+p.af+' and '+p.at+' days). Both stakes are gone.'}
  var k=DL.kinds[p.kind][1];
  return p.af===p.at?'A tie between '+a+' and '+b+' at '+dlFmt(p.af)+' '+k+'. Both stakes back.'
    :(p.af>p.at?a:b)+' beat '+(p.af>p.at?b:a)+' at '+k+', '+dlFmt(Math.max(p.af,p.at))+' to '+dlFmt(Math.min(p.af,p.at))+', and takes the pot of '+dlFmt(2*p.stake)+'.'}
/* the posts: a start post per challenge and a result post once it is settled, each with the reactions */
function dlpPosts(){var L=[];dlpAll().forEach(function(p){var key=p.from+":"+p.cid,me=dlpMine(p)?MYUID:p.from;
    L.push({t:p.start,p:p,id:"dls:"+key+"|"+p.start,from:me,res:0});
    if(p.fin)L.push({t:p.end,p:p,id:"dlr:"+key+"|"+p.end,from:me,res:1})});
  return L.sort(function(a,b){return b.t-a.t}).slice(0,DLPMAX)}
function dlpHtml(){if(!dlOn())return "";var L=dlpPosts();if(!L.length)return "";
  return '<section class="card panel dlc dlpub" id="dlpub"><h3 class="label">Challenges in town</h3>'+L.map(function(x){var p=x.p,cl=!x.res?"":p.pact?(p.af>=p.goal||p.at>=p.goal?"dlwin":"dllose"):p.af!==p.at?"dlwin":"";
    return '<div class="dli dlpi"><p'+(cl?' class="'+cl+'"':'')+'>'+(x.res?dlpResult(p):dlpStart(p))+'</p>'+(x.res?'':dlpLive(p))
      +'<small class="note">'+(x.res?'':dlpState(p)+' &middot; ')+socAgo(x.t)+'</small>'+(typeof townRxBar==="function"?townRxBar(x):'')+'</div>'}).join("")+'</section>'}
function dlpPaint(){var c=document.getElementById("dlpub"),h="";try{h=dlpHtml()}catch(e){}if(!c)return;var t=document.createElement("div");t.innerHTML=h;if(t.firstElementChild)c.replaceWith(t.firstElementChild);else c.remove()}
/* under the player's own Challenges card at the top of the Posts tab */
var dlpPostsBase=htabPosts;
htabPosts=function(){var h=dlpPostsBase.apply(this,arguments),m="";try{m=dlpHtml()}catch(e){}if(!m)return h;
  var i=h.indexOf('id="dlcard"'),j=i<0?-1:h.indexOf("</section>",i);return j<0?m+h:h.slice(0,j+10)+m+h.slice(j+10)};
var dlpPaintBase=dlPaint;dlPaint=function(){var r=dlpPaintBase.apply(this,arguments);if(document.getElementById("dlpub"))dlpPaint();return r};
/* a reaction on one of these posts shows at once (the town board repaints only its own panel) */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#dlpub [data-act=snrx]");if(b)setTimeout(dlpPaint,0)},true);
if(window.__qbDuel)window.__qbDuel.pub={all:dlpAll,posts:dlpPosts,html:dlpHtml};
