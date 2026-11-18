/* ---------- v1.17: pieces gone for good (Cal, 2026-11-17, via ROOMS) ----------
   Cal: "Get rid of all durags and anything that could be misinterpreted as cultural appropriation. We are all asian who play this so
   stuff like a durag, or african clothing, or stuff that makes you look like a ghetto mexican, or very asian cultural clothing is
   offensive." ROOMS's list (every Shop row checked by name, line and icon): OVERPASS's durag and paisley bandana, and SMOKE BOMB's
   ninja-costume pieces. Unlike the audit's cut (ZXCUT, 29zx_simple.js: off sale, owners keep wearing), these are gone for everyone:
   off sale everywhere (the cut flag), not drawn and not in any Wardrobe even for an owner, and an owner gets the piece's price back
   once (S.goneRef). v1.18 also held SMOKE BOMB and cut its ninja pieces; v1.19 undoes that (Cal: "The ninja ones are cool."). */
/* v1.19: Cal (via ROOMS): "The ninja ones are cool." SMOKE BOMB's 12 are back (V17BACK below); the durag and bandana stay gone */
var V17GONE=["gx_o_durag","gx_o_bandana"];
var V17BACK=["gx_smk_band","gx_smk_wrap","gx_smk_cowl","gx_smk_tape","gx_smk_pouch","gx_smk_mesh","gx_smk_cargo","gx_smk_hakama",
  "gx_smk_shorts","gx_smk_sandal","gx_smk_tabi","gx_smk_runner"];
SHOP.forEach(function(it){if(it&&it[6]&&V17GONE.indexOf(it[0])>=0){it[6].cut=1;it[6].gone=1}});
var v17Fits=itemFits;itemFits=function(it){if(it&&it[6]&&it[6].gone)return false;return v17Fits.apply(this,arguments)};
var v17Groups=qsGroups;qsGroups=function(pick){return v17Groups.call(this,function(x){if(x&&x[6]&&x[6].gone)return false;return pick(x)})};
/* the refund: once per piece, at its price today; it comes off the character too */
function v17Refund(){try{if(!loaded||!S||!S.created||!S.owned)return;var got=0,n=0;S.goneRef=S.goneRef||{};
    V17GONE.forEach(function(id){if(!S.owned[id]||S.goneRef[id])return;var it=shopItem(id);var c=it?(+it[3]||0):0;S.goneRef[id]=c||1;delete S.owned[id];
      if(S.eq)Object.keys(S.eq).forEach(function(sl){if(S.eq[sl]===id)delete S.eq[sl]});S.coins+=c;got+=c;n++});
    if(n){persist();render();pop("Retired "+n+" piece"+(n>1?"s":"")+" from the Shop: +"+got.toLocaleString()+" coins back")}}catch(e){}}
setInterval(v17Refund,5000);
/* v1.18 took SMOKE BOMB's 12 from their owners with a refund; v1.19 gives each one back to its Wardrobe and takes that refund back
   (never below 0 coins). Once per piece: its S.goneRef entry goes. Not put back on, as v1.18 did not record what was worn. */
function v17Back(){try{if(!loaded||!S||!S.created||!S.goneRef)return;var n=0,c=0;
    V17BACK.forEach(function(id){var r=S.goneRef[id];if(!r)return;S.owned=S.owned||{};S.owned[id]=true;var k=Math.min(Math.max(0,S.coins||0),r>1?r:0);S.coins-=k;c+=k;delete S.goneRef[id];n++});
    if(n){persist();render();pop(n+" SMOKE BOMB piece"+(n>1?"s are":" is")+" back in your Wardrobe"+(c?" (-"+c.toLocaleString()+" coins, the refund)":""))}}catch(e){}}
setInterval(v17Back,5000);
/* SMOKE BOMB: held until its new pieces are in; no "ninja anime" under its name */
/* v1.19: no hold any more (it began and ended 11-17, so no drop slot ever skipped it) and its own subtitle again */
