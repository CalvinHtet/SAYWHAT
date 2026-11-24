/* ---------- Cal's 2026-11-24 list, batch 3 odds and ends ---------- */

/* ---- a window that opens while the save syncs can be closed (QA 11-24, on the v1.45 tabs-while-syncing change: "a window that opens
   during the fast start (a milestone from the device copy) can't be closed until it lands"). Closing changes nothing in the save. ---- */
htabCss("qb-syncclose-css","html.qb-sync body .mx,html.qb-sync body [data-act=\"mclose\"],html.qb-sync body [data-act=\"mclose\"] *{pointer-events:auto!important}");
