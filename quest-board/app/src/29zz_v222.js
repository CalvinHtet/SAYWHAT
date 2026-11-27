/* ---------- QA 2026-11-27 (b5975d05 NOTE 2): the try-on card's "Checkout (n)" was squeezed narrower than its words at 390 px and cut
   on both sides ("HECKOUT (1"). The button keeps its full width; the row wraps "Take off" under it if it has to. ---------- */
htabCss("qb-v222-css",".qs-bask{flex-wrap:wrap!important;row-gap:6px}.qs-bask .qs-btn[data-act=qscheck]{flex:0 0 auto!important;min-width:max-content!important}");
