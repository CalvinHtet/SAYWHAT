/* Bumping QB_EPOCH wipes EVERY player's save on their next load. Never bump it once other people play. See docs/RELEASING.md.
   Skip a week moves the whole game's clock by __qbShift. */
/* Cal, 2026-11-09 (v0.86): "I want to start over from scratch ... initalize everyone's save file": 5 to 6. Each old save is
   copied to data/users/<id>/backup_e5 when its player first opens this version (30_app_b.js). */
var QB_EPOCH=7;
/* w-ui92: the clock's shift lives here (QBSHIFT). A Live build (QB_WEB.noTest) keeps it at 0 and has no window.__qbShift: nothing there can move the game's clock. Every other build keeps window.__qbShift as the test handle (Skip ahead one week, the Test pill, QA's scripts), read and written through to QBSHIFT. The save's tshift field stays (qbShift() is written to it; on Live that is 0). */
var QBSHIFT=0,QBLIVE=!!(window.QB_WEB&&window.QB_WEB.noTest);
function qbShift(){return QBSHIFT}
function qbSetShift(v){QBSHIFT=QBLIVE?0:(+v||0)}
if(!QBLIVE)try{Object.defineProperty(window,"__qbShift",{get:function(){return QBSHIFT},set:qbSetShift,configurable:true})}catch(e){}
(function(){var R=window.Date;class D extends R{constructor(...a){if(a.length)super(...a);else super(R.now()+QBSHIFT)}static now(){return R.now()+QBSHIFT}}window.Date=D})();
