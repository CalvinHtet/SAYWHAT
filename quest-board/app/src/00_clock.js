/* Bumping QB_EPOCH wipes EVERY player's save on their next load. Never bump it once other people play. See docs/RELEASING.md.
   Skip a week moves the whole game's clock by __qbShift. */
/* Cal, 2026-11-09 (v0.86): "I want to start over from scratch ... initalize everyone's save file": 5 to 6. Each old save is
   copied to data/users/<id>/backup_e5 when its player first opens this version (30_app_b.js). */
var QB_EPOCH=6;window.__qbShift=0;
(function(){var R=window.Date;class D extends R{constructor(...a){if(a.length)super(...a);else super(R.now()+(window.__qbShift||0))}static now(){return R.now()+(window.__qbShift||0)}}window.Date=D})();
