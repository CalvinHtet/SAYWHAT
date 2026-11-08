/* Bumping QB_EPOCH wipes EVERY player's save on their next load. Never bump it once other people play. See docs/RELEASING.md.
   Skip a week moves the whole game's clock by __qbShift. */
var QB_EPOCH=3;window.__qbShift=0;
(function(){var R=window.Date;class D extends R{constructor(...a){if(a.length)super(...a);else super(R.now()+(window.__qbShift||0))}static now(){return R.now()+(window.__qbShift||0)}}window.Date=D})();
