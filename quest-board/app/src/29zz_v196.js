/* ---------- Cal 2026-11-26: the town board's photos in pages of six ----------
   Cal: "Make the posted photos in the town hall from everyone only 2 rows of 3. Older photos should be cascaded into the next page. Add
   left and right arrows in this section to change pages to the left and right. Add a sliding animation that goes left and right to
   review the next page of 6 photos. Make sure you can't wrap around so if you are on page 1, the left arrow is greyed out."
   The feed (29ph_photos.js, the 30 newest) is cut into pages of 6, newest first; the arrows slide the row of pages left or right
   (0.35 s), "1 / 5" between them; on the first page the left arrow is greyed out and on the last the right one, no wrapping. The page
   stays put when the feed refreshes (every 30 s, or a new like or comment). */
var V96N=6,V96P=0;
function v96Pages(){return Math.max(1,Math.ceil(((PH&&PH.posts)||[]).length/V96N))}
function v96Nav(){var n=v96Pages();if(V96P>n-1)V96P=n-1;if(V96P<0)V96P=0;
  return '<div class="v96nav"><button type="button" class="v96a" data-v96="-1" aria-label="Newer photos"'+(V96P<=0?' disabled':'')+'>&#8249;</button><span class="v96n" aria-live="polite">'+(V96P+1)+' / '+n+'</span><button type="button" class="v96a" data-v96="1" aria-label="Older photos"'+(V96P>=n-1?' disabled':'')+'>&#8250;</button></div>'}
var v96Inner=phInner;phInner=function(){var h=v96Inner.apply(this,arguments);
  try{var P=(PH&&PH.posts)||[];if(!P.length)return h;var i=h.indexOf('<div class="ph-grid">');if(i<0)return h;var j=h.lastIndexOf("</div>")+6;
    var pages=[];for(var k=0;k<P.length;k+=V96N)pages.push('<div class="ph-grid v96pg">'+P.slice(k,k+V96N).map(phCard).join("")+'</div>');
    var n=pages.length;if(V96P>n-1)V96P=n-1;
    h=h.slice(0,i)+'<div class="v96pager"><div class="v96track" style="transform:translateX('+(-V96P*100)+'%)">'+pages.join("")+'</div></div>'+(n>1?v96Nav():'')+h.slice(j)}catch(e){}
  return h};
function v96Go(d){var tr=document.querySelector("#phfeed .v96track");if(!tr)return;var n=v96Pages(),p=Math.max(0,Math.min(n-1,V96P+d));if(p===V96P)return;V96P=p;
  tr.classList.add("v96slide");tr.style.transform="translateX("+(-p*100)+"%)";setTimeout(function(){tr.classList.remove("v96slide")},400);
  var nav=document.querySelector("#phfeed .v96nav");if(nav)nav.outerHTML=v96Nav()}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v96]");if(!b)return;e.preventDefault();e.stopPropagation();if(b.disabled)return;v96Go(+b.getAttribute("data-v96"))},true);
htabCss("qb-v196-css","#phfeed .v96pager{overflow:hidden;margin-top:10px;border-radius:12px}#phfeed .v96track{display:flex;will-change:transform}#phfeed .v96track.v96slide{transition:transform .35s cubic-bezier(.22,.8,.3,1)}"
  +"#phfeed .v96pg{flex:0 0 100%;min-width:0;margin-top:0!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-content:start;box-sizing:border-box}"
  +"#phfeed .v96nav{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:10px}#phfeed .v96n{font:600 13px/1 var(--font-mono,ui-monospace,monospace);color:var(--muted,#9aa0b6);min-width:48px;text-align:center}"
  +"#phfeed .v96a{width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#2a2f45);background:var(--surface,#151826);color:var(--fg,#fff);font:700 26px/1 system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0 0 3px}"
  +"#phfeed .v96a:disabled{opacity:.28;cursor:default}@media (prefers-reduced-motion:reduce){#phfeed .v96track.v96slide{transition:none}}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV196={page:function(){return V96P},go:v96Go,pages:v96Pages,html:function(){return phInner()}};
