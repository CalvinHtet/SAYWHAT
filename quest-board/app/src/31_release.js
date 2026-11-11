/* Before release (CLAUDE.md; Cal, 2026-11-08: "Yes, strip them"). This file comes last. A Live build (web/config.js noTest) keeps no test
   hooks: they are deleted here, the Test pill and the "Testing:" rows are never made (29_prices.js, 15_shop.js, 30_app_b.js). Main, the
   sandbox and every test script have no noTest, so they keep it all, and ROOMS's and QA's scripts run as before.
   w-ui92: qbDbg, __qbTeam, __qbAlerts and __qbShift are not made on a Live build at all (the game reads teamList and TEAM directly, and
   the clock its own QBSHIFT, 00_clock.js); they are on the list too, in case one turns up.
   NOT on this list because the game needs them: __qbGuest, __qbBootErr,
   __qbLoad and __qbWeb. A new test hook goes on this list. rigtest/lead/striptest.js checks a Live build. */
(function(){if(!(window.QB_WEB&&QB_WEB.noTest))return;
  ["__qb","__qbLoft","__qbRooms","__qbStory","__qbFriends","__qbDrops","__qbDungeon","__qbEcon","__qbBounty","__qbTown","__qbUnlock","__qbPlaza","__qbLive","__qbFreedReq","__qbKudos","__qbDuel","qbDbg","__qbTeam","__qbAlerts","__qbShift","__qbPhotos"].forEach(function(k){try{delete window[k]}catch(e){}})})();
