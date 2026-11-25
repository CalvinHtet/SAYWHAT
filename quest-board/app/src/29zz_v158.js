/* ---------- Cal 2026-11-25: syncing never stops you looking around ----------
   Cal: "When the game was syncing, I could not press the player banner on the top left to edit and see my banner. I want the syncing
   status on the top right to be completely in the background and never prevent the user from navigating the app"
   While the online save is on its way, the screen is the copy on this device and taps are off (29zx_simple.js: html.qb-sync body *
   {pointer-events:none}), because a change made then is not saved and is replaced when the save lands. v1.43 let the tabs through
   and v1.47 the close buttons. This lets through everything that only looks: the player card and the profile, the mailbox and its
   letters, the (i) sheets, the scratch card's button, the Shop's doors, tabs and floors, the Closet, the Stylist's tabs, trying a
   piece or a backdrop on (nothing is bought), another player's card, a photo, and scrolling inside any window. What changes the save
   (ticking a task, buying, claiming, collecting, typing) still waits, and now says so instead of doing nothing. */
(function(){var A=['.avbtn','[data-act="pcard"]','[data-act="char"]','[data-act="qbinfo"]','.ibbtn','.ibrow','.scbtn','[data-act="pcbgs"]','[data-act="wardrobe"]','[data-shub]','.shub-char','[data-act="stab"]','[data-qsfl]','[data-act="stytab"]','[data-wdf]',
    '[data-act="qstry"]','[data-act="qsclear"]','[data-act="pctry"]','[data-act="fshview"]','[data-act="phopen"]','[data-act="sxtab"]'],css=[];
  A.forEach(function(s){css.push("html.qb-sync body "+s,"html.qb-sync body "+s+" *")});
  htabCss("qb-synclook-css",css.join(",")+"{pointer-events:auto!important}"
    /* a window scrolls under the finger (its buttons that change things stay off) */
    +"html.qb-sync body #layer .modal,html.qb-sync body #layer .modal>.card{pointer-events:auto!important}");
  /* a tap on something that has to wait says why (rate-limited); a tap on empty space says nothing */
  var last=0;document.addEventListener("click",function(e){try{if(!document.documentElement.classList.contains("qb-sync"))return;var t=e.target;
      if(t&&t.closest&&t.closest(A.join(",")+',.nav,[data-act="nav"],.htab,.mx,[data-act="mclose"]'))return;var x=e.clientX,y=e.clientY;if(!(x||y))return;
      var L=document.querySelectorAll("button,[data-act],input,textarea,select,label,[role=button]"),hit=0;
      for(var i=0;i<L.length&&!hit;i++){var el=L[i];if(el.matches(A.join(","))||el.closest(".nav"))continue;var r=el.getBoundingClientRect();if(r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)hit=1}
      if(hit&&Date.now()-last>3500){last=Date.now();pop("Still syncing your save. That will work in a moment.")}}catch(x2){}},true)})();
