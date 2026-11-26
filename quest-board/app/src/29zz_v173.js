/* ---------- Cal 2026-11-25: banners from level 25 come out five at a time, picked at random ----------
   Cal: "i want you to shuffle a random 5 to release for each 5 levels instead of sequentially releasing 5. Keep me surprised."
   The tiers already out (levels 10, 15 and 20) stay as they are. A data/banners.json row whose level is "r" (ROOMS's rows from the
   psychedelic and the intricate sets on) goes into one pool; each player's pool is shuffled once with their own seed (S.bseed, made
   the first time and kept in the save), and the first five open at level 25, the next five at 30, and so on. So each player meets a
   different five at each tier, and nobody, Cal included, knows which. A tier still is not listed until its level (29zz_v152.js). */
var V73FROM=25;
function v73Pool(){try{return (window.QBDATA&&QBDATA.banners||[]).filter(function(r){return r&&r[2]==="r"&&/^[a-z0-9_]+$/.test(r[0])}).map(function(r){return r[0]})}catch(e){return []}}
function v73Seed(){try{if(!S.bseed){S.bseed=Math.random().toString(36).slice(2,10);persist()}return S.bseed}catch(e){return "x"}}
var V73K="";
function v73Plan(seed,pool){var ord=dropShuffle(pool.slice().sort(),"v173|"+seed),lv={};ord.forEach(function(id,i){lv[id]=V73FROM+5*Math.floor(i/5)});return lv}
function v73Assign(){try{if(typeof PCBG==="undefined"||!S||!S.created)return;var pool=v73Pool();if(!pool.length)return;var seed=v73Seed(),k=seed+"|"+pool.join(",");if(k===V73K)return;V73K=k;
    /* QA v1.65: a new "r" row must not reshuffle tiers a player already has: assignments are kept in S.bfix; new rows fill the first
       tiers with room (fewer than five), shuffled among themselves with the same seed */
    if(!S.bfix||typeof S.bfix!=="object")S.bfix={};var fx=S.bfix,fresh=pool.filter(function(id){return fx[id]==null});
    if(fresh.length){var cnt={};Object.keys(fx).forEach(function(id){cnt[fx[id]]=(cnt[fx[id]]||0)+1});var ord=dropShuffle(fresh.slice().sort(),"v173|"+seed+"|"+Object.keys(fx).length),L=V73FROM;
      ord.forEach(function(id){while((cnt[L]||0)>=5)L+=5;fx[id]=L;cnt[L]=(cnt[L]||0)+1});try{persist()}catch(e){}}
    var lv=fx;
    PCBG.forEach(function(b){if(lv[b[0]]!=null)b[3]=lv[b[0]]})}catch(e){}}
/* rows marked "r" read as level 0 in PCBG (+"r"||0): hidden until assigned */
(function(){try{var P={};v73Pool().forEach(function(id){P[id]=1});PCBG.forEach(function(b){if(P[b[0]])b[3]=999})}catch(e){}})();
var v73Render=render;render=function(){v73Assign();return v73Render.apply(this,arguments)};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV173={plan:v73Plan,assign:function(){V73K="";v73Assign()},pool:v73Pool,levels:function(){var o={};PCBG.forEach(function(b){o[b[0]]=b[3]});return o}};
