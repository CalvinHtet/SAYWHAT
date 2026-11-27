/* ---------- QA 11-26: a try-on draws one picture, not a loop ----------
   QA (tryon197qa.js, 4x throttled): each piece tried on in the Shop was a new look, so the mirror's breathing loop (12 frames, 240x273)
   was drawn and encoded again: 430-620 ms of work on the page per try-on (v1.73 had 169 ms). The mirror now shows the character still
   (one frame), as the player cards do (Cal 11-26: the card's character is not animated). */
var v202Mirror=qsMirror;qsMirror=function(){var h=v202Mirror.apply(this,arguments);try{h=h.replace(/(<img [^>]*?class="calp[^>]*?)data-pose="idle"/,'$1data-pose="still"')}catch(e){}return h};
if(!(window.QB_WEB&&QB_WEB.noTest))window.__qbV202={html:function(){return qsMirror()}};
