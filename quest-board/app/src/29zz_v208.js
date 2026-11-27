/* ---------- Cal 2026-11-26: the weight box shows the whole number ----------
   Cal: "Make the text box for entering the weight wider. My 37.5 is getting cut off". The box sized itself to the number, but in the
   guided set row (beside Set 1, 2, 3) the row squeezed it narrower than that on a phone, so "37.5" scrolled to "7.5". The box now never
   shrinks below its own width and has room for a digit more ("137.5"). */
kgW=function(v){return Math.max(5,String(v==null?"":v).length)+1.5+"ch"};
htabCss("qb-v208-css",".kgw{flex:none}.kgw input{flex:none;min-width:5.5ch;max-width:9ch}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV208={w:function(v){return kgW(v)}};
/* Cal 11-26: "The scroll bar is still present in the guided workout exercise page when you can't even scroll up or down. Fix this and
   only show the scroll bar for pages that can scroll". The guided screen covers the page, but the page under it still scrolled (a swipe
   reached it), so the page's scroll bar showed. While the guided screen is open the page under it is held still, and a swipe stays in
   the guided screen, which scrolls (and shows a bar) only when its own content is taller than the screen. */
htabCss("qb-v208b-css","html:has(.coachscr),body:has(.coachscr){overflow:hidden!important;overscroll-behavior:none}.coachscr{overscroll-behavior:contain;scrollbar-width:thin}");
(function(){var on=0;setInterval(function(){try{var c=!!document.querySelector(".coachscr");if(c!==!!on){on=c?1:0;document.documentElement.classList.toggle("v208lock",c)}}catch(e){}},300)})();
htabCss("qb-v208c-css","html.v208lock,html.v208lock body{overflow:hidden!important}");
