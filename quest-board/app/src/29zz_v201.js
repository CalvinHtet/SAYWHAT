/* ---------- Cal 2026-11-26: the week's Shop calendar, three a category, and a Sunday Vault ----------
   Cal: "There's only 2 hat items for smokebomb. Make sure they all have 3 items for this weeks drops. Change the clothing brand drops to
   Monday, Wednesday, and Friday. I want Sunday to be the vault which lasts for 1 week which has 3 random pieces for every category from
   every brand. But never more than 4 premium brands in here and never two premium brand items in one category. Tues and Thursday and
   Saturday will be the pet shop brand drops".
   - Brand drops: Monday, Wednesday and Friday at 6 am (the one rotation of 29zz_v172.js, from its first day, Mon 11-30); 3 brands live,
     the oldest leaves, every third drop a pricier brand, so a brand is in the Shop for a week.
   - A brand's drop shows 3 pieces a category (hats, head, necklaces, gloves, tops, bottoms, shoes; the Shop shows head, necklaces and
     gloves together under Accessories for now). The next time the brand drops it shows the next 3 of each, so with 6 a category the two
     drops are the brand's two halves. A category with 3 or fewer shows them all.
   - The Vault: every Sunday at 6 am, for the week. 3 pieces a category from every brand on the rotation (held brands wait), picked at
     random with the week as the seed (the same on every phone): at most 4 pricier brands in the whole Vault, and never two pricier
     pieces in one category. It has its own door on the Shop's home screen. The old one-day Wednesday Vault is gone.
   - Pet clothes: Tuesdays, Thursdays and Saturdays at 6 am from Sat 11-28 (no drop that has happened moves). */
/* Cal 11-26 (later): "Change the brand drops to 6 am on all the days instead of 8 am": every drop (brands, the Vault, pet clothes, the sale)
   turns over at 6 am Pacific (DROPHOUR, 29l_drops.js). */
try{DROPHOUR=6;dropCadence=function(){return "Mondays, Wednesdays and Fridays at 6 am Pacific"}}catch(e){}
var V201={sun:0,perCat:4,dropCat:4,premMax:4,petFrom:"2026-11-28",petDays:[2,4,6]};
/* ---- the calendar ---- */
try{V72.days=[1,3,5];V72C=null}catch(e){}
try{QS_WHEN.street="New brands Mon, Wed and Fri 6 am";var F0=flGet("street");if(F0)F0.line="New brands Mondays, Wednesdays and Fridays, 6 am"}catch(e){}
pzSlotNow=function(){var n=dropNow(),k=0,cut=ymdN("2026-11-28");for(var i=0;i<4000;i++){var ymd=ymdAdd(PZ_DAY0,i),x=ymdN(ymd),wd=new Date(x*864e5).getUTCDay();
    if(x<cut?(wd!==1&&wd!==4):V201.petDays.indexOf(wd)<0)continue;if(dropStart(ymd)>n)break;k++}return Math.max(0,k-1)};
var v201Pet=p2ClothesBase;p2ClothesBase=function(){var h=v201Pet.apply(this,arguments);return h.replace("New pieces Tuesdays and Fridays at 8 am.","New pieces Tuesdays, Thursdays and Saturdays at 6 am.")};
/* the Wednesday returning brand is gone */
dropBack=function(){return null};
/* ---- seven categories ---- */
function v201Cat(it){var s=it[1];if(s==="a_hat")return "hat";if(s==="a_top")return "top";if(s==="a_pants")return "bottom";if(s==="a_shoes")return "shoes";
  if(s!=="a_acc")return null;var g=(it[6]&&it[6].gar)||"",sl="";try{sl=((window.QBDATA&&QBDATA.items&&QBDATA.items[g])||{}).slot||""}catch(e){}
  return /^(glasses|mask|face|eyes|head)/.test(sl)?"head":/^neck/.test(sl)?"neck":/^(arms|hands|gloves|wrist)/.test(sl)?"gloves":"acc"}
/* QA 11-28: a row may be cut on a date (cut:"YYYY-MM-DD"): drops and Vault weeks that started before it keep it in their pool, so a
   retirement never reshuffles a running Vault or drop; from that day it is out (and off sale everywhere, as any cut) */
function v201Cut(m,day){if(m.cutOn){if(!day)try{day=dropYmd(dropNow())}catch(e){}return !(day&&day<m.cutOn)}return !!(m.cut&&!(typeof m.cut==="string"&&day&&day<m.cut))}
function v201Sellable(it,day){var m=it&&it[6];return !!(m&&m.b&&m.b!=="basics"&&!v201Cut(m,day)&&!m.basic&&/^a_(hat|acc|top|pants|shoes)$/.test(it[1])&&(typeof isRigItem!=="function"||isRigItem(it)))}
function v201R(seed){var h=2166136261;for(var i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return function(){h^=h<<13;h>>>=0;h^=h>>>17;h^=h<<5;h>>>=0;return h/4294967296}}
function v201Shuf(a,seed){var r=v201R(seed),b=a.slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=b[i];b[i]=b[j];b[j]=t}return b}
/* ---- a brand's drop: 4 a category, the other 4 the next time (Cal 11-26: "I actually like how symmetrical it looks with 4 items in each
   category ... 8 pieces for each category. And each time the brand drops again, it will be the other 4"); the Vault 4 too (Cal 11-26 via APPROVALS: "And yes to 4 per vault") ---- */
/* QA 9b80a82b LOW: a visit from before the rotation began (live when it started, or already gone) counts too, so the next visit shows
   the other half */
function v201Times(id,start){try{var n=0;try{var k=v72Slot(dropStart(start));if(k>=0)v72Run(k)}catch(x){}if(!V72C)try{dropState()}catch(x){}if(!V72C)return 0;V72C.snap.forEach(function(q){if(q.pick===id&&q.day<start)n++});
    if((V72C.live0||[]).some(function(b){return b.id===id&&b.start<start}))n++;else if(V72C.left0&&V72C.left0[id]&&V72C.left0[id]<start)n++;return n}catch(e){return 0}}
var V201HALF={};
/* QA b5975d05: a row with {from:"YYYY-MM-DD"} joins only drops and Vault weeks that start on or after that day, so adding pieces never
   changes a drop or a Vault week that is already running (or one already past) */
function v201Half(b){var key=b.id+"|"+(b.start||""),c=V201HALF[key];if(c)return c;var times=v201Times(b.id,b.start||""),keep={},by={};
  SHOP.forEach(function(it){if(!v201Sellable(it,b.start||"")||it[6].b!==b.id||(it[6].from&&(b.start||"")<it[6].from))return;var c=v201Cat(it);(by[c]=by[c]||[]).push(it[0])});
  Object.keys(by).forEach(function(c){var L=v201Shuf(by[c].sort(),"v201|"+b.id+"|"+c);var P=V201.dropCat||V201.perCat;if(L.length<=P){L.forEach(function(id){keep[id]=1});return}
    var st=(times*P)%L.length;for(var i=0;i<P;i++)keep[L[(st+i)%L.length]]=1});
  V201HALF[key]=keep;return keep}
/* ---- the Vault ---- */
function v201Sun(n){var t=dropYmd(n),x=ymdN(t);while(ymdWd(x)!==V201.sun)x--;var s=ymdOfN(x);if(dropStart(s)>n){x-=7;s=ymdOfN(x)}return s}
var V201VC={};
function v201VaultW(n){var wk=v201Sun(n==null?dropNow():n);if(V201VC[wk])return V201VC[wk];
  var prem=function(id){return brandFloor(id)!=="street"},on=BRANDS.map(function(b){return b.id}).filter(function(id){return !zxHeld(id,wk)});
  var P=v201Shuf(on.filter(prem).sort(),"v201v|"+wk+"|prem").slice(0,V201.premMax),okB={};on.forEach(function(id){if(!prem(id)||P.indexOf(id)>=0)okB[id]=1});
  var by={};SHOP.forEach(function(it){if(!v201Sellable(it,wk)||!okB[it[6].b]||(it[6].from&&wk<it[6].from))return;var c=v201Cat(it);if(c==="acc")return;(by[c]=by[c]||[]).push(it)});
  var keep={},list=[];["hat","head","neck","gloves","top","bottom","shoes"].forEach(function(c){var L=v201Shuf((by[c]||[]).sort(function(a,b){return a[0]<b[0]?-1:1}),"v201v|"+wk+"|"+c),got=[],pr=0,br={};
    /* first pass: different brands; then any brand; never a second pricier piece */
    [true,false].forEach(function(spread){L.forEach(function(it){if(got.length>=V201.perCat||got.indexOf(it)>=0)return;var b=it[6].b,p=prem(b);if(p&&pr>=1)return;if(spread&&br[b])return;got.push(it);br[b]=1;if(p)pr++})});
    got.forEach(function(it){keep[it[0]]=1;list.push([c,it[0],it[6].b])})});
  return V201VC[wk]={wk:wk,until:ymdAdd(wk,7),keep:keep,list:list,prem:P}}
/* QA 11-27: a brand held mid-week (SØLVBERG, Cal 11-27) leaves the Vault that day, and only its pieces go: the week's draw stays
   as it was (drawn with the holds as of the week's Sunday), so nothing else in a running Vault changes */
function v201Vault(n){var V=v201VaultW(n),hd=dropYmd(n==null?dropNow():n),out={};
  /* only a brand held on purpose (DROPS.hold) leaves mid-week; a brand going out of season (29zz_v211.js) stays until the week ends */
  var held=typeof v211Held==="function"?v211Held:zxHeld,list=V.list.filter(function(q){return !held(q[2],hd)});if(list.length===V.list.length)return V;
  list.forEach(function(q){out[q[1]]=1});return Object.assign({},V,{list:list,keep:out})}
/* the Shop's racks: a live brand shows its half; the Vault its own */
var V201ON=0;
var v201Groups=qsGroups;qsGroups=function(pick){var a=arguments;
  if(V201ON){var V=v201Vault();return v201Groups.call(this,function(x){return !!V.keep[x[0]]})}
  try{var d=dropState(),live=(d&&d.live)||[],H={};live.forEach(function(b){H[b.id]=v201Half(b)});
    return v201Groups.call(this,function(x){if(!pick(x))return false;var m=x[6]||{},h=H[m.b];/* QA 11-28: a dated-cut row in a brand room only if this drop drew it, or it is owned */if(h&&m.cutOn)return !!h[x[0]]||!!(S.owned&&S.owned[x[0]]);if(!h||!v201Sellable(x))return true;return !!h[x[0]]||!!(S.owned&&S.owned[x[0]])})}catch(e){return v201Groups.apply(this,a)}};
/* the Vault's door and page (29zz_v149.js's home screen opens shopTab = the door's id) */
var V201ID="v201vault";
shubVault=function(){return {id:V201ID,name:"The Vault",fl:"street",vault7:1}};
var v201Shop=shopHtml;shopHtml=function(){if(shopTab===V201ID&&SHUB!=="vault"){shopTab="";window._qsSeen=0}
  /* Cal 11-26 (major): "When I'm in the vault, I can't go back to the shop": "< Shop" set SHUB home but shopTab stayed the Vault's */
  if(shopTab!==V201ID){V201ON=0;return v201Shop.apply(this,arguments)}
  var V=v201Vault(),n=dropNow(),left=dropStart(V.until)-n;V201ON=1;
  try{var h='<div class="qshop shub-in shub-vault v201v"><div class="qs-bar shub-bar"><button class="qs-tab shub-back" data-shub="home">&lsaquo; Shop</button><b class="shub-title">The Vault</b></div>'
      +'<p class="qs-note qs-lead">Four pieces a category from every brand. New every Sunday at 6 am; this one leaves in '+esc(cdTxt(left))+'.</p>'
      +'<div class="qs-fit">'+qsMirror()+'<div class="qs-rack">'+qsGroups(function(){return true})+'</div></div></div>';
    return h}finally{V201ON=0}};
/* the home screen's tile wording */
var v201Hub=typeof shubHome==="function"?shubHome:null;
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('[data-shub="vault"]');if(!b)return;try{SHUB="vault";shopTab=V201ID;window._qsSeen=1}catch(x){}},true);
var v201R2=render;render=function(){var r=v201R2.apply(this,arguments);
  try{var t=document.querySelector('[data-shub="vault"]');if(t){var s=t.querySelector("small");if(s&&!/All week: 4/.test(s.textContent))s.textContent="All week: 4 a category from every brand"}}catch(e){}return r};
htabCss("qb-v201-css",".qshop.v201v .qs-lead{margin:4px 0 10px}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV201={vault:function(n){return v201Vault(n)},half:function(b){return v201Half(b)},cat:function(id){var it=SHOP.filter(function(x){return x[0]===id})[0];return it?v201Cat(it):null},sun:v201Sun,cfg:V201,reset:function(){V201VC={};V201HALF={}}};
