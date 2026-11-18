/* ---------- v1.15: Training back in the tab bar (Cal, 2026-11-17) ----------
   Cal: "the training tab just completely disappeared" ... "I want the training tab to still be on the bottom as a new tab". Since the
   five tabs (2026-11-13) Training opened from a tile on the Board. Now it is a tab again, after the Board: Board, Training, The Loft,
   Shop, Town, Players. Its Board tile goes (the tab replaces it); Dungeon Crawls keeps its tile. As before, a new player's first three
   days (the calm week) do not show it yet. */
delete NAVHIDE.train;
(function(){for(var i=ZXHUB.length-1;i>=0;i--)if(ZXHUB[i][0]==="train")ZXHUB.splice(i,1)})();
var v15Nav=navHtml;navHtml=function(){var h=v15Nav.apply(this,arguments);
  try{if(typeof calmOn==="function"&&calmOn()&&calmDay()<4)h=h.replace(/<button data-act="nav" data-v="train"[^>]*>[\s\S]*?<\/button>/,"")}catch(e){}
  return h};
/* the Training tour rings the tab now */
TOURS.forEach(function(T){if(T.id!=="train")return;T.ready=function(){return view==="board"&&!!tourVis('.nav button[data-v="train"]')};
  if(T.steps[0])T.steps[0].sel='.nav button[data-v="train"]'});
