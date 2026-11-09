/* Before release (CLAUDE.md; Cal, 2026-11-08: "Yes, strip them"). This file comes last. A Live build (web/config.js noTest) keeps no test
   hooks: they are deleted here, the Test pill and the "Testing:" rows are never made (29_prices.js, 15_shop.js, 30_app_b.js). Main, the
   sandbox and every test script have no noTest, so they keep it all, and ROOMS's and QA's scripts run as before.
   NOT on this list because the game needs them: __qbTeam (26_world.js draws the team in rooms with it), __qbShift, __qbGuest, __qbBootErr,
   __qbLoad and __qbWeb. A new test hook goes on this list. rigtest/lead/striptest.js checks a Live build. */
(function(){if(!(window.QB_WEB&&QB_WEB.noTest))return;
  ["__qb","__qbLoft","__qbRooms","__qbStory","__qbFriends","__qbDrops","__qbDungeon","__qbEcon","__qbBounty","__qbTown","__qbUnlock","__qbPlaza","__qbLive","__qbFreedReq"].forEach(function(k){try{delete window[k]}catch(e){}})})();
