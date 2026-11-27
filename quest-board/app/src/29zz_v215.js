/* ---------- Cal 2026-11-26: two crawls a day for each teammate; the Vault's own background ----------
   Cal: "Instead of being able to do 5 max crawls per day, each person who joins your team can do 2 crawls per day. So that when you
   have 2 team members, you can do 4 crawls per day", and "create a background picture for the vault that looks like a futuristic
   thrift store. Create a full background picture that remains in the background when you scroll down".
   - The day's crawls are 2 for each teammate (story teammates and rescued allies alike), and each one goes at most twice a day: a
     teammate with two crawls today is left out of Who goes? ("Done for today" on their face is not needed: they are just not offered).
     Someone hurt still counts toward the day's total (they joined), but cannot go.
   - The Vault page sits on ROOMS's painting (ui_vault_bg.webp) held still behind the page while it scrolls, darkened so the cards read;
     without the file the page looks as before. */
var V215PER=2;
function v215Day(){var D=dngInit(),t=today();if(D.cd.d!==t)D.cd={d:t,n:0};if(!D.cd.who||typeof D.cd.who!=="object")D.cd.who={};return D.cd}
function v215Used(k){return v215Day().who[k]||0}
dngPerDay=function(){var n=0;try{n=v210Team().length}catch(e){}return V215PER*Math.max(1,n)};
var v215Free=v210Free;v210Free=function(){return v215Free.apply(this,arguments).filter(function(k){return v215Used(k)<V215PER})};
var v215Start=dngStart;dngStart=function(id){var D=dngInit(),n0=D.runs.length,r=v215Start.apply(this,arguments);
  try{if(D.runs.length>n0){var who=D.runs[D.runs.length-1].who;if(who){var c=v215Day();c.who[who]=(c.who[who]||0)+1;persist()}}}catch(e){}return r};
/* nobody left to send today (all out, resting, or done twice) reads plainly on the cards */
var v215Html=dngHtml;dngHtml=function(){var h=v215Html.apply(this,arguments);
  try{var c=v215Day();if(c.n<dngPerDay()&&!v210Free().length&&v210Team().length){var o=v210Out(),busy=v210Team().some(function(k){return o[k]});
      if(!busy)h=h.replace(/<button class="btn alt" data-act="dgo"[^>]*>Crawl<\/button>/g,'<small class="note">Everyone has crawled today.</small>')}}catch(e){}
  return h};
/* ---- the Vault's background ---- */
function v215Bg(){try{return (window.QBART&&QBART["ui_vault_bg.webp"])||""}catch(e){return ""}}
var v215Shop=shopHtml;shopHtml=function(){var h=v215Shop.apply(this,arguments);
  try{var u=v215Bg();if(u&&h.indexOf('class="qshop shub-in shub-vault v201v"')>=0)h=h.replace('class="qshop shub-in shub-vault v201v"','class="qshop shub-in shub-vault v201v v215bg" style="--v215bg:url(\''+esc(u)+'\')"')}catch(e){}return h};
htabCss("qb-v215-css",".v215bg{position:relative;isolation:isolate}.v215bg::before{content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;"
  +"background:linear-gradient(rgba(8,8,14,.55),rgba(8,8,14,.72)),var(--v215bg) center/cover no-repeat}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV215={used:v215Used,day:v215Day,bg:v215Bg};
