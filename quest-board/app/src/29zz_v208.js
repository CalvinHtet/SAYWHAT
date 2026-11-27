/* ---------- Cal 2026-11-26: the weight box shows the whole number ----------
   Cal: "Make the text box for entering the weight wider. My 37.5 is getting cut off". The box sized itself to the number, but in the
   guided set row (beside Set 1, 2, 3) the row squeezed it narrower than that on a phone, so "37.5" scrolled to "7.5". The box now never
   shrinks below its own width and has room for a digit more ("137.5"). */
kgW=function(v){return Math.max(5,String(v==null?"":v).length)+1.5+"ch"};
htabCss("qb-v208-css",".kgw{flex:none}.kgw input{flex:none;min-width:5.5ch;max-width:9ch}");
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV208={w:function(v){return kgW(v)}};
