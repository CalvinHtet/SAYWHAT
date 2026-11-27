/* ---------- Cal 2026-11-26: player cards in the Town Hall ----------
   Cal: "The posted profile banner in the town hall chat is too large. Make it a bit smaller. The profile card banner character should
   not be animated. Only the banner animation vid, and any animated cosmetics such as glowing aura or something like that. Make sure this
   animation is playing and is visible in the town hall chat." and "Make sure clicking on a character in the town hall to see their
   profile also shows their profile banner".
   - A card posted on the Town board is 230 px wide at most (was 300).
   - The header's card shows the character still (it breathed, idle); the cards were already still. Sharp, as the other cards.
   - The banner's 8 s loop (29zz_v177.js) and the worn effects (halo, ring, storm) run on posted cards, on another player's window and
     on the Town Hall square's card too, not only on your own cards.
   - Tapping a character on the Town Hall square opens their card, banner and all, in place of the bare figure. */
pcPostW=function(){var w=230;try{w=Math.max(170,Math.min(230,window.innerWidth-90))}catch(e){}return w};
/* the header's character: still and sharp */
var v97Av=v55Av;v55Av=function(){var h=v97Av.apply(this,arguments);
  try{var H=window.innerWidth<350?78:88,k=1;try{k=Math.max(1,Math.min(3,Math.round(H*(window.devicePixelRatio||1)/QBLoft.data.loft.standPx*2)/2))}catch(e){}
    h=h.replace(/(<img [^>]*?class="calp[^>]*?)data-pose="idle"/,'$1data-pose="still"').replace(/<img ([^>]*?class="calp)/,'<img data-hi="'+k+'" $1');
    /* the kept launch picture (29zz_v185.js) is keyed by the pose: look it up again for "still" */
    var c=typeof v85Get==="function"?v85Get():null,m=/data-pose="([^"]*)" data-h="([^"]*)" data-look="([^"]*)"/.exec(h);
    if(c&&c.d&&m&&/src="data:image\/gif;base64,[^"]*"/.test(h)){var d=document.createElement("textarea");d.innerHTML=m[3];if(d.value+"|"+m[2]+"|"+m[1]===c.k)h=h.replace(/src="data:image\/gif;base64,[^"]*"/,'src="'+c.d+'" data-v85="1"')}}catch(e){}return h};
/* the loops and effects on every card people look at in the Town Hall */
try{V77SEL+=",.pc-post .pcard,#layer .fsh-big .pcard,#layer .sq-card .pcard"}catch(e){}
/* the square's card: their banner */
var V97SQ=null,v97Img=calImg;calImg=function(L,pose,H,cls){if(V97SQ&&pose==="idle"&&H===200){var p=V97SQ;V97SQ=null;try{return '<span class="pc-wrap v97sq">'+pcHtml(p,200)+'</span>'}catch(e){}}return v97Img.apply(this,arguments)};
var v97Sq=sqCard;sqCard=function(uid){try{var w=(SOC.worlds||[]).filter(function(x){return x.id===uid})[0],f=typeof fshFind==="function"?fshFind(uid):null;
    if(w&&w.look)V97SQ=f?Object.assign({},f,{look:f.look||w.look,name:f.name||w.name,lv:f.lv||w.lv}):{id:uid,name:w.name,look:w.look,lv:w.lv||1,card:w.card||{}}}catch(e){V97SQ=null}
  try{return v97Sq.apply(this,arguments)}finally{V97SQ=null}};
htabCss("qb-v197-css",".pc-post .pcard{max-width:100%}#layer .sq-card .sq-big{display:flex;justify-content:center}#layer .sq-card .v97sq{display:block;width:min(260px,100%)}#layer .sq-card .v97sq .pcard{width:100%}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV197={w:function(){return pcPostW()}};
