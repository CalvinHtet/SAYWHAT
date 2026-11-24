/* ---------- Cal's 2026-11-24 list, batch 2 (docs/specs/2026-11-24_SPEC_cal_list.md): the scratch card ----------
   Cal: "i love the idea of a scratch card instead of a spinning wheel. Lets do a 3x3 scratch card. If you match 3 of my SAYMORE mascot
   logo icon (the picture used for the homescreen shortcut of the mascot throwing a piece sign), then you win a big prize. If you match 3
   neon orange Ø logos, then a medium prize, 3 Ø neon cyan logo, then a small prize. If no matches, then each icon should have a small
   coin prize tied to it and you just add it up. Obviously matching all 3 should give you more coins than choosing 3 unmatching icons.
   You can scratch it off once per day only after you complete at least 3 tasks", and "please make it look nice and not super tacky as
   if it was made in MS Paint".
   - It takes the Wheel's place: the same screen (view "wheel"), the same level, the same row under the Daily Quest when one is ready.
     One card a day, open once 3 tasks are done that day (S.cdone, what the day's coin momentum counts). The Wheel's 4-hour timer goes.
   - Nine foil panels, scratch three. What the three show is rolled when the card is first opened (S.sc.out), so the odds do not depend
     on which panels are picked; each scratch shows the next of the three, and the other six are shown, dimmed, when the card is done.
   - Cal 11-24, after seeing it: "almost 5000 coins is a lot of coins. It should be 1500 coins max for the highest tier, then 1000 coins,
     then 500 coins. No clothing items or other prizes. Just coins. Maybe once in a while, it will have a golden mascot icon and that
     could include a free clothing item." So the prizes are flat coins at every level (no reward scale): three mascots 1,500, three
     orange 1,000, three cyan 500. No match: mascot 120, orange 70, cyan 50 each, added up (190 to 310), always under the smallest match.
   - Golden mascots (Cal 11-24, later: "if 3 out of 100 are golden, make it so that if they even get 1 golden mascot, it is a clothing
     item. 2 would be a rare clothing item. 3 would be a legendary clothing item from the rare legenedary shop towards the end game").
     About 3 cards in 100 show gold: one golden mascot 2.3%, two 0.55%, three 0.15%. A golden mascot counts as a mascot for the coins
     (so three golden are also three mascots: 1,500), and the gold is what gives clothing: one = a Street piece (never the luxury
     tier), two = a Boutique piece, three = an Atelier piece (the level 70 floor), each one the player can wear and does not own, from
     any brand on that floor, open to them yet or not; with none left on a floor it steps down one. Gold is a surprise: the card's legend
     and its (i) do not mention it.
   - Odds a card (SCODDS): gold 3% as above, three mascots 2%, three orange 8%, three cyan 20%, no match 67%.
   - An average card is about 375 coins (the Wheel paid 310 a spin x the reward scale, up to six spins a day). */
var SCNEED=3,SCODDS=[["g1",2.3],["g2",.55],["g3",.15],["m",2],["o",8],["c",20],["x",67]],SCPRIZE={m:1500,o:1000,c:500},SCVAL={m:120,o:70,c:50},SCMIX=[["c",50],["o",35],["m",15]],
    SCNAME={m:"Three mascots",o:"Three orange",c:"Three cyan"},SCGOLD=[null,["street","a piece of clothing"],["boutique","a rare piece"],["atelier","a legendary piece"]],SCRND=Math.random;
function scArt(k){k="sc_"+k+".webp";return (window.QBART&&QBART[k])||"art/"+k}
/* the mascot is its picture; the two Ø are Cal's logo (art/src-cal/o_white.webp, the solid strokes) used as a mask over a flat neon colour
   with a glow, so they read bold and clean at any size (his thin-line colour files went faint on the dark card) */
function scIcon(s){if(s==="m"||s==="g")return '<img class="sc-ic sc-m'+(s==="g"?' sc-g':'')+'" src="'+scArt("mascot")+'" alt="'+(s==="g"?"Golden mascot":"Mascot")+'" draggable="false">';var u="url("+scArt("o_mask")+")";
  return '<span class="sc-ic sc-gl sc-'+s+'" role="img" aria-label="'+(s==="o"?"Orange":"Cyan")+' logo" style="-webkit-mask-image:'+u+';mask-image:'+u+'"></span>'}
function scPick(W){var t=W.reduce(function(a,w){return a+w[1]},0),x=SCRND()*t;for(var i=0;i<W.length;i++){x-=W[i][1];if(x<0)return W[i][0]}return W[W.length-1][0]}
function scTasks(){return Object.keys((S&&S.cdone)||{}).length}
function scState(){var t=today();if(!S.sc||typeof S.sc!=="object"||S.sc.d!==t)S.sc={d:t,out:null,pick:[],done:0,res:""};return S.sc}
function scReady(){var c=scState();return !c.done&&scTasks()>=SCNEED}
/* the three that will show: a match, or three that are not all the same */
function scBase(q){return q==="g"?"m":q}
function scRoll(){var k=scPick(SCODDS),a;
  if(/^g/.test(k)){var n=+k.slice(1);a=[];for(var i=0;i<3;i++)a.push(i<n?"g":scPick(SCMIX));
    for(var j=2;j>0;j--){var r=Math.floor(SCRND()*(j+1)),t=a[j];a[j]=a[r];a[r]=t}return a}
  if(k!=="x")return [k,k,k];do{a=[scPick(SCMIX),scPick(SCMIX),scPick(SCMIX)]}while(a[0]===a[1]&&a[1]===a[2]);return a}
/* a piece from a floor for the gold: any brand of that floor, worn, fitting, not owned; stepping down a floor when it has none */
function scGoldPiece(n){var lux=function(it){return clothTier(it[0])==="luxury"},on=function(it,fl){return brandFloor(it[6].b)===fl},
    pool=SHOP.filter(function(it){var e=it[6]||{};return /^a_/.test(it[1])&&e.b&&e.b!=="basics"&&!e.dungeon&&!S.owned[it[0]]&&(typeof isRigItem!=="function"||isRigItem(it))&&itemFits(it)}),
    pick=function(p,tag){if(!p.length)return null;var it=p[Math.floor(Math.random()*p.length)];return {it:it,fl:tag||brandFloor(it[6].b)}},r=null;
  if(n>=3){r=pick(pool.filter(function(it){return on(it,"atelier")}));
    /* the Atelier has no brand yet (LEAD 11-24): until it does, "legendary" is one of the ten dearest pieces the player could get */
    if(!r)r=pick(pool.slice().sort(function(x,y){return y[3]-x[3]}).slice(0,10),"top")}
  if(!r&&n>=2)r=pick(pool.filter(function(it){return on(it,"boutique")}));
  if(!r)r=pick(pool.filter(function(it){return on(it,"street")&&!lux(it)}));
  return r}
/* the six never scratched, filled in for the reveal */
function scRest(){var a=[];for(var i=0;i<6;i++)a.push(scPick(SCMIX));return a}
function scPay(c){var o=c.out,B=o.map(scBase),match=B[0]===B[1]&&B[1]===B[2],k=B[0],gold=o.filter(function(q){return q==="g"}).length,extra="";
  var coins=match?SCPRIZE[k]:B.reduce(function(a,q){return a+SCVAL[q]},0);
  if(gold){var g=null;try{g=scGoldPiece(gold)}catch(e){}
    if(g){var it=g.it,br=BRANDS.filter(function(x){return x.id===it[6].b})[0];S.owned[it[0]]=true;c.item=it[0];c.itemFl=g.fl;
      extra=" and "+SCGOLD[gold][1]+": "+it[2]+(br?" from "+br.name:"")+(hasRoom("closet")?" (in your Closet)":" (saved for later)")}}
  S.coins+=coins;S.earnedC+=coins;c.done=1;c.win=match?k:"";c.gold=gold;c.coins=coins;c.rest=scRest();
  c.res=(match?SCNAME[k]+": ":"")+coins.toLocaleString()+" coins"+extra;S.wheel=today();S.wheelRes=c.res;S.wheelAt=Date.now();
  persist();return c}
function scScratch(i){var c=scState();if(c.done||scTasks()<SCNEED||c.pick.indexOf(i)>=0||c.pick.length>=3||i<0||i>8)return;
  if(!c.out)c.out=scRoll();c.pick.push(i);persist();try{qbSnd("build")}catch(e){}
  if(c.pick.length<3){render();return}
  scPay(c);render();
  setTimeout(function(){try{checkBadges()}catch(e){}try{qbSnd(c.win||c.gold?"big":"build")}catch(e){}if(c.win||c.gold)try{burst(innerWidth/2,innerHeight/2.6,c.gold?40+20*c.gold:c.win==="m"?60:34)}catch(e){}pop("Scratch card: "+c.res)},650)}
function scCell(c,i){var k=c.pick.indexOf(i),open=k>=0,sym=open?c.out[k]:null,rest=null;
  if(!open&&c.done&&c.rest){var n=0;for(var j=0;j<i;j++)if(c.pick.indexOf(j)<0)n++;rest=c.rest[n]}
  var win=c.done&&open&&(c.win||sym==="g");
  return '<button type="button" class="sc-cell'+(open?' open':'')+(rest?' rest':'')+(win?' win':'')+'" data-act="scratch" data-i="'+i+'"'+((open||c.done||scTasks()<SCNEED)?' disabled':'')+' aria-label="'+(open||rest?'Panel '+(i+1):'Scratch panel '+(i+1))+'">'
    +(sym||rest?'<span class="sc-face sc-glow-'+(sym||rest)+'">'+scIcon(sym||rest)+(c.done&&!c.win&&open?'<i class="sc-v">+'+SCVAL[scBase(sym)]+'</i>':'')+'</span>':'')
    +(open||rest?'':'<span class="sc-foil"><i></i></span>')+(open&&k===c.pick.length-1&&!c.done?'<span class="sc-dust"></span>':'')+'</button>'}
function scHtml(){var c=scState(),n=scTasks(),lock=!c.done&&n<SCNEED,left=3-c.pick.length,cells="";for(var i=0;i<9;i++)cells+=scCell(c,i);
  var legend=function(s,t){return '<div class="sc-leg sc-glow-'+s+'">'+scIcon(s)+scIcon(s)+scIcon(s)+'<b>'+t+'</b></div>'};
  return '<section class="card panel sc-wrap"><h3 class="label lbi">Scratch card'+qbI("wheel")+'</h3>'
   +'<div class="sc-card'+(lock?' locked':'')+(c.done?' done':'')+(c.win?' won won-'+c.win:'')+'"><div class="sc-top"><span class="sc-brand">SAYWHAT</span><span class="sc-sub">Daily card</span></div>'
   +'<div class="sc-grid">'+cells+'</div>'
   +'<div class="sc-foot">'+(lock?'<b>Finish '+(SCNEED-n)+' more task'+(SCNEED-n===1?'':'s')+' today to scratch</b><span class="sc-prog"><i style="width:'+Math.round(100*n/SCNEED)+'%"></i></span>'
      :c.done?'<b>'+esc(c.res)+'</b><span>A new card tomorrow.</span>':'<b>Scratch '+left+' panel'+(left===1?'':'s')+'</b><span>Match three to win big.</span>')+'</div></div>'
   +'<div class="sc-legs">'+legend("m",SCPRIZE.m.toLocaleString()+" coins")+legend("o",SCPRIZE.o.toLocaleString()+" coins")+legend("c",SCPRIZE.c.toLocaleString()+" coins")+'</div>'
   +'</section>'}
wheelHtml=function(){return scHtml()};
spin=function(){};
if(typeof wheelLeft==="function")wheelLeft=function(){return scReady()?0:1};
/* the row under the Daily Quest: ready, or how many tasks to go (nothing once today's is scratched) */
zxSpin=function(){try{if(!zxOpen("wheel"))return "";var c=scState(),n=scTasks();if(c.done)return "";
    if(n<SCNEED)return '<button type="button" class="zx-next zx-spin zx-sc wait" data-act="nav" data-v="wheel"><span class="label">Scratch card</span><span>Finish '+(SCNEED-n)+' more task'+(SCNEED-n===1?'':'s')+' to scratch today&rsquo;s card.</span><b>'+n+'/'+SCNEED+'</b></button>';
    return '<button type="button" class="zx-next zx-spin zx-sc" data-act="nav" data-v="wheel"><span class="label">Scratch card</span><span>Today&rsquo;s card is ready.</span><b>Scratch &rsaquo;</b></button>'}catch(e){return ""}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-act=scratch]");if(!b||b.disabled)return;e.preventDefault();e.stopPropagation();scScratch(+b.dataset.i)},true);
(function(){var a=AREAS.filter(function(x){return x[0]==="wheel"})[0];if(a)a[1]="Scratch card";
  QBINFO.wheel=["Scratch card",function(){return ["One card a day, once you have finished "+SCNEED+" tasks that day.","Scratch three of the nine panels. Three of a kind wins: mascots pay the most, then orange, then cyan.",
    "No match still pays: every icon you uncover is worth a few coins, added up."]}];
  try{TOURS.forEach(function(t){if(t.id==="wheel")t.steps=[{sel:".zx-spin",t:"New: the scratch card",x:"One card a day, once you have finished "+SCNEED+" tasks. Scratch three panels and match them to win. Tap to open it.",tap:1}]})}catch(e){}})();
htabCss("qb-sc-css",
  ".sc-wrap{overflow:hidden}.sc-card{position:relative;box-sizing:border-box;width:100%;margin:10px auto 14px;max-width:340px;padding:14px 14px 12px;border-radius:20px;background:radial-gradient(120% 90% at 20% 0%,#1b2140 0%,#0d0f1e 55%,#07080f 100%);border:1px solid rgba(124,240,255,.35);box-shadow:0 0 0 1px rgba(255,255,255,.04) inset,0 10px 30px rgba(0,0,0,.5),0 0 28px rgba(0,229,255,.12)}"
  +".sc-card::before{content:\"\";position:absolute;inset:0;border-radius:20px;pointer-events:none;background:linear-gradient(135deg,rgba(0,255,255,.10),transparent 30%,transparent 70%,rgba(255,90,40,.10))}"
  +".sc-top{display:flex;justify-content:space-between;align-items:baseline;margin:0 4px 10px}.sc-brand{font-weight:800;letter-spacing:.22em;font-size:.95em;background:linear-gradient(90deg,#00ffff,#ff5a28);-webkit-background-clip:text;background-clip:text;color:transparent}.sc-sub{font-size:.7em;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5)}"
  +".sc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}"
  +".sc-cell{position:relative;aspect-ratio:1;padding:0;border-radius:14px;border:1px solid rgba(255,255,255,.10);background:#090a14;overflow:hidden;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .12s}.sc-cell:not(:disabled):active{transform:scale(.95)}.sc-cell:disabled{cursor:default}"
  +".sc-foil{position:absolute;inset:0;background:linear-gradient(135deg,#8f96ad 0%,#d9dcea 22%,#9aa0b6 40%,#eef0f8 58%,#8a90a8 78%,#c6cada 100%);background-size:220% 220%;animation:scsheen 5s linear infinite}"
  +".sc-foil i{position:absolute;inset:0;opacity:.55;background:repeating-linear-gradient(45deg,rgba(0,0,0,.10) 0 2px,transparent 2px 7px),radial-gradient(circle at 50% 50%,rgba(255,255,255,.0) 0 26%,rgba(20,24,44,.5) 27% 29%,rgba(255,255,255,0) 30%)}"
  +".sc-foil::after{content:\"\\00D8\";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 1.5em/1 system-ui,sans-serif;color:rgba(20,24,44,.55)}"
  +".sc-card.locked .sc-foil{filter:grayscale(.6) brightness(.6);animation:none}"
  +"@keyframes scsheen{from{background-position:0% 0%}to{background-position:220% 220%}}"
  +".sc-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;animation:scin .38s cubic-bezier(.2,1.3,.4,1)}@keyframes scin{from{transform:scale(.5);opacity:0}to{transform:none;opacity:1}}"
  +".sc-ic{width:74%;height:74%;object-fit:contain;user-select:none;pointer-events:none}.sc-ic.sc-m{width:86%;height:86%;border-radius:22%}.sc-ic.sc-g{filter:sepia(1) saturate(3.2) hue-rotate(-12deg) brightness(1.15);box-shadow:0 0 0 2px #ffd76a,0 0 18px rgba(255,215,106,.8)}.sc-glow-g{filter:drop-shadow(0 0 8px rgba(255,215,106,.7))}.sc-gl{display:block;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}.sc-gl.sc-c{background:#19f3ff}.sc-gl.sc-o{background:#ff5a28}.sc-glow-c{filter:drop-shadow(0 0 7px rgba(0,255,255,.8))}.sc-glow-o{filter:drop-shadow(0 0 7px rgba(255,90,40,.85))}"
  +".sc-cell.rest .sc-face{opacity:.28;filter:grayscale(.5);animation:none}.sc-cell.win{border-color:#ffc857;box-shadow:0 0 0 2px rgba(255,200,87,.5),0 0 22px rgba(255,200,87,.45);animation:scwin 1.1s ease-in-out infinite alternate}@keyframes scwin{to{box-shadow:0 0 0 2px rgba(255,200,87,.9),0 0 30px rgba(255,200,87,.75)}}"
  +".sc-v{position:absolute;right:6px;bottom:4px;font:700 .7em/1 var(--font-mono,monospace);color:#ffc857;font-style:normal}"
  +".sc-dust{position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,#c9cddd,#8f96ad);animation:scwipe .42s ease-out forwards}@keyframes scwipe{0%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}100%{clip-path:polygon(100% 0,100% 0,100% 100%,100% 100%);opacity:.2}}"
  +".sc-foot{margin:12px 4px 2px;display:grid;gap:5px;text-align:center}.sc-foot b{color:#fff}.sc-foot span{font-size:.82em;color:rgba(255,255,255,.55)}.sc-card.won .sc-foot b{color:#ffc857}"
  +".sc-prog{display:block;height:6px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden}.sc-prog i{display:block;height:100%;background:linear-gradient(90deg,#00ffff,#ff5a28)}"
  +".sc-legs{display:grid;gap:6px;max-width:340px;margin:0 auto}.sc-leg b{filter:none;text-shadow:none}.sc-leg{display:flex;align-items:center;gap:4px;padding:6px 10px;border:1px solid var(--line);border-radius:12px}.sc-leg .sc-ic{width:26px;height:26px;flex:none}.sc-leg .sc-ic.sc-m{width:26px;height:26px;border-radius:7px}.sc-leg b{margin-left:auto;font-size:.86em}"
  +".zx-sc.wait b{opacity:.7}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV146={state:scState,ready:scReady,roll:scRoll,scratch:scScratch,tasks:scTasks,rnd:function(f){SCRND=f||Math.random},odds:SCODDS,prize:SCPRIZE,val:SCVAL,floor:function(id){var it=SHOP.filter(function(x){return x[0]===id})[0];return it?brandFloor((it[6]||{}).b):""},left:function(fl){return SHOP.filter(function(it){var e=it[6]||{};return /^a_/.test(it[1])&&e.b&&brandFloor(e.b)===fl&&!S.owned[it[0]]&&itemFits(it)&&(typeof isRigItem!=="function"||isRigItem(it))}).length}};
